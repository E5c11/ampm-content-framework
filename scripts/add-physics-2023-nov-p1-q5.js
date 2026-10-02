#!/usr/bin/env node
/**
 * DBE Physical Sciences: Physics P1 — November 2023 — Question 5 (order 8)
 * Work-energy theorem: free-body diagram, experimental variables, friction and mass from a distance vs kinetic energy graph.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-physics-2023-nov-p1-q5.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-physics-2023-nov-p1-q5.js --dry-run
 *   node scripts/add-physics-2023-nov-p1-q5.js
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
  name: 'Question 5',
  syllabus: 'dbe',
  subject: 'physics',
  year: 2023,
  paper: 'nov_p1',
  order: 8,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['work_energy_theorem', 'net_work', 'kinetic_friction'],
  question_image_urls: [`${PAPER}/q5/question_1.png`],
  memo_image_urls: [`${PAPER}/q5/memo_1.png`, `${PAPER}/q5/memo_2.png`, `${PAPER}/q5/memo_3.png`],
  exam_question_marks: 12,
  supplementary_materials: [FORMULA_SHEET],
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    name: 'Question 1',
    question:
      'A cart is given a push and released. It then coasts to rest on a rough horizontal surface. Ignore air resistance. Select ALL the forces that act on the cart while it is coasting.',
    metadata: [
      'Weight, vertically downward',
      'Applied force, in the direction of motion',
      'Normal force, vertically upward',
      'Kinetic friction, opposite to the motion',
      'Kinetic friction, in the direction of motion',
    ],
    answer: [
      'Weight, vertically downward',
      'Normal force, vertically upward',
      'Kinetic friction, opposite to the motion',
      '',
      '',
    ],
    presentation: 'multi_select',
    type: 'interpretation',
    unit: 'mechanics', topic: 'newtons_laws', subtopic: 'free_body_diagrams',
    skills: ['free_body_diagram', 'force_identification'],
    difficulty: 2, exam_weight: 3, xp: 10, order: 1,
    syllabus: 'dbe', subject: 'physics', year: 2023, paper: 'nov_p1',
    clues:
      '- Once the cart is released, nothing is pushing it any more.\n- Friction always acts to oppose the cart’s motion over the surface.',
  },
  {
    name: 'Question 2',
    question:
      'Learners investigate how the height from which a ball is dropped affects how high it bounces. They use the same ball and the same floor for every trial. Match each type of variable to the correct quantity.',
    metadata: [
      'A - Independent variable',
      'B - Dependent variable',
      'C - Controlled variable',
      '1 - The type of ball and floor',
      '2 - The height from which the ball is dropped',
      '3 - The height the ball bounces to',
    ],
    answer: ['A-2', 'B-3', 'C-1'],
    presentation: 'match',
    type: 'definition',
    unit: 'mechanics', topic: 'work_energy_power', subtopic: 'work_energy_theorem_applications',
    skills: ['experimental_variables'],
    difficulty: 1, exam_weight: 2, xp: 10, order: 2,
    syllabus: 'dbe', subject: 'physics', year: 2023, paper: 'nov_p1',
    clues:
      '- The independent variable is the one the learners deliberately change.\n- The dependent variable is what they measure to see the effect.',
  },
  {
    name: 'Question 3',
    question:
      'A crate slides across a rough horizontal floor and comes to rest. Which ONE of the following statements is CORRECT according to the work-energy theorem?',
    metadata: [
      'The work done by friction is zero, because friction does not cause motion',
      'The net work done is positive, because the crate moved some distance',
      'The work done by friction is negative and equals the change in kinetic energy',
      'The normal force does negative work equal to the loss of kinetic energy',
      '',
    ],
    answer: ['The work done by friction is negative and equals the change in kinetic energy', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'mechanics', topic: 'work_energy_power', subtopic: 'work_energy_theorem_applications',
    skills: ['work_energy_theorem', 'net_work'],
    difficulty: 3, exam_weight: 3, xp: 10, order: 3,
    syllabus: 'dbe', subject: 'physics', year: 2023, paper: 'nov_p1',
    clues:
      '- The work-energy theorem relates the net work done on an object to its change in kinetic energy.\n- Check which forces have a component along the displacement, and in which direction.',
  },
  {
    name: 'Question 4',
    question:
      'For a cart on a rough horizontal surface, a graph of stopping distance Δx (m) against initial kinetic energy (J) is a straight line through the origin. It passes through the point (20 J; 3.2 m). The coefficient of kinetic friction is 0.22. Complete the working to calculate the mass of the cart.',
    metadata: [
      'Wₙₑₜ = ΔEₖ, so fΔx cos 180° = 0 − Eₖᵢ, which gives Δx = \\frac{1}{f}Eₖᵢ',
      'Gradient = \\frac{3.2}{20} = 0.16 = \\frac{1}{f}, so f = 6.25 N',
      'fₖ = μₖN = μₖmg, so 6.25 = (0.22)(m)(9.8), and m (in kg):',
      '[ ]',
    ],
    answer: ['2.9'],
    presentation: 'steps',
    type: 'calc',
    unit: 'mechanics', topic: 'work_energy_power', subtopic: 'work_energy_theorem_applications',
    skills: ['work_energy_theorem', 'graph_gradient_interpretation', 'kinetic_friction'],
    difficulty: 4, exam_weight: 3, xp: 10, order: 4,
    syllabus: 'dbe', subject: 'physics', year: 2023, paper: 'nov_p1',
    clues:
      '- The normal force equals the weight here, because the surface is horizontal.\n- Rearrange 6.25 = (0.22)(m)(9.8) to make m the subject.',
  },
];

// ─── AI explanation (AMPM-CONTENT-AI-EXP) — one entry per exam sub-question ───

const aiExplanation = {
  sub_questions: [
    {
      number: '5.1',
      marks: 3,
      clues: '- After point A, nobody is pushing the trolley any more.\n- Draw each force as a labelled arrow from one dot.',
      approach: '- Identify the forces acting once the trolley passes A: weight, normal force and kinetic friction.\n- Give each its direction: weight down, normal force up, friction opposite to the motion.\n- Do not add an applied force — any extra force limits the mark to 2/3.',
      solution: '1. Weight (w, Fg or mg): vertically downward.\n2. Normal force (N): vertically upward.\n3. Kinetic friction (f or fₖ): horizontal, opposite to the direction of motion.\n4. Each force earns a mark for the arrow and label. An extra force, or missing arrowheads, limits the mark to 2/3.',
    },
    {
      number: '5.2',
      marks: 1,
      clues: '- The independent variable is the one the learners deliberately change.\n- Read the first sentence of the question carefully.',
      approach: '- Identify what the learners change between trials (the initial kinetic energy at A).\n- Identify what they measure (the distance Δx) — that is the dependent variable, not the answer.',
      solution: '1. The learners change the kinetic energy given to the trolley at point A between trials.\n2. Independent variable: the initial kinetic energy, EₖA.',
    },
    {
      number: '5.3',
      marks: 2,
      clues: '- The theorem links net work to one specific type of energy.\n- Use the words "net work", "equal" and "change".',
      approach: '- State that the net (total) work done on an object …\n- … is equal to the change in the object’s kinetic energy.',
      solution: '1. The net (total) work done on an object is equal to the change in the object’s kinetic energy.\n2. Also accepted: the work done on an object by a resultant (net) force is equal to the change in the object’s kinetic energy.',
    },
    {
      number: '5.4',
      marks: 6,
      clues: '- Use the work-energy theorem to link the graph to the frictional force.\n- Once you know f, use fₖ = μₖN with N = mg on a horizontal surface.',
      approach: '- Friction is the only force doing work: −fΔx = 0 − EₖA, so Δx = (1/f)EₖA and the gradient equals 1/f.\n- Read the gradient from the graph: 1.5/6 = 3/12 = 4.5/18 = 1/4, so f = 4 N.\n- Use fₖ = μₖmg and solve for m.',
      solution: '1. Wₙₑₜ = ΔEₖ: fΔx cos 180° = 0 − EₖA, so Δx = (1/f)EₖA — the gradient of the graph is 1/f.\n2. Gradient = Δx/EₖA = 1.5/6 = 1/4, so f = 4 N.\n3. fₖ = μₖN = μₖmg.\n4. 4 = (0.18)(m)(9.8).\n5. m = 2.27 kg.',
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
