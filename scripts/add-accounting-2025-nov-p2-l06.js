#!/usr/bin/env node
/**
 * DBE Accounting — November 2025 — Question 2.1: FIFO closing stock and shelf life (order 6)
 * Question 2.1 — closing stock under FIFO, the value of stock past its shelf life, and managing stock to avoid losses.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-accounting-2025-nov-p2-l06.js --curriculum temp/curriculum-vocab-accounting.json
 *   node scripts/add-accounting-2025-nov-p2-l06.js --dry-run
 *   node scripts/add-accounting-2025-nov-p2-l06.js
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
  "name": "Question 2.1: FIFO closing stock and shelf life",
  "syllabus": "dbe",
  "subject": "accounting",
  "year": 2025,
  "paper": "nov_p2",
  "order": 6,
  "content_tier": "free",
  "has_video": false,
  "xp": 13,
  "tags": [
    "fifo_stock_valuation",
    "stock_shelf_life"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p2/q6/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p2/q6/memo_1.png"
  ],
  "exam_question_marks": 13,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Use the information in the figure to calculate A (the units of the November purchase still in stock) and B (the value of the closing stock).",
    "metadata": [
      "A = ",
      "[ ]",
      "   B = ",
      "[ ]"
    ],
    "answer": [
      "125",
      "21225",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "unit": "stock_valuation",
    "topic": "fifo_stock_valuation",
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
    "clues": "- Closing units are the most recent purchases first.\n- Use the unit price of each layer.",
    "supplementary_material": {
      "type": "statement",
      "label": "FIFO stock record: Sunrise Mart",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/accounting/2025/nov_p2/q6/statement_1.png"
      ]
    }
  },
  {
    "name": "Question 2",
    "question": "Closing stock is 400 units: 150 from the latest purchase at R30 and 250 from the earlier purchase at R27. Under FIFO, 90 of the earlier units have passed their sell-by date. Calculate the value of stock that has passed its sell-by date.",
    "metadata": [
      "Value = R ",
      "[ ]"
    ],
    "answer": [
      "2430",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "unit": "stock_valuation",
    "topic": "fifo_stock_valuation",
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
    "paper": "nov_p2",
    "type": "calc"
  },
  {
    "name": "Question 3",
    "question": "Which units make up the closing stock when FIFO is used?",
    "metadata": [
      "The oldest units still in the shop",
      "Units priced at the average cost",
      "Units from the largest purchase",
      "The most recently purchased units",
      ""
    ],
    "answer": [
      "The most recently purchased units",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "stock_valuation",
    "topic": "fifo_stock_valuation",
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
    "question": "Select the TWO ways to avoid losses on stock that is close to its sell-by date.",
    "metadata": [
      "Buy all the stock for the year in one order",
      "Buy stock more often in smaller amounts",
      "Place new stock in front of old stock",
      "Offer old stock at a reduced price",
      "Stop checking the sell-by dates"
    ],
    "answer": [
      "Buy stock more often in smaller amounts",
      "Offer old stock at a reduced price",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "stock_valuation",
    "topic": "inventory_management_decisions",
    "subtopic": "acc_scenario_application",
    "skills": [
      "apply_accounting_concept_to_scenario"
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
      "number": "2.1.1",
      "marks": 7,
      "clues": "- FIFO values the closing stock at the latest purchase prices.\n- Returns reduce the units of the layer they came from.",
      "approach": "- Work out the units left from the last purchases.\n- Multiply each layer by its unit price and add them.",
      "solution": "1. Closing units 980 are made up of 818 February units (R850 − 32 returned) and 162 January units: 818 × R42 = R34 356 and 162 × R37 = R5 994.\n2. Closing stock = R40 350."
    },
    {
      "number": "2.1.2",
      "marks": 2,
      "clues": "- Stock past its sell-by date is the oldest stock still on hand.\n- Under FIFO this is the earliest layer in closing stock.",
      "approach": "- Find the oldest layer in the closing stock.\n- Multiply its units by its price.",
      "solution": "1. 12 units × R37 = R444."
    },
    {
      "number": "2.1.3",
      "marks": 4,
      "clues": "- Think about how much stock is bought and how it is rotated.\n- Give two different ideas.",
      "approach": "- Suggest buying more often and managing expiry dates.",
      "solution": "1. Buy stock more frequently instead of in bulk, offer old stock at a reduced price or use inventory software, and train staff to rotate stock."
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
