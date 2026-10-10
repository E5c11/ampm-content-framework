#!/usr/bin/env node
/**
 * DBE Mathematics P2 — November 2024 — Question 1 (order 1)
 * Statistics — least squares regression, correlation coefficient, prediction, mean and the effect of a shift on the standard deviation.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-maths-2024-nov-p2-q1.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-maths-2024-nov-p2-q1.js --dry-run
 *   node scripts/add-maths-2024-nov-p2-q1.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

const IMG = 'https://media-dev.askmoreprepmore.app/exam_papers/dbe/maths/2024/nov_p2';

// ─── Phase 2 — lesson document ───────────────────────────────────────────────

const video = {
  name: 'Question 1',
  syllabus: 'dbe',
  subject: 'maths',
  year: 2024,
  paper: 'nov_p2',
  order: 1,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['regression_line', 'least_squares', 'correlation_coefficient', 'standard_deviation'],
  question_image_urls: [`${IMG}/q1/question_1.png`],
  memo_image_urls: [`${IMG}/q1/memo_1.png`],
  exam_question_marks: 10,
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
    question: 'A scatter plot shows points that lie close to a straight line sloping downwards from left to right. Which value is most likely the correlation coefficient r?',
    metadata: ['0.91', '−0.12', '−0.48', '−0.93', ''],
    answer: ['−0.93', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'definition',
    unit: 'statistics',
    topic: 'regression',
    subtopic: 'correlation_coefficient',
    skills: ['interpreting_correlation_coefficient', 'negative_correlation', 'strength_of_relationship'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2024,
    paper: 'nov_p2',
    clues: '- The direction of the slope tells you the sign of r.\n- Points lying close to the line give a value of r near 1 or −1.',
  },
  {
    name: 'Question 2',
    question: 'The least squares regression line for the number of hours a learner spends on social media per week (x) and their test mark (y) is ŷ = 54.2 − 0.73x. Predict the test mark of a learner who spends 38 hours per week on social media. Give the answer correct to TWO decimal places.',
    metadata: ['ŷ = ', '[ ]'],
    answer: ['26.46', '', '', '', ''],
    presentation: 'fitb',
    keyboard_type: 'standard_math',
    type: 'application',
    unit: 'statistics',
    topic: 'regression',
    subtopic: 'prediction',
    skills: ['substitution_into_regression_line', 'linear_prediction'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2024,
    paper: 'nov_p2',
    clues: '- Replace x in the regression equation by the number of hours.\n- Multiply first, then subtract from the intercept.',
  },
  {
    name: 'Question 3',
    question: 'At the end of a reading challenge, every learner in a class read exactly 7 more pages per day than at the start. Select ALL the statements that are true for the new data compared with the original data.',
    metadata: [
      'The mean increases by 7',
      'The standard deviation increases by 7',
      'The standard deviation stays the same',
      'The range stays the same',
      'The mean stays the same',
    ],
    answer: ['The mean increases by 7', 'The standard deviation stays the same', 'The range stays the same', '', ''],
    presentation: 'multi_select',
    type: 'definition',
    unit: 'statistics',
    topic: 'data_handling',
    subtopic: 'standard_deviation',
    skills: ['effect_of_adding_constant', 'calculating_standard_deviation'],
    difficulty: 2,
    exam_weight: 1,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2024,
    paper: 'nov_p2',
    clues: '- Adding the same number to every value moves the whole data set along the number line.\n- Measures of spread depend only on how far the values are from each other.',
  },
  {
    name: 'Question 4',
    question: 'A teacher uses the least squares regression line ŷ = 31 − 0.5x as the minimum target for each learner. Four learners have the data points (10 ; 20), (16 ; 25), (22 ; 12) and (30 ; 16). What is the largest increase in y that any one of these learners needs to reach the target?',
    metadata: ['Increase = ', '[ ]'],
    answer: ['8', '', '', '', ''],
    presentation: 'fitb',
    keyboard_type: 'standard_math',
    type: 'application',
    unit: 'statistics',
    topic: 'regression',
    subtopic: 'prediction',
    skills: ['vertical_distance', 'substitution_into_regression_line'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2024,
    paper: 'nov_p2',
    clues: '- For each x-value, find the y-value on the line and compare it with the actual y-value.\n- Only points below the line need an increase.',
  },
];

// ─── AI explanation (one entry per real exam sub-question — AIEXP-08) ────────

const aiExplanation = {
  sub_questions: [
    {
      number: '1.1',
      marks: 3,
      clues: '- Enter the 15 pairs of data into the regression mode of your calculator.\n- Read off a and b and substitute them into ŷ = a + bx.',
      approach: '- Put the weights in the x-list and the push-ups in the y-list.\n- Run the linear regression (A + Bx) and read off a and b.\n- Write the equation with a and b rounded to two decimal places.',
      solution: '1. a = 39.456…\n2. b = −0.590…\n3. ∴ ŷ = 39.46 − 0.59x',
    },
    {
      number: '1.2',
      marks: 1,
      clues: '- The correlation coefficient r is shown in the same regression mode.',
      approach: '- Read r off the calculator after entering the data.\n- Round it sensibly.',
      solution: '1. r ≈ −0.80',
    },
    {
      number: '1.3',
      marks: 2,
      clues: '- Substitute x = 29 into the regression equation from 1.1.',
      approach: '- The target is the y-value on the regression line.\n- Replace x by 29 and evaluate.',
      solution: '1. ŷ = 39.46 − 0.59(29)\n2. ŷ = 22.35\n3. ∴ the target is about 22 push-ups',
    },
    {
      number: '1.4',
      marks: 1,
      clues: '- Use the statistics mode of your calculator, or add the push-ups and divide by 15.',
      approach: '- The mean of y is the sum of the push-ups divided by the number of players.',
      solution: '1. Sum of push-ups = 275\n2. ȳ = 275 ÷ 15\n3. ∴ ȳ = 18.33',
    },
    {
      number: '1.5',
      marks: 1,
      clues: '- Every value increases by the same amount.\n- Think about whether the distances from the mean change.',
      approach: '- Adding 5 to every value also adds 5 to the mean.\n- Each deviation (x − x̄) stays the same, so the spread does not change.',
      solution: '1. Every value and the mean increase by 5\n2. The deviations from the mean are unchanged\n3. ∴ there is no influence: the standard deviation stays the same',
    },
    {
      number: '1.6',
      marks: 2,
      clues: '- Find the point that lies furthest below the regression line.\n- Calculate the y-value on the line for that weight and subtract.',
      approach: '- From the scatter plot, the point (40 ; 6) is furthest below the line.\n- The target for a 40 kg player is the line value at x = 40.\n- The increase needed is the difference.',
      solution: '1. ŷ = 39.46 − 0.59(40) = 15.86 ≈ 16\n2. Increase = 16 − 6\n3. ∴ the maximum increase is 10 push-ups',
    },
  ],
  model: 'claude-opus-5-5',
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
