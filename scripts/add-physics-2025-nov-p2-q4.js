#!/usr/bin/env node
/**
 * DBE Physical Sciences: Chemistry P2 — November 2025 — Question 4 (order 8)
 * Organic Molecules — reaction types, cracking, addition reactions. 17 marks, one
 * continuous scenario (a three-reaction cycle T/W/R/S in 4.1, then cracking in 4.2).
 *
 *   node tools/validate-questions.js --script scripts/add-physics-2025-nov-p2-q4.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-physics-2025-nov-p2-q4.js --dry-run
 *   node scripts/add-physics-2025-nov-p2-q4.js
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
  name: 'Question 4',
  syllabus: 'dbe',
  subject: 'physics',
  year: 2025,
  paper: 'nov_p2',
  order: 8,
  content_tier: 'free',
  has_video: false,
  xp: 45,
  tags: ['organic_molecules', 'cracking'],
  question_image_urls: [`${PAPER}/q8/question_1.png`],
  memo_image_urls: [`${PAPER}/q8/memo_1.png`, `${PAPER}/q8/memo_2.png`],
  exam_question_marks: 17,
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
      'But-1-ene reacts with HBr(g) to form 2-bromobutane. Select ALL of the following that correctly name this type of reaction.',
    metadata: ['Addition', 'Substitution', 'Hydrohalogenation', 'Elimination', ''],
    answer: ['Addition', 'Hydrohalogenation', '', '', ''],
    presentation: 'multi_select',
    type: 'application',
    unit: 'matter_materials',
    topic: 'organic_molecules',
    subtopic: 'alkene_addition_reactions',
    skills: ['reaction_type_identification'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p2',
    clues:
      '- HBr adds across the C=C double bond, so no atom in the alkene is replaced by another.\n- The general reaction name and the specific name for adding a hydrogen halide are both correct here.',
  },
  {
    name: 'Question 2',
    question:
      '1-chloropropane is converted to propan-1-ol using NaOH. Which ONE of the following best describes the conditions needed for this substitution reaction?',
    metadata: [
      'Concentrated NaOH, heat, in ethanol (alcoholic) solvent',
      'Concentrated H₂SO₄, heat',
      'Dilute (aqueous) NaOH, heat',
      'UV light, no heat needed',
      '',
    ],
    answer: ['Dilute (aqueous) NaOH, heat', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'matter_materials',
    topic: 'organic_molecules',
    subtopic: 'substitution_elimination_reactions',
    skills: ['reaction_condition_identification'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p2',
    clues:
      "- To replace the halogen with an -OH group (substitution), the hydroxide ion needs to attack the carbon directly — this favours one particular solvent.\n- An alcoholic (ethanol) solvent with a strong base instead favours a different reaction on the same haloalkane.",
  },
  {
    name: 'Question 3',
    question:
      'Compound C₈H₁₈(ℓ) undergoes a cracking reaction according to the equation: C₈H₁₈(ℓ) → 2Y(g) + C₂H₆(g). Calculate the number of carbon atoms in one molecule of Y: []',
    metadata: ['Number of carbon atoms in Y = ', '[ ]'],
    answer: ['3', '', '', '', ''],
    presentation: 'fitb',
    type: 'calc',
    unit: 'matter_materials',
    topic: 'organic_molecules',
    subtopic: 'cracking_reactions',
    skills: ['cracking_stoichiometry'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p2',
    clues:
      '- The total number of carbon atoms on each side of the equation must balance.\n- C₂H₆ accounts for 2 of the 8 carbon atoms; the rest are shared equally between the two molecules of Y.',
  },
  {
    name: 'Question 4',
    question:
      'But-2-ene and butane are both bubbled separately into bromine water, Br₂(aq), in a darkened room (no UV light). Which ONE of the following correctly describes what will be observed?',
    metadata: [
      'Both will decolourise the bromine water at the same rate',
      'Butane will decolourise the bromine water quickly; but-2-ene will not react',
      'But-2-ene will decolourise the bromine water quickly; butane will not react without UV light',
      'Neither compound will react with bromine water in the dark',
      '',
    ],
    answer: ['But-2-ene will decolourise the bromine water quickly; butane will not react without UV light', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'matter_materials',
    topic: 'organic_molecules',
    subtopic: 'alkene_addition_reactions',
    skills: ['unsaturation_testing'],
    difficulty: 2,
    exam_weight: 1,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p2',
    clues:
      '- One of these two compounds has a C=C double bond and can undergo addition with Br₂ without needing UV light.\n- The other is a saturated alkane, which needs UV light to react with Br₂ (substitution).',
  },
];

const aiExplanation = {
  sub_questions: [
    {
      number: '4.1.1',
      marks: 2,
      clues: '- W is formed when HBr adds across the C=C double bond of T.\n- Reaction II shows W being hydrolysed by NaOH(aq) to give butan-2-ol — so W and butan-2-ol share the same carbon skeleton.',
      approach: '- Use reaction II (W → butan-2-ol) to identify where the halogen sits on the 4-carbon chain.\n- Name W as a bromobutane with the halogen at that position.',
      solution: '1. Reaction II converts W to butan-2-ol by substitution, so the Br in W is on carbon 2 of a butane chain.\n2. W is therefore 2-bromobutane.',
    },
    {
      number: '4.1.2',
      marks: 1,
      clues: '- Reaction II is a substitution: NaOH(aq) replaces the halogen on W with -OH.\n- The Na⁺ ion pairs with whichever halide ion is displaced.',
      approach: '- Identify which halogen is displaced from W and which ion it forms with Na⁺.',
      solution: '1. W is 2-bromobutane, so Br⁻ is displaced when NaOH(aq) reacts with it.\n2. R is NaBr.',
    },
    {
      number: '4.1.3',
      marks: 2,
      clues: '- Reaction I adds HBr(g) across a double bond, forming a single product with no atoms lost.\n- This reaction has both a general name and a more specific name describing exactly which reagent adds.',
      approach: '- Recognise that T + HBr → W with no byproduct is characteristic of one reaction category.\n- Give both the general and the specific name for this category.',
      solution: '1. HBr adds completely across the C=C double bond of T with no atoms removed — this is addition.\n2. Since the specific reagent is a hydrogen halide, this is more specifically called hydrohalogenation (hydrobromination).',
    },
    {
      number: '4.1.4',
      marks: 1,
      clues: '- Reaction III converts an alcohol (butan-2-ol) into an alkene (T) plus water — this is a dehydration (elimination) reaction.\n- Dehydrating an alcohol needs a strong dehydrating acid catalyst and heat.',
      approach: '- Recall which reagent is used to dehydrate an alcohol to an alkene.',
      solution: '1. Butan-2-ol loses water to form T — this is acid-catalysed dehydration.\n2. S is concentrated sulfuric acid (H₂SO₄) or concentrated phosphoric acid (H₃PO₄).',
    },
    {
      number: '4.1.5',
      marks: 2,
      clues: '- T reacts with HBr to give 2-bromobutane (reaction I), and T is also the dehydration product of butan-2-ol (reaction III).\n- Both of these clues point to the same 4-carbon alkene with the double bond between carbons 2 and 3.',
      approach: '- Use either reaction I (in reverse) or reaction III to identify the position of the double bond in T.\n- Draw the full structural formula, including all H atoms.',
      solution: '1. Dehydrating butan-2-ol removes water from carbons 2 and 3, forming a double bond there.\n2. T is but-2-ene: CH₃-CH=CH-CH₃.',
    },
    {
      number: '4.1.6',
      marks: 1,
      clues: '- Converting W (a haloalkane) to T (an alkene) in one step is an elimination reaction, not the substitution seen in reaction II.\n- Elimination reactions need a particular type and concentration of base, in a particular solvent, besides heat.',
      approach: '- Recall what additionally distinguishes elimination conditions from the substitution conditions used in reaction II.',
      solution: '1. Converting W to T is a dehydrohalogenation (elimination) reaction.\n2. Besides heat, this needs a concentrated strong base (e.g. concentrated NaOH/KOH/LiOH), typically in an alcoholic (ethanol) solvent.',
    },
    {
      number: '4.2.1',
      marks: 2,
      clues: '- Cracking breaks apart larger hydrocarbon molecules using heat (and sometimes a catalyst).\n- The products of cracking are always smaller than the starting molecule.',
      approach: '- Describe what kind of molecules cracking starts with and what happens to them.',
      solution: '1. Cracking is the chemical process/reaction in which longer-chain hydrocarbon (alkane) molecules are broken down into shorter (more useful) molecules.',
    },
    {
      number: '4.2.2',
      marks: 1,
      clues: '- One of the two cracking products, X, contains a C=C double bond.\n- Bromine water reacts with unsaturated compounds by addition, removing the reddish-brown colour of Br₂.',
      approach: '- Identify which of the two products can react with Br₂(aq) and what visible change this causes.',
      solution: '1. X (the alkene product) reacts with Br₂(aq) by addition.\n2. The reddish-brown bromine water is decolourised (fades to colourless).',
    },
    {
      number: '4.2.3',
      marks: 2,
      clues: '- The carbon and hydrogen atoms on both sides of the cracking equation must balance.\n- C₄H₁₀ accounts for 4 of the 10 carbon atoms in C₁₀H₂₂; the products together must also balance the hydrogen count, which tells you whether X is saturated or unsaturated.',
      approach: '- Use a carbon balance to find how many carbons are in X.\n- Use a hydrogen balance to decide whether X is an alkane or an alkene, then draw its structural formula.',
      solution: '1. C₁₀H₂₂ → 2X + C₄H₁₀: carbon balance gives 2 × (carbons in X) = 10 − 4 = 6, so X has 3 carbons.\n2. A hydrogen balance shows X must be unsaturated (an alkene) for the equation to balance.\n3. X is propene: CH₂=CH-CH₃.',
    },
    {
      number: '4.2.4',
      marks: 3,
      clues: '- One of X and C₄H₁₀ is saturated and one is unsaturated.\n- Only one of the two reaction mechanisms available here (addition vs substitution) proceeds readily without UV light.',
      approach: '- Identify which compound is unsaturated and can undergo addition with Br₂(aq) directly.\n- Explain why the saturated compound reacts much more slowly under these conditions.',
      solution: '1. X (propene) is unsaturated and reacts with Br₂(aq) by addition, which proceeds quickly without UV light.\n2. C₄H₁₀ (butane) is saturated and can only react with Br₂ by substitution, which requires UV light to proceed at a reasonable rate.\n3. X reacts faster with Br₂(aq).',
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
