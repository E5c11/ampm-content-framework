#!/usr/bin/env node
/**
 * DBE Mathematics P1 — November 2025 — Question 5 (order 5)
 * Parabola and hyperbola: maximum value / range, domain of a hyperbola,
 * finding a parabola's equation from turning point + point, gradient of a tangent.
 *
 *   node tools/validate-questions.js --script scripts/add-maths-2025-nov-p1-q5.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-maths-2025-nov-p1-q5.js --dry-run
 *   node scripts/add-maths-2025-nov-p1-q5.js
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
  name: 'Question 5',
  syllabus: 'dbe',
  subject: 'maths',
  year: 2025,
  paper: 'nov_p1',
  order: 5,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['parabola', 'hyperbola', 'turning_point', 'graph_interpretation'],
  question_image_urls: [`${IMG}/q5/question_1.png`],
  memo_image_urls: [`${IMG}/q5/memo_1.png`, `${IMG}/q5/memo_2.png`],
  exam_question_marks: 18,
  supplementary_materials: [
    { type: 'formula_sheet', label: 'Formula Sheet', image_urls: [`${IMG}/q0/question_1.png`] },
  ],
};

const questions = [
  {
    name: 'Question 1',
    question: 'The parabola f(x) = −2(x − 1)² + 7 has a maximum turning point. Write down the maximum value of f.',
    metadata: ['maximum value = ', '[ ]'],
    answer: ['7', '', '', '', ''],
    presentation: 'fitb',
    type: 'calc',
    unit: 'functions_graphs',
    topic: 'parabola',
    subtopic: 'range',
    skills: ['turning_point', 'range_of_parabola', 'effect_of_coefficient'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2025,
    paper: 'nov_p1',
    clues: '- The equation is already in turning-point form y = a(x − p)² + q.\n- Since a < 0 the graph has a maximum, and that maximum value is q.',
  },
  {
    name: 'Question 2',
    question: 'Write down the domain of g(x) = \\frac{5}{x + 2} − 3.',
    metadata: ['x ≠ 3', 'x ∈ ℝ, x ≠ −2', 'x ≠ −3', 'x > −2', ''],
    answer: ['x ∈ ℝ, x ≠ −2', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'calc',
    unit: 'functions_graphs',
    topic: 'hyperbola',
    subtopic: 'graph_interpretation',
    skills: ['asymptote_gives_p', 'effect_of_coefficient'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2025,
    paper: 'nov_p1',
    clues: '- The function is undefined where the denominator is zero.\n- Exclude that x-value; every other real number is allowed.',
  },
  {
    name: 'Question 3',
    question: 'A parabola has turning point (2 ; −3) and passes through the point (4 ; 5). These steps find its equation, but are in the wrong order. Arrange them correctly.',
    metadata: [
      'Substitute (4 ; 5): 5 = a(4 − 2)² − 3',
      'Write y = a(x − 2)² − 3 using the turning point',
      'Expand to y = 2x² − 8x + 5',
      'Solve for a: a = 2',
    ],
    answer: [
      'Write y = a(x − 2)² − 3 using the turning point',
      'Substitute (4 ; 5): 5 = a(4 − 2)² − 3',
      'Solve for a: a = 2',
      'Expand to y = 2x² − 8x + 5',
    ],
    presentation: 'ordering',
    type: 'calc',
    unit: 'functions_graphs',
    topic: 'parabola',
    subtopic: 'finding_equation',
    skills: ['turning_point', 'substituting_known_point', 'substitution_into_equation'],
    difficulty: 3,
    exam_weight: 3,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2025,
    paper: 'nov_p1',
    clues: '- Start from turning-point form y = a(x − p)² + q using the given turning point.\n- Substitute the other point to solve for a, then expand into the standard form.',
  },
  {
    name: 'Question 4',
    question: 'Determine the gradient of the tangent to f(x) = x² − 4x + 1 at the point where x = 3.',
    metadata: ['gradient = ', '[ ]'],
    answer: ['2', '', '', '', ''],
    presentation: 'fitb',
    type: 'calc',
    unit: 'functions_graphs',
    topic: 'parabola',
    subtopic: 'tangent_and_lines',
    skills: ['derivative_as_gradient', 'evaluating_derivatives', 'power_rule'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2025,
    paper: 'nov_p1',
    clues: '- The gradient of the tangent at a point is the value of the derivative there.\n- Differentiate f, then substitute x = 3.',
  },
];

const aiExplanation = {
  sub_questions: [
    {
      number: '5.1',
      marks: 1,
      clues: '- g is a hyperbola of the form \\frac{a}{x − p} + q.\n- The function is undefined where the denominator is zero.',
      approach: '- Identify the vertical asymptote from x − 3 = 0.\n- The domain is all real numbers except that value.',
      solution: '1. x − 3 = 0 at x = 3 (vertical asymptote)\n2. ∴ domain: x ∈ ℝ, x ≠ 3',
    },
    {
      number: '5.2',
      marks: 1,
      clues: '- P is the turning point of f and lies on the horizontal asymptote of g.\n- The horizontal asymptote of g is y = 8, and f has a maximum.',
      approach: '- The asymptotes of g intersect at (3 ; 8), which is P.\n- Since f opens downwards, 8 is its maximum value.\n- The range is all y-values at or below the maximum.',
      solution: '1. P = (3 ; 8) is the maximum turning point of f\n2. ∴ range of f: y ≤ 8',
    },
    {
      number: '5.3.1',
      marks: 2,
      clues: '- g(x) ≤ f(x) where the hyperbola is on or below the parabola.\n- Use the intersection point D and the asymptote of g to read off the interval.',
      approach: '- The graphs meet at D(5 ; 6).\n- To the left, g lies below f only once past its vertical asymptote x = 3.\n- Read the interval between x = 3 and x = 5 from the sketch.',
      solution: '1. Graphs intersect at x = 5; g is undefined at x = 3\n2. Between these, g lies below f\n3. ∴ 3 < x ≤ 5',
    },
    {
      number: '5.3.2',
      marks: 2,
      clues: '- f(x) < 6 below the horizontal line y = 6.\n- f = 6 at x = 5 (point D) and, by symmetry about x = 3, also at x = 1.',
      approach: '- Find where f(x) = 6. One solution is x = 5 (D).\n- The axis of symmetry of f is x = 3, so the other solution is x = 1.\n- f is below 6 outside the interval [1 ; 5].',
      solution: '1. f(x) = 6 at x = 5 and, by symmetry about x = 3, at x = 1\n2. f opens downwards, so f < 6 outside these x-values\n3. ∴ x < 1  or  x > 5',
    },
    {
      number: '5.4',
      marks: 3,
      clues: '- Use turning-point form y = a(x − 3)² + 8 with P(3 ; 8).\n- Substitute D(5 ; 6) to find a, then expand.',
      approach: '- Write y = a(x − 3)² + 8.\n- Substitute (5 ; 6): 6 = a(2)² + 8.\n- Solve for a, then expand to standard form.',
      solution: '1. y = a(x − 3)² + 8\n2. 6 = a(5 − 3)² + 8 ⟹ −2 = 4a ⟹ a = −\\frac{1}{2}\n3. y = −\\frac{1}{2}(x² − 6x + 9) + 8\n4. ∴ f(x) = −\\frac{1}{2}x² + 3x + \\frac{7}{2}',
    },
    {
      number: '5.5',
      marks: 6,
      clues: '- M is the x-intercept of f; solve f(x) = 0.\n- T is the x-intercept of g; solve g(x) = 0. Then MT is the difference of the x-coordinates.',
      approach: '- Set f(x) = 0: −\\frac{1}{2}x² + 3x + \\frac{7}{2} = 0, i.e. x² − 6x − 7 = 0.\n- Factorise to get the x-intercepts; M is the negative one.\n- Set g(x) = 0 and solve for T.\n- MT = x_T − x_M.',
      solution: '1. f(x) = 0: x² − 6x − 7 = 0 ⟹ (x − 7)(x + 1) = 0\n2. x = −1 or x = 7, so M(−1 ; 0)\n3. g(x) = 0: 0 = \\frac{−4}{x − 3} + 8 ⟹ −8x + 24 = −4 ⟹ x = \\frac{7}{2}\n4. T(\\frac{7}{2} ; 0)\n5. MT = \\frac{7}{2} − (−1) = \\frac{9}{2} = 4.5',
    },
    {
      number: '5.6',
      marks: 3,
      clues: '- The gradient of the tangent at D is f\u2032(5).\n- Use point D(5 ; 6) and that gradient in y − y₁ = m(x − x₁).',
      approach: '- Differentiate f(x) = −\\frac{1}{2}x² + 3x + \\frac{7}{2}.\n- Evaluate f\u2032(5) to get the gradient.\n- Substitute the gradient and D(5 ; 6) to find the equation.',
      solution: '1. f\u2032(x) = −x + 3\n2. m = f\u2032(5) = −5 + 3 = −2\n3. 6 = −2(5) + c ⟹ c = 16\n4. ∴ y = −2x + 16',
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
