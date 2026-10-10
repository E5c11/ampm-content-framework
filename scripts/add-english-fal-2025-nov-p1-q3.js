#!/usr/bin/env node
/**
 * DBE English FAL P1 — November 2025 — Question 3: Analysing an Advertisement (order 3)
 * TEXT D: Lifebuoy advertisement (visual, with a packaging-text note). Practice uses fresh written ad
 * copy as context_text on the same theme (hygiene / family protection), text-extractable sub-questions
 * only (3.1–3.4, 3.6 type); 3.3.2 and 3.5 depend on the visuals and are skipped (LANG-EX-03). aiExplanation
 * covers all real sub-questions 3.1–3.6 with real marks (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video. Every fitb declares keyboard_type 'text' (LANG-KB-01).
 *   node tools/validate-questions.js --script scripts/add-english-fal-2025-nov-p1-q3.js --curriculum temp/curriculum-vocab-english-fal.json
 *   node scripts/add-english-fal-2025-nov-p1-q3.js --dry-run
 *   node scripts/add-english-fal-2025-nov-p1-q3.js
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
  "name": "Question 3: Analysing an Advertisement",
  "syllabus": "dbe",
  "subject": "english_fal",
  "year": 2025,
  "paper": "nov_p1",
  "order": 3,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "advertising",
    "advertising_language",
    "media_analysis"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p1/q3/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p1/q3/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p1/q3/memo_2.png"
  ],
  "exam_question_marks": 10,
  "supplementary_materials": [
    {
      "type": "annexure",
      "label": "Text D",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p1/q3/annexure_text_d_1.png",
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p1/q3/annexure_text_d_2.png"
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
    "context_text": "NEW & IMPROVED! SPARKLE PLUS dishwashing liquid. Now with TRI-POWER cleaning. Cuts grease fast. Protects your family's hands. Fresh lemon scent.",
    "question": "Which need does the advertiser mainly appeal to?",
    "metadata": [
      "the need to save money",
      "the need for a clean, hygienic home",
      "the need to travel",
      "the need for entertainment",
      ""
    ],
    "answer": [
      "the need for a clean, hygienic home",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "visual_texts",
    "topic": "advertising_language",
    "subtopic": "appeal_to_need",
    "skills": [
      "english_fal_identify_need_appealed_to"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Think about what a dishwashing product is for.\n- Ask what the reader would fear or want to avoid."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2025,
    "paper": "nov_p1",
    "name": "Question 2",
    "order": 2,
    "context_text": "Protects your family's hands.",
    "question": "What is the function of the apostrophe in 'family's' in the advertisement?",
    "metadata": [
      "to form the plural of 'family'",
      "to replace missing letters",
      "to introduce a quotation",
      "to show that the hands belong to the family",
      ""
    ],
    "answer": [
      "to show that the hands belong to the family",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "language",
    "topic": "punctuation_and_spelling",
    "subtopic": "apostrophe_of_possession",
    "skills": [
      "english_fal_identify_apostrophe_function"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Read the phrase aloud: whose hands are protected?\n- Compare the apostrophe's job here with its job in contractions."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2025,
    "paper": "nov_p1",
    "name": "Question 3",
    "order": 3,
    "context_text": "Now with TRI-POWER cleaning.",
    "question": "The prefix 'tri' in 'TRI-POWER' means …",
    "metadata": [
      "Meaning:",
      "[ ]"
    ],
    "answer": [
      "three",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "application",
    "unit": "language",
    "topic": "word_level_vocabulary",
    "subtopic": "prefix_meaning",
    "skills": [
      "english_fal_explain_prefix_meaning"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Think of other words that begin with 'tri', such as 'triangle' and 'tricycle'.\n- Write the number the prefix stands for as a word.",
    "keyboard_type": "text"
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2025,
    "paper": "nov_p1",
    "name": "Question 4",
    "order": 4,
    "context_text": "NEW & IMPROVED! SPARKLE PLUS dishwashing liquid. Now with TRI-POWER cleaning. Cuts grease fast. Protects your family's hands. Fresh lemon scent.",
    "question": "Select the TWO ways in which the advertiser tries to persuade the reader to buy the product.",
    "metadata": [
      "The words 'NEW & IMPROVED' suggest that the product is better than before.",
      "The slogan 'Protects your family's hands' appeals to the reader's care for the family.",
      "The advertisement lists the ingredients in scientific terms.",
      "The advertisement compares its price with three rival brands.",
      "The advertisement includes a map showing where to buy the product."
    ],
    "answer": [
      "The words 'NEW & IMPROVED' suggest that the product is better than before.",
      "The slogan 'Protects your family's hands' appeals to the reader's care for the family.",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "visual_texts",
    "topic": "advertising_language",
    "subtopic": "persuasive_devices",
    "skills": [
      "english_fal_identify_persuasive_devices"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "clues": "- Only choose features that actually appear in the advertisement.\n- Persuasion often works through words that suggest an advantage or an emotion."
  }
];

// ─── AI explanation — one entry per REAL exam sub-question, real marks (AIEXP-08) ───

const aiExplanation = {
  "sub_questions": [
    {
      "number": "3.1",
      "marks": 1,
      "clues": "- Think about what the product does and what it protects against.\n- The need is about health or cleanliness.",
      "approach": "- Identify what the product claims to do\n- Link this to a need of the buyer\n- Name the need",
      "solution": "1. The product promises protection against germs.\n2. The advertiser therefore appeals to the need to avoid the spread of germs / to be clean."
    },
    {
      "number": "3.2",
      "marks": 1,
      "clues": "- Think about what 'improved' suggests compared with other brands.\n- Consider the advertiser's goal.",
      "approach": "- Say what the word implies about the product\n- Link it to competition or persuasion",
      "solution": "1. 'IMPROVED' creates a competitive advantage over other products.\n2. It suggests advancement of the product and helps to convince the reader to buy it. Any one valid reason earns the mark."
    },
    {
      "number": "3.3.1",
      "marks": 1,
      "clues": "- Look at where the apostrophe sits in 'family's'.\n- Ask what relationship it shows.",
      "approach": "- Locate the apostrophe\n- Say what the 's' stands for",
      "solution": "1. The apostrophe shows possession: the skin belongs to the family."
    },
    {
      "number": "3.3.2",
      "marks": 2,
      "clues": "- Describe what the visual shows above the words.\n- Link what you see to the word 'family'.",
      "approach": "- Describe the visual\n- Connect it to the idea of the whole family using the product\n- Mention the feeling it suggests",
      "solution": "1. The visual shows the whole family, which suggests the product is safe for everyone.\n2. The heart suggests the family loves the product. Both points earn the two marks."
    },
    {
      "number": "3.4",
      "marks": 1,
      "clues": "- Break the word 'multivitamins' into 'multi' and the rest.\n- Think of words such as 'multicoloured'.",
      "approach": "- Isolate the prefix\n- Compare it with other 'multi' words\n- Choose the meaning that fits",
      "solution": "1. 'Multi' means many, as in multicoloured.\n2. 'Few', 'none' and 'some' do not give the idea of a large number, so they are wrong.\n3. The answer is D, many."
    },
    {
      "number": "3.5",
      "marks": 2,
      "clues": "- Think about what a shield does and what is shown inside it.\n- Connect the blank space to the claim beside it.",
      "approach": "- Describe the shield's usual meaning\n- Explain why it is blank\n- Link it to the 100% protection claim",
      "solution": "1. A shield protects, so it suggests the soap defends you against germs.\n2. The blank shield also suggests an absence of germs, matching the claim of 100% protection.\n3. Either idea, explained, earns the two marks."
    },
    {
      "number": "3.6",
      "marks": 2,
      "clues": "- Decide whether the advertisement is convincing, then justify.\n- Refer to specific features such as the words, the visuals and the claims.",
      "approach": "- State your view\n- Give a reason referring to the claims or visuals\n- Support it with a detail",
      "solution": "1. Yes: the claim of scientific improvement and the happy family make the product seem credible and desirable.\n2. No: 'new and improved' is an overused claim, and no evidence is provided for the benefits.\n3. A bare yes or no earns nothing; a substantiated view earns the marks."
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
