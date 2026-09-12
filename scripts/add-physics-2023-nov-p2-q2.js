#!/usr/bin/env node
/**
 * DBE Physical Sciences: Chemistry P2 — November 2023 — Question 2 (order 6)
 * Organic Molecules — IUPAC naming, structural formulas, general formulas,
 * functional group recognition, structural isomerism. 16 marks, one continuous
 * scenario (a table of lettered compounds A-H, all sub-parts reference it).
 *
 *   node tools/validate-questions.js --script scripts/add-physics-2023-nov-p2-q2.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-physics-2023-nov-p2-q2.js --dry-run
 *   node scripts/add-physics-2023-nov-p2-q2.js
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
  name: 'Question 2',
  syllabus: 'dbe',
  subject: 'physics',
  year: 2023,
  paper: 'nov_p2',
  order: 6,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['organic_molecules', 'iupac_naming', 'isomers', 'functional_groups'],
  question_image_urls: [`${PAPER}/q6/question_1.png`],
  memo_image_urls: [`${PAPER}/q6/memo_1.png`, `${PAPER}/q6/memo_2.png`],
  exam_question_marks: 16,
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
    question: 'What is the IUPAC name of the compound with condensed structural formula CH₃CH=C(CH₃)CH₂CH₃?',
    metadata: ['2-methylpent-3-ene', '3-methylbut-2-ene', '3-methylpent-2-ene', '2,2-dimethylbut-1-ene', ''],
    answer: ['3-methylpent-2-ene', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'matter_materials',
    topic: 'organic_molecules',
    subtopic: 'iupac_naming',
    skills: ['iupac_naming_application'],
    difficulty: 3,
    exam_weight: 2,
    xp: 15,
    order: 1,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2023,
    paper: 'nov_p2',
    clues:
      '- Find the longest chain that includes the C=C double bond, then number it to give the double bond the lowest possible locant.\n- Name the branch off the chain as a substituent with its own locant.',
  },
  {
    name: 'Question 2',
    question: 'Match each compound to the general formula of its homologous series.',
    metadata: [
      'A - CH₃CH₂CH₂CH₃ (butane)',
      'B - CH₃CH₂OH (ethanol)',
      'C - CH₃COCH₃ (propanone)',
      '1 - CₙH₂ₙ₊₂',
      '2 - CₙH₂ₙ₊₂O',
      '3 - CₙH₂ₙO',
    ],
    answer: ['A-1', 'B-2', 'C-3'],
    presentation: 'match',
    type: 'definition',
    unit: 'matter_materials',
    topic: 'organic_molecules',
    subtopic: 'homologous_series_classification',
    skills: ['homologous_series_recognition'],
    difficulty: 2,
    exam_weight: 2,
    xp: 15,
    order: 2,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2023,
    paper: 'nov_p2',
    clues:
      '- Each homologous series has exactly one general formula shared by every member of that series.\n- Identify the functional group of each compound first, then recall which general formula belongs to that series.',
  },
  {
    name: 'Question 3',
    question:
      'The molecular formula C₄H₈O₂ can represent compounds from more than one class of organic compound. Select ALL of the classes below that could have a compound with this exact molecular formula.',
    metadata: ['Carboxylic acid', 'Ester', 'Alcohol', 'Ketone', ''],
    answer: ['Carboxylic acid', 'Ester', '', '', ''],
    presentation: 'multi_select',
    type: 'application',
    unit: 'matter_materials',
    topic: 'organic_molecules',
    subtopic: 'structural_isomer_types',
    skills: ['isomer_classification'],
    difficulty: 3,
    exam_weight: 2,
    xp: 15,
    order: 3,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2023,
    paper: 'nov_p2',
    clues:
      '- Work out the general formula for each class of compound listed, then check which ones match CₙH₂ₙO₂ at n = 4.\n- Two different classes can be functional isomers of each other when they share the same general formula.',
  },
  {
    name: 'Question 4',
    question: 'Which ONE of the following condensed structural formulas contains a KETONE functional group?',
    metadata: ['CH₃CH₂CHO', 'CH₃COCH₂CH₃', 'CH₃CH₂COOH', 'CH₃CH₂COOCH₃', ''],
    answer: ['CH₃COCH₂CH₃', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'definition',
    unit: 'matter_materials',
    topic: 'organic_molecules',
    subtopic: 'functional_group_recognition',
    skills: ['functional_group_identification'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2023,
    paper: 'nov_p2',
    clues:
      '- A ketone has its C=O carbon bonded to two OTHER carbon atoms, not to an H atom, an OH group, or an O-C group.\n- Check each formula for exactly where the C=O sits within the chain.',
  },
  {
    name: 'Question 5',
    question: 'Which ONE of the following condensed structural formulas represents 2-methylpropan-1-ol?',
    metadata: ['(CH₃)₃COH', 'CH₃CH₂CH₂CH₂OH', 'CH₃CH(CH₃)CH₂OH', 'CH₃CH(OH)CH₂CH₃', ''],
    answer: ['CH₃CH(CH₃)CH₂OH', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'matter_materials',
    topic: 'organic_molecules',
    subtopic: 'iupac_naming',
    skills: ['iupac_naming_application'],
    difficulty: 3,
    exam_weight: 2,
    xp: 15,
    order: 5,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2023,
    paper: 'nov_p2',
    clues:
      "- The name tells you the −OH is on carbon 1 of a 3-carbon chain, with a methyl branch on carbon 2.\n- Check each option for chain length, branch position, and exactly where the −OH sits.",
  },
];

const aiExplanation = {
  sub_questions: [
    {
      number: '2.1',
      marks: 1,
      clues: '- Every organic compound shares one element in common, by definition.\n- Think about which element forms the backbone of every organic molecule.',
      approach: '- Recall the defining element of organic chemistry.\n- State the definition concisely.',
      solution: '1. Organic compounds are defined by the element they all contain: carbon.\n2. The correct definition is: molecules/compounds containing carbon (atoms).',
    },
    {
      number: '2.2.1',
      marks: 2,
      clues: '- Compound E has a C=C double bond and two methyl branches — find the longest chain containing the double bond first.\n- Number the chain to give the double bond the lowest possible locant.',
      approach: '- Identify the 4-carbon parent chain containing the C=CH₂ double bond.\n- Locate and name the two methyl substituents with their locants.',
      solution:
        '1. The longest chain containing the C=C double bond is 4 carbons long, giving the parent name but-1-ene.\n2. Two methyl branches sit at carbons 2 and 3 of this chain.\n3. The correct IUPAC name is 2,3-dimethylbut-1-ene.',
    },
    {
      number: '2.2.2',
      marks: 2,
      clues: '- Compound H is a 4-carbon chain with a C=O group — find which carbon carries it.\n- Number the chain to give the C=O the lowest possible locant.',
      approach: '- Identify the 4-carbon parent chain (butane).\n- Locate the C=O group\'s position and apply the appropriate suffix.',
      solution:
        '1. The parent chain is 4 carbons long: butane.\n2. The C=O group sits on carbon 2 of the chain, not at the end, so this is a ketone.\n3. The correct IUPAC name is butan-2-one (also accepted: 2-butanone/butanone).',
    },
    {
      number: '2.3.1',
      marks: 2,
      clues: '- Compound B, CH₃(CH₂)₃COOCH₃, has an ester functional group (−COO−) linking two carbon chains.\n- Draw the full carbon skeleton on both sides of the −COO− group, then fill in every H atom.',
      approach: '- Identify the ester functional group and its position in the formula.\n- Draw the complete structural formula showing every atom and bond explicitly.',
      solution:
        "1. B's condensed formula, CH₃(CH₂)₃COOCH₃, shows an ester group (−C(=O)−O−) joining a 5-carbon acid-derived chain to a methyl group.\n2. The full structural formula draws every C, H, and O atom with all bonds shown explicitly, keeping the ester group intact.\n3. This structure represents methyl pentanoate.",
    },
    {
      number: '2.3.2',
      marks: 3,
      clues: '- The name tells you: a 6-carbon chain (hexane), with 2 fluorine atoms both on carbon 3, and an ethyl group on carbon 4.\n- Draw the 6-carbon backbone first, then add the substituents at the correct positions before filling in remaining H atoms.',
      approach: '- Draw a straight 6-carbon chain.\n- Place both fluorine atoms on carbon 3 and the ethyl branch on carbon 4, then complete all remaining bonds with H atoms.',
      solution:
        '1. "Hexane" fixes a 6-carbon parent chain.\n2. "3,3-difluoro" places two fluorine atoms both on carbon 3.\n3. "4-ethyl" places a −CH₂CH₃ branch on carbon 4.\n4. Filling in the remaining bonds with hydrogen atoms completes the structural formula of 4-ethyl-3,3-difluorohexane.',
    },
    {
      number: '2.3.3',
      marks: 1,
      clues: '- Compound E has one C=C double bond and no other functional group.\n- Recall the general formula shared by every member of the alkene homologous series.',
      approach: '- Identify compound E\'s homologous series from its functional group.\n- State that series\' general formula.',
      solution: '1. Compound E contains one C=C double bond and belongs to the alkene homologous series.\n2. The general formula for alkenes is CₙH₂ₙ.',
    },
    {
      number: '2.3.4',
      marks: 1,
      clues: '- Compound F has its C=O carbon bonded to two other carbon atoms (not an H or O-C group).\n- Recall the generic structural formula used to represent this functional group in any compound.',
      approach: '- Identify compound F\'s functional group.\n- Write its structural formula in generic R-group form.',
      solution: '1. In compound F, the C=O carbon is bonded to two other carbon-containing groups, making it a ketone.\n2. The ketone functional group is written generically as R−C(=O)−R\'.',
    },
    {
      number: '2.3.5',
      marks: 2,
      clues: "- B is an ester formed from an acid and an alcohol — the alcohol contributes the −O−CH₃ portion.\n- Work out which alcohol, when esterified, would leave exactly a −OCH₃ group attached to the carbonyl.",
      approach: '- Identify the alkyl group attached to the ester oxygen in compound B.\n- Name the alcohol that this alkyl group came from.',
      solution:
        "1. In CH₃(CH₂)₃COOCH₃, the −OCH₃ portion of the ester comes from the alcohol that reacted with the acid.\n2. A −CH₃ group attached to the ester oxygen means the alcohol used was methanol (CH₃OH).\n3. The correct answer is methanol.",
    },
    {
      number: '2.4.1',
      marks: 1,
      clues: '- Compound G is a carboxylic acid — a functional isomer shares its molecular formula but belongs to a different homologous series.\n- Compare molecular formulas of the other lettered compounds against G\'s.',
      approach: "- Work out compound G's molecular formula.\n- Find another compound with the same molecular formula but a different functional group (ester, not acid).",
      solution:
        "1. Compound G is a carboxylic acid.\n2. Compound B is an ester with the same molecular formula as G, but belongs to a different homologous series.\n3. The correct answer is B.",
    },
    {
      number: '2.4.2',
      marks: 1,
      clues: '- Chain isomers share the same molecular formula and the same functional group, but differ in how the carbon chain is branched.\n- Compare the two straight/branched carboxylic acids in the table.',
      approach: '- Identify which lettered compounds are both carboxylic acids with the same molecular formula.\n- Check that they differ only in chain branching, not in functional group.',
      solution:
        '1. Compounds D and G are both carboxylic acids.\n2. They share the same molecular formula but differ in how their carbon chains are branched.\n3. The correct answer is D and G.',
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
