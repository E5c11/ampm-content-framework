#!/usr/bin/env node
/**
 * DBE English FAL P3 — November 2025 — Question 1: Essay (order 1) — eight topics (1.1–1.5 written prompts, 1.6–1.8 pictures), 250–300 words, 50-mark rubric. Practice covers essay theory on fresh examples (LANG-WR-02).
 * Practice questions test the conventions and criteria of the text type on FRESH scenarios (LANG-WR-01/03); they never
 * reuse the real task's content (DESIGN-UNI-01). aiExplanation: one entry per REAL task with its real marks (AIEXP-08).
 * Every fitb declares keyboard_type 'text' (LANG-KB-01).
 *
 * BASIS per practice question — M = marking guideline, P = printed in the paper, C = CAPS §3.3/§3.4:
 *   Q1: C: CAPS §3.3 'Planning/pre-writing' (brainstorm ideas, identify main ideas).
 *   Q2: C: CAPS §3.3 steps in process writing.
 *   Q3: M: the memo's feature list for narrative, descriptive and discursive essays.
 *   Q4: M/P: memo 'Interpretation of pictures' and the paper's instruction for 1.6–1.8.
 *   Q5: P: the paper states 250–300 words.
 *   Q6: M: memo — content and planning 30, language/style/editing 15, structure 5.
 *
 *   node tools/validate-questions.js --script scripts/add-english-fal-2025-nov-p3-q1.js --curriculum temp/curriculum-vocab-english-fal.json
 *   node scripts/add-english-fal-2025-nov-p3-q1.js --dry-run
 *   node scripts/add-english-fal-2025-nov-p3-q1.js
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
  "year": 2025,
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
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p3/q1/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p3/q1/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p3/q1/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p3/q1/memo_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p3/q1/memo_3.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p3/q1/memo_4.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2025/nov_p3/q1/memo_5.png"
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
    "year": 2025,
    "paper": "nov_p3",
    "name": "Question 1",
    "order": 1,
    "context_text": null,
    "question": "Why should a candidate plan an essay before writing it?",
    "metadata": [
      "to write the whole essay in rough before copying it out",
      "to generate ideas and put them in a logical order before writing",
      "to count how many words each paragraph will have",
      "to list every difficult word that might be misspelt",
      ""
    ],
    "answer": [
      "to generate ideas and put them in a logical order before writing",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "essay_writing",
    "topic": "planning_and_structure",
    "subtopic": "purpose_of_planning",
    "skills": [
      "english_fal_apply_planning_steps"
    ],
    "difficulty": 1,
    "exam_weight": 2,
    "clues": "- Think about what a plan helps you decide before you start.\n- Look for the option about ideas and order."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2025,
    "paper": "nov_p3",
    "name": "Question 2",
    "order": 2,
    "context_text": null,
    "question": "Arrange the steps of the writing process in the order in which they are done.",
    "metadata": [
      "Revising and editing",
      "Planning (pre-writing)",
      "Proofreading and presenting",
      "Drafting",
      ""
    ],
    "answer": [
      "Planning (pre-writing)",
      "Drafting",
      "Revising and editing",
      "Proofreading and presenting",
      ""
    ],
    "presentation": "ordering",
    "type": "application",
    "unit": "essay_writing",
    "topic": "planning_and_structure",
    "subtopic": "writing_process",
    "skills": [
      "english_fal_order_events"
    ],
    "difficulty": 1,
    "exam_weight": 2,
    "clues": "- You cannot edit a piece of writing that has not been drafted.\n- Presenting the final copy comes last."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2025,
    "paper": "nov_p3",
    "name": "Question 3",
    "order": 3,
    "context_text": null,
    "question": "Match each type of essay to the feature the marker expects.",
    "metadata": [
      "A - narrative essay",
      "B - descriptive essay",
      "C - discursive essay",
      "1 - a picture in words that uses many of the senses",
      "2 - arguments for and against that are balanced and analysed",
      "3 - a strong storyline and an interesting ending"
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
    "clues": "- Think about what each type is meant to do for the reader.\n- Use the type you know best first."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2025,
    "paper": "nov_p3",
    "name": "Question 4",
    "order": 4,
    "context_text": null,
    "question": "Select the TWO things a candidate must do when answering a picture topic.",
    "metadata": [
      "Give the essay a suitable title",
      "Copy the caption printed under the picture",
      "Link the interpretation clearly to the picture",
      "Write the essay in the present tense only",
      "Describe the photographer's techniques"
    ],
    "answer": [
      "Give the essay a suitable title",
      "Link the interpretation clearly to the picture",
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
    "clues": "- The paper tells you to give your own title and to show a link.\n- Reject options that limit the tense or ask for technical detail."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2025,
    "paper": "nov_p3",
    "name": "Question 5",
    "order": 5,
    "context_text": null,
    "question": "What is the maximum number of words for the essay in this paper? Write the number.",
    "metadata": [
      "Words:",
      "[ ]"
    ],
    "answer": [
      "300",
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
    "clues": "- The paper states a range of words for the essay.\n- Write digits only.",
    "keyboard_type": "text"
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2025,
    "paper": "nov_p3",
    "name": "Question 6",
    "order": 6,
    "context_text": null,
    "question": "Which criterion carries the most marks in the essay rubric?",
    "metadata": [
      "structure (30 of the 50 marks)",
      "spelling and handwriting (30 of the 50 marks)",
      "content and planning (30 of the 50 marks)",
      "title and layout (30 of the 50 marks)",
      ""
    ],
    "answer": [
      "content and planning (30 of the 50 marks)",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "essay_writing",
    "topic": "language_style_and_editing",
    "subtopic": "how_the_essay_is_marked",
    "skills": [
      "english_fal_recall_task_requirements"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- The memo lists three criteria with their marks.\n- Ideas and organisation are weighted most heavily."
  }
];

// ─── AI explanation — one entry per REAL task, real marks (AIEXP-08) ─────────

const aiExplanation = {
  "sub_questions": [
    {
      "number": "1.1",
      "marks": 50,
      "clues": "- Decide which type of essay you will write; several types are accepted.\n- Link every paragraph to the idea of a smile and its story.",
      "approach": "- Choose a type (reflective, narrative, descriptive, discursive or argumentative)\n- Plan beginning, middle and end\n- Keep to 250–300 words",
      "solution": "1. A reflective essay conveys feelings and reactions; a narrative needs a strong storyline and interesting ending.\n2. A descriptive essay paints a picture with the senses.\n3. A discursive essay balances arguments; an argumentative essay defends one view.\n4. Mixed types are accepted if relevant."
    },
    {
      "number": "1.2",
      "marks": 50,
      "clues": "- 'It gets easier' suggests a process over time.\n- Pick a type that suits your idea.",
      "approach": "- Choose a type\n- Plan a clear development\n- Conclude with a firm point",
      "solution": "1. Discursive, reflective, narrative, argumentative and descriptive essays are all acceptable.\n2. Each type must show its own features (balance, feelings, storyline, a stance, or sensory detail)."
    },
    {
      "number": "1.3",
      "marks": 50,
      "clues": "- Think of a concrete promise and what stopped you.\n- A narrative would need an interesting ending.",
      "approach": "- Choose a type\n- Plan the sequence\n- Keep to the word limit",
      "solution": "1. A narrative essay is a natural fit, but reflective, descriptive, discursive and argumentative essays are all accepted.\n2. Use the features expected for the type chosen."
    },
    {
      "number": "1.4",
      "marks": 50,
      "clues": "- 'The mask' is figurative; decide what it stands for.\n- Make that meaning clear early.",
      "approach": "- Choose a type\n- Define the mask\n- Plan a clear ending",
      "solution": "1. Reflective, descriptive, narrative, discursive and argumentative responses are all accepted.\n2. The essay should have a clear interpretation of the mask."
    },
    {
      "number": "1.5",
      "marks": 50,
      "clues": "- Read the quotation slowly: it is about perception.\n- Decide whether you agree.",
      "approach": "- Choose a type\n- Explain the quotation in your own words\n- Support your view with examples",
      "solution": "1. Discursive and argumentative responses suit the quotation, and reflective, descriptive or narrative responses are also accepted.\n2. Use clear examples to support your points."
    },
    {
      "number": "1.6",
      "marks": 50,
      "clues": "- Look at the picture and decide what it shows literally and what it suggests.\n- Give your own title and link it clearly.",
      "approach": "- Choose a type\n- Give a title\n- Link your essay to the picture",
      "solution": "1. The picture (an old man) can be read literally as ageing or grandparents, or figuratively as wisdom and maturity.\n2. Any appropriate tense and any essay type is accepted if the link to the picture is clear."
    },
    {
      "number": "1.7",
      "marks": 50,
      "clues": "- Think about what a snarling animal cub suggests.\n- Give your own title and link it to the picture.",
      "approach": "- Choose a type\n- Give a title\n- Link your essay to the picture",
      "solution": "1. The picture (a snarling cub) can be read literally as wild animals or youth, or figuratively as strength and tenacity.\n2. Any appropriate tense and any essay type is accepted if the link is clear."
    },
    {
      "number": "1.8",
      "marks": 50,
      "clues": "- Look at what is shown and what it might stand for.\n- Give your own title and link it.",
      "approach": "- Choose a type\n- Give a title\n- Link your essay to the picture",
      "solution": "1. The picture (eggs on a cloth) can be read literally as eggs or food, or figuratively as rebirth and fragility.\n2. Any appropriate tense and any essay type is accepted if the link is clear."
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
