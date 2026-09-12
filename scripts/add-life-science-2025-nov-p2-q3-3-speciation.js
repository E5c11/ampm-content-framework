#!/usr/bin/env node
/**
 * DBE Life Sciences P2 — November 2025 — Question 3.3 (Speciation and Reproductive
 * Isolation) (order 14)
 *
 * Real Q3.3 (12 marks) is built around a world map of ratite distribution — DESIGN-
 * UNI-10 rule 1, one lesson. Fresh practice questions use a different scenario entirely
 * (island finches, not ratites — DESIGN-UNI-01) and describe the geographic setup in
 * prose rather than a redrawn map, same text-description approach as the other diagram-
 * flagged lessons this session.
 *
 * Topic reuses `evolution_by_natural_selection` (add-life-science-2025-nov-p2-q1-
 * evolution.js) — CAPS files "Formation/emergence of new species" and "Mechanisms for
 * reproductive isolation" under that same topic heading. Independent lesson
 * (DESIGN-UNI-13).
 *
 *   node tools/validate-questions.js --script scripts/add-life-science-2025-nov-p2-q3-3-speciation.js
 *   node scripts/add-life-science-2025-nov-p2-q3-3-speciation.js --dry-run
 *   node scripts/add-life-science-2025-nov-p2-q3-3-speciation.js
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
  name: 'Question 3.3 (Speciation and Reproductive Isolation)',
  syllabus: 'dbe',
  subject: 'life_science',
  year: 2025,
  paper: 'nov_p2',
  order: 14,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['evolution_by_natural_selection', 'speciation'],
  question_image_urls: ["https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2025/nov_p2/q14/question_1.png"],
  memo_image_urls: ["https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2025/nov_p2/q14/memo_1.png"],
  exam_question_marks: 12,
};

const questions = [
  {
    name: 'Question 1',
    question: 'Match each term to its correct definition.',
    metadata: [
      'A - Biological species',
      'B - Reproductive isolation',
      'C - Speciation',
      'D - Biogeography',
      '1 - A group of organisms that can interbreed and produce fertile offspring under natural conditions',
      '2 - Any mechanism that prevents two populations from successfully interbreeding',
      '3 - The formation of one or more new species from an existing species',
      '4 - The study of the geographic distribution of species',
    ],
    answer: ['A-1', 'B-2', 'C-3', 'D-4'],
    presentation: 'match',
    type: 'definition',
    unit: 'diversity_change_and_continuity',
    topic: 'evolution_by_natural_selection',
    subtopic: 'evolution_terminology',
    skills: ['define_evolution_terms'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'life_science',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Two of these terms describe a PROCESS, and two describe a FIELD OF STUDY or a GROUP.\n- "Isolation" is about preventing interbreeding; "speciation" is about the result of that prevention over time.',
  },
  {
    name: 'Question 2',
    question:
      'Two populations of the same ancestral bird species become separated when a new mountain range rises between them, preventing any contact for thousands of years. Over time, the two populations become so different that even if reunited, they could no longer interbreed successfully. What term describes this process of new-species formation?',
    metadata: [
      'Speciation through geographic isolation',
      'Convergent evolution',
      'Genetic engineering',
      'Punctuated equilibrium (this describes a rate of change, not how new species form)',
      '',
    ],
    answer: ['Speciation through geographic isolation', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'diversity_change_and_continuity',
    topic: 'evolution_by_natural_selection',
    subtopic: 'geographic_speciation',
    skills: ['identify_geographic_speciation'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'life_science',
    year: 2025,
    paper: 'nov_p2',
    clues: '- The key trigger here is a physical barrier preventing contact, not a change in behaviour or breeding time.\n- The end result is two populations that can no longer produce fertile offspring together.',
  },
  {
    name: 'Question 3',
    question: 'Which of the following are examples of reproductive isolation mechanisms that can prevent two related populations from interbreeding?',
    metadata: [
      'Breeding at different times of the year',
      'Different courtship behaviours that fail to attract mates from the other population',
      'Geographic separation preventing any contact between populations',
      'Having identical mating calls',
      'Living in the exact same habitat and breeding at the exact same time',
    ],
    answer: [
      'Breeding at different times of the year',
      'Different courtship behaviours that fail to attract mates from the other population',
      'Geographic separation preventing any contact between populations',
      '',
      '',
    ],
    presentation: 'multi_select',
    type: 'definition',
    unit: 'diversity_change_and_continuity',
    topic: 'evolution_by_natural_selection',
    subtopic: 'reproductive_isolation_mechanisms',
    skills: ['identify_reproductive_isolation_mechanisms'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'life_science',
    year: 2025,
    paper: 'nov_p2',
    clues: '- A valid mechanism must actually make interbreeding LESS likely, not more likely.\n- Sharing everything in common (habitat, timing, calls) works against isolation, not for it.',
  },
  {
    name: 'Question 4',
    question:
      'Closely related species of finch are found on different, isolated islands of the same archipelago, each with a slightly different beak shape suited to the food available on their own island. What type of evidence for evolution does this represent?',
    metadata: ['Biogeographical evidence (evidence from geographic distribution)', 'Fossil evidence', 'Genetic (DNA) evidence', 'Evidence from artificial selection', ''],
    answer: ['Biogeographical evidence (evidence from geographic distribution)', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'definition',
    unit: 'diversity_change_and_continuity',
    topic: 'evolution_by_natural_selection',
    subtopic: 'biogeographical_evidence',
    skills: ['identify_biogeographical_evidence'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'life_science',
    year: 2025,
    paper: 'nov_p2',
    clues: '- The key detail here is WHERE each species is found, not what its fossils or DNA look like.\n- This category of evidence is named directly after the geography involved.',
  },
  {
    name: 'Question 5',
    question: 'How does the finch example in the previous question support the theory of evolution?',
    metadata: [
      'It shows that populations descended from a common ancestor adapted differently over time in response to different local environments',
      'It shows that all finch species were created independently and never share ancestry',
      'It proves that beak shape has no relationship to diet',
      'It shows that evolution only occurs in birds, never in other animals',
      '',
    ],
    answer: ['It shows that populations descended from a common ancestor adapted differently over time in response to different local environments', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'diversity_change_and_continuity',
    topic: 'evolution_by_natural_selection',
    subtopic: 'biogeography_evolution_support',
    skills: ['explain_biogeography_supports_evolution'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 5,
    syllabus: 'dbe',
    subject: 'life_science',
    year: 2025,
    paper: 'nov_p2',
    clues: '- The finches share a common ancestor but no longer look identical — something must have caused that difference.\n- Each island\'s own food supply is the environmental pressure driving the difference.',
  },
];

const aiExplanation = {
  sub_questions: [
    {
      number: '3.3.1(a)',
      marks: 2,
      clues: '- This term defines species based on their ability to reproduce with each other.\n- The offspring produced must also be able to reproduce.',
      approach: '- Recall the two key parts of the biological species definition: shared characteristics, and reproductive compatibility.\n- State both parts clearly.',
      solution: '1. A biological species is a group of organisms with similar characteristics.\n2. They are able to interbreed to produce fertile offspring.',
    },
    {
      number: '3.3.1(b)',
      marks: 2,
      clues: '- The extract states each ratite species lays eggs during a different period of the year.\n- Consider how this timing difference would prevent mating between the ostrich and the emu.',
      approach: "- Identify each species' breeding period stated in the extract.\n- Explain why non-overlapping breeding periods would prevent interbreeding.",
      solution: '1. Ostriches lay eggs mainly in September, while emus lay eggs from November to April — different times of year.\n2. Since their breeding periods do not overlap, the two species cannot interbreed.',
    },
    {
      number: '3.3.1(c)',
      marks: 2,
      clues: '- Consider isolation mechanisms other than geography or breeding time.\n- Think about behavioural or physical barriers to successful mating.',
      approach: '- Recall reproductive isolation mechanisms besides geographic separation and differing breeding times.\n- Select any two valid mechanisms (e.g. behavioural, mechanical, or post-mating barriers).',
      solution: '1. Species-specific courtship behaviour could prevent mating between the two species.\n2. Even if mating occurred, infertile offspring or prevention of fertilisation could still prevent successful interbreeding.\n3. Any two of these mechanisms would be acceptable.',
    },
    {
      number: '3.3.2',
      marks: 1,
      clues: '- This field of study focuses on where species are found around the world.\n- The evidence shown in the map is about species distribution, not fossils or genetics.',
      approach: '- Consider what kind of evidence a world distribution map actually shows.\n- Recall the specific term for the study of geographic distribution of species.',
      solution: '1. The evidence shown in the diagram (species distribution across continents) is called biogeography.',
    },
    {
      number: '3.3.3',
      marks: 5,
      clues: '- The ratites share one common ancestor before their present-day distribution existed.\n- Consider what geological event could have physically separated the ancestral population, and what happened afterward.',
      approach: "- State that the ratites share a common ancestor.\n- Explain how continental drift separated the ancestral population into isolated groups.\n- Explain that each isolated group faced different environmental conditions and evolved independently through natural selection.\n- Conclude that this independent evolution produced the different ratite species seen today.",
      solution: '1. The ratites descended from one common ancestor.\n2. When continental drift occurred, the ancestral population was separated into isolated groups.\n3. Each sub-population faced different environmental conditions.\n4. Each group underwent natural selection independently.\n5. Over time, this independent selection produced the different ratite species seen today.',
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
