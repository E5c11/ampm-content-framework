#!/usr/bin/env node
/**
 * DBE Geography P1 — November 2025 — Question 3.2 (order 12)
 * Map interpretation: Mediterranean climate, seasonal rainfall evidence, urban cooling, night wind direction and windbreaks, watershed evidence, river course from a photograph. Practice teaches the technique with invented values (no map sheet).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-geography-2025-nov-p1-q3-2.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-geography-2025-nov-p1-q3-2.js --dry-run
 *   node scripts/add-geography-2025-nov-p1-q3-2.js
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
  name: 'Question 3.2',
  syllabus: 'dbe',
  subject: 'geography',
  year: 2025,
  paper: 'nov_p1',
  order: 12,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['map_interpretation'],
  question_image_urls: [`${IMG}/q12/question_1.png`, `${IMG}/q12/question_2.png`],
  memo_image_urls: [`${IMG}/q12/memo_1.png`, `${IMG}/q12/memo_2.png`],
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
    question: 'A town records warm, dry summers (28 °C, about 15 mm of rain per month from December to February) and cool, wet winters (11 °C, about 90 mm per month from June to August). Which climate type does this describe?',
    metadata: ['Tropical', 'Mediterranean', 'Arid', 'Humid subtropical with rain all year', ''],
    answer: ['Mediterranean', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'interpretation',
    unit: 'geographical_skills',
    topic: 'map_interpretation',
    subtopic: 'feature_and_pattern_interpretation',
    skills: ['climate_type_identification'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p1',
    clues: '- Compare the season in which most rain falls with the season in which it is warmest.\n- Rule out climates that have rain all year or almost none.',
  },
  {
    name: 'Question 2',
    question: 'A park of mature trees lies in the middle of a dense suburb. At 14:00 on a hot day it is several degrees cooler than the surrounding streets. Which explanation is best?',
    metadata: [
      'Vegetation absorbs more heat than concrete but only releases it at night',
      'Buildings create strong winds that blow heat away from the streets but not from the park',
      'Parks are always higher above sea level than the surrounding suburb',
      'Trees give shade and lose water by evapotranspiration, while tar and concrete absorb and release heat',
      '',
    ],
    answer: ['Trees give shade and lose water by evapotranspiration, while tar and concrete absorb and release heat', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'geographical_skills',
    topic: 'map_interpretation',
    subtopic: 'feature_and_pattern_interpretation',
    skills: ['urban_cooling_reasoning'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p1',
    clues: '- Compare what the park surface does with the sun\'s energy to what hard surfaces do.\n- Plants also release water vapour, which has a cooling effect.',
  },
  {
    name: 'Question 3',
    question: 'Match each piece of map evidence to the conclusion it supports.',
    metadata: [
      'A - Rows of trees planted along the northern edge of vineyards',
      'B - Dashed (non-perennial) rivers and many farm dams',
      'C - Streams flowing away in opposite directions from a high crest',
      'D - Closely spaced contour lines crossing a river near its source',
      '1 - The crest is a watershed',
      '2 - Rainfall is seasonal',
      '3 - The prevailing wind blows from the north',
      '4 - The river has a steep gradient with rapids, typical of the upper course',
    ],
    answer: ['A-3', 'B-2', 'C-1', 'D-4'],
    presentation: 'match',
    type: 'interpretation',
    unit: 'geographical_skills',
    topic: 'map_interpretation',
    subtopic: 'feature_and_pattern_interpretation',
    skills: ['map_evidence_reasoning'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p1',
    clues: '- Ask what each feature tells you about the environment around it.\n- Pair the evidence with the most direct conclusion rather than a loosely related one.',
  },
  {
    name: 'Question 4',
    question: 'On a topographic map of a vineyard area, high mountains lie to the north of a village and the valley floor slopes down to the south. On a clear, still night, in which direction will the cold air flow?',
    metadata: [
      'From south to north, because cold air rises up the slopes at night',
      'From the village towards the mountains, because warm air sinks at night',
      'From north to south, downslope towards the valley floor',
      'There is no consistent direction, because night winds ignore the slope',
      '',
    ],
    answer: ['From north to south, downslope towards the valley floor', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'geographical_skills',
    topic: 'map_interpretation',
    subtopic: 'feature_and_pattern_interpretation',
    skills: ['katabatic_wind_direction'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p1',
    clues: '- Cold air is dense and behaves like water on a slope.\n- Work out where the high ground is, then which way it drains.',
  },
  {
    name: 'Question 5',
    question: 'Select ALL pieces of map evidence that show a line of high ground is a watershed.',
    metadata: [
      'Streams converge towards the crest from both sides',
      'Streams flow away in opposite directions from the crest',
      'The highest contour values run along the crest between the two drainage basins',
      'Tributaries on each side begin close to the crest and flow downslope',
      'Contour lines on both sides of the crest are widely spaced and flat',
    ],
    answer: [
      'Streams flow away in opposite directions from the crest',
      'The highest contour values run along the crest between the two drainage basins',
      'Tributaries on each side begin close to the crest and flow downslope',
      '',
      '',
    ],
    presentation: 'multi_select',
    type: 'interpretation',
    unit: 'geographical_skills',
    topic: 'map_interpretation',
    subtopic: 'feature_and_pattern_interpretation',
    skills: ['watershed_map_evidence'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 5,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p1',
    clues: '- A watershed is the dividing line between two drainage basins.\n- Think about where the water starts and in which direction it flows on each side.',
  },
  {
    name: 'Question 6',
    question: 'A photograph shows a river with boulders, rapids and white water. Where on a topographic map is this river most likely to be found?',
    metadata: [
      'Where the river meanders across a flat plain with widely spaced contours',
      'Where the river crosses closely spaced contour lines near its source in the mountains',
      'Near the river mouth where it enters the sea',
      'Where a bridge crosses the river on the floodplain',
      '',
    ],
    answer: ['Where the river crosses closely spaced contour lines near its source in the mountains', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'geographical_skills',
    topic: 'map_interpretation',
    subtopic: 'feature_and_pattern_interpretation',
    skills: ['river_course_identification'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 6,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p1',
    clues: '- Rapids and boulders indicate steep ground and fast, turbulent water.\n- Contour spacing on the map shows the steepness of the land.',
  },
];

// ─── AI explanation (generated in the session, AMPM-CONTENT-AI-EXP) ──────────

const aiExplanation = {
  sub_questions: [
    {
      number: '3.2.1',
      marks: 1,
      clues: '- Use the description of the town to decide which climate type fits.\n- Mediterranean climates have a particular pairing of seasons and rainfall.',
      approach: '- Read the climate description: warm, dry summers and cool, rainy winters.\n- Match it to the climate type with that pattern.',
      solution: '1. The description gives warm dry summers and cool rainy winters.\n2. That seasonal pattern is typical of the Cape Winelands.\n3. Answer: C (Mediterranean).',
    },
    {
      number: '3.2.2',
      marks: 1,
      clues: '- Look for features that show water is present only in some seasons.\n- Examine block A5 for water features.',
      approach: '- Look at rivers and water bodies in block A5.\n- Choose a feature that stores or carries water seasonally.',
      solution: '1. Non-perennial rivers flow only in the wet season.\n2. Dams or reservoirs are built to store water for the dry season.\n3. Any one such feature earns the mark.',
    },
    {
      number: '3.2.3',
      marks: 2,
      clues: '- Compare area 8 with the built-up land around it.\n- Give one reason with an explanation, such as the effect of plants.',
      approach: '- Identify what covers area 8.\n- Explain how that surface affects temperature.',
      solution: '1. Area 8 is covered with vegetation, which provides shade and releases water vapour through evapotranspiration.\n2. The built-up area has surfaces that absorb and re-radiate heat, so it is warmer.\n3. Any one fully explained point earns the two marks.',
    },
    {
      number: '3.2.4',
      marks: 1,
      clues: '- At night, cold air drains downslope.\n- Work out where the high ground lies relative to the row of trees J.',
      approach: '- Locate the high ground around J.\n- Determine the direction the slope falls.\n- State the direction the cold air moves.',
      solution: '1. Cold air flows down the mountains towards the valley.\n2. At J the high ground is to the north, so the wind blows from the north.\n3. Any of north, north-west or north-east, or north to south, is accepted.',
    },
    {
      number: '3.2.5',
      marks: 2,
      clues: '- Rows of trees are usually planted to protect crops from the wind.\n- Look at which side of the orchards the rows are on.',
      approach: '- Locate the row of trees relative to the orchards.\n- Link its position to the wind direction.',
      solution: '1. The row of trees stands on the north or north-eastern side of the orchards and vineyards.\n2. Windbreaks are planted facing the prevailing wind.\n3. The wind also blows down the mountain slopes as a katabatic wind; any one point earns the marks.',
    },
    {
      number: '3.2.6',
      marks: 2,
      clues: '- A watershed sends water in opposite directions.\n- Look at the rivers on each side of the Stellenboschberg.',
      approach: '- Note the direction of the rivers flowing away from the mountain.\n- State that they flow in opposite directions.',
      solution: '1. Many rivers flow north-east and south-west away from the Stellenboschberg.\n2. Rivers flowing away in opposite directions show that the mountain divides two drainage basins.\n3. Either observation earns the marks.',
    },
    {
      number: '3.2.7',
      marks: 1,
      clues: '- The photograph shows rapids and a rocky bed.\n- Decide which location, K or L, is steeper.',
      approach: '- Look at the contours around K and L.\n- Choose the one where the river drops quickly.',
      solution: '1. The photograph shows turbulent, fast-flowing water over boulders.\n2. Location L lies in the steeper upper course.\n3. Answer: L.',
    },
    {
      number: '3.2.8',
      marks: 2,
      clues: '- Link rapids to the stage of the river.\n- Give one reason, such as steepness or turbulence.',
      approach: '- Name the course of the river at L.\n- Give a characteristic of that course.',
      solution: '1. L is in the upper course of the river.\n2. Rapids are characteristic of the upper course, where the gradient is steep and the water is turbulent.\n3. Any one fully explained reason earns the marks.',
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
