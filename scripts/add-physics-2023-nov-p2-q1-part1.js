#!/usr/bin/env node
/**
 * DBE Physical Sciences: Chemistry P2 — November 2023 — Question 1, Part 1 (order 1)
 * MCQ items 1.1–1.3 — Organic Molecules (saturated/unsaturated classification,
 * alcohol classification, hydrolysis vs esterification).
 *
 * First lesson of subjects/dbe-chemistry.md's Paper structure mapping applied to the
 * 2023 paper: Q1's ten MCQs cluster into 5 knowledge-area lessons. This is Part 1 of 5.
 *
 *   node tools/validate-questions.js --script scripts/add-physics-2023-nov-p2-q1-part1.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-physics-2023-nov-p2-q1-part1.js --dry-run
 *   node scripts/add-physics-2023-nov-p2-q1-part1.js
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
  name: 'Question 1.1–1.3',
  syllabus: 'dbe',
  subject: 'physics',
  year: 2023,
  paper: 'nov_p2',
  order: 1,
  content_tier: 'free',
  has_video: false,
  xp: 30,
  tags: ['organic_molecules', 'alcohols', 'hydrolysis'],
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
    question: 'Arrange the following straight-chain hydrocarbons in order of INCREASING degree of unsaturation (least unsaturated first).',
    metadata: ['Pent-1-yne (C₅H₈)', 'Pentane (C₅H₁₂)', 'Pent-1-ene (C₅H₁₀)'],
    answer: ['Pentane (C₅H₁₂)', 'Pent-1-ene (C₅H₁₀)', 'Pent-1-yne (C₅H₈)'],
    presentation: 'ordering',
    type: 'application',
    unit: 'matter_materials',
    topic: 'organic_molecules',
    subtopic: 'homologous_series_classification',
    skills: ['homologous_series_recognition', 'unsaturation_testing'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2023,
    paper: 'nov_p2',
    clues:
      "- Degree of unsaturation counts a double bond as 1 and a triple bond as 2, on top of the saturated (zero) case.\n- A saturated hydrocarbon's formula fits CₙH₂ₙ₊₂; each degree of unsaturation removes a further two H atoms from that formula.",
  },
  {
    name: 'Question 2',
    question: 'Match each alcohol below to its correct classification.',
    metadata: [
      'A - Propan-1-ol (CH₃CH₂CH₂OH)',
      'B - Propan-2-ol (CH₃CH(OH)CH₃)',
      'C - 2-Methylpropan-2-ol ((CH₃)₃COH)',
      '1 - Primary alcohol',
      '2 - Secondary alcohol',
      '3 - Tertiary alcohol',
    ],
    answer: ['A-1', 'B-2', 'C-3'],
    presentation: 'match',
    type: 'definition',
    unit: 'matter_materials',
    topic: 'organic_molecules',
    subtopic: 'alcohol_classification',
    skills: ['alcohol_classification_hierarchy'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2023,
    paper: 'nov_p2',
    clues:
      '- Classification depends on how many other carbon atoms are directly bonded to the carbon bearing the -OH group.\n- A carbon bonded to only one other carbon gives the simplest classification; a carbon bonded to three other carbons gives the most substituted one.',
  },
  {
    name: 'Question 3',
    question:
      'Propyl ethanoate can be broken down by reaction with water into ethanoic acid and propan-1-ol. Which term correctly classifies this breakdown reaction, and how does it relate to the reaction that forms propyl ethanoate from these same two products?',
    metadata: [
      'Substitution; unrelated to the reaction that forms propyl ethanoate',
      'Hydrolysis; it is the reverse of esterification',
      'Esterification; it is the reverse of hydrolysis',
      'Hydrolysis; it is the same reaction as esterification',
      '',
    ],
    answer: ['Hydrolysis; it is the reverse of esterification', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'matter_materials',
    topic: 'organic_molecules',
    subtopic: 'esterification_reactions',
    skills: ['esterification', 'reaction_type_identification'],
    difficulty: 3,
    exam_weight: 2,
    xp: 15,
    order: 3,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2023,
    paper: 'nov_p2',
    clues:
      "- Splitting an ester into an acid and an alcohol involves reacting the ester with water — check which of the four listed reaction types adds a water molecule across a bond, rather than removing one.\n- Think about what happens to a carboxylic acid and an alcohol when they react together to form an ester: is water absorbed or released, and how does that compare to what's described here?",
  },
  {
    name: 'Question 4',
    question: 'Select ALL of the compounds below that are SATURATED hydrocarbons.',
    metadata: ['C₆H₁₄', 'C₆H₁₂', 'C₅H₈', 'C₇H₁₆', ''],
    answer: ['C₆H₁₄', 'C₇H₁₆', '', '', ''],
    presentation: 'multi_select',
    type: 'definition',
    unit: 'matter_materials',
    topic: 'organic_molecules',
    subtopic: 'homologous_series_classification',
    skills: ['homologous_series_recognition', 'unsaturation_testing'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2023,
    paper: 'nov_p2',
    clues:
      '- A saturated hydrocarbon contains only single bonds between carbon atoms, giving the general formula CₙH₂ₙ₊₂.\n- Check each formula against this general formula for its own number of carbon atoms — a shortfall of two or more hydrogens signals at least one double or triple bond.',
  },
  {
    name: 'Question 5',
    question:
      'Each of the alkenes below undergoes an acid-catalysed addition reaction with water to form an alcohol as the major product. Select ALL of the alkenes for which this major product is a SECONDARY alcohol.',
    metadata: ['But-1-ene (CH₂=CHCH₂CH₃)', 'But-2-ene (CH₃CH=CHCH₃)', '2-Methylpropene ((CH₃)₂C=CH₂)', 'Ethene (CH₂=CH₂)', ''],
    answer: ['But-1-ene (CH₂=CHCH₂CH₃)', 'But-2-ene (CH₃CH=CHCH₃)', '', '', ''],
    presentation: 'multi_select',
    type: 'application',
    unit: 'matter_materials',
    topic: 'organic_molecules',
    subtopic: 'alkene_addition_reactions',
    skills: ['alcohol_classification_hierarchy'],
    difficulty: 3,
    exam_weight: 2,
    xp: 15,
    order: 5,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2023,
    paper: 'nov_p2',
    clues:
      "- Markovnikov's rule places the -OH group on the more substituted carbon of the C=C double bond (the carbon with more alkyl groups already attached).\n- A symmetrical alkene has only one possible addition product; an unsymmetrical alkene can give two, with one usually favoured.",
  },
];

const aiExplanation = {
  sub_questions: [
    {
      number: '1.1',
      marks: 2,
      clues:
        "- A saturated hydrocarbon (alkane) has the general formula CₙH₂ₙ₊₂, with no double or triple bonds.\n- Check each option's hydrogen count against this formula for its own number of carbon atoms.",
      approach:
        "- Write out CₙH₂ₙ₊₂ for each option's carbon count and compare it to the given formula.\n- Eliminate any option whose hydrogen count is too low to be a simple alkane.",
      solution:
        '1. For 5 carbons, a saturated alkane is C₅H₁₂; C₅H₈ (option A) is short by 4 H atoms — 2 degrees of unsaturation, not saturated.\n2. For 6 carbons, a saturated alkane is C₆H₁₄; C₆H₁₂ (option C) is short by 2 H atoms — 1 degree of unsaturation (an alkene), not saturated.\n3. C₆H₁₄ (option D) matches CₙH₂ₙ₊₂ for n = 6 exactly, with no double or triple bonds.\n4. The correct answer is D: C₆H₁₄.',
    },
    {
      number: '1.2',
      marks: 2,
      clues:
        '- A secondary alcohol has its -OH group on a carbon bonded to exactly two other carbon atoms.\n- One option is not an alcohol at all — check for the -OH group specifically, not just any oxygen-containing group.',
      approach:
        '- Rule out any option that is not an alcohol (no -OH group present).\n- For the remaining alcohols, count how many carbon atoms are bonded to the carbon carrying the -OH group.',
      solution:
        '1. Option C, CH₃(CH₂)₂CHO, is an aldehyde (–CHO), not an alcohol — eliminated.\n2. Option A, C(CH₃)₃OH, has its -OH carbon bonded to three other carbons — a tertiary alcohol.\n3. Option B, CH₃(CH₂)₃OH, has its -OH carbon (the end carbon) bonded to only one other carbon — a primary alcohol.\n4. Option D, CH₃CH₂CH(OH)CH₃, has its -OH carbon bonded to two other carbons — a secondary alcohol.\n5. The correct answer is D.',
    },
    {
      number: '1.3',
      marks: 2,
      clues:
        '- Hydrolysis is a reaction in which a compound reacts with water and splits into two products.\n- One of these reactions adds water across a C=C double bond instead — that is hydration, not hydrolysis, even though water is also a reactant there.',
      approach:
        '- Identify which reactions have water, H₂O, as a reactant.\n- Of those, decide which one splits a single starting compound into two separate products, rather than adding water across a double bond.',
      solution:
        "1. Reaction C has H₂O adding across ethene's C=C double bond — this is hydration, not hydrolysis.\n2. Reaction D uses H₂ (hydrogen gas), not water, as the reactant — this is hydrogenation.\n3. Reaction B has water as a PRODUCT, not a reactant — this is the reverse process, forming a haloalkane.\n4. Reaction A has bromoethane reacting WITH water, splitting into two products (ethanol and HBr) — this is hydrolysis.\n5. The correct answer is A.",
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
