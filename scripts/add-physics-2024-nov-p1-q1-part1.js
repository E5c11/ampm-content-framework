#!/usr/bin/env node
/**
 * DBE Physical Sciences: Physics P1 — November 2024 — Question 1.1–1.5 (order 1)
 * Q1 Mechanics MCQs: equilibrium, area under an a-t graph, momentum vs kinetic energy, work on an incline, impulse on a bouncing ball.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-physics-2024-nov-p1-q1-part1.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-physics-2024-nov-p1-q1-part1.js --dry-run
 *   node scripts/add-physics-2024-nov-p1-q1-part1.js
 */

'use strict';


const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

const PAPER = 'https://media-dev.askmoreprepmore.app/exam_papers/dbe/physics/2024/nov_p1';
const FORMULA_SHEET = {
  type: 'formula_sheet',
  label: 'Formula Sheet',
  image_urls: [`${PAPER}/q0/question_1.png`, `${PAPER}/q0/question_2.png`, `${PAPER}/q0/question_3.png`],
};

// ─── Phase 2 — lesson document ───────────────────────────────────────────────

const video = {
  name: 'Question 1.1–1.5',
  syllabus: 'dbe',
  subject: 'physics',
  year: 2024,
  paper: 'nov_p1',
  order: 1, // Q1 clustered by CAPS knowledge area (DESIGN-UNI-10) — part 1 of 4: Mechanics
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['newtons_second_law', 'velocity_time_graphs', 'momentum', 'net_work', 'impulse'],
  question_image_urls: [`${PAPER}/q1/question_1.png`, `${PAPER}/q1/question_2.png`, `${PAPER}/q1/question_3.png`],
  memo_image_urls: [`${PAPER}/q1/memo_1.png`],
  exam_question_marks: 10,
  supplementary_materials: [FORMULA_SHEET],
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    name: 'Question 1',
    question:
      'A crate is pushed across a rough floor, and all the forces acting on it are balanced. Which ONE of the following quantities MUST be zero for the crate?',
    metadata: ['Its velocity', 'Its acceleration', 'Its kinetic energy', 'Its momentum', ''],
    answer: ['Its acceleration', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'mechanics', topic: 'newtons_laws', subtopic: 'net_force_acceleration',
    skills: ['net_force', 'newtons_second_law', 'constant_velocity_motion'],
    difficulty: 2, exam_weight: 3, xp: 10, order: 1,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p1',
    clues:
      '- Balanced forces mean the net force is zero.\n- Newton’s second law links the net force to one of these quantities directly. The others can stay non-zero while the crate keeps moving.',
  },
  {
    name: 'Question 2',
    question: 'Match each feature of a motion graph to the physical quantity it represents.',
    metadata: [
      'A - Area under an acceleration-time graph',
      'B - Gradient of a velocity-time graph',
      'C - Area under a velocity-time graph',
      'D - Gradient of a position-time graph',
      '1 - Displacement',
      '2 - Velocity',
      '3 - Change in velocity',
      '4 - Acceleration',
    ],
    answer: ['A-3', 'B-4', 'C-1', 'D-2'],
    presentation: 'match',
    type: 'interpretation',
    unit: 'mechanics', topic: 'motion_1d', subtopic: 'velocity_time_graphs',
    skills: ['area_under_graph', 'graph_gradient_interpretation', 'graph_interpretation'],
    difficulty: 3, exam_weight: 3, xp: 10, order: 2,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p1',
    clues:
      '- A gradient is “y-quantity per x-quantity”, and an area is “y-quantity times x-quantity”.\n- Work out the units of each product or ratio (for example, m·s⁻² × s) and see which quantity has those units.',
  },
  {
    name: 'Question 3',
    question:
      'A trolley has momentum p and kinetic energy K. After a collision its mass is unchanged and the magnitude of its momentum is \\frac{1}{3}p. What is its kinetic energy after the collision?',
    metadata: ['\\frac{1}{3}K', '\\frac{1}{9}K', '9K', '3K', ''],
    answer: ['\\frac{1}{9}K', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'mechanics', topic: 'momentum_impulse', subtopic: 'momentum_comparison',
    skills: ['momentum', 'kinetic_energy_calculation', 'mass_velocity_relationship'],
    difficulty: 4, exam_weight: 3, xp: 10, order: 3,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p1',
    clues:
      '- With the mass fixed, momentum is proportional to speed.\n- Kinetic energy depends on the SQUARE of the speed.',
  },
  {
    name: 'Question 4',
    question:
      'A box is lowered down a rough incline by a rope parallel to the incline, pulling up the slope. The box moves down at CONSTANT VELOCITY. How does the work done by the gravitational force compare with the work done by friction and by the rope?',
    metadata: [
      'It is greater than the sum of their magnitudes',
      'It is less than the sum of their magnitudes',
      'It is equal to the difference between them',
      'It is equal to the sum of their magnitudes',
      '',
    ],
    answer: ['It is equal to the sum of their magnitudes', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'mechanics', topic: 'work_energy_power', subtopic: 'work_energy_theorem_applications',
    skills: ['work_energy_theorem', 'net_work', 'work_calculation'],
    difficulty: 4, exam_weight: 3, xp: 10, order: 4,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p1',
    clues:
      '- Constant velocity means the kinetic energy does not change, so the net work done is zero.\n- Gravity does positive work here; friction and the rope both act up the slope and do negative work.',
  },
  {
    name: 'Question 5',
    question:
      'A ball thrown horizontally strikes a vertical wall at speed v and bounces straight back, losing some kinetic energy in the collision. Which combination is CORRECT for the impulse on the ball and its rebound speed?',
    metadata: [
      'Impulse towards the wall; rebound speed less than v',
      'Impulse away from the wall; rebound speed greater than v',
      'Impulse towards the wall; rebound speed equal to v',
      'Impulse away from the wall; rebound speed less than v',
      '',
    ],
    answer: ['Impulse away from the wall; rebound speed less than v', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'mechanics', topic: 'momentum_impulse', subtopic: 'impulse_calculations',
    skills: ['impulse_momentum_theorem', 'kinetic_energy_conservation'],
    difficulty: 3, exam_weight: 3, xp: 10, order: 5,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p1',
    clues:
      '- Impulse equals the change in momentum, so it points the same way as Δp.\n- The ball’s velocity reverses. Which way must the change in momentum point?',
  },
  {
    name: 'Question 6',
    question:
      'A 0.2 kg ball falls vertically and strikes the floor at 6 m·s⁻¹. It rebounds vertically upwards at 4 m·s⁻¹. Calculate the magnitude of the impulse that the floor exerts on the ball.',
    metadata: ['Impulse = ', '[ ]', ' N·s'],
    answer: ['2.00', '', '', '', ''],
    presentation: 'fitb',
    keyboard_type: 'standard_math',
    type: 'calc',
    unit: 'mechanics', topic: 'momentum_impulse', subtopic: 'impulse_calculations',
    skills: ['impulse_momentum_theorem', 'momentum_calculation'],
    difficulty: 3, exam_weight: 3, xp: 10, order: 6,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p1',
    clues:
      '- Choose upwards as positive, so the velocity before the bounce is negative.\n- Use Δp = mv(f) − mvᵢ, and watch the signs.',
  },
];

// ─── AI explanation (AMPM-CONTENT-AI-EXP) — one entry per exam sub-question ───

const aiExplanation = {
  sub_questions: [
    {
      number: '1.1',
      marks: 2,
      clues: '- Forces in equilibrium add up to a zero net force.\n- What does Newton’s first law say about an object with zero net force?',
      approach: '- Work out the net force when the forces are in equilibrium.\n- Use Newton’s second law to find the acceleration.\n- Decide which statement matches zero acceleration for a moving object.',
      solution: '1. In equilibrium the net force is zero.\n2. Fnet = ma, so the acceleration is zero.\n3. A moving object with zero acceleration keeps a constant velocity, so its speed and kinetic energy do not change.\n4. A (speed increasing), C (kinetic energy decreasing) and D (non-zero acceleration) all need a net force.\n5. Answer: B — the object is moving at a constant velocity.',
    },
    {
      number: '1.2',
      marks: 2,
      clues: '- The area under a graph is the y-quantity multiplied by the x-quantity.\n- Acceleration × time gives which quantity?',
      approach: '- Multiply the units on the two axes: m·s⁻² × s.\n- Identify the quantity with those units.\n- Remember that a = Δv/Δt, so a × Δt = Δv.',
      solution: '1. The shaded area = acceleration × time = (9.8)(t).\n2. The units are m·s⁻² × s = m·s⁻¹, which is a velocity unit.\n3. Since a = Δv/Δt, the product aΔt is the change in velocity, not the final velocity (the stone was already moving downwards at t = 0).\n4. Answer: D — the change in velocity of the stone.',
    },
    {
      number: '1.3',
      marks: 2,
      clues: '- Momentum p = mv, so halving the momentum (mass fixed) halves the speed.\n- K = ½mv² depends on the square of the speed.',
      approach: '- Find the new speed from the new momentum.\n- Substitute the new speed into K = ½mv².\n- Compare with the original kinetic energy.',
      solution: '1. p = mv and the mass is constant, so the new speed is ½v.\n2. New K = ½m(½v)² = ¼(½mv²).\n3. The new kinetic energy is ¼K. (Direction does not matter, since kinetic energy is a scalar.)\n4. Answer: A — ¼K.',
    },
    {
      number: '1.4',
      marks: 2,
      clues: '- The box speeds up, so its kinetic energy increases and the net work is positive.\n- F and friction both act up the incline, opposite to the motion.',
      approach: '- Write Wnet = W(gravity) + W(F) + W(friction) = ΔK.\n- Note that ΔK is positive (the box accelerates from rest).\n- W(F) and W(friction) are negative, so compare W(gravity) with the sum of their magnitudes.',
      solution: '1. The box accelerates down the incline, so ΔK > 0 and Wnet > 0.\n2. Gravity does positive work. F and friction act up the incline, opposite to the displacement, so they both do negative work.\n3. W(gravity) − (|W(F)| + |W(friction)|) > 0.\n4. So the work done by gravity is greater than the sum of the work done by friction and by F.\n5. Answer: C.',
    },
    {
      number: '1.5',
      marks: 2,
      clues: '- The impulse equals the change in momentum of the ball.\n- Point B is lower than point A. What does that tell you about the rebound speed?',
      approach: '- Find the direction of Δp: the velocity changes from downward to upward.\n- Compare the heights: the ball does not return to A, so it lost kinetic energy at the ground.\n- Combine the two answers.',
      solution: '1. Before the bounce the momentum is downward; after it, upward. Δp = p(f) − pᵢ points upward, so the impulse on the ball is upward.\n2. The ball reaches B, which is lower than A, so it leaves the ground with less kinetic energy than it arrived with.\n3. Its speed when leaving the ground is therefore less than v.\n4. Answer: C — upward; less than v.',
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
