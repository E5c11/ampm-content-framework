#!/usr/bin/env node
/**
 * DBE Accounting — November 2024 — Question 4.1.1–4.1.2: Direct material and direct labour cost (order 16)
 * Questions 4.1.1 and 4.1.2 — direct material cost with a wastage allowance, and direct labour cost adjusted for a resigned worker and overtime.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-accounting-2024-nov-p2-l16.js --curriculum temp/curriculum-vocab-accounting-2024-p2.json
 *   node scripts/add-accounting-2024-nov-p2-l16.js --dry-run
 *   node scripts/add-accounting-2024-nov-p2-l16.js
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
  "name": "Question 4.1.1–4.1.2: Direct material and direct labour cost",
  "syllabus": "dbe",
  "subject": "accounting",
  "year": 2024,
  "paper": "nov_p2",
  "order": 16,
  "content_tier": "free",
  "has_video": false,
  "xp": 11,
  "tags": [
    "direct_material_cost",
    "direct_labour_cost"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2024/nov_p2/q16/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2024/nov_p2/q16/memo_1.png"
  ],
  "exam_question_marks": 11,
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
      "-42000|42000",
      "14400",
      "1316400",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "unit": "cost_accounting",
    "topic": "direct_labour_cost",
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
    "year": 2024,
    "paper": "nov_p2",
    "type": "calc",
    "clues": "- Find the normal hourly rate first.\n- The resigned worker did not work for the last 3 months.\n- Overtime is paid at 1,5 times the normal rate.",
    "supplementary_material": {
      "type": "statement",
      "label": "Direct labour cost: Stone Benches",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/accounting/2024/nov_p2/q16/statement_1.png"
      ]
    }
  },
  {
    "name": "Question 2",
    "question": "Each bench needs 2,5 bags of concrete mix, and 8% extra is allowed for wastage. A bag costs R90. Calculate the direct material cost for 3 600 benches.",
    "metadata": [
      "Direct material cost = R ",
      "[ ]"
    ],
    "answer": [
      "874800",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "unit": "cost_accounting",
    "topic": "direct_material_cost",
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
    "year": 2024,
    "paper": "nov_p2",
    "type": "calc"
  },
  {
    "name": "Question 3",
    "question": "Each unit needs 2 kg of material, and 5% wastage is allowed. How much material is needed for 1 000 units?",
    "metadata": [
      "2 000 kg",
      "1 050 kg",
      "2 500 kg",
      "2 100 kg",
      ""
    ],
    "answer": [
      "2 100 kg",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "cost_accounting",
    "topic": "direct_material_cost",
    "subtopic": "acc_calculation",
    "skills": [
      "calculate_accounting_amount"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "accounting",
    "year": 2024,
    "paper": "nov_p2",
    "type": "calc"
  },
  {
    "name": "Question 4",
    "question": "Select ALL the costs that are part of direct labour cost.",
    "metadata": [
      "Salary of the factory foreman",
      "Wages of workers who make the product",
      "Salaries of the office staff",
      "Overtime paid to production workers",
      "Commission paid to sales staff"
    ],
    "answer": [
      "Wages of workers who make the product",
      "Overtime paid to production workers",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "cost_accounting",
    "topic": "direct_labour_cost",
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
    "paper": "nov_p2",
    "type": "application"
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "4.1.1",
      "marks": 4,
      "clues": "- Each pot needs 1,4 packets, plus 10% wastage.\n- The price stayed at R125 a packet.",
      "approach": "- Find the packets needed, add the wastage, and multiply by the price.",
      "solution": "1. 4 800 × 1,4 = 6 720 packets × 1,1 = 7 392 packets × R125 = R924 000."
    },
    {
      "number": "4.1.2",
      "marks": 7,
      "clues": "- The budget assumes 7 workers for a full year at the same rate.\n- A worker who resigned on 31 October did not work for the last 4 months.",
      "approach": "- Find the hourly rate: R1 117 200 ÷ 7 ÷ 1 680 hours = R95.\n- Deduct the resigned worker's unpaid months and add the overtime.",
      "solution": "1. Resigned worker: R1 117 200 × 4/84 = (R53 200).\n2. Overtime: 3 × 60 hours = 180 × R95 × 1,6 = R27 360.\n3. Direct labour cost = R1 117 200 − R53 200 + R27 360 = R1 091 360."
    }
  ],
  "model": "claude-opus-5-5",
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
