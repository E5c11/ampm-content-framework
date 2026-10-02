#!/usr/bin/env node
/**
 * DBE Physical Sciences: Physics P1 — November 2023 — Question 9 (order 12)
 * Electrodynamics: DC motor parts, rotation and speed; rms current and energy for AC appliances.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-physics-2023-nov-p1-q9.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-physics-2023-nov-p1-q9.js --dry-run
 *   node scripts/add-physics-2023-nov-p1-q9.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

const PAPER = 'https://media-dev.askmoreprepmore.app/exam_papers/dbe/physics/2023/nov_p1';
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
  year: 2023,
  paper: 'nov_p1',
  order: 12,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['dc_motor', 'ac_generator', 'power'],
  question_image_urls: [`${PAPER}/q9/question_1.png`, `${PAPER}/q9/question_2.png`],
  memo_image_urls: [`${PAPER}/q9/memo_1.png`, `${PAPER}/q9/memo_2.png`],
  exam_question_marks: 14,
  supplementary_materials: [FORMULA_SHEET],
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    name: 'Question 1',
    question: 'Match each part of a simple DC electric motor to its role.',
    metadata: [
      'A - Split-ring commutator',
      'B - Carbon brushes',
      'C - Permanent magnets',
      'D - The motor as a whole',
      '1 - Converts electrical energy into mechanical energy',
      '2 - Reverses the current in the coil every half turn',
      '3 - Provide the magnetic field the coil rotates in',
      '4 - Keep contact between the turning commutator and the circuit',
    ],
    answer: ['A-2', 'B-4', 'C-3', 'D-1'],
    presentation: 'match',
    type: 'definition',
    unit: 'electricity_magnetism', topic: 'electrodynamics', subtopic: 'dc_motor_commutator',
    skills: ['dc_motor', 'commutator_function'],
    difficulty: 2, exam_weight: 3, xp: 10, order: 1,
    syllabus: 'dbe', subject: 'physics', year: 2023, paper: 'nov_p1',
    clues:
      '- Think about which part rotates with the coil and which parts stay still.\n- A motor and a generator perform opposite energy conversions.',
  },
  {
    name: 'Question 2',
    question:
      'The coil of a DC motor rotates clockwise. BOTH the direction of the current AND the positions of the magnetic poles are now reversed. In which direction will the coil rotate?',
    metadata: ['Clockwise', 'Anticlockwise', 'It will not rotate', 'It will oscillate back and forth', ''],
    answer: ['Clockwise', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'electricity_magnetism', topic: 'electrodynamics', subtopic: 'dc_motor_commutator',
    skills: ['torque_direction', 'current_reversal_effect'],
    difficulty: 3, exam_weight: 2, xp: 10, order: 2,
    syllabus: 'dbe', subject: 'physics', year: 2023, paper: 'nov_p1',
    clues:
      '- The direction of the force on a current-carrying conductor depends on both the current direction and the field direction.\n- Think about what reversing one of them does, then what reversing the second does.',
  },
  {
    name: 'Question 3',
    question: 'Select ALL the changes that would make the coil of a DC motor rotate faster.',
    metadata: [
      'Increase the number of turns in the coil',
      'Reverse the battery connections',
      'Use stronger magnets',
      'Replace the split ring with slip rings',
      'Increase the current in the coil',
    ],
    answer: ['Increase the number of turns in the coil', 'Use stronger magnets', 'Increase the current in the coil', '', ''],
    presentation: 'multi_select',
    type: 'application',
    unit: 'electricity_magnetism', topic: 'electrodynamics', subtopic: 'dc_motor_commutator',
    skills: ['dc_motor'],
    difficulty: 2, exam_weight: 3, xp: 10, order: 3,
    syllabus: 'dbe', subject: 'physics', year: 2023, paper: 'nov_p1',
    clues:
      '- The turning effect on the coil depends on the field strength, the current and the amount of wire in the field.\n- Some changes only affect the direction of rotation, or stop continuous rotation.',
  },
  {
    name: 'Question 4',
    question:
      'An AC supply with an rms voltage of 230 V and a DC supply of 230 V are each connected across identical resistors. Which ONE of the following statements is CORRECT?',
    metadata: [
      'The AC resistor dissipates more power, as its peak voltage is higher',
      'The DC resistor dissipates more power, as AC is often near zero',
      'The two resistors dissipate the same average power',
      'The AC resistor dissipates \\sqrt{2} times more average power',
      '',
    ],
    answer: ['The two resistors dissipate the same average power', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'electricity_magnetism', topic: 'electrodynamics', subtopic: 'ac_generator_rms',
    skills: ['rms_potential_difference', 'power_calculation'],
    difficulty: 3, exam_weight: 3, xp: 10, order: 4,
    syllabus: 'dbe', subject: 'physics', year: 2023, paper: 'nov_p1',
    clues:
      '- Recall what an rms value is defined to be equivalent to.\n- Compare the heating effect of the AC with that of the DC.',
  },
  {
    name: 'Question 5',
    question: 'The maximum current in an AC circuit is 5.2 A. Calculate the rms current.',
    metadata: ['Iᵣₘₛ = ', '[ ]', ' A'],
    answer: ['3.68', '', '', '', ''],
    presentation: 'fitb',
    type: 'calc',
    unit: 'electricity_magnetism', topic: 'electrodynamics', subtopic: 'ac_generator_rms',
    skills: ['rms_potential_difference'],
    difficulty: 1, exam_weight: 3, xp: 10, order: 5,
    syllabus: 'dbe', subject: 'physics', year: 2023, paper: 'nov_p1',
    clues: '- The rms and maximum values of a sinusoidal current are linked by a factor of \\sqrt{2}.\n- The rms value is the smaller of the two.',
  },
  {
    name: 'Question 6',
    question:
      'A heater connected to a 230 V rms supply draws an rms current of 4.5 A. Complete the working to calculate the energy it uses in 5 minutes.',
    metadata: ['W = VᵣₘₛIᵣₘₛΔt, with Δt = 5 × 60 = 300 s', 'W = (230)(4.5)(300), so W (in J):', '[ ]'],
    answer: ['310500'],
    presentation: 'steps',
    type: 'calc',
    unit: 'electricity_magnetism', topic: 'electrodynamics', subtopic: 'ac_generator_rms',
    skills: ['power_calculation', 'rms_potential_difference'],
    difficulty: 2, exam_weight: 3, xp: 10, order: 6,
    syllabus: 'dbe', subject: 'physics', year: 2023, paper: 'nov_p1',
    clues: '- Multiply the three values together.\n- Type the full number without spaces or scientific notation.',
  },
];

// ─── AI explanation (AMPM-CONTENT-AI-EXP) — one entry per exam sub-question ───

const aiExplanation = {
  sub_questions: [
    {
      number: '9.1.1',
      marks: 1,
      clues: '- Component A rotates with the coil and connects it to the battery.\n- It is made of two half-rings.',
      approach: '- Look at where A sits: at the end of the coil, touching the brushes.\n- Recall the name of the split ring used in a DC motor.',
      solution: '1. A is the split ring (commutator).\n2. It reverses the current in the coil every half turn so the coil keeps turning in one direction.',
    },
    {
      number: '9.1.2',
      marks: 1,
      clues: '- What goes into a motor, and what comes out?\n- A generator does the opposite.',
      approach: '- Identify the input energy (from the battery).\n- Identify the output (the rotating coil).',
      solution: '1. A motor converts electrical energy into mechanical (kinetic) energy.',
    },
    {
      number: '9.1.3',
      marks: 2,
      clues: '- Use the direction of the magnetic field (N to S) and the direction of the current in each side of the coil.\n- Apply the motor rule (right-hand or left-hand rule) to each side.',
      approach: '- Draw the field from the N pole to the S pole.\n- Use the battery’s polarity to find the direction of current in each side of the coil.\n- Apply the motor rule to find the force on each side, and deduce the rotation.',
      solution: '1. The magnetic field runs from N to S across the coil.\n2. Using the battery’s polarity and the motor rule, the forces on the two sides of the coil are equal and opposite, forming a turning effect.\n3. These forces turn the coil clockwise.\n4. Answer: CLOCKWISE.',
    },
    {
      number: '9.1.4',
      marks: 2,
      clues: '- The turning effect depends on the field, the current and the coil.\n- Give two different changes.',
      approach: '- List factors that increase the force on the coil: field strength, current, coil area, number of turns.\n- Choose any two.',
      solution: '1. Any two of the following:\n2. Increase the strength of the magnetic field (stronger magnets / magnets closer together).\n3. Increase the current (battery with a higher emf / more cells in series).\n4. Increase the area of the coil.\n5. Increase the number of turns in the coil.',
    },
    {
      number: '9.2.1',
      marks: 2,
      clues: '- An rms current is compared with a DC current.\n- The comparison is about energy (heating effect).',
      approach: '- State that it is an alternating current.\n- State that it dissipates the same amount of energy (heating effect) as an equivalent direct current.',
      solution: '1. The rms current is the alternating current that dissipates the same amount of energy (heating effect) as an equivalent direct current.\n2. Leaving out "energy"/"heating effect" scores 0/2.',
    },
    {
      number: '9.2.2',
      marks: 3,
      clues: '- Only the kettle is connected, and you are given the maximum current.\n- Use the formula linking Iᵣₘₛ and Iₘₐₓ.',
      approach: '- Use Iᵣₘₛ = Iₘₐₓ/√2.\n- Substitute Iₘₐₓ = 3.6 A.',
      solution: '1. Iᵣₘₛ = Iₘₐₓ/√2.\n2. Iᵣₘₛ = 3.6/√2.\n3. Iᵣₘₛ = 2.55 A.',
    },
    {
      number: '9.2.3',
      marks: 3,
      clues: '- Convert two minutes into seconds.\n- Use the rms voltage and rms current with the time.',
      approach: '- Use W = VIΔt with rms values: V = 220 V, I = 2.62 A.\n- Δt = 2 × 60 = 120 s.\n- Multiply to find the energy.',
      solution: '1. W = VIΔt.\n2. W = (220)(2.62)(120).\n3. W = 69 168 J (6.92 × 10⁴ J).\n4. Equivalent routes: Pₐᵥₑ = VᵣₘₛIᵣₘₛ = 576.4 W, then W = PΔt = (576.4)(120).',
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
