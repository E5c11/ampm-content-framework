#!/usr/bin/env node
/**
 * DBE Physical Sciences: Physics P1 — November 2025 — Question 10 (order 13)
 * The photoelectric effect and atomic energy levels — a metals experiment plus an
 * energy-level diagram. One continuous scenario across 10.1-10.2 — bundled per
 * DESIGN-UNI-10.
 *
 *   node tools/validate-questions.js --script scripts/add-physics-2025-nov-p1-q10.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-physics-2025-nov-p1-q10.js --dry-run
 *   node scripts/add-physics-2025-nov-p1-q10.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env') ? process.argv[process.argv.indexOf('--env') + 1] : 'dev';
const PAPER = 'https://media-dev.askmoreprepmore.app/exam_papers/dbe/physics/2025/nov_p1';

const video = {
  name: 'Question 10',
  syllabus: 'dbe',
  subject: 'physics',
  year: 2025,
  paper: 'nov_p1',
  order: 13,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['photoelectric_effect_advanced', 'photoelectric_effect'],
  question_image_urls: [`${PAPER}/q10/question_1.png`],
  memo_image_urls: [`${PAPER}/q10/memo_1.png`],
  exam_question_marks: 14,
  supplementary_materials: [
    { type: 'formula_sheet', label: 'Formula Sheet', image_urls: [`${PAPER}/q0/question_1.png`, `${PAPER}/q0/question_2.png`, `${PAPER}/q0/question_3.png`] },
  ],
};

const questions = [
  {
    name: 'Question 1',
    question: 'Which ONE of the following correctly describes the work function of a metal?',
    metadata: [
      'The total energy of a photon incident on the metal.',
      'The minimum energy needed for an electron to be emitted from the metal’s surface.',
      'The maximum kinetic energy an emitted electron can have.',
      'The energy required to heat the metal to its melting point.',
      '',
    ],
    answer: ['The minimum energy needed for an electron to be emitted from the metal’s surface.', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'definition',
    unit: 'matter_materials', topic: 'optical_phenomena', subtopic: 'photoelectric_effect_threshold',
    skills: ['work_function'],
    difficulty: 1, exam_weight: 2, xp: 10, order: 1,
    syllabus: 'dbe', subject: 'physics', year: 2025, paper: 'nov_p1',
    clues: '- The work function is a minimum energy requirement, specific to a metal’s surface.\n- It is not the same as a photon’s energy or an electron’s kinetic energy after emission.',
  },
  {
    name: 'Question 2',
    question: 'A metal has a work function of 4.0 × 10⁻¹⁹ J. Calculate the threshold frequency of this metal.',
    metadata: ['f₀ = ', '[ ]', ' × 10¹⁴ Hz'],
    answer: ['6.03', '', '', '', ''],
    presentation: 'fitb',
    type: 'calc',
    unit: 'matter_materials', topic: 'optical_phenomena', subtopic: 'photoelectric_effect_threshold',
    skills: ['work_function', 'threshold_frequency'],
    difficulty: 2, exam_weight: 2, xp: 10, order: 2,
    syllabus: 'dbe', subject: 'physics', year: 2025, paper: 'nov_p1',
    clues: '- At the threshold frequency, a photon’s energy exactly equals the work function: W₀ = hf₀.\n- Rearrange to make f₀ the subject, using h = 6.63 × 10⁻³⁴ J·s.',
  },
  {
    name: 'Question 3',
    question:
      'Light of a certain frequency is incident on two metals, P and Q. The maximum kinetic energy of photoelectrons emitted from P is 1.8 × 10⁻¹⁹ J, while from Q (using the same frequency light) it is 2.5 × 10⁻¹⁹ J. How does the work function of metal P compare to that of metal Q?',
    metadata: ['Smaller than', 'Greater than', 'Equal to', 'Cannot be compared', ''],
    answer: ['Greater than', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'interpretation',
    unit: 'matter_materials', topic: 'optical_phenomena', subtopic: 'photoelectric_effect_threshold',
    skills: ['work_function'],
    difficulty: 4, exam_weight: 2, xp: 10, order: 3,
    syllabus: 'dbe', subject: 'physics', year: 2025, paper: 'nov_p1',
    clues: '- Use Eₖ(max) = hf − W₀. Since the frequency (and so hf) is the same for both metals, a bigger Eₖ(max) means a smaller W₀.\n- P has the smaller maximum kinetic energy of the two.',
  },
  {
    name: 'Question 4',
    question:
      'Light with a frequency below a metal’s threshold frequency is incident on the metal, and no photoelectrons are emitted. The intensity of the light is now increased, with the frequency kept the same. Will photoelectrons now be emitted?',
    metadata: [
      'Yes, because higher intensity always causes emission.',
      'No, because intensity does not affect whether emission occurs — only the frequency does, and it is still below threshold.',
      'Yes, because higher intensity increases the energy of each photon.',
      'No, because increasing intensity decreases the frequency further.',
      '',
    ],
    answer: ['No, because intensity does not affect whether emission occurs — only the frequency does, and it is still below threshold.', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'matter_materials', topic: 'optical_phenomena', subtopic: 'photoelectric_effect_threshold',
    skills: ['threshold_frequency', 'photoelectric_effect'],
    difficulty: 3, exam_weight: 2, xp: 10, order: 4,
    syllabus: 'dbe', subject: 'physics', year: 2025, paper: 'nov_p1',
    clues: '- Intensity relates to the number of photons per second, not the energy of each individual photon.\n- Whether emission occurs at all depends only on whether a single photon has enough energy — i.e. on frequency.',
  },
  {
    name: 'Question 5',
    question:
      'Complete the working to find the frequency of the emitted photon. An atom has electron energy levels at Eₐ = 8.0 × 10⁻¹⁹ J and E(b) = 3.0 × 10⁻¹⁹ J. An electron moves from Eₐ to E(b), emitting a photon.',
    metadata: [
      'ΔE = Eₐ − E(b)',
      'ΔE = 8.0 × 10⁻¹⁹ − 3.0 × 10⁻¹⁹ = 5.0 × 10⁻¹⁹ J',
      'E = hf ⇒ 5.0 × 10⁻¹⁹ = (6.63 × 10⁻³⁴)f, so f (in ×10¹⁴ Hz) =',
      '[ ]',
    ],
    answer: ['7.54'],
    presentation: 'steps',
    type: 'calc',
    unit: 'matter_materials', topic: 'optical_phenomena', subtopic: 'atomic_energy_levels',
    skills: ['photon_energy_calculation', 'energy_level_transitions'],
    difficulty: 3, exam_weight: 2, xp: 10, order: 5,
    syllabus: 'dbe', subject: 'physics', year: 2025, paper: 'nov_p1',
    clues: '- The emitted photon’s energy equals the difference between the two energy levels.\n- Use E = hf to find the frequency from this energy difference.',
  },
  {
    name: 'Question 6',
    question:
      'An atom has three energy levels: E₁ = 1.0 × 10⁻¹⁹ J, E₂ = 4.0 × 10⁻¹⁹ J, and E₃ = 8.0 × 10⁻¹⁹ J. Is it possible for a photon of energy 5.0 × 10⁻¹⁹ J to be emitted from this atom?',
    metadata: [
      'Yes, since 5.0 × 10⁻¹⁹ J is between the smallest and largest energy level.',
      'No, since 5.0 × 10⁻¹⁹ J does not match the energy difference of any pair of levels.',
      'Yes, since any energy can be emitted as a photon.',
      'No, since photons can only be emitted from E₁.',
      '',
    ],
    answer: ['No, since 5.0 × 10⁻¹⁹ J does not match the energy difference of any pair of levels.', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'matter_materials', topic: 'optical_phenomena', subtopic: 'atomic_energy_levels',
    skills: ['energy_level_transitions'],
    difficulty: 4, exam_weight: 2, xp: 10, order: 6,
    syllabus: 'dbe', subject: 'physics', year: 2025, paper: 'nov_p1',
    clues: '- A photon’s energy must exactly match the energy difference between two of the atom’s levels.\n- List all three possible energy differences (E₃−E₁, E₃−E₂, E₂−E₁) and compare each to the given value.',
  },
];

const aiExplanation = {
  sub_questions: [
    {
      number: '10.1.1', marks: 2,
      clues: '- The work function is a minimum energy requirement.\n- It relates specifically to electrons being emitted from a metal surface.',
      approach: '- Recall what the work function represents physically.\n- State it as a minimum energy needed for a specific process.',
      solution: '1. Minimum energy needed for the electrons to be emitted from the metal surface.',
    },
    {
      number: '10.1.2', marks: 1,
      clues: '- The threshold frequency is the frequency at which the maximum kinetic energy of emitted electrons is exactly zero.',
      approach: '- Find the row in the table where zinc’s maximum kinetic energy is 0.\n- Read off the frequency used for that measurement.',
      solution: '1. 1.045 × 10¹⁵ Hz (the frequency used in the experiment, since zinc’s electrons are emitted with zero kinetic energy at this frequency).',
    },
    {
      number: '10.1.3', marks: 3,
      clues: '- All metals were tested with the same frequency of light, so hf is the same for each.\n- Use Eₖ(max) = hf − W₀ to relate the two.',
      approach: '- Compare the maximum kinetic energies of sodium and caesium.\n- Since hf is the same for both, work out which metal has the smaller work function.\n- State the comparison for sodium relative to caesium.',
      solution: '1. Greater than.\n2. The maximum kinetic energy of electrons from sodium is smaller than from caesium.\n3. Since E is constant (same frequency/light used), a smaller Eₖ(max) means a larger W₀ — so sodium’s work function is greater than caesium’s.',
    },
    {
      number: '10.1.4', marks: 2,
      clues: '- Metal M did not emit electrons at this frequency — think about what that means about the frequency relative to M’s threshold.\n- Intensity affects the number of photons, not each photon’s individual energy.',
      approach: '- Recall that emission depends only on whether each photon has enough energy (frequency), not on how many photons arrive per second (intensity).\n- Since M did not emit electrons at this frequency, conclude what changing only the intensity would do.',
      solution: '1. No.\n2. The intensity of light does not have any effect on the ejection of electrons for metal M / the frequency of light has not changed, so the energy of a photon has not changed.',
    },
    {
      number: '10.2.1', marks: 4,
      clues: '- The emitted photon’s energy equals the difference between the two energy levels involved in the transition.\n- Use E = hf to convert this energy difference into a frequency.',
      approach: '- Calculate the energy difference between E₃ and E₁.\n- Use E = hf with this energy difference.\n- Solve for f.',
      solution: '1. ΔE = E₃ − E₁ = 5.7 × 10⁻¹⁹ − 1.3 × 10⁻¹⁹ = 4.4 × 10⁻¹⁹ J\n2. E = hf\n3. 4.4 × 10⁻¹⁹ = (6.63 × 10⁻³⁴)f\n4. f = 6.64 × 10¹⁴ Hz',
    },
    {
      number: '10.2.2', marks: 2,
      clues: '- A photon can only be emitted with an energy exactly equal to the difference between two of the atom’s energy levels.\n- List the possible energy differences and compare each to the given value.',
      approach: '- Calculate every possible energy difference between pairs of the three given levels.\n- Compare the given photon energy (2.5 × 10⁻¹⁹ J) to each.\n- Conclude whether it matches any of them.',
      solution: '1. No.\n2. The energy (2.5 × 10⁻¹⁹ J) does not correspond to any transition in this atom (the possible differences are E₂−E₁ = 3.8 × 10⁻¹⁹ J, E₃−E₂ = 0.6 × 10⁻¹⁹ J, E₃−E₁ = 4.4 × 10⁻¹⁹ J).',
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
