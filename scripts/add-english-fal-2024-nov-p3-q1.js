#!/usr/bin/env node
/**
 * DBE English FAL P3 — November 2024 — Question 1: Essay (order 1) — eight topics (1.1–1.5 written prompts, 1.6–1.8 pictures: child on a swing, robot cooking, galloping horse), 250–300 words, 50-mark rubric. Practice covers essay theory on fresh examples (LANG-WR-02).
 * Practice questions are fresh (DESIGN-UNI-01) and follow the shared rules: context_text null for literature (SETWORK-LES-05),
 * fresh targets, conventions-based for writing (LANG-WR-03); aiExplanation is one entry per REAL printed sub-question with its
 * real marks, derived from the memo in own words (AIEXP-08). Every fitb declares keyboard_type 'text' (LANG-KB-01).
 * Text key: none (language / writing paper).
 *
 * BASIS per practice question — BK book knowledge (verify against the text), P printed in the paper/poem, M memo,
 * PT vocabulary/title, C CAPS, P1 language-paper skill:
 *   Q1: C: CAPS §3.3 argumentative writing — a specific viewpoint.
 *   Q2: M: memo — narrative essay needs a strong storyline and interesting ending.
 *   Q3: M/P: memo features and the paper's picture instruction.
 *   Q4: M: memo feature list.
 *   Q5: P: 250–300 words.
 *   Q6: C: CAPS §3.3 — word choice, voice.
 *
 *   node tools/validate-questions.js --script scripts/add-english-fal-2024-nov-p3-q1.js --curriculum temp/curriculum-vocab-english-fal.json
 *   node scripts/add-english-fal-2024-nov-p3-q1.js --dry-run
 *   node scripts/add-english-fal-2024-nov-p3-q1.js
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
  "name": "Question 1: Essay",
  "syllabus": "dbe",
  "subject": "english_fal",
  "year": 2024,
  "paper": "nov_p3",
  "order": 1,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "essay_structure",
    "planning",
    "creative_writing",
    "argumentative_writing"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p3/q1/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p3/q1/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p3/q1/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p3/q1/memo_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p3/q1/memo_3.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p3/q1/memo_4.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p3/q1/memo_5.png"
  ],
  "exam_question_marks": 50,
  "supplementary_materials": null
};

// ─── Practice questions ──────────────────────────────────────────────────────

const questions = [
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2024,
    "paper": "nov_p3",
    "name": "Question 1",
    "order": 1,
    "context_text": null,
    "question": "For the argumentative topic 'More choice makes people less happy', which sentence is the STRONGEST thesis statement?",
    "metadata": [
      "In this essay I will talk about choices.",
      "Choices are a big part of life and everybody makes them.",
      "Endless choice breeds anxiety, so having fewer options can make people happier.",
      "Many people have different opinions about choices.",
      ""
    ],
    "answer": [
      "Endless choice breeds anxiety, so having fewer options can make people happier.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "essay_writing",
    "topic": "planning_and_structure",
    "subtopic": "thesis_statement",
    "skills": [
      "english_fal_apply_planning_steps"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- A strong thesis takes a clear stand and gives a reason.\n- Reject sentences that only announce the topic."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2024,
    "paper": "nov_p3",
    "name": "Question 2",
    "order": 2,
    "context_text": null,
    "question": "Arrange the stages of a narrative essay in the order in which they occur.",
    "metadata": [
      "Climax: the problem reaches its peak",
      "Exposition: the narrator is introduced",
      "Resolution: the story ends",
      "Rising action: a problem grows",
      ""
    ],
    "answer": [
      "Exposition: the narrator is introduced",
      "Rising action: a problem grows",
      "Climax: the problem reaches its peak",
      "Resolution: the story ends",
      ""
    ],
    "presentation": "ordering",
    "type": "application",
    "unit": "essay_writing",
    "topic": "planning_and_structure",
    "subtopic": "narrative_structure",
    "skills": [
      "english_fal_order_events"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- A story must be set up before the problem grows.\n- The ending comes last."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2024,
    "paper": "nov_p3",
    "name": "Question 3",
    "order": 3,
    "context_text": null,
    "question": "Select the TWO things that are true of a good essay answer.",
    "metadata": [
      "It is told with a strong storyline and an interesting ending.",
      "It must be written in the second person.",
      "It makes a clear link to the picture when a picture is used.",
      "It must be exactly 500 words long.",
      ""
    ],
    "answer": [
      "It is told with a strong storyline and an interesting ending.",
      "It makes a clear link to the picture when a picture is used.",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "essay_writing",
    "topic": "picture_prompts",
    "subtopic": "responding_to_a_picture",
    "skills": [
      "english_fal_respond_to_picture_prompt"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Check each option against the marker's instructions.\n- One option names a length that the paper does not set."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2024,
    "paper": "nov_p3",
    "name": "Question 4",
    "order": 4,
    "context_text": null,
    "question": "Match each type of essay to the feature the marker expects.",
    "metadata": [
      "A - narrative essay",
      "B - descriptive essay",
      "C - argumentative essay",
      "1 - paints a picture using the senses",
      "2 - defends a specific viewpoint with arguments",
      "3 - tells a story with a strong ending"
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
    "unit": "essay_writing",
    "topic": "essay_types",
    "subtopic": "features_of_essay_types",
    "skills": [
      "english_fal_match_essay_types_to_features"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Think about what each type is meant to do for the reader.\n- Start with the type you know best."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2024,
    "paper": "nov_p3",
    "name": "Question 5",
    "order": 5,
    "context_text": null,
    "question": "What is the minimum number of words for the essay in this paper? Write the number.",
    "metadata": [
      "Words:",
      "[ ]"
    ],
    "answer": [
      "250",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "definition",
    "unit": "essay_writing",
    "topic": "language_style_and_editing",
    "subtopic": "length_of_the_essay",
    "skills": [
      "english_fal_recall_task_requirements"
    ],
    "difficulty": 1,
    "exam_weight": 1,
    "clues": "- The paper gives a range.\n- Write digits only.",
    "keyboard_type": "text"
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2024,
    "paper": "nov_p3",
    "name": "Question 6",
    "order": 6,
    "context_text": null,
    "question": "Which advice describes 'show, don't tell' in narrative writing?",
    "metadata": [
      "Tell the reader every feeling in one sentence.",
      "Show the reader how a character feels through what he or she does.",
      "Avoid dialogue and description.",
      "Use only very short words.",
      ""
    ],
    "answer": [
      "Show the reader how a character feels through what he or she does.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "essay_writing",
    "topic": "language_style_and_editing",
    "subtopic": "show_dont_tell",
    "skills": [
      "english_fal_apply_planning_steps"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "clues": "- A character's actions can reveal feelings.\n- Reject advice that removes detail."
  }
];

// ─── AI explanation — one entry per REAL printed sub-question, real marks (AIEXP-08) ───

const aiExplanation = {
  "sub_questions": [
    {
      "number": "1.1",
      "marks": 50,
      "clues": "- Decide what the topic means to you before choosing a type of essay.",
      "approach": "- Choose a type; mixed types are accepted if relevant\n- Plan beginning, middle and end\n- Keep to 250–300 words",
      "solution": "1. The memo lists narrative, reflective, descriptive, discursive or argumentative responses as acceptable for 'It's my life …'.\n2. Each type must show its features: narrative needs a strong storyline and interesting ending; reflective conveys feelings; descriptive uses the senses; discursive balances both sides; argumentative defends a view.\n3. The essay is marked on content and planning (30), language, style and editing (15) and structure (5)."
    },
    {
      "number": "1.2",
      "marks": 50,
      "clues": "- Decide what the topic means to you before choosing a type of essay.",
      "approach": "- Choose a type; mixed types are accepted if relevant\n- Plan beginning, middle and end\n- Keep to 250–300 words",
      "solution": "1. The memo lists discursive, argumentative, narrative, reflective or descriptive responses as acceptable for 'Small steps; big changes'.\n2. Each type must show its features: narrative needs a strong storyline and interesting ending; reflective conveys feelings; descriptive uses the senses; discursive balances both sides; argumentative defends a view.\n3. The essay is marked on content and planning (30), language, style and editing (15) and structure (5)."
    },
    {
      "number": "1.3",
      "marks": 50,
      "clues": "- Decide what the topic means to you before choosing a type of essay.",
      "approach": "- Choose a type; mixed types are accepted if relevant\n- Plan beginning, middle and end\n- Keep to 250–300 words",
      "solution": "1. The memo lists discursive, reflective, descriptive, argumentative or narrative responses as acceptable for 'Allow your silence to speak for you.'.\n2. Each type must show its features: narrative needs a strong storyline and interesting ending; reflective conveys feelings; descriptive uses the senses; discursive balances both sides; argumentative defends a view.\n3. The essay is marked on content and planning (30), language, style and editing (15) and structure (5)."
    },
    {
      "number": "1.4",
      "marks": 50,
      "clues": "- Decide what the topic means to you before choosing a type of essay.",
      "approach": "- Choose a type; mixed types are accepted if relevant\n- Plan beginning, middle and end\n- Keep to 250–300 words",
      "solution": "1. The memo lists narrative, descriptive, reflective, discursive or argumentative responses as acceptable for 'That was unexpected!'.\n2. Each type must show its features: narrative needs a strong storyline and interesting ending; reflective conveys feelings; descriptive uses the senses; discursive balances both sides; argumentative defends a view.\n3. The essay is marked on content and planning (30), language, style and editing (15) and structure (5)."
    },
    {
      "number": "1.5",
      "marks": 50,
      "clues": "- Decide what the topic means to you before choosing a type of essay.",
      "approach": "- Choose a type; mixed types are accepted if relevant\n- Plan beginning, middle and end\n- Keep to 250–300 words",
      "solution": "1. The memo lists discursive, argumentative, reflective, narrative or descriptive responses as acceptable for ''Comparison is the thief of joy.' – Theodore Roosevelt'.\n2. Each type must show its features: narrative needs a strong storyline and interesting ending; reflective conveys feelings; descriptive uses the senses; discursive balances both sides; argumentative defends a view.\n3. The essay is marked on content and planning (30), language, style and editing (15) and structure (5)."
    },
    {
      "number": "1.6",
      "marks": 50,
      "clues": "- Look closely at the picture and decide what it shows and what it might stand for.",
      "approach": "- Choose a type\n- Give your own title\n- Link your essay clearly to the picture",
      "solution": "1. The picture shows a child on a swing: literal readings include playing, childhood; figurative readings include innocence, being carefree.\n2. Any essay type and any suitable tense is accepted, provided the link to the picture is clear and the essay has a suitable title."
    },
    {
      "number": "1.7",
      "marks": 50,
      "clues": "- Look closely at the picture and decide what it shows and what it might stand for.",
      "approach": "- Choose a type\n- Give your own title\n- Link your essay clearly to the picture",
      "solution": "1. The picture shows a robot cooking: literal readings include artificial intelligence, cooking; figurative readings include the future, time travel.\n2. Any essay type and any suitable tense is accepted, provided the link to the picture is clear and the essay has a suitable title."
    },
    {
      "number": "1.8",
      "marks": 50,
      "clues": "- Look closely at the picture and decide what it shows and what it might stand for.",
      "approach": "- Choose a type\n- Give your own title\n- Link your essay clearly to the picture",
      "solution": "1. The picture shows a galloping horse: literal readings include a horse, transport; figurative readings include strength, freedom.\n2. Any essay type and any suitable tense is accepted, provided the link to the picture is clear and the essay has a suitable title."
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
