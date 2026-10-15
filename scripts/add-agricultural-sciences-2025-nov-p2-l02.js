#!/usr/bin/env node
/**
 * DBE Agricultural Sciences P2 — November 2025 — Question 1: Price fixing, eco-labelling and the supply chain (Section A) (order 2)
 * Section A items 1.1.3, 1.2.1 and 1.2.2 — reasons for price fixing, eco-labelling and the supply chain. Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-agricultural-sciences-2025-nov-p2-l02.js --curriculum temp/curriculum-vocab-agricultural-sciences.json
 *   node scripts/add-agricultural-sciences-2025-nov-p2-l02.js --dry-run
 *   node scripts/add-agricultural-sciences-2025-nov-p2-l02.js
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
  "name": "Question 1: Price fixing, eco-labelling and the supply chain (Section A)",
  "syllabus": "dbe",
  "subject": "agricultural_sciences",
  "year": 2025,
  "paper": "nov_p2",
  "order": 2,
  "content_tier": "free",
  "has_video": false,
  "xp": 6,
  "tags": [
    "price_fixing",
    "eco_labelling",
    "supply_chain"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p2/q2/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p2/q2/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p2/q2/memo_1.png"
  ],
  "exam_question_marks": 6,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Select ALL the reasons why producers might agree to fix the price of a product.",
    "metadata": [
      "To allow every consumer to buy more cheaply",
      "To sell the same product at the same price",
      "To lower the production costs of the farm",
      "To remove competition between the producers",
      "To protect the profit margin of the producers"
    ],
    "answer": [
      "To remove competition between the producers",
      "To protect the profit margin of the producers",
      "To sell the same product at the same price",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "agricultural_management_and_marketing",
    "topic": "price_determination",
    "subtopic": "agri_classification",
    "skills": [
      "classify_farm_concept"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- Price fixing helps the producers, not the consumers."
  },
  {
    "name": "Question 2",
    "question": "A farmer puts a label on tins of peaches to show that they were grown without harming the environment. What is this practice called?",
    "metadata": [
      "Product diversification",
      "Contract farming",
      "Price fixing",
      "Eco-labelling",
      ""
    ],
    "answer": [
      "Eco-labelling",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "agricultural_management_and_marketing",
    "topic": "eco_labelling",
    "subtopic": "agri_scenario_application",
    "skills": [
      "apply_practice_to_scenario"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- The label promotes the product as environmentally friendly."
  },
  {
    "name": "Question 3",
    "question": "Which term describes the chain of steps from manufacturing a product to getting it to the market?",
    "metadata": [
      "Economic characteristic",
      "Supply chain",
      "Qualitative trait",
      "Overhead cost",
      ""
    ],
    "answer": [
      "Supply chain",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "agricultural_management_and_marketing",
    "topic": "marketing_principles",
    "subtopic": "agri_term_recall",
    "skills": [
      "recall_agricultural_term"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- The chain includes both making and distributing the product."
  },
  {
    "name": "Question 4",
    "question": "Match each marketing term to its description.",
    "metadata": [
      "A - Supply",
      "B - Demand",
      "C - Eco-labelling",
      "D - Supply chain",
      "1 - Quantity of a product that producers offer",
      "2 - Quantity of a product that consumers want to buy",
      "3 - Stickers that promote a product as environmentally friendly",
      "4 - Manufacturing and distribution of a product for the market"
    ],
    "answer": [
      "A-1",
      "B-2",
      "C-3",
      "D-4"
    ],
    "presentation": "match",
    "type": "definition",
    "unit": "agricultural_management_and_marketing",
    "topic": "eco_labelling",
    "subtopic": "agri_classification",
    "skills": [
      "classify_farm_concept"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p2"
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "1.1.3",
      "marks": 2,
      "clues": "- Price fixing helps producers keep prices stable.\n- Which option is NOT a reason for it?",
      "approach": "- Recall the reasons for price fixing.\n- Find the statement that is not one of them.",
      "solution": "1. Price fixing eliminates competition, increases profit margins and means the same product is sold at the same price by different producers.\n2. Improving accessibility of the product for consumers is not a reason: D."
    },
    {
      "number": "1.2.1",
      "marks": 2,
      "clues": "- Think about stickers on products.\n- Look for the term in Column B that names them.",
      "approach": "- Read the description in Column A.\n- Match it to the term in Column B.",
      "solution": "1. Placing stickers on products to promote them as environmentally friendly is eco-labelling: D."
    },
    {
      "number": "1.2.2",
      "marks": 2,
      "clues": "- The chain covers making and distributing.\n- It ends at the market.",
      "approach": "- Read the description.\n- Match it to the correct term.",
      "solution": "1. The chain that includes manufacturing and distribution of the product for the market is supply: A."
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
