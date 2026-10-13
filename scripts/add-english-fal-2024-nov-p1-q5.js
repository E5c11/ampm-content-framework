#!/usr/bin/env node
/**
 * DBE English FAL P1 — November 2024 — Question 5: Language and Editing Skills (order 5) — TEXT F braai passage with errors; TEXT G Google poster. Practice mirrors the grammar skills on fresh sentences (LANG-SEC-05).
 * Practice questions are fresh (DESIGN-UNI-01) and follow the shared rules: context_text null for literature (SETWORK-LES-05),
 * fresh targets, conventions-based for writing (LANG-WR-03); aiExplanation is one entry per REAL printed sub-question with its
 * real marks, derived from the memo in own words (AIEXP-08). Every fitb declares keyboard_type 'text' (LANG-KB-01).
 * Text key: none (language / writing paper).
 *
 * BASIS per practice question — BK book knowledge (verify against the text), P printed in the paper/poem, M memo,
 * PT vocabulary/title, C CAPS, P1 language-paper skill:
 *   Q1: P1: contraction error
 *   Q2: P1: spelling
 *   Q3: P1: reported speech
 *   Q4: P1: negative form
 *   Q5: P1: word formation
 *   Q6: P1: parts of speech
 *   Q7: P1: tag question
 *
 *   node tools/validate-questions.js --script scripts/add-english-fal-2024-nov-p1-q5.js --curriculum temp/curriculum-vocab-english-fal.json
 *   node scripts/add-english-fal-2024-nov-p1-q5.js --dry-run
 *   node scripts/add-english-fal-2024-nov-p1-q5.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

// ─── Lesson document ─────────────────────────────────────────────────────────

const video = {
  "name": "Question 5: Language and Editing Skills",
  "syllabus": "dbe",
  "subject": "english_fal",
  "year": 2024,
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
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p1/q5/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p1/q5/question_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p1/q5/question_3.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p1/q5/memo_1.png"
  ],
  "exam_question_marks": 20,
  "supplementary_materials": [
    {
      "type": "annexure",
      "label": "Text F",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p1/q5/annexure_text_f_1.png"
      ]
    },
    {
      "type": "annexure",
      "label": "Text G",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p1/q5/annexure_text_g_1.png"
      ]
    }
  ]
};

// ─── Practice questions ──────────────────────────────────────────────────────

const questions = [
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2024,
    "paper": "nov_p1",
    "name": "Question 1",
    "order": 1,
    "context_text": "Their going to the match tonight.",
    "question": "Correct the SINGLE error in the sentence. Write only the corrected word.",
    "metadata": [
      "Corrected word:",
      "[ ]"
    ],
    "answer": [
      "They're",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "definition",
    "unit": "language",
    "topic": "punctuation_and_spelling",
    "subtopic": "contractions_and_homophones",
    "skills": [
      "english_fal_correct_spelling_error"
    ],
    "difficulty": 2,
    "exam_weight": 3,
    "clues": "- Say the sentence aloud: which two words are being joined?\n- The word shown is a different word that sounds the same.",
    "keyboard_type": "text"
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2024,
    "paper": "nov_p1",
    "name": "Question 2",
    "order": 2,
    "context_text": "The new restaurent on Main Road was full on Saturday.",
    "question": "Correct the SINGLE spelling error in the sentence. Write only the corrected word.",
    "metadata": [
      "Corrected word:",
      "[ ]"
    ],
    "answer": [
      "restaurant",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "definition",
    "unit": "language",
    "topic": "punctuation_and_spelling",
    "subtopic": "spelling",
    "skills": [
      "english_fal_correct_spelling_error"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- The word is a place where meals are served.\n- Check each letter after the 'a'.",
    "keyboard_type": "text"
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2024,
    "paper": "nov_p1",
    "name": "Question 3",
    "order": 3,
    "context_text": "Thabo said, 'I will call you tomorrow.'",
    "question": "Which sentence is the correct reported speech of the sentence in the extract?",
    "metadata": [
      "Thabo said that he will call me tomorrow.",
      "Thabo said that he would call me the next day.",
      "Thabo said that I would call him the next day.",
      "Thabo said, that he would call me tomorrow.",
      ""
    ],
    "answer": [
      "Thabo said that he would call me the next day.",
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
    "clues": "- Reported speech moves the verb one step back in time.\n- Pronouns and time words change."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2024,
    "paper": "nov_p1",
    "name": "Question 4",
    "order": 4,
    "context_text": "The shop opens on Sundays.",
    "question": "Which sentence is the negative form of the sentence in the extract?",
    "metadata": [
      "The shop opens not on Sundays.",
      "The shop no opens on Sundays.",
      "The shop does not open on Sundays.",
      "The shop did not open on Sundays.",
      ""
    ],
    "answer": [
      "The shop does not open on Sundays.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "language",
    "topic": "sentence_construction",
    "subtopic": "negative_form",
    "skills": [
      "english_fal_rewrite_in_negative_form"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Use 'do' or 'does' with 'not' in the simple present.\n- Keep the same tense."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2024,
    "paper": "nov_p1",
    "name": "Question 5",
    "order": 5,
    "context_text": "Choosing a career was a difficult (decide) for her.",
    "question": "Give the correct form of the word in brackets in the sentence.",
    "metadata": [
      "Correct form:",
      "[ ]"
    ],
    "answer": [
      "decision",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "definition",
    "unit": "language",
    "topic": "word_level_vocabulary",
    "subtopic": "word_formation",
    "skills": [
      "english_fal_use_word_formation"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- The sentence needs a noun.\n- Add the ending that turns the verb into a noun.",
    "keyboard_type": "text"
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2024,
    "paper": "nov_p1",
    "name": "Question 6",
    "order": 6,
    "context_text": "The beautiful bird flew quickly under the bridge.",
    "question": "State the part of speech of each word as used in the sentence.",
    "metadata": [
      "A - quickly",
      "B - beautiful",
      "C - under",
      "1 - adjective",
      "2 - preposition",
      "3 - adverb"
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
    "clues": "- Ask what each word does: describes a verb, describes a noun, or shows a relationship.\n- Function decides the part of speech."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2024,
    "paper": "nov_p1",
    "name": "Question 7",
    "order": 7,
    "context_text": "The match was cancelled, ...?",
    "question": "Complete the tag question.",
    "metadata": [
      "wasn't it",
      "didn't it",
      "isn't it",
      "weren't it",
      ""
    ],
    "answer": [
      "wasn't it",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "language",
    "topic": "sentence_construction",
    "subtopic": "tag_questions",
    "skills": [
      "english_fal_complete_tag_question"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Use the opposite polarity to the main sentence.\n- Repeat the verb 'was'."
  }
];

// ─── AI explanation — one entry per REAL printed sub-question, real marks (AIEXP-08) ───

const aiExplanation = {
  "sub_questions": [
    {
      "number": "5.1.1(a)",
      "marks": 1,
      "clues": "- Look at the first word and ask whether it should be a contraction.",
      "approach": "- Spot the error\n- Correct it",
      "solution": "1. 'Its' should be 'It's' (it is)."
    },
    {
      "number": "5.1.1(b)",
      "marks": 1,
      "clues": "- Check the word after 'flavour'.",
      "approach": "- Find the wrong preposition",
      "solution": "1. 'A flavour in chips' is wrong: the correct preposition is 'of' (a flavour of chips)."
    },
    {
      "number": "5.1.1(c)",
      "marks": 1,
      "clues": "- One word is misspelt.",
      "approach": "- Find it\n- Spell it correctly",
      "solution": "1. 'essense' should be 'essence'."
    },
    {
      "number": "5.1.1(d)",
      "marks": 1,
      "clues": "- Check the verb against the subject.",
      "approach": "- Find the subject\n- Fix the verb",
      "solution": "1. 'Chef Benny' is singular, so the verb is 'believes'."
    },
    {
      "number": "5.1.2",
      "marks": 1,
      "clues": "- Use the opposite polarity of the main sentence.",
      "approach": "- Identify 'is'\n- Make the tag negative",
      "solution": "1. The answer is 'isn't it' or 'is it not'."
    },
    {
      "number": "5.1.3",
      "marks": 1,
      "clues": "- Find the word that does not fit after 'describes this taste'.",
      "approach": "- Find the wrong word\n- Replace it",
      "solution": "1. 'He describes this taste as a smoky beef flavour with sweet barbecue notes.'"
    },
    {
      "number": "5.1.4",
      "marks": 3,
      "clues": "- Change the pronouns and the verb tense; check punctuation.",
      "approach": "- Change 'they' and 'me'\n- Move the tense back\n- Check punctuation",
      "solution": "1. Chef Benny said (that) they had roped him in as a chef who is synonymous with braai.\n2. One mark each for the changed tense, the pronoun change and correct punctuation."
    },
    {
      "number": "5.1.5",
      "marks": 1,
      "clues": "- A homophone sounds the same but is spelled differently.",
      "approach": "- Think of a word that sounds like 'new'\n- Use it in a sentence",
      "solution": "1. 'Knew' is a homophone: 'He knew he was in trouble.'"
    },
    {
      "number": "5.1.6",
      "marks": 1,
      "clues": "- Move the object to the front and use 'has been' plus the past participle.",
      "approach": "- Identify subject and object\n- Switch and adjust the verb",
      "solution": "1. A delicious braai companion has been created by Simba."
    },
    {
      "number": "5.1.7",
      "marks": 2,
      "clues": "- Think about what each underlined word does.",
      "approach": "- Look at 'the'\n- Look at 'flavour'",
      "solution": "1. 'The' is an article (definite determiner).\n2. 'Flavour' is a noun."
    },
    {
      "number": "5.1.8",
      "marks": 1,
      "clues": "- Use 'does not' with the base form of the verb.",
      "approach": "- Find the verb\n- Add the negative",
      "solution": "1. The new Steakhouse Beef does not stand out as distinct."
    },
    {
      "number": "5.2.1",
      "marks": 2,
      "clues": "- Join both facts using 'as well as'.",
      "approach": "- Keep both ideas\n- Check the sentence is complete",
      "solution": "1. Google is the most visited website as well as the most popular search engine.\n2. The other order is accepted; award 2 or 0 marks."
    },
    {
      "number": "5.2.2",
      "marks": 1,
      "clues": "- The sentence needs a noun after 'the'.",
      "approach": "- Identify the part of speech needed\n- Form it from the verb",
      "solution": "1. 'Create' becomes 'creation'."
    },
    {
      "number": "5.2.3",
      "marks": 1,
      "clues": "- Look at the word 'than'.",
      "approach": "- Recognise the comparison\n- Choose the form",
      "solution": "1. 'Many' becomes 'more'."
    },
    {
      "number": "5.2.4",
      "marks": 1,
      "clues": "- Write the numeral in words.",
      "approach": "- Think of the word for 0",
      "solution": "1. 'Zero' (or nought or nil)."
    },
    {
      "number": "5.2.5",
      "marks": 1,
      "clues": "- Use 'am', 'is' or 'are' plus the -ing form.",
      "approach": "- Change the tense\n- Keep the meaning",
      "solution": "1. I am using Google for my research."
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
