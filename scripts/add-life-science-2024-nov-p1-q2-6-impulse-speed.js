#!/usr/bin/env node
/**
 * DBE Life Sciences P1 — November 2024 — Question 2.6 (Myelination and Impulse Speed) (order 12)
 *
 * Real Q2.6 (6 marks): two line graphs of impulse speed against axon diameter (myelinated 5–30 µm, unmyelinated 200–1200 µm):
 * read the diameter at 20 m/s on each, compare the speeds and describe the relationship. One lesson (DESIGN-UNI-10 rule 1).
 * Practice uses a generated graph with fresh data (myelinated axons 2–12 µm, speed = 5 × diameter), uploaded to
 * question_supplementary/life_science/2024/nov_p1/q12/graph_1.png and checked against each stem. Independent lesson.
 *
 * Keyboard (KEYBOARD-04, core/keyboard-input.md): every typed fitb declares keyboard_type — standard_math for a bare
 * number, text for a single canonical term. The exam gate is derived from the rows by tools/apply-exam-gate.js (VER-09).
 * Do NOT copy a P2 2025 script as a template: those predate KEYBOARD-04 (tools/lib/legacy-keyboard-allowlist.js).
 * Reminder: don't factor shared text into an outer const used inside `questions` — validate-questions.js evals the
 * `questions = [...]` block in isolation.
 *
 *   node tools/validate-questions.js --script scripts/add-life-science-2024-nov-p1-q2-6-impulse-speed.js --curriculum temp/curriculum-vocab-life-science-p1-2024.json
 *   node scripts/add-life-science-2024-nov-p1-q2-6-impulse-speed.js --dry-run
 *   node scripts/add-life-science-2024-nov-p1-q2-6-impulse-speed.js
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
  "name": "Question 2.6 (Myelination and Impulse Speed)",
  "syllabus": "dbe",
  "subject": "life_science",
  "year": 2024,
  "paper": "nov_p1",
  "order": 12,
  "content_tier": "free",
  "has_video": false,
  "xp": 40,
  "tags": [
    "neuron_structure",
    "graph_skills"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2024/nov_p1/q12/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2024/nov_p1/q12/memo_1.png"
  ],
  "exam_question_marks": 6
};

const questions = [
  {
    "name": "Question 1",
    "question": "Use the graph. At what axon diameter does an impulse travel at 40 m/s?",
    "metadata": [
      "= ",
      "[ ]",
      " µm"
    ],
    "answer": [
      "8",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "reading",
    "unit": "life_processes_plants_animals",
    "topic": "responding_to_environment_humans",
    "subtopic": "impulse_speed_graph_reading",
    "skills": [
      "read_axon_diameter_from_graph"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p1",
    "keyboard_type": "standard_math",
    "supplementary_material": {
      "type": "graph",
      "label": "Impulse speed in myelinated axons",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/life_science/2024/nov_p1/q12/graph_1.png"
      ]
    },
    "clues": "- Find 40 on the vertical axis, move across to the line, then down."
  },
  {
    "name": "Question 2",
    "question": "Use the graph. By how much does the impulse speed increase when the axon diameter increases from 4 µm to 10 µm?",
    "metadata": [
      "= ",
      "[ ]",
      " m/s"
    ],
    "answer": [
      "30",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "calc",
    "unit": "life_processes_plants_animals",
    "topic": "responding_to_environment_humans",
    "subtopic": "impulse_speed_change_calculation",
    "skills": [
      "calculate_speed_change_from_graph"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p1",
    "keyboard_type": "standard_math",
    "supplementary_material": {
      "type": "graph",
      "label": "Impulse speed in myelinated axons",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/life_science/2024/nov_p1/q12/graph_1.png"
      ]
    },
    "clues": "- Read the speed at each diameter, then subtract."
  },
  {
    "name": "Question 3",
    "question": "Use the graph. Which statement describes the relationship between axon diameter and impulse speed in these axons?",
    "metadata": [
      "As the axon diameter increases, the impulse speed decreases",
      "The impulse speed stays the same at every axon diameter",
      "The impulse speed increases only up to 6 µm, then levels off",
      "As the axon diameter increases, the impulse speed increases",
      ""
    ],
    "answer": [
      "As the axon diameter increases, the impulse speed increases",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "interpretation",
    "unit": "life_processes_plants_animals",
    "topic": "responding_to_environment_humans",
    "subtopic": "axon_diameter_speed_relationship",
    "skills": [
      "describe_axon_diameter_speed_relationship"
    ],
    "difficulty": 2,
    "exam_weight": 3,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p1",
    "supplementary_material": {
      "type": "graph",
      "label": "Impulse speed in myelinated axons",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/life_science/2024/nov_p1/q12/graph_1.png"
      ]
    },
    "clues": "- Follow the line from left to right and see which way it goes."
  },
  {
    "name": "Question 4",
    "question": "A myelinated axon 10 µm wide conducts impulses at about 50 m/s, but an unmyelinated axon of the same width conducts them at only about 1 m/s. Which statements explain the difference? Select ALL that apply.",
    "metadata": [
      "The myelin sheath insulates the axon",
      "The unmyelinated axon has more dendrites, which slow the impulse",
      "The impulse jumps from one node of Ranvier to the next",
      "The myelin sheath releases neurotransmitter along the axon",
      "Myelinated axons are always much wider than unmyelinated ones"
    ],
    "answer": [
      "The myelin sheath insulates the axon",
      "The impulse jumps from one node of Ranvier to the next",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "responding_to_environment_humans",
    "subtopic": "myelination_speed_explanation",
    "skills": [
      "explain_myelinated_conduction_speed"
    ],
    "difficulty": 4,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- The two axons are the same width, so width cannot explain it.\n- Consider what the impulse does at the gaps in the sheath."
  }
];

const aiExplanation = {
  sub_questions: [
    {
      "number": "2.6.1(a)",
      "marks": 1,
      "clues": "- Use the myelinated-neuron graph.\n- Find 20 m/s on the vertical axis.",
      "approach": "- Move across from 20 m/s to the line.\n- Read the axon diameter below that point, with its unit.",
      "solution": "1. On the myelinated-neuron graph, 20 m/s matches the first point.\n2. The axon diameter is 5 µm."
    },
    {
      "number": "2.6.1(b)",
      "marks": 1,
      "clues": "- Use the unmyelinated-neuron graph.\n- Find 20 m/s on the vertical axis.",
      "approach": "- Move across from 20 m/s to the line.\n- Read the axon diameter below that point, with its unit.",
      "solution": "1. On the unmyelinated-neuron graph, 20 m/s matches the point above 800.\n2. The axon diameter is 800 µm."
    },
    {
      "number": "2.6.2(a)",
      "marks": 2,
      "clues": "- Compare the speed scales on the two graphs.",
      "approach": "- Compare the highest speeds on each graph.\n- State which type of neuron is faster.",
      "solution": "1. The myelinated neuron reaches 120 m/s, but the unmyelinated neuron reaches only 30 m/s, even with much wider axons.\n2. So the impulse speed is faster in a myelinated neuron than in an unmyelinated neuron."
    },
    {
      "number": "2.6.2(b)",
      "marks": 2,
      "clues": "- Both graphs slope the same way.",
      "approach": "- Describe how the speed changes as the diameter increases.\n- Name both variables in your answer.",
      "solution": "1. On both graphs the line rises from left to right.\n2. As the axon diameter increases, the impulse speed increases."
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
