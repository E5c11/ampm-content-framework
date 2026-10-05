#!/usr/bin/env node
/**
 * DBE Physical Sciences: Chemistry P2 — November 2024 — Question 7 (order 11)
 * Acids & Bases — weak base definition, conjugate acid, burette readings, indicator
 * choice, titration concentration, water of crystallisation (K₂CO₃·xH₂O). 17 marks,
 * one continuous titration scenario.
 *
 *   node tools/validate-questions.js --script scripts/add-physics-2024-nov-p2-q7.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-physics-2024-nov-p2-q7.js --dry-run
 *   node scripts/add-physics-2024-nov-p2-q7.js
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
  name: 'Question 7',
  syllabus: 'dbe',
  subject: 'physics',
  year: 2024,
  paper: 'nov_p2',
  order: 11,
  content_tier: 'free',
  has_video: false,
  xp: 75,
  tags: ['acids_bases', 'titration', 'strong_weak_acids'],
  question_image_urls: [`${PAPER}/q11/question_1.png`],
  memo_image_urls: [`${PAPER}/q11/memo_1.png`, `${PAPER}/q11/memo_2.png`, `${PAPER}/q11/memo_3.png`, `${PAPER}/q11/memo_4.png`],
  exam_question_marks: 17,
  supplementary_materials: [FORMULA_SHEET],
};

const questions = [
  {
    name: 'Question 1',
    question: 'Which ONE of the following is the correct definition of a WEAK base?',
    metadata: [
      'A base that ionises completely in water to form a low concentration of OH⁻ ions',
      'A base that ionises incompletely in water to form a low concentration of OH⁻ ions',
      'A base that ionises incompletely in water to form a high concentration of H₃O⁺ ions',
      'A base that dissolves only slightly in water to form a dilute solution of OH⁻ ions',
      '',
    ],
    answer: ['A base that ionises incompletely in water to form a low concentration of OH⁻ ions', '', '', '', ''],
    presentation: 'multiple_choice', type: 'definition',
    unit: 'chemical_change', topic: 'acids_bases', subtopic: 'acid_base_reactions',
    skills: ['acid_base_strength_ordering'],
    difficulty: 1, exam_weight: 2, xp: 10, order: 1,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p2',
    clues: '- "Weak" describes the EXTENT of ionisation, not how much of the base dissolves.\n- A base produces hydroxide ions in water, not hydronium ions.',
  },
  {
    name: 'Question 2',
    question: 'Match each base to its CONJUGATE ACID.',
    metadata: [
      'A - HPO₄²⁻',
      'B - HSO₄⁻',
      'C - NH₃',
      'D - H₂O',
      '1 - H₃O⁺',
      '2 - H₂PO₄⁻',
      '3 - NH₄⁺',
      '4 - H₂SO₄',
    ],
    answer: ['A-2', 'B-4', 'C-3', 'D-1'],
    presentation: 'match', type: 'application',
    unit: 'chemical_change', topic: 'acids_bases', subtopic: 'conjugate_acid_base_pairs',
    skills: ['conjugate_acid_base_identification'],
    difficulty: 2, exam_weight: 2, xp: 10, order: 2,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p2',
    clues: '- A conjugate acid has exactly ONE more proton (H⁺) than its base.\n- Adding H⁺ also raises the charge by +1, so check both the formula and the charge.',
  },
  {
    name: 'Question 3',
    question: 'A sodium carbonate solution is in a burette. Run 1: initial reading 1,05 cm³, final reading 21,10 cm³. Run 2: initial reading 21,10 cm³, final reading 41,05 cm³. Calculate the AVERAGE volume of sodium carbonate solution used, in cm³ (round off to a minimum of TWO decimal places): []',
    metadata: ['Average volume = ', '[ ]', ' cm³'],
    answer: ['20.00|20', '', '', '', ''],
    presentation: 'fitb', keyboard_type: 'standard_math', type: 'calc',
    unit: 'chemical_change', topic: 'acids_bases', subtopic: 'titration_calculations',
    skills: ['titration_concentration_calculation'],
    difficulty: 2, exam_weight: 2, xp: 15, order: 3,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p2',
    clues: '- The volume used in each run is the final reading minus the initial reading.\n- Average the two run volumes, not the readings themselves.',
  },
  {
    name: 'Question 4',
    question: 'Nitric acid, HNO₃(aq), is titrated against sodium carbonate, Na₂CO₃(aq). Which ONE of the following gives the most suitable indicator and the correct reason?',
    metadata: [
      'Phenolphthalein, because the equivalence point lies at a pH above 7',
      'Methyl orange, because the equivalence point lies at a pH below 7',
      'Phenolphthalein, because the equivalence point lies at a pH below 7',
      'Bromothymol blue, because the equivalence point lies at a pH of exactly 7',
      '',
    ],
    answer: ['Methyl orange, because the equivalence point lies at a pH below 7', '', '', '', ''],
    presentation: 'multiple_choice', type: 'application',
    unit: 'chemical_change', topic: 'acids_bases', subtopic: 'acid_base_reactions',
    skills: ['indicator_selection'],
    difficulty: 3, exam_weight: 2, xp: 10, order: 4,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p2',
    clues: '- Classify the acid and the base as strong or weak to predict the pH at the equivalence point.\n- Choose the indicator whose colour-change range contains that pH.',
  },
  {
    name: 'Question 5',
    question: '25,00 cm³ of 0,20 mol·dm⁻³ HCℓ(aq) is exactly neutralised by 20,00 cm³ of Na₂CO₃(aq): Na₂CO₃(aq) + 2HCℓ(aq) → 2NaCℓ(aq) + CO₂(g) + H₂O(ℓ). Calculate the concentration of the Na₂CO₃ solution, in mol·dm⁻³ (round off to a minimum of TWO decimal places): []',
    metadata: ['c(Na₂CO₃) = ', '[ ]', ' mol·dm⁻³'],
    answer: ['0.13|0.125', '', '', '', ''],
    presentation: 'fitb', keyboard_type: 'standard_math', type: 'calc',
    unit: 'chemical_change', topic: 'acids_bases', subtopic: 'titration_calculations',
    skills: ['titration_concentration_calculation'],
    difficulty: 3, exam_weight: 3, xp: 15, order: 5,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p2',
    clues: '- Find n(HCℓ) = cV first, with V in dm³.\n- The balanced equation gives n(Na₂CO₃) : n(HCℓ) = 1 : 2; then c = n ÷ V of the carbonate solution.',
  },
  {
    name: 'Question 6',
    question: '250 cm³ of a 0,125 mol·dm⁻³ Na₂CO₃ solution was made by completely dissolving 8,94 g of hydrated sodium carbonate, Na₂CO₃·xH₂O, in water. Calculate the value of x: []',
    metadata: ['x = ', '[ ]'],
    answer: ['10', '', '', '', ''],
    presentation: 'fitb', keyboard_type: 'standard_math', type: 'calc',
    unit: 'chemical_change', topic: 'acids_bases', subtopic: 'titration_calculations',
    skills: ['hydrate_formula_calculation'],
    difficulty: 4, exam_weight: 3, xp: 20, order: 6,
    syllabus: 'dbe', subject: 'physics', year: 2024, paper: 'nov_p2',
    clues: '- n = cV gives the moles of hydrated salt dissolved; then M = m ÷ n.\n- Set M equal to M(Na₂CO₃) + 18x, using relative atomic masses from the periodic table.',
  },
];

const aiExplanation = {
  sub_questions: [
    {
      number: '7.1',
      marks: 2,
      clues: '- "Weak" refers to how much the base ionises in water.\n- State what ions are formed and how many.',
      approach: '- State the extent of ionisation.\n- State the ions formed and their concentration.',
      solution: '1. A weak base dissociates (ionises) incompletely in water to form a low concentration of hydroxide (OH⁻) ions.',
    },
    {
      number: '7.2',
      marks: 1,
      clues: '- A conjugate acid has one more H⁺ than its base.\n- Add H to the formula and +1 to the charge.',
      approach: '- Start from CO₃²⁻.\n- Add one H⁺.',
      solution: '1. CO₃²⁻ + H⁺ → HCO₃⁻, so the conjugate acid is HCO₃⁻(aq).',
    },
    {
      number: '7.3.1',
      marks: 1,
      clues: '- Volume used = final reading − initial reading.\n- In Run 1 the final reading p is unknown.',
      approach: '- Rearrange: final = initial + volume used.\n- Substitute Run 1 values.',
      solution: '1. p = 6,5 + 20,05 = 26,55 cm³.',
    },
    {
      number: '7.3.2',
      marks: 1,
      clues: '- Volume used = final reading − initial reading.\n- In Run 2 the initial reading q is unknown.',
      approach: '- Rearrange: initial = final − volume used.\n- Substitute Run 2 values.',
      solution: '1. q = 48,3 − 20,15 = 28,15 cm³.',
    },
    {
      number: '7.4',
      marks: 2,
      clues: '- HCℓ is a strong acid and K₂CO₃ a weak base.\n- Methyl orange changes colour in an acidic pH range.',
      approach: '- Predict the pH at the equivalence point for a strong acid and weak base.\n- Link it to the colour-change range of methyl orange.',
      solution: '1. A strong acid (HCℓ) reacting with a weak base (K₂CO₃) has its equivalence point at a pH less than 7 (acidic).\n2. Methyl orange changes colour within this acidic pH range, so the end point matches the equivalence point.',
    },
    {
      number: '7.5',
      marks: 5,
      clues: '- Use the AVERAGE volume of K₂CO₃: (20,05 + 20,15) ÷ 2.\n- n(K₂CO₃) = ½ n(HCℓ) from the balanced equation.',
      approach: '- n(HCℓ) = cV = 0,1 × 0,025.\n- n(K₂CO₃) = ½ n(HCℓ).\n- c(K₂CO₃) = n ÷ V(average) in dm³.',
      solution: '1. Average volume of K₂CO₃ = (20,05 + 20,15) ÷ 2 = 20,1 cm³ = 0,0201 dm³.\n2. n(HCℓ) = 0,1 × 0,025 = 2,5 × 10⁻³ mol.\n3. n(K₂CO₃) = ½ × 2,5 × 10⁻³ = 1,25 × 10⁻³ mol.\n4. c(K₂CO₃) = 1,25 × 10⁻³ ÷ 0,0201 = 0,0622 mol·dm⁻³ (0,06).',
    },
    {
      number: '7.6',
      marks: 5,
      clues: '- The 600 cm³ solution has the concentration you found in 7.5: use n = cV to find the moles of salt dissolved.\n- M(hydrate) = m ÷ n, and M(K₂CO₃·xH₂O) = 138 + 18x.',
      approach: '- n = cV = 0,0622 × 0,6.\n- M = 6,525 ÷ n.\n- Solve 138 + 18x = M for x.',
      solution: '1. n(K₂CO₃·xH₂O) = 0,0622 × 0,6 = 0,0373 mol.\n2. M = 6,525 ÷ 0,0373 = 174,84 g·mol⁻¹.\n3. 2(39) + 12 + 3(16) + 18x = 174,84, so 138 + 18x = 174,84.\n4. x = 2.',
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
