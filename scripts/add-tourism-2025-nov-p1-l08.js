#!/usr/bin/env node
/**
 * DBE Tourism — November 2025 — Question 2.1: Time zones and flight times (order 8)
 * Question 2.1.1–2.1.4 — time zones crossed, long-haul flights, arrival time and the time of a live broadcast.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-tourism-2025-nov-p1-l08.js --curriculum temp/curriculum-vocab-tourism.json
 *   node scripts/add-tourism-2025-nov-p1-l08.js --dry-run
 *   node scripts/add-tourism-2025-nov-p1-l08.js
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
  "name": "Question 2.1: Time zones and flight times",
  "syllabus": "dbe",
  "subject": "tourism",
  "year": 2025,
  "paper": "nov_p1",
  "order": 8,
  "content_tier": "free",
  "has_video": false,
  "xp": 13,
  "tags": [
    "time_zones",
    "flight_time_calculation",
    "long_haul_flight"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2025/nov_p1/q8/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2025/nov_p1/q8/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2025/nov_p1/q8/memo_1.png"
  ],
  "exam_question_marks": 13,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "A traveller flies from Johannesburg (UTC+2) to Lima (UTC-5). How many time zones does the traveller cross? []",
    "metadata": [
      "Time zones: ",
      "[ ]"
    ],
    "answer": [
      "7",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "unit": "map_work_tour_planning",
    "topic": "world_time_zones",
    "subtopic": "tour_calculation",
    "skills": [
      "convert_time_zones"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "tourism",
    "year": 2025,
    "paper": "nov_p1",
    "type": "calc",
    "clues": "- Each time zone is one hour wide.\n- Find the gap between the two UTC offsets."
  },
  {
    "name": "Question 2",
    "question": "Select ALL the statements that describe a long-haul flight.",
    "metadata": [
      "It always has no layover",
      "It covers a long distance",
      "It often crosses several time zones",
      "It lasts six hours or longer",
      "It only operates inside one country"
    ],
    "answer": [
      "It covers a long distance",
      "It lasts six hours or longer",
      "It often crosses several time zones",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "map_work_tour_planning",
    "topic": "world_time_zones",
    "subtopic": "tour_term_recall",
    "skills": [
      "recall_tourism_term"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "tourism",
    "year": 2025,
    "paper": "nov_p1",
    "type": "definition"
  },
  {
    "name": "Question 3",
    "question": "Sipho leaves Johannesburg (UTC+2) at 21:00 on Monday. His direct flight to Singapore (UTC+8) lasts 11 hours. What is the local arrival time in Singapore (24-hour clock)? []",
    "metadata": [
      "HH ",
      "[ ]",
      " : ",
      "MM ",
      "[ ]"
    ],
    "answer": [
      "14",
      "00",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "unit": "map_work_tour_planning",
    "topic": "world_time_zones",
    "subtopic": "tour_calculation",
    "skills": [
      "convert_time_zones"
    ],
    "difficulty": 4,
    "exam_weight": 3,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "tourism",
    "year": 2025,
    "paper": "nov_p1",
    "type": "calc",
    "clues": "- First convert the Johannesburg departure time to Singapore time, then add the flying time."
  },
  {
    "name": "Question 4",
    "question": "Sipho left Johannesburg on Monday at 21:00. On which day does he land in Singapore?",
    "metadata": [
      "Monday",
      "Wednesday",
      "Tuesday",
      "Sunday",
      ""
    ],
    "answer": [
      "Tuesday",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "map_work_tour_planning",
    "topic": "world_time_zones",
    "subtopic": "tour_calculation",
    "skills": [
      "convert_time_zones"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "tourism",
    "year": 2025,
    "paper": "nov_p1",
    "type": "calc"
  },
  {
    "name": "Question 5",
    "question": "A match in Lima starts at 20:00 local time (UTC-5). At what time can viewers in Johannesburg (UTC+2) watch it live (24-hour clock)? []",
    "metadata": [
      "HH ",
      "[ ]",
      " : ",
      "MM ",
      "[ ]"
    ],
    "answer": [
      "03",
      "00",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "unit": "map_work_tour_planning",
    "topic": "world_time_zones",
    "subtopic": "tour_calculation",
    "skills": [
      "convert_time_zones"
    ],
    "difficulty": 4,
    "exam_weight": 3,
    "xp": 10,
    "order": 5,
    "syllabus": "dbe",
    "subject": "tourism",
    "year": 2025,
    "paper": "nov_p1",
    "type": "calc",
    "clues": "- Johannesburg is ahead of Lima, so its clock shows a later time."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "2.1.1",
      "marks": 2,
      "clues": "- Use the time zone map.\n- Count the zones between the two cities.",
      "approach": "- Read the UTC offsets of Johannesburg and Mexico City.\n- Find the difference between them.",
      "solution": "1. Johannesburg is UTC+2 and Mexico City is UTC-6, so 2 + 6 = 8 time zones are crossed."
    },
    {
      "number": "2.1.2",
      "marks": 2,
      "clues": "- The flight covers a long distance.\n- The memo wants the number of hours.",
      "approach": "- Recall the minimum duration of a long-haul flight.",
      "solution": "1. A long-haul flight covers long distances and lasts six hours or longer."
    },
    {
      "number": "2.1.3",
      "marks": 5,
      "clues": "- Work out the time difference first.\n- Convert the departure time to local time, then add the flying time.",
      "approach": "- Find the time difference using the offsets.\n- Subtract it from the departure time to get the local time in Mexico.\n- Add the flying time of 18 hours.",
      "solution": "1. Mexico City is UTC-6 and Johannesburg is UTC+2, so the difference is 8 hours.\n2. Local time in Mexico at departure is 22:00 - 8 hours = 14:00.\n3. Arrival time is 14:00 + 18 hours = 08:00."
    },
    {
      "number": "2.1.4",
      "marks": 4,
      "clues": "- Mexico City is behind Johannesburg.\n- Add the time difference to the local time.",
      "approach": "- Use the same 8-hour time difference.\n- Add it to the Mexico City time.",
      "solution": "1. The ceremony is at 20:00 in Mexico City.\n2. Johannesburg is 8 hours ahead, so 20:00 + 8 hours = 04:00."
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
