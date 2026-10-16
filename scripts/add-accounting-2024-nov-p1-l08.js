#!/usr/bin/env node
/**
 * DBE Accounting — November 2024 — Question 2.1: Retained income note (order 8)
 * Question 2.1 — the Retained Income Note: net profit after tax worked back from the dividend pay-out rate, the amount paid above the average share price on a repurchase, and the interim and final dividends.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-accounting-2024-nov-p1-l08.js --curriculum temp/curriculum-vocab-accounting.json
 *   node scripts/add-accounting-2024-nov-p1-l08.js --dry-run
 *   node scripts/add-accounting-2024-nov-p1-l08.js
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
  "name": "Question 2.1: Retained income note",
  "syllabus": "dbe",
  "subject": "accounting",
  "year": 2024,
  "paper": "nov_p1",
  "order": 8,
  "content_tier": "free",
  "has_video": false,
  "xp": 8,
  "tags": [
    "retained_income",
    "dividend_payout_rate",
    "share_repurchase"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2024/nov_p1/q8/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2024/nov_p1/q8/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2024/nov_p1/q8/memo_1.png"
  ],
  "exam_question_marks": 8,
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
      "1360000",
      "-120000|120000",
      "342000",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "unit": "company_financial_statements",
    "topic": "retained_income_note",
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
    "year": 2024,
    "paper": "nov_p1",
    "type": "calc",
    "clues": "- The pay-out rate compares the dividends for the year with net profit after tax.\n- Only the amount above the ASP comes out of retained income.",
    "supplementary_material": {
      "type": "statement",
      "label": "Retained Income Note: Eland Ltd",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/accounting/2024/nov_p1/q8/statement_1.png"
      ]
    }
  },
  {
    "name": "Question 2",
    "question": "Use the figure and your answers. Calculate the balance of retained income at the end of the year.",
    "metadata": [
      "Closing balance = R ",
      "[ ]"
    ],
    "answer": [
      "1470300",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "unit": "company_financial_statements",
    "topic": "retained_income_note",
    "subtopic": "acc_calculation",
    "skills": [
      "calculate_accounting_amount"
    ],
    "difficulty": 3,
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
      "label": "Retained Income Note: Eland Ltd",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/accounting/2024/nov_p1/q8/statement_1.png"
      ]
    }
  },
  {
    "name": "Question 3",
    "question": "Shares were repurchased above the average share price. Where is the amount paid above the ASP recorded?",
    "metadata": [
      "Deducted from ordinary share capital",
      "Shown as an operating expense",
      "Deducted from retained income",
      "Added to shareholders for dividends",
      ""
    ],
    "answer": [
      "Deducted from retained income",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "company_financial_statements",
    "topic": "retained_income_note",
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
    "year": 2024,
    "paper": "nov_p1",
    "type": "application"
  },
  {
    "name": "Question 4",
    "question": "Select ALL the items that appear in the Retained Income Note.",
    "metadata": [
      "New shares issued at the issue price",
      "Net profit after tax",
      "Amount paid above the ASP on repurchase",
      "Ordinary share dividends",
      "Provisional income tax paid"
    ],
    "answer": [
      "Net profit after tax",
      "Ordinary share dividends",
      "Amount paid above the ASP on repurchase",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "company_financial_statements",
    "topic": "retained_income_note",
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
      "number": "2.1",
      "marks": 8,
      "clues": "- Total dividends of R744 860 were 40% of net profit after tax.\n- 34 000 shares were repurchased at R1,90 above the average share price.",
      "approach": "- Divide the dividends by the pay-out rate to find net profit after tax.\n- Subtract the amount above the ASP and the dividends from the opening balance plus profit.",
      "solution": "1. Net profit after tax = R744 860 × 100/40 = R1 862 150.\n2. Repurchase of shares = 34 000 × R1,90 = R64 600 (subtracted).\n3. Dividends R744 860: interim R416 000 and final R328 860 (R744 860 – R416 000).\n4. Closing balance = R573 720 + R1 862 150 – R64 600 – R744 860 = R1 626 410."
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
