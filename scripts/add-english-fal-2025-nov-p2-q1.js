#!/usr/bin/env node
/**
 * DBE English FAL P2 — November 2025 — Cry, the Beloved Country — Extract A (Kumalo and Msimangu, Book 1 Ch. 5). 1.1.1–1.1.7, 18 marks. Practice covers: matching characters, figure of speech, character from words, stated reasons, evaluating a view.
 * Practice questions are fresh (DESIGN-UNI-01), mirror the sub-question types (LANG-EX-02) and carry text_key
 * "cry_the_beloved_country" on lesson and every question (SETWORK-LES-01). aiExplanation: one entry per REAL exam
 * sub-question with its real marks, derived from the memo in own words (AIEXP-08). Every fitb declares
 * keyboard_type 'text' (LANG-KB-01).
 *
 *   node tools/validate-questions.js --script scripts/add-english-fal-2025-nov-p2-q1.js --curriculum temp/curriculum-vocab-english-fal.json
 *   node scripts/add-english-fal-2025-nov-p2-q1.js --dry-run
 *   node scripts/add-english-fal-2025-nov-p2-q1.js
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
  "year": 2025,
  "paper": "nov_p2",
  "order": 1,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "literary_essay",
    "character_analysis",
    "figurative_language",
    "tone"
  ],
  "text_key": "cry_the_beloved_country",
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p2/q1/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p2/q1/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p2/q1/memo_2.png"
  ],
  "exam_question_marks": 18,
  "supplementary_materials": [
    {
      "type": "annexure",
      "label": "Extract A",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p2/q1/annexure_extract_a_1.png"
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
    "question": "Match each character from Cry, the Beloved Country to the description that fits him.",
    "metadata": [
      "A - Stephen Kumalo",
      "B - John Kumalo",
      "C - Absalom Kumalo",
      "1 - a carpenter who has become a politician",
      "2 - Stephen's son, found guilty of murdering Arthur Jarvis",
      "3 - a priest from Ndotsheni who travels to Johannesburg"
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
    "clues": "- Think about where each character lives and works in the novel.\n- Start with the character you know best and remove that pair."
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
    "context_text": "The silence in the little room reached out and gripped his hand.",
    "question": "Which figure of speech is used in the sentence below?",
    "metadata": [
      "simile",
      "personification",
      "hyperbole",
      "irony",
      ""
    ],
    "answer": [
      "personification",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "novel",
    "topic": "figurative_language",
    "subtopic": "personification_identification",
    "skills": [
      "english_fal_identify_figure_of_speech"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Ask whether a non-living thing is given the actions of a person.\n- Check for the words 'like' or 'as' before choosing."
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
    "context_text": "'I am only a poor country priest,' said the old man, 'and I know nothing of this great city.'",
    "question": "What does the sentence below reveal about the speaker's character?",
    "metadata": [
      "arrogant",
      "deceitful",
      "humble",
      "impatient",
      ""
    ],
    "answer": [
      "humble",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "novel",
    "topic": "character_analysis",
    "subtopic": "character_from_words",
    "skills": [
      "english_fal_infer_character_from_words"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Look at how the speaker describes himself and his own importance.\n- Consider whether he is boasting or playing himself down."
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
    "question": "Select the TWO reasons why Stephen Kumalo travels from Ndotsheni to Johannesburg.",
    "metadata": [
      "To find his sister Gertrude, who is reported to be ill",
      "To collect payment owed to his church",
      "To find his son Absalom, who has stopped writing",
      "To attend a meeting called by the Bishop",
      "To open a school in the city"
    ],
    "answer": [
      "To find his sister Gertrude, who is reported to be ill",
      "To find his son Absalom, who has stopped writing",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "novel",
    "topic": "plot_structure",
    "subtopic": "reasons_for_journey",
    "skills": [
      "english_fal_identify_stated_reasons"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Think about which members of his family have not been heard from.\n- The reasons concern family, not church business."
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
    "question": "Mrs Kumalo is a supportive person. Which ONE answer is best substantiated by events in the novel?",
    "metadata": [
      "Mrs Kumalo travels with Stephen to Johannesburg to search for their son.",
      "Mrs Kumalo visits Absalom regularly while he waits on death row.",
      "Mrs Kumalo refuses to take the young girl into her home.",
      "Mrs Kumalo comforts Stephen when he is anxious about his journey and cares for Absalom's pregnant wife.",
      ""
    ],
    "answer": [
      "Mrs Kumalo comforts Stephen when he is anxious about his journey and cares for Absalom's pregnant wife.",
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
    "clues": "- Check each option against what Mrs Kumalo actually does in the story.\n- A well-substantiated answer refers to specific actions."
  }
];

// ─── AI explanation — one entry per REAL exam sub-question, real marks (AIEXP-08) ───

const aiExplanation = {
  "sub_questions": [
    {
      "number": "1.1.1",
      "marks": 4,
      "clues": "- Re-read each name in COLUMN A and recall what the character does in the novel.\n- Work from the descriptions you are sure of first.",
      "approach": "- Match the characters you know well\n- Use the unused descriptions for the remainder\n- Check each pair against the novel",
      "solution": "1. Gertrude is jailed for brewing liquor at home.\n2. James Jarvis arranges for the dam to be built.\n3. Arthur Jarvis is known for his charity work among black people.\n4. Mrs Lithebe provides Stephen with a room in Johannesburg."
    },
    {
      "number": "1.1.2",
      "marks": 3,
      "clues": "- Look at what Kumalo's voice is said to do to Msimangu.\n- A voice cannot normally touch a person.",
      "approach": "- Name the figure of speech\n- Explain what it is compared to\n- Link it to Msimangu's feelings",
      "solution": "1. The line gives a quality of a living being to something that is not, so it is personification (metaphor is also accepted).\n2. Kumalo's humble voice 'touches' Msimangu as a kind act would, showing how deeply he is moved."
    },
    {
      "number": "1.1.3",
      "marks": 2,
      "clues": "- Read what Msimangu says about himself.\n- Think about whether it shows pride or honesty.",
      "approach": "- Quote the line\n- Name the trait it shows\n- Support the trait with his own words",
      "solution": "1. Msimangu admits he is a selfish and sinful man.\n2. This shows he is modest, honest and self-aware."
    },
    {
      "number": "1.1.4",
      "marks": 2,
      "clues": "- Think about how Kumalo would react to learning his brother is a politician.\n- The tone is one word; the reason refers to what he has just learned.",
      "approach": "- Choose a word for the tone\n- Link it to what Kumalo has just heard",
      "solution": "1. The tone is surprise or shock.\n2. Kumalo is in total disbelief that his brother John is into politics."
    },
    {
      "number": "1.1.5",
      "marks": 2,
      "clues": "- Irony is a gap between what is said and what is true.\n- Think about John's actions compared with his reputation.",
      "approach": "- Give what Msimangu says\n- Give the contrasting reality\n- Link the two parts",
      "solution": "1. Msimangu calls John a great man in politics.\n2. In reality John is a powerful speaker who lacks the conviction to take real action, or is afraid of prison."
    },
    {
      "number": "1.1.6",
      "marks": 2,
      "clues": "- Think about what has gone wrong in Kumalo's family in Johannesburg.\n- You need two separate points.",
      "approach": "- Recall the family's troubles\n- Pick two distinct points",
      "solution": "1. John has abandoned the church.\n2. Any other valid point: John lives with a mistress, Gertrude has turned to prostitution, or Gertrude sells illegal liquor."
    },
    {
      "number": "1.1.7",
      "marks": 3,
      "clues": "- Decide your view, then support it with events from the whole novel.\n- A bare yes or no earns nothing.",
      "approach": "- State your view\n- Give two or three pieces of evidence\n- Link each to Mrs Kumalo's actions",
      "solution": "1. Yes: she supports Stephen quietly and patiently, comforts him before his journey and cares for Absalom's wife during her pregnancy.\n2. No: she stays in Ndotsheni when Absalom is arrested, tried and sentenced, and does not visit him on death row.\n3. Either view must be substantiated from the novel."
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
