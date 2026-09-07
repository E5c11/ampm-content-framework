#!/usr/bin/env node
/**
 * DBE Geography P2 — November 2025 — Question 2.3 (order 8)
 * Food security and farming scale: concept application, large- vs small-scale farming
 * comparison, challenges facing small-scale farmers and their consequences. 2.3.5's real
 * exam sub-question is an 8-mark extended paragraph — reframed per the subject profile.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-geography-2025-nov-p2-q2-3.js --curriculum temp/curriculum-vocab.json
 *   node scripts/add-geography-2025-nov-p2-q2-3.js --dry-run
 *   node scripts/add-geography-2025-nov-p2-q2-3.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

const IMG = 'https://media-dev.askmoreprepmore.app/exam_papers/dbe/geography/2025/nov_p2';

const video = {
  name: 'Question 2.3',
  syllabus: 'dbe',
  subject: 'geography',
  year: 2025,
  paper: 'nov_p2',
  order: 8,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['food_security', 'agriculture'],
  question_image_urls: [`${IMG}/q8/question_1.png`, `${IMG}/q8/question_2.png`],
  memo_image_urls: [`${IMG}/q8/memo_1.png`, `${IMG}/q8/memo_2.png`],
  exam_question_marks: 15,
  supplementary_materials: [],
};

const questions = [
  {
    name: 'Question 1',
    question: "A small-scale farmer's crop fails due to a severe drought, and they can no longer grow enough food to feed their family. What have they experienced?",
    metadata: ['Food security', 'Food insecurity', 'Food surplus', 'Food sovereignty', ''],
    answer: ['Food insecurity', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'economic_geography_sa',
    topic: 'agriculture',
    subtopic: 'food_security_and_farming_scale',
    skills: ['food_security_concepts'],
    difficulty: 2,
    exam_weight: 1,
    xp: 10,
    order: 1,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Food insecurity means not having reliable access to enough nutritious food.\n- A failed harvest that leaves a family without enough food is the opposite of food security.',
  },
  {
    name: 'Question 2',
    question: 'Match each farming characteristic to the type of farming it best describes.',
    metadata: [
      'A - Large-scale farming',
      'B - Small-scale farming',
      'C - Both types',
      '1 - Uses heavy machinery and covers extensive land area',
      '2 - Relies mainly on manual labour and serves household or local needs',
      "3 - Contributes to South Africa's overall food security",
    ],
    answer: ['A-1', 'B-2', 'C-3'],
    presentation: 'match',
    type: 'application',
    unit: 'economic_geography_sa',
    topic: 'agriculture',
    subtopic: 'food_security_and_farming_scale',
    skills: ['farming_scale_comparison'],
    difficulty: 2,
    exam_weight: 1,
    xp: 10,
    order: 2,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Scale (machinery, land area) distinguishes large from small farming.\n- Both scales still play a genuine role in national food security, just at different levels.',
  },
  {
    name: 'Question 3',
    question: "Select the challenges that would most likely limit a small-scale farmer's ability to increase food production.",
    metadata: [
      'Limited access to finance/credit for equipment',
      'Limited access to farming technology',
      'Too much available arable land',
      'Excess access to capital',
      '',
    ],
    answer: ['Limited access to finance/credit for equipment', 'Limited access to farming technology', '', '', ''],
    presentation: 'multi_select',
    type: 'application',
    unit: 'economic_geography_sa',
    topic: 'agriculture',
    subtopic: 'food_security_and_farming_scale',
    skills: ['small_scale_farming_challenges'],
    difficulty: 2,
    exam_weight: 1,
    xp: 10,
    order: 3,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Real constraints limit what a farmer can do — an abundance of land or capital would not be a challenge.\n- Small-scale farmers typically struggle with access to finance and modern technology.',
  },
  {
    name: 'Question 4',
    question: 'A small-scale farmer has very limited access to finance and cannot afford modern equipment. What is the most likely long-term impact on their food production?',
    metadata: [
      'Immediate large-scale expansion of their farm',
      'Lower crop yields due to reliance on manual, less efficient labour',
      'No impact, since finance does not affect farming output',
      'Automatic government takeover of the farm',
      '',
    ],
    answer: ['Lower crop yields due to reliance on manual, less efficient labour', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'economic_geography_sa',
    topic: 'agriculture',
    subtopic: 'food_security_and_farming_scale',
    skills: ['farming_challenge_consequences'],
    difficulty: 3,
    exam_weight: 2,
    xp: 10,
    order: 4,
    syllabus: 'dbe',
    subject: 'geography',
    year: 2025,
    paper: 'nov_p2',
    clues: '- Without finance, a farmer cannot buy machinery and must rely on manual labour.\n- Manual labour is slower and less efficient, which reduces overall yield.',
  },
];

const aiExplanation = {
  sub_questions: [
    {
      number: '2.3.1',
      marks: 2,
      clues: '- This asks for the general concept, not an example.',
      approach: '- Recall the definition of food insecurity.',
      solution: '1. Food insecurity is the condition of not having access to sufficient nutritious food.\n2. Answer: the condition of not having access to sufficient nutritious food',
    },
    {
      number: '2.3.2',
      marks: 1,
      clues: '- Read the figure directly from the extract.',
      approach: '- Locate the stated percentage of households facing food insecurity in 2024.',
      solution: '1. The extract states 25,8% of households faced moderate to severe food insecurity in 2024.\n2. Answer: 25,8%',
    },
    {
      number: '2.3.3',
      marks: 2,
      clues: '- Look for visual signs of scale and technology in the large-scale farming photograph.',
      approach: '- Identify a visual feature in the photograph that suggests high productivity.',
      solution: '1. The photograph shows large tracts of cultivated land and the use of machinery/technology.\n2. Answer: any one — e.g. large cultivated area, machinery/tractor use, scientific methods',
    },
    {
      number: '2.3.4',
      marks: 2,
      clues: '- Read the bar graph and compare the small-scale vs large-scale percentages for each challenge.',
      approach: '- Identify which challenges show a notably higher percentage for small-scale farmers.',
      solution: '1. The graph shows small-scale farmers facing greater relative challenges in access to farming equipment/technology, finance, and arable land.\n2. Answer: any two — e.g. access to farming equipment/technology, access to finance, access to arable land',
    },
    {
      number: '2.3.5',
      marks: 8,
      clues: "- Trace each challenge identified in 2.3.4 through to its effect on food production.",
      approach: '- Explain the causal chain from a limiting factor (e.g. lack of equipment) to reduced food output.',
      solution: '1. Lack of machinery/technology reduces efficiency and the area that can be cultivated.\n2. Limited finance prevents farmers from buying seeds, equipment or hiring labour.\n3. Limited arable land restricts how much can be produced and limits crop diversity.\n4. Any four well-explained impacts, linked to the challenges identified, are accepted.',
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
