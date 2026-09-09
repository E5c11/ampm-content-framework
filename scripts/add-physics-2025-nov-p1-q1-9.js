#!/usr/bin/env node
/**
 * DBE Physical Sciences: Physics P1 — November 2025 — Question 1.9 (order 9)
 * Electrodynamics: the DC motor's commutator and current reversal.
 *
 * One of 10 subsection lessons — see add-physics-2025-nov-p1-q1-1.js header note.
 *
 *   node tools/validate-questions.js --script scripts/add-physics-2025-nov-p1-q1-9.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-physics-2025-nov-p1-q1-9.js --dry-run
 *   node scripts/add-physics-2025-nov-p1-q1-9.js
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
  name: 'Question 1.9',
  syllabus: 'dbe',
  subject: 'physics',
  year: 2025,
  paper: 'nov_p1',
  order: 9,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['dc_motor'],
  question_image_urls: [`${PAPER}/q1/question_4.png`],
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
      'In a DC motor, what would happen to the coil’s rotation if the split-ring commutator were replaced with two continuous slip rings (as used in an AC generator), with everything else unchanged?',
    metadata: [
      'The coil would rotate continuously in one direction, unaffected.',
      'The coil would rotate in one direction for half a turn, then oscillate back and forth rather than rotating continuously.',
      'The coil would stop rotating immediately.',
      'The coil would rotate at twice the speed.',
      '',
    ],
    answer: ['The coil would rotate in one direction for half a turn, then oscillate back and forth rather than rotating continuously.', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'electricity_magnetism',
    topic: 'electrodynamics',
    subtopic: 'dc_motor_commutator',
    skills: ['dc_motor', 'commutator_function', 'torque_direction'],
    difficulty: 4,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p1',
    clues:
      '- Without a commutator, the current direction in the coil never reverses as it rotates.\n- Think about what happens to the torque’s direction once the coil passes the vertical (no-current-reversal) point.',
  },
  {
    name: 'Question 2',
    question: 'A simple DC motor is running. The direction of the current supplied to it is reversed. What effect will this have on the direction of rotation of the coil?',
    metadata: [
      'It has no effect on the direction of rotation.',
      'It reverses the direction of rotation.',
      'It stops the coil immediately.',
      'It doubles the speed of rotation.',
      '',
    ],
    answer: ['It reverses the direction of rotation.', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'electricity_magnetism',
    topic: 'electrodynamics',
    subtopic: 'dc_motor_commutator',
    skills: ['dc_motor', 'current_reversal_effect'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p1',
    clues: '- The direction of the force/torque on a current-carrying coil in a magnetic field depends on the direction of the current.\n- Reversing the supply current reverses the current in the coil at every point in its rotation, not just for one instant.',
  },
];

const aiExplanation = {
  sub_questions: [
    {
      number: '1.9',
      marks: 2,
      clues: '- Think about what would happen to the direction of rotation if the current in the coil never changed direction as the coil turns.\n- The commutator’s job is to keep the torque acting in the same rotational sense every half-turn.',
      approach: '- Recall that a coil in a magnetic field experiences a torque that reverses direction every half-rotation if the current stays the same.\n- The commutator’s split-ring contacts reverse the current direction in the coil at the same points.\n- This reversal keeps the torque acting in a consistent rotational direction, so the coil keeps spinning the same way.',
      solution: '1. As the coil rotates, the torque on it would reverse direction every half-turn if the current direction stayed fixed.\n2. The commutator (split-ring) reverses the direction of current flow in the coil every half-rotation.\n3. This keeps the torque always acting to rotate the coil in the same direction.\n4. The correct answer is C: by reversing the direction of the current in the coil.',
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
