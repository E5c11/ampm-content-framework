#!/usr/bin/env node
/**
 * DBE Life Sciences P1 — November 2024 — Question 1 (Human Reproduction) (order 1)
 *
 * Section A cluster (DESIGN-UNI-10 rule 2): the human-reproduction items of Q1 — 1.1.2 (embryonic stage), 1.1.8 (amniotic
 * fluid), 1.2.1 (umbilical cord), 1.2.8 (acrosome), 1.3.1 (placenta as micro-filter). 8 marks. Independent lesson; fresh
 * practice questions test the same structures relationally (DESIGN-UNI-08): order, consequence of loss, and which way
 * substances move.
 *
 * Keyboard (KEYBOARD-04, core/keyboard-input.md): every typed fitb declares keyboard_type — standard_math for a bare
 * number, text for a single canonical term. The exam gate is derived from the rows by tools/apply-exam-gate.js (VER-09).
 * Do NOT copy a P2 2025 script as a template: those predate KEYBOARD-04 (tools/lib/legacy-keyboard-allowlist.js).
 * Reminder: don't factor shared text into an outer const used inside `questions` — validate-questions.js evals the
 * `questions = [...]` block in isolation.
 *
 *   node tools/validate-questions.js --script scripts/add-life-science-2024-nov-p1-q1-human-reproduction.js --curriculum temp/curriculum-vocab-life-science-p1-2024.json
 *   node scripts/add-life-science-2024-nov-p1-q1-human-reproduction.js --dry-run
 *   node scripts/add-life-science-2024-nov-p1-q1-human-reproduction.js
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
  "year": 2024,
  "paper": "nov_p1",
  "order": 1,
  "content_tier": "free",
  "has_video": false,
  "xp": 60,
  "tags": [
    "human_reproduction",
    "fertilisation_and_implantation"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2024/nov_p1/q1/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2024/nov_p1/q1/question_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2024/nov_p1/q1/question_3.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2024/nov_p1/q1/memo_1.png"
  ],
  "exam_question_marks": 8
};

const questions = [
  {
    "name": "Question 1",
    "question": "Arrange these stages of early human development in the order in which they occur after fertilisation.",
    "metadata": [
      "Blastocyst (a hollow ball of cells)",
      "Zygote",
      "Embryo implanted in the endometrium",
      "Morula (a solid ball of cells)"
    ],
    "answer": [
      "Zygote",
      "Morula (a solid ball of cells)",
      "Blastocyst (a hollow ball of cells)",
      "Embryo implanted in the endometrium"
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
    "order": 1,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Start with the single cell formed when the sperm and ovum nuclei fuse.\n- The cells divide repeatedly before a fluid-filled cavity forms."
  },
  {
    "name": "Question 2",
    "question": "An ultrasound scan shows that a foetus is surrounded by far too little amniotic fluid. Which functions of the amniotic fluid are reduced? Select ALL that apply.",
    "metadata": [
      "Cushioning the foetus against bumps and pressure",
      "Supplying the foetus with glucose and amino acids",
      "Allowing the foetus room to move and develop its limbs",
      "Removing carbon dioxide from the foetal blood",
      "Keeping the temperature around the foetus stable"
    ],
    "answer": [
      "Cushioning the foetus against bumps and pressure",
      "Allowing the foetus room to move and develop its limbs",
      "Keeping the temperature around the foetus stable",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "human_reproduction",
    "subtopic": "amnion_function",
    "skills": [
      "identify_extra_embryonic_membrane_role"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Think of the fluid as a water bath around the foetus.\n- Food and gas exchange happen across a different structure."
  },
  {
    "name": "Question 3",
    "question": "Match each part of a sperm cell to what would happen if that part were missing or did not work.",
    "metadata": [
      "A - Acrosome",
      "B - Middle piece (mitochondria)",
      "C - Tail",
      "D - Nucleus",
      "1 - The sperm could not swim along the female reproductive tract",
      "2 - The sperm could not digest a path through the layers around the ovum",
      "3 - No paternal chromosomes would be passed on to the zygote",
      "4 - The sperm would run out of energy before reaching the ovum"
    ],
    "answer": [
      "A-2",
      "B-4",
      "C-1",
      "D-3"
    ],
    "presentation": "match",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "human_reproduction",
    "subtopic": "sperm_structural_adaptations",
    "skills": [
      "match_sperm_part_to_loss_consequence"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Link each part to its job: enzymes, energy, movement or genetic material."
  },
  {
    "name": "Question 4",
    "question": "Which statement correctly describes the blood carried by the vessels in the umbilical cord?",
    "metadata": [
      "The umbilical vein carries carbon dioxide from the foetus to the placenta",
      "The umbilical arteries carry oxygen and nutrients from the placenta to the foetus",
      "The umbilical arteries carry carbon dioxide and wastes to the placenta",
      "The umbilical vein carries the mother's blood directly into the foetal heart",
      ""
    ],
    "answer": [
      "The umbilical arteries carry carbon dioxide and wastes to the placenta",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "life_processes_plants_animals",
    "topic": "human_reproduction",
    "subtopic": "umbilical_cord_vessels",
    "skills": [
      "identify_umbilical_vessel_contents"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Arteries carry blood away from the foetal heart.\n- The blood of the mother and foetus never mix."
  },
  {
    "name": "Question 5",
    "question": "Decide whether this description applies to A only, B only, both A and B, or none. Description: secretes progesterone that maintains the endometrium during pregnancy. A: Placenta. B: Corpus luteum.",
    "metadata": [
      "A only",
      "B only",
      "Both A and B",
      "None",
      ""
    ],
    "answer": [
      "Both A and B",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "human_reproduction",
    "subtopic": "progesterone_sources_in_pregnancy",
    "skills": [
      "classify_progesterone_source_ab"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 5,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Consider early pregnancy and later pregnancy separately."
  },
  {
    "name": "Question 6",
    "question": "The placenta acts as a barrier between the blood of the mother and the blood of the foetus. Which of the following can cross from the mother to the foetus? Select ALL that apply.",
    "metadata": [
      "Oxygen",
      "The mother's red blood cells",
      "Glucose",
      "Alcohol and nicotine",
      "Blood platelets"
    ],
    "answer": [
      "Oxygen",
      "Glucose",
      "Alcohol and nicotine",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "life_processes_plants_animals",
    "topic": "human_reproduction",
    "subtopic": "placenta_filter_function",
    "skills": [
      "identify_substances_crossing_placenta"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 6,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- The barrier blocks whole cells but lets small dissolved molecules through.\n- Some harmful small molecules are not stopped."
  }
];

const aiExplanation = {
  sub_questions: [
    {
      "number": "1.1.2",
      "marks": 2,
      "clues": "- Some options are membranes around the embryo or layers of the eye, not stages.\n- A stage is a form the developing embryo itself takes.",
      "approach": "- Classify each option as a membrane, an eye layer or a stage of development.\n- Choose the only option that the embryo itself passes through.",
      "solution": "1. The choroid is a layer of the eye, and the amnion and chorion are membranes around the embryo.\n2. The morula is the solid ball of cells formed by repeated mitosis of the zygote, so it is a stage of development.\n3. The answer is C (morula)."
    },
    {
      "number": "1.1.8",
      "marks": 2,
      "clues": "- The amniotic fluid surrounds the foetus but does not feed it.",
      "approach": "- Check each factor against what a fluid around the foetus can do.\n- Remove the factor that depends on the placenta.",
      "solution": "1. The amniotic fluid acts as a shock absorber (protection), keeps the temperature stable and allows free movement.\n2. Nutrition is supplied through the placenta and umbilical cord, not the amniotic fluid.\n3. The answer is A: (i), (ii) and (iii) only."
    },
    {
      "number": "1.2.1",
      "marks": 1,
      "clues": "- It contains blood vessels that run between the foetus and the placenta.",
      "approach": "- Picture the link between the foetus and the placenta.\n- Name the structure that contains the umbilical arteries and vein.",
      "solution": "1. The umbilical cord connects the foetus to the placenta.\n2. Its arteries and vein carry blood between the two."
    },
    {
      "number": "1.2.8",
      "marks": 1,
      "clues": "- It is a cap over the nucleus at the front of the sperm head.",
      "approach": "- Recall the parts of a sperm cell: head, middle piece and tail.\n- Name the structure in the head that releases enzymes to penetrate the ovum.",
      "solution": "1. The acrosome is the cap on the sperm head.\n2. It contains enzymes that digest a path into the ovum."
    },
    {
      "number": "1.3.1",
      "marks": 2,
      "clues": "- A micro-filter lets some substances through and keeps others out.\n- Consider which structure separates the blood of the mother from that of the foetus.",
      "approach": "- Test the description against the placenta.\n- Test it against the cervix, which is the neck of the uterus.\n- Decide whether one, both or neither fits.",
      "solution": "1. The placenta lets small molecules such as oxygen and glucose pass, but blocks blood cells and many pathogens, so it acts as a micro-filter.\n2. The cervix does not filter substances for the foetus.\n3. The answer is A only."
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
