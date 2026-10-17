#!/usr/bin/env node
/**
 * DBE Computer Applications Technology — November 2025 Paper 2 (Theory) — Question 8.7: HTML images and bookmarks (order 16)
 * Question 8.7.1, 8.7.2 and 8.7.3 — width and height attributes, why an image does not display and a bookmark in an anchor tag.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-cat-2025-nov-p2-l16.js --curriculum temp/curriculum-vocab-cat.json
 *   node scripts/add-cat-2025-nov-p2-l16.js --dry-run
 *   node scripts/add-cat-2025-nov-p2-l16.js
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
  "name": "Question 8.7: HTML images and bookmarks",
  "syllabus": "dbe",
  "subject": "cat",
  "year": 2025,
  "paper": "nov_p2",
  "order": 16,
  "content_tier": "free",
  "has_video": false,
  "xp": 4,
  "tags": [
    "html_images",
    "html_bookmarks",
    "html_attributes"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/cat/2025/nov_p2/q16/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/cat/2025/nov_p2/q16/memo_1.png"
  ],
  "exam_question_marks": 4,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Which TWO are reasons for setting the width and height attributes in an image tag?",
    "metadata": [
      "To make the image link to another page",
      "To add text that shows if the image fails to load",
      "To change the size of the displayed image",
      "To keep the image in proportion on any screen",
      "To make the image file smaller on the server"
    ],
    "answer": [
      "To change the size of the displayed image",
      "To keep the image in proportion on any screen",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "solution_development",
    "topic": "html_basics",
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
    "type": "application",
    "supplementary_material": {
      "type": "code",
      "label": "HTML code",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/cat/2025/nov_p2/q16/figure_1.png"
      ]
    }
  },
  {
    "name": "Question 2",
    "question": "Using the HTML code in the figure, why would the picture not display on the web page?",
    "metadata": [
      "The alt attribute is missing from the tag",
      "The width and height values are too small",
      "The src file name has no file extension",
      "The anchor tag below it was not closed",
      ""
    ],
    "answer": [
      "The src file name has no file extension",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "solution_development",
    "topic": "html_basics",
    "subtopic": "cat_data_interpretation",
    "skills": [
      "interpret_cat_stimulus"
    ],
    "difficulty": 4,
    "exam_weight": 3,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "cat",
    "year": 2025,
    "paper": "nov_p2",
    "type": "interpretation",
    "clues": "- Look at the value of src.\n- The browser must know which file type to open.",
    "supplementary_material": {
      "type": "code",
      "label": "HTML code",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/cat/2025/nov_p2/q16/figure_1.png"
      ]
    }
  },
  {
    "name": "Question 3",
    "question": "In the HTML code in the figure, what does #Results in the anchor tag refer to?",
    "metadata": [
      "A separate website with that name",
      "A bookmark at a named place on the same page",
      "An image file stored on the server",
      "The text shown when an image fails to load",
      ""
    ],
    "answer": [
      "A bookmark at a named place on the same page",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "solution_development",
    "topic": "html_basics",
    "subtopic": "cat_data_interpretation",
    "skills": [
      "interpret_cat_stimulus"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "cat",
    "year": 2025,
    "paper": "nov_p2",
    "type": "interpretation",
    "supplementary_material": {
      "type": "code",
      "label": "HTML code",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/cat/2025/nov_p2/q16/figure_1.png"
      ]
    }
  },
  {
    "name": "Question 4",
    "question": "Match each HTML item to its purpose.",
    "metadata": [
      "A - <img>",
      "B - alt",
      "C - href",
      "D - <a>",
      "1 - Text shown or read aloud when the image cannot be displayed",
      "2 - Gives the address or bookmark that a link points to",
      "3 - The anchor tag that creates a link",
      "4 - Places an image on the web page"
    ],
    "answer": [
      "A-4",
      "B-1",
      "C-2",
      "D-3"
    ],
    "presentation": "match",
    "unit": "solution_development",
    "topic": "html_basics",
    "subtopic": "cat_term_recall",
    "skills": [
      "recall_cat_term"
    ],
    "difficulty": 3,
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
      "number": "8.7.1",
      "marks": 2,
      "clues": "- Width and height are attributes of the image tag.\n- Think about size and proportion.",
      "approach": "- Give two reasons for setting them.",
      "solution": "1. To change the size of the image or keep correct proportions in any browser or resolution.\n2. To fix an original image that has the wrong aspect ratio, or to improve the layout of the web page."
    },
    {
      "number": "8.7.2",
      "marks": 1,
      "clues": "- Look at the value of src in the image tag.\n- The image file name is Well done.jpg.",
      "approach": "- Compare the src value with the real file name.",
      "solution": "1. The file extension is missing from the file name in src."
    },
    {
      "number": "8.7.3",
      "marks": 1,
      "clues": "- The link uses a # symbol.\n- The address stays on the same page.",
      "approach": "- Recall what # means in an href.",
      "solution": "1. #Stars is a bookmark on the web page."
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
