#!/usr/bin/env node
/**
 * DBE Economics P1 — November 2024 — Question 3.3.4–3.3.5: Healthcare and falling productivity (order 15)
 * Lesson 15 of 2024 Nov P1 (DESIGN-UNI-14: 3 practice questions). Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2024-nov-p1-l15.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2024-nov-p1-l15.js --dry-run
 *   node scripts/add-economics-2024-nov-p1-l15.js
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
  "name": "Question 3.3.4–3.3.5: Healthcare and falling productivity",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2024,
  "paper": "nov_p1",
  "order": 15,
  "content_tier": "free",
  "has_video": false,
  "xp": 8,
  "tags": [
    "labour_productivity",
    "social_indicators"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p1/q15/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p1/q15/memo_1.png"
  ],
  "exam_question_marks": 6,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Why is access to healthcare services important to the labour force?",
    "metadata": [
      "Healthy workers are able to work longer and more productively",
      "It lowers the number of people who are able to work",
      "It makes workers earn less over their lifetime",
      "It means firms need fewer skilled workers in general",
      ""
    ],
    "answer": [
      "Healthy workers are able to work longer and more productively",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "economic_and_social_indicators",
    "topic": "social_indicators",
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
    "paper": "nov_p1",
    "clues": "- Think about what illness does to a worker’s output."
  },
  {
    "name": "Question 2",
    "question": "Select ALL the possible effects of a decrease in labour productivity on the economy.",
    "metadata": [
      "Average cost of production falls",
      "Cost-push inflation may rise",
      "Output falls and growth slows",
      "Export volumes fall, which can cause a balance of payments deficit",
      "Unemployment falls because output is high"
    ],
    "answer": [
      "Cost-push inflation may rise",
      "Output falls and growth slows",
      "Export volumes fall, which can cause a balance of payments deficit",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "economic_and_social_indicators",
    "topic": "economic_performance_indicators",
    "subtopic": "econ_classification",
    "skills": [
      "classify_economic_concept"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Less output per worker means higher cost per unit.\n- Think about what this does to prices, growth and trade."
  },
  {
    "name": "Question 3",
    "question": "Arrange the effects of falling labour productivity in the order in which they follow one another.",
    "metadata": [
      "Household income and demand fall",
      "Output per worker falls and average cost rises",
      "Labour productivity falls",
      "Firms cut production and jobs"
    ],
    "answer": [
      "Labour productivity falls",
      "Output per worker falls and average cost rises",
      "Firms cut production and jobs",
      "Household income and demand fall"
    ],
    "presentation": "ordering",
    "type": "ordering",
    "unit": "economic_and_social_indicators",
    "topic": "economic_performance_indicators",
    "subtopic": "econ_policy_evaluation",
    "skills": [
      "evaluate_economic_policy"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Start with the fall in productivity and follow its effect first on firms, then on households."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "3.3.4",
      "marks": 2,
      "clues": "- Think about health and output.",
      "approach": "- Give one developed point.",
      "solution": "1. Access to healthcare improves workers' mental and physical ability, which raises productivity.\n2. Affordable healthcare contains workers' costs of living and helps retain skilled labour. Any other correct relevant response is accepted."
    },
    {
      "number": "3.3.5",
      "marks": 4,
      "clues": "- Think about cost, output, trade and jobs.",
      "approach": "- Give two developed points of 2 marks each.",
      "solution": "1. Lower productivity raises the average cost of production, which can lead to cost-push inflation.\n2. Output falls, so growth slows and unemployment may rise.\n3. Fewer exports may cause a balance of payments deficit.\n4. Job losses reduce demand for goods and services. Any other correct relevant response is accepted."
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
