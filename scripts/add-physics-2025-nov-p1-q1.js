#!/usr/bin/env node
/**
 * DBE Physical Sciences: Physics P1 — November 2025 — Question 1 (order 1)
 * Multiple-choice block (1.1–1.10): net force/acceleration, free-fall vs constant-
 * velocity motion graph, work-energy-power on a lifted box, momentum, friction/net
 * work, Doppler redshift, Coulomb's law, series-parallel circuit brightness, DC motor
 * commutator, photoelectric effect graph.
 *
 * First question set authored against subjects/dbe-physics.md — pilot for the profile.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-physics-2025-nov-p1-q1.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-physics-2025-nov-p1-q1.js --dry-run
 *   node scripts/add-physics-2025-nov-p1-q1.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

const IMG = 'https://media-dev.askmoreprepmore.app/exam_papers/dbe/physics/2025/nov_p1';

// ─── Phase 2 — lesson document ───────────────────────────────────────────────

const video = {
  name: 'Question 1',
  syllabus: 'dbe',
  subject: 'physics',
  year: 2025,
  paper: 'nov_p1',
  order: 1,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['newtons_second_law', 'coulombs_law', 'circuit_analysis', 'photoelectric_effect'],
  question_image_urls: [
    `${IMG}/q1/question_1.png`,
    `${IMG}/q1/question_2.png`,
    `${IMG}/q1/question_3.png`,
    `${IMG}/q1/question_4.png`,
    `${IMG}/q1/question_5.png`,
  ],
  memo_image_urls: [`${IMG}/q1/memo_1.png`],
  exam_question_marks: 20,
  supplementary_materials: [
    {
      type: 'formula_sheet',
      label: 'Formula Sheet',
      image_urls: [`${IMG}/q0/question_1.png`, `${IMG}/q0/question_2.png`, `${IMG}/q0/question_3.png`],
    },
  ],
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    name: 'Question 1',
    question:
      'A trolley experiences a single unbalanced horizontal force that varies in magnitude over time but never changes direction. Which statement about the trolley’s acceleration is always true?',
    metadata: [
      'The acceleration is zero.',
      'The acceleration is in the same direction as the net force, and its magnitude changes with the net force.',
      'The acceleration is opposite in direction to the net force.',
      'The acceleration is constant, regardless of the net force’s magnitude.',
      '',
    ],
    answer: [
      'The acceleration is in the same direction as the net force, and its magnitude changes with the net force.',
      '', '', '', '',
    ],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'mechanics',
    topic: 'newtons_laws',
    subtopic: 'net_force_acceleration',
    skills: ['newtons_second_law', 'net_force', 'acceleration_direction'],
    difficulty: 2,
    exam_weight: 3,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p1',
    clues:
      '- Consider what Newton’s second law says about the relationship between net force and acceleration.\n- The direction of acceleration always follows the direction of the net force, whatever its magnitude.',
  },
  {
    name: 'Question 2',
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
    order: 2,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p1',
    clues:
      '- Set the force from B on A equal in magnitude to the force from C on A, since the net force on A is zero.\n- Use Coulomb’s law with the correct distance from each charge to A (A to C is the sum of the two given distances), then solve for the charge on C in terms of q.',
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
    clues:
      '- Redraw the circuit for S open and S closed, and work out the total resistance in each case.\n- Brightness depends on the current through each bulb — use I = V/R_total, then consider how current splits at the parallel junction once Q starts conducting.',
  },
  {
    name: 'Question 4',
    question:
      'A metal surface has a threshold frequency of f₀. Light of frequency f, where f < f₀, is shone on the metal surface. Select ALL the statements below that are correct.',
    metadata: [
      'No photoelectrons are emitted from the surface.',
      'Increasing the intensity of the light will cause photoelectrons to be emitted.',
      'Increasing the frequency of the light to a value above f₀ would cause photoelectrons to be emitted.',
      'The photoelectrons, if emitted, would have a maximum kinetic energy of zero.',
      'The threshold frequency, f₀, depends only on the type of metal used.',
    ],
    answer: [
      'No photoelectrons are emitted from the surface.',
      'Increasing the frequency of the light to a value above f₀ would cause photoelectrons to be emitted.',
      'The threshold frequency, f₀, depends only on the type of metal used.',
      '', '',
    ],
    presentation: 'multi_select',
    type: 'application',
    unit: 'matter_materials',
    topic: 'optical_phenomena',
    subtopic: 'photoelectric_effect_threshold',
    skills: ['photoelectric_effect', 'threshold_frequency', 'work_function'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p1',
    clues:
      '- Compare the light’s frequency to the threshold frequency f₀ for this metal.\n- Below f₀, no photoelectrons are emitted no matter how intense the light is — intensity only affects the rate of emission once emission is already possible, not whether it happens at all.',
  },
];

// ─── AI explanation (AMPM-CONTENT-AI-EXP) — one entry per exam sub-question ───

const aiExplanation = {
  sub_questions: [
    {
      number: '1.1',
      marks: 2,
      clues: '- Recall Newton’s second law: F_net = ma.\n- Think about what direction acceleration must point in relative to the net force.',
      approach: '- Consider each option against Newton’s second law.\n- Eliminate options that describe motion rather than the force-acceleration relationship.\n- Confirm that net force and acceleration are always in the same direction, whatever the object’s state of motion.',
      solution: '1. Newton’s second law states F_net = ma.\n2. Mass m is always positive, so acceleration a must point in the same direction as F_net.\n3. This holds regardless of the object’s direction of motion — eliminates A.\n4. The correct answer is B.',
    },
    {
      number: '1.2',
      marks: 2,
      clues: '- At the instant of release, the stone has the same velocity as the balloon.\n- After release, only gravity acts on the stone, so its velocity changes at a constant rate.',
      approach: '- Identify the stone’s initial velocity — it must equal the balloon’s velocity at the moment of release.\n- Determine the sign and constancy of the stone’s acceleration after release (gravity only).\n- Match the graph showing the stone’s line starting at the balloon’s line, then decreasing linearly through and past zero.',
      solution: '1. At release, the stone’s velocity equals the balloon’s velocity — the two lines must meet at that instant.\n2. After release, the only force on the stone is gravity, so a = −g (constant).\n3. The stone’s velocity therefore decreases linearly from the balloon’s velocity, becoming negative as it falls.\n4. Graph B shows exactly this: the stone’s line starts where the balloon’s line is, then slopes down at a constant negative gradient.\n5. The correct answer is B.',
    },
    {
      number: '1.3',
      marks: 2,
      clues: '- Constant velocity means the applied force equals the box’s weight, and both stay constant.\n- Power = force × velocity; also consider how height gained affects gravitational PE, and how constant velocity affects KE.',
      approach: '- Recognise that constant velocity means the motor’s force equals the box’s weight (both constant).\n- Power = F·v, so with both constant, the rate of work is constant.\n- KE stays constant (v constant), but gravitational PE increases as height increases, so mechanical energy increases.\n- Match these two conclusions to the given statements.',
      solution: '1. Constant velocity ⇒ the motor’s force equals the box’s weight (both constant).\n2. Power = F·v, and F and v are both constant, so the rate of work done is constant — statement (ii) is true, (i) is false.\n3. KE = ½mv² is constant since v is constant.\n4. Gravitational PE = mgh increases as the box rises.\n5. Mechanical energy = KE + PE, so it increases — statement (iii) is true, (iv) is false.\n6. The correct answer is C: (ii) and (iii) only.',
    },
    {
      number: '1.4',
      marks: 2,
      clues: '- Write momentum as p = mv for each object, using their given masses.\n- Set the two momentum expressions equal, since the objects have the same momentum.',
      approach: '- Express the momentum of P and Q in terms of their masses and velocities.\n- Equate the two expressions since p_P = p_Q.\n- Solve for v_P in terms of v_Q.',
      solution: '1. p_P = m·v_P and p_Q = 2m·v_Q\n2. p_P = p_Q ⇒ m·v_P = 2m·v_Q\n3. v_P = 2v_Q\n4. The velocity of P is twice the velocity of Q — the correct answer is C.',
    },
    {
      number: '1.5',
      marks: 2,
      clues: '- Both F and the kinetic friction force are constant in magnitude — consider what that means for the net force and hence the acceleration.\n- Net work done is force × distance moved — think about how the distance travelled changes as the block keeps moving.',
      approach: '- Calculate the net force: F_net = F − f_k = 18 − 6 = 12 N (constant).\n- Since F_net is constant and mass is constant, acceleration is constant (Newton’s second law).\n- Net work done = F_net × distance moved; as the block keeps moving, the distance increases, so the net work done increases over time.',
      solution: '1. F_net = F − f_k = 18 − 6 = 12 N (constant, since F and f_k are both constant)\n2. a = F_net / m — constant, since F_net and m are constant\n3. W_net = F_net·Δx — as the block continues moving, Δx increases, so W_net increases\n4. Acceleration: constant. Net work: increases.\n5. The correct answer is A.',
    },
    {
      number: '1.6',
      marks: 2,
      clues: '- Redshift refers to a shift in the observed wavelength/frequency of light compared to its emitted values.\n- Relate ‘red’ to which end of the visible spectrum has the longer wavelength.',
      approach: '- Recall that a redshift means the observed light has shifted towards the red end of the spectrum.\n- Red light has a longer wavelength than the original (emitted) light.\n- Rule out options referring to the speed of light (constant) or frequency (which would decrease, not increase, for a redshift).',
      solution: '1. A redshift means the observed spectral lines have shifted towards the red end of the spectrum.\n2. Red light has a longer wavelength than the original (emitted) light.\n3. Since v = fλ and v (speed of light) is constant, a longer wavelength corresponds to a lower frequency, not higher — eliminates C.\n4. The speed of light does not change — eliminates A.\n5. A redshift does not by itself mean the star is moving toward Earth (that would be a blueshift) — eliminates B.\n6. The correct answer is D: the wavelength of each spectral line has increased.',
    },
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
      solution: '1. With S closed: Y and Z are in parallel (equal resistance R each, combined R/2), in series with X, so R_total = R + R/2 = 1.5R.\n2. With S open: the Z branch is broken, so only Y conducts; R_total = R + R = 2R.\n3. Total current I = V/R_total decreases when S opens (1.5R → 2R), and X carries this total current, so X’s brightness decreases.\n4. With S closed, Y shared the current equally with Z: I_Y = I_total/2 = V/(3R).\n5. With S open, Y carries the full (smaller) total current alone: I_Y = V/(2R), which is greater than V/(3R).\n6. So Y’s brightness increases. The correct answer is B: X decreases, Y increases.',
    },
    {
      number: '1.9',
      marks: 2,
      clues: '- Think about what would happen to the direction of rotation if the current in the coil never changed direction as the coil turns.\n- The commutator’s job is to keep the torque acting in the same rotational sense every half-turn.',
      approach: '- Recall that a coil in a magnetic field experiences a torque that reverses direction every half-rotation if the current stays the same.\n- The commutator’s split-ring contacts reverse the current direction in the coil at the same points.\n- This reversal keeps the torque acting in a consistent rotational direction, so the coil keeps spinning the same way.',
      solution: '1. As the coil rotates, the torque on it would reverse direction every half-turn if the current direction stayed fixed.\n2. The commutator (split-ring) reverses the direction of current flow in the coil every half-rotation.\n3. This keeps the torque always acting to rotate the coil in the same direction.\n4. The correct answer is C: by reversing the direction of the current in the coil.',
    },
    {
      number: '1.10',
      marks: 2,
      clues: '- Start from E_k(max) = hf − W₀ and substitute f = c/λ to get E_k(max) in terms of 1/λ.\n- Identify the gradient and the intercepts of this straight-line equation, then match them to the graph shapes.',
      approach: '- Combine E_k(max) = hf − W₀ with c = fλ to express E_k(max) as a function of 1/λ.\n- Recognise this as a straight-line equation y = mx + c, and identify the gradient and y-intercept.\n- Note that the graph must have a positive x-intercept (below the threshold frequency, no electrons are emitted).',
      solution: '1. E_k(max) = hf − W₀\n2. f = c/λ, so E_k(max) = hc(1/λ) − W₀\n3. This is a straight line with a positive gradient (hc) and a negative y-intercept (−W₀).\n4. It therefore has a positive x-intercept (where E_k(max) = 0, corresponding to the threshold frequency).\n5. Graph C shows a straight line with positive gradient crossing the x-axis at a positive value of 1/λ, not passing through the origin.\n6. The correct answer is C.',
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
