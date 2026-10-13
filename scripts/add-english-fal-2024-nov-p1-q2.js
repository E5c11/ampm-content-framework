#!/usr/bin/env node
/**
 * DBE English FAL P1 — November 2024 — Question 2: Summary (order 2) — TEXT C how to be active in everyday life (list SEVEN points, ≤70 words). Practice tests sub-skills, not the written summary (LANG-SEC-02).
 * Practice questions are fresh (DESIGN-UNI-01) and follow the shared rules: context_text null for literature (SETWORK-LES-05),
 * fresh targets, conventions-based for writing (LANG-WR-03); aiExplanation is one entry per REAL printed sub-question with its
 * real marks, derived from the memo in own words (AIEXP-08). Every fitb declares keyboard_type 'text' (LANG-KB-01).
 * Text key: none (language / writing paper).
 *
 * BASIS per practice question — BK book knowledge (verify against the text), P printed in the paper/poem, M memo,
 * PT vocabulary/title, C CAPS, P1 language-paper skill:
 *   Q1: P1: select valid summary points
 *   Q2: P1: paraphrase
 *   Q3: P1: repeated point
 *   Q4: P1: point-form rules
 *
 *   node tools/validate-questions.js --script scripts/add-english-fal-2024-nov-p1-q2.js --curriculum temp/curriculum-vocab-english-fal.json
 *   node scripts/add-english-fal-2024-nov-p1-q2.js --dry-run
 *   node scripts/add-english-fal-2024-nov-p1-q2.js
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
  "name": "Question 2: Summary",
  "syllabus": "dbe",
  "subject": "english_fal",
  "year": 2024,
  "paper": "nov_p1",
  "order": 2,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "summary",
    "paraphrase",
    "main_points"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p1/q2/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p1/q2/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p1/q2/memo_2.png"
  ],
  "exam_question_marks": 10,
  "supplementary_materials": [
    {
      "type": "annexure",
      "label": "Text C",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p1/q2/annexure_text_c_1.png"
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
    "context_text": "Water is precious, and everyone can help to save it. Turn off taps while you brush your teeth. Many families in towns pay water bills, and some dams are very large. Fix any dripping tap at home, and collect rainwater in a bucket for the garden.",
    "question": "The passage lists ways to save water at home. Select the THREE sentences that are ways to save water.",
    "metadata": [
      "Turn off taps while you brush your teeth.",
      "Collect rainwater in a bucket.",
      "Fix any dripping tap at home.",
      "Many families in towns pay water bills.",
      "Some dams are very large."
    ],
    "answer": [
      "Turn off taps while you brush your teeth.",
      "Fix any dripping tap at home.",
      "Collect rainwater in a bucket.",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "summary",
    "topic": "main_vs_supporting_points",
    "subtopic": "select_main_points",
    "skills": [
      "english_fal_select_relevant_points"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "clues": "- A way to save water is something a person can do.\n- Sentences that only give background are not ways to save."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2024,
    "paper": "nov_p1",
    "name": "Question 2",
    "order": 2,
    "context_text": "Turn off the lights in rooms that nobody is using.",
    "question": "Which ONE sentence best expresses the meaning of the sentence below in your OWN words?",
    "metadata": [
      "Switch off lights that nobody is using.",
      "Switch off all lights in your home.",
      "Leave a light on in every room.",
      "Buy bulbs that use a lot of power.",
      ""
    ],
    "answer": [
      "Switch off lights that nobody is using.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "summary",
    "topic": "paraphrase_and_own_words",
    "subtopic": "best_paraphrase",
    "skills": [
      "english_fal_rewrite_in_own_words"
    ],
    "difficulty": 2,
    "exam_weight": 3,
    "clues": "- The best rewording keeps the meaning but changes the words.\n- Watch for options that change what is said."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2024,
    "paper": "nov_p1",
    "name": "Question 3",
    "order": 3,
    "context_text": "1. Walk to school.\n2. Take a shower instead of a bath.\n3. Switch off the TV when you leave the room.\n4. Use less water when you wash.",
    "question": "Which numbered point repeats the idea in point 4? Write only the number.",
    "metadata": [
      "Point number:",
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
    "unit": "summary",
    "topic": "main_vs_supporting_points",
    "subtopic": "repeated_points",
    "skills": [
      "english_fal_identify_repeated_point"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Decide what point 4 is really about, ignoring the exact words.\n- Look for the point that says the same thing differently.",
    "keyboard_type": "text"
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
    "question": "A summary must be written in point form: ONE point per sentence, in a full sentence. Which ONE sentence follows these instructions?",
    "metadata": [
      "Walk to school, cycle and also jog.",
      "Walking, cycling.",
      "Walk to school to stay healthy.",
      "Walk to school and then, after that, jog home and rest.",
      ""
    ],
    "answer": [
      "Walk to school to stay healthy.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "summary",
    "topic": "point_form_conventions",
    "subtopic": "one_point_per_sentence",
    "skills": [
      "english_fal_apply_point_form_rules"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Count the separate ideas in each option.\n- A fragment is not a full sentence."
  }
];

// ─── AI explanation — one entry per REAL printed sub-question, real marks (AIEXP-08) ───

const aiExplanation = {
  "sub_questions": [
    {
      "number": "2",
      "marks": 10,
      "clues": "- Find the actions the writer recommends, one per paragraph.\n- Ignore sentences that only give background.",
      "approach": "- Underline each action: walk, move around, cycle, take the stairs, jog, do housework, stretch, dance\n- Choose seven distinct actions\n- Write each as one full sentence in your own words, with a word count",
      "solution": "1. The memo accepts eight points: walk regularly; move at every opportunity; cycle to your destination; climb stairs; jog; do housework; stretch and walk every half hour; dance.\n2. Seven of these earn one mark each (7 marks).\n3. Three marks are for language: 1–3 correct points earn 1, 4–5 earn 2, 6–7 earn 3; verbatim quotes lose language marks.\n4. Write seven numbered sentences, one point each, within 70 words."
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
