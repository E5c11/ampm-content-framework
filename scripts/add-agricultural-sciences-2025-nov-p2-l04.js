#!/usr/bin/env node
/**
 * DBE Agricultural Sciences P2 — November 2025 — Question 1: Production factors, overhead costs and net worth (Section A) (order 4)
 * Section A items 1.1.5, 1.1.6, 1.2.3 and 1.3.2 — factors of production, overhead costs, land and net worth. Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-agricultural-sciences-2025-nov-p2-l04.js --curriculum temp/curriculum-vocab-agricultural-sciences.json
 *   node scripts/add-agricultural-sciences-2025-nov-p2-l04.js --dry-run
 *   node scripts/add-agricultural-sciences-2025-nov-p2-l04.js
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
  "name": "Question 1: Production factors, overhead costs and net worth (Section A)",
  "syllabus": "dbe",
  "subject": "agricultural_sciences",
  "year": 2025,
  "paper": "nov_p2",
  "order": 4,
  "content_tier": "free",
  "has_video": false,
  "xp": 8,
  "tags": [
    "factors_of_production",
    "overhead_costs",
    "land_as_a_factor"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p2/q4/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p2/q4/question_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p2/q4/question_3.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p2/q4/question_4.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p2/q4/memo_1.png"
  ],
  "exam_question_marks": 8,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Land, labour, capital and management are the inputs a farmer needs to produce goods. What are these inputs together called?",
    "metadata": [
      "Demand",
      "Supply",
      "Factors of production",
      "Capital of production",
      ""
    ],
    "answer": [
      "Factors of production",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "production_factors",
    "topic": "production_factors_overview",
    "subtopic": "agri_term_recall",
    "skills": [
      "recall_agricultural_term"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- The term describes everything a farmer must have to produce."
  },
  {
    "name": "Question 2",
    "question": "Match each farm cost to its type.",
    "metadata": [
      "A - Electricity for the whole farm",
      "B - Fuel for the tractor in one season",
      "C - Annual insurance premium",
      "D - Seed for one crop",
      "1 - Overhead cost",
      "2 - Variable cost",
      "3 - Fixed cost",
      "4 - Direct cost of an enterprise"
    ],
    "answer": [
      "A-1",
      "B-2",
      "C-3",
      "D-4"
    ],
    "presentation": "match",
    "type": "application",
    "unit": "production_factors",
    "topic": "farm_costs",
    "subtopic": "agri_classification",
    "skills": [
      "classify_farm_concept"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p2"
  },
  {
    "name": "Question 3",
    "question": "Which production factor includes the space that is available for farming activities?",
    "metadata": [
      "Labour",
      "Capital",
      "Land",
      "Management",
      ""
    ],
    "answer": [
      "Land",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "production_factors",
    "topic": "land_as_production_factor",
    "subtopic": "agri_term_recall",
    "skills": [
      "recall_agricultural_term"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p2"
  },
  {
    "name": "Question 4",
    "question": "A farmer owns assets worth R850 000 and has liabilities of R320 000. Calculate the net worth of the farmer, in rand. []",
    "metadata": [
      "Net worth (R): ",
      "[ ]"
    ],
    "answer": [
      "530000",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "type": "calc",
    "unit": "production_factors",
    "topic": "farm_finance_terms",
    "subtopic": "agri_calculation",
    "skills": [
      "apply_agricultural_formula"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- Net worth is the difference between what is owned and what is owed."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "1.1.5",
      "marks": 2,
      "clues": "- These are the inputs that a farmer needs.\n- Which term covers all of them?",
      "approach": "- Recall the term for economic inputs in production.\n- Match the description.",
      "solution": "1. All the economic inputs required by farmers to produce goods and services are called factors of production: A."
    },
    {
      "number": "1.1.6",
      "marks": 2,
      "clues": "- The expense is not linked to one enterprise.\n- Electricity serves the whole farm.",
      "approach": "- Recall the types of costs.\n- Match the one that applies to the whole farm.",
      "solution": "1. Expenses such as electricity that are not related to one enterprise are overhead costs: A."
    },
    {
      "number": "1.2.3",
      "marks": 2,
      "clues": "- The description is about space.\n- Look for the production factor.",
      "approach": "- Read the description.\n- Match it to the term in Column B.",
      "solution": "1. The space available for agricultural activities is land: H."
    },
    {
      "number": "1.3.2",
      "marks": 2,
      "clues": "- Compare the assets with the liabilities.\n- The answer is a term for the owner’s share.",
      "approach": "- Recall the difference between assets and liabilities.\n- Name that value.",
      "solution": "1. The difference between the value of assets and liabilities is the net worth (net value or owner’s equity)."
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
