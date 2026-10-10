#!/usr/bin/env node
/**
 * DBE English FAL P3 — November 2025 — Question 2.4: Speech (order 5) — farewell speech by the outgoing RCL chairperson, 120–150 words, 30-mark rubric.
 * Practice questions test the conventions and criteria of the text type on FRESH scenarios (LANG-WR-01/03); they never
 * reuse the real task's content (DESIGN-UNI-01). aiExplanation: one entry per REAL task with its real marks (AIEXP-08).
 * Every fitb declares keyboard_type 'text' (LANG-KB-01).
 *
 * BASIS per practice question — M = marking guideline, P = printed in the paper, C = CAPS §3.3/§3.4:
 *   Q1: M: memo 2.4 'suitable salutation/greeting'.
 *   Q2: M: memo 2.4 introduction, points, conclusion.
 *   Q3: M: memo 2.4 'introduction that captures the listener's attention'.
 *   Q4: C: CAPS speech features (audience awareness); memo 2.4 'tone and register appropriate for the audience'.
 *   Q5: M: memo 2.4 'a suitable conclusion'.
 *
 *   node tools/validate-questions.js --script scripts/add-english-fal-2025-nov-p3-q5.js --curriculum temp/curriculum-vocab-english-fal.json
 *   node scripts/add-english-fal-2025-nov-p3-q5.js --dry-run
 *   node scripts/add-english-fal-2025-nov-p3-q5.js
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
  "name": "Question 2.4: Speech",
  "syllabus": "dbe",
  "subject": "english_fal",
  "year": 2025,
  "paper": "nov_p3",
  "order": 5,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "speech_structure",
    "formal_writing",
    "transactional_writing",
    "register"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p3/q5/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p3/q5/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p3/q5/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p3/q5/memo_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p3/q5/memo_3.png"
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
    "question": "Which salutation best suits a farewell speech at a school assembly?",
    "metadata": [
      "Yo, everyone!",
      "To whom it may concern,",
      "Dear diary,",
      "Good morning, Principal, teachers and fellow learners.",
      ""
    ],
    "answer": [
      "Good morning, Principal, teachers and fellow learners.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "transactional_writing",
    "topic": "speech",
    "subtopic": "salutation_and_tone",
    "skills": [
      "english_fal_choose_appropriate_register"
    ],
    "difficulty": 1,
    "exam_weight": 2,
    "clues": "- A speech opens by greeting the audience in order of importance.\n- Reject greetings that belong to other texts."
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
    "question": "Arrange the parts of a speech in the order in which they are delivered.",
    "metadata": [
      "A suitable conclusion",
      "A greeting to the audience",
      "Well-developed points",
      "An introduction that captures attention",
      ""
    ],
    "answer": [
      "A greeting to the audience",
      "An introduction that captures attention",
      "Well-developed points",
      "A suitable conclusion",
      ""
    ],
    "presentation": "ordering",
    "type": "application",
    "unit": "transactional_writing",
    "topic": "speech",
    "subtopic": "structure_of_a_speech",
    "skills": [
      "english_fal_order_events"
    ],
    "difficulty": 1,
    "exam_weight": 2,
    "clues": "- The audience is greeted before anything else.\n- The conclusion comes last."
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
    "question": "Which opening best captures the attention of the listeners?",
    "metadata": [
      "My speech is about school.",
      "Have you ever wondered what you will remember about your last day at school?",
      "I was asked to speak.",
      "Thank you for listening.",
      ""
    ],
    "answer": [
      "Have you ever wondered what you will remember about your last day at school?",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "transactional_writing",
    "topic": "speech",
    "subtopic": "introduction_that_captures_attention",
    "skills": [
      "english_fal_write_an_opening"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- A good opening makes listeners want to hear more.\n- Reject openings that only announce the topic or end the speech."
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
    "question": "Select the TWO techniques that help a speech to hold an audience.",
    "metadata": [
      "a rhetorical question",
      "a long list of dates",
      "direct address to the audience",
      "a formal address at the top",
      ""
    ],
    "answer": [
      "a rhetorical question",
      "direct address to the audience",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "transactional_writing",
    "topic": "speech",
    "subtopic": "speech_techniques",
    "skills": [
      "english_fal_identify_persuasive_devices"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Think about how a speaker talks to an audience in the room.\n- Reject features that belong to written letters."
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
    "question": "What is the name of the final part of a speech that ends the speaker's message? Write one word.",
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
    "topic": "speech",
    "subtopic": "structure_of_a_speech",
    "skills": [
      "english_fal_identify_format_features"
    ],
    "difficulty": 1,
    "exam_weight": 1,
    "clues": "- It follows the main points.\n- Write one word.",
    "keyboard_type": "text"
  }
];

// ─── AI explanation — one entry per REAL task, real marks (AIEXP-08) ─────────

const aiExplanation = {
  "sub_questions": [
    {
      "number": "2.4",
      "marks": 30,
      "clues": "- Imagine the assembly hall and the audience.\n- Plan introduction, points and conclusion.",
      "approach": "- Greet the audience\n- Capture attention at the start\n- Develop your points and end with a suitable conclusion",
      "solution": "1. The speech needs a suitable salutation.\n2. The tone and register must suit the audience.\n3. It must have an attention-grabbing introduction, well-developed points and a suitable conclusion."
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
