#!/usr/bin/env node
/**
 * DBE Physical Sciences: Physics P1 — November 2024 — Question 10 (order 13)
 * Photoelectric effect with three colours of light on potassium; work function and frequency; emission spectra.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-physics-2024-nov-p1-q10.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-physics-2024-nov-p1-q10.js --dry-run
 *   node scripts/add-physics-2024-nov-p1-q10.js
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
  name: 'Question 10',
  syllabus: 'dbe',
  subject: 'physics',
  year: 2024,
  paper: 'nov_p1',
  order: 13,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['photoelectric_effect', 'atomic_spectra'],
  question_image_urls: [`${PAPER}/q10/question_1.png`],
  memo_image_urls: [`${PAPER}/q10/memo_1.png`, `${PAPER}/q10/memo_2.png`],
  exam_question_marks: 15,
  supplementary_materials: [FORMULA_SHEET],
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    name: 'Question 1',
    question:
      'Red light shines on a clean metal surface, and NO electrons are ejected. Which ONE change will cause electrons to be ejected?',
    metadata: [
      'Making the red light much brighter',
      'Using light of a much higher frequency',
      'Moving the red light source closer',
      'Shining the red light for a longer time',
      '',
    ],
    answer: ['Using light of a much higher frequency', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'matter_materials', topic: 'optical_phenomena', subtopic: 'photoelectric_effect_threshold',
    skills: ['photoelectric_effect', 'threshold_frequency'],
    difficulty: 2, exam_weight: 3, xp: 10, order: 1,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p1',
    clues:
      '- Each electron is ejected by ONE photon, and a photon’s energy depends only on its frequency (E = hf).\n- Brighter or closer light means more photons, not more energetic ones.',
  },
  {
    name: 'Question 2',
    question:
      'Violet, blue and red light shine together on a metal. Only two of the colours eject electrons, so two different maximum kinetic energies are measured. Which colour ejects the electrons with the LARGER maximum kinetic energy, and why?',
    metadata: [
      'Red, because its photons have the longest wavelength',
      'Blue, because its photons have the middle frequency',
      'Violet, because its photons have the highest frequency',
      'Red, because red light has the highest intensity',
      '',
    ],
    answer: ['Violet, because its photons have the highest frequency', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'matter_materials', topic: 'optical_phenomena', subtopic: 'photoelectric_effect_threshold',
    skills: ['photoelectric_effect', 'photon_energy_calculation'],
    difficulty: 3, exam_weight: 3, xp: 10, order: 2,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p1',
    clues:
      '- Red has the lowest frequency of the three, so it is the colour that ejects no electrons.\n- Eₖ(max) = hf − W₀. With W₀ fixed, a higher frequency gives a higher Eₖ(max).',
  },
  {
    name: 'Question 3',
    question:
      'Light of frequency 6.2 × 10¹⁴ Hz ejects electrons with a maximum kinetic energy of 1.5 × 10⁻²⁰ J from a metal. Complete the working to calculate the frequency of light that ejects electrons with a maximum kinetic energy of 8.0 × 10⁻²⁰ J from the same metal.',
    metadata: [
      'W₀ = hf − Eₖ(max) = (6.63 × 10⁻³⁴)(6.2 × 10¹⁴) − 1.5 × 10⁻²⁰ = 3.96 × 10⁻¹⁹ J',
      'hf = W₀ + Eₖ(max), so (6.63 × 10⁻³⁴)f = 3.96 × 10⁻¹⁹ + 8.0 × 10⁻²⁰ = 4.76 × 10⁻¹⁹',
      'f = \\frac{4.76 × 10⁻¹⁹}{6.63 × 10⁻³⁴}, so f (in × 10¹⁴ Hz, to two decimal places):',
      '[ ]',
    ],
    answer: ['7.18'],
    presentation: 'steps',
    keyboard_type: 'physics',
    type: 'calc',
    unit: 'matter_materials', topic: 'optical_phenomena', subtopic: 'photoelectric_effect_threshold',
    skills: ['work_function', 'photon_energy_calculation', 'photoelectric_effect'],
    difficulty: 4, exam_weight: 3, xp: 10, order: 3,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p1',
    clues:
      '- The work function belongs to the metal, so it is the same for both frequencies.\n- Divide 4.76 by 6.63, and remember that 10⁻¹⁹ ÷ 10⁻³⁴ = 10¹⁵.',
  },
  {
    name: 'Question 4',
    question: 'The work function of a metal is 3.68 × 10⁻¹⁹ J. Calculate its threshold frequency.',
    metadata: ['f₀ = ', '[ ]', ' × 10¹⁴ Hz'],
    answer: ['5.55|5.551', '', '', '', ''],
    presentation: 'fitb',
    keyboard_type: 'standard_math',
    type: 'calc',
    unit: 'matter_materials', topic: 'optical_phenomena', subtopic: 'photoelectric_effect_threshold',
    skills: ['threshold_frequency', 'work_function'],
    difficulty: 2, exam_weight: 3, xp: 10, order: 4,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p1',
    clues:
      '- At the threshold frequency, a photon has just enough energy to free an electron: W₀ = hf₀.',
  },
  {
    name: 'Question 5',
    question:
      'Violet light is ejecting electrons from a metal. The INTENSITY of the violet light is doubled, while its frequency stays the same. Which combination is CORRECT?',
    metadata: [
      'Rate of ejection stays the same; maximum kinetic energy increases',
      'Rate of ejection increases; maximum kinetic energy increases',
      'Rate of ejection stays the same; maximum kinetic energy stays the same',
      'Rate of ejection increases; maximum kinetic energy stays the same',
      '',
    ],
    answer: ['Rate of ejection increases; maximum kinetic energy stays the same', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'matter_materials', topic: 'optical_phenomena', subtopic: 'photoelectric_effect_threshold',
    skills: ['photoelectric_effect'],
    difficulty: 3, exam_weight: 3, xp: 10, order: 5,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p1',
    clues:
      '- Higher intensity means more photons arrive per second, but each photon has the same energy.\n- One photon ejects at most one electron.',
  },
  {
    name: 'Question 6',
    question: 'Match each source of light to the type of spectrum it produces.',
    metadata: [
      'A - A hot, low-pressure gas viewed against a dark background',
      'B - White light that has passed through a cool gas',
      'C - The glowing filament of an incandescent bulb',
      '1 - Continuous spectrum',
      '2 - Line absorption spectrum',
      '3 - Line emission spectrum',
    ],
    answer: ['A-3', 'B-2', 'C-1'],
    presentation: 'match',
    type: 'definition',
    unit: 'matter_materials', topic: 'optical_phenomena', subtopic: 'atomic_energy_levels',
    skills: ['spectrum_type_identification'],
    difficulty: 2, exam_weight: 3, xp: 10, order: 6,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p1',
    clues:
      '- Bright coloured lines on black means the atoms are giving out light. Dark lines on a rainbow means atoms took some colours out.\n- A hot, dense solid gives out every colour.',
  },
  {
    name: 'Question 7',
    question:
      'A hot gas of a single element produces bright coloured lines on a black background. Why does the spectrum show only certain specific colours?',
    metadata: [
      'Electrons drop between fixed energy levels and emit photons of specific energies',
      'Electrons absorb photons of every energy and re-emit only the brightest ones',
      'The gas reflects only the colours that match the colour of the element',
      'Electrons jump to higher energy levels and emit photons as they rise',
      '',
    ],
    answer: ['Electrons drop between fixed energy levels and emit photons of specific energies', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'matter_materials', topic: 'optical_phenomena', subtopic: 'atomic_energy_levels',
    skills: ['energy_level_transitions', 'spectrum_type_identification'],
    difficulty: 3, exam_weight: 3, xp: 10, order: 7,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p1',
    clues:
      '- A photon’s energy equals the difference between two energy levels (E = hf).\n- Energy is RELEASED when an electron moves to a LOWER level.',
  },
];

// ─── AI explanation (AMPM-CONTENT-AI-EXP) — one entry per exam sub-question ───

const aiExplanation = {
  sub_questions: [
    {
      number: '10.1',
      marks: 2,
      clues: '- It is a process: something is ejected from something when something shines on it.\n- Name the particles, the surface, and what causes it.',
      approach: '- Say what is ejected: electrons.\n- Say where from: a metal surface.\n- Say what causes it: light of suitable frequency incident on the surface.',
      solution: '1. The photoelectric effect is the process whereby electrons are ejected from a metal surface when light (of suitable frequency) is incident on that surface.\n2. Key words: "electrons ejected", "metal surface", "light incident".',
    },
    {
      number: '10.2.1',
      marks: 1,
      clues: '- Only two maximum kinetic energies are seen, so only two colours eject electrons.\n- Red has the lowest frequency of the three.',
      approach: '- Rank the colours by frequency: red < green < blue.\n- Red ejects none. The lower-frequency colour of the remaining two gives the lower Eₖ(max).',
      solution: '1. Green.',
    },
    {
      number: '10.2.2',
      marks: 2,
      clues: '- Eₖ(max) = hf − W₀ and W₀ is fixed for potassium.\n- Compare green and blue.',
      approach: '- State that only green and blue light eject electrons (red does not).\n- Green has a lower frequency (lower photon energy) than blue, so it gives the lower Eₖ(max).',
      solution: '1. Only green and blue light eject electrons; red light does not.\n2. Green light has a lower frequency (longer wavelength) than blue light, so its photons have less energy.\n3. Therefore green ejects the electrons with the lower maximum kinetic energy (2.65 × 10⁻²⁰ J).',
    },
    {
      number: '10.2.3',
      marks: 5,
      clues: '- Use the green-light data to find the work function of potassium first.\n- Then use the same W₀ with Eₖ(max) = 6.96 × 10⁻²⁰ J.',
      approach: '- E = W₀ + Eₖ(max): (6.63 × 10⁻³⁴)(5.85 × 10¹⁴) = W₀ + 2.65 × 10⁻²⁰.\n- Solve for W₀.\n- Then (6.63 × 10⁻³⁴)f = W₀ + 6.96 × 10⁻²⁰, and solve for f.',
      solution: '1. hf = W₀ + Eₖ(max).\n2. (6.63 × 10⁻³⁴)(5.85 × 10¹⁴) = W₀ + 2.65 × 10⁻²⁰.\n3. W₀ = 3.88 × 10⁻¹⁹ − 0.265 × 10⁻¹⁹ = 3.61 × 10⁻¹⁹ J.\n4. (6.63 × 10⁻³⁴)f = 3.61 × 10⁻¹⁹ + 6.96 × 10⁻²⁰ = 4.31 × 10⁻¹⁹.\n5. f = 6.5 × 10¹⁴ Hz.',
    },
    {
      number: '10.2.4',
      marks: 2,
      clues: '- Red light does not eject any electrons from potassium.\n- Does making it brighter change that?',
      approach: '- Note that red photons have less energy than the work function.\n- More red photons still cannot eject electrons, and the blue and green light are unchanged.',
      solution: '1. REMAINS THE SAME.\n2. Red photons have a frequency below the threshold frequency, so no number of them ejects electrons. The blue and green light are unchanged.',
    },
    {
      number: '10.3.1',
      marks: 1,
      clues: '- Coloured lines on a black background come from a hot gas giving out light.',
      approach: '- Identify the spectrum type from bright lines on a dark background.',
      solution: '1. (Line) emission spectrum.',
    },
    {
      number: '10.3.2',
      marks: 2,
      clues: '- The atoms are in an excited state.\n- What happens when an excited electron returns to a lower energy level?',
      approach: '- Link each line to a photon of a specific frequency (energy).\n- Link the photon to an electron moving to a lower energy level.',
      solution: '1. Each coloured line represents the specific frequency (wavelength, energy) of photons emitted when electrons in the atoms move from a higher to a lower energy level.',
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
