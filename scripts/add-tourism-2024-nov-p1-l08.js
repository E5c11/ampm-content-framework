#!/usr/bin/env node
/**
 * DBE Tourism — November 2024 — Question 2.2: The Schengen visa (order 8)
 * Question 2.2.1–2.2.3 — naming the Schengen visa, where to apply for it, and its advantages.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-tourism-2024-nov-p1-l08.js --curriculum temp/curriculum-vocab-tourism.json
 *   node scripts/add-tourism-2024-nov-p1-l08.js --dry-run
 *   node scripts/add-tourism-2024-nov-p1-l08.js
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
  "name": "Question 2.2: The Schengen visa",
  "syllabus": "dbe",
  "subject": "tourism",
  "year": 2024,
  "paper": "nov_p1",
  "order": 8,
  "content_tier": "free",
  "has_video": false,
  "xp": 7,
  "tags": [
    "schengen_visa",
    "travel_documents"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2024/nov_p1/q8/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2024/nov_p1/q8/memo_1.png"
  ],
  "exam_question_marks": 7,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "A South African tourist plans to visit Spain, Portugal and Germany on one trip. Which visa allows travel between all three countries?",
    "metadata": [
      "A transit visa",
      "A Schengen visa",
      "A work visa",
      "A student visa",
      ""
    ],
    "answer": [
      "A Schengen visa",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "map_work_tour_planning",
    "topic": "travel_documentation",
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
    "question": "Select ALL the advantages of a Schengen visa for a tourist visiting several European countries.",
    "metadata": [
      "No passport is needed at the border",
      "One application covers all the countries",
      "Biometrics are taken only once",
      "Only one visa fee has to be paid",
      "It allows the tourist to work in Europe"
    ],
    "answer": [
      "One application covers all the countries",
      "Only one visa fee has to be paid",
      "Biometrics are taken only once",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "map_work_tour_planning",
    "topic": "travel_documentation",
    "subtopic": "tour_classification",
    "skills": [
      "classify_tourism_concept"
    ],
    "difficulty": 3,
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
    "question": "Put the steps for getting a Schengen visa in a sensible order.",
    "metadata": [
      "Book an appointment at the visa centre",
      "Decide which country is the main destination",
      "Hand in documents and give biometrics",
      "Complete the online visa application form"
    ],
    "answer": [
      "Decide which country is the main destination",
      "Complete the online visa application form",
      "Book an appointment at the visa centre",
      "Hand in documents and give biometrics"
    ],
    "presentation": "ordering",
    "unit": "map_work_tour_planning",
    "topic": "travel_documentation",
    "subtopic": "tour_process_sequence",
    "skills": [
      "sequence_tourism_process"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "tourism",
    "year": 2024,
    "paper": "nov_p1",
    "type": "ordering"
  },
  {
    "name": "Question 4",
    "question": "Match each type of visa to its purpose.",
    "metadata": [
      "A - Schengen visa",
      "B - Transit visa",
      "C - Work visa",
      "D - Study visa",
      "1 - Passing through a country on the way elsewhere",
      "2 - Taking up a job in another country",
      "3 - Attending a university abroad",
      "4 - Travel between several European countries"
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
    "subtopic": "tour_term_recall",
    "skills": [
      "recall_tourism_term"
    ],
    "difficulty": 2,
    "exam_weight": 2,
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
      "number": "2.2.1",
      "marks": 1,
      "clues": "- France, Italy and Spain are all European countries.\n- One visa covers all of them.",
      "approach": "- Recall the visa that allows travel across many European countries.\n- Name it in full.",
      "solution": "1. A Schengen visa."
    },
    {
      "number": "2.2.2",
      "marks": 2,
      "clues": "- The team entered Europe in France.\n- France is also where they spent most of their time.",
      "approach": "- Recall the rule for which country's embassy handles a Schengen application.\n- Link it to France.",
      "solution": "1. France was the first country of entry into Europe.\n2. France is also where they spent most of their time."
    },
    {
      "number": "2.2.3",
      "marks": 4,
      "clues": "- Think about time and money saved.\n- One visa covers three countries.",
      "approach": "- List the benefits of applying once instead of three times.\n- Explain each one in a full sentence.",
      "solution": "1. The visa grants access to all the countries to be visited.\n2. It is convenient to apply for one visa for the three countries.\n3. It also saves time and money, and biometrics are done only once."
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
