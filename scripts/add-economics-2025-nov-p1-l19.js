#!/usr/bin/env node
/**
 * DBE Economics P1 — November 2025 — Question 4.2.4: VAT and privatisation (order 19)
 * Lesson 19 of the 2025 Nov P1 repair (DESIGN-UNI-14: 3 practice questions). Question 4.2.4: VAT and privatisation. Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2025-nov-p1-l19.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2025-nov-p1-l19.js --dry-run
 *   node scripts/add-economics-2025-nov-p1-l19.js
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
  "name": "Question 4.2.4: VAT and privatisation",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2025,
  "paper": "nov_p1",
  "order": 19,
  "content_tier": "free",
  "has_video": false,
  "xp": 6,
  "tags": [
    "vat",
    "public_sector_failure"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q19/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q19/memo_1.png"
  ],
  "exam_question_marks": 6,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Which of the following is a likely effect on businesses when the government increases value-added tax (VAT)?",
    "metadata": [
      "Demand for goods may fall, reducing sales revenue",
      "Sales revenue rises automatically because prices rise",
      "Businesses pay less tax in total",
      "Businesses no longer need to adjust their prices",
      ""
    ],
    "answer": [
      "Demand for goods may fall, reducing sales revenue",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "public_sector",
    "topic": "taxation_systems",
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
    "paper": "nov_p1",
    "clues": "- VAT is built into the prices consumers pay.\n- Think about how buyers respond when prices rise."
  },
  {
    "name": "Question 2",
    "question": "Select ALL the ways in which privatising a state-owned enterprise can benefit the government.",
    "metadata": [
      "The sale of public assets raises revenue",
      "It reduces the fiscal burden and state borrowing",
      "It can help to achieve empowerment goals through wider ownership of businesses",
      "The government keeps all future profits of the enterprise",
      "The government must increase its subsidies to the enterprise"
    ],
    "answer": [
      "The sale of public assets raises revenue",
      "It reduces the fiscal burden and state borrowing",
      "It can help to achieve empowerment goals through wider ownership of businesses",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "public_sector",
    "topic": "privatisation",
    "subtopic": "econ_policy_evaluation",
    "skills": [
      "evaluate_economic_policy"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Privatisation moves ownership from the state to private owners.\n- Two options describe what the government keeps or pays, which privatisation removes."
  },
  {
    "name": "Question 3",
    "question": "A product costs R400 before VAT. Calculate the price the consumer pays when VAT is charged at 15% (in rand): []",
    "metadata": [
      "Price including VAT (R): ",
      "[ ]"
    ],
    "answer": [
      "460",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "type": "calc",
    "unit": "public_sector",
    "topic": "taxation_systems",
    "subtopic": "econ_calculation",
    "skills": [
      "apply_economic_formula"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Find 15% of the price before VAT first.\n- Add that tax to the original price."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "4.2.4",
      "marks": 2,
      "clues": "- Think about prices and demand after a VAT increase.",
      "approach": "- State one effect on costs or sales.\n- Add its consequence.",
      "solution": "1. Businesses may incur extra costs adjusting the prices of VAT-linked goods and services.\n2. Higher prices may lower demand, which leads to a decline in sales revenue."
    },
    {
      "number": "4.2.5",
      "marks": 4,
      "clues": "- Think about what the government receives and saves when it sells assets.",
      "approach": "- Choose two benefits.\n- Develop each into a full sentence (2 x 2).",
      "solution": "1. Privatisation reduces the fiscal burden and state borrowing because selling public assets raises revenue.\n2. It may widen the tax base and increase tax revenue.\n3. It helps achieve developmental goals such as black economic empowerment through wider ownership.\n4. The immediate income can be used to reduce state debt."
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
