#!/usr/bin/env node
/**
 * DBE Mathematics P2 — November 2025 — Question 7 (order 7)
 * Trigonometry — graphs: period, translation, tan asymptotes and a trig inequality read from the
 * graph of cos 2x.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-maths-2025-nov-p2-q7.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-maths-2025-nov-p2-q7.js --dry-run
 *   node scripts/add-maths-2025-nov-p2-q7.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

const IMG = 'https://media-dev.askmoreprepmore.app/exam_papers/dbe/maths/2025/nov_p2';

// ─── Phase 2 — lesson document ───────────────────────────────────────────────

const video = {
  name: 'Question 7',
  syllabus: 'dbe',
  subject: 'maths',
  year: 2025,
  paper: 'nov_p2',
  order: 7,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['trig_graphs', 'period', 'transformations', 'asymptote'],
  question_image_urls: [`${IMG}/q7/question_1.png`],
  memo_image_urls: [`${IMG}/q7/memo_1.png`],
  exam_question_marks: 10,
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
    question: 'Write down the period of f(x) = cos 5x, in degrees.',
    metadata: ['Period = ', '[ ]', '°'],
    answer: ['72', '', '', '', ''],
    presentation: 'fitb',
    keyboard_type: 'standard_math',
    type: 'calc',
    unit: 'trigonometry',
    topic: 'trig_graphs',
    subtopic: 'period',
    skills: ['period_of_trig_function', 'effect_of_coefficient'],
    difficulty: 2,
    exam_weight: 3,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2025,
    paper: 'nov_p2',
    clues: '- The period of cos x is 360°.\n- A coefficient of x inside the argument divides the period by that factor.',
  },
  {
    name: 'Question 2',
    question: 'The graph of f(x) = sin 2x is translated 30° to the left to form h. Write down the equation of h in the form h(x) = sin(2x + c), with no spaces.',
    metadata: ['Equation: ', '[ ]'],
    answer: ['h(x)=sin(2x+60°)', '', '', '', ''],
    presentation: 'fitb',
    keyboard_type: 'scientific_math',
    type: 'calc',
    unit: 'trigonometry',
    topic: 'trig_graphs',
    subtopic: 'translation',
    skills: ['horizontal_shift', 'effect_of_coefficient'],
    difficulty: 3,
    exam_weight: 3,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2025,
    paper: 'nov_p2',
    clues: '- A shift to the left replaces x with (x + k) before the coefficient is applied.\n- Multiply out the bracket so that the argument has the form 2x + c.',
  },
  {
    name: 'Question 3',
    question: 'Match each feature of g(x) = tan 2x − 1 to its value.',
    metadata: [
      'A - Period of g',
      'B - Equation of the asymptote between 0° and 90°',
      'C - y-intercept of g',
      'D - Vertical shift of the graph of y = tan 2x',
      '1 - 90°',
      '2 - x = 45°',
      '3 - y = −1',
      '4 - 1 unit down',
    ],
    answer: ['A-1', 'B-2', 'C-3', 'D-4'],
    presentation: 'match',
    type: 'calc',
    unit: 'trigonometry',
    topic: 'trig_graphs',
    subtopic: 'period',
    skills: ['period_of_trig_function', 'tan_graph_asymptotes', 'amplitude_and_vertical_shift'],
    difficulty: 3,
    exam_weight: 3,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2025,
    paper: 'nov_p2',
    clues: '- The period of tan x is 180° and the coefficient of x changes it.\n- A tangent graph is undefined where its argument equals 90°.',
  },
  {
    name: 'Question 4',
    question: 'For which values of x in [0°;180°] is cos 2x ≥ 0?',
    metadata: ['45° ≤ x ≤ 135°', '0° ≤ x ≤ 45° or 135° ≤ x ≤ 180°', '0° ≤ x ≤ 90°', '0° ≤ x ≤ 45°', ''],
    answer: ['0° ≤ x ≤ 45° or 135° ≤ x ≤ 180°', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'calc',
    unit: 'trigonometry',
    topic: 'trig_graphs',
    subtopic: 'trig_inequality',
    skills: ['inequality_sign_analysis', 'cosine_graph_behaviour'],
    difficulty: 3,
    exam_weight: 3,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Sketch cos 2x over the whole interval and see where it lies on or above the x-axis.\n- The graph completes two full cycles on this interval.',
  },
];

// ─── AI explanation (one entry per real exam sub-question — AIEXP-08) ────────

const aiExplanation = {
  sub_questions: [
    {
      number: '7.1',
      marks: 1,
      clues: '- The period of cos x is 360°.\n- The coefficient of x divides the period.',
      approach: '- Read the period off the graph, or use 360° ÷ 2.\n- The graph repeats every 180°.',
      solution: '1. Period = 360° ÷ 2\n2. = 180°',
    },
    {
      number: '7.2',
      marks: 3,
      clues: '- Start with the period of tan 2x and where its asymptotes fall.\n- The graph is then shifted down by 1.',
      approach: '- tan 2x has period 90°, with asymptotes at x = ±45° and x = ±135°.\n- Subtracting 1 moves every point down 1 unit, so the y-intercept is (0 ; −1).\n- Draw each branch rising between asymptotes and cutting the x-axis where tan 2x = 1.',
      solution: '1. Asymptotes at x = −135°, −45°, 45° and 135°\n2. y-intercept (0 ; −1)\n3. x-intercepts where tan 2x = 1: x = −67.5°, 22.5° and 112.5°\n4. Draw three increasing branches through these points',
    },
    {
      number: '7.3',
      marks: 1,
      clues: '- A shift to the left replaces x with (x + 45°).\n- Simplify the argument and use a co-function identity.',
      approach: '- Write h(x) = cos 2(x + 45°).\n- Multiply out: cos(2x + 90°).\n- Use cos(θ + 90°) = −sin θ.',
      solution: '1. h(x) = cos 2(x + 45°) = cos(2x + 90°)\n2. ∴ h(x) = −sin 2x',
    },
    {
      number: '7.4',
      marks: 1,
      clues: '- A translation to the left does not change how high or low the graph goes.\n- Use the range of f.',
      approach: '- The amplitude of h is still 1.\n- The graph lies between −1 and 1.',
      solution: '1. h is f shifted horizontally, so the range is unchanged\n2. ∴ y ∈ [−1 ; 1]',
    },
    {
      number: '7.5',
      marks: 4,
      clues: '- Rewrite (1 − tan 2x) so that it matches the factor tan 2x − 1 from the graph in 7.2.\n- Decide where the product is positive or negative with the help of both graphs.',
      approach: '- Solve tan 2x − 1 = 0 to find the point where g crosses the x-axis.\n- Change the inequality to (tan 2x − 1)(cos 2x) ≤ 0.\n- Check each region between the key points: where f and g have opposite signs.',
      solution: '1. tan 2x = 1 gives 2x = 45°, so x = 22.5°\n2. (1 − tan 2x)(cos 2x) ≥ 0 means (tan 2x − 1)(cos 2x) ≤ 0\n3. cos 2x and tan 2x − 1 have opposite signs (or one is 0)\n4. ∴ x ∈ [0° ; 22.5°] ∪ [112.5° ; 135°)',
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
