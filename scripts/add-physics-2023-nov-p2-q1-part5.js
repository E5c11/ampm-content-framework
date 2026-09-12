#!/usr/bin/env node
/**
 * DBE Physical Sciences: Chemistry P2 — November 2023 — Question 1, Part 5 (order 5)
 * MCQ items 1.9–1.10 — Electrochemistry (galvanic cell emf/anode reasoning from
 * hypothetical standard reduction potentials, electrolysis anode-reaction selection).
 *
 *   node tools/validate-questions.js --script scripts/add-physics-2023-nov-p2-q1-part5.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-physics-2023-nov-p2-q1-part5.js --dry-run
 *   node scripts/add-physics-2023-nov-p2-q1-part5.js
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
  name: 'Question 1.9–1.10',
  syllabus: 'dbe',
  subject: 'physics',
  year: 2023,
  paper: 'nov_p2',
  order: 5,
  content_tier: 'free',
  has_video: false,
  xp: 35,
  tags: ['electrochemistry', 'galvanic_cells', 'electrolysis'],
  question_image_urls: [`${PAPER}/q5/question_1.png`],
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
      'In a hypothetical galvanic cell: M²⁺(aq) + 2e⁻ ⇌ M(s), E° = +0,34 V; N²⁺(aq) + 2e⁻ ⇌ N(s), E° = −0,76 V. Calculate the emf of this cell under standard conditions: []',
    metadata: ['Ecell = ', '[ ]', ' V'],
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
    order: 1,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2023,
    paper: 'nov_p2',
    clues:
      '- The electrode with the higher (more positive) standard reduction potential is the cathode; the other is the anode.\n- Ecell = E°(cathode) − E°(anode).',
  },
  {
    name: 'Question 2',
    question:
      'In a hypothetical galvanic cell: P³⁺(aq) + 3e⁻ ⇌ P(s), E° = −0,20 V; Q²⁺(aq) + 2e⁻ ⇌ Q(s), E° = +0,50 V. Select ALL of the following statements that are TRUE for this cell under standard conditions.',
    metadata: [
      'The emf of the cell is 0,70 V under standard conditions',
      'Electrode P is the anode',
      'Q is oxidised',
      'Electrode Q is the anode',
      '',
    ],
    answer: ['The emf of the cell is 0,70 V under standard conditions', 'Electrode P is the anode', '', '', ''],
    presentation: 'multi_select',
    type: 'application',
    unit: 'chemical_change',
    topic: 'electrochemistry',
    subtopic: 'standard_electrode_potentials',
    skills: ['redox_electrode_identification', 'galvanic_cell_principles'],
    difficulty: 3,
    exam_weight: 2,
    xp: 15,
    order: 2,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2023,
    paper: 'nov_p2',
    clues:
      '- The electrode with the LOWER standard reduction potential is the anode, and its species is the one that gets oxidised.\n- The emf is the difference between the two standard reduction potentials, cathode minus anode.',
  },
  {
    name: 'Question 3',
    question:
      'During the electrolysis of CONCENTRATED sodium bromide, NaBr(aq), solution using inert electrodes, which ONE of the half-reactions below will be the MAIN reaction at the ANODE?',
    metadata: [
      '2H₂O(ℓ) + 2e⁻ → H₂(g) + 2OH⁻(aq)',
      '2Br⁻(aq) → Br₂(ℓ) + 2e⁻',
      'Na⁺(aq) + e⁻ → Na(s)',
      '2H₂O(ℓ) → O₂(g) + 4H⁺(aq) + 4e⁻',
      '',
    ],
    answer: ['2Br⁻(aq) → Br₂(ℓ) + 2e⁻', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'chemical_change',
    topic: 'electrochemistry',
    subtopic: 'electrolytic_cells',
    skills: ['redox_electrode_identification'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2023,
    paper: 'nov_p2',
    clues:
      "- The anode is where OXIDATION happens — eliminate any half-reaction written as a reduction.\n- In a CONCENTRATED halide solution, the halide ion is discharged in preference to water, even though water's standard potential looks more favourable.",
  },
];

const aiExplanation = {
  sub_questions: [
    {
      number: '1.9',
      marks: 2,
      clues:
        '- The electrode with the higher standard reduction potential is the cathode (reduction); the other is the anode (oxidation).\n- Ecell = E°(cathode) − E°(anode).',
      approach:
        '- Identify which electrode, X or Y, has the higher E° and is therefore the cathode.\n- Use this to evaluate each of the three statements about emf, anode identity, and which species is oxidised.',
      solution:
        '1. X has E° = +0,10 V and Y has E° = −0,10 V, so X (higher E°) is the cathode and Y (lower E°) is the anode.\n2. Ecell = E°(cathode) − E°(anode) = 0,10 − (−0,10) = 0,20 V, so statement (i) is TRUE.\n3. Y is the anode, so statement (ii) is TRUE.\n4. Oxidation happens at the anode, so Y (not X) is oxidised — statement (iii) is FALSE.\n5. The correct answer is B: (i) and (ii) only.',
    },
    {
      number: '1.10',
      marks: 2,
      clues:
        '- The anode is where oxidation occurs — eliminate any option written as a reduction half-reaction.\n- With a CONCENTRATED chloride solution, Cℓ⁻(aq) is discharged in preference to water at the anode.',
      approach:
        '- Eliminate the two reduction half-reactions (these belong at the cathode, not the anode).\n- Between the two remaining oxidation half-reactions, decide which species is actually discharged given the high Cℓ⁻(aq) concentration.',
      solution:
        '1. Option A (Cu²⁺ + 2e⁻ → Cu) and option B (water gaining electrons) are both reductions, so neither can be the anode reaction.\n2. Options C and D are both oxidations (electrons released) — the choice between them depends on which species actually gets discharged at the anode.\n3. Even though water is thermodynamically slightly easier to oxidise, a CONCENTRATED Cℓ⁻(aq) solution results in chloride being preferentially discharged at the anode in practice.\n4. The correct answer is D: 2Cℓ⁻(aq) → Cℓ₂(g) + 2e⁻.',
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
