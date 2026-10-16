#!/usr/bin/env node
/**
 * DBE Tourism — November 2024 — Question 10: Customer surveys (order 24)
 * Question 10.1–10.3 — the meaning of a customer survey, managing customer responses, and how surveys improve customer satisfaction.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-tourism-2024-nov-p1-l24.js --curriculum temp/curriculum-vocab-tourism.json
 *   node scripts/add-tourism-2024-nov-p1-l24.js --dry-run
 *   node scripts/add-tourism-2024-nov-p1-l24.js
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
  "name": "Question 10: Customer surveys",
  "syllabus": "dbe",
  "subject": "tourism",
  "year": 2024,
  "paper": "nov_p1",
  "order": 24,
  "content_tier": "free",
  "has_video": false,
  "xp": 10,
  "tags": [
    "customer_surveys",
    "customer_feedback"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2024/nov_p1/q24/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2024/nov_p1/q24/memo_1.png"
  ],
  "exam_question_marks": 10,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "What is a customer survey?",
    "metadata": [
      "A method of advertising products to customers",
      "A method of collecting feedback from customers",
      "A method of recruiting new staff members",
      "A method of tracking the monthly sales figures",
      ""
    ],
    "answer": [
      "A method of collecting feedback from customers",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "communication_customer_care",
    "topic": "customer_feedback",
    "subtopic": "tour_term_recall",
    "skills": [
      "recall_tourism_term"
    ],
    "difficulty": 1,
    "exam_weight": 1,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "tourism",
    "year": 2024,
    "paper": "nov_p1",
    "type": "definition"
  },
  {
    "name": "Question 2",
    "question": "Put the steps for managing customer survey responses in order.",
    "metadata": [
      "Group common complaints into problem areas",
      "Collect the completed customer surveys",
      "Draw up and carry out an action plan",
      "Capture and analyse the responses"
    ],
    "answer": [
      "Collect the completed customer surveys",
      "Capture and analyse the responses",
      "Group common complaints into problem areas",
      "Draw up and carry out an action plan"
    ],
    "presentation": "ordering",
    "unit": "communication_customer_care",
    "topic": "customer_feedback",
    "subtopic": "tour_process_sequence",
    "skills": [
      "sequence_tourism_process"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "tourism",
    "year": 2024,
    "paper": "nov_p1",
    "type": "ordering"
  },
  {
    "name": "Question 3",
    "question": "Select ALL the ways customer surveys can improve customer satisfaction.",
    "metadata": [
      "They replace the need for staff training",
      "They build loyalty and repeat visits",
      "They show where service must improve",
      "They guide an action plan for change",
      "They stop all customer complaints"
    ],
    "answer": [
      "They show where service must improve",
      "They guide an action plan for change",
      "They build loyalty and repeat visits",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "communication_customer_care",
    "topic": "customer_feedback",
    "subtopic": "tour_cause_and_effect",
    "skills": [
      "explain_tourism_cause_and_effect"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "tourism",
    "year": 2024,
    "paper": "nov_p1",
    "type": "application"
  },
  {
    "name": "Question 4",
    "question": "A manager files every survey without reading it. What is the main problem with this?",
    "metadata": [
      "Customers receive refunds too quickly",
      "Staff spend too long with each guest",
      "The survey forms become too costly",
      "Chances to improve service are missed",
      ""
    ],
    "answer": [
      "Chances to improve service are missed",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "communication_customer_care",
    "topic": "customer_feedback",
    "subtopic": "tour_cause_and_effect",
    "skills": [
      "explain_tourism_cause_and_effect"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "tourism",
    "year": 2024,
    "paper": "nov_p1",
    "type": "application"
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "10.1",
      "marks": 2,
      "clues": "- A survey asks customers questions.",
      "approach": "- Explain what a survey collects.\n- Say why a business uses it.",
      "solution": "1. A customer survey is a method of collecting customer feedback; it measures customer satisfaction after a product or service has been used."
    },
    {
      "number": "10.2",
      "marks": 4,
      "clues": "- Filing responses is not enough.\n- Think about analysing and acting on them.",
      "approach": "- Suggest two steps to manage responses.\n- Explain each one.",
      "solution": "1. Analyse and capture the feedback to determine the level of service.\n2. Group common complaints to identify problem areas, then implement an action plan."
    },
    {
      "number": "10.3",
      "marks": 4,
      "clues": "- Think about how findings lead to change.",
      "approach": "- Give two ways surveys improve satisfaction.\n- Explain each one.",
      "solution": "1. Analysing survey responses helps the company improve service delivery.\n2. The findings help develop an action plan to correct or improve products and services."
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
