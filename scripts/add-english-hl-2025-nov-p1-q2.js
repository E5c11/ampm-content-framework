#!/usr/bin/env node
/**
 * DBE English HL P1 — November 2025 — Question 2: Summary (order 2)
 * TEXT C: why sporting events excite fans; task = 7 points / 90 words on the factors that
 * turn people into sport fanatics. Practice set tests the summary sub-skills (main vs
 * supporting, own-words paraphrase, selecting relevant points, cutting redundancy) on fresh
 * sport-fandom stimulus (DESIGN-ENG-01, workflow Appendix "Q2 Summary"). aiExplanation has
 * one entry for the real question, which has no numbered sub-parts (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-english-hl-2025-nov-p1-q2.js --curriculum temp/curriculum-vocab-english.json
 *   node scripts/add-english-hl-2025-nov-p1-q2.js --dry-run
 *   node scripts/add-english-hl-2025-nov-p1-q2.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

const BASE = 'https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_hl/2025/nov_p1/q2';

// ─── Phase 2 — lesson document ───────────────────────────────────────────────

const video = {
  name: 'Question 2: Summary',
  syllabus: 'dbe',
  subject: 'english_hl',
  year: 2025,
  paper: 'nov_p1',
  order: 2,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['summary', 'main_points', 'paraphrasing'],
  question_image_urls: [`${BASE}/question_1.png`],
  memo_image_urls: [`${BASE}/memo_1.png`, `${BASE}/memo_2.png`],
  exam_question_marks: 10,
  supplementary_materials: [
    { type: 'annexure', label: 'Text C', image_urls: [`${BASE}/annexure_text_c_1.png`] },
  ],
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    xp: 10, syllabus: 'dbe', subject: 'english_hl', year: 2025, paper: 'nov_p1',
    name: 'Question 1',
    order: 1,
    context_text: 'Derby week turns ordinary supporters into devoted fans. For days beforehand, radio hosts replay classic clashes, shops fill their windows with club scarves, and friends trade predictions over lunch. All of this builds a rising sense of anticipation long before kick-off.',
    question: 'Which sentence BEST expresses the main point of the extract?',
    metadata: [
      'Radio hosts replay matches from previous seasons.',
      'Shops sell more club scarves before important games.',
      "The build-up before a big match heightens fans' excitement.",
      'Friends often disagree about who will win a derby.',
      '',
    ],
    answer: ["The build-up before a big match heightens fans' excitement.", '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'summary',
    topic: 'main_points_identification',
    subtopic: 'distinguishing_main_from_supporting',
    skills: ['distinguish_main_from_supporting', 'identify_main_point'],
    difficulty: 2,
    exam_weight: 3,
    clues: '- Examples and details usually support a bigger idea.\n- Look for the option that covers all the details, not just one of them.',
  },
  {
    xp: 10, syllabus: 'dbe', subject: 'english_hl', year: 2025, paper: 'nov_p1',
    name: 'Question 2',
    order: 2,
    context_text: null,
    question: 'Match each sentence from a passage about sports fans to the summary point that expresses it BEST in your own words.',
    metadata: [
      "A - 'Supporters who see the club as part of who they are feel its victories as personal triumphs.'",
      "B - 'Replays, close-ups and dramatic commentary turn an ordinary tackle into a moment of theatre.'",
      "C - 'Watching together in a packed tavern makes strangers feel like old friends.'",
      '1 - Shared viewing builds a sense of community.',
      '2 - Fans who identify with a team experience its success emotionally.',
      '3 - Broadcasting techniques make the game feel dramatic.',
    ],
    answer: ['A-2', 'B-3', 'C-1'],
    presentation: 'match',
    type: 'application',
    unit: 'summary',
    topic: 'paraphrase',
    subtopic: 'selecting_best_paraphrase',
    skills: ['paraphrase_accurately', 'identify_best_paraphrase'],
    difficulty: 2,
    exam_weight: 3,
    clues: '- Find the key idea in each quoted sentence before reading the points.\n- A good paraphrase keeps the meaning but uses different words.',
  },
  {
    xp: 10, syllabus: 'dbe', subject: 'english_hl', year: 2025, paper: 'nov_p1',
    name: 'Question 3',
    order: 3,
    context_text: null,
    question: 'You are summarising the reasons why people become passionate sports fans. Select the THREE sentences that contain valid points for this summary.',
    metadata: [
      'Rivalries between old opponents give every match a story worth following.',
      'The first official football match was played in the nineteenth century.',
      'Singing and chanting in the stands make fans feel part of something bigger.',
      'Stadium ticket prices have risen sharply over the past decade.',
      'Following a team gives many people a sense of identity and belonging.',
    ],
    answer: [
      'Rivalries between old opponents give every match a story worth following.',
      'Singing and chanting in the stands make fans feel part of something bigger.',
      'Following a team gives many people a sense of identity and belonging.',
      '',
      '',
    ],
    presentation: 'multi_select',
    type: 'application',
    unit: 'summary',
    topic: 'main_points_identification',
    subtopic: 'select_main_points',
    skills: ['identify_main_points'],
    difficulty: 3,
    exam_weight: 3,
    clues: '- Keep the summary topic in mind: reasons people become passionate fans.\n- Historical facts and costs may be true but do not answer the topic.',
  },
  {
    xp: 10, syllabus: 'dbe', subject: 'english_hl', year: 2025, paper: 'nov_p1',
    name: 'Question 4',
    order: 4,
    context_text: 'The final whistle brought the excited supporters to their feet, and they cheered loudly and noisily until the players had left the field.',
    question: 'Which phrase is REDUNDANT and should be removed to make the sentence more concise?',
    metadata: ['to their feet', 'and noisily', 'the final whistle', 'until the players had left the field', ''],
    answer: ['and noisily', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'summary',
    topic: 'editing',
    subtopic: 'identifying_redundancy',
    skills: ['identify_redundancy', 'concise_writing'],
    difficulty: 2,
    exam_weight: 2,
    clues: '- Redundant words repeat an idea that has already been expressed.\n- Look for two words next to each other that mean the same thing.',
  },
];

// ─── AI explanation — real exam Question 2 (no numbered sub-parts, AIEXP-08) ─

const aiExplanation = {
  sub_questions: [
    {
      number: '2',
      marks: 10,
      clues: '- The focus is the factors that turn people into sport fanatics, so skip the opening question and the general closing line.\n- Each paragraph of TEXT C contains at least one factor.',
      approach: '- Underline one factor per idea in TEXT C (advertising, anticipation, loyalty, belonging, storytelling, broadcasting, structure, community)\n- Rewrite each factor in your own words as a short point\n- Join SEVEN points into one fluent paragraph\n- Check the word count stays at or below 90 and write it at the end',
      solution: "1. Valid points include: sport stirs a range of emotions no other entertainment matches; media promotions build excitement and draw fans in; waiting for the game builds anticipation that makes the event more rewarding.\n2. Further points: loyalty to and identification with a team brings fulfilment; watching games forms emotional bonds and a sense of belonging; games are presented as dramatic stories such as underdogs and rivalries.\n3. Also valid: broadcasters use film techniques such as slow motion and replays to make clashes thrilling; the drama-like structure lets fans feel part of the story; sport creates social interaction and community; fans share their emotions after wins and losses.\n4. Any 7 valid points earn 7 marks (1 each), and language earns up to 3 marks: 6-7 points in your own words earns all 3 language marks.\n5. Quoting the text word for word loses language marks (6-7 quotations earn no language mark), and anything after the 90-word limit is ignored.",
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
