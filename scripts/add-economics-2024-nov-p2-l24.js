#!/usr/bin/env node
/**
 * DBE Economics P2 — November 2024 — Question 4.4: Maximum prices (order 24)
 * Lesson 24 of 2024 Nov P2 (DESIGN-UNI-14: 4 practice questions). Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2024-nov-p2-l24.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2024-nov-p2-l24.js --dry-run
 *   node scripts/add-economics-2024-nov-p2-l24.js
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
  "name": "Question 4.4: Maximum prices",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2024,
  "paper": "nov_p2",
  "order": 24,
  "content_tier": "free",
  "has_video": false,
  "xp": 10,
  "tags": [
    "maximum_prices",
    "price_controls"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p2/q24/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p2/q24/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p2/q24/memo_2.png"
  ],
  "exam_question_marks": 8,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Study the graph (illustrative). At the maximum price of R14, what exists in the market?",
    "metadata": [
      "equilibrium",
      "a surplus",
      "a shortage",
      "a tax revenue gain",
      ""
    ],
    "answer": [
      "a shortage",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "interpretation",
    "unit": "market_failures",
    "topic": "price_controls",
    "subtopic": "econ_data_interpretation",
    "skills": [
      "interpret_economic_data"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Compare the quantity demanded with the quantity supplied at the maximum price.",
    "supplementary_material": {
      "type": "diagram",
      "label": "Graph",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/economics/2024/nov_p2/q24/diagram_1.png"
      ]
    }
  },
  {
    "name": "Question 2",
    "question": "Demand is Qd = 1500 - 50P and supply is Qs = -500 + 50P. A maximum price of R14 is set. Complete the working to find the shortage:",
    "metadata": [
      "Qd = 1500 - 50 × 14",
      "[ ]",
      "Qs = -500 + 50 × 14",
      "[ ]",
      "Shortage = Qd - Qs, so the shortage (units) =",
      "[ ]"
    ],
    "answer": [
      "800",
      "200",
      "600"
    ],
    "presentation": "steps",
    "keyboard_type": "scientific_math",
    "type": "calc",
    "unit": "market_failures",
    "topic": "price_controls",
    "subtopic": "econ_calculation",
    "skills": [
      "apply_economic_formula"
    ],
    "difficulty": 4,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Substitute the maximum price into each equation.\n- The shortage is the amount by which demand exceeds supply."
  },
  {
    "name": "Question 3",
    "question": "Select ALL the effects of a maximum price set below the equilibrium price.",
    "metadata": [
      "A surplus develops",
      "Quantity demanded increases",
      "Quantity supplied decreases",
      "A shortage develops",
      "The price rises to the equilibrium"
    ],
    "answer": [
      "Quantity demanded increases",
      "Quantity supplied decreases",
      "A shortage develops",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "market_failures",
    "topic": "price_controls",
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
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Consumers pay less, which affects buyers and sellers in opposite ways."
  },
  {
    "name": "Question 4",
    "question": "Arrange the effects of a maximum price on a market.",
    "metadata": [
      "Black markets may appear where goods sell at higher prices",
      "Quantity demanded rises and quantity supplied falls",
      "The government sets a maximum price below the equilibrium price",
      "A shortage develops in the market"
    ],
    "answer": [
      "The government sets a maximum price below the equilibrium price",
      "Quantity demanded rises and quantity supplied falls",
      "A shortage develops in the market",
      "Black markets may appear where goods sell at higher prices"
    ],
    "presentation": "ordering",
    "type": "ordering",
    "unit": "market_failures",
    "topic": "price_controls",
    "subtopic": "econ_policy_evaluation",
    "skills": [
      "evaluate_economic_policy"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Follow the sequence from the policy to the market reaction to the consequence."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "4.4",
      "marks": 8,
      "clues": "- The real question asks for a labelled graph (4 marks: axes, demand and supply curves, maximum price) and an explanation (4 marks).",
      "approach": "- Practice questions test the graph scheme on a supplied diagram and the explanation as ordering and calculation.",
      "solution": "1. Graph (max 4): axes labelled; demand and supply curves; maximum price below equilibrium indicated.\n2. Explanation (max 4): maximum price P1 below P; quantity demanded rises Q to Q2, quantity supplied falls Q to Q1; a shortage Q1 to Q2; black markets. Any other correct relevant response is accepted."
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
