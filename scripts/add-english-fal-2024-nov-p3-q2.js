#!/usr/bin/env node
/**
 * DBE English FAL P3 — November 2024 — Question 2.1: Letter of Application (order 2) — apply for a part-time bookshop post, 120–150 words, 30-mark rubric.
 * Practice questions are fresh (DESIGN-UNI-01) and follow the shared rules: context_text null for literature (SETWORK-LES-05),
 * fresh targets, conventions-based for writing (LANG-WR-03); aiExplanation is one entry per REAL printed sub-question with its
 * real marks, derived from the memo in own words (AIEXP-08). Every fitb declares keyboard_type 'text' (LANG-KB-01).
 * Text key: none (language / writing paper).
 *
 * BASIS per practice question — BK book knowledge (verify against the text), P printed in the paper/poem, M memo,
 * PT vocabulary/title, C CAPS, P1 language-paper skill:
 *   Q1: M: memo 2.1 lists sender's address, date, recipient, greeting, subject line, ending, signature.
 *   Q2: M: memo 2.1 format list.
 *   Q3: M: memo 2.1 'tone and register must be formal'.
 *   Q4: M: memo 2.1 subject line.
 *   Q5: M: memo 2.1 'introduction, a body and a conclusion'.
 *
 *   node tools/validate-questions.js --script scripts/add-english-fal-2024-nov-p3-q2.js --curriculum temp/curriculum-vocab-english-fal.json
 *   node scripts/add-english-fal-2024-nov-p3-q2.js --dry-run
 *   node scripts/add-english-fal-2024-nov-p3-q2.js
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
  "name": "Question 2.1: Letter of Application",
  "syllabus": "dbe",
  "subject": "english_fal",
  "year": 2024,
  "paper": "nov_p3",
  "order": 2,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "formal_letter",
    "letter_format",
    "formal_writing",
    "transactional_writing"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p3/q2/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p3/q2/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p3/q2/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p3/q2/memo_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p3/q2/memo_3.png"
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
    "question": "Select the THREE parts that must appear in a formal letter of application.",
    "metadata": [
      "the sender's address",
      "a subject line",
      "the date",
      "a postscript in capital letters",
      "an emoji at the top"
    ],
    "answer": [
      "the sender's address",
      "the date",
      "a subject line",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "transactional_writing",
    "topic": "formal_letter",
    "subtopic": "format_of_a_letter",
    "skills": [
      "english_fal_identify_format_features"
    ],
    "difficulty": 1,
    "exam_weight": 2,
    "clues": "- Think about what a reader needs to answer you and see when it was written.\n- Reject parts that do not belong to a formal letter."
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
    "question": "Arrange the parts of a formal letter in the order in which they appear.",
    "metadata": [
      "Introduction, body and conclusion",
      "Address of sender and date",
      "Suitable ending and signature",
      "Greeting and subject line",
      "Recipient's name and address"
    ],
    "answer": [
      "Address of sender and date",
      "Recipient's name and address",
      "Greeting and subject line",
      "Introduction, body and conclusion",
      "Suitable ending and signature"
    ],
    "presentation": "ordering",
    "type": "application",
    "unit": "transactional_writing",
    "topic": "formal_letter",
    "subtopic": "format_of_a_letter",
    "skills": [
      "english_fal_order_events"
    ],
    "difficulty": 1,
    "exam_weight": 2,
    "clues": "- The sender's details come first.\n- The signature comes last."
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
    "question": "Which opening best suits a letter of application?",
    "metadata": [
      "Hey boss, I want your job lol!",
      "To whom it may concern, bookshops are nice.",
      "Hi, I saw a sign, can I work there?",
      "Dear Sir/Madam, I am writing to apply for the part-time post advertised in your window.",
      ""
    ],
    "answer": [
      "Dear Sir/Madam, I am writing to apply for the part-time post advertised in your window.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "transactional_writing",
    "topic": "formal_letter",
    "subtopic": "register_and_tone",
    "skills": [
      "english_fal_choose_appropriate_register"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- The tone must be formal and clear.\n- It should state the purpose of the letter."
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
    "question": "Which subject line best suits a letter applying for a job?",
    "metadata": [
      "Application for the part-time position of shop assistant",
      "Job",
      "Please read this",
      "Hello!",
      ""
    ],
    "answer": [
      "Application for the part-time position of shop assistant",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "transactional_writing",
    "topic": "formal_letter",
    "subtopic": "subject_line",
    "skills": [
      "english_fal_write_subject_line"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- A subject line names the purpose in a few words.\n- It should be specific."
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
    "question": "A letter must have an introduction, a body and a … Write one word.",
    "metadata": [
      "Word:",
      "[ ]"
    ],
    "answer": [
      "conclusion",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "definition",
    "unit": "transactional_writing",
    "topic": "formal_letter",
    "subtopic": "format_of_a_letter",
    "skills": [
      "english_fal_identify_format_features"
    ],
    "difficulty": 1,
    "exam_weight": 1,
    "clues": "- It is the last part of the letter's content.\n- Write one word.",
    "keyboard_type": "text"
  }
];

// ─── AI explanation — one entry per REAL printed sub-question, real marks (AIEXP-08) ───

const aiExplanation = {
  "sub_questions": [
    {
      "number": "2.1",
      "marks": 30,
      "clues": "- Plan the order of the parts before you write.",
      "approach": "- Write a formal letter to the owner or manager\n- Include all format parts\n- Mention relevant qualities, availability and an attached CV",
      "solution": "1. The tone and register must be formal and the letter must have an introduction, body and conclusion.\n2. Format: sender's address, date, recipient (the manager or owner), bookshop name and address, greeting, subject line, suitable ending, signature and name.\n3. May include personal qualities, start date and that a CV is attached."
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
