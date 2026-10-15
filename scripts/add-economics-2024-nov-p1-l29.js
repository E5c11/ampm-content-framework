#!/usr/bin/env node
/**
 * DBE Economics P1 — November 2024 — Question 6: Monetary policy and aggregate demand (order 29)
 * Lesson 29 of 2024 Nov P1 (DESIGN-UNI-14: 4 practice questions). Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2024-nov-p1-l29.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2024-nov-p1-l29.js --dry-run
 *   node scripts/add-economics-2024-nov-p1-l29.js
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

// ─── Phase 2 — lesson document ───────────────────────────────────────────────

const video = {
  "name": "Question 6: Monetary policy and aggregate demand",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2024,
  "paper": "nov_p1",
  "order": 29,
  "content_tier": "free",
  "has_video": false,
  "xp": 10,
  "tags": [
    "monetary_policy",
    "demand_side_policy"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p1/q29/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p1/q29/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p1/q29/memo_2.png"
  ],
  "exam_question_marks": 13,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "To restrict bank credit, the South African Reserve Bank (SARB) sells securities on the open market. Which monetary policy instrument is this?",
    "metadata": [
      "Interest rate changes",
      "Open market transactions",
      "Moral suasion",
      "Cash reserve requirements",
      ""
    ],
    "answer": [
      "Open market transactions",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "public_sector",
    "topic": "fiscal_and_monetary_policy",
    "subtopic": "econ_classification",
    "skills": [
      "classify_economic_concept"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- The SARB buys or sells securities from and to the financial markets."
  },
  {
    "name": "Question 2",
    "question": "Match each monetary policy instrument to how it works.",
    "metadata": [
      "A - Interest rate changes",
      "B - Moral suasion",
      "C - Cash reserve requirement",
      "D - Open market transactions",
      "1 - The SARB persuades banks to be stricter or more lenient with credit",
      "2 - The SARB buys or sells securities to change the money banks hold",
      "3 - Credit becomes dearer or cheaper",
      "4 - Banks must hold a set share of deposits, which limits credit"
    ],
    "answer": [
      "A-3",
      "B-1",
      "C-4",
      "D-2"
    ],
    "presentation": "match",
    "type": "definition",
    "unit": "public_sector",
    "topic": "fiscal_and_monetary_policy",
    "subtopic": "econ_term_definition",
    "skills": [
      "define_economic_term"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Think of price, persuasion, a required share, and buying and selling."
  },
  {
    "name": "Question 3",
    "question": "Select ALL the correct statements about monetary policy in South Africa.",
    "metadata": [
      "Fiscal policy is carried out by the SARB",
      "The SARB aims to protect the value of the currency",
      "Monetary policy is used mainly to stabilise prices",
      "Cutting interest rates makes borrowing cheaper",
      "Raising the cash reserve requirement lets banks lend more"
    ],
    "answer": [
      "The SARB aims to protect the value of the currency",
      "Monetary policy is used mainly to stabilise prices",
      "Cutting interest rates makes borrowing cheaper",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "definition",
    "unit": "public_sector",
    "topic": "fiscal_and_monetary_policy",
    "subtopic": "econ_term_definition",
    "skills": [
      "define_economic_term"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Monetary policy is the work of the central bank.\n- Think about what each instrument does to the amount of credit."
  },
  {
    "name": "Question 4",
    "question": "The SARB lowers the cash reserve requirement. What is the most likely effect?",
    "metadata": [
      "Banks can extend more credit",
      "Banks must reduce lending",
      "Interest rates rise in every case",
      "Consumers spend less",
      ""
    ],
    "answer": [
      "Banks can extend more credit",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "public_sector",
    "topic": "fiscal_and_monetary_policy",
    "subtopic": "econ_classification",
    "skills": [
      "classify_economic_concept"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- A lower requirement means banks hold less back."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "6",
      "marks": 13,
      "clues": "- Cover the SARB, its goal, and the four instruments: interest rates, open market transactions, moral suasion and cash reserve requirements.",
      "approach": "- Explain each in full sentences; at most 8 of the 26 marks may be given for headings and examples.",
      "solution": "1. The SARB formulates and implements monetary policy; its primary goal is to protect the value of the currency by stabilising prices.\n2. Interest rate changes make credit more expensive or cheaper and can stabilise the exchange rate.\n3. Open market transactions restrict or encourage credit by selling or buying securities.\n4. Moral suasion persuades banks to act in line with conditions; changing the cash reserve requirement restricts or encourages credit creation."
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
