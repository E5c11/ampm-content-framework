#!/usr/bin/env node
/**
 * DBE Accounting — November 2024 — Question 2.2: Cash flow statement — financing activities and cash (order 10)
 * Question 2.2 (financing activities and cash) — new shares issued, shares repurchased at the average share price plus the premium, the loan repaid, and the opening and closing cash and cash equivalents.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-accounting-2024-nov-p1-l10.js --curriculum temp/curriculum-vocab-accounting.json
 *   node scripts/add-accounting-2024-nov-p1-l10.js --dry-run
 *   node scripts/add-accounting-2024-nov-p1-l10.js
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
  "name": "Question 2.2: Cash flow statement — financing activities and cash",
  "syllabus": "dbe",
  "subject": "accounting",
  "year": 2024,
  "paper": "nov_p1",
  "order": 10,
  "content_tier": "free",
  "has_video": false,
  "xp": 9,
  "tags": [
    "financing_activities",
    "average_share_price",
    "cash_and_cash_equivalents"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2024/nov_p1/q10/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2024/nov_p1/q10/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2024/nov_p1/q10/memo_1.png"
  ],
  "exam_question_marks": 9,
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
      "-478800",
      "-592800",
      "-157600",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "unit": "cash_flow_statement",
    "topic": "cash_flow_financing_activities",
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
    "paper": "nov_p1",
    "type": "calc",
    "clues": "- Find the ASP after the new issue, then add the premium.\n- The capitalised interest is not a repayment of the loan.",
    "supplementary_material": {
      "type": "statement",
      "label": "Cash Flow Statement (extract): Eland Ltd",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/accounting/2024/nov_p1/q10/statement_1.png"
      ]
    }
  },
  {
    "name": "Question 2",
    "question": "Use the figure and your answer for C. Calculate cash and cash equivalents at the end of the year.",
    "metadata": [
      "Closing cash = R ",
      "[ ]"
    ],
    "answer": [
      "255150",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "unit": "cash_flow_statement",
    "topic": "cash_flow_financing_activities",
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
    "year": 2024,
    "paper": "nov_p1",
    "type": "calc",
    "supplementary_material": {
      "type": "statement",
      "label": "Cash Flow Statement (extract): Eland Ltd",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/accounting/2024/nov_p1/q10/statement_1.png"
      ]
    }
  },
  {
    "name": "Question 3",
    "question": "Loan instalments include interest. Why is the capitalised interest subtracted from the instalments to find the loan repaid?",
    "metadata": [
      "The interest was already shown as an investing outflow",
      "The interest is paid by shareholders, not by the company",
      "The interest part of each payment does not reduce the loan",
      "The interest is only payable once the whole loan has been settled",
      ""
    ],
    "answer": [
      "The interest part of each payment does not reduce the loan",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "cash_flow_statement",
    "topic": "cash_flow_financing_activities",
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
    "year": 2024,
    "paper": "nov_p1",
    "type": "application"
  },
  {
    "name": "Question 4",
    "question": "Select ALL the items shown under cash flow from financing activities.",
    "metadata": [
      "Interest paid on the loan",
      "Proceeds of shares issued",
      "Shares repurchased",
      "Loan repaid",
      "Fixed deposit invested"
    ],
    "answer": [
      "Proceeds of shares issued",
      "Shares repurchased",
      "Loan repaid",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "cash_flow_statement",
    "topic": "cash_flow_financing_activities",
    "subtopic": "acc_classification",
    "skills": [
      "classify_accounting_concept"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "accounting",
    "year": 2024,
    "paper": "nov_p1",
    "type": "application"
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "2.2",
      "marks": 9,
      "clues": "- 400 000 shares were issued at R10 after 1 200 000 shares (R8 160 000) were in issue; 34 000 were repurchased at R1,90 above the ASP.\n- Monthly instalments of R97 120 include interest; R685 440 interest was capitalised.",
      "approach": "- Find the ASP after the new issue, then the repurchase at ASP plus R1,90.\n- Subtract the capitalised interest from 12 instalments; work out opening cash from the bank and overdraft balances.",
      "solution": "1. New shares issued = 400 000 × R10 = R4 000 000.\n2. ASP = (R8 160 000 + R4 000 000) ÷ 1 600 000 = R7,60; shares repurchased = 34 000 × R7,60 + 34 000 × R1,90 = R258 400 + R64 600 = (R323 000).\n3. Loan repaid = (R97 120 × 12) – R685 440 = (R480 000).\n4. Opening cash = R36 000 – R142 680 = (R106 680); closing cash = –R106 680 + R296 460 = R189 780."
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
