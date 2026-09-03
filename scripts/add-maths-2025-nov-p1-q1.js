#!/usr/bin/env node
/**
 * DBE Mathematics P1 — November 2025 — Question 1 (order 1)
 * Algebra & equations: factorised quadratic, quadratic formula, quadratic
 * inequality, exponential equation (quadratic in form), nested surd equation,
 * simultaneous linear + quadratic.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-maths-2025-nov-p1-q1.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-maths-2025-nov-p1-q1.js --dry-run
 *   node scripts/add-maths-2025-nov-p1-q1.js
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

// ─── Phase 2 — lesson document ───────────────────────────────────────────────

const video = {
  name: 'Question 1',
  syllabus: 'dbe',
  subject: 'maths',
  year: 2025,
  paper: 'nov_p1',
  order: 1,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['quadratic_formula', 'inequalities', 'exponential_equations', 'surds', 'simultaneous_equations'],
  question_image_urls: [`${IMG}/q1/question_1.png`],
  memo_image_urls: [`${IMG}/q1/memo_1.png`, `${IMG}/q1/memo_2.png`, `${IMG}/q1/memo_3.png`],
  exam_question_marks: 25,
  supplementary_materials: [
    { type: 'formula_sheet', label: 'Formula Sheet', image_urls: [`${IMG}/q0/question_1.png`] },
  ],
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    name: 'Question 1',
    question: 'Solve for x, correct to TWO decimal places, and write down the larger root: 2x² + 3x − 6 = 0',
    metadata: ['x = ', '[ ]'],
    answer: ['1.14', '', '', '', ''],
    presentation: 'fitb',
    type: 'calc',
    unit: 'algebra_equations',
    topic: 'quadratic',
    subtopic: 'quadratic_formula',
    skills: ['quadratic_formula', 'discriminant', 'rounding'],
    difficulty: 3,
    exam_weight: 3,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2025,
    paper: 'nov_p1',
    clues: '- Rewrite as ax² + bx + c = 0 and identify a, b and c.\n- Substitute into the quadratic formula, evaluate both roots, then state the larger one.',
  },
  {
    name: 'Question 2',
    question: 'Solve for x: 3x² ≤ 12x',
    metadata: ['x ≤ 0 or x ≥ 4', '0 ≤ x ≤ 4', '−4 ≤ x ≤ 0', 'x ≤ 4', ''],
    answer: ['0 ≤ x ≤ 4', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'calc',
    unit: 'algebra_equations',
    topic: 'inequalities',
    subtopic: 'quadratic_inequality',
    skills: ['solving_quadratic', 'critical_values', 'sign_analysis'],
    difficulty: 3,
    exam_weight: 3,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2025,
    paper: 'nov_p1',
    clues: '- Bring every term to one side so the expression is compared with 0, then factorise.\n- Use the critical values to split the number line into intervals and test the sign of the product in each.',
  },
  {
    name: 'Question 3',
    question: 'These steps solve the equation 3^(2x) − 10(3^x) + 9 = 0 but are in the wrong order. Arrange them in the correct order.',
    metadata: [
      'Solve 3^x = 1 and 3^x = 9',
      'Let k = 3^x, so k² − 10k + 9 = 0',
      'x = 0 or x = 2',
      'Factorise: (k − 1)(k − 9) = 0',
    ],
    answer: [
      'Let k = 3^x, so k² − 10k + 9 = 0',
      'Factorise: (k − 1)(k − 9) = 0',
      'Solve 3^x = 1 and 3^x = 9',
      'x = 0 or x = 2',
    ],
    presentation: 'ordering',
    type: 'calc',
    unit: 'functions_graphs',
    topic: 'exponential',
    subtopic: 'exponential_equations',
    skills: ['factorizing_exponential', 'same_base_exponents', 'solving_exponential'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2025,
    paper: 'nov_p1',
    clues: '- The equation is a quadratic in 3^x — a substitution turns it into an ordinary quadratic.\n- After solving for the substituted variable, convert back and use equal bases to finish.',
  },
  {
    name: 'Question 4',
    question: 'Solve simultaneously for x and y: y = x − 3 and x² + y² = 17',
    metadata: [
      'x = 2 and y = −1, or x = −3 and y = −6',
      'x = 4 and y = 1, or x = −1 and y = −4',
      'x = 4 and y = 7, or x = 1 and y = −2',
      'x = 1 and y = −2, or x = −4 and y = −7',
      '',
    ],
    answer: ['x = 4 and y = 1, or x = −1 and y = −4', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'calc',
    unit: 'algebra_equations',
    topic: 'simultaneous',
    subtopic: 'simultaneous_linear_quadratic',
    skills: ['substitution_method', 'solving_quadratic', 'paired_solutions'],
    difficulty: 3,
    exam_weight: 3,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2025,
    paper: 'nov_p1',
    clues: '- Substitute the linear equation into the second equation to get a single equation in x.\n- Solve the resulting quadratic, then pair each x-value with its y-value from the linear equation.',
  },
];

// ─── AI explanation (AMPM-CONTENT-AI-EXP) — one entry per exam sub-question ───

const aiExplanation = {
  sub_questions: [
    {
      number: '1.1.1',
      marks: 2,
      clues: '- The product of two factors equals zero, so apply the zero-product principle.\n- Set each bracket equal to zero and solve the two simple equations.',
      approach: '- Recognise the equation is already factorised.\n- Set each factor equal to zero.\n- Solve each resulting linear equation for x.',
      solution: '1. (x + 5)(x − 2) = 0\n2. x + 5 = 0  or  x − 2 = 0\n3. x = −5  or  x = 2',
    },
    {
      number: '1.1.2',
      marks: 4,
      clues: '- Write the equation in standard form ax² + bx + c = 0 first.\n- It does not factorise, so use the quadratic formula and round only at the final step.',
      approach: '- Rearrange to 5x² + 9x + 2 = 0.\n- Identify a = 5, b = 9, c = 2.\n- Substitute into the quadratic formula.\n- Evaluate both roots and round to two decimal places.',
      solution: '1. 5x² + 9x + 2 = 0\n2. x = \\frac{−9 ± \\sqrt{9² − 4(5)(2)}}{2(5)}\n3. x = \\frac{−9 ± \\sqrt{41}}{10}\n4. x = −0.26  or  x = −1.54',
    },
    {
      number: '1.1.3',
      marks: 4,
      clues: '- Move all terms to one side to compare with 0 — do not divide by x.\n- Factorise, find the critical values, then use a sign sketch or the parabola shape.',
      approach: '- Rewrite as 8x² − 2x > 0.\n- Factorise: 2x(4x − 1) > 0.\n- Critical values are x = 0 and x = \\frac{1}{4}.\n- The parabola opens upwards, so the expression is positive outside the roots.',
      solution: '1. 8x² − 2x > 0\n2. 2x(4x − 1) > 0\n3. Critical values: x = 0 and x = \\frac{1}{4}\n4. The parabola opens upwards, so 2x(4x − 1) > 0 outside the critical values.\n5. x < 0  or  x > \\frac{1}{4}',
    },
    {
      number: '1.1.4',
      marks: 4,
      clues: '- The equation is a quadratic in 2^x — a substitution makes this clear.\n- After solving for the substituted variable, rewrite each result with equal bases.',
      approach: '- Let k = 2^x, giving 2k² − 9k + 4 = 0.\n- Factorise: (2k − 1)(k − 4) = 0.\n- Solve for k, then replace k with 2^x.\n- Use equal bases to solve for x.',
      solution: '1. Let k = 2^x: 2k² − 9k + 4 = 0\n2. (2k − 1)(k − 4) = 0\n3. k = \\frac{1}{2}  or  k = 4\n4. 2^x = \\frac{1}{2} = 2⁻¹  or  2^x = 4 = 2²\n5. x = −1  or  x = 2',
    },
    {
      number: '1.1.5',
      marks: 5,
      clues: '- Square both sides, but only after isolating a single surd term.\n- A substitution such as k = \\frac{1}{\\sqrt{x}} keeps the algebra manageable; reject any root that cannot satisfy the original equation.',
      approach: '- Let k = \\frac{1}{\\sqrt{x}} so the equation becomes \\sqrt{k + 2} = k.\n- Square to get k + 2 = k², then solve the quadratic.\n- Substitute back and solve for x.\n- Check each solution and reject any that is invalid.',
      solution: '1. Let k = \\frac{1}{\\sqrt{x}}: \\sqrt{k + 2} = k\n2. k + 2 = k²\n3. k² − k − 2 = 0\n4. (k − 2)(k + 1) = 0\n5. k = 2  or  k = −1\n6. \\frac{1}{\\sqrt{x}} = 2  (reject k = −1, since \\frac{1}{\\sqrt{x}} > 0)\n7. \\sqrt{x} = \\frac{1}{2}, so x = \\frac{1}{4}',
    },
    {
      number: '1.2',
      marks: 6,
      clues: '- "x is the sum of 2 and y" gives a linear equation — write it and substitute.\n- Substituting into the second equation gives a quadratic in one variable; find both solution pairs.',
      approach: '- From "x is the sum of 2 and y": x = y + 2.\n- From "five times the product of x and y is 6 more than the square of x": 5xy = x² + 6.\n- Substitute x = y + 2 into the second equation.\n- Solve the quadratic in y, then find each matching x.',
      solution: '1. x = y + 2  ...(1)\n2. 5xy = x² + 6  ...(2)\n3. 5(y + 2)y = (y + 2)² + 6\n4. 5y² + 10y = y² + 4y + 4 + 6\n5. 4y² + 6y − 10 = 0\n6. 2y² + 3y − 5 = 0\n7. (2y + 5)(y − 1) = 0\n8. y = −\\frac{5}{2}  or  y = 1\n9. x = −\\frac{1}{2}  or  x = 3',
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
