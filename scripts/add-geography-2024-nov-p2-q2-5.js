#!/usr/bin/env node
/**
 * DBE Geography P2 — November 2024 — Question 2.5 — The Informal Sector (order 10)
 * The informal sector: reading trading-time data, why municipalities regulate trading, why the sector grows quickly, the challenges traders face, and measures that help traders.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-geography-2024-nov-p2-q2-5.js --curriculum temp/curriculum-vocab-geography-p2-2024.json
 *   node scripts/add-geography-2024-nov-p2-q2-5.js --dry-run
 *   node scripts/add-geography-2024-nov-p2-q2-5.js
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
  name: 'Question 2.5',
  syllabus: 'dbe',
  subject: 'geography',
  year: 2024,
  paper: 'nov_p2',
  order: 10,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['informal_sector'],
  question_image_urls: [
    `${IMG}/q10/question_1.png`,
    `${IMG}/q10/question_2.png`,
  ],
  memo_image_urls: [
    `${IMG}/q10/memo_1.png`,
    `${IMG}/q10/memo_2.png`,
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
    question: 'A survey of street traders in Tshwane recorded their share of daily sales by time: 06:00–08:00 18%; 08:00–12:00 14%; 12:00–14:00 22%; 14:00–17:00 11%; 17:00–19:00 29%; 19:00–21:00 6%. Which statement best reads the data?',
    metadata: [
      '12:00–14:00 is busiest, because offices close for lunch',
      '06:00–08:00 is busiest, because traders open early',
      '17:00–19:00 is busiest, as commuters pass on their way home',
      '19:00–21:00 is busiest, because evening shoppers have more time',
      '',
    ],
    answer: ['17:00–19:00 is busiest, as commuters pass on their way home', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'interpretation',
    unit: 'economic_geography_sa',
    topic: 'informal_sector',
    subtopic: 'informal_sector_characteristics_and_challenges',
    skills: ['data_trend_interpretation'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p2',
    clues: '- Find the largest percentage first.\n- Then think about who is on the street at that time of day.',
  },
  {
    name: 'Question 2',
    question: 'A municipality allows street trading only in marked trading zones. Which reason best supports this by-law?',
    metadata: [
      'It keeps pavements clear for pedestrians and traffic',
      'It stops traders from earning an income',
      'It lets traders charge higher prices because there are fewer competitors',
      'It removes the need for traders to buy stock',
      '',
    ],
    answer: ['It keeps pavements clear for pedestrians and traffic', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'economic_geography_sa',
    topic: 'informal_sector',
    subtopic: 'informal_sector_characteristics_and_challenges',
    skills: ['informal_sector_formalisation'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p2',
    clues: '- A by-law should solve a problem for the city as a whole.\n- Think about what happens when traders set up anywhere on a busy street.',
  },
  {
    name: 'Question 3',
    question: 'Select ALL the reasons for the rapid growth of the informal sector in South African cities.',
    metadata: [
      'High unemployment in the formal sector',
      'Easy access to bank loans for small businesses',
      'Low start-up costs and few regulations',
      'Strong growth in formal-sector jobs',
      'Many job seekers lack the skills formal jobs require',
    ],
    answer: [
      'High unemployment in the formal sector',
      'Low start-up costs and few regulations',
      'Many job seekers lack the skills formal jobs require',
      '',
      '',
    ],
    presentation: 'multi_select',
    type: 'application',
    unit: 'economic_geography_sa',
    topic: 'informal_sector',
    subtopic: 'informal_sector_characteristics_and_challenges',
    skills: ['informal_sector_growth_factors'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p2',
    clues: '- Ask why someone would start trading on the street instead of taking a formal job.\n- Reject options that would draw people into the formal sector.',
  },
  {
    name: 'Question 4',
    question: 'Select ALL the measures a municipality could take to help informal traders work under better conditions.',
    metadata: [
      'Build covered stalls with lockable storage near taxi ranks',
      'Confiscate the goods of all unlicensed traders',
      'Provide water, toilets and lighting at trading sites',
      'Offer business-skills training and access to micro-loans',
      'Increase policing and security at markets',
    ],
    answer: [
      'Build covered stalls with lockable storage near taxi ranks',
      'Provide water, toilets and lighting at trading sites',
      'Offer business-skills training and access to micro-loans',
      'Increase policing and security at markets',
      '',
    ],
    presentation: 'multi_select',
    type: 'application',
    unit: 'economic_geography_sa',
    topic: 'informal_sector',
    subtopic: 'informal_sector_characteristics_and_challenges',
    skills: ['informal_sector_formalisation'],
    difficulty: 3,
    exam_weight: 3,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p2',
    clues: '- A helpful measure removes a problem traders face every day.\n- Think about shelter, services, money, skills and safety.',
  },
  {
    name: 'Question 5',
    question: 'Match each problem an informal trader faces to its consequence.',
    metadata: [
      'A - No place to store stock overnight',
      'B - No access to bank loans',
      'C - Trading in the open without shelter',
      'D - The business is not registered',
      '1 - Goods are spoiled by rain and sun',
      '2 - No protection from labour laws or insurance',
      '3 - Stock must be carried home or risk being stolen',
      '4 - Stock cannot be bought in bulk at lower prices',
    ],
    answer: ['A-3', 'B-4', 'C-1', 'D-2'],
    presentation: 'match',
    type: 'application',
    unit: 'economic_geography_sa',
    topic: 'informal_sector',
    subtopic: 'informal_sector_characteristics_and_challenges',
    skills: ['informal_sector_challenges'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 5,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p2',
    clues: "- For each problem, picture what goes wrong in a trader's day.",
  },
];

// ─── AI explanation (generated in the session, AMPM-CONTENT-AI-EXP) ──────────

const aiExplanation = {
  sub_questions: [
    {
      number: '2.5.1',
      marks: 1,
      clues: '- Look at the first paragraph of the extract.',
      approach: '- Find the percentage linked to Johannesburg.',
      solution: '1. The extract says 30% of informal trading occurs in Johannesburg.\n2. The answer is 30%.',
    },
    {
      number: '2.5.2',
      marks: 1,
      clues: '- Find the sentence about traders sleeping overnight.',
      approach: '- Quote the reason given for the restriction.',
      solution: '1. Sleeping overnight is restricted because it "exposes them to criminal activity".\n2. Quoting this phrase earns the mark.',
    },
    {
      number: '2.5.3',
      marks: 1,
      clues: '- Find the highest point on the graph.',
      approach: '- Read the time period below the peak.',
      solution: '1. The line peaks at about 36% of informal trade.\n2. The busiest period is 16:00 to 18:00.',
    },
    {
      number: '2.5.4',
      marks: 4,
      clues: '- Think about why people turn to informal trading in a large city.',
      approach: '- Consider unemployment and low wages.\n- Consider how easy it is to start an informal business.\n- Give two reasons.',
      solution: '1. High unemployment, retrenchments, low-paying jobs and poverty push people into the informal sector.\n2. Urban population growth, including immigrants, and a lack of skills add to it.\n3. Low start-up costs, few regulations, limited access to loans and subcontracting by formal businesses make it easy to start.\n4. Any two reasons earn the four marks.',
    },
    {
      number: '2.5.5',
      marks: 8,
      clues: '- The question asks what the municipality can do, so focus on support it can provide.',
      approach: '- Think about space, stalls and storage.\n- Think about services, finance, training and safety.\n- Write four measures in a paragraph.',
      solution: '1. Regulate the sector and allocate trading space near markets, with stalls and storage.\n2. Provide basic services and access to financial assistance.\n3. Offer skills training and partnerships with formal businesses.\n4. Improve policing and use public awareness to improve how the sector is seen.\n5. Any four explained measures earn the eight marks.',
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
