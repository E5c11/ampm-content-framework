#!/usr/bin/env node
/**
 * DBE Tourism — November 2025 — Question 1: Attractions and what makes them succeed (Section A) (order 4)
 * Section A items 1.1.7, 1.1.8, 1.3.2, 1.3.3 and 1.4.1–1.4.5 — famous icons and the factors that contribute to a successful attraction.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-tourism-2025-nov-p1-l04.js --curriculum temp/curriculum-vocab-tourism.json
 *   node scripts/add-tourism-2025-nov-p1-l04.js --dry-run
 *   node scripts/add-tourism-2025-nov-p1-l04.js
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
  "name": "Question 1: Attractions and what makes them succeed (Section A)",
  "syllabus": "dbe",
  "subject": "tourism",
  "year": 2025,
  "paper": "nov_p1",
  "order": 4,
  "content_tier": "free",
  "has_video": false,
  "xp": 9,
  "tags": [
    "tourist_icons",
    "attraction_success_factors",
    "universal_access"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2025/nov_p1/q4/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2025/nov_p1/q4/question_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2025/nov_p1/q4/question_3.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2025/nov_p1/q4/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2025/nov_p1/q4/memo_2.png"
  ],
  "exam_question_marks": 9,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Match each icon to the country where it is found.",
    "metadata": [
      "A - Machu Picchu",
      "B - Taj Mahal",
      "C - Colosseum",
      "D - Windmills",
      "1 - India",
      "2 - Italy",
      "3 - The Netherlands",
      "4 - Peru"
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
    "question": "Select ALL the signs that an attraction is successful.",
    "metadata": [
      "Fewer visitors than the business expected",
      "Visitor numbers exceed the target",
      "Many visitors come back again",
      "Income is above the target figure",
      "Complaints from the local community about damage"
    ],
    "answer": [
      "Visitor numbers exceed the target",
      "Many visitors come back again",
      "Income is above the target figure",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "tourist_attractions",
    "topic": "attraction_success_factors",
    "subtopic": "tour_classification",
    "skills": [
      "classify_tourism_concept"
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
    "question": "Match each management action to the success factor it improves.",
    "metadata": [
      "A - Security cameras and guards",
      "B - Ramps and wide doorways",
      "C - Painting and gardening each week",
      "D - Friendly, honest and punctual guides",
      "1 - Universal access",
      "2 - Appearance and upkeep",
      "3 - Ethical behaviour of staff",
      "4 - Crime prevention"
    ],
    "answer": [
      "A-4",
      "B-1",
      "C-2",
      "D-3"
    ],
    "presentation": "match",
    "unit": "tourist_attractions",
    "topic": "attraction_success_factors",
    "subtopic": "tour_scenario_application",
    "skills": [
      "apply_tourism_concept_to_scenario"
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
    "question": "A mountain village hosts more visitors, and the visitors stay longer. What is the most likely result for the attraction?",
    "metadata": [
      "Fewer repeat visits to the destination",
      "Income that exceeds its targeted figures",
      "Lower than expected visitor numbers",
      "Exploitation of the local community",
      ""
    ],
    "answer": [
      "Income that exceeds its targeted figures",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "tourist_attractions",
    "topic": "attraction_success_factors",
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
      "number": "1.1.7",
      "marks": 1,
      "clues": "- The city is in the Middle East.\n- It is an archaeological site.",
      "approach": "- Recall the world icons on the CAPS list.\n- Match the desert city with its site.",
      "solution": "1. Petra in Jordan is one of the richest and largest archaeological sites, so the answer is D."
    },
    {
      "number": "1.1.8",
      "marks": 1,
      "clues": "- More visitors and more time spent means more spending.",
      "approach": "- Link visitor numbers to income.",
      "solution": "1. Income exceeding the targeted figures is the result, so the answer is B."
    },
    {
      "number": "1.3.2",
      "marks": 1,
      "clues": "- The coastline is in France.\n- Nice and Cannes are on it.",
      "approach": "- Choose between the two bracketed coasts.",
      "solution": "1. The French Riviera is the Mediterranean coast with Nice and Cannes."
    },
    {
      "number": "1.3.3",
      "marks": 1,
      "clues": "- The attraction is a windmill landscape.",
      "approach": "- Choose the country linked to windmills.",
      "solution": "1. Windmills are a popular attraction in the Netherlands."
    },
    {
      "number": "1.4.1",
      "marks": 1,
      "clues": "- Look at the picture showing cameras.",
      "approach": "- Match the success factor with the picture.",
      "solution": "1. Crime prevention is matched to F (security cameras)."
    },
    {
      "number": "1.4.2",
      "marks": 1,
      "clues": "- Look at the picture showing gardening.",
      "approach": "- Match the success factor with the picture.",
      "solution": "1. Appearance and upkeep is matched to E."
    },
    {
      "number": "1.4.3",
      "marks": 1,
      "clues": "- Look at the picture linked to a travel trade show.",
      "approach": "- Match the success factor with the picture.",
      "solution": "1. Marketing the attraction is matched to B."
    },
    {
      "number": "1.4.4",
      "marks": 1,
      "clues": "- Look at the picture of a facility open to all visitors.",
      "approach": "- Match the success factor with the picture.",
      "solution": "1. Universal access is matched to A."
    },
    {
      "number": "1.4.5",
      "marks": 1,
      "clues": "- Look at the picture of staff serving visitors.",
      "approach": "- Match the success factor with the picture.",
      "solution": "1. Efficient and ethical behaviour of staff is matched to D."
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
