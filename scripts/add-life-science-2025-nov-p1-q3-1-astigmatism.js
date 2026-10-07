#!/usr/bin/env node
/**
 * DBE Life Sciences P1 — November 2025 — Question 3.1 (Eye Structure and Astigmatism) (order 12)
 *
 * Real Q3.1 (8 marks) is a normal eye vs. astigmatic eye figure with seven items: identify fluid A / pupil / iris, describe the cornea,
 * explain the effect on vision, give one treatment. One lesson (DESIGN-UNI-10 rule 1). Fresh practice questions test the same
 * parts by function and the same cause -> effect -> treatment chain with no figure (DESIGN-LIFE-03 option (i)). Independent lesson.
 *
 * Keyboard (KEYBOARD-04, core/keyboard-input.md): every typed fitb declares keyboard_type — standard_math for a bare
 * number, text for a single canonical term (2.4.0; the 2025 exam is gated at 2.4.0 by tools/apply-exam-gate.js, VER-09).
 * Do NOT copy a P2 script as a template: those predate KEYBOARD-04 (tools/lib/legacy-keyboard-allowlist.js).
 * Reminder: don't factor shared text into an outer const used inside `questions` — validate-questions.js evals the
 * `questions = [...]` block in isolation.
 *
 *   node tools/validate-questions.js --script scripts/add-life-science-2025-nov-p1-q3-1-astigmatism.js --curriculum temp/curriculum-vocab-life-science-p1.json
 *   node scripts/add-life-science-2025-nov-p1-q3-1-astigmatism.js --dry-run
 *   node scripts/add-life-science-2025-nov-p1-q3-1-astigmatism.js
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
  "name": "Question 3.1 (Eye Structure and Astigmatism)",
  "syllabus": "dbe",
  "subject": "life_science",
  "year": 2025,
  "paper": "nov_p1",
  "order": 12,
  "content_tier": "free",
  "has_video": false,
  "xp": 40,
  "tags": [
    "eye_structure",
    "astigmatism",
    "eye_defects"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2025/nov_p1/q12/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2025/nov_p1/q12/memo_1.png"
  ],
  "exam_question_marks": 8
};

const questions = [
  {
    "name": "Question 1",
    "question": "Match each part of the eye to its function.",
    "metadata": [
      "A - Iris",
      "B - Pupil",
      "C - Aqueous humour",
      "D - Retina",
      "1 - Changes the size of the pupil to control how much light enters",
      "2 - The opening through which light passes into the eye",
      "3 - Watery fluid that fills the space between the cornea and the lens",
      "4 - Contains the light-sensitive cells that detect the image"
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
    "subtopic": "eye_part_functions",
    "skills": [
      "match_eye_part_to_function"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Decide which parts only allow light in and which parts detect or adjust it."
  },
  {
    "name": "Question 2",
    "question": "The cornea of a person's eye is shaped more like a rugby ball than a football. Why does this cause blurred vision?",
    "metadata": [
      "Too little light enters the eye through the pupil",
      "The lens becomes cloudy and scatters the light",
      "Light is refracted in different directions, so it does not focus at a single point on the retina",
      "The image forms on the blind spot where there are no photoreceptors",
      ""
    ],
    "answer": [
      "Light is refracted in different directions, so it does not focus at a single point on the retina",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "responding_to_environment_humans",
    "subtopic": "astigmatism_effect_on_vision",
    "skills": [
      "explain_astigmatism_effect"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Consider what an unevenly curved surface does to parallel light rays."
  },
  {
    "name": "Question 3",
    "question": "Which of the following can be used to treat astigmatism?",
    "metadata": [
      "Spectacles or contact lenses with a corrective shape",
      "Laser surgery on the cornea",
      "Grommets inserted in the eardrum",
      "A hearing aid",
      ""
    ],
    "answer": [
      "Spectacles or contact lenses with a corrective shape",
      "Laser surgery on the cornea",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "responding_to_environment_humans",
    "subtopic": "astigmatism_treatment_options",
    "skills": [
      "identify_astigmatism_treatments"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- The treatment must correct the way light is refracted in the eye, not help with hearing."
  },
  {
    "name": "Question 4",
    "question": "Name the transparent, curved layer at the front of the eye that refracts most of the light entering the eye.",
    "metadata": [
      "[ ]"
    ],
    "answer": [
      "cornea",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "definition",
    "unit": "life_processes_plants_animals",
    "topic": "responding_to_environment_humans",
    "subtopic": "cornea_term",
    "skills": [
      "name_cornea"
    ],
    "difficulty": 1,
    "exam_weight": 1,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2025,
    "paper": "nov_p1",
    "keyboard_type": "text",
    "clues": "- It lies in front of the aqueous humour, the iris and the pupil."
  }
];

const aiExplanation = {
  sub_questions: [
    {
      "number": "3.1.1(a)",
      "marks": 1,
      "clues": "- It is the watery fluid in the space behind the cornea.",
      "approach": "- Find the fluid-filled space between the cornea and the lens.",
      "solution": "1. Fluid A is the aqueous humour."
    },
    {
      "number": "3.1.1(b)",
      "marks": 1,
      "clues": "- It is the opening in the middle of the coloured structure.",
      "approach": "- Find the central opening that lets light in.",
      "solution": "1. Part B is the pupil."
    },
    {
      "number": "3.1.1(c)",
      "marks": 1,
      "clues": "- It is the coloured muscular ring around the opening.",
      "approach": "- Find the ring-shaped structure that surrounds the opening.",
      "solution": "1. Part C is the iris."
    },
    {
      "number": "3.1.2",
      "marks": 1,
      "clues": "- Compare the cornea in the astigmatic eye with the cornea in the normal eye.",
      "approach": "- Describe the shape of the cornea in the second diagram.",
      "solution": "1. The cornea of an eye with astigmatism is not evenly curved or rounded."
    },
    {
      "number": "3.1.3",
      "marks": 3,
      "clues": "- Think about what an unevenly curved cornea does to light rays.\n- Consider where the light ends up and what the image looks like.",
      "approach": "- State how the light is refracted.\n- State where the light is focused.\n- State what the person sees.",
      "solution": "1. Light is refracted unevenly, in different directions.\n2. The light does not focus on the retina.\n3. A blurred image is formed."
    },
    {
      "number": "3.1.4",
      "marks": 1,
      "clues": "- Treatments correct the way the eye refracts light.",
      "approach": "- Recall one way that astigmatism is corrected.",
      "solution": "1. Any one of: laser surgery, glasses/spectacles or contact lenses."
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
