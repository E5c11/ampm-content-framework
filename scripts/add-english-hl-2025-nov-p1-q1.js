#!/usr/bin/env node
/**
 * DBE English HL P1 — November 2025 — Question 1: Comprehension (order 1)
 * TEXT A: article on youth / social entrepreneurship in Africa. TEXT B: youth business
 * competition advert. Practice set mirrors the text-extractable sub-questions (1.3–1.10:
 * writer's point, purpose of case studies, tone, single-sentence paragraph, implication of
 * statistics, diction, conclusion) with fresh stimulus on the same theme (DESIGN-ENG-01/02,
 * DESIGN-UNI-01). 1.11/1.12 are visual-dependent and skipped for practice; aiExplanation
 * still covers every real sub-question 1.1–1.13 (AIEXP-08).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-english-hl-2025-nov-p1-q1.js --curriculum temp/curriculum-vocab-english.json
 *   node scripts/add-english-hl-2025-nov-p1-q1.js --dry-run
 *   node scripts/add-english-hl-2025-nov-p1-q1.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

const BASE = 'https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_hl/2025/nov_p1/q1';

// ─── Phase 2 — lesson document ───────────────────────────────────────────────

const video = {
  name: 'Question 1: Comprehension',
  syllabus: 'dbe',
  subject: 'english_hl',
  year: 2025,
  paper: 'nov_p1',
  order: 1,
  content_tier: 'free',
  has_video: false,
  xp: 50,
  tags: ['comprehension', 'tone_and_mood', 'diction', 'inferential_reading'],
  question_image_urls: [`${BASE}/question_1.png`],
  memo_image_urls: [`${BASE}/memo_1.png`, `${BASE}/memo_2.png`],
  exam_question_marks: 30,
  supplementary_materials: [
    { type: 'annexure', label: 'Text A', image_urls: [`${BASE}/annexure_text_a_1.png`, `${BASE}/annexure_text_a_2.png`] },
    { type: 'annexure', label: 'Text B', image_urls: [`${BASE}/annexure_text_b_1.png`] },
  ],
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────


const questions = [
  {
    xp: 10, syllabus: 'dbe', subject: 'english_hl', year: 2025, paper: 'nov_p1',
    name: 'Question 1',
    order: 1,
    context_text: "Across the continent, the queue of qualified young people waiting for a salaried position grows longer each year, while the number of such positions barely moves. For many of these graduates, starting a small business is no longer a fallback; it is the most realistic route to earning a living.",
    question: 'What point is the writer making about young graduates and employment?',
    metadata: [
      'Most graduates would rather run a business than work for an employer.',
      'Salaried jobs are scarce, so self-employment has become a practical necessity for many graduates.',
      'Graduates are poorly qualified for the salaried positions that are available.',
      'Salaried positions are increasing faster than the number of graduates.',
      '',
    ],
    answer: ['Salaried jobs are scarce, so self-employment has become a practical necessity for many graduates.', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'comprehension',
    topic: 'literal_comprehension',
    subtopic: 'main_idea_identification',
    skills: ['identify_main_point'],
    difficulty: 2,
    exam_weight: 2,
    clues: "- Compare what the extract says about the number of job seekers with the number of jobs.\n- Ask what conclusion the writer draws from that gap.",
  },
  {
    xp: 10, syllabus: 'dbe', subject: 'english_hl', year: 2025, paper: 'nov_p1',
    name: 'Question 2',
    order: 2,
    context_text: null,
    question: 'A feature article argues that young people should be supported to start their own businesses. Match each element the writer includes to its main purpose in the argument.',
    metadata: [
      'A - The story of a named 24-year-old who built a solar-charging kiosk',
      'B - A survey figure showing how many founders used their own savings',
      'C - A direct quotation from a young business owner',
      '1 - Provides measurable evidence for a general claim',
      '2 - Lets a first-hand voice convey the experience authentically',
      '3 - Makes the argument concrete through a real-life success story',
    ],
    answer: ['A-3', 'B-1', 'C-2'],
    presentation: 'match',
    type: 'application',
    unit: 'comprehension',
    topic: 'inferential_reading',
    subtopic: 'purpose_of_detail',
    skills: ['identify_purpose_of_detail'],
    difficulty: 3,
    exam_weight: 2,
    clues: "- Ask what kind of support each element gives: facts, a personal voice, or an example.\n- Numbers and personal stories persuade readers in different ways.",
  },
  {
    xp: 10, syllabus: 'dbe', subject: 'english_hl', year: 2025, paper: 'nov_p1',
    name: 'Question 3',
    order: 3,
    context_text: "Yet in a single township street, a 22-year-old now repairs cellphones for half the neighbourhood, and her cousin sells home-grown seedlings to three local schools. If young people like these are given the right support, there is every reason to believe that the next generation of employers is already among us.",
    question: "The writer's tone in the extract is best described as …",
    metadata: ['sceptical', 'resentful', 'hopeful', 'detached', ''],
    answer: ['hopeful', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'comprehension',
    topic: 'tone_and_mood',
    subtopic: 'tone_identification',
    skills: ['identify_tone'],
    difficulty: 2,
    exam_weight: 3,
    clues: "- Look at how the writer views the future in the final sentence.\n- Phrases such as 'every reason to believe' reveal the writer's attitude.",
  },
  {
    xp: 10, syllabus: 'dbe', subject: 'english_hl', year: 2025, paper: 'nov_p1',
    name: 'Question 4',
    order: 4,
    context_text: "[Paragraph 4] The founders interviewed described long hours, repeated setbacks and loans they were still repaying. Several had turned down better-paid offers from established firms. [Paragraph 5] For almost all of them, the point was never the money.",
    question: 'Paragraph 5 consists of a single sentence. What is the effect of this?',
    metadata: [
      'It introduces a new, unrelated topic for the rest of the article.',
      "It contradicts the founders' descriptions of their hardships.",
      'It shows that the writer has run out of evidence to support the argument.',
      "It isolates and emphasises the key insight that the founders' motivation went beyond profit.",
      '',
    ],
    answer: ["It isolates and emphasises the key insight that the founders' motivation went beyond profit.", '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'comprehension',
    topic: 'paragraph_structure',
    subtopic: 'short_paragraph_effect',
    skills: ['explain_effect', 'analyse_structure'],
    difficulty: 3,
    exam_weight: 2,
    clues: "- A sentence standing alone draws the reader's attention.\n- Consider how paragraph 5 relates to the details in paragraph 4.",
  },
  {
    xp: 10, syllabus: 'dbe', subject: 'english_hl', year: 2025, paper: 'nov_p1',
    name: 'Question 5',
    order: 5,
    context_text: 'Of the 300 young founders surveyed, 64% started their businesses with money they had saved themselves, 18% borrowed from relatives, and only 5% secured a bank loan.',
    question: 'What does this information imply about young entrepreneurs?',
    metadata: [
      'Banks are the most important source of funding for young founders.',
      'Young founders rely largely on their own resources because formal finance is hard to obtain.',
      'Young founders prefer not to involve family members in their businesses.',
      'Most young founders do not need any start-up funding.',
      '',
    ],
    answer: ['Young founders rely largely on their own resources because formal finance is hard to obtain.', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'comprehension',
    topic: 'inferential_reading',
    subtopic: 'implied_meaning',
    skills: ['identify_implications'],
    difficulty: 3,
    exam_weight: 3,
    clues: "- Compare the largest percentage with the smallest one.\n- An implication goes beyond restating the numbers: what do they suggest?",
  },
  {
    xp: 10, syllabus: 'dbe', subject: 'english_hl', year: 2025, paper: 'nov_p1',
    name: 'Question 6',
    order: 6,
    context_text: 'Mentors, incubators and community funds play a vital role in nurturing young businesses. With the right backing, a start-up can be shielded from early shocks and helped to grow into a sustainable enterprise.',
    question: 'Select the THREE words from the extract that most strongly reinforce the idea that young businesses need outside support to succeed.',
    metadata: ['nurturing', 'community', 'shielded', 'backing', 'enterprise'],
    answer: ['nurturing', 'shielded', 'backing', '', ''],
    presentation: 'multi_select',
    type: 'application',
    unit: 'comprehension',
    topic: 'diction_and_word_choice',
    subtopic: 'connotation_and_effect',
    skills: ['analyse_diction', 'identify_connotative_language'],
    difficulty: 3,
    exam_weight: 3,
    clues: "- Look for words that suggest care, protection or help coming from someone else.\n- Some words simply name things and carry no sense of support.",
  },
  {
    xp: 10, syllabus: 'dbe', subject: 'english_hl', year: 2025, paper: 'nov_p1',
    name: 'Question 7',
    order: 7,
    context_text: "In the end, the young founders in this study show that profit and purpose need not compete. If schools and universities teach problem-solving alongside business skills, and if funders keep their doors open to first-time applicants, many more young people could turn the problems in their communities into thriving businesses.",
    question: 'The extract is the final paragraph of an article arguing that young entrepreneurs deserve greater support. Why is it an appropriate conclusion?',
    metadata: [
      'It introduces new statistics that have not been discussed before.',
      "It leaves the reader uncertain about the writer's position.",
      'It restates the main argument and ends with practical recommendations for action.',
      'It focuses only on the failures of young founders to create a balanced view.',
      '',
    ],
    answer: ['It restates the main argument and ends with practical recommendations for action.', '', '', '', ''],
    presentation: 'multiple_choice',
    type: 'application',
    unit: 'comprehension',
    topic: 'evaluative_reading',
    subtopic: 'conclusion_evaluation',
    skills: ['evaluate_conclusion'],
    difficulty: 4,
    exam_weight: 3,
    clues: "- A strong conclusion links back to the article's central argument.\n- Check whether the paragraph suggests what should happen next.",
  },
];

// ─── AI explanation — real exam sub-questions 1.1–1.13 (AIEXP-08) ────────────

const aiExplanation = {
  sub_questions: [
    {
      number: '1.1',
      marks: 1,
      clues: '- Paragraph 1 opens by describing a problem that young Africans face.\n- Entrepreneurship is presented as a response to that problem.',
      approach: '- Reread the first two sentences of paragraph 1\n- Identify the problem the writer names\n- State in one point how entrepreneurship answers that problem',
      solution: '1. Paragraph 1 states that young people in many African countries lack formal employment opportunities.\n2. Entrepreneurship is encouraged because it addresses this lack: it creates alternative sources of employment and allows young people to earn an income.\n3. Any one of these ideas earns the mark.',
    },
    {
      number: '1.2',
      marks: 2,
      clues: "- Focus on the words 'what motivates' in lines 4-6.\n- The question asks for your own words, so do not copy the sentence.",
      approach: '- Find the sentence about the HSRC study in lines 4-6\n- Identify who was studied and what about them was investigated\n- Rephrase both ideas in your own words',
      solution: '1. The study looked at what drives graduate entrepreneurs (1 mark)...\n2. ...to create employment and business opportunities for themselves and for others (1 mark).\n3. Copying the lines word for word earns only 1 mark, so paraphrase.',
    },
    {
      number: '1.3',
      marks: 2,
      clues: '- Paragraph 2 tells the stories of two real young business owners.\n- Think about why real examples are more convincing than general statements.',
      approach: '- Identify what the two case studies show\n- Link them to the argument that entrepreneurship is worth encouraging\n- Explain their effect on the reader',
      solution: "1. The case studies of Pedro and Thandi give real-life examples of successful young entrepreneurs.\n2. This strengthens the writer's argument by proving that entrepreneurship can work, and it motivates the next generation to follow their example.\n3. Other valid explanations of the persuasive purpose are credited.",
    },
    {
      number: '1.4',
      marks: 2,
      clues: "- Paragraph 3 contrasts the number of job seekers with the jobs available.\n- Note the word 'Yet', which signals a turn in the argument.",
      approach: '- Identify what paragraph 3 says about formal employment\n- Note the contrast introduced by entrepreneurship\n- Express the point in your own words',
      solution: "1. The writer's point is that job seekers, even graduates, have limited chances of formal employment.\n2. Entrepreneurship is presented as a way to create opportunities for employment.\n3. Lifting the text directly earns only 1 mark.",
    },
    {
      number: '1.5',
      marks: 1,
      clues: "- Look at the words 'innovate and succeed' and 'better supported'.\n- Decide whether the writer sounds positive, negative or neither.",
      approach: '- Read lines 19-23 closely\n- Note whether the words are positive or negative\n- Eliminate options that do not match the positive outlook',
      solution: "1. The correct answer is D: optimistic.\n2. The writer is positive that entrepreneurship lets young people innovate, succeed and create opportunities for others.\n3. Ironic (A) is wrong because nothing is said that means the opposite of what is intended; cautionary (B) is wrong because there is no warning; neutral (C) is wrong because the writer clearly favours entrepreneurship.",
    },
    {
      number: '1.6',
      marks: 3,
      clues: "- First identify the TIE study's finding about what drives young entrepreneurs.\n- Then look at what Thandi says motivated her.",
      approach: '- State the TIE finding: motives are complex, not just necessity or opportunity\n- Show how Thandi was driven by solving social problems rather than profit alone\n- Link her motivation to her university training and her wish to make a difference',
      solution: "1. The TIE study found that the reasons young people start businesses are complex and overlapping, and often tied to a desire to benefit others, not only to profit.\n2. Thandi illustrates this: she is driven by 'social entrepreneurship', using the problem-solving mindset from her university training to solve social problems, lead and make a difference.\n3. A discussion of two ideas earns 3 marks; lifting without discussion earns only 1.",
    },
    {
      number: '1.7',
      marks: 2,
      clues: '- Paragraph 5 is only one sentence long, which makes it stand out.\n- Consider how it relates to the paragraphs before it.',
      approach: '- Note the content of the single sentence\n- Explain what it does in the structure of the article: summarise or highlight\n- Name the idea it emphasises',
      solution: '1. The single sentence summarises the lessons learned from the case studies (1 mark each for function and content)...\n2. ...or it highlights that entrepreneurs would rather respond to social needs than simply make a profit.\n3. Name the function (summarise/highlight) and the idea for full marks.',
    },
    {
      number: '1.8',
      marks: 3,
      clues: '- Look at which funding source has the highest percentage.\n- The range of sources suggests something about how entrepreneurs behave.',
      approach: '- Note that most entrepreneurs used their own savings\n- Note the wide variety of other funding sources\n- Draw a conclusion about their attitude and motivation',
      solution: "1. The figures imply that most entrepreneurs used their own savings, or actively looked for outside funding from many different sources.\n2. This shows that young entrepreneurs have to pursue resources proactively.\n3. It also supports the idea that their motivation is not only financial gain but also social development. Two ideas discussed, or one idea well discussed, earns 3 marks.",
    },
    {
      number: '1.9',
      marks: 3,
      clues: '- Find words in paragraph 7 that suggest care, help or growth.\n- Think about who provides this support to entrepreneurs.',
      approach: "- Identify at least TWO words or phrases of diction from paragraph 7\n- Explain what these words suggest about the support entrepreneurs need\n- Link the diction to the writer's argument",
      solution: "1. The diction shows that entrepreneurs' success depends on support from stakeholders who play a 'pivotal role' and help them 'launch and scale' their businesses.\n2. Words such as 'nurturing', 'help', 'training', 'essential' and 'enabling environments' stress the care and resources new entrepreneurs need.\n3. A valid comment with TWO examples earns 3 marks; a lift alone earns 1.",
    },
    {
      number: '1.10',
      marks: 3,
      clues: '- Compare paragraph 9 with the main argument introduced at the start of the article.\n- Check whether it refers back to earlier examples and offers advice.',
      approach: '- Take a stance (most likely YES)\n- Show how paragraph 9 restates the main argument\n- Point out its advice and its reference back to the case studies',
      solution: '1. Yes: the conclusion restates the main argument that entrepreneurs are motivated by social benefit, not only by money.\n2. It offers advice on supporting entrepreneurs by calling for relevant academic programmes.\n3. It refers back to the two case studies, reinforcing the role entrepreneurs play in their communities. A NO answer is unlikely but is credited on merit.',
    },
    {
      number: '1.11',
      marks: 3,
      clues: "- Look at the young woman's expression, clothing and what she is holding.\n- Consider who the competition is aimed at.",
      approach: '- Describe her appearance and body language\n- Explain what the tablet suggests\n- Link these qualities to the target audience of young entrepreneurs',
      solution: '1. The young woman looks confident, enthusiastic and suitably dressed, and makes direct eye contact, suggesting she is willing to engage with the reader.\n2. She holds an electronic device, which suggests she is comfortable with technology.\n3. She therefore represents the target audience: proactive, positive young people who want to become entrepreneurs. Two ideas well discussed earns 3 marks.',
    },
    {
      number: '1.12',
      marks: 2,
      clues: "- Think about what a shopping bag is associated with.\n- Consider what 'hustle' means informally.",
      approach: '- Explain what the shopping bag icon draws attention to\n- Link it to the retail market or to the prize on offer\n- Give one idea fully explained',
      solution: "1. The 'H' drawn as a shopping bag links the word to retail activity at the market hub where young people can trade.\n2. Alternatively, it plays on 'bagging' the prize money, or it draws attention to 'HUSTLE', an informal term for doing business.\n3. One idea explained earns 2 marks.",
    },
    {
      number: '1.13',
      marks: 3,
      clues: "- Find the phrase 'entrepreneurial ambitions' in line 58 of TEXT A.\n- List what TEXT B offers young business owners.",
      approach: "- Refer to line 58 of TEXT A\n- Identify what TEXT B offers: prize money, mentorship and a chance to trade\n- Judge how strongly this helps young people pursue their ambitions",
      solution: "1. TEXT B strongly encourages young people with 'entrepreneurial ambitions' to launch their businesses with the support of the sponsor.\n2. It offers prize money, mentorship and trading opportunities, and it uses social media and short promo videos to reach young business owners like the woman in the advert.\n3. This helps 'propel' their ventures to the next level. Full marks require reference to BOTH TEXT B and line 58 of TEXT A.",
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
