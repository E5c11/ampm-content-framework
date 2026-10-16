#!/usr/bin/env node
/**
 * DBE Tourism — November 2024 — Question 7.2: A code of conduct for cruise staff (order 18)
 * Question 7.2.1–7.2.3 — why a cruise line needs a code of conduct, the consequence of disrespecting cultural differences, and how a code creates a good working environment.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-tourism-2024-nov-p1-l18.js --curriculum temp/curriculum-vocab-tourism.json
 *   node scripts/add-tourism-2024-nov-p1-l18.js --dry-run
 *   node scripts/add-tourism-2024-nov-p1-l18.js
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
  "name": "Question 7.2: A code of conduct for cruise staff",
  "syllabus": "dbe",
  "subject": "tourism",
  "year": 2024,
  "paper": "nov_p1",
  "order": 18,
  "content_tier": "free",
  "has_video": false,
  "xp": 6,
  "tags": [
    "code_of_conduct",
    "professional_image"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2024/nov_p1/q18/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2024/nov_p1/q18/memo_1.png"
  ],
  "exam_question_marks": 6,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Select ALL the reasons why a cruise line has a code of conduct for its staff.",
    "metadata": [
      "It lists the ship's ports of call",
      "It sets out how staff should behave",
      "It guides staff in sensitive situations",
      "It protects the company's reputation",
      "It sets the prices of the cabins"
    ],
    "answer": [
      "It sets out how staff should behave",
      "It guides staff in sensitive situations",
      "It protects the company's reputation",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "tourism_sectors",
    "topic": "tourism_code_of_conduct",
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
    "question": "A crew member keeps mocking passengers' religious customs. What is the most likely consequence?",
    "metadata": [
      "A promotion to a senior position",
      "Disciplinary action, possibly dismissal",
      "A bonus for good customer service",
      "Extra paid leave days",
      ""
    ],
    "answer": [
      "Disciplinary action, possibly dismissal",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "tourism_sectors",
    "topic": "tourism_code_of_conduct",
    "subtopic": "tour_cause_and_effect",
    "skills": [
      "explain_tourism_cause_and_effect"
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
    "question": "Match each value in a code of conduct to an example of it.",
    "metadata": [
      "A - Respect privacy",
      "B - Act with integrity",
      "C - Work as a team",
      "D - Respect cultures",
      "1 - Handing in a wallet found on deck",
      "2 - Helping a colleague on a busy shift",
      "3 - Learning greetings in guests' languages",
      "4 - Not sharing guests' cabin numbers"
    ],
    "answer": [
      "A-4",
      "B-1",
      "C-2",
      "D-3"
    ],
    "presentation": "match",
    "unit": "tourism_sectors",
    "topic": "tourism_code_of_conduct",
    "subtopic": "tour_scenario_application",
    "skills": [
      "apply_tourism_concept_to_scenario"
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
    "question": "How does respecting a code of conduct create a good working environment?",
    "metadata": [
      "Staff may ignore the rules they dislike",
      "Managers no longer need to supervise",
      "Clear rules build trust and reduce conflict",
      "Breaks become longer for all the staff",
      ""
    ],
    "answer": [
      "Clear rules build trust and reduce conflict",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "tourism_sectors",
    "topic": "tourism_code_of_conduct",
    "subtopic": "tour_cause_and_effect",
    "skills": [
      "explain_tourism_cause_and_effect"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "tourism",
    "year": 2024,
    "paper": "nov_p1",
    "type": "application"
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "7.2.1",
      "marks": 2,
      "clues": "- A code of conduct is a set of rules for behaviour.",
      "approach": "- Explain what the code does for staff behaviour.\n- Give one reason.",
      "solution": "1. The code of conduct regulates how staff should behave while working on a cruise ship; it also guides staff in sensitive situations."
    },
    {
      "number": "7.2.2",
      "marks": 2,
      "clues": "- Disrespect breaks the code of conduct.",
      "approach": "- Think about what the employer can do.\n- State one consequence.",
      "solution": "1. The crew member could face disciplinary action, such as a warning or even dismissal."
    },
    {
      "number": "7.2.3",
      "marks": 2,
      "clues": "- Think about teamwork and rules everyone knows.",
      "approach": "- Link clear rules to how staff work together.\n- Explain the effect on the workplace.",
      "solution": "1. Respecting the code encourages teamwork by setting clear rules for behaviour, which builds trust and reduces conflict."
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
