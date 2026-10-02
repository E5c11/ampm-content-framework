#!/usr/bin/env node
/**
 * DBE Physical Sciences: Chemistry P2 — November 2024 — Question 8 (order 12)
 * Electrochemistry — oxidation numbers and redox, oxidising/reducing agent strength
 * (metals with HCℓ, copper with HNO₃), net ionic equation from cell notation, effect
 * of a stronger reducing agent on emf. 12 marks.
 *
 *   node tools/validate-questions.js --script scripts/add-physics-2024-nov-p2-q8.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-physics-2024-nov-p2-q8.js --dry-run
 *   node scripts/add-physics-2024-nov-p2-q8.js
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
  name: 'Question 8',
  syllabus: 'dbe',
  subject: 'physics',
  year: 2024,
  paper: 'nov_p2',
  order: 12,
  content_tier: 'free',
  has_video: false,
  xp: 70,
  tags: ['electrochemistry', 'galvanic_cells'],
  question_image_urls: [`${PAPER}/q12/question_1.png`],
  memo_image_urls: [`${PAPER}/q12/memo_1.png`],
  exam_question_marks: 12,
  supplementary_materials: [FORMULA_SHEET],
};

const questions = [
  {
    name: 'Question 1',
    question: 'Zinc reacts with dilute sulphuric acid: Zn(s) + 2H⁺(aq) → Zn²⁺(aq) + H₂(g). Which ONE of the following uses oxidation numbers correctly to show that this is a redox reaction?',
    metadata: [
      'The oxidation number of Zn decreases from +2 to 0; that of H increases from 0 to +1',
      'The oxidation number of Zn increases from 0 to +2; that of H decreases from +1 to 0',
      'The oxidation number of Zn increases from 0 to +2; that of S decreases from +6 to 0',
      'The oxidation number of Zn increases from 0 to +2; that of H increases from 0 to +1',
      '',
    ],
    answer: ['The oxidation number of Zn increases from 0 to +2; that of H decreases from +1 to 0', '', '', '', ''],
    presentation: 'multiple_choice', type: 'application',
    unit: 'chemical_change', topic: 'electrochemistry', subtopic: 'standard_electrode_potentials',
    skills: ['oxidation_number_analysis'],
    difficulty: 2, exam_weight: 2, xp: 10, order: 1,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p2',
    clues: '- An uncombined element always has an oxidation number of 0; a simple ion has its charge.\n- In a redox reaction one oxidation number goes up and another goes down.',
  },
  {
    name: 'Question 2',
    question: 'Using Table 4 of the data sheet, select ALL the metals below that will react with dilute hydrochloric acid, HCℓ(aq), under standard conditions.',
    metadata: ['Nickel, Ni', 'Silver, Ag', 'Zinc, Zn', 'Copper, Cu', 'Mercury, Hg'],
    answer: ['Nickel, Ni', 'Zinc, Zn', '', '', ''],
    presentation: 'multi_select', type: 'application',
    unit: 'chemical_change', topic: 'electrochemistry', subtopic: 'standard_electrode_potentials',
    skills: ['preferential_reduction_reasoning', 'redox_electrode_identification'],
    difficulty: 3, exam_weight: 2, xp: 10, order: 2,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p2',
    clues: '- The oxidising agent in dilute HCℓ is H⁺; find the H⁺/H₂ half-reaction (0,00 V) in Table 4.\n- A metal reduces H⁺ only if it is a STRONGER reducing agent than H₂.',
  },
  {
    name: 'Question 3',
    question: 'Dilute nitric acid, HNO₃(aq), is added to silver metal at 25 °C. Will the silver react? Which ONE of the following gives the correct answer and reason?',
    metadata: [
      'No; silver is a weaker reducing agent than hydrogen',
      'Yes; NO₃⁻ is a stronger oxidising agent than Ag⁺',
      'No; NO₃⁻ is a weaker oxidising agent than Ag⁺',
      'Yes; silver is a stronger reducing agent than hydrogen',
      '',
    ],
    answer: ['Yes; NO₃⁻ is a stronger oxidising agent than Ag⁺', '', '', '', ''],
    presentation: 'multiple_choice', type: 'application',
    unit: 'chemical_change', topic: 'electrochemistry', subtopic: 'standard_electrode_potentials',
    skills: ['preferential_reduction_reasoning'],
    difficulty: 4, exam_weight: 3, xp: 15, order: 3,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p2',
    clues: '- Nitric acid contains a second possible oxidising agent besides H⁺: find the nitrate half-reactions in Table 4.\n- Compare that oxidising agent with Ag⁺, the oxidised form of silver.',
  },
  {
    name: 'Question 4',
    question: 'A galvanic cell is represented by: Ni(s) | Ni²⁺(aq) || Fe³⁺(aq), Fe²⁺(aq) | Pt(s). Which ONE of the following is the balanced net ionic equation for this cell?',
    metadata: [
      'Ni + Fe³⁺ → Ni²⁺ + Fe²⁺',
      'Ni²⁺ + 2Fe²⁺ → Ni + 2Fe³⁺',
      'Ni + 2Fe³⁺ → Ni²⁺ + 2Fe²⁺',
      '3Ni + 2Fe³⁺ → 3Ni²⁺ + 2Fe',
      '',
    ],
    answer: ['Ni + 2Fe³⁺ → Ni²⁺ + 2Fe²⁺', '', '', '', ''],
    presentation: 'multiple_choice', type: 'application',
    unit: 'chemical_change', topic: 'electrochemistry', subtopic: 'cell_notation',
    skills: ['cell_notation_writing'],
    difficulty: 3, exam_weight: 3, xp: 15, order: 4,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p2',
    clues: '- The left of the notation is the anode (oxidation); the right is the cathode (reduction), and Pt is only an inert electrode.\n- Balance electrons: Ni loses 2, each Fe³⁺ gains 1. Check that the charges on both sides match.',
  },
  {
    name: 'Question 5',
    question: 'Calculate the initial emf of the cell Ni(s) | Ni²⁺(aq) || Fe³⁺(aq), Fe²⁺(aq) | Pt(s) under standard conditions, in V (round off to a minimum of TWO decimal places): []',
    metadata: ['E°cell = ', '[ ]', ' V'],
    answer: ['1.04', '', '', '', ''],
    presentation: 'fitb', type: 'calc',
    unit: 'chemical_change', topic: 'electrochemistry', subtopic: 'galvanic_cells',
    skills: ['cell_emf_calculation'],
    difficulty: 2, exam_weight: 2, xp: 15, order: 5,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p2',
    clues: '- Use E°cell = E°cathode − E°anode with reduction potentials from Table 4.\n- The cathode here is the Fe³⁺ to Fe²⁺ half-reaction, NOT Fe³⁺ to Fe.',
  },
  {
    name: 'Question 6',
    question: 'In the nickel–iron(III) cell above, the Ni half-cell is replaced by a Zn half-cell, with the same Fe³⁺/Fe²⁺ half-cell and standard conditions. How does the initial emf compare with that of the original cell?',
    metadata: [
      'It increases, because Zn is a stronger reducing agent than Ni',
      'It stays the same, because the oxidising agent has not changed',
      'It decreases, because Zn²⁺ is a weaker oxidising agent than Ni²⁺',
      'It decreases, because Zn is a stronger reducing agent than Ni',
      '',
    ],
    answer: ['It increases, because Zn is a stronger reducing agent than Ni', '', '', '', ''],
    presentation: 'multiple_choice', type: 'application',
    unit: 'chemical_change', topic: 'electrochemistry', subtopic: 'galvanic_cells',
    skills: ['galvanic_cell_principles', 'cell_emf_calculation'],
    difficulty: 3, exam_weight: 2, xp: 10, order: 6,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p2',
    clues: '- The emf grows as the GAP between the oxidising agent and the reducing agent in Table 4 grows.\n- Compare where Zn and Ni sit in Table 4.',
  },
];

const aiExplanation = {
  sub_questions: [
    {
      number: '8.1.1',
      marks: 2,
      clues: '- Give the oxidation number of Mg and of H before and after the reaction.\n- Redox needs one increase AND one decrease.',
      approach: '- Assign oxidation numbers to Mg and H in the reactants and products.\n- State the change for each.',
      solution: '1. The oxidation number of Mg changes from 0 to +2 (oxidation).\n2. The oxidation number of H changes from +1 to 0 (reduction).\n3. Electrons are transferred, so the reaction is a redox reaction.',
    },
    {
      number: '8.1.2',
      marks: 1,
      clues: '- The oxidising agent is the species that is REDUCED.\n- Whose oxidation number decreases?',
      approach: '- Identify the species whose oxidation number decreases.\n- Write its formula.',
      solution: '1. H⁺ (from HCℓ) is reduced to H₂, so the oxidising agent is H⁺ (HCℓ).',
    },
    {
      number: '8.1.3',
      marks: 2,
      clues: '- For copper to react, it must reduce H⁺ to H₂.\n- Compare Cu and H₂ as reducing agents using Table 4.',
      approach: '- Locate Cu²⁺/Cu (+0,34 V) and H⁺/H₂ (0,00 V) in Table 4.\n- Compare the strengths of Cu and H₂ as reducing agents.',
      solution: '1. Cu is a weaker reducing agent than H₂.\n2. Cu cannot reduce H⁺ to H₂, so no reaction takes place.',
    },
    {
      number: '8.1.4',
      marks: 3,
      clues: '- Nitric acid contains NO₃⁻, which is a much stronger oxidising agent than H⁺.\n- Compare NO₃⁻ with Cu²⁺ in Table 4.',
      approach: '- Locate the NO₃⁻ half-reactions (+0,80 V and +0,96 V) and Cu²⁺/Cu (+0,34 V).\n- Decide whether NO₃⁻ can oxidise Cu.',
      solution: '1. YES.\n2. NO₃⁻ (nitrate ion) is a stronger oxidising agent than Cu²⁺.\n3. Therefore NO₃⁻ oxidises Cu to Cu²⁺.',
    },
    {
      number: '8.2.1',
      marks: 3,
      clues: '- Anode (left): Pb → Pb²⁺ + 2e⁻. Cathode (right): Fe³⁺ + e⁻ → Fe²⁺.\n- Multiply the cathode half-reaction by 2 so the electrons cancel.',
      approach: '- Write the oxidation and reduction half-reactions from the cell notation.\n- Balance electrons and add them.',
      solution: '1. Oxidation: Pb → Pb²⁺ + 2e⁻.\n2. Reduction (×2): 2Fe³⁺ + 2e⁻ → 2Fe²⁺.\n3. Net ionic equation: Pb + 2Fe³⁺ → Pb²⁺ + 2Fe²⁺.',
    },
    {
      number: '8.2.2',
      marks: 1,
      clues: '- E°cell = E°cathode − E°anode.\n- A stronger reducing agent has a more negative reduction potential.',
      approach: '- Decide how E°anode changes with a stronger reducing agent.\n- Decide the effect on E°cell.',
      solution: '1. INCREASES. A stronger reducing agent has a more negative E°anode, so E°cathode − E°anode becomes larger.',
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
