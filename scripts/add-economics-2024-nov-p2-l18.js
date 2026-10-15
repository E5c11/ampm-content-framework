#!/usr/bin/env node
/**
 * DBE Economics P2 — November 2024 — Question 3.5: Negative impacts of tourism (order 18)
 * Lesson 18 of 2024 Nov P2 (DESIGN-UNI-14: 3 practice questions). Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2024-nov-p2-l18.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2024-nov-p2-l18.js --dry-run
 *   node scripts/add-economics-2024-nov-p2-l18.js
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
  "name": "Question 3.5: Negative impacts of tourism",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2024,
  "paper": "nov_p2",
  "order": 18,
  "content_tier": "free",
  "has_video": false,
  "xp": 8,
  "tags": [
    "tourism_impacts",
    "tourism"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p2/q18/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p2/q18/memo_1.png"
  ],
  "exam_question_marks": 8,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "A coastal town becomes short of water in summer because of the large numbers of visitors. Which negative impact of tourism is this?",
    "metadata": [
      "noise pollution",
      "pressure on natural resources",
      "higher local tax revenue",
      "more employment",
      ""
    ],
    "answer": [
      "pressure on natural resources",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "tourism",
    "topic": "tourism_impacts",
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
    "paper": "nov_p2",
    "clues": "- Think about which resource the visitors are using in large quantities."
  },
  {
    "name": "Question 2",
    "question": "Select ALL the negative impacts that tourism can have on South Africa.",
    "metadata": [
      "Traffic congestion near tourist areas",
      "A wider tax base for the government in the long run",
      "Loss of wildlife through hunting",
      "Higher local prices for basic goods",
      "More jobs for local people in tourist areas"
    ],
    "answer": [
      "Traffic congestion near tourist areas",
      "Loss of wildlife through hunting",
      "Higher local prices for basic goods",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "tourism",
    "topic": "tourism_impacts",
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
    "clues": "- Choose the options that describe a cost or harm."
  },
  {
    "name": "Question 3",
    "question": "Match each tourism activity to its negative impact.",
    "metadata": [
      "A - Building tourist facilities",
      "B - Aircraft landing near homes",
      "C - Large crowds at a site",
      "1 - Noise pollution for nearby residents",
      "2 - Waste and damage at the site",
      "3 - Permanent change to the environment"
    ],
    "answer": [
      "A-3",
      "B-1",
      "C-2"
    ],
    "presentation": "match",
    "type": "application",
    "unit": "tourism",
    "topic": "tourism_impacts",
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
    "paper": "nov_p2",
    "clues": "- Match the activity to the kind of harm it most directly causes."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "3.5",
      "marks": 8,
      "clues": "- Think of environmental, social and economic impacts.",
      "approach": "- Four developed impacts of 2 marks each; at most 2 marks for listing.",
      "solution": "1. Infrastructure for tourism can permanently restructure the environment.\n2. Traffic congestion, noise pollution, water shortages and waste damage tourist sites.\n3. Wildlife may be lost through hunting; demand from tourists may cause shortages and higher local prices.\n4. People may be displaced and population dynamics change. Any other correct relevant response is accepted."
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
