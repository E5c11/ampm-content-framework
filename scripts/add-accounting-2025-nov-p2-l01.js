#!/usr/bin/env node
/**
 * DBE Accounting — November 2025 — Question 1.1.1: Entries in the cash journals (order 1)
 * Question 1.1.1 — the entries that must be made in the Cash Receipts and Cash Payments Journals after the bank statement is received.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-accounting-2025-nov-p2-l01.js --curriculum temp/curriculum-vocab-accounting.json
 *   node scripts/add-accounting-2025-nov-p2-l01.js --dry-run
 *   node scripts/add-accounting-2025-nov-p2-l01.js
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
  "name": "Question 1.1.1: Entries in the cash journals",
  "syllabus": "dbe",
  "subject": "accounting",
  "year": 2025,
  "paper": "nov_p2",
  "order": 1,
  "content_tier": "free",
  "has_video": false,
  "xp": 10,
  "tags": [
    "cash_journal_adjustments",
    "bank_statement_items"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p2/q1/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p2/q1/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p2/q1/memo_1.png"
  ],
  "exam_question_marks": 10,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Use the information in the figure to calculate the corrected totals A and B of the two journals.",
    "metadata": [
      "A = ",
      "[ ]",
      "   B = ",
      "[ ]"
    ],
    "answer": [
      "220550",
      "90880",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "unit": "reconciliations",
    "topic": "cash_journal_adjustments",
    "subtopic": "acc_statement_completion",
    "skills": [
      "complete_financial_statement"
    ],
    "difficulty": 4,
    "exam_weight": 3,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "accounting",
    "year": 2025,
    "paper": "nov_p2",
    "type": "calc",
    "clues": "- Credits on the bank statement go into the Receipts Journal.\n- Debits go into the Payments Journal.",
    "supplementary_material": {
      "type": "statement",
      "label": "Cash journals: Tau Stores",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/accounting/2025/nov_p2/q1/statement_1.png"
      ]
    }
  },
  {
    "name": "Question 2",
    "question": "A bank statement shows interest earned of R850 and service fees of R310, neither of which is in the journals. Calculate the net effect on the bank account balance (a decrease is negative).",
    "metadata": [
      "Net effect = R ",
      "[ ]"
    ],
    "answer": [
      "540",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "unit": "reconciliations",
    "topic": "cash_journal_adjustments",
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
    "question": "Where is a direct deposit by a customer, found on the bank statement, recorded in the books?",
    "metadata": [
      "In the Cash Payments Journal",
      "In the General Journal",
      "In the Cash Receipts Journal",
      "In the Debtors' Journal",
      ""
    ],
    "answer": [
      "In the Cash Receipts Journal",
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
    "order": 3,
    "syllabus": "dbe",
    "subject": "accounting",
    "year": 2025,
    "paper": "nov_p2",
    "type": "definition"
  },
  {
    "name": "Question 4",
    "question": "Select ALL the items that must be recorded in the Cash Payments Journal after receiving the bank statement.",
    "metadata": [
      "Interest earned on the account",
      "Service fees charged by the bank",
      "A debit order for insurance",
      "An EFT payment not yet recorded",
      "A direct deposit by a customer"
    ],
    "answer": [
      "Service fees charged by the bank",
      "A debit order for insurance",
      "An EFT payment not yet recorded",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "reconciliations",
    "topic": "cash_journal_adjustments",
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
      "number": "1.1.1",
      "marks": 10,
      "clues": "- Items on the bank statement that are not in the journals must now be recorded.\n- Credits go to the Receipts Journal and debits to the Payments Journal.",
      "approach": "- Sort the unrecorded bank statement items into receipts and payments.\n- Add each item to the provisional journal totals.",
      "solution": "1. The Cash Receipts Journal takes R2 160 and R16 500 + R16 500 (R33 000) for the deposit that was recorded in the wrong journal.\n2. The Cash Payments Journal takes R10 000 (the irrecoverable shortfall), R2 700 + R2 700 (the debit orders), R13 000 (the debit card payment), R975 and R605."
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
