#!/usr/bin/env node
/**
 * DBE Economics P2 — November 2024 — Question 1.1.1–1.1.4: Market structures and control (order 1)
 * Lesson 1 of 2024 Nov P2 (DESIGN-UNI-14: 4 practice questions). Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2024-nov-p2-l01.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2024-nov-p2-l01.js --dry-run
 *   node scripts/add-economics-2024-nov-p2-l01.js
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
  "name": "Question 1.1.1–1.1.4: Market structures and control",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2024,
  "paper": "nov_p2",
  "order": 1,
  "content_tier": "free",
  "has_video": false,
  "xp": 10,
  "tags": [
    "perfect_competition",
    "monopoly_market",
    "market_failure",
    "price_taker"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p2/q1/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p2/q1/memo_1.png"
  ],
  "exam_question_marks": 8,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "A wheat farmer must accept the going market price and cannot change it by selling more or less. Which term describes this farmer?",
    "metadata": [
      "price maker",
      "price setter",
      "price taker",
      "price searcher",
      ""
    ],
    "answer": [
      "price taker",
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
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Ask whether the farmer has any power over the price."
  },
  {
    "name": "Question 2",
    "question": "Select ALL the correct statements about the shut-down point of a perfectly competitive firm.",
    "metadata": [
      "It is where average revenue equals average fixed cost",
      "It is where average revenue equals average variable cost",
      "Below it the firm cannot cover its variable costs",
      "A firm usually stops production if the price falls below it",
      "It is where total revenue equals total fixed cost"
    ],
    "answer": [
      "It is where average revenue equals average variable cost",
      "Below it the firm cannot cover its variable costs",
      "A firm usually stops production if the price falls below it",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "definition",
    "unit": "perfect_markets",
    "topic": "perfect_competition_profit_loss",
    "subtopic": "econ_term_definition",
    "skills": [
      "define_economic_term"
    ],
    "difficulty": 4,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- The firm shuts down when it cannot pay for the resources that change with output."
  },
  {
    "name": "Question 3",
    "question": "Match each type of monopoly to its cause.",
    "metadata": [
      "A - Natural monopoly",
      "B - Artificial monopoly",
      "C - Geographical monopoly",
      "1 - Isolation of the firm from competitors by distance",
      "2 - Very high development costs of the industry",
      "3 - A patent or licence that gives an exclusive right"
    ],
    "answer": [
      "A-2",
      "B-3",
      "C-1"
    ],
    "presentation": "match",
    "type": "definition",
    "unit": "imperfect_markets",
    "topic": "monopoly",
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
    "paper": "nov_p2",
    "clues": "- Match the cause to the word in the name: nature of the industry, a legal right, or place."
  },
  {
    "name": "Question 4",
    "question": "A government passes a law that sets the maximum amount of smoke a factory may release. Which form of control to reduce market failure is this?",
    "metadata": [
      "indirect control",
      "deregulation",
      "taxation",
      "direct control",
      ""
    ],
    "answer": [
      "direct control",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "market_failures",
    "topic": "externalities_and_efficiency",
    "subtopic": "econ_classification",
    "skills": [
      "classify_economic_concept"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- The government gives an order instead of changing prices."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "1.1.1",
      "marks": 2,
      "clues": "- Ask whether a firm in this market can influence the price.",
      "approach": "- Name the term.",
      "solution": "A business with no influence over the market price is a price taker (C)."
    },
    {
      "number": "1.1.2",
      "marks": 2,
      "clues": "- Think about what high development costs do to entry.",
      "approach": "- Match the cause to the type of monopoly.",
      "solution": "High development costs are frequently a reason for a natural monopoly (B)."
    },
    {
      "number": "1.1.3",
      "marks": 2,
      "clues": "- Think of the cost that a firm must cover to stay open in the short run.",
      "approach": "- Name the cost that average revenue equals at the shut-down point.",
      "solution": "The shut-down point is where average revenue equals average variable cost (A)."
    },
    {
      "number": "1.1.4",
      "marks": 2,
      "clues": "- Think of laws that order firms to act in a certain way.",
      "approach": "- Name the form of control.",
      "solution": "When government passes laws to reduce market failures it is direct control (D)."
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
