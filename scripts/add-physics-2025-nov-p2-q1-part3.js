#!/usr/bin/env node
/**
 * DBE Physical Sciences: Chemistry P2 — November 2025 — Question 1, Part 3 (order 3)
 * MCQ items 1.5–1.6 — Chemical Equilibrium (Le Chatelier's principle, activation energy).
 *
 * Third lesson of subjects/dbe-chemistry.md's Paper structure mapping: Q1's ten MCQs
 * cluster into 5 knowledge-area lessons. This is Part 3 of 5.
 *
 *   node tools/validate-questions.js --script scripts/add-physics-2025-nov-p2-q1-part3.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-physics-2025-nov-p2-q1-part3.js --dry-run
 *   node scripts/add-physics-2025-nov-p2-q1-part3.js
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
  name: 'Question 1.5–1.6',
  syllabus: 'dbe',
  subject: 'physics',
  year: 2025,
  paper: 'nov_p2',
  order: 3,
  content_tier: 'free',
  has_video: false,
  xp: 30,
  tags: ['chemical_equilibrium', 'activation_energy'],
  question_image_urls: [`${PAPER}/q3/question_1.png`, `${PAPER}/q3/question_2.png`],
  memo_image_urls: [`${PAPER}/q3/memo_1.png`],
  exam_question_marks: 4,
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
      'The following reaction is at equilibrium in a sealed container: 2SO₂(g) + O₂(g) ⇌ 2SO₃(g), ΔH < 0. Which ONE of the following changes will shift the equilibrium position to the LEFT, decreasing the yield of SO₃(g)?',
    metadata: [
      'Increasing the pressure by decreasing the container volume',
      'Decreasing the temperature of the system',
      'Adding more O₂(g) to the container',
      'Increasing the temperature of the system',
      '',
    ],
    answer: ['Increasing the temperature of the system', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'chemical_change',
    topic: 'chemical_equilibrium',
    subtopic: 'le_chateliers_principle',
    skills: ['le_chatelier_shift_prediction'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p2',
    clues:
      '- This reaction releases heat (ΔH < 0), so increasing temperature favours the reaction that absorbs heat.\n- The forward reaction has fewer gas moles than the reverse (2 mol → 3 mol on the reverse side), so a pressure increase favours the forward direction, not the reverse.',
  },
  {
    name: 'Question 2',
    question:
      'A hypothetical exothermic reaction, X(g) ⇌ Y(g), has an activation energy for the forward reaction of 60 kJ·mol⁻¹ and an activation energy for the reverse reaction of 90 kJ·mol⁻¹. Which ONE of the following is CORRECT for this reaction?',
    metadata: [
      'The heat of reaction is +30 kJ·mol⁻¹',
      'The energy of the activated complex is lower than the energy of Y(g)',
      'The heat of reaction is −30 kJ·mol⁻¹',
      'The activation energy for the reverse reaction is unaffected by the presence of a catalyst',
      '',
    ],
    answer: ['The heat of reaction is −30 kJ·mol⁻¹', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'chemical_change',
    topic: 'chemical_equilibrium',
    subtopic: 'activation_energy_diagrams',
    skills: ['activation_energy_relationship'],
    difficulty: 3,
    exam_weight: 2,
    xp: 15,
    order: 2,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p2',
    clues:
      '- The heat of reaction equals the activation energy of the forward reaction minus that of the reverse reaction.\n- A catalyst lowers the activation energy of both the forward and reverse reactions by the same amount, and the activated complex is always the highest-energy point on the reaction pathway.',
  },
  {
    name: 'Question 3',
    question:
      'The following reaction is at equilibrium in a closed container: PCℓ₅(g) ⇌ PCℓ₃(g) + Cℓ₂(g), ΔH > 0. Select ALL of the following changes that will increase the yield of PCℓ₃(g) at equilibrium.',
    metadata: [
      'Increasing the temperature',
      'Adding a catalyst',
      'Decreasing the pressure by increasing the container volume',
      'Removing Cℓ₂(g) as it forms',
      '',
    ],
    answer: ['Increasing the temperature', 'Decreasing the pressure by increasing the container volume', 'Removing Cℓ₂(g) as it forms', '', ''],
    presentation: 'multi_select',
    type: 'application',
    unit: 'chemical_change',
    topic: 'chemical_equilibrium',
    subtopic: 'le_chateliers_principle',
    skills: ['le_chatelier_shift_prediction'],
    difficulty: 3,
    exam_weight: 2,
    xp: 15,
    order: 3,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p2',
    clues:
      "- This reaction absorbs heat (ΔH > 0), and the forward reaction produces more gas particles than it consumes (1 mol → 2 mol).\n- A catalyst speeds up how quickly equilibrium is reached but never changes the position of equilibrium itself.",
  },
];

const aiExplanation = {
  sub_questions: [
    {
      number: '1.5',
      marks: 2,
      clues:
        '- A change that shifts equilibrium favours one direction more than the other; a change that speeds up both directions equally does not shift the equilibrium position, only how fast it is reached.\n- This reaction is exothermic, so temperature changes favour one direction over the other, not both equally.',
      approach:
        '- Note that both the forward and reverse rates jump up together at t₁, with no gradual change.\n- Identify which listed change affects the concentration/rate of both directions equally and instantly.',
      solution:
        '1. The graph shows the reaction rate jump instantly at t₁ to a new, higher constant rate — both the forward and reverse rates increase together.\n2. Increasing the pressure at constant temperature increases the concentration of the reacting species, increasing both forward and reverse rates immediately, consistent with the graph.\n3. Increasing the container volume would decrease rate, not increase it; increasing temperature would favour only one direction of this exothermic reaction; adding H₂(g) would only raise the forward rate initially.\n4. The correct answer is A.',
    },
    {
      number: '1.6',
      marks: 2,
      clues:
        '- The heat of reaction relates the two activation energies: ΔH = Eₐ(forward) − Eₐ(reverse).\n- For an endothermic reaction, ΔH must be positive, and the activation energy of the forward reaction must always exceed that of the reverse reaction.',
      approach:
        '- Use ΔH = Eₐ(forward) − Eₐ(reverse) together with the given Eₐ(reverse) = 50 kJ·mol⁻¹ to test each option for consistency.\n- Reject any option that would make the reaction exothermic (Eₐ(forward) < Eₐ(reverse)) or that misplaces the activated complex\'s energy.',
      solution:
        '1. This reaction is endothermic, so ΔH > 0 and Eₐ(forward) > Eₐ(reverse) = 50 kJ·mol⁻¹.\n2. If ΔH = +70 kJ·mol⁻¹ (A), then Eₐ(forward) = ΔH + Eₐ(reverse) = 70 + 50 = 120 kJ·mol⁻¹, which is greater than 50 kJ·mol⁻¹ — consistent.\n3. Option B (Eₐ(forward) = 50 kJ·mol⁻¹) would give ΔH = 0, not endothermic; option D (Eₐ(forward) = 40 kJ·mol⁻¹) would give ΔH = −10 kJ·mol⁻¹, exothermic — both contradict the given information. Option C places the activated complex below the reverse activation energy, which is impossible since the activated complex is always the highest-energy point on the pathway.\n4. The correct answer is A.',
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
