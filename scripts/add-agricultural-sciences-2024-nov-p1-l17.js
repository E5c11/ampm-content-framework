#!/usr/bin/env node
/**
 * DBE Agricultural Sciences P1 — November 2024 — Question 4.4–4.5: Artificial insemination and embryo transfer (order 17)
 * Question 4.4–4.5 — the steps of artificial insemination, the roles of the substances in a semen dilutant, and embryo transfer with its donor and recipient cows. Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-agricultural-sciences-2024-nov-p1-l17.js --curriculum temp/curriculum-vocab-agricultural-sciences.json
 *   node scripts/add-agricultural-sciences-2024-nov-p1-l17.js --dry-run
 *   node scripts/add-agricultural-sciences-2024-nov-p1-l17.js
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
  "name": "Question 4.4–4.5: Artificial insemination and embryo transfer",
  "syllabus": "dbe",
  "subject": "agricultural_sciences",
  "year": 2024,
  "paper": "nov_p1",
  "order": 17,
  "content_tier": "free",
  "has_video": false,
  "xp": 11,
  "tags": [
    "artificial_insemination",
    "semen_storage",
    "embryo_transfer"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2024/nov_p1/q17/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2024/nov_p1/q17/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2024/nov_p1/q17/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2024/nov_p1/q17/memo_2.png"
  ],
  "exam_question_marks": 11,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Arrange the steps of artificial insemination in the correct order.",
    "metadata": [
      "Evaluate the semen and mix it with a dilutant",
      "Thaw a straw and inseminate the cow on heat",
      "Collect semen from a bull with desired traits",
      "Store the semen straws in liquid nitrogen"
    ],
    "answer": [
      "Collect semen from a bull with desired traits",
      "Evaluate the semen and mix it with a dilutant",
      "Store the semen straws in liquid nitrogen",
      "Thaw a straw and inseminate the cow on heat"
    ],
    "presentation": "ordering",
    "type": "ordering",
    "unit": "animal_reproduction",
    "topic": "semen_and_artificial_insemination",
    "subtopic": "agri_process_sequence",
    "skills": [
      "sequence_agricultural_process"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Semen must be checked and extended before it can be frozen.\n- Frozen straws are thawed just before use."
  },
  {
    "name": "Question 2",
    "question": "Match each substance in a semen dilutant to its role.",
    "metadata": [
      "A - Antibiotics",
      "B - Buffers",
      "C - Egg yolk",
      "D - Glycerol",
      "1 - Stop bacteria from growing",
      "2 - Keep the pH of the semen stable",
      "3 - Feeds sperm and prevents cold shock",
      "4 - Protects sperm cells during freezing"
    ],
    "answer": [
      "A-1",
      "B-2",
      "C-3",
      "D-4"
    ],
    "presentation": "match",
    "type": "definition",
    "unit": "animal_reproduction",
    "topic": "semen_and_artificial_insemination",
    "subtopic": "agri_term_recall",
    "skills": [
      "recall_agricultural_term"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Each substance protects the sperm cells against a different threat: infection, acid, cold or ice crystals."
  },
  {
    "name": "Question 3",
    "question": "Select ALL the correct statements about embryo transfer in cattle.",
    "metadata": [
      "Embryos are flushed from a superior donor",
      "The recipient passes its genes to the calf",
      "Recipient cows carry the embryos to birth",
      "The donor is superovulated with hormones",
      "A donor can produce only one calf a year"
    ],
    "answer": [
      "Embryos are flushed from a superior donor",
      "Recipient cows carry the embryos to birth",
      "The donor is superovulated with hormones",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "animal_reproduction",
    "topic": "cloning_and_embryo_transfer",
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
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- The genes of the calf come from the embryo, not from the cow that carries it.\n- Hormones make the donor release many eggs at once."
  },
  {
    "name": "Question 4",
    "question": "Which of the following is a DISADVANTAGE of embryo transfer for a cattle farmer?",
    "metadata": [
      "It spreads the genes of top cows faster",
      "It is costly and needs skilled people",
      "It lets embryos be frozen and exported",
      "It gives more calves from one top cow",
      ""
    ],
    "answer": [
      "It is costly and needs skilled people",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "animal_reproduction",
    "topic": "cloning_and_embryo_transfer",
    "subtopic": "agri_cause_and_effect",
    "skills": [
      "explain_agricultural_cause_and_effect"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Three of the options are benefits of the technique.\n- Think about what the farmer must pay for and who must do the work."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "4.4.1",
      "marks": 1,
      "clues": "- At stage 7 a technician places semen into the cow.",
      "approach": "- Follow the stages from the bull to the cow.\n- Name the technique.",
      "solution": "1. Artificial insemination (AI)."
    },
    {
      "number": "4.4.2",
      "marks": 1,
      "clues": "- At stage 2 the semen is collected from the bull.",
      "approach": "- Recall the methods of semen collection.\n- Name the one shown.",
      "solution": "1. The use of an artificial vagina."
    },
    {
      "number": "4.4.3",
      "marks": 3,
      "clues": "- Each substance protects the sperm in a different way.",
      "approach": "- Give the role of antibiotics.\n- Give the role of buffers.\n- Give the role of egg yolk.",
      "solution": "1. (a) Antibiotics prevent bacterial growth and infections.\n2. (b) Buffers protect against changes in pH.\n3. (c) Egg yolk provides nutrients for the sperm cells and prevents cold shock."
    },
    {
      "number": "4.5.1",
      "marks": 2,
      "clues": "- Embryos move from one cow to others.\n- Name both kinds of cow in the definition.",
      "approach": "- Describe where the embryos come from.\n- Describe where they are placed.",
      "solution": "1. Embryo transfer is a technique in which embryos are harvested from the donor cow.\n2. The embryos are transferred to recipient cows."
    },
    {
      "number": "4.5.2",
      "marks": 2,
      "clues": "- Female 1 gives the embryos.\n- Females 2, 3 and 4 receive them.",
      "approach": "- Name the role of Female 1.\n- Name the role of Females 2, 3 and 4.",
      "solution": "1. (a) Female 1: donor (superior) cow.\n2. (b) Females 2, 3 and 4: recipient (surrogate) cows."
    },
    {
      "number": "4.5.3",
      "marks": 1,
      "clues": "- Why would a farmer choose this cow to supply the embryos?",
      "approach": "- Think about the genetic value of the donor.\n- State its importance.",
      "solution": "1. It provides genetically superior characteristics (embryos)."
    },
    {
      "number": "4.5.4",
      "marks": 1,
      "clues": "- Think about cost, skill and the chance of success.",
      "approach": "- Recall the disadvantages of embryo transfer.\n- State one.",
      "solution": "1. It is expensive, needs skill and experience, synchronisation is difficult, or pregnancy may fail (any one)."
    }
  ],
  "model": "claude-opus-5-5",
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
  // database and write it to exam_versions, bumping updated_at on the exam's rows. Dev only; a no-op when the derived
  // minimum is the floor (VER-07); idempotent. The gate is per EXAM, so it also gates the sibling papers.
  if (!DRY_RUN && ENV === 'dev') {
    const { applyExamGates } = require('../tools/lib/exam-gate');
    await applyExamGates(pool, { env: ENV, apply: true, filter: { subject: video.subject, syllabus: video.syllabus, year: String(video.year) } });
  } else if (DRY_RUN) {
    console.log('   (dry-run: the exam gate is derived and written after a real upload — node tools/apply-exam-gate.js shows it)');
  }
}

// Only run when invoked directly — so validate-questions.js (and anything else) can load
// this file for its data blocks without opening a DB connection or writing anything.
if (require.main === module) {
  upload()
    .catch((err) => {
      console.error('\n❌ Upload failed:', err.message);
      process.exitCode = 1;
    })
    .finally(closePool);
}
