#!/usr/bin/env node
/**
 * DBE Accounting — November 2024 — Question 2.2.1–2.2.2: Mark-up percentage and customer returns (order 9)
 * Questions 2.2.1 and 2.2.2 — the mark-up achieved on trousers and whether it benefits the business, and the negative effect of high returns.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-accounting-2024-nov-p2-l09.js --curriculum temp/curriculum-vocab-accounting-2024-p2.json
 *   node scripts/add-accounting-2024-nov-p2-l09.js --dry-run
 *   node scripts/add-accounting-2024-nov-p2-l09.js
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
  "name": "Question 2.2.1–2.2.2: Mark-up percentage and customer returns",
  "syllabus": "dbe",
  "subject": "accounting",
  "year": 2024,
  "paper": "nov_p2",
  "order": 9,
  "content_tier": "free",
  "has_video": false,
  "xp": 7,
  "tags": [
    "mark_up_percentage",
    "pricing_decision_effect"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2024/nov_p2/q9/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2024/nov_p2/q9/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2024/nov_p2/q9/memo_2.png"
  ],
  "exam_question_marks": 7,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Use the information in the figure. Calculate the mark-up percentage A achieved on jackets.",
    "metadata": [
      "A = ",
      "[ ]",
      " %"
    ],
    "answer": [
      "80",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "unit": "stock_valuation",
    "topic": "mark_up_and_pricing",
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
    "clues": "- Mark-up is calculated on cost price, not on selling price.",
    "supplementary_material": {
      "type": "statement",
      "label": "Product information: Fit-Wear Boutique",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/accounting/2024/nov_p2/q9/statement_1.png"
      ]
    }
  },
  {
    "name": "Question 2",
    "question": "A pair of trousers costs R450 and sells for R720. Calculate the mark-up percentage.",
    "metadata": [
      "Mark-up = ",
      "[ ]",
      " %"
    ],
    "answer": [
      "60",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "unit": "stock_valuation",
    "topic": "mark_up_and_pricing",
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
    "year": 2024,
    "paper": "nov_p2",
    "type": "calc"
  },
  {
    "name": "Question 3",
    "question": "The jackets in the figure have a high mark-up and a stockholding period of 172 days. What is the most likely effect on the business?",
    "metadata": [
      "Customers buy more jackets because the price shows quality",
      "The business sells its jackets faster than its T-shirts",
      "Cash flow improves because every jacket earns more profit",
      "Customers buy elsewhere, so jackets sell slowly and date",
      ""
    ],
    "answer": [
      "Customers buy elsewhere, so jackets sell slowly and date",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "stock_valuation",
    "topic": "mark_up_and_pricing",
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
    "year": 2024,
    "paper": "nov_p2",
    "type": "interpretation",
    "supplementary_material": {
      "type": "statement",
      "label": "Product information: Fit-Wear Boutique",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/accounting/2024/nov_p2/q9/statement_1.png"
      ]
    }
  },
  {
    "name": "Question 4",
    "question": "Customers returned 150 T-shirts. Select the TWO negative effects on the business.",
    "metadata": [
      "A higher mark-up on each T-shirt sold",
      "A lower cost price from the supplier",
      "Lower sales revenue and gross profit",
      "Damage to the business's reputation",
      "Faster payment by credit customers"
    ],
    "answer": [
      "Lower sales revenue and gross profit",
      "Damage to the business's reputation",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "stock_valuation",
    "topic": "mark_up_and_pricing",
    "subtopic": "acc_interpretation",
    "skills": [
      "interpret_financial_indicators"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "accounting",
    "year": 2024,
    "paper": "nov_p2",
    "type": "interpretation"
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "2.2.1",
      "marks": 5,
      "clues": "- Mark-up % = (selling price − cost price) ÷ cost price × 100.\n- A high mark-up must be judged against how fast the stock sells.",
      "approach": "- Calculate the mark-up on one pair of trousers (or on total sales and cost of sales).\n- Link the mark-up to the stockholding period of 186 days.",
      "solution": "1. (R920 − R500) ÷ R500 × 100 = 84% (or (R515 200 − R280 000) ÷ R280 000 × 100).\n2. Not beneficial: price-sensitive customers buy elsewhere; the 186-day stockholding period shows slow sales and stock going out of fashion."
    },
    {
      "number": "2.2.2",
      "marks": 2,
      "clues": "- 120 of the casual shirts sold came back.",
      "approach": "- Give one negative effect of high returns.",
      "solution": "1. Lost revenue and lower gross profit, damage to the business's reputation, or extra cost to prepare returned shirts for resale."
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
