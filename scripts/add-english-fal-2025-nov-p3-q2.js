#!/usr/bin/env node
/**
 * DBE English FAL P3 — November 2025 — Question 2.1: E-mail (order 2) — thank a retired teacher and share future plans, 120–150 words, 30-mark rubric.
 * Practice questions test the conventions and criteria of the text type on FRESH scenarios (LANG-WR-01/03); they never
 * reuse the real task's content (DESIGN-UNI-01). aiExplanation: one entry per REAL task with its real marks (AIEXP-08).
 * Every fitb declares keyboard_type 'text' (LANG-KB-01).
 *
 * BASIS per practice question — M = marking guideline, P = printed in the paper, C = CAPS §3.3/§3.4:
 *   Q1: M: memo lists recipient address, subject, salutation, message, ending, sender's name.
 *   Q2: M: order of parts as listed in the memo.
 *   Q3: M: memo — formal tone and register, addressed to the former teacher.
 *   Q4: M: the e-mail must include gratitude and future plans.
 *   Q5: M: memo 2.1 'tone and register should be formal'.
 *
 *   node tools/validate-questions.js --script scripts/add-english-fal-2025-nov-p3-q2.js --curriculum temp/curriculum-vocab-english-fal.json
 *   node scripts/add-english-fal-2025-nov-p3-q2.js --dry-run
 *   node scripts/add-english-fal-2025-nov-p3-q2.js
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
  "name": "Question 2.1: E-mail",
  "syllabus": "dbe",
  "subject": "english_fal",
  "year": 2025,
  "paper": "nov_p3",
  "order": 2,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "email",
    "email_structure",
    "formal_email",
    "transactional_writing"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p3/q2/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p3/q2/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p3/q2/memo_2.png"
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
    "question": "Select the THREE parts that must appear in a formal e-mail.",
    "metadata": [
      "a subject line",
      "the sender's name at the end",
      "a greeting",
      "the sender's postal address in the top corner",
      "a postscript in capital letters"
    ],
    "answer": [
      "a subject line",
      "a greeting",
      "the sender's name at the end",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "transactional_writing",
    "topic": "email",
    "subtopic": "format_of_an_email",
    "skills": [
      "english_fal_identify_format_features"
    ],
    "difficulty": 1,
    "exam_weight": 2,
    "clues": "- Think about what a reader sees first and last in an e-mail.\n- Reject parts that belong to a printed letter."
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
    "question": "Arrange the parts of an e-mail in the order in which they appear.",
    "metadata": [
      "Suitable ending",
      "Subject line",
      "Sender's name",
      "Message",
      "Greeting"
    ],
    "answer": [
      "Subject line",
      "Greeting",
      "Message",
      "Suitable ending",
      "Sender's name"
    ],
    "presentation": "ordering",
    "type": "application",
    "unit": "transactional_writing",
    "topic": "email",
    "subtopic": "format_of_an_email",
    "skills": [
      "english_fal_order_events"
    ],
    "difficulty": 1,
    "exam_weight": 2,
    "clues": "- The subject appears before the greeting.\n- The sender's name comes after the closing words."
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
    "question": "Which opening best suits a formal e-mail to a former teacher?",
    "metadata": [
      "Hey Mr D, what's up? Just saying thanks lol!",
      "Mr Dlamini!! You were the best ever!!!",
      "To whom it may concern, this is about the school.",
      "Dear Mr Dlamini, I am writing to thank you for the guidance you gave me in Grade 8.",
      ""
    ],
    "answer": [
      "Dear Mr Dlamini, I am writing to thank you for the guidance you gave me in Grade 8.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "transactional_writing",
    "topic": "email",
    "subtopic": "register_and_tone",
    "skills": [
      "english_fal_choose_appropriate_register"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- The e-mail is addressed to a respected adult in a formal tone.\n- Avoid slang and over-excited punctuation."
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
    "question": "Which subject line best suits an e-mail of thanks that also shares your future plans?",
    "metadata": [
      "Thank you and my plans after Grade 12",
      "Hi!!!",
      "Something for you",
      "Please read now",
      ""
    ],
    "answer": [
      "Thank you and my plans after Grade 12",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "transactional_writing",
    "topic": "email",
    "subtopic": "subject_line",
    "skills": [
      "english_fal_write_subject_line"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- A subject line should tell the reader what the e-mail is about.\n- It should be short and clear."
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
    "question": "Which one word describes the tone and register of an e-mail to a former teacher? Write one word.",
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
    "topic": "email",
    "subtopic": "register_and_tone",
    "skills": [
      "english_fal_choose_appropriate_register"
    ],
    "difficulty": 1,
    "exam_weight": 1,
    "clues": "- Think about how you would speak to a respected adult.\n- Write one word.",
    "keyboard_type": "text"
  }
];

// ─── AI explanation — one entry per REAL task, real marks (AIEXP-08) ─────────

const aiExplanation = {
  "sub_questions": [
    {
      "number": "2.1",
      "marks": 30,
      "clues": "- Plan the order of the parts before you write.\n- Use a formal tone throughout.",
      "approach": "- Address the former teacher\n- Include recipient address, subject, greeting, message, ending and your name\n- Thank the teacher and share your future plans, 120–150 words",
      "solution": "1. The e-mail must be formal and addressed to the former teacher.\n2. All the format parts must be present.\n3. The message must show gratitude and share future plans."
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
