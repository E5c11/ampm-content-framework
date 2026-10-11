#!/usr/bin/env node
/**
 * DBE English FAL P2 — November 2024 — 'Triumph in the Face of Adversity' — Extract I (the narrator stands up for herself). 5.1.1–5.1.7, 18 marks.
 * Practice questions are fresh (DESIGN-UNI-01) and follow the shared rules: context_text null for literature (SETWORK-LES-05),
 * fresh targets, conventions-based for writing (LANG-WR-03); aiExplanation is one entry per REAL printed sub-question with its
 * real marks, derived from the memo in own words (AIEXP-08). Every fitb declares keyboard_type 'text' (LANG-KB-01).
 * Text key: triumph_in_the_face_of_adversity.
 *
 * BASIS per practice question — BK book knowledge (verify against the text), P printed in the paper/poem, M memo,
 * PT vocabulary/title, C CAPS, P1 language-paper skill:
 *   Q1: M: 2024 memo 5.1.2 — Mr Nkwane is Thulisile's teacher.
 *   Q2: M: 2025 memo 5.1.5 and 2024 memo 5.1.7 — a famous television presenter.
 *   Q3: M: 2025 memo 5.1.4/5.1.1; 2024 memo 5.1.2.
 *   Q4: P: the extract ends with 'I was poor … I didn't have pride'.
 *   Q5: PT: vocabulary.
 *
 *   node tools/validate-questions.js --script scripts/add-english-fal-2024-nov-p2-q9.js --curriculum temp/curriculum-vocab-english-fal.json
 *   node scripts/add-english-fal-2024-nov-p2-q9.js --dry-run
 *   node scripts/add-english-fal-2024-nov-p2-q9.js
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
  "name": "Question 5.1: 'Triumph in the Face of Adversity'",
  "syllabus": "dbe",
  "subject": "english_fal",
  "year": 2024,
  "paper": "nov_p2",
  "order": 9,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "literary_essay",
    "character_analysis",
    "irony"
  ],
  "text_key": "triumph_in_the_face_of_adversity",
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p2/q9/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p2/q9/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p2/q9/memo_2.png"
  ],
  "exam_question_marks": 18,
  "supplementary_materials": [
    {
      "type": "annexure",
      "label": "Extract I",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p2/q9/annexure_extract_i_1.png"
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
    "text_key": "triumph_in_the_face_of_adversity",
    "order": 1,
    "context_text": null,
    "question": "Who is Mr Nkwane in the story?",
    "metadata": [
      "Thulisile's teacher",
      "Thulisile's father",
      "a shopkeeper in the village",
      "a social worker",
      ""
    ],
    "answer": [
      "Thulisile's teacher",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "short_stories",
    "topic": "character_analysis",
    "subtopic": "characters_and_roles",
    "skills": [
      "english_fal_match_characters_to_roles"
    ],
    "difficulty": 1,
    "exam_weight": 1,
    "clues": "- She goes to speak to him at school.\n- He advises her about her studies."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2024,
    "paper": "nov_p2",
    "name": "Question 2",
    "text_key": "triumph_in_the_face_of_adversity",
    "order": 2,
    "context_text": null,
    "question": "What does Thulisile eventually become?",
    "metadata": [
      "a doctor",
      "a police officer",
      "a bus driver",
      "a television presenter",
      ""
    ],
    "answer": [
      "a television presenter",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "short_stories",
    "topic": "plot_structure",
    "subtopic": "closing_events",
    "skills": [
      "english_fal_recall_key_events"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- She is successful and well known in the end.\n- She works on screen."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2024,
    "paper": "nov_p2",
    "name": "Question 3",
    "text_key": "triumph_in_the_face_of_adversity",
    "order": 3,
    "context_text": null,
    "question": "Match each character from the story to the description that fits.",
    "metadata": [
      "A - Mme Sadike",
      "B - Mr Rathebe",
      "C - Mr Nkwane",
      "1 - owns a fish and chips shop",
      "2 - calls Thulisile in at school",
      "3 - comforts Thulisile and gives her bread"
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
    "unit": "short_stories",
    "topic": "character_analysis",
    "subtopic": "match_characters_to_roles",
    "skills": [
      "english_fal_match_characters_to_roles"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Think about who is a teacher and who owns a shop.\n- One woman helps Thulisile at her home."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2024,
    "paper": "nov_p2",
    "name": "Question 4",
    "text_key": "triumph_in_the_face_of_adversity",
    "order": 4,
    "context_text": null,
    "question": "Select the TWO ideas that are explored in the extract.",
    "metadata": [
      "poverty",
      "revenge",
      "pride",
      "magic",
      ""
    ],
    "answer": [
      "poverty",
      "pride",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "short_stories",
    "topic": "theme_identification",
    "subtopic": "themes_suggested_by_the_title",
    "skills": [
      "english_fal_identify_theme"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Think about what Thulisile says she has even though she has little.\n- Reject ideas that are not in the extract."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2024,
    "paper": "nov_p2",
    "name": "Question 5",
    "text_key": "triumph_in_the_face_of_adversity",
    "order": 5,
    "context_text": null,
    "question": "What does the word 'adversity' mean in the title?",
    "metadata": [
      "great success",
      "hardship or difficulty",
      "a happy holiday",
      "a school prize",
      ""
    ],
    "answer": [
      "hardship or difficulty",
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
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- The title pairs it with 'triumph'.\n- It is the opposite of an easy life."
  }
];

// ─── AI explanation — one entry per REAL printed sub-question, real marks (AIEXP-08) ───

const aiExplanation = {
  "sub_questions": [
    {
      "number": "5.1.1",
      "marks": 4,
      "clues": "- Recall each woman's role in the story.",
      "approach": "- Match what you know\n- Use the remaining descriptions",
      "solution": "1. MaDlamini is an old-fashioned woman.\n2. Nthabiseng is a thoughtful friend.\n3. Zanele is a younger sister.\n4. Thembekile is an abused daughter-in-law."
    },
    {
      "number": "5.1.2",
      "marks": 2,
      "clues": "- Think about why she is called in.",
      "approach": "- Say when\n- Say where",
      "solution": "1. It takes place after she fails a class test, when Mr Nkwane calls her in.\n2. It is in the staff room at school."
    },
    {
      "number": "5.1.3",
      "marks": 2,
      "clues": "- Think about her father and money.",
      "approach": "- Give two challenges",
      "solution": "1. Her father abuses her mother and siblings and drinks the little money.\n2. They have no food, live in a squatter camp or her mother does not protect the children (any two)."
    },
    {
      "number": "5.1.4",
      "marks": 2,
      "clues": "- Think about how she feels about his advice.",
      "approach": "- Say why she is upset",
      "solution": "1. She is upset or humiliated because Mr Nkwane does not seem to understand her situation."
    },
    {
      "number": "5.1.5",
      "marks": 2,
      "clues": "- Irony: what she says versus what she does.",
      "approach": "- State the wish\n- State what she does",
      "solution": "1. She says she does not want the school's pity.\n2. Yet she goes begging door to door in her neighbourhood."
    },
    {
      "number": "5.1.6",
      "marks": 3,
      "clues": "- Think about who shows kindness.",
      "approach": "- Define kindness\n- Give examples",
      "solution": "1. Mme Sadike gives hope and bread.\n2. Her grandmother lends money without expecting repayment.\n3. Mr Rathebe gives her a job and leftovers."
    },
    {
      "number": "5.1.7",
      "marks": 3,
      "clues": "- Decide whether she is a good role model, then use events.",
      "approach": "- State your view\n- Give evidence",
      "solution": "1. Yes: she saves her school lunch for her siblings, starts a sweets business and becomes a famous presenter.\n2. No: she is jealous of Ntombi, questions her mother and ignores Mr Nkwane's advice."
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
