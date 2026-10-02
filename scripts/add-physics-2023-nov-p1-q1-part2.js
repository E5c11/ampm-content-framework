#!/usr/bin/env node
/**
 * DBE Physical Sciences: Physics P1 — November 2023 — Question 1.6 (order 2)
 * Q1 Waves, Sound & Light MCQ: Doppler effect for a source moving towards a listener.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-physics-2023-nov-p1-q1-part2.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-physics-2023-nov-p1-q1-part2.js --dry-run
 *   node scripts/add-physics-2023-nov-p1-q1-part2.js
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
  name: 'Question 1.6',
  syllabus: 'dbe',
  subject: 'physics',
  year: 2023,
  paper: 'nov_p1',
  order: 2, // Q1 part 2 of 4: Waves, Sound & Light
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
      'A car sounding a hooter of constant frequency drives past a stationary pedestrian at a constant speed. Which ONE of the following describes the pitch the pedestrian hears compared with the emitted pitch?',
    metadata: [
      'Lower while approaching and higher while moving away',
      'Rising steadily while approaching, falling while moving away',
      'Higher while approaching and lower while moving away',
      'The same throughout, because the car’s speed is constant',
      '',
    ],
    answer: ['Higher while approaching and lower while moving away', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'waves_sound_light', topic: 'doppler_effect', subtopic: 'doppler_effect_qualitative',
    skills: ['doppler_effect'],
    difficulty: 2, exam_weight: 3, xp: 10, order: 1,
    syllabus: 'dbe', subject: 'physics', year: 2023, paper: 'nov_p1',
    clues:
      '- Think about whether the wavefronts are bunched together or spread out on each side of a moving source.\n- At a constant speed, the observed frequency on each side does not keep changing.',
  },
  {
    name: 'Question 2',
    question:
      'A drone emitting a sound of constant frequency flies at constant velocity directly towards a stationary observer. Match each quantity, as measured by the observer, to how it compares with the value when the drone is hovering.',
    metadata: [
      'A - Observed frequency',
      'B - Observed wavelength',
      'C - Speed of the sound waves in air',
      '1 - Shorter than when hovering',
      '2 - Unchanged',
      '3 - Higher than when hovering',
    ],
    answer: ['A-3', 'B-1', 'C-2'],
    presentation: 'match',
    type: 'application',
    unit: 'waves_sound_light', topic: 'doppler_effect', subtopic: 'doppler_effect_qualitative',
    skills: ['doppler_effect', 'wave_speed_frequency_relationship'],
    difficulty: 3, exam_weight: 3, xp: 10, order: 2,
    syllabus: 'dbe', subject: 'physics', year: 2023, paper: 'nov_p1',
    clues:
      '- The speed of sound depends only on the medium, not on the motion of the source.\n- Use v = fλ: if the speed is fixed, a change in frequency means an opposite change in wavelength.',
  },
];

// ─── AI explanation (AMPM-CONTENT-AI-EXP) — one entry per exam sub-question ───

const aiExplanation = {
  sub_questions: [
    {
      number: '1.6',
      marks: 2,
      clues: '- When a source moves towards a listener, the wavefronts in front of it are squeezed together.\n- Use v = fλ with the speed of sound unchanged.',
      approach: '- Picture the wavefronts in front of the approaching train: they are closer together than when the train is at rest.\n- Closer wavefronts mean a shorter observed wavelength.\n- With the speed of sound fixed, a shorter wavelength means a higher observed frequency (v = fλ).',
      solution: '1. The train moves towards the listener, so each wavefront is emitted closer to the previous one than if the train were stationary.\n2. The observed wavelength is therefore shorter than the emitted wavelength — so B (longer) and D (equal) are wrong.\n3. The speed of sound in air is unchanged, so from v = fλ a shorter wavelength gives a higher frequency — so C (lower) is wrong.\n4. Answer: A — the observed frequency is higher than the emitted frequency.',
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
