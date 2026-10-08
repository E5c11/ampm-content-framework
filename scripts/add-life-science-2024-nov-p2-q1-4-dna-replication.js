#!/usr/bin/env node
/**
 * DBE Life Sciences P2 — November 2024 — Question 1.4 (DNA Replication) (order 5)
 *
 * Real Q1.4 (6 marks): DNA molecule undergoing replication — process, hydrogen bond 1, nucleotide (parts 2, 3, 4), thymine (5),
 * interphase, nucleus. One lesson (DESIGN-UNI-10 rule 1). Exam page 6; memo page 4. Practice asks by function with no figure
 * (DESIGN-LIFE-03 option (i)). Independent lesson.
 *
 * Keyboard (KEYBOARD-04, core/keyboard-input.md): every typed fitb declares keyboard_type — standard_math for a bare
 * number, text for a single canonical term. The exam gate is derived from the rows by tools/apply-exam-gate.js (VER-09).
 * Do NOT copy a P2 2025 script as a template: those predate KEYBOARD-04 (tools/lib/legacy-keyboard-allowlist.js).
 * Reminder: don't factor shared text into an outer const used inside `questions` — validate-questions.js evals the
 * `questions = [...]` block in isolation.
 *
 *   node tools/validate-questions.js --script scripts/add-life-science-2024-nov-p2-q1-4-dna-replication.js --curriculum temp/curriculum-vocab-life-science-p2-2024.json
 *   node scripts/add-life-science-2024-nov-p2-q1-4-dna-replication.js --dry-run
 *   node scripts/add-life-science-2024-nov-p2-q1-4-dna-replication.js
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
  "name": "Question 1.4 (DNA Replication)",
  "syllabus": "dbe",
  "subject": "life_science",
  "year": 2024,
  "paper": "nov_p2",
  "order": 5,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "dna_code_of_life",
    "dna_replication"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2024/nov_p2/q5/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2024/nov_p2/q5/memo_1.png"
  ],
  "exam_question_marks": 6
};

const questions = [
  {
    "name": "Question 1",
    "question": "Arrange the steps of DNA replication in the correct order.",
    "metadata": [
      "Each strand acts as a template",
      "Two identical DNA molecules are formed",
      "The DNA double helix unwinds",
      "Free nucleotides attach to complementary bases",
      "Hydrogen bonds break and the two strands separate"
    ],
    "answer": [
      "The DNA double helix unwinds",
      "Hydrogen bonds break and the two strands separate",
      "Each strand acts as a template",
      "Free nucleotides attach to complementary bases",
      "Two identical DNA molecules are formed"
    ],
    "presentation": "ordering",
    "type": "ordering",
    "unit": "molecular_cellular_tissue_level",
    "topic": "dna_code_of_life",
    "subtopic": "dna_replication_sequence",
    "skills": [
      "sequence_dna_replication_steps"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- The strands must separate before they can be copied.\n- Each new molecule has one old strand and one new strand."
  },
  {
    "name": "Question 2",
    "question": "During DNA replication, which bonds break so that the two strands can separate?",
    "metadata": [
      "Bonds between sugar and phosphate",
      "Hydrogen bonds between the bases",
      "Peptide bonds between amino acids",
      "Bonds between the sugar and its base",
      ""
    ],
    "answer": [
      "Hydrogen bonds between the bases",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "molecular_cellular_tissue_level",
    "topic": "dna_code_of_life",
    "subtopic": "dna_bond_types",
    "skills": [
      "identify_dna_bonds"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- The sugar-phosphate backbone of each strand stays intact.\n- The weak bonds are in the middle of the ladder."
  },
  {
    "name": "Question 3",
    "question": "A nucleotide is made of three parts. Match each part to its description.",
    "metadata": [
      "A - Phosphate",
      "B - Deoxyribose",
      "C - Nitrogenous base",
      "1 - Pairs with a base on the opposite strand",
      "2 - Joins to the sugar of the next nucleotide to form the backbone",
      "3 - The five-carbon sugar of DNA"
    ],
    "answer": [
      "A-2",
      "B-3",
      "C-1"
    ],
    "presentation": "match",
    "type": "definition",
    "unit": "molecular_cellular_tissue_level",
    "topic": "dna_code_of_life",
    "subtopic": "dna_component_structure",
    "skills": [
      "identify_dna_components"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- The backbone is sugar and phosphate.\n- The \"rungs\" of the ladder are the bases."
  },
  {
    "name": "Question 4",
    "question": "Name the nitrogenous base that always pairs with guanine in a DNA molecule.",
    "metadata": [
      "[ ]"
    ],
    "answer": [
      "cytosine|C",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "definition",
    "unit": "molecular_cellular_tissue_level",
    "topic": "dna_code_of_life",
    "subtopic": "complementary_base_pairing",
    "skills": [
      "apply_base_pairing_rule"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p2",
    "keyboard_type": "text",
    "clues": "- A pairs with T, and G pairs with ..."
  },
  {
    "name": "Question 5",
    "question": "A biologist wants to study cells while their DNA is replicating. When and where does this happen?",
    "metadata": [
      "During prophase, in the cytoplasm",
      "During interphase, on the ribosomes",
      "During metaphase, in the nucleus",
      "During interphase, in the nucleus",
      ""
    ],
    "answer": [
      "During interphase, in the nucleus",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "molecular_cellular_tissue_level",
    "topic": "dna_code_of_life",
    "subtopic": "dna_replication_timing_location",
    "skills": [
      "identify_replication_timing_location"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "xp": 10,
    "order": 5,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- DNA is copied before a cell divides.\n- Nuclear DNA stays in the nucleus."
  }
];

const aiExplanation = {
  sub_questions: [
    {
      "number": "1.4.1(a)",
      "marks": 1,
      "clues": "- The two strands are separating and new bases are pairing with them.",
      "approach": "- Look at what is happening to the double helix.\n- Name the process that copies DNA.",
      "solution": "1. The molecule is unzipping and each strand is being copied.\n2. The process is DNA replication."
    },
    {
      "number": "1.4.1(b)",
      "marks": 1,
      "clues": "- Bond 1 is between two bases on opposite strands.",
      "approach": "- Find where bond 1 is in the diagram.\n- Name the bond that holds base pairs together.",
      "solution": "1. Bond 1 joins a base on one strand to a base on the other.\n2. It is a hydrogen bond."
    },
    {
      "number": "1.4.2(a)",
      "marks": 1,
      "clues": "- 2 is a phosphate, 3 is a sugar and 4 is a base.",
      "approach": "- Name the unit made of a phosphate, a sugar and a base.",
      "solution": "1. Phosphate (2), deoxyribose sugar (3) and base (4) together form one nucleotide.\n2. Answer: nucleotide."
    },
    {
      "number": "1.4.2(b)",
      "marks": 1,
      "clues": "- Compare the shape of base 5 with the bases labelled A and G.",
      "approach": "- Find which base fits with the shape of base 5.\n- Give the full name, not the letter.",
      "solution": "1. Base 5 has the shape that pairs with adenine.\n2. Adenine pairs with thymine, so base 5 is thymine."
    },
    {
      "number": "1.4.3",
      "marks": 1,
      "clues": "- DNA must be copied before the cell divides.",
      "approach": "- Name the phase of the cell cycle before mitosis or meiosis.",
      "solution": "1. DNA replication happens before division begins.\n2. Answer: interphase."
    },
    {
      "number": "1.4.4",
      "marks": 1,
      "clues": "- Nuclear DNA does not leave the nucleus.",
      "approach": "- Name the part of the cell where the DNA is found.",
      "solution": "1. DNA is replicated where it is kept.\n2. Answer: in the nucleus."
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
