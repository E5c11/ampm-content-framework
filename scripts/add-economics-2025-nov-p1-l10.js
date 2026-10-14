#!/usr/bin/env node
/**
 * DBE Economics P1 — November 2025 — Question 2.5: The rand (order 10)
 * Lesson 10 of the 2025 Nov P1 repair (DESIGN-UNI-14: 3 practice questions). Question 2.5: The rand. Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2025-nov-p1-l10.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2025-nov-p1-l10.js --dry-run
 *   node scripts/add-economics-2025-nov-p1-l10.js
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
  "name": "Question 2.5: The rand",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2025,
  "paper": "nov_p1",
  "order": 10,
  "content_tier": "free",
  "has_video": false,
  "xp": 8,
  "tags": [
    "exchange_rates"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q10/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q10/memo_1.png"
  ],
  "exam_question_marks": 8,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Select ALL the likely effects of a stronger (appreciating) rand on the South African economy.",
    "metadata": [
      "South African goods become cheaper for buyers abroad",
      "Exports become more expensive for foreign buyers",
      "Fewer foreign tourists visit because the rand is dearer",
      "Imported inputs such as crude oil become cheaper",
      "Imported goods become more expensive for local buyers"
    ],
    "answer": [
      "Imported inputs such as crude oil become cheaper",
      "Exports become more expensive for foreign buyers",
      "Fewer foreign tourists visit because the rand is dearer",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "foreign_exchange_and_bop",
    "topic": "currency_exchange_rates",
    "subtopic": "econ_cause_and_effect",
    "skills": [
      "explain_economic_impact"
    ],
    "difficulty": 4,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- A stronger rand buys more foreign currency but costs foreign buyers more.\n- Two options describe the opposite effect, which belongs to a weaker rand."
  },
  {
    "name": "Question 2",
    "question": "Why can a stronger rand help to reduce cost-push inflation?",
    "metadata": [
      "Exports earn more foreign currency for every unit sold",
      "Imported inputs such as fuel become cheaper for producers",
      "Consumers decide to save a larger share of their income",
      "The central bank is forced to raise the repo rate again",
      ""
    ],
    "answer": [
      "Imported inputs such as fuel become cheaper for producers",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "foreign_exchange_and_bop",
    "topic": "currency_exchange_rates",
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
    "clues": "- Cost-push inflation starts with producers’ costs rising.\n- A stronger currency changes what imports cost in rand."
  },
  {
    "name": "Question 3",
    "question": "A weaker rand is most likely to help which group?",
    "metadata": [
      "Importers of crude oil who pay for it in dollars",
      "South Africans who plan to travel and holiday overseas",
      "South African exporters, whose goods become cheaper abroad",
      "Borrowers who have debts that are owed in foreign currency",
      ""
    ],
    "answer": [
      "South African exporters, whose goods become cheaper abroad",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "foreign_exchange_and_bop",
    "topic": "currency_exchange_rates",
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
    "clues": "- A weaker rand makes foreign goods dearer in rand and South African goods cheaper in dollars."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "2.5",
      "marks": 8,
      "clues": "- A stronger rand has both positive and negative effects, so give both sides.\n- Each point needs to be developed beyond a bare statement.",
      "approach": "- List positives: cheaper imports and lower inflation, more investment, lower import payments.\n- List negatives: costlier exports, weaker export earnings and jobs, fewer tourists, a wider deficit.\n- Develop four points with a consequence each.",
      "solution": "1. Positive: imported inputs such as crude oil and vehicle parts become cheaper, curbing cost-push inflation and lowering production costs.\n2. Positive: foreign investors may be attracted by higher returns, and import payments fall.\n3. Negative: exports such as base metals become relatively expensive and demand falls, hurting local firms and employment.\n4. Negative: inbound tourism falls and the balance of payments deficit may widen.\n5. Mere listing earns at most 2 marks."
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
