#!/usr/bin/env node
/**
 * DBE Life Sciences P2 — November 2025 — Question 2.4 (Blood Group Inheritance) (order 10)
 *
 * Real Q2.4 (9 marks) is built around a bar-graph of blood-group percentages for two
 * ethnic groups — DESIGN-UNI-10 rule 1, one lesson. Fresh practice questions give the
 * survey data as plain text (percentages stated in the question itself) instead of a
 * redrawn bar graph, same text-description approach as the other diagram-flagged lessons
 * this session — the underlying skill (reading a distribution, converting % to a count,
 * reasoning about genotype/codominance) doesn't need a rendered chart to be tested.
 *
 * Topic reuses `genetics_and_inheritance`. Independent lesson (DESIGN-UNI-13).
 *
 * NOTE for future scripts in this batch: don't factor a shared scenario sentence into an
 * outer `const` and reference it inside `questions` — tools/validate-questions.js evals
 * just the extracted `questions = [...]` block in isolation, so an outer variable is
 * undefined there and extraction silently fails (hit and fixed in
 * add-life-science-2025-nov-p2-q2-3-pedigree.js). Repeat the text inline per question.
 *
 *   node tools/validate-questions.js --script scripts/add-life-science-2025-nov-p2-q2-4-blood-groups.js
 *   node scripts/add-life-science-2025-nov-p2-q2-4-blood-groups.js --dry-run
 *   node scripts/add-life-science-2025-nov-p2-q2-4-blood-groups.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

const video = {
  name: 'Question 2.4 (Blood Group Inheritance)',
  syllabus: 'dbe',
  subject: 'life_science',
  year: 2025,
  paper: 'nov_p2',
  order: 10,
  content_tier: 'free',
  has_video: false,
  xp: 40,
  tags: ['blood_groups', 'genetics_and_inheritance'],
  question_image_urls: ["https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2025/nov_p2/q10/question_1.png"],
  memo_image_urls: ["https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2025/nov_p2/q10/memo_1.png"],
  exam_question_marks: 9,
};

const questions = [
  {
    name: 'Question 1',
    question:
      'In a health survey of 800 people in a town, the blood group distribution was: A - 38%, B - 12%, AB - 6%, O - 44%. Which blood group is most common in this population?',
    metadata: ['A', 'B', 'AB', 'O', ''],
    answer: ['O', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'molecular_cellular_tissue_level',
    topic: 'genetics_and_inheritance',
    subtopic: 'blood_group_distribution_reading',
    skills: ['read_blood_group_distribution'],
    difficulty: 1,
    exam_weight: 1,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'life_science',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Compare all four percentages directly against each other.\n- The most common group has the largest percentage.',
    supplementary_material: {
      type: 'graph',
      label: 'Blood Group Distribution',
      image_urls: ['https://media-dev.askmoreprepmore.app/question_supplementary/life_science/2025/nov_p2/q10/graph_1.png'],
    },
  },
  {
    name: 'Question 2',
    question:
      'In the same survey of 800 people (blood group AB = 6%), calculate the number of people with blood group AB in the survey.',
    metadata: ['= ', '[ ]'],
    answer: ['48', '', '', '', ''],
    presentation: 'fitb',
    type: 'application',
    unit: 'molecular_cellular_tissue_level',
    topic: 'genetics_and_inheritance',
    subtopic: 'blood_group_percentage_calculation',
    skills: ['calculate_population_percentage'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'life_science',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Convert the percentage to a decimal and multiply by the total population surveyed.\n- 6% means 6 out of every 100 people.',
    supplementary_material: {
      type: 'graph',
      label: 'Blood Group Distribution',
      image_urls: ['https://media-dev.askmoreprepmore.app/question_supplementary/life_science/2025/nov_p2/q10/graph_1.png'],
    },
  },
  {
    name: 'Question 3',
    question: 'A person has blood group A. Which of the following are possible genotypes for this person?',
    metadata: ['IAIA', 'IAi', 'IBIB', 'IBi', 'ii'],
    answer: ['IAIA', 'IAi', '', '', ''],
    presentation: 'multi_select',
    type: 'application',
    unit: 'molecular_cellular_tissue_level',
    topic: 'genetics_and_inheritance',
    subtopic: 'blood_group_genotype_possibilities',
    skills: ['identify_blood_group_genotypes'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'life_science',
    year: 2025,
    paper: 'nov_p2',
    clues: '- The IA allele is dominant over i, so one or two copies of IA both give blood group A.\n- Any genotype containing an IB allele instead produces the B antigen, not group A.',
  },
  {
    name: 'Question 4',
    question: 'A person has blood group AB. What does this indicate about the IA and IB alleles in this person?',
    metadata: [
      'The IA and IB alleles are codominant — both are fully expressed in this person',
      'The IA allele is dominant over the IB allele',
      'The IB allele is dominant over the IA allele',
      'This person is homozygous for a single blood-group allele',
      '',
    ],
    answer: ['The IA and IB alleles are codominant — both are fully expressed in this person', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'definition',
    unit: 'molecular_cellular_tissue_level',
    topic: 'genetics_and_inheritance',
    subtopic: 'ab_blood_group_codominance',
    skills: ['explain_ab_codominance'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'life_science',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Blood group AB means both antigen types are present on the red blood cells at once.\n- Neither allele masks the other — that\'s the definition of this type of dominance relationship.',
  },
];

const aiExplanation = {
  sub_questions: [
    {
      number: '2.4.1(a)',
      marks: 1,
      clues: '- Compare the percentage values shown for each blood group across both ethnic groups.\n- Look for the blood group with the highest percentage in both groups.',
      approach: '- Compare the percentage for each blood group between the two ethnic groups.\n- Identify which blood group has the highest percentage in BOTH groups.',
      solution: '1. Comparing all four blood groups across both ethnic groups shows blood group O has the highest percentage in each.\n2. The answer is blood group O.',
    },
    {
      number: '2.4.1(b)',
      marks: 1,
      clues: "- Compare each blood group's percentage between ethnic group 1 and ethnic group 2.\n- Find the blood group where group 1's percentage is clearly larger.",
      approach: '- Compare the percentage values for each blood group side by side between the two ethnic groups.\n- Identify which blood group shows a higher value for ethnic group 1.',
      solution: '1. Comparing the two ethnic groups\' percentages for each blood group shows blood group A is higher in ethnic group 1 than in ethnic group 2.\n2. The answer is blood group A.',
    },
    {
      number: '2.4.2',
      marks: 2,
      clues: '- Identify which blood group corresponds to 11% in ethnic group 1.\n- List the genotype(s) that would produce this blood group phenotype.',
      approach: '- Match the 11% value to its corresponding blood group in the graph.\n- Recall which genotypes produce this blood group phenotype (homozygous and heterozygous options).',
      solution: '1. The 11% value corresponds to blood group B in ethnic group 1.\n2. Blood group B can result from genotype IBIB or IBi.\n3. Both genotypes should be given.',
    },
    {
      number: '2.4.3',
      marks: 2,
      clues: '- Divide the given number of people by the total population to find the percentage this represents.\n- Match this percentage to the corresponding blood group in the graph.',
      approach: '- Calculate what percentage 39 600 represents of the total population of 360 000.\n- Match this calculated percentage to the blood group showing that value in the graph.',
      solution: '1. 39 600 ÷ 360 000 × 100 = 11%.\n2. In ethnic group 1, the blood group with 11% is blood group B.\n3. The answer is blood group B.',
    },
    {
      number: '2.4.4',
      marks: 3,
      clues: '- Blood group AB results from inheriting one specific allele from each parent.\n- Consider what type of dominance relationship exists between these two alleles.',
      approach: '- Identify which two alleles must be inherited, one from each parent, to produce blood group AB.\n- Recall the dominance relationship between these two alleles.\n- Explain how this relationship results in the AB phenotype being expressed.',
      solution: '1. A person with blood group AB inherits the IA allele from one parent and the IB allele from the other parent.\n2. The IA and IB alleles are co-dominant — neither masks the other.\n3. Both alleles are therefore equally expressed in the phenotype, producing blood group AB.',
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
    console.error(
      '\n   curriculum_nodes / skills → node tools/create-curriculum-node.js | create-skill.js' +
      '\n   tags → node tools/create-tag.js',
    );
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
