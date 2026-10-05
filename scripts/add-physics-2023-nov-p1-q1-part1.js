#!/usr/bin/env node
/**
 * DBE Physical Sciences: Physics P1 — November 2023 — Question 1.1–1.5 (order 1)
 * Q1 Mechanics MCQs: Newton's second law, static friction on an incline, energy in vertical motion, momentum vs drop height, work done by forces.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-physics-2023-nov-p1-q1-part1.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-physics-2023-nov-p1-q1-part1.js --dry-run
 *   node scripts/add-physics-2023-nov-p1-q1-part1.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

const PAPER = 'https://media-dev.askmoreprepmore.app/exam_papers/dbe/physics/2023/nov_p1';
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
  year: 2023,
  paper: 'nov_p1',
  order: 1, // Q1 clustered by CAPS knowledge area (DESIGN-UNI-10) — part 1 of 4: Mechanics
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['newtons_second_law', 'static_friction', 'mechanical_energy', 'momentum', 'net_work'],
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
      'A trolley starts from rest on a frictionless track. A constant net force then acts on it in the direction of motion. Which ONE of the following describes the shape of its velocity-time graph?',
    metadata: [
      'A horizontal straight line',
      'A straight line with a constant positive gradient',
      'A curve whose gradient keeps increasing',
      'A curve whose gradient keeps decreasing',
      '',
    ],
    answer: ['A straight line with a constant positive gradient', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'interpretation',
    unit: 'mechanics', topic: 'newtons_laws', subtopic: 'net_force_acceleration',
    skills: ['newtons_second_law', 'constant_acceleration', 'velocity_time_relationship'],
    difficulty: 2, exam_weight: 3, xp: 10, order: 1,
    syllabus: 'dbe', subject: 'physics', year: 2023, paper: 'nov_p1',
    clues:
      '- Newton’s second law links a constant net force to a particular kind of acceleration.\n- The gradient of a velocity-time graph represents acceleration.',
  },
  {
    name: 'Question 2',
    question:
      'A 12 kg box rests, without moving, on a rough ramp inclined at 25° to the horizontal. Calculate the magnitude of the static frictional force acting on the box.',
    metadata: ['fₛ = ', '[ ]', ' N'],
    answer: ['49.70', '', '', '', ''],
    presentation: 'fitb',
    keyboard_type: 'standard_math',
    type: 'calc',
    unit: 'mechanics', topic: 'newtons_laws', subtopic: 'static_friction',
    skills: ['static_friction', 'force_components', 'force_balance'],
    difficulty: 3, exam_weight: 3, xp: 10, order: 2,
    syllabus: 'dbe', subject: 'physics', year: 2023, paper: 'nov_p1',
    clues:
      '- The box is stationary, so the net force along the ramp is zero.\n- Friction must balance the component of the weight that acts parallel to the ramp (mg sin θ).',
  },
  {
    name: 'Question 3',
    question:
      'A stone is thrown vertically upwards from the edge of a cliff and later falls into the sea below. J is the launch point, K is the highest point, M is halfway between the launch level and the sea, and N is just above the water. Ignore air friction. Arrange the points in order of INCREASING kinetic energy of the stone.',
    metadata: ['Point M', 'Point K', 'Point N', 'Point J'],
    answer: ['Point K', 'Point J', 'Point M', 'Point N'],
    presentation: 'ordering',
    type: 'application',
    unit: 'mechanics', topic: 'vertical_projectile_motion', subtopic: 'projectile_motion_sequence',
    skills: ['mechanical_energy', 'projectile_symmetry'],
    difficulty: 3, exam_weight: 2, xp: 10, order: 3,
    syllabus: 'dbe', subject: 'physics', year: 2023, paper: 'nov_p1',
    clues:
      '- With no air friction, mechanical energy is conserved, so kinetic energy is greatest where gravitational potential energy is smallest.\n- Think about where the stone momentarily has zero speed.',
  },
  {
    name: 'Question 4',
    question:
      'A ball dropped from rest from height h strikes the floor with momentum p. Ignore air friction. From what height must the same ball be dropped so that it strikes the floor with momentum 3p?',
    metadata: ['3h', '\\sqrt{3} h', '9h', '6h', ''],
    answer: ['9h', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'mechanics', topic: 'momentum_impulse', subtopic: 'momentum_comparison',
    skills: ['momentum', 'kinematics_equations'],
    difficulty: 4, exam_weight: 2, xp: 10, order: 4,
    syllabus: 'dbe', subject: 'physics', year: 2023, paper: 'nov_p1',
    clues:
      '- Momentum is proportional to the striking speed, since the mass does not change.\n- Use v(f)² = vᵢ² + 2gh to see how the striking speed depends on the drop height.',
  },
  {
    name: 'Question 5',
    question:
      'A suitcase is pulled at constant velocity along a rough horizontal floor by a strap held at an angle above the horizontal. Select ALL the forces that do work on the suitcase.',
    metadata: [
      'The tension in the strap',
      'The normal force from the floor',
      'The kinetic frictional force',
      'The gravitational force on the suitcase',
      '',
    ],
    answer: ['The tension in the strap', 'The kinetic frictional force', '', '', ''],
    presentation: 'multi_select',
    type: 'application',
    unit: 'mechanics', topic: 'work_energy_power', subtopic: 'work_energy_theorem_applications',
    skills: ['work_calculation', 'force_identification'],
    difficulty: 3, exam_weight: 3, xp: 10, order: 5,
    syllabus: 'dbe', subject: 'physics', year: 2023, paper: 'nov_p1',
    clues:
      '- A force does work only if it has a component along the displacement (W = FΔx cos θ).\n- A force acting at 90° to the displacement does no work.',
  },
];

// ─── AI explanation (AMPM-CONTENT-AI-EXP) — one entry per exam sub-question ───

const aiExplanation = {
  sub_questions: [
    {
      number: '1.1',
      marks: 2,
      clues: '- Newton’s second law: Fₙₑₜ = ma.\n- If Fₙₑₜ and m are both constant, what must a be?',
      approach: '- Write Newton’s second law, Fₙₑₜ = ma.\n- Note that the net force and the block’s mass are both constant.\n- Decide what that means for the acceleration, then match it to an option.',
      solution: '1. Fₙₑₜ = ma, so a = Fₙₑₜ/m.\n2. Fₙₑₜ is constant and the mass of the block does not change, so a is constant.\n3. A non-zero constant acceleration means the velocity changes at a steady rate, so it is not constant velocity (A), and the acceleration is not increasing or decreasing (C, D).\n4. Answer: B — the block moves with a constant acceleration.',
    },
    {
      number: '1.2',
      marks: 2,
      clues: '- The crate is stationary, so the net force on it is zero.\n- Which force does friction act against along the slope?',
      approach: '- Resolve the weight into components parallel and perpendicular to the plane.\n- Friction acts along the plane, so compare it only with forces along the plane.\n- Use the fact that the crate is in equilibrium along the plane.',
      solution: '1. The crate is at rest, so the net force along the plane is zero.\n2. Along the plane, only two forces act: the weight component parallel to the plane (mg sin θ, down the slope) and static friction (up the slope).\n3. For these to balance, friction must equal the parallel component exactly — not more (B).\n4. The perpendicular component is balanced by the normal force, not by friction (C, D).\n5. Answer: A.',
    },
    {
      number: '1.3',
      marks: 2,
      clues: '- Kinetic energy depends on speed — find where the ball is slowest and fastest.\n- At the top of its flight the ball is momentarily at rest.',
      approach: '- Identify the point with the lowest speed (Q, the highest point, where v = 0).\n- Identify the point with the greatest speed (S, just before reaching the ground, the lowest point).\n- The greatest change in kinetic energy is between those two points.',
      solution: '1. At Q (the highest point) the ball is momentarily at rest, so Eₖ = 0.\n2. P and R are at the same height (the top of the building), so the ball has the same speed and Eₖ at both — no change between P and R.\n3. S is the lowest point, so the ball has its greatest speed and greatest Eₖ there.\n4. The greatest change in Eₖ is from zero at Q to its maximum at S.\n5. Answer: D — Q and S.',
    },
    {
      number: '1.4',
      marks: 2,
      clues: '- Find how the striking speed depends on the drop height.\n- Momentum p = mv, and the mass stays the same.',
      approach: '- Use v(f)² = vᵢ² + 2gΔy with vᵢ = 0, so v(f) = √(2gh).\n- Halve the height and see what happens to v(f).\n- Since p = mv, the momentum changes by the same factor as the speed.',
      solution: '1. Dropped from rest: v(f)² = 2gh, so v(f) = √(2gh) — the speed is proportional to √h.\n2. From height ½h: v(f) = √(2g × ½h) = (1/√2) × √(2gh).\n3. The new speed is 1/√2 of the original, and p = mv with m unchanged.\n4. New momentum = (1/√2)p.\n5. Answer: B.',
    },
    {
      number: '1.5',
      marks: 2,
      clues: '- A force does work only if it has a component along the displacement.\n- The box moves horizontally — check each force’s direction against that.',
      approach: '- Identify the direction of the displacement (horizontal, along the surface).\n- For each force, decide whether it has a component along that direction.\n- Vertical forces are at 90° to the displacement and do no work (cos 90° = 0).',
      solution: '1. The box is displaced horizontally.\n2. P (normal force, vertically up) and R (weight, vertically down) are perpendicular to the displacement, so W = FΔx cos 90° = 0 for both.\n3. Q acts at an angle above the horizontal, so its horizontal component does work.\n4. S (friction) acts horizontally, opposite to the motion, so it does (negative) work.\n5. Answer: B — Q and S only.',
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
