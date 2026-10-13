#!/usr/bin/env node
/**
 * DBE English FAL P3 — November 2024 — Question 3.2: Diary Entries (order 7) — two entries before and after a holiday that turned out differently, 80–100 words, 20-mark rubric.
 * Practice questions are fresh (DESIGN-UNI-01) and follow the shared rules: context_text null for literature (SETWORK-LES-05),
 * fresh targets, conventions-based for writing (LANG-WR-03); aiExplanation is one entry per REAL printed sub-question with its
 * real marks, derived from the memo in own words (AIEXP-08). Every fitb declares keyboard_type 'text' (LANG-KB-01).
 * Text key: none (language / writing paper).
 *
 * BASIS per practice question — BK book knowledge (verify against the text), P printed in the paper/poem, M memo,
 * PT vocabulary/title, C CAPS, P1 language-paper skill:
 *   Q1: M: memo 3.2 two entries, dates/times.
 *   Q2: M: memo 3.2 dates/times reflected; simple informal language.
 *   Q3: P/M: task says TWO entries.
 *   Q4: M: memo 3.2 first person.
 *   Q5: M: memo 3.2 'tone must reflect suitable emotions'.
 *
 *   node tools/validate-questions.js --script scripts/add-english-fal-2024-nov-p3-q7.js --curriculum temp/curriculum-vocab-english-fal.json
 *   node scripts/add-english-fal-2024-nov-p3-q7.js --dry-run
 *   node scripts/add-english-fal-2024-nov-p3-q7.js
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
  "name": "Question 3.2: Diary Entries",
  "syllabus": "dbe",
  "subject": "english_fal",
  "year": 2024,
  "paper": "nov_p3",
  "order": 7,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "diary_entry",
    "creative_writing",
    "transactional_writing",
    "language_register"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p3/q7/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p3/q7/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p3/q7/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p3/q7/memo_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p3/q7/memo_3.png"
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
    "question": "Select the TWO features that this task requires.",
    "metadata": [
      "two entries",
      "a formal salutation",
      "the dates or times",
      "a postal address",
      ""
    ],
    "answer": [
      "two entries",
      "the dates or times",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "transactional_writing",
    "topic": "diary_entry",
    "subtopic": "features_of_a_diary",
    "skills": [
      "english_fal_identify_format_features"
    ],
    "difficulty": 1,
    "exam_weight": 2,
    "clues": "- Re-read what the task asks you to write.\n- Reject features that belong to letters."
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
    "question": "Which opening best suits a diary entry?",
    "metadata": [
      "Dear Sir, I write to tell you about my holiday.",
      "To the editor: holidays are good.",
      "Friday 5 July, 8 p.m. Dear Diary, I can't wait for tomorrow!",
      "Re: complaint about weather",
      ""
    ],
    "answer": [
      "Friday 5 July, 8 p.m. Dear Diary, I can't wait for tomorrow!",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "transactional_writing",
    "topic": "diary_entry",
    "subtopic": "opening_of_a_diary_entry",
    "skills": [
      "english_fal_write_an_opening"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- A diary entry is personal and informal.\n- It usually shows a date."
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
    "question": "How many diary entries must the candidate write? Write the number.",
    "metadata": [
      "Number:",
      "[ ]"
    ],
    "answer": [
      "2",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "definition",
    "unit": "transactional_writing",
    "topic": "diary_entry",
    "subtopic": "features_of_a_diary",
    "skills": [
      "english_fal_recall_task_requirements"
    ],
    "difficulty": 1,
    "exam_weight": 1,
    "clues": "- One is for before the holiday and one for after.\n- Write digits only.",
    "keyboard_type": "text"
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
    "question": "In which person must a diary entry be written?",
    "metadata": [
      "third person",
      "second person",
      "no person at all",
      "first person",
      ""
    ],
    "answer": [
      "first person",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "transactional_writing",
    "topic": "diary_entry",
    "subtopic": "person_and_tone",
    "skills": [
      "english_fal_choose_appropriate_register"
    ],
    "difficulty": 1,
    "exam_weight": 1,
    "clues": "- The writer talks about himself or herself.\n- Think of the pronoun 'I'."
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
    "question": "What should the tone of the two entries show?",
    "metadata": [
      "Both entries must express exactly the same feeling.",
      "The feelings should change to suit what happened.",
      "The entries must use only questions.",
      "Only facts are allowed.",
      ""
    ],
    "answer": [
      "The feelings should change to suit what happened.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "transactional_writing",
    "topic": "diary_entry",
    "subtopic": "person_and_tone",
    "skills": [
      "english_fal_choose_appropriate_register"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- The task says the holiday turned out differently.\n- Feelings before and after differ."
  }
];

// ─── AI explanation — one entry per REAL printed sub-question, real marks (AIEXP-08) ───

const aiExplanation = {
  "sub_questions": [
    {
      "number": "3.2",
      "marks": 20,
      "clues": "- Decide how you felt before and how you felt after.",
      "approach": "- Write two dated entries\n- Use the first person\n- Show suitable emotions in simple, informal language",
      "solution": "1. There must be two diary entries with dates or times.\n2. The entries express feelings before and after the holiday and are written in the first person.\n3. The language is simple and informal; the tone reflects suitable emotions."
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
