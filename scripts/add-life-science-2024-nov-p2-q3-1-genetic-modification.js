#!/usr/bin/env node
/**
 * DBE Life Sciences P2 — November 2024 — Question 3.1 (Genetically Modified Crops) (order 11)
 *
 * Real Q3.1 (7 marks): Bt maize passage — describe the genetic modification (3), two reasons farmers grow it (4). Exam page 12
 * (cropped 12:end=273); memo page 9. Practice uses fresh organisms (insulin-producing bacteria, drought-tolerant maize).
 * Independent lesson.
 *
 * Keyboard (KEYBOARD-04, core/keyboard-input.md): every typed fitb declares keyboard_type — standard_math for a bare
 * number, text for a single canonical term. The exam gate is derived from the rows by tools/apply-exam-gate.js (VER-09).
 * Do NOT copy a P2 2025 script as a template: those predate KEYBOARD-04 (tools/lib/legacy-keyboard-allowlist.js).
 * Reminder: don't factor shared text into an outer const used inside `questions` — validate-questions.js evals the
 * `questions = [...]` block in isolation.
 *
 *   node tools/validate-questions.js --script scripts/add-life-science-2024-nov-p2-q3-1-genetic-modification.js --curriculum temp/curriculum-vocab-life-science-p2-2024.json
 *   node scripts/add-life-science-2024-nov-p2-q3-1-genetic-modification.js --dry-run
 *   node scripts/add-life-science-2024-nov-p2-q3-1-genetic-modification.js
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
  "name": "Question 3.1 (Genetically Modified Crops)",
  "syllabus": "dbe",
  "subject": "life_science",
  "year": 2024,
  "paper": "nov_p2",
  "order": 11,
  "content_tier": "free",
  "has_video": false,
  "xp": 40,
  "tags": [
    "biotechnology",
    "genetic_engineering"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2024/nov_p2/q11/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2024/nov_p2/q11/memo_1.png"
  ],
  "exam_question_marks": 7
};

const questions = [
  {
    "name": "Question 1",
    "question": "Arrange the steps used to make bacteria that produce human insulin in the correct order.",
    "metadata": [
      "The insulin gene is inserted into the plasmid",
      "The bacteria multiply and produce insulin",
      "A plasmid is removed from a bacterium and cut open",
      "The recombinant plasmid is put back into a bacterium",
      "The insulin gene is cut out of human DNA"
    ],
    "answer": [
      "The insulin gene is cut out of human DNA",
      "A plasmid is removed from a bacterium and cut open",
      "The insulin gene is inserted into the plasmid",
      "The recombinant plasmid is put back into a bacterium",
      "The bacteria multiply and produce insulin"
    ],
    "presentation": "ordering",
    "type": "ordering",
    "unit": "molecular_cellular_tissue_level",
    "topic": "genetics_and_inheritance",
    "subtopic": "genetic_modification_process",
    "skills": [
      "sequence_genetic_modification_steps"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- The gene must be cut out before it can be inserted.\n- The bacteria make insulin only once they carry the gene."
  },
  {
    "name": "Question 2",
    "question": "A maize variety has been genetically modified to survive dry seasons. Why might farmers want to grow it? Select ALL that apply.",
    "metadata": [
      "A higher yield in dry years",
      "It never needs any fertiliser",
      "Fewer crops lost, which improves food security",
      "The seed is always cheaper than normal seed",
      "Less irrigation needed, which saves money"
    ],
    "answer": [
      "A higher yield in dry years",
      "Fewer crops lost, which improves food security",
      "Less irrigation needed, which saves money",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "molecular_cellular_tissue_level",
    "topic": "genetics_and_inheritance",
    "subtopic": "gmo_benefits",
    "skills": [
      "identify_gmo_benefits"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Think about what drought does to a normal crop.\n- The modification affects water use, not soil nutrients."
  },
  {
    "name": "Question 3",
    "question": "Which statement describes recombinant DNA?",
    "metadata": [
      "DNA that has been copied during interphase",
      "DNA that combines genes from two different organisms",
      "DNA that has mutated after exposure to strong radiation",
      "DNA that is inherited only from the mother",
      ""
    ],
    "answer": [
      "DNA that combines genes from two different organisms",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "molecular_cellular_tissue_level",
    "topic": "genetics_and_inheritance",
    "subtopic": "recombinant_dna_definition",
    "skills": [
      "define_recombinant_dna"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- \"Recombinant\" means \"combined again\"."
  },
  {
    "name": "Question 4",
    "question": "A maize crop has been modified to produce its own insecticide. Which is a possible concern about growing it?",
    "metadata": [
      "The crop will need more pesticide sprays than before",
      "The crop will not be able to make seeds",
      "Insects that are not pests may also be harmed",
      "The crop will always give a lower yield",
      ""
    ],
    "answer": [
      "Insects that are not pests may also be harmed",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "molecular_cellular_tissue_level",
    "topic": "genetics_and_inheritance",
    "subtopic": "gmo_concerns",
    "skills": [
      "identify_gmo_concerns"
    ],
    "difficulty": 3,
    "exam_weight": 1,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- The toxin is in every part of the plant.\n- Some insects that visit crops are useful."
  }
];

const aiExplanation = {
  sub_questions: [
    {
      "number": "3.1.1",
      "marks": 3,
      "clues": "- The gene for the Bt toxin comes from the bacterium.\n- Describe what is cut, where it is put, and what it makes.",
      "approach": "- Start with the gene being cut from bacterial DNA.\n- Say where it is inserted.\n- Say what the maize then produces.",
      "solution": "1. The gene that makes the Bt toxin is cut from the bacterial DNA.\n2. It is inserted into the maize DNA, forming recombinant DNA.\n3. The maize plant then produces the Bt toxin, which kills insects that eat it."
    },
    {
      "number": "3.1.2",
      "marks": 4,
      "clues": "- Give two reasons, each with a consequence.",
      "approach": "- Reason 1: less insect damage, and what that leads to.\n- Reason 2: less pesticide, and what that leads to.",
      "solution": "1. Fewer crops are damaged by insects, which increases the yield (more food, more profit).\n2. There is less need for pesticides, so farmers save money and fewer toxins reach consumers and the environment."
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
