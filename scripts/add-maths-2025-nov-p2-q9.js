#!/usr/bin/env node
/**
 * DBE Mathematics P2 — November 2025 — Question 9 (order 9)
 * Euclidean geometry — circle theorems: proving the opposite angles of a cyclic quadrilateral are
 * supplementary, angle at the centre, isosceles triangle in a circle, and a tangent with a diameter.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-maths-2025-nov-p2-q9.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-maths-2025-nov-p2-q9.js --dry-run
 *   node scripts/add-maths-2025-nov-p2-q9.js
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
  name: 'Question 9',
  syllabus: 'dbe',
  subject: 'maths',
  year: 2025,
  paper: 'nov_p2',
  order: 9,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['angle_at_centre', 'tangent', 'proof', 'isosceles_triangle'],
  question_image_urls: [`${IMG}/q9/question_1.png`, `${IMG}/q9/question_2.png`],
  memo_image_urls: [`${IMG}/q9/memo_1.png`, `${IMG}/q9/memo_2.png`],
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
    question: 'O is the centre of a circle, and A and B are points on the circle. ∠OAB = 35°. Calculate the size of ∠AOB.',
    metadata: ['∠AOB = ', '[ ]', '°'],
    answer: ['110', '', '', '', ''],
    presentation: 'fitb',
    keyboard_type: 'standard_math',
    type: 'calc',
    unit: 'euclidean_geometry',
    topic: 'circle_geometry',
    subtopic: 'angle_at_centre',
    skills: ['isosceles_triangle_base_angles', 'sum_to_180'],
    difficulty: 2,
    exam_weight: 3,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2025,
    paper: 'nov_p2',
    clues: '- OA and OB are both radii of the circle, so triangle OAB is special.\n- The angles of a triangle add up to 180°.',
  },
  {
    name: 'Question 2',
    question: 'XY is a tangent to a circle with centre O, touching the circle at X. Which statement is correct?',
    metadata: [
      '∠OXY = 90° because the angle at the centre is twice the angle at the circumference.',
      '∠OXY = 90° because a tangent is perpendicular to the radius at the point of contact.',
      '∠OXY = 45° because a tangent bisects the radius at the point of contact.',
      '∠OXY = 180° because a tangent is a straight line.',
      '',
    ],
    answer: ['∠OXY = 90° because a tangent is perpendicular to the radius at the point of contact.', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'definition',
    unit: 'euclidean_geometry',
    topic: 'circle_geometry',
    subtopic: 'tangent_chord_angle',
    skills: ['tangent_radius_perpendicular', 'identifying_circle_theorems'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Think about the angle between a tangent and the line from the centre to the point where it touches.\n- Check that the reason given really belongs to that theorem.',
  },
  {
    name: 'Question 3',
    question: 'ABCD is a cyclic quadrilateral with centre O. These steps prove that B̂ + D̂ = 180°, but are in the wrong order. Arrange them correctly.',
    metadata: [
      'Obtuse AÔC + reflex AÔC = 360° (∠s around a point)',
      'Reflex AÔC = 2D̂ (∠ at centre = 2 × ∠ at circumference)',
      'So 2B̂ + 2D̂ = 360°, therefore B̂ + D̂ = 180°',
      'Join O to A and to C',
      'Obtuse AÔC = 2B̂ (∠ at centre = 2 × ∠ at circumference)',
    ],
    answer: [
      'Join O to A and to C',
      'Obtuse AÔC = 2B̂ (∠ at centre = 2 × ∠ at circumference)',
      'Reflex AÔC = 2D̂ (∠ at centre = 2 × ∠ at circumference)',
      'Obtuse AÔC + reflex AÔC = 360° (∠s around a point)',
      'So 2B̂ + 2D̂ = 360°, therefore B̂ + D̂ = 180°',
    ],
    presentation: 'ordering',
    type: 'proof',
    unit: 'euclidean_geometry',
    topic: 'circle_geometry',
    subtopic: 'proof',
    skills: ['proof_construction', 'logical_proof_ordering', 'angle_at_centre_twice_circumference'],
    difficulty: 4,
    exam_weight: 3,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2025,
    paper: 'nov_p2',
    clues: '- A proof starts with the construction, and each statement uses a theorem about the centre.\n- The two angles at the centre form a full turn.',
  },
  {
    name: 'Question 4',
    question: 'XOY is a diameter of a circle with centre O. YZ is a tangent to the circle at Y, and OZ cuts the circle at W. ∠WXY = 24°. Calculate the size of ∠Z.',
    metadata: ['∠Z = ', '[ ]', '°'],
    answer: ['42', '', '', '', ''],
    presentation: 'fitb',
    keyboard_type: 'standard_math',
    type: 'calc',
    unit: 'euclidean_geometry',
    topic: 'circle_geometry',
    subtopic: 'angle_at_centre',
    skills: ['angle_at_centre_twice_circumference', 'tangent_radius_perpendicular', 'sum_to_180'],
    difficulty: 4,
    exam_weight: 3,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2025,
    paper: 'nov_p2',
    clues: '- First find the angle at the centre that stands on the same arc as the 24° angle.\n- Then use the right angle between the tangent and the diameter in triangle OYZ.',
  },
];

// ─── AI explanation (one entry per real exam sub-question — AIEXP-08) ────────

const aiExplanation = {
  sub_questions: [
    {
      number: '9.1',
      marks: 5,
      clues: '- Start with a construction that joins K to the centre and extends it.\n- Use the exterior angle of a triangle, together with isosceles triangles formed by radii.',
      approach: '- Draw KO and produce it past O.\n- In triangle KOT, the exterior angle Ô₁ equals K̂₁ + T̂, and K̂₁ = T̂ because OK = OT (radii).\n- Do the same in triangle KOP for Ô₂.\n- Add the two results.',
      solution: '1. Construction: draw KO and produce it\n2. Ô₁ = K̂₁ + T̂ (exterior angle of a triangle), and K̂₁ = T̂ (angles opposite equal radii), so Ô₁ = 2K̂₁\n3. Ô₂ = K̂₂ + P̂ (exterior angle of a triangle), and K̂₂ = P̂, so Ô₂ = 2K̂₂\n4. Ô₁ + Ô₂ = 2K̂₁ + 2K̂₂ = 2(K̂₁ + K̂₂)\n5. ∴ TÔP = 2TK̂P',
    },
    {
      number: '9.2.1',
      marks: 2,
      clues: '- Find the angle at the circumference that stands on the same arc as Ô₂.\n- Use the theorem relating the angle at the centre and at the circumference.',
      approach: '- The 32° angle at P stands on arc LF.\n- Ô₂ is the angle at the centre on the same arc.',
      solution: '1. Ô₂ = 2 × P̂ (∠ at centre = 2 × ∠ at circumference)\n2. = 2 × 32°\n3. = 64°',
    },
    {
      number: '9.2.2',
      marks: 3,
      clues: '- MF is a tangent and OF is a radius.\n- Use triangle OFM and the sum of the angles of a triangle.',
      approach: '- The tangent MF is perpendicular to the radius OF, so ∠OFM = 90°.\n- Ô₂ = 64° from 9.2.1 is an angle of triangle OFM.\n- Subtract both from 180° to find M̂.',
      solution: '1. ∠OFM = 90° (tangent ⊥ radius)\n2. M̂ = 180° − 90° − 64° (sum of angles of a triangle)\n3. ∴ M̂ = 26°',
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
