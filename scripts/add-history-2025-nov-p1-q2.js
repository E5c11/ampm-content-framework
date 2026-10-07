#!/usr/bin/env node
/**
 * DBE History P1 — November 2025 — Question 2 (order 2)
 * Independent Africa: why the USA became involved in the Angolan Civil War from 1975 (Sources 2A-2D).
 * Source-based question: DESIGN-HIST-01 (same real sources, fresh interpretive-angle practice questions);
 * DESIGN-HIST-02 (the 8-mark paragraph is taught via an objective synthesis item).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 * Typed blanks: numeric only, keyboard_type 'standard_math' on every fitb (KEYBOARD-04, DESIGN-HIST-03).
 *   node tools/validate-questions.js --script scripts/add-history-2025-nov-p1-q2.js --curriculum temp/curriculum-vocab-history.json
 *   node scripts/add-history-2025-nov-p1-q2.js --dry-run
 *   node scripts/add-history-2025-nov-p1-q2.js
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
  "name": "Question 2",
  "syllabus": "dbe",
  "subject": "history",
  "year": 2025,
  "paper": "nov_p1",
  "order": 2,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "angola_civil_war",
    "cia_covert_action",
    "proxy_war",
    "kissinger_foreign_policy",
    "source_reliability"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2025/nov_p1/q2/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2025/nov_p1/q2/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2025/nov_p1/q2/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2025/nov_p1/q2/memo_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2025/nov_p1/q2/memo_3.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2025/nov_p1/q2/memo_4.png"
  ],
  "exam_question_marks": 50,
  "supplementary_materials": [
    {
      "type": "source",
      "label": "Source 2A",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2025/nov_p1/q2/annexure_2A.png"
      ]
    },
    {
      "type": "source",
      "label": "Source 2B",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2025/nov_p1/q2/annexure_2B.png"
      ]
    },
    {
      "type": "source",
      "label": "Source 2C",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2025/nov_p1/q2/annexure_2C.png"
      ]
    },
    {
      "type": "source",
      "label": "Source 2D",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2025/nov_p1/q2/annexure_2D.png"
      ]
    }
  ]
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "According to Source 2A, by the fall of 1975 the CIA had provided over [] million dollars in covert support to the FNLA and UNITA.",
    "metadata": [
      "Covert support: ",
      "[ ]",
      " million dollars"
    ],
    "answer": [
      "22",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "interpretation",
    "unit": "independent_africa",
    "topic": "us_involvement_angola",
    "subtopic": "evidence_extraction",
    "skills": [
      "extract_numeric_evidence_from_source"
    ],
    "difficulty": 1,
    "exam_weight": 1,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2025,
    "paper": "nov_p1",
    "keyboard_type": "standard_math",
    "clues": "- The figure appears in the first paragraph of Source 2A.\n- Write the number only."
  },
  {
    "name": "Question 2",
    "question": "CIA Director Colby asked the National Security Council for $100 million, but only $41.7 million was authorised. By how many million dollars was the authorised sum short of his request?",
    "metadata": [
      "Shortfall: ",
      "[ ]",
      " million dollars"
    ],
    "answer": [
      "58.3",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "interpretation",
    "unit": "independent_africa",
    "topic": "us_involvement_angola",
    "subtopic": "evidence_extraction",
    "skills": [
      "calculate_change_from_data"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2025,
    "paper": "nov_p1",
    "keyboard_type": "standard_math",
    "clues": "- Both amounts are in the second paragraph of Source 2B.\n- Subtract the smaller amount from the larger and use a full stop as the decimal point."
  },
  {
    "name": "Question 3",
    "question": "According to Source 2A, why was the covert operation IAFEATURE kept top secret?",
    "metadata": [
      "Because the Soviet Union had asked the USA to keep it secret",
      "Because the FNLA and UNITA had demanded secrecy as a condition of aid",
      "Because it broke a treaty the USA had signed with Portugal",
      "So that it did not have to be explained to the public after the recent failure in Vietnam",
      ""
    ],
    "answer": [
      "So that it did not have to be explained to the public after the recent failure in Vietnam",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "interpretation",
    "unit": "independent_africa",
    "topic": "us_involvement_angola",
    "subtopic": "evidence_extraction",
    "skills": [
      "identify_evidence_from_a_source"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Read the sentence about the paramilitary programme in the second paragraph.\n- The reason is linked to public opinion at home, not to any foreign party."
  },
  {
    "name": "Question 4",
    "question": "Source 2C is an interview with Hultslander, the last CIA Station Chief in Luanda. Why is it useful to a historian studying US involvement in Angola?",
    "metadata": [
      "He was a Soviet official who watched the programme from outside",
      "He was a CIA insider who speaks from experience of the programme",
      "It was written in 1975 while the programme was still being planned",
      "It was produced by the MPLA to criticise the USA",
      ""
    ],
    "answer": [
      "He was a CIA insider who speaks from experience of the programme",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "independent_africa",
    "topic": "us_involvement_angola",
    "subtopic": "source_evaluation",
    "skills": [
      "evaluate_source_reliability"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Look at the introduction printed above Source 2C for his job and whose side he worked for.\n- Think about the difference between inside knowledge and an outsider's account."
  },
  {
    "name": "Question 5",
    "question": "Match each statement or image to the source it comes from.",
    "metadata": [
      "A - The CIA's task was not to win but to prevent an easy victory for the Soviet-backed forces",
      "B - Kissinger wanted to prove that the USA was still the global power after Vietnam",
      "C - Our support of Roberto and Savimbi would prove disastrous",
      "D - A figure in a star-spangled suit promises to help end the conflict while one movement holds a box of weapons",
      "1 - Source 2B",
      "2 - Source 2A",
      "3 - Source 2C",
      "4 - Source 2D"
    ],
    "answer": [
      "A-1",
      "B-2",
      "C-3",
      "D-4"
    ],
    "presentation": "match",
    "type": "interpretation",
    "unit": "independent_africa",
    "topic": "us_involvement_angola",
    "subtopic": "source_evaluation",
    "skills": [
      "identify_evidence_from_a_source"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 5,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Use the introductions: one source is a cartoon, one is an interview, and two are book extracts about different people.\n- Think about who would speak of 'our support' in the first person."
  },
  {
    "name": "Question 6",
    "question": "Arrange these events from Source 2B in the order in which they happened.",
    "metadata": [
      "Mobutu expels the US ambassador",
      "World copper prices plunge in early 1975",
      "The US State Department decides to strengthen its support for the FNLA to win back Mobutu's favour",
      "Mobutu accuses the USA of backing a coup to topple him"
    ],
    "answer": [
      "World copper prices plunge in early 1975",
      "Mobutu accuses the USA of backing a coup to topple him",
      "Mobutu expels the US ambassador",
      "The US State Department decides to strengthen its support for the FNLA to win back Mobutu's favour"
    ],
    "presentation": "ordering",
    "type": "interpretation",
    "unit": "independent_africa",
    "topic": "us_involvement_angola",
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
    "clues": "- The extract tells the story roughly in the order it happened.\n- Mobutu's anger came first, then his actions, then the US response."
  },
  {
    "name": "Question 7",
    "question": "Which Cold War term describes a conflict in which two powers back opposing sides, supplying money and weapons, without fighting each other directly?",
    "metadata": [
      "Appeasement",
      "Civil disobedience",
      "Proxy war",
      "Brinkmanship",
      ""
    ],
    "answer": [
      "Proxy war",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "independent_africa",
    "topic": "us_involvement_angola",
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
    "clues": "- Ask who does the fighting and who supplies the support from a distance.\n- The Angolan Civil War is a standard example in the CAPS case study."
  },
  {
    "name": "Question 8",
    "question": "Source 2D was drawn by a Portuguese cartoonist in 1993. Which are valid reasons for a historian to treat it with caution?",
    "metadata": [
      "It was drawn long after the events of 1975, with hindsight",
      "A cartoon gives the artist's opinion and exaggerates, rather than giving a neutral record",
      "It was drawn by Henry Kissinger himself",
      "It was published before the civil war began",
      "It contains no information about the USA"
    ],
    "answer": [
      "It was drawn long after the events of 1975, with hindsight",
      "A cartoon gives the artist's opinion and exaggerates, rather than giving a neutral record",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "independent_africa",
    "topic": "us_involvement_angola",
    "subtopic": "source_evaluation",
    "skills": [
      "evaluate_source_reliability"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 8,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Compare the date printed in the introduction with the date of the events shown.\n- Think about what a caricature is designed to do."
  },
  {
    "name": "Question 9",
    "question": "Which reasons for the USA's involvement in the Angolan Civil War from 1975 are supported by the sources?",
    "metadata": [
      "To stop the MPLA from gaining control of Angola (Source 2A)",
      "To regain prestige lost in Vietnam and show it was still a global power (Source 2A)",
      "To prevent Soviet influence from spreading in the region (Source 2B)",
      "To support the MPLA's socialist programme (Source 2C)",
      "To carry out a United Nations order to govern Angola (Source 2D)"
    ],
    "answer": [
      "To stop the MPLA from gaining control of Angola (Source 2A)",
      "To regain prestige lost in Vietnam and show it was still a global power (Source 2A)",
      "To prevent Soviet influence from spreading in the region (Source 2B)",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "independent_africa",
    "topic": "us_involvement_angola",
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
    "clues": "- Each valid reason can be traced to a named source.\n- Watch for options that reverse which side the USA was on."
  }
];

// ─── AI explanation (AMPM-CONTENT-AI-EXP) — one entry per REAL exam sub-question, against the memo ───

const aiExplanation = {
  sub_questions: [
  {
    "number": "2.1.1",
    "marks": 1,
    "clues": "- - The country is named in the first sentence of Source 2A.",
    "approach": "- - Re-read the first sentence.\n- - Copy the country's name.",
    "solution": "1. Source 2A states that the United States of America (USA) did not want the MPLA to gain control of Angola."
  },
  {
    "number": "2.1.2",
    "marks": 3,
    "clues": "- - The provisions are the three things the CIA was to provide, listed in one sentence.\n- - Each is a single quoted word.",
    "approach": "- - Find the sentence about 'provisions for United States involvement in Africa'.\n- - Pick out the three things to be provided.",
    "solution": "1. '… material …'\n2. '… support …'\n3. '… advice …'"
  },
  {
    "number": "2.1.3",
    "marks": 4,
    "clues": "- - Use the source and your own knowledge: why would the USA not want its funding known?\n- - Think of public opinion after Vietnam and the idea of non-interference.",
    "approach": "- - Identify the secrecy of IAFEATURE in the source.\n- - Add outside knowledge about Vietnam and foreign interference.\n- - Give two developed reasons.",
    "solution": "1. The public should not know that the USA was funding UNITA and the FNLA against the MPLA.\n2. The USA did not want to be seen interfering in the internal affairs of a foreign country.\n3. It was part of the strategy of IAFEATURE, a secret CIA operation.\n4. After the embarrassment of Vietnam, the USA wanted to reassert itself.\n5. Any two of these, explained, earn the 4 marks."
  },
  {
    "number": "2.1.4",
    "marks": 4,
    "clues": "- - Think about who wrote the book and whose perspective it shows.\n- - Limitations are about what the source cannot tell you about the MPLA.",
    "approach": "- - Note the focus on Kissinger and the CIA.\n- - Identify bias for capitalism and against the MPLA.\n- - Give two developed limitations.",
    "solution": "1. The book focuses on Kissinger, the US Secretary of State, and is anti-communist and pro-capitalist.\n2. It depicts only the USA's perspective of creating stability against the destabilising MPLA, so it is biased.\n3. It promotes capitalism by backing the FNLA and UNITA.\n4. It is about secret CIA money and a paramilitary programme against the MPLA, not about the MPLA itself.\n5. It portrays the imperialist nature of US foreign policy.\n6. Any two of these, explained, earn the 4 marks."
  },
  {
    "number": "2.2.1",
    "marks": 1,
    "clues": "- - Look for the sentence about US money and Mobutu's government.\n- - Copy it exactly.",
    "approach": "- - Read the opening sentence of Source 2B.",
    "solution": "1. 'The US had poured uncounted millions of dollars into the bottomless pit of Mobutu's corrupt military dictatorship …'"
  },
  {
    "number": "2.2.2",
    "marks": 2,
    "clues": "- - The source describes what Mobutu did when the money-making copper price fell.\n- - Two short quotations.",
    "approach": "- - Read from the mention of copper prices onwards.\n- - Pick two actions.",
    "solution": "1. '… turned on his benefactors (sponsors)'\n2. '… accused the US of backing up a coup (revolution) to topple him'\n3. '… expelled the US Ambassador …'\n4. Any two of these earn the 2 marks."
  },
  {
    "number": "2.2.3",
    "marks": 1,
    "clues": "- - The reason is given as a comment on the size of the sum.",
    "approach": "- - Find the sentence about $100 million.",
    "solution": "1. '… this was too large a sum to keep secret …'"
  },
  {
    "number": "2.2.4",
    "marks": 2,
    "clues": "- - Think about what the USA wanted to stop, not what it wanted to win.\n- - 'Prevent an easy victory' suggests a limited aim.",
    "approach": "- - Interpret the sentence in the context of the Cold War.\n- - Say whom the CIA was opposed to.",
    "solution": "1. The CIA was opposed to an MPLA victory.\n2. It supported the FNLA and UNITA because they were aligned with capitalism and opposed communism.\n3. The aim was to weaken the MPLA by containing Soviet influence, so that the FNLA and UNITA would share in government.\n4. Any one of these, explained, earns the 2 marks."
  },
  {
    "number": "2.2.5",
    "marks": 2,
    "clues": "- - The term is about a people choosing their own government.\n- - Use your own words.",
    "approach": "- - Define 'self-determination' without copying the source.",
    "solution": "1. The independence of a country to establish its own government and make its own rules and laws."
  },
  {
    "number": "2.3.1",
    "marks": 2,
    "clues": "- - Hultslander gives several reasons for opposing the programme.\n- - Pick two quoted phrases.",
    "approach": "- - Read his first answer.\n- - Select two separate reasons, quoted.",
    "solution": "1. '… I was convinced it would not succeed …'\n2. '… would badly damage our ability to work in the future with moderate elements throughout Africa'\n3. 'We were not prepared to spend the necessary resources to assure victory'\n4. Other accepted quotations include '… our support of Roberto and Savimbi would prove disastrous …'; any two earn the 2 marks."
  },
  {
    "number": "2.3.2",
    "marks": 2,
    "clues": "- - 'Covert' means hidden.\n- - Say who did what, and to what end.",
    "approach": "- - Define 'covert action' as it applies to the CIA in Angola.",
    "solution": "1. A secretly planned CIA operation to support the FNLA and UNITA in order to stop the MPLA from ruling Angola."
  },
  {
    "number": "2.3.3",
    "marks": 4,
    "clues": "- - Link 'destabilising effects' to what the USA feared communism might do in the region.\n- - Two developed points.",
    "approach": "- - Explain the fear behind Kissinger's view.\n- - Connect it to the Domino Theory and capitalism in southern Africa.",
    "solution": "1. The USA was afraid of the spread of communism across southern Africa, the Domino Theory.\n2. The USA wanted the whole of southern Africa to remain under capitalism.\n3. Any two points, developed, earn the 4 marks."
  },
  {
    "number": "2.3.4",
    "marks": 2,
    "clues": "- - Look at the paragraph that begins with his all-night session.\n- - Two actions.",
    "approach": "- - Read the last paragraph of Source 2C.\n- - Select two things he did or admitted.",
    "solution": "1. 'I did my best to argue the U.S. Policy position …'\n2. '… defend the covert action programme …'\n3. '… I finally admitted that I personally thought our support of Roberto and Savimbi would prove disastrous'\n4. Any two earn the 2 marks."
  },
  {
    "number": "2.4.1",
    "marks": 4,
    "clues": "- - Think about what the cartoon shows Kissinger doing compared with what he says.\n- - Two developed reasons.",
    "approach": "- - Contrast Kissinger's promise to help end the conflict with what the USA was actually doing.\n- - Use the sources and what you know.",
    "solution": "1. The USA's involvement should be seen as trying to stop the MPLA from taking over the government.\n2. Kissinger secretly supported UNITA to prevent an MPLA takeover.\n3. He wanted capitalism to win over communism.\n4. Any two of these, explained, earn the 4 marks."
  },
  {
    "number": "2.4.2(a)",
    "marks": 2,
    "clues": "- - Look at the MPLA figure's posture and what it is asking for.",
    "approach": "- - Describe the figure's body language.\n- - Draw a conclusion about relations with the USA.",
    "solution": "1. The MPLA got no support from the USA and was ignored.\n2. It was desperate and anxious for Kissinger's support.\n3. The USA did not want the MPLA to win the war.\n4. Any one earns the 2 marks."
  },
  {
    "number": "2.4.2(b)",
    "marks": 2,
    "clues": "- - Look at what the UNITA figure holds or stands beside.",
    "approach": "- - Describe the figure and the box next to it.\n- - Draw a conclusion about relations with the USA.",
    "solution": "1. UNITA was supported and favoured by the USA.\n2. It was excited to be given a variety of weapons to use against the MPLA.\n3. Any one earns the 2 marks."
  },
  {
    "number": "2.5",
    "marks": 4,
    "clues": "- - Pair a detail from Source 2A with a detail from Source 2D, point for point.\n- - Two pairs, each explained.",
    "approach": "- - Take a claim from Source 2A about US support.\n- - Find the matching scene in the cartoon.\n- - Repeat for a second pairing.",
    "solution": "1. Source 2A says the USA did not want the MPLA to gain control, and Source 2D shows the MPLA begging Kissinger for help in vain.\n2. Source 2A says the CIA gave secret support to UNITA, and Source 2D shows UNITA with weapons from Kissinger's side.\n3. Source 2A refers to Kissinger's plan IAFEATURE against the MPLA, and Source 2D shows no intention to help the MPLA.\n4. Both sources show the covert programme was meant to fight the MPLA, and that US involvement was deceptive.\n5. Any two of these, explained, earn the 4 marks."
  },
  {
    "number": "2.6",
    "marks": 8,
    "clues": "- - Use all four sources plus own knowledge such as regional capitalism and natural resources.\n- - Write one organised paragraph.",
    "approach": "- - Start with the USA's aim to stop the MPLA (Sources 2A and 2B).\n- - Add Vietnam's lingering effect and the Soviet threat.\n- - Finish with covert support and Kissinger's claimed mediation (Sources 2C and 2D).",
    "solution": "1. The USA wanted to stop the MPLA gaining control (Sources 2A and 2B).\n2. It secretly supported the FNLA and UNITA to resist communist rule (Source 2A).\n3. It wanted to recover prestige lost in Vietnam and re-establish itself as a global power (Source 2A).\n4. It wanted to prevent Soviet influence in southern Africa, and an MPLA victory that would destabilise the region (Sources 2B and 2C).\n5. It wanted capitalism to succeed in the region and to support South Africa's interests (own knowledge).\n6. It wanted access to Angola's natural resources (own knowledge).\n7. It claimed to be a mediator while backing UNITA (Source 2D).\n8. Marks are awarded holistically on a three-level rubric (0–2, 3–5, 6–8)."
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
