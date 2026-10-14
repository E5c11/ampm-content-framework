#!/usr/bin/env node
/**
 * DBE Economics P1 — November 2025 — Question 4.1: Trade and literacy (order 17)
 * Lesson 17 of the 2025 Nov P1 repair (DESIGN-UNI-14: 3 practice questions). Question 4.1: Trade and literacy. Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2025-nov-p1-l17.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2025-nov-p1-l17.js --dry-run
 *   node scripts/add-economics-2025-nov-p1-l17.js
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
  "name": "Question 4.1: Trade and literacy",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2025,
  "paper": "nov_p1",
  "order": 17,
  "content_tier": "free",
  "has_video": false,
  "xp": 4,
  "tags": [
    "international_trade",
    "social_indicators"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q17/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q17/memo_1.png"
  ],
  "exam_question_marks": 4,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Select ALL the demand-side reasons why countries trade with each other.",
    "metadata": [
      "Production costs are lower in another country",
      "Differences in the size of populations",
      "Differences in the preferences and tastes of consumers",
      "A country has a surplus of a natural resource",
      "Differences in income levels between countries"
    ],
    "answer": [
      "Differences in the preferences and tastes of consumers",
      "Differences in income levels between countries",
      "Differences in the size of populations",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "definition",
    "unit": "foreign_exchange_and_bop",
    "topic": "reasons_for_international_trade",
    "subtopic": "econ_classification",
    "skills": [
      "classify_economic_concept"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Demand reasons come from buyers: what they want, how much they earn and how many there are.\n- Two options describe the supply side, such as resources and costs."
  },
  {
    "name": "Question 2",
    "question": "Which measure is most likely to raise literacy levels in a developing country?",
    "metadata": [
      "Reducing the funding available to poor communities",
      "Making school attendance voluntary for all children",
      "Closing rural schools to save money",
      "Building more schools and widening access to education",
      ""
    ],
    "answer": [
      "Building more schools and widening access to education",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "economic_and_social_indicators",
    "topic": "social_indicators",
    "subtopic": "econ_policy_evaluation",
    "skills": [
      "evaluate_economic_policy"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Literacy depends on how many children can reach good teaching.\n- Three options would make access worse."
  },
  {
    "name": "Question 3",
    "question": "Which of the following is a supply-side reason for international trade rather than a demand reason?",
    "metadata": [
      "Consumers want a greater variety of goods to choose from",
      "Some countries have natural resources that others lack",
      "Incomes are much higher in some countries than in others",
      "Tastes and preferences differ between the countries",
      ""
    ],
    "answer": [
      "Some countries have natural resources that others lack",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "foreign_exchange_and_bop",
    "topic": "reasons_for_international_trade",
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
    "paper": "nov_p1",
    "clues": "- Supply-side reasons come from what producers and countries can make, not from what buyers want."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "4.1.1",
      "marks": 2,
      "clues": "- Demand reasons come from consumers in the importing country.",
      "approach": "- Recall the demand-side reasons.\n- Name any two.",
      "solution": "1. Examples include the size of the population, income levels, change in wealth, preferences and tastes, and differences in consumption patterns.\n2. Any two correct reasons earn the two marks."
    },
    {
      "number": "4.1.2",
      "marks": 2,
      "clues": "- Consider government action on schools and funding.",
      "approach": "- Give one clear measure.\n- State how it would raise literacy.",
      "solution": "1. Government can build more schools and increase access to education.\n2. It can also fund marginalised communities, run reading programmes for the early grades or make schooling compulsory."
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
