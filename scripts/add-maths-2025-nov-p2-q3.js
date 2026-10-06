#!/usr/bin/env node
/**
 * DBE Mathematics P2 — November 2025 — Question 3 (order 3)
 * Analytical geometry — straight lines: length of a segment as a surd, gradient and inclination,
 * equation of a line, parallelogram vertex, foot of a perpendicular and area.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-maths-2025-nov-p2-q3.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-maths-2025-nov-p2-q3.js --dry-run
 *   node scripts/add-maths-2025-nov-p2-q3.js
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
  name: 'Question 3',
  syllabus: 'dbe',
  subject: 'maths',
  year: 2025,
  paper: 'nov_p2',
  order: 3,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['analytical_geometry', 'gradient', 'equation_of_line', 'parallelogram', 'perpendicular_line'],
  question_image_urls: [`${IMG}/q3/question_1.png`],
  memo_image_urls: [`${IMG}/q3/memo_1.png`, `${IMG}/q3/memo_2.png`, `${IMG}/q3/memo_3.png`],
  exam_question_marks: 18,
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
    question: 'A(−3 ; −1) and B(5 ; 3) are points on a Cartesian plane. Calculate the length of AB and leave your answer in simplified surd form a√b.',
    metadata: ['AB = ', '[ ]'],
    answer: ['4√5', '', '', '', ''],
    presentation: 'fitb',
    keyboard_type: 'scientific_math',
    type: 'calc',
    unit: 'analytical_geometry',
    topic: 'straight_lines',
    subtopic: 'distance_formula',
    skills: ['distance_formula', 'surd_simplification'],
    difficulty: 3,
    exam_weight: 3,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Use the distance formula with the coordinates of both points.\n- Look for the largest perfect square that divides the number under the root.',
  },
  {
    name: 'Question 2',
    question: 'A straight line makes an angle of 45° with the positive x-axis and passes through the point (3 ; −1). Which is the equation of the line?',
    metadata: ['y = x + 4', 'y = x − 4', 'y = −x + 2', 'y = x − 2', ''],
    answer: ['y = x − 4', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'calc',
    unit: 'analytical_geometry',
    topic: 'straight_lines',
    subtopic: 'equation_of_line',
    skills: ['gradient_from_angle', 'point_gradient_form', 'equation_of_line'],
    difficulty: 3,
    exam_weight: 3,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2025,
    paper: 'nov_p2',
    clues: '- The gradient of a line equals the tangent of its angle of inclination.\n- Substitute the gradient and the given point into y = mx + c to find c.',
  },
  {
    name: 'Question 3',
    question: 'ABCD, in that order, is a parallelogram with A(−1 ; 2), B(4 ; 3) and C(7 ; −2). Write down the coordinates of D in the form (x;y), with no spaces.',
    metadata: ['D', '[ ]'],
    answer: ['(2;-3)', '', '', '', ''],
    presentation: 'fitb',
    keyboard_type: 'scientific_math',
    type: 'calc',
    unit: 'analytical_geometry',
    topic: 'straight_lines',
    subtopic: 'parallelogram',
    skills: ['diagonals_bisect_each_other', 'midpoint_formula'],
    difficulty: 3,
    exam_weight: 3,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2025,
    paper: 'nov_p2',
    clues: '- The diagonals of a parallelogram bisect each other.\n- The midpoint of AC is also the midpoint of BD.',
  },
  {
    name: 'Question 4',
    question: 'T is a point on line QR such that PT ⊥ QR. Arrange these steps for finding the coordinates of T.',
    metadata: [
      'Solve the equations of PT and QR simultaneously',
      'Find the equation of PT using the point P',
      'Calculate the gradient of QR',
      'Use m(PT) × m(QR) = −1 to find the gradient of PT',
    ],
    answer: [
      'Calculate the gradient of QR',
      'Use m(PT) × m(QR) = −1 to find the gradient of PT',
      'Find the equation of PT using the point P',
      'Solve the equations of PT and QR simultaneously',
    ],
    presentation: 'ordering',
    type: 'calc',
    unit: 'analytical_geometry',
    topic: 'straight_lines',
    subtopic: 'perpendicular_lines',
    skills: ['perpendicular_gradient', 'substitution_method', 'logical_sequence'],
    difficulty: 3,
    exam_weight: 3,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Perpendicular lines have gradients whose product is −1.\n- T lies on both lines, so it satisfies both equations.',
  },
];

// ─── AI explanation (one entry per real exam sub-question — AIEXP-08) ────────

const aiExplanation = {
  sub_questions: [
    {
      number: '3.1',
      marks: 2,
      clues: '- Use the distance formula with Q and R.\n- Simplify the surd by taking out a perfect square.',
      approach: '- Write QR = √((x₂ − x₁)² + (y₂ − y₁)²) with Q(−4 ; −6) and R(12 ; 2).\n- Evaluate the two squares and add them.\n- Simplify the resulting square root.',
      solution: '1. QR = √((−4 − 12)² + (−6 − 2)²)\n2. = √(256 + 64) = √320\n3. = 8√5 units',
    },
    {
      number: '3.2',
      marks: 2,
      clues: '- Use the gradient formula with the coordinates of Q and R.\n- Keep the order of subtraction the same in numerator and denominator.',
      approach: '- m = (y₂ − y₁) ÷ (x₂ − x₁).\n- Substitute Q(−4 ; −6) and R(12 ; 2).\n- Simplify the fraction.',
      solution: '1. m(QR) = (2 − (−6)) ÷ (12 − (−4))\n2. = 8 ÷ 16\n3. = 1/2',
    },
    {
      number: '3.3',
      marks: 2,
      clues: '- The gradient of a line equals the tangent of its angle of inclination.\n- Use the inverse tangent on your calculator.',
      approach: '- Use m = tan θ with the gradient from 3.2.\n- Solve for θ with the inverse tangent.',
      solution: '1. tan θ = 1/2\n2. θ = tan⁻¹(1/2)\n3. θ ≈ 26.57°',
    },
    {
      number: '3.4',
      marks: 2,
      clues: '- Use the gradient from 3.2 and one of the two known points.\n- Substitute into y = mx + c to find c.',
      approach: '- Start with y = (1/2)x + c.\n- Substitute Q(−4 ; −6) to find c.\n- Write the final equation.',
      solution: '1. −6 = (1/2)(−4) + c\n2. c = −4\n3. ∴ y = (1/2)x − 4',
    },
    {
      number: '3.5',
      marks: 2,
      clues: '- In a parallelogram, opposite sides are equal and parallel.\n- Find how you move from Q to R and apply the same move from P.',
      approach: '- Moving from Q to R adds 16 to x and 8 to y.\n- PS is parallel and equal to QR, so the same move takes P to S.\n- Add the same changes to P.',
      solution: '1. Q → R: (x ; y) → (x + 16 ; y + 8)\n2. P → S: (−1 + 16 ; 8 + 8)\n3. ∴ S(15 ; 16)',
    },
    {
      number: '3.6',
      marks: 5,
      clues: '- The gradient of PT is the negative reciprocal of the gradient of QR.\n- T lies on both PT and QR, so solve their equations together.',
      approach: '- Find the gradient of PT from the gradient of QR.\n- Use P to find the equation of PT.\n- Set the equation of PT equal to the equation of QR and solve for x.\n- Substitute back to find y.',
      solution: '1. m(PT) = −2\n2. 8 = −2(−1) + c, so c = 6 and PT: y = −2x + 6\n3. −2x + 6 = (1/2)x − 4\n4. x = 4 and y = (1/2)(4) − 4 = −2\n5. ∴ T(4 ; −2)',
    },
    {
      number: '3.7',
      marks: 3,
      clues: '- The area of a parallelogram is base × perpendicular height.\n- Use QR as the base and PT as the height.',
      approach: '- PT is perpendicular to QR, so PT is the height.\n- Calculate the length of PT with the distance formula.\n- Multiply QR by PT.',
      solution: '1. PT = √((4 − (−1))² + (−2 − 8)²) = √125 = 5√5\n2. Area = QR × PT = 8√5 × 5√5\n3. = 200 square units',
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
