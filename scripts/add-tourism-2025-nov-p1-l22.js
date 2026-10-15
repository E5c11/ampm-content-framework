#!/usr/bin/env node
/**
 * DBE Tourism — November 2025 — Question 9.1: How an unforeseen event disrupts global tourism (order 22)
 * Question 9.1.1–9.1.3 — locating a global event, disruptions to airline operations and the economic impact on tourism businesses.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-tourism-2025-nov-p1-l22.js --curriculum temp/curriculum-vocab-tourism.json
 *   node scripts/add-tourism-2025-nov-p1-l22.js --dry-run
 *   node scripts/add-tourism-2025-nov-p1-l22.js
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
  "name": "Question 9.1: How an unforeseen event disrupts global tourism",
  "syllabus": "dbe",
  "subject": "tourism",
  "year": 2025,
  "paper": "nov_p1",
  "order": 22,
  "content_tier": "free",
  "has_video": false,
  "xp": 10,
  "tags": [
    "unforeseen_occurrences",
    "airline_disruption",
    "economic_impact_tourism"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2025/nov_p1/q22/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2025/nov_p1/q22/memo_1.png"
  ],
  "exam_question_marks": 10,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "A severe snowstorm closes a major hub airport for two days. Which category of occurrence is this?",
    "metadata": [
      "A planned global sporting event abroad",
      "A political situation in the host country",
      "An unforeseen occurrence caused by nature",
      "A marketing campaign by the airline",
      ""
    ],
    "answer": [
      "An unforeseen occurrence caused by nature",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "domestic_regional_international_tourism",
    "topic": "global_events_and_occurrences",
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
    "question": "Select ALL the disruptions to airline operations that the closure of a hub airport can cause.",
    "metadata": [
      "Lower ticket taxes",
      "Delayed flights",
      "Cancelled flights",
      "Diverted flights",
      "More empty seats on every route"
    ],
    "answer": [
      "Delayed flights",
      "Cancelled flights",
      "Diverted flights",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "domestic_regional_international_tourism",
    "topic": "airline_disruption",
    "subtopic": "tour_cause_and_effect",
    "skills": [
      "explain_tourism_cause_and_effect"
    ],
    "difficulty": 3,
    "exam_weight": 3,
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
    "question": "Select ALL the economic impacts on global tourism businesses after a hub airport closes for two days.",
    "metadata": [
      "Airlines save money on fuel and staff",
      "Airlines pay extra costs to reroute planes",
      "Stranded passengers need accommodation",
      "Hotels and car hire firms lose bookings",
      "Demand for travel rises worldwide"
    ],
    "answer": [
      "Airlines pay extra costs to reroute planes",
      "Hotels and car hire firms lose bookings",
      "Stranded passengers need accommodation",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "domestic_regional_international_tourism",
    "topic": "airline_disruption",
    "subtopic": "tour_cause_and_effect",
    "skills": [
      "explain_tourism_cause_and_effect"
    ],
    "difficulty": 3,
    "exam_weight": 3,
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
    "question": "Arrange these events in the order in which they follow one another.",
    "metadata": [
      "Passengers are stranded and need accommodation",
      "A storm closes a hub airport",
      "Hotels and tour operators lose bookings",
      "Flights are cancelled or diverted"
    ],
    "answer": [
      "A storm closes a hub airport",
      "Flights are cancelled or diverted",
      "Passengers are stranded and need accommodation",
      "Hotels and tour operators lose bookings"
    ],
    "presentation": "ordering",
    "unit": "domestic_regional_international_tourism",
    "topic": "airline_disruption",
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
      "number": "9.1.1",
      "marks": 2,
      "clues": "- Heathrow is in London.",
      "approach": "- Name the continent of London.",
      "solution": "1. The event happened in Europe."
    },
    {
      "number": "9.1.2",
      "marks": 4,
      "clues": "- Read what happened to flights.",
      "approach": "- Identify two disruptions to airline operations.",
      "solution": "1. Delays in flights.\n2. Cancelled flights."
    },
    {
      "number": "9.1.3",
      "marks": 4,
      "clues": "- Answer for global tourism businesses, not the UK economy.",
      "approach": "- Discuss two economic impacts.",
      "solution": "1. Airports and airlines incurred extra costs to reroute planes.\n2. Stranded passengers needed accommodation."
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
