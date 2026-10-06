#!/usr/bin/env node
/**
 * DBE Mathematics P2 — November 2025 — Question 10 (order 10)
 * Euclidean geometry — cyclic quadrilaterals: opposite angles, the converse (proving a quadrilateral
 * is cyclic), matching statements with reasons, and an algebraic angle problem.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-maths-2025-nov-p2-q10.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-maths-2025-nov-p2-q10.js --dry-run
 *   node scripts/add-maths-2025-nov-p2-q10.js
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
  name: 'Question 10',
  syllabus: 'dbe',
  subject: 'maths',
  year: 2025,
  paper: 'nov_p2',
  order: 10,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['cyclic_quadrilateral', 'opposite_angles', 'concyclic_points', 'converse_theorem'],
  question_image_urls: [`${IMG}/q10/question_1.png`],
  memo_image_urls: [`${IMG}/q10/memo_1.png`, `${IMG}/q10/memo_2.png`],
  exam_question_marks: 8,
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
    question: 'ABCD is a cyclic quadrilateral with ∠ABC = 112°. Calculate the size of ∠ADC.',
    metadata: ['∠ADC = ', '[ ]', '°'],
    answer: ['68', '', '', '', ''],
    presentation: 'fitb',
    keyboard_type: 'standard_math',
    type: 'calc',
    unit: 'euclidean_geometry',
    topic: 'circle_geometry',
    subtopic: 'cyclic_quadrilateral',
    skills: ['opposite_angles_cyclic_quad', 'sum_to_180'],
    difficulty: 2,
    exam_weight: 3,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2025,
    paper: 'nov_p2',
    clues: '- ∠ABC and ∠ADC are opposite angles of the quadrilateral.\n- Opposite angles of a cyclic quadrilateral have a fixed sum.',
    supplementary_material: {
      type: 'diagram',
      label: 'Diagram',
      image_urls: ['https://media-dev.askmoreprepmore.app/question_supplementary/maths/2025/nov_p2/q10_1/diagram_1.png'],
    },
  },
  {
    name: 'Question 2',
    question: 'Which one of these is enough to prove that a quadrilateral is cyclic?',
    metadata: [
      'A pair of opposite sides is parallel.',
      'The diagonals of the quadrilateral are equal.',
      'A pair of opposite angles is supplementary.',
      'A pair of adjacent angles is equal.',
      '',
    ],
    answer: ['A pair of opposite angles is supplementary.', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'definition',
    unit: 'euclidean_geometry',
    topic: 'circle_geometry',
    subtopic: 'concyclic_points',
    skills: ['proving_cyclic_quadrilateral', 'identifying_circle_theorems'],
    difficulty: 2,
    exam_weight: 3,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Think about the converse of the theorem about opposite angles of a cyclic quadrilateral.\n- A parallelogram has equal opposite angles, but not every parallelogram is cyclic.',
  },
  {
    name: 'Question 3',
    question: 'A, B, C and D lie on a circle, and AB is a diameter. Match each statement with its reason.',
    metadata: [
      'A - ∠ACB = 90°',
      'B - ∠CAD = ∠CBD, both standing on chord CD',
      'C - ∠ABC + ∠ADC = 180°',
      'D - ∠CBE = ∠ADC, where AB is produced to E',
      '1 - Angle in a semicircle',
      '2 - Angles in the same segment',
      '3 - Opposite angles of a cyclic quadrilateral',
      '4 - Exterior angle of a cyclic quadrilateral',
    ],
    answer: ['A-1', 'B-2', 'C-3', 'D-4'],
    presentation: 'match',
    type: 'definition',
    unit: 'euclidean_geometry',
    topic: 'circle_geometry',
    subtopic: 'cyclic_quadrilateral',
    skills: ['identifying_circle_theorems', 'angle_in_semicircle', 'angles_in_same_segment'],
    difficulty: 3,
    exam_weight: 3,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Decide which statement involves a diameter, which two angles stand on the same chord, and which involves a straight line produced.\n- Each reason is used exactly once.',
    supplementary_material: {
      type: 'diagram',
      label: 'Diagram',
      image_urls: ['https://media-dev.askmoreprepmore.app/question_supplementary/maths/2025/nov_p2/q10_3/diagram_1.png'],
    },
  },
  {
    name: 'Question 4',
    question: 'ABCD is a cyclic quadrilateral with ∠ABC = 3x and ∠ADC = 2x + 20°. Calculate the value of x.',
    metadata: ['x = ', '[ ]'],
    answer: ['32', '', '', '', ''],
    presentation: 'fitb',
    keyboard_type: 'standard_math',
    type: 'calc',
    unit: 'euclidean_geometry',
    topic: 'circle_geometry',
    subtopic: 'cyclic_quadrilateral',
    skills: ['opposite_angles_cyclic_quad', 'solving_equation'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2025,
    paper: 'nov_p2',
    clues: '- ∠ABC and ∠ADC are opposite angles of a cyclic quadrilateral.\n- Write their sum as an equation and solve for x.',
    supplementary_material: {
      type: 'diagram',
      label: 'Diagram',
      image_urls: ['https://media-dev.askmoreprepmore.app/question_supplementary/maths/2025/nov_p2/q10_4/diagram_1.png'],
    },
  },
];

// ─── AI explanation (one entry per real exam sub-question — AIEXP-08) ────────

const aiExplanation = {
  sub_questions: [
    {
      number: '10.1',
      marks: 3,
      clues: '- Use triangle QRV, in which Q̂₂ and the right angle at V are known.\n- Then use the theorem about angles standing on the same chord.',
      approach: '- QT ⊥ SR, so ∠QVR = 90°.\n- In triangle QRV find R̂ with the sum of the angles of a triangle.\n- QTS and R both stand on chord QS, so they are equal.',
      solution: '1. R̂ = 180° − 90° − 35° = 55° (sum of angles of a triangle)\n2. QT̂S = R̂ (angles in the same segment)\n3. ∴ QT̂S = 55°',
    },
    {
      number: '10.2',
      marks: 3,
      clues: '- Use the opposite angles of the cyclic quadrilateral PQRS to find SP̂Q.\n- Show that two co-interior angles are supplementary.',
      approach: '- SP̂Q and R̂ are opposite angles of cyclic quadrilateral PQRS.\n- You are given Ŝ₁ = R̂.\n- If SP̂Q + Ŝ₁ = 180°, the co-interior angles show PQ ∥ SR.',
      solution: '1. SP̂Q = 180° − 55° = 125° (opposite angles of a cyclic quadrilateral)\n2. Ŝ₁ = R̂ = 55° (given)\n3. SP̂Q + Ŝ₁ = 180°\n4. ∴ PQ ∥ SR (co-interior angles are supplementary)',
    },
    {
      number: '10.3',
      marks: 2,
      clues: '- Find an angle subtended by chord PT at the circumference.\n- A chord that subtends 90° is a diameter.',
      approach: '- PQ ∥ SR and QT ⊥ SR, so QT ⊥ PQ.\n- That makes Q̂₁ = 90°, and Q̂₁ stands on chord PT.',
      solution: '1. Q̂₁ = 90° (PQ ∥ SR, QT ⊥ SR, co-interior angles)\n2. ∴ PT is a diameter (converse of angle in a semicircle: the chord subtends 90°)',
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
