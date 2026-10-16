#!/usr/bin/env node
/**
 * DBE Accounting — November 2024 — Question 1.1: Recording debtors' EFTs and VAT concepts (order 1)
 * Question 1.1 — true/false items on recording EFTs from debtors, the nature of output VAT and VAT on bad debts.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-accounting-2024-nov-p2-l01.js --curriculum temp/curriculum-vocab-accounting-2024-p2.json
 *   node scripts/add-accounting-2024-nov-p2-l01.js --dry-run
 *   node scripts/add-accounting-2024-nov-p2-l01.js
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
  "name": "Question 1.1: Recording debtors' EFTs and VAT concepts",
  "syllabus": "dbe",
  "subject": "accounting",
  "year": 2024,
  "paper": "nov_p2",
  "order": 1,
  "content_tier": "free",
  "has_video": false,
  "xp": 3,
  "tags": [
    "vat_payable",
    "internal_control_cash"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2024/nov_p2/q1/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2024/nov_p2/q1/memo_1.png"
  ],
  "exam_question_marks": 3,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "When should an EFT payment received from a debtor be recorded in the Cash Receipts Journal?",
    "metadata": [
      "As soon as the debtor phones to say it was paid",
      "When the debtor's next monthly statement is sent",
      "Once there is proof of payment or a bank statement entry",
      "At month-end, together with all the other EFT receipts",
      ""
    ],
    "answer": [
      "Once there is proof of payment or a bank statement entry",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "reconciliations",
    "topic": "cash_journal_adjustments",
    "subtopic": "acc_term_recall",
    "skills": [
      "recall_accounting_term"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "accounting",
    "year": 2024,
    "paper": "nov_p2",
    "type": "definition"
  },
  {
    "name": "Question 2",
    "question": "How is output VAT classified in the books of a VAT vendor?",
    "metadata": [
      "As an asset, because it is claimed from SARS",
      "As a liability, because it is owed to SARS",
      "As income, because it is earned on sales",
      "As an expense, because it raises selling prices",
      ""
    ],
    "answer": [
      "As a liability, because it is owed to SARS",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "vat_and_salaries",
    "topic": "vat_calculations",
    "subtopic": "acc_classification",
    "skills": [
      "classify_accounting_concept"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "accounting",
    "year": 2024,
    "paper": "nov_p2",
    "type": "definition"
  },
  {
    "name": "Question 3",
    "question": "A debtor who owes R4 600 (including 15% VAT) is written off as irrecoverable. Calculate the amount by which the VAT payable to SARS decreases.",
    "metadata": [
      "Decrease = R ",
      "[ ]"
    ],
    "answer": [
      "600",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "unit": "vat_and_salaries",
    "topic": "vat_calculations",
    "subtopic": "acc_calculation",
    "skills": [
      "calculate_accounting_amount"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "accounting",
    "year": 2024,
    "paper": "nov_p2",
    "type": "calc",
    "clues": "- The amount written off already includes VAT.\n- The VAT part of a VAT-inclusive amount is 15/115 of it."
  },
  {
    "name": "Question 4",
    "question": "Select ALL the transactions that INCREASE the VAT payable to SARS.",
    "metadata": [
      "Goods returned by a debtor for a credit note",
      "Goods sold on credit at the standard rate",
      "Discount received from a creditor",
      "Stock taken by the owner for own use",
      "Bad debts written off on a debtor's account"
    ],
    "answer": [
      "Goods sold on credit at the standard rate",
      "Discount received from a creditor",
      "Stock taken by the owner for own use",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "vat_and_salaries",
    "topic": "vat_calculations",
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
    "year": 2024,
    "paper": "nov_p2",
    "type": "application"
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "1.1.1",
      "marks": 1,
      "clues": "- An EFT from a debtor is only certain once the money has reached the bank.\n- Recording it earlier risks recording money that never arrived.",
      "approach": "- Decide whether the statement describes good internal control over cash.",
      "solution": "1. True: record the EFT only after proof of payment or the bank statement entry is received."
    },
    {
      "number": "1.1.2",
      "marks": 1,
      "clues": "- Output VAT is charged on sales and collected on behalf of SARS.\n- Money owed to someone else is a liability.",
      "approach": "- Ask who the VAT belongs to.",
      "solution": "1. False: output VAT is a liability (owed to SARS), not an asset."
    },
    {
      "number": "1.1.3",
      "marks": 1,
      "clues": "- Output VAT was paid over on the original sale.\n- When the debt is written off, that VAT can be claimed back.",
      "approach": "- Decide whether SARS owes the business, or the business owes SARS, on a bad debt.",
      "solution": "1. True: VAT on bad debts reduces the VAT payable to SARS."
    }
  ],
  "model": "claude-opus-5-5",
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
