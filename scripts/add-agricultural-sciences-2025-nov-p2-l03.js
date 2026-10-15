#!/usr/bin/env node
/**
 * DBE Agricultural Sciences P2 — November 2025 — Question 1: Business plans and the management principles (Section A) (order 3)
 * Section A items 1.1.4 and 1.4.2 — reasons for drawing up a business plan and the management principle of control. Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-agricultural-sciences-2025-nov-p2-l03.js --curriculum temp/curriculum-vocab-agricultural-sciences.json
 *   node scripts/add-agricultural-sciences-2025-nov-p2-l03.js --dry-run
 *   node scripts/add-agricultural-sciences-2025-nov-p2-l03.js
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
  "name": "Question 1: Business plans and the management principles (Section A)",
  "syllabus": "dbe",
  "subject": "agricultural_sciences",
  "year": 2025,
  "paper": "nov_p2",
  "order": 3,
  "content_tier": "free",
  "has_video": false,
  "xp": 3,
  "tags": [
    "business_plan",
    "management_principles",
    "control_and_monitoring"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p2/q3/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p2/q3/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p2/q3/memo_1.png"
  ],
  "exam_question_marks": 3,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Select ALL the reasons why a farmer draws up a business plan.",
    "metadata": [
      "To remove the need for record keeping",
      "To find out whether the business idea can succeed",
      "To work out how much money the business needs",
      "To guide the daily operations of the business",
      "To avoid paying any tax on the profit"
    ],
    "answer": [
      "To find out whether the business idea can succeed",
      "To work out how much money the business needs",
      "To guide the daily operations of the business",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "agricultural_management_and_marketing",
    "topic": "business_planning",
    "subtopic": "agri_classification",
    "skills": [
      "classify_farm_concept"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- A plan is used before and during the running of a business."
  },
  {
    "name": "Question 2",
    "question": "A farm manager compares the actual milk yield each month with the target and corrects any problems. Which management principle is this?",
    "metadata": [
      "Planning",
      "Organising",
      "Leading",
      "Control",
      ""
    ],
    "answer": [
      "Control",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "agricultural_management_and_marketing",
    "topic": "planning_and_control",
    "subtopic": "agri_scenario_application",
    "skills": [
      "apply_management_concept"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- The principle involves checking and verifying results against goals."
  },
  {
    "name": "Question 3",
    "question": "Arrange the management principles in the order in which they are normally applied.",
    "metadata": [
      "Control",
      "Leading",
      "Planning",
      "Organising"
    ],
    "answer": [
      "Planning",
      "Organising",
      "Leading",
      "Control"
    ],
    "presentation": "ordering",
    "type": "ordering",
    "unit": "agricultural_management_and_marketing",
    "topic": "planning_and_control",
    "subtopic": "agri_process_sequence",
    "skills": [
      "sequence_agricultural_process"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p2"
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "1.1.4",
      "marks": 2,
      "clues": "- Think about what a business plan is used for.\n- Check each statement (i)–(iv).",
      "approach": "- Recall the reasons for drawing up a business plan.\n- Decide which statements are valid reasons, then match the combination.",
      "solution": "1. A plan shows whether the idea is feasible (i), guides daily operations (iii) and shows the financial needs (iv).\n2. Paying back a bank loan is not a reason for the plan itself (ii), so the answer is C."
    },
    {
      "number": "1.4.2",
      "marks": 1,
      "clues": "- The statement is about checking and verifying results.\n- Planning happens before the work.",
      "approach": "- Read the definition.\n- Replace the underlined word with the correct principle.",
      "solution": "1. The management principle of checking and verifying results or goals is control (monitoring), not planning."
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
