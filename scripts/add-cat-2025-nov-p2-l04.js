#!/usr/bin/env node
/**
 * DBE Computer Applications Technology — November 2025 Paper 2 (Theory) — Question 1–3: Solution Development (Section A) (order 4)
 * Section A items on solution development — Questions 1.8, 1.10, 2.9, 2.10, 3.3 and 3.5.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-cat-2025-nov-p2-l04.js --curriculum temp/curriculum-vocab-cat.json
 *   node scripts/add-cat-2025-nov-p2-l04.js --dry-run
 *   node scripts/add-cat-2025-nov-p2-l04.js
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
  "name": "Question 1–3: Solution Development (Section A)",
  "syllabus": "dbe",
  "subject": "cat",
  "year": 2025,
  "paper": "nov_p2",
  "order": 4,
  "content_tier": "free",
  "has_video": false,
  "xp": 6,
  "tags": [
    "paragraph_formatting",
    "query_criteria",
    "document_themes",
    "spreadsheet_functions",
    "non_breaking_space"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/cat/2025/nov_p2/q4/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/cat/2025/nov_p2/q4/question_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/cat/2025/nov_p2/q4/question_3.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/cat/2025/nov_p2/q4/question_4.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/cat/2025/nov_p2/q4/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/cat/2025/nov_p2/q4/memo_2.png"
  ],
  "exam_question_marks": 6,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Match each feature to what it does.",
    "metadata": [
      "A - Line spacing",
      "B - Theme",
      "C - IF function",
      "D - Non-breaking space",
      "1 - Changes the fonts, colour scheme and effects of a whole document",
      "2 - Chooses between two results depending on a condition",
      "3 - Keeps two words together on the same line",
      "4 - Sets the distance between the lines inside a paragraph"
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
    "subtopic": "cat_term_recall",
    "skills": [
      "recall_cat_term"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "cat",
    "year": 2025,
    "paper": "nov_p2",
    "type": "definition"
  },
  {
    "name": "Question 2",
    "question": "A table lists school club members with their Club and Grade. Which query criteria will list ALL chess players who are NOT in Grade 11?",
    "metadata": [
      "Club = \"Chess\" OR Grade <> 11",
      "Club <> \"Chess\" AND Grade = 11",
      "Club = \"Chess\" AND Grade <> 11",
      "Club = \"Chess\" AND Grade >= 11",
      ""
    ],
    "answer": [
      "Club = \"Chess\" AND Grade <> 11",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "solution_development",
    "topic": "database_queries",
    "subtopic": "cat_scenario_application",
    "skills": [
      "apply_cat_concept_to_scenario"
    ],
    "difficulty": 4,
    "exam_weight": 3,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "cat",
    "year": 2025,
    "paper": "nov_p2",
    "type": "application",
    "clues": "- Both conditions must be true at once.\n- <> means \"not equal to\"."
  },
  {
    "name": "Question 3",
    "question": "A statement says: \"The MIN function can be used to find the second smallest value in a list.\" If the statement is false, which function makes it true?",
    "metadata": [
      "True as written",
      "SMALL",
      "LARGE",
      "COUNT",
      ""
    ],
    "answer": [
      "SMALL",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "solution_development",
    "topic": "spreadsheet_functions",
    "subtopic": "cat_term_recall",
    "skills": [
      "recall_cat_term"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "cat",
    "year": 2025,
    "paper": "nov_p2",
    "type": "definition"
  },
  {
    "name": "Question 4",
    "question": "Which TWO functions can return the highest value in a range of cells?",
    "metadata": [
      "MIN",
      "MAX",
      "COUNT",
      "LARGE",
      "SMALL"
    ],
    "answer": [
      "MAX",
      "LARGE",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "solution_development",
    "topic": "spreadsheet_functions",
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
      "number": "1.8",
      "marks": 1,
      "clues": "- The setting is in a paragraph dialog box.\n- Look at what the setting changes.",
      "approach": "- Compare alignment, spacing, indentation and line spacing.\n- The memo says it adjusts spacing between lines of text.",
      "solution": "1. The setting adjusts the spacing between lines of text, so the answer is D."
    },
    {
      "number": "1.10",
      "marks": 1,
      "clues": "- The query must show netball players only.\n- They must NOT be in Grade 10.",
      "approach": "- Both conditions must be true, so use AND.\n- <> means not equal to.",
      "solution": "1. Sport = \"Netball\" AND Grade <> 10 is correct, option B."
    },
    {
      "number": "2.9",
      "marks": 1,
      "clues": "- One feature uses multiple settings.\n- It formats an entire document with fonts, colour schemes and effects.",
      "approach": "- Compare theme and style.\n- A theme applies to the whole document.",
      "solution": "1. Theme is the answer, G."
    },
    {
      "number": "2.10",
      "marks": 1,
      "clues": "- The function chooses between two options.\n- It depends on a condition.",
      "approach": "- Think about logical functions.",
      "solution": "1. IF is the answer, J."
    },
    {
      "number": "3.3",
      "marks": 1,
      "clues": "- The MAX function returns one value only.\n- Which value does it return?",
      "approach": "- Recall the difference between MAX and LARGE.",
      "solution": "1. False: the function that finds the second highest value is LARGE (MAX gives the highest)."
    },
    {
      "number": "3.5",
      "marks": 1,
      "clues": "- The special character prevents a line break between two words.\n- Which part of the term is wrong?",
      "approach": "- Recall the non-breaking space and non-breaking hyphen.",
      "solution": "1. False: it is a non-breaking space."
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
