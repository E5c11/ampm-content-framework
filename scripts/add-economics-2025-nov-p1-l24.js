#!/usr/bin/env node
/**
 * DBE Economics P1 — November 2025 — Question 5: The business sector (order 24)
 * Lesson 24 of the 2025 Nov P1 repair (DESIGN-UNI-14: 3 practice questions). Question 5: The business sector. Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2025-nov-p1-l24.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2025-nov-p1-l24.js --dry-run
 *   node scripts/add-economics-2025-nov-p1-l24.js
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
  "name": "Question 5: The business sector",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2025,
  "paper": "nov_p1",
  "order": 24,
  "content_tier": "free",
  "has_video": false,
  "xp": 10,
  "tags": [
    "business_sector",
    "essay_structure"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q24/question_11.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q24/memo_11.png"
  ],
  "exam_question_marks": 10,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Select ALL the ways in which the business sector contributes positively to the development of the South African economy.",
    "metadata": [
      "It creates jobs directly and indirectly",
      "It pays corporate tax that funds public services and infrastructure",
      "It invests in research and development, which encourages innovation",
      "It always pays wages that close the income gap",
      "It never causes any harm to the environment"
    ],
    "answer": [
      "It creates jobs directly and indirectly",
      "It pays corporate tax that funds public services and infrastructure",
      "It invests in research and development, which encourages innovation",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "circular_flow",
    "topic": "business_sector_contribution",
    "subtopic": "econ_policy_evaluation",
    "skills": [
      "evaluate_economic_policy"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- The two incorrect options make claims that are far too absolute to be defended."
  },
  {
    "name": "Question 2",
    "question": "Which of the following is a negative effect of profit-driven business activity on the economy?",
    "metadata": [
      "Firms pay corporate tax",
      "Firms create job opportunities",
      "Firms invest in skills development",
      "Some firms ignore the pollution that their activities cause",
      ""
    ],
    "answer": [
      "Some firms ignore the pollution that their activities cause",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "circular_flow",
    "topic": "business_sector_contribution",
    "subtopic": "econ_cause_and_effect",
    "skills": [
      "explain_economic_impact"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Look for the option that describes a cost to society rather than a benefit."
  },
  {
    "name": "Question 3",
    "question": "The 10-mark additional part of the essay asks you to evaluate. At most how many of its marks can mere listing of facts earn?",
    "metadata": [
      "0",
      "2",
      "5",
      "10",
      ""
    ],
    "answer": [
      "2",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "circular_flow",
    "topic": "business_sector_contribution",
    "subtopic": "econ_essay_structure",
    "skills": [
      "structure_economics_essay"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Evaluation needs explained points with a judgement, so lists are capped heavily."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "5",
      "marks": 10,
      "clues": "- The additional part is an evaluation: give positives and negatives, each developed.\n- A mere list of facts earns at most 2 of the 10 marks.",
      "approach": "- List positive contributions such as jobs, skills, GDP, innovation, tax, partnerships, exports and corporate social investment.\n- Add negatives such as inequality, pollution and collusion.\n- Develop each point with its effect on development.",
      "solution": "1. Positives: businesses create jobs, build skills, drive GDP, invest in research, pay corporate tax, partner with government and support communities.\n2. Negatives: low wages widen inequality, profit-driven firms may pollute, and unfair practices such as collusion exploit consumers.\n3. The evaluation is scored for developed points, not for a bare list (max 10)."
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
