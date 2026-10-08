#!/usr/bin/env node
/**
 * DBE Life Sciences P1 — November 2024 — Question 3.1 (Reproductive Strategies in Birds) (order 13)
 *
 * Real Q3.1 (8 marks) is a passage on vulture breeding: reasons from the passage for ovipary and high survival, two
 * advantages of internal fertilisation, two altricial characteristics, and why altricial birds have short incubation. One
 * lesson (DESIGN-UNI-10 rule 1). Practice uses other animals (sharks, songbirds, invented species P and Q); no vulture data
 * are reused (DESIGN-UNI-01). Independent lesson.
 *
 * Keyboard (KEYBOARD-04, core/keyboard-input.md): every typed fitb declares keyboard_type — standard_math for a bare
 * number, text for a single canonical term. The exam gate is derived from the rows by tools/apply-exam-gate.js (VER-09).
 * Do NOT copy a P2 2025 script as a template: those predate KEYBOARD-04 (tools/lib/legacy-keyboard-allowlist.js).
 * Reminder: don't factor shared text into an outer const used inside `questions` — validate-questions.js evals the
 * `questions = [...]` block in isolation.
 *
 *   node tools/validate-questions.js --script scripts/add-life-science-2024-nov-p1-q3-1-reproductive-strategies.js --curriculum temp/curriculum-vocab-life-science-p1-2024.json
 *   node scripts/add-life-science-2024-nov-p1-q3-1-reproductive-strategies.js --dry-run
 *   node scripts/add-life-science-2024-nov-p1-q3-1-reproductive-strategies.js
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
  "name": "Question 3.1 (Reproductive Strategies in Birds)",
  "syllabus": "dbe",
  "subject": "life_science",
  "year": 2024,
  "paper": "nov_p1",
  "order": 13,
  "content_tier": "free",
  "has_video": false,
  "xp": 40,
  "tags": [
    "reproduction_in_vertebrates",
    "parental_care",
    "precocial_altricial"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2024/nov_p1/q13/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2024/nov_p1/q13/memo_1.png"
  ],
  "exam_question_marks": 8
};

const questions = [
  {
    "name": "Question 1",
    "question": "Match each reproductive strategy to its description.",
    "metadata": [
      "A - Ovipary",
      "B - Ovovivipary",
      "C - Vivipary",
      "1 - Eggs stay and hatch inside the mother, without a placenta",
      "2 - The embryo develops in the uterus and is fed through a placenta",
      "3 - Eggs are laid and the embryo develops outside the body of the mother"
    ],
    "answer": [
      "A-3",
      "B-1",
      "C-2"
    ],
    "presentation": "match",
    "type": "definition",
    "unit": "life_processes_plants_animals",
    "topic": "reproduction_in_vertebrates",
    "subtopic": "reproductive_strategy_classification",
    "skills": [
      "classify_ovipary_ovovivipary_vivipary"
    ],
    "difficulty": 2,
    "exam_weight": 3,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Ask where the embryo develops and how it is fed."
  },
  {
    "name": "Question 2",
    "question": "Which are advantages of internal fertilisation over external fertilisation? Select ALL that apply.",
    "metadata": [
      "The sperm and ova are brought close together, so fertilisation is more likely",
      "Large numbers of eggs must be released into the water",
      "The gametes are protected from drying out and from predators",
      "Fewer gametes need to be produced",
      "The female does not need to find a mate"
    ],
    "answer": [
      "The sperm and ova are brought close together, so fertilisation is more likely",
      "The gametes are protected from drying out and from predators",
      "Fewer gametes need to be produced",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "reproduction_in_vertebrates",
    "subtopic": "internal_fertilisation_advantages",
    "skills": [
      "identify_internal_fertilisation_advantages"
    ],
    "difficulty": 2,
    "exam_weight": 3,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Consider what happens to gametes released into open water."
  },
  {
    "name": "Question 3",
    "question": "A newly hatched songbird chick is naked and blind, and it cannot leave the nest. Which prediction is best supported?",
    "metadata": [
      "It will find its own food within hours of hatching",
      "Its parents will need to feed it and keep it warm",
      "Its egg contained a large yolk that allowed full development",
      "It will leave the nest as soon as its eyes open on the first day",
      ""
    ],
    "answer": [
      "Its parents will need to feed it and keep it warm",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "reproduction_in_vertebrates",
    "subtopic": "altricial_chick_prediction",
    "skills": [
      "predict_altricial_parental_care"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- The chick hatches at an early stage of development.\n- Consider who must meet its needs."
  },
  {
    "name": "Question 4",
    "question": "Bird species P incubates its eggs for 18 days, and its chicks hatch blind and featherless. Bird species Q incubates its eggs for 28 days, and its chicks can run soon after hatching. Which statement explains this difference?",
    "metadata": [
      "P's eggs contain more yolk, so its embryos need less time to develop",
      "Q's eggs contain more yolk, so its embryos develop for longer inside the egg",
      "Q's chicks receive more parental care, so they stay longer inside the egg",
      "P's eggs are fertilised externally, so they hatch sooner",
      ""
    ],
    "answer": [
      "Q's eggs contain more yolk, so its embryos develop for longer inside the egg",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "reproduction_in_vertebrates",
    "subtopic": "incubation_yolk_development",
    "skills": [
      "explain_incubation_period_difference"
    ],
    "difficulty": 4,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- The yolk is the food store for the embryo inside the egg.\n- A longer stay in the egg needs more stored food."
  }
];

const aiExplanation = {
  sub_questions: [
    {
      "number": "3.1.1(a)",
      "marks": 1,
      "clues": "- Oviparous animals reproduce in one particular way.",
      "approach": "- Recall what oviparous means.\n- Find the matching phrase in the passage.",
      "solution": "1. Oviparous animals lay eggs that develop outside the body.\n2. The passage states that the female lays fertilised eggs."
    },
    {
      "number": "3.1.1(b)",
      "marks": 1,
      "clues": "- Look for what the parents do for the eggs and the chicks.",
      "approach": "- Find the parental care described in the passage.\n- Give only one reason.",
      "solution": "1. Any one: the eggs are protected by both parents during incubation, or the chicks are fed by the parents (up to 20 times a day)."
    },
    {
      "number": "3.1.2",
      "marks": 2,
      "clues": "- Compare gametes inside a body with gametes in open water.",
      "approach": "- Think about the chance that sperm meet the ovum.\n- Think about protection of the gametes and the number needed.\n- Give the first two only.",
      "solution": "1. Any two: fertilisation is more likely because the gametes are close together; the gametes are protected from predators and drying out; no water is needed; fewer gametes are needed."
    },
    {
      "number": "3.1.3",
      "marks": 2,
      "clues": "- Altricial chicks hatch at an early stage of development.",
      "approach": "- Describe their eyes and their body covering.\n- Describe their movement and how dependent they are.\n- Give the first two only.",
      "solution": "1. Any two: their eyes are closed at hatching; they have no down feathers; they cannot move soon after hatching; they depend on their parents for food and protection."
    },
    {
      "number": "3.1.4",
      "marks": 2,
      "clues": "- Link the short incubation to how developed the chicks are.\n- Consider the amount of yolk in the egg.",
      "approach": "- State how developed the chicks are at hatching.\n- Give the reason, linked to the yolk or to parental care.",
      "solution": "1. The chicks are not fully developed when they hatch,\n2. because the eggs have less yolk, and the parents provide a high degree of care after hatching."
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
