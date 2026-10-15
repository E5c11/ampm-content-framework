#!/usr/bin/env node
/**
 * DBE Economics P1 — November 2024 — Question 6: Fiscal policy and redistribution (order 30)
 * Lesson 30 of 2024 Nov P1 (DESIGN-UNI-14: 4 practice questions). Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2024-nov-p1-l30.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2024-nov-p1-l30.js --dry-run
 *   node scripts/add-economics-2024-nov-p1-l30.js
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
  "name": "Question 6: Fiscal policy and redistribution",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2024,
  "paper": "nov_p1",
  "order": 30,
  "content_tier": "free",
  "has_video": false,
  "xp": 10,
  "tags": [
    "fiscal_policy",
    "demand_side_policy"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p1/q30/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p1/q30/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p1/q30/memo_2.png"
  ],
  "exam_question_marks": 13,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Match each fiscal policy element to an example.",
    "metadata": [
      "A - Progressive personal income tax",
      "B - Cash benefits",
      "C - Benefits in kind",
      "D - Land restitution",
      "1 - Free basic water and school meals",
      "2 - Higher earners pay higher rates",
      "3 - Old-age pensions and child support grants",
      "4 - Returning land or paying compensation for past losses"
    ],
    "answer": [
      "A-2",
      "B-3",
      "C-1",
      "D-4"
    ],
    "presentation": "match",
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
    "clues": "- Decide which example is a payment, which is a service, which is a tax and which is about land."
  },
  {
    "name": "Question 2",
    "question": "Property tax, transfer duties and capital gains tax are examples of which element of fiscal policy?",
    "metadata": [
      "Progressive income tax",
      "Wealth taxes",
      "Cash benefits",
      "Property subsidies",
      ""
    ],
    "answer": [
      "Wealth taxes",
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
    "order": 2,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- All three taxes fall on assets that people own rather than on income."
  },
  {
    "name": "Question 3",
    "question": "Select ALL the examples of benefits in kind.",
    "metadata": [
      "Old-age pensions",
      "Free basic water",
      "School meals",
      "Municipal services",
      "Unemployment insurance payouts"
    ],
    "answer": [
      "Free basic water",
      "School meals",
      "Municipal services",
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
    "clues": "- Benefits in kind are goods and services provided, not cash paid out."
  },
  {
    "name": "Question 4",
    "question": "What share of the country’s agricultural land is to be redistributed to previously disadvantaged persons?",
    "metadata": [
      "10%",
      "30%",
      "50%",
      "70%",
      ""
    ],
    "answer": [
      "30%",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
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
    "order": 4,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Land redistribution targets a minority share of agricultural land."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "6",
      "marks": 13,
      "clues": "- Cover the elements of fiscal policy: progressive income tax, wealth taxes, cash benefits, benefits in kind, other redistribution methods, land restitution and redistribution, and property subsidies.",
      "approach": "- Explain each in full sentences; at most 8 of the 26 marks may be given for headings and examples.",
      "solution": "1. Fiscal policy works through the budget to promote growth, employment and economic equity.\n2. Progressive and wealth taxes raise revenue and redistribute; cash benefits and benefits in kind (such as free basic services) support the poor.\n3. Land restitution and redistribution and property subsidies redress past imbalances and are financed from the main budget."
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
