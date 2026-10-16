#!/usr/bin/env node
/**
 * DBE Tourism — November 2024 — Question 8.2: Sustainable airport management (order 20)
 * Question 8.2.1–8.2.2 — how a sustainable airport strategy benefits business operations and shows responsibility for climate change.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-tourism-2024-nov-p1-l20.js --curriculum temp/curriculum-vocab-tourism.json
 *   node scripts/add-tourism-2024-nov-p1-l20.js --dry-run
 *   node scripts/add-tourism-2024-nov-p1-l20.js
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
  "name": "Question 8.2: Sustainable airport management",
  "syllabus": "dbe",
  "subject": "tourism",
  "year": 2024,
  "paper": "nov_p1",
  "order": 20,
  "content_tier": "free",
  "has_video": false,
  "xp": 8,
  "tags": [
    "sustainable_management",
    "environmental_practices"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2024/nov_p1/q20/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2024/nov_p1/q20/memo_1.png"
  ],
  "exam_question_marks": 8,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Select ALL the ways a sustainable airport strategy can benefit business operations.",
    "metadata": [
      "Longer queues at check-in counters",
      "A better public image",
      "Less reliance on fossil fuels",
      "Lower energy costs over time",
      "More fuel imported every year"
    ],
    "answer": [
      "Less reliance on fossil fuels",
      "Lower energy costs over time",
      "A better public image",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "sustainable_responsible_tourism",
    "topic": "sustainable_management",
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
    "year": 2024,
    "paper": "nov_p1",
    "type": "application"
  },
  {
    "name": "Question 2",
    "question": "Select ALL the actions that show an airport taking responsibility for climate change.",
    "metadata": [
      "Diesel generators running all day",
      "Electric vehicles on the airside",
      "Extra lighting in empty car parks",
      "Energy-saving lighting in terminals",
      "Burning waste on the airport site"
    ],
    "answer": [
      "Electric vehicles on the airside",
      "Energy-saving lighting in terminals",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "sustainable_responsible_tourism",
    "topic": "sustainable_management",
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
    "year": 2024,
    "paper": "nov_p1",
    "type": "application"
  },
  {
    "name": "Question 3",
    "question": "An airport advertises itself as 'green' but makes no real changes to how it uses energy. What is this called?",
    "metadata": [
      "Carbon offsetting",
      "Recycling",
      "Greenwashing",
      "Eco-certification",
      ""
    ],
    "answer": [
      "Greenwashing",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "sustainable_responsible_tourism",
    "topic": "environmental_practices",
    "subtopic": "tour_term_recall",
    "skills": [
      "recall_tourism_term"
    ],
    "difficulty": 3,
    "exam_weight": 1,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "tourism",
    "year": 2024,
    "paper": "nov_p1",
    "type": "definition"
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "8.2.1",
      "marks": 4,
      "clues": "- Think about costs, energy supply and reputation.",
      "approach": "- Give two ways the strategy helps the business.\n- Explain each one.",
      "solution": "1. It reduces the business's reliance on fossil fuels through sustainable practices.\n2. Operations become cost-effective and partnerships with like-minded businesses can be built; load shedding no longer affects operations."
    },
    {
      "number": "8.2.2",
      "marks": 4,
      "clues": "- Think about technology and fuel use at airports.",
      "approach": "- Give two ways the strategy addresses climate change.\n- Explain each one.",
      "solution": "1. Airports can use efficient technology that supports green initiatives.\n2. They can use alternative fuels and electric vehicles on the tarmac and elsewhere."
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
