#!/usr/bin/env node
/**
 * DBE Economics P1 — November 2025 — Question 4.2: Public sector failure (order 18)
 * Lesson 18 of the 2025 Nov P1 repair (DESIGN-UNI-14: 3 practice questions). Question 4.2: Public sector failure. Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2025-nov-p1-l18.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2025-nov-p1-l18.js --dry-run
 *   node scripts/add-economics-2025-nov-p1-l18.js
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
  "name": "Question 4.2: Public sector failure",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2025,
  "paper": "nov_p1",
  "order": 18,
  "content_tier": "free",
  "has_video": false,
  "xp": 4,
  "tags": [
    "public_sector_failure"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q18/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q18/memo_1.png"
  ],
  "exam_question_marks": 4,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "A cartoon shows officials ignoring a leaking water pipe while a sign on the wall reads \"Not my department\". Which factor that contributes to poor public sector provisioning does this illustrate?",
    "metadata": [
      "Excess competition between service providers",
      "Lack of accountability",
      "An oversupply of public goods",
      "Too many private suppliers",
      ""
    ],
    "answer": [
      "Lack of accountability",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "interpretation",
    "unit": "public_sector",
    "topic": "public_sector_failure",
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
    "clues": "- Ask who is taking responsibility for the problem in the picture.\n- Three options describe a surplus of providers, which is the opposite of what the sign shows."
  },
  {
    "name": "Question 2",
    "question": "A municipal park is open to everyone free of charge and is paid for through taxes and rates. Which type of public good is it?",
    "metadata": [
      "Quasi-public good",
      "Private good",
      "Community (collective) good",
      "Demerit good",
      ""
    ],
    "answer": [
      "Community (collective) good",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "public_sector",
    "topic": "public_goods_and_free_riders",
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
    "paper": "nov_p1",
    "clues": "- Focus on the fact that no one is charged to use it.\n- Goods for which users pay a fee fall in a different category."
  },
  {
    "name": "Question 3",
    "question": "Select ALL the signs of public sector failure.",
    "metadata": [
      "Public goods are supplied in too small a quantity",
      "The quality of the services delivered is poor",
      "Resources under government control are wasted",
      "Services are delivered on time and within budget",
      "Citizens report high satisfaction with delivery"
    ],
    "answer": [
      "Public goods are supplied in too small a quantity",
      "The quality of the services delivered is poor",
      "Resources under government control are wasted",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "definition",
    "unit": "public_sector",
    "topic": "public_sector_failure",
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
    "paper": "nov_p1",
    "clues": "- Failure means government does not manage its resources or duties well.\n- Two options describe success."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "4.2.1",
      "marks": 1,
      "clues": "- The factor appears as a label on the cartoon.",
      "approach": "- Read the labels on the picture.\n- Choose one that explains poor provisioning.",
      "solution": "1. The cartoon labels accountability as a factor contributing to poor public sector provisioning."
    },
    {
      "number": "4.2.2",
      "marks": 1,
      "clues": "- These goods are paid for through taxes and not charged to users.",
      "approach": "- Recall the type of public goods provided free.\n- Name them.",
      "solution": "1. Public goods supplied free of charge are community goods."
    },
    {
      "number": "4.2.3",
      "marks": 2,
      "clues": "- The government fails in managing its own resources and duties.",
      "approach": "- Define public sector failure.\n- Mention quantity or quality of provision.",
      "solution": "1. Public sector failure occurs when government fails to manage the economy and the resources under its control optimally.\n2. It also occurs when government fails to supply public goods in the desired quantity and quality."
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
