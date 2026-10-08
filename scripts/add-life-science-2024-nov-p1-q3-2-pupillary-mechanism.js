#!/usr/bin/env node
/**
 * DBE Life Sciences P1 — November 2024 — Question 3.2 (Pupillary Mechanism) (order 14)
 *
 * Real Q3.2 (11 marks) shows the pupil (X) and iris (Y) in two light conditions (A → B, the pupil dilates): identify X/Y,
 * why it is a reflex, the two effector muscles, and the significance of the dilation. One lesson (DESIGN-UNI-10 rule 1).
 * Practice tests the reverse (bright light) and the reflex sequence, with no figure. Independent lesson.
 *
 * Keyboard (KEYBOARD-04, core/keyboard-input.md): every typed fitb declares keyboard_type — standard_math for a bare
 * number, text for a single canonical term. The exam gate is derived from the rows by tools/apply-exam-gate.js (VER-09).
 * Do NOT copy a P2 2025 script as a template: those predate KEYBOARD-04 (tools/lib/legacy-keyboard-allowlist.js).
 * Reminder: don't factor shared text into an outer const used inside `questions` — validate-questions.js evals the
 * `questions = [...]` block in isolation.
 *
 *   node tools/validate-questions.js --script scripts/add-life-science-2024-nov-p1-q3-2-pupillary-mechanism.js --curriculum temp/curriculum-vocab-life-science-p1-2024.json
 *   node scripts/add-life-science-2024-nov-p1-q3-2-pupillary-mechanism.js --dry-run
 *   node scripts/add-life-science-2024-nov-p1-q3-2-pupillary-mechanism.js
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
  "name": "Question 3.2 (Pupillary Mechanism)",
  "syllabus": "dbe",
  "subject": "life_science",
  "year": 2024,
  "paper": "nov_p1",
  "order": 14,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "pupillary_mechanism",
    "eye_structure",
    "reflex_arc"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2024/nov_p1/q14/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2024/nov_p1/q14/memo_1.png"
  ],
  "exam_question_marks": 11
};

const questions = [
  {
    "name": "Question 1",
    "question": "A person walks out of a dark cinema into bright sunlight. Which changes take place in the iris?",
    "metadata": [
      "The radial muscles contract and the circular muscles relax, so the pupil constricts",
      "The circular muscles contract and the radial muscles relax, so the pupil dilates",
      "The circular muscles contract and the radial muscles relax, so the pupil constricts",
      "The radial muscles contract and the circular muscles relax, so the pupil dilates",
      ""
    ],
    "answer": [
      "The circular muscles contract and the radial muscles relax, so the pupil constricts",
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
    "order": 1,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- In bright light the pupil must let in less light.\n- A ring of muscle that tightens makes an opening smaller."
  },
  {
    "name": "Question 2",
    "question": "A person enters a dimly lit room. Arrange the events of the pupillary reflex in the correct order.",
    "metadata": [
      "The brain sends impulses to the muscles of the iris",
      "The pupil dilates and more light enters the eye",
      "Photoreceptors in the retina detect less light",
      "The radial muscles contract and the circular muscles relax",
      "Impulses travel along the optic nerve to the brain"
    ],
    "answer": [
      "Photoreceptors in the retina detect less light",
      "Impulses travel along the optic nerve to the brain",
      "The brain sends impulses to the muscles of the iris",
      "The radial muscles contract and the circular muscles relax",
      "The pupil dilates and more light enters the eye"
    ],
    "presentation": "ordering",
    "type": "ordering",
    "unit": "life_processes_plants_animals",
    "topic": "responding_to_environment_humans",
    "subtopic": "pupil_reflex_dim_light_sequence",
    "skills": [
      "sequence_pupil_dilation_reflex"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Follow the reflex from the receptor to the effector, then the result."
  },
  {
    "name": "Question 3",
    "question": "Blinking when an insect flies towards the eye is a reflex action. Which features show this? Select ALL that apply.",
    "metadata": [
      "It happens very quickly",
      "It is learned through practice",
      "It happens without conscious thought",
      "It is a response to a stimulus",
      "It is started by a decision in the cerebrum"
    ],
    "answer": [
      "It happens very quickly",
      "It happens without conscious thought",
      "It is a response to a stimulus",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "definition",
    "unit": "life_processes_plants_animals",
    "topic": "responding_to_environment_humans",
    "subtopic": "reflex_action_features",
    "skills": [
      "identify_reflex_action_features"
    ],
    "difficulty": 2,
    "exam_weight": 3,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- A reflex is automatic and protective."
  },
  {
    "name": "Question 4",
    "question": "Why is it important that the pupil constricts in very bright light?",
    "metadata": [
      "It lets in less light, which protects the retina from damage",
      "It changes the shape of the lens, so near objects come into focus",
      "It lets in more light, so the image on the retina becomes brighter",
      "It moves the image onto the blind spot, which reduces glare",
      ""
    ],
    "answer": [
      "It lets in less light, which protects the retina from damage",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "responding_to_environment_humans",
    "subtopic": "pupil_constriction_significance",
    "skills": [
      "explain_significance_of_pupil_constriction"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Consider the effect of too much light on the photoreceptors."
  },
  {
    "name": "Question 5",
    "question": "Match each part of the eye to its function.",
    "metadata": [
      "A - Iris",
      "B - Pupil",
      "C - Retina",
      "D - Choroid",
      "1 - Dark layer that absorbs light and stops reflection",
      "2 - Controls the size of the pupil",
      "3 - Contains the rods and cones",
      "4 - Opening through which light enters the eye"
    ],
    "answer": [
      "A-2",
      "B-4",
      "C-3",
      "D-1"
    ],
    "presentation": "match",
    "type": "definition",
    "unit": "life_processes_plants_animals",
    "topic": "responding_to_environment_humans",
    "subtopic": "eye_part_functions",
    "skills": [
      "match_eye_part_to_function"
    ],
    "difficulty": 2,
    "exam_weight": 3,
    "xp": 10,
    "order": 5,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Two of these parts are at the front of the eye and two line the back of it."
  }
];

const aiExplanation = {
  sub_questions: [
    {
      "number": "3.2.1(a)",
      "marks": 1,
      "clues": "- X is the dark central opening.",
      "approach": "- Find the dark opening in the centre of the coloured part.\n- Name it.",
      "solution": "1. X is the opening that lets light into the eye.\n2. X is the pupil."
    },
    {
      "number": "3.2.1(b)",
      "marks": 1,
      "clues": "- Y is the coloured ring around X.",
      "approach": "- Find the ring of muscle around the opening.\n- Name it.",
      "solution": "1. Y is the muscular ring that controls the size of the pupil.\n2. Y is the iris."
    },
    {
      "number": "3.2.2",
      "marks": 3,
      "clues": "- Consider the speed of the response, whether it is controlled consciously, and the stimulus.",
      "approach": "- State how fast the response is.\n- State whether it is voluntary.\n- Name the stimulus.",
      "solution": "1. It is a rapid,\n2. involuntary response\n3. to a change in light intensity."
    },
    {
      "number": "3.2.3",
      "marks": 2,
      "clues": "- The iris contains two sets of muscles with opposite effects.",
      "approach": "- Recall the muscle that runs outward from the pupil.\n- Recall the muscle that rings the pupil.",
      "solution": "1. The radial muscles.\n2. The circular muscles."
    },
    {
      "number": "3.2.4",
      "marks": 4,
      "clues": "- X becomes larger from A to B.\n- Consider the light conditions when this happens.",
      "approach": "- Describe the change in the pupil.\n- State the effect on the light entering the eye.\n- Link it to vision and the light conditions.",
      "solution": "1. The pupil dilates (gets larger),\n2. so that more light enters the eye,\n3. which improves vision\n4. in dim light."
    }
  ],
  model: 'claude-opus-5-5',
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
