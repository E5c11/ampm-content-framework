#!/usr/bin/env node
/**
 * DBE Life Sciences P1 — November 2025 — Question 2.1 (Egg Yolk and Parental Care in Birds) (order 7)
 *
 * Real Q2.1 (8 marks) is a yolk-percentage table for six bird types with three chained items (2.1.1 explain precocial,
 * 2.1.2 name three birds with more parental care, 2.1.3 reason for 2.1.2). One lesson (DESIGN-UNI-10 rule 1). Fresh
 * practice questions use abstract bird types (P, Q, R …) with invented illustrative values stated in the question, so no real
 * species data is asserted (DESIGN-UNI-01), and test the same relationships: yolk -> development -> parental care.
 * Independent lesson — the real 2.1.2/2.1.3 chain is restated inside each question (DESIGN-UNI-13 not invoked).
 *
 * Keyboard (KEYBOARD-04, core/keyboard-input.md): every typed fitb declares keyboard_type — standard_math for a bare
 * number, text for a single canonical term (2.4.0; the 2025 exam is gated at 2.4.0 by tools/apply-exam-gate.js, VER-09).
 * Do NOT copy a P2 script as a template: those predate KEYBOARD-04 (tools/lib/legacy-keyboard-allowlist.js).
 * Reminder: don't factor shared text into an outer const used inside `questions` — validate-questions.js evals the
 * `questions = [...]` block in isolation.
 *
 *   node tools/validate-questions.js --script scripts/add-life-science-2025-nov-p1-q2-1-bird-development.js --curriculum temp/curriculum-vocab-life-science-p1.json
 *   node scripts/add-life-science-2025-nov-p1-q2-1-bird-development.js --dry-run
 *   node scripts/add-life-science-2025-nov-p1-q2-1-bird-development.js
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
  "name": "Question 2.1 (Egg Yolk and Parental Care in Birds)",
  "syllabus": "dbe",
  "subject": "life_science",
  "year": 2025,
  "paper": "nov_p1",
  "order": 7,
  "content_tier": "free",
  "has_video": false,
  "xp": 40,
  "tags": [
    "reproduction_in_vertebrates",
    "precocial_altricial",
    "parental_care"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2025/nov_p1/q7/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2025/nov_p1/q7/memo_1.png"
  ],
  "exam_question_marks": 8
};

const questions = [
  {
    "name": "Question 1",
    "question": "The chicks of a ground-nesting bird hatch covered in down with their eyes open, and can run and feed themselves within hours. Which term describes this type of development?",
    "metadata": [
      "Altricial development",
      "Precocial development",
      "Metamorphosis",
      "Internal fertilisation",
      ""
    ],
    "answer": [
      "Precocial development",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "life_processes_plants_animals",
    "topic": "reproduction_in_vertebrates",
    "subtopic": "precocial_development_identification",
    "skills": [
      "identify_precocial_development"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Judge how developed the chicks are at hatching and how much care they need."
  },
  {
    "name": "Question 2",
    "question": "An egg of bird type Q has a mass of 60 g and 35% of its mass is yolk. Calculate the mass of yolk in the egg, in grams.",
    "metadata": [
      "= ",
      "[ ]"
    ],
    "answer": [
      "21",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "reproduction_in_vertebrates",
    "subtopic": "yolk_mass_calculation",
    "skills": [
      "calculate_yolk_mass_from_percentage"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2025,
    "paper": "nov_p1",
    "keyboard_type": "standard_math",
    "clues": "- Convert the percentage to a fraction of the whole egg mass."
  },
  {
    "name": "Question 3",
    "question": "Which of the following are features of the amniotic egg of birds that make development on land possible?",
    "metadata": [
      "A shell that protects the embryo and reduces water loss",
      "A fluid-filled amnion that cushions the embryo",
      "A yolk that stores food for the embryo",
      "Fertilisation that takes place in open water",
      "A larval stage that lives in water"
    ],
    "answer": [
      "A shell that protects the embryo and reduces water loss",
      "A fluid-filled amnion that cushions the embryo",
      "A yolk that stores food for the embryo",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "reproduction_in_vertebrates",
    "subtopic": "amniotic_egg_features",
    "skills": [
      "identify_amniotic_egg_features"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- The embryo must stay protected, moist and fed without any external water."
  },
  {
    "name": "Question 4",
    "question": "The eggs of bird type R contain only 12% yolk, whereas those of bird type S contain 36% yolk. Which conclusion about the two types is best supported?",
    "metadata": [
      "Type S needs more parental care, because its chicks hatch less developed",
      "Both types need the same parental care, because yolk has no effect on development",
      "Type R needs more parental care, because its chicks hatch less developed and cannot feed themselves",
      "Type R needs less parental care, because its eggs are lighter",
      ""
    ],
    "answer": [
      "Type R needs more parental care, because its chicks hatch less developed and cannot feed themselves",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "reproduction_in_vertebrates",
    "subtopic": "yolk_percentage_parental_care",
    "skills": [
      "infer_parental_care_from_yolk"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- The yolk is the embryo's food store: a bigger store allows longer development inside the egg.\n- Chicks that hatch less developed depend on their parents."
  }
];

const aiExplanation = {
  sub_questions: [
    {
      "number": "2.1.1",
      "marks": 3,
      "clues": "- Look at the yolk percentage in the duck egg compared with the others.\n- A large energy store allows the embryo to develop further before hatching.",
      "approach": "- Read the duck's yolk percentage from the table.\n- Link a high yolk percentage to the amount of energy and nutrients available.\n- Link that to how developed and independent the hatchling is.",
      "solution": "1. The duck egg has a high percentage of yolk (35,4%), the highest in the table.\n2. A large yolk contains more energy and nutrients, so the embryo develops further inside the egg.\n3. The hatchling is well developed and fairly independent, which is precocial development."
    },
    {
      "number": "2.1.2",
      "marks": 3,
      "clues": "- The birds that need more care are those whose chicks hatch less developed.\n- Look for the three lowest yolk percentages.",
      "approach": "- Identify the birds with the lowest yolk percentages.\n- Link a low yolk percentage to altricial development and more parental care.",
      "solution": "1. The three lowest yolk percentages belong to the eagle (12,0%), the vulture (14,0%) and the pigeon (17,9%).\n2. Their chicks hatch less developed and need more parental care.\n3. The answer is eagle, vulture and pigeon."
    },
    {
      "number": "2.1.3",
      "marks": 2,
      "clues": "- Use your answer to 2.1.2 and the yolk percentages.\n- Consider the stage of development at hatching.",
      "approach": "- State what the low yolk percentage means for the embryo.\n- State the consequence for the hatchlings.",
      "solution": "1. These eggs have a lower percentage of yolk, so less food is available to the embryo.\n2. The hatchlings are therefore not fully developed and depend on their parents."
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
