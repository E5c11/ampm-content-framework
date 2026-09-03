#!/usr/bin/env node
/**
 * DBE Mathematics P1 — November 2025 — Question 9 (order 9)
 * Cubic graphs and calculus: turning point, concavity, stationary points,
 * x-intercepts of a cubic.
 *
 *   node tools/validate-questions.js --script scripts/add-maths-2025-nov-p1-q9.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-maths-2025-nov-p1-q9.js --dry-run
 *   node scripts/add-maths-2025-nov-p1-q9.js
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
  name: 'Question 9',
  syllabus: 'dbe',
  subject: 'maths',
  year: 2025,
  paper: 'nov_p1',
  order: 9,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['cubic_analysis', 'stationary_point', 'second_derivative', 'x_intercepts'],
  question_image_urls: [`${IMG}/q9/question_1.png`],
  memo_image_urls: [`${IMG}/q9/memo_1.png`, `${IMG}/q9/memo_2.png`],
  exam_question_marks: 17,
  supplementary_materials: [
    { type: 'formula_sheet', label: 'Formula Sheet', image_urls: [`${IMG}/q0/question_1.png`] },
  ],
};

const questions = [
  {
    name: 'Question 1',
    question: 'The graph of f(x) = x³ − 3x² − 9x + 5 has a local minimum turning point. Determine the y-coordinate of that turning point.',
    metadata: ['y = ', '[ ]'],
    answer: ['−22', '', '', '', ''],
    presentation: 'fitb',
    type: 'calc',
    unit: 'calculus',
    topic: 'cubic_analysis',
    subtopic: 'stationary_points',
    skills: ['setting_derivative_to_zero', 'stationary_point_definition', 'evaluating_at_point'],
    difficulty: 3,
    exam_weight: 3,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2025,
    paper: 'nov_p1',
    clues: '- Solve f\u2032(x) = 0 to find the x-coordinates of the turning points.\n- The minimum is where f\u2033(x) > 0; substitute that x into f to get the y-coordinate.',
  },
  {
    name: 'Question 2',
    question: 'For which values of x is f(x) = x³ − 3x² − 9x + 5 concave down?',
    metadata: ['x > 1', 'x < 1', '−1 < x < 3', 'x < −1', ''],
    answer: ['x < 1', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'calc',
    unit: 'calculus',
    topic: 'cubic_analysis',
    subtopic: 'inequality_involving_derivative',
    skills: ['second_derivative', 'inequality_sign_analysis'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2025,
    paper: 'nov_p1',
    clues: '- A graph is concave down where f\u2033(x) < 0.\n- Find f\u2033(x) and solve the inequality.',
  },
  {
    name: 'Question 3',
    question: 'These steps find the x-coordinates of the stationary points of f(x) = x³ − 6x² + 9x − 2, but are in the wrong order. Arrange them correctly.',
    metadata: [
      'Factorise: 3(x − 1)(x − 3) = 0',
      'Differentiate: f\u2032(x) = 3x² − 12x + 9',
      'x = 1 or x = 3',
      'Set f\u2032(x) = 0',
    ],
    answer: [
      'Differentiate: f\u2032(x) = 3x² − 12x + 9',
      'Set f\u2032(x) = 0',
      'Factorise: 3(x − 1)(x − 3) = 0',
      'x = 1 or x = 3',
    ],
    presentation: 'ordering',
    type: 'calc',
    unit: 'calculus',
    topic: 'cubic_analysis',
    subtopic: 'stationary_points',
    skills: ['setting_derivative_to_zero', 'factorizing_trinomials', 'stationary_point_definition'],
    difficulty: 2,
    exam_weight: 3,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2025,
    paper: 'nov_p1',
    clues: '- Stationary points occur where the first derivative is zero.\n- Differentiate, set equal to zero, factorise and solve.',
  },
  {
    name: 'Question 4',
    question: 'x = 2 is an x-intercept of f(x) = x³ − 7x² + 14x − 8. Determine the largest of the other two x-intercepts.',
    metadata: ['largest other x-intercept = ', '[ ]'],
    answer: ['4', '', '', '', ''],
    presentation: 'fitb',
    type: 'calc',
    unit: 'calculus',
    topic: 'cubic_analysis',
    subtopic: 'x_intercepts',
    skills: ['factorizing_cubic', 'finding_roots', 'solving_quadratic'],
    difficulty: 3,
    exam_weight: 3,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2025,
    paper: 'nov_p1',
    clues: '- Since x = 2 is a root, (x − 2) is a factor — divide it out.\n- Factorise the remaining quadratic and read off the other roots.',
  },
];

const aiExplanation = {
  sub_questions: [
    {
      number: '9.1',
      marks: 4,
      clues: '- E is a turning point, so f\u2032(x) = 0 there.\n- Solve for x, choose the value corresponding to the minimum, then substitute into f for the y-coordinate.',
      approach: '- Differentiate: f\u2032(x) = 3x² − 16x + 5.\n- Solve f\u2032(x) = 0 by factorising.\n- E is the right-hand (minimum) turning point, at x = 5.\n- Substitute x = 5 into f(x).',
      solution: '1. f\u2032(x) = 3x² − 16x + 5 = 0\n2. (3x − 1)(x − 5) = 0 ⟹ x = \\frac{1}{3} or x = 5\n3. E is at x = 5\n4. f(5) = 125 − 200 + 25 + 14 = −36\n5. ∴ E(5 ; −36)',
    },
    {
      number: '9.2',
      marks: 3,
      clues: '- f is concave down where f\u2033(x) < 0.\n- Find f\u2033(x) and solve the inequality.',
      approach: '- Differentiate twice: f\u2033(x) = 6x − 16.\n- Set f\u2033(x) < 0.\n- Solve for x.',
      solution: '1. f\u2033(x) = 6x − 16\n2. 6x − 16 < 0\n3. ∴ x < \\frac{8}{3}',
    },
    {
      number: '9.3',
      marks: 4,
      clues: '- Use the x-intercepts of f (−1, 2 and 7) to know where f is positive or negative.\n- f\u2033(x) < 0 for x < \\frac{8}{3}; combine the two sign conditions so the product is negative.',
      approach: '- x-intercepts of f are −1, 2 and 7.\n- f\u2033(x) < 0 when x < \\frac{8}{3}.\n- The product f(x)·f\u2033(x) is negative where the two factors have opposite signs; read the intervals from the graph.',
      solution: '1. x-intercepts of f: (−1 ; 0) and (7 ; 0) (with B at (2 ; 0))\n2. f\u2033(x) < 0 for x < \\frac{8}{3}\n3. f(x)·f\u2033(x) < 0 where the signs are opposite\n4. ∴ −1 < x < 2  or  \\frac{8}{3} < x < 7',
    },
    {
      number: '9.4',
      marks: 6,
      clues: '- A line meets the cubic at 3 distinct points when it lies strictly between the two turning-point values of the "shifted" function.\n- Set f(x) = −11x + t, form a cubic in x, and use the condition for three real roots via the turning points.',
      approach: '- Set x³ − 8x² + 5x + 14 = −11x + t.\n- The line is parallel to a tangent of gradient −11: solve f\u2032(x) = −11 to find the touching x-values.\n- Evaluate t at each of these x-values.\n- Three distinct intersections occur for t strictly between these two values.',
      solution: '1. f\u2032(x) = 3x² − 16x + 5 = −11 ⟹ 3x² − 16x + 16 = 0\n2. (x − 4)(3x − 4) = 0 ⟹ x = 4 or x = \\frac{4}{3}\n3. At x = 4: t = (4)³ − 8(4)² + 16(4) + 14 = 14\n4. At x = \\frac{4}{3}: t = \\frac{634}{27} ≈ 23.48\n5. ∴ 14 < t < \\frac{634}{27}',
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
