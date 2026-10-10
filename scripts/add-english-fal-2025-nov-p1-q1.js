#!/usr/bin/env node
/**
 * DBE English FAL P1 — November 2025 — Question 1: Comprehension (order 1)
 * TEXT A: article on South African music's global growth through streaming. TEXT B: infographic
 * 'Grade 12's future plans'. Practice set mirrors the text-extractable sub-questions (1.1–1.9: false
 * statement, synonym in text, stated reasons, purpose of a source, italics, expressions, title) with
 * fresh stimulus on the same theme (LANG-EX-01/02, DESIGN-UNI-01). 1.10–1.12 depend on the TEXT B
 * graphic and are skipped for practice (LANG-EX-03); aiExplanation covers every real sub-question
 * 1.1.1–1.12 with its real marks (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video. Every fitb declares keyboard_type 'text' (LANG-KB-01).
 *   node tools/validate-questions.js --script scripts/add-english-fal-2025-nov-p1-q1.js --curriculum temp/curriculum-vocab-english-fal.json
 *   node scripts/add-english-fal-2025-nov-p1-q1.js --dry-run
 *   node scripts/add-english-fal-2025-nov-p1-q1.js
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
  "name": "Question 1: Comprehension",
  "syllabus": "dbe",
  "subject": "english_fal",
  "year": 2025,
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
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p1/q1/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p1/q1/question_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p1/q1/question_3.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p1/q1/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p1/q1/memo_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p1/q1/memo_3.png"
  ],
  "exam_question_marks": 30,
  "supplementary_materials": [
    {
      "type": "annexure",
      "label": "Text A",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p1/q1/annexure_text_a_1.png",
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p1/q1/annexure_text_a_2.png"
      ]
    },
    {
      "type": "annexure",
      "label": "Text B",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p1/q1/annexure_text_b_1.png"
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
    "context_text": "Streaming platforms let listeners in any country play a song within seconds of its release. Last year, several African artists reached audiences in cities they had never visited, and their monthly listener counts doubled.",
    "question": "Which ONE of the following statements about the extract is FALSE?",
    "metadata": [
      "The monthly listener numbers of these artists fell.",
      "Songs can be played soon after they are released.",
      "Some African artists reached cities they had never visited.",
      "Streaming makes it possible to hear music from other countries.",
      ""
    ],
    "answer": [
      "The monthly listener numbers of these artists fell.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "comprehension",
    "topic": "literal_comprehension",
    "subtopic": "identify_false_statement",
    "skills": [
      "english_fal_identify_false_statement"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Check each option against the extract, one at a time.\n- Three options are supported by the extract; look for the one that is not."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2025,
    "paper": "nov_p1",
    "name": "Question 2",
    "order": 2,
    "context_text": "The new studio in Soweto has drawn a huge crowd of young producers every weekend.",
    "question": "Quote ONE word from the extract that means the same as 'large'.",
    "metadata": [
      "Word:",
      "[ ]"
    ],
    "answer": [
      "huge",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "application",
    "unit": "comprehension",
    "topic": "vocabulary_in_context",
    "subtopic": "synonym_in_context",
    "skills": [
      "english_fal_find_synonym_in_text"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Look for an adjective that describes the crowd.\n- Quote a single word only.",
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
    "context_text": "South Africa is the largest music market in its region, and its artists have recently won several international awards.",
    "question": "Select the TWO reasons given in the extract why South Africa is important to the regional music industry.",
    "metadata": [
      "It is the largest music market in its region.",
      "Its artists have won international awards.",
      "It has the most radio stations in Africa.",
      "Its music is cheaper than music from other countries.",
      "It hosts the largest music festival in the world."
    ],
    "answer": [
      "It is the largest music market in its region.",
      "Its artists have won international awards.",
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
    "difficulty": 3,
    "exam_weight": 2,
    "clues": "- Use only what the extract states; do not add facts you know from elsewhere.\n- Two options appear in the extract almost word for word."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2025,
    "paper": "nov_p1",
    "name": "Question 4",
    "order": 4,
    "context_text": "According to the Global Music Statistics Board, local streaming income rose by 18% last year.",
    "question": "Why does the writer mention the Global Music Statistics Board?",
    "metadata": [
      "To show that the writer is a member of the board.",
      "To make the statistic more trustworthy.",
      "To advertise the services of the board.",
      "To explain how music is recorded.",
      ""
    ],
    "answer": [
      "To make the statistic more trustworthy.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "comprehension",
    "topic": "author_purpose_and_attitude",
    "subtopic": "purpose_of_source_reference",
    "skills": [
      "english_fal_explain_purpose_of_reference"
    ],
    "difficulty": 2,
    "exam_weight": 3,
    "clues": "- Ask what a named, official source adds to a statistic.\n- Think about whether the reader is more or less likely to believe the figure."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2025,
    "paper": "nov_p1",
    "name": "Question 5",
    "order": 5,
    "context_text": "Her debut single, Ulwandle, mixes gospel harmonies with a modern kwaito beat.",
    "question": "In the original article, the word 'Ulwandle' is printed in italics. Why?",
    "metadata": [
      "It is a word that is difficult to pronounce.",
      "It shows that the word is spelled incorrectly.",
      "It is the writer's own opinion.",
      "It is the name of a song.",
      ""
    ],
    "answer": [
      "It is the name of a song.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "comprehension",
    "topic": "text_features_and_visuals",
    "subtopic": "italics_function",
    "skills": [
      "english_fal_explain_function_of_italics"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Think about what kinds of words are usually set in italics in a news article.\n- Look at the word's position in the sentence."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2025,
    "paper": "nov_p1",
    "name": "Question 6",
    "order": 6,
    "context_text": null,
    "question": "Match each expression to its meaning.",
    "metadata": [
      "A - a household name",
      "B - to hit the right note",
      "C - to take centre stage",
      "1 - to say or do something that suits the occasion",
      "2 - to become the main focus of attention",
      "3 - a person or brand that almost everyone knows"
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
    "clues": "- Try each expression in a sentence and see which meaning fits.\n- Start with the one you are most sure about and remove it."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2025,
    "paper": "nov_p1",
    "name": "Question 7",
    "order": 7,
    "context_text": "Local gospel choirs, jazz bands and amapiano producers are all finding new audiences abroad. Yet only a handful of acts have reached the international charts.",
    "question": "Discuss the suitability of the title 'AFRICAN MUSIC TAKES THE WORLD BY STORM' for the extract. Which ONE answer is best substantiated by the extract?",
    "metadata": [
      "The title is completely suitable because the extract says that every African artist is now famous abroad.",
      "The title is not suitable because the extract only mentions music from a single country.",
      "The title is partly suitable: many genres find new audiences, but only a handful of acts have reached the charts.",
      "The title is not suitable because the extract is not about music.",
      ""
    ],
    "answer": [
      "The title is partly suitable: many genres find new audiences, but only a handful of acts have reached the charts.",
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
    "clues": "- Compare the strength of the title's claim with the facts the extract gives.\n- A well-substantiated answer refers to specific details from the extract."
  }
];

// ─── AI explanation — one entry per REAL exam sub-question, real marks (AIEXP-08) ───

const aiExplanation = {
  "sub_questions": [
    {
      "number": "1.1.1",
      "marks": 1,
      "clues": "- Read the statement, then find what the first paragraph says about revenue in 2023.\n- Think about whether the paragraph describes a gain or a loss.",
      "approach": "- Locate the sentence about total revenue in paragraph 1\n- Say what it actually reports\n- Write the correct fact to show why the statement is false",
      "solution": "1. Paragraph 1 says the music industry reached its highest total revenue ever in 2023.\n2. The statement claims it suffered a great financial loss, which is the opposite.\n3. So the statement is false: the industry achieved its best income."
    },
    {
      "number": "1.1.2",
      "marks": 1,
      "clues": "- You need a single word from paragraph 1.\n- Look for a word describing the music industry's range of genres and regions.",
      "approach": "- Find the phrase about the industry in paragraph 1 that describes variety\n- Choose the one word that matches 'varied'\n- Quote it exactly",
      "solution": "1. 'Varied' means made up of different kinds.\n2. Paragraph 1 describes the industry as 'global and diverse'.\n3. The word that means the same as 'varied' is 'diverse'."
    },
    {
      "number": "1.2.1",
      "marks": 2,
      "clues": "- Use your own words rather than copying from paragraph 2.\n- Look for figures and for words about interest in South African music.",
      "approach": "- Find the statistic about South Africa's share of regional earnings\n- Find what is said about interest in local music\n- Rewrite both reasons in your own words",
      "solution": "1. Reason one: South Africa makes up most of the regional market, contributing about 77% of earnings.\n2. Reason two: interest in South African music has grown beyond earlier levels.\n3. Each reason must be in your own words for the mark."
    },
    {
      "number": "1.2.2",
      "marks": 2,
      "clues": "- Ask what kind of organisation the IFPI is.\n- Think about why a writer quotes an official source.",
      "approach": "- Identify the IFPI as an international industry body\n- State what its mention does for the statistics\n- Link this to how convincing the data seems",
      "solution": "1. The IFPI is a respected international body for the music industry.\n2. Naming it makes the data on South African music consumption more credible.\n3. Both points (the body's standing and the credibility it lends) earn the marks."
    },
    {
      "number": "1.3.1",
      "marks": 2,
      "clues": "- Look at which two words are italicised and what each one names.\n- One is a title; think about what the other is.",
      "approach": "- Identify what 'Water' refers to\n- Identify what 'Amapiano' refers to\n- Explain why such words are set apart",
      "solution": "1. 'Water' is italicised because it is the title of a song.\n2. 'Amapiano' is italicised because it names a specific music genre / is a non-English word.\n3. Italics mark titles and foreign terms."
    },
    {
      "number": "1.3.2",
      "marks": 2,
      "clues": "- Re-read what the paragraph says about the award category and the winner.\n- More than one valid reason is possible.",
      "approach": "- Find what is special about this Grammy win\n- Link it to South African music's reputation\n- State one clearly explained point",
      "solution": "1. One valid reason: it was the first time the award was presented in this category and a young South African woman won it.\n2. Another: it highlights the growing international influence of South African music.\n3. Any one of the accepted reasons, clearly explained, earns both marks."
    },
    {
      "number": "1.4.1",
      "marks": 2,
      "clues": "- 'Making waves' is figurative: think about what waves do.\n- Use the rest of the sentence to see what had already happened.",
      "approach": "- Explain the idiom in plain words\n- Link it to what happened before 'Water' was released\n- Give two points",
      "solution": "1. 'Making waves' means creating an impact or getting noticed.\n2. Tyla's music was already having an effect on listeners before her hit single 'Water' was released.\n3. Both points are needed for two marks."
    },
    {
      "number": "1.4.2",
      "marks": 2,
      "clues": "- Look at which cities are listed and where they are in the world.\n- Ask what the list proves about her listeners.",
      "approach": "- Note that the cities are on different continents\n- Link the list to the spread of her audience\n- State the point the writer is proving",
      "solution": "1. The cities named are in Africa and in other parts of the world.\n2. The writer uses them as evidence that Tyla's music is enjoyed internationally.\n3. So the mention of cities proves her global popularity."
    },
    {
      "number": "1.5.1",
      "marks": 1,
      "clues": "- Look at how 'barriers' is used in the sentence about music rising above them.\n- Try each option in place of the word.",
      "approach": "- Read the sentence in context\n- Replace 'barriers' with each option\n- Choose the one that keeps the meaning",
      "solution": "1. Music that rises above 'national and global barriers' overcomes things that stand in its way.\n2. The word that fits is 'difficulties'.\n3. 'Predictions', 'allowances' and 'foundations' do not mean obstacles, so they are wrong."
    },
    {
      "number": "1.5.2",
      "marks": 2,
      "clues": "- Find Christel Kayibi's name in paragraph 5.\n- Look for what she says drives growth and creativity.",
      "approach": "- Locate her statement\n- Pick out the two things she names as the driving force\n- State them briefly",
      "solution": "1. Kayibi says a rich blend of genres is behind the creativity.\n2. She also names a blend of cultures.\n3. The two points are a mixture of music types and a mixture of cultures."
    },
    {
      "number": "1.6",
      "marks": 2,
      "clues": "- Paragraph 6 describes what record companies now do for artists.\n- Answer in your own words, not by copying.",
      "approach": "- Find the 'deliberate strategies' in paragraph 6\n- Identify what the companies do with artists\n- Give two changes in your own words",
      "solution": "1. Companies now use deliberate strategies to involve artists, for example partnerships and collaboration.\n2. They also support artists so that they build lasting careers (mentoring and developing them).\n3. Any two of these, in your own words, earn the marks."
    },
    {
      "number": "1.7",
      "marks": 1,
      "clues": "- Paragraph 7 is about streaming services and independent artists.\n- The lesson is something other artists can act on.",
      "approach": "- Find the sentence linking Tyla's breakthrough to streaming\n- Turn it into a lesson for other artists",
      "solution": "1. Paragraph 7 says her breakthrough underlines how critical streaming has become to artistic success.\n2. So other artists can learn that being present on streaming platforms is key to success."
    },
    {
      "number": "1.8",
      "marks": 2,
      "clues": "- Decide your view first, then support it with a reason.\n- A bare 'yes' or 'no' earns no mark.",
      "approach": "- State your opinion\n- Give a reason linked to the extract's ideas\n- Support it with a short explanation",
      "solution": "1. Yes: promoting South African music abroad can showcase local culture and open economic opportunities for artists.\n2. No: international exposure may erode cultural identity and artists should be supported at home.\n3. Either view earns marks when it is substantiated."
    },
    {
      "number": "1.9",
      "marks": 2,
      "clues": "- Think about what 'explodes' suggests and whether the article supports it.\n- Both a yes and a no answer can be right if explained.",
      "approach": "- Decide whether the title fits the article's content\n- Comment on the word 'explodes'\n- Substantiate with a detail from the article",
      "solution": "1. Suitable: the article shows massive growth for South African music abroad and 'explodes' conveys that impact.\n2. Not suitable: the article also covers streaming and only a few artists, and 'explodes' can suggest destruction.\n3. Give reasons for either view to earn the marks."
    },
    {
      "number": "1.10",
      "marks": 2,
      "clues": "- Compare the percentages shown for each future plan in TEXT B.\n- Your answer needs the number to back it up.",
      "approach": "- Find the plan with the highest percentage\n- Name it\n- Quote the percentage as evidence",
      "solution": "1. The highest figure in the visuals is 39%.\n2. That figure belongs to academic studies.\n3. So the most popular plan is to pursue academic studies, as shown by the highest percentage."
    },
    {
      "number": "1.11",
      "marks": 2,
      "clues": "- Read '12% FIND WORK' next to the other options in the graphic.\n- Ask what a small figure suggests about employment.",
      "approach": "- Interpret what the figure says about work\n- Compare it with the other plans\n- State what the writer suggests",
      "solution": "1. Only 12% plan to find work, so work is not the main plan.\n2. This suggests there are other options for learners to consider.\n3. It also suggests that there are limited employment opportunities."
    },
    {
      "number": "1.12",
      "marks": 2,
      "clues": "- Look at visual 3 and the plan it sits next to.\n- Decide whether it adds meaning to the graphic.",
      "approach": "- Describe what visual 3 shows\n- Link it to the plan it illustrates\n- Give a reasoned verdict",
      "solution": "1. Visual 3 depicts a phone and a book near the 'gap year' option.\n2. It is relevant if you argue that a gap year includes activities like these.\n3. It is not relevant if you argue the images do not link to a gap year; either view needs a reason."
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
