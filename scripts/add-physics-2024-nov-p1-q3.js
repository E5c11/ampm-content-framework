#!/usr/bin/env node
/**
 * DBE Physical Sciences: Physics P1 — November 2024 — Question 3 (order 6)
 * Vertical projectile motion: two balls thrown up and down from a building, landing together; position and velocity-time graphs.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-physics-2024-nov-p1-q3.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-physics-2024-nov-p1-q3.js --dry-run
 *   node scripts/add-physics-2024-nov-p1-q3.js
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
  name: 'Question 3',
  syllabus: 'dbe',
  subject: 'physics',
  year: 2024,
  paper: 'nov_p1',
  order: 6,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['vertical_projectile_motion', 'free_fall', 'velocity_time_graphs'],
  question_image_urls: [`${PAPER}/q3/question_1.png`],
  memo_image_urls: [
    `${PAPER}/q3/memo_1.png`, `${PAPER}/q3/memo_2.png`, `${PAPER}/q3/memo_3.png`,
    `${PAPER}/q3/memo_4.png`, `${PAPER}/q3/memo_5.png`, `${PAPER}/q3/memo_6.png`,
  ],
  exam_question_marks: 16,
  supplementary_materials: [FORMULA_SHEET],
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    name: 'Question 1',
    question:
      'Ball P is thrown vertically upwards at 9 m·s⁻¹ from the top of a tower. 1.5 s later, ball Q is thrown vertically downwards at 4.6 m·s⁻¹ from the same point. Both balls strike the ground at the same time, t seconds after P was thrown. Ignore air friction. Complete the working to calculate t.',
    metadata: [
      'Upwards positive. Ball P: Δy = 9t + ½(−9.8)t²',
      'Ball Q, thrown 1.5 s later: Δy = −4.6(t − 1.5) + ½(−9.8)(t − 1.5)²',
      'Both balls fall through the same displacement, so 9t − 4.9t² = −4.6(t − 1.5) − 4.9(t − 1.5)²',
      'Expanding the right-hand side gives 9t − 4.9t² = −4.9t² + 10.1t − 4.125, so −1.1t = −4.125 and t (in s, to two decimal places):',
      '[ ]',
    ],
    answer: ['3.75'],
    presentation: 'steps',
    type: 'calc',
    unit: 'mechanics', topic: 'vertical_projectile_motion', subtopic: 'projectile_motion_calculations',
    skills: ['kinematics_equations', 'time_calculation', 'free_fall'],
    difficulty: 5, exam_weight: 3, xp: 10, order: 1,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p1',
    clues:
      '- Ball Q has been in the air for (t − 1.5) s, not t seconds.\n- The −4.9t² terms on both sides cancel, which leaves a linear equation in t.',
  },
  {
    name: 'Question 2',
    question:
      'For the same two balls, ball P strikes the ground 3.75 s after it was thrown upwards at 9 m·s⁻¹. Using equations of motion, calculate the height of the tower.',
    metadata: ['Height = ', '[ ]', ' m'],
    answer: ['35.16|35.156', '', '', '', ''],
    presentation: 'fitb',
    type: 'calc',
    unit: 'mechanics', topic: 'vertical_projectile_motion', subtopic: 'projectile_motion_calculations',
    skills: ['kinematics_equations', 'free_fall'],
    difficulty: 3, exam_weight: 3, xp: 10, order: 2,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p1',
    clues:
      '- Use Δy = vᵢΔt + ½aΔt² for ball P over the whole 3.75 s.\n- The answer comes out negative with upwards positive. The height is its magnitude.',
  },
  {
    name: 'Question 3',
    question:
      'Ball P is thrown upwards at 9 m·s⁻¹ from the top of the 35.16 m tower. Calculate the MAXIMUM height above the GROUND that ball P reaches.',
    metadata: ['Maximum height = ', '[ ]', ' m'],
    answer: ['39.29|39.289', '', '', '', ''],
    presentation: 'fitb',
    type: 'calc',
    unit: 'mechanics', topic: 'vertical_projectile_motion', subtopic: 'projectile_motion_calculations',
    skills: ['kinematics_equations', 'gravity_only_motion'],
    difficulty: 3, exam_weight: 3, xp: 10, order: 3,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p1',
    clues:
      '- At the highest point the velocity is zero, so use v(f)² = vᵢ² + 2aΔy to find how far P rises above the tower.\n- Then add the height of the tower.',
  },
  {
    name: 'Question 4',
    question:
      'Ball P is thrown upwards at t = 0 and ball Q is thrown downwards at t = 1.5 s. Both are in free fall until they land at the same time. Taking UPWARDS as positive, select ALL the CORRECT statements about their velocity-time graphs.',
    metadata: [
      'Graph Q starts at +4.6 m·s⁻¹',
      'Both graphs are straight lines with the same negative gradient',
      'Graph P starts at +9 m·s⁻¹ at t = 0',
      'Graph Q starts at −4.6 m·s⁻¹ at t = 1.5 s',
      'Graph P has a steeper gradient than graph Q',
    ],
    answer: [
      'Both graphs are straight lines with the same negative gradient',
      'Graph P starts at +9 m·s⁻¹ at t = 0',
      'Graph Q starts at −4.6 m·s⁻¹ at t = 1.5 s',
      '',
      '',
    ],
    presentation: 'multi_select',
    type: 'interpretation',
    unit: 'mechanics', topic: 'vertical_projectile_motion', subtopic: 'free_fall_identification',
    skills: ['velocity_time_relationship', 'graph_gradient_interpretation', 'free_fall'],
    difficulty: 3, exam_weight: 3, xp: 10, order: 4,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p1',
    clues:
      '- The gradient of a velocity-time graph is the acceleration. In free fall it is the same for both balls.\n- Q is thrown DOWNWARDS, and upwards is positive.',
  },
  {
    name: 'Question 5',
    question:
      'Ball P was thrown upwards at 9 m·s⁻¹ and lands 3.75 s later. Ignore air friction. Calculate the speed with which ball P strikes the ground.',
    metadata: ['Speed = ', '[ ]', ' m·s⁻¹'],
    answer: ['27.75', '', '', '', ''],
    presentation: 'fitb',
    type: 'calc',
    unit: 'mechanics', topic: 'vertical_projectile_motion', subtopic: 'projectile_motion_calculations',
    skills: ['kinematics_equations', 'free_fall'],
    difficulty: 2, exam_weight: 3, xp: 10, order: 5,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p1',
    clues:
      '- Use v(f) = vᵢ + aΔt with upwards positive and a = −9.8 m·s⁻².\n- Speed is the magnitude of the final velocity.',
  },
];

// ─── AI explanation (AMPM-CONTENT-AI-EXP) — one entry per exam sub-question ───

const aiExplanation = {
  sub_questions: [
    {
      number: '3.1.1',
      marks: 5,
      clues: '- Both balls start at the top of the building and end on the ground, so they have the SAME displacement.\n- Ball B is in the air for (t − 2) seconds.',
      approach: '- Choose upwards as positive.\n- Write Δy = vᵢΔt + ½aΔt² for ball A (time t) and for ball B (time t − 2).\n- Set the two displacements equal and solve for t.',
      solution: '1. Ball A: Δy = 12t + ½(−9.8)t².\n2. Ball B: Δy = −5.4(t − 2) + ½(−9.8)(t − 2)².\n3. ΔyA = ΔyB: 12t − 4.9t² = −5.4(t − 2) − 4.9(t − 2)².\n4. Expanding: 12t − 4.9t² = −5.4t + 10.8 − 4.9t² + 19.6t − 19.6.\n5. 12t = 14.2t − 8.8, so 2.2t = 8.8.\n6. t = 4 s.',
    },
    {
      number: '3.1.2',
      marks: 3,
      clues: '- Z is the height of the building, which is the displacement of either ball.\n- Use ball A over 4 s, or ball B over 2 s.',
      approach: '- Use Δy = vᵢΔt + ½aΔt² for ball A with t = 4 s (upwards positive).\n- The result is negative because the ball ends below its start.\n- Z is the magnitude.',
      solution: '1. Ball A: Δy = vᵢΔt + ½aΔt².\n2. Δy = (12)(4) + ½(−9.8)(4)².\n3. Δy = 48 − 78.4 = −30.4 m.\n4. Z = 30.4 m.\n5. Check with ball B: Δy = (−5.4)(2) + ½(−9.8)(2)² = −10.8 − 19.6 = −30.4 m.',
    },
    {
      number: '3.1.3',
      marks: 4,
      clues: '- Y is the highest position ball A reaches, measured from the ground.\n- At the top, A’s velocity is zero.',
      approach: '- Use v(f)² = vᵢ² + 2aΔy with v(f) = 0 to find how far A rises above the building.\n- Add the height of the building (30.4 m).',
      solution: '1. v(f)² = vᵢ² + 2aΔy.\n2. 0 = (12)² + 2(−9.8)Δy.\n3. Δy = 7.35 m above the top of the building.\n4. Y = 7.35 + 30.4 = 37.75 m (range 37.72 to 37.75 m).',
    },
    {
      number: '3.2',
      marks: 4,
      clues: '- In free fall both balls have the same acceleration, so both lines have the same gradient.\n- Ball A starts at t = 0 and ball B at t = 2 s. Both stop at t = 4 s.',
      approach: '- Choose a sign convention (for example, upwards positive).\n- Ball A: a straight line starting at +12 m·s⁻¹ at t = 0, sloping down, ending at t = 4 s.\n- Ball B: a parallel straight line starting at −5.4 m·s⁻¹ at t = 2 s, ending at t = 4 s. Label both.',
      solution: '1. Upwards positive: graph A starts at +12 m·s⁻¹ at t = 0 and is a straight line with a negative gradient (−9.8 m·s⁻²). It crosses the time axis and ends at t = 4 s (at −27.2 m·s⁻¹).\n2. Graph B starts at −5.4 m·s⁻¹ at t = 2 s, is parallel to graph A, and ends at t = 4 s (at −25 m·s⁻¹).\n3. B starts after A has crossed the time axis, and B lies to the right of A.\n4. With downwards positive, the graph is the mirror image: A starts at −12 m·s⁻¹, B at +5.4 m·s⁻¹, and both have positive gradients.\n5. A mark is deducted if the graphs are not labelled A and B.',
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
