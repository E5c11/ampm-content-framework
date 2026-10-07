#!/usr/bin/env node
/**
 * DBE History P1 — November 2025 — Question 3 (order 3)
 * Civil society protests 1950s-1970s: how King's non-violent approach characterised 1960s US civil protests (Sources 3A-3D).
 * Source-based question: DESIGN-HIST-01 (same real sources, fresh interpretive-angle practice questions);
 * DESIGN-HIST-02 (the 8-mark paragraph is taught via an objective synthesis item).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 * Typed blanks: numeric only, keyboard_type 'standard_math' on every fitb (KEYBOARD-04, DESIGN-HIST-03).
 *   node tools/validate-questions.js --script scripts/add-history-2025-nov-p1-q3.js --curriculum temp/curriculum-vocab-history.json
 *   node scripts/add-history-2025-nov-p1-q3.js --dry-run
 *   node scripts/add-history-2025-nov-p1-q3.js
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
  "year": 2025,
  "paper": "nov_p1",
  "order": 3,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "martin_luther_king",
    "non_violent_protest",
    "civil_rights_movement",
    "sit_ins",
    "source_reliability"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2025/nov_p1/q3/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2025/nov_p1/q3/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2025/nov_p1/q3/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2025/nov_p1/q3/memo_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2025/nov_p1/q3/memo_3.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2025/nov_p1/q3/memo_4.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2025/nov_p1/q3/memo_5.png"
  ],
  "exam_question_marks": 50,
  "supplementary_materials": [
    {
      "type": "source",
      "label": "Source 3A",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2025/nov_p1/q3/annexure_3A.png"
      ]
    },
    {
      "type": "source",
      "label": "Source 3B",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2025/nov_p1/q3/annexure_3B.png"
      ]
    },
    {
      "type": "source",
      "label": "Source 3C",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2025/nov_p1/q3/annexure_3C.png"
      ]
    },
    {
      "type": "source",
      "label": "Source 3D",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2025/nov_p1/q3/annexure_3D.png"
      ]
    }
  ]
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "The book in Source 3B was published in 1971. King was assassinated in 1968. How many years after his death was it published?",
    "metadata": [
      "Years after his death: ",
      "[ ]"
    ],
    "answer": [
      "3",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "interpretation",
    "unit": "civil_society_protests_1950s_70s",
    "topic": "king_non_violent_protest",
    "subtopic": "evidence_extraction",
    "skills": [
      "calculate_change_from_data"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2025,
    "paper": "nov_p1",
    "keyboard_type": "standard_math",
    "clues": "- Subtract the earlier year from the later one.\n- Write the number only."
  },
  {
    "name": "Question 2",
    "question": "According to Source 3A, what did King see as the heart of Gandhi's non-violence?",
    "metadata": [
      "Fear of punishment",
      "An economic boycott of British goods",
      "Love, in a spiritual form",
      "Obedience to the law at all costs",
      ""
    ],
    "answer": [
      "Love, in a spiritual form",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "interpretation",
    "unit": "civil_society_protests_1950s_70s",
    "topic": "king_non_violent_protest",
    "subtopic": "evidence_extraction",
    "skills": [
      "identify_evidence_from_a_source"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Read the first sentence of the second paragraph of Source 3A.\n- The idea is about how Gandhi treated those who oppressed him."
  },
  {
    "name": "Question 3",
    "question": "In Source 3B King describes his campaign as a way to turn the 'inchoate rage of the ghetto' into 'a constructive and creative channel'. What did he want this to achieve?",
    "metadata": [
      "To make the anger disappear without being expressed",
      "To turn people's deep anger into organised, peaceful protest",
      "To encourage the anger to be shown in riots",
      "To hand the anger over to the police to manage",
      ""
    ],
    "answer": [
      "To turn people's deep anger into organised, peaceful protest",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "interpretation",
    "unit": "civil_society_protests_1950s_70s",
    "topic": "king_non_violent_protest",
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
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Think about what a 'channel' does with water.\n- The sentence just before it says there must be an outlet for angry feelings."
  },
  {
    "name": "Question 4",
    "question": "Which of the following could limit the usefulness of Source 3B to a historian researching non-violent protest in the 1960s?",
    "metadata": [
      "It reflects only King's own point of view; the supporters of riots are not heard",
      "It is an extract chosen by the book's author, so parts of what King said may have been left out",
      "It was written by one of King's critics",
      "It was published before the 1960s protests began",
      "It says nothing about King's attitude to violence"
    ],
    "answer": [
      "It reflects only King's own point of view; the supporters of riots are not heard",
      "It is an extract chosen by the book's author, so parts of what King said may have been left out",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "civil_society_protests_1950s_70s",
    "topic": "king_non_violent_protest",
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
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Check the introduction above Source 3B for whose words these are and who published them.\n- Ask whose perspective is missing."
  },
  {
    "name": "Question 5",
    "question": "Match each person in Source 3D to what is said or reported about them.",
    "metadata": [
      "A - Malcolm X",
      "B - Martin Luther King Jr",
      "C - James Baldwin",
      "D - KB Clark",
      "1 - He said non-violence makes white people comfortable and portrays Black Americans as meek",
      "2 - He said non-violent protest touches the conscience and arouses a sense of shame in many whites",
      "3 - He wondered whether Black people could be kept within non-violence after police dogs were used in Birmingham",
      "4 - A child psychologist who provided data to support the Civil Rights Movement"
    ],
    "answer": [
      "A-1",
      "B-2",
      "C-3",
      "D-4"
    ],
    "presentation": "match",
    "type": "interpretation",
    "unit": "civil_society_protests_1950s_70s",
    "topic": "king_non_violent_protest",
    "subtopic": "source_evaluation",
    "skills": [
      "compare_source_authorship_perspective"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 5,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Four people are mentioned; two of them are in the interview and two are quoted by the interviewer.\n- The introduction above the source explains who the interviewer was."
  },
  {
    "name": "Question 6",
    "question": "Arrange these civil rights protests in the order in which they happened.",
    "metadata": [
      "The Birmingham campaign meets violent police response",
      "Students begin sit-ins at lunch counters",
      "The March on Washington is held",
      "The Montgomery bus boycott begins",
      "The Freedom Rides challenge segregated bus travel"
    ],
    "answer": [
      "The Montgomery bus boycott begins",
      "Students begin sit-ins at lunch counters",
      "The Freedom Rides challenge segregated bus travel",
      "The Birmingham campaign meets violent police response",
      "The March on Washington is held"
    ],
    "presentation": "ordering",
    "type": "interpretation",
    "unit": "civil_society_protests_1950s_70s",
    "topic": "king_non_violent_protest",
    "subtopic": "historical_chronology",
    "skills": [
      "sequence_historical_events"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 6,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Source 3D names several of these protests, but not in date order.\n- The photograph in Source 3C shows one of them in 1963."
  },
  {
    "name": "Question 7",
    "question": "Sit-ins and marches are forms of civil disobedience. What does this term mean?",
    "metadata": [
      "Using armed force to overthrow a government",
      "Refusing to take part in elections",
      "Obeying every law while asking politely for change",
      "Deliberately and peacefully refusing to obey a law considered unjust",
      ""
    ],
    "answer": [
      "Deliberately and peacefully refusing to obey a law considered unjust",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "civil_society_protests_1950s_70s",
    "topic": "king_non_violent_protest",
    "subtopic": "historical_terminology",
    "skills": [
      "define_historical_term"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 7,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- 'Civil' here means peaceful and non-military.\n- The protests tested laws that enforced segregation."
  },
  {
    "name": "Question 8",
    "question": "What can a historian safely conclude from the photograph in Source 3C alone?",
    "metadata": [
      "King personally organised this sit-in",
      "The seated students were being harassed by a crowd at a lunch counter",
      "The police protected the students",
      "The students fought back against the crowd",
      ""
    ],
    "answer": [
      "The seated students were being harassed by a crowd at a lunch counter",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "civil_society_protests_1950s_70s",
    "topic": "king_non_violent_protest",
    "subtopic": "source_evaluation",
    "skills": [
      "interpret_photograph_evidence"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 8,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- A single photograph shows one moment, not what came before or after.\n- Stay with what you can see and what the caption states."
  },
  {
    "name": "Question 9",
    "question": "Which statements about King's non-violent approach are supported by the sources?",
    "metadata": [
      "King meant putting oneself in the face of violence and responding with love (Source 3A)",
      "King believed continued rioting would strengthen the right wing (Source 3B)",
      "The students at the lunch counter did not hit back at the crowd (Source 3C)",
      "King said he would support riots if non-violent protest failed (Source 3B)",
      "Malcolm X praised non-violence for making white Americans uncomfortable (Source 3D)"
    ],
    "answer": [
      "King meant putting oneself in the face of violence and responding with love (Source 3A)",
      "King believed continued rioting would strengthen the right wing (Source 3B)",
      "The students at the lunch counter did not hit back at the crowd (Source 3C)",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "civil_society_protests_1950s_70s",
    "topic": "king_non_violent_protest",
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
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- A statement is supported only if the named source says or shows it.\n- Two options reverse what a source says."
  }
];

// ─── AI explanation (AMPM-CONTENT-AI-EXP) — one entry per REAL exam sub-question, against the memo ───

const aiExplanation = {
  sub_questions: [
  {
    "number": "3.1.1",
    "marks": 1,
    "clues": "- - The person is named in the second sentence of Source 3A.",
    "approach": "- - Read the sentence about King studying a life and works.\n- - Copy the name.",
    "solution": "1. '… Mahatma Gandhi …'"
  },
  {
    "number": "3.1.2",
    "marks": 2,
    "clues": "- - The sermon is described in the first paragraph; two things are mentioned.\n- - Two short quotations.",
    "approach": "- - Find the sentence about the president of Howard University.\n- - Select two points about Gandhi.",
    "solution": "1. '… the teachings and actions of Gandhi …'\n2. '… his use of non-violent mass protest …'"
  },
  {
    "number": "3.1.3",
    "marks": 2,
    "clues": "- - Break the term into 'mass' and 'non-violent protest'.\n- - Use your own words.",
    "approach": "- - Explain what the gathering is, and the methods it uses.",
    "solution": "1. A gathering of a large group of people to defy unfair laws through peaceful methods of civil disobedience."
  },
  {
    "number": "3.1.4",
    "marks": 4,
    "clues": "- - King says non-violence was 'aggressive' in its own way.\n- - Two developed points about facing violence without retaliation.",
    "approach": "- - Unpack what putting oneself in the face of violence means.\n- - Link it to the effect on white power and the protesters' courage.",
    "solution": "1. Protesters had to face violence head-on without fighting back.\n2. By not retaliating against police or white mobs, protesters challenged white power.\n3. They had to be brave, showing the Black community was not afraid to insist on its rights.\n4. Any two of these, explained, earn the 4 marks."
  },
  {
    "number": "3.1.5",
    "marks": 1,
    "clues": "- - Read the last paragraph of Source 3A.\n- - One short quotation.",
    "approach": "- - Find what King wanted from organising thousands in mass actions.",
    "solution": "1. '… force face-to-face encounters with white, racist power'\n2. '… would demonstrate both the impotence (weakness) of white violence …'\n3. '… show the country that the black community was not afraid to insist on its rights …'\n4. Any one earns the 1 mark."
  },
  {
    "number": "3.2.1",
    "marks": 2,
    "clues": "- - King lists the feelings that made a choice necessary.\n- - Two short quotations.",
    "approach": "- - Read the first paragraph.\n- - Pick two reasons.",
    "solution": "1. 'The discontent (unhappiness) is so deep …'\n2. '… the anger so ingrained (deep-rooted) …'\n3. '… the despair, the restlessness so wide …'\n4. '… something has to be brought into being to serve as a channel …'\n5. Any two earn the 2 marks."
  },
  {
    "number": "3.2.2",
    "marks": 4,
    "clues": "- - Think about who would gain if protesters turned to riots.\n- - Two developed implications.",
    "approach": "- - Identify 'right wing' in 1960s America.\n- - Explain how rioting would help them.",
    "solution": "1. Riots would give conservative state troops a reason to be more aggressive.\n2. Riots would encourage the far-right movement, such as the Ku Klux Klan, to become more violent and hardened.\n3. If protesters did not remain non-violent, right-wing leaders would gain a bigger following.\n4. Any two of these, explained, earn the 4 marks."
  },
  {
    "number": "3.2.3",
    "marks": 2,
    "clues": "- - The third paragraph of Source 3B is where King states his commitment.\n- - Two quoted statements.",
    "approach": "- - Read the last paragraph.\n- - Select two statements of commitment.",
    "solution": "1. 'I'm just not going to kill anybody …'\n2. 'I'm not going to burn down any building'\n3. '… I will continue to preach it and teach it …'\n4. 'I will be faithful to non-violence'\n5. Any two earn the 2 marks."
  },
  {
    "number": "3.2.4",
    "marks": 2,
    "clues": "- - 'Racial justice' joins two ideas: race and fair treatment.\n- - Set it in the 1960s USA.",
    "approach": "- - Explain what was being demanded and from whom.",
    "solution": "1. A call for respect for all races in the USA in the 1960s, because of existing racial discrimination.\n2. A demand for justice for all races in the USA in the 1960s.\n3. Any one earns the 2 marks."
  },
  {
    "number": "3.2.5",
    "marks": 4,
    "clues": "- - Use the introduction: whose words, which book, when published.\n- - Two developed reasons why it is useful.",
    "approach": "- - Highlight that it is King's own words.\n- - Note what the book is about and when it appeared.",
    "solution": "1. It is based on King's actual words, first-hand evidence of his commitment to non-violence.\n2. The book was published in 1971, a few years after his assassination in 1968.\n3. It is from a book on King's political philosophy of non-violence.\n4. It gives insight into his personal beliefs and strategies for non-violent protest.\n5. Any two of these, explained, earn the 4 marks."
  },
  {
    "number": "3.3.1(a)",
    "marks": 2,
    "clues": "- - Think about what the students at the counter were trying to end.",
    "approach": "- - Describe the students' purpose at the lunch counter.",
    "solution": "1. They wanted the desegregation and integration of lunch counters.\n2. They demanded equal rights and wanted to expose racism and discrimination.\n3. Any one earns the 2 marks."
  },
  {
    "number": "3.3.1(b)",
    "marks": 2,
    "clues": "- - Look at the crowd behind the seated students; what did they want to keep as it was?",
    "approach": "- - Describe the white group's purpose.",
    "solution": "1. They wanted to continue the segregation of lunch counters.\n2. They aimed to terrorise and intimidate African Americans to maintain discrimination.\n3. Any one earns the 2 marks."
  },
  {
    "number": "3.3.2",
    "marks": 2,
    "clues": "- - Think about King's approach and how the students had prepared.\n- - One developed reason.",
    "approach": "- - Link the students' behaviour to non-violence.",
    "solution": "1. They were following King's non-violent approach, and did not want to undermine their moral cause.\n2. They had been trained to remain non-violent and not retaliate.\n3. Any one earns the 2 marks."
  },
  {
    "number": "3.4",
    "marks": 4,
    "clues": "- - Pair a detail in Source 3A with a detail in Source 3C, point for point.\n- - Two pairings, each explained.",
    "approach": "- - Take a claim about non-violence from Source 3A.\n- - Find the same idea in the photograph.\n- - Repeat for a second pairing.",
    "solution": "1. Source 3A says King saw the possibility of applying non-violence to African Americans' quest for desegregation; Source 3C shows sit-in participants applying it at a lunch counter in Jackson, Mississippi.\n2. Source 3A says protesters put themselves in the face of violence; Source 3C shows them doing exactly that.\n3. Source 3A says African Americans insisted on their rights; Source 3C shows students demanding desegregation non-violently.\n4. Both sources show non-violence as a strategy against discrimination.\n5. Any two of these, explained, earn the 4 marks."
  },
  {
    "number": "3.5.1",
    "marks": 2,
    "clues": "- - Malcolm X's criticisms are reported by the interviewer, in the first paragraph.\n- - Two short quotations.",
    "approach": "- - Read Clark's first question.\n- - Select two criticisms.",
    "solution": "1. '… this is deliberately your philosophy of love of the oppressor …'\n2. '… this philosophy and this movement are actually encouraged by whites because it makes them comfortable'\n3. 'It makes them believe that Negroes are meek (submissive), supine (passive) creatures'\n4. Any two earn the 2 marks."
  },
  {
    "number": "3.5.2",
    "marks": 2,
    "clues": "- - King lists protests in his reply.\n- - Two single-word or short quotations.",
    "approach": "- - Read King's first answer.\n- - Select two named protests.",
    "solution": "1. '… Montgomery …'\n2. '… freedom rides …'\n3. '… sit-in movement …'\n4. '… Birmingham movement …'\n5. Any two earn the 2 marks."
  },
  {
    "number": "3.5.3",
    "marks": 4,
    "clues": "- - Think about what the police did in Birmingham and how people might respond to it.\n- - Two developed implications.",
    "approach": "- - Unpack Baldwin's doubt about containing people within non-violence.\n- - Link it to police brutality and the limits of patience.",
    "solution": "1. Black Americans might not be able to remain non-violent because of intimidation by the police.\n2. The violence of state troopers could force protesters to hit back.\n3. Non-violence was not sustainable given the nature of police brutality against protesters.\n4. Any two of these, explained, earn the 4 marks."
  },
  {
    "number": "3.6",
    "marks": 8,
    "clues": "- - Use all four sources plus own knowledge about integration and image.\n- - Write one organised paragraph.",
    "approach": "- - Start with Gandhi's influence (Source 3A).\n- - Move to King's commitment and why he rejected riots (Source 3B).\n- - Use the sit-in and the interview (Sources 3C and 3D).",
    "solution": "1. King was exposed to ideas of passive resistance at Morehouse College and was influenced by Gandhi (Source 3A).\n2. He wanted protesters to face violence without retaliating, responding with love, and to insist on their rights (Source 3A).\n3. Non-violence served as an outlet for anger, while riots would strengthen the right wing (Source 3B).\n4. King and the SCLC were fully committed to non-violence in all protests (Source 3B).\n5. The sit-in participants in Jackson were not provoked into retaliating (Source 3C).\n6. King believed most African Americans would show self-control (Source 3D).\n7. He wanted integration, to show blacks and whites could coexist (own knowledge).\n8. He wanted to keep the image of African Americans free of blemish (own knowledge).\n9. Marks are awarded holistically on a three-level rubric (0–2, 3–5, 6–8)."
  }
],
  model: 'claude-sonnet-5-5',
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
