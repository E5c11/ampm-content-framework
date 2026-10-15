#!/usr/bin/env node
/**
 * DBE Tourism — November 2025 — Question 1: Tourism sectors and employment (Section A) (order 1)
 * Section A items 1.1.1, 1.1.2 and 1.1.11 — travel budget items, the national tourism department and fringe benefits.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-tourism-2025-nov-p1-l01.js --curriculum temp/curriculum-vocab-tourism.json
 *   node scripts/add-tourism-2025-nov-p1-l01.js --dry-run
 *   node scripts/add-tourism-2025-nov-p1-l01.js
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
  "name": "Question 1: Tourism sectors and employment (Section A)",
  "syllabus": "dbe",
  "subject": "tourism",
  "year": 2025,
  "paper": "nov_p1",
  "order": 1,
  "content_tier": "free",
  "has_video": false,
  "xp": 3,
  "tags": [
    "travel_budget",
    "fringe_benefits_tourism",
    "tourism_policy_department"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2025/nov_p1/q1/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2025/nov_p1/q1/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2025/nov_p1/q1/memo_1.png"
  ],
  "exam_question_marks": 3,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "A tour group sets aside money at the end of its trip to thank the guide and the coach driver for excellent service. Which item in the tour budget is this?",
    "metadata": [
      "Insurance premium",
      "Visa fees",
      "Gratuities",
      "Airport departure tax",
      ""
    ],
    "answer": [
      "Gratuities",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "map_work_tour_planning",
    "topic": "tour_budget",
    "subtopic": "tour_scenario_application",
    "skills": [
      "apply_tourism_concept_to_scenario"
    ],
    "difficulty": 2,
    "exam_weight": 1,
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
    "question": "A hotel group lets all its employees stay at its other hotels at a heavily reduced rate, on top of their monthly salary. What is this advantage called?",
    "metadata": [
      "Basic salary",
      "A fringe benefit",
      "Overtime pay",
      "Leave pay",
      ""
    ],
    "answer": [
      "A fringe benefit",
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
    "difficulty": 2,
    "exam_weight": 1,
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
    "question": "Select ALL the items that are fringe benefits an airline might offer its staff.",
    "metadata": [
      "Basic monthly salary",
      "Discounted flight tickets for staff",
      "Free meals while on duty",
      "Reduced-rate hotel rooms on layovers",
      "Payment for extra hours worked"
    ],
    "answer": [
      "Discounted flight tickets for staff",
      "Free meals while on duty",
      "Reduced-rate hotel rooms on layovers",
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
    "order": 3,
    "syllabus": "dbe",
    "subject": "tourism",
    "year": 2025,
    "paper": "nov_p1",
    "type": "application"
  },
  {
    "name": "Question 4",
    "question": "Match each tourism body to the task it performs.",
    "metadata": [
      "A - Department of Tourism",
      "B - UNESCO",
      "C - TOMSA",
      "D - SATourism",
      "1 - Declares World Heritage Sites",
      "2 - Collects the levy for marketing South Africa",
      "3 - Markets South Africa as a destination",
      "4 - Develops national tourism policy"
    ],
    "answer": [
      "A-4",
      "B-1",
      "C-2",
      "D-3"
    ],
    "presentation": "match",
    "unit": "tourism_sectors",
    "topic": "tourism_bodies_and_roles",
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
    "type": "application"
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "1.1.1",
      "marks": 1,
      "clues": "- A travel budget lists the expected costs of a trip.\n- Which item shows thanks for good service?",
      "approach": "- Think about the extra amount paid to people who serve you.\n- Compare each option with that purpose.",
      "solution": "1. Gratuities (tips) show appreciation for good service, so the answer is C."
    },
    {
      "number": "1.1.2",
      "marks": 1,
      "clues": "- The White Paper is tourism policy.\n- Which national department is responsible for tourism?",
      "approach": "- Recall which department develops and promotes tourism in South Africa.\n- Note that the memo accepts two forms of the name.",
      "solution": "1. The Department of Tourism is responsible for the White Paper on the Development and Promotion of Tourism, so B is correct.\n2. The memo also accepts A (National Department of Tourism) because the industry still uses that name."
    },
    {
      "number": "1.1.11",
      "marks": 1,
      "clues": "- The benefit is not part of the salary.\n- It is linked to the industry the employee works in.",
      "approach": "- Recall the benefits that come with a job besides salary and leave.\n- Match discounted flight tickets with the correct category.",
      "solution": "1. Discounted flight tickets are a fringe benefit, so the answer is B."
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
