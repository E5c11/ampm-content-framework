#!/usr/bin/env node
/**
 * DBE English FAL P2 — November 2025 — Macbeth — Extract F (Macbeth prepares for battle; Malcolm's army, Act 5 Sc 3–4). 3.2.1–3.2.8, 17 marks.
 * Practice questions follow the HL Paper 2 pattern: context_text null, FRESH targets from elsewhere in the text, never the
 * exam's own statements or the memo's answers (DESIGN-UNI-01); they carry text_key "macbeth" on lesson and every
 * question (SETWORK-LES-01). aiExplanation: one entry per REAL exam sub-question with its real marks, derived from the
 * memo in own words (AIEXP-08). Every fitb declares keyboard_type 'text' (LANG-KB-01).
 *
 * FACTUAL BASIS per practice question — BK = book knowledge (verify against the text), P = printed in the exam paper's
 * extract/poem, M = established by the memo, PT = vocabulary/title meaning:
 *   Q1: BK: Act 5.5 'She should have died hereafter … Tomorrow and tomorrow … a tale told by an idiot'.
 *   Q2: BK: Macduff kills Macbeth (Act 5.8).
 *   Q3: BK: Macduff was 'from his mother's womb untimely ripp'd' (Act 5.8).
 *   Q4: BK: Act 5.4 → 5.5 → 5.8 (fight) → 5.8 (Malcolm proclaimed).
 *   Q5: BK + P: prophecies of the apparitions (Act 4.1); the Birnam Wood line is also printed in Extract F.
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
    "context_text": null,
    "question": "How does Macbeth react when he hears that Lady Macbeth is dead?",
    "metadata": [
      "He prays for forgiveness and gives up the crown.",
      "He orders a great funeral for the queen.",
      "He says that life is 'a tale told by an idiot, signifying nothing'.",
      "He blames Malcolm for her death.",
      ""
    ],
    "answer": [
      "He says that life is 'a tale told by an idiot, signifying nothing'.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "drama",
    "topic": "character_analysis",
    "subtopic": "macbeth_reaction",
    "skills": [
      "english_fal_recall_key_events"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "clues": "- Think about his famous speech that begins with 'Tomorrow'.\n- He is no longer able to feel hope."
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
    "context_text": null,
    "question": "Which character kills Macbeth at the end of the play? Write one name.",
    "metadata": [
      "Surname:",
      "[ ]"
    ],
    "answer": [
      "Macduff",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "definition",
    "unit": "drama",
    "topic": "plot_structure",
    "subtopic": "closing_events",
    "skills": [
      "english_fal_recall_key_events"
    ],
    "difficulty": 1,
    "exam_weight": 1,
    "clues": "- He is a Scottish thane whose family Macbeth had killed.\n- Write one name.",
    "keyboard_type": "text"
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
    "context_text": null,
    "question": "Macbeth believes that no man born of woman can harm him. Why can Macduff?",
    "metadata": [
      "He is a ghost who cannot be harmed.",
      "He was born in England, so Scottish law does not apply.",
      "He carries a magic sword given by the witches.",
      "He was not born in the usual way, as he was 'untimely ripped' from his mother.",
      ""
    ],
    "answer": [
      "He was not born in the usual way, as he was 'untimely ripped' from his mother.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "drama",
    "topic": "plot_structure",
    "subtopic": "the_prophecies",
    "skills": [
      "english_fal_explain_reason_in_context"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "clues": "- Think about the exact words of the prophecy and how Macduff was born.\n- The answer is about his birth, not a weapon."
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
    "context_text": null,
    "question": "Arrange these events from the end of the play in the order in which they happen.",
    "metadata": [
      "Macduff kills Macbeth",
      "Malcolm orders his soldiers to carry branches",
      "Malcolm is hailed as king",
      "Lady Macbeth's death is announced",
      ""
    ],
    "answer": [
      "Malcolm orders his soldiers to carry branches",
      "Lady Macbeth's death is announced",
      "Macduff kills Macbeth",
      "Malcolm is hailed as king",
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
    "clues": "- Think about the order of the final act: the plan, the news, the fight and the crowning.\n- The new king is named last."
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
    "question": "Select the TWO prophecies that give Macbeth a false sense of safety.",
    "metadata": [
      "No man born of woman can harm him",
      "He will die at sea",
      "He will not be defeated until Birnam Wood comes to Dunsinane",
      "Macduff will become king of Scotland",
      ""
    ],
    "answer": [
      "No man born of woman can harm him",
      "He will not be defeated until Birnam Wood comes to Dunsinane",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "drama",
    "topic": "plot_structure",
    "subtopic": "the_prophecies",
    "skills": [
      "english_fal_identify_stated_reasons"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "clues": "- Think about the second set of apparitions Macbeth sees.\n- One prophecy is about birth and one is about a forest."
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
