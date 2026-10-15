#!/usr/bin/env node
/**
 * DBE Accounting — November 2025 — Question 2.2: Cash flow statement — operating activities (order 8)
 * Question 2.2 (operating) — taxation paid and dividends paid in the Cash Flow Statement.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-accounting-2025-nov-p1-l08.js --curriculum temp/curriculum-vocab-accounting.json
 *   node scripts/add-accounting-2025-nov-p1-l08.js --dry-run
 *   node scripts/add-accounting-2025-nov-p1-l08.js
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
  "name": "Question 2.2: Cash flow statement — operating activities",
  "syllabus": "dbe",
  "subject": "accounting",
  "year": 2025,
  "paper": "nov_p1",
  "order": 8,
  "content_tier": "free",
  "has_video": false,
  "xp": 8,
  "tags": [
    "company_cash_flow_statement",
    "taxation_paid",
    "dividends_paid"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p1/q8/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p1/q8/question_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p1/q8/question_3.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p1/q8/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p1/q8/memo_2.png"
  ],
  "exam_question_marks": 8,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "The tax expense was R120 000. SARS: income tax was a receivable of R8 000 at the beginning and a payable of R14 000 at the end. An interim dividend of R120 000 was paid. Shareholders for dividends were R81 000 at the beginning and R90 000 at the end. Calculate A and B as negative numbers.",
    "metadata": [
      "A = ",
      "[ ]",
      "   B = ",
      "[ ]"
    ],
    "answer": [
      "-98000",
      "-201000",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "unit": "cash_flow_statement",
    "topic": "cash_flow_operating_activities",
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
    "clues": "- Last year's final dividend is paid this year.\n- A receivable and a payable at SARS work in opposite directions.",
    "supplementary_material": {
      "type": "table",
      "label": "Cash Flow Statement (extract): Pike Ltd",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/accounting/2025/nov_p1/q8/table_1.png"
      ]
    }
  },
  {
    "name": "Question 2",
    "question": "The tax expense was R150 000. SARS: income tax was a payable of R10 000 at the beginning and a receivable of R6 000 at the end. Calculate the taxation paid (enter an outflow as a negative number).",
    "metadata": [
      "Taxation paid = R ",
      "[ ]"
    ],
    "answer": [
      "-166000",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "unit": "cash_flow_statement",
    "topic": "cash_flow_operating_activities",
    "subtopic": "acc_calculation",
    "skills": [
      "calculate_accounting_amount"
    ],
    "difficulty": 4,
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
    "question": "Under which heading of the Cash Flow Statement are dividends paid shown?",
    "metadata": [
      "Cash flow from investing activities",
      "Cash flow from financing activities",
      "Cash flow from operating activities",
      "Net change in cash and cash equivalents",
      ""
    ],
    "answer": [
      "Cash flow from operating activities",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "cash_flow_statement",
    "topic": "cash_flow_operating_activities",
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
    "paper": "nov_p1",
    "type": "definition"
  },
  {
    "name": "Question 4",
    "question": "Select ALL the items shown under operating activities.",
    "metadata": [
      "Sale of fixed assets",
      "Cash generated from operations",
      "Taxation paid",
      "Interest paid",
      "Shares repurchased"
    ],
    "answer": [
      "Cash generated from operations",
      "Interest paid",
      "Taxation paid",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "cash_flow_statement",
    "topic": "cash_flow_operating_activities",
    "subtopic": "acc_classification",
    "skills": [
      "classify_accounting_concept"
    ],
    "difficulty": 2,
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
      "number": "2.2",
      "marks": 8,
      "clues": "- Taxation paid depends on the tax expense and on the SARS balances at the beginning and end.\n- The dividends paid are given in the information.",
      "approach": "- Work out how much was paid to SARS from the expense and both balances.\n- Show every amount paid as a negative number.",
      "solution": "1. Taxation paid = R201 600 – R32 000 – R15 300 = R154 300, shown as (154 300).\n2. Dividends paid are R252 000 from the information, shown as (252 000); interest paid is (316 250)."
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
