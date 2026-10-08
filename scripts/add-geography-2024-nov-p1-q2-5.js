#!/usr/bin/env node
/**
 * DBE Geography P1 — November 2024 — Question 2.5 (order 10)
 * Catchment and river management: what river management is, human activities that harm catchments, their effects on water quality and sustainable strategies.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-geography-2024-nov-p1-q2-5.js --curriculum temp/curriculum-vocab-geography-p1-2024.json
 *   node scripts/add-geography-2024-nov-p1-q2-5.js --dry-run
 *   node scripts/add-geography-2024-nov-p1-q2-5.js
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

const IMG = 'https://media-dev.askmoreprepmore.app/exam_papers/dbe/geography/2024/nov_p1';

const video = {
  name: 'Question 2.5',
  syllabus: 'dbe',
  subject: 'geography',
  year: 2024,
  paper: 'nov_p1',
  order: 10,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['catchment_management', 'river_pollution'],
  question_image_urls: [
    `${IMG}/q10/question_1.png`,
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
    question: 'Which statement best describes river management?',
    metadata: [
      'Building dams so that every river in a basin flows all year round',
      'Removing all human activity from the banks of a river and its tributaries',
      'Monitoring and controlling the use of water resources in a drainage basin',
      'Measuring the discharge of a river only when it is in flood',
      '',
    ],
    answer: ['Monitoring and controlling the use of water resources in a drainage basin', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'definition',
    unit: 'geomorphology',
    topic: 'catchment_river_management',
    subtopic: 'river_pollution_and_management',
    skills: ['river_management_strategies'],
    difficulty: 1,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p1',
    clues: '- Management involves both checking and controlling.\n- It applies to the whole basin, not one structure or one event.',
  },
  {
    name: 'Question 2',
    question: 'A catchment contains a sugar-cane estate that sprays fertiliser, an informal settlement without sewerage, bare fields after harvest and a nature reserve with wetlands. Select ALL the sources that will lower the water quality of the river.',
    metadata: [
      'Fertiliser washing off the cane fields',
      'Wetlands in the nature reserve',
      'Untreated sewage from the settlement',
      'Soil eroded from the bare harvested fields',
      'Indigenous trees in the nature reserve',
    ],
    answer: [
      'Fertiliser washing off the cane fields',
      'Untreated sewage from the settlement',
      'Soil eroded from the bare harvested fields',
      '',
      '',
    ],
    presentation: 'multi_select',
    type: 'interpretation',
    unit: 'geomorphology',
    topic: 'catchment_river_management',
    subtopic: 'river_pollution_and_management',
    skills: ['river_pollution_cause'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p1',
    clues: '- Ask whether each feature adds something to the water or filters it out.',
  },
  {
    name: 'Question 3',
    question: 'Match each human activity in a catchment to its effect on the river.',
    metadata: [
      'A - Fertiliser run-off',
      'B - Untreated sewage',
      'C - Clearing vegetation from slopes',
      'D - Over-abstraction for irrigation',
      '1 - Algal blooms that lower oxygen levels',
      '2 - The spread of waterborne diseases',
      '3 - Silt that smothers river-bed habitats',
      '4 - A lower water table and reduced river flow',
    ],
    answer: ['A-1', 'B-2', 'C-3', 'D-4'],
    presentation: 'match',
    type: 'application',
    unit: 'geomorphology',
    topic: 'catchment_river_management',
    subtopic: 'river_pollution_and_management',
    skills: ['river_health_impacts'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p1',
    clues: '- Think about what each activity adds to or takes from the river: nutrients, germs, soil or water.',
  },
  {
    name: 'Question 4',
    question: 'Select ALL the sustainable strategies a government could use to preserve a river catchment.',
    metadata: [
      'Create buffer zones of natural vegetation along rivers',
      'Remove alien plants that use large amounts of water',
      'Drain wetlands to create more farmland',
      'Fine industries that release untreated waste',
      'Encourage rainwater harvesting',
    ],
    answer: [
      'Create buffer zones of natural vegetation along rivers',
      'Remove alien plants that use large amounts of water',
      'Fine industries that release untreated waste',
      'Encourage rainwater harvesting',
      '',
    ],
    presentation: 'multi_select',
    type: 'application',
    unit: 'geomorphology',
    topic: 'catchment_river_management',
    subtopic: 'river_pollution_and_management',
    skills: ['river_management_strategies'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p1',
    clues: '- Sustainable strategies protect the water and the ecosystem for the future.\n- Watch for an option that destroys a natural filter.',
  },
];

// ─── AI explanation (generated in the session, AMPM-CONTENT-AI-EXP) ──────────

const aiExplanation = {
  sub_questions: [
    {
      number: '2.5.1',
      marks: 2,
      clues: '- River management is about water resources in a whole basin.\n- It involves two actions.',
      approach: '- Name the two actions.\n- Say where they apply.',
      solution: '1. River management is the monitoring and controlling of water resources.\n2. It applies to the whole drainage basin or catchment area.\n3. The concept earns the two marks.',
    },
    {
      number: '2.5.2',
      marks: 1,
      clues: '- Read the second paragraph of the extract.\n- Find the activity that carries chemicals into the river.',
      approach: '- Identify the human activity named in the extract.\n- Give it in one word.',
      solution: '1. The extract says that agricultural run-off carries chemicals into river catchments.\n2. Answer: agriculture (farming).',
    },
    {
      number: '2.5.3',
      marks: 4,
      clues: '- Think about what farm chemicals and fertiliser do once they reach the water.\n- Consider plants, animals and people.',
      approach: '- Explain two effects on water quality or river health.\n- Give each effect a reason.',
      solution: '1. Fertiliser in the water causes eutrophication and lowers oxygen levels.\n2. This upsets the nutrient balance and reduces biodiversity, fauna and flora.\n3. Polluted water can also spread waterborne diseases and disrupt habitats; any two explained effects earn the four marks.',
    },
    {
      number: '2.5.4',
      marks: 8,
      clues: '- The strategies must be things the government can do.\n- They should protect the catchment for the long term.',
      approach: '- Choose four different strategies.\n- Explain how each one protects the catchment.\n- Write as one paragraph of about eight lines.',
      solution: '1. Pass laws, create conservation zones and impose fines on polluters.\n2. Run education and awareness programmes for farmers and communities.\n3. Create buffer zones, remove alien vegetation, encourage afforestation and conserve wetlands.\n4. Improve sewage and wastewater treatment, test water regularly, recycle waste and promote sustainable farming and rainwater harvesting.\n5. Any four explained strategies earn the eight marks.',
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
