#!/usr/bin/env node
/**
 * DBE Life Sciences P1 — November 2025 — Question 3.4 (Structure of the Ear, Hearing and Balance) (order 15)
 *
 * Real Q3.4 (14 marks) is one ear diagram with: identify pinna and ossicles, two fluid-filled parts, balance restoration (5 marks) and
 * noise-induced hearing loss (2 + 3 marks). One lesson (DESIGN-UNI-10 rule 1). Fresh practice questions test parts by function, the
 * path of sound, a balance scenario (a spinner), grommets (a different hearing-defect item) and hearing protection, with no figure
 * (DESIGN-LIFE-03 option (i)); prose answers become ordering/multi_select (DESIGN-LIFE-02). Independent lesson.
 *
 * Keyboard (KEYBOARD-04, core/keyboard-input.md): every typed fitb declares keyboard_type — standard_math for a bare
 * number, text for a single canonical term (2.4.0; the 2025 exam is gated at 2.4.0 by tools/apply-exam-gate.js, VER-09).
 * Do NOT copy a P2 script as a template: those predate KEYBOARD-04 (tools/lib/legacy-keyboard-allowlist.js).
 * Reminder: don't factor shared text into an outer const used inside `questions` — validate-questions.js evals the
 * `questions = [...]` block in isolation.
 *
 *   node tools/validate-questions.js --script scripts/add-life-science-2025-nov-p1-q3-4-ear.js --curriculum temp/curriculum-vocab-life-science-p1.json
 *   node scripts/add-life-science-2025-nov-p1-q3-4-ear.js --dry-run
 *   node scripts/add-life-science-2025-nov-p1-q3-4-ear.js
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
  "name": "Question 3.4 (Structure of the Ear, Hearing and Balance)",
  "syllabus": "dbe",
  "subject": "life_science",
  "year": 2025,
  "paper": "nov_p1",
  "order": 15,
  "content_tier": "free",
  "has_video": false,
  "xp": 60,
  "tags": [
    "ear_structure",
    "hearing_and_balance",
    "ear_defects"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2025/nov_p1/q15/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2025/nov_p1/q15/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2025/nov_p1/q15/memo_2.png"
  ],
  "exam_question_marks": 14
};

const questions = [
  {
    "name": "Question 1",
    "question": "Match each part of the ear to its function in hearing.",
    "metadata": [
      "A - Pinna",
      "B - Tympanic membrane",
      "C - Ossicles",
      "D - Cochlea",
      "1 - Collects sound waves and directs them into the auditory canal",
      "2 - Vibrates when sound waves strike it",
      "3 - Amplify the vibrations and pass them to the inner ear",
      "4 - Contains the organ of Corti that converts vibrations into impulses"
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
    "subtopic": "ear_part_functions",
    "skills": [
      "match_ear_part_to_function"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Follow the order in which sound passes through the ear to place each part."
  },
  {
    "name": "Question 2",
    "question": "Arrange the events in the correct order to show how a sound is heard.",
    "metadata": [
      "The cerebrum interprets the impulses as sound",
      "The vibrations produce pressure waves in the fluid of the cochlea",
      "Hair cells in the organ of Corti are stimulated and send impulses along the auditory nerve",
      "The tympanic membrane vibrates",
      "Sound waves enter the auditory canal and strike the tympanic membrane",
      "The ossicles amplify the vibrations"
    ],
    "answer": [
      "Sound waves enter the auditory canal and strike the tympanic membrane",
      "The tympanic membrane vibrates",
      "The ossicles amplify the vibrations",
      "The vibrations produce pressure waves in the fluid of the cochlea",
      "Hair cells in the organ of Corti are stimulated and send impulses along the auditory nerve",
      "The cerebrum interprets the impulses as sound"
    ],
    "presentation": "ordering",
    "type": "ordering",
    "unit": "life_processes_plants_animals",
    "topic": "responding_to_environment_humans",
    "subtopic": "sound_pathway_to_brain",
    "skills": [
      "sequence_sound_pathway"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- The pathway runs from the outer ear, across the middle ear, to the inner ear and then the brain."
  },
  {
    "name": "Question 3",
    "question": "Which parts of the human ear are normally filled with fluid?",
    "metadata": [
      "Cochlea",
      "Semicircular canals",
      "Auditory canal",
      "Middle ear cavity",
      "Pinna"
    ],
    "answer": [
      "Cochlea",
      "Semicircular canals",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "responding_to_environment_humans",
    "subtopic": "fluid_filled_ear_parts",
    "skills": [
      "identify_fluid_filled_ear_parts"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- The fluid-filled parts are both in the inner ear."
  },
  {
    "name": "Question 4",
    "question": "A skater spins rapidly and then stops suddenly, yet she still feels as if she is spinning. What is the best explanation?",
    "metadata": [
      "The ossicles continue to vibrate after her body has stopped",
      "The fluid in the cochlea stops moving and no longer stimulates the hair cells",
      "The tympanic membrane stops vibrating and cannot send impulses",
      "The fluid in the semicircular canals keeps moving and continues to stimulate the cristae after her body has stopped",
      ""
    ],
    "answer": [
      "The fluid in the semicircular canals keeps moving and continues to stimulate the cristae after her body has stopped",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "responding_to_environment_humans",
    "subtopic": "dizziness_after_spinning",
    "skills": [
      "explain_dizziness_after_spinning"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- The receptors for changes in head movement are in the part of the inner ear that is not used for hearing."
  },
  {
    "name": "Question 5",
    "question": "A child has repeated middle-ear infections. A doctor inserts small tubes, called grommets, into the child's eardrums. What is the purpose of the grommets?",
    "metadata": [
      "They amplify the vibrations of the tympanic membrane",
      "They replace the hair cells of the organ of Corti",
      "They let fluid drain from the middle ear and allow air in to equalise the pressure",
      "They block sound waves from reaching the ossicles",
      ""
    ],
    "answer": [
      "They let fluid drain from the middle ear and allow air in to equalise the pressure",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "responding_to_environment_humans",
    "subtopic": "grommets_purpose",
    "skills": [
      "explain_purpose_of_grommets"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 5,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Think about what builds up behind the eardrum during an infection."
  },
  {
    "name": "Question 6",
    "question": "Which of the following actions help to prevent noise-induced hearing loss?",
    "metadata": [
      "Wearing earplugs near loud machinery",
      "Lowering the volume of headphones",
      "Limiting the time spent in very loud places",
      "Turning the volume up to drown out background noise",
      "Removing the earplugs when music is very loud"
    ],
    "answer": [
      "Wearing earplugs near loud machinery",
      "Lowering the volume of headphones",
      "Limiting the time spent in very loud places",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "responding_to_environment_humans",
    "subtopic": "hearing_loss_prevention_measures",
    "skills": [
      "identify_hearing_protection_measures"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 6,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Prevention means reducing the intensity or duration of the vibrations reaching the hair cells."
  }
];

const aiExplanation = {
  sub_questions: [
    {
      "number": "3.4.1(a)",
      "marks": 1,
      "clues": "- It is the visible, flap-like part on the outside of the head.",
      "approach": "- Find the outer part of the ear that collects sound.",
      "solution": "1. Part A is the pinna."
    },
    {
      "number": "3.4.1(b)",
      "marks": 1,
      "clues": "- These are three tiny bones in the middle ear.",
      "approach": "- Find the small bones between the eardrum and the inner ear.",
      "solution": "1. Part B is the ossicles."
    },
    {
      "number": "3.4.2",
      "marks": 2,
      "clues": "- Both parts are in the inner ear.\n- One is coiled and one is made of looping canals.",
      "approach": "- Recall which inner ear structures are filled with fluid.\n- Find them on the diagram.",
      "solution": "1. The semicircular canals (C) are filled with fluid.\n2. The cochlea (D) is filled with fluid.\n3. The answer is C and D."
    },
    {
      "number": "3.4.3",
      "marks": 5,
      "clues": "- Changes in head movement are detected in the semicircular canals.\n- The brain region that coordinates balance then sends impulses to muscles.",
      "approach": "- State which structures are stimulated.\n- State how the stimulus is converted and where the impulse is sent.\n- State how balance is restored.",
      "solution": "1. The cristae in the semicircular canals are stimulated.\n2. They convert the stimulus into an impulse.\n3. The impulse is sent along the auditory nerve.\n4. It reaches the cerebellum for interpretation.\n5. Impulses are then sent to the skeletal muscles to restore balance."
    },
    {
      "number": "3.4.4(a)",
      "marks": 2,
      "clues": "- The hair cells convert vibrations into nerve impulses.\n- Think about what reaches the brain if they are damaged.",
      "approach": "- State what the hair cells normally do.\n- State the consequence for the impulses sent to the brain.",
      "solution": "1. Fewer or no stimuli are converted into impulses.\n2. Fewer or no impulses reach the cerebrum to be interpreted, so hearing is reduced or lost."
    },
    {
      "number": "3.4.4(b)",
      "marks": 3,
      "clues": "- Follow the path of the sound from the auditory canal inwards.\n- Earplugs reduce the energy of the sound that gets in.",
      "approach": "- State what the earplugs do to the sound waves.\n- State the effect on the middle ear.\n- State the effect on the cochlea and hair cells.",
      "solution": "1. The earplugs limit the sound waves in the auditory canal that reach the tympanic membrane.\n2. Fewer vibrations are formed in the middle ear.\n3. Fewer pressure waves form in the cochlea, which prevents damage to the hair cells."
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
