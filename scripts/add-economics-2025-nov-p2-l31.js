#!/usr/bin/env node
/**
 * DBE Economics P2 — November 2025 — Question 6: Trading partners and domestic inflation (order 31)
 * Lesson 31 of 2025 Nov P2 (DESIGN-UNI-14: 3 practice questions). Question 6: Trading partners and domestic inflation. Fresh practice questions (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2025-nov-p2-l31.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2025-nov-p2-l31.js --dry-run
 *   node scripts/add-economics-2025-nov-p2-l31.js
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
  "name": "Question 6: Trading partners and domestic inflation",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2025,
  "paper": "nov_p2",
  "order": 31,
  "content_tier": "free",
  "has_video": false,
  "xp": 10,
  "tags": [
    "trading_partners",
    "inflation_measures"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p2/q31/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p2/q31/memo_1.png"
  ],
  "exam_question_marks": 10,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Select ALL the ways in which trading partners can push domestic inflation up.",
    "metadata": [
      "Strong demand for exports adds to demand-pull inflation",
      "Cheaper imported production inputs for local firms",
      "Higher oil and commodity prices raise costs",
      "Rising prices abroad lead to imported inflation",
      "Imports that increase competition on local markets"
    ],
    "answer": [
      "Rising prices abroad lead to imported inflation",
      "Higher oil and commodity prices raise costs",
      "Strong demand for exports adds to demand-pull inflation",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "economics_inflation",
    "topic": "trading_partners_and_inflation",
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
    "clues": "- Inflation is pushed up by higher import costs or extra demand for local goods.\n- Two options are effects that would hold inflation down."
  },
  {
    "name": "Question 2",
    "question": "Select ALL the ways in which trading partners can help to hold domestic inflation down.",
    "metadata": [
      "Cheaper imported inputs lower production costs",
      "Higher export demand adds to demand-pull inflation",
      "Tariffs abroad reduce export demand and ease inflation",
      "Higher import prices raise production costs",
      "Imports increase competition on local markets"
    ],
    "answer": [
      "Imports increase competition on local markets",
      "Cheaper imported inputs lower production costs",
      "Tariffs abroad reduce export demand and ease inflation",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "economics_inflation",
    "topic": "trading_partners_and_inflation",
    "subtopic": "econ_cause_and_effect",
    "skills": [
      "explain_economic_impact"
    ],
    "difficulty": 4,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- Look for effects that lower costs, widen supply or reduce demand for local goods."
  },
  {
    "name": "Question 3",
    "question": "The price of oil imported from trading partners rises sharply, increasing production costs in South Africa. What type of inflation is this likely to cause?",
    "metadata": [
      "Deflation",
      "Demand-pull inflation",
      "Cost-push inflation",
      "Stagflation",
      ""
    ],
    "answer": [
      "Cost-push inflation",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "economics_inflation",
    "topic": "trading_partners_and_inflation",
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
    "paper": "nov_p2",
    "clues": "- The pressure comes from the cost side of production."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "6",
      "marks": 10,
      "clues": "- A \"how can\" question needs the effects of trading partners with their reasons.\n- Mere listing earns at most 2 of the 10 marks.",
      "approach": "- Give effects that raise and lower domestic inflation.\n- Link each to cost-push or demand-pull inflation.",
      "solution": "1. Growth in trading partners’ economies may raise demand for local goods, adding demand-pull inflation.\n2. Higher prices abroad cause imported inflation, and higher commodity or oil prices cause cost-push inflation.\n3. Political tensions and import tariffs can disrupt supply or raise costs.\n4. Imports can add competition and lower prices, cheaper inputs lower costs, and tariffs abroad can reduce export demand (max 10)."
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
