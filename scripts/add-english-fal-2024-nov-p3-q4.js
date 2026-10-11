#!/usr/bin/env node
/**
 * DBE English FAL P3 — November 2024 — Question 2.3: Obituary (order 4) — a tribute to a sports captain who has died, 120–150 words, 30-mark rubric.
 * Practice questions are fresh (DESIGN-UNI-01) and follow the shared rules: context_text null for literature (SETWORK-LES-05),
 * fresh targets, conventions-based for writing (LANG-WR-03); aiExplanation is one entry per REAL printed sub-question with its
 * real marks, derived from the memo in own words (AIEXP-08). Every fitb declares keyboard_type 'text' (LANG-KB-01).
 * Text key: none (language / writing paper).
 *
 * BASIS per practice question — BK book knowledge (verify against the text), P printed in the paper/poem, M memo,
 * PT vocabulary/title, C CAPS, P1 language-paper skill:
 *   Q1: M: memo 2.3 format list.
 *   Q2: M: memo 2.3 key survivors, funeral, tribute.
 *   Q3: M: memo 2.3 'tone must be formal'.
 *   Q4: M: memo 2.3.
 *   Q5: M: memo 2.3 'a tribute to the deceased'.
 *
 *   node tools/validate-questions.js --script scripts/add-english-fal-2024-nov-p3-q4.js --curriculum temp/curriculum-vocab-english-fal.json
 *   node scripts/add-english-fal-2024-nov-p3-q4.js --dry-run
 *   node scripts/add-english-fal-2024-nov-p3-q4.js
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
  "name": "Question 2.3: Obituary",
  "syllabus": "dbe",
  "subject": "english_fal",
  "year": 2024,
  "paper": "nov_p3",
  "order": 4,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "obituary",
    "formal_writing",
    "transactional_writing",
    "register"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p3/q4/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p3/q4/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p3/q4/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p3/q4/memo_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p3/q4/memo_3.png"
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
    "question": "Select the THREE details that must appear in an obituary.",
    "metadata": [
      "full name of the person",
      "date of death",
      "date of birth",
      "the writer's favourite colour",
      "a list of prices"
    ],
    "answer": [
      "full name of the person",
      "date of birth",
      "date of death",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "transactional_writing",
    "topic": "obituary",
    "subtopic": "format_of_an_obituary",
    "skills": [
      "english_fal_identify_format_features"
    ],
    "difficulty": 1,
    "exam_weight": 2,
    "clues": "- An obituary announces a death and gives basic facts.\n- Reject details that do not belong."
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
    "question": "Match each part of an obituary to what it contains.",
    "metadata": [
      "A - survivors",
      "B - funeral details",
      "C - tribute",
      "1 - the date, time and place of the funeral",
      "2 - kind words about the person's character",
      "3 - the spouse and children who are left"
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
    "topic": "obituary",
    "subtopic": "format_of_an_obituary",
    "skills": [
      "english_fal_match_features_to_examples"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Think about what each heading means.\n- One part contains the writer's own words of praise."
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
    "question": "Which opening has the right tone for an obituary?",
    "metadata": [
      "Guess what? Our captain is gone lol.",
      "Thandi died, big deal.",
      "It is with great sadness that we announce the passing of our beloved captain, Thandi Mokoena.",
      "Our captain's boots are red.",
      ""
    ],
    "answer": [
      "It is with great sadness that we announce the passing of our beloved captain, Thandi Mokoena.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "transactional_writing",
    "topic": "obituary",
    "subtopic": "tone_of_an_obituary",
    "skills": [
      "english_fal_choose_appropriate_register"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- The tone must be formal and respectful.\n- Reject casual or careless openings."
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
    "question": "Which one word describes the tone of an obituary? Write one word.",
    "metadata": [
      "Word:",
      "[ ]"
    ],
    "answer": [
      "formal",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "definition",
    "unit": "transactional_writing",
    "topic": "obituary",
    "subtopic": "tone_of_an_obituary",
    "skills": [
      "english_fal_choose_appropriate_register"
    ],
    "difficulty": 1,
    "exam_weight": 1,
    "clues": "- Think about how you speak at a funeral.\n- Write one word.",
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
    "question": "Which sentence is the best tribute to the person in an obituary?",
    "metadata": [
      "She had red hair.",
      "The team lost on Friday.",
      "The club has a new sponsor.",
      "She led the team with courage and kindness, and every player learned from her.",
      ""
    ],
    "answer": [
      "She led the team with courage and kindness, and every player learned from her.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "transactional_writing",
    "topic": "obituary",
    "subtopic": "tribute",
    "skills": [
      "english_fal_write_an_opening"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "clues": "- A tribute praises character and influence.\n- Reject sentences that are only facts."
  }
];

// ─── AI explanation — one entry per REAL printed sub-question, real marks (AIEXP-08) ───

const aiExplanation = {
  "sub_questions": [
    {
      "number": "2.3",
      "marks": 30,
      "clues": "- Gather the facts first, then write a respectful tribute.",
      "approach": "- Include the required details\n- Keep the tone formal\n- End with a tribute",
      "solution": "1. The tone must be formal.\n2. Format: full name, date of birth, date of death, birthplace, where the person lived, key survivors, funeral date/time/place and a tribute.\n3. May include biographical information and cause of death."
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
