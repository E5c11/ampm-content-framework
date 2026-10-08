#!/usr/bin/env node
/**
 * DBE Life Sciences P2 — November 2024 — Question 1 (Meiosis) (order 2)
 *
 * Section A cluster (DESIGN-UNI-10 rule 2), Meiosis — real 1.1.4 (non-disjunction and Down syndrome), 1.1.8 (mitosis vs
 * meiosis table), 1.2.2 (haploid), 1.2.3 (centromere), 1.2.8 (metaphase I), 1.3.3 (karyokinesis and cytokinesis). 9 marks.
 * Exam pages 3–5; memo page 4. Fresh practice questions, no figure. Independent lesson.
 *
 * Keyboard (KEYBOARD-04, core/keyboard-input.md): every typed fitb declares keyboard_type — standard_math for a bare
 * number, text for a single canonical term. The exam gate is derived from the rows by tools/apply-exam-gate.js (VER-09).
 * Do NOT copy a P2 2025 script as a template: those predate KEYBOARD-04 (tools/lib/legacy-keyboard-allowlist.js).
 * Reminder: don't factor shared text into an outer const used inside `questions` — validate-questions.js evals the
 * `questions = [...]` block in isolation.
 *
 *   node tools/validate-questions.js --script scripts/add-life-science-2024-nov-p2-q1-meiosis.js --curriculum temp/curriculum-vocab-life-science-p2-2024.json
 *   node scripts/add-life-science-2024-nov-p2-q1-meiosis.js --dry-run
 *   node scripts/add-life-science-2024-nov-p2-q1-meiosis.js
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
  "name": "Question 1 (Meiosis)",
  "syllabus": "dbe",
  "subject": "life_science",
  "year": 2024,
  "paper": "nov_p2",
  "order": 2,
  "content_tier": "free",
  "has_video": false,
  "xp": 60,
  "tags": [
    "meiosis",
    "mitosis"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2024/nov_p2/q2/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2024/nov_p2/q2/question_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2024/nov_p2/q2/question_3.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2024/nov_p2/q2/memo_1.png"
  ],
  "exam_question_marks": 9
};

const questions = [
  {
    "name": "Question 1",
    "question": "An egg cell is formed with 24 chromosomes instead of 23. It is fertilised by a normal sperm. How many chromosomes will the zygote have?",
    "metadata": [
      "46",
      "47",
      "48",
      "24",
      ""
    ],
    "answer": [
      "47",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "calc",
    "unit": "molecular_cellular_tissue_level",
    "topic": "meiosis",
    "subtopic": "nondisjunction_consequences",
    "skills": [
      "predict_zygote_chromosome_number"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- A normal human sperm is haploid (23 chromosomes).\n- Add the chromosomes from both gametes."
  },
  {
    "name": "Question 2",
    "question": "Which event during meiosis I could produce a gamete with an extra chromosome?",
    "metadata": [
      "Chromatids exchange segments during crossing over in prophase I",
      "Chromosome pairs line up randomly at the equator of the cell in metaphase I",
      "The cytoplasm divides unequally between cells in telophase I",
      "A pair of homologous chromosomes fails to separate in anaphase I",
      ""
    ],
    "answer": [
      "A pair of homologous chromosomes fails to separate in anaphase I",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "molecular_cellular_tissue_level",
    "topic": "meiosis",
    "subtopic": "nondisjunction_cause",
    "skills": [
      "identify_nondisjunction_cause"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- An extra chromosome means both members of a pair ended up in the same cell."
  },
  {
    "name": "Question 3",
    "question": "Name the structure that holds the two chromatids of a chromosome together and attaches to a spindle fibre.",
    "metadata": [
      "[ ]"
    ],
    "answer": [
      "centromere|centromeres|the centromere",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "definition",
    "unit": "molecular_cellular_tissue_level",
    "topic": "meiosis",
    "subtopic": "chromosome_structure_terms",
    "skills": [
      "name_centromere"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p2",
    "keyboard_type": "text",
    "clues": "- It splits during anaphase II so that the chromatids can separate."
  },
  {
    "name": "Question 4",
    "question": "Which statements are true of meiosis but NOT of mitosis? Select ALL that apply.",
    "metadata": [
      "Homologous chromosomes pair up",
      "The nuclear membrane breaks down",
      "Crossing over can take place",
      "Spindle fibres pull chromosomes to the poles",
      "The chromosome number is halved"
    ],
    "answer": [
      "Homologous chromosomes pair up",
      "Crossing over can take place",
      "The chromosome number is halved",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "molecular_cellular_tissue_level",
    "topic": "meiosis",
    "subtopic": "mitosis_meiosis_comparison",
    "skills": [
      "compare_mitosis_meiosis"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Some events happen in every cell division.\n- Look for the events that make gametes different from body cells."
  },
  {
    "name": "Question 5",
    "question": "A body cell of a fruit fly has 8 chromosomes. How many chromosomes does each cell have at the end of meiosis II, and what is its chromosome condition?",
    "metadata": [
      "8 chromosomes, diploid",
      "4 chromosomes, diploid",
      "4 chromosomes, haploid",
      "8 chromosomes, haploid",
      ""
    ],
    "answer": [
      "4 chromosomes, haploid",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "calc",
    "unit": "molecular_cellular_tissue_level",
    "topic": "meiosis",
    "subtopic": "meiosis_chromosome_number",
    "skills": [
      "calculate_meiosis_chromosome_number"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "xp": 10,
    "order": 5,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Meiosis halves the chromosome number.\n- A cell with a single set of chromosomes is haploid."
  },
  {
    "name": "Question 6",
    "question": "Arrange these events of meiosis I in the order in which they happen.",
    "metadata": [
      "Chromosomes of each pair move to opposite poles",
      "Homologous chromosomes pair up",
      "The cytoplasm divides to form two cells",
      "Chromosome pairs line up at the equator"
    ],
    "answer": [
      "Homologous chromosomes pair up",
      "Chromosome pairs line up at the equator",
      "Chromosomes of each pair move to opposite poles",
      "The cytoplasm divides to form two cells"
    ],
    "presentation": "ordering",
    "type": "ordering",
    "unit": "molecular_cellular_tissue_level",
    "topic": "meiosis",
    "subtopic": "meiosis_i_event_sequence",
    "skills": [
      "sequence_meiosis_i_events"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 6,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Prophase, metaphase, anaphase, telophase.\n- Cytokinesis comes after the nucleus has divided."
  }
];

const aiExplanation = {
  sub_questions: [
    {
      "number": "1.1.4",
      "marks": 2,
      "clues": "- An extra chromosome 21 comes from a gamete with two copies of it.",
      "approach": "- Link Down syndrome to an error in gamete formation.\n- Find the option that describes non-disjunction.",
      "solution": "1. A gamete gets two copies of chromosome 21 when a chromosome pair does not separate during meiosis.\n2. This is non-disjunction.\n3. The answer is B."
    },
    {
      "number": "1.1.8",
      "marks": 2,
      "clues": "- Check each row in both columns, not just one.",
      "approach": "- Recall the number of cells, divisions and chromosome number for each process.\n- Find the row where both statements are correct.",
      "solution": "1. Mitosis produces two identical cells after one division; meiosis produces four different cells after two divisions.\n2. Rows A, B and D swap or misstate these facts.\n3. Row C is correct: mitosis keeps the chromosome number and meiosis halves it. The answer is C."
    },
    {
      "number": "1.2.2",
      "marks": 1,
      "clues": "- Gametes have this condition.",
      "approach": "- One set is n, two sets is 2n.\n- Name the condition for n.",
      "solution": "1. A cell with a single set of chromosomes (n) is haploid.\n2. Answer: haploid."
    },
    {
      "number": "1.2.3",
      "marks": 1,
      "clues": "- It splits during anaphase II.",
      "approach": "- Name the point where the two chromatids are joined.",
      "solution": "1. The two chromatids are held together at the centromere.\n2. Answer: centromere."
    },
    {
      "number": "1.2.8",
      "marks": 1,
      "clues": "- The chromosomes are still in pairs, so this is meiosis I.",
      "approach": "- Name the phase where chromosomes line up at the equator.\n- Add I because they are paired.",
      "solution": "1. Chromosomes line up at the equator in metaphase.\n2. They are in homologous pairs only in meiosis I.\n3. Answer: metaphase I."
    },
    {
      "number": "1.3.3",
      "marks": 2,
      "clues": "- Each division in meiosis has two parts.",
      "approach": "- Karyokinesis is division of the nucleus.\n- Cytokinesis is division of the cytoplasm.",
      "solution": "1. In meiosis I and meiosis II, the nucleus divides (karyokinesis) and then the cytoplasm divides (cytokinesis).\n2. Both occur during meiosis, so the answer is both A and B."
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
