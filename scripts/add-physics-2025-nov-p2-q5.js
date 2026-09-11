#!/usr/bin/env node
/**
 * DBE Physical Sciences: Chemistry P2 — November 2025 — Question 5 (order 9)
 * Rate & Extent of Reaction — rate definition, graph reading, average rate calc,
 * collision theory, Maxwell-Boltzmann distribution. 20 marks, one continuous question.
 *
 *   node tools/validate-questions.js --script scripts/add-physics-2025-nov-p2-q5.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-physics-2025-nov-p2-q5.js --dry-run
 *   node scripts/add-physics-2025-nov-p2-q5.js
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
  name: 'Question 5',
  syllabus: 'dbe',
  subject: 'physics',
  year: 2025,
  paper: 'nov_p2',
  order: 9,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['reaction_rate', 'collision_theory', 'maxwell_boltzmann'],
  question_image_urls: [`${PAPER}/q9/question_1.png`, `${PAPER}/q9/question_2.png`],
  memo_image_urls: [`${PAPER}/q9/memo_1.png`, `${PAPER}/q9/memo_2.png`, `${PAPER}/q9/memo_3.png`, `${PAPER}/q9/memo_4.png`],
  exam_question_marks: 20,
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
    question: 'Select ALL of the following that correctly express the rate of a chemical reaction.',
    metadata: [
      'Change in concentration of a reactant or product per unit time',
      'Change in number of moles of a reactant or product per unit time',
      'Total mass of product formed, regardless of time taken',
      'Change in volume of a gaseous product per unit time',
      '',
    ],
    answer: ['Change in concentration of a reactant or product per unit time', 'Change in number of moles of a reactant or product per unit time', 'Change in volume of a gaseous product per unit time', '', ''],
    presentation: 'multi_select',
    type: 'definition',
    unit: 'chemical_change',
    topic: 'reaction_rate',
    subtopic: 'reaction_rate_definition',
    skills: ['reaction_rate_expression'],
    difficulty: 1,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p2',
    clues:
      "- Rate is always a quantity of reactant/product changing relative to time — the time component is essential.\n- One option describes a total amount with no reference to how long it took to form.",
  },
  {
    name: 'Question 2',
    question:
      'In a reaction between X(g) and Y(g), the concentration of X(g) decreases from 0,40 mol·dm⁻³ to 0,24 mol·dm⁻³ during the first 8 s of the reaction, in a 2 dm³ container. Calculate the average rate (in mol·s⁻¹) at which X(g) is consumed during this time: []',
    metadata: ['Average rate = ', '[ ]', ' mol·s⁻¹'],
    answer: ['0.04', '', '', '', ''],
    presentation: 'fitb',
    type: 'calc',
    unit: 'chemical_change',
    topic: 'reaction_rate',
    subtopic: 'average_rate_calculations',
    skills: ['average_rate_calculation'],
    difficulty: 3,
    exam_weight: 3,
    xp: 15,
    order: 2,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p2',
    clues:
      '- First find the rate as a change in concentration per unit time, then convert to mol·s⁻¹ using the container volume.\n- Rate (mol·s⁻¹) = rate (mol·dm⁻³·s⁻¹) × volume (dm³).',
  },
  {
    name: 'Question 3',
    question:
      'In a reaction between A(g) and B(g) with a 1:1 mole ratio, 0,50 mol of A(g) and 0,80 mol of B(g) are mixed and allowed to react completely. Which reactant is in EXCESS?',
    metadata: ['A(g)', 'Neither — both are used up completely', 'B(g)', 'Cannot be determined without a graph', ''],
    answer: ['B(g)', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'chemical_change',
    topic: 'reaction_rate',
    subtopic: 'limiting_excess_reactants',
    skills: ['limiting_reactant_identification'],
    difficulty: 2,
    exam_weight: 1,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p2',
    clues:
      '- With a 1:1 mole ratio, the reactant present in the smaller amount is fully used up first.\n- Whatever is left over of the other reactant once the first runs out is the excess reactant.',
  },
  {
    name: 'Question 4',
    question:
      'A catalyst is added to a reaction mixture at constant temperature. Which ONE of the following correctly explains, in terms of collision theory, why the reaction rate increases?',
    metadata: [
      'The catalyst increases the concentration of the reactants',
      'The catalyst provides an alternative reaction pathway with a lower activation energy, so a greater proportion of collisions are successful',
      'The catalyst increases the temperature of the reaction mixture',
      'The catalyst increases the frequency of collisions between reactant particles',
      '',
    ],
    answer: ['The catalyst provides an alternative reaction pathway with a lower activation energy, so a greater proportion of collisions are successful', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'chemical_change',
    topic: 'reaction_rate',
    subtopic: 'collision_theory',
    skills: ['catalyst_mechanism_reasoning'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p2',
    clues:
      "- A catalyst doesn't change the amount, temperature, or concentration of the reactants present.\n- Its effect is on the energy pathway the reaction follows, not on how often particles collide.",
  },
  {
    name: 'Question 5',
    question:
      'More reactant is added to a reaction mixture at constant temperature, increasing the total number of particles able to react. On a Maxwell-Boltzmann distribution curve (number of particles vs kinetic energy), how will the new curve compare to the original?',
    metadata: [
      'The peak will shift to a higher kinetic energy, with the same peak height',
      'The peak will be higher, at the same kinetic energy as before',
      'The peak will be lower, at a higher kinetic energy',
      'The curve will not change shape, only shift left along the kinetic-energy axis',
      '',
    ],
    answer: ['The peak will be higher, at the same kinetic energy as before', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'interpretation',
    unit: 'chemical_change',
    topic: 'reaction_rate',
    subtopic: 'maxwell_boltzmann_distribution',
    skills: ['maxwell_boltzmann_interpretation'],
    difficulty: 3,
    exam_weight: 2,
    xp: 15,
    order: 5,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p2',
    clues:
      '- Adding more reactant particles at the same temperature does not change the energy distribution of individual particles.\n- More particles overall means a taller curve, not a shifted or reshaped one.',
  },
];

const aiExplanation = {
  sub_questions: [
    {
      number: '5.1',
      marks: 2,
      clues: '- The definition has two essential parts: what quantity is changing, and over what.\n- Reaction rate can be expressed via concentration, moles, volume, or mass — but always relative to the same thing.',
      approach: '- State which quantities can change (concentration/amount/mass/volume of reactant or product) and what they are measured against (time).',
      solution: '1. Reaction rate is the change in concentration (or amount/number of moles/volume/mass) of a product or reactant.\n2. This change is measured per unit time.',
    },
    {
      number: '5.2.1',
      marks: 1,
      clues: '- The steeper the graph at a given time, the faster the reaction rate at that moment.\n- Compare the slope (gradient) of the curve at the two given times.',
      approach: '- Look at the gradient of the concentration-time graph at 10 s and at 30 s.',
      solution: '1. The graph is steeper (has a larger gradient) at 10 s than at 30 s.\n2. The reaction rate is higher at 10 s.',
    },
    {
      number: '5.2.2',
      marks: 5,
      clues: '- Read the concentration of O₂(g) at 0 s and at 10 s from the graph to find the change in [O₂].\n- Use the mole ratio between O₂ and CO₂ (1:2 mol) to convert the rate of O₂ consumption into the rate of CO₂ formation, then multiply by the container volume.',
      approach: '- Calculate the rate of change of [O₂] over the first 10 s.\n- Convert this concentration rate to a rate in mol·s⁻¹ using the container volume, then use the mole ratio to find the rate for CO₂.',
      solution: '1. [O₂] changes from about 0,27 mol·dm⁻³ to 0,15 mol·dm⁻³ over the first 10 s: rate = (0,15 − 0,27) ÷ 10 = −0,012 mol·dm⁻³·s⁻¹, so 0,012 mol·dm⁻³·s⁻¹ in magnitude.\n2. Rate of O₂ consumption in mol·s⁻¹ = 0,012 × 3 dm³ = 0,036 mol·s⁻¹.\n3. From the equation, n(CO₂) : n(O₂) = 2 : 1, so rate of CO₂ formation = 2 × 0,036 = 0,072 mol·s⁻¹.',
    },
    {
      number: '5.2.3',
      marks: 1,
      clues: '- The graph shows the concentration of one reactant levelling off before it reaches zero.\n- A reactant whose concentration never reaches zero is present in excess.',
      approach: '- Consider which of the two reactants would still have concentration remaining once the reaction is complete, based on the graph.',
      solution: '1. The graph shows [O₂] levelling off above zero rather than reaching zero.\n2. O₂ is the reactant in excess.',
    },
    {
      number: '5.2.4',
      marks: 2,
      clues: '- A smaller container with the same amount of reactant means a higher starting concentration.\n- A higher concentration means more frequent collisions between reactant particles.',
      approach: '- Relate the change in container volume (at constant amount of reactant) to the initial concentration and hence the initial rate.',
      solution: '1. A smaller container increases the initial concentration of the reactants.\n2. A higher concentration means more frequent effective collisions, so the initial rate — and the magnitude of the gradient — increases.',
    },
    {
      number: '5.3.1',
      marks: 1,
      clues: '- The forward reaction releases energy (ΔH is negative).\n- The reverse reaction is the exact opposite process of the forward reaction.',
      approach: '- If the forward reaction releases energy, decide what the reverse reaction must do.',
      solution: '1. The forward reaction is exothermic (releases energy).\n2. The reverse reaction is therefore endothermic — there is a net absorption of energy.',
    },
    {
      number: '5.3.2',
      marks: 2,
      clues: '- The activated complex exists only briefly, at the highest-energy point of the reaction pathway.\n- It is neither the reactants nor the products, but something in between.',
      approach: '- Describe what the activated complex represents in terms of energy and in terms of the transition between reactants and products.',
      solution: '1. The activated complex is the unstable, high-energy arrangement of atoms that exists momentarily during a reaction.\n2. It represents the transition state between reactants and products.',
    },
    {
      number: '5.3.3',
      marks: 3,
      clues: '- A catalyst changes the pathway the reaction follows, not the reactants or conditions themselves.\n- Lowering the activation energy affects what fraction of particles can react successfully when they collide.',
      approach: '- Explain what a catalyst does to the activation energy of the reaction.\n- Link this to the proportion of particles with sufficient energy to react, and hence to the frequency of effective collisions.',
      solution: '1. The catalyst provides an alternative reaction pathway with a lower activation energy.\n2. A greater proportion of particles now have kinetic energy equal to or greater than this lower activation energy.\n3. This results in more effective collisions per unit time, increasing the reaction rate.',
    },
    {
      number: '5.3.4',
      marks: 1,
      clues: '- The heat of reaction depends only on the energy difference between reactants and products.\n- Adding more of a reactant changes how much product forms, but not the energy released per mole of reaction.',
      approach: '- Consider whether the heat of reaction is a property of the amounts reacting, or of the reaction itself.',
      solution: '1. The heat of reaction (ΔH) is a fixed property of the reaction, independent of the amounts of reactants present.\n2. Adding more SO₂(g) does not change ΔH — it remains the same.',
    },
    {
      number: '5.3.5',
      marks: 2,
      clues: '- Adding more SO₂(g) at constant temperature increases the total number of particles, but not their individual energy distribution.\n- The new curve should have the same overall shape and peak position, just scaled up.',
      approach: '- Keep the peak of the new curve at the same kinetic energy as curve X.\n- Draw the new curve with a higher peak than curve X, both starting at the origin.',
      solution: "1. More SO₂(g) particles at the same temperature means more particles overall, but the same proportion have each kinetic energy value.\n2. Curve Y should have the same shape and the same peak kinetic energy as curve X, but a higher peak (more particles).",
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
