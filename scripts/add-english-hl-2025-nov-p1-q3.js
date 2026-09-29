#!/usr/bin/env node
/**
 * DBE English HL P1 — November 2025 — Question 3: Advertising (order 3)
 * TEXT D (compost flower advert) and TEXT E (fruit/vegetable pun composting adverts).
 * Practice set mirrors the text-extractable sub-questions — exclamation-mark impact (3.1),
 * root word (3.2), technique + example (3.3), pun → standard English (3.4) — with fresh
 * composting/food-waste ad copy as context_text (DESIGN-ENG-01/02). 3.5 compares the two
 * visuals and is skipped for practice; aiExplanation covers all of 3.1–3.5 (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-english-hl-2025-nov-p1-q3.js --curriculum temp/curriculum-vocab-english.json
 *   node scripts/add-english-hl-2025-nov-p1-q3.js --dry-run
 *   node scripts/add-english-hl-2025-nov-p1-q3.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

const BASE = 'https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_hl/2025/nov_p1/q3';

// ─── Phase 2 — lesson document ───────────────────────────────────────────────

const video = {
  name: 'Question 3: Advertising',
  syllabus: 'dbe',
  subject: 'english_hl',
  year: 2025,
  paper: 'nov_p1',
  order: 3,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['advertising', 'advertising_language', 'punctuation'],
  question_image_urls: [`${BASE}/question_1.png`, `${BASE}/question_2.png`],
  memo_image_urls: [`${BASE}/memo_1.png`, `${BASE}/memo_2.png`],
  exam_question_marks: 10,
  supplementary_materials: [
    { type: 'annexure', label: 'Text D', image_urls: [`${BASE}/annexure_text_d_1.png`, `${BASE}/annexure_text_d_2.png`] },
    { type: 'annexure', label: 'Text E', image_urls: [`${BASE}/annexure_text_e_1.png`, `${BASE}/annexure_text_e_2.png`] },
  ],
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    xp: 10, syllabus: 'dbe', subject: 'english_hl', year: 2025, paper: 'nov_p1',
    name: 'Question 1',
    order: 1,
    context_text: "A poster for a neighbourhood food-waste drive shows a bin overflowing with vegetable peels. Beside it, in huge letters, are the words 'SORT IT!'",
    question: "What is the impact of the exclamation mark in 'SORT IT!'?",
    metadata: [
      'It shows that the advertiser is unsure whether readers will respond.',
      'It turns the words into a forceful instruction, urging readers to act at once.',
      'It indicates that the advertisement is asking the reader a question.',
      'It signals that the words are quoted from a satisfied customer.',
      '',
    ],
    answer: ['It turns the words into a forceful instruction, urging readers to act at once.', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'language',
    topic: 'punctuation',
    subtopic: 'punctuation_effect',
    skills: ['identify_punctuation_function', 'explain_effect'],
    difficulty: 2,
    exam_weight: 2,
    clues: '- Consider what kind of sentence SORT IT is: a statement, a question or a command.\n- Think about how the exclamation mark changes the way the words are read.',
  },
  {
    xp: 10, syllabus: 'dbe', subject: 'english_hl', year: 2025, paper: 'nov_p1',
    name: 'Question 2',
    order: 2,
    context_text: 'Swap plastic bags for REUSABLE containers: your compost heap will thank you.',
    question: "Provide the root word of 'REUSABLE'.",
    metadata: ['Root word:', '[ ]'],
    answer: ['use', '', '', '', ''],
    presentation: 'fitb',
    type: 'application',
    unit: 'language',
    topic: 'vocabulary_in_context',
    subtopic: 'root_words',
    skills: ['identify_root_word'],
    difficulty: 2,
    exam_weight: 1,
    clues: '- Remove the prefix at the start of the word.\n- Then remove the suffix at the end.',
  },
  {
    xp: 10, syllabus: 'dbe', subject: 'english_hl', year: 2025, paper: 'nov_p1',
    name: 'Question 3',
    order: 3,
    context_text: 'GROW YOUR OWN GOLD. Why throw away what your garden is begging for? Join the thousands of families already composting. Start your heap today.',
    question: 'The extract is the written text of a composting advertisement. Match each advertising technique to the example from the extract that illustrates it.',
    metadata: [
      'A - Rhetorical question',
      'B - Bandwagon appeal',
      'C - Imperative',
      'D - Metaphor',
      "1 - 'Start your heap today.'",
      "2 - 'GROW YOUR OWN GOLD'",
      "3 - 'Why throw away what your garden is begging for?'",
      "4 - 'Join the thousands of families already composting.'",
    ],
    answer: ['A-3', 'B-4', 'C-1', 'D-2'],
    presentation: 'match',
    type: 'application',
    unit: 'language',
    topic: 'advertising_language',
    subtopic: 'advertising_techniques',
    skills: ['identify_advertising_technique'],
    difficulty: 3,
    exam_weight: 3,
    clues: '- A bandwagon appeal suggests that everyone else is already doing it.\n- A metaphor describes one thing as if it were something else.',
  },
  {
    xp: 10, syllabus: 'dbe', subject: 'english_hl', year: 2025, paper: 'nov_p1',
    name: 'Question 4',
    order: 4,
    context_text: "A composting advertisement shows a pod of bright green peas beneath the slogan 'COMPOST: GIVE PEAS A CHANCE'.",
    question: "Replace the word 'PEAS' with its standard English equivalent.",
    metadata: ['Standard word:', '[ ]'],
    answer: ['peace', '', '', '', ''],
    presentation: 'fitb',
    type: 'application',
    unit: 'language',
    topic: 'vocabulary_in_context',
    subtopic: 'homophone_identification',
    skills: ['transform_informal_to_standard', 'identify_language_technique'],
    difficulty: 2,
    exam_weight: 2,
    clues: '- The slogan is a pun on a well-known phrase.\n- Say the slogan aloud and listen for a word that sounds the same but is spelt differently.',
  },
];

// ─── AI explanation — real exam sub-questions 3.1–3.5 (AIEXP-08) ─────────────

const aiExplanation = {
  sub_questions: [
    {
      number: '3.1',
      marks: 2,
      clues: "- Decide what kind of sentence 'COMPOST!' is.\n- Think about how an exclamation mark changes the force of a single word.",
      approach: "- Recognise that 'COMPOST!' works as a command\n- Explain what the exclamation mark adds to that command\n- Link it to what the advertiser wants the reader to do",
      solution: "1. 'COMPOST!' is a one-word instruction, and the exclamation mark makes it forceful.\n2. Its impact is to compel the reader to take part in recycling: it instructs the reader to compost.\n3. Other valid explanations of its urging effect are credited.",
    },
    {
      number: '3.2',
      marks: 1,
      clues: "- Strip away the prefix and the suffix.\n- What is left is the root.",
      approach: "- Remove the prefix 're-'\n- Remove the suffix '-ing'\n- Write what remains",
      solution: "1. Remove the prefix 're-' (meaning again) and the suffix '-ing'.\n2. The root word is 'cycle'.",
    },
    {
      number: '3.3',
      marks: 3,
      clues: '- Look for puns, imperatives, repetition, a rhetorical question, personal pronouns or a bandwagon appeal.\n- You need a technique, an example and an explanation of its effect.',
      approach: '- Name ONE technique (1 mark)\n- Quote an example from TEXT E (1 mark)\n- Explain how it persuades the reader (1 mark)',
      solution: "1. Any one technique earns the marks: imperatives ('Put your food scraps', 'Look for the green carts') urge the reader to act.\n2. Puns ('APEELING', 'BERRY', 'LETTUCE') engage the reader with humour; repetition ('COMPOST', 'green cart') reinforces how to compost; the bandwagon effect ('everyone's doing it') makes readers want to join in.\n3. Also valid: personal pronouns ('you', 'your') involve the reader; the rhetorical question ('Did you know ...?') invites reflection; different font sizes draw the eye to key words.\n4. An example only earns a mark when it is linked to a technique or a discussion.",
    },
    {
      number: '3.4',
      marks: 1,
      clues: "- Read the slogan aloud: 'LETTUCE DO MORE'.\n- Which common phrase sounds like 'lettuce'?",
      approach: "- Recognise the pun on the vegetable name\n- Replace it with the everyday phrase it sounds like",
      solution: "1. 'LETTUCE' is a pun on a phrase that sounds similar.\n2. The standard English equivalent is 'Let us' (or 'Let's').",
    },
    {
      number: '3.5',
      marks: 3,
      clues: "- Choose either TEXT D or TEXT E and defend your choice.\n- Link the images directly to the advertiser's message about composting.",
      approach: '- Choose one advertisement\n- Describe how its visual image is designed\n- Explain how the image makes the composting message clear and persuasive',
      solution: "1. TEXT D: the single flowerpot of compacted organic matter grows a flower whose petals, leaves and stem spell out the benefits of composting, symbolising its positive results.\n2. OR TEXT E: three clear images (banana, raspberry, lettuce) link closely to the puns in bold font, so the reader connects everyday food scraps with composting.\n3. Mixed or alternative responses are credited; two ideas well justified earn 3 marks.",
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
