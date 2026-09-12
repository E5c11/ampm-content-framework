#!/usr/bin/env node
/**
 * DBE Life Sciences P2 — November 2025 — Question 2.5 (Incomplete Dominance and
 * Selective Breeding) (order 11)
 *
 * Real Q2.5 (12 marks, palomino horse coat colour) — no diagram, but Q2.5.4 asks for a
 * full genetic cross ("use a genetic cross to show the expected phenotypic ratio").
 * DESIGN-LIFE-01's decompose-never-draw rule applies: Question 5 below asks for the
 * resulting ratio as a bare-numeric fitb count instead of a drawn Punnett square.
 *
 * Fresh scenario (rabbit fur colour) instead of the real exam's palomino horses
 * (DESIGN-UNI-01). Topic reuses `genetics_and_inheritance`. Independent lesson
 * (DESIGN-UNI-13).
 *
 *   node tools/validate-questions.js --script scripts/add-life-science-2025-nov-p2-q2-5-incomplete-dominance.js
 *   node scripts/add-life-science-2025-nov-p2-q2-5-incomplete-dominance.js --dry-run
 *   node scripts/add-life-science-2025-nov-p2-q2-5-incomplete-dominance.js
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
  name: 'Question 2.5 (Incomplete Dominance and Selective Breeding)',
  syllabus: 'dbe',
  subject: 'life_science',
  year: 2025,
  paper: 'nov_p2',
  order: 11,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['incomplete_dominance', 'biotechnology'],
  question_image_urls: ["https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2025/nov_p2/q11/question_1.png"],
  memo_image_urls: ["https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2025/nov_p2/q11/memo_1.png","https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2025/nov_p2/q11/memo_2.png"],
  exam_question_marks: 12,
};

const questions = [
  {
    name: 'Question 1',
    question:
      'In a species of rabbit, black fur (allele B) and white fur (allele W) blend to produce grey fur in heterozygous (BW) rabbits. What type of dominance is this?',
    metadata: ['Complete dominance', 'Codominance', 'Incomplete dominance', 'Sex-linked inheritance', ''],
    answer: ['Incomplete dominance', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'molecular_cellular_tissue_level',
    topic: 'genetics_and_inheritance',
    subtopic: 'incomplete_dominance_identification',
    skills: ['identify_incomplete_dominance'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'life_science',
    year: 2025,
    paper: 'nov_p2',
    clues: '- A single blended colour appears, not two distinct colours side by side.\n- Neither allele fully masks the other, but they don\'t stay separate either.',
  },
  {
    name: 'Question 2',
    question:
      'Why is the fur colour inheritance in Question 1 classified this way, rather than as codominance?',
    metadata: [
      'Because the heterozygous phenotype (grey) is a blended, intermediate colour rather than distinct patches of black and white',
      'Because grey rabbits are infertile',
      'Because the B and W alleles are located on different chromosomes',
      'Because only males can be grey',
      '',
    ],
    answer: ['Because the heterozygous phenotype (grey) is a blended, intermediate colour rather than distinct patches of black and white', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'molecular_cellular_tissue_level',
    topic: 'genetics_and_inheritance',
    subtopic: 'incomplete_dominance_vs_codominance',
    skills: ['distinguish_incomplete_dominance_from_codominance'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'life_science',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Codominance would show both colours separately and distinctly, e.g. black and white patches.\n- A single, new, in-between colour is the giveaway for the other type of dominance relationship.',
  },
  {
    name: 'Question 3',
    question: 'Breeders who deliberately mate rabbits with desired fur colours to produce specific offspring are using which type of biotechnology?',
    metadata: ['Genetic engineering', 'Selective breeding', 'Cloning', 'Stem cell therapy', ''],
    answer: ['Selective breeding', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'definition',
    unit: 'molecular_cellular_tissue_level',
    topic: 'genetics_and_inheritance',
    subtopic: 'selective_breeding_identification',
    skills: ['identify_selective_breeding'],
    difficulty: 1,
    exam_weight: 1,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'life_science',
    year: 2025,
    paper: 'nov_p2',
    clues: '- No DNA is directly modified or copied here — only which individuals are allowed to mate is controlled.\n- This is the oldest and simplest of the listed techniques, long used by farmers and breeders.',
  },
  {
    name: 'Question 4',
    question: 'Which TWO phenotypes of rabbit must be interbred to guarantee that 100% of the offspring are grey?',
    metadata: ['Black', 'White', 'Grey', 'Brown (not part of this gene)', 'Albino (not part of this gene)'],
    answer: ['Black', 'White', '', '', ''],
    presentation: 'multi_select',
    type: 'application',
    unit: 'molecular_cellular_tissue_level',
    topic: 'genetics_and_inheritance',
    subtopic: 'incomplete_dominance_parent_phenotypes',
    skills: ['identify_cross_parent_phenotypes'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'life_science',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Look for the two phenotypes that are each homozygous for a different allele.\n- Crossing two homozygous parents for different alleles gives only one possible genotype in every offspring.',
  },
  {
    name: 'Question 5',
    question: 'A grey rabbit (BW) is crossed with a white rabbit (WW). Out of every 4 offspring on average, how many would be expected to be grey?',
    metadata: ['= ', '[ ]'],
    answer: ['2', '', '', '', ''],
    presentation: 'fitb',
    type: 'application',
    unit: 'molecular_cellular_tissue_level',
    topic: 'genetics_and_inheritance',
    subtopic: 'incomplete_dominance_cross_ratio',
    skills: ['calculate_incomplete_dominance_ratio'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 5,
    syllabus: 'dbe',
    subject: 'life_science',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Cross BW × WW and list all four possible offspring genotype combinations.\n- Half of the possible combinations come out BW (grey); the rest come out WW (white).',
  },
];

const aiExplanation = {
  sub_questions: [
    {
      number: '2.5.1',
      marks: 1,
      clues: '- The heterozygous offspring shows a blended, in-between colour rather than one parent colour dominating.\n- Consider whether this is complete dominance, codominance, or something else.',
      approach: '- Determine whether the heterozygous phenotype resembles one parent exactly, shows both parent colours separately, or blends them.\n- Match this pattern to the correct type of dominance.',
      solution: '1. The heterozygous (palomino) coat colour is an intermediate blend between the two parent colours.\n2. This pattern is called incomplete dominance.',
    },
    {
      number: '2.5.2',
      marks: 2,
      clues: '- Neither parent allele fully masks the other in this case.\n- Consider what phenotype results when the two alleles blend rather than one dominating.',
      approach: '- Explain why neither the cream nor the chestnut allele is dominant over the other.\n- Describe the resulting intermediate phenotype produced by this blending.',
      solution: '1. Neither the cream-coat allele nor the chestnut-coat allele is dominant over the other.\n2. This results in an intermediate phenotype — the golden-coloured (palomino) coat.',
    },
    {
      number: '2.5.3(a)',
      marks: 1,
      clues: '- This involves deliberately choosing which individuals breed together, not altering their DNA directly.\n- It is a long-established agricultural practice.',
      approach: '- Consider that no DNA is directly modified here — only which individuals are allowed to mate.\n- Recall the specific term for this technique.',
      solution: '1. Deliberately breeding individuals with desired characteristics is called selective breeding (artificial selection).',
    },
    {
      number: '2.5.3(b)',
      marks: 2,
      clues: '- Consider which TWO parent phenotypes, when crossed, would guarantee every offspring is heterozygous.\n- Both parents should be homozygous for a different one of the two alleles.',
      approach: '- Recall which two phenotypes correspond to the two homozygous genotypes for this gene.\n- Confirm that crossing these two homozygous parents gives only heterozygous (palomino) offspring.',
      solution: '1. Interbreeding a cream-coloured (homozygous) horse with a chestnut-coloured (homozygous) horse guarantees every offspring inherits one allele of each type.\n2. Every offspring will therefore be heterozygous — palomino.\n3. The two phenotypes are cream-coloured and chestnut-coloured.',
    },
    {
      number: '2.5.4',
      marks: 6,
      clues: '- Determine the genotype of each parent from their phenotype first.\n- Work out every possible gamete combination between the two parents systematically.',
      approach: '- Write the genotype and gametes for the cream-coloured parent (homozygous).\n- Write the genotype and gametes for the palomino parent (heterozygous).\n- Combine every possible gamete pairing to find all offspring genotypes and phenotypes, then express this as a ratio.',
      solution: '1. The cream-coloured parent has genotype AA and produces only A gametes.\n2. The palomino parent has genotype AG and produces A and G gametes.\n3. Combining these gametes gives offspring genotypes AA, AA, AG, AG.\n4. This corresponds to a 1:1 ratio of cream-coloured to palomino offspring.',
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
