#!/usr/bin/env node
/**
 * DBE Accounting — November 2024 — Question 2.1.1–2.1.2: Weighted-average cost and stolen stock (order 6)
 * Questions 2.1.1 and 2.1.2 — the weighted-average cost of one unit, the number of units stolen and their value.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-accounting-2024-nov-p2-l06.js --curriculum temp/curriculum-vocab-accounting-2024-p2.json
 *   node scripts/add-accounting-2024-nov-p2-l06.js --dry-run
 *   node scripts/add-accounting-2024-nov-p2-l06.js
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
  "name": "Question 2.1.1–2.1.2: Weighted-average cost and stolen stock",
  "syllabus": "dbe",
  "subject": "accounting",
  "year": 2024,
  "paper": "nov_p2",
  "order": 6,
  "content_tier": "free",
  "has_video": false,
  "xp": 11,
  "tags": [
    "weighted_average_stock_valuation",
    "stock_theft"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2024/nov_p2/q6/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2024/nov_p2/q6/memo_1.png"
  ],
  "exam_question_marks": 11,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Use the information in the figure. Calculate the weighted-average cost of ONE pair of sneakers.",
    "metadata": [
      "Weighted-average cost = R ",
      "[ ]"
    ],
    "answer": [
      "2750",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "unit": "stock_valuation",
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
    "year": 2024,
    "paper": "nov_p2",
    "type": "calc",
    "clues": "- Include the opening stock with the purchases.\n- Returns have already been deducted from the purchases.",
    "supplementary_material": {
      "type": "statement",
      "label": "Purchases: Sole Sneakers",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/accounting/2024/nov_p2/q6/statement-v2_1.png"
      ]
    }
  },
  {
    "name": "Question 2",
    "question": "Use the information in the figure. Calculate the number of pairs that were stolen during the year.",
    "metadata": [
      "Pairs stolen = ",
      "[ ]"
    ],
    "answer": [
      "70",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "unit": "stock_valuation",
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
    "year": 2024,
    "paper": "nov_p2",
    "type": "calc",
    "clues": "- Start with all the pairs available for sale.",
    "supplementary_material": {
      "type": "statement",
      "label": "Purchases: Sole Sneakers",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/accounting/2024/nov_p2/q6/statement-v2_1.png"
      ]
    }
  },
  {
    "name": "Question 3",
    "question": "Which calculation gives the number of units stolen during the year?",
    "metadata": [
      "Units purchased − units sold − units counted",
      "Units available for sale − units sold + units counted",
      "Opening units + units sold − units counted",
      "Units available for sale − units sold − units counted",
      ""
    ],
    "answer": [
      "Units available for sale − units sold − units counted",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "stock_valuation",
    "topic": "closing_stock_valuation",
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
    "question": "Select ALL the items used to calculate the weighted-average cost of one unit.",
    "metadata": [
      "Units sold at the selling price",
      "Opening stock units and cost",
      "Returns to the supplier, deducted",
      "Purchases during the year",
      "Units counted at the year-end"
    ],
    "answer": [
      "Opening stock units and cost",
      "Purchases during the year",
      "Returns to the supplier, deducted",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "stock_valuation",
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
    "year": 2024,
    "paper": "nov_p2",
    "type": "application"
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "2.1.1",
      "marks": 5,
      "clues": "- Weighted average uses the total cost of all units available for sale.\n- Opening stock and net purchases (after returns) are both included.",
      "approach": "- Add the cost of opening stock and purchases.\n- Divide by the total number of units available.",
      "solution": "1. (R1 719 000 + R8 781 000) ÷ (620 + 2 380) = R10 500 000 ÷ 3 000 = R3 500 per pair."
    },
    {
      "number": "2.1.2",
      "marks": 6,
      "clues": "- Units available minus units sold should equal the units counted.\n- The difference is the number stolen.",
      "approach": "- Subtract the units sold and the units counted from the units available.\n- Value the stolen units at the weighted-average cost.",
      "solution": "1. Units stolen: 3 000 − 2 050 − 840 = 110 pairs.\n2. Value: 110 × R3 500 = R385 000."
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
