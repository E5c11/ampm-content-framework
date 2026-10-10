#!/usr/bin/env node
/**
 * DBE Mathematics P1 — November 2024 — Question 4 (order 4)
 * Exponential function: finding the base, range, intercepts and asymptote, reflection about y = x.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-maths-2024-nov-p1-q4.js --curriculum temp/curriculum-vocab-maths.json
 *   node scripts/add-maths-2024-nov-p1-q4.js --dry-run
 *   node scripts/add-maths-2024-nov-p1-q4.js
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
  name: 'Question 4',
  syllabus: 'dbe',
  subject: 'maths',
  year: 2024,
  paper: 'nov_p1',
  order: 4,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['exponential', 'asymptote', 'inverse_function'],
  question_image_urls: [`${IMG}/q4/question_1.png`],
  memo_image_urls: [`${IMG}/q4/memo_1.png`],
  exam_question_marks: 9,
  supplementary_materials: [
    { type: 'formula_sheet', label: 'Formula Sheet', image_urls: [`${IMG}/q0/question_1.png`] },
  ],
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    name: 'Question 1',
    question: 'The point P(3 ; 5) lies on the graph of g(x) = b^x − 3, where b > 0. Complete the working to find the value of b.',
    metadata: [
      'g(x) = b^x − 3 and P(3 ; 5) lies on g',
      '5 = b³ − 3',
      'b³ = 8, so b:',
      '[ ]',
    ],
    answer: ['2'],
    presentation: 'steps',
    keyboard_type: 'scientific_math',
    type: 'calc',
    unit: 'functions_graphs',
    topic: 'exponential',
    subtopic: 'finding_base',
    skills: ['substituting_point', 'exponential_base'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe', subject: 'maths', year: 2024, paper: 'nov_p1',
    clues: '- Substitute the coordinates of the point into the equation.\n- Isolate the power of b, then take the matching root.',
  },
  {
    name: 'Question 2',
    question: 'Write down the range of h(x) = (\\frac{1}{3})^x + 4. Write your answer in the form y > c or y < c.',
    metadata: ['Range: ', '[ ]'],
    answer: ['y>4', '', '', '', ''],
    presentation: 'fitb',
    keyboard_type: 'scientific_math',
    type: 'definition',
    unit: 'functions_graphs',
    topic: 'exponential',
    subtopic: 'graph_interpretation',
    skills: ['range_of_transformed_graph'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe', subject: 'maths', year: 2024, paper: 'nov_p1',
    clues: '- An exponential graph never reaches its horizontal asymptote.\n- A vertical shift moves the asymptote by the same amount.',
  },
  {
    name: 'Question 3',
    question: 'For f(x) = 3^x − 9, determine the x-intercept and the y-intercept. Give the x-intercept as x = … and the y-intercept as y = …',
    metadata: ['x = ', '[ ]', ' and y = ', '[ ]'],
    answer: ['2', '-8', '', '', ''],
    presentation: 'fitb',
    keyboard_type: 'standard_math',
    type: 'calc',
    unit: 'functions_graphs',
    topic: 'exponential',
    subtopic: 'graph_interpretation',
    skills: ['substituting_zero', 'solving_exponential'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 3,
    syllabus: 'dbe', subject: 'maths', year: 2024, paper: 'nov_p1',
    clues: '- At the x-intercept y is zero; at the y-intercept x is zero.\n- Write both sides of the exponential equation as powers of the same base.',
  },
  {
    name: 'Question 4',
    question: "The point C lies on the graph of f(x) = (\\frac{1}{2})^x + 1 and has a y-coordinate of 9. What are the coordinates of C', the image of C when C is reflected about the line y = x?",
    metadata: ['(−3 ; 9)', '(9 ; 3)', '(9 ; −3)', '(3 ; 9)', ''],
    answer: ['(9 ; −3)', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'calc',
    unit: 'functions_graphs',
    topic: 'logarithm',
    subtopic: 'inverse_function',
    skills: ['reflection_about_y_equals_x', 'solving_exponential'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe', subject: 'maths', year: 2024, paper: 'nov_p1',
    clues: '- First find the x-coordinate of C by solving an exponential equation.\n- Reflecting a point about the line y = x swaps its coordinates.',
  },
];

// ─── AI explanation (AMPM-CONTENT-AI-EXP) — one entry per exam sub-question ───

const aiExplanation = {
  sub_questions: [
    {
      number: '4.1',
      marks: 2,
      clues: '- B lies on f, so its coordinates satisfy the equation of f.',
      approach: '- Substitute x = 2 and y = −5/9 into f(x) = aˣ − 1.\n- Solve for a and keep the positive value, because a > 0.',
      solution: '1. −5/9 = a² − 1\n2. a² = 4/9\n3. a = 2/3 (since a > 0)',
    },
    {
      number: '4.2',
      marks: 1,
      clues: '- The graph of aˣ − 1 never reaches its horizontal asymptote.',
      approach: '- The horizontal asymptote of f is y = −1.\n- The graph lies above it.',
      solution: '1. y > −1, or y ∈ (−1 ; ∞)',
    },
    {
      number: '4.3',
      marks: 3,
      clues: '- Find the intercepts and the asymptote, and decide whether the graph increases or decreases.',
      approach: '- f(0) = 1 − 1 = 0, so the graph passes through the origin.\n- The horizontal asymptote is y = −1.\n- Since 0 < a < 1, the graph decreases from left to right.',
      solution: '1. Intercept with both axes: (0 ; 0)\n2. Horizontal asymptote: y = −1\n3. a = 2/3 lies between 0 and 1, so f is a decreasing curve through (0 ; 0) that approaches y = −1 as x increases.',
    },
    {
      number: '4.4',
      marks: 3,
      clues: '- Find the x-coordinate of C by substituting y = 19/8 into f.\n- Reflecting about the line y = x swaps the coordinates.',
      approach: '- Solve 19/8 = (2/3)ˣ − 1.\n- Write 27/8 as a power of 2/3.\n- Swap the coordinates of C to get C′.',
      solution: '1. 19/8 = (2/3)ˣ − 1\n2. (2/3)ˣ = 27/8 = (2/3)⁻³\n3. x = −3, so C(−3 ; 19/8)\n4. C′(19/8 ; −3)',
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
