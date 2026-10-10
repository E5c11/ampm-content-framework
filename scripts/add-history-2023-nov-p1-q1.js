#!/usr/bin/env node
/**
 * DBE History P1 — November 2023 — Question 1 (order 1)
 * The Cold War: how Berlin became a focal point of Cold War tension in 1948 (Sources 1A-1D).
 * Source-based question: DESIGN-HIST-01 (same real sources, fresh interpretive-angle practice questions);
 * DESIGN-HIST-02 (the 8-mark paragraph is taught via an objective synthesis item).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 * Typed blanks: numeric only, keyboard_type 'standard_math' on every fitb (KEYBOARD-04, DESIGN-HIST-03).
 *   node tools/validate-questions.js --script scripts/add-history-2023-nov-p1-q1.js --curriculum temp/curriculum-vocab-history-2023.json
 *   node scripts/add-history-2023-nov-p1-q1.js --dry-run
 *   node scripts/add-history-2023-nov-p1-q1.js
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
  "year": 2023,
  "paper": "nov_p1",
  "order": 1,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "berlin_blockade",
    "berlin_crisis",
    "currency_reform",
    "source_reliability"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2023/nov_p1/q1/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2023/nov_p1/q1/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2023/nov_p1/q1/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2023/nov_p1/q1/memo_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2023/nov_p1/q1/memo_3.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2023/nov_p1/q1/memo_4.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2023/nov_p1/q1/memo_5.png"
  ],
  "exam_question_marks": 50,
  "supplementary_materials": [
    {
      "type": "source",
      "label": "Source 1A",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2023/nov_p1/q1/annexure_1A.png"
      ]
    },
    {
      "type": "source",
      "label": "Source 1B",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2023/nov_p1/q1/annexure_1B.png"
      ]
    },
    {
      "type": "source",
      "label": "Source 1C",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2023/nov_p1/q1/annexure_1C.png"
      ]
    },
    {
      "type": "source",
      "label": "Source 1D",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2023/nov_p1/q1/annexure_1D.png"
      ]
    }
  ]
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "According to Source 1A, the city of Berlin lay [] miles inside the eastern zone controlled by the Soviets.",
    "metadata": [
      "Miles inside the Soviet zone: ",
      "[ ]"
    ],
    "answer": [
      "110",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "interpretation",
    "unit": "cold_war",
    "topic": "berlin_blockade_1948",
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
    "year": 2023,
    "paper": "nov_p1",
    "keyboard_type": "standard_math",
    "clues": "- Look at the last paragraph of Source 1A.\n- Write the number only, without the unit."
  },
  {
    "name": "Question 2",
    "question": "According to Source 1A, why was there a last-minute rush of people from east to west before the Soviet Army took control of its zone?",
    "metadata": [
      "They had been promised jobs and better housing in the western zones by the Western Allies",
      "They feared the Russians would set up a border that would be impossible to get through",
      "They were ordered to move west by the European Advisory Commission before the war had ended",
      "They wanted to vote in the first elections held in the American and British zones",
      ""
    ],
    "answer": [
      "They feared the Russians would set up a border that would be impossible to get through",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "interpretation",
    "unit": "cold_war",
    "topic": "berlin_blockade_1948",
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
    "year": 2023,
    "paper": "nov_p1",
    "clues": "- Read the final two sentences of Source 1A.\n- The source gives the reason in its own words: look for what people feared."
  },
  {
    "name": "Question 3",
    "question": "Arrange these events, all mentioned in the sources or their introductions, in the order in which they happened.",
    "metadata": [
      "The Soviet Union replies, blaming the special currency in the western sectors",
      "Truman, Churchill and Stalin meet at Potsdam near Berlin",
      "The Kansas City Star publishes Ray's cartoon of Stalin sawing Berlin in two",
      "Roosevelt, Churchill and Stalin agree at Yalta to create a zone for France",
      "The USA delivers its note calling the blockade a clear violation of agreements"
    ],
    "answer": [
      "Roosevelt, Churchill and Stalin agree at Yalta to create a zone for France",
      "Truman, Churchill and Stalin meet at Potsdam near Berlin",
      "The USA delivers its note calling the blockade a clear violation of agreements",
      "The Soviet Union replies, blaming the special currency in the western sectors",
      "The Kansas City Star publishes Ray's cartoon of Stalin sawing Berlin in two"
    ],
    "presentation": "ordering",
    "type": "interpretation",
    "unit": "cold_war",
    "topic": "berlin_blockade_1948",
    "subtopic": "historical_chronology",
    "skills": [
      "sequence_historical_events"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2023,
    "paper": "nov_p1",
    "clues": "- The dates are in Source 1A and in the introductions to Sources 1B, 1C and 1D.\n- Two events are in 1945 and three are in 1948."
  },
  {
    "name": "Question 4",
    "question": "Which features make Source 1B useful to a historian studying the Berlin Blockade?",
    "metadata": [
      "It is an official US State Department report produced in 1948, during the crisis itself",
      "It gives a balanced account that also explains the Soviet Union's reasons for the blockade",
      "It records the formal position the USA presented to the Soviet Union on 6 July 1948",
      "It was written by a neutral historian long after the blockade had come to an end",
      "Its claims about Western rights in Berlin can be checked against the Soviet reply in Source 1C"
    ],
    "answer": [
      "It is an official US State Department report produced in 1948, during the crisis itself",
      "It records the formal position the USA presented to the Soviet Union on 6 July 1948",
      "Its claims about Western rights in Berlin can be checked against the Soviet reply in Source 1C",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "cold_war",
    "topic": "berlin_blockade_1948",
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
    "clues": "- Use the introduction above Source 1B: who produced it, when, and for whom.\n- Usefulness can also come from being able to compare a source with another one."
  },
  {
    "name": "Question 5",
    "question": "Match each statement to the source it comes from.",
    "metadata": [
      "A - 'The city of Berlin … became a special area for joint four-power control'",
      "B - '[The USA] would not be induced by threats, pressures or other actions to abandon these rights'",
      "C - 'Berlin lies in the centre of the Soviet zone and is part of that zone'",
      "D - 'Russian agreement to mediate'",
      "1 - Source 1D",
      "2 - Source 1C",
      "3 - Source 1A",
      "4 - Source 1B"
    ],
    "answer": [
      "A-3",
      "B-4",
      "C-2",
      "D-1"
    ],
    "presentation": "match",
    "type": "interpretation",
    "unit": "cold_war",
    "topic": "berlin_blockade_1948",
    "subtopic": "source_evaluation",
    "skills": [
      "compare_source_authorship_perspective"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 5,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2023,
    "paper": "nov_p1",
    "clues": "- Think about whose point of view each statement expresses: American, Soviet or neutral.\n- One statement is a label in a cartoon."
  },
  {
    "name": "Question 6",
    "question": "In Source 1D, Stalin is shown sawing through a tree trunk labelled 'BERLIN'. What does this represent?",
    "metadata": [
      "The Soviet Union rebuilding Berlin after the city was destroyed by wartime bombing",
      "The Western powers and the Soviet Union working together to govern the whole city of Berlin",
      "The Soviet Union splitting Berlin into two parts and ending joint control of the city",
      "Stalin removing the barriers that the Western powers had placed around West Berlin",
      ""
    ],
    "answer": [
      "The Soviet Union splitting Berlin into two parts and ending joint control of the city",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "interpretation",
    "unit": "cold_war",
    "topic": "berlin_blockade_1948",
    "subtopic": "evidence_extraction",
    "skills": [
      "interpret_political_cartoon_symbolism"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 6,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2023,
    "paper": "nov_p1",
    "clues": "- Read the introduction above Source 1D.\n- Ask what happens to a tree trunk when it is sawn through."
  },
  {
    "name": "Question 7",
    "question": "In Source 1D, the label says 'Russian agreement to mediate'. What does the word 'mediate' mean?",
    "metadata": [
      "To impose a decision on others by threatening military force",
      "To cut off all supplies to a city in order to force its people to surrender",
      "To withdraw from an agreement without telling the other parties",
      "To help settle a dispute through negotiation between the two sides",
      ""
    ],
    "answer": [
      "To help settle a dispute through negotiation between the two sides",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "cold_war",
    "topic": "berlin_blockade_1948",
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
    "year": 2023,
    "paper": "nov_p1",
    "clues": "- Source 1B uses a related idea: settling disagreements 'by negotiation'.\n- A mediator stands between two sides that disagree."
  },
  {
    "name": "Question 8",
    "question": "How does Source 1A help to explain why Stalin was able to cut Berlin in two, as shown in Source 1D?",
    "metadata": [
      "It shows Berlin lay deep inside the Soviet zone, so the Western sectors were surrounded by Soviet territory",
      "It shows France had been invaded three times by Germany, so France refused to defend its own sector of Berlin",
      "It shows the Western Allies had agreed at Yalta to give the whole city of Berlin to the Soviet Union",
      "It shows Roosevelt had died in April 1945, so the USA no longer had any representative in Berlin",
      ""
    ],
    "answer": [
      "It shows Berlin lay deep inside the Soviet zone, so the Western sectors were surrounded by Soviet territory",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "cold_war",
    "topic": "berlin_blockade_1948",
    "subtopic": "source_evaluation",
    "skills": [
      "corroborate_evidence_across_sources"
    ],
    "difficulty": 4,
    "exam_weight": 3,
    "xp": 10,
    "order": 8,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2023,
    "paper": "nov_p1",
    "clues": "- Look at where Source 1A says Berlin was located.\n- Think about what that position meant for roads and railways into the Western sectors."
  },
  {
    "name": "Question 9",
    "question": "Which claims about how Berlin became a focal point of Cold War tension in 1948 are supported by the sources?",
    "metadata": [
      "The victorious powers agreed that Berlin, deep in the Soviet zone, would be under four-power control (Source 1A)",
      "The USA threatened to use military force if the blockade of Berlin was not lifted at once (Source 1B)",
      "The Western powers called the blockade a clear violation of the agreements on Berlin (Source 1B)",
      "The Soviet Union blamed the crisis on the special currency the West kept in its sectors (Source 1C)",
      "The Soviet Union refused to supply food or other essentials to any part of Berlin (Source 1C)"
    ],
    "answer": [
      "The victorious powers agreed that Berlin, deep in the Soviet zone, would be under four-power control (Source 1A)",
      "The Western powers called the blockade a clear violation of the agreements on Berlin (Source 1B)",
      "The Soviet Union blamed the crisis on the special currency the West kept in its sectors (Source 1C)",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "cold_war",
    "topic": "berlin_blockade_1948",
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
    "clues": "- A claim is supported only if the named source actually says it.\n- Check what Source 1B says the USA offered, and what Source 1C says about supplying Berlin."
  }
];

// ─── AI explanation (AMPM-CONTENT-AI-EXP) — one entry per REAL exam sub-question, against the memo ───

const aiExplanation = {
  sub_questions: [
  {
    "number": "1.1.1",
    "marks": 3,
    "clues": "- The answer is in the first sentence of Source 1A.\n- Three countries, one mark each.",
    "approach": "- Find the brackets describing the European Advisory Commission.\n- Copy the three country names.",
    "solution": "1. 'United States'/'US'\n2. 'Britain'\n3. 'Soviet Union'\n4. One mark for each country."
  },
  {
    "number": "1.1.2",
    "marks": 1,
    "clues": "- Read the second paragraph of Source 1A.\n- Look for what France had suffered.",
    "approach": "- Find the reason given for creating a zone for France.\n- Quote it.",
    "solution": "1. '… which had suffered three invasions and two defeats at the hands of Germany within seventy years'"
  },
  {
    "number": "1.1.3",
    "marks": 2,
    "clues": "- Think about what Germany had just done to Europe.\n- Use your own words.",
    "approach": "- Give one developed reason why the Allies wanted to keep Germany disarmed.",
    "solution": "1. To prevent Germany from attacking its neighbours again.\n2. Germany was blamed for causing the Second World War and had to be weakened.\n3. Or: to maintain peace in Europe.\n4. Any one, explained, earns the 2 marks."
  },
  {
    "number": "1.1.4",
    "marks": 4,
    "clues": "- Berlin was 110 miles inside the Soviet zone.\n- What could the USSR do to a city it surrounded?",
    "approach": "- Give two implications of Berlin's position for the Western powers.\n- Link each to Cold War rivalry.",
    "solution": "1. Berlin could become a 'pawn' the Soviet Union used to settle its differences with the West.\n2. The Western sectors would be isolated from the West, surrounded by the Soviet zone.\n3. The West feared Soviet domination of decisions about Berlin and the spread of communism.\n4. Any two, explained, earn the 4 marks."
  },
  {
    "number": "1.2.1",
    "marks": 2,
    "clues": "- A blockade stops movement.\n- Use your own words.",
    "approach": "- Write one clear definition.",
    "solution": "1. Sealing or closing off a place to prevent goods or people from entering or leaving.\n2. Or: preventing freedom of movement from one place to another."
  },
  {
    "number": "1.2.2",
    "marks": 4,
    "clues": "- The four powers had agreed to administer Berlin jointly.\n- What did the blockade do to that arrangement?",
    "approach": "- Explain two reasons why the USA saw the blockade as breaking the agreements.",
    "solution": "1. The USSR acted without consulting the other occupying powers.\n2. It was seen as a deliberate act to bring hardship to Berliners.\n3. It threatened the administration of the US sector.\n4. Any two, explained, earn the 4 marks."
  },
  {
    "number": "1.2.3",
    "marks": 3,
    "clues": "- Read the second and third paragraphs of Source 1B.\n- Three separate quoted phrases.",
    "approach": "- Find the reasons the USA gave for staying in Berlin.\n- Copy three of them.",
    "solution": "1. 'as a matter of established right derived from the defeat and surrender of Germany'\n2. 'confirmed by formal agreements among the principal Allies'\n3. 'would not be induced (pushed) by threats, pressures or other actions to abandon these rights'\n4. 'responsibility for the physical well-being of the population of its sector of Berlin'\n5. Any three earn 1 mark each."
  },
  {
    "number": "1.2.4",
    "marks": 1,
    "clues": "- Look for the word 'insist'.\n- Quote the obligation.",
    "approach": "- Find what the USA insisted on for its sector.",
    "solution": "1. '… the arrangements for the movement of freight and passenger traffic between the western zones and Berlin be fully restored'"
  },
  {
    "number": "1.2.5",
    "marks": 4,
    "clues": "- Think about the United Nations Charter mentioned in the source.\n- Why would offering talks help the USA?",
    "approach": "- Give two reasons for the USA's stress on negotiation.",
    "solution": "1. The USA did not want a military conflict with the USSR.\n2. As a signatory of the UN Charter it was committed to settling disputes peacefully.\n3. It wanted the USSR to appear the aggressor.\n4. It did not want to lose its occupation of West Berlin.\n5. Any two, explained, earn the 4 marks."
  },
  {
    "number": "1.3.1",
    "marks": 2,
    "clues": "- Read the first paragraph of Source 1C.\n- Two reasons, one mark each.",
    "approach": "- Find the reasons the Soviet Union gave against a separate currency.",
    "solution": "1. 'Berlin lies in the centre of the Soviet zone'\n2. 'The interests of the Berlin population do not permit …' a special currency with no validity in the Soviet zone\n3. 'The entire mass of currency notes, which were cancelled in the western zone, threatened to pour into Berlin …'\n4. Any two earn 1 mark each."
  },
  {
    "number": "1.3.2",
    "marks": 2,
    "clues": "- Monetary means to do with money.\n- Explain it in the context of Germany in 1948.",
    "approach": "- Give one explanation linked to the Western zones.",
    "solution": "1. The introduction of a new currency (the Deutsche Mark) by the Western powers in their zones, which excluded the Soviet zone."
  },
  {
    "number": "1.3.3",
    "marks": 2,
    "clues": "- Read the end of the second paragraph of Source 1C.\n- Look for 'inasmuch as'.",
    "approach": "- Find the reason the danger had not been removed.\n- Quote it.",
    "solution": "1. '… the United States, Great Britain and France continue to maintain in Berlin their special currency'"
  },
  {
    "number": "1.3.4",
    "marks": 4,
    "clues": "- Who wrote Source 1C, and for what purpose?\n- Whose views are missing?",
    "approach": "- Give two limitations, each explained.",
    "solution": "1. It gives only the Soviet Command's viewpoint, so it is one-sided.\n2. It is critical of, and biased against, the Western financial reforms.\n3. Any two, explained, earn the 4 marks."
  },
  {
    "number": "1.4",
    "marks": 4,
    "clues": "- Source 1B is the US case; Source 1C is the Soviet case.\n- Use 'whereas' to show each difference.",
    "approach": "- Give two differences between the reasons each side gives.",
    "solution": "1. Source 1B bases the US occupation on formal agreements, whereas Source 1C says Berlin lies geographically in the Soviet zone.\n2. Source 1B says the USA is responsible for its sector's people, whereas Source 1C claims the Soviets protect all of 'Greater Berlin'.\n3. Source 1B stresses legal rights, whereas Source 1C stresses protecting the Soviet zone's economy.\n4. Any two, explained, earn the 4 marks."
  },
  {
    "number": "1.5.1",
    "marks": 2,
    "clues": "- The three seated figures are labelled France, USA and Britain.\n- What do they have in common?",
    "approach": "- Explain what the figures sitting together represent.",
    "solution": "1. The three Western powers whose combined zones formed West Berlin.\n2. Or: the leading capitalist powers in the Cold War against communism, alarmed by Stalin's action."
  },
  {
    "number": "1.5.2",
    "marks": 2,
    "clues": "- Use Source 1A: where was Berlin?\n- Think about Stalin's aims.",
    "approach": "- Give one reason, explained.",
    "solution": "1. Berlin was located in the Soviet zone.\n2. Or: the USSR wanted to preserve communism and stop capitalist influence in Berlin."
  },
  {
    "number": "1.6",
    "marks": 8,
    "clues": "- Use evidence from each source, plus own knowledge.\n- Write an organised paragraph, not a list.",
    "approach": "- Open with how Berlin came to be divided (Source 1A).\n- Explain the blockade and the US response (Source 1B).\n- Give the Soviet case (Source 1C) and the division of the city (Source 1D).\n- Close with a linking sentence.",
    "solution": "1. Berlin, 110 miles inside the Soviet zone, was placed under joint four-power control (Source 1A).\n2. The Soviet Union blockaded traffic into Berlin, and the USA, Britain and France protested (Source 1B).\n3. The USA called the blockade a threat, refused to abandon its rights, but offered to negotiate (Source 1B).\n4. The Soviet Union blamed the special currency introduced in the western zones and West Berlin (Source 1C).\n5. The Soviet Union said it was willing to supply the whole of Berlin itself (Source 1C).\n6. Stalin was shown cutting Berlin in two while the Western powers looked on (Source 1D).\n7. Own knowledge: the Western powers supplied West Berlin by air (the Berlin Airlift), and the USSR wanted to extend its sphere of influence.\n8. Marks are awarded holistically on a three-level rubric (0–2, 3–5, 6–8)."
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
