#!/usr/bin/env node
/**
 * DBE Agricultural Sciences P2 — November 2025 — Question 1: Heritability, gametes and trait types (Section A) (order 6)
 * Section A items 1.1.9, 1.1.10, 1.2.5 and 1.3.3 — heritability, gamete combinations, quantitative traits and genetics. Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-agricultural-sciences-2025-nov-p2-l06.js --curriculum temp/curriculum-vocab-agricultural-sciences.json
 *   node scripts/add-agricultural-sciences-2025-nov-p2-l06.js --dry-run
 *   node scripts/add-agricultural-sciences-2025-nov-p2-l06.js
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
  "name": "Question 1: Heritability, gametes and trait types (Section A)",
  "syllabus": "dbe",
  "subject": "agricultural_sciences",
  "year": 2025,
  "paper": "nov_p2",
  "order": 6,
  "content_tier": "free",
  "has_video": false,
  "xp": 8,
  "tags": [
    "heritability",
    "gamete_formation",
    "quantitative_traits"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p2/q6/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p2/q6/question_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p2/q6/question_3.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p2/q6/question_4.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p2/q6/memo_1.png"
  ],
  "exam_question_marks": 8,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Which statement about heritability is correct?",
    "metadata": [
      "It cannot be measured for any trait",
      "Only the environment influences it",
      "It compares unrelated individuals only",
      "Both genes and the environment influence it",
      ""
    ],
    "answer": [
      "Both genes and the environment influence it",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "basic_agricultural_genetics",
    "topic": "heritability",
    "subtopic": "agri_classification",
    "skills": [
      "classify_farm_concept"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- Heritability is the proportion of visible differences passed on from the parents."
  },
  {
    "name": "Question 2",
    "question": "An animal has the genotype CcDd. Which set contains ALL the gametes it can produce?",
    "metadata": [
      "CC, Cc, cc, DD",
      "CD, Cd, cD, cd",
      "Cc, Dd, CC, dd",
      "CD, cd, DD, cc",
      ""
    ],
    "answer": [
      "CD, Cd, cD, cd",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "basic_agricultural_genetics",
    "topic": "gamete_formation",
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
    "clues": "- Each gamete carries one allele of each gene."
  },
  {
    "name": "Question 3",
    "question": "Select ALL the characteristics of farm animals that are quantitative traits.",
    "metadata": [
      "Presence or absence of horns",
      "Length of the wool per year",
      "Milk yield per lactation",
      "Body mass at weaning",
      "Coat colour (black or red)"
    ],
    "answer": [
      "Milk yield per lactation",
      "Body mass at weaning",
      "Length of the wool per year",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "basic_agricultural_genetics",
    "topic": "qualitative_and_quantitative_traits",
    "subtopic": "agri_classification",
    "skills": [
      "classify_farm_concept"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- A quantitative trait takes a whole range of values without clear boundaries between classes."
  },
  {
    "name": "Question 4",
    "question": "What is the name of the scientific study of how genes and traits are passed on from parents to offspring? (one word) []",
    "metadata": [
      "Term: ",
      "[ ]"
    ],
    "answer": [
      "genetics",
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
    "difficulty": 2,
    "exam_weight": 1,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- The word comes from the name for the units of inheritance."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "1.1.9",
      "marks": 2,
      "clues": "- Heritability is influenced by genes and by the environment.\n- Find the option that is NOT correct.",
      "approach": "- Recall what heritability means.\n- Check each option.",
      "solution": "1. Genes and the environment both influence heritability, part of the visible differences from parents is passed on, and similar characteristics among related individuals are compared.\n2. Stating that the environment does not influence heritability would be wrong; the option that is NOT correct is B."
    },
    {
      "number": "1.1.10",
      "marks": 2,
      "clues": "- Each gamete carries one allele of each gene.\n- List all combinations for AaBb.",
      "approach": "- Write the alleles of the genotype AaBb.\n- Combine one allele of each gene.",
      "solution": "1. Gametes from AaBb are AB, Ab, aB and ab.\n2. The answer is C."
    },
    {
      "number": "1.2.5",
      "marks": 2,
      "clues": "- The values change without clear boundaries.\n- Compare qualitative and quantitative traits.",
      "approach": "- Read the description.\n- Match it to the term in Column B.",
      "solution": "1. A characteristic that takes on a whole range of values without clear boundaries is quantitative: G."
    },
    {
      "number": "1.3.3",
      "marks": 2,
      "clues": "- The word names a whole science.\n- It deals with genes and traits.",
      "approach": "- Read the description.\n- Give the one-word term.",
      "solution": "1. The scientific study of how genes and traits are passed on to offspring is genetics."
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
