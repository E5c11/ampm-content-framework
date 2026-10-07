#!/usr/bin/env node
/**
 * DBE Life Sciences P1 — November 2025 — Question 2.5 (Hormone Investigation) (order 11)
 *
 * Real Q2.5 (11 marks) is a growth-hormone investigation (boys with ISS, Groups A and B) with five items: dependent variable, three
 * constants, purpose of the control group, a unit-bearing calculation (25 x 0,028) and a conclusion. One lesson (DESIGN-UNI-10
 * rule 1). Fresh practice questions use a different investigation (thyroxin and tadpole development — invented, illustrative
 * numbers) and test the same skills. Per DESIGN-LIFE-04 the calculation is a one-blank numeric fitb and the unit mark is tested
 * separately as a choice. Independent lesson.
 *
 * Keyboard (KEYBOARD-04, core/keyboard-input.md): every typed fitb declares keyboard_type — standard_math for a bare
 * number, text for a single canonical term (2.4.0; the 2025 exam is gated at 2.4.0 by tools/apply-exam-gate.js, VER-09).
 * Do NOT copy a P2 script as a template: those predate KEYBOARD-04 (tools/lib/legacy-keyboard-allowlist.js).
 * Reminder: don't factor shared text into an outer const used inside `questions` — validate-questions.js evals the
 * `questions = [...]` block in isolation.
 *
 *   node tools/validate-questions.js --script scripts/add-life-science-2025-nov-p1-q2-5-hormone-investigation.js --curriculum temp/curriculum-vocab-life-science-p1.json
 *   node scripts/add-life-science-2025-nov-p1-q2-5-hormone-investigation.js --dry-run
 *   node scripts/add-life-science-2025-nov-p1-q2-5-hormone-investigation.js
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
  "name": "Question 2.5 (Hormone Investigation)",
  "syllabus": "dbe",
  "subject": "life_science",
  "year": 2025,
  "paper": "nov_p1",
  "order": 11,
  "content_tier": "free",
  "has_video": false,
  "xp": 60,
  "tags": [
    "investigation_skills",
    "growth_hormone",
    "variables"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2025/nov_p1/q11/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2025/nov_p1/q11/memo_1.png"
  ],
  "exam_question_marks": 11
};

const questions = [
  {
    "name": "Question 1",
    "question": "Two groups of tadpoles of the same species are kept in tanks. Group A is given water containing added thyroxin and Group B is given plain water. The number of days until the hind legs appear is recorded for each tadpole. What is the dependent variable in this investigation?",
    "metadata": [
      "The amount of thyroxin added to the water",
      "The temperature of the water",
      "The number of days taken for the hind legs to appear",
      "The number of tadpoles in each tank",
      ""
    ],
    "answer": [
      "The number of days taken for the hind legs to appear",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "human_endocrine_system",
    "subtopic": "dependent_variable_identification",
    "skills": [
      "identify_dependent_variable"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- The dependent variable is the one that is measured as the result of the change you make."
  },
  {
    "name": "Question 2",
    "question": "In the tadpole investigation, which of the following must be kept constant to make the investigation valid?",
    "metadata": [
      "The species and age of the tadpoles",
      "The temperature of the water in both tanks",
      "The volume of water and the amount of food in each tank",
      "Whether thyroxin is added to the water",
      "The number of days until the hind legs appear"
    ],
    "answer": [
      "The species and age of the tadpoles",
      "The temperature of the water in both tanks",
      "The volume of water and the amount of food in each tank",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "human_endocrine_system",
    "subtopic": "controlled_variables_identification",
    "skills": [
      "identify_controlled_variables"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Factors that you deliberately change or that you measure cannot be held constant."
  },
  {
    "name": "Question 3",
    "question": "In the tadpole investigation, Group B received plain water without thyroxin. What is the purpose of Group B?",
    "metadata": [
      "To make sure that all the tadpoles receive thyroxin",
      "To show that any difference in development is caused by the thyroxin and not by other factors",
      "To increase the number of tadpoles in the investigation",
      "To test whether tadpoles can survive without any water",
      ""
    ],
    "answer": [
      "To show that any difference in development is caused by the thyroxin and not by other factors",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "human_endocrine_system",
    "subtopic": "control_group_purpose",
    "skills": [
      "explain_purpose_of_control_group"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- A comparison group changes only the one thing being tested."
  },
  {
    "name": "Question 4",
    "question": "Each tank holds 12 litres of water and thyroxin is added at 0,05 mg per litre. Calculate the total mass of thyroxin added to one tank, in mg.",
    "metadata": [
      "= ",
      "[ ]"
    ],
    "answer": [
      "0.6",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "human_endocrine_system",
    "subtopic": "hormone_amount_calculation",
    "skills": [
      "calculate_total_hormone_amount"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2025,
    "paper": "nov_p1",
    "keyboard_type": "standard_math",
    "clues": "- Multiply the rate by the volume of water."
  },
  {
    "name": "Question 5",
    "question": "A hormone dosage is given as 0,02 mg per kg of body mass. A learner multiplies this by a patient's mass in kg to find the dose. Which unit must accompany the answer?",
    "metadata": [
      "mg per kg",
      "kg",
      "mℓ",
      "mg",
      ""
    ],
    "answer": [
      "mg",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "human_endocrine_system",
    "subtopic": "calculation_unit_selection",
    "skills": [
      "select_unit_for_hormone_dose"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 5,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- The kilograms of body mass cancel out when you multiply."
  },
  {
    "name": "Question 6",
    "question": "The hind legs of the tadpoles in Group A appeared on average 6 days sooner than those of Group B. Which conclusion is valid?",
    "metadata": [
      "Thyroxin slows down the development of tadpoles",
      "Added thyroxin speeds up the development of tadpoles",
      "Tadpoles cannot develop hind legs without thyroxin",
      "Thyroxin is secreted by the pituitary gland of the tadpole",
      ""
    ],
    "answer": [
      "Added thyroxin speeds up the development of tadpoles",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "human_endocrine_system",
    "subtopic": "conclusion_from_results",
    "skills": [
      "draw_valid_conclusion"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 6,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- A conclusion must be supported by the results and must link the independent and the dependent variable."
  }
];

const aiExplanation = {
  sub_questions: [
    {
      "number": "2.5.1",
      "marks": 1,
      "clues": "- The dependent variable is what the scientists measured.",
      "approach": "- Read the procedure and find what was recorded each month.",
      "solution": "1. The height of the participants was measured and recorded, so the dependent variable is height."
    },
    {
      "number": "2.5.2",
      "marks": 3,
      "clues": "- Look for features shared by every participant, apart from the treatment.\n- Include the length of the study.",
      "approach": "- List the features that the two groups had in common.\n- Choose three that could have influenced height.",
      "solution": "1. All participants were boys (same gender).\n2. All participants had ISS and were two years old at the start (same age).\n3. The investigation lasted the same time for all participants."
    },
    {
      "number": "2.5.3",
      "marks": 2,
      "clues": "- Group B did not receive the hormone treatment.\n- Think about what the comparison allows the scientists to rule out.",
      "approach": "- Identify Group B as the control group.\n- State what a comparison with Group A shows.",
      "solution": "1. Group B is the control group.\n2. It shows that the change in height was caused by the added growth hormone and not by any other factor."
    },
    {
      "number": "2.5.4",
      "marks": 3,
      "clues": "- The dosage is given per kilogram of body weight.\n- The final answer needs a unit.",
      "approach": "- Multiply the dosage per kilogram by the boy's mass.\n- State the answer with the correct unit.",
      "solution": "1. Daily amount = 25 kg × 0,028 mg per kg.\n2. 25 × 0,028 = 0,7.\n3. The unit is mg: 0,7 mg per day."
    },
    {
      "number": "2.5.5",
      "marks": 2,
      "clues": "- A conclusion links the treatment to the result.",
      "approach": "- State what happened to the height of the boys given the hormone.\n- Link it to the added hormone.",
      "solution": "1. At 18 years the boys given the hormone were on average 8 cm taller than the boys who received none.\n2. Added growth hormone causes an increase in height of children with ISS."
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
