#!/usr/bin/env node
/**
 * DBE Mathematics P1 — November 2024 — Question 1 (order 1)
 * Algebra: factorised and non-factorising quadratics, quadratic inequality, exponential equation, surd equation, simultaneous equations, telescoping product.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-maths-2024-nov-p1-q1.js --curriculum temp/curriculum-vocab-maths.json
 *   node scripts/add-maths-2024-nov-p1-q1.js --dry-run
 *   node scripts/add-maths-2024-nov-p1-q1.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

const IMG = 'https://media-dev.askmoreprepmore.app/exam_papers/dbe/maths/2024/nov_p1';

// ─── Phase 2 — lesson document ───────────────────────────────────────────────

const video = {
  name: 'Question 1',
  syllabus: 'dbe',
  subject: 'maths',
  year: 2024,
  paper: 'nov_p1',
  order: 1,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['quadratic_formula', 'inequalities', 'exponential_equations', 'surds', 'simultaneous_equations'],
  question_image_urls: [`${IMG}/q1/question_1.png`],
  memo_image_urls: [`${IMG}/q1/memo_1.png`, `${IMG}/q1/memo_2.png`],
  exam_question_marks: 27,
  supplementary_materials: [
    { type: 'formula_sheet', label: 'Formula Sheet', image_urls: [`${IMG}/q0/question_1.png`] },
  ],
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    name: 'Question 1',
    question: 'Solve for x, correct to TWO decimal places: 3x² + 1 = 7x. Give the larger root first.',
    metadata: ['x = ', '[ ]', ' or x = ', '[ ]'],
    answer: ['2.18', '0.15', '', '', ''],
    presentation: 'fitb',
    keyboard_type: 'standard_math',
    type: 'calc',
    unit: 'algebra_equations',
    topic: 'quadratic',
    subtopic: 'quadratic_formula',
    skills: ['quadratic_formula', 'rounding'],
    difficulty: 3,
    exam_weight: 3,
    xp: 10,
    order: 1,
    syllabus: 'dbe', subject: 'maths', year: 2024, paper: 'nov_p1',
    clues: '- Rearrange into the form ax² + bx + c = 0 before you identify a, b and c.\n- Substitute into the quadratic formula and round only at the final step.',
  },
  {
    name: 'Question 2',
    question: 'Solve for x: x² − 3x − 10 < 0. Write your answer in the form a < x < b.',
    metadata: ['Solution: ', '[ ]'],
    answer: ['-2<x<5', '', '', '', ''],
    presentation: 'fitb',
    keyboard_type: 'scientific_math',
    type: 'calc',
    unit: 'algebra_equations',
    topic: 'inequalities',
    subtopic: 'quadratic_inequality',
    skills: ['factorizing_trinomials', 'critical_values', 'sign_analysis'],
    difficulty: 3,
    exam_weight: 3,
    xp: 10,
    order: 2,
    syllabus: 'dbe', subject: 'maths', year: 2024, paper: 'nov_p1',
    clues: '- Factorise the quadratic expression and find the critical values.\n- Use the shape of the parabola to decide whether the expression is negative between or outside the critical values.',
  },
  {
    name: 'Question 3',
    question: 'These steps solve the equation 3^(2x) − 3^(x+1) − 54 = 0 but are in the wrong order. Arrange them in the correct order.',
    metadata: [
      '(k − 9)(k + 6) = 0',
      'x = 2',
      'Write 3^(x+1) as 3 · 3^x',
      '3^x = 9, and 3^x = −6 has no solution',
      'Let k = 3^x: k² − 3k − 54 = 0',
    ],
    answer: [
      'Write 3^(x+1) as 3 · 3^x',
      'Let k = 3^x: k² − 3k − 54 = 0',
      '(k − 9)(k + 6) = 0',
      '3^x = 9, and 3^x = −6 has no solution',
      'x = 2',
    ],
    presentation: 'ordering',
    type: 'calc',
    unit: 'functions_graphs',
    topic: 'exponential',
    subtopic: 'exponential_equations',
    skills: ['factorizing_exponential', 'same_base_exponents', 'solving_exponential'],
    difficulty: 3,
    exam_weight: 3,
    xp: 10,
    order: 3,
    syllabus: 'dbe', subject: 'maths', year: 2024, paper: 'nov_p1',
    clues: '- Use an exponent law to split the power with x + 1, so the equation becomes a quadratic in 3^x.\n- A power of 3 can never be negative.',
  },
  {
    name: 'Question 4',
    question: 'Solve for x: \\sqrt{x + 7} − x = 1',
    metadata: ['x = ', '[ ]'],
    answer: ['2', '', '', '', ''],
    presentation: 'fitb',
    keyboard_type: 'standard_math',
    type: 'calc',
    unit: 'algebra_equations',
    topic: 'surds',
    subtopic: 'surd_equations',
    skills: ['squaring_both_sides', 'solving_quadratic', 'solution_validation'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe', subject: 'maths', year: 2024, paper: 'nov_p1',
    clues: '- Isolate the square root on one side before you square both sides.\n- Test every solution in the original equation and reject any that does not satisfy it.',
  },
  {
    name: 'Question 5',
    question: 'Solve for x and y simultaneously: x − y = 1 and x² + xy = 6',
    metadata: [
      'x = 3, y = 2 or x = −2, y = −3',
      'x = −2, y = −3 or x = \\frac{3}{2}, y = \\frac{1}{2}',
      'x = 2, y = 1 or x = −\\frac{3}{2}, y = −\\frac{5}{2}',
      'x = 2, y = 3 or x = −\\frac{3}{2}, y = −\\frac{1}{2}',
      '',
    ],
    answer: ['x = 2, y = 1 or x = −\\frac{3}{2}, y = −\\frac{5}{2}', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'calc',
    unit: 'algebra_equations',
    topic: 'simultaneous',
    subtopic: 'simultaneous_linear_quadratic',
    skills: ['substitution_method', 'solving_quadratic', 'paired_solutions'],
    difficulty: 3,
    exam_weight: 3,
    xp: 10,
    order: 5,
    syllabus: 'dbe', subject: 'maths', year: 2024, paper: 'nov_p1',
    clues: '- Make one variable the subject of the linear equation and substitute it into the other equation.\n- Solve the resulting quadratic, then pair each root with its value of the other variable.',
  },
];

// ─── AI explanation (AMPM-CONTENT-AI-EXP) — one entry per exam sub-question ───

const aiExplanation = {
  sub_questions: [
    {
      number: '1.1.1',
      marks: 2,
      clues: '- A product equals zero only when one of its factors is zero.',
      approach: '- Set each factor equal to zero.\n- Solve the two simple equations.',
      solution: '1. x(x − 3) = 0\n2. x = 0 or x − 3 = 0\n3. x = 0 or x = 3',
    },
    {
      number: '1.1.2',
      marks: 4,
      clues: '- Write the equation in standard form first.\n- It does not factorise, so use the quadratic formula and round at the end.',
      approach: '- Rearrange to 2x² − 4x + 1 = 0.\n- Identify a = 2, b = −4 and c = 1.\n- Substitute into the quadratic formula and round both roots to two decimal places.',
      solution: '1. 2x² − 4x + 1 = 0\n2. x = [4 ± √((−4)² − 4(2)(1))] / (2 × 2)\n3. x = (4 ± √8) / 4\n4. x = 1.71 or x = 0.29',
    },
    {
      number: '1.1.3',
      marks: 4,
      clues: '- Factorise and find the critical values.\n- The parabola opens upwards, so think about where it lies above the x-axis.',
      approach: '- Factorise: (x − 3)(x + 1) > 0.\n- The critical values are x = 3 and x = −1.\n- An upward parabola is positive outside its roots.',
      solution: '1. x² − 2x − 3 > 0\n2. (x − 3)(x + 1) > 0\n3. Critical values: x = −1 and x = 3\n4. The parabola opens upwards, so the expression is positive outside the critical values.\n5. x < −1 or x > 3',
    },
    {
      number: '1.1.4',
      marks: 5,
      clues: '- Use an exponent law to write 2^(x+2) as 2² · 2^x.\n- The equation is then a quadratic in 2^x, so factorise it.',
      approach: '- Rewrite as 2^(2x) − 4 · 2^x − 32 = 0.\n- Factorise: (2^x − 8)(2^x + 4) = 0.\n- Solve 2^x = 8 and reject 2^x = −4, because a power of 2 is always positive.',
      solution: '1. 2^(2x) − 2² · 2^x − 32 = 0\n2. (2^x − 8)(2^x + 4) = 0\n3. 2^x = 8 or 2^x = −4\n4. 2^x = −4 has no solution\n5. 2^x = 2³, so x = 3',
    },
    {
      number: '1.1.5',
      marks: 4,
      clues: '- Isolate the square root before you square both sides.\n- Check every answer in the original equation.',
      approach: '- Rewrite as √(−2x + 4) = x + 2.\n- Square both sides and write the result in standard form.\n- Factorise, solve and reject any root that fails the original equation.',
      solution: '1. √(−2x + 4) = x + 2\n2. −2x + 4 = x² + 4x + 4\n3. x² + 6x = 0\n4. x(x + 6) = 0\n5. x = 0 or x = −6\n6. Check x = −6: √16 − (−6) = 10, not 2, so reject it.\n7. x = 0',
    },
    {
      number: '1.2',
      marks: 5,
      clues: '- Make y the subject of the linear equation.\n- Substitute into the second equation and solve the quadratic.',
      approach: '- From 2x + y = 3: y = 3 − 2x.\n- Substitute into y² + xy = 2.\n- Simplify to 2x² − 9x + 7 = 0 and factorise.\n- Find the y-value that goes with each x-value.',
      solution: '1. y = 3 − 2x\n2. (3 − 2x)² + x(3 − 2x) = 2\n3. 9 − 12x + 4x² + 3x − 2x² − 2 = 0\n4. 2x² − 9x + 7 = 0\n5. (2x − 7)(x − 1) = 0\n6. x = 7/2 or x = 1\n7. y = −4 or y = 1',
    },
    {
      number: '1.3',
      marks: 3,
      clues: '- Write each factor as a single fraction and look for cancelling.',
      approach: '- 1 + 1/n = (n + 1)/n, so the product is 3/2 × 4/3 × 5/4 × … × (n + 1)/n.\n- Each numerator cancels the next denominator, which leaves (n + 1)/2.\n- (n + 1)/2 is an integer when n + 1 is even.',
      solution: '1. Product = 3/2 × 4/3 × 5/4 × … × (n + 1)/n\n2. Product = (n + 1)/2\n3. This is an integer when n + 1 is divisible by 2.\n4. So n is any odd number greater than 2: n ∈ {3 ; 5 ; 7 ; …}',
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
