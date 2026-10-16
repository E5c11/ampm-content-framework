#!/usr/bin/env node
/**
 * DBE Agricultural Sciences P1 — November 2024 — Question 4.6–4.7: Parturition, milk let-down and colostrum (order 18)
 * Question 4.6–4.7 — the sequence of parturition, stimulating milk let-down, the action of oxytocin, the dry period and colostrum. Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-agricultural-sciences-2024-nov-p1-l18.js --curriculum temp/curriculum-vocab-agricultural-sciences.json
 *   node scripts/add-agricultural-sciences-2024-nov-p1-l18.js --dry-run
 *   node scripts/add-agricultural-sciences-2024-nov-p1-l18.js
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
  "name": "Question 4.6–4.7: Parturition, milk let-down and colostrum",
  "syllabus": "dbe",
  "subject": "agricultural_sciences",
  "year": 2024,
  "paper": "nov_p1",
  "order": 18,
  "content_tier": "free",
  "has_video": false,
  "xp": 8,
  "tags": [
    "stages_of_parturition",
    "milk_ejection"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2024/nov_p1/q18/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2024/nov_p1/q18/memo_1.png"
  ],
  "exam_question_marks": 8,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Arrange the events of calving in the correct order.",
    "metadata": [
      "The cow strains hard and the calf is pushed out",
      "The cow is restless and the cervix starts to dilate",
      "The placenta (afterbirth) is expelled",
      "The water bag appears at the vulva and breaks"
    ],
    "answer": [
      "The cow is restless and the cervix starts to dilate",
      "The water bag appears at the vulva and breaks",
      "The cow strains hard and the calf is pushed out",
      "The placenta (afterbirth) is expelled"
    ],
    "presentation": "ordering",
    "type": "ordering",
    "unit": "animal_reproduction",
    "topic": "pregnancy_and_parturition",
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
    "clues": "- The birth canal must open before the calf can pass through it.\n- The membranes that surrounded the calf leave the body last."
  },
  {
    "name": "Question 2",
    "question": "Select ALL the practices that help to stimulate milk let-down before milking.",
    "metadata": [
      "Washing the udder with warm water",
      "Shouting at the cows to hurry them",
      "Massaging the udder for a short time",
      "Letting the calf suckle for a moment",
      "Giving the cow an adrenaline injection"
    ],
    "answer": [
      "Washing the udder with warm water",
      "Massaging the udder for a short time",
      "Letting the calf suckle for a moment",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "animal_reproduction",
    "topic": "lactation",
    "subtopic": "agri_scenario_application",
    "skills": [
      "apply_practice_to_scenario"
    ],
    "difficulty": 3,
    "exam_weight": 1,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Let-down is a reflex started by pleasant stimulation of the udder.\n- Stress and fear release a hormone that blocks it."
  },
  {
    "name": "Question 3",
    "question": "How does oxytocin cause milk to be let down in a dairy cow?",
    "metadata": [
      "It makes the alveolar cells produce more milk",
      "It relaxes the teat sphincter so milk can drip",
      "It widens the blood vessels that supply the udder",
      "It makes the cells around the alveoli contract",
      ""
    ],
    "answer": [
      "It makes the cells around the alveoli contract",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "animal_reproduction",
    "topic": "lactation",
    "subtopic": "agri_cause_and_effect",
    "skills": [
      "explain_agricultural_cause_and_effect"
    ],
    "difficulty": 3,
    "exam_weight": 1,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Prolactin controls milk synthesis; oxytocin controls milk ejection.\n- Milk must be squeezed out of the tiny sacs where it is stored."
  },
  {
    "name": "Question 4",
    "question": "Name the first milk a cow produces after calving, which is rich in antibodies and must be fed to the newborn calf. []",
    "metadata": [
      "First milk: ",
      "[ ]"
    ],
    "answer": [
      "colostrum|beestings",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "text",
    "type": "definition",
    "unit": "animal_reproduction",
    "topic": "lactation",
    "subtopic": "agri_term_recall",
    "skills": [
      "recall_agricultural_term"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- The calf is born without its own immunity and gets it from this thick, yellow milk."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "4.6",
      "marks": 4,
      "clues": "- The foetus first gets into position, then the birth canal opens.\n- The placenta is expelled last.",
      "approach": "- Find the statement about the position of the foetus.\n- Follow with the forming of the birth canal and the birth.\n- End with the expulsion of the placenta.",
      "solution": "1. D: the foetus lies with its front feet towards the cervix.\n2. B: the vagina, cervix and uterus form a common canal.\n3. C: the cow lies down and the head and front legs emerge.\n4. A: the uterus contracts to expel the placenta."
    },
    {
      "number": "4.7.1",
      "marks": 1,
      "clues": "- Let-down starts with stimulation of the nervous system.\n- Think of touch, warmth or the calf.",
      "approach": "- Recall how the milker can stimulate let-down.\n- State one method.",
      "solution": "1. Washing the udder with warm water, massaging the udder, bringing the calf close or making familiar sounds (any one)."
    },
    {
      "number": "4.7.2",
      "marks": 1,
      "clues": "- Oxytocin acts on the cells around the alveoli.",
      "approach": "- Recall the target cells of oxytocin.\n- Describe its action.",
      "solution": "1. Oxytocin causes the myoepithelial cells surrounding the alveoli to contract."
    },
    {
      "number": "4.7.3",
      "marks": 1,
      "clues": "- The cow has been producing milk for about 305 days.",
      "approach": "- Think about what the udder needs before the next lactation.\n- State the importance of the dry period.",
      "solution": "1. It gives the glandular tissue of the udder time to recover."
    },
    {
      "number": "4.7.4",
      "marks": 1,
      "clues": "- The substance gives the newborn calf protection against diseases.",
      "approach": "- Recall what gives the calf passive immunity.\n- Name the substance.",
      "solution": "1. Antibodies (immunoglobulins)."
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
