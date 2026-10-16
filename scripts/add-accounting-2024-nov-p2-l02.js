#!/usr/bin/env node
/**
 * DBE Accounting — November 2024 — Question 1.2.1: Correct balance of the Debtors' Control account (order 2)
 * Question 1.2.1 — the effect of each error and omission on the Debtors' Control account, and its correct balance.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-accounting-2024-nov-p2-l02.js --curriculum temp/curriculum-vocab-accounting-2024-p2.json
 *   node scripts/add-accounting-2024-nov-p2-l02.js --dry-run
 *   node scripts/add-accounting-2024-nov-p2-l02.js
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
  "name": "Question 1.2.1: Correct balance of the Debtors' Control account",
  "syllabus": "dbe",
  "subject": "accounting",
  "year": 2024,
  "paper": "nov_p2",
  "order": 2,
  "content_tier": "free",
  "has_video": false,
  "xp": 5,
  "tags": [
    "debtors_control_account",
    "debtors_reconciliation"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2024/nov_p2/q2/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2024/nov_p2/q2/memo_1.png"
  ],
  "exam_question_marks": 5,
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
      "6000",
      "-1800",
      "292600",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "unit": "reconciliations",
    "topic": "debtors_reconciliation",
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
    "year": 2024,
    "paper": "nov_p2",
    "type": "calc",
    "clues": "- An overcast allowances total took too much off the control account.\n- Errors made only in the Debtors' Ledger do not change the control account.",
    "supplementary_material": {
      "type": "statement",
      "label": "Debtors' Control: Lindiwe Traders",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/accounting/2024/nov_p2/q2/statement_1.png"
      ]
    }
  },
  {
    "name": "Question 2",
    "question": "The Debtors' Control balance is R150 000. The Debtors' Journal was undercast by R2 400, and a credit note of R900 was never recorded. Calculate the correct balance.",
    "metadata": [
      "Correct balance = R ",
      "[ ]"
    ],
    "answer": [
      "151500",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "unit": "reconciliations",
    "topic": "debtors_reconciliation",
    "subtopic": "acc_calculation",
    "skills": [
      "calculate_accounting_amount"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "accounting",
    "year": 2024,
    "paper": "nov_p2",
    "type": "calc"
  },
  {
    "name": "Question 3",
    "question": "A credit sale was posted to the wrong debtor's account in the Debtors' Ledger. What is the effect on the Debtors' Control account?",
    "metadata": [
      "It increases by the amount of the credit sale",
      "It decreases by the amount of the credit sale",
      "It increases by twice the amount of the sale",
      "No effect; only the two debtors' accounts change",
      ""
    ],
    "answer": [
      "No effect; only the two debtors' accounts change",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "reconciliations",
    "topic": "debtors_reconciliation",
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
    "year": 2024,
    "paper": "nov_p2",
    "type": "application"
  },
  {
    "name": "Question 4",
    "question": "Select ALL the errors that change the balance of the Debtors' Control account.",
    "metadata": [
      "A receipt posted at the wrong amount in the Debtors' Ledger",
      "An allowance posted to the wrong side of a debtor's account",
      "An invoice that was never entered in the Debtors' Journal",
      "An undercast total in the Debtors' Allowances Journal",
      "A sale posted to the account of the wrong debtor"
    ],
    "answer": [
      "An invoice that was never entered in the Debtors' Journal",
      "An undercast total in the Debtors' Allowances Journal",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "reconciliations",
    "topic": "debtors_reconciliation",
    "subtopic": "acc_classification",
    "skills": [
      "classify_accounting_concept"
    ],
    "difficulty": 4,
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
      "number": "1.2.1",
      "marks": 5,
      "clues": "- Only errors in the journals or in the General Ledger change the control account.\n- Errors made only in individual debtors' accounts leave it unchanged (0).",
      "approach": "- Give each item a + or − sign, or 0 if there is no change.\n- Add the corrections to the balance before errors and omissions.",
      "solution": "1. R359 100 + R4 500 (i) − R11 000 (iii) + R2 700 (v: R5 200 − R2 500); items (ii), (iv) and (vi) are 0.\n2. Correct balance of the Debtors' Control account = R355 300."
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
