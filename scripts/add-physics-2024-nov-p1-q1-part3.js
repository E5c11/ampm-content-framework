#!/usr/bin/env node
/**
 * DBE Physical Sciences: Physics P1 — November 2024 — Question 1.7–1.9 (order 3)
 * Q1 Electricity & Magnetism MCQs: charged spheres in equilibrium, the kilowatt-hour, DC motor commutator.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-physics-2024-nov-p1-q1-part3.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-physics-2024-nov-p1-q1-part3.js --dry-run
 *   node scripts/add-physics-2024-nov-p1-q1-part3.js
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
  name: 'Question 1.7–1.9',
  syllabus: 'dbe',
  subject: 'physics',
  year: 2024,
  paper: 'nov_p1',
  order: 3, // Q1 clustered by CAPS knowledge area (DESIGN-UNI-10) — part 3 of 4: Electricity & Magnetism
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['coulombs_law', 'electrical_energy', 'dc_motor'],
  question_image_urls: [`${PAPER}/q1/question_5.png`, `${PAPER}/q1/question_6.png`],
  memo_image_urls: [`${PAPER}/q1/memo_1.png`],
  exam_question_marks: 6,
  supplementary_materials: [FORMULA_SHEET],
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    name: 'Question 1',
    question:
      'Two identical small spheres, each of mass 0.02 kg and charge +Q, are placed in a vertical frictionless tube. The upper sphere floats at rest 0.05 m above the lower sphere. Calculate the magnitude of Q.',
    metadata: ['Q = ', '[ ]', ' × 10⁻⁷ C'],
    answer: ['2.33|2.333', '', '', '', ''],
    presentation: 'fitb',
    keyboard_type: 'standard_math',
    type: 'calc',
    unit: 'electricity_magnetism', topic: 'electrostatics', subtopic: 'coulombs_law',
    skills: ['coulombs_law', 'force_balance'],
    difficulty: 4, exam_weight: 3, xp: 10, order: 1,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p1',
    clues:
      '- The upper sphere is in equilibrium, so the electrostatic repulsion balances its weight.\n- Set \\frac{kQ²}{r²} equal to mg and solve for Q.',
  },
  {
    name: 'Question 2',
    question:
      'In the same set-up, the charge on EACH sphere is doubled while the masses stay the same. What is the new distance between the centres of the spheres when the upper one is at rest?',
    metadata: ['\\sqrt{2}r', '4r', '2r', '\\frac{1}{2}r', ''],
    answer: ['2r', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'electricity_magnetism', topic: 'electrostatics', subtopic: 'coulombs_law',
    skills: ['coulombs_law', 'inverse_square_relationship'],
    difficulty: 4, exam_weight: 3, xp: 10, order: 2,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p1',
    clues:
      '- The repulsive force must still equal mg, which has not changed.\n- Doubling both charges multiplies the product Q₁Q₂ by 4. How must r² change to keep the force the same?',
  },
  {
    name: 'Question 3',
    question: 'Match each unit to the physical quantity it measures.',
    metadata: [
      'A - Kilowatt-hour (kWh)',
      'B - Watt (W)',
      'C - Volt (V)',
      'D - Coulomb (C)',
      '1 - Electric charge',
      '2 - Electrical energy',
      '3 - Potential difference',
      '4 - Power',
    ],
    answer: ['A-2', 'B-4', 'C-3', 'D-1'],
    presentation: 'match',
    type: 'definition',
    unit: 'electricity_magnetism', topic: 'electric_circuits', subtopic: 'electrical_power_energy',
    skills: ['electrical_energy_units', 'power'],
    difficulty: 2, exam_weight: 2, xp: 10, order: 3,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p1',
    clues:
      '- A kilowatt-hour is a power multiplied by a time.\n- One volt is one joule per coulomb, and one watt is one joule per second.',
  },
  {
    name: 'Question 4',
    question:
      'A 2 kW kettle element is switched on for a total of 3 hours during a day. Calculate the electrical energy it uses, in joules.',
    metadata: ['W = ', '[ ]', ' × 10⁷ J'],
    answer: ['2.16', '', '', '', ''],
    presentation: 'fitb',
    keyboard_type: 'standard_math',
    type: 'calc',
    unit: 'electricity_magnetism', topic: 'electric_circuits', subtopic: 'electrical_power_energy',
    skills: ['electrical_energy_units', 'power_calculation'],
    difficulty: 3, exam_weight: 2, xp: 10, order: 4,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p1',
    clues:
      '- Energy = power × time (W = PΔt).\n- Convert to SI units first: kilowatts to watts, and hours to seconds.',
  },
  {
    name: 'Question 5',
    question:
      'In a working DC motor powered by a battery, the split-ring commutator is replaced by a pair of slip rings. What will happen to the coil?',
    metadata: [
      'It will rotate continuously, but in the opposite direction',
      'It will rock back and forth instead of rotating fully',
      'It will rotate continuously, but at twice the speed',
      'It will not experience any magnetic force at all',
      '',
    ],
    answer: ['It will rock back and forth instead of rotating fully', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'electricity_magnetism', topic: 'electrodynamics', subtopic: 'dc_motor_commutator',
    skills: ['commutator_function', 'dc_motor', 'torque_direction'],
    difficulty: 4, exam_weight: 3, xp: 10, order: 5,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p1',
    clues:
      '- The commutator reverses the current in the coil every half turn.\n- Without that reversal, what happens to the direction of the turning effect after the coil passes the vertical position?',
  },
];

// ─── AI explanation (AMPM-CONTENT-AI-EXP) — one entry per exam sub-question ───

const aiExplanation = {
  sub_questions: [
    {
      number: '1.7',
      marks: 2,
      clues: '- The top sphere is stationary, so the forces on it are balanced.\n- Which two forces act on the top sphere (friction is ignored)?',
      approach: '- Identify the forces on the upper sphere: its weight (down) and the electrostatic repulsion (up).\n- Set them equal: kQQ/r² = mg.\n- Rearrange for r.',
      solution: '1. Upper sphere: F(electrostatic) = w.\n2. kQ²/r² = mg.\n3. r² = kQ²/(mg).\n4. r = √(kQ²/(mg)).\n5. Answer: A.',
    },
    {
      number: '1.8',
      marks: 2,
      clues: '- A kilowatt is a unit of power, and an hour is a unit of time.\n- What do you get when you multiply power by time?',
      approach: '- Break the unit into kilowatt × hour.\n- Use W = PΔt: power × time = energy.\n- Choose the matching option.',
      solution: '1. kWh = kilowatt × hour.\n2. Power × time = energy (W = PΔt).\n3. 1 kWh = 1000 W × 3600 s = 3.6 × 10⁶ J, an amount of electrical energy.\n4. Answer: C — electrical energy.',
    },
    {
      number: '1.9',
      marks: 2,
      clues: '- A motor that runs from a battery (DC) needs a split-ring commutator, not slip rings.\n- Use the motor rule to find the force on each side of the coil.',
      approach: '- Identify the device: a DC motor, so the coil is connected through a commutator.\n- Use the current direction from the battery and the field from N to S to find the force on each side of the coil.\n- Decide the direction of rotation as seen from the battery.',
      solution: '1. The motor is powered by a battery (DC), so it uses a split-ring commutator. That rules out A and B.\n2. The field points from N to S. Applying the right-hand (motor) rule to each side of the coil with the current from the battery shows that the coil turns anti-clockwise when viewed from the battery.\n3. The commutator is fixed to the coil and turns with it.\n4. Answer: D — the coil and the commutator rotate anti-clockwise.',
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
