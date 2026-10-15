#!/usr/bin/env node
/**
 * DBE Accounting — November 2025 — Question 2.2: Cash flow statement — investing activities (order 9)
 * Question 2.2 (investing) — fixed assets purchased and the sale of a fixed asset at carrying value.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-accounting-2025-nov-p1-l09.js --curriculum temp/curriculum-vocab-accounting.json
 *   node scripts/add-accounting-2025-nov-p1-l09.js --dry-run
 *   node scripts/add-accounting-2025-nov-p1-l09.js
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
  "name": "Question 2.2: Cash flow statement — investing activities",
  "syllabus": "dbe",
  "subject": "accounting",
  "year": 2025,
  "paper": "nov_p1",
  "order": 9,
  "content_tier": "free",
  "has_video": false,
  "xp": 8,
  "tags": [
    "company_cash_flow_statement",
    "fixed_assets_purchased",
    "sale_of_fixed_assets"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p1/q9/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p1/q9/question_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p1/q9/question_3.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p1/q9/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p1/q9/memo_2.png"
  ],
  "exam_question_marks": 8,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Vehicles at cost were R1 800 000 (2026) and R1 500 000 (2025) and none were sold. An old machine with a cost of R80 000 and a carrying value of R31 000 on 1 March 2025 was sold for cash at carrying value on 31 July 2025. Equipment is depreciated at 12% p.a. on cost. Calculate A (an outflow is negative) and B.",
    "metadata": [
      "A = ",
      "[ ]",
      "   B = ",
      "[ ]"
    ],
    "answer": [
      "-300000",
      "27000",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "unit": "cash_flow_statement",
    "topic": "cash_flow_investing_activities",
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
    "clues": "- Depreciate the machine up to the date it was sold.\n- It was sold at its carrying value.",
    "supplementary_material": {
      "type": "table",
      "label": "Cash Flow Statement (extract): Pike Ltd",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/accounting/2025/nov_p1/q9/table_1.png"
      ]
    }
  },
  {
    "name": "Question 2",
    "question": "An asset with a cost of R80 000 is depreciated at 12% p.a. on cost. Calculate the depreciation for the five months before it is sold.",
    "metadata": [
      "Depreciation = R ",
      "[ ]"
    ],
    "answer": [
      "4000",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "unit": "cash_flow_statement",
    "topic": "cash_flow_investing_activities",
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
    "year": 2025,
    "paper": "nov_p1",
    "type": "calc"
  },
  {
    "name": "Question 3",
    "question": "Where is the cash received from selling a fixed asset shown?",
    "metadata": [
      "Cash flow from operating activities",
      "Cash flow from investing activities",
      "Cash flow from financing activities",
      "Cash generated from operations",
      ""
    ],
    "answer": [
      "Cash flow from investing activities",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "cash_flow_statement",
    "topic": "cash_flow_investing_activities",
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
    "question": "Select ALL the items shown under investing activities.",
    "metadata": [
      "Dividends paid",
      "Change in a fixed deposit",
      "Fixed assets purchased",
      "Sale of fixed assets",
      "Shares issued"
    ],
    "answer": [
      "Fixed assets purchased",
      "Sale of fixed assets",
      "Change in a fixed deposit",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "cash_flow_statement",
    "topic": "cash_flow_investing_activities",
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
      "clues": "- A new vehicle was bought during the year and no vehicles were sold.\n- The old fridge was sold for cash at its carrying value.",
      "approach": "- Find the cost of the vehicle bought from the change in the cost balance.\n- Calculate depreciation up to the date of sale, then reduce the carrying value.",
      "solution": "1. Fixed asset purchased = R2 900 000 – R2 520 000 = R380 000, shown as an outflow.\n2. Sale of fixed asset: depreciation R55 000 × 15% × 4 ÷ 12 = R2 750, so the carrying value is R16 000 – R2 750 = R13 250 received in cash."
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
