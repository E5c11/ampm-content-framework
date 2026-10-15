#!/usr/bin/env node
/**
 * DBE Accounting — November 2025 — Question 1.2.2: Control over purchasing (order 5)
 * Question 1.2.2 — preventing an inflated invoice (excluding separation of duties) and the action to take against the manager.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-accounting-2025-nov-p2-l05.js --curriculum temp/curriculum-vocab-accounting.json
 *   node scripts/add-accounting-2025-nov-p2-l05.js --dry-run
 *   node scripts/add-accounting-2025-nov-p2-l05.js
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
  "name": "Question 1.2.2: Control over purchasing",
  "syllabus": "dbe",
  "subject": "accounting",
  "year": 2025,
  "paper": "nov_p2",
  "order": 5,
  "content_tier": "free",
  "has_video": false,
  "xp": 6,
  "tags": [
    "purchasing_controls",
    "fraud_prevention"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p2/q5/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p2/q5/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p2/q5/memo_1.png"
  ],
  "exam_question_marks": 6,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "A purchasing manager ordered six chairs from a supplier run by a friend, who invoiced R30 000 each. The market price is R7 500. What is the main control weakness?",
    "metadata": [
      "The supplier was paid before the invoice arrived",
      "Orders were not checked against other quotations",
      "The chairs were delivered to the wrong department",
      "The invoice was recorded in the wrong month",
      ""
    ],
    "answer": [
      "Orders were not checked against other quotations",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "reconciliations",
    "topic": "purchasing_controls",
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
    "year": 2025,
    "paper": "nov_p2",
    "type": "application"
  },
  {
    "name": "Question 2",
    "question": "Select the TWO controls that would prevent this problem (separation of duties excluded).",
    "metadata": [
      "Pay suppliers on the same day as delivery",
      "Let the purchasing manager approve his own orders",
      "Obtain several quotations for each order",
      "Senior staff must authorise orders and payments",
      "Keep supplier prices secret from the auditors"
    ],
    "answer": [
      "Obtain several quotations for each order",
      "Senior staff must authorise orders and payments",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "reconciliations",
    "topic": "purchasing_controls",
    "subtopic": "acc_classification",
    "skills": [
      "classify_accounting_concept"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "accounting",
    "year": 2025,
    "paper": "nov_p2",
    "type": "application"
  },
  {
    "name": "Question 3",
    "question": "Select the TWO actions, other than dismissal, that the business could take against the purchasing manager.",
    "metadata": [
      "Give him a bonus for finding the overcharge",
      "Hold a disciplinary hearing",
      "Recover the excess amount from his salary",
      "Allow him to keep ordering from the same supplier",
      "Move him to the finance section unchecked"
    ],
    "answer": [
      "Hold a disciplinary hearing",
      "Recover the excess amount from his salary",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "reconciliations",
    "topic": "purchasing_controls",
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
    "year": 2025,
    "paper": "nov_p2",
    "type": "application"
  },
  {
    "name": "Question 4",
    "question": "Match each internal control to its purpose.",
    "metadata": [
      "A - Multiple quotations",
      "B - Disclosure of ties",
      "C - Regular audits",
      "D - Authorisation limits",
      "1 - Avoid bias towards friends",
      "2 - Detect irregular purchases",
      "3 - Senior approval of large orders",
      "4 - Compare prices before buying"
    ],
    "answer": [
      "A-4",
      "B-1",
      "C-2",
      "D-3"
    ],
    "presentation": "match",
    "unit": "reconciliations",
    "topic": "purchasing_controls",
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
    "paper": "nov_p2",
    "type": "application"
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "1.2.2",
      "marks": 6,
      "clues": "- The chairs cost four times their real price and the supplier was a friend of the purchasing manager.\n- Separation of duties is not allowed as an answer.",
      "approach": "- Think of controls over ordering and approval.\n- Choose a sanction that is not dismissal.",
      "solution": "1. Prevention (any two): orders and payments authorised by senior personnel; multiple quotations; comparing competitor prices; frequent audits; disclosure of personal ties.\n2. Action (any one): a disciplinary hearing, a warning, suspension, charges, or recovering the excess amount from his salary."
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
