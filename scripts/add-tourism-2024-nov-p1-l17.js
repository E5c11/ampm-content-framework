#!/usr/bin/env node
/**
 * DBE Tourism — November 2024 — Question 7.1: Employment contracts, hours and overtime (order 17)
 * Question 7.1.1–7.1.2 — the contract of employment, working hours in the BCEA and the rules for overtime.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-tourism-2024-nov-p1-l17.js --curriculum temp/curriculum-vocab-tourism.json
 *   node scripts/add-tourism-2024-nov-p1-l17.js --dry-run
 *   node scripts/add-tourism-2024-nov-p1-l17.js
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
  "name": "Question 7.1: Employment contracts, hours and overtime",
  "syllabus": "dbe",
  "subject": "tourism",
  "year": 2024,
  "paper": "nov_p1",
  "order": 17,
  "content_tier": "free",
  "has_video": false,
  "xp": 6,
  "tags": [
    "tourism_employment_contract",
    "conditions_of_employment"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2024/nov_p1/q17/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2024/nov_p1/q17/memo_1.png"
  ],
  "exam_question_marks": 6,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Which document sets out a crew member's duties, pay and working hours, and is signed before work starts?",
    "metadata": [
      "A code of conduct policy",
      "A job advertisement form",
      "A contract of employment",
      "A visa application form",
      ""
    ],
    "answer": [
      "A contract of employment",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "tourism_sectors",
    "topic": "conditions_of_employment",
    "subtopic": "tour_term_recall",
    "skills": [
      "recall_tourism_term"
    ],
    "difficulty": 2,
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
    "question": "Under the BCEA, an employee who works a five-day week may work at most how many ordinary hours per day? []",
    "metadata": [
      "Hours: ",
      "[ ]"
    ],
    "answer": [
      "9",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "unit": "tourism_sectors",
    "topic": "conditions_of_employment",
    "subtopic": "tour_term_recall",
    "skills": [
      "recall_tourism_term"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "tourism",
    "year": 2024,
    "paper": "nov_p1",
    "type": "application",
    "clues": "- The BCEA limits ordinary hours to 45 per week."
  },
  {
    "name": "Question 3",
    "question": "A travel agent earns R80 per hour. Overtime is paid at 1,5 times the normal rate. How much does she earn for 2 hours of overtime? []",
    "metadata": [
      "R ",
      "[ ]"
    ],
    "answer": [
      "240|240.00",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "unit": "tourism_sectors",
    "topic": "conditions_of_employment",
    "subtopic": "tour_calculation",
    "skills": [
      "apply_tourism_concept_to_scenario"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "tourism",
    "year": 2024,
    "paper": "nov_p1",
    "type": "calc"
  },
  {
    "name": "Question 4",
    "question": "Select ALL the BCEA rules about overtime.",
    "metadata": [
      "Overtime may be ordered without any agreement",
      "Overtime must be agreed to by the employee",
      "Overtime is paid at 1,5 times the normal rate",
      "Overtime is never paid on normal weekdays",
      "Overtime hours have no weekly limit at all"
    ],
    "answer": [
      "Overtime must be agreed to by the employee",
      "Overtime is paid at 1,5 times the normal rate",
      "",
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
    "difficulty": 3,
    "exam_weight": 2,
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
      "number": "7.1.1",
      "marks": 2,
      "clues": "- The agreement is signed before reporting for duty.\n- It sets out the terms of the job.",
      "approach": "- Recall the name of the written agreement between employer and employee.\n- Name it in full.",
      "solution": "1. A contract of employment."
    },
    {
      "number": "7.1.2",
      "marks": 4,
      "clues": "- Lydia works Monday to Friday.\n- The BCEA sets 45 ordinary hours per week.",
      "approach": "- (a) Divide the weekly hours over five days.\n- (b) State one overtime rule from the BCEA.",
      "solution": "1. (a) 9 hours per day (45 hours per week); any 9-hour time frame is accepted.\n2. (b) She must be paid 1,5 times her normal rate for overtime; overtime must also be agreed upon."
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
