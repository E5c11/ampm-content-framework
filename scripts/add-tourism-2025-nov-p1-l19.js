#!/usr/bin/env node
/**
 * DBE Tourism — November 2025 — Question 7.2: Conditions of employment (order 19)
 * Question 7.2.1 and 7.2.2 — the core duty in a tourism job and why clear conditions of employment matter.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-tourism-2025-nov-p1-l19.js --curriculum temp/curriculum-vocab-tourism.json
 *   node scripts/add-tourism-2025-nov-p1-l19.js --dry-run
 *   node scripts/add-tourism-2025-nov-p1-l19.js
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
  "name": "Question 7.2: Conditions of employment",
  "syllabus": "dbe",
  "subject": "tourism",
  "year": 2025,
  "paper": "nov_p1",
  "order": 19,
  "content_tier": "free",
  "has_video": false,
  "xp": 6,
  "tags": [
    "conditions_of_employment",
    "tourism_employment_contract",
    "core_duties"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2025/nov_p1/q19/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2025/nov_p1/q19/memo_1.png"
  ],
  "exam_question_marks": 6,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Which is the core (most important) duty of a tour guide?",
    "metadata": [
      "Selling souvenirs to every visitor on the tour",
      "Booking flights for the guests in the group",
      "Guiding visitors safely with accurate facts",
      "Cleaning the tour coach after every trip",
      ""
    ],
    "answer": [
      "Guiding visitors safely with accurate facts",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "tourism_sectors",
    "topic": "conditions_of_employment",
    "subtopic": "tour_scenario_application",
    "skills": [
      "apply_tourism_concept_to_scenario"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "tourism",
    "year": 2025,
    "paper": "nov_p1",
    "type": "application"
  },
  {
    "name": "Question 2",
    "question": "Select ALL the items that belong in a contract of employment.",
    "metadata": [
      "The employer's profit forecast",
      "Working hours",
      "Salary and deductions",
      "Annual leave",
      "The menu for the staff party"
    ],
    "answer": [
      "Working hours",
      "Annual leave",
      "Salary and deductions",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "tourism_sectors",
    "topic": "conditions_of_employment",
    "subtopic": "tour_classification",
    "skills": [
      "classify_tourism_concept"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "tourism",
    "year": 2025,
    "paper": "nov_p1",
    "type": "application"
  },
  {
    "name": "Question 3",
    "question": "Select ALL the reasons why an employer should set out clear conditions of employment.",
    "metadata": [
      "Staff can choose their own working hours",
      "Employer and employee are both protected",
      "The daily operations run efficiently",
      "Staff behave professionally",
      "A written contract is no longer needed"
    ],
    "answer": [
      "The daily operations run efficiently",
      "Staff behave professionally",
      "Employer and employee are both protected",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "tourism_sectors",
    "topic": "conditions_of_employment",
    "subtopic": "tour_cause_and_effect",
    "skills": [
      "explain_tourism_cause_and_effect"
    ],
    "difficulty": 3,
    "exam_weight": 3,
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
    "question": "Match each employment term to its meaning.",
    "metadata": [
      "A - Remuneration",
      "B - Deductions",
      "C - Fringe benefit",
      "D - Termination of service",
      "1 - Amounts taken off pay, such as tax and pension",
      "2 - A non-cash advantage that comes with the job",
      "3 - The ending of the contract of employment",
      "4 - Payment received for the work done"
    ],
    "answer": [
      "A-4",
      "B-1",
      "C-2",
      "D-3"
    ],
    "presentation": "match",
    "unit": "tourism_sectors",
    "topic": "conditions_of_employment",
    "subtopic": "tour_term_recall",
    "skills": [
      "recall_tourism_term"
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
      "number": "7.2.1",
      "marks": 2,
      "clues": "- Think about what a cabin crew member is there to do first.",
      "approach": "- Identify the most important duty in the extract.",
      "solution": "1. The core duty is ensuring the safety of passengers on board."
    },
    {
      "number": "7.2.2",
      "marks": 4,
      "clues": "- Think about the airline and the crew.",
      "approach": "- Give two reasons for clear conditions of employment.",
      "solution": "1. To ensure efficiency in the airline's daily operations.\n2. To ensure that cabin crew show professionalism."
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
