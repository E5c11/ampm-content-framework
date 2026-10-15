#!/usr/bin/env node
/**
 * DBE Tourism — November 2025 — Question 8.2: Controlling alien invasive plants (order 21)
 * Question 8.2.1 and 8.2.2 — the impact of alien plants and the benefit of removing them.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-tourism-2025-nov-p1-l21.js --curriculum temp/curriculum-vocab-tourism.json
 *   node scripts/add-tourism-2025-nov-p1-l21.js --dry-run
 *   node scripts/add-tourism-2025-nov-p1-l21.js
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
  "name": "Question 8.2: Controlling alien invasive plants",
  "syllabus": "dbe",
  "subject": "tourism",
  "year": 2025,
  "paper": "nov_p1",
  "order": 21,
  "content_tier": "free",
  "has_video": false,
  "xp": 4,
  "tags": [
    "alien_invasive_plants",
    "environmental_practices",
    "biodiversity"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2025/nov_p1/q21/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2025/nov_p1/q21/memo_1.png"
  ],
  "exam_question_marks": 4,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Alien plants are left to grow uncontrolled in a nature reserve. What is a likely negative impact?",
    "metadata": [
      "They lower the temperature of the reserve",
      "They compete with indigenous plants and upset nature",
      "They increase the number of indigenous plant species there",
      "They reduce the risk of veld fires there",
      ""
    ],
    "answer": [
      "They compete with indigenous plants and upset nature",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "sustainable_responsible_tourism",
    "topic": "environmental_practices",
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
    "question": "Select ALL the benefits for a nature reserve when a community project removes invasive plants.",
    "metadata": [
      "The invasive plants use more water",
      "Positive publicity attracts more visitors",
      "Indigenous plants flourish again",
      "Biodiversity is restored faster",
      "The risk of veld fires rises"
    ],
    "answer": [
      "Indigenous plants flourish again",
      "Biodiversity is restored faster",
      "Positive publicity attracts more visitors",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "sustainable_responsible_tourism",
    "topic": "environmental_practices",
    "subtopic": "tour_cause_and_effect",
    "skills": [
      "explain_tourism_cause_and_effect"
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
    "question": "Match each environmental practice to the area it improves.",
    "metadata": [
      "A - Removing alien invasive plants",
      "B - Reduce, re-use and recycle",
      "C - Fitting water-saving taps",
      "D - Placing bins along trails",
      "1 - Waste management",
      "2 - Resource management",
      "3 - Litter control",
      "4 - Protecting indigenous biodiversity"
    ],
    "answer": [
      "A-4",
      "B-1",
      "C-2",
      "D-3"
    ],
    "presentation": "match",
    "unit": "sustainable_responsible_tourism",
    "topic": "environmental_practices",
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
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "8.2.1",
      "marks": 2,
      "clues": "- Think about how alien plants affect indigenous plants.",
      "approach": "- State one negative impact on nature.",
      "solution": "1. Alien plants harm local ecosystems by competing with indigenous species and disrupting the balance of nature."
    },
    {
      "number": "8.2.2",
      "marks": 2,
      "clues": "- Think about the benefits of a healthy ecosystem.",
      "approach": "- Discuss one benefit for the reserve.",
      "solution": "1. Removing invasive plants helps preserve the natural biodiversity of the area."
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
