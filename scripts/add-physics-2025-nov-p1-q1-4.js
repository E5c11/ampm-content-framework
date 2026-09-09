#!/usr/bin/env node
/**
 * DBE Physical Sciences: Physics P1 — November 2025 — Question 1.4 (order 4)
 * Momentum: comparing objects of different mass with equal momentum.
 *
 * One of 10 subsection lessons — see add-physics-2025-nov-p1-q1-1.js header note.
 *
 *   node tools/validate-questions.js --script scripts/add-physics-2025-nov-p1-q1-4.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-physics-2025-nov-p1-q1-4.js --dry-run
 *   node scripts/add-physics-2025-nov-p1-q1-4.js
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

const video = {
  name: 'Question 1.4',
  syllabus: 'dbe',
  subject: 'physics',
  year: 2025,
  paper: 'nov_p1',
  order: 4,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['momentum'],
  question_image_urls: [`${PAPER}/q1/question_2.png`],
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

const questions = [
  {
    name: 'Question 1',
    question:
      'Two trolleys, A and B, have masses 3m and m respectively. Trolleys A and B have the same momentum. How does the velocity of A compare to the velocity of B?',
    metadata: [
      'A’s velocity is three times B’s velocity.',
      'A’s velocity is one third of B’s velocity.',
      'A’s velocity is equal to B’s velocity.',
      'A’s velocity is nine times B’s velocity.',
      '',
    ],
    answer: ['A’s velocity is one third of B’s velocity.', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'calc',
    unit: 'mechanics',
    topic: 'momentum_impulse',
    subtopic: 'momentum_comparison',
    skills: ['momentum', 'mass_velocity_relationship'],
    difficulty: 2,
    exam_weight: 3,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p1',
    clues:
      '- Write momentum as p = mv for each trolley, using their given masses.\n- Set the two momentum expressions equal to each other, since the trolleys have the same momentum.',
  },
  {
    name: 'Question 2',
    question: 'A ball of mass 0.5 kg moves at 6 m·s⁻¹. Calculate the magnitude of its momentum.',
    metadata: ['p = ', '[ ]', ' kg·m·s⁻¹'],
    answer: ['3', '', '', '', ''],
    presentation: 'fitb',
    type: 'calc',
    unit: 'mechanics',
    topic: 'momentum_impulse',
    subtopic: 'momentum_comparison',
    skills: ['momentum_calculation'],
    difficulty: 1,
    exam_weight: 3,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p1',
    clues: '- Momentum is mass multiplied by velocity, p = mv.\n- Both values are given directly — substitute and multiply.',
  },
];

const aiExplanation = {
  sub_questions: [
    {
      number: '1.4',
      marks: 2,
      clues: '- Write momentum as p = mv for each object, using their given masses.\n- Set the two momentum expressions equal, since the objects have the same momentum.',
      approach: '- Express the momentum of P and Q in terms of their masses and velocities.\n- Equate the two expressions since p_P = p_Q.\n- Solve for v_P in terms of v_Q.',
      solution: '1. p_P = m·v_P and p_Q = 2m·v_Q\n2. p_P = p_Q ⇒ m·v_P = 2m·v_Q\n3. v_P = 2v_Q\n4. The velocity of P is twice the velocity of Q — the correct answer is C.',
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
