#!/usr/bin/env node
/**
 * DBE Accounting — November 2025 — Question 4.3–4.5: Insolvency and the rights issue (order 19)
 * Questions 4.3 to 4.5 — the meaning of insolvent, how a rights issue improves solvency, and why shareholders take part.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-accounting-2025-nov-p1-l19.js --curriculum temp/curriculum-vocab-accounting.json
 *   node scripts/add-accounting-2025-nov-p1-l19.js --dry-run
 *   node scripts/add-accounting-2025-nov-p1-l19.js
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
  "name": "Question 4.3–4.5: Insolvency and the rights issue",
  "syllabus": "dbe",
  "subject": "accounting",
  "year": 2025,
  "paper": "nov_p1",
  "order": 19,
  "content_tier": "free",
  "has_video": false,
  "xp": 9,
  "tags": [
    "insolvency",
    "rights_issue"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p1/q19/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p1/q19/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p1/q19/memo_1.png"
  ],
  "exam_question_marks": 9,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "What does it mean when a company is insolvent?",
    "metadata": [
      "Its assets are greater than its liabilities",
      "Its sales are lower than the year before",
      "It has no cash on hand at the end of the month",
      "Its liabilities are greater than its assets",
      ""
    ],
    "answer": [
      "Its liabilities are greater than its assets",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "corporate_governance",
    "topic": "solvency_and_rights_issue",
    "subtopic": "acc_term_recall",
    "skills": [
      "recall_accounting_term"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "accounting",
    "year": 2025,
    "paper": "nov_p1",
    "type": "definition"
  },
  {
    "name": "Question 2",
    "question": "A company offers shares to existing shareholders only, at a 25% discount on the market price of R20 per share. Calculate the price per share in the rights issue.",
    "metadata": [
      "Price = R ",
      "[ ]",
      " per share"
    ],
    "answer": [
      "15",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "unit": "corporate_governance",
    "topic": "solvency_and_rights_issue",
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
    "paper": "nov_p1",
    "type": "calc"
  },
  {
    "name": "Question 3",
    "question": "A rights issue is made when the company's bank balance is favourable. Select the THREE correct effects on the company.",
    "metadata": [
      "Liabilities increase by the cash received",
      "Assets increase because cash is received",
      "Equity increases because shares are issued",
      "Liabilities remain unchanged",
      "Equity decreases because shares are sold cheaply"
    ],
    "answer": [
      "Assets increase because cash is received",
      "Equity increases because shares are issued",
      "Liabilities remain unchanged",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "corporate_governance",
    "topic": "solvency_and_rights_issue",
    "subtopic": "acc_interpretation",
    "skills": [
      "interpret_financial_indicators"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "accounting",
    "year": 2025,
    "paper": "nov_p1",
    "type": "interpretation"
  },
  {
    "name": "Question 4",
    "question": "Which is a valid reason why existing shareholders take part in a rights issue?",
    "metadata": [
      "They buy the shares below the market price",
      "They are forced to sell their existing shares",
      "They receive a higher salary as directors",
      "They avoid paying tax on the shares",
      ""
    ],
    "answer": [
      "They buy the shares below the market price",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "corporate_governance",
    "topic": "solvency_and_rights_issue",
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
    "year": 2025,
    "paper": "nov_p1",
    "type": "application"
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "4.3",
      "marks": 2,
      "clues": "- Insolvent describes the relationship between assets and liabilities.",
      "approach": "- Say which is larger, the assets or the liabilities.\n- Say what the company cannot do as a result.",
      "solution": "1. A company is insolvent when its liabilities exceed its assets, so it has negative equity.\n2. It would be unable to settle its liabilities from its assets if it were liquidated."
    },
    {
      "number": "4.4",
      "marks": 3,
      "clues": "- New shares were issued to existing shareholders for cash.\n- Look at assets, equity and liabilities separately.",
      "approach": "- Say what happens to each of assets, equity and liabilities.\n- Link the changes to solvency.",
      "solution": "1. Assets increase because more cash is received.\n2. Equity increases because more shares are issued, and liabilities remain unchanged, which improves solvency."
    },
    {
      "number": "4.5",
      "marks": 4,
      "clues": "- The shares were offered at R27 when the market price was R39.\n- Think about the shareholders' investment and the company's survival.",
      "approach": "- Give reasons that show the benefit to the shareholder.\n- Use the figures from the information.",
      "solution": "1. They buy shares at a 30% discount and can resell them at the market price to make a profit.\n2. They safeguard their existing investment and show confidence in the recovery of the company, which minimises the chance of liquidation."
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
