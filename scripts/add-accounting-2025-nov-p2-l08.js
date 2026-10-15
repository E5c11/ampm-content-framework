#!/usr/bin/env node
/**
 * DBE Accounting — November 2025 — Question 2.2.3: Introducing a new model (order 8)
 * Question 2.2.3 — quoting figures to show why a new model was a good decision, and reducing returns to the supplier.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-accounting-2025-nov-p2-l08.js --curriculum temp/curriculum-vocab-accounting.json
 *   node scripts/add-accounting-2025-nov-p2-l08.js --dry-run
 *   node scripts/add-accounting-2025-nov-p2-l08.js
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
  "name": "Question 2.2.3: Introducing a new model",
  "syllabus": "dbe",
  "subject": "accounting",
  "year": 2025,
  "paper": "nov_p2",
  "order": 8,
  "content_tier": "free",
  "has_video": false,
  "xp": 6,
  "tags": [
    "new_product_performance",
    "returns_to_suppliers"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p2/q8/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p2/q8/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p2/q8/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p2/q8/memo_2.png"
  ],
  "exam_question_marks": 6,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "The owner is pleased with the new Aero model. Select the TWO statements, with figures, that explain why.",
    "metadata": [
      "It sold fewer units in total than the other models",
      "Gross profit per unit is R11 000, higher than the others",
      "It sold 12 units a month, more than the other models",
      "Its gross profit per unit is below Beta's",
      "It was on sale for fewer months than Beta"
    ],
    "answer": [
      "Gross profit per unit is R11 000, higher than the others",
      "It sold 12 units a month, more than the other models",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "stock_valuation",
    "topic": "inventory_management_decisions",
    "subtopic": "acc_interpretation",
    "skills": [
      "interpret_financial_indicators"
    ],
    "difficulty": 4,
    "exam_weight": 3,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "accounting",
    "year": 2025,
    "paper": "nov_p2",
    "type": "interpretation",
    "supplementary_material": {
      "type": "statement",
      "label": "Model performance: Paragon Cycles",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/accounting/2025/nov_p2/q8/statement_1.png"
      ]
    }
  },
  {
    "name": "Question 2",
    "question": "Calculate the percentage of the available Aero units that were sold, to ONE decimal place (without the % sign).",
    "metadata": [
      "Percentage sold = ",
      "[ ]",
      " %"
    ],
    "answer": [
      "85.7|86",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "unit": "stock_valuation",
    "topic": "inventory_management_decisions",
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
    "year": 2025,
    "paper": "nov_p2",
    "type": "calc",
    "supplementary_material": {
      "type": "statement",
      "label": "Model performance: Paragon Cycles",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/accounting/2025/nov_p2/q8/statement_1.png"
      ]
    }
  },
  {
    "name": "Question 3",
    "question": "Calculate the average number of Aero units sold per month.",
    "metadata": [
      "Average = ",
      "[ ]",
      " units"
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
    "topic": "inventory_management_decisions",
    "subtopic": "acc_calculation",
    "skills": [
      "calculate_accounting_amount"
    ],
    "difficulty": 1,
    "exam_weight": 1,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "accounting",
    "year": 2025,
    "paper": "nov_p2",
    "type": "calc",
    "supplementary_material": {
      "type": "statement",
      "label": "Model performance: Paragon Cycles",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/accounting/2025/nov_p2/q8/statement_1.png"
      ]
    }
  },
  {
    "name": "Question 4",
    "question": "Which suggestion would best reduce the number of units returned to the supplier?",
    "metadata": [
      "Order twice as many units each month",
      "Ask the supplier for a guarantee or warranty",
      "Stop recording returns in the books",
      "Lower the selling price of every model",
      ""
    ],
    "answer": [
      "Ask the supplier for a guarantee or warranty",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
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
      "number": "2.2.3",
      "marks": 6,
      "clues": "- Compare the new model with the other two, using figures.\n- The returns suggestion must be about faulty stock.",
      "approach": "- Use profit per unit, units sold per month, the percentage of stock sold or the stockholding period.\n- Suggest a way to reduce faulty units.",
      "solution": "1. Each Clear View printer earns R14 000 profit, higher than the other two, and 13 printers a month were sold against 7 and 8.\n2. It sold 86,7% of the available printers and its stockholding period is 23,1 days.\n3. A suggestion: ask for a guarantee, change supplier or check printers on arrival."
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
