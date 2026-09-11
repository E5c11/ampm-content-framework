#!/usr/bin/env node
/**
 * DBE Physical Sciences: Chemistry P2 — November 2025 — Question 3 (order 7)
 * Organic Molecules — homologous series, vapour pressure/boiling point, intermolecular
 * forces. 12 marks, one continuous scenario (two bottled compounds A and B).
 *
 *   node tools/validate-questions.js --script scripts/add-physics-2025-nov-p2-q3.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-physics-2025-nov-p2-q3.js --dry-run
 *   node scripts/add-physics-2025-nov-p2-q3.js
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
  name: 'Question 3',
  syllabus: 'dbe',
  subject: 'physics',
  year: 2025,
  paper: 'nov_p2',
  order: 7,
  content_tier: 'free',
  has_video: false,
  xp: 40,
  tags: ['organic_molecules', 'homologous_series', 'intermolecular_forces'],
  question_image_urls: [`${PAPER}/q7/question_1.png`],
  memo_image_urls: [`${PAPER}/q7/memo_1.png`],
  exam_question_marks: 12,
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
    question: 'Which ONE of the following is the correct definition of a homologous series?',
    metadata: [
      'A series of compounds with the same functional group but different physical properties only',
      'A series of compounds that can be described by the same general formula, where each member differs from the next by a CH₂ group',
      'A series of compounds with the same molecular formula but different structural formulas',
      'A series of compounds that all have identical boiling points',
      '',
    ],
    answer: ['A series of compounds that can be described by the same general formula, where each member differs from the next by a CH₂ group', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'definition',
    unit: 'matter_materials',
    topic: 'organic_molecules',
    subtopic: 'homologous_series_classification',
    skills: ['homologous_series_recognition'],
    difficulty: 1,
    exam_weight: 1,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p2',
    clues:
      "- Distractor options confuse this with isomers (same molecular formula, different structures) or with a group of compounds that merely share physical properties.\n- Look for the option combining a shared general formula AND a fixed structural difference between consecutive members.",
  },
  {
    name: 'Question 2',
    question:
      'Compounds CH₃CH₂COOH and CH₃CH₂CH₂COOH belong to the same homologous series. Select ALL of the following compounds that ALSO belong to this series.',
    metadata: ['CH₃CH₂COOCH₃', 'CH₃CH₂CH₂CH₂COOH', 'CH₃CH₂CH₂OH', 'HCOOH', ''],
    answer: ['CH₃CH₂CH₂CH₂COOH', 'HCOOH', '', '', ''],
    presentation: 'multi_select',
    type: 'application',
    unit: 'matter_materials',
    topic: 'organic_molecules',
    subtopic: 'homologous_series_classification',
    skills: ['homologous_series_recognition'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p2',
    clues:
      "- The given pair are both carboxylic acids differing by one CH₂ group.\n- The other two options are an ester and an alcohol — different homologous series entirely.",
  },
  {
    name: 'Question 3',
    question:
      'Compound R is a carboxylic acid and compound S is an ester, both with a similar molar mass. Which ONE of the following correctly compares their boiling points and explains why?',
    metadata: [
      'S has a higher boiling point because esters form hydrogen bonds between molecules',
      'R and S have the same boiling point because they have the same molar mass',
      'R has a higher boiling point because carboxylic acids form hydrogen bonds between molecules, which are stronger than the dipole-dipole forces between ester molecules',
      'S has a higher boiling point because dipole-dipole forces are stronger than hydrogen bonds',
      '',
    ],
    answer: ['R has a higher boiling point because carboxylic acids form hydrogen bonds between molecules, which are stronger than the dipole-dipole forces between ester molecules', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'matter_materials',
    topic: 'organic_molecules',
    subtopic: 'physical_properties_organic',
    skills: ['intermolecular_force_comparison'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p2',
    clues:
      '- A carboxylic acid has an O-H bond capable of hydrogen bonding; an ester does not.\n- Boiling point is determined by the strength of the intermolecular forces that must be overcome, not by molar mass alone when it is similar between the two compounds.',
  },
  {
    name: 'Question 4',
    question:
      'Arrange the following three compounds in order of INCREASING strength of the intermolecular forces between their molecules: pentane (C₅H₁₂), propan-1-ol (CH₃CH₂CH₂OH), propanone (CH₃COCH₃).',
    metadata: ['Propan-1-ol', 'Pentane', 'Propanone'],
    answer: ['Pentane', 'Propanone', 'Propan-1-ol'],
    presentation: 'ordering',
    type: 'application',
    unit: 'matter_materials',
    topic: 'organic_molecules',
    subtopic: 'physical_properties_organic',
    skills: ['vapour_pressure_boiling_point_relationship'],
    difficulty: 2,
    exam_weight: 1,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'physics',
    year: 2025,
    paper: 'nov_p2',
    clues:
      "- A plain hydrocarbon can only form dispersion forces; a polar carbonyl compound adds dipole-dipole forces; a compound with an O-H bond can additionally form hydrogen bonds.\n- Of these three force types, dispersion forces alone are the weakest and hydrogen bonding is the strongest.",
  },
];

const aiExplanation = {
  sub_questions: [
    {
      number: '3.1',
      marks: 1,
      clues: '- The definition has two parts: a shared general formula, and a fixed structural difference between consecutive members.\n- Do not confuse this with the definition of structural isomers.',
      approach: '- State what stays constant (the general formula) and what changes by a fixed amount between successive members.',
      solution: '1. A homologous series is a series of organic compounds that can be described by the same general formula.\n2. Each member differs from the next by a CH₂ group.',
    },
    {
      number: '3.2',
      marks: 2,
      clues: '- Compounds A and B share the molecular formula C₄H₈O₂ but have different structures.\n- One of the drawn structures ends in -COOH; the other has a C-O-C linkage.',
      approach: '- Identify the functional group present in each compound from its structure.\n- Name the homologous series each functional group belongs to.',
      solution: '1. Compound A contains a -COOH group, the carboxylic acid functional group.\n2. Compound B contains a -COO- linkage, the ester functional group.\n3. The two homologous series are ester and carboxylic acid.',
    },
    {
      number: '3.3.1',
      marks: 2,
      clues: '- Compound A is the carboxylic acid, C₄H₈O₂.\n- A carboxylic acid\'s structural formula ends in a -C(=O)-O-H group.',
      approach: '- Draw the 4-carbon chain with a -COOH group at one end.',
      solution: '1. Compound A, C₄H₈O₂ as a carboxylic acid, is butanoic acid: CH₃CH₂CH₂COOH.\n2. Its full structural formula shows the -C(=O)-O-H group at the end of the chain.',
    },
    {
      number: '3.3.2',
      marks: 2,
      clues: '- Compound B is the ester with molecular formula C₄H₈O₂.\n- Several different esters share this molecular formula, depending on where the C-O-C linkage falls in the chain.',
      approach: '- Identify a possible arrangement of the -COO- group within a 4-carbon-equivalent chain.\n- Name the resulting ester using "[alkyl] [alkanoate]" naming.',
      solution: '1. One possible structure for C₄H₈O₂ as an ester is methyl propanoate, CH₃CH₂COOCH₃.\n2. Propyl methanoate and ethyl ethanoate are also acceptable, since all three are esters with this molecular formula.',
    },
    {
      number: '3.4.1',
      marks: 1,
      clues: '- Compound A is a carboxylic acid, which has an O-H bond.\n- An O-H bond attached to a small, highly electronegative atom allows a particularly strong intermolecular force.',
      approach: '- Identify the functional group in compound A and the strongest intermolecular force it can form.',
      solution: '1. Compound A (a carboxylic acid) has an O-H bond.\n2. This allows hydrogen bonding between molecules, the strongest of the Van der Waals forces.',
    },
    {
      number: '3.4.2',
      marks: 1,
      clues: '- Compound B is an ester, which has no O-H or N-H bond.\n- Esters are still polar molecules because of the C=O bond.',
      approach: '- Identify the functional group in compound B and the strongest intermolecular force available without an O-H or N-H bond.',
      solution: '1. Compound B (an ester) has no O-H bond, so hydrogen bonding is not possible.\n2. Its C=O bond is polar, so the strongest force between ester molecules is dipole-dipole forces.',
    },
    {
      number: '3.5',
      marks: 2,
      clues: '- Boiling point depends on the strength of the intermolecular forces that must be overcome.\n- One of these two compounds forms hydrogen bonds; the other only forms dipole-dipole forces.',
      approach: '- Compare the strongest intermolecular force present in each compound.\n- Link the stronger force to the higher boiling point.',
      solution: "1. Compound A forms hydrogen bonds between its molecules; compound B only forms dipole-dipole forces.\n2. Hydrogen bonds are stronger than dipole-dipole forces, so more energy is needed to separate compound A's molecules.\n3. Compound A has the higher boiling point.",
    },
    {
      number: '3.6',
      marks: 1,
      clues: '- A liquid boils when its vapour pressure equals the surrounding atmospheric pressure.\n- Lower atmospheric pressure means less vapour pressure — and therefore less heating — is needed to boil.',
      approach: '- Relate atmospheric pressure to the vapour pressure needed for boiling to occur.',
      solution: '1. At a lower atmospheric pressure, the liquid needs to reach a lower vapour pressure to boil.\n2. Less energy (a lower temperature) is needed to reach that vapour pressure.\n3. The boiling point decreases.',
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
