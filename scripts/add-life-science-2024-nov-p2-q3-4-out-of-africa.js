#!/usr/bin/env node
/**
 * DBE Life Sciences P2 — November 2024 — Question 3.4 (Out of Africa and Homo erectus) (order 14)
 *
 * Real Q3.4 (13 marks): Homo erectus passage — how its fossils support Out of Africa (3), other fossil evidence (4), tabulate
 * two differences from Homo sapiens (5), the skull feature showing bipedalism (foramen magnum forward). Exam page 14 (cropped
 * 14:end=386); memo page 11. Tabulating is decomposed (DESIGN-LIFE-04) into a multi_select of skull differences. Independent lesson.
 *
 * Keyboard (KEYBOARD-04, core/keyboard-input.md): every typed fitb declares keyboard_type — standard_math for a bare
 * number, text for a single canonical term. The exam gate is derived from the rows by tools/apply-exam-gate.js (VER-09).
 * Do NOT copy a P2 2025 script as a template: those predate KEYBOARD-04 (tools/lib/legacy-keyboard-allowlist.js).
 * Reminder: don't factor shared text into an outer const used inside `questions` — validate-questions.js evals the
 * `questions = [...]` block in isolation.
 *
 *   node tools/validate-questions.js --script scripts/add-life-science-2024-nov-p2-q3-4-out-of-africa.js --curriculum temp/curriculum-vocab-life-science-p2-2024.json
 *   node scripts/add-life-science-2024-nov-p2-q3-4-out-of-africa.js --dry-run
 *   node scripts/add-life-science-2024-nov-p2-q3-4-out-of-africa.js
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
  "name": "Question 3.4 (Out of Africa and Homo erectus)",
  "syllabus": "dbe",
  "subject": "life_science",
  "year": 2024,
  "paper": "nov_p2",
  "order": 14,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "human_evolution",
    "hominid_fossils",
    "bipedalism"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2024/nov_p2/q14/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2024/nov_p2/q14/memo_1.png"
  ],
  "exam_question_marks": 13
};

const questions = [
  {
    "name": "Question 1",
    "question": "Fossils of a hominid species found in Africa are 1.8 million years old. Fossils of the same species found in Europe are 0.8 million years old. How does this support the Out-of-Africa hypothesis?",
    "metadata": [
      "The species arose in Europe and later moved to Africa",
      "The species arose separately in both Africa and Europe",
      "The species arose in Africa and later moved to Europe",
      "The species left Africa only after Homo sapiens did",
      ""
    ],
    "answer": [
      "The species arose in Africa and later moved to Europe",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "interpretation",
    "unit": "diversity_change_and_continuity",
    "topic": "human_evolution",
    "subtopic": "out_of_africa_fossil_evidence",
    "skills": [
      "apply_fossil_dates_to_out_of_africa"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- The oldest fossils show where a species first lived."
  },
  {
    "name": "Question 2",
    "question": "Which fossil findings support the Out-of-Africa hypothesis? Select ALL that apply.",
    "metadata": [
      "Ardipithecus fossils are found only in Africa",
      "The oldest Homo sapiens fossils are found in Asia",
      "Australopithecus fossils are found only in Africa",
      "Homo habilis fossils are found on every continent",
      "The oldest Homo sapiens fossils are found in Africa"
    ],
    "answer": [
      "Ardipithecus fossils are found only in Africa",
      "Australopithecus fossils are found only in Africa",
      "The oldest Homo sapiens fossils are found in Africa",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "diversity_change_and_continuity",
    "topic": "human_evolution",
    "subtopic": "out_of_africa_fossil_evidence",
    "skills": [
      "identify_fossil_evidence_out_of_africa"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- The hypothesis says modern humans arose in Africa and then spread out."
  },
  {
    "name": "Question 3",
    "question": "Compared with a Homo sapiens skull, which features would an Australopithecus africanus skull have? Select ALL that apply.",
    "metadata": [
      "A smaller cranium",
      "A higher, rounder forehead",
      "More prominent brow ridges",
      "Smaller canine teeth",
      "A jaw that sticks out more"
    ],
    "answer": [
      "A smaller cranium",
      "More prominent brow ridges",
      "A jaw that sticks out more",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "diversity_change_and_continuity",
    "topic": "human_evolution",
    "subtopic": "hominid_skull_comparison",
    "skills": [
      "compare_hominid_skull_features"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Australopithecus is an older, more ape-like hominid."
  },
  {
    "name": "Question 4",
    "question": "A fossil skull has its foramen magnum far back on the base of the skull. What does this suggest?",
    "metadata": [
      "It was fully bipedal",
      "It walked on four limbs",
      "It had a very large brain",
      "It had a flat, upright face",
      ""
    ],
    "answer": [
      "It walked on four limbs",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "interpretation",
    "unit": "diversity_change_and_continuity",
    "topic": "human_evolution",
    "subtopic": "foramen_magnum_position_interpretation",
    "skills": [
      "interpret_foramen_magnum_position"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- In bipeds, the spinal cord enters the skull from directly below."
  },
  {
    "name": "Question 5",
    "question": "Match each skeletal feature of a bipedal hominid to how it helps the body walk upright.",
    "metadata": [
      "A - Foramen magnum forward, under the skull",
      "B - S-shaped spine",
      "C - Short, wide pelvis",
      "1 - Keeps the upper body's weight over the hips",
      "2 - Supports the weight of the upper body on the legs",
      "3 - Balances the skull on top of a vertical spine"
    ],
    "answer": [
      "A-3",
      "B-1",
      "C-2"
    ],
    "presentation": "match",
    "type": "application",
    "unit": "diversity_change_and_continuity",
    "topic": "human_evolution",
    "subtopic": "bipedalism_anatomical_adaptations",
    "skills": [
      "match_bipedalism_adaptations"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 5,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Think of each part from the head down: skull, backbone, hips."
  }
];

const aiExplanation = {
  sub_questions: [
    {
      "number": "3.4.1",
      "marks": 3,
      "clues": "- Compare where the oldest and the younger Homo erectus fossils were found.",
      "approach": "- State where the oldest fossils are.\n- State where the younger fossils are.\n- Say what this shows.",
      "solution": "1. The oldest Homo erectus fossils were found in Africa.\n2. Younger fossils were found in other parts of the world, such as Asia.\n3. This shows that Homo erectus migrated out of Africa."
    },
    {
      "number": "3.4.2",
      "marks": 4,
      "clues": "- Use the other hominids: Ardipithecus, Australopithecus, Homo habilis and Homo sapiens.",
      "approach": "- Say where each genus or species has been found.\n- Give four points.",
      "solution": "1. Ardipithecus fossils were found only in Africa.\n2. Australopithecus fossils were found only in Africa.\n3. Homo habilis fossils were found only in Africa.\n4. The oldest Homo sapiens fossils were found in Africa, and younger ones in other parts of the world."
    },
    {
      "number": "3.4.3",
      "marks": 5,
      "clues": "- Use the passage: brain size and brow ridges.\n- Draw a table with a heading for each species.",
      "approach": "- Draw a two-column table: Homo erectus and Homo sapiens.\n- Fill in two rows of differences.",
      "solution": "1. Row 1: Homo erectus has a small brain; Homo sapiens has a large brain.\n2. Row 2: Homo erectus has prominent brow ridges; Homo sapiens has reduced brow ridges.\n3. 4 marks for the differences and 1 mark for the table format."
    },
    {
      "number": "3.4.4",
      "marks": 1,
      "clues": "- The spinal cord enters the skull through this opening.",
      "approach": "- Name the skull feature and its position in bipeds.",
      "solution": "1. The foramen magnum was in a forward position, under the skull.\n2. This means the head was balanced on an upright spine."
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
