#!/usr/bin/env node
/**
 * DBE Geography P2 — November 2024 — Question 2.3 — Coal Mining in South Africa (order 8)
 * Coal mining: reading export and employment data, why mine employment falls, what declining high-quality reserves mean for power supply, and why coal matters to the economy.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-geography-2024-nov-p2-q2-3.js --curriculum temp/curriculum-vocab-geography-p2-2024.json
 *   node scripts/add-geography-2024-nov-p2-q2-3.js --dry-run
 *   node scripts/add-geography-2024-nov-p2-q2-3.js
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
  name: 'Question 2.3',
  syllabus: 'dbe',
  subject: 'geography',
  year: 2024,
  paper: 'nov_p2',
  order: 8,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['mining', 'energy_supply'],
  question_image_urls: [
    `${IMG}/q8/question_1.png`,
  ],
  memo_image_urls: [
    `${IMG}/q8/memo_1.png`,
    `${IMG}/q8/memo_2.png`,
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
    question: "A coal company's export earnings were R74 billion in 2018, R79 billion in 2019, R66 billion in 2020, R71 billion in 2021 and R158 billion in 2022. By how much did earnings increase from 2021 to 2022?",
    metadata: ['Increase = R', '[ ]', ' billion'],
    answer: ['87', '', '', '', ''],
    presentation: 'fitb',
    type: 'interpretation',
    unit: 'economic_geography_sa',
    topic: 'mining',
    subtopic: 'mining_contribution_and_decline',
    skills: ['data_trend_interpretation'],
    difficulty: 1,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p2',
    keyboard_type: 'standard_math',
    clues: '- Find the two values for the years named in the question.\n- Subtract the earlier value from the later one.',
  },
  {
    name: 'Question 2',
    question: 'Coal-mine employment was 77 400 in 2015, 80 100 in 2017, 82 900 in 2019, 79 300 in 2020 and 74 600 in 2021. Which statement best describes the trend?',
    metadata: [
      'Employment rose steadily every year from 2015 to 2021',
      'Employment fell every year from 2015 to 2021',
      'Employment stayed about the same throughout',
      'Employment rose to a peak in 2019, then fell',
      '',
    ],
    answer: ['Employment rose to a peak in 2019, then fell', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'interpretation',
    unit: 'economic_geography_sa',
    topic: 'mining',
    subtopic: 'mining_contribution_and_decline',
    skills: ['data_trend_interpretation'],
    difficulty: 1,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p2',
    clues: '- Find the highest value first.\n- Then compare the values before it and after it.',
  },
  {
    name: 'Question 3',
    question: 'Select ALL the reasons why the number of people employed in coal mining is falling.',
    metadata: [
      'Machines are replacing workers underground',
      'World coal prices keep rising',
      'Shallow, high-quality seams are being used up',
      'New coal seams are being found near the surface',
      'Power producers are switching to renewable energy',
    ],
    answer: [
      'Machines are replacing workers underground',
      'Shallow, high-quality seams are being used up',
      'Power producers are switching to renewable energy',
      '',
      '',
    ],
    presentation: 'multi_select',
    type: 'application',
    unit: 'economic_geography_sa',
    topic: 'mining',
    subtopic: 'mining_contribution_and_decline',
    skills: ['mining_decline_factors'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p2',
    clues: '- Think about technology, the resource itself and demand for coal.\n- Reject anything that would encourage mines to hire more people.',
  },
  {
    name: 'Question 4',
    question: "Select ALL the likely effects of shrinking high-quality coal reserves on South Africa's future electricity supply.",
    metadata: [
      'Electricity becomes cheaper because less coal is mined',
      'Power stations burn lower-grade coal and break down more often',
      'Electricity prices rise',
      'Coal exports increase to fill the gap',
      'Load-shedding increases as demand exceeds supply',
    ],
    answer: [
      'Power stations burn lower-grade coal and break down more often',
      'Electricity prices rise',
      'Load-shedding increases as demand exceeds supply',
      '',
      '',
    ],
    presentation: 'multi_select',
    type: 'application',
    unit: 'economic_geography_sa',
    topic: 'mining',
    subtopic: 'mining_contribution_and_decline',
    skills: ['energy_supply_impacts'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p2',
    clues: "- Most of South Africa's electricity comes from coal-fired power stations.\n- Think about the quality, cost and quantity of the coal they can get.",
  },
  {
    name: 'Question 5',
    question: 'Match each contribution of coal mining to the way it benefits the economy.',
    metadata: [
      'A - Jobs on the mines',
      'B - Coal exports',
      'C - Coal used to make synthetic fuel',
      'D - Mining taxes and royalties',
      '1 - Provides a raw material for another industry',
      '2 - Raises government revenue for services',
      "3 - Workers' wages raise buying power in mining towns",
      '4 - Earns foreign exchange',
    ],
    answer: ['A-3', 'B-4', 'C-1', 'D-2'],
    presentation: 'match',
    type: 'application',
    unit: 'economic_geography_sa',
    topic: 'mining',
    subtopic: 'mining_contribution_and_decline',
    skills: ['mining_economic_contribution'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 5,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p2',
    clues: '- Ask who receives the money or the product in each case.',
  },
];

// ─── AI explanation (generated in the session, AMPM-CONTENT-AI-EXP) ──────────

const aiExplanation = {
  sub_questions: [
    {
      number: '2.3.1',
      marks: 1,
      clues: '- Use the right-hand axis, which is in billions of rands.',
      approach: '- Find 2023 on the horizontal axis.\n- Read the export line against the right-hand scale.',
      solution: '1. The export line reaches the top of the right-hand scale in 2023.\n2. The value is R250 billion.',
    },
    {
      number: '2.3.2',
      marks: 1,
      clues: '- Look at the export line over the last few years.',
      approach: '- Follow the line from about 2021 to 2023.\n- Describe its direction in one word.',
      solution: '1. The export line climbs sharply after 2021.\n2. The trend is upward (increasing).',
    },
    {
      number: '2.3.3',
      marks: 1,
      clues: '- Find the lowest point on the employment line.',
      approach: '- Trace the employee line.\n- Identify the two years either side of its lowest point.',
      solution: '1. The employment line drops to its lowest point after 2021.\n2. The smallest number of employees was recorded between 2021 and 2022.',
    },
    {
      number: '2.3.4',
      marks: 2,
      clues: '- Think about what was happening in the economy and the industry around 2021.',
      approach: '- Consider changes to the coal resource.\n- Consider economic or health events, and technology.\n- Give one full reason.',
      solution: '1. Possible reasons include the depletion of coal and an economic recession.\n2. Illness or pandemics (COVID-19), strikes, mechanisation, mine accidents and load-shedding also reduced employment.\n3. Lower demand as cleaner energy sources are used is also accepted; any one reason earns two marks.',
    },
    {
      number: '2.3.5',
      marks: 4,
      clues: "- Most of South Africa's electricity is generated from coal.",
      approach: '- Think about what power stations must do when good coal runs out.\n- Think about supply, demand and cost.\n- Explain two impacts.',
      solution: '1. Supply falls short of demand, so load-shedding becomes more frequent.\n2. Lower-quality coal must be used, causing shutdowns and more maintenance at power stations.\n3. Electricity costs rise, and money must be invested in alternative energy sources.\n4. Any two explained impacts earn the four marks.',
    },
    {
      number: '2.3.6',
      marks: 6,
      clues: '- The memo uses fact plus qualification: state a contribution, then its effect on the economy.',
      approach: '- Think about jobs, exports and taxes.\n- Think about coal as a source of power and as a raw material.\n- Give three explained points.',
      solution: '1. Coal mining creates jobs, which increases buying power and reduces dependence on government.\n2. Coal exports earn foreign exchange, and taxes and GDP contributions stimulate the economy.\n3. Coal is the main source of power for all sectors, and a raw material for other products.\n4. The multiplier effect and new infrastructure benefit other industries.\n5. Three points with qualifications earn the six marks.',
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
