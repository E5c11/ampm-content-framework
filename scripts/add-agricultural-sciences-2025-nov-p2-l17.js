#!/usr/bin/env node
/**
 * DBE Agricultural Sciences P2 — November 2025 — Question 4.1: Monohybrid cross (order 17)
 * Question 4.1 — a monohybrid cross through the F2 generation: gametes, fertilisation, phenotypes and genotypic ratio. Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-agricultural-sciences-2025-nov-p2-l17.js --curriculum temp/curriculum-vocab-agricultural-sciences.json
 *   node scripts/add-agricultural-sciences-2025-nov-p2-l17.js --dry-run
 *   node scripts/add-agricultural-sciences-2025-nov-p2-l17.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

// ─── Phase 2 — lesson document ───────────────────────────────────────────────

const video = {
  "name": "Question 4.1: Monohybrid cross",
  "syllabus": "dbe",
  "subject": "agricultural_sciences",
  "year": 2025,
  "paper": "nov_p2",
  "order": 17,
  "content_tier": "free",
  "has_video": false,
  "xp": 7,
  "tags": [
    "monohybrid_cross",
    "meiosis_and_fertilisation",
    "genotypic_ratio"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p2/q17/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p2/q17/memo_1.png"
  ],
  "exam_question_marks": 7,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Match each genetic term to its description.",
    "metadata": [
      "A - Monohybrid cross",
      "B - Dihybrid cross",
      "C - Meiosis",
      "D - Fertilisation",
      "1 - A cross that involves one characteristic",
      "2 - A cross that involves two characteristics",
      "3 - The division that forms gametes",
      "4 - The fusion of a male and a female gamete"
    ],
    "answer": [
      "A-1",
      "B-2",
      "C-3",
      "D-4"
    ],
    "presentation": "match",
    "type": "definition",
    "unit": "basic_agricultural_genetics",
    "topic": "genetic_crosses",
    "subtopic": "agri_classification",
    "skills": [
      "predict_genetic_outcome"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p2"
  },
  {
    "name": "Question 2",
    "question": "In sheep, white wool (W) is dominant over black wool (w). A pure white ram (WW) is crossed with a black ewe (ww). What is the phenotype of the F1 generation?",
    "metadata": [
      "All black",
      "All white",
      "Half white and half black",
      "Three white and one black",
      ""
    ],
    "answer": [
      "All white",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "basic_agricultural_genetics",
    "topic": "genetic_crosses",
    "subtopic": "agri_genetic_cross",
    "skills": [
      "predict_genetic_outcome"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- Every F1 lamb receives one W allele and one w allele.\n- Decide which allele shows in the phenotype."
  },
  {
    "name": "Question 3",
    "question": "Two F1 sheep (both Ww) are crossed. What is the genotypic ratio of the F2 generation (WW : Ww : ww)?",
    "metadata": [
      "3 : 1 : 0",
      "1 : 2 : 1",
      "2 : 1 : 1",
      "1 : 1 : 2",
      ""
    ],
    "answer": [
      "1 : 2 : 1",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "basic_agricultural_genetics",
    "topic": "genetic_crosses",
    "subtopic": "agri_genetic_cross",
    "skills": [
      "predict_genetic_outcome"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- List the four gamete combinations before counting each genotype."
  },
  {
    "name": "Question 4",
    "question": "The F1 sheep (both Ww) are crossed and produce 80 lambs in the F2 generation. How many black lambs (ww) are expected? []",
    "metadata": [
      "Black lambs: ",
      "[ ]"
    ],
    "answer": [
      "20",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "type": "calc",
    "unit": "basic_agricultural_genetics",
    "topic": "genetic_crosses",
    "subtopic": "agri_calculation",
    "skills": [
      "predict_genetic_outcome"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- Find the fraction of the F2 generation that is ww, then apply it to 80."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "4.1.1",
      "marks": 1,
      "clues": "- The cross involves one characteristic.\n- A prefix names how many traits.",
      "approach": "- Count the characteristics in the cross.\n- Name the type of cross.",
      "solution": "1. The cross involves one characteristic (colour), so it is a monohybrid cross."
    },
    {
      "number": "4.1.2",
      "marks": 1,
      "clues": "- Base the reason on the number of traits.\n- One sentence is enough.",
      "approach": "- State what a monohybrid cross is.\n- Link it to the diagram.",
      "solution": "1. It is a cross that involves only one characteristic (trait)."
    },
    {
      "number": "4.1.3",
      "marks": 2,
      "clues": "- Process 1 produces gametes; process 2 joins them.\n- Name each process.",
      "approach": "- Read the diagram from the parents to the gametes.\n- Then from the gametes to the F1 generation.",
      "solution": "1. (a) Process 1 is meiosis (gamete formation).\n2. (b) Process 2 is fertilisation."
    },
    {
      "number": "4.1.4",
      "marks": 2,
      "clues": "- Count the offspring that show the recessive colour.\n- Think about the phenotype of Bb offspring.",
      "approach": "- Count the black offspring in the F2 generation.\n- State the F1 phenotype.",
      "solution": "1. (a) Three black offspring in the F2 generation.\n2. (b) All black in the F1 generation."
    },
    {
      "number": "4.1.5",
      "marks": 1,
      "clues": "- List the genotypes in the F2 generation.\n- Write the ratio in the order BB, Bb, bb.",
      "approach": "- Count the F2 genotypes.\n- Write them as a ratio.",
      "solution": "1. The genotypic ratio of the F2 generation is 1 BB : 2 Bb : 1 bb."
    }
  ],
  "model": "claude-sonnet-5-5",
  "generated_at": Date.now(),
  "version": 2,
  "reviewed": false,
  "input_tokens": 0,
  "output_tokens": 0,
  "avg_rating": null,
  "rating_count": null
};

// ─── Upload ──────────────────────────────────────────────────────────────────

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

  // Exam gate (VER-02/VER-04/VER-09): derive the exam minimum from the rows now in the database and write it. Dev only; no-op at the floor.
  if (!DRY_RUN && ENV === 'dev') {
    const { applyExamGates } = require('../tools/lib/exam-gate');
    await applyExamGates(pool, { env: ENV, apply: true, filter: { subject: video.subject, syllabus: video.syllabus, year: String(video.year) } });
  } else if (DRY_RUN) {
    console.log('   (dry-run: the exam gate is derived and written after a real upload — node tools/apply-exam-gate.js shows it)');
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
