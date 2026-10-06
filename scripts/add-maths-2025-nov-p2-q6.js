#!/usr/bin/env node
/**
 * DBE Mathematics P2 — November 2025 — Question 6 (order 6)
 * Trigonometry — proving an identity, solving a trig equation, the arithmetic-sequence condition
 * applied to trig expressions, and simplifying with a fundamental identity.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-maths-2025-nov-p2-q6.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-maths-2025-nov-p2-q6.js --dry-run
 *   node scripts/add-maths-2025-nov-p2-q6.js
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
  name: 'Question 6',
  syllabus: 'dbe',
  subject: 'maths',
  year: 2025,
  paper: 'nov_p2',
  order: 6,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['trig_identities', 'simplification', 'trig_equations', 'general_solution'],
  question_image_urls: [`${IMG}/q6/question_1.png`],
  memo_image_urls: [`${IMG}/q6/memo_1.png`, `${IMG}/q6/memo_2.png`],
  exam_question_marks: 13,
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
    question: 'These steps prove that sin x ÷ (1 + cos x) + (1 + cos x) ÷ sin x = 2 ÷ sin x, but are in the wrong order. Arrange them correctly.',
    metadata: [
      'Use sin²x + cos²x = 1: numerator = 2 + 2cos x = 2(1 + cos x)',
      'Write over the common denominator: [sin²x + (1 + cos x)²] ÷ [sin x(1 + cos x)]',
      'Cancel the common factor (1 + cos x) to get 2 ÷ sin x = RHS',
      'Expand: numerator = sin²x + 1 + 2cos x + cos²x',
    ],
    answer: [
      'Write over the common denominator: [sin²x + (1 + cos x)²] ÷ [sin x(1 + cos x)]',
      'Expand: numerator = sin²x + 1 + 2cos x + cos²x',
      'Use sin²x + cos²x = 1: numerator = 2 + 2cos x = 2(1 + cos x)',
      'Cancel the common factor (1 + cos x) to get 2 ÷ sin x = RHS',
    ],
    presentation: 'ordering',
    type: 'proof',
    unit: 'trigonometry',
    topic: 'trig_identities',
    subtopic: 'simplification',
    skills: ['logical_proof_ordering', 'trig_simplification'],
    difficulty: 3,
    exam_weight: 3,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Combine the two fractions before you simplify anything.\n- Use a fundamental identity once the numerator is expanded.',
  },
  {
    name: 'Question 2',
    question: 'Solve 2 cos x = sin x for x ∈ [0°;180°]. Give the answer correct to TWO decimal places.',
    metadata: ['x = ', '[ ]', '°'],
    answer: ['63.43', '', '', '', ''],
    presentation: 'fitb',
    keyboard_type: 'standard_math',
    type: 'calc',
    unit: 'trigonometry',
    topic: 'trig_equations',
    subtopic: 'trig_equation_solution',
    skills: ['quotient_identity', 'solving_trig_equations', 'reference_angle'],
    difficulty: 3,
    exam_weight: 3,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Divide both sides by cos x to form tan x.\n- Check the answer lies in the given interval, and whether a second solution exists in it.',
  },
  {
    name: 'Question 3',
    question: 'The expressions sin x, 2cos x and sin 2x are consecutive terms of an arithmetic sequence. Which equation must hold?',
    metadata: [
      'sin x + sin 2x = 2cos x',
      'sin x + sin 2x = 4cos x',
      'sin x × sin 2x = (2cos x)²',
      'sin 2x − sin x = 2cos x',
      '',
    ],
    answer: ['sin x + sin 2x = 4cos x', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'trigonometry',
    topic: 'trig_equations',
    subtopic: 'trig_equation_solution',
    skills: ['constant_difference_condition', 'equating_general_term'],
    difficulty: 4,
    exam_weight: 3,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2025,
    paper: 'nov_p2',
    clues: '- In an arithmetic sequence the difference between consecutive terms is constant.\n- The middle term is the average of the terms on either side.',
  },
  {
    name: 'Question 4',
    question: 'Simplify (1 − cos²x) ÷ sin x to a single trigonometric ratio. Type it with no spaces.',
    metadata: ['Answer: ', '[ ]'],
    answer: ['sinx', '', '', '', ''],
    presentation: 'fitb',
    keyboard_type: 'scientific_math',
    type: 'calc',
    unit: 'trigonometry',
    topic: 'trig_identities',
    subtopic: 'simplification',
    skills: ['trig_simplification', 'quotient_identity'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2025,
    paper: 'nov_p2',
    clues: '- The numerator can be replaced using a Pythagorean identity.\n- Then cancel the common factor.',
  },
];

// ─── AI explanation (one entry per real exam sub-question — AIEXP-08) ────────

const aiExplanation = {
  sub_questions: [
    {
      number: '6.1',
      marks: 6,
      clues: '- Reduce tan(180° − x) first and replace 1 − cos²x with a single term.\n- Put everything over one denominator and factorise the numerator as a difference of cubes.',
      approach: '- Use tan(180° − x) = −tan x and 1 − cos²x = sin²x, then write tan x as sin x ÷ cos x.\n- Combine into one fraction with denominator −cos x.\n- Factorise sin³x − cos³x and use sin²x + cos²x = 1 to match the RHS.',
      solution: '1. LHS = (−tan x)(sin²x) + cos²x\n2. = −sin³x ÷ cos x + cos²x\n3. = (sin³x − cos³x) ÷ (−cos x)\n4. = (sin x − cos x)(sin²x + sin x cos x + cos²x) ÷ (−cos x)\n5. = (sin x − cos x)(1 + sin x cos x) ÷ (−cos x) = RHS',
    },
    {
      number: '6.2',
      marks: 7,
      clues: '- For three terms of an arithmetic sequence, the difference between consecutive terms is the same.\n- Use the double-angle formula for sin 2x, then factorise the trig equation.',
      approach: '- Equate T₂ − T₁ and T₃ − T₂, then rewrite sin 2x as 2 sin x cos x.\n- Collect everything on one side and factorise as a trinomial in sin x and cos x.\n- Solve each factor as a tan equation and write the general solutions, rejecting the one that makes the difference zero.',
      solution: '1. cos²x − sin²x = (1/2) sin 2x − cos²x\n2. 2cos²x − sin x cos x − sin²x = 0\n3. (2cos x + sin x)(cos x − sin x) = 0\n4. tan x = −2 or tan x = 1\n5. tan x = 1 gives a constant difference of 0, which is not allowed, so x ≠ 45° + k·180°\n6. ∴ x = 116.57° + k·180°, k ∈ ℤ',
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
