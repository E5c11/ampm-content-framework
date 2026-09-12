#!/usr/bin/env node
/**
 * DBE Physical Sciences: Chemistry P2 — November 2023 — Question 1, Part 4 (order 4)
 * MCQ items 1.7–1.8 — Acids & Bases (strong vs weak acid comparison, titration
 * overshoot / endpoint reasoning).
 *
 *   node tools/validate-questions.js --script scripts/add-physics-2023-nov-p2-q1-part4.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-physics-2023-nov-p2-q1-part4.js --dry-run
 *   node scripts/add-physics-2023-nov-p2-q1-part4.js
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
  name: 'Question 1.7–1.8',
  syllabus: 'dbe',
  subject: 'physics',
  year: 2023,
  paper: 'nov_p2',
  order: 4,
  content_tier: 'free',
  has_video: false,
  xp: 35,
  tags: ['acids_bases', 'strong_weak_acids', 'titration'],
  question_image_urls: [`${PAPER}/q4/question_1.png`],
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
      'Four aqueous solutions, each 0,1 mol·dm⁻³, are prepared: hydrochloric acid (a strong acid), ethanoic acid (a weak acid), ammonia (a weak base), and sodium hydroxide (a strong base). Arrange these four solutions in order of INCREASING pH.',
    metadata: [
      '0,1 mol·dm⁻³ ethanoic acid',
      '0,1 mol·dm⁻³ hydrochloric acid',
      '0,1 mol·dm⁻³ sodium hydroxide',
      '0,1 mol·dm⁻³ ammonia',
    ],
    answer: [
      '0,1 mol·dm⁻³ hydrochloric acid',
      '0,1 mol·dm⁻³ ethanoic acid',
      '0,1 mol·dm⁻³ ammonia',
      '0,1 mol·dm⁻³ sodium hydroxide',
    ],
    presentation: 'ordering',
    type: 'application',
    unit: 'chemical_change',
    topic: 'acids_bases',
    subtopic: 'ph_strength_ordering',
    skills: ['acid_base_strength_ordering'],
    difficulty: 3,
    exam_weight: 2,
    xp: 15,
    order: 1,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2023,
    paper: 'nov_p2',
    clues:
      '- At the same concentration, a strong acid ionises more fully than a weak acid, giving it a lower pH; the same logic applies to strong vs weak bases at the high-pH end.\n- Order the two acids relative to each other first, then the two bases, then combine the two halves.',
  },
  {
    name: 'Question 2',
    question:
      'Hydrochloric acid, HCℓ(aq), and hydrofluoric acid, HF(aq), of equal volumes and equal concentrations, are compared. Select ALL of the following statements that are TRUE for these two solutions.',
    metadata: [
      'They have the same pH',
      'They require the same number of moles of NaOH(aq) for complete neutralisation',
      'HCℓ(aq) has a higher electrical conductivity than HF(aq)',
      'They have the same concentration of H₃O⁺(aq) ions',
      '',
    ],
    answer: [
      'They require the same number of moles of NaOH(aq) for complete neutralisation',
      'HCℓ(aq) has a higher electrical conductivity than HF(aq)',
      '',
      '',
      '',
    ],
    presentation: 'multi_select',
    type: 'application',
    unit: 'chemical_change',
    topic: 'acids_bases',
    subtopic: 'acid_base_reactions',
    skills: ['acid_base_strength_ordering'],
    difficulty: 3,
    exam_weight: 2,
    xp: 15,
    order: 2,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2023,
    paper: 'nov_p2',
    clues:
      '- Neutralisation depends on the TOTAL number of moles of acid present, whether strong or weak — not on how many of those molecules have ionised at any instant.\n- Conductivity and pH, on the other hand, depend on the actual concentration of ions in solution right now, which does depend on acid strength.',
  },
  {
    name: 'Question 3',
    question:
      'In a titration, dilute nitric acid, HNO₃(aq), is added dropwise from a burette into a fixed volume of sodium hydroxide, NaOH(aq), in a flask. The learner accidentally adds acid well past the endpoint. Which ONE of the following will be TRUE for the resulting mixture?',
    metadata: ['[H⁺] < [OH⁻] and pH > 7', '[H⁺] > [OH⁻] and pH < 7', '[H⁺] < [OH⁻] and pH < 7', '[H⁺] > [OH⁻] and pH > 7', ''],
    answer: ['[H⁺] > [OH⁻] and pH < 7', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'chemical_change',
    topic: 'acids_bases',
    subtopic: 'acid_base_reactions',
    skills: ['acid_base_product_identification'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2023,
    paper: 'nov_p2',
    clues:
      '- At the exact endpoint, moles of acid and base are equal. Adding acid well past that point breaks this balance in one specific direction.\n- Whichever species is now in excess determines both the ion inequality and whether the solution is acidic or basic.',
  },
];

const aiExplanation = {
  sub_questions: [
    {
      number: '1.7',
      marks: 2,
      clues:
        '- Strong and weak acids of the same concentration differ in how fully they ionise, which affects pH and conductivity but not the total moles of acid present.\n- Test each statement against this distinction separately.',
      approach:
        '- Recall that HNO₃ is a strong acid (ionises completely) and CH₃COOH is a weak acid (ionises partially).\n- Check pH, conductivity, and neutralising-moles for each statement in turn.',
      solution:
        '1. HNO₃ ionises fully, releasing more H₃O⁺(aq) than the partially-ionised CH₃COOH at the same concentration, so they have different pH values — statement (i) is TRUE.\n2. More free ions in solution means higher electrical conductivity, so HNO₃(aq) conducts better than CH₃COOH(aq) — statement (ii) is FALSE.\n3. Neutralisation depends on total moles of acid present (not on how ionised it is), and both solutions have equal concentration and volume, so they need the same moles of KOH(aq) — statement (iii) is TRUE.\n4. The correct answer is C: (i) and (iii) only.',
    },
    {
      number: '1.8',
      marks: 2,
      clues:
        '- The burette contains HCℓ(aq), being added into the KOH(aq) mixture.\n- Exceeding the endpoint means one specific reactant is now present in excess — identify which one, from the direction of addition.',
      approach:
        '- Identify which reagent is added from the burette (the acid) and which is in the flask (the base).\n- Determine which species is left in excess once the endpoint is passed, then relate that to [H⁺] vs [OH⁻] and pH.',
      solution:
        '1. HCℓ(aq) is added from the burette into the KOH(aq) titration mixture.\n2. At the endpoint, moles of HCℓ and KOH are equal; adding MORE HCℓ past this point leaves excess H⁺(aq) in the mixture.\n3. Excess H⁺(aq) means [H⁺] > [OH⁻], and the solution becomes acidic, so pH < 7.\n4. The correct answer is A: [H⁺] > [OH⁻] and pH < 7.',
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
