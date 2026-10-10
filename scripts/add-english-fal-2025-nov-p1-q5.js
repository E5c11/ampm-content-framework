#!/usr/bin/env node
/**
 * DBE English FAL P1 — November 2025 — Question 5: Language and Editing Skills (order 5)
 * TEXT F: National Parks Week passage with deliberate errors. TEXT G: 'Set your mind free!' poster.
 * Practice mirrors the grammar skills tested (concord, tag question, degrees of comparison, parts of
 * speech, conditional, reported speech, one word for a phrase) on a fresh national-parks theme
 * (LANG-SEC-05, LANG-EX-01/02). aiExplanation covers every real sub-question 5.1.1(a)–5.2.5 with real
 * marks (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video. Every fitb declares keyboard_type 'text' (LANG-KB-01).
 *   node tools/validate-questions.js --script scripts/add-english-fal-2025-nov-p1-q5.js --curriculum temp/curriculum-vocab-english-fal.json
 *   node scripts/add-english-fal-2025-nov-p1-q5.js --dry-run
 *   node scripts/add-english-fal-2025-nov-p1-q5.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

// ─── Phase 2 — lesson document ───────────────────────────────────────────────

const video = {
  "name": "Question 5: Language and Editing Skills",
  "syllabus": "dbe",
  "subject": "english_fal",
  "year": 2025,
  "paper": "nov_p1",
  "order": 5,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "grammar_editing",
    "editing",
    "parts_of_speech",
    "reported_speech"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p1/q5/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p1/q5/question_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p1/q5/question_3.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p1/q5/question_4.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p1/q5/memo_1.png"
  ],
  "exam_question_marks": 20,
  "supplementary_materials": [
    {
      "type": "annexure",
      "label": "Text F",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p1/q5/annexure_text_f_1.png"
      ]
    },
    {
      "type": "annexure",
      "label": "Text G",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p1/q5/annexure_text_g_1.png"
      ]
    }
  ]
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2025,
    "paper": "nov_p1",
    "name": "Question 1",
    "order": 1,
    "context_text": "Each of the rangers are trained to handle emergencies.",
    "question": "Correct the SINGLE concord error in the sentence. Write only the corrected word.",
    "metadata": [
      "Corrected word:",
      "[ ]"
    ],
    "answer": [
      "is",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "application",
    "unit": "language",
    "topic": "concord",
    "subtopic": "subject_verb_concord",
    "skills": [
      "english_fal_correct_concord_error"
    ],
    "difficulty": 2,
    "exam_weight": 3,
    "clues": "- Find the subject of the sentence and decide whether it names one thing or several.\n- Check that the verb agrees with the subject.",
    "keyboard_type": "text"
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2025,
    "paper": "nov_p1",
    "name": "Question 2",
    "order": 2,
    "context_text": "The trail was closed after the storm, ...?",
    "question": "Complete the tag question. Write down only the missing words.",
    "metadata": [
      "Missing words:",
      "[ ]"
    ],
    "answer": [
      "wasn't it|was it not",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "application",
    "unit": "language",
    "topic": "sentence_construction",
    "subtopic": "tag_questions",
    "skills": [
      "english_fal_complete_tag_question"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- A tag question uses the opposite of the main sentence: positive becomes negative.\n- The tag repeats the verb and refers back to the subject with a pronoun.",
    "keyboard_type": "text"
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2025,
    "paper": "nov_p1",
    "name": "Question 3",
    "order": 3,
    "context_text": "This route is (short) than the old one.",
    "question": "Provide the correct degree of comparison of the word in brackets.",
    "metadata": [
      "Correct form:",
      "[ ]"
    ],
    "answer": [
      "shorter",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "application",
    "unit": "language",
    "topic": "parts_of_speech",
    "subtopic": "degrees_of_comparison",
    "skills": [
      "english_fal_use_degrees_of_comparison"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Notice the word 'than': it signals a comparison of two things.\n- For a short adjective, add the ending used for the comparative degree.",
    "keyboard_type": "text"
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2025,
    "paper": "nov_p1",
    "name": "Question 4",
    "order": 4,
    "context_text": "The old guide walked slowly through the gate.",
    "question": "State the part of speech of each word as used in the sentence.",
    "metadata": [
      "A - old",
      "B - slowly",
      "C - through",
      "1 - adverb",
      "2 - preposition",
      "3 - adjective"
    ],
    "answer": [
      "A-3",
      "B-1",
      "C-2",
      "",
      ""
    ],
    "presentation": "match",
    "type": "application",
    "unit": "language",
    "topic": "parts_of_speech",
    "subtopic": "identify_part_of_speech",
    "skills": [
      "english_fal_identify_parts_of_speech"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Ask what each word does: describes a noun, describes a verb, or shows a relationship.\n- A word's function in the sentence decides its part of speech."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2025,
    "paper": "nov_p1",
    "name": "Question 5",
    "order": 5,
    "context_text": "Many tourists visit the reserve in winter.",
    "question": "Choose the correct ending to complete the conditional sentence: 'If the reserve offers cheaper tickets, …'",
    "metadata": [
      "more tourists would visited it.",
      "more tourists will visit it.",
      "more tourists visited it.",
      "more tourists would have visited it.",
      ""
    ],
    "answer": [
      "more tourists will visit it.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "language",
    "topic": "modals_and_conditionals",
    "subtopic": "first_conditional",
    "skills": [
      "english_fal_complete_conditional_sentence"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "clues": "- The 'if' clause is in the simple present, so the possibility is real.\n- Match the main clause to the pattern for a real possibility."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2025,
    "paper": "nov_p1",
    "name": "Question 6",
    "order": 6,
    "context_text": "'We will close the gates at six,' said the ranger.",
    "question": "Which sentence is the correct reported speech of the sentence in the extract?",
    "metadata": [
      "The ranger said that we will close the gates at six.",
      "The ranger said that they will close the gates at six.",
      "The ranger said that they would close the gates at six.",
      "The ranger said that we would close the gates at six.",
      ""
    ],
    "answer": [
      "The ranger said that they would close the gates at six.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "language",
    "topic": "passive_and_reported_speech",
    "subtopic": "reported_statements",
    "skills": [
      "english_fal_change_to_reported_speech"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "clues": "- Reported speech moves the verb one step back in time.\n- Pronouns change to fit the person reporting."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2025,
    "paper": "nov_p1",
    "name": "Question 7",
    "order": 7,
    "context_text": "The park has been open for a period of ten years.",
    "question": "Give ONE word for the phrase 'a period of ten years'.",
    "metadata": [
      "Word:",
      "[ ]"
    ],
    "answer": [
      "decade",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "application",
    "unit": "language",
    "topic": "word_level_vocabulary",
    "subtopic": "one_word_for_phrase",
    "skills": [
      "english_fal_use_one_word_for_phrase"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Think of a word you could use to count years in groups.\n- You need a single word.",
    "keyboard_type": "text"
  }
];

// ─── AI explanation — one entry per REAL exam sub-question, real marks (AIEXP-08) ───

const aiExplanation = {
  "sub_questions": [
    {
      "number": "5.1.1(a)",
      "marks": 1,
      "clues": "- Read the sentence and find a word that is spelled almost like a different word.\n- Think about what the park event offers.",
      "approach": "- Find the word that does not fit the meaning\n- Replace it with the correct word",
      "solution": "1. 'Excess' is the wrong word: the event offers free admission.\n2. The correct word is 'access'."
    },
    {
      "number": "5.1.1(b)",
      "marks": 1,
      "clues": "- Look at the preposition after 'promotion'.\n- Ask which preposition normally follows this noun.",
      "approach": "- Check the word after 'promotion'\n- Replace it with the preposition that fits",
      "solution": "1. 'Promotion for conservation' is incorrect.\n2. The correct preposition is 'of'."
    },
    {
      "number": "5.1.1(c)",
      "marks": 1,
      "clues": "- Find the subject of the sentence and decide if it is singular or plural.\n- Compare it with the verb.",
      "approach": "- Identify the subject: two things joined\n- Decide on the verb form",
      "solution": "1. 'Cultural heritage and biological diversity' is plural.\n2. The verb must be 'are', not 'is'."
    },
    {
      "number": "5.1.1(d)",
      "marks": 1,
      "clues": "- One word in this sentence is misspelled.\n- Check the long word at the end.",
      "approach": "- Find the misspelled word\n- Write it correctly",
      "solution": "1. 'Enviroment' is spelled incorrectly.\n2. The correct spelling is 'environment'."
    },
    {
      "number": "5.1.2",
      "marks": 1,
      "clues": "- Look at the verb and the tense of the main sentence.\n- The tag uses the opposite polarity.",
      "approach": "- Identify the verb 'was'\n- Make the tag negative",
      "solution": "1. The main sentence is positive, so the tag is negative.\n2. The answer is 'wasn't it' (or 'was it not')."
    },
    {
      "number": "5.1.3",
      "marks": 1,
      "clues": "- Look at the word 'than' that follows.\n- Add a degree of comparison for a longer adjective.",
      "approach": "- Recognise a comparison between two times\n- Use 'more' with the adjective",
      "solution": "1. 'Than' signals the comparative degree.\n2. For 'popular' the comparative is 'more popular'."
    },
    {
      "number": "5.1.4",
      "marks": 1,
      "clues": "- Identify the underlined noun.\n- Change its ending for more than one.",
      "approach": "- Identify the noun\n- Apply the rule for words ending in a consonant plus y",
      "solution": "1. 'Community' ends in a consonant plus y.\n2. The plural is 'communities'."
    },
    {
      "number": "5.1.5",
      "marks": 1,
      "clues": "- Find a word with a similar meaning to 'encourage'.\n- It must fit the sentence grammatically.",
      "approach": "- Understand the underlined word\n- Choose a synonym that fits",
      "solution": "1. 'Encourage' means to give support or confidence.\n2. Suitable synonyms are 'motivate', 'inspire' or 'urge'."
    },
    {
      "number": "5.1.6",
      "marks": 2,
      "clues": "- Consider what each underlined word does in the sentence.\n- One describes a noun; the other shows a relationship.",
      "approach": "- Look at 'national' before 'parks'\n- Look at 'to' before the verb phrase\n- State the part of speech for each",
      "solution": "1. 'National' describes 'parks', so it is an adjective.\n2. 'To' links to a place or relationship here: it is a preposition."
    },
    {
      "number": "5.1.7",
      "marks": 1,
      "clues": "- The 'if' clause states a real possibility.\n- Complete it with the likely result.",
      "approach": "- Use the first conditional pattern\n- State a result linked to the sentence before",
      "solution": "1. A first conditional uses a present tense 'if' clause and 'will' in the result.\n2. Example: '…then many adventurers will visit.'"
    },
    {
      "number": "5.1.8",
      "marks": 3,
      "clues": "- Change the pronoun and the verb tense as needed.\n- Do not forget the correct punctuation.",
      "approach": "- Identify the reporting verb\n- Change 'I am' to the third person\n- Check punctuation",
      "solution": "1. The minister says that she is pleased to note the success of National Parks Week.\n2. Or in the past tense: said that she was pleased.\n3. One mark each for the change of pronoun and verb, and one for punctuation."
    },
    {
      "number": "5.2.1",
      "marks": 2,
      "clues": "- You must start with 'Apart from'.\n- Join the two benefits of setting your mind free.",
      "approach": "- Start with 'Apart from' plus an -ing form\n- Keep both ideas\n- Check that the sentence is complete",
      "solution": "1. Example: 'Apart from allowing you to explore new ideas, setting your mind free also helps you overcome self-doubt.'\n2. The other order is also accepted."
    },
    {
      "number": "5.2.2",
      "marks": 1,
      "clues": "- A homonym sounds and is spelled the same but has a different meaning.\n- 'Mind' can be a verb as well as a noun.",
      "approach": "- Think of another meaning of 'mind'\n- Use it correctly in a sentence",
      "solution": "1. In the extract 'mind' means the brain.\n2. As a verb it means to care or be careful, e.g. 'Children must mind their manners.'"
    },
    {
      "number": "5.2.3",
      "marks": 1,
      "clues": "- Think of how birds are described when they fly together.\n- Test each option as a collective noun.",
      "approach": "- Recall collective nouns for animals\n- Match 'birds' with the right one",
      "solution": "1. A group of birds is a flock.\n2. 'Pride' is for lions, and 'crowd' and 'swarm' are for people and insects, so they are wrong."
    },
    {
      "number": "5.2.4",
      "marks": 1,
      "clues": "- Count the weeks in the phrase.\n- Find a single word that means this period.",
      "approach": "- Interpret the phrase\n- Choose the one word that means the same",
      "solution": "1. 'Every two weeks' is a fortnight.\n2. The answer is 'fortnight'."
    },
    {
      "number": "5.2.5",
      "marks": 1,
      "clues": "- The brackets give the base word.\n- The sentence needs an adjective after 'is'.",
      "approach": "- Identify the part of speech needed\n- Form it from the base word",
      "solution": "1. After 'is' we need an adjective.\n2. The adjective from 'benefit' is 'beneficial'."
    }
  ],
  "model": "claude-sonnet-5-5",
  "generated_at": Date.now(),
  "version": 2,
  "reviewed": false,
  "input_tokens": 0,
  "output_tokens": 0,
  "avg_rating": null,
  "rating_count": null
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
