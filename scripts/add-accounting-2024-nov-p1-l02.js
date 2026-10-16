#!/usr/bin/env node
/**
 * DBE Accounting — November 2024 — Question 1.1.3–1.1.4: Depreciation on vehicles and the trade-in (order 2)
 * Questions 1.1.3 and 1.1.4 — depreciation on vehicles (new vehicle, vehicle traded in, remaining vehicles) and the profit or loss on the vehicle traded in.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-accounting-2024-nov-p1-l02.js --curriculum temp/curriculum-vocab-accounting.json
 *   node scripts/add-accounting-2024-nov-p1-l02.js --dry-run
 *   node scripts/add-accounting-2024-nov-p1-l02.js
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
  "name": "Question 1.1.3–1.1.4: Depreciation on vehicles and the trade-in",
  "syllabus": "dbe",
  "subject": "accounting",
  "year": 2024,
  "paper": "nov_p1",
  "order": 2,
  "content_tier": "free",
  "has_video": false,
  "xp": 10,
  "tags": [
    "fixed_asset_depreciation",
    "asset_disposal",
    "fixed_asset_register"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2024/nov_p1/q2/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2024/nov_p1/q2/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2024/nov_p1/q2/memo_1.png"
  ],
  "exam_question_marks": 10,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Use the information in the figure to calculate the missing amount A.",
    "metadata": [
      "A = ",
      "[ ]"
    ],
    "answer": [
      "12240",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "unit": "company_financial_statements",
    "topic": "fixed_asset_depreciation",
    "subtopic": "acc_statement_completion",
    "skills": [
      "complete_financial_statement"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "accounting",
    "year": 2024,
    "paper": "nov_p1",
    "type": "calc",
    "clues": "- Use the carrying value at the start of the year.\n- Count the months from 1 March to the trade-in date.",
    "supplementary_material": {
      "type": "statement",
      "label": "Fixed Asset Register (extract): Kudu Ltd",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/accounting/2024/nov_p1/q2/statement_1.png"
      ]
    }
  },
  {
    "name": "Question 2",
    "question": "The vehicle in the figure was traded in for R104 000. What is the result on disposal?",
    "metadata": [
      "A profit of R6 160",
      "A loss of R6 160",
      "A loss of R18 400",
      "A profit of R6 080",
      ""
    ],
    "answer": [
      "A loss of R6 160",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "company_financial_statements",
    "topic": "fixed_asset_depreciation",
    "subtopic": "acc_calculation",
    "skills": [
      "calculate_accounting_amount"
    ],
    "difficulty": 4,
    "exam_weight": 3,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "accounting",
    "year": 2024,
    "paper": "nov_p1",
    "type": "calc",
    "supplementary_material": {
      "type": "statement",
      "label": "Fixed Asset Register (extract): Kudu Ltd",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/accounting/2024/nov_p1/q2/statement_1.png"
      ]
    }
  },
  {
    "name": "Question 3",
    "question": "Kudu Ltd bought a new vehicle for R350 000 on 1 September 2024. Depreciation on the vehicle traded in was R12 240 and on the remaining old vehicles R118 400. Depreciation is 20% p.a. on the diminishing-balance method. Calculate the total depreciation on vehicles for the year ended 28 February 2025.",
    "metadata": [
      "Depreciation = R ",
      "[ ]"
    ],
    "answer": [
      "165640",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "unit": "company_financial_statements",
    "topic": "fixed_asset_depreciation",
    "subtopic": "acc_calculation",
    "skills": [
      "calculate_accounting_amount"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "accounting",
    "year": 2024,
    "paper": "nov_p1",
    "type": "calc"
  },
  {
    "name": "Question 4",
    "question": "Arrange the steps to find the profit or loss on a vehicle traded in.",
    "metadata": [
      "Subtract total accumulated depreciation from cost",
      "Find the accumulated depreciation at the last year end",
      "Compare the carrying value with the trade-in value",
      "Calculate depreciation up to the date of disposal"
    ],
    "answer": [
      "Find the accumulated depreciation at the last year end",
      "Calculate depreciation up to the date of disposal",
      "Subtract total accumulated depreciation from cost",
      "Compare the carrying value with the trade-in value"
    ],
    "presentation": "ordering",
    "unit": "company_financial_statements",
    "topic": "fixed_asset_depreciation",
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
    "year": 2024,
    "paper": "nov_p1",
    "type": "ordering"
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "1.1.3",
      "marks": 5,
      "clues": "- Three parts make up the depreciation on vehicles: the new vehicle, the vehicle traded in and the remaining vehicles.\n- The new vehicle and the old vehicle were each used for six months of the year.",
      "approach": "- Use 6/12 of a year for both the new vehicle and the vehicle traded in.\n- For the diminishing-balance method, apply the rate to the carrying value.",
      "solution": "1. New vehicle: R320 000 × 20% × 6/12 = R32 000.\n2. Vehicle traded in: (R240 000 – R73 600) × 20% × 6/12 = R166 400 × 10% = R16 640.\n3. Total = R32 000 + R16 640 + R132 720 = R181 360."
    },
    {
      "number": "1.1.4",
      "marks": 5,
      "clues": "- The accumulated depreciation at the trade-in date includes this year's R16 640.\n- Compare the carrying value with the trade-in value received.",
      "approach": "- Add this year's depreciation to the accumulated depreciation at the last year end.\n- Subtract it from the cost, then compare the result with the trade-in value.",
      "solution": "1. Accumulated depreciation = R73 600 + R16 640 = R90 240.\n2. Carrying value = R240 000 – R90 240 = R149 760.\n3. Trade-in value R153 660 – R149 760 = R3 900 profit on the vehicle traded in."
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
