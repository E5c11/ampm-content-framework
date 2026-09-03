#!/usr/bin/env node
/**
 * DBE Mathematics P1 — November 2025 — Question 7 (order 7)
 * Finance: compound growth, future-value annuity with a deferred period,
 * present-value annuity (number of payments), comparing investments.
 *
 *   node tools/validate-questions.js --script scripts/add-maths-2025-nov-p1-q7.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-maths-2025-nov-p1-q7.js --dry-run
 *   node scripts/add-maths-2025-nov-p1-q7.js
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
  name: 'Question 7',
  syllabus: 'dbe',
  subject: 'maths',
  year: 2025,
  paper: 'nov_p1',
  order: 7,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['finance', 'compound_interest', 'annuity_future_value', 'annuity_present_value'],
  question_image_urls: [`${IMG}/q7/question_1.png`],
  memo_image_urls: [`${IMG}/q7/memo_1.png`, `${IMG}/q7/memo_2.png`],
  exam_question_marks: 15,
  supplementary_materials: [
    { type: 'formula_sheet', label: 'Formula Sheet', image_urls: [`${IMG}/q0/question_1.png`] },
  ],
};

const questions = [
  {
    name: 'Question 1',
    question: 'R85 000 is invested at 6.6% per annum, compounded monthly. Determine the value of the investment after 4 years, correct to the nearest rand.',
    metadata: ['value (R) = ', '[ ]'],
    answer: ['110601', '', '', '', ''],
    presentation: 'fitb',
    type: 'calc',
    unit: 'finance',
    topic: 'compound_interest',
    subtopic: 'compound_monthly',
    skills: ['compound_interest_formula', 'monthly_compounding', 'rounding'],
    difficulty: 2,
    exam_weight: 3,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2025,
    paper: 'nov_p1',
    clues: '- Use A = P(1 + i)^n with the monthly rate i = \\frac{0.066}{12}.\n- The number of compounding periods is 4 × 12.',
  },
  {
    name: 'Question 2',
    question: 'R1 200 is deposited at the end of every month for 3 years into an account earning 9% per annum compounded monthly, then left untouched for a further 6 months. These steps find the final balance, but are in the wrong order. Arrange them correctly.',
    metadata: [
      'Grow the annuity value 6 more months: × (1.0075)⁶',
      'Monthly rate i = 0.0075; number of deposits n = 36',
      'Evaluate to obtain the final balance',
      'F = \\frac{1200[(1.0075)³⁶ − 1]}{0.0075}',
    ],
    answer: [
      'Monthly rate i = 0.0075; number of deposits n = 36',
      'F = \\frac{1200[(1.0075)³⁶ − 1]}{0.0075}',
      'Grow the annuity value 6 more months: × (1.0075)⁶',
      'Evaluate to obtain the final balance',
    ],
    presentation: 'ordering',
    type: 'calc',
    unit: 'finance',
    topic: 'annuity_future_value',
    subtopic: 'future_value_of_extra_payments',
    skills: ['future_value_annuity_formula', 'monthly_compounding'],
    difficulty: 3,
    exam_weight: 3,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2025,
    paper: 'nov_p1',
    clues: '- First find the value of the annuity at the moment of the last deposit.\n- Then grow that single amount for the remaining months with (1 + i)^k.',
  },
  {
    name: 'Question 3',
    question: 'A loan of R250 000 is repaid with payments of R4 200 at the end of each month, the first payment one month after the loan is granted. Interest is 9% per annum compounded monthly. Calculate the number of payments required (round up to the next whole number).',
    metadata: ['number of payments = ', '[ ]'],
    answer: ['80', '', '', '', ''],
    presentation: 'fitb',
    type: 'calc',
    unit: 'finance',
    topic: 'annuity_present_value',
    subtopic: 'number_of_payments',
    skills: ['present_value_annuity_formula', 'rearranging_annuity_formula', 'logarithms_to_find_n'],
    difficulty: 4,
    exam_weight: 3,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2025,
    paper: 'nov_p1',
    clues: '- Substitute into P = \\frac{x[1 − (1 + i)⁻ⁿ]}{i} and isolate (1 + i)⁻ⁿ.\n- Take logarithms to solve for n, then round up because a part-payment still needs a whole period.',
  },
  {
    name: 'Question 4',
    question: 'R60 000 is invested for 4 years. Option A pays 7.5% per annum compounded monthly; Option B pays 7.8% per annum compounded annually. Which option gives the greater accumulated amount?',
    metadata: ['Option A', 'Option B', 'They are equal', 'Cannot be determined', ''],
    answer: ['Option B', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'calc',
    unit: 'finance',
    topic: 'compound_interest',
    subtopic: 'investment_comparison',
    skills: ['compound_interest_formula', 'monthly_compounding'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2025,
    paper: 'nov_p1',
    clues: '- Work out the accumulated amount for each option using A = P(1 + i)^n with its own rate and compounding period.\n- Compare the two results.',
  },
];

const aiExplanation = {
  sub_questions: [
    {
      number: '7.1',
      marks: 2,
      clues: '- The cost grows by a fixed percentage each year — use A = P(1 + i)^n.\n- Here i = 7.8% and n = 5.',
      approach: '- Identify P = 40 000, i = 0.078, n = 5.\n- Substitute into A = P(1 + i)^n.\n- Evaluate.',
      solution: '1. A = P(1 + i)^n\n2. A = 40 000(1 + 0.078)^5\n3. A = R58 230.94',
    },
    {
      number: '7.2',
      marks: 4,
      clues: '- Deposits made at the start of each quarter form a future-value annuity.\n- Count the deposits, then grow the total one extra quarter to reach 1 January 2026.',
      approach: '- Quarterly rate: i = \\frac{0.058}{4}.\n- Deposits from 1 Jan 2020 to 1 Oct 2025 = 24.\n- Use F = \\frac{x[(1 + i)ⁿ − 1]}{i}, then multiply by (1 + i) once more for the extra quarter to 1 Jan 2026.',
      solution: '1. i = \\frac{0.058}{4} = 0.0145;  n = 24 deposits\n2. F = \\frac{2300[(1.0145)²⁴ − 1]}{0.0145} × (1.0145)\n3. F = R66 411.60',
    },
    {
      number: '7.3.1',
      marks: 5,
      clues: '- The loan grows for 3 months before any payment is made.\n- Then the outstanding balance is a present-value annuity; solve for n with logarithms and add the 3 months.',
      approach: '- Grow R900 000 for 3 months: A = 900 000(1 + \\frac{0.068}{12})³.\n- Set this equal to the present value of the R10 000 payments: P = \\frac{x[1 − (1 + i)⁻ⁿ]}{i}.\n- Solve for n using logarithms.\n- Add the 3 deferred months and round up to completed months.',
      solution: '1. A = 900 000(1 + \\frac{0.068}{12})³ = R915 386.86\n2. 915 386.86 = \\frac{10 000[1 − (1 + \\frac{0.068}{12})⁻ⁿ]}{\\frac{0.068}{12}}\n3. (1 + \\frac{0.068}{12})⁻ⁿ = 0.4812…\n4. n = 129.419… payments\n5. Total time = 129.419… + 3 = 132.419… ⟹ 133 completed months',
    },
    {
      number: '7.3.2',
      marks: 4,
      clues: '- After 129 full payments a smaller balance remains; that balance grows one month and is settled by the final payment.\n- Find the outstanding balance after 129 payments, then add one month\u2019s interest.',
      approach: '- Find the outstanding balance after 129 payments using the present-value formula with n = 129.419… − 129.\n- Grow this balance by one month.\n- That amount is the final payment.',
      solution: '1. Balance after 129 payments = \\frac{10 000[1 − (1 + \\frac{0.068}{12})^(−0.419…)]}{\\frac{0.068}{12}} ≈ R4 173.55\n2. Final payment = 4 173.55 × (1 + \\frac{0.068}{12})\n3. ∴ final payment = R4 197.21',
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
