#!/usr/bin/env node
/**
 * DBE English FAL P2 — November 2024 — Strange Case of Dr Jekyll and Mr Hyde — Extract C ('Search for Mr Hyde'). 2.1.1–2.1.6, 18 marks.
 * Practice questions are fresh (DESIGN-UNI-01) and follow the shared rules: context_text null for literature (SETWORK-LES-05),
 * fresh targets, conventions-based for writing (LANG-WR-03); aiExplanation is one entry per REAL printed sub-question with its
 * real marks, derived from the memo in own words (AIEXP-08). Every fitb declares keyboard_type 'text' (LANG-KB-01).
 * Text key: strange_case_of_dr_jekyll_and_mr_hyde.
 *
 * BASIS per practice question — BK book knowledge (verify against the text), P printed in the paper/poem, M memo,
 * PT vocabulary/title, C CAPS, P1 language-paper skill:
 *   Q1: M: 2024 memo 2.1.5 — the cheque paid to the trampled girl's family is signed by Jekyll.
 *   Q2: P: Utterson is called 'the lawyer' in the extract.
 *   Q3: M: Mr Guest and the handwriting are in 2024 memo 2.1.6; Poole is Jekyll's servant (2025 memo 2.2.5).
 *   Q4: P/BK: chapter titles printed in the 2024 and 2025 papers; order as in the novel.
 *   Q5: P/M: the trampling (2025 Extract C) and the Carew murder (2025 memo 2.2.5).
 *
 *   node tools/validate-questions.js --script scripts/add-english-fal-2024-nov-p2-q3.js --curriculum temp/curriculum-vocab-english-fal.json
 *   node scripts/add-english-fal-2024-nov-p2-q3.js --dry-run
 *   node scripts/add-english-fal-2024-nov-p2-q3.js
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
  "name": "Question 2.1: Strange Case of Dr Jekyll and Mr Hyde",
  "syllabus": "dbe",
  "subject": "english_fal",
  "year": 2024,
  "paper": "nov_p2",
  "order": 3,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "literary_essay",
    "character_analysis",
    "figurative_language"
  ],
  "text_key": "strange_case_of_dr_jekyll_and_mr_hyde",
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p2/q3/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p2/q3/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p2/q3/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p2/q3/memo_2.png"
  ],
  "exam_question_marks": 18,
  "supplementary_materials": [
    {
      "type": "annexure",
      "label": "Extract C",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p2/q3/annexure_extract_c_1.png"
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
    "text_key": "strange_case_of_dr_jekyll_and_mr_hyde",
    "order": 1,
    "context_text": null,
    "question": "Which story does Mr Enfield tell Mr Utterson?",
    "metadata": [
      "A servant steals a bottle from a laboratory.",
      "A doctor refuses to attend a dying patient.",
      "A lawyer is tricked by a stranger at a station.",
      "A man tramples a child in the street and pays her family with a cheque.",
      ""
    ],
    "answer": [
      "A man tramples a child in the street and pays her family with a cheque.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "novel",
    "topic": "plot_structure",
    "subtopic": "key_events",
    "skills": [
      "english_fal_recall_key_events"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- It is told on a Sunday walk and is about the door.\n- A child is hurt in it."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2024,
    "paper": "nov_p2",
    "name": "Question 2",
    "text_key": "strange_case_of_dr_jekyll_and_mr_hyde",
    "order": 2,
    "context_text": null,
    "question": "What is Mr Utterson's profession? Write one word.",
    "metadata": [
      "Profession:",
      "[ ]"
    ],
    "answer": [
      "lawyer",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "definition",
    "unit": "novel",
    "topic": "character_analysis",
    "subtopic": "character_from_words",
    "skills": [
      "english_fal_recall_key_events"
    ],
    "difficulty": 1,
    "exam_weight": 1,
    "clues": "- He deals with wills and legal papers.\n- Write one word.",
    "keyboard_type": "text"
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2024,
    "paper": "nov_p2",
    "name": "Question 3",
    "text_key": "strange_case_of_dr_jekyll_and_mr_hyde",
    "order": 3,
    "context_text": null,
    "question": "Match each character from the novel to the description that fits.",
    "metadata": [
      "A - Poole",
      "B - Dr Lanyon",
      "C - Mr Guest",
      "1 - Jekyll's old friend who is a doctor",
      "2 - Utterson's clerk who knows handwriting",
      "3 - Jekyll's butler or servant"
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
    "topic": "character_analysis",
    "subtopic": "match_characters_to_roles",
    "skills": [
      "english_fal_match_characters_to_roles"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "clues": "- Think about who works for Jekyll and who works for Utterson.\n- One character is a doctor."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2024,
    "paper": "nov_p2",
    "name": "Question 4",
    "text_key": "strange_case_of_dr_jekyll_and_mr_hyde",
    "order": 4,
    "context_text": null,
    "question": "Arrange these chapters of the novel in the order in which they appear.",
    "metadata": [
      "The Carew Murder Case",
      "Story of the Door",
      "Incident of the Letter",
      "Search for Mr Hyde",
      ""
    ],
    "answer": [
      "Story of the Door",
      "Search for Mr Hyde",
      "The Carew Murder Case",
      "Incident of the Letter",
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
    "clues": "- The story starts at the door.\n- The letter comes after the murder."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2024,
    "paper": "nov_p2",
    "name": "Question 5",
    "text_key": "strange_case_of_dr_jekyll_and_mr_hyde",
    "order": 5,
    "context_text": null,
    "question": "Select the TWO violent acts that Mr Hyde commits.",
    "metadata": [
      "He tramples a child.",
      "He robs a bank.",
      "He murders Sir Danvers Carew.",
      "He burns Utterson's house.",
      "He poisons Dr Lanyon."
    ],
    "answer": [
      "He tramples a child.",
      "He murders Sir Danvers Carew.",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "novel",
    "topic": "plot_structure",
    "subtopic": "key_events",
    "skills": [
      "english_fal_identify_stated_reasons"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- One happens in a back street and one in a lane at night.\n- Reject crimes that the novel does not describe."
  }
];

// ─── AI explanation — one entry per REAL printed sub-question, real marks (AIEXP-08) ───

const aiExplanation = {
  "sub_questions": [
    {
      "number": "2.1.1",
      "marks": 4,
      "clues": "- Recall what each man does in the story.",
      "approach": "- Match the names you know first\n- Use the unused descriptions",
      "solution": "1. Carew is murdered by Hyde.\n2. Jekyll transforms and shocks friends.\n3. Enfield minds his own business.\n4. Utterson recognises the murder weapon."
    },
    {
      "number": "2.1.2",
      "marks": 2,
      "clues": "- Think about what Lanyon's anger is about.",
      "approach": "- Say why Utterson is relieved\n- Link it to Hyde",
      "solution": "1. He sees Lanyon's anger at Jekyll's scientific beliefs as a sign that there is no sinister link between Hyde and Jekyll."
    },
    {
      "number": "2.1.3",
      "marks": 3,
      "clues": "- (a) Change the one wrong word. (b) Think about the sleepless night.",
      "approach": "- Fix the statement\n- Name his state of mind",
      "solution": "1. (a) Hyde's dwelling is in Soho, or Utterson's dwelling is in London/Gaunt Street.\n2. (b) Utterson is confused or troubled, struggling to piece together the puzzle."
    },
    {
      "number": "2.1.4",
      "marks": 3,
      "clues": "- A mind is described as held captive.",
      "approach": "- Name the figure of speech\n- Explain it",
      "solution": "1. (a) Metaphor or personification.\n2. (b) As a slave is controlled by his owner, Utterson's mind is occupied by the mystery."
    },
    {
      "number": "2.1.5",
      "marks": 3,
      "clues": "- (a) Look for details of Enfield's story. (b) Recall their relationship.",
      "approach": "- Give two details\n- Choose the relationship",
      "solution": "1. (a) The cheque is signed by Jekyll; Enfield sees Hyde enter Jekyll's laboratory; the figure has control over Jekyll (any two).\n2. (b) Enfield is a distant relative of Utterson: C."
    },
    {
      "number": "2.1.6",
      "marks": 3,
      "clues": "- Decide whether Utterson helps Jekyll hide his double life, then use events.",
      "approach": "- State your view\n- Give evidence",
      "solution": "1. Yes: Utterson does not confront Jekyll about the murder weapon or Hyde's key, and stays silent when Mr Guest confirms the handwriting is similar.\n2. No: he is unaware of the experiment, trusts his friend and tries to help him."
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
