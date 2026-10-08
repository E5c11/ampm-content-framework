#!/usr/bin/env node
/**
 * DBE Geography P1 — November 2024 — Question 1.3 (order 3)
 * Mid-latitude cyclones: movement with the westerlies, cold-front uplift and cumulonimbus, sector temperatures and managing heavy-rainfall impacts.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-geography-2024-nov-p1-q1-3.js --curriculum temp/curriculum-vocab-geography-p1-2024.json
 *   node scripts/add-geography-2024-nov-p1-q1-3.js --dry-run
 *   node scripts/add-geography-2024-nov-p1-q1-3.js
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
  name: 'Question 1.3',
  syllabus: 'dbe',
  subject: 'geography',
  year: 2024,
  paper: 'nov_p1',
  order: 3,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['mid_latitude_cyclone', 'cold_front'],
  question_image_urls: [
    `${IMG}/q3/question_1.png`,
  ],
  memo_image_urls: [
    `${IMG}/q3/memo_1.png`,
  ],
  exam_question_marks: 15,
  supplementary_materials: [],
};

// ─── Phase 3 data — the practice questions ───────────────────────────────────
// Per core/question-schema.md + presentations/{type}.md. Logical/authored shape
// (presentation, type, order, unit/topic/subtopic, skills, …) — the mapping to
// Postgres columns is tools/lib/content-rows.js's job.

const questions = [
  {
    name: 'Question 1',
    question: 'A cold front linked to a mid-latitude cyclone passes over Cape Town. A day later, where is the same system most likely to be?',
    metadata: [
      'Further west, because the south-east trades carry it westwards',
      'Further north, because the interior high draws it inland',
      'Still over Cape Town, because these systems are stationary',
      'Further east, because the westerly winds carry it eastwards',
      '',
    ],
    answer: ['Further east, because the westerly winds carry it eastwards', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'climate_weather',
    topic: 'mid_latitude_cyclones',
    subtopic: 'cyclone_development_and_fronts',
    skills: ['mlc_movement_westerlies'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p1',
    clues: '- Mid-latitude cyclones form in the belt between about 35° and 65° S.\n- Think about the planetary wind that blows in that belt.',
  },
  {
    name: 'Question 2',
    question: 'Why does a cold front produce towering cumulonimbus cloud, while a warm front produces layered cloud?',
    metadata: [
      'The cold front is steep, so warm air is lifted rapidly; the warm front slopes gently, so air rises slowly',
      'The cold front slopes gently, so warm air rises slowly; the warm front is steep, so air is lifted rapidly',
      'The cold front carries moist ocean air, while the warm front carries only dry air from the interior',
      'Both fronts are equally steep, but the cold front moves over warmer ocean water than the warm front',
      '',
    ],
    answer: [
      'The cold front is steep, so warm air is lifted rapidly; the warm front slopes gently, so air rises slowly',
      '',
      '',
      '',
      '',
    ],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'climate_weather',
    topic: 'mid_latitude_cyclones',
    subtopic: 'cyclone_development_and_fronts',
    skills: ['cold_front_weather_formation'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p1',
    clues: '- Compare the slope of each front in a cross-section.\n- The speed at which air rises controls how tall the cloud grows.',
  },
  {
    name: 'Question 3',
    question: 'In a cross-section of a mature mid-latitude cyclone, station X lies behind the cold front, station Y lies in the warm sector and station Z lies ahead of the warm front. Which station most likely records the highest temperature?',
    metadata: [
      'X, because cold polar air arrives behind the cold front',
      'Y, because subtropical air fills the warm sector',
      'Z, because rising cloud heats the air ahead of the warm front',
      'All three, because the cyclone mixes the air evenly',
      '',
    ],
    answer: ['Y, because subtropical air fills the warm sector', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'interpretation',
    unit: 'climate_weather',
    topic: 'mid_latitude_cyclones',
    subtopic: 'cyclone_development_and_fronts',
    skills: ['cold_front_cross_section'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p1',
    clues: '- Identify which air mass sits at the surface at each station.\n- Only one part of the cyclone is filled with air from lower latitudes.',
  },
  {
    name: 'Question 4',
    question: 'Heavy rain from a mid-latitude cyclone floods low-lying suburbs and washes soil off steep slopes. Select ALL the strategies that would reduce these environmental impacts.',
    metadata: [
      'Conserve wetlands so they absorb and slowly release floodwater',
      'Terrace and contour-plough slopes to slow surface run-off',
      'Clear natural vegetation from river banks to widen the channel',
      'Build gabions and retaining walls on unstable slopes',
      'Pave open ground so that rainwater drains away faster',
    ],
    answer: [
      'Conserve wetlands so they absorb and slowly release floodwater',
      'Terrace and contour-plough slopes to slow surface run-off',
      'Build gabions and retaining walls on unstable slopes',
      '',
      '',
    ],
    presentation: 'multi_select',
    type: 'application',
    unit: 'climate_weather',
    topic: 'mid_latitude_cyclones',
    subtopic: 'cyclone_development_and_fronts',
    skills: ['heavy_rainfall_impact_management'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p1',
    clues: '- Good strategies slow the water down or hold the soil in place.\n- Be wary of options that remove protection or speed up run-off.',
  },
  {
    name: 'Question 5',
    question: 'Match each strategy to the heavy-rainfall impact it is designed to reduce.',
    metadata: [
      'A - Contour ploughing',
      'B - Catch nets and canopies',
      'C - Artificial levees',
      'D - Early-warning systems',
      '1 - Soil washed off cultivated slopes',
      '2 - Rocks falling onto roads in mountain passes',
      '3 - Rivers overflowing onto built-up flood plains',
      '4 - People caught unprepared by flash floods',
    ],
    answer: ['A-1', 'B-2', 'C-3', 'D-4'],
    presentation: 'match',
    type: 'application',
    unit: 'climate_weather',
    topic: 'mid_latitude_cyclones',
    subtopic: 'cyclone_development_and_fronts',
    skills: ['heavy_rainfall_impact_management'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 5,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p1',
    clues: '- Ask where each strategy is built or used: on farmland, on a cliff, beside a river or in a community.',
  },
];

// ─── AI explanation (generated in the session, AMPM-CONTENT-AI-EXP) ──────────

const aiExplanation = {
  sub_questions: [
    {
      number: '1.3.1',
      marks: 1,
      clues: '- Look at the arrow under the cross-section.\n- Read the compass letters at each end.',
      approach: '- Follow the direction-of-movement arrow.\n- Give the general direction in one word or phrase.',
      solution: '1. The arrow in the sketch runs from W towards E.\n2. Mid-latitude cyclones travel from west to east.\n3. Answer: eastwards (west to east).',
    },
    {
      number: '1.3.2',
      marks: 2,
      clues: '- Think about the planetary wind belt in which these cyclones form.\n- That wind steers them.',
      approach: '- Name the wind belt between about 35° and 65° S.\n- Link the wind direction to the movement of the cyclone.',
      solution: '1. Mid-latitude cyclones form in the westerly wind belt.\n2. The westerlies blow from west to east and carry the cyclones with them.\n3. Answer: they are driven by the westerlies.',
    },
    {
      number: '1.3.3',
      marks: 4,
      clues: '- Front A is the steep cold front on the west side.\n- Explain what happens to the warm air ahead of it.',
      approach: '- Describe how the cold air meets the warm air.\n- Explain how fast the warm air rises and what happens as it cools.\n- Give two fully explained points for four marks.',
      solution: '1. The cold, dense air behind front A undercuts the warmer air ahead of it.\n2. The steep slope of the front forces the warm air to rise rapidly.\n3. The rising air cools quickly and condenses, building tall cumulonimbus clouds.',
    },
    {
      number: '1.3.4',
      marks: 8,
      clues: '- Think about the damage heavy rain causes: floods, soil erosion, rockfalls and mass movement.\n- For each strategy, say what it does and how it reduces the damage.',
      approach: '- Choose four different strategies.\n- Explain each one in a full sentence (fact plus qualification).\n- Cover both flooding and slope damage.\n- Write as one paragraph of about eight lines.',
      solution: '1. Keeping natural vegetation and planting trees slows run-off and holds soil in place.\n2. Effective drainage systems, artificial levees and widened or canalised channels carry floodwater away from settlements.\n3. Terracing, contour ploughing, gabions and retaining walls reduce soil erosion and mass movement on slopes.\n4. Conserving wetlands, building dams or weirs and using early-warning systems and education reduce the impact on people and the environment.\n5. Any four such strategies, each explained, earn the eight marks.',
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
