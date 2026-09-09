#!/usr/bin/env node
/**
 * DBE Physical Sciences: Physics P1 — November 2025 — Question 1.8 (order 8)
 * Series-parallel circuits: effect of a switch on bulb brightness; equivalent resistance.
 *
 * One of 10 subsection lessons — see add-physics-2025-nov-p1-q1-1.js header note.
 *
 *   node tools/validate-questions.js --script scripts/add-physics-2025-nov-p1-q1-8.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-physics-2025-nov-p1-q1-8.js --dry-run
 *   node scripts/add-physics-2025-nov-p1-q1-8.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

const PAPER = 'https://media-dev.askmoreprepmore.app/exam_papers/dbe/physics/2025/nov_p1';

const video = {
  name: 'Question 1.8',
  syllabus: 'dbe',
  subject: 'physics',
  year: 2025,
  paper: 'nov_p1',
  order: 8,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['circuit_analysis'],
  question_image_urls: [`${PAPER}/q1/question_4.png`],
  memo_image_urls: [`${PAPER}/q1/memo_1.png`],
  exam_question_marks: 2,
  supplementary_materials: [
    {
      type: 'formula_sheet',
      label: 'Formula Sheet',
      image_urls: [`${PAPER}/q0/question_1.png`, `${PAPER}/q0/question_2.png`, `${PAPER}/q0/question_3.png`],
    },
  ],
};

const questions = [
  {
    name: 'Question 1',
    question:
      'Two identical bulbs, P and Q, are connected in parallel with each other, and this parallel combination is connected in series with a third identical bulb, R, and a battery of negligible internal resistance. A switch, S, is connected in series with bulb Q only. Switch S is initially open, then closed. How will the brightness of bulbs P and R be affected?',
    metadata: [
      'Brightness of P: increases. Brightness of R: decreases.',
      'Brightness of P: decreases. Brightness of R: increases.',
      'Brightness of P: increases. Brightness of R: increases.',
      'Brightness of P: decreases. Brightness of R: decreases.',
      '',
    ],
    answer: ['Brightness of P: decreases. Brightness of R: increases.', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'interpretation',
    unit: 'electricity_magnetism',
    topic: 'electric_circuits',
    subtopic: 'series_parallel_combination',
    skills: ['circuit_analysis', 'series_parallel_resistance', 'brightness_current_relationship'],
    difficulty: 4,
    exam_weight: 3,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p1',
    clues:
      '- Redraw the circuit for S open and S closed, and work out the total resistance in each case.\n- Brightness depends on the current through each bulb — use I = V/R_total, then consider how current splits at the parallel junction once Q starts conducting.',
  },
  {
    name: 'Question 2',
    question: 'Two resistors of 6 Ω and 3 Ω are connected in parallel. Calculate the equivalent resistance of the combination.',
    metadata: ['R = ', '[ ]', ' Ω'],
    answer: ['2', '', '', '', ''],
    presentation: 'fitb',
    type: 'calc',
    unit: 'electricity_magnetism',
    topic: 'electric_circuits',
    subtopic: 'series_parallel_combination',
    skills: ['series_parallel_resistance'],
    difficulty: 2,
    exam_weight: 3,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p1',
    clues: '- For resistors in parallel, 1/R_p = 1/R₁ + 1/R₂.\n- Combine the two fractions before inverting to find R_p.',
  },
];

const aiExplanation = {
  sub_questions: [
    {
      number: '1.8',
      marks: 2,
      clues: '- Work out the circuit’s total resistance with S closed, then with S open, and see how the total current from the battery changes.\n- For bulb Y specifically, track how its share of the current changes now that Z’s branch is disconnected.',
      approach: '- Redraw the circuit for S closed and S open, and identify which bulbs are in series/parallel in each case.\n- Compare total resistance in both cases to see how total current changes — this determines X’s brightness, since X carries all the current.\n- For Y, note that with S open, Y now carries the full circuit current instead of sharing it with Z.',
      solution: '1. With S closed: Y and Z are in parallel (equal resistance R each, combined R/2), in series with X, so R_total = R + R/2 = 1.5R.\n2. With S open: the Z branch is broken, so only Y conducts; R_total = R + R = 2R.\n3. Total current I = V/R_total decreases when S opens (1.5R → 2R), and X carries this total current, so X’s brightness decreases.\n4. With S closed, Y shared the current equally with Z: I_Y = I_total/2 = V/(3R).\n5. With S open, Y carries the full (smaller) total current alone: I_Y = V/(2R), which is greater than V/(3R).\n6. So Y’s brightness increases. The correct answer is B: X decreases, Y increases.',
    },
  ],
  model: 'claude-sonnet-5',
  generated_at: Date.now(),
  version: 2,
  reviewed: false,
  input_tokens: 0,
  output_tokens: 0,
  avg_rating: null,
  rating_count: null,
};

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
}

if (require.main === module) {
  upload()
    .catch((err) => {
      console.error('\n❌ Upload failed:', err.message);
      process.exitCode = 1;
    })
    .finally(closePool);
}
