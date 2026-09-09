#!/usr/bin/env node
/**
 * DBE Physical Sciences: Physics P1 — November 2025 — Question 1.1 (order 1)
 * Newton's second law: net force / acceleration relationship.
 *
 * One of 10 subsection lessons replacing the original bundled "Question 1" video
 * (see subjects/dbe-physics.md's ledger, 2026-09-10 correction — Q1's ten MCQ items
 * are topically independent, unlike Maths's coherent Q1 sub-parts, so each gets its
 * own lesson, matching Geography's "one video per numbered subsection" convention).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-physics-2025-nov-p1-q1-1.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-physics-2025-nov-p1-q1-1.js --dry-run
 *   node scripts/add-physics-2025-nov-p1-q1-1.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

const PAPER = 'https://media-dev.askmoreprepmore.app/exam_papers/dbe/physics/2025/nov_p1';

// ─── Phase 2 — lesson document ───────────────────────────────────────────────

const video = {
  name: 'Question 1.1',
  syllabus: 'dbe',
  subject: 'physics',
  year: 2025,
  paper: 'nov_p1',
  order: 1,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['newtons_second_law'],
  question_image_urls: [`${PAPER}/q1/question_1.png`],
  memo_image_urls: [`${PAPER}/q1/memo_1.png`],
  exam_question_marks: 2,
  supplementary_materials: [
    {
      type: 'formula_sheet',
      label: 'Formula Sheet',
      image_urls: [`${PAPER}/q0/question_1.png`, `${PAPER}/q0/question_2.png`, `${PAPER}/q0/question_3.png`],
    },
  ],
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    name: 'Question 1',
    question:
      'A trolley experiences a single unbalanced horizontal force that varies in magnitude over time but never changes direction. Which statement about the trolley’s acceleration is always true?',
    metadata: [
      'The acceleration is zero.',
      'The acceleration is in the same direction as the net force, and its magnitude changes with the net force.',
      'The acceleration is opposite in direction to the net force.',
      'The acceleration is constant, regardless of the net force’s magnitude.',
      '',
    ],
    answer: [
      'The acceleration is in the same direction as the net force, and its magnitude changes with the net force.',
      '', '', '', '',
    ],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'mechanics',
    topic: 'newtons_laws',
    subtopic: 'net_force_acceleration',
    skills: ['newtons_second_law', 'net_force', 'acceleration_direction'],
    difficulty: 2,
    exam_weight: 3,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p1',
    clues:
      '- Consider what Newton’s second law says about the relationship between net force and acceleration.\n- The direction of acceleration always follows the direction of the net force, whatever its magnitude.',
  },
  {
    name: 'Question 2',
    question:
      'A net force of 12 N acts on an object, giving it an acceleration of 3 m·s⁻². Calculate the mass of the object.',
    metadata: ['m = ', '[ ]', ' kg'],
    answer: ['4', '', '', '', ''],
    presentation: 'fitb',
    type: 'calc',
    unit: 'mechanics',
    topic: 'newtons_laws',
    subtopic: 'net_force_acceleration',
    skills: ['newtons_second_law', 'mass_acceleration_relationship'],
    difficulty: 1,
    exam_weight: 3,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p1',
    clues: '- Use Newton’s second law, F_net = ma.\n- Rearrange to make mass the subject before substituting.',
  },
];

// ─── AI explanation (AMPM-CONTENT-AI-EXP) — one entry per exam sub-question ───

const aiExplanation = {
  sub_questions: [
    {
      number: '1.1',
      marks: 2,
      clues: '- Recall Newton’s second law: F_net = ma.\n- Think about what direction acceleration must point in relative to the net force.',
      approach: '- Consider each option against Newton’s second law.\n- Eliminate options that describe motion rather than the force-acceleration relationship.\n- Confirm that net force and acceleration are always in the same direction, whatever the object’s state of motion.',
      solution: '1. Newton’s second law states F_net = ma.\n2. Mass m is always positive, so acceleration a must point in the same direction as F_net.\n3. This holds regardless of the object’s direction of motion — eliminates A.\n4. The correct answer is B.',
    },
  ],
  model: 'claude-sonnet-5',
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

if (require.main === module) {
  upload()
    .catch((err) => {
      console.error('\n❌ Upload failed:', err.message);
      process.exitCode = 1;
    })
    .finally(closePool);
}
