#!/usr/bin/env node
/**
 * DBE Geography P1 — November 2025 — Question 2.1 (order 6)
 * Drainage basin sketch: river system, interfluve, infiltration vs run-off, permanent/periodic rivers, confluence, river course, water table (8 x 1).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-geography-2025-nov-p1-q2-1.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-geography-2025-nov-p1-q2-1.js --dry-run
 *   node scripts/add-geography-2025-nov-p1-q2-1.js
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
  name: 'Question 2.1',
  syllabus: 'dbe',
  subject: 'geography',
  year: 2025,
  paper: 'nov_p1',
  order: 6,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['drainage_basin'],
  question_image_urls: [`${IMG}/q6/question_1.png`],
  memo_image_urls: [`${IMG}/q6/memo_1.png`],
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
    question: 'Match each drainage-basin feature to the role it plays in how water moves through the basin.',
    metadata: [
      'A - Watershed',
      'B - Tributary',
      'C - Confluence',
      'D - Water table',
      '1 - A smaller stream that feeds extra water into a larger river',
      '2 - The upper surface of groundwater that feeds rivers in the dry months',
      '3 - The boundary of high ground that sends rain into one basin or the one next door',
      '4 - The point where two streams meet and their flows combine',
    ],
    answer: ['A-3', 'B-1', 'C-4', 'D-2'],
    presentation: 'match',
    type: 'application',
    unit: 'geomorphology',
    topic: 'drainage_systems',
    subtopic: 'drainage_basin_concepts',
    skills: ['drainage_basin_functions'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p1',
    clues: '- Think of each feature as a step in the journey of rainwater from the high ground to the sea.\n- Separate features that move water (streams, joins) from those that store or divide it.',
  },
  {
    name: 'Question 2',
    question: 'Two slopes receive the same rainfall. Slope X is steep and made of bare clay, while slope Y is gentle with thick grass on sandy soil. Which statement is correct?',
    metadata: [
      'Slope X absorbs more water because steep slopes slow the flow',
      'Slope Y absorbs more water by infiltration, while slope X sheds more as surface run-off',
      'Both slopes have the same infiltration because the rainfall is the same',
      'Slope Y produces more surface run-off because grass blocks the water from soaking in',
      '',
    ],
    answer: ['Slope Y absorbs more water by infiltration, while slope X sheds more as surface run-off', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'geomorphology',
    topic: 'drainage_systems',
    subtopic: 'drainage_basin_concepts',
    skills: ['infiltration_runoff_relationship'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p1',
    clues: '- Run-off and infiltration share the same rainfall: what increases one reduces the other.\n- Consider slope steepness, surface cover and soil type separately.',
  },
  {
    name: 'Question 3',
    question: 'A river carries water from November to March and its bed is dry for the rest of the year. Which statement best explains why?',
    metadata: [
      'It is a permanent river: the water table stays above the channel bed all year',
      'It is an episodic river: it flows only after rare, exceptional storms years apart',
      'It is an exotic river: it rises in a wetter region and flows across a dry one',
      'It is a periodic river: the water table lies above the channel bed only in the rainy season and drops below it in the dry season',
      '',
    ],
    answer: [
      'It is a periodic river: the water table lies above the channel bed only in the rainy season and drops below it in the dry season',
      '',
      '',
      '',
      '',
    ],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'geomorphology',
    topic: 'drainage_systems',
    subtopic: 'drainage_basin_concepts',
    skills: ['river_type_water_table'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p1',
    clues: '- The key words are \'every year\' and \'only part of the year\'.\n- Link the flow of a river to the height of the groundwater relative to the channel bed.',
  },
  {
    name: 'Question 4',
    question: 'Select ALL factors that tend to give a drainage basin a HIGH drainage density.',
    metadata: [
      'Highly permeable sandy soil',
      'Impermeable rock such as shale',
      'Steep slopes',
      'Very gentle, flat terrain',
      'Sparse vegetation cover',
    ],
    answer: ['Impermeable rock such as shale', 'Steep slopes', 'Sparse vegetation cover', '', ''],
    presentation: 'multi_select',
    type: 'application',
    unit: 'geomorphology',
    topic: 'drainage_systems',
    subtopic: 'drainage_basin_concepts',
    skills: ['drainage_density_factors'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p1',
    clues: '- High drainage density means many stream channels per square kilometre.\n- Channels form where rainwater is forced to flow across the surface instead of soaking in.',
  },
];

// ─── AI explanation (generated in the session, AMPM-CONTENT-AI-EXP) ──────────

const aiExplanation = {
  sub_questions: [
    {
      number: '2.1.1',
      marks: 1,
      clues: '- Identify what the main river and its tributaries make up together.\n- The catchment area is the land, not the channels.',
      approach: '- Recall that a river and its tributaries form a network of channels.\n- Contrast the network with the area of land that feeds it.',
      solution: '1. The main river A and its tributaries form a network of channels.\n2. A catchment area is the land drained by that network, not the channels themselves.\n3. The network is the river system: Z.',
    },
    {
      number: '2.1.2',
      marks: 1,
      clues: '- Look at the high ground in area B between two streams.\n- A watershed divides two whole drainage basins; a smaller ridge between neighbouring streams has its own name.',
      approach: '- Check whether area B separates two basins or two streams within one basin.\n- Pick the term for high ground between neighbouring streams.',
      solution: '1. Area B lies between two streams in the same basin.\n2. A watershed would separate different basins altogether.\n3. The high ground between neighbouring streams is the interfluve: Z.',
    },
    {
      number: '2.1.3',
      marks: 1,
      clues: '- Look at what covers the ground at C.\n- Vegetation on gentle ground gives water time to soak in.',
      approach: '- Identify the surface at C from the key.\n- Link vegetation and gentle slope to infiltration.',
      solution: '1. Area C is covered with trees on gentler ground.\n2. Roots open the soil and the slow flow lets water soak in.\n3. Infiltration is therefore high: Z.',
    },
    {
      number: '2.1.4',
      marks: 1,
      clues: '- Use the key: is the line style at D a permanent or a periodic river?\n- Match the symbol, not the size of the stream.',
      approach: '- Read the symbols for permanent and periodic rivers in the key.\n- Compare the line at D with them.',
      solution: '1. The key shows permanent rivers as solid lines and periodic rivers as dashed lines.\n2. The river at D is drawn solid.\n3. Answer: Y (permanent).',
    },
    {
      number: '2.1.5',
      marks: 1,
      clues: '- A confluence is the place where two streams join.\n- Look at the circled positions and ask which one joins two channels.',
      approach: '- Find the circled labels E and F.\n- Check where two streams merge into one.',
      solution: '1. A confluence is a meeting point of two rivers or streams.\n2. E is where the streams on the western side of the basin join.\n3. Answer: Y (E).',
    },
    {
      number: '2.1.6',
      marks: 1,
      clues: '- Think about what steep ground does to rainwater.\n- Water has less time to soak in on a slope.',
      approach: '- Consider the effect of steepness on the speed of water.\n- Decide which of the two processes then increases.',
      solution: '1. On a steep slope rainwater flows downhill quickly.\n2. Little time remains for it to soak into the soil.\n3. Surface run-off increases: Z.',
    },
    {
      number: '2.1.7',
      marks: 1,
      clues: '- Look at the shape of the river at H and its closeness to the sea.\n- Meanders near the mouth point to a particular course.',
      approach: '- Note that the river at H meanders across gentle land near the sea.\n- Match meanders and gentle gradient to a river course.',
      solution: '1. At H the river is winding in broad meanders close to its mouth.\n2. That is typical of a gentle gradient near the sea.\n3. It is therefore in the lower course: Y.',
    },
    {
      number: '2.1.8',
      marks: 1,
      clues: '- Area I lies beside a periodic (dashed) river.\n- Compare the position of the dry-season water table with the channel bed in each sketch.',
      approach: '- Recall what defines a periodic river: it dries up in the dry season.\n- Look for the sketch in which the dry-season water table falls below the channel bed.\n- Check that the rainy-season table reaches the channel.',
      solution: '1. The river at I is periodic, so it flows only in the rainy season.\n2. In the rainy season the water table is above the channel bed, so water flows.\n3. In the dry season the water table drops below the bed, as shown in sketch Z.\n4. Answer: Z.',
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
