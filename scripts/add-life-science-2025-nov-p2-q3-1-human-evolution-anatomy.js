#!/usr/bin/env node
/**
 * DBE Life Sciences P2 — November 2025 — Question 3.1 (Human Evolution: Comparative
 * Anatomy) (order 12)
 *
 * Real Q3.1 (12 marks) has no figure — comparative-anatomy reasoning only (vision
 * characteristics shared with apes, jaw differences, bipedalism significance of foramen
 * magnum/spine/pelvis) — DESIGN-UNI-10 rule 1, one lesson, no image-strategy decision
 * needed here at all.
 *
 * New topic (`human_evolution`) under the existing `diversity_change_and_continuity`
 * unit — distinct CAPS Strand 4 topic from `evolution_by_natural_selection`
 * (add-life-science-2025-nov-p2-q1-evolution.js). Independent lesson (DESIGN-UNI-13).
 *
 *   node tools/validate-questions.js --script scripts/add-life-science-2025-nov-p2-q3-1-human-evolution-anatomy.js
 *   node scripts/add-life-science-2025-nov-p2-q3-1-human-evolution-anatomy.js --dry-run
 *   node scripts/add-life-science-2025-nov-p2-q3-1-human-evolution-anatomy.js
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
  name: 'Question 3.1 (Human Evolution: Comparative Anatomy)',
  syllabus: 'dbe',
  subject: 'life_science',
  year: 2025,
  paper: 'nov_p2',
  order: 12,
  content_tier: 'free',
  has_video: false,
  xp: 40,
  tags: ['human_evolution', 'bipedalism'],
  question_image_urls: ["https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2025/nov_p2/q12/question_1.png"],
  memo_image_urls: ["https://media-dev.askmoreprepmore.app/exam_papers/dbe/life_science/2025/nov_p2/q12/memo_1.png"],
  exam_question_marks: 12,
};

const questions = [
  {
    name: 'Question 1',
    question: 'Which of the following are vision-related characteristics that humans share with African apes?',
    metadata: [
      'Forward-facing eyes, giving good binocular (depth) vision',
      'Colour vision',
      'Eyes positioned on the sides of the head for a wide field of view',
      'A dependence on smell rather than sight to find food',
      'A third eyelid used for underwater vision',
    ],
    answer: ['Forward-facing eyes, giving good binocular (depth) vision', 'Colour vision', '', '', ''],
    presentation: 'multi_select',
    type: 'definition',
    unit: 'diversity_change_and_continuity',
    topic: 'human_evolution',
    subtopic: 'vision_characteristics_shared_with_apes',
    skills: ['identify_shared_vision_traits'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'life_science',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Side-positioned eyes and smell-dependence are typical of prey animals, not apes or humans.\n- Both traits listed as correct relate to how well the eyes judge distance and detect colour.',
  },
  {
    name: 'Question 2',
    question: 'Which of the following is a key difference between the jaw of a modern human and the jaw of an African ape?',
    metadata: [
      'Humans have a smaller, less protruding jaw with smaller canine teeth than apes',
      'Humans have a larger, more protruding jaw than apes',
      'Apes have no lower jaw at all',
      'Human and ape jaws are identical in every way',
      '',
    ],
    answer: ['Humans have a smaller, less protruding jaw with smaller canine teeth than apes', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'definition',
    unit: 'diversity_change_and_continuity',
    topic: 'human_evolution',
    subtopic: 'human_ape_jaw_differences',
    skills: ['identify_jaw_differences'],
    difficulty: 2,
    exam_weight: 2,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'life_science',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Apes have a jaw that projects further forward than a human jaw does.\n- Canine tooth size is one of the clearest differences between the two.',
  },
  {
    name: 'Question 3',
    question: 'Match each anatomical feature to why it is significant for human bipedalism (walking upright on two legs).',
    metadata: [
      'A - Position of the foramen magnum (underneath the skull, not at the back)',
      'B - S-shaped spine',
      'C - Short, broad (bowl-shaped) pelvis',
      '1 - Allows the head to balance directly on top of an upright spine',
      "2 - Positions the body's centre of gravity over the legs for efficient upright balance",
      '3 - Provides a stable base and better muscle attachment for walking on two legs',
    ],
    answer: ['A-1', 'B-2', 'C-3'],
    presentation: 'match',
    type: 'definition',
    unit: 'diversity_change_and_continuity',
    topic: 'human_evolution',
    subtopic: 'bipedalism_anatomical_adaptations',
    skills: ['match_bipedalism_adaptations'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'life_science',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Think about what each feature does mechanically, one at a time, rather than the three together.\n- Balance of the head, balance of the trunk, and support of the legs are three separate jobs.',
  },
  {
    name: 'Question 4',
    question:
      'A newly discovered fossil skull has its foramen magnum positioned far to the back of the skull, similar to a chimpanzee, rather than underneath. What does this suggest about how this ancient species most likely moved?',
    metadata: [
      'It likely moved primarily on all four limbs (quadrupedal), not upright on two legs',
      'It definitely walked upright on two legs, just like modern humans',
      'It could fly',
      'Foramen magnum position has no connection to how an animal moves',
      '',
    ],
    answer: ['It likely moved primarily on all four limbs (quadrupedal), not upright on two legs', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'diversity_change_and_continuity',
    topic: 'human_evolution',
    subtopic: 'foramen_magnum_position_interpretation',
    skills: ['interpret_foramen_magnum_position'],
    difficulty: 4,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'life_science',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Apply the same underneath-vs-back logic used for the human/ape comparison to this new fossil.\n- A back-positioned opening means the head hangs forward off the front of the spine, not balanced on top of it.',
  },
];

const aiExplanation = {
  sub_questions: [
    {
      number: '3.1.1',
      marks: 2,
      clues: '- Both humans and apes share features related to eye position and how they process visual information.\n- Consider what having eyes on the front of the head, rather than the sides, allows for.',
      approach: '- Recall the vision-related traits typical of primates (humans and apes), rather than of prey animals.\n- Select any two shared characteristics from the list of options.',
      solution: '1. Humans and African apes both have forward-facing eyes, giving binocular (depth) vision.\n2. Both also have colour vision.\n3. Any two correct characteristics should be given.',
    },
      {
      number: '3.1.2',
      marks: 4,
      clues: '- Compare jaw size and how far it projects forward between the two groups.\n- Consider tooth size as a second point of difference.',
      approach: '- Recall at least two specific anatomical differences between human and African ape jaws.\n- State each difference as a clear contrast (human vs. ape), not just a single description.',
      solution: '1. Humans have smaller, less protruding jaws than African apes.\n2. Humans have smaller canine teeth than African apes.\n3. Any two such contrasting pairs should be given.',
    },
    {
      number: '3.1.3',
      marks: 6,
      clues: '- Each of the three features (foramen magnum, spine shape, pelvis shape) plays a distinct mechanical role in upright walking.\n- Explain both WHERE/WHAT the feature is and WHY it helps bipedalism, for each of the three.',
      approach: '- Describe the position of the foramen magnum and explain why this position supports an upright head.\n- Describe the shape of the spine and explain how it helps balance and shock absorption.\n- Describe the shape of the pelvis and explain how it supports the upper body during upright walking.',
      solution: "1. The foramen magnum is positioned further forward (more underneath the skull), allowing the vertebral column to attach in a way that supports the head directly above the spine.\n2. The spine is S-shaped, which helps distribute upper body weight and absorb shock while walking upright.\n3. The pelvis is short and wide, providing a stable base that supports the weight of the upper body during bipedal walking.",
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
