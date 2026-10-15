#!/usr/bin/env node
/**
 * DBE Accounting — November 2025 — Question 2.1: Change in receivables and payables (order 7)
 * Question 2.1 — the changes in receivables and payables in the Reconciliation of Profit before Taxation and Cash Generated from Operations note, with inflow or outflow.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-accounting-2025-nov-p1-l07.js --curriculum temp/curriculum-vocab-accounting.json
 *   node scripts/add-accounting-2025-nov-p1-l07.js --dry-run
 *   node scripts/add-accounting-2025-nov-p1-l07.js
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
  "name": "Question 2.1: Change in receivables and payables",
  "syllabus": "dbe",
  "subject": "accounting",
  "year": 2025,
  "paper": "nov_p1",
  "order": 7,
  "content_tier": "free",
  "has_video": false,
  "xp": 7,
  "tags": [
    "cash_generated_from_operations",
    "change_in_receivables",
    "change_in_payables"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p1/q7/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p1/q7/question_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p1/q7/question_3.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p1/q7/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p1/q7/memo_2.png"
  ],
  "exam_question_marks": 7,
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
      "-280000",
      "77000",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "unit": "cash_flow_statement",
    "topic": "cash_generated_from_operations",
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
    "clues": "- Compare this year's balances with last year's.\n- Payables here are creditors and accrued expenses only.",
    "supplementary_material": {
      "type": "statement",
      "label": "Cash generated from operations (extract): Pike Ltd",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/accounting/2025/nov_p1/q7/statement_1.png"
      ]
    }
  },
  {
    "name": "Question 2",
    "question": "The debtors' balance increased by R90 000 during the year. What is the effect on cash generated from operations?",
    "metadata": [
      "A cash inflow, because sales increased during the year",
      "No effect, because debtors are not a cash item",
      "A cash inflow, because more credit was given to customers",
      "A cash outflow, because more was owed than was collected",
      ""
    ],
    "answer": [
      "A cash outflow, because more was owed than was collected",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "cash_flow_statement",
    "topic": "cash_generated_from_operations",
    "subtopic": "acc_classification",
    "skills": [
      "classify_accounting_concept"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "accounting",
    "year": 2025,
    "paper": "nov_p1",
    "type": "application"
  },
  {
    "name": "Question 3",
    "question": "Select ALL the items included in the change in trade and other payables for the cash flow note.",
    "metadata": [
      "Shareholders for dividends",
      "Creditors' control",
      "SARS: income tax",
      "Accrued expenses",
      "Mortgage loan"
    ],
    "answer": [
      "Creditors' control",
      "Accrued expenses",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "cash_flow_statement",
    "topic": "cash_generated_from_operations",
    "subtopic": "acc_classification",
    "skills": [
      "classify_accounting_concept"
    ],
    "difficulty": 4,
    "exam_weight": 2,
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
    "question": "Creditors' control was R345 000 (2026) and R280 000 (2025). Accrued expenses were R18 000 and nil. Shareholders for dividends were R60 000 and R50 000. Calculate the change in payables (an inflow is positive).",
    "metadata": [
      "Change in payables = R ",
      "[ ]"
    ],
    "answer": [
      "83000",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "unit": "cash_flow_statement",
    "topic": "cash_generated_from_operations",
    "subtopic": "acc_calculation",
    "skills": [
      "calculate_accounting_amount"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "accounting",
    "year": 2025,
    "paper": "nov_p1",
    "type": "calc"
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "2.1",
      "marks": 7,
      "clues": "- Receivables and payables are compared year on year, and the note asks for inflow or outflow.\n- Taxation and dividends are dealt with elsewhere in the cash flow statement.",
      "approach": "- Subtract the opening balance from the closing balance of each item.\n- Decide whether cash came in or went out: an increase in receivables is an outflow, an increase in payables an inflow.",
      "solution": "1. Receivables: R3 167 000 – R1 303 500 = R1 863 500, an outflow because more is owed to the company.\n2. Payables: (R1 450 000 + R14 600) – R1 323 500 = R141 100, an inflow because more is owed to creditors."
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
