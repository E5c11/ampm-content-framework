#!/usr/bin/env node
/**
 * DBE Physical Sciences: Chemistry P2 — November 2024 — Question 1, Part 4 (order 4)
 * MCQ items 1.7–1.8 — Acids & Bases (Ka and acid strength, pH at the equivalence
 * point of different acid–base titrations).
 *
 *   node tools/validate-questions.js --script scripts/add-physics-2024-nov-p2-q1-part4.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-physics-2024-nov-p2-q1-part4.js --dry-run
 *   node scripts/add-physics-2024-nov-p2-q1-part4.js
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
  name: 'Question 1.7–1.8',
  syllabus: 'dbe',
  subject: 'physics',
  year: 2024,
  paper: 'nov_p2',
  order: 4,
  content_tier: 'free',
  has_video: false,
  xp: 35,
  tags: ['acids_bases', 'strong_weak_acids', 'titration'],
  question_image_urls: [`${PAPER}/q4/question_1.png`],
  memo_image_urls: [`${PAPER}/q4/memo_1.png`],
  exam_question_marks: 4,
  supplementary_materials: [FORMULA_SHEET],
};

const questions = [
  {
    name: 'Question 1',
    question: 'At 25 °C, Ka for methanoic acid is 1,8 × 10⁻⁴ and Ka for propanoic acid is 1,3 × 10⁻⁵. Solutions of the two acids with EQUAL concentration are compared at 25 °C. Select ALL the TRUE statements.',
    metadata: [
      'Both acids are weak acids',
      'The propanoic acid solution has the higher pH',
      'The propanoic acid solution has the higher [H₃O⁺]',
      'Methanoic acid is the stronger of the two acids',
      'Methanoic acid ionises completely in water',
    ],
    answer: ['Both acids are weak acids', 'The propanoic acid solution has the higher pH', 'Methanoic acid is the stronger of the two acids', '', ''],
    presentation: 'multi_select', type: 'application',
    unit: 'chemical_change', topic: 'acids_bases', subtopic: 'ph_strength_ordering',
    skills: ['ka_strength_comparison', 'acid_base_strength_ordering'],
    difficulty: 3, exam_weight: 2, xp: 10, order: 1,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p2',
    clues: '- A small Ka (much less than 1) means only partial ionisation.\n- The larger Ka belongs to the acid that ionises to a greater extent, giving more H₃O⁺ and so a lower pH.',
  },
  {
    name: 'Question 2',
    question: 'Equal concentrations of acid and base are used in each titration below at 25 °C. Arrange the titrations in order of INCREASING pH at the equivalence point (lowest pH first).',
    metadata: ['HNO₃ and KOH', 'CH₃COOH and NaOH', 'HCℓ and NH₃'],
    answer: ['HCℓ and NH₃', 'HNO₃ and KOH', 'CH₃COOH and NaOH'],
    presentation: 'ordering', type: 'application',
    unit: 'chemical_change', topic: 'acids_bases', subtopic: 'acid_base_reactions',
    skills: ['ampholyte_hydrolysis_reasoning', 'acid_base_strength_ordering'],
    difficulty: 3, exam_weight: 2, xp: 10, order: 2,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p2',
    clues: '- Classify each acid and each base as strong or weak.\n- The salt formed at the equivalence point hydrolyses: the WEAK partner decides whether the solution ends up acidic or basic.',
  },
  {
    name: 'Question 3',
    question: 'Equal amounts of four salts are dissolved separately in water at 25 °C. Which ONE of the salt solutions has a pH LESS than 7?',
    metadata: ['Sodium ethanoate, CH₃COONa', 'Sodium carbonate, Na₂CO₃', 'Ammonium chloride, NH₄Cℓ', 'Potassium nitrate, KNO₃', ''],
    answer: ['Ammonium chloride, NH₄Cℓ', '', '', '', ''],
    presentation: 'multiple_choice', type: 'application',
    unit: 'chemical_change', topic: 'acids_bases', subtopic: 'ampholyte_hydrolysis',
    skills: ['ampholyte_hydrolysis_reasoning'],
    difficulty: 3, exam_weight: 2, xp: 10, order: 3,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p2',
    clues: '- Think of each salt as the product of an acid and a base, and decide which of the two was weak.\n- An ion from a weak BASE reacts with water to form H₃O⁺.',
  },
];

const aiExplanation = {
  sub_questions: [
    {
      number: '1.7',
      marks: 2,
      clues: '- Both Ka values are far smaller than 1.\n- A smaller Ka means less ionisation, so fewer H₃O⁺ ions at the same concentration.',
      approach: '- Use the size of Ka to decide whether each acid is strong or weak.\n- Compare the two Ka values to decide which acid is stronger and which solution has more H₃O⁺.',
      solution: '1. Both Ka values are very small (about 10⁻⁵), so both acids ionise only partially: (i) is TRUE.\n2. Ka(butanoic acid) = 1,5 × 10⁻⁵ is smaller than Ka(ethanoic acid) = 1,8 × 10⁻⁵, so butanoic acid is the WEAKER acid: (ii) is FALSE.\n3. The weaker acid ionises less, so its solution has the lower [H₃O⁺]: (iii) is TRUE.\n4. Answer: B, (i) and (iii) only.',
    },
    {
      number: '1.8',
      marks: 2,
      clues: '- A strong acid with a strong base gives a neutral salt (pH 7).\n- A weak acid with a strong base gives a salt whose anion hydrolyses to form OH⁻.',
      approach: '- Classify the acid and base in each pair as strong or weak.\n- Pick the pair whose salt makes the solution basic at the equivalence point.',
      solution: '1. HCℓ and NH₃: strong acid, weak base, so the equivalence point is acidic (pH < 7).\n2. HCℓ and NaOH, and HNO₃ and KOH: strong acid with strong base, so pH = 7.\n3. CH₃COOH and NaOH: weak acid, strong base; CH₃COO⁻ hydrolyses to form OH⁻, so pH > 7, the highest.\n4. Answer: D.',
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
