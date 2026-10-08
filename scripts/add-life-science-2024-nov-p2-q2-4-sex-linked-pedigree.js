#!/usr/bin/env node
/**
 * DBE Life Sciences P2 — November 2024 — Question 2.4 (Sex-Linked Inheritance) (order 10)
 *
 * Real Q2.4 (13 marks): muscular dystrophy (Xᵈ) pedigree, individuals 1–8 — offspring count (3), phenotype of 1, genotype of 2
 * (XᴰXᵈ), why more males (4), genetic cross 5 x 6 (25%). Exam page 11; memo pages 7–8. The cross is decomposed (gametes MC +
 * percentage fitb). Practice uses a generated colour-blindness pedigree (individuals 1–8; 4 and 8 affected) at
 * question_supplementary/life_science/2024/nov_p2/q10/pedigree_1.png, checked against each stem. Independent lesson.
 *
 * Keyboard (KEYBOARD-04, core/keyboard-input.md): every typed fitb declares keyboard_type — standard_math for a bare
 * number, text for a single canonical term. The exam gate is derived from the rows by tools/apply-exam-gate.js (VER-09).
 * Do NOT copy a P2 2025 script as a template: those predate KEYBOARD-04 (tools/lib/legacy-keyboard-allowlist.js).
 * Reminder: don't factor shared text into an outer const used inside `questions` — validate-questions.js evals the
 * `questions = [...]` block in isolation.
 *
 *   node tools/validate-questions.js --script scripts/add-life-science-2024-nov-p2-q2-4-sex-linked-pedigree.js --curriculum temp/curriculum-vocab-life-science-p2-2024.json
 *   node scripts/add-life-science-2024-nov-p2-q2-4-sex-linked-pedigree.js --dry-run
 *   node scripts/add-life-science-2024-nov-p2-q2-4-sex-linked-pedigree.js
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
  "name": "Question 2.4 (Sex-Linked Inheritance)",
  "syllabus": "dbe",
  "subject": "life_science",
  "year": 2024,
  "paper": "nov_p2",
  "order": 10,
  "content_tier": "free",
  "has_video": false,
  "xp": 60,
  "tags": [
    "sex_linked_inheritance",
    "pedigree_analysis"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2024/nov_p2/q10/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2024/nov_p2/q10/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2024/nov_p2/q10/memo_2.png"
  ],
  "exam_question_marks": 13
};

const questions = [
  {
    "name": "Question 1",
    "question": "Use the pedigree diagram. How many males in this family are colour-blind?",
    "metadata": [
      "= ",
      "[ ]"
    ],
    "answer": [
      "2",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "reading",
    "unit": "molecular_cellular_tissue_level",
    "topic": "genetics_and_inheritance",
    "subtopic": "pedigree_reading",
    "skills": [
      "read_pedigree_diagram"
    ],
    "difficulty": 1,
    "exam_weight": 1,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p2",
    "keyboard_type": "standard_math",
    "supplementary_material": {
      "type": "pedigree",
      "label": "Colour blindness in a family",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/life_science/2024/nov_p2/q10/pedigree_1.png"
      ]
    },
    "clues": "- Squares are males.\n- Use the key to find the shaded squares."
  },
  {
    "name": "Question 2",
    "question": "Use the pedigree diagram. Colour blindness is caused by a recessive allele on the X chromosome (Xᵇ). What is the genotype of individual 2?",
    "metadata": [
      "XᴮXᴮ",
      "XᵇXᵇ",
      "XᴮY",
      "XᴮXᵇ",
      ""
    ],
    "answer": [
      "XᴮXᵇ",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "molecular_cellular_tissue_level",
    "topic": "genetics_and_inheritance",
    "subtopic": "x_linked_recessive_inheritance",
    "skills": [
      "derive_carrier_genotype_from_pedigree"
    ],
    "difficulty": 3,
    "exam_weight": 1,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p2",
    "supplementary_material": {
      "type": "pedigree",
      "label": "Colour blindness in a family",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/life_science/2024/nov_p2/q10/pedigree_1.png"
      ]
    },
    "clues": "- Individual 2 has normal vision but has a colour-blind son.\n- A son gets his X chromosome from his mother."
  },
  {
    "name": "Question 3",
    "question": "Use the pedigree diagram. Individual 4 is colour-blind. From whom did he inherit the allele for colour blindness?",
    "metadata": [
      "His father, individual 1",
      "His mother, individual 2",
      "One allele from each parent",
      "His sister, individual 3",
      ""
    ],
    "answer": [
      "His mother, individual 2",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "molecular_cellular_tissue_level",
    "topic": "genetics_and_inheritance",
    "subtopic": "x_linked_recessive_inheritance",
    "skills": [
      "trace_x_linked_allele_origin"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p2",
    "supplementary_material": {
      "type": "pedigree",
      "label": "Colour blindness in a family",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/life_science/2024/nov_p2/q10/pedigree_1.png"
      ]
    },
    "clues": "- A father passes his Y chromosome to his sons."
  },
  {
    "name": "Question 4",
    "question": "Colour blindness is caused by a recessive allele on the X chromosome. Which statements explain why it is more common in males than in females? Select ALL that apply.",
    "metadata": [
      "Males have only one X chromosome",
      "The Y chromosome carries the allele for colour blindness",
      "One recessive allele is enough for a male to be affected",
      "Males inherit their X chromosome from their father",
      "A female needs two recessive alleles to be affected"
    ],
    "answer": [
      "Males have only one X chromosome",
      "One recessive allele is enough for a male to be affected",
      "A female needs two recessive alleles to be affected",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "molecular_cellular_tissue_level",
    "topic": "genetics_and_inheritance",
    "subtopic": "x_linked_male_frequency",
    "skills": [
      "explain_x_linked_male_frequency"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- The Y chromosome has no allele for this gene.\n- In females, a dominant allele can mask the recessive one."
  },
  {
    "name": "Question 5",
    "question": "A carrier woman (XᴮXᵇ) and a man with normal colour vision (XᴮY) plan to have a child. Which gametes can each parent produce?",
    "metadata": [
      "Woman: Xᴮ and Xᴮ; man: Xᵇ and Y",
      "Woman: XᴮXᵇ only; man: XᴮY only",
      "Woman: Xᴮ and Xᵇ; man: Xᴮ and Y",
      "Woman: Xᵇ and Y; man: Xᴮ and Xᴮ",
      ""
    ],
    "answer": [
      "Woman: Xᴮ and Xᵇ; man: Xᴮ and Y",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "molecular_cellular_tissue_level",
    "topic": "genetics_and_inheritance",
    "subtopic": "x_linked_cross_gametes",
    "skills": [
      "identify_x_linked_gametes"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 5,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Each gamete gets ONE sex chromosome."
  },
  {
    "name": "Question 6",
    "question": "A carrier woman (XᴮXᵇ) and a man with normal colour vision (XᴮY) have a child. What is the percentage chance that the child will be colour-blind?",
    "metadata": [
      "= ",
      "[ ]",
      " %"
    ],
    "answer": [
      "25",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "calc",
    "unit": "molecular_cellular_tissue_level",
    "topic": "genetics_and_inheritance",
    "subtopic": "x_linked_recessive_inheritance",
    "skills": [
      "calculate_x_linked_offspring_percentage"
    ],
    "difficulty": 4,
    "exam_weight": 3,
    "xp": 10,
    "order": 6,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p2",
    "keyboard_type": "standard_math",
    "clues": "- Draw a Punnett square with the gametes Xᴮ, Xᵇ and Xᴮ, Y.\n- Count the offspring with only Xᵇ and no Xᴮ."
  }
];

const aiExplanation = {
  sub_questions: [
    {
      "number": "2.4.1",
      "marks": 1,
      "clues": "- Follow the line down from the marriage line between 1 and 2.",
      "approach": "- Count the individuals joined to the line below 1 and 2.",
      "solution": "1. Individuals 3, 4 and 5 are the children of 1 and 2.\n2. Answer: three."
    },
    {
      "number": "2.4.2(a)",
      "marks": 1,
      "clues": "- Individual 1 is an unshaded square.",
      "approach": "- Use the key to read the symbol.",
      "solution": "1. An unshaded square is a male without muscular dystrophy.\n2. Answer: male without muscular dystrophy."
    },
    {
      "number": "2.4.2(b)",
      "marks": 1,
      "clues": "- Individual 2 is unaffected but has an affected son (4).",
      "approach": "- Decide which alleles 2 must carry.\n- Remember a son gets his X from his mother.",
      "solution": "1. Individual 2 does not have the condition, so she has at least one Xᴰ.\n2. Her son 4 is XᵈY, so she must have passed on Xᵈ.\n3. Her genotype is XᴰXᵈ."
    },
    {
      "number": "2.4.3",
      "marks": 4,
      "clues": "- Compare the number of X chromosomes in males and females.",
      "approach": "- Explain the male case.\n- Explain the female case.\n- Give four points.",
      "solution": "1. Males have only one X chromosome (XY).\n2. They need only one recessive allele to have muscular dystrophy, and it cannot be masked by a dominant allele.\n3. Females have two X chromosomes and need two recessive alleles (XᵈXᵈ).\n4. In females, a dominant allele on one X chromosome masks the recessive allele."
    },
    {
      "number": "2.4.4",
      "marks": 6,
      "clues": "- Individual 5 is unaffected but has affected sons, so she is XᴰXᵈ.\n- Individual 6 is an unaffected male, XᴰY.",
      "approach": "- Write the P₂ phenotypes and genotypes.\n- Show meiosis (gametes) and fertilisation (F₂ genotypes).\n- Give the phenotypes and the percentage.",
      "solution": "1. P₂ phenotype: female without muscular dystrophy x male without muscular dystrophy; genotype XᴰXᵈ x XᴰY.\n2. Meiosis — gametes: Xᴰ, Xᵈ and Xᴰ, Y.\n3. Fertilisation — F₂ genotypes: XᴰXᴰ, XᴰY, XᴰXᵈ, XᵈY.\n4. F₂ phenotypes: 50% females without, 25% males without, 25% males with muscular dystrophy.\n5. There is a 25% chance of a child with muscular dystrophy (compulsory mark).\n6. Marks are also given for labelling P₂/F₂ and meiosis/fertilisation."
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
