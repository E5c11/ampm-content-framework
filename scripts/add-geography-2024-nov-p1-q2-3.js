#!/usr/bin/env node
/**
 * DBE Geography P1 — November 2024 — Question 2.3 (order 8)
 * Drainage patterns: identifying radial, centripetal, dendritic and trellis patterns, stream order, tributary angles, rock structure and limits on human activity.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-geography-2024-nov-p1-q2-3.js --curriculum temp/curriculum-vocab-geography-p1-2024.json
 *   node scripts/add-geography-2024-nov-p1-q2-3.js --dry-run
 *   node scripts/add-geography-2024-nov-p1-q2-3.js
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
  name: 'Question 2.3',
  syllabus: 'dbe',
  subject: 'geography',
  year: 2024,
  paper: 'nov_p1',
  order: 8,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['drainage_patterns', 'stream_order'],
  question_image_urls: [
    `${IMG}/q8/question_1.png`,
  ],
  memo_image_urls: [
    `${IMG}/q8/memo_1.png`,
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
    question: 'Match each drainage pattern to its description.',
    metadata: [
      'A - Radial',
      'B - Centripetal',
      'C - Dendritic',
      'D - Trellis',
      '1 - Streams flow outwards in all directions from a central high point',
      '2 - Streams flow inwards from all sides into a central basin',
      '3 - Tree-like branching on rock of uniform resistance',
      '4 - Tributaries join at right angles on folded hard and soft rock',
    ],
    answer: ['A-1', 'B-2', 'C-3', 'D-4'],
    presentation: 'match',
    type: 'definition',
    unit: 'geomorphology',
    topic: 'drainage_systems',
    subtopic: 'drainage_patterns_and_stream_order',
    skills: ['drainage_pattern_identification'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p1',
    clues: '- Two of the patterns are opposites: one flows away from a centre and one flows towards it.\n- The other two depend on the rock underneath.',
  },
  {
    name: 'Question 2',
    question: 'Two first-order streams join to form stream P. Another first-order stream then joins P. Further downstream, P joins stream Q, which is also second order. What is the stream order of the river below the junction of P and Q?',
    metadata: ['Stream order = ', '[ ]'],
    answer: ['3', '', '', '', ''],
    presentation: 'fitb',
    type: 'calc',
    unit: 'geomorphology',
    topic: 'drainage_systems',
    subtopic: 'drainage_patterns_and_stream_order',
    skills: ['stream_order_determination'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p1',
    keyboard_type: 'standard_math',
    clues: '- The order only increases when two streams of the same order meet.\n- A lower-order stream joining does not change the order.',
  },
  {
    name: 'Question 3',
    question: 'How do tributaries join the main river in a dendritic pattern compared with a trellis pattern?',
    metadata: [
      'Dendritic at right angles; trellis mostly at acute angles',
      'Both at right angles, because tributaries follow joints in the rock',
      'Dendritic at acute angles; trellis mostly at right angles',
      'Both at acute angles, because tributaries flow the same way as the main river',
      '',
    ],
    answer: ['Dendritic at acute angles; trellis mostly at right angles', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'interpretation',
    unit: 'geomorphology',
    topic: 'drainage_systems',
    subtopic: 'drainage_patterns_and_stream_order',
    skills: ['drainage_pattern_identification'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p1',
    clues: '- Picture the branches of a tree, then picture a garden trellis.',
  },
  {
    name: 'Question 4',
    question: 'Select ALL the rock conditions that lead to a trellis drainage pattern.',
    metadata: [
      'Rock of uniform resistance throughout the area',
      'Alternating bands of hard and soft rock',
      'Rock layers that have been folded',
      'A single dome of volcanic rock',
      'Soft rock eroded into parallel valleys between resistant ridges',
    ],
    answer: [
      'Alternating bands of hard and soft rock',
      'Rock layers that have been folded',
      'Soft rock eroded into parallel valleys between resistant ridges',
      '',
      '',
    ],
    presentation: 'multi_select',
    type: 'application',
    unit: 'geomorphology',
    topic: 'drainage_systems',
    subtopic: 'drainage_patterns_and_stream_order',
    skills: ['drainage_pattern_rock_structure'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p1',
    clues: '- A trellis pattern has long parallel streams with short tributaries.\n- Think about what makes rivers follow parallel lines.',
  },
  {
    name: 'Question 5',
    question: 'An area drained by a radial pattern lies around a steep volcanic dome. Select ALL the reasons why farming and building are limited there.',
    metadata: [
      'Steep slopes make building and farming difficult',
      'Thin soils that erode easily',
      'Groundwater lies very close to the surface everywhere',
      'A high risk of mass movement',
      'Flat land that floods every summer',
    ],
    answer: [
      'Steep slopes make building and farming difficult',
      'Thin soils that erode easily',
      'A high risk of mass movement',
      '',
      '',
    ],
    presentation: 'multi_select',
    type: 'application',
    unit: 'geomorphology',
    topic: 'drainage_systems',
    subtopic: 'drainage_patterns_and_stream_order',
    skills: ['drainage_pattern_land_use_limits'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 5,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p1',
    clues: '- A radial pattern forms around high, sloping ground.\n- Think about the slope, the soil and the stability of the land.',
  },
];

// ─── AI explanation (generated in the session, AMPM-CONTENT-AI-EXP) ──────────

const aiExplanation = {
  sub_questions: [
    {
      number: '2.3.1',
      marks: 1,
      clues: '- In sketch A the streams all flow away from the centre.\n- Name the pattern.',
      approach: '- Look at the direction of the arrows in sketch A.\n- Recall the pattern that spreads out like the spokes of a wheel.',
      solution: '1. The streams in A flow outwards in all directions from a central point.\n2. This is a radial (centrifugal) drainage pattern.\n3. Answer: radial.',
    },
    {
      number: '2.3.2',
      marks: 2,
      clues: '- Count how many first-order streams join to form the stream at X.\n- The order rises only when two streams of the same order meet.',
      approach: '- Trace the stream at X back to its sources.\n- Apply the stream-ordering rule at each junction.',
      solution: '1. The stream at X is formed where two first-order streams join.\n2. Two first-order streams make a second-order stream.\n3. Answer: second order.',
    },
    {
      number: '2.3.3',
      marks: 2,
      clues: '- Think about the shape of the land that produces this pattern.\n- Water always flows downhill.',
      approach: '- Describe the landform at the centre.\n- Explain why the water moves away from it.',
      solution: '1. The streams start on a high central point, such as a volcano or dome.\n2. They flow downhill in all directions away from it.\n3. Answer: they radiate outwards from a high-lying central point.',
    },
    {
      number: '2.3.4',
      marks: 2,
      clues: '- Look at where the tributaries meet the main streams in A and in B.\n- Compare the angles.',
      approach: '- Describe the angle in A.\n- Describe the angle in B and state the difference in one sentence.',
      solution: '1. In A the tributaries join the main streams at acute angles.\n2. In B the tributaries join the main streams at right angles.\n3. Both parts must be stated for the two marks.',
    },
    {
      number: '2.3.5',
      marks: 4,
      clues: '- A trellis pattern follows the structure of the rock.\n- Think about rock type and how the layers have been bent.',
      approach: '- State the rock-resistance condition.\n- State the rock-structure condition.',
      solution: '1. The underlying rock is made of alternate layers of hard and soft rock with varying resistance.\n2. The rock layers have been folded.\n3. Each condition earns two marks.',
    },
    {
      number: '2.3.6',
      marks: 4,
      clues: '- Both patterns form in hilly or mountainous areas.\n- Think about slope, soil and safety.',
      approach: '- Give two reasons why building or farming is difficult.\n- Explain each reason in a full sentence.',
      solution: '1. The land is steep and uneven, which makes building and farming difficult and expensive.\n2. Soils are thin, infertile and easily eroded.\n3. There is a risk of mass movement; any two such reasons earn the four marks.',
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
