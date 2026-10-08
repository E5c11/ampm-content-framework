#!/usr/bin/env node
/**
 * DBE Life Sciences P2 — November 2024 — Question 2.2 (Phases of Meiosis II) (order 8)
 *
 * Real Q2.2 (12 marks): anaphase II diagram — phase, difference from anaphase I, A centriole, B spindle fibre, role of spindle,
 * draw metaphase II (5). Exam page 9; memo pages 5–6. The drawing is decomposed (DESIGN-LIFE-04): an MC on what a metaphase II cell
 * looks like plus a chromatid count. Practice asks by description, no figure. Independent lesson.
 *
 * Keyboard (KEYBOARD-04, core/keyboard-input.md): every typed fitb declares keyboard_type — standard_math for a bare
 * number, text for a single canonical term. The exam gate is derived from the rows by tools/apply-exam-gate.js (VER-09).
 * Do NOT copy a P2 2025 script as a template: those predate KEYBOARD-04 (tools/lib/legacy-keyboard-allowlist.js).
 * Reminder: don't factor shared text into an outer const used inside `questions` — validate-questions.js evals the
 * `questions = [...]` block in isolation.
 *
 *   node tools/validate-questions.js --script scripts/add-life-science-2024-nov-p2-q2-2-meiosis-ii.js --curriculum temp/curriculum-vocab-life-science-p2-2024.json
 *   node scripts/add-life-science-2024-nov-p2-q2-2-meiosis-ii.js --dry-run
 *   node scripts/add-life-science-2024-nov-p2-q2-2-meiosis-ii.js
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
  "name": "Question 2.2 (Phases of Meiosis II)",
  "syllabus": "dbe",
  "subject": "life_science",
  "year": 2024,
  "paper": "nov_p2",
  "order": 8,
  "content_tier": "free",
  "has_video": false,
  "xp": 60,
  "tags": [
    "meiosis"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2024/nov_p2/q8/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2024/nov_p2/q8/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2024/nov_p2/q8/memo_2.png"
  ],
  "exam_question_marks": 12
};

const questions = [
  {
    "name": "Question 1",
    "question": "A cell has no homologous pairs, and single chromatids are moving to opposite poles. Which phase of meiosis is this?",
    "metadata": [
      "Anaphase I",
      "Metaphase II",
      "Anaphase II",
      "Telophase I",
      ""
    ],
    "answer": [
      "Anaphase II",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "molecular_cellular_tissue_level",
    "topic": "meiosis",
    "subtopic": "meiosis_phase_identification",
    "skills": [
      "identify_meiosis_phase_from_description"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- No homologous pairs means meiosis II.\n- Moving to the poles happens in anaphase."
  },
  {
    "name": "Question 2",
    "question": "Match each phase of meiosis to what happens to the chromosomes.",
    "metadata": [
      "A - Metaphase I",
      "B - Anaphase I",
      "C - Metaphase II",
      "D - Anaphase II",
      "1 - Centromeres split and chromatids move to opposite poles",
      "2 - Whole chromosomes of each pair move to opposite poles",
      "3 - Homologous pairs line up at the equator",
      "4 - Single chromosomes line up at the equator"
    ],
    "answer": [
      "A-3",
      "B-2",
      "C-4",
      "D-1"
    ],
    "presentation": "match",
    "type": "definition",
    "unit": "molecular_cellular_tissue_level",
    "topic": "meiosis",
    "subtopic": "meiosis_phase_events",
    "skills": [
      "match_meiosis_phase_to_event"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- In meiosis I, chromosomes are in pairs.\n- Centromeres only split in meiosis II."
  },
  {
    "name": "Question 3",
    "question": "A drug stops spindle fibres from working. What will happen during anaphase II?",
    "metadata": [
      "DNA will not be replicated during interphase",
      "Chromatids will not be pulled to the poles",
      "Crossing over will not take place",
      "The nuclear membrane will not break down",
      ""
    ],
    "answer": [
      "Chromatids will not be pulled to the poles",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "molecular_cellular_tissue_level",
    "topic": "meiosis",
    "subtopic": "spindle_fibre_function",
    "skills": [
      "explain_spindle_fibre_role"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Spindle fibres attach to the centromeres.\n- They shorten to move the chromatids."
  },
  {
    "name": "Question 4",
    "question": "Name the structure at each pole of an animal cell from which the spindle fibres form.",
    "metadata": [
      "[ ]"
    ],
    "answer": [
      "centriole|centrioles|centrosome|centrosomes",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "definition",
    "unit": "molecular_cellular_tissue_level",
    "topic": "meiosis",
    "subtopic": "cell_division_structures",
    "skills": [
      "name_centriole"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p2",
    "keyboard_type": "text",
    "clues": "- Plant cells do not have this structure."
  },
  {
    "name": "Question 5",
    "question": "An organism has a diploid number of 4. Which description fits one of its cells in metaphase II?",
    "metadata": [
      "4 chromosomes in pairs, in two rows at the equator",
      "2 chromosomes, each with 1 chromatid, at the poles",
      "4 chromosomes, each with 2 chromatids, in a single row at the equator",
      "2 chromosomes, each with 2 chromatids, in one row at the equator",
      ""
    ],
    "answer": [
      "2 chromosomes, each with 2 chromatids, in one row at the equator",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "molecular_cellular_tissue_level",
    "topic": "meiosis",
    "subtopic": "metaphase_ii_appearance",
    "skills": [
      "describe_metaphase_ii_cell"
    ],
    "difficulty": 4,
    "exam_weight": 3,
    "xp": 10,
    "order": 5,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- After meiosis I, each cell is haploid.\n- The centromeres have not split yet in metaphase II."
  },
  {
    "name": "Question 6",
    "question": "A cell that starts meiosis has 12 chromosomes. How many chromatids move to EACH pole of one cell during anaphase II?",
    "metadata": [
      "= ",
      "[ ]",
      " chromatids"
    ],
    "answer": [
      "6",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "calc",
    "unit": "molecular_cellular_tissue_level",
    "topic": "meiosis",
    "subtopic": "meiosis_chromosome_number",
    "skills": [
      "calculate_meiosis_chromosome_number"
    ],
    "difficulty": 4,
    "exam_weight": 2,
    "xp": 10,
    "order": 6,
    "syllabus": "dbe",
    "subject": "life_science",
    "year": 2024,
    "paper": "nov_p2",
    "keyboard_type": "standard_math",
    "clues": "- After meiosis I, each cell has half the chromosomes.\n- In anaphase II, each chromosome splits into two chromatids, one to each pole."
  }
];

const aiExplanation = {
  sub_questions: [
    {
      "number": "2.2.1",
      "marks": 1,
      "clues": "- The chromatids are being pulled to opposite poles.\n- The question says it is meiosis II.",
      "approach": "- Decide which phase involves movement to the poles.\n- Add II.",
      "solution": "1. Single chromatids are moving to the poles, which happens in anaphase.\n2. Answer: anaphase II."
    },
    {
      "number": "2.2.2",
      "marks": 2,
      "clues": "- Compare what moves to the poles in each anaphase.",
      "approach": "- State what happens in anaphase I.\n- State what happens in anaphase II.",
      "solution": "1. In anaphase I, the chromosomes of each pair separate and move to the poles.\n2. In anaphase II, each chromosome separates and its chromatids move to the poles.\n3. Also accepted: centromeres do not split in anaphase I but do split in anaphase II."
    },
    {
      "number": "2.2.3(a)",
      "marks": 1,
      "clues": "- A is the structure at the pole.",
      "approach": "- Name the organelle at each pole of an animal cell.",
      "solution": "1. The structure at the pole, from which the spindle forms, is a centriole.\n2. Answer: centriole (centrosome is also accepted)."
    },
    {
      "number": "2.2.3(b)",
      "marks": 1,
      "clues": "- B is the dashed line from the pole to a chromatid.",
      "approach": "- Name the thread that pulls chromatids.",
      "solution": "1. The dashed line is a spindle fibre.\n2. Answer: spindle fibre."
    },
    {
      "number": "2.2.4",
      "marks": 2,
      "clues": "- Describe what the spindle fibre attaches to and what it does.",
      "approach": "- Say where it attaches.\n- Say how it moves the chromatids.",
      "solution": "1. The spindle fibre attaches to the centromere.\n2. It contracts (shortens) to pull the chromatids or chromosomes to the opposite poles."
    },
    {
      "number": "2.2.5",
      "marks": 5,
      "clues": "- In metaphase II the chromosomes are single, not in pairs, and lie in one row on the equator.\n- Keep the same shading as the anaphase II cell.",
      "approach": "- Draw 2 unpaired chromosomes in a single row at the equator.\n- Shade them correctly.\n- Add two correct labels (not centriole or spindle fibre).",
      "solution": "1. Position: chromosomes in a single row at the equator (1 mark).\n2. Number: 2 unpaired chromosomes (1 mark).\n3. Shading: one shaded chromosome with an unshaded tip and one unshaded chromosome with a shaded tip (1 mark).\n4. Any two correct labels, such as cell membrane, cytoplasm, chromosome, chromatid or centromere (2 marks)."
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
