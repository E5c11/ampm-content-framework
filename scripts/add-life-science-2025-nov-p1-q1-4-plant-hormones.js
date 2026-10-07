#!/usr/bin/env node
/**
 * DBE Life Sciences P1 — November 2025 — Question 1.4 (Plant Hormones and Tropisms) (order 5)
 *
 * Real Q1.4 (8 marks) is one three-diagram figure (germinating seedlings, a plant bending towards a light opening, leaf fall)
 * with six label/identify items — DESIGN-UNI-10 rule 1, one lesson. Fresh practice questions describe the situations in
 * text (a tropism is a described response, so the text scenario loses nothing — DESIGN-LIFE-03 option (i)) and test the
 * same relationships: hormone <-> response, tropism naming, side of highest auxin, experiment design. Independent lesson.
 *
 * Keyboard (KEYBOARD-04, core/keyboard-input.md): every typed fitb declares keyboard_type — standard_math for a bare
 * number, text for a single canonical term (2.4.0; the 2025 exam is gated at 2.4.0 by tools/apply-exam-gate.js, VER-09).
 * Do NOT copy a P2 script as a template: those predate KEYBOARD-04 (tools/lib/legacy-keyboard-allowlist.js).
 * Reminder: don't factor shared text into an outer const used inside `questions` — validate-questions.js evals the
 * `questions = [...]` block in isolation.
 *
 *   node tools/validate-questions.js --script scripts/add-life-science-2025-nov-p1-q1-4-plant-hormones.js --curriculum temp/curriculum-vocab-life-science-p1.json
 *   node scripts/add-life-science-2025-nov-p1-q1-4-plant-hormones.js --dry-run
 *   node scripts/add-life-science-2025-nov-p1-q1-4-plant-hormones.js
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
  "name": "Question 1.4 (Plant Hormones and Tropisms)",
  "syllabus": "dbe",
  "subject": "life_science",
  "year": 2025,
  "paper": "nov_p1",
  "order": 5,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "plant_hormones",
    "tropisms",
    "auxins"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2025/nov_p1/q5/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2025/nov_p1/q5/memo_1.png"
  ],
  "exam_question_marks": 8
};

const questions = [
  {
    "name": "Question 1",
    "question": "A potted seedling is laid on its side in a dark cupboard. After a few days the tip of the shoot has curved upwards. Which response does this show?",
    "metadata": [
      "Positive geotropism (gravitropism)",
      "Positive phototropism",
      "Negative geotropism (gravitropism)",
      "Negative phototropism",
      ""
    ],
    "answer": [
      "Negative geotropism (gravitropism)",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "responding_to_environment_plants",
    "subtopic": "shoot_gravitropism_naming",
    "skills": [
      "name_shoot_gravitropic_response"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- There is no light in the cupboard, so decide which stimulus is acting.\n- Compare the direction of bending with the direction of the stimulus."
  },
  {
    "name": "Question 2",
    "question": "A seedling is lit only from the left. After some hours, which side of the stem has the higher auxin concentration and the faster cell growth?",
    "metadata": [
      "The left-hand side, which receives the light",
      "Both sides equally",
      "The right-hand side, which is in the shade",
      "Neither side, because auxins are made only in the roots",
      ""
    ],
    "answer": [
      "The right-hand side, which is in the shade",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "responding_to_environment_plants",
    "subtopic": "unilateral_light_auxin_distribution",
    "skills": [
      "locate_highest_auxin_side"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Auxins move away from the light before they stimulate growth."
  },
  {
    "name": "Question 3",
    "question": "Match each plant hormone to the response it controls.",
    "metadata": [
      "A - Auxins",
      "B - Gibberellins",
      "C - Abscisic acid",
      "D - Synthetic auxins",
      "1 - Make a shoot bend towards a one-sided light source",
      "2 - Promote stem elongation and the germination of seeds",
      "3 - Causes leaves to be shed before a dry or cold season",
      "4 - Used as selective weed killers on broad-leaved weeds"
    ],
    "answer": [
      "A-1",
      "B-2",
      "C-3",
      "D-4"
    ],
    "presentation": "match",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "responding_to_environment_plants",
    "subtopic": "plant_hormone_responses",
    "skills": [
      "match_plant_hormone_to_response"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Separate the hormones that promote growth from the one that triggers shedding."
  },
  {
    "name": "Question 4",
    "question": "A learner designs an investigation to show that shoots bend towards light. Which factors must be kept the same for all the seedlings?",
    "metadata": [
      "The species and age of the seedlings",
      "The amount of water the seedlings receive",
      "The direction from which the light shines",
      "The temperature of the room",
      "The angle through which each shoot bends"
    ],
    "answer": [
      "The species and age of the seedlings",
      "The amount of water the seedlings receive",
      "The temperature of the room",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "responding_to_environment_plants",
    "subtopic": "phototropism_investigation_controls",
    "skills": [
      "identify_controlled_variables_tropism"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- The variable you change and the variable you measure cannot be kept constant."
  },
  {
    "name": "Question 5",
    "question": "Arrange the events that make a shoot bend towards a light source in the correct order.",
    "metadata": [
      "The shaded side has a higher auxin concentration",
      "The shoot bends towards the light",
      "Cells on the shaded side grow faster",
      "Light reaches the shoot from one side only",
      "Auxins move to the shaded side of the shoot"
    ],
    "answer": [
      "Light reaches the shoot from one side only",
      "Auxins move to the shaded side of the shoot",
      "The shaded side has a higher auxin concentration",
      "Cells on the shaded side grow faster",
      "The shoot bends towards the light"
    ],
    "presentation": "ordering",
    "type": "ordering",
    "unit": "life_processes_plants_animals",
    "topic": "responding_to_environment_plants",
    "subtopic": "phototropism_mechanism_sequence",
    "skills": [
      "sequence_phototropic_bending"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 5,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- The stimulus comes first and the visible response comes last."
  }
];

const aiExplanation = {
  sub_questions: [
    {
      "number": "1.4.1(a)",
      "marks": 1,
      "clues": "- Look for the diagram that shows a structure being shed from the plant.",
      "approach": "- Recall the roles of the three plant hormones.\n- Find the diagram that shows a leaf detaching.",
      "solution": "1. Abscisic acid causes the shedding (abscission) of leaves.\n2. Diagram C shows a leaf falling off the stem.\n3. The answer is C."
    },
    {
      "number": "1.4.1(b)",
      "marks": 2,
      "clues": "- Auxins control directional growth responses called tropisms.\n- Two of the three diagrams show growth towards or away from a stimulus.",
      "approach": "- Recall that auxins control tropisms.\n- Identify which diagrams show a tropism, not germination or leaf fall.",
      "solution": "1. Diagram A shows roots growing downwards and shoots upwards: a geotropic response controlled by auxins.\n2. Diagram B shows a stem bending towards light: a phototropic response controlled by auxins.\n3. The answer is A and B."
    },
    {
      "number": "1.4.1(c)",
      "marks": 1,
      "clues": "- This hormone breaks dormancy so that seeds can start growing.",
      "approach": "- Recall the effect of gibberellins on seeds.\n- Find the diagram that shows seeds germinating.",
      "solution": "1. Gibberellins stimulate seed germination.\n2. Diagram A shows seeds that have germinated and developed into seedlings.\n3. The answer is A."
    },
    {
      "number": "1.4.2(a)",
      "marks": 1,
      "clues": "- Roots respond to gravity, not to light.",
      "approach": "- Identify the stimulus acting on the roots in diagram A.\n- Name the response using the stimulus.",
      "solution": "1. The roots grow downwards in the direction of gravity.\n2. This is geotropism (gravitropism)."
    },
    {
      "number": "1.4.2(b)",
      "marks": 1,
      "clues": "- The plant is growing inside a box with a single opening.",
      "approach": "- Identify the stimulus that the stem is responding to in diagram B.\n- Name the response.",
      "solution": "1. The stem bends towards the light entering through the opening.\n2. This is phototropism."
    },
    {
      "number": "1.4.3(a)",
      "marks": 1,
      "clues": "- Auxins move to the side away from the light.",
      "approach": "- Work out which side of the stem the light is NOT reaching.\n- Decide which side collects the auxins.",
      "solution": "1. Auxins accumulate on the shaded side of the stem.\n2. In diagram B this is side X.\n3. The answer is X."
    },
    {
      "number": "1.4.3(b)",
      "marks": 1,
      "clues": "- Auxins stimulate cell growth on the side where they are concentrated.",
      "approach": "- Link the auxin concentration to the rate of cell growth and division.\n- Use your answer to 1.4.3(a).",
      "solution": "1. The higher the auxin concentration, the faster the cell growth and division.\n2. The side with the highest auxin concentration is X, so the highest rate of cell division is also at X."
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
