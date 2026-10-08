#!/usr/bin/env node
/**
 * DBE Life Sciences P2 — November 2024 — Question 1 (Genetics and Inheritance) (order 3)
 *
 * Section A cluster (DESIGN-UNI-10 rule 2), Genetics and Inheritance — real 1.1.2 (gonosomes), 1.1.3 (homozygous dominant),
 * 1.2.6 (karyotype), 1.2.9 (cloning). 6 marks. Exam pages 3 and 5; memo page 4. Fresh practice questions, no figure.
 *
 * Keyboard (KEYBOARD-04, core/keyboard-input.md): every typed fitb declares keyboard_type — standard_math for a bare
 * number, text for a single canonical term. The exam gate is derived from the rows by tools/apply-exam-gate.js (VER-09).
 * Do NOT copy a P2 2025 script as a template: those predate KEYBOARD-04 (tools/lib/legacy-keyboard-allowlist.js).
 * Reminder: don't factor shared text into an outer const used inside `questions` — validate-questions.js evals the
 * `questions = [...]` block in isolation.
 *
 *   node tools/validate-questions.js --script scripts/add-life-science-2024-nov-p2-q1-genetics.js --curriculum temp/curriculum-vocab-life-science-p2-2024.json
 *   node scripts/add-life-science-2024-nov-p2-q1-genetics.js --dry-run
 *   node scripts/add-life-science-2024-nov-p2-q1-genetics.js
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
  "name": "Question 1 (Genetics and Inheritance)",
  "syllabus": "dbe",
  "subject": "life_science",
  "year": 2024,
  "paper": "nov_p2",
  "order": 3,
  "content_tier": "free",
  "has_video": false,
  "xp": 40,
  "tags": [
    "genetics_and_inheritance",
    "biotechnology"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2024/nov_p2/q3/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2024/nov_p2/q3/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2024/nov_p2/q3/memo_1.png"
  ],
  "exam_question_marks": 6
};

const questions = [
  {
    "name": "Question 1",
    "question": "A couple already has three daughters. What is the percentage chance that their next child will be a boy?",
    "metadata": [
      "= ",
      "[ ]",
      " %"
    ],
    "answer": [
      "50",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "application",
    "unit": "molecular_cellular_tissue_level",
    "topic": "genetics_and_inheritance",
    "subtopic": "sex_determination_probability",
    "skills": [
      "predict_sex_of_offspring"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p2",
    "keyboard_type": "standard_math",
    "clues": "- The father produces sperm with an X or a Y chromosome in equal numbers.\n- Each pregnancy is independent of the ones before."
  },
  {
    "name": "Question 2",
    "question": "Which of the following genotypes are homozygous for BOTH genes? Select ALL that apply.",
    "metadata": [
      "RrTT",
      "RRTT",
      "rrtt",
      "RrTt",
      "RRtt"
    ],
    "answer": [
      "RRTT",
      "rrtt",
      "RRtt",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "molecular_cellular_tissue_level",
    "topic": "genetics_and_inheritance",
    "subtopic": "genotype_classification",
    "skills": [
      "classify_genotype_as_hetero_homozygous"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Homozygous means the two alleles of a gene are the same.\n- Check each gene separately."
  },
  {
    "name": "Question 3",
    "question": "A doctor wants to check whether an unborn baby has an extra copy of chromosome 21. Which of these would show this most directly?",
    "metadata": [
      "A DNA profile of the baby's cells",
      "A pedigree diagram of the family",
      "A karyotype of the baby's cells",
      "A phylogenetic tree of the family",
      ""
    ],
    "answer": [
      "A karyotype of the baby's cells",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "molecular_cellular_tissue_level",
    "topic": "genetics_and_inheritance",
    "subtopic": "karyotype_use",
    "skills": [
      "identify_karyotype_use"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- You need to see and count all the chromosomes in a cell."
  },
  {
    "name": "Question 4",
    "question": "A sheep was cloned by putting the nucleus of a body cell from sheep A into an egg cell from sheep B (its nucleus removed). The embryo grew inside sheep C. The clone is genetically identical to which sheep?",
    "metadata": [
      "Sheep B only",
      "Sheep A only",
      "Sheep C only",
      "Sheep A and sheep B",
      ""
    ],
    "answer": [
      "Sheep A only",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "molecular_cellular_tissue_level",
    "topic": "genetics_and_inheritance",
    "subtopic": "cloning_process",
    "skills": [
      "identify_clone_genetic_source"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Nearly all of a cell's DNA is in its nucleus.\n- The surrogate mother provides only the uterus."
  }
];

const aiExplanation = {
  sub_questions: [
    {
      "number": "1.1.2",
      "marks": 2,
      "clues": "- Gonosomes are the sex chromosomes X and Y.",
      "approach": "- Recall the sex chromosomes of a human male and female.\n- Find the row with both correct.",
      "solution": "1. Human males have one X and one Y chromosome (XY).\n2. Human females have two X chromosomes (XX).\n3. The answer is C."
    },
    {
      "number": "1.1.3",
      "marks": 2,
      "clues": "- Two identical alleles make an organism homozygous.\n- A capital letter shows a dominant allele.",
      "approach": "- Decide whether TT is homozygous or heterozygous.\n- Decide whether T is dominant or recessive.",
      "solution": "1. TT has two identical alleles, so it is homozygous.\n2. T is a capital letter, so the allele is dominant.\n3. The answer is C (homozygous dominant)."
    },
    {
      "number": "1.2.6",
      "marks": 1,
      "clues": "- It shows all the chromosomes of a somatic cell arranged in pairs.",
      "approach": "- Name the picture or chart of a cell's chromosomes.",
      "solution": "1. A representation of the number and structure of all chromosomes in a somatic cell is a karyotype.\n2. Answer: karyotype (karyogram is also accepted)."
    },
    {
      "number": "1.2.9",
      "marks": 1,
      "clues": "- Dolly the sheep was made by this process.",
      "approach": "- Name the biotechnology that makes genetically identical organisms.",
      "solution": "1. Producing genetically identical organisms is cloning.\n2. Answer: cloning."
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
