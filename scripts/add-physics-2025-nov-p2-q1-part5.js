#!/usr/bin/env node
/**
 * DBE Physical Sciences: Chemistry P2 — November 2025 — Question 1, Part 5 (order 5)
 * MCQ items 1.9–1.10 — Electrochemistry (galvanic cells, electroplating).
 *
 * Fifth and final lesson of Q1's 5-way knowledge-area split (subjects/dbe-chemistry.md's
 * Paper structure mapping). Completes Q1.
 *
 *   node tools/validate-questions.js --script scripts/add-physics-2025-nov-p2-q1-part5.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-physics-2025-nov-p2-q1-part5.js --dry-run
 *   node scripts/add-physics-2025-nov-p2-q1-part5.js
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
  name: 'Question 1.9–1.10',
  syllabus: 'dbe',
  subject: 'physics',
  year: 2025,
  paper: 'nov_p2',
  order: 5,
  content_tier: 'free',
  has_video: false,
  xp: 30,
  tags: ['electrochemistry', 'galvanic_cells'],
  question_image_urls: [`${PAPER}/q5/question_1.png`, `${PAPER}/q5/question_2.png`],
  memo_image_urls: [`${PAPER}/q5/memo_1.png`],
  exam_question_marks: 4,
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
      'A galvanic cell consists of the following half-cells: Cu²⁺(aq)|Cu(s) and Ag⁺(aq)|Ag(s). The Ag⁺/Ag half-cell has E° = +0,80 V and the Cu²⁺/Cu half-cell has E° = +0,34 V. Which ONE of the following statements is CORRECT for this cell?',
    metadata: [
      'Ag is the anode and Cu is the cathode',
      'Cu²⁺ is reduced at the anode',
      'Cu is the anode and Ag is the cathode',
      'Ag⁺ is oxidised at the cathode',
      '',
    ],
    answer: ['Cu is the anode and Ag is the cathode', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'chemical_change',
    topic: 'electrochemistry',
    subtopic: 'standard_electrode_potentials',
    skills: ['redox_electrode_identification'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p2',
    clues:
      '- The half-cell with the higher (more positive) standard reduction potential is always the cathode, where reduction occurs.\n- The other half-cell is the anode, where oxidation occurs.',
  },
  {
    name: 'Question 2',
    question:
      'An iron spoon is electroplated with copper, using a copper rod as the other electrode. Which ONE of the following correctly identifies the ANODE and the REACTION AT THE CATHODE?',
    metadata: [
      'Anode: Iron spoon; Cathode reaction: Cu(s) → Cu²⁺(aq) + 2e⁻',
      'Anode: Copper rod; Cathode reaction: Cu(s) → Cu²⁺(aq) + 2e⁻',
      'Anode: Iron spoon; Cathode reaction: Cu²⁺(aq) + 2e⁻ → Cu(s)',
      'Anode: Copper rod; Cathode reaction: Cu²⁺(aq) + 2e⁻ → Cu(s)',
      '',
    ],
    answer: ['Anode: Copper rod; Cathode reaction: Cu²⁺(aq) + 2e⁻ → Cu(s)', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'chemical_change',
    topic: 'electrochemistry',
    subtopic: 'electrolytic_cells',
    skills: ['electroplating_half_reactions'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p2',
    clues:
      '- The object being plated is always the cathode; the metal being deposited comes from the anode.\n- The anode loses mass as its metal dissolves into solution; the cathode gains mass as metal deposits onto it.',
  },
  {
    name: 'Question 3',
    question:
      'Select ALL of the following statements that are TRUE for a galvanic cell operating under standard conditions.',
    metadata: [
      'Oxidation occurs at the anode',
      'Electrons flow through the external circuit from the cathode to the anode',
      'The salt bridge allows ions to flow, maintaining electrical neutrality in each half-cell',
      'Reduction occurs at the anode',
      '',
    ],
    answer: ['Oxidation occurs at the anode', 'The salt bridge allows ions to flow, maintaining electrical neutrality in each half-cell', '', '', ''],
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
    year: 2025,
    paper: 'nov_p2',
    clues:
      '- Electrons always flow through the external circuit from the electrode where they are released to the electrode where they are consumed.\n- The salt bridge does not carry electrons — it completes the circuit by ion movement.',
  },
];

const aiExplanation = {
  sub_questions: [
    {
      number: '1.9',
      marks: 2,
      clues:
        '- The half-cell with the higher (more positive) standard reduction potential is always the cathode, where reduction occurs.\n- Fe³⁺/Fe²⁺ has no solid metal of its own in this half-cell, so it needs an inert electrode to carry electrons.',
      approach:
        '- Compare the standard reduction potentials of the two half-cells to decide which is reduced (cathode) and which is oxidised (anode).\n- Recall that a half-cell with only ions in solution (no solid form of the element present) needs an inert electrode such as platinum.',
      solution:
        "1. E°(Fe³⁺/Fe²⁺) = +0,77 V is higher than E°(Ni²⁺/Ni) = −0,25 V, so the Fe³⁺/Fe²⁺ half-cell is the cathode (reduction) and the Ni half-cell is the anode (oxidation).\n2. At the anode, Ni(s) is oxidised to Ni²⁺(aq); at the cathode, Fe³⁺(aq) is reduced to Fe²⁺(aq).\n3. Since both Fe³⁺ and Fe²⁺ are dissolved ions with no solid iron present, an inert electrode (platinum) is needed to complete the circuit at the cathode.\n4. The correct answer is C.",
    },
    {
      number: '1.10',
      marks: 2,
      clues:
        '- In electroplating, the object being plated is always the cathode, and the metal being deposited comes from the anode.\n- The anode loses mass (metal dissolves into solution) and the cathode gains mass (metal deposits onto it).',
      approach:
        '- Identify which electrode is being plated (the cathode) and which supplies the metal ions (the anode).\n- Write the half-reaction that occurs at the cathode: the metal ion gaining electrons to form solid metal.',
      solution:
        '1. The iron medal is the object being plated, so it is the cathode; the silver rod supplies the silver being deposited, so it is the anode.\n2. At the cathode, silver ions are reduced and deposit as solid silver: Ag⁺(aq) + e⁻ → Ag(s).\n3. Option D correctly pairs the silver rod as the anode with this cathode reaction.\n4. The correct answer is D.',
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
