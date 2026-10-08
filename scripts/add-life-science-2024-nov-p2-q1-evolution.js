#!/usr/bin/env node
/**
 * DBE Life Sciences P2 — November 2024 — Question 1 (Evolution) (order 4)
 *
 * Section A cluster (DESIGN-UNI-10 rule 2), Evolution and Human evolution — real 1.1.5 (biological evolution), 1.1.6
 * (reproductive isolation), 1.1.7 (mitochondrial DNA as genetic evidence), 1.1.9 (Taung Child, Raymond Dart), 1.2.7 (species),
 * 1.3.1 (random fertilisation and random mating). 11 marks. Exam pages 4–5; memo page 4. Fresh practice questions, no figure.
 *
 * Keyboard (KEYBOARD-04, core/keyboard-input.md): every typed fitb declares keyboard_type — standard_math for a bare
 * number, text for a single canonical term. The exam gate is derived from the rows by tools/apply-exam-gate.js (VER-09).
 * Do NOT copy a P2 2025 script as a template: those predate KEYBOARD-04 (tools/lib/legacy-keyboard-allowlist.js).
 * Reminder: don't factor shared text into an outer const used inside `questions` — validate-questions.js evals the
 * `questions = [...]` block in isolation.
 *
 *   node tools/validate-questions.js --script scripts/add-life-science-2024-nov-p2-q1-evolution.js --curriculum temp/curriculum-vocab-life-science-p2-2024.json
 *   node scripts/add-life-science-2024-nov-p2-q1-evolution.js --dry-run
 *   node scripts/add-life-science-2024-nov-p2-q1-evolution.js
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
  "name": "Question 1 (Evolution)",
  "syllabus": "dbe",
  "subject": "life_science",
  "year": 2024,
  "paper": "nov_p2",
  "order": 4,
  "content_tier": "free",
  "has_video": false,
  "xp": 60,
  "tags": [
    "evolution_by_natural_selection",
    "human_evolution",
    "speciation"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2024/nov_p2/q4/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2024/nov_p2/q4/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2024/nov_p2/q4/memo_1.png"
  ],
  "exam_question_marks": 11
};

const questions = [
  {
    "name": "Question 1",
    "question": "Which of the following are sources of genetic variation in a population? Select ALL that apply.",
    "metadata": [
      "Crossing over during meiosis",
      "Muscle growth from exercise",
      "Random fertilisation",
      "Cloning of plants from cuttings",
      "Random mating"
    ],
    "answer": [
      "Crossing over during meiosis",
      "Random fertilisation",
      "Random mating",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "molecular_cellular_tissue_level",
    "topic": "meiosis",
    "subtopic": "genetic_variation_sources",
    "skills": [
      "identify_sources_of_variation"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Variation must be genetic to be passed on.\n- Cloning produces identical offspring."
  },
  {
    "name": "Question 2",
    "question": "Match each line of evidence for evolution to an example of it.",
    "metadata": [
      "A - Fossil evidence",
      "B - Genetic evidence",
      "C - Biogeography",
      "D - Modification by descent",
      "1 - Comparing the mitochondrial DNA of different populations",
      "2 - The same limb bones in the arms of humans, whales and bats",
      "3 - Bones of extinct hominids found in dated rock layers",
      "4 - Related species living on continents that were once joined"
    ],
    "answer": [
      "A-3",
      "B-1",
      "C-4",
      "D-2"
    ],
    "presentation": "match",
    "type": "application",
    "unit": "diversity_change_and_continuity",
    "topic": "evolution_by_natural_selection",
    "subtopic": "evidence_for_evolution_types",
    "skills": [
      "match_evidence_to_example"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Biogeography is about where species are found.\n- Modification by descent compares body structures."
  },
  {
    "name": "Question 3",
    "question": "Two frog species live in the same pond. One breeds in March and the other breeds in June, so they never interbreed. What is this an example of?",
    "metadata": [
      "Geographic isolation of a population",
      "A reproductive isolation mechanism",
      "Punctuated equilibrium in a species",
      "Artificial selection by breeders",
      ""
    ],
    "answer": [
      "A reproductive isolation mechanism",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "diversity_change_and_continuity",
    "topic": "evolution_by_natural_selection",
    "subtopic": "reproductive_isolation_mechanisms",
    "skills": [
      "identify_reproductive_isolation_mechanisms"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- The frogs share the same habitat, so nothing physical separates them."
  },
  {
    "name": "Question 4",
    "question": "Horses and donkeys can mate and produce mules, but mules are infertile. Why are horses and donkeys classed as separate species?",
    "metadata": [
      "They look different from each other",
      "They are unable to mate at all",
      "Their offspring cannot reproduce",
      "They live in different habitats",
      ""
    ],
    "answer": [
      "Their offspring cannot reproduce",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "diversity_change_and_continuity",
    "topic": "evolution_by_natural_selection",
    "subtopic": "biological_species_concept",
    "skills": [
      "apply_biological_species_concept"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- A species is a group that can interbreed to produce fertile offspring."
  },
  {
    "name": "Question 5",
    "question": "Match each South African scientist to the fossil discovery linked to them.",
    "metadata": [
      "A - Raymond Dart",
      "B - Robert Broom",
      "C - Ron Clarke",
      "D - Lee Berger",
      "1 - Little Foot",
      "2 - Taung Child",
      "3 - Australopithecus sediba (Karabo)",
      "4 - Mrs Ples"
    ],
    "answer": [
      "A-2",
      "B-4",
      "C-1",
      "D-3"
    ],
    "presentation": "match",
    "type": "definition",
    "unit": "diversity_change_and_continuity",
    "topic": "human_evolution",
    "subtopic": "sa_fossil_discoveries",
    "skills": [
      "match_scientist_to_fossil"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 5,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- The Taung Child (1924) was the first Australopithecus described.\n- Karabo was found at Malapa in 2008."
  },
  {
    "name": "Question 6",
    "question": "Which statement best describes biological evolution?",
    "metadata": [
      "A change in an organism's body during its own lifetime",
      "The sudden appearance of a new species after a mass extinction",
      "A change in a species caused only by selective breeding",
      "A change in a species' characteristics over many generations",
      ""
    ],
    "answer": [
      "A change in a species' characteristics over many generations",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "diversity_change_and_continuity",
    "topic": "evolution_by_natural_selection",
    "subtopic": "biological_evolution_definition",
    "skills": [
      "define_biological_evolution"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "xp": 10,
    "order": 6,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Evolution happens to populations, not to one organism.\n- It is usually gradual."
  }
];

const aiExplanation = {
  sub_questions: [
    {
      "number": "1.1.5",
      "marks": 2,
      "clues": "- The key words are \"gradual\" and \"over time\".",
      "approach": "- Compare the definitions of the four terms.\n- Note that punctuated equilibrium is sudden change, not gradual change.",
      "solution": "1. Speciation is the formation of a new species and genetic engineering is a biotechnology.\n2. Punctuated equilibrium describes long stable periods broken by rapid change.\n3. A gradual change in a species over time is biological evolution. The answer is D."
    },
    {
      "number": "1.1.6",
      "marks": 2,
      "clues": "- A reproductive isolation mechanism prevents two species from interbreeding.",
      "approach": "- Check whether each option would prevent or allow interbreeding.\n- Choose the one that prevents it.",
      "solution": "1. Sharing a pollinator, producing fertile offspring and breeding at the same time all allow interbreeding.\n2. Species-specific courtship behaviour means one species does not respond to the other.\n3. The answer is B."
    },
    {
      "number": "1.1.7",
      "marks": 2,
      "clues": "- Mitochondrial DNA is genetic material.",
      "approach": "- Match the type of data to the line of evidence.",
      "solution": "1. Analysing mitochondrial DNA compares genetic material between populations.\n2. This is genetic evidence, so the answer is D."
    },
    {
      "number": "1.1.9",
      "marks": 2,
      "clues": "- The Taung Child was found in 1924.",
      "approach": "- Recall which scientist described the Taung Child as Australopithecus africanus.",
      "solution": "1. Raymond Dart described the Taung Child in 1925.\n2. Broom is linked to Mrs Ples, Clarke to Little Foot and Berger to Australopithecus sediba.\n3. The answer is C."
    },
    {
      "number": "1.2.7",
      "marks": 1,
      "clues": "- The key words are \"interbreed\" and \"fertile offspring\".",
      "approach": "- Name the group defined by the biological species concept.",
      "solution": "1. A group of similar organisms that can interbreed to produce fertile offspring is a species.\n2. Answer: species."
    },
    {
      "number": "1.3.1",
      "marks": 2,
      "clues": "- Ask whether each process makes new combinations of alleles.",
      "approach": "- Check random fertilisation.\n- Check random mating.",
      "solution": "1. Random fertilisation means any sperm can fuse with any egg, giving new allele combinations.\n2. Random mating means any individual can mate with any other, which also gives new combinations.\n3. Both are sources of variation, so the answer is both A and B."
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
