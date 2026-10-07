#!/usr/bin/env node
/**
 * DBE Geography P1 — November 2025 — Question 3.3 (order 13)
 * GIS: attribute vs spatial data, vector line features, manipulating scale, resolution, pixels. Practice teaches the technique with invented values (no map sheet).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-geography-2025-nov-p1-q3-3.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-geography-2025-nov-p1-q3-3.js --dry-run
 *   node scripts/add-geography-2025-nov-p1-q3-3.js
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
  name: 'Question 3.3',
  syllabus: 'dbe',
  subject: 'geography',
  year: 2025,
  paper: 'nov_p1',
  order: 13,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['gis'],
  question_image_urls: [`${IMG}/q13/question_1.png`],
  memo_image_urls: [`${IMG}/q13/memo_1.png`],
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
    question: 'In a GIS, a dam wall is drawn as a line. The linked table records the dam\'s name, storage capacity and year of construction. What type of data is the information in the table?',
    metadata: ['Spatial data', 'Attribute data', 'Raster data', 'Buffered data', ''],
    answer: ['Attribute data', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'definition',
    unit: 'geographical_skills',
    topic: 'gis',
    subtopic: 'gis_concepts_and_layering',
    skills: ['gis_attribute_spatial_data'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p1',
    clues: '- Separate data that describes where something is from data that describes what it is like.\n- Names, capacities and dates describe characteristics.',
  },
  {
    name: 'Question 2',
    question: 'Match each type of GIS data to the feature or description that fits it best.',
    metadata: [
      'A - Point feature',
      'B - Line feature',
      'C - Polygon feature',
      'D - Raster data',
      '1 - A dam or nature reserve shown as an enclosed area',
      '2 - A grid of cells in a satellite image, each storing one value',
      '3 - A borehole or trigonometrical beacon',
      '4 - A perennial river or a railway',
    ],
    answer: ['A-3', 'B-4', 'C-1', 'D-2'],
    presentation: 'match',
    type: 'definition',
    unit: 'geographical_skills',
    topic: 'gis',
    subtopic: 'gis_concepts_and_layering',
    skills: ['gis_vector_feature_types'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p1',
    clues: '- Vector data draws features as points, lines or areas; raster data is a grid of cells.\n- Ask whether the feature has a position only, a length, or an area.',
  },
  {
    name: 'Question 3',
    question: 'Image X covers a 1 km² area with 30 m cells, and image Y covers the same area with 2 m cells. Which statement is correct?',
    metadata: [
      'Image X has more pixels because each cell is bigger',
      'Image X is clearer because larger cells make features stand out',
      'The images are identical because they cover the same area',
      'Image Y has more pixels and a higher resolution, so it shows finer detail',
      '',
    ],
    answer: ['Image Y has more pixels and a higher resolution, so it shows finer detail', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'interpretation',
    unit: 'geographical_skills',
    topic: 'gis',
    subtopic: 'gis_concepts_and_layering',
    skills: ['gis_resolution_pixels'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p1',
    clues: '- Cell size and the number of cells covering a fixed area move in opposite directions.\n- Resolution is about how much detail the cells can show.',
  },
  {
    name: 'Question 4',
    question: 'Select ALL actions that would make the detail in one area of a digital map image clearer.',
    metadata: [
      'Zoom out to a smaller scale',
      'Zoom in to a larger scale',
      'Use imagery with a higher resolution',
      'Use imagery made up of larger pixels',
      'Use imagery made up of smaller pixels',
    ],
    answer: ['Zoom in to a larger scale', 'Use imagery with a higher resolution', 'Use imagery made up of smaller pixels', '', ''],
    presentation: 'multi_select',
    type: 'application',
    unit: 'geographical_skills',
    topic: 'gis',
    subtopic: 'gis_concepts_and_layering',
    skills: ['gis_scale_manipulation'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p1',
    clues: '- Clarity comes from showing the area larger on screen or from the image itself holding more detail.\n- Think about what happens to detail when pixels get bigger.',
  },
];

// ─── AI explanation (generated in the session, AMPM-CONTENT-AI-EXP) ──────────

const aiExplanation = {
  sub_questions: [
    {
      number: '3.3.1',
      marks: 1,
      clues: '- The number 310 labels the road: does it say where the road is or what it is like?\n- Label data is not positional.',
      approach: '- Identify what the number describes.\n- Link it to the type of GIS data that stores characteristics.',
      solution: '1. The road\'s position is stored as spatial (vector line) data.\n2. The number 310 is the road\'s label, a characteristic linked to that line.\n3. Answer: C (attribute data).',
    },
    {
      number: '3.3.2',
      marks: 1,
      clues: '- Line features include rivers, roads and railways.\n- Look in block A4 for a natural one.',
      approach: '- Scan block A4 for a line symbol.\n- Choose the natural one.',
      solution: '1. Natural line features are drawn as lines, such as rivers.\n2. Roads and railways are man-made.\n3. Answer: river.',
    },
    {
      number: '3.3.3',
      marks: 2,
      clues: '- To see more detail you change how large the area appears on screen.\n- Think about zooming.',
      approach: '- State what is done to the scale.\n- Link it to how the image looks.',
      solution: '1. Data manipulation allows the scale to be changed.\n2. Making the scale larger enlarges area 9 on screen so the detail is clearer.',
    },
    {
      number: '3.3.4',
      marks: 1,
      clues: '- The term describes how much detail an image can show.\n- Eliminate the terms that deal with combining or protecting data.',
      approach: '- Recall the term for the clarity of an image.\n- Rule out the other GIS terms.',
      solution: '1. Data integration, buffering and data sharing are GIS operations, not measures of clarity.\n2. The clarity of an image is its resolution.\n3. Answer: D.',
    },
    {
      number: '3.3.5',
      marks: 1,
      clues: '- Compare the sharpness of the two stadium photographs.\n- Blurrier images are made of bigger, fewer pixels.',
      approach: '- Look at which photograph is less clear.\n- Link lower clarity to fewer pixels.',
      solution: '1. Photograph A is blurrier and shows less detail.\n2. That happens when an image is made of fewer, larger pixels.\n3. Answer: A.',
    },
    {
      number: '3.3.6',
      marks: 2,
      clues: '- Give a reason based on how the photograph looks.\n- Use words such as resolution, clarity and pixel size.',
      approach: '- Describe the clarity of photograph A.\n- Link it to resolution or pixel size.',
      solution: '1. The clarity of photograph A is poor, with low resolution.\n2. It shows less detail because its pixels are large.\n3. Any one of these reasons earns the two marks.',
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
