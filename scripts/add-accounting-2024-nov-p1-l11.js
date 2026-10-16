#!/usr/bin/env node
/**
 * DBE Accounting — November 2024 — Question 2.3: Operating expenses on sales, stock turnover and interim dividend per share (order 11)
 * Question 2.3 — % operating expenses on sales, the stock turnover rate and the interim dividend per share, using the Financial Indicator Formula Sheet.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-accounting-2024-nov-p1-l11.js --curriculum temp/curriculum-vocab-accounting.json
 *   node scripts/add-accounting-2024-nov-p1-l11.js --dry-run
 *   node scripts/add-accounting-2024-nov-p1-l11.js
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
  "name": "Question 2.3: Operating expenses on sales, stock turnover and interim dividend per share",
  "syllabus": "dbe",
  "subject": "accounting",
  "year": 2024,
  "paper": "nov_p1",
  "order": 11,
  "content_tier": "free",
  "has_video": false,
  "xp": 10,
  "tags": [
    "financial_indicators_calculation",
    "stock_turnover_rate",
    "dividends_per_share"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2024/nov_p1/q11/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2024/nov_p1/q11/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2024/nov_p1/q11/memo_1.png"
  ],
  "exam_question_marks": 10,
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
      " %   B = ",
      "[ ]",
      " times   C = ",
      "[ ]",
      " cents"
    ],
    "answer": [
      "17|17.0",
      "17.9|18",
      "14",
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
    "year": 2024,
    "paper": "nov_p1",
    "type": "ratio",
    "clues": "- Use AVERAGE trading stock for the stock turnover rate.\n- Use the shares in issue when the interim dividend was paid.",
    "supplementary_material": {
      "type": "statement",
      "label": "Financial indicators: Eland Ltd",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/accounting/2024/nov_p1/q11/statement_1.png"
      ]
    }
  },
  {
    "name": "Question 2",
    "question": "Which formula gives the stock turnover rate?",
    "metadata": [
      "Sales ÷ average trading stock",
      "Average trading stock ÷ cost of sales",
      "Gross profit ÷ average trading stock",
      "Cost of sales ÷ average trading stock",
      ""
    ],
    "answer": [
      "Cost of sales ÷ average trading stock",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "financial_indicators",
    "topic": "financial_indicator_calculations",
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
    "year": 2024,
    "paper": "nov_p1",
    "type": "definition"
  },
  {
    "name": "Question 3",
    "question": "A company paid an interim dividend of R190 000 when 950 000 shares were in issue. Later that year 50 000 shares were repurchased. Calculate the interim dividend per share.",
    "metadata": [
      "Interim DPS = ",
      "[ ]",
      " cents"
    ],
    "answer": [
      "20",
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
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "accounting",
    "year": 2024,
    "paper": "nov_p1",
    "type": "ratio"
  },
  {
    "name": "Question 4",
    "question": "Select ALL the correct statements about the stock turnover rate.",
    "metadata": [
      "It is calculated using sales at selling price",
      "A higher rate means more stock is kept on hand",
      "A higher rate means stock sells faster",
      "It uses the average of opening and closing stock",
      "It is expressed as a percentage of sales"
    ],
    "answer": [
      "A higher rate means stock sells faster",
      "It uses the average of opening and closing stock",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "financial_indicators",
    "topic": "financial_indicator_calculations",
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
    "year": 2024,
    "paper": "nov_p1",
    "type": "application"
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "2.3",
      "marks": 10,
      "clues": "- Formula Sheet: Operating expenses × 100 / Sales; Cost of sales / Average trading stock; Interim dividends × 100 / Number of issued shares.\n- The interim dividend was paid when 1 600 000 shares were in issue (before the repurchase).",
      "approach": "- Use the figures from Information A and B; average the opening and closing trading stock.\n- Give each answer to ONE decimal place; the dividend per share is in cents.",
      "solution": "1. % operating expenses on sales = R1 360 950 ÷ R8 240 600 × 100 = 16,5% (17% accepted).\n2. Stock turnover rate = R5 060 000 ÷ ½ (R174 000 + R193 000) = R5 060 000 ÷ R183 500 = 27,6 times (28 accepted).\n3. Interim dividend per share = R416 000 ÷ (1 200 000 + 400 000) × 100 = 26 cents."
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
