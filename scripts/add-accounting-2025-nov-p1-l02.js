#!/usr/bin/env node
/**
 * DBE Accounting — November 2025 — Question 1.2: Ordinary share capital note (order 2)
 * Question 1.2 — the Ordinary Share Capital note: shares in issue at the beginning, shares issued, shares repurchased at the average share price (ASP), and shares in issue at the end.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-accounting-2025-nov-p1-l02.js --curriculum temp/curriculum-vocab-accounting.json
 *   node scripts/add-accounting-2025-nov-p1-l02.js --dry-run
 *   node scripts/add-accounting-2025-nov-p1-l02.js
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
  "name": "Question 1.2: Ordinary share capital note",
  "syllabus": "dbe",
  "subject": "accounting",
  "year": 2025,
  "paper": "nov_p1",
  "order": 2,
  "content_tier": "free",
  "has_video": false,
  "xp": 8,
  "tags": [
    "ordinary_share_capital_note",
    "share_repurchase",
    "average_share_price"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p1/q2/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p1/q2/question_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p1/q2/question_3.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p1/q2/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p1/q2/memo_2.png"
  ],
  "exam_question_marks": 8,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "The Ordinary Share Capital note of Kestrel Ltd is shown. The shares in issue at the end of the year and the amounts for the repurchase are correct. A is a number of shares and B is an amount in rand. Calculate the missing amounts.",
    "metadata": [
      "A = ",
      "[ ]",
      "   B = ",
      "[ ]"
    ],
    "answer": [
      "1600000",
      "2800000",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "unit": "company_financial_statements",
    "topic": "share_capital_note",
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
    "year": 2025,
    "paper": "nov_p1",
    "type": "calc",
    "clues": "- Work backwards from the closing balances.\n- Add back what was repurchased and subtract what was issued.",
    "supplementary_material": {
      "type": "table",
      "label": "Ordinary Share Capital Note: Kestrel Ltd",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/accounting/2025/nov_p1/q2/table_1.png"
      ]
    }
  },
  {
    "name": "Question 2",
    "question": "Mabu Ltd had 2 000 000 ordinary shares in issue and share capital of R9 000 000 at the beginning of the year. During the year 500 000 new shares were issued for R4 000 000. Calculate the average share price (ASP) at which a share repurchase after the issue will be recorded.",
    "metadata": [
      "ASP = R ",
      "[ ]",
      " per share"
    ],
    "answer": [
      "5.2",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "unit": "company_financial_statements",
    "topic": "share_capital_note",
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
    "year": 2025,
    "paper": "nov_p1",
    "type": "calc",
    "clues": "- Use all the shares in issue and all the share capital after the new issue."
  },
  {
    "name": "Question 3",
    "question": "At what value is a share repurchase recorded in the Ordinary Share Capital note?",
    "metadata": [
      "The price the company paid to the shareholders",
      "The issue price of the most recent new shares",
      "The average price of all shares in issue",
      "The market price quoted on the JSE that day",
      ""
    ],
    "answer": [
      "The average price of all shares in issue",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "company_financial_statements",
    "topic": "share_capital_note",
    "subtopic": "acc_term_recall",
    "skills": [
      "recall_accounting_term"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "accounting",
    "year": 2025,
    "paper": "nov_p1",
    "type": "definition"
  },
  {
    "name": "Question 4",
    "question": "A company repurchases shares for more than the average share price. Select ALL the correct effects.",
    "metadata": [
      "Share capital decreases by the full price paid to shareholders",
      "The number of shares in issue decreases",
      "Share capital decreases by the ASP of the shares bought back",
      "The extra amount paid above the ASP is deducted from retained income",
      "Retained income increases by the extra amount paid"
    ],
    "answer": [
      "The number of shares in issue decreases",
      "Share capital decreases by the ASP of the shares bought back",
      "The extra amount paid above the ASP is deducted from retained income",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "company_financial_statements",
    "topic": "share_capital_note",
    "subtopic": "acc_classification",
    "skills": [
      "classify_accounting_concept"
    ],
    "difficulty": 4,
    "exam_weight": 3,
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
      "number": "1.2",
      "marks": 8,
      "clues": "- The closing balances are given, so work backwards to the opening and issue figures.\n- Repurchased shares are recorded at the average share price (ASP).",
      "approach": "- Find the opening number of shares from the closing number, the issue and the repurchase.\n- Find the amount issued from the change in share capital, then calculate the ASP and the repurchase amount.",
      "solution": "1. Shares in issue at the beginning: 2 750 000 – 750 000 + 150 000 = 2 150 000 shares; the opening amount is R11 395 000.\n2. Shares issued: R17 875 000 – R11 395 000 + R975 000 = R7 455 000 for 750 000 shares.\n3. ASP = (R11 395 000 + R7 455 000) ÷ (2 150 000 + 750 000) = R6,50 per share.\n4. Shares repurchased: 150 000 × R6,50 = R975 000, recorded as a negative; shares in issue at the end = 2 750 000 shares and R17 875 000."
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
