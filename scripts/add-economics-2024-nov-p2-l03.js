#!/usr/bin/env node
/**
 * DBE Economics P2 — November 2024 — Question 1.2: Matching economic terms (order 3)
 * Lesson 3 of 2024 Nov P2 (DESIGN-UNI-14: 4 practice questions). Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2024-nov-p2-l03.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2024-nov-p2-l03.js --dry-run
 *   node scripts/add-economics-2024-nov-p2-l03.js
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
  "paper": "nov_p2",
  "order": 3,
  "content_tier": "free",
  "has_video": false,
  "xp": 10,
  "tags": [
    "cost_curves",
    "price_controls",
    "tourism",
    "environmental_issues"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p2/q3/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p2/q3/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p2/q3/memo_1.png"
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
      "A - Short-run",
      "B - Patent",
      "C - Minimum price",
      "D - Community goods",
      "1 - Provided free of charge by the government to everyone",
      "2 - A price floor set by government so producers of essential goods can stay in business",
      "3 - The period in which at least one factor of production is fixed",
      "4 - An exclusive right to make a particular product"
    ],
    "answer": [
      "A-3",
      "B-4",
      "C-2",
      "D-1"
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
    "order": 1,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Decide which descriptions are about time, a legal right, a price and public provision."
  },
  {
    "name": "Question 2",
    "question": "Match each term to the description that fits it.",
    "metadata": [
      "A - GDP deflator",
      "B - Outbound tourists",
      "C - Conservation",
      "D - Pollution",
      "1 - Residents who travel to other countries",
      "2 - Introducing waste material into the environment",
      "3 - Looking after natural resources so they are not used up",
      "4 - A measure that converts nominal prices to real prices"
    ],
    "answer": [
      "A-4",
      "B-1",
      "C-3",
      "D-2"
    ],
    "presentation": "match",
    "type": "definition",
    "unit": "economics_inflation",
    "topic": "inflation_types_and_effects",
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
    "paper": "nov_p2",
    "clues": "- Think of one price measure, one kind of traveller, one way of protecting nature and one harm to nature."
  },
  {
    "name": "Question 3",
    "question": "Nominal GDP is R900 billion and real GDP is R750 billion. Calculate the GDP deflator: []",
    "metadata": [
      "GDP deflator = ",
      "[ ]"
    ],
    "answer": [
      "120",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "type": "calc",
    "unit": "economics_inflation",
    "topic": "inflation_types_and_effects",
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
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Divide nominal GDP by real GDP and multiply by 100."
  },
  {
    "name": "Question 4",
    "question": "A government sets a minimum price for wheat above the equilibrium price. What is the most likely result?",
    "metadata": [
      "a shortage of wheat",
      "a surplus of wheat",
      "a fall in wheat production",
      "no change in the market",
      ""
    ],
    "answer": [
      "a surplus of wheat",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "market_failures",
    "topic": "price_controls",
    "subtopic": "econ_classification",
    "skills": [
      "classify_economic_concept"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Compare what farmers want to supply with what buyers will buy at a price above equilibrium."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "1.2.1",
      "marks": 1,
      "clues": "- Think of a time period in which one factor is fixed.",
      "approach": "- Match the term.",
      "solution": "Short-run: at least one factor of production remains fixed (E)."
    },
    {
      "number": "1.2.2",
      "marks": 1,
      "clues": "- Think of an exclusive right to a product.",
      "approach": "- Match the term.",
      "solution": "A patent is an exclusive right to manufacture a particular product (I)."
    },
    {
      "number": "1.2.3",
      "marks": 1,
      "clues": "- Think of a price imposed to keep producers profitable.",
      "approach": "- Match the term.",
      "solution": "A minimum price is imposed by government to allow producers of essential goods to be profitable (F)."
    },
    {
      "number": "1.2.4",
      "marks": 1,
      "clues": "- Think of goods supplied free of charge.",
      "approach": "- Match the term.",
      "solution": "Community goods are provided free of charge by government (G)."
    },
    {
      "number": "1.2.5",
      "marks": 1,
      "clues": "- Think of converting nominal to real prices.",
      "approach": "- Match the term.",
      "solution": "The GDP deflator converts current (nominal) prices to constant (real) prices (B)."
    },
    {
      "number": "1.2.6",
      "marks": 1,
      "clues": "- Think of residents travelling abroad.",
      "approach": "- Match the term.",
      "solution": "Outbound tourists are South African residents travelling to other countries (A)."
    },
    {
      "number": "1.2.7",
      "marks": 1,
      "clues": "- Think of looking after natural resources.",
      "approach": "- Match the term.",
      "solution": "Conservation is looking after natural resources so they are not completely used up (D)."
    },
    {
      "number": "1.2.8",
      "marks": 1,
      "clues": "- Think of waste released into the environment.",
      "approach": "- Match the term.",
      "solution": "Pollution is the introduction of waste material into the environment (C)."
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
