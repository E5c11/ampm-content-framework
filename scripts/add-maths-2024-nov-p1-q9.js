#!/usr/bin/env node
/**
 * DBE Mathematics P1 — November 2024 — Question 9 (order 9)
 * Cubic graph: decreasing interval, x-intercepts of f', concavity, vertical shift for three positive x-intercepts.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-maths-2024-nov-p1-q9.js --curriculum temp/curriculum-vocab-maths.json
 *   node scripts/add-maths-2024-nov-p1-q9.js --dry-run
 *   node scripts/add-maths-2024-nov-p1-q9.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

const IMG = 'https://media-dev.askmoreprepmore.app/exam_papers/dbe/maths/2024/nov_p1';

// ─── Phase 2 — lesson document ───────────────────────────────────────────────

const video = {
  name: 'Question 9',
  syllabus: 'dbe',
  subject: 'maths',
  year: 2024,
  paper: 'nov_p1',
  order: 9,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['cubic_analysis', 'stationary_point', 'inflection_point', 'x_intercepts'],
  question_image_urls: [`${IMG}/q9/question_1.png`],
  memo_image_urls: [`${IMG}/q9/memo_1.png`],
  exam_question_marks: 8,
  supplementary_materials: [
    { type: 'formula_sheet', label: 'Formula Sheet', image_urls: [`${IMG}/q0/question_1.png`] },
  ],
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    name: 'Question 1',
    question: 'A cubic function f has a local maximum at P(−1 ; 12) and a local minimum at Q(3 ; −20). For which values of x is f decreasing? Write your answer in the form a < x < b.',
    metadata: ['Solution: ', '[ ]'],
    answer: ['-1<x<3', '', '', '', ''],
    presentation: 'fitb',
    keyboard_type: 'scientific_math',
    type: 'definition',
    unit: 'calculus',
    topic: 'cubic_analysis',
    subtopic: 'inequality_involving_derivative',
    skills: ['reading_graph_decreasing', 'stationary_point_definition'],
    difficulty: 2,
    exam_weight: 3,
    xp: 10,
    order: 1,
    syllabus: 'dbe', subject: 'maths', year: 2024, paper: 'nov_p1',
    clues: '- Between a local maximum and the local minimum that follows it, the graph goes down.',
  },
  {
    name: 'Question 2',
    question: 'Complete the working to find the x-coordinates of the turning points of f(x) = x³ + 3x² − 24x + 5.',
    metadata: [
      "f'(x) = 3x² + 6x − 24",
      "Set f'(x) = 0: 3(x² + 2x − 8) = 0",
      '3(x + 4)(x − 2) = 0, so the larger x-value:',
      '[ ]',
      'and the smaller x-value:',
      '[ ]',
    ],
    answer: ['2', '-4'],
    presentation: 'steps',
    keyboard_type: 'scientific_math',
    type: 'calc',
    unit: 'calculus',
    topic: 'cubic_analysis',
    subtopic: 'stationary_points',
    skills: ['setting_derivative_to_zero', 'factorizing_trinomials'],
    difficulty: 2,
    exam_weight: 3,
    xp: 10,
    order: 2,
    syllabus: 'dbe', subject: 'maths', year: 2024, paper: 'nov_p1',
    clues: '- Turning points occur where the derivative is zero.',
  },
  {
    name: 'Question 3',
    question: 'A cubic function f has a local maximum at x = −3 and a local minimum at x = 5. For which values of x is f concave up?',
    metadata: ['x < 1', 'x > 1', 'x > 5', '−3 < x < 5', ''],
    answer: ['x > 1', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'calc',
    unit: 'calculus',
    topic: 'cubic_analysis',
    subtopic: 'concavity',
    skills: ['second_derivative'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 3,
    syllabus: 'dbe', subject: 'maths', year: 2024, paper: 'nov_p1',
    clues: '- The point of inflection of a cubic lies halfway between the x-values of its turning points.\n- The graph curves upwards on the side where the local minimum is.',
  },
  {
    name: 'Question 4',
    question: 'A cubic function f has a local maximum at (−2 ; 15) and a local minimum at (4 ; −6). For which values of k will y = f(x) + k have three different x-intercepts? Write your answer in the form a < k < b.',
    metadata: ['Solution: ', '[ ]'],
    answer: ['-15<k<6', '', '', '', ''],
    presentation: 'fitb',
    keyboard_type: 'scientific_math',
    type: 'application',
    unit: 'calculus',
    topic: 'cubic_analysis',
    subtopic: 'x_intercepts',
    skills: ['turning_point', 'inequality_direction'],
    difficulty: 4,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe', subject: 'maths', year: 2024, paper: 'nov_p1',
    clues: '- Adding k moves the whole graph up or down.\n- For three x-intercepts, the local maximum must stay above the x-axis and the local minimum must stay below it.',
  },
];

// ─── AI explanation (AMPM-CONTENT-AI-EXP) — one entry per exam sub-question ───

const aiExplanation = {
  sub_questions: [
    {
      number: '9.1',
      marks: 2,
      clues: '- f decreases between its local maximum and its local minimum.',
      approach: '- The local maximum is at x = 1 and the local minimum is at x = 5/2.\n- f decreases between these x-values.',
      solution: '1. 1 < x < 5/2',
    },
    {
      number: '9.2',
      marks: 2,
      clues: '- The derivative is zero at the turning points.',
      approach: '- The turning points are at x = 1 and x = 5/2.\n- These are the x-intercepts of f′.',
      solution: '1. (1 ; 0) and (5/2 ; 0)',
    },
    {
      number: '9.3',
      marks: 2,
      clues: '- The point of inflection of a cubic is halfway between the x-values of its turning points.',
      approach: '- x = (1 + 5/2)/2 = 7/4.\n- The graph is concave up to the right of the point of inflection, on the side of the local minimum.',
      solution: '1. x = (1 + 5/2) / 2 = 7/4\n2. f is concave up for x > 7/4',
    },
    {
      number: '9.4',
      marks: 2,
      clues: '- Adding k shifts the graph vertically. Think about where the local maximum and minimum must end up.',
      approach: '- The local minimum (y = 8) must move below the x-axis, and the local maximum (y = 9) must stay above it.\n- Then the y-intercept 7 + k is negative, so all three x-intercepts are positive.',
      solution: '1. Local minimum: 8 + k < 0, so k < −8\n2. Local maximum: 9 + k > 0, so k > −9\n3. −9 < k < −8',
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
