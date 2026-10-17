#!/usr/bin/env node
/**
 * DBE Computer Applications Technology — November 2025 Paper 2 (Theory) — Question 10.2–10.3: Databases, exporting data, mail merge and augmented reality (order 22)
 * Question 10.2.1, 10.2.2, 10.2.3 and 10.3 — database objects for capturing data, factors before exporting, generating personalised letters and augmented reality versus virtual reality.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-cat-2025-nov-p2-l22.js --curriculum temp/curriculum-vocab-cat.json
 *   node scripts/add-cat-2025-nov-p2-l22.js --dry-run
 *   node scripts/add-cat-2025-nov-p2-l22.js
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
  "name": "Question 10.2–10.3: Databases, exporting data, mail merge and augmented reality",
  "syllabus": "dbe",
  "subject": "cat",
  "year": 2025,
  "paper": "nov_p2",
  "order": 22,
  "content_tier": "free",
  "has_video": false,
  "xp": 7,
  "tags": [
    "database_objects",
    "exporting_data",
    "mail_merge",
    "augmented_reality"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/cat/2025/nov_p2/q22/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/cat/2025/nov_p2/q22/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/cat/2025/nov_p2/q22/memo_2.png"
  ],
  "exam_question_marks": 7,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Match each database object to what it is used for.",
    "metadata": [
      "A - Table",
      "B - Form",
      "C - Query",
      "D - Report",
      "1 - A screen designed for entering one record at a time",
      "2 - Finds the records that meet given criteria",
      "3 - Presents selected data in a form that can be printed",
      "4 - Stores the records"
    ],
    "answer": [
      "A-4",
      "B-1",
      "C-2",
      "D-3"
    ],
    "presentation": "match",
    "unit": "solution_development",
    "topic": "database_design",
    "subtopic": "cat_classification",
    "skills": [
      "classify_cat_concept"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "cat",
    "year": 2025,
    "paper": "nov_p2",
    "type": "application"
  },
  {
    "name": "Question 2",
    "question": "Which TWO factors should be considered before exporting a database table to a spreadsheet?",
    "metadata": [
      "Delete the database once the data has been exported",
      "Rename every field to a single letter",
      "Check that the data types suit a spreadsheet",
      "Decide which records must be exported",
      "Give the spreadsheet the same password as the database"
    ],
    "answer": [
      "Check that the data types suit a spreadsheet",
      "Decide which records must be exported",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "solution_development",
    "topic": "database_design",
    "subtopic": "cat_scenario_application",
    "skills": [
      "apply_cat_concept_to_scenario"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "cat",
    "year": 2025,
    "paper": "nov_p2",
    "type": "application"
  },
  {
    "name": "Question 3",
    "question": "Name the word processing feature that quickly produces a personalised letter for every person in a list. []",
    "metadata": [
      "Feature: ",
      "[ ]"
    ],
    "answer": [
      "mail merge|mailmerge",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "text",
    "unit": "solution_development",
    "topic": "word_processing_features",
    "subtopic": "cat_scenario_application",
    "skills": [
      "apply_cat_concept_to_scenario"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "cat",
    "year": 2025,
    "paper": "nov_p2",
    "type": "application"
  },
  {
    "name": "Question 4",
    "question": "Which TWO are benefits of using augmented reality (AR) instead of virtual reality (VR) for a guided tour of the school?",
    "metadata": [
      "It replaces the real world completely",
      "No special headset is needed to use it",
      "More learners can join in using their phones",
      "It needs no device at all to work properly",
      "It only works inside one dedicated room"
    ],
    "answer": [
      "No special headset is needed to use it",
      "More learners can join in using their phones",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "internet_technologies",
    "topic": "emerging_technologies",
    "subtopic": "cat_cause_and_effect",
    "skills": [
      "explain_cat_cause_and_effect"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "cat",
    "year": 2025,
    "paper": "nov_p2",
    "type": "application"
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "10.2.1",
      "marks": 2,
      "clues": "- The learners' details must be entered into a database.\n- Think about objects used for input.",
      "approach": "- Name two database objects that can capture data.",
      "solution": "1. Table.\n2. Form."
    },
    {
      "number": "10.2.2",
      "marks": 2,
      "clues": "- A table is moved into a spreadsheet.\n- Think about data types, layout and records.",
      "approach": "- Name two factors to consider first.",
      "solution": "1. Any two: suitable data types, formatting and layout that display as they are, selecting which records to export, limits for very large numbers of records, or suitability of the data for spreadsheet functions."
    },
    {
      "number": "10.2.3",
      "marks": 1,
      "clues": "- Each learner receives a personalised letter.\n- Many letters are generated from one document and a list.",
      "approach": "- Recall the feature that combines a letter with a data source.",
      "solution": "1. Mail merge."
    },
    {
      "number": "10.3",
      "marks": 2,
      "clues": "- Compare augmented reality with virtual reality.\n- Think about equipment and the real world.",
      "approach": "- Discuss two benefits of AR.",
      "solution": "1. Any two: no additional equipment such as VR goggles, accessible to more learners, or direct interaction with the real school while receiving digital overlays."
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
