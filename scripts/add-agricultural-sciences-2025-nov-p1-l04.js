#!/usr/bin/env node
/**
 * DBE Agricultural Sciences P1 — November 2025 — Question 1: Reproductive organs and congenital defects (Section A) (order 4)
 * Section A items 1.1.9, 1.1.10, 1.2.5, 1.3.3 and 1.4.3 — female and male reproductive organs, foetal membranes and congenital defects. Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-agricultural-sciences-2025-nov-p1-l04.js --curriculum temp/curriculum-vocab-agricultural-sciences.json
 *   node scripts/add-agricultural-sciences-2025-nov-p1-l04.js --dry-run
 *   node scripts/add-agricultural-sciences-2025-nov-p1-l04.js
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
  "name": "Question 1: Reproductive organs and congenital defects (Section A)",
  "syllabus": "dbe",
  "subject": "agricultural_sciences",
  "year": 2025,
  "paper": "nov_p1",
  "order": 4,
  "content_tier": "free",
  "has_video": false,
  "xp": 9,
  "tags": [
    "female_reproductive_organs",
    "male_reproductive_anatomy",
    "congenital_defects"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p1/q4/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p1/q4/question_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p1/q4/question_3.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p1/q4/question_4.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p1/q4/question_5.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2025/nov_p1/q4/memo_1.png"
  ],
  "exam_question_marks": 9,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Which part of a cow’s reproductive tract stays tightly closed during pregnancy and opens only at birth?",
    "metadata": [
      "Oviduct",
      "Vulva",
      "Cervix",
      "Ovary",
      ""
    ],
    "answer": [
      "Cervix",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "animal_reproduction",
    "topic": "female_reproductive_system",
    "subtopic": "agri_term_recall",
    "skills": [
      "identify_structure_by_function"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- It lies between the body of the uterus and the vagina."
  },
  {
    "name": "Question 2",
    "question": "A bull’s testes hang in the scrotum outside the body cavity. What is the main advantage of this position?",
    "metadata": [
      "It lets them produce the fluid that carries the sperm cells out",
      "It allows them to store the finished semen until mating takes place",
      "It keeps them cooler than the body, which sperm production needs",
      "It connects them directly to the urethra for quick ejaculation",
      ""
    ],
    "answer": [
      "It keeps them cooler than the body, which sperm production needs",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "animal_reproduction",
    "topic": "male_reproductive_system",
    "subtopic": "agri_cause_and_effect",
    "skills": [
      "identify_structure_by_function"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Sperm formation is sensitive to temperature."
  },
  {
    "name": "Question 3",
    "question": "Match each part of the foetal support system in a pregnant cow to its function.",
    "metadata": [
      "A - Amnion",
      "B - Allantois",
      "C - Chorion",
      "D - Umbilical cord",
      "1 - Holds the fluid that protects the foetus from knocks",
      "2 - Collects the urinary waste of the foetus",
      "3 - Outer layer that attaches to the wall of the uterus",
      "4 - Carries blood between the foetus and the placenta"
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
    "topic": "pregnancy_and_parturition",
    "subtopic": "agri_classification",
    "skills": [
      "identify_structure_by_function"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2025,
    "paper": "nov_p1"
  },
  {
    "name": "Question 4",
    "question": "Select ALL the conditions that are congenital defects (present at birth and inherited).",
    "metadata": [
      "Mastitis (inflammation of the udder)",
      "Hypoplasia (under-developed testes)",
      "Redwater (a tick-borne blood disease)",
      "Cryptorchidism (a testis that never descends)",
      "Hydrocephalus (fluid on the brain)"
    ],
    "answer": [
      "Hypoplasia (under-developed testes)",
      "Cryptorchidism (a testis that never descends)",
      "Hydrocephalus (fluid on the brain)",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "animal_reproduction",
    "topic": "male_reproductive_system",
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
    "paper": "nov_p1",
    "clues": "- Two of the options are diseases that an animal catches after birth."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "1.1.9",
      "marks": 2,
      "clues": "- Picture the female reproductive tract from the ovaries to the outside.\n- Which part lies between the uterus and the vagina?",
      "approach": "- List the parts of the female tract in order.\n- Match the position described to the correct part.",
      "solution": "1. The cervix is located between the body of the uterus and the vagina.\n2. The vulva is the external opening, the ampulla is part of the oviduct and the tunica serosa is a covering, so the answer is D."
    },
    {
      "number": "1.1.10",
      "marks": 2,
      "clues": "- Think about what the testes produce.\n- The scrotum encloses the primary reproductive organ.",
      "approach": "- Identify the primary male reproductive organ.\n- Choose the option that describes its products.",
      "solution": "1. The testes are enclosed in the scrotum and produce spermatozoa and testosterone.\n2. The answer is C."
    },
    {
      "number": "1.2.5",
      "marks": 2,
      "clues": "- Recall what each foetal membrane does.\n- Test the description against A and B separately.",
      "approach": "- Recall the functions of the allantois and the amnion.\n- Decide which one holds fluid that protects the foetus from injury.",
      "solution": "1. The amnion contains the fluid that protects the foetus from injuries.\n2. The allantois collects waste, so the answer is B only."
    },
    {
      "number": "1.3.3",
      "marks": 2,
      "clues": "- The defects are present at birth.\n- Think about how they are passed on.",
      "approach": "- Recall the terms for defects that new-born animals inherit.\n- Give the term for defects inherited from the parents.",
      "solution": "1. Defects that new-born animals inherit from their parents are congenital (genetic) defects."
    },
    {
      "number": "1.4.3",
      "marks": 1,
      "clues": "- The condition involves fluid in the brain and the skull.\n- It makes birth difficult.",
      "approach": "- Recall the congenital defect with fluid around the brain.\n- Replace the underlined word with the correct term.",
      "solution": "1. The accumulation of fluid in and around the brain that enlarges the skull is hydrocephalus."
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
