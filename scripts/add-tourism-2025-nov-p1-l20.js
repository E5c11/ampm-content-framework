#!/usr/bin/env node
/**
 * DBE Tourism — November 2025 — Question 8.1: Responsible tourist behaviour (order 20)
 * Question 8.1.1–8.1.3 — being a responsible tourist, using litter bins and alternatives to single-use plastic bottles.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-tourism-2025-nov-p1-l20.js --curriculum temp/curriculum-vocab-tourism.json
 *   node scripts/add-tourism-2025-nov-p1-l20.js --dry-run
 *   node scripts/add-tourism-2025-nov-p1-l20.js
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
  "name": "Question 8.1: Responsible tourist behaviour",
  "syllabus": "dbe",
  "subject": "tourism",
  "year": 2025,
  "paper": "nov_p1",
  "order": 20,
  "content_tier": "free",
  "has_video": false,
  "xp": 10,
  "tags": [
    "responsible_tourist",
    "litter_control",
    "single_use_plastic"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2025/nov_p1/q20/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2025/nov_p1/q20/memo_1.png"
  ],
  "exam_question_marks": 10,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Four tourists picnic at a national park viewpoint. Which one is behaving responsibly?",
    "metadata": [
      "The one who feeds the baboons for closer photos",
      "The one who picks wild flowers as souvenirs",
      "The one who plays loud music at the quiet viewpoint all day",
      "The one who bins the rubbish and stays on marked paths",
      ""
    ],
    "answer": [
      "The one who bins the rubbish and stays on marked paths",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "sustainable_responsible_tourism",
    "topic": "responsible_tourist",
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
    "question": "Select ALL the advantages of putting litter into the bins provided.",
    "metadata": [
      "It makes the trail longer for hikers",
      "It keeps paths clean and safe for hikers",
      "It protects wildlife from litter",
      "It makes recycling easier",
      "It lets the park stop providing bins"
    ],
    "answer": [
      "It keeps paths clean and safe for hikers",
      "It protects wildlife from litter",
      "It makes recycling easier",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "sustainable_responsible_tourism",
    "topic": "litter_control",
    "subtopic": "tour_cause_and_effect",
    "skills": [
      "explain_tourism_cause_and_effect"
    ],
    "difficulty": 3,
    "exam_weight": 3,
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
    "question": "Select ALL the alternatives to carrying water in single-use plastic bottles on a hike.",
    "metadata": [
      "Buying many plastic bottles and leaving them at rest stops",
      "A refillable metal bottle",
      "Refilling at the park's water stations",
      "A hydration pack that can be refilled",
      "Using disposable plastic cups"
    ],
    "answer": [
      "A refillable metal bottle",
      "A hydration pack that can be refilled",
      "Refilling at the park's water stations",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "sustainable_responsible_tourism",
    "topic": "single_use_plastic",
    "subtopic": "tour_scenario_application",
    "skills": [
      "apply_tourism_concept_to_scenario"
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
    "question": "Match each responsible action to its benefit for the environment.",
    "metadata": [
      "A - Using a refillable bottle",
      "B - Staying on marked trails",
      "C - Taking litter to the bins",
      "D - Not feeding animals",
      "1 - Plants and soil are protected",
      "2 - Wildlife is kept safe from litter",
      "3 - Animals stay wild and healthy",
      "4 - Less plastic waste"
    ],
    "answer": [
      "A-4",
      "B-1",
      "C-2",
      "D-3"
    ],
    "presentation": "match",
    "unit": "sustainable_responsible_tourism",
    "topic": "responsible_tourist",
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
      "number": "8.1.1",
      "marks": 2,
      "clues": "- Think about the natural environment and the rules.",
      "approach": "- Explain what being responsible means.",
      "solution": "1. A responsible tourist respects the natural environment, follows the rules and considers the impact of their actions."
    },
    {
      "number": "8.1.2",
      "marks": 4,
      "clues": "- Think about hikers and wildlife.",
      "approach": "- State two advantages of using the bins.",
      "solution": "1. It keeps hiking paths and the environment beautiful and safe for other hikers.\n2. It protects wildlife that may swallow the litter."
    },
    {
      "number": "8.1.3",
      "marks": 4,
      "clues": "- Think about carrying water that can be reused.",
      "approach": "- Suggest two alternatives to single-use plastic bottles.",
      "solution": "1. Use eco-friendly, refillable bottles.\n2. Use water stations provided by some parks."
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
