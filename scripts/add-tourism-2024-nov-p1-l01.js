#!/usr/bin/env node
/**
 * DBE Tourism — November 2024 — Question 1: Tour planning, travel health and exchange rates (Section A) (order 1)
 * Section A items 1.1.1–1.1.6 — optional budget expenses, the destination, the International Date Line, cholera and yellow fever precautions, and reading an exchange-rate table.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-tourism-2024-nov-p1-l01.js --curriculum temp/curriculum-vocab-tourism.json
 *   node scripts/add-tourism-2024-nov-p1-l01.js --dry-run
 *   node scripts/add-tourism-2024-nov-p1-l01.js
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
  "name": "Question 1: Tour planning, travel health and exchange rates (Section A)",
  "syllabus": "dbe",
  "subject": "tourism",
  "year": 2024,
  "paper": "nov_p1",
  "order": 1,
  "content_tier": "free",
  "has_video": false,
  "xp": 6,
  "tags": [
    "travel_budget",
    "travel_health",
    "international_date_line"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2024/nov_p1/q1/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2024/nov_p1/q1/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2024/nov_p1/q1/memo_1.png"
  ],
  "exam_question_marks": 6,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Which precaution best protects a traveller against cholera?",
    "metadata": [
      "Sleeping under a mosquito net",
      "Taking antimalarial tablets every day",
      "Drinking only bottled or boiled water",
      "Wearing a hat in the midday sun",
      ""
    ],
    "answer": [
      "Drinking only bottled or boiled water",
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
    "exam_weight": 1,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "tourism",
    "year": 2024,
    "paper": "nov_p1",
    "type": "application",
    "clues": "- Cholera spreads through contaminated food and water, not through insect bites."
  },
  {
    "name": "Question 2",
    "question": "Illustrative rates (rand for one unit of foreign currency): Swiss franc R21,40; US dollar R17,90; Australian dollar R11,80; Japanese yen R0,12. For a South African tourist, which country has the most expensive currency to buy?",
    "metadata": [
      "United States",
      "Switzerland",
      "Japan",
      "Australia",
      ""
    ],
    "answer": [
      "Switzerland",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "foreign_exchange",
    "topic": "tourism_exchange_rates",
    "subtopic": "tour_data_interpretation",
    "skills": [
      "interpret_tourism_stimulus"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "tourism",
    "year": 2024,
    "paper": "nov_p1",
    "type": "interpretation",
    "clues": "- The more rand one unit costs, the more expensive that currency is for a South African."
  },
  {
    "name": "Question 3",
    "question": "Match each travel term to its meaning.",
    "metadata": [
      "A - Destination",
      "B - Departure point",
      "C - Transit",
      "D - International Date Line",
      "1 - The place where a journey begins",
      "2 - Passing through a place on the way elsewhere",
      "3 - Crossing it changes the calendar date",
      "4 - The place where a journey ends"
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
    "subtopic": "tour_term_recall",
    "skills": [
      "recall_tourism_term"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "tourism",
    "year": 2024,
    "paper": "nov_p1",
    "type": "definition"
  },
  {
    "name": "Question 4",
    "question": "Select ALL the costs that are optional extras in a tourist's travel budget.",
    "metadata": [
      "Return flight tickets to the destination",
      "Tips for waiters and tour guides",
      "Accommodation booked for each night",
      "Souvenirs bought at a craft market",
      "Visa fees for entering the country"
    ],
    "answer": [
      "Tips for waiters and tour guides",
      "Souvenirs bought at a craft market",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "map_work_tour_planning",
    "topic": "tour_budget",
    "subtopic": "tour_classification",
    "skills": [
      "classify_tourism_concept"
    ],
    "difficulty": 3,
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
      "number": "1.1.1",
      "marks": 1,
      "clues": "- Tips are not needed to complete the trip.\n- The tourist chooses whether to spend this money.",
      "approach": "- Sort the budget items into necessary and optional expenses.\n- Decide where tips for waiters belong.",
      "solution": "1. Tips depend on the tourist's choice, so they are an optional expense: B."
    },
    {
      "number": "1.1.2",
      "marks": 1,
      "clues": "- The question is about where a journey ends.",
      "approach": "- Recall the terms used for the start, middle and end of a journey.\n- Pick the term for the arrival point.",
      "solution": "1. The arrival point of a journey is the destination: A."
    },
    {
      "number": "1.1.3",
      "marks": 1,
      "clues": "- The line lies at 180° longitude.\n- Time zones are counted from a different line.",
      "approach": "- Recall what happens when a traveller crosses the International Date Line.\n- Rule out the Equator and the Greenwich Meridian descriptions.",
      "solution": "1. Crossing the International Date Line causes a change of date while travelling: C."
    },
    {
      "number": "1.1.4",
      "marks": 1,
      "clues": "- Bottled water protects against diseases carried in water.\n- Malaria is spread by mosquitoes.",
      "approach": "- Link each disease to the way it spreads.\n- Choose the one spread through contaminated water.",
      "solution": "1. Cholera spreads through contaminated water, so bottled water is a precaution against cholera: B."
    },
    {
      "number": "1.1.5",
      "marks": 1,
      "clues": "- A yellow fever certificate is issued after a vaccination.",
      "approach": "- Think about where travellers get travel vaccinations.\n- Rule out places that do not give vaccinations.",
      "solution": "1. A travel clinic gives the vaccination and issues the yellow fever certificate: B."
    },
    {
      "number": "1.1.6",
      "marks": 1,
      "clues": "- The table shows how many rand one unit of each currency costs.\n- The highest figure is the most expensive.",
      "approach": "- Find the currency with the highest rate.\n- Link that currency to its country.",
      "solution": "1. The British pound costs the most rand (23,68), so England is the most expensive destination: D."
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
