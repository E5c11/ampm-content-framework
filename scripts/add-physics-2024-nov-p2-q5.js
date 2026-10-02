#!/usr/bin/env node
/**
 * DBE Physical Sciences: Chemistry P2 — November 2024 — Question 5 (order 9)
 * Rate & Extent of Reaction — rate definition, mass-from-average-rate calculation,
 * collision theory, concentration and surface-area effects on a volume–time graph,
 * Maxwell–Boltzmann distribution. 17 marks, one Aℓ + HCℓ scenario plus 5.2's curves.
 *
 *   node tools/validate-questions.js --script scripts/add-physics-2024-nov-p2-q5.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-physics-2024-nov-p2-q5.js --dry-run
 *   node scripts/add-physics-2024-nov-p2-q5.js
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
  name: 'Question 5',
  syllabus: 'dbe',
  subject: 'physics',
  year: 2024,
  paper: 'nov_p2',
  order: 9,
  content_tier: 'free',
  has_video: false,
  xp: 60,
  tags: ['reaction_rate', 'collision_theory', 'maxwell_boltzmann'],
  question_image_urls: [`${PAPER}/q9/question_1.png`, `${PAPER}/q9/question_2.png`],
  memo_image_urls: [`${PAPER}/q9/memo_1.png`, `${PAPER}/q9/memo_2.png`, `${PAPER}/q9/memo_3.png`],
  exam_question_marks: 17,
  supplementary_materials: [FORMULA_SHEET],
};

const questions = [
  {
    name: 'Question 1',
    question: 'A 1,30 g strip of zinc reacts with EXCESS hydrochloric acid: Zn(s) + 2HCℓ(aq) → ZnCℓ₂(aq) + H₂(g). For the first 4 minutes, the average rate of formation of H₂(g) is 0,060 dm³·min⁻¹. Take the molar gas volume as 24,5 dm³·mol⁻¹. Calculate the mass of zinc LEFT in the flask at t = 4 minutes, in g (round off to a minimum of TWO decimal places): []',
    metadata: ['m(Zn) left = ', '[ ]', ' g'],
    answer: ['0.66', '', '', '', ''],
    presentation: 'fitb', type: 'calc',
    unit: 'chemical_change', topic: 'reaction_rate', subtopic: 'average_rate_calculations',
    skills: ['average_rate_calculation', 'gas_volume_stoichiometry'],
    difficulty: 4, exam_weight: 3, xp: 20, order: 1,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p2',
    clues: '- Rate × time gives the volume of H₂ formed; divide by the molar gas volume to get moles.\n- Use the mole ratio from the balanced equation to find how much zinc REACTED, then subtract its mass from the starting mass.',
  },
  {
    name: 'Question 2',
    question: 'A strip of zinc reacts with EXCESS hydrochloric acid. The concentration of the acid stays effectively constant, yet the rate of the reaction decreases with time. Select ALL the statements that form part of the collision-theory explanation.',
    metadata: [
      'The exposed surface area of the zinc strip decreases',
      'The activation energy of the reaction increases',
      'Fewer effective collisions take place per unit time',
      'The average kinetic energy of the acid particles decreases',
      'The concentration of the hydrochloric acid decreases',
    ],
    answer: ['The exposed surface area of the zinc strip decreases', 'Fewer effective collisions take place per unit time', '', '', ''],
    presentation: 'multi_select', type: 'application',
    unit: 'chemical_change', topic: 'reaction_rate', subtopic: 'collision_theory',
    skills: ['collision_theory_reasoning', 'rate_factor_identification'],
    difficulty: 3, exam_weight: 3, xp: 15, order: 2,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p2',
    clues: '- Rule out any option that contradicts the scenario: what was said to stay constant?\n- Temperature and activation energy are unchanged; ask what is physically shrinking as the reaction runs.',
  },
  {
    name: 'Question 3',
    question: 'The zinc experiment is repeated with the same mass of zinc strip, but with a MORE CONCENTRATED hydrochloric acid solution (still in excess). How does the new volume of H₂ versus time curve compare with the original one?',
    metadata: [
      'Same initial gradient; it levels off at a greater final volume',
      'Steeper initial gradient; it levels off at a greater final volume',
      'Less steep initial gradient; it levels off at the same final volume',
      'Steeper initial gradient; it levels off at the same final volume',
      '',
    ],
    answer: ['Steeper initial gradient; it levels off at the same final volume', '', '', '', ''],
    presentation: 'multiple_choice', type: 'application',
    unit: 'chemical_change', topic: 'reaction_rate', subtopic: 'reaction_rate_factors',
    skills: ['graph_gradient_interpretation', 'limiting_reactant_identification'],
    difficulty: 3, exam_weight: 2, xp: 10, order: 3,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p2',
    clues: '- The gradient of the curve shows the rate; the final level shows the total amount of product.\n- The total amount of H₂ is set by whichever reactant runs out first.',
  },
  {
    name: 'Question 4',
    question: 'The graph shows the Maxwell–Boltzmann distribution for a reaction mixture at a fixed temperature. EA1 is the activation energy under the original conditions. After ONE change, the activation energy becomes EA2. Which change was made?',
    metadata: [
      'The temperature was increased',
      'The concentration of the reactants was increased',
      'A catalyst was added',
      'The surface area of a solid reactant was increased',
      '',
    ],
    answer: ['A catalyst was added', '', '', '', ''],
    presentation: 'multiple_choice', type: 'application',
    unit: 'chemical_change', topic: 'reaction_rate', subtopic: 'maxwell_boltzmann_distribution',
    skills: ['maxwell_boltzmann_interpretation', 'catalyst_mechanism_reasoning'],
    difficulty: 2, exam_weight: 2, xp: 10, order: 4,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p2',
    clues: '- The distribution curve itself has NOT changed shape, so the particles have the same kinetic energies as before.\n- Only the minimum energy needed for an effective collision has moved.',
    supplementary_material: {
      type: 'graph',
      label: 'Maxwell–Boltzmann distribution',
      image_urls: ['https://media-dev.askmoreprepmore.app/question_supplementary/physics/2024/nov_p2/q9/graph_1.png'],
    },
  },
  {
    name: 'Question 5',
    question: 'The temperature of a reaction mixture is increased. Select ALL the statements that correctly describe the new Maxwell–Boltzmann distribution curve compared with the original one.',
    metadata: [
      'The peak is lower and moves to a higher kinetic energy',
      'The activation energy moves to a lower kinetic energy',
      'More particles have a kinetic energy equal to or greater than the activation energy',
      'The peak moves to a lower kinetic energy',
      'The total area under the curve stays the same',
    ],
    answer: ['The peak is lower and moves to a higher kinetic energy', 'More particles have a kinetic energy equal to or greater than the activation energy', 'The total area under the curve stays the same', '', ''],
    presentation: 'multi_select', type: 'application',
    unit: 'chemical_change', topic: 'reaction_rate', subtopic: 'maxwell_boltzmann_distribution',
    skills: ['maxwell_boltzmann_interpretation'],
    difficulty: 3, exam_weight: 2, xp: 10, order: 5,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p2',
    clues: '- Heating changes how the particles are spread over kinetic energies, not how many particles there are.\n- The activation energy is a property of the reaction pathway, not of the temperature.',
  },
];

const aiExplanation = {
  sub_questions: [
    {
      number: '5.1.1',
      marks: 2,
      clues: '- Reaction rate is a change in some amount divided by the time taken.\n- It can refer to products formed or reactants used.',
      approach: '- State what changes (concentration, amount, volume or mass).\n- State that it is per unit time.',
      solution: '1. Reaction rate is the change in concentration (or amount, volume or mass) of reactants or products per unit time.',
    },
    {
      number: '5.1.2',
      marks: 6,
      clues: '- Rate × time gives the volume of H₂ formed in the first 5 minutes; convert it to moles with Vm = 24,5 dm³·mol⁻¹.\n- n(Aℓ) : n(H₂) = 2 : 3. Find the mass of Aℓ used and subtract it from 0,5 g.',
      approach: '- V(H₂) = rate × Δt.\n- n(H₂) = V ÷ Vm, then n(Aℓ) = ⅔ n(H₂).\n- m(Aℓ used) = n × 27 g·mol⁻¹; m(Aℓ left) = 0,5 − m(Aℓ used).',
      solution: '1. V(H₂) = 0,033 × 5 = 0,165 dm³.\n2. n(H₂) = 0,165 ÷ 24,5 = 6,74 × 10⁻³ mol.\n3. n(Aℓ) used = ⅔ × 6,74 × 10⁻³ = 4,49 × 10⁻³ mol.\n4. m(Aℓ) used = 4,49 × 10⁻³ × 27 = 0,12 g.\n5. m(Aℓ) left = 0,5 − 0,12 = 0,38 g.',
    },
    {
      number: '5.1.3',
      marks: 4,
      clues: '- The acid concentration is constant, so look at what happens to the aluminium as it reacts.\n- Link the change to the number of effective collisions per unit time.',
      approach: '- State the change in the aluminium (surface area decreases).\n- Link it to fewer exposed particles and fewer effective collisions per unit time.\n- Conclude what happens to the rate.',
      solution: '1. As the aluminium reacts, its surface area (contact area) decreases.\n2. Fewer aluminium particles are exposed to the acid.\n3. There are fewer effective collisions per unit time (a lower frequency of effective collisions).\n4. So the reaction rate decreases.',
    },
    {
      number: '5.1.4',
      marks: 2,
      clues: '- A higher acid concentration makes the reaction faster, so curve B is steeper.\n- The aluminium is still the limiting reactant, so the final volume of H₂ does not change.',
      approach: '- Sketch curve A starting at the origin and levelling off.\n- Draw curve B from the origin, steeper throughout, levelling off at the same final volume.',
      solution: '1. Curve B starts at the origin, like curve A.\n2. Curve B is steeper (higher gradient) than curve A for the whole duration.\n3. Curve B levels off earlier, at the SAME final volume as curve A, because the same mass of Aℓ (the limiting reactant) is used.',
    },
    {
      number: '5.1.5',
      marks: 1,
      clues: '- Powdering changes the rate, not the amount of reactant.\n- The same mass of aluminium is used with excess acid.',
      approach: '- Identify the limiting reactant.\n- Compare the amount of H₂ it can produce in both experiments.',
      solution: '1. EQUAL TO. The same 0,5 g of aluminium (the limiting reactant) produces the same amount of H₂; the powder only makes the reaction faster.',
    },
    {
      number: '5.2.1',
      marks: 1,
      clues: '- Curve Y is flatter, and its peak is further to the right than that of curve X.\n- Only one condition changes how the kinetic energies of the particles are spread.',
      approach: '- Compare the position of the peaks of X and Y.\n- Decide which condition shifts the peak to higher kinetic energy.',
      solution: '1. The temperature was increased.',
    },
    {
      number: '5.2.2',
      marks: 1,
      clues: '- Look at where the peak of curve Y lies on the kinetic energy axis.\n- Temperature is a measure of average kinetic energy.',
      approach: '- Describe what the shift of the curve shows about the particles.\n- Link it to temperature.',
      solution: '1. Curve Y has its peak at a higher kinetic energy (the peak shifted to the right), so the average kinetic energy of the particles increased, and more particles have higher kinetic energy.',
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
