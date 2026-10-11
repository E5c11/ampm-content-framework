#!/usr/bin/env node
/**
 * DBE English FAL P1 — November 2024 — Question 3: Analysing an Advertisement (order 3) — TEXT D Sinutab nasal spray advertisement. Practice uses fresh written ad copy on a similar theme (comfort/health); text-extractable sub-questions only (LANG-SEC-03).
 * Practice questions are fresh (DESIGN-UNI-01) and follow the shared rules: context_text null for literature (SETWORK-LES-05),
 * fresh targets, conventions-based for writing (LANG-WR-03); aiExplanation is one entry per REAL printed sub-question with its
 * real marks, derived from the memo in own words (AIEXP-08). Every fitb declares keyboard_type 'text' (LANG-KB-01).
 * Text key: none (language / writing paper).
 *
 * BASIS per practice question — BK book knowledge (verify against the text), P printed in the paper/poem, M memo,
 * PT vocabulary/title, C CAPS, P1 language-paper skill:
 *   Q1: P1: appeal to a need
 *   Q2: P1: possessive address
 *   Q3: P1: synonym
 *   Q4: P1: purpose of visuals
 *
 *   node tools/validate-questions.js --script scripts/add-english-fal-2024-nov-p1-q3.js --curriculum temp/curriculum-vocab-english-fal.json
 *   node scripts/add-english-fal-2024-nov-p1-q3.js --dry-run
 *   node scripts/add-english-fal-2024-nov-p1-q3.js
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
  "name": "Question 3: Analysing an Advertisement",
  "syllabus": "dbe",
  "subject": "english_fal",
  "year": 2024,
  "paper": "nov_p1",
  "order": 3,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "advertising",
    "advertising_language",
    "media_analysis"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p1/q3/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p1/q3/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p1/q3/memo_2.png"
  ],
  "exam_question_marks": 10,
  "supplementary_materials": [
    {
      "type": "annexure",
      "label": "Text D",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p1/q3/annexure_text_d_1.png",
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p1/q3/annexure_text_d_2.png"
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
    "context_text": "FRESHFIT trainers. Feel light. Run far. Your comfort, your way. For tired, aching feet after a long day.",
    "question": "Which need does the advertiser mainly appeal to?",
    "metadata": [
      "the need to save money",
      "the need to travel",
      "the need for entertainment",
      "the need for comfortable feet",
      ""
    ],
    "answer": [
      "the need for comfortable feet",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "visual_texts",
    "topic": "advertising_language",
    "subtopic": "appeal_to_need",
    "skills": [
      "english_fal_identify_need_appealed_to"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Think about what the product is for and which problem it solves.\n- Read the last line of the copy."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2024,
    "paper": "nov_p1",
    "name": "Question 2",
    "order": 2,
    "context_text": "FRESHFIT trainers. Feel light. Run far. Your comfort, your way. For tired, aching feet after a long day.",
    "question": "What is the advertiser's intention in using the word 'your' in 'Your comfort, your way'?",
    "metadata": [
      "To show that the writer owns the shoes.",
      "To speak directly to the reader and personalise the message.",
      "To make the words rhyme.",
      "To show that the shoes are cheap.",
      ""
    ],
    "answer": [
      "To speak directly to the reader and personalise the message.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "visual_texts",
    "topic": "advertising_language",
    "subtopic": "persuasive_devices",
    "skills": [
      "english_fal_identify_persuasive_devices"
    ],
    "difficulty": 2,
    "exam_weight": 3,
    "clues": "- Think about who the word 'your' refers to.\n- Advertisers often talk to one reader."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2024,
    "paper": "nov_p1",
    "name": "Question 3",
    "order": 3,
    "context_text": null,
    "question": "Provide a synonym for the word 'tired' in: For tired feet, wear FreshFit.",
    "metadata": [
      "Word:",
      "[ ]"
    ],
    "answer": [
      "weary|exhausted",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "definition",
    "unit": "language",
    "topic": "word_level_vocabulary",
    "subtopic": "synonym_in_context",
    "skills": [
      "english_fal_find_synonym_in_text"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Think of a word you could use instead of 'tired' that means the same.\n- Write one word.",
    "keyboard_type": "text"
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2024,
    "paper": "nov_p1",
    "name": "Question 4",
    "order": 4,
    "context_text": "FRESHFIT trainers. Feel light. Run far. Your comfort, your way. For tired, aching feet after a long day.",
    "question": "Select the TWO reasons why an advertiser includes a picture of the product and a smiling runner.",
    "metadata": [
      "It shows what the shoe looks like.",
      "It lists the price of every shoe.",
      "A smiling runner captures the reader's attention.",
      "It shows where the shoes are made.",
      "It gives the shop's opening hours."
    ],
    "answer": [
      "It shows what the shoe looks like.",
      "A smiling runner captures the reader's attention.",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "visual_texts",
    "topic": "advertising_language",
    "subtopic": "persuasive_devices",
    "skills": [
      "english_fal_identify_persuasive_devices"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "clues": "- Think about what a picture adds that words cannot.\n- Reject reasons that the picture cannot give."
  }
];

// ─── AI explanation — one entry per REAL printed sub-question, real marks (AIEXP-08) ───

const aiExplanation = {
  "sub_questions": [
    {
      "number": "3.1",
      "marks": 1,
      "clues": "- Think about what the symbol next to a brand name tells the buyer.",
      "approach": "- Recall the meaning of the ® symbol\n- Choose the best option",
      "solution": "1. The ® symbol shows the name is a registered trademark, so the answer is C.\n2. 'Recorded', 'renewing' and 'recovering' are not what ® stands for."
    },
    {
      "number": "3.2.1",
      "marks": 1,
      "clues": "- Look at the headline and the problem it names.",
      "approach": "- Find the problem\n- Name the need",
      "solution": "1. The advertiser appeals to the need to be free from nasal discomfort or congestion."
    },
    {
      "number": "3.2.2",
      "marks": 2,
      "clues": "- Think about who 'yourself' refers to.",
      "approach": "- Say who the word speaks to\n- Say what it suggests",
      "solution": "1. It speaks directly to the target audience and personalises the message.\n2. It shows that you can treat yourself (self-medicate)."
    },
    {
      "number": "3.3",
      "marks": 2,
      "clues": "- Think about what a picture of the product shows.",
      "approach": "- Give two reasons\n- Link each to the reader",
      "solution": "1. It shows how the product looks and that it is a nasal spray.\n2. The picture of the face on the box captures attention (any two)."
    },
    {
      "number": "3.4",
      "marks": 1,
      "clues": "- Find two words next to each other that say how the product is used.",
      "approach": "- Scan the packaging text\n- Quote two consecutive words",
      "solution": "1. The words are 'Nasal spray'."
    },
    {
      "number": "3.5",
      "marks": 1,
      "clues": "- Think of another word for 'blocked'.",
      "approach": "- Understand the underlined word\n- Choose a synonym that fits",
      "solution": "1. 'Blocked' means closed up; synonyms are 'congested' or 'clogged'."
    },
    {
      "number": "3.6",
      "marks": 2,
      "clues": "- Decide whether the curved arrow helps the message, then give a reason.",
      "approach": "- State your view\n- Refer to the arrow and the number",
      "solution": "1. Yes: the curved arrow and the number 2 look like a clock, showing the product works in 2 minutes and lasts for 10 hours.\n2. No: the link between the arrow, the number and the message is unclear.\n3. A bare yes or no earns no mark."
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
