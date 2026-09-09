#!/usr/bin/env node
/**
 * DBE Physical Sciences: Physics P1 — November 2025 — Question 1, Part 3 (order 3)
 * MCQ items 1.7–1.9 — Electricity & Magnetism (Coulomb's law, series-parallel
 * circuits, the DC motor commutator).
 *
 * See subjects/dbe-physics.md's "Paper structure / video mapping". This is Part 3 of 4.
 *
 *   node tools/validate-questions.js --script scripts/add-physics-2025-nov-p1-q1-part3.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-physics-2025-nov-p1-q1-part3.js --dry-run
 *   node scripts/add-physics-2025-nov-p1-q1-part3.js
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

const video = {
  name: 'Question 1.7–1.9',
  syllabus: 'dbe',
  subject: 'physics',
  year: 2025,
  paper: 'nov_p1',
  order: 3,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['coulombs_law', 'circuit_analysis', 'dc_motor'],
  question_image_urls: [`${PAPER}/q1/question_8.png`, `${PAPER}/q1/question_4.png`],
  memo_image_urls: [`${PAPER}/q1/memo_1.png`],
  exam_question_marks: 6,
  supplementary_materials: [
    {
      type: 'formula_sheet',
      label: 'Formula Sheet',
      image_urls: [`${PAPER}/q0/question_1.png`, `${PAPER}/q0/question_2.png`, `${PAPER}/q0/question_3.png`],
    },
  ],
};

const questions = [
  {
    name: 'Question 1',
    question:
      'Three point charges, A, B and C, are fixed in a straight line in that order, with B between A and C. Charge A is 0.3 m from B, and C is 0.9 m from B. The magnitude of the charge on B is q. The net electrostatic force on charge A is zero. The magnitude of the charge on C is:',
    metadata: ['The magnitude of the charge on C is ', '[ ]', ' q'],
    answer: ['16', '', '', '', ''],
    presentation: 'fitb',
    type: 'calc',
    unit: 'electricity_magnetism',
    topic: 'electrostatics',
    subtopic: 'coulombs_law',
    skills: ['coulombs_law', 'inverse_square_relationship', 'force_balance'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p1',
    clues: '- Set the force from B on A equal in magnitude to the force from C on A, since the net force on A is zero.\n- Use Coulomb’s law with the correct distance from each charge to A (A to C is the sum of the two given distances), then solve for the charge on C in terms of q.',
  },
  {
    name: 'Question 2',
    question: 'Two point charges of +2 × 10⁻⁶ C and +3 × 10⁻⁶ C are placed 0.5 m apart. Calculate the magnitude of the electrostatic force between them.',
    metadata: ['F = ', '[ ]', ' N'],
    answer: ['0.216', '', '', '', ''],
    presentation: 'fitb',
    type: 'calc',
    unit: 'electricity_magnetism',
    topic: 'electrostatics',
    subtopic: 'coulombs_law',
    skills: ['coulombs_law', 'inverse_square_relationship'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p1',
    clues: '- Use Coulomb’s law, F = kQ₁Q₂/r².\n- Substitute both charges, the distance, and Coulomb’s constant (k = 9 × 10⁹ N·m²·C⁻²).',
  },
  {
    name: 'Question 3',
    question:
      'Two identical bulbs, P and Q, are connected in parallel with each other, and this parallel combination is connected in series with a third identical bulb, R, and a battery of negligible internal resistance. A switch, S, is connected in series with bulb Q only. Switch S is initially open, then closed. How will the brightness of bulbs P and R be affected?',
    metadata: [
      'Brightness of P: increases. Brightness of R: decreases.',
      'Brightness of P: decreases. Brightness of R: increases.',
      'Brightness of P: increases. Brightness of R: increases.',
      'Brightness of P: decreases. Brightness of R: decreases.',
      '',
    ],
    answer: ['Brightness of P: decreases. Brightness of R: increases.', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'interpretation',
    unit: 'electricity_magnetism',
    topic: 'electric_circuits',
    subtopic: 'series_parallel_combination',
    skills: ['circuit_analysis', 'series_parallel_resistance', 'brightness_current_relationship'],
    difficulty: 4,
    exam_weight: 3,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p1',
    clues: '- Redraw the circuit for S open and S closed, and work out the total resistance in each case.\n- Brightness depends on the current through each bulb — use I = V/Rₜₒₜₐₗ, then consider how current splits at the parallel junction once Q starts conducting.',
  },
  {
    name: 'Question 4',
    question: 'Two resistors of 6 Ω and 3 Ω are connected in parallel. Calculate the equivalent resistance of the combination.',
    metadata: ['R = ', '[ ]', ' Ω'],
    answer: ['2', '', '', '', ''],
    presentation: 'fitb',
    type: 'calc',
    unit: 'electricity_magnetism',
    topic: 'electric_circuits',
    subtopic: 'series_parallel_combination',
    skills: ['series_parallel_resistance'],
    difficulty: 2,
    exam_weight: 3,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p1',
    clues: '- For resistors in parallel, 1/Rₚ = 1/R₁ + 1/R₂.\n- Combine the two fractions before inverting to find Rₚ.',
  },
  {
    name: 'Question 5',
    question: 'Match each modification to a running DC motor with its effect on the coil’s rotation.',
    metadata: [
      'A - The split-ring commutator is replaced with two continuous slip rings',
      'B - The direction of the supply current is reversed',
      '1 - The coil oscillates back and forth for half a turn at a time, instead of rotating continuously',
      '2 - The coil’s direction of rotation reverses, but it keeps rotating continuously',
    ],
    answer: ['A-1', 'B-2'],
    presentation: 'match',
    type: 'interpretation',
    unit: 'electricity_magnetism',
    topic: 'electrodynamics',
    subtopic: 'dc_motor_commutator',
    skills: ['dc_motor', 'commutator_function', 'torque_direction', 'current_reversal_effect'],
    difficulty: 4,
    exam_weight: 2,
    xp: 10,
    order: 5,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p1',
    clues: '- Without a commutator, the current direction in the coil never reverses as it rotates — think about what that does to the torque once the coil passes the no-current-reversal point.\n- Reversing the supply current reverses the current in the coil at every point in its rotation, not just for one instant.',
  },
];

const aiExplanation = {
  sub_questions: [
    {
      number: '1.7',
      marks: 2,
      clues: '- The net force on Q₁ is zero, so the force from Q₂ on Q₁ must equal in magnitude the force from Q₃ on Q₁.\n- Use Coulomb’s law with the correct distance from each charge to Q₁, then solve for Q₃ in terms of q.',
      approach: '- Write Coulomb’s law for the force between Q₁ and Q₂ (distance r) and between Q₁ and Q₃ (distance r + 2r = 3r).\n- Set the two force magnitudes equal, since the net force on Q₁ is zero.\n- Solve the resulting equation for Q₃ in terms of q.',
      solution: '1. Distance from Q₁ to Q₂ is r; distance from Q₁ to Q₃ is r + 2r = 3r.\n2. F(Q₁,Q₂) = kQ₁q/r²\n3. F(Q₁,Q₃) = kQ₁Q₃/(3r)²\n4. Net force on Q₁ is zero ⇒ kQ₁q/r² = kQ₁Q₃/(3r)²\n5. q/r² = Q₃/9r² ⇒ Q₃ = 9q\n6. The correct answer is D: 9q.',
    },
    {
      number: '1.8',
      marks: 2,
      clues: '- Work out the circuit’s total resistance with S closed, then with S open, and see how the total current from the battery changes.\n- For bulb Y specifically, track how its share of the current changes now that Z’s branch is disconnected.',
      approach: '- Redraw the circuit for S closed and S open, and identify which bulbs are in series/parallel in each case.\n- Compare total resistance in both cases to see how total current changes — this determines X’s brightness, since X carries all the current.\n- For Y, note that with S open, Y now carries the full circuit current instead of sharing it with Z.',
      solution: '1. With S closed: Y and Z are in parallel (equal resistance R each, combined R/2), in series with X, so Rₜₒₜₐₗ = R + R/2 = 1.5R.\n2. With S open: the Z branch is broken, so only Y conducts; Rₜₒₜₐₗ = R + R = 2R.\n3. Total current I = V/Rₜₒₜₐₗ decreases when S opens (1.5R → 2R), and X carries this total current, so X’s brightness decreases.\n4. With S closed, Y shared the current equally with Z: I_Y = I_total/2 = V/(3R).\n5. With S open, Y carries the full (smaller) total current alone: I_Y = V/(2R), which is greater than V/(3R).\n6. So Y’s brightness increases. The correct answer is B: X decreases, Y increases.',
    },
    {
      number: '1.9',
      marks: 2,
      clues: '- Think about what would happen to the direction of rotation if the current in the coil never changed direction as the coil turns.\n- The commutator’s job is to keep the torque acting in the same rotational sense every half-turn.',
      approach: '- Recall that a coil in a magnetic field experiences a torque that reverses direction every half-rotation if the current stays the same.\n- The commutator’s split-ring contacts reverse the current direction in the coil at the same points.\n- This reversal keeps the torque acting in a consistent rotational direction, so the coil keeps spinning the same way.',
      solution: '1. As the coil rotates, the torque on it would reverse direction every half-turn if the current direction stayed fixed.\n2. The commutator (split-ring) reverses the direction of current flow in the coil every half-rotation.\n3. This keeps the torque always acting to rotate the coil in the same direction.\n4. The correct answer is C: by reversing the direction of the current in the coil.',
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
