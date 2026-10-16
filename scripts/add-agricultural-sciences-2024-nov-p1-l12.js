#!/usr/bin/env node
/**
 * DBE Agricultural Sciences P1 — November 2024 — Question 3.4–3.5: Combined bar graph of vital signs and giving medication (order 12)
 * Question 3.4–3.5 — the drawn combined bar graph is replaced by a supplied graph with fresh data (CLOSED-FIG-01): graph type, marking criteria and readings; then methods of giving medication. Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-agricultural-sciences-2024-nov-p1-l12.js --curriculum temp/curriculum-vocab-agricultural-sciences.json
 *   node scripts/add-agricultural-sciences-2024-nov-p1-l12.js --dry-run
 *   node scripts/add-agricultural-sciences-2024-nov-p1-l12.js
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
  "name": "Question 3.4–3.5: Combined bar graph of vital signs and giving medication",
  "syllabus": "dbe",
  "subject": "agricultural_sciences",
  "year": 2024,
  "paper": "nov_p1",
  "order": 12,
  "content_tier": "free",
  "has_video": false,
  "xp": 8,
  "tags": [
    "combined_bar_graphs",
    "administering_medication"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2024/nov_p1/q12/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2024/nov_p1/q12/memo_1.png"
  ],
  "exam_question_marks": 8,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "A learner must show the breathing rate and the heart rate of five farm animals on one graph. Which type of graph should she draw?",
    "metadata": [
      "A line graph joining the animals",
      "A separate pie chart per animal",
      "A histogram of the heart rates",
      "A combined bar graph with a key",
      ""
    ],
    "answer": [
      "A combined bar graph with a key",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "interpretation",
    "unit": "animal_production_protection_and_control",
    "topic": "vital_signs_of_farm_animals",
    "subtopic": "agri_data_interpretation",
    "skills": [
      "interpret_agricultural_data"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- The animals are separate categories, not a continuous scale.\n- Two variables must be compared for each animal."
  },
  {
    "name": "Question 2",
    "question": "Select ALL the features that a correct combined bar graph of this data must have.",
    "metadata": [
      "Data points joined by a smooth line",
      "A heading that names both variables",
      "A different scale for each animal",
      "Both axes labelled, with units",
      "A key that shows which bar is which"
    ],
    "answer": [
      "A heading that names both variables",
      "Both axes labelled, with units",
      "A key that shows which bar is which",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "animal_production_protection_and_control",
    "topic": "vital_signs_of_farm_animals",
    "subtopic": "agri_data_interpretation",
    "skills": [
      "interpret_agricultural_data"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Think about the marks for a drawn graph: heading, axes, units, type and accuracy."
  },
  {
    "name": "Question 3",
    "question": "According to the graph, what is the heart rate of the goat, in beats per minute? []",
    "metadata": [
      "Heart rate (per minute): ",
      "[ ]"
    ],
    "answer": [
      "90",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "type": "reading",
    "unit": "animal_production_protection_and_control",
    "topic": "vital_signs_of_farm_animals",
    "subtopic": "agri_data_interpretation",
    "skills": [
      "interpret_agricultural_data"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Use the key to find the heart rate bar.\n- Read across from the top of the bar to the vertical axis.",
    "supplementary_material": {
      "type": "graph",
      "label": "Breathing rate and heart rate of different farm animals (illustrative data)",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/agricultural_sciences/2024/nov_p1/q12/graph_1.png"
      ]
    }
  },
  {
    "name": "Question 4",
    "question": "According to the graph, which animal has the lowest breathing rate?",
    "metadata": [
      "Donkey",
      "Sheep",
      "Pig",
      "Cattle",
      ""
    ],
    "answer": [
      "Pig",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "reading",
    "unit": "animal_production_protection_and_control",
    "topic": "vital_signs_of_farm_animals",
    "subtopic": "agri_data_interpretation",
    "skills": [
      "interpret_agricultural_data"
    ],
    "difficulty": 1,
    "exam_weight": 1,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Compare only the bars for breathing rate.",
    "supplementary_material": {
      "type": "graph",
      "label": "Breathing rate and heart rate of different farm animals (illustrative data)",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/agricultural_sciences/2024/nov_p1/q12/graph_1.png"
      ]
    }
  },
  {
    "name": "Question 5",
    "question": "Match each method of giving medication to its description.",
    "metadata": [
      "A - Drenching",
      "B - Intramuscular injection",
      "C - Subcutaneous injection",
      "D - Pour-on",
      "1 - Liquid medicine poured into the mouth",
      "2 - Medicine injected into a muscle",
      "3 - Medicine injected just under the skin",
      "4 - Liquid applied along the back of the animal"
    ],
    "answer": [
      "A-1",
      "B-2",
      "C-3",
      "D-4"
    ],
    "presentation": "match",
    "type": "definition",
    "unit": "animal_production_protection_and_control",
    "topic": "medication_and_state_role",
    "subtopic": "agri_term_recall",
    "skills": [
      "recall_agricultural_term"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 5,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- \"Intra\" means inside; \"sub\" means under; \"cutaneous\" refers to the skin."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "3.4",
      "marks": 6,
      "clues": "- The animals are categories and two variables are plotted for each.\n- Marks go to the heading, axes, units, graph type and accuracy.",
      "approach": "- Draw a combined bar graph with the farm animals on the x-axis.\n- Calibrate the y-axis for body temperature and heartbeats, with units.\n- Give a heading with both variables and add a key.\n- Plot each value accurately.",
      "solution": "1. Heading: the body temperature and heartbeat of the different farm animals.\n2. X-axis: farm animals; y-axis: body temperature (°C) and heartbeat (per minute), correctly calibrated.\n3. Two bars per animal (combined bar graph) with a key.\n4. Values plotted accurately (horse 38/40, cattle 39/65, sheep 40/75, goat 41/75, pig 40/70)."
    },
    {
      "number": "3.5.1",
      "marks": 1,
      "clues": "- The medicine is liquid and given by mouth.",
      "approach": "- Recall the methods of giving medication.\n- Name the oral method for liquids.",
      "solution": "1. Dosing / drenching."
    },
    {
      "number": "3.5.2",
      "marks": 1,
      "clues": "- The medicine goes into the muscle with a needle.",
      "approach": "- Recall how medicine is placed into tissue.\n- Name the method.",
      "solution": "1. Injecting (intramuscular injection)."
    }
  ],
  "model": "claude-opus-5-5",
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

  // Exam gate (VER-02/VER-04, tools/apply-exam-gate.js): derive the exam's minimum app version from the rows now in the
  // database and write it to exam_versions, bumping updated_at on the exam's rows. Dev only; a no-op when the derived
  // minimum is the floor (VER-07); idempotent. The gate is per EXAM, so it also gates the sibling papers.
  if (!DRY_RUN && ENV === 'dev') {
    const { applyExamGates } = require('../tools/lib/exam-gate');
    await applyExamGates(pool, { env: ENV, apply: true, filter: { subject: video.subject, syllabus: video.syllabus, year: String(video.year) } });
  } else if (DRY_RUN) {
    console.log('   (dry-run: the exam gate is derived and written after a real upload — node tools/apply-exam-gate.js shows it)');
  }
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
