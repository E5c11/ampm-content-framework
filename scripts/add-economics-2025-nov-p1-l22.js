#!/usr/bin/env node
/**
 * DBE Economics P1 — November 2025 — Question 4.4: Free trade and fiscal policy (order 22)
 * Lesson 22 of the 2025 Nov P1 repair (DESIGN-UNI-14: 3 practice questions). Question 4.4: Free trade and fiscal policy. Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2025-nov-p1-l22.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2025-nov-p1-l22.js --dry-run
 *   node scripts/add-economics-2025-nov-p1-l22.js
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
  "name": "Question 4.4: Free trade and fiscal policy",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2025,
  "paper": "nov_p1",
  "order": 22,
  "content_tier": "free",
  "has_video": false,
  "xp": 16,
  "tags": [
    "international_trade",
    "fiscal_policy"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q22/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q22/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q22/memo_2.png"
  ],
  "exam_question_marks": 16,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Select ALL the arguments that support free trade.",
    "metadata": [
      "It reduces imports in order to save local jobs and industries",
      "Competition pushes firms to adopt new technology and cut costs",
      "It protects young industries from foreign competition for years",
      "Specialising where opportunity cost is lower raises world output",
      "Resources are not wasted on goods others make more efficiently"
    ],
    "answer": [
      "Specialising where opportunity cost is lower raises world output",
      "Competition pushes firms to adopt new technology and cut costs",
      "Resources are not wasted on goods others make more efficiently",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "protection_and_free_trade",
    "topic": "free_trade_arguments",
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
    "clues": "- Free trade arguments are about efficiency and competition.\n- Two options are arguments for protectionism."
  },
  {
    "name": "Question 2",
    "question": "Select ALL the fiscal policy measures that would help to dampen an overheating economy.",
    "metadata": [
      "Cutting government spending on infrastructure projects",
      "Cutting the rate of company tax paid by businesses",
      "Raising subsidies paid to businesses in key industries",
      "Raising indirect taxes such as VAT and excise duties",
      "Raising personal income tax rates for most households"
    ],
    "answer": [
      "Cutting government spending on infrastructure projects",
      "Raising personal income tax rates for most households",
      "Raising indirect taxes such as VAT and excise duties",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "public_sector",
    "topic": "fiscal_and_monetary_policy",
    "subtopic": "econ_policy_evaluation",
    "skills": [
      "evaluate_economic_policy"
    ],
    "difficulty": 4,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Dampening means lowering total spending in the economy.\n- Two options would put more money in the hands of firms."
  },
  {
    "name": "Question 3",
    "question": "In which phase of the business cycle would government normally use restrictive fiscal policy?",
    "metadata": [
      "Depression (the trough of the downswing)",
      "Prosperity (the peak of the upswing)",
      "Recovery (the early part of the upswing)",
      "Recession (the start of the downswing)",
      ""
    ],
    "answer": [
      "Prosperity (the peak of the upswing)",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "business_cycles",
    "topic": "business_cycle_policy",
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
    "paper": "nov_p1",
    "clues": "- Restrictive policy cools spending, so the economy must be running hot."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "4.4",
      "marks": 8,
      "clues": "- Give two developed points on each argument.\n- A bare list of facts is capped at 4 marks.",
      "approach": "- Explain specialisation through comparative advantage and opportunity cost.\n- Explain innovation through competition and technology.\n- Develop each with an effect on output, costs or living standards.",
      "solution": "1. Specialisation: countries that specialise in goods with a comparative advantage raise world output and consumption.\n2. It lowers opportunity cost, raises efficiency and prevents wasted resources.\n3. Innovation: free trade increases competition, which gives firms an incentive to innovate and introduce new products for export.\n4. Competition on international markets forces businesses to adopt the latest technology and improve quality and reliability."
    },
    {
      "number": "4.5",
      "marks": 8,
      "clues": "- Restrictive fiscal policy is used in the prosperity phase.\n- Give four developed measures, each with its effect on spending.",
      "approach": "- Name the type of policy and when it is used.\n- List measures on government spending, taxes, grants and subsidies.\n- Explain how each lowers aggregate demand.",
      "solution": "1. Restrictive (contractionary) fiscal policy is used during the prosperity phase to dampen the economy.\n2. Cutting government spending on infrastructure, or public sector wages, lowers demand for goods and services.\n3. Raising business tax, personal income tax and indirect taxes such as VAT and excise duties reduces profit prospects, disposable income and spending.\n4. Cutting social grants and subsidies lowers household income and raises production costs; incentives for saving encourage people to spend less.\n5. Mere listing earns at most 2 marks."
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
