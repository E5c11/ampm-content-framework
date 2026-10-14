#!/usr/bin/env node
/**
 * DBE Economics P1 — November 2025 — Question 5: Markets of the circular flow (order 23)
 * Lesson 23 of the 2025 Nov P1 repair (DESIGN-UNI-14: 3 practice questions). Question 5: Markets of the circular flow. Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2025-nov-p1-l23.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2025-nov-p1-l23.js --dry-run
 *   node scripts/add-economics-2025-nov-p1-l23.js
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
  "name": "Question 5: Markets of the circular flow",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2025,
  "paper": "nov_p1",
  "order": 23,
  "content_tier": "free",
  "has_video": false,
  "xp": 26,
  "tags": [
    "circular_flow_markets",
    "financial_markets"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q23/question_11.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q23/memo_11.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q23/memo_12.png"
  ],
  "exam_question_marks": 26,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Match each market in the four-sector circular flow to what is exchanged in it.",
    "metadata": [
      "A - Goods market",
      "B - Factor market",
      "C - Financial market",
      "D - Foreign exchange market",
      "1 - Consumer and capital goods and services",
      "2 - Land, labour, capital and entrepreneurship",
      "3 - Surplus savings, lent to those who need funds",
      "4 - The currencies of different countries"
    ],
    "answer": [
      "A-1",
      "B-2",
      "C-3",
      "D-4"
    ],
    "presentation": "match",
    "type": "definition",
    "unit": "circular_flow",
    "topic": "circular_flow_markets",
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
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Work out what each market is named after.\n- The factor market deals in inputs, while the goods market deals in outputs."
  },
  {
    "name": "Question 2",
    "question": "Match each factor of production to the payment its owner receives in the factor market.",
    "metadata": [
      "A - Labour",
      "B - Land",
      "C - Capital",
      "D - Entrepreneurship",
      "1 - Wages",
      "2 - Rent",
      "3 - Interest",
      "4 - Profit"
    ],
    "answer": [
      "A-1",
      "B-2",
      "C-3",
      "D-4"
    ],
    "presentation": "match",
    "type": "definition",
    "unit": "circular_flow",
    "topic": "circular_flow_markets",
    "subtopic": "econ_classification",
    "skills": [
      "classify_economic_concept"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Households own the factors and are paid by firms.\n- Rent is paid for the use of natural resources."
  },
  {
    "name": "Question 3",
    "question": "Which of the following securities is traded in the capital market rather than the money market?",
    "metadata": [
      "Mortgage bonds",
      "Treasury bills",
      "Short-term debentures",
      "Overnight inter-bank loans",
      ""
    ],
    "answer": [
      "Mortgage bonds",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "circular_flow",
    "topic": "financial_markets",
    "subtopic": "econ_classification",
    "skills": [
      "classify_economic_concept"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- The capital market deals with long-term savings and loans.\n- Three options are short-term instruments."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "5",
      "marks": 26,
      "clues": "- Give each of the four markets its own heading with developed points.\n- Headings and examples can earn at most 8 of the 26 main-part marks.",
      "approach": "- Define a market or the circular flow in the introduction without repeating the question.\n- Cover goods, factor, financial (money and capital) and foreign exchange markets.\n- Explain each market with its participants and flows.",
      "solution": "1. Goods market: where goods and services are bought and sold; consumer goods are durable, semi-durable or non-durable, and capital goods are bought by businesses.\n2. Factor market: households sell labour, land, capital and entrepreneurship and receive wages, rent, interest and profit.\n3. Financial markets: banks, insurers and pension funds link savers and borrowers; the money market handles short-term funds and the capital market long-term funds.\n4. Foreign exchange market: currencies are traded and the freely traded rand is priced by demand and supply."
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
