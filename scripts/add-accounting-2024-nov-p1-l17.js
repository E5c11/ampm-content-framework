#!/usr/bin/env node
/**
 * DBE Accounting — November 2024 — Question 4.1–4.3: The external auditor and the audit report (order 17)
 * Questions 4.1 to 4.3 — the role of the independent external auditor, identifying an unqualified audit report from its wording, and the audit evidence used to verify fixed assets.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-accounting-2024-nov-p1-l17.js --curriculum temp/curriculum-vocab-accounting.json
 *   node scripts/add-accounting-2024-nov-p1-l17.js --dry-run
 *   node scripts/add-accounting-2024-nov-p1-l17.js
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
  "name": "Question 4.1–4.3: The external auditor and the audit report",
  "syllabus": "dbe",
  "subject": "accounting",
  "year": 2024,
  "paper": "nov_p1",
  "order": 17,
  "content_tier": "free",
  "has_video": false,
  "xp": 8,
  "tags": [
    "audit_report",
    "external_auditor_role"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2024/nov_p1/q17/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2024/nov_p1/q17/memo_1.png"
  ],
  "exam_question_marks": 8,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "What is the main role of an independent external auditor?",
    "metadata": [
      "To prepare the financial statements for the directors each year",
      "To approve the budget and the spending of the company",
      "To decide on the dividends paid to the shareholders",
      "To give an opinion on whether the statements are fairly presented",
      ""
    ],
    "answer": [
      "To give an opinion on whether the statements are fairly presented",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "corporate_governance",
    "topic": "audit_reports",
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
    "year": 2024,
    "paper": "nov_p1",
    "type": "definition"
  },
  {
    "name": "Question 2",
    "question": "An audit report states: \"In our opinion the financial statements present fairly, in all material respects, the financial position of the company.\" Which type of audit report is this?",
    "metadata": [
      "Unqualified",
      "Qualified",
      "Disclaimer of opinion",
      "Adverse opinion",
      ""
    ],
    "answer": [
      "Unqualified",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "corporate_governance",
    "topic": "audit_reports",
    "subtopic": "acc_classification",
    "skills": [
      "classify_accounting_concept"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "accounting",
    "year": 2024,
    "paper": "nov_p1",
    "type": "application"
  },
  {
    "name": "Question 3",
    "question": "Select ALL the audit evidence an auditor would examine to verify the fixed assets of a company.",
    "metadata": [
      "Checking attendance at the last AGM",
      "Checking title deeds and registration papers",
      "Inspecting the assets listed in the register",
      "Checking the depreciation calculations",
      "Counting the cash in the petty cash box"
    ],
    "answer": [
      "Inspecting the assets listed in the register",
      "Checking the depreciation calculations",
      "Checking title deeds and registration papers",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "corporate_governance",
    "topic": "audit_reports",
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
    "paper": "nov_p1",
    "type": "application"
  },
  {
    "name": "Question 4",
    "question": "Match each type of audit report to its meaning.",
    "metadata": [
      "A - Unqualified",
      "B - Qualified",
      "C - Disclaimer",
      "D - Adverse",
      "1 - Fair, except for specific problems",
      "2 - Auditor could not form an opinion",
      "3 - Statements are materially misstated",
      "4 - Statements are fairly presented"
    ],
    "answer": [
      "A-4",
      "B-1",
      "C-2",
      "D-3"
    ],
    "presentation": "match",
    "unit": "corporate_governance",
    "topic": "audit_reports",
    "subtopic": "acc_term_recall",
    "skills": [
      "recall_accounting_term"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "accounting",
    "year": 2024,
    "paper": "nov_p1",
    "type": "definition"
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "4.1",
      "marks": 2,
      "clues": "- The auditor is independent of the directors and reports to the shareholders.",
      "approach": "- Give ONE point about what the auditor provides to the shareholders.",
      "solution": "1. The independent auditor gives an unbiased opinion on whether the financial statements are fairly presented, protecting the interests of the shareholders."
    },
    {
      "number": "4.2",
      "marks": 2,
      "clues": "- The extract says the statements \"present fairly, in all material respects\".\n- The audit evidence was sufficient and appropriate.",
      "approach": "- Choose the report type, then explain the choice from the wording.",
      "solution": "1. Unqualified: no material errors or irregularities were found, and the statements fairly present the financial position of the company."
    },
    {
      "number": "4.3",
      "marks": 4,
      "clues": "- Fixed assets are checked against the Fixed Asset Register and source documents.\n- Ownership and depreciation must also be verified.",
      "approach": "- Give TWO kinds of evidence, each with what it proves.",
      "solution": "1. Confirm the physical existence of the items in the Fixed Asset Register, and check that depreciation was calculated at the correct rate.\n2. Check invoices against the cost price in the register, and title deeds or registration certificates for ownership (any two)."
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
