#!/usr/bin/env node
/**
 * DBE Economics P2 — November 2025 — Question 4.2.1–4.2.3: Inequality and income tax (order 19)
 * Lesson 19 of 2025 Nov P2 (DESIGN-UNI-14: 3 practice questions). Question 4.2.1–4.2.3: Inequality and income tax. Fresh practice questions (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2025-nov-p2-l19.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2025-nov-p2-l19.js --dry-run
 *   node scripts/add-economics-2025-nov-p2-l19.js
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
  "name": "Question 4.2.1–4.2.3: Inequality and income tax",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2025,
  "paper": "nov_p2",
  "order": 19,
  "content_tier": "free",
  "has_video": false,
  "xp": 4,
  "tags": [
    "income_inequality",
    "minimum_wage",
    "taxation"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p2/q19/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p2/q19/memo_1.png"
  ],
  "exam_question_marks": 4,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "A cartoon shows two workers doing identical jobs, one earning less purely because of her gender. Which reason for the unequal distribution of income does this show?",
    "metadata": [
      "Differences in education only",
      "Technological change",
      "Inflation",
      "Discrimination",
      ""
    ],
    "answer": [
      "Discrimination",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "interpretation",
    "unit": "redress_and_inequality",
    "topic": "income_inequality_and_redress",
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
    "clues": "- The pay differs although the work is the same."
  },
  {
    "name": "Question 2",
    "question": "A taxpayer earns R200 000. The first R100 000 is taxed at 18% and the rest at 26%. Calculate the total tax payable (in rand): []",
    "metadata": [
      "Total tax (R): ",
      "[ ]"
    ],
    "answer": [
      "44000",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "type": "calc",
    "unit": "redress_and_inequality",
    "topic": "income_inequality_and_redress",
    "subtopic": "econ_calculation",
    "skills": [
      "apply_economic_formula"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- Work out the tax on each slice of income separately.\n- Add the two amounts."
  },
  {
    "name": "Question 3",
    "question": "Why does government set a statutory minimum wage?",
    "metadata": [
      "To bring down the rate of unemployment directly",
      "To raise the profits that employers can earn",
      "To protect low-paid workers from being underpaid",
      "To stop the general price level from rising",
      ""
    ],
    "answer": [
      "To protect low-paid workers from being underpaid",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "redress_and_inequality",
    "topic": "minimum_wage",
    "subtopic": "econ_cause_and_effect",
    "skills": [
      "explain_economic_impact"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- A legal floor on pay is meant to help those at the bottom."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "4.2.1",
      "marks": 1,
      "clues": "- Look at what the cartoon says causes the gap.",
      "approach": "- Read the speech bubbles.\n- Identify the reason.",
      "solution": "1. The cartoon points to discrimination as the reason for unequal distribution of income and wealth."
    },
    {
      "number": "4.2.2",
      "marks": 1,
      "clues": "- The term refers to a legal lowest pay.",
      "approach": "- Recall labour-market terms.",
      "solution": "1. The lowest remuneration of labour set by government is the minimum wage."
    },
    {
      "number": "4.2.3",
      "marks": 2,
      "clues": "- The rate changes with income.",
      "approach": "- Define the term.\n- Contrast higher and lower incomes.",
      "solution": "1. A progressive income tax means people who earn higher incomes pay higher tax rates and those with lower incomes pay lower rates."
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
