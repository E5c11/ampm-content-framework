#!/usr/bin/env node
/**
 * DBE Mathematics P2 — November 2024 — Question 9 (order 9)
 * Euclidean geometry — exterior angle and opposite angles of a cyclic quadrilateral, sides opposite equal angles.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-maths-2024-nov-p2-q9.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-maths-2024-nov-p2-q9.js --dry-run
 *   node scripts/add-maths-2024-nov-p2-q9.js
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
  name: 'Question 9',
  syllabus: 'dbe',
  subject: 'maths',
  year: 2024,
  paper: 'nov_p2',
  order: 9,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['cyclic_quadrilateral', 'exterior_angle', 'isosceles_triangle'],
  question_image_urls: [`${IMG}/q9/question_1.png`],
  memo_image_urls: [`${IMG}/q9/memo_1.png`],
  exam_question_marks: 6,
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
    question: 'PQRS is a cyclic quadrilateral. Side QR is produced to T, and ∠SRT = 77°. Calculate ∠QPS.',
    metadata: ['∠QPS = ', '[ ]', '°'],
    answer: ['77', '', '', '', ''],
    presentation: 'fitb',
    keyboard_type: 'standard_math',
    type: 'calc',
    unit: 'euclidean_geometry',
    topic: 'circle_geometry',
    subtopic: 'cyclic_quadrilateral',
    skills: ['exterior_angle_cyclic_quad'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2024,
    paper: 'nov_p2',
    clues: '- ∠SRT is an exterior angle of the cyclic quadrilateral.\n- An exterior angle of a cyclic quadrilateral equals the interior opposite angle.',
    supplementary_material: {
      type: 'diagram',
      label: 'Diagram',
      image_urls: ['https://media-dev.askmoreprepmore.app/question_supplementary/maths/2024/nov_p2/q9_1/diagram_1.png'],
    },
  },
  {
    name: 'Question 2',
    question: 'In △ABC, Â = Ĉ. Which conclusion, with its reason, is correct?',
    metadata: [
      'AB = AC (sides opposite equal angles)',
      'AC = BC (sides opposite equal angles)',
      'AB = BC (sides opposite equal angles)',
      'AB = BC (angles opposite equal sides)',
      '',
    ],
    answer: ['AB = BC (sides opposite equal angles)', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'definition',
    unit: 'euclidean_geometry',
    topic: 'circle_geometry',
    subtopic: 'proof',
    skills: ['isosceles_triangle'],
    difficulty: 2,
    exam_weight: 1,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2024,
    paper: 'nov_p2',
    clues: '- The side opposite Â does not touch A; the same holds for Ĉ.\n- The reason must go from equal angles to equal sides.',
  },
  {
    name: 'Question 3',
    question: 'ABCD is a cyclic quadrilateral with ∠ABC = 64° and ∠DAC = 32°. Arrange the steps that prove AD = DC.',
    metadata: [
      'DĈA = DÂC, so △ADC has two equal angles',
      'AD = DC (sides opposite equal angles)',
      'AD̂C = 180° − 64° = 116° (opposite angles of a cyclic quadrilateral)',
      'DĈA = 180° − 116° − 32° = 32° (sum of the angles of a triangle)',
    ],
    answer: [
      'AD̂C = 180° − 64° = 116° (opposite angles of a cyclic quadrilateral)',
      'DĈA = 180° − 116° − 32° = 32° (sum of the angles of a triangle)',
      'DĈA = DÂC, so △ADC has two equal angles',
      'AD = DC (sides opposite equal angles)',
    ],
    presentation: 'ordering',
    type: 'proof',
    unit: 'euclidean_geometry',
    topic: 'circle_geometry',
    subtopic: 'cyclic_quadrilateral',
    skills: ['opposite_angles_cyclic_quad', 'isosceles_triangle', 'logical_proof_ordering'],
    difficulty: 3,
    exam_weight: 3,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2024,
    paper: 'nov_p2',
    clues: '- The angle at D can be found from the given angle at B straight away.\n- The conclusion about the sides comes last.',
    supplementary_material: {
      type: 'diagram',
      label: 'Diagram',
      image_urls: ['https://media-dev.askmoreprepmore.app/question_supplementary/maths/2024/nov_p2/q9_3/diagram_1.png'],
    },
  },
  {
    name: 'Question 4',
    question: 'A, B, C and D lie on a circle, and the chords AC and BD are drawn. If ∠BAC = 2x + 5° and ∠BDC = 3x − 25°, calculate the value of x.',
    metadata: ['x = ', '[ ]', '°'],
    answer: ['30', '', '', '', ''],
    presentation: 'fitb',
    keyboard_type: 'standard_math',
    type: 'calc',
    unit: 'euclidean_geometry',
    topic: 'circle_geometry',
    subtopic: 'cyclic_quadrilateral',
    skills: ['angles_in_same_segment', 'solving_equation'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2024,
    paper: 'nov_p2',
    clues: '- Both angles stand on the same chord BC.\n- Set them equal and solve for x.',
    supplementary_material: {
      type: 'diagram',
      label: 'Diagram',
      image_urls: ['https://media-dev.askmoreprepmore.app/question_supplementary/maths/2024/nov_p2/q9_4b/diagram_1.png'],
    },
  },
];

// ─── AI explanation (one entry per real exam sub-question — AIEXP-08) ────────

const aiExplanation = {
  sub_questions: [
    {
      number: '9.1',
      marks: 2,
      clues: '- Ĉ₁ is an exterior angle of the cyclic quadrilateral ABCD.\n- It equals the interior opposite angle at A, which is Â₁ + Â₂.',
      approach: '- DÂB = Ĉ₁ = 86° (exterior angle of a cyclic quadrilateral).\n- Subtract Â₂ = 46°.',
      solution: '1. Â₁ + Â₂ = 86° (ext. ∠ of cyclic quad)\n2. Â₁ = 86° − 46°\n3. ∴ Â₁ = 40°',
    },
    {
      number: '9.2',
      marks: 4,
      clues: '- Use Â₁ = ½B̂ to find B̂, then the opposite angle D̂.\n- Find Ĉ₂ in △ADC and compare it with Â₁.',
      approach: '- B̂ = 2 × 40° = 80°.\n- D̂ = 180° − 80° = 100° (opposite angles of a cyclic quadrilateral).\n- In △ADC, Ĉ₂ = 180° − 100° − 40° = 40° = Â₁, so the sides opposite these angles are equal.',
      solution: '1. B̂ = 80° (Â₁ = ½B̂)\n2. D̂ = 100° (opp. ∠s of cyclic quad)\n3. Ĉ₂ = 40° (sum of ∠s in △)\n4. Ĉ₂ = Â₁ = 40°\n5. ∴ AD = DC (sides opp. equal ∠s)',
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
