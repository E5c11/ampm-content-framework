#!/usr/bin/env node
/**
 * DBE Life Sciences P1 — November 2024 — Question 2.5 (Structure of a Motor Neuron) (order 11)
 *
 * Real Q2.5 (8 marks) shows a myelinated and an unmyelinated motor neuron: name the type, give a visible reason, describe its
 * function, order A/B/C for the impulse direction, and name the disorder of myelin breakdown. One lesson (DESIGN-UNI-10
 * rule 1). Practice uses a sensory neuron and the other neuron types, with no figure (DESIGN-LIFE-03 option (i)).
 * Independent lesson.
 *
 * Keyboard (KEYBOARD-04, core/keyboard-input.md): every typed fitb declares keyboard_type — standard_math for a bare
 * number, text for a single canonical term. The exam gate is derived from the rows by tools/apply-exam-gate.js (VER-09).
 * Do NOT copy a P2 2025 script as a template: those predate KEYBOARD-04 (tools/lib/legacy-keyboard-allowlist.js).
 * Reminder: don't factor shared text into an outer const used inside `questions` — validate-questions.js evals the
 * `questions = [...]` block in isolation.
 *
 *   node tools/validate-questions.js --script scripts/add-life-science-2024-nov-p1-q2-5-motor-neuron.js --curriculum temp/curriculum-vocab-life-science-p1-2024.json
 *   node scripts/add-life-science-2024-nov-p1-q2-5-motor-neuron.js --dry-run
 *   node scripts/add-life-science-2024-nov-p1-q2-5-motor-neuron.js
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
  "name": "Question 2.5 (Structure of a Motor Neuron)",
  "syllabus": "dbe",
  "subject": "life_science",
  "year": 2024,
  "paper": "nov_p1",
  "order": 11,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "neuron_structure",
    "nervous_system"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2024/nov_p1/q11/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2024/nov_p1/q11/memo_1.png"
  ],
  "exam_question_marks": 8
};

const questions = [
  {
    "name": "Question 1",
    "question": "A neuron has a long dendron that carries impulses from a receptor in the skin, a cell body that lies to one side of the fibre, and a short axon that enters the spinal cord. Which type of neuron is it?",
    "metadata": [
      "Motor neuron",
      "Sensory neuron",
      "Interneuron (connector neuron)",
      "Mixed nerve",
      ""
    ],
    "answer": [
      "Sensory neuron",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "responding_to_environment_humans",
    "subtopic": "neuron_type_from_structure",
    "skills": [
      "classify_neuron_by_structure"
    ],
    "difficulty": 2,
    "exam_weight": 3,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Note where the impulse comes from and where it goes.\n- Note the position of the cell body."
  },
  {
    "name": "Question 2",
    "question": "Arrange the parts of a sensory neuron in the order in which an impulse travels through them.",
    "metadata": [
      "Cell body",
      "Axon terminals in the spinal cord",
      "Receptor end of the dendron",
      "Axon",
      "Dendron"
    ],
    "answer": [
      "Receptor end of the dendron",
      "Dendron",
      "Cell body",
      "Axon",
      "Axon terminals in the spinal cord"
    ],
    "presentation": "ordering",
    "type": "ordering",
    "unit": "life_processes_plants_animals",
    "topic": "responding_to_environment_humans",
    "subtopic": "impulse_path_through_sensory_neuron",
    "skills": [
      "sequence_impulse_through_neuron_parts"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- An impulse travels towards the cell body along one fibre and away from it along the other."
  },
  {
    "name": "Question 3",
    "question": "Match each type of neuron to its function.",
    "metadata": [
      "A - Sensory neuron",
      "B - Interneuron",
      "C - Motor neuron",
      "1 - Carries impulses from the central nervous system to effectors",
      "2 - Carries impulses from receptors to the central nervous system",
      "3 - Carries impulses from one neuron to another inside the central nervous system"
    ],
    "answer": [
      "A-2",
      "B-3",
      "C-1"
    ],
    "presentation": "match",
    "type": "definition",
    "unit": "life_processes_plants_animals",
    "topic": "responding_to_environment_humans",
    "subtopic": "neuron_type_functions",
    "skills": [
      "match_neuron_type_to_function"
    ],
    "difficulty": 2,
    "exam_weight": 3,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Think of the order of the neurons in a reflex arc."
  },
  {
    "name": "Question 4",
    "question": "In multiple sclerosis, the myelin sheaths around neurons are gradually destroyed. Which effect does this have?",
    "metadata": [
      "Impulses travel faster, so muscles contract all the time",
      "More neurotransmitter is released, so the memory fails",
      "Impulses slow down or are blocked, so movement becomes weak",
      "The cell bodies divide quickly, so tumours form in the brain",
      ""
    ],
    "answer": [
      "Impulses slow down or are blocked, so movement becomes weak",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "responding_to_environment_humans",
    "subtopic": "multiple_sclerosis_effects",
    "skills": [
      "explain_effect_of_myelin_loss"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Recall what the myelin sheath does for an impulse.\n- Losing it has the opposite effect."
  },
  {
    "name": "Question 5",
    "question": "Name the fatty layer that surrounds the axon of many neurons, insulates it and speeds up the impulse.",
    "metadata": [
      "[ ]"
    ],
    "answer": [
      "myelin sheath|myelin|myelin sheaths",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "definition",
    "unit": "life_processes_plants_animals",
    "topic": "responding_to_environment_humans",
    "subtopic": "myelin_sheath_term",
    "skills": [
      "name_myelin_sheath"
    ],
    "difficulty": 1,
    "exam_weight": 2,
    "xp": 10,
    "order": 5,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p1",
    "keyboard_type": "text",
    "clues": "- It is made by Schwann cells wrapped around the axon."
  }
];

const aiExplanation = {
  sub_questions: [
    {
      "number": "2.5.1",
      "marks": 1,
      "clues": "- Look at where the cell body is and how many dendrites there are.",
      "approach": "- Note the many short dendrites around the cell body.\n- Note the position of the cell body at one end of a long axon.",
      "solution": "1. The cell body is at one end, with many dendrites and a long axon.\n2. The neuron is a motor neuron."
    },
    {
      "number": "2.5.2",
      "marks": 1,
      "clues": "- Give a feature you can see in the diagram.",
      "approach": "- Choose one structural feature of a motor neuron.\n- Give only one.",
      "solution": "1. Any one: it has many dendrites (it is multipolar), its cell body is at one end, or its axon is long and its dendrites are short."
    },
    {
      "number": "2.5.3",
      "marks": 3,
      "clues": "- A motor neuron carries impulses to the part of the body that responds.",
      "approach": "- State what the neuron transmits.\n- State where the impulse comes from.\n- State where the impulse goes.",
      "solution": "1. It transmits impulses\n2. from the central nervous system (or an interneuron)\n3. to the effector (a muscle or gland)."
    },
    {
      "number": "2.5.4",
      "marks": 2,
      "clues": "- An impulse enters a neuron through its dendrites.\n- C is at the cell body end and B is at the far end of the axon.",
      "approach": "- Find the letter at the dendrites around the cell body.\n- Follow the axon to its terminal branches.",
      "solution": "1. The impulse enters at the dendrites (C), travels along the axon (A) and leaves at the axon terminals (B).\n2. The direction is C → A → B."
    },
    {
      "number": "2.5.5",
      "marks": 1,
      "clues": "- It is a disorder in which the myelin sheaths break down.",
      "approach": "- Recall the nervous system disorders in the syllabus.\n- Choose the one linked to loss of myelin.",
      "solution": "1. The disorder is multiple sclerosis (MS)."
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
