#!/usr/bin/env node
/**
 * DBE Physical Sciences: Chemistry P2 — November 2025 — Question 9 (order 13)
 * Electrochemistry — electrolytic cells, electrolytic refining. 11 marks, one
 * continuous scenario (electrolytic refining of copper, zinc the only impurity).
 * Final lesson of this paper — 13/13.
 *
 *   node tools/validate-questions.js --script scripts/add-physics-2025-nov-p2-q9.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-physics-2025-nov-p2-q9.js --dry-run
 *   node scripts/add-physics-2025-nov-p2-q9.js
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
  name: 'Question 9',
  syllabus: 'dbe',
  subject: 'physics',
  year: 2025,
  paper: 'nov_p2',
  order: 13,
  content_tier: 'free',
  has_video: false,
  xp: 40,
  tags: ['electrochemistry', 'electrolytic_refining'],
  question_image_urls: [`${PAPER}/q13/question_1.png`],
  memo_image_urls: [`${PAPER}/q13/memo_1.png`],
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
    question: 'Select ALL of the following that correctly distinguish an ELECTROLYTIC cell from a GALVANIC cell.',
    metadata: [
      'An electrolytic cell requires an external power source; a galvanic cell does not',
      'An electrolytic cell drives a non-spontaneous reaction; a galvanic cell uses a spontaneous one',
      'Oxidation only occurs in a galvanic cell',
      'Both cell types always use a salt bridge',
      '',
    ],
    answer: ['An electrolytic cell requires an external power source; a galvanic cell does not', 'An electrolytic cell drives a non-spontaneous reaction; a galvanic cell uses a spontaneous one', '', '', ''],
    presentation: 'multi_select',
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
    year: 2025,
    paper: 'nov_p2',
    clues:
      '- Oxidation always occurs at the anode, in both cell types — the type of cell does not determine whether oxidation happens.\n- A salt bridge separates two half-cells with different electrolytes; electrolytic refining setups typically share one electrolyte instead.',
  },
  {
    name: 'Question 2',
    question:
      'During the electrolytic refining of nickel (impure nickel containing a cobalt impurity, with E°(Ni²⁺/Ni) = −0,25 V and E°(Co²⁺/Co) = −0,28 V), which ion will be preferentially reduced at the cathode?',
    metadata: ['Co²⁺, because it is the stronger oxidising agent', 'Ni²⁺, because it is the stronger oxidising agent', 'Both ions are reduced equally', 'Neither ion is reduced at the cathode', ''],
    answer: ['Ni²⁺, because it is the stronger oxidising agent', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'chemical_change',
    topic: 'electrochemistry',
    subtopic: 'electrolytic_refining',
    skills: ['preferential_reduction_reasoning'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p2',
    clues:
      '- The ion with the higher (less negative) standard reduction potential is the stronger oxidising agent.\n- The stronger oxidising agent is reduced in preference to the weaker one at the cathode.',
  },
  {
    name: 'Question 3',
    question:
      'During the electrolytic refining of copper (containing zinc as the only impurity), the amount of Cu²⁺(aq) ions in the electrolyte decreases by 0,03 mol after T hours, while 0,10 mol of Cu(s) is deposited on the cathode. Calculate the total decrease in mass of the impure copper anode after T hours (M(Cu) = 63,5 g·mol⁻¹; M(Zn) = 65 g·mol⁻¹): []',
    metadata: ['Total decrease in mass = ', '[ ]', ' g'],
    answer: ['6.40', '', '', '', ''],
    presentation: 'fitb',
    type: 'calc',
    unit: 'chemical_change',
    topic: 'electrochemistry',
    subtopic: 'electrolytic_refining',
    skills: ['electrode_mass_change_calculation'],
    difficulty: 3,
    exam_weight: 3,
    xp: 15,
    order: 3,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p2',
    clues:
      "- The zinc impurity dissolves from the anode in the same amount as the net decrease in Cu²⁺(aq), by charge balance.\n- The rest of the deposited copper (beyond that net decrease) must have come from copper dissolving off the same anode — add both metals' mass losses together.",
  },
  {
    name: 'Question 4',
    question:
      'In the electrolytic refining of copper (impure copper containing zinc), why does the concentration of Zn²⁺(aq) in the electrolyte increase over time, even though Zn²⁺ is never deposited at the cathode?',
    metadata: [
      'Zn²⁺ is continuously converted into Cu²⁺ at the anode',
      'Zn dissolves from the impure anode into solution, but Zn²⁺ is not reduced at the cathode because Cu²⁺ is a stronger oxidising agent',
      'The electrolyte is continuously replenished with fresh ZnSO₄ from an external source',
      'Zn²⁺ ions migrate out of the cell through the wires',
      '',
    ],
    answer: ['Zn dissolves from the impure anode into solution, but Zn²⁺ is not reduced at the cathode because Cu²⁺ is a stronger oxidising agent', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'chemical_change',
    topic: 'electrochemistry',
    subtopic: 'electrolytic_refining',
    skills: ['ion_accumulation_reasoning'],
    difficulty: 2,
    exam_weight: 1,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p2',
    clues:
      '- Both metals in the impure anode dissolve into solution as it is oxidised.\n- Only one of the two resulting ions is favoured for reduction back to solid metal at the cathode.',
  },
];

const aiExplanation = {
  sub_questions: [
    {
      number: '9.1',
      marks: 1,
      clues: '- The diagram shows a power source (battery/switch) driving the cell.\n- A cell needing an external power source to proceed is one specific type.',
      approach: '- Decide whether the reaction shown needs an external power source or produces electrical energy on its own.',
      solution: '1. The diagram shows a power source driving the reaction.\n2. This is an electrolytic cell.',
    },
    {
      number: '9.2.1',
      marks: 1,
      clues: '- Zinc dissolves from the impure anode (electrode R) into the electrolyte as the cell operates.\n- Zn²⁺ is not reduced at the cathode, since Cu²⁺ is preferentially reduced instead.',
      approach: '- Consider what happens to the zinc impurity as the impure anode dissolves, and whether it is ever removed from solution again.',
      solution: '1. Zinc from the impure anode dissolves into the electrolyte as Zn²⁺.\n2. Since Zn²⁺ is not reduced at the cathode, it simply accumulates.\n3. The concentration of Zn²⁺(aq) increases.',
    },
    {
      number: '9.2.2',
      marks: 3,
      clues: '- Cu²⁺ ions are both formed (anode dissolving) and consumed (cathode depositing) at the same time.\n- Compare the relative strengths of Cu²⁺ and Zn²⁺ as oxidising agents to decide which is reduced.',
      approach: '- Explain which ion is preferentially reduced at the cathode, based on relative oxidising strength.\n- Use this to explain whether Cu²⁺(aq) increases or decreases overall.',
      solution: "1. Only Cu²⁺(aq) ions are reduced at the cathode (Zn²⁺ is not), because Cu²⁺ is a stronger oxidising agent than Zn²⁺.\n2. More Cu²⁺ ions are reduced (removed from solution) than are replaced by the anode dissolving (since some of the anode's dissolution goes toward Zn, not Cu).\n3. The amount of Cu²⁺(aq) ions decreases.",
    },
    {
      number: '9.2.3',
      marks: 6,
      clues: '- The change in Cu²⁺(aq) concentration equals the net effect of Cu²⁺ formed at the anode minus Cu²⁺ reduced at the cathode; the zinc dissolved can be found using the same charge-balance logic.\n- The total mass lost by electrode R is the sum of the copper and zinc that left it as ions.',
      approach: "- Use the mole ratio n(Zn²⁺) : n(Cu²⁺)net change = 1:1 to find the moles of zinc dissolved.\n- Find the moles of copper that dissolved from the anode (deposited moles minus the net Cu²⁺ decrease), then calculate the mass lost from both metals and add them.",
      solution: '1. n(Zn²⁺) = n(Cu²⁺) net decrease = 0,05 mol; m(Zn) = (0,05)(65) = 3,25 g.\n2. n(Cu dissolved from R) = 0,15 − 0,05 = 0,10 mol; m(Cu) = (0,10)(63,5) = 6,35 g.\n3. Total change in mass of electrode R = 6,35 + 3,25 = 9,6 g (a decrease in mass).',
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
