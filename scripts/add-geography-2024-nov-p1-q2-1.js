#!/usr/bin/env node
/**
 * DBE Geography P1 — November 2024 — Question 2.1 (order 6)
 * Drainage basins: basin vocabulary (watershed, confluence, source, mouth), infiltration and run-off, and the water table.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-geography-2024-nov-p1-q2-1.js --curriculum temp/curriculum-vocab-geography-p1-2024.json
 *   node scripts/add-geography-2024-nov-p1-q2-1.js --dry-run
 *   node scripts/add-geography-2024-nov-p1-q2-1.js
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
  name: 'Question 2.1',
  syllabus: 'dbe',
  subject: 'geography',
  year: 2024,
  paper: 'nov_p1',
  order: 6,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['drainage_basin'],
  question_image_urls: [
    `${IMG}/q6/question_1.png`,
  ],
  memo_image_urls: [
    `${IMG}/q6/memo_1.png`,
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
    question: 'Match each drainage basin term to its description.',
    metadata: [
      'A - Watershed',
      'B - Confluence',
      'C - Source',
      'D - Mouth',
      '1 - High ground that separates neighbouring streams or basins',
      '2 - The point where a tributary joins the main river',
      '3 - The point where a river begins',
      '4 - The point where a river enters the sea or a lake',
    ],
    answer: ['A-1', 'B-2', 'C-3', 'D-4'],
    presentation: 'match',
    type: 'definition',
    unit: 'geomorphology',
    topic: 'drainage_systems',
    subtopic: 'drainage_basin_concepts',
    skills: ['drainage_basin_vocabulary'],
    difficulty: 1,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p1',
    clues: '- Two of the terms are the start and the end of a river.\n- One term is a meeting point and one is a dividing line.',
  },
  {
    name: 'Question 2',
    question: 'Select ALL the conditions that reduce surface run-off and increase infiltration in a drainage basin.',
    metadata: [
      'Paved roads and roofs in a growing town',
      'Dense natural vegetation',
      'Gentle slopes',
      'Soil already saturated after days of rain',
      'Permeable, sandy soil',
    ],
    answer: ['Dense natural vegetation', 'Gentle slopes', 'Permeable, sandy soil', '', ''],
    presentation: 'multi_select',
    type: 'application',
    unit: 'geomorphology',
    topic: 'drainage_systems',
    subtopic: 'drainage_basin_concepts',
    skills: ['infiltration_runoff_relationship'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p1',
    clues: '- Water soaks in when it moves slowly and the ground can take it in.\n- Ask whether each surface lets water through or sheds it.',
  },
  {
    name: 'Question 3',
    question: 'After weeks of steady rain on a gently sloping, grass-covered catchment, what happens to the water table?',
    metadata: [
      'It falls, because the rain runs off before it can soak in',
      'It rises, because more water soaks in and percolates down',
      'It stays the same, because groundwater is not linked to rainfall',
      'It falls, because the grass absorbs all of the water that soaks in',
      '',
    ],
    answer: ['It rises, because more water soaks in and percolates down', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'geomorphology',
    topic: 'drainage_systems',
    subtopic: 'drainage_basin_concepts',
    skills: ['river_type_water_table'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p1',
    clues: '- Think about how much water a gentle, grassy slope lets soak in.\n- The water table is the top of the saturated zone underground.',
  },
  {
    name: 'Question 4',
    question: 'Which statement correctly distinguishes a drainage basin from a catchment area?',
    metadata: [
      'A drainage basin is only the main channel, while a catchment area includes the tributaries',
      'A drainage basin is underground water storage, while a catchment area holds surface water only',
      'A drainage basin is the area a river system drains; a catchment area collects its rain',
      'Both terms describe the boundary line that separates neighbouring river systems',
      '',
    ],
    answer: [
      'A drainage basin is the area a river system drains; a catchment area collects its rain',
      '',
      '',
      '',
      '',
    ],
    presentation: 'multiple_choice',
    type: 'definition',
    unit: 'geomorphology',
    topic: 'drainage_systems',
    subtopic: 'drainage_basin_concepts',
    skills: ['drainage_basin_functions'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p1',
    clues: '- One term is about the land the river system drains.\n- The other is about where the water is gathered.',
  },
];

// ─── AI explanation (generated in the session, AMPM-CONTENT-AI-EXP) ──────────

const aiExplanation = {
  sub_questions: [
    {
      number: '2.1.1',
      marks: 1,
      clues: '- The statement describes the whole area that a river system drains.\n- Two similar terms are offered.',
      approach: '- Decide which term means the area drained by the river and its tributaries.\n- Choose Y or Z.',
      solution: '1. The area drained by a river and all its tributaries is the drainage basin.\n2. A catchment area is where the rainwater is collected.\n3. The answer is Z (drainage basin).',
    },
    {
      number: '2.1.2',
      marks: 1,
      clues: '- The water table rises when more water soaks into the ground.\n- Which gradient lets water soak in?',
      approach: '- Compare run-off on gentle and steep slopes.\n- Link infiltration to the water table.',
      solution: '1. On a gentle gradient water flows slowly and has time to infiltrate.\n2. More infiltration raises the water table quickly.\n3. The answer is Y (gentle gradient).',
    },
    {
      number: '2.1.3',
      marks: 1,
      clues: '- Ground water fills the spaces in rock and soil up to a certain level.\n- What is that level called?',
      approach: '- Separate the level of ground water from water moving sideways through the soil.\n- Choose Y or Z.',
      solution: '1. The upper surface of the saturated zone is the water table.\n2. Through flow is water moving sideways through the soil.\n3. The answer is Y (water table).',
    },
    {
      number: '2.1.4',
      marks: 1,
      clues: '- Seepage means water entering the ground.\n- The other option is water moving over the surface.',
      approach: '- Match seepage into the ground with the correct process.\n- Choose Y or Z.',
      solution: '1. Water soaking into the ground is called infiltration.\n2. Run-off is water flowing over the surface.\n3. The answer is Y (infiltration).',
    },
    {
      number: '2.1.5',
      marks: 1,
      clues: '- Ask which option slows water down and lets it soak in.\n- The other option prevents water from entering the ground.',
      approach: '- Compare the effect of each option on surface run-off.\n- Choose Y or Z.',
      solution: '1. Impermeable rocks stop water soaking in, which increases run-off.\n2. Dense vegetation intercepts rain and slows its flow, so more water infiltrates.\n3. The answer is Z (dense vegetation).',
    },
    {
      number: '2.1.6',
      marks: 1,
      clues: '- A confluence is where two rivers meet.\n- Look at what is circled in each sketch.',
      approach: '- Find the sketch where the circle sits on the joining point of two streams.\n- Choose Y or Z.',
      solution: '1. A confluence is the point where a tributary joins the main river.\n2. In sketch Z the circle marks the point where the two streams join.\n3. The answer is Z.',
    },
    {
      number: '2.1.7',
      marks: 1,
      clues: '- The high ground must lie between two tributaries of the same river.\n- Use the key to find the high-lying area in each sketch.',
      approach: '- Check whether the high ground separates two tributaries that join the same river.\n- Choose Y or Z.',
      solution: '1. A watershed between tributaries lies between two streams of the same river system.\n2. In sketch Z the high-lying area separates two tributaries that join the same main river.\n3. The answer is Z.',
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
