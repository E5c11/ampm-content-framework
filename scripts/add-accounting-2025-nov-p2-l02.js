#!/usr/bin/env node
/**
 * DBE Accounting — November 2025 — Question 1.1.2: Bank reconciliation statement (order 2)
 * Question 1.1.2 — the Bank Reconciliation Statement (one-column method), starting from the balance on the bank statement.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-accounting-2025-nov-p2-l02.js --curriculum temp/curriculum-vocab-accounting.json
 *   node scripts/add-accounting-2025-nov-p2-l02.js --dry-run
 *   node scripts/add-accounting-2025-nov-p2-l02.js
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
  "name": "Question 1.1.2: Bank reconciliation statement",
  "syllabus": "dbe",
  "subject": "accounting",
  "year": 2025,
  "paper": "nov_p2",
  "order": 2,
  "content_tier": "free",
  "has_video": false,
  "xp": 7,
  "tags": [
    "bank_reconciliation_statement",
    "outstanding_deposits_and_efts"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p2/q2/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p2/q2/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p2/q2/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p2/q2/memo_2.png"
  ],
  "exam_question_marks": 7,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Use the information in the figure to calculate the missing amounts A and B.",
    "metadata": [
      "A = ",
      "[ ]",
      "   B = ",
      "[ ]"
    ],
    "answer": [
      "99500",
      "-12800",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "unit": "reconciliations",
    "topic": "bank_reconciliation_statement",
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
    "clues": "- Outstanding EFTs reduce the balance.\n- A bank error in the bank's favour is added back.",
    "supplementary_material": {
      "type": "statement",
      "label": "Bank Reconciliation Statement: Tau Stores",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/accounting/2025/nov_p2/q2/statement_1.png"
      ]
    }
  },
  {
    "name": "Question 2",
    "question": "The bank statement balance is R54 200 favourable. There is an outstanding deposit of R9 800 and an outstanding EFT of R6 400. Calculate the balance as per the bank account.",
    "metadata": [
      "Balance = R ",
      "[ ]"
    ],
    "answer": [
      "57600",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "unit": "reconciliations",
    "topic": "bank_reconciliation_statement",
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
    "question": "A bank clerk debited the business with R11 000 too much. How is this shown in the reconciliation?",
    "metadata": [
      "It is deducted from the balance per bank statement",
      "It is added to the balance per bank statement",
      "It is added to the balance per bank account",
      "It is ignored because the bank will correct it",
      ""
    ],
    "answer": [
      "It is added to the balance per bank statement",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "reconciliations",
    "topic": "bank_reconciliation_statement",
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
    "question": "Select ALL the items that are ADDED to the balance per bank statement.",
    "metadata": [
      "An outstanding EFT",
      "A debit card payment not yet recorded",
      "An outstanding deposit",
      "An EFT overstated by the bank",
      "Service fees on the statement"
    ],
    "answer": [
      "An outstanding deposit",
      "An EFT overstated by the bank",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "reconciliations",
    "topic": "bank_reconciliation_statement",
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
      "number": "1.1.2",
      "marks": 7,
      "clues": "- Start with the balance on the bank statement.\n- Outstanding items and bank errors adjust it to the balance in the bank account.",
      "approach": "- Add outstanding deposits and bank errors that favour the bank.\n- Deduct outstanding EFTs and unrecorded payments.",
      "solution": "1. Balance per bank statement R119 080 + outstanding deposit R41 850 − EFT 207 R7 650 − EFT 208 R10 800 + incorrect EFT R11 000 − debit card payment R13 000.\n2. Balance as per bank account = R140 480."
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
