#!/usr/bin/env node
/**
 * DBE Physical Sciences: Physics P1 — November 2023 — Question 4 (order 7)
 * Momentum and impulse: Newton's third law, bullet embedding in a moving trolley, conservation of linear momentum.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-physics-2023-nov-p1-q4.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-physics-2023-nov-p1-q4.js --dry-run
 *   node scripts/add-physics-2023-nov-p1-q4.js
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
  name: 'Question 4',
  syllabus: 'dbe',
  subject: 'physics',
  year: 2023,
  paper: 'nov_p1',
  order: 7,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['momentum', 'impulse'],
  question_image_urls: [`${PAPER}/q4/question_1.png`],
  memo_image_urls: [`${PAPER}/q4/memo_1.png`, `${PAPER}/q4/memo_2.png`],
  exam_question_marks: 11,
  supplementary_materials: [FORMULA_SHEET],
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    name: 'Question 1',
    question:
      'A 0.05 kg dart strikes a 2 kg block that is at rest. During the collision the dart exerts an average force of 320 N to the east on the block. What is the average force that the block exerts on the dart?',
    metadata: ['320 N west', '16 N west', '320 N east', 'More than 320 N west', ''],
    answer: ['320 N west', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'mechanics', topic: 'newtons_laws', subtopic: 'newtons_third_law',
    skills: ['newtons_third_law', 'force_identification'],
    difficulty: 2, exam_weight: 2, xp: 10, order: 1,
    syllabus: 'dbe', subject: 'physics', year: 2023, paper: 'nov_p1',
    clues:
      '- The two forces form an action-reaction pair.\n- The masses of the objects do not affect the size of an action-reaction pair.',
  },
  {
    name: 'Question 2',
    question:
      'A 0.02 kg pellet is fired into a block and becomes embedded in it. While it is stopping inside the block, the block exerts an average force of 455 N on the pellet for 0.015 s. Afterwards the pellet and block move together at 2.5 m·s⁻¹ in the pellet’s original direction. Complete the working to calculate the speed of the pellet just before it strikes the block.',
    metadata: [
      'Pellet’s original direction positive: Fₙₑₜ Δt = m(v(f) − vᵢ)',
      '(−455)(0.015) = (0.02)(2.5 − vᵢ), so vᵢ (in m·s⁻¹):',
      '[ ]',
    ],
    answer: ['343.75'],
    presentation: 'steps',
    type: 'calc',
    unit: 'mechanics', topic: 'momentum_impulse', subtopic: 'impulse_calculations',
    skills: ['impulse_momentum_theorem', 'momentum_calculation'],
    difficulty: 4, exam_weight: 3, xp: 10, order: 2,
    syllabus: 'dbe', subject: 'physics', year: 2023, paper: 'nov_p1',
    clues:
      '- The force on the pellet opposes its motion, so it is negative in this sign convention.\n- Expand the bracket on the right-hand side, then make vᵢ the subject.',
  },
  {
    name: 'Question 3',
    question:
      'Total linear momentum is conserved only in an isolated system. In which ONE of the following situations is the total linear momentum of the objects involved conserved?',
    metadata: [
      'A car brakes to a stop on a rough road',
      'A trolley is pushed along by a constant force',
      'A ball falls freely towards the ground',
      'Two pucks collide on frictionless ice',
      '',
    ],
    answer: ['Two pucks collide on frictionless ice', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'mechanics', topic: 'momentum_impulse', subtopic: 'conservation_of_momentum',
    skills: ['momentum'],
    difficulty: 3, exam_weight: 3, xp: 10, order: 3,
    syllabus: 'dbe', subject: 'physics', year: 2023, paper: 'nov_p1',
    clues:
      '- An isolated system is one on which the net external force is zero.\n- For each situation, ask whether an outside force changes the total momentum.',
  },
  {
    name: 'Question 4',
    question:
      'A 0.06 kg lump of clay moving east at 20 m·s⁻¹ strikes and sticks to a 1.4 kg cart moving west at 0.5 m·s⁻¹. Ignore friction. Calculate the magnitude of the velocity of the clay-cart combination after the collision.',
    metadata: ['v(f) = ', '[ ]', ' m·s⁻¹'],
    answer: ['0.34|0.342', '', '', '', ''],
    presentation: 'fitb',
    type: 'calc',
    unit: 'mechanics', topic: 'momentum_impulse', subtopic: 'conservation_of_momentum',
    skills: ['momentum_calculation', 'momentum'],
    difficulty: 3, exam_weight: 3, xp: 10, order: 4,
    syllabus: 'dbe', subject: 'physics', year: 2023, paper: 'nov_p1',
    clues:
      '- Choose a positive direction and give the westward velocity a negative sign.\n- Total momentum before equals total momentum after; afterwards the two objects move as one combined mass.',
  },
];

// ─── AI explanation (AMPM-CONTENT-AI-EXP) — one entry per exam sub-question ───

const aiExplanation = {
  sub_questions: [
    {
      number: '4.1',
      marks: 1,
      clues: '- The bullet-on-trolley force and the trolley-on-bullet force are an action-reaction pair.\n- Give both a magnitude and a direction.',
      approach: '- Apply Newton’s third law: the two forces are equal in magnitude and opposite in direction.\n- The trolley pushes the bullet to the left (slowing it), so the bullet pushes the trolley the other way.',
      solution: '1. By Newton’s third law, the force of the bullet on the trolley is equal in magnitude and opposite in direction to the force of the trolley on the bullet.\n2. The trolley exerts 591 N on the bullet opposite to the bullet’s motion (to the left).\n3. So the bullet exerts 591 N on the trolley to the right (the bullet’s original direction).',
    },
    {
      number: '4.2',
      marks: 4,
      clues: '- First use the trolley: the impulse the bullet gives it changes its velocity.\n- Then use conservation of momentum (or the bullet’s own impulse) to find the bullet’s initial speed.',
      approach: '- Take right as positive. For the trolley: Fₙₑₜ Δt = m(v(f) − vᵢ) with F = 591 N, Δt = 0.02 s, vᵢ = −3 m·s⁻¹ — this gives v(f) = 1.38 m·s⁻¹.\n- Apply conservation of momentum: m(b)vᵢ(b) + m(t)vᵢ(t) = (m(b) + m(t))v(f).\n- Substitute and solve for the bullet’s initial velocity.',
      solution: '1. Right positive. For the trolley: (591)(0.02) = 2.7[v(f) − (−3)], so v(f) = 1.38 m·s⁻¹.\n2. Conservation of momentum: Σpᵢ = Σp(f).\n3. (0.03)vᵢ + (2.7)(−3) = (0.03 + 2.7)(1.38).\n4. (0.03)vᵢ = 3.7674 + 8.1 = 11.8674.\n5. vᵢ = 395.58 m·s⁻¹ (accepted range 394 – 395.58 m·s⁻¹).',
    },
    {
      number: '4.3',
      marks: 2,
      clues: '- The principle names the quantity that stays constant and the condition for it.\n- Include the word "isolated".',
      approach: '- Name the quantity: the total linear momentum.\n- State the condition: in an isolated system.\n- State the result: it remains constant (is conserved).',
      solution: '1. The total linear momentum in an isolated system remains constant (is conserved).\n2. Also accepted for 1 mark only: in an isolated system the total momentum before a collision equals the total momentum after the collision.',
    },
    {
      number: '4.4',
      marks: 4,
      clues: '- Use the bullet’s speed from 4.2 in a conservation of momentum equation.\n- Watch the signs: the bullet and trolley move in opposite directions before the collision.',
      approach: '- Take right as positive: bullet +395.58 m·s⁻¹, trolley −3 m·s⁻¹.\n- Write Σpᵢ = Σp(f) with the combined mass (2.73 kg) moving together afterwards.\n- Solve for v(f); alternatively use the trolley’s impulse, Fₙₑₜ Δt = m(v(f) − vᵢ).',
      solution: '1. Right positive: Σpᵢ = Σp(f).\n2. (0.03)(395.58) + (2.7)(−3) = (0.03 + 2.7)v(f).\n3. 11.87 − 8.1 = 2.73v(f).\n4. v(f) = 1.38 m·s⁻¹ to the right (accepted range 1.36 – 1.38 m·s⁻¹).\n5. Check with the trolley’s impulse: (591)(0.02) = 2.7[v(f) − (−3)] also gives v(f) = 1.38 m·s⁻¹.',
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
