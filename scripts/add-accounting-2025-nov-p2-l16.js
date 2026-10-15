#!/usr/bin/env node
/**
 * DBE Accounting — November 2025 — Question 4.2.1–4.2.2: Comparing budgets and lost sales (order 16)
 * Questions 4.2.1 and 4.2.2 — why budgeted and actual figures are compared, a reason for lower sales with figures, and cash lost.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-accounting-2025-nov-p2-l16.js --curriculum temp/curriculum-vocab-accounting.json
 *   node scripts/add-accounting-2025-nov-p2-l16.js --dry-run
 *   node scripts/add-accounting-2025-nov-p2-l16.js
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
  "name": "Question 4.2.1–4.2.2: Comparing budgets and lost sales",
  "syllabus": "dbe",
  "subject": "accounting",
  "year": 2025,
  "paper": "nov_p2",
  "order": 16,
  "content_tier": "free",
  "has_video": false,
  "xp": 6,
  "tags": [
    "budget_variance",
    "lost_sales_calculation"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p2/q16/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p2/q16/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p2/q16/memo_1.png"
  ],
  "exam_question_marks": 6,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Use the information in the figure to calculate A (the cash lost in October sales compared with September) and B (the percentage increase in the actual selling price).",
    "metadata": [
      "A = ",
      "[ ]",
      "   B = ",
      "[ ]"
    ],
    "answer": [
      "168200",
      "45",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "unit": "budgeting",
    "topic": "budget_variance_interpretation",
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
    "clues": "- Lost sales are the fewer units multiplied by the October price.",
    "supplementary_material": {
      "type": "statement",
      "label": "Budget and actual: Kwezi Traders",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/accounting/2025/nov_p2/q16/statement_1.png"
      ]
    }
  },
  {
    "name": "Question 2",
    "question": "Why is it important to compare budgeted figures with actual figures?",
    "metadata": [
      "To prove that the owner is always right",
      "To increase the number of staff needed",
      "To avoid having to record transactions",
      "To find variances and improve future budgets",
      ""
    ],
    "answer": [
      "To find variances and improve future budgets",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "budgeting",
    "topic": "budget_variance_interpretation",
    "subtopic": "acc_term_recall",
    "skills": [
      "recall_accounting_term"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "accounting",
    "year": 2025,
    "paper": "nov_p2",
    "type": "definition"
  },
  {
    "name": "Question 3",
    "question": "Select the TWO statements that explain the fall in the number of units sold in October.",
    "metadata": [
      "The competitor opened a second shop",
      "The budgeted salaries were lower in October",
      "The actual selling price rose from R2 000 to R2 900",
      "Units sold fell from 110 to 52 as the price rose",
      "Payments to creditors were higher in October"
    ],
    "answer": [
      "The actual selling price rose from R2 000 to R2 900",
      "Units sold fell from 110 to 52 as the price rose",
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
      "label": "Budget and actual: Kwezi Traders",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/accounting/2025/nov_p2/q16/statement_1.png"
      ]
    }
  },
  {
    "name": "Question 4",
    "question": "Calculate the percentage increase in the selling price from R2 000 to R2 900 (without the % sign).",
    "metadata": [
      "Increase = ",
      "[ ]",
      " %"
    ],
    "answer": [
      "45",
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
    "difficulty": 2,
    "exam_weight": 1,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "accounting",
    "year": 2025,
    "paper": "nov_p2",
    "type": "calc"
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "4.2.1",
      "marks": 2,
      "clues": "- A budget is a plan; actual figures show what really happened.",
      "approach": "- Give one valid reason for comparing the two.",
      "solution": "1. It shows whether the budget was realistic and helps to create better budgets in future."
    },
    {
      "number": "4.2.2",
      "marks": 4,
      "clues": "- Look at the selling price and the units sold.\n- Cash lost uses the fall in units and the October price.",
      "approach": "- Quote the price increase as the reason for the fall in sales.\n- Multiply the units lost by the October price.",
      "solution": "1. The selling price increased from R1 600 to R2 480 (by R880).\n2. Cash lost = (124 − 61) × R2 480 = R156 240."
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
