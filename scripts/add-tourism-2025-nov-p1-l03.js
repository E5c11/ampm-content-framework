#!/usr/bin/env node
/**
 * DBE Tourism — November 2025 — Question 1: Health, allowances and tour planning (Section A) (order 3)
 * Section A items 1.2.3, 1.2.4, 1.3.1 and 1.5.1–1.5.5 — health precautions, travel allowances, flying time and the aspects of tour planning.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-tourism-2025-nov-p1-l03.js --curriculum temp/curriculum-vocab-tourism.json
 *   node scripts/add-tourism-2025-nov-p1-l03.js --dry-run
 *   node scripts/add-tourism-2025-nov-p1-l03.js
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
  "name": "Question 1: Health, allowances and tour planning (Section A)",
  "syllabus": "dbe",
  "subject": "tourism",
  "year": 2025,
  "paper": "nov_p1",
  "order": 3,
  "content_tier": "free",
  "has_video": false,
  "xp": 8,
  "tags": [
    "health_precautions",
    "tour_planning",
    "flying_time"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2025/nov_p1/q3/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2025/nov_p1/q3/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2025/nov_p1/q3/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2025/nov_p1/q3/memo_2.png"
  ],
  "exam_question_marks": 8,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "A family is travelling to a region where malaria occurs. Select ALL the health precautions that would reduce their risk.",
    "metadata": [
      "Skipping meals during the day",
      "Sleeping under a treated net",
      "Taking preventative medicine",
      "Using insect repellent",
      "Swimming in untreated fresh water"
    ],
    "answer": [
      "Taking preventative medicine",
      "Using insect repellent",
      "Sleeping under a treated net",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "map_work_tour_planning",
    "topic": "health_and_safety",
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
    "question": "Airlines describe the time an aircraft spends in the air between take-off and landing in one way. What is it called?",
    "metadata": [
      "Layover time",
      "Check-in time",
      "Boarding time",
      "Flying time",
      ""
    ],
    "answer": [
      "Flying time",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "map_work_tour_planning",
    "topic": "world_time_zones",
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
    "type": "definition",
    "clues": "- Layovers and check-in happen before or between flights, not in the air."
  },
  {
    "name": "Question 3",
    "question": "Match each aspect of tour planning to the question it helps a planner answer.",
    "metadata": [
      "A - Route planning",
      "B - Accommodation",
      "C - Luggage rules",
      "D - Budget",
      "1 - Where will we sleep, and must we pay a deposit?",
      "2 - How heavy may our bags be on the plane?",
      "3 - Can we afford the services and products on the trip?",
      "4 - How will we travel from one stop to the next?"
    ],
    "answer": [
      "A-4",
      "B-1",
      "C-2",
      "D-3"
    ],
    "presentation": "match",
    "unit": "map_work_tour_planning",
    "topic": "tour_planning",
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
    "type": "application"
  },
  {
    "name": "Question 4",
    "question": "Arrange these steps of planning a tour in a logical order.",
    "metadata": [
      "Book accommodation along the route",
      "Decide on the traveller profile and budget",
      "Draw up the day-by-day itinerary",
      "Choose the route and transport"
    ],
    "answer": [
      "Decide on the traveller profile and budget",
      "Choose the route and transport",
      "Book accommodation along the route",
      "Draw up the day-by-day itinerary"
    ],
    "presentation": "ordering",
    "unit": "map_work_tour_planning",
    "topic": "tour_planning",
    "subtopic": "tour_process_sequence",
    "skills": [
      "sequence_tourism_process"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "tourism",
    "year": 2025,
    "paper": "nov_p1",
    "type": "ordering"
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "1.2.3",
      "marks": 1,
      "clues": "- The measures keep the traveller well.\n- They include medicine, repellent and sunblock.",
      "approach": "- Choose the term that covers preventing illness while travelling.",
      "solution": "1. Health precautions are the use of preventative medication, insect repellents and sunblock."
    },
    {
      "number": "1.2.4",
      "marks": 1,
      "clues": "- The amount is limited per year.\n- It is for foreign currency on overseas trips.",
      "approach": "- Choose the term that describes a permitted yearly amount.",
      "solution": "1. Travel allowances are the amount a traveller may exchange annually when travelling overseas."
    },
    {
      "number": "1.3.1",
      "marks": 1,
      "clues": "- The time is between departure and arrival.\n- It excludes waiting between flights.",
      "approach": "- Compare flying time with layover time.",
      "solution": "1. The time in the air between departure and arrival is flying time."
    },
    {
      "number": "1.5.1",
      "marks": 1,
      "clues": "- The aspect helps you find a logical route.",
      "approach": "- Look at the infographic for the item used to plan a route.",
      "solution": "1. A map helps with planning a logical route."
    },
    {
      "number": "1.5.2",
      "marks": 1,
      "clues": "- A deposit secures a reservation.",
      "approach": "- Find the facility where you stay.",
      "solution": "1. A hotel may require a deposit to secure a reservation."
    },
    {
      "number": "1.5.3",
      "marks": 1,
      "clues": "- Airlines limit weight and size.",
      "approach": "- Find the item that is carried onboard.",
      "solution": "1. Luggage is limited by airlines in weight and size."
    },
    {
      "number": "1.5.4",
      "marks": 1,
      "clues": "- They are the must-see places at a destination.",
      "approach": "- Find the aspect that stands for famous sights.",
      "solution": "1. Icons are the must-see places visited at a destination."
    },
    {
      "number": "1.5.5",
      "marks": 1,
      "clues": "- Services and products are bought before or during a trip.",
      "approach": "- Find what a traveller needs to pay for them.",
      "solution": "1. Travellers must have money to acquire services and products."
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
