#!/usr/bin/env node
/**
 * DBE English FAL P2 — November 2024 — Cry, the Beloved Country — Extract A (the letter, Book 1 Ch. 2). 1.1.1–1.1.8, 18 marks.
 * Practice questions are fresh (DESIGN-UNI-01) and follow the shared rules: context_text null for literature (SETWORK-LES-05),
 * fresh targets, conventions-based for writing (LANG-WR-03); aiExplanation is one entry per REAL printed sub-question with its
 * real marks, derived from the memo in own words (AIEXP-08). Every fitb declares keyboard_type 'text' (LANG-KB-01).
 * Text key: cry_the_beloved_country.
 *
 * BASIS per practice question — BK book knowledge (verify against the text), P printed in the paper/poem, M memo,
 * PT vocabulary/title, C CAPS, P1 language-paper skill:
 *   Q1: BK/M: Mrs Lithebe lodges Kumalo (2025 memo 1.1.1), Gertrude is his sister, James Jarvis's son Arthur is murdered.
 *   Q2: BK: the novel's city setting is Johannesburg (named in the 2024 and 2025 memos).
 *   Q3: M: 2024 memo 1.2.7 — he agrees to carry the gun that kills Arthur Jarvis.
 *   Q4: BK: broad plot order.
 *   Q5: BK: Kumalo returns with Absalom's wife and Gertrude's child; 2025 memo 1.1.7 confirms Absalom's wife is cared for in Ndotsheni.
 *
 *   node tools/validate-questions.js --script scripts/add-english-fal-2024-nov-p2-q1.js --curriculum temp/curriculum-vocab-english-fal.json
 *   node scripts/add-english-fal-2024-nov-p2-q1.js --dry-run
 *   node scripts/add-english-fal-2024-nov-p2-q1.js
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
  "name": "Question 1.1: Cry, the Beloved Country",
  "syllabus": "dbe",
  "subject": "english_fal",
  "year": 2024,
  "paper": "nov_p2",
  "order": 1,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "literary_essay",
    "character_analysis",
    "thematic_analysis"
  ],
  "text_key": "cry_the_beloved_country",
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p2/q1/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p2/q1/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p2/q1/memo_2.png"
  ],
  "exam_question_marks": 18,
  "supplementary_materials": [
    {
      "type": "annexure",
      "label": "Extract A",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p2/q1/annexure_extract_a_1.png"
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
    "text_key": "cry_the_beloved_country",
    "order": 1,
    "context_text": null,
    "question": "Match each character from Cry, the Beloved Country to the description that fits.",
    "metadata": [
      "A - Mrs Lithebe",
      "B - Gertrude",
      "C - James Jarvis",
      "1 - Stephen Kumalo's sister, who is lost in the city",
      "2 - the white farmer whose son is murdered",
      "3 - gives Kumalo a room in Johannesburg"
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
    "clues": "- Think about who lives in the city and who lives above Ndotsheni.\n- Use the pair you are surest of first."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2024,
    "paper": "nov_p2",
    "name": "Question 2",
    "text_key": "cry_the_beloved_country",
    "order": 2,
    "context_text": null,
    "question": "In which city does Stephen Kumalo search for his sister and his son? Write one word.",
    "metadata": [
      "City:",
      "[ ]"
    ],
    "answer": [
      "Johannesburg",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "definition",
    "unit": "novel",
    "topic": "setting_and_atmosphere",
    "subtopic": "places_in_the_novel",
    "skills": [
      "english_fal_identify_setting"
    ],
    "difficulty": 1,
    "exam_weight": 1,
    "clues": "- It is the big city that the villagers call a place of danger and gold.\n- Write one word.",
    "keyboard_type": "text"
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2024,
    "paper": "nov_p2",
    "name": "Question 3",
    "text_key": "cry_the_beloved_country",
    "order": 3,
    "context_text": null,
    "question": "What does Absalom do that leads to his death sentence?",
    "metadata": [
      "He is blamed for a crime that he did not witness.",
      "He sets fire to a church in Ndotsheni.",
      "He joins a robbery and a gun he carries is used to kill Arthur Jarvis.",
      "He steals from his own father in the village.",
      ""
    ],
    "answer": [
      "He joins a robbery and a gun he carries is used to kill Arthur Jarvis.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "novel",
    "topic": "plot_structure",
    "subtopic": "key_events",
    "skills": [
      "english_fal_recall_key_events"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Think about the crime for which Absalom is tried.\n- It is committed in a house in a white suburb."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2024,
    "paper": "nov_p2",
    "name": "Question 4",
    "text_key": "cry_the_beloved_country",
    "order": 4,
    "context_text": null,
    "question": "Arrange these events from the novel in the order in which they happen.",
    "metadata": [
      "Absalom is arrested for murder",
      "Kumalo receives a letter from Johannesburg",
      "Kumalo returns to Ndotsheni",
      "Kumalo finds Gertrude in the city",
      ""
    ],
    "answer": [
      "Kumalo receives a letter from Johannesburg",
      "Kumalo finds Gertrude in the city",
      "Absalom is arrested for murder",
      "Kumalo returns to Ndotsheni",
      ""
    ],
    "presentation": "ordering",
    "type": "application",
    "unit": "novel",
    "topic": "plot_structure",
    "subtopic": "sequence_of_events",
    "skills": [
      "english_fal_order_events"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- The letter is what sets the journey in motion.\n- Kumalo comes back home after the trial."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2024,
    "paper": "nov_p2",
    "name": "Question 5",
    "text_key": "cry_the_beloved_country",
    "order": 5,
    "context_text": null,
    "question": "Select the TWO people Kumalo brings back to Ndotsheni.",
    "metadata": [
      "Gertrude's small son",
      "Absalom himself",
      "Absalom's pregnant wife",
      "John Kumalo",
      "Gertrude"
    ],
    "answer": [
      "Gertrude's small son",
      "Absalom's pregnant wife",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "novel",
    "topic": "plot_structure",
    "subtopic": "key_events",
    "skills": [
      "english_fal_identify_stated_reasons"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "clues": "- Think about who is left in the city and who can travel home.\n- Gertrude disappears before the return."
  }
];

// ─── AI explanation — one entry per REAL printed sub-question, real marks (AIEXP-08) ───

const aiExplanation = {
  "sub_questions": [
    {
      "number": "1.1.1",
      "marks": 4,
      "clues": "- Recall each character's role in the novel.",
      "approach": "- Match the characters you know first\n- Use the remaining descriptions for the others",
      "solution": "1. Msimangu accompanies Stephen to his brother's shop.\n2. Arthur Jarvis writes The Truth About Native Crime.\n3. Absalom becomes head boy of the reformatory.\n4. Father Vincent finds Stephen a pro deo lawyer."
    },
    {
      "number": "1.1.2",
      "marks": 1,
      "clues": "- Replace the one wrong word with the correct title.",
      "approach": "- Read the statement\n- Identify what John became",
      "solution": "1. John Kumalo is a carpenter who turned politician, not pastor."
    },
    {
      "number": "1.1.3",
      "marks": 2,
      "clues": "- Think about how Mrs Kumalo feels when asked about the letter.",
      "approach": "- Name the tone\n- Say why she uses it",
      "solution": "1. The tone is confused, questioning or nervous.\n2. She is as baffled and anxious as her husband about the letter."
    },
    {
      "number": "1.1.4",
      "marks": 2,
      "clues": "- Think about who the letter is not from.",
      "approach": "- Say what Stephen feels\n- Give the reason",
      "solution": "1. Stephen is despondent or disappointed.\n2. The letter is not from Absalom, who has not written for a long time."
    },
    {
      "number": "1.1.5",
      "marks": 2,
      "clues": "- Irony is a gap between what is said and what is done.",
      "approach": "- State what he says\n- State what he does",
      "solution": "1. Stephen asks who is afraid, pretending he is not.\n2. Yet he avoids opening the letter and tells his wife to open it."
    },
    {
      "number": "1.1.6",
      "marks": 2,
      "clues": "- Look at how she opens and reads the letter.",
      "approach": "- Name a trait\n- Support it from the lines",
      "solution": "1. She is brave to open an unknown letter, or sensitive because she reads slowly to soften the impact."
    },
    {
      "number": "1.1.7",
      "marks": 2,
      "clues": "- Think about what the letter makes him do about Gertrude.",
      "approach": "- Say what he decides\n- Say what he uses",
      "solution": "1. It encourages him to use his savings and travel to Johannesburg.\n2. He goes to find Gertrude, who is unwell."
    },
    {
      "number": "1.1.8",
      "marks": 3,
      "clues": "- Decide how you feel about Gertrude, then use events from the whole novel.",
      "approach": "- State your view\n- Give two or three pieces of evidence",
      "solution": "1. Yes: her husband goes to Johannesburg and she never hears from him; she is left alone with an infant and drifts into the city's social ills.\n2. No: she could have returned to Ndotsheni, where her brother and his wife would support her, and she chooses a life of immorality.\n3. Either view must be substantiated."
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
