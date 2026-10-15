#!/usr/bin/env node
/**
 * DBE Accounting — November 2025 — Question 4.2.3–4.2.4: Supplier benefits and remuneration (order 17)
 * Questions 4.2.3 and 4.2.4 — benefits lost by not paying suppliers, and why commission was introduced and why employees will be dissatisfied.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-accounting-2025-nov-p2-l17.js --curriculum temp/curriculum-vocab-accounting.json
 *   node scripts/add-accounting-2025-nov-p2-l17.js --dry-run
 *   node scripts/add-accounting-2025-nov-p2-l17.js
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
  "name": "Question 4.2.3–4.2.4: Supplier benefits and remuneration",
  "syllabus": "dbe",
  "subject": "accounting",
  "year": 2025,
  "paper": "nov_p2",
  "order": 17,
  "content_tier": "free",
  "has_video": false,
  "xp": 6,
  "tags": [
    "supplier_payment_benefits",
    "employee_remuneration"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p2/q17/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p2/q17/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p2/q17/memo_1.png"
  ],
  "exam_question_marks": 6,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "The business paid only R48 000 of the R240 000 budgeted for creditors in October. Select the TWO benefits it loses.",
    "metadata": [
      "The right to sell at a higher price",
      "The early-payment discount",
      "A good credit rating with suppliers",
      "Discounts from its own customers",
      "The need to keep a cash budget"
    ],
    "answer": [
      "The early-payment discount",
      "A good credit rating with suppliers",
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
    "order": 1,
    "syllabus": "dbe",
    "subject": "accounting",
    "year": 2025,
    "paper": "nov_p2",
    "type": "interpretation",
    "supplementary_material": {
      "type": "statement",
      "label": "Budget and actual: Kwezi Traders",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/accounting/2025/nov_p2/q17/statement_1.png"
      ]
    }
  },
  {
    "name": "Question 2",
    "question": "Which figures best explain why the owner introduced commission in September?",
    "metadata": [
      "Units sold rose from the budget of 80 to 110",
      "Salaries stayed at R36 000 in September",
      "Payments to creditors were below the budget",
      "The selling price stayed at R2 000 a tank",
      ""
    ],
    "answer": [
      "Units sold rose from the budget of 80 to 110",
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
    "order": 2,
    "syllabus": "dbe",
    "subject": "accounting",
    "year": 2025,
    "paper": "nov_p2",
    "type": "interpretation",
    "supplementary_material": {
      "type": "statement",
      "label": "Budget and actual: Kwezi Traders",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/accounting/2025/nov_p2/q17/statement_1.png"
      ]
    }
  },
  {
    "name": "Question 3",
    "question": "In September, total salaries and commission were R36 000 + R4 400. In October they were R24 000 + R4 000. Calculate A, the fall in total earnings.",
    "metadata": [
      "A = ",
      "[ ]"
    ],
    "answer": [
      "12400",
      "",
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
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "accounting",
    "year": 2025,
    "paper": "nov_p2",
    "type": "calc",
    "supplementary_material": {
      "type": "statement",
      "label": "Budget and actual: Kwezi Traders",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/accounting/2025/nov_p2/q17/statement_1.png"
      ]
    }
  },
  {
    "name": "Question 4",
    "question": "Select the TWO reasons the employees will not be satisfied with the revised remuneration.",
    "metadata": [
      "Commission rose from R0 to R4 000 a month",
      "Total pay fell from R40 400 to R28 000",
      "The business now has fewer employees",
      "Each employee earns about R4 133 less",
      "Units sold fell from 110 to 52 in October"
    ],
    "answer": [
      "Total pay fell from R40 400 to R28 000",
      "Each employee earns about R4 133 less",
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
    "exam_weight": 3,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "accounting",
    "year": 2025,
    "paper": "nov_p2",
    "type": "interpretation",
    "supplementary_material": {
      "type": "statement",
      "label": "Budget and actual: Kwezi Traders",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/accounting/2025/nov_p2/q17/statement_1.png"
      ]
    }
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "4.2.3",
      "marks": 2,
      "clues": "- Think about what suppliers give for paying on time.",
      "approach": "- Name two benefits that are lost.",
      "solution": "1. The business forfeits the early repayment discount and its credit rating or credit limit with suppliers is affected."
    },
    {
      "number": "4.2.4",
      "marks": 4,
      "clues": "- Compare September with October for sales, salaries and commission.\n- Use figures in each answer.",
      "approach": "- Say why commission suited September, then why October pay is lower.",
      "solution": "1. Units sold increased from 90 to 124 in September, so commission rewarded the extra sales.\n2. October earnings of R31 500 are less than September salaries of R38 400, so employees will be dissatisfied."
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
