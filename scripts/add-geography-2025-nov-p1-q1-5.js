#!/usr/bin/env node
/**
 * DBE Geography P1 — November 2025 — Question 1.5 (order 5)
 * Berg winds on a synoptic chart: identifying a berg-wind city, evidence, why warm and dry, sustainable veld-fire strategies (8-mark paragraph).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-geography-2025-nov-p1-q1-5.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-geography-2025-nov-p1-q1-5.js --dry-run
 *   node scripts/add-geography-2025-nov-p1-q1-5.js
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
  name: 'Question 1.5',
  syllabus: 'dbe',
  subject: 'geography',
  year: 2025,
  paper: 'nov_p1',
  order: 5,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['berg_winds', 'veld_fires'],
  question_image_urls: [`${IMG}/q5/question_1.png`],
  memo_image_urls: [`${IMG}/q5/memo_1.png`],
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
    question: 'Which set of readings on a coastal synoptic chart best shows that a berg wind is blowing at a coastal station?',
    metadata: [
      'An ocean high, an onshore wind, a temperature of 17 °C and high humidity',
      'An inland high, a coastal low, an offshore wind, a temperature of 36 °C and very low humidity',
      'An inland low, a wind blowing from the sea, a temperature of 24 °C and heavy rain',
      'A coastal high, light winds from the south and a temperature of 15 °C with cloud',
      '',
    ],
    answer: ['An inland high, a coastal low, an offshore wind, a temperature of 36 °C and very low humidity', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'interpretation',
    unit: 'climate_weather',
    topic: 'subtropical_anticyclones',
    subtopic: 'berg_winds_and_veld_fires',
    skills: ['berg_wind_evidence'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p1',
    clues: '- A berg wind comes from the interior towards the coast, which tells you the wind direction and the pressure pattern.\n- Look for unusual heat combined with very dry air.',
  },
  {
    name: 'Question 2',
    question: 'Match each characteristic of a berg wind to what causes it.',
    metadata: [
      'A - The air is unusually warm',
      'B - The air is very dry',
      'C - The wind is strong and blows towards the coast',
      '1 - Falling relative humidity as the descending air warms and its moisture capacity rises',
      '2 - A steep pressure gradient between the interior high and the coastal low',
      '3 - The descending air is compressed and warmed adiabatically',
    ],
    answer: ['A-3', 'B-1', 'C-2'],
    presentation: 'match',
    type: 'application',
    unit: 'climate_weather',
    topic: 'subtropical_anticyclones',
    subtopic: 'berg_winds_and_veld_fires',
    skills: ['berg_wind_warm_dry_processes'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p1',
    clues: '- The air starts high on the plateau and ends at sea level, so think about what happens to air as it sinks.\n- The wind exists because pressure differs between two places.',
  },
  {
    name: 'Question 3',
    question: 'Select ALL measures that are sustainable ways of reducing the impact of veld fires.',
    metadata: [
      'Plant flammable pine plantations right up to the houses',
      'Cut firebreaks around settlements and farmland',
      'Remove flammable alien vegetation near homes',
      'Store dry cut brush against buildings',
      'Install early-warning systems and community alert plans',
    ],
    answer: [
      'Cut firebreaks around settlements and farmland',
      'Remove flammable alien vegetation near homes',
      'Install early-warning systems and community alert plans',
      '',
      '',
    ],
    presentation: 'multi_select',
    type: 'application',
    unit: 'climate_weather',
    topic: 'subtropical_anticyclones',
    subtopic: 'berg_winds_and_veld_fires',
    skills: ['veld_fire_strategies'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p1',
    clues: '- A sustainable measure reduces the fuel, limits the spread or gives people time to react.\n- Be wary of options that add fuel next to buildings.',
  },
  {
    name: 'Question 4',
    question: 'Why do berg wind conditions greatly increase the spread of veld fires?',
    metadata: [
      'Heavy rain from the front makes the vegetation grow rapidly',
      'Cold sea breezes carry sparks inland faster',
      'High temperatures and very low humidity dry out the vegetation, while strong dry winds fan the flames',
      'Moist air from the ocean makes plants more flammable',
      '',
    ],
    answer: ['High temperatures and very low humidity dry out the vegetation, while strong dry winds fan the flames', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'climate_weather',
    topic: 'subtropical_anticyclones',
    subtopic: 'berg_winds_and_veld_fires',
    skills: ['berg_wind_fire_risk'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p1',
    clues: '- Fire needs dry fuel, heat and oxygen supplied by wind.\n- Think about what the three main berg-wind characteristics do to vegetation.',
  },
];

// ─── AI explanation (generated in the session, AMPM-CONTENT-AI-EXP) ──────────

const aiExplanation = {
  sub_questions: [
    {
      number: '1.5.1',
      marks: 1,
      clues: '- Look at the temperatures beside each city on the synoptic chart.\n- Berg winds bring unusually high temperatures to the coast.',
      approach: '- Scan the coastal stations for very high readings.\n- Choose a city that fits the berg wind pattern.',
      solution: '1. Berg winds are hot, so look for the highest temperatures on the coast.\n2. East London shows the highest temperature on the map and Durban also has a high value.\n3. Either East London or Durban is accepted.',
    },
    {
      number: '1.5.2',
      marks: 2,
      clues: '- Use readings and pressure systems on the map, not general knowledge.\n- Quote one feature that appears at the chosen city.',
      approach: '- Pick a measurable feature such as air temperature or temperature range.\n- State that feature with its value from the map.',
      solution: '1. The chosen station records a very high temperature (34 °C at East London) and a large temperature range.\n2. Dry, clear conditions and the pairing of the Kalahari high with the coastal low are also accepted as evidence.\n3. Any one acceptable piece of evidence earns the two marks.',
    },
    {
      number: '1.5.3',
      marks: 4,
      clues: '- Your answer must deal with both temperature and moisture.\n- Think about what happens to air that sinks from the plateau to the coast.',
      approach: '- Explain why the air heats up as it descends.\n- Explain why the air is dry when it arrives.\n- Link each explanation to the descent down the escarpment.',
      solution: '1. The air descends from the interior plateau down the escarpment.\n2. As it sinks it is compressed and heats adiabatically at about 1 °C per 100 m.\n3. Moisture evaporates as the air warms, leaving it dry on arrival.\n4. Both temperature and moisture must be explained for full marks.',
    },
    {
      number: '1.5.4',
      marks: 8,
      clues: '- Aim for four distinct strategies, each with a short explanation.\n- Think of ways to reduce fuel, slow spread, warn people and respond.',
      approach: '- Choose four strategies from different areas: prevention, preparation, warning and response.\n- Explain how each one reduces the harm from fire.\n- Write them as connected sentences in a short paragraph.',
      solution: '1. Create firebreaks or buffer zones to stop the fire spreading.\n2. Remove flammable alien plants near settlements and build water storage points.\n3. Install early-warning systems and educate the community on evacuation routes.\n4. Provide fire-fighting equipment and make emergency services accessible.\n5. Any four well-explained strategies earn the eight marks.',
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
