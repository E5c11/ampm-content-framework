#!/usr/bin/env node
/**
 * DBE Geography P1 — November 2024 — Question 3.3 (order 13)
 * GIS: resolution, spatial and attribute data, how a map reference identifies features, and buffering to protect river water quality.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-geography-2024-nov-p1-q3-3.js --curriculum temp/curriculum-vocab-geography-p1-2024.json
 *   node scripts/add-geography-2024-nov-p1-q3-3.js --dry-run
 *   node scripts/add-geography-2024-nov-p1-q3-3.js
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
  name: 'Question 3.3',
  syllabus: 'dbe',
  subject: 'geography',
  year: 2024,
  paper: 'nov_p1',
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
    question: 'A 1 : 10 000 orthophoto shows individual houses and trees clearly, while a satellite image of the same area shows only blurred blocks. Which statement is correct?',
    metadata: [
      'The satellite image has the higher resolution, because each pixel covers a larger area',
      'The orthophoto has the higher resolution, because each pixel covers a smaller area',
      'Both have the same resolution; only the printing scale is different',
      'The orthophoto has the lower resolution, because it shows more ground detail',
      '',
    ],
    answer: ['The orthophoto has the higher resolution, because each pixel covers a smaller area', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'interpretation',
    unit: 'geographical_skills',
    topic: 'gis',
    subtopic: 'gis_concepts_and_layering',
    skills: ['gis_resolution_pixels'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p1',
    clues: '- Resolution describes the smallest object that can be seen.\n- Think about how much ground one pixel covers.',
  },
  {
    name: 'Question 2',
    question: 'A GIS layer for clinics in a town stores the following. Select ALL the items that are attribute data.',
    metadata: [
      'Latitude and longitude of each clinic',
      'Number of nurses at each clinic',
      'Opening hours of each clinic',
      'Position of each clinic as a point on the map',
      'Name of each clinic',
    ],
    answer: ['Number of nurses at each clinic', 'Opening hours of each clinic', 'Name of each clinic', '', ''],
    presentation: 'multi_select',
    type: 'definition',
    unit: 'geographical_skills',
    topic: 'gis',
    subtopic: 'gis_concepts_and_layering',
    skills: ['gis_attribute_spatial_data'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p1',
    clues: '- Spatial data answers the question where.\n- Attribute data describes the feature at that place.',
  },
  {
    name: 'Question 3',
    question: 'Two similar map symbols could show either a mine dump or an excavation. How does the map\'s reference (key) help the user?',
    metadata: [
      'It gives the exact coordinates of every symbol on the map',
      'It shows the height of each feature above sea level',
      'It gives the scale needed to measure each feature',
      'It tells the user what each symbol represents in reality',
      '',
    ],
    answer: ['It tells the user what each symbol represents in reality', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'geographical_skills',
    topic: 'gis',
    subtopic: 'gis_concepts_and_layering',
    skills: ['gis_attribute_spatial_data'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p1',
    clues: '- A key describes symbols rather than locating them.',
  },
  {
    name: 'Question 4',
    question: 'Match each GIS term to its meaning.',
    metadata: [
      'A - Buffering',
      'B - Data layering',
      'C - Resolution',
      'D - Attribute data',
      '1 - Marking out a zone at a set distance around a feature',
      '2 - Stacking separate themes of data for the same area',
      '3 - The size of the smallest feature visible on an image',
      '4 - Information that describes what a feature is',
    ],
    answer: ['A-1', 'B-2', 'C-3', 'D-4'],
    presentation: 'match',
    type: 'definition',
    unit: 'geographical_skills',
    topic: 'gis',
    subtopic: 'gis_concepts_and_layering',
    skills: ['gis_buffering', 'gis_data_layering'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p1',
    clues: '- Two terms are about what you do with data; two are about the data itself.',
  },
  {
    name: 'Question 5',
    question: 'Select ALL the ways a vegetated buffer zone along a river protects its water quality.',
    metadata: [
      'It traps eroded soil before it enters the river',
      'It speeds up surface run-off into the channel',
      'It keeps buildings and waste off the river banks',
      'It absorbs fertiliser run-off, reducing eutrophication',
      'It increases the salinity of the river water',
    ],
    answer: [
      'It traps eroded soil before it enters the river',
      'It keeps buildings and waste off the river banks',
      'It absorbs fertiliser run-off, reducing eutrophication',
      '',
      '',
    ],
    presentation: 'multi_select',
    type: 'application',
    unit: 'geographical_skills',
    topic: 'gis',
    subtopic: 'gis_concepts_and_layering',
    skills: ['buffering_evidence_identification'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 5,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p1',
    clues: '- A buffer zone acts as a filter and a barrier between land use and water.',
  },
];

// ─── AI explanation (generated in the session, AMPM-CONTENT-AI-EXP) ──────────

const aiExplanation = {
  sub_questions: [
    {
      number: '3.3.1',
      marks: 1,
      clues: '- An orthophoto map shows buildings, trees and roads in fine detail.\n- Detail depends on resolution.',
      approach: '- Decide whether small objects can be seen on the orthophoto.\n- Choose high or low.',
      solution: '1. The orthophoto map shows small features clearly.\n2. The vertical aerial photograph it was made from therefore has a high resolution.\n3. Answer: high.',
    },
    {
      number: '3.3.2',
      marks: 1,
      clues: '- The reference describes what each symbol means.\n- Spatial data gives location; attribute data gives description.',
      approach: '- Decide whether the reference tells you where a feature is or what it is.\n- Choose the data type.',
      solution: '1. The reference explains what each symbol represents.\n2. Descriptive information about features is attribute data.\n3. Answer: attribute.',
    },
    {
      number: '3.3.3',
      marks: 2,
      clues: '- Feature J is shown by a symbol on the topographic map.\n- Use the reference to read what that symbol means.',
      approach: '- Explain how the reference turns a symbol into real information.\n- Refer to feature J.',
      solution: '1. The reference indicates what the symbol at J represents in reality.\n2. It shows that J is an excavation and not a similar feature such as a mine dump.\n3. Any one explained point earns the two marks.',
    },
    {
      number: '3.3.4',
      marks: 2,
      clues: '- Buffering is a GIS tool used around features.\n- It sets an area at a distance from something.',
      approach: '- Describe what is demarcated.\n- Say what it surrounds.',
      solution: '1. Buffering is the demarcation of an area around or along a geographical feature or location.\n2. The concept earns the two marks.',
    },
    {
      number: '3.3.5',
      marks: 2,
      clues: '- 12 is a buffer along the Klip River.\n- Think about what the buffer keeps away from the water.',
      approach: '- State how the buffer limits harm to the river.\n- Link it to water quality.',
      solution: '1. The buffer restricts development on the river banks.\n2. This decreases pollution from the built-up area and stops eroded soil entering the river.\n3. Reduced eutrophication or salinity and preserved biodiversity are also accepted; one explained point earns the two marks.',
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
