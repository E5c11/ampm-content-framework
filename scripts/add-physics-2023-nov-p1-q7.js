#!/usr/bin/env node
/**
 * DBE Physical Sciences: Physics P1 — November 2023 — Question 7 (order 10)
 * Electrostatics: describing an electric field, field pattern of two like charges, net field between charges, force on an electron.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-physics-2023-nov-p1-q7.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-physics-2023-nov-p1-q7.js --dry-run
 *   node scripts/add-physics-2023-nov-p1-q7.js
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
  name: 'Question 7',
  syllabus: 'dbe',
  subject: 'physics',
  year: 2023,
  paper: 'nov_p1',
  order: 10,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['electric_field', 'coulombs_law'],
  question_image_urls: [`${PAPER}/q7/question_1.png`],
  memo_image_urls: [`${PAPER}/q7/memo_1.png`, `${PAPER}/q7/memo_2.png`, `${PAPER}/q7/memo_3.png`, `${PAPER}/q7/memo_4.png`],
  exam_question_marks: 13,
  supplementary_materials: [FORMULA_SHEET],
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    name: 'Question 1',
    question:
      'A small test charge placed at point P in an electric field experiences a force. It is replaced by a test charge of the same sign but TWICE the magnitude. What happens to the electric field strength at P and to the force on the test charge?',
    metadata: [
      'Field strength doubles; force doubles',
      'Field strength unchanged; force unchanged',
      'Field strength halves; force unchanged',
      'Field strength unchanged; force doubles',
      '',
    ],
    answer: ['Field strength unchanged; force doubles', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'electricity_magnetism', topic: 'electrostatics', subtopic: 'electric_field_strength',
    skills: ['electric_field_description', 'electric_field_calculation'],
    difficulty: 3, exam_weight: 3, xp: 10, order: 1,
    syllabus: 'dbe', subject: 'physics', year: 2023, paper: 'nov_p1',
    clues:
      '- The field at P is produced by the source charges around it, not by the test charge placed there.\n- The force on a charge in a field is F = Eq.',
  },
  {
    name: 'Question 2',
    question:
      'Two equal POSITIVE point charges are placed a short distance apart. Which ONE of the following describes the resultant electric field pattern?',
    metadata: [
      'Lines run straight from one charge into the other charge',
      'Lines point into both charges and meet halfway between them',
      'Lines leave both charges and bend away from each other',
      'Lines leave one charge and cross over each other midway',
      '',
    ],
    answer: ['Lines leave both charges and bend away from each other', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'interpretation',
    unit: 'electricity_magnetism', topic: 'electrostatics', subtopic: 'electric_field_diagrams',
    skills: ['field_pattern_recognition'],
    difficulty: 2, exam_weight: 3, xp: 10, order: 2,
    syllabus: 'dbe', subject: 'physics', year: 2023, paper: 'nov_p1',
    clues:
      '- Field lines show the direction of the force on a positive test charge.\n- Field lines never cross, and like charges repel.',
  },
  {
    name: 'Question 3',
    question:
      'Point charges X and Y, each +2 × 10⁻⁹ C, are fixed on a straight line. Point M lies between them, r metres from X and 3r metres from Y. The net electric field at M is 40 N·C⁻¹. Complete the working to calculate r.',
    metadata: [
      'At M the fields of X and Y point in opposite directions, so Eₙₑₜ = E(X) − E(Y), with E = \\frac{kQ}{r²}',
      '40 = \\frac{(9 × 10⁹)(2 × 10⁻⁹)}{r²} − \\frac{(9 × 10⁹)(2 × 10⁻⁹)}{(3r)²}, so r (in m, to two decimal places):',
      '[ ]',
    ],
    answer: ['0.63'],
    presentation: 'steps',
    keyboard_type: 'scientific_math',
    type: 'calc',
    unit: 'electricity_magnetism', topic: 'electrostatics', subtopic: 'electric_field_strength',
    skills: ['electric_field_calculation', 'inverse_square_relationship'],
    difficulty: 4, exam_weight: 3, xp: 10, order: 3,
    syllabus: 'dbe', subject: 'physics', year: 2023, paper: 'nov_p1',
    clues:
      '- Both terms have the same numerator, kQ = 18, so factor it out.\n- (3r)² = 9r², so combine the two fractions over a common denominator before solving for r².',
  },
  {
    name: 'Question 4',
    question:
      'The net electric field at a point is 45 N·C⁻¹. Calculate the magnitude of the electrostatic force on a proton placed at that point.',
    metadata: ['F = ', '[ ]', ' × 10⁻¹⁸ N'],
    answer: ['7.2', '', '', '', ''],
    presentation: 'fitb',
    keyboard_type: 'standard_math',
    type: 'calc',
    unit: 'electricity_magnetism', topic: 'electrostatics', subtopic: 'electric_field_strength',
    skills: ['electric_field_calculation'],
    difficulty: 2, exam_weight: 3, xp: 10, order: 4,
    syllabus: 'dbe', subject: 'physics', year: 2023, paper: 'nov_p1',
    clues:
      '- Use F = Eq.\n- A proton’s charge has the same magnitude as an electron’s (see the data sheet).',
  },
];

// ─── AI explanation (AMPM-CONTENT-AI-EXP) — one entry per exam sub-question ───

const aiExplanation = {
  sub_questions: [
    {
      number: '7.1',
      marks: 2,
      clues: '- Describe a region, not a single point.\n- What does a charge experience in that region?',
      approach: '- State that it is a region (space) …\n- … in which an electric charge experiences a force.',
      solution: '1. An electric field is a region (space) in which an electric charge experiences a force.\n2. Defining the electric field AT A POINT (force per unit charge) scores 0/2 here — the question asks to describe a field.',
    },
    {
      number: '7.2',
      marks: 3,
      clues: '- Both charges are positive, so the field lines point away from each.\n- Like charges: the lines between them bend away from each other.',
      approach: '- Draw field lines starting on each charge and pointing outwards (away from positive charges).\n- Between the charges, curve the lines away from each other, leaving a region with no lines (the neutral point) midway.\n- Make sure the lines touch the charges, do not go inside them and never cross.',
      solution: '1. Direction: arrows point away from both positive charges (1 mark).\n2. Shape: lines curve away from each other between the charges and spread outward on the outside (1 mark).\n3. Lines touch each charge but do not enter it, and no lines cross (1 mark).\n4. Drawing the pattern for two opposite charges scores 0/3; drawing only one charge earns at most 1/3.',
    },
    {
      number: '7.3',
      marks: 5,
      clues: '- At P, the fields of A and B point in opposite directions.\n- Write each field in terms of r, then set their difference equal to 27 N·C⁻¹.',
      approach: '- Use E = kQ/r² for each charge: E(A) at distance r, E(B) at distance 2r.\n- Since P is between them, Eₙₑₜ = E(A) − E(B) = 27 N·C⁻¹.\n- Substitute k = 9 × 10⁹ and Q = 3 × 10⁻⁹ C, then solve for r.',
      solution: '1. E = kQ/r².\n2. E(A) = (9 × 10⁹)(3 × 10⁻⁹)/r² = 27/r²; E(B) = (9 × 10⁹)(3 × 10⁻⁹)/(2r)² = 27/(4r²).\n3. The fields oppose each other at P: Eₙₑₜ = E(A) − E(B).\n4. 27 = 27/r² − 27/(4r²) = (3/4)(27/r²), so r² = 0.75.\n5. r = 0.87 m.',
    },
    {
      number: '7.4',
      marks: 3,
      clues: '- You already know the net field at P.\n- Use the formula that links field, force and charge.',
      approach: '- Use F = Eq with E = 27 N·C⁻¹.\n- Use the magnitude of the electron’s charge, 1.6 × 10⁻¹⁹ C.\n- Give a positive magnitude.',
      solution: '1. F = Eq.\n2. F = (27)(1.6 × 10⁻¹⁹).\n3. F = 4.32 × 10⁻¹⁸ N.\n4. Using Coulomb’s law with r = 0.87 m and 1.74 m gives 4.28 × 10⁻¹⁸ N, which is also accepted.',
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
