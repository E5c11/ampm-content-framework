#!/usr/bin/env node
/**
 * DBE Life Sciences P2 — November 2025 — Question 1 (DNA: Code of Life) (order 1)
 *
 * Bundles real sub-items 1.1.1, 1.1.2, 1.1.6, 1.1.7 (from the Q1.1 MCQ block) and
 * 1.2.1, 1.2.2, 1.2.5 (from the Q1.2 biological-term block) — the DNA-structure/
 * -replication knowledge-area cluster per subjects/dbe-life-sciences.md's paper-structure
 * table (DESIGN-UNI-10 rule 2: cluster an independent-item block by the exam's own
 * thematic ordering, since Q1.1-1.3's items interleave topics rather than block by them).
 * 11 real marks. Independent lesson (DESIGN-UNI-13) — these are unrelated identification
 * items against no shared figure, not a chained sub-question sequence.
 *
 * DESIGN-LIFE-01: no typed genotype/term answers — this lesson has no natural bare-numeric
 * content, so no `fitb` used here (that's fine, not every lesson needs one).
 *
 * Curriculum nodes NOT yet created in Postgres (life_science has none yet) — the FK
 * preflight below will fail until `tools/create-curriculum-node.js`/`create-skill.js`
 * are run for unit/topic/subtopic/skills listed per question (PIPE-08). Not run this
 * session — script written and structurally validated only.
 *
 * question_image_urls/memo_image_urls left empty — exam-page image extraction
 * (`extract-exam-pages.py` + `upload-exam-images.js`) not yet run for this paper.
 *
 *   node tools/validate-questions.js --script scripts/add-life-science-2025-nov-p2-q1-dna.js
 *   node scripts/add-life-science-2025-nov-p2-q1-dna.js --dry-run
 *   node scripts/add-life-science-2025-nov-p2-q1-dna.js
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
  name: 'Question 1 (DNA: Code of Life)',
  syllabus: 'dbe',
  subject: 'life_science',
  year: 2025,
  paper: 'nov_p2',
  order: 1,
  content_tier: 'free',
  has_video: false,
  xp: 70,
  tags: ['dna_code_of_life', 'molecular_biology'],
  question_image_urls: ["https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2025/nov_p2/q1/question_1.png","https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2025/nov_p2/q1/question_2.png","https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2025/nov_p2/q1/question_3.png"],
  memo_image_urls: ["https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2025/nov_p2/q1/memo_1.png"],
  exam_question_marks: 11,
};

const questions = [
  {
    name: 'Question 1',
    question: 'Which statement correctly describes how a gene relates to a chromosome?',
    metadata: [
      'A chromosome is a single gene found inside the nucleus',
      'A gene is a segment of DNA on a chromosome that codes for a characteristic',
      'A gene and a chromosome are the same structure, just described differently',
      'A chromosome is made up of many complete genomes',
      '',
    ],
    answer: ['A gene is a segment of DNA on a chromosome that codes for a characteristic', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'definition',
    unit: 'molecular_cellular_tissue_level',
    topic: 'dna_code_of_life',
    subtopic: 'gene_chromosome_hierarchy',
    skills: ['distinguish_gene_from_chromosome'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'life_science',
    year: 2025,
    paper: 'nov_p2',
    clues:
      '- A chromosome is a long DNA molecule containing many genes along its length.\n- A gene is only one functional segment of that longer molecule.',
  },
  {
    name: 'Question 2',
    question: 'Which of the following statements about complementary base pairing in DNA are TRUE?',
    metadata: [
      'Adenine pairs with thymine',
      'Guanine pairs with cytosine',
      'Adenine pairs with guanine',
      'A purine always pairs with a pyrimidine',
      'Thymine pairs with cytosine',
    ],
    answer: ['Adenine pairs with thymine', 'Guanine pairs with cytosine', 'A purine always pairs with a pyrimidine', '', ''],
    presentation: 'multi_select',
    type: 'definition',
    unit: 'molecular_cellular_tissue_level',
    topic: 'dna_code_of_life',
    subtopic: 'complementary_base_pairing',
    skills: ['apply_base_pairing_rule'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'life_science',
    year: 2025,
    paper: 'nov_p2',
    clues:
      '- A and G are purines (double-ring); T and C are pyrimidines (single-ring).\n- Each base pair always combines one purine with one pyrimidine.',
  },
  {
    name: 'Question 3',
    question:
      'One strand of a DNA molecule has the base sequence G-C-T-A. What is the base sequence on the complementary strand, read in the same direction?',
    metadata: ['G-C-T-A', 'T-A-C-G', 'C-G-A-T', 'A-T-G-C', ''],
    answer: ['C-G-A-T', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'molecular_cellular_tissue_level',
    topic: 'dna_code_of_life',
    subtopic: 'complementary_base_pairing',
    skills: ['apply_base_pairing_rule', 'derive_complementary_sequence'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'life_science',
    year: 2025,
    paper: 'nov_p2',
    clues:
      '- Pair each base in turn: G↔C, C↔G, T↔A, A↔T.\n- The complementary strand is read in the same direction as given, base-by-base.',
  },
  {
    name: 'Question 4',
    question: "Why must a cell's DNA be replicated before it undergoes mitosis?",
    metadata: [
      'So that the daughter cells have half the original number of chromosomes',
      'So that each of the two daughter cells receives a complete, identical set of chromosomes',
      'So that mutations can be introduced into the daughter cells',
      'So that the cell can produce gametes',
      '',
    ],
    answer: ['So that each of the two daughter cells receives a complete, identical set of chromosomes', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'definition',
    unit: 'molecular_cellular_tissue_level',
    topic: 'dna_code_of_life',
    subtopic: 'dna_replication_significance',
    skills: ['explain_replication_before_mitosis'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'life_science',
    year: 2025,
    paper: 'nov_p2',
    clues:
      '- Mitosis produces two genetically identical daughter cells.\n- Each daughter cell needs its own full copy of every chromosome.',
  },
  {
    name: 'Question 5',
    question:
      'A researcher labels the DNA of a bacterium with a heavy nitrogen isotope, then allows the bacterium to replicate once in a medium containing only normal (light) nitrogen. Each resulting DNA molecule contains one heavy strand and one light strand. What does this demonstrate about DNA replication?',
    metadata: [
      'Replication is dispersive — the original and new DNA are mixed evenly throughout both strands',
      'Replication is semi-conservative — each new molecule keeps one original strand and gains one new strand',
      'Replication is conservative — the original molecule stays fully intact and an entirely new copy is made',
      'Replication does not require any original DNA as a template',
      '',
    ],
    answer: ['Replication is semi-conservative — each new molecule keeps one original strand and gains one new strand', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'molecular_cellular_tissue_level',
    topic: 'dna_code_of_life',
    subtopic: 'dna_replication_semiconservative',
    skills: ['interpret_replication_evidence'],
    difficulty: 4,
    exam_weight: 2,
    xp: 10,
    order: 5,
    syllabus: 'dbe',
    subject: 'life_science',
    year: 2025,
    paper: 'nov_p2',
    clues:
      '- Each new double helix is made of one original (template) strand paired with one newly-built strand.\n- This is why every resulting molecule ends up as a hybrid of old and new material, not fully old or fully new.',
  },
  {
    name: 'Question 6',
    question: "Why can mitochondrial DNA be used to trace a person's maternal ancestry but not their paternal ancestry?",
    metadata: [
      'Mitochondrial DNA mutates only in males',
      'Mitochondria (and their DNA) are inherited only from the ovum, not the sperm',
      'Sperm cells do not contain any DNA at all',
      'Mitochondrial DNA is identical between a mother and father',
      '',
    ],
    answer: ['Mitochondria (and their DNA) are inherited only from the ovum, not the sperm', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'definition',
    unit: 'molecular_cellular_tissue_level',
    topic: 'dna_code_of_life',
    subtopic: 'mitochondrial_dna_maternal_lineage',
    skills: ['explain_mitochondrial_inheritance'],
    difficulty: 2,
    exam_weight: 1,
    xp: 10,
    order: 6,
    syllabus: 'dbe',
    subject: 'life_science',
    year: 2025,
    paper: 'nov_p2',
    clues:
      '- Almost all of the mitochondria in a fertilised zygote come from the egg cell’s cytoplasm.\n- A sperm cell’s own mitochondria are typically destroyed after fertilisation.',
  },
  {
    name: 'Question 7',
    question: 'Match each DNA component to its correct description.',
    metadata: [
      'A - Nucleotide',
      'B - Nitrogenous base',
      'C - Deoxyribose',
      'D - Phosphate group',
      '1 - The basic repeating unit of a DNA strand, made of a sugar, phosphate and base',
      '2 - Carries the genetic code as one of four possible molecules (A, T, G or C)',
      '3 - The 5-carbon sugar component of a nucleotide',
      '4 - Links adjacent sugars together to form the DNA backbone',
    ],
    answer: ['A-1', 'B-2', 'C-3', 'D-4'],
    presentation: 'match',
    type: 'definition',
    unit: 'molecular_cellular_tissue_level',
    topic: 'dna_code_of_life',
    subtopic: 'dna_component_structure',
    skills: ['identify_dna_components'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 7,
    syllabus: 'dbe',
    subject: 'life_science',
    year: 2025,
    paper: 'nov_p2',
    clues:
      '- Work from the whole (nucleotide) down to its three parts (base, sugar, phosphate).\n- The backbone is formed by the sugar-phosphate links, not by the bases.',
    supplementary_material: {
      type: 'diagram',
      label: 'Nucleotide Structure',
      image_urls: ['https://media-dev.askmoreprepmore.app/question_supplementary/life_science/2025/nov_p2/q1/diagram_1.png'],
    },
  },
];

const aiExplanation = {
  sub_questions: [
    {
      number: '1.1.1',
      marks: 2,
      clues: "- Think about whether this describes the entire chromosome, or just part of it.\n- Consider what determines one single characteristic, versus the organism's whole genetic makeup.",
      approach: '- Read each option and check whether it describes a whole chromosome/genome or a smaller unit.\n- Eliminate options describing haploid number or codon triplets specifically.\n- Match the remaining option to the standard definition of a gene.',
      solution: '1. A gene is a segment of DNA located on a chromosome.\n2. It codes for a specific characteristic, via the protein it produces.\n3. This matches option B.',
    },
    {
      number: '1.1.2',
      marks: 2,
      clues: '- Consider what mitosis is used for in the body.\n- Think about what DNA replication ensures happens before cell division.',
      approach: '- Recall that DNA replication occurs before mitosis so each daughter cell receives a full copy.\n- Consider whether mitosis changes the chromosome number or the genetic content of the cell.\n- Match this reasoning to the correct option.',
      solution: '1. DNA replication produces two identical copies of each chromosome before mitosis.\n2. Mitosis distributes one identical copy to each of the two daughter cells.\n3. The daughter cells are therefore genetically identical to each other and the parent cell.\n4. This matches option A.',
    },
    {
      number: '1.1.6',
      marks: 2,
      clues: '- Molecule 1 points to the whole repeating unit of the DNA strand, not just one part of it.\n- Molecules 4 and 5 point to the two non-base components of that same unit.',
      approach: '- Identify what each numbered label points to in the diagram (a whole unit vs. one of its sub-parts).\n- Recall that a nucleotide is built from three components: a sugar, a phosphate group, and a nitrogenous base.\n- Match each molecule number to the correct component name in the options table.',
      solution: '1. Molecule 1 is the complete repeating unit — a nucleotide.\n2. Molecule 4 is the sugar component — deoxyribose.\n3. Molecule 5 is the phosphate group.\n4. This matches option A.',
    },
    {
      number: '1.1.7',
      marks: 2,
      clues: '- Molecules 2 and 3 are newly-added bases on the strand being synthesised.\n- Match each new base to the template base directly opposite it, using the base-pairing rule.',
      approach: '- Identify the template base positioned opposite each of molecule 2 and molecule 3 in the diagram.\n- Apply complementary base pairing (A↔T, G↔C) to find the base that would be added at each position.\n- Match your two answers to the options table.',
      solution: '1. Reading the template bases opposite positions 2 and 3 and applying A↔T/G↔C pairing gives adenine at both positions.\n2. This matches option B (Molecule 2 = A, Molecule 3 = A).',
    },
    {
      number: '1.2.1',
      marks: 1,
      clues: '- This bond forms specifically between two amino acids, not between nucleotides.\n- It is created during translation, as the polypeptide chain grows.',
      approach: '- Recall what type of molecules are being joined during translation.\n- Recall the name of the chemical bond formed between two amino acids.',
      solution: '1. During translation, amino acids are joined together one at a time.\n2. The bond formed between adjacent amino acids is a peptide bond.',
    },
    {
      number: '1.2.2',
      marks: 1,
      clues: '- This organelle is inherited only through the maternal line.\n- It contains its own small, separate piece of DNA, distinct from nuclear DNA.',
      approach: "- Recall which organelle contains its own DNA, separate from the nucleus.\n- Recall why this organelle's DNA specifically reflects maternal ancestry.",
      solution: '1. Mitochondria contain their own DNA (mitochondrial DNA).\n2. Mitochondria are inherited only from the mother, via the egg cell.\n3. This DNA is therefore used to trace female ancestry — the organelle is the mitochondrion.',
    },
    {
      number: '1.2.5',
      marks: 1,
      clues: '- This is the three-dimensional shape formed by the two antiparallel DNA strands.\n- Watson and Crick are credited with discovering this structure.',
      approach: "- Picture the natural, three-dimensional shape formed by the two paired DNA strands.\n- Recall the specific term given to this twisted shape.",
      solution: "1. A DNA molecule's two strands wind around each other in a twisted, ladder-like shape.\n2. This natural shape is called a double helix.",
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
