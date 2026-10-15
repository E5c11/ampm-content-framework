#!/usr/bin/env node
/**
 * DBE Economics P1 — November 2024 — Question 5: Impact of a weaker rand (order 27)
 * Lesson 27 of 2024 Nov P1 (DESIGN-UNI-14: 3 practice questions). Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2024-nov-p1-l27.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2024-nov-p1-l27.js --dry-run
 *   node scripts/add-economics-2024-nov-p1-l27.js
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
  "name": "Question 5: Impact of a weaker rand",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2024,
  "paper": "nov_p1",
  "order": 27,
  "content_tier": "free",
  "has_video": false,
  "xp": 8,
  "tags": [
    "weaker_rand",
    "exchange_rates"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p1/q27/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p1/q27/memo_1.png"
  ],
  "exam_question_marks": 10,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Select ALL the possible positive effects of a weaker rand on the South African economy.",
    "metadata": [
      "Imported inputs become cheaper for all local producers",
      "South African exports become cheaper abroad",
      "Imports become dearer, so local goods sell more",
      "More foreign tourists may visit the country",
      "Foreign tourists find the country more expensive"
    ],
    "answer": [
      "South African exports become cheaper abroad",
      "Imports become dearer, so local goods sell more",
      "More foreign tourists may visit the country",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "foreign_exchange_and_bop",
    "topic": "currency_exchange_rates",
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
    "clues": "- A weaker rand buys less foreign currency.\n- Ask whether foreign goods and services become dearer or cheaper for South Africans, and the opposite for foreigners."
  },
  {
    "name": "Question 2",
    "question": "Why can a weaker rand lead to cost-push inflation?",
    "metadata": [
      "Foreign investors earn more on their investments",
      "Exports become cheaper for foreign buyers",
      "Tourists spend more in the country",
      "Imported inputs such as oil cost more in rand",
      ""
    ],
    "answer": [
      "Imported inputs such as oil cost more in rand",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "foreign_exchange_and_bop",
    "topic": "currency_exchange_rates",
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
    "clues": "- Cost-push inflation starts with a rise in the cost of production.\n- Think about the inputs that South African firms buy from abroad."
  },
  {
    "name": "Question 3",
    "question": "Arrange the effects of a weaker rand on the balance of payments in the order in which they follow one another.",
    "metadata": [
      "Imports fall and export demand rises",
      "The rand becomes weaker",
      "The balance of payments deficit decreases",
      "Imports become dearer and exports cheaper"
    ],
    "answer": [
      "The rand becomes weaker",
      "Imports become dearer and exports cheaper",
      "Imports fall and export demand rises",
      "The balance of payments deficit decreases"
    ],
    "presentation": "ordering",
    "type": "ordering",
    "unit": "foreign_exchange_and_bop",
    "topic": "currency_exchange_rates",
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
    "clues": "- Begin with the change in the exchange rate, then the change in prices, then in trade volumes."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "5",
      "marks": 10,
      "clues": "- Treat this as the additional part: analyse both the positive and the negative effects.",
      "approach": "- At most 2 of the 10 marks may be given for mere listing.",
      "solution": "1. Positive: imports dearer and exports cheaper, so demand for local products and exports rises; tourism increases; the balance of payments deficit may fall.\n2. Negative: imported inputs such as crude oil cost more, fuelling cost-push inflation; domestic production and growth may fall; foreign investors may withdraw; import payments rise.\n3. Any other correct relevant response is accepted."
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
