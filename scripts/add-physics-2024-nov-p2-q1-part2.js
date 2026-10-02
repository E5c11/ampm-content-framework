#!/usr/bin/env node
/**
 * DBE Physical Sciences: Chemistry P2 — November 2024 — Question 1, Part 2 (order 2)
 * MCQ item 1.4 — Rate & Extent of Reaction (potential energy diagram: ΔH and
 * forward/reverse activation energies).
 *
 *   node tools/validate-questions.js --script scripts/add-physics-2024-nov-p2-q1-part2.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-physics-2024-nov-p2-q1-part2.js --dry-run
 *   node scripts/add-physics-2024-nov-p2-q1-part2.js
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
  name: 'Question 1.4',
  syllabus: 'dbe',
  subject: 'physics',
  year: 2024,
  paper: 'nov_p2',
  order: 2,
  content_tier: 'free',
  has_video: false,
  xp: 35,
  tags: ['reaction_rate', 'activation_energy'],
  question_image_urls: [`${PAPER}/q2/question_1.png`],
  memo_image_urls: [`${PAPER}/q2/memo_1.png`],
  exam_question_marks: 2,
  supplementary_materials: [FORMULA_SHEET],
};

const questions = [
  {
    name: 'Question 1',
    question: 'For an exothermic reaction, ΔH = −150 kJ·mol⁻¹ and the activation energy of the forward reaction is 90 kJ·mol⁻¹. Calculate the activation energy of the REVERSE reaction, in kJ·mol⁻¹: []',
    metadata: ['EA(reverse) = ', '[ ]', ' kJ·mol⁻¹'],
    answer: ['240|240.00', '', '', '', ''],
    presentation: 'fitb', type: 'calc',
    unit: 'chemical_change', topic: 'chemical_equilibrium', subtopic: 'activation_energy_diagrams',
    skills: ['activation_energy_relationship'],
    difficulty: 3, exam_weight: 2, xp: 15, order: 1,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p2',
    clues: '- Sketch it: reactants at a higher level than products, with one peak above both.\n- The reverse reaction climbs from the PRODUCTS to the same peak, so its climb includes the energy released as well as the forward climb.',
  },
  {
    name: 'Question 2',
    question: 'An endothermic reaction has an activation energy of 180 kJ·mol⁻¹ for the forward reaction, and ΔH = +60 kJ·mol⁻¹. Which ONE of the following combinations is CORRECT?',
    metadata: [
      'EA(reverse) = 240 kJ·mol⁻¹; products at a higher potential energy than reactants',
      'EA(reverse) = 120 kJ·mol⁻¹; products at a lower potential energy than reactants',
      'EA(reverse) = 120 kJ·mol⁻¹; products at a higher potential energy than reactants',
      'EA(reverse) = 240 kJ·mol⁻¹; products at a lower potential energy than reactants',
      '',
    ],
    answer: ['EA(reverse) = 120 kJ·mol⁻¹; products at a higher potential energy than reactants', '', '', '', ''],
    presentation: 'multiple_choice', type: 'application',
    unit: 'chemical_change', topic: 'chemical_equilibrium', subtopic: 'activation_energy_diagrams',
    skills: ['activation_energy_relationship'],
    difficulty: 3, exam_weight: 2, xp: 10, order: 2,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p2',
    clues: '- A positive ΔH means energy is absorbed overall: decide which level sits higher on the diagram.\n- The peak is the same for both directions; the reverse climb starts from the products.',
  },
  {
    name: 'Question 3',
    question: 'A catalyst is added to a reversible reaction. Select ALL the statements that correctly describe how the potential energy diagram of the reaction changes.',
    metadata: [
      'The activation energy of the forward reaction decreases',
      'The heat of reaction, ΔH, becomes more negative',
      'The activation energy of the reverse reaction decreases by the same amount',
      'The potential energy of the products increases',
      'The potential energy of the reactants decreases',
    ],
    answer: ['The activation energy of the forward reaction decreases', 'The activation energy of the reverse reaction decreases by the same amount', '', '', ''],
    presentation: 'multi_select', type: 'application',
    unit: 'chemical_change', topic: 'chemical_equilibrium', subtopic: 'activation_energy_diagrams',
    skills: ['catalyst_mechanism_reasoning', 'activation_energy_relationship'],
    difficulty: 2, exam_weight: 2, xp: 10, order: 3,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p2',
    clues: '- A catalyst provides an alternative pathway: only the height of the peak changes.\n- The starting and finishing energy levels belong to the substances themselves, so they stay where they are.',
  },
];

const aiExplanation = {
  sub_questions: [
    {
      number: '1.4',
      marks: 2,
      clues: '- On the diagram the products sit LOWER than the reactants, so the reaction is exothermic.\n- The drop from reactants to products is larger than the climb from reactants to the peak.',
      approach: '- Use the sign of ΔH to eliminate options.\n- Check that EA(reverse) = EA(forward) + |ΔH| and that EA(forward) is the smaller climb.',
      solution: '1. Products are lower than reactants, so ΔH is negative: option C is out.\n2. The climb to the peak (EA forward) is smaller than the total drop to the products, so EA(forward) must be smaller than EA(reverse): options A and B are out.\n3. Check D: EA(reverse) = EA(forward) + |ΔH| = 100 + 200 = 300 kJ·mol⁻¹ ✓.\n4. Answer: D.',
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
