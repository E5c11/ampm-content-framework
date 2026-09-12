#!/usr/bin/env node
/**
 * DBE Physical Sciences: Chemistry P2 — November 2023 — Question 1, Part 2 (order 2)
 * MCQ item 1.4 — Rate & Extent of Reaction (surface area / concentration effects on
 * initial rate and final gas volume, limiting-reagent reasoning).
 *
 *   node tools/validate-questions.js --script scripts/add-physics-2023-nov-p2-q1-part2.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-physics-2023-nov-p2-q1-part2.js --dry-run
 *   node scripts/add-physics-2023-nov-p2-q1-part2.js
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
  name: 'Question 1.4',
  syllabus: 'dbe',
  subject: 'physics',
  year: 2023,
  paper: 'nov_p2',
  order: 2,
  content_tier: 'free',
  has_video: false,
  xp: 20,
  tags: ['reaction_rate', 'surface_area', 'limiting_reactant'],
  question_image_urls: [`${PAPER}/q2/question_1.png`],
  memo_image_urls: [`${PAPER}/q2/memo_1.png`],
  exam_question_marks: 2,
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
      'Marble chips, CaCO₃(s), react with an EXCESS of dilute hydrochloric acid. In Experiment 1, 40 cm³ of 0,5 mol·dm⁻³ HCℓ(aq) is used. In Experiment 2, the SAME mass of marble chips reacts with 80 cm³ of 0,5 mol·dm⁻³ HCℓ(aq). Calculate how many times greater the TOTAL volume of CO₂(g) produced in Experiment 2 will be, compared to Experiment 1: []',
    metadata: ['Volume of CO₂ in Experiment 2 = ', '[ ]', ' × the volume in Experiment 1'],
    answer: ['2', '', '', '', ''],
    presentation: 'fitb',
    type: 'calc',
    unit: 'chemical_change',
    topic: 'reaction_rate',
    subtopic: 'limiting_excess_reactants',
    skills: ['limiting_reactant_identification'],
    difficulty: 3,
    exam_weight: 2,
    xp: 15,
    order: 1,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2023,
    paper: 'nov_p2',
    clues:
      "- Marble chips are in EXCESS, so the acid is the reactant that runs out and controls how much gas forms.\n- Doubling the volume of acid at the same concentration doubles the number of moles of acid available.",
  },
  {
    name: 'Question 2',
    question:
      'Magnesium ribbon and magnesium powder, of the SAME mass, are reacted separately with an EXCESS of the same dilute hydrochloric acid, in test tube P (ribbon) and test tube Q (powder) respectively. How will the INITIAL RATE of reaction and the FINAL VOLUME of H₂(g) produced in Q compare with that in P?',
    metadata: [
      'Lower initial rate; Equal final volume',
      'Higher initial rate; Equal final volume',
      'Higher initial rate; More final volume',
      'Equal initial rate; Equal final volume',
      '',
    ],
    answer: ['Higher initial rate; Equal final volume', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'chemical_change',
    topic: 'reaction_rate',
    subtopic: 'reaction_rate_factors',
    skills: ['rate_factor_identification'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2023,
    paper: 'nov_p2',
    clues:
      '- Powdering the same mass of metal increases its total exposed surface area, which affects the rate of collision with acid particles.\n- Since the acid is in excess and the mass of magnesium is identical in both test tubes, the same amount of metal is eventually consumed either way.',
  },
];

const aiExplanation = {
  sub_questions: [
    {
      number: '1.4',
      marks: 2,
      clues:
        '- Zinc is in EXCESS, so hydrochloric acid is the reactant that determines how much gas forms.\n- Compare the number of moles of HCℓ(aq) available in each test tube, and separately consider how the physical form of the zinc affects rate.',
      approach:
        '- Work out the number of moles of HCℓ(aq) in test tube X (100 cm³) and test tube Y (200 cm³) at the same concentration.\n- Since zinc is in excess, more moles of acid means more H₂(g) is eventually produced.\n- Separately, compare surface area: powder (X) exposes more surface area than lumps (Y), so X reacts faster initially.',
      solution:
        '1. Both test tubes use 0,1 mol·dm⁻³ HCℓ(aq), but Y has 200 cm³ against X\'s 100 cm³ — twice the number of moles of acid.\n2. Zinc is in excess in both, so the acid is the limiting reactant: twice the moles of acid in Y means twice the volume of H₂(g) is eventually produced in Y compared to X — a MORE final volume in Y.\n3. Test tube X uses zinc powder (large surface area), while Y uses zinc lumps (small surface area) — fewer effective collisions per second in Y, so Y has a LOWER initial rate.\n4. The correct answer is B: Lower initial rate, More final volume.',
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
