#!/usr/bin/env node
/**
 * DBE Physical Sciences: Chemistry P2 — November 2024 — Question 1, Part 5 (order 5)
 * MCQ items 1.9–1.10 — Electrochemistry (galvanic cell cathode and electron flow,
 * electroplating set-up).
 *
 *   node tools/validate-questions.js --script scripts/add-physics-2024-nov-p2-q1-part5.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-physics-2024-nov-p2-q1-part5.js --dry-run
 *   node scripts/add-physics-2024-nov-p2-q1-part5.js
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
  name: 'Question 1.9–1.10',
  syllabus: 'dbe',
  subject: 'physics',
  year: 2024,
  paper: 'nov_p2',
  order: 5,
  content_tier: 'free',
  has_video: false,
  xp: 35,
  tags: ['electrochemistry', 'galvanic_cells', 'electrolysis'],
  question_image_urls: [`${PAPER}/q5/question_1.png`],
  memo_image_urls: [`${PAPER}/q5/memo_1.png`],
  exam_question_marks: 4,
  supplementary_materials: [FORMULA_SHEET],
};

const questions = [
  {
    name: 'Question 1',
    question: 'A standard galvanic cell is set up with a cobalt electrode in Co²⁺(aq) and a copper electrode in Cu²⁺(aq), joined by a salt bridge and a voltmeter. Which ONE of the following combinations of the cathode and the direction of electron flow in the external circuit is CORRECT?',
    metadata: [
      'Cathode: Co; electrons flow from Co to Cu',
      'Cathode: Cu; electrons flow from Co to Cu',
      'Cathode: Cu; electrons flow from Cu to Co',
      'Cathode: Co; electrons flow from Cu to Co',
      '',
    ],
    answer: ['Cathode: Cu; electrons flow from Co to Cu', '', '', '', ''],
    presentation: 'multiple_choice', type: 'application',
    unit: 'chemical_change', topic: 'electrochemistry', subtopic: 'galvanic_cells',
    skills: ['redox_electrode_identification', 'galvanic_cell_principles'],
    difficulty: 3, exam_weight: 2, xp: 10, order: 1,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p2',
    clues: '- Look up both half-reactions in Table 4: the one with the more positive E° is where reduction happens.\n- Electrons leave the electrode where oxidation happens and travel through the wire to the other one.',
  },
  {
    name: 'Question 2',
    question: 'A standard galvanic cell is made from a cobalt electrode in Co²⁺(aq) and a copper electrode in Cu²⁺(aq). Calculate the initial emf of the cell under standard conditions, in V (round off to a minimum of TWO decimal places): []',
    metadata: ['E°cell = ', '[ ]', ' V'],
    answer: ['0.62', '', '', '', ''],
    presentation: 'fitb', type: 'calc',
    unit: 'chemical_change', topic: 'electrochemistry', subtopic: 'standard_electrode_potentials',
    skills: ['cell_emf_calculation'],
    difficulty: 2, exam_weight: 2, xp: 15, order: 2,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p2',
    clues: '- Use E°cell = E°cathode − E°anode with the reduction potentials exactly as listed in Table 4.\n- Keep the sign of the cobalt value when you subtract it.',
  },
  {
    name: 'Question 3',
    question: 'A copper key is electroplated with silver in an electrolytic cell. Select ALL the statements that are TRUE for this cell.',
    metadata: [
      'The copper key is connected to the negative terminal of the battery',
      'Silver ions are oxidised on the surface of the key',
      'The anode is made of pure silver',
      'The copper key is the anode of the cell',
      'The electrolyte contains Ag⁺(aq) ions',
    ],
    answer: ['The copper key is connected to the negative terminal of the battery', 'The anode is made of pure silver', 'The electrolyte contains Ag⁺(aq) ions', '', ''],
    presentation: 'multi_select', type: 'application',
    unit: 'chemical_change', topic: 'electrochemistry', subtopic: 'electrolytic_cells',
    skills: ['electroplating_half_reactions', 'redox_electrode_identification'],
    difficulty: 3, exam_weight: 2, xp: 10, order: 3,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p2',
    clues: '- The object being plated is where metal ions gain electrons and deposit as metal.\n- The other electrode must keep replacing the metal ions that leave the solution.',
  },
];

const aiExplanation = {
  sub_questions: [
    {
      number: '1.9',
      marks: 2,
      clues: '- Compare E°(Cd²⁺ + 2e⁻ ⇌ Cd) = −0,40 V with E°(Ag⁺ + e⁻ ⇌ Ag) = +0,80 V.\n- Reduction happens at the cathode, and electrons flow towards it through the wire.',
      approach: '- Use Table 4 to decide which ion is the stronger oxidising agent.\n- That electrode is the cathode; electrons flow from the anode to the cathode.',
      solution: '1. Ag⁺ has the more positive reduction potential (+0,80 V vs −0,40 V), so Ag⁺ is reduced and silver is the cathode.\n2. Cd is oxidised at the anode, releasing electrons that flow through the external circuit from Cd to Ag.\n3. Answer: B.',
    },
    {
      number: '1.10',
      marks: 2,
      clues: '- In electroplating, the object being plated is the cathode.\n- The plating metal is the anode, and its ions are in the electrolyte.',
      approach: '- Decide which electrode the iron rod must be for nickel to deposit on it.\n- Check each statement against the electroplating set-up.',
      solution: '1. Nickel must deposit on the iron rod, so Ni²⁺ ions are reduced there: the rod is the cathode, the negative electrode. (i) TRUE.\n2. The metal ions (Ni²⁺) in solution gain electrons: they undergo reduction. (ii) TRUE.\n3. The anode is pure nickel, which oxidises to replace the Ni²⁺ ions used up. (iii) TRUE.\n4. Answer: D, (i), (ii) and (iii).',
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
