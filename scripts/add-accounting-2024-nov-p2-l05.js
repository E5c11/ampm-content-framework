#!/usr/bin/env node
/**
 * DBE Accounting — November 2024 — Question 1.4: VAT amounts and their effect on VAT payable (order 5)
 * Question 1.4 — calculating the VAT amount on a discount received, credit sales with zero-rated items and an incorrect supplier invoice, and the effect on the amount payable to SARS.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-accounting-2024-nov-p2-l05.js --curriculum temp/curriculum-vocab-accounting-2024-p2.json
 *   node scripts/add-accounting-2024-nov-p2-l05.js --dry-run
 *   node scripts/add-accounting-2024-nov-p2-l05.js
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
  "name": "Question 1.4: VAT amounts and their effect on VAT payable",
  "syllabus": "dbe",
  "subject": "accounting",
  "year": 2024,
  "paper": "nov_p2",
  "order": 5,
  "content_tier": "free",
  "has_video": false,
  "xp": 10,
  "tags": [
    "vat_payable",
    "vat_calculation"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2024/nov_p2/q5/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2024/nov_p2/q5/memo_1.png"
  ],
  "exam_question_marks": 10,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Use the information in the figure to calculate the VAT amounts A, B and C.",
    "metadata": [
      "A = ",
      "[ ]",
      "   B = ",
      "[ ]",
      "   C = ",
      "[ ]"
    ],
    "answer": [
      "900",
      "11700",
      "1440",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "unit": "vat_and_salaries",
    "topic": "vat_calculations",
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
    "paper": "nov_p2",
    "type": "calc",
    "clues": "- A VAT-inclusive amount uses 15/115; a VAT-exclusive amount uses 15/100.\n- Zero-rated items carry no VAT.\n- Apply the trade discount before working out the VAT.",
    "supplementary_material": {
      "type": "statement",
      "label": "VAT analysis: Musa Stores",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/accounting/2024/nov_p2/q5/statement_1.png"
      ]
    }
  },
  {
    "name": "Question 2",
    "question": "What is the effect of a discount received from a supplier on the VAT payable to SARS?",
    "metadata": [
      "It decreases, as the cost of purchases is lower",
      "It increases, as input VAT claimed is now less",
      "It decreases, as the business saves on the invoice",
      "It has no effect, as the supplier was already paid",
      ""
    ],
    "answer": [
      "It increases, as input VAT claimed is now less",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "vat_and_salaries",
    "topic": "vat_calculations",
    "subtopic": "acc_classification",
    "skills": [
      "classify_accounting_concept"
    ],
    "difficulty": 4,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "accounting",
    "year": 2024,
    "paper": "nov_p2",
    "type": "application"
  },
  {
    "name": "Question 3",
    "question": "Select ALL the transactions that DECREASE the VAT payable to SARS.",
    "metadata": [
      "Stock taken by the owner for own use",
      "Bad debts written off",
      "Goods returned by debtors",
      "Credit purchases of trading stock",
      "Discount received from a creditor"
    ],
    "answer": [
      "Bad debts written off",
      "Goods returned by debtors",
      "Credit purchases of trading stock",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "vat_and_salaries",
    "topic": "vat_calculations",
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
    "paper": "nov_p2",
    "type": "application"
  },
  {
    "name": "Question 4",
    "question": "Credit sales of R46 000 (excluding VAT) include zero-rated goods of R12 000. Calculate the output VAT on these sales.",
    "metadata": [
      "Output VAT = R ",
      "[ ]"
    ],
    "answer": [
      "5100",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "unit": "vat_and_salaries",
    "topic": "vat_calculations",
    "subtopic": "acc_calculation",
    "skills": [
      "calculate_accounting_amount"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "accounting",
    "year": 2024,
    "paper": "nov_p2",
    "type": "calc"
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "1.4",
      "marks": 10,
      "clues": "- Use 15/115 for VAT-inclusive amounts and 15/100 for VAT-exclusive amounts.\n- Zero-rated sales carry no VAT; a trade discount reduces the invoice before VAT.",
      "approach": "- Calculate the VAT on each transaction.\n- Decide whether it increases (output VAT, or less input VAT) or decreases (input VAT) the amount payable to SARS.",
      "solution": "1. A: R17 250 × 15/115 = R2 250, increase.\n2. B: (R139 200 − R9 200) × 15/100 = R19 500, increase.\n3. C: R23 000 × 90/100 × 15/115 = R2 700, decrease."
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
