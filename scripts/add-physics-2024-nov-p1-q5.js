#!/usr/bin/env node
/**
 * DBE Physical Sciences: Physics P1 — November 2024 — Question 5 (order 8)
 * Work-energy theorem: crate pulled at an angle against friction; free-body diagram; work done by one force.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-physics-2024-nov-p1-q5.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-physics-2024-nov-p1-q5.js --dry-run
 *   node scripts/add-physics-2024-nov-p1-q5.js
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
  name: 'Question 5',
  syllabus: 'dbe',
  subject: 'physics',
  year: 2024,
  paper: 'nov_p1',
  order: 8,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['work_energy_theorem', 'net_work', 'free_body_diagram'],
  question_image_urls: [`${PAPER}/q5/question_1.png`],
  memo_image_urls: [`${PAPER}/q5/memo_1.png`, `${PAPER}/q5/memo_2.png`],
  exam_question_marks: 12,
  supplementary_materials: [FORMULA_SHEET],
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    name: 'Question 1',
    question:
      'A constant 50 N force acts on a trolley at 60° to the direction of its displacement. The trolley moves 4 m. How much work does this force do on the trolley?',
    metadata: ['100 J', '173.21 J', '200 J', '0 J', ''],
    answer: ['100 J', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'calc',
    unit: 'mechanics', topic: 'work_energy_power', subtopic: 'work_energy_theorem_applications',
    skills: ['work_calculation', 'trigonometric_resolution'],
    difficulty: 2, exam_weight: 3, xp: 10, order: 1,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p1',
    clues:
      '- Only the component of the force along the displacement does work: W = FΔx cos θ.\n- θ is the angle between the force and the displacement.',
  },
  {
    name: 'Question 2',
    question:
      'A crate is pulled along a rough horizontal floor by a force F applied at 25° ABOVE the horizontal. Select ALL the forces that belong on the free-body diagram of the crate.',
    metadata: [
      'Kinetic friction, opposite to the direction of motion',
      'Weight, vertically downwards',
      'Applied force F, at 25° above the horizontal',
      'A forward “force of motion” along the floor',
      'Normal force, perpendicular to the floor',
    ],
    answer: [
      'Kinetic friction, opposite to the direction of motion',
      'Weight, vertically downwards',
      'Applied force F, at 25° above the horizontal',
      'Normal force, perpendicular to the floor',
      '',
    ],
    presentation: 'multi_select',
    type: 'interpretation',
    unit: 'mechanics', topic: 'newtons_laws', subtopic: 'free_body_diagrams',
    skills: ['free_body_diagram', 'force_identification'],
    difficulty: 2, exam_weight: 3, xp: 10, order: 2,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p1',
    clues:
      '- Every force on a free-body diagram must be exerted by something: the Earth, the floor, or the rope.\n- A moving object does not carry a force “of motion” with it.',
  },
  {
    name: 'Question 3',
    question:
      'An 8 kg crate starts from rest. A constant force F at 25° above the horizontal pulls it 2 m along a horizontal floor, against a constant frictional force of 12 N. Its speed after 2 m is 3 m·s⁻¹. Using energy principles, complete the working to calculate F.',
    metadata: [
      'Wₙₑₜ = ΔEₖ, so W(F) + W(f) = ½mv(f)² − ½mvᵢ²',
      'F(2) cos 25° + (12)(2) cos 180° = ½(8)(3²) − 0',
      '1.8126F − 24 = 36, so F (in N, to two decimal places):',
      '[ ]',
    ],
    answer: ['33.10'],
    presentation: 'steps',
    type: 'calc',
    unit: 'mechanics', topic: 'work_energy_power', subtopic: 'work_energy_theorem_applications',
    skills: ['work_energy_theorem', 'work_calculation', 'net_work'],
    difficulty: 4, exam_weight: 3, xp: 10, order: 3,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p1',
    clues:
      '- The normal force and the weight are perpendicular to the displacement, so they do no work.\n- Move −24 to the right-hand side, then divide by 1.8126.',
  },
  {
    name: 'Question 4',
    question:
      'The same 8 kg crate starts from rest and reaches 3 m·s⁻¹ after being pulled 2 m along the horizontal floor. Calculate the NET work done on the crate.',
    metadata: ['Wₙₑₜ = ', '[ ]', ' J'],
    answer: ['36', '', '', '', ''],
    presentation: 'fitb',
    type: 'calc',
    unit: 'mechanics', topic: 'work_energy_power', subtopic: 'work_energy_theorem_applications',
    skills: ['work_energy_theorem', 'kinetic_energy_calculation'],
    difficulty: 2, exam_weight: 3, xp: 10, order: 4,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p1',
    clues:
      '- You do not need the individual forces. The work-energy theorem links net work directly to the change in kinetic energy.',
  },
  {
    name: 'Question 5',
    question:
      'A 3 kg box is placed inside the crate. The same force F, at the same angle, pulls the crate over the same 2 m. What happens to the work done BY FORCE F?',
    metadata: [
      'It increases, because the normal force on the crate increases',
      'It decreases, because the crate now accelerates less',
      'It increases, because more friction must be overcome',
      'It stays the same, because F, Δx and θ are all unchanged',
      '',
    ],
    answer: ['It stays the same, because F, Δx and θ are all unchanged', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'mechanics', topic: 'work_energy_power', subtopic: 'work_energy_theorem_applications',
    skills: ['work_calculation', 'net_work'],
    difficulty: 3, exam_weight: 3, xp: 10, order: 5,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p1',
    clues:
      '- The work done by ONE force depends only on that force, the displacement, and the angle between them (W = FΔx cos θ).\n- Friction and the net work may change, but the question asks only about F.',
  },
];

// ─── AI explanation (AMPM-CONTENT-AI-EXP) — one entry per exam sub-question ───

const aiExplanation = {
  sub_questions: [
    {
      number: '5.1',
      marks: 2,
      clues: '- Work is defined in terms of a constant force and the displacement it causes.\n- The angle between them matters.',
      approach: '- Give the formula form: W = FΔx cos θ.\n- Say what each symbol is: the force, the magnitude of the displacement, and the angle between the force and the displacement.',
      solution: '1. The work done on an object by a constant force F is FΔx cos θ, where F is the magnitude of the force, Δx is the magnitude of the displacement and θ is the angle between the force and the displacement.\n2. Also accepted: the product of the force and the displacement of the object in the direction of the displacement.',
    },
    {
      number: '5.2',
      marks: 4,
      clues: '- Four forces act on the crate: one from the Earth, two from the surface, and the applied force.\n- Draw F at its angle. Do not draw its components.',
      approach: '- Draw the crate as a dot.\n- Add the weight (down), the normal force (up), friction (opposite to the motion), and F (at 30° above the horizontal).\n- Label every arrow.',
      solution: '1. Weight (w, F(g), mg or 58.8 N): vertically downwards.\n2. Normal force (N or F(N)): vertically upwards.\n3. Friction (f or fₖ): horizontal, opposite to the motion (towards A).\n4. Applied force (F): at 30° above the horizontal, in the direction of motion.\n5. 1 mark each for the arrow and label. Extra forces, components of F, arrows not touching the dot, or no arrowheads: maximum 3/4.',
    },
    {
      number: '5.3',
      marks: 4,
      clues: '- The surface is horizontal, so ΔEp = 0.\n- Only F and friction do work. N and w are perpendicular to the displacement.',
      approach: '- Write Wₙₑₜ = ΔEₖ (or Wnc = ΔEₖ + ΔEp).\n- Substitute W(F) = F(1.5) cos 30° and W(f) = (10)(1.5) cos 180°.\n- Set equal to ½(6)(2² − 0²) and solve for F.',
      solution: '1. Wₙₑₜ = ΔEₖ, so W(F) + W(f) = ½mv(f)² − ½mvᵢ².\n2. F(1.5) cos 30° + (10)(1.5) cos 180° = ½(6)(2² − 0²).\n3. 1.299F − 15 = 12.\n4. F = 20.78 N (range 20.77 to 20.79 N).',
    },
    {
      number: '5.4',
      marks: 2,
      clues: '- The work done by F depends on F, Δx and θ.\n- Does adding mass change any of these?',
      approach: '- Write W(F) = FΔx cos θ.\n- Note that the force, the distance from A to B and the angle all stay the same.',
      solution: '1. W(F) = FΔx cos θ, and F, Δx (1.5 m) and θ (30°) are unchanged.\n2. Answer: REMAINS THE SAME.',
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
