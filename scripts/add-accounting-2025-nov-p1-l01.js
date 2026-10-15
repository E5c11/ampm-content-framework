#!/usr/bin/env node
/**
 * DBE Accounting — November 2025 — Question 1.1: Closing stock at weighted average cost (order 1)
 * Question 1.1 — correcting the closing stock from FIFO to the weighted-average method using opening stock, purchases and returns.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-accounting-2025-nov-p1-l01.js --curriculum temp/curriculum-vocab-accounting.json
 *   node scripts/add-accounting-2025-nov-p1-l01.js --dry-run
 *   node scripts/add-accounting-2025-nov-p1-l01.js
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
  "name": "Question 1.1: Closing stock at weighted average cost",
  "syllabus": "dbe",
  "subject": "accounting",
  "year": 2025,
  "paper": "nov_p1",
  "order": 1,
  "content_tier": "free",
  "has_video": false,
  "xp": 6,
  "tags": [
    "weighted_average_stock_valuation",
    "closing_stock_correction"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p1/q1/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p1/q1/question_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p1/q1/question_3.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p1/q1/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p1/q1/memo_2.png"
  ],
  "exam_question_marks": 6,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "A shop recorded this for one brand of jackets. Stock on 1 March: 400 units costing R78 000 in total. Purchases: 3 600 units costing R780 000 in total. Returns to the supplier: 200 units costing R41 000 in total. Calculate the weighted-average cost per unit.",
    "metadata": [
      "Cost per unit = R ",
      "[ ]"
    ],
    "answer": [
      "215",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "unit": "company_financial_statements",
    "topic": "closing_stock_valuation",
    "subtopic": "acc_calculation",
    "skills": [
      "calculate_accounting_amount"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "accounting",
    "year": 2025,
    "paper": "nov_p1",
    "type": "calc",
    "clues": "- Returns reduce both the total cost and the number of units."
  },
  {
    "name": "Question 2",
    "question": "The shop above has 700 units on hand at the end of the year. Its closing stock was valued at R158 000 using FIFO. It must be corrected to the weighted-average cost of R215 per unit. Calculate the adjustment to inventories (enter a decrease as a negative number).",
    "metadata": [
      "Adjustment = R ",
      "[ ]"
    ],
    "answer": [
      "-7500",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "unit": "company_financial_statements",
    "topic": "closing_stock_valuation",
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
    "question": "How is the weighted-average cost per unit calculated?",
    "metadata": [
      "Cost of the most recent purchase ÷ units in that purchase",
      "Total cost of stock available ÷ total units available",
      "Cost of the oldest stock on hand ÷ units of that oldest stock",
      "Total purchases at cost ÷ number of units sold in the year",
      ""
    ],
    "answer": [
      "Total cost of stock available ÷ total units available",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "company_financial_statements",
    "topic": "closing_stock_valuation",
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
    "question": "Select ALL the statements that are true about the weighted-average method.",
    "metadata": [
      "Only the most recent purchase price is used",
      "Returns to the supplier reduce both total cost and total units",
      "Opening stock is included in the calculation",
      "One unit cost is applied to all units on hand",
      "Returns to the supplier are ignored in the calculation"
    ],
    "answer": [
      "Returns to the supplier reduce both total cost and total units",
      "One unit cost is applied to all units on hand",
      "Opening stock is included in the calculation",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "company_financial_statements",
    "topic": "closing_stock_valuation",
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
      "number": "1.1",
      "marks": 6,
      "clues": "- The closing stock was valued on FIFO but the method used must be weighted average.\n- Returns reduce both the cost and the quantity.",
      "approach": "- Add opening stock and purchases, then subtract returns, for both cost and units.\n- Divide total cost by total units, then multiply by the closing units.",
      "solution": "1. Total cost = R97 500 + R1 605 000 – R42 500 = R1 660 000.\n2. Total units = 300 + 4 800 – 100 = 5 000, so the weighted-average cost is R1 660 000 ÷ 5 000 = R332 per unit.\n3. Correct closing stock = R332 × 820 units = R272 240 (the figure given was R285 500, so inventories are reduced by R13 260)."
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
