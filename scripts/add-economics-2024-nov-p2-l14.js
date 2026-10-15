#!/usr/bin/env node
/**
 * DBE Economics P2 — November 2024 — Question 3.2.4–3.2.5: Taxpayers and natural disasters (order 14)
 * Lesson 14 of 2024 Nov P2 (DESIGN-UNI-14: 3 practice questions). Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2024-nov-p2-l14.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2024-nov-p2-l14.js --dry-run
 *   node scripts/add-economics-2024-nov-p2-l14.js
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
  "name": "Question 3.2.4–3.2.5: Taxpayers and natural disasters",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2024,
  "paper": "nov_p2",
  "order": 14,
  "content_tier": "free",
  "has_video": false,
  "xp": 8,
  "tags": [
    "inflation",
    "cost_push_inflation"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p2/q14/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p2/q14/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p2/q14/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p2/q14/memo_2.png"
  ],
  "exam_question_marks": 6,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "A worker’s salary rises by 6% when prices also rise by 6%, and she moves into a higher tax bracket. What happens to her real income?",
    "metadata": [
      "it rises because her salary rose",
      "it falls because she pays more tax",
      "it stays the same because prices rose",
      "it doubles because of the tax bracket",
      ""
    ],
    "answer": [
      "it falls because she pays more tax",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "economics_inflation",
    "topic": "inflation_types_and_effects",
    "subtopic": "econ_classification",
    "skills": [
      "classify_economic_concept"
    ],
    "difficulty": 4,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Her nominal income rose, but ask what her tax and the price rise do to her buying power."
  },
  {
    "name": "Question 2",
    "question": "Select ALL the ways in which natural disasters can contribute to inflation.",
    "metadata": [
      "They raise the cost of production",
      "They lead to rebuilding costs that firms recover in prices",
      "They cause demand to fall so prices drop",
      "They reduce the supply of goods and services",
      "They raise production in all industries"
    ],
    "answer": [
      "They raise the cost of production",
      "They lead to rebuilding costs that firms recover in prices",
      "They reduce the supply of goods and services",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "economics_inflation",
    "topic": "inflation_types_and_effects",
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
    "clues": "- Think about what a drought or flood does to costs and to supply."
  },
  {
    "name": "Question 3",
    "question": "Arrange the steps by which a severe drought can lead to higher food prices.",
    "metadata": [
      "The supply of food in shops falls",
      "A severe drought hits farming areas",
      "The prices of food rise",
      "Crop yields fall"
    ],
    "answer": [
      "A severe drought hits farming areas",
      "Crop yields fall",
      "The supply of food in shops falls",
      "The prices of food rise"
    ],
    "presentation": "ordering",
    "type": "ordering",
    "unit": "economics_inflation",
    "topic": "inflation_types_and_effects",
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
    "clues": "- Begin with the event, then its effect on farms, then on the market, then on prices."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "3.2.4",
      "marks": 2,
      "clues": "- Think about nominal income and tax brackets.",
      "approach": "- Explain in two linked points.",
      "solution": "1. Inflation raises taxpayers' nominal income even when real income is unchanged or falls.\n2. Taxpayers pay higher tax rates as nominal income rises although they are no better off (bracket creep)."
    },
    {
      "number": "3.2.5",
      "marks": 4,
      "clues": "- Think of costs, rebuilding expenses and supply.",
      "approach": "- Give two developed points of 2 marks each.",
      "solution": "1. Droughts, floods and similar events raise the cost of production, so prices rise.\n2. Unplanned rebuilding costs may be recovered through higher prices.\n3. Less supply with the same demand raises the general price level. Any other correct relevant response is accepted."
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
