#!/usr/bin/env node
/**
 * DBE Life Sciences P2 — November 2025 — Question 2.3 (Pedigree Analysis) (order 9)
 *
 * Real Q2.3 (9 marks) is built around a drawn 4-generation pedigree for a real named
 * disorder (CADASIL) — DESIGN-UNI-10 rule 1, one lesson. Fresh practice questions
 * describe a family's inheritance pattern in prose instead of a redrawn pedigree, same
 * text-description approach as the other diagram-flagged lessons this session. Uses a
 * placeholder disorder name ("Zorin syndrome") rather than a real condition, deliberately
 * — the genetics reasoning is what's being taught, and inventing a fictional label avoids
 * asserting anything about a real disorder's actual inheritance pattern or clinical
 * details.
 *
 * Topic reuses `genetics_and_inheritance` (same curriculum node as add-life-science-
 * 2025-nov-p2-q1-genetics.js). Independent lesson (DESIGN-UNI-13).
 *
 *   node tools/validate-questions.js --script scripts/add-life-science-2025-nov-p2-q2-3-pedigree.js
 *   node scripts/add-life-science-2025-nov-p2-q2-3-pedigree.js --dry-run
 *   node scripts/add-life-science-2025-nov-p2-q2-3-pedigree.js
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
  name: 'Question 2.3 (Pedigree Analysis)',
  syllabus: 'dbe',
  subject: 'life_science',
  year: 2025,
  paper: 'nov_p2',
  order: 9,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['pedigree_analysis', 'genetics_and_inheritance'],
  question_image_urls: ["https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2025/nov_p2/q9/question_1.png"],
  memo_image_urls: ["https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2025/nov_p2/q9/memo_1.png"],
  exam_question_marks: 9,
};

const questions = [
  {
    name: 'Question 1',
    question: 'A rare genetic disorder, Zorin syndrome, is caused by a dominant allele (Z) on an autosome. In a certain family, both parents — Individual 1 and Individual 2 — have Zorin syndrome. They have three children: Individual 3 (affected), Individual 4 (unaffected), and Individual 5 (affected). Which type of diagram would best represent the pattern of inheritance of Zorin syndrome across the generations of this family?',
    metadata: ['A karyotype', 'A phylogenetic tree', 'A pedigree diagram', 'A Punnett square', ''],
    answer: ['A pedigree diagram', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'definition',
    unit: 'molecular_cellular_tissue_level',
    topic: 'genetics_and_inheritance',
    subtopic: 'pedigree_diagram_identification',
    skills: ['identify_pedigree_diagram'],
    difficulty: 1,
    exam_weight: 1,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'life_science',
    year: 2025,
    paper: 'nov_p2',
    clues: '- This diagram shows affected and unaffected individuals across multiple generations of one specific family.\n- It is not used to compare different species, or to show an individual\'s chromosome count.',
    supplementary_material: {
      type: 'diagram',
      label: 'Pedigree Diagram',
      image_urls: ['https://media-dev.askmoreprepmore.app/question_supplementary/life_science/2025/nov_p2/q9/diagram_1.png'],
    },
  },
  {
    name: 'Question 2',
    question: 'A rare genetic disorder, Zorin syndrome, is caused by a dominant allele (Z) on an autosome. In a certain family, both parents — Individual 1 and Individual 2 — have Zorin syndrome. They have three children: Individual 3 (affected), Individual 4 (unaffected), and Individual 5 (affected). Individual 4 is unaffected by Zorin syndrome. What is their genotype for this gene?',
    metadata: ['ZZ', 'Zz', 'zz', 'Cannot be determined from this information', ''],
    answer: ['zz', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'molecular_cellular_tissue_level',
    topic: 'genetics_and_inheritance',
    subtopic: 'genotype_from_phenotype_dominant',
    skills: ['derive_genotype_from_dominant_phenotype'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'life_science',
    year: 2025,
    paper: 'nov_p2',
    clues: '- The allele that causes Zorin syndrome is dominant.\n- Someone unaffected cannot carry even one copy of a dominant disease allele.',
    supplementary_material: {
      type: 'diagram',
      label: 'Pedigree Diagram',
      image_urls: ['https://media-dev.askmoreprepmore.app/question_supplementary/life_science/2025/nov_p2/q9/diagram_1.png'],
    },
  },
  {
    name: 'Question 3',
    question:
      'A rare genetic disorder, Zorin syndrome, is caused by a dominant allele (Z) on an autosome. In a certain family, both parents — Individual 1 and Individual 2 — have Zorin syndrome. They have three children: Individual 3 (affected), Individual 4 (unaffected), and Individual 5 (affected). Given that Individual 4 does not have Zorin syndrome, what does this tell us about the genotypes of Individual 1 and Individual 2?',
    metadata: [
      'Both parents must be heterozygous (Zz), since each contributed a recessive allele to their unaffected child',
      'Both parents must be homozygous dominant (ZZ)',
      'Only one parent needs to carry a recessive allele',
      'This is impossible if the allele is truly dominant',
      '',
    ],
    answer: ['Both parents must be heterozygous (Zz), since each contributed a recessive allele to their unaffected child', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'molecular_cellular_tissue_level',
    topic: 'genetics_and_inheritance',
    subtopic: 'heterozygosity_evidence_from_offspring',
    skills: ['infer_heterozygosity_from_offspring'],
    difficulty: 4,
    exam_weight: 2,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'life_science',
    year: 2025,
    paper: 'nov_p2',
    clues: '- An unaffected child must have received one recessive allele from EACH parent.\n- A parent who is homozygous dominant has no recessive allele to give.',
    supplementary_material: {
      type: 'diagram',
      label: 'Pedigree Diagram',
      image_urls: ['https://media-dev.askmoreprepmore.app/question_supplementary/life_science/2025/nov_p2/q9/diagram_1.png'],
    },
  },
  {
    name: 'Question 4',
    question: 'A rare genetic disorder, Zorin syndrome, is caused by a dominant allele (Z) on an autosome. In a certain family, both parents — Individual 1 and Individual 2 — have Zorin syndrome. They have three children: Individual 3 (affected), Individual 4 (unaffected), and Individual 5 (affected). If Individual 1 and Individual 2 (both heterozygous, Zz) have another child, what is the percentage chance that this child will have Zorin syndrome?',
    metadata: ['= ', '[ ]', '%'],
    answer: ['75', '', '', '', ''],
    presentation: 'fitb',
    type: 'application',
    unit: 'molecular_cellular_tissue_level',
    topic: 'genetics_and_inheritance',
    subtopic: 'dominant_allele_cross_probability',
    skills: ['calculate_dominant_cross_probability'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'life_science',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Cross Zz × Zz and list all four possible offspring genotype combinations.\n- Only one of the four combinations is fully unaffected.',
    supplementary_material: {
      type: 'diagram',
      label: 'Pedigree Diagram',
      image_urls: ['https://media-dev.askmoreprepmore.app/question_supplementary/life_science/2025/nov_p2/q9/diagram_1.png'],
    },
  },
  {
    name: 'Question 5',
    question: 'A rare genetic disorder, Zorin syndrome, is caused by a dominant allele (Z) on an autosome. In a certain family, both parents — Individual 1 and Individual 2 — have Zorin syndrome. They have three children: Individual 3 (affected), Individual 4 (unaffected), and Individual 5 (affected). Which of the following individuals definitely carry at least one dominant Z allele?',
    metadata: ['Individual 1 (affected)', 'Individual 2 (affected)', 'Individual 3 (affected)', 'Individual 4 (unaffected)', 'Individual 6 (a separate unaffected relative)'],
    answer: ['Individual 1 (affected)', 'Individual 2 (affected)', 'Individual 3 (affected)', '', ''],
    presentation: 'multi_select',
    type: 'application',
    unit: 'molecular_cellular_tissue_level',
    topic: 'genetics_and_inheritance',
    subtopic: 'pedigree_genotype_carriers',
    skills: ['identify_dominant_allele_carriers'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 5,
    syllabus: 'dbe',
    subject: 'life_science',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Anyone showing the dominant phenotype must carry at least one dominant allele.\n- An unaffected individual cannot carry the dominant allele at all, given how the condition is inherited here.',
    supplementary_material: {
      type: 'diagram',
      label: 'Pedigree Diagram',
      image_urls: ['https://media-dev.askmoreprepmore.app/question_supplementary/life_science/2025/nov_p2/q9/diagram_1.png'],
    },
  },
];

const aiExplanation = {
  sub_questions: [
    {
      number: '2.3.1',
      marks: 1,
      clues: '- This diagram tracks a genetic trait across multiple generations of one specific family.\n- It uses shapes and shading conventions to show affected and unaffected individuals.',
      approach: '- Consider what the diagram shows — one specific family across multiple generations.\n- Recall the specific term for this type of family-inheritance diagram.',
      solution: '1. This diagram is called a pedigree diagram.',
    },
    {
      number: '2.3.2',
      marks: 1,
      clues: '- Count the individuals shown directly connected below parents 3 and 4 in the diagram.',
      approach: '- Trace the lines connecting parents 3 and 4 downward to their children.\n- Count how many children are shown.',
      solution: '1. Counting the individuals connected below parents 3 and 4 shows they have one offspring.\n2. The answer is 1.',
    },
    {
      number: '2.3.3(a)',
      marks: 1,
      clues: "- Check the shape and shading used for individual 10 against the key provided.\n- Consider both the sex symbol and whether it is shaded.",
      approach: "- Identify individual 10's symbol shape (circle or square) and shading (filled or unfilled).\n- Match this combination to the key.",
      solution: '1. Individual 10 is shown as a shaded circle.\n2. According to the key, this represents a female with CADASIL.',
    },
    {
      number: '2.3.3(b)',
      marks: 1,
      clues: '- Individual 5 is shown as unaffected in the diagram.\n- CADASIL is caused by a dominant allele — consider what genotype an unaffected individual must have.',
      approach: '- Recall that CADASIL is dominant, so an unaffected individual cannot carry even one copy of the disease allele.\n- Write the genotype using two recessive alleles.',
      solution: '1. Individual 5 does not have CADASIL.\n2. Since the disease allele is dominant, an unaffected individual must be homozygous recessive.\n3. The genotype is dd.',
    },
    {
      number: '2.3.4',
      marks: 4,
      clues: '- Both individual 1 and 2 have CADASIL themselves.\n- At least one of their children does NOT have CADASIL — consider what this tells you about each parent\'s alleles.',
      approach: '- Note that both parents show the dominant phenotype (they have CADASIL).\n- Identify a child of theirs who does NOT have CADASIL.\n- Explain what an unaffected child reveals about the alleles each affected parent must carry.',
      solution: '1. Both Individual 1 and Individual 2 have CADASIL, indicating they each carry at least one dominant allele.\n2. However, they have an unaffected child (genotype dd).\n3. For this unaffected child to exist, each parent must have contributed a recessive allele.\n4. This means both Individual 1 and Individual 2 must be heterozygous (Dd), not homozygous dominant.',
    },
    {
      number: '2.3.5',
      marks: 1,
      clues: '- Determine the genotypes of individuals 7 and 8 from the diagram first.\n- Cross these genotypes and calculate the proportion of affected offspring expected.',
      approach: '- Identify the genotypes of individuals 7 and 8 based on their phenotypes and their children\'s phenotypes.\n- Perform a genetic cross between these two genotypes.\n- Calculate the percentage of offspring expected to have CADASIL.',
      solution: '1. Individual 7 (affected) is heterozygous (Dd), and Individual 8 (unaffected) is homozygous recessive (dd), based on their children\'s mixed phenotypes.\n2. Crossing Dd × dd gives offspring in a 1:1 ratio of Dd (affected) to dd (unaffected).\n3. The percentage chance of another affected child is 50%.',
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
