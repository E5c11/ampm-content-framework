#!/usr/bin/env node
/**
 * DBE Agricultural Sciences P2 — November 2025 — Question 4.3–4.4: Patterns of inheritance and variation (order 19)
 * Question 4.3–4.4 — patterns of inheritance, causes of variation and the importance of variation. Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-agricultural-sciences-2025-nov-p2-l19.js --curriculum temp/curriculum-vocab-agricultural-sciences.json
 *   node scripts/add-agricultural-sciences-2025-nov-p2-l19.js --dry-run
 *   node scripts/add-agricultural-sciences-2025-nov-p2-l19.js
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
  "name": "Question 4.3–4.4: Patterns of inheritance and variation",
  "syllabus": "dbe",
  "subject": "agricultural_sciences",
  "year": 2025,
  "paper": "nov_p2",
  "order": 19,
  "content_tier": "free",
  "has_video": false,
  "xp": 8,
  "tags": [
    "patterns_of_inheritance",
    "causes_of_variation",
    "importance_of_variation"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p2/q19/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p2/q19/memo_1.png"
  ],
  "exam_question_marks": 8,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Match each statement to the pattern of inheritance it describes.",
    "metadata": [
      "A - A red cow and a white bull produce a roan calf with both red and white hairs",
      "B - A red flower crossed with a white flower gives only pink flowers",
      "C - Body mass is controlled by the combined effect of many genes",
      "D - Three different alleles exist for one blood group gene",
      "1 - Codominance",
      "2 - Incomplete dominance",
      "3 - Polygenic inheritance",
      "4 - Multiple alleles"
    ],
    "answer": [
      "A-1",
      "B-2",
      "C-3",
      "D-4"
    ],
    "presentation": "match",
    "type": "application",
    "unit": "basic_agricultural_genetics",
    "topic": "patterns_of_inheritance",
    "subtopic": "agri_classification",
    "skills": [
      "classify_farm_concept"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p2"
  },
  {
    "name": "Question 2",
    "question": "Two calves have the same genes for growth but one is raised on poor veld and the other on good pasture. Which characteristic is mainly influenced by the environment?",
    "metadata": [
      "Coat colour of the calf",
      "Horn shape of the calf",
      "Body weight at weaning",
      "Sex of the calf at birth",
      ""
    ],
    "answer": [
      "Body weight at weaning",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "basic_agricultural_genetics",
    "topic": "variation",
    "subtopic": "agri_cause_and_effect",
    "skills": [
      "explain_agricultural_cause_and_effect"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- Feed and climate affect growth, whereas genes fix colour and sex."
  },
  {
    "name": "Question 3",
    "question": "Select ALL the reasons why variation is important in a breeding programme.",
    "metadata": [
      "It removes the need for selection",
      "It is the foundation for selection",
      "It makes genetic improvement possible",
      "It helps animals to adapt to their environment",
      "It makes every animal identical"
    ],
    "answer": [
      "It is the foundation for selection",
      "It makes genetic improvement possible",
      "It helps animals to adapt to their environment",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "basic_agricultural_genetics",
    "topic": "variation",
    "subtopic": "agri_classification",
    "skills": [
      "classify_farm_concept"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p2",
    "clues": "- Breeders can only select among animals that differ."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "4.3.1",
      "marks": 1,
      "clues": "- Both purple and white appear in the same flower.\n- Neither allele hides the other.",
      "approach": "- Read the statement.\n- Name the pattern.",
      "solution": "1. Both colours show in the same flower: codominance."
    },
    {
      "number": "4.3.2",
      "marks": 1,
      "clues": "- Many genes combine to influence one trait.\n- Think about quantitative traits.",
      "approach": "- Read the statement.\n- Name the pattern.",
      "solution": "1. Milk production is influenced by a combination of many genes: polygenic inheritance."
    },
    {
      "number": "4.3.3",
      "marks": 1,
      "clues": "- There are four alleles for one gene.\n- Name the pattern with more than two alleles.",
      "approach": "- Read the statement.\n- Name the pattern.",
      "solution": "1. Four alleles for the C gene: multiple alleles."
    },
    {
      "number": "4.3.4",
      "marks": 1,
      "clues": "- A white cow and a black bull produce a grey calf.\n- The offspring shows a blend.",
      "approach": "- Read the statement.\n- Name the pattern.",
      "solution": "1. A grey calf from a white cow and a black bull is incomplete dominance."
    },
    {
      "number": "4.4.1",
      "marks": 2,
      "clues": "- Look at the picture of individuals of the same species.\n- Some differences are inherited and some come from feed and care.",
      "approach": "- Identify a characteristic that is genetic.\n- Identify one that is environmental.",
      "solution": "1. (a) Genetic: horn conformation, colour, body conformation or size.\n2. (b) Environmental: body weight."
    },
    {
      "number": "4.4.2",
      "marks": 2,
      "clues": "- Variation provides material for breeders.\n- Give two aspects.",
      "approach": "- Recall why variation matters.\n- Choose two points.",
      "solution": "1. Variation is the foundation for selection and leads to genetic improvement (also adaptability, disease resistance and new breeds)."
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
