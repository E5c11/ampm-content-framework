#!/usr/bin/env node
/**
 * DBE English FAL P3 — November 2025 — Question 2.3: Dialogue (order 4) — a conversation with a librarian about a damaged book, 120–150 words, 30-mark rubric.
 * Practice questions test the conventions and criteria of the text type on FRESH scenarios (LANG-WR-01/03); they never
 * reuse the real task's content (DESIGN-UNI-01). aiExplanation: one entry per REAL task with its real marks (AIEXP-08).
 * Every fitb declares keyboard_type 'text' (LANG-KB-01).
 *
 * BASIS per practice question — M = marking guideline, P = printed in the paper, C = CAPS §3.3/§3.4:
 *   Q1: M: memo 2.3 format — names on the left, colon, new line for each speaker.
 *   Q2: M: memo 2.3 'actions must be given in brackets before the words'.
 *   Q3: M: memo 2.3 'a brief context at the beginning'.
 *   Q4: M: memo 2.3 format features.
 *   Q5: M: memo 2.3 'a colon after the name'.
 *
 *   node tools/validate-questions.js --script scripts/add-english-fal-2025-nov-p3-q4.js --curriculum temp/curriculum-vocab-english-fal.json
 *   node scripts/add-english-fal-2025-nov-p3-q4.js --dry-run
 *   node scripts/add-english-fal-2025-nov-p3-q4.js
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
  "name": "Question 2.3: Dialogue",
  "syllabus": "dbe",
  "subject": "english_fal",
  "year": 2025,
  "paper": "nov_p3",
  "order": 4,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "dialogue",
    "dialogue_format",
    "dialogue_structure",
    "transactional_writing"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p3/q4/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p3/q4/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p3/q4/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p3/q4/memo_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p3/q4/memo_3.png"
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
    "question": "Which statement describes the correct layout of a dialogue?",
    "metadata": [
      "A full stop after the speaker's name, with all speakers on one line.",
      "A colon after the speaker's name, with a new line for each new speaker.",
      "Quotation marks around the whole conversation.",
      "No names at all, only the words that are spoken.",
      ""
    ],
    "answer": [
      "A colon after the speaker's name, with a new line for each new speaker.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "transactional_writing",
    "topic": "dialogue",
    "subtopic": "layout_of_a_dialogue",
    "skills": [
      "english_fal_identify_format_features"
    ],
    "difficulty": 1,
    "exam_weight": 2,
    "clues": "- Think about how a script shows who is speaking.\n- Each speaker starts on a new line."
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
    "question": "Which line shows a stage direction in the correct place and form?",
    "metadata": [
      "Sipho looking at the floor I'm really sorry about the book.",
      "SIPHO: I'm really sorry about the book, looking at the floor.",
      "SIPHO: (looking at the floor) I'm really sorry about the book.",
      "Sipho — 'looking at the floor' — I'm really sorry about the book.",
      ""
    ],
    "answer": [
      "SIPHO: (looking at the floor) I'm really sorry about the book.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "transactional_writing",
    "topic": "dialogue",
    "subtopic": "stage_directions",
    "skills": [
      "english_fal_format_stage_directions"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Actions are given in brackets before the words are spoken.\n- The speaker's name is followed by a colon."
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
    "question": "Arrange the parts of a dialogue in the order in which they appear on the page.",
    "metadata": [
      "The first speaker's line",
      "Further exchanges",
      "A brief context",
      "The second speaker's reply",
      ""
    ],
    "answer": [
      "A brief context",
      "The first speaker's line",
      "The second speaker's reply",
      "Further exchanges",
      ""
    ],
    "presentation": "ordering",
    "type": "application",
    "unit": "transactional_writing",
    "topic": "dialogue",
    "subtopic": "layout_of_a_dialogue",
    "skills": [
      "english_fal_order_events"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- The reader needs the setting before anyone speaks.\n- Replies follow the line they answer."
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
    "question": "Select the TWO format features that a dialogue must have.",
    "metadata": [
      "the names of the speakers on the left",
      "a title written after every speech",
      "a colon after each name",
      "all speeches written in one paragraph",
      "a postal address"
    ],
    "answer": [
      "the names of the speakers on the left",
      "a colon after each name",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "transactional_writing",
    "topic": "dialogue",
    "subtopic": "layout_of_a_dialogue",
    "skills": [
      "english_fal_identify_format_features"
    ],
    "difficulty": 1,
    "exam_weight": 1,
    "clues": "- Think about how a script shows who is speaking.\n- Reject features that belong to other texts."
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
    "question": "Which punctuation mark follows the name of the speaker in a dialogue? Write one word.",
    "metadata": [
      "Mark:",
      "[ ]"
    ],
    "answer": [
      "colon",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "definition",
    "unit": "transactional_writing",
    "topic": "dialogue",
    "subtopic": "layout_of_a_dialogue",
    "skills": [
      "english_fal_identify_format_features"
    ],
    "difficulty": 1,
    "exam_weight": 1,
    "clues": "- It looks like two dots, one above the other.\n- Write one word.",
    "keyboard_type": "text"
  }
];

// ─── AI explanation — one entry per REAL task, real marks (AIEXP-08) ─────────

const aiExplanation = {
  "sub_questions": [
    {
      "number": "2.3",
      "marks": 30,
      "clues": "- Begin with a short context line.\n- Show each speaker on a new line with a colon after the name.",
      "approach": "- State the setting briefly\n- Use names on the left and colons\n- Put actions in brackets before the words, and keep the tone appropriate",
      "solution": "1. The dialogue must begin with a brief context.\n2. Speakers' names are on the left, followed by a colon, with a new line for each new speaker.\n3. Actions, where needed, are given in brackets before the words.\n4. The tone must suit a conversation with a librarian."
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
