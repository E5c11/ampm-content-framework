#!/usr/bin/env node
/**
 * DBE Life Sciences P2 — November 2025 — Question 2.1 (Meiosis and Sex Chromosomes) (order 7)
 *
 * Real Q2.1 (11 marks) is built around a genuinely sequential chain — 2.1.4(a) names
 * crossing over, 2.1.4(b) asks the phase it occurs in ("the process named in QUESTION
 * 2.1.4(a)"), 2.1.4(c) asks why it matters — exactly the shape DESIGN-UNI-13 was written
 * for. **This lesson is authored LINKED, not independent**: Question 2 ("the process
 * described in the previous question") and Question 3 ("the process described in
 * Question 1") deliberately reference Question 1's result, relaxing DESIGN-UNI-02 for
 * this set only. Sequence is guaranteed by `order`, no schema change needed. Questions
 * 4-6 happen to stand alone but that's fine within a linked lesson — DESIGN-UNI-13 makes
 * linking available, not mandatory per-question.
 *
 * `crossing_over_timing` subtopic and `identify_crossing_over_phase` skill are reused
 * verbatim from add-life-science-2025-nov-p2-q1-4-mitosis-meiosis.js (same real concept,
 * different lesson — DESIGN-UNI-03 only forbids repeating a concept *within* one lesson).
 *
 *   node tools/validate-questions.js --script scripts/add-life-science-2025-nov-p2-q2-1-sex-chromosomes.js
 *   node scripts/add-life-science-2025-nov-p2-q2-1-sex-chromosomes.js --dry-run
 *   node scripts/add-life-science-2025-nov-p2-q2-1-sex-chromosomes.js
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
  name: 'Question 2.1 (Meiosis and Sex Chromosomes)',
  syllabus: 'dbe',
  subject: 'life_science',
  year: 2025,
  paper: 'nov_p2',
  order: 7,
  content_tier: 'free',
  has_video: false,
  xp: 60,
  tags: ['meiosis', 'sex_chromosomes'],
  question_image_urls: ["https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2025/nov_p2/q7/question_1.png"],
  memo_image_urls: ["https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2025/nov_p2/q7/memo_1.png"],
  exam_question_marks: 11,
};

const questions = [
  {
    name: 'Question 1',
    question:
      'In a certain diploid animal species, a cell in the testis begins meiosis to produce sperm. During prophase I, an exchange of genetic material occurs between homologous chromosomes. What is this process called?',
    metadata: ['Crossing over', 'Non-disjunction', 'Fertilisation', 'Independent assortment', ''],
    answer: ['Crossing over', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'definition',
    unit: 'molecular_cellular_tissue_level',
    topic: 'meiosis',
    subtopic: 'crossing_over_process',
    skills: ['name_crossing_over_process'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'life_science',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Homologous chromosomes physically exchange segments of DNA with each other.\n- This is different from chromosomes simply failing to separate correctly.',
  },
  {
    name: 'Question 2',
    question: 'During which phase of meiosis does the process described in the previous question take place?',
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
    order: 2,
    syllabus: 'dbe',
    subject: 'life_science',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Homologous chromosomes are only paired closely together during this early phase.\n- Once separation begins, the opportunity for exchange is gone.',
  },
  {
    name: 'Question 3',
    question: 'Which of the following best explains why the process described in Question 1 is important for this species?',
    metadata: [
      'It increases genetic variation among the resulting gametes',
      'It ensures every gamete produced is genetically identical',
      'It doubles the number of chromosomes in each gamete',
      'It prevents mutations from occurring in the gametes',
      '',
    ],
    answer: ['It increases genetic variation among the resulting gametes', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'definition',
    unit: 'molecular_cellular_tissue_level',
    topic: 'meiosis',
    subtopic: 'crossing_over_importance',
    skills: ['explain_crossing_over_importance'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'life_science',
    year: 2025,
    paper: 'nov_p2',
    clues: '- New combinations of alleles end up together on the same chromosome that weren\'t together before.\n- More genetically different gametes means more genetically different possible offspring.',
  },
  {
    name: 'Question 4',
    question:
      "In this species, sex is determined by X and Y chromosomes, with females being XX and males being XY. Which of the following statements about the sex chromosomes are TRUE?",
    metadata: [
      "A male's somatic (body) cells contain one X chromosome and one Y chromosome",
      "A female's somatic (body) cells contain two identical X chromosomes",
      'The X and Y chromosomes are always identical in size and gene content',
      'Every sperm cell produced carries an X chromosome',
      'Every egg cell produced carries an X chromosome',
    ],
    answer: [
      "A male's somatic (body) cells contain one X chromosome and one Y chromosome",
      "A female's somatic (body) cells contain two identical X chromosomes",
      'Every egg cell produced carries an X chromosome',
      '',
      '',
    ],
    presentation: 'multi_select',
    type: 'definition',
    unit: 'molecular_cellular_tissue_level',
    topic: 'meiosis',
    subtopic: 'sex_chromosome_composition',
    skills: ['identify_sex_chromosome_composition'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'life_science',
    year: 2025,
    paper: 'nov_p2',
    clues: '- The X and Y chromosomes differ in size and in which genes they carry.\n- Half of sperm cells carry an X, and half carry a Y — but every egg cell carries an X, since the mother is XX.',
    supplementary_material: {
      type: 'diagram',
      label: 'Sex Chromosomes',
      image_urls: ['https://media-dev.askmoreprepmore.app/question_supplementary/life_science/2025/nov_p2/q7/diagram_1.png'],
    },
  },
  {
    name: 'Question 5',
    question: 'Match each term to its correct description.',
    metadata: [
      'A - Sex chromosome',
      'B - Autosome',
      'C - Homologous chromosomes',
      '1 - A chromosome that determines the biological sex of an organism',
      '2 - Any chromosome that is not involved in determining sex',
      '3 - A matching pair of chromosomes, one inherited from each parent, carrying the same genes',
    ],
    answer: ['A-1', 'B-2', 'C-3'],
    presentation: 'match',
    type: 'definition',
    unit: 'molecular_cellular_tissue_level',
    topic: 'meiosis',
    subtopic: 'sex_chromosome_terminology',
    skills: ['define_sex_chromosome_terms'],
    difficulty: 1,
    exam_weight: 1,
    xp: 10,
    order: 5,
    syllabus: 'dbe',
    subject: 'life_science',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Autosomes make up the majority of an organism\'s chromosomes and have nothing to do with sex.\n- "Homologous" describes a relationship between two chromosomes, not a single chromosome on its own.',
  },
  {
    name: 'Question 6',
    question:
      'Non-disjunction of the X and Y chromosomes occurs during meiosis in a male of this species, producing a sperm cell carrying BOTH an X and a Y chromosome. If this sperm fertilises a normal egg cell (carrying a single X chromosome), what will the sex chromosome genotype of the resulting zygote be?',
    metadata: ['XXY', 'XYY', 'XXX', 'XO (a single X, no second sex chromosome)', ''],
    answer: ['XXY', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'molecular_cellular_tissue_level',
    topic: 'meiosis',
    subtopic: 'nondisjunction_zygote_genotype',
    skills: ['predict_nondisjunction_zygote_genotype'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 6,
    syllabus: 'dbe',
    subject: 'life_science',
    year: 2025,
    paper: 'nov_p2',
    clues: '- The unusual sperm already carries two sex chromosomes instead of one.\n- Add whatever the normal egg contributes to what the sperm already carries.',
  },
];

const aiExplanation = {
  sub_questions: [
    {
      number: '2.1.1',
      marks: 1,
      clues: '- A points to the point where the two sister chromatids of a chromosome are joined together.\n- This structure is also where spindle fibres attach during division.',
      approach: '- Identify the point on the chromosome diagram where the two chromatid arms meet.\n- Recall the name of this structure.',
      solution: '1. Structure A is the point where the two sister chromatids join.\n2. This structure is the centromere.',
    },
    {
      number: '2.1.2',
      marks: 1,
      clues: '- This term refers specifically to chromosomes involved in determining biological sex.\n- It distinguishes these chromosomes from autosomes.',
      approach: '- Distinguish these chromosomes from autosomes based on their role.\n- Recall the specific collective term for the chromosomes that determine sex.',
      solution: '1. The chromosomes that determine biological sex are called gonosomes (sex chromosomes).',
    },
    {
      number: '2.1.3',
      marks: 1,
      clues: "- A female's cells (shown in the diagram) contain two identical sex chromosomes.\n- Consider what a male's equivalent chromosome pair looks like instead.",
      approach: "- Recall the sex chromosome composition of a typical male's somatic cells.\n- Compare this to the female composition shown in the diagram (XX).",
      solution: "1. The diagram shows a female's sex chromosomes: two X-chromosomes.\n2. In a male's somatic cells, there will instead be one X-chromosome and one Y-chromosome.",
    },
    {
      number: '2.1.4(a)',
      marks: 1,
      clues: '- Region P shows an exchange of genetic material between the two chromatids of a homologous pair.\n- This exchange happens during a specific phase of meiosis.',
      approach: '- Identify what is happening at region P — an exchange, not a separation, of genetic material.\n- Recall the name of this specific process between homologous chromosomes.',
      solution: '1. The exchange of genetic material shown at region P is called crossing over.',
    },
    {
      number: '2.1.4(b)',
      marks: 1,
      clues: '- Homologous chromosomes are only paired closely together during one specific early phase.\n- This phase precedes metaphase I.',
      approach: '- Consider at which stage of meiosis homologous chromosomes are paired closely enough for exchange.\n- Recall the specific phase name.',
      solution: '1. Crossing over takes place during prophase I.',
    },
    {
      number: '2.1.4(c)',
      marks: 1,
      clues: '- Consider what effect this exchange has on the genetic content of the resulting gametes.\n- Think about how this contributes to differences between offspring.',
      approach: '- Recall what crossing over does to the combinations of alleles on a chromosome.\n- Connect this to its effect on genetic variation among gametes.',
      solution: '1. Crossing over creates new combinations of alleles on a chromosome.\n2. This leads to increased genetic variation among the gametes produced.',
    },
    {
      number: '2.1.5',
      marks: 2,
      clues: '- By the end of meiosis II, sister chromatids have separated from each other.\n- Consider what each separated chromatid becomes once it is on its own.',
      approach: "- Recall what happens to sister chromatids during anaphase II.\n- Consider how crossing over (from prophase I) affects the genetic content of each separated chromatid.\n- Describe both the structural change and its genetic consequence.",
      solution: '1. At the end of meiosis II, the sister chromatids have separated at the centromere and now exist as individual chromosomes.\n2. Because crossing over occurred earlier, each of these chromosomes carries some genetic material originally from its homologous partner.',
    },
    {
      number: '2.1.6',
      marks: 3,
      clues: '- Non-disjunction here produces a gamete carrying BOTH sex chromosomes instead of one.\n- Consider what a normal sperm contributes, and add this to the abnormal egg\'s contribution.',
      approach: '- Determine the sex chromosome composition of the abnormal gamete produced by non-disjunction.\n- Recall the two possible sex chromosome compositions a normal sperm can contribute.\n- Combine these to describe the resulting zygote\'s chromosome composition, considering both possible sperm types.',
      solution: '1. Non-disjunction produces an egg carrying both X-chromosomes (XX) instead of one.\n2. If this egg is fertilised by a normal X-carrying sperm, the zygote will be XXX.\n3. If this egg is fertilised by a normal Y-carrying sperm, the zygote will be XXY.\n4. Either way, the zygote has an abnormal number of sex chromosomes.',
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
