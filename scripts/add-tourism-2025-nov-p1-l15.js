#!/usr/bin/env node
/**
 * DBE Tourism — November 2025 — Question 4.2: A New 7 Wonders icon and its success (order 15)
 * Question 4.2.1–4.2.4 — locating an icon, the advantage of New 7 Wonders status and how transport adds to an attraction's success.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-tourism-2025-nov-p1-l15.js --curriculum temp/curriculum-vocab-tourism.json
 *   node scripts/add-tourism-2025-nov-p1-l15.js --dry-run
 *   node scripts/add-tourism-2025-nov-p1-l15.js
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
  "name": "Question 4.2: A New 7 Wonders icon and its success",
  "syllabus": "dbe",
  "subject": "tourism",
  "year": 2025,
  "paper": "nov_p1",
  "order": 15,
  "content_tier": "free",
  "has_video": false,
  "xp": 12,
  "tags": [
    "new_seven_wonders",
    "icon_location",
    "attraction_transport"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2025/nov_p1/q15/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2025/nov_p1/q15/memo_1.png"
  ],
  "exam_question_marks": 12,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Match each icon to the continent where it is found.",
    "metadata": [
      "A - Machu Picchu",
      "B - The Great Wall of China",
      "C - The Colosseum",
      "D - The Statue of Liberty",
      "1 - Asia",
      "2 - Europe",
      "3 - North America",
      "4 - South America"
    ],
    "answer": [
      "A-4",
      "B-1",
      "C-2",
      "D-3"
    ],
    "presentation": "match",
    "unit": "tourist_attractions",
    "topic": "world_icons",
    "subtopic": "tour_classification",
    "skills": [
      "classify_tourism_concept"
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
    "question": "Machu Picchu is one of the New 7 Wonders of the World. What is one advantage of this status for the icon?",
    "metadata": [
      "It no longer needs a management plan",
      "Entry becomes free for all tourists",
      "Visitors can no longer damage it in any way",
      "It can use the status to market the icon",
      ""
    ],
    "answer": [
      "It can use the status to market the icon",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "tourist_attractions",
    "topic": "icon_success",
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
    "question": "A tourist train now links a major city to a world-famous ruin. Select ALL the ways the train can add to the success of the ruin as an attraction.",
    "metadata": [
      "It lowers the income of nearby businesses",
      "It reduces road traffic to the site",
      "It brings more visitors to the area",
      "It makes the site easier to reach",
      "It makes the ruin harder to reach"
    ],
    "answer": [
      "It brings more visitors to the area",
      "It makes the site easier to reach",
      "It reduces road traffic to the site",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "tourist_attractions",
    "topic": "icon_success",
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
    "question": "A tourist train is named after the ancient civilisation that built the ruin it serves. Why is the name closely linked to the icon?",
    "metadata": [
      "Trains are always named after countries",
      "The name shows that the train is cheaper than the buses and taxis",
      "The name links the train to the culture and history of the icon",
      "The name tells passengers which platform to use",
      ""
    ],
    "answer": [
      "The name links the train to the culture and history of the icon",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "tourist_attractions",
    "topic": "icon_success",
    "subtopic": "tour_cause_and_effect",
    "skills": [
      "explain_tourism_cause_and_effect"
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
      "number": "4.2.1(a)",
      "marks": 2,
      "clues": "- Read the infographic for the location.",
      "approach": "- Name the country where Chichen Itza is found.",
      "solution": "1. Chichen Itza is in Mexico."
    },
    {
      "number": "4.2.1(b)",
      "marks": 2,
      "clues": "- Think about the country's position on the world map.",
      "approach": "- Name the continent of that country.",
      "solution": "1. Mexico is in North America."
    },
    {
      "number": "4.2.2",
      "marks": 2,
      "clues": "- Look at the name of the train.",
      "approach": "- Link the name to the history of the site.",
      "solution": "1. The Maya train is named after the ancient Mayan civilisation of Chichen Itza."
    },
    {
      "number": "4.2.3",
      "marks": 2,
      "clues": "- Think about how status helps marketing.",
      "approach": "- Explain one advantage of being one of the New 7 Wonders.",
      "solution": "1. The status can be used in its marketing strategy and creates awareness that attracts more tourists."
    },
    {
      "number": "4.2.4",
      "marks": 4,
      "clues": "- Think about access and visitor numbers.",
      "approach": "- Discuss two ways the train adds to success.",
      "solution": "1. The train brings more tourists to the area.\n2. More tourists bring more income for the area."
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
