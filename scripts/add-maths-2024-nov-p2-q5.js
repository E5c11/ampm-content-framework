#!/usr/bin/env node
/**
 * DBE Mathematics P2 — November 2024 — Question 5 (order 5)
 * Trigonometry — ratios from a point, double-angle and compound-angle formulae, expressing in terms of a given value.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-maths-2024-nov-p2-q5.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-maths-2024-nov-p2-q5.js --dry-run
 *   node scripts/add-maths-2024-nov-p2-q5.js
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
  name: 'Question 5',
  syllabus: 'dbe',
  subject: 'maths',
  year: 2024,
  paper: 'nov_p2',
  order: 5,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['trig_identities', 'double_angle', 'compound_angle', 'reduction_formulae'],
  question_image_urls: [`${IMG}/q5/question_1.png`],
  memo_image_urls: [`${IMG}/q5/memo_1.png`, `${IMG}/q5/memo_2.png`],
  exam_question_marks: 12,
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
    question: 'The point Q(−7 ; 24) lies on the terminal arm of angle θ. Determine, without using a calculator, the value of cos θ as a decimal.',
    metadata: ['cos θ = ', '[ ]'],
    answer: ['-0.28', '', '', '', ''],
    presentation: 'fitb',
    keyboard_type: 'standard_math',
    type: 'calc',
    unit: 'trigonometry',
    topic: 'trig_identities',
    subtopic: 'simplification',
    skills: ['trig_ratios_in_right_triangle', 'quadrant_rule'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2024,
    paper: 'nov_p2',
    clues: '- Find r with r² = x² + y².\n- cos θ = x ÷ r, keeping the sign of x.',
  },
  {
    name: 'Question 2',
    question: 'If sin β = \\frac{5}{13} and 90° < β < 180°, determine the value of cos 2β without using a calculator.',
    metadata: ['−\\frac{119}{169}', '\\frac{120}{169}', '−\\frac{120}{169}', '\\frac{119}{169}', ''],
    answer: ['\\frac{119}{169}', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'calc',
    unit: 'trigonometry',
    topic: 'trig_identities',
    subtopic: 'double_angle',
    skills: ['double_angle_formula', 'cos_double_angle'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2024,
    paper: 'nov_p2',
    clues: '- Choose the form of cos 2β that uses only sin β.\n- Square the fraction before you multiply by 2.',
  },
  {
    name: 'Question 3',
    question: 'Complete the working to find the value of cos(A − B) without using a calculator.',
    metadata: [
      'cos A = 0.8 with 0° < A < 90°, and sin B = −0.8 with 180° < B < 270°',
      'So sin A = 0.6 and cos B = −0.6',
      'cos(A − B) = cos A cos B + sin A sin B',
      '= (0.8)(−0.6) + (0.6)(−0.8), which equals:',
      '[ ]',
    ],
    answer: ['-0.96'],
    presentation: 'steps',
    keyboard_type: 'scientific_math',
    type: 'calc',
    unit: 'trigonometry',
    topic: 'trig_identities',
    subtopic: 'compound_angles',
    skills: ['compound_angle_formula', 'quadrant_rule'],
    difficulty: 3,
    exam_weight: 3,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2024,
    paper: 'nov_p2',
    clues: '- Multiply each pair of brackets, keeping the signs.\n- Then add the two products.',
  },
  {
    name: 'Question 4',
    question: '3cos²(\\frac{x}{2} + 45°) − 3sin²(\\frac{x}{2} + 45°) can be written in terms of p, where sin x = p. Which expression is it?',
    metadata: ['−3p', '3p', '3\\sqrt{1 − p²}', '−3\\sqrt{1 − p²}', ''],
    answer: ['−3p', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'calc',
    unit: 'trigonometry',
    topic: 'trig_identities',
    subtopic: 'simplification',
    skills: ['cos_double_angle', 'co_function_identity', 'expressing_in_terms_of_given_value'],
    difficulty: 4,
    exam_weight: 3,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2024,
    paper: 'nov_p2',
    clues: '- Factor out 3 and recognise cos²A − sin²A as a double-angle formula.\n- Double the angle, then use a reduction formula for cos(90° + x).',
  },
];

// ─── AI explanation (one entry per real exam sub-question — AIEXP-08) ────────

const aiExplanation = {
  sub_questions: [
    {
      number: '5.1.1',
      marks: 2,
      clues: '- Use the coordinates of P to find r.\n- cos A = x ÷ r.',
      approach: '- r² = (−3)² + (−4)², so r = 5.\n- cos A = x ÷ r with x = −3.',
      solution: '1. r = √(9 + 16) = 5\n2. ∴ cos A = −3/5',
    },
    {
      number: '5.1.2',
      marks: 2,
      clues: '- Use a double-angle formula for cos 2A.\n- The form 2cos²A − 1 needs only cos A from 5.1.1.',
      approach: '- cos 2A = 2cos²A − 1.\n- Substitute cos A = −3/5.',
      solution: '1. cos 2A = 2(−3/5)² − 1\n2. = 18/25 − 1\n3. ∴ cos 2A = −7/25',
    },
    {
      number: '5.1.3',
      marks: 4,
      clues: '- sin B is positive and B lies between 90° and 360°, so B is in the second quadrant.\n- Find cos B, then use the compound-angle formula for sin(A − B).',
      approach: '- In the second quadrant with y = 4 and r = 5, x = −3, so cos B = −3/5.\n- From P, sin A = −4/5 and cos A = −3/5.\n- sin(A − B) = sin A cos B − cos A sin B.',
      solution: '1. x = −3, so cos B = −3/5\n2. sin(A − B) = (−4/5)(−3/5) − (−3/5)(4/5)\n3. = 12/25 + 12/25\n4. ∴ sin(A − B) = 24/25',
    },
    {
      number: '5.2',
      marks: 4,
      clues: '- Multiply the top and the bottom by 2 to create 2 sin θ cos θ.\n- Use the double-angle formula, then a co-function (reduction) formula.',
      approach: '- 2cos(α/2 − 45°)sin(α/2 − 45°) = sin(α − 90°).\n- sin(α − 90°) = −cos α.\n- Divide by 4 and substitute cos α = p.',
      solution: '1. Expression = 2cos(α/2 − 45°)sin(α/2 − 45°) ÷ 4\n2. = sin(α − 90°) ÷ 4\n3. = −cos α ÷ 4\n4. ∴ = −p/4',
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
