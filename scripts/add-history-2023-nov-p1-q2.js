#!/usr/bin/env node
/**
 * DBE History P1 — November 2023 — Question 2 (order 2)
 * Independent Africa: why the MPLA, FNLA and UNITA became involved in the Angolan Civil War in 1975 (Sources 2A-2D).
 * Source-based question: DESIGN-HIST-01 (same real sources, fresh interpretive-angle practice questions);
 * DESIGN-HIST-02 (the 8-mark paragraph is taught via an objective synthesis item).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 * Typed blanks: numeric only, keyboard_type 'standard_math' on every fitb (KEYBOARD-04, DESIGN-HIST-03).
 *   node tools/validate-questions.js --script scripts/add-history-2023-nov-p1-q2.js --curriculum temp/curriculum-vocab-history-2023.json
 *   node scripts/add-history-2023-nov-p1-q2.js --dry-run
 *   node scripts/add-history-2023-nov-p1-q2.js
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
  "year": 2023,
  "paper": "nov_p1",
  "order": 2,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "angola_civil_war",
    "proxy_war",
    "ethnic_nationalism",
    "source_reliability"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2023/nov_p1/q2/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2023/nov_p1/q2/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2023/nov_p1/q2/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2023/nov_p1/q2/memo_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2023/nov_p1/q2/memo_3.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2023/nov_p1/q2/memo_4.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2023/nov_p1/q2/memo_5.png"
  ],
  "exam_question_marks": 50,
  "supplementary_materials": [
    {
      "type": "source",
      "label": "Source 2A",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2023/nov_p1/q2/annexure_2A.png"
      ]
    },
    {
      "type": "source",
      "label": "Source 2B",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2023/nov_p1/q2/annexure_2B.png"
      ]
    },
    {
      "type": "source",
      "label": "Source 2C",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2023/nov_p1/q2/annexure_2C.png"
      ]
    },
    {
      "type": "source",
      "label": "Source 2D",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2023/nov_p1/q2/annexure_2D.png"
      ]
    }
  ]
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Match each person named in the sources to their role.",
    "metadata": [
      "A - Agostinho Neto",
      "B - Holden Roberto",
      "C - Jonas Savimbi",
      "D - Admiral Leonel Cardoso",
      "1 - Led UNITA and switched his ideology from Maoism to Reaganism",
      "2 - Portuguese High Commissioner who handed power to 'the Angolan people'",
      "3 - Led the MPLA and became Angola's ruler after independence",
      "4 - Led the FNLA, whose army was retrained with the help of Mobutu's army"
    ],
    "answer": [
      "A-3",
      "B-4",
      "C-1",
      "D-2"
    ],
    "presentation": "match",
    "type": "interpretation",
    "unit": "independent_africa",
    "topic": "angolan_civil_war_1975",
    "subtopic": "key_figures_and_events",
    "skills": [
      "identify_evidence_from_a_source"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2023,
    "paper": "nov_p1",
    "clues": "- Sources 2A, 2C and 2D each name the leaders of the movements.\n- One person is not Angolan: read the first paragraph of Source 2C."
  },
  {
    "name": "Question 2",
    "question": "According to Source 2A, which event in Portugal opened the way for three factions to contest power in Angola?",
    "metadata": [
      "The Carnation Revolution of April 1974, which overthrew Salazar's successor Marcelo Caetano",
      "A coup d'état by the followers of Nito Alves, who seized control of the Portuguese government",
      "The election of a Portuguese government that promised to hand Angola over to the MPLA alone",
      "A treaty with Cuba under which Portugal agreed to withdraw all of its troops from Angola",
      ""
    ],
    "answer": [
      "The Carnation Revolution of April 1974, which overthrew Salazar's successor Marcelo Caetano",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "interpretation",
    "unit": "independent_africa",
    "topic": "angolan_civil_war_1975",
    "subtopic": "historical_causation",
    "skills": [
      "identify_evidence_from_a_source"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2023,
    "paper": "nov_p1",
    "clues": "- Read the first sentence of Source 2A.\n- The event is named, with its month and year."
  },
  {
    "name": "Question 3",
    "question": "According to Source 2A, the movement later called Fractionism attempted a coup d'état in the year [].",
    "metadata": [
      "Year: ",
      "[ ]"
    ],
    "answer": [
      "1977",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "interpretation",
    "unit": "independent_africa",
    "topic": "angolan_civil_war_1975",
    "subtopic": "evidence_extraction",
    "skills": [
      "extract_numeric_evidence_from_source"
    ],
    "difficulty": 1,
    "exam_weight": 1,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2023,
    "paper": "nov_p1",
    "keyboard_type": "standard_math",
    "clues": "- Look at the second paragraph of Source 2A.\n- Write the year as four digits."
  },
  {
    "name": "Question 4",
    "question": "Which features of Source 2A should make a historian cautious about relying on it?",
    "metadata": [
      "It comes from a personal blog, not from a book by a named historian",
      "It is an official MPLA government document written to defend the party",
      "It gives no evidence for its figure of 'tens of thousands' of executions",
      "It was written by Agostinho Neto himself while he was ruling Angola",
      "It was posted in 2014, long after the events, by someone who was not an eyewitness"
    ],
    "answer": [
      "It comes from a personal blog, not from a book by a named historian",
      "It gives no evidence for its figure of 'tens of thousands' of executions",
      "It was posted in 2014, long after the events, by someone who was not an eyewitness",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "independent_africa",
    "topic": "angolan_civil_war_1975",
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
    "year": 2023,
    "paper": "nov_p1",
    "clues": "- Read the reference under Source 2A: where was it published, and when?\n- Notice the words 'or alleged followers': how certain is the writer?"
  },
  {
    "name": "Question 5",
    "question": "Source 2B was taken in December 1975 but published by the Guardian in May 2014. What does this tell a historian about the photograph?",
    "metadata": [
      "It was taken by the Guardian's own war reporter while travelling with the MPLA in 1975",
      "It proves that the MPLA had already won the whole civil war by the end of 1975",
      "It is being used decades later to illustrate an article about the MPLA's violent past",
      "It shows FNLA and UNITA soldiers surrendering their weapons to the MPLA in Luanda",
      ""
    ],
    "answer": [
      "It is being used decades later to illustrate an article about the MPLA's violent past",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "interpretation",
    "unit": "independent_africa",
    "topic": "angolan_civil_war_1975",
    "subtopic": "source_evaluation",
    "skills": [
      "interpret_photograph_evidence"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 5,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2023,
    "paper": "nov_p1",
    "clues": "- Compare the date the photograph was taken with the date it was published.\n- Read the title the newspaper gave it."
  },
  {
    "name": "Question 6",
    "question": "How does Source 2C help to explain why, in Source 2A, the MPLA 'seized Luanda at the expense of the other liberation movements'?",
    "metadata": [
      "It shows the Portuguese High Commissioner formally handed power in Luanda to the MPLA",
      "It shows the race for power was fought as an armed struggle, not settled by bargaining",
      "It shows the FNLA had agreed to share power with the MPLA once independence came",
      "It shows the Soviet Union had a direct strategic interest in controlling Luanda itself",
      ""
    ],
    "answer": [
      "It shows the race for power was fought as an armed struggle, not settled by bargaining",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "independent_africa",
    "topic": "angolan_civil_war_1975",
    "subtopic": "source_evaluation",
    "skills": [
      "corroborate_evidence_across_sources"
    ],
    "difficulty": 4,
    "exam_weight": 3,
    "xp": 10,
    "order": 6,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2023,
    "paper": "nov_p1",
    "clues": "- Read the second paragraph of Source 2C.\n- Check who the Portuguese actually handed power to, and who was present."
  },
  {
    "name": "Question 7",
    "question": "Source 2D says Savimbi 'flipped his ideological stance from Maoism to Reaganism'. What does this suggest about his aims?",
    "metadata": [
      "He had given up armed struggle and wanted UNITA to become a peaceful party",
      "He changed his ideology to win the support of the United States for UNITA",
      "He wanted Angola to adopt the same communist system as the People's Republic of China",
      "He was trying to persuade the MPLA and the FNLA to form a coalition government",
      ""
    ],
    "answer": [
      "He changed his ideology to win the support of the United States for UNITA",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "interpretation",
    "unit": "independent_africa",
    "topic": "angolan_civil_war_1975",
    "subtopic": "historical_causation",
    "skills": [
      "explain_historical_causation"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 7,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2023,
    "paper": "nov_p1",
    "clues": "- Use the footnotes under Source 2D to see what Maoism and Reaganism mean.\n- Read what the United States did straight after Savimbi changed his stance."
  },
  {
    "name": "Question 8",
    "question": "Arrange these events in the order in which they happened.",
    "metadata": [
      "Followers of Nito Alves attempt a coup against Neto",
      "The Guardian publishes the photograph of MPLA soldiers",
      "The Carnation Revolution overthrows Caetano in Portugal",
      "MPLA soldiers are photographed during the civil war",
      "Angola becomes independent and the MPLA holds Luanda"
    ],
    "answer": [
      "The Carnation Revolution overthrows Caetano in Portugal",
      "Angola becomes independent and the MPLA holds Luanda",
      "MPLA soldiers are photographed during the civil war",
      "Followers of Nito Alves attempt a coup against Neto",
      "The Guardian publishes the photograph of MPLA soldiers"
    ],
    "presentation": "ordering",
    "type": "interpretation",
    "unit": "independent_africa",
    "topic": "angolan_civil_war_1975",
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
    "year": 2023,
    "paper": "nov_p1",
    "clues": "- The dates are in Source 2A and the introduction to Source 2B.\n- Independence came on 11 November 1975; the photograph was taken a month later."
  },
  {
    "name": "Question 9",
    "question": "Which factors that drew the three movements into civil war in 1975 are supported by the sources?",
    "metadata": [
      "The Portuguese withdrew without making any real attempt to control the transition (Source 2C)",
      "The three movements agreed to rule Angola together after the Portuguese left (Source 2A)",
      "Each faction appealed to foreign powers for support to gain an advantage (Source 2C)",
      "The movements drew their support from different ethnic and regional groups (Source 2D)",
      "The United States refused to give support to any of the Angolan movements (Source 2D)"
    ],
    "answer": [
      "The Portuguese withdrew without making any real attempt to control the transition (Source 2C)",
      "Each faction appealed to foreign powers for support to gain an advantage (Source 2C)",
      "The movements drew their support from different ethnic and regional groups (Source 2D)",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "independent_africa",
    "topic": "angolan_civil_war_1975",
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
    "year": 2023,
    "paper": "nov_p1",
    "clues": "- A claim is supported only if the named source actually says it.\n- Check what Source 2D says about the CIA and about UNITA."
  }
];

// ─── AI explanation (AMPM-CONTENT-AI-EXP) — one entry per REAL exam sub-question, against the memo ───

const aiExplanation = {
  sub_questions: [
  {
    "number": "2.1.1",
    "marks": 2,
    "clues": "- A revolution brings about change in who holds power.\n- Use your own words.",
    "approach": "- Write one clear definition.",
    "solution": "1. The overthrow of a government, usually by force.\n2. Or: a fundamental change in government, which may also be peaceful."
  },
  {
    "number": "2.1.2",
    "marks": 3,
    "clues": "- All three are named in the first paragraph of Source 2A.\n- One mark each.",
    "approach": "- Copy the names (or abbreviations) of the three movements.",
    "solution": "1. 'Popular Movement for the Liberation of Angola'/'MPLA'\n2. 'National Front for the Liberation of Angola'/'FNLA'\n3. 'National Union for the Total Independence of Angola'/'UNITA'\n4. One mark for each."
  },
  {
    "number": "2.1.3",
    "marks": 2,
    "clues": "- Look for 'close links' in Source 2A.\n- Two countries, one mark each.",
    "approach": "- Copy the two named communist countries.",
    "solution": "1. 'Cuba'\n2. 'Soviet Union'"
  },
  {
    "number": "2.1.4",
    "marks": 2,
    "clues": "- Tens of thousands were executed over two years.\n- What kind of leader does that?",
    "approach": "- Give one developed conclusion about Neto.",
    "solution": "1. Neto was brutal and ruthless.\n2. Or: he was intolerant of opposition and promoted a one-party state.\n3. Or: he was oppressive, a dictator."
  },
  {
    "number": "2.2.1",
    "marks": 4,
    "clues": "- December 1975 was just after independence.\n- Why would soldiers pose with weapons then?",
    "approach": "- Give two reasons, each explained.",
    "solution": "1. To display the MPLA's power against the other nationalist movements.\n2. To convince Angolans the MPLA was in control, and to intimidate other parties.\n3. To celebrate the MPLA's victory in taking Luanda.\n4. Any two, explained, earn the 4 marks."
  },
  {
    "number": "2.2.2",
    "marks": 2,
    "clues": "- The title uses the word 'brutal'.\n- What role is the MPLA being given?",
    "approach": "- Explain one implication of the title.",
    "solution": "1. The MPLA used brutal methods to gain control of Angola.\n2. Or: it killed FNLA and UNITA members in the civil war.\n3. Or: it did not take control democratically."
  },
  {
    "number": "2.3.1",
    "marks": 2,
    "clues": "- Read the first two sentences of Source 2C.\n- Quote the reason.",
    "approach": "- Find why the transition became a disaster.",
    "solution": "1. 'The withdrawal of the Portuguese abandoned all attempts to control the transition'"
  },
  {
    "number": "2.3.2",
    "marks": 2,
    "clues": "- A civil war is fought inside one country.\n- Name who fought whom in Angola.",
    "approach": "- Explain the term in the Angolan context.",
    "solution": "1. A war in which the nationalist movements (MPLA, FNLA and UNITA) fought each other for control of the government."
  },
  {
    "number": "2.3.3",
    "marks": 4,
    "clues": "- Read the sentence about the two foreign powers in Source 2C.\n- Think about the Cold War balance of power.",
    "approach": "- Give two explanations of what 'prestige' meant for the superpowers.",
    "solution": "1. Both wanted to spread their ideologies, capitalism and communism.\n2. They competed for allies in every region, including Southern Africa.\n3. They cared about their status in world politics more than the welfare of Angolans (a proxy war).\n4. Any two, explained, earn the 4 marks."
  },
  {
    "number": "2.3.4",
    "marks": 4,
    "clues": "- Look at who wrote Source 2C.\n- What does it cover, and can it be checked?",
    "approach": "- Give two reasons why the source is useful.",
    "solution": "1. It comes from a book by a historian, M Meredith.\n2. It explains how the transition from Portuguese rule led to civil war.\n3. It describes the handover ceremony at which no Angolan was present.\n4. It can be corroborated by Sources 2A and 2B.\n5. Any two, explained, earn the 4 marks."
  },
  {
    "number": "2.4.1",
    "marks": 2,
    "clues": "- Read the first sentence of Source 2D.\n- Quote it.",
    "approach": "- Copy the phrase about 'lenses'.",
    "solution": "1. 'The Popular Movement for the Liberation of Angola (MPLA), led by Agostinho Neto, looked upon politics through nationalist and socialist lenses'"
  },
  {
    "number": "2.4.2",
    "marks": 2,
    "clues": "- 'Ethnicised' is glossed as 'culturally based'.\n- Who supported each movement?",
    "approach": "- Explain one implication.",
    "solution": "1. Each movement represented different ethnic groups, which fed the civil war.\n2. Or: some, such as the mulattos, did not identify with all Angolans.\n3. Or: the movements were regionalised."
  },
  {
    "number": "2.4.3",
    "marks": 1,
    "clues": "- Read the first sentence of the second paragraph.\n- Quote the reason.",
    "approach": "- Copy what the CIA saw in the FNLA.",
    "solution": "1. '… saw it as the least Marxist of the three …'"
  },
  {
    "number": "2.4.4",
    "marks": 4,
    "clues": "- The MPLA had ties to Cuba and the Soviet Union.\n- What did apartheid South Africa fear?",
    "approach": "- Give two reasons, using the source and own knowledge.",
    "solution": "1. UNITA was fighting the MPLA, which South Africa saw as a communist threat.\n2. South Africa wanted control of the region.\n3. UNITA had US support, and the USA was a close ally of South Africa.\n4. Any two, explained, earn the 4 marks."
  },
  {
    "number": "2.4.5",
    "marks": 2,
    "clues": "- Read the last paragraph of Source 2D.\n- Two quotes, one mark each.",
    "approach": "- Find what the MPLA did not do for ordinary people.",
    "solution": "1. '… it did little in the countryside other than recruit soldiers'\n2. 'Education, health and other services in the cities languished'"
  },
  {
    "number": "2.5",
    "marks": 4,
    "clues": "- Source 2C says the factions appealed for foreign support.\n- Source 2D names who supported each.",
    "approach": "- Give two points where Source 2C supports Source 2D.",
    "solution": "1. Source 2C says each faction appealed to foreign interests, and Source 2D shows each received foreign support.\n2. Source 2C describes an armed struggle for power, and Source 2D shows the movements and their backers continuing the war.\n3. Both call them nationalist movements involved in the civil war.\n4. Any two, explained, earn the 4 marks."
  },
  {
    "number": "2.6",
    "marks": 8,
    "clues": "- Use evidence from each source, plus own knowledge.\n- Write an organised paragraph, not a list.",
    "approach": "- Start with the end of Portuguese rule (Source 2A, 2C).\n- Explain the rivalry and foreign backing (Sources 2C, 2D).\n- Add the ethnic divisions and the MPLA's victory (Sources 2A, 2B, 2D).\n- Close with a linking sentence.",
    "solution": "1. The Carnation Revolution of 1974 led Portugal to end colonial rule (Source 2A).\n2. Portugal withdrew without controlling the transition, leaving a power struggle (Source 2C).\n3. Own knowledge: the Alvor Agreement (January 1975) for a shared transitional government collapsed.\n4. The MPLA seized Luanda, set up a one-party state and allied with the Soviet Union and Cuba (Source 2A).\n5. Each faction sought foreign support; the USA and the USSR intervened to protect the global balance of power (Source 2C).\n6. The movements were divided along ethnic and regional lines, and the FNLA was backed by Zaire and the CIA (Source 2D).\n7. Own knowledge: South Africa backed UNITA because it feared communism spreading in Southern Africa.\n8. Marks are awarded holistically on a three-level rubric (0–2, 3–5, 6–8)."
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
