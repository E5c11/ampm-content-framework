#!/usr/bin/env node
/**
 * DBE Geography P1 — November 2024 — Question 2.4 (order 9)
 * River rejuvenation: causes, knickpoints, valley-in-valley and incised meanders, how river terraces form and why some are poor farmland.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-geography-2024-nov-p1-q2-4.js --curriculum temp/curriculum-vocab-geography-p1-2024.json
 *   node scripts/add-geography-2024-nov-p1-q2-4.js --dry-run
 *   node scripts/add-geography-2024-nov-p1-q2-4.js
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
  name: 'Question 2.4',
  syllabus: 'dbe',
  subject: 'geography',
  year: 2024,
  paper: 'nov_p1',
  order: 9,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['rejuvenation', 'river_terraces'],
  question_image_urls: [
    `${IMG}/q9/question_1.png`,
  ],
  memo_image_urls: [
    `${IMG}/q9/memo_1.png`,
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
    question: 'Select ALL the events that could rejuvenate a river.',
    metadata: [
      'Deposition of a delta at the river mouth',
      'A drop in sea level',
      'A long dry period that reduces discharge',
      'Uplift of the land',
      'River capture that adds water from another river',
    ],
    answer: ['A drop in sea level', 'Uplift of the land', 'River capture that adds water from another river', '', ''],
    presentation: 'multi_select',
    type: 'application',
    unit: 'geomorphology',
    topic: 'fluvial_processes',
    subtopic: 'meanders_and_rejuvenation',
    skills: ['rejuvenation_causes'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p1',
    clues: '- Rejuvenation gives a river renewed power to erode downwards.\n- Ask whether each event increases the river\'s energy or the height it can fall.',
  },
  {
    name: 'Question 2',
    question: 'A river\'s long profile shows a sudden steep step part-way along an otherwise smooth curve. What does this step indicate?',
    metadata: [
      'A meander, marking where the river has started to erode its banks sideways',
      'A knickpoint, marking where the new, lower profile meets the old profile',
      'A delta, marking where the river has deposited its load at a new base level',
      'A levee, marking where flood sediment has built up along the river bank',
      '',
    ],
    answer: ['A knickpoint, marking where the new, lower profile meets the old profile', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'interpretation',
    unit: 'geomorphology',
    topic: 'fluvial_processes',
    subtopic: 'meanders_and_rejuvenation',
    skills: ['knickpoint_and_terraces'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p1',
    clues: '- A long profile shows height against distance along the river.\n- A break in slope shows that two profiles have joined.',
  },
  {
    name: 'Question 3',
    question: 'Match each landform to the evidence it gives of rejuvenation.',
    metadata: [
      'A - Knickpoint',
      'B - River terrace',
      'C - Incised meander',
      'D - Valley-in-valley',
      '1 - A sudden break of slope in the long profile',
      '2 - A step-like remnant of an old flood plain above the present one',
      '3 - A meander cut deep into the land with steep valley sides',
      '4 - A narrow new valley cut into the floor of an older, wider valley',
    ],
    answer: ['A-1', 'B-2', 'C-3', 'D-4'],
    presentation: 'match',
    type: 'definition',
    unit: 'geomorphology',
    topic: 'fluvial_processes',
    subtopic: 'meanders_and_rejuvenation',
    skills: ['knickpoint_and_terraces', 'rejuvenation_incised_meanders'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p1',
    clues: '- Each landform shows renewed vertical erosion in a different way.\n- Two are about the valley floor, one about the profile and one about a bend.',
  },
  {
    name: 'Question 4',
    question: 'Which explanation correctly shows how river terraces form?',
    metadata: [
      'Lateral erosion widens the flood plain until it reaches the valley sides and leaves steps',
      'Layers of sediment deposited on the flood plain harden into raised steps over time',
      'Weathering breaks down the valley sides into a series of gently sloping steps',
      'Renewed vertical erosion cuts into the old flood plain and leaves it as raised steps',
      '',
    ],
    answer: ['Renewed vertical erosion cuts into the old flood plain and leaves it as raised steps', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'geomorphology',
    topic: 'fluvial_processes',
    subtopic: 'meanders_and_rejuvenation',
    skills: ['knickpoint_and_terraces'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p1',
    clues: '- Terraces are linked to rejuvenation.\n- Think about what happens to the old flood plain when the river cuts down.',
  },
  {
    name: 'Question 5',
    question: 'Select ALL the reasons why a farmer may find a high river terrace unsuitable for crops.',
    metadata: [
      'It lies high above the river, so irrigation water is hard to reach',
      'It is narrow, which limits machinery and field size',
      'It is covered by fresh, fertile silt in every flood',
      'Building roads up the steep step to the terrace is costly',
      'It lies on the active flood plain of the river',
    ],
    answer: [
      'It lies high above the river, so irrigation water is hard to reach',
      'It is narrow, which limits machinery and field size',
      'Building roads up the steep step to the terrace is costly',
      '',
      '',
    ],
    presentation: 'multi_select',
    type: 'application',
    unit: 'geomorphology',
    topic: 'fluvial_processes',
    subtopic: 'meanders_and_rejuvenation',
    skills: ['river_terrace_land_use'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 5,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2024,
    paper: 'nov_p1',
    clues: '- A terrace is an old flood plain left high and dry.\n- Think about water supply, space and access.',
  },
];

// ─── AI explanation (generated in the session, AMPM-CONTENT-AI-EXP) ──────────

const aiExplanation = {
  sub_questions: [
    {
      number: '2.4.1',
      marks: 2,
      clues: '- Rejuvenation means the river is renewed.\n- What does it gain, and what does it start doing again?',
      approach: '- State what increases in the river.\n- State the type of erosion that results.',
      solution: '1. River rejuvenation is when a river gains renewed energy.\n2. It starts to erode vertically again.\n3. The concept of increased energy causing downward erosion earns the two marks.',
    },
    {
      number: '2.4.2',
      marks: 1,
      clues: '- A points to a sudden drop in the river bed.\n- Name this break of slope.',
      approach: '- Find feature A in the sketch.\n- Recall the term for a break in the long profile.',
      solution: '1. A marks a sudden steep drop in the river channel.\n2. This break of slope is a knickpoint (a waterfall is also accepted).\n3. Answer: knickpoint.',
    },
    {
      number: '2.4.3',
      marks: 2,
      clues: '- A knickpoint marks where two profiles meet.\n- Explain what it shows about the river\'s gradient or erosion.',
      approach: '- Describe the change at the knickpoint.\n- Link it to renewed vertical erosion.',
      solution: '1. At the knickpoint the gradient drops suddenly.\n2. This shows renewed vertical erosion and faster-flowing water.\n3. Any one explained point, such as old and new profiles meeting, earns the two marks.',
    },
    {
      number: '2.4.4',
      marks: 2,
      clues: '- B shows a narrow channel cut into a wider valley floor.\n- Describe what has happened to the landscape.',
      approach: '- Compare the old valley with the new channel.\n- Describe the change in one sentence.',
      solution: '1. The river has cut a new, narrow valley into the floor of the older valley.\n2. This forms a valley in a valley, with a deeper and steeper channel.\n3. Any one such description earns the two marks.',
    },
    {
      number: '2.4.5',
      marks: 4,
      clues: '- Terraces are linked to rejuvenation.\n- Think about the old flood plain when the river cuts down.',
      approach: '- Explain the erosion that happens on the flood plain.\n- Explain what is left behind.\n- Give two explained points.',
      solution: '1. Renewed vertical erosion cuts down into the old flood plain.\n2. A new, lower valley forms below the old one.\n3. The remains of the old flood plain are left as step-like terraces above the new river; any two points earn the four marks.',
    },
    {
      number: '2.4.6',
      marks: 4,
      clues: '- A terrace is a raised, narrow step above the river.\n- Think about water, space, soil and access.',
      approach: '- Give two reasons that make farming difficult.\n- Explain each in a full sentence.',
      solution: '1. Terraces lie far above the river, so water for irrigation is hard to reach.\n2. They can be very narrow, which limits machinery and field size.\n3. Soils may be thin and infertile, slopes uneven and unstable, and roads and other infrastructure expensive to build; any two reasons earn the four marks.',
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
