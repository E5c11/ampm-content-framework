#!/usr/bin/env node
/**
 * DBE Accounting — November 2025 — Question 4.1–4.2: Donations and ethical behaviour (order 18)
 * Questions 4.1 and 4.2 — why corporate donations are important, why employees should report unethical behaviour, and actions to prevent it.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-accounting-2025-nov-p1-l18.js --curriculum temp/curriculum-vocab-accounting.json
 *   node scripts/add-accounting-2025-nov-p1-l18.js --dry-run
 *   node scripts/add-accounting-2025-nov-p1-l18.js
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
  "name": "Question 4.1–4.2: Donations and ethical behaviour",
  "syllabus": "dbe",
  "subject": "accounting",
  "year": 2025,
  "paper": "nov_p1",
  "order": 18,
  "content_tier": "free",
  "has_video": false,
  "xp": 6,
  "tags": [
    "corporate_donations",
    "ethics_and_whistle_blowing"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p1/q18/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p1/q18/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p1/q18/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/accounting/2025/nov_p1/q18/memo_2.png"
  ],
  "exam_question_marks": 6,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Some shareholders do not want the company to donate to community projects. Which point best explains why donations are important to the company?",
    "metadata": [
      "It increases the directors' bonuses in the same year",
      "It builds a good image and community goodwill",
      "It reduces the number of shares in issue",
      "It guarantees a higher dividend for shareholders",
      ""
    ],
    "answer": [
      "It builds a good image and community goodwill",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "corporate_governance",
    "topic": "corporate_social_responsibility",
    "subtopic": "acc_scenario_application",
    "skills": [
      "apply_accounting_concept_to_scenario"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "accounting",
    "year": 2025,
    "paper": "nov_p1",
    "type": "application"
  },
  {
    "name": "Question 2",
    "question": "Select the TWO reasons why it is important for employees to report unethical behaviour.",
    "metadata": [
      "It increases the profit of the company",
      "It reduces the tax paid by the company",
      "Misconduct is detected and dealt with early",
      "It protects the reputation and finances of the company",
      "It allows managers to keep their positions"
    ],
    "answer": [
      "Misconduct is detected and dealt with early",
      "It protects the reputation and finances of the company",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "corporate_governance",
    "topic": "ethics_and_internal_control",
    "subtopic": "acc_classification",
    "skills": [
      "classify_accounting_concept"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "accounting",
    "year": 2025,
    "paper": "nov_p1",
    "type": "application"
  },
  {
    "name": "Question 3",
    "question": "Select the TWO actions a company could take to prevent similar incidents in future.",
    "metadata": [
      "Reduce the number of directors",
      "Give ethics training to all employees",
      "Protect employees who report misconduct",
      "Stop reporting to the shareholders",
      "Remove the internal audit function"
    ],
    "answer": [
      "Give ethics training to all employees",
      "Protect employees who report misconduct",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "corporate_governance",
    "topic": "ethics_and_internal_control",
    "subtopic": "acc_classification",
    "skills": [
      "classify_accounting_concept"
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
  },
  {
    "name": "Question 4",
    "question": "Match each control measure to its purpose.",
    "metadata": [
      "A - Whistle-blowing channel",
      "B - Internal audit",
      "C - Code of conduct",
      "D - Ethics training",
      "1 - Finds irregularities early",
      "2 - Sets rules and consequences",
      "3 - Teaches acceptable behaviour",
      "4 - Lets employees report misconduct safely"
    ],
    "answer": [
      "A-4",
      "B-1",
      "C-2",
      "D-3"
    ],
    "presentation": "match",
    "unit": "corporate_governance",
    "topic": "ethics_and_internal_control",
    "subtopic": "acc_classification",
    "skills": [
      "classify_accounting_concept"
    ],
    "difficulty": 2,
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
      "number": "4.1",
      "marks": 2,
      "clues": "- Donations support the community and the company's image.\n- Think about governance and tax.",
      "approach": "- Give two valid benefits of donations to the company.\n- Link each benefit to the company, not only the community.",
      "solution": "1. Donations reflect good governance and contribute to the well-being of the community.\n2. They give good publicity that improves the company's image and can reduce taxable income."
    },
    {
      "number": "4.2",
      "marks": 4,
      "clues": "- The manager mismanaged funds and intimidated employees.\n- Think about detecting problems early and prevention.",
      "approach": "- Explain why employees must report the behaviour.\n- Suggest actions that make a repeat less likely.",
      "solution": "1. Reporting promotes accountability and helps the company to detect and solve problems early.\n2. The company could improve internal financial controls and audits, give regular ethics training, protect whistle-blowers and set clear rules with consequences."
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
