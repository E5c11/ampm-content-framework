#!/usr/bin/env node
/**
 * DBE Economics P2 — November 2025 — Question 3.5: International climate measures (order 17)
 * Lesson 17 of 2025 Nov P2 (DESIGN-UNI-14: 4 practice questions). Question 3.5: International climate measures. Fresh practice questions (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2025-nov-p2-l17.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2025-nov-p2-l17.js --dry-run
 *   node scripts/add-economics-2025-nov-p2-l17.js
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
  "name": "Question 3.5: International climate measures",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2025,
  "paper": "nov_p2",
  "order": 17,
  "content_tier": "free",
  "has_video": false,
  "xp": 8,
  "tags": [
    "climate_change",
    "international_agreements"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p2/q17/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p2/q17/memo_1.png"
  ],
  "exam_question_marks": 8,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Arrange these international climate measures in the order in which they were adopted.",
    "metadata": [
      "Paris Agreement (2015)",
      "United Nations Framework Convention on Climate Change (1992)",
      "Kyoto Protocol (1997)"
    ],
    "answer": [
      "United Nations Framework Convention on Climate Change (1992)",
      "Kyoto Protocol (1997)",
      "Paris Agreement (2015)"
    ],
    "presentation": "ordering",
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
    "order": 1,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- Each measure was meant to improve on the one before it."
  },
  {
    "name": "Question 2",
    "question": "Why did the United Nations Framework Convention on Climate Change fail to cut emissions enough?",
    "metadata": [
      "It banned all industrial production",
      "It had no goals at all",
      "It only applied to developing countries",
      "Taking part was voluntary for individual countries",
      ""
    ],
    "answer": [
      "Taking part was voluntary for individual countries",
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
    "order": 2,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- Think about what countries were obliged to do under it."
  },
  {
    "name": "Question 3",
    "question": "Select ALL the shortcomings of the Kyoto Protocol.",
    "metadata": [
      "It set binding targets only for developed countries",
      "Countries that missed targets were not penalised",
      "Some major polluters pulled out or missed their targets",
      "It forced developing countries to cut emissions first",
      "It was voluntary for every country"
    ],
    "answer": [
      "It set binding targets only for developed countries",
      "Countries that missed targets were not penalised",
      "Some major polluters pulled out or missed their targets",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "environmental_sustainability",
    "topic": "international_agreements",
    "subtopic": "econ_policy_evaluation",
    "skills": [
      "evaluate_economic_policy"
    ],
    "difficulty": 4,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- Consider who was bound, what happened to defaulters and what the largest polluters did.\n- Two statements contradict how the protocol worked."
  },
  {
    "name": "Question 4",
    "question": "Which statement best describes the main goal of the Paris Agreement?",
    "metadata": [
      "To make only developing countries cut emissions",
      "To ban the use of all fossil fuels immediately",
      "To tax every country equally",
      "To limit global warming to well below 2 °C above pre-industrial levels",
      ""
    ],
    "answer": [
      "To limit global warming to well below 2 °C above pre-industrial levels",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
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
    "order": 4,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- The goal is expressed as a limit on the rise in global temperature."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "3.5",
      "marks": 8,
      "clues": "- Trace the measures in order: UNFCCC, Kyoto, Paris.\n- Mere listing earns at most 2 marks.",
      "approach": "- Explain the aim of each measure.\n- Give a shortcoming or improvement for each.\n- End with the problem of enforcement.",
      "solution": "1. The UNFCCC aimed to reduce greenhouse gases but was voluntary and did not succeed.\n2. The Kyoto Protocol set binding targets for industrialised countries, but excluded developing countries, did not penalise failure, and major polluters such as the USA withdrew or missed targets.\n3. The Paris Agreement aims to keep warming well below 2 °C, preferably 1,5 °C, with subsidies pledged to developing countries.\n4. Targets are still being missed and there is a lack of strict enforcement."
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
