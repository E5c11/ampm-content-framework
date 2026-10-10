#!/usr/bin/env node
/**
 * DBE English FAL P2 — November 2025 — Cry, the Beloved Country — Extract B (Absalom's letter, Book 3 Ch. 3). 1.2.1–1.2.9, 17 marks.
 * Practice questions are fresh (DESIGN-UNI-01), mirror the sub-question types (LANG-EX-02) and carry text_key
 * "cry_the_beloved_country" on lesson and every question (SETWORK-LES-01). aiExplanation: one entry per REAL exam
 * sub-question with its real marks, derived from the memo in own words (AIEXP-08). Every fitb declares
 * keyboard_type 'text' (LANG-KB-01).
 *
 *   node tools/validate-questions.js --script scripts/add-english-fal-2025-nov-p2-q2.js --curriculum temp/curriculum-vocab-english-fal.json
 *   node scripts/add-english-fal-2025-nov-p2-q2.js --dry-run
 *   node scripts/add-english-fal-2025-nov-p2-q2.js
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
  "name": "Question 1.2: Cry, the Beloved Country",
  "syllabus": "dbe",
  "subject": "english_fal",
  "year": 2025,
  "paper": "nov_p2",
  "order": 2,
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
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p2/q2/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p2/q2/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p2/q2/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p2/q2/memo_2.png"
  ],
  "exam_question_marks": 17,
  "supplementary_materials": [
    {
      "type": "annexure",
      "label": "Extract B",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p2/q2/annexure_extract_b_1.png"
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
    "text_key": "cry_the_beloved_country",
    "order": 1,
    "context_text": "A young man, locked in a prison cell, writes to his parents to tell them that he is in good health and that he does not expect to see his home again.",
    "question": "What kind of text is described in the extract?",
    "metadata": [
      "a report from a social worker",
      "a letter written from prison",
      "a telegram from the Bishop",
      "a note from a priest",
      ""
    ],
    "answer": [
      "a letter written from prison",
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
    "clues": "- Think about who is writing, to whom, and from where.\n- Look at what the writer tells his family."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Question 2",
    "text_key": "cry_the_beloved_country",
    "order": 2,
    "context_text": "This is a quiet place. I am locked in, but the men are not unkind to me, and I have made my peace with it.",
    "question": "What does the sentence below tell us about the writer's state of mind?",
    "metadata": [
      "furious with the people who convicted him",
      "hopeful that the sentence will be reduced",
      "indifferent to his parents' feelings",
      "accepting of what is going to happen to him",
      ""
    ],
    "answer": [
      "accepting of what is going to happen to him",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "novel",
    "topic": "character_analysis",
    "subtopic": "state_of_mind",
    "skills": [
      "english_fal_infer_state_of_mind"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "clues": "- Look at how he describes his surroundings and how he is treated.\n- Ask whether the tone is angry, hopeful or calm."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Question 3",
    "text_key": "cry_the_beloved_country",
    "order": 3,
    "context_text": null,
    "question": "Match each person in the extract to what he does.",
    "metadata": [
      "A - Absalom",
      "B - The priest from Pretoria",
      "C - Stephen Kumalo",
      "1 - prepares Absalom for his death",
      "2 - reads the letter at home in Ndotsheni",
      "3 - writes a letter from prison to his parents"
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
    "topic": "plot_structure",
    "subtopic": "key_events",
    "skills": [
      "english_fal_match_characters_to_roles"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Think about who writes, who reads and who ministers to the prisoner.\n- Use the pair you are certain about first."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Question 4",
    "text_key": "cry_the_beloved_country",
    "order": 4,
    "context_text": null,
    "question": "Select the TWO events that best show the theme of hardship in the novel.",
    "metadata": [
      "Drought and poor farming conditions cause suffering in Ndotsheni",
      "Arthur Jarvis is rewarded for his work",
      "Stephen Kumalo searches for family members he has lost",
      "John Kumalo grows rich through his political speeches",
      "The Bishop retires from the church"
    ],
    "answer": [
      "Drought and poor farming conditions cause suffering in Ndotsheni",
      "Stephen Kumalo searches for family members he has lost",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "novel",
    "topic": "theme_identification",
    "subtopic": "theme_of_hardship",
    "skills": [
      "english_fal_identify_theme_evidence"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "clues": "- Look for events where characters suffer loss, poverty or fear.\n- Two options describe success or comfort; they do not show hardship."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Question 5",
    "text_key": "cry_the_beloved_country",
    "order": 5,
    "context_text": null,
    "question": "Stephen Kumalo's faith is what carries him through his sufferings. Which ONE answer is best substantiated by events in the novel?",
    "metadata": [
      "Stephen never prays because he believes the church has failed South Africa.",
      "Stephen's faith is never tested because his family is safe.",
      "Stephen turns to prayer when Gertrude and Absalom are in trouble, but he also doubts when he discovers Absalom's crime.",
      "Stephen leaves the priesthood as soon as he arrives in Johannesburg.",
      ""
    ],
    "answer": [
      "Stephen turns to prayer when Gertrude and Absalom are in trouble, but he also doubts when he discovers Absalom's crime.",
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
    "clues": "- Look for an option that mentions both his faith and moments of doubt.\n- Rule out options that contradict the novel."
  }
];

// ─── AI explanation — one entry per REAL exam sub-question, real marks (AIEXP-08) ───

const aiExplanation = {
  "sub_questions": [
    {
      "number": "1.2.1",
      "marks": 2,
      "clues": "- Think about what has just happened at the Kumalo home and what the child brings.\n- Give both a time and a place.",
      "approach": "- Identify the event before the extract\n- Name the setting",
      "solution": "1. The scene takes place after a child delivers letters at the Kumalo home.\n2. The place is the Kumalo home in Ndotsheni."
    },
    {
      "number": "1.2.2",
      "marks": 1,
      "clues": "- Look at what Absalom is writing about when he says 'the thing that I have done'.\n- Think of the crime in the novel.",
      "approach": "- Recall the crime\n- State it briefly",
      "solution": "1. 'The thing' refers to the murder of Arthur Jarvis."
    },
    {
      "number": "1.2.3",
      "marks": 2,
      "clues": "- Look at how Absalom describes the prison and the way he is treated.\n- The words are calm, not angry.",
      "approach": "- Describe his tone\n- Support it with a detail",
      "solution": "1. Absalom is accepting as he tries to reassure his parents that he has made peace with his fate.\n2. He says he is locked in, can smoke and read, and the white men do not speak badly to him."
    },
    {
      "number": "1.2.4",
      "marks": 2,
      "clues": "- Think about what a priest does for a condemned person.\n- Link it to his coming execution.",
      "approach": "- Say what the priest does\n- Say what the preparation is for",
      "solution": "1. The priest prays for and ministers to Absalom.\n2. This prepares him spiritually and emotionally for his hanging."
    },
    {
      "number": "1.2.5",
      "marks": 2,
      "clues": "- Recall what happens at the retrial of the other two men.\n- Why would a judge order more investigation?",
      "approach": "- Identify what the judge instructs\n- State what is investigated",
      "solution": "1. The judge orders further investigation.\n2. It concerns Matthew and Johannes's previous criminal activities."
    },
    {
      "number": "1.2.6",
      "marks": 1,
      "clues": "- Recall how Arthur's servant is attacked in the house.\n- One option is a heavy tool, not a household item.",
      "approach": "- Remember the attack\n- Choose the weapon",
      "solution": "1. Johannes attacks Arthur's servant with an iron bar, so the answer is A.\n2. A bread knife, milk can and old shovel are not what the novel names."
    },
    {
      "number": "1.2.7",
      "marks": 1,
      "clues": "- Look at who sends Stephen to Pietermaritzburg in the story.\n- The correct word is a title of an office in the church.",
      "approach": "- Read the statement\n- Find the word that is wrong\n- Replace it with the word that makes the statement true",
      "solution": "1. It is the Bishop, not the policeman, who sends Stephen to Pietermaritzburg."
    },
    {
      "number": "1.2.8",
      "marks": 3,
      "clues": "- Think of the different people in the novel who suffer.\n- Give examples from more than one character.",
      "approach": "- Define hardship\n- Give two or three examples from the novel\n- Link each to a character",
      "solution": "1. James Jarvis and his wife suffer the loss of their son Arthur.\n2. The Ndotsheni villagers endure droughts and poor farming conditions.\n3. Stephen suffers while searching for his missing family members."
    },
    {
      "number": "1.2.9",
      "marks": 3,
      "clues": "- Decide whether his faith carries him or fails him, then support your view.\n- A bare yes or no earns nothing.",
      "approach": "- State your view\n- Give evidence of his faith\n- Give evidence of his doubt",
      "solution": "1. Yes: he turns to scripture and prayer, accepts Father Vincent's counsel to pray and rest, and his meetings with Msimangu restore his faith in people.\n2. No: he doubts when Absalom's crime is discovered, is overwhelmed by the city's corruption and directs anger at God."
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
