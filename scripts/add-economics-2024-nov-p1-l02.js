#!/usr/bin/env node
/**
 * DBE Economics P1 — November 2024 — Question 1.1.5–1.1.8: Protection, living standards and health (order 2)
 * Lesson 2 of 2024 Nov P1 (DESIGN-UNI-14: 4 practice questions). Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2024-nov-p1-l02.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2024-nov-p1-l02.js --dry-run
 *   node scripts/add-economics-2024-nov-p1-l02.js
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
  "name": "Question 1.1.5–1.1.8: Protection, living standards and health",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2024,
  "paper": "nov_p1",
  "order": 2,
  "content_tier": "free",
  "has_video": false,
  "xp": 10,
  "tags": [
    "protectionism",
    "economic_indicators",
    "regional_development",
    "social_indicators"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p1/q2/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p1/q2/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p1/q2/memo_1.png"
  ],
  "exam_question_marks": 8,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "To shield local clothing producers from cheap imports, a government places high tariffs and strict quotas on imported clothes. Which trade policy is this?",
    "metadata": [
      "Export promotion",
      "Protectionism",
      "Free trade",
      "Trade liberalisation",
      ""
    ],
    "answer": [
      "Protectionism",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "protection_and_free_trade",
    "topic": "tariffs_and_trade_barriers",
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
    "clues": "- Notice that the policy makes imports harder to bring in.\n- Free-trade policies do the opposite."
  },
  {
    "name": "Question 2",
    "question": "A country has a GDP of R900 billion and a population of 30 million. Calculate its per capita GDP in rand: []",
    "metadata": [
      "Per capita GDP (R): ",
      "[ ]"
    ],
    "answer": [
      "30000",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "type": "calc",
    "unit": "economic_and_social_indicators",
    "topic": "economic_performance_indicators",
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
    "paper": "nov_p1",
    "clues": "- Per capita means for each person.\n- Divide the GDP by the number of people, keeping both in the same units (R900 billion = R900 000 million)."
  },
  {
    "name": "Question 3",
    "question": "A regional development programme publishes its budgets, consults communities before taking decisions and holds officials answerable for results. Which international benchmark criterion does this show?",
    "metadata": [
      "Integration",
      "Good governance",
      "Partnership",
      "Free-market orientation",
      ""
    ],
    "answer": [
      "Good governance",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "growth_and_development",
    "topic": "regional_development",
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
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Focus on openness, democratic decision-making and accountability.\n- The other criteria deal with links between regions, cooperation and markets."
  },
  {
    "name": "Question 4",
    "question": "Select ALL the social indicators that measure the health of a population.",
    "metadata": [
      "Gini coefficient",
      "Life expectancy",
      "Under-five mortality rate",
      "HIV prevalence rate",
      "Adult literacy rate"
    ],
    "answer": [
      "Life expectancy",
      "Under-five mortality rate",
      "HIV prevalence rate",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "definition",
    "unit": "economic_and_social_indicators",
    "topic": "social_indicators",
    "subtopic": "econ_term_definition",
    "skills": [
      "define_economic_term"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Health indicators describe how long people live and how often they fall ill or die.\n- Education and income distribution are measured by other indicators."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "1.1.5",
      "marks": 2,
      "clues": "- Look for a policy that restricts imports to guard local industries.",
      "approach": "- Link the description to the trade policy it defines.",
      "solution": "1. Restricting certain imports to prevent unfair foreign competition is protectionism (A).\n2. Export promotion and import substitution are different strategies; free trade removes restrictions."
    },
    {
      "number": "1.1.6",
      "marks": 2,
      "clues": "- Choose the measure that takes population size into account.",
      "approach": "- Standard of living is output per person.",
      "solution": "1. The standard of living is measured by per capita GDP (D).\n2. Real and nominal GDP and national income are totals and do not show output per person."
    },
    {
      "number": "1.1.7",
      "marks": 2,
      "clues": "- Look for democratic decision-making and transparency.",
      "approach": "- Match the criterion to the description.",
      "solution": "1. Requiring democratic decision-making and transparency describes good governance (A).\n2. Integration, partnership and free-market orientation describe other criteria."
    },
    {
      "number": "1.1.8",
      "marks": 2,
      "clues": "- Think about the number of years a newborn is expected to live.",
      "approach": "- Name the indicator for expected lifespan.",
      "solution": "1. The probable number of years a person lives after birth is life expectancy (B).\n2. Child mortality and under-five mortality count deaths, and population growth measures numbers."
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
