#!/usr/bin/env node
/**
 * DBE English FAL P2 — November 2024 — 'Hard to Find' by Sinesipo Jojo. 6.2.1–6.2.8, 17 marks.
 * Practice questions are fresh (DESIGN-UNI-01) and follow the shared rules: context_text null for literature (SETWORK-LES-05),
 * fresh targets, conventions-based for writing (LANG-WR-03); aiExplanation is one entry per REAL printed sub-question with its
 * real marks, derived from the memo in own words (AIEXP-08). Every fitb declares keyboard_type 'text' (LANG-KB-01).
 * Text key: hard_to_find.
 *
 * BASIS per practice question — BK book knowledge (verify against the text), P printed in the paper/poem, M memo,
 * PT vocabulary/title, C CAPS, P1 language-paper skill:
 *   Q1: P: 15 numbered lines.
 *   Q2: P: printed layout of the poem.
 *   Q3: P: lines 10–13 (interpretive — verify).
 *   Q4: P: lines 1, 3–4, 7–9, 14–15.
 *   Q5: P: Sinesipo Jojo.
 *
 *   node tools/validate-questions.js --script scripts/add-english-fal-2024-nov-p2-q12.js --curriculum temp/curriculum-vocab-english-fal.json
 *   node scripts/add-english-fal-2024-nov-p2-q12.js --dry-run
 *   node scripts/add-english-fal-2024-nov-p2-q12.js
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
  "name": "Question 6.2: 'Hard to Find'",
  "syllabus": "dbe",
  "subject": "english_fal",
  "year": 2024,
  "paper": "nov_p2",
  "order": 12,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "poetry_analysis",
    "poetic_devices",
    "imagery"
  ],
  "text_key": "hard_to_find",
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p2/q12/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p2/q12/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p2/q12/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p2/q12/memo_2.png"
  ],
  "exam_question_marks": 17,
  "supplementary_materials": [
    {
      "type": "annexure",
      "label": "Poem",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p2/q12/annexure_poem_2_1.png"
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
    "text_key": "hard_to_find",
    "order": 1,
    "context_text": null,
    "question": "How many lines does 'Hard to find' have? Write the number.",
    "metadata": [
      "Lines:",
      "[ ]"
    ],
    "answer": [
      "15",
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
    "clues": "- Count the numbers printed in the margin.\n- Write digits only.",
    "keyboard_type": "text"
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2024,
    "paper": "nov_p2",
    "name": "Question 2",
    "text_key": "hard_to_find",
    "order": 2,
    "context_text": null,
    "question": "How is 'Hard to find' written?",
    "metadata": [
      "a sonnet with a final couplet",
      "a ballad with regular rhyme",
      "a poem with four equal stanzas",
      "free verse: one stanza with no fixed rhyme scheme",
      ""
    ],
    "answer": [
      "free verse: one stanza with no fixed rhyme scheme",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "poetry",
    "topic": "structure_and_form",
    "subtopic": "poem_form",
    "skills": [
      "english_fal_identify_poem_structure"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "clues": "- Look at the line lengths and the end words.\n- There is no pattern of rhyme."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2024,
    "paper": "nov_p2",
    "name": "Question 3",
    "text_key": "hard_to_find",
    "order": 3,
    "context_text": null,
    "question": "What does the image of the speaker looking 'through the glass windows' suggest?",
    "metadata": [
      "The speaker feels shut out from life, watching it through a barrier.",
      "The speaker is happily walking in the rain.",
      "The speaker is repairing a window.",
      "The speaker is calling for help from a roof.",
      ""
    ],
    "answer": [
      "The speaker feels shut out from life, watching it through a barrier.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "poetry",
    "topic": "imagery",
    "subtopic": "window_and_rain_imagery",
    "skills": [
      "english_fal_explain_imagery"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "clues": "- Glass lets you see but not touch.\n- The mood is sad."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2024,
    "paper": "nov_p2",
    "name": "Question 4",
    "text_key": "hard_to_find",
    "order": 4,
    "context_text": null,
    "question": "Arrange these ideas from the poem in the order in which they appear.",
    "metadata": [
      "Words hide when the heart feels",
      "Words are everywhere",
      "The speaker hopes words will understand her heart",
      "Words fly out when we are provoked",
      ""
    ],
    "answer": [
      "Words are everywhere",
      "Words fly out when we are provoked",
      "Words hide when the heart feels",
      "The speaker hopes words will understand her heart",
      ""
    ],
    "presentation": "ordering",
    "type": "application",
    "unit": "poetry",
    "topic": "structure_and_form",
    "subtopic": "progression_of_ideas",
    "skills": [
      "english_fal_order_events"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "clues": "- The poem opens with a general statement.\n- The last idea is a hope."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2024,
    "paper": "nov_p2",
    "name": "Question 5",
    "text_key": "hard_to_find",
    "order": 5,
    "context_text": null,
    "question": "Who wrote 'Hard to find'? Write the surname.",
    "metadata": [
      "Surname:",
      "[ ]"
    ],
    "answer": [
      "Jojo",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "definition",
    "unit": "poetry",
    "topic": "poetic_devices",
    "subtopic": "text_information",
    "skills": [
      "english_fal_recall_key_events"
    ],
    "difficulty": 1,
    "exam_weight": 1,
    "clues": "- The poet's name is printed under the title.\n- Write one word.",
    "keyboard_type": "text"
  }
];

// ─── AI explanation — one entry per REAL printed sub-question, real marks (AIEXP-08) ───

const aiExplanation = {
  "sub_questions": [
    {
      "number": "6.2.1",
      "marks": 3,
      "clues": "- Think about whether words literally have wings.",
      "approach": "- Decide literal or figurative\n- Explain the meaning",
      "solution": "1. (a) Figuratively.\n2. (b) The words are uttered quickly without thought or consideration."
    },
    {
      "number": "6.2.2",
      "marks": 1,
      "clues": "- Think about the effect of being provoked.",
      "approach": "- Explain the phrase",
      "solution": "1. We are upset, angered or incited by someone or something."
    },
    {
      "number": "6.2.3",
      "marks": 2,
      "clues": "- Think about how someone sounds who cannot find words.",
      "approach": "- Name the tone\n- Say why",
      "solution": "1. The tone is frustrated or despondent.\n2. She feels helpless, unable to find the words to express her feelings."
    },
    {
      "number": "6.2.4",
      "marks": 3,
      "clues": "- Words are given a human action.",
      "approach": "- Name the figure\n- Explain it",
      "solution": "1. (a) Personification.\n2. (b) As a person does not want to be found, words too can be elusive."
    },
    {
      "number": "6.2.5",
      "marks": 2,
      "clues": "- Think about what the words do to people.",
      "approach": "- Give two points",
      "solution": "1. The words used are malicious or cruel.\n2. They cause pain or hurt."
    },
    {
      "number": "6.2.6",
      "marks": 1,
      "clues": "- Look at the repeated sound at the start of the words.",
      "approach": "- Identify the device",
      "solution": "1. 'Slowly slide' repeats 's': alliteration: B."
    },
    {
      "number": "6.2.7",
      "marks": 2,
      "clues": "- Think about what a cloudy lifetime suggests.",
      "approach": "- Name her state of mind\n- Support it",
      "solution": "1. The speaker is depressed or sad as she experiences a turbulent time."
    },
    {
      "number": "6.2.8",
      "marks": 3,
      "clues": "- Decide if the title suits the poem, then use lines.",
      "approach": "- State your view\n- Give evidence",
      "solution": "1. Yes: she struggles to find words for her innermost feelings and admits some things are hard to understand.\n2. No: the poem also says words are everywhere and fly out freely when we are angry."
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
