#!/usr/bin/env node
/**
 * DBE Economics P1 — November 2024 — Question 3.2.1–3.2.3: Industrial development strategies (order 12)
 * Lesson 12 of 2024 Nov P1 (DESIGN-UNI-14: 4 practice questions). Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2024-nov-p1-l12.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2024-nov-p1-l12.js --dry-run
 *   node scripts/add-economics-2024-nov-p1-l12.js
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
  "name": "Question 3.2.1–3.2.3: Industrial development strategies",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2024,
  "paper": "nov_p1",
  "order": 12,
  "content_tier": "free",
  "has_video": false,
  "xp": 10,
  "tags": [
    "industrial_strategy",
    "industrial_incentives"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p1/q12/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p1/q12/memo_1.png"
  ],
  "exam_question_marks": 4,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "In an illustrative extract, a country raises its target for spending on research and innovation. Which South African industrial strategy aims to encourage this?",
    "metadata": [
      "Reconstruction and Development Programme (RDP)",
      "National Research and Development Strategy (NRDS)",
      "Growth, Employment and Redistribution strategy (GEAR)",
      "National Housing Strategy (NHS)",
      ""
    ],
    "answer": [
      "National Research and Development Strategy (NRDS)",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "interpretation",
    "unit": "growth_and_development",
    "topic": "industrial_policy",
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
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Look for the strategy whose name refers to research."
  },
  {
    "name": "Question 2",
    "question": "Match each government body to its main role.",
    "metadata": [
      "A - Department of Trade, Industry and Competition",
      "B - National Treasury",
      "C - Department of Employment and Labour",
      "1 - Managing the budget and tax policy",
      "2 - Regulating working conditions and labour relations",
      "3 - Promoting industrial development, trade and competition"
    ],
    "answer": [
      "A-3",
      "B-1",
      "C-2"
    ],
    "presentation": "match",
    "type": "definition",
    "unit": "growth_and_development",
    "topic": "industrial_policy",
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
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Match by the word in each name: trade and industry, finance and tax, labour and employment."
  },
  {
    "name": "Question 3",
    "question": "Which example is a duty-free incentive?",
    "metadata": [
      "A clothing maker is charged extra customs duty on its imported sewing machines",
      "A clothing maker imports sewing machines without paying customs duties",
      "A clothing maker receives a ban on exporting its clothes to other countries",
      "A clothing maker pays a higher company tax rate because it has expanded",
      ""
    ],
    "answer": [
      "A clothing maker imports sewing machines without paying customs duties",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "growth_and_development",
    "topic": "industrial_incentives",
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
    "paper": "nov_p1",
    "clues": "- Duty means customs duty on imports.\n- The incentive removes a cost for the local producer."
  },
  {
    "name": "Question 4",
    "question": "Select ALL the incentives government can use to promote industrial development.",
    "metadata": [
      "Higher taxes on new factories",
      "Tax allowances for new equipment",
      "Duty-free imports of production inputs",
      "Cash grants for new factories",
      "A ban on local production"
    ],
    "answer": [
      "Tax allowances for new equipment",
      "Duty-free imports of production inputs",
      "Cash grants for new factories",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "definition",
    "unit": "growth_and_development",
    "topic": "industrial_incentives",
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
    "paper": "nov_p1",
    "clues": "- An incentive lowers a cost or adds support for businesses that set up or expand."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "3.2.1",
      "marks": 1,
      "clues": "- Look for the strategy about the competitiveness of manufacturing.",
      "approach": "- Identify one strategy from the extract.",
      "solution": "The Integrated Manufacturing Strategy (IMS) aims to improve the competitiveness of the manufacturing sector."
    },
    {
      "number": "3.2.2",
      "marks": 1,
      "clues": "- Think of the national department for trade and industry.",
      "approach": "- Name the department.",
      "solution": "The Department of Trade, Industry and Competition (DTIC)."
    },
    {
      "number": "3.2.3",
      "marks": 2,
      "clues": "- Think about importing production inputs without customs duties.",
      "approach": "- Describe the term in one sentence.",
      "solution": "Duty-free incentives are initiatives by the government that allow local businesses to import production inputs without paying customs duties."
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
