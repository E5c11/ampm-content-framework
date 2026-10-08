#!/usr/bin/env node
/**
 * DBE Life Sciences P2 — November 2024 — Question 3.2 (Phylogenetic Trees) (order 12)
 *
 * Real Q3.2 (9 marks): primate phylogenetic tree with ancestors P–V — common ancestor of all (V), closest to Old-world monkeys
 * (gibbons/U) and reason, three species sharing R (humans, chimpanzees, gorillas), three upper-limb features humans share with
 * group P. Exam page 12 (cropped 12:start=273); memo page 9. Practice uses a generated carnivore tree (ancestors J–O) at
 * question_supplementary/life_science/2024/nov_p2/q12/diagram_1.png, checked against each stem. Independent lesson.
 *
 * Keyboard (KEYBOARD-04, core/keyboard-input.md): every typed fitb declares keyboard_type — standard_math for a bare
 * number, text for a single canonical term. The exam gate is derived from the rows by tools/apply-exam-gate.js (VER-09).
 * Do NOT copy a P2 2025 script as a template: those predate KEYBOARD-04 (tools/lib/legacy-keyboard-allowlist.js).
 * Reminder: don't factor shared text into an outer const used inside `questions` — validate-questions.js evals the
 * `questions = [...]` block in isolation.
 *
 *   node tools/validate-questions.js --script scripts/add-life-science-2024-nov-p2-q3-2-phylogenetic-tree.js --curriculum temp/curriculum-vocab-life-science-p2-2024.json
 *   node scripts/add-life-science-2024-nov-p2-q3-2-phylogenetic-tree.js --dry-run
 *   node scripts/add-life-science-2024-nov-p2-q3-2-phylogenetic-tree.js
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
  "name": "Question 3.2 (Phylogenetic Trees)",
  "syllabus": "dbe",
  "subject": "life_science",
  "year": 2024,
  "paper": "nov_p2",
  "order": 12,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "phylogenetic_trees",
    "human_evolution"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2024/nov_p2/q12/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2024/nov_p2/q12/memo_1.png"
  ],
  "exam_question_marks": 9
};

const questions = [
  {
    "name": "Question 1",
    "question": "Use the phylogenetic tree. Which letter represents the common ancestor of ALL the animals in the tree?",
    "metadata": [
      "J",
      "K",
      "L",
      "M",
      ""
    ],
    "answer": [
      "J",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "reading",
    "unit": "diversity_change_and_continuity",
    "topic": "evolution_by_natural_selection",
    "subtopic": "phylogenetic_tree_interpretation",
    "skills": [
      "identify_common_ancestor_on_tree"
    ],
    "difficulty": 1,
    "exam_weight": 1,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p2",
    "supplementary_material": {
      "type": "diagram",
      "label": "Phylogenetic tree of some carnivores",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/life_science/2024/nov_p2/q12/diagram_1.png"
      ]
    },
    "clues": "- The oldest ancestor is at the base of the tree."
  },
  {
    "name": "Question 2",
    "question": "Use the phylogenetic tree. Which animal is most closely related to the wolf?",
    "metadata": [
      "Fox",
      "Bear",
      "Dog",
      "Lion",
      ""
    ],
    "answer": [
      "Dog",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "reading",
    "unit": "diversity_change_and_continuity",
    "topic": "evolution_by_natural_selection",
    "subtopic": "phylogenetic_tree_interpretation",
    "skills": [
      "identify_closest_relative_on_tree"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p2",
    "supplementary_material": {
      "type": "diagram",
      "label": "Phylogenetic tree of some carnivores",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/life_science/2024/nov_p2/q12/diagram_1.png"
      ]
    },
    "clues": "- Follow the wolf's branch down to the first point where it joins another branch."
  },
  {
    "name": "Question 3",
    "question": "Use the phylogenetic tree. Why is the dog more closely related to the wolf than to the fox?",
    "metadata": [
      "They look more alike than the fox does",
      "They live in the same habitats as each other",
      "They share a more recent common ancestor",
      "They share the oldest common ancestor in the tree",
      ""
    ],
    "answer": [
      "They share a more recent common ancestor",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "interpretation",
    "unit": "diversity_change_and_continuity",
    "topic": "evolution_by_natural_selection",
    "subtopic": "phylogenetic_tree_interpretation",
    "skills": [
      "explain_relatedness_from_tree"
    ],
    "difficulty": 3,
    "exam_weight": 1,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p2",
    "supplementary_material": {
      "type": "diagram",
      "label": "Phylogenetic tree of some carnivores",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/life_science/2024/nov_p2/q12/diagram_1.png"
      ]
    },
    "clues": "- Relatedness on a tree depends on where branches join, not on appearance."
  },
  {
    "name": "Question 4",
    "question": "Use the phylogenetic tree. Match each pair of animals to the letter of their most recent common ancestor.",
    "metadata": [
      "A - Wolf and dog",
      "B - Fox and wolf",
      "C - Bear and dog",
      "D - Lion and cheetah",
      "1 - K",
      "2 - N",
      "3 - L",
      "4 - M"
    ],
    "answer": [
      "A-2",
      "B-4",
      "C-1",
      "D-3"
    ],
    "presentation": "match",
    "type": "reading",
    "unit": "diversity_change_and_continuity",
    "topic": "evolution_by_natural_selection",
    "subtopic": "phylogenetic_tree_interpretation",
    "skills": [
      "identify_species_sharing_ancestor"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p2",
    "supplementary_material": {
      "type": "diagram",
      "label": "Phylogenetic tree of some carnivores",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/life_science/2024/nov_p2/q12/diagram_1.png"
      ]
    },
    "clues": "- Trace both animals down their branches.\n- The first point where the branches join is their most recent common ancestor."
  },
  {
    "name": "Question 5",
    "question": "Which features of the arms and hands do humans share with the other African apes? Select ALL that apply.",
    "metadata": [
      "Opposable thumbs",
      "Hooves on each digit",
      "Nails instead of claws",
      "Three digits on each limb",
      "Arms that rotate freely at the shoulder"
    ],
    "answer": [
      "Opposable thumbs",
      "Nails instead of claws",
      "Arms that rotate freely at the shoulder",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "diversity_change_and_continuity",
    "topic": "human_evolution",
    "subtopic": "primate_upper_limb_characteristics",
    "skills": [
      "identify_primate_limb_features"
    ],
    "difficulty": 2,
    "exam_weight": 3,
    "xp": 10,
    "order": 5,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- These features help primates grip and climb."
  }
];

const aiExplanation = {
  sub_questions: [
    {
      "number": "3.2.1",
      "marks": 1,
      "clues": "- The ancestor of all the species is at the base of the tree.",
      "approach": "- Follow every branch down to where they all meet.",
      "solution": "1. All the branches meet at the lowest point.\n2. Answer: V."
    },
    {
      "number": "3.2.2",
      "marks": 1,
      "clues": "- Follow the Old-world monkeys branch down.",
      "approach": "- Find the first point where it joins another branch.\n- Name the species on that branch.",
      "solution": "1. The Old-world monkeys branch joins at U.\n2. The other branch from U leads to the gibbons.\n3. Answer: gibbons (U is also accepted)."
    },
    {
      "number": "3.2.3",
      "marks": 1,
      "clues": "- Use the idea of the most recent common ancestor.",
      "approach": "- Link the answer to 3.2.2 with the shared ancestor.",
      "solution": "1. Gibbons and Old-world monkeys share the most recent common ancestor, U.\n2. (If U was given in 3.2.2: Old-world monkeys are directly descended from U.)"
    },
    {
      "number": "3.2.4",
      "marks": 3,
      "clues": "- Find R, then trace each branch above it.",
      "approach": "- List the species at the tips above R.",
      "solution": "1. Above R are the branches to humans, chimpanzees and gorillas (Q is also accepted).\n2. Answer: humans, chimpanzees and gorillas."
    },
    {
      "number": "3.2.5",
      "marks": 3,
      "clues": "- Group P is the African apes.\n- Think about the arms, hands and fingers.",
      "approach": "- Name three features of the upper limbs shared by apes and humans.",
      "solution": "1. Any three of: freely rotating arms, long upper arms, rotation at the elbow, rotation at the wrist.\n2. Also: bare fingertips, nails instead of claws, fingerprints.\n3. Also: opposable thumbs (precision grip), five digits per limb."
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
