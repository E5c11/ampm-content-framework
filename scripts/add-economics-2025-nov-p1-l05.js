#!/usr/bin/env node
/**
 * DBE Economics P1 — November 2025 — Question 2.1: Leading indicators and free riders (order 5)
 * Lesson 5 of the 2025 Nov P1 repair (DESIGN-UNI-14: 3 practice questions). Question 2.1: Leading indicators and free riders. Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2025-nov-p1-l05.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2025-nov-p1-l05.js --dry-run
 *   node scripts/add-economics-2025-nov-p1-l05.js
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
  "name": "Question 2.1: Leading indicators and free riders",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2025,
  "paper": "nov_p1",
  "order": 5,
  "content_tier": "free",
  "has_video": false,
  "xp": 4,
  "tags": [
    "leading_indicators",
    "public_sector_failure"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q5/question_11.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q5/memo_11.png"
  ],
  "exam_question_marks": 4,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Select ALL the leading indicators of the business cycle.",
    "metadata": [
      "Number of building plans approved",
      "Business Confidence Index",
      "New companies registered",
      "Consumer price index (CPI)",
      "Unemployment rate"
    ],
    "answer": [
      "Number of building plans approved",
      "Business Confidence Index",
      "New companies registered",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "definition",
    "unit": "business_cycles",
    "topic": "cycle_indicators",
    "subtopic": "econ_classification",
    "skills": [
      "classify_economic_concept"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- A leading indicator changes before the economy as a whole turns.\n- Ask which items reflect plans and expectations rather than results already visible in the economy."
  },
  {
    "name": "Question 2",
    "question": "A government agency builds a bridge that anyone can cross without paying. Which measure would best exclude free riders from using it?",
    "metadata": [
      "Lower the taxes paid by local firms",
      "Charge a toll at the bridge entrance",
      "Build a second identical bridge next to it",
      "Allow private firms to advertise on the bridge",
      ""
    ],
    "answer": [
      "Charge a toll at the bridge entrance",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "public_sector",
    "topic": "public_goods_and_free_riders",
    "subtopic": "econ_cause_and_effect",
    "skills": [
      "explain_economic_impact"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- A free rider uses something without contributing to its cost.\n- Look for a measure that makes access depend on payment."
  },
  {
    "name": "Question 3",
    "question": "Why is it difficult for government to stop people from using a public good such as street lighting?",
    "metadata": [
      "Only wealthy citizens benefit from it",
      "Private firms own all the street lights",
      "Once it is provided, no one can easily be prevented from benefiting from it",
      "Street lights are very scarce",
      ""
    ],
    "answer": [
      "Once it is provided, no one can easily be prevented from benefiting from it",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "public_sector",
    "topic": "public_goods_and_free_riders",
    "subtopic": "econ_cause_and_effect",
    "skills": [
      "explain_economic_impact"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Think about whether a driver can be stopped from benefiting from the light on the road."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "2.1.1",
      "marks": 2,
      "clues": "- Leading indicators signal a turn in the cycle before it happens.",
      "approach": "- List indicators that reflect plans, orders and confidence.\n- Name any two.",
      "solution": "1. Examples that qualify include the number of building plans approved, job advertising space, number of vehicles sold, new companies registered and the Business Confidence Index.\n2. Any two correct examples score the two marks."
    },
    {
      "number": "2.1.2",
      "marks": 2,
      "clues": "- Think of ways to make access depend on paying.",
      "approach": "- Recall how government funds collective goods.\n- Explain one way that stops non-payers from consuming.",
      "solution": "1. Government can charge user fees or levies for facilities such as stadiums and national roads.\n2. It can also fund public goods through taxes, which forces everyone to contribute."
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
