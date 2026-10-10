#!/usr/bin/env node
/**
 * DBE Mathematics P1 — November 2024 — Question 12 (order 12)
 * Counting principle: codes with and without repetition, restrictions, percentage increase.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-maths-2024-nov-p1-q12.js --curriculum temp/curriculum-vocab-maths.json
 *   node scripts/add-maths-2024-nov-p1-q12.js --dry-run
 *   node scripts/add-maths-2024-nov-p1-q12.js
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
  name: 'Question 12',
  syllabus: 'dbe',
  subject: 'maths',
  year: 2024,
  paper: 'nov_p1',
  order: 12,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['counting_principles', 'fundamental_counting'],
  question_image_urls: [`${IMG}/q12/question_1.png`],
  memo_image_urls: [`${IMG}/q12/memo_1.png`],
  exam_question_marks: 8,
  supplementary_materials: [
    { type: 'formula_sheet', label: 'Formula Sheet', image_urls: [`${IMG}/q0/question_1.png`] },
  ],
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    name: 'Question 1',
    question: 'A code consists of three letters followed by two digits, for example KTB47. The 26 letters of the alphabet and the digits 0 to 9 may be used, and repetition is allowed. How many different codes are possible?',
    metadata: ['Number of codes = ', '[ ]'],
    answer: ['1757600', '', '', '', ''],
    presentation: 'fitb',
    keyboard_type: 'standard_math',
    type: 'calc',
    unit: 'probability',
    topic: 'counting_principles',
    subtopic: 'fundamental_counting',
    skills: ['fundamental_counting_principle'],
    difficulty: 1,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe', subject: 'maths', year: 2024, paper: 'nov_p1',
    clues: '- Count the choices for each position separately.\n- Multiply the numbers of choices together.',
  },
  {
    name: 'Question 2',
    question: 'A code has the form letter, letter, digit, digit. Vowels (A, E, I, O, U) may not be used, the code may not start with X, no letter or digit may be repeated, and the code must end with an even digit. Complete the working to count the possible codes.',
    metadata: [
      'There are 26 − 5 = 21 consonants. First letter (not X), number of choices:',
      '[ ]',
      'Second letter (any consonant not yet used), number of choices:',
      '[ ]',
      'Last digit (even): 5 choices; third character (any digit not yet used): 9 choices',
      'Total number of codes:',
      '[ ]',
    ],
    answer: ['20', '20', '18000'],
    presentation: 'steps',
    keyboard_type: 'scientific_math',
    type: 'calc',
    unit: 'probability',
    topic: 'counting_principles',
    subtopic: 'counting_with_restriction',
    skills: ['applying_restrictions', 'fundamental_counting_principle'],
    difficulty: 3,
    exam_weight: 3,
    xp: 10,
    order: 2,
    syllabus: 'dbe', subject: 'maths', year: 2024, paper: 'nov_p1',
    clues: '- Fill the most restricted positions first.\n- The second letter may be X, but it may not repeat the first letter.',
  },
  {
    name: 'Question 3',
    question: 'A code has the form letter, digit, letter, digit, and no letter or digit may be repeated. At first only the 21 consonants may be used as letters. Then vowels are also allowed. Calculate the percentage increase in the number of possible codes, correct to TWO decimal places.',
    metadata: ['Increase = ', '[ ]', '%'],
    answer: ['54.76', '', '', '', ''],
    presentation: 'fitb',
    keyboard_type: 'standard_math',
    type: 'calc',
    unit: 'probability',
    topic: 'counting_principles',
    subtopic: 'counting_with_restriction',
    skills: ['fundamental_counting_principle', 'percentage_change'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 3,
    syllabus: 'dbe', subject: 'maths', year: 2024, paper: 'nov_p1',
    clues: '- Count the codes under each rule separately.\n- Percentage increase = (new − old) ÷ old × 100.',
  },
  {
    name: 'Question 4',
    question: 'In how many ways can 6 different books be arranged in a row on a shelf if two particular books must stand next to each other?',
    metadata: ['120', '240', '720', '1 440', ''],
    answer: ['240', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'calc',
    unit: 'probability',
    topic: 'counting_principles',
    subtopic: 'arrangements',
    skills: ['counting_principle'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe', subject: 'maths', year: 2024, paper: 'nov_p1',
    clues: '- Treat the two books as one unit, then count the arrangements of the units.\n- The two books can also swap places inside their unit.',
  },
];

// ─── AI explanation (AMPM-CONTENT-AI-EXP) — one entry per exam sub-question ───

const aiExplanation = {
  sub_questions: [
    {
      number: '12.1',
      marks: 2,
      clues: '- Count the choices for each of the four positions and multiply.',
      approach: '- Each letter position has 26 choices and each digit position has 10 choices.\n- Multiply the choices together.',
      solution: '1. 26 × 10 × 26 × 10\n2. = 67 600 codes',
    },
    {
      number: '12.2',
      marks: 4,
      clues: '- Six letters are removed, so 20 letters remain.\n- Fill the most restricted positions first: the first letter and the last digit.',
      approach: '- First letter: 20 letters minus W and Z leaves 18.\n- Last digit: odd, so 5 choices.\n- The other digit then has 9 choices and the other letter has 19 choices.',
      solution: '1. First letter: 18 choices\n2. Second character (digit): 9 choices, because one odd digit is kept for the end\n3. Third character (letter): 19 choices\n4. Last digit (odd): 5 choices\n5. 18 × 9 × 19 × 5 = 15 390 codes',
    },
    {
      number: '12.3',
      marks: 2,
      clues: '- Recount with all 26 letters allowed, keeping the other restrictions.\n- Percentage increase = (new − old) ÷ old × 100.',
      approach: '- New count: 24 × 9 × 25 × 5 = 27 000.\n- Compare it with the 15 390 codes from 12.2.',
      solution: '1. 24 × 9 × 25 × 5 = 27 000\n2. Increase = (27 000 − 15 390) / 15 390 × 100\n3. = 75.44%',
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
