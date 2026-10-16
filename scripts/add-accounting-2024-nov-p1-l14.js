#!/usr/bin/env node
/**
 * DBE Accounting — November 2024 — Question 3.4: Financing strategies and gearing (order 14)
 * Question 3.4 — identifying the two main sources used to finance new fixed assets, and explaining the effect on risk and gearing with the debt-equity ratio and the return on capital employed.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-accounting-2024-nov-p1-l14.js --curriculum temp/curriculum-vocab-accounting.json
 *   node scripts/add-accounting-2024-nov-p1-l14.js --dry-run
 *   node scripts/add-accounting-2024-nov-p1-l14.js
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
  "name": "Question 3.4: Financing strategies and gearing",
  "syllabus": "dbe",
  "subject": "accounting",
  "year": 2024,
  "paper": "nov_p1",
  "order": 14,
  "content_tier": "free",
  "has_video": false,
  "xp": 10,
  "tags": [
    "financing_strategies",
    "gearing_and_loans"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2024/nov_p1/q14/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2024/nov_p1/q14/question_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2024/nov_p1/q14/question_3.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2024/nov_p1/q14/memo_1.png"
  ],
  "exam_question_marks": 10,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Use the figure. Calculate the increase in the loan and the amount raised from new shares issued.",
    "metadata": [
      "Loan increase = R ",
      "[ ]",
      "   Shares issued = R ",
      "[ ]"
    ],
    "answer": [
      "4100000",
      "3500000",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "unit": "interpretation_of_financial_information",
    "topic": "interpreting_gearing",
    "subtopic": "acc_calculation",
    "skills": [
      "calculate_accounting_amount"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "accounting",
    "year": 2024,
    "paper": "nov_p1",
    "type": "calc",
    "supplementary_material": {
      "type": "statement",
      "label": "Notes and financial indicators: Baobab Ltd",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/accounting/2024/nov_p1/q14/statement_1.png"
      ]
    }
  },
  {
    "name": "Question 2",
    "question": "Select the TWO main sources (over R1 m) used to finance the new fixed assets of Baobab Ltd.",
    "metadata": [
      "Selling fixed assets",
      "Using the fixed deposit",
      "Issuing new shares",
      "Increasing the loan",
      "Using cash and cash equivalents"
    ],
    "answer": [
      "Issuing new shares",
      "Increasing the loan",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "interpretation_of_financial_information",
    "topic": "interpreting_gearing",
    "subtopic": "acc_interpretation",
    "skills": [
      "interpret_financial_indicators"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "accounting",
    "year": 2024,
    "paper": "nov_p1",
    "type": "interpretation",
    "supplementary_material": {
      "type": "statement",
      "label": "Notes and financial indicators: Baobab Ltd",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/accounting/2024/nov_p1/q14/statement_1.png"
      ]
    }
  },
  {
    "name": "Question 3",
    "question": "How did the financing decisions affect the risk of Baobab Ltd?",
    "metadata": [
      "Debt-equity fell to 0,3 : 1, so the company is now highly geared",
      "Debt-equity fell to 0,3 : 1, so the financial risk stays low",
      "Debt-equity rose to 0,6 : 1, so the financial risk has increased",
      "Debt-equity fell to 0,3 : 1, so the loan has been fully repaid",
      ""
    ],
    "answer": [
      "Debt-equity fell to 0,3 : 1, so the financial risk stays low",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "interpretation_of_financial_information",
    "topic": "interpreting_gearing",
    "subtopic": "acc_interpretation",
    "skills": [
      "interpret_financial_indicators"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "accounting",
    "year": 2024,
    "paper": "nov_p1",
    "type": "interpretation",
    "supplementary_material": {
      "type": "statement",
      "label": "Notes and financial indicators: Baobab Ltd",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/accounting/2024/nov_p1/q14/statement_1.png"
      ]
    }
  },
  {
    "name": "Question 4",
    "question": "Is Baobab Ltd positively geared?",
    "metadata": [
      "No, its ROTCE of 22% is below the cost of the new shares",
      "Yes, because its debt-equity ratio fell from 0,6 : 1",
      "No, because the loan rose by more than R4 m this year",
      "Yes, its ROTCE of 22% is above the 11% loan interest rate",
      ""
    ],
    "answer": [
      "Yes, its ROTCE of 22% is above the 11% loan interest rate",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "interpretation_of_financial_information",
    "topic": "interpreting_gearing",
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
    "paper": "nov_p1",
    "type": "interpretation",
    "supplementary_material": {
      "type": "statement",
      "label": "Notes and financial indicators: Baobab Ltd",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/accounting/2024/nov_p1/q14/statement_1.png"
      ]
    }
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "3.4",
      "marks": 10,
      "clues": "- Compare share capital and the loan in the two years; sale of fixed assets and cash are not accepted as main sources.\n- Use the debt-equity ratio and the return on capital employed against the loan interest rate.",
      "approach": "- Find the increase in share capital and in the loan.\n- Quote the debt-equity ratio for risk and ROTCE against the 12% interest rate for gearing.",
      "solution": "1. Shares issued: R2 970 000 (from R28 800 000 to R31 770 000); increase in loan: R3 513 000 (from R9 400 000 to R12 913 000).\n2. Debt-equity ratio decreased from 0,5 : 1 to 0,2 : 1, so the company still has a low financial risk.\n3. ROTCE increased from 15% to 24%, which is higher than the 12% interest on loans, so the company is positively geared."
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
