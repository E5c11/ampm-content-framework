#!/usr/bin/env node
/**
 * DBE English FAL P3 — November 2025 — Question 2.2: Review (order 3) — a social-media review of a restaurant, 120–150 words, 30-mark rubric.
 * Practice questions test the conventions and criteria of the text type on FRESH scenarios (LANG-WR-01/03); they never
 * reuse the real task's content (DESIGN-UNI-01). aiExplanation: one entry per REAL task with its real marks (AIEXP-08).
 * Every fitb declares keyboard_type 'text' (LANG-KB-01).
 *
 * BASIS per practice question — M = marking guideline, P = printed in the paper, C = CAPS §3.3/§3.4:
 *   Q1: M: memo lists name and location, atmosphere, service, food, rating.
 *   Q2: M: features listed in memo 2.2.
 *   Q3: C: CAPS — review is written for readers; personal voice suits social media (task 2.2).
 *   Q4: M: memo 2.2 'Rating'.
 *   Q5: C: CAPS — evaluative writing gives reasons for opinions.
 *
 *   node tools/validate-questions.js --script scripts/add-english-fal-2025-nov-p3-q3.js --curriculum temp/curriculum-vocab-english-fal.json
 *   node scripts/add-english-fal-2025-nov-p3-q3.js --dry-run
 *   node scripts/add-english-fal-2025-nov-p3-q3.js
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
  "name": "Question 2.2: Review",
  "syllabus": "dbe",
  "subject": "english_fal",
  "year": 2025,
  "paper": "nov_p3",
  "order": 3,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "book_review",
    "evaluative_writing",
    "transactional_writing",
    "formal_writing"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p3/q3/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p3/q3/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p3/q3/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p3/q3/memo_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p3/q3/memo_3.png"
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
    "year": 2025,
    "paper": "nov_p3",
    "name": "Question 1",
    "order": 1,
    "context_text": null,
    "question": "Select the THREE things a restaurant review must include.",
    "metadata": [
      "the name and location of the restaurant",
      "the quality of service",
      "the atmosphere",
      "the owner's life story",
      "a recipe for each dish"
    ],
    "answer": [
      "the name and location of the restaurant",
      "the atmosphere",
      "the quality of service",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "transactional_writing",
    "topic": "review",
    "subtopic": "features_of_a_review",
    "skills": [
      "english_fal_identify_format_features"
    ],
    "difficulty": 1,
    "exam_weight": 2,
    "clues": "- Think about what a reader would want to know before visiting.\n- Reject details that do not help the reader decide."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2025,
    "paper": "nov_p3",
    "name": "Question 2",
    "order": 2,
    "context_text": null,
    "question": "Match each feature of a review to the sentence that gives an example of it.",
    "metadata": [
      "A - atmosphere",
      "B - service",
      "C - rating",
      "1 - the waiter greeted us at once and cleared plates promptly",
      "2 - four out of five stars",
      "3 - soft lighting and quiet music made the room relaxing"
    ],
    "answer": [
      "A-3",
      "B-1",
      "C-2",
      "",
      ""
    ],
    "presentation": "match",
    "type": "application",
    "unit": "transactional_writing",
    "topic": "review",
    "subtopic": "features_of_a_review",
    "skills": [
      "english_fal_match_features_to_examples"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Think about what each sentence describes.\n- One example is a score and not a description."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2025,
    "paper": "nov_p3",
    "name": "Question 3",
    "order": 3,
    "context_text": null,
    "question": "Which opening best suits a social media review of a restaurant?",
    "metadata": [
      "Restaurants are places where people eat.",
      "I do not think reviews are very important.",
      "Last Saturday, my friends and I finally tried the new bistro on Main Road.",
      "Dear Sir, I write to complain.",
      ""
    ],
    "answer": [
      "Last Saturday, my friends and I finally tried the new bistro on Main Road.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "transactional_writing",
    "topic": "review",
    "subtopic": "opening_of_a_review",
    "skills": [
      "english_fal_write_an_opening"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- A review begins by placing the writer at the restaurant.\n- It should draw the reader in with a personal voice."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2025,
    "paper": "nov_p3",
    "name": "Question 4",
    "order": 4,
    "context_text": null,
    "question": "Which one word names the score you give at the end of a review (such as four out of five stars)? Write one word.",
    "metadata": [
      "Word:",
      "[ ]"
    ],
    "answer": [
      "rating",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "definition",
    "unit": "transactional_writing",
    "topic": "review",
    "subtopic": "features_of_a_review",
    "skills": [
      "english_fal_identify_format_features"
    ],
    "difficulty": 1,
    "exam_weight": 1,
    "clues": "- It tells the reader how good you thought the restaurant was.\n- Write one word.",
    "keyboard_type": "text"
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2025,
    "paper": "nov_p3",
    "name": "Question 5",
    "order": 5,
    "context_text": null,
    "question": "Which statement best describes the tone and content of a good review?",
    "metadata": [
      "It should only praise the food.",
      "It should only list the prices.",
      "It should be one sentence long.",
      "It should be honest and balanced, giving reasons for the opinion.",
      ""
    ],
    "answer": [
      "It should be honest and balanced, giving reasons for the opinion.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "transactional_writing",
    "topic": "review",
    "subtopic": "tone_of_a_review",
    "skills": [
      "english_fal_choose_appropriate_register"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Readers trust a review that gives reasons.\n- Reject options that are one-sided or too short."
  }
];

// ─── AI explanation — one entry per REAL task, real marks (AIEXP-08) ─────────

const aiExplanation = {
  "sub_questions": [
    {
      "number": "2.2",
      "marks": 30,
      "clues": "- Include all the required features of a review.\n- Stay within 120–150 words.",
      "approach": "- Name and place the restaurant\n- Describe atmosphere, service and food\n- Give a rating, and perhaps comment on value for money",
      "solution": "1. The review must name and locate the restaurant.\n2. It must describe atmosphere, quality of service and the type of food.\n3. It must give a rating.\n4. It may discuss specific dishes and value for money."
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
