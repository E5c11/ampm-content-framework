#!/usr/bin/env node
/**
 * DBE Computer Applications Technology — November 2025 Paper 2 (Theory) — Question 9.4–9.5: Spreadsheet errors, fitting a table in a document and the body tag (order 19)
 * Question 9.4.1, 9.4.2 and 9.5 — the #NAME? error, fitting all columns of a table on a page and the purpose of the body tag.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-cat-2025-nov-p2-l19.js --curriculum temp/curriculum-vocab-cat.json
 *   node scripts/add-cat-2025-nov-p2-l19.js --dry-run
 *   node scripts/add-cat-2025-nov-p2-l19.js
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
  "name": "Question 9.4–9.5: Spreadsheet errors, fitting a table in a document and the body tag",
  "syllabus": "dbe",
  "subject": "cat",
  "year": 2025,
  "paper": "nov_p2",
  "order": 19,
  "content_tier": "free",
  "has_video": false,
  "xp": 4,
  "tags": [
    "spreadsheet_errors",
    "table_formatting",
    "html_body_tag"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/cat/2025/nov_p2/q19/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/cat/2025/nov_p2/q19/memo_1.png"
  ],
  "exam_question_marks": 4,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "A learner typed =SUMM(B2:B5) in cell B6 and the cell shows #NAME?. What does this error mean?",
    "metadata": [
      "The range contains text instead of numbers",
      "The function name was spelled incorrectly",
      "The formula is dividing a number by zero",
      "The cell reference is no longer valid",
      ""
    ],
    "answer": [
      "The function name was spelled incorrectly",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "solution_development",
    "topic": "spreadsheet_errors",
    "subtopic": "cat_data_interpretation",
    "skills": [
      "interpret_cat_stimulus"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "cat",
    "year": 2025,
    "paper": "nov_p2",
    "type": "interpretation",
    "clues": "- Look at the function name in the formula.\n- Compare it with the real function name.",
    "supplementary_material": {
      "type": "table",
      "label": "Hours trained per day",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/cat/2025/nov_p2/q19/figure_1.png"
      ]
    }
  },
  {
    "name": "Question 2",
    "question": "Match each spreadsheet error value to what it means.",
    "metadata": [
      "A - #NAME?",
      "B - #DIV/0!",
      "C - #REF!",
      "D - #VALUE!",
      "1 - The formula divides a number by zero",
      "2 - A cell reference is no longer valid",
      "3 - The wrong type of data is used in the formula",
      "4 - The function name was not recognised"
    ],
    "answer": [
      "A-4",
      "B-1",
      "C-2",
      "D-3"
    ],
    "presentation": "match",
    "unit": "solution_development",
    "topic": "spreadsheet_errors",
    "subtopic": "cat_term_recall",
    "skills": [
      "recall_cat_term"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "cat",
    "year": 2025,
    "paper": "nov_p2",
    "type": "definition"
  },
  {
    "name": "Question 3",
    "question": "A spreadsheet table is pasted into a word processing document, but some columns do not fit on the page. Without changing the font size, which TWO actions can make all columns fit?",
    "metadata": [
      "Make the font size larger instead",
      "Adjust the column widths",
      "Add more columns to the table",
      "Use AutoFit to the contents of the table",
      "Change the page colour to a lighter shade"
    ],
    "answer": [
      "Adjust the column widths",
      "Use AutoFit to the contents of the table",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "solution_development",
    "topic": "word_processing_features",
    "subtopic": "cat_scenario_application",
    "skills": [
      "apply_cat_concept_to_scenario"
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
    "question": "What is the purpose of the body tag in HTML?",
    "metadata": [
      "It holds the title shown on the browser tab",
      "It defines the style rules for the whole web page",
      "It links the page to another website",
      "It holds the content shown in the browser window",
      ""
    ],
    "answer": [
      "It holds the content shown in the browser window",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "solution_development",
    "topic": "html_basics",
    "subtopic": "cat_term_recall",
    "skills": [
      "recall_cat_term"
    ],
    "difficulty": 3,
    "exam_weight": 1,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "cat",
    "year": 2025,
    "paper": "nov_p2",
    "type": "definition"
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "9.4.1",
      "marks": 1,
      "clues": "- The function was typed as SUMS.\n- Look at what #NAME? tells the user.",
      "approach": "- Compare the typed function with a real function name.",
      "solution": "1. The function is typed incorrectly: there is a spelling error in cell B7."
    },
    {
      "number": "9.4.2",
      "marks": 2,
      "clues": "- The table is wider than the page.\n- The font size must stay the same.",
      "approach": "- Think about the table, not the text.",
      "solution": "1. Adjust the column widths.\n2. Use AutoFit to the contents."
    },
    {
      "number": "9.5",
      "marks": 1,
      "clues": "- An HTML document has a head and a body.\n- The spreadsheet data goes in the body.",
      "approach": "- Recall what the body tag contains.",
      "solution": "1. The body tag contains the content that is displayed in the browser window."
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
