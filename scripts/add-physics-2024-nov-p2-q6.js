#!/usr/bin/env node
/**
 * DBE Physical Sciences: Chemistry P2 — November 2024 — Question 6 (order 10)
 * Chemical Equilibrium — definition, reading a concentration–time graph (adding a
 * reactant, pressure change, temperature change), Le Chatelier, Kc table calculation
 * to a mass at equilibrium. 20 marks; 6.1 (2CO + O₂ ⇌ 2CO₂ graph) and 6.2
 * (CO + H₂O ⇌ CO₂ + H₂, Kc = 4).
 *
 *   node tools/validate-questions.js --script scripts/add-physics-2024-nov-p2-q6.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-physics-2024-nov-p2-q6.js --dry-run
 *   node scripts/add-physics-2024-nov-p2-q6.js
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
  name: 'Question 6',
  syllabus: 'dbe',
  subject: 'physics',
  year: 2024,
  paper: 'nov_p2',
  order: 10,
  content_tier: 'free',
  has_video: false,
  xp: 65,
  tags: ['chemical_equilibrium', 'le_chatelier', 'equilibrium_constant'],
  question_image_urls: [`${PAPER}/q10/question_1.png`, `${PAPER}/q10/question_2.png`],
  memo_image_urls: [`${PAPER}/q10/memo_1.png`, `${PAPER}/q10/memo_2.png`, `${PAPER}/q10/memo_3.png`],
  exam_question_marks: 20,
  supplementary_materials: [FORMULA_SHEET],
};

const questions = [
  {
    name: 'Question 1',
    question: 'Which ONE of the following correctly defines chemical equilibrium?',
    metadata: [
      'The stage where the concentrations of reactants and products are equal',
      'The stage where the forward and reverse reactions have both stopped',
      'The stage where all of the limiting reactant has been converted to products',
      'The stage where the rate of the forward reaction equals the rate of the reverse reaction',
      '',
    ],
    answer: ['The stage where the rate of the forward reaction equals the rate of the reverse reaction', '', '', '', ''],
    presentation: 'multiple_choice', type: 'definition',
    unit: 'chemical_change', topic: 'chemical_equilibrium', subtopic: 'le_chateliers_principle',
    skills: ['le_chatelier_shift_prediction'],
    difficulty: 1, exam_weight: 2, xp: 10, order: 1,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p2',
    clues: '- Equilibrium is DYNAMIC: both reactions keep going in a closed system.\n- Concentrations stay constant at equilibrium, but that does not mean they are equal to each other.',
  },
  {
    name: 'Question 2',
    question: 'The equilibrium 2SO₂(g) + O₂(g) ⇌ 2SO₃(g), ΔH < 0, is established in a closed container. The volume of the container is suddenly HALVED at constant temperature. Which ONE of the following describes the concentrations immediately afterwards and as the new equilibrium is established?',
    metadata: [
      'All concentrations suddenly increase; then [SO₃] decreases while [SO₂] and [O₂] increase further',
      'All concentrations suddenly decrease; then [SO₃] increases while [SO₂] and [O₂] decrease further',
      'All concentrations suddenly increase; then [SO₃] increases further while [SO₂] and [O₂] decrease',
      'No sudden change occurs; [SO₃] gradually increases while [SO₂] and [O₂] gradually decrease',
      '',
    ],
    answer: ['All concentrations suddenly increase; then [SO₃] increases further while [SO₂] and [O₂] decrease', '', '', '', ''],
    presentation: 'multiple_choice', type: 'application',
    unit: 'chemical_change', topic: 'chemical_equilibrium', subtopic: 'le_chateliers_principle',
    skills: ['le_chatelier_shift_prediction', 'graph_interpretation'],
    difficulty: 4, exam_weight: 3, xp: 15, order: 2,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p2',
    clues: '- Squeezing the same moles into half the volume affects EVERY gas at the same instant.\n- The system then favours the side with FEWER moles of gas to reduce the pressure.',
  },
  {
    name: 'Question 3',
    question: 'For the equilibrium N₂O₄(g) ⇌ 2NO₂(g), ΔH > 0, a concentration–time graph shows that at time t₃ there is NO sudden jump in any concentration, but afterwards [NO₂] gradually increases and [N₂O₄] gradually decreases until they level off. Which change was made at t₃?',
    metadata: [
      'The pressure was increased by decreasing the volume',
      'The temperature was increased',
      'A catalyst was added',
      'The temperature was decreased',
      '',
    ],
    answer: ['The temperature was increased', '', '', '', ''],
    presentation: 'multiple_choice', type: 'application',
    unit: 'chemical_change', topic: 'chemical_equilibrium', subtopic: 'le_chateliers_principle',
    skills: ['le_chatelier_shift_prediction', 'graph_interpretation'],
    difficulty: 3, exam_weight: 2, xp: 10, order: 3,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p2',
    clues: '- Adding a gas or changing the volume shows up as a sudden vertical jump on the graph; a gradual change with no jump points to a different kind of disturbance.\n- Decide which direction was favoured, then use the sign of ΔH.',
  },
  {
    name: 'Question 4',
    question: 'The equilibrium 2CO(g) + O₂(g) ⇌ 2CO₂(g) is established in a closed container. Extra CO₂(g) is then pumped in at constant temperature and volume. Select ALL the statements that are TRUE as the new equilibrium is established.',
    metadata: [
      'The reverse reaction is favoured',
      'The value of Kc decreases',
      'The concentration of CO(g) increases',
      'The concentration of O₂(g) increases',
      'The concentration of CO₂(g) keeps rising above its new value',
    ],
    answer: ['The reverse reaction is favoured', 'The concentration of CO(g) increases', 'The concentration of O₂(g) increases', '', ''],
    presentation: 'multi_select', type: 'application',
    unit: 'chemical_change', topic: 'chemical_equilibrium', subtopic: 'le_chateliers_principle',
    skills: ['le_chatelier_shift_prediction'],
    difficulty: 3, exam_weight: 2, xp: 10, order: 4,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p2',
    clues: '- The system opposes the disturbance by using up some of what was added.\n- Both reactants appear on the same side of the equation, so they respond in the same way; temperature is unchanged.',
  },
  {
    name: 'Question 5',
    question: 'Initially, 0,4 mol H₂(g), 0,4 mol CO₂(g), 0,1 mol H₂O(g) and 0,1 mol CO(g) are sealed in a 2 dm³ flask at T °C. Equilibrium is reached: H₂(g) + CO₂(g) ⇌ H₂O(g) + CO(g). Kc = 2,25 at T °C. Calculate the mass of CO₂(g) in the flask at equilibrium, in g (round off to a minimum of TWO decimal places): []',
    metadata: ['m(CO₂) = ', '[ ]', ' g'],
    answer: ['8.80|8.8', '', '', '', ''],
    presentation: 'fitb', keyboard_type: 'standard_math', type: 'calc',
    unit: 'chemical_change', topic: 'chemical_equilibrium', subtopic: 'equilibrium_constant_kc',
    skills: ['kc_calculation'],
    difficulty: 5, exam_weight: 3, xp: 20, order: 5,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p2',
    clues: '- Set up an initial/change/equilibrium table with the same change x for all four gases (1 : 1 : 1 : 1), then divide by 2 dm³.\n- Both sides of the Kc expression are squares here, so taking the square root gives a simple linear equation in x.',
  },
];

const aiExplanation = {
  sub_questions: [
    {
      number: '6.1.1',
      marks: 2,
      clues: '- Equilibrium is dynamic: both reactions continue.\n- Compare the RATES of the two reactions.',
      approach: '- State the condition that defines equilibrium in terms of rates.\n- Or state it in terms of constant concentrations.',
      solution: '1. Chemical equilibrium is the dynamic equilibrium where the rate of the forward reaction equals the rate of the reverse reaction (equivalently, the stage at which the concentrations of reactants and products remain constant).',
    },
    {
      number: '6.1.2',
      marks: 1,
      clues: '- Adding a gas makes ITS concentration jump up suddenly at that instant.\n- Look for the curve with a vertical jump upwards at t₁.',
      approach: '- Find which curve jumps upward at t₁.\n- That curve is the gas that was added.',
      solution: '1. Only curve X jumps upward suddenly at t₁, so X represents O₂(g).',
    },
    {
      number: '6.1.3',
      marks: 1,
      clues: '- At t₂ ALL the curves drop suddenly.\n- Concentrations fall together when the same gas is spread out in a larger volume.',
      approach: '- Note the direction of the sudden change at t₂.\n- Link a larger volume to a lower pressure.',
      solution: '1. DECREASED.',
    },
    {
      number: '6.1.4',
      marks: 1,
      clues: '- What happens to all the concentrations at t₂?\n- Which reaction is favoured afterwards?',
      approach: '- Describe the sudden change in concentrations at t₂.\n- Give it as the reason.',
      solution: '1. The concentrations of all the gases decreased suddenly at t₂ (afterwards the reverse reaction, which produces more gas moles, was favoured).',
    },
    {
      number: '6.1.5',
      marks: 1,
      clues: '- X is O₂. The remaining gases are CO (a reactant) and CO₂ (the product).\n- After t₁ the reactants are used up together while the product increases.',
      approach: '- Compare the behaviour of Y and Z with that of X after each change.\n- The curve that follows the same trend as O₂ is the other reactant.',
      solution: '1. Z is carbon monoxide, CO(g).',
    },
    {
      number: '6.1.6',
      marks: 1,
      clues: '- Compare how Z changes with how X changes after t₁ and t₃.\n- Reactants on the same side of the equation move in the same direction.',
      approach: '- Describe how Z changes relative to X.\n- Conclude that Z is a reactant, like X.',
      solution: '1. The concentration of Z decreases whenever the concentration of X (O₂) decreases (and increases when X increases): Z follows the same trend as O₂, so both are reactants, while Y (CO₂) is the product.',
    },
    {
      number: '6.1.7',
      marks: 1,
      clues: '- At t₃ there is no sudden jump; the curves change gradually.\n- Y (the product) increases while X and Z decrease.',
      approach: '- Decide which reaction is favoured after t₃.\n- Use ΔH < 0 to decide the temperature change.',
      solution: '1. DECREASED.',
    },
    {
      number: '6.1.8',
      marks: 3,
      clues: '- After t₃ the product concentration increases, so the forward reaction is favoured.\n- ΔH < 0 tells you which direction is exothermic.',
      approach: '- State what the graph shows after t₃.\n- State that the forward reaction is exothermic.\n- State that a decrease in temperature favours the exothermic reaction.',
      solution: '1. After t₃ the concentration of the product (Y, CO₂) increases and the reactants decrease: the forward reaction is favoured.\n2. The forward reaction is exothermic (ΔH < 0).\n3. A decrease in temperature favours the exothermic reaction, so the temperature was decreased.',
    },
    {
      number: '6.2',
      marks: 9,
      clues: '- Use a table: initial moles, change (1 : 1 : 1 : 1 ratio), equilibrium moles, equilibrium concentration (÷ 2 dm³).\n- Kc = [CO₂][H₂] / ([CO][H₂O]) = 4, and both top and bottom are perfect squares.',
      approach: '- Let x mol CO react: n(CO) = 0,6 − x, n(H₂O) = 0,6 − x, n(CO₂) = 0,1 + x, n(H₂) = 0,1 + x.\n- Substitute the concentrations into Kc = 4 and solve for x.\n- n(CO) at equilibrium = 0,6 − x, then m = n × 28 g·mol⁻¹.',
      solution: '1. Equilibrium amounts: CO and H₂O: 0,6 − x; CO₂ and H₂: 0,1 + x. Concentrations: divide each by 2 dm³.\n2. Kc = [(0,1 + x)/2]² / [(0,6 − x)/2]² = 4, so (0,1 + x)/(0,6 − x) = 2.\n3. 0,1 + x = 1,2 − 2x, so 3x = 1,1 and x = 0,367 mol (0,37).\n4. n(CO) = 0,6 − 0,37 = 0,23 mol.\n5. m(CO) = 0,23 × 28 = 6,44 g (keeping x unrounded gives 6,53 g; the memo accepts 6,44 to 6,72 g).',
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
