#!/usr/bin/env node
/**
 * DBE Physical Sciences: Chemistry P2 — November 2023 — Question 8 (order 12)
 * Electrochemistry — relative oxidising/reducing agent strength, galvanic cell
 * EMF and electrode identification, salt bridge ion movement. 12 marks, one
 * continuous scenario (Cu strip in AgNO₃(aq), then a Cu-Ag galvanic cell).
 *
 *   node tools/validate-questions.js --script scripts/add-physics-2023-nov-p2-q8.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-physics-2023-nov-p2-q8.js --dry-run
 *   node scripts/add-physics-2023-nov-p2-q8.js
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
  name: 'Question 8',
  syllabus: 'dbe',
  subject: 'physics',
  year: 2023,
  paper: 'nov_p2',
  order: 12,
  content_tier: 'free',
  has_video: false,
  xp: 45,
  tags: ['electrochemistry', 'galvanic_cells'],
  question_image_urls: [`${PAPER}/q12/question_1.png`],
  memo_image_urls: [`${PAPER}/q12/memo_1.png`, `${PAPER}/q12/memo_2.png`],
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
    question:
      'A strip of zinc metal is placed into a blue copper(II) sulfate solution. After some time, the blue colour fades and a reddish-brown solid forms on the zinc strip. Which ONE of the following correctly explains this observation?',
    metadata: [
      'Zn²⁺ is a stronger oxidising agent than Cu²⁺, so Zn²⁺ is reduced while Cu is oxidised',
      'Cu²⁺ is a stronger oxidising agent than Zn²⁺, so Cu²⁺ is reduced while Zn is oxidised to Zn²⁺',
      'The reaction is a simple physical dissolving process, with no electron transfer',
      'Zn²⁺ and Cu²⁺ are equally strong oxidising agents, so both are reduced equally',
      '',
    ],
    answer: ['Cu²⁺ is a stronger oxidising agent than Zn²⁺, so Cu²⁺ is reduced while Zn is oxidised to Zn²⁺', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'chemical_change',
    topic: 'electrochemistry',
    subtopic: 'galvanic_cells',
    skills: ['redox_electrode_identification'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2023,
    paper: 'nov_p2',
    clues: '- The fading blue colour means Cu²⁺(aq) ions are being removed from solution.\n- Comparing which of two metal ions is the stronger oxidising agent tells you which one gets reduced when the two are in competition.',
  },
  {
    name: 'Question 2',
    question:
      'A galvanic cell is made from a Zn/Zn²⁺ half-cell (E° = −0,76 V) and a Cu/Cu²⁺ half-cell (E° = +0,34 V). Calculate the EMF of this cell under standard conditions, in V (round off to a minimum of TWO decimal places): []',
    metadata: ['EMF = ', '[ ]', ' V'],
    answer: ['1.10', '', '', '', ''],
    presentation: 'fitb',
    type: 'calc',
    unit: 'chemical_change',
    topic: 'electrochemistry',
    subtopic: 'standard_electrode_potentials',
    skills: ['cell_emf_calculation'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2023,
    paper: 'nov_p2',
    clues: '- The half-cell with the higher (less negative) standard reduction potential is the cathode.\n- EMF = E°(cathode) − E°(anode), using the given standard reduction potentials directly.',
  },
  {
    name: 'Question 3',
    question:
      'The diagram below shows the galvanic cell formed from a Zn/Zn²⁺ half-cell and a Cu/Cu²⁺ half-cell described above, with electrode P in the Zn²⁺ half-cell and electrode Q in the Cu²⁺ half-cell. Select ALL of the following statements that are TRUE.',
    metadata: [
      'Electrode P is the anode',
      'Electrode Q is the anode',
      'Oxidation occurs at electrode P',
      'Electrons flow through the external circuit from electrode Q to electrode P',
      '',
    ],
    answer: ['Electrode P is the anode', 'Oxidation occurs at electrode P', '', '', ''],
    presentation: 'multi_select',
    type: 'application',
    unit: 'chemical_change',
    topic: 'electrochemistry',
    subtopic: 'galvanic_cells',
    skills: ['galvanic_cell_principles'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2023,
    paper: 'nov_p2',
    clues: '- Read the diagram to identify which half-cell each electrode is in, then compare the two half-cells\' standard reduction potentials to decide which electrode is oxidised.\n- Electrons always flow through the external circuit from the anode to the cathode.',
    supplementary_material: {
      type: 'diagram',
      label: 'Galvanic Cell',
      image_urls:['https://media-dev.askmoreprepmore.app/question_supplementary/physics/2023/nov_p2/q12/diagram_1.png'],
    },
  },
  {
    name: 'Question 4',
    question:
      'The galvanic cell above uses a KNO₃(aq) salt bridge connecting the Zn²⁺ half-cell (anode) to the Cu²⁺ half-cell (cathode). Which ONE of the following correctly identifies the ion that moves FROM the salt bridge INTO the Cu²⁺ half-cell as the cell operates, and why?',
    metadata: [
      'NO₃⁻, because it balances the positive charge lost through oxidation at the anode',
      'K⁺, because it replaces the positive charge consumed by reduction at the cathode',
      'Both K⁺ and NO₃⁻ move into the Cu²⁺ half-cell in equal amounts',
      'Neither ion moves; the salt bridge only completes the circuit without any ion movement',
      '',
    ],
    answer: ['K⁺, because it replaces the positive charge consumed by reduction at the cathode', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'chemical_change',
    topic: 'electrochemistry',
    subtopic: 'electrolyte_properties',
    skills: ['electrolyte_identification'],
    difficulty: 3,
    exam_weight: 2,
    xp: 15,
    order: 4,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2023,
    paper: 'nov_p2',
    clues: '- Reduction at the cathode removes positive ions (Cu²⁺) from that half-cell\'s solution.\n- The salt bridge supplies whichever type of ion is needed to keep each half-cell electrically neutral.',
  },
];

const aiExplanation = {
  sub_questions: [
    {
      number: '8.1.1',
      marks: 1,
      clues: '- The copper strip is a reactant here, being converted into an aqueous ion.\n- Look for a visible change to the SOLID copper strip itself, not just the solution.',
      approach: '- Consider what physically happens to the copper strip as the reaction proceeds.\n- Describe an observable change to the strip.',
      solution: '1. As Cu(s) is oxidised to Cu²⁺(aq), the copper strip becomes thinner/corrodes, and silver-coloured solid (Ag) deposits on it.',
    },
    {
      number: '8.1.2',
      marks: 1,
      clues: '- The oxidising agent is the species that GAINS electrons (is reduced).\n- Identify which species in AgNO₃(aq) is responsible for oxidising the copper.',
      approach: '- Identify which ion is reduced in this reaction.\n- Name that ion as the oxidising agent.',
      solution: '1. Ag⁺(aq) ions are reduced to Ag(s) in this reaction.\n2. The oxidising agent is Ag⁺ (or AgNO₃).',
    },
    {
      number: '8.2',
      marks: 3,
      clues: '- Compare the relative strengths of Ag⁺ and Cu²⁺ as oxidising agents.\n- The stronger oxidising agent is the one that gets reduced when the two compete for electrons.',
      approach: '- State which of Ag⁺ and Cu²⁺ is the stronger oxidising agent.\n- Use this to explain why Cu is oxidised while Ag⁺ is reduced.',
      solution: '1. Ag⁺(aq) is a stronger oxidising agent than Cu²⁺(aq).\n2. Ag⁺ is therefore reduced to Ag(s), while Cu(s) is oxidised to Cu²⁺(aq).',
    },
    {
      number: '8.3.1',
      marks: 1,
      clues: '- Electrode A is paired with the Ag⁺(aq) half-cell in the diagram, on the opposite side.\n- The copper strip from the first part of the question becomes one of the two electrodes here.',
      approach: '- Identify which metal strip makes up electrode A in the cell diagram.',
      solution: '1. Electrode A is the copper (Cu) electrode.',
    },
    {
      number: '8.3.2',
      marks: 1,
      clues: '- Solution B is the electrolyte surrounding electrode A (copper).\n- Each half-cell\'s electrolyte contains the ion of its own electrode\'s metal.',
      approach: '- Identify which metal ion must be present in solution B, based on electrode A.',
      solution: '1. Solution B must contain Cu²⁺ ions, e.g. CuSO₄(aq) (or another soluble copper(II) salt).',
    },
    {
      number: '8.3.3',
      marks: 3,
      clues: '- Combine the oxidation half-reaction (Cu → Cu²⁺ + 2e⁻) with the reduction half-reaction (Ag⁺ + e⁻ → Ag).\n- Balance the electrons transferred between the two half-reactions before adding them together.',
      approach: '- Write both half-reactions.\n- Multiply the silver half-reaction by 2 so the electrons cancel, then add the two half-reactions together.',
      solution: '1. Oxidation: Cu(s) → Cu²⁺(aq) + 2e⁻.\n2. Reduction (×2): 2Ag⁺(aq) + 2e⁻ → 2Ag(s).\n3. Overall: 2Ag⁺(aq) + Cu(s) → 2Ag(s) + Cu²⁺(aq).',
    },
    {
      number: '8.4',
      marks: 2,
      clues: "- Reduction of Ag⁺(aq) to Ag(s) removes positive ions from the silver half-cell's solution.\n- The salt bridge supplies whichever ion keeps that half-cell electrically neutral.",
      approach: '- Determine whether the silver half-cell is gaining or losing positive charge as the cell operates.\n- Identify which of the two given ions would move in to correct this.',
      solution:
        '1. As Ag⁺(aq) is reduced and removed from solution, the silver half-cell loses positive charge.\n2. K⁺(aq) ions move from the salt bridge into the silver half-cell to restore the ion balance/electrical neutrality.',
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
