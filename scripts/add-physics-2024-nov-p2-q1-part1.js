#!/usr/bin/env node
/**
 * DBE Physical Sciences: Chemistry P2 — November 2024 — Question 1, Part 1 (order 1)
 * MCQ items 1.1–1.3 — Organic Molecules (hydrogen bonding, general formula of
 * carboxylic acids, elimination then hydrogenation sequence).
 *
 * Q1's ten MCQs cluster into 5 knowledge-area lessons (subjects/dbe-chemistry.md).
 * This is Part 1 of 5.
 *
 *   node tools/validate-questions.js --script scripts/add-physics-2024-nov-p2-q1-part1.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-physics-2024-nov-p2-q1-part1.js --dry-run
 *   node scripts/add-physics-2024-nov-p2-q1-part1.js
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
  name: 'Question 1.1–1.3',
  syllabus: 'dbe',
  subject: 'physics',
  year: 2024,
  paper: 'nov_p2',
  order: 1,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['organic_molecules', 'intermolecular_forces', 'homologous_series'],
  question_image_urls: [`${PAPER}/q1/question_1.png`],
  memo_image_urls: [`${PAPER}/q1/memo_1.png`],
  exam_question_marks: 6,
  supplementary_materials: [FORMULA_SHEET],
};

const questions = [
  {
    name: 'Question 1',
    question: 'Select ALL the compounds below whose molecules form hydrogen bonds with EACH OTHER in the pure liquid.',
    metadata: ['CH₃CH₂CH₂CHO', 'CH₃CH₂COOH', 'CH₃COCH₂CH₃', 'CH₃CH(OH)CH₃', 'CH₃COOCH₂CH₃'],
    answer: ['CH₃CH₂COOH', 'CH₃CH(OH)CH₃', '', '', ''],
    presentation: 'multi_select', type: 'application',
    unit: 'matter_materials', topic: 'organic_molecules', subtopic: 'physical_properties_organic',
    skills: ['intermolecular_force_comparison', 'functional_group_identification'],
    difficulty: 2, exam_weight: 2, xp: 10, order: 1,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p2',
    clues: '- A hydrogen bond between two identical molecules needs an H atom bonded DIRECTLY to an O atom in the molecule.\n- An O atom alone (as in C=O or C–O–C) can accept a hydrogen bond, but cannot donate one to a molecule like itself.',
  },
  {
    name: 'Question 2',
    question: 'An organic compound has the molecular formula C₅H₁₀O₂. To which pair of homologous series could this compound belong?',
    metadata: [
      'Aldehydes or ketones',
      'Alcohols or esters',
      'Carboxylic acids or ketones',
      'Carboxylic acids or esters',
      '',
    ],
    answer: ['Carboxylic acids or esters', '', '', '', ''],
    presentation: 'multiple_choice', type: 'application',
    unit: 'matter_materials', topic: 'organic_molecules', subtopic: 'homologous_series_classification',
    skills: ['homologous_series_recognition', 'isomer_classification'],
    difficulty: 3, exam_weight: 2, xp: 10, order: 2,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p2',
    clues: '- Count the oxygen atoms first: which functional groups contain TWO O atoms?\n- Then check the H count: CₙH₂ₙ with two O atoms fits only series that have one C=O and no C=C.',
  },
  {
    name: 'Question 3',
    question: 'Study the two reactions. Reaction 1: 3-methylbutan-2-ol, heated with concentrated H₂SO₄ → compound P (major product) + H₂O. Reaction 2: compound P + H₂ (Pt catalyst) → compound Q. Which ONE of the following gives the correct IUPAC names of P and Q?',
    metadata: [
      'P: 3-methylbut-1-ene; Q: 2-methylbutane',
      'P: 2-methylbut-2-ene; Q: 3-methylbutan-2-ol',
      'P: 2-methylbut-2-ene; Q: 2-methylbutane',
      'P: 3-methylbut-1-ene; Q: 2-methylbutan-2-ol',
      '',
    ],
    answer: ['P: 2-methylbut-2-ene; Q: 2-methylbutane', '', '', '', ''],
    presentation: 'multiple_choice', type: 'application',
    unit: 'matter_materials', topic: 'organic_molecules', subtopic: 'substitution_elimination_reactions',
    skills: ['reaction_type_identification', 'iupac_naming_application'],
    difficulty: 4, exam_weight: 3, xp: 15, order: 3,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p2',
    clues: '- Reaction 1 is a dehydration: the major product loses its H from the neighbouring C atom that has the FEWEST H atoms.\n- Reaction 2 adds H₂ across the double bond, so Q has no functional group left; name it by its longest chain.',
  },
  {
    name: 'Question 4',
    question: 'Match each type of organic reaction to the inorganic reagent and condition it needs.',
    metadata: [
      'A - Dehydration of an alcohol',
      'B - Hydrogenation of an alkene',
      'C - Hydration of an alkene',
      'D - Dehydrohalogenation of a haloalkane',
      '1 - H₂ with a Pt or Ni catalyst',
      '2 - Concentrated NaOH in ethanol, strong heating',
      '3 - Concentrated H₂SO₄, heating',
      '4 - Excess H₂O with an H₃PO₄ catalyst',
    ],
    answer: ['A-3', 'B-1', 'C-4', 'D-2'],
    presentation: 'match', type: 'application',
    unit: 'matter_materials', topic: 'organic_molecules', subtopic: 'substitution_elimination_reactions',
    skills: ['reaction_condition_identification', 'reaction_type_identification'],
    difficulty: 3, exam_weight: 2, xp: 10, order: 4,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p2',
    clues: '- Elimination reactions remove a small molecule (H₂O or HX) and need strong heating.\n- Addition reactions add a small molecule (H₂ or H₂O) across a double bond and each needs its own catalyst.',
  },
  {
    name: 'Question 5',
    question: 'The four compounds below have molar masses between 44 and 46 g·mol⁻¹. Arrange them in order of INCREASING boiling point (lowest first).',
    metadata: ['Ethanol, CH₃CH₂OH', 'Methanoic acid, HCOOH', 'Propane, CH₃CH₂CH₃', 'Ethanal, CH₃CHO'],
    answer: ['Propane, CH₃CH₂CH₃', 'Ethanal, CH₃CHO', 'Ethanol, CH₃CH₂OH', 'Methanoic acid, HCOOH'],
    presentation: 'ordering', type: 'application',
    unit: 'matter_materials', topic: 'organic_molecules', subtopic: 'physical_properties_organic',
    skills: ['boiling_point_trend_prediction', 'intermolecular_force_comparison'],
    difficulty: 3, exam_weight: 2, xp: 10, order: 5,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p2',
    clues: '- With molar masses this close, the TYPE of intermolecular force decides the order.\n- London forces only < dipole-dipole < one hydrogen-bonding site < two hydrogen-bonding sites per molecule.',
  },
];

const aiExplanation = {
  sub_questions: [
    {
      number: '1.1',
      marks: 2,
      clues: '- Hydrogen bonding between identical molecules needs an H atom bonded directly to N, O or F.\n- Check each option for an –OH group, not just for an O atom.',
      approach: '- Identify the functional group in each option.\n- Keep only the compound with an O–H bond in its own molecule.',
      solution: '1. A (CH₃CH₂CHO) is an aldehyde, B (CH₃COOCH₃) an ester and D (CH₃COCH₃) a ketone: none has an H bonded to O, so they only have dipole-dipole and London forces.\n2. C (CH₃CH₂CH₂OH) is an alcohol with an O–H group, so its molecules form hydrogen bonds.\n3. Answer: C.',
    },
    {
      number: '1.2',
      marks: 2,
      clues: '- A carboxylic acid has one –COOH group and an otherwise saturated chain.\n- Test the options with a known acid, e.g. ethanoic acid, CH₃COOH = C₂H₄O₂.',
      approach: '- Write the molecular formula of a simple carboxylic acid.\n- Substitute its n value into each general formula and see which one fits.',
      solution: '1. Ethanoic acid, CH₃COOH, has the molecular formula C₂H₄O₂ (n = 2).\n2. CₙH₂ₙO₂ gives C₂H₄O₂ ✓; CₙH₂ₙ₊₁O₂ gives C₂H₅O₂ ✗; CₙH₂ₙO₂ₙ gives C₂H₄O₄ ✗; CₙHₙO₂ gives C₂H₂O₂ ✗.\n3. Answer: C (CₙH₂ₙO₂).',
    },
    {
      number: '1.3',
      marks: 2,
      clues: '- Reaction 1 is acid-catalysed dehydration; the major product has the more substituted double bond.\n- Hydrogenation of an alkene gives the alkane with the same carbon skeleton.',
      approach: '- Remove OH from C2 and H from the neighbouring C with fewer H atoms to find P.\n- Add H₂ across the double bond of P to find Q.',
      solution: '1. Butan-2-ol (CH₃CH₂CHOHCH₃) loses H₂O; the H comes from C3 (fewer H atoms than C1), so the major product P is but-2-ene.\n2. Hydrogenation of but-2-ene adds H₂ across the C=C bond, giving Q = butane.\n3. Answer: B.',
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
