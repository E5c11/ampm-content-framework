#!/usr/bin/env node
/**
 * DBE Life Sciences P2 — November 2024 — Question 1 (DNA: Code of Life) (order 1)
 *
 * Section A cluster (DESIGN-UNI-10 rule 2), DNA: Code of Life — real 1.1.1 (site of protein synthesis), 1.1.10 (product of
 * translation), 1.2.1 (DNA), 1.2.4 (tRNA), 1.2.5 (DNA profiling), 1.3.2 (Franklin and Wilkins). 9 marks. Exam pages 3–5 as
 * question_image_urls; memo page 4. Fresh practice questions, no figure. Independent lesson.
 *
 * Keyboard (KEYBOARD-04, core/keyboard-input.md): every typed fitb declares keyboard_type — standard_math for a bare
 * number, text for a single canonical term. The exam gate is derived from the rows by tools/apply-exam-gate.js (VER-09).
 * Do NOT copy a P2 2025 script as a template: those predate KEYBOARD-04 (tools/lib/legacy-keyboard-allowlist.js).
 * Reminder: don't factor shared text into an outer const used inside `questions` — validate-questions.js evals the
 * `questions = [...]` block in isolation.
 *
 *   node tools/validate-questions.js --script scripts/add-life-science-2024-nov-p2-q1-dna.js --curriculum temp/curriculum-vocab-life-science-p2-2024.json
 *   node scripts/add-life-science-2024-nov-p2-q1-dna.js --dry-run
 *   node scripts/add-life-science-2024-nov-p2-q1-dna.js
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
  "name": "Question 1 (DNA: Code of Life)",
  "syllabus": "dbe",
  "subject": "life_science",
  "year": 2024,
  "paper": "nov_p2",
  "order": 1,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "dna_code_of_life",
    "protein_synthesis"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2024/nov_p2/q1/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2024/nov_p2/q1/question_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2024/nov_p2/q1/question_3.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2024/nov_p2/q1/memo_1.png"
  ],
  "exam_question_marks": 9
};

const questions = [
  {
    "name": "Question 1",
    "question": "A toxin destroys all the ribosomes in a cell. Which stage of protein synthesis stops?",
    "metadata": [
      "Transcription of DNA into mRNA in the nucleus",
      "Replication of DNA during interphase",
      "Translation of mRNA into a chain of amino acids",
      "Unwinding of the DNA double helix in the nucleus",
      ""
    ],
    "answer": [
      "Translation of mRNA into a chain of amino acids",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "molecular_cellular_tissue_level",
    "topic": "dna_code_of_life",
    "subtopic": "ribosome_function",
    "skills": [
      "identify_ribosome_function"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Ribosomes are found in the cytoplasm, not in the nucleus.\n- Ask which stage needs a ribosome to happen."
  },
  {
    "name": "Question 2",
    "question": "Match each molecule or organelle to its role in protein synthesis.",
    "metadata": [
      "A - DNA",
      "B - mRNA",
      "C - tRNA",
      "D - Ribosome",
      "1 - Brings a specific amino acid to the site of protein synthesis",
      "2 - Stores the genetic code in the nucleus",
      "3 - Site where amino acids are joined to form a protein",
      "4 - Carries a copy of the code from the nucleus to the cytoplasm"
    ],
    "answer": [
      "A-2",
      "B-4",
      "C-1",
      "D-3"
    ],
    "presentation": "match",
    "type": "definition",
    "unit": "molecular_cellular_tissue_level",
    "topic": "dna_code_of_life",
    "subtopic": "nucleic_acid_roles",
    "skills": [
      "match_nucleic_acid_to_role"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Follow the code from where it is stored to where the protein is built."
  },
  {
    "name": "Question 3",
    "question": "In 1953 Watson and Crick built the first double-helix model of DNA. Which evidence did they rely on most?",
    "metadata": [
      "Pea-plant breeding results recorded by Gregor Mendel",
      "Fossil skulls described by Dart and Broom",
      "Microscope photographs of cells in meiosis",
      "X-ray images of DNA made by Franklin and Wilkins",
      ""
    ],
    "answer": [
      "X-ray images of DNA made by Franklin and Wilkins",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "molecular_cellular_tissue_level",
    "topic": "dna_code_of_life",
    "subtopic": "dna_structure_discovery",
    "skills": [
      "identify_dna_structure_evidence"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- The shape of a molecule cannot be seen with a light microscope.\n- Two other scientists photographed DNA using X-rays."
  },
  {
    "name": "Question 4",
    "question": "Which of the following are uses of DNA profiling? Select ALL that apply.",
    "metadata": [
      "Matching blood at a crime scene to a suspect",
      "Making insulin in genetically modified bacteria",
      "Testing whether a man is the father of a child",
      "Counting chromosomes to diagnose Down syndrome",
      "Identifying the remains of disaster victims"
    ],
    "answer": [
      "Matching blood at a crime scene to a suspect",
      "Testing whether a man is the father of a child",
      "Identifying the remains of disaster victims",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "molecular_cellular_tissue_level",
    "topic": "dna_code_of_life",
    "subtopic": "dna_profiling_uses",
    "skills": [
      "identify_dna_profiling_uses"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- DNA profiling compares DNA samples to identify people or relationships.\n- Counting chromosomes uses a karyotype instead."
  },
  {
    "name": "Question 5",
    "question": "A drug stops peptide bonds from forming between amino acids on the ribosome. Which molecule will the cell fail to make?",
    "metadata": [
      "An mRNA molecule",
      "A protein",
      "A DNA molecule",
      "A tRNA molecule",
      ""
    ],
    "answer": [
      "A protein",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "molecular_cellular_tissue_level",
    "topic": "dna_code_of_life",
    "subtopic": "polypeptide_formation",
    "skills": [
      "identify_polypeptide_formation_facts"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "xp": 10,
    "order": 5,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Peptide bonds link amino acids into a chain.\n- Think of the final product of translation."
  }
];

const aiExplanation = {
  sub_questions: [
    {
      "number": "1.1.1",
      "marks": 2,
      "clues": "- Protein synthesis ends with amino acids being joined.\n- Only one of the organelles listed does this.",
      "approach": "- Recall where translation takes place.\n- Rule out organelles for photosynthesis, respiration and cell division.",
      "solution": "1. Chloroplasts carry out photosynthesis, mitochondria carry out respiration and centrosomes form spindles.\n2. Ribosomes are where amino acids are joined during translation.\n3. The answer is A (ribosomes)."
    },
    {
      "number": "1.1.10",
      "marks": 2,
      "clues": "- Translation reads mRNA codons and joins amino acids.",
      "approach": "- Recall what is built during translation.\n- Note that amino acids are the building blocks, not the product.",
      "solution": "1. DNA is made during replication and mRNA during transcription.\n2. During translation, amino acids are joined into a chain.\n3. The product is a protein, so the answer is C."
    },
    {
      "number": "1.2.1",
      "marks": 1,
      "clues": "- It is found in the nucleus and in mitochondria.",
      "approach": "- Name the nucleic acid that stores the genetic code.\n- The abbreviation is also accepted.",
      "solution": "1. The hereditary information is carried by deoxyribonucleic acid.\n2. Answer: DNA (deoxyribonucleic acid)."
    },
    {
      "number": "1.2.4",
      "marks": 1,
      "clues": "- There are three types of RNA.",
      "approach": "- Match the job \"carries amino acids\" to the correct RNA.\n- mRNA carries the code; this one carries the amino acids.",
      "solution": "1. Transfer RNA picks up a specific amino acid in the cytoplasm and brings it to the ribosome.\n2. Answer: transfer RNA (tRNA)."
    },
    {
      "number": "1.2.5",
      "marks": 1,
      "clues": "- The analysis is used in forensics and paternity testing.",
      "approach": "- Name the technique that compares DNA samples.\n- Use the term the memo accepts.",
      "solution": "1. Comparing DNA samples to identify people or relationships is DNA profiling.\n2. Answer: DNA profiling."
    },
    {
      "number": "1.3.2",
      "marks": 2,
      "clues": "- One pair worked with DNA, the other with evolution.",
      "approach": "- Check each pair of scientists against the description.\n- Decide A only, B only, both or none.",
      "solution": "1. Franklin and Wilkins produced the X-ray images that showed the structure of DNA.\n2. Lamarck and Darwin proposed theories of evolution.\n3. The answer is A only."
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
