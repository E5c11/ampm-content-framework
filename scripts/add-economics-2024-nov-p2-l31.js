#!/usr/bin/env node
/**
 * DBE Economics P2 — November 2024 — Question 6: Sustainability — permits, regulation, agreements and education (order 31)
 * Lesson 31 of 2024 Nov P2 (DESIGN-UNI-14: 3 practice questions). Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2024-nov-p2-l31.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2024-nov-p2-l31.js --dry-run
 *   node scripts/add-economics-2024-nov-p2-l31.js
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
  "name": "Question 6: Sustainability — permits, regulation, agreements and education",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2024,
  "paper": "nov_p2",
  "order": 31,
  "content_tier": "free",
  "has_video": false,
  "xp": 8,
  "tags": [
    "sustainable_development",
    "marketable_permits",
    "command_and_control"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p2/q31/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p2/q31/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p2/q31/memo_2.png"
  ],
  "exam_question_marks": 13,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "The government sells licences that allow businesses to pollute up to a set limit, and firms may trade them. Which measure is this?",
    "metadata": [
      "command and control",
      "voluntary agreements",
      "marketable permits",
      "environmental education",
      ""
    ],
    "answer": [
      "marketable permits",
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
    "clues": "- The licences can be bought and sold between businesses."
  },
  {
    "name": "Question 2",
    "question": "Select ALL the features of command and control (CAC) regulation.",
    "metadata": [
      "Firms decide freely whether to obey",
      "The government sets maximum emission limits",
      "Inspectors monitor businesses",
      "Fines are imposed if limits are exceeded",
      "The measure relies only on persuasion"
    ],
    "answer": [
      "The government sets maximum emission limits",
      "Inspectors monitor businesses",
      "Fines are imposed if limits are exceeded",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "definition",
    "unit": "environmental_sustainability",
    "topic": "environmental_policy_instruments",
    "subtopic": "econ_term_definition",
    "skills": [
      "define_economic_term"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Think of rules, checks and penalties."
  },
  {
    "name": "Question 3",
    "question": "Match each measure to its main idea.",
    "metadata": [
      "A - Voluntary agreements",
      "B - Education",
      "C - Marketable permits",
      "D - Command and control",
      "1 - Government sets standards and fines offenders",
      "2 - Awareness changes attitudes towards the environment",
      "3 - Businesses negotiate arrangements with government",
      "4 - Businesses with low pollution sell part of their permits"
    ],
    "answer": [
      "A-3",
      "B-2",
      "C-4",
      "D-1"
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
    "clues": "- One measure uses trading, one uses rules, one uses negotiation and one uses awareness."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "6",
      "marks": 13,
      "clues": "- Cover marketable permits, command and control, voluntary agreements and education.",
      "approach": "- Explain each in full sentences; at most 8 of the 26 marks may be given for headings and examples.",
      "solution": "1. Marketable permits cap pollution in an area and low polluters can sell unused permits to high polluters.\n2. Command and control sets legal limits enforced by inspectors, with quantity, quality and social-impact standards.\n3. Voluntary agreements are negotiated between government and business and secure commitment.\n4. Education creates awareness and changes attitudes towards the environment."
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
