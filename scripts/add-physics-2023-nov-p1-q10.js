#!/usr/bin/env node
/**
 * DBE Physical Sciences: Physics P1 — November 2023 — Question 10 (order 13)
 * Photoelectric effect combined with Coulomb's law (number of photons), and absorption line spectra.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-physics-2023-nov-p1-q10.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-physics-2023-nov-p1-q10.js --dry-run
 *   node scripts/add-physics-2023-nov-p1-q10.js
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
  name: 'Question 10',
  syllabus: 'dbe',
  subject: 'physics',
  year: 2023,
  paper: 'nov_p1',
  order: 13,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['photoelectric_effect', 'coulombs_law', 'atomic_spectra'],
  question_image_urls: [`${PAPER}/q10/question_1.png`, `${PAPER}/q10/question_2.png`],
  memo_image_urls: [`${PAPER}/q10/memo_1.png`, `${PAPER}/q10/memo_2.png`],
  exam_question_marks: 17,
  supplementary_materials: [FORMULA_SHEET],
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    name: 'Question 1',
    question:
      'Metal P has a work function of 3.2 × 10⁻¹⁹ J and metal Q has a work function of 5.0 × 10⁻¹⁹ J. Light of a single frequency is just able to eject electrons from Q. The same light is shone on P. Which ONE of the following statements is CORRECT?',
    metadata: [
      'No electrons are ejected from P, because its work function is lower',
      'Electrons are ejected from P with the same Eₖ(max) as from Q',
      'Electrons are ejected from P only if the light’s intensity is increased',
      'Electrons are ejected from P with a greater Eₖ(max) than from Q',
      '',
    ],
    answer: ['Electrons are ejected from P with a greater Eₖ(max) than from Q', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'matter_materials', topic: 'optical_phenomena', subtopic: 'photoelectric_effect_threshold',
    skills: ['work_function', 'photoelectric_effect'],
    difficulty: 4, exam_weight: 3, xp: 10, order: 1,
    syllabus: 'dbe', subject: 'physics', year: 2023, paper: 'nov_p1',
    clues:
      '- The work function is the minimum photon energy needed to eject an electron from a metal’s surface.\n- Use E = W₀ + Eₖ(max): the same photon energy is shared differently on each metal.',
  },
  {
    name: 'Question 2',
    question:
      'Light of wavelength 450 nm is shone on a metal with a work function of 4.2 × 10⁻¹⁹ J. Complete the working to calculate the energy of each photon. (The photon energy is then compared with the work function to decide whether electrons are ejected.)',
    metadata: [
      'E = \\frac{hc}{λ} = \\frac{(6.63 × 10⁻³⁴)(3 × 10⁸)}{450 × 10⁻⁹}, so E (in × 10⁻¹⁹ J):',
      '[ ]',
    ],
    answer: ['4.42'],
    presentation: 'steps',
    keyboard_type: 'scientific_math',
    type: 'calc',
    unit: 'matter_materials', topic: 'optical_phenomena', subtopic: 'photoelectric_effect_threshold',
    skills: ['photon_energy_calculation', 'photoelectric_effect'],
    difficulty: 2, exam_weight: 3, xp: 10, order: 2,
    syllabus: 'dbe', subject: 'physics', year: 2023, paper: 'nov_p1',
    clues:
      '- Convert nm to m: 1 nm = 10⁻⁹ m (already done in the given row).\n- Give only the coefficient in front of × 10⁻¹⁹ J.',
  },
  {
    name: 'Question 3',
    question:
      'Small sphere Y loses electrons when ultraviolet light shines on it; each photon that strikes it ejects one electron. Sphere X, with a charge of +3 × 10⁻⁶ C, is 0.2 m from Y. Complete the working to find the minimum number of photons needed for the electrostatic force between X and Y to reach 0.0405 N.',
    metadata: [
      'F = \\frac{kQ₁Q₂}{r²}, so 0.0405 = \\frac{(9 × 10⁹)(3 × 10⁻⁶)Q₂}{(0.2)²}, which gives Q₂ = 6 × 10⁻⁸ C',
      'n = \\frac{Q₂}{e} = \\frac{6 × 10⁻⁸}{1.6 × 10⁻¹⁹}, so n (in × 10¹¹):',
      '[ ]',
    ],
    answer: ['3.75'],
    presentation: 'steps',
    keyboard_type: 'scientific_math',
    type: 'calc',
    unit: 'electricity_magnetism', topic: 'electrostatics', subtopic: 'coulombs_law',
    skills: ['coulombs_law', 'photoelectric_effect'],
    difficulty: 4, exam_weight: 3, xp: 10, order: 3,
    syllabus: 'dbe', subject: 'physics', year: 2023, paper: 'nov_p1',
    clues:
      '- Each ejected electron leaves Y with an extra positive charge equal in size to e.\n- Divide the charge by e, then write the result as a coefficient of 10¹¹.',
  },
  {
    name: 'Question 4',
    question: 'Match each light source to the type of spectrum it produces when viewed through a spectroscope.',
    metadata: [
      'A - A hot, glowing tungsten filament',
      'B - A hot gas at low pressure',
      'C - White light after passing through a cool gas',
      '1 - Dark lines on a continuous band of colours',
      '2 - A continuous band of colours with no gaps',
      '3 - Bright coloured lines on a dark background',
    ],
    answer: ['A-2', 'B-3', 'C-1'],
    presentation: 'match',
    type: 'definition',
    unit: 'matter_materials', topic: 'optical_phenomena', subtopic: 'atomic_energy_levels',
    skills: ['spectrum_type_identification', 'energy_level_transitions'],
    difficulty: 2, exam_weight: 2, xp: 10, order: 4,
    syllabus: 'dbe', subject: 'physics', year: 2023, paper: 'nov_p1',
    clues:
      '- A cool gas absorbs specific frequencies from light passing through it.\n- A hot, low-pressure gas emits only specific frequencies.',
  },
  {
    name: 'Question 5',
    question:
      'The energy levels of an atom are labelled E₀ (lowest) to E₃ (highest). Which ONE of the following electron transitions produces a line in an ABSORPTION spectrum?',
    metadata: ['From E₃ to E₁', 'From E₂ to E₀', 'From E₁ to E₃', 'From E₃ to E₂', ''],
    answer: ['From E₁ to E₃', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'interpretation',
    unit: 'matter_materials', topic: 'optical_phenomena', subtopic: 'atomic_energy_levels',
    skills: ['energy_level_transitions', 'spectrum_type_identification'],
    difficulty: 2, exam_weight: 2, xp: 10, order: 5,
    syllabus: 'dbe', subject: 'physics', year: 2023, paper: 'nov_p1',
    clues:
      '- Absorbing a photon gives the electron energy.\n- Gaining energy moves an electron in one particular direction on the energy-level diagram.',
  },
];

// ─── AI explanation (AMPM-CONTENT-AI-EXP) — one entry per exam sub-question ───

const aiExplanation = {
  sub_questions: [
    {
      number: '10.1.1',
      marks: 2,
      clues: '- The work function is an energy, not a frequency.\n- It is the smallest energy needed to do one specific thing.',
      approach: '- State that it is the minimum energy (of incident photons) …\n- … needed to eject electrons from the surface of a metal.',
      solution: '1. The work function is the minimum energy (of incident photons) that can eject electrons from the surface of a metal.\n2. Referring to frequency instead of energy scores 0/2.',
    },
    {
      number: '10.1.2',
      marks: 4,
      clues: '- Calculate the energy of one ultraviolet photon.\n- Compare it with the work function of zinc.',
      approach: '- Use E = hf with f = 2.8 × 10¹⁶ Hz.\n- Compare E with W₀ = 6.63 × 10⁻¹⁹ J.\n- Conclude: electrons are ejected if E > W₀ (equivalently, if f > f₀).',
      solution: '1. E = hf = (6.63 × 10⁻³⁴)(2.8 × 10¹⁶).\n2. E = 1.86 × 10⁻¹⁷ J.\n3. Since E > W₀ (1.86 × 10⁻¹⁷ J > 6.63 × 10⁻¹⁹ J), electrons will be ejected.\n4. Equivalent route: f₀ = W₀/h = 1 × 10¹⁵ Hz, and since f > f₀ electrons are ejected.',
    },
    {
      number: '10.1.3',
      marks: 6,
      clues: '- Sphere B becomes positive as it loses electrons, and then attracts sphere A.\n- Find the charge B needs to attract A with 0.027 N, then convert that charge into a number of electrons (one per photon).',
      approach: '- Use Coulomb’s law, F = kQ₁Q₂/r², with F = 0.027 N, Q₁ = 5.4 × 10⁻⁶ C and r = 0.1 m to find the charge on B.\n- Find the number of electrons B must lose: n = Q/e.\n- Each photon ejects one electron, so the number of photons equals n.',
      solution: '1. F = kQ₁Q₂/r².\n2. 0.027 = (9 × 10⁹)(5.4 × 10⁻⁶)Q₂/(0.1)².\n3. Q₂ = 5.56 × 10⁻⁹ C.\n4. n = Q/e = 5.56 × 10⁻⁹/1.6 × 10⁻¹⁹ = 3.47 × 10¹⁰ electrons.\n5. Each photon ejects one electron, so the minimum number of photons = 3.47 × 10¹⁰.',
    },
    {
      number: '10.2.1',
      marks: 1,
      clues: '- The gas is cold and the light passes through it.\n- The gas takes certain frequencies out of the white light.',
      approach: '- Identify what a cold gas does to white light passing through it: it absorbs specific frequencies.\n- Name the spectrum after that process.',
      solution: '1. The cold gas absorbs specific frequencies from the white light.\n2. Answer: an (line) absorption spectrum.',
    },
    {
      number: '10.2.2',
      marks: 2,
      clues: '- Describe the background first, then what appears on it.\n- The missing frequencies show up as something dark.',
      approach: '- State that the spectrum is a continuous spectrum of white light (rainbow of colours).\n- State that it has dark (black) lines where specific frequencies are missing.',
      solution: '1. A continuous spectrum of white light (a rainbow of colours) …\n2. … with dark/black lines replacing specific frequencies.',
    },
    {
      number: '10.2.3',
      marks: 2,
      clues: '- In absorption, electrons gain energy from photons.\n- Look at the direction of the arrows in each diagram.',
      approach: '- Absorption means electrons absorb photons and move to higher energy levels.\n- Find the diagram whose arrows point upwards.',
      solution: '1. In an absorption spectrum, atoms absorb photons and their electrons move from lower to higher energy levels.\n2. Diagram A shows downward transitions (emission); Diagram B shows upward transitions (absorption).\n3. Answer: DIAGRAM B.',
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
