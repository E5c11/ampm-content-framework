#!/usr/bin/env node
/**
 * DBE Economics P2 — November 2024 — Question 4.2.4–4.2.5: Demand curve and long-run adjustment (order 21)
 * Lesson 21 of 2024 Nov P2 (DESIGN-UNI-14: 3 practice questions). Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2024-nov-p2-l21.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2024-nov-p2-l21.js --dry-run
 *   node scripts/add-economics-2024-nov-p2-l21.js
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
  "name": "Question 4.2.4–4.2.5: Demand curve and long-run adjustment",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2024,
  "paper": "nov_p2",
  "order": 21,
  "content_tier": "free",
  "has_video": false,
  "xp": 8,
  "tags": [
    "perfect_competition",
    "price_taker"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p2/q21/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p2/q21/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p2/q21/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p2/q21/memo_2.png"
  ],
  "exam_question_marks": 6,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Why is the demand curve of an individual firm in perfect competition horizontal?",
    "metadata": [
      "it can set any price it chooses",
      "it can sell any quantity at the market price",
      "buyers pay more for larger quantities",
      "it sells a differentiated product",
      ""
    ],
    "answer": [
      "it can sell any quantity at the market price",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "perfect_markets",
    "topic": "perfect_competition_profit_loss",
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
    "paper": "nov_p2",
    "clues": "- The firm is one small seller among very many."
  },
  {
    "name": "Question 2",
    "question": "Arrange how an economic loss in the short run leads to normal profit in the long run.",
    "metadata": [
      "Remaining firms earn only normal profit",
      "Firms make an economic loss at the market price",
      "The market price rises",
      "Some firms leave the market and market supply decreases"
    ],
    "answer": [
      "Firms make an economic loss at the market price",
      "Some firms leave the market and market supply decreases",
      "The market price rises",
      "Remaining firms earn only normal profit"
    ],
    "presentation": "ordering",
    "type": "ordering",
    "unit": "perfect_markets",
    "topic": "perfect_competition_profit_loss",
    "subtopic": "econ_policy_evaluation",
    "skills": [
      "evaluate_economic_policy"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Losses push firms out; fewer sellers change the price; the new price changes profit."
  },
  {
    "name": "Question 3",
    "question": "Study the market graph (illustrative). Select ALL the statements that are correct.",
    "metadata": [
      "Supply decreases from S1 to S2",
      "Demand shifts to the right",
      "The price rises from P1 to P2",
      "Output in the market falls from Q1 to Q2",
      "The price falls as firms leave"
    ],
    "answer": [
      "Supply decreases from S1 to S2",
      "The price rises from P1 to P2",
      "Output in the market falls from Q1 to Q2",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "interpretation",
    "unit": "perfect_markets",
    "topic": "perfect_competition_profit_loss",
    "subtopic": "econ_data_interpretation",
    "skills": [
      "interpret_economic_data"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Read the labels on the market graph: which curve moves, and which way?",
    "supplementary_material": {
      "type": "diagram",
      "label": "Graph",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/economics/2024/nov_p2/q21/diagram_1.png"
      ]
    }
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "4.2.4",
      "marks": 2,
      "clues": "- Think of a price taker.",
      "approach": "- Explain in one sentence.",
      "solution": "The firm can sell different quantities only at the same price because it is a price taker; many sellers mean no firm influences the market price."
    },
    {
      "number": "4.2.5",
      "marks": 4,
      "clues": "- Use the movement from S1 to S2 and from P1 to P2.",
      "approach": "- Give two developed points of 2 marks each.",
      "solution": "1. Losses force some businesses to exit and market supply shifts left from S1 to S2.\n2. The price rises from P1 to P2, which reduces losses.\n3. In the long run the remaining firms make normal profit where price P2 equals average cost. Any other correct relevant response is accepted."
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
