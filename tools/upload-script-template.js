#!/usr/bin/env node
/**
 * Upload-script template — pipeline Phase 4 (AMPM-CONTENT-PIPELINE), Postgres edition.
 *
 * Copy to add-<subject>-<year>-<paper>-q<N>.js, fill the three data blocks, then:
 *   1. node tools/validate-questions.js --script <this file> [--curriculum temp/curriculum-vocab.json]
 *      — HARD STOP: do not upload until it exits 0 (PIPE-10).
 *   2. cloud-sql-proxy ampm-b9661:us-central1:ampm-backend --port 15432   (in another shell)
 *   3. node <this file> [--dry-run]      — upserts into DEV Cloud SQL only (PIPE-11).
 *
 * Writes: lessons (+ lesson_tags, lesson_supplementary_materials,
 * lesson_ai_explanation_sub_questions), questions (+ question_skills). Rows carry
 * deterministic UUIDs (tools/lib/uuid.js) so re-running this script upserts, never
 * duplicates. Content is written published (is_published = true).
 *
 * Reference rows (curriculum_nodes, skills, tags, …) must already exist — the preflight
 * check below fails loudly listing any that don't. Create them first:
 *   node tools/create-curriculum-node.js …   node tools/create-skill.js …   (Phase 4)
 */

'use strict';

const { getPool, closePool } = require('./lib/postgres');
const { upsertRow } = require('./lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('./lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

// ─── Phase 2 data — the lesson/video document ────────────────────────────────
// Full field template: subject profile + core/upload-pipeline.md reference tables.

const video = {
  // name, syllabus, subject, year, paper, order, xp, tags, content_tier, …
};

// ─── Phase 3 data — the practice questions ───────────────────────────────────
// Per core/question-schema.md + presentations/{type}.md. Logical/authored shape
// (presentation, type, order, unit/topic/subtopic, skills, …) — the mapping to
// Postgres columns is tools/lib/content-rows.js's job.

const questions = [
  // { name, question, metadata, answer, presentation, type, unit, topic, subtopic,
  //   skills, difficulty, exam_weight, xp, order, syllabus, subject, year, paper }
];

// ─── AI explanation (generated in the session, AMPM-CONTENT-AI-EXP) ──────────

const aiExplanation = {
  sub_questions: [
    // { number, marks, clues, approach, solution }  — one per exam sub-question / EN question
  ],
  model: 'CHANGE_ME',
  generated_at: Date.now(),
  version: 2,
  reviewed: false,
  input_tokens: 0,
  output_tokens: 0,
  avg_rating: null,
  rating_count: null,
};

// ─── Upload ──────────────────────────────────────────────────────────────────

async function preflightReferenceIds(pool) {
  const used = referenceIdsUsed(video, questions);
  const missing = [];
  for (const [table, ids] of Object.entries(used)) {
    if (ids.length === 0) continue;
    const { rows } = await pool.query(`SELECT id FROM ${table} WHERE id = ANY($1)`, [ids]);
    const present = new Set(rows.map((r) => r.id));
    for (const id of ids) if (!present.has(id)) missing.push({ table, id });
  }
  if (missing.length > 0) {
    console.error('\n❌ Missing reference rows (create them before uploading — PIPE-08):');
    for (const m of missing) console.error(`   ${m.table}: ${m.id}`);
    console.error(
      '\n   curriculum_nodes / skills → node tools/create-curriculum-node.js | create-skill.js' +
      '\n   tags → node tools/create-tag.js',
    );
    process.exit(1);
  }
}

async function upload() {
  const { lessonId, rows } = buildContentRows(video, questions, aiExplanation);
  const pool = getPool(ENV);

  if (!DRY_RUN) await preflightReferenceIds(pool);

  const byTable = {};
  for (const spec of rows) {
    await upsertRow(spec, spec.row, { dryRun: DRY_RUN, env: ENV });
    byTable[spec.table] = (byTable[spec.table] ?? 0) + 1;
  }

  console.log(`\n${DRY_RUN ? '[dry-run] ' : ''}✅ lesson ${lessonId} (${ENV})`);
  for (const [t, n] of Object.entries(byTable)) console.log(`   ${t}: ${n}`);
}

// Only run when invoked directly — so validate-questions.js (and anything else) can load
// this file for its data blocks without opening a DB connection or writing anything.
if (require.main === module) {
  upload()
    .catch((err) => {
      console.error('\n❌ Upload failed:', err.message);
      process.exitCode = 1;
    })
    .finally(closePool);
}
