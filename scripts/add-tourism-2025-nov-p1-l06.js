#!/usr/bin/env node
/**
 * DBE Tourism — November 2025 — Question 1: Domestic, regional and international tourism (Section A) (order 6)
 * Section A items 1.1.6, 1.1.16, 1.1.18, 1.1.19, 1.1.20 and 1.3.5 — the Indaba, car-rental payment, global events, SWIFT, unforeseen occurrences and foreign arrivals.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-tourism-2025-nov-p1-l06.js --curriculum temp/curriculum-vocab-tourism.json
 *   node scripts/add-tourism-2025-nov-p1-l06.js --dry-run
 *   node scripts/add-tourism-2025-nov-p1-l06.js
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
  "name": "Question 1: Domestic, regional and international tourism (Section A)",
  "syllabus": "dbe",
  "subject": "tourism",
  "year": 2025,
  "paper": "nov_p1",
  "order": 6,
  "content_tier": "free",
  "has_video": false,
  "xp": 6,
  "tags": [
    "global_events",
    "unforeseen_occurrences",
    "payment_methods"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2025/nov_p1/q6/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2025/nov_p1/q6/question_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2025/nov_p1/q6/question_3.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2025/nov_p1/q6/question_4.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2025/nov_p1/q6/memo_1.png"
  ],
  "exam_question_marks": 6,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "A traveller hires a car abroad and is asked to leave a guarantee that the company can charge for damage. Which form of payment is most widely accepted for this?",
    "metadata": [
      "Traveller's cheque",
      "Credit card",
      "Cash only",
      "Bank draft",
      ""
    ],
    "answer": [
      "Credit card",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "domestic_regional_international_tourism",
    "topic": "forms_of_payment",
    "subtopic": "tour_scenario_application",
    "skills": [
      "apply_tourism_concept_to_scenario"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "tourism",
    "year": 2025,
    "paper": "nov_p1",
    "type": "application"
  },
  {
    "name": "Question 2",
    "question": "Match each event or occurrence to the category it belongs to.",
    "metadata": [
      "A - The Olympic Games",
      "B - An earthquake that damages hotels",
      "C - A civil war closing airports",
      "D - A virus that spreads across borders",
      "1 - Natural disaster",
      "2 - Political situation",
      "3 - Disease outbreak",
      "4 - Global sporting event"
    ],
    "answer": [
      "A-4",
      "B-1",
      "C-2",
      "D-3"
    ],
    "presentation": "match",
    "unit": "domestic_regional_international_tourism",
    "topic": "global_events_and_occurrences",
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
    "question": "Select ALL the unforeseen occurrences that can reduce international arrivals to a country.",
    "metadata": [
      "A new airport terminal opening",
      "A disease outbreak",
      "A tsunami",
      "A global recession",
      "A national public holiday"
    ],
    "answer": [
      "A tsunami",
      "A global recession",
      "A disease outbreak",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "domestic_regional_international_tourism",
    "topic": "global_events_and_occurrences",
    "subtopic": "tour_cause_and_effect",
    "skills": [
      "explain_tourism_cause_and_effect"
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
    "question": "Banks that send money between countries use a code to identify each bank in the transaction. What is this system called?",
    "metadata": [
      "EFT",
      "Snapscan",
      "SWIFT",
      "Bank draft",
      ""
    ],
    "answer": [
      "SWIFT",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "domestic_regional_international_tourism",
    "topic": "forms_of_payment",
    "subtopic": "tour_term_recall",
    "skills": [
      "recall_tourism_term"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "tourism",
    "year": 2025,
    "paper": "nov_p1",
    "type": "definition"
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "1.1.6",
      "marks": 1,
      "clues": "- The Indaba promotes South Africa to domestic and regional markets.\n- It is held every year in one city.",
      "approach": "- Recall where the Africa Travel Indaba takes place.",
      "solution": "1. The Africa Travel Indaba is held in Durban, so the answer is C."
    },
    {
      "number": "1.1.16",
      "marks": 1,
      "clues": "- A vehicle hire company wants a guarantee.\n- It must be easy to charge.",
      "approach": "- Compare cash, cheques and EFT with cards.",
      "solution": "1. A credit card is the most accepted form of payment when renting a vehicle, so the answer is B."
    },
    {
      "number": "1.1.18",
      "marks": 1,
      "clues": "- The event is athletics.\n- It brings visitors to Budapest.",
      "approach": "- Decide what category a sports championship belongs to.",
      "solution": "1. The World Athletics Championships are a sporting event, so the answer is A."
    },
    {
      "number": "1.1.19",
      "marks": 1,
      "clues": "- The codes are used between banks.\n- They are for international transactions.",
      "approach": "- Recall the names of the payment systems.",
      "solution": "1. SWIFT codes are required for international financial transactions between banks, so the answer is B."
    },
    {
      "number": "1.1.20",
      "marks": 1,
      "clues": "- Earthquakes are not caused by people.",
      "approach": "- Decide whether the cause is natural or political.",
      "solution": "1. Earthquakes are natural disasters, so the answer is D."
    },
    {
      "number": "1.3.5",
      "marks": 1,
      "clues": "- The statistic counts inbound travellers.\n- The period is measured, for example a year.",
      "approach": "- Choose between immigration and foreign arrivals.",
      "solution": "1. Foreign arrivals measures the number of inbound travellers who visit a country in a given period."
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
