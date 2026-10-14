#!/usr/bin/env node
/**
 * DBE Economics P2 — November 2025 — Question 6: Monetary measures against inflation (order 29)
 * Lesson 29 of 2025 Nov P2 (DESIGN-UNI-14: 4 practice questions). Question 6: Monetary measures against inflation. Fresh practice questions (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2025-nov-p2-l29.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2025-nov-p2-l29.js --dry-run
 *   node scripts/add-economics-2025-nov-p2-l29.js
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
  "name": "Question 6: Monetary measures against inflation",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2025,
  "paper": "nov_p2",
  "order": 29,
  "content_tier": "free",
  "has_video": false,
  "xp": 14,
  "tags": [
    "monetary_policy",
    "inflation_measures"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p2/q29/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p2/q29/memo_1.png"
  ],
  "exam_question_marks": 14,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Arrange the chain through which a higher repo rate reduces demand-pull inflation.",
    "metadata": [
      "Credit and consumer spending fall",
      "The SARB raises the repo rate",
      "Demand-pull inflation eases",
      "Banks raise their lending rates"
    ],
    "answer": [
      "The SARB raises the repo rate",
      "Banks raise their lending rates",
      "Credit and consumer spending fall",
      "Demand-pull inflation eases"
    ],
    "presentation": "ordering",
    "type": "application",
    "unit": "economics_inflation",
    "topic": "measures_to_combat_inflation",
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
    "clues": "- Start with the decision of the central bank and follow the effect to prices."
  },
  {
    "name": "Question 2",
    "question": "Select ALL the monetary policy measures the SARB can use to combat inflation.",
    "metadata": [
      "Raising the repo rate",
      "Open market operations",
      "Moral suasion",
      "Raising the VAT rate",
      "Raising cash reserve requirements"
    ],
    "answer": [
      "Raising the repo rate",
      "Open market operations",
      "Raising cash reserve requirements",
      "Moral suasion",
      ""
    ],
    "presentation": "multi_select",
    "type": "definition",
    "unit": "economics_inflation",
    "topic": "measures_to_combat_inflation",
    "subtopic": "econ_classification",
    "skills": [
      "classify_economic_concept"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- Monetary policy is run by the central bank.\n- One option is a tax decision by the Minister of Finance."
  },
  {
    "name": "Question 3",
    "question": "The SARB sells government securities to commercial banks. What happens to the money supply?",
    "metadata": [
      "It doubles",
      "It increases",
      "It stays the same",
      "It decreases",
      ""
    ],
    "answer": [
      "It decreases",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "economics_inflation",
    "topic": "measures_to_combat_inflation",
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
    "paper": "nov_p2",
    "clues": "- Banks pay money to the SARB when they buy the securities."
  },
  {
    "name": "Question 4",
    "question": "Match each monetary measure to how it works.",
    "metadata": [
      "A - Repo rate increase",
      "B - Cash reserve requirement",
      "C - Moral suasion",
      "D - Open market operations",
      "1 - Makes borrowing more expensive",
      "2 - Limits how much banks can lend",
      "3 - Persuades banks to grant credit responsibly",
      "4 - Buying or selling government securities to change money supply"
    ],
    "answer": [
      "A-1",
      "B-2",
      "C-3",
      "D-4"
    ],
    "presentation": "match",
    "type": "definition",
    "unit": "economics_inflation",
    "topic": "measures_to_combat_inflation",
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
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- Each measure works through a different channel on credit or the money supply."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "6",
      "marks": 14,
      "clues": "- Plan the measures under headings: monetary first.\n- Headings and examples can earn at most 8 of the 26 main-part marks.",
      "approach": "- Define inflation targeting, then cover interest rates, open market operations, cash reserve requirements and moral suasion.\n- Explain how each reduces spending.",
      "solution": "1. Monetary policy is run by the SARB within an inflation target of 3-6%.\n2. A higher repo rate raises borrowing costs, reduces credit and consumer spending and the money supply, and helps stabilise the currency.\n3. Selling securities in open market operations reduces money supply and aggregate demand.\n4. Higher cash reserve requirements limit credit, and moral suasion persuades banks to lend responsibly."
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
