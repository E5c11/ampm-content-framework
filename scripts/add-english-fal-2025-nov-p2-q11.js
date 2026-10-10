#!/usr/bin/env node
/**
 * DBE English FAL P2 — November 2025 — 'Inversnaid' by Gerard Manley Hopkins. 6.1.1–6.1.8, 18 marks.
 * Practice questions follow the HL Paper 2 pattern: context_text null, FRESH targets from elsewhere in the text, never the
 * exam's own statements or the memo's answers (DESIGN-UNI-01); they carry text_key "inversnaid" on lesson and every
 * question (SETWORK-LES-01). aiExplanation: one entry per REAL exam sub-question with its real marks, derived from the
 * memo in own words (AIEXP-08). Every fitb declares keyboard_type 'text' (LANG-KB-01).
 *
 * FACTUAL BASIS per practice question — BK = book knowledge (verify against the text), P = printed in the exam paper's
 * extract/poem, M = established by the memo, PT = vocabulary/title meaning:
 *   Q1: P: the poem is printed with 16 numbered lines.
 *   Q2: P + BK: 'burn' = stream (Scots); poem is about a stream.
 *   Q3: P: line 5 of the poem (compound image).
 *   Q4: P: stream and pool are printed in lines 1–8.
 *   Q5: P: repetition printed in lines 14–15.
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
    "question": "How many lines are there in the poem 'Inversnaid'? Write the number.",
    "metadata": [
      "Lines:",
      "[ ]"
    ],
    "answer": [
      "16",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "definition",
    "unit": "poetry",
    "topic": "structure_and_form",
    "subtopic": "poem_form",
    "skills": [
      "english_fal_identify_poem_structure"
    ],
    "difficulty": 1,
    "exam_weight": 1,
    "clues": "- Count the numbers printed in the margin of the poem.\n- Write digits only.",
    "keyboard_type": "text"
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
    "context_text": null,
    "question": "What is a 'burn' in the poem 'Inversnaid'?",
    "metadata": [
      "a mountain",
      "a type of bird",
      "a small stream",
      "a rock formation",
      ""
    ],
    "answer": [
      "a small stream",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "poetry",
    "topic": "figurative_language",
    "subtopic": "word_meaning_in_context",
    "skills": [
      "english_fal_explain_word_in_context"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- The poet uses it for the water he is describing.\n- It is a Scots word."
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
    "context_text": null,
    "question": "In the phrase 'a windpuff-bonnet of fáwn-fróth', what is the foam compared to?",
    "metadata": [
      "a mountain peak",
      "a fisherman's net",
      "a sleeping animal",
      "a bonnet blown by the wind",
      ""
    ],
    "answer": [
      "a bonnet blown by the wind",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "poetry",
    "topic": "imagery",
    "subtopic": "comparison_in_context",
    "skills": [
      "english_fal_explain_imagery"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "clues": "- A bonnet is something worn on the head.\n- The first part of the compound tells you what moves it."
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
    "question": "Select the TWO natural features that are described in the poem.",
    "metadata": [
      "a stream (burn)",
      "a desert",
      "a pool",
      "a snow-capped mountain",
      "a busy city street"
    ],
    "answer": [
      "a stream (burn)",
      "a pool",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "poetry",
    "topic": "imagery",
    "subtopic": "natural_features",
    "skills": [
      "english_fal_explain_imagery"
    ],
    "difficulty": 1,
    "exam_weight": 1,
    "clues": "- Read the first stanzas: what is the poet looking at?\n- Reject features that do not appear in the poem."
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
    "question": "What is the effect of the poet's repetition of 'let them be left' and 'wildness and wet' in the last stanza?",
    "metadata": [
      "It shows that the poet cannot think of anything new to say.",
      "It stresses the speaker's plea for wild places to be left as they are.",
      "It makes the poem sound like a cheerful nursery rhyme.",
      "It shows that the poet has forgotten the earlier lines.",
      ""
    ],
    "answer": [
      "It stresses the speaker's plea for wild places to be left as they are.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "poetry",
    "topic": "poetic_devices",
    "subtopic": "repetition",
    "skills": [
      "english_fal_explain_effect_of_structure"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "clues": "- Repeated words often show how strongly the speaker feels.\n- Think about what the speaker wants to happen to these places."
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
