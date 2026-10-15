#!/usr/bin/env node
/**
 * DBE Tourism — November 2025 — Question 3.1–3.2: Exchange rates and key terms (order 12)
 * Question 3.1 and 3.2 — currency codes, fluctuation and the bank buying rate.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-tourism-2025-nov-p1-l12.js --curriculum temp/curriculum-vocab-tourism.json
 *   node scripts/add-tourism-2025-nov-p1-l12.js --dry-run
 *   node scripts/add-tourism-2025-nov-p1-l12.js
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
  "name": "Question 3.1–3.2: Exchange rates and key terms",
  "syllabus": "dbe",
  "subject": "tourism",
  "year": 2025,
  "paper": "nov_p1",
  "order": 12,
  "content_tier": "free",
  "has_video": false,
  "xp": 5,
  "tags": [
    "rand_exchange_rates",
    "bank_buying_rate",
    "bank_selling_rate"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2025/nov_p1/q12/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2025/nov_p1/q12/memo_1.png"
  ],
  "exam_question_marks": 5,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "What is the three-letter currency code for the Japanese yen? []",
    "metadata": [
      "Code: ",
      "[ ]"
    ],
    "answer": [
      "jpy",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "text",
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
    "year": 2025,
    "paper": "nov_p1",
    "type": "definition"
  },
  {
    "name": "Question 2",
    "question": "A tourist notices that the number of rand needed for one euro changes from week to week. What is this continuous rise and fall called?",
    "metadata": [
      "Inflation of consumer prices",
      "Rounding off of all exchange rates",
      "A fixed exchange rate system",
      "Fluctuation of exchange rates",
      ""
    ],
    "answer": [
      "Fluctuation of exchange rates",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "foreign_exchange",
    "topic": "tourism_exchange_rates",
    "subtopic": "tour_term_recall",
    "skills": [
      "recall_tourism_term"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "tourism",
    "year": 2025,
    "paper": "nov_p1",
    "type": "definition"
  },
  {
    "name": "Question 3",
    "question": "Match each exchange-rate term to its meaning.",
    "metadata": [
      "A - Bank buying rate",
      "B - Bank selling rate",
      "C - Strong rand",
      "D - Weak rand",
      "1 - The rate at which the bank sells foreign currency to you",
      "2 - One rand buys more foreign currency than before",
      "3 - One rand buys less foreign currency than before",
      "4 - The rate at which the bank buys foreign currency from you"
    ],
    "answer": [
      "A-4",
      "B-1",
      "C-2",
      "D-3"
    ],
    "presentation": "match",
    "unit": "foreign_exchange",
    "topic": "tourism_exchange_rates",
    "subtopic": "tour_classification",
    "skills": [
      "classify_tourism_concept"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "tourism",
    "year": 2025,
    "paper": "nov_p1",
    "type": "definition"
  },
  {
    "name": "Question 4",
    "question": "A tourist at a South African bank wants to buy US dollars for a trip. Which rate does the bank use?",
    "metadata": [
      "The bank selling rate",
      "The bank buying rate",
      "The average of the two rates",
      "A rate chosen by the tourist",
      ""
    ],
    "answer": [
      "The bank selling rate",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "foreign_exchange",
    "topic": "tourism_exchange_rates",
    "subtopic": "tour_scenario_application",
    "skills": [
      "apply_tourism_concept_to_scenario"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "tourism",
    "year": 2025,
    "paper": "nov_p1",
    "type": "application"
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "3.1",
      "marks": 1,
      "clues": "- Currency codes have three letters.\n- The first two letters usually refer to the country.",
      "approach": "- Recall the code for the Great British pound.",
      "solution": "1. The currency code for the Great British pound is GBP."
    },
    {
      "number": "3.2.1",
      "marks": 2,
      "clues": "- Think of the rate going up and down.",
      "approach": "- Explain the term in your own words.",
      "solution": "1. Fluctuation refers to the continuous rise and fall in the exchange rate, the changing value of one currency against another."
    },
    {
      "number": "3.2.2",
      "marks": 2,
      "clues": "- The bank is the buyer.",
      "approach": "- State the rate at which the bank buys foreign currency.",
      "solution": "1. The bank buying rate is the rate at which the bank buys foreign currency."
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
