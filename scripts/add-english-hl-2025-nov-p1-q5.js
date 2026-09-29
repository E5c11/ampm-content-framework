#!/usr/bin/env node
/**
 * DBE English HL P1 — November 2025 — Question 5: Language (order 5)
 * TEXT G: 'The Parent Lottery' (humorous column about three very different children), with
 * deliberate errors. Practice set (7, DESIGN-ENG-05 cap) mirrors 5.1 antonym, 5.2 part of
 * speech, 5.4 indirect → direct speech, 5.5 tense error, 5.6 subordinate clause, 5.7 comma
 * splice, 5.9 homophone, each with its own fresh family-life context_text. 5.3 and 5.8 are
 * not practised (cap); aiExplanation covers all of 5.1–5.9 (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-english-hl-2025-nov-p1-q5.js --curriculum temp/curriculum-vocab-english.json
 *   node scripts/add-english-hl-2025-nov-p1-q5.js --dry-run
 *   node scripts/add-english-hl-2025-nov-p1-q5.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

const BASE = 'https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_hl/2025/nov_p1/q5';

// ─── Phase 2 — lesson document ───────────────────────────────────────────────

const video = {
  name: 'Question 5: Language',
  syllabus: 'dbe',
  subject: 'english_hl',
  year: 2025,
  paper: 'nov_p1',
  order: 5,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['language', 'parts_of_speech', 'punctuation', 'tense', 'homophones'],
  question_image_urls: [`${BASE}/question_1.png`, `${BASE}/question_2.png`],
  memo_image_urls: [`${BASE}/memo_1.png`],
  exam_question_marks: 10,
  supplementary_materials: [
    { type: 'annexure', label: 'Text G', image_urls: [`${BASE}/annexure_text_g_1.png`] },
  ],
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    xp: 10, syllabus: 'dbe', subject: 'english_hl', year: 2025, paper: 'nov_p1',
    name: 'Question 1',
    order: 1,
    context_text: 'Our eldest is remarkably CAUTIOUS: she tests every step of the staircase before trusting her weight to it.',
    question: "Provide a suitable antonym for 'CAUTIOUS', in context.",
    metadata: ['Antonym:', '[ ]'],
    answer: ['reckless|careless|rash|daring|bold|impulsive|incautious|fearless|heedless|carefree', '', '', '', ''],
    presentation: 'fitb',
    type: 'application',
    unit: 'language',
    topic: 'vocabulary_in_context',
    subtopic: 'antonyms',
    skills: ['identify_antonym'],
    difficulty: 2,
    exam_weight: 2,
    clues: '- An antonym means the opposite.\n- Think of a word for someone who takes risks without thinking.',
  },
  {
    xp: 10, syllabus: 'dbe', subject: 'english_hl', year: 2025, paper: 'nov_p1',
    name: 'Question 2',
    order: 2,
    context_text: 'The moment she heard the ice-cream van, our toddler ran FAST down the passage.',
    question: "Identify the part of speech of 'FAST' as it is used in the extract.",
    metadata: ['adjective', 'noun', 'adverb', 'preposition', ''],
    answer: ['adverb', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'language',
    topic: 'parts_of_speech',
    subtopic: 'adjective_adverb_distinction',
    skills: ['identify_part_of_speech'],
    difficulty: 3,
    exam_weight: 2,
    clues: "- Ask which word 'FAST' tells you more about in this sentence.\n- Not every word of this type ends in -ly.",
  },
  {
    xp: 10, syllabus: 'dbe', subject: 'english_hl', year: 2025, paper: 'nov_p1',
    name: 'Question 3',
    order: 3,
    context_text: 'The babysitter said that the twins had refused to sleep and that she would never look after them again.',
    question: 'Which option correctly rewrites the sentence in direct speech?',
    metadata: [
      "The babysitter said, 'The twins had refused to sleep and she would never look after them again.'",
      "The babysitter said, 'The twins have refused to sleep and she will never look after them again.'",
      "The babysitter said that, 'The twins have refused to sleep and I will never look after them again.'",
      "The babysitter said, 'The twins have refused to sleep and I will never look after them again!'",
      '',
    ],
    answer: ["The babysitter said, 'The twins have refused to sleep and I will never look after them again!'", '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'language',
    topic: 'direct_and_indirect_speech',
    subtopic: 'reported_speech_rules',
    skills: ['apply_tense_changes', 'apply_pronoun_changes'],
    difficulty: 4,
    exam_weight: 3,
    clues: '- In direct speech, the speaker refers to herself in the first person.\n- Move each verb one step forward in time, and drop the word that introduces reported speech.',
  },
  {
    xp: 10, syllabus: 'dbe', subject: 'english_hl', year: 2025, paper: 'nov_p1',
    name: 'Question 4',
    order: 4,
    context_text: 'Last Sunday, our son climbed onto the garage roof to fetch his ball, and ten minutes later the fire brigade arrives to bring him down.',
    question: 'Correct the error of tense in the extract. Write only the corrected word.',
    metadata: ['Corrected word:', '[ ]'],
    answer: ['arrived', '', '', '', ''],
    presentation: 'fitb',
    type: 'application',
    unit: 'language',
    topic: 'tense_changes',
    subtopic: 'subject_verb_agreement_tense',
    skills: ['identify_tense_error', 'apply_tense_rule'],
    difficulty: 2,
    exam_weight: 3,
    clues: "- 'Last Sunday' tells you when the events happened.\n- Find the verb that does not match the time frame of the others.",
  },
  {
    xp: 10, syllabus: 'dbe', subject: 'english_hl', year: 2025, paper: 'nov_p1',
    name: 'Question 5',
    order: 5,
    context_text: 'Although she is only four, our youngest already negotiates bedtime like a seasoned lawyer.',
    question: 'Which option is the subordinate clause in the sentence?',
    metadata: [
      'Although she is only four',
      'our youngest already negotiates bedtime',
      'like a seasoned lawyer',
      'our youngest already negotiates bedtime like a seasoned lawyer',
      '',
    ],
    answer: ['Although she is only four', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'language',
    topic: 'sentence_construction',
    subtopic: 'clause_identification',
    skills: ['identify_subordinate_clause'],
    difficulty: 3,
    exam_weight: 2,
    clues: '- A subordinate clause has a verb but cannot stand alone as a sentence.\n- Look for a group of words introduced by a subordinating conjunction.',
  },
  {
    xp: 10, syllabus: 'dbe', subject: 'english_hl', year: 2025, paper: 'nov_p1',
    name: 'Question 6',
    order: 6,
    context_text: 'I did not teach him to argue about everything, he was simply born that way.',
    question: 'The sentence contains a comma splice. Select ALL the punctuation marks that could correctly replace the comma.',
    metadata: ['A semicolon (;)', "An apostrophe (')", 'A full stop (.)', 'A dash (–)', 'A hyphen (-)'],
    answer: ['A semicolon (;)', 'A full stop (.)', 'A dash (–)', '', ''],
    presentation: 'multi_select',
    type: 'application',
    unit: 'language',
    topic: 'punctuation',
    subtopic: 'comma_splice_correction',
    skills: ['identify_grammar_error', 'identify_punctuation_function'],
    difficulty: 3,
    exam_weight: 2,
    clues: '- A comma splice joins two complete sentences with only a comma.\n- Choose marks that can separate two independent clauses.',
  },
  {
    xp: 10, syllabus: 'dbe', subject: 'english_hl', year: 2025, paper: 'nov_p1',
    name: 'Question 7',
    order: 7,
    context_text: 'When the toddler saw the broccoli on her plate, she through her spoon across the kitchen.',
    question: 'Replace the word used incorrectly in the extract with its correct homophone.',
    metadata: ['Correct word:', '[ ]'],
    answer: ['threw', '', '', '', ''],
    presentation: 'fitb',
    type: 'application',
    unit: 'language',
    topic: 'vocabulary_in_context',
    subtopic: 'homophone_identification',
    skills: ['use_context_clues'],
    difficulty: 2,
    exam_weight: 2,
    clues: '- Homophones sound the same but have different spellings and meanings.\n- Find the word that should be the past tense of a verb.',
  },
];

// ─── AI explanation — real exam sub-questions 5.1–5.9 (AIEXP-08) ─────────────

const aiExplanation = {
  sub_questions: [
    {
      number: '5.1',
      marks: 1,
      clues: "- The writer is contrasting how different three children are.\n- Find a word meaning the opposite that fits the sentence.",
      approach: "- Read line 2 to understand how 'different' is used\n- Think of its opposite in this context\n- Check that your word fits the sentence",
      solution: "1. In context, 'different' describes children who are unlike each other.\n2. A suitable antonym is 'similar', 'alike' or 'identical'. Other valid words that fit the context are credited.",
    },
    {
      number: '5.2',
      marks: 1,
      clues: "- Ask which word 'grandly' describes.\n- Notice its ending.",
      approach: "- Find what 'grandly' tells you more about in line 3\n- Name the part of speech",
      solution: "1. 'Grandly' describes how the week 'started': it modifies a verb.\n2. It is therefore an adverb.",
    },
    {
      number: '5.3',
      marks: 1,
      clues: '- The second sentence describes the grandfather.\n- A relative pronoun can join the two sentences.',
      approach: "- Identify the noun the second sentence refers to (the cardiologist)\n- Replace 'He' with a suitable relative pronoun\n- Combine into one complex sentence",
      solution: "1. The second sentence adds information about the grandfather, so it can become a relative clause.\n2. The complex sentence is: I messaged a photo of the crater in her head to her grandfather, the cardiologist who usually sews me up when I do stupid stuff.",
    },
    {
      number: '5.4',
      marks: 2,
      clues: '- Direct speech uses the actual words spoken, in quotation marks.\n- Move the verbs one step forward in time and change the pronoun for the speaker.',
      approach: "- Begin with: Grandpa said,\n- Change 'needed' to 'needs' (1 mark)\n- Change 'he wasn't' to 'I am not' (1 mark)\n- Add quotation marks and punctuation",
      solution: "1. Grandpa said, 'She needs stitches and I am not doing it!'\n2. 'She needs stitches. I am not doing it!' or 'You need stitches and I am not doing it!' are also accepted.\n3. 1 mark for the tense change ('needs') and 1 mark for 'I am not'.",
    },
    {
      number: '5.5',
      marks: 1,
      clues: '- The rest of the paragraph is in the past tense.\n- Find the verb in lines 7-9 that is in the present tense.',
      approach: '- Identify the tense of the surrounding verbs\n- Find the verb that does not match\n- Give its past tense form',
      solution: "1. The surrounding verbs ('endured', 'denounced') are in the past tense.\n2. 'find' is in the present tense and must change: find becomes found.",
    },
    {
      number: '5.6',
      marks: 1,
      clues: '- A subordinate clause contains a verb but cannot stand alone.\n- Look for the clause introduced by a conjunction.',
      approach: '- Split the sentence into its clauses\n- Identify which clause depends on the other\n- Match it to the options',
      solution: "1. The correct answer is B: 'that she's inherited my penchant for the dramatic.'\n2. It begins with 'that', has its own verb ('has inherited') and cannot stand alone.\n3. A is the main clause without its complement; C is a phrase with no verb; D is the main clause plus a phrase.",
    },
    {
      number: '5.7',
      marks: 1,
      clues: '- The comma joins two complete sentences, which is a comma splice.\n- Choose a mark that can separate two independent clauses.',
      approach: '- Recognise the two independent clauses\n- Replace the comma with a suitable mark',
      solution: "1. The comma joins two independent clauses.\n2. Replace it with a semicolon (drama queen; she just is), a colon, a dash, an ellipsis, or a full stop or exclamation mark with a capital 'She'.",
    },
    {
      number: '5.8',
      marks: 1,
      clues: "- 'Modus operandi' is not an English phrase.\n- Italics are used for words borrowed from other languages.",
      approach: '- Identify the origin of the phrase\n- State the convention for italics',
      solution: "1. 'Modus operandi' is a Latin phrase (meaning a way of operating).\n2. It is in italics because it comes from a foreign language.",
    },
    {
      number: '5.9',
      marks: 1,
      clues: '- Homophones sound the same but are spelt differently.\n- Look at the word describing how Mackers moves beyond the extremes.',
      approach: '- Find the word used incorrectly in the last sentence\n- Replace it with its correctly spelt homophone',
      solution: "1. 'Passed' is the past tense of the verb 'pass', which is wrong here.\n2. The correct homophone is 'past' (navigate past the extremes).",
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
