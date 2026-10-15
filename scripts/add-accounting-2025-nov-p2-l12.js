#!/usr/bin/env node
/**
 * DBE Accounting — November 2025 — Question 3.2.3–3.2.4: Control over fixed and variable costs (order 12)
 * Questions 3.2.3 and 3.2.4 — spotting poorly and well controlled cost items with figures, with reasons and advice.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-accounting-2025-nov-p2-l12.js --curriculum temp/curriculum-vocab-accounting.json
 *   node scripts/add-accounting-2025-nov-p2-l12.js --dry-run
 *   node scripts/add-accounting-2025-nov-p2-l12.js
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
  "name": "Question 3.2.3–3.2.4: Control over fixed and variable costs",
  "syllabus": "dbe",
  "subject": "accounting",
  "year": 2025,
  "paper": "nov_p2",
  "order": 12,
  "content_tier": "free",
  "has_video": false,
  "xp": 9,
  "tags": [
    "cost_control_interpretation",
    "variable_and_fixed_costs"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p2/q12/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p2/q12/question_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p2/q12/question_3.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p2/q12/memo_1.png"
  ],
  "exam_question_marks": 9,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Which fixed-cost item was poorly controlled, even though the total fixed cost per unit decreased?",
    "metadata": [
      "Factory overhead cost, which fell from R44 to R30",
      "Direct material cost, which rose from R48 to R61",
      "Direct labour cost, which fell from R34 to R30",
      "Administration cost, which rose from R41 to R50",
      ""
    ],
    "answer": [
      "Administration cost, which rose from R41 to R50",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "cost_accounting",
    "topic": "cost_control_interpretation",
    "subtopic": "acc_interpretation",
    "skills": [
      "interpret_financial_indicators"
    ],
    "difficulty": 3,
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
      "label": "Cost per unit: Brightway Chargers",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/accounting/2025/nov_p2/q12/statement_1.png"
      ]
    }
  },
  {
    "name": "Question 2",
    "question": "By what percentage did the direct material cost per unit increase? Round off to ONE decimal place (without the % sign).",
    "metadata": [
      "Increase = ",
      "[ ]",
      " %"
    ],
    "answer": [
      "27.1",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "unit": "cost_accounting",
    "topic": "cost_control_interpretation",
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
    "type": "calc",
    "supplementary_material": {
      "type": "statement",
      "label": "Cost per unit: Brightway Chargers",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/accounting/2025/nov_p2/q12/statement_1.png"
      ]
    }
  },
  {
    "name": "Question 3",
    "question": "Which variable-cost item was well controlled?",
    "metadata": [
      "Direct material cost, which fell from R61 to R48",
      "Direct labour cost, which fell from R34 to R30",
      "Selling cost, which fell from R12 to R11",
      "Administration cost, which fell from R50 to R41",
      ""
    ],
    "answer": [
      "Direct labour cost, which fell from R34 to R30",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "cost_accounting",
    "topic": "cost_control_interpretation",
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
    "type": "interpretation",
    "supplementary_material": {
      "type": "statement",
      "label": "Cost per unit: Brightway Chargers",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/accounting/2025/nov_p2/q12/statement_1.png"
      ]
    }
  },
  {
    "name": "Question 4",
    "question": "Select the TWO pieces of advice that would help to control the direct material cost.",
    "metadata": [
      "Employ more workers for overtime",
      "Train workers to reduce wastage",
      "Lower the selling price of the product",
      "Buy from a cheaper supplier or in bulk for a discount",
      "Increase the number of administration staff"
    ],
    "answer": [
      "Train workers to reduce wastage",
      "Buy from a cheaper supplier or in bulk for a discount",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "cost_accounting",
    "topic": "cost_control_interpretation",
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
      "number": "3.2.3",
      "marks": 3,
      "clues": "- Look for a fixed-cost item that went up while the total went down.\n- Give a possible reason.",
      "approach": "- Compare each fixed-cost item between the two years.",
      "solution": "1. Administration cost per unit increased from R42 to R46 (by R4).\n2. A possible reason is abuse of administration items or more administrative staff."
    },
    {
      "number": "3.2.4",
      "marks": 6,
      "clues": "- Find the variable-cost item that increased most and the one that decreased.\n- \"No overtime\" and \"no retrenchment\" are not accepted as reasons.",
      "approach": "- Quote each item with its trend, then give advice or a reason.",
      "solution": "1. Direct material cost increased from R24 to R38 (by R14); advice: train workers to minimise wastage or buy from a cheaper supplier.\n2. Direct labour cost decreased from R22 to R20 (by R2); reason: better supervision or better-trained workers."
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
