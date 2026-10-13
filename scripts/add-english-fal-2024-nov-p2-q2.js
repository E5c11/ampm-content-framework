#!/usr/bin/env node
/**
 * DBE English FAL P2 — November 2024 — Cry, the Beloved Country — Extract B (James Jarvis in mourning, Book 2 Ch. 3). 1.2.1–1.2.7, 17 marks.
 * Practice questions are fresh (DESIGN-UNI-01) and follow the shared rules: context_text null for literature (SETWORK-LES-05),
 * fresh targets, conventions-based for writing (LANG-WR-03); aiExplanation is one entry per REAL printed sub-question with its
 * real marks, derived from the memo in own words (AIEXP-08). Every fitb declares keyboard_type 'text' (LANG-KB-01).
 * Text key: cry_the_beloved_country.
 *
 * BASIS per practice question — BK book knowledge (verify against the text), P printed in the paper/poem, M memo,
 * PT vocabulary/title, C CAPS, P1 language-paper skill:
 *   Q1: M: 2025 memo 1.1.1 — James Jarvis arranges for the dam to be built.
 *   Q2: M: Arthur Jarvis is James Jarvis's son (2024 memo 1.2.1).
 *   Q3: BK: Ndotsheni, Johannesburg and Sophiatown (Mrs Lithebe's home). Verify the Sophiatown detail.
 *   Q4: BK/M: Arthur Jarvis is killed (James Jarvis); Absalom is sentenced to death (Kumalo).
 *   Q5: BK/M: broad order; the writings are read in Johannesburg (Extract B setting).
 *
 *   node tools/validate-questions.js --script scripts/add-english-fal-2024-nov-p2-q2.js --curriculum temp/curriculum-vocab-english-fal.json
 *   node scripts/add-english-fal-2024-nov-p2-q2.js --dry-run
 *   node scripts/add-english-fal-2024-nov-p2-q2.js
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
  "name": "Question 1.2: Cry, the Beloved Country",
  "syllabus": "dbe",
  "subject": "english_fal",
  "year": 2024,
  "paper": "nov_p2",
  "order": 2,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "literary_essay",
    "character_analysis",
    "thematic_analysis"
  ],
  "text_key": "cry_the_beloved_country",
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p2/q2/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p2/q2/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p2/q2/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p2/q2/memo_2.png"
  ],
  "exam_question_marks": 17,
  "supplementary_materials": [
    {
      "type": "annexure",
      "label": "Extract B",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p2/q2/annexure_extract_b_1.png"
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
    "text_key": "cry_the_beloved_country",
    "order": 1,
    "context_text": null,
    "question": "How does James Jarvis help the people of Ndotsheni?",
    "metadata": [
      "He moves his family permanently to Johannesburg.",
      "He arranges for a dam to be built to help the village.",
      "He sells his farm and leaves the country.",
      "He opens a bank in Ndotsheni.",
      ""
    ],
    "answer": [
      "He arranges for a dam to be built to help the village.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "novel",
    "topic": "plot_structure",
    "subtopic": "hope_for_ndotsheni",
    "skills": [
      "english_fal_recall_key_events"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Think about the great need of the valley in the hills.\n- Water is scarce there."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2024,
    "paper": "nov_p2",
    "name": "Question 2",
    "text_key": "cry_the_beloved_country",
    "order": 2,
    "context_text": null,
    "question": "What is the name of James Jarvis's son, who is murdered? Write his first name.",
    "metadata": [
      "Name:",
      "[ ]"
    ],
    "answer": [
      "Arthur|Arthur Jarvis",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "definition",
    "unit": "novel",
    "topic": "character_analysis",
    "subtopic": "family_relationships",
    "skills": [
      "english_fal_recall_key_events"
    ],
    "difficulty": 1,
    "exam_weight": 1,
    "clues": "- He is a white man who works for justice in Johannesburg.\n- Write his first name.",
    "keyboard_type": "text"
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2024,
    "paper": "nov_p2",
    "name": "Question 3",
    "text_key": "cry_the_beloved_country",
    "order": 3,
    "context_text": null,
    "question": "Match each place in the novel to its description.",
    "metadata": [
      "A - Ndotsheni",
      "B - Johannesburg",
      "C - Sophiatown",
      "1 - the big city with its crime and gold",
      "2 - the area where Mrs Lithebe lives",
      "3 - a village in the hills where Kumalo is a priest"
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
    "unit": "novel",
    "topic": "setting_and_atmosphere",
    "subtopic": "places_in_the_novel",
    "skills": [
      "english_fal_identify_setting"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Think about the village and the city first.\n- One place is a suburb of Johannesburg."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2024,
    "paper": "nov_p2",
    "name": "Question 4",
    "text_key": "cry_the_beloved_country",
    "order": 4,
    "context_text": null,
    "question": "Select the TWO characters who each lose a son in the novel.",
    "metadata": [
      "Stephen Kumalo",
      "Msimangu",
      "James Jarvis",
      "John Kumalo",
      "Mrs Lithebe"
    ],
    "answer": [
      "Stephen Kumalo",
      "James Jarvis",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "novel",
    "topic": "theme_identification",
    "subtopic": "themes_of_the_novel",
    "skills": [
      "english_fal_identify_theme_evidence"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- One son is murdered and one son is hanged.\n- The fathers meet again at the end of the story."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2024,
    "paper": "nov_p2",
    "name": "Question 5",
    "text_key": "cry_the_beloved_country",
    "order": 5,
    "context_text": null,
    "question": "Arrange these events in James Jarvis's story in the order in which they happen.",
    "metadata": [
      "James Jarvis helps Ndotsheni",
      "James Jarvis learns of his son's murder",
      "James Jarvis reads his son's books and writings",
      "James Jarvis travels to Johannesburg",
      ""
    ],
    "answer": [
      "James Jarvis learns of his son's murder",
      "James Jarvis travels to Johannesburg",
      "James Jarvis reads his son's books and writings",
      "James Jarvis helps Ndotsheni",
      ""
    ],
    "presentation": "ordering",
    "type": "application",
    "unit": "novel",
    "topic": "plot_structure",
    "subtopic": "sequence_of_events",
    "skills": [
      "english_fal_order_events"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "clues": "- He cannot read his son's writings before he arrives in the city.\n- His help for the village comes last."
  }
];

// ─── AI explanation — one entry per REAL printed sub-question, real marks (AIEXP-08) ───

const aiExplanation = {
  "sub_questions": [
    {
      "number": "1.2.1",
      "marks": 2,
      "clues": "- Think about what James Jarvis is looking at in the study.",
      "approach": "- Say what happens\n- Give the place",
      "solution": "1. It takes place when James Jarvis discovers the large number of books and papers.\n2. He is in Arthur's study or home."
    },
    {
      "number": "1.2.2",
      "marks": 1,
      "clues": "- Think about what the book was about.",
      "approach": "- Say why he takes it",
      "solution": "1. He wanted to read more about the Gettysburg speech, Abraham Lincoln or his son."
    },
    {
      "number": "1.2.3",
      "marks": 1,
      "clues": "- Think about the stain on the floor of the passage.",
      "approach": "- Use the context\n- Choose the best option",
      "solution": "1. The 'dark stain' is blood: B."
    },
    {
      "number": "1.2.4",
      "marks": 4,
      "clues": "- Look at how the memory comes unasked.",
      "approach": "- Name his state of mind\n- Say what the boy later does",
      "solution": "1. (a) Jarvis is nostalgic; the memory of his son's childhood comes to mind unasked.\n2. (b) 'The small boy', Arthur, runs a boys' club in Claremont and fights for justice for black South Africans."
    },
    {
      "number": "1.2.5",
      "marks": 3,
      "clues": "- Death is given a human action.",
      "approach": "- Name the figure of speech\n- Explain it",
      "solution": "1. (a) Personification.\n2. (b) As death rushes through a door like a person, Arthur's sudden death is emphasised."
    },
    {
      "number": "1.2.6",
      "marks": 3,
      "clues": "- Think about who feels regret in the novel.",
      "approach": "- Define the theme\n- Give two or three examples",
      "solution": "1. James Jarvis regrets not getting to know his adult son better.\n2. Gertrude regrets falling into disrepute.\n3. Absalom regrets joining the cousin and friend who abandon him in court."
    },
    {
      "number": "1.2.7",
      "marks": 3,
      "clues": "- Decide whether Absalom is to blame, then use events.",
      "approach": "- State your view\n- Give evidence",
      "solution": "1. Yes: he leaves a stable factory job, joins a bad crowd and carries the gun.\n2. No: he is timid, manipulated by his cousin and friend, unprepared for the city and away from his parents."
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
