#!/usr/bin/env node
/**
 * DBE Accounting — November 2025 — Question 3.1: Factory overhead cost note and cost of production (order 10)
 * Question 3.1 — the Factory Overhead Cost Note (allocations, prepaid insurance, floor space, depreciation) and the cost of production of finished goods.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-accounting-2025-nov-p2-l10.js --curriculum temp/curriculum-vocab-accounting.json
 *   node scripts/add-accounting-2025-nov-p2-l10.js --dry-run
 *   node scripts/add-accounting-2025-nov-p2-l10.js
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
  "name": "Question 3.1: Factory overhead cost note and cost of production",
  "syllabus": "dbe",
  "subject": "accounting",
  "year": 2025,
  "paper": "nov_p2",
  "order": 10,
  "content_tier": "free",
  "has_video": false,
  "xp": 20,
  "tags": [
    "factory_overhead_cost_note",
    "cost_of_production"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p2/q10/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p2/q10/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p2/q10/memo_1.png"
  ],
  "exam_question_marks": 20,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Use the information in the figure to calculate the missing amounts A, B and C.",
    "metadata": [
      "A = ",
      "[ ]",
      "   B = ",
      "[ ]",
      "   C = ",
      "[ ]"
    ],
    "answer": [
      "63900",
      "231000",
      "402000",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "unit": "cost_accounting",
    "topic": "factory_overhead_cost_note",
    "subtopic": "acc_statement_completion",
    "skills": [
      "complete_financial_statement"
    ],
    "difficulty": 5,
    "exam_weight": 3,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "accounting",
    "year": 2025,
    "paper": "nov_p2",
    "type": "calc",
    "clues": "- Only the part of the extra premium already used is an expense.\n- Rent is shared by m² and months.\n- Depreciation covers the old and the new equipment.",
    "supplementary_material": {
      "type": "statement",
      "label": "Factory overhead cost note: Steelcraft Manufacturers",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/accounting/2025/nov_p2/q10/statement_1.png"
      ]
    }
  },
  {
    "name": "Question 2",
    "question": "Prime cost is R4 850 000 and total factory overhead cost is R1 721 200. Work-in-progress was R110 000 at the beginning and R84 000 at the end. Calculate the cost of production of finished goods.",
    "metadata": [
      "Cost of production = R ",
      "[ ]"
    ],
    "answer": [
      "6597200",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "unit": "cost_accounting",
    "topic": "cost_of_production",
    "subtopic": "acc_calculation",
    "skills": [
      "calculate_accounting_amount"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "accounting",
    "year": 2025,
    "paper": "nov_p2",
    "type": "calc",
    "clues": "- Opening work-in-progress is added and closing work-in-progress is deducted."
  },
  {
    "name": "Question 3",
    "question": "An additional insurance premium covers 12 months, but only 3 months of it have passed by the year-end. How is the remaining part treated?",
    "metadata": [
      "It is an expense of the current year in full",
      "It is prepaid and not a cost of this year",
      "It is part of the cost of production now",
      "It is added to the factory depreciation",
      ""
    ],
    "answer": [
      "It is prepaid and not a cost of this year",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "cost_accounting",
    "topic": "factory_overhead_cost_note",
    "subtopic": "acc_classification",
    "skills": [
      "classify_accounting_concept"
    ],
    "difficulty": 4,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "accounting",
    "year": 2025,
    "paper": "nov_p2",
    "type": "application"
  },
  {
    "name": "Question 4",
    "question": "Select ALL the items that belong in the Factory Overhead Cost Note.",
    "metadata": [
      "Advertising costs",
      "The factory share of water and electricity",
      "Rent for the factory floor space",
      "Depreciation on factory equipment",
      "Rent for the sales department floor space"
    ],
    "answer": [
      "The factory share of water and electricity",
      "Depreciation on factory equipment",
      "Rent for the factory floor space",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "cost_accounting",
    "topic": "factory_overhead_cost_note",
    "subtopic": "acc_classification",
    "skills": [
      "classify_accounting_concept"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "accounting",
    "year": 2025,
    "paper": "nov_p2",
    "type": "application"
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "3.1.1",
      "marks": 16,
      "clues": "- Allocate each cost between departments before adding it to the note.\n- Prepaid amounts are removed from the expense.",
      "approach": "- Work out the factory share of each item.\n- Add the items, including other factory expenses, but not advertising.",
      "solution": "1. Water and electricity: R915 000 × 75% = R686 250; insurance: R69 900 × 3/5 = R41 940.\n2. Rent: R240 400 × 2 525 ÷ 3 005 = R202 000; depreciation R652 800 (R45 600 + R607 200).\n3. Total factory overhead cost = R2 320 000 including other factory expenses of R737 010."
    },
    {
      "number": "3.1.2",
      "marks": 4,
      "clues": "- Cost of production = prime cost + factory overhead cost, adjusted for work-in-progress.",
      "approach": "- Add the opening work-in-progress and deduct the closing work-in-progress.",
      "solution": "1. R6 025 000 + R2 320 000 + (R125 000 − R93 000) = R8 377 000."
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
