#!/usr/bin/env node
/**
 * DBE Tourism — November 2025 — Question 2.1.5–2.2: Entry documents and jet lag (order 9)
 * Question 2.1.5, 2.2.1 and 2.2.2 — documents needed to enter a country and the condition and symptoms caused by crossing time zones.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-tourism-2025-nov-p1-l09.js --curriculum temp/curriculum-vocab-tourism.json
 *   node scripts/add-tourism-2025-nov-p1-l09.js --dry-run
 *   node scripts/add-tourism-2025-nov-p1-l09.js
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
  "name": "Question 2.1.5–2.2: Entry documents and jet lag",
  "syllabus": "dbe",
  "subject": "tourism",
  "year": 2025,
  "paper": "nov_p1",
  "order": 9,
  "content_tier": "free",
  "has_video": false,
  "xp": 8,
  "tags": [
    "travel_documents",
    "jet_lag",
    "jet_lag_symptoms"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2025/nov_p1/q9/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2025/nov_p1/q9/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2025/nov_p1/q9/memo_1.png"
  ],
  "exam_question_marks": 8,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Match each travel document to what it does.",
    "metadata": [
      "A - Passport",
      "B - Visa",
      "C - Health certificate",
      "D - International driving permit",
      "1 - Gives permission to enter a country for a set purpose",
      "2 - Proves that required vaccinations were received",
      "3 - Allows driving in a foreign country",
      "4 - Proves identity and nationality"
    ],
    "answer": [
      "A-4",
      "B-1",
      "C-2",
      "D-3"
    ],
    "presentation": "match",
    "unit": "map_work_tour_planning",
    "topic": "travel_documentation",
    "subtopic": "tour_classification",
    "skills": [
      "classify_tourism_concept"
    ],
    "difficulty": 2,
    "exam_weight": 1,
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
    "question": "After crossing eight time zones, a traveller feels exhausted, cannot sleep at the right times and struggles to concentrate. What is this condition called?",
    "metadata": [
      "Altitude sickness",
      "Motion sickness",
      "Heat stroke",
      "Jet lag",
      ""
    ],
    "answer": [
      "Jet lag",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "map_work_tour_planning",
    "topic": "jet_lag",
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
    "question": "Select ALL the symptoms that can be caused by jet lag.",
    "metadata": [
      "Sunburn",
      "Swollen feet",
      "Confusion and disorientation",
      "Indigestion",
      "A rash from insect bites"
    ],
    "answer": [
      "Confusion and disorientation",
      "Indigestion",
      "Swollen feet",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "map_work_tour_planning",
    "topic": "jet_lag",
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
    "question": "Select ALL the actions that can ease the effects of jet lag.",
    "metadata": [
      "Drinking coffee and alcohol throughout the flight",
      "Drinking plenty of water",
      "Adjusting sleeping times before the trip",
      "Spending time in daylight at the destination",
      "Staying in a dark room all day after arrival"
    ],
    "answer": [
      "Drinking plenty of water",
      "Adjusting sleeping times before the trip",
      "Spending time in daylight at the destination",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "map_work_tour_planning",
    "topic": "jet_lag",
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
      "number": "2.1.5",
      "marks": 2,
      "clues": "- Think about what a country checks on entry.\n- Two documents are asked for.",
      "approach": "- Recall the documents required to enter a foreign country.",
      "solution": "1. A valid passport and a valid visa are required."
    },
    {
      "number": "2.2.1",
      "marks": 2,
      "clues": "- The condition follows crossing many time zones.\n- It leaves the traveller exhausted.",
      "approach": "- Recall the name given to this condition.",
      "solution": "1. The condition is jet lag."
    },
    {
      "number": "2.2.2",
      "marks": 4,
      "clues": "- The memo excludes symptoms that only mean exhaustion.\n- Two other symptoms are needed.",
      "approach": "- List symptoms linked to jet lag.\n- Choose two that are not just tiredness.",
      "solution": "1. Thabo would have felt dehydrated.\n2. He would have had swollen feet.\n3. Confusion, disorientation and indigestion are also accepted."
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
