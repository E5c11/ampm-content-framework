#!/usr/bin/env node
/**
 * DBE Economics P2 — November 2024 — Question 3.3.1–3.3.3: Tourist arrivals (order 15)
 * Lesson 15 of 2024 Nov P2 (DESIGN-UNI-14: 4 practice questions). Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2024-nov-p2-l15.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2024-nov-p2-l15.js --dry-run
 *   node scripts/add-economics-2024-nov-p2-l15.js
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
  "name": "Question 3.3.1–3.3.3: Tourist arrivals",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2024,
  "paper": "nov_p2",
  "order": 15,
  "content_tier": "free",
  "has_video": false,
  "xp": 10,
  "tags": [
    "tourism",
    "tourism_impacts"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p2/q15/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p2/q15/memo_1.png"
  ],
  "exam_question_marks": 4,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Study the graph (illustrative). How many tourist arrivals, in millions, were there in the fourth quarter of 2023? []",
    "metadata": [
      "Arrivals (millions) = ",
      "[ ]"
    ],
    "answer": [
      "1.8",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "type": "reading",
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
    "clues": "- Find the bar for the fourth quarter and read its label.",
    "supplementary_material": {
      "type": "diagram",
      "label": "Graph",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/economics/2024/nov_p2/q15/diagram_1.png"
      ]
    }
  },
  {
    "name": "Question 2",
    "question": "Study the graph. Select ALL the statements that are correct.",
    "metadata": [
      "Arrivals rose after the second quarter",
      "The second quarter was the lowest",
      "Arrivals fell in the fourth quarter compared with the third",
      "The third quarter beat the first",
      "Arrivals were exactly the same in every quarter of the year"
    ],
    "answer": [
      "Arrivals rose after the second quarter",
      "The second quarter was the lowest",
      "The third quarter beat the first",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "interpretation",
    "unit": "tourism",
    "topic": "tourism_concepts",
    "subtopic": "econ_data_interpretation",
    "skills": [
      "interpret_economic_data"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Compare each bar with the one before it.",
    "supplementary_material": {
      "type": "diagram",
      "label": "Graph",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/economics/2024/nov_p2/q15/diagram_1.png"
      ]
    }
  },
  {
    "name": "Question 3",
    "question": "Which of the following is an environmental World Heritage Site in South Africa?",
    "metadata": [
      "the Cradle of Humankind",
      "Robben Island",
      "the Mapungubwe Cultural Landscape",
      "the iSimangaliso Wetland Park",
      ""
    ],
    "answer": [
      "the iSimangaliso Wetland Park",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
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
    "clues": "- Look for the site listed for its natural environment rather than for its culture or fossils."
  },
  {
    "name": "Question 4",
    "question": "A Johannesburg family spends a weekend at a resort in the Drakensberg. Which type of tourism is this?",
    "metadata": [
      "inbound tourism",
      "outbound tourism",
      "domestic tourism",
      "international tourism",
      ""
    ],
    "answer": [
      "domestic tourism",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "tourism",
    "topic": "tourism_concepts",
    "subtopic": "econ_classification",
    "skills": [
      "classify_economic_concept"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Ask whether the family crossed a border."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "3.3.1",
      "marks": 1,
      "clues": "- Find the fourth quarter of 2023 on the graph.",
      "approach": "- Read the value.",
      "solution": "There were 1,7 million SADC tourist arrivals in the fourth quarter of 2023."
    },
    {
      "number": "3.3.2",
      "marks": 1,
      "clues": "- Think of South Africa's natural World Heritage Sites.",
      "approach": "- Name one.",
      "solution": "For example the iSimangaliso Wetland Park, the Cape Floral Region, the Maloti-Drakensberg Park or Vredefort Dome."
    },
    {
      "number": "3.3.3",
      "marks": 2,
      "clues": "- Think of people visiting places within their own country.",
      "approach": "- Describe the term.",
      "solution": "Domestic tourism is the activities of people visiting places within the boundaries of their own country."
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
