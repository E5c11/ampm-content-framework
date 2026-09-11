#!/usr/bin/env node
/**
 * DBE Physical Sciences: Chemistry P2 — November 2025 — Question 2 (order 6)
 * Organic Molecules — IUPAC naming, isomerism, functional groups, combustion. 22 marks,
 * one continuous scenario (a table of lettered compounds A-G, all sub-parts reference it).
 *
 *   node tools/validate-questions.js --script scripts/add-physics-2025-nov-p2-q2.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-physics-2025-nov-p2-q2.js --dry-run
 *   node scripts/add-physics-2025-nov-p2-q2.js
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
  name: 'Question 2',
  syllabus: 'dbe',
  subject: 'physics',
  year: 2025,
  paper: 'nov_p2',
  order: 6,
  content_tier: 'free',
  has_video: false,
  xp: 45,
  tags: ['organic_molecules', 'iupac_naming', 'isomers', 'combustion'],
  question_image_urls: [`${PAPER}/q6/question_1.png`, `${PAPER}/q6/question_2.png`],
  memo_image_urls: [`${PAPER}/q6/memo_1.png`, `${PAPER}/q6/memo_2.png`, `${PAPER}/q6/memo_3.png`],
  exam_question_marks: 22,
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
      'Compound P, CH₃CH₂CH₂OH, and compound Q, CH₃OCH₂CH₃, have the same molecular formula. What type of isomerism do P and Q show?',
    metadata: ['Chain isomerism', 'Positional isomerism', 'Geometric isomerism', 'Functional isomerism', ''],
    answer: ['Functional isomerism', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'matter_materials',
    topic: 'organic_molecules',
    subtopic: 'structural_isomer_types',
    skills: ['isomer_classification'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p2',
    clues:
      "- P and Q have the same molecular formula but different arrangements of atoms — that alone makes them structural isomers.\n- P belongs to the alcohol homologous series; Q belongs to a different homologous series entirely.",
  },
  {
    name: 'Question 2',
    question:
      'Match each compound to its correct IUPAC name.',
    metadata: [
      'A - CH₃CH(CH₃)CH₂CH₂OH',
      'B - CH₃CH₂CH(CH₃)CH₂OH',
      '1 - 3-methylbutan-1-ol',
      '2 - 2-methylbutan-1-ol',
    ],
    answer: ['A-1', 'B-2'],
    presentation: 'match',
    type: 'application',
    unit: 'matter_materials',
    topic: 'organic_molecules',
    subtopic: 'iupac_naming',
    skills: ['iupac_naming_application'],
    difficulty: 3,
    exam_weight: 3,
    xp: 15,
    order: 2,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p2',
    clues:
      "- Both compounds are 4-carbon alcohols with one methyl branch — number the main chain from the end nearest the OH group to give it the lowest locant.\n- Compound A's branch sits two carbons from the OH; compound B's branch sits one carbon from the OH.",
  },
  {
    name: 'Question 3',
    question:
      'Select ALL of the following statements that are TRUE requirements for the COMPLETE combustion of a hydrocarbon.',
    metadata: [
      'A sufficient (or excess) supply of oxygen is required',
      'The products are always CO₂(g) and CO(g)',
      'The products are CO₂(g) and H₂O(g) (or (ℓ))',
      'Incomplete combustion also produces only CO₂ and H₂O',
      '',
    ],
    answer: ['A sufficient (or excess) supply of oxygen is required', 'The products are CO₂(g) and H₂O(g) (or (ℓ))', '', '', ''],
    presentation: 'multi_select',
    type: 'application',
    unit: 'matter_materials',
    topic: 'organic_molecules',
    subtopic: 'combustion_reactions',
    skills: ['combustion_reaction_features'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p2',
    clues:
      '- Complete combustion needs enough oxygen to fully oxidise every carbon and hydrogen atom in the fuel.\n- Carbon monoxide (CO) and soot are signs of incomplete combustion, not complete combustion.',
  },
  {
    name: 'Question 4',
    question:
      'Compound M, C₂H₆(g), reacts with oxygen according to the balanced equation: 2C₂H₆(g) + 7O₂(g) → 4CO₂(g) + 6H₂O(g). Initially 10 cm³ of C₂H₆(g) and 40 cm³ of O₂(g) are injected into a container of adjustable volume and allowed to react completely. Calculate the TOTAL volume of gas present in the container at the end of the reaction: []',
    metadata: ['Total volume = ', '[ ]', ' cm³'],
    answer: ['55', '', '', '', ''],
    presentation: 'fitb',
    type: 'calc',
    unit: 'matter_materials',
    topic: 'organic_molecules',
    subtopic: 'combustion_reactions',
    skills: ['gas_volume_stoichiometry'],
    difficulty: 3,
    exam_weight: 3,
    xp: 15,
    order: 4,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p2',
    clues:
      "- Use the mole ratio from the balanced equation to find how much O₂ is used and how much CO₂/H₂O forms from the C₂H₆ that reacts.\n- Check which reactant is limiting before calculating how much O₂ remains unreacted.",
  },
  {
    name: 'Question 5',
    question: 'Which ONE of the following compounds is a carboxylic acid?',
    metadata: ['CH₃CH₂CHO', 'CH₃COOCH₃', 'CH₃CH₂COOH', 'CH₃COCH₃', ''],
    answer: ['CH₃CH₂COOH', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'matter_materials',
    topic: 'organic_molecules',
    subtopic: 'functional_group_recognition',
    skills: ['functional_group_identification'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 5,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p2',
    clues:
      '- A carboxylic acid has a −COOH group, written as −COOH at the end of the chain.\n- The other three compounds show an aldehyde, an ester, and a ketone functional group instead.',
  },
];

const aiExplanation = {
  sub_questions: [
    {
      number: '2.1.1',
      marks: 1,
      clues: '- An alcohol contains an −OH functional group and no other oxygen-containing group.\n- Check each compound for a carbonyl (C=O), a −CHO group, or halogen atoms before settling on the alcohol.',
      approach: '- Eliminate A (a ketone, C=O), B (a haloalkane), C (an aldehyde, −CHO), E and F (alkanes, no oxygen), and G (an alkene, no oxygen).\n- The remaining compound, given only as a molecular formula containing one oxygen, must be the alcohol.',
      solution: '1. A has a C=O group (ketone), C has a −CHO group (aldehyde), and B has chlorine substituents — none of these is an alcohol.\n2. E (C₃H₈) and F (pentane) are alkanes; G is an alkene — none contains oxygen.\n3. D, C₄H₁₀O, is the only remaining compound and is consistent with being an alcohol.\n4. The correct answer is D.',
    },
    {
      number: '2.1.2',
      marks: 1,
      clues: '- Functional isomers share the same molecular formula but belong to different homologous series.\n- Compare the molecular formulas of the compounds that contain oxygen.',
      approach: '- Work out the molecular formula of each oxygen-containing compound.\n- Find the pair that matches in molecular formula but differs in functional group.',
      solution: '1. Compound A (a ketone) and compound C (an aldehyde) both have the molecular formula C₅H₁₀O.\n2. They belong to different homologous series (ketone vs aldehyde) despite sharing a molecular formula.\n3. The correct answer is A and C.',
    },
    {
      number: '2.1.3',
      marks: 1,
      clues: '- Compounds in the same homologous series share the same general formula and functional group.\n- Two of the lettered compounds are both simple, unbranched alkanes.',
      approach: '- Identify the compounds with no functional group other than C-C and C-H bonds.\n- Confirm they fit the same general formula, CₙH₂ₙ₊₂.',
      solution: '1. E is C₃H₈ (propane) and F is pentane (C₅H₁₂) — both are straight-chain alkanes.\n2. Both fit the alkane general formula CₙH₂ₙ₊₂ and contain only single C-C and C-H bonds.\n3. The correct answer is E and F.',
    },
    {
      number: '2.2.1',
      marks: 3,
      clues: '- Identify the longest carbon chain containing the C=O group, then number it to give that group the lowest possible locant.\n- Name any branch as a substituent prefix with its own locant.',
      approach: '- Find the parent chain and the position of the carbonyl group.\n- Add the methyl substituent\'s locant and name in alphabetical/numerical order.',
      solution: '1. The parent chain is a 4-carbon ketone (butanone) with the C=O on carbon 2.\n2. A methyl branch sits on carbon 3.\n3. The correct IUPAC name is 3-methylbutan-2-one.',
    },
    {
      number: '2.2.2',
      marks: 3,
      clues: '- Identify the longest carbon chain first, then locate and number every substituent to give the lowest overall locant set.\n- List multiple identical or different substituents alphabetically with their own locants.',
      approach: '- Find the 7-carbon parent chain (heptane).\n- Number from whichever end gives the lower set of locants to the two chlorine and two methyl substituents, then name them in alphabetical order.',
      solution: '1. The parent chain is a 7-carbon chain: heptane.\n2. Two chlorine atoms sit at positions 2 and 6, and two methyl groups sit at positions 2 and 5.\n3. Naming substituents alphabetically (chloro before methyl), the correct IUPAC name is 2,6-dichloro-2,5-dimethylheptane.',
    },
    {
      number: '2.2.3',
      marks: 3,
      clues: '- For an alkene, the parent chain must include the C=C double bond, numbered to give it the lowest possible locant.\n- Name every substituent with its own locant, listed alphabetically.',
      approach: '- Find the longest chain containing the double bond (hexene) and number it so the double bond gets the lowest locant.\n- Identify and name the ethyl and methyl substituents with their locants.',
      solution: '1. The parent chain is a 6-carbon chain containing a double bond starting at carbon 2: hex-2-ene.\n2. An ethyl substituent sits at carbon 3 and a methyl substituent sits at carbon 2.\n3. Naming substituents alphabetically (ethyl before methyl), the correct IUPAC name is 3-ethyl-2-methylhex-2-ene.',
    },
    {
      number: '2.2.4',
      marks: 4,
      clues: '- A straight-chain positional isomer of an alcohol keeps the same unbranched carbon skeleton but moves the −OH to a different carbon.\n- Compound D, C₄H₁₀O, as a straight-chain alcohol has only two possible −OH positions.',
      approach: '- Draw the straight 4-carbon chain of compound D.\n- Place the −OH group on carbon 1 for one isomer and on carbon 2 for the other, completing the hydrogens.',
      solution: '1. The straight-chain skeleton is a 4-carbon chain: C-C-C-C.\n2. Placing the −OH on the first carbon gives butan-1-ol.\n3. Placing the −OH on the second carbon gives butan-2-ol.\n4. These are the two straight-chain positional isomers of compound D.',
    },
    {
      number: '2.3.1',
      marks: 1,
      clues: '- Compound E (an alkane) is reacting with oxygen gas to form carbon dioxide and water.\n- A hydrocarbon reacting with oxygen to form CO₂ and H₂O is a named reaction type.',
      approach: '- Identify the reactant (a hydrocarbon) and the oxidant (O₂).\n- Recall the name of a reaction between a hydrocarbon and oxygen producing CO₂ and H₂O.',
      solution: '1. C₃H₈(g) reacts with O₂(g) to form CO₂(g) and H₂O(g).\n2. A hydrocarbon burning in oxygen to form carbon dioxide and water is a combustion (oxidation) reaction.\n3. The correct answer is combustion/oxidation.',
    },
    {
      number: '2.3.2',
      marks: 5,
      clues: '- Use the mole ratio from the balanced equation to find how much O₂ is used and how much CO₂/H₂O forms from all of the C₃H₈ reacting.\n- The total gas volume at the end is the sum of the unused O₂ and the newly formed CO₂ and H₂O.',
      approach: '- Use the 1:5:3:4 mole (and volume) ratio of C₃H₈ : O₂ : CO₂ : H₂O to find the volume of O₂ used and the volumes of CO₂ and H₂O formed from 8 cm³ of C₃H₈.\n- Subtract the O₂ used from the 50 cm³ supplied to find the O₂ remaining, then add it to the CO₂ and H₂O formed.',
      solution: '1. V(O₂) used = 5 × V(C₃H₈) = 5 × 8 = 40 cm³; V(O₂) remaining = 50 − 40 = 10 cm³.\n2. V(CO₂) formed = 3 × V(C₃H₈) = 3 × 8 = 24 cm³.\n3. V(H₂O) formed = 4 × V(C₃H₈) = 4 × 8 = 32 cm³.\n4. Total volume of gas = 10 + 24 + 32 = 66 cm³.',
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
