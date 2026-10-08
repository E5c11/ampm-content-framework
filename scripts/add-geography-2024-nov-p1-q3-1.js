#!/usr/bin/env node
/**
 * DBE Geography P1 — November 2024 — Question 3.1 (order 11)
 * Map skills and calculations: magnetic declination, area from map measurements, scale conversion and reasoning about where a land use can expand.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-geography-2024-nov-p1-q3-1.js --curriculum temp/curriculum-vocab-geography-p1-2024.json
 *   node scripts/add-geography-2024-nov-p1-q3-1.js --dry-run
 *   node scripts/add-geography-2024-nov-p1-q3-1.js
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
  name: 'Question 3.1',
  syllabus: 'dbe',
  subject: 'geography',
  year: 2024,
  paper: 'nov_p1',
  order: 11,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['map_skills', 'magnetic_declination'],
  question_image_urls: [
    `${IMG}/q11/question_1.png`,
    `${IMG}/q11/question_2.png`,
  ],
  memo_image_urls: [
    `${IMG}/q11/memo_1.png`,
  ],
  exam_question_marks: 10,
  supplementary_materials: [],
};

// ─── Phase 3 data — the practice questions ───────────────────────────────────
// Per core/question-schema.md + presentations/{type}.md. Logical/authored shape
// (presentation, type, order, unit/topic/subtopic, skills, …) — the mapping to
// Postgres columns is tools/lib/content-rows.js's job.

const questions = [
  {
    name: 'Question 1',
    question: 'A topographic map states that the mean magnetic declination was 19°40\' west of true north in 2006, with a mean annual change of 6\' westwards. Calculate the number of years from 2006 to 2026 and the total change in minutes over that time.',
    metadata: ['Years = ', '[ ]', ', change in minutes = ', '[ ]'],
    answer: ['20', '120', '', '', ''],
    presentation: 'fitb',
    type: 'calc',
    unit: 'geographical_skills',
    topic: 'map_skills_and_calculations',
    subtopic: 'scale_area_and_declination',
    skills: ['magnetic_declination'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p1',
    keyboard_type: 'standard_math',
    clues: '- Subtract the year on the map from the current year.\n- Multiply the number of years by the annual change.',
  },
  {
    name: 'Question 2',
    question: 'Using the same map (19°40\' west of true north in 2006, changing 6\' westwards each year), calculate the magnetic declination for 2026 in degrees and minutes west of true north.',
    metadata: ['Declination = ', '[ ]', '° ', '[ ]', '\''],
    answer: ['21', '40', '', '', ''],
    presentation: 'fitb',
    type: 'calc',
    unit: 'geographical_skills',
    topic: 'map_skills_and_calculations',
    subtopic: 'scale_area_and_declination',
    skills: ['magnetic_declination'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p1',
    keyboard_type: 'standard_math',
    clues: '- Convert the total change from minutes to degrees and minutes (60 minutes make 1 degree).\n- The change is westwards, so add it to the declination on the map.',
  },
  {
    name: 'Question 3',
    question: 'On a 1 : 10 000 orthophoto map, a rectangular sports complex measures 2,4 cm by 1,5 cm. Calculate its real area in km².',
    metadata: ['Area = ', '[ ]', ' km²'],
    answer: ['0.036', '', '', '', ''],
    presentation: 'fitb',
    type: 'calc',
    unit: 'geographical_skills',
    topic: 'map_skills_and_calculations',
    subtopic: 'scale_area_and_declination',
    skills: ['map_area_calculation', 'map_scale_conversion'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p1',
    keyboard_type: 'standard_math',
    clues: '- On a 1 : 10 000 map, convert each length from centimetres to kilometres before multiplying.\n- Area = length × breadth.',
  },
  {
    name: 'Question 4',
    question: 'Match each map scale to the real distance that 1 cm on the map represents.',
    metadata: [
      'A - 1 : 10 000',
      'B - 1 : 50 000',
      'C - 1 : 250 000',
      'D - 1 : 1 000 000',
      '1 - 100 m',
      '2 - 500 m',
      '3 - 2,5 km',
      '4 - 10 km',
    ],
    answer: ['A-1', 'B-2', 'C-3', 'D-4'],
    presentation: 'match',
    type: 'calc',
    unit: 'geographical_skills',
    topic: 'map_skills_and_calculations',
    subtopic: 'scale_area_and_declination',
    skills: ['map_scale_conversion'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p1',
    clues: '- 1 cm on the map stands for the second number of the scale in centimetres on the ground.\n- There are 100 cm in a metre and 1 000 m in a kilometre.',
  },
  {
    name: 'Question 5',
    question: 'A housing estate is bounded by a perennial river to the south-east, a railway line to the north and open, gently sloping farmland to the west. In which direction can the estate expand most easily?',
    metadata: [
      'South-east, by building across the river',
      'West, onto the open, gently sloping farmland',
      'North, by building across the railway line',
      'It cannot expand in any direction',
      '',
    ],
    answer: ['West, onto the open, gently sloping farmland', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'interpretation',
    unit: 'geographical_skills',
    topic: 'map_skills_and_calculations',
    subtopic: 'scale_area_and_declination',
    skills: ['land_use_siting_interpretation'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 5,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p1',
    clues: '- Check each boundary for a physical or man-made barrier.\n- Gentle, open land is the cheapest to build on.',
  },
];

// ─── AI explanation (generated in the session, AMPM-CONTENT-AI-EXP) ──────────

const aiExplanation = {
  sub_questions: [
    {
      number: '3.1.1',
      marks: 1,
      clues: '- Use the topographic map to find the towns around Ladysmith.\n- Compare their distances.',
      approach: '- Locate Ladysmith on the map.\n- Find which of the four towns is nearest.',
      solution: '1. On the topographic map, Colenso lies closest to Ladysmith.\n2. The answer is D (Colenso).',
    },
    {
      number: '3.1.2',
      marks: 1,
      clues: '- Find the coordinates on the map using latitude first, then longitude.\n- Read the symbol at that point from the key.',
      approach: '- Locate 28°31\'32" S and 29°47\'22" E.\n- Identify the feature at that position.',
      solution: '1. At the given coordinates the map shows the Klip River.\n2. It is shown as perennial water.\n3. The answer is B.',
    },
    {
      number: '3.1.3',
      marks: 1,
      clues: '- Read the magnetic declination note in the margin of the topographic map.\n- Find the year for which 21°03\' west is given.',
      approach: '- Find the declination diagram on the map.\n- Read the year next to the stated value.',
      solution: '1. The map margin states the mean magnetic declination as 21°03\' west of true north.\n2. That value is given for the year 2001.\n3. The answer is C.',
    },
    {
      number: '3.1.4',
      marks: 2,
      clues: '- Work out how many years have passed since the year on the map.\n- Multiply by the mean annual change.',
      approach: '- Subtract 2001 from 2024.\n- Multiply the number of years by the annual change of 8\'.',
      solution: '1. 2024 minus 2001 gives 23 years.\n2. 23 × 8\' = 184\'.\n3. 184\' is 3°04\', which is the total annual change.',
    },
    {
      number: '3.1.5',
      marks: 4,
      clues: '- Measure the breadth of feature 6 on the orthophoto map.\n- Convert both measurements to kilometres before multiplying.',
      approach: '- Measure the breadth (about 2,2 cm).\n- Convert each centimetre value using the 1 : 10 000 scale (multiply by 0,1 to get km).\n- Multiply length by breadth and give the unit.',
      solution: '1. Length = 3,0 cm × 0,1 = 0,30 km.\n2. Breadth = 2,2 cm × 0,1 = 0,22 km (2,1 to 2,3 cm accepted).\n3. Area = 0,30 km × 0,22 km = 0,066 km² (0,06 to 0,07 km² accepted).',
    },
    {
      number: '3.1.6',
      marks: 1,
      clues: '- Look at what lies south-east of feature 6 on the orthophoto map.\n- Find what blocks expansion in that direction.',
      approach: '- Identify the feature on the south-eastern side.\n- State it as the reason.',
      solution: '1. To the south-east of feature 6 lies the river, with a row of trees and a recreational area.\n2. Any one of these, for example the river, limits expansion.',
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
