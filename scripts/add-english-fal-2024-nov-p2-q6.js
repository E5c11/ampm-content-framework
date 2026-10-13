#!/usr/bin/env node
/**
 * DBE English FAL P2 — November 2024 — Macbeth — Extract F (Macbeth's last fight, Act 5 Sc 8). 3.2.1–3.2.7, 17 marks.
 * Practice questions are fresh (DESIGN-UNI-01) and follow the shared rules: context_text null for literature (SETWORK-LES-05),
 * fresh targets, conventions-based for writing (LANG-WR-03); aiExplanation is one entry per REAL printed sub-question with its
 * real marks, derived from the memo in own words (AIEXP-08). Every fitb declares keyboard_type 'text' (LANG-KB-01).
 * Text key: macbeth.
 *
 * BASIS per practice question — BK book knowledge (verify against the text), P printed in the paper/poem, M memo,
 * PT vocabulary/title, C CAPS, P1 language-paper skill:
 *   Q1: M: 2024 memo 3.2.7 — Malcolm takes his rightful seat as king.
 *   Q2: P: Birnam Wood is printed in the 2025 and 2024 extracts.
 *   Q3: BK: Act 4.1.
 *   Q4: BK: Act 5.4 → 5.5 → 5.8 → 5.8.
 *   Q5: BK: Duncan (Act 2) and Banquo (Act 3) die before Act 5.
 *
 *   node tools/validate-questions.js --script scripts/add-english-fal-2024-nov-p2-q6.js --curriculum temp/curriculum-vocab-english-fal.json
 *   node scripts/add-english-fal-2024-nov-p2-q6.js --dry-run
 *   node scripts/add-english-fal-2024-nov-p2-q6.js
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
  "year": 2024,
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
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p2/q6/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p2/q6/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p2/q6/memo_2.png"
  ],
  "exam_question_marks": 17,
  "supplementary_materials": [
    {
      "type": "annexure",
      "label": "Extract F",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p2/q6/annexure_extract_f_1.png",
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p2/q6/annexure_extract_f_2.png"
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
    "question": "Who is made king of Scotland at the end of the play?",
    "metadata": [
      "Banquo",
      "Malcolm",
      "Fleance",
      "Macduff",
      ""
    ],
    "answer": [
      "Malcolm",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "drama",
    "topic": "plot_structure",
    "subtopic": "closing_events",
    "skills": [
      "english_fal_recall_key_events"
    ],
    "difficulty": 1,
    "exam_weight": 1,
    "clues": "- He is Duncan's elder son and heir.\n- He leads the army against Macbeth."
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
    "question": "Which wood does Malcolm's army use as camouflage? Write one word.",
    "metadata": [
      "Wood:",
      "[ ]"
    ],
    "answer": [
      "Birnam",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "definition",
    "unit": "drama",
    "topic": "plot_structure",
    "subtopic": "the_prophecies",
    "skills": [
      "english_fal_recall_key_events"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Macbeth was told he is safe until a wood moves.\n- Write one word.",
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
    "question": "Why does Macbeth go back to the witches in the middle of the play?",
    "metadata": [
      "He wants to ask them to leave Scotland.",
      "He wants them to crown Banquo.",
      "He wants to learn more about his future and whether he is safe.",
      "He wants to thank them for Duncan's death.",
      ""
    ],
    "answer": [
      "He wants to learn more about his future and whether he is safe.",
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
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- By now he is king but afraid.\n- He wants more certainty."
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
    "question": "Arrange these events from the end of the play in the order in which they happen.",
    "metadata": [
      "Macbeth and Macduff fight",
      "Malcolm's army cuts branches from Birnam Wood",
      "Malcolm is hailed as king",
      "Macbeth hears that Lady Macbeth is dead",
      ""
    ],
    "answer": [
      "Malcolm's army cuts branches from Birnam Wood",
      "Macbeth hears that Lady Macbeth is dead",
      "Macbeth and Macduff fight",
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
    "clues": "- The army hides its numbers before the battle.\n- The new king is named last."
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
    "question": "Select the TWO characters who are dead before the final act begins.",
    "metadata": [
      "Duncan",
      "Macbeth",
      "Banquo",
      "Malcolm",
      "Macduff"
    ],
    "answer": [
      "Duncan",
      "Banquo",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "drama",
    "topic": "plot_structure",
    "subtopic": "closing_events",
    "skills": [
      "english_fal_recall_key_events"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "clues": "- Both are killed by Macbeth's orders or hand.\n- The others are alive in the last battle."
  }
];

// ─── AI explanation — one entry per REAL printed sub-question, real marks (AIEXP-08) ───

const aiExplanation = {
  "sub_questions": [
    {
      "number": "3.2.1",
      "marks": 3,
      "clues": "- Macbeth speaks of his soul as if it carried a load.",
      "approach": "- Name the figure\n- Explain it",
      "solution": "1. (a) Metaphor.\n2. (b) As a sinner feels guilty, Macbeth feels guilty for killing Macduff's family and is unwilling to kill again."
    },
    {
      "number": "3.2.2",
      "marks": 2,
      "clues": "- Macduff answers with action, not talk.",
      "approach": "- Say what he means",
      "solution": "1. He does not want to answer Macbeth; his answer will be shown in his sword."
    },
    {
      "number": "3.2.3",
      "marks": 2,
      "clues": "- Irony is the gap between belief and outcome.",
      "approach": "- State Macbeth's belief\n- State the outcome",
      "solution": "1. Macbeth thinks he cannot be killed by a man born naturally.\n2. Macduff, born unnaturally, kills him."
    },
    {
      "number": "3.2.4",
      "marks": 2,
      "clues": "- Think about double-talk.",
      "approach": "- Say why they are called fiends",
      "solution": "1. The witches lie or manipulate, deceiving him with double meanings."
    },
    {
      "number": "3.2.5",
      "marks": 2,
      "clues": "- Think about how Macduff taunts him.",
      "approach": "- Name the tone\n- Say why",
      "solution": "1. The tone is sarcastic or mocking.\n2. Macduff wants Macbeth to feel inadequate."
    },
    {
      "number": "3.2.6",
      "marks": 3,
      "clues": "- Think about who questions manhood.",
      "approach": "- Define manhood\n- Give examples",
      "solution": "1. Lady Macbeth challenges Macbeth's manhood.\n2. Lady Macduff questions Macduff's priorities.\n3. Banquo stays principled."
    },
    {
      "number": "3.2.7",
      "marks": 3,
      "clues": "- Decide whether the ending is positive, then use events.",
      "approach": "- State your view\n- Give evidence",
      "solution": "1. Yes: Malcolm becomes king, order is restored and Macduff helps Malcolm.\n2. No: many people are killed, Lady Macbeth suffers and the witches face no consequences."
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
