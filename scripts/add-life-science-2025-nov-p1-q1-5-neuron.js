#!/usr/bin/env node
/**
 * DBE Life Sciences P1 — November 2025 — Question 1.5 (Structure of a Neuron) (order 6)
 *
 * Real Q1.5 (8 marks) is one labelled sensory-neuron diagram with eight identify / give-the-letter items — DESIGN-UNI-10
 * rule 1, one lesson. Fresh practice questions test the same structure-to-function relationships by function, framed as
 * "what is lost if this part is damaged" and impulse pathway (DESIGN-UNI-08), with no figure (DESIGN-LIFE-03 option (i)).
 * Independent lesson.
 *
 * Keyboard (KEYBOARD-04, core/keyboard-input.md): every typed fitb declares keyboard_type — standard_math for a bare
 * number, text for a single canonical term (2.4.0; the 2025 exam is gated at 2.4.0 by tools/apply-exam-gate.js, VER-09).
 * Do NOT copy a P2 script as a template: those predate KEYBOARD-04 (tools/lib/legacy-keyboard-allowlist.js).
 * Reminder: don't factor shared text into an outer const used inside `questions` — validate-questions.js evals the
 * `questions = [...]` block in isolation.
 *
 *   node tools/validate-questions.js --script scripts/add-life-science-2025-nov-p1-q1-5-neuron.js --curriculum temp/curriculum-vocab-life-science-p1.json
 *   node scripts/add-life-science-2025-nov-p1-q1-5-neuron.js --dry-run
 *   node scripts/add-life-science-2025-nov-p1-q1-5-neuron.js
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
  "name": "Question 1.5 (Structure of a Neuron)",
  "syllabus": "dbe",
  "subject": "life_science",
  "year": 2025,
  "paper": "nov_p1",
  "order": 6,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "neuron_structure",
    "nervous_system",
    "synapse"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2025/nov_p1/q6/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2025/nov_p1/q6/memo_1.png"
  ],
  "exam_question_marks": 8
};

const questions = [
  {
    "name": "Question 1",
    "question": "Which type of neuron links a sensory neuron to a motor neuron inside the spinal cord?",
    "metadata": [
      "Sensory neuron",
      "Interneuron",
      "Motor neuron",
      "Receptor neuron",
      ""
    ],
    "answer": [
      "Interneuron",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "life_processes_plants_animals",
    "topic": "responding_to_environment_humans",
    "subtopic": "interneuron_role",
    "skills": [
      "identify_interneuron_role"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- It sits between the two other types and is found entirely within the central nervous system."
  },
  {
    "name": "Question 2",
    "question": "Match each part of a motor neuron to what the neuron loses if only that part is damaged.",
    "metadata": [
      "A - Dendrites",
      "B - Axon",
      "C - Myelin sheath",
      "D - Axon terminals",
      "1 - The neuron cannot receive impulses from other neurons",
      "2 - The impulse cannot be conducted away from the cell body",
      "3 - Impulses travel much more slowly along the axon",
      "4 - The neuron cannot pass the impulse on across the synapse"
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
    "topic": "responding_to_environment_humans",
    "subtopic": "neuron_part_damage_consequence",
    "skills": [
      "match_neuron_part_to_loss_of_function"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Decide whether each part receives, conducts, speeds up or passes on the impulse."
  },
  {
    "name": "Question 3",
    "question": "Which disorder is characterised by a progressive loss of memory and thinking ability because neurons in the brain degenerate?",
    "metadata": [
      "Multiple sclerosis",
      "Cataracts",
      "Diabetes mellitus",
      "Alzheimer's disease",
      ""
    ],
    "answer": [
      "Alzheimer's disease",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "life_processes_plants_animals",
    "topic": "responding_to_environment_humans",
    "subtopic": "alzheimers_disease_features",
    "skills": [
      "identify_neurodegenerative_disorder"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- The disorder affects neurons of the brain, not the sense organs or the pancreas.\n- Another disorder in this list affects the myelin sheath, not memory."
  },
  {
    "name": "Question 4",
    "question": "Name the tiny gap where the axon terminals of one neuron meet the next neuron or an effector.",
    "metadata": [
      "[ ]"
    ],
    "answer": [
      "synapse",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "definition",
    "unit": "life_processes_plants_animals",
    "topic": "responding_to_environment_humans",
    "subtopic": "synapse_term",
    "skills": [
      "name_neuron_junction"
    ],
    "difficulty": 1,
    "exam_weight": 1,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2025,
    "paper": "nov_p1",
    "keyboard_type": "text",
    "clues": "- Chemical messengers called neurotransmitters cross this gap."
  },
  {
    "name": "Question 5",
    "question": "Arrange the parts of a motor neuron in the order in which a nerve impulse passes through them.",
    "metadata": [
      "Axon",
      "Cell body",
      "Axon terminals",
      "Dendrites"
    ],
    "answer": [
      "Dendrites",
      "Cell body",
      "Axon",
      "Axon terminals"
    ],
    "presentation": "ordering",
    "type": "ordering",
    "unit": "life_processes_plants_animals",
    "topic": "responding_to_environment_humans",
    "subtopic": "impulse_path_through_motor_neuron",
    "skills": [
      "sequence_impulse_through_neuron_parts"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 5,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- The impulse enters at the branched endings and leaves at the other end of the neuron."
  }
];

const aiExplanation = {
  sub_questions: [
    {
      "number": "1.5.1",
      "marks": 1,
      "clues": "- The diagram shows the cell body to one side of a long axon, with an impulse travelling towards the central nervous system.",
      "approach": "- Look at the direction of the impulse.\n- Decide whether it travels towards or away from the CNS.",
      "solution": "1. The impulse travels from the receptor towards the spinal cord.\n2. This is a sensory neuron."
    },
    {
      "number": "1.5.2(a)",
      "marks": 1,
      "clues": "- It is the long fibre that carries the impulse along the neuron.",
      "approach": "- Trace the long process between the cell body and the endings.",
      "solution": "1. Part B is the axon."
    },
    {
      "number": "1.5.2(b)",
      "marks": 1,
      "clues": "- It is the swollen part that contains the nucleus.",
      "approach": "- Find the structure holding the nucleus.",
      "solution": "1. Part D is the cell body."
    },
    {
      "number": "1.5.2(c)",
      "marks": 1,
      "clues": "- These are short branched fibres that receive stimuli at the start of the pathway.",
      "approach": "- Find the branched endings where impulses enter.",
      "solution": "1. Part E is a dendrite."
    },
    {
      "number": "1.5.3(a)",
      "marks": 1,
      "clues": "- The genetic material is inside a structure within the cell body.",
      "approach": "- Recall which organelle holds DNA.\n- Find it in the diagram.",
      "solution": "1. The nucleus contains the genetic material of the neuron.\n2. The nucleus is labelled C."
    },
    {
      "number": "1.5.3(b)",
      "marks": 1,
      "clues": "- It is the fatty covering of the axon, shown in segments.",
      "approach": "- Recall which structure insulates the axon.\n- Find it in the diagram.",
      "solution": "1. The myelin sheath insulates the axon and speeds up impulse conduction.\n2. It is labelled F."
    },
    {
      "number": "1.5.3(c)",
      "marks": 1,
      "clues": "- It is the end of the neuron that meets the next neuron.",
      "approach": "- Find the terminal endings of the axon.\n- Recall that they form a synapse with the interneuron.",
      "solution": "1. The axon terminals make synaptic contact with an interneuron.\n2. They are labelled A."
    },
    {
      "number": "1.5.4",
      "marks": 1,
      "clues": "- The disorder involves loss of the covering that insulates the axon.",
      "approach": "- Identify part F as the myelin sheath.\n- Recall the disorder in which the myelin sheath degenerates.",
      "solution": "1. Part F is the myelin sheath.\n2. Degeneration of the myelin sheath is associated with multiple sclerosis."
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
