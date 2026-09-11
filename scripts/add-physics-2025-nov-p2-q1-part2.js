#!/usr/bin/env node
/**
 * DBE Physical Sciences: Chemistry P2 — November 2025 — Question 1, Part 2 (order 2)
 * MCQ item 1.4 — Rate & Extent of Reaction (factors affecting initial rate).
 *
 * Second lesson of subjects/dbe-chemistry.md's Paper structure mapping: Q1's ten MCQs
 * cluster into 5 knowledge-area lessons. This is Part 2 of 5 — a single-item cluster,
 * so it stays at ~2 practice questions per workflows/generate/upload-chemistry.md.
 *
 *   node tools/validate-questions.js --script scripts/add-physics-2025-nov-p2-q1-part2.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-physics-2025-nov-p2-q1-part2.js --dry-run
 *   node scripts/add-physics-2025-nov-p2-q1-part2.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

const PAPER = 'https://media-dev.askmoreprepmore.app/exam_papers/dbe/physics/2025/nov_p2';

const video = {
  name: 'Question 1.4',
  syllabus: 'dbe',
  subject: 'physics',
  year: 2025,
  paper: 'nov_p2',
  order: 2,
  content_tier: 'free',
  has_video: false,
  xp: 20,
  tags: ['reaction_rate', 'collision_theory'],
  question_image_urls: [`${PAPER}/q2/question_1.png`],
  memo_image_urls: [`${PAPER}/q2/memo_1.png`],
  exam_question_marks: 2,
  supplementary_materials: [
    {
      type: 'formula_sheet',
      label: 'Formula Sheet',
      image_urls: [`${PAPER}/q0/question_1.png`, `${PAPER}/q0/question_2.png`, `${PAPER}/q0/question_3.png`, `${PAPER}/q0/question_4.png`],
    },
  ],
};

const questions = [
  {
    name: 'Question 1',
    question:
      'Calcium carbonate chips of mass 5 g react with excess dilute hydrochloric acid of concentration 0,5 mol·dm⁻³ at 25 °C: CaCO₃(s) + 2HCℓ(aq) → CaCℓ₂(aq) + H₂O(ℓ) + CO₂(g). Which ONE of the following changes will NOT increase the initial rate of this reaction?',
    metadata: [
      'Crushing the calcium carbonate into a fine powder',
      'Increasing the temperature of the hydrochloric acid',
      'Doubling the volume of hydrochloric acid used, while keeping its concentration unchanged',
      'Using a more concentrated hydrochloric acid solution',
      '',
    ],
    answer: ['Doubling the volume of hydrochloric acid used, while keeping its concentration unchanged', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'chemical_change',
    topic: 'reaction_rate',
    subtopic: 'reaction_rate_factors',
    skills: ['rate_factor_identification'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p2',
    clues:
      "- Rate depends on the concentration of reactant particles in solution, not on the total volume or number of moles present.\n- The other three changes each increase either the surface area, temperature, or concentration of the reacting system.",
  },
  {
    name: 'Question 2',
    question:
      'According to collision theory, which ONE of the following correctly explains why increasing the temperature of a reaction mixture increases the rate of reaction?',
    metadata: [
      'More reactant particles are added to the mixture',
      'The volume of the container increases',
      'A greater proportion of particles collide with energy greater than or equal to the activation energy',
      'The activation energy of the reaction decreases',
      '',
    ],
    answer: ['A greater proportion of particles collide with energy greater than or equal to the activation energy', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'chemical_change',
    topic: 'reaction_rate',
    subtopic: 'collision_theory',
    skills: ['collision_theory_reasoning'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p2',
    clues:
      "- Temperature doesn't change how many particles are present or the size of the container.\n- Collision theory links rate to both how often particles collide and what fraction of those collisions carry enough energy to react.",
  },
];

const aiExplanation = {
  sub_questions: [
    {
      number: '1.4',
      marks: 2,
      clues:
        "- Rate depends on the concentration of H⁺ ions available to react, not on the total volume of acid present.\n- The other three options each increase either the frequency or the energy of collisions between Mg and HCℓ particles.",
      approach:
        '- For each option, decide whether it changes the concentration, surface area, or temperature of the reacting system.\n- Identify the one option that leaves all three of these unchanged.',
      solution:
        "1. Powdering the magnesium (A) increases the surface area exposed to the acid, increasing collision frequency and rate.\n2. Increasing the temperature (B) increases the kinetic energy and collision frequency of particles, increasing rate.\n3. Using a longer piece of ribbon (C) also increases the surface area of magnesium exposed to the acid, increasing rate.\n4. Doubling the volume of HCℓ while its concentration stays at 0,1 mol·dm⁻³ (D) does not change the concentration of H⁺ ions at the magnesium's surface, so the initial rate is unaffected.\n5. The correct answer is D.",
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
