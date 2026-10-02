#!/usr/bin/env node
/**
 * DBE Physical Sciences: Chemistry P2 — November 2024 — Question 2 (order 6)
 * Organic Molecules — functional groups, unsaturation, IUPAC naming (haloalkane,
 * alkyne), functional isomers, esterification. 18 marks, one compound table (A–H).
 *
 *   node tools/validate-questions.js --script scripts/add-physics-2024-nov-p2-q2.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-physics-2024-nov-p2-q2.js --dry-run
 *   node scripts/add-physics-2024-nov-p2-q2.js
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
  name: 'Question 2',
  syllabus: 'dbe',
  subject: 'physics',
  year: 2024,
  paper: 'nov_p2',
  order: 6,
  content_tier: 'free',
  has_video: false,
  xp: 65,
  tags: ['organic_molecules', 'iupac_naming', 'isomers', 'functional_groups'],
  question_image_urls: [`${PAPER}/q6/question_1.png`, `${PAPER}/q6/question_2.png`],
  memo_image_urls: [`${PAPER}/q6/memo_1.png`, `${PAPER}/q6/memo_2.png`],
  exam_question_marks: 18,
  supplementary_materials: [FORMULA_SHEET],
};

const questions = [
  {
    name: 'Question 1',
    question: 'Match each compound to the homologous series it belongs to.',
    metadata: [
      'A - CH₃CH₂CHO',
      'B - CH₃CH₂COCH₂CH₃',
      'C - CH₃CH₂CH(OH)CH₃',
      'D - CH₃CH₂COOCH₃',
      '1 - Ketones',
      '2 - Esters',
      '3 - Aldehydes',
      '4 - Alcohols',
    ],
    answer: ['A-3', 'B-1', 'C-4', 'D-2'],
    presentation: 'match', type: 'application',
    unit: 'matter_materials', topic: 'organic_molecules', subtopic: 'functional_group_recognition',
    skills: ['functional_group_identification', 'homologous_series_recognition'],
    difficulty: 2, exam_weight: 2, xp: 10, order: 1,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p2',
    clues: '- Look at where the C=O sits: at the END of the chain (with an H on the same C), or BETWEEN two C atoms.\n- –COO– joining two carbon groups is different from –COOH at the end of a chain.',
  },
  {
    name: 'Question 2',
    question: 'Select ALL the UNSATURATED compounds below.',
    metadata: ['CH₃CH=CHCH₃', 'CH₃CHBrCHBrCH₃', 'CH≡CCH₂CH₃', 'CH₃CH(CH₃)CH₃', 'CH₃CH₂CH₂Br'],
    answer: ['CH₃CH=CHCH₃', 'CH≡CCH₂CH₃', '', '', ''],
    presentation: 'multi_select', type: 'application',
    unit: 'matter_materials', topic: 'organic_molecules', subtopic: 'homologous_series_classification',
    skills: ['unsaturation_testing'],
    difficulty: 1, exam_weight: 1, xp: 10, order: 2,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p2',
    clues: '- Unsaturated means at least one multiple bond between CARBON atoms.\n- A compound made by ADDING to a double bond is no longer unsaturated.',
  },
  {
    name: 'Question 3',
    question: 'What is the IUPAC name of the compound CH₃CBr₂CH(CH₃)CH₂CH₃?',
    metadata: [
      '4,4-dibromo-3-methylpentane',
      '2,2-dibromo-3-methylpentane',
      '3-methyl-2,2-dibromopentane',
      '2,2-dibromo-3-methylbutane',
      '',
    ],
    answer: ['2,2-dibromo-3-methylpentane', '', '', '', ''],
    presentation: 'multiple_choice', type: 'application',
    unit: 'matter_materials', topic: 'organic_molecules', subtopic: 'iupac_naming',
    skills: ['iupac_naming_application'],
    difficulty: 3, exam_weight: 3, xp: 15, order: 3,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p2',
    clues: '- Count the carbons in the longest chain first; the CH₃ in brackets is a branch, not part of the chain.\n- Number from the end that gives the lowest number at the FIRST point of difference, then list substituents alphabetically.',
  },
  {
    name: 'Question 4',
    question: 'What is the IUPAC name of the compound CH₃CH₂C≡CC(CH₃)₂CH₃?',
    metadata: [
      '5,5-dimethylhex-3-yne',
      '2,2-dimethylhept-3-yne',
      '2,2-dimethylhex-4-yne',
      '2,2-dimethylhex-3-yne',
      '',
    ],
    answer: ['2,2-dimethylhex-3-yne', '', '', '', ''],
    presentation: 'multiple_choice', type: 'application',
    unit: 'matter_materials', topic: 'organic_molecules', subtopic: 'iupac_naming',
    skills: ['iupac_naming_application'],
    difficulty: 4, exam_weight: 3, xp: 15, order: 4,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p2',
    clues: '- The triple bond gets the same number from either end here, so let the branches decide the direction.\n- C(CH₃)₂ carries two methyl branches on ONE chain carbon; only one of its three CH₃ groups continues the chain.',
  },
  {
    name: 'Question 5',
    question: 'Select ALL the pairs of compounds that are FUNCTIONAL isomers of each other.',
    metadata: [
      'Propanal and propanone',
      'Butan-1-ol and butan-2-ol',
      'Butanoic acid and methyl propanoate',
      'Pentane and 2-methylbutane',
      'Ethanol and ethanoic acid',
    ],
    answer: ['Propanal and propanone', 'Butanoic acid and methyl propanoate', '', '', ''],
    presentation: 'multi_select', type: 'application',
    unit: 'matter_materials', topic: 'organic_molecules', subtopic: 'structural_isomer_types',
    skills: ['isomer_classification'],
    difficulty: 3, exam_weight: 2, xp: 10, order: 5,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p2',
    clues: '- First check that the pair has the SAME molecular formula; if not, they are not isomers at all.\n- Then ask what differs: the chain shape, the position of the group, or the homologous series itself.',
  },
  {
    name: 'Question 6',
    question: 'The ester ethyl butanoate, CH₃CH₂CH₂COOCH₂CH₃, is prepared in the laboratory. Which ONE of the following gives the correct reactants and catalyst?',
    metadata: [
      'Ethanoic acid and butan-1-ol, with concentrated H₂SO₄',
      'Butanoic acid and ethanol, with dilute NaOH',
      'Propanoic acid and propan-1-ol, with concentrated H₂SO₄',
      'Butanoic acid and ethanol, with concentrated H₂SO₄',
      '',
    ],
    answer: ['Butanoic acid and ethanol, with concentrated H₂SO₄', '', '', '', ''],
    presentation: 'multiple_choice', type: 'application',
    unit: 'matter_materials', topic: 'organic_molecules', subtopic: 'esterification_reactions',
    skills: ['esterification'],
    difficulty: 3, exam_weight: 2, xp: 10, order: 6,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p2',
    clues: '- Split the ester at the –COO– link: the part that includes the C=O carbon came from the acid.\n- Esterification is acid-catalysed; a base would break an ester down instead.',
  },
];

const aiExplanation = {
  sub_questions: [
    {
      number: '2.1.1',
      marks: 1,
      clues: '- An alcohol has an –OH group bonded to a saturated C atom.\n- Some compounds in the table are only given as a molecular formula: check which homologous series that formula fits.',
      approach: '- Work through the table for a compound with the general formula of an alcohol, CₙH₂ₙ₊₁OH.\n- Write down its letter.',
      solution: '1. C₄H₁₀O fits CₙH₂ₙ₊₂O, the general formula of the alcohols (e.g. butan-1-ol, C₄H₉OH).\n2. Answer: D.',
    },
    {
      number: '2.1.2',
      marks: 1,
      clues: '- The formyl group is –CHO: a C=O at the END of a chain with an H on the same C.\n- Look for a drawn structure with the C=O on a terminal carbon.',
      approach: '- Find the compound whose C=O carbon also carries an H atom.\n- Write down its letter.',
      solution: '1. Compound A has the C=O on the last carbon, which is also bonded to an H atom: a formyl group (it is butanal).\n2. Answer: A.',
    },
    {
      number: '2.1.3',
      marks: 1,
      clues: '- Unsaturated means a double or triple bond between carbon atoms.\n- In condensed formulas, a C with too few H atoms written next to it usually signals a multiple bond.',
      approach: '- Check each compound for a C=C or C≡C bond.\n- Write down the letter of the compound that has one.',
      solution: '1. In E, CH₃C(CH₃)₂CCCH₃, the two "C" atoms with no H atoms in the middle of the chain are joined by a triple bond.\n2. E is an alkyne, which is unsaturated.\n3. Answer: E.',
    },
    {
      number: '2.2.1',
      marks: 3,
      clues: '- The longest chain runs through the two branches drawn vertically: count it carefully.\n- Two Br atoms on one C and two methyl groups on the next: use di- and repeat the number.',
      approach: '- Find the longest continuous carbon chain and name the stem.\n- Number to give the lowest set of numbers to the substituents, then list them alphabetically (bromo before methyl).',
      solution: '1. The longest chain has 6 C atoms: hexane.\n2. Numbering from the end nearest the substituents gives two Br atoms on C3 and two methyl groups on C4.\n3. Alphabetical order (b before m): 3,3-dibromo-4,4-dimethylhexane.',
    },
    {
      number: '2.2.2',
      marks: 3,
      clues: '- The functional group (the triple bond) must get the lowest possible number.\n- C(CH₃)₂ means two methyl branches on the same carbon.',
      approach: '- Identify the longest chain containing the C≡C bond.\n- Number so the triple bond gets the lowest number, then place the methyl branches.',
      solution: '1. CH₃C(CH₃)₂CCCH₃: the longest chain has 5 C atoms with a triple bond, so the stem is pentyne.\n2. Numbering from the right, the triple bond is between C2 and C3 and both methyl groups are on C4.\n3. Name: 4,4-dimethylpent-2-yne.',
    },
    {
      number: '2.3.1',
      marks: 2,
      clues: '- Isomers always share a molecular formula.\n- "Functional" tells you what is different between them.',
      approach: '- State what the two compounds have in common.\n- State how they differ.',
      solution: '1. Functional isomers are compounds with the same molecular formula, but different functional groups (they belong to different homologous series).',
    },
    {
      number: '2.3.2',
      marks: 1,
      clues: '- Aldehydes and ketones with the same number of C atoms share a general formula.\n- Find two compounds in the table with four C atoms and one C=O.',
      approach: '- Write the molecular formula of each candidate.\n- Find the pair with the same formula but different functional groups.',
      solution: '1. A is butanal (C₄H₈O, aldehyde) and C is butanone (C₄H₈O, ketone).\n2. Same molecular formula, different functional groups.\n3. Answer: A and C.',
    },
    {
      number: '2.4.1',
      marks: 1,
      clues: '- Esterification needs an acid catalyst.\n- The same reagent also acts as a dehydrating agent.',
      approach: '- Recall the catalyst used when an alcohol reacts with a carboxylic acid.\n- Give its name or formula.',
      solution: '1. Concentrated sulphuric acid, H₂SO₄.',
    },
    {
      number: '2.4.2',
      marks: 1,
      clues: '- A carboxylic acid plus an alcohol gives an ester and water.\n- Name the reaction after its product.',
      approach: '- Identify the product type (an ester).\n- Name the reaction type.',
      solution: '1. Esterification (also accepted: condensation).',
    },
    {
      number: '2.4.3',
      marks: 2,
      clues: '- F is CH₃COO(CH₂)₂CH₃: split it at –COO–.\n- The acid part has 2 C atoms and the alcohol part has 3 C atoms in a straight chain.',
      approach: '- Draw the ester functional group –C(=O)–O–.\n- Attach a CH₃ to the carbonyl C and a –CH₂CH₂CH₃ chain to the single-bonded O, showing every bond.',
      solution: '1. Carbonyl carbon: bonded to CH₃ on one side, =O above, and –O– on the other side.\n2. The –O– is bonded to a straight chain of three carbons: –CH₂–CH₂–CH₃.\n3. Draw all C–H bonds explicitly: H₃C–C(=O)–O–CH₂–CH₂–CH₃ (propyl ethanoate).',
    },
    {
      number: '2.4.4',
      marks: 2,
      clues: '- X is the alcohol: it provides the part of the ester bonded to the single O.\n- That part is a straight three-carbon chain joined through its END carbon.',
      approach: '- Identify the alkyl group on the O side of the ester.\n- Name the alcohol it came from, including the position of –OH.',
      solution: '1. The –O–CH₂CH₂CH₃ part of F comes from the alcohol CH₃CH₂CH₂OH.\n2. IUPAC name of X: propan-1-ol.',
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
