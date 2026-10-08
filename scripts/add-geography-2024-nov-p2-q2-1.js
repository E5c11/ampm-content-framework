#!/usr/bin/env node
/**
 * DBE Geography P2 — November 2024 — Question 2.1 — Farming Scale, Economic Sectors and Cattle Farming (order 6)
 * Small- vs large-scale farming, the economic sectors along a farm value chain, and the factors that favour and hinder cattle farming in South Africa.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-geography-2024-nov-p2-q2-1.js --curriculum temp/curriculum-vocab-geography-p2-2024.json
 *   node scripts/add-geography-2024-nov-p2-q2-1.js --dry-run
 *   node scripts/add-geography-2024-nov-p2-q2-1.js
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
  name: 'Question 2.1',
  syllabus: 'dbe',
  subject: 'geography',
  year: 2024,
  paper: 'nov_p2',
  order: 6,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['agriculture', 'economic_sectors'],
  question_image_urls: [
    `${IMG}/q6/question_1.png`,
    `${IMG}/q6/question_2.png`,
  ],
  memo_image_urls: [
    `${IMG}/q6/memo_1.png`,
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
    question: 'Match each activity in the beef industry to its economic sector.',
    metadata: [
      'A - Rearing cattle on a farm',
      'B - Processing meat into sausages in a factory',
      'C - Trucking meat to supermarkets and selling it',
      'D - Researching a new vaccine for a cattle disease',
      '1 - Secondary',
      '2 - Quaternary',
      '3 - Primary',
      '4 - Tertiary',
    ],
    answer: ['A-3', 'B-1', 'C-4', 'D-2'],
    presentation: 'match',
    type: 'definition',
    unit: 'economic_geography_sa',
    topic: 'structure_of_economy',
    subtopic: 'economic_sector_classification',
    skills: ['economic_sector_value_chain'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p2',
    clues: '- Follow the product from the land, to the factory, to the shop.\n- One activity produces knowledge rather than goods.',
  },
  {
    name: 'Question 2',
    question: 'Farm X grows maize on 3 ha, worked by a family with hand tools. Farm Y grows maize on 2\u00a0000 ha with combine harvesters. Why does Farm Y make far larger profits?',
    metadata: [
      'It pays less tax per hectare than a small farm does',
      'Its harvest is so large that each tonne costs less to produce',
      'It needs no workers at all once machines are bought',
      'It sells its maize at a higher price per tonne than Farm X',
      '',
    ],
    answer: ['Its harvest is so large that each tonne costs less to produce', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'economic_geography_sa',
    topic: 'agriculture',
    subtopic: 'food_security_and_farming_scale',
    skills: ['farming_scale_comparison'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p2',
    clues: '- Both farms sell the same crop on the same market.\n- Think about what happens to the cost of each unit when output is very large.',
  },
  {
    name: 'Question 3',
    question: 'Select ALL the characteristics of small-scale farming.',
    metadata: [
      'Heavy use of hybrid seed and centre-pivot irrigation',
      'Work is done mostly by hand',
      'Crops are grown on small plots',
      'Large capital investment in machinery',
      'Most produce feeds the household or is sold locally',
    ],
    answer: [
      'Work is done mostly by hand',
      'Crops are grown on small plots',
      'Most produce feeds the household or is sold locally',
      '',
      '',
    ],
    presentation: 'multi_select',
    type: 'definition',
    unit: 'economic_geography_sa',
    topic: 'agriculture',
    subtopic: 'food_security_and_farming_scale',
    skills: ['farming_scale_comparison'],
    difficulty: 1,
    exam_weight: 2,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p2',
    clues: '- Small-scale farmers have little money to spend on inputs.\n- Think about who eats or buys what they grow.',
  },
  {
    name: 'Question 4',
    question: 'Why is the semi-arid interior of the Northern Cape better suited to extensive livestock farming than to crop farming?',
    metadata: [
      'Its heavy summer rain washes the soil away from crop fields',
      'Its cold, wet winters are ideal for keeping animals indoors',
      'Its rainfall is too low for crops but natural grazing covers wide areas',
      'Its many large, permanent rivers supply enough water to flood the pastures every year',
      '',
    ],
    answer: ['Its rainfall is too low for crops but natural grazing covers wide areas', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'economic_geography_sa',
    topic: 'agriculture',
    subtopic: 'agricultural_factors_and_impact',
    skills: ['agricultural_climatic_factors'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p2',
    clues: '- "Semi-arid" tells you about the rainfall.\n- "Extensive" farming spreads animals over a large area.',
  },
  {
    name: 'Question 5',
    question: 'Select ALL the challenges faced by small-scale cattle farmers in South Africa.',
    metadata: [
      'Too much demand from overseas buyers',
      'Outbreaks of foot-and-mouth disease',
      'Droughts that reduce the grazing',
      'Little access to credit for feed and vaccines',
      'Grazing that is too wet for cattle all year',
    ],
    answer: [
      'Outbreaks of foot-and-mouth disease',
      'Droughts that reduce the grazing',
      'Little access to credit for feed and vaccines',
      '',
      '',
    ],
    presentation: 'multi_select',
    type: 'application',
    unit: 'economic_geography_sa',
    topic: 'agriculture',
    subtopic: 'food_security_and_farming_scale',
    skills: ['small_scale_farming_challenges'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 5,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p2',
    clues: "- Think about threats to the animals, to their food and to the farmer's money.\n- Reject anything that would actually help the farmer or that does not fit South Africa's climate.",
  },
];

// ─── AI explanation (generated in the session, AMPM-CONTENT-AI-EXP) ──────────

const aiExplanation = {
  sub_questions: [
    {
      number: '2.1.1',
      marks: 1,
      clues: '- Small-scale and large-scale are both about size.',
      approach: '- Read the four options.\n- Pick the one that names the basic difference in size.',
      solution: '1. The terms small-scale and large-scale refer to the size of the farming operation.\n2. The main difference is the size of the farm holdings.\n3. The answer is A.',
    },
    {
      number: '2.1.2',
      marks: 1,
      clues: '- Look for farming done by hand on a small plot.',
      approach: '- Check each photograph for machinery or manual work.\n- Choose the one with people working by hand.',
      solution: '1. Photographs P and R show machinery, and Q shows a large herd.\n2. Photograph S shows people watering a small plot by hand.\n3. The answer is D (S).',
    },
    {
      number: '2.1.3',
      marks: 1,
      clues: '- Look at what the people in the photograph are doing.',
      approach: '- Rule out options that need money or export markets.\n- Choose what the photograph actually shows.',
      solution: '1. Hybrid seeds, export markets and high capital are features of large-scale farming.\n2. Photograph S shows people carrying water and working by hand.\n3. The answer is D (the use of manual labour).',
    },
    {
      number: '2.1.4',
      marks: 1,
      clues: '- An economic advantage is a financial gain.',
      approach: '- Separate methods (machinery, monoculture, labour) from outcomes.\n- Choose the outcome that is a financial benefit.',
      solution: '1. Machinery and monoculture are methods, and a large labour force is a cost.\n2. Larger profits are the economic advantage of farming at scale.\n3. The answer is B.',
    },
    {
      number: '2.1.5',
      marks: 1,
      clues: '- Cattle farming takes a resource directly from the land.',
      approach: '- Recall the four economic sectors.\n- Match farming to its sector.',
      solution: '1. The primary sector extracts or produces raw materials from nature.\n2. Farming, including cattle farming, is a primary activity.\n3. The answer is A.',
    },
    {
      number: '2.1.6',
      marks: 1,
      clues: '- Distribution moves finished goods to the people who buy them.',
      approach: '- Decide whether distribution makes, extracts or provides a service.\n- Match it to the sector.',
      solution: '1. Transporting and selling products is a service.\n2. Services belong to the tertiary sector.\n3. The answer is C.',
    },
    {
      number: '2.1.7',
      marks: 1,
      clues: '- Cattle need food more than anything else.',
      approach: "- Check each option against South Africa's climate.\n- Choose the factor that actually supports cattle.",
      solution: '1. Much of South Africa is semi-arid, so heavy rainfall is not typical.\n2. Large areas of natural grass support grazing animals.\n3. The answer is C (available grazing land).',
    },
    {
      number: '2.1.8',
      marks: 1,
      clues: '- Two statements are real problems for a small cattle farmer.',
      approach: '- Eliminate statements that are not about farming or are opportunities.\n- Find the option that combines the remaining two.',
      solution: '1. Unemployment is a national issue and the export market is an opportunity.\n2. Animal diseases and semi-arid land are direct challenges for small-scale cattle farmers.\n3. Statements (ii) and (iii) apply, so the answer is B.',
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
