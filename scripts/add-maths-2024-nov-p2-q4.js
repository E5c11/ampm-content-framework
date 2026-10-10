#!/usr/bin/env node
/**
 * DBE Mathematics P2 — November 2024 — Question 4 (order 4)
 * Analytical geometry — circles: diameter endpoint, tangent equation, equation of a circle, angle from inclinations, perpendicular tangents.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-maths-2024-nov-p2-q4.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-maths-2024-nov-p2-q4.js --dry-run
 *   node scripts/add-maths-2024-nov-p2-q4.js
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
  name: 'Question 4',
  syllabus: 'dbe',
  subject: 'maths',
  year: 2024,
  paper: 'nov_p2',
  order: 4,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['equation_of_circle', 'tangent_to_circle', 'inclination_angle', 'perpendicular_line'],
  question_image_urls: [`${IMG}/q4/question_1.png`],
  memo_image_urls: [`${IMG}/q4/memo_1.png`, `${IMG}/q4/memo_2.png`, `${IMG}/q4/memo_3.png`, `${IMG}/q4/memo_4.png`],
  exam_question_marks: 20,
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
    question: 'PL is a diameter of a circle with centre M(2 ; −1). If P is the point (5 ; 3), determine the coordinates of L. Type them as (x;y) with no spaces.',
    metadata: ['L = ', '[ ]'],
    answer: ['(-1;-5)', '', '', '', ''],
    presentation: 'fitb',
    keyboard_type: 'scientific_math',
    type: 'calc',
    unit: 'analytical_geometry',
    topic: 'circles',
    subtopic: 'centre_and_radius',
    skills: ['midpoint_formula'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2024,
    paper: 'nov_p2',
    clues: '- The centre is the midpoint of any diameter.\n- Go from P to M, then the same step again from M to reach L.',
  },
  {
    name: 'Question 2',
    question: 'A circle has centre (1 ; −2). Determine the equation of the tangent to the circle at the point (3 ; 2). Write it in the form y=mx+c, with decimal values and no spaces.',
    metadata: ['Tangent: ', '[ ]'],
    answer: ['y=-0.5x+3.5|y=3.5-0.5x', '', '', '', ''],
    presentation: 'fitb',
    keyboard_type: 'scientific_math',
    type: 'calc',
    unit: 'analytical_geometry',
    topic: 'circles',
    subtopic: 'tangent_to_circle',
    skills: ['gradient_of_radius', 'perpendicular_gradient', 'tangent_equation'],
    difficulty: 3,
    exam_weight: 3,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2024,
    paper: 'nov_p2',
    clues: '- Find the gradient of the radius to the point of contact.\n- The tangent is perpendicular to that radius, so the product of the gradients is −1.',
  },
  {
    name: 'Question 3',
    question: 'Complete the working to find the radius of the circle.',
    metadata: [
      'x² + y² + 6x − 4y − 12 = 0',
      '(x² + 6x + 9) + (y² − 4y + 4) = 12 + 9 + 4',
      '(x + 3)² + (y − 2)² = 25, so the radius of the circle is:',
      '[ ]',
    ],
    answer: ['5'],
    presentation: 'steps',
    keyboard_type: 'scientific_math',
    type: 'calc',
    unit: 'analytical_geometry',
    topic: 'circles',
    subtopic: 'equation_of_circle',
    skills: ['standard_form_circle', 'reading_centre_from_standard_form'],
    difficulty: 2,
    exam_weight: 3,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2024,
    paper: 'nov_p2',
    clues: '- In the form (x − a)² + (y − b)² = r², the right-hand side is the square of the radius.',
  },
  {
    name: 'Question 4',
    question: 'The lines y = 2x and y = 0.5x − 3 intersect. Using their angles of inclination, calculate the acute angle between the two lines.',
    metadata: ['26.57°', '36.87°', '63.43°', '90°', ''],
    answer: ['36.87°', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'calc',
    unit: 'analytical_geometry',
    topic: 'straight_lines',
    subtopic: 'inclination_angle',
    skills: ['inclination_angle_formula', 'arc_tan'],
    difficulty: 3,
    exam_weight: 3,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2024,
    paper: 'nov_p2',
    clues: '- The angle of inclination θ of a line satisfies tan θ = m.\n- The angle between the lines is the difference between the two angles of inclination.',
  },
];

// ─── AI explanation (one entry per real exam sub-question — AIEXP-08) ────────

const aiExplanation = {
  sub_questions: [
    {
      number: '4.1',
      marks: 2,
      clues: '- PL passes through the centre M, so PL is a diameter.\n- M is the midpoint of PL.',
      approach: '- Use the midpoint formula with M(1 ; 3) and P(3 ; 9).\n- Solve for the coordinates of L.',
      solution: '1. (3 + x) ÷ 2 = 1, so x = −1\n2. (9 + y) ÷ 2 = 3, so y = −3\n3. ∴ L(−1 ; −3)',
    },
    {
      number: '4.2',
      marks: 4,
      clues: '- Find the gradient of the radius MP.\n- The tangent at P is perpendicular to MP.',
      approach: '- m(MP) = (9 − 3) ÷ (3 − 1) = 3.\n- m(ST) = −1/3, because tangent ⊥ radius.\n- Substitute m and P(3 ; 9) into y = mx + c.',
      solution: '1. m(MP) = 3\n2. m(ST) = −1/3\n3. 9 = −1/3(3) + c, so c = 10\n4. ∴ y = −1/3 x + 10',
    },
    {
      number: '4.3',
      marks: 4,
      clues: '- Write the equation with centre (1 ; 3) and find r² by substituting P.\n- Expand and simplify to the given form.',
      approach: '- (x − 1)² + (y − 3)² = r².\n- P(3 ; 9) lies on the circle, so substitute it to find r².\n- Expand the brackets and collect all terms on one side.',
      solution: '1. (3 − 1)² + (9 − 3)² = r², so r² = 40\n2. (x − 1)² + (y − 3)² = 40\n3. x² − 2x + 1 + y² − 6y + 9 = 40\n4. ∴ x² + y² − 2x − 6y − 30 = 0',
    },
    {
      number: '4.4',
      marks: 2,
      clues: '- R(d ; 1) lies on the circle, so substitute it into the equation from 4.3.\n- Use d > 0 to choose the answer.',
      approach: '- Substitute x = d and y = 1.\n- Solve the quadratic in d.',
      solution: '1. d² + 1 − 2d − 6 − 30 = 0\n2. d² − 2d − 35 = 0\n3. (d − 7)(d + 5) = 0\n4. d > 0, ∴ d = 7',
    },
    {
      number: '4.5',
      marks: 5,
      clues: '- PL is a diameter, so the angle at R is 90°.\n- Find the lengths of PR and PL, then use a trig ratio in △PRL.',
      approach: '- PR̂L = 90° (angle in a semicircle).\n- PR = √((3 − 7)² + (9 − 1)²) and PL = √((3 + 1)² + (9 + 3)²).\n- Use sin L̂ = PR ÷ PL.',
      solution: '1. R̂ = 90° (angle in a semicircle)\n2. PR = √80 = 4√5\n3. PL = √160 = 4√10\n4. sin L̂ = 4√5 ÷ 4√10 = 1/√2\n5. ∴ L̂ = 45°',
    },
    {
      number: '4.6',
      marks: 3,
      clues: '- Find the gradient of the radius MR; the tangent TR is perpendicular to it.\n- Compare the gradients of PT and RT.',
      approach: '- m(RM) = (1 − 3) ÷ (7 − 1) = −1/3.\n- RT ⊥ RM, so m(RT) = 3.\n- m(PT) = −1/3 from 4.2, so check the product of the gradients.',
      solution: '1. m(RM) = −1/3\n2. m(RT) = 3 (tangent ⊥ radius)\n3. m(PT) = −1/3\n4. m(RT) × m(PT) = 3 × (−1/3) = −1\n5. ∴ PT ⊥ RT',
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
