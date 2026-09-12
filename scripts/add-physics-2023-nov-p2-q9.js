#!/usr/bin/env node
/**
 * DBE Physical Sciences: Chemistry P2 — November 2023 — Question 9 (order 13)
 * Electrochemistry — electrolysis definition, current calculation, electron
 * flow direction, ion accumulation during electrolytic refining. 12 marks,
 * one continuous scenario (electrolytic refining of impure copper, silver and
 * zinc impurities). Final lesson of this paper — 13/13.
 *
 *   node tools/validate-questions.js --script scripts/add-physics-2023-nov-p2-q9.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-physics-2023-nov-p2-q9.js --dry-run
 *   node scripts/add-physics-2023-nov-p2-q9.js
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
  name: 'Question 9',
  syllabus: 'dbe',
  subject: 'physics',
  year: 2023,
  paper: 'nov_p2',
  order: 13,
  content_tier: 'free',
  has_video: false,
  xp: 55,
  tags: ['electrochemistry', 'electrolysis', 'electrolytic_refining'],
  question_image_urls: [`${PAPER}/q13/question_1.png`],
  memo_image_urls: [`${PAPER}/q13/memo_1.png`, `${PAPER}/q13/memo_2.png`, `${PAPER}/q13/memo_3.png`],
  exam_question_marks: 12,
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
    question: 'Which ONE of the following correctly defines electrolysis?',
    metadata: [
      'The spontaneous conversion of chemical energy into electrical energy',
      'The use of electrical energy to bring about a non-spontaneous chemical change',
      'The reaction between a metal and an acid to produce hydrogen gas',
      'The process by which a battery loses charge over time',
      '',
    ],
    answer: ['The use of electrical energy to bring about a non-spontaneous chemical change', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'definition',
    unit: 'chemical_change',
    topic: 'electrochemistry',
    subtopic: 'electrolytic_cells',
    skills: ['electrolytic_vs_galvanic_distinction'],
    difficulty: 1,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2023,
    paper: 'nov_p2',
    clues: '- Electrolysis always needs an external power source to proceed — the reaction it drives would not happen on its own.\n- Compare this to a galvanic cell, which converts chemical energy into electrical energy spontaneously.',
  },
  {
    name: 'Question 2',
    question:
      'During the electrolytic refining of nickel, a current is passed through the cell for 3 hours, depositing 8,00 g of nickel at the cathode (M(Ni) = 58,5 g·mol⁻¹). Calculate the current used, in A (round off to a minimum of TWO decimal places): []',
    metadata: ['I = ', '[ ]', ' A'],
    answer: ['2.44', '', '', '', ''],
    presentation: 'fitb',
    type: 'calc',
    unit: 'chemical_change',
    topic: 'electrochemistry',
    subtopic: 'electrolytic_refining',
    skills: ['circuit_current_calculation'],
    difficulty: 3,
    exam_weight: 3,
    xp: 15,
    order: 2,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2023,
    paper: 'nov_p2',
    clues: '- Find the moles of Ni deposited first, then use the number of electrons needed per Ni²⁺ ion to find the total charge, Q.\n- Convert the given time to seconds before using I = Q/Δt.',
  },
  {
    name: 'Question 3',
    question:
      'The diagram below shows the electrolytic refining of nickel, with impure nickel at electrode R and pure nickel at electrode Q. Which ONE of the following correctly identifies the anode, and the direction electrons flow in the EXTERNAL circuit?',
    metadata: [
      'Q is the anode; electrons flow from Q to R',
      'R is the anode; electrons flow from Q to R',
      'R is the anode; electrons flow from R to Q',
      'Q is the anode; electrons flow from R to Q',
      '',
    ],
    answer: ['R is the anode; electrons flow from R to Q', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'chemical_change',
    topic: 'electrochemistry',
    subtopic: 'electrolytic_cells',
    skills: ['redox_electrode_identification'],
    difficulty: 2,
    exam_weight: 1,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2023,
    paper: 'nov_p2',
    clues:
      '- The electrode connected to the POSITIVE terminal of the power source is always the anode, in any electrolytic cell — read the diagram to see which electrode that is.\n- Electrons flow through the external circuit from the anode to the cathode, the same direction as in a galvanic cell.',
    supplementary_material: {
      type: 'diagram',
      label: 'Electrolytic Cell',
      image_urls: ['https://media-dev.askmoreprepmore.app/question_supplementary/physics/2023/nov_p2/q13/diagram_1.png'],
    },
  },
  {
    name: 'Question 4',
    question:
      'Impure lead (containing tin as the only impurity) is electrolytically refined. Pb²⁺ is a stronger oxidising agent than Sn²⁺. Select ALL of the following statements that are TRUE about this process.',
    metadata: [
      'Sn dissolves from the impure anode into the electrolyte, but is not reduced at the cathode',
      'The concentration of Sn²⁺(aq) in the electrolyte increases over time',
      'Sn²⁺ is preferentially reduced at the cathode instead of Pb²⁺',
      'Only Pb²⁺ is ever present in the electrolyte, since Sn does not dissolve from the anode',
      '',
    ],
    answer: ['Sn dissolves from the impure anode into the electrolyte, but is not reduced at the cathode', 'The concentration of Sn²⁺(aq) in the electrolyte increases over time', '', '', ''],
    presentation: 'multi_select',
    type: 'application',
    unit: 'chemical_change',
    topic: 'electrochemistry',
    subtopic: 'electrolytic_refining',
    skills: ['ion_accumulation_reasoning', 'preferential_reduction_reasoning'],
    difficulty: 3,
    exam_weight: 2,
    xp: 15,
    order: 4,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2023,
    paper: 'nov_p2',
    clues: '- Both metals in the impure anode dissolve into the electrolyte as it is oxidised, regardless of which ion is later reduced.\n- Only the stronger oxidising agent\'s ion is favoured for reduction back to solid metal at the cathode; the other ion has nowhere else to go, so it builds up.',
  },
  {
    name: 'Question 5',
    question:
      'Impure silver (containing gold as the only impurity) is electrolytically refined. Gold is NOT oxidised at the anode, even though the cell operates for a long time. Which ONE of the following correctly explains why?',
    metadata: [
      'Gold is a stronger reducing agent than silver, so it is oxidised first, before the silver',
      'Gold is a weaker reducing agent than silver, so it is not oxidised',
      'Gold does not conduct electricity, so no current reaches it',
      'The power source is too weak to oxidise silver, so nothing at the anode is oxidised',
      '',
    ],
    answer: ['Gold is a weaker reducing agent than silver, so it is not oxidised', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'chemical_change',
    topic: 'electrochemistry',
    subtopic: 'standard_electrode_potentials',
    skills: ['redox_electrode_identification'],
    difficulty: 3,
    exam_weight: 2,
    xp: 15,
    order: 5,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2023,
    paper: 'nov_p2',
    clues: '- The anode current is enough to oxidise silver, since the cell is refining the silver by design.\n- Compare the relative strengths of silver and gold as reducing agents to decide which one gives up its electrons more readily.',
  },
];

const aiExplanation = {
  sub_questions: [
    {
      number: '9.1',
      marks: 2,
      clues: '- Electrolysis always needs an external power source to proceed.\n- The process converts one specific form of energy into another.',
      approach: '- Recall the definition of electrolysis.\n- State which form of energy is converted into which.',
      solution: '1. Electrolysis is the chemical process in which electrical energy is converted to chemical energy.\n2. It uses electrical energy to bring about a chemical change that would not occur spontaneously.',
    },
    {
      number: '9.2',
      marks: 2,
      clues: '- Electrode Q is the cathode, where reduction takes place.\n- The electrolyte contains Cu²⁺(aq) ions, which are attracted to the cathode.',
      approach: '- Identify electrode Q as the cathode.\n- Write the reduction half-reaction that occurs there.',
      solution: '1. Electrode Q is the cathode, where reduction occurs.\n2. The reaction at Q is: Cu²⁺(aq) + 2e⁻ → Cu(s).',
    },
    {
      number: '9.3',
      marks: 1,
      clues: '- Electrode R (impure copper) is the anode, where oxidation occurs.\n- Electrons flow through the external circuit from the anode to the cathode.',
      approach: '- Identify which electrode is the anode.\n- State the direction electrons flow in the external circuit, from anode to cathode.',
      solution: '1. Electrode R is the anode (oxidation occurs there).\n2. Electrons flow through the external circuit from R to Q.',
    },
    {
      number: '9.4',
      marks: 5,
      clues: '- Find the moles, then the number of atoms, of copper deposited.\n- Each Cu²⁺ ion needs 2 electrons to be reduced to Cu — use this to find the total charge, then the current.',
      approach: '- Calculate n(Cu) from the given mass, then convert to number of atoms using Avogadro\'s constant.\n- Find the total number of electrons needed (2 per Cu atom), convert to charge using the electron\'s charge, then use I = Q/Δt with the time in seconds.',
      solution:
        '1. n(Cu) = m/M = 16/63,5 = 0,25 mol.\n2. Number of Cu atoms = n × Nₐ = 0,25 × 6,02 × 10²³ = 1,5 × 10²³ atoms.\n3. Number of electrons needed = 2 × 1,5 × 10²³ = 3 × 10²³ electrons.\n4. Q = n(electrons) × e = 3 × 10²³ × 1,6 × 10⁻¹⁹ = 48 160 C.\n5. t = 5 × 60 × 60 = 18 000 s.\n6. I = Q/t = 48 160/18 000 = 2,68 A.',
    },
    {
      number: '9.5',
      marks: 2,
      clues: '- Silver is present as an impurity in the anode, alongside copper and zinc.\n- Compare the relative strengths of silver, copper, and zinc as reducing agents.',
      approach: '- Identify which of the three metals (Ag, Cu, Zn) is the weakest reducing agent.\n- Use this to explain why that metal is not oxidised at the anode.',
      solution: '1. Ag is a weaker reducing agent than both Cu and Zn.\n2. The power available is only enough to oxidise the stronger reducing agents (Cu and Zn), so Ag is not oxidised — it falls to the bottom of the cell as sludge instead.',
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
