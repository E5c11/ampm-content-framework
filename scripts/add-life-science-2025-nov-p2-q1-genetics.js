#!/usr/bin/env node
/**
 * DBE Life Sciences P2 — November 2025 — Question 1 (Genetics and Inheritance) (order 3)
 *
 * Bundles real sub-items 1.1.4, 1.1.5, 1.1.10 (from the Q1.1 MCQ block), 1.2.3, 1.2.4,
 * 1.2.8, 1.2.9 (from the Q1.2 biological-term block), and 1.3.2 (from the Q1.3
 * classification block) — the genetics/inheritance knowledge-area cluster per
 * subjects/dbe-life-sciences.md's paper-structure table. 12 real marks. Independent
 * lesson (DESIGN-UNI-13) — unrelated identification/reasoning items, no chained
 * sub-question sequence.
 *
 * DESIGN-LIFE-01 in full effect here: the real exam's own 1.1.5/1.1.8 genotype items
 * are MCQ, not typed, for exactly the superscript-allele reason this profile documents
 * — Question 3 below (heterozygous-genotype identification) follows the same pattern via
 * multi_select rather than a typed genotype answer. Term-recall content (locus, allele,
 * genotype, phenotype) goes to `match`, never `fitb`. No natural bare-numeric content in
 * this lesson, so no fitb here — consistent with "only when it comes up naturally."
 *
 * Curriculum nodes NOT yet created in Postgres — see add-life-science-2025-nov-p2-q1-
 * dna.js's header note; same status here. question_image_urls/memo_image_urls left
 * empty for the same reason (image extraction not yet run).
 *
 *   node tools/validate-questions.js --script scripts/add-life-science-2025-nov-p2-q1-genetics.js
 *   node scripts/add-life-science-2025-nov-p2-q1-genetics.js --dry-run
 *   node scripts/add-life-science-2025-nov-p2-q1-genetics.js
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
  name: 'Question 1 (Genetics and Inheritance)',
  syllabus: 'dbe',
  subject: 'life_science',
  year: 2025,
  paper: 'nov_p2',
  order: 3,
  content_tier: 'free',
  has_video: false,
  xp: 70,
  tags: ['genetics_and_inheritance', 'sex_linked_inheritance'],
  question_image_urls: ["https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2025/nov_p2/q3/question_1.png","https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2025/nov_p2/q3/question_2.png","https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2025/nov_p2/q3/question_3.png"],
  memo_image_urls: ["https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2025/nov_p2/q3/memo_1.png"],
  exam_question_marks: 12,
};

const questions = [
  {
    name: 'Question 1',
    question:
      'A colour-blind man (colour blindness is a recessive, X-linked condition) has children with a woman who is homozygous for normal vision. What is the CORRECT prediction for their children?',
    metadata: [
      'All of their sons will be colour-blind',
      'All of their daughters will be carriers, but none will be colour-blind themselves',
      'All of their children will be colour-blind',
      'None of their children will carry the allele for colour blindness',
      '',
    ],
    answer: ['All of their daughters will be carriers, but none will be colour-blind themselves', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'molecular_cellular_tissue_level',
    topic: 'genetics_and_inheritance',
    subtopic: 'x_linked_recessive_inheritance',
    skills: ['predict_x_linked_recessive_offspring'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'life_science',
    year: 2025,
    paper: 'nov_p2',
    clues:
      "- A father's only X-chromosome (carrying the recessive allele) always passes to EVERY daughter, never to a son.\n- Each daughter therefore gets one recessive allele from him and one normal allele from their homozygous mother.",
  },
  {
    name: 'Question 2',
    question:
      'A certain disorder is caused by a dominant allele carried on the X-chromosome. A man affected by this disorder has children with a woman who is unaffected and carries no copy of the allele. Which statement is TRUE about their children?',
    metadata: [
      'None of their children will be affected, since the mother carries no allele',
      'All of their daughters will be affected, because they each receive his only X-chromosome',
      'All of their sons will be affected, because they each receive his only X-chromosome',
      'Only half of their daughters will be affected',
      '',
    ],
    answer: ['All of their daughters will be affected, because they each receive his only X-chromosome', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'molecular_cellular_tissue_level',
    topic: 'genetics_and_inheritance',
    subtopic: 'x_linked_dominant_inheritance',
    skills: ['predict_x_linked_dominant_offspring', 'distinguish_dominant_recessive_x_linked'],
    difficulty: 4,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'life_science',
    year: 2025,
    paper: 'nov_p2',
    clues:
      '- A son gets his Y-chromosome from his father, not an X — so he cannot inherit an X-linked allele from his father at all.\n- A daughter always gets her father\'s only X-chromosome, so she inherits whatever allele it carries.',
  },
  {
    name: 'Question 3',
    question: 'Which of the following genotypes are HETEROZYGOUS?',
    metadata: ['Bb', 'TT', 'Rr', 'gg', 'Ww'],
    answer: ['Bb', 'Rr', 'Ww', '', ''],
    presentation: 'multi_select',
    type: 'definition',
    unit: 'molecular_cellular_tissue_level',
    topic: 'genetics_and_inheritance',
    subtopic: 'genotype_classification',
    skills: ['classify_genotype_as_hetero_homozygous'],
    difficulty: 1,
    exam_weight: 1,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'life_science',
    year: 2025,
    paper: 'nov_p2',
    clues:
      '- A heterozygous genotype has two DIFFERENT alleles for a gene.\n- A homozygous genotype has two of the SAME allele, either both dominant or both recessive.',
  },
  {
    name: 'Question 4',
    question:
      "A change occurs in a gene's DNA sequence during replication, which alters the sequence of amino acids in the resulting protein. What determines whether this change is harmful to the organism?",
    metadata: [
      'Whether the mutation occurs in a body cell or a gamete',
      "Whether the resulting protein's structure and function are affected",
      'Whether the mutation is inherited from the mother or the father',
      'Whether the DNA molecule is longer or shorter afterwards',
      '',
    ],
    answer: ["Whether the resulting protein's structure and function are affected", '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'definition',
    unit: 'molecular_cellular_tissue_level',
    topic: 'genetics_and_inheritance',
    subtopic: 'mutation_effects',
    skills: ['explain_mutation_harm_criteria'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'life_science',
    year: 2025,
    paper: 'nov_p2',
    clues:
      '- A mutation is only harmful if it actually changes how the protein folds or works.\n- Many mutations are silent or neutral because the protein\'s function is unaffected.',
  },
  {
    name: 'Question 5',
    question:
      'In a certain flower species, allele R (red pigment) and allele W (white, no pigment) are CODOMINANT. What phenotype would a heterozygous (RW) plant have?',
    metadata: [
      'A pink flower, showing a blend of red and white',
      'Petals showing distinct patches of both red and white pigment',
      'A red flower only',
      'A white flower only',
      '',
    ],
    answer: ['Petals showing distinct patches of both red and white pigment', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'molecular_cellular_tissue_level',
    topic: 'genetics_and_inheritance',
    subtopic: 'codominance_vs_incomplete_dominance',
    skills: ['distinguish_codominance_incomplete_dominance'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 5,
    syllabus: 'dbe',
    subject: 'life_science',
    year: 2025,
    paper: 'nov_p2',
    clues:
      '- Codominance means BOTH alleles are fully and separately expressed, not blended.\n- A blended pink phenotype instead would be an example of incomplete dominance, not codominance.',
  },
  {
    name: 'Question 6',
    question: 'Match each genetics term to its correct definition.',
    metadata: [
      'A - Locus',
      'B - Allele',
      'C - Genotype',
      'D - Phenotype',
      '1 - The position of a gene on a chromosome',
      '2 - An alternative form of a gene',
      "3 - The genetic make-up of an organism for a particular gene",
      "4 - The observable characteristic resulting from an organism's genotype",
    ],
    answer: ['A-1', 'B-2', 'C-3', 'D-4'],
    presentation: 'match',
    type: 'definition',
    unit: 'molecular_cellular_tissue_level',
    topic: 'genetics_and_inheritance',
    subtopic: 'genetics_terminology',
    skills: ['define_core_genetics_terms'],
    difficulty: 1,
    exam_weight: 2,
    xp: 10,
    order: 6,
    syllabus: 'dbe',
    subject: 'life_science',
    year: 2025,
    paper: 'nov_p2',
    clues:
      '- Locus and allele both describe something about a gene\'s position or form, not the whole organism.\n- Genotype is the underlying genetic cause; phenotype is the visible effect.',
  },
  {
    name: 'Question 7',
    question: 'A doctor wants to determine whether an unborn baby has an extra copy of a chromosome. Which of the following diagrams would correctly show this?',
    metadata: ['A phylogenetic tree', 'A karyotype', 'A pedigree diagram', 'A Punnett square', ''],
    answer: ['A karyotype', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'definition',
    unit: 'molecular_cellular_tissue_level',
    topic: 'genetics_and_inheritance',
    subtopic: 'karyotype_vs_phylogenetic_tree',
    skills: ['distinguish_karyotype_from_phylogenetic_tree'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 7,
    syllabus: 'dbe',
    subject: 'life_science',
    year: 2025,
    paper: 'nov_p2',
    clues:
      "- Look for the diagram type that displays the number, shape and arrangement of one individual's own chromosomes.\n- A phylogenetic tree instead shows evolutionary relationships between different species, not one individual's chromosome count.",
  },
];

const aiExplanation = {
  sub_questions: [
    {
      number: '1.1.4',
      marks: 2,
      clues: "- Consider which type of chromosome this condition's causative allele is located on.\n- This condition affects blood clotting, not colour vision.",
      approach: '- Recall what haemophilia affects physiologically.\n- Recall which chromosome type carries the mutated allele responsible.\n- Eliminate options describing colour blindness, non-disjunction, or autosomal inheritance.',
      solution: '1. Haemophilia is caused by a mutated allele carried on the X-chromosome.\n2. It is unrelated to colour vision, which is a different X-linked condition.\n3. This matches option B.',
    },
    {
      number: '1.1.5',
      marks: 2,
      clues: '- A heterozygous genotype has two DIFFERENT alleles for a gene.\n- Check each option letter by letter for matching versus differing symbols.',
      approach: '- Examine each genotype option letter by letter.\n- Identify the one option with two different alleles rather than two identical ones.\n- Confirm the remaining options are homozygous.',
      solution: '1. XrXr, BB, and aa each have two identical alleles — these are homozygous.\n2. RW has two different alleles (R and W).\n3. This matches option C.',
    },
    {
      number: '1.1.10',
      marks: 2,
      clues: "- A son receives his X-chromosome only from his mother, never from his father.\n- A daughter always receives her father's only X-chromosome.",
      approach: "- Recall which parent contributes the X-chromosome to sons versus daughters.\n- Apply this to an affected father carrying a dominant allele on his X-chromosome.\n- Determine which of his children must inherit and express the allele.",
      solution: "1. A father passes his X-chromosome to every daughter, but never to a son (sons receive his Y-chromosome instead).\n2. Since the allele is dominant and X-linked, an affected father guarantees every daughter inherits and expresses it.\n3. This matches option C.",
    },
    {
      number: '1.2.3',
      marks: 1,
      clues: '- These cells have not yet specialised into a specific tissue type.\n- They are the basis of certain regenerative medical therapies.',
      approach: '- Consider what it means for a cell to be undifferentiated, with the potential to become any tissue type.\n- Recall the specific term for such cells.',
      solution: '1. Cells that have not yet differentiated, and retain the potential to become any tissue type, are called stem cells.',
    },
    {
      number: '1.2.4',
      marks: 1,
      clues: '- This is a change at the level of the DNA sequence itself.\n- It can occur spontaneously or be caused by an external factor.',
      approach: '- Recall the term for a change in the base sequence of DNA.\n- Confirm this is what can lead to an altered protein being produced.',
      solution: '1. A change in the sequence of nitrogenous bases in DNA is called a mutation.\n2. This altered sequence can result in a different amino acid sequence, producing a different protein.',
    },
    {
      number: '1.2.8',
      marks: 1,
      clues: "- This allele's effect is visible even when only one copy is present.\n- It is not masked by the other allele in a heterozygous individual.",
      approach: "- Recall what happens to a recessive allele's expression in a heterozygous individual, compared to a dominant allele's.\n- Identify the allele type that is always expressed when present.",
      solution: '1. An allele that is always expressed when present, even alongside a different allele, is a dominant allele.',
    },
    {
      number: '1.2.9',
      marks: 1,
      clues: "- This term refers to a specific physical location, not to the allele's characteristics.\n- Every gene has a fixed position of this kind on its chromosome.",
      approach: "- Distinguish between a gene/allele's physical position and its expression pattern.\n- Recall the specific term for a gene's fixed position on a chromosome.",
      solution: '1. The specific position of a gene (or its allele) on a chromosome is called its locus.',
    },
    {
      number: '1.3.2',
      marks: 2,
      clues: "- This diagram is specific to one individual's own chromosomes.\n- It is not used to show relationships between different species.",
      approach: '- Recall what a phylogenetic tree is typically used to show, compared to what displays an individual\'s own chromosome set.\n- Match the description to the correct one of the two options.',
      solution: '1. A description of the number, shape, and arrangement of chromosomes in the nucleus refers to a karyotype (option B), not a phylogenetic tree.\n2. The answer is "B only".',
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
