#!/usr/bin/env node
/**
 * DBE Geography P2 — November 2024 — Question 1.1 — Settlement Site, Shape, Pattern and Land Reform (order 1)
 * Rural settlements: site vs situation, wet- and dry-point sites, the causes of settlement shapes, dispersed vs nucleated patterns and the land reform programmes.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-geography-2024-nov-p2-q1-1.js --curriculum temp/curriculum-vocab-geography-p2-2024.json
 *   node scripts/add-geography-2024-nov-p2-q1-1.js --dry-run
 *   node scripts/add-geography-2024-nov-p2-q1-1.js
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
  name: 'Question 1.1',
  syllabus: 'dbe',
  subject: 'geography',
  year: 2024,
  paper: 'nov_p2',
  order: 1,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['site_situation', 'settlement_pattern', 'settlement_siting', 'land_reform'],
  question_image_urls: [
    `${IMG}/q1/question_1.png`,
  ],
  memo_image_urls: [
    `${IMG}/q1/memo_1.png`,
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
    question: 'A farming village is built on a raised river terrace above the flood level. It lies 2 km from a main road junction and 18 km from a market town. Which detail describes its situation rather than its site?',
    metadata: [
      'It is built on raised ground above the flood level',
      'It is 2 km from a road junction and 18 km from a market town',
      'It stands on a well-drained, gently sloping terrace beside the river',
      'It occupies the flat ground of the terrace itself',
      '',
    ],
    answer: ['It is 2 km from a road junction and 18 km from a market town', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'rural_urban_settlement',
    topic: 'settlement_classification',
    subtopic: 'settlement_hierarchy_and_form',
    skills: ['site_vs_situation'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p2',
    clues: '- Site is about the exact land a settlement stands on.\n- Situation is about where it lies in relation to the places around it.',
  },
  {
    name: 'Question 2',
    question: 'Match each rural settlement shape to the factor that most likely produced it.',
    metadata: [
      'A - Linear',
      'B - Round',
      'C - T-shaped',
      'D - Cross-road',
      '1 - Houses grouped around a central well or cattle kraal for shared use and defence',
      '2 - Houses built along a valley floor or a single road',
      '3 - Houses built where two roads cross each other',
      '4 - Houses built where one road ends against another road',
    ],
    answer: ['A-2', 'B-1', 'C-4', 'D-3'],
    presentation: 'match',
    type: 'application',
    unit: 'rural_urban_settlement',
    topic: 'settlement_classification',
    subtopic: 'settlement_hierarchy_and_form',
    skills: ['settlement_shape_factors'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p2',
    clues: '- A settlement takes the shape of whatever it grows along or around.\n- Picture the outline the houses would make on a map.',
  },
  {
    name: 'Question 3',
    question: 'Settlement X grew around the only permanent spring in a semi-arid district. Settlement Y was built on a small rise in a marshy river delta. How are their sites classified?',
    metadata: [
      'X is a dry-point site and Y is a wet-point site',
      'X and Y are both wet-point sites',
      'X is a wet-point site and Y is a dry-point site',
      'X and Y are both dry-point sites',
      '',
    ],
    answer: ['X is a wet-point site and Y is a dry-point site', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'rural_urban_settlement',
    topic: 'settlement_classification',
    subtopic: 'settlement_hierarchy_and_form',
    skills: ['settlement_siting_factors'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p2',
    clues: '- Ask what each settlement was trying to reach or to avoid.\n- In a dry area water is scarce; in a marsh it is the problem.',
  },
  {
    name: 'Question 4',
    question: 'Select ALL the reasons why commercial farmers on a dispersed pattern of farms usually earn greater profits than farmers who live in a nucleated village and walk out to their fields.',
    metadata: [
      'Schools and clinics are closer to every household',
      'Each farmer lives on the farm, so no time is lost travelling to the fields',
      'Neighbours are close by for security and help',
      'Large single holdings allow machinery and economies of scale',
      'The farmer alone decides how the land is used',
    ],
    answer: [
      'Each farmer lives on the farm, so no time is lost travelling to the fields',
      'Large single holdings allow machinery and economies of scale',
      'The farmer alone decides how the land is used',
      '',
      '',
    ],
    presentation: 'multi_select',
    type: 'application',
    unit: 'rural_urban_settlement',
    topic: 'settlement_classification',
    subtopic: 'settlement_hierarchy_and_form',
    skills: ['settlement_pattern_types'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p2',
    clues: '- Separate the economic advantages of living apart from the social advantages of living together.\n- Only the economic ones raise profit.',
  },
  {
    name: 'Question 5',
    question: 'A community was forcibly removed from its land in 1975. In 2023 the state returns the land to the community, and later each household receives secure, registered rights to its plot. Which land reform programmes describe these two steps, in order?',
    metadata: [
      'Land redistribution, then land restitution',
      'Land tenure reform, then land redistribution',
      'Land redistribution, then land tenure reform',
      'Land restitution, then land tenure reform',
      '',
    ],
    answer: ['Land restitution, then land tenure reform', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'rural_urban_settlement',
    topic: 'rural_settlement_issues',
    subtopic: 'rural_depopulation_and_land_reform',
    skills: ['land_reform_types'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 5,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p2',
    clues: '- One programme returns land to people who lost it; another gives land to new owners; a third secures the rights of people already living on land.\n- Match each step to its purpose.',
  },
];

// ─── AI explanation (generated in the session, AMPM-CONTENT-AI-EXP) ──────────

const aiExplanation = {
  sub_questions: [
    {
      number: '1.1.1',
      marks: 1,
      clues: '- Decide whether the statement is about the land itself or about the surrounding area.',
      approach: '- Recall the difference between site and situation.\n- Choose the term that refers to the actual piece of land.',
      solution: '1. Site is the exact piece of land a settlement is built on.\n2. Situation is its position relative to surrounding features.\n3. The answer is Z (site).',
    },
    {
      number: '1.1.2',
      marks: 1,
      clues: "- A commercial farm sells what it produces.\n- Think about which option is about the farm's surroundings rather than its land.",
      approach: '- Recall that situation looks outward from the settlement.\n- Ask which factor a commercial livestock farmer needs to reach.',
      solution: '1. Situation describes a settlement in relation to the wider area.\n2. A commercial livestock farm must be within reach of buyers.\n3. Markets are a situation factor, so the answer is Z (markets).',
    },
    {
      number: '1.1.3',
      marks: 1,
      clues: '- In an arid area, what is the scarcest resource?',
      approach: '- Recall what wet-point and dry-point sites are drawn to or away from.\n- Link the arid setting to the right term.',
      solution: '1. A wet-point settlement is sited near a reliable water source.\n2. Dry-point sites avoid water, for example by building above a floodplain.\n3. Settling near water in an arid area is wet-point, so the answer is Y.',
    },
    {
      number: '1.1.4',
      marks: 1,
      clues: '- Picture houses built along the bank of a river.',
      approach: '- Think about the outline the houses make when they follow a river.\n- Choose the matching shape.',
      solution: '1. A river is a long, narrow feature.\n2. Houses built along it form a long, narrow settlement.\n3. The shape is linear, so the answer is Z.',
    },
    {
      number: '1.1.5',
      marks: 1,
      clues: '- Order the rural settlements from smallest to largest.',
      approach: '- Recall the rural hierarchy: isolated farmstead, hamlet, village.\n- Pick the higher of the two options.',
      solution: '1. A hamlet is a small cluster of a few dwellings.\n2. A village is larger and offers some basic services.\n3. The village is the largest rural settlement type, so the answer is Y.',
    },
    {
      number: '1.1.6',
      marks: 1,
      clues: '- Compare farmers living on their own land with farmers living together in one cluster.',
      approach: '- Think about travel time, farm size and control over land.\n- Decide which pattern favours commercial farming.',
      solution: '1. In a dispersed pattern each farmer lives on a large farm.\n2. Large farms allow mechanisation and more production with no time lost travelling.\n3. Greater profits go with the dispersed pattern, so the answer is Y.',
    },
    {
      number: '1.1.7',
      marks: 1,
      clues: '- One option returns land; the other is about the terms on which land is held.',
      approach: '- Recall the three land reform programmes.\n- Choose the one that gives land back to people who lost it.',
      solution: '1. Land restitution returns land, or pays compensation, to people dispossessed after 1913.\n2. Land tenure reform secures the rights of people who already occupy land.\n3. The answer is Y (land restitution).',
    },
    {
      number: '1.1.8',
      marks: 1,
      clues: '- An economic challenge concerns money or income.',
      approach: '- Check each option against the word "economic".\n- Note that the memo accepts more than one answer.',
      solution: '1. Poverty limits what new owners can invest in farming the land.\n2. Legal disputes over claims also delay and add cost to land reform.\n3. The memo accepts either Y or Z.',
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
