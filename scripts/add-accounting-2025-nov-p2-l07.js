#!/usr/bin/env node
/**
 * DBE Accounting — November 2025 — Question 2.2.1–2.2.2: Specific identification and stockholding period (order 7)
 * Questions 2.2.1 and 2.2.2 — closing stock under the specific identification method, the stockholding period, and what a change in it shows.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-accounting-2025-nov-p2-l07.js --curriculum temp/curriculum-vocab-accounting.json
 *   node scripts/add-accounting-2025-nov-p2-l07.js --dry-run
 *   node scripts/add-accounting-2025-nov-p2-l07.js
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
  "name": "Question 2.2.1–2.2.2: Specific identification and stockholding period",
  "syllabus": "dbe",
  "subject": "accounting",
  "year": 2025,
  "paper": "nov_p2",
  "order": 7,
  "content_tier": "free",
  "has_video": false,
  "xp": 11,
  "tags": [
    "specific_identification",
    "stockholding_period"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p2/q7/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p2/q7/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p2/q7/memo_1.png"
  ],
  "exam_question_marks": 11,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Use the information in the figure to calculate A (closing stock of the Trail model) and B (the stockholding period of the Road model).",
    "metadata": [
      "A = ",
      "[ ]",
      "   B = ",
      "[ ]"
    ],
    "answer": [
      "225000",
      "66.4|66",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "unit": "stock_valuation",
    "topic": "stockholding_period",
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
    "clues": "- The stockholding period uses the closing stock and the cost of sales.\n- Multiply by 365 days.",
    "supplementary_material": {
      "type": "statement",
      "label": "Bicycle stock: Paragon Cycles",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/accounting/2025/nov_p2/q7/statement_1.png"
      ]
    }
  },
  {
    "name": "Question 2",
    "question": "Closing stock is R90 000 and cost of sales is R540 000. Calculate the stockholding period in days, to ONE decimal place.",
    "metadata": [
      "Stockholding period = ",
      "[ ]",
      " days"
    ],
    "answer": [
      "60.8|61",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "unit": "stock_valuation",
    "topic": "stockholding_period",
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
    "question": "The stockholding period increased from 48 days to 66 days. What does this show?",
    "metadata": [
      "Stock is being sold faster than before",
      "The business is buying less stock for cash",
      "Stock is moving more slowly and cash is tied up",
      "Cost of sales has decreased",
      ""
    ],
    "answer": [
      "Stock is moving more slowly and cash is tied up",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "stock_valuation",
    "topic": "stockholding_period",
    "subtopic": "acc_interpretation",
    "skills": [
      "interpret_financial_indicators"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "accounting",
    "year": 2025,
    "paper": "nov_p2",
    "type": "interpretation"
  },
  {
    "name": "Question 4",
    "question": "Select the TWO possible reasons for a longer stockholding period.",
    "metadata": [
      "Customers are buying faster than before",
      "The business reduced its storage costs",
      "A new model has made older models outdated",
      "Stock is piling up because of delayed sales",
      "Stock was sold at a lower price"
    ],
    "answer": [
      "A new model has made older models outdated",
      "Stock is piling up because of delayed sales",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "stock_valuation",
    "topic": "stockholding_period",
    "subtopic": "acc_interpretation",
    "skills": [
      "interpret_financial_indicators"
    ],
    "difficulty": 4,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "accounting",
    "year": 2025,
    "paper": "nov_p2",
    "type": "interpretation"
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "2.2.1",
      "marks": 4,
      "clues": "- Specific identification values each unit at its own cost.\n- Closing units = opening + purchases − sold.",
      "approach": "- Find the closing units, then multiply by the cost of each unit.",
      "solution": "1. Closing units = 30 + 90 − 79 = 41; closing stock = 41 × R15 500 = R635 500."
    },
    {
      "number": "2.2.2",
      "marks": 7,
      "clues": "- The formula uses closing stock and cost of sales.\n- The comment compares with the previous year.",
      "approach": "- Calculate cost of sales = opening stock + purchases − closing stock, then closing stock ÷ cost of sales × 365.\n- Say whether the period increased or decreased and why this is a concern.",
      "solution": "1. Cost of sales = R557 500 + R2 453 000 − R780 500 = R2 230 000; period = 780 500 ÷ 2 230 000 × 365 = 127,8 days.\n2. It increased from 69 days to 127,8 days, so stock is moving slowly and cash is tied up."
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
