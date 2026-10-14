#!/usr/bin/env node
/**
 * DBE Economics P2 — November 2025 — Question 3.2.4–3.2.5: PPPs and natural disasters (order 13)
 * Lesson 13 of 2025 Nov P2 (DESIGN-UNI-14: 3 practice questions). Question 3.2.4–3.2.5: PPPs and natural disasters. Fresh practice questions (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2025-nov-p2-l13.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2025-nov-p2-l13.js --dry-run
 *   node scripts/add-economics-2025-nov-p2-l13.js
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
  "name": "Question 3.2.4–3.2.5: PPPs and natural disasters",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2025,
  "paper": "nov_p2",
  "order": 13,
  "content_tier": "free",
  "has_video": false,
  "xp": 6,
  "tags": [
    "tourism",
    "tourism_infrastructure"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p2/q13/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p2/q13/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p2/q13/memo_2.png"
  ],
  "exam_question_marks": 6,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Select ALL the reasons why public-private partnerships (PPPs) matter in developing tourist destinations.",
    "metadata": [
      "Government and business share resources and costs",
      "Government can fund infrastructure while business funds tourism ventures",
      "The public sector can give incentives for tourism investment",
      "Government does all the work alone",
      "Private firms receive no support"
    ],
    "answer": [
      "Government and business share resources and costs",
      "Government can fund infrastructure while business funds tourism ventures",
      "The public sector can give incentives for tourism investment",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "tourism",
    "topic": "tourism_benefits_and_policy",
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
    "clues": "- A partnership means two sides each contribute something.\n- Two options describe a single party acting alone."
  },
  {
    "name": "Question 2",
    "question": "Select ALL the ways in which natural disasters can harm the tourism industry.",
    "metadata": [
      "Floods and cyclones create unfavourable conditions for activities",
      "Damaged infrastructure discourages visitors",
      "Wildlife, beaches and cultural sites may be lost",
      "More tourists are attracted by damaged sites",
      "Tourism income rises as a result"
    ],
    "answer": [
      "Floods and cyclones create unfavourable conditions for activities",
      "Damaged infrastructure discourages visitors",
      "Wildlife, beaches and cultural sites may be lost",
      "",
      ""
    ],
    "presentation": "multi_select",
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
    "clues": "- Consider what visitors come to see and how they get there.\n- Two options describe a gain."
  },
  {
    "name": "Question 3",
    "question": "A municipality builds access roads and water supply to a new lagoon resort, and a private company builds and runs the hotel. What is this arrangement called?",
    "metadata": [
      "A cartel",
      "Nationalisation",
      "A public-private partnership",
      "A subsidy-only scheme",
      ""
    ],
    "answer": [
      "A public-private partnership",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "tourism",
    "topic": "tourism_benefits_and_policy",
    "subtopic": "econ_classification",
    "skills": [
      "classify_economic_concept"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- Count how many different kinds of owner share the project."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "3.2.4",
      "marks": 2,
      "clues": "- Think about sharing costs and complementary contributions.",
      "approach": "- Give one clear importance.\n- Link it to infrastructure or investment.",
      "solution": "1. PPPs allow the government and private businesses to share resources and costs.\n2. Government may provide capital for infrastructure while business provides capital for tourism ventures, and government may offer incentives."
    },
    {
      "number": "3.2.5",
      "marks": 4,
      "clues": "- Link natural disasters to conditions, infrastructure and attractions.",
      "approach": "- Give two distinct effects.\n- Explain each (2 x 2).",
      "solution": "1. Floods and cyclones create unfavourable conditions for tourism activities.\n2. Damaged infrastructure may discourage people from visiting.\n3. Disasters can destroy wildlife, beaches, forests and cultural sites, reducing tourism."
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
