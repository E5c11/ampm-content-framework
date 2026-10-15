#!/usr/bin/env node
/**
 * DBE Agricultural Sciences P2 — November 2025 — Question 3.5: Cash flow record (order 15)
 * Question 3.5 — reading a cash flow record, profit and closing balance, and the viability of the enterprise. Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-agricultural-sciences-2025-nov-p2-l15.js --curriculum temp/curriculum-vocab-agricultural-sciences.json
 *   node scripts/add-agricultural-sciences-2025-nov-p2-l15.js --dry-run
 *   node scripts/add-agricultural-sciences-2025-nov-p2-l15.js
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
  "name": "Question 3.5: Cash flow record",
  "syllabus": "dbe",
  "subject": "agricultural_sciences",
  "year": 2025,
  "paper": "nov_p2",
  "order": 15,
  "content_tier": "free",
  "has_video": false,
  "xp": 8,
  "tags": [
    "cash_flow_statement",
    "profit_and_loss",
    "closing_balance"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p2/q15/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p2/q15/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p2/q15/memo_2.png"
  ],
  "exam_question_marks": 8,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Use the cash flow record. Calculate the profit or loss for November (value B), in rand. []",
    "metadata": [
      "Profit (R): ",
      "[ ]"
    ],
    "answer": [
      "18200",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "type": "calc",
    "unit": "production_factors",
    "topic": "cash_flow_records",
    "subtopic": "agri_calculation",
    "skills": [
      "interpret_farm_finance"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- Profit is total income minus total expenses for the month.",
    "supplementary_material": {
      "type": "table",
      "label": "Cash flow record from August to November (illustrative)",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/agricultural_sciences/2025/nov_p2/q15/table_1.png"
      ]
    }
  },
  {
    "name": "Question 2",
    "question": "Use the cash flow record. Calculate the closing balance for November (value C), in rand. []",
    "metadata": [
      "Closing balance (R): ",
      "[ ]"
    ],
    "answer": [
      "71000",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "type": "calc",
    "unit": "production_factors",
    "topic": "cash_flow_records",
    "subtopic": "agri_calculation",
    "skills": [
      "interpret_farm_finance"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- The opening balance of November equals the closing balance of the previous month.\n- Add the profit for the month to the opening balance.",
    "supplementary_material": {
      "type": "table",
      "label": "Cash flow record from August to November (illustrative)",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/agricultural_sciences/2025/nov_p2/q15/table_1.png"
      ]
    }
  },
  {
    "name": "Question 3",
    "question": "A learner says the record is NOT an income statement. Which reason supports this statement?",
    "metadata": [
      "It lists all the income and expenses of the farm each month",
      "It has opening and closing balances an income statement lacks",
      "It covers a period of four months of the financial year",
      "It shows the profit or loss for every month of the record",
      ""
    ],
    "answer": [
      "It has opening and closing balances an income statement lacks",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "interpretation",
    "unit": "production_factors",
    "topic": "cash_flow_records",
    "subtopic": "agri_classification",
    "skills": [
      "classify_farm_concept"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- An income statement does not carry a balance that moves from month to month.",
    "supplementary_material": {
      "type": "table",
      "label": "Cash flow record from August to November (illustrative)",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/agricultural_sciences/2025/nov_p2/q15/table_1.png"
      ]
    }
  },
  {
    "name": "Question 4",
    "question": "Select ALL the reasons from the record that support the viability of the enterprise.",
    "metadata": [
      "The non-farm income is the largest item in each month",
      "The income is higher than the expenses every month",
      "The profit is positive in every month",
      "The closing balance grows from month to month",
      "The capital expenditure is zero in every month"
    ],
    "answer": [
      "The income is higher than the expenses every month",
      "The profit is positive in every month",
      "The closing balance grows from month to month",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "interpretation",
    "unit": "production_factors",
    "topic": "cash_flow_records",
    "subtopic": "agri_data_interpretation",
    "skills": [
      "interpret_farm_finance"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- A viable enterprise earns more than it spends.",
    "supplementary_material": {
      "type": "table",
      "label": "Cash flow record from August to November (illustrative)",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/agricultural_sciences/2025/nov_p2/q15/table_1.png"
      ]
    }
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "3.5.1",
      "marks": 2,
      "clues": "- Think about which items appear in a cash flow summary.\n- An income statement uses dates of transactions.",
      "approach": "- Compare the record with the components of an income statement.\n- Name one difference.",
      "solution": "1. The record has a cash flow summary with opening and closing balances, which are not components of an income statement, and it does not show the dates of transactions."
    },
    {
      "number": "3.5.2",
      "marks": 1,
      "clues": "- The opening balance of a month equals the previous closing balance.\n- Look at the June column.",
      "approach": "- Find the closing balance of June.\n- Use it as the opening balance of July.",
      "solution": "1. A is the opening balance of July, which equals the closing balance of June: R79 100."
    },
    {
      "number": "3.5.3",
      "marks": 4,
      "clues": "- Profit is total income minus total expenses.\n- Closing balance is opening balance plus profit.",
      "approach": "- Calculate B with the total income and total expenses for July.\n- Calculate C by adding B to the opening balance.",
      "solution": "1. B = R41 200 − R9 500 = R31 700.\n2. C = R79 100 + R31 700 = R110 800."
    },
    {
      "number": "3.5.4",
      "marks": 1,
      "clues": "- Compare income and expenses.\n- Look at the profit.",
      "approach": "- Check the profit for every month.\n- State one reason.",
      "solution": "1. The enterprise generates a profit (R31 700) and the income is higher than the expenses every month."
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
