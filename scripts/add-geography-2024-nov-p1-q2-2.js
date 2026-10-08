#!/usr/bin/env node
/**
 * DBE Geography P1 — November 2024 — Question 2.2 (order 7)
 * Fluvial processes and landforms: V-shaped valleys, waterfalls and plunge pools, rapids, flood plains, meander slopes, ox-bow lakes, levees and deltas.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-geography-2024-nov-p1-q2-2.js --curriculum temp/curriculum-vocab-geography-p1-2024.json
 *   node scripts/add-geography-2024-nov-p1-q2-2.js --dry-run
 *   node scripts/add-geography-2024-nov-p1-q2-2.js
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
  name: 'Question 2.2',
  syllabus: 'dbe',
  subject: 'geography',
  year: 2024,
  paper: 'nov_p1',
  order: 7,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['fluvial_landforms', 'meanders'],
  question_image_urls: [
    `${IMG}/q7/question_1.png`,
    `${IMG}/q7/question_2.png`,
    `${IMG}/q7/question_3.png`,
  ],
  memo_image_urls: [
    `${IMG}/q7/memo_1.png`,
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
    question: 'Match each fluvial landform to the process that forms it.',
    metadata: [
      'A - V-shaped valley',
      'B - Plunge pool',
      'C - Rapids',
      'D - Natural levee',
      '1 - Vertical erosion by a fast-flowing river in the upper course',
      '2 - Hydraulic action and abrasion at the foot of a waterfall',
      '3 - Water flowing over alternating bands of hard and soft rock',
      '4 - Coarse sediment dropped on the banks when a river floods',
    ],
    answer: ['A-1', 'B-2', 'C-3', 'D-4'],
    presentation: 'match',
    type: 'application',
    unit: 'geomorphology',
    topic: 'fluvial_processes',
    subtopic: 'fluvial_landforms',
    skills: ['fluvial_landform_processes'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p1',
    clues: '- Decide which landforms are made by erosion and which by deposition.\n- Think about where along the river each one is found.',
  },
  {
    name: 'Question 2',
    question: 'On a meander, why is the slope on the inside of the bend gentle while the slope on the outside of the bend is steep?',
    metadata: [
      'Fast water erodes the inside bend, while slow water deposits on the outside bend',
      'Vertical erosion acts only on the inside bend, deepening the channel there',
      'Weathering is stronger on the outside bend because it faces the sun',
      'Slow water deposits on the inside bend, while fast water erodes the outside bend',
      '',
    ],
    answer: ['Slow water deposits on the inside bend, while fast water erodes the outside bend', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'geomorphology',
    topic: 'fluvial_processes',
    subtopic: 'meanders_and_rejuvenation',
    skills: ['meander_landforms'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p1',
    clues: '- Water flows faster around the outside of a bend.\n- Faster water erodes; slower water drops its load.',
  },
  {
    name: 'Question 3',
    question: 'Select ALL the conditions that favour the formation of a delta at a river mouth.',
    metadata: [
      'A shallow, gently sloping sea floor',
      'Strong ocean currents along the coast',
      'A small tidal range',
      'A large load of sediment carried by the river',
      'A steep, deep sea bed offshore',
    ],
    answer: [
      'A shallow, gently sloping sea floor',
      'A small tidal range',
      'A large load of sediment carried by the river',
      '',
      '',
    ],
    presentation: 'multi_select',
    type: 'application',
    unit: 'geomorphology',
    topic: 'fluvial_processes',
    subtopic: 'fluvial_landforms',
    skills: ['delta_formation_conditions'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p1',
    clues: '- A delta grows only if sediment is dropped faster than the sea removes it.\n- Ask whether each condition keeps or carries away the sediment.',
  },
  {
    name: 'Question 4',
    question: 'A farmer\'s fields lie on a flood plain behind natural levees. How do the levees help the farmer?',
    metadata: [
      'They speed up the river, so floodwater drains through the fields faster',
      'They raise the river banks, so the river overflows onto the fields less often',
      'They trap fertile silt in the channel, so the fields receive more nutrients',
      'They block groundwater, so the fields never become waterlogged',
      '',
    ],
    answer: ['They raise the river banks, so the river overflows onto the fields less often', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'geomorphology',
    topic: 'fluvial_processes',
    subtopic: 'fluvial_landforms',
    skills: ['fluvial_landform_processes'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p1',
    clues: '- Levees are ridges along the banks of the channel.\n- Think about what a higher bank does during a moderate flood.',
  },
  {
    name: 'Question 5',
    question: 'Which sequence correctly describes how an ox-bow lake forms?',
    metadata: [
      'Deposition narrows the meander neck, the river dries up and erosion deepens the old loop',
      'A waterfall retreats upstream and leaves a plunge pool cut off from the river',
      'Erosion narrows the meander neck, a flood cuts through and deposition seals the loop',
      'Tributaries meet at a confluence and their water collects in a hollow beside the river',
      '',
    ],
    answer: ['Erosion narrows the meander neck, a flood cuts through and deposition seals the loop', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'geomorphology',
    topic: 'fluvial_processes',
    subtopic: 'meanders_and_rejuvenation',
    skills: ['oxbow_lake_formation'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 5,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p1',
    clues: '- Start with what erosion does to the outside of two neighbouring bends.\n- Then think about what happens to the abandoned loop.',
  },
];

// ─── AI explanation (generated in the session, AMPM-CONTENT-AI-EXP) ──────────

const aiExplanation = {
  sub_questions: [
    {
      number: '2.2.1',
      marks: 1,
      clues: '- The valley in the sketch is narrow and V-shaped.\n- Which process cuts downwards into the land?',
      approach: '- Link the steep, narrow valley to the upper course.\n- Choose the process that deepens a channel.',
      solution: '1. A narrow V-shaped valley forms in the upper course.\n2. There the river cuts down into its bed.\n3. The answer is D (vertical erosion).',
    },
    {
      number: '2.2.2',
      marks: 1,
      clues: '- Water falling over a waterfall hits the river bed with great force.\n- What feature forms at the bottom?',
      approach: '- Think about erosion at the foot of a waterfall.\n- Choose the landform that is a deep hollow.',
      solution: '1. Falling water and rocks scour out a deep hollow at the base of a waterfall.\n2. This hollow is a plunge pool.\n3. The answer is D.',
    },
    {
      number: '2.2.3',
      marks: 1,
      clues: '- The sketch shows outcrops of hard rock with softer rock between them.\n- The water flows over several small steps.',
      approach: '- Distinguish a single large drop from a series of small ones.\n- Choose the landform.',
      solution: '1. Alternating hard and soft rock creates a series of small drops in the river bed.\n2. Fast, turbulent water over these steps forms rapids.\n3. The answer is C (rapid).',
    },
    {
      number: '2.2.4',
      marks: 1,
      clues: '- The landform is flat, low-lying and alongside the river.\n- It forms where the river floods in its lower course.',
      approach: '- Rule out landforms found at the river mouth or the foot of mountains.\n- Choose the flat land beside the river.',
      solution: '1. In the lower course the river floods and spreads sediment over the land beside it.\n2. This flat, low-lying area is the flood plain.\n3. The answer is C.',
    },
    {
      number: '2.2.5',
      marks: 1,
      clues: '- X is on the inner bank of the meander.\n- Water is slow there and deposits material.',
      approach: '- Recall the names of the slopes on the inner and outer banks.\n- Choose the one on the inner bank.',
      solution: '1. On the inner bank slow water deposits sediment, forming a gentle slope.\n2. This gentle slope is called the slip-off slope (the outer bank is the undercut slope).\n3. The answer is D.',
    },
    {
      number: '2.2.6',
      marks: 1,
      clues: '- The meander loop is cut off from the river.\n- What is left behind?',
      approach: '- Think about the water left in the abandoned loop.\n- Choose the landform.',
      solution: '1. When the river cuts through the neck of a meander, the old loop is cut off.\n2. Deposition seals it, leaving a curved lake.\n3. The answer is C (ox-bow lake).',
    },
    {
      number: '2.2.7',
      marks: 1,
      clues: '- Levees are raised banks along the river.\n- Think about what they do during a flood.',
      approach: '- Decide how higher banks affect water spilling onto the flood plain.\n- Choose the benefit.',
      solution: '1. Natural levees raise the height of the river banks.\n2. The river can hold more water before it overflows.\n3. The benefit is reduced flooding, so the answer is B.',
    },
    {
      number: '2.2.8',
      marks: 1,
      clues: '- A delta forms where sediment is deposited faster than the sea removes it.\n- Pick the two conditions that let sediment stay.',
      approach: '- Decide whether each condition helps sediment build up.\n- Choose the matching pair.',
      solution: '1. A shallow sea bed lets sediment build up near the surface.\n2. A small tidal range means the sediment is not washed away.\n3. Steep sea beds and strong currents remove sediment, so the answer is D: (i) and (iv).',
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
