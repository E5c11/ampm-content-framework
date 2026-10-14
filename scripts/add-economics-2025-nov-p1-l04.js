#!/usr/bin/env node
/**
 * DBE Economics P1 — November 2025 — Question 1.3: Key terms (order 4)
 * Lesson 4 of the 2025 Nov P1 repair (DESIGN-UNI-14: 3 practice questions). Question 1.3: Key terms. Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2025-nov-p1-l04.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2025-nov-p1-l04.js --dry-run
 *   node scripts/add-economics-2025-nov-p1-l04.js
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
  "name": "Question 1.3: Key terms",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2025,
  "paper": "nov_p1",
  "order": 4,
  "content_tier": "free",
  "has_video": false,
  "xp": 6,
  "tags": [
    "trade_policy",
    "economic_indicators",
    "international_trade"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q4/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q4/memo_1.png"
  ],
  "exam_question_marks": 6,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Give the term for a limit that a government places on the quantity of a particular good that may be imported in a year: []",
    "metadata": [
      "Term: ",
      "[ ]"
    ],
    "answer": [
      "quota|import quota",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "text",
    "type": "definition",
    "unit": "protection_and_free_trade",
    "topic": "tariffs_and_trade_barriers",
    "subtopic": "econ_term_definition",
    "skills": [
      "define_economic_term"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- This is a non-tariff trade barrier that restricts quantity rather than adding a tax."
  },
  {
    "name": "Question 2",
    "question": "Give the term for the measure, between 0 and 1, of how unequally income is distributed in a country: []",
    "metadata": [
      "Term: ",
      "[ ]"
    ],
    "answer": [
      "gini coefficient|gini-coefficient|gini index",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "text",
    "type": "definition",
    "unit": "economic_and_social_indicators",
    "topic": "income_inequality_measures",
    "subtopic": "econ_term_definition",
    "skills": [
      "define_economic_term"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- A value close to 0 means income is spread almost equally; close to 1 means it is concentrated in few hands."
  },
  {
    "name": "Question 3",
    "question": "The index of export prices divided by the index of import prices is called the …",
    "metadata": [
      "current account balance",
      "terms of trade",
      "exchange rate",
      "consumer price index",
      ""
    ],
    "answer": [
      "terms of trade",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "foreign_exchange_and_bop",
    "topic": "terms_of_trade",
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
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- It compares what a country earns per unit exported with what it pays per unit imported."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "1.3.1",
      "marks": 1,
      "clues": "- Count how many quarters of falling real GDP the description requires.",
      "approach": "- Identify the business-cycle phase described.\n- Write the full term only.",
      "solution": "1. Two or more consecutive quarters of falling real GDP is a recession."
    },
    {
      "number": "1.3.2",
      "marks": 1,
      "clues": "- It shows what happens to revenue as the tax rate increases.",
      "approach": "- Recall the curve linking tax rates and tax revenue.\n- Give its full name.",
      "solution": "1. The curve relating tax rates to tax revenue is the Laffer curve."
    },
    {
      "number": "1.3.3",
      "marks": 1,
      "clues": "- Goods and services cross national borders.",
      "approach": "- Think of the most general term for trade between countries.\n- Either accepted wording scores.",
      "solution": "1. The exchange of goods and services between countries is international trade (foreign trade is also accepted)."
    },
    {
      "number": "1.3.4",
      "marks": 1,
      "clues": "- The aim is to shield local producers.",
      "approach": "- Recall the trade policy opposed to free trade.\n- Give the term, not an example such as a tariff.",
      "solution": "1. A trade policy that safeguards local industries against unfair foreign competition is protectionism."
    },
    {
      "number": "1.3.5",
      "marks": 1,
      "clues": "- This is the part of land reform that pays back people who lost land because of past laws.",
      "approach": "- Separate the three land reform programmes.\n- Pick the compensating one.",
      "solution": "1. Land restitution compensates people who lost their land through discriminatory laws of the past."
    },
    {
      "number": "1.3.6",
      "marks": 1,
      "clues": "- These indicators describe the size and structure of a population.",
      "approach": "- Recall the kinds of social indicator.\n- Pick the one about population size and structure.",
      "solution": "1. Social indicators that describe the size and structure of a population are demographic indicators."
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
