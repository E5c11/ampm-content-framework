#!/usr/bin/env node
/**
 * DBE Geography P2 — November 2024 — Question 2.2 — IDZs, SDIs and Industrial Regions (order 7)
 * Industrial development strategies: the purpose of IDZs, the aims and impact of SDIs, the challenges IDZs face, and the factors that favour and restrict coastal industrial regions.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-geography-2024-nov-p2-q2-2.js --curriculum temp/curriculum-vocab-geography-p2-2024.json
 *   node scripts/add-geography-2024-nov-p2-q2-2.js --dry-run
 *   node scripts/add-geography-2024-nov-p2-q2-2.js
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
  name: 'Question 2.2',
  syllabus: 'dbe',
  subject: 'geography',
  year: 2024,
  paper: 'nov_p2',
  order: 7,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['industrial_development', 'sdi', 'industrial_regions'],
  question_image_urls: [
    `${IMG}/q7/question_1.png`,
  ],
  memo_image_urls: [
    `${IMG}/q7/memo_1.png`,
  ],
  exam_question_marks: 7,
  supplementary_materials: [],
};

// ─── Phase 3 data — the practice questions ───────────────────────────────────
// Per core/question-schema.md + presentations/{type}.md. Logical/authored shape
// (presentation, type, order, unit/topic/subtopic, skills, …) — the mapping to
// Postgres columns is tools/lib/content-rows.js's job.

const questions = [
  {
    name: 'Question 1',
    question: 'The Coega IDZ is built right beside the deep-water Port of Ngqura. Why does an IDZ need to be next to a port?',
    metadata: [
      'Its factories rely on fishing boats to supply their raw materials',
      'Its factories make goods for export, so ships can load next to the plants',
      'Its factories sell imported consumer goods to shoppers who arrive on cruise ships',
      'Its factories need sea water to cool their machines',
      '',
    ],
    answer: ['Its factories make goods for export, so ships can load next to the plants', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'economic_geography_sa',
    topic: 'industrial_development_strategies',
    subtopic: 'idz_and_industrial_location',
    skills: ['idz_concept'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p2',
    clues: '- Recall the main purpose of an industrial development zone.\n- Ask where the finished goods are meant to go.',
  },
  {
    name: 'Question 2',
    question: 'Match each feature of a spatial development initiative (SDI) to its economic purpose.',
    metadata: [
      'A - It is placed in an underdeveloped region',
      'B - It upgrades a road and rail corridor',
      'C - It is a partnership between government and private firms',
      'D - It links to a port in a neighbouring country',
      '1 - Attracts private investment alongside public money',
      '2 - Opens up cross-border trade',
      '3 - Spreads development away from the existing core regions',
      '4 - Cuts transport costs for the firms that locate there',
    ],
    answer: ['A-3', 'B-4', 'C-1', 'D-2'],
    presentation: 'match',
    type: 'application',
    unit: 'economic_geography_sa',
    topic: 'industrial_development_strategies',
    subtopic: 'idz_and_industrial_location',
    skills: ['sdi_concept_and_impact'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p2',
    clues: '- For each feature, ask what problem it is meant to solve for investors or for the region.',
  },
  {
    name: 'Question 3',
    question: 'Select ALL the SOCIAL challenges an IDZ may face in a rural coastal area.',
    metadata: [
      'Local workers lack the skills the factories need',
      'The harbour is too shallow for large ships',
      'Job seekers flood in and informal housing grows',
      'There is too little flat land for factories',
      'Local schools and clinics come under pressure',
    ],
    answer: [
      'Local workers lack the skills the factories need',
      'Job seekers flood in and informal housing grows',
      'Local schools and clinics come under pressure',
      '',
      '',
    ],
    presentation: 'multi_select',
    type: 'application',
    unit: 'economic_geography_sa',
    topic: 'industrial_development_strategies',
    subtopic: 'idz_and_industrial_location',
    skills: ['idz_sdi_challenges'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p2',
    clues: '- A social challenge is about people and communities.\n- Physical features of the site are a different kind of problem.',
  },
  {
    name: 'Question 4',
    question: 'Which factor most restricts industrial growth in the Port Elizabeth-Uitenhage (Nelson Mandela Bay) industrial region?',
    metadata: [
      'It has no harbour for importing parts',
      'It has too few people to supply labour',
      'It is far from the large Gauteng market and inland raw materials',
      'It has no rail or road link to the rest of the country',
      '',
    ],
    answer: ['It is far from the large Gauteng market and inland raw materials', '', '', '', ''],
    presentation: 'multiple_choice',
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
    clues: '- The region has a port, a large city and transport links.\n- Think about where most South African buyers and minerals are.',
  },
  {
    name: 'Question 5',
    question: 'Select ALL the PHYSICAL factors that favour industry in a coastal industrial region.',
    metadata: [
      'Government tax incentives for new factories',
      'A sheltered natural bay for a harbour',
      'A large local market of consumers',
      'Flat coastal land for factory sites',
      'A reliable supply of fresh water',
    ],
    answer: [
      'A sheltered natural bay for a harbour',
      'Flat coastal land for factory sites',
      'A reliable supply of fresh water',
      '',
      '',
    ],
    presentation: 'multi_select',
    type: 'definition',
    unit: 'economic_geography_sa',
    topic: 'industrial_regions',
    subtopic: 'core_industrial_regions',
    skills: ['economic_vs_physical_factors'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 5,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p2',
    clues: '- Physical factors come from nature, not from people or governments.',
  },
];

// ─── AI explanation (generated in the session, AMPM-CONTENT-AI-EXP) ──────────

const aiExplanation = {
  sub_questions: [
    {
      number: '2.2.1',
      marks: 1,
      clues: '- IDZs are linked to ports and to earning foreign income.',
      approach: '- Recall why IDZs were created.\n- Decide whether they aim to bring goods in or send goods out.',
      solution: '1. IDZs are industrial estates near ports, built to attract export-oriented investment.\n2. Their main purpose is to promote exports.\n3. The answer is Y.',
    },
    {
      number: '2.2.2',
      marks: 1,
      clues: '- SDIs aim to spread development.',
      approach: '- Recall where SDIs are planned.\n- Choose the type of area that needs development.',
      solution: '1. SDIs target areas with untapped potential that need investment.\n2. They are generally located in underdeveloped areas.\n3. The answer is Y.',
    },
    {
      number: '2.2.3',
      marks: 1,
      clues: '- The question asks for an economic impact.',
      approach: '- Separate the social outcome from the economic one.\n- Choose the option about investment in the economy.',
      solution: '1. Improved quality of life is a social impact.\n2. Upgraded infrastructure is an economic impact that supports industry and trade.\n3. The answer is Z.',
    },
    {
      number: '2.2.4',
      marks: 1,
      clues: '- A social challenge concerns people.',
      approach: '- Separate the social option from the physical or infrastructure one.\n- Choose the one about the workforce.',
      solution: '1. Poor harbour facilities would be an infrastructure problem (Saldanha Bay in fact has a deep-water port).\n2. An unskilled local workforce is a social challenge.\n3. The answer is Y.',
    },
    {
      number: '2.2.5',
      marks: 1,
      clues: '- Saldanha Bay exports iron ore.',
      approach: '- Recall the main industry linked to the West Coast SDI.\n- Connect it to the iron ore that reaches Saldanha.',
      solution: '1. Iron ore is railed from Sishen to Saldanha Bay.\n2. The West Coast SDI is built around a steel plant.\n3. The answer is Z.',
    },
    {
      number: '2.2.6',
      marks: 1,
      clues: '- Cape Town has a large local population.',
      approach: '- Decide which option is actually a weakness of the region.\n- Think about what heavy industry needs that the region lacks.',
      solution: '1. The South-western Cape has a large local market.\n2. It has few mineral resources, which restricts heavy industry.\n3. The answer is Y.',
    },
    {
      number: '2.2.7',
      marks: 1,
      clues: '- A physical factor comes from nature.',
      approach: '- Separate the physical factor from the economic one.\n- Choose the natural advantage.',
      solution: '1. Overseas markets are an economic factor.\n2. A coastal location, with natural harbours, is a physical factor.\n3. The answer is Z.',
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
