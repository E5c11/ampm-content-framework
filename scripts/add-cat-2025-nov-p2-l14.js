#!/usr/bin/env node
/**
 * DBE Computer Applications Technology — November 2025 Paper 2 (Theory) — Question 8.3–8.4: Nested IF, AutoFill and protected cells (order 14)
 * Question 8.3.1, 8.3.2 and 8.4 — assigning levels without a lookup, completing a list of numbers and worksheet protection.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-cat-2025-nov-p2-l14.js --curriculum temp/curriculum-vocab-cat.json
 *   node scripts/add-cat-2025-nov-p2-l14.js --dry-run
 *   node scripts/add-cat-2025-nov-p2-l14.js
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
  "name": "Question 8.3–8.4: Nested IF, AutoFill and protected cells",
  "syllabus": "dbe",
  "subject": "cat",
  "year": 2025,
  "paper": "nov_p2",
  "order": 14,
  "content_tier": "free",
  "has_video": false,
  "xp": 3,
  "tags": [
    "nested_if",
    "autofill",
    "cell_protection"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/cat/2025/nov_p2/q14/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/cat/2025/nov_p2/q14/memo_1.png"
  ],
  "exam_question_marks": 3,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Column D gives a symbol for each mark in column C (A: 80 and above, B: 70–79, C: 60–69 and so on). Which TWO approaches can assign the symbols?",
    "metadata": [
      "The SUM function on the marks",
      "A nested IF statement",
      "A LOOKUP using a table of symbols",
      "AutoFill used on its own",
      "Protecting the cells with a password"
    ],
    "answer": [
      "A nested IF statement",
      "A LOOKUP using a table of symbols",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "solution_development",
    "topic": "spreadsheet_functions",
    "subtopic": "cat_data_interpretation",
    "skills": [
      "interpret_cat_stimulus"
    ],
    "difficulty": 4,
    "exam_weight": 3,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "cat",
    "year": 2025,
    "paper": "nov_p2",
    "type": "interpretation",
    "clues": "- The symbol depends on which range the mark falls in.\n- More than one condition must be tested.",
    "supplementary_material": {
      "type": "table",
      "label": "Learner marks and symbols",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/cat/2025/nov_p2/q14/figure_1.png"
      ]
    }
  },
  {
    "name": "Question 2",
    "question": "Which spreadsheet feature was most likely used to fill column A quickly with the numbers 1 to 7?",
    "metadata": [
      "Sorting the list in order",
      "Merging cells together",
      "AutoFill (fill series)",
      "Freezing the top row",
      ""
    ],
    "answer": [
      "AutoFill (fill series)",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "solution_development",
    "topic": "spreadsheet_features",
    "subtopic": "cat_scenario_application",
    "skills": [
      "apply_cat_concept_to_scenario"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "cat",
    "year": 2025,
    "paper": "nov_p2",
    "type": "application",
    "supplementary_material": {
      "type": "table",
      "label": "Learner marks and symbols",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/cat/2025/nov_p2/q14/figure_1.png"
      ]
    }
  },
  {
    "name": "Question 3",
    "question": "A worksheet from a friend lets you type in a few cells only. A message appears when you try to edit any other cell. What is the reason?",
    "metadata": [
      "The file is too large to edit",
      "The other cells are protected",
      "The cells are formatted as text",
      "The formulas contain errors",
      ""
    ],
    "answer": [
      "The other cells are protected",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "solution_development",
    "topic": "spreadsheet_features",
    "subtopic": "cat_cause_and_effect",
    "skills": [
      "explain_cat_cause_and_effect"
    ],
    "difficulty": 3,
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
    "question": "Match each spreadsheet feature to what it does.",
    "metadata": [
      "A - AutoFill",
      "B - Nested IF",
      "C - Cell protection",
      "D - Conditional formatting",
      "1 - Tests several conditions in one formula",
      "2 - Prevents changes to chosen cells",
      "3 - Changes how a cell looks when a rule is met",
      "4 - Completes a series of numbers or dates by dragging"
    ],
    "answer": [
      "A-4",
      "B-1",
      "C-2",
      "D-3"
    ],
    "presentation": "match",
    "unit": "solution_development",
    "topic": "spreadsheet_features",
    "subtopic": "cat_term_recall",
    "skills": [
      "recall_cat_term"
    ],
    "difficulty": 2,
    "exam_weight": 2,
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
      "number": "8.3.1",
      "marks": 1,
      "clues": "- The level depends on the percentage.\n- A LOOKUP function is not allowed as the answer.",
      "approach": "- Think about a function that tests several conditions in turn.",
      "solution": "1. A nested IF statement."
    },
    {
      "number": "8.3.2",
      "marks": 1,
      "clues": "- Column A holds a list of consecutive numbers.\n- It was completed without typing every number.",
      "approach": "- Recall the feature that continues a series by dragging.",
      "solution": "1. AutoFill (fill series)."
    },
    {
      "number": "8.4",
      "marks": 1,
      "clues": "- Only certain cells can be edited.\n- A pop-up appears for the others.",
      "approach": "- Think about worksheet protection.",
      "solution": "1. The cells are protected, and only the unprotected cells can be worked in."
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
