#!/usr/bin/env node
/**
 * DBE Tourism — November 2024 — Question 4.1: Four world icons (order 13)
 * Question 4.1.1–4.1.4 — identifying Christ the Redeemer, the Great Pyramids of Giza, Uluru and the Sydney Opera House, their countries, the icon linked to music, facts about the African icon, and sacred sites.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-tourism-2024-nov-p1-l13.js --curriculum temp/curriculum-vocab-tourism.json
 *   node scripts/add-tourism-2024-nov-p1-l13.js --dry-run
 *   node scripts/add-tourism-2024-nov-p1-l13.js
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
  "name": "Question 4.1: Four world icons",
  "syllabus": "dbe",
  "subject": "tourism",
  "year": 2024,
  "paper": "nov_p1",
  "order": 13,
  "content_tier": "free",
  "has_video": false,
  "xp": 21,
  "tags": [
    "tourist_icons",
    "icon_location"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2024/nov_p1/q13/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2024/nov_p1/q13/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2024/nov_p1/q13/memo_2.png"
  ],
  "exam_question_marks": 21,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Match each world icon to the country where it is found.",
    "metadata": [
      "A - Christ the Redeemer",
      "B - Uluru (Ayers Rock)",
      "C - Great Pyramids of Giza",
      "D - Taj Mahal",
      "1 - Australia",
      "2 - Egypt",
      "3 - India",
      "4 - Brazil"
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
    "difficulty": 2,
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
    "question": "A performing-arts centre on a harbour has a roof of white, sail-shaped shells and hosts operas and concerts. Which icon is this?",
    "metadata": [
      "Burj Khalifa",
      "Sydney Opera House",
      "Eiffel Tower",
      "Colosseum",
      ""
    ],
    "answer": [
      "Sydney Opera House",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "tourist_attractions",
    "topic": "world_icons",
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
    "type": "interpretation"
  },
  {
    "name": "Question 3",
    "question": "Select ALL the correct facts about the Great Pyramids of Giza.",
    "metadata": [
      "They were palaces for living kings",
      "They were built as tombs for pharaohs",
      "They were carved from one red rock",
      "Pharaohs were buried with valuables",
      "They stand on an island in the Nile"
    ],
    "answer": [
      "They were built as tombs for pharaohs",
      "Pharaohs were buried with valuables",
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
    "question": "Select ALL the icons that tourists interested in sacred or religious sites would visit.",
    "metadata": [
      "Sydney Opera House",
      "Uluru (Ayers Rock)",
      "Great Pyramids of Giza",
      "Christ the Redeemer",
      "Niagara Falls"
    ],
    "answer": [
      "Uluru (Ayers Rock)",
      "Christ the Redeemer",
      "Great Pyramids of Giza",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "tourist_attractions",
    "topic": "world_icons",
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
      "number": "4.1.1",
      "marks": 7,
      "clues": "- Look at each of the four puzzle pictures.\n- Give the full names of the icons.",
      "approach": "- (a) Name the four icons in full.\n- (b) Name the three countries; two icons share one country.",
      "solution": "1. (a) The Statue of Christ the Redeemer, the Great Pyramids of Giza, Ayers Rock/Uluru and the Sydney Opera House.\n2. (b) Brazil, Egypt and Australia (Uluru and the Sydney Opera House are both in Australia)."
    },
    {
      "number": "4.1.2",
      "marks": 4,
      "clues": "- One of the icons is a performing-arts venue.",
      "approach": "- Identify the icon linked to music.\n- Give a reason based on what happens there.",
      "solution": "1. (a) The Sydney Opera House.\n2. (b) Operas and music concerts and shows are held in the building."
    },
    {
      "number": "4.1.3",
      "marks": 6,
      "clues": "- The African icon is in Egypt.\n- Think about location, age and purpose.",
      "approach": "- Identify the icon in Africa.\n- Write three facts about its location, history or purpose.",
      "solution": "1. The Great Pyramids of Giza are on the outskirts of Giza, Egypt.\n2. They were built as tombs for the pharaohs, who were buried with their valuable possessions.\n3. They were built more than 1 200 years before the rule of King Tutankhamen; the Great Pyramid is about 147 m tall."
    },
    {
      "number": "4.1.4",
      "marks": 4,
      "clues": "- Some icons have spiritual meaning for people.\n- Any two icons may be used.",
      "approach": "- Choose two icons with religious or sacred meaning.\n- Give a reason for each.",
      "solution": "1. The Statue of Christ the Redeemer is a symbolic protector of the people of Rio de Janeiro.\n2. Uluru/Ayers Rock is a sacred place with spiritual meaning for the indigenous people.\n3. The Great Pyramids of Giza are burial sites of pharaohs who were revered as gods."
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
