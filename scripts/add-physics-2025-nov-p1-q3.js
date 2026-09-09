#!/usr/bin/env node
/**
 * DBE Physical Sciences: Physics P1 — November 2025 — Question 3 (order 6)
 * Vertical projectile motion: a ball thrown upward from a building, its fall, and
 * an inelastic bounce. One continuous scenario across 3.1-3.5 (free fall, time to
 * max height, impact velocity, elastic/inelastic reasoning, v-t graph) — bundled
 * into one lesson per subjects/dbe-physics.md's "Paper structure" rule 1.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-physics-2025-nov-p1-q3.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-physics-2025-nov-p1-q3.js --dry-run
 *   node scripts/add-physics-2025-nov-p1-q3.js
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

// ─── Phase 2 — lesson document ───────────────────────────────────────────────

const video = {
  name: 'Question 3',
  syllabus: 'dbe',
  subject: 'physics',
  year: 2025,
  paper: 'nov_p1',
  order: 6, // paper-wide position — after Q1 parts 1-4 (orders 1-4) and Q2 (order 5)
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['free_fall', 'vertical_projectile_motion', 'elastic_collision'],
  question_image_urls: [`${PAPER}/q3/question_1.png`],
  memo_image_urls: [`${PAPER}/q3/memo_1.png`, `${PAPER}/q3/memo_2.png`, `${PAPER}/q3/memo_3.png`, `${PAPER}/q3/memo_4.png`],
  exam_question_marks: 15,
  supplementary_materials: [
    {
      type: 'formula_sheet',
      label: 'Formula Sheet',
      image_urls: [`${PAPER}/q0/question_1.png`, `${PAPER}/q0/question_2.png`, `${PAPER}/q0/question_3.png`],
    },
  ],
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    name: 'Question 1',
    question: 'Which ONE of the following objects is undergoing free fall?',
    metadata: [
      'A skydiver who has reached terminal velocity, where air resistance balances their weight.',
      'A ball rolling down a frictionless ramp.',
      'A stone falling through the air, where air resistance on the stone is negligible.',
      'A parachutist descending at a constant velocity with an open parachute.',
      '',
    ],
    answer: ['A stone falling through the air, where air resistance on the stone is negligible.', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'mechanics',
    topic: 'vertical_projectile_motion',
    subtopic: 'free_fall_identification',
    skills: ['free_fall', 'gravity_only_motion'],
    difficulty: 3,
    exam_weight: 3,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p1',
    clues: '- Free fall means gravity is the only force acting — no air resistance, no normal force, no other contact force.\n- Check each scenario for any force besides weight acting on the object.',
  },
  {
    name: 'Question 2',
    question: 'A ball is thrown vertically upward with an initial velocity of 12 m·s⁻¹. Ignore air resistance. Calculate the time taken for the ball to reach its maximum height.',
    metadata: ['t = ', '[ ]', ' s'],
    answer: ['1.22', '', '', '', ''],
    presentation: 'fitb',
    type: 'calc',
    unit: 'mechanics',
    topic: 'vertical_projectile_motion',
    subtopic: 'projectile_motion_calculations',
    skills: ['kinematics_equations', 'time_calculation'],
    difficulty: 2,
    exam_weight: 3,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p1',
    clues: '- At maximum height, the ball’s velocity is momentarily zero.\n- Use v(f) = vᵢ + aΔt with a = −g, and solve for Δt.',
  },
  {
    name: 'Question 3',
    question:
      'A ball is thrown vertically upward from the top of a 10 m high tower with an initial velocity of 8 m·s⁻¹. Ignore air resistance. Calculate the magnitude of the velocity with which the ball strikes the ground.',
    metadata: ['v = ', '[ ]', ' m·s⁻¹'],
    answer: ['16.12', '', '', '', ''],
    presentation: 'fitb',
    type: 'calc',
    unit: 'mechanics',
    topic: 'vertical_projectile_motion',
    subtopic: 'projectile_motion_calculations',
    skills: ['kinematics_equations', 'velocity_time_relationship'],
    difficulty: 3,
    exam_weight: 3,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p1',
    clues: '- Take upward as positive. The ball ends up 10 m below its starting point, so Δy = −10 m.\n- Use v(f)² = vᵢ² + 2aΔy, and take the magnitude of the (negative) result.',
  },
  {
    name: 'Question 4',
    question: 'A rubber ball is dropped from a height of 2 m and bounces back up to a height of 1.5 m. Is the collision with the ground ELASTIC or INELASTIC?',
    metadata: [
      'Elastic, because momentum is conserved during the bounce.',
      'Inelastic, because the ball does not return to its original height, so kinetic energy was lost.',
      'Elastic, because the ball bounces back upward at all.',
      'Inelastic, because momentum is not conserved during the bounce.',
      '',
    ],
    answer: ['Inelastic, because the ball does not return to its original height, so kinetic energy was lost.', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'mechanics',
    topic: 'vertical_projectile_motion',
    subtopic: 'elastic_inelastic_collisions',
    skills: ['elastic_collisions', 'kinetic_energy_conservation'],
    difficulty: 2,
    exam_weight: 3,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p1',
    clues:
      '- Compare the ball’s height (and therefore its speed) just before impact to its height just after bouncing.\n- A lower rebound height means the ball left the ground slower than it arrived — kinetic energy was not conserved.',
  },
  {
    name: 'Question 5',
    question: 'Arrange the following stages of the ball’s motion, from being thrown upward to reaching its new maximum height after bouncing, in the correct order.',
    metadata: [
      'Decelerates again after bouncing, until it reaches its new (lower) maximum height',
      'Thrown upward with an initial velocity',
      'Bounces upward at a reduced speed compared to just before impact',
      'Accelerates downward and strikes the ground',
      'Decelerates while rising, reaching zero velocity at the highest point',
    ],
    answer: [
      'Thrown upward with an initial velocity',
      'Decelerates while rising, reaching zero velocity at the highest point',
      'Accelerates downward and strikes the ground',
      'Bounces upward at a reduced speed compared to just before impact',
      'Decelerates again after bouncing, until it reaches its new (lower) maximum height',
    ],
    presentation: 'ordering',
    type: 'interpretation',
    unit: 'mechanics',
    topic: 'vertical_projectile_motion',
    subtopic: 'projectile_motion_sequence',
    skills: ['projectile_motion_sequencing', 'graph_interpretation'],
    difficulty: 3,
    exam_weight: 3,
    xp: 10,
    order: 5,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p1',
    clues: '- Track the ball’s velocity sign and magnitude through each stage: positive and decreasing, zero, negative and increasing in magnitude, then a smaller positive value after the bounce.\n- The bounce itself is an instantaneous event that separates the downward fall from the second rise.',
  },
];

// ─── AI explanation (AMPM-CONTENT-AI-EXP) — one entry per exam sub-question ───

const aiExplanation = {
  sub_questions: [
    {
      number: '3.1',
      marks: 2,
      clues: '- Free fall is about which force(s) act on the object, not about its direction of motion.\n- State it in terms of the single force responsible for the motion.',
      approach: '- Recall that free fall describes motion where only one force acts on the object.\n- Identify that force as weight/gravity.\n- State the definition as a complete sentence, not just naming the force.',
      solution: '1. Free fall is motion under the influence of weight/gravitational force only.\n2. No other force (such as air resistance) acts on the object.',
    },
    {
      number: '3.2',
      marks: 3,
      clues: '- At time p, the ball’s velocity is zero — this is the moment it reaches maximum height.\n- Use v(f) = vᵢ + aΔt with the given initial velocity and a = −g (taking upward as positive).',
      approach: '- Identify that p is the time at which velocity = 0 (from the table).\n- Choose a direction convention (upward positive) and write v(f) = vᵢ + aΔt.\n- Substitute v(f) = 0, vᵢ = 15 m·s⁻¹, a = −9.8 m·s⁻², and solve for Δt.',
      solution: '1. v(f) = vᵢ + aΔt\n2. 0 = 15 + (−9.8)Δt\n3. Δt = 15 / 9.8\n4. p = 1.53 s',
    },
    {
      number: '3.3',
      marks: 3,
      clues: '- q is the magnitude of the velocity at t = 3.36 s, when the ball strikes the ground.\n- Use v(f) = vᵢ + aΔt with the total time of flight.',
      approach: '- Write v(f) = vᵢ + aΔt (upward positive).\n- Substitute vᵢ = 15 m·s⁻¹, a = −9.8 m·s⁻², Δt = 3.36 s.\n- Take the magnitude of the resulting (negative) velocity as q.',
      solution: '1. v(f) = vᵢ + aΔt\n2. v(f) = 15 + (−9.8)(3.36)\n3. v(f) = −17.93 m·s⁻¹\n4. q = 17.93 m·s⁻¹ (magnitude)',
    },
    {
      number: '3.4',
      marks: 3,
      clues: '- Compare the ball’s height before the bounce (from where it was thrown, or the point of impact) to its rebound height of 3 m.\n- Do not use any calculation to justify the answer — explain using energy reasoning only.',
      approach: '- Determine whether the rebound height is less than, equal to, or greater than before the bounce.\n- Since the height decreased, identify what this means for the ball’s kinetic energy immediately after the bounce compared to immediately before.\n- Conclude elastic or inelastic based on whether kinetic energy was conserved.',
      solution: '1. The collision is inelastic.\n2. The height after the bounce (3 m) is less than before the bounce.\n3. This means the velocity (and therefore kinetic energy) after the bounce is less than before it — kinetic energy was not conserved (converted to heat and sound).',
    },
    {
      number: '3.5',
      marks: 4,
      clues: '- Plot velocity (not speed) against time — the sign shows direction, so the graph starts positive and ends negative before the bounce.\n- Use the values already found: initial velocity 15 m·s⁻¹, time p = 1.53 s (where the line crosses the time-axis), and velocity q at t = 3.36 s.',
      approach: '- Draw a straight line starting at v = 15 m·s⁻¹ at t = 0, with a constant negative gradient (−9.8 m·s⁻²).\n- Mark the line crossing the time-axis at t = p = 1.53 s.\n- Continue the line to t = 3.36 s, ending at v = −q (17.93 m·s⁻¹ below the axis) — this is the instant of impact.\n- After the bounce, draw a new line starting at a smaller positive velocity than 15 m·s⁻¹ (since the bounce is inelastic), with the same negative gradient, ending at v = 0.',
      solution: '1. From t = 0 to t = 3.36 s: a straight line from (0, 15) to (3.36, −17.93), crossing the time-axis at t = 1.53 s.\n2. At t = 3.36 s, the ball bounces: the graph jumps from −17.93 m·s⁻¹ to a smaller positive velocity (less than 15 m·s⁻¹, since the bounce is inelastic).\n3. From the bounce onward: a straight line with the same negative gradient, ending at v = 0 at the new maximum height.',
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
