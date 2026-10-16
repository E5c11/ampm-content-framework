#!/usr/bin/env node
/**
 * DBE Tourism — November 2024 — Question 1.5: Hotel staff and their uniforms (Section A) (order 6)
 * Section A items 1.5.1–1.5.5 — matching hotel staff to their duties: housekeeper, maintenance, chef, doorman and security manager.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-tourism-2024-nov-p1-l06.js --curriculum temp/curriculum-vocab-tourism.json
 *   node scripts/add-tourism-2024-nov-p1-l06.js --dry-run
 *   node scripts/add-tourism-2024-nov-p1-l06.js
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
  "name": "Question 1.5: Hotel staff and their uniforms (Section A)",
  "syllabus": "dbe",
  "subject": "tourism",
  "year": 2024,
  "paper": "nov_p1",
  "order": 6,
  "content_tier": "free",
  "has_video": false,
  "xp": 5,
  "tags": [
    "hotel_staff_roles",
    "professional_image"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2024/nov_p1/q6/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2024/nov_p1/q6/memo_1.png"
  ],
  "exam_question_marks": 5,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Match each hotel staff member to the main duty of the job.",
    "metadata": [
      "A - Housekeeper",
      "B - Maintenance worker",
      "C - Chef",
      "D - Doorman",
      "1 - Repairs leaking taps and pipes",
      "2 - Plans and prepares meals",
      "3 - Welcomes guests at the entrance",
      "4 - Keeps guest rooms clean and tidy"
    ],
    "answer": [
      "A-4",
      "B-1",
      "C-2",
      "D-3"
    ],
    "presentation": "match",
    "unit": "tourism_sectors",
    "topic": "hotel_staff_roles",
    "subtopic": "tour_classification",
    "skills": [
      "classify_tourism_concept"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "tourism",
    "year": 2024,
    "paper": "nov_p1",
    "type": "application"
  },
  {
    "name": "Question 2",
    "question": "A guest steps out of a taxi at a five-star hotel and is greeted and helped with luggage before reaching the lobby. Which staff member is this?",
    "metadata": [
      "The chef",
      "The housekeeper",
      "The night auditor",
      "The doorman",
      ""
    ],
    "answer": [
      "The doorman",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "tourism_sectors",
    "topic": "hotel_staff_roles",
    "subtopic": "tour_scenario_application",
    "skills": [
      "apply_tourism_concept_to_scenario"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "tourism",
    "year": 2024,
    "paper": "nov_p1",
    "type": "application"
  },
  {
    "name": "Question 3",
    "question": "Select ALL the reasons why hotel staff wear uniforms.",
    "metadata": [
      "It allows staff to skip grooming",
      "Guests can easily identify staff",
      "It creates a professional image",
      "It means staff need no training",
      "It replaces the need for name badges"
    ],
    "answer": [
      "Guests can easily identify staff",
      "It creates a professional image",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "tourism_sectors",
    "topic": "professional_image",
    "subtopic": "tour_cause_and_effect",
    "skills": [
      "explain_tourism_cause_and_effect"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "tourism",
    "year": 2024,
    "paper": "nov_p1",
    "type": "application"
  },
  {
    "name": "Question 4",
    "question": "Which staff member leads the team that keeps all hotel guests safe?",
    "metadata": [
      "Front office manager",
      "Security manager",
      "Food and beverage manager",
      "Housekeeping manager",
      ""
    ],
    "answer": [
      "Security manager",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "tourism_sectors",
    "topic": "hotel_staff_roles",
    "subtopic": "tour_term_recall",
    "skills": [
      "recall_tourism_term"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "tourism",
    "year": 2024,
    "paper": "nov_p1",
    "type": "definition"
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "1.5.1",
      "marks": 1,
      "clues": "- This person keeps the hotel clean.\n- Look for an apron and a cleaning spray.",
      "approach": "- Match the cleaning duty to a picture.\n- Check the uniform details.",
      "solution": "1. The housekeeper is picture H."
    },
    {
      "number": "1.5.2",
      "marks": 1,
      "clues": "- Plumbing means pipes and taps.\n- Look for work clothes and a tool.",
      "approach": "- Match the repair duty to a picture.\n- Check the uniform details.",
      "solution": "1. The maintenance worker with a spanner is picture B."
    },
    {
      "number": "1.5.3",
      "marks": 1,
      "clues": "- A culinary specialist works in the kitchen.\n- Look for the chef's hat.",
      "approach": "- Match the cooking duty to a picture.\n- Check the uniform details.",
      "solution": "1. The chef is picture G."
    },
    {
      "number": "1.5.4",
      "marks": 1,
      "clues": "- This person meets guests as they arrive at the door.\n- Look for a long uniform coat and a cap.",
      "approach": "- Match the welcome duty to a picture.\n- Check the uniform details.",
      "solution": "1. The doorman is picture E."
    },
    {
      "number": "1.5.5",
      "marks": 1,
      "clues": "- This person manages security staff.\n- Look for a dark suit and a badge.",
      "approach": "- Match the safety duty to a picture.\n- Check the uniform details.",
      "solution": "1. The security manager is picture D."
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
