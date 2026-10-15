#!/usr/bin/env node
/**
 * DBE Tourism — November 2025 — Question 1: Sustainable and responsible tourism (Section A) (order 5)
 * Section A items 1.1.12–1.1.15 and 1.3.4 — Blue Flag, certification, the three pillars, sustainable practices and CSI.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-tourism-2025-nov-p1-l05.js --curriculum temp/curriculum-vocab-tourism.json
 *   node scripts/add-tourism-2025-nov-p1-l05.js --dry-run
 *   node scripts/add-tourism-2025-nov-p1-l05.js
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
  "name": "Question 1: Sustainable and responsible tourism (Section A)",
  "syllabus": "dbe",
  "subject": "tourism",
  "year": 2025,
  "paper": "nov_p1",
  "order": 5,
  "content_tier": "free",
  "has_video": false,
  "xp": 5,
  "tags": [
    "three_pillars",
    "tourism_certification",
    "corporate_social_investment"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2025/nov_p1/q5/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2025/nov_p1/q5/question_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2025/nov_p1/q5/question_3.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2025/nov_p1/q5/memo_1.png"
  ],
  "exam_question_marks": 5,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Match each sustainable-tourism pillar to an example of a good practice.",
    "metadata": [
      "A - Environmental (planet)",
      "B - Economic (profit)",
      "C - Social (people)",
      "1 - Buying food from local farmers",
      "2 - Funding a school sports project",
      "3 - Recycling waste at a lodge"
    ],
    "answer": [
      "A-3",
      "B-1",
      "C-2"
    ],
    "presentation": "match",
    "unit": "sustainable_responsible_tourism",
    "topic": "three_pillars",
    "subtopic": "tour_classification",
    "skills": [
      "classify_tourism_concept"
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
    "question": "A coastal town wants its beaches and marinas recognised for high management and sustainability standards. Which certification should it work towards?",
    "metadata": [
      "Green Key",
      "Grading star rating",
      "World Heritage listing",
      "Blue Flag",
      ""
    ],
    "answer": [
      "Blue Flag",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "sustainable_responsible_tourism",
    "topic": "tourism_certification",
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
    "question": "A guest lodge pays for new classroom desks at a nearby school as part of its community programme. What is this kind of support called?",
    "metadata": [
      "Green-washing campaigns",
      "Resource management plans",
      "Corporate social investment",
      "Product packaging design",
      ""
    ],
    "answer": [
      "Corporate social investment",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "sustainable_responsible_tourism",
    "topic": "corporate_social_investment",
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
    "question": "Select ALL the practices that reduce the environmental impact of tourism.",
    "metadata": [
      "Advertising green claims with no action behind them",
      "Re-using towels and linen",
      "Managing water and energy use",
      "Controlling alien invasive plants",
      "Leaving litter bins unemptied"
    ],
    "answer": [
      "Re-using towels and linen",
      "Controlling alien invasive plants",
      "Managing water and energy use",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "sustainable_responsible_tourism",
    "topic": "environmental_practices",
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
      "number": "1.1.12",
      "marks": 1,
      "clues": "- The certification is linked to water.\n- It rates marine management and sustainability.",
      "approach": "- Recall the certification linked to beaches.",
      "solution": "1. Blue Flag recognises beaches and marinas that meet high standards, so the answer is B."
    },
    {
      "number": "1.1.13",
      "marks": 1,
      "clues": "- The organisation certifies responsible businesses.\n- Its name begins with Fair.",
      "approach": "- Recall the body linked to fair and responsible practice.",
      "solution": "1. Fair Trade Tourism (FTT) encourages and certifies responsible and sustainable practices, so the answer is A."
    },
    {
      "number": "1.1.14",
      "marks": 1,
      "clues": "- WESSA is a wildlife and environmental society.",
      "approach": "- Link its focus to one of the three pillars.",
      "solution": "1. WESSA subscribes to the environmental pillar, so the answer is C."
    },
    {
      "number": "1.1.15",
      "marks": 1,
      "clues": "- The practice must reduce environmental impact.\n- Two options are tricks or cosmetic.",
      "approach": "- Rule out green-washing and white-washing.",
      "solution": "1. Resource management reduces the environmental impact of tourism, so the answer is D."
    },
    {
      "number": "1.3.4",
      "marks": 1,
      "clues": "- The initiative goes beyond the core business.\n- It contributes to social development.",
      "approach": "- Choose between BSR and CSI.",
      "solution": "1. CSI (corporate social investment) refers to initiatives that support social development beyond core business activities."
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
