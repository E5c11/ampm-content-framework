#!/usr/bin/env node
/**
 * DBE Life Sciences P1 — November 2025 — Question 3.3 (Accommodation of the Eye) (order 14)
 *
 * Real Q3.3 (5 marks) has no stimulus: "Describe how the human eye accommodates for distant vision" (a five-point sequence). One
 * single-item lesson (DESIGN-UNI-10 rule 2 spirit, kept separate from Q3.1 because it is its own numbered question; the
 * profile allowed either). Fresh practice questions use the mirror-image case — NEAR vision — and the reason for the change in lens
 * shape, so a student who memorised the memo's distant-vision sentence still has to reason (DESIGN-UNI-01/08). Independent lesson.
 *
 * Keyboard (KEYBOARD-04, core/keyboard-input.md): every typed fitb declares keyboard_type — standard_math for a bare
 * number, text for a single canonical term (2.4.0; the 2025 exam is gated at 2.4.0 by tools/apply-exam-gate.js, VER-09).
 * Do NOT copy a P2 script as a template: those predate KEYBOARD-04 (tools/lib/legacy-keyboard-allowlist.js).
 * Reminder: don't factor shared text into an outer const used inside `questions` — validate-questions.js evals the
 * `questions = [...]` block in isolation.
 *
 *   node tools/validate-questions.js --script scripts/add-life-science-2025-nov-p1-q3-3-accommodation.js --curriculum temp/curriculum-vocab-life-science-p1.json
 *   node scripts/add-life-science-2025-nov-p1-q3-3-accommodation.js --dry-run
 *   node scripts/add-life-science-2025-nov-p1-q3-3-accommodation.js
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
  "name": "Question 3.3 (Accommodation of the Eye)",
  "syllabus": "dbe",
  "subject": "life_science",
  "year": 2025,
  "paper": "nov_p1",
  "order": 14,
  "content_tier": "free",
  "has_video": false,
  "xp": 30,
  "tags": [
    "accommodation",
    "eye_structure",
    "lens"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2025/nov_p1/q14/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2025/nov_p1/q14/memo_1.png"
  ],
  "exam_question_marks": 5
};

const questions = [
  {
    "name": "Question 1",
    "question": "A learner looks up from the chalkboard and begins to read a book held close to the eyes. Arrange the changes that take place in the eye so that the book is seen clearly.",
    "metadata": [
      "The lens becomes more convex",
      "Light is refracted more strongly",
      "The tension on the suspensory ligaments decreases",
      "The ciliary muscles contract",
      "A clear image forms on the retina"
    ],
    "answer": [
      "The ciliary muscles contract",
      "The tension on the suspensory ligaments decreases",
      "The lens becomes more convex",
      "Light is refracted more strongly",
      "A clear image forms on the retina"
    ],
    "presentation": "ordering",
    "type": "ordering",
    "unit": "life_processes_plants_animals",
    "topic": "responding_to_environment_humans",
    "subtopic": "accommodation_near_vision_sequence",
    "skills": [
      "sequence_near_vision_accommodation"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Start with the muscle that controls the lens and end with the image on the retina."
  },
  {
    "name": "Question 2",
    "question": "Which of the following structures are directly involved in accommodation?",
    "metadata": [
      "Ciliary muscles",
      "Suspensory ligaments",
      "The lens",
      "The optic nerve",
      "The blind spot"
    ],
    "answer": [
      "Ciliary muscles",
      "Suspensory ligaments",
      "The lens",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "responding_to_environment_humans",
    "subtopic": "accommodation_structures_involved",
    "skills": [
      "identify_accommodation_structures"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Accommodation changes the shape of one structure by adjusting the tension of others."
  },
  {
    "name": "Question 3",
    "question": "Why must the lens become more convex to focus on a nearby object?",
    "metadata": [
      "Light rays from a near object are weaker, so more light must reach the retina",
      "Light rays from a near object diverge more, so they must be refracted more strongly to focus on the retina",
      "The pupil becomes larger, which makes the lens thicker",
      "The retina moves closer to the lens",
      ""
    ],
    "answer": [
      "Light rays from a near object diverge more, so they must be refracted more strongly to focus on the retina",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "responding_to_environment_humans",
    "subtopic": "lens_curvature_refraction",
    "skills": [
      "explain_lens_curvature_and_refraction"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Compare how spread out the light rays are from a near object and from a distant one."
  }
];

const aiExplanation = {
  sub_questions: [
    {
      "number": "3.3",
      "marks": 5,
      "clues": "- For a distant object the ciliary muscles relax.\n- Follow the chain: muscle, ligaments, lens shape, refraction, image.",
      "approach": "- Describe what the ciliary muscles do.\n- State the effect on the suspensory ligaments and the lens.\n- State the effect on refraction and the image.",
      "solution": "1. The ciliary muscles relax.\n2. The suspensory ligaments become taut, so the tension on the lens increases.\n3. The lens becomes less convex (flatter).\n4. Light is therefore refracted less.\n5. A clear image forms on the retina."
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
