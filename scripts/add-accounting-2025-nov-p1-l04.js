#!/usr/bin/env node
/**
 * DBE Accounting — November 2025 — Question 1.3: Statement of Financial Position — current assets (order 4)
 * Question 1.3 (current assets) — inventories after the stock correction, and trade and other receivables with the debtor transfer, the provision for bad debts, accrued income and the SARS refund.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-accounting-2025-nov-p1-l04.js --curriculum temp/curriculum-vocab-accounting.json
 *   node scripts/add-accounting-2025-nov-p1-l04.js --dry-run
 *   node scripts/add-accounting-2025-nov-p1-l04.js
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
  "name": "Question 1.3: Statement of Financial Position — current assets",
  "syllabus": "dbe",
  "subject": "accounting",
  "year": 2025,
  "paper": "nov_p1",
  "order": 4,
  "content_tier": "free",
  "has_video": false,
  "xp": 8,
  "tags": [
    "trade_and_other_receivables",
    "provision_for_bad_debts",
    "statement_of_financial_position"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p1/q4/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p1/q4/question_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p1/q4/question_3.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p1/q4/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p1/q4/memo_2.png"
  ],
  "exam_question_marks": 8,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Use the information in the figure to calculate the missing amounts A and B in the statement.",
    "metadata": [
      "A = ",
      "[ ]",
      "   B = ",
      "[ ]"
    ],
    "answer": [
      "1121800",
      "521900",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "unit": "company_financial_statements",
    "topic": "statement_of_financial_position",
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
    "paper": "nov_p1",
    "type": "calc",
    "clues": "- Take the overpaid debtor out before calculating the provision.\n- Add every amount owed to the company and deduct the provision.",
    "supplementary_material": {
      "type": "statement",
      "label": "Statement of Financial Position (extract): Roan Ltd",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/accounting/2025/nov_p1/q4/statement_1.png"
      ]
    }
  },
  {
    "name": "Question 2",
    "question": "Debtors' control is R380 000 after all transfers. The provision for bad debts must be adjusted to 6% of the outstanding debtors. Calculate the closing provision for bad debts.",
    "metadata": [
      "Provision = R ",
      "[ ]"
    ],
    "answer": [
      "22800",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "unit": "company_financial_statements",
    "topic": "statement_of_financial_position",
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
    "paper": "nov_p1",
    "type": "calc"
  },
  {
    "name": "Question 3",
    "question": "How is the provision for bad debts shown on the Statement of Financial Position?",
    "metadata": [
      "It is added to the creditors as a current liability",
      "It is shown as an expense under shareholders' equity",
      "It is deducted from debtors in trade and other receivables",
      "It is added to cash and cash equivalents",
      ""
    ],
    "answer": [
      "It is deducted from debtors in trade and other receivables",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "company_financial_statements",
    "topic": "statement_of_financial_position",
    "subtopic": "acc_classification",
    "skills": [
      "classify_accounting_concept"
    ],
    "difficulty": 3,
    "exam_weight": 1,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "accounting",
    "year": 2025,
    "paper": "nov_p1",
    "type": "application"
  },
  {
    "name": "Question 4",
    "question": "Select ALL the items that INCREASE trade and other receivables.",
    "metadata": [
      "The provision for bad debts",
      "Commission income that is still outstanding",
      "An expense paid in advance",
      "A refund due from SARS",
      "A debtor's balance written off as irrecoverable"
    ],
    "answer": [
      "Commission income that is still outstanding",
      "An expense paid in advance",
      "A refund due from SARS",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "company_financial_statements",
    "topic": "statement_of_financial_position",
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
    "paper": "nov_p1",
    "type": "application"
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "1.3",
      "marks": 8,
      "clues": "- Inventories must reflect the correction from question 1.1.\n- Trade and other receivables include more than the debtors' control account.",
      "approach": "- Adjust the inventories by the difference found in 1.1.\n- Build up receivables from the debtors' control account, the transfer, the provision and each amount owed to the company.",
      "solution": "1. Inventories: R4 598 000 – R13 260 = R4 584 740.\n2. Trade and other receivables: R735 000 + R5 000 (transfer of the overpaid balance) – R29 600 (4% provision) + R6 400 (commission) + R48 750 (fees paid in advance) + R70 000 (SARS refund) = R835 550."
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
