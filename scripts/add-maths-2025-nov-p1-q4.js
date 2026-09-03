#!/usr/bin/env node
/**
 * DBE Mathematics P1 — November 2025 — Question 4 (order 4)
 * Logarithmic function and its inverse: point on a graph / finding the base,
 * vertical shift and asymptote, finding an inverse, horizontal translation.
 *
 *   node tools/validate-questions.js --script scripts/add-maths-2025-nov-p1-q4.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-maths-2025-nov-p1-q4.js --dry-run
 *   node scripts/add-maths-2025-nov-p1-q4.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

const IMG = 'https://media-dev.askmoreprepmore.app/exam_papers/dbe/maths/2025/nov_p1';

const video = {
  name: 'Question 4',
  syllabus: 'dbe',
  subject: 'maths',
  year: 2025,
  paper: 'nov_p1',
  order: 4,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['logarithm', 'exponential', 'inverse_function', 'graph_interpretation'],
  question_image_urls: [`${IMG}/q4/question_1.png`],
  memo_image_urls: [`${IMG}/q4/memo_1.png`],
  exam_question_marks: 10,
  supplementary_materials: [
    { type: 'formula_sheet', label: 'Formula Sheet', image_urls: [`${IMG}/q0/question_1.png`] },
  ],
};

const questions = [
  {
    name: 'Question 1',
    question: 'The graph of f(x) = b^x passes through the point (3 ; 27), where b > 0. Determine the value of b.',
    metadata: ['b = ', '[ ]'],
    answer: ['3', '', '', '', ''],
    presentation: 'fitb',
    type: 'calc',
    unit: 'functions_graphs',
    topic: 'exponential',
    subtopic: 'finding_base',
    skills: ['exponential_base', 'solving_exponential', 'evaluating_at_point'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2025,
    paper: 'nov_p1',
    clues: '- Substitute the point into f(x) = b^x to get an equation in b.\n- Write both sides with the same base, or take the cube root, to solve for b.',
  },
  {
    name: 'Question 2',
    question: 'Write down the equation of the horizontal asymptote of g(x) = 4^x − 2.',
    metadata: ['y = 2', 'y = −2', 'x = −2', 'y = 4', ''],
    answer: ['y = −2', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'calc',
    unit: 'functions_graphs',
    topic: 'exponential',
    subtopic: 'graph_interpretation',
    skills: ['amplitude_and_vertical_shift', 'effect_of_coefficient'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2025,
    paper: 'nov_p1',
    clues: '- The basic graph y = 4^x has the asymptote y = 0.\n- A vertical shift moves the asymptote by the same amount.',
  },
  {
    name: 'Question 3',
    question: 'These steps determine the inverse of f(x) = log₃ x, but are in the wrong order. Arrange them correctly.',
    metadata: [
      'Swap x and y: x = log₃ y',
      'Write y = log₃ x',
      'State f⁻¹(x) = 3^x',
      'Rewrite in exponential form: y = 3^x',
    ],
    answer: [
      'Write y = log₃ x',
      'Swap x and y: x = log₃ y',
      'Rewrite in exponential form: y = 3^x',
      'State f⁻¹(x) = 3^x',
    ],
    presentation: 'ordering',
    type: 'calc',
    unit: 'functions_graphs',
    topic: 'logarithm',
    subtopic: 'inverse_function',
    skills: ['reflection_about_y_equals_x', 'log_as_inverse_of_exponential', 'logical_sequence'],
    difficulty: 3,
    exam_weight: 3,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2025,
    paper: 'nov_p1',
    clues: '- The inverse is found by interchanging x and y and making y the subject again.\n- A logarithmic equation is rewritten in exponential form to isolate y.',
  },
  {
    name: 'Question 4',
    question: 'The graph of f(x) = 2^x is translated 3 units to the right to form h. Determine the equation of h.',
    metadata: ['y = 2^x + 3', 'y = 2^(x − 3)', 'y = 2^(x + 3)', 'y = 2^x − 3', ''],
    answer: ['y = 2^(x − 3)', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'calc',
    unit: 'functions_graphs',
    topic: 'exponential',
    subtopic: 'graph_interpretation',
    skills: ['horizontal_shift', 'effect_of_coefficient'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2025,
    paper: 'nov_p1',
    clues: '- A shift to the right replaces x with (x − k) in the equation.\n- The base and any vertical position stay unchanged.',
  },
];

const aiExplanation = {
  sub_questions: [
    {
      number: '4.1',
      marks: 1,
      clues: '- The point (3 ; t) lies on f, so t = f(3).\n- Rewrite the logarithm as an exponential statement to evaluate it.',
      approach: '- Substitute x = 3 into f(x) = log with base \\frac{1}{3}.\n- t is the power to which \\frac{1}{3} must be raised to give 3.\n- Solve (\\frac{1}{3})ᵗ = 3.',
      solution: '1. t = f(3), so (\\frac{1}{3})ᵗ = 3\n2. 3⁻ᵗ = 3¹\n3. −t = 1\n4. ∴ t = −1',
    },
    {
      number: '4.2',
      marks: 1,
      clues: '- A is the x-intercept, so its y-coordinate is 0.\n- Solve f(x) = 0.',
      approach: '- Set log with base \\frac{1}{3} of x equal to 0.\n- Rewrite as (\\frac{1}{3})⁰ = x.\n- Any non-zero base to the power 0 is 1.',
      solution: '1. f(x) = 0 ⟹ log_(1/3) x = 0\n2. x = (\\frac{1}{3})⁰ = 1\n3. ∴ A(1 ; 0)',
    },
    {
      number: '4.3',
      marks: 2,
      clues: '- Interchange x and y, then make y the subject again.\n- A logarithm is undone by writing it in exponential form.',
      approach: '- Start from y = log_(1/3) x.\n- Swap x and y: x = log_(1/3) y.\n- Rewrite in exponential form: y = (\\frac{1}{3})ˣ.',
      solution: '1. y = log_(1/3) x\n2. Swap: x = log_(1/3) y\n3. y = (\\frac{1}{3})ˣ = 3⁻ˣ\n4. ∴ f⁻¹(x) = (\\frac{1}{3})ˣ',
    },
    {
      number: '4.4',
      marks: 1,
      clues: '- f⁻¹ is an exponential graph of the form y = (\\frac{1}{3})ˣ.\n- An exponential graph with no vertical shift has the asymptote y = 0.',
      approach: '- Recognise f⁻¹(x) = (\\frac{1}{3})ˣ as a standard exponential graph.\n- There is no added constant, so the horizontal asymptote is unchanged.',
      solution: '1. f⁻¹(x) = (\\frac{1}{3})ˣ has no vertical shift\n2. ∴ the asymptote is y = 0',
    },
    {
      number: '4.5',
      marks: 3,
      clues: '- f⁻¹ is a decreasing exponential graph.\n- Plot the y-intercept, the asymptote, and one extra point such as the image of A.',
      approach: '- The graph is y = (\\frac{1}{3})ˣ — decreasing, above the x-axis.\n- y-intercept: (0 ; 1).\n- Asymptote: y = 0.\n- One more point: reflecting A(1 ; 0) in y = x gives (0 ; 1); using x = −1 gives (−1 ; 3).',
      solution: '1. Shape: decreasing exponential lying above the x-axis\n2. y-intercept: (0 ; 1)\n3. Asymptote: y = 0\n4. Extra point: (−1 ; 3)',
    },
    {
      number: '4.6',
      marks: 2,
      clues: '- Translating 5 units right replaces x with (x − 5) in f⁻¹.\n- Find h at x = 4, then use the fact that h is decreasing for larger x.',
      approach: '- h(x) = (\\frac{1}{3})ˣ⁻⁵.\n- Evaluate h(4).\n- h decreases towards its asymptote y = 0 as x increases.\n- Combine the endpoint value and the limit for x > 4.',
      solution: '1. h(x) = (\\frac{1}{3})ˣ⁻⁵\n2. h(4) = (\\frac{1}{3})⁻¹ = 3\n3. h is decreasing and h → 0 as x → ∞\n4. ∴ for x > 4:  0 < y < 3',
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
