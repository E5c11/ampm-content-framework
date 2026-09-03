#!/usr/bin/env node
/**
 * DBE Mathematics P1 — November 2025 — Question 2 (order 2)
 * Number patterns & series: infinite geometric series (common ratio, nth term,
 * sum to infinity) and an arithmetic series in sigma notation.
 *
 *   node tools/validate-questions.js --script scripts/add-maths-2025-nov-p1-q2.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-maths-2025-nov-p1-q2.js --dry-run
 *   node scripts/add-maths-2025-nov-p1-q2.js
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
  name: 'Question 2',
  syllabus: 'dbe',
  subject: 'maths',
  year: 2025,
  paper: 'nov_p1',
  order: 2,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['geometric_sequence', 'sum_formula', 'general_term', 'common_ratio'],
  question_image_urls: [`${IMG}/q2/question_1.png`],
  memo_image_urls: [`${IMG}/q2/memo_1.png`, `${IMG}/q2/memo_2.png`],
  exam_question_marks: 15,
  supplementary_materials: [
    { type: 'formula_sheet', label: 'Formula Sheet', image_urls: [`${IMG}/q0/question_1.png`] },
  ],
};

const questions = [
  {
    name: 'Question 1',
    question: 'Calculate the sum to infinity of the geometric series 18 + 12 + 8 + …',
    metadata: ['S∞ = ', '[ ]'],
    answer: ['54', '', '', '', ''],
    presentation: 'fitb',
    type: 'calc',
    unit: 'number_patterns',
    topic: 'geometric_sequence',
    subtopic: 'series_sum',
    skills: ['geometric_sum_formula', 'identifying_a_and_r', 'applying_restrictions'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2025,
    paper: 'nov_p1',
    clues: '- Find the first term a and the common ratio r, and confirm that −1 < r < 1.\n- Substitute into S∞ = \\frac{a}{1 − r}.',
  },
  {
    name: 'Question 2',
    question: 'The sum of the first n terms of the arithmetic series 2 + 5 + 8 + 11 + … is 950. Calculate the value of n.',
    metadata: ['n = ', '[ ]'],
    answer: ['25', '', '', '', ''],
    presentation: 'fitb',
    type: 'calc',
    unit: 'number_patterns',
    topic: 'arithmetic_sequence',
    subtopic: 'series_sum',
    skills: ['arithmetic_sum_formula', 'solving_quadratic', 'solution_validation'],
    difficulty: 3,
    exam_weight: 3,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2025,
    paper: 'nov_p1',
    clues: '- Substitute a = 2, d = 3 and Sₙ = 950 into Sₙ = \\frac{n}{2}[2a + (n − 1)d].\n- Solve the resulting quadratic in n and reject any solution that is not a positive whole number.',
  },
  {
    name: 'Question 3',
    question: 'The first three terms of a geometric sequence are x − 2; x + 2; 5x − 2. These steps find the value of x (x ≠ 0), but they are in the wrong order. Arrange them correctly.',
    metadata: [
      'Expand and simplify to 4x² − 16x = 0',
      'Equate the ratios of consecutive terms',
      'Solve to get x = 4 (since x ≠ 0)',
      'Cross-multiply to (x + 2)² = (x − 2)(5x − 2)',
    ],
    answer: [
      'Equate the ratios of consecutive terms',
      'Cross-multiply to (x + 2)² = (x − 2)(5x − 2)',
      'Expand and simplify to 4x² − 16x = 0',
      'Solve to get x = 4 (since x ≠ 0)',
    ],
    presentation: 'ordering',
    type: 'calc',
    unit: 'number_patterns',
    topic: 'geometric_sequence',
    subtopic: 'common_ratio',
    skills: ['identifying_a_and_r', 'solving_quadratic', 'logical_sequence'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2025,
    paper: 'nov_p1',
    clues: '- In a geometric sequence the ratio between consecutive terms is constant, so set the two ratios equal.\n- Cross-multiply, simplify to a quadratic, and use the condition x ≠ 0 to choose the valid value.',
  },
  {
    name: 'Question 4',
    question: 'Determine T₁₅ of the geometric sequence 2; 4; 8; 16; …, written in exponential form.',
    metadata: ['2 · 15', '2^15', '15^2', '2^14', ''],
    answer: ['2^15', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'calc',
    unit: 'number_patterns',
    topic: 'geometric_sequence',
    subtopic: 'general_term',
    skills: ['geometric_nth_term', 'identifying_a_and_r', 'same_base_exponents'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2025,
    paper: 'nov_p1',
    clues: '- Use Tₙ = a · r^(n − 1) with a = 2 and r = 2.\n- Combine the powers of 2 into a single exponent.',
  },
];

const aiExplanation = {
  sub_questions: [
    {
      number: '2.1.1',
      marks: 3,
      clues: '- The series is geometric, so the ratio between consecutive terms is constant.\n- Set the ratio of the 2nd to 1st term equal to the ratio of the 3rd to 2nd term and solve.',
      approach: '- Write \\frac{t − 2}{t + 10} = \\frac{t + 4}{t − 2}.\n- Cross-multiply and expand both sides.\n- The t² terms cancel; solve the resulting linear equation for t.',
      solution: '1. \\frac{t − 2}{t + 10} = \\frac{t + 4}{t − 2}\n2. (t − 2)² = (t + 4)(t + 10)\n3. t² − 4t + 4 = t² + 14t + 40\n4. −18t = 36\n5. ∴ t = −2',
    },
    {
      number: '2.1.2',
      marks: 3,
      clues: '- Substitute t = −2 to get the actual terms, then identify a and r.\n- Use Tₙ = a·r^(n − 1) and write the result as a single power (bˣ).',
      approach: '- With t = −2 the series is 8 + (−4) + 2 + …\n- a = 8 and r = −\\frac{1}{2}.\n- Substitute into T₂₅ = a·r²⁴.\n- Express 8 and \\frac{1}{2} as powers of 2 and combine the exponents.',
      solution: '1. With t = −2: series is 8 + (−4) + 2 + …\n2. a = 8,  r = \\frac{−4}{8} = −\\frac{1}{2}\n3. T₂₅ = 8(−\\frac{1}{2})²⁴ = 2³ · 2⁻²⁴\n4. ∴ T₂₅ = 2⁻²¹',
    },
    {
      number: '2.1.3',
      marks: 2,
      clues: '- The sum to infinity exists because −1 < r < 1.\n- Substitute a and r into S∞ = \\frac{a}{1 − r}.',
      approach: '- Use a = 8 and r = −\\frac{1}{2}.\n- Substitute into S∞ = \\frac{a}{1 − r}.\n- Simplify the compound fraction.',
      solution: '1. S∞ = \\frac{a}{1 − r} = \\frac{8}{1 − (−\\frac{1}{2})}\n2. S∞ = \\frac{8}{\\frac{3}{2}} = \\frac{16}{3} ≈ 5.33',
    },
    {
      number: '2.2.1',
      marks: 2,
      clues: '- Expand 4p − 1 to see it is an arithmetic sequence and read off the common difference.\n- The gap between T₆ and T₁₄ is a fixed number of common differences.',
      approach: '- The general term is Tₚ = 4p − 1, so d = 4.\n- T₁₄ and T₆ are 8 terms apart.\n- The difference is 8 × d.',
      solution: '1. Tₚ = 4p − 1, so the common difference is d = 4\n2. T₁₄ − T₆ = (14 − 6)d = 8 × 4 = 32',
    },
    {
      number: '2.2.2',
      marks: 5,
      clues: '- The number of terms in the sum from p = k to p = 117 is 118 − k.\n- Substitute this and the first and last terms into the arithmetic sum formula, then solve the quadratic in k.',
      approach: '- Number of terms: n = 118 − k.\n- First term of the sum is 4k − 1; last term is T₁₁₇ = 467.\n- Substitute into Sₙ = \\frac{n}{2}(first + last) = 26675.\n- Solve the resulting quadratic in k and reject the non-integer root.',
      solution: '1. n = 118 − k;  T₁₁₇ = 4(117) − 1 = 467\n2. \\frac{118 − k}{2}[(4k − 1) + 467] = 26675\n3. (118 − k)(2k + 233) = 26675\n4. 236k + 27494 − 2k² − 233k = 26675\n5. 2k² − 3k − 819 = 0\n6. (k − 21)(2k + 39) = 0\n7. ∴ k = 21  (k = −\\frac{39}{2} is rejected)',
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
