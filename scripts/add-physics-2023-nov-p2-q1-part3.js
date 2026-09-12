#!/usr/bin/env node
/**
 * DBE Physical Sciences: Chemistry P2 — November 2023 — Question 1, Part 3 (order 3)
 * MCQ items 1.5–1.6 — Chemical Equilibrium (Kc value interpretation, heterogeneous
 * equilibrium behaviour under a volume change).
 *
 *   node tools/validate-questions.js --script scripts/add-physics-2023-nov-p2-q1-part3.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-physics-2023-nov-p2-q1-part3.js --dry-run
 *   node scripts/add-physics-2023-nov-p2-q1-part3.js
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
  name: 'Question 1.5–1.6',
  syllabus: 'dbe',
  subject: 'physics',
  year: 2023,
  paper: 'nov_p2',
  order: 3,
  content_tier: 'free',
  has_video: false,
  xp: 35,
  tags: ['chemical_equilibrium', 'equilibrium_constant', 'le_chatelier'],
  question_image_urls: [`${PAPER}/q3/question_1.png`],
  memo_image_urls: [`${PAPER}/q3/memo_1.png`],
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
      'At equilibrium in a 2 dm³ container at temperature T, a mixture contains 0,20 mol of gas P and 0,80 mol of gas Q, according to the equation: P(g) ⇌ Q(g). Calculate the value of the equilibrium constant, Kc, at temperature T: []',
    metadata: ['Kc = ', '[ ]'],
    answer: ['4', '', '', '', ''],
    presentation: 'fitb',
    type: 'calc',
    unit: 'chemical_change',
    topic: 'chemical_equilibrium',
    subtopic: 'equilibrium_constant_kc',
    skills: ['kc_calculation'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2023,
    paper: 'nov_p2',
    clues:
      "- Convert each mole amount to a concentration by dividing by the container's volume.\n- Kc is the ratio of product concentration to reactant concentration, each raised to its coefficient in the balanced equation.",
  },
  {
    name: 'Question 2',
    question:
      'Solid calcium carbonate decomposes according to the equation: CaCO₃(s) ⇌ CaO(s) + CO₂(g). This system is at equilibrium in a sealed container at constant temperature. The volume of the container is now increased and a new equilibrium is established. Which ONE of the following is CORRECT for the new equilibrium, compared with the original?',
    metadata: [
      '[CO₂(g)] decreases; Kc decreases',
      '[CO₂(g)] remains the same; Kc remains the same',
      '[CO₂(g)] decreases; Kc remains the same',
      '[CO₂(g)] increases; Kc increases',
      '',
    ],
    answer: ['[CO₂(g)] remains the same; Kc remains the same', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'chemical_change',
    topic: 'chemical_equilibrium',
    subtopic: 'equilibrium_constant_kc',
    skills: ['kc_calculation', 'le_chatelier_shift_prediction'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2023,
    paper: 'nov_p2',
    clues:
      '- Only solids and one gas take part here, so the Kc expression contains only [CO₂(g)] — solids are excluded from equilibrium expressions.\n- Since Kc depends only on temperature, and temperature is unchanged, Kc itself cannot change, which fixes what [CO₂(g)] must return to once equilibrium re-establishes.',
  },
  {
    name: 'Question 3',
    question: 'Select ALL of the following changes that will change the VALUE of the equilibrium constant, Kc, for a reaction already at equilibrium.',
    metadata: ['Increasing the temperature', 'Adding a catalyst', 'Decreasing the volume of the container', 'Increasing the concentration of a reactant', ''],
    answer: ['Increasing the temperature', '', '', '', ''],
    presentation: 'multi_select',
    type: 'definition',
    unit: 'chemical_change',
    topic: 'chemical_equilibrium',
    subtopic: 'equilibrium_constant_kc',
    skills: ['kc_temperature_trend_analysis'],
    difficulty: 3,
    exam_weight: 2,
    xp: 15,
    order: 3,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2023,
    paper: 'nov_p2',
    clues:
      '- Kc has one, and only one, variable it depends on.\n- Changing concentration, volume/pressure, or adding a catalyst can shift the equilibrium POSITION, but that is a different thing from changing the VALUE of Kc itself.',
  },
];

const aiExplanation = {
  sub_questions: [
    {
      number: '1.5',
      marks: 2,
      clues:
        '- Count the number of each type of particle shown in the diagram to find the mole ratio at equilibrium.\n- Substitute the mole amounts (both in the same 1 dm³ container, so concentration = moles) into the Kc expression for this equation.',
      approach:
        '- Count the NO₂ and N₂O₄ particles shown and treat the counts as relative concentrations in the 1 dm³ container.\n- Substitute into Kc = [N₂O₄] / [NO₂]² and evaluate.',
      solution:
        '1. The diagram shows more NO₂ molecules than N₂O₄ molecules at equilibrium.\n2. Kc = [N₂O₄] / [NO₂]², and squaring the larger NO₂ count in the denominator makes the resulting value less than 1.\n3. Since there genuinely are N₂O₄ molecules present (not zero), Kc is greater than 0.\n4. The correct answer is D: 0 < Kc < 1.',
    },
    {
      number: '1.6',
      marks: 2,
      clues:
        '- This equilibrium has two solids and only one gas — write the Kc expression and see which species actually appear in it.\n- Kc changes only when temperature changes; here, temperature is constant.',
      approach:
        '- Write the Kc expression for this reaction (solids excluded): Kc = [O₂].\n- Since Kc is unchanged (constant T) and Kc = [O₂], work out what must happen to [O₂] once the new equilibrium is reached, then use PV-type reasoning to find what happens to the number of moles of O₂ in the larger volume.',
      solution:
        '1. Because CuO(s) and Cu₂O(s) are solids, they do not appear in the equilibrium expression: Kc = [O₂(g)].\n2. Temperature is unchanged, so Kc is unchanged — meaning [O₂(g)] at the new equilibrium must equal its original value.\n3. The container volume is now larger, so to keep the SAME concentration of O₂ in a bigger volume, the actual NUMBER of moles of O₂ present must increase.\n4. The correct answer is C: concentration of O₂ remains the same, number of moles of O₂ increases, Kc remains the same.',
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
