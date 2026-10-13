#!/usr/bin/env node
/**
 * DBE English FAL P1 — November 2024 — Question 4: Analysing a Cartoon (order 4) — TEXT E Dennis the Menace (seven frames, texting). Practice uses fresh written frame dialogue; text-extractable items only (LANG-SEC-04); drawing-dependent items are skipped.
 * Practice questions are fresh (DESIGN-UNI-01) and follow the shared rules: context_text null for literature (SETWORK-LES-05),
 * fresh targets, conventions-based for writing (LANG-WR-03); aiExplanation is one entry per REAL printed sub-question with its
 * real marks, derived from the memo in own words (AIEXP-08). Every fitb declares keyboard_type 'text' (LANG-KB-01).
 * Text key: none (language / writing paper).
 *
 * BASIS per practice question — BK book knowledge (verify against the text), P printed in the paper/poem, M memo,
 * PT vocabulary/title, C CAPS, P1 language-paper skill:
 *   Q1: P1: punctuation in cartoons
 *   Q2: P1: conventions
 *   Q3: P1: passive voice
 *   Q4: P1: humour techniques
 *
 *   node tools/validate-questions.js --script scripts/add-english-fal-2024-nov-p1-q4.js --curriculum temp/curriculum-vocab-english-fal.json
 *   node scripts/add-english-fal-2024-nov-p1-q4.js --dry-run
 *   node scripts/add-english-fal-2024-nov-p1-q4.js
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
  "name": "Question 4: Analysing a Cartoon",
  "syllabus": "dbe",
  "subject": "english_fal",
  "year": 2024,
  "paper": "nov_p1",
  "order": 4,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "cartoons",
    "dialogue",
    "passive_voice"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p1/q4/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p1/q4/memo_1.png"
  ],
  "exam_question_marks": 10,
  "supplementary_materials": [
    {
      "type": "annexure",
      "label": "Text E",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p1/q4/annexure_text_e_1.png",
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p1/q4/annexure_text_e_2.png"
      ]
    }
  ]
};

// ─── Practice questions ──────────────────────────────────────────────────────

const questions = [
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2024,
    "paper": "nov_p1",
    "name": "Question 1",
    "order": 1,
    "context_text": "[Frame 2] Mia (speech bubble): 'Really?'",
    "question": "Which punctuation mark follows the word 'Really' in the frame below?",
    "metadata": [
      "exclamation mark",
      "comma",
      "question mark",
      "full stop",
      ""
    ],
    "answer": [
      "question mark",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "language",
    "topic": "punctuation_and_spelling",
    "subtopic": "end_punctuation",
    "skills": [
      "english_fal_identify_punctuation_function"
    ],
    "difficulty": 1,
    "exam_weight": 2,
    "clues": "- Think about what a speaker is doing when the word is a query.\n- The speaker is asking, not shouting."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2024,
    "paper": "nov_p1",
    "name": "Question 2",
    "order": 2,
    "context_text": null,
    "question": "Match each cartoon feature to what it is.",
    "metadata": [
      "A - frame",
      "B - speech bubble",
      "C - caption",
      "1 - words a character says aloud",
      "2 - a short line of text that explains or titles a frame",
      "3 - one box of the cartoon strip"
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
    "unit": "visual_texts",
    "topic": "cartoon_analysis",
    "subtopic": "cartoon_conventions",
    "skills": [
      "english_fal_explain_cartoon_conventions"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Think about how a cartoon strip is built.\n- One feature is text outside the bubbles."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2024,
    "paper": "nov_p1",
    "name": "Question 3",
    "order": 3,
    "context_text": "[Frame 4] Mia: 'Teenagers send many messages.'",
    "question": "Which sentence is the passive voice of the sentence in the frame?",
    "metadata": [
      "Teenagers were sending many messages.",
      "Many messages send teenagers.",
      "Teenagers are sent by many messages.",
      "Many messages are sent by teenagers.",
      ""
    ],
    "answer": [
      "Many messages are sent by teenagers.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "language",
    "topic": "passive_and_reported_speech",
    "subtopic": "passive_voice",
    "skills": [
      "english_fal_change_to_passive_voice"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "clues": "- In the passive voice the object of the active sentence becomes the subject.\n- Keep the same tense."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2024,
    "paper": "nov_p1",
    "name": "Question 4",
    "order": 4,
    "context_text": null,
    "question": "Select the TWO ways in which humour can be created in a cartoon.",
    "metadata": [
      "A character's words contradict what the picture shows.",
      "The cartoon explains a real news story.",
      "A character exaggerates an everyday habit.",
      "Every frame shows the same drawing.",
      ""
    ],
    "answer": [
      "A character's words contradict what the picture shows.",
      "A character exaggerates an everyday habit.",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "visual_texts",
    "topic": "cartoon_analysis",
    "subtopic": "creating_humour",
    "skills": [
      "english_fal_explain_how_humour_is_created"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "clues": "- Humour often comes from a gap between what is said and what is shown.\n- Check each option against how cartoons work."
  }
];

// ─── AI explanation — one entry per REAL printed sub-question, real marks (AIEXP-08) ───

const aiExplanation = {
  "sub_questions": [
    {
      "number": "4.1.1",
      "marks": 1,
      "clues": "- Think about what 'finally gave in' says about how easily Mr Wilson agrees.",
      "approach": "- Read the phrase in context\n- Eliminate options",
      "solution": "1. 'Finally gave in' suggests Mr Wilson does not give in easily, so he is stubborn: B."
    },
    {
      "number": "4.1.2",
      "marks": 1,
      "clues": "- Look at the mark after 'Wow'.",
      "approach": "- Find the mark\n- Name it",
      "solution": "1. It is an exclamation mark."
    },
    {
      "number": "4.2",
      "marks": 2,
      "clues": "- Think about what a silhouette does to a face.",
      "approach": "- Describe the visual\n- Say why it is used",
      "solution": "1. The outline focuses on Dennis' message.\n2. It shows facial expressions are not important when texting, or that the Wilsons are detached from their surroundings (any two)."
    },
    {
      "number": "4.3",
      "marks": 2,
      "clues": "- You need one verbal clue and one visual clue.",
      "approach": "- Find what Mr Wilson says\n- Find what his face shows",
      "solution": "1. Verbal: he says 'That seems like a lot of work'.\n2. Visual: his mouth is turned down or he is frowning."
    },
    {
      "number": "4.4",
      "marks": 2,
      "clues": "- Look at the hair, eyes and glasses of each person.",
      "approach": "- Describe Mr Wilson\n- Describe Mrs Wilson",
      "solution": "1. Mr Wilson is bald with wrinkles or bags under his eyes.\n2. Mrs Wilson has an old-fashioned hairstyle and glasses."
    },
    {
      "number": "4.5",
      "marks": 2,
      "clues": "- Decide if the comment is funny, then give a reason.",
      "approach": "- State your view\n- Refer to Mrs Wilson's words",
      "solution": "1. Yes: she teases her husband lovingly about his unfriendly nature.\n2. No: calling him grumpy is disrespectful and embarrasses him in front of Dennis.\n3. A bare yes or no earns no mark."
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
