#!/usr/bin/env node
/**
 * DBE Physical Sciences: Chemistry P2 — November 2024 — Question 3 (order 7)
 * Organic Molecules — vapour pressure, chain isomers and branching, hydrogen bonding
 * vs dipole-dipole forces. 11 marks, one compound table (A–E).
 *
 *   node tools/validate-questions.js --script scripts/add-physics-2024-nov-p2-q3.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-physics-2024-nov-p2-q3.js --dry-run
 *   node scripts/add-physics-2024-nov-p2-q3.js
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
  name: 'Question 3',
  syllabus: 'dbe',
  subject: 'physics',
  year: 2024,
  paper: 'nov_p2',
  order: 7,
  content_tier: 'free',
  has_video: false,
  xp: 45,
  tags: ['organic_molecules', 'intermolecular_forces'],
  question_image_urls: [`${PAPER}/q7/question_1.png`],
  memo_image_urls: [`${PAPER}/q7/memo_1.png`, `${PAPER}/q7/memo_2.png`, `${PAPER}/q7/memo_3.png`],
  exam_question_marks: 11,
  supplementary_materials: [FORMULA_SHEET],
};

const questions = [
  {
    name: 'Question 1',
    question: 'Which ONE of the following is the correct definition of vapour pressure?',
    metadata: [
      'The pressure a gas exerts on the walls of an open container at room temperature',
      'The pressure at which a liquid starts to boil when heated in an open container',
      'The pressure exerted by a vapour at equilibrium with its liquid in a closed system',
      'The pressure a liquid exerts on the base of a closed container at equilibrium',
      '',
    ],
    answer: ['The pressure exerted by a vapour at equilibrium with its liquid in a closed system', '', '', '', ''],
    presentation: 'multiple_choice', type: 'definition',
    unit: 'matter_materials', topic: 'organic_molecules', subtopic: 'physical_properties_organic',
    skills: ['vapour_pressure_boiling_point_relationship'],
    difficulty: 1, exam_weight: 2, xp: 10, order: 1,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p2',
    clues: '- Vapour pressure is measured once evaporation and condensation are happening at the same rate.\n- That balance can only be reached if the vapour cannot escape.',
  },
  {
    name: 'Question 2',
    question: 'The three compounds below are chain isomers of C₆H₁₄. Arrange them in order of INCREASING vapour pressure at 20 °C (lowest first).',
    metadata: ['2,2-dimethylbutane', 'Hexane', '2-methylpentane'],
    answer: ['Hexane', '2-methylpentane', '2,2-dimethylbutane'],
    presentation: 'ordering', type: 'application',
    unit: 'matter_materials', topic: 'organic_molecules', subtopic: 'physical_properties_organic',
    skills: ['vapour_pressure_boiling_point_relationship', 'chain_isomerism'],
    difficulty: 3, exam_weight: 2, xp: 10, order: 2,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p2',
    clues: '- All three have the same molar mass, so the only difference is the SHAPE of the molecule.\n- The more compact the molecule, the smaller the surface over which London forces act, and the more easily it evaporates.',
  },
  {
    name: 'Question 3',
    question: '2,2-dimethylbutane has a HIGHER vapour pressure than hexane at the same temperature. Select ALL the statements that form part of the correct explanation.',
    metadata: [
      '2,2-dimethylbutane is more branched, with a smaller surface area',
      '2,2-dimethylbutane has a lower molar mass than hexane',
      'The London forces between 2,2-dimethylbutane molecules are weaker',
      '2,2-dimethylbutane molecules form hydrogen bonds with each other',
      'Less energy is needed to overcome its intermolecular forces',
    ],
    answer: ['2,2-dimethylbutane is more branched, with a smaller surface area', 'The London forces between 2,2-dimethylbutane molecules are weaker', 'Less energy is needed to overcome its intermolecular forces', '', ''],
    presentation: 'multi_select', type: 'application',
    unit: 'matter_materials', topic: 'organic_molecules', subtopic: 'physical_properties_organic',
    skills: ['intermolecular_force_comparison', 'vapour_pressure_boiling_point_relationship'],
    difficulty: 3, exam_weight: 3, xp: 15, order: 3,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p2',
    clues: '- A full explanation has three links: structure, then strength of intermolecular forces, then energy needed.\n- Check every option against the facts: both compounds are C₆H₁₄ alkanes.',
  },
  {
    name: 'Question 4',
    question: 'Butan-1-ol (74 g·mol⁻¹) and butanone (72 g·mol⁻¹) are compared at 20 °C. Which ONE of the following correctly identifies the compound with the HIGHER vapour pressure, with the correct reason?',
    metadata: [
      'Butan-1-ol, because hydrogen bonds are weaker than dipole-dipole forces',
      'Butanone, because its molecules form hydrogen bonds that break more easily',
      'Butan-1-ol, because its slightly larger molar mass gives weaker London forces',
      'Butanone, because it has only dipole-dipole forces, weaker than hydrogen bonds',
      '',
    ],
    answer: ['Butanone, because it has only dipole-dipole forces, weaker than hydrogen bonds', '', '', '', ''],
    presentation: 'multiple_choice', type: 'application',
    unit: 'matter_materials', topic: 'organic_molecules', subtopic: 'physical_properties_organic',
    skills: ['intermolecular_force_comparison', 'vapour_pressure_boiling_point_relationship'],
    difficulty: 3, exam_weight: 3, xp: 15, order: 4,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p2',
    clues: '- With nearly equal molar masses, compare the STRONGEST intermolecular force in each compound.\n- Weaker intermolecular forces let more molecules escape into the vapour.',
  },
];

const aiExplanation = {
  sub_questions: [
    {
      number: '3.1',
      marks: 2,
      clues: '- The definition needs the vapour, the liquid, equilibrium, and a closed system.\n- It describes the pressure of the gas phase, not the liquid.',
      approach: '- State what exerts the pressure.\n- State the conditions under which it is measured.',
      solution: '1. Vapour pressure is the pressure exerted by a vapour at equilibrium with its liquid in a closed system.',
    },
    {
      number: '3.2.1',
      marks: 1,
      clues: '- A, B and C are chain isomers with the same molar mass (72 g·mol⁻¹).\n- C (2,2-dimethylpropane) is the most branched of the three.',
      approach: '- Rank A, B and C by branching.\n- The most branched compound has the weakest intermolecular forces and the highest vapour pressure.',
      solution: '1. 2,2-dimethylpropane is the most branched, so it has the highest vapour pressure of the three.\n2. Answer: 146 kPa.',
    },
    {
      number: '3.2.2',
      marks: 3,
      clues: '- Compare the structure of C with A and B first.\n- Then link the structure to the strength of intermolecular forces, and that to the energy needed.',
      approach: '- Structure: C is more branched (more compact, smaller surface area).\n- Intermolecular forces: weaker London forces in C.\n- Energy: less energy needed to overcome them in C.',
      solution: '1. Structure: compound C is more branched than A and B, so it is more compact (spherical) with a smaller surface area over which intermolecular forces act.\n2. Intermolecular forces: C has weaker London (dispersion) forces than A and B.\n3. Energy: less energy is needed to overcome the intermolecular forces in C, so it evaporates most easily and has the highest vapour pressure.',
    },
    {
      number: '3.3.1',
      marks: 1,
      clues: '- The compound with the higher vapour pressure evaporates more easily.\n- That same compound also boils at a lower temperature.',
      approach: '- Compare the vapour pressures given in the table for D and E.\n- The higher vapour pressure means the lower boiling point.',
      solution: '1. E (butanal) has the higher vapour pressure (12,2 kPa vs 0,32 kPa), so it has the lower boiling point.\n2. Answer: E, butanal.',
    },
    {
      number: '3.3.2',
      marks: 4,
      clues: '- Name the strongest intermolecular force in D (a carboxylic acid) and in E (an aldehyde).\n- Compare their strengths, then the energy needed to overcome them.',
      approach: '- State the type of intermolecular force in each compound.\n- Compare the strength of the forces.\n- Compare the energy needed to overcome them, which explains the difference in vapour pressure.',
      solution: '1. Compound D (propanoic acid) has hydrogen bonding (as well as dipole-dipole and London forces) between its molecules.\n2. Compound E (butanal) has dipole-dipole forces (and London forces) between its molecules.\n3. The intermolecular forces in D are stronger than those in E.\n4. More energy is needed to overcome the intermolecular forces in D than in E, so D has the lower vapour pressure.',
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
