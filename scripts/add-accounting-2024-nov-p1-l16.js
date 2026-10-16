#!/usr/bin/env node
/**
 * DBE Accounting — November 2024 — Question 3.5–3.6: Repurchase proposal and the role of the CEO (order 16)
 * Questions 3.5 (last part) and 3.6 — why directors would reject a repurchase above the market price and NAV, the characteristics of a good CEO, and other indicators that show good management.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-accounting-2024-nov-p1-l16.js --curriculum temp/curriculum-vocab-accounting.json
 *   node scripts/add-accounting-2024-nov-p1-l16.js --dry-run
 *   node scripts/add-accounting-2024-nov-p1-l16.js
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
  "name": "Question 3.5–3.6: Repurchase proposal and the role of the CEO",
  "syllabus": "dbe",
  "subject": "accounting",
  "year": 2024,
  "paper": "nov_p1",
  "order": 16,
  "content_tier": "free",
  "has_video": false,
  "xp": 12,
  "tags": [
    "share_repurchase",
    "role_of_the_ceo",
    "liquidity_indicators"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2024/nov_p1/q16/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2024/nov_p1/q16/question_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2024/nov_p1/q16/question_3.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2024/nov_p1/q16/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2024/nov_p1/q16/memo_2.png"
  ],
  "exam_question_marks": 12,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Thandi wants Marula Ltd to buy back her shares at R11 each. Select the TWO reasons why the other directors would vote against it.",
    "metadata": [
      "R11 is below the 880 cents market price",
      "R11 is well above the 880 cents market price",
      "The company has no shares left to buy back",
      "R11 is far more than the NAV of 610 cents",
      "Thandi owns less than half of the shares"
    ],
    "answer": [
      "R11 is well above the 880 cents market price",
      "R11 is far more than the NAV of 610 cents",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "interpretation_of_financial_information",
    "topic": "share_repurchase_and_ethics",
    "subtopic": "acc_interpretation",
    "skills": [
      "interpret_financial_indicators"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "accounting",
    "year": 2024,
    "paper": "nov_p1",
    "type": "interpretation",
    "supplementary_material": {
      "type": "statement",
      "label": "Financial indicators: Marula Ltd",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/accounting/2024/nov_p1/q16/statement_1.png"
      ]
    }
  },
  {
    "name": "Question 2",
    "question": "By how many cents does a price of R11 per share exceed the 2025 NAV per share of Marula Ltd?",
    "metadata": [
      "Difference = ",
      "[ ]",
      " cents"
    ],
    "answer": [
      "490",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "unit": "interpretation_of_financial_information",
    "topic": "share_repurchase_and_ethics",
    "subtopic": "acc_calculation",
    "skills": [
      "calculate_accounting_amount"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "accounting",
    "year": 2024,
    "paper": "nov_p1",
    "type": "calc",
    "supplementary_material": {
      "type": "statement",
      "label": "Financial indicators: Marula Ltd",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/accounting/2024/nov_p1/q16/statement_1.png"
      ]
    }
  },
  {
    "name": "Question 3",
    "question": "Select the TWO characteristics shareholders would expect of a good CEO.",
    "metadata": [
      "Owns most of the company's shares",
      "Approves the audit report alone",
      "Sets and communicates a clear vision",
      "Acts ethically and with integrity",
      "Keeps information from the staff"
    ],
    "answer": [
      "Sets and communicates a clear vision",
      "Acts ethically and with integrity",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "interpretation_of_financial_information",
    "topic": "company_terms_and_roles",
    "subtopic": "acc_classification",
    "skills": [
      "classify_accounting_concept"
    ],
    "difficulty": 2,
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
    "question": "Apart from profit and returns, which point shows that the CEO manages Marula Ltd well?",
    "metadata": [
      "Acid-test ratio fell from 1,6 : 1 to 0,9 : 1, so debts can be met",
      "Acid-test ratio rose from 0,9 : 1 to 1,6 : 1, so debts can be met",
      "Current ratio rose to 2,2 : 1, so too much cash is now idle",
      "Solvency ratio fell from 3,2 : 1, so the position is stronger",
      ""
    ],
    "answer": [
      "Acid-test ratio rose from 0,9 : 1 to 1,6 : 1, so debts can be met",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "interpretation_of_financial_information",
    "topic": "interpreting_liquidity",
    "subtopic": "acc_interpretation",
    "skills": [
      "interpret_financial_indicators"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "accounting",
    "year": 2024,
    "paper": "nov_p1",
    "type": "interpretation",
    "supplementary_material": {
      "type": "statement",
      "label": "Financial indicators: Marula Ltd",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/accounting/2024/nov_p1/q16/statement_1.png"
      ]
    }
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "3.5",
      "marks": 4,
      "clues": "- Grant wants the company to buy his shares at R12 (1 200 cents).\n- Compare the price with the market price (950 cents) and NAV (564 cents); he holds 54%.",
      "approach": "- Give TWO points, each with figures.\n- Think about overpaying and about a majority shareholder enriching himself.",
      "solution": "1. R12 is above the market price of 950 cents (by 250 cents).\n2. R12 is above the NAV of 564 cents (by 636 cents); as a 54% majority shareholder he would be enriching himself."
    },
    {
      "number": "3.6",
      "marks": 8,
      "clues": "- Shareholders expect vision, transparency, ethics and sound financial management from a CEO.\n- Use indicators not quoted earlier: solvency, current and acid-test ratios.",
      "approach": "- Explain TWO qualities of a good CEO.\n- Quote TWO other indicators with figures and trends and explain each.",
      "solution": "1. A good CEO sets and communicates a clear vision, is transparent, and is committed to ethical practice (any two, explained).\n2. Solvency ratio improved from 2,8 : 1 to 3,8 : 1, so the financial position is stronger.\n3. Current ratio improved from 1,6 : 1 to 2,5 : 1 and the acid-test ratio from 1,2 : 1 to 1,9 : 1, so short-term debts can be paid."
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
