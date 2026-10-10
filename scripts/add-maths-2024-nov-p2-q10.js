#!/usr/bin/env node
/**
 * DBE Mathematics P2 — November 2024 — Question 10 (order 10)
 * Euclidean geometry — proof of the proportionality theorem, line from centre perpendicular to chord, midpoint theorem.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-maths-2024-nov-p2-q10.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-maths-2024-nov-p2-q10.js --dry-run
 *   node scripts/add-maths-2024-nov-p2-q10.js
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
  name: 'Question 10',
  syllabus: 'dbe',
  subject: 'maths',
  year: 2024,
  paper: 'nov_p2',
  order: 10,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['proportionality_theorem', 'proportionality', 'midpoint_theorem', 'circle_theorems'],
  question_image_urls: [`${IMG}/q10/question_1.png`],
  memo_image_urls: [`${IMG}/q10/memo_1.png`, `${IMG}/q10/memo_2.png`, `${IMG}/q10/memo_3.png`],
  exam_question_marks: 15,
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
    question: 'Arrange the steps that prove \\frac{PS}{SQ} = \\frac{PT}{TR} in △PQR, where S lies on PQ, T lies on PR and ST ∥ QR.',
    metadata: [
      'Therefore PS ÷ SQ = PT ÷ TR',
      'Area △PST ÷ area △SQT = PS ÷ SQ, and area △PST ÷ area △TRS = PT ÷ TR (equal heights)',
      'Join SR and QT, and draw the heights of △PST from T and from S',
      'So area △PST ÷ area △SQT = area △PST ÷ area △TRS, because △SQT and △TRS have the same base ST and lie between the parallel lines',
    ],
    answer: [
      'Join SR and QT, and draw the heights of △PST from T and from S',
      'Area △PST ÷ area △SQT = PS ÷ SQ, and area △PST ÷ area △TRS = PT ÷ TR (equal heights)',
      'So area △PST ÷ area △SQT = area △PST ÷ area △TRS, because △SQT and △TRS have the same base ST and lie between the parallel lines',
      'Therefore PS ÷ SQ = PT ÷ TR',
    ],
    presentation: 'ordering',
    type: 'proof',
    unit: 'euclidean_geometry',
    topic: 'proportionality',
    subtopic: 'proportionality_theorem',
    skills: ['proof_construction', 'area_method', 'logical_proof_ordering'],
    difficulty: 4,
    exam_weight: 3,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2024,
    paper: 'nov_p2',
    clues: '- A proof by areas starts with its construction.\n- The two area ratios must be written down before you can show they are equal.',
    supplementary_material: {
      type: 'diagram',
      label: 'Diagram',
      image_urls: ['https://media-dev.askmoreprepmore.app/question_supplementary/maths/2024/nov_p2/q10_1/diagram_1.png'],
    },
  },
  {
    name: 'Question 2',
    question: 'In △KLM, N lies on KL and P lies on KM with NP ∥ LM. If KN = 8, NL = 6 and KP = 12, calculate PM.',
    metadata: ['PM = ', '[ ]'],
    answer: ['9', '', '', '', ''],
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
    order: 2,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2024,
    paper: 'nov_p2',
    clues: '- A line parallel to one side of a triangle divides the other two sides in the same ratio.\n- Write KN ÷ NL = KP ÷ PM and solve.',
    supplementary_material: {
      type: 'diagram',
      label: 'Diagram',
      image_urls: ['https://media-dev.askmoreprepmore.app/question_supplementary/maths/2024/nov_p2/q10_2/diagram_1.png'],
    },
  },
  {
    name: 'Question 3',
    question: 'O is the centre of a circle, and OM ⊥ chord AB with M on AB. Which statement, with its reason, is correct?',
    metadata: [
      'OM = MB (line from centre ⊥ to chord)',
      'AM = OM (line from centre ⊥ to chord)',
      'AM = MB (tangent ⊥ radius)',
      'AM = MB (line from centre ⊥ to chord)',
      '',
    ],
    answer: ['AM = MB (line from centre ⊥ to chord)', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'definition',
    unit: 'euclidean_geometry',
    topic: 'circle_geometry',
    subtopic: 'perpendicular_from_centre',
    skills: ['perpendicular_from_centre_bisects_chord'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2024,
    paper: 'nov_p2',
    clues: '- A perpendicular from the centre to a chord bisects the chord.\n- AB is a chord, not a tangent.',
    supplementary_material: {
      type: 'diagram',
      label: 'Diagram',
      image_urls: ['https://media-dev.askmoreprepmore.app/question_supplementary/maths/2024/nov_p2/q10_3/diagram_1.png'],
    },
  },
  {
    name: 'Question 4',
    question: 'In △ABC, M is the midpoint of AB and N is the midpoint of AC. If MN = 7.5 units, calculate BC.',
    metadata: ['BC = ', '[ ]', ' units'],
    answer: ['15', '', '', '', ''],
    presentation: 'fitb',
    keyboard_type: 'standard_math',
    type: 'calc',
    unit: 'euclidean_geometry',
    topic: 'proportionality',
    subtopic: 'midpoint_theorem',
    skills: ['midpoint_theorem'],
    difficulty: 1,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2024,
    paper: 'nov_p2',
    clues: '- The line joining the midpoints of two sides is parallel to the third side.\n- It is also half as long as the third side.',
    supplementary_material: {
      type: 'diagram',
      label: 'Diagram',
      image_urls: ['https://media-dev.askmoreprepmore.app/question_supplementary/maths/2024/nov_p2/q10_4/diagram_1.png'],
    },
  },
];

// ─── AI explanation (one entry per real exam sub-question — AIEXP-08) ────────

const aiExplanation = {
  sub_questions: [
    {
      number: '10.1',
      marks: 6,
      clues: '- Construction: join SB and TA, and draw the heights h₁ from B ⊥ AR and h₂ from A ⊥ RB.\n- Compare the areas of △RAB, △ASB and △ABT.',
      approach: '- Area △RAB ÷ area △ASB = RA ÷ AS (same height h₁).\n- Area △RAB ÷ area △ABT = RB ÷ BT (same height h₂).\n- Area △ASB = area △ABT (same base AB, between the parallel lines AB and ST).',
      solution: '1. Area △RAB ÷ area △ASB = (½·RA·h₁) ÷ (½·AS·h₁) = RA ÷ AS\n2. Area △RAB ÷ area △ABT = (½·RB·h₂) ÷ (½·BT·h₂) = RB ÷ BT\n3. Area △ASB = area △ABT (same base and height; AB ∥ ST)\n4. ∴ area △RAB ÷ area △ASB = area △RAB ÷ area △ABT\n5. ∴ RA ÷ AS = RB ÷ BT',
    },
    {
      number: '10.2.1',
      marks: 5,
      clues: '- OR ⊥ PS, so R is the midpoint of PS.\n- O is the midpoint of PW, so use the midpoint theorem in △PWS.',
      approach: '- PR = RS (line from centre ⊥ to chord).\n- PO = OW (radii).\n- In △PWS, OR joins the midpoints of two sides, so OR = ½WS.',
      solution: '1. PR = RS (line from centre ⊥ to chord)\n2. PO = OW (radii)\n3. OR = ½WS (midpoint theorem)\n4. ∴ OR : WS = 1 : 2',
    },
    {
      number: '10.2.2',
      marks: 4,
      clues: '- From 10.2.1, OR ∥ SW, so use the proportionality theorem in △ORT with OV : VT.\n- Then use PR = RS.',
      approach: '- OV : OT = 1 : 4, so OV : VT = 1 : 3.\n- SV ∥ RO, so RS ÷ ST = OV ÷ VT = 1/3, giving RS = 5.\n- PR = RS = 5, so PT = PR + RS + ST.',
      solution: '1. RS ÷ ST = OV ÷ VT = 1/3 (line ∥ one side of △; RO ∥ SW)\n2. RS ÷ 15 = 1/3, so RS = 5 units\n3. PR = RS = 5 units (line from centre ⊥ to chord)\n4. ∴ PT = 5 + 5 + 15 = 25 units',
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
