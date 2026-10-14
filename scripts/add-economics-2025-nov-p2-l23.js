#!/usr/bin/env node
/**
 * DBE Economics P2 — November 2025 — Question 4.4: Economic loss of a perfectly competitive firm (order 23)
 * Lesson 23 of 2025 Nov P2 (DESIGN-UNI-14: 4 practice questions). Question 4.4: Economic loss of a perfectly competitive firm. Fresh practice questions (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2025-nov-p2-l23.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2025-nov-p2-l23.js --dry-run
 *   node scripts/add-economics-2025-nov-p2-l23.js
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
  "name": "Question 4.4: Economic loss of a perfectly competitive firm",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2025,
  "paper": "nov_p2",
  "order": 23,
  "content_tier": "free",
  "has_video": false,
  "xp": 8,
  "tags": [
    "perfect_competition",
    "profit_maximisation",
    "cost_curves"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p2/q23/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p2/q23/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p2/q23/memo_2.png"
  ],
  "exam_question_marks": 8,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Study the graph of a perfectly competitive firm. At which quantity does the firm minimise its loss?",
    "metadata": [
      "Q = 50",
      "Q = 100",
      "Q = 150",
      "Q = 200",
      ""
    ],
    "answer": [
      "Q = 150",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
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
    "order": 1,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- The firm produces where marginal revenue equals marginal cost.\n- In the graph that is the point labelled e.",
    "supplementary_material": {
      "type": "graph",
      "label": "Graph",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/economics/2025/nov_p2/q23/graph_1.png"
      ]
    }
  },
  {
    "name": "Question 2",
    "question": "Study the graph. Select ALL the statements that are true.",
    "metadata": [
      "The firm makes a loss because AR is below AC",
      "The firm sets the price at P1 for its product",
      "The firm earns an economic profit at this output",
      "The firm minimises its loss where MR = MC",
      "The firm’s demand curve is horizontal"
    ],
    "answer": [
      "The firm makes a loss because AR is below AC",
      "The firm’s demand curve is horizontal",
      "The firm minimises its loss where MR = MC",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "interpretation",
    "unit": "perfect_markets",
    "topic": "perfect_competition_profit_loss",
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
    "clues": "- Compare the price (AR) with the average cost at the chosen quantity.\n- A price-taker cannot choose its own price.",
    "supplementary_material": {
      "type": "graph",
      "label": "Graph",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/economics/2025/nov_p2/q23/graph_1.png"
      ]
    }
  },
  {
    "name": "Question 3",
    "question": "Study the graph. Calculate the firm’s total economic loss in rand (price R8, average cost R11, quantity 150): []",
    "metadata": [
      "Total loss (R): ",
      "[ ]"
    ],
    "answer": [
      "450",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "type": "calc",
    "unit": "perfect_markets",
    "topic": "perfect_competition_profit_loss",
    "subtopic": "econ_calculation",
    "skills": [
      "apply_economic_formula"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- Loss per unit is average cost minus price.\n- Multiply the loss per unit by the quantity produced.",
    "supplementary_material": {
      "type": "graph",
      "label": "Graph",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/economics/2025/nov_p2/q23/graph_1.png"
      ]
    }
  },
  {
    "name": "Question 4",
    "question": "Arrange the steps for explaining the firm’s economic loss from the graph.",
    "metadata": [
      "Calculate the loss: (AC − price) × quantity",
      "Read the price and quantity at that point",
      "Find the output where MR = MC at point e",
      "Compare average revenue with average cost at that quantity"
    ],
    "answer": [
      "Find the output where MR = MC at point e",
      "Read the price and quantity at that point",
      "Compare average revenue with average cost at that quantity",
      "Calculate the loss: (AC − price) × quantity"
    ],
    "presentation": "ordering",
    "type": "application",
    "unit": "perfect_markets",
    "topic": "perfect_competition_profit_loss",
    "subtopic": "econ_cause_and_effect",
    "skills": [
      "explain_economic_impact"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- Start with the profit-maximising rule and finish with the number.",
    "supplementary_material": {
      "type": "graph",
      "label": "Graph",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/economics/2025/nov_p2/q23/graph_1.png"
      ]
    }
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "4.4",
      "marks": 8,
      "clues": "- The 8 marks are 4 for the correctly labelled graph and 4 for the explanation.\n- The graph earns 1 mark each for the axes, the cost curves, the revenue curves and the loss.",
      "approach": "- Draw axes labelled Price, Cost, Revenue and Quantity.\n- Draw MC and AC, and the horizontal D = AR = MR below the AC curve.\n- Mark the equilibrium where MR = MC and indicate the loss area.\n- Explain the loss with the calculation.",
      "solution": "1. Axes labelled correctly (1), cost curves drawn and labelled (1), revenue curve positioned and labelled (1), economic loss indicated (1).\n2. The firm minimises loss at point e where MR = MC, producing 100 units at a price of R10.\n3. It makes an economic loss because average revenue (R10) is less than average cost (R12).\n4. Total loss = TR - TC = (10 x 100) - (12 x 100) = -R200."
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
