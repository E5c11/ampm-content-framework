#!/usr/bin/env node
/**
 * DBE Accounting — November 2024 — Question 4.4–4.5: Implications of the audit report and auditor misconduct (order 18)
 * Questions 4.4 and 4.5 — what an unqualified audit report means for directors and shareholders, and the consequences for an auditor who deliberately issues an incorrect report.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-accounting-2024-nov-p1-l18.js --curriculum temp/curriculum-vocab-accounting.json
 *   node scripts/add-accounting-2024-nov-p1-l18.js --dry-run
 *   node scripts/add-accounting-2024-nov-p1-l18.js
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
  "name": "Question 4.4–4.5: Implications of the audit report and auditor misconduct",
  "syllabus": "dbe",
  "subject": "accounting",
  "year": 2024,
  "paper": "nov_p1",
  "order": 18,
  "content_tier": "free",
  "has_video": false,
  "xp": 7,
  "tags": [
    "audit_report",
    "auditor_misconduct"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2024/nov_p1/q18/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2024/nov_p1/q18/memo_1.png"
  ],
  "exam_question_marks": 7,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "What is ONE implication of an unqualified audit report for the directors?",
    "metadata": [
      "They will have to repay their fees to the company",
      "They must resign at the next annual general meeting",
      "They are likely to be re-elected by the shareholders",
      "They will be investigated by the CIPC for fraud",
      ""
    ],
    "answer": [
      "They are likely to be re-elected by the shareholders",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "corporate_governance",
    "topic": "audit_reports",
    "subtopic": "acc_scenario_application",
    "skills": [
      "apply_accounting_concept_to_scenario"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "accounting",
    "year": 2024,
    "paper": "nov_p1",
    "type": "application"
  },
  {
    "name": "Question 2",
    "question": "What is ONE implication of an unqualified audit report for the shareholders?",
    "metadata": [
      "They will receive a higher dividend this year",
      "They can trust that their investment is safe",
      "They must appoint a new auditor next year",
      "They lose their voting rights at the AGM",
      ""
    ],
    "answer": [
      "They can trust that their investment is safe",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "corporate_governance",
    "topic": "audit_reports",
    "subtopic": "acc_scenario_application",
    "skills": [
      "apply_accounting_concept_to_scenario"
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
    "question": "Under pressure from the directors, an auditor deliberately gave the shareholders an incorrect audit report. Select ALL the possible consequences for the auditor.",
    "metadata": [
      "Being promoted to a director",
      "Being deregistered by IRBA",
      "Being sued by the shareholders",
      "Being fined or imprisoned",
      "Receiving a bonus from SARS"
    ],
    "answer": [
      "Being deregistered by IRBA",
      "Being sued by the shareholders",
      "Being fined or imprisoned",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "corporate_governance",
    "topic": "ethics_and_internal_control",
    "subtopic": "acc_classification",
    "skills": [
      "classify_accounting_concept"
    ],
    "difficulty": 2,
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
    "question": "Match each party to its role in the audit of a company.",
    "metadata": [
      "A - Shareholders",
      "B - Directors",
      "C - External auditor",
      "D - IRBA",
      "1 - Prepare the financial statements",
      "2 - Gives an independent opinion",
      "3 - Regulates registered auditors",
      "4 - Appoint the auditor at the AGM"
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
      "number": "4.4",
      "marks": 4,
      "clues": "- The report identified in 4.2 is unqualified.\n- Give one implication for the directors and one for the shareholders.",
      "approach": "- Think about the directors' reputation and re-appointment.\n- Think about the shareholders' confidence in their investment.",
      "solution": "1. Directors: they are likely to be re-appointed, and their reputation improves.\n2. Shareholders: they can be satisfied that their investment is safe, which encourages further investment."
    },
    {
      "number": "4.5",
      "marks": 3,
      "clues": "- The auditor acted dishonestly under pressure from the directors.\n- Consequences can be professional, legal and for the audit firm.",
      "approach": "- Give THREE consequences; one-word answers are accepted.",
      "solution": "1. Deregistered by IRBA or loss of professional licence.\n2. Disciplinary hearing, dismissal, a fine or imprisonment.\n3. Sued by shareholders for negligence; the audit firm loses clients and reputation."
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
