#!/usr/bin/env node
/**
 * DBE Tourism — November 2025 — Question 3.3–3.5: Converting currency (order 13)
 * Question 3.3, 3.4 and 3.5 — converting rand to foreign currency and back, and comparing forex kiosks.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-tourism-2025-nov-p1-l13.js --curriculum temp/curriculum-vocab-tourism.json
 *   node scripts/add-tourism-2025-nov-p1-l13.js --dry-run
 *   node scripts/add-tourism-2025-nov-p1-l13.js
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
  "name": "Question 3.3–3.5: Converting currency",
  "syllabus": "dbe",
  "subject": "tourism",
  "year": 2025,
  "paper": "nov_p1",
  "order": 13,
  "content_tier": "free",
  "has_video": false,
  "xp": 8,
  "tags": [
    "forex_conversion",
    "forex_kiosks",
    "bank_selling_rate"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2025/nov_p1/q13/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2025/nov_p1/q13/memo_1.png"
  ],
  "exam_question_marks": 8,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Illustrative rates: euro BBR R18,40, BSR R19,30. A tourist wants to buy euros with R15 000 at the bank. Which calculation gives the number of euros?",
    "metadata": [
      "R15 000 × 19,30",
      "R15 000 ÷ 18,40",
      "R15 000 ÷ 19,30",
      "R15 000 × 18,40",
      ""
    ],
    "answer": [
      "R15 000 ÷ 19,30",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "foreign_exchange",
    "topic": "currency_conversion",
    "subtopic": "tour_calculation",
    "skills": [
      "convert_foreign_currency"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "tourism",
    "year": 2025,
    "paper": "nov_p1",
    "type": "conversion"
  },
  {
    "name": "Question 2",
    "question": "Illustrative rates: euro BBR R18,40, BSR R19,30. How many euros does a tourist receive for R15 000? Round off to TWO decimal places. []",
    "metadata": [
      "€ ",
      "[ ]"
    ],
    "answer": [
      "777.20|777.2",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "unit": "foreign_exchange",
    "topic": "currency_conversion",
    "subtopic": "tour_calculation",
    "skills": [
      "convert_foreign_currency"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "tourism",
    "year": 2025,
    "paper": "nov_p1",
    "type": "conversion",
    "clues": "- The bank is selling euros to the tourist.\n- Divide by the rate, then round off."
  },
  {
    "name": "Question 3",
    "question": "Illustrative rates: US dollar BBR R16,80, BSR R17,70. A tourist returns with USD350 and sells it to the bank. How many rand does the tourist receive? []",
    "metadata": [
      "R ",
      "[ ]"
    ],
    "answer": [
      "5880|5880.00",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "unit": "foreign_exchange",
    "topic": "currency_conversion",
    "subtopic": "tour_calculation",
    "skills": [
      "convert_foreign_currency"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "tourism",
    "year": 2025,
    "paper": "nov_p1",
    "type": "conversion",
    "clues": "- The bank is buying dollars from the tourist.\n- Multiply by the matching rate."
  },
  {
    "name": "Question 4",
    "question": "Select ALL the reasons why a tourist should compare the rates of different forex kiosks.",
    "metadata": [
      "To avoid showing a passport",
      "To get more foreign currency per rand",
      "To find the best rate on offer",
      "To avoid high fees",
      "To avoid paying for a flight ticket"
    ],
    "answer": [
      "To find the best rate on offer",
      "To avoid high fees",
      "To get more foreign currency per rand",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "foreign_exchange",
    "topic": "forex_kiosks",
    "subtopic": "tour_scenario_application",
    "skills": [
      "apply_tourism_concept_to_scenario"
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
      "number": "3.3",
      "marks": 3,
      "clues": "- The tourist is buying pounds.\n- Use the bank selling rate.",
      "approach": "- Divide the rand amount by the rate.\n- Round off to two decimals.",
      "solution": "1. R20 000 ÷ 23,50 = GBP851,06."
    },
    {
      "number": "3.4",
      "marks": 3,
      "clues": "- The tourist is selling pounds to the bank.\n- Use the bank buying rate.",
      "approach": "- Multiply the pounds by the rate.",
      "solution": "1. GBP200 × 22,50 = R4 500,00."
    },
    {
      "number": "3.5",
      "marks": 2,
      "clues": "- Think about cost and value.",
      "approach": "- Link comparing rates to getting the best value.",
      "solution": "1. A tourist should compare rates to avoid high fees and unfavourable exchange rates and so get the best value for the money."
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
