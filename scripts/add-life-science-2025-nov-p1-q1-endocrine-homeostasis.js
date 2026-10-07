#!/usr/bin/env node
/**
 * DBE Life Sciences P1 — November 2025 — Question 1 (Endocrine System and Homeostasis) (order 3)
 *
 * Real Q1.1.1 (adrenalin), 1.1.4 (thyroxin feedback), 1.1.10 (ADH after exercise in heat) and 1.2.8 (homeostasis) — the Endocrine
 * and Homeostasis items in Q1.1–1.2 (7 marks), clustered by knowledge area (DESIGN-UNI-10 rule 2). Independent lesson.
 *
 * Keyboard (KEYBOARD-04, core/keyboard-input.md): every typed fitb declares keyboard_type — standard_math for a bare
 * number, text for a single canonical term (2.4.0; the 2025 exam is gated at 2.4.0 by tools/apply-exam-gate.js, VER-09).
 * Do NOT copy a P2 script as a template: those predate KEYBOARD-04 (tools/lib/legacy-keyboard-allowlist.js).
 * Reminder: don't factor shared text into an outer const used inside `questions` — validate-questions.js evals the
 * `questions = [...]` block in isolation.
 *
 *   node tools/validate-questions.js --script scripts/add-life-science-2025-nov-p1-q1-endocrine-homeostasis.js --curriculum temp/curriculum-vocab-life-science-p1.json
 *   node scripts/add-life-science-2025-nov-p1-q1-endocrine-homeostasis.js --dry-run
 *   node scripts/add-life-science-2025-nov-p1-q1-endocrine-homeostasis.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

const video = {
  "name": "Question 1 (Endocrine System and Homeostasis)",
  "syllabus": "dbe",
  "subject": "life_science",
  "year": 2025,
  "paper": "nov_p1",
  "order": 3,
  "content_tier": "free",
  "has_video": false,
  "xp": 40,
  "tags": [
    "endocrine_system",
    "negative_feedback",
    "homeostasis"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2025/nov_p1/q3/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2025/nov_p1/q3/question_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2025/nov_p1/q3/question_3.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2025/nov_p1/q3/memo_1.png"
  ],
  "exam_question_marks": 7
};

const questions = [
  {
    "name": "Question 1",
    "question": "Which of the following correctly pairs a gland with a hormone it secretes and the effect of that hormone?",
    "metadata": [
      "Adrenal gland, adrenalin, increases heart rate and breathing rate",
      "Pituitary gland, insulin, lowers blood glucose concentration",
      "Thyroid gland, ADH, reduces water loss in urine",
      "Pancreas, glucagon, lowers blood glucose concentration",
      ""
    ],
    "answer": [
      "Adrenal gland, adrenalin, increases heart rate and breathing rate",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "human_endocrine_system",
    "subtopic": "gland_hormone_effect_pairing",
    "skills": [
      "pair_gland_hormone_effect"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Check the gland first: only one option names a hormone that this gland really secretes."
  },
  {
    "name": "Question 2",
    "question": "A learner's blood glucose concentration rises after a sugary drink. Which of the following describe the negative feedback response that brings it back to normal?",
    "metadata": [
      "The pancreas secretes more insulin",
      "The liver converts glucose to glycogen",
      "The pancreas secretes more glucagon",
      "Blood glucose concentration moves back towards the normal level",
      "Blood glucose concentration continues to rise"
    ],
    "answer": [
      "The pancreas secretes more insulin",
      "The liver converts glucose to glycogen",
      "Blood glucose concentration moves back towards the normal level",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "human_endocrine_system",
    "subtopic": "glucose_negative_feedback",
    "skills": [
      "describe_glucose_negative_feedback"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Negative feedback reverses the change that triggered it.\n- Decide which pancreatic hormone lowers, and which raises, blood glucose."
  },
  {
    "name": "Question 3",
    "question": "A hiker sweats heavily and does not drink for several hours. Arrange the events that follow in the correct order.",
    "metadata": [
      "The hypothalamus detects the change in the blood",
      "More ADH is released into the blood",
      "The walls of the kidney tubules become more permeable to water",
      "A small volume of concentrated urine is produced",
      "The blood becomes more concentrated as its water content falls"
    ],
    "answer": [
      "The blood becomes more concentrated as its water content falls",
      "The hypothalamus detects the change in the blood",
      "More ADH is released into the blood",
      "The walls of the kidney tubules become more permeable to water",
      "A small volume of concentrated urine is produced"
    ],
    "presentation": "ordering",
    "type": "ordering",
    "unit": "life_processes_plants_animals",
    "topic": "human_endocrine_system",
    "subtopic": "adh_water_balance_sequence",
    "skills": [
      "sequence_adh_water_regulation"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Start with the change in the blood and end with the effect on urine.\n- ADH acts on the kidney tubules after it is released."
  },
  {
    "name": "Question 4",
    "question": "Name the gland in the neck that secretes thyroxin.",
    "metadata": [
      "[ ]"
    ],
    "answer": [
      "thyroid|thyroid gland",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "definition",
    "unit": "life_processes_plants_animals",
    "topic": "human_endocrine_system",
    "subtopic": "thyroxin_source_gland",
    "skills": [
      "name_thyroxin_gland"
    ],
    "difficulty": 1,
    "exam_weight": 1,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2025,
    "paper": "nov_p1",
    "keyboard_type": "text",
    "clues": "- The hormone and the gland share the same root word."
  }
];

const aiExplanation = {
  sub_questions: [
    {
      "number": "1.1.1",
      "marks": 2,
      "clues": "- This hormone is secreted by the adrenal glands during fear or excitement.\n- It increases heart rate and diverts blood to the muscles.",
      "approach": "- Recall the fight-or-flight hormone.\n- Rule out hormones with other roles: water balance, pregnancy, lactation.",
      "solution": "1. Aldosterone regulates salt balance, progesterone maintains pregnancy and prolactin stimulates milk production.\n2. Adrenalin prepares the body for an emergency.\n3. The answer is C."
    },
    {
      "number": "1.1.4",
      "marks": 2,
      "clues": "- This is a negative feedback loop: a high level of the final hormone switches off its own stimulus.\n- Decide which gland releases TSH.",
      "approach": "- Recall that the pituitary secretes TSH, which stimulates the thyroid to release thyroxin.\n- Apply negative feedback: high thyroxin reduces TSH release.",
      "solution": "1. TSH is secreted by the pituitary gland and stimulates the thyroid gland to secrete thyroxin.\n2. A high level of thyroxin inhibits the pituitary, so it secretes less TSH.\n3. The answer is A."
    },
    {
      "number": "1.1.10",
      "marks": 2,
      "clues": "- Without drinking, the body must conserve water.\n- Think about how ADH changes the permeability of the kidney tubules.",
      "approach": "- Work out whether the blood becomes more or less concentrated.\n- Decide whether more or less ADH is secreted, and what it does to the tubules and urine.",
      "solution": "1. Heavy sweating without drinking makes the blood more concentrated.\n2. More ADH is secreted, which makes the kidney tubules more permeable to water so more water is reabsorbed.\n3. Increased ADH secretion and increased permeability is option A."
    },
    {
      "number": "1.2.8",
      "marks": 1,
      "clues": "- The term describes keeping conditions steady within narrow limits.",
      "approach": "- Recall the term for maintaining a constant internal environment.\n- Give the single biological term.",
      "solution": "1. The maintenance of a constant internal environment within narrow limits is called homeostasis."
    }
  ],
  model: 'claude-sonnet-5-5',
  generated_at: Date.now(),
  version: 2,
  reviewed: false,
  input_tokens: 0,
  output_tokens: 0,
  avg_rating: null,
  rating_count: null,
};

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

  // Exam gate (VER-02/VER-04, tools/apply-exam-gate.js): derive the exam's minimum app version from the rows now in the
  // database and write it to exam_versions. Dev only; idempotent; the gate is per EXAM, so it covers P2 too.
  if (!DRY_RUN && ENV === 'dev') {
    const { applyExamGates } = require('../tools/lib/exam-gate');
    await applyExamGates(pool, { env: ENV, apply: true, filter: { subject: video.subject, syllabus: video.syllabus, year: String(video.year) } });
  }
}

if (require.main === module) {
  upload()
    .catch((err) => {
      console.error('\n❌ Upload failed:', err.message);
      process.exitCode = 1;
    })
    .finally(closePool);
}
