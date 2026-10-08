#!/usr/bin/env node
/**
 * DBE Geography P1 — November 2024 — Question 1.2 (order 2)
 * Valley climates (anabatic and katabatic winds, inversion, frost) and urban pollution domes by day and night.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-geography-2024-nov-p1-q1-2.js --curriculum temp/curriculum-vocab-geography-p1-2024.json
 *   node scripts/add-geography-2024-nov-p1-q1-2.js --dry-run
 *   node scripts/add-geography-2024-nov-p1-q1-2.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

// ─── Phase 2 data — the lesson/video document ────────────────────────────────
// Full field template: subject profile + core/upload-pipeline.md reference tables.

const IMG = 'https://media-dev.askmoreprepmore.app/exam_papers/dbe/geography/2024/nov_p1';

const video = {
  name: 'Question 1.2',
  syllabus: 'dbe',
  subject: 'geography',
  year: 2024,
  paper: 'nov_p1',
  order: 2,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['valley_climate', 'urban_climate'],
  question_image_urls: [
    `${IMG}/q2/question_1.png`,
  ],
  memo_image_urls: [
    `${IMG}/q2/memo_1.png`,
  ],
  exam_question_marks: 7,
  supplementary_materials: [],
};

// ─── Phase 3 data — the practice questions ───────────────────────────────────
// Per core/question-schema.md + presentations/{type}.md. Logical/authored shape
// (presentation, type, order, unit/topic/subtopic, skills, …) — the mapping to
// Postgres columns is tools/lib/content-rows.js's job.

const questions = [
  {
    name: 'Question 1',
    question: 'Match each valley climate feature to its description.',
    metadata: [
      'A - Anabatic wind',
      'B - Katabatic wind',
      'C - Inversion layer',
      'D - Thermal belt',
      '1 - Air warmed on sunlit slopes flows up the valley sides during the day',
      '2 - Air cooled on the slopes at night sinks down into the valley',
      '3 - A layer in which temperature increases with height, trapping cold air below',
      '4 - A frost-free zone on the mid-slope above the cold valley floor',
    ],
    answer: ['A-1', 'B-2', 'C-3', 'D-4'],
    presentation: 'match',
    type: 'definition',
    unit: 'climate_weather',
    topic: 'valley_climates',
    subtopic: 'valley_winds_and_frost',
    skills: ['valley_wind_formation', 'valley_climate_phenomena'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p1',
    clues: '- Separate the daytime process from the night-time ones.\n- Ask where the coldest air ends up at night and where it does not reach.',
  },
  {
    name: 'Question 2',
    question: 'A farmer in a Highveld valley wants to plant frost-sensitive citrus trees. Which site is best?',
    metadata: [
      'On the valley floor beside the river',
      'Halfway up the north-facing slope',
      'At the top of the south-facing slope',
      'On the flat valley floor behind a windbreak',
      '',
    ],
    answer: ['Halfway up the north-facing slope', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'climate_weather',
    topic: 'valley_climates',
    subtopic: 'valley_winds_and_frost',
    skills: ['frost_formation_conditions', 'slope_aspect_effects'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p1',
    clues: '- Cold air drains to the lowest point at night.\n- In the Southern Hemisphere, one slope aspect receives far more sunlight.',
  },
  {
    name: 'Question 3',
    question: 'Select ALL the conditions that make frost on a valley floor more likely.',
    metadata: [
      'A clear, cloudless night',
      'Calm or very light wind',
      'Thick cloud cover at night',
      'Cold air draining down the slopes after sunset',
      'Strong anabatic winds',
    ],
    answer: [
      'A clear, cloudless night',
      'Calm or very light wind',
      'Cold air draining down the slopes after sunset',
      '',
      '',
    ],
    presentation: 'multi_select',
    type: 'application',
    unit: 'climate_weather',
    topic: 'valley_climates',
    subtopic: 'valley_winds_and_frost',
    skills: ['frost_formation_conditions'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p1',
    clues: '- Think about how quickly the ground loses heat at night.\n- Consider whether the cold air is mixed away or left to collect.',
  },
  {
    name: 'Question 4',
    question: 'At night the pollution dome over a city is lower and more concentrated than during the day. Why?',
    metadata: [
      'Night-time traffic increases, so more pollutants are added to the dome',
      'Strong convection currents at night lift pollutants and spread them upwards',
      'The cooling ground forms an inversion that traps pollutants low down',
      'Sea breezes at night blow extra pollutants inland from the coast',
      '',
    ],
    answer: ['The cooling ground forms an inversion that traps pollutants low down', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'climate_weather',
    topic: 'urban_climates',
    subtopic: 'heat_island_and_pollution_dome',
    skills: ['pollution_dome_day_night'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p1',
    clues: '- Compare how the ground and the air above it change temperature after sunset.\n- Think about what stops air from rising.',
  },
  {
    name: 'Question 5',
    question: 'Select ALL the factors that help pollutants disperse from a pollution dome over a city.',
    metadata: [
      'A strong temperature inversion',
      'Strong winds blowing across the city',
      'Calm, still conditions',
      'Rain washing particles out of the air',
      'Daytime heating that makes air rise',
    ],
    answer: [
      'Strong winds blowing across the city',
      'Rain washing particles out of the air',
      'Daytime heating that makes air rise',
      '',
      '',
    ],
    presentation: 'multi_select',
    type: 'application',
    unit: 'climate_weather',
    topic: 'urban_climates',
    subtopic: 'heat_island_and_pollution_dome',
    skills: ['pollution_dispersal_factors'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 5,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p1',
    clues: '- Pollutants disperse when air moves, either sideways or upwards.\n- One option removes particles from the air directly.',
  },
];

// ─── AI explanation (generated in the session, AMPM-CONTENT-AI-EXP) ──────────

const aiExplanation = {
  sub_questions: [
    {
      number: '1.2.1',
      marks: 1,
      clues: '- Anabatic winds blow up the slope.\n- Check the arrow direction in each valley sketch.',
      approach: '- Find the sketch where the arrows point upslope.\n- Note the label on that sketch.',
      solution: '1. An anabatic wind is warm air moving up the valley slopes.\n2. Sketch B shows arrows pointing upslope with the label warm air.\n3. The answer is B.',
    },
    {
      number: '1.2.2',
      marks: 1,
      clues: '- An inversion forms when cold air collects below warmer air.\n- Look for cold air sinking into the valley.',
      approach: '- Find the sketch where cold air flows downslope.\n- Link the cold air on the valley floor to the warm air above it.',
      solution: '1. At night cold air drains down the slopes into the valley.\n2. It pushes the warmer air upwards, so temperature increases with height.\n3. Sketch A shows this katabatic flow, so the answer is A.',
    },
    {
      number: '1.2.3',
      marks: 1,
      clues: '- Insolation is energy from the sun.\n- Which wind needs the slopes to be heated?',
      approach: '- Link daytime heating to air rising up the slopes.\n- Match it to the sketch with upslope arrows.',
      solution: '1. During the day the sun heats the valley slopes.\n2. The warmed air rises up the slopes as an anabatic wind.\n3. Sketch B shows this, so the answer is B.',
    },
    {
      number: '1.2.4',
      marks: 1,
      clues: '- Frost needs very cold air on the valley floor.\n- Which sketch shows cold air collecting at the bottom?',
      approach: '- Link frost to cold air draining downslope at night.\n- Match it to the sketch with downslope arrows.',
      solution: '1. Cold, dense air sinks down the slopes at night and collects on the valley floor.\n2. When the temperature drops below 0 °C, frost forms there.\n3. Sketch A shows this, so the answer is A.',
    },
    {
      number: '1.2.5',
      marks: 1,
      clues: '- At night the air above a city is stable.\n- Compare the height of the dome in the two sketches.',
      approach: '- Link a low, flat dome with sinking air to night-time conditions.\n- Match it to the correct sketch.',
      solution: '1. At night the surface cools and an inversion caps the city.\n2. The pollution dome is pushed low over the city, with air sinking.\n3. Sketch B shows the low dome with downward arrows, so the answer is B.',
    },
    {
      number: '1.2.6',
      marks: 1,
      clues: '- Dispersal happens when air carries pollutants upwards.\n- Look for upward arrows.',
      approach: '- Link daytime convection to a tall, spread-out dome.\n- Match it to the sketch.',
      solution: '1. During the day the city is heated and air rises by convection.\n2. Pollutants are carried higher and spread out over a larger area.\n3. Sketch A shows the tall dome with upward arrows, so the answer is A.',
    },
    {
      number: '1.2.7',
      marks: 1,
      clues: '- A denser concentration means the pollutants are packed into a smaller space.\n- Which dome is lower and smaller?',
      approach: '- Compare the size of the two domes.\n- Link the smaller dome to the higher concentration.',
      solution: '1. In sketch B the dome is low and close to the buildings.\n2. The same pollutants are packed into a smaller volume of air.\n3. The concentration is denser, so the answer is B.',
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
    console.error(
      '\n   curriculum_nodes / skills → node tools/create-curriculum-node.js | create-skill.js' +
      '\n   tags → node tools/create-tag.js',
    );
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

  // Exam gate (VER-02/VER-04, tools/apply-exam-gate.js): derive the exam's minimum app version from the rows now in the
  // database and write it to exam_versions, bumping updated_at on the exam's rows. Dev only; a no-op when the derived
  // minimum is the floor (VER-07); idempotent. The gate is per EXAM, so it also gates the sibling papers.
  if (!DRY_RUN && ENV === 'dev') {
    const { applyExamGates } = require('../tools/lib/exam-gate');
    await applyExamGates(pool, { env: ENV, apply: true, filter: { subject: video.subject, syllabus: video.syllabus, year: String(video.year) } });
  } else if (DRY_RUN) {
    console.log('   (dry-run: the exam gate is derived and written after a real upload — node tools/apply-exam-gate.js shows it)');
  }
}

// Only run when invoked directly — so validate-questions.js (and anything else) can load
// this file for its data blocks without opening a DB connection or writing anything.
if (require.main === module) {
  upload()
    .catch((err) => {
      console.error('\n❌ Upload failed:', err.message);
      process.exitCode = 1;
    })
    .finally(closePool);
}
