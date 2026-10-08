#!/usr/bin/env node
/**
 * DBE Life Sciences P1 — November 2024 — Question 2.4 (Long-sightedness) (order 10)
 *
 * Real Q2.4 (5 marks): explain how the eyeball of a long-sighted man affects his reading, and how convex lenses help. One
 * lesson (DESIGN-UNI-10 rule 1). Practice contrasts long- and short-sightedness and the corrective lenses. Independent lesson.
 *
 * Keyboard (KEYBOARD-04, core/keyboard-input.md): every typed fitb declares keyboard_type — standard_math for a bare
 * number, text for a single canonical term. The exam gate is derived from the rows by tools/apply-exam-gate.js (VER-09).
 * Do NOT copy a P2 2025 script as a template: those predate KEYBOARD-04 (tools/lib/legacy-keyboard-allowlist.js).
 * Reminder: don't factor shared text into an outer const used inside `questions` — validate-questions.js evals the
 * `questions = [...]` block in isolation.
 *
 *   node tools/validate-questions.js --script scripts/add-life-science-2024-nov-p1-q2-4-long-sightedness.js --curriculum temp/curriculum-vocab-life-science-p1-2024.json
 *   node scripts/add-life-science-2024-nov-p1-q2-4-long-sightedness.js --dry-run
 *   node scripts/add-life-science-2024-nov-p1-q2-4-long-sightedness.js
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
  "name": "Question 2.4 (Long-sightedness)",
  "syllabus": "dbe",
  "subject": "life_science",
  "year": 2024,
  "paper": "nov_p1",
  "order": 10,
  "content_tier": "free",
  "has_video": false,
  "xp": 40,
  "tags": [
    "eye_defects",
    "lens"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2024/nov_p1/q10/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2024/nov_p1/q10/memo_1.png"
  ],
  "exam_question_marks": 5
};

const questions = [
  {
    "name": "Question 1",
    "question": "A long-sighted person tries to read a book without glasses. Which statements describe what happens? Select ALL that apply.",
    "metadata": [
      "The eyeball is shorter than normal",
      "The image of the page forms in front of the retina",
      "The image of the page would form behind the retina",
      "The words on the page appear blurred",
      "Only distant objects appear blurred"
    ],
    "answer": [
      "The eyeball is shorter than normal",
      "The image of the page would form behind the retina",
      "The words on the page appear blurred",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "responding_to_environment_humans",
    "subtopic": "long_sightedness_effects",
    "skills": [
      "identify_long_sightedness_effects"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- In this defect, light from near objects is not bent enough to focus in time."
  },
  {
    "name": "Question 2",
    "question": "A learner can read her textbook clearly but cannot read the board from the back of the classroom. Which statement explains her eye defect?",
    "metadata": [
      "Her eyeball is too short, so the image of the board forms behind the retina",
      "Her lens is cloudy, so light from the board cannot reach the retina",
      "Her eyeball is too long, so the image of the board forms in front of the retina",
      "Her cornea is unevenly curved, so the board image falls on the blind spot",
      ""
    ],
    "answer": [
      "Her eyeball is too long, so the image of the board forms in front of the retina",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "responding_to_environment_humans",
    "subtopic": "short_sightedness_cause",
    "skills": [
      "explain_cause_of_short_sightedness"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- She sees near objects well and distant objects badly.\n- Consider where the light from a distant object focuses."
  },
  {
    "name": "Question 3",
    "question": "Match each eye defect to the lens used to correct it.",
    "metadata": [
      "A - Long-sightedness",
      "B - Short-sightedness",
      "C - Astigmatism",
      "1 - Concave lens, which spreads light rays out before they enter the eye",
      "2 - Cylindrical lens, which corrects the uneven curve of the cornea",
      "3 - Convex lens, which bends light rays inward before they enter the eye"
    ],
    "answer": [
      "A-3",
      "B-1",
      "C-2"
    ],
    "presentation": "match",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "responding_to_environment_humans",
    "subtopic": "eye_defect_corrective_lenses",
    "skills": [
      "match_eye_defect_to_corrective_lens"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Decide whether each eye bends light too much, too little or unevenly."
  },
  {
    "name": "Question 4",
    "question": "A long-sighted man puts on glasses with convex lenses to read. Arrange these events in the correct order.",
    "metadata": [
      "The cornea and lens of the eye refract the rays further",
      "Light from the page reaches the convex lens of the glasses",
      "The image forms on the retina instead of behind it",
      "The convex lens bends the light rays inward"
    ],
    "answer": [
      "Light from the page reaches the convex lens of the glasses",
      "The convex lens bends the light rays inward",
      "The cornea and lens of the eye refract the rays further",
      "The image forms on the retina instead of behind it"
    ],
    "presentation": "ordering",
    "type": "ordering",
    "unit": "life_processes_plants_animals",
    "topic": "responding_to_environment_humans",
    "subtopic": "convex_lens_correction_sequence",
    "skills": [
      "sequence_long_sight_correction"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Follow the light from the page to the back of the eye."
  }
];

const aiExplanation = {
  sub_questions: [
    {
      "number": "2.4.1",
      "marks": 3,
      "clues": "- Long-sighted people see distant objects clearly but not near ones.\n- Consider the length of the eyeball.",
      "approach": "- State the fault in the shape of the eyeball (or cornea).\n- State where the image of the book forms.\n- State the effect on vision.",
      "solution": "1. The eyeball is too short (or the cornea is less convex, so there is less refraction).\n2. The image of the book forms behind the retina.\n3. So the words appear blurred."
    },
    {
      "number": "2.4.2",
      "marks": 2,
      "clues": "- A convex lens bends light inward.",
      "approach": "- State what the convex lens does to the light rays.\n- State where the image now forms.",
      "solution": "1. The convex lens refracts the light rays more.\n2. So the image falls on the retina, and the words are seen clearly."
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
