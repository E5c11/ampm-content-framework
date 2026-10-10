#!/usr/bin/env node
/**
 * DBE English FAL P2 — November 2025 — Strange Case of Dr Jekyll and Mr Hyde — Extract C (Enfield's story, 'Story of the Door'). 2.1.1–2.1.7, 17 marks.
 * Practice questions are fresh (DESIGN-UNI-01), mirror the sub-question types (LANG-EX-02) and carry text_key
 * "strange_case_of_dr_jekyll_and_mr_hyde" on lesson and every question (SETWORK-LES-01). aiExplanation: one entry per REAL exam
 * sub-question with its real marks, derived from the memo in own words (AIEXP-08). Every fitb declares
 * keyboard_type 'text' (LANG-KB-01).
 *
 *   node tools/validate-questions.js --script scripts/add-english-fal-2025-nov-p2-q3.js --curriculum temp/curriculum-vocab-english-fal.json
 *   node scripts/add-english-fal-2025-nov-p2-q3.js --dry-run
 *   node scripts/add-english-fal-2025-nov-p2-q3.js
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
  "name": "Question 2.1: Strange Case of Dr Jekyll and Mr Hyde",
  "syllabus": "dbe",
  "subject": "english_fal",
  "year": 2025,
  "paper": "nov_p2",
  "order": 3,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "literary_essay",
    "character_analysis",
    "figurative_language"
  ],
  "text_key": "strange_case_of_dr_jekyll_and_mr_hyde",
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p2/q3/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p2/q3/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p2/q3/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p2/q3/memo_2.png"
  ],
  "exam_question_marks": 17,
  "supplementary_materials": [
    {
      "type": "annexure",
      "label": "Extract C",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p2/q3/annexure_extract_c_1.png"
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
    "text_key": "strange_case_of_dr_jekyll_and_mr_hyde",
    "order": 1,
    "context_text": null,
    "question": "Match each character from Strange Case of Dr Jekyll and Mr Hyde to the description that fits.",
    "metadata": [
      "A - Mr Utterson",
      "B - Mr Enfield",
      "C - Poole",
      "1 - a relative of Utterson who tells the story of the door",
      "2 - Dr Jekyll's loyal servant",
      "3 - a lawyer who investigates the mystery of Mr Hyde"
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
    "unit": "novel",
    "topic": "character_analysis",
    "subtopic": "match_characters_to_roles",
    "skills": [
      "english_fal_match_characters_to_roles"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Think about who tells the story at the door and who is employed by Jekyll.\n- Use the pair you are sure of to narrow the rest."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Question 2",
    "text_key": "strange_case_of_dr_jekyll_and_mr_hyde",
    "order": 2,
    "context_text": "The fog was a grey blanket that smothered the street.",
    "question": "Which figure of speech is used in the sentence below?",
    "metadata": [
      "metaphor",
      "simile",
      "alliteration",
      "onomatopoeia",
      ""
    ],
    "answer": [
      "metaphor",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "novel",
    "topic": "figurative_language",
    "subtopic": "metaphor_identification",
    "skills": [
      "english_fal_identify_figure_of_speech"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Look for a direct comparison without 'like' or 'as'.\n- Ask whether the sentence says one thing IS another."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Question 3",
    "text_key": "strange_case_of_dr_jekyll_and_mr_hyde",
    "order": 3,
    "context_text": null,
    "question": "Select the TWO reasons why Mr Hyde agrees to pay the child's family.",
    "metadata": [
      "He wants to avoid a confrontation with the bystanders",
      "He wants the girl's family to forgive him because he is sorry",
      "He wants to avoid the police becoming involved",
      "He wants to buy the house with the door",
      "He wants to impress Mr Utterson"
    ],
    "answer": [
      "He wants to avoid a confrontation with the bystanders",
      "He wants to avoid the police becoming involved",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "novel",
    "topic": "plot_structure",
    "subtopic": "motives_in_context",
    "skills": [
      "english_fal_identify_stated_reasons"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "clues": "- Think about who surrounds Hyde when he is caught.\n- Consider what trouble he would face if he refused to pay."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Question 4",
    "text_key": "strange_case_of_dr_jekyll_and_mr_hyde",
    "order": 4,
    "context_text": "'You need not worry,' said the stranger coolly. 'The money will be paid in full, and I will wait here while it is fetched.'",
    "question": "What tone would a speaker use for the words below?",
    "metadata": [
      "frightened and apologetic",
      "sad and ashamed",
      "confident and sarcastic",
      "excited and eager",
      ""
    ],
    "answer": [
      "confident and sarcastic",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "novel",
    "topic": "tone_and_mood",
    "subtopic": "tone_identification",
    "skills": [
      "english_fal_identify_tone"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "clues": "- Think about how a person who is sure of himself would say these words.\n- A reassuring promise can also sound mocking."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Question 5",
    "text_key": "strange_case_of_dr_jekyll_and_mr_hyde",
    "order": 5,
    "context_text": null,
    "question": "Mr Utterson respects boundaries. Which ONE answer is best substantiated by events in the novel?",
    "metadata": [
      "Utterson spreads Enfield's story to all his friends.",
      "Utterson avoids gossip when Enfield tells his story, and only acts to investigate Hyde after the murder.",
      "Utterson breaks into houses at the start of the book.",
      "Utterson ignores every rumour about Hyde.",
      ""
    ],
    "answer": [
      "Utterson avoids gossip when Enfield tells his story, and only acts to investigate Hyde after the murder.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "novel",
    "topic": "theme_identification",
    "subtopic": "discuss_view_with_evidence",
    "skills": [
      "english_fal_substantiate_a_view"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "clues": "- Look for an option that shows Utterson holding back before he acts.\n- Eliminate options that are not in the novel."
  }
];

// ─── AI explanation — one entry per REAL exam sub-question, real marks (AIEXP-08) ───

const aiExplanation = {
  "sub_questions": [
    {
      "number": "2.1.1",
      "marks": 4,
      "clues": "- Think about each character's role in the story of Hyde.\n- Poole is a servant; Lanyon is a doctor.",
      "approach": "- Match the characters you know first\n- Use the remaining descriptions for the others",
      "solution": "1. Poole is a concerned servant.\n2. Lanyon is the friend whose friendship with Jekyll is broken up.\n3. Enfield witnesses the violent act.\n4. Hyde commits the vicious murder."
    },
    {
      "number": "2.1.2",
      "marks": 2,
      "clues": "- Think about what Utterson and Enfield are doing in the opening chapter.\n- Say where they are.",
      "approach": "- Give the occasion\n- Give the place",
      "solution": "1. It is during Utterson and Enfield's Sunday walk.\n2. They are in a London street opposite the mysterious door."
    },
    {
      "number": "2.1.3",
      "marks": 2,
      "clues": "- Think about the crowd gathered around Hyde.\n- What does Hyde stand to lose if he does not pay?",
      "approach": "- Say what Hyde must do\n- Give a reason",
      "solution": "1. Hyde must pay compensation for the injury he caused to the girl.\n2. Or he pays to avoid confrontation with the bystanders and the police."
    },
    {
      "number": "2.1.4",
      "marks": 3,
      "clues": "- Look at what the word 'screwed' is usually used for.\n- Link it to the pressure on Hyde.",
      "approach": "- Name the figure of speech\n- Explain the comparison",
      "solution": "1. The lines use a metaphor.\n2. As a screw is tightened with pressure, the bystanders pressure Hyde to compensate the child's family."
    },
    {
      "number": "2.1.5",
      "marks": 1,
      "clues": "- Think about whose signature is on the cheque.\n- The name belongs to one of Utterson's friends.",
      "approach": "- Read the statement\n- Identify the wrong word\n- Replace it",
      "solution": "1. The name that cannot be mentioned is that of Jekyll, not Lanyon."
    },
    {
      "number": "2.1.6",
      "marks": 2,
      "clues": "- Think about Hyde's attitude to the cheque.\n- The words are meant to calm the others.",
      "approach": "- Name the tone\n- Link it to Hyde's belief about the cheque",
      "solution": "1. The tone is reassuring, confident or sarcastic.\n2. Hyde is certain that the cheque is valid."
    },
    {
      "number": "2.1.7",
      "marks": 3,
      "clues": "- Decide whether Utterson stays within limits, then use events from the book.\n- A bare yes or no earns nothing.",
      "approach": "- State your view\n- Give two or three examples",
      "solution": "1. Yes: he keeps quiet about the contents of Jekyll's will, avoids gossip when Enfield tells his story and investigates only after Carew's murder.\n2. No: he secretly follows Hyde, breaks down Jekyll's laboratory door and keeps questioning Jekyll despite being told not to."
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
