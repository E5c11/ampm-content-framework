#!/usr/bin/env node
/**
 * DBE Economics P2 — November 2025 — Question 4.3.4–4.3.5: Chemical waste and the Basel Convention (order 22)
 * Lesson 22 of 2025 Nov P2 (DESIGN-UNI-14: 3 practice questions). Question 4.3.4–4.3.5: Chemical waste and the Basel Convention. Fresh practice questions (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2025-nov-p2-l22.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2025-nov-p2-l22.js --dry-run
 *   node scripts/add-economics-2025-nov-p2-l22.js
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
  "name": "Question 4.3.4–4.3.5: Chemical waste and the Basel Convention",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2025,
  "paper": "nov_p2",
  "order": 22,
  "content_tier": "free",
  "has_video": false,
  "xp": 6,
  "tags": [
    "waste_management",
    "international_agreements"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p2/q22/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p2/q22/memo_1.png"
  ],
  "exam_question_marks": 6,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Select ALL the ways in which chemical waste can harm the environment.",
    "metadata": [
      "Insecticides and pesticides can kill animals and plants quickly",
      "Chemicals can soak into the ground and contaminate drinking water",
      "Animals may become infertile",
      "Chemical waste improves soil quality",
      "It has no effect on water"
    ],
    "answer": [
      "Insecticides and pesticides can kill animals and plants quickly",
      "Chemicals can soak into the ground and contaminate drinking water",
      "Animals may become infertile",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "environmental_sustainability",
    "topic": "waste_management",
    "subtopic": "econ_cause_and_effect",
    "skills": [
      "explain_economic_impact"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- Think about where chemicals end up and who is exposed."
  },
  {
    "name": "Question 2",
    "question": "Select ALL the ways in which the Basel Convention helps to manage hazardous waste.",
    "metadata": [
      "Parties may export hazardous waste only to parties that have not banned its import",
      "Parties may not trade hazardous waste with non-parties",
      "Parties must prevent exports if the waste will not be treated safely at its destination",
      "It allows dumping in any country",
      "It bans all waste production"
    ],
    "answer": [
      "Parties may export hazardous waste only to parties that have not banned its import",
      "Parties may not trade hazardous waste with non-parties",
      "Parties must prevent exports if the waste will not be treated safely at its destination",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "definition",
    "unit": "environmental_sustainability",
    "topic": "international_agreements",
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
    "clues": "- The convention controls the cross-border movement of hazardous waste."
  },
  {
    "name": "Question 3",
    "question": "A company wants to ship hazardous waste to a country that is not a party to the Basel Convention. What does the convention say about this?",
    "metadata": [
      "It is allowed if the company pays a fee",
      "It is allowed if the waste is labelled",
      "It is allowed for all chemical waste",
      "It is not allowed",
      ""
    ],
    "answer": [
      "It is not allowed",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "environmental_sustainability",
    "topic": "international_agreements",
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
    "clues": "- The convention restricts trade with countries outside it."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "4.3.4",
      "marks": 2,
      "clues": "- Think about animals, plants and water.",
      "approach": "- Give one clear impact.",
      "solution": "1. Chemical waste such as insecticides and pesticides can cause immediate death of plants and animals.\n2. It can soak into the ground and contaminate drinking water, and animals may become infertile."
    },
    {
      "number": "4.3.5",
      "marks": 4,
      "clues": "- Link the convention to controlling who may import and export waste.",
      "approach": "- Choose two features.\n- Explain each (2 x 2).",
      "solution": "1. Parties may export hazardous waste only to parties that have not banned imports of such waste.\n2. The convention does not allow parties to import from or export to non-parties.\n3. Parties must prevent exports if the waste will not be treated in an environmentally friendly way at its destination."
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
