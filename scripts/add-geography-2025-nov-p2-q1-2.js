#!/usr/bin/env node
/**
 * DBE Geography P2 — November 2025 — Question 1.2 (order 2)
 * Urban settlement concepts and classification: settlement function (break-of-bulk
 * point, specialised, gateway, junction), central place / urban hierarchy (range,
 * threshold population, sphere of influence), urban sprawl/expansion, urbanisation.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-geography-2025-nov-p2-q1-2.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-geography-2025-nov-p2-q1-2.js --dry-run
 *   node scripts/add-geography-2025-nov-p2-q1-2.js
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
  name: 'Question 1.2',
  syllabus: 'dbe',
  subject: 'geography',
  year: 2025,
  paper: 'nov_p2',
  order: 2,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['urban_hierarchy', 'urban_function', 'urbanisation'],
  question_image_urls: [`${IMG}/q2/question_1.png`, `${IMG}/q2/question_2.png`, `${IMG}/q2/question_3.png`],
  memo_image_urls: [`${IMG}/q2/memo_1.png`],
  exam_question_marks: 8,
  supplementary_materials: [],
};

// ─── Phase 3 — practice questions (DESIGN-UNI-08: relational framing) ────────

const questions = [
  {
    name: 'Question 1',
    question: 'Match each urban settlement to what it must gain to reach the next level of the urban hierarchy.',
    metadata: [
      'A - Town',
      'B - City',
      'C - Metropolis',
      '1 - A larger threshold population and a wider range of higher-order goods and services',
      '2 - An even larger population and sphere of influence',
      "3 - Merging with a neighbouring metropolis as their built-up areas join together",
    ],
    answer: ['A-1', 'B-2', 'C-3'],
    presentation: 'match',
    type: 'application',
    unit: 'rural_urban_settlement',
    topic: 'settlement_classification',
    subtopic: 'urban_hierarchy_and_function',
    skills: ['urban_hierarchy_progression'],
    difficulty: 3,
    exam_weight: 1,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p2',
    clues: '- The urban hierarchy runs town → city → metropolis → conurbation, each level gaining more threshold population, range, and sphere of influence than the last.\n- A conurbation forms specifically when two metropolises grow into each other.',
  },
  {
    name: 'Question 2',
    question: "A settlement's main economic role is transferring goods from one mode of transport to another, such as from rail to ship at a harbour. If it later also begins processing raw materials into finished goods before shipping them, which additional function has it gained?",
    metadata: ['break-of-bulk point', 'specialised (manufacturing)', 'central place', 'gateway', ''],
    answer: ['specialised (manufacturing)', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'rural_urban_settlement',
    topic: 'settlement_classification',
    subtopic: 'urban_hierarchy_and_function',
    skills: ['urban_settlement_function_types'],
    difficulty: 3,
    exam_weight: 1,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p2',
    clues: "- Break-of-bulk point describes the settlement's original transport-transfer role — that hasn't gone away, but something new has been added.\n- Processing raw materials into finished goods is a manufacturing activity, which defines a specialised settlement.",
  },
  {
    name: 'Question 3',
    question: "As a country's rate of urbanisation increases and more people move into a city, which physical change to the city's built-up area is the direct result?",
    metadata: ['counter-urbanisation', 'urban sprawl', 'rural depopulation', 'urban renewal', ''],
    answer: ['urban sprawl', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'rural_urban_settlement',
    topic: 'settlement_classification',
    subtopic: 'urban_hierarchy_and_function',
    skills: ['urbanisation_and_sprawl'],
    difficulty: 3,
    exam_weight: 1,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Urbanisation is the population-level process; urban sprawl is its physical, spatial consequence on the ground.\n- Counter-urbanisation and rural depopulation move population the opposite direction; urban renewal is a planning response, not a growth-driven outcome.',
  },
  {
    name: 'Question 4',
    question: "A country's level of urbanisation (%) increases at a constant rate each year: 2018 = 55,2, 2019 = 56,0, 2020 = ___, 2021 = 57,6, 2022 = 58,4. What is the missing 2020 value?",
    metadata: ['Level of urbanisation (%) in 2020 = ', '[ ]'],
    answer: ['56,8', '', '', '', ''],
    presentation: 'fitb',
    type: 'calc',
    unit: 'rural_urban_settlement',
    topic: 'settlement_classification',
    subtopic: 'urban_hierarchy_and_function',
    skills: ['data_trend_interpretation'],
    difficulty: 2,
    exam_weight: 1,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Find the constant yearly increase from the known consecutive years first.\n- 2019 to 2021 spans two years — the 2020 value sits exactly halfway between them.',
  },
];

// ─── AI explanation (AMPM-CONTENT-AI-EXP) — one entry per exam sub-question ───

const aiExplanation = {
  sub_questions: [
    {
      number: '1.2.1',
      marks: 1,
      clues: '- The photograph shows a harbour with cranes and ships alongside a city — goods are being transferred between sea and land transport.',
      approach: '- Identify the transport infrastructure in the photograph (harbour, cranes, ships) and what function it serves.',
      solution: '1. The harbour is where cargo is transferred from ship to rail/road transport — a break-of-bulk point.\n2. Answer: C (break-of-bulk-point)',
    },
    {
      number: '1.2.2',
      marks: 1,
      clues: '- The photograph shows a beach resort with a hotel and holidaymakers — a tourism-based economy.\n- "Specialised" describes a town whose economy focuses on one dominant activity.',
      approach: '- Identify the dominant activity in the photograph (tourism) and match it to the correct settlement classification (specialised).',
      solution: '1. Plettenberg Bay is a beach/hotel resort town — its dominant economic function is tourism.\n2. A settlement built around one dominant activity is classified as specialised.\n3. Answer: C ((ii) specialised and (iii) tourism)',
    },
    {
      number: '1.2.3',
      marks: 1,
      clues: '- Low-order goods/services (e.g. a small shop) are bought frequently and don\'t require travelling far — this is the smallest central place in the hierarchy.',
      approach: '- Compare "mostly low-order goods and services to a surrounding rural population" against city, metropolis, conurbation and town.',
      solution: '1. A settlement providing mostly low-order goods/services to a surrounding rural area is the smallest central place in the hierarchy.\n2. Answer: D (town)',
    },
    {
      number: '1.2.4',
      marks: 1,
      clues: '- Range is about distance travelled by the customer; threshold population is about how many customers a business needs to survive.',
      approach: '- Match "the maximum distance people will travel to buy goods or obtain services" to the correct central place theory term.',
      solution: '1. This definition describes RANGE — the maximum distance a consumer will travel for a good or service.\n2. Answer: B (Range)',
    },
    {
      number: '1.2.5',
      marks: 1,
      clues: '- "Uncontrolled" is the key word — this distinguishes sprawl from planned urban growth.',
      approach: '- Match "uncontrolled growth of urban areas" to the correct urban growth term.',
      solution: '1. Uncontrolled, unplanned outward growth of a city is urban sprawl.\n2. Answer: C (Urban sprawl)',
    },
    {
      number: '1.2.6',
      marks: 1,
      clues: '- The cartoon shows city buildings toppling forward into the green/tree-covered land beside them.',
      approach: '- Read what the cartoon depicts: buildings physically advancing into surrounding natural land.',
      solution: '1. The cartoon shows built-up areas expanding outward into surrounding natural/green land.\n2. Answer: D (urban expansion)',
    },
    {
      number: '1.2.7',
      marks: 1,
      clues: '- This describes a national population-level shift, not the physical growth of one city.',
      approach: '- Match "an increasing percentage of a country\'s population lives in urban rather than rural areas" to the correct term.',
      solution: '1. This is the definition of urbanisation — the process itself, not its physical/spatial effect.\n2. Answer: A (Urbanisation)',
    },
    {
      number: '1.2.8',
      marks: 1,
      clues: '- The missing 2022 level sits between 2021 (67,85) and 2023 (68,82).\n- The missing 2024 rate continues the yearly decline already visible from 2020-2023 (0,49 → 0,48 → …).',
      approach: '- Interpolate the missing 2022 level as roughly the midpoint of the surrounding known years.\n- Continue the declining pattern in the rate column to estimate 2024.',
      solution: '1. 2022 level ≈ midpoint of 67,85 (2021) and 68,82 (2023) ≈ 68,34.\n2. The rate is declining by roughly 0,01-0,02 per year (0,55 → 0,50 → 0,49 → 0,48 → …), giving ≈ 0,47 for 2024.\n3. Answer: A (i) 68,34 and (iv) 0,47',
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
