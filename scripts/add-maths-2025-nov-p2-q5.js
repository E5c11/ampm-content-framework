#!/usr/bin/env node
/**
 * DBE Mathematics P2 — November 2025 — Question 5 (order 5)
 * Trigonometry — ratios in terms of a given value, double-angle simplification, reduction formulae
 * and the domain for which a square root of a trig expression is real.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-maths-2025-nov-p2-q5.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-maths-2025-nov-p2-q5.js --dry-run
 *   node scripts/add-maths-2025-nov-p2-q5.js
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
  name: 'Question 5',
  syllabus: 'dbe',
  subject: 'maths',
  year: 2025,
  paper: 'nov_p2',
  order: 5,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['trig_identities', 'double_angle', 'compound_angle', 'reduction_formulae'],
  question_image_urls: [`${IMG}/q5/question_1.png`],
  memo_image_urls: [`${IMG}/q5/memo_1.png`, `${IMG}/q5/memo_2.png`],
  exam_question_marks: 17,
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
    question: 'It is given that tan 35° = k. Which expression is equal to cos 55°?',
    metadata: ['\\frac{1}{\\sqrt{k^2+1}}', '\\frac{k}{\\sqrt{k^2+1}}', '\\sqrt{k^2+1}', '\\frac{k}{1-k^2}', ''],
    answer: ['\\frac{k}{\\sqrt{k^2+1}}', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'calc',
    unit: 'trigonometry',
    topic: 'trig_identities',
    subtopic: 'simplification',
    skills: ['expressing_in_terms_of_given_value', 'co_function_identity', 'trig_ratios_in_right_triangle'],
    difficulty: 3,
    exam_weight: 3,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Draw a right-angled triangle in which tan 35° = k and find the third side with Pythagoras.\n- cos 55° is a co-function of another angle in that triangle.',
  },
  {
    name: 'Question 2',
    question: 'Simplify 2 sin 18° cos 18° ÷ (1 − 2 sin² 18°) to a single trigonometric ratio of a single angle. Type it as the ratio name followed by the angle, with no spaces.',
    metadata: ['Answer: ', '[ ]'],
    answer: ['tan36°', '', '', '', ''],
    presentation: 'fitb',
    keyboard_type: 'scientific_math',
    type: 'calc',
    unit: 'trigonometry',
    topic: 'trig_identities',
    subtopic: 'double_angle',
    skills: ['double_angle_formula', 'cos_double_angle', 'quotient_identity'],
    difficulty: 3,
    exam_weight: 3,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2025,
    paper: 'nov_p2',
    clues: '- The numerator matches the double-angle formula for sine.\n- The denominator matches one of the three forms of the double-angle formula for cosine.',
  },
  {
    name: 'Question 3',
    question: 'Complete the working to simplify the expression to a single trigonometric ratio. Type the blank with no spaces.',
    metadata: [
      'cos(180° + x) · sin(90° + x) ÷ cos(−x)',
      'cos(180° + x) = −cos x and sin(90° + x) = cos x',
      'cos(−x) = cos x',
      'So the expression is (−cos x)(cos x) ÷ cos x, which simplifies to:',
      '[ ]',
    ],
    answer: ['-cosx'],
    presentation: 'steps',
    keyboard_type: 'scientific_math',
    type: 'proof',
    unit: 'trigonometry',
    topic: 'trig_identities',
    subtopic: 'simplification',
    skills: ['reduction_formulae', 'trig_simplification', 'sin_negative_quadrants'],
    difficulty: 3,
    exam_weight: 3,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Each compound-angle expression has been replaced by a single ratio with the correct sign.\n- Cancel the common factor and keep the sign.',
  },
  {
    name: 'Question 4',
    question: 'For x ∈ [0°;360°], determine the values of x for which √(−cos x) is real. Write the answer in the form a°≤x≤b°, with no spaces.',
    metadata: ['x: ', '[ ]'],
    answer: ['90°≤x≤270°', '', '', '', ''],
    presentation: 'fitb',
    keyboard_type: 'scientific_math',
    type: 'calc',
    unit: 'trigonometry',
    topic: 'trig_identities',
    subtopic: 'simplification',
    skills: ['applying_restrictions', 'quadrant_rule'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2025,
    paper: 'nov_p2',
    clues: '- A square root is real only when the expression under the root is not negative.\n- Think about the interval on which the cosine graph is below the x-axis.',
  },
];

// ─── AI explanation (one entry per real exam sub-question — AIEXP-08) ────────

const aiExplanation = {
  sub_questions: [
    {
      number: '5.1.1',
      marks: 2,
      clues: '- Draw a right-angled triangle that has tan 50° = k.\n- Use Pythagoras for the hypotenuse, and notice that 40° is the other acute angle.',
      approach: '- Put k opposite 50° and 1 adjacent to 50°.\n- Find the hypotenuse with Pythagoras.\n- cos 40° is the ratio of the side next to 40° to the hypotenuse.',
      solution: '1. Hypotenuse² = k² + 1², so hypotenuse = √(k² + 1)\n2. cos 40° = k ÷ √(k² + 1)',
    },
    {
      number: '5.1.2',
      marks: 5,
      clues: '- The numerator is a double-angle formula for sine.\n- Factorise the denominator so that a double-angle formula for cosine appears.',
      approach: '- Replace 2 sin 25° cos 25° by sin 50°.\n- Factor −2 out of the denominator to get −2(1 − 2 sin² 25°) = −2 cos 50°.\n- Divide using tan 50° = sin 50° ÷ cos 50° and substitute k.',
      solution: '1. Numerator = sin 50°\n2. Denominator = −2(1 − 2 sin² 25°) = −2 cos 50°\n3. Expression = sin 50° ÷ (−2 cos 50°) = −(1/2) tan 50°\n4. ∴ the expression = −k/2',
    },
    {
      number: '5.1.3',
      marks: 4,
      clues: '- Write 10° as a difference of two angles whose ratios you know in terms of k.\n- Use the compound-angle formula for sine.',
      approach: '- sin 10° = sin(50° − 40°).\n- Expand: sin 50° cos 40° − cos 50° sin 40°.\n- Substitute the ratios from the triangle: sin 50° = cos 40° = k ÷ √(k² + 1) and cos 50° = sin 40° = 1 ÷ √(k² + 1).',
      solution: '1. sin 10° = sin 50° cos 40° − cos 50° sin 40°\n2. = (k ÷ √(k² + 1))(k ÷ √(k² + 1)) − (1 ÷ √(k² + 1))(1 ÷ √(k² + 1))\n3. = k² ÷ (k² + 1) − 1 ÷ (k² + 1)\n4. = (k² − 1) ÷ (k² + 1)',
    },
    {
      number: '5.2.1',
      marks: 4,
      clues: '- Reduce each of the three ratios to a ratio of x with a sign.\n- Then cancel the common factor.',
      approach: '- sin(540° + x) = sin(180° + x), because 540° is 360° + 180°.\n- Reduce cos(90° + x) and sin(−x) as well.\n- Replace and simplify.',
      solution: '1. sin(540° + x) = −sin x\n2. cos(90° + x) = −sin x\n3. sin(−x) = −sin x\n4. Expression = (−sin x)(−sin x) ÷ (−sin x)\n5. = −sin x',
    },
    {
      number: '5.2.2',
      marks: 2,
      clues: '- Use the simplified expression from 5.2.1.\n- The value under a root must not be negative, and the denominator of the original expression cannot be zero.',
      approach: '- The expression equals −sin x, so you need −sin x ≥ 0.\n- That means sin x is negative.\n- Remove values where sin(−x) = 0.',
      solution: '1. −sin x ≥ 0 means sin x ≤ 0\n2. sin x is negative for 180° < x < 360°\n3. At 0°, 180° and 360° the original denominator would be 0\n4. ∴ x ∈ (180° ; 360°)',
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
