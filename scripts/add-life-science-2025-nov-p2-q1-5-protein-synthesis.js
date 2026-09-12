#!/usr/bin/env node
/**
 * DBE Life Sciences P2 — November 2025 — Question 1.5 (Protein Synthesis) (order 6)
 *
 * Real Q1.5 (7 marks, 5 sub-items) bundles around one shared protein-synthesis diagram
 * (identify the stage, identify molecule 1/tRNA, identify organelle Z/ribosome, state
 * DNA base sequence for given codons, identify the amino acid for a codon) —
 * DESIGN-UNI-10 rule 1, one lesson.
 *
 * Text-described scenarios again, same rationale as add-life-science-2025-nov-p2-q1-4-
 * mitosis-meiosis.js — codon/DNA-template derivation is a classic text-only genetics
 * problem shape, no diagram needed. Skipped the "identify the amino acid for codon 5"
 * sub-item specifically because it needs the genetic-code lookup table (a formula-sheet-
 * level resource, not sourced/extracted this session) — everything else here is
 * self-contained from the base-pairing rule alone.
 *
 * Topic reuses `dna_code_of_life` (same curriculum node as add-life-science-2025-nov-p2-
 * q1-dna.js) — protein synthesis is part of that CAPS topic. Only new subtopics/skills/
 * tag needed here.
 *
 *   node tools/validate-questions.js --script scripts/add-life-science-2025-nov-p2-q1-5-protein-synthesis.js
 *   node scripts/add-life-science-2025-nov-p2-q1-5-protein-synthesis.js --dry-run
 *   node scripts/add-life-science-2025-nov-p2-q1-5-protein-synthesis.js
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
  name: 'Question 1.5 (Protein Synthesis)',
  syllabus: 'dbe',
  subject: 'life_science',
  year: 2025,
  paper: 'nov_p2',
  order: 6,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['protein_synthesis', 'dna_code_of_life'],
  question_image_urls: ["https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2025/nov_p2/q6/question_1.png"],
  memo_image_urls: ["https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2025/nov_p2/q6/memo_1.png"],
  exam_question_marks: 7,
};

const questions = [
  {
    name: 'Question 1',
    question: 'Arrange the following stages of protein synthesis in the correct order.',
    metadata: [
      'Translation occurs at the ribosome',
      'The polypeptide chain folds into its final shape',
      'Transcription produces an mRNA copy of the gene',
      'mRNA leaves the nucleus and travels to the ribosome',
    ],
    answer: [
      'Transcription produces an mRNA copy of the gene',
      'mRNA leaves the nucleus and travels to the ribosome',
      'Translation occurs at the ribosome',
      'The polypeptide chain folds into its final shape',
    ],
    presentation: 'ordering',
    type: 'definition',
    unit: 'molecular_cellular_tissue_level',
    topic: 'dna_code_of_life',
    subtopic: 'protein_synthesis_stage_sequence',
    skills: ['sequence_protein_synthesis_stages'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'life_science',
    year: 2025,
    paper: 'nov_p2',
    clues: '- The gene\'s information has to leave the nucleus before it can reach a ribosome.\n- Folding only makes sense once the full chain has actually been assembled.',
  },
  {
    name: 'Question 2',
    question: 'What is the specific job of a tRNA molecule during translation?',
    metadata: [
      'It carries the genetic code out of the nucleus to the ribosome',
      'It carries a specific amino acid to the ribosome and matches its anticodon to the mRNA codon',
      'It joins with other tRNA molecules to form the ribosome structure',
      "It stores the cell's genetic information permanently",
      '',
    ],
    answer: ['It carries a specific amino acid to the ribosome and matches its anticodon to the mRNA codon', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'definition',
    unit: 'molecular_cellular_tissue_level',
    topic: 'dna_code_of_life',
    subtopic: 'trna_function',
    skills: ['explain_trna_function'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'life_science',
    year: 2025,
    paper: 'nov_p2',
    clues: '- mRNA is the molecule that leaves the nucleus, not tRNA.\n- tRNA works at the ribosome, matching its own three-base anticodon to a codon.',
  },
  {
    name: 'Question 3',
    question: 'An mRNA codon reads G-C-U. What was the sequence of bases on the DNA template strand that this codon was transcribed from?',
    metadata: ['G-C-U', 'C-G-T', 'C-G-A', 'A-T-G', ''],
    answer: ['C-G-A', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'molecular_cellular_tissue_level',
    topic: 'dna_code_of_life',
    subtopic: 'dna_template_derivation',
    skills: ['derive_dna_template_from_mrna'],
    difficulty: 4,
    exam_weight: 2,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'life_science',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Work base-by-base: DNA pairs with mRNA the same way as with a second DNA strand, except mRNA uses U instead of T.\n- DNA A produces mRNA U; DNA T produces mRNA A; DNA G produces mRNA C; DNA C produces mRNA G.',
  },
  {
    name: 'Question 4',
    question: 'Which organelle is the site where amino acids are joined together to form a polypeptide chain during translation?',
    metadata: ['Ribosome', 'Nucleus', 'Golgi body', 'Mitochondrion', ''],
    answer: ['Ribosome', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'definition',
    unit: 'molecular_cellular_tissue_level',
    topic: 'dna_code_of_life',
    subtopic: 'ribosome_function',
    skills: ['identify_ribosome_function'],
    difficulty: 1,
    exam_weight: 1,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'life_science',
    year: 2025,
    paper: 'nov_p2',
    clues: '- This organelle is where mRNA and tRNA physically meet.\n- It is not where the DNA itself is stored.',
  },
  {
    name: 'Question 5',
    question: 'Which of the following are TRUE about the formation of a polypeptide chain during translation?',
    metadata: [
      'Amino acids are joined together by peptide bonds',
      'The order of amino acids is determined by the sequence of codons on the mRNA',
      'tRNA anticodons pair with mRNA codons',
      'The polypeptide chain forms directly from DNA without an mRNA intermediate',
      'Translation occurs inside the nucleus',
    ],
    answer: [
      'Amino acids are joined together by peptide bonds',
      'The order of amino acids is determined by the sequence of codons on the mRNA',
      'tRNA anticodons pair with mRNA codons',
      '',
      '',
    ],
    presentation: 'multi_select',
    type: 'definition',
    unit: 'molecular_cellular_tissue_level',
    topic: 'dna_code_of_life',
    subtopic: 'polypeptide_formation',
    skills: ['identify_polypeptide_formation_facts'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 5,
    syllabus: 'dbe',
    subject: 'life_science',
    year: 2025,
    paper: 'nov_p2',
    clues: '- An mRNA intermediate is required — this is translation, not direct DNA-to-protein synthesis.\n- Translation happens at the ribosome, in the cytoplasm, not inside the nucleus.',
  },
];

const aiExplanation = {
  sub_questions: [
    {
      number: '1.5.1(a)',
      marks: 1,
      clues: '- mRNA has already left the nucleus and is now at the site shown in this diagram.\n- Amino acids are being matched to codons via their carrier molecules.',
      approach: '- Identify whether this diagram shows the copying of DNA into mRNA, or the reading of mRNA to build a protein.\n- Recall which stage happens at a ribosome, with tRNA and amino acids involved.',
      solution: '1. The diagram shows mRNA codons being matched to tRNA anticodons, each carrying an amino acid.\n2. This is the process of translation.',
    },
    {
      number: '1.5.1(b)',
      marks: 1,
      clues: '- Molecule 1 points to the clover-leaf-shaped molecule carrying an amino acid.\n- This molecule has a three-base anticodon at one end.',
      approach: '- Identify what type of molecule is shown attached to each amino acid (P, Q, R, S).\n- Recall the name of the molecule that carries an amino acid and pairs its anticodon with an mRNA codon.',
      solution: '1. Molecule 1 is the carrier molecule attached to amino acid S.\n2. This molecule is transfer RNA (tRNA).',
    },
    {
      number: '1.5.1(c)',
      marks: 1,
      clues: '- Z is the large structure where the mRNA and tRNA molecules physically come together.\n- This is not the nucleus — mRNA has already left there.',
      approach: '- Identify the structure where mRNA and tRNA are shown meeting in the diagram.\n- Recall the name of the organelle where translation takes place.',
      solution: '1. Organelle Z is the site where mRNA and tRNA meet and amino acids are joined.\n2. This organelle is the ribosome.',
    },
    {
      number: '1.5.2(a)',
      marks: 1,
      clues: '- Codon 3 on the mRNA reads G, C, A.\n- Work out the DNA template base that would have produced each mRNA base.',
      approach: '- Recall the DNA-to-mRNA pairing rule: DNA G pairs with mRNA C; DNA C with mRNA G; DNA T with mRNA A; DNA A with mRNA U.\n- Apply this rule in reverse to each base of codon 3, in order.',
      solution: '1. Codon 3 (mRNA) reads G, C, A.\n2. Working backward: mRNA G came from DNA C; mRNA C came from DNA G; mRNA A came from DNA T.\n3. The DNA sequence is C, G, T.',
    },
    {
      number: '1.5.2(b)',
      marks: 2,
      clues: '- Codon 4 itself is not labelled in the diagram — work out which amino acid pairs with it first.\n- Three of the four tRNA anticodons shown can be matched directly to codons 2, 3 and 5; the leftover one belongs to codon 4.',
      approach: "- Match each tRNA's anticodon to its complementary codon among codons 2, 3 and 5, using base-pairing (remembering mRNA uses U instead of T).\n- Identify which tRNA is left unmatched — its anticodon belongs to codon 4.\n- Derive codon 4's mRNA sequence from that anticodon, then convert it to the DNA template sequence.",
      solution: '1. Anticodon matching shows S pairs with codon 2, and Q pairs with codon 3, and P pairs with codon 5 — leaving tRNA R (anticodon C, U, A) for codon 4.\n2. Codon 4\'s mRNA sequence, complementary to anticodon C-U-A, is G, A, U.\n3. Converting this mRNA sequence to its DNA template (mRNA G from DNA C; mRNA A from DNA T; mRNA U from DNA A) gives C, T, A.',
    },
    {
      number: '1.5.3',
      marks: 1,
      clues: '- Codon 5 reads C, G, A on the mRNA.\n- Match this to the tRNA anticodon that would pair with it.',
      approach: "- Apply the base-pairing rule to codon 5's sequence to determine the required anticodon.\n- Compare this required anticodon to the four tRNA molecules shown (P, Q, R, S) to find the match.",
      solution: '1. Codon 5 (mRNA) reads C, G, A.\n2. The complementary anticodon is G, C, U.\n3. This matches the anticodon shown on tRNA P.\n4. The amino acid is P.',
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
