#!/usr/bin/env node
/**
 * DBE Life Sciences P1 — November 2025 — Question 1 (Human Reproduction) (order 1)
 *
 * Real Q1.1.2, 1.1.5–1.1.8, 1.2.1/1.2.3/1.2.5/1.2.6 and 1.3.1 (16 marks) are the Human Reproduction items scattered
 * through Section A — clustered by CAPS knowledge area (DESIGN-UNI-10 rule 2). The real 1.1.5/1.1.6/1.1.8 figures
 * (female system, sperm) are label-identification diagrams; fresh practice questions test the same structures by
 * FUNCTION, with no figure (DESIGN-LIFE-03 option (i)), framed relationally (DESIGN-UNI-08). Independent lesson.
 *
 * Keyboard (KEYBOARD-04, core/keyboard-input.md): every typed fitb declares keyboard_type — standard_math for a bare
 * number, text for a single canonical term (2.4.0; the 2025 exam is gated at 2.4.0 by tools/apply-exam-gate.js, VER-09).
 * Do NOT copy a P2 script as a template: those predate KEYBOARD-04 (tools/lib/legacy-keyboard-allowlist.js).
 * Reminder: don't factor shared text into an outer const used inside `questions` — validate-questions.js evals the
 * `questions = [...]` block in isolation.
 *
 *   node tools/validate-questions.js --script scripts/add-life-science-2025-nov-p1-q1-human-reproduction.js --curriculum temp/curriculum-vocab-life-science-p1.json
 *   node scripts/add-life-science-2025-nov-p1-q1-human-reproduction.js --dry-run
 *   node scripts/add-life-science-2025-nov-p1-q1-human-reproduction.js
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
  "name": "Question 1 (Human Reproduction)",
  "syllabus": "dbe",
  "subject": "life_science",
  "year": 2025,
  "paper": "nov_p1",
  "order": 1,
  "content_tier": "free",
  "has_video": false,
  "xp": 80,
  "tags": [
    "human_reproduction",
    "fertilisation_and_implantation",
    "gametogenesis"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2025/nov_p1/q1/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2025/nov_p1/q1/question_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2025/nov_p1/q1/question_3.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2025/nov_p1/q1/question_4.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2025/nov_p1/q1/memo_1.png"
  ],
  "exam_question_marks": 16
};

const questions = [
  {
    "name": "Question 1",
    "question": "A fetus and its mother have separate blood circulations, yet the fetus still receives oxygen. Which statement best explains how this happens?",
    "metadata": [
      "Oxygen is carried from the mother's lungs to the fetus through the amniotic fluid",
      "Maternal blood flows directly into the fetal capillaries through the umbilical cord",
      "Oxygen diffuses from the mother's blood into the fetal blood across the thin placental membrane",
      "The fetus absorbs oxygen from the uterine fluid through its skin",
      ""
    ],
    "answer": [
      "Oxygen diffuses from the mother's blood into the fetal blood across the thin placental membrane",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "human_reproduction",
    "subtopic": "placenta_gas_exchange",
    "skills": [
      "explain_placental_exchange"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Think about which substances move between two circulations that are kept apart by a membrane.\n- Consider the direction of the concentration gradient for oxygen."
  },
  {
    "name": "Question 2",
    "question": "Arrange these events in the order in which they happen after sperm reach an ovum in a normal pregnancy.",
    "metadata": [
      "The ball of cells develops into a hollow blastocyst",
      "The blastocyst sinks into the thickened uterine lining",
      "The ovum is fertilised in the oviduct to form a zygote",
      "The zygote divides repeatedly to form a solid ball of cells"
    ],
    "answer": [
      "The ovum is fertilised in the oviduct to form a zygote",
      "The zygote divides repeatedly to form a solid ball of cells",
      "The ball of cells develops into a hollow blastocyst",
      "The blastocyst sinks into the thickened uterine lining"
    ],
    "presentation": "ordering",
    "type": "ordering",
    "unit": "life_processes_plants_animals",
    "topic": "human_reproduction",
    "subtopic": "fertilisation_to_implantation_sequence",
    "skills": [
      "sequence_early_pregnancy_events"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Fertilisation happens before any cell division can start.\n- Implantation is the last of these events."
  },
  {
    "name": "Question 3",
    "question": "Match each male reproductive structure to the role that its secretion or function plays for the sperm.",
    "metadata": [
      "A - Seminal vesicle",
      "B - Prostate gland",
      "C - Cowper's gland",
      "D - Epididymis",
      "1 - Adds a fructose-rich fluid that supplies energy to the sperm",
      "2 - Adds an alkaline fluid that helps neutralise acidity in the vagina",
      "3 - Adds mucus that lubricates the urethra before ejaculation",
      "4 - Stores sperm while they mature"
    ],
    "answer": [
      "A-1",
      "B-2",
      "C-3",
      "D-4"
    ],
    "presentation": "match",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "human_reproduction",
    "subtopic": "semen_glands_roles",
    "skills": [
      "match_accessory_gland_to_secretion"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Each structure either contributes to semen or stores sperm — decide which before matching."
  },
  {
    "name": "Question 4",
    "question": "Which of the following are structural adaptations that help a sperm cell reach and fertilise an ovum?",
    "metadata": [
      "An acrosome containing enzymes that digest the outer layers of the ovum",
      "A large store of yolk in the cytoplasm",
      "Many mitochondria in the middle piece",
      "A tail that propels the cell forward",
      "A thick jelly coat that protects the cell"
    ],
    "answer": [
      "An acrosome containing enzymes that digest the outer layers of the ovum",
      "Many mitochondria in the middle piece",
      "A tail that propels the cell forward",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "human_reproduction",
    "subtopic": "sperm_structural_adaptations",
    "skills": [
      "identify_sperm_adaptations"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Link each feature to a job the sperm must do on its journey: move, get energy, enter the ovum."
  },
  {
    "name": "Question 5",
    "question": "Name the pituitary hormone whose sudden surge in the middle of the menstrual cycle triggers the release of an ovum from the ovary (give the abbreviation or the full name).",
    "metadata": [
      "[ ]"
    ],
    "answer": [
      "LH|luteinising hormone|luteinizing hormone",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "definition",
    "unit": "life_processes_plants_animals",
    "topic": "human_reproduction",
    "subtopic": "ovulation_hormone",
    "skills": [
      "name_ovulation_trigger_hormone"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 5,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2025,
    "paper": "nov_p1",
    "keyboard_type": "text",
    "clues": "- This hormone is secreted by the anterior pituitary, not by the ovary.\n- It is named for the structure that forms in the ovary after the follicle ruptures."
  },
  {
    "name": "Question 6",
    "question": "Both spermatogenesis and oogenesis involve meiosis. Which statement correctly describes a difference between the two processes?",
    "metadata": [
      "Spermatogenesis produces diploid gametes, whereas oogenesis produces haploid gametes",
      "Each diploid cell undergoing spermatogenesis produces four functional gametes, whereas oogenesis produces one functional ovum",
      "Oogenesis takes place in the seminiferous tubules, whereas spermatogenesis takes place in the ovary",
      "Only oogenesis involves a reduction in chromosome number",
      ""
    ],
    "answer": [
      "Each diploid cell undergoing spermatogenesis produces four functional gametes, whereas oogenesis produces one functional ovum",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "human_reproduction",
    "subtopic": "gametogenesis_comparison",
    "skills": [
      "compare_spermatogenesis_oogenesis"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 6,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Compare how many functional gametes each process makes from one starting cell.\n- Both processes halve the chromosome number."
  },
  {
    "name": "Question 7",
    "question": "Which structure surrounds the developing embryo with fluid that cushions it against mechanical injury and keeps its temperature steady?",
    "metadata": [
      "Chorion",
      "Umbilical cord",
      "Endometrium",
      "Amnion",
      ""
    ],
    "answer": [
      "Amnion",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "human_reproduction",
    "subtopic": "amnion_function",
    "skills": [
      "identify_extra_embryonic_membrane_role"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 7,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- This membrane forms a fluid-filled sac around the embryo itself."
  },
  {
    "name": "Question 8",
    "question": "Does the following description apply to A only, B only, both A and B, or none? Description: stimulates the development of male secondary sexual characteristics at puberty. A: Testosterone. B: Oestrogen.",
    "metadata": [
      "B only",
      "A only",
      "Both A and B",
      "None",
      ""
    ],
    "answer": [
      "A only",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "human_reproduction",
    "subtopic": "sex_hormone_secondary_characteristics",
    "skills": [
      "classify_hormone_effect_ab"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 8,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Decide which hormone is secreted by which gonad before you judge each one against the description."
  }
];

const aiExplanation = {
  sub_questions: [
    {
      "number": "1.1.2",
      "marks": 2,
      "clues": "- Recall what the placenta passes to the fetus and what it carries away.\n- Consider which option includes a function that the placenta does NOT perform.",
      "approach": "- List the real functions of the placenta: nutrition, gaseous exchange and excretion of wastes.\n- Check each option pair against that list.\n- Reject options containing temperature regulation or protection.",
      "solution": "1. The placenta supplies nutrients to the fetus and removes its excretory waste.\n2. The options with gaseous exchange and protection, or temperature regulation, include functions the placenta does not carry out.\n3. Excretion and nutrition is the only correct pair: A."
    },
    {
      "number": "1.1.5",
      "marks": 2,
      "clues": "- Fertilisation takes place in the tube that carries the ovum from the ovary.\n- The embryo embeds in the lining of the uterus.",
      "approach": "- Identify part P as the oviduct and part Q as the thickened lining of the uterus.\n- Match the site of fertilisation and the site of implantation to those parts.",
      "solution": "1. Part P is the oviduct (fallopian tube): this is where fertilisation takes place.\n2. Part Q is the endometrium of the uterus: this is where the blastocyst implants.\n3. The combination P (fertilisation) and Q (implantation) is option C."
    },
    {
      "number": "1.1.6",
      "marks": 2,
      "clues": "- The morula forms as the zygote divides while it travels towards the uterus.\n- Use the same part where fertilisation happened.",
      "approach": "- Recall that cleavage of the zygote begins straight after fertilisation.\n- Decide which labelled part is the oviduct.",
      "solution": "1. The zygote begins dividing soon after fertilisation, while still in the oviduct.\n2. The solid ball of cells (morula) therefore forms in part P, the oviduct.\n3. The answer is D."
    },
    {
      "number": "1.1.7",
      "marks": 2,
      "clues": "- Semen is sperm plus fluid added by accessory glands.\n- Decide which listed parts add fluid and which only act as a passage.",
      "approach": "- Separate the glands that secrete fluid into semen from the tube that only carries it.\n- Compare each combination against the glands you identified.",
      "solution": "1. The prostate gland, seminal vesicles and Cowper's gland all secrete fluids that become part of semen.\n2. The urethra only transports semen and sperm out of the body; it does not form it.\n3. The combination of (i), (ii) and (iv) only is option B."
    },
    {
      "number": "1.1.8",
      "marks": 2,
      "clues": "- Compare the sperm in the diagram with the normal parts of a sperm cell.\n- Check which structure is missing from the middle piece.",
      "approach": "- Recall the normal parts: acrosome, nucleus, mitochondria in the middle piece, tail.\n- Spot which one the diagram does not show, and what job it normally does.",
      "solution": "1. The diagram shows a head with a nucleus, but no mitochondria in the middle piece.\n2. Mitochondria supply the energy needed for the tail to move the sperm.\n3. Without them the sperm cannot swim to the ovum: option D."
    },
    {
      "number": "1.2.1",
      "marks": 1,
      "clues": "- This hormone prepares and maintains the uterine lining after ovulation.",
      "approach": "- Recall what the corpus luteum secretes.\n- Name the hormone, not the structure.",
      "solution": "1. After ovulation the ruptured follicle becomes the corpus luteum.\n2. It secretes progesterone."
    },
    {
      "number": "1.2.3",
      "marks": 1,
      "clues": "- The term for gamete formation in the female is built on the name of the female gamete.",
      "approach": "- Recall the general term gametogenesis and its female form.\n- Remember that it uses meiosis.",
      "solution": "1. The production of ova by meiosis in the ovaries is called oogenesis."
    },
    {
      "number": "1.2.5",
      "marks": 1,
      "clues": "- Think about what happens when the mature follicle ruptures.",
      "approach": "- Recall the event in the middle of the menstrual cycle.\n- Give the single biological term.",
      "solution": "1. The release of an ovum from the ovary is called ovulation."
    },
    {
      "number": "1.2.6",
      "marks": 1,
      "clues": "- This outer extra-embryonic membrane grows villi that join the uterine wall.",
      "approach": "- Recall the extra-embryonic membranes.\n- Pick the one that contributes to the placenta.",
      "solution": "1. The chorion forms finger-like villi that, together with the uterine lining, form the placenta."
    },
    {
      "number": "1.3.1",
      "marks": 2,
      "clues": "- Decide which hormone each gonad secretes.\n- Consider whether both sexes undergo puberty changes under their own hormone.",
      "approach": "- Recall the role of oestrogen in females at puberty.\n- Recall the role of testosterone in males at puberty.\n- Decide if the description fits one or both.",
      "solution": "1. Oestrogen is responsible for female secondary sexual characteristics at puberty.\n2. Testosterone is responsible for male secondary sexual characteristics.\n3. The description applies to both A and B."
    }
  ],
  model: 'claude-sonnet-5-5',
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
