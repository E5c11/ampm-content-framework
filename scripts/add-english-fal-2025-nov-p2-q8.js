#!/usr/bin/env node
/**
 * DBE English FAL P2 — November 2025 — My Children! My Africa! — Extract H (Thami and Isabel in conversation, Act 2 Sc 1). 4.2.1–4.2.7, 17 marks.
 * Practice questions are fresh (DESIGN-UNI-01), mirror the sub-question types (LANG-EX-02) and carry text_key
 * "my_children_my_africa" on lesson and every question (SETWORK-LES-01). aiExplanation: one entry per REAL exam
 * sub-question with its real marks, derived from the memo in own words (AIEXP-08). Every fitb declares
 * keyboard_type 'text' (LANG-KB-01).
 *
 *   node tools/validate-questions.js --script scripts/add-english-fal-2025-nov-p2-q8.js --curriculum temp/curriculum-vocab-english-fal.json
 *   node scripts/add-english-fal-2025-nov-p2-q8.js --dry-run
 *   node scripts/add-english-fal-2025-nov-p2-q8.js
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
  "name": "Question 4.2: My Children! My Africa!",
  "syllabus": "dbe",
  "subject": "english_fal",
  "year": 2025,
  "paper": "nov_p2",
  "order": 8,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "literary_essay",
    "character_analysis",
    "tone"
  ],
  "text_key": "my_children_my_africa",
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p2/q8/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p2/q8/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p2/q8/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p2/q8/memo_2.png"
  ],
  "exam_question_marks": 17,
  "supplementary_materials": [
    {
      "type": "annexure",
      "label": "Extract H",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p2/q8/annexure_extract_h_1.png"
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
    "text_key": "my_children_my_africa",
    "order": 1,
    "context_text": "Several novels were published under the nom-de-plume of the writer's sister.",
    "question": "In the sentence below, what are 'noms-de-plume'?",
    "metadata": [
      "last names",
      "real names",
      "assumed names",
      "first names",
      ""
    ],
    "answer": [
      "assumed names",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "drama",
    "topic": "figurative_language",
    "subtopic": "vocabulary_in_context",
    "skills": [
      "english_fal_explain_word_in_context"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Think about why an author might publish under another name.\n- The phrase comes from French and means 'pen name'."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Question 2",
    "text_key": "my_children_my_africa",
    "order": 2,
    "context_text": "THAMI: I must choose my words slowly, Isabel; I do not want to hurt you.",
    "question": "Select the TWO things that make Thami hesitate when he speaks to Isabel in the lines below.",
    "metadata": [
      "He is afraid of hurting Isabel",
      "He is afraid of failing the literature quiz",
      "He is afraid she will misunderstand why he is leaving",
      "He is afraid that Mr M will find out",
      "He is afraid of the headmaster"
    ],
    "answer": [
      "He is afraid of hurting Isabel",
      "He is afraid she will misunderstand why he is leaving",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "drama",
    "topic": "character_analysis",
    "subtopic": "state_of_mind",
    "skills": [
      "english_fal_infer_state_of_mind"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Look at the words 'carefully' and 'hurt'.\n- Think about what he does not want Isabel to believe."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Question 3",
    "text_key": "my_children_my_africa",
    "order": 3,
    "context_text": "ISABEL: Well, that is wonderful news, isn't it? Please, tell me more.",
    "question": "What tone would the speaker use for the line below?",
    "metadata": [
      "delighted",
      "frightened",
      "affectionate",
      "sarcastic",
      ""
    ],
    "answer": [
      "sarcastic",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "drama",
    "topic": "tone_and_mood",
    "subtopic": "tone_identification",
    "skills": [
      "english_fal_identify_tone"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "clues": "- Think about how someone sounds when she already knows the answer.\n- She is losing patience."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Question 4",
    "text_key": "my_children_my_africa",
    "order": 4,
    "context_text": "Isabel prepares for the literature quiz and later tells her story to the world through her writing.",
    "question": "Which career does Isabel hope to follow? Write one word.",
    "metadata": [
      "Career:",
      "[ ]"
    ],
    "answer": [
      "journalist",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "application",
    "unit": "drama",
    "topic": "plot_structure",
    "subtopic": "key_events",
    "skills": [
      "english_fal_recall_key_events"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Think about what she says about writing and telling stories about people's lives.\n- Write a single word.",
    "keyboard_type": "text"
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Question 5",
    "text_key": "my_children_my_africa",
    "order": 5,
    "context_text": null,
    "question": "Thami represents hope for the future. Which ONE answer is best substantiated by events in the play?",
    "metadata": [
      "Thami represents despair because he never studies.",
      "Thami represents hope because he is gifted and gives up his own plans for his people, though his future is uncertain.",
      "Thami represents hope because he joins the police.",
      "Thami represents nothing because he leaves the story early.",
      ""
    ],
    "answer": [
      "Thami represents hope because he is gifted and gives up his own plans for his people, though his future is uncertain.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "drama",
    "topic": "theme_identification",
    "subtopic": "discuss_view_with_evidence",
    "skills": [
      "english_fal_substantiate_a_view"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "clues": "- Look for an option that mentions both his talent and the cost of his choice.\n- Reject options that are not in the play."
  }
];

// ─── AI explanation — one entry per REAL exam sub-question, real marks (AIEXP-08) ───

const aiExplanation = {
  "sub_questions": [
    {
      "number": "4.2.1",
      "marks": 2,
      "clues": "- 'Nom-de-plume' is French; think of a writer's assumed name.\n- Why would Isabel mention novels?",
      "approach": "- Choose the meaning\n- Give the reason",
      "solution": "1. (a) 'Nom-de-plumes' are assumed names, so the answer is A.\n2. (b) Isabel is preparing for a literature quiz."
    },
    {
      "number": "4.2.2",
      "marks": 4,
      "clues": "- Look at how carefully Thami speaks and what he fears.\n- Then say what he is going to tell her.",
      "approach": "- Name the state of mind\n- Say what news he gives",
      "solution": "1. (a) Thami is conflicted or concerned as he does not know how to break the news without hurting her.\n2. (b) He is withdrawing from the literature quiz and cannot see her any more as he joins the Struggle or boycott."
    },
    {
      "number": "4.2.3",
      "marks": 2,
      "clues": "- Think about what Isabel learns about South Africa through Thami.\n- 'Important' here is not casual.",
      "approach": "- Say why the time was important\n- Link to apartheid",
      "solution": "1. Isabel says her time with Thami was life-changing.\n2. She gained a deeper understanding of the realities of apartheid."
    },
    {
      "number": "4.2.4",
      "marks": 2,
      "clues": "- Think about how someone sounds when she suspects the cause already.\n- What does Isabel want Thami to admit?",
      "approach": "- Name the tone\n- Give the reason",
      "solution": "1. The tone is sarcastic, frustrated or impatient.\n2. Isabel wants Thami to admit the comrades are pressuring him or she is angry that they interfere with their friendship."
    },
    {
      "number": "4.2.5",
      "marks": 1,
      "clues": "- Think about the career Isabel talks about wanting.\n- Replace the underlined word.",
      "approach": "- Find the wrong word\n- Replace it",
      "solution": "1. Isabel aspires to become a journalist, not a doctor."
    },
    {
      "number": "4.2.6",
      "marks": 3,
      "clues": "- Think about conversations that start or change events in the play.\n- Use two or three examples.",
      "approach": "- Define the theme\n- Give examples",
      "solution": "1. Mr M's communication with Miss Brockway starts the debating contest.\n2. Thami and Isabel talk to get to know each other.\n3. Isabel converses with Thami to understand the political tension."
    },
    {
      "number": "4.2.7",
      "marks": 3,
      "clues": "- Decide your view of Thami, then support it with events.\n- A bare yes or no earns nothing.",
      "approach": "- State your view\n- Give evidence",
      "solution": "1. Yes: Thami excels academically, is passionate about social issues, joins the boycott and gives up his own aspirations for his people.\n2. No: he abandons his education, rejects Mr M's guidance, causes destruction and Mr M's death, and flees with no clear plan."
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
