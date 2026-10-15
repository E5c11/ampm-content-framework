#!/usr/bin/env node
/**
 * DBE Economics P2 — November 2024 — Question 4.2.1–4.2.3: Perfect competition graphs (order 20)
 * Lesson 20 of 2024 Nov P2 (DESIGN-UNI-14: 4 practice questions). Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2024-nov-p2-l20.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2024-nov-p2-l20.js --dry-run
 *   node scripts/add-economics-2024-nov-p2-l20.js
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
  "name": "Question 4.2.1–4.2.3: Perfect competition graphs",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2024,
  "paper": "nov_p2",
  "order": 20,
  "content_tier": "free",
  "has_video": false,
  "xp": 10,
  "tags": [
    "perfect_competition",
    "marginal_cost"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p2/q20/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p2/q20/memo_1.png"
  ],
  "exam_question_marks": 4,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Study the firm graph (illustrative). Which curve is the supply curve of the individual firm?",
    "metadata": [
      "AC",
      "MC",
      "AR1 = MR1",
      "D",
      ""
    ],
    "answer": [
      "MC",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "reading",
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
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- A competitive firm supplies along the part of one cost curve that lies above the shut-down point.",
    "supplementary_material": {
      "type": "diagram",
      "label": "Graph",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/economics/2024/nov_p2/q20/diagram_1.png"
      ]
    }
  },
  {
    "name": "Question 2",
    "question": "Study the firm graph. At quantity q1 the firm’s average revenue is R11,00 and its average cost is R14,38. Calculate the loss per unit in rand: []",
    "metadata": [
      "Loss per unit (R) = ",
      "[ ]"
    ],
    "answer": [
      "3.38",
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
    "order": 2,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Average cost minus average revenue gives the loss on each unit.",
    "supplementary_material": {
      "type": "diagram",
      "label": "Graph",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/economics/2024/nov_p2/q20/diagram_1.png"
      ]
    }
  },
  {
    "name": "Question 3",
    "question": "What is the nature of the products sold in a perfect market?",
    "metadata": [
      "unique",
      "differentiated",
      "homogeneous",
      "branded",
      ""
    ],
    "answer": [
      "homogeneous",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "perfect_markets",
    "topic": "perfect_competition_profit_loss",
    "subtopic": "econ_term_definition",
    "skills": [
      "define_economic_term"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Buyers cannot tell the products of different sellers apart."
  },
  {
    "name": "Question 4",
    "question": "Match each curve or term to its meaning.",
    "metadata": [
      "A - Marginal revenue",
      "B - Average revenue",
      "C - Marginal cost",
      "D - Average cost",
      "1 - The cost of producing one extra unit",
      "2 - Income per unit sold",
      "3 - The total cost divided by output",
      "4 - The extra income from selling one more unit"
    ],
    "answer": [
      "A-4",
      "B-2",
      "C-1",
      "D-3"
    ],
    "presentation": "match",
    "type": "definition",
    "unit": "perfect_markets",
    "topic": "costs_and_revenue",
    "subtopic": "econ_term_definition",
    "skills": [
      "define_economic_term"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Marginal means one more unit; average means per unit."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "4.2.1",
      "marks": 1,
      "clues": "- Think of the cost curve that is a perfectly competitive firm's supply curve.",
      "approach": "- Identify the curve.",
      "solution": "The marginal cost curve (MC)."
    },
    {
      "number": "4.2.2",
      "marks": 1,
      "clues": "- Think of products that are identical.",
      "approach": "- State the nature.",
      "solution": "Homogeneous / identical."
    },
    {
      "number": "4.2.3",
      "marks": 2,
      "clues": "- Think of income from one extra unit.",
      "approach": "- Describe the term.",
      "solution": "Marginal revenue is the additional income gained from selling one extra unit of a product."
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
