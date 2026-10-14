#!/usr/bin/env node
/**
 * DBE Economics P1 — November 2025 — Question 2.2.5: Reserve assets (order 7)
 * Lesson 7 of the 2025 Nov P1 repair (DESIGN-UNI-14: 2 practice questions). Question 2.2.5: Reserve assets. Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2025-nov-p1-l07.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2025-nov-p1-l07.js --dry-run
 *   node scripts/add-economics-2025-nov-p1-l07.js
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
  "name": "Question 2.2.5: Reserve assets",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2025,
  "paper": "nov_p1",
  "order": 7,
  "content_tier": "free",
  "has_video": false,
  "xp": 4,
  "tags": [
    "balance_of_payments"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q7/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q7/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q7/memo_1.png"
  ],
  "exam_question_marks": 4,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Use the figures from an illustrative financial account (R millions) to find the reserve assets item A. Net direct investment 32 500; net portfolio investment -11 200; net financial derivatives 2 100; net other investment 9 800; reserve assets A; balance on the financial account 28 400. Complete the working:",
    "metadata": [
      "Balance excluding reserve assets = 32 500 - 11 200 + 2 100 + 9 800",
      "= 33 200",
      "A = 28 400 - 33 200, so A (in R millions):",
      "[ ]"
    ],
    "answer": [
      "-4800"
    ],
    "presentation": "steps",
    "keyboard_type": "scientific_math",
    "type": "calc",
    "unit": "foreign_exchange_and_bop",
    "topic": "balance_of_payments",
    "subtopic": "econ_calculation",
    "skills": [
      "apply_economic_formula"
    ],
    "difficulty": 4,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- The balance on the financial account is the sum of all its items, including reserve assets.\n- Subtract the total of the other items from the balance to isolate the reserve assets."
  },
  {
    "name": "Question 2",
    "question": "In a balance of payments table, reserve assets are shown as -R2 100 million. An increase in reserve assets is indicated by a negative sign and a decrease by a positive sign. What happened to the reserve assets?",
    "metadata": [
      "They increased by R2 100 million",
      "They decreased by R2 100 million",
      "They were unchanged, because the sign only shows a loss on the account",
      "They increased by R4 200 million",
      ""
    ],
    "answer": [
      "They increased by R2 100 million",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "interpretation",
    "unit": "foreign_exchange_and_bop",
    "topic": "balance_of_payments",
    "subtopic": "econ_data_interpretation",
    "skills": [
      "interpret_economic_data"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Apply the sign convention given in the question, not the everyday meaning of a negative number."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "2.2.5",
      "marks": 4,
      "clues": "- The balance on the financial account is the total of all its items, including reserve assets.\n- The table also gives the balance excluding reserve assets.",
      "approach": "- Subtract the balance excluding reserve assets from the balance on the financial account.\n- Use the sign convention printed under the table to decide whether reserve assets rose or fell.\n- Show each line of working, since the working carries most of the marks.",
      "solution": "1. Balance on the financial account is 62 869 and the balance excluding reserve assets is 63 066.\n2. Reserve assets = 62 869 - 63 066 = -197 (alternatively 62 869 - 13 481 - 4 311 + 23 348 - 68 622 = -197).\n3. A negative sign means an increase in reserve assets, so reserve assets increased."
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
