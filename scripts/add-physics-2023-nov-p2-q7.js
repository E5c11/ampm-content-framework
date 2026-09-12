#!/usr/bin/env node
/**
 * DBE Physical Sciences: Chemistry P2 — November 2023 — Question 7 (order 11)
 * Acids & Bases — strong acid/base definitions, titration/neutralisation
 * calculations, pH calculation, percentage purity. 18 marks, one continuous
 * scenario (identifying an unknown metal carbonate via back-titration).
 *
 *   node tools/validate-questions.js --script scripts/add-physics-2023-nov-p2-q7.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-physics-2023-nov-p2-q7.js --dry-run
 *   node scripts/add-physics-2023-nov-p2-q7.js
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
  name: 'Question 7',
  syllabus: 'dbe',
  subject: 'physics',
  year: 2023,
  paper: 'nov_p2',
  order: 11,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['acids_bases', 'titration', 'ph_scale'],
  question_image_urls: [`${PAPER}/q11/question_1.png`],
  memo_image_urls: [`${PAPER}/q11/memo_1.png`, `${PAPER}/q11/memo_2.png`],
  exam_question_marks: 18,
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
    question: 'Which ONE of the following correctly defines a strong acid?',
    metadata: [
      'Reacts completely with a base in a neutralisation reaction',
      'Dissociates completely in water to form a high concentration of H₃O⁺ ions',
      'Has a pH value below 3 at every concentration',
      'Ionises only partially in water, forming an equilibrium mixture',
      '',
    ],
    answer: ['Dissociates completely in water to form a high concentration of H₃O⁺ ions', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'definition',
    unit: 'chemical_change',
    topic: 'acids_bases',
    subtopic: 'ph_strength_ordering',
    skills: ['acid_base_strength_ordering'],
    difficulty: 1,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2023,
    paper: 'nov_p2',
    clues: '- Strength refers to the EXTENT of ionisation/dissociation in water, not to concentration or pH value directly.\n- Any acid, weak or strong, can be diluted to any concentration — that alone does not determine its strength.',
  },
  {
    name: 'Question 2',
    question: '25 cm³ of 0,20 mol·dm⁻³ HCℓ(aq) reacts completely with V cm³ of 0,25 mol·dm⁻³ NaOH(aq): HCℓ(aq) + NaOH(aq) → NaCℓ(aq) + H₂O(ℓ). Calculate the volume V needed for exact neutralisation, in cm³ (round off to a minimum of TWO decimal places): []',
    metadata: ['V = ', '[ ]', ' cm³'],
    answer: ['20.00', '', '', '', ''],
    presentation: 'fitb',
    type: 'calc',
    unit: 'chemical_change',
    topic: 'acids_bases',
    subtopic: 'titration_calculations',
    skills: ['titration_concentration_calculation'],
    difficulty: 2,
    exam_weight: 3,
    xp: 15,
    order: 2,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2023,
    paper: 'nov_p2',
    clues: '- The 1:1 mole ratio in the balanced equation means n(HCℓ) = n(NaOH) at exact neutralisation.\n- Find n(HCℓ) from its given volume and concentration first, then use it to find V for the NaOH.',
  },
  {
    name: 'Question 3',
    question: 'A solution has a hydronium ion concentration, [H₃O⁺], of 0,05 mol·dm⁻³. Calculate the pH of this solution (round off to a minimum of TWO decimal places): []',
    metadata: ['pH = ', '[ ]'],
    answer: ['1.30', '', '', '', ''],
    presentation: 'fitb',
    type: 'calc',
    unit: 'chemical_change',
    topic: 'acids_bases',
    subtopic: 'ka_kb_ph_calculations',
    skills: ['ph_poh_conversion'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2023,
    paper: 'nov_p2',
    clues: '- pH is calculated directly from [H₃O⁺] using a specific logarithmic formula on the formula sheet.\n- A [H₃O⁺] value below 1 mol·dm⁻³ always gives a positive pH value.',
  },
  {
    name: 'Question 4',
    question: 'A 2,00 g sample of impure calcium carbonate, CaCO₃, is found to be 80% pure by mass. Calculate the mass of pure CaCO₃ in the sample, in g (round off to a minimum of TWO decimal places): []',
    metadata: ['Mass of pure CaCO₃ = ', '[ ]', ' g'],
    answer: ['1.60', '', '', '', ''],
    presentation: 'fitb',
    type: 'calc',
    unit: 'chemical_change',
    topic: 'acids_bases',
    subtopic: 'titration_calculations',
    skills: ['standard_conditions_concentration_calculation'],
    difficulty: 2,
    exam_weight: 3,
    xp: 15,
    order: 4,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2023,
    paper: 'nov_p2',
    clues: '- Percentage purity gives the fraction of the total sample mass that is the actual pure compound.\n- Multiply the total sample mass by this fraction, written as a decimal.',
  },
  {
    name: 'Question 5',
    question: 'Ammonia reacts with water: NH₃(aq) + H₂O(ℓ) ⇌ NH₄⁺(aq) + OH⁻(aq). Select ALL of the correct conjugate acid-base pairs in this reaction.',
    metadata: ['NH₃ / NH₄⁺', 'H₂O / OH⁻', 'NH₃ / OH⁻', 'H₂O / NH₄⁺', ''],
    answer: ['NH₃ / NH₄⁺', 'H₂O / OH⁻', '', '', ''],
    presentation: 'multi_select',
    type: 'application',
    unit: 'chemical_change',
    topic: 'acids_bases',
    subtopic: 'conjugate_acid_base_pairs',
    skills: ['conjugate_acid_base_identification'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 5,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2023,
    paper: 'nov_p2',
    clues: '- A conjugate acid-base pair differs by exactly one H⁺ ion.\n- Match each species on the left of the equation to the species it turns into on the right, not to a species from the other original reactant.',
  },
];

const aiExplanation = {
  sub_questions: [
    {
      number: '7.1',
      marks: 2,
      clues: '- Strength refers to the extent of ionisation in water, not concentration.\n- A strong base produces a particularly high concentration of one specific ion.',
      approach: '- Recall the definition of a strong base in terms of ionisation.\n- State which ion it produces in high concentration.',
      solution: '1. A strong base ionises/dissociates completely in water.\n2. This forms a high concentration of OH⁻ ions.',
    },
    {
      number: '7.2.1',
      marks: 3,
      clues: '- Use the given volume and concentration of Ba(OH)₂(aq) directly in c = n/V.\n- No other information from Step 1 is needed for this particular calculation.',
      approach: '- Identify the volume and concentration of Ba(OH)₂(aq) used in Step 2.\n- Substitute directly into n = cV.',
      solution: '1. n(Ba(OH)₂) = cV = (0,15)(0,02) = 0,003 mol.',
    },
    {
      number: '7.2.2',
      marks: 5,
      clues: '- The Ba(OH)₂ used in Step 2 reacted only with the EXCESS HNO₃ left over from Step 1, not with any of the MCO₃.\n- Use the mole ratio in the Ba(OH)₂ equation to find n(HNO₃) excess, then find its concentration and pH.',
      approach: '- Use the 2:1 mole ratio (HNO₃ : Ba(OH)₂) to find n(HNO₃) excess from 7.2.1\'s answer.\n- Find [H₃O⁺] from this amount and the total volume, then calculate pH.',
      solution:
        '1. n(HNO₃) excess = 2 × n(Ba(OH)₂) = 2 × 0,003 = 0,006 mol.\n2. [H₃O⁺] = [HNO₃] = n/V = 0,006/0,025 = 0,24 mol·dm⁻³.\n3. pH = −log[H₃O⁺] = −log(0,24) = 0,62.',
    },
    {
      number: '7.3',
      marks: 8,
      clues: '- The HNO₃ that reacted with the MCO₃ is the initial amount minus the excess found in 7.2.2.\n- Use the 2:1 mole ratio (HNO₃ : MCO₃) to find the pure mass of MCO₃, then work backward through the 85% purity to find the molar mass of the metal.',
      approach:
        '- Find n(HNO₃) that reacted with the MCO₃ (initial n(HNO₃) minus the excess).\n- Use the mole ratio to find n(MCO₃), then use the 85% purity and the given impure mass to find the pure mass of MCO₃ and its molar mass, then subtract the mass of CO₃²⁻ to identify M.',
      solution:
        '1. n(HNO₃) initial = cV = (0,4)(0,025) = 0,01 mol.\n2. n(HNO₃) reacted with MCO₃ = 0,01 − 0,006 = 0,004 mol.\n3. n(MCO₃) = ½ × 0,004 = 0,002 mol.\n4. Pure mass of MCO₃ = 85% × 0,198 g = 0,168 g.\n5. M(MCO₃) = m/n = 0,168/0,002 = 84 g·mol⁻¹.\n6. Molar mass of M = 84 − 60 (mass of CO₃²⁻) = 24 g·mol⁻¹.\n7. Metal M is magnesium, Mg.',
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
