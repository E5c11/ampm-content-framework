#!/usr/bin/env node
/**
 * DBE Tourism — November 2024 — Question 1: Sustainable and responsible tourism (Section A) (order 4)
 * Section A items 1.1.14, 1.1.15 and 1.3.1–1.3.5 — responsible practices, work ethics, carbon footprint, FTT, CSI, refillable bottles and the triple bottom line.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-tourism-2024-nov-p1-l04.js --curriculum temp/curriculum-vocab-tourism.json
 *   node scripts/add-tourism-2024-nov-p1-l04.js --dry-run
 *   node scripts/add-tourism-2024-nov-p1-l04.js
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
  "year": 2024,
  "paper": "nov_p1",
  "order": 4,
  "content_tier": "free",
  "has_video": false,
  "xp": 7,
  "tags": [
    "environmental_practices",
    "tourism_certification",
    "corporate_social_investment"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2024/nov_p1/q4/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2024/nov_p1/q4/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2024/nov_p1/q4/memo_1.png"
  ],
  "exam_question_marks": 7,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Which organisation certifies that tourism businesses pay fair wages and provide good working conditions?",
    "metadata": [
      "SAHRA",
      "TGCSA",
      "UNESCO",
      "FTT",
      ""
    ],
    "answer": [
      "FTT",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "sustainable_responsible_tourism",
    "topic": "tourism_certification",
    "subtopic": "tour_term_recall",
    "skills": [
      "recall_tourism_term"
    ],
    "difficulty": 2,
    "exam_weight": 1,
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
    "question": "Match each sustainability term to its example or meaning.",
    "metadata": [
      "A - Corporate social investment",
      "B - Triple bottom line",
      "C - Carbon footprint",
      "D - Responsible practice",
      "1 - Balancing people, planet and profit",
      "2 - Greenhouse gases caused by an activity",
      "3 - Switching off lights in empty rooms",
      "4 - A hotel funds bursaries for local learners"
    ],
    "answer": [
      "A-4",
      "B-1",
      "C-2",
      "D-3"
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
    "order": 2,
    "syllabus": "dbe",
    "subject": "tourism",
    "year": 2024,
    "paper": "nov_p1",
    "type": "definition"
  },
  {
    "name": "Question 3",
    "question": "A conference centre wants to run a sustainable event. Select ALL the sustainable practices.",
    "metadata": [
      "Single-use plastic bottles at each seat",
      "Water stations for refillable glass bottles",
      "Digital programmes instead of printed ones",
      "Recycling bins in every conference hall",
      "Air conditioning left on in empty rooms"
    ],
    "answer": [
      "Water stations for refillable glass bottles",
      "Digital programmes instead of printed ones",
      "Recycling bins in every conference hall",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "sustainable_responsible_tourism",
    "topic": "environmental_practices",
    "subtopic": "tour_scenario_application",
    "skills": [
      "apply_tourism_concept_to_scenario"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "tourism",
    "year": 2024,
    "paper": "nov_p1",
    "type": "application"
  },
  {
    "name": "Question 4",
    "question": "Which behaviour shows good work ethics in a tourism business?",
    "metadata": [
      "Gossiping about fellow workers",
      "Taking long breaks during shifts",
      "Taking care of company equipment",
      "Accepting gifts from clients",
      ""
    ],
    "answer": [
      "Taking care of company equipment",
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
      "number": "1.1.14",
      "marks": 1,
      "clues": "- Saving electricity uses fewer resources.",
      "approach": "- Decide whether the practice helps or harms the environment.\n- Pick the positive term.",
      "solution": "1. Saving electricity is a responsible practice: B."
    },
    {
      "number": "1.1.15",
      "marks": 1,
      "clues": "- Good work ethics means behaving honestly and professionally.",
      "approach": "- Rule out the options that show poor behaviour.\n- Pick the option that shows respect.",
      "solution": "1. Respect for company property is an example of good work ethics: A."
    },
    {
      "number": "1.3.1",
      "marks": 1,
      "clues": "- Recycled material saves new raw materials and energy.",
      "approach": "- Decide whether this raises or lowers greenhouse gas emissions.\n- Choose the matching word.",
      "solution": "1. Buying products made from recyclable material results in a reduced carbon footprint."
    },
    {
      "number": "1.3.2",
      "marks": 1,
      "clues": "- The question is about fair wages and working conditions.\n- SAHRA deals with heritage.",
      "approach": "- Recall which body certifies fair practices in tourism.\n- Choose between the two bodies given.",
      "solution": "1. FTT (Fair Trade Tourism) ensures fair wages and good working conditions."
    },
    {
      "number": "1.3.3",
      "marks": 1,
      "clues": "- Internships help people in the local community.",
      "approach": "- Recall the term for a company's social development projects.\n- Choose between CBR and CSI.",
      "solution": "1. Offering internships to local school-leavers is a CSI (corporate social investment) initiative."
    },
    {
      "number": "1.3.4",
      "marks": 1,
      "clues": "- A sustainable choice can be reused many times.",
      "approach": "- Compare the two bottle materials.\n- Choose the one that avoids single-use waste.",
      "solution": "1. Delegates should refill glass bottles at the water station."
    },
    {
      "number": "1.3.5",
      "marks": 1,
      "clues": "- Respecting local customs is part of the social pillar.",
      "approach": "- Recall the term for balancing people, planet and profit.\n- Rule out the term about market share.",
      "solution": "1. Acknowledging local customs is part of practising the triple bottom line."
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
