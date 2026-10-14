#!/usr/bin/env node
/**
 * DBE Economics P2 — November 2025 — Question 2.3: Taxes on production (order 8)
 * Lesson 8 of 2025 Nov P2 (DESIGN-UNI-14: 4 practice questions). Question 2.3: Taxes on production. Fresh practice questions (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2025-nov-p2-l08.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2025-nov-p2-l08.js --dry-run
 *   node scripts/add-economics-2025-nov-p2-l08.js
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
  "name": "Question 2.3: Taxes on production",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2025,
  "paper": "nov_p2",
  "order": 8,
  "content_tier": "free",
  "has_video": false,
  "xp": 6,
  "tags": [
    "pareto_efficiency",
    "excise_duties",
    "direct_taxes",
    "taxation"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p2/q8/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p2/q8/memo_1.png"
  ],
  "exam_question_marks": 6,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Study the graph of a tax on producers. What was the equilibrium price before the tax was imposed?",
    "metadata": [
      "P1 = R44",
      "Q = 100",
      "P = R40",
      "Q1 = 90",
      ""
    ],
    "answer": [
      "P = R40",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "interpretation",
    "unit": "market_failures",
    "topic": "taxes_and_subsidies_on_production",
    "subtopic": "econ_data_interpretation",
    "skills": [
      "interpret_economic_data"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- A price is read from the vertical axis, a quantity from the horizontal one.\n- The tax shifts the supply curve, so the original equilibrium is where the solid supply curve meets demand.",
    "supplementary_material": {
      "type": "graph",
      "label": "Graph",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/economics/2025/nov_p2/q8/graph_1.png"
      ]
    }
  },
  {
    "name": "Question 2",
    "question": "Select ALL the reasons why government imposes excise duties on demerit goods.",
    "metadata": [
      "To raise revenue from goods that harm users",
      "To recover the external costs of their consumption",
      "To lower the price of these goods",
      "To discourage consumption by making them more expensive",
      "To encourage people to consume more of them"
    ],
    "answer": [
      "To recover the external costs of their consumption",
      "To discourage consumption by making them more expensive",
      "To raise revenue from goods that harm users",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "market_failures",
    "topic": "taxes_and_subsidies_on_production",
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
    "paper": "nov_p2",
    "clues": "- A demerit good harms the consumer or society.\n- Two options would make the harm worse."
  },
  {
    "name": "Question 3",
    "question": "Which situation is Pareto efficient?",
    "metadata": [
      "Everyone receives exactly the same amount of income",
      "Output is at its highest possible level whatever the cost",
      "Government sets the prices of all goods and services",
      "No one can be made better off without harming someone else",
      ""
    ],
    "answer": [
      "No one can be made better off without harming someone else",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "market_failures",
    "topic": "externalities_and_efficiency",
    "subtopic": "econ_term_definition",
    "skills": [
      "define_economic_term"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- The test is about trade-offs between people when a change is made."
  },
  {
    "name": "Question 4",
    "question": "Match each tax to its type.",
    "metadata": [
      "A - Personal income tax",
      "B - Value-added tax (VAT)",
      "C - Company tax",
      "D - Excise duty",
      "1 - Direct tax",
      "2 - Indirect tax",
      "3 - Direct tax on firms",
      "4 - Indirect tax on specific goods"
    ],
    "answer": [
      "A-1",
      "B-2",
      "C-3",
      "D-4"
    ],
    "presentation": "match",
    "type": "definition",
    "unit": "public_sector",
    "topic": "taxation_systems",
    "subtopic": "econ_classification",
    "skills": [
      "classify_economic_concept"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- A direct tax is charged on income or profit, an indirect tax on spending."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "2.3.1",
      "marks": 1,
      "clues": "- Find the point where the original supply curve crosses demand.",
      "approach": "- Locate e, the original equilibrium.\n- Read its price from the vertical axis.",
      "solution": "1. The original equilibrium is at e, and the price is P."
    },
    {
      "number": "2.3.2",
      "marks": 1,
      "clues": "- A direct tax is charged on income or profit.",
      "approach": "- Think of taxes paid straight to SARS by the person or firm.\n- Name any one.",
      "solution": "1. Examples are PAYE or personal income tax, company tax and capital gains tax."
    },
    {
      "number": "2.3.3",
      "marks": 2,
      "clues": "- The test is about trade-offs when something changes.",
      "approach": "- Define the term.\n- Mention nobody being made worse off.",
      "solution": "1. Pareto efficiency is when resources are allocated so that no one can be made better off without making someone else worse off."
    },
    {
      "number": "2.3.4",
      "marks": 2,
      "clues": "- Demerit goods cause harm to others as well as the consumer.",
      "approach": "- Give a reason linked to external costs or discouraging use.",
      "solution": "1. Excise duties recover the external costs caused by consuming demerit goods.\n2. They also discourage consumption by making these goods more expensive."
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
