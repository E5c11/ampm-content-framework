#!/usr/bin/env node
/**
 * DBE Accounting — November 2025 — Question 3.2.1–3.2.2: Break-even point (order 11)
 * Questions 3.2.1 and 3.2.2 — the break-even point and whether the units produced and sold are satisfactory.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-accounting-2025-nov-p2-l11.js --curriculum temp/curriculum-vocab-accounting.json
 *   node scripts/add-accounting-2025-nov-p2-l11.js --dry-run
 *   node scripts/add-accounting-2025-nov-p2-l11.js
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
  "name": "Question 3.2.1–3.2.2: Break-even point",
  "syllabus": "dbe",
  "subject": "accounting",
  "year": 2025,
  "paper": "nov_p2",
  "order": 11,
  "content_tier": "free",
  "has_video": false,
  "xp": 6,
  "tags": [
    "break_even_point",
    "units_above_break_even"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p2/q11/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p2/q11/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p2/q11/memo_1.png"
  ],
  "exam_question_marks": 6,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Use the information in the figure to calculate A, the break-even point for 2026.",
    "metadata": [
      "A = ",
      "[ ]",
      " units"
    ],
    "answer": [
      "17360",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "unit": "cost_accounting",
    "topic": "break_even_analysis",
    "subtopic": "acc_statement_completion",
    "skills": [
      "complete_financial_statement"
    ],
    "difficulty": 4,
    "exam_weight": 3,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "accounting",
    "year": 2025,
    "paper": "nov_p2",
    "type": "calc",
    "clues": "- Total fixed cost = units × fixed cost per unit.\n- Divide by the contribution per unit.",
    "supplementary_material": {
      "type": "statement",
      "label": "Phone cases: Zenith Manufacturers",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/accounting/2025/nov_p2/q11/statement_1.png"
      ]
    }
  },
  {
    "name": "Question 2",
    "question": "A business produces and sells 28 000 units. Its break-even point is 21 500 units. How many units earn a profit?",
    "metadata": [
      "Units earning a profit = ",
      "[ ]"
    ],
    "answer": [
      "6500",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "unit": "cost_accounting",
    "topic": "break_even_analysis",
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
    "year": 2025,
    "paper": "nov_p2",
    "type": "calc"
  },
  {
    "name": "Question 3",
    "question": "Which statement shows the owner should be satisfied with the units produced and sold in 2026?",
    "metadata": [
      "Units produced of 31 000 are below the break-even point of 17 360",
      "The selling price rose from R260 to R280 so profit is certain",
      "Units produced of 31 000 are above the break-even point of 17 360",
      "The fixed cost per unit rose from R70 to R85",
      ""
    ],
    "answer": [
      "Units produced of 31 000 are above the break-even point of 17 360",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "cost_accounting",
    "topic": "break_even_analysis",
    "subtopic": "acc_interpretation",
    "skills": [
      "interpret_financial_indicators"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "accounting",
    "year": 2025,
    "paper": "nov_p2",
    "type": "interpretation",
    "supplementary_material": {
      "type": "statement",
      "label": "Phone cases: Zenith Manufacturers",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/accounting/2025/nov_p2/q11/statement_1.png"
      ]
    }
  },
  {
    "name": "Question 4",
    "question": "Select the TWO correct statements about the break-even point.",
    "metadata": [
      "Units below the break-even point earn a profit",
      "At the break-even point there is no profit and no loss",
      "Units above the break-even point earn a profit",
      "The break-even point is the number of units sold at cost price",
      "It equals the total fixed cost in rand"
    ],
    "answer": [
      "At the break-even point there is no profit and no loss",
      "Units above the break-even point earn a profit",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "cost_accounting",
    "topic": "break_even_analysis",
    "subtopic": "acc_classification",
    "skills": [
      "classify_accounting_concept"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "accounting",
    "year": 2025,
    "paper": "nov_p2",
    "type": "application"
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "3.2.1",
      "marks": 4,
      "clues": "- Break-even point = total fixed cost ÷ (selling price − variable cost) per unit.\n- The formula sheet gives it.",
      "approach": "- Work out the total fixed cost, then divide by the contribution per unit.",
      "solution": "1. Total fixed cost = 28 750 × R80 = R2 300 000; contribution = R265 − R146 = R119.\n2. Break-even point = R2 300 000 ÷ R119 = 19 328 units."
    },
    {
      "number": "3.2.2",
      "marks": 2,
      "clues": "- Compare units produced and sold with the break-even point.\n- Quote figures.",
      "approach": "- Say how far above break-even the business is.",
      "solution": "1. Units produced of 28 750 are above the break-even point of 19 328, so a profit is made on 9 422 units."
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
