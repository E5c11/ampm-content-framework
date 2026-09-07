#!/usr/bin/env node
/**
 * DBE Geography P2 — November 2025 — Question 1.1 (order 1)
 * Rural settlement classification: basis of classification, site vs situation,
 * hamlet vs village, settlement pattern (nucleated/dispersed), settlement siting
 * (wet-point/dry-point), settlement shape (linear/round).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-geography-2025-nov-p2-q1-1.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-geography-2025-nov-p2-q1-1.js --dry-run
 *   node scripts/add-geography-2025-nov-p2-q1-1.js
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

// ─── Phase 2 — lesson document ───────────────────────────────────────────────

const video = {
  name: 'Question 1.1',
  syllabus: 'dbe',
  subject: 'geography',
  year: 2025,
  paper: 'nov_p2',
  order: 1,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['rural_settlement', 'site_situation', 'settlement_pattern', 'settlement_siting'],
  question_image_urls: [`${IMG}/q1/question_1.png`],
  memo_image_urls: [`${IMG}/q1/memo_1.png`],
  exam_question_marks: 7,
  supplementary_materials: [],
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    name: 'Question 1',
    question: 'Match each rural settlement term to its correct definition.',
    metadata: [
      'A - Site',
      'B - Situation',
      'C - Hamlet',
      'D - Village',
      '1 - The exact physical spot where a settlement stands, e.g. on a hilltop or riverbank',
      "2 - A settlement's position relative to surrounding features like roads, rivers or other towns",
      '3 - A small, loose cluster of only a few farmsteads with no real services',
      '4 - A settlement with mostly rural functions but a few urban services such as a small shop or clinic',
    ],
    answer: ['A-1', 'B-2', 'C-3', 'D-4'],
    presentation: 'match',
    type: 'definition',
    unit: 'rural_urban_settlement',
    topic: 'settlement_classification',
    subtopic: 'settlement_hierarchy_and_form',
    skills: ['site_vs_situation', 'rural_settlement_hierarchy'],
    difficulty: 2,
    exam_weight: 1,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Site is about the exact spot; situation is about surroundings.\n- Hamlet is smaller and looser than a village; a village has a few extra urban-type services.',
  },
  {
    name: 'Question 2',
    question: 'A rural settlement where the farmsteads are spread far apart across the landscape, with no visible clustering, has a ___ pattern.',
    metadata: ['linear', 'dispersed', 'nucleated', 'radial', ''],
    answer: ['dispersed', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'interpretation',
    unit: 'rural_urban_settlement',
    topic: 'settlement_classification',
    subtopic: 'settlement_hierarchy_and_form',
    skills: ['settlement_pattern_types'],
    difficulty: 2,
    exam_weight: 1,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Nucleated settlements cluster tightly together; this one does the opposite.\n- No clustering, spread far apart = dispersed.',
  },
  {
    name: 'Question 3',
    question: 'A rural settlement built on a raised, well-drained mound in an otherwise low-lying, marshy area was most likely sited there to avoid flooding — this is an example of a ___ site.',
    metadata: ['wet-point', 'dry-point', 'low-lying', 'coastal', ''],
    answer: ['dry-point', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'interpretation',
    unit: 'rural_urban_settlement',
    topic: 'settlement_classification',
    subtopic: 'settlement_hierarchy_and_form',
    skills: ['settlement_siting_factors'],
    difficulty: 2,
    exam_weight: 1,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p2',
    clues: '- A dry-point site is chosen specifically to stay above flood level in a wet area.\n- A wet-point site is the opposite — chosen for reliable access to water in an otherwise dry area.',
  },
];

// ─── AI explanation (AMPM-CONTENT-AI-EXP) — one entry per exam sub-question ───

const aiExplanation = {
  sub_questions: [
    {
      number: '1.1.1',
      marks: 1,
      clues: '- Rural vs urban classification is based on what a settlement offers, not how many people live there.',
      approach: '- Recall that settlements are classified as rural or urban according to the range/number of functions they perform.',
      solution: '1. Rural settlements are classified based on the NUMBER OF FUNCTIONS they offer, not total population.\n2. Answer: Y (the number of functions)',
    },
    {
      number: '1.1.2',
      marks: 1,
      clues: '- Site is the exact spot; situation is the wider position relative to other features.',
      approach: '- Distinguish "the actual physical position where a settlement is located" (site) from its situation (relation to surroundings).',
      solution: '1. "The actual physical position where a rural settlement is located" is the definition of SITE, not situation.\n2. Answer: Y (site)',
    },
    {
      number: '1.1.3',
      marks: 1,
      clues: '- A hamlet is smaller and less organised than a village or town.',
      approach: '- Recall the settlement size hierarchy: hamlet < village < town.',
      solution: '1. "A loose grouping of farmsteads" describes a HAMLET, the smallest rural settlement unit.\n2. Answer: Z (hamlet)',
    },
    {
      number: '1.1.4',
      marks: 1,
      clues: '- A village has a few urban-type functions on top of its rural functions; a farmstead has none.',
      approach: '- Compare "mostly rural functions and some urban functions" against the definitions of farmstead and village.',
      solution: '1. A settlement with mostly rural functions plus some urban functions is a VILLAGE (a farmstead has no urban functions at all).\n2. Answer: Z (village)',
    },
    {
      number: '1.1.5',
      marks: 1,
      clues: '- Nucleated settlements cluster together; dispersed settlements are spread apart with no clustering.',
      approach: '- Read the sketch: are the settlement symbols clustered together or scattered apart?',
      solution: '1. The settlement symbols in the sketch are spread apart with no clustering.\n2. Answer: Z (dispersed)',
    },
    {
      number: '1.1.6',
      marks: 1,
      clues: '- A wet-point settlement is sited specifically for reliable access to water.',
      approach: '- Note the settlement\'s position directly on/near the river in the sketch.',
      solution: '1. The settlement is sited right on the river, giving it reliable water access.\n2. Answer: Y (wet-point)',
    },
    {
      number: '1.1.7',
      marks: 1,
      clues: '- A linear settlement shape is strung out in a line, usually following a route or river.',
      approach: '- Note how the settlement symbols in the sketch are arranged relative to the river.',
      solution: '1. The settlement symbols are strung out in a line following the river.\n2. Answer: Y (linear)',
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
