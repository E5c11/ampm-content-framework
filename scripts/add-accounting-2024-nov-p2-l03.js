#!/usr/bin/env node
/**
 * DBE Accounting — November 2024 — Question 1.2.2: Correcting the Debtors' List (order 3)
 * Question 1.2.2 — correcting each debtor's balance in the Debtors' List so that its total agrees with the Debtors' Control account.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-accounting-2024-nov-p2-l03.js --curriculum temp/curriculum-vocab-accounting-2024-p2.json
 *   node scripts/add-accounting-2024-nov-p2-l03.js --dry-run
 *   node scripts/add-accounting-2024-nov-p2-l03.js
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
  "name": "Question 1.2.2: Correcting the Debtors' List",
  "syllabus": "dbe",
  "subject": "accounting",
  "year": 2024,
  "paper": "nov_p2",
  "order": 3,
  "content_tier": "free",
  "has_video": false,
  "xp": 14,
  "tags": [
    "debtors_list",
    "debtors_reconciliation"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2024/nov_p2/q3/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2024/nov_p2/q3/memo_1.png"
  ],
  "exam_question_marks": 14,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Use the information in the figure to calculate the correct balances A, B and C.",
    "metadata": [
      "A = ",
      "[ ]",
      "   B = ",
      "[ ]",
      "   C = ",
      "[ ]"
    ],
    "answer": [
      "82200",
      "65800",
      "8300",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "unit": "reconciliations",
    "topic": "debtors_reconciliation",
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
    "paper": "nov_p2",
    "type": "calc",
    "clues": "- Pillay is affected by two errors.\n- A posting on the wrong side must be reversed and then posted correctly.\n- Fourie was credited with too little.",
    "supplementary_material": {
      "type": "statement",
      "label": "Debtors' List: Lindiwe Traders",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/accounting/2024/nov_p2/q3/statement-v2_1.png"
      ]
    }
  },
  {
    "name": "Question 2",
    "question": "A debtor's account shows a balance of R12 400. Goods returned of R1 150 were debited to the account instead of credited. Calculate the correct balance.",
    "metadata": [
      "Correct balance = R ",
      "[ ]"
    ],
    "answer": [
      "10100",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "unit": "reconciliations",
    "topic": "debtors_reconciliation",
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
    "type": "calc",
    "clues": "- The wrong debit must be cancelled and the correct credit made."
  },
  {
    "name": "Question 3",
    "question": "Match each error in a debtor's account to its correction.",
    "metadata": [
      "A - Returns of R500 posted on the wrong side",
      "B - Invoice of R500 not posted",
      "C - Receipt of R500 posted as R50",
      "D - Receipt of R300 posted twice",
      "1 - Increase by R500",
      "2 - Decrease by R450",
      "3 - Increase by R300",
      "4 - Decrease by R1 000"
    ],
    "answer": [
      "A-4",
      "B-1",
      "C-2",
      "D-3"
    ],
    "presentation": "match",
    "unit": "reconciliations",
    "topic": "debtors_reconciliation",
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
    "paper": "nov_p2",
    "type": "application"
  },
  {
    "name": "Question 4",
    "question": "A credit sale of R9 000 to debtor J was posted to the account of debtor K. How is the Debtors' List corrected?",
    "metadata": [
      "Add R9 000 to K and deduct R9 000 from J",
      "Add R18 000 to J and deduct R9 000 from K",
      "Add R9 000 to J and deduct R9 000 from K",
      "Add R9 000 to J and leave K's balance as it is",
      ""
    ],
    "answer": [
      "Add R9 000 to J and deduct R9 000 from K",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "reconciliations",
    "topic": "debtors_reconciliation",
    "subtopic": "acc_scenario_application",
    "skills": [
      "apply_accounting_concept_to_scenario"
    ],
    "difficulty": 3,
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
      "number": "1.2.2",
      "marks": 14,
      "clues": "- Only errors in the Debtors' Ledger change individual balances.\n- The corrected total must agree with the corrected control balance.",
      "approach": "- Work through each debtor and apply every error that touches that account.\n- Add the corrected balances and compare with 1.2.1.",
      "solution": "1. N Naidoo R63 000 + R4 500 = R67 500; S Sibiya R69 000 + R18 000 = R87 000.\n2. V Esterhuizen R114 000 − R18 000 + R2 700 = R98 700; J Nyoka R95 700 − R6 900 (R3 450 × 2) = R88 800.\n3. W du Plessis R11 500 + R7 500 − R5 700 = R13 300.\n4. Correct total of the Debtors' List = R355 300 (agrees with the control account)."
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
