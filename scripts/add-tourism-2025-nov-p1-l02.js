#!/usr/bin/env node
/**
 * DBE Tourism — November 2025 — Question 1: Travel documents and borders (Section A) (order 2)
 * Section A items 1.1.3, 1.1.4, 1.1.5, 1.2.2 and 1.2.5 — the international date line, driving permit, documents for foreign currency, health certificates and customs regulations.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-tourism-2025-nov-p1-l02.js --curriculum temp/curriculum-vocab-tourism.json
 *   node scripts/add-tourism-2025-nov-p1-l02.js --dry-run
 *   node scripts/add-tourism-2025-nov-p1-l02.js
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
  "name": "Question 1: Travel documents and borders (Section A)",
  "syllabus": "dbe",
  "subject": "tourism",
  "year": 2025,
  "paper": "nov_p1",
  "order": 2,
  "content_tier": "free",
  "has_video": false,
  "xp": 5,
  "tags": [
    "travel_documents",
    "international_date_line",
    "customs_regulations"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2025/nov_p1/q2/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2025/nov_p1/q2/question_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2025/nov_p1/q2/question_3.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2025/nov_p1/q2/memo_1.png"
  ],
  "exam_question_marks": 5,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "A traveller crosses the line of longitude where the calendar date changes by one day. What is this line called?",
    "metadata": [
      "Greenwich Meridian",
      "Tropic of Capricorn",
      "Equator",
      "International Date Line",
      ""
    ],
    "answer": [
      "International Date Line",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "map_work_tour_planning",
    "topic": "world_time_zones",
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
    "year": 2025,
    "paper": "nov_p1",
    "type": "definition",
    "clues": "- This line lies roughly opposite the line that marks the starting point of the time zones."
  },
  {
    "name": "Question 2",
    "question": "A South African wants to hire a car and drive in a foreign country. Which organisation issues the document that allows this?",
    "metadata": [
      "Department of Health",
      "Airports Company South Africa",
      "Automobile Association",
      "South African Revenue Service",
      ""
    ],
    "answer": [
      "Automobile Association",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "map_work_tour_planning",
    "topic": "travel_documentation",
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
    "question": "A bank in South Africa will sell foreign currency for an overseas trip only when the customer can show proof of travelling. Select ALL the documents the bank asks for.",
    "metadata": [
      "A letter from the employer",
      "A parental consent form",
      "A paid flight ticket",
      "A valid passport",
      "A hotel breakfast voucher"
    ],
    "answer": [
      "A paid flight ticket",
      "A valid passport",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "map_work_tour_planning",
    "topic": "travel_documentation",
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
    "question": "Match each travel concept to its description.",
    "metadata": [
      "A - Health certificate",
      "B - Customs regulations",
      "C - Visa",
      "D - Travel allowance",
      "1 - Rules on the items that may be brought into a country",
      "2 - Permission to enter a country for a set purpose and time",
      "3 - The amount of money a traveller may take out per year",
      "4 - Proves the traveller received required vaccinations"
    ],
    "answer": [
      "A-4",
      "B-1",
      "C-2",
      "D-3"
    ],
    "presentation": "match",
    "unit": "map_work_tour_planning",
    "topic": "travel_documentation",
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
      "number": "1.1.3",
      "marks": 1,
      "clues": "- The line is at 180° longitude.\n- The date changes when it is crossed.",
      "approach": "- Recall the important lines of longitude.\n- Pick the one linked to a change in calendar date.",
      "solution": "1. The 180° line is the International Date Line, so the answer is D."
    },
    {
      "number": "1.1.4",
      "marks": 1,
      "clues": "- The permit is for driving abroad.\n- Think about the motoring organisation in South Africa.",
      "approach": "- Recall who issues an international driving permit.\n- Rule out the health and airport bodies.",
      "solution": "1. The Automobile Association issues the international driving permit in South Africa, so the answer is C."
    },
    {
      "number": "1.1.5",
      "marks": 1,
      "clues": "- Foreign currency is bought for travel abroad.\n- Banks need proof that you are really travelling.",
      "approach": "- Recall the documents a bank asks for when selling foreign currency.\n- Check which pair contains both items.",
      "solution": "1. A paid flight ticket and a valid passport are needed, so the answer is C."
    },
    {
      "number": "1.2.2",
      "marks": 1,
      "clues": "- The document is linked to vaccinations.\n- It is shown on entry to certain countries.",
      "approach": "- Pick the term from the list that proves vaccination.",
      "solution": "1. A health certificate verifies that vaccinations were received."
    },
    {
      "number": "1.2.5",
      "marks": 1,
      "clues": "- The rules control items brought into a country.\n- Alcohol, tobacco and currency are examples.",
      "approach": "- Pick the term from the list that describes the rules.",
      "solution": "1. Customs regulations control the movement of items such as alcohol, tobacco and currency into a country."
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
