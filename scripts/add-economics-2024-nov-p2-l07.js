#!/usr/bin/env node
/**
 * DBE Economics P2 — November 2024 — Question 2.2.5: Monopolist and monopolistic competitor profits (order 7)
 * Lesson 7 of 2024 Nov P2 (DESIGN-UNI-14: 3 practice questions). Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2024-nov-p2-l07.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2024-nov-p2-l07.js --dry-run
 *   node scripts/add-economics-2024-nov-p2-l07.js
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
  "name": "Question 2.2.5: Monopolist and monopolistic competitor profits",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2024,
  "paper": "nov_p2",
  "order": 7,
  "content_tier": "free",
  "has_video": false,
  "xp": 8,
  "tags": [
    "monopoly_market",
    "monopolistic_competition"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p2/q7/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p2/q7/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p2/q7/memo_1.png"
  ],
  "exam_question_marks": 4,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Which feature gives a monopolist more control over price than a monopolistic competitor?",
    "metadata": [
      "it sells identical products",
      "it faces many rivals",
      "it faces no close competition",
      "it has no barriers to entry",
      ""
    ],
    "answer": [
      "it faces no close competition",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "imperfect_markets",
    "topic": "monopoly",
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
    "clues": "- Control over price depends on how many alternatives buyers have."
  },
  {
    "name": "Question 2",
    "question": "Select ALL the reasons why a monopolist can earn more profit than a monopolistic competitor.",
    "metadata": [
      "It has no competition",
      "It can set prices at higher levels",
      "It has many close substitutes",
      "Demand for its product is inelastic",
      "Its customers switch easily to rivals"
    ],
    "answer": [
      "It has no competition",
      "It can set prices at higher levels",
      "Demand for its product is inelastic",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "imperfect_markets",
    "topic": "monopoly",
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
    "clues": "- Think about competition, price-setting power and how buyers respond to a price rise."
  },
  {
    "name": "Question 3",
    "question": "Arrange the reasoning that explains why a monopolist earns greater profit than a monopolistic competitor.",
    "metadata": [
      "The monopolist can raise the price with little loss of sales",
      "The monopolist is the only seller of the product",
      "Demand for the product is inelastic",
      "Buyers have no close substitutes"
    ],
    "answer": [
      "The monopolist is the only seller of the product",
      "Buyers have no close substitutes",
      "Demand for the product is inelastic",
      "The monopolist can raise the price with little loss of sales"
    ],
    "presentation": "ordering",
    "type": "ordering",
    "unit": "imperfect_markets",
    "topic": "monopoly",
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
    "paper": "nov_p2",
    "clues": "- Start with the market position, then what buyers can do, then how they react to price."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "2.2.5",
      "marks": 4,
      "clues": "- Compare competition, control over price and elasticity of demand.",
      "approach": "- Give two developed points of 2 marks each.",
      "solution": "1. A monopolist has no competition; a monopolistic competitor faces many rivals, which lowers prices and profit.\n2. A monopolist can manipulate prices upwards, whereas a monopolistic competitor has little control over price.\n3. A monopolist faces inelastic demand and can charge more; a monopolistic competitor faces elastic demand. Any other correct relevant response is accepted."
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
