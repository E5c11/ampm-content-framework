#!/usr/bin/env node
/**
 * DBE Tourism — November 2024 — Question 9.3: Digital wallets and cash (order 23)
 * Question 9.3.1–9.3.2 — advantages of digital wallets for paying for tourism products and why cash is no longer preferred.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-tourism-2024-nov-p1-l23.js --curriculum temp/curriculum-vocab-tourism.json
 *   node scripts/add-tourism-2024-nov-p1-l23.js --dry-run
 *   node scripts/add-tourism-2024-nov-p1-l23.js
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
  "name": "Question 9.3: Digital wallets and cash",
  "syllabus": "dbe",
  "subject": "tourism",
  "year": 2024,
  "paper": "nov_p1",
  "order": 23,
  "content_tier": "free",
  "has_video": false,
  "xp": 8,
  "tags": [
    "payment_methods",
    "digital_wallets"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2024/nov_p1/q23/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2024/nov_p1/q23/memo_1.png"
  ],
  "exam_question_marks": 8,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Select ALL the advantages of paying for tourism services with a digital wallet.",
    "metadata": [
      "It works without any phone or device",
      "Payments are quick and contactless",
      "No physical bank card is needed",
      "Spending is easy to keep track of",
      "It never needs a network connection"
    ],
    "answer": [
      "Payments are quick and contactless",
      "No physical bank card is needed",
      "Spending is easy to keep track of",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "domestic_regional_international_tourism",
    "topic": "forms_of_payment",
    "subtopic": "tour_classification",
    "skills": [
      "classify_tourism_concept"
    ],
    "difficulty": 2,
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
    "question": "Select ALL the reasons why cash is no longer a preferred method of payment.",
    "metadata": [
      "Every online shop accepts cash",
      "Stolen cash is easy to trace",
      "Cash can be lost or stolen",
      "Lost cash cannot be replaced",
      "Cash has no handling costs"
    ],
    "answer": [
      "Cash can be lost or stolen",
      "Lost cash cannot be replaced",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "domestic_regional_international_tourism",
    "topic": "forms_of_payment",
    "subtopic": "tour_cause_and_effect",
    "skills": [
      "explain_tourism_cause_and_effect"
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
    "question": "Match each payment method to its description.",
    "metadata": [
      "A - Digital wallet",
      "B - Credit card",
      "C - Debit card",
      "D - Cash",
      "1 - Borrows money to repay later",
      "2 - Takes money straight from an account",
      "3 - Notes and coins handed over in person",
      "4 - Pays with a tap of a smartphone"
    ],
    "answer": [
      "A-4",
      "B-1",
      "C-2",
      "D-3"
    ],
    "presentation": "match",
    "unit": "domestic_regional_international_tourism",
    "topic": "forms_of_payment",
    "subtopic": "tour_term_recall",
    "skills": [
      "recall_tourism_term"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "tourism",
    "year": 2024,
    "paper": "nov_p1",
    "type": "definition"
  },
  {
    "name": "Question 4",
    "question": "Which is a disadvantage of paying with a digital wallet while travelling?",
    "metadata": [
      "It is slower than counting out cash",
      "It cannot be used in other countries",
      "It needs a charged phone and a network",
      "It needs a paper receipt for each sale",
      ""
    ],
    "answer": [
      "It needs a charged phone and a network",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "domestic_regional_international_tourism",
    "topic": "forms_of_payment",
    "subtopic": "tour_scenario_application",
    "skills": [
      "apply_tourism_concept_to_scenario"
    ],
    "difficulty": 2,
    "exam_weight": 1,
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
      "number": "9.3.1",
      "marks": 4,
      "clues": "- Think about convenience and safety.\n- A smartphone replaces the card.",
      "approach": "- Give two advantages of digital wallets.\n- Explain each one.",
      "solution": "1. The need for physical cards is removed, so payment is convenient, quick and easy.\n2. Digital wallets allow contactless and paperless payments around the world."
    },
    {
      "number": "9.3.2",
      "marks": 4,
      "clues": "- Think about security when carrying cash.",
      "approach": "- Give two reasons why cash is less popular.\n- Explain each one.",
      "solution": "1. Cash is a security risk because it can be stolen or lost.\n2. Once lost or stolen it cannot be replaced; cash handling fees are also high."
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
