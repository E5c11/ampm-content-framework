#!/usr/bin/env node
/**
 * DBE Agricultural Sciences P2 — November 2025 — Question 4.2: Punnett square and expected offspring (order 18)
 * Question 4.2 — using a Punnett square for a cross between two heterozygous plants: gametes, genotypes, the fraction showing the dominant trait and the expected number. Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-agricultural-sciences-2025-nov-p2-l18.js --curriculum temp/curriculum-vocab-agricultural-sciences.json
 *   node scripts/add-agricultural-sciences-2025-nov-p2-l18.js --dry-run
 *   node scripts/add-agricultural-sciences-2025-nov-p2-l18.js
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
  "name": "Question 4.2: Punnett square and expected offspring",
  "syllabus": "dbe",
  "subject": "agricultural_sciences",
  "year": 2025,
  "paper": "nov_p2",
  "order": 18,
  "content_tier": "free",
  "has_video": false,
  "xp": 7,
  "tags": [
    "punnett_square",
    "heterozygous_cross",
    "expected_offspring"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p2/q18/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p2/q18/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p2/q18/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p2/q18/memo_2.png"
  ],
  "exam_question_marks": 7,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "In maize, tall (T) is dominant over short (t). Two heterozygous plants (Tt × Tt) are crossed. Which gametes can each parent produce?",
    "metadata": [
      "T only",
      "TT and tt",
      "Tt only",
      "T and t",
      ""
    ],
    "answer": [
      "T and t",
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
    "order": 1,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- Each gamete carries only one allele of the gene."
  },
  {
    "name": "Question 2",
    "question": "Select ALL the genotypes that appear in the offspring of the cross Tt × Tt.",
    "metadata": [
      "ttt",
      "TT",
      "Tt",
      "tt",
      "TTt"
    ],
    "answer": [
      "TT",
      "Tt",
      "tt",
      "",
      ""
    ],
    "presentation": "multi_select",
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
    "clues": "- Combine one allele from each parent in every possible way."
  },
  {
    "name": "Question 3",
    "question": "What fraction of the offspring of the cross Tt × Tt is expected to be tall?",
    "metadata": [
      "One quarter",
      "Three quarters",
      "One half",
      "All of them",
      ""
    ],
    "answer": [
      "Three quarters",
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
    "clues": "- Both TT and Tt plants are tall."
  },
  {
    "name": "Question 4",
    "question": "A total of 800 offspring are produced from the cross Tt × Tt. How many tall plants are expected? []",
    "metadata": [
      "Tall plants: ",
      "[ ]"
    ],
    "answer": [
      "600",
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
    "clues": "- Multiply the fraction of tall plants by the total number of offspring."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "4.2.1",
      "marks": 4,
      "clues": "- The marking guideline gives one mark each for the male gametes, the female gametes, the offspring genotypes and the filled square.\n- Both parents are heterozygous.",
      "approach": "- Write the gametes of each parent along the top and the side.\n- Fill every block by combining the allele from the row and the column.",
      "solution": "1. The parents are both Dd, so each parent produces D and d gametes.\n2. The squares contain DD, Dd, Dd and dd."
    },
    {
      "number": "4.2.2",
      "marks": 1,
      "clues": "- Both DD and Dd show the dominant trait.\n- Count them in the square.",
      "approach": "- Count the genotypes that give spherical seeds.\n- Write the fraction.",
      "solution": "1. Three of the four genotypes (DD, Dd, Dd) give spherical seeds: 3/4."
    },
    {
      "number": "4.2.3",
      "marks": 2,
      "clues": "- Use the fraction from the previous question.\n- Multiply by the number of plants.",
      "approach": "- Write the fraction as 3/4.\n- Multiply by 900.",
      "solution": "1. 3/4 × 900 = 675 plants with spherical seeds."
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
