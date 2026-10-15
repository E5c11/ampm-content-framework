#!/usr/bin/env node
/**
 * DBE Economics P1 — November 2024 — Question 4.2.4–4.2.5: Trend line and recession (order 20)
 * Lesson 20 of 2024 Nov P1 (DESIGN-UNI-14: 3 practice questions). Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2024-nov-p1-l20.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2024-nov-p1-l20.js --dry-run
 *   node scripts/add-economics-2024-nov-p1-l20.js
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
  "name": "Question 4.2.4–4.2.5: Trend line and recession",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2024,
  "paper": "nov_p1",
  "order": 20,
  "content_tier": "free",
  "has_video": false,
  "xp": 8,
  "tags": [
    "trend_line",
    "recession",
    "business_cycle_explanations"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p1/q20/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p1/q20/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p1/q20/memo_2.png"
  ],
  "exam_question_marks": 6,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Why is the trend line important in the forecasting of business cycles?",
    "metadata": [
      "It shows the general direction of the economy",
      "It records the exact length of every past upswing",
      "It fixes the interest rate for each year ahead",
      "It shows how much each household earns",
      ""
    ],
    "answer": [
      "It shows the general direction of the economy",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "business_cycles",
    "topic": "business_cycle_explanations",
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
    "clues": "- A trend line smooths out the ups and downs.\n- Ask what a rising or falling line tells forecasters."
  },
  {
    "name": "Question 2",
    "question": "Select ALL the ways in which a recession can influence households.",
    "metadata": [
      "Incomes rise faster than prices for all households",
      "Some households lose jobs and incomes",
      "Some start informal businesses to survive",
      "Households buy less and living standards fall",
      "Households save all of their income and spend none"
    ],
    "answer": [
      "Some households lose jobs and incomes",
      "Some start informal businesses to survive",
      "Households buy less and living standards fall",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "business_cycles",
    "topic": "business_cycle_explanations",
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
    "clues": "- A recession is a period of falling output and employment.\n- Think about income first, then what households do in response."
  },
  {
    "name": "Question 3",
    "question": "Arrange the effects of a recession on households in the order in which they follow one another.",
    "metadata": [
      "Household income falls",
      "The economy moves into a recession",
      "Households buy fewer goods and services",
      "Firms cut production and retrench workers"
    ],
    "answer": [
      "The economy moves into a recession",
      "Firms cut production and retrench workers",
      "Household income falls",
      "Households buy fewer goods and services"
    ],
    "presentation": "ordering",
    "type": "ordering",
    "unit": "business_cycles",
    "topic": "business_cycle_explanations",
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
    "clues": "- Begin with the downturn, then firms, then household income, then household spending."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "4.2.4",
      "marks": 2,
      "clues": "- Think of the general direction of the economy.",
      "approach": "- Give one developed point.",
      "solution": "1. The trend line shows the general direction in which the economy is heading.\n2. A rising trend line means gradual growth; a declining line means gradual contraction. Any other correct relevant response is accepted."
    },
    {
      "number": "4.2.5",
      "marks": 4,
      "clues": "- Think about jobs, income, informal work and spending.",
      "approach": "- Give two developed points of 2 marks each.",
      "solution": "1. Households lose jobs and other sources of income.\n2. Households may turn to informal businesses for survival.\n3. They buy fewer goods and services because of low income, so the standard of living falls.\n4. Some may migrate for employment. Any other correct relevant response is accepted."
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
