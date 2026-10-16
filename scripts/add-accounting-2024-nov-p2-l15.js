#!/usr/bin/env node
/**
 * DBE Accounting — November 2024 — Question 3.2.3: Sales policy and control over expenses (order 15)
 * Question 3.2.3 — the change in the cash/credit sales policy, why higher actual credit sales need not concern the owner, and control over delivery and packing costs.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-accounting-2024-nov-p2-l15.js --curriculum temp/curriculum-vocab-accounting-2024-p2.json
 *   node scripts/add-accounting-2024-nov-p2-l15.js --dry-run
 *   node scripts/add-accounting-2024-nov-p2-l15.js
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
  "name": "Question 3.2.3: Sales policy and control over expenses",
  "syllabus": "dbe",
  "subject": "accounting",
  "year": 2024,
  "paper": "nov_p2",
  "order": 15,
  "content_tier": "free",
  "has_video": false,
  "xp": 10,
  "tags": [
    "sales_policy",
    "budget_variance",
    "cost_control_interpretation"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2024/nov_p2/q15/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2024/nov_p2/q15/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2024/nov_p2/q15/memo_1.png"
  ],
  "exam_question_marks": 10,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Use the figure. What change did the owner make to the sales policy when budgeting for October?",
    "metadata": [
      "Credit sales rose from 40% to 60% of total sales",
      "Cash sales fell from 60% to 40% of total sales",
      "Cash sales rose from 40% to 60% of total sales",
      "Credit sales stayed at 60% of total sales",
      ""
    ],
    "answer": [
      "Cash sales rose from 40% to 60% of total sales",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "budgeting",
    "topic": "budget_variance_interpretation",
    "subtopic": "acc_interpretation",
    "skills": [
      "interpret_financial_indicators"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "accounting",
    "year": 2024,
    "paper": "nov_p2",
    "type": "interpretation",
    "supplementary_material": {
      "type": "statement",
      "label": "Budget and actual: Gear Stop",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/accounting/2024/nov_p2/q15/statement_1.png"
      ]
    }
  },
  {
    "name": "Question 2",
    "question": "Use the figure. Actual credit sales in October were far above budget. Select the TWO reasons, with figures, why the owner should NOT be concerned.",
    "metadata": [
      "Credit sales were R87 000 above budget",
      "Customers rose from 500 to 700 (by 40%)",
      "Gross profit rose from R50 000 to R70 000",
      "Cash sales were R27 000 below budget",
      "October sales beat September's budget"
    ],
    "answer": [
      "Customers rose from 500 to 700 (by 40%)",
      "Gross profit rose from R50 000 to R70 000",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "budgeting",
    "topic": "budget_variance_interpretation",
    "subtopic": "acc_interpretation",
    "skills": [
      "interpret_financial_indicators"
    ],
    "difficulty": 4,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "accounting",
    "year": 2024,
    "paper": "nov_p2",
    "type": "interpretation",
    "supplementary_material": {
      "type": "statement",
      "label": "Budget and actual: Gear Stop",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/accounting/2024/nov_p2/q15/statement_1.png"
      ]
    }
  },
  {
    "name": "Question 3",
    "question": "Use the figure. Calculate the percentage by which actual packing materials in October exceeded the budgeted amount.",
    "metadata": [
      "Over budget by ",
      "[ ]",
      " %"
    ],
    "answer": [
      "110",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "unit": "budgeting",
    "topic": "budget_variance_interpretation",
    "subtopic": "acc_calculation",
    "skills": [
      "calculate_accounting_amount"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "accounting",
    "year": 2024,
    "paper": "nov_p2",
    "type": "calc",
    "supplementary_material": {
      "type": "statement",
      "label": "Budget and actual: Gear Stop",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/accounting/2024/nov_p2/q15/statement_1.png"
      ]
    }
  },
  {
    "name": "Question 4",
    "question": "Use the figure. Which statement best describes the control over these two expenses in October?",
    "metadata": [
      "Packing stayed at 6% of sales; delivery rose from 12% to 15%",
      "Delivery stayed at 12% of sales; packing rose from 6% to 9%",
      "Both expenses rose faster than sales and were poorly controlled",
      "Both expenses stayed at their budgeted percentage of sales",
      ""
    ],
    "answer": [
      "Delivery stayed at 12% of sales; packing rose from 6% to 9%",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "budgeting",
    "topic": "budget_variance_interpretation",
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
    "year": 2024,
    "paper": "nov_p2",
    "type": "interpretation",
    "supplementary_material": {
      "type": "statement",
      "label": "Budget and actual: Gear Stop",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/accounting/2024/nov_p2/q15/statement_1.png"
      ]
    }
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "3.2.3",
      "marks": 10,
      "clues": "- Compare October's budget with September's to see the policy change, and October's actual with its budget for control.\n- Expenses must be judged against the change in sales, not against September.",
      "approach": "- Express cash and credit sales as percentages of total sales.\n- Compare the growth in customers, sales and gross profit with budget.\n- Express each expense as a percentage of sales, budget and actual.",
      "solution": "1. Policy: cash sales changed from 40% to 60% (R58 000 to R96 000); credit sales from 60% to 40%.\n2. Not concerned: customers rose from 540 to 729 (35%); gross profit from R60 000 to R82 875 (38,1%); sales from R160 000 to R221 000.\n3. Delivery: 15% of sales in budget and actual, well controlled. Packing: budget 9% of sales but actual 12%; overspent by R12 120 (84,2%) while sales rose only 38,1%."
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
