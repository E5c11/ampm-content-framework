#!/usr/bin/env node
/**
 * DBE Economics P1 — November 2024 — Question 1.2: Matching economic terms (order 3)
 * Lesson 3 of 2024 Nov P1 (DESIGN-UNI-14: 4 practice questions). Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2024-nov-p1-l03.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2024-nov-p1-l03.js --dry-run
 *   node scripts/add-economics-2024-nov-p1-l03.js
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
  "name": "Question 1.2: Matching economic terms",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2024,
  "paper": "nov_p1",
  "order": 3,
  "content_tier": "free",
  "has_video": false,
  "xp": 10,
  "tags": [
    "economic_indicators",
    "fiscal_policy",
    "balance_of_payments",
    "urbanisation"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p1/q3/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p1/q3/memo_1.png"
  ],
  "exam_question_marks": 8,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Match each term to the description that fits it.",
    "metadata": [
      "A - Factor cost",
      "B - Moving average",
      "C - Medium-Term Expenditure Framework",
      "D - Special Drawing Rights",
      "1 - A smoothing technique that averages a fixed number of consecutive observations",
      "2 - A reserve asset created by the International Monetary Fund that members can exchange for currencies",
      "3 - What the owners of resources are paid for their part in producing goods and services",
      "4 - The government's rolling three-year plan for spending and expected revenue"
    ],
    "answer": [
      "A-3",
      "B-1",
      "C-4",
      "D-2"
    ],
    "presentation": "match",
    "type": "definition",
    "unit": "economic_and_social_indicators",
    "topic": "economic_performance_indicators",
    "subtopic": "econ_term_definition",
    "skills": [
      "define_economic_term"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Match the plain-language terms first, then use the technical ones.\n- Think about whether each description is about prices, time series, budgets or international credit."
  },
  {
    "name": "Question 2",
    "question": "Match each term to the description that fits it.",
    "metadata": [
      "A - Boycotts",
      "B - National Development Plan",
      "C - Spatial Development Initiatives",
      "D - Urbanisation",
      "1 - A government plan to eradicate poverty and reduce inequality by 2030",
      "2 - Refusing voluntarily to buy from or trade with a country or firm in protest",
      "3 - The movement of people from rural areas to towns and cities",
      "4 - Programmes that draw infrastructure and investment into neglected areas"
    ],
    "answer": [
      "A-2",
      "B-1",
      "C-4",
      "D-3"
    ],
    "presentation": "match",
    "type": "definition",
    "unit": "growth_and_development",
    "topic": "regional_development",
    "subtopic": "econ_term_definition",
    "skills": [
      "define_economic_term"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Decide which description is about people moving, which is a long-term plan and which is a protest.\n- Match the remaining two by who is targeted: trading partners or neglected regions."
  },
  {
    "name": "Question 3",
    "question": "Which calculation converts GDP at market prices into GDP at factor cost?",
    "metadata": [
      "Add taxes on products and subtract subsidies",
      "Subtract taxes on products and add subsidies",
      "Add both taxes on products and subsidies",
      "Subtract both taxes on products and subsidies",
      ""
    ],
    "answer": [
      "Subtract taxes on products and add subsidies",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "calc",
    "unit": "economic_and_social_indicators",
    "topic": "economic_performance_indicators",
    "subtopic": "econ_calculation",
    "skills": [
      "apply_economic_formula"
    ],
    "difficulty": 4,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Market prices include taxes that producers pass on and exclude subsidies they receive.\n- Factor cost is what the resource owners actually receive."
  },
  {
    "name": "Question 4",
    "question": "Quarterly sales (R million) are 40, 46 and 52. Calculate the three-quarter moving average: []",
    "metadata": [
      "Moving average (R million) = ",
      "[ ]"
    ],
    "answer": [
      "46",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "type": "calc",
    "unit": "business_cycles",
    "topic": "cycle_indicators",
    "subtopic": "econ_calculation",
    "skills": [
      "apply_economic_formula"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Add the three values.\n- Divide the total by the number of quarters."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "1.2.1",
      "marks": 1,
      "clues": "- Think about what is paid for the resources used in production.",
      "approach": "- Match the term to its description.",
      "solution": "Factor cost is the amount paid for the resources used to produce goods and services (F)."
    },
    {
      "number": "1.2.2",
      "marks": 1,
      "clues": "- Think about smoothing short-term fluctuations in a series.",
      "approach": "- Match the term to its description.",
      "solution": "A moving average smooths out short-term fluctuations in time series data (G)."
    },
    {
      "number": "1.2.3",
      "marks": 1,
      "clues": "- Think of a rolling three-year budget projection.",
      "approach": "- Match the term to its description.",
      "solution": "The Medium-Term Expenditure Framework is a three-year rolling expenditure and revenue projection for the government (A)."
    },
    {
      "number": "1.2.4",
      "marks": 1,
      "clues": "- Think of IMF credit for balance of payments deficits.",
      "approach": "- Match the term to its description.",
      "solution": "Special Drawing Rights are a form of credit granted by the IMF to countries with balance of payments deficits (B)."
    },
    {
      "number": "1.2.5",
      "marks": 1,
      "clues": "- Think of voluntary measures not to trade with a country.",
      "approach": "- Match the term to its description.",
      "solution": "Boycotts are voluntary measures not to trade with a certain country (I)."
    },
    {
      "number": "1.2.6",
      "marks": 1,
      "clues": "- Think of the plan that aims at 2030.",
      "approach": "- Match the term to its description.",
      "solution": "The National Development Plan aims to eliminate poverty and reduce inequality by 2030 (C)."
    },
    {
      "number": "1.2.7",
      "marks": 1,
      "clues": "- Think of investment attracted to neglected areas.",
      "approach": "- Match the term to its description.",
      "solution": "Spatial Development Initiatives attract infrastructure and investment to neglected and underdeveloped areas (E)."
    },
    {
      "number": "1.2.8",
      "marks": 1,
      "clues": "- Think of people moving from rural to urban areas.",
      "approach": "- Match the term to its description.",
      "solution": "Urbanisation is the movement of people from rural areas to cities and towns (H)."
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
