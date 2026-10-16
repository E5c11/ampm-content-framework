#!/usr/bin/env node
/**
 * DBE Tourism — November 2024 — Question 2.3: Safety at the beach and in the city (order 9)
 * Question 2.3.1–2.3.3 — valuables for the hotel safe, protection from the sun, and safety while exploring a city at night.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-tourism-2024-nov-p1-l09.js --curriculum temp/curriculum-vocab-tourism.json
 *   node scripts/add-tourism-2024-nov-p1-l09.js --dry-run
 *   node scripts/add-tourism-2024-nov-p1-l09.js
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
  "name": "Question 2.3: Safety at the beach and in the city",
  "syllabus": "dbe",
  "subject": "tourism",
  "year": 2024,
  "paper": "nov_p1",
  "order": 9,
  "content_tier": "free",
  "has_video": false,
  "xp": 13,
  "tags": [
    "tourist_safety",
    "sun_protection"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2024/nov_p1/q9/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2024/nov_p1/q9/memo_1.png"
  ],
  "exam_question_marks": 13,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Before going to the beach, select ALL the items a tourist should lock in the hotel-room safe.",
    "metadata": [
      "Sunscreen",
      "Expensive jewellery",
      "Passport",
      "Spare cash and bank cards",
      "Beach towel"
    ],
    "answer": [
      "Passport",
      "Spare cash and bank cards",
      "Expensive jewellery",
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
    "difficulty": 2,
    "exam_weight": 1,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "tourism",
    "year": 2024,
    "paper": "nov_p1",
    "type": "application"
  },
  {
    "name": "Question 2",
    "question": "Select ALL the ways a tourist can protect against too much sun at the beach.",
    "metadata": [
      "Swim during the hottest hours",
      "Apply sunscreen with a high SPF",
      "Wear a wide-brimmed hat and sunglasses",
      "Stay in the shade at midday",
      "Use baby oil to tan faster"
    ],
    "answer": [
      "Apply sunscreen with a high SPF",
      "Wear a wide-brimmed hat and sunglasses",
      "Stay in the shade at midday",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "map_work_tour_planning",
    "topic": "health_and_safety",
    "subtopic": "tour_classification",
    "skills": [
      "classify_tourism_concept"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "tourism",
    "year": 2024,
    "paper": "nov_p1",
    "type": "application"
  },
  {
    "name": "Question 3",
    "question": "Which advice will best keep a group safe while exploring a city at night?",
    "metadata": [
      "Ask strangers for directions when lost",
      "Hold your phone out to navigate on foot",
      "Take shortcuts through quiet alleys",
      "Stay together in well-lit, busy streets",
      ""
    ],
    "answer": [
      "Stay together in well-lit, busy streets",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "map_work_tour_planning",
    "topic": "health_and_safety",
    "subtopic": "tour_scenario_application",
    "skills": [
      "apply_tourism_concept_to_scenario"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "tourism",
    "year": 2024,
    "paper": "nov_p1",
    "type": "application"
  },
  {
    "name": "Question 4",
    "question": "Match each safety measure to the risk it reduces.",
    "metadata": [
      "A - Hotel-room safe",
      "B - High-SPF sunscreen",
      "C - Walking in a group",
      "D - Drinking enough water",
      "1 - Sunburn",
      "2 - Being targeted by criminals",
      "3 - Dehydration in the heat",
      "4 - Theft of passports and valuables"
    ],
    "answer": [
      "A-4",
      "B-1",
      "C-2",
      "D-3"
    ],
    "presentation": "match",
    "unit": "map_work_tour_planning",
    "topic": "health_and_safety",
    "subtopic": "tour_cause_and_effect",
    "skills": [
      "explain_tourism_cause_and_effect"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "tourism",
    "year": 2024,
    "paper": "nov_p1",
    "type": "application"
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "2.3.1",
      "marks": 2,
      "clues": "- Think about items that are valuable or hard to replace.",
      "approach": "- List items that should not be taken to the beach.\n- Choose two of them.",
      "solution": "1. Official travel documents, e.g. passports and flight tickets.\n2. Money (cash or cards); valuables, medication and electronic devices are also accepted."
    },
    {
      "number": "2.3.2",
      "marks": 7,
      "clues": "- Think about skin, eyes and the hottest hours.\n- One mark is for writing a paragraph in full sentences.",
      "approach": "- Choose three ways to protect against the sun.\n- Write them as full sentences in one paragraph.",
      "solution": "1. Use sunblock with a high sun protection factor (SPF).\n2. Wear protective hats, clothing and sunglasses.\n3. Take personal responsibility: limit time in the sun in the hottest part of the day, use umbrellas or shade and stay hydrated.\n4. The paragraph mark cannot be tested in the app; write full sentences in the exam."
    },
    {
      "number": "2.3.3",
      "marks": 4,
      "clues": "- Think about walking around a city after dark.\n- Avoid situations where criminals target tourists.",
      "approach": "- Suggest two safety measures.\n- Explain each one briefly.",
      "solution": "1. Do not walk alone; stay in groups.\n2. Avoid poorly lit or isolated areas; also keep valuables and cell phones out of sight."
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
