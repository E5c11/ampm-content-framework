#!/usr/bin/env node
/**
 * DBE English FAL P2 — November 2025 — Cry, the Beloved Country — Extract B (Absalom's letter, Book 3 Ch. 3). 1.2.1–1.2.9, 17 marks.
 * Practice questions follow the HL Paper 2 pattern: context_text null, FRESH targets from elsewhere in the text, never the
 * exam's own statements or the memo's answers (DESIGN-UNI-01); they carry text_key "cry_the_beloved_country" on lesson and every
 * question (SETWORK-LES-01). aiExplanation: one entry per REAL exam sub-question with its real marks, derived from the
 * memo in own words (AIEXP-08). Every fitb declares keyboard_type 'text' (LANG-KB-01).
 *
 * FACTUAL BASIS per practice question — BK = book knowledge (verify against the text), P = printed in the exam paper's
 * extract/poem, M = established by the memo, PT = vocabulary/title meaning:
 *   Q1: BK: Napoleon Letsitsi is the agricultural demonstrator who comes to Ndotsheni in Book 3. Verify the name spelling against the book.
 *   Q2: BK: Msimangu (priest, Johannesburg), James Jarvis (farmer at Ndotsheni hills), Father Vincent (priest at the mission). Memo names Father Vincent.
 *   Q3: BK: racial injustice and social/tribal breakdown are standard themes.
 *   Q4: BK: Kumalo climbs the mountain and prays at dawn on the day of the hanging (closing chapter of the novel). Verify.
 *   Q5: BK + M: Matthew is John Kumalo's son tried with Absalom (the paper's Q1.2.5 names Matthew and Johannes).
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
    "context_text": null,
    "question": "Why does the agricultural demonstrator, Napoleon Letsitsi, come to Ndotsheni?",
    "metadata": [
      "to start a school for girls",
      "to teach the villagers better farming methods",
      "to build a new church",
      "to collect taxes from the farmers",
      ""
    ],
    "answer": [
      "to teach the villagers better farming methods",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "novel",
    "topic": "plot_structure",
    "subtopic": "hope_for_ndotsheni",
    "skills": [
      "english_fal_recall_key_events"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Think about the problem that has made the valley so poor.\n- His job title tells you what he does."
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
    "context_text": null,
    "question": "Match each character from the novel to the description that fits him.",
    "metadata": [
      "A - Msimangu",
      "B - James Jarvis",
      "C - Father Vincent",
      "1 - a white farmer from the hills above Ndotsheni",
      "2 - a priest at the Mission House in Johannesburg",
      "3 - a priest who helps Kumalo in Johannesburg"
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
    "clues": "- Think about who lives in the city and who lives near Ndotsheni.\n- Two of the three are priests; look at where each works."
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
    "question": "Select the TWO themes that are explored in the novel.",
    "metadata": [
      "racial injustice",
      "space exploration",
      "the break-up of traditional community life",
      "romantic rivalry between two chiefs",
      "the power of magic"
    ],
    "answer": [
      "racial injustice",
      "the break-up of traditional community life",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "novel",
    "topic": "theme_identification",
    "subtopic": "themes_of_the_novel",
    "skills": [
      "english_fal_identify_theme"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Think about what happens to families when people leave the villages.\n- Reject themes that do not fit the story's setting."
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
    "question": "What does Stephen Kumalo do at the time of Absalom's hanging?",
    "metadata": [
      "He travels to the court to ask for a pardon.",
      "He leaves the priesthood and moves to Pretoria.",
      "He goes to the dam to meet James Jarvis.",
      "He climbs a mountain to pray as the hour of Absalom's hanging comes.",
      ""
    ],
    "answer": [
      "He climbs a mountain to pray as the hour of Absalom's hanging comes.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "novel",
    "topic": "plot_structure",
    "subtopic": "closing_events",
    "skills": [
      "english_fal_recall_key_events"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Think about how a priest would spend the last hours before an execution.\n- Look for the option that happens in the hills, close to nature."
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
    "question": "What is the first name of John Kumalo's son, who is tried together with Absalom? Write one word.",
    "metadata": [
      "Name:",
      "[ ]"
    ],
    "answer": [
      "Matthew",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "definition",
    "unit": "novel",
    "topic": "plot_structure",
    "subtopic": "key_characters",
    "skills": [
      "english_fal_recall_key_events"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "clues": "- He is Absalom's cousin.\n- Write his first name only.",
    "keyboard_type": "text"
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
