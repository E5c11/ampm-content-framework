#!/usr/bin/env node
/**
 * DBE Physical Sciences: Physics P1 — November 2025 — Question 1, Part 1 (order 1)
 * MCQ items 1.1–1.5 — Mechanics (net force, motion graphs, work/energy/power,
 * momentum, kinetic friction & net work).
 *
 * Q1's ten MCQs cluster into CAPS's own four knowledge areas, in exam order — see
 * subjects/dbe-physics.md's "Paper structure / video mapping" (corrected 2026-09-10,
 * second correction after an earlier one-lesson-per-item split proved disproportionate
 * to each item's curriculum weight). This is Part 1 of 4.
 *
 *   node tools/validate-questions.js --script scripts/add-physics-2025-nov-p1-q1-part1.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-physics-2025-nov-p1-q1-part1.js --dry-run
 *   node scripts/add-physics-2025-nov-p1-q1-part1.js
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
  name: 'Question 1.1–1.5',
  syllabus: 'dbe',
  subject: 'physics',
  year: 2025,
  paper: 'nov_p1',
  order: 1,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['newtons_second_law', 'velocity_time_graphs', 'power', 'momentum', 'kinetic_friction'],
  question_image_urls: [`${PAPER}/q1/question_1.png`, `${PAPER}/q1/question_2.png`, `${PAPER}/q1/question_6.png`],
  memo_image_urls: [`${PAPER}/q1/memo_1.png`],
  exam_question_marks: 10,
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
      'A trolley experiences a single unbalanced horizontal force that varies in magnitude over time but never changes direction. Which statement about the trolley’s acceleration is always true?',
    metadata: [
      'The acceleration is zero.',
      'The acceleration is in the same direction as the net force, and its magnitude changes with the net force.',
      'The acceleration is opposite in direction to the net force.',
      'The acceleration is constant, regardless of the net force’s magnitude.',
      '',
    ],
    answer: ['The acceleration is in the same direction as the net force, and its magnitude changes with the net force.', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'mechanics',
    topic: 'newtons_laws',
    subtopic: 'net_force_acceleration',
    skills: ['newtons_second_law', 'net_force', 'acceleration_direction'],
    difficulty: 2,
    exam_weight: 3,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p1',
    clues: '- Consider what Newton’s second law says about the relationship between net force and acceleration.\n- The direction of acceleration always follows the direction of the net force, whatever its magnitude.',
  },
  {
    name: 'Question 2',
    question: 'A net force of 12 N acts on an object, giving it an acceleration of 3 m·s⁻². Calculate the mass of the object.',
    metadata: ['m = ', '[ ]', ' kg'],
    answer: ['4', '', '', '', ''],
    presentation: 'fitb',
    type: 'calc',
    unit: 'mechanics',
    topic: 'newtons_laws',
    subtopic: 'net_force_acceleration',
    skills: ['newtons_second_law', 'mass_acceleration_relationship'],
    difficulty: 1,
    exam_weight: 3,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p1',
    clues: '- Use Newton’s second law, Fₙₑₜ = ma.\n- Rearrange to make mass the subject before substituting.',
  },
  {
    name: 'Question 3',
    question:
      'A ball is thrown vertically upward from ground level and returns to the ground. Ignore air resistance. Which ONE of the following statements about the ball’s acceleration during its flight is correct?',
    metadata: [
      'It is zero at the highest point of the flight.',
      'It is constant in magnitude and direction throughout the flight.',
      'It increases as the ball rises and decreases as it falls.',
      'It is zero throughout the flight.',
      '',
    ],
    answer: ['It is constant in magnitude and direction throughout the flight.', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'mechanics',
    topic: 'motion_1d',
    subtopic: 'velocity_time_graphs',
    skills: ['constant_acceleration', 'free_fall', 'projectile_symmetry'],
    difficulty: 3,
    exam_weight: 3,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p1',
    clues: '- Ignoring air resistance, only one force acts on the ball for its entire flight.\n- Think about what that force is, and whether it ever switches off — even for an instant.',
  },
  {
    name: 'Question 4',
    question: 'A stone is dropped from rest from the top of a cliff. Ignore air resistance. Calculate the magnitude of its velocity after falling for 2 s.',
    metadata: ['v = ', '[ ]', ' m·s⁻¹'],
    answer: ['19.6', '', '', '', ''],
    presentation: 'fitb',
    type: 'calc',
    unit: 'mechanics',
    topic: 'motion_1d',
    subtopic: 'velocity_time_graphs',
    skills: ['free_fall', 'kinematics_equations', 'velocity_time_relationship'],
    difficulty: 2,
    exam_weight: 3,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p1',
    clues: '- The stone starts from rest, so vᵢ = 0.\n- Use v(f) = vᵢ + aΔt with a = g = 9.8 m·s⁻².',
  },
  {
    name: 'Question 5',
    question:
      'A crane lifts a load vertically upward at a CONSTANT VELOCITY. Select ALL the statements below that are correct about the load during this motion.',
    metadata: [
      'The kinetic energy of the load is constant.',
      'The gravitational potential energy of the load is constant.',
      'The power delivered by the crane is constant.',
      'The mechanical energy of the load is constant.',
      '',
    ],
    answer: ['The kinetic energy of the load is constant.', 'The power delivered by the crane is constant.', '', '', ''],
    presentation: 'multi_select',
    type: 'application',
    unit: 'mechanics',
    topic: 'work_energy_power',
    subtopic: 'power_mechanical_energy',
    skills: ['power', 'mechanical_energy', 'constant_velocity_motion'],
    difficulty: 3,
    exam_weight: 3,
    xp: 10,
    order: 5,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p1',
    clues: '- Constant velocity means kinetic energy doesn’t change, but height (and therefore gravitational PE) keeps increasing.\n- Power = force × velocity — think about whether both stay constant here.',
  },
  {
    name: 'Question 6',
    question: 'A motor exerts a constant force of 40 N on an object, moving it at a constant velocity of 2.5 m·s⁻¹ in the direction of the force. Calculate the power delivered by the motor.',
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
    order: 6,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p1',
    clues: '- Power equals force multiplied by velocity, P = Fv.\n- Both values are already given directly — substitute and multiply.',
  },
  {
    name: 'Question 7',
    question: 'Two trolleys, A and B, have masses 3m and m respectively. Trolleys A and B have the same momentum. How does the velocity of A compare to the velocity of B?',
    metadata: [
      'A’s velocity is three times B’s velocity.',
      'A’s velocity is one third of B’s velocity.',
      'A’s velocity is equal to B’s velocity.',
      'A’s velocity is nine times B’s velocity.',
      '',
    ],
    answer: ['A’s velocity is one third of B’s velocity.', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'calc',
    unit: 'mechanics',
    topic: 'momentum_impulse',
    subtopic: 'momentum_comparison',
    skills: ['momentum', 'mass_velocity_relationship'],
    difficulty: 2,
    exam_weight: 3,
    xp: 10,
    order: 7,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p1',
    clues: '- Write momentum as p = mv for each trolley, using their given masses.\n- Set the two momentum expressions equal to each other, since the trolleys have the same momentum.',
  },
  {
    name: 'Question 8',
    question: 'A ball of mass 0.5 kg moves at 6 m·s⁻¹. Calculate the magnitude of its momentum.',
    metadata: ['p = ', '[ ]', ' kg·m·s⁻¹'],
    answer: ['3', '', '', '', ''],
    presentation: 'fitb',
    type: 'calc',
    unit: 'mechanics',
    topic: 'momentum_impulse',
    subtopic: 'momentum_comparison',
    skills: ['momentum_calculation'],
    difficulty: 1,
    exam_weight: 3,
    xp: 10,
    order: 8,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p1',
    clues: '- Momentum is mass multiplied by velocity, p = mv.\n- Both values are given directly — substitute and multiply.',
  },
  {
    name: 'Question 9',
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
    order: 9,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p1',
    clues: '- Both the applied force and the friction force are constant in magnitude — what does that mean for the net force, and hence the acceleration?\n- Net work done is force × distance moved — think about how the distance travelled changes as the crate keeps moving.',
  },
  {
    name: 'Question 10',
    question: 'A block experiences a constant net force of 15 N while it moves a distance of 4 m in the direction of the force. Calculate the net work done on the block.',
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
    order: 10,
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
      number: '1.1',
      marks: 2,
      clues: '- Recall Newton’s second law: Fₙₑₜ = ma.\n- Think about what direction acceleration must point in relative to the net force.',
      approach: '- Consider each option against Newton’s second law.\n- Eliminate options that describe motion rather than the force-acceleration relationship.\n- Confirm that net force and acceleration are always in the same direction, whatever the object’s state of motion.',
      solution: '1. Newton’s second law states Fₙₑₜ = ma.\n2. Mass m is always positive, so acceleration a must point in the same direction as Fₙₑₜ.\n3. This holds regardless of the object’s direction of motion — eliminates A.\n4. The correct answer is B.',
    },
    {
      number: '1.2',
      marks: 2,
      clues: '- At the instant of release, the stone has the same velocity as the balloon.\n- After release, only gravity acts on the stone, so its velocity changes at a constant rate.',
      approach: '- Identify the stone’s initial velocity — it must equal the balloon’s velocity at the moment of release.\n- Determine the sign and constancy of the stone’s acceleration after release (gravity only).\n- Match the graph showing the stone’s line starting at the balloon’s line, then decreasing linearly through and past zero.',
      solution: '1. At release, the stone’s velocity equals the balloon’s velocity — the two lines must meet at that instant.\n2. After release, the only force on the stone is gravity, so a = −g (constant).\n3. The stone’s velocity therefore decreases linearly from the balloon’s velocity, becoming negative as it falls.\n4. Graph B shows exactly this: the stone’s line starts where the balloon’s line is, then slopes down at a constant negative gradient.\n5. The correct answer is B.',
    },
    {
      number: '1.3',
      marks: 2,
      clues: '- Constant velocity means the applied force equals the box’s weight, and both stay constant.\n- Power = force × velocity; also consider how height gained affects gravitational PE, and how constant velocity affects KE.',
      approach: '- Recognise that constant velocity means the motor’s force equals the box’s weight (both constant).\n- Power = F·v, so with both constant, the rate of work is constant.\n- KE stays constant (v constant), but gravitational PE increases as height increases, so mechanical energy increases.\n- Match these two conclusions to the given statements.',
      solution: '1. Constant velocity ⇒ the motor’s force equals the box’s weight (both constant).\n2. Power = F·v, and F and v are both constant, so the rate of work done is constant — statement (ii) is true, (i) is false.\n3. KE = ½mv² is constant since v is constant.\n4. Gravitational PE = mgh increases as the box rises.\n5. Mechanical energy = KE + PE, so it increases — statement (iii) is true, (iv) is false.\n6. The correct answer is C: (ii) and (iii) only.',
    },
    {
      number: '1.4',
      marks: 2,
      clues: '- Write momentum as p = mv for each object, using their given masses.\n- Set the two momentum expressions equal, since the objects have the same momentum.',
      approach: '- Express the momentum of P and Q in terms of their masses and velocities.\n- Equate the two expressions since p_P = p_Q.\n- Solve for v_P in terms of v_Q.',
      solution: '1. p_P = m·v_P and p_Q = 2m·v_Q\n2. p_P = p_Q ⇒ m·v_P = 2m·v_Q\n3. v_P = 2v_Q\n4. The velocity of P is twice the velocity of Q — the correct answer is C.',
    },
    {
      number: '1.5',
      marks: 2,
      clues: '- Both F and the kinetic friction force are constant in magnitude — consider what that means for the net force and hence the acceleration.\n- Net work done is force × distance moved — think about how the distance travelled changes as the block keeps moving.',
      approach: '- Calculate the net force: Fₙₑₜ = F − f_k = 18 − 6 = 12 N (constant).\n- Since Fₙₑₜ is constant and mass is constant, acceleration is constant (Newton’s second law).\n- Net work done = Fₙₑₜ × distance moved; as the block keeps moving, the distance increases, so the net work done increases over time.',
      solution: '1. Fₙₑₜ = F − f_k = 18 − 6 = 12 N (constant, since F and f_k are both constant)\n2. a = Fₙₑₜ / m — constant, since Fₙₑₜ and m are constant\n3. Wₙₑₜ = Fₙₑₜ·Δx — as the block continues moving, Δx increases, so Wₙₑₜ increases\n4. Acceleration: constant. Net work: increases.\n5. The correct answer is A.',
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
