#!/usr/bin/env node
/**
 * DBE Life Sciences P1 — November 2025 — Question 3.5 (Insulin, Glucose and Diabetes) (order 16)
 *
 * Real Q3.5 (10 marks) is a three-person blood-insulin line graph with five items (organ, meal count, TABULATE two differences, the
 * treatment like a healthy person, why a diabetic may lack energy). One lesson (DESIGN-UNI-10 rule 1). Fresh practice questions use a
 * NEW generated line graph — blood GLUCOSE of a healthy person and an untreated diabetic over a few hours, invented illustrative
 * data — and test reading it, glucagon vs insulin, treatment comparison (match, in place of tabulating — DESIGN-LIFE-04) and
 * diabetes facts. Independent lesson.
 *
 * Keyboard (KEYBOARD-04, core/keyboard-input.md): every typed fitb declares keyboard_type — standard_math for a bare
 * number, text for a single canonical term (2.4.0; the 2025 exam is gated at 2.4.0 by tools/apply-exam-gate.js, VER-09).
 * Do NOT copy a P2 script as a template: those predate KEYBOARD-04 (tools/lib/legacy-keyboard-allowlist.js).
 * Reminder: don't factor shared text into an outer const used inside `questions` — validate-questions.js evals the
 * `questions = [...]` block in isolation.
 *
 *   node tools/validate-questions.js --script scripts/add-life-science-2025-nov-p1-q3-5-insulin-diabetes.js --curriculum temp/curriculum-vocab-life-science-p1.json
 *   node scripts/add-life-science-2025-nov-p1-q3-5-insulin-diabetes.js --dry-run
 *   node scripts/add-life-science-2025-nov-p1-q3-5-insulin-diabetes.js
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
  "name": "Question 3.5 (Insulin, Glucose and Diabetes)",
  "syllabus": "dbe",
  "subject": "life_science",
  "year": 2025,
  "paper": "nov_p1",
  "order": 16,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "insulin",
    "diabetes_mellitus",
    "blood_glucose",
    "graph_skills"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2025/nov_p1/q16/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2025/nov_p1/q16/memo_1.png"
  ],
  "exam_question_marks": 10
};

const questions = [
  {
    "name": "Question 1",
    "question": "Use the graph to state the highest blood glucose concentration recorded for person Y, in mmol/ℓ.",
    "metadata": [
      "= ",
      "[ ]"
    ],
    "answer": [
      "18",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "human_endocrine_system",
    "subtopic": "glucose_graph_reading",
    "skills": [
      "read_peak_glucose_from_graph"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2025,
    "paper": "nov_p1",
    "keyboard_type": "standard_math",
    "clues": "- Find the highest point on the line for person Y and read across to the vertical axis.",
    "supplementary_material": {
      "type": "graph",
      "label": "Blood glucose concentration after a meal",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/life_science/2025/nov_p1/q16/graph_1.png"
      ]
    }
  },
  {
    "name": "Question 2",
    "question": "A learner has not eaten for many hours and her blood glucose concentration falls below normal. Which hormone is secreted in response and what does it cause the liver to do?",
    "metadata": [
      "Insulin, which causes the liver to convert glycogen to glucose",
      "Glucagon, which causes the liver to convert glucose to glycogen",
      "Glucagon, which causes the liver to convert glycogen to glucose",
      "Insulin, which causes the liver to convert glucose to glycogen",
      ""
    ],
    "answer": [
      "Glucagon, which causes the liver to convert glycogen to glucose",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "human_endocrine_system",
    "subtopic": "glucagon_function",
    "skills": [
      "explain_glucagon_response_to_low_glucose"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- The response must raise the blood glucose, so decide which hormone has that effect."
  },
  {
    "name": "Question 3",
    "question": "Match each situation to the description of how insulin is present in the blood.",
    "metadata": [
      "A - A healthy pancreas",
      "B - Rapid-acting insulin injected before a meal",
      "C - Long-acting insulin injected once a day",
      "D - No insulin and no treatment",
      "1 - Insulin secretion rises after a meal and then falls again",
      "2 - Insulin rises quickly and falls again after a few hours",
      "3 - A low, steady insulin level over many hours",
      "4 - Glucose stays high because it cannot be taken up and stored"
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
    "topic": "human_endocrine_system",
    "subtopic": "insulin_treatment_comparison",
    "skills": [
      "match_insulin_pattern_to_situation"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Think about whether the insulin level in each situation peaks, stays level or is absent."
  },
  {
    "name": "Question 4",
    "question": "Which feature of the graph shows that person Y's blood glucose is not being regulated properly?",
    "metadata": [
      "Blood glucose rises at the time of the meal",
      "Blood glucose stays high for hours after the meal instead of returning to the starting level",
      "Blood glucose is measured at the same times as for person X",
      "Blood glucose is recorded in mmol/ℓ",
      ""
    ],
    "answer": [
      "Blood glucose stays high for hours after the meal instead of returning to the starting level",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "human_endocrine_system",
    "subtopic": "untreated_diabetes_graph_evidence",
    "skills": [
      "interpret_graph_for_untreated_diabetes"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Compare how each line behaves in the hours after the peak.",
    "supplementary_material": {
      "type": "graph",
      "label": "Blood glucose concentration after a meal",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/life_science/2025/nov_p1/q16/graph_1.png"
      ]
    }
  },
  {
    "name": "Question 5",
    "question": "Which of the following statements about insulin and diabetes mellitus are correct?",
    "metadata": [
      "Insulin is secreted by the pancreas",
      "Insulin helps cells take up glucose and the liver store it as glycogen",
      "Insulin raises the blood glucose concentration",
      "Diabetes mellitus can be caused by too little insulin or cells that do not respond to it",
      "Glucagon is the hormone that people with diabetes inject before meals"
    ],
    "answer": [
      "Insulin is secreted by the pancreas",
      "Insulin helps cells take up glucose and the liver store it as glycogen",
      "Diabetes mellitus can be caused by too little insulin or cells that do not respond to it",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "human_endocrine_system",
    "subtopic": "insulin_diabetes_facts",
    "skills": [
      "identify_insulin_and_diabetes_facts"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 5,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Insulin and glucagon have opposite effects on blood glucose."
  }
];

const aiExplanation = {
  sub_questions: [
    {
      "number": "3.5.1",
      "marks": 1,
      "clues": "- The organ lies below the stomach and also secretes digestive enzymes.",
      "approach": "- Recall which gland secretes insulin.",
      "solution": "1. Insulin is secreted by the pancreas."
    },
    {
      "number": "3.5.2",
      "marks": 1,
      "clues": "- Each meal causes the insulin curve of the healthy person to rise.\n- Count the number of peaks on the line for person A.",
      "approach": "- Look at person A, the healthy person.\n- Count the times the insulin level rises sharply.",
      "solution": "1. The line for the healthy person (A) rises sharply at 08:00, 14:00 and 20:00.\n2. Each peak follows a meal, so three meals were eaten."
    },
    {
      "number": "3.5.3",
      "marks": 5,
      "clues": "- Compare the number and timing of injections.\n- Compare the insulin concentration and how long its effect lasts.",
      "approach": "- Draw a table with long-acting insulin and rapid-acting insulin as column headings.\n- Choose two differences that you can see in the graph.\n- Add a caption or heading to the table.",
      "solution": "1. Heading: \"Differences between long-acting and rapid-acting insulin treatment\".\n2. Long-acting: one injection is given over 23 hours; rapid-acting: three injections, one before each meal.\n3. Long-acting: injection at 23:00; rapid-acting: an injection before every meal.\n4. Long-acting: lower insulin concentration (about 10 units) that stays constant; rapid-acting: higher concentration (about 30 units) that rises and drops.\n5. Any two of these differences earn the marks."
    },
    {
      "number": "3.5.4",
      "marks": 1,
      "clues": "- The healthy person's insulin level rises and falls around each meal.",
      "approach": "- Compare the curve of person A with those of persons B and C.\n- Choose the treatment whose curve looks most similar.",
      "solution": "1. Person B's insulin curve rises before and after each meal like person A's.\n2. Rapid-acting insulin treatment is therefore the most similar to a healthy person."
    },
    {
      "number": "3.5.5",
      "marks": 2,
      "clues": "- Insulin lowers the blood glucose concentration.\n- Think about what cells need glucose for.",
      "approach": "- State what the insulin does to the glucose level when there is no meal.\n- Link the amount of glucose available to cellular respiration and energy.",
      "solution": "1. The insulin reduces the glucose level further: glucose is taken up by cells and converted to glycogen.\n2. Less glucose is available for cellular respiration, so less energy is released and the person feels weak."
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
