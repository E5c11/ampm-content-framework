#!/usr/bin/env node
/**
 * DBE Physical Sciences: Physics P1 — November 2025 — Question 4 (order 7)
 * Momentum and impulse: a cricket ball struck by a bat, momentum-vs-contact-time
 * graph. One continuous scenario/graph across 4.1-4.3 — bundled per DESIGN-UNI-10.
 *
 *   node tools/validate-questions.js --script scripts/add-physics-2025-nov-p1-q4.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-physics-2025-nov-p1-q4.js --dry-run
 *   node scripts/add-physics-2025-nov-p1-q4.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env') ? process.argv[process.argv.indexOf('--env') + 1] : 'dev';
const PAPER = 'https://media-dev.askmoreprepmore.app/exam_papers/dbe/physics/2025/nov_p1';

const video = {
  name: 'Question 4',
  syllabus: 'dbe',
  subject: 'physics',
  year: 2025,
  paper: 'nov_p1',
  order: 7,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['impulse', 'momentum'],
  question_image_urls: [`${PAPER}/q4/question_1.png`],
  memo_image_urls: [`${PAPER}/q4/memo_1.png`, `${PAPER}/q4/memo_2.png`],
  exam_question_marks: 11,
  supplementary_materials: [
    { type: 'formula_sheet', label: 'Formula Sheet', image_urls: [`${PAPER}/q0/question_1.png`, `${PAPER}/q0/question_2.png`, `${PAPER}/q0/question_3.png`] },
  ],
};

const questions = [
  {
    name: 'Question 1',
    question: 'Which ONE of the following expressions correctly relates the impulse on an object to the change in its momentum?',
    metadata: ['Impulse = mass × velocity', 'Impulse = net force × contact time = change in momentum', 'Impulse = change in kinetic energy', 'Impulse = mass × change in velocity, divided by time', ''],
    answer: ['Impulse = net force × contact time = change in momentum', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'mechanics', topic: 'momentum_impulse', subtopic: 'impulse_momentum_graphs',
    skills: ['impulse_momentum_theorem'],
    difficulty: 2, exam_weight: 3, xp: 10, order: 1,
    syllabus: 'dbe', subject: 'physics', year: 2025, paper: 'nov_p1',
    clues: '- Impulse is defined as net force multiplied by the time it acts.\n- The impulse-momentum theorem says this equals the resulting change in momentum.',
  },
  {
    name: 'Question 2',
    question: 'A graph of a ball’s momentum (kg·m·s⁻¹) against contact time (s) with a bat is a straight line passing through (0.02 s, 0 kg·m·s⁻¹) and (0.05 s, 6 kg·m·s⁻¹). Calculate the gradient of this graph, which represents the average net force on the ball.',
    metadata: ['F = ', '[ ]', ' N'],
    answer: ['200', '', '', '', ''],
    presentation: 'fitb',
    type: 'calc',
    unit: 'mechanics', topic: 'momentum_impulse', subtopic: 'impulse_momentum_graphs',
    skills: ['graph_gradient_interpretation', 'force_from_graph'],
    difficulty: 2, exam_weight: 3, xp: 10, order: 2,
    syllabus: 'dbe', subject: 'physics', year: 2025, paper: 'nov_p1',
    clues: '- The gradient of a momentum-vs-time graph is Δp / Δt, which is the net force (since F_net = Δp/Δt).\n- Use the two given points to calculate the gradient.',
  },
  {
    name: 'Question 3',
    question: 'Complete the working to find the magnitude of the ball’s initial velocity. A 0.2 kg ball moving at vᵢ is struck by a bat and reverses direction, leaving with a momentum of 2 kg·m·s⁻¹ (in the new direction). The bat exerts an average net force of 200 N on the ball for 0.025 s.',
    metadata: ['F_net·Δt = p_f − p_i', '[ ]', '[ ]', '[ ]'],
    answer: ['200(0.025) = 2 − p_i', 'p_i = −3 kg·m·s⁻¹', '|vᵢ| = 15 m·s⁻¹'],
    presentation: 'steps',
    type: 'calc',
    unit: 'mechanics', topic: 'momentum_impulse', subtopic: 'impulse_momentum_graphs',
    skills: ['impulse_momentum_theorem'],
    difficulty: 4, exam_weight: 3, xp: 10, order: 3,
    syllabus: 'dbe', subject: 'physics', year: 2025, paper: 'nov_p1',
    clues: '- Use F_net·Δt = Δp = p_f − p_i. Take the direction after the bounce as positive, so the initial momentum is negative.\n- Solve for p_i, then divide by mass to get vᵢ.',
  },
  {
    name: 'Question 4',
    question: 'The experiment is repeated with a ball of bigger mass, keeping the average net force and initial velocity the same. How will the gradient of the momentum-vs-contact-time graph compare to the original (smaller-mass) graph?',
    metadata: ['It will be steeper, since a bigger mass has more momentum.', 'It will be the same, since the gradient represents the net force, which is unchanged.', 'It will be less steep, since a bigger mass takes longer to change momentum.', 'It cannot be determined without knowing the exact masses.', ''],
    answer: ['It will be the same, since the gradient represents the net force, which is unchanged.', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'interpretation',
    unit: 'mechanics', topic: 'momentum_impulse', subtopic: 'impulse_momentum_graphs',
    skills: ['graph_gradient_interpretation', 'force_from_graph'],
    difficulty: 4, exam_weight: 3, xp: 10, order: 4,
    syllabus: 'dbe', subject: 'physics', year: 2025, paper: 'nov_p1',
    clues: '- The gradient of this graph is the net force, not the momentum itself.\n- The question states the net force is kept the same — think about what that means for the gradient specifically, even though the mass changed.',
  },
];

const aiExplanation = {
  sub_questions: [
    {
      number: '4.1', marks: 2,
      clues: '- Impulse relates net force, time, and change in momentum.\n- State it as the product of two quantities, equal to a change.',
      approach: '- Recall the impulse-momentum theorem.\n- Express impulse in terms of net force and contact time.\n- State that this equals the change in momentum.',
      solution: '1. Impulse is the product of the resultant/net force acting on an object and the time the (net) force acts on the object.\n2. Impulse = F_net·Δt = Δp.',
    },
    {
      number: '4.2.1', marks: 3,
      clues: '- The gradient of the pf-vs-Δt graph equals the average net force.\n- Use the two labelled points on the graph, (0.01, 0) and (0.03, 4.5), to calculate the gradient.',
      approach: '- Read two points off the graph.\n- Calculate gradient = Δp / Δ(Δt).\n- State the direction (opposite to the ball’s original direction, since the bat reverses it).',
      solution: '1. Gradient = Δpf / Δ(Δt) = (4.5 − 0) / (0.03 − 0.01)\n2. Gradient = 225 N\n3. F_net = 225 N, to the right (opposite to the ball’s original direction).',
    },
    {
      number: '4.2.2', marks: 4,
      clues: '- Use F_net·Δt = Δp = p_f − p_i at one of the given points on the graph.\n- Take the final direction as positive, so the initial momentum (original direction) is negative.',
      approach: '- Substitute F_net = 225 N and one (Δt, pf) point into F_net·Δt = pf − pi.\n- Solve for pi.\n- Divide by the ball’s mass (0.15 kg) to find the initial velocity.',
      solution: '1. F_net·Δt = pf − pi\n2. 225(0.01) = 0 − pi\n3. pi = −2.25 kg·m·s⁻¹\n4. pi = mvi ⇒ vi = −2.25 / 0.15 = −15\n5. |vi| = 15 m·s⁻¹',
    },
    {
      number: '4.3', marks: 2,
      clues: '- The gradient of the new graph (line B) is still the net force — which is unchanged, so the gradient (slope) stays the same as line A.\n- A bigger mass with the same initial velocity has a bigger initial momentum magnitude, so the line’s position shifts.',
      approach: '- Redraw the original line (A): straight line through (0.01, 0) and (0.03, 4.5).\n- For the bigger-mass ball (B): draw a line with the same gradient as A (parallel), since the net force is unchanged.\n- Position B so its (more negative) intercept reflects the bigger initial momentum magnitude.',
      solution: '1. Line A: unchanged, as originally drawn.\n2. Line B: parallel to line A (same gradient, since F_net is unchanged) but shifted, reflecting a more negative initial momentum for the bigger mass at the same initial velocity.',
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
