#!/usr/bin/env node
/**
 * DBE Geography P2 — November 2024 — Question 1.3 — Rural-Urban Migration and Rural Poverty (order 3)
 * Rural-urban migration: what it is, reading a poverty graph, how unemployment sustains rural poverty, the social impact on rural communities and strategies to slow the outflow of young adults.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-geography-2024-nov-p2-q1-3.js --curriculum temp/curriculum-vocab-geography-p2-2024.json
 *   node scripts/add-geography-2024-nov-p2-q1-3.js --dry-run
 *   node scripts/add-geography-2024-nov-p2-q1-3.js
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
  name: 'Question 1.3',
  syllabus: 'dbe',
  subject: 'geography',
  year: 2024,
  paper: 'nov_p2',
  order: 3,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['rural_depopulation', 'urbanisation'],
  question_image_urls: [
    `${IMG}/q3/question_1.png`,
  ],
  memo_image_urls: [
    `${IMG}/q3/memo_1.png`,
    `${IMG}/q3/memo_2.png`,
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
    question: 'Which situation is an example of rural-urban migration?',
    metadata: [
      'A worker commutes every day from a township to a city-centre office',
      'A family moves from a Durban suburb to a suburb in Cape Town',
      'A young woman moves from a farming village to work in Polokwane',
      'A farmworker moves from one farm to another in the same district',
      '',
    ],
    answer: ['A young woman moves from a farming village to work in Polokwane', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'definition',
    unit: 'rural_urban_settlement',
    topic: 'rural_settlement_issues',
    subtopic: 'rural_depopulation_and_land_reform',
    skills: ['migration_push_pull_factors'],
    difficulty: 1,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p2',
    clues: '- Migration means a lasting change of home, not a daily trip.\n- Check where each move starts and where it ends.',
  },
  {
    name: 'Question 2',
    question: 'Between 2008 and 2023 the poverty rate of young adults who stayed in a rural district fell from 76% to 69%. For young adults from the same district who moved to cities, it fell from 74% to 41%. How many percentage points MORE did poverty fall for those who moved?',
    metadata: ['Difference = ', '[ ]', ' percentage points'],
    answer: ['26', '', '', '', ''],
    presentation: 'fitb',
    type: 'calc',
    unit: 'rural_urban_settlement',
    topic: 'rural_settlement_issues',
    subtopic: 'rural_depopulation_and_land_reform',
    skills: ['data_trend_interpretation'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p2',
    keyboard_type: 'standard_math',
    clues: '- Work out the fall for each group separately.\n- Then compare the two falls.',
  },
  {
    name: 'Question 3',
    question: 'Why does high unemployment in a rural area keep poverty levels high there?',
    metadata: [
      'Jobless people stop paying tax, so the state stops paying grants',
      'Jobless households earn little, so they cannot afford basic needs',
      'Jobless people farm more land, so local food prices fall',
      'Jobless young people stay at school longer, so they earn later',
      '',
    ],
    answer: ['Jobless households earn little, so they cannot afford basic needs', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'rural_urban_settlement',
    topic: 'rural_settlement_issues',
    subtopic: 'rural_depopulation_and_land_reform',
    skills: ['rural_depopulation_impact'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p2',
    clues: '- Trace the link from having no job to what a household can buy.',
  },
  {
    name: 'Question 4',
    question: 'Select ALL the negative SOCIAL impacts on a rural village when most of its young adults move to the cities.',
    metadata: [
      'Its population becomes older',
      'Its schools become overcrowded',
      'Families are split, with grandparents raising children',
      'Housing shortages in the village get worse',
      'The birth rate in the village falls',
    ],
    answer: [
      'Its population becomes older',
      'Families are split, with grandparents raising children',
      'The birth rate in the village falls',
      '',
      '',
    ],
    presentation: 'multi_select',
    type: 'application',
    unit: 'rural_urban_settlement',
    topic: 'rural_settlement_issues',
    subtopic: 'rural_depopulation_and_land_reform',
    skills: ['rural_depopulation_impact'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p2',
    clues: '- Ask who is left behind when young adults leave.\n- Problems caused by too many people belong to the city, not the village.',
  },
  {
    name: 'Question 5',
    question: 'Select ALL the strategies a rural municipality could use to reduce the number of young adults leaving for the cities.',
    metadata: [
      'Build more low-cost housing in the nearest city',
      'Offer skills training linked to local jobs',
      'Give young farmers start-up loans and access to land',
      'Close small rural schools to save money',
      'Improve rural roads, clinics and internet access',
    ],
    answer: [
      'Offer skills training linked to local jobs',
      'Give young farmers start-up loans and access to land',
      'Improve rural roads, clinics and internet access',
      '',
      '',
    ],
    presentation: 'multi_select',
    type: 'application',
    unit: 'rural_urban_settlement',
    topic: 'rural_settlement_issues',
    subtopic: 'rural_depopulation_and_land_reform',
    skills: ['rural_depopulation_strategies'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 5,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p2',
    clues: '- A good strategy removes a reason to leave or adds a reason to stay.\n- Reject anything that makes the city more attractive or the village less so.',
  },
];

// ─── AI explanation (generated in the session, AMPM-CONTENT-AI-EXP) ──────────

const aiExplanation = {
  sub_questions: [
    {
      number: '1.3.1',
      marks: 2,
      clues: '- The term has two parts: where people come from and where they go.',
      approach: '- State that it is a movement of people.\n- Name the starting area and the destination.',
      solution: '1. Rural-urban migration is the movement of people from rural areas to urban areas.\n2. Both directions must be stated for the full two marks; "movement of people from rural areas" earns one mark.',
    },
    {
      number: '1.3.2',
      marks: 1,
      clues: '- Compare how far each line falls between 1994 and 2024.',
      approach: '- Read the start and end of the dashed line (rural) and the solid line (urban).\n- Pick the line with the smaller drop.',
      solution: '1. The dashed rural line falls only slightly, from about 82% to about 72%.\n2. The solid urban line falls steeply, to about 32%.\n3. Poverty decreased by a smaller amount in rural areas.',
    },
    {
      number: '1.3.3',
      marks: 2,
      clues: '- Link having no job to household income.',
      approach: '- Explain what unemployment does to earnings.\n- Connect that to what people can afford.',
      solution: '1. Unemployed people earn no salary, or only low wages.\n2. Without income they cannot afford basic services and needs.\n3. Either point earns the two marks, which is why rural poverty stays high.',
    },
    {
      number: '1.3.4',
      marks: 4,
      clues: '- Think about who is left behind in the village.\n- Social impacts concern people and families, not money alone.',
      approach: '- Consider changes to the age and gender structure.\n- Consider effects on family life and community.\n- Give two explained impacts.',
      solution: '1. The rural population ages and the birth rate falls as young adults leave.\n2. Family units are disrupted, and the gender structure changes.\n3. Skilled people leave (brain drain), services decline and the community loses its identity.\n4. Any two of these, each stated fully, earn the four marks.',
    },
    {
      number: '1.3.5',
      marks: 6,
      clues: '- Ask what would make a young adult choose to stay.\n- Think about jobs, skills and services.',
      approach: '- Suggest ways to create work in rural areas.\n- Suggest ways to improve services and quality of life.\n- Give three different strategies.',
      solution: '1. Create jobs and investment, for example through entrepreneurship, community projects and tourism.\n2. Offer skills development, subsidised education and financial help for young farmers.\n3. Improve infrastructure, services and recreational activities, and support land reform.\n4. Any three strategies earn the six marks.',
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
