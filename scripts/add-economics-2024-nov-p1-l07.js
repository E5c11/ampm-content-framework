#!/usr/bin/env node
/**
 * DBE Economics P1 — November 2024 — Question 2.2.5: Taxes on demerit goods (order 7)
 * Lesson 7 of 2024 Nov P1 (DESIGN-UNI-14: 3 practice questions). Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2024-nov-p1-l07.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2024-nov-p1-l07.js --dry-run
 *   node scripts/add-economics-2024-nov-p1-l07.js
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
  "name": "Question 2.2.5: Taxes on demerit goods",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2024,
  "paper": "nov_p1",
  "order": 7,
  "content_tier": "free",
  "has_video": false,
  "xp": 8,
  "tags": [
    "demerit_goods",
    "taxes_on_demerit_goods",
    "taxation_systems"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p1/q7/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p1/q7/memo_1.png"
  ],
  "exam_question_marks": 4,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Why does a government place a high tax on cigarettes?",
    "metadata": [
      "To make them cheaper for all low-income smokers",
      "To make them dearer so fewer people buy them",
      "To increase the quantity that is produced",
      "To remove the need for health services",
      ""
    ],
    "answer": [
      "To make them dearer so fewer people buy them",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "public_sector",
    "topic": "taxation_systems",
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
    "paper": "nov_p1",
    "clues": "- Demerit goods are harmful to the people who use them and often to others.\n- Think about what a higher price does to the quantity bought."
  },
  {
    "name": "Question 2",
    "question": "Select ALL the reasons why governments tax demerit goods.",
    "metadata": [
      "To increase consumption of the goods",
      "To make the goods dearer for consumers",
      "To recover the costs they impose on others",
      "To raise revenue for public goods",
      "To lower the cost of production"
    ],
    "answer": [
      "To make the goods dearer for consumers",
      "To recover the costs they impose on others",
      "To raise revenue for public goods",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "public_sector",
    "topic": "taxation_systems",
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
    "paper": "nov_p1",
    "clues": "- A tax on a harmful good has three effects: it raises the price, it can pay for the harm done, and it brings in money."
  },
  {
    "name": "Question 3",
    "question": "Arrange the effects of a tax on alcohol in the order in which they occur.",
    "metadata": [
      "Consumers buy a smaller quantity",
      "A tax is placed on alcohol",
      "Harm to health and the environment decreases",
      "The price paid by consumers rises"
    ],
    "answer": [
      "A tax is placed on alcohol",
      "The price paid by consumers rises",
      "Consumers buy a smaller quantity",
      "Harm to health and the environment decreases"
    ],
    "presentation": "ordering",
    "type": "ordering",
    "unit": "public_sector",
    "topic": "taxation_systems",
    "subtopic": "econ_policy_evaluation",
    "skills": [
      "evaluate_economic_policy"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Start with the policy, then follow the price, then the quantity, then the consequence."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "2.2.5",
      "marks": 4,
      "clues": "- Think about price, external costs and revenue.",
      "approach": "- Give two developed reasons.",
      "solution": "1. The tax makes demerit goods more expensive, which discourages consumers from buying them.\n2. It recovers the external costs the goods impose on people and the environment.\n3. It raises revenue that can finance public goods. Any two developed points earn the 4 marks."
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
