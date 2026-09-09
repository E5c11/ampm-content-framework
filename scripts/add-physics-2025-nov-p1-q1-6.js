#!/usr/bin/env node
/**
 * DBE Physical Sciences: Physics P1 — November 2025 — Question 1.6 (order 6)
 * The Doppler effect: redshift/blueshift and the Doppler formula for sound.
 *
 * One of 10 subsection lessons — see add-physics-2025-nov-p1-q1-1.js header note.
 *
 *   node tools/validate-questions.js --script scripts/add-physics-2025-nov-p1-q1-6.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-physics-2025-nov-p1-q1-6.js --dry-run
 *   node scripts/add-physics-2025-nov-p1-q1-6.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

const PAPER = 'https://media-dev.askmoreprepmore.app/exam_papers/dbe/physics/2025/nov_p1';

const video = {
  name: 'Question 1.6',
  syllabus: 'dbe',
  subject: 'physics',
  year: 2025,
  paper: 'nov_p1',
  order: 6,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['doppler_effect'],
  question_image_urls: [`${PAPER}/q1/question_3.png`],
  memo_image_urls: [`${PAPER}/q1/memo_1.png`],
  exam_question_marks: 2,
  supplementary_materials: [
    {
      type: 'formula_sheet',
      label: 'Formula Sheet',
      image_urls: [`${PAPER}/q0/question_1.png`, `${PAPER}/q0/question_2.png`, `${PAPER}/q0/question_3.png`],
    },
  ],
};

const questions = [
  {
    name: 'Question 1',
    question: 'A galaxy’s light spectrum, observed from Earth, shows a blueshift. Which ONE of the following statements is correct?',
    metadata: [
      'The galaxy is moving away from Earth.',
      'The wavelength of each spectral line has decreased.',
      'The frequency of each spectral line has decreased.',
      'The speed of light from the galaxy is increasing.',
      '',
    ],
    answer: ['The wavelength of each spectral line has decreased.', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'waves_sound_light',
    topic: 'doppler_effect',
    subtopic: 'doppler_effect_qualitative',
    skills: ['doppler_effect', 'redshift_blueshift'],
    difficulty: 2,
    exam_weight: 3,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p1',
    clues:
      '- Relate ‘blue’ to which end of the visible spectrum has the shorter wavelength.\n- A blueshift is the opposite case to a redshift.',
  },
  {
    name: 'Question 2',
    question:
      'An ambulance siren emits sound at a frequency of 600 Hz. The ambulance moves towards a stationary listener at 20 m·s⁻¹. The speed of sound in air is 340 m·s⁻¹. Calculate the frequency heard by the listener.',
    metadata: ['f_L = ', '[ ]', ' Hz'],
    answer: ['637.5', '', '', '', ''],
    presentation: 'fitb',
    type: 'calc',
    unit: 'waves_sound_light',
    topic: 'doppler_effect',
    subtopic: 'doppler_effect_qualitative',
    skills: ['doppler_effect_calculation', 'wave_speed_frequency_relationship'],
    difficulty: 3,
    exam_weight: 3,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p1',
    clues:
      '- Use f_L = [v / (v − v_s)] × f_s for a source moving toward a stationary listener.\n- Substitute the speed of sound, the source’s speed, and the emitted frequency.',
  },
];

const aiExplanation = {
  sub_questions: [
    {
      number: '1.6',
      marks: 2,
      clues: '- Redshift refers to a shift in the observed wavelength/frequency of light compared to its emitted values.\n- Relate ‘red’ to which end of the visible spectrum has the longer wavelength.',
      approach: '- Recall that a redshift means the observed light has shifted towards the red end of the spectrum.\n- Red light has a longer wavelength than the original (emitted) light.\n- Rule out options referring to the speed of light (constant) or frequency (which would decrease, not increase, for a redshift).',
      solution: '1. A redshift means the observed spectral lines have shifted towards the red end of the spectrum.\n2. Red light has a longer wavelength than the original (emitted) light.\n3. Since v = fλ and v (speed of light) is constant, a longer wavelength corresponds to a lower frequency, not higher — eliminates C.\n4. The speed of light does not change — eliminates A.\n5. A redshift does not by itself mean the star is moving toward Earth (that would be a blueshift) — eliminates B.\n6. The correct answer is D: the wavelength of each spectral line has increased.',
    },
  ],
  model: 'claude-sonnet-5',
  generated_at: Date.now(),
  version: 2,
  reviewed: false,
  input_tokens: 0,
  output_tokens: 0,
  avg_rating: null,
  rating_count: null,
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
  upload()
    .catch((err) => {
      console.error('\n❌ Upload failed:', err.message);
      process.exitCode = 1;
    })
    .finally(closePool);
}
