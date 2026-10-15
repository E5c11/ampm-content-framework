#!/usr/bin/env node
/**
 * DBE Economics P1 — November 2024 — Question 2.2.1–2.2.4: Public sector failure (order 6)
 * Lesson 6 of 2024 Nov P1 (DESIGN-UNI-14: 4 practice questions). Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2024-nov-p1-l06.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2024-nov-p1-l06.js --dry-run
 *   node scripts/add-economics-2024-nov-p1-l06.js
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

// ─── Phase 2 — lesson document ───────────────────────────────────────────────

const video = {
  "name": "Question 2.2.1–2.2.4: Public sector failure",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2024,
  "paper": "nov_p1",
  "order": 6,
  "content_tier": "free",
  "has_video": false,
  "xp": 10,
  "tags": [
    "public_sector_failure",
    "accountability"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p1/q6/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p1/q6/memo_1.png"
  ],
  "exam_question_marks": 6,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Read this illustrative extract: \"A provincial clinic often runs out of basic medicines. Managers do not plan stock orders and several officials lack the training to manage supplies.\" Which reason for public sector failure does the extract show?",
    "metadata": [
      "Heavy competition from many private clinics",
      "Poor management caused by a lack of skills",
      "Too much income from patients’ user fees",
      "Strong public oversight of all spending",
      ""
    ],
    "answer": [
      "Poor management caused by a lack of skills",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "interpretation",
    "unit": "public_sector",
    "topic": "public_sector_failure",
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
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Look at what the managers and officials are described as lacking."
  },
  {
    "name": "Question 2",
    "question": "Match each service to the level of government responsible for providing it.",
    "metadata": [
      "A - Street lighting",
      "B - Public hospitals",
      "C - Defence",
      "1 - National government",
      "2 - Local government",
      "3 - Provincial government"
    ],
    "answer": [
      "A-2",
      "B-3",
      "C-1"
    ],
    "presentation": "match",
    "type": "application",
    "unit": "public_sector",
    "topic": "public_sector_failure",
    "subtopic": "econ_classification",
    "skills": [
      "classify_economic_concept"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Local government serves a town or city directly; provincial government serves a whole province; national government serves the country as a whole."
  },
  {
    "name": "Question 3",
    "question": "Which situation is an example of accountability in the public sector?",
    "metadata": [
      "A municipal manager keeps the full budget secret from the council and the public",
      "An official explains to the council how funds were spent and accepts responsibility",
      "A department spends its budget on projects chosen by one official without any report",
      "A minister refuses to answer questions in parliament about a failed project",
      ""
    ],
    "answer": [
      "An official explains to the council how funds were spent and accepts responsibility",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "public_sector",
    "topic": "public_sector_failure",
    "subtopic": "econ_term_definition",
    "skills": [
      "define_economic_term"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Accountability means answering for decisions, actions and spending.\n- Look for the option where an official is open about what was done and owns the outcome."
  },
  {
    "name": "Question 4",
    "question": "Select ALL the effects of public sector failure on the allocation of resources.",
    "metadata": [
      "Resources are directed to where they are needed most",
      "Funds are wasted on failed projects",
      "Taxpayers’ money is used inefficiently",
      "Resources are not optimally allocated",
      "State revenue rises automatically"
    ],
    "answer": [
      "Funds are wasted on failed projects",
      "Taxpayers’ money is used inefficiently",
      "Resources are not optimally allocated",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "public_sector",
    "topic": "misallocation_of_resources",
    "subtopic": "econ_classification",
    "skills": [
      "classify_economic_concept"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Public sector failure means resources do not reach their best use.\n- Think of what happens to money spent on projects that do not deliver."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "2.2.1",
      "marks": 1,
      "clues": "- Look for what the extract says about management and skills.",
      "approach": "- Name one reason from the extract.",
      "solution": "Management failure / lack of skills is the reason identified in the extract."
    },
    {
      "number": "2.2.2",
      "marks": 1,
      "clues": "- Think about who provides local services such as refuse removal.",
      "approach": "- Name the level of government.",
      "solution": "Local government (municipalities / local authorities) provides services such as refuse removal."
    },
    {
      "number": "2.2.3",
      "marks": 2,
      "clues": "- Think about explaining decisions and accepting responsibility.",
      "approach": "- Describe the term in one sentence.",
      "solution": "Accountability is the duty of an individual or organisation to explain their decisions, actions and expenditure and to accept responsibility for their behaviour."
    },
    {
      "number": "2.2.4",
      "marks": 2,
      "clues": "- Think about whether resources are used where they are most valuable.",
      "approach": "- Give one developed effect.",
      "solution": "1. Resources will not be optimally allocated, so valuable resources are wasted.\n2. Funds go to failed projects and inefficient departments, which wastes taxpayers' money. Any other correct relevant response is accepted."
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
