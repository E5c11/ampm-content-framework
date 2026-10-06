#!/usr/bin/env node
/**
 * DBE Mathematics P2 — November 2025 — Question 1 (order 1)
 * Statistics — regression and correlation: equation of the least squares regression line from the
 * calculator output, prediction, validity via the correlation coefficient, interpreting the gradient.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-maths-2025-nov-p2-q1.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-maths-2025-nov-p2-q1.js --dry-run
 *   node scripts/add-maths-2025-nov-p2-q1.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

const IMG = 'https://media-dev.askmoreprepmore.app/exam_papers/dbe/maths/2025/nov_p2';

// ─── Phase 2 — lesson document ───────────────────────────────────────────────

const video = {
  name: 'Question 1',
  syllabus: 'dbe',
  subject: 'maths',
  year: 2025,
  paper: 'nov_p2',
  order: 1,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['regression_line', 'least_squares', 'correlation_coefficient', 'prediction'],
  question_image_urls: [`${IMG}/q1/question_1.png`],
  memo_image_urls: [`${IMG}/q1/memo_1.png`],
  exam_question_marks: 8,
  supplementary_materials: [
    {
      type: 'formula_sheet',
      label: 'Formula Sheet',
      image_urls: [`${IMG}/q0/question_1.png`],
    },
  ],
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    name: 'Question 1',
    question: 'A least squares regression line has intercept 52.3 and gradient −3.7. Write down its equation in the form y = a + bx, with a and b substituted and a negative gradient written with a minus sign.',
    metadata: ['Equation: ', '[ ]'],
    answer: ['y=52.3-3.7x|y=-3.7x+52.3', '', '', '', ''],
    presentation: 'fitb',
    keyboard_type: 'scientific_math',
    type: 'calc',
    unit: 'statistics',
    topic: 'regression',
    subtopic: 'prediction',
    skills: ['substitution_into_regression_line', 'linear_prediction'],
    difficulty: 2,
    exam_weight: 3,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2025,
    paper: 'nov_p2',
    clues: '- The line has the general form y = a + bx, where a is the intercept and b is the gradient.\n- Substitute both values, keeping the sign of the gradient.',
  },
  {
    name: 'Question 2',
    question: 'A dealer models the price of a used scooter by ŷ = 41200 − 2850x, where x is the age in years and ŷ is the price in rand. Predict the price of a 6-year-old scooter, in rand.',
    metadata: ['R', '[ ]'],
    answer: ['24100', '', '', '', ''],
    presentation: 'fitb',
    keyboard_type: 'standard_math',
    type: 'application',
    unit: 'statistics',
    topic: 'regression',
    subtopic: 'prediction',
    skills: ['substitution_into_regression_line', 'linear_prediction'],
    difficulty: 2,
    exam_weight: 3,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Replace x in the regression equation by the age of the scooter.\n- Multiply first, then subtract from the intercept.',
  },
  {
    name: 'Question 3',
    question: 'The charge (in %) of a phone battery after x hours of use is modelled by ŷ = 96 − 8.4x, with correlation coefficient r = −0.98. Which statement is correct?',
    metadata: [
      'The charge rises by about 8.4 percentage points per hour and the correlation is strong.',
      'The charge falls by about 8.4 percentage points per hour but the weak correlation makes predictions unreliable.',
      'The charge falls by about 8.4 percentage points per hour and the strong correlation makes predictions valid.',
      'The charge falls by about 0.98 percentage points per hour and the correlation is weak.',
      '',
    ],
    answer: [
      'The charge falls by about 8.4 percentage points per hour and the strong correlation makes predictions valid.',
      '',
      '',
      '',
      '',
    ],
    presentation: 'multiple_choice',
    type: 'definition',
    unit: 'statistics',
    topic: 'regression',
    subtopic: 'interpretation',
    skills: [
      'interpreting_gradient_of_regression_line',
      'interpreting_correlation_coefficient',
      'strength_of_relationship',
    ],
    difficulty: 3,
    exam_weight: 3,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2025,
    paper: 'nov_p2',
    clues: '- The sign of the gradient tells you whether the quantity rises or falls as x increases.\n- A correlation coefficient close to 1 or −1 means the points lie close to the line.',
  },
  {
    name: 'Question 4',
    question: 'Arrange these steps for predicting a value from paired data and judging whether the prediction can be trusted.',
    metadata: [
      'Compare the size of r with 1 to decide whether the prediction is valid',
      'Enter the paired data in the regression mode of the calculator',
      'Substitute the given x-value into ŷ = a + bx',
      'Read off a, b and the correlation coefficient r',
    ],
    answer: [
      'Enter the paired data in the regression mode of the calculator',
      'Read off a, b and the correlation coefficient r',
      'Substitute the given x-value into ŷ = a + bx',
      'Compare the size of r with 1 to decide whether the prediction is valid',
    ],
    presentation: 'ordering',
    type: 'calc',
    unit: 'statistics',
    topic: 'regression',
    subtopic: 'correlation_coefficient',
    skills: ['logical_sequence', 'strength_of_relationship'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2025,
    paper: 'nov_p2',
    clues: '- The coefficients must be known before any prediction can be made.\n- Whether to trust the prediction is the last thing you can decide.',
  },
];

// ─── AI explanation (one entry per real exam sub-question — AIEXP-08) ────────

const aiExplanation = {
  sub_questions: [
    {
      number: '1.1',
      marks: 3,
      clues: '- Enter the 11 pairs into the regression mode of your calculator.\n- Read off the intercept a and the gradient b, then write them into ŷ = a + bx.',
      approach: '- Put the age in years in the x-list and the selling price in the y-list.\n- Run the linear regression and note a (intercept) and b (gradient).\n- Substitute both into ŷ = a + bx, keeping the negative sign of b.',
      solution: '1. a = 331 397.20\n2. b = −22 988.32\n3. ∴ ŷ = 331 397.20 − 22 988.32x',
    },
    {
      number: '1.2',
      marks: 2,
      clues: '- Replace x in the equation from 1.1 by the age of the car.\n- Work with the unrounded values if your calculator stores them.',
      approach: '- The car is 5 years old, so x = 5.\n- Substitute x = 5 into ŷ = 331 397.20 − 22 988.32x.\n- Evaluate and state the price in rands.',
      solution: '1. ŷ = 331 397.20 − 22 988.32(5)\n2. ŷ = 216 455.60\n3. ∴ the predicted price is about R216 456',
    },
    {
      number: '1.3',
      marks: 2,
      clues: '- Look at the correlation coefficient r from your calculator.\n- Decide how close it is to −1 or 1 and what that says about the points.',
      approach: '- Read r off the calculator.\n- A value close to −1 means a strong negative linear relationship.\n- Strongly correlated points lie close to the regression line, so the prediction can be trusted.',
      solution: '1. r ≈ −0.95\n2. This is close to −1, so the correlation is strong\n3. The points lie close to the regression line\n4. ∴ the prediction is valid',
    },
    {
      number: '1.4',
      marks: 1,
      clues: '- The gradient of the regression line is the change in price for every extra year of age.\n- Think about what its sign means in this context.',
      approach: '- Take the gradient b from 1.1.\n- A negative gradient means the price falls as the car gets older.\n- State the size of the fall per year.',
      solution: '1. b = −22 988.32\n2. The negative sign shows a decrease\n3. ∴ the average decrease per year is about R22 988.32',
    },
  ],
  model: 'claude-sonnet-5-5',
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

  // Exam gate (VER-02/VER-04, tools/apply-exam-gate.js): derive the exam's minimum app version from the rows now in the
  // database and write it to exam_versions, bumping updated_at on the exam's rows. Dev only; a no-op when the derived
  // minimum is the floor (VER-07); idempotent. The gate is per EXAM, so it also gates the sibling papers.
  if (!DRY_RUN && ENV === 'dev') {
    const { applyExamGates } = require('../tools/lib/exam-gate');
    await applyExamGates(pool, { env: ENV, apply: true, filter: { subject: video.subject, syllabus: video.syllabus, year: String(video.year) } });
  } else if (DRY_RUN) {
    console.log('   (dry-run: the exam gate is derived and written after a real upload — node tools/apply-exam-gate.js shows it)');
  }
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
