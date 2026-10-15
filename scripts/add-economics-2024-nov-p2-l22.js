#!/usr/bin/env node
/**
 * DBE Economics P2 — November 2024 — Question 4.3.1–4.3.3: Types of tourism (order 22)
 * Lesson 22 of 2024 Nov P2 (DESIGN-UNI-14: 4 practice questions). Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2024-nov-p2-l22.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2024-nov-p2-l22.js --dry-run
 *   node scripts/add-economics-2024-nov-p2-l22.js
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

// ─── Phase 2 — lesson document ───────────────────────────────────────────────

const video = {
  "name": "Question 4.3.1–4.3.3: Types of tourism",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2024,
  "paper": "nov_p2",
  "order": 22,
  "content_tier": "free",
  "has_video": false,
  "xp": 10,
  "tags": [
    "ecotourism",
    "tourism"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p2/q22/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p2/q22/memo_1.png"
  ],
  "exam_question_marks": 4,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Image A (illustrative) shows visitors on a guided walk through a nature reserve; Image B shows crowds in a shopping centre. Which image relates to eco-tourism?",
    "metadata": [
      "neither image",
      "Image B",
      "both images",
      "Image A",
      ""
    ],
    "answer": [
      "Image A",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "interpretation",
    "unit": "tourism",
    "topic": "tourism_concepts",
    "subtopic": "econ_data_interpretation",
    "skills": [
      "interpret_economic_data"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Eco-tourism is travel to natural areas that helps to protect them."
  },
  {
    "name": "Question 2",
    "question": "Which institution is responsible for promoting tourism in South Africa?",
    "metadata": [
      "the Competition Commission",
      "the Department of Home Affairs",
      "South African Tourism",
      "the Tourism Business Council",
      ""
    ],
    "answer": [
      "South African Tourism",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "tourism",
    "topic": "tourism_benefits_and_policy",
    "subtopic": "econ_term_definition",
    "skills": [
      "define_economic_term"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Look for the national body whose name is about tourism itself."
  },
  {
    "name": "Question 3",
    "question": "Match each type of tourism to its description.",
    "metadata": [
      "A - Eco-tourism",
      "B - Paleo-tourism",
      "C - Cultural tourism",
      "D - Business tourism",
      "1 - Visiting sites of archaeological significance to learn about fossils",
      "2 - Travelling for meetings and conferences",
      "3 - Responsible travel to natural areas",
      "4 - Experiencing the heritage and traditions of a people"
    ],
    "answer": [
      "A-3",
      "B-1",
      "C-4",
      "D-2"
    ],
    "presentation": "match",
    "type": "definition",
    "unit": "tourism",
    "topic": "tourism_concepts",
    "subtopic": "econ_term_definition",
    "skills": [
      "define_economic_term"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Match by the purpose of the trip: nature, fossils, heritage or work."
  },
  {
    "name": "Question 4",
    "question": "Select ALL the activities that are examples of eco-tourism.",
    "metadata": [
      "A visit to a crowded shopping mall in town",
      "Birdwatching in a reserve",
      "A guided conservation walk",
      "A lodge that recycles waste",
      "A bus tour of casinos and nightclubs"
    ],
    "answer": [
      "Birdwatching in a reserve",
      "A guided conservation walk",
      "A lodge that recycles waste",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "tourism",
    "topic": "tourism_concepts",
    "subtopic": "econ_classification",
    "skills": [
      "classify_economic_concept"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Choose activities that take place in nature and help to look after it."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "4.3.1",
      "marks": 1,
      "clues": "- Look for the image showing nature-based travel.",
      "approach": "- Identify the image.",
      "solution": "Image A."
    },
    {
      "number": "4.3.2",
      "marks": 1,
      "clues": "- Think of the national tourism body.",
      "approach": "- Name the institution.",
      "solution": "South African Tourism (SAT / SATOUR)."
    },
    {
      "number": "4.3.3",
      "marks": 2,
      "clues": "- Think of fossils and archaeological sites.",
      "approach": "- Describe the term.",
      "solution": "Paleo tourism is the activities of tourists visiting sites of great archaeological significance to learn about fossils."
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
