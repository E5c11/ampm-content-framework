#!/usr/bin/env node
/**
 * DBE Physical Sciences: Physics P1 — November 2025 — Question 1.5 (order 5)
 * Kinetic friction and net work on a block moving under a constant applied force.
 *
 * One of 10 subsection lessons — see add-physics-2025-nov-p1-q1-1.js header note.
 *
 *   node tools/validate-questions.js --script scripts/add-physics-2025-nov-p1-q1-5.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-physics-2025-nov-p1-q1-5.js --dry-run
 *   node scripts/add-physics-2025-nov-p1-q1-5.js
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
  name: 'Question 1.5',
  syllabus: 'dbe',
  subject: 'physics',
  year: 2025,
  paper: 'nov_p1',
  order: 5,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['kinetic_friction', 'net_work'],
  question_image_urls: [`${PAPER}/q1/question_3.png`],
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
      'A crate moves along a rough horizontal surface while a constant horizontal force P of magnitude 30 N and a constant kinetic frictional force of magnitude 10 N act on it. Which ONE of the following combinations of ACCELERATION and NET WORK DONE ON THE CRATE is correct?',
    metadata: [
      'Acceleration: Increases. Net work: Constant.',
      'Acceleration: Constant. Net work: Increases.',
      'Acceleration: Increases. Net work: Increases.',
      'Acceleration: Constant. Net work: Constant.',
      '',
    ],
    answer: ['Acceleration: Constant. Net work: Increases.', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'calc',
    unit: 'mechanics',
    topic: 'newtons_laws',
    subtopic: 'kinetic_friction_and_work',
    skills: ['newtons_second_law', 'net_work', 'kinetic_friction'],
    difficulty: 3,
    exam_weight: 3,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p1',
    clues:
      '- Both the applied force and the friction force are constant in magnitude — what does that mean for the net force, and hence the acceleration?\n- Net work done is force × distance moved — think about how the distance travelled changes as the crate keeps moving.',
  },
  {
    name: 'Question 2',
    question:
      'A block experiences a constant net force of 15 N while it moves a distance of 4 m in the direction of the force. Calculate the net work done on the block.',
    metadata: ['W = ', '[ ]', ' J'],
    answer: ['60', '', '', '', ''],
    presentation: 'fitb',
    type: 'calc',
    unit: 'mechanics',
    topic: 'newtons_laws',
    subtopic: 'kinetic_friction_and_work',
    skills: ['work_calculation'],
    difficulty: 1,
    exam_weight: 3,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p1',
    clues: '- Work done equals force multiplied by the distance moved in the direction of the force: W = FΔx.\n- The force is already the net force, so no further resolving is needed.',
  },
];

const aiExplanation = {
  sub_questions: [
    {
      number: '1.5',
      marks: 2,
      clues: '- Both F and the kinetic friction force are constant in magnitude — consider what that means for the net force and hence the acceleration.\n- Net work done is force × distance moved — think about how the distance travelled changes as the block keeps moving.',
      approach: '- Calculate the net force: F_net = F − f_k = 18 − 6 = 12 N (constant).\n- Since F_net is constant and mass is constant, acceleration is constant (Newton’s second law).\n- Net work done = F_net × distance moved; as the block keeps moving, the distance increases, so the net work done increases over time.',
      solution: '1. F_net = F − f_k = 18 − 6 = 12 N (constant, since F and f_k are both constant)\n2. a = F_net / m — constant, since F_net and m are constant\n3. W_net = F_net·Δx — as the block continues moving, Δx increases, so W_net increases\n4. Acceleration: constant. Net work: increases.\n5. The correct answer is A.',
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
