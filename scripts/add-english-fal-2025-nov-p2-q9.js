#!/usr/bin/env node
/**
 * DBE English FAL P2 — November 2025 — 'Triumph in the Face of Adversity' — Extract I (Thulisile and Mme Sadike). 5.1.1–5.1.7, 17 marks.
 * Practice questions are fresh (DESIGN-UNI-01), mirror the sub-question types (LANG-EX-02) and carry text_key
 * "triumph_in_the_face_of_adversity" on lesson and every question (SETWORK-LES-01). aiExplanation: one entry per REAL exam
 * sub-question with its real marks, derived from the memo in own words (AIEXP-08). Every fitb declares
 * keyboard_type 'text' (LANG-KB-01).
 *
 *   node tools/validate-questions.js --script scripts/add-english-fal-2025-nov-p2-q9.js --curriculum temp/curriculum-vocab-english-fal.json
 *   node scripts/add-english-fal-2025-nov-p2-q9.js --dry-run
 *   node scripts/add-english-fal-2025-nov-p2-q9.js
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
  "year": 2025,
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
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p2/q9/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p2/q9/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p2/q9/memo_2.png"
  ],
  "exam_question_marks": 17,
  "supplementary_materials": [
    {
      "type": "annexure",
      "label": "Extract I",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p2/q9/annexure_extract_i_1.png"
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
    "text_key": "triumph_in_the_face_of_adversity",
    "order": 1,
    "context_text": null,
    "question": "Match each character from 'Triumph in the Face of Adversity' to the description that fits.",
    "metadata": [
      "A - Mme Sadike",
      "B - Thembekile",
      "C - Thulisile",
      "1 - stays in her marriage despite the abuse",
      "2 - the narrator who later succeeds against the odds",
      "3 - comforts Thulisile and advises her where to find help"
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
    "clues": "- Think about who narrates and who gives advice in the extract.\n- Use the pair you are sure of first."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Question 2",
    "text_key": "triumph_in_the_face_of_adversity",
    "order": 2,
    "context_text": "The woman held the crying girl in her arms and let her speak until she had finished.",
    "question": "What does the action below reveal about the character who does it?",
    "metadata": [
      "strict",
      "indifferent",
      "boastful",
      "caring",
      ""
    ],
    "answer": [
      "caring",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "short_stories",
    "topic": "character_analysis",
    "subtopic": "character_from_words",
    "skills": [
      "english_fal_infer_character_from_words"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Look at what she does when the girl cries.\n- Think about whether she is gentle or cold."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Question 3",
    "text_key": "triumph_in_the_face_of_adversity",
    "order": 3,
    "context_text": "'I cannot imagine how a girl like me will ever finish school,' she said.",
    "question": "What is ironic about the narrator's words below?",
    "metadata": [
      "Thulisile thinks she will succeed, and she does so at once.",
      "Thulisile thinks she will fail, and she never recovers.",
      "Thulisile thinks she cannot rise above her troubles, but she later becomes successful.",
      "Thulisile has no troubles, yet she complains.",
      ""
    ],
    "answer": [
      "Thulisile thinks she cannot rise above her troubles, but she later becomes successful.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "short_stories",
    "topic": "dramatic_techniques",
    "subtopic": "irony_in_prose",
    "skills": [
      "english_fal_explain_irony"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "clues": "- Irony is a gap between what is said and what happens later.\n- Think about how her life turns out."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Question 4",
    "text_key": "triumph_in_the_face_of_adversity",
    "order": 4,
    "context_text": null,
    "question": "Select the TWO reasons why Mme Sadike suggests that Thulisile goes to a social worker or the police.",
    "metadata": [
      "A social worker will give her counselling and emotional support",
      "The school will give her a new uniform",
      "The police will protect her family from her father's violence",
      "The church will pay her school fees",
      "A neighbour will give her a job"
    ],
    "answer": [
      "A social worker will give her counselling and emotional support",
      "The police will protect her family from her father's violence",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "short_stories",
    "topic": "plot_structure",
    "subtopic": "reasons_for_events",
    "skills": [
      "english_fal_identify_stated_reasons"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "clues": "- Think about what each of the two offices can do for a child in danger.\n- Reject options about school or church."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Question 5",
    "text_key": "triumph_in_the_face_of_adversity",
    "order": 5,
    "context_text": null,
    "question": "Thembekile deserves to be praised. Which ONE answer is best substantiated by events in the story?",
    "metadata": [
      "Yes: Thembekile stays loyal to her vows and respects her cruel mother-in-law, but she gives up her dream to please her husband.",
      "Yes: Thembekile leaves her husband immediately and moves to a new city.",
      "No: Thembekile has no problems and lives happily.",
      "No: Thembekile is never mentioned in the story.",
      ""
    ],
    "answer": [
      "Yes: Thembekile stays loyal to her vows and respects her cruel mother-in-law, but she gives up her dream to please her husband.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "short_stories",
    "topic": "theme_identification",
    "subtopic": "discuss_view_with_evidence",
    "skills": [
      "english_fal_substantiate_a_view"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "clues": "- Look for an option that is supported by specific actions in the story.\n- Reject options that contradict the story."
  }
];

// ─── AI explanation — one entry per REAL exam sub-question, real marks (AIEXP-08) ───

const aiExplanation = {
  "sub_questions": [
    {
      "number": "5.1.1",
      "marks": 4,
      "clues": "- Think about each character's role in Thulisile's story.\n- Match the ones you are sure of first.",
      "approach": "- Match Jabulani, Mr Rathebe, Bongani and Mr Nkwane\n- Check each pair",
      "solution": "1. Jabulani is an abusive and drunken man.\n2. Mr Rathebe owns a fish and chips shop.\n3. Bongani is upset about not receiving bread.\n4. Mr Nkwane appears to be a concerned teacher."
    },
    {
      "number": "5.1.2",
      "marks": 2,
      "clues": "- Recall how Thulisile comes to Mme Sadike's house.\n- Give the occasion and the place.",
      "approach": "- Say what Thulisile was doing\n- Name the place",
      "solution": "1. Thulisile is begging for bread or looking for a job.\n2. This is at Mme Sadike's house."
    },
    {
      "number": "5.1.3",
      "marks": 2,
      "clues": "- Think about what Mr Nkwane might share and what Thulisile fears.\n- Give two points.",
      "approach": "- State the first cause\n- State the second",
      "solution": "1. Thulisile is embarrassed that Mr Nkwane would share her personal life with everyone.\n2. She fears that people might pity her."
    },
    {
      "number": "5.1.4",
      "marks": 2,
      "clues": "- Look at what Mme Sadike does when Thulisile cries.\n- What trait does it show?",
      "approach": "- Name the trait\n- Support it",
      "solution": "1. Mme Sadike is sympathetic or caring.\n2. She comforts Thulisile when she cries and confides in her."
    },
    {
      "number": "5.1.5",
      "marks": 2,
      "clues": "- Irony is a gap between what is said and what happens.\n- Think about how Thulisile's life ends up.",
      "approach": "- State what she says\n- State what happens",
      "solution": "1. Thulisile doubts that she can overcome her struggles.\n2. Later she becomes a success, for example a television presenter with a house."
    },
    {
      "number": "5.1.6",
      "marks": 2,
      "clues": "- Think about what each office can do.\n- Link each to Thulisile's problem.",
      "approach": "- State what a social worker does\n- State what the police do",
      "solution": "1. A social worker provides counselling or emotional support.\n2. The police protect Thulisile and her siblings from their father's violence."
    },
    {
      "number": "5.1.7",
      "marks": 3,
      "clues": "- Decide your view, then support it with events in the story.\n- A bare yes or no earns nothing.",
      "approach": "- State your view\n- Give evidence",
      "solution": "1. Yes: Thembekile honours her marriage vows, respects her cruel mother-in-law and stops visiting her parents so they do not see the abuse.\n2. No: she gives up her dream of acting, tolerates abuse that her children witness and declines Thulisile's offer of a home."
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
