#!/usr/bin/env node
/**
 * DBE Accounting — November 2024 — Question 2.1.3: Closing stock using FIFO (order 7)
 * Question 2.1.3 — valuing closing stock with the first-in-first-out method, working back from the latest purchases (net of returns).
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-accounting-2024-nov-p2-l07.js --curriculum temp/curriculum-vocab-accounting-2024-p2.json
 *   node scripts/add-accounting-2024-nov-p2-l07.js --dry-run
 *   node scripts/add-accounting-2024-nov-p2-l07.js
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
  "name": "Question 2.1.3: Closing stock using FIFO",
  "syllabus": "dbe",
  "subject": "accounting",
  "year": 2024,
  "paper": "nov_p2",
  "order": 7,
  "content_tier": "free",
  "has_video": false,
  "xp": 5,
  "tags": [
    "fifo_stock_valuation",
    "stock_valuation_methods"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2024/nov_p2/q7/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2024/nov_p2/q7/memo_1.png"
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
      "268800",
      "140",
      "394800",
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
    "year": 2024,
    "paper": "nov_p2",
    "type": "calc",
    "clues": "- Under FIFO the latest purchases are still on hand.\n- B is in units; A and C are in rand.",
    "supplementary_material": {
      "type": "statement",
      "label": "Closing stock (FIFO): Pebble Bags",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/accounting/2024/nov_p2/q7/statement_1.png"
      ]
    }
  },
  {
    "name": "Question 2",
    "question": "A business has 250 units in closing stock. Its last purchase was 180 units at R120 each; the one before was 300 units at R110 each. Calculate closing stock using FIFO.",
    "metadata": [
      "Closing stock = R ",
      "[ ]"
    ],
    "answer": [
      "29300",
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
    "year": 2024,
    "paper": "nov_p2",
    "type": "calc"
  },
  {
    "name": "Question 3",
    "question": "Under the FIFO method, which units are assumed to remain in closing stock?",
    "metadata": [
      "The units that were purchased earliest in the year",
      "An average of all the units bought in the year",
      "The units that were purchased most recently",
      "The units that had the lowest cost price",
      ""
    ],
    "answer": [
      "The units that were purchased most recently",
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
    "year": 2024,
    "paper": "nov_p2",
    "type": "definition"
  },
  {
    "name": "Question 4",
    "question": "Select ALL the statements that are TRUE of the FIFO method.",
    "metadata": [
      "Closing stock is valued at an average price",
      "Closing stock is valued at the latest prices",
      "Cost of sales uses the earliest prices",
      "Each item is tagged with its own cost",
      "Returns are valued at the opening price"
    ],
    "answer": [
      "Closing stock is valued at the latest prices",
      "Cost of sales uses the earliest prices",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "stock_valuation",
    "topic": "fifo_stock_valuation",
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
      "number": "2.1.3",
      "marks": 5,
      "clues": "- FIFO assumes the oldest stock is sold first, so closing stock comes from the latest purchases.\n- Deduct the returns from the purchase they came from.",
      "approach": "- Take units from the latest purchase first, then the one before, until 840 units are reached.\n- Value each batch at its own unit price.",
      "solution": "1. November: (745 − 20) = 725 × R4 200 = R3 045 000.\n2. August: (840 − 725) = 115 × R3 750 = R431 250.\n3. Closing stock (FIFO) = R3 476 250."
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
