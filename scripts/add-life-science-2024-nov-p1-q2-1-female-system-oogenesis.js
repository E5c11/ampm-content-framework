#!/usr/bin/env node
/**
 * DBE Life Sciences P1 — November 2024 — Question 2.1 (Female Reproductive System and Oogenesis) (order 7)
 *
 * Real Q2.1 (15 marks) is a diagram of the fallopian tube (A), ovary (B), ovum (C), endometrium and sperm: identify A/B,
 * endometrium features for implantation, visible reasons for a high chance of fertilisation, a 6-mark oogenesis
 * description, and why an ectopic pregnancy kills the embryo. One lesson (DESIGN-UNI-10 rule 1). The 6-mark description
 * becomes an ordering (DESIGN-LIFE-02); the rest are asked by function or consequence with no figure. Independent lesson.
 *
 * Keyboard (KEYBOARD-04, core/keyboard-input.md): every typed fitb declares keyboard_type — standard_math for a bare
 * number, text for a single canonical term. The exam gate is derived from the rows by tools/apply-exam-gate.js (VER-09).
 * Do NOT copy a P2 2025 script as a template: those predate KEYBOARD-04 (tools/lib/legacy-keyboard-allowlist.js).
 * Reminder: don't factor shared text into an outer const used inside `questions` — validate-questions.js evals the
 * `questions = [...]` block in isolation.
 *
 *   node tools/validate-questions.js --script scripts/add-life-science-2024-nov-p1-q2-1-female-system-oogenesis.js --curriculum temp/curriculum-vocab-life-science-p1-2024.json
 *   node scripts/add-life-science-2024-nov-p1-q2-1-female-system-oogenesis.js --dry-run
 *   node scripts/add-life-science-2024-nov-p1-q2-1-female-system-oogenesis.js
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
  "name": "Question 2.1 (Female Reproductive System and Oogenesis)",
  "syllabus": "dbe",
  "subject": "life_science",
  "year": 2024,
  "paper": "nov_p1",
  "order": 7,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "female_reproductive_system",
    "gametogenesis",
    "fertilisation_and_implantation"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2024/nov_p1/q7/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2024/nov_p1/q7/memo_1.png"
  ],
  "exam_question_marks": 15
};

const questions = [
  {
    "name": "Question 1",
    "question": "Match each part of the female reproductive system to the event that normally takes place there.",
    "metadata": [
      "A - Ovary",
      "B - Fallopian tube",
      "C - Uterus",
      "D - Cervix",
      "1 - The ovum is usually fertilised",
      "2 - It widens to let the baby pass out during birth",
      "3 - Follicles develop and ovulation takes place",
      "4 - The blastocyst implants in the endometrium"
    ],
    "answer": [
      "A-3",
      "B-1",
      "C-4",
      "D-2"
    ],
    "presentation": "match",
    "type": "definition",
    "unit": "life_processes_plants_animals",
    "topic": "human_reproduction",
    "subtopic": "female_structure_events",
    "skills": [
      "match_female_structure_to_event"
    ],
    "difficulty": 2,
    "exam_weight": 3,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Follow the ovum from where it is released to where an embryo develops."
  },
  {
    "name": "Question 2",
    "question": "A blastocyst reaches the uterus. Which conditions increase the chance that it will implant successfully? Select ALL that apply.",
    "metadata": [
      "The endometrium is thick and has many blood vessels",
      "The endometrium is being shed as menstruation begins",
      "The progesterone level is high",
      "The FSH level is at its peak for the cycle",
      "The corpus luteum is still active"
    ],
    "answer": [
      "The endometrium is thick and has many blood vessels",
      "The progesterone level is high",
      "The corpus luteum is still active",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "human_reproduction",
    "subtopic": "implantation_conditions",
    "skills": [
      "identify_conditions_for_implantation"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- The embryo needs a thick, nourishing lining to sink into.\n- Think about which hormone keeps that lining in place, and where it comes from."
  },
  {
    "name": "Question 3",
    "question": "In which situation is fertilisation most likely to take place?",
    "metadata": [
      "Sperm are in the vagina just before menstruation starts",
      "Sperm are in the fallopian tube a day after ovulation",
      "Sperm are in the fallopian tube ten days before ovulation",
      "An unfertilised ovum is in the uterus five days after ovulation",
      ""
    ],
    "answer": [
      "Sperm are in the fallopian tube a day after ovulation",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "human_reproduction",
    "subtopic": "fertilisation_timing",
    "skills": [
      "identify_conditions_for_fertilisation"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Sperm and an ovum must meet while both are still alive.\n- Recall where fertilisation normally happens."
  },
  {
    "name": "Question 4",
    "question": "Arrange these events of oogenesis in the correct order.",
    "metadata": [
      "A cell inside the follicle undergoes meiosis",
      "Diploid cells in the ovary divide by mitosis to form many follicles",
      "Only one of the cells formed survives as a haploid ovum",
      "At puberty, FSH stimulates a follicle to develop"
    ],
    "answer": [
      "Diploid cells in the ovary divide by mitosis to form many follicles",
      "At puberty, FSH stimulates a follicle to develop",
      "A cell inside the follicle undergoes meiosis",
      "Only one of the cells formed survives as a haploid ovum"
    ],
    "presentation": "ordering",
    "type": "ordering",
    "unit": "life_processes_plants_animals",
    "topic": "human_reproduction",
    "subtopic": "oogenesis_sequence",
    "skills": [
      "sequence_oogenesis_stages"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Follicles form long before puberty.\n- The division that halves the chromosome number happens last, just before the ovum forms."
  },
  {
    "name": "Question 5",
    "question": "Why is the uterus, rather than the fallopian tube, able to support an embryo until birth?",
    "metadata": [
      "Its lining is covered in cilia that keep the embryo moving towards the cervix",
      "Its thick, vascular endometrium nourishes the embryo and its wall can stretch",
      "It secretes FSH, which provides the embryo with the nutrients it needs",
      "Its narrow cavity holds the embryo firmly in one place",
      ""
    ],
    "answer": [
      "Its thick, vascular endometrium nourishes the embryo and its wall can stretch",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "human_reproduction",
    "subtopic": "ectopic_pregnancy_explanation",
    "skills": [
      "explain_uterus_suitability_for_embryo"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 5,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- A growing embryo needs space, oxygen and nutrients.\n- Compare the lining and size of the two structures."
  }
];

const aiExplanation = {
  sub_questions: [
    {
      "number": "2.1.1(a)",
      "marks": 1,
      "clues": "- Part A is the tube that leads from near the ovary to the uterus.",
      "approach": "- Follow part A from the ovary to the uterus.\n- Name the tube.",
      "solution": "1. Part A carries the ovum from the ovary to the uterus.\n2. It is the fallopian tube (oviduct)."
    },
    {
      "number": "2.1.1(b)",
      "marks": 1,
      "clues": "- Part B is the organ that has just released structure C.",
      "approach": "- Identify where the ovum came from.\n- Name that organ.",
      "solution": "1. Part B releases ova.\n2. It is the ovary."
    },
    {
      "number": "2.1.2(a)",
      "marks": 2,
      "clues": "- Consider what the blastocyst needs from the lining it sinks into.",
      "approach": "- Think about the thickness of the endometrium.\n- Think about its blood supply and glands.\n- Give the first two features only.",
      "solution": "1. The endometrium is thick.\n2. It has a rich blood supply (it is vascular) and it is glandular. Any two of these are accepted."
    },
    {
      "number": "2.1.2(b)",
      "marks": 2,
      "clues": "- Look at what is in the fallopian tube and what is next to the ovary.",
      "approach": "- Note the sperm in the diagram.\n- Note structure C beside the ovary.",
      "solution": "1. Sperm cells are present in the fallopian tube, close to the ovum.\n2. Ovulation has taken place, because an ovum (C) has been released."
    },
    {
      "number": "2.1.3",
      "marks": 6,
      "clues": "- Structure C is the ovum, so name the female type of gametogenesis first.\n- Describe the mitosis, the hormone and the meiosis in order.",
      "approach": "- Name the process (this mark is compulsory).\n- Describe how follicles form by mitosis.\n- Describe the role of FSH at puberty and the meiosis inside a follicle.\n- State how many of the cells survive and their chromosome number.",
      "solution": "1. The process is oogenesis.\n2. Diploid cells in the ovary undergo mitosis to form many follicles.\n3. From puberty, under the influence of FSH, one cell inside a follicle enlarges and undergoes meiosis.\n4. Of the four cells produced, only one survives to become a mature haploid ovum."
    },
    {
      "number": "2.1.4",
      "marks": 3,
      "clues": "- Compare the fallopian tube with the uterus.\n- Consider space, the lining and the blood supply.",
      "approach": "- State what the fallopian tube lacks in space.\n- State what it lacks compared with the endometrium.\n- Link this to the needs of the developing embryo.",
      "solution": "1. The fallopian tube cannot provide enough space for the embryo to grow.\n2. It has no endometrium with a rich blood supply.\n3. So the embryo cannot get enough nutrients and oxygen or remove its wastes, and it dies."
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
