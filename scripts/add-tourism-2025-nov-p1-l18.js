#!/usr/bin/env node
/**
 * DBE Tourism — November 2025 — Question 7.1: Dress code and professional image (order 18)
 * Question 7.1.1–7.1.4 — breaking a dress code, dress to impress, advantages for the business and guiding an employee.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-tourism-2025-nov-p1-l18.js --curriculum temp/curriculum-vocab-tourism.json
 *   node scripts/add-tourism-2025-nov-p1-l18.js --dry-run
 *   node scripts/add-tourism-2025-nov-p1-l18.js
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
  "name": "Question 7.1: Dress code and professional image",
  "syllabus": "dbe",
  "subject": "tourism",
  "year": 2025,
  "paper": "nov_p1",
  "order": 18,
  "content_tier": "free",
  "has_video": false,
  "xp": 10,
  "tags": [
    "dress_code",
    "professional_image",
    "staff_grooming"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2025/nov_p1/q18/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2025/nov_p1/q18/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2025/nov_p1/q18/memo_1.png"
  ],
  "exam_question_marks": 10,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "A lodge's dress code states: closed shoes only; clean uniform shirt; name badge worn on the shirt; no caps indoors; hair neat. Jabu arrives for work in sandals, with her name badge in her bag and a cap on. Select ALL the rules she has broken.",
    "metadata": [
      "She wears a clean uniform shirt",
      "She wears a cap indoors",
      "She wears sandals",
      "She does not wear her name badge",
      "Her hair is neat"
    ],
    "answer": [
      "She wears sandals",
      "She does not wear her name badge",
      "She wears a cap indoors",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "tourism_sectors",
    "topic": "professional_image",
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
    "question": "A manager tells new staff to dress to impress. What does the manager mean?",
    "metadata": [
      "Wear the most expensive clothes you own",
      "Dress to suit the position and build confidence",
      "Copy the clothes that the guests wear",
      "Dress casually so that every guest feels relaxed",
      ""
    ],
    "answer": [
      "Dress to suit the position and build confidence",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "tourism_sectors",
    "topic": "professional_image",
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
    "question": "Select ALL the advantages for a business when all staff follow the dress code.",
    "metadata": [
      "It allows the business to pay staff less",
      "It creates a professional and trustworthy image",
      "It helps customers to identify staff easily",
      "It sets a standard of hygiene and cleanliness",
      "It removes the need for staff training"
    ],
    "answer": [
      "It creates a professional and trustworthy image",
      "It helps customers to identify staff easily",
      "It sets a standard of hygiene and cleanliness",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "tourism_sectors",
    "topic": "professional_image",
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
    "question": "Arrange these actions a manager can take when an employee ignores the dress code, from first to last.",
    "metadata": [
      "Help the employee find the correct uniform",
      "Remind the employee of the dress code policy",
      "Take further action if the rules continue to be ignored",
      "Explain why the dress code matters to the business"
    ],
    "answer": [
      "Remind the employee of the dress code policy",
      "Explain why the dress code matters to the business",
      "Help the employee find the correct uniform",
      "Take further action if the rules continue to be ignored"
    ],
    "presentation": "ordering",
    "unit": "tourism_sectors",
    "topic": "professional_image",
    "subtopic": "tour_process_sequence",
    "skills": [
      "sequence_tourism_process"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "tourism",
    "year": 2025,
    "paper": "nov_p1",
    "type": "ordering"
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "7.1.1",
      "marks": 2,
      "clues": "- Compare the cartoon employee with the dress code list.",
      "approach": "- Find two items the employee wears that are not allowed.",
      "solution": "1. He is wearing sports or casual shoes and excessive jewellery."
    },
    {
      "number": "7.1.2",
      "marks": 2,
      "clues": "- Think about the position you work in.",
      "approach": "- Explain what dress to impress means.",
      "solution": "1. Dress appropriately for the position you are employed for, so customers feel confident about the business."
    },
    {
      "number": "7.1.3",
      "marks": 4,
      "clues": "- Think about image and identification.",
      "approach": "- Discuss two advantages.",
      "solution": "1. It creates a professional and trustworthy image of the company.\n2. It helps customers easily identify staff members."
    },
    {
      "number": "7.1.4",
      "marks": 2,
      "clues": "- Think about how to guide, not punish.",
      "approach": "- Suggest one way a manager can guide the employee.",
      "solution": "1. Remind the employee of the dress code policy."
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
