#!/usr/bin/env node
/**
 * DBE Physical Sciences: Physics P1 — November 2023 — Question 3 (order 6)
 * Vertical projectile motion: free fall, launch speed, kinetic energy lost in a bounce, time to maximum height, velocity-time graph.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-physics-2023-nov-p1-q3.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-physics-2023-nov-p1-q3.js --dry-run
 *   node scripts/add-physics-2023-nov-p1-q3.js
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
  name: 'Question 3',
  syllabus: 'dbe',
  subject: 'physics',
  year: 2023,
  paper: 'nov_p1',
  order: 6,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['free_fall', 'vertical_projectile_motion', 'velocity_time_graphs'],
  question_image_urls: [`${PAPER}/q3/question_1.png`, `${PAPER}/q3/question_2.png`],
  memo_image_urls: [
    `${PAPER}/q3/memo_1.png`, `${PAPER}/q3/memo_2.png`, `${PAPER}/q3/memo_3.png`, `${PAPER}/q3/memo_4.png`,
    `${PAPER}/q3/memo_5.png`, `${PAPER}/q3/memo_6.png`, `${PAPER}/q3/memo_7.png`,
  ],
  exam_question_marks: 16,
  supplementary_materials: [FORMULA_SHEET],
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    name: 'Question 1',
    question:
      'A tennis ball is thrown vertically upwards and caught again. Air friction is negligible. During which part of its flight is the ball in free fall?',
    metadata: [
      'Only on the way down, after it passes the top',
      'Only on the way up, while it is slowing down',
      'At every moment between release and catch',
      'Only at the top, where its velocity is zero',
      '',
    ],
    answer: ['At every moment between release and catch', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'mechanics', topic: 'vertical_projectile_motion', subtopic: 'free_fall_identification',
    skills: ['free_fall', 'gravity_only_motion'],
    difficulty: 2, exam_weight: 3, xp: 10, order: 1,
    syllabus: 'dbe', subject: 'physics', year: 2023, paper: 'nov_p1',
    clues:
      '- Free fall is defined by which forces act on the object, not by its direction of motion.\n- Ask whether any force other than gravity acts on the ball once it leaves the hand.',
  },
  {
    name: 'Question 2',
    question:
      'A stone is thrown vertically upwards from a bridge and rises 7.2 m above the point of release. Ignore air friction. Using equations of motion, calculate the speed at which the stone was thrown.',
    metadata: ['vᵢ = ', '[ ]', ' m·s⁻¹'],
    answer: ['11.88|11.879', '', '', '', ''],
    presentation: 'fitb',
    type: 'calc',
    unit: 'mechanics', topic: 'vertical_projectile_motion', subtopic: 'projectile_motion_calculations',
    skills: ['kinematics_equations', 'free_fall'],
    difficulty: 2, exam_weight: 3, xp: 10, order: 2,
    syllabus: 'dbe', subject: 'physics', year: 2023, paper: 'nov_p1',
    clues:
      '- At the highest point the stone’s velocity is zero.\n- Use the equation of motion that links velocities, acceleration and displacement without time.',
  },
  {
    name: 'Question 3',
    question:
      'A 0.4 kg ball is dropped from rest from a height of 11.25 m. It strikes the ground and rebounds vertically upwards at 9 m·s⁻¹. Ignore air friction. Complete the working to calculate the kinetic energy lost during the collision.',
    metadata: [
      'Downwards positive: v(f)² = vᵢ² + 2aΔy = 0 + 2(9.8)(11.25) = 220.5, so the ball strikes the ground with v² = 220.5 m²·s⁻²',
      'ΔEₖ = ½mv(after)² − ½mv(before)² = ½(0.4)(9)² − ½(0.4)(220.5), so the kinetic energy lost (in J):',
      '[ ]',
    ],
    answer: ['27.9'],
    presentation: 'steps',
    type: 'calc',
    unit: 'mechanics', topic: 'vertical_projectile_motion', subtopic: 'elastic_inelastic_collisions',
    skills: ['kinetic_energy_calculation', 'kinematics_equations'],
    difficulty: 4, exam_weight: 3, xp: 10, order: 3,
    syllabus: 'dbe', subject: 'physics', year: 2023, paper: 'nov_p1',
    clues:
      '- Work out each kinetic energy term separately before subtracting.\n- The change comes out negative because energy is lost — give the amount lost as a positive number.',
  },
  {
    name: 'Question 4',
    question:
      'A ball leaves the ground vertically upwards with a speed of 13.3 m·s⁻¹. Ignore air friction. Calculate the time it takes to reach its maximum height.',
    metadata: ['Δt = ', '[ ]', ' s'],
    answer: ['1.36|1.357', '', '', '', ''],
    presentation: 'fitb',
    type: 'calc',
    unit: 'mechanics', topic: 'vertical_projectile_motion', subtopic: 'projectile_motion_calculations',
    skills: ['time_calculation', 'kinematics_equations'],
    difficulty: 2, exam_weight: 3, xp: 10, order: 4,
    syllabus: 'dbe', subject: 'physics', year: 2023, paper: 'nov_p1',
    clues:
      '- The velocity at maximum height is zero.\n- Use v(f) = vᵢ + aΔt, keeping the signs consistent with your chosen positive direction.',
  },
  {
    name: 'Question 5',
    question:
      'A ball is thrown upwards from a balcony, falls to the ground and bounces. Its velocity-time graph is drawn from release until it reaches the top of its first bounce. Ignore air friction. Match each feature of the graph to what it represents.',
    metadata: [
      'A - The gradient of each straight-line section',
      'B - A point where a sloping section crosses the time axis',
      'C - The sudden jump in velocity at the bounce',
      'D - The area between the graph and the time axis',
      '1 - The ball is at a maximum height',
      '2 - The displacement of the ball',
      '3 - The acceleration due to gravity',
      '4 - The change in velocity during contact with the ground',
    ],
    answer: ['A-3', 'B-1', 'C-4', 'D-2'],
    presentation: 'match',
    type: 'interpretation',
    unit: 'mechanics', topic: 'motion_1d', subtopic: 'velocity_time_graphs',
    skills: ['graph_interpretation', 'velocity_time_relationship'],
    difficulty: 3, exam_weight: 3, xp: 10, order: 5,
    syllabus: 'dbe', subject: 'physics', year: 2023, paper: 'nov_p1',
    clues:
      '- On a velocity-time graph, the gradient gives one quantity and the area gives another.\n- Velocity is zero where the graph meets the time axis — think about where in the flight that happens.',
  },
  {
    name: 'Question 6',
    question:
      'A ball rebounds from the floor and reaches its highest point 0.85 s after leaving the floor. Ignore air friction. How long after reaching its highest point does it land on the floor again?',
    metadata: ['0.43 s', '1.70 s', '0.60 s', '0.85 s', ''],
    answer: ['0.85 s', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'mechanics', topic: 'vertical_projectile_motion', subtopic: 'projectile_motion_calculations',
    skills: ['projectile_symmetry', 'time_calculation'],
    difficulty: 2, exam_weight: 2, xp: 10, order: 6,
    syllabus: 'dbe', subject: 'physics', year: 2023, paper: 'nov_p1',
    clues:
      '- With no air friction, the upward and downward parts of the motion are mirror images.\n- Compare the distance and acceleration on the way up with those on the way down.',
  },
];

// ─── AI explanation (AMPM-CONTENT-AI-EXP) — one entry per exam sub-question ───

const aiExplanation = {
  sub_questions: [
    {
      number: '3.1',
      marks: 2,
      clues: '- The definition is about which force acts on the object.\n- Do not define a projectile — that earns no marks.',
      approach: '- State that the motion is under the influence of one force only.\n- Name that force: the gravitational force (weight).',
      solution: '1. Free fall is motion during which the only force acting on the object is the gravitational force (weight).\n2. Equivalent wording: motion under the influence of the gravitational force only.\n3. Defining a "projectile" instead scores 0/2.',
    },
    {
      number: '3.2',
      marks: 3,
      clues: '- At the maximum height the ball’s velocity is zero.\n- Use the equation of motion without time, with Δy = 5.89 m.',
      approach: '- Take upwards as positive, so a = −9.8 m·s⁻².\n- From the top of the building to the maximum height: v(f) = 0 and Δy = 5.89 m.\n- Use v(f)² = vᵢ² + 2aΔy and solve for vᵢ.',
      solution: '1. Upwards positive: v(f)² = vᵢ² + 2aΔy.\n2. 0² = vᵢ² + 2(−9.8)(5.89).\n3. vᵢ² = 115.44.\n4. vᵢ = 10.74 m·s⁻¹.\n5. Using energy principles instead earns at most 1/3, because the question says "using only equations of motion".',
    },
    {
      number: '3.3.1',
      marks: 5,
      clues: '- First find the speed at which the ball strikes the ground.\n- Then compare its kinetic energy just before and just after the collision.',
      approach: '- Find the striking velocity from the top of the building to the ground: vᵢ = 10.74 m·s⁻¹ upwards, Δy = −15.3 m, a = −9.8 m·s⁻².\n- Use v(f)² = vᵢ² + 2aΔy to get the striking speed (20.38 m·s⁻¹).\n- Calculate ΔEₖ = ½m(v(f)² − vᵢ²) using 11.92 m·s⁻¹ after and 20.38 m·s⁻¹ before the collision.',
      solution: '1. Top of building to ground, upwards positive: v(f)² = vᵢ² + 2aΔy = (10.74)² + 2(−9.8)(−15.3).\n2. v(f)² = 415.23, so the ball strikes the ground at 20.38 m·s⁻¹ (downwards).\n3. During the collision: ΔEₖ = ½mv(f)² − ½mvᵢ² = ½(0.5)[(11.92)² − (20.38)²].\n4. ΔEₖ = 35.52 − 103.84 = −68.31 J.\n5. Kinetic energy lost = 68.31 J (accepted range 67.91 J – 69.34 J).',
    },
    {
      number: '3.3.2',
      marks: 3,
      clues: '- At point P (the top of the bounce) the velocity is zero.\n- Use the speed with which the ball leaves the ground.',
      approach: '- Take upwards as positive: vᵢ = 11.92 m·s⁻¹, v(f) = 0, a = −9.8 m·s⁻².\n- Use v(f) = vᵢ + aΔt.\n- Solve for Δt.',
      solution: '1. Upwards positive: v(f) = vᵢ + aΔt.\n2. 0 = 11.92 + (−9.8)Δt.\n3. Δt = 1.22 s.',
    },
    {
      number: '3.4.1',
      marks: 1,
      clues: '- K is the velocity at t₁ just after the jump in the graph.\n- What happens to the ball at that instant?',
      approach: '- Identify t₁ as the moment the ball bounces off the ground.\n- K is the velocity just after the bounce, i.e. the speed at which it leaves the ground.',
      solution: '1. The vertical jump at t₁ is the collision with the ground.\n2. K is the velocity with which the ball leaves the ground.\n3. K = 11.92 m·s⁻¹.',
    },
    {
      number: '3.4.2',
      marks: 1,
      clues: '- L is the velocity at t = 0.\n- What is the ball doing at t = 0?',
      approach: '- At t = 0 the ball is projected from the top of the building.\n- So L is the launch speed found in 3.2.',
      solution: '1. L is the velocity at the instant of projection.\n2. L = 10.74 m·s⁻¹ (from 3.2).',
    },
    {
      number: '3.4.3',
      marks: 1,
      clues: '- t₁ is the bounce and t₂ is where the velocity reaches zero again.\n- You have already calculated this time interval.',
      approach: '- Identify t₂ − t₁ as the time from leaving the ground until reaching point P.\n- Use the answer from 3.3.2.',
      solution: '1. Between t₁ (leaving the ground) and t₂ (velocity zero at P) the ball rises to point P.\n2. t₂ − t₁ = 1.22 s (from 3.3.2).',
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
