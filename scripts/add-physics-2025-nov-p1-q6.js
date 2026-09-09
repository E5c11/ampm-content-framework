#!/usr/bin/env node
/**
 * DBE Physical Sciences: Physics P1 — November 2025 — Question 6 (order 9)
 * The Doppler effect: an ambulance siren experiment (source moving toward/away from
 * a stationary detector), one continuous scenario/graph across 6.1-6.4 — bundled
 * per DESIGN-UNI-10.
 *
 *   node tools/validate-questions.js --script scripts/add-physics-2025-nov-p1-q6.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-physics-2025-nov-p1-q6.js --dry-run
 *   node scripts/add-physics-2025-nov-p1-q6.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env') ? process.argv[process.argv.indexOf('--env') + 1] : 'dev';
const PAPER = 'https://media-dev.askmoreprepmore.app/exam_papers/dbe/physics/2025/nov_p1';

const video = {
  name: 'Question 6',
  syllabus: 'dbe',
  subject: 'physics',
  year: 2025,
  paper: 'nov_p1',
  order: 9,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['doppler_effect_experiment', 'doppler_effect'],
  question_image_urls: [`${PAPER}/q6/question_1.png`],
  memo_image_urls: [`${PAPER}/q6/memo_1.png`, `${PAPER}/q6/memo_2.png`],
  exam_question_marks: 12,
  supplementary_materials: [
    { type: 'formula_sheet', label: 'Formula Sheet', image_urls: [`${PAPER}/q0/question_1.png`, `${PAPER}/q0/question_2.png`, `${PAPER}/q0/question_3.png`] },
  ],
};

const questions = [
  {
    name: 'Question 1',
    question: 'A train sounds its horn at a constant frequency as it moves. Which ONE of the following best describes the Doppler effect a stationary observer would experience?',
    metadata: [
      'The horn’s actual frequency changes as the train moves.',
      'The observed frequency differs from the horn’s actual frequency, due to the relative motion between the train and the observer.',
      'The observer hears a constant frequency regardless of the train’s motion.',
      'The speed of sound changes because the train is moving.',
      '',
    ],
    answer: ['The observed frequency differs from the horn’s actual frequency, due to the relative motion between the train and the observer.', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'waves_sound_light', topic: 'doppler_effect', subtopic: 'doppler_effect_experiment',
    skills: ['doppler_effect'],
    difficulty: 2, exam_weight: 3, xp: 10, order: 1,
    syllabus: 'dbe', subject: 'physics', year: 2025, paper: 'nov_p1',
    clues: '- The Doppler effect is about the *observed* frequency, not the source’s actual frequency.\n- It happens whenever there is relative motion between the source and the observer.',
  },
  {
    name: 'Question 2',
    question:
      'A student investigates how the detected frequency of a car’s horn depends on the car’s speed as it approaches a stationary listener. The horn’s frequency, the speed of sound, and the distance to the listener are kept the same each time; only the car’s speed is changed. Which quantity is the independent variable in this experiment?',
    metadata: ['The detected frequency', 'The car’s speed', 'The horn’s frequency', 'The speed of sound', ''],
    answer: ['The car’s speed', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'interpretation',
    unit: 'waves_sound_light', topic: 'doppler_effect', subtopic: 'doppler_effect_experiment',
    skills: ['experimental_variables'],
    difficulty: 2, exam_weight: 2, xp: 10, order: 2,
    syllabus: 'dbe', subject: 'physics', year: 2025, paper: 'nov_p1',
    clues: '- The independent variable is the one the experimenter deliberately changes between trials.\n- The detected frequency is what is being measured (the dependent variable) — it isn’t the one changed on purpose.',
  },
  {
    name: 'Question 3',
    question:
      'In an experiment, a sound source moves away from a stationary detector at increasing speeds across several trials. Based on the Doppler effect, what conclusion can be drawn about the detected frequency as the source’s speed increases?',
    metadata: [
      'The detected frequency increases as the source’s speed increases.',
      'The detected frequency decreases as the source’s speed increases.',
      'The detected frequency stays the same, regardless of the source’s speed.',
      'The detected frequency becomes unpredictable at higher speeds.',
      '',
    ],
    answer: ['The detected frequency decreases as the source’s speed increases.', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'interpretation',
    unit: 'waves_sound_light', topic: 'doppler_effect', subtopic: 'doppler_effect_experiment',
    skills: ['experimental_variables', 'doppler_effect'],
    difficulty: 2, exam_weight: 2, xp: 10, order: 3,
    syllabus: 'dbe', subject: 'physics', year: 2025, paper: 'nov_p1',
    clues: '- The source is moving away from the detector — think about which Doppler case this is (compare to a source moving toward a detector).\n- A source moving away stretches the wavelength reaching the detector.',
  },
  {
    name: 'Question 4',
    question:
      'Complete the working to find the speed of sound in air. A train’s horn emits sound at frequency fₛ. A stationary detector measures a frequency of 900 Hz as the train approaches at a constant speed of 30 m·s⁻¹, and 700 Hz as the same train moves away at the same speed.',
    metadata: [
      'Approaching: 900 = \frac{v}{v − 30}fₛ … eq (1)',
      'Moving away: 700 = \frac{v}{v + 30}fₛ … eq (2)',
      'Dividing eq (1) by eq (2): \frac{900}{700} = \frac{v + 30}{v − 30}, so v (in m·s⁻¹):',
      '[ ]',
    ],
    answer: ['240'],
    presentation: 'steps',
    type: 'calc',
    unit: 'waves_sound_light', topic: 'doppler_effect', subtopic: 'doppler_effect_experiment',
    skills: ['doppler_effect_calculation', 'speed_of_sound_calculation'],
    difficulty: 5, exam_weight: 3, xp: 10, order: 4,
    syllabus: 'dbe', subject: 'physics', year: 2025, paper: 'nov_p1',
    clues:
      '- Write the Doppler equation for the receding case the same way the approaching one is given.\n- Divide one equation by the other to eliminate fₛ, then solve for v.',
  },
  {
    name: 'Question 5',
    question:
      'A train sounds its horn at 500 Hz while approaching a stationary listener at 20 m·s⁻¹. The speed of sound in air is 340 m·s⁻¹. Calculate the frequency heard by the listener.',
    metadata: ['fₗ = ', '[ ]', ' Hz'],
    answer: ['531.25', '', '', '', ''],
    presentation: 'fitb',
    type: 'calc',
    unit: 'waves_sound_light', topic: 'doppler_effect', subtopic: 'doppler_effect_experiment',
    skills: ['doppler_effect_calculation'],
    difficulty: 3, exam_weight: 3, xp: 10, order: 5,
    syllabus: 'dbe', subject: 'physics', year: 2025, paper: 'nov_p1',
    clues: '- Use fₗ = \frac{v}{v − vₛ} × fₛ for a source moving toward a stationary listener.\n- Substitute the speed of sound, the train’s speed, and the emitted frequency.',
  },
];

const aiExplanation = {
  sub_questions: [
    {
      number: '6.1', marks: 2,
      clues: '- The Doppler effect is about a change in what a listener detects, not a change in the source itself.\n- It depends on relative motion, not just motion of the source alone.',
      approach: '- Identify that the Doppler effect concerns a change in *detected* frequency (or pitch).\n- State that this happens due to relative motion between the source and the observer.',
      solution: '1. The Doppler effect is the change in frequency (or pitch) of the sound detected by a listener, because the sound source and the listener have different velocities relative to the medium of sound propagation.',
    },
    {
      number: '6.2.1', marks: 1,
      clues: '- The independent variable is the one deliberately changed between trials.',
      approach: '- Identify what the experimenter changes on purpose across the different trials.',
      solution: '1. The velocity/speed of the ambulance (the source).',
    },
    {
      number: '6.2.2', marks: 1,
      clues: '- A controlled variable is kept the same across all trials, other than the independent variable.',
      approach: '- Identify a quantity that stays fixed throughout the experiment.',
      solution: '1. The frequency of the sound produced by the ambulance siren (or the speed of sound / density / temperature of the air, or that the detector is stationary).',
    },
    {
      number: '6.3', marks: 2,
      clues: '- Part B is the ambulance moving away from the detector — look at the graph’s trend for this line as velocity increases.',
      approach: '- Read the trend of the Part B line on the graph as the ambulance’s velocity increases.\n- State the relationship as a conclusion (not just a description of the line).',
      solution: '1. As the velocity of the ambulance increases, the detected frequency decreases.',
    },
    {
      number: '6.4', marks: 6,
      clues: '- Write the Doppler equation for both Part A (approaching, 1298 Hz) and Part B (moving away, 1115 Hz) at vₛ = 25 m·s⁻¹ — both share the same unknowns v (speed of sound) and fₛ.\n- Divide the two equations to eliminate fₛ and solve for v.',
      approach: '- Write fₗ = v/(v − vₛ)·fₛ for the approaching case and fₗ = v/(v + vₛ)·fₛ for the receding case.\n- Substitute the known values from the graph into each to get two equations in v and fₛ.\n- Solve the two equations simultaneously for v.',
      solution: '1. Approaching: 1298 = [v/(v − 25)]fₛ ⇒ fₛ = 1298(v − 25)/v … eq (1)\n2. Moving away: 1115 = [v/(v + 25)]fₛ ⇒ fₛ = 1115(v + 25)/v … eq (2)\n3. Setting eq (1) = eq (2): 1298(v − 25) = 1115(v + 25)\n4. v = 329.64 m·s⁻¹',
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
