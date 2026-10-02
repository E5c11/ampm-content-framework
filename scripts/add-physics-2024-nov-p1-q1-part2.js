#!/usr/bin/env node
/**
 * DBE Physical Sciences: Physics P1 — November 2024 — Question 1.6 (order 2)
 * Q1 Waves, Sound & Light MCQ: red shift of a star's absorption spectrum (Doppler effect).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-physics-2024-nov-p1-q1-part2.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-physics-2024-nov-p1-q1-part2.js --dry-run
 *   node scripts/add-physics-2024-nov-p1-q1-part2.js
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
  name: 'Question 1.6',
  syllabus: 'dbe',
  subject: 'physics',
  year: 2024,
  paper: 'nov_p1',
  order: 2, // Q1 clustered by CAPS knowledge area (DESIGN-UNI-10) — part 2 of 4: Waves, Sound & Light
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['doppler_effect'],
  question_image_urls: [`${PAPER}/q1/question_4.png`],
  memo_image_urls: [`${PAPER}/q1/memo_1.png`],
  exam_question_marks: 2,
  supplementary_materials: [FORMULA_SHEET],
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    name: 'Question 1',
    question:
      'The absorption lines in the spectrum of a distant galaxy are observed on Earth to be BLUE shifted. Which combination is CORRECT for the galaxy’s motion and the observed wavelength of its light?',
    metadata: [
      'Moving away from Earth; observed wavelength longer',
      'Moving towards Earth; observed wavelength longer',
      'Moving towards Earth; observed wavelength shorter',
      'Moving away from Earth; observed wavelength shorter',
      '',
    ],
    answer: ['Moving towards Earth; observed wavelength shorter', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'waves_sound_light', topic: 'doppler_effect', subtopic: 'doppler_effect_qualitative',
    skills: ['redshift_blueshift', 'doppler_effect'],
    difficulty: 2, exam_weight: 3, xp: 10, order: 1,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p1',
    clues:
      '- Blue light has a shorter wavelength than red light.\n- A source moving towards an observer squashes the waves together.',
  },
  {
    name: 'Question 2',
    question:
      'The spectral lines of a star are observed on Earth to be RED shifted. Select ALL the statements that are CORRECT.',
    metadata: [
      'The star is moving towards the Earth',
      'The observed frequency of each line is lower than the emitted frequency',
      'The observed wavelength of each line is longer than the emitted wavelength',
      'The star is moving away from the Earth',
      'The lines are shifted towards the violet end of the spectrum',
    ],
    answer: [
      'The observed frequency of each line is lower than the emitted frequency',
      'The observed wavelength of each line is longer than the emitted wavelength',
      'The star is moving away from the Earth',
      '',
      '',
    ],
    presentation: 'multi_select',
    type: 'application',
    unit: 'waves_sound_light', topic: 'doppler_effect', subtopic: 'doppler_effect_qualitative',
    skills: ['redshift_blueshift', 'wave_speed_frequency_relationship'],
    difficulty: 3, exam_weight: 3, xp: 10, order: 2,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p1',
    clues:
      '- Red is at the long-wavelength, low-frequency end of the visible spectrum.\n- The speed of light does not change, so if the wavelength goes up the frequency must go down (c = fλ).',
  },
];

// ─── AI explanation (AMPM-CONTENT-AI-EXP) — one entry per exam sub-question ───

const aiExplanation = {
  sub_questions: [
    {
      number: '1.6',
      marks: 2,
      clues: '- A red shift means the observed lines move towards the red (long-wavelength) end.\n- Longer wavelength means lower frequency.',
      approach: '- Decide what a red shift means for the observed wavelength and frequency.\n- Use the Doppler effect to link a longer wavelength to the direction the star is moving.\n- Pick the option with both parts correct.',
      solution: '1. Red shift: the observed wavelengths are longer than the emitted wavelengths.\n2. Since c = fλ and c is constant, a longer wavelength means a lower (decreased) frequency.\n3. A source moving away from the observer stretches the waves, so the star is moving away from Earth.\n4. Answer: A — away from Earth; decreased.',
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
