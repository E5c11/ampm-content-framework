#!/usr/bin/env node
/**
 * DBE Accounting — November 2024 — Question 1.3: Debtors' age analysis (order 4)
 * Question 1.3 — using the age analysis to test the 90% target for credit terms, and advice to improve collection from debtors.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-accounting-2024-nov-p2-l04.js --curriculum temp/curriculum-vocab-accounting-2024-p2.json
 *   node scripts/add-accounting-2024-nov-p2-l04.js --dry-run
 *   node scripts/add-accounting-2024-nov-p2-l04.js
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
  "name": "Question 1.3: Debtors' age analysis",
  "syllabus": "dbe",
  "subject": "accounting",
  "year": 2024,
  "paper": "nov_p2",
  "order": 4,
  "content_tier": "free",
  "has_video": false,
  "xp": 8,
  "tags": [
    "debtors_age_analysis",
    "credit_control"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2024/nov_p2/q4/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2024/nov_p2/q4/memo_1.png"
  ],
  "exam_question_marks": 8,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Use the age analysis in the figure. Calculate the percentage of debtors' balances that are within the credit terms.",
    "metadata": [
      "Within terms = ",
      "[ ]",
      " %"
    ],
    "answer": [
      "80",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "unit": "reconciliations",
    "topic": "debtors_age_analysis",
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
    "year": 2024,
    "paper": "nov_p2",
    "type": "calc",
    "clues": "- Add the columns that are within 30 days.\n- Divide by the total and multiply by 100.",
    "supplementary_material": {
      "type": "statement",
      "label": "Debtors' Age Analysis: Kgosi Traders",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/accounting/2024/nov_p2/q4/statement_1.png"
      ]
    }
  },
  {
    "name": "Question 2",
    "question": "A business allows 60 days' credit. Its age analysis shows: total R250 000; current R120 000; 30 days R50 000; 60 days R35 000; 90 days R25 000; more than 90 days R20 000. Calculate the percentage of balances that are NOT within the terms.",
    "metadata": [
      "Outside terms = ",
      "[ ]",
      " %"
    ],
    "answer": [
      "18",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "unit": "reconciliations",
    "topic": "debtors_age_analysis",
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
    "paper": "nov_p2",
    "type": "calc"
  },
  {
    "name": "Question 3",
    "question": "Discounts and interest are already used. Select the TWO pieces of advice that will improve the collection from debtors.",
    "metadata": [
      "Offer bigger discounts for paying early",
      "Send automated reminders before accounts fall due",
      "Check credit history before granting credit",
      "Charge a higher interest rate on late accounts",
      "Extend the credit terms from 30 to 60 days"
    ],
    "answer": [
      "Send automated reminders before accounts fall due",
      "Check credit history before granting credit",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "reconciliations",
    "topic": "debtors_age_analysis",
    "subtopic": "acc_scenario_application",
    "skills": [
      "apply_accounting_concept_to_scenario"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "accounting",
    "year": 2024,
    "paper": "nov_p2",
    "type": "application"
  },
  {
    "name": "Question 4",
    "question": "Which action is most suitable for debtors whose accounts are more than 90 days overdue?",
    "metadata": [
      "Raise their credit limits to keep their custom",
      "Allow them a further 60 days to settle in full",
      "Offer them a further discount on new purchases",
      "Hand the accounts over to a debt collector",
      ""
    ],
    "answer": [
      "Hand the accounts over to a debt collector",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "reconciliations",
    "topic": "debtors_age_analysis",
    "subtopic": "acc_scenario_application",
    "skills": [
      "apply_accounting_concept_to_scenario"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "accounting",
    "year": 2024,
    "paper": "nov_p2",
    "type": "application"
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "1.3.1",
      "marks": 4,
      "clues": "- Credit terms are 60 days, so Current, 30 days and 60 days are within the terms.\n- The target is at least 90% within the terms.",
      "approach": "- Add the balances within the terms and express them as a percentage of the total.\n- Compare the result with the 90% target.",
      "solution": "1. (R118 000 + R36 000 + R38 000) ÷ R240 000 × 100 = 80%, which is 10% below the 90% target.\n2. OR (R29 200 + R18 800) ÷ R240 000 × 100 = 20% of debtors are outside the terms."
    },
    {
      "number": "1.3.2",
      "marks": 4,
      "clues": "- Discounts and interest are already in place, so they are not accepted as advice.",
      "approach": "- Give two different, practical credit-control measures.",
      "solution": "1. Any two: debit orders; automated SMS/e-mail reminders; screening and credit checks before granting credit; lowering credit limits of slow payers; payment plans; suspending accounts; handing over to debt collectors."
    }
  ],
  "model": "claude-opus-5-5",
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
