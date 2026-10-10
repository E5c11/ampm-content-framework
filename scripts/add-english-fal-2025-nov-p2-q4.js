#!/usr/bin/env node
/**
 * DBE English FAL P2 — November 2025 — Strange Case of Dr Jekyll and Mr Hyde — Extract D (Utterson visits Jekyll, 'Incident of the Letter'). 2.2.1–2.2.7, 18 marks.
 * Practice questions are fresh (DESIGN-UNI-01), mirror the sub-question types (LANG-EX-02) and carry text_key
 * "strange_case_of_dr_jekyll_and_mr_hyde" on lesson and every question (SETWORK-LES-01). aiExplanation: one entry per REAL exam
 * sub-question with its real marks, derived from the memo in own words (AIEXP-08). Every fitb declares
 * keyboard_type 'text' (LANG-KB-01).
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
    "context_text": "'He wishes to kill you,' said Utterson, 'and you are lucky to be alive.'",
    "question": "What is the irony in the speaker's words in the extract?",
    "metadata": [
      "Utterson expects Jekyll to murder Hyde, who is actually his enemy.",
      "Utterson fears Jekyll will leave London, though Jekyll plans to stay.",
      "Utterson believes Poole is lying, but Poole is telling the truth.",
      "Utterson fears that Hyde will kill Jekyll, but Jekyll and Hyde are the same person.",
      ""
    ],
    "answer": [
      "Utterson fears that Hyde will kill Jekyll, but Jekyll and Hyde are the same person.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "novel",
    "topic": "dramatic_techniques",
    "subtopic": "irony_in_prose",
    "skills": [
      "english_fal_explain_irony"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "clues": "- Irony is a gap between what a character believes and what the reader knows.\n- Think about the secret the reader already suspects."
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
    "context_text": "'God forgive me,' said the doctor, and he sank into a chair with his head in his hands.",
    "question": "What do the lines below reveal about Dr Jekyll's state of mind?",
    "metadata": [
      "cheerful",
      "bored",
      "remorseful",
      "angry at others",
      ""
    ],
    "answer": [
      "remorseful",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "novel",
    "topic": "character_analysis",
    "subtopic": "state_of_mind",
    "skills": [
      "english_fal_infer_state_of_mind"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Look at his gesture and the words about a lesson.\n- Think about how someone speaks after a terrible event."
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
    "question": "Select the TWO things that are strange about the letter Utterson asks Poole about.",
    "metadata": [
      "It has no return address",
      "It was delivered by a messenger Poole could describe",
      "The handwriting is Jekyll's own",
      "It arrived with a gift for Utterson",
      "It was written in a foreign language"
    ],
    "answer": [
      "It has no return address",
      "The handwriting is Jekyll's own",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "novel",
    "topic": "plot_structure",
    "subtopic": "clues_in_letter",
    "skills": [
      "english_fal_identify_stated_reasons"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "clues": "- Think about how the letter reached the house and who it is addressed to.\n- Two options are about its delivery or contents and are false."
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
    "context_text": "Utterson weighed each fact in turn and allowed himself no conclusion that the evidence did not support.",
    "question": "What does the passage below reveal about Mr Utterson's character at this point?",
    "metadata": [
      "rash and impulsive",
      "rational and careful",
      "gullible",
      "cruel",
      ""
    ],
    "answer": [
      "rational and careful",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "novel",
    "topic": "character_analysis",
    "subtopic": "character_from_words",
    "skills": [
      "english_fal_infer_character_from_words"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Look at how he reasons from evidence before acting.\n- Consider whether he jumps to conclusions."
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
    "question": "Jekyll shares his will with Utterson and sends Poole for powders. Name the theme these events show. Write one word.",
    "metadata": [
      "Theme:",
      "[ ]"
    ],
    "answer": [
      "trust",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "application",
    "unit": "novel",
    "topic": "theme_identification",
    "subtopic": "theme_identification",
    "skills": [
      "english_fal_identify_theme"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Think about what Jekyll must believe about Utterson and Poole.\n- The theme concerns confidence in other people.",
    "keyboard_type": "text"
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
