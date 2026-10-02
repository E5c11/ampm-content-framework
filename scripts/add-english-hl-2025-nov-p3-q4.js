#!/usr/bin/env node
/**
 * DBE English HL P3 — November 2025 — Question 2.3: Magazine Article (order 4)
 * Real task: a magazine article titled 'A survival guide for the modern teenager'.
 * Practice set covers article format (headline essential, by-line optional), headlines,
 * hooks, advice-article features, structure and register, on a fresh teen screen-time
 * advice scenario (workflow Appendix "Paper 3 structure", DESIGN-UNI-01). aiExplanation
 * has one entry for real 2.3 (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-english-hl-2025-nov-p3-q4.js --curriculum temp/curriculum-vocab-english.json
 *   node scripts/add-english-hl-2025-nov-p3-q4.js --dry-run
 *   node scripts/add-english-hl-2025-nov-p3-q4.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

const BASE = 'https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_hl/2025/nov_p3/q4';

// ─── Phase 2 — lesson document ───────────────────────────────────────────────

const video = {
  name: 'Question 2.3: Magazine Article',
  syllabus: 'dbe',
  subject: 'english_hl',
  year: 2025,
  paper: 'nov_p3',
  order: 4,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['magazine_article', 'headline', 'magazine_article_structure', 'transactional_writing'],
  question_image_urls: [`${BASE}/question_1.png`, `${BASE}/question_2.png`],
  memo_image_urls: [`${BASE}/memo_1.png`, `${BASE}/memo_2.png`, `${BASE}/memo_3.png`, `${BASE}/memo_4.png`],
  exam_question_marks: 25,
  supplementary_materials: null,
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    xp: 10, syllabus: 'dbe', subject: 'english_hl', year: 2025, paper: 'nov_p3',
    name: 'Question 1',
    order: 1,
    context_text: null,
    question: 'Which statement about the format of a magazine article is CORRECT?',
    metadata: [
      "It must begin with a salutation such as 'Dear readers'.",
      'A headline is essential, while a by-line is optional.',
      "It must end with the writer's address and the date.",
      'It needs a subject line placed above the headline.',
      '',
    ],
    answer: ['A headline is essential, while a by-line is optional.', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'definition',
    unit: 'transactional_writing',
    topic: 'magazine_article',
    subtopic: 'format_elements',
    skills: ['identify_article_format', 'recall_text_conventions'],
    difficulty: 2,
    exam_weight: 3,
    clues: '- Salutations, addresses and subject lines belong to letters and e-mails.\n- Think about what you see at the top of a printed article.',
  },
  {
    xp: 10, syllabus: 'dbe', subject: 'english_hl', year: 2025, paper: 'nov_p3',
    name: 'Question 2',
    order: 2,
    context_text: null,
    question: 'Which headline would BEST suit an advice article for teenagers about managing screen time?',
    metadata: [
      'Screen time: a report on device usage statistics',
      'Phones are bad and you should stop using them now',
      'A short history of the smartphone since 2007',
      'Unplug to recharge: your guide to digital balance',
      '',
    ],
    answer: ['Unplug to recharge: your guide to digital balance', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'transactional_writing',
    topic: 'magazine_article',
    subtopic: 'headline',
    skills: ['evaluate_headline', 'analyse_headline'],
    difficulty: 2,
    exam_weight: 2,
    clues: '- A good headline is catchy, relevant and suits the target readers.\n- Wordplay can attract attention.',
  },
  {
    xp: 10, syllabus: 'dbe', subject: 'english_hl', year: 2025, paper: 'nov_p3',
    name: 'Question 3',
    order: 3,
    context_text: null,
    question: 'Which opening sentence is MOST likely to hook teenage readers?',
    metadata: [
      'This article is about screen time and how to manage it better.',
      'Screen time is a topic that many people talk about these days.',
      "Your phone buzzed four times while you read this, didn't it?",
      'In this article, I will give you several tips about phone usage.',
      '',
    ],
    answer: ["Your phone buzzed four times while you read this, didn't it?", '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'transactional_writing',
    topic: 'magazine_article',
    subtopic: 'introduction_hook',
    skills: ['evaluate_opening_technique'],
    difficulty: 2,
    exam_weight: 2,
    clues: '- Announcing the topic is not the same as grabbing attention.\n- Speaking directly to the reader can draw them in.',
  },
  {
    xp: 10, syllabus: 'dbe', subject: 'english_hl', year: 2025, paper: 'nov_p3',
    name: 'Question 4',
    order: 4,
    context_text: null,
    question: 'Select the THREE features that would make this advice article effective for teenage readers.',
    metadata: [
      'Subheadings that break the advice into clear sections',
      "Direct address, speaking to the reader as 'you'",
      'A formal salutation and a sign-off at the end',
      'Practical tips the reader can try straight away',
      'A reference list in an academic citation style',
    ],
    answer: [
      'Subheadings that break the advice into clear sections',
      "Direct address, speaking to the reader as 'you'",
      'Practical tips the reader can try straight away',
      '',
      '',
    ],
    presentation: 'multi_select',
    type: 'application',
    unit: 'transactional_writing',
    topic: 'magazine_article',
    subtopic: 'article_structure',
    skills: ['identify_article_structure'],
    difficulty: 2,
    exam_weight: 3,
    clues: '- Think about what makes advice easy to read and use.\n- Features from letters or essays do not belong here.',
  },
  {
    xp: 10, syllabus: 'dbe', subject: 'english_hl', year: 2025, paper: 'nov_p3',
    name: 'Question 5',
    order: 5,
    context_text: null,
    question: 'Arrange the parts of the magazine article in the correct order.',
    metadata: [
      'Body with tips under subheadings',
      'Headline that grabs attention',
      'Conclusion with an encouraging message',
      'Introduction that hooks the reader',
      'By-line naming the writer',
    ],
    answer: [
      'Headline that grabs attention',
      'By-line naming the writer',
      'Introduction that hooks the reader',
      'Body with tips under subheadings',
      'Conclusion with an encouraging message',
    ],
    presentation: 'ordering',
    type: 'application',
    unit: 'transactional_writing',
    topic: 'magazine_article',
    subtopic: 'article_format',
    skills: ['sequence_text_elements', 'identify_article_format'],
    difficulty: 1,
    exam_weight: 2,
    clues: '- The writer is credited just under the title.',
  },
  {
    xp: 10, syllabus: 'dbe', subject: 'english_hl', year: 2025, paper: 'nov_p3',
    name: 'Question 6',
    order: 6,
    context_text: "Draft sentence: 'Adolescents are hereby advised to curtail their utilisation of electronic devices forthwith.'",
    question: 'Which revision BEST suits the register of a magazine article for teenagers?',
    metadata: [
      'Teens must reduce their use of electronic devices from now on.',
      'Try leaving your phone in another room for an hour each night.',
      "Yo, ditch ur phone fam, it's totally wrecking ur brain lol.",
      'It is recommended that device usage be limited by all youths.',
      '',
    ],
    answer: ['Try leaving your phone in another room for an hour each night.', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'transactional_writing',
    topic: 'magazine_article',
    subtopic: 'register_and_tone',
    skills: ['evaluate_register'],
    difficulty: 2,
    exam_weight: 2,
    clues: '- Aim for friendly and accessible, but still correct English.\n- Both stiff and slangy extremes miss the mark.',
  },
];

// ─── AI explanation — real exam Question 2.3 (AIEXP-08) ──────────────────────

const aiExplanation = {
  sub_questions: [
    {
      number: '2.3',
      marks: 25,
      clues: '- The title is given, so the article must be a survival guide: practical advice.\n- Think about the pressures that only modern teenagers face.',
      approach: "- Use the given headline 'A survival guide for the modern teenager' (a by-line is optional)\n- Hook the reader in the introduction\n- Give several practical tips (social media, pressure, money, mental health) under clear points or subheadings\n- End with an encouraging conclusion, keeping the body to 180–200 words",
      solution: '1. The memo states that the article should provide advice to the modern teenager.\n2. Format: the headline is essential and the by-line is optional.\n3. A strong article speaks directly to teenage readers in a lively, accessible register and gives specific, realistic advice rather than general comments.\n4. The body should be 180–200 words, with 15 marks for content, planning and format and 10 for language, style and editing.\n5. Articles that only describe teen life without advising, or that use letter features, lose marks.',
    },
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

// ─── Upload ──────────────────────────────────────────────────────────────────

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

// Only run when invoked directly — so validate-questions.js (and anything else) can load
// this file for its data blocks without opening a DB connection or writing anything.
if (require.main === module) {
  upload()
    .catch((err) => {
      console.error('\n❌ Upload failed:', err.message);
      process.exitCode = 1;
    })
    .finally(closePool);
}
