#!/usr/bin/env node
/**
 * DBE English FAL P3 — November 2024 — Question 2.2: Magazine Article (order 3) — 'How to manage your leisure time effectively', 120–150 words, 30-mark rubric.
 * Practice questions are fresh (DESIGN-UNI-01) and follow the shared rules: context_text null for literature (SETWORK-LES-05),
 * fresh targets, conventions-based for writing (LANG-WR-03); aiExplanation is one entry per REAL printed sub-question with its
 * real marks, derived from the memo in own words (AIEXP-08). Every fitb declares keyboard_type 'text' (LANG-KB-01).
 * Text key: none (language / writing paper).
 *
 * BASIS per practice question — BK book knowledge (verify against the text), P printed in the paper/poem, M memo,
 * PT vocabulary/title, C CAPS, P1 language-paper skill:
 *   Q1: M: memo 2.2 'suitable heading'.
 *   Q2: M: memo 2.2 heading and paragraphs not too long.
 *   Q3: M: memo 2.2 'addressing the reader directly', 'stimulate interest'.
 *   Q4: M: memo 2.2 style.
 *   Q5: M: memo 2.2 'provide advice to the reader'.
 *
 *   node tools/validate-questions.js --script scripts/add-english-fal-2024-nov-p3-q3.js --curriculum temp/curriculum-vocab-english-fal.json
 *   node scripts/add-english-fal-2024-nov-p3-q3.js --dry-run
 *   node scripts/add-english-fal-2024-nov-p3-q3.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

// ─── Lesson document ─────────────────────────────────────────────────────────

const video = {
  "name": "Question 2.2: Magazine Article",
  "syllabus": "dbe",
  "subject": "english_fal",
  "year": 2024,
  "paper": "nov_p3",
  "order": 3,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "magazine_article",
    "magazine_article_structure",
    "transactional_writing",
    "language_register"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p3/q3/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p3/q3/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p3/q3/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p3/q3/memo_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p3/q3/memo_3.png"
  ],
  "exam_question_marks": 30,
  "supplementary_materials": null
};

// ─── Practice questions ──────────────────────────────────────────────────────

const questions = [
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2024,
    "paper": "nov_p3",
    "name": "Question 1",
    "order": 1,
    "context_text": null,
    "question": "Which heading is most suitable for an advice article for teenagers about leisure time?",
    "metadata": [
      "Article",
      "Leisure time report 2024",
      "Switch off, slow down: simple ways to enjoy your free time",
      "Why this magazine exists",
      ""
    ],
    "answer": [
      "Switch off, slow down: simple ways to enjoy your free time",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "transactional_writing",
    "topic": "magazine_article",
    "subtopic": "headline",
    "skills": [
      "english_fal_write_headline"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- A heading should attract the reader and suit the topic.\n- Reject headings that are dull or off-topic."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2024,
    "paper": "nov_p3",
    "name": "Question 2",
    "order": 2,
    "context_text": null,
    "question": "Select the TWO features an article for a teenage magazine should have.",
    "metadata": [
      "a suitable heading",
      "a postal address",
      "short paragraphs",
      "a legal disclaimer",
      ""
    ],
    "answer": [
      "a suitable heading",
      "short paragraphs",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "transactional_writing",
    "topic": "magazine_article",
    "subtopic": "features_of_an_article",
    "skills": [
      "english_fal_identify_format_features"
    ],
    "difficulty": 1,
    "exam_weight": 1,
    "clues": "- Think about how a magazine page is laid out.\n- Reject features that belong to other texts."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2024,
    "paper": "nov_p3",
    "name": "Question 3",
    "order": 3,
    "context_text": null,
    "question": "Which opening best draws a teenage reader into an advice article?",
    "metadata": [
      "This article is about time.",
      "Time is a topic.",
      "In conclusion, leisure matters.",
      "Ever finished a free afternoon and wondered where the time went?",
      ""
    ],
    "answer": [
      "Ever finished a free afternoon and wondered where the time went?",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "transactional_writing",
    "topic": "magazine_article",
    "subtopic": "opening_hook",
    "skills": [
      "english_fal_write_an_opening"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- A hook speaks directly to the reader.\n- Reject openings that only announce the topic or end the article."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2024,
    "paper": "nov_p3",
    "name": "Question 4",
    "order": 4,
    "context_text": null,
    "question": "Which description best fits the style of the article?",
    "metadata": [
      "cold and legal",
      "personal, speaking directly to the reader",
      "written only in the past tense",
      "full of long technical words",
      ""
    ],
    "answer": [
      "personal, speaking directly to the reader",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "transactional_writing",
    "topic": "magazine_article",
    "subtopic": "style_of_an_article",
    "skills": [
      "english_fal_choose_appropriate_register"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Think about how a teenage magazine talks to its readers.\n- The style is friendly."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2024,
    "paper": "nov_p3",
    "name": "Question 5",
    "order": 5,
    "context_text": null,
    "question": "What must the article give the reader on how to manage leisure time effectively? Write one word.",
    "metadata": [
      "Word:",
      "[ ]"
    ],
    "answer": [
      "advice",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "definition",
    "unit": "transactional_writing",
    "topic": "magazine_article",
    "subtopic": "purpose_of_an_article",
    "skills": [
      "english_fal_recall_task_requirements"
    ],
    "difficulty": 1,
    "exam_weight": 1,
    "clues": "- The reader wants help.\n- Write one word.",
    "keyboard_type": "text"
  }
];

// ─── AI explanation — one entry per REAL printed sub-question, real marks (AIEXP-08) ───

const aiExplanation = {
  "sub_questions": [
    {
      "number": "2.2",
      "marks": 30,
      "clues": "- Plan three or four pieces of advice before you write.",
      "approach": "- Write a suitable heading\n- Speak directly to the reader\n- Give advice on managing leisure time",
      "solution": "1. The article needs a suitable heading and paragraphs that are not too long.\n2. The style is personal, can be descriptive and figurative, and keeps the reader engaged.\n3. It must give advice on managing leisure time effectively."
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
    console.error(
      '\n   curriculum_nodes / skills → node tools/create-curriculum-node.js | create-skill.js' +
      '\n   tags → node tools/create-tag.js',
    );
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
}

// Only run when invoked directly — so validate-questions.js (and anything else) can load
// this file for its data blocks without opening a DB connection or writing anything.
if (require.main === module) {
  upload()
    .catch((err) => {
      console.error('\n❌ Upload failed:', err.message);
      process.exitCode = 1;
    })
    .finally(closePool);
}
