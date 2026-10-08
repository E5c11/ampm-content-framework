#!/usr/bin/env node
/**
 * DBE Geography P1 — November 2024 — Question 3.2 (order 12)
 * Map interpretation: urban heat island, slope aspect and settlement, dam walls and flow direction, weirs, meanders and erosion on the outer bank.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-geography-2024-nov-p1-q3-2.js --curriculum temp/curriculum-vocab-geography-p1-2024.json
 *   node scripts/add-geography-2024-nov-p1-q3-2.js --dry-run
 *   node scripts/add-geography-2024-nov-p1-q3-2.js
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
  name: 'Question 3.2',
  syllabus: 'dbe',
  subject: 'geography',
  year: 2024,
  paper: 'nov_p1',
  order: 12,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['map_interpretation', 'urban_climate', 'slope_aspect'],
  question_image_urls: [
    `${IMG}/q12/question_1.png`,
    `${IMG}/q12/question_2.png`,
  ],
  memo_image_urls: [
    `${IMG}/q12/memo_1.png`,
    `${IMG}/q12/memo_2.png`,
  ],
  exam_question_marks: 12,
  supplementary_materials: [],
};

// ─── Phase 3 data — the practice questions ───────────────────────────────────
// Per core/question-schema.md + presentations/{type}.md. Logical/authored shape
// (presentation, type, order, unit/topic/subtopic, skills, …) — the mapping to
// Postgres columns is tools/lib/content-rows.js's job.

const questions = [
  {
    name: 'Question 1',
    question: 'A town centre packed with tall buildings is 2 °C warmer than the farmland around it. Select ALL the reasons why the dense buildings raise the temperature.',
    metadata: [
      'Concrete and tar absorb heat by day and release it at night',
      'More plants in the centre release water vapour that warms the air',
      'Tall buildings slow the wind, so heat is not carried away',
      'Fewer vehicles and factories operate in the centre',
      'Sunlight is reflected back and forth between buildings',
    ],
    answer: [
      'Concrete and tar absorb heat by day and release it at night',
      'Tall buildings slow the wind, so heat is not carried away',
      'Sunlight is reflected back and forth between buildings',
      '',
      '',
    ],
    presentation: 'multi_select',
    type: 'application',
    unit: 'climate_weather',
    topic: 'urban_climates',
    subtopic: 'heat_island_and_pollution_dome',
    skills: ['urban_heat_island_causes'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p1',
    clues: '- Think about the materials, the shape of the streets and the airflow in a city centre.',
  },
  {
    name: 'Question 2',
    question: 'Two suburbs are planned on opposite sides of an east–west valley in the Southern Hemisphere. Which side will be warmer, and why?',
    metadata: [
      'The south-facing slope, because it receives more direct sunlight',
      'The north-facing slope, because it is sheltered from all winds',
      'Both slopes equally, because the sun is overhead at midday',
      'The north-facing slope, because it receives more direct sunlight',
      '',
    ],
    answer: ['The north-facing slope, because it receives more direct sunlight', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'geographical_skills',
    topic: 'map_interpretation',
    subtopic: 'feature_and_pattern_interpretation',
    skills: ['slope_aspect_effects'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p1',
    clues: '- In the Southern Hemisphere the midday sun lies to the north for most of the year.',
  },
  {
    name: 'Question 3',
    question: 'A dam wall is shown across a river, with the water of the dam lying to the south-east of the wall. In which direction does the river flow?',
    metadata: ['South-easterly', 'North-easterly', 'North-westerly', 'South-westerly', ''],
    answer: ['North-westerly', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'interpretation',
    unit: 'geographical_skills',
    topic: 'map_interpretation',
    subtopic: 'feature_and_pattern_interpretation',
    skills: ['river_course_identification'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p1',
    clues: '- The dam holds back water on the upstream side of the wall.\n- The river flows from the dam towards the wall and beyond it.',
  },
  {
    name: 'Question 4',
    question: 'A weir is built across a river just below the point where two rivers meet. Farmland, a caravan park and a railway lie downstream. What is the most likely reason the weir was built?',
    metadata: [
      'To generate hydro-electric power for the town',
      'To create a deep lake for boating and recreation',
      'To control the flow and reduce the risk of flooding downstream',
      'To stop the two rivers from meeting at the confluence',
      '',
    ],
    answer: ['To control the flow and reduce the risk of flooding downstream', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'geographical_skills',
    topic: 'map_interpretation',
    subtopic: 'feature_and_pattern_interpretation',
    skills: ['map_evidence_reasoning'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p1',
    clues: '- A weir is a low wall that regulates the flow of a river.\n- Think about what happens to the volume of water below a confluence.',
  },
  {
    name: 'Question 5',
    question: 'A river on a map winds in large loops across an area where the contour lines are very far apart. Which statement correctly links the feature to the evidence?',
    metadata: [
      'Rapids, because the gentle gradient makes the river flow faster over hard rock',
      'Meanders, because the steep gradient makes the river cut downwards into the land',
      'A waterfall, because widely spaced contours show a sudden drop in height',
      'Meanders, because on a gentle gradient a river erodes sideways',
      '',
    ],
    answer: ['Meanders, because on a gentle gradient a river erodes sideways', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'interpretation',
    unit: 'geographical_skills',
    topic: 'map_interpretation',
    subtopic: 'feature_and_pattern_interpretation',
    skills: ['contour_landform_recognition', 'meander_course_and_processes'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 5,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p1',
    clues: '- Widely spaced contour lines show how steep the land is.\n- Link the slope to the type of erosion it encourages.',
  },
  {
    name: 'Question 6',
    question: 'Match each piece of map evidence to what it tells you about the river and its valley.',
    metadata: [
      'A - Contour lines far apart',
      'B - Contour lines close together',
      'C - Outer bank of a meander',
      'D - Inner bank of a meander',
      '1 - A gentle gradient where the river swings from side to side',
      '2 - A steep gradient where the river cuts downwards',
      '3 - An undercut slope eroded by fast-flowing water',
      '4 - A slip-off slope built up by deposition',
    ],
    answer: ['A-1', 'B-2', 'C-3', 'D-4'],
    presentation: 'match',
    type: 'interpretation',
    unit: 'geographical_skills',
    topic: 'map_interpretation',
    subtopic: 'feature_and_pattern_interpretation',
    skills: ['contour_landform_recognition', 'meander_course_and_processes'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 6,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p1',
    clues: '- Contour spacing shows how steep the land is.\n- Water speed differs on the two banks of a bend.',
  },
];

// ─── AI explanation (generated in the session, AMPM-CONTENT-AI-EXP) ──────────

const aiExplanation = {
  sub_questions: [
    {
      number: '3.2.1(a)',
      marks: 1,
      clues: '- F is in the town centre and G is on the outskirts.\n- Name the effect that makes cities warmer than their surroundings.',
      approach: '- Compare the temperatures at F and G.\n- Name the concept.',
      solution: '1. F, in the built-up centre, is 2 °C warmer than G.\n2. A city being warmer than its surrounding area is the urban heat island effect.\n3. Answer: urban heat island.',
    },
    {
      number: '3.2.1(b)',
      marks: 2,
      clues: '- Think about what a high density of buildings does to heat and wind.\n- One explained reason is enough.',
      approach: '- Choose one way that dense buildings add or trap heat.\n- Explain it in a full sentence.',
      solution: '1. Densely packed buildings trap heat between them.\n2. They also reduce wind speed and airflow, so heat is not carried away.\n3. Artificial surfaces and multiple reflections add to the heat; any one explained reason earns the two marks.',
    },
    {
      number: '3.2.2',
      marks: 2,
      clues: '- Find which way the slope at 7 faces.\n- In South Africa the sun lies to the north.',
      approach: '- State the aspect of the slope.\n- Explain why that aspect is an advantage.',
      solution: '1. Rose Park at 7 lies on a north(east)-facing slope.\n2. North-facing slopes receive more insolation and are warmer.\n3. Stating only the aspect earns one mark; the reason earns the second.',
    },
    {
      number: '3.2.3',
      marks: 1,
      clues: '- The dam lies upstream of its wall.\n- Water flows from the dam past the wall.',
      approach: '- Find which side of the wall the dam water lies on.\n- Give the direction of flow away from it.',
      solution: '1. The water of dam H lies on the upstream side of the wall.\n2. The river flows from the dam past the wall towards the south-west.\n3. The answer is A (south-westerly); D is also accepted.',
    },
    {
      number: '3.2.4',
      marks: 2,
      clues: '- Look at where the weir is placed relative to the rivers and what lies downstream.\n- A weir regulates the flow of water.',
      approach: '- State the purpose of the weir.\n- Explain why it is needed at this location.',
      solution: '1. The weir lies near the confluence of rivers, where the volume of water increases.\n2. It regulates the flow to reduce the risk of flooding downstream.\n3. Downstream lie cultivated land, a built-up area, a railway line and a caravan park; stating only flood risk earns one mark.',
    },
    {
      number: '3.2.5',
      marks: 1,
      clues: '- Trace the Klip River from 8 to 9.\n- Describe the shape of its course.',
      approach: '- Look at how the river bends.\n- Name the landform.',
      solution: '1. Between 8 and 9 the river winds in large loops.\n2. Answer: meander.',
    },
    {
      number: '3.2.6',
      marks: 1,
      clues: '- Meanders form where the land is flat.\n- What on the map shows flat land?',
      approach: '- Look at the spacing of the contour lines around the river.\n- State one piece of evidence.',
      solution: '1. The contour lines in this area are far apart.\n2. This shows flat, gently sloping land in the lower course, where meanders develop.',
    },
    {
      number: '3.2.7',
      marks: 2,
      clues: '- 11 and 10 are on opposite banks of a meander.\n- Decide which bank has faster-flowing water.',
      approach: '- Identify 11 as the outer bank and 10 as the inner bank.\n- Link water speed to erosion.',
      solution: '1. 11 lies on the outer bank, the undercut slope.\n2. Water flows faster on the outer bank and erodes it.\n3. At 10, on the inner (slip-off) bank, water is slower and deposits material; one explained point earns the two marks.',
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
