#!/usr/bin/env node
/**
 * DBE Mathematics P1 — November 2024 — Question 3 (order 3)
 * Geometric sequence of circles: nth radius, sum of areas, finding which term has a given diameter.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-maths-2024-nov-p1-q3.js --curriculum temp/curriculum-vocab-maths.json
 *   node scripts/add-maths-2024-nov-p1-q3.js --dry-run
 *   node scripts/add-maths-2024-nov-p1-q3.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

const IMG = 'https://media-dev.askmoreprepmore.app/exam_papers/dbe/maths/2024/nov_p1';

// ─── Phase 2 — lesson document ───────────────────────────────────────────────

const video = {
  name: 'Question 3',
  syllabus: 'dbe',
  subject: 'maths',
  year: 2024,
  paper: 'nov_p1',
  order: 3,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['geometric_sequence', 'geometric_series', 'general_term', 'common_ratio'],
  question_image_urls: [`${IMG}/q3/question_1.png`],
  memo_image_urls: [`${IMG}/q3/memo_1.png`, `${IMG}/q3/memo_2.png`],
  exam_question_marks: 10,
  supplementary_materials: [
    { type: 'formula_sheet', label: 'Formula Sheet', image_urls: [`${IMG}/q0/question_1.png`] },
  ],
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    name: 'Question 1',
    question: 'In a pattern of circles, each circle has a radius equal to one third of the radius of the circle before it. The first circle has a radius of 54 cm. Calculate the radius of the 4th circle.',
    metadata: ['r = ', '[ ]', ' cm'],
    answer: ['2', '', '', '', ''],
    presentation: 'fitb',
    keyboard_type: 'standard_math',
    type: 'application',
    unit: 'number_patterns',
    topic: 'geometric_sequence',
    subtopic: 'general_term',
    skills: ['geometric_nth_term', 'identifying_a_and_r'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe', subject: 'maths', year: 2024, paper: 'nov_p1',
    clues: '- The radii form a geometric sequence, so identify a and r.\n- Use Tₙ = arⁿ⁻¹ with the correct value of n.',
  },
  {
    name: 'Question 2',
    question: 'The radii of a sequence of circles form a geometric sequence with a common ratio of \\frac{2}{5}. What is the common ratio of the areas of these circles?',
    metadata: ['\\frac{2}{5}', '\\frac{4}{25}', '\\frac{4}{5}', '\\frac{2π}{5}', ''],
    answer: ['\\frac{4}{25}', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'calc',
    unit: 'number_patterns',
    topic: 'geometric_sequence',
    subtopic: 'common_ratio',
    skills: ['identifying_a_and_r'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe', subject: 'maths', year: 2024, paper: 'nov_p1',
    clues: '- Write the areas of two consecutive circles in terms of their radii.\n- Divide one area by the other and simplify.',
  },
  {
    name: 'Question 3',
    question: 'A pattern of squares is drawn so that each square has sides half as long as the square before it. The first square has sides of 10 cm. Calculate the sum of the areas of the first 8 squares, correct to TWO decimal places.',
    metadata: ['Sum = ', '[ ]', ' cm²'],
    answer: ['133.33', '', '', '', ''],
    presentation: 'fitb',
    keyboard_type: 'standard_math',
    type: 'application',
    unit: 'number_patterns',
    topic: 'geometric_sequence',
    subtopic: 'series_sum',
    skills: ['geometric_sum_formula', 'identifying_a_and_r', 'rounding'],
    difficulty: 3,
    exam_weight: 3,
    xp: 10,
    order: 3,
    syllabus: 'dbe', subject: 'maths', year: 2024, paper: 'nov_p1',
    clues: '- Write down the first few areas to find a and r for the areas, not for the side lengths.\n- Use the geometric series formula on the information sheet.',
  },
  {
    name: 'Question 4',
    question: 'The radii of a pattern of rings form a geometric sequence. The first ring has a radius of 3 cm and each radius is double the one before it. These steps find which ring has a radius of 768 cm but are in the wrong order. Arrange them in the correct order.',
    metadata: [
      'Write 256 as 2^8',
      'n − 1 = 8, so n = 9',
      'Set 3 × 2^(n−1) = 768',
      'Divide by 3: 2^(n−1) = 256',
    ],
    answer: [
      'Set 3 × 2^(n−1) = 768',
      'Divide by 3: 2^(n−1) = 256',
      'Write 256 as 2^8',
      'n − 1 = 8, so n = 9',
    ],
    presentation: 'ordering',
    type: 'calc',
    unit: 'number_patterns',
    topic: 'geometric_sequence',
    subtopic: 'finding_term_number',
    skills: ['equating_general_term', 'same_base_exponents'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe', subject: 'maths', year: 2024, paper: 'nov_p1',
    clues: '- Set the general term equal to the given radius.\n- Write both sides as powers of the same base and compare the exponents.',
  },
];

// ─── AI explanation (AMPM-CONTENT-AI-EXP) — one entry per exam sub-question ───

const aiExplanation = {
  sub_questions: [
    {
      number: '3.1',
      marks: 2,
      clues: '- The second circle passes through the centre of the first and touches it, so its diameter equals the radius of the first circle.',
      approach: '- Each new radius is half of the previous radius.\n- Halve 6 cm twice.',
      solution: '1. Radius of circle 2 = 6 ÷ 2 = 3 cm\n2. Radius of circle 3 = 3 ÷ 2 = 1.5 cm',
    },
    {
      number: '3.2',
      marks: 4,
      clues: '- Write down the first few areas: they form a geometric sequence.\n- The ratio of the areas is the square of the ratio of the radii.',
      approach: '- The areas are 36π ; 9π ; 9π/4 ; …\n- So a = 36π and r = 1/4.\n- Substitute n = 10 into Sₙ = a(rⁿ − 1)/(r − 1).',
      solution: '1. Areas: 36π ; 9π ; 9π/4 ; …\n2. a = 36π and r = 1/4\n3. S₁₀ = 36π[(1/4)¹⁰ − 1] / (1/4 − 1)\n4. S₁₀ = 150.80 cm²',
    },
    {
      number: '3.3',
      marks: 4,
      clues: '- Change the diameter into a radius, or work with the sequence of diameters instead.\n- Set the general term equal to that value and solve for n.',
      approach: '- Radius = 1/2 × 3/128 = 3/256 cm.\n- The radii 6 ; 3 ; 3/2 ; … have Tₙ = 6(1/2)ⁿ⁻¹.\n- Solve 6(1/2)ⁿ⁻¹ = 3/256 with equal bases or logs.',
      solution: '1. Radius = 3/256 cm\n2. 6(1/2)ⁿ⁻¹ = 3/256\n3. (1/2)ⁿ⁻¹ = 1/512 = (1/2)⁹\n4. n − 1 = 9\n5. n = 10, so it is the 10th circle',
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
