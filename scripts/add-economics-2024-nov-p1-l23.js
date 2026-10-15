#!/usr/bin/env node
/**
 * DBE Economics P1 — November 2024 — Question 4.4: Social indicators of nutrition (order 23)
 * Lesson 23 of 2024 Nov P1 (DESIGN-UNI-14: 3 practice questions). Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2024-nov-p1-l23.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2024-nov-p1-l23.js --dry-run
 *   node scripts/add-economics-2024-nov-p1-l23.js
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
  "name": "Question 4.4: Social indicators of nutrition",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2024,
  "paper": "nov_p1",
  "order": 23,
  "content_tier": "free",
  "has_video": false,
  "xp": 8,
  "tags": [
    "nutrition",
    "social_indicators"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p1/q23/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p1/q23/memo_1.png"
  ],
  "exam_question_marks": 8,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "A clinic finds that many young children are too short for their age. Which form of malnutrition does this describe?",
    "metadata": [
      "Being underweight for age",
      "Dwarfism (short for age)",
      "Obesity",
      "Over-nutrition",
      ""
    ],
    "answer": [
      "Dwarfism (short for age)",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "economic_and_social_indicators",
    "topic": "social_indicators",
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
    "paper": "nov_p1",
    "clues": "- Malnutrition is measured in two ways: weight for age and height for age.\n- Decide which one the clinic has measured."
  },
  {
    "name": "Question 2",
    "question": "Select ALL the main causes of child malnutrition.",
    "metadata": [
      "Plenty of food in every household",
      "Household food insecurity",
      "Inadequate care of children",
      "Lack of health care services",
      "High life expectancy"
    ],
    "answer": [
      "Household food insecurity",
      "Inadequate care of children",
      "Lack of health care services",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "economic_and_social_indicators",
    "topic": "social_indicators",
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
    "paper": "nov_p1",
    "clues": "- Think about food, care and health services in the household and the community."
  },
  {
    "name": "Question 3",
    "question": "Match each nutrition indicator to what it points to.",
    "metadata": [
      "A - Underweight children",
      "B - Overweight children",
      "C - Household food insecurity",
      "1 - A leading cause of child malnutrition",
      "2 - Diseases such as diabetes and strain on public health",
      "3 - A leading cause of child deaths"
    ],
    "answer": [
      "A-3",
      "B-2",
      "C-1"
    ],
    "presentation": "match",
    "type": "application",
    "unit": "economic_and_social_indicators",
    "topic": "social_indicators",
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
    "clues": "- One indicator is about too little food in the home, one about too little weight and one about too much."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "4.4",
      "marks": 8,
      "clues": "- Organise your answer under child malnutrition and overweight children / obesity.",
      "approach": "- Four developed points of 2 marks each; at most 4 marks for listing.",
      "solution": "1. Child malnutrition is expressed as weight for age (underweight) and height for age (dwarfism); the proportion of underweight children is the key indicator.\n2. Malnutrition is a leading cause of child deaths; its main causes are household food insecurity, inadequate care and lack of health services.\n3. Overweight children weigh more than other children of the same age, gender and height; obesity is linked to diseases such as diabetes.\n4. These diseases lower productivity and strain the public health sector. Any other correct relevant response is accepted."
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
