#!/usr/bin/env node
/**
 * DBE Physical Sciences: Chemistry P2 — November 2024 — Question 1, Part 3 (order 3)
 * MCQ items 1.5–1.6 — Chemical Equilibrium (stoichiometric concentration ratios at
 * equilibrium, Le Chatelier yield changes).
 *
 *   node tools/validate-questions.js --script scripts/add-physics-2024-nov-p2-q1-part3.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-physics-2024-nov-p2-q1-part3.js --dry-run
 *   node scripts/add-physics-2024-nov-p2-q1-part3.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

const PAPER = 'https://media-dev.askmoreprepmore.app/exam_papers/dbe/physics/2024/nov_p2';

const FORMULA_SHEET = {
  type: 'formula_sheet',
  label: 'Formula Sheet',
  image_urls: [`${PAPER}/q0/question_1.png`, `${PAPER}/q0/question_2.png`, `${PAPER}/q0/question_3.png`, `${PAPER}/q0/question_4.png`],
};

const video = {
  name: 'Question 1.5–1.6',
  syllabus: 'dbe',
  subject: 'physics',
  year: 2024,
  paper: 'nov_p2',
  order: 3,
  content_tier: 'free',
  has_video: false,
  xp: 35,
  tags: ['chemical_equilibrium', 'le_chatelier', 'equilibrium_constant'],
  question_image_urls: [`${PAPER}/q3/question_1.png`, `${PAPER}/q3/question_2.png`],
  memo_image_urls: [`${PAPER}/q3/memo_1.png`],
  exam_question_marks: 4,
  supplementary_materials: [FORMULA_SHEET],
};

const questions = [
  {
    name: 'Question 1',
    question: 'Initially, 1 mol N₂(g) and 3 mol H₂(g) are sealed in a container. Equilibrium is reached at constant temperature: N₂(g) + 3H₂(g) ⇌ 2NH₃(g). Which ONE of the following is ALWAYS TRUE at equilibrium?',
    metadata: ['[NH₃] = 2[N₂]', '[N₂] = [H₂]', '[H₂] = 3[N₂]', '[NH₃] = [H₂]', ''],
    answer: ['[H₂] = 3[N₂]', '', '', '', ''],
    presentation: 'multiple_choice', type: 'application',
    unit: 'chemical_change', topic: 'chemical_equilibrium', subtopic: 'equilibrium_constant_kc',
    skills: ['kc_calculation'],
    difficulty: 3, exam_weight: 2, xp: 10, order: 1,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p2',
    clues: '- Compare the starting mole ratio of the two reactants with the ratio in which they are used up.\n- How much product forms depends on Kc, which is not given, so any statement about NH₃ cannot be guaranteed.',
  },
  {
    name: 'Question 2',
    question: 'Consider the reaction at equilibrium in a closed container: N₂O₄(g) ⇌ 2NO₂(g), ΔH = +58 kJ·mol⁻¹. Select ALL the changes that will increase the YIELD of NO₂(g).',
    metadata: [
      'Increasing the temperature',
      'Adding a catalyst',
      'Increasing the volume of the container at constant temperature',
      'Decreasing the temperature',
      'Decreasing the volume of the container at constant temperature',
    ],
    answer: ['Increasing the temperature', 'Increasing the volume of the container at constant temperature', '', '', ''],
    presentation: 'multi_select', type: 'application',
    unit: 'chemical_change', topic: 'chemical_equilibrium', subtopic: 'le_chateliers_principle',
    skills: ['le_chatelier_shift_prediction'],
    difficulty: 3, exam_weight: 2, xp: 10, order: 2,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p2',
    clues: '- A positive ΔH means the forward reaction is endothermic: which temperature change favours it?\n- Count gas moles on each side: lowering the pressure favours the side with MORE moles of gas.',
  },
  {
    name: 'Question 3',
    question: 'Consider the equilibrium 2SO₂(g) + O₂(g) ⇌ 2SO₃(g), ΔH < 0, in a closed container. Which ONE of the following changes will change the VALUE of Kc?',
    metadata: [
      'Adding more O₂(g) at constant temperature',
      'Adding a catalyst at constant temperature',
      'Halving the container volume at constant temperature',
      'Raising the temperature at constant volume',
      '',
    ],
    answer: ['Raising the temperature at constant volume', '', '', '', ''],
    presentation: 'multiple_choice', type: 'application',
    unit: 'chemical_change', topic: 'chemical_equilibrium', subtopic: 'equilibrium_constant_kc',
    skills: ['kc_temperature_trend_analysis'],
    difficulty: 2, exam_weight: 2, xp: 10, order: 3,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p2',
    clues: '- Changing a concentration or the pressure shifts the equilibrium position, but the system settles back to the same ratio in the Kc expression.\n- Kc is a constant for one particular condition only.',
  },
];

const aiExplanation = {
  sub_questions: [
    {
      number: '1.5',
      marks: 2,
      clues: '- H₂ and I₂ start with equal moles and react in a 1 : 1 ratio.\n- The amount of HI formed depends on Kc, which is not given.',
      approach: '- Work out how much H₂ and I₂ are used up compared with each other.\n- Decide which relationship holds no matter how far the reaction goes.',
      solution: '1. H₂ and I₂ start with equal amounts and are used up in a 1 : 1 mole ratio.\n2. So at equilibrium the amounts left are still equal: [H₂] = [I₂], always.\n3. The amount of HI depends on how far the reaction goes (on Kc), so B, C and D are not always true.\n4. Answer: A.',
    },
    {
      number: '1.6',
      marks: 2,
      clues: '- The forward reaction is exothermic and reduces the number of gas moles (3 → 2).\n- A catalyst speeds up both directions equally.',
      approach: "- Apply Le Chatelier's principle to each change.\n- Keep only the change that favours the forward reaction.",
      solution: '1. Adding O₂(g) increases a reactant concentration, so the forward reaction is favoured and the yield of SO₃ increases ✓.\n2. A catalyst does not shift the equilibrium position; increasing the temperature favours the endothermic reverse reaction; increasing the volume lowers the pressure and favours the side with more gas moles (the reverse).\n3. Answer: A.',
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
