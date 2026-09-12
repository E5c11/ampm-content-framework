#!/usr/bin/env node
/**
 * DBE Physical Sciences: Chemistry P2 — November 2023 — Question 1, Part 1 (order 1)
 * MCQ items 1.1–1.3 — Organic Molecules (saturated hydrocarbon recognition, alcohol
 * classification, hydrolysis reaction identification).
 *
 * First lesson of this paper's Q1 knowledge-area clustering (5 clusters, mirroring the
 * 2025 nov_p2 paper's already-established shape — see subjects/dbe-chemistry.md).
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
  tags: ['organic_molecules', 'homologous_series', 'alcohols', 'hydrolysis'],
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
      'A straight-chain, saturated alkane has 8 carbon atoms in one molecule. Using the general formula for alkanes, calculate the number of hydrogen atoms in one molecule of this compound: []',
    metadata: ['Number of H atoms = ', '[ ]'],
    answer: ['18', '', '', '', ''],
    presentation: 'fitb',
    type: 'calc',
    unit: 'matter_materials',
    topic: 'organic_molecules',
    subtopic: 'homologous_series_classification',
    skills: ['homologous_series_recognition'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2023,
    paper: 'nov_p2',
    clues:
      '- Every homologous series shares one general formula linking carbon count to hydrogen count.\n- For alkanes, each extra carbon atom in the chain adds exactly two extra hydrogen atoms.',
  },
  {
    name: 'Question 2',
    question: 'Match each alcohol classification to the number of carbon atoms bonded to the carbon that carries the −OH group.',
    metadata: [
      'A - Primary alcohol',
      'B - Secondary alcohol',
      'C - Tertiary alcohol',
      '1 - The carbon bonded to the −OH group is attached to ONE other carbon atom',
      '2 - The carbon bonded to the −OH group is attached to TWO other carbon atoms',
      '3 - The carbon bonded to the −OH group is attached to THREE other carbon atoms',
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
    xp: 15,
    order: 2,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2023,
    paper: 'nov_p2',
    clues:
      "- The classification depends only on how many OTHER carbon atoms are directly bonded to the −OH-bearing carbon, not on the total size of the molecule.\n- Going from primary to tertiary, this count of attached carbons increases by one each step.",
  },
  {
    name: 'Question 3',
    question: 'Select ALL of the following equations that represent a HYDROLYSIS reaction.',
    metadata: [
      'CH₃CH₂CH₂Br(ℓ) + H₂O(ℓ) → CH₃CH₂CH₂OH(ℓ) + HBr(aq)',
      'CH₃COOCH₃(ℓ) + H₂O(ℓ) → CH₃COOH(aq) + CH₃OH(ℓ)',
      'CH₂=CH₂(g) + H₂O(g) → CH₃CH₂OH(ℓ)',
      'CH₃CH₂OH(ℓ) + HBr(aq) → CH₃CH₂Br(ℓ) + H₂O(ℓ)',
      '',
    ],
    answer: ['CH₃CH₂CH₂Br(ℓ) + H₂O(ℓ) → CH₃CH₂CH₂OH(ℓ) + HBr(aq)', 'CH₃COOCH₃(ℓ) + H₂O(ℓ) → CH₃COOH(aq) + CH₃OH(ℓ)', '', '', ''],
    presentation: 'multi_select',
    type: 'application',
    unit: 'matter_materials',
    topic: 'organic_molecules',
    subtopic: 'substitution_elimination_reactions',
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
      '- Hydrolysis needs water as a REACTANT that breaks a bond in the organic compound to form two products.\n- A reaction where water only appears as a PRODUCT, or where water simply adds across a double bond, is not hydrolysis.',
  },
  {
    name: 'Question 4',
    question:
      'A student adds bromine water to two colourless hydrocarbon samples, P and Q, in test tubes kept away from light. Sample P decolourises the bromine water within a few seconds. Sample Q shows no colour change even after standing for several minutes. Which ONE of the following conclusions is correct?',
    metadata: [
      'P is saturated and Q is unsaturated',
      'Both P and Q are unsaturated',
      'P is unsaturated and Q is saturated',
      'Both P and Q are saturated',
      '',
    ],
    answer: ['P is unsaturated and Q is saturated', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'matter_materials',
    topic: 'organic_molecules',
    subtopic: 'alkene_addition_reactions',
    skills: ['unsaturation_testing'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2023,
    paper: 'nov_p2',
    clues:
      "- An unsaturated hydrocarbon reacts rapidly with bromine water in an addition reaction, without needing light.\n- A saturated hydrocarbon only reacts with bromine by substitution, which needs light/UV and is much slower.",
  },
  {
    name: 'Question 5',
    question:
      'Propanoic acid reacts with ethanol in the presence of a catalyst to form an ester and water. If the resulting ester is then heated with water in the presence of a strong acid catalyst, which pair of compounds will re-form?',
    metadata: ['Propanol and ethanoic acid', 'Propanoic acid and ethane', 'Propanoic acid and ethanol', 'Propene and ethanol', ''],
    answer: ['Propanoic acid and ethanol', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'matter_materials',
    topic: 'organic_molecules',
    subtopic: 'esterification_reactions',
    skills: ['esterification', 'reaction_type_identification'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 5,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2023,
    paper: 'nov_p2',
    clues:
      '- Hydrolysis of an ester is the exact reverse of the esterification reaction that formed it.\n- The acid and alcohol that reform are the same two compounds that originally reacted — nothing is swapped or converted further.',
  },
];

const aiExplanation = {
  sub_questions: [
    {
      number: '1.1',
      marks: 2,
      clues:
        '- A saturated hydrocarbon contains only single bonds between carbon atoms.\n- Compare each molecular formula against the general formula for alkanes.',
      approach:
        '- Work out how many hydrogen atoms a saturated (alkane) chain of each carbon count should have.\n- Match this against the four given formulae.',
      solution:
        '1. The general formula for alkanes (saturated, straight-chain hydrocarbons) is CₙH₂ₙ₊₂.\n2. For C₅, a saturated chain needs 2(5)+2 = 12 H atoms, not 8 or 10 — so C₅H₈ and C₅H₁₀ are unsaturated.\n3. For C₆, a saturated chain needs 2(6)+2 = 14 H atoms, not 12 — so C₆H₁₂ is unsaturated.\n4. C₆H₁₄ matches 2(6)+2 = 14 exactly, so it is the saturated hydrocarbon.\n5. The correct answer is D: C₆H₁₄.',
    },
    {
      number: '1.2',
      marks: 2,
      clues:
        '- A secondary alcohol has the −OH-bearing carbon attached to exactly two other carbon atoms.\n- Two of the four options are not alcohols at all — check the functional group first.',
      approach:
        '- Eliminate any compound that is not an alcohol (no −OH group).\n- For the remaining alcohols, count how many carbon atoms are bonded to the −OH-bearing carbon.',
      solution:
        '1. C(CH₃)₃OH has its −OH carbon attached to three other carbons — a tertiary alcohol.\n2. CH₃(CH₂)₃OH has its −OH carbon attached to only one other carbon (at the end of the chain) — a primary alcohol.\n3. CH₃(CH₂)₂CHO is an aldehyde, not an alcohol at all.\n4. CH₃CH₂CH(OH)CH₃ has its −OH carbon attached to two other carbons (one on each side) — a secondary alcohol.\n5. The correct answer is D.',
    },
    {
      number: '1.3',
      marks: 2,
      clues:
        '- Hydrolysis is a reaction in which water is a REACTANT that splits a compound into two products.\n- Check each equation for which side water appears on, and whether water is adding across a double bond instead.',
      approach:
        '- Identify which equation has water as a reactant reacting with an organic compound to give two separate products.\n- Rule out reactions where water is a product, or where water adds across a C=C bond (hydration, not hydrolysis).',
      solution:
        '1. Option A: a haloalkane reacts WITH water to form an alcohol and HBr — water is a reactant splitting the C−Br bond. This is hydrolysis.\n2. Option B is the reverse reaction (alcohol + HBr → haloalkane + water) — water is a PRODUCT here, not a reactant, so this is not hydrolysis.\n3. Option C is hydration (water adding across a C=C double bond), a different reaction type from hydrolysis.\n4. Option D is hydrogenation (H₂ adding across a C=C double bond), not hydrolysis at all.\n5. The correct answer is A.',
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
