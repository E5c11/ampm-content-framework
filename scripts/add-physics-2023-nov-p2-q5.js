#!/usr/bin/env node
/**
 * DBE Physical Sciences: Chemistry P2 — November 2023 — Question 5 (order 9)
 * Rate & Extent of Reaction — reaction rate definition, dilution/concentration
 * calculation, average rate calculation, Maxwell-Boltzmann distribution,
 * collision theory. 19 marks, one continuous scenario (Na₂S₂O₃ + HCl rate
 * investigation).
 *
 * Rate & Extent of Reaction is procedural, not content-based (subjects/dbe-
 * chemistry.md's Subject rules) — fresh numbers/scenario carry the freshness
 * here, not relational reframing.
 *
 *   node tools/validate-questions.js --script scripts/add-physics-2023-nov-p2-q5.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-physics-2023-nov-p2-q5.js --dry-run
 *   node scripts/add-physics-2023-nov-p2-q5.js
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
  name: 'Question 5',
  syllabus: 'dbe',
  subject: 'physics',
  year: 2023,
  paper: 'nov_p2',
  order: 9,
  content_tier: 'free',
  has_video: false,
  xp: 55,
  tags: ['reaction_rate', 'collision_theory', 'maxwell_boltzmann'],
  question_image_urls: [`${PAPER}/q9/question_1.png`],
  memo_image_urls: [`${PAPER}/q9/memo_1.png`, `${PAPER}/q9/memo_2.png`, `${PAPER}/q9/memo_3.png`, `${PAPER}/q9/memo_4.png`, `${PAPER}/q9/memo_5.png`],
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
    question: 'Which ONE of the following correctly defines reaction rate?',
    metadata: [
      'The total amount of product formed by the end of a reaction',
      'The change in concentration (or amount) of a reactant or product per unit time',
      'The time taken for a reaction to reach equilibrium',
      'The energy released or absorbed per mole of reactant',
      '',
    ],
    answer: ['The change in concentration (or amount) of a reactant or product per unit time', '', '', '', ''],
    presentation: 'multiple_choice',
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
    year: 2023,
    paper: 'nov_p2',
    clues: '- Rate is always expressed per unit of something happening over time, not a total amount or a fixed time interval.\n- Rate can be measured using either a reactant (decreasing) or a product (increasing).',
  },
  {
    name: 'Question 2',
    question: '60 cm³ of 0,15 mol·dm⁻³ hydrochloric acid is diluted by adding 40 cm³ of water. Calculate the concentration of the diluted solution, in mol·dm⁻³ (round off to a minimum of TWO decimal places): []',
    metadata: ['New concentration = ', '[ ]', ' mol·dm⁻³'],
    answer: ['0.09', '', '', '', ''],
    presentation: 'fitb',
    type: 'calc',
    unit: 'chemical_change',
    topic: 'reaction_rate',
    subtopic: 'reaction_rate_factors',
    skills: ['standard_conditions_concentration_calculation'],
    difficulty: 2,
    exam_weight: 3,
    xp: 15,
    order: 2,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2023,
    paper: 'nov_p2',
    clues: '- The number of moles of HCl stays the same before and after dilution; only the volume it is dissolved in changes.\n- Find the moles of HCl in the original 60 cm³ first, then divide by the new TOTAL volume after adding the water.',
  },
  {
    name: 'Question 3',
    question:
      'In a reaction between magnesium ribbon and excess dilute hydrochloric acid, 0,24 g of magnesium reacts completely in 12 s. Calculate the average reaction rate with respect to magnesium, in g·s⁻¹ (round off to a minimum of TWO decimal places): []',
    metadata: ['Average rate = ', '[ ]', ' g·s⁻¹'],
    answer: ['0.02', '', '', '', ''],
    presentation: 'fitb',
    type: 'calc',
    unit: 'chemical_change',
    topic: 'reaction_rate',
    subtopic: 'average_rate_calculations',
    skills: ['average_rate_calculation'],
    difficulty: 2,
    exam_weight: 3,
    xp: 15,
    order: 3,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2023,
    paper: 'nov_p2',
    clues: '- Average rate with respect to a named substance is that substance\'s change in mass divided by the time taken.\n- Both the mass and the time needed for this calculation are given directly in the question — no unit conversion is required.',
  },
  {
    name: 'Question 4',
    question: 'A reaction mixture is COOLED from 40 °C to 25 °C. Which ONE of the following correctly describes the resulting change to its Maxwell-Boltzmann distribution curve?',
    metadata: [
      'The peak shifts to the RIGHT and becomes SHORTER',
      'The peak shifts to the LEFT and becomes TALLER and NARROWER',
      'The curve shape stays exactly the same; only the reaction rate changes',
      'The peak shifts to the RIGHT, but the height of the peak stays the same',
      '',
    ],
    answer: ['The peak shifts to the LEFT and becomes TALLER and NARROWER', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'chemical_change',
    topic: 'reaction_rate',
    subtopic: 'maxwell_boltzmann_distribution',
    skills: ['maxwell_boltzmann_interpretation'],
    difficulty: 3,
    exam_weight: 2,
    xp: 15,
    order: 4,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2023,
    paper: 'nov_p2',
    clues:
      "- Cooling reduces the average kinetic energy of the particles, so the most probable kinetic energy value moves in a specific direction.\n- The total number of particles (the area under the curve) does not change on cooling — only how that area is distributed.",
  },
  {
    name: 'Question 5',
    question: 'Select ALL of the following that correctly explain, according to collision theory, why INCREASING the CONCENTRATION of a reactant increases the rate of a reaction.',
    metadata: [
      'There are more reactant particles per unit volume',
      'This increases the frequency of collisions between reactant particles',
      'This increases the average kinetic energy of the reactant particles',
      'This increases the fraction of collisions with energy greater than or equal to the activation energy',
      '',
    ],
    answer: ['There are more reactant particles per unit volume', 'This increases the frequency of collisions between reactant particles', '', '', ''],
    presentation: 'multi_select',
    type: 'application',
    unit: 'chemical_change',
    topic: 'reaction_rate',
    subtopic: 'collision_theory',
    skills: ['collision_theory_reasoning'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 5,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2023,
    paper: 'nov_p2',
    clues:
      '- Concentration is about how many particles are packed into a given volume, not about how fast those particles are moving.\n- The other two options describe what happens when TEMPERATURE increases, not concentration.',
  },
];

const aiExplanation = {
  sub_questions: [
    {
      number: '5.1',
      marks: 2,
      clues: '- Rate is always a CHANGE in some quantity divided by TIME.\n- This quantity can be measured for either a reactant or a product.',
      approach: '- Recall the general definition of rate in a chemical reaction.\n- Express it as a change in a measurable quantity, per unit time.',
      solution: '1. Reaction rate is the change in concentration (or amount/number of moles/volume/mass) of a reactant or product, per unit time.',
    },
    {
      number: '5.2',
      marks: 1,
      clues: '- The independent variable is the one the experimenter deliberately changes between runs.\n- Compare what changes between Run 1, Run 2, and Run 3 in the table.',
      approach: '- Look at which quantity is different in every run, by design.\n- Identify that quantity as the independent variable.',
      solution: '1. Across the three runs, the concentration of Na₂S₂O₃(aq) is the quantity deliberately varied.\n2. The independent variable is the concentration of Na₂S₂O₃(aq).',
    },
    {
      number: '5.3',
      marks: 3,
      clues: '- The number of moles of Na₂S₂O₃ in Run 1 can be found from its given volume and concentration.\n- The same number of moles must then be used to find the concentration in Run 3, using Run 3\'s given volume.',
      approach: '- Calculate n(Na₂S₂O₃) using Run 1\'s concentration and volume.\n- Use this same n with Run 3\'s total volume to find P.',
      solution: '1. n(Na₂S₂O₃) in Run 1 = c × V = 0,13 × 0,03 = 3,9 × 10⁻³ mol.\n2. This same number of moles is present in Run 3\'s total volume of 0,05 dm³.\n3. P = n/V = 3,9 × 10⁻³ / 0,05 = 0,078 mol·dm⁻³.',
    },
    {
      number: '5.4',
      marks: 5,
      clues: '- Convert the given mass of sulphur into moles using its molar mass.\n- Use the mole ratio in the balanced equation to find the moles (and then mass) of Na₂S₂O₃ that reacted, then divide by time.',
      approach: '- Find n(S) from the given mass of sulphur formed.\n- Use the 1:1 mole ratio between S and Na₂S₂O₃ to find m(Na₂S₂O₃), then divide by the time to get the rate.',
      solution:
        '1. n(S) = m/M = 0,21/32 = 6,56 × 10⁻³ mol.\n2. Since S : Na₂S₂O₃ is 1 : 1, n(Na₂S₂O₃) = 6,56 × 10⁻³ mol.\n3. m(Na₂S₂O₃) = n × M = 6,56 × 10⁻³ × 158 = 1,04 g.\n4. Rate = Δm/Δt = 1,04 / 20,4 = 0,051 g·s⁻¹.',
    },
    {
      number: '5.5',
      marks: 4,
      clues: '- Curve A (20 °C) and curve B (35 °C) both start at the origin and return to the x-axis.\n- The higher-temperature curve has its peak both lower and further to the right, with a longer tail.',
      approach: '- Sketch curve A first, with a clear peak.\n- Sketch curve B with a lower, broader peak shifted to the right of A\'s peak, with more area under the high-energy tail.',
      solution: '1. Curve A (20 °C) is drawn with a distinct peak at a lower kinetic energy value.\n2. Curve B (35 °C) is drawn starting and ending in the same places, but with a lower, broader peak shifted to the right of curve A, and with a higher kinetic energy value at its peak.',
    },
    {
      number: '5.6',
      marks: 4,
      clues: '- Higher temperature increases the average kinetic energy of the particles.\n- This changes the FRACTION of collisions that have enough energy to react, which changes how often EFFECTIVE collisions happen.',
      approach: '- State how kinetic energy changes with temperature.\n- Link this to the fraction of particles with sufficient energy for effective collisions, and then to the reaction rate.',
      solution:
        '1. At a higher temperature, particles move faster and have higher kinetic energy.\n2. A greater proportion of particles then have kinetic energy greater than or equal to the activation energy.\n3. This increases the frequency of effective collisions per unit time.\n4. The reaction rate increases.',
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
