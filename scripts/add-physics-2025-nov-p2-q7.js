#!/usr/bin/env node
/**
 * DBE Physical Sciences: Chemistry P2 — November 2025 — Question 7 (order 11)
 * Acids & Bases — Ka, conjugate acid/base, ampholytes, pH, titration. 20 marks, one
 * continuous question (7.1 phosphoric acid ionisation steps, 7.2 Ba(OH)2/HCl titration).
 *
 *   node tools/validate-questions.js --script scripts/add-physics-2025-nov-p2-q7.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-physics-2025-nov-p2-q7.js --dry-run
 *   node scripts/add-physics-2025-nov-p2-q7.js
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
  name: 'Question 7',
  syllabus: 'dbe',
  subject: 'physics',
  year: 2025,
  paper: 'nov_p2',
  order: 11,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['acid_base_reactions', 'ph_scale', 'titration'],
  question_image_urls: [`${PAPER}/q11/question_1.png`],
  memo_image_urls: [`${PAPER}/q11/memo_1.png`, `${PAPER}/q11/memo_2.png`, `${PAPER}/q11/memo_3.png`, `${PAPER}/q11/memo_4.png`],
  exam_question_marks: 20,
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
      'Two acids have the following Ka values: HA, Ka = 1,8 × 10⁻⁵; HB, Ka = 4,9 × 10⁻¹⁰. Which ONE of the following is CORRECT?',
    metadata: [
      'HB is the stronger acid, since its Ka is smaller',
      'HA is the stronger acid, since its Ka is larger',
      'HA and HB are equally strong acids',
      'The Ka values cannot be compared without concentration data',
      '',
    ],
    answer: ['HA is the stronger acid, since its Ka is larger', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'chemical_change',
    topic: 'acids_bases',
    subtopic: 'ka_kb_ph_calculations',
    skills: ['ka_strength_comparison'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p2',
    clues:
      '- A larger Ka means the acid ionises to a greater extent in water.\n- Comparing Ka values directly tells you relative acid strength, independent of concentration.',
  },
  {
    name: 'Question 2',
    question:
      'In the reaction HSO₄⁻(aq) + H₂O(ℓ) ⇌ SO₄²⁻(aq) + H₃O⁺(aq), select ALL of the following that correctly identify a conjugate acid-base pair.',
    metadata: ['HSO₄⁻ and SO₄²⁻', 'H₂O and H₃O⁺', 'HSO₄⁻ and H₃O⁺', 'H₂O and SO₄²⁻', ''],
    answer: ['HSO₄⁻ and SO₄²⁻', 'H₂O and H₃O⁺', '', '', ''],
    presentation: 'multi_select',
    type: 'application',
    unit: 'chemical_change',
    topic: 'acids_bases',
    subtopic: 'conjugate_acid_base_pairs',
    skills: ['conjugate_acid_base_identification'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p2',
    clues:
      '- A conjugate acid-base pair differs by exactly one proton (H⁺).\n- Check each option: does the second species form from the first by gaining or losing a single H⁺?',
  },
  {
    name: 'Question 3',
    question:
      'HCO₃⁻ can act as either an acid or a base, depending on the reaction. When sodium hydrogen carbonate, NaHCO₃(s), is dissolved in water, will the resulting solution be ACIDIC or BASIC?',
    metadata: [
      'Acidic, because HCO₃⁻ donates a proton to water',
      'Basic, because HCO₃⁻ accepts a proton from water more readily than it donates one',
      'Neutral, because HCO₃⁻ does not react with water',
      'Acidic, because Na⁺ reacts with water to form H₃O⁺',
      '',
    ],
    answer: ['Basic, because HCO₃⁻ accepts a proton from water more readily than it donates one', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'chemical_change',
    topic: 'acids_bases',
    subtopic: 'ampholyte_hydrolysis',
    skills: ['ampholyte_hydrolysis_reasoning'],
    difficulty: 3,
    exam_weight: 2,
    xp: 15,
    order: 3,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p2',
    clues:
      "- HCO₃⁻ is an ampholyte — it can both accept and donate a proton.\n- Whether the resulting solution is acidic or basic depends on which of these two reactions with water happens more readily.",
  },
  {
    name: 'Question 4',
    question: 'A solution has a pH of 11,00 at 25°C. Calculate the concentration of OH⁻ ions in this solution (in mol·dm⁻³): []',
    metadata: ['[OH⁻] = ', '[ ]', ' mol·dm⁻³'],
    answer: ['0.001', '', '', '', ''],
    presentation: 'fitb',
    type: 'calc',
    unit: 'chemical_change',
    topic: 'acids_bases',
    subtopic: 'ka_kb_ph_calculations',
    skills: ['ph_poh_conversion'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p2',
    clues:
      '- Use pH + pOH = 14 to find pOH from the given pH.\n- Then use [OH⁻] = 10⁻ᵖᴼᴴ.',
  },
  {
    name: 'Question 5',
    question:
      '25 cm³ of a NaOH solution of unknown concentration is exactly neutralised by 20 cm³ of a 0,15 mol·dm⁻³ HCl solution, according to: NaOH(aq) + HCl(aq) → NaCl(aq) + H₂O(ℓ). Calculate the concentration of the NaOH solution (in mol·dm⁻³): []',
    metadata: ['c(NaOH) = ', '[ ]', ' mol·dm⁻³'],
    answer: ['0.12', '', '', '', ''],
    presentation: 'fitb',
    type: 'calc',
    unit: 'chemical_change',
    topic: 'acids_bases',
    subtopic: 'titration_calculations',
    skills: ['titration_concentration_calculation'],
    difficulty: 3,
    exam_weight: 3,
    xp: 15,
    order: 5,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p2',
    clues:
      '- Use the given HCl volume and concentration to find the moles of HCl that reacted.\n- The 1:1 mole ratio between NaOH and HCl means the NaOH moles equal the HCl moles — divide by the NaOH volume to get its concentration.',
  },
];

const aiExplanation = {
  sub_questions: [
    {
      number: '7.1.1',
      marks: 2,
      clues: '- Each ionisation step has its own Ka value.\n- A larger Ka means that species ionises more readily, making it the stronger acid of the two.',
      approach: '- Compare the Ka values for the two given ionisation steps.',
      solution: '1. Ka for H₂PO₄⁻ (6,2 × 10⁻⁸) is greater than Ka for HPO₄²⁻ (4,8 × 10⁻¹³).\n2. H₂PO₄⁻ is the stronger acid.',
    },
    {
      number: '7.1.2',
      marks: 1,
      clues: '- A conjugate base forms when an acid loses one H⁺.\n- Remove one H⁺ from H₂PO₄⁻ to find its conjugate base.',
      approach: '- Subtract one H⁺ (and adjust the charge) from H₂PO₄⁻.',
      solution: '1. Removing one H⁺ from H₂PO₄⁻ gives HPO₄²⁻.',
    },
    {
      number: '7.1.3',
      marks: 1,
      clues: '- An ampholyte can act as both an acid (donating H⁺) and a base (accepting H⁺) in different reactions.\n- Look for a species that appears as a product in one ionisation step and as a reactant in the next.',
      approach: '- Find a species common to two consecutive ionisation steps, once as a product and once as a reactant.',
      solution: '1. H₂PO₄⁻ appears as a product in the first ionisation (acting as a base relative to H₃PO₄) and as a reactant in the second (acting as an acid).\n2. H₂PO₄⁻ (or HPO₄²⁻, by the same reasoning between steps two and three) behaves as an ampholyte.',
    },
    {
      number: '7.1.4',
      marks: 1,
      clues: '- HPO₄²⁻ is the anion released when Na₂HPO₄ dissolves.\n- Compare how readily HPO₄²⁻ reacts with water as an acid versus as a base.',
      approach: "- Decide whether HPO₄²⁻ donating or accepting a proton from water is more favourable, based on the relative Ka values given.",
      solution: '1. HPO₄²⁻ reacting as a base (accepting H⁺ from water) is favoured over it reacting as an acid.\n2. The resulting solution is basic.',
    },
    {
      number: '7.1.5',
      marks: 3,
      clues: '- HPO₄²⁻ acting as a base reacts with water, accepting a proton.\n- The products are H₂PO₄⁻ and OH⁻.',
      approach: '- Write HPO₄²⁻ reacting with H₂O, showing it accepting a proton to form H₂PO₄⁻ and releasing OH⁻.\n- Balance the equation and include an equilibrium arrow.',
      solution: '1. HPO₄²⁻(aq) + H₂O(ℓ) ⇌ H₂PO₄⁻(aq) + OH⁻(aq).\n2. This reaction produces OH⁻, explaining why the solution is basic.',
    },
    {
      number: '7.2.1',
      marks: 4,
      clues: '- Use the given final pH to find [H₃O⁺], then use Kw = [H₃O⁺][OH⁻] = 10⁻¹⁴ to find [OH⁻].\n- Alternatively, use pH + pOH = 14 to find pOH first, then [OH⁻] = 10⁻ᵖᴼᴴ.',
      approach: '- Convert the given pH (12,62) to pOH.\n- Convert pOH to [OH⁻].',
      solution: '1. pOH = 14 − 12,62 = 1,38.\n2. [OH⁻] = 10⁻¹·³⁸ ≈ 0,04 mol·dm⁻³.',
    },
    {
      number: '7.2.2',
      marks: 8,
      clues: '- First find how many moles of HCℓ reacted, then use the 1:2 mole ratio (Ba(OH)₂ : HCℓ) to find how many moles of Ba(OH)₂ were neutralised.\n- The remaining OH⁻ at equilibrium (from part 7.2.1) also came from Ba(OH)₂ — add this back to find the total Ba(OH)₂ originally dissolved, then scale from 25 cm³ up to the full 100 cm³ solution.',
      approach: '- Calculate n(HCℓ) used, then n(Ba(OH)₂) that reacted with it via the 1:2 ratio.\n- Calculate n(OH⁻) still present in the 25 cm³ portion at the final pH, and convert this back to additional n(Ba(OH)₂).\n- Add the reacted and remaining amounts to get the total n(Ba(OH)₂) in 25 cm³, then scale up to 100 cm³.',
      solution: '1. n(HCℓ) = (0,2)(0,015) = 3 × 10⁻³ mol; n(Ba(OH)₂) reacted = ½ × 3 × 10⁻³ = 1,5 × 10⁻³ mol.\n2. n(OH⁻) remaining in 25 cm³ = (0,0417)(0,025) ≈ 1,04 × 10⁻³ mol (using the more precise [OH⁻] from 7.2.1); n(Ba(OH)₂) equivalent = ½ of this ≈ 5,2 × 10⁻⁴ mol.\n3. Total n(Ba(OH)₂) in the original 25 cm³ ≈ 2,33 × 10⁻³ mol.\n4. Scaling from 25 cm³ to 100 cm³ (× 4): n(Ba(OH)₂) ≈ 9,34 × 10⁻³ mol.',
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
