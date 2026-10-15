#!/usr/bin/env node
/**
 * DBE Economics P2 — November 2024 — Question 1.3: Giving the term (order 4)
 * Lesson 4 of 2024 Nov P2 (DESIGN-UNI-14: 4 practice questions). Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2024-nov-p2-l04.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2024-nov-p2-l04.js --dry-run
 *   node scripts/add-economics-2024-nov-p2-l04.js
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
  "name": "Question 1.3: Giving the term",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2024,
  "paper": "nov_p2",
  "order": 4,
  "content_tier": "free",
  "has_video": false,
  "xp": 10,
  "tags": [
    "implicit_cost",
    "cost_push_inflation",
    "economies_of_scale"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p2/q4/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p2/q4/memo_1.png"
  ],
  "exam_question_marks": 6,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Give the term for the payments a firm makes to outsiders for the resources it uses, such as wages and rent: []",
    "metadata": [
      "Term: ",
      "[ ]"
    ],
    "answer": [
      "explicit cost|explicit costs",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "text",
    "type": "definition",
    "unit": "perfect_markets",
    "topic": "costs_and_revenue",
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
    "clues": "- These costs involve actual payments, unlike the value of inputs the owner supplies."
  },
  {
    "name": "Question 2",
    "question": "Give the term for a rise in the general price level that starts with higher costs of production: []",
    "metadata": [
      "Term: ",
      "[ ]"
    ],
    "answer": [
      "cost-push inflation|cost push inflation",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "text",
    "type": "definition",
    "unit": "economics_inflation",
    "topic": "inflation_types_and_effects",
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
    "clues": "- Think of rising wages and raw material prices pushing prices up from the supply side."
  },
  {
    "name": "Question 3",
    "question": "A bakery doubles its output and finds that the average cost of each loaf falls. Which concept does this show?",
    "metadata": [
      "price discrimination",
      "diminishing returns",
      "economies of scale",
      "market failure",
      ""
    ],
    "answer": [
      "economies of scale",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "perfect_markets",
    "topic": "costs_and_revenue",
    "subtopic": "econ_classification",
    "skills": [
      "classify_economic_concept"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Look at what happens to average cost as output grows."
  },
  {
    "name": "Question 4",
    "question": "Select ALL the renewable resources.",
    "metadata": [
      "Solar energy",
      "Coal",
      "Wind",
      "Natural gas",
      "Forests that are replanted"
    ],
    "answer": [
      "Solar energy",
      "Wind",
      "Forests that are replanted",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "definition",
    "unit": "environmental_sustainability",
    "topic": "environmental_problems",
    "subtopic": "econ_term_definition",
    "skills": [
      "define_economic_term"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- A renewable resource can be replaced or regenerate within a human lifetime."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "1.3.1",
      "marks": 1,
      "clues": "- Think of the value of inputs owned by the entrepreneur.",
      "approach": "- Give the term.",
      "solution": "Implicit cost."
    },
    {
      "number": "1.3.2",
      "marks": 1,
      "clues": "- Think of average cost falling as output rises.",
      "approach": "- Give the term.",
      "solution": "Economies of scale."
    },
    {
      "number": "1.3.3",
      "marks": 1,
      "clues": "- Think of the lowest amount employers must pay by law.",
      "approach": "- Give the term.",
      "solution": "Minimum wage."
    },
    {
      "number": "1.3.4",
      "marks": 1,
      "clues": "- Think of aggregate demand exceeding aggregate supply.",
      "approach": "- Give the term.",
      "solution": "Demand-pull inflation."
    },
    {
      "number": "1.3.5",
      "marks": 1,
      "clues": "- Think of the culture, history and environment unique to a society.",
      "approach": "- Give the term.",
      "solution": "Indigenous knowledge systems."
    },
    {
      "number": "1.3.6",
      "marks": 1,
      "clues": "- Think of resources that regenerate.",
      "approach": "- Give the term.",
      "solution": "Renewable resources."
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
