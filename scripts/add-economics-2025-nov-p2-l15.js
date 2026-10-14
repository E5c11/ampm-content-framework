#!/usr/bin/env node
/**
 * DBE Economics P2 — November 2025 — Question 3.3.4–3.3.5: Indigenous knowledge and market failure (order 15)
 * Lesson 15 of 2025 Nov P2 (DESIGN-UNI-14: 3 practice questions). Question 3.3.4–3.3.5: Indigenous knowledge and market failure. Fresh practice questions (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2025-nov-p2-l15.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2025-nov-p2-l15.js --dry-run
 *   node scripts/add-economics-2025-nov-p2-l15.js
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
  "name": "Question 3.3.4–3.3.5: Indigenous knowledge and market failure",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2025,
  "paper": "nov_p2",
  "order": 15,
  "content_tier": "free",
  "has_video": false,
  "xp": 6,
  "tags": [
    "environmental_policy",
    "market_failure",
    "externalities"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p2/q15/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p2/q15/memo_1.png"
  ],
  "exam_question_marks": 6,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "A community stops passing on traditional knowledge about when and how much to harvest wild plants. What is the most likely effect on the environment?",
    "metadata": [
      "Faster growth of protected species",
      "Cleaner rivers",
      "Lower demand for plants",
      "Over-exploitation of natural resources",
      ""
    ],
    "answer": [
      "Over-exploitation of natural resources",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "environmental_sustainability",
    "topic": "environmental_problems",
    "subtopic": "econ_cause_and_effect",
    "skills": [
      "explain_economic_impact"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- The knowledge helped people use resources without using them up."
  },
  {
    "name": "Question 2",
    "question": "Select ALL the reasons why markets fail to ensure environmental sustainability.",
    "metadata": [
      "Many parts of the environment, such as air and seas, are not privately owned",
      "Many environmental resources have no price",
      "Firms do not pay the external costs of pollution",
      "Markets always price the environment fully",
      "Firms never overproduce"
    ],
    "answer": [
      "Many parts of the environment, such as air and seas, are not privately owned",
      "Many environmental resources have no price",
      "Firms do not pay the external costs of pollution",
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
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- Markets work through prices and private ownership.\n- Two statements claim the market gets everything right."
  },
  {
    "name": "Question 3",
    "question": "A factory dumps waste into a river and does not pay for the damage to downstream fishermen. What does this illustrate?",
    "metadata": [
      "A positive externality",
      "A negative externality",
      "Pareto efficiency",
      "A public good",
      ""
    ],
    "answer": [
      "A negative externality",
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
    "clues": "- The cost falls on people who were not part of the transaction."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "3.3.4",
      "marks": 2,
      "clues": "- Think about what traditional knowledge helps communities do with nature.",
      "approach": "- State one impact.\n- Link it to the use of resources.",
      "solution": "1. Environmental damage may increase because future generations cannot co-exist with the environment without indigenous knowledge.\n2. The loss may lead to over-exploitation of natural resources."
    },
    {
      "number": "3.3.5",
      "marks": 4,
      "clues": "- Link missing ownership and prices to the lack of incentive to protect nature.",
      "approach": "- Choose two reasons.\n- Develop each (2 x 2).",
      "solution": "1. The environment is a common resource, with air and seas not privately owned.\n2. Many environmental resources have no price, so there is no incentive to economise.\n3. Firms overproduce goods with negative externalities because they do not bear the external costs.\n4. The profit motive may lead firms to cut costs at the expense of the environment."
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
