#!/usr/bin/env node
/**
 * DBE Economics P1 — November 2025 — Question 1.1.5–1.1.8: Tax, industrial policy and unemployment (order 2)
 * Lesson 2 of the 2025 Nov P1 repair (DESIGN-UNI-14: 3 practice questions). Question 1.1.5–1.1.8: Tax, industrial policy and unemployment. Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2025-nov-p1-l02.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2025-nov-p1-l02.js --dry-run
 *   node scripts/add-economics-2025-nov-p1-l02.js
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
  "name": "Question 1.1.5–1.1.8: Tax, industrial policy and unemployment",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2025,
  "paper": "nov_p1",
  "order": 2,
  "content_tier": "free",
  "has_video": false,
  "xp": 8,
  "tags": [
    "taxation_systems",
    "trade_policy",
    "economic_indicators"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q2/question_11.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q2/question_12.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q2/memo_11.png"
  ],
  "exam_question_marks": 8,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Thabo earns R12 000 a month and pays R1 200 in income tax. Lerato earns R36 000 a month and pays R7 200. Which tax system does this pattern show?",
    "metadata": [
      "Proportional",
      "Regressive",
      "Progressive",
      "Indirect",
      ""
    ],
    "answer": [
      "Progressive",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "public_sector",
    "topic": "taxation_systems",
    "subtopic": "econ_classification",
    "skills": [
      "classify_economic_concept"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Work out each person’s tax as a percentage of their income.\n- Compare how that percentage changes as income rises."
  },
  {
    "name": "Question 2",
    "question": "Which document is South Africa’s rolling three-year plan that turns the National Industrial Policy Framework into concrete actions?",
    "metadata": [
      "Industrial Policy Action Plan",
      "National Research and Development Strategy",
      "Integrated Manufacturing Strategy",
      "Reconstruction and Development Programme",
      ""
    ],
    "answer": [
      "Industrial Policy Action Plan",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "growth_and_development",
    "topic": "industrial_policy",
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
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Look for the plan that is renewed regularly and is about action, not about a framework.\n- One option is a research strategy and another is a 1990s social programme, so neither is the industrial plan."
  },
  {
    "name": "Question 3",
    "question": "A region has 4 000 000 economically active people, of whom 3 200 000 are employed. All the others are actively looking for work. Calculate the unemployment rate as a percentage: []",
    "metadata": [
      "Unemployment rate (%): ",
      "[ ]"
    ],
    "answer": [
      "20",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "type": "calc",
    "unit": "economic_and_social_indicators",
    "topic": "labour_force_and_unemployment",
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
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Find the number of unemployed people first.\n- Express that number as a percentage of the economically active population."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "1.1.5",
      "marks": 2,
      "clues": "- Is the duty a percentage of value or a fixed amount per item?",
      "approach": "- Recall the two main types of import duty.\n- Match a fixed amount per unit, weight or size to the correct type.",
      "solution": "1. A tariff levied as a fixed amount per unit, weight or size is a specific tariff.\n2. Ad valorem tariffs are a percentage of value, so A is wrong; the answer is D."
    },
    {
      "number": "1.1.6",
      "marks": 2,
      "clues": "- Think about which tax system takes a larger share from higher earners.",
      "approach": "- Recall how each tax system changes the rate as income rises.\n- Choose the one that redistributes income towards the poor.",
      "solution": "1. A progressive tax system charges higher income earners a higher rate, which redistributes income.\n2. The answer is B."
    },
    {
      "number": "1.1.7",
      "marks": 2,
      "clues": "- The strategy is about making production more competitive.",
      "approach": "- List the industrial strategies named in the options.\n- Match the one whose focus is competitiveness in production.",
      "solution": "1. The Integrated Manufacturing Strategy focuses on improving the competitiveness of production.\n2. The answer is A."
    },
    {
      "number": "1.1.8",
      "marks": 2,
      "clues": "- Recall the working-age band used for the labour force.",
      "approach": "- Remember the lower and upper age limits that define the economically active population.\n- Choose the matching pair.",
      "solution": "1. The economically active population consists of people between 15 and 64.\n2. The answer is C."
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
