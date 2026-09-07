#!/usr/bin/env node
/**
 * DBE Geography P2 — November 2025 — Question 3.3 (order 13)
 * Geographical Information Systems: data layering, vector vs raster data, buffering,
 * buffering evidence — technique-taught generically, same rationale as Q3.1/3.2. The
 * real exam's 3.3.3 ("redraw layer C") is a freehand-drawing sub-question with no
 * presentation-type equivalent — its content is folded into Question 1's data-layering
 * application question instead, per the subject profile's reframing rule.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-geography-2025-nov-p2-q3-3.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-geography-2025-nov-p2-q3-3.js --dry-run
 *   node scripts/add-geography-2025-nov-p2-q3-3.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

const IMG = 'https://media-dev.askmoreprepmore.app/exam_papers/dbe/geography/2025/nov_p2';

const video = {
  name: 'Question 3.3',
  syllabus: 'dbe',
  subject: 'geography',
  year: 2025,
  paper: 'nov_p2',
  order: 13,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['gis'],
  map_key: 'emalahleni_topo_2529cc_2025',
  question_image_urls: [`${IMG}/q13/question_1.png`],
  memo_image_urls: [`${IMG}/q13/memo_1.png`],
  exam_question_marks: 8,
  supplementary_materials: [],
};

const questions = [
  {
    name: 'Question 1',
    question: "A GIS map combines a 'roads' layer, a 'rivers' layer, and a 'land-use' layer into a single map. What does combining these layers achieve that using just one layer alone could not?",
    metadata: [
      'It lets you analyse how different features relate to each other at the same location',
      'It deletes the data in each individual layer',
      'It only works if all three layers show identical information',
      'It has no analytical benefit over a single layer',
      '',
    ],
    answer: ['It lets you analyse how different features relate to each other at the same location', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'geographical_skills',
    topic: 'gis',
    subtopic: 'gis_concepts_and_layering',
    skills: ['gis_data_layering'],
    difficulty: 2,
    exam_weight: 1,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p2',
    clues: "- Each layer holds different information about the same location.\n- Stacking them lets you see how the different features overlap and interact spatially.",
  },
  {
    name: 'Question 2',
    question: 'Match each GIS data type to its description.',
    metadata: [
      'A - Vector data',
      'B - Raster data',
      '1 - Represents features as points, lines and polygons with precise boundaries, e.g. roads or property boundaries',
      '2 - Represents data as a grid of cells/pixels, each holding a value, e.g. a satellite image',
    ],
    answer: ['A-1', 'B-2'],
    presentation: 'match',
    type: 'definition',
    unit: 'geographical_skills',
    topic: 'gis',
    subtopic: 'gis_concepts_and_layering',
    skills: ['gis_vector_raster_data'],
    difficulty: 2,
    exam_weight: 1,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Vector data has crisp, defined boundaries (a road is a precise line).\n- Raster data is made of uniform grid cells, like a photograph.',
  },
  {
    name: 'Question 3',
    question: 'A GIS analyst creates a 500 m buffer zone around a river to identify where new building development should be restricted. What is the purpose of this buffer zone?',
    metadata: [
      'To protect a set distance around a sensitive feature from certain types of development',
      'To make the river appear wider on the map than it really is',
      'To permanently delete all data near the river',
      'To increase the speed of new development near the river',
      '',
    ],
    answer: ['To protect a set distance around a sensitive feature from certain types of development', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'geographical_skills',
    topic: 'gis',
    subtopic: 'gis_concepts_and_layering',
    skills: ['gis_buffering'],
    difficulty: 2,
    exam_weight: 1,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p2',
    clues: '- A buffer marks a protective distance around a feature.\n- It is used to restrict or manage development close to something sensitive, like a river or wetland.',
  },
  {
    name: 'Question 4',
    question: 'Select the types of evidence on a map that would suggest environmental buffering/protection measures are in place around a river.',
    metadata: [
      'An open, undeveloped strip of land running alongside the river',
      'Woodland or vegetation preserved close to the water',
      'Dense housing built right up to the riverbank',
      'A shopping centre built directly next to the water',
      '',
    ],
    answer: ['An open, undeveloped strip of land running alongside the river', 'Woodland or vegetation preserved close to the water', '', '', ''],
    presentation: 'multi_select',
    type: 'interpretation',
    unit: 'geographical_skills',
    topic: 'gis',
    subtopic: 'gis_concepts_and_layering',
    skills: ['buffering_evidence_identification'],
    difficulty: 2,
    exam_weight: 1,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Buffering shows up as undeveloped, natural land kept clear near the protected feature.\n- Buildings placed right up against the water would be evidence buffering is NOT taking place.',
  },
];

const aiExplanation = {
  sub_questions: [
    {
      number: '3.3.1',
      marks: 2,
      clues: '- This asks for the general concept, not an example.',
      approach: '- Recall the definition of data layering in GIS.',
      solution: '1. Data layering is placing layers of information on top of one another to analyse them together.\n2. Answer: layers of information placed on top of one another',
    },
    {
      number: '3.3.2',
      marks: 1,
      clues: '- Layer B in the sketch shows a shape similar to a watercourse feature.',
      approach: '- Identify which topographic map layer/feature layer B represents.',
      solution: '1. Layer B represents the drainage (river) layer.\n2. Answer: drainage',
    },
    {
      number: '3.3.3',
      marks: 3,
      clues: '- This sub-question asks students to redraw and combine sketch layers by hand.',
      approach: '- No presentation type in this system supports freehand drawing input.',
      solution: '1. This sub-question requires a hand-drawn combined sketch and has no equivalent in the practice question set.\n2. Its underlying concept (combining layers to show relationships between features) is instead tested in Question 1 above.',
    },
    {
      number: '3.3.4',
      marks: 2,
      clues: '- Evidence of buffering shows up as protected, undeveloped land near a sensitive feature.',
      approach: '- Identify map evidence in the open space that supports the need for buffering.',
      solution: '1. Evidence includes sinkholes, subsiding ground, non-perennial water, or preserved woodland near the open space.\n2. Answer: any two pieces of evidence',
    },
  ],
  model: 'claude-sonnet-5',
  generated_at: Date.now(),
  version: 2,
  reviewed: false,
  input_tokens: 0,
  output_tokens: 0,
  avg_rating: null,
  rating_count: null,
};

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
}

if (require.main === module) {
  upload()
    .catch((err) => {
      console.error('\n❌ Upload failed:', err.message);
      process.exitCode = 1;
    })
    .finally(closePool);
}
