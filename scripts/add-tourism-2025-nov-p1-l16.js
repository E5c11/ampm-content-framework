#!/usr/bin/env node
/**
 * DBE Tourism — November 2025 — Question 5: World Heritage Sites in South Africa (order 16)
 * Question 5.1–5.4 — types of World Heritage Site, where the sites are, and why UNESCO declares them.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-tourism-2025-nov-p1-l16.js --curriculum temp/curriculum-vocab-tourism.json
 *   node scripts/add-tourism-2025-nov-p1-l16.js --dry-run
 *   node scripts/add-tourism-2025-nov-p1-l16.js
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
  "name": "Question 5: World Heritage Sites in South Africa",
  "syllabus": "dbe",
  "subject": "tourism",
  "year": 2025,
  "paper": "nov_p1",
  "order": 16,
  "content_tier": "free",
  "has_video": false,
  "xp": 12,
  "tags": [
    "world_heritage_sites",
    "unesco_role",
    "south_african_heritage"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2025/nov_p1/q16/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2025/nov_p1/q16/memo_1.png"
  ],
  "exam_question_marks": 12,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Match each South African World Heritage Site to its province.",
    "metadata": [
      "A - Vredefort Dome",
      "B - Mapungubwe Cultural Landscape",
      "C - Robben Island",
      "D - uKhahlamba-Drakensberg Park",
      "1 - Limpopo",
      "2 - Western Cape",
      "3 - KwaZulu-Natal",
      "4 - Free State"
    ],
    "answer": [
      "A-4",
      "B-1",
      "C-2",
      "D-3"
    ],
    "presentation": "match",
    "unit": "culture_heritage_tourism",
    "topic": "south_african_world_heritage",
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
    "year": 2025,
    "paper": "nov_p1",
    "type": "application"
  },
  {
    "name": "Question 2",
    "question": "iSimangaliso Wetland Park is recognised for its outstanding natural beauty and ecosystems. What type of World Heritage Site is it?",
    "metadata": [
      "A cultural site",
      "A historical site",
      "An industrial site",
      "A natural site",
      ""
    ],
    "answer": [
      "A natural site",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "culture_heritage_tourism",
    "topic": "south_african_world_heritage",
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
    "question": "Robben Island was declared a World Heritage Site. Select ALL the reasons for protecting a site like this.",
    "metadata": [
      "To allow any business to build on the island",
      "To preserve where prisoners were held",
      "To acknowledge the liberation struggle",
      "To keep its story for future generations",
      "To make entry free for every visitor"
    ],
    "answer": [
      "To preserve where prisoners were held",
      "To acknowledge the liberation struggle",
      "To keep its story for future generations",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "culture_heritage_tourism",
    "topic": "unesco_role",
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
    "question": "What is the main role of UNESCO in relation to World Heritage Sites?",
    "metadata": [
      "To market the sites at travel trade shows",
      "To declare and help protect valuable sites",
      "To collect the tourism levy for the sites",
      "To grade all the accommodation near the sites",
      ""
    ],
    "answer": [
      "To declare and help protect valuable sites",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "culture_heritage_tourism",
    "topic": "unesco_role",
    "subtopic": "tour_term_recall",
    "skills": [
      "recall_tourism_term"
    ],
    "difficulty": 2,
    "exam_weight": 1,
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
      "number": "5.1",
      "marks": 2,
      "clues": "- The extract says the sites relate to the liberation struggle.",
      "approach": "- Decide whether the sites are natural or cultural.",
      "solution": "1. They are a cultural World Heritage Site."
    },
    {
      "number": "5.2",
      "marks": 4,
      "clues": "- The extract names some component sites.\n- Think about where they are located.",
      "approach": "- List the four provinces from the extract and your knowledge.",
      "solution": "1. The provinces are Gauteng, Free State, Eastern Cape and KwaZulu-Natal."
    },
    {
      "number": "5.3",
      "marks": 2,
      "clues": "- Think about where Mr Mandela was held.",
      "approach": "- Name another World Heritage Site linked to him.",
      "solution": "1. Robben Island is another site associated with Mr Mandela."
    },
    {
      "number": "5.4",
      "marks": 4,
      "clues": "- Think about preservation and acknowledgement.",
      "approach": "- Discuss two reasons UNESCO declared the sites.",
      "solution": "1. To protect and preserve sites related to the establishment of our democracy.\n2. To acknowledge Mandela's contribution to the liberation struggle."
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
