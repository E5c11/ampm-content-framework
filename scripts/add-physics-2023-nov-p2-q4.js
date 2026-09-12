#!/usr/bin/env node
/**
 * DBE Physical Sciences: Chemistry P2 — November 2023 — Question 4 (order 8)
 * Organic Molecules — cracking stoichiometry, positional isomers, addition vs
 * elimination reactions. 19 marks, one continuous scenario (a cracking reaction
 * plus a three-step haloalkane/alcohol/alkene conversion sequence).
 *
 *   node tools/validate-questions.js --script scripts/add-physics-2023-nov-p2-q4.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-physics-2023-nov-p2-q4.js --dry-run
 *   node scripts/add-physics-2023-nov-p2-q4.js
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
  name: 'Question 4',
  syllabus: 'dbe',
  subject: 'physics',
  year: 2023,
  paper: 'nov_p2',
  order: 8,
  content_tier: 'free',
  has_video: false,
  xp: 55,
  tags: ['organic_molecules', 'cracking', 'isomers'],
  question_image_urls: [`${PAPER}/q8/question_1.png`],
  memo_image_urls: [`${PAPER}/q8/memo_1.png`, `${PAPER}/q8/memo_2.png`],
  exam_question_marks: 19,
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
    question: 'Cracking converts decane into butane and propene: C₁₀H₂₂ → C₄H₁₀ + nC₃H₆. Calculate the value of n: []',
    metadata: ['n = ', '[ ]'],
    answer: ['2', '', '', '', ''],
    presentation: 'fitb',
    type: 'calc',
    unit: 'matter_materials',
    topic: 'organic_molecules',
    subtopic: 'cracking_reactions',
    skills: ['cracking_stoichiometry'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2023,
    paper: 'nov_p2',
    clues: '- Balance the total number of carbon atoms on both sides of the equation first.\n- Check that the same value of n also balances the total number of hydrogen atoms.',
  },
  {
    name: 'Question 2',
    question:
      'Compounds J and K both have the molecular formula C₅H₁₁Cl. In compound J, the Cl atom is bonded to the second carbon of a straight 5-carbon chain; in compound K, it is bonded to the third carbon of the same straight chain. What relationship do J and K have?',
    metadata: ['Chain isomers', 'Positional isomers', 'Functional isomers', 'Identical compounds (same structure, same name)', ''],
    answer: ['Positional isomers', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'definition',
    unit: 'matter_materials',
    topic: 'organic_molecules',
    subtopic: 'structural_isomer_types',
    skills: ['positional_isomerism', 'isomer_classification'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2023,
    paper: 'nov_p2',
    clues:
      '- Structural isomers that differ only in WHERE a substituent sits on an otherwise identical carbon chain are one specific type.\n- Chain isomers differ in how the carbon skeleton itself is branched; functional isomers differ in which functional group is present.',
  },
  {
    name: 'Question 3',
    question: 'But-2-ene reacts with HBr to form 2-bromobutane. Select ALL of the statements below that correctly describe this reaction and its reverse.',
    metadata: [
      'This reaction (but-2-ene + HBr) is an addition reaction',
      'This reaction (but-2-ene + HBr) is a substitution reaction',
      'The reverse reaction (2-bromobutane → but-2-ene + HBr) is an elimination reaction',
      'The reverse reaction (2-bromobutane → but-2-ene + HBr) proceeds with a dilute acid catalyst',
      '',
    ],
    answer: ['This reaction (but-2-ene + HBr) is an addition reaction', 'The reverse reaction (2-bromobutane → but-2-ene + HBr) is an elimination reaction', '', '', ''],
    presentation: 'multi_select',
    type: 'application',
    unit: 'matter_materials',
    topic: 'organic_molecules',
    subtopic: 'alkene_addition_reactions',
    skills: ['reaction_type_identification'],
    difficulty: 3,
    exam_weight: 2,
    xp: 15,
    order: 3,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2023,
    paper: 'nov_p2',
    clues:
      "- Look at what happens to the total number of atoms in the molecule during each direction of this reaction: does something add on, or does something split off?\n- The condition needed to drive the reverse (breaking-down) direction is not the same strength as what's listed here — check whether 'dilute' or 'concentrated' is correct.",
  },
  {
    name: 'Question 4',
    question: "2-Methylbut-2-ene reacts with HBr. Which ONE of the following is the MAJOR product, according to Markovnikov's rule?",
    metadata: ['1-bromo-2-methylbutane', '2-bromo-3-methylbutane', '2-bromo-2-methylbutane', '2-bromobutane', ''],
    answer: ['2-bromo-2-methylbutane', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'matter_materials',
    topic: 'organic_molecules',
    subtopic: 'alkene_addition_reactions',
    skills: ['reaction_type_identification'],
    difficulty: 3,
    exam_weight: 2,
    xp: 15,
    order: 4,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2023,
    paper: 'nov_p2',
    clues:
      "- Markovnikov's rule places the H atom on the carbon of the double bond that already has MORE hydrogen atoms attached.\n- The more substituted carbocation intermediate is the more stable one, and this is the one that forms preferentially.",
  },
];

const aiExplanation = {
  sub_questions: [
    {
      number: '4.1.1',
      marks: 2,
      clues: '- Cracking breaks bonds within a molecule, it does not join molecules together.\n- The products of cracking are always shorter/smaller than the starting molecule.',
      approach: '- Recall what cracking does to a hydrocarbon molecule.\n- State the definition in terms of chain length and usefulness of the products.',
      solution: '1. Cracking is the chemical process in which longer-chain hydrocarbon (alkane) molecules are broken down.\n2. The products are shorter, more useful molecules.',
    },
    {
      number: '4.1.2',
      marks: 3,
      clues: '- Balance the carbon atoms on both sides of the equation first.\n- Use the same balancing to check the hydrogen atom count on both sides.',
      approach: '- Count carbon atoms on the left (16) and match them against the three products on the right.\n- Once the carbon split is fixed, use the alkane/alkene general formulas to find the missing hydrogen subscripts.',
      solution:
        '1. Carbon balance: 16 = 6 + 6 + 2y, so y = 2.\n2. C₆H₁₄ (given) is a saturated alkane; the remaining fragment C₆Hₓ must also be an alkane (its bonds are all used up by the C₆H₁₄ and 2C₂H₄ fragments), so x = 14 − 2 = 12.\n3. C₂H₄ is a stable alkene, so z = 4.\n4. x = 12, y = 2, z = 4.',
    },
    {
      number: '4.1.3',
      marks: 3,
      clues: '- Complete combustion of a hydrocarbon produces only CO₂ and H₂O.\n- Balance carbon and hydrogen first, then balance oxygen last.',
      approach: '- Write the unbalanced equation for C₆H₁₄ burning in O₂ to form CO₂ and H₂O.\n- Balance C, then H, then O, using the smallest whole-number coefficients.',
      solution: '1. Unbalanced: C₆H₁₄ + O₂ → CO₂ + H₂O.\n2. Balancing C and H first: C₆H₁₄ + O₂ → 6CO₂ + 7H₂O.\n3. Balancing O (6×2 + 7 = 19 O atoms needed) and doubling throughout for whole numbers: 2C₆H₁₄ + 19O₂ → 12CO₂ + 14H₂O.',
    },
    {
      number: '4.2.1',
      marks: 2,
      clues: '- Positional isomers share both their molecular formula and their functional group.\n- The only thing that differs between positional isomers is WHERE something is attached on the parent chain.',
      approach: '- Recall the definition of positional isomers.\n- State what stays the same and what differs between them.',
      solution: '1. Positional isomers are compounds with the same molecular formula.\n2. They differ only in the position of the side chain, substituent, or functional group on the parent chain.',
    },
    {
      number: '4.2.2',
      marks: 1,
      clues: '- HCl adds across the C=C double bond of the alkene in reaction I.\n- No atoms are lost from the alkene or from HCl in this reaction — they combine into one larger product.',
      approach: '- Identify what type of reaction occurs when HCl adds across a C=C double bond.\n- Name this reaction type.',
      solution: '1. HCl adds across the C=C double bond of the pentene in reaction I, with no atoms lost.\n2. This is an addition reaction (specifically, hydrohalogenation/hydrochlorination).',
    },
    {
      number: '4.2.3',
      marks: 3,
      clues: '- B is the positional isomer of A formed when HCl adds Cl to the OTHER carbon of the original C=C double bond.\n- Compound A (from 4.2.4/4.2.5) has its Cl on the second carbon of the chain — B has it on the third.',
      approach: '- Identify the 5-carbon parent chain.\n- Place the Cl atom on the third carbon (the position not used by isomer A) and fill in all remaining bonds with H atoms.',
      solution: '1. The parent chain is a straight 5-carbon chain (pentane).\n2. Isomer B has the Cl atom bonded to the third carbon of this chain.\n3. The full structural formula shows all C-C and C-H bonds explicitly, giving 3-chloropentane, CH₃CH₂CHClCH₂CH₃.',
    },
    {
      number: '4.2.4',
      marks: 1,
      clues: '- Reaction II reacts A with water/heat to form an alcohol.\n- Substituting an -OH group for the halogen atom in a haloalkane releases the halogen as the corresponding hydrogen halide.',
      approach: "- Identify A's halogen atom.\n- Determine what small inorganic molecule is released when that halogen is substituted by -OH.",
      solution: '1. A is a chloroalkane, and reaction II substitutes its Cl atom with an -OH group using water.\n2. The Cl atom is released as HCl.\n3. X = HCl.',
    },
    {
      number: '4.2.5',
      marks: 1,
      clues: '- Reaction III converts an alcohol into an alkene by removing a water molecule.\n- This type of reaction (elimination of water from an alcohol) needs a strong dehydrating acid catalyst, with heat.',
      approach: '- Identify reaction III as the dehydration of an alcohol.\n- Recall which reagent is used to dehydrate an alcohol to an alkene.',
      solution: '1. Reaction III removes a water molecule from the alcohol to form an alkene — this is acid-catalysed dehydration.\n2. The reagent needed is concentrated sulphuric acid, H₂SO₄ (or concentrated phosphoric acid, H₃PO₄), with heat.',
    },
    {
      number: '4.2.6',
      marks: 1,
      clues: '- Converting A directly to the same alkene (without going via the alcohol) also removes HCl rather than H₂O.\n- This is a base-mediated elimination, which needs a different kind of reagent from reaction III.',
      approach: '- Identify what needs to be removed from A to form the alkene directly.\n- Recall the reagent (besides heat) needed to eliminate a hydrogen halide from a haloalkane.',
      solution: '1. Converting A directly to the alkene removes HCl (dehydrohalogenation), not H₂O.\n2. Besides heat, this needs a concentrated strong base (NaOH or KOH) dissolved in ethanol.',
    },
    {
      number: '4.2.7',
      marks: 2,
      clues: '- This reaction removes two atoms/groups from adjacent carbons to form a double bond.\n- The specific group being removed here is a hydrogen halide.',
      approach: '- Identify the general reaction type for forming a double bond by removing atoms from adjacent carbons.\n- Name the more specific term for eliminating a hydrogen halide in particular.',
      solution: '1. Forming a C=C double bond by removing atoms from adjacent carbons is an elimination reaction.\n2. Since the specific group removed is HCl, this is more precisely called dehydrohalogenation (dehydrochlorination).',
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
