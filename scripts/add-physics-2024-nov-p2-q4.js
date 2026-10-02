#!/usr/bin/env node
/**
 * DBE Physical Sciences: Chemistry P2 — November 2024 — Question 4 (order 8)
 * Organic Molecules — cracking, haloalkane classification, substitution/elimination/
 * addition reactions and conditions, Markovnikov and major/minor products. 22 marks,
 * one continuous flow diagram (U → W + T; W → 1-bromobutane → R → S → T).
 *
 *   node tools/validate-questions.js --script scripts/add-physics-2024-nov-p2-q4.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-physics-2024-nov-p2-q4.js --dry-run
 *   node scripts/add-physics-2024-nov-p2-q4.js
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
  name: 'Question 4',
  syllabus: 'dbe',
  subject: 'physics',
  year: 2024,
  paper: 'nov_p2',
  order: 8,
  content_tier: 'free',
  has_video: false,
  xp: 60,
  tags: ['organic_molecules', 'cracking', 'isomers'],
  question_image_urls: [`${PAPER}/q8/question_1.png`, `${PAPER}/q8/question_2.png`],
  memo_image_urls: [`${PAPER}/q8/memo_1.png`, `${PAPER}/q8/memo_2.png`, `${PAPER}/q8/memo_3.png`],
  exam_question_marks: 22,
  supplementary_materials: [FORMULA_SHEET],
};

const questions = [
  {
    name: 'Question 1',
    question: 'An alkane, C₉H₂₀, is cracked to form propene and ONE other hydrocarbon, W, as the only products. Which ONE of the following is the molecular formula of W?',
    metadata: ['C₆H₁₂', 'C₇H₁₆', 'C₆H₁₀', 'C₆H₁₄', ''],
    answer: ['C₆H₁₄', '', '', '', ''],
    presentation: 'multiple_choice', type: 'application',
    unit: 'matter_materials', topic: 'organic_molecules', subtopic: 'cracking_reactions',
    skills: ['cracking_stoichiometry'],
    difficulty: 2, exam_weight: 2, xp: 10, order: 1,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p2',
    clues: '- Write the molecular formula of propene first.\n- Atoms are conserved: subtract the C and H atoms of propene from C₉H₂₀.',
  },
  {
    name: 'Question 2',
    question: 'Which ONE of the following haloalkanes is a SECONDARY haloalkane?',
    metadata: ['CH₃CH₂CH₂CH₂Br', '(CH₃)₃CBr', 'CH₃CHBrCH₂CH₃', 'CH₃CH(CH₃)CH₂Br', ''],
    answer: ['CH₃CHBrCH₂CH₃', '', '', '', ''],
    presentation: 'multiple_choice', type: 'application',
    unit: 'matter_materials', topic: 'organic_molecules', subtopic: 'substitution_elimination_reactions',
    skills: ['haloalkane_classification'],
    difficulty: 2, exam_weight: 2, xp: 10, order: 2,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p2',
    clues: '- Find the C atom that carries the Br, then count how many OTHER C atoms are bonded to it.\n- A branch elsewhere in the chain does not change this count.',
  },
  {
    name: 'Question 3',
    question: 'Match each conversion to the name of the reaction that achieves it.',
    metadata: [
      'A - Propane + Br₂ (in sunlight) → 1-bromopropane',
      'B - 1-bromopropane + concentrated NaOH in ethanol, heated → propene',
      'C - Propene + HBr → 2-bromopropane',
      'D - 1-bromopropane + dilute aqueous NaOH, warmed → propan-1-ol',
      '1 - Hydrohalogenation',
      '2 - Hydrolysis',
      '3 - Halogenation',
      '4 - Dehydrohalogenation',
    ],
    answer: ['A-3', 'B-4', 'C-1', 'D-2'],
    presentation: 'match', type: 'application',
    unit: 'matter_materials', topic: 'organic_molecules', subtopic: 'substitution_elimination_reactions',
    skills: ['reaction_type_identification', 'reaction_condition_identification'],
    difficulty: 3, exam_weight: 3, xp: 15, order: 3,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p2',
    clues: '- Decide first whether each conversion ADDS to a double bond, REMOVES a small molecule, or SWAPS one atom or group for another.\n- With NaOH, the solvent and conditions decide the product: strong heat in ethanol versus warm dilute water.',
  },
  {
    name: 'Question 4',
    question: 'But-1-ene, CH₂=CHCH₂CH₃, reacts with HBr. What is the IUPAC name of the MAJOR organic product?',
    metadata: ['1-bromobutane', '2-bromobutane', '1,2-dibromobutane', '2-bromobut-1-ene', ''],
    answer: ['2-bromobutane', '', '', '', ''],
    presentation: 'multiple_choice', type: 'application',
    unit: 'matter_materials', topic: 'organic_molecules', subtopic: 'alkene_addition_reactions',
    skills: ['reaction_type_identification', 'iupac_naming_application'],
    difficulty: 3, exam_weight: 2, xp: 10, order: 4,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p2',
    clues: '- HBr adds ONE H and ONE Br across the double bond, so the product is saturated.\n- In the major product, the H goes to the double-bond carbon that already has MORE H atoms.',
  },
  {
    name: 'Question 5',
    question: '2-bromobutane, CH₃CHBrCH₂CH₃, is heated strongly with concentrated NaOH dissolved in ethanol. Select ALL the organic compounds that can form in this reaction.',
    metadata: ['Butan-2-ol', 'But-1-ene', 'Butane', 'But-2-ene', '2-methylpropene'],
    answer: ['But-1-ene', 'But-2-ene', '', '', ''],
    presentation: 'multi_select', type: 'application',
    unit: 'matter_materials', topic: 'organic_molecules', subtopic: 'substitution_elimination_reactions',
    skills: ['reaction_type_identification', 'positional_isomerism'],
    difficulty: 4, exam_weight: 3, xp: 15, order: 5,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p2',
    clues: '- These conditions remove HBr: an H atom leaves from a carbon NEXT to the one carrying Br.\n- 2-bromobutane has a neighbouring carbon on EACH side; the carbon skeleton itself is not rearranged.',
  },
];

const aiExplanation = {
  sub_questions: [
    {
      number: '4.1',
      marks: 2,
      clues: '- Cracking breaks large molecules into smaller ones.\n- Name the type of starting compound and the type of products.',
      approach: '- State what is broken down.\n- State what it is broken into.',
      solution: '1. Cracking is the chemical process in which longer-chain hydrocarbon (alkane) molecules are broken down into shorter, more useful molecules.',
    },
    {
      number: '4.2',
      marks: 2,
      clues: '- The product of reaction II is CH₃CH₂CH₂CH₂Br.\n- Count the C atoms bonded to the C that carries the Br.',
      approach: '- Locate the C atom bonded to Br.\n- Classify by how many other C atoms are bonded to it, and give that as the reason.',
      solution: '1. Primary.\n2. Reason: the Br atom is bonded to a C atom that is bonded to only ONE other C atom.',
    },
    {
      number: '4.3.1',
      marks: 3,
      clues: '- Reaction II turns W into 1-bromobutane by substitution, so W has the same 4-carbon chain.\n- W must be the saturated hydrocarbon with that chain.',
      approach: '- Work backwards from CH₃CH₂CH₂CH₂Br: replace the Br with H.\n- Draw that alkane showing every bond.',
      solution: '1. Substitution swaps an H for Br without changing the chain, so W has four C atoms in a straight chain.\n2. W is butane, CH₃CH₂CH₂CH₃.\n3. Structural formula: four C atoms in a row, each end C bonded to three H atoms and each middle C bonded to two H atoms.',
    },
    {
      number: '4.3.2',
      marks: 1,
      clues: '- U cracks into W (butane) and T (C₄H₈) as the ONLY products.\n- Add up the atoms in the two products.',
      approach: '- Write the formulas of W and T.\n- Add the C and H atoms to get U.',
      solution: '1. W = C₄H₁₀ and T = C₄H₈.\n2. U = C₄H₁₀ + C₄H₈ = C₈H₁₈.',
    },
    {
      number: '4.4.1',
      marks: 1,
      clues: '- Reaction II converts an alkane into a bromoalkane.\n- The Br atom must come from somewhere.',
      approach: '- Identify the reagent that supplies Br to an alkane.\n- Give its name or formula.',
      solution: '1. Bromine, Br₂.',
    },
    {
      number: '4.4.2',
      marks: 1,
      clues: '- An H atom on the alkane is replaced by a Br atom.\n- No double bond is formed or broken.',
      approach: '- Decide whether atoms are added, removed or swapped.\n- Choose the matching reaction type.',
      solution: '1. Substitution (halogenation).',
    },
    {
      number: '4.4.3',
      marks: 1,
      clues: '- Alkanes are unreactive: the reaction with Br₂ needs an energy source.\n- One of the conditions involves light.',
      approach: '- Recall the condition for halogenation of an alkane.\n- Give ONE condition.',
      solution: '1. Ultraviolet light (sunlight) or heat.',
    },
    {
      number: '4.5',
      marks: 1,
      clues: '- Reaction III removes HBr from 1-bromobutane.\n- Name the elimination after what is removed.',
      approach: '- Identify the small molecule removed in reaction III.\n- Name that type of elimination.',
      solution: '1. Dehydrohalogenation (dehydrobromination).',
    },
    {
      number: '4.6.1',
      marks: 5,
      clues: '- R comes from eliminating HBr from 1-bromobutane, so the double bond must be at C1.\n- Reaction IV is an addition: choose the reagent that puts back H and Br.',
      approach: '- Draw R (but-1-ene) with all bonds.\n- Add HBr from the reagent list.\n- Draw the major product, 2-bromobutane (Br on the second C atom).',
      solution: '1. R is but-1-ene: CH₂=CH–CH₂–CH₃ (the only alkene that 1-bromobutane can form).\n2. The correct reagent from the list is HBr (hydrohalogenation).\n3. Equation with structural formulae: CH₂=CHCH₂CH₃ + HBr → CH₃CHBrCH₂CH₃ (2-bromobutane, S; 1-bromobutane is also accepted).\n4. All bonds and H atoms must be drawn for full marks.',
    },
    {
      number: '4.6.2',
      marks: 3,
      clues: '- Reaction V turns S back into an alkene, T, which is a positional isomer of R.\n- Choose the reagent that removes HBr.',
      approach: '- Pick concentrated NaOH from the reagent list.\n- Write S + NaOH → T + NaBr + H₂O with structural formulae, where T is but-2-ene.',
      solution: '1. Reagent: NaOH (concentrated, in ethanol, heated): elimination of HBr.\n2. CH₃CHBrCH₂CH₃ + NaOH → CH₃CH=CHCH₃ + NaBr + H₂O.\n3. T is but-2-ene, the positional isomer of R (but-1-ene).',
    },
    {
      number: '4.6.3',
      marks: 2,
      clues: '- T is C₄H₈ and is a POSITIONAL isomer of R (but-1-ene).\n- Only the position of the double bond differs.',
      approach: '- Move the double bond to the other possible position in a 4-carbon chain.\n- Name it with the position number.',
      solution: '1. T is but-2-ene. (The memo also accepts but-1-ene; "butene" without a number loses a mark.)',
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
