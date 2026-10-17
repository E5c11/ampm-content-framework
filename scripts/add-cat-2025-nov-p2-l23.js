#!/usr/bin/env node
/**
 * DBE Computer Applications Technology — November 2025 Paper 2 (Theory) — Question 10.4–10.5: Broadband, bandwidth and gathering reliable data (order 23)
 * Question 10.4.1, 10.4.2, 10.5.1 and 10.5.2 — broadband, bandwidth for online gaming, data gathering tools and keeping collected data free from errors.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-cat-2025-nov-p2-l23.js --curriculum temp/curriculum-vocab-cat.json
 *   node scripts/add-cat-2025-nov-p2-l23.js --dry-run
 *   node scripts/add-cat-2025-nov-p2-l23.js
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
  "name": "Question 10.4–10.5: Broadband, bandwidth and gathering reliable data",
  "syllabus": "dbe",
  "subject": "cat",
  "year": 2025,
  "paper": "nov_p2",
  "order": 23,
  "content_tier": "free",
  "has_video": false,
  "xp": 8,
  "tags": [
    "broadband_and_bandwidth",
    "data_gathering_tools",
    "data_accuracy"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/cat/2025/nov_p2/q23/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/cat/2025/nov_p2/q23/memo_1.png"
  ],
  "exam_question_marks": 8,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "What is broadband?",
    "metadata": [
      "An internet connection that works only at night",
      "An internet connection that needs no router at all",
      "A dial-up connection that uses a telephone line",
      "A high-speed internet connection that is always on",
      ""
    ],
    "answer": [
      "A high-speed internet connection that is always on",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "network_technologies",
    "topic": "internet_connections",
    "subtopic": "cat_term_recall",
    "skills": [
      "recall_cat_term"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "cat",
    "year": 2025,
    "paper": "nov_p2",
    "type": "definition"
  },
  {
    "name": "Question 2",
    "question": "Which TWO are reasons why the school should have a large bandwidth for online gaming?",
    "metadata": [
      "It makes the computers cheaper to buy",
      "Many learners play at the same time",
      "It increases the RAM in each computer",
      "It prevents lagging and buffering during games",
      "It lets games run without any computers"
    ],
    "answer": [
      "Many learners play at the same time",
      "It prevents lagging and buffering during games",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "network_technologies",
    "topic": "internet_connections",
    "subtopic": "cat_cause_and_effect",
    "skills": [
      "explain_cat_cause_and_effect"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "cat",
    "year": 2025,
    "paper": "nov_p2",
    "type": "application"
  },
  {
    "name": "Question 3",
    "question": "Which TWO tools can be used to gather direct feedback from learners?",
    "metadata": [
      "A spreadsheet formula",
      "A firewall",
      "A survey, online or on paper",
      "An interview",
      "A scanner"
    ],
    "answer": [
      "A survey, online or on paper",
      "An interview",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "information_management",
    "topic": "gathering_data",
    "subtopic": "cat_scenario_application",
    "skills": [
      "apply_cat_concept_to_scenario"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "cat",
    "year": 2025,
    "paper": "nov_p2",
    "type": "application"
  },
  {
    "name": "Question 4",
    "question": "Match each questionnaire feature to its effect on the data collected.",
    "metadata": [
      "A - Drop-down list",
      "B - Date picker",
      "C - Open-ended question",
      "D - Check box",
      "1 - Prevents dates that are typed in the wrong form",
      "2 - Lets respondents type anything, so answers vary widely",
      "3 - Lets a respondent tick one or more listed options",
      "4 - Limits the answers to a set list of choices"
    ],
    "answer": [
      "A-4",
      "B-1",
      "C-2",
      "D-3"
    ],
    "presentation": "match",
    "unit": "information_management",
    "topic": "gathering_data",
    "subtopic": "cat_classification",
    "skills": [
      "classify_cat_concept"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "cat",
    "year": 2025,
    "paper": "nov_p2",
    "type": "application"
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "10.4.1",
      "marks": 2,
      "clues": "- Broadband describes a type of connection.\n- Two features are asked for.",
      "approach": "- Describe its speed and its availability.",
      "solution": "1. A high-speed connection.\n2. An always-on internet connection."
    },
    {
      "number": "10.4.2",
      "marks": 2,
      "clues": "- Many learners will play at the same time.\n- Think about lag and buffering.",
      "approach": "- Give two reasons for a large bandwidth.",
      "solution": "1. Any two: no lagging or buffering, many learners online at once, online multiplayer play, or a more enjoyable and engaging experience."
    },
    {
      "number": "10.5.1",
      "marks": 2,
      "clues": "- The committee wants direct feedback from learners.\n- Think about ways of asking people.",
      "approach": "- Suggest two data gathering tools.",
      "solution": "1. Any two: a survey (online or paper-based), an interview, or a WhatsApp poll."
    },
    {
      "number": "10.5.2",
      "marks": 2,
      "clues": "- The data must be free from errors before analysis.\n- Think about how respondents answer.",
      "approach": "- State two ways to prevent errors.",
      "solution": "1. Any two: use controls such as combo boxes, check boxes, drop-down lists or date pickers; avoid open-ended questions; give the survey to the correct or suitable participants."
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
