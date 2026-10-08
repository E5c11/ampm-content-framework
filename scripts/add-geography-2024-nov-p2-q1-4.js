#!/usr/bin/env node
/**
 * DBE Geography P2 — November 2024 — Question 1.4 — Urban Profile and Land-Use Zones (order 4)
 * The urban profile: building height and density from the CBD outward, why the transition zone and rural-urban fringe are zones of change, and why the fringe attracts commercial activity.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-geography-2024-nov-p2-q1-4.js --curriculum temp/curriculum-vocab-geography-p2-2024.json
 *   node scripts/add-geography-2024-nov-p2-q1-4.js --dry-run
 *   node scripts/add-geography-2024-nov-p2-q1-4.js
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
  name: 'Question 1.4',
  syllabus: 'dbe',
  subject: 'geography',
  year: 2024,
  paper: 'nov_p2',
  order: 4,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['urban_profile', 'land_use_zones', 'urban_structure'],
  question_image_urls: [
    `${IMG}/q4/question_1.png`,
  ],
  memo_image_urls: [
    `${IMG}/q4/memo_1.png`,
    `${IMG}/q4/memo_2.png`,
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
    question: 'Which description matches a typical urban profile drawn from the CBD outward to the rural-urban fringe?',
    metadata: [
      'Low buildings in the CBD rising steadily to tall blocks at the fringe',
      'Even building heights all the way, since land values are the same',
      'Tallest buildings in the residential zone, low ones in the CBD and fringe',
      'Tallest buildings in the CBD, falling steadily to low ones at the fringe',
      '',
    ],
    answer: ['Tallest buildings in the CBD, falling steadily to low ones at the fringe', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'interpretation',
    unit: 'rural_urban_settlement',
    topic: 'urban_structure_and_patterns',
    subtopic: 'land_use_zones_and_models',
    skills: ['urban_profile_interpretation'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p2',
    clues: '- An urban profile is a side view of a city.\n- Think about where land is most expensive and how builders respond.',
  },
  {
    name: 'Question 2',
    question: "Match each urban zone's land condition to the land use it produces.",
    metadata: [
      'A - Very high land values in the CBD',
      'B - Low land values at the rural-urban fringe',
      'C - Old, run-down buildings in the transition zone',
      '1 - Old houses converted into offices and small workshops',
      '2 - Tall buildings that make the most of small plots',
      '3 - Large single-storey shopping centres with wide parking areas',
    ],
    answer: ['A-2', 'B-3', 'C-1'],
    presentation: 'match',
    type: 'application',
    unit: 'rural_urban_settlement',
    topic: 'urban_structure_and_patterns',
    subtopic: 'land_use_zones_and_models',
    skills: ['land_use_zone_relationships'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p2',
    clues: '- Expensive land is used intensively; cheap land can be used generously.\n- Ageing buildings tend to be taken over by a new use.',
  },
  {
    name: 'Question 3',
    question: "Demand for land in a city's CBD rises sharply. What is the most likely effect on building density in the CBD?",
    metadata: [
      'It falls, because firms spread into bigger offices on each plot',
      'It stays the same, because land prices do not affect building',
      'It falls, because vacant plots are kept as parks to attract shoppers',
      'It rises, because every plot is built up and buildings grow taller',
      '',
    ],
    answer: ['It rises, because every plot is built up and buildings grow taller', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'rural_urban_settlement',
    topic: 'urban_structure_and_patterns',
    subtopic: 'land_use_zones_and_models',
    skills: ['urban_structure_rationale'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p2',
    clues: '- High demand pushes land prices up.\n- Ask how owners get the most use out of costly land.',
  },
  {
    name: 'Question 4',
    question: 'Select ALL the processes that make BOTH the transition zone and the rural-urban fringe "zones of change".',
    metadata: [
      'Strict zoning that keeps land use fixed',
      'A mix of different land uses side by side',
      'Invasion and succession, as one land use replaces another',
      'Land values that stay the same for decades',
      'Ongoing renewal or new development',
    ],
    answer: [
      'A mix of different land uses side by side',
      'Invasion and succession, as one land use replaces another',
      'Ongoing renewal or new development',
      '',
      '',
    ],
    presentation: 'multi_select',
    type: 'application',
    unit: 'rural_urban_settlement',
    topic: 'urban_structure_and_patterns',
    subtopic: 'land_use_zones_and_models',
    skills: ['land_use_zone_relationships'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p2',
    clues: '- A zone of change is one where land use is not settled.\n- Reject anything that describes stability.',
  },
  {
    name: 'Question 5',
    question: 'Select ALL the economic reasons why a developer would build a new shopping mall at the rural-urban fringe rather than in the CBD.',
    metadata: [
      'Land is cheaper at the fringe',
      'More pedestrians pass by at the fringe than in the CBD',
      'Large plots allow parking and later expansion',
      'Old buildings at the fringe can be converted cheaply',
      'Nearby highways lower transport and delivery costs',
    ],
    answer: [
      'Land is cheaper at the fringe',
      'Large plots allow parking and later expansion',
      'Nearby highways lower transport and delivery costs',
      '',
      '',
    ],
    presentation: 'multi_select',
    type: 'application',
    unit: 'rural_urban_settlement',
    topic: 'urban_structure_and_patterns',
    subtopic: 'land_use_zones_and_models',
    skills: ['rural_urban_fringe_development'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 5,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p2',
    clues: '- Think about costs: land, space and transport.\n- One option describes the transition zone, and one describes the CBD.',
  },
];

// ─── AI explanation (generated in the session, AMPM-CONTENT-AI-EXP) ──────────

const aiExplanation = {
  sub_questions: [
    {
      number: '1.4.1',
      marks: 2,
      clues: '- The word "profile" suggests a particular view.',
      approach: '- State the kind of view.\n- Say what it is a view of.',
      solution: '1. An urban profile is a side view of an urban area.\n2. "Side view" alone earns one mark; adding "of an urban area" earns both.',
    },
    {
      number: '1.4.2',
      marks: 1,
      clues: '- Compare the buildings on the far left and far right of the sketch.',
      approach: '- Look at the CBD buildings.\n- Look at the rural-urban fringe buildings.\n- State how height changes.',
      solution: '1. The CBD has tall, multi-storey buildings.\n2. The rural-urban fringe has low buildings.\n3. Height decreases away from the CBD (buildings are taller in the CBD), which earns the mark.',
    },
    {
      number: '1.4.3',
      marks: 2,
      clues: '- High demand for land makes it expensive.',
      approach: '- Think about how owners use costly, scarce land.\n- Describe what that does to how closely buildings are packed.',
      solution: '1. Demand for land in the CBD is very high, so land is costly.\n2. Every plot is built on and buildings are close together.\n3. The result is a high building density.',
    },
    {
      number: '1.4.4',
      marks: 4,
      clues: '- A zone of change is one where land use keeps shifting.',
      approach: '- Think about what happens to old buildings in the transition zone.\n- Think about what happens to farmland at the fringe.\n- Give two explained reasons.',
      solution: '1. Both zones have mixed land use.\n2. Invasion and succession take place as one land use replaces another.\n3. Urban renewal happens in the transition zone, and urban expansion (sprawl) at the fringe.\n4. Any two reasons earn the four marks.',
    },
    {
      number: '1.4.5',
      marks: 6,
      clues: '- Focus on costs and access, since the question asks for economic reasons.',
      approach: '- Consider the price and availability of land.\n- Consider transport and access to markets.\n- Give three reasons.',
      solution: '1. Land is cheaper and more land is available.\n2. The fringe has access to markets and to transport infrastructure such as highways, which reduces transport costs.\n3. Less crime lowers costs, and raw materials can be close by.\n4. Any three reasons earn the six marks.',
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
