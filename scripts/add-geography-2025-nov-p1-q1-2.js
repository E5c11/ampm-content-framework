#!/usr/bin/env node
/**
 * DBE Geography P1 — November 2025 — Question 1.2 (order 2)
 * Valley climates: slope aspect, hemisphere clue, anabatic/katabatic winds, terrestrial radiation, frost vs fog, impact of frost (7 x 1).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-geography-2025-nov-p1-q1-2.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-geography-2025-nov-p1-q1-2.js --dry-run
 *   node scripts/add-geography-2025-nov-p1-q1-2.js
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

const IMG = 'https://media-dev.askmoreprepmore.app/exam_papers/dbe/geography/2025/nov_p1';

const video = {
  name: 'Question 1.2',
  syllabus: 'dbe',
  subject: 'geography',
  year: 2025,
  paper: 'nov_p1',
  order: 2,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['valley_climate', 'slope_aspect'],
  question_image_urls: [`${IMG}/q2/question_1.png`, `${IMG}/q2/question_2.png`],
  memo_image_urls: [`${IMG}/q2/memo_1.png`],
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
    question: 'A farmer in the Western Cape wants to plant a heat-loving crop on the warmer of two opposite valley slopes. Which slope should be chosen, and why?',
    metadata: [
      'The south-facing slope, because it faces the midday sun and is warmer',
      'The north-facing slope, because it is shaded and holds more moisture',
      'The north-facing slope, because it receives more direct sunlight and so is warmer and drier',
      'The south-facing slope, because cold air drains onto it and dries it out',
      '',
    ],
    answer: ['The north-facing slope, because it receives more direct sunlight and so is warmer and drier', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'climate_weather',
    topic: 'valley_climates',
    subtopic: 'valley_winds_and_frost',
    skills: ['slope_aspect_effects'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p1',
    clues: '- In the Southern Hemisphere the midday sun is not overhead but sits towards one side of the sky.\n- The slope facing the sun receives more energy per square metre.',
  },
  {
    name: 'Question 2',
    question: 'Just after sunset on a clear night, a hiker feels cold air flowing down the side of a valley. Which combination correctly names the wind and the condition that drives it?',
    metadata: [
      'Anabatic wind, driven by solar radiation heating the slope',
      'Katabatic wind, driven by heat loss through terrestrial radiation from the slope',
      'Katabatic wind, driven by solar radiation heating the valley floor',
      'Anabatic wind, driven by terrestrial radiation cooling the slope',
      '',
    ],
    answer: ['Katabatic wind, driven by heat loss through terrestrial radiation from the slope', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'climate_weather',
    topic: 'valley_climates',
    subtopic: 'valley_winds_and_frost',
    skills: ['valley_wind_formation'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p1',
    clues: '- The direction of flow (downslope or upslope) tells you which of the two valley winds this is.\n- Night-time conditions involve the ground losing, not gaining, heat.',
  },
  {
    name: 'Question 3',
    question: 'Match each valley-climate feature to the process that produces it.',
    metadata: [
      'A - Anabatic wind',
      'B - Katabatic wind',
      'C - Temperature inversion',
      'D - Radiation fog',
      '1 - Cold, dense air draining down a slope at night',
      '2 - Cold air trapped on the valley floor beneath a layer of warmer air',
      '3 - Air warmed by a sunlit slope rising up it during the day',
      '4 - Water vapour condensing near the ground when air cools to a dew point above freezing',
    ],
    answer: ['A-3', 'B-1', 'C-2', 'D-4'],
    presentation: 'match',
    type: 'application',
    unit: 'climate_weather',
    topic: 'valley_climates',
    subtopic: 'valley_winds_and_frost',
    skills: ['valley_climate_phenomena'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p1',
    clues: '- Separate the day-time processes from the night-time ones before matching.\n- Fog and frost both start with cooling air, but the dew point relative to 0 °C decides which one forms.',
  },
  {
    name: 'Question 4',
    question: 'Select ALL conditions that favour frost forming on a valley floor on a winter night.',
    metadata: [
      'Clear skies that allow rapid heat loss',
      'Strong winds mixing the air near the ground',
      'Cold air draining in from the surrounding slopes',
      'A dew point below freezing',
      'Thick low cloud trapping heat near the ground',
    ],
    answer: [
      'Clear skies that allow rapid heat loss',
      'Cold air draining in from the surrounding slopes',
      'A dew point below freezing',
      '',
      '',
    ],
    presentation: 'multi_select',
    type: 'application',
    unit: 'climate_weather',
    topic: 'valley_climates',
    subtopic: 'valley_winds_and_frost',
    skills: ['frost_formation_conditions'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p1',
    clues: '- Frost needs very cold, still air near the ground.\n- Anything that keeps heat in, or stirs the air, works against it.',
  },
];

// ─── AI explanation (generated in the session, AMPM-CONTENT-AI-EXP) ──────────

const aiExplanation = {
  sub_questions: [
    {
      number: '1.2.1',
      marks: 1,
      clues: '- Aspect describes how a slope is oriented, not how steep it is.\n- Link the orientation to what the slope receives from the sky.',
      approach: '- Recall the definition of slope aspect.\n- Discard options that describe winds or temperature zones instead of orientation.',
      solution: '1. Aspect means the direction a slope faces.\n2. That direction decides how much of the sun\'s energy the slope receives.\n3. Answer: D (slope direction in relation to the sun).',
    },
    {
      number: '1.2.2',
      marks: 1,
      clues: '- Use the labels on the photograph: which side is marked north, and which slope is sunlit?\n- Decide in which hemisphere the midday sun lies to the north.',
      approach: '- Locate the sunlit slope and the shaded slope in the photo.\n- Recall where the midday sun sits in each hemisphere.\n- Match the photo to the correct hemisphere.',
      solution: '1. The photograph labels the sunlit slope as facing north and the shaded one as facing south.\n2. The sun stays to the north of the sky at midday only in the Southern Hemisphere.\n3. Answer: C (Southern).',
    },
    {
      number: '1.2.3',
      marks: 1,
      clues: '- Slope B is the shaded one. Think about how sunshine affects temperature and moisture.\n- Choose the pair of descriptions that both fit a shaded slope.',
      approach: '- Identify B as the slope that faces away from the sun in this hemisphere.\n- Shade means less heating, so lower temperature and less evaporation.\n- Combine the two descriptions into one of the lettered pairs.',
      solution: '1. Slope B faces away from the sun, so it receives less solar energy and is cooler.\n2. Less evaporation leaves the soil moist, which is why trees grow thickly on it.\n3. Cooler (i) and moist (iii) together give C.',
    },
    {
      number: '1.2.4',
      marks: 1,
      clues: '- Look at the direction of the arrows and the moon in the picture.\n- Decide whether the air is moving downslope or upslope, and at what time of day.',
      approach: '- Read the time of day from the moon symbol.\n- Follow the arrows: down the slopes towards the valley floor.\n- Name the valley wind that blows downslope.',
      solution: '1. The moon shows that it is night, and the arrows point down the valley sides.\n2. Downslope night-time flow is a katabatic wind.\n3. Answer: B (katabatic).',
    },
    {
      number: '1.2.5',
      marks: 1,
      clues: '- At night the ground loses heat to the sky.\n- Cooling air becomes denser and sinks.',
      approach: '- Name the heat-loss process that happens at night.\n- Decide whether it gives low or high temperatures.\n- Pick the matching pair.',
      solution: '1. At night the ground radiates heat away (terrestrial radiation).\n2. The air next to the slope cools, becomes denser and drains downhill.\n3. Terrestrial radiation (i) and low temperatures (iii) give A.',
    },
    {
      number: '1.2.6',
      marks: 1,
      clues: '- Compare what happens to the water vapour when the dew point is above freezing and when it is below.\n- Frozen deposit versus liquid droplets points to one answer.',
      approach: '- Note the dew point is below 0 °C.\n- Decide whether water vapour then forms droplets or ice.\n- Match the result to the lettered term.',
      solution: '1. When air cools to a dew point below freezing, vapour turns directly into ice crystals on surfaces.\n2. Fog and mist are made of liquid droplets, so they need a dew point above freezing.\n3. Answer: C (frost).',
    },
    {
      number: '1.2.7',
      marks: 1,
      clues: '- Think about what ice crystals on leaves and shoots do to living plant tissue.\n- The \'negative physical (natural) impact\' is about the environment, not visibility.',
      approach: '- Recall the effect of frost on plants.\n- Rule out impacts that belong to fog or smog.\n- Choose the option describing damage to vegetation.',
      solution: '1. Frost freezes the water inside plant cells and damages the tissue.\n2. Reduced visibility is a fog effect, and pollution is a smog effect.\n3. Answer: D (destroys vegetation).',
    },
  ],
  model: 'claude-sonnet-5-5',
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
