#!/usr/bin/env node
/**
 * DBE Physical Sciences: Physics P1 — November 2023 — Question 2 (order 5)
 * Newton's second law for two connected blocks accelerated up a rough incline; free-body diagram; effect of incline angle on kinetic friction.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-physics-2023-nov-p1-q2.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-physics-2023-nov-p1-q2.js --dry-run
 *   node scripts/add-physics-2023-nov-p1-q2.js
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
  name: 'Question 2',
  syllabus: 'dbe',
  subject: 'physics',
  year: 2023,
  paper: 'nov_p1',
  order: 5, // after Q1 parts 1-4 (orders 1-4)
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['newtons_second_law', 'free_body_diagram', 'kinetic_friction'],
  question_image_urls: [`${PAPER}/q2/question_1.png`],
  memo_image_urls: [`${PAPER}/q2/memo_1.png`, `${PAPER}/q2/memo_2.png`],
  exam_question_marks: 16,
  supplementary_materials: [FORMULA_SHEET],
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    name: 'Question 1',
    question:
      'A net force F gives a cart of mass m an acceleration a. The net force is now tripled and the mass of the cart is halved. What is the new acceleration?',
    metadata: ['1.5a', '3a', '6a', '9a', ''],
    answer: ['6a', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'mechanics', topic: 'newtons_laws', subtopic: 'net_force_acceleration',
    skills: ['newtons_second_law', 'mass_acceleration_relationship'],
    difficulty: 2, exam_weight: 3, xp: 10, order: 1,
    syllabus: 'dbe', subject: 'physics', year: 2023, paper: 'nov_p1',
    clues:
      '- Newton’s second law says acceleration is directly proportional to net force and inversely proportional to mass.\n- Apply each change as a separate factor, then combine them.',
  },
  {
    name: 'Question 2',
    question:
      'A block is pulled up a rough inclined plane by a light string that is parallel to the plane. Select ALL the statements that correctly describe a force on the block’s free-body diagram.',
    metadata: [
      'Tension, directed up the plane, parallel to its surface',
      'Kinetic friction, directed down the plane',
      'Normal force, directed vertically upwards',
      'Normal force, perpendicular to the plane’s surface',
      'Kinetic friction, directed up the plane',
    ],
    answer: [
      'Tension, directed up the plane, parallel to its surface',
      'Kinetic friction, directed down the plane',
      'Normal force, perpendicular to the plane’s surface',
      '',
      '',
    ],
    presentation: 'multi_select',
    type: 'interpretation',
    unit: 'mechanics', topic: 'newtons_laws', subtopic: 'free_body_diagrams',
    skills: ['incline_free_body_diagram', 'force_identification', 'normal_force'],
    difficulty: 3, exam_weight: 3, xp: 10, order: 2,
    syllabus: 'dbe', subject: 'physics', year: 2023, paper: 'nov_p1',
    clues:
      '- Kinetic friction always opposes the direction in which the block is sliding.\n- The normal force is always perpendicular to the surface that exerts it.',
  },
  {
    name: 'Question 3',
    question:
      'Blocks X (3 kg) and Y are joined by a light string on a rough plane inclined at 30°. A force pulls Y up the plane, and X trails below it. The system accelerates up the plane at 1.5 m·s⁻². The kinetic frictional force on X is 4.5 N. Complete the working to calculate the tension in the string.',
    metadata: [
      'For X, up the plane positive: Fₙₑₜ = ma, so T − fₖ − mg sin θ = ma',
      'T − 4.5 − (3)(9.8) sin 30° = (3)(1.5), so T (in N):',
      '[ ]',
    ],
    answer: ['23.7'],
    presentation: 'steps',
    keyboard_type: 'scientific_math',
    type: 'calc',
    unit: 'mechanics', topic: 'newtons_laws', subtopic: 'net_force_acceleration',
    skills: ['newtons_second_law', 'net_force', 'force_components'],
    difficulty: 3, exam_weight: 3, xp: 10, order: 3,
    syllabus: 'dbe', subject: 'physics', year: 2023, paper: 'nov_p1',
    clues:
      '- Evaluate the weight component down the plane, (3)(9.8) sin 30°, first.\n- Then move every term except T to the right-hand side.',
  },
  {
    name: 'Question 4',
    question:
      'A 5 kg block on a rough plane inclined at 30° is pulled up the plane by a force F parallel to the plane. A string attached to a second block below it pulls down the plane on the 5 kg block with a tension of 20 N. The kinetic frictional force on the 5 kg block is 7 N, and it accelerates up the plane at 1.2 m·s⁻². Calculate the magnitude of F.',
    metadata: ['F = ', '[ ]', ' N'],
    answer: ['57.5', '', '', '', ''],
    presentation: 'fitb',
    keyboard_type: 'standard_math',
    type: 'calc',
    unit: 'mechanics', topic: 'newtons_laws', subtopic: 'net_force_acceleration',
    skills: ['newtons_second_law', 'net_force', 'force_components'],
    difficulty: 4, exam_weight: 3, xp: 10, order: 4,
    syllabus: 'dbe', subject: 'physics', year: 2023, paper: 'nov_p1',
    clues:
      '- Three forces act down the plane on this block: the tension, friction and the parallel component of its weight.\n- Apply Fₙₑₜ = ma along the plane, taking up the plane as positive.',
  },
  {
    name: 'Question 5',
    question:
      'A box slides down a rough inclined plane. The angle of the plane is now INCREASED while the box keeps sliding. How does the kinetic frictional force on the box change?',
    metadata: [
      'Increases, because the normal force mg cos θ increases',
      'Decreases, because the normal force mg cos θ decreases',
      'Stays the same, because μₖ and the box’s mass do not change',
      'Increases, because the parallel component mg sin θ increases',
      '',
    ],
    answer: ['Decreases, because the normal force mg cos θ decreases', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'mechanics', topic: 'newtons_laws', subtopic: 'kinetic_friction_and_work',
    skills: ['kinetic_friction', 'normal_force'],
    difficulty: 3, exam_weight: 3, xp: 10, order: 5,
    syllabus: 'dbe', subject: 'physics', year: 2023, paper: 'nov_p1',
    clues:
      '- Kinetic friction depends on μₖ and on the normal force only (fₖ = μₖN).\n- On an incline, the normal force balances the perpendicular component of the weight.',
  },
];

// ─── AI explanation (AMPM-CONTENT-AI-EXP) — one entry per exam sub-question ───

const aiExplanation = {
  sub_questions: [
    {
      number: '2.1',
      marks: 2,
      clues: '- The law connects three things: net force, acceleration and mass.\n- Include the direction of the acceleration and both proportionalities.',
      approach: '- Start with what happens when a net force acts on an object.\n- State the direction of the acceleration.\n- State how the acceleration depends on net force (directly) and on mass (inversely).',
      solution: '1. When a net (resultant) force acts on an object, the object accelerates in the direction of the net force.\n2. The acceleration is directly proportional to the net force.\n3. The acceleration is inversely proportional to the mass of the object.\n4. Full statement: "When a net force acts on an object, the object accelerates in the direction of the force. The acceleration is directly proportional to the net force and inversely proportional to the mass of the object."\n5. Also accepted: the net force acting on an object equals the rate of change of momentum of the object, in the direction of the net force.',
    },
    {
      number: '2.2',
      marks: 4,
      clues: '- Block A is pulled up the slope by the string and slides against a rough surface.\n- Draw every force as an arrow from one dot, and label each one.',
      approach: '- List the forces on block A: weight, normal force, tension in the string and kinetic friction.\n- Give each its direction: weight vertically down, normal force perpendicular to the plane, tension up the plane, friction down the plane (opposing the motion).\n- Draw them as labelled arrows starting at one dot.',
      solution: '1. Weight (w or Fg, 39.2 N): vertically downward.\n2. Normal force (N): perpendicular to the plane, away from the surface.\n3. Tension (T): parallel to the plane, pointing up the slope (towards block B).\n4. Kinetic friction (f or fₖ, 5.88 N): parallel to the plane, pointing down the slope, opposite to the motion.\n5. Each force earns a mark for the arrow and label. Any extra force, or arrows that do not touch the dot, limits the mark to 3/4.',
    },
    {
      number: '2.3.1',
      marks: 4,
      clues: '- Apply Newton’s second law to block A only.\n- Along the plane: tension acts up; friction and the parallel weight component act down.',
      approach: '- Choose up the incline as positive and isolate block A.\n- Write Fₙₑₜ = ma as T − fₖ − mg sin θ = ma.\n- Substitute m = 4 kg, fₖ = 5.88 N, θ = 35° and a = 2 m·s⁻², then solve for T.',
      solution: '1. For block A, up the incline positive: Fₙₑₜ = ma.\n2. T − fₖ − mg sin θ = ma.\n3. T − 5.88 − (4)(9.8) sin 35° = (4)(2).\n4. T − 5.88 − 22.48 = 8.\n5. T = 36.36 N.',
    },
    {
      number: '2.3.2',
      marks: 3,
      clues: '- Now isolate block B — the string pulls it DOWN the plane.\n- Use the tension from 2.3.1.',
      approach: '- For block B, up the incline positive: F acts up; tension, friction and mg sin θ act down.\n- Write F − T − fₖ − mg sin θ = ma.\n- Substitute T = 36.36 N, fₖ = 13.23 N, m = 9 kg, θ = 35°, a = 2 m·s⁻², and solve for F.',
      solution: '1. For block B, up the incline positive: F − T − fₖ − mg sin θ = ma.\n2. F − 36.36 − 13.23 − (9)(9.8) sin 35° = (9)(2).\n3. F − 36.36 − 13.23 − 50.59 = 18.\n4. F = 118.18 N.\n5. (Using the system approach instead only earns the mark for the final answer.)',
    },
    {
      number: '2.4.1',
      marks: 1,
      clues: '- Friction depends on the normal force.\n- How does the normal force on an incline depend on the angle?',
      approach: '- Write the normal force on block A as N = mg cos θ.\n- Decide what happens to cos θ as θ decreases.\n- Use fₖ = μₖN to decide how friction changes.',
      solution: '1. N = mg cos θ.\n2. As θ decreases, cos θ increases, so N increases.\n3. fₖ = μₖN with μₖ constant, so fₖ increases.\n4. Answer: INCREASES.',
    },
    {
      number: '2.4.2',
      marks: 2,
      clues: '- Two linked ideas are needed: what happens to the normal force, and how friction depends on it.\n- μₖ and m do not change.',
      approach: '- State that the normal force (mg cos θ) increases as θ decreases, since μₖ and m stay constant.\n- State that kinetic friction is directly proportional to the normal force (fₖ = μₖN).',
      solution: '1. μₖ and m are constant. As θ decreases, the normal force N = mg cos θ increases.\n2. The kinetic frictional force is directly proportional to the normal force (fₖ = μₖN), so it increases as well.',
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
