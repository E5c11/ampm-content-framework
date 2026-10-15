#!/usr/bin/env node
/**
 * DBE Economics P1 — November 2024 — Question 2.4: Exogenous explanations of business cycles (order 9)
 * Lesson 9 of 2024 Nov P1 (DESIGN-UNI-14: 3 practice questions). Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2024-nov-p1-l09.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2024-nov-p1-l09.js --dry-run
 *   node scripts/add-economics-2024-nov-p1-l09.js
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
  "name": "Question 2.4: Exogenous explanations of business cycles",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2024,
  "paper": "nov_p1",
  "order": 9,
  "content_tier": "free",
  "has_video": false,
  "xp": 8,
  "tags": [
    "business_cycle_explanations"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p1/q9/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p1/q9/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p1/q9/memo_2.png"
  ],
  "exam_question_marks": 8,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "A severe drought destroys crops and tourist numbers fall, and the whole economy slides into a downturn. Which kind of business cycle explanation does this support?",
    "metadata": [
      "An endogenous explanation",
      "An exogenous explanation",
      "A Keynesian multiplier explanation",
      "A balance of payments explanation",
      ""
    ],
    "answer": [
      "An exogenous explanation",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "business_cycles",
    "topic": "business_cycle_explanations",
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
    "clues": "- Decide whether the cause comes from inside the market system or arrives from outside it."
  },
  {
    "name": "Question 2",
    "question": "Select ALL the views held by the monetarist (exogenous) explanation of business cycles.",
    "metadata": [
      "Instability is built into the market system",
      "Markets are inherently stable",
      "Fluctuations come from factors outside the market",
      "Government should keep out of market operations",
      "Government spending must rise in every slump"
    ],
    "answer": [
      "Markets are inherently stable",
      "Fluctuations come from factors outside the market",
      "Government should keep out of market operations",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "definition",
    "unit": "business_cycles",
    "topic": "business_cycle_explanations",
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
    "clues": "- Monetarists trust markets to return to equilibrium.\n- Think about what they say about interference by the government."
  },
  {
    "name": "Question 3",
    "question": "Match each external factor to the way it can disturb economic activity.",
    "metadata": [
      "A - Natural disaster",
      "B - Sudden rise in the fuel price",
      "C - Structural change in production",
      "1 - Business and consumer confidence fall",
      "2 - Output in agriculture, forestry and tourism falls",
      "3 - Employment, investment and trade patterns shift"
    ],
    "answer": [
      "A-2",
      "B-1",
      "C-3"
    ],
    "presentation": "match",
    "type": "application",
    "unit": "business_cycles",
    "topic": "business_cycle_explanations",
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
    "clues": "- Think about who is hit first by each shock."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "2.4",
      "marks": 8,
      "clues": "- Group your points: the monetarist view of markets, the role of the government, and external factors.",
      "approach": "- Four developed points of 2 marks each; at most 4 marks for mere listing.",
      "solution": "1. Monetarists believe markets are inherently stable and return to equilibrium through demand and supply.\n2. Fluctuations are caused by external factors, so government intervention only moves the economy away from its growth path.\n3. External factors include structural changes, random shocks such as fuel price rises, and natural disasters such as droughts and floods.\n4. Any other correct relevant response is accepted."
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
