#!/usr/bin/env node
/**
 * DBE Computer Applications Technology — November 2025 Paper 2 (Theory) — Question 6: Information management (order 10)
 * Question 6.1–6.5 — URL shortening, report elements, judging an online source, folder structure and reading a chart.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-cat-2025-nov-p2-l10.js --curriculum temp/curriculum-vocab-cat.json
 *   node scripts/add-cat-2025-nov-p2-l10.js --dry-run
 *   node scripts/add-cat-2025-nov-p2-l10.js
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
  "name": "Question 6: Information management",
  "syllabus": "dbe",
  "subject": "cat",
  "year": 2025,
  "paper": "nov_p2",
  "order": 10,
  "content_tier": "free",
  "has_video": false,
  "xp": 10,
  "tags": [
    "url_shortening",
    "report_elements",
    "online_source_reliability",
    "folder_structure",
    "chart_interpretation"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/cat/2025/nov_p2/q10/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/cat/2025/nov_p2/q10/memo_1.png"
  ],
  "exam_question_marks": 10,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Which TWO are benefits of using a URL shortening service?",
    "metadata": [
      "The linked page loads faster for every visitor",
      "A short link is easier to type and remember",
      "The link can be tracked to see how often it is used",
      "The destination website is always checked for safety",
      "The link can never stop working"
    ],
    "answer": [
      "A short link is easier to type and remember",
      "The link can be tracked to see how often it is used",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "information_management",
    "topic": "sources_and_information",
    "subtopic": "cat_cause_and_effect",
    "skills": [
      "explain_cat_cause_and_effect"
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
    "question": "Match each criterion for judging an online source to the question it asks.",
    "metadata": [
      "A - Authority",
      "B - Accuracy",
      "C - Currency",
      "D - Objectivity",
      "1 - Can the facts be checked in other sources?",
      "2 - How recent is the information?",
      "3 - Is the information presented without bias?",
      "4 - Is the author qualified and respected on the topic?"
    ],
    "answer": [
      "A-4",
      "B-1",
      "C-2",
      "D-3"
    ],
    "presentation": "match",
    "unit": "information_management",
    "topic": "sources_and_information",
    "subtopic": "cat_classification",
    "skills": [
      "classify_cat_concept"
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
    "question": "Which item is an element that belongs in a final report?",
    "metadata": [
      "A list of the learner's passwords",
      "The teacher's mark sheet for the whole class and grade",
      "A blank page kept for the next project",
      "A bibliography listing the sources that were used",
      ""
    ],
    "answer": [
      "A bibliography listing the sources that were used",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "information_management",
    "topic": "presenting_information",
    "subtopic": "cat_term_recall",
    "skills": [
      "recall_cat_term"
    ],
    "difficulty": 2,
    "exam_weight": 1,
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
    "question": "Which TWO factors should be considered when planning a folder structure for a project?",
    "metadata": [
      "Save every file loose on the desktop",
      "Give folders and files meaningful names",
      "Name all files \"new\" followed by a number",
      "Create a separate subfolder for each phase of the project",
      "Avoid making a main folder for the project"
    ],
    "answer": [
      "Give folders and files meaningful names",
      "Create a separate subfolder for each phase of the project",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "information_management",
    "topic": "data_management",
    "subtopic": "cat_scenario_application",
    "skills": [
      "apply_cat_concept_to_scenario"
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
  },
  {
    "name": "Question 5",
    "question": "Study the chart. Which TWO things make it difficult to interpret?",
    "metadata": [
      "The chart shows more than one data series",
      "The bars are drawn in grey tones",
      "There is no title saying what the survey is about",
      "The legend only says Series1 and Series2",
      "The vertical axis starts at zero"
    ],
    "answer": [
      "There is no title saying what the survey is about",
      "The legend only says Series1 and Series2",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "information_management",
    "topic": "interpreting_charts",
    "subtopic": "cat_data_interpretation",
    "skills": [
      "interpret_cat_stimulus"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 5,
    "syllabus": "dbe",
    "subject": "cat",
    "year": 2025,
    "paper": "nov_p2",
    "type": "interpretation",
    "clues": "- Look at the top of the chart and at the legend.\n- A reader must be able to tell what each bar stands for.",
    "supplementary_material": {
      "type": "chart",
      "label": "Questionnaire summary chart",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/cat/2025/nov_p2/q10/figure_1.png"
      ]
    }
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "6.1",
      "marks": 2,
      "clues": "- A URL shortening service makes a web address shorter.\n- Think about typing, appearance and tracking.",
      "approach": "- State two benefits for the user.",
      "solution": "1. A short URL is easier to use, type or remember.\n2. It can be customised, give tracking and analytics, or look more professional."
    },
    {
      "number": "6.2",
      "marks": 2,
      "clues": "- The question is about the final practical assessment task report.\n- Think about the parts of a formal report.",
      "approach": "- Name two elements that a report must contain.",
      "solution": "1. Any two of: cover page, table of contents or figures, introduction, body, discussion, findings or recommendations, conclusion, bibliography."
    },
    {
      "number": "6.3",
      "marks": 2,
      "clues": "- The source is online.\n- Think about who wrote it, how accurate and how recent it is.",
      "approach": "- State two criteria for judging reliability.",
      "solution": "1. Any two of: authority, accuracy, currency, objectivity, coverage."
    },
    {
      "number": "6.4",
      "marks": 2,
      "clues": "- A folder structure keeps project files organised.\n- Think about names and phases.",
      "approach": "- State two factors to consider.",
      "solution": "1. Start with a main folder and give folders and files meaningful names.\n2. Create categories for all types of files, with a subfolder for each phase."
    },
    {
      "number": "6.5",
      "marks": 2,
      "clues": "- Look at the chart.\n- Check what a reader needs in order to read it.",
      "approach": "- Check for a title, axis labels, data labels and a meaningful legend.",
      "solution": "1. There is no title or indication of what the questionnaire is about.\n2. There are no axis labels or data labels, and the legend is meaningless."
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
