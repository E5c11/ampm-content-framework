#!/usr/bin/env node
/**
 * DBE Economics P1 — November 2024 — Question 2.5: Price stability (order 10)
 * Lesson 10 of 2024 Nov P1 (DESIGN-UNI-14: 3 practice questions). Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2024-nov-p1-l10.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2024-nov-p1-l10.js --dry-run
 *   node scripts/add-economics-2024-nov-p1-l10.js
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
  "name": "Question 2.5: Price stability",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2024,
  "paper": "nov_p1",
  "order": 10,
  "content_tier": "free",
  "has_video": false,
  "xp": 8,
  "tags": [
    "price_stability",
    "macroeconomic_objectives"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p1/q10/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p1/q10/memo_1.png"
  ],
  "exam_question_marks": 8,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "How does price stability protect the purchasing power of households?",
    "metadata": [
      "Households spend all their income immediately on arrival",
      "Wages rise faster than prices in every single year",
      "Prices stay steady, so incomes buy the same over time",
      "Imports become cheaper for every household in the country",
      ""
    ],
    "answer": [
      "Prices stay steady, so incomes buy the same over time",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "public_sector",
    "topic": "macroeconomic_objectives",
    "subtopic": "econ_classification",
    "skills": [
      "classify_economic_concept"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Purchasing power is what a rand can buy.\n- Think about what happens to that when prices barely change."
  },
  {
    "name": "Question 2",
    "question": "Select ALL the ways in which price stability can benefit the South African economy.",
    "metadata": [
      "It guarantees that the exchange rate improves every single year",
      "It encourages saving and so supplies loanable funds",
      "It helps firms and consumers plan spending",
      "It keeps inflation expectations and wage demands low",
      "It raises unemployment on purpose to hold prices down"
    ],
    "answer": [
      "It encourages saving and so supplies loanable funds",
      "It helps firms and consumers plan spending",
      "It keeps inflation expectations and wage demands low",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "public_sector",
    "topic": "macroeconomic_objectives",
    "subtopic": "econ_classification",
    "skills": [
      "classify_economic_concept"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Think of benefits for savers, planners and workers when prices are predictable."
  },
  {
    "name": "Question 3",
    "question": "Arrange the benefits of price stability in the order in which they follow one another.",
    "metadata": [
      "Businesses produce more and employ more workers",
      "Households keep their purchasing power",
      "Prices remain relatively stable",
      "Consumers spend with confidence"
    ],
    "answer": [
      "Prices remain relatively stable",
      "Households keep their purchasing power",
      "Consumers spend with confidence",
      "Businesses produce more and employ more workers"
    ],
    "presentation": "ordering",
    "type": "ordering",
    "unit": "public_sector",
    "topic": "macroeconomic_objectives",
    "subtopic": "econ_policy_evaluation",
    "skills": [
      "evaluate_economic_policy"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Begin with the cause, then follow what households do, then what businesses do in response."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "2.5",
      "marks": 8,
      "clues": "- Think about consumers, savers, investors and exports.",
      "approach": "- Four developed benefits of 2 marks each; at most 2 marks for mere listing.",
      "solution": "1. Stable prices encourage consumer spending and stimulate growth.\n2. They promote job creation and reduce unemployment through more investment.\n3. They encourage saving, so loanable funds are available for private investment.\n4. They keep interest rates stable, preserve purchasing power, help planning and keep inflation expectations and wage demands low.\n5. Any other correct relevant response is accepted."
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
