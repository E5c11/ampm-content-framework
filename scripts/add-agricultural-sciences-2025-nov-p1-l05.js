#!/usr/bin/env node
/**
 * DBE Agricultural Sciences P1 — November 2025 — Question 1: Mating, lactation and the oestrus cycle (Section A) (order 5)
 * Section A items 1.3.4, 1.3.5, 1.4.4 and 1.4.5 — milk ejection, stages of parturition, mating and the corpus luteum. Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-agricultural-sciences-2025-nov-p1-l05.js --curriculum temp/curriculum-vocab-agricultural-sciences.json
 *   node scripts/add-agricultural-sciences-2025-nov-p1-l05.js --dry-run
 *   node scripts/add-agricultural-sciences-2025-nov-p1-l05.js
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
  "name": "Question 1: Mating, lactation and the oestrus cycle (Section A)",
  "syllabus": "dbe",
  "subject": "agricultural_sciences",
  "year": 2025,
  "paper": "nov_p1",
  "order": 5,
  "content_tier": "free",
  "has_video": false,
  "xp": 6,
  "tags": [
    "milk_ejection",
    "stages_of_parturition",
    "mating_stages"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p1/q5/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p1/q5/question_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p1/q5/question_3.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p1/q5/question_4.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p1/q5/memo_1.png"
  ],
  "exam_question_marks": 6,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Arrange the events of birth (parturition) in a cow in the correct order.",
    "metadata": [
      "The afterbirth is expelled",
      "The calf is pushed out through the birth canal",
      "The cervix, vagina and vulva dilate",
      "The udder fills and the cow becomes restless"
    ],
    "answer": [
      "The udder fills and the cow becomes restless",
      "The cervix, vagina and vulva dilate",
      "The calf is pushed out through the birth canal",
      "The afterbirth is expelled"
    ],
    "presentation": "ordering",
    "type": "ordering",
    "unit": "animal_reproduction",
    "topic": "pregnancy_and_parturition",
    "subtopic": "agri_process_sequence",
    "skills": [
      "sequence_agricultural_process"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p1"
  },
  {
    "name": "Question 2",
    "question": "Arrange the stages of natural mating in a bull in the correct order.",
    "metadata": [
      "Dismounting",
      "Courtship display",
      "Erection",
      "Mounting",
      "Ejaculation"
    ],
    "answer": [
      "Courtship display",
      "Erection",
      "Mounting",
      "Ejaculation",
      "Dismounting"
    ],
    "presentation": "ordering",
    "type": "ordering",
    "unit": "animal_reproduction",
    "topic": "mating_and_copulation",
    "subtopic": "agri_process_sequence",
    "skills": [
      "sequence_agricultural_process"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p1"
  },
  {
    "name": "Question 3",
    "question": "A calf suckles and, within a minute, milk starts to flow from the dam’s udder. Which hormone causes this milk ejection (milk let-down)?",
    "metadata": [
      "Oxytocin",
      "Progesterone",
      "Oestrogen",
      "Prolactin",
      ""
    ],
    "answer": [
      "Oxytocin",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "animal_reproduction",
    "topic": "lactation",
    "subtopic": "agri_cause_and_effect",
    "skills": [
      "explain_agricultural_cause_and_effect"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- The stimulus of suckling triggers a hormone from the pituitary gland.\n- One of the options controls milk production rather than its release."
  },
  {
    "name": "Question 4",
    "question": "After ovulation, the Graafian follicle changes into a temporary gland that secretes progesterone. Name this structure. []",
    "metadata": [
      "Structure: ",
      "[ ]"
    ],
    "answer": [
      "corpus luteum",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "text",
    "type": "definition",
    "unit": "animal_reproduction",
    "topic": "oestrus_cycle_and_hormones",
    "subtopic": "agri_term_recall",
    "skills": [
      "recall_agricultural_term"
    ],
    "difficulty": 3,
    "exam_weight": 1,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- It is yellow in colour and its name has two Latin words."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "1.3.4",
      "marks": 2,
      "clues": "- Oxytocin acts on the udder.\n- The description is about releasing milk, not making it.",
      "approach": "- Recall the hormone and the process that releases milk from the udder.\n- Give the name of this process.",
      "solution": "1. The release of milk from the udder through the action of oxytocin is milk ejection (milk let-down)."
    },
    {
      "number": "1.3.5",
      "marks": 2,
      "clues": "- Birth happens in three stages.\n- The first stage prepares the birth canal.",
      "approach": "- Recall the stages of parturition.\n- Match the description of the cervix, vagina and vulva dilating.",
      "solution": "1. The stage when the cervix, vagina and vulva dilate and the foetus moves into the birth canal is the preparatory stage (dilation)."
    },
    {
      "number": "1.4.4",
      "marks": 1,
      "clues": "- Mating has several stages in a fixed order.\n- Think about what the bull does after ejaculating.",
      "approach": "- Recall the stages of mating in bulls.\n- Replace the underlined word with the stage that follows ejaculation.",
      "solution": "1. The stage after ejaculation is dismounting: the bull climbs off the cow."
    },
    {
      "number": "1.4.5",
      "marks": 1,
      "clues": "- The structure forms after ovulation.\n- The Graafian follicle exists before ovulation.",
      "approach": "- Recall what the follicle becomes after ovulation.\n- Replace the underlined word with that structure.",
      "solution": "1. After ovulation the ruptured follicle develops into the corpus luteum, so the Graafian follicle develops before, not after, ovulation."
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
