#!/usr/bin/env node
/**
 * DBE Geography P2 — November 2025 — Question 1.4 (order 4)
 * Urban structure and land-use zones: why zoning happens, comparative city-structure
 * models (Western/South African/Third World), heavy industry siting, why incompatible
 * zones are kept apart.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-geography-2025-nov-p2-q1-4.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-geography-2025-nov-p2-q1-4.js --dry-run
 *   node scripts/add-geography-2025-nov-p2-q1-4.js
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
  name: 'Question 1.4',
  syllabus: 'dbe',
  subject: 'geography',
  year: 2025,
  paper: 'nov_p2',
  order: 4,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['urban_structure', 'land_use_zones'],
  question_image_urls: [`${IMG}/q4/question_1.png`, `${IMG}/q4/question_2.png`],
  memo_image_urls: [`${IMG}/q4/memo_1.png`, `${IMG}/q4/memo_2.png`],
  exam_question_marks: 13,
  supplementary_materials: [],
};

// ─── Phase 3 — practice questions (DESIGN-UNI-08: relational framing) ────────

const questions = [
  {
    name: 'Question 1',
    question: "Why does a city's land use typically form distinct zones (e.g. a CBD, residential areas, industrial areas) instead of a random mix of activities spread evenly across the city?",
    metadata: [
      'Similar land uses cluster together because they benefit from being near each other and can afford similar land values',
      'City planners assign zones randomly to keep the city visually interesting',
      'Every city is required to have exactly five zones by law',
      'Zones form purely by chance, with no economic or spatial explanation',
      '',
    ],
    answer: ['Similar land uses cluster together because they benefit from being near each other and can afford similar land values', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'rural_urban_settlement',
    topic: 'urban_structure_and_patterns',
    subtopic: 'land_use_zones_and_models',
    skills: ['urban_structure_rationale'],
    difficulty: 3,
    exam_weight: 1,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Land-use zones form for economic reasons: similar activities often need similar land values, access, or benefit from being near related businesses.\n- This is a spatial and economic pattern, not an arbitrary or legal rule.',
  },
  {
    name: 'Question 2',
    question: 'Match each urban structure model to its defining characteristic.',
    metadata: [
      'A - Western (American) city model',
      'B - South African city model',
      'C - Third World city model',
      '1 - High-income residential areas are typically found on the outskirts, away from the polluted CBD',
      '2 - Apartheid-era planning pushed low-income residential areas furthest from the CBD, not high-income ones',
      '3 - Informal settlements often ring the city on the periphery, alongside pockets of formal high-income housing nearer the centre',
    ],
    answer: ['A-1', 'B-2', 'C-3'],
    presentation: 'match',
    type: 'application',
    unit: 'rural_urban_settlement',
    topic: 'urban_structure_and_patterns',
    subtopic: 'land_use_zones_and_models',
    skills: ['urban_structure_models'],
    difficulty: 3,
    exam_weight: 1,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p2',
    clues: '- The South African city model is shaped by apartheid-era spatial planning, which placed low-income groups furthest from economic opportunity.\n- The Third World city model often shows a mix of formal and informal housing rather than one consistent income pattern by distance.',
  },
  {
    name: 'Question 3',
    question: 'A factory produces large amounts of noise, smoke and heavy machinery vibration, and needs large trucks to transport bulky raw materials in and finished goods out. Where in a city would this type of industry most likely be located, and why?',
    metadata: [
      'In the CBD, for easy access to office-based customers',
      'On the outskirts of the city, where there is space, room for transport access, and less impact on residents',
      'In a high-income residential zone, to be close to skilled workers',
      'In the transition zone, to be close to the CBD',
      '',
    ],
    answer: ['On the outskirts of the city, where there is space, room for transport access, and less impact on residents', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'rural_urban_settlement',
    topic: 'urban_structure_and_patterns',
    subtopic: 'land_use_zones_and_models',
    skills: ['industrial_zone_siting'],
    difficulty: 3,
    exam_weight: 1,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p2',
    clues: "- Heavy industry needs cheap, available land, room for large vehicles, and distance from people affected by its noise/pollution.\n- All of these point away from the crowded, expensive city centre.",
  },
  {
    name: 'Question 4',
    question: 'Select the reasons a city planner would deliberately keep a high-income residential zone far away from a heavy industrial zone.',
    metadata: [
      'To protect residents from pollution, noise and related health risks',
      'To preserve property values and the aesthetic appeal of the residential area',
      'To make residents commute further to work each day',
      'To reduce traffic congestion caused by industrial trucks passing through residential streets',
      '',
    ],
    answer: [
      'To protect residents from pollution, noise and related health risks',
      'To preserve property values and the aesthetic appeal of the residential area',
      'To reduce traffic congestion caused by industrial trucks passing through residential streets',
      '',
      '',
    ],
    presentation: 'multi_select',
    type: 'application',
    unit: 'rural_urban_settlement',
    topic: 'urban_structure_and_patterns',
    subtopic: 'land_use_zones_and_models',
    skills: ['land_use_zone_relationships'],
    difficulty: 2,
    exam_weight: 1,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p2',
    clues: "- Separation protects residents' health, property values, and reduces incompatible traffic — it isn't done to inconvenience anyone.\n- A longer commute is a side-effect some residents face, not the planning goal itself.",
  },
];

// ─── AI explanation (AMPM-CONTENT-AI-EXP) — one entry per exam sub-question ───

const aiExplanation = {
  sub_questions: [
    {
      number: '1.4.1',
      marks: 2,
      clues: '- This is asking for the general concept, not an example of one.',
      approach: '- Recall the definition of an urban land-use zone as a concept.',
      solution: '1. An urban land-use zone is land that has been zoned/set aside for a specific function within an urban settlement.\n2. Answer: land zoned for a specific function in an urban settlement',
    },
    {
      number: '1.4.2',
      marks: 2,
      clues: '- Commercial functions (shops, offices, trade) are most concentrated where footfall and accessibility are highest.',
      approach: '- Identify which zones in the urban profile are associated with commerce/trade.',
      solution: '1. The CBD is the primary commercial centre of a city.\n2. The transition zone also often contains commercial activity as it borders the CBD.\n3. Answer: any two of CBD, transition zone, residential zone, rural-urban fringe',
    },
    {
      number: '1.4.3',
      marks: 3,
      clues: '- (a) Look for visual evidence of wealth: plot size, building density, greenery, security.\n- (b) Smoke, large silos and heavy machinery indicate a heavy, not light, industry.',
      approach: '- (a) Identify visual cues of a high-income area in the photograph/profile.\n- (b) Classify the industry type from the scale and nature of the visible infrastructure.',
      solution: "1. (a) B2 is close to the rural-urban fringe, has large plots, low building density, and is away from the industrial zone — any two accepted.\n2. (b) The large-scale plant with smoke stacks and heavy machinery indicates heavy industry.\n3. Answer: (a) any two visual indicators of wealth/space; (b) heavy industry",
    },
    {
      number: '1.4.4',
      marks: 4,
      clues: '- Think about cost of land, transport access, and pollution management for heavy industry.',
      approach: "- Link heavy industry's specific needs (cheap land, transport, distance from people) to why the urban outskirts suit it economically.",
      solution: '1. Land is cheaper on the outskirts than near the CBD.\n2. It is closer to bulk transport routes and raw materials, reducing transport costs.\n3. It is less expensive to manage pollution away from dense populations.\n4. Any two well-explained economic reasons are accepted.',
    },
    {
      number: '1.4.5',
      marks: 4,
      clues: '- Consider both the negative effect on B2 if it were near A, and the benefit of keeping them apart.',
      approach: '- Explain the incompatibility between a high-income residential zone and a heavy industrial zone.',
      solution: '1. The two land uses are incompatible — industrial pollution and noise would harm the residential area.\n2. Keeping them apart preserves property values and the aesthetic appeal of the residential zone.\n3. It also reduces health risks and traffic congestion from industrial activity.\n4. Any two well-explained reasons are accepted.',
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
