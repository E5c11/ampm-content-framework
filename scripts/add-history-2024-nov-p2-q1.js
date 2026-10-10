#!/usr/bin/env node
/**
 * DBE History P2 — November 2024 — Question 1 (order 1)
 * Civil Resistance, 1970s to 1980s: how civic organisations mobilised local communities against apartheid structures (Sources 1A-1D).
 * Source-based question: DESIGN-HIST-01 (same real sources, fresh angles); DESIGN-HIST-02 (1.6 taught via an objective synthesis item).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 * Typed blanks: numeric only, keyboard_type 'standard_math' on every fitb (KEYBOARD-04, DESIGN-HIST-03).
 *   node tools/validate-questions.js --script scripts/add-history-2024-nov-p2-q1.js --curriculum temp/curriculum-vocab-history-p2-2024.json
 *   node scripts/add-history-2024-nov-p2-q1.js --dry-run
 *   node scripts/add-history-2024-nov-p2-q1.js
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
  "name": "Question 1",
  "syllabus": "dbe",
  "subject": "history",
  "year": 2024,
  "paper": "nov_p2",
  "order": 1,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "civic_organisations",
    "rent_boycotts",
    "black_local_authorities",
    "civil_resistance",
    "source_reliability"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2024/nov_p2/q1/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2024/nov_p2/q1/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2024/nov_p2/q1/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2024/nov_p2/q1/memo_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2024/nov_p2/q1/memo_3.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2024/nov_p2/q1/memo_4.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2024/nov_p2/q1/memo_5.png"
  ],
  "exam_question_marks": 50,
  "supplementary_materials": [
    {
      "type": "source",
      "label": "Source 1A",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2024/nov_p2/q1/annexure_1A.png"
      ]
    },
    {
      "type": "source",
      "label": "Source 1B",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2024/nov_p2/q1/annexure_1B.png"
      ]
    },
    {
      "type": "source",
      "label": "Source 1C",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2024/nov_p2/q1/annexure_1C.png"
      ]
    },
    {
      "type": "source",
      "label": "Source 1D",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2024/nov_p2/q1/annexure_1D.png"
      ]
    }
  ]
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "According to Source 1D, by August 1987 the rent boycotts in the PWV had cost more than R[] million.",
    "metadata": [
      "Cost: R",
      "[ ]"
    ],
    "answer": [
      "188",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "interpretation",
    "unit": "civil_resistance_1970s_80s",
    "topic": "civic_organisations_rent_boycotts",
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
    "year": 2024,
    "paper": "nov_p2",
    "keyboard_type": "standard_math",
    "clues": "- Look near the end of the second paragraph of Source 1D.\n- Write the number only, without the R or the word million."
  },
  {
    "name": "Question 2",
    "question": "According to Source 1C, Robert Sobukwe's isolation on Robben Island under the Sobukwe Clause was repeated for [] years.",
    "metadata": [
      "Years: ",
      "[ ]"
    ],
    "answer": [
      "9",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "interpretation",
    "unit": "civil_resistance_1970s_80s",
    "topic": "civic_organisations_rent_boycotts",
    "subtopic": "evidence_extraction",
    "skills": [
      "extract_numeric_evidence_from_source"
    ],
    "difficulty": 1,
    "exam_weight": 1,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2024,
    "paper": "nov_p2",
    "keyboard_type": "standard_math",
    "clues": "- The Sobukwe Clause is explained in the middle of the second paragraph of Source 1C.\n- The number is written as a word in the source; type it as digits."
  },
  {
    "name": "Question 3",
    "question": "Source 1A says councillors ran the townships on budgets raised from local rents and levies. How does this help explain the rent increases in Source 1D?",
    "metadata": [
      "Parliament ordered the councils to raise rents so that it could fund new housing in white suburbs",
      "Civic organisations asked the councils to raise rents so that they could pay for their own campaigns",
      "The councils had to fund themselves, so they raised township rents to cover their budget deficits",
      "The councils raised rents to pay the costs of electing black representatives to sit in Parliament",
      ""
    ],
    "answer": [
      "The councils had to fund themselves, so they raised township rents to cover their budget deficits",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "civil_resistance_1970s_80s",
    "topic": "civic_organisations_rent_boycotts",
    "subtopic": "historical_causation",
    "skills": [
      "corroborate_evidence_across_sources"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Source 1D says the local authorities were under pressure to become \"self-financing\".\n- Ask where the money for township administration had to come from."
  },
  {
    "name": "Question 4",
    "question": "According to Source 1A, which forms of local self-organisation did the civics work with?",
    "metadata": [
      "Block committees",
      "Shop-steward councils in factories",
      "Yard committees",
      "Street committees",
      "Student representative councils"
    ],
    "answer": [
      "Block committees",
      "Yard committees",
      "Street committees",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "interpretation",
    "unit": "civil_resistance_1970s_80s",
    "topic": "civic_organisations_rent_boycotts",
    "subtopic": "evidence_extraction",
    "skills": [
      "identify_evidence_from_a_source"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Find the sentence about \"more localised forms of self-organisation\".\n- Only choose forms the source actually names."
  },
  {
    "name": "Question 5",
    "question": "According to the poster in Source 1B, who was billed to speak about the problems in Kagiso and Munsieville?",
    "metadata": [
      "Dr Motlana",
      "Isaac Genu",
      "Jaki Seroke",
      "Moses Mayekiso",
      ""
    ],
    "answer": [
      "Isaac Genu",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "interpretation",
    "unit": "civil_resistance_1970s_80s",
    "topic": "civic_organisations_rent_boycotts",
    "subtopic": "evidence_extraction",
    "skills": [
      "identify_evidence_from_a_source"
    ],
    "difficulty": 1,
    "exam_weight": 1,
    "xp": 10,
    "order": 5,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- The poster pairs each speaker's name with a topic.\n- Two of the names belong to other sources in this question."
  },
  {
    "name": "Question 6",
    "question": "Source 1C comes from Jaki Seroke's memoir, published in 2021. Which feature should make a historian cautious when using it?",
    "metadata": [
      "It is an official police record of the Thembisa boycott, so it leaves out what the residents thought",
      "It was written by a foreign journalist who reported on Thembisa without ever visiting the township",
      "It is a government report that was written mainly to justify the use of the detention laws",
      "It is a personal account by a detained activist, written decades later, so it may be one-sided",
      ""
    ],
    "answer": [
      "It is a personal account by a detained activist, written decades later, so it may be one-sided",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "civil_resistance_1970s_80s",
    "topic": "civic_organisations_rent_boycotts",
    "subtopic": "source_evaluation",
    "skills": [
      "evaluate_source_reliability"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 6,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Read the introduction above Source 1C: who wrote it, what kind of text it is, and when.\n- Think about how memory and personal involvement can shape an account."
  },
  {
    "name": "Question 7",
    "question": "Match each law, body or person in Sources 1A and 1C to what it did.",
    "metadata": [
      "A - Black Local Authorities Act",
      "B - General Law Amendment Act",
      "C - Sobukwe Clause",
      "D - AZAPO",
      "1 - Was used to keep the PAC founder isolated on Robben Island",
      "2 - Set up township councils that ran on local rents and levies",
      "3 - Led action supporting the Thembisa residents' rent complaints",
      "4 - Allowed fourteen days' detention while police worked out a charge"
    ],
    "answer": [
      "A-2",
      "B-4",
      "C-1",
      "D-3"
    ],
    "presentation": "match",
    "type": "interpretation",
    "unit": "civil_resistance_1970s_80s",
    "topic": "civic_organisations_rent_boycotts",
    "subtopic": "historical_terminology",
    "skills": [
      "identify_historical_event_or_term"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 7,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Two of these are laws and appear in different sources.\n- One is an organisation that sided with the residents."
  },
  {
    "name": "Question 8",
    "question": "Using the dates in Sources 1A, 1B and 1D, arrange these events in the order they happened.",
    "metadata": [
      "Residents meet at the Roman Catholic Church in Kagiso",
      "The Black Local Authorities Act is passed",
      "Police shoot thirteen marchers dead in Mamelodi",
      "The Black Local Government Bill is introduced",
      "Many councillors resign after attacks over rent increases"
    ],
    "answer": [
      "The Black Local Government Bill is introduced",
      "The Black Local Authorities Act is passed",
      "Many councillors resign after attacks over rent increases",
      "Residents meet at the Roman Catholic Church in Kagiso",
      "Police shoot thirteen marchers dead in Mamelodi"
    ],
    "presentation": "ordering",
    "type": "interpretation",
    "unit": "civil_resistance_1970s_80s",
    "topic": "civic_organisations_rent_boycotts",
    "subtopic": "historical_chronology",
    "skills": [
      "sequence_historical_events"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 8,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Source 1A gives two years for the law; Source 1D gives the year of the resignations.\n- The poster in Source 1B is dated; compare it with the Mamelodi date in Source 1D."
  },
  {
    "name": "Question 9",
    "question": "Which of these claims about how civic organisations mobilised communities are supported by the sources?",
    "metadata": [
      "They took up everyday grievances such as high rents and bad housing (Source 1A)",
      "They persuaded the government to cancel the Black Local Authorities Act in 1982 (Source 1A)",
      "They called public meetings with well-known speakers and advertised them with posters (Source 1B)",
      "They refused to work with political organisations such as AZAPO (Source 1C)",
      "They organised rent boycotts that spread to many townships between 1985 and 1986 (Source 1D)"
    ],
    "answer": [
      "They took up everyday grievances such as high rents and bad housing (Source 1A)",
      "They called public meetings with well-known speakers and advertised them with posters (Source 1B)",
      "They organised rent boycotts that spread to many townships between 1985 and 1986 (Source 1D)",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "civil_resistance_1970s_80s",
    "topic": "civic_organisations_rent_boycotts",
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
    "paper": "nov_p2",
    "clues": "- Check each claim against the source named in brackets.\n- Two claims reverse what their source actually says."
  }
];

// ─── AI explanation (AMPM-CONTENT-AI-EXP) — one entry per REAL exam sub-question, against the memo ───

const aiExplanation = {
  sub_questions: [
  {
    "number": "1.1.1",
    "marks": 1,
    "clues": "- The Bill is named in the first sentence of Source 1A.\n- Give its exact name.",
    "approach": "- Read the opening sentence of Source 1A.\n- Copy the name of the Bill, not the Act it became.",
    "solution": "1. '… Black Local Government Bill …'"
  },
  {
    "number": "1.1.2",
    "marks": 2,
    "clues": "- The provisions follow the words \"It provided for\".\n- Quote two separate provisions.",
    "approach": "- Read the sentences after the Act is named.\n- Pick two things the Act gave or set up for black residents.\n- Copy each phrase exactly.",
    "solution": "1. '… for the establishment of a series of local government structures similar to those operating in the white areas …'\n2. '… [it] gave African residents of urban locations something like autonomy (self-government)'\n3. '… they now had local power, elected by local residents' or 'Councillors were responsible for township administration …' are also accepted.\n4. Any two quotations earn 2 marks."
  },
  {
    "number": "1.1.3",
    "marks": 3,
    "clues": "- The problems are listed after \"formed to tackle specific problems such as\".\n- You need three.",
    "approach": "- Find the list at the end of the second paragraph.\n- Write down three separate problems.",
    "solution": "1. '… high rentals …'\n2. '… poor electrification …'\n3. '… bad housing …'\n4. '… the bucket-toilet system …' and '… crime' are also accepted.\n5. Any three earn 3 marks."
  },
  {
    "number": "1.1.4",
    "marks": 2,
    "clues": "- \"Bread-and-butter\" issues are daily living problems.\n- Ask where the causes of those problems led the civics.",
    "approach": "- Explain what bread-and-butter issues are.\n- Explain why tackling them pulled the civics into politics.",
    "solution": "1. Civic organisations no longer focused only on residents' local concerns; they became politicised and began challenging local government structures.\n2. They asked critical questions, such as why streets were dirty and why rent had to be paid, and demanded provisions from the authorities.\n3. The problems came from the apartheid system, which drew them into the liberation struggle.\n4. Any one point, explained, earns 2 marks."
  },
  {
    "number": "1.2.1",
    "marks": 2,
    "clues": "- Look at what the poster announces: who, what, when and where.\n- Think about who it was aimed at.",
    "approach": "- Identify the event the poster advertises.\n- State the purpose of advertising it to residents.",
    "solution": "1. To invite and mobilise the residents of Kagiso and Munsieville to a community meeting against apartheid government structures.\n2. To communicate the purpose of the meeting: the lack of basic services in Kagiso and Munsieville.\n3. To highlight the speakers and their topics, and give the date, time and venue.\n4. Any one reason earns 2 marks."
  },
  {
    "number": "1.2.2",
    "marks": 4,
    "clues": "- Civics were new organisations; residents needed to know what they were for.\n- Think about who Dr Motlana was in the community.",
    "approach": "- Explain why residents needed to hear about the role of civics.\n- Explain why Motlana was a suitable speaker.\n- Make two separate points.",
    "solution": "1. To create awareness of civic organisations, which were new (formed from the late 1970s and multiplying in the 1980s).\n2. To mobilise residents to support the civics.\n3. To explain how civics would address the basic needs of township dwellers.\n4. Dr Motlana was a well-respected professional, political activist and community leader.\n5. Any two points, explained, earn 4 marks."
  },
  {
    "number": "1.3.1",
    "marks": 1,
    "clues": "- The organisation is named in the first sentence of Source 1C.",
    "approach": "- Read the opening sentence.\n- Copy the organisation's name.",
    "solution": "1. '… Azanian People's Organisation (AZAPO) …'"
  },
  {
    "number": "1.3.2",
    "marks": 2,
    "clues": "- Note the timing: the arrest came the morning after the march.\n- Think about what the police hoped to achieve.",
    "approach": "- Link the detention to the march the day before.\n- Explain the police's likely motive.",
    "solution": "1. He was an anti-apartheid activist and struggle leader.\n2. The police suspected he supported the Thembisa residents' march.\n3. They wanted to stop future protests and instil fear among community leaders and protesters.\n4. Any one reason earns 2 marks."
  },
  {
    "number": "1.3.3",
    "marks": 3,
    "clues": "- The stipulations follow the name of the Act in the second paragraph.\n- Quote three separate rules.",
    "approach": "- Find the sentences describing the Act.\n- List three conditions it set for detainees.",
    "solution": "1. '… allowed for fourteen days' detention while the police worked out a charge'\n2. 'The detainee could be held in solitary confinement (isolation) …'\n3. '… was not allowed access to lawyers …' or '… a doctor during that time'\n4. 'The fourteen days could be extended indefinitely (without end) …' is also accepted.\n5. Any three earn 3 marks."
  },
  {
    "number": "1.3.4",
    "marks": 2,
    "clues": "- A boycott is a refusal to take part or pay.\n- Use your own words.",
    "approach": "- Say who refuses, what they refuse, and why.",
    "solution": "1. Action taken by residents to stop paying rent, as a protest against the authorities.\n2. Deliberately refusing to pay rental fees is also accepted."
  },
  {
    "number": "1.3.5",
    "marks": 4,
    "clues": "- A puppet is controlled by someone else.\n- Ask whose interests the boycott opponents served.",
    "approach": "- Explain the meaning of \"puppet\" here.\n- Link boycott opponents to the township superintendent.\n- Give two points.",
    "solution": "1. They supported, or were controlled by, apartheid local structures and the township superintendent.\n2. They accepted the apartheid laws that forced residents to pay unaffordable rent.\n3. They ignored the bread-and-butter issues affecting township residents.\n4. Any two points earn 4 marks."
  },
  {
    "number": "1.4.1",
    "marks": 2,
    "clues": "- The reasons are in the first paragraph of Source 1D.\n- Quote two separate reasons.",
    "approach": "- Read the sentences about rent in the Vaal.\n- Copy two phrases explaining why residents could not pay.",
    "solution": "1. '… rapidly escalating (rising) rents …'\n2. '… 56 per cent rent increase …'\n3. '… already paying some of the highest rents …' and '… half of which were in arrears' are also accepted.\n4. Any two earn 2 marks."
  },
  {
    "number": "1.4.2",
    "marks": 4,
    "clues": "- The source links the resignations to attacks on councillors.\n- Use your own knowledge of how residents saw councillors.",
    "approach": "- Explain the danger councillors faced.\n- Explain how residents saw them.\n- Give two points.",
    "solution": "1. They feared attacks from residents for implementing rent increases.\n2. They were used as pawns by the black local authorities, which made them unpopular.\n3. They wanted to escape the stigma of being an extension of the apartheid government.\n4. They lacked protection from the government.\n5. Any two points earn 4 marks."
  },
  {
    "number": "1.4.3",
    "marks": 2,
    "clues": "- A massacre is a large-scale killing of defenceless people.\n- Use the details in Source 1D.",
    "approach": "- Define the concept.\n- Apply it to what happened in Mamelodi.",
    "solution": "1. The ruthless and violent killing of 13 people by the South African Police during the rent protests in Mamelodi on 21 November 1985."
  },
  {
    "number": "1.4.4",
    "marks": 4,
    "clues": "- Look at the source's origin: who produced it and when.\n- Think about what information it gives on the government's reaction.",
    "approach": "- Use the provenance to judge usefulness.\n- Use the content to judge usefulness.\n- Give two reasons.",
    "solution": "1. It comes from the TRC Final Report, an official document that revealed the injustices of the past.\n2. It was published on 29 October 1998, matching the actual release of the report.\n3. It covers January 1985 to July 1986, the peak of the rent boycotts in the PWV.\n4. It gives detailed information on violent government reactions to protests, and it can be corroborated with Source 1C.\n5. Any two reasons earn 4 marks."
  },
  {
    "number": "1.5",
    "marks": 4,
    "clues": "- Find something the poster shows that Source 1D also describes.\n- Pair specific details, not general topics.",
    "approach": "- Take a detail from Source 1B.\n- Find the matching evidence in Source 1D.\n- Explain the link; repeat for a second pair.",
    "solution": "1. Source 1B shows township residents protesting, and Source 1D describes rent boycotts by township residents across the Vaal.\n2. Source 1B shows an unarmed, peaceful march, and Source 1D says unarmed victims were shot in the back.\n3. Source 1B shows the Krugersdorp Residents' Organisation calling a meeting, and Source 1D says opposition was organised through civic organisations, with boycotts launched in Krugersdorp.\n4. Both show the strength and unity built by civic organisations.\n5. Any two comparisons earn 4 marks."
  },
  {
    "number": "1.6",
    "marks": 8,
    "clues": "- Plan before you write: what did civics do, and what did they protest against?\n- Use every source and add your own knowledge.",
    "approach": "- Open with a clear statement answering the question.\n- Use evidence from each source, naming it.\n- Add own knowledge, e.g. making townships ungovernable or SANCO.\n- End with a concluding sentence.",
    "solution": "1. Civics promoted local interests and worked with block, yard and street committees on housing, electricity, the bucket system and crime (Source 1A).\n2. They worked together in national campaigns to make the townships ungovernable (Source 1A and own knowledge).\n3. Professionals and church leaders supported them, and they used posters to explain their role and mobilise residents (Source 1B).\n4. They organised the Thembisa rent boycott with support from AZAPO and protested against repression (Source 1C).\n5. Civic and student organisations spread rent boycotts across many townships; police brutality radicalised communities (Source 1D).\n6. The civics united under SANCO in 1992 (own knowledge).\n7. The paragraph is marked on a 3-level rubric: 0–2, 3–5 or 6–8 marks."
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
