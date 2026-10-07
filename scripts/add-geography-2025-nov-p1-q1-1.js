#!/usr/bin/env node
/**
 * DBE Geography P1 — November 2025 — Question 1.1 (order 1)
 * Synoptic weather maps: pressure cells, air movement, ridging/blocking highs, moisture front, line thunderstorms, reading wind barbs (8 x 1).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-geography-2025-nov-p1-q1-1.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-geography-2025-nov-p1-q1-1.js --dry-run
 *   node scripts/add-geography-2025-nov-p1-q1-1.js
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
  name: 'Question 1.1',
  syllabus: 'dbe',
  subject: 'geography',
  year: 2025,
  paper: 'nov_p1',
  order: 1,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['synoptic_weather_maps', 'subtropical_anticyclones'],
  question_image_urls: [`${IMG}/q1/question_1.png`],
  memo_image_urls: [`${IMG}/q1/memo_1.png`],
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
    question: 'In July, a synoptic chart shows a large anticyclone sitting over the interior plateau, bringing cold, clear and dry weather. Which statement correctly pairs this pressure cell with the way air behaves at its centre?',
    metadata: [
      'Heat low: air converges and rises over the interior',
      'Kalahari high: air descends and spreads outwards (diverges) at the surface',
      'Kalahari high: air converges at the surface and rises',
      'South Atlantic high: air flows inwards towards the centre of the cell',
      '',
    ],
    answer: ['Kalahari high: air descends and spreads outwards (diverges) at the surface', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'climate_weather',
    topic: 'subtropical_anticyclones',
    subtopic: 'synoptic_pressure_systems',
    skills: ['pressure_cell_air_movement'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p1',
    clues: '- Winter cooling over the plateau builds high pressure there, not low pressure.\n- Ask whether air sinks or rises in a high, then which way it must move once it reaches the ground.',
  },
  {
    name: 'Question 2',
    question: 'Match each travelling disturbance or pressure feature to the conditions that produce it.',
    metadata: [
      'A - Line thunderstorms',
      'B - Berg wind',
      'C - Coastal low',
      'D - Blocking high',
      '1 - A hot, dry offshore wind that descends the escarpment towards a low-pressure system at the coast',
      '2 - A small low that travels from west to east along the southern coast',
      '3 - An anticyclone parked in the path of an eastward-moving frontal system, slowing or deflecting it',
      '4 - A row of afternoon storms where moist air from the east meets drier air from the west',
    ],
    answer: ['A-4', 'B-1', 'C-2', 'D-3'],
    presentation: 'match',
    type: 'application',
    unit: 'climate_weather',
    topic: 'subtropical_anticyclones',
    subtopic: 'synoptic_pressure_systems',
    skills: ['travelling_disturbance_conditions'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p1',
    clues: '- Each disturbance is the result of a particular meeting of air masses or pressure cells, not a standalone label.\n- Match on cause (what is meeting what, and in which direction the air moves) rather than on the name.',
  },
  {
    name: 'Question 3',
    question: 'Select ALL conditions that you would expect near the centre of a well-developed subtropical anticyclone.',
    metadata: [
      'Strong rising air forming thick cloud',
      'Descending (subsiding) air',
      'Clear skies with little rainfall',
      'Converging surface winds',
      'Surface air flowing outwards (divergence)',
    ],
    answer: ['Descending (subsiding) air', 'Clear skies with little rainfall', 'Surface air flowing outwards (divergence)', '', ''],
    presentation: 'multi_select',
    type: 'interpretation',
    unit: 'climate_weather',
    topic: 'subtropical_anticyclones',
    subtopic: 'synoptic_pressure_systems',
    skills: ['anticyclone_surface_features'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p1',
    clues: '- Think about the direction of vertical air movement in a high-pressure cell and what that does to cloud formation.\n- Surface air must leave the centre of a high, since it cannot keep piling in.',
  },
  {
    name: 'Question 4',
    question: 'On a synoptic chart, the isobars around Station P are tightly packed, while 300 km away the isobars around Station Q are widely spaced. Which statement about the winds is correct?',
    metadata: [
      'Station Q has the stronger winds because widely spaced isobars mean a steeper gradient',
      'Both stations have the same wind speed because the isobars are labelled with the same pressure',
      'Station P has the weaker winds because friction increases where isobars are close',
      'Station P has the stronger winds because its pressure gradient is steeper',
      '',
    ],
    answer: ['Station P has the stronger winds because its pressure gradient is steeper', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'interpretation',
    unit: 'climate_weather',
    topic: 'subtropical_anticyclones',
    subtopic: 'synoptic_pressure_systems',
    skills: ['pressure_gradient_wind_strength'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p1',
    clues: '- Wind is driven by how quickly pressure changes over a distance.\n- Closely packed isobars show a large pressure change over a short distance.',
  },
];

// ─── AI explanation (generated in the session, AMPM-CONTENT-AI-EXP) ──────────

const aiExplanation = {
  sub_questions: [
    {
      number: '1.1.1',
      marks: 1,
      clues: '- Recall the high-pressure cells around South Africa and where each is centred.\n- Ask which one dominates the interior in the cold, dry season.',
      approach: '- List the three subtropical highs: South Atlantic, South Indian and Kalahari.\n- Place each on a map: two over the oceans, one over the interior.\n- Remember that the heat low is a summer interior feature, so it cannot be the winter dominant cell.',
      solution: '1. The South Atlantic and South Indian highs lie over the oceans, west and east of the country.\n2. The interior plateau cools strongly in winter, building the Kalahari high above it.\n3. Answer: Z (Kalahari high).',
    },
    {
      number: '1.1.2',
      marks: 1,
      clues: '- Picture what air does when it reaches the ground at the middle of a high.\n- Decide whether surface air flows in or out.',
      approach: '- Recall that air sinks in a high-pressure cell.\n- Sinking air hits the ground and has to move sideways.\n- Match that sideways flow to one of the two terms.',
      solution: '1. Highs are areas of descending air.\n2. Once the air reaches the surface it spreads outwards from the centre.\n3. Air spreading outwards is called divergence, so the answer is Z (divergence).',
    },
    {
      number: '1.1.3',
      marks: 1,
      clues: '- Think about the direction in which weather systems usually travel around the southern coast.\n- A coastal low moves along the coast rather than across the interior.',
      approach: '- Recall that coastal lows travel around the coast in the same direction as the westerly-driven systems.\n- Convert the direction of travel into the word easterly or westerly.',
      solution: '1. A coastal low forms off the west coast and moves around the south coast.\n2. Its movement is from west to east.\n3. Movement towards the east is described as easterly, so the answer is Y (easterly).',
    },
    {
      number: '1.1.4',
      marks: 1,
      clues: '- A blocking high sits in the path of an approaching mid-latitude cyclone.\n- Think about which high lies to the east of South Africa, ahead of the eastward-moving cyclone.',
      approach: '- Recall that mid-latitude cyclones move from west to east.\n- Identify the pressure cell that lies ahead of them on the Indian Ocean side.\n- That high resists the cyclone\'s progress and slows it.',
      solution: '1. Mid-latitude cyclones travel eastwards past the south of the country.\n2. The South Indian high lies to the east, in the cyclone\'s path.\n3. Because it slows or deflects the cyclone, it is the blocking high: Y (South Indian high).',
    },
    {
      number: '1.1.5',
      marks: 1,
      clues: '- The word you want names the shape of the isobars, not the movement of the air.\n- Think of a tongue of high pressure extending outwards from a high-pressure cell.',
      approach: '- Recall the term for an elongation of isobars from a high.\n- Rule out the term that describes air flowing apart, since that is a movement, not a shape.',
      solution: '1. Diverging describes air flowing away from a centre, which is a movement.\n2. A ridge is the elongated extension of high pressure outwards from the cell.\n3. The process of forming that elongation is ridging, so the answer is Z (ridging).',
    },
    {
      number: '1.1.6',
      marks: 1,
      clues: '- The boundary separates air masses by how much water vapour they hold, not by temperature or pressure.\n- The ITCZ is a different feature, found near the equator.',
      approach: '- Recall the boundary between moist and dry air masses over southern Africa.\n- Compare it with the ITCZ, which is a belt of convergence between the hemispheres\' winds.',
      solution: '1. A boundary between air of different moisture content is named for what differs: the moisture.\n2. The inter-tropical convergence zone is an equatorial belt where winds from both hemispheres meet.\n3. Answer: Y (moisture front).',
    },
    {
      number: '1.1.7',
      marks: 1,
      clues: '- Trace the arrows on the sketch: where do the two airstreams meet?\n- Consider what happens when moist and dry air are forced together along a line.',
      approach: '- Read the sketch: a high over the Atlantic to the west and a high over the Indian Ocean to the east.\n- Follow the arrows to the dashed line over the interior where the airflows converge.\n- Link that line of convergence to the weather it produces.',
      solution: '1. The two highs send air towards the interior: drier air from the west and moist air from the east.\n2. The airstreams meet along the dashed line (a moisture front), forcing air to rise.\n3. Rising moist air builds a row of thunderstorms, so the answer is Y (line thunderstorms).',
    },
    {
      number: '1.1.8',
      marks: 1,
      clues: '- Learn how wind speed is shown on a station model: each full feather on the barb adds a fixed number of knots.\n- Count the feathers at each city and compare.',
      approach: '- Count the full feathers on each wind barb.\n- Convert feathers to knots using the standard value for each feather.\n- Check which city also carries the rainfall symbol.',
      solution: '1. A full feather on a wind barb represents 10 knots.\n2. Cape Town\'s barb carries two full feathers, giving 20 knots, and it has the rainfall dot beside it.\n3. Durban\'s barb has only one feather, which is 10 knots, so the answer is Z (Cape Town).',
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
