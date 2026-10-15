#!/usr/bin/env node
/**
 * DBE Tourism — November 2025 — Question 6: Marketing South Africa and TOMSA (order 17)
 * Question 6.1–6.3 — how TOMSA is funded, a destination of choice, the fund administrator and the marketing body.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-tourism-2025-nov-p1-l17.js --curriculum temp/curriculum-vocab-tourism.json
 *   node scripts/add-tourism-2025-nov-p1-l17.js --dry-run
 *   node scripts/add-tourism-2025-nov-p1-l17.js
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
  "name": "Question 6: Marketing South Africa and TOMSA",
  "syllabus": "dbe",
  "subject": "tourism",
  "year": 2025,
  "paper": "nov_p1",
  "order": 17,
  "content_tier": "free",
  "has_video": false,
  "xp": 8,
  "tags": [
    "tomsa_levy",
    "destination_of_choice",
    "satourism"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2025/nov_p1/q17/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2025/nov_p1/q17/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2025/nov_p1/q17/memo_1.png"
  ],
  "exam_question_marks": 8,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "How does TOMSA raise the money used to market South Africa?",
    "metadata": [
      "By charging a tax on every tourist at the border",
      "By selling airline tickets",
      "By receiving yearly grants from the Department of Tourism only",
      "By collecting a 1% levy from contributing tourism businesses",
      ""
    ],
    "answer": [
      "By collecting a 1% levy from contributing tourism businesses",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "tourism_marketing",
    "topic": "tomsa_funding",
    "subtopic": "tour_term_recall",
    "skills": [
      "recall_tourism_term"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "tourism",
    "year": 2025,
    "paper": "nov_p1",
    "type": "definition"
  },
  {
    "name": "Question 2",
    "question": "South Africa is marketed as a destination of choice. What does this mean?",
    "metadata": [
      "It is the cheapest destination in the world",
      "It has no other tourists",
      "Tourists prefer to visit it rather than other destinations",
      "It only welcomes tourists who have been chosen by the government",
      ""
    ],
    "answer": [
      "Tourists prefer to visit it rather than other destinations",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "tourism_marketing",
    "topic": "destination_marketing",
    "subtopic": "tour_term_recall",
    "skills": [
      "recall_tourism_term"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "tourism",
    "year": 2025,
    "paper": "nov_p1",
    "type": "definition"
  },
  {
    "name": "Question 3",
    "question": "Select ALL the core functions of SATourism.",
    "metadata": [
      "Collecting customs duty at airports",
      "Marketing South Africa abroad",
      "Coordinating industry marketing",
      "Maintaining facility standards",
      "Issuing visas to foreign tourists"
    ],
    "answer": [
      "Marketing South Africa abroad",
      "Maintaining facility standards",
      "Coordinating industry marketing",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "tourism_marketing",
    "topic": "satourism_functions",
    "subtopic": "tour_classification",
    "skills": [
      "classify_tourism_concept"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "tourism",
    "year": 2025,
    "paper": "nov_p1",
    "type": "application"
  },
  {
    "name": "Question 4",
    "question": "Match each marketing term to its meaning.",
    "metadata": [
      "A - TOMSA",
      "B - TBCSA",
      "C - SATourism",
      "D - Branding",
      "1 - Administers the tourism levy fund",
      "2 - Markets South Africa locally and internationally",
      "3 - Gives the destination a recognisable identity and logo",
      "4 - Provides extra funding to market South Africa"
    ],
    "answer": [
      "A-4",
      "B-1",
      "C-2",
      "D-3"
    ],
    "presentation": "match",
    "unit": "tourism_marketing",
    "topic": "satourism_functions",
    "subtopic": "tour_classification",
    "skills": [
      "classify_tourism_concept"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "tourism",
    "year": 2025,
    "paper": "nov_p1",
    "type": "definition"
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "6.1",
      "marks": 2,
      "clues": "- Read block B of the TOMSA information.\n- Think about who contributes.",
      "approach": "- Explain where the funding comes from.",
      "solution": "1. TOMSA collects the tourism levy (1%) from contributors."
    },
    {
      "number": "6.2",
      "marks": 2,
      "clues": "- Think about tourists choosing between destinations.",
      "approach": "- Explain the meaning of destination of choice.",
      "solution": "1. South Africa must be marketed so international tourists choose it as a holiday destination."
    },
    {
      "number": "6.3.1",
      "marks": 2,
      "clues": "- It is a business council.",
      "approach": "- Name the administrator of the fund.",
      "solution": "1. The Tourism Business Council of South Africa (TBCSA) administers the fund."
    },
    {
      "number": "6.3.2",
      "marks": 2,
      "clues": "- Its core business is marketing.",
      "approach": "- Name the body that markets South Africa.",
      "solution": "1. South African Tourism (SATourism) markets South Africa locally and internationally."
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
