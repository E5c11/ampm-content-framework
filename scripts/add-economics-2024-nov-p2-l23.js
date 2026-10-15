#!/usr/bin/env node
/**
 * DBE Economics P2 — November 2024 — Question 4.3.4–4.3.5: Income, tourism and barriers to travel (order 23)
 * Lesson 23 of 2024 Nov P2 (DESIGN-UNI-14: 3 practice questions). Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2024-nov-p2-l23.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2024-nov-p2-l23.js --dry-run
 *   node scripts/add-economics-2024-nov-p2-l23.js
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

// ─── Phase 2 — lesson document ───────────────────────────────────────────────

const video = {
  "name": "Question 4.3.4–4.3.5: Income, tourism and barriers to travel",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2024,
  "paper": "nov_p2",
  "order": 23,
  "content_tier": "free",
  "has_video": false,
  "xp": 8,
  "tags": [
    "tourism",
    "tourism_impacts"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p2/q23/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p2/q23/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p2/q23/memo_2.png"
  ],
  "exam_question_marks": 6,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "What is the likely effect of a rise in households’ disposable income on tourism?",
    "metadata": [
      "fewer households take leisure trips",
      "no household changes its trips",
      "more households take leisure trips",
      "all trips become cheaper",
      ""
    ],
    "answer": [
      "more households take leisure trips",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "tourism",
    "topic": "tourism_benefits_and_policy",
    "subtopic": "econ_classification",
    "skills": [
      "classify_economic_concept"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Think about what people can afford once their needs are met."
  },
  {
    "name": "Question 2",
    "question": "Select ALL the factors that can discourage South Africans from visiting local tourist sites.",
    "metadata": [
      "Low prices and good safety",
      "A high crime rate in the area",
      "Health hazards such as malaria",
      "High entrance, transport and accommodation costs",
      "Excellent roads to every site"
    ],
    "answer": [
      "A high crime rate in the area",
      "Health hazards such as malaria",
      "High entrance, transport and accommodation costs",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "tourism",
    "topic": "tourism_impacts",
    "subtopic": "econ_classification",
    "skills": [
      "classify_economic_concept"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Think of risks and costs that put people off travelling."
  },
  {
    "name": "Question 3",
    "question": "Arrange the effects of a rise in household disposable income on tourism.",
    "metadata": [
      "More domestic trips are taken",
      "Income from tourism rises for local businesses",
      "Households’ disposable income rises",
      "Households spend more on leisure"
    ],
    "answer": [
      "Households’ disposable income rises",
      "Households spend more on leisure",
      "More domestic trips are taken",
      "Income from tourism rises for local businesses"
    ],
    "presentation": "ordering",
    "type": "ordering",
    "unit": "tourism",
    "topic": "tourism_benefits_and_policy",
    "subtopic": "econ_policy_evaluation",
    "skills": [
      "evaluate_economic_policy"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Start with income, then spending decisions, then trips, then the gains for businesses."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "4.3.4",
      "marks": 2,
      "clues": "- Think about disposable income and leisure spending.",
      "approach": "- Explain in one sentence.",
      "solution": "An increase in disposable income increases the number of people who participate in tourism; a decrease reduces the number of people who travel."
    },
    {
      "number": "4.3.5",
      "marks": 4,
      "clues": "- Think of safety, health, disasters and costs.",
      "approach": "- Give two developed points of 2 marks each.",
      "solution": "1. Social unrest and high crime may discourage visits.\n2. Health hazards such as malaria and unsafe water discourage visits.\n3. Natural disasters can destroy sites and infrastructure.\n4. High entrance fees, accommodation and transport costs make visits unaffordable. Any other correct relevant response is accepted."
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
