#!/usr/bin/env node
/**
 * DBE History P1 — November 2024 — Question 1 (order 1)
 * The Cold War: how the lives of Berliners were affected by the Berlin Wall, 1961 (Sources 1A-1D).
 * Source-based question: DESIGN-HIST-01 (same real sources, fresh interpretive-angle practice questions);
 * DESIGN-HIST-02 (the 8-mark paragraph is taught via an objective synthesis item).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 * Typed blanks: numeric only, keyboard_type 'standard_math' on every fitb (KEYBOARD-04, DESIGN-HIST-03).
 *   node tools/validate-questions.js --script scripts/add-history-2024-nov-p1-q1.js --curriculum temp/curriculum-vocab-history-2024.json
 *   node scripts/add-history-2024-nov-p1-q1.js --dry-run
 *   node scripts/add-history-2024-nov-p1-q1.js
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
  "paper": "nov_p1",
  "order": 1,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "berlin_wall",
    "berlin_crisis",
    "defection",
    "source_reliability"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2024/nov_p1/q1/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2024/nov_p1/q1/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2024/nov_p1/q1/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2024/nov_p1/q1/memo_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2024/nov_p1/q1/memo_3.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2024/nov_p1/q1/memo_4.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2024/nov_p1/q1/memo_5.png"
  ],
  "exam_question_marks": 50,
  "supplementary_materials": [
    {
      "type": "source",
      "label": "Source 1A",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2024/nov_p1/q1/annexure_1A.png"
      ]
    },
    {
      "type": "source",
      "label": "Source 1B",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2024/nov_p1/q1/annexure_1B.png"
      ]
    },
    {
      "type": "source",
      "label": "Source 1C",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2024/nov_p1/q1/annexure_1C.png"
      ]
    },
    {
      "type": "source",
      "label": "Source 1D",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2024/nov_p1/q1/annexure_1D.png"
      ]
    }
  ]
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "According to Source 1A, by 1961 about [] people a day were fleeing from East to West.",
    "metadata": [
      "People a day: ",
      "[ ]"
    ],
    "answer": [
      "1500",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "interpretation",
    "unit": "cold_war",
    "topic": "berlin_wall_1961",
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
    "paper": "nov_p1",
    "keyboard_type": "standard_math",
    "clues": "- Look in the third paragraph of Source 1A, where defections are described.\n- Write the number without spaces or commas."
  },
  {
    "name": "Question 2",
    "question": "According to Source 1A, why did Berlin become a focal point for tensions between the Allies and the Soviets?",
    "metadata": [
      "It had been almost completely destroyed by Allied bombing during the Second World War",
      "It was a city half-controlled by Western forces, in the middle of the Soviet zone",
      "It was the capital the Soviets had promised to hand back to the Western Allies",
      "It was the only German city in which communist parties had been banned by the Allies",
      ""
    ],
    "answer": [
      "It was a city half-controlled by Western forces, in the middle of the Soviet zone",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "interpretation",
    "unit": "cold_war",
    "topic": "berlin_wall_1961",
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
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Read the second paragraph of Source 1A.\n- Think about where Berlin lay on the map of divided Germany."
  },
  {
    "name": "Question 3",
    "question": "Which features of Source 1A limit its usefulness to a historian studying the building of the Berlin Wall?",
    "metadata": [
      "It was written in 2015, more than fifty years after the events it describes",
      "It is a travel-guide article written for visitors, not a detailed historical study",
      "It was written by a GDR border guard who helped to build the Wall in 1961",
      "Its writer was not an eyewitness, so it gives no first-hand account of 13 August",
      "It was a secret East German report that was hidden from the public until 2015"
    ],
    "answer": [
      "It was written in 2015, more than fifty years after the events it describes",
      "It is a travel-guide article written for visitors, not a detailed historical study",
      "Its writer was not an eyewitness, so it gives no first-hand account of 13 August",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "cold_war",
    "topic": "berlin_wall_1961",
    "subtopic": "source_evaluation",
    "skills": [
      "evaluate_source_reliability"
    ],
    "difficulty": 4,
    "exam_weight": 3,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Use the introduction above Source 1A: who wrote it, where, and when.\n- Ask what kind of publication it comes from and who it was written for."
  },
  {
    "name": "Question 4",
    "question": "In Source 1B, which detail best shows the physical risk Ursula Heinemann took to reach West Berlin?",
    "metadata": [
      "She went to the ticket counter and tried to buy a ticket to West Berlin",
      "She crawled under the barbed wire on her stomach as the barbs tore her skin",
      "She ran back to her flat when she saw five armed transport police coming",
      "She woke up at 4.45 a.m. to get ready for work at the Plaza Hotel in the West",
      ""
    ],
    "answer": [
      "She crawled under the barbed wire on her stomach as the barbs tore her skin",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "interpretation",
    "unit": "cold_war",
    "topic": "berlin_wall_1961",
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
    "paper": "nov_p1",
    "clues": "- Read Ursula's story to the end of the second paragraph.\n- Look for the moment where she was hurt while crossing."
  },
  {
    "name": "Question 5",
    "question": "Match each detail in Source 1C to the detail in another source that supports it.",
    "metadata": [
      "A - Source 1C: Noffke found the crossing point barred by border police with machine guns",
      "B - Source 1C: Noffke could only wave to his wife and daughter across the barbed-wire divide",
      "C - Source 1C: Noffke's group dug a 200-yard tunnel to smuggle families to the West",
      "D - Source 1C: Noffke's wife was jailed for 'anti-Communist conspiracy'",
      "1 - Source 1B: guards carrying coils of barbed wire cordoned off the street",
      "2 - Source 1A: East Germans grew disillusioned with increasingly oppressive conditions",
      "3 - Source 1B: armed soldiers set up machine guns aimed at the French Sector",
      "4 - Source 1D: soldiers use springs and flying machines to get over the Wall"
    ],
    "answer": [
      "A-3",
      "B-1",
      "C-4",
      "D-2"
    ],
    "presentation": "match",
    "type": "application",
    "unit": "cold_war",
    "topic": "berlin_wall_1961",
    "subtopic": "source_evaluation",
    "skills": [
      "corroborate_evidence_across_sources"
    ],
    "difficulty": 4,
    "exam_weight": 3,
    "xp": 10,
    "order": 5,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Pair by theme first: armed guards, barbed wire, ways of escaping, punishment.\n- Each Source 1C detail has one partner that tells the same story from another angle."
  },
  {
    "name": "Question 6",
    "question": "Source 1B gives 1 yard = 0,914 metres. Use it to convert the 200-yard tunnel in Source 1C to metres.",
    "metadata": [
      "Tunnel length (m): ",
      "[ ]"
    ],
    "answer": [
      "182.8",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "application",
    "unit": "cold_war",
    "topic": "berlin_wall_1961",
    "subtopic": "evidence_extraction",
    "skills": [
      "calculate_from_source_data"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 6,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2024,
    "paper": "nov_p1",
    "keyboard_type": "standard_math",
    "clues": "- Multiply the tunnel length in yards by the conversion factor.\n- Use a decimal point, not a comma."
  },
  {
    "name": "Question 7",
    "question": "In Source 1C, the tunnel was betrayed by Jurgen Henning. What does the source mean by calling him a Stasi 'mole'?",
    "metadata": [
      "A digger who was especially skilled at building tunnels under the Berlin streets",
      "A spy who joined the group secretly and passed information to the Stasi",
      "A border guard who helped people escape to the West during the night",
      "A West Berlin police officer who secretly protected the tunnel-diggers' families",
      ""
    ],
    "answer": [
      "A spy who joined the group secretly and passed information to the Stasi",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "cold_war",
    "topic": "berlin_wall_1961",
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
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- The source explains the word in brackets straight after it.\n- Think about what Henning did with what he learned."
  },
  {
    "name": "Question 8",
    "question": "Arrange these events in the order in which they happened.",
    "metadata": [
      "Hook's cartoon about defecting soldiers appears in The Mercury",
      "The Soviet Union blockades West Berlin, and the Allies respond with an airlift",
      "The Independent publishes Paterson's article on the victims of the Wall",
      "Noffke's tunnel group breaks through and is met by the Stasi",
      "Construction of the Berlin Wall begins early on a Sunday morning"
    ],
    "answer": [
      "The Soviet Union blockades West Berlin, and the Allies respond with an airlift",
      "Construction of the Berlin Wall begins early on a Sunday morning",
      "Hook's cartoon about defecting soldiers appears in The Mercury",
      "Noffke's tunnel group breaks through and is met by the Stasi",
      "The Independent publishes Paterson's article on the victims of the Wall"
    ],
    "presentation": "ordering",
    "type": "interpretation",
    "unit": "cold_war",
    "topic": "berlin_wall_1961",
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
    "paper": "nov_p1",
    "clues": "- The dates are in the source introductions and in the sources themselves.\n- One event is own knowledge: it happened more than ten years before the Wall."
  },
  {
    "name": "Question 9",
    "question": "Which claims about how the Berlin Wall affected the lives of Berliners are supported by the sources?",
    "metadata": [
      "East Berliners who worked in the West could no longer cross to their jobs (Source 1A)",
      "Families were split up, and some could only wave to each other across the wire (Source 1C)",
      "People caught trying to escape could be shot dead or jailed (Source 1C)",
      "West Berliners were forced to move into the Soviet sector of the city (Source 1B)",
      "East German soldiers stopped every escape attempt after the Wall was built (Source 1D)"
    ],
    "answer": [
      "East Berliners who worked in the West could no longer cross to their jobs (Source 1A)",
      "Families were split up, and some could only wave to each other across the wire (Source 1C)",
      "People caught trying to escape could be shot dead or jailed (Source 1C)",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "cold_war",
    "topic": "berlin_wall_1961",
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
    "clues": "- A claim is supported only if the named source actually says or shows it.\n- Watch for options that reverse what a source shows."
  }
];

// ─── AI explanation (AMPM-CONTENT-AI-EXP) — one entry per REAL exam sub-question, against the memo ───

const aiExplanation = {
  sub_questions: [
  {
    "number": "1.1.1",
    "marks": 1,
    "clues": "- The answer is in the very first sentence of Source 1A.\n- Quote a day or a date.",
    "approach": "- Read the opening line of Source 1A.\n- Copy the words that say when construction started.",
    "solution": "1. '… morning of Sunday …' or '… 13 August 1961' earns the mark."
  },
  {
    "number": "1.1.2",
    "marks": 1,
    "clues": "- Look for the words 'a desperate attempt … to'.\n- Quote the purpose, not the method.",
    "approach": "- Find the sentence describing the move by the GDR.\n- Copy the phrase that says what it was meant to stop.",
    "solution": "1. '… to stop East Berliners escaping from the Soviet-controlled East German state into the West of the city …'"
  },
  {
    "number": "1.1.3",
    "marks": 2,
    "clues": "- Think about who owns property and the means of production.\n- Use your own words.",
    "approach": "- Give one clear definition of communism as a political and economic system.\n- Mention ownership or equality.",
    "solution": "1. A classless society in which everyone is equal.\n2. Or: an ideology where the means of production are in the hands of the government.\n3. Or: a system where individual ownership of property is not permitted.\n4. Any one of these earns the 2 marks."
  },
  {
    "number": "1.1.4(a)",
    "marks": 2,
    "clues": "- Credibility means how much people believe in something.\n- What does mass escape say about life in the GDR?",
    "approach": "- Link the fleeing to how the outside world saw the GDR.\n- Give one developed explanation.",
    "solution": "1. People leaving showed that life under the GDR's oppressive economic and political conditions was seen as worthless.\n2. It implied that life in the capitalist West was better than life in the communist East."
  },
  {
    "number": "1.1.4(b)",
    "marks": 2,
    "clues": "- Think about who was leaving: young and skilled workers.\n- What happens to an economy that loses them?",
    "approach": "- Explain the effect of losing workers on the GDR's economy.\n- Give one developed explanation.",
    "solution": "1. Many workers fled, leaving the GDR with fewer skilled workers: a brain drain that destabilised the economy.\n2. Or: job losses and centralised industries with no incentives made the situation worse."
  },
  {
    "number": "1.1.5",
    "marks": 2,
    "clues": "- Look at the last paragraph of Source 1A.\n- Each piece of evidence is a short quoted phrase.",
    "approach": "- Find the list of actions in the 24-hour operation.\n- Copy two separate phrases.",
    "solution": "1. '… the streets of Berlin were torn up …'\n2. '… barricades of paving stones were erected …'\n3. '… tanks were gathered at crucial places …'\n4. '… subways and local railway services were interrupted …'\n5. Any two earn 1 mark each."
  },
  {
    "number": "1.2.1",
    "marks": 3,
    "clues": "- Read only what Hans Peters saw at 2.20 a.m.\n- Three separate incidents, each quoted.",
    "approach": "- Read the first paragraph of Source 1B.\n- Copy three distinct actions he witnessed.",
    "solution": "1. '… six trucks roared towards him …'\n2. '… the street was full of armed soldiers who set up machine guns aimed at the French Sector'\n3. 'Two guards approached carrying coils (rolls) of barbed wire'\n4. '… the squads cordoned off (blocked) the street'\n5. Any three earn 1 mark each."
  },
  {
    "number": "1.2.2",
    "marks": 4,
    "clues": "- The ticket clerk is refusing to sell Ursula a ticket to the West.\n- What had changed overnight?",
    "approach": "- Explain what the words reveal about the border.\n- Give two developed points linked to 13 August 1961.",
    "solution": "1. The border between East and West Berlin had been closed.\n2. There was no longer free movement between East and West: people were trapped on either side.\n3. Cold War tensions between the USSR and the USA had intensified as the border was sealed.\n4. Any two, explained, earn the 4 marks."
  },
  {
    "number": "1.2.3",
    "marks": 4,
    "clues": "- Use the introduction above Source 1B.\n- Who wrote it, and whose accounts does it use?",
    "approach": "- Give two reasons why a historian could trust the account.\n- Link each reason to the source's provenance or to corroboration.",
    "solution": "1. It comes from a book by P Fisher, a historian.\n2. It is based on the eyewitness accounts of Hans Peters and Ursula Heinemann.\n3. The accounts relate to the actual date, 13 August 1961.\n4. The accounts are corroborated by Sources 1A, 1C and 1D.\n5. Any two, explained, earn the 4 marks."
  },
  {
    "number": "1.3",
    "marks": 4,
    "clues": "- Find a detail in Source 1A and the matching detail in Source 1B.\n- Two pairs, each explained.",
    "approach": "- Take a claim from Source 1A about the operation.\n- Show where Source 1B describes the same thing.\n- Repeat for a second pair.",
    "solution": "1. Source 1A says the Wall was to stop East Berliners escaping, and Source 1B shows trips to West Berlin being stopped.\n2. Source 1A mentions tanks at crucial places, and Source 1B mentions tanks, armoured cars and water cannons at the crossings.\n3. Source 1A describes a planned operation dividing Berlin, and Source 1B says that by early morning the city was cut in two.\n4. Any two, explained, earn the 4 marks."
  },
  {
    "number": "1.4.1",
    "marks": 2,
    "clues": "- Read the first paragraph of Source 1C.\n- Quote the reason.",
    "approach": "- Find the sentence saying where Noffke had been that evening.\n- Copy the reason given.",
    "solution": "1. '… he had been visiting relatives …'"
  },
  {
    "number": "1.4.2",
    "marks": 2,
    "clues": "- West Berlin was run by the USA, Britain and France.\n- Think about private ownership and profit.",
    "approach": "- Explain capitalism as an economic system.\n- Link it to West Berlin.",
    "solution": "1. An economic system in the Western Sector supported by capitalist countries (the USA, Britain and France).\n2. Or: a system where individuals could freely make a profit in the Western Sector."
  },
  {
    "number": "1.4.3",
    "marks": 4,
    "clues": "- Digging a 200-yard tunnel was dangerous and illegal in the GDR.\n- What does that willingness tell you?",
    "approach": "- Draw two conclusions about the diggers' motives and the effect of the Wall.\n- Explain each one.",
    "solution": "1. They wanted to escape the brutal communist dictatorship of the GDR.\n2. They believed life in West Berlin was better, economically, than life in the East.\n3. The Wall had separated families, pushing Berliners to take desperate measures to reunite them.\n4. Any two, explained, earn the 4 marks."
  },
  {
    "number": "1.4.4(a)",
    "marks": 1,
    "clues": "- Read what happened when Noffke came out first.\n- Quote it.",
    "approach": "- Find the sentence about Noffke breaking through.\n- Copy what happened to him.",
    "solution": "1. '… instantly machine-gunned to death'"
  },
  {
    "number": "1.4.4(b)",
    "marks": 1,
    "clues": "- Read what happened to the rest of the team.\n- Quote it.",
    "approach": "- Find the sentence after Noffke's death.\n- Copy what happened to his colleagues.",
    "solution": "1. '… were arrested and put on trial for anti-state provocation …'"
  },
  {
    "number": "1.4.4(c)",
    "marks": 1,
    "clues": "- Read the last sentence of Source 1C.\n- One word is enough.",
    "approach": "- Find what happened to Noffke's wife.\n- Copy it.",
    "solution": "1. '… jailed …'"
  },
  {
    "number": "1.5.1",
    "marks": 2,
    "clues": "- Look at what the soldiers in the cartoon are doing.\n- Decide appropriate or not appropriate, then justify.",
    "approach": "- State your verdict on the caption.\n- Support it with a detail from the cartoon.",
    "solution": "1. Appropriate: it shows East Berliners, including soldiers, trying to jump over the Wall to the West for a better life.\n2. Not appropriate: the Wall's message says it protects 'good communists', yet communist soldiers are escaping.\n3. Either verdict, properly explained, earns the 2 marks."
  },
  {
    "number": "1.5.2",
    "marks": 2,
    "clues": "- The signpost faces the soldiers who are leaping the Wall.\n- What is the West saying to them?",
    "approach": "- Explain what the sign implies about the West's attitude.\n- Give one developed point.",
    "solution": "1. The Western Sector encouraged and welcomed defectors from East Berlin.\n2. It implies that the Western Sector was better than the Eastern Sector."
  },
  {
    "number": "1.5.3",
    "marks": 2,
    "clues": "- Look at the two generals' shrugs and expressions.\n- Are they trying to stop anyone?",
    "approach": "- Describe what their body language suggests.\n- Link it to the defections.",
    "solution": "1. They were helpless and could do nothing to stop the defectors.\n2. Or: they were no longer concerned with the soldiers defecting to the West."
  },
  {
    "number": "1.6",
    "marks": 8,
    "clues": "- Use evidence from each source, plus own knowledge.\n- Write an organised paragraph, not a list.",
    "approach": "- Open with why the Wall was built (Source 1A).\n- Describe the immediate effects on 13 August (Sources 1A, 1B).\n- Show the human cost: separated families, escapes, deaths (Sources 1C, 1D).\n- Close with a linking sentence.",
    "solution": "1. The GDR built the Wall on 13 August 1961 to stop East Berliners escaping to the West (Source 1A).\n2. Commuters from the East could no longer reach their jobs in the West (Source 1A).\n3. People shouted and cried when the border closed; some crawled under the wire to escape (Source 1B).\n4. Families were separated, and could only wave to each other across the barbed wire (Source 1C).\n5. Some dug tunnels to reunite families, and those caught were killed or jailed (Source 1C).\n6. Even soldiers risked their lives jumping the Wall to defect (Source 1D).\n7. Own knowledge: Berlin was divided into four zones after 1945; other escapes used cars, sport tours or balloons.\n8. Marks are awarded holistically on a three-level rubric (0–2, 3–5, 6–8)."
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
