#!/usr/bin/env node
/**
 * DBE Economics P2 — November 2025 — Question 1.1.1–1.1.4: Costs, demand and prices (order 1)
 * Lesson 1 of 2025 Nov P2 (DESIGN-UNI-14: 4 practice questions). Question 1.1.1–1.1.4: Costs, demand and prices. Fresh practice questions (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2025-nov-p2-l01.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2025-nov-p2-l01.js --dry-run
 *   node scripts/add-economics-2025-nov-p2-l01.js
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
  "name": "Question 1.1.1–1.1.4: Costs, demand and prices",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2025,
  "paper": "nov_p2",
  "order": 1,
  "content_tier": "free",
  "has_video": false,
  "xp": 8,
  "tags": [
    "cost_curves",
    "market_structures",
    "price_controls"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p2/q1/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p2/q1/memo_1.png"
  ],
  "exam_question_marks": 8,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "A firm’s fixed costs stay at R20 000 while it raises output from 100 to 400 units. Which cost per unit is certain to fall as output rises?",
    "metadata": [
      "Average variable cost",
      "Marginal cost",
      "Average fixed cost",
      "Total cost",
      ""
    ],
    "answer": [
      "Average fixed cost",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "perfect_markets",
    "topic": "costs_and_revenue",
    "subtopic": "econ_cause_and_effect",
    "skills": [
      "explain_economic_impact"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- The same fixed amount is spread over more and more units.\n- Two of the options usually rise at higher levels of output."
  },
  {
    "name": "Question 2",
    "question": "A hairdresser in a city with dozens of salons, each with a slightly different style, finds that a small price rise sends many clients to rivals. What does this tell us about her demand curve?",
    "metadata": [
      "It is relatively elastic because close substitutes exist",
      "It is perfectly inelastic",
      "It is relatively inelastic because the product is unique",
      "It is perfectly elastic at the market price",
      ""
    ],
    "answer": [
      "It is relatively elastic because close substitutes exist",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "imperfect_markets",
    "topic": "oligopoly_and_competition_policy",
    "subtopic": "econ_cause_and_effect",
    "skills": [
      "explain_economic_impact"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- Think about how easily a client can switch to a similar service.\n- One option describes a firm with no influence at all over price, which is a different market structure."
  },
  {
    "name": "Question 3",
    "question": "Select ALL the statements that are true of a minimum price set by government.",
    "metadata": [
      "It is set above the equilibrium price",
      "It is meant to give producers a fair income",
      "It can create a surplus of the product",
      "It is set below the equilibrium price",
      "It prevents any surplus from forming"
    ],
    "answer": [
      "It is set above the equilibrium price",
      "It is meant to give producers a fair income",
      "It can create a surplus of the product",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "definition",
    "unit": "market_failures",
    "topic": "misallocation_of_resources",
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
    "paper": "nov_p2",
    "clues": "- A minimum price only matters if it is higher than what the market would settle on.\n- Two statements describe a maximum price instead, or the opposite of the outcome."
  },
  {
    "name": "Question 4",
    "question": "Match each type of inefficiency to its description.",
    "metadata": [
      "A - Productive inefficiency",
      "B - Allocative inefficiency",
      "C - Distributive inefficiency",
      "1 - Output is not produced at the lowest possible average cost",
      "2 - Resources are not used to make the goods that consumers value most",
      "3 - Goods are not shared out in the way that best satisfies society"
    ],
    "answer": [
      "A-1",
      "B-2",
      "C-3"
    ],
    "presentation": "match",
    "type": "definition",
    "unit": "market_failures",
    "topic": "misallocation_of_resources",
    "subtopic": "econ_classification",
    "skills": [
      "classify_economic_concept"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- Focus on whether the problem is about cost, about what is produced, or about who receives it."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "1.1.1",
      "marks": 2,
      "clues": "- Think about what happens to a fixed amount spread over a rising number of units.",
      "approach": "- Recall the cost that falls continuously as output rises.\n- Match it to the option.",
      "solution": "1. Fixed costs do not change with output, so fixed cost per unit falls whenever output rises.\n2. Average fixed cost always decreases as production increases, so D is correct."
    },
    {
      "number": "1.1.2",
      "marks": 2,
      "clues": "- Many close substitutes make buyers responsive to price.",
      "approach": "- Recall the features of monopolistic competition.\n- Link close substitutes to the elasticity of demand.",
      "solution": "1. A monopolistic competitor sells a differentiated product with many close substitutes.\n2. Its demand curve is therefore relatively elastic, so A is correct."
    },
    {
      "number": "1.1.3",
      "marks": 2,
      "clues": "- Decide whether the price is set above or below the market price.",
      "approach": "- Recall the two price controls.\n- Note who the control is meant to protect.",
      "solution": "1. A price set above the equilibrium price to give producers a fair profit is a minimum price.\n2. D is correct; a maximum price is set below equilibrium to protect consumers."
    },
    {
      "number": "1.1.4",
      "marks": 2,
      "clues": "- The failure is about cost, not about what is produced.",
      "approach": "- Separate productive from allocative inefficiency.\n- Choose the one linked to lowest average cost.",
      "solution": "1. Failing to produce at the lowest possible average cost is productive inefficiency.\n2. C is correct."
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
