#!/usr/bin/env node
/**
 * DBE Accounting — November 2025 — Question 3.3.1: Returns and dividend pay-out policy (order 15)
 * Question 3.3.1 — comparing the % return on shareholders' equity with a fixed deposit, and comparing dividend pay-out policies.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-accounting-2025-nov-p1-l15.js --curriculum temp/curriculum-vocab-accounting.json
 *   node scripts/add-accounting-2025-nov-p1-l15.js --dry-run
 *   node scripts/add-accounting-2025-nov-p1-l15.js
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
  "name": "Question 3.3.1: Returns and dividend pay-out policy",
  "syllabus": "dbe",
  "subject": "accounting",
  "year": 2025,
  "paper": "nov_p1",
  "order": 15,
  "content_tier": "free",
  "has_video": false,
  "xp": 8,
  "tags": [
    "return_on_shareholders_equity",
    "dividend_payout_policy"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p1/q15/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p1/q15/question_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p1/q15/question_3.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p1/q15/question_4.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p1/q15/memo_1.png"
  ],
  "exam_question_marks": 8,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Select the TWO correct statements about the % return on shareholders' equity.",
    "metadata": [
      "Sable's return of 17,4% is less than the 6,8% earned on a fixed deposit",
      "Marlin's return of 5% is less than the 6,8% earned on a fixed deposit",
      "Marlin's return of 5% is better than Sable's return of 17,4%",
      "Sable's return of 17,4% is more than the 6,8% earned on a fixed deposit",
      "Both companies earn less than a fixed deposit would pay"
    ],
    "answer": [
      "Marlin's return of 5% is less than the 6,8% earned on a fixed deposit",
      "Sable's return of 17,4% is more than the 6,8% earned on a fixed deposit",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "interpretation_of_financial_information",
    "topic": "interpreting_returns_and_dividends",
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
    "year": 2025,
    "paper": "nov_p1",
    "type": "interpretation",
    "supplementary_material": {
      "type": "table",
      "label": "Financial indicators for 2026",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/accounting/2025/nov_p1/q15/table_1.png"
      ]
    }
  },
  {
    "name": "Question 2",
    "question": "Which statement describes the dividend policy of Marlin Ltd?",
    "metadata": [
      "It kept more than half of its earnings for future expansion",
      "It paid out less than half of its earnings to shareholders",
      "It paid no dividends because its profit was too low",
      "It paid out more than it earned and kept no profit for growth",
      ""
    ],
    "answer": [
      "It paid out more than it earned and kept no profit for growth",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "interpretation_of_financial_information",
    "topic": "interpreting_returns_and_dividends",
    "subtopic": "acc_interpretation",
    "skills": [
      "interpret_financial_indicators"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "accounting",
    "year": 2025,
    "paper": "nov_p1",
    "type": "interpretation",
    "supplementary_material": {
      "type": "table",
      "label": "Financial indicators for 2026",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/accounting/2025/nov_p1/q15/table_1.png"
      ]
    }
  },
  {
    "name": "Question 3",
    "question": "How many cents of earnings per share did Sable Ltd retain?",
    "metadata": [
      "Retained = ",
      "[ ]",
      " cents"
    ],
    "answer": [
      "225",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "unit": "interpretation_of_financial_information",
    "topic": "interpreting_returns_and_dividends",
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
    "year": 2025,
    "paper": "nov_p1",
    "type": "calc",
    "supplementary_material": {
      "type": "table",
      "label": "Financial indicators for 2026",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/accounting/2025/nov_p1/q15/table_1.png"
      ]
    }
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "3.3.1",
      "marks": 8,
      "clues": "- Compare each company's return with the interest on a fixed deposit.\n- Dividends per share and earnings per share show how much of the profit is paid out.",
      "approach": "- Quote the % return and the trend for one company, then comment on it.\n- For pay-out policy, compare the pay-out rates and what is retained.",
      "solution": "1. Shorts Ltd: the % return on shareholders' equity decreased from 14,7% to 6%, which is less than the fixed deposit rate of 7,1%.\n2. Lynn Ltd: the return increased from 14,5% to 16,1%, above its fixed deposit rate of 6,7%.\n3. Lynn kept 46,1% of its earnings (235c of 510c) for expansion, while Shorts paid out 124,6% of its earnings."
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
