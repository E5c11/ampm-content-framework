#!/usr/bin/env node
/**
 * DBE Mathematics P1 — November 2024 — Question 7 (order 7)
 * Finance: compound interest, straight-line depreciation, loan interest, early settlement with a lump sum.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-maths-2024-nov-p1-q7.js --curriculum temp/curriculum-vocab-maths.json
 *   node scripts/add-maths-2024-nov-p1-q7.js --dry-run
 *   node scripts/add-maths-2024-nov-p1-q7.js
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
  name: 'Question 7',
  syllabus: 'dbe',
  subject: 'maths',
  year: 2024,
  paper: 'nov_p1',
  order: 7,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['compound_interest', 'depreciation', 'annuity_present_value'],
  question_image_urls: [`${IMG}/q7/question_1.png`],
  memo_image_urls: [`${IMG}/q7/memo_1.png`, `${IMG}/q7/memo_2.png`, `${IMG}/q7/memo_3.png`],
  exam_question_marks: 14,
  supplementary_materials: [
    { type: 'formula_sheet', label: 'Formula Sheet', image_urls: [`${IMG}/q0/question_1.png`] },
  ],
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    name: 'Question 1',
    question: 'Thandi invests R8 200 in an account that pays interest at 7.4% p.a., compounded monthly. Calculate the value of the investment after 9 years.',
    metadata: ['A = R', '[ ]'],
    answer: ['15928.17', '', '', '', ''],
    presentation: 'fitb',
    keyboard_type: 'standard_math',
    type: 'application',
    unit: 'finance',
    topic: 'compound_interest',
    subtopic: 'compound_monthly',
    skills: ['compound_interest_formula', 'monthly_compounding'],
    difficulty: 2,
    exam_weight: 3,
    xp: 10,
    order: 1,
    syllabus: 'dbe', subject: 'maths', year: 2024, paper: 'nov_p1',
    clues: '- Convert the annual rate to a monthly rate and the years to months.\n- Use the compound interest formula A = P(1 + i)ⁿ.',
  },
  {
    name: 'Question 2',
    question: 'A machine depreciates according to the straight-line method. After 6 years its value is 40% of its original value. At what annual rate does the machine depreciate?',
    metadata: ['6.67% p.a.', '10% p.a.', '14.16% p.a.', '16.67% p.a.', ''],
    answer: ['10% p.a.', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'finance',
    topic: 'depreciation',
    subtopic: 'straight_line',
    skills: ['depreciation_formula'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe', subject: 'maths', year: 2024, paper: 'nov_p1',
    clues: '- Use A = P(1 − in) and write the final value A in terms of P.\n- P cancels, which leaves an equation in i only.',
  },
  {
    name: 'Question 3',
    question: 'Lerato takes out a loan of R250 000. She repays it with 72 monthly instalments of R4 758.52. Calculate the total interest she pays on the loan.',
    metadata: ['Interest = R', '[ ]'],
    answer: ['92613.44', '', '', '', ''],
    presentation: 'fitb',
    keyboard_type: 'standard_math',
    type: 'application',
    unit: 'finance',
    topic: 'annuity_present_value',
    subtopic: 'total_interest',
    skills: ['present_value_annuity_formula'],
    difficulty: 1,
    exam_weight: 2,
    xp: 10,
    order: 3,
    syllabus: 'dbe', subject: 'maths', year: 2024, paper: 'nov_p1',
    clues: '- Work out the total amount she pays over the full term.\n- The interest is the difference between what she pays and what she borrowed.',
  },
  {
    name: 'Question 4',
    question: 'Sipho repays a loan with equal monthly instalments. Just after his 24th instalment he pays an extra lump sum into the loan, and then continues with the same instalment. These steps find how many months earlier he settles the loan but are in the wrong order. Arrange them in the correct order.',
    metadata: [
      'Use the present value formula with the new balance to solve for n',
      'Find the balance outstanding just after the 24th instalment',
      'Subtract n from the instalments left on the original plan',
      'Subtract the lump sum from the outstanding balance',
    ],
    answer: [
      'Find the balance outstanding just after the 24th instalment',
      'Subtract the lump sum from the outstanding balance',
      'Use the present value formula with the new balance to solve for n',
      'Subtract n from the instalments left on the original plan',
    ],
    presentation: 'ordering',
    type: 'application',
    unit: 'finance',
    topic: 'annuity_present_value',
    subtopic: 'outstanding_balance',
    skills: ['present_value_annuity_formula', 'logarithms_to_find_n'],
    difficulty: 3,
    exam_weight: 3,
    xp: 10,
    order: 4,
    syllabus: 'dbe', subject: 'maths', year: 2024, paper: 'nov_p1',
    clues: '- The outstanding balance is the present value of the instalments still to be paid.\n- The lump sum reduces the balance before the new number of payments is found.',
  },
];

// ─── AI explanation (AMPM-CONTENT-AI-EXP) — one entry per exam sub-question ───

const aiExplanation = {
  sub_questions: [
    {
      number: '7.1',
      marks: 3,
      clues: '- Interest is compounded quarterly, so divide the rate by 4 and multiply the years by 4.',
      approach: '- i = 0.068/4 and n = 16 × 4 = 64.\n- Substitute into A = P(1 + i)ⁿ.',
      solution: '1. A = 5 000(1 + 0.068/4)⁶⁴\n2. A = R14 706.56',
    },
    {
      number: '7.2',
      marks: 2,
      clues: '- Straight-line depreciation uses A = P(1 − in).\n- The value halves, so A = P/2.',
      approach: '- Substitute A = P/2 and n = 4.\n- Cancel P and solve for i.',
      solution: '1. P/2 = P(1 − 4i)\n2. 1/2 = 1 − 4i\n3. i = 1/8 = 0.125\n4. Rate = 12.5% p.a.',
    },
    {
      number: '7.3.1',
      marks: 2,
      clues: '- Find the total of all the instalments.\n- The interest is the total paid minus the amount borrowed.',
      approach: '- There are 60 instalments of R2 300.98.\n- Subtract the loan of R100 000.',
      solution: '1. Total paid = 2 300.98 × 60 = R138 058.80\n2. Interest = 138 058.80 − 100 000 = R38 058.80',
    },
    {
      number: '7.3.2',
      marks: 7,
      clues: '- Find the balance outstanding after 24 instalments, then subtract the extra R20 000.\n- Use the present value formula to find how many instalments are still needed.',
      approach: '- The balance after 24 instalments is the present value of the remaining 36 instalments at i = 0.135/12.\n- Subtract R20 000 to get the new balance.\n- Solve P = x[1 − (1 + i)⁻ⁿ]/i for n with logs.\n- Compare n with the 36 instalments that were left.',
      solution: '1. i = 0.135/12 = 0.01125\n2. Balance = 2 300.98[1 − (1.01125)⁻³⁶] / 0.01125 = R67 804.94\n3. New balance = 67 804.94 − 20 000 = R47 804.94\n4. 47 804.94 = 2 300.98[1 − (1.01125)⁻ⁿ] / 0.01125\n5. (1.01125)⁻ⁿ = 0.766…, so n = −log(0.766…) / log(1.01125)\n6. n = 23.8, so 24 more instalments are needed\n7. 36 − 24 = 12, so Tshepo repays the loan 12 months earlier',
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
