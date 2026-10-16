#!/usr/bin/env node
/**
 * DBE Agricultural Sciences P1 — November 2024 — Question 1: Sperm route, meiosis, mating and milk (Section A) (order 5)
 * Section A items on reproduction: 1.1.9 milk pathway in the udder, 1.1.10 meiosis in spermatogenesis, 1.2.5 mating terms, 1.3.5 vas deferens. Practice questions are fresh (DESIGN-UNI-01); the AI explanation carries only the real sub-questions this lesson covers (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-agricultural-sciences-2024-nov-p1-l05.js --curriculum temp/curriculum-vocab-agricultural-sciences.json
 *   node scripts/add-agricultural-sciences-2024-nov-p1-l05.js --dry-run
 *   node scripts/add-agricultural-sciences-2024-nov-p1-l05.js
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
  "name": "Question 1: Sperm route, meiosis, mating and milk (Section A)",
  "syllabus": "dbe",
  "subject": "agricultural_sciences",
  "year": 2024,
  "paper": "nov_p1",
  "order": 5,
  "content_tier": "free",
  "has_video": false,
  "xp": 8,
  "tags": [
    "male_reproductive_anatomy",
    "meiosis_and_fertilisation",
    "milk_ejection"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2024/nov_p1/q5/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2024/nov_p1/q5/question_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2024/nov_p1/q5/question_3.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2024/nov_p1/q5/question_4.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2024/nov_p1/q5/question_5.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2024/nov_p1/q5/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2024/nov_p1/q5/memo_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/agricultural_sciences/2024/nov_p1/q5/memo_3.png"
  ],
  "exam_question_marks": 8,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Arrange the structures a sperm cell passes through, from where it is formed to where it leaves the bull.",
    "metadata": [
      "Vas deferens",
      "Seminiferous tubules of the testis",
      "Urethra in the penis",
      "Epididymis"
    ],
    "answer": [
      "Seminiferous tubules of the testis",
      "Epididymis",
      "Vas deferens",
      "Urethra in the penis"
    ],
    "presentation": "ordering",
    "type": "ordering",
    "unit": "animal_reproduction",
    "topic": "male_reproductive_system",
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
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Sperm cells mature and are stored before they are transported.\n- The urethra carries both urine and semen out of the body."
  },
  {
    "name": "Question 2",
    "question": "In which part of a cow's udder is milk produced?",
    "metadata": [
      "Gland cistern",
      "Teat cistern",
      "Teat canal",
      "Alveoli",
      ""
    ],
    "answer": [
      "Alveoli",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "animal_reproduction",
    "topic": "lactation",
    "subtopic": "agri_term_recall",
    "skills": [
      "identify_structure_by_function"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "agricultural_sciences",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- The cisterns and the canal store and release milk; they do not make it.\n- Milk is made in tiny sacs lined with secretory cells."
  },
  {
    "name": "Question 3",
    "question": "Select ALL the correct statements about meiosis during spermatogenesis.",
    "metadata": [
      "It halves the number of chromosomes",
      "Each daughter cell keeps the diploid number",
      "One parent cell forms four haploid cells",
      "It takes place inside the epididymis",
      "It only starts after the bull has mated"
    ],
    "answer": [
      "It halves the number of chromosomes",
      "One parent cell forms four haploid cells",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "animal_reproduction",
    "topic": "spermatogenesis",
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
    "clues": "- Meiosis is called reduction division.\n- Sperm cells are formed in the testes, starting at puberty."
  },
  {
    "name": "Question 4",
    "question": "Decide whether the description applies to A only, B only, both A and B, or none of them. Description: behaviour of a bull and a cow before mating, such as sniffing, licking and chin-resting. A: Ejaculation. B: Courtship.",
    "metadata": [
      "A only",
      "B only",
      "Both A and B",
      "None",
      ""
    ],
    "answer": [
      "B only",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "animal_reproduction",
    "topic": "mating_and_copulation",
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
    "clues": "- Ejaculation is the discharge of semen during mating.\n- Which term covers what happens before mating?"
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "1.1.9",
      "marks": 2,
      "clues": "- Start where the milk is made.\n- End where it leaves the teat.",
      "approach": "- Identify the structure where milk is produced.\n- Follow the milk through the two cisterns.\n- Choose the option that ends at the teat canal.",
      "solution": "1. Milk is produced in the alveolus.\n2. It flows to the gland cistern, then the teat cistern, and leaves through the teat canal.\n3. Answer: C."
    },
    {
      "number": "1.1.10",
      "marks": 2,
      "clues": "- Meiosis is reduction division.\n- Look for the statement that describes mitosis.",
      "approach": "- Recall the products of meiosis.\n- Find the statement that does not fit meiosis.",
      "solution": "1. Meiosis halves the chromosome number and forms four haploid (n) cells.\n2. Two identical diploid (2n) daughter cells are produced by mitosis.\n3. Answer: B."
    },
    {
      "number": "1.2.5",
      "marks": 2,
      "clues": "- The description is about involuntary contractions that discharge semen.\n- Is that copulation, courtship, or another term?",
      "approach": "- Decide whether the description fits copulation.\n- Decide whether it fits courtship.\n- Choose A only, B only, both or none.",
      "solution": "1. The discharge of semen through contractions is ejaculation.\n2. Neither copulation nor courtship is described.\n3. Answer: None."
    },
    {
      "number": "1.3.5",
      "marks": 2,
      "clues": "- The tube lies between the epididymis and the urethra.\n- It has more than one accepted name.",
      "approach": "- Follow the route of sperm out of the epididymis.\n- Name the tube that leads to the urethra.",
      "solution": "1. Sperm cells leave the epididymis through the vas deferens.\n2. Answer: Vas deferens (sperm duct / ductus deferens)."
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
