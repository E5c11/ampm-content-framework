#!/usr/bin/env node
/**
 * DBE Accounting — November 2025 — Question 4.1.3–4.1.4: Purchases, payments to creditors and fixed deposit (order 15)
 * Questions 4.1.3 and 4.1.4 — cash purchases of trading stock, payments to creditors and the fixed deposit that matures.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-accounting-2025-nov-p2-l15.js --curriculum temp/curriculum-vocab-accounting.json
 *   node scripts/add-accounting-2025-nov-p2-l15.js --dry-run
 *   node scripts/add-accounting-2025-nov-p2-l15.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

// ─── Phase 2 — lesson document ───────────────────────────────────────────────

const video = {
  "name": "Question 4.1.3–4.1.4: Purchases, payments to creditors and fixed deposit",
  "syllabus": "dbe",
  "subject": "accounting",
  "year": 2025,
  "paper": "nov_p2",
  "order": 15,
  "content_tier": "free",
  "has_video": false,
  "xp": 9,
  "tags": [
    "cash_purchases_budget",
    "fixed_deposit_maturity"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p2/q15/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p2/q15/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p2/q15/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p2/q15/memo_2.png"
  ],
  "exam_question_marks": 9,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Use the information in the figure to calculate the missing amounts A, B and C.",
    "metadata": [
      "A = ",
      "[ ]",
      "   B = ",
      "[ ]",
      "   C = ",
      "[ ]"
    ],
    "answer": [
      "300000",
      "825000",
      "320000",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "unit": "budgeting",
    "topic": "cash_budget_calculations",
    "subtopic": "acc_statement_completion",
    "skills": [
      "complete_financial_statement"
    ],
    "difficulty": 5,
    "exam_weight": 3,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "accounting",
    "year": 2025,
    "paper": "nov_p2",
    "type": "calc",
    "clues": "- Cost of sales = sales ÷ 1,6.\n- January payments are for stock bought two months earlier.",
    "supplementary_material": {
      "type": "statement",
      "label": "Budget amounts: Ntuli Traders",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/accounting/2025/nov_p2/q15/statement_1.png"
      ]
    }
  },
  {
    "name": "Question 2",
    "question": "Sales are R1 360 000 and the mark-up is 60% on cost. Calculate the cost of sales.",
    "metadata": [
      "Cost of sales = R ",
      "[ ]"
    ],
    "answer": [
      "850000",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "unit": "budgeting",
    "topic": "cash_budget_calculations",
    "subtopic": "acc_calculation",
    "skills": [
      "calculate_accounting_amount"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "accounting",
    "year": 2025,
    "paper": "nov_p2",
    "type": "calc"
  },
  {
    "name": "Question 3",
    "question": "Creditors are paid in the second month after purchase. Which purchases do the January payments relate to?",
    "metadata": [
      "The cash purchases made in January",
      "The credit purchases made in November",
      "The credit purchases made in December",
      "The credit purchases made in January",
      ""
    ],
    "answer": [
      "The credit purchases made in November",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "budgeting",
    "topic": "cash_budget_calculations",
    "subtopic": "acc_classification",
    "skills": [
      "classify_accounting_concept"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "accounting",
    "year": 2025,
    "paper": "nov_p2",
    "type": "application"
  },
  {
    "name": "Question 4",
    "question": "Select the TWO correct statements about the budget.",
    "metadata": [
      "Cash purchases are included in payments to creditors",
      "Cash purchases are paid in the month of purchase",
      "Creditors are paid in the month of purchase",
      "Payments to creditors exclude cash purchases",
      "All purchases are made for cash"
    ],
    "answer": [
      "Cash purchases are paid in the month of purchase",
      "Payments to creditors exclude cash purchases",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "budgeting",
    "topic": "cash_budget_calculations",
    "subtopic": "acc_classification",
    "skills": [
      "classify_accounting_concept"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "accounting",
    "year": 2025,
    "paper": "nov_p2",
    "type": "application"
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "4.1.3",
      "marks": 5,
      "clues": "- Sales include a 60% mark-up on cost.\n- Cash and credit purchases are treated separately.",
      "approach": "- Find the cost of sales, then split it into cash and credit.",
      "solution": "1. Cash purchases in January = R2 030 000 × 20/160 = R253 750.\n2. Payments to creditors in January = R1 203 125 × 80% = R962 500."
    },
    {
      "number": "4.1.4",
      "marks": 4,
      "clues": "- The interest is quarterly and the rate is per year.\n- Interest is not added to the deposit.",
      "approach": "- Annualise the quarterly interest, then divide by the rate.",
      "solution": "1. R5 440 × 12/3 × 100/8 = R272 000."
    }
  ],
  "model": "claude-sonnet-5-5",
  "generated_at": Date.now(),
  "version": 2,
  "reviewed": false,
  "input_tokens": 0,
  "output_tokens": 0,
  "avg_rating": null,
  "rating_count": null
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

  // Exam gate (VER-02/VER-04/VER-09): derive the exam minimum from the rows now in the database and write it. Dev only; no-op at the floor.
  if (!DRY_RUN && ENV === 'dev') {
    const { applyExamGates } = require('../tools/lib/exam-gate');
    await applyExamGates(pool, { env: ENV, apply: true, filter: { subject: video.subject, syllabus: video.syllabus, year: String(video.year) } });
  } else if (DRY_RUN) {
    console.log('   (dry-run: the exam gate is derived and written after a real upload — node tools/apply-exam-gate.js shows it)');
  }
}

if (require.main === module) {
  upload()
    .catch((err) => {
      console.error('\n❌ Upload failed:', err.message);
      process.exitCode = 1;
    })
    .finally(closePool);
}
