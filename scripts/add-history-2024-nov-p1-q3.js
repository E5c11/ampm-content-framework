#!/usr/bin/env node
/**
 * DBE History P1 — November 2024 — Question 3 (order 3)
 * Civil society protests, the US Civil Rights Movement: why the March on Washington was organised, 1963 (Sources 3A-3D).
 * Source-based question: DESIGN-HIST-01 (same real sources, fresh interpretive-angle practice questions);
 * DESIGN-HIST-02 (the 8-mark paragraph is taught via an objective synthesis item).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 * Typed blanks: numeric only, keyboard_type 'standard_math' on every fitb (KEYBOARD-04, DESIGN-HIST-03).
 *   node tools/validate-questions.js --script scripts/add-history-2024-nov-p1-q3.js --curriculum temp/curriculum-vocab-history-2024.json
 *   node scripts/add-history-2024-nov-p1-q3.js --dry-run
 *   node scripts/add-history-2024-nov-p1-q3.js
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
  "name": "Question 3",
  "syllabus": "dbe",
  "subject": "history",
  "year": 2024,
  "paper": "nov_p1",
  "order": 3,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "march_on_washington",
    "civil_rights_movement",
    "martin_luther_king",
    "source_reliability"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2024/nov_p1/q3/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2024/nov_p1/q3/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2024/nov_p1/q3/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2024/nov_p1/q3/memo_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2024/nov_p1/q3/memo_3.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2024/nov_p1/q3/memo_4.png"
  ],
  "exam_question_marks": 50,
  "supplementary_materials": [
    {
      "type": "source",
      "label": "Source 3A",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2024/nov_p1/q3/annexure_3A.png"
      ]
    },
    {
      "type": "source",
      "label": "Source 3B",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2024/nov_p1/q3/annexure_3B.png"
      ]
    },
    {
      "type": "source",
      "label": "Source 3C",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2024/nov_p1/q3/annexure_3C.png"
      ]
    },
    {
      "type": "source",
      "label": "Source 3D",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2024/nov_p1/q3/annexure_3D.png"
      ]
    }
  ]
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Source 3B says 50 000 of the 250 000 marchers were white. What percentage of the marchers was white?",
    "metadata": [
      "White marchers (%): ",
      "[ ]"
    ],
    "answer": [
      "20",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "application",
    "unit": "civil_society_protests_1950s_70s",
    "topic": "march_on_washington_1963",
    "subtopic": "evidence_extraction",
    "skills": [
      "calculate_from_source_data"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2024,
    "paper": "nov_p1",
    "keyboard_type": "standard_math",
    "clues": "- Divide the number of white marchers by the total, then multiply by 100.\n- Write the number only, without the % sign."
  },
  {
    "name": "Question 2",
    "question": "Source 3B says King received the Nobel Peace Prize 'the following year'. In which year was that?",
    "metadata": [
      "Year: ",
      "[ ]"
    ],
    "answer": [
      "1964",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "interpretation",
    "unit": "civil_society_protests_1950s_70s",
    "topic": "march_on_washington_1963",
    "subtopic": "evidence_extraction",
    "skills": [
      "extract_numeric_evidence_from_source"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2024,
    "paper": "nov_p1",
    "keyboard_type": "standard_math",
    "clues": "- Start from the date of the March on Washington.\n- Write the four digits only."
  },
  {
    "name": "Question 3",
    "question": "Source 3A says the March 'will be non-violent, but not timid'. What does this pairing tell marchers?",
    "metadata": [
      "To defend themselves with force if the police or onlookers attacked them",
      "To stay quiet and avoid making any demands that might cause offence",
      "To reject violence while still standing firm and confident in their demands",
      "To leave the March at once if they felt afraid of the crowds or the police",
      ""
    ],
    "answer": [
      "To reject violence while still standing firm and confident in their demands",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "interpretation",
    "unit": "civil_society_protests_1950s_70s",
    "topic": "march_on_washington_1963",
    "subtopic": "evidence_extraction",
    "skills": [
      "identify_evidence_from_a_source"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Each sentence in the first paragraph pairs a quality with its extreme.\n- 'Timid' is explained in brackets in the source."
  },
  {
    "name": "Question 4",
    "question": "Which features of Source 3D limit its usefulness to a historian studying the aims of the marchers?",
    "metadata": [
      "It is an official White House statement, so it presents the government in a good light",
      "It was released on the day of the March, so it cannot show whether its promises were kept",
      "It gives the government's view, not the marchers' own words about what they wanted",
      "It was written by the organisers of the March to persuade more people to join them",
      "It was published many years later, when memories of the March had already faded"
    ],
    "answer": [
      "It is an official White House statement, so it presents the government in a good light",
      "It was released on the day of the March, so it cannot show whether its promises were kept",
      "It gives the government's view, not the marchers' own words about what they wanted",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "civil_society_protests_1950s_70s",
    "topic": "march_on_washington_1963",
    "subtopic": "source_evaluation",
    "skills": [
      "evaluate_source_reliability"
    ],
    "difficulty": 4,
    "exam_weight": 3,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Look at who issued Source 3D and when.\n- Ask whose voices are missing from it."
  },
  {
    "name": "Question 5",
    "question": "Source 3A called on marchers to be disciplined. Which phrase in Source 3D shows how the marchers actually behaved?",
    "metadata": [
      "'… the need to move forward in achieving these objectives …'",
      "'… continue its efforts to obtain increased employment …'",
      "'… amendments to the vocational education program …'",
      "'… the deep fervour (passion) and the quiet dignity …'",
      ""
    ],
    "answer": [
      "'… the deep fervour (passion) and the quiet dignity …'",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "civil_society_protests_1950s_70s",
    "topic": "march_on_washington_1963",
    "subtopic": "source_evaluation",
    "skills": [
      "corroborate_evidence_across_sources"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 5,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Look for words in Source 3D that describe the people who gathered.\n- Discipline means self-control and good order."
  },
  {
    "name": "Question 6",
    "question": "Match each placard in Source 3C to what it was demanding.",
    "metadata": [
      "A - NO US DOUGH TO HELP JIM CROW GROW",
      "B - WE DEMAND VOTING RIGHTS NOW!",
      "C - WE MARCH FOR INTEGRATED SCHOOLS NOW!",
      "D - WE DEMAND AN END TO POLICE BRUTALITY NOW!",
      "1 - Black and white children should be taught together",
      "2 - Federal money should not pay for racial segregation",
      "3 - Police violence against Black Americans must stop",
      "4 - Black citizens must be free to register and vote"
    ],
    "answer": [
      "A-2",
      "B-4",
      "C-1",
      "D-3"
    ],
    "presentation": "match",
    "type": "interpretation",
    "unit": "civil_society_protests_1950s_70s",
    "topic": "march_on_washington_1963",
    "subtopic": "evidence_extraction",
    "skills": [
      "interpret_photograph_evidence"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 6,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Use the key below the photograph: 'US' means the USA and 'dough' means money.\n- Jim Crow was the name for segregation laws in the South."
  },
  {
    "name": "Question 7",
    "question": "Arrange these events of the Civil Rights Movement in the order in which they happened.",
    "metadata": [
      "The March on Washington for Jobs and Freedom",
      "The Voting Rights Act is passed",
      "The Montgomery Bus Boycott begins",
      "The Civil Rights Act is signed into law",
      "Students begin sit-ins at a lunch counter in Greensboro"
    ],
    "answer": [
      "The Montgomery Bus Boycott begins",
      "Students begin sit-ins at a lunch counter in Greensboro",
      "The March on Washington for Jobs and Freedom",
      "The Civil Rights Act is signed into law",
      "The Voting Rights Act is passed"
    ],
    "presentation": "ordering",
    "type": "interpretation",
    "unit": "civil_society_protests_1950s_70s",
    "topic": "march_on_washington_1963",
    "subtopic": "historical_chronology",
    "skills": [
      "sequence_historical_events"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 7,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Source 3D mentions the Civil Rights Bill as still before Congress in August 1963.\n- The boycott began in the 1950s; the sit-ins began in 1960."
  },
  {
    "name": "Question 8",
    "question": "According to Source 3B, why did King put aside his prepared speech?",
    "metadata": [
      "The organisers had banned his written speech the night before the March",
      "Mahalia Jackson called on him from the stage to tell them about his dream",
      "He had left his written speech behind before reaching the Lincoln Memorial",
      "Joan Baez had already read most of his prepared speech aloud to the crowd",
      ""
    ],
    "answer": [
      "Mahalia Jackson called on him from the stage to tell them about his dream",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "interpretation",
    "unit": "civil_society_protests_1950s_70s",
    "topic": "march_on_washington_1963",
    "subtopic": "evidence_extraction",
    "skills": [
      "identify_evidence_from_a_source"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 8,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Read the second paragraph of Source 3B.\n- Look for the words 'At the urging of'."
  },
  {
    "name": "Question 9",
    "question": "Which claims about why the March on Washington was organised are supported by the sources?",
    "metadata": [
      "Marchers demanded jobs and freedom, and full civil rights for black Americans (Source 3B)",
      "Marchers called for voting rights and integrated schools (Source 3C)",
      "The March pressed for more jobs and an end to job discrimination (Source 3D)",
      "Organisers called on marchers to arm themselves against police attacks (Source 3A)",
      "The March celebrated a Civil Rights Act that Congress had already passed (Source 3D)"
    ],
    "answer": [
      "Marchers demanded jobs and freedom, and full civil rights for black Americans (Source 3B)",
      "Marchers called for voting rights and integrated schools (Source 3C)",
      "The March pressed for more jobs and an end to job discrimination (Source 3D)",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "civil_society_protests_1950s_70s",
    "topic": "march_on_washington_1963",
    "subtopic": "historical_causation",
    "skills": [
      "corroborate_evidence_across_sources"
    ],
    "difficulty": 4,
    "exam_weight": 3,
    "xp": 10,
    "order": 9,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Check each claim against the source named in brackets.\n- Source 3D says which goals were still being worked on."
  }
];

// ─── AI explanation (AMPM-CONTENT-AI-EXP) — one entry per REAL exam sub-question, against the memo ───

const aiExplanation = {
  sub_questions: [
  {
    "number": "3.1.1",
    "marks": 1,
    "clues": "- Read the first two sentences of Source 3A.\n- Quote the phrase that explains 'more than'.",
    "approach": "- Find what the March is called besides a demonstration.\n- Copy the sentence.",
    "solution": "1. 'It is a living petition in the flesh of the scores of thousands of citizens of both races who will be present from all parts of our country'"
  },
  {
    "number": "3.1.2",
    "marks": 2,
    "clues": "- The first paragraph lists qualities the March will have.\n- Two short quotes.",
    "approach": "- Pick two qualities or instructions from Source 3A.\n- Copy each exactly.",
    "solution": "1. '… orderly …'\n2. '… non-violent …'\n3. '… unified in purposes and behaviour …'\n4. '… to resist provocations (incitements) to disorder and to violence'\n5. '… to place the cause above all else'\n6. Any two earn 1 mark each."
  },
  {
    "number": "3.1.3",
    "marks": 2,
    "clues": "- Who opposed equality for African Americans in 1963?\n- Think of organised groups.",
    "approach": "- Name the group meant.\n- Link it to the wish to discredit the March.",
    "solution": "1. The Ku Klux Klan, white supremacists or segregationists.\n2. Or: conservatives or the right wing."
  },
  {
    "number": "3.1.4",
    "marks": 4,
    "clues": "- What does 'place the cause above all else' ask of each marcher?\n- Two developed points.",
    "approach": "- Explain what the organisers wanted marchers to prioritise.\n- Explain why unity mattered.",
    "solution": "1. To fully support the objectives of the Civil Rights Movement.\n2. To avoid putting individual needs above those of the movement: unity.\n3. To stop segregation and discrimination in the USA.\n4. Two, explained, earn the 4 marks."
  },
  {
    "number": "3.2.1",
    "marks": 2,
    "clues": "- Rights everyone should have as a citizen.\n- Use your own words.",
    "approach": "- Define civil rights.\n- Mention equality before the law.",
    "solution": "1. Basic rights that every citizen is entitled to enjoy, such as equality before the law and the vote."
  },
  {
    "number": "3.2.2",
    "marks": 2,
    "clues": "- Read the first paragraph of Source 3B.\n- What was the cry of the marchers?",
    "approach": "- Find the demand at the Lincoln Memorial.\n- Quote it.",
    "solution": "1. '… full civil rights for blacks'\n2. Or: 'Jobs and freedom …'"
  },
  {
    "number": "3.2.3",
    "marks": 4,
    "clues": "- Labour leaders, clergy and singers all spoke.\n- What did their variety show?",
    "approach": "- Explain what the range of speakers signalled.\n- Give two developed points.",
    "solution": "1. It showed the March had support from many spheres of life.\n2. It showed the movement was inclusive of all races.\n3. It appealed for more support for the movement.\n4. Any two, explained, earn the 4 marks."
  },
  {
    "number": "3.2.4",
    "marks": 4,
    "clues": "- Think about the speech's audience and its effects.\n- Two developed points.",
    "approach": "- Explain the speech's impact at the time.\n- Explain its lasting significance.",
    "solution": "1. It gave hope to African Americans and remains central to the movement.\n2. It made King famous and contributed to his Nobel Peace Prize.\n3. It reminded Americans that all were equal under the Constitution.\n4. It was televised widely and helped lead to the Civil Rights Act of 1964.\n5. Any two, explained, earn the 4 marks."
  },
  {
    "number": "3.3.1",
    "marks": 2,
    "clues": "- Read the placards in Source 3C.\n- Two demands.",
    "approach": "- Choose two placards.\n- Quote each demand.",
    "solution": "1. 'We demand an end to police brutality now'\n2. 'We march for jobs for all now'\n3. 'We march for integrated schools now'\n4. 'We demand voting rights now'\n5. Any two earn 1 mark each."
  },
  {
    "number": "3.3.2",
    "marks": 4,
    "clues": "- Look at who is marching and what they carry.\n- Two developed reasons.",
    "approach": "- Explain what the photograph records.\n- Explain the message it sends.",
    "solution": "1. To show the demands African Americans made for their civil rights.\n2. To show the March was peaceful and attended by men and women, black and white.\n3. To show the large numbers and their determination to achieve equal rights.\n4. Any two, explained, earn the 4 marks."
  },
  {
    "number": "3.4",
    "marks": 4,
    "clues": "- Find a detail in Source 3B and the matching one in Source 3C.\n- Two pairs, each explained.",
    "approach": "- Compare the size of the crowd.\n- Compare the demands made.",
    "solution": "1. Source 3B mentions 250 000 marchers, and Source 3C shows a large crowd.\n2. Source 3B says marchers demanded civil rights, jobs and freedom, and Source 3C shows placards with those demands.\n3. Both sources show that the March was peaceful.\n4. Any two, explained, earn the 4 marks."
  },
  {
    "number": "3.5.1",
    "marks": 2,
    "clues": "- Look at how Kennedy describes the marchers.\n- Two quotes.",
    "approach": "- Find phrases showing approval.\n- Copy two.",
    "solution": "1. '… exercising their right to assemble peaceably …'\n2. '… direct the widest possible attention to a great national issue …'\n3. '… deserve our appreciation for the detailed preparations …'\n4. Any two earn 1 mark each."
  },
  {
    "number": "3.5.2",
    "marks": 2,
    "clues": "- Find the sentence with 'deserve our appreciation'.\n- Two reasons follow it.",
    "approach": "- Read the end of the second paragraph.\n- Copy both reasons.",
    "solution": "1. '… for the detailed preparations that made it possible …'\n2. '… for the orderly manner in which it has been conducted …'"
  },
  {
    "number": "3.5.3",
    "marks": 2,
    "clues": "- Think about unequal treatment because of race.\n- Link it to the 1960s USA.",
    "approach": "- Define discrimination.\n- Give a Civil Rights Movement context.",
    "solution": "1. Unequal treatment of African Americans based on race, which the movement protested against.\n2. Or: separation of races based on skin colour, rejected by the movement."
  },
  {
    "number": "3.5.4",
    "marks": 1,
    "clues": "- Read the last paragraph of Source 3D.\n- Quote one law or programme.",
    "approach": "- Find the list of proposals before Congress.\n- Copy one.",
    "solution": "1. '… the Civil Rights Bill …', '… the Youth Employment Bill …' or the Manpower Development and Training Program."
  },
  {
    "number": "3.5.5",
    "marks": 4,
    "clues": "- Who issued the statement, and when?\n- Two developed reasons.",
    "approach": "- Use the provenance to explain usefulness.\n- Use the content to explain usefulness.",
    "solution": "1. It was released on the day of the March and published the next day.\n2. It came from the White House Press Secretary's office, a statement by President Kennedy.\n3. It shows how the President appreciated the way the March unfolded.\n4. Any two, explained, earn the 4 marks."
  },
  {
    "number": "3.6",
    "marks": 8,
    "clues": "- Use evidence from each source, plus own knowledge.\n- Focus on why, not only on what happened.",
    "approach": "- Open with the aims: jobs and freedom (Sources 3A, 3B).\n- Add the specific demands (Source 3C).\n- Show pressure on the government (Source 3D, own knowledge).\n- Close with a linking sentence.",
    "solution": "1. The March was organised for jobs and freedom, as a living petition (Sources 3A, 3B).\n2. It expressed the hopes and prayers of millions (Source 3A).\n3. About 250 000 people demanded full civil rights at the Lincoln Memorial (Source 3B).\n4. Placards demanded voting rights, integrated schools, jobs and an end to police brutality (Source 3C).\n5. It aimed to increase employment and end job discrimination (Source 3D).\n6. Own knowledge: to pressure Congress to pass the Civil Rights Bill and end segregation.\n7. Marks are awarded holistically on a three-level rubric (0–2, 3–5, 6–8)."
  }
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

  // Exam gate (VER-02/VER-04/VER-09): derived from the rows now in the database; no-op at the floor.
  if (!DRY_RUN && ENV === 'dev') {
    const { applyExamGates } = require('../tools/lib/exam-gate');
    await applyExamGates(pool, { env: ENV, apply: true, filter: { subject: video.subject, syllabus: video.syllabus, year: String(video.year) } });
  } else if (DRY_RUN) {
    console.log('   (dry-run: the exam gate is derived and written after a real upload)');
  }
}

if (require.main === module) {
  upload()
    .catch((err) => {
      console.error('\n❌ Upload failed:', err.message);
      process.exitCode = 1;
    })
    .finally(closePool);
}
