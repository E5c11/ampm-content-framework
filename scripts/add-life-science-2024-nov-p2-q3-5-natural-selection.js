#!/usr/bin/env node
/**
 * DBE Life Sciences P2 — November 2024 — Question 3.5 (Mutation and Natural Selection) (order 15)
 *
 * Real Q3.5 (9 marks): Chernobyl wolves passage — define a mutation, effect of high radiation, Darwin's natural selection
 * explanation of cancer immunity (7). Exam page 14 (cropped 14:start=386); memo page 11. Practice uses a fresh case (rats and
 * warfarin resistance); the 7-mark explanation becomes an ordering (DESIGN-LIFE-02). Independent lesson.
 *
 * Keyboard (KEYBOARD-04, core/keyboard-input.md): every typed fitb declares keyboard_type — standard_math for a bare
 * number, text for a single canonical term. The exam gate is derived from the rows by tools/apply-exam-gate.js (VER-09).
 * Do NOT copy a P2 2025 script as a template: those predate KEYBOARD-04 (tools/lib/legacy-keyboard-allowlist.js).
 * Reminder: don't factor shared text into an outer const used inside `questions` — validate-questions.js evals the
 * `questions = [...]` block in isolation.
 *
 *   node tools/validate-questions.js --script scripts/add-life-science-2024-nov-p2-q3-5-natural-selection.js --curriculum temp/curriculum-vocab-life-science-p2-2024.json
 *   node scripts/add-life-science-2024-nov-p2-q3-5-natural-selection.js --dry-run
 *   node scripts/add-life-science-2024-nov-p2-q3-5-natural-selection.js
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
  "name": "Question 3.5 (Mutation and Natural Selection)",
  "syllabus": "dbe",
  "subject": "life_science",
  "year": 2024,
  "paper": "nov_p2",
  "order": 15,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "evolution_by_natural_selection",
    "mutations"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2024/nov_p2/q15/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2024/nov_p2/q15/memo_1.png"
  ],
  "exam_question_marks": 9
};

const questions = [
  {
    "name": "Question 1",
    "question": "Which statement defines a mutation?",
    "metadata": [
      "A change in an organism caused by its environment",
      "A change in the number of offspring of a species",
      "A change in the genetic material of an organism",
      "A change in the habitat where a population lives",
      ""
    ],
    "answer": [
      "A change in the genetic material of an organism",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "molecular_cellular_tissue_level",
    "topic": "genetics_and_inheritance",
    "subtopic": "mutation_definition",
    "skills": [
      "define_mutation"
    ],
    "difficulty": 1,
    "exam_weight": 1,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- A mutation can be passed on to offspring."
  },
  {
    "name": "Question 2",
    "question": "Farmers used the poison warfarin to kill rats. After some years, most rats were resistant to it. Arrange the statements to explain this using Darwin's theory of natural selection.",
    "metadata": [
      "The resistant rats survived and reproduced",
      "There was variation in the rat population",
      "Over many generations, most rats became resistant",
      "When warfarin was used, the rats without resistance died",
      "They passed the resistance allele on to their offspring",
      "Some rats had an allele for warfarin resistance and some did not"
    ],
    "answer": [
      "There was variation in the rat population",
      "Some rats had an allele for warfarin resistance and some did not",
      "When warfarin was used, the rats without resistance died",
      "The resistant rats survived and reproduced",
      "They passed the resistance allele on to their offspring",
      "Over many generations, most rats became resistant"
    ],
    "presentation": "ordering",
    "type": "ordering",
    "unit": "diversity_change_and_continuity",
    "topic": "evolution_by_natural_selection",
    "subtopic": "natural_selection_explanation",
    "skills": [
      "sequence_natural_selection_steps"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Variation comes first, then selection, then inheritance."
  },
  {
    "name": "Question 3",
    "question": "Farmers used the poison warfarin to kill rats, and over time most rats became resistant to it. Which statement explains why resistant rats became more common?",
    "metadata": [
      "Rats became resistant because they needed to survive the poison",
      "Resistant rats survived to breed and passed on the allele",
      "Warfarin made every rat mutate and become resistant",
      "Farmers bred the resistant rats on purpose to sell",
      ""
    ],
    "answer": [
      "Resistant rats survived to breed and passed on the allele",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "diversity_change_and_continuity",
    "topic": "evolution_by_natural_selection",
    "subtopic": "natural_selection_explanation",
    "skills": [
      "explain_natural_selection_mechanism"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Darwin's theory works on variation that already exists.\n- Lamarck's idea of change through need is not accepted."
  },
  {
    "name": "Question 4",
    "question": "Animals living near a nuclear accident are exposed to high levels of radiation. What is the most likely effect on these animals?",
    "metadata": [
      "More mutations, which can lead to cancer",
      "Fewer mutations, so there is less variation",
      "Immunity to cancer in every exposed animal",
      "No effect, as radiation cannot change DNA",
      ""
    ],
    "answer": [
      "More mutations, which can lead to cancer",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "molecular_cellular_tissue_level",
    "topic": "genetics_and_inheritance",
    "subtopic": "radiation_mutation_effects",
    "skills": [
      "identify_effect_of_radiation"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Radiation damages DNA."
  },
  {
    "name": "Question 5",
    "question": "Match each mutation to the type of mutation it is.",
    "metadata": [
      "A - An allele for warfarin resistance in rats where warfarin is used",
      "B - An allele that stops blood from clotting normally",
      "C - A base change that does not alter the protein made",
      "1 - Harmless mutation",
      "2 - Useful mutation",
      "3 - Harmful mutation"
    ],
    "answer": [
      "A-2",
      "B-3",
      "C-1"
    ],
    "presentation": "match",
    "type": "application",
    "unit": "molecular_cellular_tissue_level",
    "topic": "genetics_and_inheritance",
    "subtopic": "mutation_effects",
    "skills": [
      "explain_mutation_harm_criteria"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "xp": 10,
    "order": 5,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Ask whether the mutation helps survival, lowers it, or has no effect."
  }
];

const aiExplanation = {
  sub_questions: [
    {
      "number": "3.5.1",
      "marks": 1,
      "clues": "- A mutation changes the genetic material.",
      "approach": "- Give a one-line definition.",
      "solution": "1. A mutation is a change in the genetic composition (DNA) of an organism."
    },
    {
      "number": "3.5.2",
      "marks": 1,
      "clues": "- Read the passage: what happened to animals exposed to high radiation?",
      "approach": "- Quote the effect from the passage.",
      "solution": "1. High radiation leads to cancer (or death, or mutations)."
    },
    {
      "number": "3.5.3",
      "marks": 7,
      "clues": "- Use variation, selection by radiation, survival, reproduction and inheritance.\n- Each point must refer to the wolves.",
      "approach": "- Start with variation in the wolf population.\n- Explain who died and who survived under radiation.\n- End with the next generation.",
      "solution": "1. There was variation among the wolves.\n2. Some had the mutation that made them immune to cancer and some did not.\n3. When exposed to radiation, the wolves without the mutation died.\n4. Those with the mutation survived and reproduced.\n5. They passed the allele for immunity to their offspring.\n6. The next generation had a higher proportion of wolves with immunity to cancer."
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
