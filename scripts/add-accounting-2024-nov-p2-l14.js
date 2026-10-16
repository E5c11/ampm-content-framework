#!/usr/bin/env node
/**
 * DBE Accounting — November 2024 — Question 3.2.2 (iii)–(v): Equipment deposit, insurance and salaries (order 14)
 * Question 3.2.2 (iii)–(v) — the deposit on equipment bought on instalments, insurance after a premium increase, and salaries before a December bonus.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-accounting-2024-nov-p2-l14.js --curriculum temp/curriculum-vocab-accounting-2024-p2.json
 *   node scripts/add-accounting-2024-nov-p2-l14.js --dry-run
 *   node scripts/add-accounting-2024-nov-p2-l14.js
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
  "name": "Question 3.2.2 (iii)–(v): Equipment deposit, insurance and salaries",
  "syllabus": "dbe",
  "subject": "accounting",
  "year": 2024,
  "paper": "nov_p2",
  "order": 14,
  "content_tier": "free",
  "has_video": false,
  "xp": 9,
  "tags": [
    "budgeted_expenses",
    "employee_remuneration"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2024/nov_p2/q14/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2024/nov_p2/q14/question_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2024/nov_p2/q14/question_3.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2024/nov_p2/q14/memo_1.png"
  ],
  "exam_question_marks": 9,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Use the information in the figure to calculate the amounts A, B and C.",
    "metadata": [
      "A = ",
      "[ ]",
      "   B = ",
      "[ ]",
      "   C = ",
      "[ ]"
    ],
    "answer": [
      "50400",
      "16150",
      "96000",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "unit": "budgeting",
    "topic": "cash_budget_calculations",
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
    "clues": "- The instalments repay 75% of the cost.\n- Only the vehicle premium increases.\n- December salaries include the bonuses.",
    "supplementary_material": {
      "type": "statement",
      "label": "Cash Budget extract: Spares Hub",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/accounting/2024/nov_p2/q14/statement_1.png"
      ]
    }
  },
  {
    "name": "Question 2",
    "question": "Six employees earn the same monthly salary. In December, four of them receive a bonus of 50% of a monthly salary. December salaries total R115 200. Calculate one employee's normal monthly salary.",
    "metadata": [
      "Monthly salary = R ",
      "[ ]"
    ],
    "answer": [
      "14400",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "unit": "budgeting",
    "topic": "cash_budget_calculations",
    "subtopic": "acc_calculation",
    "skills": [
      "calculate_accounting_amount"
    ],
    "difficulty": 4,
    "exam_weight": 2,
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
    "question": "Equipment is bought with a 20% deposit and the balance in 36 equal instalments of R5 000. What is the deposit?",
    "metadata": [
      "R36 000",
      "R180 000",
      "R225 000",
      "R45 000",
      ""
    ],
    "answer": [
      "R45 000",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "budgeting",
    "topic": "cash_budget_calculations",
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
    "paper": "nov_p2",
    "type": "calc"
  },
  {
    "name": "Question 4",
    "question": "Match each payment to how it is worked out in this scenario.",
    "metadata": [
      "A - Deposit on the equipment",
      "B - Monthly instalment",
      "C - December bonus",
      "D - New vehicle premium",
      "1 - Balance ÷ 24 months",
      "2 - 50% of one salary",
      "3 - Old premium × 125%",
      "4 - 25% of the full cost"
    ],
    "answer": [
      "A-4",
      "B-1",
      "C-2",
      "D-3"
    ],
    "presentation": "match",
    "unit": "budgeting",
    "topic": "cash_budget_calculations",
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
      "number": "3.2.2 (iii)",
      "marks": 3,
      "clues": "- 36 instalments of R9 800 repay 80% of the cost.",
      "approach": "- Find the balance, then the deposit as 20/80 of it.",
      "solution": "1. R9 800 × 36 = R352 800 × 20/80 = R88 200 (or R441 000 × 20%)."
    },
    {
      "number": "3.2.2 (iv)",
      "marks": 3,
      "clues": "- Only the R4 500 premium on the computers increases, by 28%.",
      "approach": "- Add the increase to November's insurance.",
      "solution": "1. R17 500 + (R4 500 × 28%) R1 260 = R18 760."
    },
    {
      "number": "3.2.2 (v)",
      "marks": 3,
      "clues": "- December salaries include a 70% bonus for 5 of the 9 employees, i.e. 12,5 salaries.",
      "approach": "- Find one salary, then multiply by 9.",
      "solution": "1. R143 750 ÷ 12,5 = R11 500 × 9 = R103 500 (or R143 750 − R40 250)."
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
