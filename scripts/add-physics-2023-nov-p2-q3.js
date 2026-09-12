#!/usr/bin/env node
/**
 * DBE Physical Sciences: Chemistry P2 — November 2023 — Question 3 (order 7)
 * Organic Molecules — boiling point vs molecular mass, intermolecular force
 * strength across homologous series (alkanes, aldehydes, alcohols, carboxylic
 * acids). 15 marks, one continuous scenario (a boiling-point-vs-mass graph
 * comparing three series, P/R/S).
 *
 *   node tools/validate-questions.js --script scripts/add-physics-2023-nov-p2-q3.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-physics-2023-nov-p2-q3.js --dry-run
 *   node scripts/add-physics-2023-nov-p2-q3.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

const PAPER = 'https://media-dev.askmoreprepmore.app/exam_papers/dbe/physics/2023/nov_p2';

const video = {
  name: 'Question 3',
  syllabus: 'dbe',
  subject: 'physics',
  year: 2023,
  paper: 'nov_p2',
  order: 7,
  content_tier: 'free',
  has_video: false,
  xp: 45,
  tags: ['organic_molecules', 'intermolecular_forces', 'homologous_series'],
  question_image_urls: [`${PAPER}/q7/question_1.png`, `${PAPER}/q7/question_2.png`],
  memo_image_urls: [`${PAPER}/q7/memo_1.png`, `${PAPER}/q7/memo_2.png`, `${PAPER}/q7/memo_3.png`, `${PAPER}/q7/memo_4.png`],
  exam_question_marks: 15,
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
    question: 'Arrange the following four straight-chain, 3-carbon compounds in order of INCREASING boiling point (lowest first).',
    metadata: ['Propan-1-ol (CH₃CH₂CH₂OH)', 'Propanoic acid (CH₃CH₂COOH)', 'Propane (CH₃CH₂CH₃)', 'Propanal (CH₃CH₂CHO)'],
    answer: ['Propane (CH₃CH₂CH₃)', 'Propanal (CH₃CH₂CHO)', 'Propan-1-ol (CH₃CH₂CH₂OH)', 'Propanoic acid (CH₃CH₂COOH)'],
    presentation: 'ordering',
    type: 'application',
    unit: 'matter_materials',
    topic: 'organic_molecules',
    subtopic: 'physical_properties_organic',
    skills: ['intermolecular_force_comparison', 'vapour_pressure_boiling_point_relationship'],
    difficulty: 3,
    exam_weight: 2,
    xp: 15,
    order: 1,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2023,
    paper: 'nov_p2',
    clues:
      '- Propane has only London (dispersion) forces between molecules; propanal adds dipole-dipole forces on top of that.\n- Both propan-1-ol and propanoic acid can hydrogen-bond, but a carboxylic acid has two sites (C=O and O-H) that let two molecules hydrogen-bond to each other twice over, forming a strongly bonded pair.',
  },
  {
    name: 'Question 2',
    question: 'Match each homologous series below to the STRONGEST type of intermolecular force present between its own molecules.',
    metadata: ['A - Alkanes', 'B - Ketones', 'C - Alcohols', '1 - London (dispersion) forces only', '2 - Dipole-dipole forces', '3 - Hydrogen bonding'],
    answer: ['A-1', 'B-2', 'C-3'],
    presentation: 'match',
    type: 'definition',
    unit: 'matter_materials',
    topic: 'organic_molecules',
    subtopic: 'physical_properties_organic',
    skills: ['intermolecular_force_comparison'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2023,
    paper: 'nov_p2',
    clues:
      '- Alkane molecules are non-polar, so London forces are the only force present.\n- A ketone has a polar C=O group but no O-H bond, so it cannot hydrogen-bond with another ketone molecule.',
  },
  {
    name: 'Question 3',
    question:
      'Compound X is a straight-chain carboxylic acid and compound Y is a straight-chain ketone. X and Y have the same molecular mass. Which ONE of the following correctly predicts and explains which compound has the HIGHER boiling point?',
    metadata: [
      'Y, because a ketone has a larger dipole moment than a carboxylic acid',
      'X, because a carboxylic acid can hydrogen-bond while a ketone can only form dipole-dipole forces',
      'They will have equal boiling points, since both contain a C=O group',
      'Y, because ketones always have longer carbon chains than acids of the same mass',
      '',
    ],
    answer: ['X, because a carboxylic acid can hydrogen-bond while a ketone can only form dipole-dipole forces', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'matter_materials',
    topic: 'organic_molecules',
    subtopic: 'physical_properties_organic',
    skills: ['intermolecular_force_comparison', 'vapour_pressure_boiling_point_relationship'],
    difficulty: 3,
    exam_weight: 2,
    xp: 15,
    order: 3,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2023,
    paper: 'nov_p2',
    clues:
      "- A ketone's C=O carbon is bonded to two other carbons, so it has no O-H bond of its own to offer for hydrogen bonding.\n- Comparing boiling points at equal molecular mass isolates the effect of the functional group's intermolecular forces from the effect of chain length.",
  },
  {
    name: 'Question 4',
    question: 'Within a single homologous series, boiling point rises as molecular mass increases. Select ALL of the statements below that correctly help explain this trend.',
    metadata: [
      'A longer carbon chain has a greater surface area over which London forces can act',
      'A longer carbon chain has more electrons, making the molecule more easily polarisable',
      'A longer carbon chain always changes the functional group present',
      'A longer carbon chain forms stronger covalent bonds within the molecule',
      '',
    ],
    answer: [
      'A longer carbon chain has a greater surface area over which London forces can act',
      'A longer carbon chain has more electrons, making the molecule more easily polarisable',
      '',
      '',
      '',
    ],
    presentation: 'multi_select',
    type: 'application',
    unit: 'matter_materials',
    topic: 'organic_molecules',
    subtopic: 'physical_properties_organic',
    skills: ['intermolecular_force_comparison', 'vapour_pressure_boiling_point_relationship'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2023,
    paper: 'nov_p2',
    clues:
      '- Members of the same homologous series all share the same functional group, by definition — only the chain length changes.\n- Boiling point is about the strength of forces BETWEEN molecules, not the strength of bonds WITHIN a molecule.',
  },
];

const aiExplanation = {
  sub_questions: [
    {
      number: '3.1',
      marks: 2,
      clues: '- Boiling point is linked to vapour pressure, not directly to temperature or pressure alone.\n- Think about what condition must hold for a liquid to start boiling.',
      approach: '- Recall how vapour pressure changes with temperature.\n- State the specific condition that defines boiling point in terms of vapour pressure.',
      solution: '1. As a liquid is heated, its vapour pressure rises.\n2. Boiling point is the temperature at which the vapour pressure of a substance equals atmospheric pressure.',
    },
    {
      number: '3.2',
      marks: 2,
      clues: "- Curve P sits above both other curves at every molecular mass shown on the graph.\n- The compound class with the strongest intermolecular forces needs the most energy to boil, at any given mass.",
      approach: "- Compare the three curves' boiling points at the same molecular mass.\n- Identify which class of compound (aldehyde, alcohol, carboxylic acid) has the strongest intermolecular forces.",
      solution: '1. At every molecular mass on the graph, curve P has the highest boiling point of the three curves.\n2. Carboxylic acids have the strongest intermolecular forces of the three classes shown (double hydrogen bonding via the -COOH group).\n3. Curve P represents the carboxylic acids.',
    },
    {
      number: '3.3',
      marks: 2,
      clues: '- More energy is needed to separate molecules held together by stronger intermolecular forces.\n- Boiling point and intermolecular force strength move together, at a given molecular mass.',
      approach: "- Link curve P's higher boiling point to the strength of the intermolecular forces between carboxylic acid molecules.\n- State this relationship explicitly.",
      solution: '1. Carboxylic acids have the strongest intermolecular forces of the three classes (two hydrogen-bonding sites per molecule).\n2. Stronger intermolecular forces require more energy to overcome.\n3. This is why curve P (carboxylic acids) has the highest boiling point at every molecular mass.',
    },
    {
      number: '3.4.1',
      marks: 1,
      clues: '- Curve R (given) represents the alcohols, and curve P represents the carboxylic acids.\n- Only one homologous series remains for curve S: the one with the weakest intermolecular forces of the three, and so the lowest boiling points.',
      approach: '- Eliminate the two series already identified (alcohols for R, carboxylic acids for P).\n- Confirm the remaining series matches curve S\'s position (lowest boiling points).',
      solution: '1. Curve R represents alcohols and curve P represents carboxylic acids (the strongest of the three).\n2. The only series left is aldehydes, which have weaker intermolecular forces than alcohols (no O-H group to hydrogen-bond with each other).\n3. Curve S represents the aldehydes.',
    },
    {
      number: '3.4.2',
      marks: 2,
      clues: '- Aldehyde molecules have no O-H or N-H bond, so they cannot hydrogen-bond with each other.\n- Compare the type of intermolecular force available to aldehydes against that available to alcohols.',
      approach: '- Identify the strongest intermolecular force present in aldehydes.\n- Compare it with the strongest force present in alcohols, and link the difference to the boiling point difference.',
      solution: "1. Aldehyde molecules can only form dipole-dipole forces (and London forces) with each other, since they have no O-H bond.\n2. Alcohol molecules can hydrogen-bond, which is stronger than dipole-dipole forces alone.\n3. Because aldehydes have weaker intermolecular forces than alcohols, less energy is needed to separate them, giving aldehydes the lower boiling point — hence curve S sits below curve R.",
    },
    {
      number: '3.5.1',
      marks: 1,
      clues: '- Curve R represents the alcohols.\n- Read directly off the graph: find 97 °C on the boiling point axis, move across to curve R, then down to the molecular mass axis.',
      approach: '- Locate 97 °C on the y-axis of curve R.\n- Read off the corresponding molecular mass on the x-axis.',
      solution: '1. Reading across from 97 °C to curve R, then down to the x-axis, gives a molecular mass of 60 g·mol⁻¹.',
    },
    {
      number: '3.5.2',
      marks: 2,
      clues: '- The compound is an alcohol (curve R) with a molecular mass of 60 g·mol⁻¹.\n- Use the alcohol general formula, CₙH₂ₙ₊₁OH, to find the number of carbon atoms that gives this molar mass.',
      approach: '- Set up the molar mass equation for CₙH₂ₙ₊₁OH and solve for n.\n- Name the resulting straight-chain alcohol.',
      solution: '1. For a straight-chain alcohol CₙH₂ₙ₊₁OH, molar mass = 14n + 18.\n2. Setting 14n + 18 = 60 gives n = 3.\n3. A 3-carbon straight-chain alcohol is propan-1-ol.',
    },
    {
      number: '3.6',
      marks: 3,
      clues: '- Compounds A and B have the same molecular mass, so chain length differences cannot explain the boiling point difference — the difference must come from the functional group.\n- One of these two compounds can hydrogen-bond at two sites per molecule; the other can only hydrogen-bond at one.',
      approach: "- Identify which compound is the carboxylic acid and which is the alcohol.\n- Compare the number of hydrogen-bonding sites each functional group offers, and link this to the energy needed to separate the molecules.",
      solution:
        '1. B (boiling point 142 °C) is the carboxylic acid, propanoic acid; A (boiling point 118 °C) is the alcohol, butan-1-ol.\n2. A carboxylic acid molecule has two sites (the C=O and the O-H) available for hydrogen bonding with a neighbouring molecule, effectively forming strongly bonded pairs.\n3. An alcohol molecule has only one O-H site available for hydrogen bonding.\n4. More energy is needed to overcome the additional hydrogen bonding in the carboxylic acid, giving B the higher boiling point despite the equal molecular mass.',
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
