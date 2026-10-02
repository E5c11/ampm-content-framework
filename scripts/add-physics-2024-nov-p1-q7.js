#!/usr/bin/env node
/**
 * DBE Physical Sciences: Physics P1 — November 2024 — Question 7 (order 10)
 * Electrostatics: electric field of a point charge, field pattern of unlike charges, Coulomb's law for three charges in a line.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-physics-2024-nov-p1-q7.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-physics-2024-nov-p1-q7.js --dry-run
 *   node scripts/add-physics-2024-nov-p1-q7.js
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
  name: 'Question 7',
  syllabus: 'dbe',
  subject: 'physics',
  year: 2024,
  paper: 'nov_p1',
  order: 10,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['electric_field', 'coulombs_law'],
  question_image_urls: [`${PAPER}/q7/question_1.png`],
  memo_image_urls: [`${PAPER}/q7/memo_1.png`, `${PAPER}/q7/memo_2.png`],
  exam_question_marks: 14,
  supplementary_materials: [FORMULA_SHEET],
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    name: 'Question 1',
    question:
      'M is a +3 nC point charge. Point Z is 5 cm from M. Calculate the magnitude of the electric field at Z due to M.',
    metadata: ['E = ', '[ ]', ' × 10⁴ N·C⁻¹'],
    answer: ['1.08', '', '', '', ''],
    presentation: 'fitb',
    type: 'calc',
    unit: 'electricity_magnetism', topic: 'electrostatics', subtopic: 'electric_field_strength',
    skills: ['electric_field_calculation', 'inverse_square_relationship'],
    difficulty: 2, exam_weight: 3, xp: 10, order: 1,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p1',
    clues:
      '- Use E = \\frac{kQ}{r²}.\n- Convert to SI units first: nC to C, and cm to m.',
  },
  {
    name: 'Question 2',
    question:
      'A +3 nC charge and a −3 nC charge are placed 4 cm apart. Select ALL the CORRECT statements about the resultant electric field pattern.',
    metadata: [
      'Field lines point into the positive charge',
      'Field lines start on the positive charge and end on the negative charge',
      'No two field lines cross each other',
      'There is a point midway between the charges where the field is zero',
      'Field lines are most concentrated in the region between the charges',
    ],
    answer: [
      'Field lines start on the positive charge and end on the negative charge',
      'No two field lines cross each other',
      'Field lines are most concentrated in the region between the charges',
      '',
      '',
    ],
    presentation: 'multi_select',
    type: 'interpretation',
    unit: 'electricity_magnetism', topic: 'electrostatics', subtopic: 'electric_field_diagrams',
    skills: ['field_pattern_recognition', 'electric_field_description'],
    difficulty: 3, exam_weight: 3, xp: 10, order: 2,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p1',
    clues:
      '- Field direction is the direction of the force on a small positive test charge.\n- A zero-field (neutral) point between two charges only occurs for LIKE charges.',
  },
  {
    name: 'Question 3',
    question:
      'Two point charges exert an electrostatic force F on each other. One charge is doubled, and the distance between them is halved. What is the new force?',
    metadata: ['4F', '8F', '2F', '16F', ''],
    answer: ['8F', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'electricity_magnetism', topic: 'electrostatics', subtopic: 'coulombs_law',
    skills: ['coulombs_law', 'inverse_square_relationship'],
    difficulty: 3, exam_weight: 3, xp: 10, order: 3,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p1',
    clues:
      '- Coulomb’s law: F is directly proportional to the product of the charges and inversely proportional to the SQUARE of the distance.\n- Apply each change as a separate factor, then multiply.',
  },
  {
    name: 'Question 4',
    question:
      'Charge M (+3 nC) and charge N (−3 nC) are 4 cm apart, with N to the right of M. A third charge W is placed 3 cm to the right of N. The net electrostatic force on W is to the RIGHT. What is the polarity of W, and why?',
    metadata: [
      'Positive, because the nearer charge N repels it to the right',
      'Negative, because the nearer charge N attracts it to the right',
      'Negative, because the nearer charge N repels it to the right',
      'Positive, because the farther charge M repels it to the right',
      '',
    ],
    answer: ['Negative, because the nearer charge N repels it to the right', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'electricity_magnetism', topic: 'electrostatics', subtopic: 'coulombs_law',
    skills: ['coulombs_law', 'inverse_square_relationship'],
    difficulty: 4, exam_weight: 3, xp: 10, order: 4,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p1',
    clues:
      '- M and N have equal magnitudes, but N is much closer to W, so N’s force dominates.\n- For N to push W to the right (away from N), what must W’s sign be?',
  },
  {
    name: 'Question 5',
    question:
      'Using the same arrangement (M = +3 nC, N = −3 nC 4 cm to its right, W 3 cm to the right of N), the net force on W is 2.0 × 10⁻⁴ N to the right. Complete the working to calculate the magnitude of the charge on W.',
    metadata: [
      'W is 3 cm from N and 7 cm from M. Fₙₑₜ = F(NW) − F(MW), with F = \\frac{kQ₁Q₂}{r²}',
      '2.0 × 10⁻⁴ = \\frac{(9 × 10⁹)(3 × 10⁻⁹)q}{(0.03)²} − \\frac{(9 × 10⁹)(3 × 10⁻⁹)q}{(0.07)²}',
      '2.0 × 10⁻⁴ = (30 000 − 5 510.20)q = 24 489.80q, so q (in × 10⁻⁹ C, to two decimal places):',
      '[ ]',
    ],
    answer: ['8.17'],
    presentation: 'steps',
    type: 'calc',
    unit: 'electricity_magnetism', topic: 'electrostatics', subtopic: 'coulombs_law',
    skills: ['coulombs_law', 'inverse_square_relationship'],
    difficulty: 5, exam_weight: 3, xp: 10, order: 5,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p1',
    clues:
      '- Divide 2.0 × 10⁻⁴ by 24 489.80.\n- Write the result as a number × 10⁻⁹ and enter only the number.',
  },
];

// ─── AI explanation (AMPM-CONTENT-AI-EXP) — one entry per exam sub-question ───

const aiExplanation = {
  sub_questions: [
    {
      number: '7.1',
      marks: 3,
      clues: '- E = kQ/r², with Q in coulombs and r in metres.\n- 2 nC = 2 × 10⁻⁹ C and 6 cm = 0.06 m.',
      approach: '- Write E = kQ/r².\n- Substitute k = 9 × 10⁹ N·m²·C⁻², Q = 2 × 10⁻⁹ C, r = 0.06 m.\n- Calculate.',
      solution: '1. E = kQ/r².\n2. E = (9 × 10⁹)(2 × 10⁻⁹)/(0.06)².\n3. E = 18/0.0036 = 5 × 10³ N·C⁻¹ (5 000 N·C⁻¹).',
    },
    {
      number: '7.2',
      marks: 3,
      clues: '- P is positive and S is negative, so the lines go from P to S.\n- This is the pattern for two UNLIKE charges.',
      approach: '- Draw field lines starting on P (positive) and ending on S (negative).\n- Show curved lines between the charges and lines on the outside too.\n- Make sure no lines cross and every line touches a charge without entering it.',
      solution: '1. Direction: arrows point away from P (+2 nC) and towards S (−2 nC).\n2. Shape: lines curve from P to S between the charges, and lines on the outside also bend from P round to S.\n3. No field lines cross. Lines touch the charges but do not go inside them.\n4. Drawing the pattern for two like charges, or only one charge, scores 0/3.',
    },
    {
      number: '7.3.1',
      marks: 2,
      clues: '- The law relates the force between two POINT charges to their charges and their separation.\n- Two proportionalities are needed.',
      approach: '- Say what the law describes: the magnitude of the electrostatic force between two point charges.\n- Direct proportionality: to the product of the charges.\n- Inverse proportionality: to the square of the distance between them.',
      solution: '1. The magnitude of the electrostatic force exerted by one point charge on another point charge is directly proportional to the product of the magnitudes of the charges and inversely proportional to the square of the distance between them.\n2. Referring to masses, or leaving out the word "force", scores 0/2.',
    },
    {
      number: '7.3.2',
      marks: 1,
      clues: '- S (−2 nC) is only 2 cm from T, while P (+2 nC) is 6 cm away, so S’s force on T is stronger.\n- The net force on T is to the left, towards S.',
      approach: '- Find which charge dominates (the closer one, S).\n- The net force pulls T towards S, so S attracts T.\n- A negative charge attracts a positive charge.',
      solution: '1. S is much closer, so the force from S dominates.\n2. The net force on T is to the left, towards S, so S attracts T.\n3. S is negative, so T must be POSITIVE.',
    },
    {
      number: '7.3.3',
      marks: 5,
      clues: '- T is 2 cm from S and 6 cm from P.\n- The two forces on T point in opposite directions, so subtract them.',
      approach: '- Write F(ST) = k(2 × 10⁻⁹)Q(T)/(0.02)² (to the left) and F(PT) = k(2 × 10⁻⁹)Q(T)/(0.06)² (to the right).\n- Fₙₑₜ = F(ST) − F(PT) = 2.5 × 10⁻⁴ N.\n- Solve for Q(T).',
      solution: '1. F = kQ₁Q₂/r².\n2. F(ST) = (9 × 10⁹)(2 × 10⁻⁹)Q(T)/(0.02)² = 45 000Q(T).\n3. F(PT) = (9 × 10⁹)(2 × 10⁻⁹)Q(T)/(0.06)² = 5 000Q(T).\n4. Fₙₑₜ = F(ST) − F(PT): 2.5 × 10⁻⁴ = 45 000Q(T) − 5 000Q(T) = 40 000Q(T).\n5. Q(T) = 6.25 × 10⁻⁹ C.\n6. Alternative: Eₙₑₜ at T = 45 000 − 5 000 = 4 × 10⁴ N·C⁻¹, then F = Eq gives q = 2.5 × 10⁻⁴ / 4 × 10⁴ = 6.25 × 10⁻⁹ C.',
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
