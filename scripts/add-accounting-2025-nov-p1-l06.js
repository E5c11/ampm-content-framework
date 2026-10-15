#!/usr/bin/env node
/**
 * DBE Accounting — November 2025 — Question 1.3: Statement of Financial Position — liabilities (order 6)
 * Question 1.3 (liabilities) — the mortgage loan split into current and non-current portions, trade and other payables, shareholders for dividends and the bank overdraft.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-accounting-2025-nov-p1-l06.js --curriculum temp/curriculum-vocab-accounting.json
 *   node scripts/add-accounting-2025-nov-p1-l06.js --dry-run
 *   node scripts/add-accounting-2025-nov-p1-l06.js
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
  "name": "Question 1.3: Statement of Financial Position — liabilities",
  "syllabus": "dbe",
  "subject": "accounting",
  "year": 2025,
  "paper": "nov_p1",
  "order": 6,
  "content_tier": "free",
  "has_video": false,
  "xp": 14,
  "tags": [
    "mortgage_loan",
    "current_portion_of_loan",
    "shareholders_for_dividends"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p1/q6/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p1/q6/question_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p1/q6/question_3.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p1/q6/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p1/q6/memo_2.png"
  ],
  "exam_question_marks": 14,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Use the information in the figure to calculate the missing amounts A and B in the statement.",
    "metadata": [
      "A = ",
      "[ ]",
      "   B = ",
      "[ ]"
    ],
    "answer": [
      "2220000",
      "180000",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "unit": "company_financial_statements",
    "topic": "statement_of_financial_position",
    "subtopic": "acc_statement_completion",
    "skills": [
      "complete_financial_statement"
    ],
    "difficulty": 4,
    "exam_weight": 3,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "accounting",
    "year": 2025,
    "paper": "nov_p1",
    "type": "calc",
    "clues": "- The current portion is the capital repaid within the next year.\n- Repayments include interest.",
    "supplementary_material": {
      "type": "statement",
      "label": "Statement of Financial Position (extract): Wren Ltd",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/accounting/2025/nov_p1/q6/statement_1.png"
      ]
    }
  },
  {
    "name": "Question 2",
    "question": "The directors declared a final dividend of 45 cents per share on 3 200 000 ordinary shares in issue. Calculate the amount for shareholders for dividends.",
    "metadata": [
      "Shareholders for dividends = R ",
      "[ ]"
    ],
    "answer": [
      "1440000",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "unit": "company_financial_statements",
    "topic": "statement_of_financial_position",
    "subtopic": "acc_calculation",
    "skills": [
      "calculate_accounting_amount"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "accounting",
    "year": 2025,
    "paper": "nov_p1",
    "type": "calc"
  },
  {
    "name": "Question 3",
    "question": "A company received rent for the first two months of the next financial year. How is this amount shown?",
    "metadata": [
      "A current asset within trade and other receivables",
      "A current liability within trade and other payables",
      "A non-current liability within the mortgage loan",
      "Part of retained income within shareholders' equity",
      ""
    ],
    "answer": [
      "A current liability within trade and other payables",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "company_financial_statements",
    "topic": "statement_of_financial_position",
    "subtopic": "acc_classification",
    "skills": [
      "classify_accounting_concept"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "accounting",
    "year": 2025,
    "paper": "nov_p1",
    "type": "application"
  },
  {
    "name": "Question 4",
    "question": "Select ALL the items that are current liabilities.",
    "metadata": [
      "The part of the loan repayable after four years",
      "A bank overdraft",
      "The part of the loan repayable within the next year",
      "Shareholders for dividends",
      "Retained income"
    ],
    "answer": [
      "The part of the loan repayable within the next year",
      "Shareholders for dividends",
      "A bank overdraft",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "company_financial_statements",
    "topic": "statement_of_financial_position",
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
    "paper": "nov_p1",
    "type": "application"
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "1.3",
      "marks": 14,
      "clues": "- Repayments of R45 000 a month include interest, and next year's interest is given.\n- Rent received in advance and the transfer of the debtor's overpayment both increase what the company owes.",
      "approach": "- Work out the capital repaid next year, which is the current portion.\n- Build up payables, the dividend and the overdraft from the information.",
      "solution": "1. Current portion of the loan = R45 000 × 12 – R290 000 = R250 000; non-current loan = R3 200 000 – R250 000 = R2 950 000.\n2. Trade and other payables = R878 500 + R5 000 (transfer) + R77 000 (rent received in advance) = R960 500.\n3. Shareholders for dividends = 2 750 000 × 90c = R2 475 000, and the bank overdraft is the balancing figure of R774 500."
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
