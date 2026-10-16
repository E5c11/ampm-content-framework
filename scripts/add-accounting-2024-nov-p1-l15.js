#!/usr/bin/env node
/**
 * DBE Accounting — November 2024 — Question 3.5: Rights issue and % shareholding (order 15)
 * Question 3.5 — the shares a shareholder bought through a rights issue, the % shareholding after the issue, and the amount spent on the rights shares.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-accounting-2024-nov-p1-l15.js --curriculum temp/curriculum-vocab-accounting.json
 *   node scripts/add-accounting-2024-nov-p1-l15.js --dry-run
 *   node scripts/add-accounting-2024-nov-p1-l15.js
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
  "name": "Question 3.5: Rights issue and % shareholding",
  "syllabus": "dbe",
  "subject": "accounting",
  "year": 2024,
  "paper": "nov_p1",
  "order": 15,
  "content_tier": "free",
  "has_video": false,
  "xp": 12,
  "tags": [
    "rights_issue",
    "percentage_shareholding"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2024/nov_p1/q15/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2024/nov_p1/q15/question_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2024/nov_p1/q15/question_3.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2024/nov_p1/q15/memo_1.png"
  ],
  "exam_question_marks": 12,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Use the information in the figure to calculate the missing amounts A and B.",
    "metadata": [
      "A = ",
      "[ ]",
      "   B = R ",
      "[ ]"
    ],
    "answer": [
      "351000",
      "5.5|5.50",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "unit": "interpretation_of_financial_information",
    "topic": "solvency_and_rights_issue",
    "subtopic": "acc_calculation",
    "skills": [
      "calculate_accounting_amount"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "accounting",
    "year": 2024,
    "paper": "nov_p1",
    "type": "calc",
    "clues": "- Thandi gets 3 shares for every 20 she owns.\n- All the new shares together raised the increase in share capital.",
    "supplementary_material": {
      "type": "statement",
      "label": "Rights issue: Marula Ltd",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/accounting/2024/nov_p1/q15/statement_1.png"
      ]
    }
  },
  {
    "name": "Question 2",
    "question": "What is Thandi's % shareholding after the rights issue?",
    "metadata": [
      "45,2%",
      "59,8%",
      "52,0%",
      "6,8%",
      ""
    ],
    "answer": [
      "52,0%",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "interpretation_of_financial_information",
    "topic": "solvency_and_rights_issue",
    "subtopic": "acc_calculation",
    "skills": [
      "calculate_accounting_amount"
    ],
    "difficulty": 4,
    "exam_weight": 3,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "accounting",
    "year": 2024,
    "paper": "nov_p1",
    "type": "calc",
    "supplementary_material": {
      "type": "statement",
      "label": "Rights issue: Marula Ltd",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/accounting/2024/nov_p1/q15/statement_1.png"
      ]
    }
  },
  {
    "name": "Question 3",
    "question": "Use your answers for A and B. Calculate the total amount Thandi paid for her rights shares.",
    "metadata": [
      "Amount paid = R ",
      "[ ]"
    ],
    "answer": [
      "1930500",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "unit": "interpretation_of_financial_information",
    "topic": "solvency_and_rights_issue",
    "subtopic": "acc_calculation",
    "skills": [
      "calculate_accounting_amount"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "accounting",
    "year": 2024,
    "paper": "nov_p1",
    "type": "calc",
    "supplementary_material": {
      "type": "statement",
      "label": "Rights issue: Marula Ltd",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/accounting/2024/nov_p1/q15/statement_1.png"
      ]
    }
  },
  {
    "name": "Question 4",
    "question": "Select ALL the true statements about this rights issue.",
    "metadata": [
      "New investors could buy the shares first",
      "Existing shareholders were offered the shares first",
      "Each shareholder's % holding stayed the same",
      "The shares were offered above market price",
      "Thandi lost her majority after the issue"
    ],
    "answer": [
      "Existing shareholders were offered the shares first",
      "Each shareholder's % holding stayed the same",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "interpretation_of_financial_information",
    "topic": "solvency_and_rights_issue",
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
    "year": 2024,
    "paper": "nov_p1",
    "type": "application"
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "3.5",
      "marks": 12,
      "clues": "- Grant owned 1 620 000 of the 3 000 000 shares; the offer was 10 shares for every 50, and everyone took it up.\n- Share capital rose from R28 800 000 to R31 770 000 because of the rights issue.",
      "approach": "- Apply the 10-for-50 ratio to Grant's shares and to all shares in issue.\n- Divide the increase in share capital by the rights shares to find the price, then multiply by Grant's rights shares.",
      "solution": "1. Rights shares bought by Grant = 1 620 000 × 10/50 = 324 000 shares.\n2. % shareholding = (1 620 000 + 324 000) ÷ (3 000 000 + 600 000) × 100 = 54%.\n3. Price per rights share = R2 970 000 ÷ 600 000 = R4,95; Grant spent 324 000 × R4,95 = R1 603 800."
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
