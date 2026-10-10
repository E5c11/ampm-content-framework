#!/usr/bin/env node
/**
 * DBE English FAL P2 — November 2025 — 'Inversnaid' by Gerard Manley Hopkins. 6.1.1–6.1.8, 18 marks.
 * Practice questions are fresh (DESIGN-UNI-01), mirror the sub-question types (LANG-EX-02) and carry text_key
 * "inversnaid" on lesson and every question (SETWORK-LES-01). aiExplanation: one entry per REAL exam
 * sub-question with its real marks, derived from the memo in own words (AIEXP-08). Every fitb declares
 * keyboard_type 'text' (LANG-KB-01).
 *
 *   node tools/validate-questions.js --script scripts/add-english-fal-2025-nov-p2-q11.js --curriculum temp/curriculum-vocab-english-fal.json
 *   node scripts/add-english-fal-2025-nov-p2-q11.js --dry-run
 *   node scripts/add-english-fal-2025-nov-p2-q11.js
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
  "name": "Question 6.1: 'Inversnaid'",
  "syllabus": "dbe",
  "subject": "english_fal",
  "year": 2025,
  "paper": "nov_p2",
  "order": 11,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "poetry_analysis",
    "poetic_devices",
    "imagery"
  ],
  "text_key": "inversnaid",
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p2/q11/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p2/q11/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p2/q11/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p2/q11/memo_2.png"
  ],
  "exam_question_marks": 18,
  "supplementary_materials": [
    {
      "type": "annexure",
      "label": "Poem",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p2/q11/annexure_poem_1_1.png"
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
    "year": 2025,
    "paper": "nov_p2",
    "name": "Question 1",
    "text_key": "inversnaid",
    "order": 1,
    "context_text": null,
    "question": "Which line from 'Inversnaid' repeats the same consonant sound at the start of its words?",
    "metadata": [
      "A windpuff-bonnet of fawn-froth",
      "Of a pool so pitchblack, fell-frowning",
      "Wiry heathpacks, flitches of fern",
      "Degged with dew, dappled with dew",
      ""
    ],
    "answer": [
      "Degged with dew, dappled with dew",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "poetry",
    "topic": "poetic_devices",
    "subtopic": "alliteration_identification",
    "skills": [
      "english_fal_identify_sound_devices"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Read each line aloud and listen for the first sounds of the words.\n- Look for a repeated 'd' or 'f' at the start of several words."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Question 2",
    "text_key": "inversnaid",
    "order": 2,
    "context_text": "Of a pool so pitchblack, féll-frówning, it rounds and rounds Despair to drowning.",
    "question": "What does the word 'pitchblack' suggest about the pool?",
    "metadata": [
      "It suggests that the pool is clean and shallow.",
      "It suggests that the pool is warm and welcoming.",
      "It suggests that the pool is very dark and dangerous.",
      "It suggests that the pool is full of fish.",
      ""
    ],
    "answer": [
      "It suggests that the pool is very dark and dangerous.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "poetry",
    "topic": "imagery",
    "subtopic": "colour_imagery",
    "skills": [
      "english_fal_explain_imagery"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Think about the colour of pitch and what darkness suggests.\n- Look at the word 'féll-frówning' beside it."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Question 3",
    "text_key": "inversnaid",
    "order": 3,
    "context_text": "It rounds and rounds Despair to drowning.",
    "question": "In the lines below, which word is given the actions of a person who can drown? Write one word.",
    "metadata": [
      "Word:",
      "[ ]"
    ],
    "answer": [
      "Despair",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "application",
    "unit": "poetry",
    "topic": "poetic_devices",
    "subtopic": "personification_identification",
    "skills": [
      "english_fal_identify_figure_of_speech"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "clues": "- Look for an abstract idea (a feeling) that is made to act like a person.\n- It starts with a capital letter in the middle of the line.",
    "keyboard_type": "text"
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Question 4",
    "text_key": "inversnaid",
    "order": 4,
    "context_text": null,
    "question": "Select the TWO words from the poem that best show the wildness of the stream.",
    "metadata": [
      "rollrock",
      "beadbonny",
      "roaring",
      "dappled",
      "dew"
    ],
    "answer": [
      "rollrock",
      "roaring",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "poetry",
    "topic": "theme_identification",
    "subtopic": "theme_of_wildness",
    "skills": [
      "english_fal_identify_theme_evidence"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "clues": "- Think about words that suggest noise and force.\n- Three of the options describe gentle or pretty things."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Question 5",
    "text_key": "inversnaid",
    "order": 5,
    "context_text": null,
    "question": "The speaker's use of descriptive words creates a peaceful atmosphere. Which ONE answer is best substantiated by the poem?",
    "metadata": [
      "No: every word in the poem describes a calm and cheerful scene.",
      "Yes: 'treads' and 'dew' suggest quiet movement, but 'pitchblack' and 'Despair' bring a threatening mood.",
      "Yes: the poem has no descriptive words at all.",
      "No: the poem describes a city street.",
      ""
    ],
    "answer": [
      "Yes: 'treads' and 'dew' suggest quiet movement, but 'pitchblack' and 'Despair' bring a threatening mood.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "poetry",
    "topic": "theme_identification",
    "subtopic": "discuss_view_with_evidence",
    "skills": [
      "english_fal_substantiate_a_view"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "clues": "- Look for an option that refers to specific words in the poem.\n- Reject options that deny the poem's content."
  }
];

// ─── AI explanation — one entry per REAL exam sub-question, real marks (AIEXP-08) ───

const aiExplanation = {
  "sub_questions": [
    {
      "number": "6.1.1",
      "marks": 4,
      "clues": "- Count the lines and look at the end rhymes.\n- Use the words in the list for each blank.",
      "approach": "- Fill each blank with the best word\n- Check the rhyme scheme against the lines",
      "solution": "1. The poem is divided into four-line sets called quatrains.\n2. Each set is a stanza.\n3. The scheme is aabb ccdd eeff gghh."
    },
    {
      "number": "6.1.2",
      "marks": 1,
      "clues": "- Think about the colour of a horse's back.\n- What does it say about the water?",
      "approach": "- Name the colour\n- Link it to the stream",
      "solution": "1. The water is dark brown, perhaps with dirt or mud."
    },
    {
      "number": "6.1.3",
      "marks": 2,
      "clues": "- Look at stanza 3: dew, the slopes and the stream.\n- Give one time and one place.",
      "approach": "- Name the place\n- Name the time",
      "solution": "1. The place is the hillside, the slopes ('braes') beside the stream at Inversnaid.\n2. The time is early morning (dew) or autumn."
    },
    {
      "number": "6.1.4",
      "marks": 1,
      "clues": "- Look at the repeated sounds in 'coop' and 'comb'.\n- Replace the underlined word.",
      "approach": "- Identify the device\n- Replace the wrong term",
      "solution": "1. The sound device is alliteration (or assonance), not the underlined word."
    },
    {
      "number": "6.1.5",
      "marks": 2,
      "clues": "- Look at the question and the plea in lines 13–15.\n- What does the speaker care about?",
      "approach": "- Name the trait\n- Support it",
      "solution": "1. The speaker is passionate and caring about nature.\n2. He pleads with mankind to protect it."
    },
    {
      "number": "6.1.6",
      "marks": 2,
      "clues": "- Think about how people usually see weeds.\n- Link it to the speaker's wish.",
      "approach": "- State the usual view\n- State the speaker's view",
      "solution": "1. Weeds are usually unwanted.\n2. The speaker sees them as part of nature's wild beauty worth keeping."
    },
    {
      "number": "6.1.7",
      "marks": 3,
      "clues": "- Look at words that suggest an untamed nature.\n- Use two or three examples.",
      "approach": "- Define the theme\n- Give words and meaning",
      "solution": "1. 'Rollrock' suggests an untamed horse galloping over rocks.\n2. 'Féll-frówning' suggests fierce, threatening hills.\n3. 'Wiry' suggests strong, dangerous ferns."
    },
    {
      "number": "6.1.8",
      "marks": 3,
      "clues": "- Decide your view, then support it with words from the poem.\n- A bare yes or no earns nothing.",
      "approach": "- State your view\n- Give evidence",
      "solution": "1. Yes: 'Degged with dew' suggests serenity, 'treads' suggests slow movement and the ash tree is 'beadbonny'.\n2. No: 'twindles' suggests a whirlpool, 'pitchblack' is ominous and Despair is personified."
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
