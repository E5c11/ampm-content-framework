#!/usr/bin/env node
/**
 * DBE Geography P1 — November 2025 — Question 2.4 (order 9)
 * Meanders: lower-course formation, gentle inner bank, incised meanders after rejuvenation, oxbow lake formation (8-mark paragraph).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-geography-2025-nov-p1-q2-4.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-geography-2025-nov-p1-q2-4.js --dry-run
 *   node scripts/add-geography-2025-nov-p1-q2-4.js
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
  name: 'Question 2.4',
  syllabus: 'dbe',
  subject: 'geography',
  year: 2025,
  paper: 'nov_p1',
  order: 9,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['meanders', 'rejuvenation'],
  question_image_urls: [`${IMG}/q9/question_1.png`],
  memo_image_urls: [`${IMG}/q9/memo_1.png`],
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
    question: 'Which statement best explains why meanders are typical of the lower course of a river?',
    metadata: [
      'A steep gradient gives the river the energy to cut down across the whole valley floor',
      'The river carries large boulders that force it to zigzag',
      'A gentle gradient and low velocity favour lateral erosion and deposition rather than downcutting',
      'Resistant rock bands in the lower course force sharp bends',
      '',
    ],
    answer: ['A gentle gradient and low velocity favour lateral erosion and deposition rather than downcutting', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'geomorphology',
    topic: 'fluvial_processes',
    subtopic: 'meanders_and_rejuvenation',
    skills: ['meander_course_and_processes'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p1',
    clues: '- Think about the slope and speed of water near the mouth.\n- Meanders are about sideways movement, not downward cutting.',
  },
  {
    name: 'Question 2',
    question: 'A river with deep, winding meanders cut into a plateau is described as incised. What caused the incision?',
    metadata: [
      'Lateral erosion widened the valley floor until the loops became deeper',
      'Deposition raised the valley floor around the loops',
      'A permanent decrease in discharge reduced the river\'s erosive power',
      'A fall in base level (or uplift) rejuvenated the river, renewing vertical erosion beneath the existing meanders',
      '',
    ],
    answer: [
      'A fall in base level (or uplift) rejuvenated the river, renewing vertical erosion beneath the existing meanders',
      '',
      '',
      '',
      '',
    ],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'geomorphology',
    topic: 'fluvial_processes',
    subtopic: 'meanders_and_rejuvenation',
    skills: ['rejuvenation_incised_meanders'],
    difficulty: 4,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p1',
    clues: '- Incised meanders sit far below the surrounding land: something made the river cut downwards again.\n- Link the cause to a change in the river\'s energy.',
  },
  {
    name: 'Question 3',
    question: 'Select the FOUR correct stages in the formation of an oxbow lake.',
    metadata: [
      'Vertical erosion deepens the channel until the loop dries',
      'Erosion cuts into the outer bank of each bend',
      'Deposition builds up on the inner bank',
      'The neck between two bends narrows',
      'A flood cuts through the neck and deposition seals off the old loop',
    ],
    answer: [
      'Erosion cuts into the outer bank of each bend',
      'Deposition builds up on the inner bank',
      'The neck between two bends narrows',
      'A flood cuts through the neck and deposition seals off the old loop',
      '',
    ],
    presentation: 'multi_select',
    type: 'application',
    unit: 'geomorphology',
    topic: 'fluvial_processes',
    subtopic: 'meanders_and_rejuvenation',
    skills: ['oxbow_lake_formation'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p1',
    clues: '- An oxbow lake is a meander loop that gets cut off, so look for the steps that tighten the loop and then breach it.\n- One option describes a process that does not isolate a loop.',
  },
  {
    name: 'Question 4',
    question: 'Match each meander landform or feature to its description.',
    metadata: [
      'A - Undercut slope',
      'B - Slip-off slope',
      'C - Meander neck',
      'D - Knickpoint',
      '1 - A sudden break in a river\'s profile where renewed erosion begins after rejuvenation',
      '2 - The steep outer bank cut by fast-flowing water',
      '3 - The narrow strip of land between two bends that may be breached in a flood',
      '4 - The gentle inner bank built up by deposition',
    ],
    answer: ['A-2', 'B-4', 'C-3', 'D-1'],
    presentation: 'match',
    type: 'definition',
    unit: 'geomorphology',
    topic: 'fluvial_processes',
    subtopic: 'meanders_and_rejuvenation',
    skills: ['meander_landforms'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p1',
    clues: '- Decide which side of the bend each feature belongs to, then which processes shape it.\n- One feature is not on the bend at all but is linked to a change in base level.',
  },
];

// ─── AI explanation (generated in the session, AMPM-CONTENT-AI-EXP) ──────────

const aiExplanation = {
  sub_questions: [
    {
      number: '2.4.1',
      marks: 1,
      clues: '- Think about where the gradient is gentle.\n- Choose between upper and lower.',
      approach: '- Recall where meanders typically form.\n- Decide between upper and lower course.',
      solution: '1. Meanders need a gentle gradient and a wide valley floor.\n2. These conditions occur near the mouth.\n3. Answer: lower.',
    },
    {
      number: '2.4.2',
      marks: 2,
      clues: '- Look at the inner bank at C in photograph A.\n- Link its gentle slope to the speed of the water.',
      approach: '- Identify the process on the inner bank.\n- Link it to the water\'s speed.',
      solution: '1. Water moves slowly on the inner bank.\n2. Slow water deposits its load there, building a gentle slip-off slope.',
    },
    {
      number: '2.4.3',
      marks: 4,
      clues: '- Start with what rejuvenation does to a river\'s energy.\n- Then describe the effect on meanders already in place.',
      approach: '- State the process triggered by rejuvenation.\n- Explain what happens to the channel or valley.\n- Link both to incised meanders.',
      solution: '1. Rejuvenation renews vertical (downward) erosion in the river.\n2. The river cuts a deeper channel or valley while keeping its meandering pattern.\n3. This produces deep, winding incised meanders.',
    },
    {
      number: '2.4.4',
      marks: 8,
      clues: '- Describe the sequence in order, from erosion on the outer bank to the final separation of the loop.\n- Aim for four distinct steps, each explained.',
      approach: '- Start with erosion and deposition on opposite banks of the bend.\n- Explain how the meander neck narrows.\n- Describe the flood that cuts through the neck.\n- Finish with how the loop is cut off from the main stream.',
      solution: '1. Continuous lateral erosion takes place on the outer bank of the bend.\n2. Deposition takes place on the inner bank, on the slip-off slope.\n3. The meander neck becomes narrower.\n4. A flood cuts through the neck and the meander loop is separated from the main stream by deposition, forming an oxbow lake.',
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
