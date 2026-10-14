#!/usr/bin/env node
/**
 * DBE Economics P2 — November 2025 — Question 4.2.4–4.2.5: Externalities and redress (order 20)
 * Lesson 20 of 2025 Nov P2 (DESIGN-UNI-14: 3 practice questions). Question 4.2.4–4.2.5: Externalities and redress. Fresh practice questions (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2025-nov-p2-l20.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2025-nov-p2-l20.js --dry-run
 *   node scripts/add-economics-2025-nov-p2-l20.js
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
  "name": "Question 4.2.4–4.2.5: Externalities and redress",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2025,
  "paper": "nov_p2",
  "order": 20,
  "content_tier": "free",
  "has_video": false,
  "xp": 6,
  "tags": [
    "externalities",
    "redress",
    "income_inequality"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p2/q20/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p2/q20/memo_1.png"
  ],
  "exam_question_marks": 6,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Why do markets tend to undersupply goods such as education that generate positive externalities?",
    "metadata": [
      "Consumers value education too little to buy enough of it",
      "Government bans private firms from supplying education",
      "Firms cannot charge for the full benefit that society gets",
      "Education is a demerit good so firms avoid supplying it",
      ""
    ],
    "answer": [
      "Firms cannot charge for the full benefit that society gets",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "market_failures",
    "topic": "externalities_and_efficiency",
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
    "clues": "- The benefits fall on people other than the firm."
  },
  {
    "name": "Question 2",
    "question": "Select ALL the redress methods the government can use to redistribute wealth.",
    "metadata": [
      "Broad-Based Black Economic Empowerment",
      "Increasing import tariffs",
      "Land redistribution",
      "Land restitution",
      "The Employment Equity Act and affirmative action"
    ],
    "answer": [
      "The Employment Equity Act and affirmative action",
      "Broad-Based Black Economic Empowerment",
      "Land restitution",
      "Land redistribution",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "redress_and_inequality",
    "topic": "income_inequality_and_redress",
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
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- Redress methods help groups that were disadvantaged in the past.\n- One option is a trade policy."
  },
  {
    "name": "Question 3",
    "question": "Match each redress method to its aim.",
    "metadata": [
      "A - Employment Equity Act",
      "B - B-BBEE",
      "C - Land restitution",
      "D - Land redistribution",
      "1 - Gives preference to previously disadvantaged people in employment",
      "2 - Increases the number of black people who own, manage and control businesses",
      "3 - Returns land or pays compensation to people who lost it through discriminatory laws",
      "4 - Shifts agricultural land to previously disadvantaged people"
    ],
    "answer": [
      "A-1",
      "B-2",
      "C-3",
      "D-4"
    ],
    "presentation": "match",
    "type": "definition",
    "unit": "redress_and_inequality",
    "topic": "income_inequality_and_redress",
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
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- Two methods deal with land and two deal with jobs and ownership."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "4.2.4",
      "marks": 2,
      "clues": "- Think about who receives the benefits of these goods.",
      "approach": "- Give one reason.\n- Link it to profit.",
      "solution": "1. Goods with positive externalities, such as education, are not highly rated by the market.\n2. Businesses do not fully account for the benefits that accrue to society and are not rewarded for them, so they undersupply."
    },
    {
      "number": "4.2.5",
      "marks": 4,
      "clues": "- Choose two redress methods and explain how each shifts wealth.",
      "approach": "- Name two methods.\n- Explain each (2 x 2).",
      "solution": "1. The Employment Equity Act promotes affirmative action in employment.\n2. B-BBEE raises the number of black people who own, manage and control businesses.\n3. Property subsidies and free RDP housing help previously disadvantaged groups to own property.\n4. Land restitution and redistribution return or reallocate land to those who lost it or were excluded."
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
