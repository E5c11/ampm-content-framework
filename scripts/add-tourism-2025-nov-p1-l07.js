#!/usr/bin/env node
/**
 * DBE Tourism — November 2025 — Question 1: Heritage, marketing, customer care and currency (Section A) (order 7)
 * Section A items 1.1.9, 1.1.10, 1.1.17 and 1.2.1 — UNESCO, travel trade shows, QR codes and the euro.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-tourism-2025-nov-p1-l07.js --curriculum temp/curriculum-vocab-tourism.json
 *   node scripts/add-tourism-2025-nov-p1-l07.js --dry-run
 *   node scripts/add-tourism-2025-nov-p1-l07.js
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
  "name": "Question 1: Heritage, marketing, customer care and currency (Section A)",
  "syllabus": "dbe",
  "subject": "tourism",
  "year": 2025,
  "paper": "nov_p1",
  "order": 7,
  "content_tier": "free",
  "has_video": false,
  "xp": 4,
  "tags": [
    "world_heritage_sites",
    "trade_shows",
    "customer_care_tools"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2025/nov_p1/q7/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2025/nov_p1/q7/question_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2025/nov_p1/q7/question_3.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2025/nov_p1/q7/memo_1.png"
  ],
  "exam_question_marks": 4,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Which organisation decides that a place has outstanding universal value and declares it a World Heritage Site?",
    "metadata": [
      "SAHRA",
      "ACSA",
      "TBCSA",
      "UNESCO",
      ""
    ],
    "answer": [
      "UNESCO",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "culture_heritage_tourism",
    "topic": "world_heritage_sites",
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
    "question": "Match each travel trade show or market to what it does for tourism.",
    "metadata": [
      "A - Meetings Africa",
      "B - Africa Travel Indaba",
      "C - World Travel Market",
      "D - ITB Berlin",
      "1 - Promotes South Africa to domestic and regional markets",
      "2 - Lets SA promote itself to international buyers in London",
      "3 - Lets SA promote itself to international buyers in Germany",
      "4 - Attracts business and conference travellers"
    ],
    "answer": [
      "A-4",
      "B-1",
      "C-2",
      "D-3"
    ],
    "presentation": "match",
    "unit": "tourism_marketing",
    "topic": "travel_trade_shows",
    "subtopic": "tour_classification",
    "skills": [
      "classify_tourism_concept"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "tourism",
    "year": 2025,
    "paper": "nov_p1",
    "type": "application"
  },
  {
    "name": "Question 3",
    "question": "A guest lodge prints a square code at reception. Guests scan it with their phones to read the lodge's menu, rules and website. What is this tool mainly used for?",
    "metadata": [
      "Retraining and upskilling staff",
      "Giving access to the business website",
      "Collecting customers' personal particulars",
      "Advising the guests on dress codes",
      ""
    ],
    "answer": [
      "Giving access to the business website",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "communication_customer_care",
    "topic": "customer_communication_tools",
    "subtopic": "tour_scenario_application",
    "skills": [
      "apply_tourism_concept_to_scenario"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "tourism",
    "year": 2025,
    "paper": "nov_p1",
    "type": "application"
  },
  {
    "name": "Question 4",
    "question": "Germany's official currency is the euro. Select ALL the currencies that are officially used in European countries.",
    "metadata": [
      "The Japanese yen",
      "The euro",
      "The pound sterling",
      "The Swiss franc",
      "The Mexican peso"
    ],
    "answer": [
      "The euro",
      "The pound sterling",
      "The Swiss franc",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "foreign_exchange",
    "topic": "currencies_and_codes",
    "subtopic": "tour_classification",
    "skills": [
      "classify_tourism_concept"
    ],
    "difficulty": 2,
    "exam_weight": 1,
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
      "number": "1.1.9",
      "marks": 1,
      "clues": "- The organisation declares World Heritage Sites.",
      "approach": "- Rule out the South African and airport bodies.",
      "solution": "1. UNESCO is responsible for declaring World Heritage Sites, so the answer is A."
    },
    {
      "number": "1.1.10",
      "marks": 1,
      "clues": "- Meetings Africa is a trade show.\n- It attracts a particular kind of tourist.",
      "approach": "- Recall the abbreviation for business tourists.",
      "solution": "1. Meetings Africa attracts MESE (meetings, exhibitions, incentive and events) tourists, so the answer is A."
    },
    {
      "number": "1.1.17",
      "marks": 1,
      "clues": "- A QR code is scanned with a phone.",
      "approach": "- Think about what a scanned code opens.",
      "solution": "1. The QR code is used to get access to the website of the business, so the answer is A."
    },
    {
      "number": "1.2.1",
      "marks": 1,
      "clues": "- The currency is the official money of Germany.",
      "approach": "- Pick the currency from the list.",
      "solution": "1. The euro is the official currency of Germany."
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
