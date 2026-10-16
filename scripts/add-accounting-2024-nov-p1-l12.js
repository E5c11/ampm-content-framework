#!/usr/bin/env node
/**
 * DBE Accounting — November 2024 — Question 3.1–3.2: Profitability and dividend pay-out policy (order 12)
 * Questions 3.1 and 3.2 — quoting indicators with figures and trends to show that expenses are well managed, and commenting on a change in the dividend pay-out policy.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-accounting-2024-nov-p1-l12.js --curriculum temp/curriculum-vocab-accounting.json
 *   node scripts/add-accounting-2024-nov-p1-l12.js --dry-run
 *   node scripts/add-accounting-2024-nov-p1-l12.js
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
  "name": "Question 3.1–3.2: Profitability and dividend pay-out policy",
  "syllabus": "dbe",
  "subject": "accounting",
  "year": 2024,
  "paper": "nov_p1",
  "order": 12,
  "content_tier": "free",
  "has_video": false,
  "xp": 7,
  "tags": [
    "profitability_indicators",
    "dividend_payout_policy"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2024/nov_p1/q12/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2024/nov_p1/q12/question_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2024/nov_p1/q12/question_3.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2024/nov_p1/q12/memo_1.png"
  ],
  "exam_question_marks": 7,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Select the TWO indicators that show Baobab Ltd is managing its expenses well.",
    "metadata": [
      "Mark-up % increased from 42% to 48%",
      "% operating expenses on sales fell from 21% to 15%",
      "% operating profit on sales rose from 11% to 17%",
      "Dividends per share fell from 78 to 68 cents",
      "% operating expenses on sales rose from 15% to 21%"
    ],
    "answer": [
      "% operating expenses on sales fell from 21% to 15%",
      "% operating profit on sales rose from 11% to 17%",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "interpretation_of_financial_information",
    "topic": "interpreting_operating_efficiency",
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
    "year": 2024,
    "paper": "nov_p1",
    "type": "interpretation",
    "supplementary_material": {
      "type": "statement",
      "label": "Financial indicators: Baobab Ltd",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/accounting/2024/nov_p1/q12/statement_1.png"
      ]
    }
  },
  {
    "name": "Question 2",
    "question": "Which comment on the dividend pay-out policy of Baobab Ltd is correct?",
    "metadata": [
      "Pay-out rose from 55% to 80%, so shareholders received more of the profit",
      "Pay-out fell from 80% to 55%, so more profit is kept for growth",
      "Pay-out fell from 80% to 55%, so the company made less profit this year",
      "Pay-out fell from 80% to 55%, so shareholders received more dividends",
      ""
    ],
    "answer": [
      "Pay-out fell from 80% to 55%, so more profit is kept for growth",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "interpretation_of_financial_information",
    "topic": "interpreting_returns_and_dividends",
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
      "label": "Financial indicators: Baobab Ltd",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/accounting/2024/nov_p1/q12/statement_1.png"
      ]
    }
  },
  {
    "name": "Question 3",
    "question": "By how many percentage points did the % operating expenses on sales of Baobab Ltd improve?",
    "metadata": [
      "Improvement = ",
      "[ ]",
      " percentage points"
    ],
    "answer": [
      "6",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "unit": "interpretation_of_financial_information",
    "topic": "interpreting_operating_efficiency",
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
    "year": 2024,
    "paper": "nov_p1",
    "type": "reading",
    "supplementary_material": {
      "type": "statement",
      "label": "Financial indicators: Baobab Ltd",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/accounting/2024/nov_p1/q12/statement_1.png"
      ]
    }
  },
  {
    "name": "Question 4",
    "question": "Why is the mark-up % NOT accepted as evidence that a company controls its expenses?",
    "metadata": [
      "It is calculated on sales, not on cost of sales",
      "It only changes when the expenses change",
      "It reflects the pricing policy, not expenses",
      "It is the same for all companies in a sector",
      ""
    ],
    "answer": [
      "It reflects the pricing policy, not expenses",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "interpretation_of_financial_information",
    "topic": "interpreting_operating_efficiency",
    "subtopic": "acc_term_recall",
    "skills": [
      "recall_accounting_term"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "accounting",
    "year": 2024,
    "paper": "nov_p1",
    "type": "interpretation"
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "3.1",
      "marks": 4,
      "clues": "- Choose indicators that are about expenses and operating profit, not the mark-up %.\n- Quote each indicator with both years' figures and the trend.",
      "approach": "- Look at % operating expenses on sales, % operating profit on sales and % net profit before tax on sales.\n- Give any TWO with figures and the direction of change.",
      "solution": "1. % operating expenses on sales decreased from 19% to 14% (by 5 percentage points).\n2. % operating profit on sales increased from 12% to 18%; % net profit before tax on sales increased from 11% to 19% (any two)."
    },
    {
      "number": "3.2",
      "marks": 3,
      "clues": "- The dividend pay-out rate fell from 86% to 60%.\n- A lower pay-out rate means more profit is retained.",
      "approach": "- Quote the trend with figures.\n- Explain why keeping more profit in the company is responsible.",
      "solution": "1. The pay-out rate decreased from 86% to 60% (by 26 percentage points).\n2. Funds are retained for future expansion, which protects cash flow and benefits shareholders later."
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
