#!/usr/bin/env node
/**
 * DBE Mathematics P1 — November 2024 — Question 8 (order 8)
 * Differential calculus: power rule with roots, equation of a tangent, first principles, inverse of a restricted parabola.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-maths-2024-nov-p1-q8.js --curriculum temp/curriculum-vocab-maths.json
 *   node scripts/add-maths-2024-nov-p1-q8.js --dry-run
 *   node scripts/add-maths-2024-nov-p1-q8.js
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
  name: 'Question 8',
  syllabus: 'dbe',
  subject: 'maths',
  year: 2024,
  paper: 'nov_p1',
  order: 8,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['differentiation_rules', 'first_principles', 'tangent_line', 'inverse_function'],
  question_image_urls: [`${IMG}/q8/question_1.png`],
  memo_image_urls: [`${IMG}/q8/memo_1.png`, `${IMG}/q8/memo_2.png`],
  exam_question_marks: 18,
  supplementary_materials: [
    { type: 'formula_sheet', label: 'Formula Sheet', image_urls: [`${IMG}/q0/question_1.png`] },
  ],
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    name: 'Question 1',
    question: "Determine g'(x) if g(x) = \\frac{4}{x³} − \\sqrt{x³}",
    metadata: [
      '−12x^(−2) − \\frac{3}{2}x^(1/2)',
      '12x^(−4) − \\frac{2}{3}x^(1/2)',
      '−12x^(−4) − \\frac{3}{2}x^(1/2)',
      '−12x^(−4) − \\frac{3}{2}x^(5/2)',
      '',
    ],
    answer: ['−12x^(−4) − \\frac{3}{2}x^(1/2)', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'calc',
    unit: 'calculus',
    topic: 'differentiation_rules',
    subtopic: 'power_rule_surds',
    skills: ['surd_to_exponent', 'power_rule'],
    difficulty: 3,
    exam_weight: 3,
    xp: 10,
    order: 1,
    syllabus: 'dbe', subject: 'maths', year: 2024, paper: 'nov_p1',
    clues: '- Rewrite each term as a power of x before you differentiate.\n- Then apply the power rule to each term.',
  },
  {
    name: 'Question 2',
    question: 'Determine the equation of the tangent to f(x) = x³ − 2x² − 5x + 1 at x = 3. Write it in the form y = mx + c.',
    metadata: ['Equation: ', '[ ]'],
    answer: ['y=10x-35', '', '', '', ''],
    presentation: 'fitb',
    keyboard_type: 'scientific_math',
    type: 'calc',
    unit: 'calculus',
    topic: 'differentiation_rules',
    subtopic: 'equation_of_tangent',
    skills: ['tangent_equation', 'evaluating_derivatives'],
    difficulty: 3,
    exam_weight: 3,
    xp: 10,
    order: 2,
    syllabus: 'dbe', subject: 'maths', year: 2024, paper: 'nov_p1',
    clues: "- The gradient of the tangent is the value of f'(x) at the given x.\n- You also need the y-coordinate of the point of contact.",
  },
  {
    name: 'Question 3',
    question: "Complete the working to determine f'(x) from first principles if f(x) = 3x² − 2x. Write the final answer in the form ax + b.",
    metadata: [
      'f(x + h) = 3(x + h)² − 2(x + h) = 3x² + 6xh + 3h² − 2x − 2h',
      'f(x + h) − f(x) = 6xh + 3h² − 2h',
      "f'(x) = lim_{h→0} \\frac{h(6x + 3h − 2)}{h}",
      "f'(x) = lim_{h→0} (6x + 3h − 2), so f'(x):",
      '[ ]',
    ],
    answer: ['6x-2'],
    presentation: 'steps',
    keyboard_type: 'scientific_math',
    type: 'calc',
    unit: 'calculus',
    topic: 'first_principles',
    subtopic: 'quadratic_function',
    skills: ['first_principles_definition', 'limit_simplification'],
    difficulty: 3,
    exam_weight: 3,
    xp: 10,
    order: 3,
    syllabus: 'dbe', subject: 'maths', year: 2024, paper: 'nov_p1',
    clues: '- Expand f(x + h) carefully, then subtract f(x).\n- Take out the common factor h and cancel it before letting h approach 0.',
  },
  {
    name: 'Question 4',
    question: 'Given f(x) = 3x² for all real x. Write down ONE restriction on the domain of f so that the inverse of f is a function. Write it in the form x ≥ c or x ≤ c.',
    metadata: ['Restriction: ', '[ ]'],
    answer: ['x≥0|x≤0', '', '', '', ''],
    presentation: 'fitb',
    keyboard_type: 'scientific_math',
    type: 'definition',
    unit: 'functions_graphs',
    topic: 'parabola',
    subtopic: 'inverse_function',
    skills: ['applying_restrictions'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe', subject: 'maths', year: 2024, paper: 'nov_p1',
    clues: '- The inverse is a function only when f is one-to-one.\n- Keep just one half of the parabola, split at its axis of symmetry.',
  },
  {
    name: 'Question 5',
    question: 'Given f(x) = 2x² for x ≤ 0. Which equation represents the inverse of f?',
    metadata: [
      'y = −\\sqrt{\\frac{x}{2}}',
      'y = \\sqrt{\\frac{x}{2}}',
      'y = −\\sqrt{2x}',
      'y = \\sqrt{2x}',
      '',
    ],
    answer: ['y = −\\sqrt{\\frac{x}{2}}', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'calc',
    unit: 'functions_graphs',
    topic: 'parabola',
    subtopic: 'inverse_function',
    skills: ['reflection_about_y_equals_x', 'applying_restrictions'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 5,
    syllabus: 'dbe', subject: 'maths', year: 2024, paper: 'nov_p1',
    clues: '- Swap x and y, then make y the subject.\n- The restriction on the x-values of f becomes a restriction on the y-values of the inverse, which tells you which sign to keep.',
  },
];

// ─── AI explanation (AMPM-CONTENT-AI-EXP) — one entry per exam sub-question ───

const aiExplanation = {
  sub_questions: [
    {
      number: '8.1.1',
      marks: 2,
      clues: '- Differentiate term by term with the power rule.',
      approach: '- The derivative of 3x is 3.\n- The derivative of −5x² is −10x.',
      solution: '1. d/dx[3x − 5x²] = 3 − 10x',
    },
    {
      number: '8.1.2',
      marks: 4,
      clues: '- Write both terms as powers of x before you differentiate.',
      approach: '- 2/x² = 2x⁻², and the cube root of x⁷ is x^(7/3).\n- Apply the power rule to each term.',
      solution: '1. g(x) = 2x⁻² − x^(7/3)\n2. g′(x) = −4x⁻³ − (7/3)x^(4/3)',
    },
    {
      number: '8.2',
      marks: 3,
      clues: '- The gradient of the tangent is f′(2), and the point of contact is (2 ; f(2)).',
      approach: '- f′(x) = 3x² − 8x + 2, so m = f′(2) = −2.\n- f(2) = −1.\n- Use y − y₁ = m(x − x₁).',
      solution: '1. f′(x) = 3x² − 8x + 2\n2. m = 3(2)² − 8(2) + 2 = −2\n3. f(2) = 8 − 16 + 4 + 3 = −1\n4. y + 1 = −2(x − 2)\n5. y = −2x + 3',
    },
    {
      number: '8.3.1',
      marks: 5,
      clues: '- Find f(x + h) first, then f(x + h) − f(x).\n- Take out the common factor h and cancel it before letting h → 0.',
      approach: '- f(x + h) = −6(x + h)² = −6x² − 12xh − 6h².\n- f(x + h) − f(x) = −12xh − 6h².\n- Divide by h and take the limit as h → 0.',
      solution: '1. f(x + h) = −6x² − 12xh − 6h²\n2. f(x + h) − f(x) = −12xh − 6h²\n3. f′(x) = lim (h → 0) of h(−12x − 6h) / h\n4. f′(x) = lim (h → 0) of (−12x − 6h)\n5. f′(x) = −12x',
    },
    {
      number: '8.3.2',
      marks: 1,
      clues: '- A parabola is one-to-one only on one side of its axis of symmetry.',
      approach: '- The axis of symmetry of f is x = 0.\n- Restrict the domain to one side of it.',
      solution: '1. x ≥ 0 (or x ≤ 0)',
    },
    {
      number: '8.3.3',
      marks: 3,
      clues: '- Swap x and y, make y the subject, then choose the sign that gives f⁻¹(x) ≤ 0.',
      approach: '- Swap: x = −6y².\n- y² = −x/6, so y = ±√(−x/6).\n- f⁻¹(x) ≤ 0, so take the negative root.',
      solution: '1. x = −6y²\n2. y² = −x/6\n3. y = ±√(−x/6)\n4. y = −√(−x/6), for x ≤ 0',
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
