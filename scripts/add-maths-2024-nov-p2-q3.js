#!/usr/bin/env node
/**
 * DBE Mathematics P2 — November 2024 — Question 3 (order 3)
 * Analytical geometry — gradient, equation of a line, distance formula, ratio of areas with a common angle, point on a line at a given distance.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-maths-2024-nov-p2-q3.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-maths-2024-nov-p2-q3.js --dry-run
 *   node scripts/add-maths-2024-nov-p2-q3.js
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
  name: 'Question 3',
  syllabus: 'dbe',
  subject: 'maths',
  year: 2024,
  paper: 'nov_p2',
  order: 3,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['analytical_geometry', 'equation_of_line', 'area_of_triangle'],
  question_image_urls: [`${IMG}/q3/question_1.png`],
  memo_image_urls: [`${IMG}/q3/memo_1.png`, `${IMG}/q3/memo_2.png`, `${IMG}/q3/memo_3.png`],
  exam_question_marks: 19,
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
    question: 'Calculate the gradient of the line through E(−6 ; 2) and F(4 ; −3).',
    metadata: ['Gradient of EF = ', '[ ]'],
    answer: ['-0.5', '', '', '', ''],
    presentation: 'fitb',
    keyboard_type: 'standard_math',
    type: 'calc',
    unit: 'analytical_geometry',
    topic: 'straight_lines',
    subtopic: 'gradient',
    skills: ['gradient_formula'],
    difficulty: 1,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2024,
    paper: 'nov_p2',
    clues: '- Use m = (y₂ − y₁) ÷ (x₂ − x₁).\n- Subtract the coordinates in the same order at the top and the bottom.',
  },
  {
    name: 'Question 2',
    question: 'Determine the equation of the line through P(−4 ; 0) and Q(2 ; −9). Write it in the form y=mx+c, with decimal values and no spaces.',
    metadata: ['Equation: ', '[ ]'],
    answer: ['y=-1.5x-6|y=-6-1.5x', '', '', '', ''],
    presentation: 'fitb',
    keyboard_type: 'scientific_math',
    type: 'calc',
    unit: 'analytical_geometry',
    topic: 'straight_lines',
    subtopic: 'equation_of_line',
    skills: ['gradient_formula', 'point_gradient_form'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2024,
    paper: 'nov_p2',
    clues: '- Find the gradient first.\n- Substitute the gradient and one of the points into y = mx + c to find c.',
  },
  {
    name: 'Question 3',
    question: 'In △PQR, S lies on PQ with PS = \\frac{1}{4}PQ, and T lies on PR with PT = \\frac{2}{3}PR. Calculate \\frac{Area △PST}{Area △PQR}.',
    metadata: ['\\frac{1}{12}', '\\frac{3}{8}', '\\frac{1}{6}', '\\frac{5}{12}', ''],
    answer: ['\\frac{1}{6}', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'calc',
    unit: 'trigonometry',
    topic: '3d_trig',
    subtopic: 'area_of_triangle',
    skills: ['area_formula_for_triangle', 'ratio_of_sides'],
    difficulty: 3,
    exam_weight: 3,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2024,
    paper: 'nov_p2',
    clues: '- Both triangles contain the angle at P, so use area = ½ab sin C for each.\n- The sine of the common angle cancels when you divide.',
  },
  {
    name: 'Question 4',
    question: 'Complete the working to find the y-coordinate of point A.',
    metadata: [
      'A lies on the line y = −2x + 1, to the left of the y-axis, and AD = \\sqrt{45}, where D(2 ; −3)',
      'Let A be (x ; −2x + 1): (x − 2)² + (−2x + 1 + 3)² = 45',
      '(x − 2)² + 4(x − 2)² = 45, so (x − 2)² = 9',
      'x = 5 or x = −1; A is to the left of the y-axis, so x = −1 and the y-coordinate of A is:',
      '[ ]',
    ],
    answer: ['3'],
    presentation: 'steps',
    keyboard_type: 'scientific_math',
    type: 'calc',
    unit: 'analytical_geometry',
    topic: 'straight_lines',
    subtopic: 'distance_formula',
    skills: ['distance_formula', 'solving_quadratic', 'solution_validation'],
    difficulty: 3,
    exam_weight: 3,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2024,
    paper: 'nov_p2',
    clues: '- Substitute the chosen x-value into the equation of the line.',
  },
];

// ─── AI explanation (one entry per real exam sub-question — AIEXP-08) ────────

const aiExplanation = {
  sub_questions: [
    {
      number: '3.1',
      marks: 2,
      clues: '- Use the gradient formula with D(3 ; −9) and C(−9 ; 0).',
      approach: '- m = (y₂ − y₁) ÷ (x₂ − x₁).\n- Keep the order of the points the same at the top and the bottom.',
      solution: '1. m(DC) = (−9 − 0) ÷ (3 − (−9))\n2. = −9 ÷ 12\n3. ∴ m(DC) = −3/4',
    },
    {
      number: '3.2',
      marks: 2,
      clues: '- Substitute the gradient from 3.1 and one of the points into y = mx + c.',
      approach: '- Use C(−9 ; 0) and m = −3/4.\n- Solve for c.',
      solution: '1. 0 = −3/4(−9) + c\n2. c = −27/4\n3. ∴ y = −3/4 x − 27/4',
    },
    {
      number: '3.3',
      marks: 1,
      clues: '- B lies on DC, so its coordinates satisfy the equation from 3.2.',
      approach: '- Substitute x = −1 into the equation of DC.',
      solution: '1. k = −3/4(−1) − 27/4\n2. k = 3/4 − 27/4\n3. ∴ k = −6',
    },
    {
      number: '3.4',
      marks: 2,
      clues: '- Use the distance formula with D and C.',
      approach: '- d = √((x₂ − x₁)² + (y₂ − y₁)²).',
      solution: '1. DC = √((3 + 9)² + (−9 − 0)²)\n2. = √(144 + 81) = √225\n3. ∴ DC = 15 units',
    },
    {
      number: '3.5',
      marks: 2,
      clues: '- Find DB with the distance formula, using B(−1 ; −6).\n- Then divide by DC.',
      approach: '- DB = √((3 + 1)² + (−9 + 6)²).\n- Divide by DC = 15.',
      solution: '1. DB = √(16 + 9) = 5\n2. DB ÷ DC = 5 ÷ 15\n3. ∴ DB ÷ DC = 1/3',
    },
    {
      number: '3.6',
      marks: 4,
      clues: '- AC ∥ MB, so the proportionality theorem gives DM ÷ DA = DB ÷ DC.\n- Both triangles share the angle at D, so use area = ½ab sin C.',
      approach: '- From AC ∥ MB: DM ÷ DA = DB ÷ DC = 1/3.\n- Write both areas with the common angle D.\n- Divide; sin D cancels.',
      solution: '1. DM ÷ DA = DB ÷ DC = 1/3 (line ∥ one side of △)\n2. Area △MBD ÷ Area △ACD = [½(DM)(DB) sin D] ÷ [½(DA)(DC) sin D]\n3. = 1/3 × 1/3\n4. ∴ = 1/9',
    },
    {
      number: '3.7',
      marks: 6,
      clues: '- Find the equation of AD using its gradient and the point D.\n- Use the distance formula with AD = √612 and substitute the equation of AD.\n- Reject the x-value that does not put A in the second quadrant.',
      approach: '- AD: y = −4x + c through D(3 ; −9) gives c = 3.\n- Let A be (x ; −4x + 3) and set (x − 3)² + (y + 9)² = 612.\n- Solve the quadratic and choose the negative x-value.',
      solution: '1. −9 = −4(3) + c, so c = 3 and AD: y = −4x + 3\n2. (x − 3)² + (−4x + 12)² = 612\n3. 17x² − 102x − 459 = 0, so x² − 6x − 27 = 0\n4. (x − 9)(x + 3) = 0, so x = 9 (not valid) or x = −3\n5. y = −4(−3) + 3 = 15\n6. ∴ A(−3 ; 15)',
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
