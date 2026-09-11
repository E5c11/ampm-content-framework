#!/usr/bin/env node
/**
 * DBE Physical Sciences: Chemistry P2 — November 2025 — Question 1, Part 4 (order 4)
 * MCQ items 1.7–1.8 — Acids & Bases (acid-base reactions, pH/strength ordering).
 *
 * Fourth lesson of subjects/dbe-chemistry.md's Paper structure mapping: Q1's ten MCQs
 * cluster into 5 knowledge-area lessons. This is Part 4 of 5.
 *
 *   node tools/validate-questions.js --script scripts/add-physics-2025-nov-p2-q1-part4.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-physics-2025-nov-p2-q1-part4.js --dry-run
 *   node scripts/add-physics-2025-nov-p2-q1-part4.js
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
  name: 'Question 1.7–1.8',
  syllabus: 'dbe',
  subject: 'physics',
  year: 2025,
  paper: 'nov_p2',
  order: 4,
  content_tier: 'free',
  has_video: false,
  xp: 30,
  tags: ['acid_base_reactions', 'ph_scale'],
  question_image_urls: [`${PAPER}/q4/question_1.png`, `${PAPER}/q4/question_2.png`],
  memo_image_urls: [`${PAPER}/q4/memo_1.png`],
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
      'Which ONE of the following correctly gives the products of the reaction between a metal carbonate and a dilute acid?',
    metadata: [
      'A salt and water only',
      'A salt and hydrogen gas',
      'A salt and carbon dioxide only',
      'A salt, water and carbon dioxide',
      '',
    ],
    answer: ['A salt, water and carbon dioxide', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'chemical_change',
    topic: 'acids_bases',
    subtopic: 'acid_base_reactions',
    skills: ['acid_base_product_identification'],
    difficulty: 1,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p2',
    clues:
      '- Metal carbonates react differently with acids than metal oxides or reactive metals do.\n- One of the three products is the same gas tested for using limewater.',
  },
  {
    name: 'Question 2',
    question:
      'Each of the four solutions below has a concentration of 0,1 mol·dm⁻³: HCℓ(aq), CH₃COOH(aq), NH₃(aq), KOH(aq). Arrange the solutions in order of INCREASING pH.',
    metadata: ['NH₃(aq)', 'HCℓ(aq)', 'KOH(aq)', 'CH₃COOH(aq)'],
    answer: ['HCℓ(aq)', 'CH₃COOH(aq)', 'NH₃(aq)', 'KOH(aq)'],
    presentation: 'ordering',
    type: 'application',
    unit: 'chemical_change',
    topic: 'acids_bases',
    subtopic: 'ph_strength_ordering',
    skills: ['acid_base_strength_ordering'],
    difficulty: 3,
    exam_weight: 2,
    xp: 15,
    order: 2,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p2',
    clues:
      '- At equal concentration, a strong acid has a lower pH than a weak acid, and a strong base has a higher pH than a weak base.\n- Of the four substances, one is a strong acid, one a weak acid, one a weak base, and one a strong base.',
  },
  {
    name: 'Question 3',
    question:
      'Ammonia reacts with water according to the following equation: NH₃(aq) + H₂O(ℓ) ⇌ NH₄⁺(aq) + OH⁻(aq). Which ONE of the following is the conjugate acid of NH₃(aq) in this reaction?',
    metadata: ['H₂O(ℓ)', 'OH⁻(aq)', 'NH₄⁺(aq)', 'NH₃(aq)', ''],
    answer: ['NH₄⁺(aq)', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'chemical_change',
    topic: 'acids_bases',
    subtopic: 'conjugate_acid_base_pairs',
    skills: ['conjugate_acid_base_identification'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p2',
    clues:
      "- A conjugate acid is formed when a base gains a proton (H⁺).\n- NH₃ accepts a proton from water in this reaction; the species it becomes is its conjugate acid.",
  },
];

const aiExplanation = {
  sub_questions: [
    {
      number: '1.7',
      marks: 2,
      clues:
        '- A metal oxide is a basic oxide; reacting a base with an acid is a neutralisation reaction.\n- Neutralisation reactions between a base and an acid characteristically produce two specific products — no gas is released unless the base is a carbonate.',
      approach:
        '- Classify the metal oxide as a base and recall the general products of a base-acid neutralisation reaction.\n- Distinguish this from the reaction of a metal carbonate (which also releases CO₂) or a reactive metal (which releases H₂) with an acid.',
      solution:
        '1. A metal oxide behaves as a base when reacting with an acid.\n2. A base neutralises an acid to form a salt and water only — no gas is produced.\n3. Options B, C and D each include a gas (hydrogen or carbon dioxide), which forms only when the acid reacts with a reactive metal or a carbonate, not with a metal oxide.\n4. The correct answer is A.',
    },
    {
      number: '1.8',
      marks: 2,
      clues:
        '- At equal concentration, a strong acid has a lower pH than a weak acid, and a strong base has a higher pH than a weak base.\n- Of the four substances, one is a strong acid, one a weak acid, one a weak base, and one a strong base.',
      approach:
        '- Classify each of the four substances as a strong/weak acid or strong/weak base.\n- Order them from lowest pH (strong acid) to highest pH (strong base), placing the weak acid and weak base in between.',
      solution:
        '1. HNO₃ is a strong acid — it dissociates completely, giving the lowest pH.\n2. H₂CO₃ is a weak acid — it only partially dissociates, giving a higher pH than HNO₃ but still acidic.\n3. NH₃ is a weak base — it only partially ionises, giving a pH above 7 but lower than a strong base.\n4. NaOH is a strong base — it dissociates completely, giving the highest pH.\n5. The correct increasing-pH order is HNO₃ ; H₂CO₃ ; NH₃ ; NaOH — the correct answer is B.',
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
