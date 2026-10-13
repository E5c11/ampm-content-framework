#!/usr/bin/env node
/**
 * DBE English FAL P2 — November 2025 — My Children! My Africa! — Extract H (Thami and Isabel in conversation, Act 2 Sc 1). 4.2.1–4.2.7, 17 marks.
 * Practice questions follow the HL Paper 2 pattern: context_text null, FRESH targets from elsewhere in the text, never the
 * exam's own statements or the memo's answers (DESIGN-UNI-01); they carry text_key "my_children_my_africa" on lesson and every
 * question (SETWORK-LES-01). aiExplanation: one entry per REAL exam sub-question with its real marks, derived from the
 * memo in own words (AIEXP-08). Every fitb declares keyboard_type 'text' (LANG-KB-01).
 *
 * FACTUAL BASIS per practice question — BK = book knowledge (verify against the text), P = printed in the exam paper's
 * extract/poem, M = established by the memo, PT = vocabulary/title meaning:
 *   Q1: M: 2025 memo 4.1.6 — Mr M 'refuses to stop ringing the bell even though the situation is volatile'.
 *   Q2: M: memo 4.1.6 'refuses to stop ringing the bell even though the situation is volatile'.
 *   Q3: M: memo 4.2.4(b) (pressure by the comrades) and 4.2.7 (commitment to the Struggle).
 *   Q4: BK: education and friendship across racial lines are standard themes.
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
    "context_text": null,
    "question": "What does Mr M ring to call the pupils to school, even when it is dangerous? Write one word.",
    "metadata": [
      "Object:",
      "[ ]"
    ],
    "answer": [
      "bell",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "definition",
    "unit": "drama",
    "topic": "dramatic_techniques",
    "subtopic": "symbols_in_the_play",
    "skills": [
      "english_fal_recall_key_events"
    ],
    "difficulty": 1,
    "exam_weight": 1,
    "clues": "- It is a small metal object rung by hand.\n- Write one word.",
    "keyboard_type": "text"
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
    "context_text": null,
    "question": "What does the ringing of the school bell show about Mr M?",
    "metadata": [
      "his wish to become the school's headmaster",
      "his love of music",
      "his stubborn commitment to education and to order in the school",
      "his fear of the sea",
      ""
    ],
    "answer": [
      "his stubborn commitment to education and to order in the school",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "drama",
    "topic": "dramatic_techniques",
    "subtopic": "symbols_in_the_play",
    "skills": [
      "english_fal_explain_symbol"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "clues": "- Think about what he keeps doing even when the situation is dangerous.\n- Look for the option about duty and education."
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
    "context_text": null,
    "question": "Select the TWO reasons why Thami joins the boycott.",
    "metadata": [
      "He feels loyalty to the struggle of his community",
      "He has failed his school exams",
      "He is pressured by the comrades",
      "He wants to become a teacher like Mr M",
      "He has moved to another town"
    ],
    "answer": [
      "He feels loyalty to the struggle of his community",
      "He is pressured by the comrades",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "drama",
    "topic": "character_analysis",
    "subtopic": "thami_motives",
    "skills": [
      "english_fal_identify_stated_reasons"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "clues": "- Think about the pressure around him and what he feels for his community.\n- Reject reasons that contradict the play."
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
    "context_text": null,
    "question": "Select the TWO themes that are explored in the play.",
    "metadata": [
      "education",
      "magic and witchcraft",
      "friendship across barriers",
      "a long sea voyage",
      ""
    ],
    "answer": [
      "education",
      "friendship across barriers",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "drama",
    "topic": "theme_identification",
    "subtopic": "themes_of_the_play",
    "skills": [
      "english_fal_identify_theme"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Think about what happens between Thami and Isabel and what Mr M cares about.\n- Reject themes that are not in the story."
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
