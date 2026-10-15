#!/usr/bin/env node
/**
 * DBE Agricultural Sciences P2 — November 2025 — Question 3.4: Capital and credit (order 14)
 * Question 3.4 — fixed and working capital and the type of credit used to buy capital items. Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-agricultural-sciences-2025-nov-p2-l14.js --curriculum temp/curriculum-vocab-agricultural-sciences.json
 *   node scripts/add-agricultural-sciences-2025-nov-p2-l14.js --dry-run
 *   node scripts/add-agricultural-sciences-2025-nov-p2-l14.js
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
  "name": "Question 3.4: Capital and credit",
  "syllabus": "dbe",
  "subject": "agricultural_sciences",
  "year": 2025,
  "paper": "nov_p2",
  "order": 14,
  "content_tier": "free",
  "has_video": false,
  "xp": 4,
  "tags": [
    "types_of_capital",
    "fixed_capital",
    "working_capital"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p2/q14/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p2/q14/memo_1.png"
  ],
  "exam_question_marks": 4,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "A dairy farmer builds a new milking parlour. Which type of capital does the parlour represent?",
    "metadata": [
      "Social capital",
      "Production capital",
      "Human capital",
      "Fixed capital",
      ""
    ],
    "answer": [
      "Fixed capital",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "production_factors",
    "topic": "capital_and_credit",
    "subtopic": "agri_classification",
    "skills": [
      "classify_farm_concept"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- A building stays on the farm for many years and is not used up in one season."
  },
  {
    "name": "Question 2",
    "question": "Select ALL the items that are working (production) capital on a crop farm.",
    "metadata": [
      "A packing shed for fruit and vegetables",
      "Seed for the planting season",
      "Fertiliser applied this season",
      "Fuel for the tractor",
      "A grain silo for the harvest"
    ],
    "answer": [
      "Seed for the planting season",
      "Fertiliser applied this season",
      "Fuel for the tractor",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "production_factors",
    "topic": "capital_and_credit",
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
    "paper": "nov_p2",
    "clues": "- Working capital is used up or turned over within a production cycle."
  },
  {
    "name": "Question 3",
    "question": "A farmer takes a bank loan to buy a tractor and repays it over five years. What type of credit is this?",
    "metadata": [
      "Short-term credit",
      "Medium-term credit",
      "Long-term credit",
      "Trade credit",
      ""
    ],
    "answer": [
      "Medium-term credit",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "production_factors",
    "topic": "capital_and_credit",
    "subtopic": "agri_scenario_application",
    "skills": [
      "apply_practice_to_scenario"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- Medium-term credit is used for medium-term assets and is repaid over two to ten years."
  },
  {
    "name": "Question 4",
    "question": "A farmer repays a R120 000 loan for a tractor in equal instalments over 5 years, ignoring interest. Calculate each yearly instalment, in rand. []",
    "metadata": [
      "Instalment (R): ",
      "[ ]"
    ],
    "answer": [
      "24000",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "type": "calc",
    "unit": "production_factors",
    "topic": "capital_and_credit",
    "subtopic": "agri_calculation",
    "skills": [
      "apply_agricultural_formula"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- Divide the total loan by the number of years."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "3.4.1",
      "marks": 2,
      "clues": "- Picture C is a building; picture A is a consumable input.\n- Name the type of capital.",
      "approach": "- Look at the three pictures.\n- Classify picture C and picture A.",
      "solution": "1. (a) Picture C, a building, is fixed capital.\n2. (b) Picture A, medication for parasites, is production (working or floating) capital."
    },
    {
      "number": "3.4.2",
      "marks": 2,
      "clues": "- The item in picture B is a medium-term asset.\n- Think about the repayment period.",
      "approach": "- Identify the type of credit used for medium-term assets.\n- State how long it takes to repay.",
      "solution": "1. Medium-term credit is used to purchase medium-term assets.\n2. It is repayable over a period of two to ten years."
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
