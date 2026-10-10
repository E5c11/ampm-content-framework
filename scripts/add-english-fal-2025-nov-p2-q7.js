#!/usr/bin/env node
/**
 * DBE English FAL P2 — November 2025 — My Children! My Africa! — Extract G (Mr M on the qualities of a good teacher, Act 1 Sc 3). 4.1.1–4.1.6, 18 marks.
 * Practice questions are fresh (DESIGN-UNI-01), mirror the sub-question types (LANG-EX-02) and carry text_key
 * "my_children_my_africa" on lesson and every question (SETWORK-LES-01). aiExplanation: one entry per REAL exam
 * sub-question with its real marks, derived from the memo in own words (AIEXP-08). Every fitb declares
 * keyboard_type 'text' (LANG-KB-01).
 *
 *   node tools/validate-questions.js --script scripts/add-english-fal-2025-nov-p2-q7.js --curriculum temp/curriculum-vocab-english-fal.json
 *   node scripts/add-english-fal-2025-nov-p2-q7.js --dry-run
 *   node scripts/add-english-fal-2025-nov-p2-q7.js
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
  "name": "Question 4.1: My Children! My Africa!",
  "syllabus": "dbe",
  "subject": "english_fal",
  "year": 2025,
  "paper": "nov_p2",
  "order": 7,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "literary_essay",
    "character_analysis",
    "irony"
  ],
  "text_key": "my_children_my_africa",
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p2/q7/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p2/q7/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p2/q7/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p2/q7/memo_2.png"
  ],
  "exam_question_marks": 18,
  "supplementary_materials": [
    {
      "type": "annexure",
      "label": "Extract G",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p2/q7/annexure_extract_g_1.png"
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
    "question": "Match each character from My Children! My Africa! to the description that fits.",
    "metadata": [
      "A - Mr M",
      "B - Thami Mbikwana",
      "C - Isabel Dyson",
      "1 - is a gifted pupil and Mr M's protégé",
      "2 - is a girl from another school who takes part in the quiz",
      "3 - is a teacher who dreams of the one special pupil"
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
    "unit": "drama",
    "topic": "character_analysis",
    "subtopic": "match_characters_to_roles",
    "skills": [
      "english_fal_match_characters_to_roles"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Think about who teaches, who is taught and who comes from the other school.\n- Use the pair you are sure of first."
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
    "context_text": "MR M: I have no better pupil than Thami, young lady, and I will not pretend otherwise.",
    "question": "What do the words below reveal about the speaker's character?",
    "metadata": [
      "boastful",
      "secretive",
      "honest",
      "uncaring",
      ""
    ],
    "answer": [
      "honest",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "drama",
    "topic": "character_analysis",
    "subtopic": "character_from_words",
    "skills": [
      "english_fal_infer_character_from_words"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Look at what the speaker admits about himself.\n- Think about whether he hides the truth."
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
    "context_text": "A teacher plants seeds in a young mind and waits patiently for them to grow.",
    "question": "Name the figure of speech used in the sentence below. Write one word.",
    "metadata": [
      "Figure:",
      "[ ]"
    ],
    "answer": [
      "metaphor",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "application",
    "unit": "drama",
    "topic": "figurative_language",
    "subtopic": "metaphor_identification",
    "skills": [
      "english_fal_identify_figure_of_speech"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Look for a direct comparison between a mind and something that holds seeds.\n- Check for 'like' or 'as' before you decide.",
    "keyboard_type": "text"
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
    "context_text": "MR M: He is the best pupil I have ever had; he will go far in his studies.",
    "question": "What is ironic about Mr M's words below?",
    "metadata": [
      "Thami hates school, yet he is the best pupil in the class.",
      "Thami loves sport, yet he never plays with other boys.",
      "Thami wants to leave Brakwater, yet he never does.",
      "Thami wants to learn more than other boys want to play, yet he later leaves school to join the Struggle.",
      ""
    ],
    "answer": [
      "Thami wants to learn more than other boys want to play, yet he later leaves school to join the Struggle.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "drama",
    "topic": "dramatic_techniques",
    "subtopic": "irony_in_drama",
    "skills": [
      "english_fal_explain_irony"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "clues": "- Irony is a gap between what is said and what happens later.\n- Think about what Thami does in the play."
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
    "question": "The apartheid system is responsible for Mr M's death. Which ONE answer is best substantiated by events in the play?",
    "metadata": [
      "Yes: Mr M is killed because he joins the comrades.",
      "Yes: the Bantu Education system angers the students, and they kill Mr M because they see him as an informer.",
      "No: Mr M dies of an illness unrelated to the unrest.",
      "No: the apartheid government never affects the students' school.",
      ""
    ],
    "answer": [
      "Yes: the Bantu Education system angers the students, and they kill Mr M because they see him as an informer.",
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
    "clues": "- Look for an option that connects the school system with the students' reaction.\n- Reject options that are not in the play."
  }
];

// ─── AI explanation — one entry per REAL exam sub-question, real marks (AIEXP-08) ───

const aiExplanation = {
  "sub_questions": [
    {
      "number": "4.1.1",
      "marks": 4,
      "clues": "- Think about each person's job or role in the play.\n- Match the ones you know best first.",
      "approach": "- Match Amos, Thami, Isabel and Sipho\n- Check each pair against the play",
      "solution": "1. Amos Mbikwana works at the railway.\n2. Thami is a teacher's protégé.\n3. Isabel is a victorious debater.\n4. Sipho Fondini writes on the wall."
    },
    {
      "number": "4.1.2",
      "marks": 2,
      "clues": "- Think about what Mr M has come to ask Isabel.\n- Give the place.",
      "approach": "- Say what happens\n- Say where",
      "solution": "1. Mr M has come to ask Isabel to form a team with Thami for the literature quiz.\n2. This is at Camdeboo High School."
    },
    {
      "number": "4.1.3",
      "marks": 4,
      "clues": "- Think about what an actor could do to show shock.\n- Consider what Mr M's words say about him.",
      "approach": "- Give two actions\n- Name a trait with evidence",
      "solution": "1. (a) Mr M could raise his eyebrows, cover his mouth or place both hands on his head.\n2. (b) He is honest or truthful as he admits his favouritism towards Thami."
    },
    {
      "number": "4.1.4",
      "marks": 3,
      "clues": "- A head is used to stand for a pupil; liquid is poured in.\n- Think about the teacher's wish.",
      "approach": "- Name the figure of speech\n- Explain the comparison",
      "solution": "1. Metaphor or synecdoche.\n2. The pupil is like a vessel into which the teacher pours knowledge, or the head stands for the whole pupil, Thami."
    },
    {
      "number": "4.1.5",
      "marks": 2,
      "clues": "- Irony is a gap between what is said and what happens.\n- What does Thami finally choose?",
      "approach": "- State what Mr M says\n- State what Thami does",
      "solution": "1. Mr M says Thami is focused on learning.\n2. Yet Thami later drops out of school to join the Struggle."
    },
    {
      "number": "4.1.6",
      "marks": 3,
      "clues": "- Decide whether the system is to blame, then support it with events.\n- A bare yes or no earns nothing.",
      "approach": "- State your view\n- Give evidence",
      "solution": "1. Yes: apartheid imposes Bantu Education, the students revolt against it and kill Mr M as a police informer.\n2. No: Mr M refuses to join the comrades, knows what giving names to the police means and keeps ringing the bell."
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
