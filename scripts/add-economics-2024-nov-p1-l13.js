#!/usr/bin/env node
/**
 * DBE Economics P1 — November 2024 — Question 3.2.4–3.2.5: Corridors and research strategy (order 13)
 * Lesson 13 of 2024 Nov P1 (DESIGN-UNI-14: 3 practice questions). Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2024-nov-p1-l13.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2024-nov-p1-l13.js --dry-run
 *   node scripts/add-economics-2024-nov-p1-l13.js
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
  "name": "Question 3.2.4–3.2.5: Corridors and research strategy",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2024,
  "paper": "nov_p1",
  "order": 13,
  "content_tier": "free",
  "has_video": false,
  "xp": 8,
  "tags": [
    "corridors",
    "industrial_strategy",
    "regional_development"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p1/q13/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p1/q13/memo_1.png"
  ],
  "exam_question_marks": 6,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "How do development corridors promote regional development?",
    "metadata": [
      "They make a region less attractive to investors from abroad",
      "They keep businesses inside a single town and block new roads",
      "They stop mining, farming and factories from using the same routes",
      "They link resource-rich areas to markets and attract investment",
      ""
    ],
    "answer": [
      "They link resource-rich areas to markets and attract investment",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "growth_and_development",
    "topic": "regional_development",
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
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- A corridor is a transport and development route between areas.\n- Think about what the route allows firms and investors to do."
  },
  {
    "name": "Question 2",
    "question": "Select ALL the ways in which South African businesses can benefit from the National Research and Development Strategy (NRDS).",
    "metadata": [
      "They are pushed to cut their spending on research and development",
      "They can use new techniques that lower average cost",
      "They can produce more because productivity is higher",
      "They can make better products and gain an edge",
      "They must pay higher prices for all of their inputs"
    ],
    "answer": [
      "They can use new techniques that lower average cost",
      "They can produce more because productivity is higher",
      "They can make better products and gain an edge",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "growth_and_development",
    "topic": "industrial_policy",
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
    "clues": "- Research and innovation change how goods are made.\n- Think about cost, output and quality."
  },
  {
    "name": "Question 3",
    "question": "Arrange the benefits of innovation to a business in the order in which they follow one another.",
    "metadata": [
      "Productivity and output rise",
      "Average cost falls and profit increases",
      "The strategy promotes research and innovation",
      "Firms adopt new production techniques"
    ],
    "answer": [
      "The strategy promotes research and innovation",
      "Firms adopt new production techniques",
      "Productivity and output rise",
      "Average cost falls and profit increases"
    ],
    "presentation": "ordering",
    "type": "ordering",
    "unit": "growth_and_development",
    "topic": "industrial_policy",
    "subtopic": "econ_policy_evaluation",
    "skills": [
      "evaluate_economic_policy"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Begin with the strategy, then the change in production, then its effect on output, then on cost and profit."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "3.2.4",
      "marks": 2,
      "clues": "- Think about access, urbanisation and investment.",
      "approach": "- Give one developed point.",
      "solution": "1. Corridors give mining, agriculture and manufacturing access from one area to another.\n2. They promote efficient urbanisation and make regions more attractive to investors. Any other correct relevant response is accepted."
    },
    {
      "number": "3.2.5",
      "marks": 4,
      "clues": "- Think about innovation, productivity, quality and profit.",
      "approach": "- Give two developed points of 2 marks each.",
      "solution": "1. Innovation lets businesses use new techniques that are more efficient and lower their average cost.\n2. Higher productivity allows more output to satisfy demand.\n3. Better quality products give a competitive advantage, especially on global markets.\n4. Lower cost and higher output may increase profitability. Any other correct relevant response is accepted."
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
