#!/usr/bin/env node
/**
 * DBE English FAL P1 — November 2025 — Question 4: Analysing a Cartoon (order 4)
 * TEXT E: Garfield cartoon (eight frames). Practice uses fresh written frame dialogue as context_text on
 * the same theme (wanting to be famous), text-extractable sub-questions only: sentence type, bubble
 * conventions, passive voice, creating humour (LANG-SEC-04). 4.1, 4.4 and 4.5 depend on the drawings
 * and are skipped (LANG-EX-03). aiExplanation covers all real sub-questions 4.1–4.7 (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video. Every fitb declares keyboard_type 'text' (LANG-KB-01).
 *   node tools/validate-questions.js --script scripts/add-english-fal-2025-nov-p1-q4.js --curriculum temp/curriculum-vocab-english-fal.json
 *   node scripts/add-english-fal-2025-nov-p1-q4.js --dry-run
 *   node scripts/add-english-fal-2025-nov-p1-q4.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

// ─── Phase 2 — lesson document ───────────────────────────────────────────────

const video = {
  "name": "Question 4: Analysing a Cartoon",
  "syllabus": "dbe",
  "subject": "english_fal",
  "year": 2025,
  "paper": "nov_p1",
  "order": 4,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "cartoons",
    "dialogue",
    "passive_voice"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p1/q4/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p1/q4/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p1/q4/memo_1.png"
  ],
  "exam_question_marks": 10,
  "supplementary_materials": [
    {
      "type": "annexure",
      "label": "Text E",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p1/q4/annexure_text_e_1.png"
      ]
    }
  ]
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2025,
    "paper": "nov_p1",
    "name": "Question 1",
    "order": 1,
    "context_text": "[Frame 1] Lerato (speech bubble): 'Thabo, come and look at this!'",
    "question": "'Thabo, come and look at this!' is an example of a …",
    "metadata": [
      "a question",
      "a statement",
      "a command",
      "a reprimand",
      ""
    ],
    "answer": [
      "a command",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "language",
    "topic": "sentence_construction",
    "subtopic": "sentence_types",
    "skills": [
      "english_fal_identify_sentence_type"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Decide whether the speaker is asking, telling a fact or telling someone to do something.\n- A reprimand also scolds; check the tone of the words."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2025,
    "paper": "nov_p1",
    "name": "Question 2",
    "order": 2,
    "context_text": "[Frame 2] Thabo (thought bubble): 'Not another one of her ideas...'\n[Frame 3] Lerato (speech bubble): 'I'm going to be a SINGING STAR!'",
    "question": "Match each cartoon feature to what it shows.",
    "metadata": [
      "A - a speech bubble",
      "B - a thought bubble",
      "C - capital letters",
      "1 - what a character thinks but does not say",
      "2 - a loud or excited voice",
      "3 - what a character says aloud"
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
    "unit": "visual_texts",
    "topic": "cartoon_analysis",
    "subtopic": "speech_and_thought_bubbles",
    "skills": [
      "english_fal_explain_cartoon_conventions"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Bubbles show how words reach the reader; think about who can 'hear' them.\n- Changes in letter style show how something is said."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2025,
    "paper": "nov_p1",
    "name": "Question 3",
    "order": 3,
    "context_text": "[Frame 6] Lerato: 'Famous singers record their songs in studios.'",
    "question": "Which sentence is the passive voice of the sentence in the extract?",
    "metadata": [
      "Famous singers were recording their songs in studios.",
      "Famous singers have recorded their songs in studios.",
      "Their songs recorded famous singers in studios.",
      "Their songs are recorded in studios by famous singers.",
      ""
    ],
    "answer": [
      "Their songs are recorded in studios by famous singers.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "language",
    "topic": "passive_and_reported_speech",
    "subtopic": "passive_voice",
    "skills": [
      "english_fal_change_to_passive_voice"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "clues": "- In the passive voice the object of the active sentence becomes the subject.\n- Keep the same tense as the original."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2025,
    "paper": "nov_p1",
    "name": "Question 4",
    "order": 4,
    "context_text": "[Frame 7] Lerato (speech bubble, shouting): 'FANS! I can hear my FANS!'\n[Frame 8] Thabo (thought bubble): 'That is a flock of pigeons.'",
    "question": "Select the TWO statements that best explain how humour is created in these frames.",
    "metadata": [
      "Lerato's excitement is contrasted with Thabo's private thought, which reveals the truth.",
      "The capital letters show that Lerato is carried away by her imagination.",
      "The cartoon is humorous because it describes a real concert.",
      "Thabo is shown to be angry at the pigeons.",
      "The fans are described in a serious news report."
    ],
    "answer": [
      "Lerato's excitement is contrasted with Thabo's private thought, which reveals the truth.",
      "The capital letters show that Lerato is carried away by her imagination.",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "visual_texts",
    "topic": "cartoon_analysis",
    "subtopic": "creating_humour",
    "skills": [
      "english_fal_explain_how_humour_is_created"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "clues": "- Humour often comes from a gap between what is said and what is true.\n- Check each option against the words in the frames."
  }
];

// ─── AI explanation — one entry per REAL exam sub-question, real marks (AIEXP-08) ───

const aiExplanation = {
  "sub_questions": [
    {
      "number": "4.1",
      "marks": 1,
      "clues": "- Look at what is in front of Garfield in Frame 1.\n- Think about what these items suggest about his eating habits.",
      "approach": "- Describe what is in front of Garfield\n- Link it to health-consciousness",
      "solution": "1. Garfield has two trays of junk or fast food in front of him.\n2. This shows he is not health-conscious."
    },
    {
      "number": "4.2",
      "marks": 1,
      "clues": "- Decide what Jon wants Garfield to do.\n- Compare a command with a question or statement.",
      "approach": "- Read the sentence in context\n- Decide what kind of act it is\n- Eliminate the wrong options",
      "solution": "1. 'Garfield, come here!' tells Garfield to do something, so it is a command.\n2. It is not a question or a plain statement, and it is not scolding, so B is right."
    },
    {
      "number": "4.3",
      "marks": 2,
      "clues": "- Look at the shape of each bubble and who it belongs to.\n- One shows speech and the other something different.",
      "approach": "- Identify the two bubble types\n- Say what each represents",
      "solution": "1. The speech bubble shows that Jon is talking.\n2. The thought bubble shows that Garfield is thinking."
    },
    {
      "number": "4.4",
      "marks": 2,
      "clues": "- Compare Garfield's eyes, paws and posture in the two frames.\n- You need a contrast, not two separate descriptions.",
      "approach": "- Describe Frame 4\n- Describe Frame 5\n- Make the contrast clear",
      "solution": "1. In Frame 4 his eyes are half closed and he sits relaxed; in Frame 5 his eyes are wide open.\n2. Other clear contrasts in paws or posture are also accepted; the contrast must be clear."
    },
    {
      "number": "4.5",
      "marks": 1,
      "clues": "- Think about how the word would sound if it were spoken.\n- Consider Jon's mood.",
      "approach": "- Say what bold lettering suggests\n- Link it to Jon's feeling",
      "solution": "1. The bold lettering shows that Jon is excited and shouting."
    },
    {
      "number": "4.6",
      "marks": 1,
      "clues": "- Move the object of the active sentence to the front.\n- Use 'are' plus the past participle and add 'by'.",
      "approach": "- Identify the subject and object\n- Switch them\n- Adjust the verb for the passive voice",
      "solution": "1. 'Famous people wear sunglasses' has 'sunglasses' as the object.\n2. In the passive voice this becomes 'Sunglasses are worn by famous people.'"
    },
    {
      "number": "4.7",
      "marks": 2,
      "clues": "- Decide whether the cartoon is funny to you, then give reasons from the frames.\n- Consider Jon's idea and what happens to him.",
      "approach": "- State your opinion\n- Refer to what happens in the frames\n- Explain why that is or is not humorous",
      "solution": "1. Yes: it is funny that Jon thinks sunglasses will make him famous but the sunglasses make him fall into the manhole.\n2. No: it is not funny that he could hurt himself, and fame is not as simple as wearing sunglasses.\n3. A bare yes or no earns nothing; substantiate your view."
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
