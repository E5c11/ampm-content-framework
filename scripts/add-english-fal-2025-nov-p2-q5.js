#!/usr/bin/env node
/**
 * DBE English FAL P2 — November 2025 — Macbeth — Extract E (Macbeth and Lady Macbeth before and after the murder, Act 2 Sc 1–2). 3.1.1–3.1.7, 18 marks.
 * Practice questions follow the HL Paper 2 pattern: context_text null, FRESH targets from elsewhere in the text, never the
 * exam's own statements or the memo's answers (DESIGN-UNI-01); they carry text_key "macbeth" on lesson and every
 * question (SETWORK-LES-01). aiExplanation: one entry per REAL exam sub-question with its real marks, derived from the
 * memo in own words (AIEXP-08). Every fitb declares keyboard_type 'text' (LANG-KB-01).
 *
 * FACTUAL BASIS per practice question — BK = book knowledge (verify against the text), P = printed in the exam paper's
 * extract/poem, M = established by the memo, PT = vocabulary/title meaning:
 *   Q1: BK: Act 1.3 → 2.2 → 2.4 (crowning at Scone) → 3.3.
 *   Q2: BK: Banquo's ghost appears to Macbeth (Act 3, Scene 4).
 *   Q3: BK: sleepwalking scene Act 5.1 ('Out, damned spot').
 *   Q4: BK: core plot facts.
 *   Q5: BK: ambition and guilt are standard themes.
 *
 *   node tools/validate-questions.js --script scripts/add-english-fal-2025-nov-p2-q5.js --curriculum temp/curriculum-vocab-english-fal.json
 *   node scripts/add-english-fal-2025-nov-p2-q5.js --dry-run
 *   node scripts/add-english-fal-2025-nov-p2-q5.js
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
  "name": "Question 3.1: Macbeth",
  "syllabus": "dbe",
  "subject": "english_fal",
  "year": 2025,
  "paper": "nov_p2",
  "order": 5,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "literary_essay",
    "character_analysis",
    "figurative_language",
    "dramatic_techniques"
  ],
  "text_key": "macbeth",
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p2/q5/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p2/q5/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p2/q5/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p2/q5/memo_2.png"
  ],
  "exam_question_marks": 18,
  "supplementary_materials": [
    {
      "type": "annexure",
      "label": "Extract E",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p2/q5/annexure_extract_e_1.png"
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
    "question": "Arrange these events from Macbeth in the order in which they happen.",
    "metadata": [
      "Banquo is murdered",
      "Duncan is murdered",
      "The witches greet Macbeth with their prophecies",
      "Macbeth is crowned king",
      ""
    ],
    "answer": [
      "The witches greet Macbeth with their prophecies",
      "Duncan is murdered",
      "Macbeth is crowned king",
      "Banquo is murdered",
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
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- The prophecies are what start Macbeth's ambition.\n- Macbeth must be king before he orders more killings."
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
    "question": "To whom does the ghost of Banquo appear at the banquet? Write one word.",
    "metadata": [
      "Name:",
      "[ ]"
    ],
    "answer": [
      "Macbeth",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "definition",
    "unit": "drama",
    "topic": "plot_structure",
    "subtopic": "key_events",
    "skills": [
      "english_fal_recall_key_events"
    ],
    "difficulty": 1,
    "exam_weight": 1,
    "clues": "- Only one person at the banquet can see the ghost.\n- Write one word.",
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
    "question": "What does Lady Macbeth do in the sleepwalking scene?",
    "metadata": [
      "She orders more soldiers to defend the castle.",
      "She tries to wash imagined blood from her hands.",
      "She laughs and dances with the doctor.",
      "She reads a letter from Duncan.",
      ""
    ],
    "answer": [
      "She tries to wash imagined blood from her hands.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "drama",
    "topic": "character_analysis",
    "subtopic": "lady_macbeth",
    "skills": [
      "english_fal_recall_key_events"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Think about what she feels guilty about.\n- She is seen at night, in her nightgown."
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
    "question": "Match each character from Macbeth to the description that fits.",
    "metadata": [
      "A - Lady Macbeth",
      "B - Macduff",
      "C - Duncan",
      "1 - kills Macbeth at the end of the play",
      "2 - the king who is murdered at Macbeth's castle",
      "3 - urges her husband to kill the king"
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
    "clues": "- Think about who is married to Macbeth and who ends the play as Macbeth's enemy.\n- One character is already dead before the final act."
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
    "question": "Select the TWO themes that are explored in the play.",
    "metadata": [
      "ambition",
      "friendship and travel",
      "guilt",
      "wealth through trade",
      ""
    ],
    "answer": [
      "ambition",
      "guilt",
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
    "difficulty": 1,
    "exam_weight": 1,
    "clues": "- Think about what drives Macbeth and what haunts him afterwards.\n- The other options do not fit the play's story."
  }
];

// ─── AI explanation — one entry per REAL exam sub-question, real marks (AIEXP-08) ───

const aiExplanation = {
  "sub_questions": [
    {
      "number": "3.1.1",
      "marks": 4,
      "clues": "- Think about what each character does or is told in the play.\n- Match the ones you are sure of first.",
      "approach": "- Match Malcolm, Fleance, Ross and Macbeth to their descriptions\n- Check each pair against the play",
      "solution": "1. Malcolm seeks the help of King Edward the Confessor.\n2. Fleance is predicted to become the king of Scotland (through Banquo's line).\n3. Ross tries to save the lives of Macduff's family.\n4. Macbeth is Thane of Glamis when the play opens."
    },
    {
      "number": "3.1.2",
      "marks": 2,
      "clues": "- Look at what Macbeth does not want the earth to hear.\n- What feeling comes with such fear?",
      "approach": "- Name the state of mind\n- Support it with his words",
      "solution": "1. Macbeth is anxious or nervous.\n2. He agonises over his footsteps being heard."
    },
    {
      "number": "3.1.3",
      "marks": 3,
      "clues": "- The bell is a signal; think about the plan for the night.\n- Use the stage direction for the place.",
      "approach": "- Say what the bell signals\n- Place the scene",
      "solution": "1. (a) The bell signals that Macbeth should go and kill Duncan, as the guards are drugged and all is ready.\n2. (b) It takes place after Macbeth's vision of a dagger, in the courtyard of his castle, before he kills Duncan."
    },
    {
      "number": "3.1.4",
      "marks": 3,
      "clues": "- An owl and a bellman are given roles beyond their usual ones.\n- Link the owl's shriek to death.",
      "approach": "- Name the figure of speech\n- Explain the comparison",
      "solution": "1. The lines use metaphor or personification.\n2. The owl's shriek is like a bellman's final good-night to a condemned man, foreshadowing Duncan's murder."
    },
    {
      "number": "3.1.5",
      "marks": 1,
      "clues": "- Think about who watches over a king while he sleeps.\n- Rule out options that are not people.",
      "approach": "- Read the word 'grooms' in context\n- Choose the best meaning",
      "solution": "1. The grooms are Duncan's guards, so the answer is C."
    },
    {
      "number": "3.1.6",
      "marks": 2,
      "clues": "- Think about what Lady Macbeth says about the attempt and the deed.\n- Is she afraid of the murder itself or of being caught?",
      "approach": "- State her fear\n- Link it to the lines",
      "solution": "1. She fears that they might be caught out in the attempt to kill Duncan.\n2. She fears being found out more than the deed itself."
    },
    {
      "number": "3.1.7",
      "marks": 3,
      "clues": "- Decide your view, then support it with events from the whole play.\n- A bare yes or no earns nothing.",
      "approach": "- State your view\n- Give evidence\n- Link to the conflict's consequences",
      "solution": "1. Yes: Macduff acts against Macbeth the perpetrator, is not 'born of woman' and must heal Scotland by killing the tyrant.\n2. No: the conflict would not exist if Macbeth had not believed the witches or murdered Macduff's family."
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
