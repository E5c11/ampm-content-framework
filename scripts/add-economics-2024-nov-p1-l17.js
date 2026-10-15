#!/usr/bin/env node
/**
 * DBE Economics P1 — November 2024 — Question 3.5: Challenges to industrial development (order 17)
 * Lesson 17 of 2024 Nov P1 (DESIGN-UNI-14: 3 practice questions). Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2024-nov-p1-l17.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2024-nov-p1-l17.js --dry-run
 *   node scripts/add-economics-2024-nov-p1-l17.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

// ─── Phase 2 — lesson document ───────────────────────────────────────────────

// ─── Phase 2 — lesson document ───────────────────────────────────────────────

const video = {
  "name": "Question 3.5: Challenges to industrial development",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2024,
  "paper": "nov_p1",
  "order": 17,
  "content_tier": "free",
  "has_video": false,
  "xp": 8,
  "tags": [
    "industrial_development",
    "industrial_strategy"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p1/q17/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p1/q17/memo_1.png"
  ],
  "exam_question_marks": 8,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Scheduled power cuts force factories to stop production for several hours a day. Which challenge to industrial development is this?",
    "metadata": [
      "Too many skilled workers",
      "Energy constraints",
      "Low interest rates on loans",
      "Over-supply of capital",
      ""
    ],
    "answer": [
      "Energy constraints",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "growth_and_development",
    "topic": "industrial_policy",
    "subtopic": "econ_classification",
    "skills": [
      "classify_economic_concept"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Identify the resource the factories lack while production stops."
  },
  {
    "name": "Question 2",
    "question": "Select ALL the challenges South Africa faces in promoting industrial development.",
    "metadata": [
      "A surplus of skilled engineers",
      "Skills shortages and mismatches",
      "Unreliable transport and water infrastructure",
      "Limited access to capital for small businesses",
      "Cheap and reliable energy for all firms"
    ],
    "answer": [
      "Skills shortages and mismatches",
      "Unreliable transport and water infrastructure",
      "Limited access to capital for small businesses",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "growth_and_development",
    "topic": "industrial_policy",
    "subtopic": "econ_classification",
    "skills": [
      "classify_economic_concept"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- A challenge is something that holds industries back.\n- Reject any option that describes an advantage."
  },
  {
    "name": "Question 3",
    "question": "Match each challenge to its effect on industrial development.",
    "metadata": [
      "A - Burdensome regulations",
      "B - Industrial strikes",
      "C - Trade barriers in other countries",
      "1 - Production is disrupted and stability suffers",
      "2 - Export volumes of local industries are limited",
      "3 - Investment is discouraged and new businesses are held back"
    ],
    "answer": [
      "A-3",
      "B-1",
      "C-2"
    ],
    "presentation": "match",
    "type": "application",
    "unit": "growth_and_development",
    "topic": "industrial_policy",
    "subtopic": "econ_classification",
    "skills": [
      "classify_economic_concept"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Ask whether the challenge acts inside the country, between workers and firms, or abroad."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "3.5",
      "marks": 8,
      "clues": "- Group your points: skills, infrastructure, regulation, capital, energy, labour and trade.",
      "approach": "- Four developed challenges of 2 marks each; at most 2 marks for listing.",
      "solution": "1. Skills shortages hinder industries that need specialised knowledge.\n2. Unreliable infrastructure raises production costs and disrupts supply.\n3. Burdensome regulation discourages investment, and limited access to capital delays investment by small businesses.\n4. Energy constraints, labour disputes and global trade barriers reduce productivity and exports.\n5. Any other correct relevant response is accepted."
    }
  ],
  "model": "claude-sonnet-5-5",
  "generated_at": Date.now(),
  "version": 2,
  "reviewed": false,
  "input_tokens": 0,
  "output_tokens": 0,
  "avg_rating": null,
  "rating_count": null
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

  // Exam gate (VER-02/VER-04/VER-09): derive the exam minimum from the rows now in the database and write it. Dev only; no-op at the floor.
  if (!DRY_RUN && ENV === 'dev') {
    const { applyExamGates } = require('../tools/lib/exam-gate');
    await applyExamGates(pool, { env: ENV, apply: true, filter: { subject: video.subject, syllabus: video.syllabus, year: String(video.year) } });
  } else if (DRY_RUN) {
    console.log('   (dry-run: the exam gate is derived and written after a real upload — node tools/apply-exam-gate.js shows it)');
  }
}

if (require.main === module) {
  upload()
    .catch((err) => {
      console.error('\n❌ Upload failed:', err.message);
      process.exitCode = 1;
    })
    .finally(closePool);
}
