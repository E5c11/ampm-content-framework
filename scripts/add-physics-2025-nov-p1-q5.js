#!/usr/bin/env node
/**
 * DBE Physical Sciences: Physics P1 — November 2025 — Question 5 (order 8)
 * Work-energy theorem: a crate pushed then sliding down a rough incline. One
 * continuous scenario across 5.1-5.4 — bundled per DESIGN-UNI-10.
 *
 *   node tools/validate-questions.js --script scripts/add-physics-2025-nov-p1-q5.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-physics-2025-nov-p1-q5.js --dry-run
 *   node scripts/add-physics-2025-nov-p1-q5.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env') ? process.argv[process.argv.indexOf('--env') + 1] : 'dev';
const PAPER = 'https://media-dev.askmoreprepmore.app/exam_papers/dbe/physics/2025/nov_p1';

const video = {
  name: 'Question 5',
  syllabus: 'dbe',
  subject: 'physics',
  year: 2025,
  paper: 'nov_p1',
  order: 8,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['work_energy_theorem', 'free_body_diagram'],
  question_image_urls: [`${PAPER}/q5/question_1.png`],
  memo_image_urls: [`${PAPER}/q5/memo_1.png`, `${PAPER}/q5/memo_2.png`, `${PAPER}/q5/memo_3.png`],
  exam_question_marks: 13,
  supplementary_materials: [
    { type: 'formula_sheet', label: 'Formula Sheet', image_urls: [`${PAPER}/q0/question_1.png`, `${PAPER}/q0/question_2.png`, `${PAPER}/q0/question_3.png`] },
  ],
};

const questions = [
  {
    name: 'Question 1',
    question: 'Which ONE of the following correctly states the work-energy theorem?',
    metadata: [
      'The work done by gravity on an object equals its weight.',
      'The net work done on an object equals the change in its kinetic energy.',
      'The work done on an object equals its final kinetic energy.',
      'The net work done on an object equals its momentum.',
      '',
    ],
    answer: ['The net work done on an object equals the change in its kinetic energy.', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'mechanics', topic: 'work_energy_power', subtopic: 'work_energy_theorem_applications',
    skills: ['work_energy_theorem'],
    difficulty: 2, exam_weight: 3, xp: 10, order: 1,
    syllabus: 'dbe', subject: 'physics', year: 2025, paper: 'nov_p1',
    clues: '- The theorem connects the net work done on an object to one specific type of energy.\n- It is about a change, not an absolute value.',
  },
  {
    name: 'Question 2',
    question: 'A 5 kg crate starts from rest and a constant horizontal force of 10 N acts on it over a distance of 6 m on a frictionless horizontal surface. Using energy principles only, calculate the kinetic energy of the crate after this distance.',
    metadata: ['Eₖ = ', '[ ]', ' J'],
    answer: ['60', '', '', '', ''],
    presentation: 'fitb',
    type: 'calc',
    unit: 'mechanics', topic: 'work_energy_power', subtopic: 'work_energy_theorem_applications',
    skills: ['work_energy_theorem', 'kinetic_energy_calculation'],
    difficulty: 2, exam_weight: 3, xp: 10, order: 2,
    syllabus: 'dbe', subject: 'physics', year: 2025, paper: 'nov_p1',
    clues: '- The net work done equals the change in kinetic energy: W_net = ΔEₖ.\n- Since the crate starts from rest, ΔEₖ is simply the final kinetic energy.',
  },
  {
    name: 'Question 3',
    question: 'The diagram shows a block sliding down a rough inclined surface. Match each labelled force to its correct description.',
    metadata: [
      'A - Force N', 'B - Force f', 'C - Force w',
      '1 - The weight of the block, acting vertically downward',
      '2 - The normal force from the incline surface, acting perpendicular to the incline',
      '3 - The kinetic friction force, acting up the incline, opposing the block’s downward motion',
    ],
    answer: ['A-2', 'B-3', 'C-1'],
    presentation: 'match',
    type: 'interpretation',
    unit: 'mechanics', topic: 'newtons_laws', subtopic: 'free_body_diagrams',
    skills: ['incline_free_body_diagram', 'free_body_diagram', 'normal_force'],
    difficulty: 3, exam_weight: 3, xp: 10, order: 3,
    syllabus: 'dbe', subject: 'physics', year: 2025, paper: 'nov_p1',
    clues: '- Weight always points straight down, regardless of the incline.\n- The normal force is always perpendicular to the surface; friction always opposes the direction of motion.',
    supplementary_material: {
      type: 'diagram',
      label: 'Free-Body Diagram',
      image_urls: ['https://media-dev.askmoreprepmore.app/question_supplementary/physics/2025/nov_p1/q5/diagram_1.png'],
    },
  },
  {
    name: 'Question 4',
    question:
      'A 2 kg block reaches the top of a rough incline with a kinetic energy of 40 J. As it slides 5 m down the incline (at 15° to the horizontal), a constant kinetic friction force of 8 N acts on it. Using energy principles only, calculate the kinetic energy of the block after sliding this 5 m.',
    metadata: ['Eₖ = ', '[ ]', ' J'],
    answer: ['25.36', '', '', '', ''],
    presentation: 'fitb',
    type: 'calc',
    unit: 'mechanics', topic: 'work_energy_power', subtopic: 'work_energy_theorem_applications',
    skills: ['work_energy_theorem', 'energy_conservation_incline'],
    difficulty: 5, exam_weight: 3, xp: 10, order: 4,
    syllabus: 'dbe', subject: 'physics', year: 2025, paper: 'nov_p1',
    clues:
      '- W_nc = ΔEₖ + ΔE_p, where W_nc is the work done by friction (negative) and ΔE_p is the change in gravitational PE (negative, since the block descends).\n- Calculate the height dropped using the incline’s length and angle, then substitute everything with consistent signs.',
  },
];

const aiExplanation = {
  sub_questions: [
    {
      number: '5.1', marks: 2,
      clues: '- The theorem connects net work to a change in one specific type of energy.\n- State it as an equality, not just naming the two quantities.',
      approach: '- Recall what net work done on an object causes.\n- Identify that it equals a *change* in kinetic energy, not kinetic energy itself.\n- State the full theorem as a sentence.',
      solution: '1. The net/total work done (on an object) is equal to the change in the object’s kinetic energy.\n2. W_net = ΔEₖ.',
    },
    {
      number: '5.2', marks: 3,
      clues: '- From A to B the surface is frictionless, so only F does work on the crate.\n- Use W_net = ΔEₖ, with the crate starting from rest.',
      approach: '- Calculate the work done by F over the distance A to B: W = FΔxcosθ (θ = 0°, force and motion in the same direction).\n- Apply the work-energy theorem: W_net = ΔEₖ = Eₖf − Eₖi.\n- Since the crate starts from rest, Eₖi = 0.',
      solution: '1. W_FA = FΔxcosθ = (12)(7)cos0° = 84 J\n2. W_net = ΔEₖ\n3. 84 = Eₖf − 0\n4. Eₖf = 84 J',
    },
    {
      number: '5.3', marks: 3,
      clues: '- Identify every force acting on the crate as it slides down the incline: gravity, the normal force, and friction.\n- Draw each as an arrow from the same point, in its correct direction (weight straight down, normal perpendicular to the incline, friction up the incline since the crate slides down).',
      approach: '- List the three forces: weight (w), normal force (N), kinetic friction (f).\n- Determine each direction relative to the incline.\n- Draw each as a labelled arrow from a single point on the crate.',
      solution: '1. Three forces act on the crate: weight w (vertically downward), normal force N (perpendicular to the incline surface), and kinetic friction f (up the incline, opposing the downward sliding motion).\n2. Draw each as an arrow from the same point, correctly oriented and labelled.',
    },
    {
      number: '5.4', marks: 5,
      clues: '- Use the work-energy theorem from B to C, accounting for both the work done by friction and the change in gravitational PE as the crate descends the incline.\n- Compare the distance BC required to stop (or the resulting velocity/energy) with the actual distance to C (6.8 m) to decide whether the crate passes C.',
      approach: '- Resolve the crate’s weight along the incline: the component pulling it down the slope is mgsinθ.\n- Apply W_net = ΔEₖ (or equivalently W_nc = ΔEₖ + ΔE_p) from B to C, using the friction force and the incline geometry.\n- Compare the resulting distance (or final kinetic energy) to the actual BC distance of 6.8 m to conclude whether the crate passes point C.',
      solution:
        '1. W_net = ΔEₖ: the component of weight down the incline does positive work, friction does negative work.\n2. mgsinθ·Δxcos0° + f_k·Δxcos180° = Eₖf − Eₖi, with Eₖi = 84 J (from 5.2) and f_k = 21 N.\n3. Δx[(3)(9.8)sin20° − 21] = 0 − 84 (solving for the distance at which the crate would stop, Eₖf = 0)\n4. Δx[10.06 − 21] = −84 ⇒ Δx = −84 / −10.94 = 7.68 m\n5. Since 7.68 m > 6.8 m (the actual distance from B to C), the crate is still moving when it reaches C.\n6. The crate will pass point C.',
    },
  ],
  model: 'claude-sonnet-5', generated_at: Date.now(), version: 2, reviewed: false,
  input_tokens: 0, output_tokens: 0, avg_rating: null, rating_count: null,
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
  upload().catch((err) => { console.error('\n❌ Upload failed:', err.message); process.exitCode = 1; }).finally(closePool);
}
