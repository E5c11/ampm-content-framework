#!/usr/bin/env node
/**
 * DBE Life Sciences P1 — November 2024 — Question 3.3 (Insulin Investigation) (order 15)
 *
 * Real Q3.3 (10 marks) is an investigation table of glucose and insulin levels at 0/60/90 min for two groups (X diabetic,
 * Y healthy): purpose of the control, two ways insulin lowers glucose, which group is healthy, and the data evidence. One
 * lesson (DESIGN-UNI-10 rule 1). Fresh data for persons P, Q, R and S are stated in each stem. Independent lesson; the
 * real 3.3.3→3.3.4 chain is asked as one question (identify and justify).
 *
 * Keyboard (KEYBOARD-04, core/keyboard-input.md): every typed fitb declares keyboard_type — standard_math for a bare
 * number, text for a single canonical term. The exam gate is derived from the rows by tools/apply-exam-gate.js (VER-09).
 * Do NOT copy a P2 2025 script as a template: those predate KEYBOARD-04 (tools/lib/legacy-keyboard-allowlist.js).
 * Reminder: don't factor shared text into an outer const used inside `questions` — validate-questions.js evals the
 * `questions = [...]` block in isolation.
 *
 *   node tools/validate-questions.js --script scripts/add-life-science-2024-nov-p1-q3-3-insulin-investigation.js --curriculum temp/curriculum-vocab-life-science-p1-2024.json
 *   node scripts/add-life-science-2024-nov-p1-q3-3-insulin-investigation.js --dry-run
 *   node scripts/add-life-science-2024-nov-p1-q3-3-insulin-investigation.js
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
  "name": "Question 3.3 (Insulin Investigation)",
  "syllabus": "dbe",
  "subject": "life_science",
  "year": 2024,
  "paper": "nov_p1",
  "order": 15,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "insulin",
    "blood_glucose",
    "diabetes_mellitus",
    "investigation_skills"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2024/nov_p1/q15/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2024/nov_p1/q15/memo_1.png"
  ],
  "exam_question_marks": 10
};

const questions = [
  {
    "name": "Question 1",
    "question": "Blood glucose was measured in mmol/ℓ at 0, 60 and 120 minutes after a glucose drink. Person P: 5.0, 7.4, 5.2. Person Q: 7.9, 12.6, 11.8. The normal fasting range is 3.9 to 5.6 mmol/ℓ. Which conclusion is supported?",
    "metadata": [
      "Person Q is healthy, because the level rises higher, showing a stronger response",
      "Person P is healthy, because the level starts and ends in the normal range",
      "Person P has diabetes, because the level rises after the glucose drink",
      "Both are healthy, because both levels rise after the glucose drink",
      ""
    ],
    "answer": [
      "Person P is healthy, because the level starts and ends in the normal range",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "interpretation",
    "unit": "life_processes_plants_animals",
    "topic": "homeostasis_in_humans",
    "subtopic": "untreated_diabetes_graph_evidence",
    "skills": [
      "interpret_graph_for_untreated_diabetes"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Compare each starting value with the normal range.\n- Then see whether each level comes back down."
  },
  {
    "name": "Question 2",
    "question": "Person Q's blood glucose level was 7.9 mmol/ℓ before a glucose drink and 12.6 mmol/ℓ 60 minutes after it. Calculate the increase in person Q's blood glucose level over the first 60 minutes.",
    "metadata": [
      "= ",
      "[ ]",
      " mmol/ℓ"
    ],
    "answer": [
      "4.7",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "calc",
    "unit": "life_processes_plants_animals",
    "topic": "homeostasis_in_humans",
    "subtopic": "glucose_change_calculation",
    "skills": [
      "calculate_glucose_level_change"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p1",
    "keyboard_type": "standard_math",
    "clues": "- Subtract the starting value from the later value."
  },
  {
    "name": "Question 3",
    "question": "Which of the following are ways in which insulin lowers the blood glucose level? Select ALL that apply.",
    "metadata": [
      "It stimulates the liver and muscles to convert glucose into glycogen",
      "It stimulates the liver to convert glycogen into glucose",
      "It increases the uptake of glucose from the blood into body cells",
      "It increases the rate at which cells use glucose in respiration",
      "It makes the kidneys excrete all the glucose in the urine"
    ],
    "answer": [
      "It stimulates the liver and muscles to convert glucose into glycogen",
      "It increases the uptake of glucose from the blood into body cells",
      "It increases the rate at which cells use glucose in respiration",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "definition",
    "unit": "life_processes_plants_animals",
    "topic": "homeostasis_in_humans",
    "subtopic": "insulin_mechanisms",
    "skills": [
      "identify_ways_insulin_lowers_glucose"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Insulin removes glucose from the blood.\n- One option describes the hormone with the opposite effect."
  },
  {
    "name": "Question 4",
    "question": "Scientists test whether a new tablet lowers blood glucose. Group 1 takes the tablet. Group 2 takes an identical tablet that contains no drug. What is the purpose of group 2?",
    "metadata": [
      "To make sure that more people take part in the investigation",
      "To show that any change in blood glucose is caused by the drug only",
      "To show that the drug works faster in some people than in others",
      "To make sure that both groups eat exactly the same amount of glucose each day",
      ""
    ],
    "answer": [
      "To show that any change in blood glucose is caused by the drug only",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "homeostasis_in_humans",
    "subtopic": "control_group_purpose",
    "skills": [
      "explain_purpose_of_control_group"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Group 2 is treated in every way like group 1 except for one factor."
  },
  {
    "name": "Question 5",
    "question": "After a glucose drink, person R's insulin level stays at about 3 mU/ℓ, while person S's insulin level rises from 7 to 150 mU/ℓ. Which conclusion is best supported?",
    "metadata": [
      "Person S has diabetes, because the insulin level rises too high",
      "Person R is healthy, because a steady insulin level keeps glucose stable",
      "Person S has diabetes, because insulin should rise only when glucose is low",
      "Person R has diabetes, because the pancreas does not respond to glucose",
      ""
    ],
    "answer": [
      "Person R has diabetes, because the pancreas does not respond to glucose",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "interpretation",
    "unit": "life_processes_plants_animals",
    "topic": "homeostasis_in_humans",
    "subtopic": "insulin_response_interpretation",
    "skills": [
      "interpret_insulin_response_data"
    ],
    "difficulty": 4,
    "exam_weight": 2,
    "xp": 10,
    "order": 5,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- A rise in blood glucose should trigger the pancreas.\n- Decide whose pancreas did not respond."
  }
];

const aiExplanation = {
  sub_questions: [
    {
      "number": "3.3.1",
      "marks": 2,
      "clues": "- The control is used for comparison.\n- Consider which factor the investigation is testing.",
      "approach": "- Identify the factor being investigated.\n- State why a comparison group is needed.",
      "solution": "1. The control group allows a comparison.\n2. It shows that the change in blood glucose levels was due to insulin only."
    },
    {
      "number": "3.3.2",
      "marks": 4,
      "clues": "- Insulin moves glucose out of the blood.\n- Think about the cells, the liver and respiration.",
      "approach": "- Describe what insulin does to the uptake of glucose by cells.\n- Describe what insulin makes the liver and muscles do.\n- Give the first two only.",
      "solution": "1. Insulin stimulates the absorption of glucose from the blood into the cells.\n2. Insulin stimulates the liver and muscles to convert glucose into glycogen.\n3. Also accepted: insulin increases cellular respiration, which uses up glucose."
    },
    {
      "number": "3.3.3",
      "marks": 1,
      "clues": "- Compare each group's starting glucose level with the normal range given.",
      "approach": "- Compare both groups with the normal glucose range.\n- Choose the group whose values behave normally.",
      "solution": "1. Group Y starts at 4,5 mmol/ℓ, inside the normal range, and returns to it.\n2. Group Y consists of the healthy individuals."
    },
    {
      "number": "3.3.4",
      "marks": 3,
      "clues": "- Use the glucose values at 0 and 90 minutes, and the insulin values.\n- Quote the data for the group you chose.",
      "approach": "- Compare the glucose level at 0 minutes with the normal range.\n- Compare the glucose level at 90 minutes.\n- Compare how the insulin levels change after glucose is taken.",
      "solution": "1. At 0 minutes the glucose level of group Y (4,5 mmol/ℓ) was in the normal range, but that of group X (6,8) was high.\n2. At 90 minutes the glucose level of group Y had returned to normal (4,5), while that of group X stayed high (8,7).\n3. After glucose was taken, the insulin level of group Y increased (8 to 142 mU/ℓ), while that of group X decreased (4 to 2)."
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
