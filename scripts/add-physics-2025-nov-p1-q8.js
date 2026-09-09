#!/usr/bin/env node
/**
 * DBE Physical Sciences: Physics P1 — November 2025 — Question 8 (order 11)
 * Electric circuits: headlights, a starter motor, and a battery with internal
 * resistance, controlled by two switches. One continuous circuit/scenario across
 * 8.1-8.5 — bundled per DESIGN-UNI-10.
 *
 *   node tools/validate-questions.js --script scripts/add-physics-2025-nov-p1-q8.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-physics-2025-nov-p1-q8.js --dry-run
 *   node scripts/add-physics-2025-nov-p1-q8.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env') ? process.argv[process.argv.indexOf('--env') + 1] : 'dev';
const PAPER = 'https://media-dev.askmoreprepmore.app/exam_papers/dbe/physics/2025/nov_p1';

const video = {
  name: 'Question 8',
  syllabus: 'dbe',
  subject: 'physics',
  year: 2025,
  paper: 'nov_p1',
  order: 11,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['internal_resistance', 'circuit_analysis'],
  question_image_urls: [`${PAPER}/q8/question_1.png`],
  memo_image_urls: [`${PAPER}/q8/memo_1.png`, `${PAPER}/q8/memo_2.png`, `${PAPER}/q8/memo_3.png`],
  exam_question_marks: 20,
  supplementary_materials: [
    { type: 'formula_sheet', label: 'Formula Sheet', image_urls: [`${PAPER}/q0/question_1.png`, `${PAPER}/q0/question_2.png`, `${PAPER}/q0/question_3.png`] },
  ],
};

const questions = [
  {
    name: 'Question 1',
    question: 'Which ONE of the following statements correctly distinguishes EMF from terminal potential difference?',
    metadata: [
      'EMF is always less than the terminal potential difference.',
      'EMF is the total energy provided per coulomb of charge by the battery, while the terminal potential difference is the energy delivered to the external circuit per coulomb.',
      'EMF and terminal potential difference are always exactly equal.',
      'The terminal potential difference does not depend on the current flowing in the circuit.',
      '',
    ],
    answer: ['EMF is the total energy provided per coulomb of charge by the battery, while the terminal potential difference is the energy delivered to the external circuit per coulomb.', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'electricity_magnetism', topic: 'electric_circuits', subtopic: 'internal_resistance_circuits',
    skills: ['emf_definition', 'terminal_voltage'],
    difficulty: 3, exam_weight: 3, xp: 10, order: 1,
    syllabus: 'dbe', subject: 'physics', year: 2025, paper: 'nov_p1',
    clues: '- EMF accounts for energy used inside the battery (lost to internal resistance) as well as energy delivered externally.\n- The two are only equal when there is no current flowing, or no internal resistance.',
  },
  {
    name: 'Question 2',
    question: 'A resistor of resistance 8 Ω carries a current of 3 A. Calculate the potential difference across the resistor.',
    metadata: ['V = ', '[ ]', ' V'],
    answer: ['24', '', '', '', ''],
    presentation: 'fitb',
    type: 'calc',
    unit: 'electricity_magnetism', topic: 'electric_circuits', subtopic: 'internal_resistance_circuits',
    skills: ['circuit_current_calculation'],
    difficulty: 1, exam_weight: 3, xp: 10, order: 2,
    syllabus: 'dbe', subject: 'physics', year: 2025, paper: 'nov_p1',
    clues: '- Use Ohm’s law, V = IR.\n- Both values are given directly.',
  },
  {
    name: 'Question 3',
    question: 'A device dissipates 40 W of power while connected across a potential difference of 20 V. Calculate the current through the device.',
    metadata: ['I = ', '[ ]', ' A'],
    answer: ['2', '', '', '', ''],
    presentation: 'fitb',
    type: 'calc',
    unit: 'electricity_magnetism', topic: 'electric_circuits', subtopic: 'internal_resistance_circuits',
    skills: ['circuit_current_calculation'],
    difficulty: 2, exam_weight: 3, xp: 10, order: 3,
    syllabus: 'dbe', subject: 'physics', year: 2025, paper: 'nov_p1',
    clues: '- Power, potential difference, and current are related by P = VI.\n- Rearrange to make current the subject.',
  },
  {
    name: 'Question 4',
    question: 'Complete the working to find the internal resistance of a battery with EMF 20 V, which delivers a current of 5 A through an external resistance of 3.8 Ω.',
    metadata: ['ε = I(R + r)', '20 = 5(3.8 + r), so r (in Ω):', '[ ]'],
    answer: ['0.2'],
    presentation: 'steps',
    type: 'calc',
    unit: 'electricity_magnetism', topic: 'electric_circuits', subtopic: 'internal_resistance_circuits',
    skills: ['internal_resistance', 'emf_definition'],
    difficulty: 3, exam_weight: 3, xp: 10, order: 4,
    syllabus: 'dbe', subject: 'physics', year: 2025, paper: 'nov_p1',
    clues: '- Substitute the given EMF, current, and external resistance into ε = I(R + r).\n- Solve the resulting equation for r.',
  },
  {
    name: 'Question 5',
    question:
      'In a circuit, two resistors are connected in parallel with each other, and this combination is in series with a battery of internal resistance. A switch in series with one of the two parallel resistors, initially open, is now closed. How will the reading on an ammeter measuring the total circuit current be affected?',
    metadata: ['Increases', 'Decreases', 'Remains the same', 'Drops to zero', ''],
    answer: ['Increases', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'interpretation',
    unit: 'electricity_magnetism', topic: 'electric_circuits', subtopic: 'internal_resistance_circuits',
    skills: ['circuit_current_calculation', 'internal_resistance'],
    difficulty: 4, exam_weight: 3, xp: 10, order: 5,
    syllabus: 'dbe', subject: 'physics', year: 2025, paper: 'nov_p1',
    clues: '- Closing the switch adds another path in parallel, which changes the total external resistance.\n- Think about how adding a parallel resistor affects total resistance, and hence total current, for a fixed EMF and internal resistance.',
  },
];

const aiExplanation = {
  sub_questions: [
    {
      number: '8.1', marks: 2,
      clues: '- EMF is about total energy per unit charge supplied by the battery, not just the voltage measured externally.',
      approach: '- Recall what EMF measures: energy supplied per coulomb of charge.\n- State it as the maximum/total energy provided, not just the "voltage" of the battery.',
      solution: '1. EMF is the maximum/total energy provided/work done by a battery per unit/coulomb of charge passing through it.',
    },
    {
      number: '8.2', marks: 3,
      clues: '- With S₁ open, only the A₂/motor branch conducts — the voltmeter reads the potential difference across the external circuit.\n- Use R = V/I with the motor’s resistance and the given ammeter reading.',
      approach: '- Recognise that with S₁ open, current only flows through the ε/A₂/motor branch.\n- Use R = V/I with the motor’s resistance (0.1 Ω) and the current (120 A) to find the voltmeter reading.',
      solution: '1. R = V/I\n2. 0.1 = V/120\n3. V = 12 V',
    },
    {
      number: '8.3.1', marks: 3,
      clues: '- Use the power dissipated by L₁ (15 W) and its resistance (12 Ω) to find the current through it.\n- P = I²R is one way in; V = IR combined with P = VI is another.',
      approach: '- Write P = I²R for headlight L₁.\n- Substitute P = 15 W and R = 12 Ω.\n- Solve for I.',
      solution: '1. P = I²R\n2. 15 = I²(12)\n3. I = 1.12 A',
    },
    {
      number: '8.3.2', marks: 1,
      clues: '- With S₂ open, only L₁ and L₂ conduct (in parallel with each other), both carrying the same current since they’re identical.\n- Ammeter A₁ reads the total current from the battery, which splits between L₁ and L₂.',
      approach: '- Recognise that A₁ reads the total current, split equally between the two identical headlights.\n- Double the current found through L₁.',
      solution: '1. A₁ = (1.12)(2) = 2.24 A',
    },
    {
      number: '8.4', marks: 6,
      clues: '- Use ε = I(R + r) for both switch configurations (8.2 and 8.3.2), since the EMF is the same battery in both cases.\n- Two equations, two unknowns (ε and r) — solve them simultaneously.',
      approach: '- Write ε = I(R + r) for the S₁-closed/S₂-open case, using the total external resistance and A₁’s reading.\n- Write ε = I(R + r) for the S₁-open/S₂-closed case, using the motor’s resistance and A₂’s reading.\n- Set the two expressions for ε equal and solve for r, then substitute back for ε.',
      solution: '1. Case 1 (S₁ closed, S₂ open): Rₚ (L₁ ‖ L₂) = 6 Ω, so ε = 2.24(6 + r)\n2. Case 2 (S₁ open, S₂ closed): ε = 120(0.1 + r)\n3. Equating: 2.24(6 + r) = 120(0.1 + r)\n4. Solving: r = 0.012 Ω\n5. ε = 2.24(6 + 0.012) = 13.46 V (accept 13.42–13.47 V)',
    },
    {
      number: '8.5', marks: 5,
      clues: '- With both switches closed, all three branches (L₁, L₂, motor) now conduct — think about what this does to the total external resistance.\n- A₁ measures the current through the L₁/L₂ branch specifically, not the total circuit current.',
      approach: '- Determine how the total external resistance changes when the motor branch is added in parallel.\n- Work out how this affects the total current, and hence the internal voltage drop and the terminal (external) voltage.\n- Conclude how this affects the current through the L₁/L₂ branch specifically (what A₁ measures).',
      solution: '1. The reading on A₁ decreases.\n2. Adding the motor branch decreases the total external resistance, so total current increases.\n3. This increases the voltage drop across the internal resistance, decreasing the external (terminal) voltage.\n4. Since L₁ and L₂’s combined resistance is unchanged, a lower voltage across them means A₁’s reading decreases.',
    },
  ],
  model: 'claude-sonnet-5', generated_at: Date.now(), version: 2, reviewed: false,
  input_tokens: 0, output_tokens: 0, avg_rating: null, rating_count: null,
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
  upload().catch((err) => { console.error('\n❌ Upload failed:', err.message); process.exitCode = 1; }).finally(closePool);
}
