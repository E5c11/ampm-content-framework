#!/usr/bin/env node
/**
 * DBE Economics P1 — November 2025 — Question 3.3: Trade agreements and dumping (order 14)
 * Lesson 14 of the 2025 Nov P1 repair (DESIGN-UNI-14: 3 practice questions). Question 3.3: Trade agreements and dumping. Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2025-nov-p1-l14.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2025-nov-p1-l14.js --dry-run
 *   node scripts/add-economics-2025-nov-p1-l14.js
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
  "name": "Question 3.3: Trade agreements and dumping",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2025,
  "paper": "nov_p1",
  "order": 14,
  "content_tier": "free",
  "has_video": false,
  "xp": 10,
  "tags": [
    "trade_policy",
    "international_organisations"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q14/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q14/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q14/memo_2.png"
  ],
  "exam_question_marks": 10,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Match each international body or agreement to its role.",
    "metadata": [
      "A - World Trade Organisation (WTO)",
      "B - Southern African Development Community (SADC)",
      "C - African Growth and Opportunity Act (AGOA)",
      "D - Southern African Customs Union (SACU)",
      "1 - Facilitates free trade between its member countries",
      "2 - Regional community aiming to develop Southern Africa’s economy and society",
      "3 - Gives eligible African exports duty-free access to the US market",
      "4 - Customs agreement between some Southern African states"
    ],
    "answer": [
      "A-1",
      "B-2",
      "C-3",
      "D-4"
    ],
    "presentation": "match",
    "type": "definition",
    "unit": "protection_and_free_trade",
    "topic": "trade_agreements",
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
    "clues": "- Two of the four are regional arrangements and one is a worldwide body.\n- One is an American law."
  },
  {
    "name": "Question 2",
    "question": "A government removes tariffs and quotas on imported fabric so that cloth can flow freely across its borders. What is this policy called?",
    "metadata": [
      "Protectionism",
      "Trade liberalisation",
      "Import substitution",
      "Dumping",
      ""
    ],
    "answer": [
      "Trade liberalisation",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "protection_and_free_trade",
    "topic": "free_trade_arguments",
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
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- The measures described reduce barriers rather than raising them."
  },
  {
    "name": "Question 3",
    "question": "Select ALL the ways in which dumping can harm producers in an importing country.",
    "metadata": [
      "They may cut prices, which squeezes profit margins",
      "Demand for their goods rises sharply as imports arrive",
      "They can raise prices because competition has fallen",
      "They may be forced to shut down as demand collapses",
      "They face unfair competition from very cheap imports"
    ],
    "answer": [
      "They face unfair competition from very cheap imports",
      "They may be forced to shut down as demand collapses",
      "They may cut prices, which squeezes profit margins",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "protection_and_free_trade",
    "topic": "tariffs_and_trade_barriers",
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
    "clues": "- Dumping means exporting goods at very low prices.\n- Local producers cannot easily compete with those prices."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "3.3.1",
      "marks": 1,
      "clues": "- The protocol is named in the extract itself.",
      "approach": "- Scan the extract for the protocol about regional development.\n- Write its name.",
      "solution": "1. The protocol aimed at reconstructing and developing Southern Africa’s social and economic framework is the Southern African Development Community (SADC)."
    },
    {
      "number": "3.3.2",
      "marks": 1,
      "clues": "- The body administers world trade rules.",
      "approach": "- Recall the organisation for free trade.\n- Name it in full.",
      "solution": "1. The international organisation that facilitates free trade is the World Trade Organisation (WTO)."
    },
    {
      "number": "3.3.3",
      "marks": 2,
      "clues": "- The term describes what happens to barriers to trade.",
      "approach": "- Define the term in one or two sentences.\n- Mention the barriers removed.",
      "solution": "1. Trade liberalisation is the removal of government intervention in trade flows on both imports and exports.\n2. It removes restrictions such as tariffs and quotas to allow goods and services to flow freely between countries."
    },
    {
      "number": "3.3.4",
      "marks": 2,
      "clues": "- Think about what AGOA does for exporters selling to the United States.",
      "approach": "- State one benefit clearly.\n- Add its effect on producers or jobs.",
      "solution": "1. Local producers enjoy duty-free access to the US market, which makes their exports more competitive.\n2. AGOA also promotes industrial growth and diversification, and more exports may create jobs."
    },
    {
      "number": "3.3.5",
      "marks": 4,
      "clues": "- Think about how very cheap foreign goods affect local sellers.",
      "approach": "- Choose two effects.\n- Explain each with its consequence (2 x 2).",
      "solution": "1. Local producers face unfair competition because foreign enterprises sell at very low prices.\n2. Demand for local goods falls, and producers may be forced to close down.\n3. Producers may have to match the lower prices, which reduces their profit margins."
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
