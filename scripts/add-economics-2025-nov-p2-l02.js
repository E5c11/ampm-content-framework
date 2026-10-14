#!/usr/bin/env node
/**
 * DBE Economics P2 — November 2025 — Question 1.1.5–1.1.8: Inflation, tourism and waste (order 2)
 * Lesson 2 of 2025 Nov P2 (DESIGN-UNI-14: 4 practice questions). Question 1.1.5–1.1.8: Inflation, tourism and waste. Fresh practice questions (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2025-nov-p2-l02.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2025-nov-p2-l02.js --dry-run
 *   node scripts/add-economics-2025-nov-p2-l02.js
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
  "name": "Question 1.1.5–1.1.8: Inflation, tourism and waste",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2025,
  "paper": "nov_p2",
  "order": 2,
  "content_tier": "free",
  "has_video": false,
  "xp": 8,
  "tags": [
    "inflation_measures",
    "business_tourism",
    "tourism_infrastructure",
    "recycling"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p2/q2/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p2/q2/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p2/q2/memo_1.png"
  ],
  "exam_question_marks": 8,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Prices rise by 8% over a year while Zodwa’s savings account pays 3% interest. What happens to the real value of her savings?",
    "metadata": [
      "It rises by 5%",
      "It rises by 3%",
      "It stays the same",
      "It declines",
      ""
    ],
    "answer": [
      "It declines",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "economics_inflation",
    "topic": "inflation_types_and_effects",
    "subtopic": "econ_cause_and_effect",
    "skills": [
      "explain_economic_impact"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- Compare the growth of her money with the growth of prices."
  },
  {
    "name": "Question 2",
    "question": "Select ALL the trips that count as business tourism.",
    "metadata": [
      "Attending an industry conference in another province",
      "Visiting a trade exhibition abroad to meet suppliers",
      "Travelling to a company meeting at head office in another city",
      "A family holiday at the coast",
      "Hiking in a nature reserve"
    ],
    "answer": [
      "Attending an industry conference in another province",
      "Visiting a trade exhibition abroad to meet suppliers",
      "Travelling to a company meeting at head office in another city",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "definition",
    "unit": "tourism",
    "topic": "tourism_concepts",
    "subtopic": "econ_classification",
    "skills": [
      "classify_economic_concept"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- Business tourism means travel for meetings, conferences and trade.\n- Two options are leisure trips."
  },
  {
    "name": "Question 3",
    "question": "Match each type of tourism infrastructure to an example.",
    "metadata": [
      "A - Transport",
      "B - Communication",
      "C - Energy",
      "D - Basic services",
      "1 - A new runway at a regional airport",
      "2 - Fibre-optic internet at a resort",
      "3 - A solar plant that powers a game lodge",
      "4 - Clean water and sanitation for a tourist village"
    ],
    "answer": [
      "A-1",
      "B-2",
      "C-3",
      "D-4"
    ],
    "presentation": "match",
    "type": "definition",
    "unit": "tourism",
    "topic": "tourism_concepts",
    "subtopic": "econ_classification",
    "skills": [
      "classify_economic_concept"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- Decide what each example helps visitors to do or use."
  },
  {
    "name": "Question 4",
    "question": "A company collects used glass bottles, melts them down and moulds them into new bottles. Which waste-management method is this?",
    "metadata": [
      "Re-using",
      "Landfilling",
      "Recycling",
      "Preservation",
      ""
    ],
    "answer": [
      "Recycling",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "environmental_sustainability",
    "topic": "waste_management",
    "subtopic": "econ_classification",
    "skills": [
      "classify_economic_concept"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- The old material is converted into a new product.\n- Re-using would keep the original bottle as it is."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "1.1.5",
      "marks": 2,
      "clues": "- Compare what happens to the price level with what the savings earn.",
      "approach": "- Recall the effect of inflation on money.\n- Link rising prices to purchasing power.",
      "solution": "1. When the general price level rises, each rand buys less.\n2. The real value of savings therefore declines, so B is correct."
    },
    {
      "number": "1.1.6",
      "marks": 2,
      "clues": "- Think about the purpose of the visit: work or leisure.",
      "approach": "- Recall the types of tourism.\n- Pick the one built around meetings and conferences.",
      "solution": "1. Visiting places for meetings and conferences is business tourism, so B is correct."
    },
    {
      "number": "1.1.7",
      "marks": 2,
      "clues": "- Internet access is a form of connecting people and information.",
      "approach": "- Recall the categories of tourism infrastructure.\n- Choose the one that covers internet.",
      "solution": "1. Internet facilities form part of communication infrastructure, so C is correct."
    },
    {
      "number": "1.1.8",
      "marks": 2,
      "clues": "- The material is converted into something economically useful.",
      "approach": "- Recall waste-management methods.\n- Pick the one that turns waste into new goods.",
      "solution": "1. Converting waste material into economic goods is recycling, so A is correct."
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
