#!/usr/bin/env node
/**
 * DBE Life Sciences P2 — November 2025 — Question 1.4 (Mitosis and Meiosis) (order 5)
 *
 * Real Q1.4 (8 marks, 8 sub-items) bundles around one shared 5-cell diagram (identify
 * structures A/B/C, identify which cell shows a given phase, chromosome counts at the
 * end of mitosis/meiosis I) — DESIGN-UNI-10 rule 1, one lesson.
 *
 * DELIBERATE DESIGN CHOICE: fresh practice questions here are text-described scenarios,
 * not a redrawn diagram. Same escape hatch dbe-chemistry.md validated for structural
 * formulas (condensed text notation instead of an image) — phase identification and
 * chromosome counting are fully testable by describing chromosome behavior in prose
 * ("homologous chromosomes pair up at the equator...") without needing a picture. Avoids
 * a diagram-generation effort for this pass; a diagram-based version remains an option
 * later if this text-only approach turns out to lose too much of the real skill.
 *
 * Topic reuses `meiosis` (same curriculum node as add-life-science-2025-nov-p2-q1-
 * meiosis.js) — CAPS files "mitosis vs meiosis" comparison content under the Meiosis
 * topic itself (Section 3.3, Term 1), not a separate topic. Only new subtopics/skills/
 * tags needed here.
 *
 *   node tools/validate-questions.js --script scripts/add-life-science-2025-nov-p2-q1-4-mitosis-meiosis.js
 *   node scripts/add-life-science-2025-nov-p2-q1-4-mitosis-meiosis.js --dry-run
 *   node scripts/add-life-science-2025-nov-p2-q1-4-mitosis-meiosis.js
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
  name: 'Question 1.4 (Mitosis and Meiosis)',
  syllabus: 'dbe',
  subject: 'life_science',
  year: 2025,
  paper: 'nov_p2',
  order: 5,
  content_tier: 'free',
  has_video: false,
  xp: 60,
  tags: ['mitosis', 'meiosis'],
  question_image_urls: ["https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2025/nov_p2/q5/question_1.png"],
  memo_image_urls: ["https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2025/nov_p2/q5/memo_1.png"],
  exam_question_marks: 8,
};

const questions = [
  {
    name: 'Question 1',
    question: 'A cell starting with 8 chromosomes undergoes mitosis. How many chromosomes will each daughter cell have at the end of mitosis?',
    metadata: ['= ', '[ ]'],
    answer: ['8', '', '', '', ''],
    presentation: 'fitb',
    type: 'application',
    unit: 'molecular_cellular_tissue_level',
    topic: 'meiosis',
    subtopic: 'mitosis_chromosome_number',
    skills: ['calculate_mitosis_chromosome_number'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'life_science',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Mitosis produces daughter cells that are genetically and numerically identical to the parent cell.\n- No halving of chromosome number happens in mitosis.',
  },
  {
    name: 'Question 2',
    question:
      'A cell starting with 8 chromosomes undergoes meiosis. How many chromosomes will each cell produced at the end of meiosis I have?',
    metadata: ['= ', '[ ]'],
    answer: ['4', '', '', '', ''],
    presentation: 'fitb',
    type: 'application',
    unit: 'molecular_cellular_tissue_level',
    topic: 'meiosis',
    subtopic: 'meiosis_chromosome_number',
    skills: ['calculate_meiosis_chromosome_number'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'life_science',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Meiosis I separates homologous chromosome PAIRS, halving the chromosome number.\n- Each resulting cell still has two chromatids per chromosome at this stage — that doesn\'t change the chromosome count.',
  },
  {
    name: 'Question 3',
    question: 'Arrange the following phases of mitosis in the correct order.',
    metadata: ['Anaphase', 'Prophase', 'Telophase', 'Metaphase'],
    answer: ['Prophase', 'Metaphase', 'Anaphase', 'Telophase'],
    presentation: 'ordering',
    type: 'definition',
    unit: 'molecular_cellular_tissue_level',
    topic: 'meiosis',
    subtopic: 'mitosis_phase_sequence',
    skills: ['sequence_mitosis_phases'],
    difficulty: 1,
    exam_weight: 1,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'life_science',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Chromosomes must condense and become visible before they can line up.\n- Separation always happens before the cell divides into two.',
  },
  {
    name: 'Question 4',
    question:
      'In a dividing cell, homologous chromosomes pair up and align together at the equator, and sister chromatids do NOT separate at this stage. Which type of division is this cell undergoing?',
    metadata: ['Mitosis', 'Meiosis I', 'Meiosis II', 'Binary fission', ''],
    answer: ['Meiosis I', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'molecular_cellular_tissue_level',
    topic: 'meiosis',
    subtopic: 'meiosis_vs_mitosis_pairing',
    skills: ['identify_meiosis_by_chromosome_pairing'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'life_science',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Homologous PAIRS aligning together (not single chromosomes) is the giveaway.\n- This pairing never happens in mitosis.',
    supplementary_material: {
      type: 'diagram',
      label: 'Mitosis vs Meiosis I Comparison',
      image_urls: ['https://media-dev.askmoreprepmore.app/question_supplementary/life_science/2025/nov_p2/q5/diagram_1.png'],
    },
  },
  {
    name: 'Question 5',
    question: 'Which of the following occur during prophase of mitosis?',
    metadata: [
      'Chromatin condenses into visible chromosomes',
      'Spindle fibres begin to form',
      'The nuclear envelope breaks down',
      "Chromosomes align at the cell's equator",
      'Sister chromatids separate and move to opposite poles',
    ],
    answer: ['Chromatin condenses into visible chromosomes', 'Spindle fibres begin to form', 'The nuclear envelope breaks down', '', ''],
    presentation: 'multi_select',
    type: 'definition',
    unit: 'molecular_cellular_tissue_level',
    topic: 'meiosis',
    subtopic: 'mitosis_prophase_events',
    skills: ['identify_prophase_events'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 5,
    syllabus: 'dbe',
    subject: 'life_science',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Alignment at the equator happens one phase later.\n- Separation of chromatids happens two phases later.',
  },
  {
    name: 'Question 6',
    question: 'During which phase of meiosis does crossing over (the exchange of genetic material between homologous chromosomes) take place?',
    metadata: ['Prophase I', 'Metaphase I', 'Anaphase I', 'Telophase II', ''],
    answer: ['Prophase I', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'definition',
    unit: 'molecular_cellular_tissue_level',
    topic: 'meiosis',
    subtopic: 'crossing_over_timing',
    skills: ['identify_crossing_over_phase'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 6,
    syllabus: 'dbe',
    subject: 'life_science',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Homologous chromosomes are paired closely together only during this early phase.\n- Once chromosomes start moving apart, the opportunity for exchange is gone.',
  },
];

const aiExplanation = {
  sub_questions: [
    {
      number: '1.4.1(a)',
      marks: 1,
      clues: '- A points to the outer boundary of the whole cell, not to a structure inside it.',
      approach: "- Look at what structure label A's line actually touches at its tip.\n- Consider what encloses the entire cell from the outside.",
      solution: '1. Label A points to the outer boundary of the cell.\n2. This structure is the cell membrane.',
    },
    {
      number: '1.4.1(b)',
      marks: 1,
      clues: '- B points to one of the thread-like lines radiating out from a pole.\n- These lines are involved in moving chromosomes during division.',
      approach: '- Identify what type of structure the diagonal lines in the diagram represent.\n- Recall the name for the fibres that attach to and move chromosomes during cell division.',
      solution: '1. Label B points to one of the fibres radiating from the pole of the dividing cell.\n2. This structure is a spindle fibre.',
    },
    {
      number: '1.4.1(c)',
      marks: 1,
      clues: '- C points to where the spindle fibres converge, at one pole of the dividing cell.\n- This structure organises the spindle fibres.',
      approach: '- Identify the point where multiple spindle fibres meet.\n- Recall the name of the structure found at each pole that organises spindle fibre formation.',
      solution: '1. Label C points to the point where the spindle fibres converge at the pole.\n2. This structure is the centriole (centrosome).',
    },
    {
      number: '1.4.2(a)',
      marks: 1,
      clues: '- Look for a cell where chromosomes are condensing and visible, but NOT paired up with a homologous partner.\n- The nuclear envelope may still be partially visible.',
      approach: '- Distinguish mitotic prophase from meiotic prophase I by checking whether chromosomes are shown paired with their homologue or not.\n- Compare the chromosome arrangement across all five diagrams to find the match.',
      solution: '1. Diagram W shows condensed, unpaired chromosomes still within the nuclear area, with a spindle beginning to form.\n2. This is characteristic of mitotic prophase.\n3. The answer is W.',
    },
    {
      number: '1.4.2(b)',
      marks: 1,
      clues: '- Look for a cell where paired homologous chromosomes are aligned at the centre, between two poles.\n- Spindle fibres should be attached from both poles to the aligned chromosomes.',
      approach: '- Identify the diagram where chromosomes are lined up at the equator of the cell, rather than scattered or already separating.\n- Confirm the chromosomes are aligned as homologous PAIRS, not single chromosomes, to distinguish this from mitotic metaphase.',
      solution: '1. Diagram Y shows homologous chromosome pairs aligned at the equator, with spindle fibres extending from both poles.\n2. The answer is Y.',
    },
    {
      number: '1.4.2(c)',
      marks: 1,
      clues: '- Look for a cell where homologous chromosomes are visibly paired together within the nuclear area.\n- This pairing is unique to meiosis and does not occur in mitosis.',
      approach: '- Identify which diagram shows chromosomes bundled in homologous pairs, rather than as separate individual chromosomes.\n- Confirm a spindle is beginning to form, consistent with an early phase of division.',
      solution: '1. Diagram V shows chromosomes paired with their homologous partner within the nuclear area, with an early spindle forming.\n2. The answer is V.',
    },
    {
      number: '1.4.3(a)',
      marks: 1,
      clues: '- Mitosis does not change the chromosome number.\n- Count the number of chromosomes shown in one of the cells before division began.',
      approach: '- Determine the original (parent cell) chromosome number from the diagram.\n- Recall that mitosis produces daughter cells with the same chromosome number as the parent cell.',
      solution: "1. This organism's cells contain 6 chromosomes.\n2. Mitosis produces daughter cells genetically and numerically identical to the parent cell.\n3. Each daughter cell will have 6 chromosomes.",
    },
    {
      number: '1.4.3(b)',
      marks: 1,
      clues: "- Meiosis I separates homologous PAIRS, halving the chromosome number.\n- Consider the organism's original chromosome number, then halve it.",
      approach: '- Determine the original (parent cell) chromosome number.\n- Recall that meiosis I halves the chromosome number, unlike mitosis.',
      solution: "1. This organism's cells contain 6 chromosomes.\n2. Meiosis I separates homologous chromosome pairs, halving the number.\n3. Each cell produced at the end of meiosis I will have 3 chromosomes.",
    },
  ],
  model: 'claude-sonnet-5',
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
}

if (require.main === module) {
  upload()
    .catch((err) => {
      console.error('\n❌ Upload failed:', err.message);
      process.exitCode = 1;
    })
    .finally(closePool);
}
