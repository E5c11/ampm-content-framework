#!/usr/bin/env node
/**
 * DBE Mathematics P2 — November 2025 — Question 4 (order 4)
 * Analytical geometry — circles: equation of a circle, translation, intercepts with an axis, and the
 * tangent at a point on the circle.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-maths-2025-nov-p2-q4.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-maths-2025-nov-p2-q4.js --dry-run
 *   node scripts/add-maths-2025-nov-p2-q4.js
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
  name: 'Question 4',
  syllabus: 'dbe',
  subject: 'maths',
  year: 2025,
  paper: 'nov_p2',
  order: 4,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['circles', 'equation_of_circle', 'tangent_to_circle', 'centre', 'radius'],
  question_image_urls: [`${IMG}/q4/question_1.png`],
  memo_image_urls: [`${IMG}/q4/memo_1.png`, `${IMG}/q4/memo_2.png`, `${IMG}/q4/memo_3.png`, `${IMG}/q4/memo_4.png`],
  exam_question_marks: 21,
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
    question: 'A circle has centre (4 ; −3) and radius 6. Write down its equation in the form (x − a)² + (y − b)² = r². Type the x-bracket first and leave no spaces.',
    metadata: ['Equation: ', '[ ]'],
    answer: ['(x-4)^2+(y+3)^2=36', '', '', '', ''],
    presentation: 'fitb',
    keyboard_type: 'scientific_math',
    type: 'calc',
    unit: 'analytical_geometry',
    topic: 'circles',
    subtopic: 'equation_of_circle',
    skills: ['equation_of_circle', 'substituting_centre_and_radius'],
    difficulty: 2,
    exam_weight: 3,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2025,
    paper: 'nov_p2',
    clues: '- The standard form uses the coordinates of the centre with their signs reversed inside the brackets.\n- The right-hand side is the square of the radius.',
  },
  {
    name: 'Question 2',
    question: 'The circle (x − 9)² + (y + 1)² = 16 is translated 3 units to the left. Determine the minimum distance between the new circle and the y-axis.',
    metadata: ['Distance = ', '[ ]', ' units'],
    answer: ['2', '', '', '', ''],
    presentation: 'fitb',
    keyboard_type: 'standard_math',
    type: 'calc',
    unit: 'analytical_geometry',
    topic: 'circles',
    subtopic: 'centre_and_radius',
    skills: ['reading_centre_from_standard_form', 'horizontal_shift'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Read the centre and radius from the equation, then move the centre to find the new centre.\n- The closest point of the circle to the y-axis is one radius inwards from the centre.',
  },
  {
    name: 'Question 3',
    question: 'Where does the circle (x − 5)² + (y − 3)² = 25 cut the x-axis?',
    metadata: ['(0 ; 1) and (0 ; 9)', '(2 ; 0) and (8 ; 0)', '(1 ; 0) and (9 ; 0)', '(−1 ; 0) and (11 ; 0)', ''],
    answer: ['(1 ; 0) and (9 ; 0)', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'calc',
    unit: 'analytical_geometry',
    topic: 'circles',
    subtopic: 'line_and_circle',
    skills: ['intersection_of_line_and_circle', 'substituting_zero'],
    difficulty: 3,
    exam_weight: 3,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Every point on the x-axis has a y-coordinate of 0.\n- Substitute that into the equation and solve for x.',
  },
  {
    name: 'Question 4',
    question: 'M is the centre of a circle and B is a point on the circle. Arrange these steps for finding the equation of the tangent to the circle at B.',
    metadata: [
      'Simplify to the form y = mx + c',
      'Calculate the gradient of the radius MB',
      'Substitute the gradient of the tangent and the coordinates of B into y − y₁ = m(x − x₁)',
      'Use m(tangent) × m(MB) = −1 to find the gradient of the tangent',
    ],
    answer: [
      'Calculate the gradient of the radius MB',
      'Use m(tangent) × m(MB) = −1 to find the gradient of the tangent',
      'Substitute the gradient of the tangent and the coordinates of B into y − y₁ = m(x − x₁)',
      'Simplify to the form y = mx + c',
    ],
    presentation: 'ordering',
    type: 'calc',
    unit: 'analytical_geometry',
    topic: 'circles',
    subtopic: 'tangent_to_circle',
    skills: ['tangent_radius_perpendicular', 'tangent_equation', 'logical_sequence'],
    difficulty: 3,
    exam_weight: 3,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2025,
    paper: 'nov_p2',
    clues: '- A tangent is perpendicular to the radius at the point of contact.\n- You need a gradient and a point before you can write the equation of a line.',
  },
];

// ─── AI explanation (one entry per real exam sub-question — AIEXP-08) ────────

const aiExplanation = {
  sub_questions: [
    {
      number: '4.1',
      marks: 1,
      clues: '- M and E lie on the same vertical line, because MC is parallel to the y-axis.\n- Points on a vertical line share an x-coordinate.',
      approach: '- E(−6 ; −1) is on line MC.\n- MC is parallel to the y-axis, so M has the same x-coordinate as E.',
      solution: '1. MC ∥ y-axis, so x(M) = x(E)\n2. ∴ p = −6',
    },
    {
      number: '4.2',
      marks: 4,
      clues: '- Use the radius ME and the right-angled triangle AMD.\n- Write the three sides in terms of q and apply Pythagoras.',
      approach: '- AM and ME are radii, so AM = ME = q + 1.\n- MD is the vertical distance from M to the x-axis, so MD = q, and AD = q − 1.\n- Substitute into AM² = AD² + MD² and solve for q.',
      solution: '1. (q + 1)² = (q − 1)² + q²\n2. q² + 2q + 1 = q² − 2q + 1 + q²\n3. q² − 4q = 0\n4. q(q − 4) = 0, and q ≠ 0\n5. ∴ q = 4',
    },
    {
      number: '4.3',
      marks: 2,
      clues: '- The centre is M(p ; q) and the radius is AM.\n- Substitute into (x − a)² + (y − b)² = r².',
      approach: '- With p = −6 and q = 4 the centre is (−6 ; 4).\n- The radius is AM = q + 1.\n- Write the equation.',
      solution: '1. r = AM = 4 + 1 = 5\n2. ∴ (x + 6)² + (y − 4)² = 25',
    },
    {
      number: '4.4',
      marks: 1,
      clues: '- Move the centre first, then think about how far the edge of the circle is from the y-axis.\n- Subtract the radius.',
      approach: '- A shift of 2 units left moves the centre to (−8 ; 4).\n- The centre is 8 units from the y-axis.\n- The nearest point of the circle is one radius closer.',
      solution: '1. New centre (−8 ; 4)\n2. Minimum distance = 8 − 5\n3. = 3 units',
    },
    {
      number: '4.5',
      marks: 3,
      clues: '- A and B lie on the x-axis, so their y-coordinates are 0.\n- Substitute y = 0 into the equation of the circle.',
      approach: '- Substitute y = 0 into (x + 6)² + (y − 4)² = 25.\n- Solve the resulting equation for x.\n- Write down both points.',
      solution: '1. (x + 6)² + 16 = 25\n2. (x + 6)² = 9\n3. x + 6 = 3 or x + 6 = −3\n4. ∴ A(−9 ; 0) and B(−3 ; 0)',
    },
    {
      number: '4.6',
      marks: 4,
      clues: '- The tangent BC is perpendicular to the radius MB.\n- Find the gradient of MB first.',
      approach: '- Calculate the gradient of MB from M(−6 ; 4) and B(−3 ; 0).\n- Find the gradient of the tangent using the perpendicular relationship.\n- Substitute the gradient and B into the equation of a line.',
      solution: '1. m(MB) = (4 − 0) ÷ (−6 − (−3)) = −4/3\n2. m(BC) = 3/4\n3. 0 = (3/4)(−3) + c, so c = 9/4\n4. ∴ y = (3/4)x + 9/4',
    },
    {
      number: '4.7',
      marks: 2,
      clues: '- C lies on the vertical line through M, so you already know its x-coordinate.\n- C is also on the tangent from 4.6.',
      approach: '- C is on MC, which has equation x = −6.\n- Substitute x = −6 into the equation of BC.',
      solution: '1. x(C) = −6\n2. y(C) = (3/4)(−6) + 9/4 = −9/4\n3. ∴ C(−6 ; −9/4)',
    },
    {
      number: '4.8',
      marks: 4,
      clues: '- Use the gradients of the two tangents to find their angles of inclination.\n- The angle at C is the difference between those angles.',
      approach: '- tan α = 3/4 gives the angle of inclination of BC.\n- AC has gradient −3/4, so its angle of inclination is 180° − α.\n- The angle ACB is the difference of the two inclinations.',
      solution: '1. α = tan⁻¹(3/4) = 36.87°\n2. m(AC) = −3/4, so β = 180° − 36.87° = 143.13°\n3. ACB = β − α = 143.13° − 36.87°\n4. ∴ ACB = 106.26°',
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
