#!/usr/bin/env node
/**
 * DBE Physical Sciences: Physics P1 — November 2024 — Question 8 (order 11)
 * Electric circuits: rated bulbs in parallel branches, internal resistance, emf, effect of a bulb burning out.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-physics-2024-nov-p1-q8.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-physics-2024-nov-p1-q8.js --dry-run
 *   node scripts/add-physics-2024-nov-p1-q8.js
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
  name: 'Question 8',
  syllabus: 'dbe',
  subject: 'physics',
  year: 2024,
  paper: 'nov_p1',
  order: 11,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['circuit_analysis', 'internal_resistance', 'power'],
  question_image_urls: [`${PAPER}/q8/question_1.png`],
  memo_image_urls: [`${PAPER}/q8/memo_1.png`, `${PAPER}/q8/memo_2.png`],
  exam_question_marks: 21,
  supplementary_materials: [FORMULA_SHEET],
};

// Shared circuit description for questions 2-7 (inlined per question — validate-questions.js
// evaluates the questions array in isolation, so no shared consts inside it).
// Battery (emf ε, internal resistance 0.5 Ω) in series with R₂ = 2 Ω and a parallel pair of
// branches: branch 1 = bulb L₂ (18 W ; 12 V) alone; branch 2 = resistor R₁ in series with
// bulb L₁ (12 W ; 6 V). Ammeter A₁ in the main line.

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    name: 'Question 1',
    question: 'A light bulb is rated 60 W ; 230 V. What does the 60 W rating tell you about the bulb?',
    metadata: [
      'It draws a current of 60 A when connected to 230 V',
      'It transfers 60 J of energy every second when connected to 230 V',
      'It transfers 60 J of energy per coulomb when connected to 230 V',
      'It uses 60 J of energy in total when connected to 230 V',
      '',
    ],
    answer: ['It transfers 60 J of energy every second when connected to 230 V', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'definition',
    unit: 'electricity_magnetism', topic: 'electric_circuits', subtopic: 'electrical_power_energy',
    skills: ['power'],
    difficulty: 2, exam_weight: 3, xp: 10, order: 1,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p1',
    clues:
      '- Power is a RATE: how quickly energy is transferred.\n- Energy per coulomb is a different quantity — that is potential difference.',
  },
  {
    name: 'Question 2',
    question:
      'In a circuit, bulb L₂ (rated 18 W ; 12 V) is in one parallel branch on its own, with ammeter A₂ in series with it. Both bulbs in the circuit operate as rated. Calculate the reading on ammeter A₂.',
    metadata: ['I = ', '[ ]', ' A'],
    answer: ['1.5', '', '', '', ''],
    presentation: 'fitb',
    keyboard_type: 'standard_math',
    type: 'calc',
    unit: 'electricity_magnetism', topic: 'electric_circuits', subtopic: 'electrical_power_energy',
    skills: ['power_calculation', 'circuit_current_calculation'],
    difficulty: 2, exam_weight: 3, xp: 10, order: 2,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p1',
    clues:
      '- “Operating as rated” means the bulb has exactly its rated voltage across it and uses exactly its rated power.\n- Use P = VI.',
  },
  {
    name: 'Question 3',
    question:
      'The other parallel branch contains resistor R₁ in series with bulb L₁ (rated 12 W ; 6 V). Bulb L₂ in the first branch draws 1.5 A. Both bulbs operate as rated. Calculate the reading on ammeter A₁, which is in the main line of the circuit.',
    metadata: ['I = ', '[ ]', ' A'],
    answer: ['3.5', '', '', '', ''],
    presentation: 'fitb',
    keyboard_type: 'standard_math',
    type: 'calc',
    unit: 'electricity_magnetism', topic: 'electric_circuits', subtopic: 'series_parallel_combination',
    skills: ['circuit_current_calculation', 'power_calculation', 'series_parallel_resistance'],
    difficulty: 3, exam_weight: 3, xp: 10, order: 3,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p1',
    clues:
      '- Find the current through L₁ from its rating. That is also the current through R₁, since they are in series.\n- The main-line current is the sum of the branch currents.',
  },
  {
    name: 'Question 4',
    question:
      'In the same circuit, branch 1 is bulb L₂ (18 W ; 12 V) and branch 2 is resistor R₁ in series with bulb L₁ (12 W ; 6 V). Both bulbs operate as rated. Complete the working to calculate the resistance of R₁.',
    metadata: [
      'The branches are in parallel, so the potential difference across branch 2 equals that across L₂: 12 V',
      'V_{R1} = 12 − 6 = 6 V, and the current through L_{1} (and R_{1}) is I = \\frac{P}{V} = \\frac{12}{6} = 2 A',
      'R_{1} = \\frac{V_{R1}}{I}, so R_{1} (in Ω):',
      '[ ]',
    ],
    answer: ['3'],
    presentation: 'steps',
    keyboard_type: 'physics',
    type: 'calc',
    unit: 'electricity_magnetism', topic: 'electric_circuits', subtopic: 'ohms_law',
    skills: ['circuit_analysis', 'series_parallel_resistance'],
    difficulty: 3, exam_weight: 3, xp: 10, order: 4,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p1',
    clues:
      '- Parallel branches always have the same potential difference across them.\n- Divide the voltage across R₁ by the current through it.',
  },
  {
    name: 'Question 5',
    question:
      'In the same circuit, the parallel branches (12 V across them) are in series with resistor R₂ = 2 Ω and a battery of internal resistance 0.5 Ω. The total current is 3.5 A. Complete the working to calculate the emf of the battery.',
    metadata: [
      'Potential difference across R₂: V = IR = (3.5)(2) = 7 V',
      'External potential difference: V_{ext} = 12 + 7 = 19 V',
      'ε = V_{ext} + Ir = 19 + (3.5)(0.5), so ε (in V, to two decimal places):',
      '[ ]',
    ],
    answer: ['20.75'],
    presentation: 'steps',
    keyboard_type: 'physics',
    type: 'calc',
    unit: 'electricity_magnetism', topic: 'electric_circuits', subtopic: 'internal_resistance_circuits',
    skills: ['internal_resistance', 'emf_definition', 'terminal_voltage'],
    difficulty: 4, exam_weight: 3, xp: 10, order: 5,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p1',
    clues:
      '- The emf equals the sum of all the potential differences around the circuit, including the “lost volts” inside the battery (Ir).',
  },
  {
    name: 'Question 6',
    question:
      'Bulb L₁ in the same circuit (emf 20.75 V, internal resistance 0.5 Ω, R₂ = 2 Ω) burns out, so branch 2 carries no current. Bulb L₂ (18 W ; 12 V) keeps a constant resistance. Calculate the new current through L₂.',
    metadata: ['I = ', '[ ]', ' A'],
    answer: ['1.98|1.976', '', '', '', ''],
    presentation: 'fitb',
    keyboard_type: 'standard_math',
    type: 'calc',
    unit: 'electricity_magnetism', topic: 'electric_circuits', subtopic: 'internal_resistance_circuits',
    skills: ['internal_resistance', 'circuit_current_calculation', 'power_calculation'],
    difficulty: 4, exam_weight: 3, xp: 10, order: 6,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p1',
    clues:
      '- First find the resistance of L₂ from its rating, using P = \\frac{V²}{R}.\n- Now L₂, R₂ and the internal resistance are all in series: ε = I(R + r).',
  },
  {
    name: 'Question 7',
    question:
      'After L₁ burns out, the current through L₂ (rated 18 W ; 12 V) rises from 1.5 A to about 1.98 A. Its resistance stays constant. Which statement about the power L₂ now dissipates is CORRECT?',
    metadata: [
      'It is still 18 W, since a bulb’s power rating is fixed',
      'It is about 12 W, lower than before, so L₂ now glows dimmer',
      'It is about 31 W, over its 18 W rating, so L₂ may burn out',
      'It is zero, because the circuit through L₂ is now open',
      '',
    ],
    answer: ['It is about 31 W, over its 18 W rating, so L₂ may burn out', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'electricity_magnetism', topic: 'electric_circuits', subtopic: 'internal_resistance_circuits',
    skills: ['power_calculation', 'brightness_current_relationship', 'power'],
    difficulty: 3, exam_weight: 3, xp: 10, order: 7,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p1',
    clues:
      '- A rating gives the power at the rated voltage only. Find R(L₂) from the rating with P = \\frac{V²}{R}.\n- Then use P = I²R with the new current. L₂ is still in a complete loop with the battery and R₂.',
  },
];

// ─── AI explanation (AMPM-CONTENT-AI-EXP) — one entry per exam sub-question ───

const aiExplanation = {
  sub_questions: [
    {
      number: '8.1',
      marks: 2,
      clues: '- Power is about how FAST something happens.\n- What is being done or transferred?',
      approach: '- Define power as a rate: work done (or energy transferred) per unit time.',
      solution: '1. Power is the rate at which work is done (or energy is transferred).\n2. Also accepted: work done per unit time. (2 or 0 marks.)',
    },
    {
      number: '8.2.1',
      marks: 3,
      clues: '- A₂ is in series with L₂ only.\n- L₂ operates as rated: 48 W at 32 V.',
      approach: '- Use P = VI with L₂’s rated values.\n- Solve for I.',
      solution: '1. P = VI.\n2. 48 = 32I.\n3. I = 1.5 A, so A₂ reads 1.5 A.',
    },
    {
      number: '8.2.2',
      marks: 3,
      clues: '- A₁ measures the total current, which splits between the L₂ branch and the R₁–L₁ branch.\n- Find the current through L₁ from its rating.',
      approach: '- Use P = VI for L₁: 36 = 20I.\n- Add the two branch currents.',
      solution: '1. For L₁: P = VI, so 36 = 20I and I = 1.8 A.\n2. I(total) = 1.5 + 1.8 = 3.3 A.\n3. A₁ reads 3.3 A.',
    },
    {
      number: '8.2.3',
      marks: 4,
      clues: '- The R₁–L₁ branch is in parallel with L₂, so it has 32 V across it.\n- L₁ takes 20 V of that 32 V.',
      approach: '- Find V across R₁: 32 − 20 = 12 V.\n- The current through R₁ is the L₁ current, 1.8 A.\n- Use R = V/I.',
      solution: '1. V(R₁) + V(L₁) = V(parallel), so V(R₁) + 20 = 32.\n2. V(R₁) = 12 V.\n3. V = IR, so 12 = 1.8R₁.\n4. R₁ = 6.67 Ω.\n5. Alternative: R(branch) = 32/1.8 = 17.78 Ω and R(L₁) = 20²/36 = 11.11 Ω, so R₁ = 17.78 − 11.11 = 6.67 Ω.',
    },
    {
      number: '8.2.4',
      marks: 4,
      clues: '- The total current of 3.3 A flows through R₂ (4 Ω) and the internal resistance (0.6 Ω).\n- ε = V(ext) + Ir.',
      approach: '- Find V across R₂: V = IR = 3.3 × 4.\n- External p.d. = V(parallel) + V(R₂).\n- Add the lost volts: Ir = 3.3 × 0.6.',
      solution: '1. V(R₂) = I(total)R₂ = 3.3(4) = 13.2 V.\n2. ε = V(ext) + Ir = (13.2 + 32) + 3.3(0.6).\n3. ε = 45.2 + 1.98 = 47.18 V (range 47.16 to 47.19 V).\n4. Alternative: R(parallel) = 9.69 Ω, R(ext) = 13.69 Ω, and ε = I(R + r) = 3.3(13.69 + 0.6) = 47.18 V.',
    },
    {
      number: '8.3',
      marks: 5,
      clues: '- With L₁ gone, only L₂, R₂ and the internal resistance are left in series.\n- Compare the new current through L₂ with its rated current, 1.5 A.',
      approach: '- Find R(L₂) = V²/P = 32²/48.\n- Use ε = I(R + r) with R = R(L₂) + 4 Ω and r = 0.6 Ω.\n- Compare the current with the rated 1.5 A and decide.',
      solution: '1. R(L₂) = V²/P = 32²/48 = 21.33 Ω.\n2. ε = I(R + r): 47.18 = I(21.33 + 4 + 0.6).\n3. I = 1.82 A.\n4. 1.82 A is greater than the rated current of 1.5 A, so L₂ is overloaded and burns out.\n5. Answer: NO, L₂ will not continue to glow.',
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
