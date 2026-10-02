#!/usr/bin/env node
/**
 * DBE Physical Sciences: Physics P1 — November 2024 — Question 4 (order 7)
 * Conservation of mechanical energy and momentum: trolleys pushed apart by a spring, one rolling up a frictionless incline.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-physics-2024-nov-p1-q4.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-physics-2024-nov-p1-q4.js --dry-run
 *   node scripts/add-physics-2024-nov-p1-q4.js
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
  name: 'Question 4',
  syllabus: 'dbe',
  subject: 'physics',
  year: 2024,
  paper: 'nov_p1',
  order: 7,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['mechanical_energy', 'momentum', 'impulse'],
  question_image_urls: [`${PAPER}/q4/question_1.png`],
  memo_image_urls: [`${PAPER}/q4/memo_1.png`, `${PAPER}/q4/memo_2.png`],
  exam_question_marks: 12,
  supplementary_materials: [FORMULA_SHEET],
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    name: 'Question 1',
    question:
      'In which ONE of the following situations is the mechanical energy of the object conserved?',
    metadata: [
      'A box slides to a stop on a rough floor',
      'A parachutist falls at terminal velocity',
      'A trolley rolls up a frictionless ramp',
      'A crate is pulled up a ramp by a rope',
      '',
    ],
    answer: ['A trolley rolls up a frictionless ramp', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'mechanics', topic: 'work_energy_power', subtopic: 'conservation_of_mechanical_energy',
    skills: ['mechanical_energy', 'gravity_only_motion'],
    difficulty: 3, exam_weight: 3, xp: 10, order: 1,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p1',
    clues:
      '- Mechanical energy is conserved only in an isolated system, where no non-conservative forces (friction, air resistance, applied forces) do work.\n- For each option, ask whether any force other than gravity does work on the object.',
  },
  {
    name: 'Question 2',
    question:
      'Trolleys P (2.5 kg) and Q (1.5 kg) are held at rest on a frictionless horizontal track with a compressed spring between them. When released, Q moves off and rolls up a frictionless ramp to a maximum vertical height of 0.8 m. Ignore rotational effects of the wheels. Calculate the speed of Q at the bottom of the ramp.',
    metadata: ['v = ', '[ ]', ' m·s⁻¹'],
    answer: ['3.96|3.960', '', '', '', ''],
    presentation: 'fitb',
    type: 'calc',
    unit: 'mechanics', topic: 'work_energy_power', subtopic: 'conservation_of_mechanical_energy',
    skills: ['energy_conservation_incline', 'mechanical_energy'],
    difficulty: 3, exam_weight: 3, xp: 10, order: 2,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p1',
    clues:
      '- At the bottom Q has only kinetic energy. At the highest point it has only gravitational potential energy.\n- The mass cancels when you set ½mv² equal to mgh.',
  },
  {
    name: 'Question 3',
    question:
      'Trolley Q (1.5 kg) starts from rest and leaves the spring at 3.96 m·s⁻¹. Calculate the magnitude of the change in momentum of Q while the spring pushes it.',
    metadata: ['Δp = ', '[ ]', ' kg·m·s⁻¹'],
    answer: ['5.94', '', '', '', ''],
    presentation: 'fitb',
    type: 'calc',
    unit: 'mechanics', topic: 'momentum_impulse', subtopic: 'impulse_calculations',
    skills: ['momentum_calculation', 'impulse_momentum_theorem'],
    difficulty: 2, exam_weight: 3, xp: 10, order: 3,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p1',
    clues:
      '- Use Δp = mv(f) − mvᵢ.\n- Q starts from rest.',
  },
  {
    name: 'Question 4',
    question:
      'While the spring pushes the trolleys apart, Q’s momentum changes by 5.94 kg·m·s⁻¹. What is the change in momentum of trolley P (2.5 kg) over the same time?',
    metadata: [
      '5.94 kg·m·s⁻¹, in the same direction as Q’s change',
      '5.94 kg·m·s⁻¹, opposite to Q’s change',
      'Zero, because momentum is conserved',
      '3.56 kg·m·s⁻¹, opposite to Q’s change',
      '',
    ],
    answer: ['5.94 kg·m·s⁻¹, opposite to Q’s change', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'mechanics', topic: 'momentum_impulse', subtopic: 'conservation_of_momentum',
    skills: ['newtons_third_law', 'momentum', 'impulse_momentum_theorem'],
    difficulty: 3, exam_weight: 3, xp: 10, order: 4,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p1',
    clues:
      '- The spring pushes on both trolleys with equal and opposite forces for the same time.\n- Equal and opposite impulses mean equal and opposite changes in momentum, whatever the masses.',
  },
  {
    name: 'Question 5',
    question:
      'The trolleys start at rest. After the spring is released, Q (1.5 kg) moves to the right at 3.96 m·s⁻¹. Complete the working to calculate the speed of P (2.5 kg).',
    metadata: [
      'Take right as positive. Σpᵢ = Σp(f)',
      '0 = (2.5)v(P) + (1.5)(3.96)',
      '(2.5)v(P) = −5.94, so the speed of P (in m·s⁻¹, to two decimal places):',
      '[ ]',
    ],
    answer: ['2.38'],
    presentation: 'steps',
    type: 'calc',
    unit: 'mechanics', topic: 'momentum_impulse', subtopic: 'conservation_of_momentum',
    skills: ['momentum_calculation', 'momentum'],
    difficulty: 3, exam_weight: 3, xp: 10, order: 5,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p1',
    clues:
      '- The total momentum before release is zero.\n- The negative sign only shows that P moves to the left. Speed is the magnitude.',
  },
];

// ─── AI explanation (AMPM-CONTENT-AI-EXP) — one entry per exam sub-question ───

const aiExplanation = {
  sub_questions: [
    {
      number: '4.1',
      marks: 2,
      clues: '- Mechanical energy = gravitational potential energy + kinetic energy.\n- The principle only holds under one condition about the system.',
      approach: '- Say what mechanical energy is (the sum of Ep and Ek).\n- State the condition: an isolated system.\n- State what happens to it: it remains constant.',
      solution: '1. The total mechanical energy (the sum of gravitational potential energy and kinetic energy) in an isolated system remains constant (is conserved).\n2. Key words: "total mechanical energy", "isolated system", "remains constant".',
    },
    {
      number: '4.2',
      marks: 4,
      clues: '- The incline is frictionless, so mechanical energy is conserved.\n- At the top (1.5 m) trolley B stops, so its kinetic energy there is zero.',
      approach: '- Write E(mech) at the bottom = E(mech) at the top.\n- Bottom: Ep = 0, Ek = ½mv². Top: Ep = mgh, Ek = 0.\n- Solve for v.',
      solution: '1. (Ep + Ek) at the top = (Ep + Ek) at the bottom.\n2. (2)(9.8)(1.5) + 0 = 0 + ½(2)v².\n3. 29.4 = v².\n4. v = 5.42 m·s⁻¹.',
    },
    {
      number: '4.3.1',
      marks: 3,
      clues: '- Trolley B starts at rest and leaves the spring with the speed from 4.2.\n- Momentum is a vector, so give a direction.',
      approach: '- Use Δp = mv(f) − mvᵢ for trolley B.\n- Substitute m = 2 kg, v(f) = 5.42 m·s⁻¹, vᵢ = 0.\n- State the direction (B moves to the right).',
      solution: '1. Δp = mv(f) − mvᵢ.\n2. Δp = 2(5.42 − 0).\n3. Δp = 10.84 kg·m·s⁻¹ to the right.',
    },
    {
      number: '4.3.2',
      marks: 1,
      clues: '- The spring exerts equal and opposite forces on A and B for the same time.\n- So their impulses, and their changes in momentum, are equal and opposite.',
      approach: '- Apply Newton’s third law and the impulse-momentum theorem.\n- Give the same magnitude as B’s change, in the opposite direction.',
      solution: '1. Δp(A) = 10.84 kg·m·s⁻¹ to the left (opposite to B’s change in momentum).',
    },
    {
      number: '4.4',
      marks: 2,
      clues: '- A starts at rest and its change in momentum is 10.84 kg·m·s⁻¹ to the left.\n- Alternatively, the total momentum before release is zero.',
      approach: '- Use Δp = m(v(f) − vᵢ) for trolley A (1.5 kg).\n- Or use Σpᵢ = Σp(f): 0 = 1.5v(A) + 2(5.42).\n- Give the speed (magnitude).',
      solution: '1. Right as positive: −10.84 = 1.5(v(f) − 0).\n2. v(f) = −7.23 m·s⁻¹.\n3. Speed of A = 7.23 m·s⁻¹.\n4. Check by conservation of momentum: 0 = 1.5v(A) + (2)(5.42), so v(A) = −7.23 m·s⁻¹.',
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
