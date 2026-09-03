#!/usr/bin/env node
/**
 * DBE Mathematics P1 — November 2025 — Question 8 (order 8)
 * Calculus rules: first principles, power rule, second derivative,
 * rewriting a surd as a power before differentiating.
 *
 *   node tools/validate-questions.js --script scripts/add-maths-2025-nov-p1-q8.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-maths-2025-nov-p1-q8.js --dry-run
 *   node scripts/add-maths-2025-nov-p1-q8.js
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
  name: 'Question 8',
  syllabus: 'dbe',
  subject: 'maths',
  year: 2025,
  paper: 'nov_p1',
  order: 8,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['first_principles', 'differentiation_rules', 'second_derivative', 'derivative_applications'],
  question_image_urls: [`${IMG}/q8/question_1.png`],
  memo_image_urls: [`${IMG}/q8/memo_1.png`],
  exam_question_marks: 10,
  supplementary_materials: [
    { type: 'formula_sheet', label: 'Formula Sheet', image_urls: [`${IMG}/q0/question_1.png`] },
  ],
};

const questions = [
  {
    name: 'Question 1',
    question: 'Determine f\u2032(x) from first principles for f(x) = 3x − 5, by completing the missing step.',
    metadata: [
      'f(x) = 3x − 5',
      'f(x + h) = 3(x + h) − 5 = 3x + 3h − 5',
      'f(x + h) − f(x) = 3h',
      'f\u2032(x) = lim(h→0) \\frac{3h}{h}',
      '[ ]',
    ],
    answer: ['3'],
    presentation: 'steps',
    type: 'calc',
    unit: 'calculus',
    topic: 'first_principles',
    subtopic: 'linear_function',
    skills: ['first_principles_definition', 'limit_simplification', 'substitution_h_x'],
    difficulty: 3,
    exam_weight: 3,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2025,
    paper: 'nov_p1',
    clues: '- After cancelling h, the limit no longer depends on h.\n- Substitute h = 0 into the simplified expression.',
  },
  {
    name: 'Question 2',
    question: 'Determine f\u2033(x), the second derivative, if f(x) = x⁴ − 2x³.',
    metadata: ['4x³ − 6x²', '12x² − 12x', '12x³ − 12x²', '12x² − 6x', ''],
    answer: ['12x² − 12x', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'calc',
    unit: 'calculus',
    topic: 'differentiation_rules',
    subtopic: 'second_derivative',
    skills: ['power_rule', 'second_derivative', 'higher_derivatives'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2025,
    paper: 'nov_p1',
    clues: '- Differentiate once to get f\u2032(x), then differentiate that result again.\n- Apply the power rule term by term each time.',
  },
  {
    name: 'Question 3',
    question: 'Given y = \\frac{x³ + 4x}{x}, determine the value of \\frac{dy}{dx} at x = 3.',
    metadata: ['The value of dy/dx at x = 3 is ', '[ ]'],
    answer: ['6', '', '', '', ''],
    presentation: 'fitb',
    type: 'calc',
    unit: 'calculus',
    topic: 'differentiation_rules',
    subtopic: 'power_rule',
    skills: ['algebraic_expression', 'power_rule', 'evaluating_derivatives'],
    difficulty: 3,
    exam_weight: 3,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2025,
    paper: 'nov_p1',
    clues: '- Simplify the quotient into a sum of power terms before differentiating.\n- Differentiate, then substitute x = 3.',
  },
  {
    name: 'Question 4',
    question: 'Rewrite \\frac{1}{\\sqrt{x}} in the form x^n so that the power rule can be applied.',
    metadata: ['x^(1/2)', 'x^(-1/2)', 'x^(-2)', 'x^2', ''],
    answer: ['x^(-1/2)', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'conversion',
    unit: 'calculus',
    topic: 'differentiation_rules',
    subtopic: 'power_rule_surds',
    skills: ['surd_to_exponent', 'algebraic_expression'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2025,
    paper: 'nov_p1',
    clues: '- A root becomes a fractional exponent; \\sqrt{x} = x^(1/2).\n- Dividing by a power negates its exponent.',
  },
];

const aiExplanation = {
  sub_questions: [
    {
      number: '8.1',
      marks: 4,
      clues: '- Use the definition f\u2032(x) = lim(h→0) \\frac{f(x + h) − f(x)}{h}.\n- Substitute, simplify the numerator, cancel h, then let h → 0.',
      approach: '- Write f(x + h) = −2(x + h) + 3.\n- Form f(x + h) − f(x) and simplify to −2h.\n- Divide by h.\n- Take the limit as h → 0.',
      solution: '1. f\u2032(x) = lim(h→0) \\frac{[−2(x + h) + 3] − (−2x + 3)}{h}\n2. = lim(h→0) \\frac{−2h}{h}\n3. = lim(h→0) (−2)\n4. ∴ f\u2032(x) = −2',
    },
    {
      number: '8.2.1',
      marks: 2,
      clues: '- Apply the power rule to each term.\n- The derivative of a term axⁿ is naxⁿ⁻¹.',
      approach: '- Differentiate −3x⁴ to get −12x³.\n- Differentiate 2x to get 2.\n- Add the results.',
      solution: '1. g(x) = −3x⁴ + 2x\n2. g\u2032(x) = −12x³ + 2',
    },
    {
      number: '8.2.2',
      marks: 4,
      clues: '- Split the fraction into separate terms and write each as a power of x.\n- Then differentiate term by term.',
      approach: '- Write y = \\frac{2x⁴}{x²} + \\frac{1}{x²} = 2x² + x⁻².\n- Differentiate 2x² to get 4x.\n- Differentiate x⁻² to get −2x⁻³.',
      solution: '1. y = \\frac{2x⁴ + 1}{x²} = 2x² + x⁻²\n2. \\frac{dy}{dx} = 4x + (−2)x⁻³\n3. ∴ \\frac{dy}{dx} = 4x − 2x⁻³',
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
