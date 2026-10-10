#!/usr/bin/env node
/**
 * DBE English FAL P3 — November 2025 — Question 3.1: Flyer (order 6) — promoting a career exhibition, 80–100 words, 20-mark rubric.
 * Practice questions test the conventions and criteria of the text type on FRESH scenarios (LANG-WR-01/03); they never
 * reuse the real task's content (DESIGN-UNI-01). aiExplanation: one entry per REAL task with its real marks (AIEXP-08).
 * Every fitb declares keyboard_type 'text' (LANG-KB-01).
 *
 * BASIS per practice question — M = marking guideline, P = printed in the paper, C = CAPS §3.3/§3.4:
 *   Q1: M: memo 3.1 — date, time, venue, contact details.
 *   Q2: M: memo 3.1 'eye-catching headline, slogan or logo'.
 *   Q3: M: memo 3.1 'language must speak directly to the reader'.
 *   Q4: P: the paper states 80–100 words for Question 3.
 *   Q5: P/M: the task note and memo 3.1 note.
 *
 *   node tools/validate-questions.js --script scripts/add-english-fal-2025-nov-p3-q6.js --curriculum temp/curriculum-vocab-english-fal.json
 *   node scripts/add-english-fal-2025-nov-p3-q6.js --dry-run
 *   node scripts/add-english-fal-2025-nov-p3-q6.js
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
  "name": "Question 3.1: Flyer",
  "syllabus": "dbe",
  "subject": "english_fal",
  "year": 2025,
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
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p3/q6/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p3/q6/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p3/q6/memo_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p3/q6/memo_3.png"
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
    "year": 2025,
    "paper": "nov_p3",
    "name": "Question 1",
    "order": 1,
    "context_text": null,
    "question": "Select the THREE pieces of information a flyer for an event must give.",
    "metadata": [
      "the date and time of the event",
      "contact details",
      "the venue",
      "a long history of the organiser",
      "a full timetable for the whole year"
    ],
    "answer": [
      "the date and time of the event",
      "the venue",
      "contact details",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "transactional_writing",
    "topic": "flyer",
    "subtopic": "content_of_a_flyer",
    "skills": [
      "english_fal_identify_format_features"
    ],
    "difficulty": 1,
    "exam_weight": 2,
    "clues": "- A reader must know when, where and how to find out more.\n- Reject details that are too long for a flyer."
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
    "question": "Which headline is most eye-catching for a career exhibition flyer?",
    "metadata": [
      "Notice",
      "An exhibition is a place where things are shown",
      "Discover your future: Career Exhibition!",
      "Please read this paper",
      ""
    ],
    "answer": [
      "Discover your future: Career Exhibition!",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "transactional_writing",
    "topic": "flyer",
    "subtopic": "headline_or_slogan",
    "skills": [
      "english_fal_write_headline"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- A headline should grab attention and suit the event.\n- Reject headlines that are dull or off-topic."
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
    "question": "Which sentence speaks directly to the reader of a flyer?",
    "metadata": [
      "Come and meet people who will help you plan your career!",
      "The exhibition was held last year.",
      "Careers are described in many books.",
      "The school has a hall.",
      ""
    ],
    "answer": [
      "Come and meet people who will help you plan your career!",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "transactional_writing",
    "topic": "flyer",
    "subtopic": "speaking_to_the_reader",
    "skills": [
      "english_fal_choose_appropriate_register"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Look for an invitation that uses 'you' or a command.\n- Reject sentences that only report facts."
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
    "question": "What is the maximum number of words for the body of a shorter transactional text in this paper? Write the number.",
    "metadata": [
      "Words:",
      "[ ]"
    ],
    "answer": [
      "100",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "definition",
    "unit": "transactional_writing",
    "topic": "flyer",
    "subtopic": "length_of_the_text",
    "skills": [
      "english_fal_recall_task_requirements"
    ],
    "difficulty": 1,
    "exam_weight": 1,
    "clues": "- The paper states a range for Section C.\n- Write digits only.",
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
    "question": "What does the marking guideline say about illustrations on a flyer?",
    "metadata": [
      "Illustrations earn extra marks.",
      "A flyer without a drawing fails.",
      "Only drawings are marked.",
      "No marks are given for illustrations or drawings.",
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
    "topic": "flyer",
    "subtopic": "what_is_marked",
    "skills": [
      "english_fal_recall_task_requirements"
    ],
    "difficulty": 1,
    "exam_weight": 1,
    "clues": "- The task says not to include illustrations.\n- The marker marks the words only."
  }
];

// ─── AI explanation — one entry per REAL task, real marks (AIEXP-08) ─────────

const aiExplanation = {
  "sub_questions": [
    {
      "number": "3.1",
      "marks": 20,
      "clues": "- List the details a visitor needs before you write.\n- Keep to 80–100 words.",
      "approach": "- Write an eye-catching headline, slogan or logo\n- Give date, time, venue and contact details\n- Use catchy words that speak to the reader",
      "solution": "1. The flyer needs an eye-catching headline, slogan or logo.\n2. It needs enough event details (date, time, venue) and contact details.\n3. Its language may be formal or informal but must speak directly to the reader.\n4. No marks are given for drawings."
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
