#!/usr/bin/env node
/**
 * DBE Physical Sciences: Chemistry P2 — November 2025 — Question 8 (order 12)
 * Electrochemistry — galvanic cells, cell notation, standard conditions. 11 marks, one
 * continuous scenario (an Aℓ|Aℓ³⁺ || Zn²⁺|Zn galvanic cell).
 *
 *   node tools/validate-questions.js --script scripts/add-physics-2025-nov-p2-q8.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-physics-2025-nov-p2-q8.js --dry-run
 *   node scripts/add-physics-2025-nov-p2-q8.js
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
  name: 'Question 8',
  syllabus: 'dbe',
  subject: 'physics',
  year: 2025,
  paper: 'nov_p2',
  order: 12,
  content_tier: 'free',
  has_video: false,
  xp: 40,
  tags: ['electrochemistry', 'galvanic_cells'],
  question_image_urls: [`${PAPER}/q12/question_1.png`],
  memo_image_urls: [`${PAPER}/q12/memo_1.png`, `${PAPER}/q12/memo_2.png`],
  exam_question_marks: 11,
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
    question: 'Select ALL of the following that are TRUE about electrolytes.',
    metadata: [
      "An electrolyte's aqueous solution contains free-moving ions",
      'An electrolyte conducts electricity by the movement of electrons through the solution',
      'A molten electrolyte can also conduct electricity',
      'All electrolytes are metals',
      '',
    ],
    answer: ["An electrolyte's aqueous solution contains free-moving ions", 'A molten electrolyte can also conduct electricity', '', '', ''],
    presentation: 'multi_select',
    type: 'definition',
    unit: 'chemical_change',
    topic: 'electrochemistry',
    subtopic: 'electrolyte_properties',
    skills: ['electrolyte_identification'],
    difficulty: 1,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p2',
    clues:
      '- An electrolyte conducts electricity through the movement of ions, not electrons, within the solution.\n- Many electrolytes are ionic compounds (salts, acids, bases) that are not themselves metals.',
  },
  {
    name: 'Question 2',
    question:
      'A galvanic cell has the following half-cells: Cr(s)|Cr³⁺(aq) and Cu²⁺(aq)|Cu(s), with E°(Cu²⁺/Cu) = +0,34 V and E°(Cr³⁺/Cr) = −0,74 V. Which ONE of the following is CORRECT?',
    metadata: [
      'The Cu²⁺(aq) concentration will increase, because Cu²⁺ is reduced',
      'The Cr³⁺(aq) concentration will increase, because Cr is oxidised',
      'The Cu²⁺(aq) concentration will increase, because Cu is oxidised',
      'Neither ion concentration changes',
      '',
    ],
    answer: ['The Cr³⁺(aq) concentration will increase, because Cr is oxidised', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'chemical_change',
    topic: 'electrochemistry',
    subtopic: 'standard_electrode_potentials',
    skills: ['redox_electrode_identification'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p2',
    clues:
      '- The half-cell with the lower (more negative) standard reduction potential is the anode, where oxidation occurs.\n- Oxidation of a solid metal electrode increases the concentration of its own ion in solution.',
  },
  {
    name: 'Question 3',
    question:
      'Which ONE of the following is the correct cell notation for a galvanic cell built from Cr(s)|Cr³⁺(aq) and Cu²⁺(aq)|Cu(s) half-cells operating under standard conditions?',
    metadata: [
      'Cu(s) | Cu²⁺(aq) || Cr³⁺(aq) | Cr(s)',
      'Cr(s) | Cr³⁺(aq) || Cu²⁺(aq) | Cu(s)',
      'Cr³⁺(aq) | Cr(s) || Cu(s) | Cu²⁺(aq)',
      'Cu²⁺(aq) | Cu(s) || Cr(s) | Cr³⁺(aq)',
      '',
    ],
    answer: ['Cr(s) | Cr³⁺(aq) || Cu²⁺(aq) | Cu(s)', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'chemical_change',
    topic: 'electrochemistry',
    subtopic: 'cell_notation',
    skills: ['cell_notation_writing'],
    difficulty: 2,
    exam_weight: 3,
    xp: 15,
    order: 3,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p2',
    clues:
      '- Cell notation always writes the anode (oxidation) half-cell on the left and the cathode (reduction) half-cell on the right, separated by the salt bridge symbol ||.\n- Within each half-cell, the solid electrode and its ion are separated by a single vertical line, ordered so the electrode touching the salt bridge is written last.',
  },
  {
    name: 'Question 4',
    question:
      "A galvanic cell's zinc half-cell requires a 1 mol·dm⁻³ Zn²⁺(aq) solution to operate under standard conditions. Calculate the mass of ZnSO₄(s) (M = 161 g·mol⁻¹) needed to prepare 500 cm³ of this solution: []",
    metadata: ['Mass of ZnSO₄ = ', '[ ]', ' g'],
    answer: ['80.5', '', '', '', ''],
    presentation: 'fitb',
    type: 'calc',
    unit: 'chemical_change',
    topic: 'electrochemistry',
    subtopic: 'standard_electrode_potentials',
    skills: ['standard_conditions_concentration_calculation'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p2',
    clues:
      '- ZnSO₄ dissociates in a 1:1 ratio to give Zn²⁺ ions, so the moles of ZnSO₄ needed equal the moles of Zn²⁺ required.\n- Use n = cV to find the moles needed, then m = nM to find the mass.',
  },
];

const aiExplanation = {
  sub_questions: [
    {
      number: '8.1',
      marks: 2,
      clues: '- An electrolyte must contain ions that are free to move in order to conduct.\n- This can happen either in aqueous solution or in the molten state.',
      approach: '- State what an electrolyte contains and how this allows it to conduct electricity.',
      solution: '1. An electrolyte is a substance whose (aqueous) solution contains ions.\n2. This substance dissolves in water to give a solution that conducts electricity through the movement of ions (or dissociates to form ions in water/in molten state).',
    },
    {
      number: '8.2',
      marks: 2,
      clues: '- The half-cell with the lower (more negative) standard reduction potential is oxidised.\n- Oxidation of the solid electrode releases more of its ion into solution.',
      approach: '- Identify which half-cell is the anode based on standard reduction potentials.\n- State which ion concentration increases as a result.',
      solution: '1. Aℓ is oxidised (or Aℓ is the stronger reducing agent), so the Aℓ³⁺(aq) concentration increases.',
    },
    {
      number: '8.3',
      marks: 3,
      clues: '- The anode (oxidation) half-cell is written on the left; the cathode (reduction) half-cell is written on the right.\n- A single line separates the electrode from its ion within each half-cell; a double line represents the salt bridge.',
      approach: '- Identify the anode and cathode, then write each half-cell in the correct order around the salt bridge symbol.',
      solution: '1. Aℓ is the anode (oxidation) and Zn is the cathode (reduction).\n2. Cell notation: Aℓ(s) | Aℓ³⁺(aq) || Zn²⁺(aq) | Zn(s).',
    },
    {
      number: '8.4',
      marks: 4,
      clues: '- Standard conditions require a 1 mol·dm⁻³ concentration of the relevant ion.\n- Aℓ₂(SO₄)₃ releases 2 mol of Aℓ³⁺ per mole of Aℓ₂(SO₄)₃ that dissolves.',
      approach: '- Calculate the moles of Aℓ³⁺ needed for 250 cm³ at 1 mol·dm⁻³.\n- Use the 1:2 ratio between Aℓ₂(SO₄)₃ and Aℓ³⁺ to find the moles of Aℓ₂(SO₄)₃ needed, then convert to mass.',
      solution: '1. n(Aℓ³⁺) = cV = (1)(0,25) = 0,25 mol.\n2. n(Aℓ₂(SO₄)₃) = ½ × n(Aℓ³⁺) = ½ × 0,25 = 0,125 mol.\n3. m(Aℓ₂(SO₄)₃) = nM = 0,125 × 342 = 42,75 g.',
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
