#!/usr/bin/env node
/**
 * DBE Life Sciences P1 — November 2025 — Question 1 (Plant Responses) (order 4)
 *
 * Real Q1.1.9 (apical bud removal), 1.2.7 (abscisic acid) and 1.3.3 (plant defence) — the Responding to the Environment (plants)
 * items in Q1.1–1.3 (5 marks), clustered by knowledge area (DESIGN-UNI-10 rule 2). Independent lesson.
 *
 * Keyboard (KEYBOARD-04, core/keyboard-input.md): every typed fitb declares keyboard_type — standard_math for a bare
 * number, text for a single canonical term (2.4.0; the 2025 exam is gated at 2.4.0 by tools/apply-exam-gate.js, VER-09).
 * Do NOT copy a P2 script as a template: those predate KEYBOARD-04 (tools/lib/legacy-keyboard-allowlist.js).
 * Reminder: don't factor shared text into an outer const used inside `questions` — validate-questions.js evals the
 * `questions = [...]` block in isolation.
 *
 *   node tools/validate-questions.js --script scripts/add-life-science-2025-nov-p1-q1-plant-responses.js --curriculum temp/curriculum-vocab-life-science-p1.json
 *   node scripts/add-life-science-2025-nov-p1-q1-plant-responses.js --dry-run
 *   node scripts/add-life-science-2025-nov-p1-q1-plant-responses.js
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
  "year": 2025,
  "paper": "nov_p1",
  "order": 4,
  "content_tier": "free",
  "has_video": false,
  "xp": 30,
  "tags": [
    "plant_hormones",
    "plant_defence",
    "apical_dominance"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2025/nov_p1/q4/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2025/nov_p1/q4/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2025/nov_p1/q4/memo_1.png"
  ],
  "exam_question_marks": 5
};

const questions = [
  {
    "name": "Question 1",
    "question": "A farmer pinches off the apical bud of a young tomato plant. What is the expected result?",
    "metadata": [
      "The stem grows taller more quickly",
      "The lateral buds start to grow, so the plant becomes bushier",
      "The lateral buds stop developing completely",
      "The roots stop growing",
      ""
    ],
    "answer": [
      "The lateral buds start to grow, so the plant becomes bushier",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "responding_to_environment_plants",
    "subtopic": "apical_bud_removal_effect",
    "skills": [
      "predict_effect_of_removing_apical_bud"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Consider what the apical bud normally does to the buds lower down the stem.\n- Removing the source of a hormone removes its effect."
  },
  {
    "name": "Question 2",
    "question": "Which of the following are defence mechanisms that protect plants against being eaten by herbivores?",
    "metadata": [
      "Sharp thorns on the stem",
      "Poisonous or bitter chemicals in the leaves",
      "Bending of the shoot towards a light source",
      "Dormancy of seeds during winter",
      ""
    ],
    "answer": [
      "Sharp thorns on the stem",
      "Poisonous or bitter chemicals in the leaves",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "responding_to_environment_plants",
    "subtopic": "plant_defence_identification",
    "skills": [
      "identify_plant_defence_mechanisms"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- A defence mechanism must discourage or injure the animal that feeds on the plant."
  },
  {
    "name": "Question 3",
    "question": "Does the following description apply to A only, B only, both A and B, or none? Description: promotes the germination of seeds. A: Abscisic acid. B: Gibberellins.",
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
    "topic": "responding_to_environment_plants",
    "subtopic": "gibberellin_abscisic_acid_roles",
    "skills": [
      "classify_plant_hormone_role_ab"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- One of these hormones keeps seeds dormant, the other ends dormancy."
  }
];

const aiExplanation = {
  sub_questions: [
    {
      "number": "1.1.9",
      "marks": 2,
      "clues": "- The apical bud produces auxins that suppress lateral buds.\n- Decide which responses depend on the apical bud being present.",
      "approach": "- Recall that auxin from the apical bud inhibits lateral bud growth.\n- Remove that source and decide which listed responses follow.",
      "solution": "1. Without the apical bud there is no upward growth of the main stem: response (ii).\n2. The lateral buds are no longer inhibited, so there are more lateral branches: response (iii).\n3. Responses (i) and (iv) do not result from removing the bud, so the answer is (ii) and (iii) only: B."
    },
    {
      "number": "1.2.7",
      "marks": 1,
      "clues": "- This hormone is also linked to leaf fall and the closing of stomata under stress.",
      "approach": "- Recall the three plant hormones in the syllabus: auxins, gibberellins and one more.\n- Pick the one that keeps seeds dormant.",
      "solution": "1. Abscisic acid is the plant hormone responsible for seed dormancy."
    },
    {
      "number": "1.3.3",
      "marks": 2,
      "clues": "- The syllabus lists two examples of how plants defend themselves.\n- Decide whether each one qualifies.",
      "approach": "- Recall plant defence mechanisms: thorns and chemicals.\n- Check each against the description.",
      "solution": "1. Thorns physically deter herbivores and are a plant defence mechanism.\n2. Chemicals such as poisons or bitter substances also deter herbivores.\n3. The description applies to both A and B."
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
