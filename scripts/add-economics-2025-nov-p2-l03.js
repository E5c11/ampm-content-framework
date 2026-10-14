#!/usr/bin/env node
/**
 * DBE Economics P2 — November 2025 — Question 1.2: Matching market and tourism terms (order 3)
 * Lesson 3 of 2025 Nov P2 (DESIGN-UNI-14: 3 practice questions). Question 1.2: Matching market and tourism terms. Fresh practice questions (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2025-nov-p2-l03.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2025-nov-p2-l03.js --dry-run
 *   node scripts/add-economics-2025-nov-p2-l03.js
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
  "name": "Question 1.2: Matching market and tourism terms",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2025,
  "paper": "nov_p2",
  "order": 3,
  "content_tier": "free",
  "has_video": false,
  "xp": 8,
  "tags": [
    "perfect_competition",
    "competition_policy",
    "ecotourism"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p2/q3/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p2/q3/memo_1.png"
  ],
  "exam_question_marks": 8,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Match each term to its description.",
    "metadata": [
      "A - Homogeneous products",
      "B - Price-taker",
      "C - Collusion",
      "D - Free riders",
      "1 - Goods that are identical in appearance, packaging and quality",
      "2 - A firm that has no influence over the market price",
      "3 - An agreement among firms to reduce competition by fixing prices",
      "4 - People who enjoy goods and services without paying for them"
    ],
    "answer": [
      "A-1",
      "B-2",
      "C-3",
      "D-4"
    ],
    "presentation": "match",
    "type": "definition",
    "unit": "perfect_markets",
    "topic": "perfect_competition_profit_loss",
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
    "clues": "- Read each description and ask which market feature it points to."
  },
  {
    "name": "Question 2",
    "question": "Match each term to its description.",
    "metadata": [
      "A - Inflation targeting",
      "B - Ecotourism",
      "C - Tourism",
      "D - Preservation",
      "1 - The SARB aims to keep price changes within a set band",
      "2 - Visits to places to enjoy the natural environment",
      "3 - Travelling to and staying in places outside the usual environment",
      "4 - A method used to prevent non-renewable resources from running out"
    ],
    "answer": [
      "A-1",
      "B-2",
      "C-3",
      "D-4"
    ],
    "presentation": "match",
    "type": "definition",
    "unit": "economics_inflation",
    "topic": "measures_to_combat_inflation",
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
    "paper": "nov_p2",
    "clues": "- Two of the terms are about tourism and two are about policy."
  },
  {
    "name": "Question 3",
    "question": "Select ALL the features of collusion between firms.",
    "metadata": [
      "Firms in the same industry agree to act together",
      "They fix prices or limit output",
      "It reduces competition",
      "Competition policy encourages it",
      "It lowers prices for consumers"
    ],
    "answer": [
      "Firms in the same industry agree to act together",
      "They fix prices or limit output",
      "It reduces competition",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "definition",
    "unit": "imperfect_markets",
    "topic": "oligopoly_and_competition_policy",
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
    "clues": "- Collusion works against rivalry between firms.\n- Two statements describe the opposite of what collusion does."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "1.2.1",
      "marks": 1,
      "clues": "- Match the term to the description by its key feature.",
      "approach": "- Recall the definition of the item in Column A.\n- Find the matching description in Column B.",
      "solution": "1. The match is E: goods that are identical in appearance, packaging and quality."
    },
    {
      "number": "1.2.2",
      "marks": 1,
      "clues": "- Match the term to the description by its key feature.",
      "approach": "- Recall the definition of the item in Column A.\n- Find the matching description in Column B.",
      "solution": "1. The match is D: a firm that has no influence over the market price."
    },
    {
      "number": "1.2.3",
      "marks": 1,
      "clues": "- Match the term to the description by its key feature.",
      "approach": "- Recall the definition of the item in Column A.\n- Find the matching description in Column B.",
      "solution": "1. The match is G: an agreement among firms in the same industry to reduce competition by price fixing."
    },
    {
      "number": "1.2.4",
      "marks": 1,
      "clues": "- Match the term to the description by its key feature.",
      "approach": "- Recall the definition of the item in Column A.\n- Find the matching description in Column B.",
      "solution": "1. The match is B: people who enjoy goods and services without paying for them."
    },
    {
      "number": "1.2.5",
      "marks": 1,
      "clues": "- Match the term to the description by its key feature.",
      "approach": "- Recall the definition of the item in Column A.\n- Find the matching description in Column B.",
      "solution": "1. The match is F: the SARB’s monetary policy approach of keeping price changes within 3-6%."
    },
    {
      "number": "1.2.6",
      "marks": 1,
      "clues": "- Match the term to the description by its key feature.",
      "approach": "- Recall the definition of the item in Column A.\n- Find the matching description in Column B.",
      "solution": "1. The match is I: activities of people visiting places to enjoy the natural environment."
    },
    {
      "number": "1.2.7",
      "marks": 1,
      "clues": "- Match the term to the description by its key feature.",
      "approach": "- Recall the definition of the item in Column A.\n- Find the matching description in Column B.",
      "solution": "1. The match is C: activities of people travelling to and staying in places outside their usual environment."
    },
    {
      "number": "1.2.8",
      "marks": 1,
      "clues": "- Match the term to the description by its key feature.",
      "approach": "- Recall the definition of the item in Column A.\n- Find the matching description in Column B.",
      "solution": "1. The match is A: a method used to prevent the extinction of non-renewable resources."
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
