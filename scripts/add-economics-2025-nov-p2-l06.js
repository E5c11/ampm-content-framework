#!/usr/bin/env node
/**
 * DBE Economics P2 — November 2025 — Question 2.2: Cost and revenue schedule (order 6)
 * Lesson 6 of 2025 Nov P2 (DESIGN-UNI-14: 3 practice questions). Question 2.2: Cost and revenue schedule. Fresh practice questions (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2025-nov-p2-l06.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2025-nov-p2-l06.js --dry-run
 *   node scripts/add-economics-2025-nov-p2-l06.js
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
  "name": "Question 2.2: Cost and revenue schedule",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2025,
  "paper": "nov_p2",
  "order": 6,
  "content_tier": "free",
  "has_video": false,
  "xp": 6,
  "tags": [
    "profit_maximisation",
    "cost_curves",
    "perfect_competition"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p2/q6/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p2/q6/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p2/q6/memo_2.png"
  ],
  "exam_question_marks": 6,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Study the cost and revenue schedule. At which quantity does the firm maximise its profit?",
    "metadata": [
      "30",
      "40",
      "50",
      "20",
      ""
    ],
    "answer": [
      "40",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "interpretation",
    "unit": "perfect_markets",
    "topic": "costs_and_revenue",
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
    "clues": "- Keep producing while marginal revenue is greater than marginal cost.\n- Find the last quantity where that is still true.",
    "supplementary_material": {
      "type": "table",
      "label": "Table",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/economics/2025/nov_p2/q6/table_1.png"
      ]
    }
  },
  {
    "name": "Question 2",
    "question": "Study the schedule. Give the term for the additional revenue earned from selling one more unit: []",
    "metadata": [
      "Term: ",
      "[ ]"
    ],
    "answer": [
      "marginal revenue",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "text",
    "type": "definition",
    "unit": "perfect_markets",
    "topic": "costs_and_revenue",
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
    "paper": "nov_p2",
    "clues": "- It is one of the columns in the table.",
    "supplementary_material": {
      "type": "table",
      "label": "Table",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/economics/2025/nov_p2/q6/table_1.png"
      ]
    }
  },
  {
    "name": "Question 3",
    "question": "Select ALL the reasons why marginal revenue stays the same in this schedule.",
    "metadata": [
      "Every extra unit is sold at the same market price",
      "The firm’s demand curve is horizontal",
      "The firm sets its own price",
      "The firm faces a downward-sloping demand curve",
      "The firm is a price-taker"
    ],
    "answer": [
      "The firm is a price-taker",
      "Every extra unit is sold at the same market price",
      "The firm’s demand curve is horizontal",
      "",
      ""
    ],
    "presentation": "multi_select",
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
    "order": 3,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- Think about what a perfectly competitive firm can and cannot decide about price.\n- Two statements describe a firm with market power.",
    "supplementary_material": {
      "type": "table",
      "label": "Table",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/economics/2025/nov_p2/q6/table_1.png"
      ]
    }
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "2.2.1",
      "marks": 1,
      "clues": "- Find where marginal revenue stops exceeding marginal cost.",
      "approach": "- Compare the MR and MC columns.\n- Pick the last quantity where MR is at least MC.",
      "solution": "1. Profit is maximised at 8 units, where marginal revenue equals marginal cost."
    },
    {
      "number": "2.2.2",
      "marks": 1,
      "clues": "- It is income per unit sold.",
      "approach": "- Recall the revenue concepts.\n- Write the term.",
      "solution": "1. Income earned by a business for each unit sold is average revenue."
    },
    {
      "number": "2.2.3",
      "marks": 2,
      "clues": "- It involves resources the entrepreneur already owns.",
      "approach": "- Define implicit cost.\n- Mention the inputs owned by the entrepreneur.",
      "solution": "1. An implicit cost is the value of inputs owned by the entrepreneur and used in production."
    },
    {
      "number": "2.2.4",
      "marks": 2,
      "clues": "- Think about what a price-taker charges for each extra unit.",
      "approach": "- State why MR does not change.\n- Link it to the price.",
      "solution": "1. A perfectly competitive firm sells every additional unit at the same price, so marginal revenue is constant."
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
