#!/usr/bin/env node
/**
 * DBE Accounting — November 2025 — Question 3.2.3: Share repurchase and shareholding (order 14)
 * Question 3.2.3 — the effect of a share repurchase on a shareholder's % holding, the concerns of the internal auditor, and the extra amount paid compared with the JSE price.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-accounting-2025-nov-p1-l14.js --curriculum temp/curriculum-vocab-accounting.json
 *   node scripts/add-accounting-2025-nov-p1-l14.js --dry-run
 *   node scripts/add-accounting-2025-nov-p1-l14.js
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
  "name": "Question 3.2.3: Share repurchase and shareholding",
  "syllabus": "dbe",
  "subject": "accounting",
  "year": 2025,
  "paper": "nov_p1",
  "order": 14,
  "content_tier": "free",
  "has_video": false,
  "xp": 10,
  "tags": [
    "share_repurchase_effect",
    "percentage_shareholding",
    "corporate_ethics"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p1/q14/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p1/q14/question_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p1/q14/question_3.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p1/q14/question_4.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p1/q14/memo_1.png"
  ],
  "exam_question_marks": 10,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Use the information in the figure to calculate the missing amounts A and B in the statement.",
    "metadata": [
      "A = ",
      "[ ]",
      "   B = ",
      "[ ]"
    ],
    "answer": [
      "50",
      "240000",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "unit": "interpretation_of_financial_information",
    "topic": "share_repurchase_and_ethics",
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
    "year": 2025,
    "paper": "nov_p1",
    "type": "calc",
    "clues": "- The CFO's number of shares does not change.\n- The extra amount is paid on every share repurchased.",
    "supplementary_material": {
      "type": "statement",
      "label": "Share capital (extract): Marlin Ltd",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/accounting/2025/nov_p1/q14/statement_1.png"
      ]
    }
  },
  {
    "name": "Question 2",
    "question": "The internal auditor is concerned about the CFO persuading the board to repurchase shares. Select the TWO valid reasons.",
    "metadata": [
      "The number of shares in issue decreased",
      "The CFO becomes the majority shareholder",
      "The company paid more than the JSE price",
      "The company has authorised more shares",
      "The shares were repurchased from a shareholder"
    ],
    "answer": [
      "The CFO becomes the majority shareholder",
      "The company paid more than the JSE price",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "interpretation_of_financial_information",
    "topic": "share_repurchase_and_ethics",
    "subtopic": "acc_interpretation",
    "skills": [
      "interpret_financial_indicators"
    ],
    "difficulty": 4,
    "exam_weight": 3,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "accounting",
    "year": 2025,
    "paper": "nov_p1",
    "type": "interpretation"
  },
  {
    "name": "Question 3",
    "question": "A shareholder sells nothing when a company repurchases shares from another shareholder. What happens to that shareholder's % holding?",
    "metadata": [
      "It stays the same, because the number of shares held is unchanged",
      "It decreases, because the company paid more than the market price",
      "It increases, because fewer shares are in issue",
      "It increases only if the shareholder buys more shares",
      ""
    ],
    "answer": [
      "It increases, because fewer shares are in issue",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "interpretation_of_financial_information",
    "topic": "share_repurchase_and_ethics",
    "subtopic": "acc_term_recall",
    "skills": [
      "recall_accounting_term"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "accounting",
    "year": 2025,
    "paper": "nov_p1",
    "type": "application"
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "3.2.3",
      "marks": 10,
      "clues": "- Lewis's own number of shares did not change, but the total number of shares fell.\n- The extra amount is compared with the JSE price on every share repurchased.",
      "approach": "- Find his shares before the repurchase, then divide by the new total.\n- Subtract the market price from the price paid and multiply by the number of shares.",
      "solution": "1. Lewis's shares = 1 783 250 × 40% = 713 300; new % = 713 300 ÷ 1 383 250 × 100 = 51,6%.\n2. Concerns (any two): he is now the majority shareholder; he acted for personal gain just before the final dividend; using company funds to enrich himself; the price was above the NAV and the market price.\n3. Additional amount = 400 000 × (R3,00 – R2,56) = R176 000."
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
