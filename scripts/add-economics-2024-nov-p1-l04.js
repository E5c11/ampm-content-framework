#!/usr/bin/env node
/**
 * DBE Economics P1 — November 2024 — Question 1.3: Giving the term (order 4)
 * Lesson 4 of 2024 Nov P1 (DESIGN-UNI-14: 4 practice questions). Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2024-nov-p1-l04.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2024-nov-p1-l04.js --dry-run
 *   node scripts/add-economics-2024-nov-p1-l04.js
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
  "name": "Question 1.3: Giving the term",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2024,
  "paper": "nov_p1",
  "order": 4,
  "content_tier": "free",
  "has_video": false,
  "xp": 10,
  "tags": [
    "circular_flow_markets",
    "phillips_curve",
    "economic_indicators",
    "privatisation"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p1/q4/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p1/q4/memo_1.png"
  ],
  "exam_question_marks": 6,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Give the term for the transfer of ownership of state-owned entities to private owners: []",
    "metadata": [
      "Term: ",
      "[ ]"
    ],
    "answer": [
      "privatisation|privatization",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "text",
    "type": "definition",
    "unit": "public_sector",
    "topic": "privatisation",
    "subtopic": "econ_term_definition",
    "skills": [
      "define_economic_term"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Think about who owns the entity before the transfer and who owns it afterwards."
  },
  {
    "name": "Question 2",
    "question": "Which statement describes the relationship shown by the Phillips curve?",
    "metadata": [
      "Higher inflation goes with higher economic growth",
      "A rise in interest rates always lowers prices",
      "Lower unemployment goes with higher inflation",
      "Exports and imports always move together",
      ""
    ],
    "answer": [
      "Lower unemployment goes with higher inflation",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "interpretation",
    "unit": "business_cycles",
    "topic": "phillips_curve",
    "subtopic": "econ_data_interpretation",
    "skills": [
      "interpret_economic_data"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- The Phillips curve links two variables: inflation and unemployment.\n- Decide whether it slopes downwards or upwards."
  },
  {
    "name": "Question 3",
    "question": "The consumer price index (CPI) rises from 110 in one year to 121 in the next. Calculate the inflation rate: []",
    "metadata": [
      "Inflation rate (%) = ",
      "[ ]"
    ],
    "answer": [
      "10",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "type": "calc",
    "unit": "business_cycles",
    "topic": "cycle_indicators",
    "subtopic": "econ_calculation",
    "skills": [
      "apply_economic_formula"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Find the change in the index first.\n- Express that change as a percentage of the earlier index."
  },
  {
    "name": "Question 4",
    "question": "Select ALL the real flows in the circular flow of income.",
    "metadata": [
      "Wages paid to households",
      "Labour supplied by households",
      "Goods sold to households",
      "Consumption expenditure",
      "Land made available to firms"
    ],
    "answer": [
      "Labour supplied by households",
      "Goods sold to households",
      "Land made available to firms",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "definition",
    "unit": "circular_flow",
    "topic": "circular_flow_markets",
    "subtopic": "econ_term_definition",
    "skills": [
      "define_economic_term"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Real flows are physical goods, services and factors of production.\n- Payments of money move the other way, as money flows."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "1.3.1",
      "marks": 1,
      "clues": "- Think about the flow of goods, services and factors among participants.",
      "approach": "- Give one canonical term.",
      "solution": "The term is real flow."
    },
    {
      "number": "1.3.2",
      "marks": 1,
      "clues": "- Think of a curve showing an inverse relationship between two variables.",
      "approach": "- Name the curve.",
      "solution": "The term is the Phillips curve."
    },
    {
      "number": "1.3.3",
      "marks": 1,
      "clues": "- Think of ownership moving from private to public hands.",
      "approach": "- Give the term.",
      "solution": "The term is nationalisation."
    },
    {
      "number": "1.3.4",
      "marks": 1,
      "clues": "- Think of cash payments to domestic producers.",
      "approach": "- Give the term.",
      "solution": "The term is direct subsidies."
    },
    {
      "number": "1.3.5",
      "marks": 1,
      "clues": "- Compare the labour used with the capital used.",
      "approach": "- Give the term.",
      "solution": "The term is labour-intensive."
    },
    {
      "number": "1.3.6",
      "marks": 1,
      "clues": "- Think of the index used to measure the cost of living.",
      "approach": "- Give the term.",
      "solution": "The term is the consumer price index (CPI)."
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
