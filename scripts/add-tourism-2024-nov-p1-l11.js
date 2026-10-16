#!/usr/bin/env node
/**
 * DBE Tourism — November 2024 — Question 3.1–3.3: Currency codes and converting currency (order 11)
 * Question 3.1–3.3 — currency codes for the pound and the euro, converting rand to euro with the bank selling rate, and euro back to rand with the bank buying rate.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-tourism-2024-nov-p1-l11.js --curriculum temp/curriculum-vocab-tourism.json
 *   node scripts/add-tourism-2024-nov-p1-l11.js --dry-run
 *   node scripts/add-tourism-2024-nov-p1-l11.js
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
  "name": "Question 3.1–3.3: Currency codes and converting currency",
  "syllabus": "dbe",
  "subject": "tourism",
  "year": 2024,
  "paper": "nov_p1",
  "order": 11,
  "content_tier": "free",
  "has_video": false,
  "xp": 8,
  "tags": [
    "forex_conversion",
    "bank_selling_rate",
    "bank_buying_rate"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2024/nov_p1/q11/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2024/nov_p1/q11/memo_1.png"
  ],
  "exam_question_marks": 8,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Match each currency to its three-letter code.",
    "metadata": [
      "A - British pound",
      "B - Euro",
      "C - Australian dollar",
      "D - Swiss franc",
      "1 - EUR",
      "2 - AUD",
      "3 - CHF",
      "4 - GBP"
    ],
    "answer": [
      "A-4",
      "B-1",
      "C-2",
      "D-3"
    ],
    "presentation": "match",
    "unit": "foreign_exchange",
    "topic": "currencies_and_codes",
    "subtopic": "tour_term_recall",
    "skills": [
      "recall_tourism_term"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "tourism",
    "year": 2024,
    "paper": "nov_p1",
    "type": "definition"
  },
  {
    "name": "Question 2",
    "question": "Illustrative rates: US dollar BBR R17,60, BSR R17,85. A tourist converts R40 000 into US dollars at a South African bank. Which calculation is correct?",
    "metadata": [
      "R40 000 × 17,85",
      "R40 000 ÷ 17,60",
      "R40 000 × 17,60",
      "R40 000 ÷ 17,85",
      ""
    ],
    "answer": [
      "R40 000 ÷ 17,85",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "foreign_exchange",
    "topic": "currency_conversion",
    "subtopic": "tour_calculation",
    "skills": [
      "convert_foreign_currency"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "tourism",
    "year": 2024,
    "paper": "nov_p1",
    "type": "conversion"
  },
  {
    "name": "Question 3",
    "question": "Illustrative rates: US dollar BBR R17,60, BSR R17,85. How many US dollars does a tourist receive for R40 000? Round off to TWO decimal places. []",
    "metadata": [
      "USD ",
      "[ ]"
    ],
    "answer": [
      "2240.90|2240.9",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "unit": "foreign_exchange",
    "topic": "currency_conversion",
    "subtopic": "tour_calculation",
    "skills": [
      "convert_foreign_currency"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "tourism",
    "year": 2024,
    "paper": "nov_p1",
    "type": "conversion",
    "clues": "- The bank is selling dollars to the tourist.\n- Divide by the matching rate, then round off."
  },
  {
    "name": "Question 4",
    "question": "Illustrative rates: US dollar BBR R17,60, BSR R17,85. A tourist returns with USD120 and sells it to the bank. How many rand does the tourist receive? []",
    "metadata": [
      "R ",
      "[ ]"
    ],
    "answer": [
      "2112|2112.00|2112.0",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "unit": "foreign_exchange",
    "topic": "currency_conversion",
    "subtopic": "tour_calculation",
    "skills": [
      "convert_foreign_currency"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "tourism",
    "year": 2024,
    "paper": "nov_p1",
    "type": "conversion",
    "clues": "- The bank is buying dollars from the tourist.\n- Multiply by the matching rate."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "3.1.1",
      "marks": 1,
      "clues": "- Currency codes have three letters.\n- The first two letters stand for the country.",
      "approach": "- Recall the code for the British pound.\n- Write it in capital letters.",
      "solution": "1. GBP."
    },
    {
      "number": "3.1.2",
      "marks": 1,
      "clues": "- The euro is shared by many countries.\n- Its code starts with EU.",
      "approach": "- Recall the code for the euro.\n- Write it in capital letters.",
      "solution": "1. EUR."
    },
    {
      "number": "3.2",
      "marks": 3,
      "clues": "- The team is buying euro from the bank.\n- Use the bank selling rate.",
      "approach": "- Divide the rand amount by the BSR.\n- Round off to two decimal places.",
      "solution": "1. R50 000 ÷ 20,55 = €2 433,09."
    },
    {
      "number": "3.3",
      "marks": 3,
      "clues": "- Cheslin is selling euro back to the bank.\n- Use the bank buying rate.",
      "approach": "- Multiply the euro amount by the BBR.\n- Write the answer in rand to two decimal places.",
      "solution": "1. €75 × 20,52 = R1 539,00."
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
