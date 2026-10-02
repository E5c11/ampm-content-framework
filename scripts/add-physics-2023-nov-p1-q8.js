#!/usr/bin/env node
/**
 * DBE Physical Sciences: Physics P1 — November 2023 — Question 8 (order 11)
 * Electric circuits with internal resistance: Ohm's law, series-parallel resistance, current, power, effect of opening a switch.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-physics-2023-nov-p1-q8.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-physics-2023-nov-p1-q8.js --dry-run
 *   node scripts/add-physics-2023-nov-p1-q8.js
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
  name: 'Question 8',
  syllabus: 'dbe',
  subject: 'physics',
  year: 2023,
  paper: 'nov_p1',
  order: 11,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['circuit_analysis', 'internal_resistance', 'power'],
  question_image_urls: [`${PAPER}/q8/question_1.png`],
  memo_image_urls: [`${PAPER}/q8/memo_1.png`, `${PAPER}/q8/memo_2.png`, `${PAPER}/q8/memo_3.png`],
  exam_question_marks: 18,
  supplementary_materials: [FORMULA_SHEET],
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    name: 'Question 1',
    question:
      'At constant temperature, a learner plots the potential difference across a resistor (y-axis) against the current through it (x-axis). The result is a straight line through the origin. Which ONE of the following conclusions is CORRECT?',
    metadata: [
      'The resistor obeys Ohm’s law, and the gradient equals 1/R',
      'The resistor is non-ohmic, because V changes when I changes',
      'The resistor obeys Ohm’s law, and the gradient equals R',
      'The resistance increases steadily as the current increases',
      '',
    ],
    answer: ['The resistor obeys Ohm’s law, and the gradient equals R', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'interpretation',
    unit: 'electricity_magnetism', topic: 'electric_circuits', subtopic: 'ohms_law',
    skills: ['circuit_analysis', 'graph_gradient_interpretation'],
    difficulty: 3, exam_weight: 3, xp: 10, order: 1,
    syllabus: 'dbe', subject: 'physics', year: 2023, paper: 'nov_p1',
    clues:
      '- A straight line through the origin means the two quantities are directly proportional.\n- Gradient = Δy/Δx — check which quantity is on which axis.',
  },
  {
    name: 'Question 2',
    question:
      'Two 12 Ω resistors are connected in parallel. This combination is in series with a 6 Ω lamp. The whole branch is then connected in parallel with an 18 Ω resistor. Calculate the total resistance of this arrangement.',
    metadata: ['R = ', '[ ]', ' Ω'],
    answer: ['7.2', '', '', '', ''],
    presentation: 'fitb',
    type: 'calc',
    unit: 'electricity_magnetism', topic: 'electric_circuits', subtopic: 'series_parallel_combination',
    skills: ['series_parallel_resistance'],
    difficulty: 3, exam_weight: 3, xp: 10, order: 2,
    syllabus: 'dbe', subject: 'physics', year: 2023, paper: 'nov_p1',
    clues:
      '- Work from the inside out: combine the two parallel 12 Ω resistors first.\n- Add the lamp in series, then combine that branch in parallel with the 18 Ω resistor.',
  },
  {
    name: 'Question 3',
    question:
      'A battery with an emf of 6 V and an internal resistance of 0.4 Ω is connected to an external circuit with a total resistance of 4.4 Ω. Complete the working to calculate the current delivered by the battery.',
    metadata: ['ε = I(R + r)', '6 = I(4.4 + 0.4), so I (in A):', '[ ]'],
    answer: ['1.25'],
    presentation: 'steps',
    type: 'calc',
    unit: 'electricity_magnetism', topic: 'electric_circuits', subtopic: 'internal_resistance_circuits',
    skills: ['internal_resistance', 'circuit_current_calculation'],
    difficulty: 2, exam_weight: 3, xp: 10, order: 3,
    syllabus: 'dbe', subject: 'physics', year: 2023, paper: 'nov_p1',
    clues:
      '- Add the external and internal resistances inside the bracket first.\n- Then divide the emf by that total.',
  },
  {
    name: 'Question 4',
    question:
      'A total current of 2 A flows into two resistors connected in parallel: one of 20 Ω and one of 30 Ω. Calculate the power dissipated in the 30 Ω resistor.',
    metadata: ['P = ', '[ ]', ' W'],
    answer: ['19.2', '', '', '', ''],
    presentation: 'fitb',
    type: 'calc',
    unit: 'electricity_magnetism', topic: 'electric_circuits', subtopic: 'series_parallel_combination',
    skills: ['power_calculation', 'series_parallel_resistance'],
    difficulty: 4, exam_weight: 3, xp: 10, order: 4,
    syllabus: 'dbe', subject: 'physics', year: 2023, paper: 'nov_p1',
    clues:
      '- Find the effective resistance of the parallel pair, then the potential difference across it (V = IR).\n- Both resistors share that potential difference — use it to find the power in the 30 Ω resistor.',
  },
  {
    name: 'Question 5',
    question:
      'A battery with internal resistance is connected to two branches in parallel. A switch is opened, removing one of the branches. How do the total current from the battery and the battery’s terminal potential difference change?',
    metadata: [
      'Current increases; terminal potential difference decreases',
      'Current decreases; terminal potential difference stays the same',
      'Current decreases; terminal potential difference also decreases',
      'Current decreases; terminal potential difference increases',
      '',
    ],
    answer: ['Current decreases; terminal potential difference increases', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'interpretation',
    unit: 'electricity_magnetism', topic: 'electric_circuits', subtopic: 'internal_resistance_circuits',
    skills: ['internal_resistance', 'terminal_voltage'],
    difficulty: 4, exam_weight: 3, xp: 10, order: 5,
    syllabus: 'dbe', subject: 'physics', year: 2023, paper: 'nov_p1',
    clues:
      '- Removing a parallel branch changes the total external resistance.\n- The terminal potential difference is the emf minus the "lost volts" across the internal resistance (Ir).',
  },
  {
    name: 'Question 6',
    question:
      'In a circuit with a battery of constant emf and internal resistance, a switch is opened that removes one of two parallel branches. A bulb is in the other branch. Arrange the statements in the correct order to explain why the bulb becomes brighter.',
    metadata: [
      'The voltage lost across the internal resistance decreases',
      'The bulb dissipates more power and glows brighter',
      'The total external resistance increases',
      'The potential difference across the bulb’s branch increases',
      'The total current from the battery decreases',
    ],
    answer: [
      'The total external resistance increases',
      'The total current from the battery decreases',
      'The voltage lost across the internal resistance decreases',
      'The potential difference across the bulb’s branch increases',
      'The bulb dissipates more power and glows brighter',
    ],
    presentation: 'ordering',
    type: 'application',
    unit: 'electricity_magnetism', topic: 'electric_circuits', subtopic: 'internal_resistance_circuits',
    skills: ['brightness_current_relationship', 'internal_resistance'],
    difficulty: 3, exam_weight: 3, xp: 10, order: 6,
    syllabus: 'dbe', subject: 'physics', year: 2023, paper: 'nov_p1',
    clues:
      '- Start with what opening the switch does to the circuit’s resistance.\n- Then follow the chain: total current → lost volts (Ir) → potential difference across the bulb → power.',
  },
];

// ─── AI explanation (AMPM-CONTENT-AI-EXP) — one entry per exam sub-question ───

const aiExplanation = {
  sub_questions: [
    {
      number: '8.1',
      marks: 2,
      clues: '- Ohm’s law links potential difference and current.\n- It only holds under one condition — include it.',
      approach: '- State the relationship: the potential difference across a conductor is directly proportional to the current in it.\n- Add the condition: at constant temperature.',
      solution: '1. The potential difference across a conductor is directly proportional to the current in the conductor, at constant temperature.\n2. Also accepted: the current is directly proportional to the potential difference if temperature is constant, or the ratio V/I is constant at constant temperature.',
    },
    {
      number: '8.2.1',
      marks: 5,
      clues: '- With S closed, R₃ forms its own branch in parallel with the R₁/R₂/bulb branch.\n- Work from the innermost combination outwards.',
      approach: '- Combine R₁ and R₂ in parallel: 1/R = 1/10 + 1/10, giving 5 Ω.\n- Add the bulb in series: 5 + 10 = 15 Ω.\n- Combine this 15 Ω branch in parallel with R₃ = 15 Ω.',
      solution: '1. R₁ ∥ R₂: 1/R₁₂ = 1/10 + 1/10, so R₁₂ = 5 Ω.\n2. In series with the bulb: R₁₂ + Rₗ = 5 + 10 = 15 Ω.\n3. In parallel with R₃: 1/Rₚ = 1/15 + 1/15.\n4. Rₚ = 7.5 Ω — the total external resistance.',
    },
    {
      number: '8.2.2',
      marks: 3,
      clues: '- The ammeter reads the total current from the battery.\n- Include the internal resistance.',
      approach: '- Use ε = I(R + r).\n- Substitute ε = 12 V, R = 7.5 Ω (from 8.2.1) and r = 0.5 Ω.\n- Solve for I.',
      solution: '1. ε = I(R + r).\n2. 12 = I(7.5 + 0.5).\n3. I = 1.5 A.',
    },
    {
      number: '8.2.3',
      marks: 4,
      clues: '- First find the current through R₃ (or the potential difference across it).\n- The two parallel branches each have 15 Ω.',
      approach: '- The two parallel branches are equal (15 Ω each), so the 1.5 A splits equally: I(R₃) = 0.75 A.\n- Alternatively, V(ext) = IR = (1.5)(7.5) = 11.25 V across R₃.\n- Use P = I²R (or P = V²/R or P = VI) for R₃.',
      solution: '1. Both branches are 15 Ω, so the current splits equally: I(R₃) = 1.5/2 = 0.75 A.\n2. P = I²R.\n3. P = (0.75)²(15).\n4. P = 8.44 W.\n5. Check: V = (0.75)(15) = 11.25 V and P = V²/R = (11.25)²/15 = 8.44 W.',
    },
    {
      number: '8.3.1',
      marks: 1,
      clues: '- Opening S removes the R₃ branch.\n- Think about the total resistance, the total current and the lost volts.',
      approach: '- Decide what happens to the external resistance when the R₃ branch is removed.\n- Follow the effect through to the potential difference across the bulb’s branch.',
      solution: '1. Opening S removes a parallel branch, so the external resistance increases.\n2. This ends up increasing the potential difference across the bulb’s branch (see 8.3.2).\n3. Answer: INCREASES.',
    },
    {
      number: '8.3.2',
      marks: 3,
      clues: '- Start with the total resistance and total current.\n- Then use the lost volts (Ir) to explain the change in potential difference across the bulb.',
      approach: '- Total resistance increases, so the total current decreases.\n- The internal (lost) volts Ir decrease, so the external (terminal) voltage across the bulb’s branch increases.\n- The power of the bulb increases, so it is brighter.',
      solution: '1. Total resistance of the circuit increases, so the total current decreases.\n2. The internal (lost) volts decrease, so the external voltage across the bulb’s branch increases.\n3. The power output of the bulb increases, so its brightness increases.\n4. Alternative: ε = I(R + r) gives 12 = I(15 + 0.5), so I = 0.77 A — the bulb’s current has increased from 0.75 A, so its power and brightness increase.',
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
