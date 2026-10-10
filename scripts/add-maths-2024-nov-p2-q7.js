#!/usr/bin/env node
/**
 * DBE Mathematics P2 — November 2024 — Question 7 (order 7)
 * Trigonometry — graphs of tan x and cos 2x + 1: asymptotes, inequalities, period, solving with graphs.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-maths-2024-nov-p2-q7.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-maths-2024-nov-p2-q7.js --dry-run
 *   node scripts/add-maths-2024-nov-p2-q7.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

const IMG = 'https://media-dev.askmoreprepmore.app/exam_papers/dbe/maths/2024/nov_p2';

// ─── Phase 2 — lesson document ───────────────────────────────────────────────

const video = {
  name: 'Question 7',
  syllabus: 'dbe',
  subject: 'maths',
  year: 2024,
  paper: 'nov_p2',
  order: 7,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['trig_graphs', 'asymptote', 'period', 'general_solution'],
  question_image_urls: [`${IMG}/q7/question_1.png`],
  memo_image_urls: [`${IMG}/q7/memo_1.png`],
  exam_question_marks: 11,
  supplementary_materials: [
    {
      type: 'formula_sheet',
      label: 'Formula Sheet',
      image_urls: [`${IMG}/q0/question_1.png`],
    },
  ],
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    name: 'Question 1',
    question: 'Write down the period of f(x) = 2tan 3x.',
    metadata: ['Period = ', '[ ]', '°'],
    answer: ['60', '', '', '', ''],
    presentation: 'fitb',
    keyboard_type: 'standard_math',
    type: 'definition',
    unit: 'trigonometry',
    topic: 'trig_graphs',
    subtopic: 'period',
    skills: ['period_of_trig_function'],
    difficulty: 2,
    exam_weight: 1,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2024,
    paper: 'nov_p2',
    clues: '- The period of y = tan x is 180°.\n- A coefficient of x divides the period; the 2 in front does not change it.',
  },
  {
    name: 'Question 2',
    question: 'Which are the equations of the asymptotes of y = tan 2x for x ∈ [0° ; 180°]?',
    metadata: ['x = 90° only', 'x = 0° and x = 90°', 'x = 90° and x = 180°', 'x = 45° and x = 135°', ''],
    answer: ['x = 45° and x = 135°', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'definition',
    unit: 'trigonometry',
    topic: 'trig_graphs',
    subtopic: 'asymptotes',
    skills: ['tan_graph_asymptotes', 'period_of_trig_function'],
    difficulty: 3,
    exam_weight: 1,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2024,
    paper: 'nov_p2',
    clues: '- tan θ is undefined when θ = 90° + k·180°.\n- Here θ = 2x, so solve 2x = 90° + k·180° for x in the interval.',
  },
  {
    name: 'Question 3',
    question: 'For x ∈ [−180° ; 0°], determine the values of x for which sin x ≤ −0.5. Write the answer in the form a°≤x≤b°, with no spaces.',
    metadata: ['x: ', '[ ]'],
    answer: ['-150°≤x≤-30°', '', '', '', ''],
    presentation: 'fitb',
    keyboard_type: 'scientific_math',
    type: 'calc',
    unit: 'trigonometry',
    topic: 'trig_graphs',
    subtopic: 'trig_inequality',
    skills: ['reference_angle', 'inequality_direction'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2024,
    paper: 'nov_p2',
    clues: '- Solve sin x = −0.5 in the interval first; the reference angle is 30°.\n- Picture the sine graph between −180° and 0°: it is lowest at −90°.',
  },
  {
    name: 'Question 4',
    question: 'Complete the working to solve the equation for x ∈ [0° ; 360°].',
    metadata: [
      'sin x = cos x',
      'Divide both sides by cos x (cos x ≠ 0): tan x = 1',
      'The reference angle is 45°, and tan x is positive in the first and third quadrants',
      'x = 45° or x = 180° + 45°, so the larger solution, in degrees, is:',
      '[ ]',
    ],
    answer: ['225'],
    presentation: 'steps',
    keyboard_type: 'scientific_math',
    type: 'calc',
    unit: 'trigonometry',
    topic: 'trig_equations',
    subtopic: 'trig_equation_solution',
    skills: ['quotient_identity', 'solving_trig_equations', 'quadrant_rule'],
    difficulty: 2,
    exam_weight: 3,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2024,
    paper: 'nov_p2',
    clues: '- Add the reference angle to 180° to get the third-quadrant solution.',
  },
];

// ─── AI explanation (one entry per real exam sub-question — AIEXP-08) ────────

const aiExplanation = {
  sub_questions: [
    {
      number: '7.1',
      marks: 1,
      clues: '- tan x is undefined where cos x = 0.',
      approach: '- In [0° ; 180°], cos x = 0 at x = 90°, where the graph has a vertical asymptote.',
      solution: '1. ∴ x = 90°',
    },
    {
      number: '7.2',
      marks: 2,
      clues: '- Look where the graph of f is on or below the x-axis between −180° and 0°.\n- Do not include the asymptote at −90°.',
      approach: '- f(−180°) = 0, so x = −180° is included.\n- Between −90° and 0° the graph is below the axis, and f(0°) = 0.',
      solution: '1. x = −180°\n2. or −90° < x ≤ 0°',
    },
    {
      number: '7.3.1',
      marks: 1,
      clues: '- The period of cos bx is 360° ÷ b.',
      approach: '- Here b = 2.',
      solution: '1. Period = 360° ÷ 2\n2. ∴ period = 180°',
    },
    {
      number: '7.3.2',
      marks: 3,
      clues: '- cos 2x has period 180°; adding 1 moves it up by 1.\n- Find the turning points and intercepts first.',
      approach: '- Maximum value 2 at x = −180°, 0° and 180°.\n- Minimum value 0 at x = −90° and 90°, where the graph touches the x-axis.\n- Join the points with a smooth cosine shape.',
      solution: '1. y-intercept and turning point: (0 ; 2)\n2. Turning points on the x-axis: (−90° ; 0) and (90° ; 0)\n3. End points: (−180° ; 2) and (180° ; 2)',
    },
    {
      number: '7.4',
      marks: 4,
      clues: '- Divide by cos x to get 2cos²x = tan x.\n- Write 2cos²x as cos 2x + 1, which is g(x); the solutions are where the graphs of f and g meet.',
      approach: '- 2cos³x = sin x gives 2cos²x = tan x (cos x = 0 is not a solution).\n- 2cos²x − 1 + 1 = cos 2x + 1, so g(x) = f(x).\n- The graphs intersect at x = 45°, repeating every 180°.',
      solution: '1. 2cos²x = tan x\n2. cos 2x + 1 = tan x\n3. ∴ x = 45° + k·180°, k ∈ ℤ',
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
