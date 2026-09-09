#!/usr/bin/env node
/**
 * DBE Physical Sciences: Physics P1 — November 2025 — Question 7 (order 10)
 * Electrostatics: a charged sphere, its electric field, and a three-charge friction
 * scenario. One continuous scenario across 7.1-7.5 — bundled per DESIGN-UNI-10.
 *
 *   node tools/validate-questions.js --script scripts/add-physics-2025-nov-p1-q7.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-physics-2025-nov-p1-q7.js --dry-run
 *   node scripts/add-physics-2025-nov-p1-q7.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env') ? process.argv[process.argv.indexOf('--env') + 1] : 'dev';
const PAPER = 'https://media-dev.askmoreprepmore.app/exam_papers/dbe/physics/2025/nov_p1';

const video = {
  name: 'Question 7',
  syllabus: 'dbe',
  subject: 'physics',
  year: 2025,
  paper: 'nov_p1',
  order: 10,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['electric_field', 'coulombs_law'],
  question_image_urls: [`${PAPER}/q7/question_1.png`],
  memo_image_urls: [`${PAPER}/q7/memo_1.png`, `${PAPER}/q7/memo_2.png`],
  exam_question_marks: 15,
  supplementary_materials: [
    { type: 'formula_sheet', label: 'Formula Sheet', image_urls: [`${PAPER}/q0/question_1.png`, `${PAPER}/q0/question_2.png`, `${PAPER}/q0/question_3.png`] },
  ],
};

const questions = [
  {
    name: 'Question 1',
    question: 'Which ONE of the following correctly describes an electric field?',
    metadata: [
      'A region of space where a charge experiences a gravitational force.',
      'A region of space in which an electric charge experiences a force.',
      'The path along which a charge moves.',
      'A measure of the total charge contained in a region.',
      '',
    ],
    answer: ['A region of space in which an electric charge experiences a force.', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'definition',
    unit: 'electricity_magnetism', topic: 'electrostatics', subtopic: 'electric_field_diagrams',
    skills: ['electric_field_description'],
    difficulty: 1, exam_weight: 2, xp: 10, order: 1,
    syllabus: 'dbe', subject: 'physics', year: 2025, paper: 'nov_p1',
    clues: '- An electric field is defined by its effect on a charge placed within it.\n- Distinguish it from a gravitational field and from the physical path of a moving charge.',
  },
  {
    name: 'Question 2',
    question: 'Which ONE of the following correctly describes the electric field pattern around an isolated positive point charge?',
    metadata: [
      'Field lines are parallel to each other everywhere near the charge.',
      'Field lines point radially outward from the charge.',
      'Field lines point radially inward toward the charge.',
      'There are no field lines around a positive charge.',
      '',
    ],
    answer: ['Field lines point radially outward from the charge.', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'interpretation',
    unit: 'electricity_magnetism', topic: 'electrostatics', subtopic: 'electric_field_diagrams',
    skills: ['field_pattern_recognition'],
    difficulty: 2, exam_weight: 2, xp: 10, order: 2,
    syllabus: 'dbe', subject: 'physics', year: 2025, paper: 'nov_p1',
    clues: '- A positive test charge placed near the charge would be pushed away from it.\n- Field lines point in the direction a positive test charge would move.',
  },
  {
    name: 'Question 3',
    question: 'Calculate the magnitude of the electric field at a point 0.02 m from a point charge of magnitude 4 × 10⁻⁷ C.',
    metadata: ['E = ', '[ ]', ' × 10⁶ N·C⁻¹'],
    answer: ['9', '', '', '', ''],
    presentation: 'fitb',
    type: 'calc',
    unit: 'electricity_magnetism', topic: 'electrostatics', subtopic: 'electric_field_diagrams',
    skills: ['electric_field_calculation'],
    difficulty: 3, exam_weight: 2, xp: 10, order: 3,
    syllabus: 'dbe', subject: 'physics', year: 2025, paper: 'nov_p1',
    clues: '- Use E = k\frac{Q}{r²}, with k = 9 × 10⁹ N·m²·C⁻².\n- Substitute directly — no need to rearrange.',
  },
  {
    name: 'Question 4',
    question: 'A charged sphere resting on a rough horizontal surface remains stationary even though a net electrostatic force acts on it. What can be concluded about the frictional force acting on the sphere?',
    metadata: [
      'It must be zero, since the sphere is not moving.',
      'It must be equal in magnitude and opposite in direction to the net electrostatic force.',
      'It must be greater in magnitude than the net electrostatic force.',
      'It cannot be determined from the information given.',
      '',
    ],
    answer: ['It must be equal in magnitude and opposite in direction to the net electrostatic force.', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'electricity_magnetism', topic: 'electrostatics', subtopic: 'electric_field_diagrams',
    skills: ['electric_field_calculation'],
    difficulty: 3, exam_weight: 2, xp: 10, order: 4,
    syllabus: 'dbe', subject: 'physics', year: 2025, paper: 'nov_p1',
    clues: '- The sphere is stationary, so the net force on it must be zero.\n- Apply Newton’s first law to the horizontal forces acting on the sphere.',
  },
  {
    name: 'Question 5',
    question:
      'Two identical metal spheres, P and Q, carry charges of +6 × 10⁻⁷ C and −2 × 10⁻⁷ C respectively, and are placed a fixed distance apart. Sphere Q is brought into contact with an identical, initially uncharged sphere R, then returned to its original position. How will the magnitude of the electrostatic force between P and Q now compare to before?',
    metadata: ['Increases', 'Decreases', 'Remains the same', 'Becomes zero', ''],
    answer: ['Decreases', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'electricity_magnetism', topic: 'electrostatics', subtopic: 'electric_field_diagrams',
    skills: ['charge_redistribution'],
    difficulty: 4, exam_weight: 2, xp: 10, order: 5,
    syllabus: 'dbe', subject: 'physics', year: 2025, paper: 'nov_p1',
    clues: '- When two identical spheres touch, their total charge is shared equally between them.\n- Work out Q’s new charge magnitude, then compare it to its original magnitude.',
  },
  {
    name: 'Question 6',
    question: 'Match each electrostatic quantity to its correct formula.',
    metadata: [
      'A - Electric field magnitude',
      'B - Electrostatic force magnitude',
      'C - Number of excess electrons on a charged object',
      '1 - F = k\frac{Q₁Q₂}{r²}',
      '2 - E = k\frac{Q}{r²}',
      '3 - n = \frac{Q}{e}',
    ],
    answer: ['A-2', 'B-1', 'C-3'],
    presentation: 'match',
    type: 'definition',
    unit: 'electricity_magnetism', topic: 'electrostatics', subtopic: 'electric_field_diagrams',
    skills: ['electric_field_calculation'],
    difficulty: 2, exam_weight: 2, xp: 10, order: 6,
    syllabus: 'dbe', subject: 'physics', year: 2025, paper: 'nov_p1',
    clues: '- Electric field depends on one charge and distance; electrostatic force depends on two charges and distance.\n- Charge quantization relates total charge to the number of electrons and the charge on one electron.',
  },
];

const aiExplanation = {
  sub_questions: [
    {
      number: '7.1', marks: 2,
      clues: '- An electric field is defined by what it does to a charge placed within it.\n- Describe it in terms of a force, not a physical object.',
      approach: '- Recall that a field is a region of space with a specific property.\n- Identify that property as the force experienced by a charge placed there.',
      solution: '1. A region of space in which an electric charge experiences a force.',
    },
    {
      number: '7.2', marks: 2,
      clues: '- Sphere X carries a positive charge — field lines point away from a positive charge.\n- Draw lines radiating outward in all directions, evenly spaced.',
      approach: '- Recall that field lines around a positive charge point radially outward.\n- Draw several lines from the charge outward, with arrowheads showing direction.',
      solution: '1. Field lines are drawn pointing radially outward from sphere X, in all directions, since X carries a positive charge.',
    },
    {
      number: '7.3', marks: 3,
      clues: '- Use E = kQ/r², with the given field magnitude and the charge on X.\n- Rearrange to make r the subject before substituting.',
      approach: '- Write E = kQ/r².\n- Substitute E = 1.08 × 10⁶ N·C⁻¹, k = 9 × 10⁹ N·m²·C⁻², Q = 3 × 10⁻⁷ C.\n- Solve for r.',
      solution: '1. E = kQ/r²\n2. 1.08 × 10⁶ = (9 × 10⁹)(3 × 10⁻⁷) / r²\n3. r² = 0.0025\n4. r = 0.05 m',
    },
    {
      number: '7.4', marks: 6,
      clues: '- Calculate the electrostatic force from Y on X and from Z on X separately using Coulomb’s law, then combine them (they act in different directions since Y and Z are on opposite sides of X).\n- Compare the net electrostatic force to the given net force on X (0.0427 N) — any difference must be friction.',
      approach: '- Calculate F(X,Y) using Coulomb’s law with the charges on X and Y and their separation r.\n- Calculate F(X,Z) using the charges on X and Z and their separation (0.04 m).\n- Combine these two forces (accounting for direction) to get the net electrostatic force on X.\n- Compare this to the given net force (0.0427 N) — if they differ, friction must account for the difference, so the surface is not frictionless.',
      solution: '1. F(X,Y) = kQ_xQ_y/r² = (9×10⁹)(3×10⁻⁷)(5×10⁻⁷)/(0.05)² = 0.54 N\n2. F(X,Z) = kQ_xQ_z/r² = (9×10⁹)(3×10⁻⁷)(4×10⁻⁷)/(0.04)² = 0.68 N\n3. Net electrostatic force = 0.68 − 0.54 = 0.14 N (Y and Z both attract X, but in opposite directions since they’re on opposite sides)\n4. The given net force on X is 0.0427 N, which is less than the net electrostatic force of 0.14 N.\n5. Since these don’t match, an additional force (friction) must be acting — the surface is NOT frictionless.',
    },
    {
      number: '7.5', marks: 2,
      clues: '- When Y touches X, they share their total charge equally (since they’re identical spheres).\n- Work out Y’s new charge magnitude, then compare the resulting force to the original.',
      approach: '- Add the charges on X and Y, then divide by two to find each sphere’s new charge after contact.\n- Compare the new charge magnitude on Y to its original magnitude.\n- Conclude how the force between X and Y changes.',
      solution: '1. The charge decreases.',
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
