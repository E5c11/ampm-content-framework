#!/usr/bin/env node
/**
 * DBE Life Sciences P1 — November 2024 — Question 2.3 (Cataracts) (order 9)
 *
 * Real Q2.3 (6 marks) is a passage on cataracts: which type is linked to diabetes, and a 5-mark explanation of why
 * cataracts cause vision loss. One lesson (DESIGN-UNI-10 rule 1). The explanation becomes an ordering (DESIGN-LIFE-02);
 * the passage itself is not reused. Independent lesson.
 *
 * Keyboard (KEYBOARD-04, core/keyboard-input.md): every typed fitb declares keyboard_type — standard_math for a bare
 * number, text for a single canonical term. The exam gate is derived from the rows by tools/apply-exam-gate.js (VER-09).
 * Do NOT copy a P2 2025 script as a template: those predate KEYBOARD-04 (tools/lib/legacy-keyboard-allowlist.js).
 * Reminder: don't factor shared text into an outer const used inside `questions` — validate-questions.js evals the
 * `questions = [...]` block in isolation.
 *
 *   node tools/validate-questions.js --script scripts/add-life-science-2024-nov-p1-q2-3-cataracts.js --curriculum temp/curriculum-vocab-life-science-p1-2024.json
 *   node scripts/add-life-science-2024-nov-p1-q2-3-cataracts.js --dry-run
 *   node scripts/add-life-science-2024-nov-p1-q2-3-cataracts.js
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
  "name": "Question 2.3 (Cataracts)",
  "syllabus": "dbe",
  "subject": "life_science",
  "year": 2024,
  "paper": "nov_p1",
  "order": 9,
  "content_tier": "free",
  "has_video": false,
  "xp": 30,
  "tags": [
    "eye_defects",
    "lens",
    "eye_structure"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2024/nov_p1/q9/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2024/nov_p1/q9/memo_1.png"
  ],
  "exam_question_marks": 6
};

const questions = [
  {
    "name": "Question 1",
    "question": "Arrange these events in the order in which they lead to poor vision in a person with a cataract.",
    "metadata": [
      "The lens becomes cloudy",
      "Fewer impulses reach the brain through the optic nerve",
      "Proteins in the lens clump together",
      "Fewer photoreceptors are stimulated",
      "Less light passes through the lens to the retina"
    ],
    "answer": [
      "Proteins in the lens clump together",
      "The lens becomes cloudy",
      "Less light passes through the lens to the retina",
      "Fewer photoreceptors are stimulated",
      "Fewer impulses reach the brain through the optic nerve"
    ],
    "presentation": "ordering",
    "type": "ordering",
    "unit": "life_processes_plants_animals",
    "topic": "responding_to_environment_humans",
    "subtopic": "cataract_vision_loss_sequence",
    "skills": [
      "sequence_cataract_vision_loss"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Start with the change inside the lens.\n- End with what the brain receives."
  },
  {
    "name": "Question 2",
    "question": "In cataract surgery, the cloudy lens is removed and replaced with a clear artificial lens. Why does this restore vision?",
    "metadata": [
      "The artificial lens produces impulses that are sent to the brain",
      "Light can again pass through the lens and be focused on the retina",
      "The artificial lens makes the eyeball longer, so the image moves forward",
      "The artificial lens increases the number of rods and cones in the retina",
      ""
    ],
    "answer": [
      "Light can again pass through the lens and be focused on the retina",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "responding_to_environment_humans",
    "subtopic": "cataract_treatment",
    "skills": [
      "explain_cataract_surgery_effect"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Consider what the cloudy lens was blocking.\n- The retina itself was not damaged."
  },
  {
    "name": "Question 3",
    "question": "Which statements about cataracts are correct? Select ALL that apply.",
    "metadata": [
      "The lens becomes cloudy instead of transparent",
      "They are caused by an eyeball that is too short",
      "Vision becomes blurred or dim",
      "They are corrected by wearing concave lenses",
      "They affect the lens rather than the shape of the eyeball"
    ],
    "answer": [
      "The lens becomes cloudy instead of transparent",
      "Vision becomes blurred or dim",
      "They affect the lens rather than the shape of the eyeball",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "definition",
    "unit": "life_processes_plants_animals",
    "topic": "responding_to_environment_humans",
    "subtopic": "cataract_features",
    "skills": [
      "identify_cataract_features"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Separate cataracts from the eye defects that are caused by the shape of the eyeball."
  }
];

const aiExplanation = {
  sub_questions: [
    {
      "number": "2.3.1",
      "marks": 1,
      "clues": "- Diabetes is a disorder of the pancreas.\n- Find the sentence in the passage that mentions diabetes.",
      "approach": "- Link the pancreas to diabetes.\n- Find which type of cataract the passage links to diabetes.",
      "solution": "1. Diabetes is caused by a disorder of the pancreas.\n2. The passage states that subcapsular cataracts are most common in people with diabetes."
    },
    {
      "number": "2.3.2",
      "marks": 5,
      "clues": "- Start with what the passage says happens to the proteins in the lens.\n- Follow the light from the lens to the retina.",
      "approach": "- Describe the change in the lens proteins.\n- Explain the effect on the transparency of the lens.\n- Explain the effect on the light reaching the retina and on the impulses formed.",
      "solution": "1. Protein structures in the lens break down and clump together.\n2. The lens becomes opaque (milky).\n3. Less light, or no light, passes through the lens onto the retina.\n4. So fewer stimuli, or none, are converted into impulses."
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
