#!/usr/bin/env node
/**
 * DBE Accounting — November 2025 — Question 3.3.2–3.4: Share price and gearing (order 16)
 * Questions 3.3.2 and 3.4 — comparing net asset value with the market price, and judging a decision to borrow using the return on total capital employed.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-accounting-2025-nov-p1-l16.js --curriculum temp/curriculum-vocab-accounting.json
 *   node scripts/add-accounting-2025-nov-p1-l16.js --dry-run
 *   node scripts/add-accounting-2025-nov-p1-l16.js
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
  "name": "Question 3.3.2–3.4: Share price and gearing",
  "syllabus": "dbe",
  "subject": "accounting",
  "year": 2025,
  "paper": "nov_p1",
  "order": 16,
  "content_tier": "free",
  "has_video": false,
  "xp": 7,
  "tags": [
    "share_price_interpretation",
    "gearing_and_loans"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p1/q16/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p1/q16/question_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p1/q16/question_3.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p1/q16/question_4.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p1/q16/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p1/q16/memo_2.png"
  ],
  "exam_question_marks": 7,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "How does the market price of Marlin Ltd compare with its net asset value?",
    "metadata": [
      "The shares are overvalued because the price is below the NAV",
      "The shares are undervalued because the price is below the NAV",
      "The shares are undervalued because the price is above the NAV",
      "The shares are fairly valued because the price equals the NAV",
      ""
    ],
    "answer": [
      "The shares are undervalued because the price is below the NAV",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "interpretation_of_financial_information",
    "topic": "interpreting_share_price",
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
    "paper": "nov_p1",
    "type": "interpretation",
    "supplementary_material": {
      "type": "statement",
      "label": "Share information for 2026",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/accounting/2025/nov_p1/q16/statement_1.png"
      ]
    }
  },
  {
    "name": "Question 2",
    "question": "By how many cents is the market price of Sable Ltd above its net asset value?",
    "metadata": [
      "Difference = ",
      "[ ]",
      " cents"
    ],
    "answer": [
      "15",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "unit": "interpretation_of_financial_information",
    "topic": "interpreting_share_price",
    "subtopic": "acc_calculation",
    "skills": [
      "calculate_accounting_amount"
    ],
    "difficulty": 1,
    "exam_weight": 1,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "accounting",
    "year": 2025,
    "paper": "nov_p1",
    "type": "reading",
    "supplementary_material": {
      "type": "statement",
      "label": "Share information for 2026",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/accounting/2025/nov_p1/q16/statement_1.png"
      ]
    }
  },
  {
    "name": "Question 3",
    "question": "The % return on total capital employed of a company rose from 19,2% to 21,8%. It pays 12,5% interest on its loans. What does this show?",
    "metadata": [
      "The loans earn less than they cost, so the company is negatively geared",
      "The loans were repaid in full during the financial year",
      "The company paid more in interest than it earned",
      "The loans earn more than they cost, so the company is positively geared",
      ""
    ],
    "answer": [
      "The loans earn more than they cost, so the company is positively geared",
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
    "exam_weight": 3,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "accounting",
    "year": 2025,
    "paper": "nov_p1",
    "type": "interpretation"
  },
  {
    "name": "Question 4",
    "question": "Select the TWO statements that support the directors' decision to take up more loans.",
    "metadata": [
      "The debt-equity ratio increased",
      "The interest on loans is more than the return",
      "The return on total capital employed increased",
      "The return is higher than the interest rate on loans",
      "The company paid out all of its profit as dividends"
    ],
    "answer": [
      "The return on total capital employed increased",
      "The return is higher than the interest rate on loans",
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
    "difficulty": 4,
    "exam_weight": 3,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "accounting",
    "year": 2025,
    "paper": "nov_p1",
    "type": "interpretation"
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "3.3.2",
      "marks": 4,
      "clues": "- Compare the net asset value with the market price for each company.\n- Say whether the shares are undervalued or overvalued.",
      "approach": "- Subtract one from the other for Shorts Ltd and for Lynn Ltd.\n- Decide what the difference shows about shareholders' satisfaction.",
      "solution": "1. Shorts Ltd: NAV of 270 cents is higher than the market price of 256 cents, so the shares are undervalued by 14 cents.\n2. Lynn Ltd: the market price of 976 cents is higher than the NAV of 958 cents, so the shares are overvalued by 18 cents."
    },
    {
      "number": "3.4",
      "marks": 3,
      "clues": "- A larger debt-equity ratio means more loans.\n- Compare the return on total capital employed with the interest rate on loans.",
      "approach": "- Quote the trend in the % return on total capital employed.\n- Compare it with the interest rate to judge whether borrowing paid off.",
      "solution": "1. The return on total capital employed increased from 19,2% to 21,8%.\n2. It is higher than the interest rate of 12,5%, so the company is positively geared and used the loans effectively."
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
