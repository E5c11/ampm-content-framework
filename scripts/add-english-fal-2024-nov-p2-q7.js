#!/usr/bin/env node
/**
 * DBE English FAL P2 — November 2024 — My Children! My Africa! — Extract G (Thami and Isabel relaxed, Act 1 Sc 1). 4.1.1–4.1.8, 17 marks.
 * Practice questions are fresh (DESIGN-UNI-01) and follow the shared rules: context_text null for literature (SETWORK-LES-05),
 * fresh targets, conventions-based for writing (LANG-WR-03); aiExplanation is one entry per REAL printed sub-question with its
 * real marks, derived from the memo in own words (AIEXP-08). Every fitb declares keyboard_type 'text' (LANG-KB-01).
 * Text key: my_children_my_africa.
 *
 * BASIS per practice question — BK book knowledge (verify against the text), P printed in the paper/poem, M memo,
 * PT vocabulary/title, C CAPS, P1 language-paper skill:
 *   Q1: M: 2024 memo 4.2.7 names Zolile High and Camdeboo Girls' High.
 *   Q2: M: 2024 memo 4.2.7/4.2.8 — the debating contest.
 *   Q3: M: 2025 memo 4.2.2(b) and 4.1.6; broad order.
 *   Q4: M: 2024 memo 4.1.6 — Bantu Education and the revolt against it.
 *
 *   node tools/validate-questions.js --script scripts/add-english-fal-2024-nov-p2-q7.js --curriculum temp/curriculum-vocab-english-fal.json
 *   node scripts/add-english-fal-2024-nov-p2-q7.js --dry-run
 *   node scripts/add-english-fal-2024-nov-p2-q7.js
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
  "year": 2024,
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
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p2/q7/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p2/q7/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p2/q7/memo_2.png"
  ],
  "exam_question_marks": 17,
  "supplementary_materials": [
    {
      "type": "annexure",
      "label": "Extract G",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p2/q7/annexure_extract_g_1.png"
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
    "text_key": "my_children_my_africa",
    "order": 1,
    "context_text": null,
    "question": "What is the name of the township school where Thami studies? Write one word.",
    "metadata": [
      "School:",
      "[ ]"
    ],
    "answer": [
      "Zolile",
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
    "clues": "- It is the school of the boy, not the girl.\n- Write one word.",
    "keyboard_type": "text"
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2024,
    "paper": "nov_p2",
    "name": "Question 2",
    "text_key": "my_children_my_africa",
    "order": 2,
    "context_text": null,
    "question": "What event first brings Thami and Isabel together?",
    "metadata": [
      "a football match at the township",
      "a church choir competition",
      "a political rally",
      "a debating competition between their schools",
      ""
    ],
    "answer": [
      "a debating competition between their schools",
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
      "english_fal_recall_key_events"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- The two schools are arranged by their teachers.\n- Words and arguments are involved."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2024,
    "paper": "nov_p2",
    "name": "Question 3",
    "text_key": "my_children_my_africa",
    "order": 3,
    "context_text": null,
    "question": "Arrange these events from the play in the order in which they happen.",
    "metadata": [
      "They talk and get to know each other",
      "Mr M is killed",
      "Thami and Isabel are chosen as a team",
      "Thami withdraws from the quiz",
      ""
    ],
    "answer": [
      "Thami and Isabel are chosen as a team",
      "They talk and get to know each other",
      "Thami withdraws from the quiz",
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
    "clues": "- The pupils must be paired before they can talk.\n- Mr M's death is the tragic end."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2024,
    "paper": "nov_p2",
    "name": "Question 4",
    "text_key": "my_children_my_africa",
    "order": 4,
    "context_text": null,
    "question": "Why do the Comrades boycott classes?",
    "metadata": [
      "to celebrate the end of the school year",
      "to protest against Bantu Education",
      "to demand longer school holidays",
      "to support the police",
      ""
    ],
    "answer": [
      "to protest against Bantu Education",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "drama",
    "topic": "theme_identification",
    "subtopic": "themes_of_the_play",
    "skills": [
      "english_fal_identify_theme_evidence"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Think about the education system at the time of the play.\n- It is described as inferior."
  }
];

// ─── AI explanation — one entry per REAL printed sub-question, real marks (AIEXP-08) ───

const aiExplanation = {
  "sub_questions": [
    {
      "number": "4.1.1",
      "marks": 4,
      "clues": "- Recall each person's role in the play.",
      "approach": "- Match what you know first\n- Use the remaining descriptions",
      "solution": "1. Mrs Makatini is the vetkoek seller.\n2. Mr Myalatya organises a debating competition.\n3. Thami Mbikwana abandons the literature quiz.\n4. Isabel Dyson wins the debating competition."
    },
    {
      "number": "4.1.2",
      "marks": 2,
      "clues": "- Think about what the characters are doing.",
      "approach": "- Say the time\n- Give the place",
      "solution": "1. It takes place after the debating contest.\n2. It is at Zolile High School, in Number One Classroom."
    },
    {
      "number": "4.1.3",
      "marks": 1,
      "clues": "- Look at what Thami says about sport.",
      "approach": "- Name the sport",
      "solution": "1. Thami's favourite sport is soccer."
    },
    {
      "number": "4.1.4",
      "marks": 1,
      "clues": "- Think about where Isabel lives.",
      "approach": "- Choose the town",
      "solution": "1. Auntie lives in Brakwater: B."
    },
    {
      "number": "4.1.5",
      "marks": 2,
      "clues": "- Look at how proudly Thami says his name.",
      "approach": "- Name the tone\n- Say why",
      "solution": "1. The tone is confident or boastful.\n2. Thami is proud of his ancestry."
    },
    {
      "number": "4.1.6",
      "marks": 2,
      "clues": "- Re-read what Thami says about the family.",
      "approach": "- Say what the father does\n- Say what the mother does",
      "solution": "1. Isabel's father is a chemist who owns the Karoo Pharmacy.\n2. Her mother works in the pharmacy."
    },
    {
      "number": "4.1.7",
      "marks": 2,
      "clues": "- Irony: safe place versus what happens.",
      "approach": "- State the plan\n- State the result",
      "solution": "1. Thami's parents send him to Brakwater to keep him safe.\n2. Yet he experiences unrest and boycotts there."
    },
    {
      "number": "4.1.8",
      "marks": 3,
      "clues": "- Decide if Thami is exemplary, then use events.",
      "approach": "- State your view\n- Give evidence",
      "solution": "1. Yes: he works hard, represents his school, lets Mr M guide him and perseveres to Standard 10.\n2. No: his political involvement interrupts his learning, he challenges Mr M and does not entice pupils back."
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
