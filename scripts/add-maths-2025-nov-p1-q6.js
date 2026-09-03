#!/usr/bin/env node
/**
 * DBE Mathematics P1 — November 2025 — Question 6 (order 6)
 * Hyperbola and straight line: vertical asymptote, finding a hyperbola's
 * equation from its asymptotes + a point, axis of symmetry, line through a point.
 *
 *   node tools/validate-questions.js --script scripts/add-maths-2025-nov-p1-q6.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-maths-2025-nov-p1-q6.js --dry-run
 *   node scripts/add-maths-2025-nov-p1-q6.js
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
  name: 'Question 6',
  syllabus: 'dbe',
  subject: 'maths',
  year: 2025,
  paper: 'nov_p1',
  order: 6,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['hyperbola', 'asymptote', 'equation_of_line', 'graph_interpretation'],
  question_image_urls: [`${IMG}/q6/question_1.png`],
  memo_image_urls: [`${IMG}/q6/memo_1.png`, `${IMG}/q6/memo_2.png`],
  exam_question_marks: 8,
  supplementary_materials: [
    { type: 'formula_sheet', label: 'Formula Sheet', image_urls: [`${IMG}/q0/question_1.png`] },
  ],
};

const questions = [
  {
    name: 'Question 1',
    question: 'Write down the equation of the vertical asymptote of f(x) = \\frac{3}{x − 4} + 2.',
    metadata: ['x = −4', 'x = 4', 'y = 4', 'x = 2', ''],
    answer: ['x = 4', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'calc',
    unit: 'functions_graphs',
    topic: 'hyperbola',
    subtopic: 'graph_interpretation',
    skills: ['asymptote_gives_p', 'effect_of_coefficient'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2025,
    paper: 'nov_p1',
    clues: '- The vertical asymptote occurs where the denominator is zero.\n- Solve x − 4 = 0.',
  },
  {
    name: 'Question 2',
    question: 'A hyperbola f(x) = \\frac{a}{x + p} + q has vertical asymptote x = 1, horizontal asymptote y = 3, and passes through (2 ; 5). These steps find a, but are in the wrong order. Arrange them correctly.',
    metadata: [
      'Substitute (2 ; 5): 5 = \\frac{a}{2 − 1} + 3',
      'From the asymptotes: p = −1 and q = 3',
      'Solve: a = 2',
      'Write f(x) = \\frac{a}{x − 1} + 3',
    ],
    answer: [
      'From the asymptotes: p = −1 and q = 3',
      'Write f(x) = \\frac{a}{x − 1} + 3',
      'Substitute (2 ; 5): 5 = \\frac{a}{2 − 1} + 3',
      'Solve: a = 2',
    ],
    presentation: 'ordering',
    type: 'calc',
    unit: 'functions_graphs',
    topic: 'hyperbola',
    subtopic: 'finding_equation',
    skills: ['asymptote_gives_p', 'substituting_known_point', 'substitution_into_equation'],
    difficulty: 3,
    exam_weight: 3,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2025,
    paper: 'nov_p1',
    clues: '- The asymptotes give p and q directly (x = −p and y = q).\n- Substitute the given point to solve for a.',
  },
  {
    name: 'Question 3',
    question: 'Determine an equation of an axis of symmetry of the hyperbola f(x) = \\frac{4}{x − 2} + 1 that has a positive gradient.',
    metadata: ['y = x + 1', 'y = x − 1', 'y = 2x − 1', 'y = x − 3', ''],
    answer: ['y = x − 1', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'calc',
    unit: 'functions_graphs',
    topic: 'hyperbola',
    subtopic: 'graph_interpretation',
    skills: ['axis_of_symmetry', 'asymptote_gives_p'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2025,
    paper: 'nov_p1',
    clues: '- An axis of symmetry passes through the point where the asymptotes cross.\n- With a positive gradient of 1, use y − q = 1(x − p) about that centre.',
  },
  {
    name: 'Question 4',
    question: 'The line g(x) = x + c passes through the point (−3 ; 0). Determine the value of c.',
    metadata: ['c = ', '[ ]'],
    answer: ['3', '', '', '', ''],
    presentation: 'fitb',
    type: 'calc',
    unit: 'analytical_geometry',
    topic: 'straight_lines',
    subtopic: 'equation_of_line',
    skills: ['substituting_known_point', 'equation_of_straight_line', 'effect_of_coefficient'],
    difficulty: 1,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2025,
    paper: 'nov_p1',
    clues: '- Substitute the coordinates of the point into g(x) = x + c.\n- Solve the resulting equation for c.',
  },
];

const aiExplanation = {
  sub_questions: [
    {
      number: '6.1',
      marks: 1,
      clues: '- The x-intercept of g is where g(x) = 0.\n- g and the vertical asymptote x = −p meet on the x-axis, so the x-intercept is at x = −p.',
      approach: '- The vertical asymptote of f is x = −p.\n- This line meets g on the x-axis, so g(−p) = 0.\n- Hence the x-intercept of g is (−p ; 0).',
      solution: '1. Vertical asymptote of f: x = −p\n2. g meets this line on the x-axis ⟹ x-intercept of g is at x = −p\n3. ∴ (−p ; 0)',
    },
    {
      number: '6.2',
      marks: 5,
      clues: '- g meets the horizontal asymptote y = q of f at x = 1, so q = g(1) = 1 + c.\n- Use the y-axis intersection (0 ; c) and the point at x = 3 to set up two equations and solve.',
      approach: '- From x = 1 on the horizontal asymptote: q = 1 + c, so f(x) = \\frac{a}{x + c} + 1 + c.\n- Both graphs pass through (0 ; c): substitute to get a = −c.\n- Both pass through (3 ; 3 + c): substitute to get a = 6 + 2c.\n- Solve the two expressions for a simultaneously.',
      solution: '1. q = g(1) = 1 + c, so f(x) = \\frac{a}{x + c} + 1 + c\n2. Point (0 ; c): c = \\frac{a}{0 + c} + 1 + c ⟹ a = −c\n3. Point (3 ; 3 + c): 3 + c = \\frac{a}{3 + c} + 1 + c ⟹ a = 6 + 2c\n4. −c = 6 + 2c ⟹ c = −2, so a = 2 and q = −1\n5. ∴ f(x) = \\frac{2}{x − 2} − 1',
    },
    {
      number: '6.3',
      marks: 2,
      clues: '- g has gradient 1; an axis of symmetry of f with gradient 1 passes through the centre (2 ; −1).\n- Compare g(x) = x − 2 with the required line y = x − 3.',
      approach: '- The centre of f is (2 ; −1).\n- The axis of symmetry with gradient 1 is y = x − 3.\n- g is y = x − 2; find the single translation that maps it onto y = x − 3.',
      solution: '1. g(x) = x − 2 (since c = −2)\n2. Axis of symmetry of f with gradient 1: y = (x − 2) + (−1) = x − 3\n3. y = x − 2 becomes y = x − 3 by moving 1 unit down (or 1 unit to the right)\n4. ∴ translate g 1 unit down',
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
