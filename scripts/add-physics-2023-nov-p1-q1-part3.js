#!/usr/bin/env node
/**
 * DBE Physical Sciences: Physics P1 — November 2023 — Question 1.7–1.9 (order 3)
 * Q1 Electricity & Magnetism MCQs: charge interactions, voltmeters with an open switch, split-ring commutator generator.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-physics-2023-nov-p1-q1-part3.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-physics-2023-nov-p1-q1-part3.js --dry-run
 *   node scripts/add-physics-2023-nov-p1-q1-part3.js
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
  name: 'Question 1.7–1.9',
  syllabus: 'dbe',
  subject: 'physics',
  year: 2023,
  paper: 'nov_p1',
  order: 3, // Q1 part 3 of 4: Electricity & Magnetism
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['coulombs_law', 'circuit_analysis', 'ac_generator'],
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
      'A positively charged rod is brought close to three small spheres, X, Y and Z, one at a time. Each hangs from a light insulating thread. Sphere X is attracted, sphere Y is repelled and sphere Z is attracted. Which ONE of the following statements MUST be true?',
    metadata: [
      'Sphere X is negatively charged.',
      'Sphere Z is neutral.',
      'Spheres X and Z carry the same charge.',
      'Sphere Y is positively charged.',
      '',
    ],
    answer: ['Sphere Y is positively charged.', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'electricity_magnetism', topic: 'electrostatics', subtopic: 'coulombs_law',
    skills: ['coulombs_law', 'charge_redistribution'],
    difficulty: 3, exam_weight: 2, xp: 10, order: 1,
    syllabus: 'dbe', subject: 'physics', year: 2023, paper: 'nov_p1',
    clues:
      '- Repulsion only happens between like charges.\n- A charged rod can also attract a neutral object by polarising it, so attraction alone does not tell you the charge.',
  },
  {
    name: 'Question 2',
    question:
      'A battery of emf 9 V and negligible internal resistance is connected in series with a lamp and an OPEN switch. A high-resistance voltmeter is connected across the open switch. What is the reading on the voltmeter?',
    metadata: ['V = ', '[ ]', ' V'],
    answer: ['9', '', '', '', ''],
    presentation: 'fitb',
    keyboard_type: 'standard_math',
    type: 'interpretation',
    unit: 'electricity_magnetism', topic: 'electric_circuits', subtopic: 'series_parallel_combination',
    skills: ['circuit_analysis', 'terminal_voltage'],
    difficulty: 3, exam_weight: 2, xp: 10, order: 2,
    syllabus: 'dbe', subject: 'physics', year: 2023, paper: 'nov_p1',
    clues:
      '- With the switch open, no current flows, so there is no potential difference across the lamp (V = IR).\n- The voltmeter across the gap connects the battery terminals to each other through the lamp.',
  },
  {
    name: 'Question 3',
    question:
      'The slip rings of an AC generator are replaced with a split-ring commutator. Which ONE of the following describes how the graph of current in the external circuit against time changes?',
    metadata: [
      'It changes from a constant value to a sine curve.',
      'It changes from a sine curve to one that never crosses zero.',
      'It stays a sine curve, but its peak value doubles.',
      'It changes from a sine curve to a constant horizontal line above zero.',
      '',
    ],
    answer: ['It changes from a sine curve to one that never crosses zero.', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'interpretation',
    unit: 'electricity_magnetism', topic: 'electrodynamics', subtopic: 'dc_motor_commutator',
    skills: ['commutator_function', 'generator_graph_interpretation'],
    difficulty: 3, exam_weight: 3, xp: 10, order: 3,
    syllabus: 'dbe', subject: 'physics', year: 2023, paper: 'nov_p1',
    clues:
      '- A split-ring commutator reverses the coil’s connections to the external circuit every half turn.\n- The coil still rotates through the field, so the size of the induced emf still rises and falls.',
  },
];

// ─── AI explanation (AMPM-CONTENT-AI-EXP) — one entry per exam sub-question ───

const aiExplanation = {
  sub_questions: [
    {
      number: '1.7',
      marks: 2,
      clues: '- Repulsion only happens between like charges.\n- Attraction can happen between opposite charges OR between a charged object and a neutral one.',
      approach: '- Use the repulsion of Q to fix Q’s charge: it must be the same sign as the rod.\n- Use the attraction of R to list R’s possibilities: opposite charge or neutral (polarisation).\n- Find the option that fits both.',
      solution: '1. The rod is negative and Q is repelled, so Q must be negative (like charges repel) — this rules out B and C.\n2. R is attracted to the negative rod, so R is either positive or neutral (a neutral sphere is polarised and attracted).\n3. Option A has R negative, which would be repelled — wrong.\n4. Option D: Q negative, R neutral — both fit.\n5. Answer: D.',
    },
    {
      number: '1.8',
      marks: 2,
      clues: '- With the switch open, no current flows anywhere in the circuit.\n- A voltmeter only reads a potential difference across a component if current flows through it, or if it spans a gap.',
      approach: '- V₁ is across the battery, so with no current it reads the emf.\n- With no current, V = IR gives zero across the resistor (V₂) and the ammeter (V₄).\n- V₃ across the open switch connects to the battery terminals through the other components, so it reads the emf.',
      solution: '1. Switch open, so I = 0 in the circuit.\n2. V₁ reads the emf (no current means no lost volts).\n3. V₂ across R: V = IR = 0. V₄ across the ammeter: also 0.\n4. V₃ across the open switch is connected to both battery terminals through R and the ammeter (which have no potential drop), so V₃ reads the emf, the same as V₁.\n5. Answer: B — V₃ only.',
    },
    {
      number: '1.9',
      marks: 2,
      clues: '- A split-ring commutator turns a generator into a DC generator.\n- The coil still rotates through the field, so the emf still rises and falls in size.',
      approach: '- Recall what a split ring does: it reverses the connections to the external circuit every half turn.\n- Decide what that does to the direction of the external current.\n- Decide whether the size of the induced current is constant as the coil rotates.',
      solution: '1. The split ring swaps the coil’s connections every half turn, exactly when the induced current in the coil reverses.\n2. So the current in the external circuit always flows in the same direction — the direction is constant.\n3. The rate of change of flux still varies as the coil rotates, so the magnitude of the current rises and falls — it changes.\n4. Answer: C — magnitude changes, direction constant.',
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
