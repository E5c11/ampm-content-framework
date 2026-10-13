#!/usr/bin/env node
/**
 * DBE English FAL P2 — November 2025 — 'Eveline' — Extract J (Eveline at the North Wall, hesitating). 5.2.1–5.2.9, 18 marks.
 * Practice questions follow the HL Paper 2 pattern: context_text null, FRESH targets from elsewhere in the text, never the
 * exam's own statements or the memo's answers (DESIGN-UNI-01); they carry text_key "eveline" on lesson and every
 * question (SETWORK-LES-01). aiExplanation: one entry per REAL exam sub-question with its real marks, derived from the
 * memo in own words (AIEXP-08). Every fitb declares keyboard_type 'text' (LANG-KB-01).
 *
 * FACTUAL BASIS per practice question — BK = book knowledge (verify against the text), P = printed in the exam paper's
 * extract/poem, M = established by the memo, PT = vocabulary/title meaning:
 *   Q1: BK: Eveline lives in Dublin; the story is from Joyce's Dubliners.
 *   Q2: BK: 'Eveline' is from Dubliners (1914).
 *   Q3: BK: Ernest is dead; Harry works away. Verify.
 *   Q4: BK: paralysis and escape are the standard readings.
 *   Q5: BK + P: closing sequence as in the story's ending (Extract J covers the call and the railing).
 *
 *   node tools/validate-questions.js --script scripts/add-english-fal-2025-nov-p2-q10.js --curriculum temp/curriculum-vocab-english-fal.json
 *   node scripts/add-english-fal-2025-nov-p2-q10.js --dry-run
 *   node scripts/add-english-fal-2025-nov-p2-q10.js
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
  "name": "Question 5.2: 'Eveline'",
  "syllabus": "dbe",
  "subject": "english_fal",
  "year": 2025,
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
  "text_key": "eveline",
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p2/q10/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p2/q10/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p2/q10/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p2/q10/memo_2.png"
  ],
  "exam_question_marks": 18,
  "supplementary_materials": [
    {
      "type": "annexure",
      "label": "Extract J",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p2/q10/annexure_extract_j_1.png"
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
    "text_key": "eveline",
    "order": 1,
    "context_text": null,
    "question": "In which city does Eveline live? Write one word.",
    "metadata": [
      "City:",
      "[ ]"
    ],
    "answer": [
      "Dublin",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "definition",
    "unit": "short_stories",
    "topic": "narrative_voice_and_setting",
    "subtopic": "setting_of_the_story",
    "skills": [
      "english_fal_identify_setting"
    ],
    "difficulty": 1,
    "exam_weight": 1,
    "clues": "- Joyce's collection of stories is named after the people of this city.\n- Write one word.",
    "keyboard_type": "text"
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Question 2",
    "text_key": "eveline",
    "order": 2,
    "context_text": null,
    "question": "'Eveline' is a story in which collection by James Joyce? Write one word.",
    "metadata": [
      "Collection:",
      "[ ]"
    ],
    "answer": [
      "Dubliners",
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
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- The title is the name for people from a certain city.\n- Write one word.",
    "keyboard_type": "text"
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Question 3",
    "text_key": "eveline",
    "order": 3,
    "context_text": null,
    "question": "What has happened to Eveline's brother Ernest?",
    "metadata": [
      "He has become a sailor.",
      "He has died.",
      "He has moved to Buenos Ayres.",
      "He has become a priest.",
      ""
    ],
    "answer": [
      "He has died.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "short_stories",
    "topic": "plot_structure",
    "subtopic": "eveline_family",
    "skills": [
      "english_fal_recall_key_events"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Eveline remembers him when she thinks of her family.\n- One of her brothers is no longer alive."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Question 4",
    "text_key": "eveline",
    "order": 4,
    "context_text": null,
    "question": "Select the TWO themes that are explored in the story.",
    "metadata": [
      "paralysis (being unable to act)",
      "revenge",
      "escape",
      "ambition for wealth",
      ""
    ],
    "answer": [
      "paralysis (being unable to act)",
      "escape",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "short_stories",
    "topic": "theme_identification",
    "subtopic": "themes_of_the_story",
    "skills": [
      "english_fal_identify_theme"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Think about what Eveline wants and what stops her from acting.\n- Reject themes that do not appear in the story."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Question 5",
    "text_key": "eveline",
    "order": 5,
    "context_text": null,
    "question": "Arrange these events from the end of the story in the order in which they happen.",
    "metadata": [
      "Eveline grips the railing",
      "Eveline remembers her promise to her mother",
      "Eveline lets Frank go on alone",
      "Frank urges her to board",
      ""
    ],
    "answer": [
      "Eveline remembers her promise to her mother",
      "Frank urges her to board",
      "Eveline grips the railing",
      "Eveline lets Frank go on alone",
      ""
    ],
    "presentation": "ordering",
    "type": "application",
    "unit": "short_stories",
    "topic": "plot_structure",
    "subtopic": "sequence_of_events",
    "skills": [
      "english_fal_order_events"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "clues": "- Her memory comes before Frank's call.\n- The last event is what Frank does alone."
  }
];

// ─── AI explanation — one entry per REAL exam sub-question, real marks (AIEXP-08) ───

const aiExplanation = {
  "sub_questions": [
    {
      "number": "5.2.1",
      "marks": 1,
      "clues": "- Think about what makes Eveline's home life hard.\n- Check each option against the story.",
      "approach": "- Recall Frank's role\n- Choose what he saves her from",
      "solution": "1. Frank would save her from her father's verbal abuse, so the answer is A."
    },
    {
      "number": "5.2.2",
      "marks": 2,
      "clues": "- Look at what she asks God to do.\n- Think about her uncertainty.",
      "approach": "- Name the state of mind\n- Give the reason",
      "solution": "1. Eveline is conflicted, anxious or distressed.\n2. She calls on God for guidance on whether to stay with her family or leave with Frank."
    },
    {
      "number": "5.2.3",
      "marks": 3,
      "clues": "- A whistle is given a human quality.\n- Link it to how Eveline feels about leaving.",
      "approach": "- Name the figure of speech\n- Explain it",
      "solution": "1. Personification or alliteration.\n2. The whistle's mournful sound emphasises Eveline's sadness about leaving the familiar behind."
    },
    {
      "number": "5.2.4",
      "marks": 2,
      "clues": "- Think about how Frank sounds when he sees Eveline hesitate.\n- He wants her to follow.",
      "approach": "- Name the tone\n- Give the reason",
      "solution": "1. The tone is persuasive, commanding or desperate.\n2. Frank sees Eveline is hesitant and pleads or orders her to board."
    },
    {
      "number": "5.2.5",
      "marks": 1,
      "clues": "- Recall the pet name Frank uses for her.\n- Write the name.",
      "approach": "- Recall the story\n- State the name",
      "solution": "1. Frank calls her Poppens or Evvy."
    },
    {
      "number": "5.2.6",
      "marks": 2,
      "clues": "- Think about a promise from her past.\n- Link it to her family.",
      "approach": "- State the promise\n- Link it to leaving",
      "solution": "1. She holds on to the promise she made to her mother to keep the family together as long as she can."
    },
    {
      "number": "5.2.7",
      "marks": 1,
      "clues": "- Think about her workplace and who corrects her there.\n- Replace the underlined word.",
      "approach": "- Find the wrong name\n- Replace it",
      "solution": "1. It is Miss Gavan, not Miss Hill, who reprimands Eveline."
    },
    {
      "number": "5.2.8",
      "marks": 3,
      "clues": "- Think about what freedom means for Eveline.\n- Use two or three events.",
      "approach": "- Define freedom\n- Give examples",
      "solution": "1. Frank offers freedom through Buenos Ayres and marriage.\n2. She could be free from disputes with her father.\n3. She sacrifices that freedom when she decides not to leave."
    },
    {
      "number": "5.2.9",
      "marks": 3,
      "clues": "- Decide your view of Frank, then support it with events.\n- A bare yes or no earns nothing.",
      "approach": "- State your view\n- Give evidence",
      "solution": "1. Yes: Frank brings stories of faraway places, music and culture and wants to take her to Buenos Ayres.\n2. No: he does not stand up to her father, does not persuade her to leave and does not fully prove his love."
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
