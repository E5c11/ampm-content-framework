#!/usr/bin/env node
/**
 * DBE Agricultural Sciences P1 — November 2025 — Question 3.6: Parasites and their control (order 12)
 * Question 3.6 and Section A item 1.1.8 — internal and external parasites, life cycles, economic implications and preventative measures. Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-agricultural-sciences-2025-nov-p1-l12.js --curriculum temp/curriculum-vocab-agricultural-sciences.json
 *   node scripts/add-agricultural-sciences-2025-nov-p1-l12.js --dry-run
 *   node scripts/add-agricultural-sciences-2025-nov-p1-l12.js
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
  "name": "Question 3.6: Parasites and their control",
  "syllabus": "dbe",
  "subject": "agricultural_sciences",
  "year": 2025,
  "paper": "nov_p1",
  "order": 12,
  "content_tier": "free",
  "has_video": false,
  "xp": 8,
  "tags": [
    "internal_parasites",
    "external_parasites",
    "parasite_control"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p1/q12/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p1/q12/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p1/q12/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p1/q12/memo_2.png"
  ],
  "exam_question_marks": 8,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Parasites that live on the skin of animals, such as ticks and lice, are called ____ parasites. Give the missing word. []",
    "metadata": [
      "Missing word: ",
      "[ ]"
    ],
    "answer": [
      "external|ecto",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "text",
    "type": "definition",
    "unit": "animal_production_protection_and_control",
    "topic": "parasites_of_farm_animals",
    "subtopic": "agri_term_recall",
    "skills": [
      "recall_agricultural_term"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Think about where on or in the animal the parasite lives."
  },
  {
    "name": "Question 2",
    "question": "Select ALL the measures that help to prevent internal parasites in a flock.",
    "metadata": [
      "Spraying the animals with an acaricide",
      "Rotating the animals between camps",
      "Dipping the animals in a plunge dip",
      "Resting heavily infested camps",
      "Removing manure from the kraal"
    ],
    "answer": [
      "Rotating the animals between camps",
      "Resting heavily infested camps",
      "Removing manure from the kraal",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "animal_production_protection_and_control",
    "topic": "parasites_of_farm_animals",
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
    "paper": "nov_p1",
    "clues": "- Spraying and dipping act on parasites on the outside of the animal."
  },
  {
    "name": "Question 3",
    "question": "Which statement correctly differentiates a tapeworm from a one-host tick?",
    "metadata": [
      "Neither parasite needs a host to complete its life cycle",
      "Both parasites need exactly two hosts to complete their life cycles",
      "The tick needs two hosts, while the tapeworm needs only one",
      "The tapeworm needs two hosts, while the one-host tick needs only one",
      ""
    ],
    "answer": [
      "The tapeworm needs two hosts, while the one-host tick needs only one",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "animal_production_protection_and_control",
    "topic": "parasites_of_farm_animals",
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
    "paper": "nov_p1",
    "clues": "- A tapeworm uses an intermediate host before reaching its final host."
  },
  {
    "name": "Question 4",
    "question": "Select ALL the economic implications of heavy infestation with internal parasites.",
    "metadata": [
      "Increased income from the sale of animals",
      "Higher costs for dosing and veterinary treatment",
      "A lower need for treatment and veterinary services",
      "Poorer production and downgraded carcasses",
      "Higher feeding costs for the same weight gain"
    ],
    "answer": [
      "Higher feeding costs for the same weight gain",
      "Higher costs for dosing and veterinary treatment",
      "Poorer production and downgraded carcasses",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "animal_production_protection_and_control",
    "topic": "parasites_of_farm_animals",
    "subtopic": "agri_cause_and_effect",
    "skills": [
      "explain_agricultural_cause_and_effect"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Heavily infested animals eat and cost more but produce less."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "3.6.1",
      "marks": 1,
      "clues": "- Diagram A shows a long, flat worm and two hosts.\n- It lives inside the intestines.",
      "approach": "- Study the life cycle drawing.\n- Name the parasite shown.",
      "solution": "1. The parasite in diagram A is a tapeworm."
    },
    {
      "number": "3.6.2",
      "marks": 1,
      "clues": "- Diagram B shows a parasite that lives on the surface of the animal.\n- Classify it by where it occurs.",
      "approach": "- Identify the parasite in diagram B.\n- Classify it by its location on the host.",
      "solution": "1. The parasite in diagram B is an external (ecto) parasite."
    },
    {
      "number": "3.6.3",
      "marks": 2,
      "clues": "- Compare the number of hosts and stages in each life cycle.\n- Write one point for each diagram.",
      "approach": "- Count the hosts in diagram A and in diagram B.\n- Note the number of stages in each.",
      "solution": "1. Diagram A: the parasite needs two hosts to complete its cycle (three-stage life cycle).\n2. Diagram B: the parasite needs one host to complete its cycle (four-stage life cycle)."
    },
    {
      "number": "3.6.4",
      "marks": 2,
      "clues": "- Internal parasites reduce the performance of animals.\n- Think about costs and income.",
      "approach": "- List the effects of internal parasites on production.\n- Convert two of them to costs or loss of income.",
      "solution": "1. High feeding costs and high treatment costs.\n2. Poor production, degraded carcasses and loss of income are also accepted."
    },
    {
      "number": "1.1.8",
      "marks": 2,
      "clues": "- Preventative measures stop worms from building up.\n- Spraying treats the outside of the animal.",
      "approach": "- Check each of (i)–(iv) against internal parasite prevention.\n- Select the combination that contains only preventative measures.",
      "solution": "1. Removing manure from the kraal, resting infested pastures and rotational grazing are preventative measures.\n2. Spraying medication is treatment and not prevention, so the answer is C: (i), (iii) and (iv)."
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
