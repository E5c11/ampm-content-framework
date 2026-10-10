#!/usr/bin/env node
/**
 * DBE English FAL P2 — November 2025 — Macbeth — Extract F (Macbeth prepares for battle; Malcolm's army, Act 5 Sc 3–4). 3.2.1–3.2.8, 17 marks.
 * Practice questions are fresh (DESIGN-UNI-01), mirror the sub-question types (LANG-EX-02) and carry text_key
 * "macbeth" on lesson and every question (SETWORK-LES-01). aiExplanation: one entry per REAL exam
 * sub-question with its real marks, derived from the memo in own words (AIEXP-08). Every fitb declares
 * keyboard_type 'text' (LANG-KB-01).
 *
 *   node tools/validate-questions.js --script scripts/add-english-fal-2025-nov-p2-q6.js --curriculum temp/curriculum-vocab-english-fal.json
 *   node scripts/add-english-fal-2025-nov-p2-q6.js --dry-run
 *   node scripts/add-english-fal-2025-nov-p2-q6.js
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
  "name": "Question 3.2: Macbeth",
  "syllabus": "dbe",
  "subject": "english_fal",
  "year": 2025,
  "paper": "nov_p2",
  "order": 6,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "literary_essay",
    "thematic_analysis",
    "irony"
  ],
  "text_key": "macbeth",
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p2/q6/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p2/q6/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p2/q6/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p2/q6/memo_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p2/q6/memo_3.png"
  ],
  "exam_question_marks": 17,
  "supplementary_materials": [
    {
      "type": "annexure",
      "label": "Extract F",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p2/q6/annexure_extract_f_1.png"
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
    "text_key": "macbeth",
    "order": 1,
    "context_text": "The title once held by a traitor is taken from him and given to Macbeth as a reward.",
    "question": "After the battle, Duncan makes Macbeth Thane of …",
    "metadata": [
      "Word:",
      "[ ]"
    ],
    "answer": [
      "Cawdor",
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
    "clues": "- Think about the traitor whose title is given to Macbeth.\n- Write only the single word.",
    "keyboard_type": "text"
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Question 2",
    "text_key": "macbeth",
    "order": 2,
    "context_text": "MACBETH: Canst thou not minister to a mind diseased, pluck from the memory a rooted sorrow, and cleanse the stuffed bosom of that perilous stuff?",
    "question": "What does Macbeth ask the Doctor to do in the lines below?",
    "metadata": [
      "He wants the Doctor to leave the castle at once.",
      "He wants the Doctor to help the English army.",
      "He wants the Doctor to write a letter to Malcolm.",
      "He wants the Doctor to find and cure the illness that is troubling the land and his queen.",
      ""
    ],
    "answer": [
      "He wants the Doctor to find and cure the illness that is troubling the land and his queen.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "drama",
    "topic": "plot_structure",
    "subtopic": "key_events",
    "skills": [
      "english_fal_explain_reason_in_context"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Look at the words 'cure' and 'disease' in the speech.\n- Think about whom and what he wants healed."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Question 3",
    "text_key": "macbeth",
    "order": 3,
    "context_text": "DOCTOR: I will not stay in this house for any price; I fear for my conscience.",
    "question": "What do the Doctor's words below reveal about his character?",
    "metadata": [
      "principled",
      "greedy",
      "cowardly but honest",
      "loyal to Macbeth",
      ""
    ],
    "answer": [
      "principled",
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
    "clues": "- Look at what the Doctor refuses to be tempted by.\n- Consider whether he is loyal to Macbeth or to what is right."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Question 4",
    "text_key": "macbeth",
    "order": 4,
    "context_text": "MALCOLM: Let each man cut a branch and march behind it, that the enemy may not count our host.",
    "question": "What does Malcolm instruct his soldiers to do in the extract?",
    "metadata": [
      "Each soldier should burn the wood before the attack.",
      "Each soldier should cut a branch and carry it in front of him as camouflage.",
      "Each soldier should hide in the wood until dark.",
      "Each soldier should leave his weapon in the forest.",
      ""
    ],
    "answer": [
      "Each soldier should cut a branch and carry it in front of him as camouflage.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "drama",
    "topic": "plot_structure",
    "subtopic": "key_events",
    "skills": [
      "english_fal_explain_reason_in_context"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Think about how an army could hide its numbers from an enemy.\n- Link it to the wood the soldiers are standing in."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Question 5",
    "text_key": "macbeth",
    "order": 5,
    "context_text": null,
    "question": "Select the TWO statements that best show the theme of honour in the play.",
    "metadata": [
      "Macbeth and Banquo are praised for their courage in battle",
      "Macbeth refuses every reward Duncan offers him",
      "Macbeth's honour is corrupted as his ambition grows",
      "Duncan loses his honour by murdering Macbeth",
      "Lady Macbeth leads the army against Malcolm"
    ],
    "answer": [
      "Macbeth and Banquo are praised for their courage in battle",
      "Macbeth's honour is corrupted as his ambition grows",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "drama",
    "topic": "theme_identification",
    "subtopic": "theme_of_honour",
    "skills": [
      "english_fal_identify_theme_evidence"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "clues": "- Think about how Macbeth is first praised and what happens later.\n- Rule out statements that are not in the play."
  }
];

// ─── AI explanation — one entry per REAL exam sub-question, real marks (AIEXP-08) ───

const aiExplanation = {
  "sub_questions": [
    {
      "number": "3.2.1",
      "marks": 1,
      "clues": "- Think about who held the title before Macbeth and what happened to him.\n- Replace the underlined word.",
      "approach": "- Identify the wrong word\n- Replace it",
      "solution": "1. Duncan bestows the title Thane of Cawdor, not Fife."
    },
    {
      "number": "3.2.2",
      "marks": 2,
      "clues": "- Irony is a gap between what Macbeth asks and what is true.\n- Who made the land ill?",
      "approach": "- State what Macbeth asks for\n- State the truth about the illness",
      "solution": "1. Macbeth pleads with the Doctor to heal Scotland.\n2. He himself is the cause of its suffering (or no medicine can cure Lady Macbeth's mental state)."
    },
    {
      "number": "3.2.3",
      "marks": 2,
      "clues": "- Look at what the Doctor says he would not do even for money.\n- Think about his values.",
      "approach": "- Name the trait\n- Support it",
      "solution": "1. The Doctor is principled or ethical.\n2. He says not even money will draw him back to Macbeth's 'sick' castle."
    },
    {
      "number": "3.2.4",
      "marks": 2,
      "clues": "- Menteith is answering Malcolm's hope for safety.\n- Think about how sure he is.",
      "approach": "- Name the tone\n- Give the reason",
      "solution": "1. The tone is confident or assured.\n2. He is convinced Scotland will be restored."
    },
    {
      "number": "3.2.5",
      "marks": 2,
      "clues": "- Look at what the soldiers must cut and carry.\n- Name the action in your own words.",
      "approach": "- Describe the instruction\n- Say how it is carried out",
      "solution": "1. Each soldier must cut a branch.\n2. He must hold it in front of himself."
    },
    {
      "number": "3.2.6",
      "marks": 2,
      "clues": "- Think about gestures that show the enemy waiting in the castle.\n- Give two actions.",
      "approach": "- Choose two stage actions\n- Link each to the lines",
      "solution": "1. Siward could move his outstretched hands from left to right, or simulate a circle around the castle.\n2. He could shift his eyes from the people to the castle."
    },
    {
      "number": "3.2.7",
      "marks": 3,
      "clues": "- Think about how Macbeth's honour changes during the play.\n- Use examples from more than one scene.",
      "approach": "- Define honour\n- Give two or three examples",
      "solution": "1. Macbeth and Banquo are praised for valour in battle.\n2. Macbeth fights heroically for Duncan and Scotland.\n3. His honour is corrupted as ambition grows."
    },
    {
      "number": "3.2.8",
      "marks": 3,
      "clues": "- Decide your view of Duncan, then support it with events in the play.\n- A bare yes or no earns nothing.",
      "approach": "- State your view\n- Give evidence",
      "solution": "1. Yes: Duncan acts decisively on Cawdor's treason, rewards Macbeth's bravery and praises Banquo.\n2. No: he trusts Macbeth too easily, misjudges character as Lady Macbeth shows and fails to protect himself."
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
