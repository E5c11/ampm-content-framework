#!/usr/bin/env node
/**
 * DBE Geography P2 — November 2024 — Question 1.5 — Informal Settlements and Upgrading (order 5)
 * Informal settlements: what they are, the health risks they pose, the economic reasons they grow and the social benefits of upgrading them on site.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-geography-2024-nov-p2-q1-5.js --curriculum temp/curriculum-vocab-geography-p2-2024.json
 *   node scripts/add-geography-2024-nov-p2-q1-5.js --dry-run
 *   node scripts/add-geography-2024-nov-p2-q1-5.js
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
  name: 'Question 1.5',
  syllabus: 'dbe',
  subject: 'geography',
  year: 2024,
  paper: 'nov_p2',
  order: 5,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['informal_settlements', 'urbanisation'],
  question_image_urls: [
    `${IMG}/q5/question_1.png`,
  ],
  memo_image_urls: [
    `${IMG}/q5/memo_1.png`,
    `${IMG}/q5/memo_2.png`,
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
    question: 'Which settlement is best classified as an informal settlement?',
    metadata: [
      'Government-built brick houses on serviced plots, handed over with title deeds',
      'Shacks put up on vacant municipal land, with no legal claim or services',
      'A planned township of brick houses rented from the municipality',
      'Council-approved backyard flats connected to water and power',
      '',
    ],
    answer: ['Shacks put up on vacant municipal land, with no legal claim or services', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'definition',
    unit: 'rural_urban_settlement',
    topic: 'urban_settlement_issues',
    subtopic: 'informal_settlements_and_upgrading',
    skills: ['informal_settlement_characteristics'],
    difficulty: 1,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p2',
    clues: '- Check each option for planning, legal ownership and services.',
  },
  {
    name: 'Question 2',
    question: "Select ALL the conditions in an informal settlement that directly threaten residents' health.",
    metadata: [
      "The distance to the city's shopping centres",
      'Shared pit toilets that overflow',
      'Uncollected refuse piling up near homes',
      'The lack of title deeds to the land',
      'Crowded rooms where illness spreads quickly',
    ],
    answer: [
      'Shared pit toilets that overflow',
      'Uncollected refuse piling up near homes',
      'Crowded rooms where illness spreads quickly',
      '',
      '',
    ],
    presentation: 'multi_select',
    type: 'application',
    unit: 'rural_urban_settlement',
    topic: 'urban_settlement_issues',
    subtopic: 'informal_settlements_and_upgrading',
    skills: ['informal_settlement_characteristics'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p2',
    clues: '- A health threat is something that can spread disease or cause illness.\n- Some options are real problems but are not about health.',
  },
  {
    name: 'Question 3',
    question: 'Select ALL the ECONOMIC reasons why the number of informal settlements keeps growing.',
    metadata: [
      'Formal rent is unaffordable on low wages',
      'Banks refuse home loans to people without steady jobs',
      'Strict building rules make shacks expensive to build',
      'Living close to work saves on transport costs',
      'Municipalities build serviced houses faster than demand grows',
    ],
    answer: [
      'Formal rent is unaffordable on low wages',
      'Banks refuse home loans to people without steady jobs',
      'Living close to work saves on transport costs',
      '',
      '',
    ],
    presentation: 'multi_select',
    type: 'application',
    unit: 'rural_urban_settlement',
    topic: 'urban_settlement_issues',
    subtopic: 'informal_settlements_and_upgrading',
    skills: ['informal_settlement_growth_factors'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p2',
    clues: '- Economic reasons are about income and cost.\n- Check whether each option would increase or reduce the need for informal housing.',
  },
  {
    name: 'Question 4',
    question: 'An informal settlement is being upgraded on site. Match each upgrade to the social benefit it brings.',
    metadata: [
      'A - Piped water and flush toilets',
      'B - Street lighting',
      'C - Paved access roads',
      'D - Hiring local residents to do the building work',
      '1 - Ambulances and taxis can reach homes',
      '2 - Fewer waterborne diseases',
      '3 - New skills and income for households',
      '4 - Safer movement at night and less crime',
    ],
    answer: ['A-2', 'B-4', 'C-1', 'D-3'],
    presentation: 'match',
    type: 'application',
    unit: 'rural_urban_settlement',
    topic: 'urban_settlement_issues',
    subtopic: 'informal_settlements_and_upgrading',
    skills: ['informal_settlement_upgrading'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p2',
    clues: '- For each upgrade, ask what problem it removes.\n- Then ask how life improves once that problem is gone.',
  },
  {
    name: 'Question 5',
    question: 'A municipality must choose between moving 4\u00a0000 shack dwellers to a new site 35 km away or upgrading their settlement where it stands. Which is the strongest SOCIAL argument for upgrading on site?',
    metadata: [
      'The new site would cost less, so bigger houses could be built',
      'Moving people far away would ease crowding in the city',
      'Upgrading on site would give every family a free brick house',
      'Residents would keep nearby jobs and their support networks',
      '',
    ],
    answer: ['Residents would keep nearby jobs and their support networks', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'rural_urban_settlement',
    topic: 'urban_settlement_issues',
    subtopic: 'informal_settlements_and_upgrading',
    skills: ['informal_settlement_upgrading'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 5,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p2',
    clues: '- A social argument is about people and communities.\n- Think about what residents would lose by being moved far away.',
  },
];

// ─── AI explanation (generated in the session, AMPM-CONTENT-AI-EXP) ──────────

const aiExplanation = {
  sub_questions: [
    {
      number: '1.5.1',
      marks: 2,
      clues: '- Think about how the land is occupied and what the homes are built from.',
      approach: '- Mention the structures.\n- Mention the lack of legal claim to the land.',
      solution: '1. An informal settlement is made up of structures built on land the occupants have no legal claim to.\n2. The memo also accepts shacks of mixed materials on vacant land, or unplanned settlements with no basic services.',
    },
    {
      number: '1.5.2',
      marks: 1,
      clues: '- The answer must come from the extract.',
      approach: '- Find the list of characteristics in the first paragraph.\n- Choose one that harms health.',
      solution: '1. The extract lists a lack of basic services, pollution, overcrowding and poor waste management.\n2. Any one of these earns the mark.',
    },
    {
      number: '1.5.3',
      marks: 4,
      clues: '- Economic reasons are about money: income, cost and finance.',
      approach: '- Think about why people cannot afford formal housing.\n- Think about the cost of living close to work.\n- Explain two reasons.',
      solution: '1. Unemployment, low wages and poverty mean people cannot afford formal housing or rent.\n2. Finance is hard to obtain and interest rates are high.\n3. Municipal budgets cannot keep up with demand, while shacks are cheaper and closer to work.\n4. Any two explained reasons earn the four marks.',
    },
    {
      number: '1.5.4',
      marks: 8,
      clues: '- The question asks for social benefits for residents, and the memo marks fact plus qualification.\n- Use the "after" photograph as a prompt.',
      approach: "- Name an improvement, such as services, infrastructure or facilities.\n- Say how it improves people's lives.\n- Write four such points in a paragraph.",
      solution: '1. Improved services and upgraded infrastructure raise the quality of life.\n2. More facilities, better transport links and recreational facilities make life more convenient.\n3. Upgrading on site keeps community networks intact and lowers crime; a healthier environment raises life expectancy.\n4. Locals learn new skills and are employed on the project, which builds a sense of belonging.\n5. Four points, each with its qualification, earn the eight marks.',
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
