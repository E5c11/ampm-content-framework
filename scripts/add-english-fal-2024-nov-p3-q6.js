#!/usr/bin/env node
/**
 * DBE English FAL P3 — November 2024 — Question 3.1: Poster (order 6) — a poster to promote tourism in the learner's hometown, 80–100 words, 20-mark rubric.
 * Practice questions are fresh (DESIGN-UNI-01) and follow the shared rules: context_text null for literature (SETWORK-LES-05),
 * fresh targets, conventions-based for writing (LANG-WR-03); aiExplanation is one entry per REAL printed sub-question with its
 * real marks, derived from the memo in own words (AIEXP-08). Every fitb declares keyboard_type 'text' (LANG-KB-01).
 * Text key: none (language / writing paper).
 *
 * BASIS per practice question — BK book knowledge (verify against the text), P printed in the paper/poem, M memo,
 * PT vocabulary/title, C CAPS, P1 language-paper skill:
 *   Q1: M: memo 3.1 eye-catching headline.
 *   Q2: M: memo 3.1 sufficient details and contact details.
 *   Q3: M: memo 3.1 'catchy words and phrases must be credited'.
 *   Q4: P: 80–100 words.
 *   Q5: P/M: task note and memo 3.1 note.
 *
 *   node tools/validate-questions.js --script scripts/add-english-fal-2024-nov-p3-q6.js --curriculum temp/curriculum-vocab-english-fal.json
 *   node scripts/add-english-fal-2024-nov-p3-q6.js --dry-run
 *   node scripts/add-english-fal-2024-nov-p3-q6.js
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
  "name": "Question 3.1: Poster",
  "syllabus": "dbe",
  "subject": "english_fal",
  "year": 2024,
  "paper": "nov_p3",
  "order": 6,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "advertising",
    "headline",
    "transactional_writing",
    "media_writing"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p3/q6/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p3/q6/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p3/q6/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p3/q6/memo_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p3/q6/memo_3.png"
  ],
  "exam_question_marks": 20,
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
    "question": "Which headline is most eye-catching for a tourism poster?",
    "metadata": [
      "Visit our town: sun, sea and a warm welcome!",
      "Notice",
      "Towns exist in every province",
      "Please read this paper",
      ""
    ],
    "answer": [
      "Visit our town: sun, sea and a warm welcome!",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "transactional_writing",
    "topic": "poster",
    "subtopic": "headline",
    "skills": [
      "english_fal_write_headline"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- A headline must grab attention and suit the message.\n- Reject headlines that are dull or off-topic."
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
    "question": "Select the TWO things a tourism poster should include.",
    "metadata": [
      "what visitors can do in the town",
      "a long history of the municipality",
      "contact details",
      "a list of every road",
      ""
    ],
    "answer": [
      "what visitors can do in the town",
      "contact details",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "transactional_writing",
    "topic": "poster",
    "subtopic": "content_of_a_poster",
    "skills": [
      "english_fal_identify_format_features"
    ],
    "difficulty": 1,
    "exam_weight": 1,
    "clues": "- Visitors need a reason to come and a way to find out more.\n- Reject details that are too long for a poster."
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
    "question": "Which phrase is the catchiest for a tourism poster?",
    "metadata": [
      "The town is in the province.",
      "Tourism is a word.",
      "Beaches are sandy.",
      "Taste, see, enjoy — come and discover our beaches today!",
      ""
    ],
    "answer": [
      "Taste, see, enjoy — come and discover our beaches today!",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "transactional_writing",
    "topic": "poster",
    "subtopic": "catchy_phrases",
    "skills": [
      "english_fal_write_an_opening"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Catchy words are short, lively and speak to the reader.\n- Reject plain statements of fact."
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
    "question": "What is the minimum number of words for the body of a shorter transactional text in this paper? Write the number.",
    "metadata": [
      "Words:",
      "[ ]"
    ],
    "answer": [
      "80",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "definition",
    "unit": "transactional_writing",
    "topic": "poster",
    "subtopic": "length_of_the_text",
    "skills": [
      "english_fal_recall_task_requirements"
    ],
    "difficulty": 1,
    "exam_weight": 1,
    "clues": "- The paper gives a range for Section C.\n- Write digits only.",
    "keyboard_type": "text"
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
    "question": "What does the marking guideline say about illustrations on a poster?",
    "metadata": [
      "Illustrations earn extra marks.",
      "No marks are given for illustrations or drawings.",
      "A poster without a drawing fails.",
      "Only drawings are marked.",
      ""
    ],
    "answer": [
      "No marks are given for illustrations or drawings.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "transactional_writing",
    "topic": "poster",
    "subtopic": "what_is_marked",
    "skills": [
      "english_fal_recall_task_requirements"
    ],
    "difficulty": 1,
    "exam_weight": 1,
    "clues": "- The task says not to include illustrations.\n- The marker marks the words only."
  }
];

// ─── AI explanation — one entry per REAL printed sub-question, real marks (AIEXP-08) ───

const aiExplanation = {
  "sub_questions": [
    {
      "number": "3.1",
      "marks": 20,
      "clues": "- List what visitors should know before you write.",
      "approach": "- Write an eye-catching headline\n- Give enough details to encourage a visit\n- Add contact details and catchy phrases",
      "solution": "1. The poster must have an eye-catching headline.\n2. It needs sufficient details to encourage people to visit the town or enter the competition.\n3. Contact details may be provided and catchy words and phrases are credited; no marks for drawings."
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
