#!/usr/bin/env node
/**
 * DBE Geography P1 — November 2025 — Question 1.3 (order 3)
 * Mid-latitude cyclones: polar front and wave formation, mature stage weather, cold front cross-section, cold front occlusion.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-geography-2025-nov-p1-q1-3.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-geography-2025-nov-p1-q1-3.js --dry-run
 *   node scripts/add-geography-2025-nov-p1-q1-3.js
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
  name: 'Question 1.3',
  syllabus: 'dbe',
  subject: 'geography',
  year: 2025,
  paper: 'nov_p1',
  order: 3,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['mid_latitude_cyclone', 'cold_front'],
  question_image_urls: [`${IMG}/q3/question_1.png`, `${IMG}/q3/question_2.png`],
  memo_image_urls: [`${IMG}/q3/memo_1.png`, `${IMG}/q3/memo_2.png`],
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
    question: 'Along the polar front, warm subtropical air meets cold polar air. Which factor would most likely make this boundary buckle into a wave?',
    metadata: [
      'Identical temperatures on both sides of the boundary',
      'Light, steady winds with no jet-stream influence',
      'A single air mass covering the whole region',
      'Differences in temperature and wind speed across the boundary, reinforced by jet-stream flow',
      '',
    ],
    answer: ['Differences in temperature and wind speed across the boundary, reinforced by jet-stream flow', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'climate_weather',
    topic: 'mid_latitude_cyclones',
    subtopic: 'cyclone_development_and_fronts',
    skills: ['polar_front_wave_formation'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p1',
    clues: '- A wave needs something to disturb an otherwise straight boundary.\n- Think about contrasts between the two air masses and fast-moving upper winds.',
  },
  {
    name: 'Question 2',
    question: 'Match each stage in the life of a mid-latitude cyclone to its defining feature.',
    metadata: [
      'A - Wave stage',
      'B - Mature stage',
      'C - Occluded stage',
      'D - Dissipating stage',
      '1 - A well-developed warm sector with closely packed isobars and strong winds',
      '2 - The cold front catches the warm front and lifts the warm sector off the ground',
      '3 - A kink forms in the polar front as warm air starts to push into the cold air',
      '4 - The warm sector is cut off from the surface and the temperature contrast fades',
    ],
    answer: ['A-3', 'B-1', 'C-2', 'D-4'],
    presentation: 'match',
    type: 'definition',
    unit: 'climate_weather',
    topic: 'mid_latitude_cyclones',
    subtopic: 'cyclone_development_and_fronts',
    skills: ['mid_latitude_cyclone_stages'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p1',
    clues: '- Order the stages in time from first kink to final decay, then match each description to its position.\n- Look for words that hint at strengthening, overtaking or fading.',
  },
  {
    name: 'Question 3',
    question: 'Select ALL statements that correctly explain why heavy rain falls along a cold front.',
    metadata: [
      'Warm air slides gently up a shallow slope of cold air',
      'Cold, dense air undercuts the warm air ahead of it',
      'Warm air is forced to rise rapidly along the steep front',
      'Strong winds along the front keep the air too dry for cloud to form',
      'Rapid cooling of the rising air produces cumulonimbus cloud',
    ],
    answer: [
      'Cold, dense air undercuts the warm air ahead of it',
      'Warm air is forced to rise rapidly along the steep front',
      'Rapid cooling of the rising air produces cumulonimbus cloud',
      '',
      '',
    ],
    presentation: 'multi_select',
    type: 'application',
    unit: 'climate_weather',
    topic: 'mid_latitude_cyclones',
    subtopic: 'cyclone_development_and_fronts',
    skills: ['cold_front_weather_formation'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p1',
    clues: '- Follow the chain: what happens to the warm air, how fast, and what the rising air does as it cools.\n- Gentle gradual lifting belongs to a different kind of front.',
  },
  {
    name: 'Question 4',
    question: 'A learner draws a cross-section through a cold front for a cyclone moving from west to east in the Southern Hemisphere. Which description shows a correctly drawn cross-section?',
    metadata: [
      'A gentle front sloping forward over the warm air, with layered stratus cloud and the cold sector in the east',
      'A steep front leaning back over the cold air in the west, cumulonimbus cloud above it, the warm sector to the east and an arrow pointing east',
      'A steep front with cumulonimbus cloud, but with the cold sector drawn ahead of the front in the east and the arrow pointing west',
      'A gentle slope with nimbostratus along its length, the warm sector in the west and an arrow pointing east',
      '',
    ],
    answer: [
      'A steep front leaning back over the cold air in the west, cumulonimbus cloud above it, the warm sector to the east and an arrow pointing east',
      '',
      '',
      '',
      '',
    ],
    presentation: 'multiple_choice',
    type: 'interpretation',
    unit: 'climate_weather',
    topic: 'mid_latitude_cyclones',
    subtopic: 'cyclone_development_and_fronts',
    skills: ['cold_front_cross_section'],
    difficulty: 4,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p1',
    clues: '- Check four things in each description: the slope of the front, the cloud type, which side the cold air is on, and the direction of movement.\n- A cold front advances towards the warm air.',
  },
  {
    name: 'Question 5',
    question: 'Air behind a cold front is much colder than the air ahead of the warm front. What is the result?',
    metadata: [
      'The warm front catches up with the cold front because warm air moves faster',
      'The two fronts move apart and the warm sector widens',
      'The faster-moving cold front catches the warm front and undercuts it, lifting the warm sector off the ground to form an occlusion',
      'The warm air sinks beneath the cold air and the temperature contrast ends',
      '',
    ],
    answer: [
      'The faster-moving cold front catches the warm front and undercuts it, lifting the warm sector off the ground to form an occlusion',
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
    skills: ['cold_front_occlusion_process'],
    difficulty: 4,
    exam_weight: 2,
    xp: 10,
    order: 5,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p1',
    clues: '- Think about which front moves faster and why.\n- The warm, less dense air cannot stay at the surface once the colder air arrives beneath it.',
  },
];

// ─── AI explanation (generated in the session, AMPM-CONTENT-AI-EXP) ──────────

const aiExplanation = {
  sub_questions: [
    {
      number: '1.3.1',
      marks: 1,
      clues: '- Sketch A shows warm air in the north and cold air in the south, meeting at about 60° S.\n- Name the boundary between these two air masses.',
      approach: '- Read the labels on sketch A.\n- Recall the name for the boundary between polar and subtropical air.',
      solution: '1. The label shows a boundary between warm air and cold air at high southern latitudes.\n2. This meeting line of polar and subtropical air is called the polar front.\n3. Answer: polar front.',
    },
    {
      number: '1.3.2',
      marks: 1,
      clues: '- A wave is a disturbance of a straight line.\n- What could disturb a boundary between two moving air masses?',
      approach: '- Recall the factors that disturb the polar front.\n- Choose any one acceptable reason.',
      solution: '1. The polar front lies between air masses of different temperature and wind speed.\n2. Instability, friction, jet streams, mountains or those differences can push the front out of line.\n3. Any one such reason earns the mark, for example atmospheric instability.',
    },
    {
      number: '1.3.3',
      marks: 1,
      clues: '- Photographs C and D show gale-force winds and flooding.\n- Think about which stage has the strongest winds and heaviest rain.',
      approach: '- Read the weather shown in the photographs.\n- Recall which life-cycle stage brings the most intense weather.',
      solution: '1. C shows trees bent by very strong winds and D shows a flooded street.\n2. The strongest winds and heaviest rain occur when the cyclone is fully developed.\n3. Answer: mature stage.',
    },
    {
      number: '1.3.4',
      marks: 4,
      clues: '- Give two weather features (wind and rain) and explain what causes each.\n- Link the steep pressure gradient to the wind, and the rapid uplift to the rain.',
      approach: '- State the strong-wind condition and its cause.\n- State the heavy-rain condition and its cause.\n- Add the qualification (the reason) to each, since each point is worth two marks.',
      solution: '1. The isobars are packed closely, producing a steep pressure gradient and gale-force winds.\n2. Cold air behind the front undercuts the warm air, forcing it to rise rapidly.\n3. The rising air cools quickly and forms cumulonimbus clouds, causing heavy rainfall.\n4. Both strong winds and heavy rainfall must appear for full marks.',
    },
    {
      number: '1.3.5',
      marks: 4,
      clues: '- Plan the drawing before you start: front, direction, cloud, sector.\n- Draw the cross-section along the line E–F on sketch B.',
      approach: '- Draw a steep front rising from the ground along E–F.\n- Show the direction in which the whole system is moving.\n- Label a cloud type that fits a cold front.\n- Label one sector, for example the cold or warm sector.',
      solution: '1. Draw the line E–F as the ground and a steep curve leaning over the cold air.\n2. Add an arrow showing the system\'s general movement towards the east.\n3. Add cumulonimbus (or cumulus) cloud above the front.\n4. Label the cold sector behind the front and the warm sector ahead of it; one sector is enough for the mark.',
    },
    {
      number: '1.3.6',
      marks: 4,
      clues: '- Compare the temperature of the air behind the cold front with the air ahead of the warm front.\n- Decide which front must be faster and what happens when it catches the other.',
      approach: '- State the temperature difference.\n- Explain the undercutting by the colder air.\n- Explain why the warm air ends up lifted.\n- Keep to two fully explained points.',
      solution: '1. The air behind the cold front is colder than the air in front of the warm front.\n2. The colder, denser air moves faster and undercuts the warmer air.\n3. The warm, less dense air is pushed upwards and the cold front overtakes the warm front, forming an occlusion.',
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
