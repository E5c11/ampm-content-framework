#!/usr/bin/env node
/**
 * DBE Mathematics P2 — November 2025 — Question 2 (order 2)
 * Statistics — cumulative frequency and histograms: reading a cumulative frequency table, class
 * frequencies, skewness, and standard deviation with a missing data value.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-maths-2025-nov-p2-q2.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-maths-2025-nov-p2-q2.js --dry-run
 *   node scripts/add-maths-2025-nov-p2-q2.js
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
  name: 'Question 2',
  syllabus: 'dbe',
  subject: 'maths',
  year: 2025,
  paper: 'nov_p2',
  order: 2,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['cumulative_frequency', 'histogram', 'skewness', 'standard_deviation'],
  question_image_urls: [`${IMG}/q2/question_1.png`],
  memo_image_urls: [`${IMG}/q2/memo_1.png`, `${IMG}/q2/memo_2.png`],
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
    question: 'The cumulative frequency table shows the waiting time, t minutes, of customers at a clinic: t ≤ 10: 8; t ≤ 20: 21; t ≤ 30: 40; t ≤ 40: 49; t ≤ 50: 52. How many customers waited more than 20 and up to 40 minutes?',
    metadata: ['Customers: ', '[ ]'],
    answer: ['28', '', '', '', ''],
    presentation: 'fitb',
    keyboard_type: 'standard_math',
    type: 'calc',
    unit: 'statistics',
    topic: 'data_handling',
    subtopic: 'ogive',
    skills: ['reading_cumulative_frequency', 'complementary_frequency'],
    difficulty: 2,
    exam_weight: 3,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2025,
    paper: 'nov_p2',
    clues: '- A cumulative frequency counts everyone up to the upper boundary of a class.\n- Subtract the count at the lower boundary from the count at the upper boundary.',
  },
  {
    name: 'Question 2',
    question: 'A histogram with equal class widths shows the marks of a class test. The class frequencies, from the lowest marks to the highest, are 2, 6, 14, 25 and 33. Which description of the skewness is correct?',
    metadata: [
      'Skewed to the right (positively skewed)',
      'Symmetric',
      'Skewed to the left (negatively skewed)',
      'Bimodal with no skewness',
      '',
    ],
    answer: ['Skewed to the left (negatively skewed)', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'definition',
    unit: 'statistics',
    topic: 'data_handling',
    subtopic: 'skewness',
    skills: ['identifying_skewness', 'reading_frequency_table'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Skewness is named after the side of the histogram that has the long, thin tail.\n- Look at where the largest frequencies are and where the frequencies trail off.',
  },
  {
    name: 'Question 3',
    question: 'The mean score of 6 players in a darts game is 11. Five of the scores are 6, 9, 12, 14 and 8. How many of the six scores lie outside ONE standard deviation of the mean?',
    metadata: ['Scores outside: ', '[ ]'],
    answer: ['2', '', '', '', ''],
    presentation: 'fitb',
    keyboard_type: 'standard_math',
    type: 'calc',
    unit: 'statistics',
    topic: 'data_handling',
    subtopic: 'standard_deviation',
    skills: ['calculating_standard_deviation', 'solving_for_missing_frequency'],
    difficulty: 4,
    exam_weight: 3,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Use the mean to find the sixth score before you calculate anything else.\n- Find the interval from one standard deviation below to one above the mean, then count the scores outside it.',
  },
  {
    name: 'Question 4',
    question: 'Arrange these steps for drawing a histogram from a cumulative frequency table.',
    metadata: [
      'Draw bars of equal width with no gaps between them',
      'Subtract each cumulative frequency from the next to get the class frequencies',
      'Label both axes and mark the class boundaries on the horizontal axis',
      'Write the first cumulative frequency as the frequency of the first class',
    ],
    answer: [
      'Write the first cumulative frequency as the frequency of the first class',
      'Subtract each cumulative frequency from the next to get the class frequencies',
      'Label both axes and mark the class boundaries on the horizontal axis',
      'Draw bars of equal width with no gaps between them',
    ],
    presentation: 'ordering',
    type: 'calc',
    unit: 'statistics',
    topic: 'data_handling',
    subtopic: 'histogram',
    skills: ['histogram_from_cumulative_frequency', 'logical_sequence'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'maths',
    year: 2025,
    paper: 'nov_p2',
    clues: '- A histogram shows class frequencies, not running totals.\n- The bars cannot be drawn until the frequencies and the axes are ready.',
  },
];

// ─── AI explanation (one entry per real exam sub-question — AIEXP-08) ────────

const aiExplanation = {
  sub_questions: [
    {
      number: '2.1.1',
      marks: 1,
      clues: '- The cumulative frequency in the last class counts everyone.\n- Read the final value in the table.',
      approach: '- The table is cumulative, so each entry includes all earlier classes.\n- The last class, 0 < t ≤ 100, includes every visitor.',
      solution: '1. The last cumulative frequency is 70\n2. ∴ 70 people visited the website',
    },
    {
      number: '2.1.2',
      marks: 2,
      clues: '- Use the cumulative frequencies at 40 and at 80 minutes.\n- Subtract to find those in between.',
      approach: '- 67 people spent up to 80 minutes.\n- 40 people spent up to 40 minutes.\n- Those between 40 and 80 are the difference.',
      solution: '1. Number = 67 − 40\n2. = 27 people',
    },
    {
      number: '2.1.3',
      marks: 3,
      clues: '- A histogram needs the frequency of each class, not the cumulative frequency.\n- Bars of a histogram touch.',
      approach: '- Subtract consecutive cumulative frequencies to get class frequencies.\n- Draw five bars of equal width over 0–20, 20–40, 40–60, 60–80 and 80–100.\n- Make the bar heights equal to the class frequencies, with no gaps.',
      solution: '1. Frequencies: 16; 40 − 16 = 24; 59 − 40 = 19; 67 − 59 = 8; 70 − 67 = 3\n2. Draw bars of height 16, 24, 19, 8 and 3\n3. The bars touch (no gaps between them)',
    },
    {
      number: '2.1.4',
      marks: 1,
      clues: '- Look at where the tallest bar is and on which side the data trails off.\n- The name of the skewness follows the direction of the long tail.',
      approach: '- The tallest bar is in the second class.\n- The frequencies then decrease slowly towards larger times.\n- The long tail is on the right.',
      solution: '1. The tail points towards the larger values\n2. ∴ the data is skewed to the right (positively skewed)',
    },
    {
      number: '2.2',
      marks: 5,
      clues: '- First find the missing ninth score from the given mean.\n- Then use the calculator to find the standard deviation and the interval around the mean.',
      approach: '- Total of all nine scores = 9 × 12 = 108; subtract the eight known scores.\n- Enter all nine scores into statistics mode and read the standard deviation.\n- Work out mean − σ and mean + σ.\n- Count how many scores lie outside that interval.',
      solution: '1. 11 + 14 + 19 + 20 + 8 + 10 + 2 + 14 + x = 108, so x = 10\n2. σ ≈ 5.23\n3. Interval: (12 − 5.23 ; 12 + 5.23) = (6.77 ; 17.23)\n4. Scores outside the interval: 19, 20 and 2\n5. ∴ 3 players',
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
