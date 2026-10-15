#!/usr/bin/env node
/**
 * DBE Accounting — November 2025 — Question 3.1–3.2.2: Company terms, pricing policy and liquidity (order 13)
 * Questions 3.1, 3.2.1 and 3.2.2 — company terms (IFRS, director, CIPC), and quoting indicators with trends for pricing policy and credit policy.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-accounting-2025-nov-p1-l13.js --curriculum temp/curriculum-vocab-accounting.json
 *   node scripts/add-accounting-2025-nov-p1-l13.js --dry-run
 *   node scripts/add-accounting-2025-nov-p1-l13.js
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
  "name": "Question 3.1–3.2.2: Company terms, pricing policy and liquidity",
  "syllabus": "dbe",
  "subject": "accounting",
  "year": 2025,
  "paper": "nov_p1",
  "order": 13,
  "content_tier": "free",
  "has_video": false,
  "xp": 11,
  "tags": [
    "company_terms",
    "pricing_policy_indicators",
    "credit_policy_liquidity"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p1/q13/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p1/q13/question_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p1/q13/question_3.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p1/q13/question_4.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p1/q13/memo_1.png"
  ],
  "exam_question_marks": 11,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Match each company term to its description.",
    "metadata": [
      "A - IFRS",
      "B - CIPC",
      "C - Director",
      "D - Internal auditor",
      "1 - Registers companies and keeps their records",
      "2 - Elected to run the company and apply its policy",
      "3 - Checks internal controls and reports on them",
      "4 - Guidelines that keep financial statements consistent"
    ],
    "answer": [
      "A-4",
      "B-1",
      "C-2",
      "D-3"
    ],
    "presentation": "match",
    "unit": "interpretation_of_financial_information",
    "topic": "company_terms_and_roles",
    "subtopic": "acc_term_recall",
    "skills": [
      "recall_accounting_term"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "accounting",
    "year": 2025,
    "paper": "nov_p1",
    "type": "definition"
  },
  {
    "name": "Question 2",
    "question": "The CEO of Marlin Ltd says the company's pricing policy is well managed. Select the TWO indicators that support this.",
    "metadata": [
      "The debtors' collection period fell from 39 days to 28 days",
      "Sales grew from R44 m to R60 m",
      "The creditors' payment period rose from 62 days to 75 days",
      "% net profit after tax on sales rose from 17% to 21,5%",
      "The current ratio improved from 1,9 : 1 to 2,1 : 1"
    ],
    "answer": [
      "Sales grew from R44 m to R60 m",
      "% net profit after tax on sales rose from 17% to 21,5%",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "interpretation_of_financial_information",
    "topic": "interpreting_operating_efficiency",
    "subtopic": "acc_interpretation",
    "skills": [
      "interpret_financial_indicators"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "accounting",
    "year": 2025,
    "paper": "nov_p1",
    "type": "interpretation",
    "supplementary_material": {
      "type": "statement",
      "label": "Financial indicators: Marlin Ltd",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/accounting/2025/nov_p1/q13/statement_1.png"
      ]
    }
  },
  {
    "name": "Question 3",
    "question": "The credit policy of Marlin Ltd improved its liquidity. Select the TWO indicators that show this.",
    "metadata": [
      "The current ratio improved from 1,9 : 1 to 2,1 : 1",
      "The mark-up % decreased from 55% to 40% this year",
      "The debtors' collection period fell from 39 to 28 days",
      "The creditors' payment period rose from 62 to 75 days",
      "Sales grew from R44 m to R60 m during the year"
    ],
    "answer": [
      "The debtors' collection period fell from 39 to 28 days",
      "The creditors' payment period rose from 62 to 75 days",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "interpretation_of_financial_information",
    "topic": "interpreting_liquidity",
    "subtopic": "acc_interpretation",
    "skills": [
      "interpret_financial_indicators"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "accounting",
    "year": 2025,
    "paper": "nov_p1",
    "type": "interpretation",
    "supplementary_material": {
      "type": "statement",
      "label": "Financial indicators: Marlin Ltd",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/accounting/2025/nov_p1/q13/statement_1.png"
      ]
    }
  },
  {
    "name": "Question 4",
    "question": "By how many days did the debtors' collection period of Marlin Ltd improve?",
    "metadata": [
      "Improvement = ",
      "[ ]",
      " days"
    ],
    "answer": [
      "11",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "unit": "interpretation_of_financial_information",
    "topic": "interpreting_liquidity",
    "subtopic": "acc_calculation",
    "skills": [
      "calculate_accounting_amount"
    ],
    "difficulty": 1,
    "exam_weight": 1,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "accounting",
    "year": 2025,
    "paper": "nov_p1",
    "type": "reading",
    "supplementary_material": {
      "type": "statement",
      "label": "Financial indicators: Marlin Ltd",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/accounting/2025/nov_p1/q13/statement_1.png"
      ]
    }
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "3.1",
      "marks": 3,
      "clues": "- Each description matches one body or role in a company.\n- The financial statements follow international standards.",
      "approach": "- Read each description and link it to the list of terms.\n- Check who runs the company and who registers it.",
      "solution": "1. 1.1: International Financial Reporting Standards (IFRS) are the guidelines for preparing consistent financial statements.\n2. 1.2: A director is an elected board member who runs the company and applies its policy.\n3. 1.3: The Companies and Intellectual Properties Commission (CIPC) maintains company records and controls registration."
    },
    {
      "number": "3.2.1",
      "marks": 4,
      "clues": "- Choose indicators about price and profit, not expenses.\n- Quote each indicator with its trend.",
      "approach": "- Look at mark-up %, net profit after tax on sales and sales.\n- Give the previous and current figures.",
      "solution": "1. The mark-up % decreased from 65% to 50%, so prices were lower.\n2. The % net profit after tax on sales increased from 22% to 26,4%.\n3. Sales improved from R48 m to R77 m (any two indicators earn the marks)."
    },
    {
      "number": "3.2.2",
      "marks": 4,
      "clues": "- The credit policy covers how fast debtors pay and how long creditors wait.\n- Do not use the current ratio or acid-test ratio.",
      "approach": "- Look at the debtors' collection period and the creditors' payment period.\n- Say how each trend improves liquidity.",
      "solution": "1. The debtors' collection period improved from 42 days to 31 days, so cash is received sooner.\n2. The creditors' payment period improved from 71 days to 90 days, so cash is kept longer."
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
