#!/usr/bin/env node
/**
 * DBE English FAL P2 — November 2025 — My Children! My Africa! — Extract G (Mr M on the qualities of a good teacher, Act 1 Sc 3). 4.1.1–4.1.6, 18 marks.
 * Practice questions follow the HL Paper 2 pattern: context_text null, FRESH targets from elsewhere in the text, never the
 * exam's own statements or the memo's answers (DESIGN-UNI-01); they carry text_key "my_children_my_africa" on lesson and every
 * question (SETWORK-LES-01). aiExplanation: one entry per REAL exam sub-question with its real marks, derived from the
 * memo in own words (AIEXP-08). Every fitb declares keyboard_type 'text' (LANG-KB-01).
 *
 * FACTUAL BASIS per practice question — BK = book knowledge (verify against the text), P = printed in the exam paper's
 * extract/poem, M = established by the memo, PT = vocabulary/title meaning:
 *   Q1: P: the author is printed in the exam paper (Athol Fugard).
 *   Q2: BK + M: Mr M's belief in education vs the boycott (memo mentions boycott and Mr M's death).
 *   Q3: P + M: Thami and Isabel are pupils; Mr M and Miss Brockway are teachers (memo 4.2.6).
 *   Q4: P + M: roles as printed in the exam extracts and memo.
 *   Q5: M + BK: memo 4.2.2(b) and 4.1.6; broad plot order.
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
    "question": "Who wrote the play My Children! My Africa!? Write the surname.",
    "metadata": [
      "Surname:",
      "[ ]"
    ],
    "answer": [
      "Fugard",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "definition",
    "unit": "drama",
    "topic": "plot_structure",
    "subtopic": "text_information",
    "skills": [
      "english_fal_recall_key_events"
    ],
    "difficulty": 1,
    "exam_weight": 1,
    "clues": "- The playwright is one of South Africa's best-known dramatists.\n- Write the surname only.",
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
    "question": "Which of the following is the main conflict in the play?",
    "metadata": [
      "two schools that compete for a sports trophy",
      "the education Mr M believes in and the boycott that the comrades demand",
      "a rich family and a poor family",
      "two brothers who share a farm",
      ""
    ],
    "answer": [
      "the education Mr M believes in and the boycott that the comrades demand",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "drama",
    "topic": "plot_structure",
    "subtopic": "central_conflict",
    "skills": [
      "english_fal_identify_theme"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "clues": "- Think about what Mr M wants for his pupils and what the comrades want.\n- Look for the option that concerns education and politics."
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
    "question": "Select the TWO characters who are pupils at their schools.",
    "metadata": [
      "Thami",
      "Mr M",
      "Isabel",
      "Miss Brockway",
      "the police inspector"
    ],
    "answer": [
      "Thami",
      "Isabel",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "drama",
    "topic": "character_analysis",
    "subtopic": "characters_and_roles",
    "skills": [
      "english_fal_match_characters_to_roles"
    ],
    "difficulty": 1,
    "exam_weight": 1,
    "clues": "- Two of the options are teachers.\n- One option is a policeman."
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
    "question": "Match each character from the play to the description that fits.",
    "metadata": [
      "A - Mr M",
      "B - Thami",
      "C - Isabel",
      "1 - a gifted pupil who joins the boycott",
      "2 - a girl from another school who becomes Thami's friend",
      "3 - a teacher who believes in the power of education"
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
    "clues": "- Think about who teaches, who is taught and who comes from the other school.\n- Start with the pair you know best."
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
    "question": "Arrange these events from the play in the order in which they happen.",
    "metadata": [
      "Mr M is killed",
      "Thami and Isabel are paired for the quiz",
      "Thami withdraws and joins the boycott",
      "Thami and Isabel become friends",
      ""
    ],
    "answer": [
      "Thami and Isabel are paired for the quiz",
      "Thami and Isabel become friends",
      "Thami withdraws and joins the boycott",
      "Mr M is killed",
      ""
    ],
    "presentation": "ordering",
    "type": "application",
    "unit": "drama",
    "topic": "plot_structure",
    "subtopic": "sequence_of_events",
    "skills": [
      "english_fal_order_events"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "clues": "- Start with how the two pupils first meet.\n- Mr M's death is the tragic climax."
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
