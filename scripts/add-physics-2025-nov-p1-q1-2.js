#!/usr/bin/env node
/**
 * DBE Physical Sciences: Physics P1 — November 2025 — Question 1.2 (order 2)
 * Motion graphs: constant velocity vs. free fall.
 *
 * One of 10 subsection lessons — see add-physics-2025-nov-p1-q1-1.js header note.
 *
 *   node tools/validate-questions.js --script scripts/add-physics-2025-nov-p1-q1-2.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-physics-2025-nov-p1-q1-2.js --dry-run
 *   node scripts/add-physics-2025-nov-p1-q1-2.js
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
  name: 'Question 1.2',
  syllabus: 'dbe',
  subject: 'physics',
  year: 2025,
  paper: 'nov_p1',
  order: 2,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['free_fall', 'velocity_time_graphs'],
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

const questions = [
  {
    name: 'Question 1',
    question:
      'A ball is thrown vertically upward from ground level and returns to the ground. Ignore air resistance. Which ONE of the following statements about the ball’s acceleration during its flight is correct?',
    metadata: [
      'It is zero at the highest point of the flight.',
      'It is constant in magnitude and direction throughout the flight.',
      'It increases as the ball rises and decreases as it falls.',
      'It is zero throughout the flight.',
      '',
    ],
    answer: ['It is constant in magnitude and direction throughout the flight.', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'mechanics',
    topic: 'motion_1d',
    subtopic: 'velocity_time_graphs',
    skills: ['constant_acceleration', 'free_fall', 'projectile_symmetry'],
    difficulty: 3,
    exam_weight: 3,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p1',
    clues:
      '- Ignoring air resistance, only one force acts on the ball for its entire flight.\n- Think about what that force is, and whether it ever switches off — even for an instant.',
  },
  {
    name: 'Question 2',
    question:
      'A stone is dropped from rest from the top of a cliff. Ignore air resistance. Calculate the magnitude of its velocity after falling for 2 s.',
    metadata: ['v = ', '[ ]', ' m·s⁻¹'],
    answer: ['19.6', '', '', '', ''],
    presentation: 'fitb',
    type: 'calc',
    unit: 'mechanics',
    topic: 'motion_1d',
    subtopic: 'velocity_time_graphs',
    skills: ['free_fall', 'kinematics_equations', 'velocity_time_relationship'],
    difficulty: 2,
    exam_weight: 3,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p1',
    clues: '- The stone starts from rest, so vᵢ = 0.\n- Use v_f = vᵢ + aΔt with a = g = 9.8 m·s⁻².',
  },
];

const aiExplanation = {
  sub_questions: [
    {
      number: '1.2',
      marks: 2,
      clues: '- At the instant of release, the stone has the same velocity as the balloon.\n- After release, only gravity acts on the stone, so its velocity changes at a constant rate.',
      approach: '- Identify the stone’s initial velocity — it must equal the balloon’s velocity at the moment of release.\n- Determine the sign and constancy of the stone’s acceleration after release (gravity only).\n- Match the graph showing the stone’s line starting at the balloon’s line, then decreasing linearly through and past zero.',
      solution: '1. At release, the stone’s velocity equals the balloon’s velocity — the two lines must meet at that instant.\n2. After release, the only force on the stone is gravity, so a = −g (constant).\n3. The stone’s velocity therefore decreases linearly from the balloon’s velocity, becoming negative as it falls.\n4. Graph B shows exactly this: the stone’s line starts where the balloon’s line is, then slopes down at a constant negative gradient.\n5. The correct answer is B.',
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
