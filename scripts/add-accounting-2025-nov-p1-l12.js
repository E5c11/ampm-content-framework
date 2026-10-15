#!/usr/bin/env node
/**
 * DBE Accounting — November 2025 — Question 2.3–2.4: Dividend pay-out rate and cash resources (order 12)
 * Questions 2.3 and 2.4 — the dividend pay-out rate and a reason, with figures, for concern about cash resources.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-accounting-2025-nov-p1-l12.js --curriculum temp/curriculum-vocab-accounting.json
 *   node scripts/add-accounting-2025-nov-p1-l12.js --dry-run
 *   node scripts/add-accounting-2025-nov-p1-l12.js
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
  "name": "Question 2.3–2.4: Dividend pay-out rate and cash resources",
  "syllabus": "dbe",
  "subject": "accounting",
  "year": 2025,
  "paper": "nov_p1",
  "order": 12,
  "content_tier": "free",
  "has_video": false,
  "xp": 7,
  "tags": [
    "dividend_payout_rate",
    "cash_resources_interpretation"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p1/q12/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p1/q12/question_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p1/q12/question_3.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p1/q12/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p1/q12/memo_2.png"
  ],
  "exam_question_marks": 7,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Interim dividends were R60 000 and the final dividend was R150 000. The net profit after tax was R600 000. Calculate the dividend pay-out rate as a percentage.",
    "metadata": [
      "Pay-out rate = ",
      "[ ]",
      " %"
    ],
    "answer": [
      "35",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "unit": "financial_indicators",
    "topic": "financial_indicator_calculations",
    "subtopic": "acc_calculation",
    "skills": [
      "calculate_accounting_amount"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "accounting",
    "year": 2025,
    "paper": "nov_p1",
    "type": "calc",
    "clues": "- Use ALL the dividends for the year."
  },
  {
    "name": "Question 2",
    "question": "Dividends for the year were R210 000 and there were 300 000 shares in issue. Calculate the dividends per share.",
    "metadata": [
      "Dividends per share = ",
      "[ ]",
      " cents"
    ],
    "answer": [
      "70",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "unit": "financial_indicators",
    "topic": "financial_indicator_calculations",
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
    "paper": "nov_p1",
    "type": "calc"
  },
  {
    "name": "Question 3",
    "question": "Cash and cash equivalents were a favourable R210 000 last year. Which statement gives a valid reason, with figures, for concern about cash resources this year?",
    "metadata": [
      "Sales increased by R355 000 compared with the previous financial year",
      "Cash fell from a favourable R210 000 to an overdraft of R145 000",
      "Dividends paid were lower than the profit earned during the year",
      "Fixed assets were bought for cash instead of being financed by a loan",
      ""
    ],
    "answer": [
      "Cash fell from a favourable R210 000 to an overdraft of R145 000",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "financial_indicators",
    "topic": "interpretation_of_cash_resources",
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
    "paper": "nov_p1",
    "type": "interpretation"
  },
  {
    "name": "Question 4",
    "question": "A company's dividend pay-out rate rose from 49% to 125%. Select ALL the correct conclusions.",
    "metadata": [
      "It retained more profit than before",
      "Reserves from earlier years were used",
      "It paid out more than it earned during the year",
      "No profit was retained for expansion",
      "Shareholders received less than the year before"
    ],
    "answer": [
      "It paid out more than it earned during the year",
      "No profit was retained for expansion",
      "Reserves from earlier years were used",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "financial_indicators",
    "topic": "interpretation_of_cash_resources",
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
    "year": 2025,
    "paper": "nov_p1",
    "type": "interpretation"
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "2.3",
      "marks": 5,
      "clues": "- The pay-out rate compares all dividends for the year with the profit after tax.\n- Interim and final dividends both count.",
      "approach": "- Add the interim dividends and the final dividends.\n- Divide by the net profit after tax and multiply by 100.",
      "solution": "1. Dividends for the year = R90 000 + R129 480 = R219 480.\n2. Dividend pay-out rate = R219 480 ÷ R518 400 × 100 = 42,3%."
    },
    {
      "number": "2.4",
      "marks": 2,
      "clues": "- Look at the cash and cash equivalents at the beginning and end of the year.\n- The reason must contain figures.",
      "approach": "- Compare the opening and closing balances from the cash flow statement.\n- Say what the movement shows about the cash from operations.",
      "solution": "1. Cash and cash equivalents changed from a favourable R415 000 to an unfavourable R757 000.\n2. The net cash outflow of R1 172 000 shows that the operations did not generate enough cash for the needs of the company."
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
