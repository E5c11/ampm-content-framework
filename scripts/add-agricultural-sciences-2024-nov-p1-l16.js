#!/usr/bin/env node
/**
 * DBE Agricultural Sciences P1 — November 2024 — Question 4.2–4.3: Oestrus synchronisation, fertility of bulls and the oestrus cycle (order 16)
 * Question 4.2–4.3 — methods of synchronising oestrus, causes of sterility and infertility in bulls, and the stages of the oestrus cycle. Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-agricultural-sciences-2024-nov-p1-l16.js --curriculum temp/curriculum-vocab-agricultural-sciences.json
 *   node scripts/add-agricultural-sciences-2024-nov-p1-l16.js --dry-run
 *   node scripts/add-agricultural-sciences-2024-nov-p1-l16.js
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
  "name": "Question 4.2–4.3: Oestrus synchronisation, fertility of bulls and the oestrus cycle",
  "syllabus": "dbe",
  "subject": "agricultural_sciences",
  "year": 2024,
  "paper": "nov_p1",
  "order": 16,
  "content_tier": "free",
  "has_video": false,
  "xp": 8,
  "tags": [
    "oestrus_cycle",
    "stages_of_oestrus",
    "oestrus_detection"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2024/nov_p1/q16/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2024/nov_p1/q16/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2024/nov_p1/q16/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2024/nov_p1/q16/memo_2.png"
  ],
  "exam_question_marks": 8,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "A farmer wants all her heifers to come on heat in the same week. Select ALL the methods she can use to synchronise oestrus.",
    "metadata": [
      "Keep the bull with the herd all year",
      "Inject prostaglandin to end the cycle",
      "Insert a CIDR device into the vagina",
      "Give the heifers extra vitamin A",
      "Mix MGA hormone into the feed"
    ],
    "answer": [
      "Inject prostaglandin to end the cycle",
      "Insert a CIDR device into the vagina",
      "Mix MGA hormone into the feed",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "animal_reproduction",
    "topic": "oestrus_cycle_and_hormones",
    "subtopic": "agri_scenario_application",
    "skills": [
      "apply_practice_to_scenario"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Synchronisation controls the cycle with hormones.\n- Look for options that give hormones by injection, implant or feed."
  },
  {
    "name": "Question 2",
    "question": "Match each problem to the factor that causes sterility or infertility in a bull.",
    "metadata": [
      "A - Very hot summer conditions",
      "B - A testis that stayed in the abdomen",
      "C - A trichomoniasis infection",
      "D - Serving far too many cows",
      "1 - Heat stress",
      "2 - Cryptorchidism",
      "3 - Disease",
      "4 - Overuse of the bull"
    ],
    "answer": [
      "A-1",
      "B-2",
      "C-3",
      "D-4"
    ],
    "presentation": "match",
    "type": "application",
    "unit": "animal_reproduction",
    "topic": "male_reproductive_system",
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
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Sperm cells need a temperature lower than body temperature.\n- Think about environment, anatomy, health and management."
  },
  {
    "name": "Question 3",
    "question": "Arrange the stages of the oestrus cycle of a cow in order, starting with the stage in which follicles develop.",
    "metadata": [
      "Metoestrus",
      "Pro-oestrus",
      "Dioestrus",
      "Oestrus"
    ],
    "answer": [
      "Pro-oestrus",
      "Oestrus",
      "Metoestrus",
      "Dioestrus"
    ],
    "presentation": "ordering",
    "type": "ordering",
    "unit": "animal_reproduction",
    "topic": "oestrus_cycle_and_hormones",
    "subtopic": "agri_process_sequence",
    "skills": [
      "sequence_agricultural_process"
    ],
    "difficulty": 3,
    "exam_weight": 1,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Ask which stage comes just before heat and which comes straight after it."
  },
  {
    "name": "Question 4",
    "question": "Match each stage of the oestrus cycle to what happens during it.",
    "metadata": [
      "A - Pro-oestrus",
      "B - Oestrus",
      "C - Metoestrus",
      "D - Dioestrus",
      "1 - Follicles grow and oestrogen starts to rise",
      "2 - The cow stands still when she is mounted",
      "3 - Ovulation is over and a corpus luteum forms",
      "4 - The longest stage, as the uterus prepares"
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
    "topic": "oestrus_cycle_and_hormones",
    "subtopic": "agri_term_recall",
    "skills": [
      "recall_agricultural_term"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- The cow only accepts the bull during one short stage.\n- Progesterone from the corpus luteum dominates the longest stage."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "4.2.1",
      "marks": 1,
      "clues": "- The females are made to come on heat at the same time.",
      "approach": "- Identify the process described.\n- Name it.",
      "solution": "1. Oestrus synchronisation."
    },
    {
      "number": "4.2.2",
      "marks": 1,
      "clues": "- Synchronisation uses hormones.\n- They can be injected, implanted or fed.",
      "approach": "- Recall the methods used to synchronise oestrus.\n- Give one.",
      "solution": "1. Injecting prostaglandin, FSH/LH, stilboestrol or GnRH; progesterone implants; MGA/PG in the feed; or a CIDR in the vagina (any one)."
    },
    {
      "number": "4.2.3",
      "marks": 2,
      "clues": "- (a) is about the feed of the bull.\n- (b) is about how the young bull was raised.",
      "approach": "- Link each situation to a cause of sterility or infertility.\n- Name each factor.",
      "solution": "1. (a) Unbalanced ration: malnutrition.\n2. (b) Raised in isolation: inexperience (immaturity)."
    },
    {
      "number": "4.3.1",
      "marks": 1,
      "clues": "- The illustration shows repeating stages with hormone changes.",
      "approach": "- Identify the process from its stages.\n- Name it.",
      "solution": "1. The oestrus cycle."
    },
    {
      "number": "4.3.2",
      "marks": 2,
      "clues": "- C lasts 2–3 days and FSH stimulates follicles.\n- D lasts 12–18 hours and oestrogen is high.",
      "approach": "- Use the duration and hormone of each stage.\n- Name stages C and D.",
      "solution": "1. C: Pro-oestrus.\n2. D: Oestrus."
    },
    {
      "number": "4.3.3",
      "marks": 1,
      "clues": "- Think of aids that show a cow has been mounted or is more active.",
      "approach": "- Recall practical heat-detection methods.\n- Name one.",
      "solution": "1. Pedometers, tail chalking, chin-ball markers, heat mount detectors, teaser animals or regular observation (any one)."
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
