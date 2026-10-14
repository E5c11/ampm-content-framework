#!/usr/bin/env node
/**
 * DBE Economics P1 — November 2025 — Question 1.2: Exchange rates and monetary policy (order 3)
 * Lesson 3 of the 2025 Nov P1 repair (DESIGN-UNI-14: 3 practice questions). Question 1.2: Exchange rates and monetary policy. Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2025-nov-p1-l03.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2025-nov-p1-l03.js --dry-run
 *   node scripts/add-economics-2025-nov-p1-l03.js
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
  "name": "Question 1.2: Exchange rates and monetary policy",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2025,
  "paper": "nov_p1",
  "order": 3,
  "content_tier": "free",
  "has_video": false,
  "xp": 8,
  "tags": [
    "exchange_rates",
    "fiscal_policy",
    "trade_policy"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q3/question_11.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q3/memo_11.png"
  ],
  "exam_question_marks": 8,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Match each exchange-rate system to the description that fits it.",
    "metadata": [
      "A - Free-floating",
      "B - Pegged (fixed)",
      "C - Managed float",
      "1 - Supply and demand set the value, and the central bank stays out of the market",
      "2 - The government sets the value against a reference currency",
      "3 - Market forces set the value, but the central bank steps in to smooth large swings"
    ],
    "answer": [
      "A-1",
      "B-2",
      "C-3"
    ],
    "presentation": "match",
    "type": "definition",
    "unit": "foreign_exchange_and_bop",
    "topic": "currency_exchange_rates",
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
    "clues": "- Decide for each system who sets the price of the currency.\n- One system sits between full market determination and full government control."
  },
  {
    "name": "Question 2",
    "question": "Which of the following is a monetary policy action?",
    "metadata": [
      "Treasury raises the VAT rate",
      "Government cuts its spending on road projects",
      "Government increases social grants",
      "The Reserve Bank raises the repo rate to slow credit growth",
      ""
    ],
    "answer": [
      "The Reserve Bank raises the repo rate to slow credit growth",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "public_sector",
    "topic": "fiscal_and_monetary_policy",
    "subtopic": "econ_classification",
    "skills": [
      "classify_economic_concept"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Monetary policy works through interest rates and the money supply.\n- Three options are decisions about taxes or government budgets."
  },
  {
    "name": "Question 3",
    "question": "Several clothing manufacturers, fabric suppliers and a textile training college are clustered in one district of a city. What is this kind of area called?",
    "metadata": [
      "A customs union",
      "An industrial hub",
      "A price-control zone",
      "A trade bloc",
      ""
    ],
    "answer": [
      "An industrial hub",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "growth_and_development",
    "topic": "industrial_policy",
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
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Look for the term for firms of one sector grouping together in one geographic area."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "1.2.1",
      "marks": 1,
      "clues": "- Think about spending by all sectors inside the country’s borders.",
      "approach": "- Read the term as a spending measure.\n- Look for the description about money spent on final goods and services.",
      "solution": "1. Gross domestic expenditure is the amount of money spent on final goods and services within a country.\n2. The answer is G."
    },
    {
      "number": "1.2.2",
      "marks": 1,
      "clues": "- A trend line smooths out short-term movements.",
      "approach": "- Think about what a line drawn through a business-cycle graph shows.\n- Pick the description about direction.",
      "solution": "1. A trend line shows the general direction in which the economy is moving.\n2. The answer is I."
    },
    {
      "number": "1.2.3",
      "marks": 1,
      "clues": "- This is a budget document with a time horizon of several years.",
      "approach": "- Expand the abbreviation in your head.\n- Look for the description that mentions projections of spending and revenue.",
      "solution": "1. The Medium-term Budget Policy Statement gives a three-year rolling expenditure and revenue projection of government.\n2. The answer is E."
    },
    {
      "number": "1.2.4",
      "marks": 1,
      "clues": "- Who sets the price of the currency in this system?",
      "approach": "- Separate \"free-floating\" from \"pegged\".\n- Match it to the description that leaves the price to the market.",
      "solution": "1. In a free-floating system the value of the currency is determined by supply and demand only.\n2. The answer is A; H describes a pegged rate."
    },
    {
      "number": "1.2.5",
      "marks": 1,
      "clues": "- Think about fast-growing economies that are still industrialising.",
      "approach": "- Recall what \"emerging\" implies.\n- Choose the description about rapid growth and industrialisation.",
      "solution": "1. Emerging markets are developing countries undergoing rapid economic growth and industrialisation.\n2. The answer is B."
    },
    {
      "number": "1.2.6",
      "marks": 1,
      "clues": "- The tools involved are interest rates and the quantity of money.",
      "approach": "- Recall which policy uses those tools.\n- Match it to the description that mentions them.",
      "solution": "1. Monetary policy changes interest rates and the money supply to influence the economy.\n2. The answer is F."
    },
    {
      "number": "1.2.7",
      "marks": 1,
      "clues": "- The word \"hub\" suggests a concentration of activity in one place.",
      "approach": "- Think of a place where firms in one sector cluster.\n- Choose the geographic description.",
      "solution": "1. An industrial hub is a geographical area with a cluster of businesses in a specific sector.\n2. The answer is D."
    },
    {
      "number": "1.2.8",
      "marks": 1,
      "clues": "- Productivity compares what is produced with what is put in.",
      "approach": "- Recall the definition of productivity.\n- Pick the description linking output and inputs.",
      "solution": "1. Productivity is the relationship between real output and factor input.\n2. The answer is C."
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
