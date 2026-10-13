#!/usr/bin/env node
/**
 * DBE English FAL P2 — November 2025 — Strange Case of Dr Jekyll and Mr Hyde — Extract D (Utterson visits Jekyll, 'Incident of the Letter'). 2.2.1–2.2.7, 18 marks.
 * Practice questions follow the HL Paper 2 pattern: context_text null, FRESH targets from elsewhere in the text, never the
 * exam's own statements or the memo's answers (DESIGN-UNI-01); they carry text_key "strange_case_of_dr_jekyll_and_mr_hyde" on lesson and every
 * question (SETWORK-LES-01). aiExplanation: one entry per REAL exam sub-question with its real marks, derived from the
 * memo in own words (AIEXP-08). Every fitb declares keyboard_type 'text' (LANG-KB-01).
 *
 * FACTUAL BASIS per practice question — BK = book knowledge (verify against the text), P = printed in the exam paper's
 * extract/poem, M = established by the memo, PT = vocabulary/title meaning:
 *   Q1: BK: the novel ends with 'Henry Jekyll's Full Statement of the Case'.
 *   Q2: BK: Utterson and Poole break down the cabinet door in 'The Last Night'. Verify.
 *   Q3: BK: Hyde's body is found in the cabinet (apparent suicide).
 *   Q4: BK: Lanyon dies after witnessing Hyde change; Poole and Utterson break the door; Utterson reads Lanyon's narrative.
 *   Q5: BK: gothic features (fog/London, double identity) are standard commentary on the novella.
 *
 *   node tools/validate-questions.js --script scripts/add-english-fal-2025-nov-p2-q4.js --curriculum temp/curriculum-vocab-english-fal.json
 *   node scripts/add-english-fal-2025-nov-p2-q4.js --dry-run
 *   node scripts/add-english-fal-2025-nov-p2-q4.js
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
  "name": "Question 2.2: Strange Case of Dr Jekyll and Mr Hyde",
  "syllabus": "dbe",
  "subject": "english_fal",
  "year": 2025,
  "paper": "nov_p2",
  "order": 4,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "literary_essay",
    "thematic_analysis",
    "irony"
  ],
  "text_key": "strange_case_of_dr_jekyll_and_mr_hyde",
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p2/q4/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p2/q4/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p2/q4/memo_2.png"
  ],
  "exam_question_marks": 18,
  "supplementary_materials": [
    {
      "type": "annexure",
      "label": "Extract D",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p2/q4/annexure_extract_d_1.png"
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
    "text_key": "strange_case_of_dr_jekyll_and_mr_hyde",
    "order": 1,
    "context_text": null,
    "question": "How is the full truth about Jekyll and Hyde finally revealed to Mr Utterson and the reader?",
    "metadata": [
      "a confession made by Mr Utterson",
      "a letter from Sir Danvers Carew",
      "a written statement left by Dr Jekyll",
      "a newspaper report about Mr Hyde",
      ""
    ],
    "answer": [
      "a written statement left by Dr Jekyll",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "novel",
    "topic": "plot_structure",
    "subtopic": "how_the_truth_is_revealed",
    "skills": [
      "english_fal_recall_key_events"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "clues": "- Think about the last chapter of the novel.\n- It is written by the person who knows the whole secret."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Question 2",
    "text_key": "strange_case_of_dr_jekyll_and_mr_hyde",
    "order": 2,
    "context_text": null,
    "question": "What do Utterson and Poole break down to get into Jekyll's cabinet? Write one word.",
    "metadata": [
      "Word:",
      "[ ]"
    ],
    "answer": [
      "door",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "definition",
    "unit": "novel",
    "topic": "plot_structure",
    "subtopic": "key_events",
    "skills": [
      "english_fal_recall_key_events"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- It is the barrier that Poole's servants have been unable to open.\n- Write one word.",
    "keyboard_type": "text"
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Question 3",
    "text_key": "strange_case_of_dr_jekyll_and_mr_hyde",
    "order": 3,
    "context_text": null,
    "question": "What happens to Mr Hyde at the end of the novel?",
    "metadata": [
      "He sails away to a distant country.",
      "He is sent to prison for life.",
      "He is made Jekyll's heir and lives in comfort.",
      "He is found dead in Jekyll's cabinet.",
      ""
    ],
    "answer": [
      "He is found dead in Jekyll's cabinet.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "novel",
    "topic": "plot_structure",
    "subtopic": "closing_events",
    "skills": [
      "english_fal_recall_key_events"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Think about where Utterson and Poole find him.\n- Reject options in which Hyde escapes or is rewarded."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Question 4",
    "text_key": "strange_case_of_dr_jekyll_and_mr_hyde",
    "order": 4,
    "context_text": null,
    "question": "Match each character from the novel to the event that involves him.",
    "metadata": [
      "A - Dr Lanyon",
      "B - Poole",
      "C - Mr Utterson",
      "1 - helps Utterson break down the cabinet door",
      "2 - reads Lanyon's sealed letter after his death",
      "3 - dies after seeing the transformation"
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
    "clues": "- Think about which character is a doctor and which is a servant.\n- One character reads a document after another man's death."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Question 5",
    "text_key": "strange_case_of_dr_jekyll_and_mr_hyde",
    "order": 5,
    "context_text": null,
    "question": "Select the TWO features that make the novel a gothic story.",
    "metadata": [
      "a mysterious London setting",
      "a cheerful comic servant",
      "a secret and a double identity",
      "a long sea voyage",
      ""
    ],
    "answer": [
      "a mysterious London setting",
      "a secret and a double identity",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "novel",
    "topic": "setting_and_atmosphere",
    "subtopic": "features_of_the_genre",
    "skills": [
      "english_fal_identify_genre_features"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "clues": "- Think about fog, dark streets and secrets.\n- Gothic stories are not about comedy or voyages."
  }
];

// ─── AI explanation — one entry per REAL exam sub-question, real marks (AIEXP-08) ───

const aiExplanation = {
  "sub_questions": [
    {
      "number": "2.2.1",
      "marks": 2,
      "clues": "- Irony is a gap between what a character knows and what is true.\n- Think about who Hyde really is.",
      "approach": "- Say what Utterson believes\n- Say what is true",
      "solution": "1. Utterson thinks Hyde wants to murder Jekyll.\n2. Unknown to him, Jekyll and Hyde are the same person."
    },
    {
      "number": "2.2.2",
      "marks": 2,
      "clues": "- Think about how Jekyll speaks and what he does with his hands.\n- Link it to the murder.",
      "approach": "- Name the state of mind\n- Give the cause",
      "solution": "1. Jekyll is remorseful.\n2. He feels terrible about Hyde's murder of Sir Danvers Carew."
    },
    {
      "number": "2.2.3",
      "marks": 4,
      "clues": "- Think about how the letter arrived and what Utterson notices about the handwriting.\n- Why would Jekyll forge a note from Hyde?",
      "approach": "- List two strange features\n- State the letter's purpose",
      "solution": "1. (a) The letter has no return address, no envelope, or the handwriting is Jekyll's own.\n2. (b) Jekyll writes it to deceive the police and distance himself from Hyde."
    },
    {
      "number": "2.2.4",
      "marks": 2,
      "clues": "- Look at how Utterson works out the letter's source.\n- Is he emotional or careful?",
      "approach": "- Name the trait\n- Give the evidence",
      "solution": "1. Utterson is rational, logical or analytical.\n2. He does not make unfounded assumptions."
    },
    {
      "number": "2.2.5",
      "marks": 2,
      "clues": "- The newsboys shout about a murder of an MP.\n- Recall the weapon's origin.",
      "approach": "- Name the MP\n- Recall who gave the weapon",
      "solution": "1. The MP is Sir Danvers Carew.\n2. The weapon, a cane, was a gift from Mr Utterson, so the answer is B."
    },
    {
      "number": "2.2.6",
      "marks": 3,
      "clues": "- Think about who trusts whom in the novel.\n- Give examples from more than one character.",
      "approach": "- Define the theme\n- Give two or three examples",
      "solution": "1. Jekyll shares his will with Utterson.\n2. Jekyll trusts Poole to fetch powders from Maw's.\n3. Poole trusts Utterson with the problem of the stranger in the laboratory."
    },
    {
      "number": "2.2.7",
      "marks": 3,
      "clues": "- Decide your view, then support it with events in the book.\n- A bare yes or no earns nothing.",
      "approach": "- State your view\n- Give evidence for it\n- Consider the opposite",
      "solution": "1. Yes: Hyde beats Carew to death with a cane, strikes a woman without reason and Jekyll fears being trapped as Hyde.\n2. No: Hyde is Jekyll's creation, acts on Jekyll's dark side and Jekyll's guilt makes him stop the potion."
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
