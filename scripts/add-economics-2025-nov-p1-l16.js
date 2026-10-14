#!/usr/bin/env node
/**
 * DBE Economics P1 — November 2025 — Question 3.5: Economic indicators (order 16)
 * Lesson 16 of the 2025 Nov P1 repair (DESIGN-UNI-14: 3 practice questions). Question 3.5: Economic indicators. Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2025-nov-p1-l16.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2025-nov-p1-l16.js --dry-run
 *   node scripts/add-economics-2025-nov-p1-l16.js
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
  "name": "Question 3.5: Economic indicators",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2025,
  "paper": "nov_p1",
  "order": 16,
  "content_tier": "free",
  "has_video": false,
  "xp": 8,
  "tags": [
    "economic_indicators"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q16/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q16/memo_1.png"
  ],
  "exam_question_marks": 8,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Select ALL the changes in economic indicators that would show an improvement in the performance of an economy.",
    "metadata": [
      "An improvement in the terms of trade",
      "A rise in labour productivity",
      "A rise in the unemployment rate",
      "A widening current account deficit",
      "A fall in the consumer price index (CPI) inflation rate"
    ],
    "answer": [
      "A fall in the consumer price index (CPI) inflation rate",
      "An improvement in the terms of trade",
      "A rise in labour productivity",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "economic_and_social_indicators",
    "topic": "economic_performance_indicators",
    "subtopic": "econ_data_interpretation",
    "skills": [
      "interpret_economic_data"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- An improvement means lower living costs, better trade earnings or more output per worker.\n- Two options describe a worsening position."
  },
  {
    "name": "Question 2",
    "question": "A factory produced goods worth R2 400 000 using 120 workers. Calculate labour productivity as output per worker (in rand): []",
    "metadata": [
      "Output per worker (R): ",
      "[ ]"
    ],
    "answer": [
      "20000",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "type": "calc",
    "unit": "economic_and_social_indicators",
    "topic": "economic_performance_indicators",
    "subtopic": "econ_calculation",
    "skills": [
      "apply_economic_formula"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Productivity compares output with the quantity of labour used.\n- Divide total output by the number of workers."
  },
  {
    "name": "Question 3",
    "question": "A fall in the producer price index (PPI) is most likely to encourage producers to do what?",
    "metadata": [
      "Produce less, because their profits will certainly fall",
      "Raise their export prices to protect their profit margins",
      "Produce more, because their costs of production are lower",
      "Cut employment to protect the profits that they earn",
      ""
    ],
    "answer": [
      "Produce more, because their costs of production are lower",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "interpretation",
    "unit": "economic_and_social_indicators",
    "topic": "economic_performance_indicators",
    "subtopic": "econ_cause_and_effect",
    "skills": [
      "explain_economic_impact"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- The PPI measures what producers pay for inputs.\n- Lower costs change the profit incentive."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "3.5",
      "marks": 8,
      "clues": "- Give four developed points, each linking an indicator to better economic performance.\n- Avoid simply naming indicators, since mere listing is capped at 2 marks.",
      "approach": "- Choose indicators: prices, trade, employment, productivity, interest rates, exchange rates, money supply.\n- For each, say which direction of change is an improvement and why.",
      "solution": "1. A fall in the CPI means a lower cost of living, which supports demand; a fall in the PPI lowers production costs.\n2. Improved terms of trade means more export income to pay for imports and may reflect a current account surplus.\n3. A higher employment rate and higher labour productivity raise spending, tax revenue, efficiency and GDP.\n4. Lower interest rates stimulate spending and investment; a weaker exchange rate makes exports cheaper while a stronger one lowers import costs and inflation.\n5. An increase in the money supply expands credit and short-term spending."
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
