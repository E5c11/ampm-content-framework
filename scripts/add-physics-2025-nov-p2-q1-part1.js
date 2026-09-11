#!/usr/bin/env node
/**
 * DBE Physical Sciences: Chemistry P2 — November 2025 — Question 1, Part 1 (order 1)
 * MCQ items 1.1–1.3 — Organic Molecules (functional groups, catalysed addition
 * reactions, structural isomer classification).
 *
 * First lesson of subjects/dbe-chemistry.md's Paper structure mapping: Q1's ten MCQs
 * cluster into 5 knowledge-area lessons (Organic Molecules / Rate & Extent of Reaction /
 * Chemical Equilibrium / Acids & Bases / Electrochemistry), mirroring Physics's own Q1
 * clustering. This is Part 1 of 5.
 *
 *   node tools/validate-questions.js --script scripts/add-physics-2025-nov-p2-q1-part1.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-physics-2025-nov-p2-q1-part1.js --dry-run
 *   node scripts/add-physics-2025-nov-p2-q1-part1.js
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
  name: 'Question 1.1–1.3',
  syllabus: 'dbe',
  subject: 'physics',
  year: 2025,
  paper: 'nov_p2',
  order: 1,
  content_tier: 'free',
  has_video: false,
  xp: 30,
  tags: ['organic_molecules', 'functional_groups', 'isomers'],
  question_image_urls: [`${PAPER}/q1/question_1.png`],
  memo_image_urls: [`${PAPER}/q1/memo_1.png`],
  exam_question_marks: 6,
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
      'A primary alcohol is oxidised using an oxidising agent such as acidified potassium dichromate, initially forming a new compound that is not yet a carboxylic acid. Which functional group characterises this intermediate compound?',
    metadata: ['Hydroxyl', 'Carboxyl', 'Formyl', 'Halide', ''],
    answer: ['Formyl', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'matter_materials',
    topic: 'organic_molecules',
    subtopic: 'alcohol_oxidation_ladder',
    skills: ['functional_group_identification', 'alcohol_oxidation'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p2',
    clues:
      "- A primary alcohol's first oxidation product belongs to the aldehyde homologous series.\n- Aldehydes are named with the suffix '-al', and their functional group has its own specific name distinct from the general C=O carbonyl group.",
  },
  {
    name: 'Question 2',
    question:
      'A primary alcohol is oxidised using an oxidising agent such as acidified potassium dichromate. Select ALL of the functional groups below that could be present in a product of this oxidation, depending on how far the oxidation is allowed to proceed.',
    metadata: ['Formyl', 'Carboxyl', 'Hydroxyl', 'Halide', ''],
    answer: ['Formyl', 'Carboxyl', '', '', ''],
    presentation: 'multi_select',
    type: 'application',
    unit: 'matter_materials',
    topic: 'organic_molecules',
    subtopic: 'alcohol_oxidation_ladder',
    skills: ['functional_group_identification', 'alcohol_oxidation'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p2',
    clues:
      '- Oxidation of a primary alcohol proceeds in stages: an intermediate product forms first, and a further-oxidised product forms if oxidation continues.\n- Both of these products are members of different homologous series from the alcohol itself, and from each other.',
  },
  {
    name: 'Question 3',
    question:
      'But-2-ene is converted to butane using hydrogen gas, H₂(g), in the presence of a suitable catalyst. Which of the following is a suitable catalyst for this addition reaction?',
    metadata: ['Lead', 'Nickel', 'Manganese dioxide', 'Sulphuric acid', ''],
    answer: ['Nickel', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'matter_materials',
    topic: 'organic_molecules',
    subtopic: 'catalysed_addition_reactions',
    skills: ['catalytic_hydrogenation', 'reaction_type_identification'],
    difficulty: 1,
    exam_weight: 2,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p2',
    clues:
      '- Converting an alkene to an alkane by adding H₂(g) across the C=C double bond is a hydrogenation reaction.\n- Hydrogenation reactions are catalysed by certain transition metals, not by acids or non-metal compounds.',
  },
  {
    name: 'Question 4',
    question:
      'Propene reacts with hydrogen gas, H₂(g), in the presence of a metal catalyst to form propane. Which ONE of the following reagents reacts with propene in an addition reaction WITHOUT requiring a metal catalyst?',
    metadata: ['Hydrogen gas, H₂(g)', 'Bromine, Br₂(ℓ)', 'Steam, H₂O(g)', 'Oxygen gas, O₂(g)', ''],
    answer: ['Bromine, Br₂(ℓ)', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'matter_materials',
    topic: 'organic_molecules',
    subtopic: 'catalysed_addition_reactions',
    skills: ['addition_reaction_catalysts', 'reaction_type_identification'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p2',
    clues:
      '- Addition of a halogen across a C=C double bond is a different reaction from hydrogenation.\n- Of the four reagents listed, only one reacts with an alkene by simple addition at room temperature with no catalyst needed.',
  },
  {
    name: 'Question 5',
    question: 'Each pair of compounds below are structural isomers of each other. Match each pair to the type of structural isomerism it shows.',
    metadata: [
      'A - Butan-1-ol & butan-2-ol',
      'B - Pentane & 2,2-dimethylpropane',
      'C - Ethanol & methoxymethane',
      '1 - Positional isomerism',
      '2 - Chain isomerism',
      '3 - Functional isomerism',
    ],
    answer: ['A-1', 'B-2', 'C-3'],
    presentation: 'match',
    type: 'application',
    unit: 'matter_materials',
    topic: 'organic_molecules',
    subtopic: 'structural_isomer_types',
    skills: ['isomer_classification', 'positional_isomerism', 'chain_isomerism'],
    difficulty: 3,
    exam_weight: 2,
    xp: 15,
    order: 5,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p2',
    clues:
      "- Pair A differs only in a functional group's position on an identical chain.\n- Pair B differs only in how the carbon skeleton is branched.\n- Pair C's two compounds belong to two different homologous series entirely (an alcohol and an ether) despite sharing a molecular formula.",
  },
];

const aiExplanation = {
  sub_questions: [
    {
      number: '1.1',
      marks: 2,
      clues:
        "- The '-ol' suffix in propan-1-ol signals a specific functional group.\n- This functional group is a single oxygen atom bonded to a hydrogen atom, attached to a carbon chain.",
      approach:
        "- Identify the suffix in the compound's name and what functional group it represents.\n- Compare against the four listed functional groups to find the match.",
      solution:
        "1. The suffix '-ol' in propan-1-ol denotes the alcohol homologous series.\n2. The functional group that defines alcohols is the hydroxyl group, –OH.\n3. Carboxyl (–COOH) and carbonyl (C=O) belong to acids/aldehydes/ketones, and formyl (–CHO) belongs to aldehydes — none match '-ol'.\n4. The correct answer is C: Hydroxyl.",
    },
    {
      number: '1.2',
      marks: 2,
      clues:
        '- Converting C₂H₄ to an alkane by adding H₂(g) across the C=C double bond is a hydrogenation reaction.\n- Hydrogenation reactions need a metal catalyst to proceed at a reasonable rate.',
      approach:
        '- Recognise the reaction as addition of hydrogen (hydrogenation) across the C=C double bond.\n- Recall which of the listed substances is a metal capable of catalysing hydrogenation.',
      solution:
        '1. C₂H₄ (an alkene) reacting to form an alkane is hydrogenation — addition of H₂(g) across the C=C double bond.\n2. Hydrogenation reactions are catalysed by a metal catalyst such as platinum (or nickel/palladium), which is not consumed in the reaction.\n3. Lead and iron are not typical hydrogenation catalysts, and hydrogen itself is the reactant, not a catalyst.\n4. The correct answer is B: Platinum.',
    },
    {
      number: '1.3',
      marks: 2,
      clues:
        '- The definition of structural isomers is based on one specific quantity staying the same.\n- Structural isomers can differ in homologous series, and always differ in structural formula (since their atoms are arranged differently).',
      approach:
        '- Recall the definition of structural isomers.\n- Test each of the three statements (i)–(iii) against that definition to see which always holds.',
      solution:
        "1. Structural isomers are defined as compounds with the same molecular formula but a different structural formula (different arrangement of atoms).\n2. Statement (iii) — same molecular formula — is therefore always true by definition.\n3. Statement (ii) — same structural formula — is the opposite of what defines them, so it's never true.\n4. Statement (i) — same homologous series — is not guaranteed: functional isomers (e.g. an alcohol and an ether) are structural isomers of each other but belong to different homologous series.\n5. The correct answer is A: (iii) only.",
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
