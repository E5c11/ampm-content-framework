#!/usr/bin/env node
/**
 * DBE Life Sciences P2 — November 2025 — Question 2.2 (DNA Fingerprinting) (order 8)
 *
 * Real Q2.2 (9 marks) is built around a gel-band diagram (crime scene / victim / two
 * suspects) — DESIGN-UNI-10 rule 1, one lesson. Fresh practice questions describe band-
 * match patterns in prose ("Suspect B's fingerprint shares every band position...")
 * instead of a redrawn gel image — same text-description approach as the two Q1.4/Q1.5
 * lessons, avoiding a diagram-generation effort for this pass.
 *
 * Topic reuses `dna_code_of_life` — CAPS explicitly names "Paternity testing and DNA
 * finger printing (forensics)" under that topic (Section 3.3, Term 2). Independent
 * lesson (DESIGN-UNI-13) — no cross-question dependency needed here.
 *
 *   node tools/validate-questions.js --script scripts/add-life-science-2025-nov-p2-q2-2-dna-fingerprinting.js
 *   node scripts/add-life-science-2025-nov-p2-q2-2-dna-fingerprinting.js --dry-run
 *   node scripts/add-life-science-2025-nov-p2-q2-2-dna-fingerprinting.js
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
  name: 'Question 2.2 (DNA Fingerprinting)',
  syllabus: 'dbe',
  subject: 'life_science',
  year: 2025,
  paper: 'nov_p2',
  order: 8,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['dna_fingerprinting', 'dna_code_of_life'],
  question_image_urls: ["https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2025/nov_p2/q8/question_1.png"],
  memo_image_urls: ["https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2025/nov_p2/q8/memo_1.png","https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2025/nov_p2/q8/memo_2.png"],
  exam_question_marks: 9,
};

const questions = [
  {
    name: 'Question 1',
    question:
      'Forensic scientists compare unique patterns of DNA fragments between a crime-scene sample and samples from several suspects to identify a match. What is this technique called?',
    metadata: ['Gel electrophoresis of proteins', 'DNA fingerprinting (DNA profiling)', 'Karyotyping', 'Genetic engineering', ''],
    answer: ['DNA fingerprinting (DNA profiling)', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'definition',
    unit: 'molecular_cellular_tissue_level',
    topic: 'dna_code_of_life',
    subtopic: 'dna_fingerprinting_technique',
    skills: ['name_dna_fingerprinting_technique'],
    difficulty: 1,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'life_science',
    year: 2025,
    paper: 'nov_p2',
    clues: '- This technique compares patterns of DNA fragments, not proteins.\n- It produces a unique pattern for each individual, used to match samples.',
  },
  {
    name: 'Question 2',
    question:
      "At a crime scene, a DNA sample is left behind. Of three suspects tested, Suspect B's DNA fingerprint shares every band position with the crime-scene sample, while Suspects A and C each differ at several positions. Based on this evidence alone, which suspect was most likely present at the crime scene?",
    metadata: ['Suspect A', 'Suspect B', 'Suspect C', 'None of the suspects can be identified from this evidence', ''],
    answer: ['Suspect B', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'molecular_cellular_tissue_level',
    topic: 'dna_code_of_life',
    subtopic: 'dna_band_pattern_comparison',
    skills: ['compare_dna_band_patterns'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'life_science',
    year: 2025,
    paper: 'nov_p2',
    clues: '- A full match across every band position is the strongest evidence of the three.\n- A partial mismatch, even a small one, makes that suspect a poorer fit.',
    supplementary_material: {
      type: 'diagram',
      label: 'DNA Fingerprint Comparison',
      image_urls: ['https://media-dev.askmoreprepmore.app/question_supplementary/life_science/2025/nov_p2/q8/diagram_1.png'],
    },
  },
  {
    name: 'Question 3',
    question:
      "Even if a suspect's DNA fingerprint matches a crime-scene sample exactly, which of the following are valid reasons this evidence alone might NOT be enough to convict them?",
    metadata: [
      "The suspect's DNA could have been present at the scene for an innocent, unrelated reason",
      'The sample could have been contaminated or mishandled during collection or testing',
      'Identical twins share the same DNA fingerprint',
      "DNA fingerprints are different for every cell in the same person's body",
      'A DNA match proves the suspect committed the crime beyond any doubt',
    ],
    answer: [
      "The suspect's DNA could have been present at the scene for an innocent, unrelated reason",
      'The sample could have been contaminated or mishandled during collection or testing',
      'Identical twins share the same DNA fingerprint',
      '',
      '',
    ],
    presentation: 'multi_select',
    type: 'application',
    unit: 'molecular_cellular_tissue_level',
    topic: 'dna_code_of_life',
    subtopic: 'dna_match_limitations',
    skills: ['identify_dna_match_limitations'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'life_science',
    year: 2025,
    paper: 'nov_p2',
    clues: '- A match tells you the DNA was present — it doesn\'t explain how or why it got there.\n- Every cell in one person\'s body carries the same DNA fingerprint, but two people with identical DNA do exist in one specific case.',
  },
  {
    name: 'Question 4',
    question:
      "In a paternity test, a child's DNA fingerprint is compared to that of the mother and an alleged father. What pattern would confirm the alleged father is the biological father?",
    metadata: [
      "The child's fingerprint is completely identical to the mother's",
      "Every band in the child's fingerprint not inherited from the mother matches a band in the alleged father's fingerprint",
      "The alleged father's fingerprint is completely different from the child's",
      'The child shares no bands with either parent',
      '',
    ],
    answer: ["Every band in the child's fingerprint not inherited from the mother matches a band in the alleged father's fingerprint", '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'molecular_cellular_tissue_level',
    topic: 'dna_code_of_life',
    subtopic: 'paternity_testing_interpretation',
    skills: ['interpret_paternity_test'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'life_science',
    year: 2025,
    paper: 'nov_p2',
    clues: '- A child inherits half their DNA fingerprint bands from each biological parent.\n- Bands not explained by the mother must be explained by the father, if he really is the father.',
  },
  {
    name: 'Question 5',
    question: 'Arrange the following steps of the DNA fingerprinting process in the correct order.',
    metadata: [
      'An electric current separates the fragments by size on a gel',
      'DNA is extracted from the sample (e.g. blood or saliva)',
      'The resulting band pattern is compared between samples',
      'DNA is cut into fragments using restriction enzymes',
    ],
    answer: [
      'DNA is extracted from the sample (e.g. blood or saliva)',
      'DNA is cut into fragments using restriction enzymes',
      'An electric current separates the fragments by size on a gel',
      'The resulting band pattern is compared between samples',
    ],
    presentation: 'ordering',
    type: 'definition',
    unit: 'molecular_cellular_tissue_level',
    topic: 'dna_code_of_life',
    subtopic: 'dna_fingerprinting_procedure',
    skills: ['sequence_dna_fingerprinting_steps'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 5,
    syllabus: 'dbe',
    subject: 'life_science',
    year: 2025,
    paper: 'nov_p2',
    clues: '- DNA has to be obtained from the sample before anything can be done to it.\n- Comparison only makes sense once the pattern actually exists.',
  },
];

const aiExplanation = {
  sub_questions: [
    {
      number: '2.2.1',
      marks: 1,
      clues: '- This technique compares unique patterns of DNA fragments between different samples.\n- It is used to identify or exclude individuals based on their DNA.',
      approach: '- Consider what the crime-scene and suspect samples are being compared for.\n- Recall the specific term for this identification technique.',
      solution: '1. The technique used in this investigation is DNA profiling (DNA fingerprinting).',
    },
    {
      number: '2.2.2',
      marks: 1,
      clues: "- Compare each suspect's band pattern to the crime-scene sample's band pattern.\n- Look for the suspect whose pattern matches exactly.",
      approach: "- Compare the band positions of the crime-scene sample against each suspect's sample.\n- Identify which suspect's pattern is identical.",
      solution: "1. Comparing the band patterns shows Suspect 1's profile matches the crime-scene sample exactly.\n2. The answer is Suspect 1.",
    },
    {
      number: '2.2.3',
      marks: 1,
      clues: '- Base your reason only on what can be directly observed by comparing the two band patterns.\n- Consider how many band positions match between the two samples.',
      approach: "- Reconsider which suspect's band pattern was identified as the match.\n- Describe what you observe when comparing that suspect's bands to the crime-scene sample's bands.",
      solution: '1. The DNA profile (band pattern) of Suspect 1 is identical to the DNA profile of the crime-scene sample.',
    },
    {
      number: '2.2.4',
      marks: 2,
      clues: "- A DNA match only shows the suspect's DNA was present — not how or why it got there.\n- Consider possible errors or alternative explanations in the process itself.",
      approach: '- List reasons unrelated to guilt that could explain a DNA match (e.g. innocent presence, contamination, errors).\n- Choose any two valid, distinct reasons.',
      solution: '1. Evidence could have been planted at the crime scene, or the suspect could have been present before the crime for an innocent reason.\n2. Human error, contamination of the sample, or manipulation of results could also produce a false match.\n3. Any two of these reasons would be acceptable.',
    },
    {
      number: '2.2.5',
      marks: 4,
      clues: "- A child inherits half of their DNA profile bands from each biological parent.\n- Compare which bands in the child's profile can be explained by the mother, and check the rest against the alleged father.",
      approach: "- Recall that DNA profiles of the child, mother, and alleged father are all compared.\n- Identify which of the child's bands are already explained by the mother's profile.\n- Check whether the remaining, unexplained bands match the alleged father's profile.",
      solution: "1. The DNA profiles of the child, the mother, and the possible father are compared.\n2. Since a child inherits 50% of their DNA from each parent, bands in the child's profile matching the mother's are identified and set aside.\n3. The remaining bands in the child's profile are then checked against the alleged father's profile.\n4. If these remaining bands match the alleged father, this supports him being the biological father.",
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
