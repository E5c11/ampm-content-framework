#!/usr/bin/env node
/**
 * DBE Tourism — November 2024 — Question 1: South African World Heritage Sites (Section A) (order 3)
 * Section A items 1.1.13 and 1.4.1–1.4.5 — the ǂKhomani Cultural Landscape and matching World Heritage Sites to their descriptions and provinces.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-tourism-2024-nov-p1-l03.js --curriculum temp/curriculum-vocab-tourism.json
 *   node scripts/add-tourism-2024-nov-p1-l03.js --dry-run
 *   node scripts/add-tourism-2024-nov-p1-l03.js
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
  "name": "Question 1: South African World Heritage Sites (Section A)",
  "syllabus": "dbe",
  "subject": "tourism",
  "year": 2024,
  "paper": "nov_p1",
  "order": 3,
  "content_tier": "free",
  "has_video": false,
  "xp": 6,
  "tags": [
    "world_heritage_sites",
    "south_african_heritage"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2024/nov_p1/q3/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2024/nov_p1/q3/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2024/nov_p1/q3/memo_1.png"
  ],
  "exam_question_marks": 6,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Match each World Heritage Site to the province where it is found.",
    "metadata": [
      "A - Mapungubwe Cultural Landscape",
      "B - Richtersveld Cultural Landscape",
      "C - iSimangaliso Wetland Park",
      "D - Barberton Makhonjwa Mountains",
      "1 - Northern Cape",
      "2 - KwaZulu-Natal",
      "3 - Mpumalanga",
      "4 - Limpopo"
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
    "year": 2024,
    "paper": "nov_p1",
    "type": "application"
  },
  {
    "name": "Question 2",
    "question": "Which World Heritage Site preserves the remains of a huge meteorite impact?",
    "metadata": [
      "Robben Island",
      "Richtersveld",
      "Mapungubwe",
      "Vredefort Dome",
      ""
    ],
    "answer": [
      "Vredefort Dome",
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
    "year": 2024,
    "paper": "nov_p1",
    "type": "definition"
  },
  {
    "name": "Question 3",
    "question": "The ǂKhomani Cultural Landscape in the Kalahari is linked to the traditional way of life of which people?",
    "metadata": [
      "The Nama",
      "The San",
      "The Zulu",
      "The Xhosa",
      ""
    ],
    "answer": [
      "The San",
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
    "difficulty": 3,
    "exam_weight": 1,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "tourism",
    "year": 2024,
    "paper": "nov_p1",
    "type": "definition",
    "clues": "- Think of the hunter-gatherers known for hunting with a bow and arrow."
  },
  {
    "name": "Question 4",
    "question": "Select ALL the sites that are cultural (not natural) World Heritage Sites.",
    "metadata": [
      "iSimangaliso Wetland Park",
      "ǂKhomani Cultural Landscape",
      "Robben Island",
      "Mapungubwe Cultural Landscape",
      "Vredefort Dome"
    ],
    "answer": [
      "Robben Island",
      "Mapungubwe Cultural Landscape",
      "ǂKhomani Cultural Landscape",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "culture_heritage_tourism",
    "topic": "world_heritage_sites",
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
      "number": "1.1.13",
      "marks": 1,
      "clues": "- The ǂKhomani are San people of the Kalahari.",
      "approach": "- Recall the traditional skills of the San.\n- Rule out the options linked to other heritage sites.",
      "solution": "1. The ǂKhomani Cultural Landscape is associated with hunting with a bow and arrow: B."
    },
    {
      "number": "1.4.1",
      "marks": 1,
      "clues": "- The site shows the remains of an ancient kingdom.\n- It is in Limpopo.",
      "approach": "- Find the site in Column B that lies in Limpopo.\n- Check that it is a cultural site with ancient remains.",
      "solution": "1. Mapungubwe Cultural Landscape: B."
    },
    {
      "number": "1.4.2",
      "marks": 1,
      "clues": "- A meteorite struck the Earth here.\n- It spans the Free State and North West.",
      "approach": "- Find the site in Column B formed by a meteorite impact.\n- Check that it spans the two provinces.",
      "solution": "1. Vredefort Dome: D."
    },
    {
      "number": "1.4.3",
      "marks": 1,
      "clues": "- The site is in Mpumalanga.\n- It has the Geotrail and very old rock formations.",
      "approach": "- Find the site in Column B that lies in Mpumalanga.\n- Check that it is known for ancient rocks.",
      "solution": "1. Barberton Makhonjwa Mountains: F."
    },
    {
      "number": "1.4.4",
      "marks": 1,
      "clues": "- The site is an estuary in KwaZulu-Natal.\n- It is popular for scuba diving.",
      "approach": "- Find the site in Column B on the KwaZulu-Natal coast.\n- Check that it includes a river mouth.",
      "solution": "1. iSimangaliso Wetland Park: C."
    },
    {
      "number": "1.4.5",
      "marks": 1,
      "clues": "- The Sterkfontein Caves are in Gauteng.\n- Early human fossils were found there.",
      "approach": "- Find the site in Column B linked to early human fossils.\n- Check that it lies in Gauteng.",
      "solution": "1. Fossil Hominid Sites of South Africa: A."
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
