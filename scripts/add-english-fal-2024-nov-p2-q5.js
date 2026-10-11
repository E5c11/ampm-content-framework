#!/usr/bin/env node
/**
 * DBE English FAL P2 — November 2024 — Macbeth — Extract E (the banquet and Banquo's ghost, Act 3 Sc 4). 3.1.1–3.1.9, 18 marks.
 * Practice questions are fresh (DESIGN-UNI-01) and follow the shared rules: context_text null for literature (SETWORK-LES-05),
 * fresh targets, conventions-based for writing (LANG-WR-03); aiExplanation is one entry per REAL printed sub-question with its
 * real marks, derived from the memo in own words (AIEXP-08). Every fitb declares keyboard_type 'text' (LANG-KB-01).
 * Text key: macbeth.
 *
 * BASIS per practice question — BK book knowledge (verify against the text), P printed in the paper/poem, M memo,
 * PT vocabulary/title, C CAPS, P1 language-paper skill:
 *   Q1: BK: Act 2.1 → 3.4 → 5.1 → 5.8.
 *   Q2: P: Dunsinane is printed in the 2025 and 2024 extracts.
 *   Q3: BK: core plot facts.
 *   Q4: BK/M: Banquo (Act 3) and Macduff's family (2024 memo 3.2.1).
 *   Q5: BK: Act 1.3 — 'that shalt be king hereafter'; 2024 memo 3.1.9 refers to the prediction.
 *
 *   node tools/validate-questions.js --script scripts/add-english-fal-2024-nov-p2-q5.js --curriculum temp/curriculum-vocab-english-fal.json
 *   node scripts/add-english-fal-2024-nov-p2-q5.js --dry-run
 *   node scripts/add-english-fal-2024-nov-p2-q5.js
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
  "year": 2024,
  "paper": "nov_p2",
  "order": 5,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "literary_essay",
    "character_analysis",
    "dramatic_techniques"
  ],
  "text_key": "macbeth",
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p2/q5/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p2/q5/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p2/q5/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p2/q5/memo_2.png"
  ],
  "exam_question_marks": 18,
  "supplementary_materials": [
    {
      "type": "annexure",
      "label": "Extract E",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p2/q5/annexure_extract_e_1.png",
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p2/q5/annexure_extract_e_2.png"
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
    "year": 2024,
    "paper": "nov_p2",
    "name": "Question 1",
    "text_key": "macbeth",
    "order": 1,
    "context_text": null,
    "question": "Arrange these events from Macbeth in the order in which they happen.",
    "metadata": [
      "Macbeth fights Macduff",
      "Macbeth sees Banquo's ghost at the feast",
      "Macbeth sees a dagger before Duncan's murder",
      "Lady Macbeth sleepwalks",
      ""
    ],
    "answer": [
      "Macbeth sees a dagger before Duncan's murder",
      "Macbeth sees Banquo's ghost at the feast",
      "Lady Macbeth sleepwalks",
      "Macbeth fights Macduff",
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
    "clues": "- The dagger comes before the murder.\n- The final fight is the last event."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2024,
    "paper": "nov_p2",
    "name": "Question 2",
    "text_key": "macbeth",
    "order": 2,
    "context_text": null,
    "question": "At which castle does Macbeth make his last stand? Write one word.",
    "metadata": [
      "Hill:",
      "[ ]"
    ],
    "answer": [
      "Dunsinane",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "definition",
    "unit": "drama",
    "topic": "plot_structure",
    "subtopic": "places_in_the_play",
    "skills": [
      "english_fal_identify_setting"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- The forest is said to come to this place.\n- Write one word.",
    "keyboard_type": "text"
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2024,
    "paper": "nov_p2",
    "name": "Question 3",
    "text_key": "macbeth",
    "order": 3,
    "context_text": null,
    "question": "Match each character from Macbeth to the description that fits.",
    "metadata": [
      "A - Duncan",
      "B - Banquo",
      "C - Lady Macduff",
      "1 - Macbeth's friend whose descendants the witches say will be kings",
      "2 - Macduff's wife, killed with her children",
      "3 - the king who is murdered in Macbeth's castle"
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
    "clues": "- Think about who is king when the play begins.\n- One woman is not Macbeth's wife."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2024,
    "paper": "nov_p2",
    "name": "Question 4",
    "text_key": "macbeth",
    "order": 4,
    "context_text": null,
    "question": "Select the TWO crimes that Macbeth orders after he becomes king.",
    "metadata": [
      "He orders Banquo's murder.",
      "He gives his crown to Malcolm.",
      "He has Macduff's family killed.",
      "He sails to England.",
      "He frees the witches."
    ],
    "answer": [
      "He orders Banquo's murder.",
      "He has Macduff's family killed.",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "drama",
    "topic": "plot_structure",
    "subtopic": "key_events",
    "skills": [
      "english_fal_identify_stated_reasons"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "clues": "- Both are meant to remove threats to his rule.\n- Reject actions that do not appear in the play."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2024,
    "paper": "nov_p2",
    "name": "Question 5",
    "text_key": "macbeth",
    "order": 5,
    "context_text": null,
    "question": "What do the witches promise Macbeth when he first meets them?",
    "metadata": [
      "That he will die in battle at once.",
      "That he will lose his castle.",
      "That he will marry a queen.",
      "That he will be king in the future.",
      ""
    ],
    "answer": [
      "That he will be king in the future.",
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
      "english_fal_recall_key_events"
    ],
    "difficulty": 1,
    "exam_weight": 1,
    "clues": "- They greet him with titles that he does not yet hold.\n- The last title is the greatest."
  }
];

// ─── AI explanation — one entry per REAL printed sub-question, real marks (AIEXP-08) ───

const aiExplanation = {
  "sub_questions": [
    {
      "number": "3.1.1",
      "marks": 4,
      "clues": "- Recall each man's role in the play.",
      "approach": "- Match what you know\n- Eliminate descriptions",
      "solution": "1. Macduff is Thane of Fife.\n2. Macbeth is King Duncan's cousin.\n3. Fleance is Banquo's teenage son.\n4. Malcolm is King Duncan's heir."
    },
    {
      "number": "3.1.2",
      "marks": 2,
      "clues": "- Think about the feast and Banquo's ghost.",
      "approach": "- Say what happens\n- Give the place",
      "solution": "1. It is when Macbeth sees Banquo's ghost during the feast.\n2. It is in the banqueting hall of the palace at Forres."
    },
    {
      "number": "3.1.3",
      "marks": 2,
      "clues": "- Think about gestures of defiance.",
      "approach": "- Choose two actions",
      "solution": "1. Beat his chest; approach the ghost; pace up and down; throw his hands in the air (any two)."
    },
    {
      "number": "3.1.4",
      "marks": 2,
      "clues": "- Look at what worries Lady Macbeth about the evening.",
      "approach": "- Name a trait\n- Support it",
      "solution": "1. She is insensitive or selfish because she cares more about the mood of the feast.\n2. Or she is well-composed, staying calm despite his behaviour."
    },
    {
      "number": "3.1.5",
      "marks": 1,
      "clues": "- Think about what only Macbeth can see.",
      "approach": "- Use the context",
      "solution": "1. 'Such sights' refers to Banquo's ghost: D."
    },
    {
      "number": "3.1.6",
      "marks": 1,
      "clues": "- Think about what she fears Ross might learn.",
      "approach": "- Say why",
      "solution": "1. She does not want Ross to question Macbeth, who might reveal their secret."
    },
    {
      "number": "3.1.7",
      "marks": 2,
      "clues": "- Look at Lennox's wish for Macbeth.",
      "approach": "- Name a state of mind",
      "solution": "1. Lennox is concerned about Macbeth's well-being, or hopeful of a speedy recovery."
    },
    {
      "number": "3.1.8",
      "marks": 1,
      "clues": "- Replace the wrong place.",
      "approach": "- Find the wrong word",
      "solution": "1. Macbeth's coronation takes place at Scone."
    },
    {
      "number": "3.1.9",
      "marks": 3,
      "clues": "- Decide whether unnatural events matter, then use events.",
      "approach": "- State your view\n- Give evidence",
      "solution": "1. Yes: the witches' prediction drives the plot, Banquo's ghost unnerves Macbeth, and Duncan's murder leads to Lady Macbeth's madness.\n2. No: Macbeth's ambition fuels his actions and the guilt of Macbeth and his wife has the dire consequences."
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
