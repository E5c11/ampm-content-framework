#!/usr/bin/env node
/**
 * DBE English FAL P1 — November 2025 — Question 2: Summary (order 2)
 * TEXT C: how to prepare for tertiary education (list SEVEN points, ≤70 words). Practice tests the
 * sub-skills — selecting valid points, paraphrase, spotting repeated points, point-form conventions —
 * not the written summary (LANG-SEC-02). aiExplanation: one entry for the whole question, 10 marks.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video. Every fitb declares keyboard_type 'text' (LANG-KB-01).
 *   node tools/validate-questions.js --script scripts/add-english-fal-2025-nov-p1-q2.js --curriculum temp/curriculum-vocab-english-fal.json
 *   node scripts/add-english-fal-2025-nov-p1-q2.js --dry-run
 *   node scripts/add-english-fal-2025-nov-p1-q2.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

// ─── Phase 2 — lesson document ───────────────────────────────────────────────

const video = {
  "name": "Question 2: Summary",
  "syllabus": "dbe",
  "subject": "english_fal",
  "year": 2025,
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
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p1/q2/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p1/q2/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p1/q2/memo_2.png"
  ],
  "exam_question_marks": 10,
  "supplementary_materials": [
    {
      "type": "annexure",
      "label": "Text C",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p1/q2/annexure_text_c_1.png"
      ]
    }
  ]
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2025,
    "paper": "nov_p1",
    "name": "Question 1",
    "order": 1,
    "context_text": "Starting at a new institution is easier when you plan ahead. Learn your way around the campus before classes start. Save money each month for textbooks and transport. Many first-year students feel nervous at the start, and some institutions were founded more than a century ago. Join a study group in your first week so that you are not studying alone.",
    "question": "The passage lists ways to prepare for a new institution. Select the THREE sentences that are ways to prepare.",
    "metadata": [
      "Learn your way around the campus before classes start.",
      "Save money each month for textbooks and transport.",
      "Many first-year students feel nervous at the start.",
      "Join a study group in your first week.",
      "Some institutions were founded more than a century ago."
    ],
    "answer": [
      "Learn your way around the campus before classes start.",
      "Save money each month for textbooks and transport.",
      "Join a study group in your first week.",
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
    "clues": "- A way to prepare is an action a student can take.\n- Sentences that only describe or give background are not ways to prepare."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2025,
    "paper": "nov_p1",
    "name": "Question 2",
    "order": 2,
    "context_text": "Define clear academic goals for your first year.",
    "question": "Which ONE sentence best expresses the meaning of the sentence below in your OWN words?",
    "metadata": [
      "Define clear academic goals for your first year.",
      "Decide what you want to achieve in your studies during your first year.",
      "Write down your timetable for the whole year.",
      "Set goals for your social life in your first year.",
      ""
    ],
    "answer": [
      "Decide what you want to achieve in your studies during your first year.",
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
    "clues": "- The best rewording keeps the meaning but changes the words.\n- Watch for options that copy the original or change what it means."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2025,
    "paper": "nov_p1",
    "name": "Question 3",
    "order": 3,
    "context_text": "1. Pack your stationery and laptop.\n2. Pay your registration fees early.\n3. Make sure you have the equipment you need for your studies.\n4. Visit the library to learn about its services.",
    "question": "Which numbered point repeats the idea in point 1? Write only the number.",
    "metadata": [
      "Point number:",
      "[ ]"
    ],
    "answer": [
      "3",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "application",
    "unit": "summary",
    "topic": "main_vs_supporting_points",
    "subtopic": "repeated_points",
    "skills": [
      "english_fal_identify_repeated_point"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Decide what point 1 is really about, ignoring the exact words.\n- Look for the point that says the same thing differently.",
    "keyboard_type": "text"
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2025,
    "paper": "nov_p1",
    "name": "Question 4",
    "order": 4,
    "context_text": null,
    "question": "A summary must be written in point form: ONE point per sentence, in a full sentence. Which ONE sentence follows these instructions?",
    "metadata": [
      "Register early and find accommodation.",
      "Registering, accommodation.",
      "Find suitable accommodation before the term starts.",
      "Register early, and then, when that is done, find accommodation and pay fees.",
      ""
    ],
    "answer": [
      "Find suitable accommodation before the term starts.",
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

// ─── AI explanation — one entry per REAL exam sub-question, real marks (AIEXP-08) ───

const aiExplanation = {
  "sub_questions": [
    {
      "number": "2",
      "marks": 10,
      "clues": "- Find the actions the writer tells learners to take, one per paragraph or sentence.\n- Ignore advice that only repeats an earlier action.",
      "approach": "- Underline each action in TEXT C (requirements, funding, fees, housing, documents, items, services, goals, time management)\n- Choose seven distinct actions\n- Rewrite each as one full sentence in your own words, with a word count at the end",
      "solution": "1. Accepted points include: explore course requirements; consider how to fund studies; pay registration fees; find accommodation; have documents ready; obtain necessary items; explore student services; set academic goals; improve time management.\n2. Seven of these nine earn one mark each (7 marks).\n3. Three marks are for language: 1–3 correct points earn 1, 4–5 earn 2, 6–7 earn 3, and copying sentences word for word loses language marks.\n4. Write seven numbered sentences, one point each, within 70 words."
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
