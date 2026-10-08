#!/usr/bin/env node
/**
 * DBE Life Sciences P1 — November 2024 — Question 1 (Plant Responses) (order 4)
 *
 * Section A cluster (DESIGN-UNI-10 rule 2): the plant items of Q1 — 1.2.5 (geotropism) and 1.2.7 (gibberellins). 2 marks;
 * kept as its own small lesson because nothing else in Section A shares the plant strand. Independent lesson.
 *
 * Keyboard (KEYBOARD-04, core/keyboard-input.md): every typed fitb declares keyboard_type — standard_math for a bare
 * number, text for a single canonical term. The exam gate is derived from the rows by tools/apply-exam-gate.js (VER-09).
 * Do NOT copy a P2 2025 script as a template: those predate KEYBOARD-04 (tools/lib/legacy-keyboard-allowlist.js).
 * Reminder: don't factor shared text into an outer const used inside `questions` — validate-questions.js evals the
 * `questions = [...]` block in isolation.
 *
 *   node tools/validate-questions.js --script scripts/add-life-science-2024-nov-p1-q1-plant-responses.js --curriculum temp/curriculum-vocab-life-science-p1-2024.json
 *   node scripts/add-life-science-2024-nov-p1-q1-plant-responses.js --dry-run
 *   node scripts/add-life-science-2024-nov-p1-q1-plant-responses.js
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
  "name": "Question 1 (Plant Responses)",
  "syllabus": "dbe",
  "subject": "life_science",
  "year": 2024,
  "paper": "nov_p1",
  "order": 4,
  "content_tier": "free",
  "has_video": false,
  "xp": 30,
  "tags": [
    "plant_hormones",
    "tropisms"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2024/nov_p1/q4/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2024/nov_p1/q4/memo_1.png"
  ],
  "exam_question_marks": 2
};

const questions = [
  {
    "name": "Question 1",
    "question": "A bean seedling is laid on its side in a dark cupboard. A few days later its root has turned to grow downward and its shoot has turned to grow upward. Which statement describes these responses?",
    "metadata": [
      "The root is negatively geotropic and the shoot is positively geotropic",
      "The root is positively geotropic and the shoot is negatively geotropic",
      "The root and the shoot are both positively phototropic",
      "The root is positively phototropic and the shoot is negatively geotropic",
      ""
    ],
    "answer": [
      "The root is positively geotropic and the shoot is negatively geotropic",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "responding_to_environment_plants",
    "subtopic": "root_shoot_geotropism",
    "skills": [
      "classify_root_shoot_geotropic_responses"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- The cupboard is dark, so light is not the stimulus.\n- Positive means growing towards the stimulus."
  },
  {
    "name": "Question 2",
    "question": "Match each plant hormone to a way in which farmers use it.",
    "metadata": [
      "A - Gibberellins",
      "B - Auxins",
      "C - Abscisic acid",
      "1 - Applied to crops to close stomata during a drought",
      "2 - Applied to seeds to break dormancy and speed up germination",
      "3 - Applied to stem cuttings to stimulate root growth"
    ],
    "answer": [
      "A-2",
      "B-3",
      "C-1"
    ],
    "presentation": "match",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "responding_to_environment_plants",
    "subtopic": "plant_hormone_agricultural_uses",
    "skills": [
      "match_plant_hormone_to_agricultural_use"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- One hormone promotes growth in cuttings, one ends dormancy, and one is a stress hormone."
  },
  {
    "name": "Question 3",
    "question": "The seeds of a plant contain a high level of abscisic acid and a low level of gibberellins. What will most likely happen when they are sown in moist soil?",
    "metadata": [
      "They will germinate quickly",
      "They will stay dormant and not germinate",
      "They will germinate but the roots will grow upward",
      "They will produce shoots without roots",
      ""
    ],
    "answer": [
      "They will stay dormant and not germinate",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "responding_to_environment_plants",
    "subtopic": "seed_dormancy_hormone_balance",
    "skills": [
      "predict_germination_from_hormone_levels"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- The two hormones have opposite effects on germination.\n- Decide which one dominates here."
  }
];

const aiExplanation = {
  sub_questions: [
    {
      "number": "1.2.5",
      "marks": 1,
      "clues": "- A tropism is a growth response to a stimulus from one direction.\n- The stimulus here is gravity.",
      "approach": "- Recall the names of the plant tropisms.\n- Name the one whose stimulus is gravity.",
      "solution": "1. The growth response of a plant to gravity is geotropism.\n2. It is also called gravitropism."
    },
    {
      "number": "1.2.7",
      "marks": 1,
      "clues": "- This hormone breaks seed dormancy.",
      "approach": "- Recall the three plant hormones in the syllabus.\n- Name the one that stimulates germination.",
      "solution": "1. Gibberellins stimulate the germination of seeds.\n2. Abscisic acid has the opposite effect, keeping seeds dormant."
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
