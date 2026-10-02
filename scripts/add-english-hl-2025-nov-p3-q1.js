#!/usr/bin/env node
/**
 * DBE English HL P3 — November 2025 — Question 1: Essay (order 1)
 * Eight essay topics (1.1–1.5 written prompts, 1.6–1.8 pictures: stepping stones, coin
 * toss, child carving wood), 400–450 words, marked on the 50-mark essay rubric. Practice
 * set covers essay theory — planning, thesis, narrative arc, picture response, show-don't-
 * tell, genre, conclusions — on fresh example topics (workflow Appendix "Paper 3
 * structure", DESIGN-UNI-01). aiExplanation has one entry per real topic 1.1–1.8 (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-english-hl-2025-nov-p3-q1.js --curriculum temp/curriculum-vocab-english.json
 *   node scripts/add-english-hl-2025-nov-p3-q1.js --dry-run
 *   node scripts/add-english-hl-2025-nov-p3-q1.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

const BASE = 'https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_hl/2025/nov_p3/q1';

// ─── Phase 2 — lesson document ───────────────────────────────────────────────

const video = {
  name: 'Question 1: Essay',
  syllabus: 'dbe',
  subject: 'english_hl',
  year: 2025,
  paper: 'nov_p3',
  order: 1,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['essay_structure', 'planning', 'creative_writing', 'narrative_structure', 'argumentative_writing'],
  question_image_urls: [`${BASE}/question_1.png`, `${BASE}/question_2.png`, `${BASE}/question_3.png`],
  memo_image_urls: [`${BASE}/memo_1.png`, `${BASE}/memo_2.png`, `${BASE}/memo_3.png`, `${BASE}/memo_4.png`, `${BASE}/memo_5.png`],
  exam_question_marks: 50,
  supplementary_materials: null,
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    xp: 10, syllabus: 'dbe', subject: 'english_hl', year: 2025, paper: 'nov_p3',
    name: 'Question 1',
    order: 1,
    context_text: null,
    question: "A learner chooses the topic 'Convenience has made us impatient.' What is the MAIN purpose of drawing a mind map before writing?",
    metadata: [
      'To list every word that might be hard to spell in the essay',
      'To write a full rough draft that will be copied out neatly',
      'To work out how many words each paragraph will need',
      'To generate ideas and decide on a logical order for them',
      '',
    ],
    answer: ['To generate ideas and decide on a logical order for them', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'definition',
    unit: 'essay_writing',
    topic: 'essay_structure',
    subtopic: 'planning_process',
    skills: ['essay_planning', 'identify_planning_purpose'],
    difficulty: 1,
    exam_weight: 2,
    clues: '- Think about what happens before a single sentence of the essay is written.\n- A plan helps with both content and structure.',
  },
  {
    xp: 10, syllabus: 'dbe', subject: 'english_hl', year: 2025, paper: 'nov_p3',
    name: 'Question 2',
    order: 2,
    context_text: null,
    question: "For the argumentative topic 'Having more choices makes people less happy', which sentence is the STRONGEST thesis statement?",
    metadata: [
      'In this essay I will talk about choices and also about happiness.',
      'Choices are a big part of life, and everybody has to make them.',
      'Endless choice breeds anxiety and regret, so more leaves us less content.',
      'Some people like having choices, while other people really do not like them at all.',
      '',
    ],
    answer: ['Endless choice breeds anxiety and regret, so more leaves us less content.', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'essay_writing',
    topic: 'essay_structure',
    subtopic: 'thesis_statement',
    skills: ['identify_thesis_statement', 'construct_thesis'],
    difficulty: 3,
    exam_weight: 3,
    clues: '- A thesis takes a clear position on the topic.\n- It hints at the reasons the essay will develop.',
  },
  {
    xp: 10, syllabus: 'dbe', subject: 'english_hl', year: 2025, paper: 'nov_p3',
    name: 'Question 3',
    order: 3,
    context_text: null,
    question: "A learner plans a narrative essay titled 'The map of my hands'. Arrange the plot stages in the correct order, from beginning to end.",
    metadata: [
      'Climax: the narrator must use those hands to save the family bakery',
      'Exposition: the narrator introduces hands scarred by years of hard work',
      'Resolution: the narrator now sees the scars as a record of survival',
      'Rising action: a fire breaks out in the bakery the family has built',
      'Falling action: the flames are out and the neighbours gather to help',
    ],
    answer: [
      'Exposition: the narrator introduces hands scarred by years of hard work',
      'Rising action: a fire breaks out in the bakery the family has built',
      'Climax: the narrator must use those hands to save the family bakery',
      'Falling action: the flames are out and the neighbours gather to help',
      'Resolution: the narrator now sees the scars as a record of survival',
    ],
    presentation: 'ordering',
    type: 'application',
    unit: 'essay_writing',
    topic: 'narrative_structure',
    subtopic: 'narrative_arc',
    skills: ['sequence_essay_elements', 'identify_narrative_arc'],
    difficulty: 2,
    exam_weight: 2,
    clues: '- Tension builds towards one turning point and then eases.\n- The ending shows how the narrator has changed.',
  },
  {
    xp: 10, syllabus: 'dbe', subject: 'english_hl', year: 2025, paper: 'nov_p3',
    name: 'Question 4',
    order: 4,
    context_text: 'The picture shows an old wooden door, slightly open, with bright light spilling through the gap onto a dark floor.',
    question: 'A learner chooses to respond to this picture. Select the THREE essay plans that show a clear link to the picture.',
    metadata: [
      'A story in which a nervous learner steps through a door into a new opportunity',
      'A reflective essay on how one small chance let hope into a dark time',
      'An argumentative essay on why schools should ban cellphones in class',
      'A descriptive essay on the moment light first entered an abandoned house',
      'A narrative about winning a cooking competition with a family recipe',
    ],
    answer: [
      'A story in which a nervous learner steps through a door into a new opportunity',
      'A reflective essay on how one small chance let hope into a dark time',
      'A descriptive essay on the moment light first entered an abandoned house',
      '',
      '',
    ],
    presentation: 'multi_select',
    type: 'application',
    unit: 'essay_writing',
    topic: 'essay_structure',
    subtopic: 'picture_response',
    skills: ['evaluate_content_focus', 'interpret_symbol'],
    difficulty: 3,
    exam_weight: 3,
    clues: '- The link can be literal (the door itself) or figurative (what the door and light suggest).\n- A plan with no connection to the image is irrelevant, however good it is.',
  },
  {
    xp: 10, syllabus: 'dbe', subject: 'english_hl', year: 2025, paper: 'nov_p3',
    name: 'Question 5',
    order: 5,
    context_text: "Draft sentence: 'He felt very nervous and out of place at the party because everyone else was confident.'",
    question: "Which revision BEST shows the character's discomfort instead of simply stating it?",
    metadata: [
      'He was extremely nervous and very out of place at the party that night.',
      'He tugged at his plain shirt and hovered by the door, avoiding every group.',
      'He felt that he did not belong, because the other guests were all confident.',
      'At the party, he was the most nervous person among all the confident guests.',
      '',
    ],
    answer: ['He tugged at his plain shirt and hovered by the door, avoiding every group.', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'essay_writing',
    topic: 'creative_writing',
    subtopic: 'essay_qualities',
    skills: ['evaluate_creative_essay', 'identify_effective_writing'],
    difficulty: 3,
    exam_weight: 3,
    clues: "- 'Showing' uses actions and details so the reader works out the feeling.\n- Look for the option that never names the emotion.",
  },
  {
    xp: 10, syllabus: 'dbe', subject: 'english_hl', year: 2025, paper: 'nov_p3',
    name: 'Question 6',
    order: 6,
    context_text: null,
    question: 'Match each essay type to the description that fits it BEST.',
    metadata: [
      'A - Narrative',
      'B - Descriptive',
      'C - Reflective',
      'D - Argumentative',
      '1 - Takes a clear stand and defends it with reasons and evidence',
      '2 - Tells a story with characters, a conflict and a resolution',
      "3 - Explores the writer's thoughts and growth after an experience",
      '4 - Paints a vivid picture of a person, place or moment using the senses',
    ],
    answer: ['A-2', 'B-4', 'C-3', 'D-1'],
    presentation: 'match',
    type: 'definition',
    unit: 'essay_writing',
    topic: 'creative_writing',
    subtopic: 'essay_genres',
    skills: ['distinguish_text_types', 'match_essay_element_to_function'],
    difficulty: 2,
    exam_weight: 2,
    clues: '- Ask what each type is mainly trying to do: tell, show, think or persuade.',
  },
  {
    xp: 10, syllabus: 'dbe', subject: 'english_hl', year: 2025, paper: 'nov_p3',
    name: 'Question 7',
    order: 7,
    context_text: null,
    question: 'A learner writes a humorous essay about a family road trip on which everything went wrong. Which concluding sentence is MOST effective?',
    metadata: [
      'In conclusion, that was the story of our road trip and what happened on it.',
      'That is the end of my essay, and I hope that you enjoyed reading all of it.',
      'Road trips can be good or bad, and this particular one was mostly bad, as I have shown.',
      'We never reached Durban, but we still laugh about that goat.',
      '',
    ],
    answer: ['We never reached Durban, but we still laugh about that goat.', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'essay_writing',
    topic: 'essay_structure',
    subtopic: 'conclusion_elements',
    skills: ['evaluate_conclusion'],
    difficulty: 2,
    exam_weight: 2,
    clues: '- A strong ending keeps the tone of the essay.\n- Avoid announcing the essay instead of ending the story.',
  },
];

// ─── AI explanation — real exam Question 1 topics 1.1–1.8 (AIEXP-08) ─────────

const ESSAY_APPROACH = '- Plan first (mind map or key words) and place the plan before the essay\n- Choose a genre and a clear angle on the topic\n- Write 400–450 words with an engaging introduction, developed body paragraphs and a deliberate ending\n- Proofread for language, tone and paragraphing';

const aiExplanation = {
  sub_questions: [
    {
      number: '1.1',
      marks: 50,
      clues: '- A room of mirrors can be a real place or a symbol.\n- Think about what it means to see yourself from every angle.',
      approach: ESSAY_APPROACH,
      solution: '1. The memo credits literal, figurative and mixed responses, so any genre is acceptable.\n2. A literal response might be a narrative set in a hall of mirrors or a dance studio; a figurative one might explore self-image, social media or constant self-scrutiny.\n3. Whatever the angle, the mirrors must stay central to the essay, not appear only in the title.\n4. Marks come from the rubric: Content and Planning 30, Language, Style and Editing 15, Structure 5.',
    },
    {
      number: '1.2',
      marks: 50,
      clues: '- The statement makes a claim you can agree with, reject or qualify.\n- Consider consumerism, ambition, technology or status.',
      approach: '- Decide whether to argue for, against or a mixed position\n- Plan two or three strong reasons, each with an example or anecdote\n- Open with a clear stance and end by reinforcing it\n- Keep to 400–450 words',
      solution: '1. The memo allows candidates to argue for or against the statement, or to present a mixed response.\n2. Anecdotal content is accepted, so personal stories can support the argument.\n3. A strong essay states its position early, develops reasons logically and uses a convincing, mature tone.\n4. Marking follows the essay rubric: Content and Planning 30, Language, Style and Editing 15, Structure 5.',
    },
    {
      number: '1.3',
      marks: 50,
      clues: '- The topic sentence sets up a contrast between one person and a crowd.\n- Ask why this person feels or looks so different.',
      approach: ESSAY_APPROACH,
      solution: "1. The memo credits literal, figurative and mixed responses.\n2. The prompt describes an outsider (folded arms, plain clothes, awkward stance) among confident, stylish people; a strong essay builds on that contrast.\n3. It could be a narrative told by or about the outsider, or a reflection on belonging, confidence or judging by appearance.\n4. The rubric rewards mature, original ideas, vivid language and a clear introduction, body and ending (30 + 15 + 5 marks).",
    },
    {
      number: '1.4',
      marks: 50,
      clues: '- Scars can be physical or emotional.\n- Think about what a scar might say about the past.',
      approach: ESSAY_APPROACH,
      solution: '1. The memo credits literal, figurative and mixed responses.\n2. A literal essay might tell the story behind a physical scar; a figurative one might treat emotional wounds as a language that records loss, survival or growth.\n3. The idea of scars "speaking" or teaching something should run through the essay.\n4. Marking follows the essay rubric: Content and Planning 30, Language, Style and Editing 15, Structure 5.',
    },
    {
      number: '1.5',
      marks: 50,
      clues: '- The essay must be funny and recognisably South African.\n- Everyday situations often provide the best humour.',
      approach: '- Choose a South African situation with comic potential (taxis, load-shedding, family gatherings, queues)\n- Plan a storyline or series of incidents that builds to a funny climax\n- Use dialogue, exaggeration and timing to create humour\n- Keep within 400–450 words',
      solution: '1. The memo credits responses that allow for individual interpretations of humour within a South African context.\n2. The essay must actually be humorous, and its setting or situation must be clearly South African.\n3. Humour can come from situation, character, dialogue or irony, but the writing must stay coherent and well structured.\n4. Marking follows the essay rubric: Content and Planning 30, Language, Style and Editing 15, Structure 5.',
    },
    {
      number: '1.6',
      marks: 50,
      clues: '- The picture shows a person crossing a river on stepping stones.\n- Think about crossings, progress and taking one step at a time.',
      approach: '- Decide on a literal or figurative reading of the picture\n- Make the link to the picture clear early in the essay\n- Give the essay your own title\n- Develop the idea over 400–450 words with a strong ending',
      solution: '1. The memo describes this picture as stepping stones or a journey and credits literal, figurative and mixed responses.\n2. A literal essay might describe a hike or river crossing; a figurative one might treat each stone as a stage in life, a goal or an obstacle overcome.\n3. The paper notes there must be a clear link between the essay and the picture chosen.\n4. Marking follows the essay rubric: Content and Planning 30, Language, Style and Editing 15, Structure 5.',
    },
    {
      number: '1.7',
      marks: 50,
      clues: '- The picture shows a coin being flipped from a thumb.\n- Consider chance, decisions and outcomes you cannot control.',
      approach: '- Decide on a literal or figurative reading of the picture\n- Make the link to the picture clear early in the essay\n- Give the essay your own title\n- Develop the idea over 400–450 words with a strong ending',
      solution: '1. The memo describes this picture as a coin toss and credits literal, figurative and mixed responses.\n2. A literal essay might centre on a match or a bet decided by a coin; a figurative one might reflect on luck, risk or a life-changing decision left to chance.\n3. The paper requires a clear link between the essay and the picture.\n4. Marking follows the essay rubric: Content and Planning 30, Language, Style and Editing 15, Structure 5.',
    },
    {
      number: '1.8',
      marks: 50,
      clues: '- The picture shows a child carving a train out of a log by the roadside.\n- Think about talent, imagination and making something from very little.',
      approach: '- Decide on a literal or figurative reading of the picture\n- Make the link to the picture clear early in the essay\n- Give the essay your own title\n- Develop the idea over 400–450 words with a strong ending',
      solution: '1. The memo describes this picture as a child carving wood and credits literal, figurative and mixed responses.\n2. A literal essay might tell the child\'s story; a figurative one might explore creativity, hidden talent, dreams of travel or shaping one\'s own future.\n3. The paper requires a clear link between the essay and the picture.\n4. Marking follows the essay rubric: Content and Planning 30, Language, Style and Editing 15, Structure 5.',
    },
  ],
  model: 'claude-opus-5-5',
  generated_at: Date.now(),
  version: 2,
  reviewed: false,
  input_tokens: 0,
  output_tokens: 0,
  avg_rating: null,
  rating_count: null,
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
