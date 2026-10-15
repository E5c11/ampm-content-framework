#!/usr/bin/env node
/**
 * DBE Tourism — November 2025 — Question 9.2: Foreign arrivals and source markets (order 23)
 * Question 9.2.1–9.2.3 — reading source-market statistics, geographical spread and why African land markets are largest.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-tourism-2025-nov-p1-l23.js --curriculum temp/curriculum-vocab-tourism.json
 *   node scripts/add-tourism-2025-nov-p1-l23.js --dry-run
 *   node scripts/add-tourism-2025-nov-p1-l23.js
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
  "name": "Question 9.2: Foreign arrivals and source markets",
  "syllabus": "dbe",
  "subject": "tourism",
  "year": 2025,
  "paper": "nov_p1",
  "order": 23,
  "content_tier": "free",
  "has_video": false,
  "xp": 10,
  "tags": [
    "source_markets",
    "foreign_arrivals",
    "geographical_spread"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2025/nov_p1/q23/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2025/nov_p1/q23/memo_1.png"
  ],
  "exam_question_marks": 10,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Illustrative foreign arrivals in a year (thousands): Lesotho 1 620; Mozambique 1 410; United States 410; United Kingdom 380; Germany 270; Netherlands 140. Which source market has the highest number of arrivals?",
    "metadata": [
      "Mozambique",
      "United States",
      "United Kingdom",
      "Lesotho",
      ""
    ],
    "answer": [
      "Lesotho",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "domestic_regional_international_tourism",
    "topic": "foreign_arrivals",
    "subtopic": "tour_data_interpretation",
    "skills": [
      "interpret_tourism_stimulus"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "tourism",
    "year": 2025,
    "paper": "nov_p1",
    "type": "interpretation"
  },
  {
    "name": "Question 2",
    "question": "Illustrative foreign arrivals (thousands): Mozambique 1 410; United States 410; United Kingdom 380; Germany 270. Arrange these markets from the highest to the lowest number of arrivals.",
    "metadata": [
      "United Kingdom",
      "Mozambique",
      "Germany",
      "United States"
    ],
    "answer": [
      "Mozambique",
      "United States",
      "United Kingdom",
      "Germany"
    ],
    "presentation": "ordering",
    "unit": "domestic_regional_international_tourism",
    "topic": "foreign_arrivals",
    "subtopic": "tour_data_interpretation",
    "skills": [
      "interpret_tourism_stimulus"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "tourism",
    "year": 2025,
    "paper": "nov_p1",
    "type": "interpretation"
  },
  {
    "name": "Question 3",
    "question": "Select ALL the reasons why African land markets contribute the largest share of arrivals to South Africa.",
    "metadata": [
      "Flights from these countries are very long",
      "Many travel to shop or visit friends and relatives",
      "Visa requirements are favourable",
      "Land routes are short and transport is affordable",
      "Visa fees are higher than for long-haul markets"
    ],
    "answer": [
      "Visa requirements are favourable",
      "Land routes are short and transport is affordable",
      "Many travel to shop or visit friends and relatives",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "domestic_regional_international_tourism",
    "topic": "foreign_arrivals",
    "subtopic": "tour_cause_and_effect",
    "skills": [
      "explain_tourism_cause_and_effect"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "tourism",
    "year": 2025,
    "paper": "nov_p1",
    "type": "application"
  },
  {
    "name": "Question 4",
    "question": "A country's tourist arrivals become spread over more provinces instead of one. What is one advantage for the tourism industry?",
    "metadata": [
      "All visitors will choose a single province",
      "Quiet provinces gain income from more visitors",
      "Provinces will no longer need any marketing",
      "Visitor spending falls in every province",
      ""
    ],
    "answer": [
      "Quiet provinces gain income from more visitors",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "domestic_regional_international_tourism",
    "topic": "foreign_arrivals",
    "subtopic": "tour_cause_and_effect",
    "skills": [
      "explain_tourism_cause_and_effect"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "tourism",
    "year": 2025,
    "paper": "nov_p1",
    "type": "application"
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "9.2.1(a)",
      "marks": 2,
      "clues": "- Read the table for the largest figure.",
      "approach": "- Identify the highest source market.",
      "solution": "1. Zimbabwe, with 2 183 260 arrivals, is the top source market."
    },
    {
      "number": "9.2.1(b)",
      "marks": 2,
      "clues": "- Order the figures from largest to smallest.",
      "approach": "- Find the third largest.",
      "solution": "1. The United Kingdom is the third highest source market."
    },
    {
      "number": "9.2.2",
      "marks": 2,
      "clues": "- Think about provinces that are visited less.",
      "approach": "- Explain one advantage of a wider geographical spread.",
      "solution": "1. The lesser visited provinces gain economically from the increase."
    },
    {
      "number": "9.2.3",
      "marks": 4,
      "clues": "- Think about access and reasons for travelling.",
      "approach": "- Suggest two reasons.",
      "solution": "1. Favourable visa requirements allow easier access into South Africa.\n2. Tourists come mainly for shopping and to visit friends and relatives."
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
