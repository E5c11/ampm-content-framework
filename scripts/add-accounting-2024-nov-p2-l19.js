#!/usr/bin/env node
/**
 * DBE Accounting — November 2024 — Question 4.2.3–4.2.4: Cost strategies and the price for a target profit (order 19)
 * Questions 4.2.3 and 4.2.4 — the costs that helped keep the selling price down with a strategy for each, and the price needed on extra units to reach a profit target.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-accounting-2024-nov-p2-l19.js --curriculum temp/curriculum-vocab-accounting-2024-p2.json
 *   node scripts/add-accounting-2024-nov-p2-l19.js --dry-run
 *   node scripts/add-accounting-2024-nov-p2-l19.js
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
  "name": "Question 4.2.3–4.2.4: Cost strategies and the price for a target profit",
  "syllabus": "dbe",
  "subject": "accounting",
  "year": 2024,
  "paper": "nov_p2",
  "order": 19,
  "content_tier": "free",
  "has_video": false,
  "xp": 8,
  "tags": [
    "variable_and_fixed_costs",
    "target_profit_pricing"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2024/nov_p2/q19/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2024/nov_p2/q19/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2024/nov_p2/q19/memo_2.png"
  ],
  "exam_question_marks": 8,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Use the figure. The owner wants to increase profit by R240 000 by making 600 extra units, with costs per unit unchanged. Calculate the selling price per extra unit.",
    "metadata": [
      "Selling price = R ",
      "[ ]"
    ],
    "answer": [
      "790",
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
    "difficulty": 4,
    "exam_weight": 3,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "accounting",
    "year": 2024,
    "paper": "nov_p2",
    "type": "calc",
    "clues": "- Each extra unit must cover its variable cost and its share of the extra profit.",
    "supplementary_material": {
      "type": "statement",
      "label": "Production information: Glow Lamps",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/accounting/2024/nov_p2/q19/statement_1.png"
      ]
    }
  },
  {
    "name": "Question 2",
    "question": "A business wants an extra profit of R150 000 from 500 extra units. Variable cost per unit is R420 and fixed costs do not change. Calculate the price per extra unit.",
    "metadata": [
      "Price = R ",
      "[ ]"
    ],
    "answer": [
      "720",
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
    "difficulty": 3,
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
    "question": "Use the figure. Select the TWO costs that had a positive effect on the selling price in 2026.",
    "metadata": [
      "Direct labour cost per unit",
      "Direct material cost per unit",
      "Selling and distribution per unit",
      "Fixed cost spread over more units",
      "Variable cost of lamp packaging"
    ],
    "answer": [
      "Direct material cost per unit",
      "Fixed cost spread over more units",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "cost_accounting",
    "topic": "cost_control_interpretation",
    "subtopic": "acc_interpretation",
    "skills": [
      "interpret_financial_indicators"
    ],
    "difficulty": 4,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "accounting",
    "year": 2024,
    "paper": "nov_p2",
    "type": "interpretation",
    "supplementary_material": {
      "type": "statement",
      "label": "Production information: Glow Lamps",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/accounting/2024/nov_p2/q19/statement_1.png"
      ]
    }
  },
  {
    "name": "Question 4",
    "question": "Match each cost to a strategy that keeps it under control.",
    "metadata": [
      "A - Direct material",
      "B - Fixed costs",
      "C - Direct labour",
      "D - Distribution",
      "1 - Make more units to spread the cost",
      "2 - Train workers to cut wasted time",
      "3 - Plan delivery routes to save fuel",
      "4 - Buy in bulk from a cheaper supplier"
    ],
    "answer": [
      "A-4",
      "B-1",
      "C-2",
      "D-3"
    ],
    "presentation": "match",
    "unit": "cost_accounting",
    "topic": "cost_control_interpretation",
    "subtopic": "acc_scenario_application",
    "skills": [
      "apply_accounting_concept_to_scenario"
    ],
    "difficulty": 3,
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
      "number": "4.2.3",
      "marks": 4,
      "clues": "- Direct material cost per unit fell from R520 to R450.\n- Total fixed cost stayed at R1 820 000 while more units were made.",
      "approach": "- Name the two costs.\n- Give a strategy for each.",
      "solution": "1. Direct material: cheaper or local suppliers, bulk buying, less wastage through supervision or training.\n2. Fixed cost: economies of scale; the same R1 820 000 spread over more units (S&D: better distribution or advertising is also accepted)."
    },
    {
      "number": "4.2.4",
      "marks": 4,
      "clues": "- The extra R300 000 profit must come from 400 extra units.\n- Each extra unit also costs R755 in variable costs.",
      "approach": "- Profit per extra unit plus variable cost per unit.",
      "solution": "1. R300 000 ÷ 400 = R750 + R755 = R1 505 per unit.\n2. Or (R300 000 + 400 × R755 = R302 000) ÷ 400 = R1 505."
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
