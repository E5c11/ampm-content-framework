#!/usr/bin/env node
/**
 * DBE Mathematics P2 — November 2025 — Question 11 (order 11)
 * Euclidean geometry — proportionality and similarity: the proportionality theorem, the reason for it,
 * ratio of areas of similar triangles, and the steps for proving triangles similar.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-maths-2025-nov-p2-q11.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-maths-2025-nov-p2-q11.js --dry-run
 *   node scripts/add-maths-2025-nov-p2-q11.js
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
  name: 'Question 11',
  syllabus: 'dbe',
  subject: 'maths',
  year: 2025,
  paper: 'nov_p2',
  order: 11,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: [
    'proportionality_theorem',
    'similar_triangles',
    'AA_similarity',
    'tangent_chord_angle',
    'area_of_triangle',
  ],
  question_image_urls: [`${IMG}/q11/question_1.png`, `${IMG}/q11/question_2.png`],
  memo_image_urls: [
    `${IMG}/q11/memo_1.png`,
    `${IMG}/q11/memo_2.png`,
    `${IMG}/q11/memo_3.png`,
    `${IMG}/q11/memo_4.png`,
  ],
  exam_question_marks: 23,
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
    question: 'In △ABC, D is on AB and E is on AC such that DE ∥ BC. AD = 6 cm, DB = 4 cm and AE = 9 cm. Calculate the length of EC.',
    metadata: ['EC = ', '[ ]', ' cm'],
    answer: ['6', '', '', '', ''],
    presentation: 'fitb',
    keyboard_type: 'standard_math',
    type: 'calc',
    unit: 'euclidean_geometry',
    topic: 'proportionality',
    subtopic: 'proportionality_theorem',
    skills: ['applying_proportionality_theorem', 'setting_up_proportion'],
    difficulty: 2,
    exam_weight: 3,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2025,
    paper: 'nov_p2',
    clues: '- A line parallel to one side of a triangle divides the other two sides in the same ratio.\n- Write the ratio of the segments on AB equal to the ratio of the segments on AC.',
    supplementary_material: {
      type: 'diagram',
      label: 'Diagram',
      image_urls: ['https://media-dev.askmoreprepmore.app/question_supplementary/maths/2025/nov_p2/q11_1/diagram_1.png'],
    },
  },
  {
    name: 'Question 2',
    question: 'In △PQR, S is on PQ and T is on PR such that ST ∥ QR. Which reason justifies PS ÷ SQ = PT ÷ TR?',
    metadata: [
      'Angles in the same segment',
      'Tangent-chord theorem',
      'A line parallel to one side of a triangle divides the other two sides proportionally',
      'The midpoint theorem',
      '',
    ],
    answer: ['A line parallel to one side of a triangle divides the other two sides proportionally', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'definition',
    unit: 'euclidean_geometry',
    topic: 'proportionality',
    subtopic: 'proportionality_theorem',
    skills: ['stating_proportionality_theorem', 'identifying_circle_theorems'],
    difficulty: 2,
    exam_weight: 3,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2025,
    paper: 'nov_p2',
    clues: '- The statement compares ratios of lengths on two sides of a triangle.\n- The condition that makes this possible is a parallel line.',
    supplementary_material: {
      type: 'diagram',
      label: 'Diagram',
      image_urls: ['https://media-dev.askmoreprepmore.app/question_supplementary/maths/2025/nov_p2/q11_2/diagram_1.png'],
    },
  },
  {
    name: 'Question 3',
    question: '△ABC ||| △PQR and AB ÷ PQ = 3 ÷ 5. The area of △ABC is 27 cm². Calculate the area of △PQR.',
    metadata: ['Area = ', '[ ]', ' cm²'],
    answer: ['75', '', '', '', ''],
    presentation: 'fitb',
    keyboard_type: 'standard_math',
    type: 'calc',
    unit: 'euclidean_geometry',
    topic: 'similarity',
    subtopic: 'similar_triangles_ratio',
    skills: ['proportion_from_similarity', 'ratio_of_sides'],
    difficulty: 3,
    exam_weight: 3,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2025,
    paper: 'nov_p2',
    clues: '- The ratio of the areas of similar triangles is the square of the ratio of their sides.\n- Set up a proportion for the area of △PQR.',
    supplementary_material: {
      type: 'diagram',
      label: 'Diagram',
      image_urls: ['https://media-dev.askmoreprepmore.app/question_supplementary/maths/2025/nov_p2/q11_3/diagram_1.png'],
    },
  },
  {
    name: 'Question 4',
    question: 'These steps prove that two triangles, △ABC and △DEF, are similar. Arrange them in the correct order.',
    metadata: [
      'Conclude that △ABC ||| △DEF (∠∠∠)',
      'State the second pair of equal angles with a reason',
      'State the first pair of equal angles with a reason',
      'Use the sum of the angles of a triangle to show the third pair is equal',
    ],
    answer: [
      'State the first pair of equal angles with a reason',
      'State the second pair of equal angles with a reason',
      'Use the sum of the angles of a triangle to show the third pair is equal',
      'Conclude that △ABC ||| △DEF (∠∠∠)',
    ],
    presentation: 'ordering',
    type: 'proof',
    unit: 'euclidean_geometry',
    topic: 'similarity',
    subtopic: 'conditions_for_similarity',
    skills: ['AA_similarity', 'logical_proof_ordering', 'identifying_similarity_conditions'],
    difficulty: 3,
    exam_weight: 3,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Equal angles come before the conclusion, and each one needs a reason.\n- The third pair of angles follows from the first two.',
  },
];

// ─── AI explanation (one entry per real exam sub-question — AIEXP-08) ────────

const aiExplanation = {
  sub_questions: [
    {
      number: '11.1.1',
      marks: 2,
      clues: '- Look for the triangle that has AD and EF as parallel lines.\n- Write the proportion using the theorem about a line parallel to one side of a triangle.',
      approach: '- In triangle CAD, line GF is parallel to AD (because EF ∥ AD).\n- So the sides CD and CA are divided in the same ratio.\n- Use CG ÷ GA = 3 ÷ 2, then take the reciprocal.',
      solution: '1. FD ÷ CF = GA ÷ CG (line parallel to one side of a triangle)\n2. GA ÷ CG = 2 ÷ 3\n3. ∴ FD ÷ CF = 2/3',
    },
    {
      number: '11.1.2',
      marks: 4,
      clues: '- Give CF and FB convenient lengths such as 2x and 5x, and find FD from 11.1.1.\n- Then use the proportionality theorem in the triangle with sides BA, BD and a line parallel to EF.',
      approach: '- CF = 2x and FB = 5x. From 11.1.1, FD = (2/3)(2x) = 4x/3.\n- BD = FB − FD.\n- In triangle BEF, AD ∥ EF, so BA ÷ EA = BD ÷ FD.',
      solution: '1. FD = (2/3) × 2x = 4x/3\n2. BD = 5x − 4x/3 = 11x/3\n3. BA ÷ EA = BD ÷ FD (line parallel to one side of a triangle)\n4. = (11x/3) ÷ (4x/3)\n5. ∴ BA ÷ EA = 11/4',
    },
    {
      number: '11.1.3',
      marks: 4,
      clues: '- Write both areas using ½ab sin C, with the angle at C common to both triangles.\n- GFDA is triangle CDA with triangle GCF removed.',
      approach: '- From CG ÷ GA = 3 ÷ 2, take CG = 3k and CA = 5k. From 11.1.1, take CF = 3p and CD = 5p.\n- Area of △GCF = ½(3k)(3p) sin C and area of △CDA = ½(5k)(5p) sin C.\n- Area of GFDA = area of △CDA − area of △GCF; then simplify the ratio.',
      solution: '1. Area of GFDA = area of △CDA − area of △GCF\n2. = ½(5k)(5p) sin C − ½(3k)(3p) sin C\n3. = ½ sin C (25kp − 9kp)\n4. Ratio = ½(9kp) sin C ÷ ½ sin C(16kp)\n5. ∴ ratio = 9/16',
    },
    {
      number: '11.2.1',
      marks: 2,
      clues: '- Find the triangle in which PQ and WE are parallel.\n- Write the proportion that involves QE, QR, PW and PR, then make PR the subject.',
      approach: '- In triangle PRQ, WE ∥ PQ, so the sides RQ and RP are divided in the same ratio.\n- Write QE ÷ QR = PW ÷ PR.\n- Rearrange for PR.',
      solution: '1. QE ÷ QR = PW ÷ PR (line parallel to one side of a triangle)\n2. ∴ PR = (PW × QR) ÷ QE',
    },
    {
      number: '11.2.2',
      marks: 1,
      clues: '- Corresponding sides of similar triangles are in proportion.\n- Match the sides that contain QP and QZ.',
      approach: '- From △PQZ ||| △RQP, write the ratio of corresponding sides.\n- Cross-multiply to get an equation with PQ².',
      solution: '1. PQ ÷ RQ = QZ ÷ QP (△PQZ ||| △RQP)\n2. ∴ PQ² = RQ × QZ',
    },
    {
      number: '11.2.3',
      marks: 3,
      clues: '- Look for a common angle and for an angle formed by the tangent and a chord.\n- Use the sum of the angles of a triangle for the third angle.',
      approach: '- Q̂₂ is common to both triangles.\n- Ŝ₁ = R̂₂ by the tangent-chord theorem.\n- The third angles are then equal.',
      solution: '1. Q̂₂ = Q̂₂ (common angle)\n2. Ŝ₁ = R̂₂ (tangent-chord theorem)\n3. Ẑ₁ = QŜR (third angle of a triangle)\n4. ∴ △QSZ ||| △QRS (∠∠∠)',
    },
    {
      number: '11.2.4',
      marks: 3,
      clues: '- Use the similar triangles from 11.2.3 to write a proportion.\n- Compare the result with the equation from 11.2.2.',
      approach: '- Write QS ÷ QR = QZ ÷ QS and cross-multiply.\n- Both QS² and PQ² equal the same product, so they are equal.',
      solution: '1. QS ÷ QR = QZ ÷ QS (△QSZ ||| △QRS)\n2. QS² = QZ × QR\n3. PQ² = RQ × QZ (11.2.2)\n4. ∴ PQ = QS',
    },
    {
      number: '11.2.5',
      marks: 4,
      clues: '- Use the similar triangles in 11.2.2 to find another expression for PR.\n- Equate it to the expression from 11.2.1 and use PQ = √(RQ × QZ).',
      approach: '- From PQ ÷ RQ = PZ ÷ PR, make PR the subject.\n- Equate this to PR = (PW × QR) ÷ QE from 11.2.1 and solve for PW.\n- Replace PQ by √(RQ × QZ), from 11.2.2.',
      solution: '1. PR = (QR × PZ) ÷ PQ\n2. (PW × QR) ÷ QE = (QR × PZ) ÷ PQ (11.2.1)\n3. PW = (QE × PZ) ÷ PQ\n4. PQ = √(RQ × QZ) (11.2.2)\n5. ∴ PW = (QE × PZ) ÷ √(QR × QZ)',
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
