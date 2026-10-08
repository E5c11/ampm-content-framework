#!/usr/bin/env node
/**
 * DBE Life Sciences P1 — November 2024 — Question 1.5 (Structures Involved in Homeostasis) (order 6)
 *
 * Real Q1.5 (8 marks) is a whole-body diagram (pituitary A, skin blood vessels B, sweat gland C, pancreas D, kidney E,
 * adrenal F): endocrine-only letters, the thermoregulation structures, ADH and its target organ. One lesson (DESIGN-UNI-10
 * rule 1). Practice questions ask by function with no figure (DESIGN-LIFE-03 option (i)). Independent lesson.
 *
 * Keyboard (KEYBOARD-04, core/keyboard-input.md): every typed fitb declares keyboard_type — standard_math for a bare
 * number, text for a single canonical term. The exam gate is derived from the rows by tools/apply-exam-gate.js (VER-09).
 * Do NOT copy a P2 2025 script as a template: those predate KEYBOARD-04 (tools/lib/legacy-keyboard-allowlist.js).
 * Reminder: don't factor shared text into an outer const used inside `questions` — validate-questions.js evals the
 * `questions = [...]` block in isolation.
 *
 *   node tools/validate-questions.js --script scripts/add-life-science-2024-nov-p1-q1-5-homeostasis-structures.js --curriculum temp/curriculum-vocab-life-science-p1-2024.json
 *   node scripts/add-life-science-2024-nov-p1-q1-5-homeostasis-structures.js --dry-run
 *   node scripts/add-life-science-2024-nov-p1-q1-5-homeostasis-structures.js
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
  "name": "Question 1.5 (Structures Involved in Homeostasis)",
  "syllabus": "dbe",
  "subject": "life_science",
  "year": 2024,
  "paper": "nov_p1",
  "order": 6,
  "content_tier": "free",
  "has_video": false,
  "xp": 40,
  "tags": [
    "homeostasis",
    "endocrine_system",
    "thermoregulation"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2024/nov_p1/q6/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2024/nov_p1/q6/memo_1.png"
  ],
  "exam_question_marks": 8
};

const questions = [
  {
    "name": "Question 1",
    "question": "Exocrine glands release their secretions through ducts, while endocrine glands release hormones directly into the blood. Which of the following are endocrine glands? Select ALL that apply.",
    "metadata": [
      "Thyroid gland",
      "Salivary gland",
      "Pituitary gland",
      "Sweat gland",
      "Adrenal gland"
    ],
    "answer": [
      "Thyroid gland",
      "Pituitary gland",
      "Adrenal gland",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "definition",
    "unit": "life_processes_plants_animals",
    "topic": "human_endocrine_system",
    "subtopic": "endocrine_vs_exocrine_glands",
    "skills": [
      "classify_endocrine_glands"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Ask of each gland whether it makes a hormone.\n- Saliva and sweat leave through ducts."
  },
  {
    "name": "Question 2",
    "question": "A hiker climbs a hill on a hot day and her body temperature starts to rise. Which pair of changes in her skin helps to lower her body temperature?",
    "metadata": [
      "Vasoconstriction of the skin arterioles and more sweat secreted",
      "Vasodilation of the skin arterioles and less sweat secreted",
      "Vasoconstriction of the skin arterioles and less sweat secreted",
      "Vasodilation of the skin arterioles and more sweat secreted",
      ""
    ],
    "answer": [
      "Vasodilation of the skin arterioles and more sweat secreted",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "homeostasis_in_humans",
    "subtopic": "cooling_responses_identification",
    "skills": [
      "identify_cooling_responses"
    ],
    "difficulty": 2,
    "exam_weight": 3,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Heat is lost when more blood flows near the surface of the skin.\n- Evaporation of water from the skin cools it."
  },
  {
    "name": "Question 3",
    "question": "After drinking a large amount of water, the water level of a person's blood rises above normal. Arrange the steps that restore it in the correct order.",
    "metadata": [
      "The pituitary gland secretes less ADH",
      "Less water is reabsorbed into the blood",
      "The hypothalamus detects the high water level",
      "A large volume of dilute urine is produced",
      "The kidney tubules become less permeable to water"
    ],
    "answer": [
      "The hypothalamus detects the high water level",
      "The pituitary gland secretes less ADH",
      "The kidney tubules become less permeable to water",
      "Less water is reabsorbed into the blood",
      "A large volume of dilute urine is produced"
    ],
    "presentation": "ordering",
    "type": "ordering",
    "unit": "life_processes_plants_animals",
    "topic": "homeostasis_in_humans",
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
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Detection comes first, then a change in hormone secretion.\n- The hormone acts on the kidney tubules."
  },
  {
    "name": "Question 4",
    "question": "A person produces large volumes of very dilute urine, even on days when they drink little water. Name the hormone that is most likely being under-secreted.",
    "metadata": [
      "[ ]"
    ],
    "answer": [
      "ADH|antidiuretic hormone|anti-diuretic hormone|vasopressin",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "homeostasis_in_humans",
    "subtopic": "adh_deficiency_diagnosis",
    "skills": [
      "identify_hormone_from_deficiency_symptom"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p1",
    "keyboard_type": "text",
    "clues": "- Too little water is being reabsorbed in the kidneys.\n- The hormone is released by the pituitary gland."
  }
];

const aiExplanation = {
  sub_questions: [
    {
      "number": "1.5.1",
      "marks": 2,
      "clues": "- Endocrine glands secrete hormones only, with no ducts.\n- One labelled gland has both an endocrine and an exocrine function.",
      "approach": "- Identify each lettered part.\n- Exclude the pancreas (D), which also secretes digestive enzymes through a duct.\n- Keep the glands that only secrete hormones.",
      "solution": "1. A is the pituitary gland and F is the adrenal gland, and both secrete hormones only.\n2. D (pancreas) is both endocrine and exocrine, so it is excluded.\n3. The answer is A and F."
    },
    {
      "number": "1.5.2",
      "marks": 4,
      "clues": "- Look at the enlarged part of the skin.\n- One structure controls blood flow near the surface and the other releases water.",
      "approach": "- Identify the two labelled structures in the skin.\n- Give the letter and name for each.",
      "solution": "1. B is the blood vessels (capillaries/arterioles), which dilate or constrict to control heat loss.\n2. C is the sweat gland, which secretes sweat that cools the skin as it evaporates."
    },
    {
      "number": "1.5.3(a)",
      "marks": 1,
      "clues": "- Part A is the pituitary gland.",
      "approach": "- Recall which pituitary hormone controls water reabsorption.\n- Name it.",
      "solution": "1. The pituitary gland releases ADH (antidiuretic hormone).\n2. ADH controls how much water the kidneys reabsorb."
    },
    {
      "number": "1.5.3(b)",
      "marks": 1,
      "clues": "- Part E is shaped like a bean.",
      "approach": "- Identify the organ at E.\n- Confirm that ADH acts on it.",
      "solution": "1. E is the kidney.\n2. ADH acts on the kidney tubules to change how much water is reabsorbed."
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
