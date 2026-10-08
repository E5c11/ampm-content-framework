#!/usr/bin/env node
/**
 * DBE Geography P2 — November 2024 — Question 2.4 — Core Industrial Regions (order 9)
 * Core industrial regions: share of national output and labour, the role of the transport network, regional challenges, and the trade-offs of moving to high value-added production.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-geography-2024-nov-p2-q2-4.js --curriculum temp/curriculum-vocab-geography-p2-2024.json
 *   node scripts/add-geography-2024-nov-p2-q2-4.js --dry-run
 *   node scripts/add-geography-2024-nov-p2-q2-4.js
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
  name: 'Question 2.4',
  syllabus: 'dbe',
  subject: 'geography',
  year: 2024,
  paper: 'nov_p2',
  order: 9,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['industrial_regions', 'industrial_development'],
  question_image_urls: [
    `${IMG}/q9/question_1.png`,
    `${IMG}/q9/question_2.png`,
  ],
  memo_image_urls: [
    `${IMG}/q9/memo_1.png`,
    `${IMG}/q9/memo_2.png`,
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
    question: "The Durban-Pinetown industrial region employs 420\u00a0000 of South Africa's 2\u00a0800\u00a0000 manufacturing workers. What percentage of the country's manufacturing workers is this?",
    metadata: ['Share = ', '[ ]', ' %'],
    answer: ['15', '', '', '', ''],
    presentation: 'fitb',
    type: 'calc',
    unit: 'economic_geography_sa',
    topic: 'industrial_regions',
    subtopic: 'core_industrial_regions',
    skills: ['gdp_contribution_calc'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p2',
    keyboard_type: 'standard_math',
    clues: '- Divide the part by the whole.\n- Multiply by 100 to turn it into a percentage.',
  },
  {
    name: 'Question 2',
    question: "An industrial region holds a much larger share of the country's workers than of its population. Which evidence best explains this?",
    metadata: [
      'The region has a warm climate that attracts retired people',
      'Thousands of firms in the region each employ many workers',
      'The region has more farmland than any other province',
      "Most of the region's people commute to jobs in other provinces",
      '',
    ],
    answer: ['Thousands of firms in the region each employ many workers', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'interpretation',
    unit: 'economic_geography_sa',
    topic: 'industrial_regions',
    subtopic: 'core_industrial_regions',
    skills: ['core_industrial_region_factors'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p2',
    clues: '- Workers move to where the jobs are.\n- Check whether each option creates jobs inside the region.',
  },
  {
    name: 'Question 3',
    question: 'Select ALL the ways a dense network of highways supports industry in a core industrial region.',
    metadata: [
      'Moves raw materials and finished goods quickly',
      'Removes the need for a harbour',
      'Links factories to large markets and to the port',
      'Lowers transport costs, which attracts investors',
      'Keeps workers away from the factories',
    ],
    answer: [
      'Moves raw materials and finished goods quickly',
      'Links factories to large markets and to the port',
      'Lowers transport costs, which attracts investors',
      '',
      '',
    ],
    presentation: 'multi_select',
    type: 'application',
    unit: 'economic_geography_sa',
    topic: 'industrial_regions',
    subtopic: 'core_industrial_regions',
    skills: ['industrial_location_factors'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p2',
    clues: '- Think about inputs coming in and products going out.\n- Think about cost and speed.',
  },
  {
    name: 'Question 4',
    question: 'Select ALL the challenges faced by the Durban-Pinetown core industrial region.',
    metadata: [
      'Load-shedding stops production lines',
      'It is far from a harbour, which raises export costs',
      'Traffic congestion delays deliveries',
      'There is little flat land for new factories',
      'There is a shortage of unskilled workers',
    ],
    answer: [
      'Load-shedding stops production lines',
      'Traffic congestion delays deliveries',
      'There is little flat land for new factories',
      '',
      '',
    ],
    presentation: 'multi_select',
    type: 'application',
    unit: 'economic_geography_sa',
    topic: 'industrial_regions',
    subtopic: 'core_industrial_regions',
    skills: ['core_industrial_region_factors'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p2',
    clues: '- Durban is a port city in hilly country with a large population.\n- Reject any challenge that does not fit that location.',
  },
  {
    name: 'Question 5',
    question: 'Factories in a region switch from low value-added to high value-added production. Match each change to its consequence.',
    metadata: [
      'A - Robots replace assembly-line workers',
      'B - Precision goods sell for higher prices',
      'C - Firms now need software engineers',
      'D - Automated plants must be bought and installed',
      '1 - A large capital outlay is needed',
      '2 - Fewer jobs for unskilled workers',
      '3 - Workers must be upskilled, or skills brought in',
      '4 - Higher profits for the firms',
    ],
    answer: ['A-2', 'B-4', 'C-3', 'D-1'],
    presentation: 'match',
    type: 'application',
    unit: 'economic_geography_sa',
    topic: 'industrial_regions',
    subtopic: 'core_industrial_regions',
    skills: ['value_added_production'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 5,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p2',
    clues: '- Some consequences are advantages and some are disadvantages.\n- Link each change to who gains or who pays.',
  },
];

// ─── AI explanation (generated in the session, AMPM-CONTENT-AI-EXP) ──────────

const aiExplanation = {
  sub_questions: [
    {
      number: '2.4.1',
      marks: 1,
      clues: '- Read the statistics box, not the extract.',
      approach: '- Find the bullet that mentions GDP.\n- Copy the percentage.',
      solution: '1. The statistics list a 38% contribution to the GDP of South Africa.\n2. The answer is 38%.',
    },
    {
      number: '2.4.2',
      marks: 2,
      clues: '- The answer must be a quote from the extract.',
      approach: '- Find the sentence about manufacturing businesses.\n- Quote the part that shows many jobs.',
      solution: '1. The extract says about 10 000 businesses in the manufacturing sector employ over half a million people.\n2. Quoting either the number of businesses or "employ over half a million people" earns two marks.',
    },
    {
      number: '2.4.3',
      marks: 4,
      clues: '- Look at how the roads connect Pretoria, the Witwatersrand and Vereeniging to other towns.',
      approach: '- Explain how roads help move inputs and products.\n- Explain how they link industry to markets and investors.\n- Give two explained roles.',
      solution: '1. Roads allow effective transport of goods, raw materials and labour.\n2. They give access to major markets, and the dense network gives greater accessibility.\n3. Short, direct routes cut costs, attract investors and reduce congestion.\n4. Any two explained roles earn the four marks.',
    },
    {
      number: '2.4.4',
      marks: 4,
      clues: '- Think about power, water, transport and land in Gauteng.',
      approach: "- Consider infrastructure problems.\n- Consider Gauteng's inland position and limited space.\n- Explain two challenges.",
      solution: '1. Load-shedding reduces production, and water shortages affect industry.\n2. Traffic congestion, deteriorating rail and high fuel prices raise transport costs.\n3. Gauteng is far from harbours and has limited land for expansion.\n4. Crime, strikes, pollution, skills shortages and political uncertainty are also accepted; any two earn the four marks.',
    },
    {
      number: '2.4.5',
      marks: 4,
      clues: '- Use the glossary: high value-added production uses advanced technology.',
      approach: '- Give one gain from more efficient, advanced production.\n- Give one cost or loss it causes.\n- You must give one of each.',
      solution: '1. Advantages include higher profits, efficient production, upskilling, more investment and access to larger markets.\n2. Disadvantages include fewer jobs for unskilled workers, high capital outlay, high skills and maintenance costs and losses during load-shedding.\n3. One advantage and one disadvantage earn the four marks.',
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
