#!/usr/bin/env node
/**
 * DBE Life Sciences P1 — November 2025 — Question 1 (Nervous System and Senses) (order 2)
 *
 * Real Q1.1.3 (reaction-time table), 1.2.2 and 1.2.4 (eye terms) and 1.3.2 (pupillary mechanism) — the Responding to the
 * Environment (humans) items in Q1.1–1.3 (6 marks), clustered by knowledge area (DESIGN-UNI-10 rule 2). Independent lesson.
 *
 * Keyboard (KEYBOARD-04, core/keyboard-input.md): every typed fitb declares keyboard_type — standard_math for a bare
 * number, text for a single canonical term (2.4.0; the 2025 exam is gated at 2.4.0 by tools/apply-exam-gate.js, VER-09).
 * Do NOT copy a P2 script as a template: those predate KEYBOARD-04 (tools/lib/legacy-keyboard-allowlist.js).
 * Reminder: don't factor shared text into an outer const used inside `questions` — validate-questions.js evals the
 * `questions = [...]` block in isolation.
 *
 *   node tools/validate-questions.js --script scripts/add-life-science-2025-nov-p1-q1-nervous-senses.js --curriculum temp/curriculum-vocab-life-science-p1.json
 *   node scripts/add-life-science-2025-nov-p1-q1-nervous-senses.js --dry-run
 *   node scripts/add-life-science-2025-nov-p1-q1-nervous-senses.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

const video = {
  "name": "Question 1 (Nervous System and Senses)",
  "syllabus": "dbe",
  "subject": "life_science",
  "year": 2025,
  "paper": "nov_p1",
  "order": 2,
  "content_tier": "free",
  "has_video": false,
  "xp": 40,
  "tags": [
    "sense_organs",
    "eye_defects",
    "reaction_time"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2025/nov_p1/q2/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2025/nov_p1/q2/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2025/nov_p1/q2/memo_1.png"
  ],
  "exam_question_marks": 6
};

const questions = [
  {
    "name": "Question 1",
    "question": "Four learners were timed as they caught a falling ruler: Sipho took 0,52 seconds, Lerato 0,47 seconds, Ayanda 0,55 seconds and Kabelo 0,49 seconds. Which learner showed the slowest response?",
    "metadata": [
      "Sipho",
      "Lerato",
      "Ayanda",
      "Kabelo",
      ""
    ],
    "answer": [
      "Ayanda",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "responding_to_environment_humans",
    "subtopic": "reaction_time_interpretation",
    "skills": [
      "interpret_reaction_time_data"
    ],
    "difficulty": 1,
    "exam_weight": 1,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- A longer reaction time means a slower response.\n- Compare all four times, not just the first two."
  },
  {
    "name": "Question 2",
    "question": "Match each eye defect to what causes it.",
    "metadata": [
      "A - Short-sightedness",
      "B - Long-sightedness",
      "C - Cataracts",
      "D - Astigmatism",
      "1 - The eyeball is too long, so distant objects focus in front of the retina",
      "2 - The eyeball is too short, so near objects focus behind the retina",
      "3 - The lens becomes cloudy and lets less light through",
      "4 - The cornea is unevenly curved, so light is refracted in different directions"
    ],
    "answer": [
      "A-1",
      "B-2",
      "C-3",
      "D-4"
    ],
    "presentation": "match",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "responding_to_environment_humans",
    "subtopic": "eye_defect_causes",
    "skills": [
      "match_eye_defect_to_cause"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Think about where the image focuses relative to the retina for each defect."
  },
  {
    "name": "Question 3",
    "question": "Does the following description apply to A only, B only, both A and B, or none? Description: contracts to make the pupil smaller in bright light. A: Radial muscles of the iris. B: Circular muscles of the iris.",
    "metadata": [
      "A only",
      "Both A and B",
      "None",
      "B only",
      ""
    ],
    "answer": [
      "B only",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "responding_to_environment_humans",
    "subtopic": "pupil_muscles_bright_light",
    "skills": [
      "classify_iris_muscle_role_ab"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- The two sets of muscles work antagonistically — when one contracts the other relaxes.\n- Picture which arrangement of fibres narrows a circular opening."
  },
  {
    "name": "Question 4",
    "question": "Name the small region at the centre of the retina that contains the most cones and gives the sharpest colour vision.",
    "metadata": [
      "[ ]"
    ],
    "answer": [
      "yellow spot|fovea|macula",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "definition",
    "unit": "life_processes_plants_animals",
    "topic": "responding_to_environment_humans",
    "subtopic": "retina_sharpest_vision",
    "skills": [
      "name_retina_region_sharp_vision"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2025,
    "paper": "nov_p1",
    "keyboard_type": "text",
    "clues": "- It is the opposite of the region where the optic nerve leaves the eye.\n- Its common name refers to its colour."
  }
];

const aiExplanation = {
  sub_questions: [
    {
      "number": "1.1.3",
      "marks": 2,
      "clues": "- Decide whether a larger or smaller number of seconds means a quicker reaction.\n- Scan the whole table before choosing.",
      "approach": "- Recall that reaction time is the time between a stimulus and the response.\n- Find the learner with the smallest reaction time.",
      "solution": "1. A shorter reaction time means a faster response.\n2. The shortest time in the table is 0,4 seconds, recorded by Jordy.\n3. The answer is D."
    },
    {
      "number": "1.2.2",
      "marks": 1,
      "clues": "- The defect involves a lens that loses its transparency.",
      "approach": "- Recall the eye defects named in the syllabus.\n- Match \"cloudy lens\" to the right one.",
      "solution": "1. A cloudy lens that reduces the light reaching the retina is called cataracts."
    },
    {
      "number": "1.2.4",
      "marks": 1,
      "clues": "- It is where the optic nerve leaves the retina.",
      "approach": "- Recall the parts of the retina.\n- Find the part with no photoreceptors.",
      "solution": "1. The part of the retina with no rods or cones, where the optic nerve leaves the eye, is the blind spot."
    },
    {
      "number": "1.3.2",
      "marks": 2,
      "clues": "- The pupillary mechanism is controlled by muscles of the iris.\n- Ciliary muscles belong to a different mechanism.",
      "approach": "- Recall which muscles control the pupil size.\n- Decide whether ciliary muscles are involved in that mechanism.",
      "solution": "1. The circular and radial muscles of the iris control the size of the pupil.\n2. Ciliary muscles change the shape of the lens during accommodation, not the size of the pupil.\n3. The description applies to radial muscles only: B only."
    }
  ],
  model: 'claude-sonnet-5-5',
  generated_at: Date.now(),
  version: 2,
  reviewed: false,
  input_tokens: 0,
  output_tokens: 0,
  avg_rating: null,
  rating_count: null,
};

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
    console.error(
      '\n   curriculum_nodes / skills → node tools/create-curriculum-node.js | create-skill.js' +
      '\n   tags → node tools/create-tag.js',
    );
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

  // Exam gate (VER-02/VER-04, tools/apply-exam-gate.js): derive the exam's minimum app version from the rows now in the
  // database and write it to exam_versions. Dev only; idempotent; the gate is per EXAM, so it covers P2 too.
  if (!DRY_RUN && ENV === 'dev') {
    const { applyExamGates } = require('../tools/lib/exam-gate');
    await applyExamGates(pool, { env: ENV, apply: true, filter: { subject: video.subject, syllabus: video.syllabus, year: String(video.year) } });
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
