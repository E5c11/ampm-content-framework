#!/usr/bin/env node
/**
 * DBE Agricultural Sciences P2 — November 2025 — Question 2.5–2.6: Price and demand graph and marketing channels (order 10)
 * Question 2.5–2.6 — reading and constructing a graph of price and demand, income, the effect of festive seasons and marketing channels. Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-agricultural-sciences-2025-nov-p2-l10.js --curriculum temp/curriculum-vocab-agricultural-sciences.json
 *   node scripts/add-agricultural-sciences-2025-nov-p2-l10.js --dry-run
 *   node scripts/add-agricultural-sciences-2025-nov-p2-l10.js
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
  "name": "Question 2.5–2.6: Price and demand graph and marketing channels",
  "syllabus": "dbe",
  "subject": "agricultural_sciences",
  "year": 2025,
  "paper": "nov_p2",
  "order": 10,
  "content_tier": "free",
  "has_video": false,
  "xp": 11,
  "tags": [
    "price_and_demand_graph",
    "income_from_sales",
    "marketing_channels"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p2/q10/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p2/q10/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p2/q10/memo_1.png"
  ],
  "exam_question_marks": 11,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Select ALL the criteria that a correct bar graph of the price and the demand of goats over six months must meet.",
    "metadata": [
      "A smooth line that joins the bar tops",
      "A heading that names both variables",
      "The months on the x-axis with a label",
      "A key to show price and demand",
      "A y-axis without a label or unit"
    ],
    "answer": [
      "A heading that names both variables",
      "The months on the x-axis with a label",
      "A key to show price and demand",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "agricultural_management_and_marketing",
    "topic": "price_and_demand_graph",
    "subtopic": "agri_data_interpretation",
    "skills": [
      "interpret_agricultural_data"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- The memo marks the heading, axis labels, correct units, the type of graph and accuracy."
  },
  {
    "name": "Question 2",
    "question": "Use the graph to calculate the income from the goats sold in April, in rand. (income = price × number sold) []",
    "metadata": [
      "Income (R): ",
      "[ ]"
    ],
    "answer": [
      "1800000",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "type": "calc",
    "unit": "agricultural_management_and_marketing",
    "topic": "price_and_demand_graph",
    "subtopic": "agri_calculation",
    "skills": [
      "apply_agricultural_formula"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- Income is the price multiplied by the number sold.\n- Read the price and the demand for April from the graph, using the key to tell the bars apart.",
    "supplementary_material": {
      "type": "graph",
      "label": "Price and demand of goats over six months (illustrative data)",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/agricultural_sciences/2025/nov_p2/q10/graph_1.png"
      ]
    }
  },
  {
    "name": "Question 3",
    "question": "The graph shows that demand for goats is far higher in April than in the other months. Which factor could explain this?",
    "metadata": [
      "A fall in the price of feed",
      "A drought in the grazing area",
      "The Easter holiday",
      "A ban on slaughtering",
      ""
    ],
    "answer": [
      "The Easter holiday",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "interpretation",
    "unit": "agricultural_management_and_marketing",
    "topic": "price_and_demand_graph",
    "subtopic": "agri_cause_and_effect",
    "skills": [
      "explain_agricultural_cause_and_effect"
    ],
    "difficulty": 3,
    "exam_weight": 1,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- Look for an event that increases meat buying for one month only.",
    "supplementary_material": {
      "type": "graph",
      "label": "Price and demand of goats over six months (illustrative data)",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/agricultural_sciences/2025/nov_p2/q10/graph_1.png"
      ]
    }
  },
  {
    "name": "Question 4",
    "question": "Match each statement to the marketing channel it describes.",
    "metadata": [
      "A - A farmer sells eggs to people who visit the farm",
      "B - An agent sells fruit and vegetables at the municipal market",
      "C - Products are advertised and sold on a website",
      "D - A farmer sells cattle by bidding at a public sale",
      "1 - Farm-gate marketing",
      "2 - Fresh produce market",
      "3 - Internet marketing",
      "4 - Auction"
    ],
    "answer": [
      "A-1",
      "B-2",
      "C-3",
      "D-4"
    ],
    "presentation": "match",
    "type": "application",
    "unit": "agricultural_management_and_marketing",
    "topic": "marketing_channels",
    "subtopic": "agri_classification",
    "skills": [
      "classify_farm_concept"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p2"
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "2.5.1",
      "marks": 6,
      "clues": "- The memo awards marks for the heading, the axes, the unit, the type of graph and accuracy.\n- Two variables are plotted for six months.",
      "approach": "- Draw a bar graph with a heading naming both variables.\n- Label the x-axis (months) and calibrate and label the y-axis (price in rand and demand).\n- Plot each value accurately with a key.",
      "solution": "1. Correct heading (1).\n2. X-axis calibrated and labelled (1) and y-axis calibrated and labelled (1).\n3. Correct unit (R) (1), bar graph (1) and accuracy of at least 80% (1)."
    },
    {
      "number": "2.5.2",
      "marks": 1,
      "clues": "- Income is price multiplied by the quantity sold.\n- Compare the months.",
      "approach": "- Multiply the price by the demand for each month.\n- Find the largest result.",
      "solution": "1. The highest income was in December (R2 000 × 1 050)."
    },
    {
      "number": "2.5.3",
      "marks": 1,
      "clues": "- Think about a time of year when people buy more meat.\n- It is a holiday period.",
      "approach": "- Look at the month of highest demand.\n- Deduce what is special about it.",
      "solution": "1. The festive season led to the higher demand in December."
    },
    {
      "number": "2.6.1",
      "marks": 1,
      "clues": "- The eggs are sold where they are produced.\n- The buyers come to the farm.",
      "approach": "- Read the statement.\n- Name the channel.",
      "solution": "1. Selling on the farm is farm-gate marketing."
    },
    {
      "number": "2.6.2",
      "marks": 1,
      "clues": "- An agent sells produce at a municipal market.\n- Fruit and vegetables are fresh produce.",
      "approach": "- Read the statement.\n- Name the channel.",
      "solution": "1. Fruit and vegetables sold by an agent at a municipal market use the fresh produce markets channel."
    },
    {
      "number": "2.6.3",
      "marks": 1,
      "clues": "- The products are advertised and sold electronically.\n- Think about websites and apps.",
      "approach": "- Read the statement.\n- Name the channel.",
      "solution": "1. Electronically advertised and sold products use internet (online) marketing."
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
