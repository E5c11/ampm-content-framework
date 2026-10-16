#!/usr/bin/env node
/**
 * DBE Accounting — November 2024 — Question 4.1.3: Correcting the factory overhead cost (order 17)
 * Question 4.1.3 — correcting the factory overhead cost for a factory salary recorded as administration, and for rent re-allocated on a new floor area.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-accounting-2024-nov-p2-l17.js --curriculum temp/curriculum-vocab-accounting-2024-p2.json
 *   node scripts/add-accounting-2024-nov-p2-l17.js --dry-run
 *   node scripts/add-accounting-2024-nov-p2-l17.js
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
  "name": "Question 4.1.3: Correcting the factory overhead cost",
  "syllabus": "dbe",
  "subject": "accounting",
  "year": 2024,
  "paper": "nov_p2",
  "order": 17,
  "content_tier": "free",
  "has_video": false,
  "xp": 8,
  "tags": [
    "factory_overhead_cost_note",
    "cost_allocation"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2024/nov_p2/q17/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2024/nov_p2/q17/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2024/nov_p2/q17/memo_1.png"
  ],
  "exam_question_marks": 8,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Use the information in the figure to calculate the missing amounts A, B and C.",
    "metadata": [
      "A = ",
      "[ ]",
      "   B = ",
      "[ ]",
      "   C = ",
      "[ ]"
    ],
    "answer": [
      "76500",
      "32400",
      "1089400",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "unit": "cost_accounting",
    "topic": "factory_overhead_cost_note",
    "subtopic": "acc_statement_completion",
    "skills": [
      "complete_financial_statement"
    ],
    "difficulty": 5,
    "exam_weight": 3,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "accounting",
    "year": 2024,
    "paper": "nov_p2",
    "type": "calc",
    "clues": "- Use the factory share of a full year's salary.\n- The rent adjustment is the correct factory rent less the amount already recorded.",
    "supplementary_material": {
      "type": "statement",
      "label": "Factory Overhead Cost Note: Clayworks",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/accounting/2024/nov_p2/q17/statement-v2_1.png"
      ]
    }
  },
  {
    "name": "Question 2",
    "question": "Rent of R84 000 is shared by floor area. The factory uses 350 m² of the 600 m² building. Calculate the factory rent.",
    "metadata": [
      "Factory rent = R ",
      "[ ]"
    ],
    "answer": [
      "49000",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "unit": "cost_accounting",
    "topic": "factory_overhead_cost_note",
    "subtopic": "acc_calculation",
    "skills": [
      "calculate_accounting_amount"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "accounting",
    "year": 2024,
    "paper": "nov_p2",
    "type": "calc"
  },
  {
    "name": "Question 3",
    "question": "Select ALL the items that must NOT be included in the Factory Overhead Cost Note.",
    "metadata": [
      "Factory rent",
      "Advertising",
      "Bad debts",
      "Office salaries",
      "Indirect factory labour"
    ],
    "answer": [
      "Advertising",
      "Office salaries",
      "Bad debts",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "cost_accounting",
    "topic": "factory_overhead_cost_note",
    "subtopic": "acc_classification",
    "skills": [
      "classify_accounting_concept"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "accounting",
    "year": 2024,
    "paper": "nov_p2",
    "type": "application"
  },
  {
    "name": "Question 4",
    "question": "A factory supervisor's salary was recorded as an administration cost. What is the effect of correcting it?",
    "metadata": [
      "Factory overheads and the cost of production both rise",
      "Factory overheads rise and the net profit rises as well",
      "Administration costs rise and factory overheads fall",
      "Only the direct labour part of production cost rises",
      ""
    ],
    "answer": [
      "Factory overheads and the cost of production both rise",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "cost_accounting",
    "topic": "factory_overhead_cost_note",
    "subtopic": "acc_scenario_application",
    "skills": [
      "apply_accounting_concept_to_scenario"
    ],
    "difficulty": 4,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "accounting",
    "year": 2024,
    "paper": "nov_p2",
    "type": "application"
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "4.1.3",
      "marks": 8,
      "clues": "- 80% of the clerk's salary belongs to production (indirect labour).\n- The rent increased and the factory floor area changed, so the factory's share must be recalculated.",
      "approach": "- Add the factory share of a full year's salary.\n- Add the difference between the correct factory rent and the amount recorded.",
      "solution": "1. Indirect labour: R9 200 × 12 = R110 400 × 80/100 = R88 320.\n2. Rent: R157 500 × 600/800 = R118 125 − R126 000 × 400/600 = R84 000 → R34 125.\n3. Correct factory overhead cost = R1 132 700 + R88 320 + R34 125 = R1 255 145."
    }
  ],
  "model": "claude-opus-5-5",
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
