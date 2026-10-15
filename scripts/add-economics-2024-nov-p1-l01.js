#!/usr/bin/env node
/**
 * DBE Economics P1 — November 2024 — Question 1.1.1–1.1.4: Markets, indicators, deficit and trade (order 1)
 * Lesson 1 of 2024 Nov P1 (DESIGN-UNI-14: 4 practice questions). Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2024-nov-p1-l01.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2024-nov-p1-l01.js --dry-run
 *   node scripts/add-economics-2024-nov-p1-l01.js
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

// ─── Phase 2 — lesson document ───────────────────────────────────────────────

const video = {
  "name": "Question 1.1.1–1.1.4: Markets, indicators, deficit and trade",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2024,
  "paper": "nov_p1",
  "order": 1,
  "content_tier": "free",
  "has_video": false,
  "xp": 10,
  "tags": [
    "financial_markets",
    "leading_indicators",
    "fiscal_policy",
    "international_trade"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p1/q1/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p1/q1/memo_1.png"
  ],
  "exam_question_marks": 8,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "A household places money in a 90-day fixed deposit at a bank, and a business borrows money for six months to pay its suppliers. On which market are these short-term funds traded?",
    "metadata": [
      "Capital market",
      "Money market",
      "Factor market",
      "Foreign exchange market",
      ""
    ],
    "answer": [
      "Money market",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "circular_flow",
    "topic": "financial_markets",
    "subtopic": "econ_classification",
    "skills": [
      "classify_economic_concept"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Look at the length of the savings and loans described.\n- Long-term funds are traded elsewhere, and so are foreign currencies."
  },
  {
    "name": "Question 2",
    "question": "Select ALL the leading indicators of the business cycle.",
    "metadata": [
      "Job advertisements",
      "Unemployment rate",
      "Building plans approved",
      "Consumer price index (CPI)",
      "Business confidence index"
    ],
    "answer": [
      "Job advertisements",
      "Building plans approved",
      "Business confidence index",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "definition",
    "unit": "business_cycles",
    "topic": "cycle_indicators",
    "subtopic": "econ_term_definition",
    "skills": [
      "define_economic_term"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- A leading indicator turns before the rest of the economy does.\n- Ask which items reflect plans and expectations rather than results already visible."
  },
  {
    "name": "Question 3",
    "question": "A country has an export price index of 135 and an import price index of 90. Calculate the terms of trade (index): []",
    "metadata": [
      "Terms of trade = ",
      "[ ]"
    ],
    "answer": [
      "150",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "type": "calc",
    "unit": "foreign_exchange_and_bop",
    "topic": "terms_of_trade",
    "subtopic": "econ_calculation",
    "skills": [
      "apply_economic_formula"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Express the export prices as a percentage of the import prices.\n- Divide one index by the other and multiply by 100."
  },
  {
    "name": "Question 4",
    "question": "The deficit rule limits the shortfall on the government budget to 3% of gross domestic product (GDP). If GDP is R5 000 billion, what is the largest budget deficit allowed?",
    "metadata": [
      "R15 billion",
      "R300 billion",
      "R150 billion",
      "R1 500 billion",
      ""
    ],
    "answer": [
      "R150 billion",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "calc",
    "unit": "public_sector",
    "topic": "fiscal_and_monetary_policy",
    "subtopic": "econ_calculation",
    "skills": [
      "apply_economic_formula"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Find 3% of the GDP figure.\n- Check that your answer is a small slice of GDP, not a large share of it."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "1.1.1",
      "marks": 2,
      "clues": "- Think about how long the savings and loans in the question are held.",
      "approach": "- Link short-term funds to the market that trades them.",
      "solution": "1. Short-term savings and loans are traded on the money market, so the answer is D.\n2. The capital market trades long-term funds, the foreign exchange market trades currencies and the factor market trades resources."
    },
    {
      "number": "1.1.2",
      "marks": 2,
      "clues": "- Ask whether advertising space for jobs moves before or after the economy turns.",
      "approach": "- Job adverts reflect employers' expectations of growth.",
      "solution": "1. Job advertising space changes before the business cycle turns, so it is a leading indicator (C).\n2. Lagging indicators change after the cycle; coincident ones change with it; a composite combines several."
    },
    {
      "number": "1.1.3",
      "marks": 2,
      "clues": "- Recall the percentage of GDP that a budget shortfall may reach.",
      "approach": "- Match the deficit rule to its limit.",
      "solution": "1. The deficit rule states that budget shortages should not exceed 3% of GDP (B).\n2. The other percentages are not the limit set by the rule."
    },
    {
      "number": "1.1.4",
      "marks": 2,
      "clues": "- Compare export prices with import prices.",
      "approach": "- Name the ratio of the two price indices.",
      "solution": "1. The ratio of the export price index to the import price index is the terms of trade (C).\n2. The trade balance and exchange rate are different measures."
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
