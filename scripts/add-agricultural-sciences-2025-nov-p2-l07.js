#!/usr/bin/env node
/**
 * DBE Agricultural Sciences P2 — November 2025 — Question 1: Mutations, loci and genetic terms (Section A) (order 7)
 * Section A items 1.3.4, 1.3.5, 1.4.3, 1.4.4 and 1.4.5 — aneuploidy, locus, the Punnett square, mutation and the homozygote. Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-agricultural-sciences-2025-nov-p2-l07.js --curriculum temp/curriculum-vocab-agricultural-sciences.json
 *   node scripts/add-agricultural-sciences-2025-nov-p2-l07.js --dry-run
 *   node scripts/add-agricultural-sciences-2025-nov-p2-l07.js
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
  "name": "Question 1: Mutations, loci and genetic terms (Section A)",
  "syllabus": "dbe",
  "subject": "agricultural_sciences",
  "year": 2025,
  "paper": "nov_p2",
  "order": 7,
  "content_tier": "free",
  "has_video": false,
  "xp": 7,
  "tags": [
    "chromosome_mutations",
    "gene_locus",
    "punnett_square"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p2/q7/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p2/q7/question_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p2/q7/question_3.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p2/q7/question_4.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p2/q7/question_5.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p2/q7/memo_1.png"
  ],
  "exam_question_marks": 7,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "A mutation in which a cell has one or more extra or missing chromosomes in its set is called ____. Give the term. (one word) []",
    "metadata": [
      "Term: ",
      "[ ]"
    ],
    "answer": [
      "aneuploidy",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "text",
    "type": "definition",
    "unit": "basic_agricultural_genetics",
    "topic": "mutations",
    "subtopic": "agri_term_recall",
    "skills": [
      "recall_agricultural_term"
    ],
    "difficulty": 3,
    "exam_weight": 1,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- The term describes a cell whose chromosome number is not a complete set."
  },
  {
    "name": "Question 2",
    "question": "What is the term for the physical position of a gene on a chromosome? (one word) []",
    "metadata": [
      "Term: ",
      "[ ]"
    ],
    "answer": [
      "locus",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "text",
    "type": "definition",
    "unit": "basic_agricultural_genetics",
    "topic": "agricultural_genetics_terms",
    "subtopic": "agri_term_recall",
    "skills": [
      "recall_agricultural_term"
    ],
    "difficulty": 3,
    "exam_weight": 1,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- The plural form of the word is loci."
  },
  {
    "name": "Question 3",
    "question": "A sudden random change in the genetic composition of a cell is passed on to its daughter cells. What is this change called?",
    "metadata": [
      "Selection",
      "Variation",
      "Mutation",
      "Fertilisation",
      ""
    ],
    "answer": [
      "Mutation",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "basic_agricultural_genetics",
    "topic": "mutations",
    "subtopic": "agri_term_recall",
    "skills": [
      "recall_agricultural_term"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- Variation is the result; this is the random change itself."
  },
  {
    "name": "Question 4",
    "question": "Match each genetics term to its meaning.",
    "metadata": [
      "A - Punnett square",
      "B - Homozygote",
      "C - Heterozygote",
      "D - Dihybrid cross",
      "1 - A table showing the possible genotypes of offspring",
      "2 - Has two identical alleles for a gene",
      "3 - Has two different alleles for a gene",
      "4 - A cross that involves two characteristics"
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
    "topic": "agricultural_genetics_terms",
    "subtopic": "agri_classification",
    "skills": [
      "classify_farm_concept"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p2"
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "1.3.4",
      "marks": 2,
      "clues": "- The chromosome number is wrong.\n- The cell has one or more extra or missing chromosomes.",
      "approach": "- Recall the types of mutations.\n- Name the one with extra or missing chromosomes.",
      "solution": "1. A mutation with one or more extra or missing chromosomes in the set is aneuploidy."
    },
    {
      "number": "1.3.5",
      "marks": 2,
      "clues": "- The question is about position on a chromosome.\n- The term is one Latin word.",
      "approach": "- Recall genetic terminology.\n- Name the physical position of a gene.",
      "solution": "1. The physical location of a gene on a chromosome is the locus."
    },
    {
      "number": "1.4.3",
      "marks": 1,
      "clues": "- The table is named after a person.\n- It shows possible genotypes of offspring.",
      "approach": "- Read the definition.\n- Replace the underlined word with the correct name.",
      "solution": "1. The table is a Punnett square, not a Mendelian square."
    },
    {
      "number": "1.4.4",
      "marks": 1,
      "clues": "- The change is random and in the genetic composition.\n- Variation is the outcome of it.",
      "approach": "- Read the definition.\n- Replace the underlined word with the correct term.",
      "solution": "1. A random change in the genetic composition of a cell is a mutation."
    },
    {
      "number": "1.4.5",
      "marks": 1,
      "clues": "- The animal has two identical alleles.\n- A dihybrid is a cross for two traits.",
      "approach": "- Read the definition.\n- Replace the underlined word.",
      "solution": "1. An individual with two identical alleles for a gene is a homozygote (pure-bred)."
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
