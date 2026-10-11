#!/usr/bin/env node
/**
 * DBE English FAL P2 — November 2024 — 'The Slave Dealer' by Thomas Pringle. 6.1.1–6.1.8, 18 marks.
 * Practice questions are fresh (DESIGN-UNI-01) and follow the shared rules: context_text null for literature (SETWORK-LES-05),
 * fresh targets, conventions-based for writing (LANG-WR-03); aiExplanation is one entry per REAL printed sub-question with its
 * real marks, derived from the memo in own words (AIEXP-08). Every fitb declares keyboard_type 'text' (LANG-KB-01).
 * Text key: the_slave_dealer.
 *
 * BASIS per practice question — BK book knowledge (verify against the text), P printed in the paper/poem, M memo,
 * PT vocabulary/title, C CAPS, P1 language-paper skill:
 *   Q1: P: 48 lines in six-line stanzas.
 *   Q2: P: title and stanza 1.
 *   Q3: P: came/name/frame (a), dun/son/run (b).
 *   Q4: P: stanzas 1, 3, 4, 7.
 *   Q5: P: lines 12 and 48.
 *
 *   node tools/validate-questions.js --script scripts/add-english-fal-2024-nov-p2-q11.js --curriculum temp/curriculum-vocab-english-fal.json
 *   node scripts/add-english-fal-2024-nov-p2-q11.js --dry-run
 *   node scripts/add-english-fal-2024-nov-p2-q11.js
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
  "name": "Question 6.1: 'The Slave Dealer'",
  "syllabus": "dbe",
  "subject": "english_fal",
  "year": 2024,
  "paper": "nov_p2",
  "order": 11,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "poetry_analysis",
    "poetic_devices",
    "imagery"
  ],
  "text_key": "the_slave_dealer",
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p2/q11/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p2/q11/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p2/q11/memo_2.png"
  ],
  "exam_question_marks": 18,
  "supplementary_materials": [
    {
      "type": "annexure",
      "label": "Poem",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p2/q11/annexure_poem_1_1.png",
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p2/q11/annexure_poem_1_2.png"
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
    "text_key": "the_slave_dealer",
    "order": 1,
    "context_text": null,
    "question": "How many stanzas does 'The slave dealer' have? Write the number.",
    "metadata": [
      "Stanzas:",
      "[ ]"
    ],
    "answer": [
      "8",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "definition",
    "unit": "poetry",
    "topic": "structure_and_form",
    "subtopic": "poem_form",
    "skills": [
      "english_fal_identify_poem_structure"
    ],
    "difficulty": 1,
    "exam_weight": 1,
    "clues": "- Each stanza has six lines.\n- Count the sets in the poem.",
    "keyboard_type": "text"
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2024,
    "paper": "nov_p2",
    "name": "Question 2",
    "text_key": "the_slave_dealer",
    "order": 2,
    "context_text": null,
    "question": "Who is the 'Wanderer' in the first line?",
    "metadata": [
      "a fisherman",
      "the slave dealer returning home",
      "a priest",
      "a soldier",
      ""
    ],
    "answer": [
      "the slave dealer returning home",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "poetry",
    "topic": "poetic_devices",
    "subtopic": "speaker_and_subject",
    "skills": [
      "english_fal_identify_speaker_and_audience"
    ],
    "difficulty": 1,
    "exam_weight": 1,
    "clues": "- He comes from the ocean's wave to his mother's door.\n- The title gives the answer."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2024,
    "paper": "nov_p2",
    "name": "Question 3",
    "text_key": "the_slave_dealer",
    "order": 3,
    "context_text": null,
    "question": "What is the rhyme scheme of the first stanza?",
    "metadata": [
      "aabbcc",
      "abcabc",
      "ababab",
      "abccba",
      ""
    ],
    "answer": [
      "ababab",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "poetry",
    "topic": "structure_and_form",
    "subtopic": "rhyme_scheme",
    "skills": [
      "english_fal_identify_poem_structure"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "clues": "- Compare the last words of lines 1–6: came, dun, name, son, frame, run.\n- Rhymes alternate."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2024,
    "paper": "nov_p2",
    "name": "Question 4",
    "text_key": "the_slave_dealer",
    "order": 4,
    "context_text": null,
    "question": "Arrange these parts of the poem in the order in which they occur.",
    "metadata": [
      "He confesses that there is blood on his hands",
      "The Wanderer returns home",
      "His mother cries that he could not have done such a murder",
      "He tries to pray but visions drive good thoughts away",
      ""
    ],
    "answer": [
      "The Wanderer returns home",
      "He tries to pray but visions drive good thoughts away",
      "He confesses that there is blood on his hands",
      "His mother cries that he could not have done such a murder",
      ""
    ],
    "presentation": "ordering",
    "type": "application",
    "unit": "poetry",
    "topic": "structure_and_form",
    "subtopic": "progression_of_ideas",
    "skills": [
      "english_fal_order_events"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "clues": "- The poem begins with his arrival.\n- The mother speaks near the end."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2024,
    "paper": "nov_p2",
    "name": "Question 5",
    "text_key": "the_slave_dealer",
    "order": 5,
    "context_text": null,
    "question": "Select the TWO feelings that torment the Wanderer.",
    "metadata": [
      "remorse",
      "pride",
      "fear",
      "joy",
      ""
    ],
    "answer": [
      "remorse",
      "fear",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "poetry",
    "topic": "imagery",
    "subtopic": "emotions_in_the_poem",
    "skills": [
      "english_fal_explain_imagery"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Look at the words describing his mood in stanza 2 and the last line.\n- Reject feelings the poem does not show."
  }
];

// ─── AI explanation — one entry per REAL printed sub-question, real marks (AIEXP-08) ───

const aiExplanation = {
  "sub_questions": [
    {
      "number": "6.1.1",
      "marks": 4,
      "clues": "- Read the sentence and fit the word that suits each blank.",
      "approach": "- Use the context for each blank\n- Check the word list",
      "solution": "1. (a) physically.\n2. (b) pray.\n3. (c) visions.\n4. (d) violently."
    },
    {
      "number": "6.1.2",
      "marks": 2,
      "clues": "- Think about the Wanderer's journey home.",
      "approach": "- Say when\n- Say where",
      "solution": "1. It happens after he returns from his aimless travels.\n2. It is at his mother's home."
    },
    {
      "number": "6.1.3",
      "marks": 2,
      "clues": "- Irony: what 'tanned' suggests versus what he did.",
      "approach": "- Explain both parts",
      "solution": "1. He abused black people for their dark skin, yet he now resembles them as he is sunburnt.\n2. Or he went to make money by tormenting others and returns spiritually tormented."
    },
    {
      "number": "6.1.4",
      "marks": 1,
      "clues": "- Fever is compared to blood.",
      "approach": "- Name the figure",
      "solution": "1. Metaphor."
    },
    {
      "number": "6.1.5",
      "marks": 2,
      "clues": "- Think about what he sees and hears.",
      "approach": "- Give two reasons",
      "solution": "1. The woman's cries still haunt him.\n2. He remembers the look on her face."
    },
    {
      "number": "6.1.6",
      "marks": 1,
      "clues": "- Replace the wrong promise.",
      "approach": "- Find the wrong word",
      "solution": "1. The dying woman told him that God will punish him."
    },
    {
      "number": "6.1.7",
      "marks": 3,
      "clues": "- Think about what torments the dealer.",
      "approach": "- Define guilt\n- Give examples",
      "solution": "1. He is plagued by what he made others endure.\n2. No amount of water can wash the blood from his hands.\n3. The woman's cry is like a refrain in his ears."
    },
    {
      "number": "6.1.8",
      "marks": 3,
      "clues": "- Decide whether the mother can be pitied, then use the poem.",
      "approach": "- State your view\n- Give evidence",
      "solution": "1. Yes: she is a widow whose only son goes astray, does not recognise him on his return and nurses him in vain.\n2. No: she tries to convince him he is not guilty and exonerates him despite his confession."
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
