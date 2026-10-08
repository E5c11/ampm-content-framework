#!/usr/bin/env node
/**
 * DBE Life Sciences P2 — November 2024 — Question 1.5 (Dihybrid Cross) (order 6)
 *
 * Real Q1.5 (9 marks): butterflies RrEe x RrEe (red/grey spots, black/brown eyes) — type of cross, dominant traits, genotypes at
 * X (RRee, Rree), phenotype at Y (red spots, black eyes), gamete of rree (re). Exam page 7; memo page 4. Practice uses a fresh
 * guinea-pig cross (black B / white b coat, rough R / smooth r hair). Each question restates the alleles, so it stays independent.
 *
 * Keyboard (KEYBOARD-04, core/keyboard-input.md): every typed fitb declares keyboard_type — standard_math for a bare
 * number, text for a single canonical term. The exam gate is derived from the rows by tools/apply-exam-gate.js (VER-09).
 * Do NOT copy a P2 2025 script as a template: those predate KEYBOARD-04 (tools/lib/legacy-keyboard-allowlist.js).
 * Reminder: don't factor shared text into an outer const used inside `questions` — validate-questions.js evals the
 * `questions = [...]` block in isolation.
 *
 *   node tools/validate-questions.js --script scripts/add-life-science-2024-nov-p2-q1-5-dihybrid-cross.js --curriculum temp/curriculum-vocab-life-science-p2-2024.json
 *   node scripts/add-life-science-2024-nov-p2-q1-5-dihybrid-cross.js --dry-run
 *   node scripts/add-life-science-2024-nov-p2-q1-5-dihybrid-cross.js
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
  "name": "Question 1.5 (Dihybrid Cross)",
  "syllabus": "dbe",
  "subject": "life_science",
  "year": 2024,
  "paper": "nov_p2",
  "order": 6,
  "content_tier": "free",
  "has_video": false,
  "xp": 60,
  "tags": [
    "genetics_and_inheritance",
    "dihybrid_cross"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2024/nov_p2/q6/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2024/nov_p2/q6/memo_1.png"
  ],
  "exam_question_marks": 9
};

const questions = [
  {
    "name": "Question 1",
    "question": "In guinea pigs, black coat (B) is dominant over white coat (b), and rough hair (R) is dominant over smooth hair (r). Two guinea pigs with genotype BbRr are crossed. What type of cross is this?",
    "metadata": [
      "Monohybrid cross",
      "Sex-linked cross",
      "Dihybrid cross",
      "Codominant cross",
      ""
    ],
    "answer": [
      "Dihybrid cross",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "molecular_cellular_tissue_level",
    "topic": "genetics_and_inheritance",
    "subtopic": "dihybrid_cross_identification",
    "skills": [
      "identify_dihybrid_cross"
    ],
    "difficulty": 1,
    "exam_weight": 1,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Count how many genes are followed in the cross."
  },
  {
    "name": "Question 2",
    "question": "In guinea pigs, black coat (B) is dominant over white coat (b), and rough hair (R) is dominant over smooth hair (r). Which genotypes would give a guinea pig with a black, smooth coat? Select ALL that apply.",
    "metadata": [
      "BbRr",
      "BBrr",
      "bbrr",
      "Bbrr",
      "bbRr"
    ],
    "answer": [
      "BBrr",
      "Bbrr",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "molecular_cellular_tissue_level",
    "topic": "genetics_and_inheritance",
    "subtopic": "dihybrid_genotype_from_phenotype",
    "skills": [
      "identify_genotypes_for_phenotype"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Black needs at least one B.\n- Smooth is recessive, so it needs rr."
  },
  {
    "name": "Question 3",
    "question": "In guinea pigs, black coat (B) is dominant over white coat (b), and rough hair (R) is dominant over smooth hair (r). Which gametes can a guinea pig with genotype BbRr produce?",
    "metadata": [
      "Bb, Rr, BB and rr",
      "BR, Br, bR, br",
      "BR and br only",
      "Bb and Rr only",
      ""
    ],
    "answer": [
      "BR, Br, bR, br",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "molecular_cellular_tissue_level",
    "topic": "genetics_and_inheritance",
    "subtopic": "dihybrid_gamete_genotypes",
    "skills": [
      "identify_dihybrid_gametes"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Each gamete gets ONE allele of each gene.\n- The two genes separate independently in meiosis."
  },
  {
    "name": "Question 4",
    "question": "In guinea pigs, black coat (B) is dominant over white coat (b), and rough hair (R) is dominant over smooth hair (r). What is the phenotype of a guinea pig with genotype bbRr?",
    "metadata": [
      "White coat, rough hair",
      "White coat, smooth hair",
      "Black coat, rough hair",
      "Black coat, smooth hair",
      ""
    ],
    "answer": [
      "White coat, rough hair",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "molecular_cellular_tissue_level",
    "topic": "genetics_and_inheritance",
    "subtopic": "dihybrid_phenotype_from_genotype",
    "skills": [
      "derive_dihybrid_phenotype"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- bb has no dominant allele for coat colour.\n- Rr has one dominant allele for hair type."
  },
  {
    "name": "Question 5",
    "question": "In guinea pigs, black coat (B) is dominant over white coat (b), and rough hair (R) is dominant over smooth hair (r). Two BbRr guinea pigs are crossed. Out of every 16 offspring, how many are expected to have a black, smooth coat?",
    "metadata": [
      "= ",
      "[ ]",
      " out of 16"
    ],
    "answer": [
      "3",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "calc",
    "unit": "molecular_cellular_tissue_level",
    "topic": "genetics_and_inheritance",
    "subtopic": "dihybrid_phenotypic_ratio",
    "skills": [
      "calculate_dihybrid_phenotype_count"
    ],
    "difficulty": 4,
    "exam_weight": 2,
    "xp": 10,
    "order": 5,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p2",
    "keyboard_type": "standard_math",
    "clues": "- A dihybrid cross of two heterozygotes gives a 9 : 3 : 3 : 1 ratio.\n- Black and smooth is one dominant and one recessive trait."
  },
  {
    "name": "Question 6",
    "question": "In guinea pigs, white coat (b) and smooth hair (r) are both recessive. Which gametes can a white guinea pig with smooth hair produce?",
    "metadata": [
      "bb and rr",
      "br and bR",
      "b only",
      "br only",
      ""
    ],
    "answer": [
      "br only",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "molecular_cellular_tissue_level",
    "topic": "genetics_and_inheritance",
    "subtopic": "dihybrid_gamete_genotypes",
    "skills": [
      "identify_dihybrid_gametes"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "xp": 10,
    "order": 6,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- First write the genotype of a white, smooth guinea pig.\n- Each gamete gets one allele of each gene."
  }
];

const aiExplanation = {
  sub_questions: [
    {
      "number": "1.5.1",
      "marks": 1,
      "clues": "- Two genes are followed: wing-spot colour and eye colour.",
      "approach": "- Count the genes being crossed.\n- Name the cross for two genes.",
      "solution": "1. The cross follows two genes at once.\n2. It is a dihybrid cross."
    },
    {
      "number": "1.5.2",
      "marks": 2,
      "clues": "- The dominant allele is shown by the capital letter.",
      "approach": "- Find the capital letter for each gene.\n- Give the characteristic it codes for.",
      "solution": "1. Wing-spot colour: R (red spots) is dominant over r (grey spots).\n2. Eye colour: E (black eyes) is dominant over e (brown eyes).\n3. Answer: red spots and black eyes."
    },
    {
      "number": "1.5.3(a)",
      "marks": 4,
      "clues": "- Red spots need at least one R.\n- Brown eyes are recessive, so they need ee.",
      "approach": "- List every genotype with at least one R.\n- Combine each with ee.",
      "solution": "1. Red spots can be RR or Rr.\n2. Brown eyes must be ee.\n3. The genotypes at X are RRee and Rree."
    },
    {
      "number": "1.5.3(b)",
      "marks": 1,
      "clues": "- Y is the phenotype of RrEe.",
      "approach": "- Read the dominant trait for each gene in RrEe.",
      "solution": "1. Rr has a dominant R, so the spots are red.\n2. Ee has a dominant E, so the eyes are black.\n3. The phenotype at Y is red spots, black eyes."
    },
    {
      "number": "1.5.3(c)",
      "marks": 1,
      "clues": "- Grey spots and brown eyes are both recessive.",
      "approach": "- Write the genotype: rree.\n- A gamete gets one allele of each gene.",
      "solution": "1. A butterfly with grey spots and brown eyes is rree.\n2. Every gamete gets one r and one e.\n3. The gamete genotype is re."
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
