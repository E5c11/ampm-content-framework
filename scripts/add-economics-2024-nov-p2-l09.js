#!/usr/bin/env node
/**
 * DBE Economics P2 — November 2024 — Question 2.3.4–2.3.5: Social efficiency and merit goods (order 9)
 * Lesson 9 of 2024 Nov P2 (DESIGN-UNI-14: 3 practice questions). Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2024-nov-p2-l09.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2024-nov-p2-l09.js --dry-run
 *   node scripts/add-economics-2024-nov-p2-l09.js
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
  "name": "Question 2.3.4–2.3.5: Social efficiency and merit goods",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2024,
  "paper": "nov_p2",
  "order": 9,
  "content_tier": "free",
  "has_video": false,
  "xp": 8,
  "tags": [
    "externalities",
    "merit_goods"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p2/q9/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p2/q9/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p2/q9/memo_2.png"
  ],
  "exam_question_marks": 6,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Study the graph (illustrative). Why is a quantity of 80 vaccinations regarded as socially efficient?",
    "metadata": [
      "the government sets the quantity at 80",
      "the price at 80 is the lowest possible",
      "the producer earns maximum profit at 80",
      "the price at 80 includes the external benefit",
      ""
    ],
    "answer": [
      "the price at 80 includes the external benefit",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "interpretation",
    "unit": "market_failures",
    "topic": "externalities_and_efficiency",
    "subtopic": "econ_data_interpretation",
    "skills": [
      "interpret_economic_data"
    ],
    "difficulty": 4,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- At the socially efficient quantity the marginal social benefit equals the marginal cost.",
    "supplementary_material": {
      "type": "diagram",
      "label": "Graph",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/economics/2024/nov_p2/q9/diagram_1.png"
      ]
    }
  },
  {
    "name": "Question 2",
    "question": "Select ALL the ways in which the government can encourage the consumption of merit goods.",
    "metadata": [
      "Tax the goods more heavily",
      "Subsidise consumers",
      "Provide the goods free or at a lower cost",
      "Run public campaigns about their benefits",
      "Ban the goods from the market"
    ],
    "answer": [
      "Subsidise consumers",
      "Provide the goods free or at a lower cost",
      "Run public campaigns about their benefits",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "market_failures",
    "topic": "externalities_and_efficiency",
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
    "clues": "- Merit goods are under-consumed, so government wants buyers to want and afford more of them."
  },
  {
    "name": "Question 3",
    "question": "Match each measure to how it raises the consumption of merit goods.",
    "metadata": [
      "A - Consumer subsidy",
      "B - Tax exemption",
      "C - Public campaign",
      "1 - Buyers learn about the benefits, so demand rises",
      "2 - The price paid by consumers falls",
      "3 - The goods become more affordable because the tax is removed"
    ],
    "answer": [
      "A-2",
      "B-3",
      "C-1"
    ],
    "presentation": "match",
    "type": "application",
    "unit": "market_failures",
    "topic": "externalities_and_efficiency",
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
    "clues": "- One measure changes information, one gives money towards the price and one removes a tax."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "2.3.4",
      "marks": 2,
      "clues": "- Compare the price at Q1 with the external benefit.",
      "approach": "- Explain in one sentence.",
      "solution": "The price at Q1 takes into consideration the external benefits of education / the marginal private cost equals the marginal social benefit at Q1."
    },
    {
      "number": "2.3.5",
      "marks": 4,
      "clues": "- Think of subsidies, tax exemptions, free provision and campaigns.",
      "approach": "- Give two developed points of 2 marks each.",
      "solution": "1. Consumer subsidies lower the price of merit goods and raise demand.\n2. Tax exemptions make them more affordable.\n3. Free or cheaper provision, for example education and health care, encourages more consumption.\n4. Public campaigns inform people of the benefits. Any other correct relevant response is accepted."
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
