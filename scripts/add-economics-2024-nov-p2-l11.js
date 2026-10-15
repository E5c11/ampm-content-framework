#!/usr/bin/env node
/**
 * DBE Economics P2 — November 2024 — Question 2.5: Lack of information and misallocation (order 11)
 * Lesson 11 of 2024 Nov P2 (DESIGN-UNI-14: 3 practice questions). Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2024-nov-p2-l11.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2024-nov-p2-l11.js --dry-run
 *   node scripts/add-economics-2024-nov-p2-l11.js
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
  "name": "Question 2.5: Lack of information and misallocation",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2024,
  "paper": "nov_p2",
  "order": 11,
  "content_tier": "free",
  "has_video": false,
  "xp": 8,
  "tags": [
    "information_failure",
    "market_failure"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p2/q11/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p2/q11/memo_1.png"
  ],
  "exam_question_marks": 8,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Shoppers cannot compare the prices charged by different shops and so pay more than necessary. Which market problem does this show?",
    "metadata": [
      "an external cost to others",
      "a lack of information",
      "a good that is non-rivalrous",
      "a single seller in the market",
      ""
    ],
    "answer": [
      "a lack of information",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "market_failures",
    "topic": "misallocation_of_resources",
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
    "clues": "- Think about what the buyers do not know."
  },
  {
    "name": "Question 2",
    "question": "Select ALL the ways in which a lack of information can lead to misallocation of resources.",
    "metadata": [
      "Consumers buy harmful products",
      "Every buyer finds the lowest price",
      "Workers stay unemployed unaware of vacancies",
      "Government policy always matches conditions",
      "Investors choose less profitable ventures"
    ],
    "answer": [
      "Consumers buy harmful products",
      "Workers stay unemployed unaware of vacancies",
      "Investors choose less profitable ventures",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "market_failures",
    "topic": "misallocation_of_resources",
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
    "clues": "- Poor information leads to decisions that put resources where they are not best used."
  },
  {
    "name": "Question 3",
    "question": "Match each market participant to the effect of missing information.",
    "metadata": [
      "A - Consumers",
      "B - Workers",
      "C - Producers",
      "1 - Earn less because they do not know about better jobs",
      "2 - Pay higher prices or buy harmful goods",
      "3 - Face higher costs because they do not know cheaper technology"
    ],
    "answer": [
      "A-2",
      "B-1",
      "C-3"
    ],
    "presentation": "match",
    "type": "application",
    "unit": "market_failures",
    "topic": "misallocation_of_resources",
    "subtopic": "econ_classification",
    "skills": [
      "classify_economic_concept"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Think about what each group needs to know to decide well."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "2.5",
      "marks": 8,
      "clues": "- Think about consumers, workers, businesses, investors and government.",
      "approach": "- Four developed points of 2 marks each; at most 2 marks for listing.",
      "solution": "1. Participants lack the information needed for rational decisions.\n2. Consumers pay higher prices or buy harmful products.\n3. Workers earn less or stay unemployed; businesses face higher costs from not knowing new technology.\n4. Investors choose less profitable ventures; policies fail without accurate information; better-informed producers can exploit buyers or block entry. Any other correct relevant response is accepted."
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
