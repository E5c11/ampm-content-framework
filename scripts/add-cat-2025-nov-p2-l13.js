#!/usr/bin/env node
/**
 * DBE Computer Applications Technology — November 2025 Paper 2 (Theory) — Question 8.1–8.2: Table of figures, index, embedded and linked objects (order 13)
 * Question 8.1.1, 8.1.2 and 8.2 — preparing a table of figures and an index, and the difference between embedded and linked objects.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-cat-2025-nov-p2-l13.js --curriculum temp/curriculum-vocab-cat.json
 *   node scripts/add-cat-2025-nov-p2-l13.js --dry-run
 *   node scripts/add-cat-2025-nov-p2-l13.js
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
  "name": "Question 8.1–8.2: Table of figures, index, embedded and linked objects",
  "syllabus": "dbe",
  "subject": "cat",
  "year": 2025,
  "paper": "nov_p2",
  "order": 13,
  "content_tier": "free",
  "has_video": false,
  "xp": 4,
  "tags": [
    "table_of_figures",
    "document_index",
    "embedded_and_linked_objects"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/cat/2025/nov_p2/q13/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/cat/2025/nov_p2/q13/memo_1.png"
  ],
  "exam_question_marks": 4,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Which action must be done BEFORE an automatic table of figures can be created?",
    "metadata": [
      "Mark the entries for each figure in an index",
      "Apply a theme to the whole document",
      "Insert page numbers in the footer",
      "Insert captions for the images and diagrams",
      ""
    ],
    "answer": [
      "Insert captions for the images and diagrams",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "solution_development",
    "topic": "word_processing_features",
    "subtopic": "cat_scenario_application",
    "skills": [
      "apply_cat_concept_to_scenario"
    ],
    "difficulty": 3,
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
    "question": "Which action must be done BEFORE an automatic index can be created?",
    "metadata": [
      "Insert a caption below every word",
      "Apply heading styles to every paragraph in the document",
      "Mark the words that must appear in the index",
      "Insert a bookmark at each page break",
      ""
    ],
    "answer": [
      "Mark the words that must appear in the index",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "solution_development",
    "topic": "word_processing_features",
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
    "type": "application",
    "clues": "- The index lists words, not headings or figures.\n- The program needs to know which words to list."
  },
  {
    "name": "Question 3",
    "question": "Match each term to the description that fits it.",
    "metadata": [
      "A - Embedded object",
      "B - Linked object",
      "C - Caption",
      "D - Index entry",
      "1 - Updates when the original source file changes",
      "2 - A label with a figure so it can be listed automatically",
      "3 - A marked word that appears in the alphabetical list",
      "4 - A separate copy; changes to the source file do not affect it"
    ],
    "answer": [
      "A-4",
      "B-1",
      "C-2",
      "D-3"
    ],
    "presentation": "match",
    "unit": "solution_development",
    "topic": "word_processing_features",
    "subtopic": "cat_classification",
    "skills": [
      "classify_cat_concept"
    ],
    "difficulty": 3,
    "exam_weight": 2,
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
    "question": "Which TWO statements about a linked object are correct?",
    "metadata": [
      "It opens as a separate independent document",
      "It is not connected to the source file",
      "It stays connected to the source document",
      "It updates when the source document changes",
      "It is stored completely inside the destination file"
    ],
    "answer": [
      "It stays connected to the source document",
      "It updates when the source document changes",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "solution_development",
    "topic": "word_processing_features",
    "subtopic": "cat_classification",
    "skills": [
      "classify_cat_concept"
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
      "number": "8.1.1",
      "marks": 1,
      "clues": "- A table of figures lists the diagrams.\n- It uses labels attached to them.",
      "approach": "- Think about what each figure needs before it can be listed.",
      "solution": "1. Add captions to the figures, diagrams or images."
    },
    {
      "number": "8.1.2",
      "marks": 1,
      "clues": "- An index is an alphabetical list of words.\n- The words must be identified first.",
      "approach": "- Think about how the program learns which words to list.",
      "solution": "1. Mark the entries on all the words to be included in the index."
    },
    {
      "number": "8.2",
      "marks": 2,
      "clues": "- Compare how each object relates to its source.\n- One mark for each difference.",
      "approach": "- Say whether each is linked to the source and how it updates.",
      "solution": "1. An embedded object is not linked to the source document; a linked object is linked to it.\n2. An embedded object opens as a separate, independent document; a linked object updates with data from the original source."
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
