#!/usr/bin/env node
/**
 * DBE Tourism — November 2024 — Question 2.1: Time zones, daylight saving and jet fatigue (order 7)
 * Question 2.1.1–2.1.4 — time difference with daylight saving time, arrival time and date, adjusting watches, and jet fatigue on a flight that crosses few time zones.
 * Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-tourism-2024-nov-p1-l07.js --curriculum temp/curriculum-vocab-tourism.json
 *   node scripts/add-tourism-2024-nov-p1-l07.js --dry-run
 *   node scripts/add-tourism-2024-nov-p1-l07.js
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
  "name": "Question 2.1: Time zones, daylight saving and jet fatigue",
  "syllabus": "dbe",
  "subject": "tourism",
  "year": 2024,
  "paper": "nov_p1",
  "order": 7,
  "content_tier": "free",
  "has_video": false,
  "xp": 12,
  "tags": [
    "time_zones",
    "daylight_saving_time",
    "jet_fatigue"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2024/nov_p1/q7/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2024/nov_p1/q7/question_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2024/nov_p1/q7/question_3.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/tourism/2024/nov_p1/q7/memo_1.png"
  ],
  "exam_question_marks": 12,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "In July, New York is UTC-5 and uses daylight saving time (+1 hour). Johannesburg is UTC+2 and does not use daylight saving time. What is the time difference between the two cities in July, in hours? []",
    "metadata": [
      "Hours: ",
      "[ ]"
    ],
    "answer": [
      "6",
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
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "tourism",
    "year": 2024,
    "paper": "nov_p1",
    "type": "calc",
    "clues": "- Apply daylight saving time to New York's offset first.\n- Then find the gap between the two offsets."
  },
  {
    "name": "Question 2",
    "question": "A school choir leaves Cape Town (UTC+2) at 22:00 on 14 June. London is UTC+0 but uses daylight saving time (+1 hour) in June. The flight lasts 12 hours. What is the local arrival time in London (24-hour clock)? []",
    "metadata": [
      "HH ",
      "[ ]",
      " : ",
      "MM ",
      "[ ]"
    ],
    "answer": [
      "09|9",
      "00|0",
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
    "order": 2,
    "syllabus": "dbe",
    "subject": "tourism",
    "year": 2024,
    "paper": "nov_p1",
    "type": "calc",
    "clues": "- Convert the Cape Town departure time to London time first, then add the flying time."
  },
  {
    "name": "Question 3",
    "question": "The choir left Cape Town at 22:00 on 14 June and flew for 12 hours. On which date did it land in London (local time)?",
    "metadata": [
      "14 June",
      "16 June",
      "15 June",
      "13 June",
      ""
    ],
    "answer": [
      "15 June",
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
    "order": 3,
    "syllabus": "dbe",
    "subject": "tourism",
    "year": 2024,
    "paper": "nov_p1",
    "type": "calc"
  },
  {
    "name": "Question 4",
    "question": "When the choir lands in London in June, how must the members adjust watches still set to South African time?",
    "metadata": [
      "Set them one hour forward",
      "Set them two hours back",
      "Leave them unchanged",
      "Set them one hour back",
      ""
    ],
    "answer": [
      "Set them one hour back",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "unit": "map_work_tour_planning",
    "topic": "world_time_zones",
    "subtopic": "tour_scenario_application",
    "skills": [
      "convert_time_zones"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "tourism",
    "year": 2024,
    "paper": "nov_p1",
    "type": "application"
  },
  {
    "name": "Question 5",
    "question": "A traveller flies 10 hours overnight from Johannesburg to Stockholm in July, when both cities show the same clock time. She feels tired and stiff on arrival. Select ALL the reasons why this is jet fatigue and not jet lag.",
    "metadata": [
      "She crossed many time zones",
      "She crossed almost no time zones",
      "Her body clock is far out of step",
      "Her tiredness comes from the long flight",
      "She flew across the date line"
    ],
    "answer": [
      "She crossed almost no time zones",
      "Her tiredness comes from the long flight",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "unit": "map_work_tour_planning",
    "topic": "jet_lag",
    "subtopic": "tour_cause_and_effect",
    "skills": [
      "explain_tourism_cause_and_effect"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 5,
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
      "number": "2.1.1",
      "marks": 2,
      "clues": "- Both cities use daylight saving time during the Olympic Games.\n- Add one hour to each offset.",
      "approach": "- Write the UTC offset of each city with DST added.\n- Subtract the smaller offset from the larger one.",
      "solution": "1. London: 0 + 1 (DST) = +1.\n2. Paris: +1 + 1 (DST) = +2.\n3. Time difference = 1 hour."
    },
    {
      "number": "2.1.2",
      "marks": 4,
      "clues": "- France uses DST, so Paris is at UTC+2.\n- Johannesburg is also UTC+2.",
      "approach": "- Find the time difference between Johannesburg and Paris.\n- Convert the departure time to Paris time.\n- Add the flying time and check whether the date changes.",
      "solution": "1. Johannesburg: +2. Paris: +1 + 1 (DST) = +2, so the time difference is 0 hours.\n2. Local time in Paris at departure = 20:00 + 0 hours = 20:00.\n3. Arrival = 20:00 + 11 hours = 07:00.\n4. The time passes midnight, so they arrived at 07:00 on 19 July 2024."
    },
    {
      "number": "2.1.3",
      "marks": 2,
      "clues": "- Compare the time in South Africa with the time in Paris.\n- The memo accepts two answers.",
      "approach": "- Use the time difference you worked out in 2.1.2.\n- Decide whether the watches must change.",
      "solution": "1. There was no time difference, so the team had no need to adjust their watches.\n2. The memo also accepts adjusting the watches one hour forward."
    },
    {
      "number": "2.1.4",
      "marks": 4,
      "clues": "- The flight lasted 11 hours.\n- It crossed almost no time zones.",
      "approach": "- Name the condition caused by a long flight that does not cross many time zones.\n- Give the reason by referring to the time zones crossed.",
      "solution": "1. (a) Jet fatigue.\n2. (b) The flight did not cross many time zones; there is only one time zone between Johannesburg and Paris."
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
