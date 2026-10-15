#!/usr/bin/env node
/**
 * DBE Tourism — November 2025 — Question 10: Customer feedback (order 24)
 * Question 10.1 and 10.2 — why feedback is valuable, winning back an unhappy customer and methods of collecting feedback.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-tourism-2025-nov-p1-l24.js --curriculum temp/curriculum-vocab-tourism.json
 *   node scripts/add-tourism-2025-nov-p1-l24.js --dry-run
 *   node scripts/add-tourism-2025-nov-p1-l24.js
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
  "name": "Question 10: Customer feedback",
  "syllabus": "dbe",
  "subject": "tourism",
  "year": 2025,
  "paper": "nov_p1",
  "order": 24,
  "content_tier": "free",
  "has_video": false,
  "xp": 10,
  "tags": [
    "customer_feedback",
    "feedback_methods",
    "customer_care"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2025/nov_p1/q24/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2025/nov_p1/q24/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2025/nov_p1/q24/memo_1.png"
  ],
  "exam_question_marks": 10,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Why can customer feedback be seen as a gift to a business?",
    "metadata": [
      "It guarantees that every guest returns again",
      "It replaces the need for any staff training",
      "It automatically lowers all of the business's running costs",
      "It shows how to improve services and keep customers",
      ""
    ],
    "answer": [
      "It shows how to improve services and keep customers",
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
    "question": "Select ALL the ways a business can turn an unhappy customer into a happy one.",
    "metadata": [
      "Argue about who is right",
      "Listen so that the customer feels heard",
      "Apologise for the poor service",
      "Offer an immediate solution",
      "Ask the customer to complain in writing next week"
    ],
    "answer": [
      "Listen so that the customer feels heard",
      "Apologise for the poor service",
      "Offer an immediate solution",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "communication_customer_care",
    "topic": "customer_feedback",
    "subtopic": "tour_scenario_application",
    "skills": [
      "apply_tourism_concept_to_scenario"
    ],
    "difficulty": 3,
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
    "question": "Select ALL the methods a business can use to collect customer feedback.",
    "metadata": [
      "Counting the number of staff on duty",
      "Online surveys",
      "SMS or e-mail questionnaires",
      "Follow-up phone calls",
      "Printing prices on a notice board"
    ],
    "answer": [
      "Online surveys",
      "Follow-up phone calls",
      "SMS or e-mail questionnaires",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "communication_customer_care",
    "topic": "feedback_methods",
    "subtopic": "tour_classification",
    "skills": [
      "classify_tourism_concept"
    ],
    "difficulty": 2,
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
    "question": "Match each feedback method to a benefit or drawback.",
    "metadata": [
      "A - Real-time feedback",
      "B - Handwritten survey",
      "C - Online survey",
      "D - Follow-up phone call",
      "1 - Can delay the business's response",
      "2 - Reaches many customers quickly",
      "3 - Feels personal to the customer",
      "4 - Lets the business act immediately on a problem"
    ],
    "answer": [
      "A-4",
      "B-1",
      "C-2",
      "D-3"
    ],
    "presentation": "match",
    "unit": "communication_customer_care",
    "topic": "feedback_methods",
    "subtopic": "tour_cause_and_effect",
    "skills": [
      "explain_tourism_cause_and_effect"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "tourism",
    "year": 2025,
    "paper": "nov_p1",
    "type": "application"
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "10.1.1",
      "marks": 2,
      "clues": "- Think about what a business learns from complaints.",
      "approach": "- Explain one reason feedback is a gift.",
      "solution": "1. The business can maintain or improve its services to retain and increase its customer base."
    },
    {
      "number": "10.1.2",
      "marks": 2,
      "clues": "- Think about how an unhappy customer wants to be treated.",
      "approach": "- Suggest one way to change the customer's mood.",
      "solution": "1. Listen attentively so that the customer feels heard and valued."
    },
    {
      "number": "10.2.1",
      "marks": 4,
      "clues": "- The diagram already names two methods.",
      "approach": "- State two other methods.",
      "solution": "1. Online surveys that capture customer responses.\n2. Employing people to gather feedback through one-on-one interviews."
    },
    {
      "number": "10.2.2",
      "marks": 2,
      "clues": "- Compare real-time feedback with a written survey.",
      "approach": "- Explain one benefit of real-time feedback.",
      "solution": "1. Real-time feedback allows immediate action on the issue while handwritten surveys may delay the process."
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
