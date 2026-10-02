#!/usr/bin/env node
/**
 * DBE Physical Sciences: Physics P1 — November 2024 — Question 6 (order 9)
 * Doppler effect: wavelength-time graph of a police siren; source frequency and car speed.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-physics-2024-nov-p1-q6.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-physics-2024-nov-p1-q6.js --dry-run
 *   node scripts/add-physics-2024-nov-p1-q6.js
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
  name: 'Question 6',
  syllabus: 'dbe',
  subject: 'physics',
  year: 2024,
  paper: 'nov_p1',
  order: 9,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['doppler_effect'],
  question_image_urls: [`${PAPER}/q6/question_1.png`],
  memo_image_urls: [`${PAPER}/q6/memo_1.png`],
  exam_question_marks: 12,
  supplementary_materials: [FORMULA_SHEET],
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    name: 'Question 1',
    question: 'Match each situation to what the observer detects.',
    metadata: [
      'A - A siren moves towards a stationary listener',
      'B - A siren moves away from a stationary listener',
      'C - A siren and a listener are both at rest',
      'D - Light from a galaxy moving towards Earth',
      '1 - Spectral lines shifted towards the blue end',
      '2 - The same pitch as the siren actually emits',
      '3 - A wavelength longer than the emitted wavelength',
      '4 - A higher pitch than the siren actually emits',
    ],
    answer: ['A-4', 'B-3', 'C-2', 'D-1'],
    presentation: 'match',
    type: 'application',
    unit: 'waves_sound_light', topic: 'doppler_effect', subtopic: 'doppler_effect_qualitative',
    skills: ['doppler_effect', 'redshift_blueshift'],
    difficulty: 2, exam_weight: 3, xp: 10, order: 1,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p1',
    clues:
      '- Relative motion towards the observer squashes the waves (shorter wavelength, higher frequency). Motion away stretches them.\n- With no relative motion there is no Doppler effect.',
  },
  {
    name: 'Question 2',
    question:
      'A stationary listener records the sound from an ambulance siren. The recorded wavelength is SHORTER than the wavelength the siren emits. Which combination is CORRECT?',
    metadata: [
      'Away from the listener, because the recorded wavelength is shorter',
      'Towards the listener, because the recorded frequency is lower',
      'Towards the listener, because the recorded wavelength is shorter',
      'Away from the listener, because the recorded frequency is higher',
      '',
    ],
    answer: ['Towards the listener, because the recorded wavelength is shorter', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'interpretation',
    unit: 'waves_sound_light', topic: 'doppler_effect', subtopic: 'doppler_effect_qualitative',
    skills: ['doppler_effect', 'wave_speed_frequency_relationship'],
    difficulty: 2, exam_weight: 3, xp: 10, order: 2,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p1',
    clues:
      '- The speed of sound is fixed, so a shorter wavelength means a higher frequency (v = fλ).\n- Check that the reason in your chosen option is actually true.',
  },
  {
    name: 'Question 3',
    question:
      'The siren of an ambulance emits sound of wavelength 0.50 m. The speed of sound in air is 340 m·s⁻¹. Calculate the frequency of the sound emitted by the siren.',
    metadata: ['fₛ = ', '[ ]', ' Hz'],
    answer: ['680', '', '', '', ''],
    presentation: 'fitb',
    type: 'calc',
    unit: 'waves_sound_light', topic: 'doppler_effect', subtopic: 'doppler_effect_calculations',
    skills: ['wave_speed_frequency_relationship'],
    difficulty: 1, exam_weight: 3, xp: 10, order: 3,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p1',
    clues:
      '- Use the wave equation v = fλ with the EMITTED wavelength.',
  },
  {
    name: 'Question 4',
    question:
      'The ambulance siren emits 680 Hz (wavelength 0.50 m). A stationary listener records a wavelength of 0.46 m as the ambulance approaches. The speed of sound is 340 m·s⁻¹. Complete the working to calculate the speed of the ambulance.',
    metadata: [
      'Frequency heard by the listener: f(L) = \\frac{v}{λ(L)} = \\frac{340}{0.46} = 739.13 Hz',
      'Source moving towards the listener: f(L) = \\frac{v}{v − vₛ}fₛ, so 739.13 = \\frac{340}{340 − vₛ}(680)',
      '340 − vₛ = \\frac{(340)(680)}{739.13} = 312.80, so vₛ (in m·s⁻¹, to two decimal places):',
      '[ ]',
    ],
    answer: ['27.20'],
    presentation: 'steps',
    type: 'calc',
    unit: 'waves_sound_light', topic: 'doppler_effect', subtopic: 'doppler_effect_calculations',
    skills: ['doppler_effect_calculation', 'wave_speed_frequency_relationship'],
    difficulty: 4, exam_weight: 3, xp: 10, order: 4,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p1',
    clues:
      '- The Doppler equation needs frequencies, not wavelengths. That is why f(L) is found first.\n- Subtract 312.80 from 340.',
  },
  {
    name: 'Question 5',
    question:
      'After passing the listener, the ambulance moves AWAY at 27.2 m·s⁻¹ while its siren still emits 680 Hz. The speed of sound is 340 m·s⁻¹. Calculate the wavelength of the sound the listener now records.',
    metadata: ['λ(L) = ', '[ ]', ' m'],
    answer: ['0.54', '', '', '', ''],
    presentation: 'fitb',
    type: 'calc',
    unit: 'waves_sound_light', topic: 'doppler_effect', subtopic: 'doppler_effect_calculations',
    skills: ['doppler_effect_calculation', 'wave_speed_frequency_relationship'],
    difficulty: 4, exam_weight: 3, xp: 10, order: 5,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p1',
    clues:
      '- First find the frequency the listener hears for a source moving away: use v + vₛ in the denominator.\n- Then use v = fλ to convert that frequency to a wavelength.',
  },
];

// ─── AI explanation (AMPM-CONTENT-AI-EXP) — one entry per exam sub-question ───

const aiExplanation = {
  sub_questions: [
    {
      number: '6.1',
      marks: 1,
      clues: '- The listener and the source record different wavelengths because the source is moving.',
      approach: '- Name the effect where relative motion between a source and a listener changes the observed frequency or wavelength.',
      solution: '1. The Doppler effect.',
    },
    {
      number: '6.2',
      marks: 2,
      clues: '- Read the graph: λ(L) = 0.40 m and λ(S) = 0.38 m.\n- Is the recorded wavelength longer or shorter than the emitted one?',
      approach: '- Compare λ(L) with λ(S) from the graph.\n- A longer recorded wavelength (lower frequency) means the source is moving away.\n- State the direction and give the comparison as the reason.',
      solution: '1. AWAY FROM the listener.\n2. Reason: the wavelength detected by the listener (0.40 m) is longer than the wavelength emitted by the source (0.38 m), so λ(L) > λ(S). Equivalently, the frequency detected is lower than the source frequency, f(L) < fₛ.',
    },
    {
      number: '6.3.1',
      marks: 3,
      clues: '- Use the EMITTED wavelength, λ(S) = 0.38 m.\n- The speed of sound is given as 343 m·s⁻¹.',
      approach: '- Use v = fλ.\n- Substitute v = 343 m·s⁻¹ and λ = 0.38 m.\n- Solve for f.',
      solution: '1. v = fλ.\n2. 343 = f(0.38).\n3. fₛ = 902.63 Hz.',
    },
    {
      number: '6.3.2',
      marks: 6,
      clues: '- First convert the listener’s wavelength (0.40 m) into a frequency.\n- The source moves away, so use v + vₛ in the denominator of the Doppler equation.',
      approach: '- Find f(L) from v = fλ with λ = 0.40 m.\n- Write f(L) = v/(v + vₛ) × fₛ (listener stationary, source moving away).\n- Substitute f(L), fₛ = 902.63 Hz and v = 343 m·s⁻¹, and solve for vₛ.',
      solution: '1. f(L) = v/λ(L) = 343/0.40 = 857.5 Hz.\n2. f(L) = v/(v + vₛ) × fₛ.\n3. 857.5 = 343/(343 + vₛ) × 902.63.\n4. 343 + vₛ = (343)(902.63)/857.5 = 361.05.\n5. vₛ = 18.05 m·s⁻¹ (range 18.05 to 18.45 m·s⁻¹).\n6. Substituting wavelengths instead of frequencies scores a maximum of 2/6.',
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
