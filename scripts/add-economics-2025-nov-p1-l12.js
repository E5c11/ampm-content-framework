#!/usr/bin/env node
/**
 * DBE Economics P1 — November 2025 — Question 3.2: Household services graph (order 12)
 * Lesson 12 of the 2025 Nov P1 repair (DESIGN-UNI-14: 3 practice questions). Question 3.2: Household services graph. Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2025-nov-p1-l12.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2025-nov-p1-l12.js --dry-run
 *   node scripts/add-economics-2025-nov-p1-l12.js
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
  "name": "Question 3.2: Household services graph",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2025,
  "paper": "nov_p1",
  "order": 12,
  "content_tier": "free",
  "has_video": false,
  "xp": 4,
  "tags": [
    "social_indicators"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q12/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q12/memo_1.png"
  ],
  "exam_question_marks": 4,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Study the bar graph. To which service do households in Province X have the least access?",
    "metadata": [
      "Electricity",
      "Refuse removal",
      "Piped water",
      "Internet at home",
      ""
    ],
    "answer": [
      "Internet at home",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "interpretation",
    "unit": "economic_and_social_indicators",
    "topic": "social_indicators",
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
    "clues": "- Compare the heights of all the bars, not only the first few.",
    "supplementary_material": {
      "type": "graph",
      "label": "Graph",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/economics/2025/nov_p1/q12/graph_1.png"
      ]
    }
  },
  {
    "name": "Question 2",
    "question": "Study the bar graph. By how many percentage points is household access to electricity higher than access to refuse removal? []",
    "metadata": [
      "Difference (percentage points): ",
      "[ ]"
    ],
    "answer": [
      "38.7",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "type": "calc",
    "unit": "economic_and_social_indicators",
    "topic": "social_indicators",
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
    "paper": "nov_p1",
    "clues": "- Read the two values from the labels on top of the bars.\n- Subtract the smaller percentage from the larger one.",
    "supplementary_material": {
      "type": "graph",
      "label": "Graph",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/economics/2025/nov_p1/q12/graph_1.png"
      ]
    }
  },
  {
    "name": "Question 3",
    "question": "Over ten years, thousands of families leave rural villages to look for work in the cities. Which social indicator describes this movement?",
    "metadata": [
      "Life expectancy",
      "Urbanisation",
      "Literacy rate",
      "Fertility rate",
      ""
    ],
    "answer": [
      "Urbanisation",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "economic_and_social_indicators",
    "topic": "social_indicators",
    "subtopic": "econ_term_definition",
    "skills": [
      "define_economic_term"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- The indicator is about where people live, not how long or how well.\n- Focus on the direction of the move."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "3.2.1",
      "marks": 1,
      "clues": "- Compare the heights of all four bars.",
      "approach": "- Find the lowest bar in the graph.\n- Name the service on its label.",
      "solution": "1. The shortest bar, at 60%, is refuse removal, so households have the least access to it."
    },
    {
      "number": "3.2.2",
      "marks": 1,
      "clues": "- The movement is from the countryside to cities and towns.",
      "approach": "- Recall the social indicators in the curriculum.\n- Choose the one about rural-to-urban movement.",
      "solution": "1. The social indicator relating to migration from rural to urban areas is urbanisation."
    },
    {
      "number": "3.2.3",
      "marks": 2,
      "clues": "- It covers the safe handling of human waste and the cleanliness that follows.",
      "approach": "- Define sanitation in a sentence.\n- Mention facilities and services, and the health purpose.",
      "solution": "1. Sanitation is the provision of facilities and services such as toilets, garbage disposal and sewerage systems.\n2. Its purpose is the safe disposal of human waste, hygiene and a clean environment that protects people’s health."
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
