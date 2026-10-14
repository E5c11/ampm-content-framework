#!/usr/bin/env node
/**
 * DBE Economics P2 — November 2025 — Question 2.5: Normal profit in the long run (order 10)
 * Lesson 10 of 2025 Nov P2 (DESIGN-UNI-14: 3 practice questions). Question 2.5: Normal profit in the long run. Fresh practice questions (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2025-nov-p2-l10.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2025-nov-p2-l10.js --dry-run
 *   node scripts/add-economics-2025-nov-p2-l10.js
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
  "name": "Question 2.5: Normal profit in the long run",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2025,
  "paper": "nov_p2",
  "order": 10,
  "content_tier": "free",
  "has_video": false,
  "xp": 8,
  "tags": [
    "perfect_competition",
    "profit_maximisation"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p2/q10/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p2/q10/memo_1.png"
  ],
  "exam_question_marks": 8,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Arrange the long-run adjustment of a perfectly competitive market after firms make economic profit.",
    "metadata": [
      "Economic profit falls until only normal profit remains",
      "New firms enter because there are no barriers",
      "Firms earn economic profit in the short run",
      "Market supply increases and the price falls"
    ],
    "answer": [
      "Firms earn economic profit in the short run",
      "New firms enter because there are no barriers",
      "Market supply increases and the price falls",
      "Economic profit falls until only normal profit remains"
    ],
    "presentation": "ordering",
    "type": "application",
    "unit": "perfect_markets",
    "topic": "perfect_competition_profit_loss",
    "subtopic": "econ_cause_and_effect",
    "skills": [
      "explain_economic_impact"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- The profit attracts newcomers, and newcomers change supply."
  },
  {
    "name": "Question 2",
    "question": "What happens in a perfectly competitive market when existing firms are making economic profit?",
    "metadata": [
      "Existing firms agree to raise their prices together",
      "The government sets a limit on the profit they earn",
      "Firms leave the market because profit is too high",
      "New firms enter the market because entry is free",
      ""
    ],
    "answer": [
      "New firms enter the market because entry is free",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "perfect_markets",
    "topic": "perfect_competition_profit_loss",
    "subtopic": "econ_cause_and_effect",
    "skills": [
      "explain_economic_impact"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- Think about what freedom of entry allows outsiders to do."
  },
  {
    "name": "Question 3",
    "question": "Select ALL the statements that describe a perfectly competitive firm in long-run equilibrium.",
    "metadata": [
      "The firm earns normal profit only",
      "The firm earns large economic profit",
      "Total revenue equals total cost",
      "There is an incentive to enter the market",
      "Average revenue equals average cost"
    ],
    "answer": [
      "Average revenue equals average cost",
      "Total revenue equals total cost",
      "The firm earns normal profit only",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "definition",
    "unit": "perfect_markets",
    "topic": "perfect_competition_profit_loss",
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
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- In the long run, entry and exit remove economic profit and economic loss."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "2.5",
      "marks": 8,
      "clues": "- The answer is a process of entry and exit, not a single fact.\n- Mere listing earns at most 2 marks.",
      "approach": "- Start with economic profit and free entry.\n- Show the effect on supply, price and profit.\n- Add the effect of economic loss and exit.\n- Finish with the long-run condition.",
      "solution": "1. Without barriers to entry, new firms enter when existing firms earn economic profit.\n2. Market supply increases, so the price decreases and profits fall until AR = AC (TR = TC).\n3. Firms making economic losses leave, supply falls and the price rises, reducing losses.\n4. In the long run all firms earn only normal profit because entry and exit stop once there is no incentive."
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
