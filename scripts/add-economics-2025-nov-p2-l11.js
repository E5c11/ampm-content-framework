#!/usr/bin/env node
/**
 * DBE Economics P2 — November 2025 — Question 3.1: Environmental standards and tourism jobs (order 11)
 * Lesson 11 of 2025 Nov P2 (DESIGN-UNI-14: 3 practice questions). Question 3.1: Environmental standards and tourism jobs. Fresh practice questions (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2025-nov-p2-l11.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2025-nov-p2-l11.js --dry-run
 *   node scripts/add-economics-2025-nov-p2-l11.js
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
  "name": "Question 3.1: Environmental standards and tourism jobs",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2025,
  "paper": "nov_p2",
  "order": 11,
  "content_tier": "free",
  "has_video": false,
  "xp": 4,
  "tags": [
    "environmental_policy",
    "tourism"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p2/q11/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p2/q11/memo_1.png"
  ],
  "exam_question_marks": 4,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Select ALL the approaches used in command-and-control systems to ensure environmental sustainability.",
    "metadata": [
      "Marketable permits",
      "Quality standards",
      "Quantity standards",
      "Carbon taxes",
      "Social impact standards"
    ],
    "answer": [
      "Quality standards",
      "Quantity standards",
      "Social impact standards",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "definition",
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
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- Command-and-control means government sets rules; the other approach uses prices and trading.\n- Two options are market-based instruments."
  },
  {
    "name": "Question 2",
    "question": "Why is the tourism industry regarded as labour-intensive?",
    "metadata": [
      "It uses mostly automated machines to serve guests",
      "It relies on human interaction and personal service",
      "It requires very expensive capital equipment everywhere",
      "It employs only highly skilled and trained professionals",
      ""
    ],
    "answer": [
      "It relies on human interaction and personal service",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "tourism",
    "topic": "tourism_benefits_and_policy",
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
    "clues": "- Think about what guests actually experience: staff serving them."
  },
  {
    "name": "Question 3",
    "question": "A government sets a maximum amount of a pollutant that any factory may release into a river. Which type of instrument is this?",
    "metadata": [
      "A marketable permit traded between factories",
      "A carbon tax on every unit of emissions",
      "A quantity standard under command and control",
      "A subsidy paid to the cleanest factory",
      ""
    ],
    "answer": [
      "A quantity standard under command and control",
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
    "order": 3,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- The rule limits the quantity of something and everyone must obey it."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "3.1.1",
      "marks": 2,
      "clues": "- These approaches set rules that firms must obey.",
      "approach": "- Recall the command-and-control standards.\n- Name any two.",
      "solution": "1. Examples are quality standards, quantity standards and social impact standards."
    },
    {
      "number": "3.1.2",
      "marks": 2,
      "clues": "- Consider how much of tourism depends on people serving people.",
      "approach": "- Link tourism activities to employment.\n- Add the number of jobs per unit of capital.",
      "solution": "1. Tourism requires a large workforce because it involves human interaction and personal services.\n2. It creates many jobs, in the formal and informal sectors, for each unit of capital invested."
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
