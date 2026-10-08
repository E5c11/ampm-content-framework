#!/usr/bin/env node
/**
 * DBE Geography P1 — November 2024 — Question 1.5 (order 5)
 * Line thunderstorms: the moisture front, the air masses on either side, rainfall distribution and negative physical impacts.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-geography-2024-nov-p1-q1-5.js --curriculum temp/curriculum-vocab-geography-p1-2024.json
 *   node scripts/add-geography-2024-nov-p1-q1-5.js --dry-run
 *   node scripts/add-geography-2024-nov-p1-q1-5.js
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
  name: 'Question 1.5',
  syllabus: 'dbe',
  subject: 'geography',
  year: 2024,
  paper: 'nov_p1',
  order: 5,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['line_thunderstorms', 'subtropical_anticyclones'],
  question_image_urls: [
    `${IMG}/q5/question_1.png`,
  ],
  memo_image_urls: [
    `${IMG}/q5/memo_1.png`,
    `${IMG}/q5/memo_2.png`,
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
    question: 'Match each part of a line-thunderstorm system over South Africa to its description.',
    metadata: [
      'A - Air from the South Atlantic High',
      'B - Air from the South Indian High',
      'C - Moisture front',
      'D - Line of cumulonimbus clouds',
      '1 - Cool, dry air flowing in from the south-west',
      '2 - Warm, moist air flowing in from the north-east',
      '3 - The boundary where the two air masses meet',
      '4 - Storms formed where moist air is lifted along the boundary',
    ],
    answer: ['A-1', 'B-2', 'C-3', 'D-4'],
    presentation: 'match',
    type: 'definition',
    unit: 'climate_weather',
    topic: 'subtropical_anticyclones',
    subtopic: 'line_thunderstorms_and_moisture_front',
    skills: ['moisture_front_air_masses'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p1',
    clues: '- Think about which ocean each high lies over and how warm that ocean is.\n- The front is the meeting line; the storms form along it.',
  },
  {
    name: 'Question 2',
    question: 'Weather stations P, Q and R lie 10 km, 80 km and 200 km east of a moisture front. Which station is likely to record the most rain?',
    metadata: [
      'R, because it lies closest to the warm Indian Ocean',
      'Q, because dry air from the west mixes in and adds moisture',
      'P, because uplift and condensation are greatest along the front',
      'All three equally, because the storms move evenly across the interior',
      '',
    ],
    answer: ['P, because uplift and condensation are greatest along the front', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'interpretation',
    unit: 'climate_weather',
    topic: 'subtropical_anticyclones',
    subtopic: 'line_thunderstorms_and_moisture_front',
    skills: ['line_thunderstorm_rainfall_distribution'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p1',
    clues: '- Ask where the air is forced to rise most strongly.\n- More uplift means more condensation.',
  },
  {
    name: 'Question 3',
    question: 'When do line thunderstorms most commonly develop over the South African interior?',
    metadata: [
      'Winter mornings, when cold fronts reach the interior plateau',
      'Summer nights, when katabatic winds lift moist air up the slopes',
      'Winter afternoons, when the interior high brings moist air inland',
      'Summer afternoons, when surface heating adds to uplift at the front',
      '',
    ],
    answer: ['Summer afternoons, when surface heating adds to uplift at the front', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'climate_weather',
    topic: 'subtropical_anticyclones',
    subtopic: 'line_thunderstorms_and_moisture_front',
    skills: ['line_thunderstorm_rainfall_distribution'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p1',
    clues: '- Moist air reaches the interior when the high over the plateau has weakened.\n- Thunderstorms need strong rising air.',
  },
  {
    name: 'Question 4',
    question: 'Select ALL the negative physical (natural) impacts of a severe line thunderstorm.',
    metadata: [
      'Groundwater levels permanently lowered',
      'Topsoil washed away by heavy downpours',
      'Trees uprooted and habitats destroyed by wind and hail',
      'Rivers silted up with eroded material',
      'Drought stress on natural vegetation',
    ],
    answer: [
      'Topsoil washed away by heavy downpours',
      'Trees uprooted and habitats destroyed by wind and hail',
      'Rivers silted up with eroded material',
      '',
      '',
    ],
    presentation: 'multi_select',
    type: 'application',
    unit: 'climate_weather',
    topic: 'subtropical_anticyclones',
    subtopic: 'line_thunderstorms_and_moisture_front',
    skills: ['line_thunderstorm_impacts'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p1',
    clues: '- These storms bring intense rain, hail and strong winds in a short time.\n- Rule out impacts linked to too little water.',
  },
];

// ─── AI explanation (generated in the session, AMPM-CONTENT-AI-EXP) ──────────

const aiExplanation = {
  sub_questions: [
    {
      number: '1.5.1',
      marks: 1,
      clues: '- Read the first sentence of the extract.',
      approach: '- Find the season named in the extract.',
      solution: '1. The extract says that the storms form during summer.\n2. Answer: summer.',
    },
    {
      number: '1.5.2',
      marks: 4,
      clues: '- Wind A comes from the high over the Atlantic, wind B from the high over the Indian Ocean.\n- Describe both temperature and moisture for each wind.',
      approach: '- State the temperature and moisture of wind A.\n- State the temperature and moisture of wind B.\n- Each wind needs both properties for two marks.',
      solution: '1. Wind A is a south-westerly from the South Atlantic High: it is cold and dry.\n2. Wind B is a north-easterly from the South Indian High: it is warm and moist.\n3. Two marks per wind; only one property per wind earns one mark.',
    },
    {
      number: '1.5.3',
      marks: 4,
      clues: '- Look at the rainfall bands in the source: heavy, moderate, light.\n- Think about where the air rises most strongly.',
      approach: '- Explain what happens to air at the moisture front.\n- Link that to condensation and cloud type.\n- Refer either to close to the front or further from it.',
      solution: '1. Along the moisture front the warm, moist air is lifted rapidly.\n2. Rapid uplift causes more vertical condensation.\n3. A dense line of cumulonimbus clouds forms, giving the heaviest rain; further away there is less uplift, less condensation and fewer clouds.',
    },
    {
      number: '1.5.4',
      marks: 6,
      clues: '- The storms bring heavy rain, hail and damaging winds.\n- Think about soil, vegetation, animals and water.',
      approach: '- Choose three different natural impacts.\n- Explain each one in a full sentence.',
      solution: '1. Heavy rain washes away topsoil and can trigger mass movements.\n2. Strong winds and hail uproot trees and destroy natural habitats and ecosystems, reducing biodiversity and displacing or drowning wildlife.\n3. Eroded material silts up rivers and lowers water quality; leaching and sinkholes may also occur.\n4. Any three explained impacts earn the six marks.',
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
