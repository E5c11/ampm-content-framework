#!/usr/bin/env node
/**
 * DBE Geography P2 — November 2024 — Question 3.3 — Geographical Information Systems (order 13)
 * GIS concepts: raster and vector data, point/line/polygon features, human-made polygons, data integration and data layering.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-geography-2024-nov-p2-q3-3.js --curriculum temp/curriculum-vocab-geography-p2-2024.json
 *   node scripts/add-geography-2024-nov-p2-q3-3.js --dry-run
 *   node scripts/add-geography-2024-nov-p2-q3-3.js
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

const IMG = 'https://media-dev.askmoreprepmore.app/exam_papers/dbe/geography/2024/nov_p2';

const video = {
  name: 'Question 3.3',
  syllabus: 'dbe',
  subject: 'geography',
  year: 2024,
  paper: 'nov_p2',
  order: 13,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['gis'],
  question_image_urls: [
    `${IMG}/q13/question_1.png`,
  ],
  memo_image_urls: [
    `${IMG}/q13/memo_1.png`,
    `${IMG}/q13/memo_2.png`,
  ],
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
    question: 'A topographic map is made by turning an aerial photograph into lines and symbols at a smaller scale. Which statement describes this change?',
    metadata: [
      'Vector data was converted to raster data, and the scale was enlarged',
      'Raster data was converted to vector data, and the scale was reduced',
      'Attribute data was converted to spatial data, and the scale was unchanged',
      'Raster data was converted to attribute data, and the scale was enlarged',
      '',
    ],
    answer: ['Raster data was converted to vector data, and the scale was reduced', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'geographical_skills',
    topic: 'gis',
    subtopic: 'gis_concepts_and_layering',
    skills: ['gis_vector_raster_data'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p2',
    clues: '- A photograph is made of pixels; a map is made of points, lines and shapes.\n- Compare how much ground fits on each sheet.',
  },
  {
    name: 'Question 2',
    question: 'Match each feature to the vector data type used to show it in a GIS.',
    metadata: ['A - Railway line', 'B - Borehole', 'C - Cultivated field', '1 - Polygon', '2 - Point', '3 - Line'],
    answer: ['A-3', 'B-2', 'C-1'],
    presentation: 'match',
    type: 'definition',
    unit: 'geographical_skills',
    topic: 'gis',
    subtopic: 'gis_concepts_and_layering',
    skills: ['gis_vector_feature_types'],
    difficulty: 1,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p2',
    clues: '- Ask whether the feature has a position only, a length, or an area.',
  },
  {
    name: 'Question 3',
    question: 'Select ALL the features that are human-made POLYGON features.',
    metadata: ['A fence', 'A cultivated field', 'An excavation', 'A natural marsh', 'A golf course'],
    answer: ['A cultivated field', 'An excavation', 'A golf course', '', ''],
    presentation: 'multi_select',
    type: 'application',
    unit: 'geographical_skills',
    topic: 'gis',
    subtopic: 'gis_concepts_and_layering',
    skills: ['gis_vector_feature_types'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p2',
    clues: '- Check two things for each feature: is it made by people, and does it cover an area?',
  },
  {
    name: 'Question 4',
    question: 'A planner overlays a flood-risk layer, a land-ownership layer and a road layer to choose the site for a new clinic. What is this combining of data sources called?',
    metadata: ['Data standardisation', 'Data sharing', 'Remote sensing', 'Data integration', ''],
    answer: ['Data integration', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'definition',
    unit: 'geographical_skills',
    topic: 'gis',
    subtopic: 'gis_concepts_and_layering',
    skills: ['gis_data_manipulation'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p2',
    clues: '- The planner is bringing several separate data sets together into one view.',
  },
  {
    name: 'Question 5',
    question: 'A topographic map shows contours, rivers, roads and buildings together on one sheet. Which method of data integration does this show?',
    metadata: ['Layering', 'Buffering', 'Querying', 'Statistical analysis', ''],
    answer: ['Layering', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'geographical_skills',
    topic: 'gis',
    subtopic: 'gis_concepts_and_layering',
    skills: ['gis_data_layering'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 5,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p2',
    clues: '- Each type of feature was mapped separately before they were combined.\n- Picture sheets of tracing paper placed on top of each other.',
  },
];

// ─── AI explanation (generated in the session, AMPM-CONTENT-AI-EXP) ──────────

const aiExplanation = {
  sub_questions: [
    {
      number: '3.3.1',
      marks: 1,
      clues: '- Converting between data formats changes the data itself.',
      approach: '- Recall the GIS processes listed.\n- Choose the one that means changing or transforming data.',
      solution: '1. Changing raster data into vector data transforms the data.\n2. Transforming data is called data manipulation.\n3. The answer is D.',
    },
    {
      number: '3.3.2',
      marks: 2,
      clues: '- A photograph shows real images; a map shows symbols.',
      approach: '- Name the data type of the photograph and of the map.\n- Mention any change in scale.',
      solution: '1. The image (raster) data of the photograph was converted to symbols (vector data) on the map.\n2. The scale was also changed.\n3. Either explanation earns the two marks.',
    },
    {
      number: '3.3.3(a)',
      marks: 1,
      clues: '- A line feature has length but no area.',
      approach: '- Look in block A3 for a human-made feature that runs in a line.',
      solution: '1. Roads, tracks and footpaths, and dam walls are human-made line features.\n2. Original farm boundaries are also accepted.\n3. Drawing any one earns the mark.',
    },
    {
      number: '3.3.3(b)',
      marks: 1,
      clues: '- A polygon feature covers an area.',
      approach: '- Look in block A3 for a human-made feature with an outline that encloses an area.',
      solution: '1. Excavations, cultivated land and dams are human-made polygon features.\n2. Drawing any one earns the mark.',
    },
    {
      number: '3.3.4',
      marks: 2,
      clues: '- The word "integration" means bringing things together.',
      approach: '- Say what is brought together.\n- Mention sources or layers of data.',
      solution: '1. Data integration is the combining of different sources of information or data layers.\n2. This answer earns the two marks.',
    },
    {
      number: '3.3.5',
      marks: 1,
      clues: '- A topographic map shows many kinds of information on one sheet.',
      approach: '- Name the method that places one set of data on top of another.',
      solution: '1. Each type of information is placed on top of the others.\n2. The method is data layering.',
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
