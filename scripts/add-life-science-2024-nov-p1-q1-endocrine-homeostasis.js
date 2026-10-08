#!/usr/bin/env node
/**
 * DBE Life Sciences P1 — November 2024 — Question 1 (Endocrine System and Homeostasis) (order 3)
 *
 * Section A cluster (DESIGN-UNI-10 rule 2): the endocrine and homeostasis items of Q1 — 1.1.1 (aldosterone), 1.1.3
 * (carbon dioxide regulation), 1.1.4 (adrenalin), 1.1.7 (hypothalamus). 8 marks. Independent lesson; practice questions
 * apply each control to a fresh situation (salt loss, a sprint, exercise, a damaged control centre).
 *
 * Keyboard (KEYBOARD-04, core/keyboard-input.md): every typed fitb declares keyboard_type — standard_math for a bare
 * number, text for a single canonical term. The exam gate is derived from the rows by tools/apply-exam-gate.js (VER-09).
 * Do NOT copy a P2 2025 script as a template: those predate KEYBOARD-04 (tools/lib/legacy-keyboard-allowlist.js).
 * Reminder: don't factor shared text into an outer const used inside `questions` — validate-questions.js evals the
 * `questions = [...]` block in isolation.
 *
 *   node tools/validate-questions.js --script scripts/add-life-science-2024-nov-p1-q1-endocrine-homeostasis.js --curriculum temp/curriculum-vocab-life-science-p1-2024.json
 *   node scripts/add-life-science-2024-nov-p1-q1-endocrine-homeostasis.js --dry-run
 *   node scripts/add-life-science-2024-nov-p1-q1-endocrine-homeostasis.js
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
  "year": 2024,
  "paper": "nov_p1",
  "order": 3,
  "content_tier": "free",
  "has_video": false,
  "xp": 40,
  "tags": [
    "endocrine_system",
    "homeostasis",
    "negative_feedback"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2024/nov_p1/q3/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2024/nov_p1/q3/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2024/nov_p1/q3/memo_1.png"
  ],
  "exam_question_marks": 8
};

const questions = [
  {
    "name": "Question 1",
    "question": "During exercise the carbon dioxide level in the blood rises above normal. Arrange the steps that return it to normal in the correct order.",
    "metadata": [
      "The medulla oblongata stimulates the breathing muscles and the heart",
      "More carbon dioxide is exhaled and the level returns to normal",
      "Receptors in the carotid artery detect the high carbon dioxide level",
      "Breathing becomes faster and deeper",
      "Impulses are sent to the medulla oblongata"
    ],
    "answer": [
      "Receptors in the carotid artery detect the high carbon dioxide level",
      "Impulses are sent to the medulla oblongata",
      "The medulla oblongata stimulates the breathing muscles and the heart",
      "Breathing becomes faster and deeper",
      "More carbon dioxide is exhaled and the level returns to normal"
    ],
    "presentation": "ordering",
    "type": "ordering",
    "unit": "life_processes_plants_animals",
    "topic": "homeostasis_in_humans",
    "subtopic": "carbon_dioxide_regulation_sequence",
    "skills": [
      "sequence_carbon_dioxide_regulation"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- A negative feedback loop starts with detection and ends with the change being reversed.\n- The control centre is in the brain stem."
  },
  {
    "name": "Question 2",
    "question": "A road worker sweats heavily all day and loses a lot of salt. Which response restores the salt level of his blood?",
    "metadata": [
      "The pituitary gland secretes more ADH, so the kidney tubules reabsorb more sodium",
      "The adrenal glands secrete less aldosterone, so the kidney tubules reabsorb more sodium",
      "The pancreas secretes more glucagon, so the kidneys excrete less sodium in the urine",
      "The adrenal glands secrete more aldosterone, so the kidney tubules reabsorb more sodium",
      ""
    ],
    "answer": [
      "The adrenal glands secrete more aldosterone, so the kidney tubules reabsorb more sodium",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "homeostasis_in_humans",
    "subtopic": "salt_balance_aldosterone",
    "skills": [
      "explain_aldosterone_salt_regulation"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Identify the hormone that controls salt, not water.\n- Low salt must lead to more salt being kept in the body."
  },
  {
    "name": "Question 3",
    "question": "Just before a race, a sprinter's adrenal glands release adrenalin. Which changes does adrenalin bring about? Select ALL that apply.",
    "metadata": [
      "The heart beats faster and more strongly",
      "More blood flows to the digestive system",
      "Glycogen in the liver is converted to glucose",
      "Blood vessels to the skeletal muscles constrict",
      "The pupils dilate"
    ],
    "answer": [
      "The heart beats faster and more strongly",
      "Glycogen in the liver is converted to glucose",
      "The pupils dilate",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "human_endocrine_system",
    "subtopic": "adrenalin_effects",
    "skills": [
      "identify_adrenalin_effects"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Adrenalin prepares the body for fight or flight.\n- Blood and energy are directed to where they are needed for action."
  },
  {
    "name": "Question 4",
    "question": "A patient's sweat glands, skin blood vessels and muscles are all healthy, but the patient no longer sweats when hot or shivers when cold. Name the part of the brain that is most likely damaged.",
    "metadata": [
      "[ ]"
    ],
    "answer": [
      "hypothalamus|the hypothalamus",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "homeostasis_in_humans",
    "subtopic": "thermoregulation_control_centre",
    "skills": [
      "identify_thermoregulation_control_centre"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p1",
    "keyboard_type": "text",
    "clues": "- The effectors work, so the fault is in the control centre.\n- This part of the brain detects changes in blood temperature."
  }
];

const aiExplanation = {
  sub_questions: [
    {
      "number": "1.1.1",
      "marks": 2,
      "clues": "- The hormone is secreted by the adrenal glands and acts on the kidneys.",
      "approach": "- Recall the function of each hormone listed.\n- Choose the one that controls sodium reabsorption.",
      "solution": "1. Testosterone is a male sex hormone, prolactin stimulates milk production and glucagon raises blood glucose.\n2. Aldosterone controls the reabsorption of sodium (salt) in the kidney tubules.\n3. The answer is B."
    },
    {
      "number": "1.1.3",
      "marks": 2,
      "clues": "- High carbon dioxide must be detected before the body can correct it.\n- Consider where these receptors are found.",
      "approach": "- Eliminate options that would make carbon dioxide build up further.\n- Recall where the carbon dioxide receptors are.",
      "solution": "1. A high carbon dioxide level stimulates receptor cells in the carotid artery.\n2. This leads to faster and deeper breathing and a faster heartbeat, so options A and C are the opposite.\n3. The answer is D."
    },
    {
      "number": "1.1.4",
      "marks": 2,
      "clues": "- Adrenalin prepares the body for action.\n- Consider where extra blood is most needed during action.",
      "approach": "- Predict the direction of each change under adrenalin.\n- Choose the one that matches fight or flight.",
      "solution": "1. Adrenalin increases blood pressure and muscle tone, and diverts blood away from the digestive system.\n2. It increases the blood supply to the skeletal muscles.\n3. The answer is A."
    },
    {
      "number": "1.1.7",
      "marks": 2,
      "clues": "- Thermoregulation needs a control centre that monitors blood temperature.",
      "approach": "- Recall the function of each part listed.\n- Choose the one that acts as the thermoregulatory centre.",
      "solution": "1. The corpus callosum links the hemispheres, the cerebellum controls balance and the spinal cord carries impulses.\n2. The hypothalamus monitors blood temperature and controls the responses.\n3. The answer is B."
    }
  ],
  model: 'claude-opus-5-5',
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
