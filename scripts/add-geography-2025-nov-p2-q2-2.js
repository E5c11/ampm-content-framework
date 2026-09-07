#!/usr/bin/env node
/**
 * DBE Geography P2 — November 2025 — Question 2.2 (order 7)
 * Structure of the economy: sector value chain (primary/secondary/tertiary), GDP
 * contribution calculation, balance of trade, international trade factors.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-geography-2025-nov-p2-q2-2.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-geography-2025-nov-p2-q2-2.js --dry-run
 *   node scripts/add-geography-2025-nov-p2-q2-2.js
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
  name: 'Question 2.2',
  syllabus: 'dbe',
  subject: 'geography',
  year: 2025,
  paper: 'nov_p2',
  order: 7,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['economic_sectors'],
  question_image_urls: [`${IMG}/q7/question_1.png`],
  memo_image_urls: [`${IMG}/q7/memo_1.png`],
  exam_question_marks: 7,
  supplementary_materials: [],
};

const questions = [
  {
    name: 'Question 1',
    question: 'Match each economic sector to an example activity within it, following the value chain from raw material to consumer.',
    metadata: [
      'A - Primary sector',
      'B - Secondary sector',
      'C - Tertiary sector',
      '1 - Mining raw diamonds from the ground',
      '2 - Cutting and polishing the diamonds into jewellery in a factory',
      '3 - Selling the finished jewellery in a retail store',
    ],
    answer: ['A-1', 'B-2', 'C-3'],
    presentation: 'match',
    type: 'application',
    unit: 'economic_geography_sa',
    topic: 'structure_of_economy',
    subtopic: 'economic_sector_classification',
    skills: ['economic_sector_value_chain'],
    difficulty: 3,
    exam_weight: 1,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Primary sector extracts raw materials directly from nature.\n- Secondary sector transforms raw materials into products; tertiary sector sells or provides services around the finished product.',
  },
  {
    name: 'Question 2',
    question: "A country's GDP contributions are: Agriculture 5%, Mining 12%, Manufacturing 20%, Finance 35%, Trade 28%. What percentage do primary sector activities contribute in total?",
    metadata: ['12%', '17%', '25%', '40%', ''],
    answer: ['17%', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'calc',
    unit: 'economic_geography_sa',
    topic: 'structure_of_economy',
    subtopic: 'economic_sector_classification',
    skills: ['gdp_contribution_calc'],
    difficulty: 2,
    exam_weight: 1,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Primary sector activities extract raw materials directly from nature.\n- Agriculture and mining are both primary — add their percentages together.',
  },
  {
    name: 'Question 3',
    question: 'A country imports goods worth R50 billion and exports goods worth R30 billion in a year. What does this indicate about its balance of trade, and what is one likely economic consequence?',
    metadata: [
      'A trade surplus, which strengthens the local currency',
      'A trade deficit, which can weaken the local currency',
      'A balanced trade position with no economic consequence',
      'A trade surplus, which has no effect on the currency',
      '',
    ],
    answer: ['A trade deficit, which can weaken the local currency', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'economic_geography_sa',
    topic: 'structure_of_economy',
    subtopic: 'economic_sector_classification',
    skills: ['balance_of_trade'],
    difficulty: 3,
    exam_weight: 1,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Imports exceeding exports means more money is leaving the country than coming in — a deficit, not a surplus.\n- A trade deficit generally puts downward pressure on the local currency.',
  },
  {
    name: 'Question 4',
    question: 'Select the factors that would make it easier for a country to compete in international trade.',
    metadata: [
      'Well-developed transport infrastructure (ports, rail, roads)',
      'Low trade tariffs imposed by partner countries',
      'High import tariffs placed on its own exports by other countries',
      'Ongoing political instability',
      '',
    ],
    answer: ['Well-developed transport infrastructure (ports, rail, roads)', 'Low trade tariffs imposed by partner countries', '', '', ''],
    presentation: 'multi_select',
    type: 'application',
    unit: 'economic_geography_sa',
    topic: 'structure_of_economy',
    subtopic: 'economic_sector_classification',
    skills: ['international_trade_factors'],
    difficulty: 2,
    exam_weight: 1,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Good infrastructure and low tariffs make trade cheaper and easier.\n- High tariffs and instability are barriers to trade, not advantages.',
  },
];

const aiExplanation = {
  sub_questions: [
    {
      number: '2.2.1',
      marks: 1,
      clues: '- Secondary sector activities process/manufacture raw materials into products.',
      approach: '- Identify which activity in the table involves manufacturing.',
      solution: '1. Manufacturing transforms raw materials into finished products — a secondary activity.\n2. Answer: Z (Manufacturing)',
    },
    {
      number: '2.2.2',
      marks: 1,
      clues: '- Primary activities extract raw materials directly from nature.',
      approach: '- Identify the primary activities in the table (agriculture, mining) and add their percentages.',
      solution: '1. Agriculture (2,9%) + Mining (8,4%) = 11,3%.\n2. Answer: Z (11,3%)',
    },
    {
      number: '2.2.3',
      marks: 1,
      clues: '- Tertiary activities provide services rather than producing or extracting goods.',
      approach: '- Identify which activity in the table is a service and has the largest percentage.',
      solution: '1. Finance and real estate (31,7%) is a service (tertiary) activity and the largest contributor.\n2. Answer: Y (Finance and real estate)',
    },
    {
      number: '2.2.4',
      marks: 1,
      clues: '- Compare the total contributions of each sector across the whole table.',
      approach: '- Group the activities by sector and identify which sector has the highest combined contribution.',
      solution: '1. Tertiary activities (transport, government services, trade, finance) sum to the largest share of GDP.\n2. Answer: Z (tertiary)',
    },
    {
      number: '2.2.5',
      marks: 1,
      clues: '- The sketch shows imports and exports being weighed against each other.',
      approach: '- Identify what a scale comparing imports and exports represents.',
      solution: '1. Comparing imports and exports is the balance of trade.\n2. Answer: Y (balance of trade)',
    },
    {
      number: '2.2.6',
      marks: 1,
      clues: '- Good infrastructure makes it easier and cheaper to trade internationally.',
      approach: '- Identify which factor supports, rather than restricts, international trade.',
      solution: '1. Well-developed infrastructure supports efficient trade.\n2. Answer: Z (well-developed infrastructure)',
    },
    {
      number: '2.2.7',
      marks: 1,
      clues: '- An economic benefit should help the country, not harm local industry.',
      approach: '- Identify which option is a positive outcome of international trade.',
      solution: '1. Access to foreign currencies is a direct economic benefit of international trade.\n2. Answer: Y (Access to foreign currencies)',
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
