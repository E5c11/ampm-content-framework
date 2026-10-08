#!/usr/bin/env node
/**
 * DBE Geography P1 — November 2024 — Question 1.1 (order 1)
 * Subtropical anticyclones: seasonal pressure patterns, fetch, ridging, berg winds, coastal lows and the inversion layer.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-geography-2024-nov-p1-q1-1.js --curriculum temp/curriculum-vocab-geography-p1-2024.json
 *   node scripts/add-geography-2024-nov-p1-q1-1.js --dry-run
 *   node scripts/add-geography-2024-nov-p1-q1-1.js
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
  name: 'Question 1.1',
  syllabus: 'dbe',
  subject: 'geography',
  year: 2024,
  paper: 'nov_p1',
  order: 1,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['synoptic_weather_maps', 'subtropical_anticyclones'],
  question_image_urls: [
    `${IMG}/q1/question_1.png`,
    `${IMG}/q1/question_2.png`,
  ],
  memo_image_urls: [
    `${IMG}/q1/memo_1.png`,
  ],
  exam_question_marks: 8,
  supplementary_materials: [],
};

// ─── Phase 3 data — the practice questions ───────────────────────────────────
// Per core/question-schema.md + presentations/{type}.md. Logical/authored shape
// (presentation, type, order, unit/topic/subtopic, skills, …) — the mapping to
// Postgres columns is tools/lib/content-rows.js's job.

const questions = [
  {
    name: 'Question 1',
    question: 'Match each pressure feature over South Africa to the weather or process it brings.',
    metadata: [
      'A - High-pressure cell over the interior plateau',
      'B - Heat low over the interior plateau',
      'C - Ridging of the South Atlantic High',
      'D - Seasonal shift of the ITCZ',
      '1 - Subsiding air, clear skies and frosty nights in the interior',
      '2 - Rising air that draws in moisture and triggers thunderstorms',
      '3 - Cool, moist air pushed along the south coast behind a front',
      '4 - Pressure belts moving north in winter and south in summer',
    ],
    answer: ['A-1', 'B-2', 'C-3', 'D-4'],
    presentation: 'match',
    type: 'application',
    unit: 'climate_weather',
    topic: 'subtropical_anticyclones',
    subtopic: 'synoptic_pressure_systems',
    skills: ['anticyclone_surface_features', 'seasonal_pressure_cell_shift'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p1',
    clues: '- Decide for each feature whether air is sinking or rising.\n- Sinking air dries out the sky; rising air builds cloud.',
  },
  {
    name: 'Question 2',
    question: 'In summer the South Indian High lies far east of Madagascar, while in winter it lies close to the KwaZulu-Natal coast. Why does the summer position bring more moisture to the east coast?',
    metadata: [
      'The high lies closer to land, so the air reaches the coast more quickly',
      'Its air crosses a longer stretch of warm ocean on the way',
      'Air subsiding over the warm ocean adds water vapour to the high',
      'The high blocks the westerly waves, so cold fronts bring rain inland',
      '',
    ],
    answer: ['Its air crosses a longer stretch of warm ocean on the way', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'climate_weather',
    topic: 'subtropical_anticyclones',
    subtopic: 'synoptic_pressure_systems',
    skills: ['pressure_cell_air_movement'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p1',
    clues: '- Think about where air picks up its moisture.\n- Compare how far the air must travel over water in each season.',
  },
  {
    name: 'Question 3',
    question: 'A coastal low lies on the south coast while a strong high-pressure cell sits over the interior plateau. Select ALL the statements that explain why a hot, dry berg wind blows at the coast.',
    metadata: [
      'Moist onshore air rises over the escarpment and cools',
      'Air flows from high pressure over the plateau towards the low at the coast',
      'The air sinks down the escarpment and warms adiabatically',
      'A heat low over the interior pulls air inland from the ocean',
      'The air reaches the coast with very low humidity',
    ],
    answer: [
      'Air flows from high pressure over the plateau towards the low at the coast',
      'The air sinks down the escarpment and warms adiabatically',
      'The air reaches the coast with very low humidity',
      '',
      '',
    ],
    presentation: 'multi_select',
    type: 'application',
    unit: 'climate_weather',
    topic: 'subtropical_anticyclones',
    subtopic: 'berg_winds_and_veld_fires',
    skills: ['berg_wind_warm_dry_processes'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p1',
    clues: '- Follow the air from where the pressure is high to where it is low.\n- Air that descends is compressed.',
  },
  {
    name: 'Question 4',
    question: 'Which sequence correctly shows the path a coastal low follows around South Africa?',
    metadata: [
      'East coast, then south coast, then west coast',
      'Interior plateau, then west coast, then south coast',
      'West coast, then south coast, then east coast',
      'South coast, then interior plateau, then east coast',
      '',
    ],
    answer: ['West coast, then south coast, then east coast', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'interpretation',
    unit: 'climate_weather',
    topic: 'subtropical_anticyclones',
    subtopic: 'synoptic_pressure_systems',
    skills: ['coastal_low_movement'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p1',
    clues: '- Coastal lows stay at the coast, trapped below the escarpment.\n- They travel ahead of the eastward-moving cold fronts.',
  },
  {
    name: 'Question 5',
    question: 'In summer the inversion layer over the eastern escarpment lies higher than it does in winter. Why does this favour thunderstorms and hail over the interior?',
    metadata: [
      'The inversion traps cold air at the surface, so frost and fog form',
      'Sinking air below the inversion warms and dries, so clouds evaporate',
      'The inversion blocks moist ocean air, so only light drizzle falls',
      'Rising moist air can climb higher, so tall cumulonimbus clouds grow',
      '',
    ],
    answer: ['Rising moist air can climb higher, so tall cumulonimbus clouds grow', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'climate_weather',
    topic: 'subtropical_anticyclones',
    subtopic: 'synoptic_pressure_systems',
    skills: ['inversion_layer_effects'],
    difficulty: 4,
    exam_weight: 2,
    xp: 10,
    order: 5,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p1',
    clues: '- An inversion acts like a lid on rising air.\n- Consider what happens to cloud growth when the lid is raised.',
  },
];

// ─── AI explanation (generated in the session, AMPM-CONTENT-AI-EXP) ──────────

const aiExplanation = {
  sub_questions: [
    {
      number: '1.1.1',
      marks: 1,
      clues: '- Look at where the high-pressure cells sit in sketch A.\n- A high over the interior means the pressure belt has moved north.',
      approach: '- Find the interior high in sketch A.\n- Recall in which season the Kalahari High dominates the plateau.',
      solution: '1. Sketch A shows a high-pressure cell over the interior and the oceanic highs close to the coast.\n2. The pressure belt sits furthest north when the sun is overhead in the Northern Hemisphere.\n3. This is the typical winter pattern, so the answer is C (winter).',
    },
    {
      number: '1.1.2',
      marks: 1,
      clues: '- Sketch B shows a low over the interior instead of a high.\n- Think about what the summer sun does to the land.',
      approach: '- Recall how a thermal low forms.\n- Choose the option that describes a heating process.',
      solution: '1. In summer the interior plateau is heated strongly by the sun.\n2. Hot air expands and rises, lowering the surface pressure.\n3. The low is a heat low formed by intense heating, so the answer is B.',
    },
    {
      number: '1.1.3',
      marks: 1,
      clues: '- Look at the shape of the isobars of the South Atlantic High in sketch B.\n- The high stretches eastwards along the south coast.',
      approach: '- Recall the term for a high-pressure cell extending into a tongue.\n- Rule out the terms that describe wind direction or air movement.',
      solution: '1. The isobars of the South Atlantic High are stretched eastwards around the coast.\n2. This elongation of a high-pressure cell is called ridging.\n3. The answer is C (ridging).',
    },
    {
      number: '1.1.4',
      marks: 1,
      clues: '- Compare the positions of the highs in sketches A and B.\n- Think about what moves north and south with the overhead sun.',
      approach: '- Link the seasonal movement of the pressure belts to the heat equator.\n- Choose the option that moves with the seasons.',
      solution: '1. The highs lie further north in winter and further south in summer.\n2. They follow the seasonal shift of the ITCZ and the overhead sun.\n3. The answer is C (shifting of the ITCZ).',
    },
    {
      number: '1.1.5',
      marks: 1,
      clues: '- Moisture is picked up while air moves over the ocean.\n- Compare how far the South Indian High is from the coast in each sketch.',
      approach: '- Measure in your mind the distance the air travels over water in sketch B.\n- Link a longer distance over water to more moisture.',
      solution: '1. In sketch B the South Indian High lies further from the coast than in sketch A.\n2. Air travelling from it crosses a longer stretch of warm ocean (a larger fetch).\n3. It collects more moisture on the way, so the answer is B.',
    },
    {
      number: '1.1.6',
      marks: 1,
      clues: '- The low in sketch A is a coastal low on the south coast.\n- Coastal lows move around the coast in one direction.',
      approach: '- Recall the path of coastal lows around South Africa.\n- State the direction they move along the south coast.',
      solution: '1. The low in sketch A is a coastal low trapped below the escarpment.\n2. Coastal lows travel from the west coast around to the east coast.\n3. Along the south coast it moves eastwards, so the answer is C (easterly).',
    },
    {
      number: '1.1.7',
      marks: 1,
      clues: '- Berg winds need a high over the interior and a low at the coast.\n- Look for both features in sketch A.',
      approach: '- Identify the high-pressure cell over the plateau.\n- Identify the low on the coast that draws the air down.',
      solution: '1. Berg winds blow from the high over the plateau down to a low at the coast.\n2. Sketch A shows the Kalahari anticyclone inland and a coastal low on the south coast.\n3. The answer is A: (i) and (ii).',
    },
    {
      number: '1.1.8',
      marks: 1,
      clues: '- Sketch B is the summer pattern with a heat low over the interior.\n- In summer the inversion over the escarpment is weaker and higher.',
      approach: '- Think about how high moist air can rise before the inversion stops it.\n- Link tall cloud growth to the type of precipitation.',
      solution: '1. In summer the inversion over the escarpment lies high and is weak.\n2. Moist air from the Indian Ocean can rise far enough to form tall cumulonimbus clouds.\n3. These clouds bring rainfall and hail, so the answer is C: (ii) and (iv).',
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
