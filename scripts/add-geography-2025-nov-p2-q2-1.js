#!/usr/bin/env node
/**
 * DBE Geography P2 — November 2025 — Question 2.1 (order 6)
 * Primary economic activities: agricultural factors (climatic, economic, social) and
 * mining contribution/decline factors.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-geography-2025-nov-p2-q2-1.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-geography-2025-nov-p2-q2-1.js --dry-run
 *   node scripts/add-geography-2025-nov-p2-q2-1.js
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
  name: 'Question 2.1',
  syllabus: 'dbe',
  subject: 'geography',
  year: 2025,
  paper: 'nov_p2',
  order: 6,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['agriculture', 'mining'],
  question_image_urls: [`${IMG}/q6/question_1.png`, `${IMG}/q6/question_2.png`],
  memo_image_urls: [`${IMG}/q6/memo_1.png`],
  exam_question_marks: 8,
  supplementary_materials: [],
};

const questions = [
  {
    name: 'Question 1',
    question: "A commercial crop needs high rainfall, warm temperatures and fertile soil to thrive. If the region's climate shifted to become significantly drier and cooler, what would be the most likely impact on that crop's production?",
    metadata: ['Production increases sharply', 'Yield declines significantly', 'No impact on production', 'The crop becomes cheaper to produce', ''],
    answer: ['Yield declines significantly', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'economic_geography_sa',
    topic: 'agriculture',
    subtopic: 'agricultural_factors_and_impact',
    skills: ['agricultural_climatic_factors'],
    difficulty: 2,
    exam_weight: 1,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p2',
    clues: "- The crop's needs (rain, warmth, fertile soil) are the opposite of what a drier, cooler climate provides.\n- Removing a crop's favourable conditions reduces its yield.",
  },
  {
    name: 'Question 2',
    question: 'Select the factors that would be classified as economic (rather than physical) factors affecting a commercial farming operation.',
    metadata: [
      "A farmer's access to capital/credit for expansion",
      'Fluctuating market prices for the crop',
      'The fertility of the soil',
      'The amount of annual rainfall the region receives',
      '',
    ],
    answer: ["A farmer's access to capital/credit for expansion", 'Fluctuating market prices for the crop', '', '', ''],
    presentation: 'multi_select',
    type: 'application',
    unit: 'economic_geography_sa',
    topic: 'agriculture',
    subtopic: 'agricultural_factors_and_impact',
    skills: ['economic_vs_physical_factors'],
    difficulty: 3,
    exam_weight: 1,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Economic factors relate to money, markets and finance — not the natural environment.\n- Soil fertility and rainfall are physical/natural factors, not economic ones.',
  },
  {
    name: 'Question 3',
    question: 'Match each factor to the type of challenge it poses for a mining industry.',
    metadata: [
      'A - Gold reserves running low in existing mines',
      'B - Falling international gold prices',
      'C - Workers going on strike over pay and conditions',
      '1 - A physical/natural constraint',
      '2 - An economic constraint',
      '3 - A labour/social constraint',
    ],
    answer: ['A-1', 'B-2', 'C-3'],
    presentation: 'match',
    type: 'application',
    unit: 'economic_geography_sa',
    topic: 'mining',
    subtopic: 'mining_contribution_and_decline',
    skills: ['mining_decline_factors'],
    difficulty: 3,
    exam_weight: 1,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p2',
    clues: '- A depleted resource is a physical constraint; a price drop is an economic one; industrial action is a labour/social one.\n- Each factor limits mining for a different underlying reason.',
  },
  {
    name: 'Question 4',
    question: "A country's platinum mine employment fell from 200 000 workers (2010) to 180 000 (2013) to 130 000 (2016) to 125 000 (2019). Between which two periods did employment decrease the most?",
    metadata: ['2010 to 2013', '2013 to 2016', '2016 to 2019', 'It decreased equally in every period', ''],
    answer: ['2013 to 2016', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'interpretation',
    unit: 'economic_geography_sa',
    topic: 'mining',
    subtopic: 'mining_contribution_and_decline',
    skills: ['data_trend_interpretation'],
    difficulty: 2,
    exam_weight: 1,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Calculate the actual drop in each period before comparing them.\n- 2010-2013: -20 000. 2013-2016: -50 000. 2016-2019: -5 000.',
  },
];

const aiExplanation = {
  sub_questions: [
    {
      number: '2.1.1',
      marks: 1,
      clues: '- A social factor relates to people/community wellbeing, not money or environment.',
      approach: '- Identify which option describes a benefit to people/community rather than the economy or environment.',
      solution: '1. Provision of employment directly benefits the local community — a social factor.\n2. Answer: B (Provision of employment)',
    },
    {
      number: '2.1.2',
      marks: 1,
      clues: '- An economic factor relates to money, finance or markets.',
      approach: '- Identify which option is about finance/money rather than environment or labour.',
      solution: '1. Lack of access to capital is a financial/economic constraint on farming.\n2. Answer: B (Lack of access to capital)',
    },
    {
      number: '2.1.3',
      marks: 1,
      clues: '- Look for options that describe a national economic benefit, not a negative outcome.',
      approach: '- Identify the two positive, economy-wide advantages from the list.',
      solution: '1. Contributing to GDP and developing infrastructure are both national economic advantages.\n2. Answer: C ((i) and (iii))',
    },
    {
      number: '2.1.4',
      marks: 1,
      clues: '- Sugar cane needs warmth and plentiful water to thrive.',
      approach: '- Identify the two climatic conditions that favour sugar cane growth.',
      solution: '1. High temperatures and high rainfall both favour sugar cane growth.\n2. Answer: C ((i) and (iii))',
    },
    {
      number: '2.1.5',
      marks: 1,
      clues: "- Recall which province is South Africa's main gold-producing region.",
      approach: '- Identify the province historically associated with the largest gold-mining industry.',
      solution: '1. Gauteng (the Witwatersrand) is the main gold-producing province.\n2. Answer: D (Gauteng)',
    },
    {
      number: '2.1.6',
      marks: 1,
      clues: '- Compare the steepness of the line between each pair of years on the graph.',
      approach: '- Read the graph and estimate the size of the drop across each period.',
      solution: '1. The graph shows the steepest decline occurring between 1995 and 2000.\n2. Answer: A (1995 and 2000)',
    },
    {
      number: '2.1.7',
      marks: 1,
      clues: '- A physical/natural factor relates to the resource itself, not the economy or people.',
      approach: '- Identify which option describes a natural resource constraint rather than an economic or social one.',
      solution: '1. Depletion of gold in mines is a natural resource constraint.\n2. Answer: B (depletion of gold in mines)',
    },
    {
      number: '2.1.8',
      marks: 1,
      clues: '- An economic factor from 2015 onwards relates to markets/prices, not disease or environment.',
      approach: '- Identify which option is a market/price-related economic factor.',
      solution: '1. Fluctuating gold prices directly affect mine profitability and staffing levels.\n2. Answer: B (fluctuating prices of gold)',
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
