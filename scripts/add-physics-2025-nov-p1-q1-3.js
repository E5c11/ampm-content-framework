#!/usr/bin/env node
/**
 * DBE Physical Sciences: Physics P1 — November 2025 — Question 1.3 (order 3)
 * Work, energy and power: an object moving at constant velocity.
 *
 * One of 10 subsection lessons — see add-physics-2025-nov-p1-q1-1.js header note.
 *
 *   node tools/validate-questions.js --script scripts/add-physics-2025-nov-p1-q1-3.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-physics-2025-nov-p1-q1-3.js --dry-run
 *   node scripts/add-physics-2025-nov-p1-q1-3.js
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
  name: 'Question 1.3',
  syllabus: 'dbe',
  subject: 'physics',
  year: 2025,
  paper: 'nov_p1',
  order: 3,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['power', 'mechanical_energy'],
  question_image_urls: [`${PAPER}/q1/question_2.png`],
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
      'A crane lifts a load vertically upward at a CONSTANT VELOCITY. Consider the following statements about the load during this motion: (i) The kinetic energy of the load is constant. (ii) The gravitational potential energy of the load is constant. (iii) The power delivered by the crane is constant. (iv) The mechanical energy of the load is constant. Which of the statements above are CORRECT?',
    metadata: [
      '(ii) and (iv) only',
      '(i) and (iii) only',
      '(i) and (ii) only',
      '(iii) and (iv) only',
      '',
    ],
    answer: ['(i) and (iii) only', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'mechanics',
    topic: 'work_energy_power',
    subtopic: 'power_mechanical_energy',
    skills: ['power', 'mechanical_energy', 'constant_velocity_motion'],
    difficulty: 3,
    exam_weight: 3,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p1',
    clues:
      '- Constant velocity means kinetic energy doesn’t change, but height (and therefore gravitational PE) keeps increasing.\n- Power = force × velocity — think about whether both stay constant here.',
  },
  {
    name: 'Question 2',
    question:
      'A motor exerts a constant force of 40 N on an object, moving it at a constant velocity of 2.5 m·s⁻¹ in the direction of the force. Calculate the power delivered by the motor.',
    metadata: ['P = ', '[ ]', ' W'],
    answer: ['100', '', '', '', ''],
    presentation: 'fitb',
    type: 'calc',
    unit: 'mechanics',
    topic: 'work_energy_power',
    subtopic: 'power_mechanical_energy',
    skills: ['power_calculation', 'force_velocity_relationship'],
    difficulty: 1,
    exam_weight: 3,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p1',
    clues: '- Power equals force multiplied by velocity, P = Fv.\n- Both values are already given directly — substitute and multiply.',
  },
];

const aiExplanation = {
  sub_questions: [
    {
      number: '1.3',
      marks: 2,
      clues: '- Constant velocity means the applied force equals the box’s weight, and both stay constant.\n- Power = force × velocity; also consider how height gained affects gravitational PE, and how constant velocity affects KE.',
      approach: '- Recognise that constant velocity means the motor’s force equals the box’s weight (both constant).\n- Power = F·v, so with both constant, the rate of work is constant.\n- KE stays constant (v constant), but gravitational PE increases as height increases, so mechanical energy increases.\n- Match these two conclusions to the given statements.',
      solution: '1. Constant velocity ⇒ the motor’s force equals the box’s weight (both constant).\n2. Power = F·v, and F and v are both constant, so the rate of work done is constant — statement (ii) is true, (i) is false.\n3. KE = ½mv² is constant since v is constant.\n4. Gravitational PE = mgh increases as the box rises.\n5. Mechanical energy = KE + PE, so it increases — statement (iii) is true, (iv) is false.\n6. The correct answer is C: (ii) and (iii) only.',
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
