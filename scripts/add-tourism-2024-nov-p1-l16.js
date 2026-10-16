#!/usr/bin/env node
/**
 * DBE Tourism — November 2024 — Question 6: Marketing South Africa abroad (order 16)
 * Question 6.1–6.2 — a sports star as SATourism brand ambassador, why SATourism markets South Africa internationally, the ITB trade show and the role of the TBCSA.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-tourism-2024-nov-p1-l16.js --curriculum temp/curriculum-vocab-tourism.json
 *   node scripts/add-tourism-2024-nov-p1-l16.js --dry-run
 *   node scripts/add-tourism-2024-nov-p1-l16.js
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
  "name": "Question 6: Marketing South Africa abroad",
  "syllabus": "dbe",
  "subject": "tourism",
  "year": 2024,
  "paper": "nov_p1",
  "order": 16,
  "content_tier": "free",
  "has_video": false,
  "xp": 10,
  "tags": [
    "satourism",
    "trade_shows",
    "tomsa_levy",
    "brand_ambassador"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2024/nov_p1/q16/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2024/nov_p1/q16/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2024/nov_p1/q16/memo_1.png"
  ],
  "exam_question_marks": 10,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Select ALL the reasons why SATourism markets South Africa internationally.",
    "metadata": [
      "To set the wages paid in the hotel sector",
      "To issue visas to foreign travellers",
      "To increase the number of foreign arrivals",
      "To grow awareness of SA as a destination",
      "To grade the quality of guesthouses"
    ],
    "answer": [
      "To increase the number of foreign arrivals",
      "To grow awareness of SA as a destination",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "tourism_marketing",
    "topic": "satourism_functions",
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
    "question": "Match each travel trade show to the city where it is held.",
    "metadata": [
      "A - ITB",
      "B - World Travel Market",
      "C - Africa's Travel Indaba",
      "D - Meetings Africa",
      "1 - London",
      "2 - Durban",
      "3 - Johannesburg",
      "4 - Berlin"
    ],
    "answer": [
      "A-4",
      "B-1",
      "C-2",
      "D-3"
    ],
    "presentation": "match",
    "unit": "tourism_marketing",
    "topic": "travel_trade_shows",
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
    "type": "definition"
  },
  {
    "name": "Question 3",
    "question": "Put the steps in the flow of the tourism marketing levy in order.",
    "metadata": [
      "TBCSA administers the levy funds",
      "Tourism businesses add a 1% levy to customer bills",
      "SATourism uses the funds to market South Africa",
      "TOMSA collects the levy from the businesses"
    ],
    "answer": [
      "Tourism businesses add a 1% levy to customer bills",
      "TOMSA collects the levy from the businesses",
      "TBCSA administers the levy funds",
      "SATourism uses the funds to market South Africa"
    ],
    "presentation": "ordering",
    "unit": "tourism_marketing",
    "topic": "tomsa_funding",
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
    "question": "Why would a tourism marketing body choose a famous national sports captain as a brand ambassador?",
    "metadata": [
      "He can issue visas to foreign fans",
      "He sets the prices of tourism products",
      "He grades hotels for the tourism council",
      "He is recognised and admired worldwide",
      ""
    ],
    "answer": [
      "He is recognised and admired worldwide",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "tourism_marketing",
    "topic": "destination_marketing",
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
      "number": "6.1.1",
      "marks": 2,
      "clues": "- Siya Kolisi is a well-known sports star.\n- Think about why people around the world know him.",
      "approach": "- Link his fame to marketing South Africa.\n- Give one reason.",
      "solution": "1. He is a well-known rugby player and captain of the Springbok rugby team; after the World Cup success he became recognisable across the world."
    },
    {
      "number": "6.1.2",
      "marks": 4,
      "clues": "- SATourism markets South Africa abroad.\n- Think about arrivals and awareness.",
      "approach": "- Give two goals of international marketing.\n- Link each to the economy or to awareness.",
      "solution": "1. To increase the annual number of foreign arrivals, resulting in economic growth.\n2. To increase international awareness of South Africa as a destination of choice."
    },
    {
      "number": "6.2.1",
      "marks": 2,
      "clues": "- The trade show is held in Berlin, Germany.",
      "approach": "- Recall the name of the large travel trade show in Berlin.\n- Write its abbreviation or full name.",
      "solution": "1. ITB (Internationale Tourismus-Börse), Berlin."
    },
    {
      "number": "6.2.2",
      "marks": 2,
      "clues": "- Three bodies handle the marketing levy: TOMSA, TBCSA and SATourism.",
      "approach": "- Describe the flow of the levy.\n- State what the TBCSA does with it.",
      "solution": "1. TOMSA collects the 1% levy and hands it to the TBCSA, which administers it and makes the funds available to SATourism for international marketing."
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
