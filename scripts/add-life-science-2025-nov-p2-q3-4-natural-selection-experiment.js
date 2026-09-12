#!/usr/bin/env node
/**
 * DBE Life Sciences P2 — November 2025 — Question 3.4 (Natural Selection Experiment) (order 15)
 *
 * Real Q3.4 (13 marks) is built around an experimental setup diagram plus two
 * generation-1-vs-generation-60 population graphs (fruit-fly starvation resistance) —
 * DESIGN-UNI-10 rule 1, one lesson. Fresh practice questions use a different organism
 * and selection pressure entirely (bacterial antibiotic resistance, not fruit-fly
 * starvation — DESIGN-UNI-01) and describe the setup/results in prose, same text-
 * description approach as the other diagram-flagged lessons this session.
 *
 * Topic reuses `evolution_by_natural_selection`. Independent lesson (DESIGN-UNI-13).
 * This is the last lesson of the paper — Q1-Q3 now fully covered (150/150 marks).
 *
 *   node tools/validate-questions.js --script scripts/add-life-science-2025-nov-p2-q3-4-natural-selection-experiment.js
 *   node scripts/add-life-science-2025-nov-p2-q3-4-natural-selection-experiment.js --dry-run
 *   node scripts/add-life-science-2025-nov-p2-q3-4-natural-selection-experiment.js
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
  name: 'Question 3.4 (Natural Selection Experiment)',
  syllabus: 'dbe',
  subject: 'life_science',
  year: 2025,
  paper: 'nov_p2',
  order: 15,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['evolution_by_natural_selection', 'natural_selection_experiment'],
  question_image_urls: ["https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2025/nov_p2/q15/question_1.png","https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2025/nov_p2/q15/question_2.png"],
  memo_image_urls: ["https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2025/nov_p2/q15/memo_1.png"],
  exam_question_marks: 13,
};

const questions = [
  {
    name: 'Question 1',
    question:
      'Scientists exposed a large population of bacteria to a low concentration of an antibiotic, deliberately increasing the concentration over 40 generations, and recorded the percentage of the population resistant to the antibiotic at each generation. Match each experimental design term to its role in this investigation.',
    metadata: [
      'A - Independent variable',
      'B - Dependent variable',
      'C - Controlled variable',
      '1 - The concentration of antibiotic the researchers deliberately varied',
      '2 - The percentage of the population resistant to the antibiotic, which was measured',
      '3 - The temperature of incubation, kept the same throughout',
    ],
    answer: ['A-1', 'B-2', 'C-3'],
    presentation: 'match',
    type: 'application',
    unit: 'diversity_change_and_continuity',
    topic: 'evolution_by_natural_selection',
    subtopic: 'experimental_variable_identification',
    skills: ['identify_experimental_variables'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'life_science',
    year: 2025,
    paper: 'nov_p2',
    clues: '- One of the three is what the researchers changed on purpose; one is what they measured as a result; one is what they deliberately kept the same.\n- Reread the scenario slowly, one variable at a time.',
  },
  {
    name: 'Question 2',
    question:
      'In this same bacterial antibiotic-resistance experiment, which of the following should be kept CONSTANT (controlled) across all generations, to ensure a fair test?',
    metadata: [
      'The strain (type) of bacteria used',
      'The temperature of incubation',
      'The type of growth medium/nutrients provided',
      'The concentration of antibiotic used',
      'The number of generations that have passed',
    ],
    answer: ['The strain (type) of bacteria used', 'The temperature of incubation', 'The type of growth medium/nutrients provided', '', ''],
    presentation: 'multi_select',
    type: 'definition',
    unit: 'diversity_change_and_continuity',
    topic: 'evolution_by_natural_selection',
    subtopic: 'experimental_controlled_variables',
    skills: ['identify_controlled_variables'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'life_science',
    year: 2025,
    paper: 'nov_p2',
    clues: '- A controlled variable must stay fixed, unlike the one variable the researchers are deliberately changing.\n- Tracking generation number is just recording time passing, not something to hold fixed.',
  },
  {
    name: 'Question 3',
    question: 'Why is it important to keep the growth medium and temperature constant across every generation in this experiment?',
    metadata: [
      'So that any change in resistance can be confidently attributed to antibiotic exposure, not some other varying factor',
      "So that the bacteria grow as quickly as possible, regardless of the experiment's purpose",
      'Because bacteria cannot survive if conditions change at all',
      'It has no real effect on the validity of the experiment',
      '',
    ],
    answer: ['So that any change in resistance can be confidently attributed to antibiotic exposure, not some other varying factor', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'diversity_change_and_continuity',
    topic: 'evolution_by_natural_selection',
    subtopic: 'experimental_design_rationale',
    skills: ['explain_experimental_design_rationale'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'life_science',
    year: 2025,
    paper: 'nov_p2',
    clues: '- If more than one thing changes at once, you can no longer be sure which change caused the result.\n- The whole point of a controlled variable is to rule out alternative explanations.',
  },
  {
    name: 'Question 4',
    question:
      'After 40 generations of exposure to increasing antibiotic concentrations, researchers compared the resistance of Generation 1 to Generation 40. Which outcome would be the expected result if natural selection had occurred?',
    metadata: [
      'Generation 40 has a much higher percentage of resistant bacteria than Generation 1',
      'Generation 40 has a much lower percentage of resistant bacteria than Generation 1',
      'Generation 1 and Generation 40 show exactly the same percentage of resistant bacteria',
      'Resistance is completely random and unrelated to generation number',
      '',
    ],
    answer: ['Generation 40 has a much higher percentage of resistant bacteria than Generation 1', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'diversity_change_and_continuity',
    topic: 'evolution_by_natural_selection',
    subtopic: 'natural_selection_results_interpretation',
    skills: ['interpret_natural_selection_results'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'life_science',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Natural selection predicts a shift toward the trait that helps survival under the pressure applied.\n- The antibiotic is the selection pressure here, applied consistently across all 40 generations.',
    supplementary_material: {
      type: 'graph',
      label: 'Antibiotic Resistance Over Generations',
      image_urls: ['https://media-dev.askmoreprepmore.app/question_supplementary/life_science/2025/nov_p2/q15/graph_1.png'],
    },
  },
  {
    name: 'Question 5',
    question:
      "Using Darwin's theory of natural selection, which explanation best accounts for the increase in antibiotic resistance seen across the 40 generations?",
    metadata: [
      'Naturally-occurring variation in resistance meant more resistant bacteria survived and reproduced more, passing the trait on and increasing its frequency over generations',
      "Every bacterium in the population developed resistance during its own lifetime and then passed this acquired resistance to its offspring",
      "The antibiotic directly changed the bacteria's DNA to make them resistant",
      'Resistance appeared by random chance and has no connection to survival or reproduction',
      '',
    ],
    answer: ['Naturally-occurring variation in resistance meant more resistant bacteria survived and reproduced more, passing the trait on and increasing its frequency over generations', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'diversity_change_and_continuity',
    topic: 'evolution_by_natural_selection',
    subtopic: 'natural_selection_explanation',
    skills: ['explain_natural_selection_mechanism'],
    difficulty: 4,
    exam_weight: 2,
    xp: 10,
    order: 5,
    syllabus: 'dbe',
    subject: 'life_science',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Darwin\'s theory relies on variation that already exists in the population, not on organisms acquiring a trait during their own lifetime.\n- Survival and reproduction rate, not direct DNA alteration by the environment, is what changes the population over generations.',
  },
];

const aiExplanation = {
  sub_questions: [
    {
      number: '3.4.1',
      marks: 1,
      clues: '- This is the one factor the investigators deliberately changed/controlled between the two conditions (food present, then removed).\n- It is what the whole procedure is testing the effect of.',
      approach: '- Identify what the investigators deliberately varied across the procedure (removing and returning food).\n- Recall the term for this deliberately varied factor.',
      solution: '1. The investigators deliberately varied whether food was available to the fruit flies.\n2. The independent variable is the availability of food.',
    },
    {
      number: '3.4.2',
      marks: 1,
      clues: '- This is what the investigators actually measured and recorded as their result.\n- Look at what specific value was recorded for each generation.',
      approach: '- Identify what specific measurement the procedure describes recording.\n- State how it was measured (what was timed, and to what threshold).',
      solution: '1. The dependent variable was measured by recording the time it took for 80% of the fruit flies to die from starvation.',
    },
    {
      number: '3.4.3',
      marks: 1,
      clues: '- This factor was deliberately kept the same when selecting flies for the investigation, so it could not affect the results.\n- Consider what characteristic of the flies themselves was controlled.',
      approach: '- Recall which characteristic of the fruit flies was described as being kept the same at the start.\n- Confirm this is a controlled variable, not the independent or dependent variable.',
      solution: '1. The fruit flies used were all of the same age.\n2. Age was the controlled variable considered when selecting the flies.',
    },
    {
      number: '3.4.4',
      marks: 2,
      clues: '- Consider what would happen to the investigation\'s validity if the flies were given different types of food.\n- Think about how many variables would then be changing at once.',
      approach: "- Explain what could go wrong if the food type varied between generations.\n- Connect this to the need for food availability to be the only variable affecting the results.",
      solution: "1. Giving the same type of food throughout improves the validity of the investigation.\n2. This ensures that the availability of food is the only independent variable changing.\n3. Any resulting changes in starvation resistance can then be attributed only to food availability, not diet differences.",
    },
    {
      number: '3.4.5',
      marks: 2,
      clues: '- Compare the range of hours shown on the horizontal axis between the two graphs.\n- One generation\'s flies died sooner overall; the other\'s died later overall.',
      approach: '- Read the approximate range of hours-until-death shown in the Generation 1 graph.\n- Read the approximate range of hours-until-death shown in the Generation 60 graph.\n- Compare the two ranges.',
      solution: '1. In Generation 1, most flies died from starvation within about 8 to 40 hours — a shorter time.\n2. In Generation 60, most flies died within about 140 to 180 hours — a much longer time.\n3. Starvation resistance increased substantially from Generation 1 to Generation 60.',
    },
    {
      number: '3.4.6',
      marks: 6,
      clues: "- Start from the fact that the original population already contained natural variation in starvation resistance.\n- Trace what happens to resistant versus non-resistant flies each time food is removed, generation after generation.",
      approach: '- State that variation in starvation resistance existed in the original population.\n- Explain what happens to non-resistant flies when food is removed (they die).\n- Explain that resistant flies survive, reproduce, and pass the resistance allele to offspring.\n- Conclude that this repeated selection over many generations increases the proportion of resistant flies.',
      solution: '1. There was variation in the population — some fruit flies were more starvation-resistant than others.\n2. When food was removed each generation, non-resistant flies died from starvation.\n3. Starvation-resistant flies survived and reproduced.\n4. They passed on the allele for starvation resistance to their offspring.\n5. Repeating this over 60 generations produced a population with a much higher proportion of starvation-resistant flies.',
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
