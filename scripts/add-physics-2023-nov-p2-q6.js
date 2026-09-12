#!/usr/bin/env node
/**
 * DBE Physical Sciences: Chemistry P2 — November 2023 — Question 6 (order 10)
 * Chemical Equilibrium — Le Chatelier's principle, Kc calculation, temperature
 * effects on Kc, catalyst effect on equilibrium. 19 marks, one continuous
 * scenario (2AB(g) ⇌ A₂(g) + B₂(g), a mole-vs-time graph).
 *
 *   node tools/validate-questions.js --script scripts/add-physics-2023-nov-p2-q6.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-physics-2023-nov-p2-q6.js --dry-run
 *   node scripts/add-physics-2023-nov-p2-q6.js
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
  name: 'Question 6',
  syllabus: 'dbe',
  subject: 'physics',
  year: 2023,
  paper: 'nov_p2',
  order: 10,
  content_tier: 'free',
  has_video: false,
  xp: 55,
  tags: ['chemical_equilibrium', 'le_chatelier', 'equilibrium_constant'],
  question_image_urls: [`${PAPER}/q10/question_1.png`],
  memo_image_urls: [`${PAPER}/q10/memo_1.png`, `${PAPER}/q10/memo_2.png`, `${PAPER}/q10/memo_3.png`],
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
    question: "Which ONE of the following correctly states Le Chatelier's principle?",
    metadata: [
      'A system at equilibrium always shifts to increase the amount of product formed',
      "When a system at equilibrium is disturbed, it will restore a new equilibrium by favouring the reaction that cancels/opposes the disturbance",
      'A catalyst shifts the equilibrium position to favour whichever reaction it speeds up more',
      'At equilibrium, the concentrations of all reactants and products are always exactly equal',
      '',
    ],
    answer: ["When a system at equilibrium is disturbed, it will restore a new equilibrium by favouring the reaction that cancels/opposes the disturbance", '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'definition',
    unit: 'chemical_change',
    topic: 'chemical_equilibrium',
    subtopic: 'le_chateliers_principle',
    skills: ['le_chatelier_shift_prediction'],
    difficulty: 1,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2023,
    paper: 'nov_p2',
    clues: '- The principle describes how a system RESPONDS to a disturbance, not a fixed rule about which side always wins.\n- The direction favoured always works to reduce the effect of whatever disturbance was applied.',
  },
  {
    name: 'Question 2',
    question:
      'The reaction PQ(g) ⇌ P(g) + Q(g) reaches equilibrium in a 2 dm³ container at a certain temperature, with 4 mol PQ(g), 2 mol P(g) and 2 mol Q(g) present. Calculate the value of the equilibrium constant, Kc, at this temperature (round off to a minimum of TWO decimal places): []',
    metadata: ['Kc = ', '[ ]'],
    answer: ['0.50', '', '', '', ''],
    presentation: 'fitb',
    type: 'calc',
    unit: 'chemical_change',
    topic: 'chemical_equilibrium',
    subtopic: 'equilibrium_constant_kc',
    skills: ['kc_calculation'],
    difficulty: 2,
    exam_weight: 3,
    xp: 15,
    order: 2,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2023,
    paper: 'nov_p2',
    clues: '- Convert every mole value to a concentration by dividing by the container volume before substituting into the Kc expression.\n- Products go in the numerator and the reactant goes in the denominator, matching the balanced equation.',
  },
  {
    name: 'Question 3',
    question:
      'The forward reaction in the equilibrium A(g) + B(g) ⇌ C(g) is EXOTHERMIC. The temperature of the equilibrium mixture is increased, with volume and pressure kept constant. Which ONE of the following correctly describes what happens to the position of equilibrium and to Kc?',
    metadata: [
      'Equilibrium shifts right (toward products); Kc increases',
      'Equilibrium shifts left (toward reactants); Kc stays the same',
      'Equilibrium shifts left (toward reactants); Kc decreases',
      'Equilibrium shifts right (toward products); Kc stays the same',
      '',
    ],
    answer: ['Equilibrium shifts left (toward reactants); Kc decreases', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'chemical_change',
    topic: 'chemical_equilibrium',
    subtopic: 'equilibrium_constant_kc',
    skills: ['le_chatelier_shift_prediction', 'kc_temperature_trend_analysis'],
    difficulty: 3,
    exam_weight: 3,
    xp: 15,
    order: 3,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2023,
    paper: 'nov_p2',
    clues:
      "- Raising the temperature always favours the ENDOTHERMIC direction of a reaction, regardless of which direction that happens to be.\n- Kc changes value whenever temperature changes; it is unaffected by concentration, volume, or catalyst changes alone.",
  },
  {
    name: 'Question 4',
    question: 'A catalyst is added to a reaction mixture that is already at equilibrium, with temperature and volume kept constant. Select ALL of the following that correctly describe the effect of this catalyst.',
    metadata: [
      'It increases the rate of both the forward AND the reverse reaction, by the same factor',
      'The system reaches a new equilibrium position in LESS time than it otherwise would',
      'It shifts the equilibrium position to favour more product',
      'It increases the value of Kc at that temperature',
      '',
    ],
    answer: ['It increases the rate of both the forward AND the reverse reaction, by the same factor', 'The system reaches a new equilibrium position in LESS time than it otherwise would', '', '', ''],
    presentation: 'multi_select',
    type: 'application',
    unit: 'chemical_change',
    topic: 'chemical_equilibrium',
    subtopic: 'activation_energy_diagrams',
    skills: ['catalyst_mechanism_reasoning'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2023,
    paper: 'nov_p2',
    clues: '- A catalyst lowers the activation energy for BOTH directions of a reversible reaction, by the same amount.\n- The equilibrium position and Kc are properties of temperature only — check whether a catalyst changes temperature.',
  },
  {
    name: 'Question 5',
    question:
      'The graph below shows [X(g)] and [Y(g)] over time for the equilibrium 2X(g) ⇌ Y(g) in a closed container at constant temperature and volume. At t = 60 s, extra X(g) is suddenly added. Which ONE of the following correctly describes what happens between t = 60 s and t = 120 s?',
    metadata: [
      'The reverse reaction is favoured; [Y(g)] decreases while [X(g)] increases further',
      'The forward reaction is favoured; some of the added X(g) is converted to Y(g), and a new equilibrium is reached',
      'No further change occurs; the system remains at the disturbed [X(g)] and [Y(g)] values',
      'The reaction stops completely, since the equilibrium was disturbed',
      '',
    ],
    answer: ['The forward reaction is favoured; some of the added X(g) is converted to Y(g), and a new equilibrium is reached', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'chemical_change',
    topic: 'chemical_equilibrium',
    subtopic: 'le_chateliers_principle',
    skills: ['le_chatelier_shift_prediction'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 5,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2023,
    paper: 'nov_p2',
    clues:
      '- Look at how [X(g)] and [Y(g)] change AFTER the sudden jump at t = 60 s, not just at the instant of the jump itself.\n- Reaching a NEW equilibrium means both concentrations level off again, rather than changing forever or freezing at the disturbed values.',
    supplementary_material: {
      type: 'graph',
      label: 'Concentration vs Time',
      image_urls: ['https://media-dev.askmoreprepmore.app/question_supplementary/physics/2023/nov_p2/q10/graph_1.png'],
    },
  },
];

const aiExplanation = {
  sub_questions: [
    {
      number: '6.1',
      marks: 1,
      clues: "- A reversible reaction can proceed in more than one direction.\n- Think about what 'reversible' means for the products formed.",
      approach: '- Recall the definition of a reversible reaction.\n- State it in terms of products converting back to reactants.',
      solution: '1. A reversible reaction is one in which products can be converted back to reactants (and vice versa) — both the forward and reverse reactions can take place.',
    },
    {
      number: '6.2',
      marks: 2,
      clues: '- The principle describes a RESPONSE to a disturbance, in a direction that opposes it.\n- A new equilibrium is reached after the disturbance, not the same one as before.',
      approach: '- Recall the general statement of the principle.\n- Express it in terms of favouring the reaction that cancels the disturbance.',
      solution: "1. When the equilibrium in a closed system is disturbed, the system will re-instate a new equilibrium by favouring the reaction that cancels/opposes the disturbance.",
    },
    {
      number: '6.3.1',
      marks: 1,
      clues: '- Look at what happens to each of the three curves at exactly t = 80 s on the graph.\n- One quantity jumps upward suddenly at that instant — a sudden change like that means something was added or removed, not a gradual reaction effect.',
      approach: '- Read the graph at t = 80 s and note which curve jumps discontinuously.\n- State what change was made to cause that jump.',
      solution: '1. At t = 80 s, the amount of A₂(g) jumps upward suddenly.\n2. This means the amount/concentration of A₂(g) was increased (added to the container) at t = 80 s.',
    },
    {
      number: '6.3.2',
      marks: 2,
      clues: '- Adding more A₂(g) increases its amount above the equilibrium value.\n- The system respond in the direction that uses up some of the added A₂(g).',
      approach: "- Apply Le Chatelier's principle to the increase in A₂(g).\n- State which direction is favoured and what happens to the amounts of reactant/product as a result.",
      solution: '1. Increasing the amount of A₂(g) disturbs the equilibrium.\n2. The system favours the reverse reaction, which uses up the added A₂(g) (and B₂(g)) to reform AB(g).\n3. The amount of A₂(g) (and B₂(g)) decreases again after the initial jump, while AB(g) increases, until a new equilibrium is reached.',
    },
    {
      number: '6.4',
      marks: 4,
      clues: '- Read the equilibrium amounts of AB(g), A₂(g) and B₂(g) directly off the graph at t = 120 s.\n- Convert each amount to a concentration using the 4 dm³ container volume before substituting into Kc.',
      approach: '- Read n(AB), n(A₂) and n(B₂) at t = 120 s from the graph.\n- Divide each by 4 dm³ to get concentrations, then substitute into the Kc expression for this equilibrium.',
      solution:
        '1. At t = 120 s: n(AB) = 10 mol, n(A₂) = 8 mol, n(B₂) = 2 mol (read from the graph).\n2. Concentrations: [AB] = 10/4 = 2,5 mol·dm⁻³; [A₂] = 8/4 = 2 mol·dm⁻³; [B₂] = 2/4 = 0,5 mol·dm⁻³.\n3. Kc = [A₂][B₂] / [AB]² = (2)(0,5) / (2,5)² = 0,16.',
    },
    {
      number: '6.5.1',
      marks: 3,
      clues: '- The forward reaction absorbs energy overall — the products end up at a higher energy level than the reactants.\n- The activation energy hump still applies in the forward direction.',
      approach: '- Draw the reactants at a lower energy level than the products.\n- Show the activation energy hump between them, with the correct axis labels.',
      solution: "1. Since decreasing the temperature decreases Kc (an equilibrium yield decrease when cooled corresponds to an endothermic forward reaction), the potential energy diagram shows products at a HIGHER energy level than reactants.\n2. Both axes are labelled (potential/energy vs course of reaction), with the activation energy hump shown between reactants and products.",
    },
    {
      number: '6.5.2',
      marks: 3,
      clues: '- Decreasing the temperature always favours the EXOTHERMIC direction of a reaction.\n- If the forward reaction is endothermic, the reverse (favoured on cooling) is exothermic, meaning less product remains at equilibrium.',
      approach: "- Identify whether the forward reaction is exothermic or endothermic.\n- Apply Le Chatelier's principle to the temperature decrease, and state the resulting effect on Kc.",
      solution:
        '1. The forward reaction (formation of A₂ and B₂ from AB) is endothermic.\n2. Decreasing the temperature to 100 °C favours the exothermic reverse reaction, decreasing the amount of products at the new equilibrium.\n3. Kc at 100 °C is therefore LESS THAN Kc at 150 °C.',
    },
    {
      number: '6.6',
      marks: 3,
      clues: '- A catalyst does not change the equilibrium amounts reached, only how quickly they are reached.\n- Compare the gradient (steepness) of the curves with a catalyst present against the original graph over the same time interval.',
      approach: '- Recall that a catalyst speeds up both forward and reverse reactions equally.\n- Describe how the curves between t = 0 s and t = 60 s would look different with a catalyst present, without changing the final equilibrium values.',
      solution:
        '1. With a catalyst present, the gradients of all three curves would be steeper between t = 0 s and t = 60 s.\n2. The curves would reach the same equilibrium amounts as before, but sooner (before t = 60 s) rather than at t = 60 s.',
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
