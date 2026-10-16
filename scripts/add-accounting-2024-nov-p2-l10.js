#!/usr/bin/env node
/**
 * DBE Accounting — November 2024 — Question 2.2.3: Stockholding period of a new product (order 10)
 * Question 2.2.3 — the number of days needed to sell the closing stock of a product sold for part of the year, and one other concern about it.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-accounting-2024-nov-p2-l10.js --curriculum temp/curriculum-vocab-accounting-2024-p2.json
 *   node scripts/add-accounting-2024-nov-p2-l10.js --dry-run
 *   node scripts/add-accounting-2024-nov-p2-l10.js
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
  "name": "Question 2.2.3: Stockholding period of a new product",
  "syllabus": "dbe",
  "subject": "accounting",
  "year": 2024,
  "paper": "nov_p2",
  "order": 10,
  "content_tier": "free",
  "has_video": false,
  "xp": 6,
  "tags": [
    "stockholding_period",
    "new_product_performance"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2024/nov_p2/q10/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2024/nov_p2/q10/memo_1.png"
  ],
  "exam_question_marks": 6,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Use the information in the figure. Calculate how many days it will take to sell the closing stock of dresses.",
    "metadata": [
      "Days = ",
      "[ ]"
    ],
    "answer": [
      "12",
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
    "difficulty": 4,
    "exam_weight": 3,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "accounting",
    "year": 2024,
    "paper": "nov_p2",
    "type": "calc",
    "clues": "- The dresses were only sold for part of the year.\n- Count the days from 1 December to 28 February.",
    "supplementary_material": {
      "type": "statement",
      "label": "Formal dresses: Fit-Wear Boutique",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/accounting/2024/nov_p2/q10/statement_1.png"
      ]
    }
  },
  {
    "name": "Question 2",
    "question": "A product sold 1 200 units during a 365-day year. Closing stock is 150 units. Calculate the stockholding period in days, to ONE decimal place.",
    "metadata": [
      "Stockholding period = ",
      "[ ]",
      " days"
    ],
    "answer": [
      "45.6|46",
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
    "year": 2024,
    "paper": "nov_p2",
    "type": "calc"
  },
  {
    "name": "Question 3",
    "question": "Select the TWO other points that might concern the owner about the dresses.",
    "metadata": [
      "Too many dresses are left in closing stock",
      "No dresses are sold online",
      "The low mark-up leaves little room if costs rise",
      "The dresses sell more slowly than other items",
      "The price is far above competitors' prices"
    ],
    "answer": [
      "No dresses are sold online",
      "The low mark-up leaves little room if costs rise",
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
      "label": "Formal dresses: Fit-Wear Boutique",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/accounting/2024/nov_p2/q10/statement_1.png"
      ]
    }
  },
  {
    "name": "Question 4",
    "question": "Why must the stockholding period of the dresses be based on 90 days and not 365 days?",
    "metadata": [
      "Dresses are seasonal and always sell within 90 days",
      "They were only on sale for the last three months",
      "The supplier delivers new dresses every 90 days",
      "Customers who buy dresses get 90 days' credit",
      ""
    ],
    "answer": [
      "They were only on sale for the last three months",
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
      "number": "2.2.3",
      "marks": 6,
      "clues": "- Formal shirts were sold only from 1 November 2023 to 29 February 2024 (120 or 121 days).\n- Use units or rand, but do not mix them.",
      "approach": "- Closing stock ÷ units sold × number of days on sale.\n- Give one other concern, such as no online sales or a low mark-up.",
      "solution": "1. 125 ÷ 855 × 120 days = 17,5 days (17,7 days on 121 days; 18 days accepted).\n2. Or (R680 × 125) R85 000 ÷ R581 400 × 120 days.\n3. Concern: no online sales of formal shirts; the low 25% mark-up; or stock running out quickly."
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
