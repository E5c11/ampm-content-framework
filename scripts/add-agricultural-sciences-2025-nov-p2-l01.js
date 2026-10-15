#!/usr/bin/env node
/**
 * DBE Agricultural Sciences P2 — November 2025 — Question 1: Marketing and market types (Section A) (order 1)
 * Section A items 1.1.1, 1.1.2, 1.3.1 and 1.4.1 — marketing management, buyers and agents, price fluctuation and niche marketing. Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-agricultural-sciences-2025-nov-p2-l01.js --curriculum temp/curriculum-vocab-agricultural-sciences.json
 *   node scripts/add-agricultural-sciences-2025-nov-p2-l01.js --dry-run
 *   node scripts/add-agricultural-sciences-2025-nov-p2-l01.js
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
  "name": "Question 1: Marketing and market types (Section A)",
  "syllabus": "dbe",
  "subject": "agricultural_sciences",
  "year": 2025,
  "paper": "nov_p2",
  "order": 1,
  "content_tier": "free",
  "has_video": false,
  "xp": 7,
  "tags": [
    "marketing_management",
    "market_agents",
    "price_fluctuation"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p2/q1/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p2/q1/question_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p2/q1/question_3.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p2/q1/question_4.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p2/q1/memo_1.png"
  ],
  "exam_question_marks": 7,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Which statement describes a farmer who uses a market-oriented approach?",
    "metadata": [
      "Concentrates on the needs of the seller only",
      "Produces what the farmer likes and then looks for buyers",
      "Finds out what consumers want and then plans production",
      "Plans only for the next harvest and ignores new products",
      ""
    ],
    "answer": [
      "Finds out what consumers want and then plans production",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "agricultural_management_and_marketing",
    "topic": "marketing_principles",
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
    "clues": "- Marketing management starts with the consumer, not with the farm."
  },
  {
    "name": "Question 2",
    "question": "Match each type of buyer or agent to the description.",
    "metadata": [
      "A - Broker",
      "B - Wholesaler",
      "C - Retailer",
      "D - Processing company",
      "1 - Arranges sales for a commission without owning the stock",
      "2 - Buys in bulk and sells to retailers",
      "3 - Sells small quantities directly to consumers",
      "4 - Buys raw products and turns them into other products"
    ],
    "answer": [
      "A-1",
      "B-2",
      "C-3",
      "D-4"
    ],
    "presentation": "match",
    "type": "application",
    "unit": "agricultural_management_and_marketing",
    "topic": "buyers_and_market_agents",
    "subtopic": "agri_classification",
    "skills": [
      "classify_farm_concept"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p2"
  },
  {
    "name": "Question 3",
    "question": "A farmer produces only organic, free-range eggs for health-conscious customers in one city. Which type of marketing does this farmer practise?",
    "metadata": [
      "Mass marketing",
      "Bulk marketing",
      "Niche marketing",
      "Contract marketing",
      ""
    ],
    "answer": [
      "Niche marketing",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "agricultural_management_and_marketing",
    "topic": "marketing_principles",
    "subtopic": "agri_scenario_application",
    "skills": [
      "apply_practice_to_scenario"
    ],
    "difficulty": 3,
    "exam_weight": 1,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- The product targets one specific group of buyers with specific needs."
  },
  {
    "name": "Question 4",
    "question": "Tomato prices rise and fall during the year because of the seasons. What is the term for these changes in the price of agricultural products? (two words) []",
    "metadata": [
      "Term: ",
      "[ ]"
    ],
    "answer": [
      "price fluctuation|price fluctuations",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "text",
    "type": "definition",
    "unit": "agricultural_management_and_marketing",
    "topic": "price_determination",
    "subtopic": "agri_term_recall",
    "skills": [
      "recall_agricultural_term"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- The first word names what changes; the second names how it moves up and down."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "1.1.1",
      "marks": 2,
      "clues": "- Marketing management is driven by consumers.\n- Which statement puts the seller first instead?",
      "approach": "- Recall what marketing management involves.\n- Find the statement that does NOT apply to it.",
      "solution": "1. Marketing management is profit-oriented, finds out what consumers need and plans for the long term.\n2. Focusing on the needs of the seller does not apply, so the answer is C."
    },
    {
      "number": "1.1.2",
      "marks": 2,
      "clues": "- The buyer works for commission.\n- Compare retailer, broker, wholesaler and processor.",
      "approach": "- Recall the types of buyers in the agricultural market.\n- Match the one who works for commission.",
      "solution": "1. A broker works for commission and buys and sells cattle at different prices.\n2. The answer is B."
    },
    {
      "number": "1.3.1",
      "marks": 2,
      "clues": "- The change is caused by the seasons.\n- Give the two-word term.",
      "approach": "- Recall the terms linked to price determination.\n- Match the description of seasonal changes in price.",
      "solution": "1. Changes in price due to the seasonality of agricultural products are price fluctuation."
    },
    {
      "number": "1.4.1",
      "marks": 1,
      "clues": "- The statement is about focusing on a specific product for specific needs.\n- The underlined word names the wrong market type.",
      "approach": "- Read the definition.\n- Replace the underlined word with the correct type of marketing.",
      "solution": "1. Niche marketing focuses on a specific product to satisfy the specific needs of a market, not mass market."
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
