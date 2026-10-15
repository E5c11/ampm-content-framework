#!/usr/bin/env node
/**
 * DBE Accounting — November 2025 — Question 2.3: Net asset value per share and acid-test ratio (order 11)
 * Question 2.3 — net asset value per share and the acid-test ratio.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-accounting-2025-nov-p1-l11.js --curriculum temp/curriculum-vocab-accounting.json
 *   node scripts/add-accounting-2025-nov-p1-l11.js --dry-run
 *   node scripts/add-accounting-2025-nov-p1-l11.js
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
  "name": "Question 2.3: Net asset value per share and acid-test ratio",
  "syllabus": "dbe",
  "subject": "accounting",
  "year": 2025,
  "paper": "nov_p1",
  "order": 11,
  "content_tier": "free",
  "has_video": false,
  "xp": 8,
  "tags": [
    "net_asset_value_per_share",
    "acid_test_ratio"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p1/q11/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p1/q11/question_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p1/q11/question_3.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p1/q11/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p1/q11/memo_2.png"
  ],
  "exam_question_marks": 8,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Shareholders' equity is R6 480 000 and there are 540 000 shares in issue. Calculate the net asset value (NAV) per share.",
    "metadata": [
      "NAV per share = ",
      "[ ]",
      " cents"
    ],
    "answer": [
      "1200",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "unit": "financial_indicators",
    "topic": "financial_indicator_calculations",
    "subtopic": "acc_calculation",
    "skills": [
      "calculate_accounting_amount"
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
    "clues": "- Convert the answer from rand to cents."
  },
  {
    "name": "Question 2",
    "question": "Trade and other receivables are R1 530 000, cash and cash equivalents R30 000, and current liabilities R1 200 000. Calculate the acid-test ratio, as the first number of x : 1 to ONE decimal place.",
    "metadata": [
      "Acid-test ratio = ",
      "[ ]",
      " : 1"
    ],
    "answer": [
      "1.3",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "unit": "financial_indicators",
    "topic": "financial_indicator_calculations",
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
    "year": 2025,
    "paper": "nov_p1",
    "type": "calc"
  },
  {
    "name": "Question 3",
    "question": "Why are inventories left out of the acid-test ratio?",
    "metadata": [
      "They are not owned by the company at year-end",
      "They are shown as a non-current asset",
      "They are always sold below their cost price",
      "They cannot be turned into cash as quickly as debtors",
      ""
    ],
    "answer": [
      "They cannot be turned into cash as quickly as debtors",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "financial_indicators",
    "topic": "financial_indicator_calculations",
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
    "question": "Select ALL the items in the numerator of the acid-test ratio.",
    "metadata": [
      "Inventories held for resale",
      "Current liabilities of the company",
      "Trade and other receivables",
      "Cash and cash equivalents",
      "Fixed assets at carrying value"
    ],
    "answer": [
      "Trade and other receivables",
      "Cash and cash equivalents",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "financial_indicators",
    "topic": "financial_indicator_calculations",
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
    "year": 2025,
    "paper": "nov_p1",
    "type": "application"
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "2.3",
      "marks": 8,
      "clues": "- The formula sheet gives both formulae.\n- Net asset value per share is shown in cents.",
      "approach": "- Divide shareholders' equity by the number of shares and multiply by 100.\n- For the acid-test ratio, add receivables and cash, then divide by current liabilities.",
      "solution": "1. NAV per share = R7 140 120 ÷ 498 000 × 100 = 1 433,8 cents.\n2. Acid-test ratio = (R3 167 000 + R18 000) : (R1 609 380 + R775 000) = R3 185 000 : R2 384 380 = 1,3 : 1."
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
