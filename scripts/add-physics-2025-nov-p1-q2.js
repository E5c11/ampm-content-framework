#!/usr/bin/env node
/**
 * DBE Physical Sciences: Physics P1 — November 2025 — Question 2 (order 2)
 * Newton's second law, free-body diagrams, force components/resolution, static
 * friction — a block held at maximum static friction by an angled applied force.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-physics-2025-nov-p1-q2.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-physics-2025-nov-p1-q2.js --dry-run
 *   node scripts/add-physics-2025-nov-p1-q2.js
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
const IMG = `${PAPER}/q2`;
// No shared const for question_supplementary URLs — see the inline note on Question 2's
// supplementary_material below; tools/validate-questions.js evals `questions` in isolation.

// ─── Phase 2 — lesson document ───────────────────────────────────────────────

const video = {
  name: 'Question 2',
  syllabus: 'dbe',
  subject: 'physics',
  year: 2025,
  paper: 'nov_p1',
  order: 2,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['newtons_second_law', 'free_body_diagram', 'static_friction'],
  question_image_urls: [`${IMG}/question_1.png`],
  memo_image_urls: [`${IMG}/memo_1.png`, `${IMG}/memo_2.png`, `${IMG}/memo_3.png`],
  exam_question_marks: 17,
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
    question:
      'A 4 kg object accelerates at 2 m·s⁻² under a single net horizontal force. If the same net force is applied to an 8 kg object instead, what will its acceleration be?',
    metadata: ['0.5 m·s⁻²', '1 m·s⁻²', '2 m·s⁻²', '4 m·s⁻²', ''],
    answer: ['1 m·s⁻²', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'calc',
    unit: 'mechanics',
    topic: 'newtons_laws',
    subtopic: 'net_force_acceleration',
    skills: ['newtons_second_law', 'net_force', 'mass_acceleration_relationship'],
    difficulty: 2,
    exam_weight: 3,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p1',
    clues:
      '- First find the net force from the original object using F_net = ma.\n- The net force is the same for the second object — use it with the new mass to find the new acceleration.',
  },
  {
    name: 'Question 2',
    question:
      'The diagram shows a crate on a rough horizontal surface, pulled by a rope at an angle above the horizontal, causing it to be on the verge of sliding. Match each labelled force to its correct description.',
    metadata: [
      'A - Force P',
      'B - Force Q',
      'C - Force R',
      'D - Force S',
      '1 - The normal force from the surface, acting vertically upward',
      '2 - The applied force from the rope, acting at an angle above the horizontal',
      '3 - The crate’s weight, acting vertically downward',
      '4 - The kinetic friction force, acting horizontally, opposing the crate’s motion',
    ],
    answer: ['A-2', 'B-3', 'C-1', 'D-4'],
    presentation: 'match',
    type: 'interpretation',
    unit: 'mechanics',
    topic: 'newtons_laws',
    subtopic: 'free_body_diagrams',
    skills: ['free_body_diagram', 'force_identification', 'normal_force'],
    difficulty: 2,
    exam_weight: 3,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p1',
    clues:
      '- Every force on the crate acts either along the rope’s direction, straight down, straight up, or horizontally opposing motion.\n- Weight always points straight down and the normal force always points straight up, away from the surface.',
    // Literal URL, not `${SUPP}/...` — tools/validate-questions.js extracts and evals
    // the `questions` array in isolation from the rest of the script, so a reference to
    // an outer `const` here fails with "SUPP is not defined" (found 2026-09-09, first
    // script to put a question-level supplementary_material image inside `questions`).
    supplementary_material: {
      type: 'diagram',
      label: 'Free-Body Diagram',
      image_urls: ['https://media-dev.askmoreprepmore.app/question_supplementary/physics/2025/nov_p1/q2/diagram_1.png'],
    },
  },
  {
    name: 'Question 3',
    question:
      'A 6 kg crate rests on a rough horizontal floor. A constant force F of magnitude 25 N is applied to the crate at an angle θ to the horizontal, causing the crate to experience maximum static friction. The horizontal component of F is 20 N. Calculate θ.',
    metadata: ['θ = ', '[ ]', '°'],
    answer: ['36.87', '', '', '', ''],
    presentation: 'fitb',
    type: 'calc',
    unit: 'mechanics',
    topic: 'newtons_laws',
    subtopic: 'force_components_resolution',
    skills: ['force_components', 'trigonometric_resolution', 'angle_calculation'],
    difficulty: 3,
    exam_weight: 3,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p1',
    clues:
      '- The horizontal component of F is F cos θ.\n- Substitute the given values and solve for θ using inverse cosine.',
  },
  {
    name: 'Question 4',
    question:
      'A block rests on a rough horizontal surface. A constant force F is applied to the block at an angle θ above the horizontal, causing maximum static friction. If θ is increased while the magnitude of F remains constant, and the block does not yet move, how will the maximum static friction acting on the block be affected?',
    metadata: [
      'Increases, because the vertical component of F increases, so the normal force increases.',
      'Decreases, because the vertical component of F increases, so the normal force decreases.',
      'Remains the same, because μₛ is constant regardless of the normal force.',
      'Increases, because the horizontal component of F increases.',
      '',
    ],
    answer: ['Decreases, because the vertical component of F increases, so the normal force decreases.', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'mechanics',
    topic: 'newtons_laws',
    subtopic: 'static_friction',
    skills: ['static_friction', 'normal_force', 'force_components'],
    difficulty: 4,
    exam_weight: 3,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p1',
    clues:
      '- Resolve F into horizontal and vertical components, then see how the vertical component changes as θ increases.\n- The normal force balances weight minus the vertical component of F — think about how that changes, then apply the friction formula.',
  },
];

// ─── AI explanation (AMPM-CONTENT-AI-EXP) — one entry per exam sub-question ───

const aiExplanation = {
  sub_questions: [
    {
      number: '2.1',
      marks: 2,
      clues: '- Recall the three parts of Newton’s second law: what happens to acceleration, and how it relates to both net force and mass.\n- State it as one connected sentence, not three separate facts.',
      approach: '- Start with what happens when a net force acts on an object.\n- State the direction relationship between acceleration and net force.\n- State how acceleration depends on both net force and mass (directly and inversely proportional).',
      solution: '1. When a net/resultant force acts on an object, the object accelerates in the direction of the force.\n2. The acceleration is directly proportional to the net force.\n3. The acceleration is inversely proportional to the mass of the object.\n4. Full statement: "When a net force acts on an object, the object will accelerate in the direction of the force, and the acceleration is directly proportional to the net force and inversely proportional to the mass of the object."',
    },
    {
      number: '2.2',
      marks: 4,
      clues: '- Identify every force acting on the block: the applied force, gravity, the normal force from the surface, and friction.\n- Draw each force as an arrow starting from the block, in the correct direction.',
      approach: '- List the four forces acting on the block: applied force F, weight w, normal force N, and maximum static friction fₛ(max).\n- Determine the direction of each: F at angle θ above horizontal, w vertically down, N vertically up, fₛ(max) horizontally opposing the horizontal component of F.\n- Draw each as a labelled arrow from a single point on the block.',
      solution: '1. Four forces act on the block: the applied force F (at angle θ above the horizontal), the weight w (vertically downward), the normal force N (vertically upward), and the maximum static friction fₛ(max) (horizontally, opposing the horizontal component of F).\n2. Draw each as an arrow starting from the same point on the block, pointing in its correct direction.\n3. Label each arrow (F, w, N, fₛ(max)).',
    },
    {
      number: '2.3.1',
      marks: 2,
      clues: '- The horizontal component of F is F cos θ.\n- Substitute the given values for the horizontal component and F, then solve for θ.',
      approach: '- Write the horizontal component equation: Fₓ = F cos θ.\n- Substitute Fₓ = 15 N and F = 18 N.\n- Solve for θ using inverse cosine.',
      solution: '1. Fₓ = F cos θ\n2. 15 = 18 cos θ\n3. cos θ = 15/18\n4. θ = 33.56°',
    },
    {
      number: '2.3.2',
      marks: 5,
      clues: '- Resolve F into its vertical component, then use it to find the normal force.\n- The normal force N is not equal to the weight here — F’s vertical component reduces it. Then apply the maximum static friction formula.',
      approach: '- Find the vertical component of F: F_y = F sin θ (or √(F² − Fₓ²)).\n- Apply Newton’s first law vertically: N + F_y − w = 0, so N = w − F_y.\n- Substitute N into fₛ(max) = μₛN, using fₛ(max) = 15 N (the horizontal component of F at maximum static friction), and solve for μₛ.',
      solution: '1. F_y = F sin θ = 18 sin(33.56°) = 9.95 N\n2. Vertically: N + F_y − w = 0, so N = w − F_y\n3. N = (5)(9.8) − 9.95 = 39.05 N\n4. fₛ(max) = μₛN\n5. 15 = μₛ(39.05)\n6. μₛ = 0.38',
    },
    {
      number: '2.4',
      marks: 4,
      clues: '- Think about how decreasing θ changes the vertical component of F, and hence the normal force.\n- μₛ itself doesn’t change — only N does.',
      approach: '- Determine how the vertical component of F changes as θ decreases (F constant).\n- Use N = w − F sin θ to see how the normal force changes as a result.\n- Apply fₛ(max) = μₛN, with μₛ constant, to conclude how fₛ(max) changes.',
      solution: '1. As θ decreases, the vertical component of F (F sin θ) decreases.\n2. Since N = w − F sin θ, a smaller F sin θ means N increases.\n3. fₛ(max) = μₛN, and μₛ stays constant, so fₛ(max) increases as N increases.\n4. The maximum static friction increases.',
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
