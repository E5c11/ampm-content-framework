#!/usr/bin/env node
/**
 * DBE Economics P2 — November 2025 — Question 6: Fiscal and other measures against inflation (order 30)
 * Lesson 30 of 2025 Nov P2 (DESIGN-UNI-14: 4 practice questions). Question 6: Fiscal and other measures against inflation. Fresh practice questions (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2025-nov-p2-l30.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2025-nov-p2-l30.js --dry-run
 *   node scripts/add-economics-2025-nov-p2-l30.js
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
  "name": "Question 6: Fiscal and other measures against inflation",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2025,
  "paper": "nov_p2",
  "order": 30,
  "content_tier": "free",
  "has_video": false,
  "xp": 12,
  "tags": [
    "fiscal_policy",
    "inflation_measures"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p2/q30/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p2/q30/memo_1.png"
  ],
  "exam_question_marks": 12,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Select ALL the fiscal policy measures that can reduce demand-pull inflation.",
    "metadata": [
      "Postponing government construction projects",
      "Raising personal income tax",
      "Raising indirect taxes such as VAT",
      "Introducing tax-free savings accounts",
      "Cutting company tax"
    ],
    "answer": [
      "Postponing government construction projects",
      "Raising personal income tax",
      "Raising indirect taxes such as VAT",
      "Introducing tax-free savings accounts",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "economics_inflation",
    "topic": "measures_to_combat_inflation",
    "subtopic": "econ_policy_evaluation",
    "skills": [
      "evaluate_economic_policy"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- Fiscal measures cut spending or raise taxes to reduce demand.\n- One option leaves more money with firms."
  },
  {
    "name": "Question 2",
    "question": "Select ALL the other measures that can help to combat inflation.",
    "metadata": [
      "Improving education and training to raise productivity",
      "Promoting competition at home and from abroad",
      "Imposing maximum prices on essential goods",
      "Implementing a wage policy to break the wage-price spiral",
      "Removing all taxes"
    ],
    "answer": [
      "Improving education and training to raise productivity",
      "Promoting competition at home and from abroad",
      "Imposing maximum prices on essential goods",
      "Implementing a wage policy to break the wage-price spiral",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "economics_inflation",
    "topic": "measures_to_combat_inflation",
    "subtopic": "econ_policy_evaluation",
    "skills": [
      "evaluate_economic_policy"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- Look for measures that lower costs, raise supply or control price rises."
  },
  {
    "name": "Question 3",
    "question": "Pensions, wages and mortgage rates are linked to a price index so that rising prices do not erode their value. What is this measure called?",
    "metadata": [
      "Moral suasion",
      "Privatisation",
      "Price control",
      "Indexation",
      ""
    ],
    "answer": [
      "Indexation",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "economics_inflation",
    "topic": "measures_to_combat_inflation",
    "subtopic": "econ_term_definition",
    "skills": [
      "define_economic_term"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- The linking is done to a published index."
  },
  {
    "name": "Question 4",
    "question": "Match each measure to the way it helps to control inflation.",
    "metadata": [
      "A - Maximum prices",
      "B - Stricter consumer credit rules",
      "C - Relaxing import controls",
      "D - Floating exchange rate",
      "1 - Keep essential goods affordable",
      "2 - Reduce credit-financed demand",
      "3 - Supplement local supply and cut input costs",
      "4 - Lets prices adjust to international conditions"
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
    "clues": "- Each measure acts on either demand, supply or price setting."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "6",
      "marks": 12,
      "clues": "- Cover fiscal policy first, then the other measures.\n- Headings and examples can earn at most 8 of the 26 main-part marks.",
      "approach": "- Explain government spending and taxation measures.\n- Add productivity, competition, price control, wage policy, credit rules, import controls, exchange rates, lower business costs and indexation.",
      "solution": "1. Fiscal policy: postponing projects, raising direct or indirect taxes, surcharges, loan levies and incentives to save reduce demand.\n2. Productivity and competition: education, technology and domestic or foreign competition lower costs and prices.\n3. Price controls, a wage policy and stricter consumer credit rules limit price and credit growth.\n4. Relaxing import controls, a floating exchange rate, lower business costs and indexation further reduce inflation (max 26 with the monetary part)."
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
