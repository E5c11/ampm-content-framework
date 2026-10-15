#!/usr/bin/env node
/**
 * DBE Economics P1 — November 2024 — Question 4.3.4–4.3.5: Infant industries and specialisation (order 22)
 * Lesson 22 of 2024 Nov P1 (DESIGN-UNI-14: 3 practice questions). Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2024-nov-p1-l22.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2024-nov-p1-l22.js --dry-run
 *   node scripts/add-economics-2024-nov-p1-l22.js
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
  "name": "Question 4.3.4–4.3.5: Infant industries and specialisation",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2024,
  "paper": "nov_p1",
  "order": 22,
  "content_tier": "free",
  "has_video": false,
  "xp": 8,
  "tags": [
    "infant_industries",
    "specialisation",
    "trade_policy"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p1/q22/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p1/q22/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p1/q22/memo_2.png"
  ],
  "exam_question_marks": 6,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Why is it important to protect infant industries from foreign competition?",
    "metadata": [
      "So that new industries can grow and become competitive",
      "So that old industries can close without notice",
      "So that prices of all imports are higher for ever",
      "So that no new industries are started in the country",
      ""
    ],
    "answer": [
      "So that new industries can grow and become competitive",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "protection_and_free_trade",
    "topic": "tariffs_and_trade_barriers",
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
    "clues": "- An infant industry is new and small.\n- Ask what it needs before it can compete with established foreign firms."
  },
  {
    "name": "Question 2",
    "question": "Select ALL the benefits to an economy of specialising in the production of a specific product.",
    "metadata": [
      "Wastage of resources increases",
      "Cost of production per unit may fall",
      "Consumers may pay lower prices",
      "Total output may rise through higher productivity",
      "Total output falls because workers repeat tasks"
    ],
    "answer": [
      "Cost of production per unit may fall",
      "Consumers may pay lower prices",
      "Total output may rise through higher productivity",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "protection_and_free_trade",
    "topic": "comparative_advantage",
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
    "clues": "- Specialisation lets workers and firms do what they do best.\n- Think about cost, price and output."
  },
  {
    "name": "Question 3",
    "question": "Arrange the effects of specialisation in the order in which they follow one another.",
    "metadata": [
      "Prices fall and export sales increase",
      "A country specialises in one product",
      "Cost per unit falls",
      "The product is mass produced"
    ],
    "answer": [
      "A country specialises in one product",
      "The product is mass produced",
      "Cost per unit falls",
      "Prices fall and export sales increase"
    ],
    "presentation": "ordering",
    "type": "ordering",
    "unit": "protection_and_free_trade",
    "topic": "comparative_advantage",
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
    "clues": "- Start with the decision to specialise and follow the change in production, then in cost, then in the market."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "4.3.4",
      "marks": 2,
      "clues": "- Think about new industries needing time to grow.",
      "approach": "- Give one developed point.",
      "solution": "1. Protection allows new industries to establish themselves, achieve economies of scale and become competitive.\n2. It helps to create local jobs and diversify production, and reduces dependence on foreign goods. Any other correct relevant response is accepted."
    },
    {
      "number": "4.3.5",
      "marks": 4,
      "clues": "- Think about cost, prices, output and trade.",
      "approach": "- Give two developed points of 2 marks each.",
      "solution": "1. Specialisation lowers the cost of production and raises profit margins.\n2. Consumers pay lower prices, which improves their standard of living.\n3. Higher productivity raises total output and supports growth.\n4. The economy may develop an absolute or comparative advantage, and international trade may increase. Any other correct relevant response is accepted."
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
