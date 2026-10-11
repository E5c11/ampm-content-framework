#!/usr/bin/env node
/**
 * DBE English FAL P1 — November 2024 — Question 1: Comprehension (order 1) — TEXT A article on embracing artificial intelligence; TEXT B infographic on the benefits of reading. Practice mirrors the text-extractable sub-questions (1.1–1.9) on a fresh AI/technology theme; 1.10–1.12 depend on the TEXT B graphic and are skipped (LANG-EX-03).
 * Practice questions are fresh (DESIGN-UNI-01) and follow the shared rules: context_text null for literature (SETWORK-LES-05),
 * fresh targets, conventions-based for writing (LANG-WR-03); aiExplanation is one entry per REAL printed sub-question with its
 * real marks, derived from the memo in own words (AIEXP-08). Every fitb declares keyboard_type 'text' (LANG-KB-01).
 * Text key: none (language / writing paper).
 *
 * BASIS per practice question — BK book knowledge (verify against the text), P printed in the paper/poem, M memo,
 * PT vocabulary/title, C CAPS, P1 language-paper skill:
 *   Q1: P1: fresh stimulus on the exam text's theme (AI)
 *   Q2: P1: vocabulary in context
 *   Q3: P1: stated reasons
 *   Q4: P1: purpose of a statistic
 *   Q5: P1: idioms
 *   Q6: P1: title suitability
 *
 *   node tools/validate-questions.js --script scripts/add-english-fal-2024-nov-p1-q1.js --curriculum temp/curriculum-vocab-english-fal.json
 *   node scripts/add-english-fal-2024-nov-p1-q1.js --dry-run
 *   node scripts/add-english-fal-2024-nov-p1-q1.js
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
  "name": "Question 1: Comprehension",
  "syllabus": "dbe",
  "subject": "english_fal",
  "year": 2024,
  "paper": "nov_p1",
  "order": 1,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "comprehension",
    "literal_comprehension",
    "inferential_reading",
    "diction"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p1/q1/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p1/q1/question_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p1/q1/question_3.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p1/q1/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p1/q1/memo_2.png"
  ],
  "exam_question_marks": 30,
  "supplementary_materials": [
    {
      "type": "annexure",
      "label": "Text A",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p1/q1/annexure_text_a_1.png",
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p1/q1/annexure_text_a_2.png"
      ]
    },
    {
      "type": "annexure",
      "label": "Text B",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p1/q1/annexure_text_b_1.png"
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
    "context_text": "Voice assistants can set alarms, play music and answer questions, and each year they understand more of what we say. Yet no assistant can sense when a friend simply needs someone to listen.",
    "question": "What point is the writer making about voice assistants?",
    "metadata": [
      "They are useless, so people have stopped using them.",
      "They can sense a friend's feelings better than people can.",
      "They are useful, but they cannot replace human understanding.",
      "They will soon replace every other device at home.",
      ""
    ],
    "answer": [
      "They are useful, but they cannot replace human understanding.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "comprehension",
    "topic": "author_purpose_and_attitude",
    "subtopic": "writers_main_point",
    "skills": [
      "english_fal_identify_main_point"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Notice the word 'yet' in the last sentence: it signals a limit.\n- Decide what the first sentence praises and what the last sentence admits."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2024,
    "paper": "nov_p1",
    "name": "Question 2",
    "order": 2,
    "context_text": "Voice commands make the device easy and simple to use for people of all ages.",
    "question": "Quote ONE word from the extract that means the opposite of 'complicated'.",
    "metadata": [
      "Word:",
      "[ ]"
    ],
    "answer": [
      "easy|simple",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "definition",
    "unit": "comprehension",
    "topic": "vocabulary_in_context",
    "subtopic": "synonym_in_context",
    "skills": [
      "english_fal_find_synonym_in_text"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Look for an adjective that describes how the device is used.\n- Quote a single word only.",
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
    "context_text": "Many shops now use chatbots to answer customers at night, which saves money and keeps customers happy.",
    "question": "Select the TWO benefits of chatbots that are stated in the extract.",
    "metadata": [
      "It saves the shop money.",
      "It replaces every worker in the shop.",
      "It keeps customers happy.",
      "It makes the shop larger.",
      "It slows down service at night."
    ],
    "answer": [
      "It saves the shop money.",
      "It keeps customers happy.",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "comprehension",
    "topic": "literal_comprehension",
    "subtopic": "select_stated_reasons",
    "skills": [
      "english_fal_identify_stated_reasons"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Use only what the extract states.\n- Two options appear in the extract almost word for word."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2024,
    "paper": "nov_p1",
    "name": "Question 4",
    "order": 4,
    "context_text": "Within three years, the use of online learning tools among learners has grown by 60 per cent.",
    "question": "Why does the writer mention '60 per cent'?",
    "metadata": [
      "To show that learners dislike these tools.",
      "To show how quickly the use of these tools is growing.",
      "To prove that the tools are expensive.",
      "To show how many schools have closed.",
      ""
    ],
    "answer": [
      "To show how quickly the use of these tools is growing.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "comprehension",
    "topic": "author_purpose_and_attitude",
    "subtopic": "purpose_of_a_statistic",
    "skills": [
      "english_fal_explain_purpose_of_reference"
    ],
    "difficulty": 2,
    "exam_weight": 3,
    "clues": "- A percentage 'since' a period of time shows change.\n- Ask what a rising figure tells the reader."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2024,
    "paper": "nov_p1",
    "name": "Question 5",
    "order": 5,
    "context_text": null,
    "question": "Match each expression to its meaning.",
    "metadata": [
      "A - behind the times",
      "B - to cut corners",
      "C - ahead of the curve",
      "1 - to do a job carelessly to save time",
      "2 - more advanced than most people",
      "3 - old-fashioned"
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
    "unit": "comprehension",
    "topic": "vocabulary_in_context",
    "subtopic": "idioms_and_expressions",
    "skills": [
      "english_fal_explain_idiom_meaning"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "clues": "- Try each expression in a sentence and see which meaning fits.\n- Start with the one you are surest about."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2024,
    "paper": "nov_p1",
    "name": "Question 6",
    "order": 6,
    "context_text": null,
    "question": "Discuss the suitability of the title 'READING IS FOR EVERYONE' for a passage that lists four ways in which books help learners to concentrate. Which ONE answer is best substantiated?",
    "metadata": [
      "Not suitable: the passage is about sport.",
      "Suitable: it says that everyone must read the same book.",
      "Not suitable: a title may never refer to people.",
      "Suitable: it shows that reading helps learners concentrate and learn, which anyone can benefit from.",
      ""
    ],
    "answer": [
      "Suitable: it shows that reading helps learners concentrate and learn, which anyone can benefit from.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "comprehension",
    "topic": "evaluative_reading",
    "subtopic": "title_suitability",
    "skills": [
      "english_fal_evaluate_title_suitability"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "clues": "- Compare the title with what the passage actually lists.\n- A well-substantiated answer gives a reason from the passage."
  }
];

// ─── AI explanation — one entry per REAL printed sub-question, real marks (AIEXP-08) ───

const aiExplanation = {
  "sub_questions": [
    {
      "number": "1.1.1",
      "marks": 1,
      "clues": "- Look for what the first paragraph says about how far AI reaches into daily life.",
      "approach": "- Find the sentence about its importance\n- State the reason in one short point",
      "solution": "1. AI has a wide-ranging impact on many aspects of our lives and is part of our routines."
    },
    {
      "number": "1.1.2",
      "marks": 2,
      "clues": "- Think about what 'fantasies' suggests about how real these ideas are.",
      "approach": "- Explain the words\n- Say what they suggest about people's view of AI",
      "solution": "1. 'Science fiction fantasies' suggest that people imagine AI as made up, based on imagination.\n2. They also suggest futuristic ideas such as robots taking over the world."
    },
    {
      "number": "1.2.1",
      "marks": 2,
      "clues": "- Use your own words: do not copy the sentence.",
      "approach": "- Find the definition in paragraph 2\n- Rewrite two points",
      "solution": "1. AI is a branch of computer science.\n2. In it machines copy how people think and make decisions."
    },
    {
      "number": "1.2.2",
      "marks": 2,
      "clues": "- Look at what paragraph 2 says AI does for industries.",
      "approach": "- Find the benefits\n- State two",
      "solution": "1. Tasks are completed faster or more accurately.\n2. Efficiency is improved and processes are streamlined."
    },
    {
      "number": "1.3",
      "marks": 2,
      "clues": "- Look for the sentence that begins 'In Africa'.",
      "approach": "- Find the list\n- Choose two",
      "solution": "1. Access to healthcare, financial services or education (any two)."
    },
    {
      "number": "1.4.1",
      "marks": 1,
      "clues": "- Compare the false statement with what paragraph 4 says about skills.",
      "approach": "- Find the correct fact in paragraph 4\n- State it",
      "solution": "1. AI's impact on businesses has caused a shift in the type of skills needed for economic change, so skills are still needed."
    },
    {
      "number": "1.4.2",
      "marks": 2,
      "clues": "- Think about what a large percentage shows about growth.",
      "approach": "- Find the figure's context\n- Give two reasons",
      "solution": "1. It shows the rapid growth of AI.\n2. It shows how important AI is in businesses."
    },
    {
      "number": "1.5.1",
      "marks": 2,
      "clues": "- Think about the feeling carried by 'exciting' and 'transforms'.",
      "approach": "- Interpret both words\n- Link them to AI",
      "solution": "1. The words suggest that AI brings amazing change.\n2. They suggest innovation and reform."
    },
    {
      "number": "1.5.2",
      "marks": 2,
      "clues": "- Re-read the sentences about the ADI platform.",
      "approach": "- Find the two steps\n- Say them in your own words",
      "solution": "1. You give the platform information about the website you want.\n2. It produces a well-designed website in a short time."
    },
    {
      "number": "1.6",
      "marks": 2,
      "clues": "- Look at the word 'human-like' and the quotation marks around 'conversations'.",
      "approach": "- Interpret the words\n- State two points",
      "solution": "1. ChatGPT makes communication seem natural, like talking to a person.\n2. It can give answers or guidance when you ask."
    },
    {
      "number": "1.7",
      "marks": 1,
      "clues": "- Compare the bold glamour filter with 'past social media filters'.",
      "approach": "- Find the contrast in paragraph 7\n- State one difference",
      "solution": "1. It keeps working well when a face moves in a video, creating a new flawless face from a database of faces."
    },
    {
      "number": "1.8.1",
      "marks": 1,
      "clues": "- Look for a single word that means a shortcoming.",
      "approach": "- Scan the first sentence of paragraph 8\n- Quote one word",
      "solution": "1. The word is 'limitations'."
    },
    {
      "number": "1.8.2",
      "marks": 2,
      "clues": "- Look at the advice that begins 'It is also worth noting'.",
      "approach": "- Find the two pieces of advice\n- State them",
      "solution": "1. AI should not be used to deceive or take shortcuts.\n2. It should be used to improve existing systems and make them more effective."
    },
    {
      "number": "1.9",
      "marks": 2,
      "clues": "- Decide whether the title fits the whole passage, then give a reason.",
      "approach": "- State your view\n- Support it from the passage",
      "solution": "1. Suitable: the passage discusses AI's importance, impact and uses, and shows it is being welcomed.\n2. Not suitable: not everyone welcomes AI and there are concerns.\n3. A bare yes or no earns no mark."
    },
    {
      "number": "1.10",
      "marks": 2,
      "clues": "- Look at the picture in visual 1 and read what it suggests.",
      "approach": "- Say what benefit it shows\n- Give a reason from the visual",
      "solution": "1. Reading is good exercise for your brain.\n2. The picture of a brain lifting weights or wearing running shoes shows the importance of training your brain."
    },
    {
      "number": "1.11",
      "marks": 2,
      "clues": "- Think about what a light bulb usually stands for.",
      "approach": "- Say what it suggests\n- Give a reason",
      "solution": "1. Reading gives people new ideas.\n2. The light bulb represents creativity, bright ideas or solutions."
    },
    {
      "number": "1.12",
      "marks": 2,
      "clues": "- Decide which is easier for you and say why.",
      "approach": "- State your view\n- Support it",
      "solution": "1. Visuals are easy to understand because you do not have to work out the meaning of words.\n2. Or written text is easier because the visuals may be confusing.\n3. A bare view earns no mark."
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
