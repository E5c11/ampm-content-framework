#!/usr/bin/env node
/**
 * DBE Physical Sciences: Chemistry P2 — November 2024 — Question 9 (order 13)
 * Electrochemistry — spontaneity from E°cell, electrolyte definition, electrolysis of a
 * concentrated aqueous salt (predominant oxidation half-reaction, cathode products,
 * relative oxidising-agent strength). 13 marks.
 *
 *   node tools/validate-questions.js --script scripts/add-physics-2024-nov-p2-q9.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-physics-2024-nov-p2-q9.js --dry-run
 *   node scripts/add-physics-2024-nov-p2-q9.js
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
  name: 'Question 9',
  syllabus: 'dbe',
  subject: 'physics',
  year: 2024,
  paper: 'nov_p2',
  order: 13,
  content_tier: 'free',
  has_video: false,
  xp: 55,
  tags: ['electrochemistry', 'electrolysis'],
  question_image_urls: [`${PAPER}/q13/question_1.png`],
  memo_image_urls: [`${PAPER}/q13/memo_1.png`, `${PAPER}/q13/memo_2.png`],
  exam_question_marks: 13,
  supplementary_materials: [FORMULA_SHEET],
};

const questions = [
  {
    name: 'Question 1',
    question: 'A silver strip is placed in a 1 mol·dm⁻³ Cu(NO₃)₂ solution at 25 °C. Consider the reaction 2Ag(s) + Cu²⁺(aq) → 2Ag⁺(aq) + Cu(s). Using Table 4, which ONE of the following gives the correct E°cell and conclusion?',
    metadata: [
      'E°cell = +0,46 V; the reaction is spontaneous',
      'E°cell = −0,46 V; the reaction is non-spontaneous',
      'E°cell = +1,14 V; the reaction is spontaneous',
      'E°cell = −1,14 V; the reaction is non-spontaneous',
      '',
    ],
    answer: ['E°cell = −0,46 V; the reaction is non-spontaneous', '', '', '', ''],
    presentation: 'multiple_choice', type: 'calc',
    unit: 'chemical_change', topic: 'electrochemistry', subtopic: 'standard_electrode_potentials',
    skills: ['cell_emf_calculation'],
    difficulty: 3, exam_weight: 3, xp: 15, order: 1,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p2',
    clues: '- In the reaction as written, find which species is REDUCED: its half-reaction is the "cathode" value.\n- E°cell = E°cathode − E°anode; do not multiply E° values by the coefficients in the equation.',
  },
  {
    name: 'Question 2',
    question: 'Which ONE of the following is a correct definition of an electrolyte?',
    metadata: [
      'A substance that conducts electricity through the movement of free electrons',
      'A substance whose aqueous solution contains ions and conducts electricity',
      'A metal electrode at which oxidation or reduction takes place in a cell',
      'A substance that dissolves in water to form a solution of neutral molecules',
      '',
    ],
    answer: ['A substance whose aqueous solution contains ions and conducts electricity', '', '', '', ''],
    presentation: 'multiple_choice', type: 'definition',
    unit: 'chemical_change', topic: 'electrochemistry', subtopic: 'electrolyte_properties',
    skills: ['electrolyte_identification'],
    difficulty: 1, exam_weight: 2, xp: 10, order: 2,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p2',
    clues: '- In a solution, charge is carried by moving charged particles, not by electrons.\n- An electrolyte is the substance in solution, not one of the electrodes.',
  },
  {
    name: 'Question 3',
    question: 'A concentrated potassium bromide solution, KBr(aq), is electrolysed using carbon electrodes. Which ONE of the following is the PREDOMINANT oxidation half-reaction?',
    metadata: [
      '2Br⁻ → Br₂ + 2e⁻',
      '2H₂O → O₂ + 4H⁺ + 4e⁻',
      'K → K⁺ + e⁻',
      'Br₂ + 2e⁻ → 2Br⁻',
      '',
    ],
    answer: ['2Br⁻ → Br₂ + 2e⁻', '', '', '', ''],
    presentation: 'multiple_choice', type: 'application',
    unit: 'chemical_change', topic: 'electrochemistry', subtopic: 'electrolytic_cells',
    skills: ['preferential_reduction_reasoning', 'redox_electrode_identification'],
    difficulty: 3, exam_weight: 2, xp: 10, order: 3,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p2',
    clues: '- Oxidation means LOSING electrons, so the electrons must appear on the product side.\n- At the anode, the species oxidised is the strongest reducing agent actually present in the solution.',
  },
  {
    name: 'Question 4',
    question: 'In the electrolysis of concentrated KBr(aq) with carbon electrodes, select ALL the products formed at the electrode connected to the NEGATIVE terminal of the battery.',
    metadata: ['Potassium metal, K', 'Hydrogen gas, H₂', 'Bromine, Br₂', 'Hydroxide ions, OH⁻', 'Oxygen gas, O₂'],
    answer: ['Hydrogen gas, H₂', 'Hydroxide ions, OH⁻', '', '', ''],
    presentation: 'multi_select', type: 'application',
    unit: 'chemical_change', topic: 'electrochemistry', subtopic: 'electrolytic_cells',
    skills: ['preferential_reduction_reasoning'],
    difficulty: 4, exam_weight: 3, xp: 15, order: 4,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p2',
    clues: '- The negative electrode is the cathode, where reduction takes place.\n- Two oxidising agents compete there: K⁺ and H₂O. Find both in Table 4 and see what the winner forms.',
  },
  {
    name: 'Question 5',
    question: 'During the electrolysis of an aqueous solution, the STRONGEST oxidising agent present is reduced at the cathode. Using Table 4, arrange the following oxidising agents in order of INCREASING strength (weakest first).',
    metadata: ['H₂O', 'Cu²⁺', 'K⁺', 'Na⁺'],
    answer: ['K⁺', 'Na⁺', 'H₂O', 'Cu²⁺'],
    presentation: 'ordering', type: 'application',
    unit: 'chemical_change', topic: 'electrochemistry', subtopic: 'electrolytic_cells',
    skills: ['preferential_reduction_reasoning'],
    difficulty: 3, exam_weight: 2, xp: 10, order: 5,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p2',
    clues: '- Find each species on the LEFT of a half-reaction in Table 4 and note its E° value.\n- The more positive the reduction potential, the stronger the oxidising agent.',
  },
];

const aiExplanation = {
  sub_questions: [
    {
      number: '9.1',
      marks: 5,
      clues: '- In the reaction as written, Pb²⁺ is reduced (cathode) and Ag is oxidised (anode).\n- A positive E°cell means spontaneous; a negative value means non-spontaneous.',
      approach: '- Write the formula E°cell = E°reduction − E°oxidation.\n- Substitute E°(Pb²⁺ to Pb) = −0,13 V and E°(Ag⁺ to Ag) = +0,80 V.\n- Use the sign of E°cell to decide.',
      solution: '1. E°cell = E°reduction − E°oxidation.\n2. E°cell = −0,13 − (+0,80) = −0,93 V.\n3. E°cell is negative, so the reaction is NON-SPONTANEOUS.',
    },
    {
      number: '9.2.1',
      marks: 2,
      clues: '- An electrolyte conducts because it contains ions.\n- It can be a solution or a molten substance.',
      approach: '- State what an electrolyte forms in water or when molten.\n- Link it to conduction.',
      solution: '1. An electrolyte is a substance whose aqueous solution contains ions (it dissolves in water to form a solution that conducts electricity).',
    },
    {
      number: '9.2.2',
      marks: 2,
      clues: '- Concentrated NaCℓ contains a high concentration of Cℓ⁻ ions.\n- Oxidation produces electrons, so they appear on the product side.',
      approach: '- Identify the species oxidised at the anode in concentrated NaCℓ(aq).\n- Write its half-reaction with electrons on the right.',
      solution: '1. In concentrated NaCℓ(aq), chloride ions are oxidised at the anode.\n2. 2Cℓ⁻ → Cℓ₂ + 2e⁻.',
    },
    {
      number: '9.2.3',
      marks: 2,
      clues: '- Electrode Q is the cathode (reduction), since Cℓ⁻ is oxidised at the other electrode.\n- Compare Na⁺ and H₂O as oxidising agents.',
      approach: '- Decide which species is reduced at Q.\n- Write down the products of that reduction.',
      solution: '1. Water is reduced at Q: 2H₂O + 2e⁻ → H₂ + 2OH⁻.\n2. Products: hydrogen gas (H₂) and hydroxide ions (OH⁻), i.e. sodium hydroxide in solution.',
    },
    {
      number: '9.2.4',
      marks: 2,
      clues: '- Compare the positions of Na⁺/Na and H₂O/H₂ in Table 4.\n- The stronger oxidising agent is reduced.',
      approach: '- Compare Na⁺ and H₂O as oxidising agents.\n- State which one is reduced.',
      solution: '1. H₂O is a stronger oxidising agent than Na⁺.\n2. Therefore H₂O is reduced (to H₂ and OH⁻), not Na⁺.',
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
