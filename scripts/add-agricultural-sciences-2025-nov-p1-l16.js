#!/usr/bin/env node
/**
 * DBE Agricultural Sciences P1 — November 2025 — Question 4.4: Semen volume and sperm concentration (order 16)
 * Question 4.4 — reading a combined bar graph of semen volume and sperm concentration, the criteria for a correct graph and semen storage (five questions: graph skills and storage are separate concepts). Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-agricultural-sciences-2025-nov-p1-l16.js --curriculum temp/curriculum-vocab-agricultural-sciences.json
 *   node scripts/add-agricultural-sciences-2025-nov-p1-l16.js --dry-run
 *   node scripts/add-agricultural-sciences-2025-nov-p1-l16.js
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
  "name": "Question 4.4: Semen volume and sperm concentration",
  "syllabus": "dbe",
  "subject": "agricultural_sciences",
  "year": 2025,
  "paper": "nov_p1",
  "order": 16,
  "content_tier": "free",
  "has_video": false,
  "xp": 7,
  "tags": [
    "semen_evaluation",
    "semen_storage",
    "combined_bar_graphs"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p1/q16/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p1/q16/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p1/q16/memo_2.png"
  ],
  "exam_question_marks": 7,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Which graph is the best way to show the semen volume (mℓ) and the sperm cell concentration (billion/mℓ) of five farm animals side by side?",
    "metadata": [
      "A line graph that joins the animals in order",
      "A pie chart with a slice for each animal",
      "A combined bar graph with a key and units",
      "A histogram of the semen volume of one animal",
      ""
    ],
    "answer": [
      "A combined bar graph with a key and units",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "interpretation",
    "unit": "animal_reproduction",
    "topic": "semen_and_artificial_insemination",
    "subtopic": "agri_data_interpretation",
    "skills": [
      "interpret_agricultural_data"
    ],
    "difficulty": 3,
    "exam_weight": 1,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- The animals are separate categories and two variables are compared."
  },
  {
    "name": "Question 2",
    "question": "According to the graph, how many mℓ of semen does a bull produce per ejaculate? []",
    "metadata": [
      "Semen volume (mℓ): ",
      "[ ]"
    ],
    "answer": [
      "7",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "type": "reading",
    "unit": "animal_reproduction",
    "topic": "semen_and_artificial_insemination",
    "subtopic": "agri_data_interpretation",
    "skills": [
      "interpret_agricultural_data"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Find the group of bars for the bull and use the bar for semen volume.",
    "supplementary_material": {
      "type": "graph",
      "label": "Semen volume and sperm concentration per ejaculate in five farm animals (illustrative data)",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/agricultural_sciences/2025/nov_p1/q16/graph_1.png"
      ]
    }
  },
  {
    "name": "Question 3",
    "question": "Use the graph to calculate the number of sperm cells, in billions, in one ejaculate of the ram. (volume × concentration) []",
    "metadata": [
      "Sperm cells (billion): ",
      "[ ]"
    ],
    "answer": [
      "6",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "type": "calc",
    "unit": "animal_reproduction",
    "topic": "semen_and_artificial_insemination",
    "subtopic": "agri_data_interpretation",
    "skills": [
      "interpret_agricultural_data"
    ],
    "difficulty": 4,
    "exam_weight": 3,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Read both bars for the ram, using the key to tell them apart.\n- Multiply the two values.",
    "supplementary_material": {
      "type": "graph",
      "label": "Semen volume and sperm concentration per ejaculate in five farm animals (illustrative data)",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/agricultural_sciences/2025/nov_p1/q16/graph_1.png"
      ]
    }
  },
  {
    "name": "Question 4",
    "question": "Which conditions are needed to store collected bull semen for a long time?",
    "metadata": [
      "Cooled to 5 °C in an open cup",
      "Kept at room temperature with a dilutant",
      "Frozen at −196 °C in liquid nitrogen",
      "Frozen at −20 °C in a household freezer",
      ""
    ],
    "answer": [
      "Frozen at −196 °C in liquid nitrogen",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "animal_reproduction",
    "topic": "semen_and_artificial_insemination",
    "subtopic": "agri_scenario_application",
    "skills": [
      "apply_practice_to_scenario"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Long-term storage needs the lowest temperatures and a sealed container."
  },
  {
    "name": "Question 5",
    "question": "Select ALL the criteria that a correct combined bar graph of this data must meet.",
    "metadata": [
      "Bars joined into a smooth curve",
      "Both axes labelled with correct units",
      "Only one of the two variables plotted",
      "A key that shows which bars are which variable",
      "A heading that names both variables"
    ],
    "answer": [
      "A heading that names both variables",
      "Both axes labelled with correct units",
      "A key that shows which bars are which variable",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "animal_reproduction",
    "topic": "semen_and_artificial_insemination",
    "subtopic": "agri_data_interpretation",
    "skills": [
      "interpret_agricultural_data"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 5,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- The memo marks the heading, the labelled axes with units and the type of graph."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "4.4.1",
      "marks": 6,
      "clues": "- The memo awards marks for the heading, the axes, the units, the type of graph and accuracy.\n- Two variables are plotted on one graph.",
      "approach": "- Draw a combined bar graph with a heading that includes both variables.\n- Label the x-axis (farm animal) and a y-axis with calibrated values and units (mℓ and billion/mℓ).\n- Plot each value accurately with a key for the two variables.",
      "solution": "1. Correct heading with both variables (1).\n2. X-axis calibrated and labelled (1) and Y-axis calibrated and labelled (1).\n3. Correct units (1), combined bar graph (1) and accuracy of at least 80% (1)."
    },
    {
      "number": "4.4.2",
      "marks": 1,
      "clues": "- Think about equipment, a dilutant and temperature.\n- Give one requirement.",
      "approach": "- Recall how collected semen is stored.\n- Choose one requirement.",
      "solution": "1. Semen is stored with a dilutant, in sealed and labelled polyvinyl straws, at 5 °C for a short time or at −196 °C in liquid nitrogen for a long time."
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

  // Exam gate (VER-02/VER-04/VER-09): derive the exam minimum from the rows now in the database and write it. Dev only; no-op at the floor.
  if (!DRY_RUN && ENV === 'dev') {
    const { applyExamGates } = require('../tools/lib/exam-gate');
    await applyExamGates(pool, { env: ENV, apply: true, filter: { subject: video.subject, syllabus: video.syllabus, year: String(video.year) } });
  } else if (DRY_RUN) {
    console.log('   (dry-run: the exam gate is derived and written after a real upload — node tools/apply-exam-gate.js shows it)');
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
