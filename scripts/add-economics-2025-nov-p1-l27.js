#!/usr/bin/env node
/**
 * DBE Economics P1 — November 2025 — Question 6: Industrial incentives (order 27)
 * Lesson 27 of the 2025 Nov P1 repair (DESIGN-UNI-14: 3 practice questions). Question 6: Industrial incentives. Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2025-nov-p1-l27.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2025-nov-p1-l27.js --dry-run
 *   node scripts/add-economics-2025-nov-p1-l27.js
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
  "name": "Question 6: Industrial incentives",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2025,
  "paper": "nov_p1",
  "order": 27,
  "content_tier": "free",
  "has_video": false,
  "xp": 10,
  "tags": [
    "industrial_incentives"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q27/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q27/memo_1.png"
  ],
  "exam_question_marks": 10,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Select ALL the incentives government can use to promote industrial development.",
    "metadata": [
      "Tax holidays or reduced corporate taxes",
      "Subsidies on capital investment",
      "Cash grants or low-interest loans for expansion and new technology",
      "Higher corporate taxes for new industries",
      "Cutting infrastructure spending for industrial parks"
    ],
    "answer": [
      "Tax holidays or reduced corporate taxes",
      "Subsidies on capital investment",
      "Cash grants or low-interest loans for expansion and new technology",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "growth_and_development",
    "topic": "industrial_incentives",
    "subtopic": "econ_policy_evaluation",
    "skills": [
      "evaluate_economic_policy"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- An incentive lowers the cost or raises the reward of investing in an industry.\n- Two options would make investing more costly."
  },
  {
    "name": "Question 2",
    "question": "How can simplifying business registration help industrial development?",
    "metadata": [
      "It raises the cost of starting a business",
      "It removes bureaucratic hurdles so industries can start and grow more efficiently",
      "It reduces the number of firms in each industry",
      "It makes licences harder to obtain",
      ""
    ],
    "answer": [
      "It removes bureaucratic hurdles so industries can start and grow more efficiently",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "growth_and_development",
    "topic": "industrial_incentives",
    "subtopic": "econ_cause_and_effect",
    "skills": [
      "explain_economic_impact"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Think about the time and cost a new firm spends before it can operate."
  },
  {
    "name": "Question 3",
    "question": "Which of the following is an export incentive?",
    "metadata": [
      "A tariff on imported inputs",
      "A ban on foreign competitors",
      "Information on export markets and concessions on transport charges",
      "A higher VAT rate on locally sold goods",
      ""
    ],
    "answer": [
      "Information on export markets and concessions on transport charges",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "growth_and_development",
    "topic": "industrial_incentives",
    "subtopic": "econ_classification",
    "skills": [
      "classify_economic_concept"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- An export incentive helps local firms sell abroad."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "6",
      "marks": 10,
      "clues": "- A \"how can\" question needs measures with their effect, not a list of names.\n- Mere listing earns at most 2 of the 10 marks.",
      "approach": "- Choose several incentives: tax relief, capital subsidies, grants and loans, infrastructure, simpler registration, export support, duty-free inputs, skills funding.\n- Explain how each encourages industry.",
      "solution": "1. Tax relief and holidays raise profit prospects and attract investment.\n2. Subsidies, grants and low-interest loans lower the cost of expanding and adopting new technology.\n3. Infrastructure, simpler registration and export support remove obstacles and widen markets.\n4. Duty-free inputs and skills funding lower costs and raise productivity (max 10)."
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
