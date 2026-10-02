#!/usr/bin/env node
/**
 * DBE Physical Sciences: Physics P1 — November 2023 — Question 6 (order 9)
 * Doppler effect: speed of sound from a receding ambulance's siren, qualitative changes, red shift of a star.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-physics-2023-nov-p1-q6.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-physics-2023-nov-p1-q6.js --dry-run
 *   node scripts/add-physics-2023-nov-p1-q6.js
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
  name: 'Question 6',
  syllabus: 'dbe',
  subject: 'physics',
  year: 2023,
  paper: 'nov_p1',
  order: 9,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['doppler_effect'],
  question_image_urls: [`${PAPER}/q6/question_1.png`],
  memo_image_urls: [`${PAPER}/q6/memo_1.png`],
  exam_question_marks: 13,
  supplementary_materials: [FORMULA_SHEET],
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    name: 'Question 1',
    question:
      'The Doppler effect depends on the relative motion between a sound source and a listener. In which ONE of the following situations does the listener detect NO change in frequency?',
    metadata: [
      'The source moves towards a listener who is standing still',
      'The listener moves away from a source that is standing still',
      'Source and listener move towards each other at equal speeds',
      'Source and listener move with the same velocity',
      '',
    ],
    answer: ['Source and listener move with the same velocity', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'waves_sound_light', topic: 'doppler_effect', subtopic: 'doppler_effect_qualitative',
    skills: ['doppler_effect'],
    difficulty: 3, exam_weight: 3, xp: 10, order: 1,
    syllabus: 'dbe', subject: 'physics', year: 2023, paper: 'nov_p1',
    clues:
      '- A frequency change needs the distance between source and listener to be changing.\n- Check each option: is the gap between the two getting bigger, smaller, or staying the same?',
  },
  {
    name: 'Question 2',
    question:
      'A motorbike moves away from a stationary listener at a constant velocity of 20 m·s⁻¹. Its hooter emits sound at 540 Hz, and the listener detects a frequency of 510 Hz. Complete the working to calculate the speed of sound in air.',
    metadata: [
      'Source moving away: fₗ = \\frac{v}{v + vₛ}fₛ',
      '510 = \\frac{v}{v + 20}(540), so 510(v + 20) = 540v, and v (in m·s⁻¹):',
      '[ ]',
    ],
    answer: ['340'],
    presentation: 'steps',
    type: 'calc',
    unit: 'waves_sound_light', topic: 'doppler_effect', subtopic: 'doppler_effect_experiment',
    skills: ['speed_of_sound_calculation', 'doppler_effect_calculation'],
    difficulty: 4, exam_weight: 3, xp: 10, order: 2,
    syllabus: 'dbe', subject: 'physics', year: 2023, paper: 'nov_p1',
    clues:
      '- Expand the bracket: 510v + 510 × 20 = 540v.\n- Collect the v terms on one side, then divide.',
  },
  {
    name: 'Question 3',
    question:
      'A siren of constant frequency moves away from a stationary listener. The siren now moves away at a GREATER constant speed. Ignore wind. Select ALL the quantities that REMAIN THE SAME.',
    metadata: [
      'The frequency detected by the listener',
      'The speed of sound in air',
      'The wavelength of the sound reaching the listener',
      'The frequency emitted by the siren',
      '',
    ],
    answer: ['The speed of sound in air', 'The frequency emitted by the siren', '', '', ''],
    presentation: 'multi_select',
    type: 'application',
    unit: 'waves_sound_light', topic: 'doppler_effect', subtopic: 'doppler_effect_qualitative',
    skills: ['doppler_effect', 'wave_speed_frequency_relationship'],
    difficulty: 3, exam_weight: 3, xp: 10, order: 3,
    syllabus: 'dbe', subject: 'physics', year: 2023, paper: 'nov_p1',
    clues:
      '- The speed of sound is set by the medium; the emitted frequency is set by the source itself.\n- Only the quantities measured at the listener depend on how fast the source moves.',
  },
  {
    name: 'Question 4',
    question:
      'Dark lines in the spectrum of a distant galaxy appear at SHORTER wavelengths than the same lines measured in a laboratory on Earth. What does this show?',
    metadata: [
      'The galaxy is moving away from Earth (red shift)',
      'The galaxy is moving towards Earth (blue shift)',
      'The galaxy is moving away from Earth (blue shift)',
      'The galaxy is not moving relative to Earth',
      '',
    ],
    answer: ['The galaxy is moving towards Earth (blue shift)', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'waves_sound_light', topic: 'doppler_effect', subtopic: 'doppler_effect_qualitative',
    skills: ['redshift_blueshift', 'doppler_effect'],
    difficulty: 3, exam_weight: 2, xp: 10, order: 4,
    syllabus: 'dbe', subject: 'physics', year: 2023, paper: 'nov_p1',
    clues:
      '- A source moving towards an observer has its waves squeezed together.\n- In the visible spectrum, shorter wavelengths lie towards the violet/blue end.',
  },
  {
    name: 'Question 5',
    question:
      'The spectrum of a distant star is red shifted. Arrange the statements into the correct chain of reasoning, from cause to observation.',
    metadata: [
      'The spectral lines are shifted towards the red end of the spectrum',
      'The star is moving away from the Earth',
      'The light reaching Earth has a longer wavelength than the light emitted',
    ],
    answer: [
      'The star is moving away from the Earth',
      'The light reaching Earth has a longer wavelength than the light emitted',
      'The spectral lines are shifted towards the red end of the spectrum',
    ],
    presentation: 'ordering',
    type: 'application',
    unit: 'waves_sound_light', topic: 'doppler_effect', subtopic: 'doppler_effect_qualitative',
    skills: ['redshift_blueshift', 'doppler_effect'],
    difficulty: 2, exam_weight: 2, xp: 10, order: 5,
    syllabus: 'dbe', subject: 'physics', year: 2023, paper: 'nov_p1',
    clues:
      '- Start with the motion of the star — that is the cause.\n- The change in wavelength comes before what is seen in the spectrum.',
  },
];

// ─── AI explanation (AMPM-CONTENT-AI-EXP) — one entry per exam sub-question ───

const aiExplanation = {
  sub_questions: [
    {
      number: '6.1.1',
      marks: 2,
      clues: '- The statement is about a change in frequency (pitch) that a listener detects.\n- Say what causes it: relative motion between the source and the listener.',
      approach: '- State that it is a change in the detected frequency (pitch) of the sound.\n- State the cause: the source and the listener have different velocities relative to the medium (relative motion between them).',
      solution: '1. The Doppler effect is the change in frequency (pitch) of the sound detected by a listener because the sound source and the listener have different velocities relative to the medium of sound propagation.\n2. Also accepted: an (apparent) change in observed frequency as a result of the relative motion between a source and an observer.',
    },
    {
      number: '6.1.2',
      marks: 5,
      clues: '- The source is moving away, so the source speed is added in the denominator.\n- The listener is stationary, so vₗ = 0.',
      approach: '- Write fₗ = (v ± vₗ)/(v ± vₛ) × fₛ and choose signs: vₗ = 0, and +vₛ because the source moves away.\n- Substitute fₗ = 512.64 Hz, fₛ = 550 Hz and vₛ = 25 m·s⁻¹.\n- Solve the equation for v.',
      solution: '1. fₗ = v/(v + vₛ) × fₛ (listener stationary, source moving away).\n2. 512.64 = v/(v + 25) × 550.\n3. 512.64v + 12 816 = 550v.\n4. 37.36v = 12 816.\n5. v = 343.04 m·s⁻¹ (accepted range 332.14 – 343.04 m·s⁻¹).',
    },
    {
      number: '6.1.3(a)',
      marks: 1,
      clues: '- What does the speed of sound depend on?\n- Does the ambulance change the air?',
      approach: '- Recall that the speed of sound depends only on the medium (air) and its conditions.\n- The motion of the source does not change the medium.',
      solution: '1. The speed of sound is a property of the medium, not of the source.\n2. Answer: REMAINS THE SAME.',
    },
    {
      number: '6.1.3(b)',
      marks: 1,
      clues: '- The emitted frequency is set by the siren itself.\n- Does the siren’s speed change how it vibrates?',
      approach: '- Separate the emitted frequency (at the source) from the detected frequency (at the listener).\n- The siren produces the same sound regardless of how fast it moves.',
      solution: '1. The siren still vibrates at the same rate, so it still emits 550 Hz.\n2. Answer: REMAINS THE SAME.',
    },
    {
      number: '6.1.3(c)',
      marks: 1,
      clues: '- Look at what happens to fₗ = v/(v + vₛ) × fₛ when vₛ gets bigger.\n- A bigger denominator gives a smaller fraction.',
      approach: '- Keep v and fₛ constant in fₗ = v/(v + vₛ) × fₛ.\n- Increase vₛ and decide what happens to fₗ.',
      solution: '1. In fₗ = v/(v + vₛ) × fₛ, increasing vₛ increases the denominator.\n2. The fraction v/(v + vₛ) gets smaller, so fₗ gets smaller.\n3. Answer: DECREASES.',
    },
    {
      number: '6.2.1',
      marks: 1,
      clues: '- Red light has the longest wavelengths in the visible spectrum.\n- Which motion stretches the waves reaching Earth?',
      approach: '- Link a red shift to longer observed wavelengths.\n- Longer wavelengths are observed when the source moves away.',
      solution: '1. A red shift means the observed wavelengths are longer than those emitted.\n2. That happens when the source moves away from the observer.\n3. Answer: AWAY FROM the Earth.',
    },
    {
      number: '6.2.2',
      marks: 2,
      clues: '- Say what happens to the wavelength (or frequency) of the light that reaches Earth.\n- Then link it to where the spectral lines move.',
      approach: '- State that a longer wavelength (lower frequency) is detected.\n- State that the spectral lines are shifted towards the red end of the spectrum.',
      solution: '1. Because the star moves away, a lower frequency / longer wavelength of light is detected on Earth.\n2. The spectral lines are therefore shifted towards the red end of the spectrum.\n3. The second mark is only given if "red" is linked to the lower frequency or longer wavelength.',
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
