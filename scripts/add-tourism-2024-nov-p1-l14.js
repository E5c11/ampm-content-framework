#!/usr/bin/env node
/**
 * DBE Tourism — November 2024 — Question 4.2: How Italy's icons were built (order 14)
 * Question 4.2.1–4.2.2 — identifying the Colosseum, the Leaning Tower of Pisa and Venice, and how each was designed and built.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-tourism-2024-nov-p1-l14.js --curriculum temp/curriculum-vocab-tourism.json
 *   node scripts/add-tourism-2024-nov-p1-l14.js --dry-run
 *   node scripts/add-tourism-2024-nov-p1-l14.js
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
  "name": "Question 4.2: How Italy's icons were built",
  "syllabus": "dbe",
  "subject": "tourism",
  "year": 2024,
  "paper": "nov_p1",
  "order": 14,
  "content_tier": "free",
  "has_video": false,
  "xp": 9,
  "tags": [
    "tourist_icons",
    "icon_design"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2024/nov_p1/q14/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2024/nov_p1/q14/memo_1.png"
  ],
  "exam_question_marks": 9,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Match each icon to a fact about how it was designed or built.",
    "metadata": [
      "A - Colosseum",
      "B - Leaning Tower of Pisa",
      "C - Venice",
      "D - Eiffel Tower",
      "1 - Tilts because of soft, unstable soil",
      "2 - City on wooden poles, linked by canals",
      "3 - Iron tower built for a world fair",
      "4 - Amphitheatre for up to 80 000 spectators"
    ],
    "answer": [
      "A-4",
      "B-1",
      "C-2",
      "D-3"
    ],
    "presentation": "match",
    "unit": "tourist_attractions",
    "topic": "world_icons",
    "subtopic": "tour_classification",
    "skills": [
      "classify_tourism_concept"
    ],
    "difficulty": 3,
    "exam_weight": 2,
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
    "question": "Why does the Leaning Tower of Pisa lean?",
    "metadata": [
      "An earthquake damaged its foundations",
      "It was designed to tilt on purpose",
      "Strong sea winds pushed it over time",
      "It was built on soft, unstable soil",
      ""
    ],
    "answer": [
      "It was built on soft, unstable soil",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "tourist_attractions",
    "topic": "world_icons",
    "subtopic": "tour_cause_and_effect",
    "skills": [
      "explain_tourism_cause_and_effect"
    ],
    "difficulty": 2,
    "exam_weight": 1,
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
    "question": "Select ALL the facts about how Venice was built.",
    "metadata": [
      "It was built on a high mountain plateau",
      "Wooden poles were driven deep into the ground",
      "Canals and bridges link the buildings",
      "Its buildings stand on solid granite rock",
      "It was carved out of one large rock face"
    ],
    "answer": [
      "Wooden poles were driven deep into the ground",
      "Canals and bridges link the buildings",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "tourist_attractions",
    "topic": "world_icons",
    "subtopic": "tour_term_recall",
    "skills": [
      "recall_tourism_term"
    ],
    "difficulty": 3,
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
    "question": "The Colosseum, the Leaning Tower of Pisa and the canals of Venice are all in which country?",
    "metadata": [
      "Spain",
      "Greece",
      "Italy",
      "France",
      ""
    ],
    "answer": [
      "Italy",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "tourist_attractions",
    "topic": "world_icons",
    "subtopic": "tour_term_recall",
    "skills": [
      "recall_tourism_term"
    ],
    "difficulty": 1,
    "exam_weight": 1,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "tourism",
    "year": 2024,
    "paper": "nov_p1",
    "type": "definition"
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "4.2.1",
      "marks": 3,
      "clues": "- All three icons are in Italy.\n- Look at the shape of each picture.",
      "approach": "- Identify the ancient amphitheatre, the tilted tower and the city on water.\n- Match each to its label.",
      "solution": "1. A – Colosseum.\n2. B – Leaning Tower of Pisa.\n3. C – Venice."
    },
    {
      "number": "4.2.2",
      "marks": 6,
      "clues": "- Think about the shape and building materials of each icon.\n- Give one fact for each icon.",
      "approach": "- Describe one design or building fact for each icon.\n- Write a full sentence for each.",
      "solution": "1. Colosseum: an ancient amphitheatre with many levels and arches that seated 50 000 to 80 000 spectators.\n2. Leaning Tower of Pisa: it tilts because it was built on unstable soil; it is mainly white marble.\n3. Venice: a city built on water on long wooden poles driven into hard clay, with canals and bridges linking the buildings."
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
