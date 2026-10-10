#!/usr/bin/env node
/**
 * DBE Mathematics P2 — November 2024 — Question 2 (order 2)
 * Statistics — ogive: median, quartiles, interquartile range, box and whisker diagram, percentage above a value.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-maths-2024-nov-p2-q2.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-maths-2024-nov-p2-q2.js --dry-run
 *   node scripts/add-maths-2024-nov-p2-q2.js
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
  name: 'Question 2',
  syllabus: 'dbe',
  subject: 'maths',
  year: 2024,
  paper: 'nov_p2',
  order: 2,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['ogive', 'cumulative_frequency', 'box_and_whisker', 'skewness'],
  question_image_urls: [`${IMG}/q2/question_1.png`],
  memo_image_urls: [`${IMG}/q2/memo_1.png`],
  exam_question_marks: 10,
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
    question: 'An ogive is drawn for the finishing times of 120 runners. At which cumulative frequency should you read off the upper quartile?',
    metadata: ['Cumulative frequency = ', '[ ]'],
    answer: ['90', '', '', '', ''],
    presentation: 'fitb',
    keyboard_type: 'standard_math',
    type: 'definition',
    unit: 'statistics',
    topic: 'data_handling',
    subtopic: 'ogive',
    skills: ['reading_cumulative_frequency'],
    difficulty: 1,
    exam_weight: 1,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2024,
    paper: 'nov_p2',
    clues: '- The upper quartile has three quarters of the data below it.\n- Multiply the total frequency by that fraction.',
  },
  {
    name: 'Question 2',
    question: 'A cumulative frequency table for the marks of 50 learners shows: mark < 40: 8 learners; mark < 50: 19; mark < 60: 33; mark < 70: 44; mark < 80: 50. What percentage of the learners scored 60 or more?',
    metadata: ['Percentage = ', '[ ]', '%'],
    answer: ['34', '', '', '', ''],
    presentation: 'fitb',
    keyboard_type: 'standard_math',
    type: 'application',
    unit: 'statistics',
    topic: 'data_handling',
    subtopic: 'ogive',
    skills: ['reading_cumulative_frequency', 'complementary_frequency'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2024,
    paper: 'nov_p2',
    clues: '- The cumulative frequency at 60 tells you how many learners scored less than 60.\n- Subtract from the total, then write the result as a percentage of 50.',
  },
  {
    name: 'Question 3',
    question: 'A data set has the five-number summary: minimum 18, lower quartile 35, median 42, upper quartile 61, maximum 70. Which word best describes the distribution of the data?',
    metadata: ['Symmetrical', 'Positively skewed', 'Negatively skewed', 'Evenly spread', ''],
    answer: ['Positively skewed', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'definition',
    unit: 'statistics',
    topic: 'data_handling',
    subtopic: 'skewness',
    skills: ['identifying_skewness', 'five_number_summary'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2024,
    paper: 'nov_p2',
    clues: '- Compare the distance from the lower quartile to the median with the distance from the median to the upper quartile.\n- The data is skewed towards the side with the longer part of the box.',
  },
  {
    name: 'Question 4',
    question: 'Arrange the steps for drawing a box and whisker diagram from an ogive.',
    metadata: [
      'Draw the box from Q1 to Q3 with a vertical line at the median',
      'Divide the total frequency by 4 to find the heights for Q1, the median and Q3',
      'Draw the whiskers out to the minimum and maximum values',
      'Read Q1, the median and Q3 off the horizontal axis at those heights',
    ],
    answer: [
      'Divide the total frequency by 4 to find the heights for Q1, the median and Q3',
      'Read Q1, the median and Q3 off the horizontal axis at those heights',
      'Draw the box from Q1 to Q3 with a vertical line at the median',
      'Draw the whiskers out to the minimum and maximum values',
    ],
    presentation: 'ordering',
    type: 'application',
    unit: 'statistics',
    topic: 'data_handling',
    subtopic: 'box_and_whisker',
    skills: ['five_number_summary', 'reading_cumulative_frequency', 'logical_sequence'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2024,
    paper: 'nov_p2',
    clues: '- You need the quartile heights before you can read any values off the graph.\n- The box is drawn before the whiskers are added.',
  },
];

// ─── AI explanation (one entry per real exam sub-question — AIEXP-08) ────────

const aiExplanation = {
  sub_questions: [
    {
      number: '2.1',
      marks: 1,
      clues: '- The median is in the middle of the 60 employees.\n- Read across from that cumulative frequency to the curve, then down.',
      approach: '- Half of 60 is 30.\n- Go across from 30 on the vertical axis to the ogive and read the time on the horizontal axis.',
      solution: '1. Position of the median = 60 ÷ 2 = 30\n2. ∴ median ≈ 65 minutes',
    },
    {
      number: '2.2',
      marks: 1,
      clues: '- The lower quartile is a quarter of the way through the data.',
      approach: '- A quarter of 60 is 15.\n- Read the time at a cumulative frequency of 15.',
      solution: '1. Position of Q1 = 60 ÷ 4 = 15\n2. ∴ Q1 ≈ 44 minutes',
    },
    {
      number: '2.3',
      marks: 2,
      clues: '- Find the upper quartile at three quarters of the data.\n- The interquartile range is Q3 − Q1.',
      approach: '- Three quarters of 60 is 45.\n- Read Q3 at a cumulative frequency of 45 and subtract Q1.',
      solution: '1. Q3 ≈ 84 minutes\n2. IQR = 84 − 44\n3. ∴ IQR = 40 minutes',
    },
    {
      number: '2.4',
      marks: 2,
      clues: '- You need the five-number summary: minimum, Q1, median, Q3 and maximum.',
      approach: '- Draw the box from Q1 = 44 to Q3 = 84 with a line at the median 65.\n- Draw the whiskers out to the minimum 5 and the maximum 120.',
      solution: '1. Five-number summary: 5 ; 44 ; 65 ; 84 ; 120\n2. Box from 44 to 84, median line at 65\n3. Whiskers ending at 5 and 120',
    },
    {
      number: '2.5',
      marks: 2,
      clues: '- Read the cumulative frequency at 60 minutes: these employees travel for less than an hour.\n- The rest travel for an hour or more.',
      approach: '- At 60 minutes the cumulative frequency is 26.\n- Subtract from 60 and write the answer as a percentage of 60.',
      solution: '1. Employees who qualify = 60 − 26 = 34\n2. Percentage = 34 ÷ 60 × 100\n3. ∴ about 56.67% of the employees',
    },
    {
      number: '2.6',
      marks: 2,
      clues: '- Work out how many minutes above an hour the employee travels.\n- Count the 20-minute intervals, including a part of an interval.',
      approach: '- 110 − 60 = 50 minutes above an hour.\n- 50 minutes is two full intervals of 20 minutes plus part of a third.\n- Each interval earns half an hour from home.',
      solution: '1. Number of intervals = 3\n2. Time from home = 3 × 30 minutes\n3. ∴ 90 minutes (1.5 hours)',
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
