#!/usr/bin/env node
/**
 * DBE Mathematics P1 — November 2024 — Question 2 (order 2)
 * Number patterns: arithmetic series sum, sigma notation for added terms, quadratic pattern from first differences.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-maths-2024-nov-p1-q2.js --curriculum temp/curriculum-vocab-maths.json
 *   node scripts/add-maths-2024-nov-p1-q2.js --dry-run
 *   node scripts/add-maths-2024-nov-p1-q2.js
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
  name: 'Question 2',
  syllabus: 'dbe',
  subject: 'maths',
  year: 2024,
  paper: 'nov_p1',
  order: 2,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['arithmetic_series', 'sigma_notation', 'quadratic_sequence', 'general_term'],
  question_image_urls: [`${IMG}/q2/question_1.png`],
  memo_image_urls: [`${IMG}/q2/memo_1.png`],
  exam_question_marks: 14,
  supplementary_materials: [
    { type: 'formula_sheet', label: 'Formula Sheet', image_urls: [`${IMG}/q0/question_1.png`] },
  ],
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    name: 'Question 1',
    question: 'An arithmetic series has a first term of −6 and a common difference of 4. Calculate the sum of the first 18 terms of the series.',
    metadata: ['S₁₈ = ', '[ ]'],
    answer: ['504', '', '', '', ''],
    presentation: 'fitb',
    keyboard_type: 'standard_math',
    type: 'calc',
    unit: 'number_patterns',
    topic: 'arithmetic_sequence',
    subtopic: 'series_sum',
    skills: ['arithmetic_sum_formula'],
    difficulty: 2,
    exam_weight: 3,
    xp: 10,
    order: 1,
    syllabus: 'dbe', subject: 'maths', year: 2024, paper: 'nov_p1',
    clues: '- Identify a, d and n, then use the formula for the sum of an arithmetic series on the information sheet.',
  },
  {
    name: 'Question 2',
    question: 'An arithmetic sequence has a first term of 5 and a common difference of 3. Which expression represents the sum of the 11th to the 30th terms of the sequence?',
    metadata: [
      'Σ_{n=10}^{30}(3n + 2)',
      'Σ_{n=1}^{20}(3n + 2)',
      'Σ_{n=11}^{30}(5n + 3)',
      'Σ_{n=11}^{30}(3n + 2)',
      '',
    ],
    answer: ['Σ_{n=11}^{30}(3n + 2)', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'conversion',
    unit: 'number_patterns',
    topic: 'arithmetic_sequence',
    subtopic: 'sigma_notation',
    skills: ['sigma_notation', 'general_term_formula'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe', subject: 'maths', year: 2024, paper: 'nov_p1',
    clues: '- Find the general term Tₙ of the sequence first.\n- The lower and upper limits of the sigma are the positions of the first and last terms you add.',
  },
  {
    name: 'Question 3',
    question: 'The first differences of a quadratic pattern are 3 ; 7 ; 11 ; … and T₆₀ = 7 230. Calculate the value of T₅₉.',
    metadata: ['T₅₉ = ', '[ ]'],
    answer: ['6995', '', '', '', ''],
    presentation: 'fitb',
    keyboard_type: 'standard_math',
    type: 'calc',
    unit: 'number_patterns',
    topic: 'quadratic_sequence',
    subtopic: 'extending_the_sequence',
    skills: ['first_difference_extension', 'general_term_formula'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 3,
    syllabus: 'dbe', subject: 'maths', year: 2024, paper: 'nov_p1',
    clues: '- Find a general term for the first differences.\n- The difference between two consecutive terms is one of these first differences — work out which one.',
  },
  {
    name: 'Question 4',
    question: 'A quadratic pattern has T₁ = 5, and its first differences are 2 ; 6 ; 10 ; … Complete the working to find the general term Tₙ = an² + bn + c.',
    metadata: [
      'Second difference = 4, so 2a = 4 and a = 2',
      'First difference T₂ − T₁ = 3a + b = 2, so b:',
      '[ ]',
      'T₁ = a + b + c = 5, so c:',
      '[ ]',
    ],
    answer: ['-4', '7'],
    presentation: 'steps',
    keyboard_type: 'scientific_math',
    type: 'calc',
    unit: 'number_patterns',
    topic: 'quadratic_sequence',
    subtopic: 'general_term',
    skills: ['second_difference', 'simultaneous_equations_abc'],
    difficulty: 3,
    exam_weight: 3,
    xp: 10,
    order: 4,
    syllabus: 'dbe', subject: 'maths', year: 2024, paper: 'nov_p1',
    clues: '- Half of the constant second difference gives a.\n- Use the first first difference to find b, then the first term to find c.',
  },
];

// ─── AI explanation (AMPM-CONTENT-AI-EXP) — one entry per exam sub-question ───

const aiExplanation = {
  sub_questions: [
    {
      number: '2.1.1',
      marks: 2,
      clues: '- Identify a, d and n and use the arithmetic series formula.',
      approach: '- a = 7, d = 5 and n = 20.\n- Substitute into Sₙ = n/2 [2a + (n − 1)d].',
      solution: '1. S₂₀ = 20/2 [2(7) + (20 − 1)(5)]\n2. S₂₀ = 10(14 + 95)\n3. S₂₀ = 1 090',
    },
    {
      number: '2.1.2',
      marks: 4,
      clues: '- The added terms are T₂₁ to T₇₅, and their sum is S₇₅ − S₂₀.\n- Write the general term so you can put it inside the sigma.',
      approach: '- Find Tₙ = 7 + (n − 1)(5) = 5n + 2.\n- The sum of the added terms is 14 400 − 1 090 = 13 310.\n- Write the sum of terms 21 to 75 in sigma notation and set it equal to 13 310.',
      solution: '1. Tₙ = 7 + (n − 1)(5) = 5n + 2\n2. S₇₅ − S₂₀ = 14 400 − 1 090 = 13 310\n3. The added terms are T₂₁ to T₇₅.\n4. Σ (n = 21 to 75) of (5n + 2) = 13 310',
    },
    {
      number: '2.2.1',
      marks: 3,
      clues: '- The first differences 1 ; 3 ; 5 ; … form their own linear pattern.\n- T₉₉ − T₉₈ is the 98th first difference.',
      approach: '- The kth first difference is 2k − 1.\n- The 98th first difference is 2(98) − 1 = 195.\n- Subtract it from T₉₉.',
      solution: '1. kth first difference = 2k − 1\n2. 98th first difference = 2(98) − 1 = 195\n3. T₉₈ = T₉₉ − 195 = 9 632 − 195\n4. T₉₈ = 9 437',
    },
    {
      number: '2.2.2',
      marks: 5,
      clues: '- Use T₃ and the first differences to work back to T₁ and T₂.\n- Then find a, b and c from the second difference and the first terms.',
      approach: '- Work back from T₃ = 32: T₂ = 32 − 3 = 29 and T₁ = 29 − 1 = 28.\n- The second difference is 2, so 2a = 2 and a = 1.\n- 3a + b = 1 gives b = −2, and a + b + c = 28 gives c = 29.',
      solution: '1. Pattern: 28 ; 29 ; 32 ; …\n2. Second difference = 2, so 2a = 2 and a = 1\n3. 3a + b = 1, so b = −2\n4. a + b + c = 28, so c = 29\n5. Tₙ = n² − 2n + 29',
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
