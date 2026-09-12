#!/usr/bin/env node
/**
 * DBE Life Sciences P2 — November 2025 — Question 1 (Meiosis) (order 2)
 *
 * Bundles real sub-items 1.1.8, 1.1.9 (dihybrid cross via meiosis, from the Q1.1 MCQ
 * block) and 1.3.1, 1.3.3 (from the Q1.3 classification block) — the meiosis knowledge-
 * area cluster per subjects/dbe-life-sciences.md's paper-structure table. 8 real marks.
 * Independent lesson (DESIGN-UNI-13) — unrelated identification/reasoning items, no
 * chained sub-question sequence.
 *
 * DESIGN-LIFE-01: Question 4 is bare-numeric fitb (a gamete-genotype count) — the
 * natural fitb candidate this session flagged as worth testing on dev/emulator once
 * curriculum nodes exist and this uploads. Everything else here is multiple_choice/
 * multi_select on purpose (no typed genotype or term-recall content).
 *
 * Curriculum nodes NOT yet created in Postgres — see add-life-science-2025-nov-p2-q1-
 * dna.js's header note; same status here. question_image_urls/memo_image_urls left
 * empty for the same reason (image extraction not yet run).
 *
 *   node tools/validate-questions.js --script scripts/add-life-science-2025-nov-p2-q1-meiosis.js
 *   node scripts/add-life-science-2025-nov-p2-q1-meiosis.js --dry-run
 *   node scripts/add-life-science-2025-nov-p2-q1-meiosis.js
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
  name: 'Question 1 (Meiosis)',
  syllabus: 'dbe',
  subject: 'life_science',
  year: 2025,
  paper: 'nov_p2',
  order: 2,
  content_tier: 'free',
  has_video: false,
  xp: 60,
  tags: ['meiosis', 'genetic_variation'],
  question_image_urls: ["https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2025/nov_p2/q2/question_1.png","https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2025/nov_p2/q2/question_2.png"],
  memo_image_urls: ["https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2025/nov_p2/q2/memo_1.png"],
  exam_question_marks: 8,
};

const questions = [
  {
    name: 'Question 1',
    question: 'Why must gametes be produced by meiosis rather than by mitosis?',
    metadata: [
      'So that gametes are genetically identical to the parent cell',
      'So that fertilisation restores the diploid chromosome number in the offspring',
      'So that gametes contain the same number of chromosomes as normal body cells',
      'So that gametes can divide further after fertilisation',
      '',
    ],
    answer: ['So that fertilisation restores the diploid chromosome number in the offspring', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'definition',
    unit: 'molecular_cellular_tissue_level',
    topic: 'meiosis',
    subtopic: 'meiosis_purpose',
    skills: ['explain_purpose_of_meiosis'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'life_science',
    year: 2025,
    paper: 'nov_p2',
    clues:
      '- Meiosis halves the chromosome number, producing haploid gametes.\n- Two haploid gametes combine at fertilisation to restore the full diploid number.',
  },
  {
    name: 'Question 2',
    question: 'Which of the following occur during meiosis and increase genetic variation among the resulting gametes?',
    metadata: [
      'Crossing over between homologous chromosomes in prophase I',
      'Random (independent) assortment of homologous chromosome pairs in metaphase I',
      'Exact copying of DNA during replication before meiosis begins',
      'Cytokinesis splitting the cytoplasm evenly between daughter cells',
      'Condensation of chromatin into visible chromosomes',
    ],
    answer: [
      'Crossing over between homologous chromosomes in prophase I',
      'Random (independent) assortment of homologous chromosome pairs in metaphase I',
      '',
      '',
      '',
    ],
    presentation: 'multi_select',
    type: 'definition',
    unit: 'molecular_cellular_tissue_level',
    topic: 'meiosis',
    subtopic: 'genetic_variation_sources',
    skills: ['identify_sources_of_variation'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'life_science',
    year: 2025,
    paper: 'nov_p2',
    clues:
      "- DNA replication and condensation happen exactly the same way in mitosis, so they can't be sources of NEW variation.\n- Variation comes from how homologous chromosomes exchange material and separate, not from copying itself.",
  },
  {
    name: 'Question 3',
    question:
      'A parent is heterozygous for two unlinked genes (RrYy). Which law explains why the alleles of the R/r gene separate independently of the alleles of the Y/y gene during gamete formation?',
    metadata: ['The law of segregation', 'The law of independent assortment', 'The law of dominance', 'The law of complementary base pairing', ''],
    answer: ['The law of independent assortment', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'definition',
    unit: 'molecular_cellular_tissue_level',
    topic: 'meiosis',
    subtopic: 'independent_assortment_vs_segregation',
    skills: ['distinguish_assortment_from_segregation'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'life_science',
    year: 2025,
    paper: 'nov_p2',
    clues:
      '- The law of segregation is about the TWO alleles of ONE gene separating.\n- Think about what happens between genes on DIFFERENT chromosome pairs, not within a single gene.',
  },
  {
    name: 'Question 4',
    question:
      'A plant heterozygous for two independently assorting genes (RrYy) is used to produce gametes. How many genetically different gamete genotypes can this plant produce?',
    metadata: ['= ', '[ ]'],
    answer: ['4', '', '', '', ''],
    presentation: 'fitb',
    type: 'application',
    unit: 'molecular_cellular_tissue_level',
    topic: 'meiosis',
    subtopic: 'dihybrid_gamete_combinations',
    skills: ['calculate_gamete_combinations'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'life_science',
    year: 2025,
    paper: 'nov_p2',
    clues:
      "- Independent assortment means each gene's two alleles can combine freely with either allele of the other gene.\n- List the combinations systematically: RY, Ry, rY, ry.",
  },
  {
    name: 'Question 5',
    question:
      'Nondisjunction occurs during meiosis I in a human egg cell, so that one resulting gamete receives two copies of chromosome 21 instead of one. If this gamete is fertilised by a normal sperm cell, what will the chromosome number of chromosome 21 be in the resulting zygote?',
    metadata: ['One copy (monosomy)', 'Two copies (the normal number)', 'Three copies (trisomy)', 'Four copies', ''],
    answer: ['Three copies (trisomy)', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'molecular_cellular_tissue_level',
    topic: 'meiosis',
    subtopic: 'nondisjunction_consequences',
    skills: ['predict_zygote_chromosome_number'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 5,
    syllabus: 'dbe',
    subject: 'life_science',
    year: 2025,
    paper: 'nov_p2',
    clues:
      '- The egg gamete already has 2 copies of chromosome 21 instead of 1.\n- A normal sperm gamete always contributes exactly 1 copy.',
  },
  {
    name: 'Question 6',
    question: 'Which of the following are TRUE differences between mitosis and meiosis?',
    metadata: [
      'Meiosis produces four genetically different haploid cells; mitosis produces two genetically identical diploid cells',
      'Meiosis involves two rounds of division; mitosis involves only one',
      'Crossing over occurs in meiosis but not in mitosis',
      'Mitosis occurs only in gametes; meiosis occurs only in body cells',
      'DNA replication occurs before mitosis but never before meiosis',
    ],
    answer: [
      'Meiosis produces four genetically different haploid cells; mitosis produces two genetically identical diploid cells',
      'Meiosis involves two rounds of division; mitosis involves only one',
      'Crossing over occurs in meiosis but not in mitosis',
      '',
      '',
    ],
    presentation: 'multi_select',
    type: 'definition',
    unit: 'molecular_cellular_tissue_level',
    topic: 'meiosis',
    subtopic: 'mitosis_meiosis_comparison',
    skills: ['compare_mitosis_meiosis'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 6,
    syllabus: 'dbe',
    subject: 'life_science',
    year: 2025,
    paper: 'nov_p2',
    clues:
      '- Meiosis I and meiosis II are two separate divisions; mitosis is one.\n- DNA replication happens once before EITHER type of division begins.',
  },
];

const aiExplanation = {
  sub_questions: [
    {
      number: '1.1.8',
      marks: 2,
      clues: '- Plant 1 shows the dominant stem colour but the recessive height trait; Plant 2 shows the opposite pattern.\n- The cross produced some red, short offspring — use that to decide which parent is heterozygous for which gene.',
      approach: '- Assign a genotype for each gene based on which phenotype (dominant or recessive) each plant displays.\n- Remember a recessive phenotype must be homozygous recessive, while a dominant phenotype could be either homozygous or heterozygous.\n- Use the offspring evidence (red AND short appeared) to resolve the heterozygous cases.',
      solution: '1. Plant 1 is brown (dominant) and short (recessive), so its height genotype must be tt.\n2. Plant 2 is red (recessive) and tall (dominant), so its stem-colour genotype must be bb.\n3. Since some offspring were red and short (bbtt), each parent must also carry the recessive allele for the trait it shows dominantly.\n4. This gives Plant 1 = Bbtt and Plant 2 = bbTt, matching option B.',
    },
    {
      number: '1.1.9',
      marks: 2,
      clues: '- List the different gametes each parent can produce for stem colour and for height separately.\n- Combine them to find how many distinct genotype combinations are possible.',
      approach: '- Determine the possible gametes each parent produces for each gene.\n- Combine the two parents\' gametes to list every possible offspring genotype.\n- Count only the genotypes that are genetically different from one another.',
      solution: '1. Plant 1 (Bbtt) produces gametes Bt or bt; Plant 2 (bbTt) produces gametes bT or bt.\n2. Combining these gives four genotype combinations: BbTt, Bbtt, bbTt, bbtt.\n3. All four are different from each other.\n4. This matches option A (4).',
    },
    {
      number: '1.3.1',
      marks: 2,
      clues: '- Non-disjunction means chromosomes or chromatids fail to separate correctly.\n- Consider whether this failure could happen at more than one stage of meiosis.',
      approach: '- Recall what separates during anaphase I (homologous chromosomes) versus anaphase II (sister chromatids).\n- Consider whether a separation failure could happen at either of these stages.\n- Decide whether the answer is A only, B only, both, or neither.',
      solution: '1. Non-disjunction can occur during anaphase I, when homologous chromosomes fail to separate.\n2. It can also occur during anaphase II, when sister chromatids fail to separate.\n3. Both are correct — the answer is "Both A and B".',
    },
    {
      number: '1.3.3',
      marks: 2,
      clues: "- This statement is about ONE gene's two alleles, not about how different genes relate to each other.\n- A separate law describes genes on different chromosomes assorting independently.",
      approach: '- Identify whether the statement describes one gene\'s alleles separating, or the relationship between different genes.\n- Match this to the correct named law.\n- Decide whether it fits option A, option B, both, or neither.',
      solution: "1. The statement describes the two alleles of a single gene separating into different gametes.\n2. This is the law of segregation (option B), not the law of independent assortment (which concerns different genes).\n3. The answer is \"B only\".",
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
