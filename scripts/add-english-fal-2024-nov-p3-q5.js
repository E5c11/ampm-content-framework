#!/usr/bin/env node
/**
 * DBE English FAL P3 — November 2024 — Question 2.4: Dialogue (order 5) — a conversation with a father about spending the holidays elsewhere, 120–150 words, 30-mark rubric.
 * Practice questions are fresh (DESIGN-UNI-01) and follow the shared rules: context_text null for literature (SETWORK-LES-05),
 * fresh targets, conventions-based for writing (LANG-WR-03); aiExplanation is one entry per REAL printed sub-question with its
 * real marks, derived from the memo in own words (AIEXP-08). Every fitb declares keyboard_type 'text' (LANG-KB-01).
 * Text key: none (language / writing paper).
 *
 * BASIS per practice question — BK book knowledge (verify against the text), P printed in the paper/poem, M memo,
 * PT vocabulary/title, C CAPS, P1 language-paper skill:
 *   Q1: M: memo 2.4.
 *   Q2: M: memo 2.4.
 *   Q3: M: memo 2.4 'a brief context at the beginning'.
 *   Q4: M: memo 2.4 informal tone.
 *   Q5: M: memo 2.4.
 *
 *   node tools/validate-questions.js --script scripts/add-english-fal-2024-nov-p3-q5.js --curriculum temp/curriculum-vocab-english-fal.json
 *   node scripts/add-english-fal-2024-nov-p3-q5.js --dry-run
 *   node scripts/add-english-fal-2024-nov-p3-q5.js
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
  "name": "Question 2.4: Dialogue",
  "syllabus": "dbe",
  "subject": "english_fal",
  "year": 2024,
  "paper": "nov_p3",
  "order": 5,
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
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p3/q5/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p3/q5/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p3/q5/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p3/q5/memo_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p3/q5/memo_3.png"
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
    "question": "Which statement describes the correct layout of a dialogue?",
    "metadata": [
      "A full stop after the name, all speakers on one line.",
      "A colon after the name, with each speaker on a new line.",
      "Quotation marks around the whole conversation.",
      "No names at all.",
      ""
    ],
    "answer": [
      "A colon after the name, with each speaker on a new line.",
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
    "clues": "- Think about how a script shows who is speaking.\n- Each speaker starts a new line."
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
    "question": "Which line shows a stage direction in the correct place and form?",
    "metadata": [
      "Dad folding his arms Why do you want to leave?",
      "DAD: Why do you want to leave, folding his arms?",
      "DAD: (folding his arms) Why do you want to leave?",
      "Dad — 'folding his arms' — Why do you want to leave?",
      ""
    ],
    "answer": [
      "DAD: (folding his arms) Why do you want to leave?",
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
    "year": 2024,
    "paper": "nov_p3",
    "name": "Question 3",
    "order": 3,
    "context_text": null,
    "question": "Arrange the parts of a dialogue in the order in which they appear.",
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
    "clues": "- The setting must come before anyone speaks.\n- Replies follow the line they answer."
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
    "question": "Select the TWO features that suit a conversation between father and child.",
    "metadata": [
      "an informal tone",
      "a title after every speech",
      "the names of the speakers on the left",
      "a postal address",
      ""
    ],
    "answer": [
      "an informal tone",
      "the names of the speakers on the left",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "transactional_writing",
    "topic": "dialogue",
    "subtopic": "tone_of_a_dialogue",
    "skills": [
      "english_fal_identify_format_features"
    ],
    "difficulty": 1,
    "exam_weight": 1,
    "clues": "- Think about how family members talk.\n- Reject features that belong to formal letters."
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
    "question": "Which punctuation mark follows the name of the speaker? Write one word.",
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

// ─── AI explanation — one entry per REAL printed sub-question, real marks (AIEXP-08) ───

const aiExplanation = {
  "sub_questions": [
    {
      "number": "2.4",
      "marks": 30,
      "clues": "- Begin with a short context line.",
      "approach": "- State the setting\n- Use names and colons with a new line per speaker\n- Keep the tone informal",
      "solution": "1. A brief context opens the dialogue.\n2. The tone is informal between father and child.\n3. Names or references on the left, a colon after the name and a new line for each speaker; actions in brackets before the words."
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
