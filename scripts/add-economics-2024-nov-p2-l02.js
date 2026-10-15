#!/usr/bin/env node
/**
 * DBE Economics P2 — November 2024 — Question 1.1.5–1.1.8: Inflation, tourism and the environment (order 2)
 * Lesson 2 of 2024 Nov P2 (DESIGN-UNI-14: 4 practice questions). Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2024-nov-p2-l02.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2024-nov-p2-l02.js --dry-run
 *   node scripts/add-economics-2024-nov-p2-l02.js
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
  "name": "Question 1.1.5–1.1.8: Inflation, tourism and the environment",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2024,
  "paper": "nov_p2",
  "order": 2,
  "content_tier": "free",
  "has_video": false,
  "xp": 10,
  "tags": [
    "inflation_target",
    "deflation",
    "tourism",
    "environmental_issues"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p2/q2/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p2/q2/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p2/q2/memo_1.png"
  ],
  "exam_question_marks": 8,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Which band does the South African Reserve Bank use as its target for consumer price inflation?",
    "metadata": [
      "1% to 3%",
      "4% to 6%",
      "3% to 6%",
      "2% to 6%",
      ""
    ],
    "answer": [
      "3% to 6%",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "economics_inflation",
    "topic": "inflation_types_and_effects",
    "subtopic": "econ_term_definition",
    "skills": [
      "define_economic_term"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- The target is a band, not a single figure, and its lower end is not 1%."
  },
  {
    "name": "Question 2",
    "question": "A person must be away from home for at least how long for leisure travel to count as tourism?",
    "metadata": [
      "three days",
      "seven days",
      "one day",
      "five days",
      ""
    ],
    "answer": [
      "one day",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "tourism",
    "topic": "tourism_concepts",
    "subtopic": "econ_term_definition",
    "skills": [
      "define_economic_term"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Tourism needs an overnight or day-long stay away from home, not a long one."
  },
  {
    "name": "Question 3",
    "question": "The consumer price index falls from 125 to 120. Calculate the percentage change in the price level: []",
    "metadata": [
      "Change (%) = ",
      "[ ]"
    ],
    "answer": [
      "-4",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "type": "calc",
    "unit": "economics_inflation",
    "topic": "inflation_types_and_effects",
    "subtopic": "econ_calculation",
    "skills": [
      "apply_economic_formula"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Subtract the old index from the new one, then divide by the old index and multiply by 100.\n- A fall gives a negative answer."
  },
  {
    "name": "Question 4",
    "question": "Match each environmental term to its description.",
    "metadata": [
      "A - Deforestation",
      "B - Desertification",
      "C - Soil erosion",
      "D - Land degradation",
      "1 - Fertile land turning into desert",
      "2 - Trees removed without being replaced",
      "3 - Topsoil washed or blown away",
      "4 - A general decline in the quality of the land"
    ],
    "answer": [
      "A-2",
      "B-1",
      "C-3",
      "D-4"
    ],
    "presentation": "match",
    "type": "definition",
    "unit": "environmental_sustainability",
    "topic": "environmental_problems",
    "subtopic": "econ_term_definition",
    "skills": [
      "define_economic_term"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Two terms are about specific processes (trees, soil); two describe broader decline."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "1.1.5",
      "marks": 2,
      "clues": "- Recall the inflation band set for the SARB.",
      "approach": "- Choose the range.",
      "solution": "The inflation target range is 3% - 6% (A)."
    },
    {
      "number": "1.1.6",
      "marks": 2,
      "clues": "- Think of the shortest stay that counts as tourism.",
      "approach": "- Choose the minimum.",
      "solution": "The minimum length of stay for tourism activities is one day (D)."
    },
    {
      "number": "1.1.7",
      "marks": 2,
      "clues": "- Think of a sustained fall in prices.",
      "approach": "- Name it.",
      "solution": "A sustained decrease in prices over time is deflation (B)."
    },
    {
      "number": "1.1.8",
      "marks": 2,
      "clues": "- Think of tree removal without replacement.",
      "approach": "- Name the process.",
      "solution": "Removing trees without replacing them is deforestation (C)."
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
