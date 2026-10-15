#!/usr/bin/env node
/**
 * DBE Economics P2 — November 2024 — Question 5: How the competition policy reduces anti-competitive behaviour (order 28)
 * Lesson 28 of 2024 Nov P2 (DESIGN-UNI-14: 3 practice questions). Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2024-nov-p2-l28.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2024-nov-p2-l28.js --dry-run
 *   node scripts/add-economics-2024-nov-p2-l28.js
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
  "name": "Question 5: How the competition policy reduces anti-competitive behaviour",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2024,
  "paper": "nov_p2",
  "order": 28,
  "content_tier": "free",
  "has_video": false,
  "xp": 8,
  "tags": [
    "competition_policy",
    "oligopoly"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p2/q28/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p2/q28/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p2/q28/memo_2.png"
  ],
  "exam_question_marks": 10,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "A court-like body hears cases against firms accused of price fixing and may impose fines. Which competition institution is this?",
    "metadata": [
      "the Competition Appeal Court",
      "the Competition Commission",
      "the Competition Tribunal",
      "the Reserve Bank",
      ""
    ],
    "answer": [
      "the Competition Tribunal",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "imperfect_markets",
    "topic": "oligopoly_and_competition_policy",
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
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Think of the body that adjudicates and penalises, not the one that investigates."
  },
  {
    "name": "Question 2",
    "question": "Select ALL the ways in which the competition policy reduces anti-competitive behaviour.",
    "metadata": [
      "It regulates mergers and takeovers",
      "It investigates restrictive practices such as price fixing",
      "It allows firms to fix prices together",
      "It protects consumers from unfair prices",
      "It blocks all foreign competition"
    ],
    "answer": [
      "It regulates mergers and takeovers",
      "It investigates restrictive practices such as price fixing",
      "It protects consumers from unfair prices",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "imperfect_markets",
    "topic": "oligopoly_and_competition_policy",
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
    "paper": "nov_p2",
    "clues": "- Choose the actions that restrict market power or protect buyers."
  },
  {
    "name": "Question 3",
    "question": "Match each competition institution to its role.",
    "metadata": [
      "A - Competition Commission",
      "B - Competition Tribunal",
      "C - Competition Appeal Court",
      "1 - Reviews or amends decisions of the Tribunal",
      "2 - Investigates restrictive practices",
      "3 - Imposes fines and penalties on guilty firms"
    ],
    "answer": [
      "A-2",
      "B-3",
      "C-1"
    ],
    "presentation": "match",
    "type": "definition",
    "unit": "imperfect_markets",
    "topic": "oligopoly_and_competition_policy",
    "subtopic": "econ_term_definition",
    "skills": [
      "define_economic_term"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Think of the order: investigate, decide, review."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "5",
      "marks": 10,
      "clues": "- Treat this as the additional part: how has the competition policy reduced anti-competitive behaviour?",
      "approach": "- At most 2 of the 10 marks may be given for mere listing.",
      "solution": "1. It prevents abuse of market power, regulates mergers and takeovers and allows foreign competition.\n2. The Competition Commission investigates restrictive practices such as price fixing; the Tribunal fines guilty firms; the Appeal Court reviews its decisions.\n3. Consumers are protected from unfair prices and inferior products, equal opportunities are promoted and healthy competition improves efficiency. Any other correct relevant response is accepted."
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
