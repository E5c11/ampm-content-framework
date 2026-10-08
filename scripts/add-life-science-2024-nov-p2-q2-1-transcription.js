#!/usr/bin/env node
/**
 * DBE Life Sciences P2 — November 2024 — Question 2.1 (Transcription and Protein Synthesis) (order 7)
 *
 * Real Q2.1 (12 marks): transcription diagram — molecule Y (mRNA AGA UAC CCA), describe transcription (6), DNA vs RNA difference,
 * triplet Z on strand 2 (TAC), first and last amino acids from a codon table (arginine, proline). Exam page 8; memo page 5.
 * Practice uses fresh base sequences and a fresh codon table written into each stem. Independent lesson.
 *
 * Keyboard (KEYBOARD-04, core/keyboard-input.md): every typed fitb declares keyboard_type — standard_math for a bare
 * number, text for a single canonical term. The exam gate is derived from the rows by tools/apply-exam-gate.js (VER-09).
 * Do NOT copy a P2 2025 script as a template: those predate KEYBOARD-04 (tools/lib/legacy-keyboard-allowlist.js).
 * Reminder: don't factor shared text into an outer const used inside `questions` — validate-questions.js evals the
 * `questions = [...]` block in isolation.
 *
 *   node tools/validate-questions.js --script scripts/add-life-science-2024-nov-p2-q2-1-transcription.js --curriculum temp/curriculum-vocab-life-science-p2-2024.json
 *   node scripts/add-life-science-2024-nov-p2-q2-1-transcription.js --dry-run
 *   node scripts/add-life-science-2024-nov-p2-q2-1-transcription.js
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
  "name": "Question 2.1 (Transcription and Protein Synthesis)",
  "syllabus": "dbe",
  "subject": "life_science",
  "year": 2024,
  "paper": "nov_p2",
  "order": 7,
  "content_tier": "free",
  "has_video": false,
  "xp": 60,
  "tags": [
    "protein_synthesis",
    "dna_code_of_life"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2024/nov_p2/q7/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2024/nov_p2/q7/memo_1.png"
  ],
  "exam_question_marks": 12
};

const questions = [
  {
    "name": "Question 1",
    "question": "Arrange the steps of transcription in the correct order.",
    "metadata": [
      "Free RNA nucleotides pair with complementary bases on the template",
      "The DNA double helix unwinds",
      "The mRNA moves out of the nucleus to a ribosome",
      "One strand is used as a template",
      "Hydrogen bonds break and the DNA strands separate"
    ],
    "answer": [
      "The DNA double helix unwinds",
      "Hydrogen bonds break and the DNA strands separate",
      "One strand is used as a template",
      "Free RNA nucleotides pair with complementary bases on the template",
      "The mRNA moves out of the nucleus to a ribosome"
    ],
    "presentation": "ordering",
    "type": "ordering",
    "unit": "molecular_cellular_tissue_level",
    "topic": "dna_code_of_life",
    "subtopic": "transcription_sequence",
    "skills": [
      "sequence_transcription_steps"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Only one DNA strand is copied.\n- The mRNA leaves the nucleus at the end."
  },
  {
    "name": "Question 2",
    "question": "Which statements correctly compare DNA with mRNA? Select ALL that apply.",
    "metadata": [
      "DNA is double-stranded; mRNA is single-stranded",
      "DNA has uracil; mRNA has thymine",
      "DNA has deoxyribose; mRNA has ribose",
      "DNA is shorter than an mRNA molecule",
      "DNA has thymine; mRNA has uracil"
    ],
    "answer": [
      "DNA is double-stranded; mRNA is single-stranded",
      "DNA has deoxyribose; mRNA has ribose",
      "DNA has thymine; mRNA has uracil",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "molecular_cellular_tissue_level",
    "topic": "dna_code_of_life",
    "subtopic": "dna_rna_structural_differences",
    "skills": [
      "compare_dna_rna_structure"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Compare the number of strands, the sugar and the bases.\n- mRNA is a copy of only one gene."
  },
  {
    "name": "Question 3",
    "question": "A section of a DNA template strand has the base sequence TAC GGA. What is the base sequence of the mRNA transcribed from it?",
    "metadata": [
      "ATG CCT",
      "UAC GGA",
      "AUG CCU",
      "TUC GGU",
      ""
    ],
    "answer": [
      "AUG CCU",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "molecular_cellular_tissue_level",
    "topic": "dna_code_of_life",
    "subtopic": "complementary_base_pairing",
    "skills": [
      "derive_complementary_sequence"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- RNA has U instead of T.\n- A on the DNA template pairs with U on the mRNA."
  },
  {
    "name": "Question 4",
    "question": "An mRNA codon reads GCU. What is the matching triplet on the DNA strand that was NOT used as the template?",
    "metadata": [
      "CGA",
      "GCU",
      "CGU",
      "GCT",
      ""
    ],
    "answer": [
      "GCT",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "molecular_cellular_tissue_level",
    "topic": "dna_code_of_life",
    "subtopic": "coding_strand_sequence",
    "skills": [
      "derive_coding_strand_triplet"
    ],
    "difficulty": 4,
    "exam_weight": 1,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- The non-template strand is complementary to the template strand, just like the mRNA.\n- DNA has T where RNA has U."
  },
  {
    "name": "Question 5",
    "question": "Use this codon table: GCU = alanine, AAG = lysine, UGG = tryptophan, CAU = histidine. An mRNA strand reads GCU UGG AAG from left to right. Which are the first and last amino acids coded for?",
    "metadata": [
      "Lysine first, alanine last",
      "Alanine first, tryptophan last",
      "Histidine first, lysine last",
      "Alanine first, lysine last",
      ""
    ],
    "answer": [
      "Alanine first, lysine last",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "reading",
    "unit": "molecular_cellular_tissue_level",
    "topic": "dna_code_of_life",
    "subtopic": "codon_table_reading",
    "skills": [
      "read_amino_acids_from_codons"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 5,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Split the strand into triplets and read them left to right."
  },
  {
    "name": "Question 6",
    "question": "An mRNA molecule has 300 bases, and every base is part of a codon that codes for an amino acid. How many amino acids will the protein have?",
    "metadata": [
      "= ",
      "[ ]",
      " amino acids"
    ],
    "answer": [
      "100",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "calc",
    "unit": "molecular_cellular_tissue_level",
    "topic": "dna_code_of_life",
    "subtopic": "codons_to_amino_acid_count",
    "skills": [
      "calculate_amino_acids_from_bases"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "xp": 10,
    "order": 6,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p2",
    "keyboard_type": "standard_math",
    "clues": "- One codon is three bases.\n- One codon codes for one amino acid."
  }
];

const aiExplanation = {
  sub_questions: [
    {
      "number": "2.1.1",
      "marks": 1,
      "clues": "- Molecule Y is a single strand built on the template strand.",
      "approach": "- Note that Y contains U (uracil).\n- Name the RNA made during transcription.",
      "solution": "1. Y has uracil and is single-stranded, so it is RNA.\n2. It is copied from DNA in the nucleus, so it is mRNA (messenger RNA)."
    },
    {
      "number": "2.1.2",
      "marks": 6,
      "clues": "- Describe transcription step by step.\n- Mention the template and the free RNA nucleotides.",
      "approach": "- Start with the DNA unwinding and unzipping.\n- Then describe how mRNA is built on one strand.\n- Give six correct points.",
      "solution": "1. The DNA double helix unwinds.\n2. It unzips as the weak hydrogen bonds break, forming two separate strands.\n3. One strand is used as a template.\n4. Free RNA nucleotides from the nucleoplasm attach to it.\n5. This forms mRNA.\n6. The mRNA is complementary to the DNA: A pairs with U and G pairs with C."
    },
    {
      "number": "2.1.3",
      "marks": 2,
      "clues": "- Molecule X is DNA and molecule Y is mRNA.",
      "approach": "- Choose one feature, such as strands, sugar or bases.\n- State it for BOTH molecules.",
      "solution": "1. Molecule X (DNA) is double-stranded.\n2. Molecule Y (RNA) is single-stranded.\n3. Other accepted pairs: deoxyribose vs ribose, thymine vs uracil, hydrogen bonds vs none, longer vs shorter."
    },
    {
      "number": "2.1.4",
      "marks": 1,
      "clues": "- Strand 2 is the non-template strand.\n- It has the same sequence as mRNA, with T instead of U.",
      "approach": "- Find the mRNA codon opposite triplet Z (the middle triplet).\n- Replace U with T.",
      "solution": "1. The middle codon on molecule Y is UAC.\n2. Strand 2 matches the mRNA, but with T in place of U.\n3. Triplet Z is TAC."
    },
    {
      "number": "2.1.5",
      "marks": 2,
      "clues": "- Read the codons on molecule Y from left to right: AGA UAC CCA.",
      "approach": "- Look up the first and the last codon in the table.",
      "solution": "1. The first codon, AGA, codes for arginine.\n2. The last codon, CCA, codes for proline.\n3. Answer: arginine and proline."
    }
  ],
  model: 'claude-opus-5-5',
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

  // Exam gate (VER-02/VER-04, tools/apply-exam-gate.js): derive the exam's minimum app version from the rows now in the
  // database and write it to exam_versions. Dev only; idempotent; the gate is per EXAM, so it covers P2 too.
  if (!DRY_RUN && ENV === 'dev') {
    const { applyExamGates } = require('../tools/lib/exam-gate');
    await applyExamGates(pool, { env: ENV, apply: true, filter: { subject: video.subject, syllabus: video.syllabus, year: String(video.year) } });
  }
}

if (require.main === module) {
  upload()
    .catch((err) => {
      console.error('\n❌ Upload failed:', err.message);
      process.exitCode = 1;
    })
    .finally(closePool);
}
