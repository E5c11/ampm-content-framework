#!/usr/bin/env node
/**
 * DBE Physical Sciences: Chemistry P2 — November 2025 — Question 6 (order 10)
 * Chemical Equilibrium — Le Chatelier's principle, Kc calculations. 17 marks, one
 * continuous question (6.1 solid-dissolution equilibrium, 6.2 gas-phase Kc calc).
 *
 *   node tools/validate-questions.js --script scripts/add-physics-2025-nov-p2-q6.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-physics-2025-nov-p2-q6.js --dry-run
 *   node scripts/add-physics-2025-nov-p2-q6.js
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
  name: 'Question 6',
  syllabus: 'dbe',
  subject: 'physics',
  year: 2025,
  paper: 'nov_p2',
  order: 10,
  content_tier: 'free',
  has_video: false,
  xp: 45,
  tags: ['chemical_equilibrium', 'equilibrium_constant'],
  question_image_urls: [`${PAPER}/q10/question_1.png`],
  memo_image_urls: [`${PAPER}/q10/memo_1.png`, `${PAPER}/q10/memo_2.png`, `${PAPER}/q10/memo_3.png`, `${PAPER}/q10/memo_4.png`],
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
      'Silver chloride dissolves according to the equilibrium: AgCl(s) ⇌ Ag⁺(aq) + Cl⁻(aq). Select ALL of the following changes that will INCREASE the mass of AgCl(s) at equilibrium, at constant temperature.',
    metadata: ['Adding solid NaCl to the mixture', 'Adding solid AgNO₃ to the mixture', 'Adding water to dilute the mixture', 'Removing some Ag⁺(aq) from the mixture', ''],
    answer: ['Adding solid NaCl to the mixture', 'Adding solid AgNO₃ to the mixture', '', '', ''],
    presentation: 'multi_select',
    type: 'application',
    unit: 'chemical_change',
    topic: 'chemical_equilibrium',
    subtopic: 'le_chateliers_principle',
    skills: ['le_chatelier_shift_prediction'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p2',
    clues:
      "- Adding an ion already in the equilibrium (from either NaCl or AgNO₃) pushes the reaction toward the solid.\n- Diluting the mixture or removing an ion both push the reaction the other way, toward dissolving more solid.",
  },
  {
    name: 'Question 2',
    question:
      'Which ONE of the following correctly explains why the mass of AgCl(s) increases when NaCl(s) is added to the equilibrium mixture?',
    metadata: [
      'The increase in Cl⁻ concentration favours the forward (dissolving) reaction, producing more Ag⁺',
      'The increase in Cl⁻ concentration favours the reverse reaction, so more AgCl(s) forms',
      'Adding NaCl increases the temperature of the system',
      'AgCl(s) is unaffected by changes in ion concentration',
      '',
    ],
    answer: ['The increase in Cl⁻ concentration favours the reverse reaction, so more AgCl(s) forms', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'chemical_change',
    topic: 'chemical_equilibrium',
    subtopic: 'le_chateliers_principle',
    skills: ['le_chatelier_shift_prediction'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p2',
    clues:
      "- When a disturbance is applied, the system shifts to oppose (partially cancel) that disturbance.\n- Adding Cl⁻ is a disturbance that increases the amount of one of the products.",
  },
  {
    name: 'Question 3',
    question:
      "The table below shows how the equilibrium constant, Kc, for a reaction changes with temperature: at 30°C, Kc = 2,1 × 10⁻³; at 50°C, Kc = 8,4 × 10⁻³; at 70°C, Kc = 3,0 × 10⁻². Is the forward reaction EXOTHERMIC or ENDOTHERMIC?",
    metadata: [
      'Exothermic — Kc increases as temperature increases, showing the forward reaction is favoured by heating',
      'Endothermic — Kc decreases as temperature increases',
      'Endothermic — Kc increases as temperature increases, showing the forward reaction is favoured by heating',
      'Cannot be determined from Kc values alone',
      '',
    ],
    answer: ['Endothermic — Kc increases as temperature increases, showing the forward reaction is favoured by heating', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'interpretation',
    unit: 'chemical_change',
    topic: 'chemical_equilibrium',
    subtopic: 'le_chateliers_principle',
    skills: ['kc_temperature_trend_analysis'],
    difficulty: 3,
    exam_weight: 2,
    xp: 15,
    order: 3,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p2',
    clues:
      "- A rising Kc with rising temperature means the forward reaction is increasingly favoured at higher temperatures.\n- By Le Chatelier's principle, heating an equilibrium always favours the reaction that absorbs heat.",
  },
  {
    name: 'Question 4',
    question:
      '0,60 mol of PCl₅(g) is placed in a 2 dm³ container and allowed to reach equilibrium at a certain temperature: PCl₅(g) ⇌ PCl₃(g) + Cl₂(g). At equilibrium, 0,20 mol of PCl₅(g) remains. Calculate the value of Kc for this reaction at this temperature: []',
    metadata: ['Kc = ', '[ ]'],
    answer: ['0.4', '', '', '', ''],
    presentation: 'fitb',
    type: 'calc',
    unit: 'chemical_change',
    topic: 'chemical_equilibrium',
    subtopic: 'equilibrium_constant_kc',
    skills: ['kc_calculation'],
    difficulty: 3,
    exam_weight: 3,
    xp: 15,
    order: 4,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p2',
    clues:
      '- Use an ICE table: the change in moles of PCl₅ equals the moles of PCl₃ and Cl₂ formed, in a 1:1:1 ratio.\n- Convert equilibrium moles to concentrations using the container volume before substituting into the Kc expression.',
  },
];

const aiExplanation = {
  sub_questions: [
    {
      number: '6.1.1',
      marks: 2,
      clues: "- The principle describes how a system at equilibrium responds when something about it is changed.\n- The response always works against the change, not with it.",
      approach: '- State what happens to the equilibrium when it is disturbed, and in which direction the system shifts.',
      solution: "1. When the equilibrium in a closed system is disturbed, the system re-instates a new equilibrium.\n2. It does so by favouring the reaction that will cancel out (oppose) the disturbance.",
    },
    {
      number: '6.1.2',
      marks: 1,
      clues: '- Adding HCℓ(conc.) introduces H⁺ ions, which react with OH⁻ ions already in the equilibrium mixture.\n- Removing OH⁻ ions is itself a disturbance to the Ca(OH)₂ equilibrium.',
      approach: '- Decide which direction the equilibrium shifts when OH⁻ ions are removed by the added acid.',
      solution: '1. HCℓ(conc.) reacts with and removes OH⁻ ions from solution.\n2. The mass of Ca(OH)₂(s) decreases.',
    },
    {
      number: '6.1.3',
      marks: 2,
      clues: "- The disturbance here is a decrease in the amount/concentration of OH⁻ ions.\n- The system responds by favouring whichever reaction replaces the OH⁻ ions that were removed.",
      approach: '- Identify the disturbance (decrease in OH⁻).\n- State which reaction direction is favoured to oppose it, and what effect this has on Ca(OH)₂(s).',
      solution: '1. The acid decreases the amount/concentration of OH⁻ ions in the mixture.\n2. This favours the forward reaction (more Ca(OH)₂(s) dissolving) to replace the OH⁻ ions removed.\n3. Since the forward reaction is favoured, the mass of Ca(OH)₂(s) decreases.',
    },
    {
      number: '6.2.1',
      marks: 1,
      clues: '- The Kc values in the table increase as temperature increases.\n- A reaction favoured by an increase in temperature absorbs heat.',
      approach: '- Read how Kc changes with increasing temperature in the given table.',
      solution: '1. Kc increases as temperature increases (7,5 × 10⁻² at 200°C to 40 × 10⁻² at 300°C).\n2. The decomposition of NH₄HS(s) is endothermic.',
    },
    {
      number: '6.2.2',
      marks: 3,
      clues: "- An increasing Kc with increasing temperature means the forward reaction becomes more favoured at higher temperature.\n- Le Chatelier's principle links a temperature increase to whichever reaction absorbs heat.",
      approach: "- State how Kc changes with temperature.\n- Link this trend to which reaction (forward/reverse) is favoured, and to whether that reaction is endothermic or exothermic.",
      solution: "1. With an increase in temperature, the Kc value increases.\n2. This shows the concentration of products increases (the forward reaction is favoured) at higher temperature.\n3. By Le Chatelier's principle, an increase in temperature favours the endothermic reaction — confirming the forward (decomposition) reaction is endothermic.",
    },
    {
      number: '6.2.3',
      marks: 8,
      clues: '- Convert the initial mass of NH₄HS(s) to moles using its molar mass (51 g·mol⁻¹) before setting up the ICE table.\n- NH₃(g) and H₂S(g) form in a 1:1 mole ratio from the NH₄HS(s) that decomposes; divide equilibrium moles by the 3 dm³ volume to get concentrations for the Kc expression.',
      approach: '- Calculate the initial moles of NH₄HS(s), then let x be the moles of NH₄HS(s) that decompose at equilibrium.\n- Write the Kc expression in terms of x, substitute the given Kc = 18 × 10⁻² at 250°C, and solve for x.\n- Use x to find the equilibrium moles (and then mass) of NH₄HS(s) remaining.',
      solution: '1. n(NH₄HS)initial = 70 ÷ 51 = 1,37 mol.\n2. Let x = moles of NH₄HS(s) decomposed; at equilibrium, n(NH₃) = n(H₂S) = x, each at concentration x/3 mol·dm⁻³.\n3. Kc = [NH₃][H₂S] = (x/3)² = 18 × 10⁻²; solving gives x ≈ 1,27 mol.\n4. n(NH₄HS)eq = 1,37 − 1,27 = 0,10 mol; m(NH₄HS)eq = 0,10 × 51 ≈ 5,1 g (accepted range 4,96–5,74 g depending on rounding/method).',
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
