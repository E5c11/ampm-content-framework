#!/usr/bin/env node
/**
 * DBE Economics P1 — November 2025 — Question 4.3: The EPWP and the NDP (order 20)
 * Lesson 20 of the 2025 Nov P1 repair (DESIGN-UNI-14: 3 practice questions). Question 4.3: The EPWP and the NDP. Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2025-nov-p1-l20.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2025-nov-p1-l20.js --dry-run
 *   node scripts/add-economics-2025-nov-p1-l20.js
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
  "name": "Question 4.3: The EPWP and the NDP",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2025,
  "paper": "nov_p1",
  "order": 20,
  "content_tier": "free",
  "has_video": false,
  "xp": 4,
  "tags": [
    "public_works",
    "redress_policies"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q20/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q20/memo_1.png"
  ],
  "exam_question_marks": 4,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "An extract explains that a municipal programme will pay unemployed rural women to maintain school buildings and clear alien plants from rivers. Which socio-economic problem is the programme mainly addressing?",
    "metadata": [
      "Inflation",
      "A balance of payments deficit",
      "Market concentration",
      "Unemployment",
      ""
    ],
    "answer": [
      "Unemployment",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "interpretation",
    "unit": "growth_and_development",
    "topic": "public_works_and_development_policy",
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
    "paper": "nov_p1",
    "clues": "- Look at who is being paid and why they were not earning before."
  },
  {
    "name": "Question 2",
    "question": "Which of the following is a goal of the National Development Plan (NDP)?",
    "metadata": [
      "Replacing the rand with a regional currency",
      "Eliminating poverty and reducing inequality by 2030",
      "Nationalising all private firms",
      "Abolishing income tax",
      ""
    ],
    "answer": [
      "Eliminating poverty and reducing inequality by 2030",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "growth_and_development",
    "topic": "public_works_and_development_policy",
    "subtopic": "econ_term_definition",
    "skills": [
      "define_economic_term"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- The plan’s goals deal with living standards over a long period.\n- Three options are extreme measures that do not appear in the plan."
  },
  {
    "name": "Question 3",
    "question": "Select ALL the production methods that are labour-intensive.",
    "metadata": [
      "A robotic car assembly line",
      "Fruit pickers harvesting an orchard by hand",
      "A fully automated bottling plant with a handful of technicians",
      "A road crew using spades and wheelbarrows and employing many workers",
      "A tailor shop where staff sew each garment by hand"
    ],
    "answer": [
      "A road crew using spades and wheelbarrows and employing many workers",
      "Fruit pickers harvesting an orchard by hand",
      "A tailor shop where staff sew each garment by hand",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "definition",
    "unit": "growth_and_development",
    "topic": "public_works_and_development_policy",
    "subtopic": "econ_classification",
    "skills": [
      "classify_economic_concept"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Compare how much human effort is used with how much machinery is used."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "4.3.1",
      "marks": 1,
      "clues": "- The extract mentions the people the programme is meant to help and the burden they carry.",
      "approach": "- Read the second paragraph.\n- Pick the socio-economic problem named.",
      "solution": "1. The extract says the programme will create job opportunities for communities burdened by low growth and unemployment, so the problem is unemployment."
    },
    {
      "number": "4.3.2",
      "marks": 1,
      "clues": "- It is a long-term national plan with a target year of 2030.",
      "approach": "- Recall the policy with the 2030 target.\n- Give its name.",
      "solution": "1. The growth and development policy aiming to eliminate poverty and reduce inequality by 2030 is the National Development Plan (NDP)."
    },
    {
      "number": "4.3.3",
      "marks": 2,
      "clues": "- Compare the use of labour with the use of capital.",
      "approach": "- Define the term.\n- Contrast human effort with machinery.",
      "solution": "1. Labour-intensive describes processes or tasks that need more human effort than capital to produce goods and services."
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
