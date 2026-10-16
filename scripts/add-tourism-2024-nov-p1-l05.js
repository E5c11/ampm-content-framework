#!/usr/bin/env node
/**
 * DBE Tourism — November 2024 — Question 1: Global events, occurrences and arrivals (Section A) (order 5)
 * Section A items 1.1.16–1.1.20 and 1.2.1–1.2.5 — global sports events, acts of terror, Stats SA, purpose of visit, web-based feedback, political situations, recession, expenditure, publicity and land markets.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-tourism-2024-nov-p1-l05.js --curriculum temp/curriculum-vocab-tourism.json
 *   node scripts/add-tourism-2024-nov-p1-l05.js --dry-run
 *   node scripts/add-tourism-2024-nov-p1-l05.js
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
  "name": "Question 1: Global events, occurrences and arrivals (Section A)",
  "syllabus": "dbe",
  "subject": "tourism",
  "year": 2024,
  "paper": "nov_p1",
  "order": 5,
  "content_tier": "free",
  "has_video": false,
  "xp": 10,
  "tags": [
    "unforeseen_occurrences",
    "foreign_arrivals",
    "feedback_methods"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2024/nov_p1/q5/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2024/nov_p1/q5/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2024/nov_p1/q5/memo_1.png"
  ],
  "exam_question_marks": 10,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Match each event to the type of unforeseen occurrence it is.",
    "metadata": [
      "A - A tsunami floods a coastal resort",
      "B - A bomb explodes at a busy airport",
      "C - Mass protests close a capital city",
      "D - Jobs and spending fall across a country",
      "1 - Act of terror",
      "2 - Political unrest",
      "3 - Economic recession",
      "4 - Natural disaster"
    ],
    "answer": [
      "A-4",
      "B-1",
      "C-2",
      "D-3"
    ],
    "presentation": "match",
    "unit": "domestic_regional_international_tourism",
    "topic": "global_events_and_occurrences",
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
    "question": "Tourists from Lesotho who drive into South Africa through the Maseru Bridge border post form part of which market?",
    "metadata": [
      "The air market",
      "The land market",
      "The sea market",
      "The long-haul market",
      ""
    ],
    "answer": [
      "The land market",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "domestic_regional_international_tourism",
    "topic": "foreign_arrivals",
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
    "year": 2024,
    "paper": "nov_p1",
    "type": "application"
  },
  {
    "name": "Question 3",
    "question": "Illustrative data — purpose of visit of foreign arrivals: visiting friends and relatives (VFR) 38%, holiday 25%, shopping 22%, business 9%, other 6%. Which purpose is the second most popular?",
    "metadata": [
      "Shopping",
      "Business",
      "Holiday",
      "VFR",
      ""
    ],
    "answer": [
      "Holiday",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "domestic_regional_international_tourism",
    "topic": "foreign_arrivals",
    "subtopic": "tour_data_interpretation",
    "skills": [
      "interpret_tourism_stimulus"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "tourism",
    "year": 2024,
    "paper": "nov_p1",
    "type": "interpretation"
  },
  {
    "name": "Question 4",
    "question": "A tour company collects feedback through an online form. Select ALL the disadvantages of this method.",
    "metadata": [
      "Responses can be collected very quickly",
      "Results can be analysed electronically",
      "Customers need internet access and data",
      "Customers without a device are left out",
      "Customers can respond from anywhere"
    ],
    "answer": [
      "Customers need internet access and data",
      "Customers without a device are left out",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "communication_customer_care",
    "topic": "feedback_methods",
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
      "number": "1.1.16",
      "marks": 1,
      "clues": "- The question asks about the most recent Rugby World Cup.\n- The final was held in France in 2023.",
      "approach": "- Recall which team won the 2023 Rugby World Cup.\n- Choose that country.",
      "solution": "1. South Africa won the 2023 Rugby World Cup: D."
    },
    {
      "number": "1.1.17",
      "marks": 1,
      "clues": "- The event was deliberate violence against civilians.",
      "approach": "- Rule out natural disasters and civil war.\n- Choose the term for deliberate attacks that spread fear.",
      "solution": "1. A mass shooting is an act of terror: B."
    },
    {
      "number": "1.1.18",
      "marks": 1,
      "clues": "- The organisation collects national statistics.",
      "approach": "- Recall which body publishes tourism data such as length of stay.\n- Rule out the tax, rail and tour-operator bodies.",
      "solution": "1. Stats SA collects information on tourists' length of stay: C."
    },
    {
      "number": "1.1.19",
      "marks": 1,
      "clues": "- Read the percentages on the graph.\n- Find the bar just below the highest one.",
      "approach": "- Rank the four purposes by percentage.\n- Pick the second-highest.",
      "solution": "1. VFR is highest (41,4%) and shopping is second (22,9%): B."
    },
    {
      "number": "1.1.20",
      "marks": 1,
      "clues": "- A disadvantage is a problem with the method.",
      "approach": "- Rule out the options that describe benefits.\n- Choose the option that limits who can respond.",
      "solution": "1. Web-based feedback needs an internet connection and data: C."
    },
    {
      "number": "1.2.1",
      "marks": 1,
      "clues": "- The Israel-Gaza War is a conflict between governments and groups.",
      "approach": "- Choose the term from the list for a conflict situation.\n- Rule out natural disasters.",
      "solution": "1. The Israel-Gaza War is an example of a political situation."
    },
    {
      "number": "1.2.2",
      "marks": 1,
      "clues": "- Fewer tourists means less money in the economy.",
      "approach": "- Choose the term for a period of economic decline.\n- Use the word from the list.",
      "solution": "1. It can lead to a recession."
    },
    {
      "number": "1.2.3",
      "marks": 1,
      "clues": "- Expenditure is about spending.",
      "approach": "- Choose between days spent and money spent.\n- Use the word from the list.",
      "solution": "1. Expenditure refers to the money spent while travelling."
    },
    {
      "number": "1.2.4",
      "marks": 1,
      "clues": "- A serious accident is reported in the media.",
      "approach": "- Choose the term for media coverage.\n- Use the word from the list.",
      "solution": "1. It will lead to negative publicity."
    },
    {
      "number": "1.2.5",
      "marks": 1,
      "clues": "- Beit Bridge is a road border post.",
      "approach": "- Decide how the tourists entered South Africa.\n- Choose between air and land.",
      "solution": "1. Tourists entering at Beit Bridge form part of land markets."
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
