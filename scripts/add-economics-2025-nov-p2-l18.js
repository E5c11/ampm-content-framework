#!/usr/bin/env node
/**
 * DBE Economics P2 — November 2025 — Question 4.1: School costs and soil erosion (order 18)
 * Lesson 18 of 2025 Nov P2 (DESIGN-UNI-14: 3 practice questions). Question 4.1: School costs and soil erosion. Fresh practice questions (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2025-nov-p2-l18.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2025-nov-p2-l18.js --dry-run
 *   node scripts/add-economics-2025-nov-p2-l18.js
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
  "name": "Question 4.1: School costs and soil erosion",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2025,
  "paper": "nov_p2",
  "order": 18,
  "content_tier": "free",
  "has_video": false,
  "xp": 4,
  "tags": [
    "externalities",
    "environmental_policy"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p2/q18/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p2/q18/memo_1.png"
  ],
  "exam_question_marks": 4,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Select ALL the private costs of building a school.",
    "metadata": [
      "Building materials",
      "Labour costs",
      "The cost of the land",
      "Noise and dust that disturb the neighbours",
      "Loss of green space for the community"
    ],
    "answer": [
      "Building materials",
      "Labour costs",
      "The cost of the land",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "definition",
    "unit": "market_failures",
    "topic": "externalities_and_efficiency",
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
    "paper": "nov_p2",
    "clues": "- A private cost is paid by the builder.\n- Two options fall on people who are not part of the project."
  },
  {
    "name": "Question 2",
    "question": "Select ALL the ways in which soil erosion can affect agricultural production.",
    "metadata": [
      "It reduces soil fertility and output",
      "It can damage the landscape and close water sources",
      "It may push farmers to adopt soil conservation such as terracing",
      "It raises soil fertility",
      "It increases yields without any cost"
    ],
    "answer": [
      "It reduces soil fertility and output",
      "It can damage the landscape and close water sources",
      "It may push farmers to adopt soil conservation such as terracing",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "environmental_sustainability",
    "topic": "environmental_problems",
    "subtopic": "econ_cause_and_effect",
    "skills": [
      "explain_economic_impact"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- Erosion removes the layer of soil that crops grow in."
  },
  {
    "name": "Question 3",
    "question": "A new school’s construction raises dust and noise for nearby residents, who are not compensated. What kind of cost is this?",
    "metadata": [
      "A private cost",
      "An external cost",
      "A fixed cost",
      "A marginal cost",
      ""
    ],
    "answer": [
      "An external cost",
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
    "order": 3,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- Ask who bears the cost."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "4.1.1",
      "marks": 2,
      "clues": "- A private cost is paid by the person or firm doing the project.",
      "approach": "- Recall the costs of construction.\n- Name any two.",
      "solution": "1. Examples include building material costs, labour costs, overhead costs, the cost of land, and water and electricity."
    },
    {
      "number": "4.1.2",
      "marks": 2,
      "clues": "- Link erosion to soil, water and long-term productivity.",
      "approach": "- Give one clear effect.",
      "solution": "1. Soil erosion may reduce soil fertility and so decrease output.\n2. It can also damage the landscape and close water sources, or lead farmers to adopt conservation techniques such as terracing."
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
