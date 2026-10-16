#!/usr/bin/env node
/**
 * DBE Accounting — November 2024 — Question 2.1.4: Proving stock theft and acting against the culprits (order 8)
 * Question 2.1.4 — how the owner could prove that a salesperson and a supplier's driver stole stock, and the action to take against each.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-accounting-2024-nov-p2-l08.js --curriculum temp/curriculum-vocab-accounting-2024-p2.json
 *   node scripts/add-accounting-2024-nov-p2-l08.js --dry-run
 *   node scripts/add-accounting-2024-nov-p2-l08.js
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
  "name": "Question 2.1.4: Proving stock theft and acting against the culprits",
  "syllabus": "dbe",
  "subject": "accounting",
  "year": 2024,
  "paper": "nov_p2",
  "order": 8,
  "content_tier": "free",
  "has_video": false,
  "xp": 6,
  "tags": [
    "stock_theft",
    "ethics_and_whistle_blowing"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2024/nov_p2/q8/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2024/nov_p2/q8/memo_1.png"
  ],
  "exam_question_marks": 6,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "A salesperson and a supplier's driver sold stock cheaply. The stock was invoiced to the business but never reached the shelves. Which evidence would best prove this?",
    "metadata": [
      "Compare this year's sales total with last year's total",
      "Compare supplier invoices with delivery notes and counts",
      "Compare the selling prices with those at competitors",
      "Compare the cash in the till with the cash budget",
      ""
    ],
    "answer": [
      "Compare supplier invoices with delivery notes and counts",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "stock_valuation",
    "topic": "inventory_management_decisions",
    "subtopic": "acc_scenario_application",
    "skills": [
      "apply_accounting_concept_to_scenario"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "accounting",
    "year": 2024,
    "paper": "nov_p2",
    "type": "application"
  },
  {
    "name": "Question 2",
    "question": "Select the TWO suitable actions against the salesperson who took part in the theft.",
    "metadata": [
      "Move him to the stockroom without a hearing",
      "Hold a fair disciplinary hearing",
      "Let him keep working with the same driver",
      "Recover the losses from his salary",
      "Wait for the supplier to discipline him"
    ],
    "answer": [
      "Hold a fair disciplinary hearing",
      "Recover the losses from his salary",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "stock_valuation",
    "topic": "inventory_management_decisions",
    "subtopic": "acc_scenario_application",
    "skills": [
      "apply_accounting_concept_to_scenario"
    ],
    "difficulty": 3,
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
    "question": "Match each person or party to a suitable action.",
    "metadata": [
      "A - The salesperson",
      "B - The supplier's driver",
      "C - The whistle-blower",
      "D - The supplier",
      "1 - Bar him from the premises",
      "2 - Protect his identity",
      "3 - Add penalties to the contract",
      "4 - Hold a disciplinary hearing"
    ],
    "answer": [
      "A-4",
      "B-1",
      "C-2",
      "D-3"
    ],
    "presentation": "match",
    "unit": "stock_valuation",
    "topic": "inventory_management_decisions",
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
    "question": "Why is a whistle-blower's report on its own not enough to dismiss an employee?",
    "metadata": [
      "Whistle-blowers may not report on fellow employees",
      "Only the external auditor may report stock theft",
      "The facts must first be confirmed in a fair hearing",
      "Stock theft is not a valid reason for a dismissal",
      ""
    ],
    "answer": [
      "The facts must first be confirmed in a fair hearing",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "stock_valuation",
    "topic": "inventory_management_decisions",
    "subtopic": "acc_interpretation",
    "skills": [
      "interpret_financial_indicators"
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
      "number": "2.1.4",
      "marks": 6,
      "clues": "- The stock was invoiced to the business but sold by Micha and Jack at a reduced price.\n- A whistle-blower reported it, and the stock was confirmed missing.",
      "approach": "- Find evidence that links the delivery to the missing stock.\n- Give one action for the employee (Micha) and one for the supplier's driver (Jack).",
      "solution": "1. Proof (any one): the whistle-blower's statement confirmed by findings; compare invoices with orders and delivery notes; count stock on delivery; tracking records; CCTV footage.\n2. Micha: disciplinary hearing or suspension, criminal charges, or recovering the loss from his salary.\n3. Jack: report him to the supplier, bar him from the premises, lay criminal charges, or claim compensation."
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
