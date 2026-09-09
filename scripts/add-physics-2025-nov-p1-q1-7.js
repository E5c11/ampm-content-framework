#!/usr/bin/env node
/**
 * DBE Physical Sciences: Physics P1 — November 2025 — Question 1.7 (order 7)
 * Coulomb's law: force balance between collinear point charges.
 *
 * One of 10 subsection lessons — see add-physics-2025-nov-p1-q1-1.js header note.
 *
 *   node tools/validate-questions.js --script scripts/add-physics-2025-nov-p1-q1-7.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-physics-2025-nov-p1-q1-7.js --dry-run
 *   node scripts/add-physics-2025-nov-p1-q1-7.js
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
  name: 'Question 1.7',
  syllabus: 'dbe',
  subject: 'physics',
  year: 2025,
  paper: 'nov_p1',
  order: 7,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['coulombs_law'],
  question_image_urls: [`${PAPER}/q1/question_3.png`],
  memo_image_urls: [`${PAPER}/q1/memo_1.png`],
  exam_question_marks: 2,
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
    clues:
      '- Set the force from B on A equal in magnitude to the force from C on A, since the net force on A is zero.\n- Use Coulomb’s law with the correct distance from each charge to A (A to C is the sum of the two given distances), then solve for the charge on C in terms of q.',
  },
  {
    name: 'Question 2',
    question:
      'Two point charges of +2 × 10⁻⁶ C and +3 × 10⁻⁶ C are placed 0.5 m apart. Calculate the magnitude of the electrostatic force between them.',
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
