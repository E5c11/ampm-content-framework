#!/usr/bin/env node
/**
 * DBE English FAL P3 — November 2024 — Question 3.3: Instructions (order 8) — how to plan a birthday party, 80–100 words, 20-mark rubric.
 * Practice questions are fresh (DESIGN-UNI-01) and follow the shared rules: context_text null for literature (SETWORK-LES-05),
 * fresh targets, conventions-based for writing (LANG-WR-03); aiExplanation is one entry per REAL printed sub-question with its
 * real marks, derived from the memo in own words (AIEXP-08). Every fitb declares keyboard_type 'text' (LANG-KB-01).
 * Text key: none (language / writing paper).
 *
 * BASIS per practice question — BK book knowledge (verify against the text), P printed in the paper/poem, M memo,
 * PT vocabulary/title, C CAPS, P1 language-paper skill:
 *   Q1: M: memo 3.3 'must be written in the imperative'.
 *   Q2: M: memo 3.3 'clear and in a logical sequence'.
 *   Q3: M: memo 3.3.
 *   Q4: M: memo 3.3.
 *   Q5: C: CAPS §3.3 sequence words.
 *
 *   node tools/validate-questions.js --script scripts/add-english-fal-2024-nov-p3-q8.js --curriculum temp/curriculum-vocab-english-fal.json
 *   node scripts/add-english-fal-2024-nov-p3-q8.js --dry-run
 *   node scripts/add-english-fal-2024-nov-p3-q8.js
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
  "name": "Question 3.3: Instructions",
  "syllabus": "dbe",
  "subject": "english_fal",
  "year": 2024,
  "paper": "nov_p3",
  "order": 8,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "following_instructions",
    "transactional_writing",
    "sentence_construction"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p3/q8/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p3/q8/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p3/q8/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p3/q8/memo_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p3/q8/memo_3.png"
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
    "question": "Which sentence is written in the imperative, as instructions should be?",
    "metadata": [
      "You should choose a date and set a budget.",
      "A date was chosen and a budget was set.",
      "Choose a date and set a budget.",
      "Choosing a date is important.",
      ""
    ],
    "answer": [
      "Choose a date and set a budget.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "transactional_writing",
    "topic": "instructions",
    "subtopic": "imperative_mood",
    "skills": [
      "english_fal_use_the_imperative"
    ],
    "difficulty": 1,
    "exam_weight": 2,
    "clues": "- An imperative sentence gives a command and starts with the verb.\n- Reject sentences that describe or advise."
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
    "question": "Arrange these instructions for planning a party in a logical order.",
    "metadata": [
      "Send the invitations",
      "Choose a date and set a budget",
      "Prepare the food and decorations",
      "Make a guest list",
      ""
    ],
    "answer": [
      "Choose a date and set a budget",
      "Make a guest list",
      "Send the invitations",
      "Prepare the food and decorations",
      ""
    ],
    "presentation": "ordering",
    "type": "application",
    "unit": "transactional_writing",
    "topic": "instructions",
    "subtopic": "logical_order",
    "skills": [
      "english_fal_order_events"
    ],
    "difficulty": 1,
    "exam_weight": 2,
    "clues": "- Each step depends on the one before it.\n- The food is prepared near the date."
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
    "question": "Select the TWO things that instructions must be.",
    "metadata": [
      "They must be clear and in a logical sequence.",
      "They must be written in the past tense.",
      "They must be written in the imperative.",
      "They must include a drawing.",
      "They must be one long sentence."
    ],
    "answer": [
      "They must be clear and in a logical sequence.",
      "They must be written in the imperative.",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "transactional_writing",
    "topic": "instructions",
    "subtopic": "features_of_instructions",
    "skills": [
      "english_fal_identify_format_features"
    ],
    "difficulty": 1,
    "exam_weight": 1,
    "clues": "- Think about what makes instructions easy to follow.\n- Reject options the task forbids."
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
    "question": "What name is given to the form of the verb used to give commands? Write one word.",
    "metadata": [
      "Word:",
      "[ ]"
    ],
    "answer": [
      "imperative",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "definition",
    "unit": "transactional_writing",
    "topic": "instructions",
    "subtopic": "imperative_mood",
    "skills": [
      "english_fal_use_the_imperative"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- It starts a sentence such as 'Close the door'.\n- Write one word.",
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
    "question": "Which set of words helps a writer to show the order of steps?",
    "metadata": [
      "However, Although, Because, Unless",
      "Yesterday, Today, Tomorrow",
      "Maybe, Perhaps, Possibly",
      "First, Next, Then, Finally",
      ""
    ],
    "answer": [
      "First, Next, Then, Finally",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "transactional_writing",
    "topic": "instructions",
    "subtopic": "sequencing_words",
    "skills": [
      "english_fal_use_sequencing_words"
    ],
    "difficulty": 1,
    "exam_weight": 1,
    "clues": "- Think of words that mark the order of actions.\n- Reject words for contrast, general time or doubt."
  }
];

// ─── AI explanation — one entry per REAL printed sub-question, real marks (AIEXP-08) ───

const aiExplanation = {
  "sub_questions": [
    {
      "number": "3.3",
      "marks": 20,
      "clues": "- List the steps in the order a person would do them.",
      "approach": "- Put the steps in logical order\n- Write each in the imperative\n- Use point or paragraph form within 80–100 words",
      "solution": "1. The instructions may be in point or paragraph form.\n2. They must be clear and in a logical sequence.\n3. They must be written in the imperative; no marks for drawings."
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
