#!/usr/bin/env node
/**
 * DBE Tourism — November 2024 — Question 3.4: GDP and hosting a global event (order 12)
 * Question 3.4.1–3.4.2 — the meaning of gross domestic product and how hosting the Olympic Games increases a country's GDP.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-tourism-2024-nov-p1-l12.js --curriculum temp/curriculum-vocab-tourism.json
 *   node scripts/add-tourism-2024-nov-p1-l12.js --dry-run
 *   node scripts/add-tourism-2024-nov-p1-l12.js
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
  "name": "Question 3.4: GDP and hosting a global event",
  "syllabus": "dbe",
  "subject": "tourism",
  "year": 2024,
  "paper": "nov_p1",
  "order": 12,
  "content_tier": "free",
  "has_video": false,
  "xp": 6,
  "tags": [
    "gross_domestic_product",
    "multiplier_effect",
    "economic_impact_tourism"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2024/nov_p1/q12/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2024/nov_p1/q12/memo_1.png"
  ],
  "exam_question_marks": 6,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "What does gross domestic product (GDP) measure?",
    "metadata": [
      "The total value of goods and services produced in a country in a year",
      "The value of a country's exports minus the value of its imports in a year",
      "The total amount of money that foreign tourists spend in a country",
      "The average income earned by each person living in a country per year",
      ""
    ],
    "answer": [
      "The total value of goods and services produced in a country in a year",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "foreign_exchange",
    "topic": "gross_domestic_product",
    "subtopic": "tour_term_recall",
    "skills": [
      "recall_tourism_term"
    ],
    "difficulty": 3,
    "exam_weight": 2,
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
    "question": "A city hosts a major international sports event. Select ALL the ways this can increase the host country's GDP.",
    "metadata": [
      "Local residents travel abroad during the event",
      "Businesses expand to meet extra demand",
      "Visitors spend money on tourism services",
      "New jobs are created for local people",
      "Foreign teams bring all their own supplies"
    ],
    "answer": [
      "Visitors spend money on tourism services",
      "New jobs are created for local people",
      "Businesses expand to meet extra demand",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "foreign_exchange",
    "topic": "gross_domestic_product",
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
    "year": 2024,
    "paper": "nov_p1",
    "type": "application"
  },
  {
    "name": "Question 3",
    "question": "Put this chain of tourist spending in order.",
    "metadata": [
      "The staff buy groceries at a local shop",
      "A tourist pays a guesthouse for a night's stay",
      "The shop orders more stock from a local farmer",
      "The guesthouse pays wages to its cleaning staff"
    ],
    "answer": [
      "A tourist pays a guesthouse for a night's stay",
      "The guesthouse pays wages to its cleaning staff",
      "The staff buy groceries at a local shop",
      "The shop orders more stock from a local farmer"
    ],
    "presentation": "ordering",
    "unit": "foreign_exchange",
    "topic": "gross_domestic_product",
    "subtopic": "tour_process_sequence",
    "skills": [
      "sequence_tourism_process"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "tourism",
    "year": 2024,
    "paper": "nov_p1",
    "type": "ordering"
  },
  {
    "name": "Question 4",
    "question": "Tourist money passes from the guesthouse to its staff, then to a shop and a farmer. What is this called?",
    "metadata": [
      "Foreign exchange leakage",
      "Seasonal demand",
      "The multiplier effect",
      "Price inflation",
      ""
    ],
    "answer": [
      "The multiplier effect",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "foreign_exchange",
    "topic": "gross_domestic_product",
    "subtopic": "tour_term_recall",
    "skills": [
      "recall_tourism_term"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "xp": 10,
    "order": 4,
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
      "number": "3.4.1",
      "marks": 2,
      "clues": "- GDP measures a country's production.\n- It is usually measured over one year.",
      "approach": "- State what is counted.\n- Say over which period.",
      "solution": "1. GDP is a measure of all the goods and services produced domestically over a specific time, usually a year."
    },
    {
      "number": "3.4.2",
      "marks": 4,
      "clues": "- The Games brought many foreign tourists to France.\n- Think about spending, jobs and businesses.",
      "approach": "- Explain how tourist spending adds to production.\n- Link it to jobs and the multiplier effect.",
      "solution": "1. The Games brought many tourists, which increased foreign income earnings.\n2. Tourists used tourism products and services, which generated income.\n3. Demand created jobs and business opportunities and set the multiplier effect in motion."
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
