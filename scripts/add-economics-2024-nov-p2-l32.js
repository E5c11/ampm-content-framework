#!/usr/bin/env node
/**
 * DBE Economics P2 — November 2024 — Question 6: International measures to reduce environmental problems (order 32)
 * Lesson 32 of 2024 Nov P2 (DESIGN-UNI-14: 3 practice questions). Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2024-nov-p2-l32.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2024-nov-p2-l32.js --dry-run
 *   node scripts/add-economics-2024-nov-p2-l32.js
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
  "name": "Question 6: International measures to reduce environmental problems",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2024,
  "paper": "nov_p2",
  "order": 32,
  "content_tier": "free",
  "has_video": false,
  "xp": 8,
  "tags": [
    "international_agreements",
    "sustainable_development"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p2/q32/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p2/q32/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2024/nov_p2/q32/memo_2.png"
  ],
  "exam_question_marks": 10,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Match each international agreement to its purpose.",
    "metadata": [
      "A - CITES",
      "B - Basel Convention",
      "C - Kyoto Protocol",
      "D - Paris Agreement",
      "1 - Controls the disposal of hazardous waste",
      "2 - Limits global warming to well below 2°C",
      "3 - Bans commercial trade in endangered species",
      "4 - Sets binding greenhouse gas targets for developed countries"
    ],
    "answer": [
      "A-3",
      "B-1",
      "C-4",
      "D-2"
    ],
    "presentation": "match",
    "type": "definition",
    "unit": "environmental_sustainability",
    "topic": "international_agreements",
    "subtopic": "econ_term_definition",
    "skills": [
      "define_economic_term"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Think of wildlife, waste, binding targets and temperature limits."
  },
  {
    "name": "Question 2",
    "question": "Which agreement protects countries lacking the infrastructure to monitor imports of dangerous chemicals?",
    "metadata": [
      "the Kyoto Protocol",
      "the Stockholm protocol",
      "the Rotterdam Convention",
      "the Paris Agreement",
      ""
    ],
    "answer": [
      "the Rotterdam Convention",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "environmental_sustainability",
    "topic": "international_agreements",
    "subtopic": "econ_classification",
    "skills": [
      "classify_economic_concept"
    ],
    "difficulty": 4,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Look for the agreement that uses prior informed consent for chemical imports."
  },
  {
    "name": "Question 3",
    "question": "Select ALL the statements that are true about the Paris Agreement.",
    "metadata": [
      "It bans all international travel and trade",
      "Limits the rise to below 2°C",
      "Pursues efforts to limit it to 1.5°C",
      "Provides finance for developing countries",
      "It applies only to developed countries and not others"
    ],
    "answer": [
      "Limits the rise to below 2°C",
      "Pursues efforts to limit it to 1.5°C",
      "Provides finance for developing countries",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "definition",
    "unit": "environmental_sustainability",
    "topic": "international_agreements",
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
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- The agreement is about temperature targets and help for countries that need it."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "6",
      "marks": 10,
      "clues": "- Treat this as the additional part: analyse international measures taken to reduce environmental problems.",
      "approach": "- At most 2 of the 10 marks may be given for mere listing.",
      "solution": "1. CITES bans commercial trade in endangered species and regulates trade in others.\n2. The Basel Convention controls hazardous waste exports; the Stockholm protocol bans toxic substances such as DDT; the Rotterdam Convention protects countries without capacity to monitor chemical imports.\n3. The Kyoto Protocol sets binding targets on developed countries for greenhouse gases; the Paris Agreement limits warming to below 2°C, pursues 1.5°C and funds developing countries. Any other correct relevant response is accepted."
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
