#!/usr/bin/env node
/**
 * DBE Geography P2 — November 2025 — Question 2.5 (order 10)
 * Informal sector: concept application, causes of informal trader challenges,
 * formalisation benefits, use of permit revenue.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-geography-2025-nov-p2-q2-5.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-geography-2025-nov-p2-q2-5.js --dry-run
 *   node scripts/add-geography-2025-nov-p2-q2-5.js
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
  name: 'Question 2.5',
  syllabus: 'dbe',
  subject: 'geography',
  year: 2025,
  paper: 'nov_p2',
  order: 10,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['informal_sector'],
  question_image_urls: [`${IMG}/q10/question_1.png`, `${IMG}/q10/question_2.png`],
  memo_image_urls: [`${IMG}/q10/memo_1.png`, `${IMG}/q10/memo_2.png`],
  exam_question_marks: 15,
  supplementary_materials: [],
};

const questions = [
  {
    name: 'Question 1',
    question: 'A woman sells vegetables from a stall on the roadside. She has not registered her business and does not pay income tax on her earnings. Which economic sector does her business belong to?',
    metadata: ['The formal sector', 'The informal sector', 'The primary sector', 'The public sector', ''],
    answer: ['The informal sector', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'economic_geography_sa',
    topic: 'informal_sector',
    subtopic: 'informal_sector_characteristics_and_challenges',
    skills: ['informal_sector_concept'],
    difficulty: 2,
    exam_weight: 1,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p2',
    clues: '- The informal sector is defined by being unregistered and untaxed, not by the type of goods sold.\n- A roadside stall with no registration is a classic informal sector example.',
  },
  {
    name: 'Question 2',
    question: 'Match each informal trader challenge to what causes it.',
    metadata: [
      'A - Perishable goods spoiling before they can be sold',
      'B - Goods being stolen overnight',
      'C - Losing income during a municipal crackdown',
      '1 - No access to proper refrigeration or storage facilities',
      '2 - No secure premises to store stock overnight',
      '3 - Operating without a formal trading permit',
    ],
    answer: ['A-1', 'B-2', 'C-3'],
    presentation: 'match',
    type: 'application',
    unit: 'economic_geography_sa',
    topic: 'informal_sector',
    subtopic: 'informal_sector_characteristics_and_challenges',
    skills: ['informal_sector_challenges'],
    difficulty: 3,
    exam_weight: 1,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Each challenge traces back to a specific gap in facilities, security, or legal status.\n- Operating without a permit is what exposes a trader to fines during a crackdown.',
  },
  {
    name: 'Question 3',
    question: 'If a municipality begins issuing trading permits to informal traders instead of ignoring them, what is the most direct benefit to the municipality itself?',
    metadata: [
      'It loses the ability to monitor trading activity',
      'It gains a new source of revenue and can better regulate the sector',
      'It has no effect on municipal finances or planning',
      'It becomes legally required to close all informal trading',
      '',
    ],
    answer: ['It gains a new source of revenue and can better regulate the sector', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'economic_geography_sa',
    topic: 'informal_sector',
    subtopic: 'informal_sector_characteristics_and_challenges',
    skills: ['informal_sector_formalisation'],
    difficulty: 3,
    exam_weight: 1,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p2',
    clues: '- A permit system creates a fee/revenue stream that did not exist before.\n- It also gives the municipality a formal record of who is trading and where.',
  },
  {
    name: 'Question 4',
    question: 'Select the ways a municipality could use permit revenue to support informal traders.',
    metadata: [
      'Providing designated trading infrastructure or shelters',
      'Offering small-business skills training',
      'Banning informal trading entirely',
      'Redirecting all the funds to unrelated municipal departments',
      '',
    ],
    answer: ['Providing designated trading infrastructure or shelters', 'Offering small-business skills training', '', '', ''],
    presentation: 'multi_select',
    type: 'application',
    unit: 'economic_geography_sa',
    topic: 'informal_sector',
    subtopic: 'informal_sector_characteristics_and_challenges',
    skills: ['informal_sector_formalisation'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Support means investing the revenue back into the traders themselves.\n- Banning trading or spending the money elsewhere would not support informal traders at all.',
  },
];

const aiExplanation = {
  sub_questions: [
    {
      number: '2.5.1',
      marks: 2,
      clues: '- This asks for the general concept, not an example.',
      approach: '- Recall the definition of the informal sector.',
      solution: '1. The informal sector consists of businesses that are not registered and do not pay income tax.\n2. Answer: businesses that are not registered and do not pay income tax',
    },
    {
      number: '2.5.2',
      marks: 1,
      clues: '- Think about what a roadside location offers a trader.',
      approach: '- Identify why visibility/accessibility matters for an informal trader.',
      solution: '1. The main road location makes the trader more accessible to potential customers.\n2. Answer: more accessible to potential customers',
    },
    {
      number: '2.5.3',
      marks: 2,
      clues: '- Think about the specific type of goods (fruit/vegetables) and their vulnerabilities.',
      approach: '- Identify challenges specific to selling perishable goods without formal storage.',
      solution: '1. No proper storage means goods can rot, be stolen, or be damaged by pests/weather.\n2. Answer: any two — e.g. no storage facilities, goods rotting, theft, pests, weather damage',
    },
    {
      number: '2.5.4',
      marks: 2,
      clues: '- December is a holiday season with more shoppers and extra household income.',
      approach: '- Link the table\'s December peak to seasonal factors affecting shopper numbers.',
      solution: '1. The holiday season brings more shoppers, tourists, and people with extra income/bonuses.\n2. Answer: any one — e.g. holiday season increases shoppers, more tourists, extra festive income',
    },
    {
      number: '2.5.5',
      marks: 4,
      clues: '- A permit system gives the municipality both information and income.',
      approach: '- Identify direct benefits to the municipality from formalising informal trade.',
      solution: '1. Permits let the municipality regulate the sector and set up ideal trading locations.\n2. Permits increase municipal revenue and allow monitoring of quality/safety.\n3. Any two well-explained benefits are accepted.',
    },
    {
      number: '2.5.6',
      marks: 4,
      clues: '- Think about what would directly help traders operate more effectively and safely.',
      approach: '- Suggest concrete uses of permit revenue that support informal traders.',
      solution: '1. Designate proper trading areas and provide infrastructure/storage facilities.\n2. Provide effective policing and support/training programmes for traders.\n3. Any two well-explained suggestions are accepted.',
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
