#!/usr/bin/env node
/**
 * DBE English FAL P2 — November 2024 — My Children! My Africa! — Extract H (Mr M in the empty classroom, Act 2 Sc 3). 4.2.1–4.2.8, 18 marks.
 * Practice questions are fresh (DESIGN-UNI-01) and follow the shared rules: context_text null for literature (SETWORK-LES-05),
 * fresh targets, conventions-based for writing (LANG-WR-03); aiExplanation is one entry per REAL printed sub-question with its
 * real marks, derived from the memo in own words (AIEXP-08). Every fitb declares keyboard_type 'text' (LANG-KB-01).
 * Text key: my_children_my_africa.
 *
 * BASIS per practice question — BK book knowledge (verify against the text), P printed in the paper/poem, M memo,
 * PT vocabulary/title, C CAPS, P1 language-paper skill:
 *   Q1: M/BK: memo 2024 4.2.7 names Miss Brockway; 'headmistress' is book knowledge — verify.
 *   Q2: M: 2025 memo 4.1.6 — the pupils kill Mr M.
 *   Q3: M: 2025 memo 4.1.6 and 2024 memo 4.2.5.
 *   Q4: M: 2024 memo 4.2.7 and 4.2.8.
 *
 *   node tools/validate-questions.js --script scripts/add-english-fal-2024-nov-p2-q8.js --curriculum temp/curriculum-vocab-english-fal.json
 *   node scripts/add-english-fal-2024-nov-p2-q8.js --dry-run
 *   node scripts/add-english-fal-2024-nov-p2-q8.js
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
  "year": 2024,
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
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p2/q8/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p2/q8/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p2/q8/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p2/q8/memo_2.png"
  ],
  "exam_question_marks": 18,
  "supplementary_materials": [
    {
      "type": "annexure",
      "label": "Extract H",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p2/q8/annexure_extract_h_1.png"
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
    "question": "Who is Miss Brockway?",
    "metadata": [
      "a Comrade at Zolile High",
      "Isabel's cousin in Cape Town",
      "the headmistress at Camdeboo Girls' High who works with Mr M",
      "the township police officer",
      ""
    ],
    "answer": [
      "the headmistress at Camdeboo Girls' High who works with Mr M",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "drama",
    "topic": "character_analysis",
    "subtopic": "characters_and_roles",
    "skills": [
      "english_fal_match_characters_to_roles"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "clues": "- She works for Isabel's school.\n- She and Mr M arrange the contest."
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
    "question": "Whose death ends the play? Write the name.",
    "metadata": [
      "Name:",
      "[ ]"
    ],
    "answer": [
      "Mr M",
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
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- He is a teacher who keeps ringing the school bell.\n- Write the name.",
    "keyboard_type": "text"
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
    "question": "Select the TWO things that Mr M stands for.",
    "metadata": [
      "a belief in education",
      "a plan to leave the country",
      "a refusal to join the Comrades",
      "a wish to become a politician",
      "a fear of books"
    ],
    "answer": [
      "a belief in education",
      "a refusal to join the Comrades",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "drama",
    "topic": "character_analysis",
    "subtopic": "mr_m",
    "skills": [
      "english_fal_identify_stated_reasons"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "clues": "- Think about what he keeps doing even when it is dangerous.\n- He does not give in to pressure."
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
    "question": "Match each place from the play to its description.",
    "metadata": [
      "A - Zolile High",
      "B - Camdeboo Girls' High",
      "C - Grahamstown",
      "1 - Isabel's school",
      "2 - where the literature quiz is held",
      "3 - Thami's township school"
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
    "topic": "plot_structure",
    "subtopic": "places_in_the_play",
    "skills": [
      "english_fal_identify_setting"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Two are schools and one is a town.\n- Use the pair you are certain about first."
  }
];

// ─── AI explanation — one entry per REAL printed sub-question, real marks (AIEXP-08) ───

const aiExplanation = {
  "sub_questions": [
    {
      "number": "4.2.1",
      "marks": 2,
      "clues": "- Think about what an empty classroom means to Mr M.",
      "approach": "- Say why the silence is heavy",
      "solution": "1. The learners' absence leaves him without a purpose, depressed."
    },
    {
      "number": "4.2.2",
      "marks": 2,
      "clues": "- Think about gestures of despair.",
      "approach": "- Choose two actions",
      "solution": "1. Throw his hands in the air; stamp his foot; bang on the table (any two)."
    },
    {
      "number": "4.2.3",
      "marks": 2,
      "clues": "- Think about who may be listening to the bell.",
      "approach": "- Name his state of mind\n- Say why",
      "solution": "1. Thami is fearful or anxious.\n2. The bell may alert the Comrades to Mr M's whereabouts and they might kill him."
    },
    {
      "number": "4.2.4",
      "marks": 3,
      "clues": "- The bell is compared to music.",
      "approach": "- Name the figure\n- Explain it",
      "solution": "1. (a) Simile.\n2. (b) It shows how Thami once loved the bell, which is symbolic of his love of education."
    },
    {
      "number": "4.2.5",
      "marks": 2,
      "clues": "- Look at how he answers the warning.",
      "approach": "- Name a trait\n- Support it",
      "solution": "1. Mr M is fearless or defiant because he refuses to walk away from danger."
    },
    {
      "number": "4.2.6",
      "marks": 1,
      "clues": "- Replace the relationship.",
      "approach": "- Find the wrong word",
      "solution": "1. Lucille is Isabel's sister; Renee is her friend."
    },
    {
      "number": "4.2.7",
      "marks": 3,
      "clues": "- Think about who works together.",
      "approach": "- Define teamwork\n- Give examples",
      "solution": "1. Isabel and Thami work towards the literature quiz.\n2. Mr M and Miss Brockway foster relations between the schools.\n3. Isabel and her teammates work for victory."
    },
    {
      "number": "4.2.8",
      "marks": 3,
      "clues": "- Decide whether the contest is a good idea, then use events.",
      "approach": "- State your view\n- Give evidence",
      "solution": "1. Yes: it leads to the literature quiz, shows township pupils can compete and teaches Isabel about Black people's reality.\n2. No: it may be unsafe, Zolile pupils are inexperienced and English is their second language."
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
