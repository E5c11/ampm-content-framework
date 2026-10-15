#!/usr/bin/env node
/**
 * DBE Accounting — November 2025 — Question 4.1.2: Projected statement of comprehensive income (order 14)
 * Question 4.1.2 — working out bad debts, a salary reduced by unpaid leave, a salary with a bonus and an increase, and advertising as a percentage of sales.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-accounting-2025-nov-p2-l14.js --curriculum temp/curriculum-vocab-accounting.json
 *   node scripts/add-accounting-2025-nov-p2-l14.js --dry-run
 *   node scripts/add-accounting-2025-nov-p2-l14.js
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
  "name": "Question 4.1.2: Projected statement of comprehensive income",
  "syllabus": "dbe",
  "subject": "accounting",
  "year": 2025,
  "paper": "nov_p2",
  "order": 14,
  "content_tier": "free",
  "has_video": false,
  "xp": 13,
  "tags": [
    "projected_income_statement",
    "budgeted_expenses"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p2/q14/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p2/q14/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p2/q14/memo_1.png"
  ],
  "exam_question_marks": 13,
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
      "90000",
      "130500",
      "24000",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "unit": "budgeting",
    "topic": "projected_income_statement",
    "subtopic": "acc_statement_completion",
    "skills": [
      "complete_financial_statement"
    ],
    "difficulty": 5,
    "exam_weight": 3,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "accounting",
    "year": 2025,
    "paper": "nov_p2",
    "type": "calc",
    "clues": "- Take the increase out of January's salary before adding the bonus.\n- Advertising is the same percentage of sales every month.",
    "supplementary_material": {
      "type": "statement",
      "label": "Projected income statement (extract): Mkhize Traders",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/accounting/2025/nov_p2/q14/statement_1.png"
      ]
    }
  },
  {
    "name": "Question 2",
    "question": "6% of the credit sales of R900 000 is written off as irrecoverable. Calculate the bad debts.",
    "metadata": [
      "Bad debts = R ",
      "[ ]"
    ],
    "answer": [
      "54000",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "unit": "budgeting",
    "topic": "projected_income_statement",
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
    "type": "calc"
  },
  {
    "name": "Question 3",
    "question": "An employee takes unpaid leave. How does this affect the salary budget for that month?",
    "metadata": [
      "The salary stays exactly the same as usual",
      "The salary is paid twice in that month",
      "Salary is reduced for the days not worked",
      "The days are paid at a higher daily rate",
      ""
    ],
    "answer": [
      "Salary is reduced for the days not worked",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "budgeting",
    "topic": "projected_income_statement",
    "subtopic": "acc_scenario_application",
    "skills": [
      "apply_accounting_concept_to_scenario"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "accounting",
    "year": 2025,
    "paper": "nov_p2",
    "type": "application"
  },
  {
    "name": "Question 4",
    "question": "Select ALL the items that appear as expenses in a projected statement of comprehensive income.",
    "metadata": [
      "Cash purchases of stock",
      "Salaries",
      "Bad debts",
      "Advertising",
      "Payments to creditors"
    ],
    "answer": [
      "Bad debts",
      "Advertising",
      "Salaries",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "budgeting",
    "topic": "projected_income_statement",
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
    "year": 2025,
    "paper": "nov_p2",
    "type": "application"
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "4.1.2",
      "marks": 13,
      "clues": "- Each item has its own rule: percentage of credit sales, days of unpaid leave, bonus and increase, percentage of sales.\n- Work from the given month to the missing month.",
      "approach": "- Bad debts: the unpaid share of credit sales.\n- Salary: scale by days worked; assistants: remove the increase, then add the bonus; advertising: use the percentage of sales.",
      "solution": "1. (i) Bad debts = R1 417 500 × 6% = R85 050; (ii) sales manager = R29 000 ÷ 20 × 4 = R23 200 (memo adjustment for the leave).\n2. (iii) Assistants in December = R80 000 + R48 000 = R128 000; (iv) advertising = R1 995 000 × 9% = R179 550."
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
