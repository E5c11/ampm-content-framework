#!/usr/bin/env node
/**
 * DBE Geography P1 — November 2025 — Question 2.5 (order 10)
 * Catchment and river management: settlements and river pollution, evidence, flood risk, impact on river health, municipal strategies.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-geography-2025-nov-p1-q2-5.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-geography-2025-nov-p1-q2-5.js --dry-run
 *   node scripts/add-geography-2025-nov-p1-q2-5.js
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

const IMG = 'https://media-dev.askmoreprepmore.app/exam_papers/dbe/geography/2025/nov_p1';

const video = {
  name: 'Question 2.5',
  syllabus: 'dbe',
  subject: 'geography',
  year: 2025,
  paper: 'nov_p1',
  order: 10,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['catchment_management', 'river_pollution'],
  question_image_urls: [`${IMG}/q10/question_1.png`],
  memo_image_urls: [`${IMG}/q10/memo_1.png`, `${IMG}/q10/memo_2.png`],
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
    question: 'An extract states: \'The informal settlement beside the river receives no refuse collection, so residents dump their waste on the banks, from where it is washed into the river.\' According to the extract, what directly causes the pollution?',
    metadata: [
      'Heavy industry upstream releasing effluent',
      'A lack of refuse removal leads residents to dump waste near the river',
      'Fertiliser run-off from nearby farms',
      'A sewage works that overflowed after a storm',
      '',
    ],
    answer: ['A lack of refuse removal leads residents to dump waste near the river', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'interpretation',
    unit: 'geomorphology',
    topic: 'catchment_river_management',
    subtopic: 'river_pollution_and_management',
    skills: ['river_pollution_cause'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p1',
    clues: '- Use only what the extract says, not what could cause pollution in general.\n- Follow the chain from the missing service to the waste in the water.',
  },
  {
    name: 'Question 2',
    question: 'Select ALL negative impacts of poor river management on the health of a river.',
    metadata: [
      'Higher dissolved-oxygen levels that help fish',
      'Reduced water quality',
      'Loss of aquatic habitat and biodiversity',
      'Eutrophication caused by excess nutrients',
      'Increased sedimentation of the channel',
    ],
    answer: [
      'Reduced water quality',
      'Loss of aquatic habitat and biodiversity',
      'Eutrophication caused by excess nutrients',
      'Increased sedimentation of the channel',
      '',
    ],
    presentation: 'multi_select',
    type: 'application',
    unit: 'geomorphology',
    topic: 'catchment_river_management',
    subtopic: 'river_pollution_and_management',
    skills: ['river_health_impacts'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p1',
    clues: '- Think about what happens to water quality, living things, nutrients and the channel itself when a river is mismanaged.\n- One option describes an improvement, not a harm.',
  },
  {
    name: 'Question 3',
    question: 'A row of houses stands on a river\'s floodplain. After several days of heavy rain the water level rises. What is the greatest direct risk to the houses?',
    metadata: [
      'Slower river flow that drains the floodplain',
      'A falling water table that dries the soil around the houses',
      'Flooding of the homes and collapse of the undercut banks beneath them',
      'Reduced erosion of the banks',
      '',
    ],
    answer: ['Flooding of the homes and collapse of the undercut banks beneath them', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'geomorphology',
    topic: 'catchment_river_management',
    subtopic: 'river_pollution_and_management',
    skills: ['floodplain_settlement_risk'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p1',
    clues: '- Consider both the height of the water and what fast water does to the banks.\n- The houses are close to the river\'s edge.',
  },
  {
    name: 'Question 4',
    question: 'Select ALL strategies a municipality could use to keep a river sustainable.',
    metadata: [
      'Allow informal housing to expand right up to the water\'s edge',
      'Establish a buffer zone where building is not allowed beside the river',
      'Run awareness campaigns on waste disposal',
      'Provide regular refuse removal and sanitation',
      'Stop monitoring water quality to save money',
    ],
    answer: [
      'Establish a buffer zone where building is not allowed beside the river',
      'Run awareness campaigns on waste disposal',
      'Provide regular refuse removal and sanitation',
      '',
      '',
    ],
    presentation: 'multi_select',
    type: 'application',
    unit: 'geomorphology',
    topic: 'catchment_river_management',
    subtopic: 'river_pollution_and_management',
    skills: ['river_management_strategies'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p1',
    clues: '- A sustainable strategy removes the cause of the problem, reduces the people at risk or monitors the river.\n- Watch out for options that make the situation worse.',
  },
  {
    name: 'Question 5',
    question: 'Match each pollutant to its main effect on a river.',
    metadata: [
      'A - Raw sewage',
      'B - Plastic waste',
      'C - Soil washed from bare slopes',
      'D - Industrial chemicals',
      '1 - Blocks channels and raises the risk of flooding',
      '2 - Poisons aquatic life and food chains',
      '3 - Silts up the channel and reduces its capacity',
      '4 - Adds nutrients that trigger algal blooms and oxygen loss',
    ],
    answer: ['A-4', 'B-1', 'C-3', 'D-2'],
    presentation: 'match',
    type: 'application',
    unit: 'geomorphology',
    topic: 'catchment_river_management',
    subtopic: 'river_pollution_and_management',
    skills: ['pollutant_effects'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 5,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p1',
    clues: '- Think about what each pollutant physically does once it is in the water.\n- Some effects are physical (blocking, silting), others chemical or biological.',
  },
];

// ─── AI explanation (generated in the session, AMPM-CONTENT-AI-EXP) ──────────

const aiExplanation = {
  sub_questions: [
    {
      number: '2.5.1',
      marks: 1,
      clues: '- Use the extract, not outside knowledge.\n- Find the link between poor services and pollution.',
      approach: '- Read the first paragraph of the extract.\n- Find the reason given for pollution along rivers.',
      solution: '1. The extract says dense settlements along rivers get poor service provision.\n2. Residents cannot afford services such as waste removal, so waste piles up and is dumped in the river.\n3. Any one of these reasons earns the mark.',
    },
    {
      number: '2.5.2',
      marks: 2,
      clues: '- Use two things you can see in the photograph.\n- Look at the banks and the water.',
      approach: '- Look for waste in or beside the river.\n- Look for missing infrastructure.',
      solution: '1. Solid waste is piled along the river banks and in the water.\n2. There is no sign of infrastructure to remove the waste.\n3. Evidence of unsafe or no drinking water is also accepted; any two points earn the marks.',
    },
    {
      number: '2.5.3',
      marks: 2,
      clues: '- Think about what happens when the river rises.\n- Link the location of the houses to the risk.',
      approach: '- State how close the houses are to the river.\n- Link that closeness to a flood or bank-collapse risk.',
      solution: '1. The houses are built right at the river\'s edge.\n2. A rising river could flood them or cause the banks to collapse beneath them.',
    },
    {
      number: '2.5.4',
      marks: 4,
      clues: '- Describe the effect on river health, not on people.\n- Give two impacts with an explanation of each.',
      approach: '- Name one impact such as reduced water quality.\n- Name a second impact such as damage to habitats or food chains.\n- Explain how each harms the river.',
      solution: '1. Pollution reduces the water quality.\n2. Habitats for aquatic life are damaged, which can destroy aquatic life and food chains.\n3. Other accepted impacts include eutrophication, loss of biodiversity and increased sedimentation.',
    },
    {
      number: '2.5.5',
      marks: 6,
      clues: '- Give three strategies, each with a short explanation.\n- The municipality has legal and service-delivery tools available.',
      approach: '- Think about prevention (buffer zones, refuse removal).\n- Think about education and enforcement.\n- Think about monitoring and infrastructure.',
      solution: '1. Create a buffer zone so that people do not build next to the river.\n2. Provide refuse removal and sanitation, and run awareness campaigns.\n3. Monitor water quality and enforce legislation with fines.\n4. Any three well-explained strategies earn the six marks.',
    },
  ],
  model: 'claude-sonnet-5-5',
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
