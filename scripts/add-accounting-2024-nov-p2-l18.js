#!/usr/bin/env node
/**
 * DBE Accounting — November 2024 — Question 4.2.1–4.2.2: Break-even point, gross profit and selling price (order 18)
 * Questions 4.2.1 and 4.2.2 — commenting on production against the break-even point, and on gross profit and whether the new selling price was reasonable.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-accounting-2024-nov-p2-l18.js --curriculum temp/curriculum-vocab-accounting-2024-p2.json
 *   node scripts/add-accounting-2024-nov-p2-l18.js --dry-run
 *   node scripts/add-accounting-2024-nov-p2-l18.js
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
  "name": "Question 4.2.1–4.2.2: Break-even point, gross profit and selling price",
  "syllabus": "dbe",
  "subject": "accounting",
  "year": 2024,
  "paper": "nov_p2",
  "order": 18,
  "content_tier": "free",
  "has_video": false,
  "xp": 8,
  "tags": [
    "break_even_point",
    "pricing_decision_effect"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2024/nov_p2/q18/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2024/nov_p2/q18/memo_1.png"
  ],
  "exam_question_marks": 8,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Use the information in the figure. By how many units was production below the break-even point in 2026?",
    "metadata": [
      "Units below break-even = ",
      "[ ]"
    ],
    "answer": [
      "1200",
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
    "order": 1,
    "syllabus": "dbe",
    "subject": "accounting",
    "year": 2024,
    "paper": "nov_p2",
    "type": "calc",
    "supplementary_material": {
      "type": "statement",
      "label": "Production information: Glow Lamps",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/accounting/2024/nov_p2/q18/statement_1.png"
      ]
    }
  },
  {
    "name": "Question 2",
    "question": "Fixed costs are R900 000. The selling price is R350 per unit and variable costs are R200 per unit. Calculate the break-even point.",
    "metadata": [
      "Break-even point = ",
      "[ ]",
      " units"
    ],
    "answer": [
      "6000",
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
    "question": "Use the figure. Select the TWO correct comments, with figures, on production and the break-even point.",
    "metadata": [
      "Production fell from 5 200 to 4 300 units",
      "Production rose from 4 300 to 5 200 units",
      "The BEP improved from 8 000 to 6 400 units",
      "The BEP worsened from 6 400 to 8 000 units",
      "Production beat the BEP, so a profit was made"
    ],
    "answer": [
      "Production rose from 4 300 to 5 200 units",
      "The BEP improved from 8 000 to 6 400 units",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
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
    "year": 2024,
    "paper": "nov_p2",
    "type": "interpretation",
    "supplementary_material": {
      "type": "statement",
      "label": "Production information: Glow Lamps",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/accounting/2024/nov_p2/q18/statement_1.png"
      ]
    }
  },
  {
    "name": "Question 4",
    "question": "Use the figure. Did customers find the 2026 selling price reasonable?",
    "metadata": [
      "No: the price rose 3,2% and 900 fewer units were sold",
      "No: the price rose 20%, so customers went elsewhere",
      "Yes: the price rose only 3,2% and 900 more units sold",
      "Yes: the price fell by R20, so 900 more units sold",
      ""
    ],
    "answer": [
      "Yes: the price rose only 3,2% and 900 more units sold",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "cost_accounting",
    "topic": "cost_control_interpretation",
    "subtopic": "acc_interpretation",
    "skills": [
      "interpret_financial_indicators"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "accounting",
    "year": 2024,
    "paper": "nov_p2",
    "type": "interpretation",
    "supplementary_material": {
      "type": "statement",
      "label": "Production information: Glow Lamps",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/accounting/2024/nov_p2/q18/statement_1.png"
      ]
    }
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "4.2.1",
      "marks": 4,
      "clues": "- Units produced and sold must be compared with the break-even point.\n- Compare the shortfall with the previous year.",
      "approach": "- Say whether a profit or loss was made, with the units.\n- Compare with 2023.",
      "solution": "1. 3 640 units were produced and sold, below the BEP of 6 868: a loss on 3 228 units.\n2. This improved on 2023, when the shortfall was 5 073 units (BEP fell by 1 115 units; production rose by 730 units)."
    },
    {
      "number": "4.2.2",
      "marks": 4,
      "clues": "- Gross profit, units sold and the selling price all changed.",
      "approach": "- Quote the change in gross profit.\n- Compare the price increase with the increase in units sold.",
      "solution": "1. Gross profit rose from R960 300 to R1 237 600 (by R277 300 or 28,9%).\n2. The price rose from R990 to R1 020 (3%), yet 730 more units (25%) were sold, so customers found it reasonable."
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
