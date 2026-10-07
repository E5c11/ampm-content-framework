#!/usr/bin/env node
/**
 * DBE Geography P1 — November 2025 — Question 2.2 (order 7)
 * River capture: captured/captor streams, conditions for a captor, evidence, headward erosion, misfit stream, erosive power and impacts (7 x 1).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-geography-2025-nov-p1-q2-2.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-geography-2025-nov-p1-q2-2.js --dry-run
 *   node scripts/add-geography-2025-nov-p1-q2-2.js
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
  name: 'Question 2.2',
  syllabus: 'dbe',
  subject: 'geography',
  year: 2025,
  paper: 'nov_p1',
  order: 7,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['river_capture'],
  question_image_urls: [`${IMG}/q7/question_1.png`, `${IMG}/q7/question_2.png`],
  memo_image_urls: [`${IMG}/q7/memo_1.png`],
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
    question: 'Match each river-capture term to its description.',
    metadata: [
      'A - Captor stream',
      'B - Captured stream',
      'C - Misfit stream',
      'D - Wind gap',
      '1 - The lower part of a captured river, now too small for its wide valley',
      '2 - A dry notch in the divide marking where the diverted river once flowed',
      '3 - The river whose upper course is diverted into another river\'s valley',
      '4 - The river that steals the headwaters of its neighbour by headward erosion',
    ],
    answer: ['A-4', 'B-3', 'C-1', 'D-2'],
    presentation: 'match',
    type: 'definition',
    unit: 'geomorphology',
    topic: 'fluvial_processes',
    subtopic: 'river_capture',
    skills: ['river_capture_terms'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p1',
    clues: '- Decide who steals and who is robbed before looking at the leftover features.\n- Two terms describe what remains after the capture: one is a stream, one is a gap.',
  },
  {
    name: 'Question 2',
    question: 'Stream M flows steeply down a mountain face over soft shale in a high-rainfall area. Stream N flows gently across resistant dolerite in a dry area. Which stream is more likely to capture the other, and why?',
    metadata: [
      'Stream N, because resistant rock concentrates erosion along its source',
      'Stream N, because a gentle gradient lets it cut backwards more evenly',
      'Stream M, because low rainfall keeps its channel stable',
      'Stream M, because a steep gradient and soft rock favour rapid headward erosion',
      '',
    ],
    answer: ['Stream M, because a steep gradient and soft rock favour rapid headward erosion', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'geomorphology',
    topic: 'fluvial_processes',
    subtopic: 'river_capture',
    skills: ['captor_stream_conditions'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p1',
    clues: '- The captor must be able to erode backwards faster than its neighbour.\n- Weigh up gradient, rock type and rainfall together.',
  },
  {
    name: 'Question 3',
    question: 'Which process extends a captor stream\'s valley upstream until it breaches the divide?',
    metadata: [
      'Lateral erosion of the meander banks',
      'Headward erosion at the source',
      'Deposition on the inner bank of each bend',
      'Downcutting by rejuvenation in the lower course',
      '',
    ],
    answer: ['Headward erosion at the source', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'definition',
    unit: 'geomorphology',
    topic: 'fluvial_processes',
    subtopic: 'river_capture',
    skills: ['headward_erosion'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p1',
    clues: '- The valley is being lengthened in a particular direction, towards the high ground.\n- Rule out processes that widen or deepen the channel rather than lengthen it.',
  },
  {
    name: 'Question 4',
    question: 'Select ALL changes you would expect for a stream that has captured another river.',
    metadata: [
      'It loses its headwaters and becomes a misfit',
      'Its drainage basin becomes larger',
      'Its discharge increases',
      'Its valley is left dry as a wind gap',
      'Its erosive power increases and it may be rejuvenated',
    ],
    answer: ['Its drainage basin becomes larger', 'Its discharge increases', 'Its erosive power increases and it may be rejuvenated', '', ''],
    presentation: 'multi_select',
    type: 'application',
    unit: 'geomorphology',
    topic: 'fluvial_processes',
    subtopic: 'river_capture',
    skills: ['river_capture_impacts'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p1',
    clues: '- Two of the options describe the river that LOSES water, not the one that gains it.\n- More water means more energy and a bigger area drained.',
  },
];

// ─── AI explanation (generated in the session, AMPM-CONTENT-AI-EXP) ──────────

const aiExplanation = {
  sub_questions: [
    {
      number: '2.2.1',
      marks: 1,
      clues: '- The question asks for the river that loses its water, not the one that gains it.\n- Distinguish the process name from the names of the two rivers.',
      approach: '- Name the stream that gives up its upper course.\n- Note that stream piracy is the process, not a stream.',
      solution: '1. The river that has its water diverted is the one that is robbed.\n2. The one that takes the water is the captor, and the process is called stream piracy.\n3. Answer: A (captured stream).',
    },
    {
      number: '2.2.2',
      marks: 1,
      clues: '- A captor must erode headwards faster than its neighbour.\n- Check which combination of gradient and rock type makes that possible.',
      approach: '- Evaluate each option for gradient, rock type and rainfall.\n- Choose the pair that encourages rapid erosion.',
      solution: '1. Steep gradients give the stream energy for erosion.\n2. Soft rock erodes easily, allowing the source to cut backwards.\n3. Answer: C (steep gradient and soft rock).',
    },
    {
      number: '2.2.3',
      marks: 1,
      clues: '- Compare sketches A and B for which river\'s upper course has changed.\n- The evidence is about whose headwaters moved.',
      approach: '- Compare the two sketches.\n- Find which river has gained an upper section and which has lost one.',
      solution: '1. In sketch B part of river Y\'s upper course now flows into X.\n2. River X has therefore captured the headwaters of Y.\n3. Answer: C.',
    },
    {
      number: '2.2.4',
      marks: 1,
      clues: '- Decide which river did the capturing and how it grew.\n- Think about the process that lengthens a river\'s valley backwards.',
      approach: '- Identify the captor from the sketch.\n- Link the captor\'s growth to the process.',
      solution: '1. River X is the captor.\n2. It extended its source backwards until it reached Y\'s valley.\n3. That process is headward erosion by river X: C.',
    },
    {
      number: '2.2.5',
      marks: 1,
      clues: '- Look for the term that describes a small stream in a large valley.\n- The part left behind after the capture has much less water.',
      approach: '- Recall what happens to the lower section of the captured river.\n- Choose the term for a stream too small for its valley.',
      solution: '1. After capture the lower part of river Y receives much less water.\n2. It is a small stream in a valley that was cut by a larger river.\n3. That is a misfit stream: D.',
    },
    {
      number: '2.2.6',
      marks: 1,
      clues: '- Think about what the extra water does to the captor\'s flow and energy.\n- Turbulent and laminar flow differ in how fast and chaotic the water is.',
      approach: '- Identify the cause of greater erosive power.\n- Choose the type of flow linked to higher energy.',
      solution: '1. River X now carries a greater volume of water.\n2. Greater volume and speed produce turbulent flow.\n3. Turbulent flow has more erosive power: A.',
    },
    {
      number: '2.2.7',
      marks: 1,
      clues: '- Consider what extra water does to the captor\'s valley and speed.\n- Check each statement against the effect on the captor stream, not the captured one.',
      approach: '- Evaluate each numbered statement for the captor.\n- The captor\'s drainage basin grows, not shrinks.\n- Choose the pair that matches the extra flow and erosion.',
      solution: '1. The captor gains water so it flows faster (iv).\n2. The extra energy renews downcutting, causing rejuvenation (ii).\n3. Its drainage basin increases rather than decreases, and deposition does not increase.\n4. Answer: C.',
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
