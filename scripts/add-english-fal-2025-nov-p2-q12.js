#!/usr/bin/env node
/**
 * DBE English FAL P2 — November 2025 — 'Sonnet 73' by William Shakespeare. 6.2.1–6.2.8, 17 marks.
 * Practice questions follow the HL Paper 2 pattern: context_text null, FRESH targets from elsewhere in the text, never the
 * exam's own statements or the memo's answers (DESIGN-UNI-01); they carry text_key "sonnet_73" on lesson and every
 * question (SETWORK-LES-01). aiExplanation: one entry per REAL exam sub-question with its real marks, derived from the
 * memo in own words (AIEXP-08). Every fitb declares keyboard_type 'text' (LANG-KB-01).
 *
 * FACTUAL BASIS per practice question — BK = book knowledge (verify against the text), P = printed in the exam paper's
 * extract/poem, M = established by the memo, PT = vocabulary/title meaning:
 *   Q1: P + BK: the poem has 14 numbered lines; a sonnet is a 14-line form.
 *   Q2: P: 12 lines in three groups of four, then two lines (printed layout).
 *   Q3: P: 'thou' and 'thy love' are printed in the poem.
 *   Q4: P: 'cold' and 'bare' are printed in lines 3–4.
 *   Q5: PT: vocabulary meaning of 'ere long'.
 *
 *   node tools/validate-questions.js --script scripts/add-english-fal-2025-nov-p2-q12.js --curriculum temp/curriculum-vocab-english-fal.json
 *   node scripts/add-english-fal-2025-nov-p2-q12.js --dry-run
 *   node scripts/add-english-fal-2025-nov-p2-q12.js
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
  "name": "Question 6.2: 'Sonnet 73'",
  "syllabus": "dbe",
  "subject": "english_fal",
  "year": 2025,
  "paper": "nov_p2",
  "order": 12,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "poetry_analysis",
    "poetic_devices",
    "imagery"
  ],
  "text_key": "sonnet_73",
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p2/q12/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p2/q12/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p2/q12/memo_2.png"
  ],
  "exam_question_marks": 17,
  "supplementary_materials": [
    {
      "type": "annexure",
      "label": "Poem",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p2/q12/annexure_poem_2_1.png"
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
    "text_key": "sonnet_73",
    "order": 1,
    "context_text": null,
    "question": "How many lines does a sonnet have? Write the number.",
    "metadata": [
      "Lines:",
      "[ ]"
    ],
    "answer": [
      "14",
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
    "clues": "- Count the lines printed for 'Sonnet 73'.\n- Write digits only.",
    "keyboard_type": "text"
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Question 2",
    "text_key": "sonnet_73",
    "order": 2,
    "context_text": null,
    "question": "How is 'Sonnet 73' arranged?",
    "metadata": [
      "four stanzas of four lines each",
      "two octaves",
      "three quatrains followed by a couplet",
      "six couplets",
      ""
    ],
    "answer": [
      "three quatrains followed by a couplet",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "poetry",
    "topic": "structure_and_form",
    "subtopic": "poem_form",
    "skills": [
      "english_fal_identify_poem_structure"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Count the lines in each part and look at the last two lines.\n- A quatrain is a set of four lines."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Question 3",
    "text_key": "sonnet_73",
    "order": 3,
    "context_text": null,
    "question": "Who is the speaker addressing in the poem?",
    "metadata": [
      "a king",
      "the sea",
      "a stranger in a crowd",
      "a loved one",
      ""
    ],
    "answer": [
      "a loved one",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "poetry",
    "topic": "poetic_devices",
    "subtopic": "addressee",
    "skills": [
      "english_fal_identify_speaker_and_audience"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- The word 'thou' appears again and again.\n- Think about the last two lines, which talk about love."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Question 4",
    "text_key": "sonnet_73",
    "order": 4,
    "context_text": null,
    "question": "Select the TWO words from the first four lines that show the poem is about the end of a year.",
    "metadata": [
      "cold",
      "warm",
      "bare",
      "green",
      "singing"
    ],
    "answer": [
      "cold",
      "bare",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "poetry",
    "topic": "imagery",
    "subtopic": "season_imagery",
    "skills": [
      "english_fal_explain_imagery"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Think about words that describe winter branches without leaves.\n- Reject words that describe spring or summer."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Question 5",
    "text_key": "sonnet_73",
    "order": 5,
    "context_text": null,
    "question": "What does 'ere long' mean in the last line of the poem?",
    "metadata": [
      "slowly",
      "soon",
      "never",
      "yesterday",
      ""
    ],
    "answer": [
      "soon",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "poetry",
    "topic": "figurative_language",
    "subtopic": "word_meaning_in_context",
    "skills": [
      "english_fal_explain_word_in_context"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- 'Ere' is an old word for 'before'.\n- Think of what 'before a long time' would mean."
  }
];

// ─── AI explanation — one entry per REAL exam sub-question, real marks (AIEXP-08) ───

const aiExplanation = {
  "sub_questions": [
    {
      "number": "6.2.1",
      "marks": 1,
      "clues": "- Think about the season in which branches are bare and cold.\n- Look at the leaves in line 2.",
      "approach": "- Read lines 1–3\n- Choose the season",
      "solution": "1. The yellow, few leaves and the cold show winter is coming, so the answer is D."
    },
    {
      "number": "6.2.2",
      "marks": 3,
      "clues": "- Bare branches are compared to a ruined choir.\n- Link the comparison to the speaker's ageing.",
      "approach": "- Name the figure of speech\n- Explain the comparison",
      "solution": "1. Metaphor or personification.\n2. As branches become bare and weak with the seasons, the speaker's body grows fragile with age (or there are no birds singing, as in an empty cathedral)."
    },
    {
      "number": "6.2.3",
      "marks": 2,
      "clues": "- Think of what 'seals up all' suggests.\n- Death's second self is something else.",
      "approach": "- Give the first meaning\n- Give the second",
      "solution": "1. 'Rest' describes sleep.\n2. It also refers to death."
    },
    {
      "number": "6.2.4",
      "marks": 2,
      "clues": "- Look at the fire image and what it stands for.\n- Link to the speaker's life.",
      "approach": "- Interpret the fire\n- Link it to the speaker",
      "solution": "1. The glowing fire refers to the speaker's remaining life, vitality or passion.\n2. It is slowly fading as he ages."
    },
    {
      "number": "6.2.5",
      "marks": 2,
      "clues": "- Think of a fire that has burned down to ashes.\n- Link it to youth.",
      "approach": "- Describe the fire\n- Link it to the speaker",
      "solution": "1. The coals or logs burn out in the flames.\n2. The speaker's life or youth is used up by time and ageing."
    },
    {
      "number": "6.2.6",
      "marks": 2,
      "clues": "- Think about what the listener realises.\n- Link it to loving more.",
      "approach": "- Name the state of mind\n- Support it",
      "solution": "1. The person is appreciative or understanding.\n2. He realises he should love the speaker more because he is growing old."
    },
    {
      "number": "6.2.7",
      "marks": 2,
      "clues": "- Think about how the speaker asks to be loved while time is short.\n- Name the tone.",
      "approach": "- Name the tone\n- Give the reason",
      "solution": "1. The tone is urgent, appealing or resigned.\n2. The speaker asks them to intensify their love as their time is limited."
    },
    {
      "number": "6.2.8",
      "marks": 3,
      "clues": "- Decide your view, then support it with images from the poem.\n- A bare yes or no earns nothing.",
      "approach": "- State your view\n- Give evidence",
      "solution": "1. Yes: the few withering leaves, the fading sunset and the helplessness before death evoke pity.\n2. No: the speaker sees ageing as natural and a reason for deeper love."
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
