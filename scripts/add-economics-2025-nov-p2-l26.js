#!/usr/bin/env node
/**
 * DBE Economics P2 — November 2025 — Question 5: The monopoly graph (order 26)
 * Lesson 26 of 2025 Nov P2 (DESIGN-UNI-14: 4 practice questions). Question 5: The monopoly graph. Fresh practice questions (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2025-nov-p2-l26.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2025-nov-p2-l26.js --dry-run
 *   node scripts/add-economics-2025-nov-p2-l26.js
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
  "name": "Question 5: The monopoly graph",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2025,
  "paper": "nov_p2",
  "order": 26,
  "content_tier": "free",
  "has_video": false,
  "xp": 4,
  "tags": [
    "monopoly_market",
    "profit_maximisation"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p2/q26/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p2/q26/memo_1.png"
  ],
  "exam_question_marks": 4,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Study the graph of a monopoly in the long run. At which quantity does the monopolist maximise profit?",
    "metadata": [
      "Q = 50",
      "Q = 100",
      "Q = 150",
      "Q = 200",
      ""
    ],
    "answer": [
      "Q = 100",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "interpretation",
    "unit": "imperfect_markets",
    "topic": "monopoly",
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
    "clues": "- Profit is maximised where marginal revenue equals marginal cost.\n- Check where the MR and MC curves cross.",
    "supplementary_material": {
      "type": "graph",
      "label": "Graph",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/economics/2025/nov_p2/q26/graph_1.png"
      ]
    }
  },
  {
    "name": "Question 2",
    "question": "Study the graph. Select ALL the statements that are true.",
    "metadata": [
      "Average cost at that output is below the price",
      "Marginal revenue lies below the demand curve",
      "The firm earns only a normal profit at this output",
      "The price is read from the demand curve at that output",
      "The monopolist earns an economic profit"
    ],
    "answer": [
      "The price is read from the demand curve at that output",
      "Average cost at that output is below the price",
      "The monopolist earns an economic profit",
      "Marginal revenue lies below the demand curve",
      ""
    ],
    "presentation": "multi_select",
    "type": "interpretation",
    "unit": "imperfect_markets",
    "topic": "monopoly",
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
    "clues": "- The monopolist reads the price off D = AR after choosing the quantity.\n- Economic profit is the gap between price and average cost.",
    "supplementary_material": {
      "type": "graph",
      "label": "Graph",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/economics/2025/nov_p2/q26/graph_1.png"
      ]
    }
  },
  {
    "name": "Question 3",
    "question": "Study the graph. Calculate the monopolist’s total economic profit in rand (price R30, average cost R18, quantity 100): []",
    "metadata": [
      "Total profit (R): ",
      "[ ]"
    ],
    "answer": [
      "1200",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "type": "calc",
    "unit": "imperfect_markets",
    "topic": "monopoly",
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
    "clues": "- Profit per unit is price minus average cost.\n- Multiply by the quantity produced.",
    "supplementary_material": {
      "type": "graph",
      "label": "Graph",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/economics/2025/nov_p2/q26/graph_1.png"
      ]
    }
  },
  {
    "name": "Question 4",
    "question": "Arrange the steps for drawing a monopoly’s long-run economic profit.",
    "metadata": [
      "Read the price from the demand curve and mark the profit area between price and AC",
      "Draw the demand (AR) and marginal revenue curves, with MR below demand",
      "Find the output where MR = MC",
      "Draw the MC and AC curves"
    ],
    "answer": [
      "Draw the demand (AR) and marginal revenue curves, with MR below demand",
      "Draw the MC and AC curves",
      "Find the output where MR = MC",
      "Read the price from the demand curve and mark the profit area between price and AC"
    ],
    "presentation": "ordering",
    "type": "application",
    "unit": "imperfect_markets",
    "topic": "monopoly",
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
    "clues": "- Revenue curves and cost curves come first, then the equilibrium, then the profit area.",
    "supplementary_material": {
      "type": "graph",
      "label": "Graph",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/economics/2025/nov_p2/q26/graph_1.png"
      ]
    }
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "5",
      "marks": 4,
      "clues": "- The graph earns 1 mark each for cost curves, revenue curves, the equilibrium point and the economic profit.",
      "approach": "- Draw MC and AC.\n- Draw D = AR and MR below it.\n- Mark MR = MC and the profit rectangle.",
      "solution": "1. Correct positioning and labelling of cost curves (1).\n2. Correct drawing and labelling of revenue curves (1).\n3. Correct indication of the profit-maximising equilibrium (1).\n4. Correct indication of economic profit (1)."
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
