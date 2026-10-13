#!/usr/bin/env node
/**
 * DBE English FAL P3 — November 2025 — Question 3.2: WhatsApp Message (order 7) — ideas for a class movie night, 80–100 words, 20-mark rubric.
 * Practice questions test the conventions and criteria of the text type on FRESH scenarios (LANG-WR-01/03); they never
 * reuse the real task's content (DESIGN-UNI-01). aiExplanation: one entry per REAL task with its real marks (AIEXP-08).
 * Every fitb declares keyboard_type 'text' (LANG-KB-01).
 *
 * BASIS per practice question — M = marking guideline, P = printed in the paper, C = CAPS §3.3/§3.4:
 *   Q1: M/P: memo 3.2 informal tone, clear and concise; the paper's note 'avoid slang'.
 *   Q2: M: memo 3.2.
 *   Q3: M: memo 3.2 'recipients should be addressed appropriately'.
 *   Q4: M: memo 3.2 'clear and concise'.
 *   Q5: P: the paper's note on 3.2.
 *
 *   node tools/validate-questions.js --script scripts/add-english-fal-2025-nov-p3-q7.js --curriculum temp/curriculum-vocab-english-fal.json
 *   node scripts/add-english-fal-2025-nov-p3-q7.js --dry-run
 *   node scripts/add-english-fal-2025-nov-p3-q7.js
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
  "name": "Question 3.2: WhatsApp Message",
  "syllabus": "dbe",
  "subject": "english_fal",
  "year": 2025,
  "paper": "nov_p3",
  "order": 7,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "digital_communication",
    "register",
    "language_register",
    "transactional_writing"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p3/q7/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p3/q7/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p3/q7/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p3/q7/memo_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p3/q7/memo_3.png"
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
    "question": "Which message best suits a class group chat when slang must be avoided?",
    "metadata": [
      "Dear Sir/Madam, I respectfully suggest a film.",
      "Hi everyone, how about a comedy for movie night? Vote below!",
      "Yo guys lol u want a movie or wat??",
      "Movie.",
      ""
    ],
    "answer": [
      "Hi everyone, how about a comedy for movie night? Vote below!",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "transactional_writing",
    "topic": "whatsapp_message",
    "subtopic": "tone_of_a_message",
    "skills": [
      "english_fal_choose_appropriate_register"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- The tone is informal but clear and polite.\n- Reject options that are too formal, too slangy or too short."
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
    "question": "Select the TWO features of a WhatsApp message to a classmates' group.",
    "metadata": [
      "an informal tone",
      "a formal closing such as 'Yours faithfully'",
      "clear and concise wording",
      "a postal address",
      "long paragraphs"
    ],
    "answer": [
      "an informal tone",
      "clear and concise wording",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "transactional_writing",
    "topic": "whatsapp_message",
    "subtopic": "features_of_a_message",
    "skills": [
      "english_fal_identify_format_features"
    ],
    "difficulty": 1,
    "exam_weight": 1,
    "clues": "- Think about how you would write to friends.\n- Reject features that belong to formal letters."
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
    "question": "Which greeting suits a message sent to the whole class group?",
    "metadata": [
      "Dear Principal,",
      "To whom it may concern,",
      "Hi everyone,",
      "Yours sincerely,",
      ""
    ],
    "answer": [
      "Hi everyone,",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "transactional_writing",
    "topic": "whatsapp_message",
    "subtopic": "addressing_recipients",
    "skills": [
      "english_fal_choose_appropriate_register"
    ],
    "difficulty": 1,
    "exam_weight": 1,
    "clues": "- A formal salutation is not needed, but the recipients should be addressed.\n- Reject greetings meant for one formal reader."
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
    "question": "Which one word describes a message that gets to the point in few words? Write one word.",
    "metadata": [
      "Word:",
      "[ ]"
    ],
    "answer": [
      "concise",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "definition",
    "unit": "transactional_writing",
    "topic": "whatsapp_message",
    "subtopic": "features_of_a_message",
    "skills": [
      "english_fal_identify_format_features"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- It means short and clear.\n- Write one word.",
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
    "question": "Which of these should the writer avoid in this message, according to the task note?",
    "metadata": [
      "punctuation",
      "paragraphs",
      "full stops",
      "slang",
      ""
    ],
    "answer": [
      "slang",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "transactional_writing",
    "topic": "whatsapp_message",
    "subtopic": "tone_of_a_message",
    "skills": [
      "english_fal_choose_appropriate_register"
    ],
    "difficulty": 1,
    "exam_weight": 1,
    "clues": "- The task note says what kind of language to avoid.\n- It is informal language used among friends."
  }
];

// ─── AI explanation — one entry per REAL task, real marks (AIEXP-08) ─────────

const aiExplanation = {
  "sub_questions": [
    {
      "number": "3.2",
      "marks": 20,
      "clues": "- Think of a few clear ideas for the movie night.\n- Write in an informal tone without slang.",
      "approach": "- Address the group\n- Share your ideas clearly and briefly\n- Keep to 80–100 words",
      "solution": "1. The tone and register must be informal.\n2. The text must be clear and concise.\n3. A formal salutation is not necessary, but the recipients should be addressed appropriately.\n4. Avoid slang."
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
