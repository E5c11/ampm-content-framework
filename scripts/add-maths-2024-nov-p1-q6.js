#!/usr/bin/env node
/**
 * DBE Mathematics P1 — November 2024 — Question 6 (order 6)
 * Parabola and straight line: turning point, line through two points, maximum vertical distance, tangent after a horizontal shift.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-maths-2024-nov-p1-q6.js --curriculum temp/curriculum-vocab-maths.json
 *   node scripts/add-maths-2024-nov-p1-q6.js --dry-run
 *   node scripts/add-maths-2024-nov-p1-q6.js
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
  name: 'Question 6',
  syllabus: 'dbe',
  subject: 'maths',
  year: 2024,
  paper: 'nov_p1',
  order: 6,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['parabola', 'turning_point', 'vertical_distance', 'tangent_line'],
  question_image_urls: [`${IMG}/q6/question_1.png`],
  memo_image_urls: [`${IMG}/q6/memo_1.png`, `${IMG}/q6/memo_2.png`],
  exam_question_marks: 15,
  supplementary_materials: [
    { type: 'formula_sheet', label: 'Formula Sheet', image_urls: [`${IMG}/q0/question_1.png`] },
  ],
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    name: 'Question 1',
    question: 'Calculate the coordinates of the turning point of f(x) = −2x² + 8x + 3. Write your answer in the form (x;y).',
    metadata: ['Turning point: ', '[ ]'],
    answer: ['(2;11)', '', '', '', ''],
    presentation: 'fitb',
    keyboard_type: 'scientific_math',
    type: 'calc',
    unit: 'functions_graphs',
    topic: 'parabola',
    subtopic: 'turning_point',
    skills: ['turning_point', 'axis_of_symmetry'],
    difficulty: 2,
    exam_weight: 3,
    xp: 10,
    order: 1,
    syllabus: 'dbe', subject: 'maths', year: 2024, paper: 'nov_p1',
    clues: '- Find the x-value of the turning point with x = −b ÷ 2a, or by setting the derivative equal to zero.\n- Substitute that x-value back into f to get the y-value.',
  },
  {
    name: 'Question 2',
    question: 'The graph of f(x) = −x² + 2x + 8 cuts the x-axis at A, to the left of the origin, and passes through C(3 ; 5). Determine the equation of the straight line through A and C. Write it in the form y = mx + c.',
    metadata: ['Equation: ', '[ ]'],
    answer: ['y=x+2', '', '', '', ''],
    presentation: 'fitb',
    keyboard_type: 'scientific_math',
    type: 'calc',
    unit: 'functions_graphs',
    topic: 'parabola',
    subtopic: 'tangent_and_lines',
    skills: ['finding_roots', 'gradient_formula', 'equation_of_straight_line'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe', subject: 'maths', year: 2024, paper: 'nov_p1',
    clues: '- Find A by solving f(x) = 0 and choosing the negative root.\n- Use the gradient formula with A and C, then substitute a point to find c.',
  },
  {
    name: 'Question 3',
    question: 'The graphs of f(x) = −x² + 4x + 12 and g(x) = 2x + 4 intersect at x = −2 and x = 4. A vertical line segment EH joins E on f to H on g, between these two x-values. Complete the working to find the maximum length of EH.',
    metadata: [
      'EH = f(x) − g(x) = −x² + 4x + 12 − (2x + 4)',
      'EH = −x² + 2x + 8',
      'EH is a maximum at x = −b ÷ 2a, so x:',
      '[ ]',
      'Maximum length of EH:',
      '[ ]',
    ],
    answer: ['1', '9'],
    presentation: 'steps',
    keyboard_type: 'scientific_math',
    type: 'calc',
    unit: 'functions_graphs',
    topic: 'parabola',
    subtopic: 'vertical_distance',
    skills: ['vertical_distance', 'turning_point'],
    difficulty: 3,
    exam_weight: 3,
    xp: 10,
    order: 3,
    syllabus: 'dbe', subject: 'maths', year: 2024, paper: 'nov_p1',
    clues: '- The length of a vertical segment is the upper graph minus the lower graph.\n- The resulting quadratic has its maximum at its turning point.',
  },
  {
    name: 'Question 4',
    question: 'Given f(x) = −x² + 6x − 5 and g(x) = 2x + 3. The graph of k(x) = f(x + m) is obtained by shifting f horizontally. For which value of m is g a tangent to k?',
    metadata: ['m = −2', 'm = 2', 'm = 4', 'm = −4', ''],
    answer: ['m = 2', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'calc',
    unit: 'functions_graphs',
    topic: 'parabola',
    subtopic: 'tangent_and_lines',
    skills: ['derivative_as_gradient', 'horizontal_shift', 'tangent_equation'],
    difficulty: 4,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe', subject: 'maths', year: 2024, paper: 'nov_p1',
    clues: '- A horizontal shift does not change the gradient at matching points, so find where f has the same gradient as g.\n- Work out how far that point must move horizontally to land on g.',
  },
];

// ─── AI explanation (AMPM-CONTENT-AI-EXP) — one entry per exam sub-question ───

const aiExplanation = {
  sub_questions: [
    {
      number: '6.1',
      marks: 3,
      clues: '- Use x = −b/(2a), or set f′(x) = 0, to find the x-value of B.',
      approach: '- x = −4 / (2 × (−1)) = 2.\n- Substitute x = 2 into f to get the y-value.',
      solution: '1. x = −4 / (2(−1)) = 2\n2. y = −(2)² + 4(2) + 5 = 9\n3. B(2 ; 9)',
    },
    {
      number: '6.2',
      marks: 3,
      clues: '- A is the negative x-intercept of f.\n- Use A and C to find the gradient, then the equation of the line.',
      approach: '- Solve −x² + 4x + 5 = 0 to get A(−1 ; 0).\n- Gradient of AC = (8 − 0)/(3 − (−1)) = 2.\n- Substitute a point to find the equation.',
      solution: '1. x² − 4x − 5 = 0\n2. (x − 5)(x + 1) = 0, so A(−1 ; 0)\n3. m = (8 − 0)/(3 + 1) = 2\n4. y − 0 = 2(x + 1)\n5. y = 2x + 2',
    },
    {
      number: '6.3',
      marks: 4,
      clues: '- EH is the vertical distance f(x) − g(x) between the graphs.\n- Maximise the resulting quadratic at its turning point.',
      approach: '- EH = −x² + 4x + 5 − (2x + 2) = −x² + 2x + 3.\n- The maximum is at x = −b/(2a) = 1.\n- Substitute x = 1 into the expression for EH.',
      solution: '1. EH = −x² + 4x + 5 − (2x + 2)\n2. EH = −x² + 2x + 3\n3. Maximum at x = −2/(2(−1)) = 1\n4. Maximum length of EH = −(1)² + 2(1) + 3 = 4 units',
    },
    {
      number: '6.4',
      marks: 5,
      clues: '- g has a gradient of 2, so the point of contact on k has k′(x) = 2.\n- The point of contact must also lie on g.',
      approach: '- k′(x) = −2x − 2m + 4; set k′(x) = 2 to get x = 1 − m.\n- At x = 1 − m, k and g have the same y-value.\n- Substitute and solve for m. (Alternatively, set k(x) = g(x) and make the discriminant zero.)',
      solution: '1. k′(x) = −2x − 2m + 4 = 2, so x = 1 − m\n2. k(1 − m) = g(1 − m)\n3. −(1 − m)² − 2m(1 − m) − m² + 4(1 − m) + 4m + 5 = 2(1 − m) + 2\n4. The left-hand side simplifies to 8, so 8 = 4 − 2m\n5. m = −2',
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
