#!/usr/bin/env node
/**
 * DBE Physical Sciences: Physics P1 — November 2024 — Question 9 (order 12)
 * Electrodynamics: DC generator output graph, energy conversion, frequency, rms current, effect of rotation speed.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-physics-2024-nov-p1-q9.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-physics-2024-nov-p1-q9.js --dry-run
 *   node scripts/add-physics-2024-nov-p1-q9.js
 */

'use strict';


const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

const PAPER = 'https://media-dev.askmoreprepmore.app/exam_papers/dbe/physics/2024/nov_p1';
const FORMULA_SHEET = {
  type: 'formula_sheet',
  label: 'Formula Sheet',
  image_urls: [`${PAPER}/q0/question_1.png`, `${PAPER}/q0/question_2.png`, `${PAPER}/q0/question_3.png`],
};

// ─── Phase 2 — lesson document ───────────────────────────────────────────────

const video = {
  name: 'Question 9',
  syllabus: 'dbe',
  subject: 'physics',
  year: 2024,
  paper: 'nov_p1',
  order: 12,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['dc_generator', 'ac_generator'],
  question_image_urls: [`${PAPER}/q9/question_1.png`],
  memo_image_urls: [`${PAPER}/q9/memo_1.png`],
  exam_question_marks: 13,
  supplementary_materials: [FORMULA_SHEET],
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    name: 'Question 1',
    question:
      'A generator’s output current never changes direction. It rises from zero to a maximum and falls back to zero, over and over. Which component connects its coil to the external circuit?',
    metadata: ['A pair of slip rings', 'A step-up transformer', 'A split-ring commutator', 'A set of permanent magnets', ''],
    answer: ['A split-ring commutator', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'interpretation',
    unit: 'electricity_magnetism', topic: 'electrodynamics', subtopic: 'dc_generator',
    skills: ['generator_graph_interpretation', 'commutator_function'],
    difficulty: 2, exam_weight: 3, xp: 10, order: 1,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p1',
    clues:
      '- A current that never reverses direction is DC.\n- Which component reverses the coil’s connections every half turn so that the external current keeps one direction?',
  },
  {
    name: 'Question 2',
    question: 'Match each device to the main energy conversion that takes place while it operates.',
    metadata: [
      'A - Generator',
      'B - Electric motor',
      'C - Light bulb',
      'D - Battery being charged',
      '1 - Electrical to light (and thermal)',
      '2 - Electrical to chemical',
      '3 - Mechanical to electrical',
      '4 - Electrical to mechanical',
    ],
    answer: ['A-3', 'B-4', 'C-1', 'D-2'],
    presentation: 'match',
    type: 'definition',
    unit: 'electricity_magnetism', topic: 'electrodynamics', subtopic: 'dc_generator',
    skills: ['generator_energy_conversion', 'dc_motor'],
    difficulty: 1, exam_weight: 3, xp: 10, order: 2,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p1',
    clues:
      '- A generator and a motor do opposite jobs.\n- A battery being charged stores energy for later.',
  },
  {
    name: 'Question 3',
    question: 'Why is electricity from a DC generator NOT suitable for transmission over long distances?',
    metadata: [
      'DC current cannot flow through very long cables',
      'Transformers cannot step DC voltage up or down',
      'DC generators cannot produce large currents',
      'DC current makes the cables permanently magnetised',
      '',
    ],
    answer: ['Transformers cannot step DC voltage up or down', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'electricity_magnetism', topic: 'electrodynamics', subtopic: 'dc_generator',
    skills: ['generator_graph_interpretation'],
    difficulty: 3, exam_weight: 2, xp: 10, order: 3,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p1',
    clues:
      '- Energy lost in the cables is P = I²R, so transmission needs a very high voltage and a small current.\n- Which device changes the voltage, and what kind of current does it need?',
  },
  {
    name: 'Question 4',
    question:
      'A graph of a DC generator’s output shows identical current pulses, each lasting 0.025 s. The coil makes ONE complete rotation for every TWO pulses. Calculate the frequency at which the coil rotates.',
    metadata: ['f = ', '[ ]', ' Hz'],
    answer: ['20', '', '', '', ''],
    presentation: 'fitb',
    keyboard_type: 'standard_math',
    type: 'calc',
    unit: 'electricity_magnetism', topic: 'electrodynamics', subtopic: 'dc_generator',
    skills: ['period_frequency_relationship', 'generator_graph_interpretation'],
    difficulty: 3, exam_weight: 2, xp: 10, order: 4,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p1',
    clues:
      '- The period is the time for ONE full rotation, which is two pulses.\n- f = \\frac{1}{T}.',
  },
  {
    name: 'Question 5',
    question:
      'An AC heater draws an rms current of 3 A. The same heater is then connected to a DC supply. What DC current gives the SAME average rate of heating?',
    metadata: ['4.24 A', '2.12 A', '6 A', '3 A', ''],
    answer: ['3 A', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'electricity_magnetism', topic: 'electrodynamics', subtopic: 'ac_generator_rms',
    skills: ['rms_current'],
    difficulty: 3, exam_weight: 2, xp: 10, order: 5,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p1',
    clues:
      '- Think about what the rms value of an alternating current is DEFINED to be equal to.',
  },
  {
    name: 'Question 6',
    question: 'The maximum current delivered by a generator is 2.4 A. Calculate the root-mean-square current.',
    metadata: ['Iᵣₘₛ = ', '[ ]', ' A'],
    answer: ['1.70|1.697', '', '', '', ''],
    presentation: 'fitb',
    keyboard_type: 'standard_math',
    type: 'calc',
    unit: 'electricity_magnetism', topic: 'electrodynamics', subtopic: 'ac_generator_rms',
    skills: ['rms_current'],
    difficulty: 2, exam_weight: 3, xp: 10, order: 6,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p1',
    clues:
      '- Iᵣₘₛ = \\frac{I(max)}{\\sqrt{2}}.',
  },
  {
    name: 'Question 7',
    question:
      'After a change to a generator, its current-time graph shows a peak current that is HALF the original value, and each pulse now lasts TWICE as long. What change was made?',
    metadata: [
      'The number of turns on the coil was halved',
      'The coil was rotated at half its original speed',
      'The strength of the magnetic field was halved',
      'The coil was rotated at twice its original speed',
      '',
    ],
    answer: ['The coil was rotated at half its original speed', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'interpretation',
    unit: 'electricity_magnetism', topic: 'electrodynamics', subtopic: 'dc_generator',
    skills: ['generator_graph_interpretation', 'period_frequency_relationship'],
    difficulty: 4, exam_weight: 3, xp: 10, order: 7,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p1',
    clues:
      '- Halving the turns or the field strength lowers the peak but leaves the timing unchanged.\n- Which single change lowers the peak AND stretches the period?',
  },
];

// ─── AI explanation (AMPM-CONTENT-AI-EXP) — one entry per exam sub-question ───

const aiExplanation = {
  sub_questions: [
    {
      number: '9.1',
      marks: 1,
      clues: '- Look at the graph: does the current ever become negative?',
      approach: '- Check whether the current changes direction.\n- A current that stays in one direction (all humps above the axis) comes from a DC generator.',
      solution: '1. The current is always positive (it never reverses direction).\n2. Answer: DC generator.',
    },
    {
      number: '9.2',
      marks: 2,
      clues: '- A generator is driven by something turning its coil.\n- What form of energy comes out?',
      approach: '- State the input energy: mechanical (kinetic) energy of the rotating coil.\n- State the output: electrical energy.',
      solution: '1. Mechanical (kinetic) energy is converted to electrical energy. (2 or 0 marks.)',
    },
    {
      number: '9.3',
      marks: 1,
      clues: '- Long-distance transmission uses a very high voltage to keep the current, and so the energy losses, small.\n- What device changes the voltage?',
      approach: '- Link transmission losses to current (P = I²R).\n- Explain that DC cannot be stepped up or down by transformers, so the current cannot be made small.',
      solution: '1. The power (energy) loss cannot be reduced, because the current cannot be made smaller.\n2. Also accepted: transformers do not work with DC, so DC cannot be stepped up or down.',
    },
    {
      number: '9.4',
      marks: 2,
      clues: '- One rotation of a DC generator’s coil gives two humps on the graph.\n- From the graph, two rotations take 0.04 s.',
      approach: '- Read the period from the graph: T = 0.02 s (two humps).\n- Use f = 1/T.',
      solution: '1. T = 0.02 s.\n2. f = 1/T = 1/0.02 = 50 Hz.\n3. Also: f = number of cycles / time = 2/0.04 = 50 Hz.',
    },
    {
      number: '9.5',
      marks: 2,
      clues: '- The rms current is defined by comparing it with a direct current.\n- What must be the same for both?',
      approach: '- Say it is the alternating current value that dissipates the same amount of energy as an equivalent DC current.',
      solution: '1. The root-mean-square current is the alternating current that dissipates the same amount of energy as an equivalent DC current.\n2. Key words: "dissipates the same amount of energy", "equivalent DC".',
    },
    {
      number: '9.6',
      marks: 3,
      clues: '- Read the maximum current from the first graph: 1.2 A.\n- Iᵣₘₛ = I(max)/√2.',
      approach: '- Write Iᵣₘₛ = I(max)/√2.\n- Substitute I(max) = 1.2 A.\n- Calculate.',
      solution: '1. Iᵣₘₛ = I(max)/√2.\n2. Iᵣₘₛ = 1.2/√2.\n3. Iᵣₘₛ = 0.85 A.',
    },
    {
      number: '9.7',
      marks: 2,
      clues: '- Compare the two graphs: the peak dropped from 1.2 A to 0.6 A, and each hump now lasts twice as long.\n- One change causes both effects.',
      approach: '- Note the period has doubled, so the frequency (rotation speed) has halved.\n- A slower rotation also induces a smaller peak current.\n- State the change fully: the speed was HALVED.',
      solution: '1. The speed of rotation of the coil was halved.\n2. Also accepted: the frequency was halved, or the period was doubled.\n3. Saying only "slower" (without "halved") earns 1/2.',
    },
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
}

if (require.main === module) {
  upload()
    .catch((err) => {
      console.error('\n❌ Upload failed:', err.message);
      process.exitCode = 1;
    })
    .finally(closePool);
}
