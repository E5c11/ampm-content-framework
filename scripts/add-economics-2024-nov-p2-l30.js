#!/usr/bin/env node
/**
 * DBE Economics P2 — November 2024 — Question 6: Sustainability — property rights, charges, taxes and subsidies (order 30)
 * Lesson 30 of 2024 Nov P2 (DESIGN-UNI-14: 4 practice questions). Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2024-nov-p2-l30.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2024-nov-p2-l30.js --dry-run
 *   node scripts/add-economics-2024-nov-p2-l30.js
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
  "name": "Question 6: Sustainability — property rights, charges, taxes and subsidies",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2024,
  "paper": "nov_p2",
  "order": 30,
  "content_tier": "free",
  "has_video": false,
  "xp": 10,
  "tags": [
    "sustainable_development",
    "environmental_taxes",
    "property_rights"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p2/q30/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p2/q30/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p2/q30/memo_2.png"
  ],
  "exam_question_marks": 13,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "The government sets a tax on each tonne of carbon a factory releases. Which measure to protect the environment is this?",
    "metadata": [
      "a marketable permit",
      "an environmental tax",
      "a voluntary agreement",
      "a property right",
      ""
    ],
    "answer": [
      "an environmental tax",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "environmental_sustainability",
    "topic": "environmental_policy_instruments",
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
    "paper": "nov_p2",
    "clues": "- The government raises the cost of the polluting activity through the price."
  },
  {
    "name": "Question 2",
    "question": "Select ALL the ways in which property rights can help to protect the environment.",
    "metadata": [
      "People take care of resources that belong to them",
      "They promote collective responsibility",
      "They allow anyone to use a resource freely",
      "They can prevent over-exploitation",
      "They remove all rules about resource use"
    ],
    "answer": [
      "People take care of resources that belong to them",
      "They promote collective responsibility",
      "They can prevent over-exploitation",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "environmental_sustainability",
    "topic": "environmental_policy_instruments",
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
    "paper": "nov_p2",
    "clues": "- Think about how owners treat what they own."
  },
  {
    "name": "Question 3",
    "question": "Match each measure to its example.",
    "metadata": [
      "A - Charge for the use of the environment",
      "B - Environmental tax",
      "C - Environmental subsidy",
      "1 - Carbon tax on emissions",
      "2 - Solar geyser payments to households",
      "3 - Local charges for garbage collection and sewage disposal"
    ],
    "answer": [
      "A-3",
      "B-1",
      "C-2"
    ],
    "presentation": "match",
    "type": "application",
    "unit": "environmental_sustainability",
    "topic": "environmental_policy_instruments",
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
    "clues": "- Match each to who pays: the user, the polluter or the government."
  },
  {
    "name": "Question 4",
    "question": "Environmental subsidies are mainly given to:",
    "metadata": [
      "reward firms that pollute the most",
      "raise revenue for the government",
      "encourage cleaner technology",
      "ban imported goods from abroad",
      ""
    ],
    "answer": [
      "encourage cleaner technology",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "environmental_sustainability",
    "topic": "environmental_policy_instruments",
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
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- A subsidy is a payment from the government to encourage an activity."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "6",
      "marks": 13,
      "clues": "- Cover property rights, charges for using the environment, environmental taxes and environmental subsidies.",
      "approach": "- Explain each in full sentences; at most 8 of the 26 marks may be given for headings and examples.",
      "solution": "1. Property rights give a conservation effect and prevent over-exploitation.\n2. Charges for waste and emissions make users pay in proportion to what they discard; local authorities charge for garbage collection and sewage.\n3. Environmental taxes, such as the carbon tax, reduce harmful practices and the income can be used for environmental issues.\n4. Subsidies encourage new technology, environmentally friendly substitutes, recycling and cleaner energy."
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
