#!/usr/bin/env node
/**
 * DBE Economics P2 — November 2025 — Question 2.3.5 and 2.4: Subsidies and misallocation (order 9)
 * Lesson 9 of 2025 Nov P2 (DESIGN-UNI-14: 4 practice questions). Question 2.3.5 and 2.4: Subsidies and misallocation. Fresh practice questions (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2025-nov-p2-l09.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2025-nov-p2-l09.js --dry-run
 *   node scripts/add-economics-2025-nov-p2-l09.js
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
  "name": "Question 2.3.5 and 2.4: Subsidies and misallocation",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2025,
  "paper": "nov_p2",
  "order": 9,
  "content_tier": "free",
  "has_video": false,
  "xp": 12,
  "tags": [
    "subsidies",
    "market_failure",
    "externalities"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p2/q9/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p2/q9/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p2/q9/memo_2.png"
  ],
  "exam_question_marks": 12,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Select ALL the ways in which producer subsidies can benefit the economy.",
    "metadata": [
      "Fewer jobs are created because output falls overall",
      "Lower production costs may ease inflation",
      "Producers may be encouraged to produce more",
      "More jobs may be created as output grows",
      "Producers are forced to raise the prices of goods"
    ],
    "answer": [
      "Lower production costs may ease inflation",
      "Producers may be encouraged to produce more",
      "More jobs may be created as output grows",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "market_failures",
    "topic": "taxes_and_subsidies_on_production",
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
    "clues": "- A subsidy lowers the cost of producing.\n- One option describes the opposite effect on prices."
  },
  {
    "name": "Question 2",
    "question": "A clothing factory closes in one town while a new one opens in another, but most of the laid-off workers cannot move because of relocation costs and family ties. Which cause of misallocation of resources does this show?",
    "metadata": [
      "Lack of information about prices",
      "Immobility of factors of production",
      "Perfect competition in the labour market",
      "Excess demand for skilled labour",
      ""
    ],
    "answer": [
      "Immobility of factors of production",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "market_failures",
    "topic": "misallocation_of_resources",
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
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- The workers could do the job but cannot shift to where it is."
  },
  {
    "name": "Question 3",
    "question": "Select ALL the examples that show a lack of information in markets.",
    "metadata": [
      "Consumers do not know about a cheaper alternative",
      "A shop clearly publishes its prices for all customers",
      "All buyers and sellers know the price of every good",
      "Workers are unaware of better-paying jobs elsewhere",
      "Entrepreneurs lack information about input costs"
    ],
    "answer": [
      "Consumers do not know about a cheaper alternative",
      "Workers are unaware of better-paying jobs elsewhere",
      "Entrepreneurs lack information about input costs",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "market_failures",
    "topic": "misallocation_of_resources",
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
    "clues": "- Each correct example describes someone making a decision without the facts they need."
  },
  {
    "name": "Question 4",
    "question": "Arrange the chain of events from a producer subsidy to higher consumer spending.",
    "metadata": [
      "Producers supply more at lower prices",
      "Consumers pay lower prices and spend more",
      "Government pays a subsidy to producers",
      "Cost of production falls"
    ],
    "answer": [
      "Government pays a subsidy to producers",
      "Cost of production falls",
      "Producers supply more at lower prices",
      "Consumers pay lower prices and spend more"
    ],
    "presentation": "ordering",
    "type": "application",
    "unit": "market_failures",
    "topic": "taxes_and_subsidies_on_production",
    "subtopic": "econ_cause_and_effect",
    "skills": [
      "explain_economic_impact"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- Start with the subsidy and follow its effect through costs, supply and prices."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "2.3.5",
      "marks": 4,
      "clues": "- Give two developed effects of lower production costs.",
      "approach": "- Choose two effects.\n- Explain each (2 x 2).",
      "solution": "1. Producers incur lower costs, which may reduce inflation.\n2. Producers may be encouraged to produce more, stimulating growth.\n3. More output may create jobs and reduce unemployment.\n4. Consumers may pay lower prices and spend more."
    },
    {
      "number": "2.4",
      "marks": 8,
      "clues": "- Treat the two factors separately with two developed points each.\n- A bare list is capped at 4 marks.",
      "approach": "- Explain immobility of factors with examples such as labour and capital.\n- Explain lack of information for consumers, workers and entrepreneurs.",
      "solution": "1. Immobility: markets do not adjust quickly because labour needs retraining or must relocate, and physical capital cannot easily be moved.\n2. Technological change also takes time for industries to adapt to.\n3. Lack of information: consumers, workers and entrepreneurs often lack the facts needed for rational decisions.\n4. This can lead to productive inefficiency, such as entrepreneurs not knowing about costs or availability of factors."
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
