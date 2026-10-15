#!/usr/bin/env node
/**
 * DBE Agricultural Sciences P2 — November 2025 — Question 4.5: Breeding systems and selection (order 20)
 * Question 4.5 — inbreeding, artificial selection, the disadvantages of inbreeding and pedigree selection. Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-agricultural-sciences-2025-nov-p2-l20.js --curriculum temp/curriculum-vocab-agricultural-sciences.json
 *   node scripts/add-agricultural-sciences-2025-nov-p2-l20.js --dry-run
 *   node scripts/add-agricultural-sciences-2025-nov-p2-l20.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

// ─── Phase 2 — lesson document ───────────────────────────────────────────────

const video = {
  "name": "Question 4.5: Breeding systems and selection",
  "syllabus": "dbe",
  "subject": "agricultural_sciences",
  "year": 2025,
  "paper": "nov_p2",
  "order": 20,
  "content_tier": "free",
  "has_video": false,
  "xp": 6,
  "tags": [
    "inbreeding",
    "artificial_selection",
    "pedigree_selection"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p2/q20/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p2/q20/memo_1.png"
  ],
  "exam_question_marks": 6,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "A breeder mates a bull with his own daughters to keep the genes of the bull in the herd. Which breeding system is this?",
    "metadata": [
      "Outbreeding",
      "Inbreeding",
      "Crossbreeding",
      "Upgrading",
      ""
    ],
    "answer": [
      "Inbreeding",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "basic_agricultural_genetics",
    "topic": "breeding_and_selection",
    "subtopic": "agri_scenario_application",
    "skills": [
      "apply_practice_to_scenario"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- The animals that are mated are closely related."
  },
  {
    "name": "Question 2",
    "question": "Select ALL the disadvantages of inbreeding.",
    "metadata": [
      "Greater adaptability to the environment",
      "Inbreeding depression and lower performance",
      "Lethal genes and deformities are expressed",
      "Lower resistance to diseases",
      "More variation in the herd"
    ],
    "answer": [
      "Inbreeding depression and lower performance",
      "Lethal genes and deformities are expressed",
      "Lower resistance to diseases",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "basic_agricultural_genetics",
    "topic": "breeding_and_selection",
    "subtopic": "agri_classification",
    "skills": [
      "classify_farm_concept"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- Inbreeding makes undesired genes homozygous."
  },
  {
    "name": "Question 3",
    "question": "A farmer chooses the fastest-growing bulls to be the sires of the next generation. Which type of selection is this?",
    "metadata": [
      "Sexual selection",
      "Natural selection",
      "Random selection",
      "Artificial selection",
      ""
    ],
    "answer": [
      "Artificial selection",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "basic_agricultural_genetics",
    "topic": "breeding_and_selection",
    "subtopic": "agri_scenario_application",
    "skills": [
      "apply_practice_to_scenario"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- Humans, not nature, decide which animals breed."
  },
  {
    "name": "Question 4",
    "question": "Match each method of selection to how it works.",
    "metadata": [
      "A - Mass selection",
      "B - Pedigree selection",
      "C - Family selection",
      "D - Progeny selection",
      "1 - Choosing animals on their own performance",
      "2 - Choosing animals on the performance of their ancestors",
      "3 - Choosing animals on the average of a family group",
      "4 - Choosing parents on the performance of their offspring"
    ],
    "answer": [
      "A-1",
      "B-2",
      "C-3",
      "D-4"
    ],
    "presentation": "match",
    "type": "definition",
    "unit": "basic_agricultural_genetics",
    "topic": "breeding_and_selection",
    "subtopic": "agri_classification",
    "skills": [
      "classify_farm_concept"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p2"
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "4.5.1",
      "marks": 2,
      "clues": "- Look at the lines in the illustration that join the breeds.\n- The breeders pick the breeds that they mate.",
      "approach": "- Identify the system between breed C and breed D.\n- Name the type of selection.",
      "solution": "1. (a) The breeding system is inbreeding.\n2. (b) The type of selection is artificial selection."
    },
    {
      "number": "4.5.2",
      "marks": 1,
      "clues": "- Define what inbreeding is.\n- Refer to the relationship between the animals.",
      "approach": "- Recall the definition.\n- State it in one sentence.",
      "solution": "1. Inbreeding is the mating of closely related animals."
    },
    {
      "number": "4.5.3",
      "marks": 2,
      "clues": "- Inbreeding makes undesired genes homozygous.\n- Give two disadvantages.",
      "approach": "- Recall the effects of inbreeding.\n- Choose two.",
      "solution": "1. Inbreeding depression (lower performance) and the expression of lethal genes or deformities (also reduced vitality, low disease resistance and loss of variation)."
    },
    {
      "number": "4.5.4",
      "marks": 1,
      "clues": "- Breed E was selected on the performance of its parents.\n- Name the selection method.",
      "approach": "- Read what breed E was based on.\n- Name the method.",
      "solution": "1. The method of selection is pedigree selection."
    }
  ],
  "model": "claude-sonnet-5-5",
  "generated_at": Date.now(),
  "version": 2,
  "reviewed": false,
  "input_tokens": 0,
  "output_tokens": 0,
  "avg_rating": null,
  "rating_count": null
};

// ─── Upload ──────────────────────────────────────────────────────────────────

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

  // Exam gate (VER-02/VER-04/VER-09): derive the exam minimum from the rows now in the database and write it. Dev only; no-op at the floor.
  if (!DRY_RUN && ENV === 'dev') {
    const { applyExamGates } = require('../tools/lib/exam-gate');
    await applyExamGates(pool, { env: ENV, apply: true, filter: { subject: video.subject, syllabus: video.syllabus, year: String(video.year) } });
  } else if (DRY_RUN) {
    console.log('   (dry-run: the exam gate is derived and written after a real upload — node tools/apply-exam-gate.js shows it)');
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
