#!/usr/bin/env node
/**
 * DBE English FAL P2 — November 2024 — 'The Wind and a Boy' — Extract J (Friedman's third phase). 5.2.1–5.2.9, 17 marks.
 * Practice questions are fresh (DESIGN-UNI-01) and follow the shared rules: context_text null for literature (SETWORK-LES-05),
 * fresh targets, conventions-based for writing (LANG-WR-03); aiExplanation is one entry per REAL printed sub-question with its
 * real marks, derived from the memo in own words (AIEXP-08). Every fitb declares keyboard_type 'text' (LANG-KB-01).
 * Text key: the_wind_and_a_boy.
 *
 * BASIS per practice question — BK book knowledge (verify against the text), P printed in the paper/poem, M memo,
 * PT vocabulary/title, C CAPS, P1 language-paper skill:
 *   Q1: P: Bessie Head is printed in the 2024 paper.
 *   Q2: P/M: extract and 2024 memo 5.2.8.
 *   Q3: P: extract J lines 11–14.
 *   Q4: PT: vocabulary from the extract.
 *
 *   node tools/validate-questions.js --script scripts/add-english-fal-2024-nov-p2-q10.js --curriculum temp/curriculum-vocab-english-fal.json
 *   node scripts/add-english-fal-2024-nov-p2-q10.js --dry-run
 *   node scripts/add-english-fal-2024-nov-p2-q10.js
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
  "name": "Question 5.2: 'The Wind and a Boy'",
  "syllabus": "dbe",
  "subject": "english_fal",
  "year": 2024,
  "paper": "nov_p2",
  "order": 10,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "literary_essay",
    "character_analysis",
    "figurative_language"
  ],
  "text_key": "the_wind_and_a_boy",
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p2/q10/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p2/q10/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p2/q10/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p2/q10/memo_2.png"
  ],
  "exam_question_marks": 17,
  "supplementary_materials": [
    {
      "type": "annexure",
      "label": "Extract J",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p2/q10/annexure_extract_j_1.png"
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
    "paper": "nov_p2",
    "name": "Question 1",
    "text_key": "the_wind_and_a_boy",
    "order": 1,
    "context_text": null,
    "question": "Who wrote 'The Wind and a Boy'? Write the surname.",
    "metadata": [
      "Surname:",
      "[ ]"
    ],
    "answer": [
      "Head",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "definition",
    "unit": "short_stories",
    "topic": "plot_structure",
    "subtopic": "text_information",
    "skills": [
      "english_fal_recall_key_events"
    ],
    "difficulty": 1,
    "exam_weight": 1,
    "clues": "- The author is printed under the title in the paper.\n- Write one word.",
    "keyboard_type": "text"
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2024,
    "paper": "nov_p2",
    "name": "Question 2",
    "text_key": "the_wind_and_a_boy",
    "order": 2,
    "context_text": null,
    "question": "What is the relationship between Sejosenye and Friedman?",
    "metadata": [
      "Sejosenye is Friedman's teacher.",
      "Sejosenye is Friedman's sister.",
      "Sejosenye is Friedman's grandmother.",
      "Sejosenye is a stranger who visits the village.",
      ""
    ],
    "answer": [
      "Sejosenye is Friedman's grandmother.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "short_stories",
    "topic": "character_analysis",
    "subtopic": "family_relationships",
    "skills": [
      "english_fal_match_characters_to_roles"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- The extract says Friedman is 'like the grandmother'.\n- Her daughter is his mother."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2024,
    "paper": "nov_p2",
    "name": "Question 3",
    "text_key": "the_wind_and_a_boy",
    "order": 3,
    "context_text": null,
    "question": "Select the TWO things that the extract tells us about Sejosenye's past.",
    "metadata": [
      "She left her own ward to live with a married man.",
      "She was sent away from the country.",
      "She won him from his wife and married him.",
      "She became the village chief.",
      ""
    ],
    "answer": [
      "She left her own ward to live with a married man.",
      "She won him from his wife and married him.",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "short_stories",
    "topic": "character_analysis",
    "subtopic": "backstory_in_the_extract",
    "skills": [
      "english_fal_identify_stated_reasons"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Look at the sentences about Ga-Sefete-Molemo ward.\n- Reject claims that the extract does not make."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2024,
    "paper": "nov_p2",
    "name": "Question 4",
    "text_key": "the_wind_and_a_boy",
    "order": 4,
    "context_text": null,
    "question": "What does the word 'scandalised' mean in 'Sejosenye had scandalised the whole village'?",
    "metadata": [
      "pleased the village with her kindness",
      "frightened the village with a loud noise",
      "taught the village a new song",
      "shocked the village by behaving in a way people thought improper",
      ""
    ],
    "answer": [
      "shocked the village by behaving in a way people thought improper",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "short_stories",
    "topic": "figurative_language",
    "subtopic": "word_meaning_in_context",
    "skills": [
      "english_fal_explain_word_in_context"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "clues": "- The village reacts to something she did.\n- A scandal is something shocking."
  }
];

// ─── AI explanation — one entry per REAL printed sub-question, real marks (AIEXP-08) ───

const aiExplanation = {
  "sub_questions": [
    {
      "number": "5.2.1",
      "marks": 2,
      "clues": "- Look at how she answers about Friedman.",
      "approach": "- Name her state of mind\n- Support it",
      "solution": "1. Sejosenye is content, as she does not see Friedman as a burden as the others do."
    },
    {
      "number": "5.2.2",
      "marks": 1,
      "clues": "- Think about who laughs at him.",
      "approach": "- Say who 'they' are",
      "solution": "1. 'They' are the villagers, the people of the ward or the women."
    },
    {
      "number": "5.2.3",
      "marks": 1,
      "clues": "- The second phase comes before the third.",
      "approach": "- Use the context\n- Choose",
      "solution": "1. Friedman was a toddler in his second phase: A."
    },
    {
      "number": "5.2.4",
      "marks": 3,
      "clues": "- The boy's movement is compared to an animal.",
      "approach": "- Name the figure\n- Explain it",
      "solution": "1. (a) Simile.\n2. (b) As a cobra's movement signals danger, his movements show he is about to commit naughty acts."
    },
    {
      "number": "5.2.5",
      "marks": 2,
      "clues": "- Think about how the narrator feels about the wire cars.",
      "approach": "- Name the tone\n- Say why",
      "solution": "1. The tone is admiring or approving.\n2. The narrator is impressed by his talent and innovation."
    },
    {
      "number": "5.2.6",
      "marks": 2,
      "clues": "- Think about the foreign doctor.",
      "approach": "- Give the source of the name",
      "solution": "1. He is named after a foreign doctor called Dr Friedman.\n2. The doctor was friendly to her and admired her commitment to the unborn baby."
    },
    {
      "number": "5.2.7",
      "marks": 2,
      "clues": "- Look at how she sails through the village.",
      "approach": "- Name a trait\n- Support it",
      "solution": "1. Sejosenye is confident or proud as she lives with no regrets and is not troubled by what villagers think."
    },
    {
      "number": "5.2.8",
      "marks": 1,
      "clues": "- Replace the wrong daughter.",
      "approach": "- Find the wrong word",
      "solution": "1. Friedman is the son of Sejosenye's youngest or last-born daughter."
    },
    {
      "number": "5.2.9",
      "marks": 3,
      "clues": "- Decide whether his childhood is wonderful, then use events.",
      "approach": "- State your view\n- Give evidence",
      "solution": "1. Yes: he can play, explore and is the only child in the village with a bicycle.\n2. No: he does not experience his mother's love, has many errands and dies tragically young."
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
