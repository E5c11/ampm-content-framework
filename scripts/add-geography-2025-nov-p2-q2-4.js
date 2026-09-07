#!/usr/bin/env node
/**
 * DBE Geography P2 — November 2025 — Question 2.4 (order 9)
 * Strategies for industrial development: IDZ concept and location rationale, industrial
 * location factors, diversification benefits, multiplier effect.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-geography-2025-nov-p2-q2-4.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-geography-2025-nov-p2-q2-4.js --dry-run
 *   node scripts/add-geography-2025-nov-p2-q2-4.js
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
  name: 'Question 2.4',
  syllabus: 'dbe',
  subject: 'geography',
  year: 2025,
  paper: 'nov_p2',
  order: 9,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['industrial_development'],
  question_image_urls: [`${IMG}/q9/question_1.png`, `${IMG}/q9/question_2.png`],
  memo_image_urls: [`${IMG}/q9/memo_1.png`],
  exam_question_marks: 15,
  supplementary_materials: [],
};

const questions = [
  {
    name: 'Question 1',
    question: 'A government designates a coastal zone with tax incentives and infrastructure support specifically to attract manufacturing and export-focused businesses. What is this type of zone called, and why does its coastal location matter?',
    metadata: [
      'A Spatial Development Initiative — coastal location has no real advantage for exporters',
      'An Industrial Development Zone (IDZ) — harbour access lowers transport costs for imported raw materials and exported finished goods',
      'A rural-urban fringe — it keeps industry away from residential areas',
      'A central business district — it maximises access to office workers',
      '',
    ],
    answer: ['An Industrial Development Zone (IDZ) — harbour access lowers transport costs for imported raw materials and exported finished goods', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'economic_geography_sa',
    topic: 'industrial_development_strategies',
    subtopic: 'idz_and_industrial_location',
    skills: ['idz_concept'],
    difficulty: 3,
    exam_weight: 1,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Tax incentives plus infrastructure support to attract export manufacturing is the defining feature of an IDZ.\n- Coastal/harbour access is valuable specifically because it cuts shipping costs for import/export-heavy industries.',
  },
  {
    name: 'Question 2',
    question: 'Match each location factor to the benefit it gives an export-focused industry.',
    metadata: [
      'A - Proximity to a harbour',
      'B - Proximity to an international airport',
      'C - A large pool of available labour nearby',
      '1 - Lower transport costs for shipping imports and exports',
      '2 - Faster delivery of high-value or time-sensitive goods',
      '3 - Lower labour recruitment costs',
    ],
    answer: ['A-1', 'B-2', 'C-3'],
    presentation: 'match',
    type: 'application',
    unit: 'economic_geography_sa',
    topic: 'industrial_development_strategies',
    subtopic: 'idz_and_industrial_location',
    skills: ['industrial_location_factors'],
    difficulty: 3,
    exam_weight: 1,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Bulk goods move cheapest by sea; urgent/high-value goods move fastest by air.\n- A larger local labour pool means less need to pay to relocate or import workers.',
  },
  {
    name: 'Question 3',
    question: 'An industrial zone hosts several different types of manufacturing (electronics, food processing, vehicle assembly) instead of just one. What economic benefit does this variety give the surrounding region?',
    metadata: [
      'It reduces the region\'s dependence on any single industry, so a downturn in one sector does not collapse the local economy',
      'It guarantees the region will never experience any unemployment',
      'It has no real economic benefit beyond looking impressive',
      'It forces all industries to compete for the exact same customers',
      '',
    ],
    answer: ["It reduces the region's dependence on any single industry, so a downturn in one sector does not collapse the local economy", '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'economic_geography_sa',
    topic: 'industrial_development_strategies',
    subtopic: 'idz_and_industrial_location',
    skills: ['industrial_diversification_benefits'],
    difficulty: 3,
    exam_weight: 1,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p2',
    clues: "- Relying on one industry means the whole region suffers if that industry declines.\n- Diversification spreads that risk across several unrelated industries.",
  },
  {
    name: 'Question 4',
    question: 'Select the outcomes that would result from new manufacturing investment creating jobs in a region.',
    metadata: [
      'Workers have more money to spend in local businesses (multiplier effect)',
      'Local municipal tax revenue increases',
      "The region's unemployment rate is completely unaffected",
      'All existing local businesses are forced to close immediately',
      '',
    ],
    answer: ['Workers have more money to spend in local businesses (multiplier effect)', 'Local municipal tax revenue increases', '', '', ''],
    presentation: 'multi_select',
    type: 'application',
    unit: 'economic_geography_sa',
    topic: 'industrial_development_strategies',
    subtopic: 'idz_and_industrial_location',
    skills: ['multiplier_effect'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p2',
    clues: '- New jobs mean new local spending, which supports other local businesses (the multiplier effect).\n- More economic activity generally raises municipal tax revenue, not the opposite.',
  },
];

const aiExplanation = {
  sub_questions: [
    {
      number: '2.4.1',
      marks: 1,
      clues: '- Recall which South African province the Dube Trade Port is located in.',
      approach: '- Identify the province from the general knowledge of the Dube Trade Port location (Durban area).',
      solution: '1. Dube Trade Port is located near Durban, in KwaZulu-Natal.\n2. Answer: KwaZulu-Natal',
    },
    {
      number: '2.4.2',
      marks: 2,
      clues: '- Look for a direct quote listing multiple different industry types.',
      approach: '- Find the sentence in the extract that lists several different manufacturing sectors together.',
      solution: "1. The extract states the automotive industry \"would join the electronic, high-value manufacturing, food processing and fibre optics sectors.\"\n2. Answer: that quoted sentence",
    },
    {
      number: '2.4.3',
      marks: 2,
      clues: '- An IDZ is defined by the incentives/support it offers to attract investment.',
      approach: '- Identify what the extract says makes Dube Trade Port function as an IDZ.',
      solution: '1. It has direct links to the airport/harbour, attracts investment, and creates jobs.\n2. Answer: any one — e.g. direct transport links, investment attraction, job creation',
    },
    {
      number: '2.4.4',
      marks: 4,
      clues: "- Short distances to transport hubs reduce cost and time for import/export.",
      approach: '- Link the stated proximity (30 min/34 min) to concrete cost or access benefits.',
      solution: '1. Lower transport costs due to short distances to the airport and harbour.\n2. Easier access to international markets for exporting finished vehicles.\n3. Any two well-explained benefits are accepted.',
    },
    {
      number: '2.4.5',
      marks: 6,
      clues: '- A variety of industries creates jobs, spreads economic risk, and attracts further investment.',
      approach: '- Explain the province-wide economic ripple effects of having several different manufacturing sectors in one zone.',
      solution: '1. Upskilling of workers creates a variety of employment opportunities.\n2. Higher income leads to greater buying power and the multiplier effect.\n3. Different industries attract further investors and improve infrastructure.\n4. Any three well-explained impacts are accepted.',
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
