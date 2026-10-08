#!/usr/bin/env node
/**
 * DBE Geography P2 — November 2024 — Question 1.2 — Urban Hierarchy and Central Place Concepts (order 2)
 * Urban hierarchy order and the central place concepts of range, threshold population and sphere of influence.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-geography-2024-nov-p2-q1-2.js --curriculum temp/curriculum-vocab-geography-p2-2024.json
 *   node scripts/add-geography-2024-nov-p2-q1-2.js --dry-run
 *   node scripts/add-geography-2024-nov-p2-q1-2.js
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
  name: 'Question 1.2',
  syllabus: 'dbe',
  subject: 'geography',
  year: 2024,
  paper: 'nov_p2',
  order: 2,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['urban_hierarchy', 'central_place_theory'],
  question_image_urls: [
    `${IMG}/q2/question_1.png`,
    `${IMG}/q2/question_2.png`,
  ],
  memo_image_urls: [
    `${IMG}/q2/memo_1.png`,
  ],
  exam_question_marks: 7,
  supplementary_materials: [],
};

// ─── Phase 3 data — the practice questions ───────────────────────────────────
// Per core/question-schema.md + presentations/{type}.md. Logical/authored shape
// (presentation, type, order, unit/topic/subtopic, skills, …) — the mapping to
// Postgres columns is tools/lib/content-rows.js's job.

const questions = [
  {
    name: 'Question 1',
    question: 'Which sequence lists urban settlements from the lowest order to the highest order in the urban hierarchy?',
    metadata: [
      'City, town, metropolis, megalopolis',
      'Town, metropolis, city, megalopolis',
      'Town, city, metropolis, megalopolis',
      'Town, city, megalopolis, metropolis',
      '',
    ],
    answer: ['Town, city, metropolis, megalopolis', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'definition',
    unit: 'rural_urban_settlement',
    topic: 'settlement_classification',
    subtopic: 'urban_hierarchy_and_function',
    skills: ['urban_hierarchy_progression'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p2',
    clues: '- Each step up the hierarchy is larger and offers more specialised functions.\n- The highest order is formed when several large urban areas merge.',
  },
  {
    name: 'Question 2',
    question: 'Select ALL the characteristics that INCREASE as you move up the urban hierarchy from a town to a metropolis.',
    metadata: [
      'The number of settlements of that order in the country',
      'The size of its sphere of influence',
      'The number and range of functions it offers',
      'How often people buy its highest-order goods',
      'The distance people will travel to reach it',
    ],
    answer: [
      'The size of its sphere of influence',
      'The number and range of functions it offers',
      'The distance people will travel to reach it',
      '',
      '',
    ],
    presentation: 'multi_select',
    type: 'application',
    unit: 'rural_urban_settlement',
    topic: 'settlement_classification',
    subtopic: 'urban_hierarchy_and_function',
    skills: ['urban_hierarchy_progression'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p2',
    clues: '- Higher-order centres are bigger but rarer.\n- People visit them less often, for goods they cannot get nearby.',
  },
  {
    name: 'Question 3',
    question: 'A new hardware store opens in a small town. Match each central place concept to what it means for this store.',
    metadata: [
      'A - Range',
      'B - Threshold population',
      'C - Sphere of influence',
      'D - Central place',
      '1 - The minimum number of customers the store needs to stay in business',
      '2 - The town itself, which serves the farms and villages around it',
      '3 - The furthest a customer is willing to travel to shop at the store',
      '4 - The whole area from which the town draws its customers',
    ],
    answer: ['A-3', 'B-1', 'C-4', 'D-2'],
    presentation: 'match',
    type: 'definition',
    unit: 'rural_urban_settlement',
    topic: 'settlement_classification',
    subtopic: 'urban_hierarchy_and_function',
    skills: ['central_place_concepts'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p2',
    clues: '- Two concepts are about distance or area and one is about a number of people.\n- One concept names the settlement itself.',
  },
  {
    name: 'Question 4',
    question: "The population of a small town falls from 30 000 to 11 000 after its mine closes, and the town's only private hospital shuts down. Which concept best explains the closure?",
    metadata: [
      "The hospital's range grew too large for the town to serve",
      'The town moved up the urban hierarchy and lost the hospital',
      "The population fell below the hospital's threshold",
      "The town's sphere of influence grew after the mine closed",
      '',
    ],
    answer: ["The population fell below the hospital's threshold", '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'rural_urban_settlement',
    topic: 'settlement_classification',
    subtopic: 'urban_hierarchy_and_function',
    skills: ['central_place_concepts'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p2',
    clues: '- Every service needs a minimum number of people to support it.\n- Ask what happened to the number of possible patients.',
  },
  {
    name: 'Question 5',
    question: 'A furniture store is a higher-order function than a bakery. Select ALL the reasons why.',
    metadata: [
      'Furniture is bought every day',
      'Furniture is expensive',
      'Furniture is bought infrequently',
      'A furniture store needs a larger threshold population',
      'A furniture store is found in every village',
    ],
    answer: [
      'Furniture is expensive',
      'Furniture is bought infrequently',
      'A furniture store needs a larger threshold population',
      '',
      '',
    ],
    presentation: 'multi_select',
    type: 'application',
    unit: 'rural_urban_settlement',
    topic: 'settlement_classification',
    subtopic: 'urban_hierarchy_and_function',
    skills: ['central_place_concepts'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 5,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p2',
    clues: '- Compare how often, and for how much money, people buy each product.\n- Think about how many customers each shop needs to survive.',
  },
];

// ─── AI explanation (generated in the session, AMPM-CONTENT-AI-EXP) ──────────

const aiExplanation = {
  sub_questions: [
    {
      number: '1.2.1',
      marks: 1,
      clues: '- Rank the four options by size and number of functions.',
      approach: '- Recall the urban hierarchy from the bottom up.\n- Pick the lowest urban level among the options.',
      solution: '1. The urban hierarchy runs town, city, metropolis, megalopolis.\n2. The town is the smallest urban settlement listed.\n3. The answer is C (town).',
    },
    {
      number: '1.2.2',
      marks: 1,
      clues: '- Higher levels of the hierarchy have fewer settlements.',
      approach: '- Identify the highest-order settlement among the options.\n- The highest order has the fewest examples.',
      solution: '1. As settlements rise in the hierarchy, there are fewer of them.\n2. The megalopolis is the highest order listed.\n3. The answer is D (megalopolis).',
    },
    {
      number: '1.2.3',
      marks: 1,
      clues: '- Think about what has formed where Johannesburg, Pretoria and their surrounding towns have grown together.',
      approach: '- Recall which large urban forms exist in South Africa.\n- Note that South Africa has no true megalopolis.',
      solution: "1. A megalopolis is not found in South Africa.\n2. Gauteng's merged cities and towns form a conurbation.\n3. The answer is B (conurbation).",
    },
    {
      number: '1.2.4',
      marks: 1,
      clues: '- Read the definition carefully: one major city plus surrounding towns.',
      approach: '- Compare the definitions of metropolis and conurbation.\n- Choose the one built around a single major city.',
      solution: '1. A metropolis is a major city with the towns linked to it.\n2. A conurbation forms when several cities merge.\n3. The answer is A (metropolis).',
    },
    {
      number: '1.2.5',
      marks: 1,
      clues: '- Which concept describes the area a settlement serves?',
      approach: '- Distinguish an area from a distance and from a number of people.\n- Choose the concept that is an area.',
      solution: '1. Range is a distance and threshold is a number of people.\n2. Sphere of influence is the area served by a settlement.\n3. A city serves a larger area than a town, so the answer is B.',
    },
    {
      number: '1.2.6',
      marks: 1,
      clues: '- A university offers a high-order service.',
      approach: '- Compare how far students travel to a university and to a school.\n- Apply the same comparison to the area served.',
      solution: '1. People travel much further to a university than to a school, so its range is larger.\n2. It draws students from a wider area, so its sphere of influence is larger.\n3. The answer is C (larger; larger).',
    },
    {
      number: '1.2.7',
      marks: 1,
      clues: '- Think about the price of a car and how often people buy one.',
      approach: '- Decide which two statements describe a car rather than bread.\n- Find the option that combines them.',
      solution: '1. A motor vehicle is more expensive than bread.\n2. It is bought rarely, not daily.\n3. Statements (i) and (iii) apply, so the answer is A.',
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
