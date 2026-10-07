#!/usr/bin/env node
/**
 * DBE History P1 — November 2025 — Question 1 (order 1)
 * The Cold War: the policy of containment and Cold War tensions, 1947 (Sources 1A-1D).
 * Source-based question: DESIGN-HIST-01 (same real sources, fresh interpretive-angle practice questions);
 * DESIGN-HIST-02 (the 8-mark paragraph is taught via an objective synthesis item).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 * Typed blanks: numeric only, keyboard_type 'standard_math' on every fitb (KEYBOARD-04, DESIGN-HIST-03).
 *   node tools/validate-questions.js --script scripts/add-history-2025-nov-p1-q1.js --curriculum temp/curriculum-vocab-history.json
 *   node scripts/add-history-2025-nov-p1-q1.js --dry-run
 *   node scripts/add-history-2025-nov-p1-q1.js
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
  "year": 2025,
  "paper": "nov_p1",
  "order": 1,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "containment_policy",
    "marshall_plan",
    "molotov_plan",
    "iron_curtain",
    "source_reliability"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2025/nov_p1/q1/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2025/nov_p1/q1/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2025/nov_p1/q1/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2025/nov_p1/q1/memo_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2025/nov_p1/q1/memo_3.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2025/nov_p1/q1/memo_4.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2025/nov_p1/q1/memo_5.png"
  ],
  "exam_question_marks": 50,
  "supplementary_materials": [
    {
      "type": "source",
      "label": "Source 1A",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2025/nov_p1/q1/annexure_1A.png"
      ]
    },
    {
      "type": "source",
      "label": "Source 1B",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2025/nov_p1/q1/annexure_1B.png"
      ]
    },
    {
      "type": "source",
      "label": "Source 1C",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2025/nov_p1/q1/annexure_1C.png"
      ]
    },
    {
      "type": "source",
      "label": "Source 1D",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2025/nov_p1/q1/annexure_1D.png"
      ]
    }
  ]
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Churchill delivered his 'Iron Curtain' speech in the year [].",
    "metadata": [
      "Year of the speech: ",
      "[ ]"
    ],
    "answer": [
      "1946",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "interpretation",
    "unit": "cold_war",
    "topic": "containment_policy_1947",
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
    "clues": "- The year is printed in the introduction above Source 1A, not in the speech itself.\n- Write the four digits only."
  },
  {
    "name": "Question 2",
    "question": "In Source 1A, Churchill marks out the Iron Curtain as running between which two places?",
    "metadata": [
      "From Berlin to Vienna",
      "From Moscow to Warsaw",
      "From Stettin in the Baltic to Trieste in the Adriatic",
      "From Leningrad to Odessa",
      ""
    ],
    "answer": [
      "From Stettin in the Baltic to Trieste in the Adriatic",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "interpretation",
    "unit": "cold_war",
    "topic": "containment_policy_1947",
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
    "clues": "- Churchill names two seas to mark the ends of his line, one in the north and one in the south of the continent.\n- Look at the first sentence of the third paragraph."
  },
  {
    "name": "Question 3",
    "question": "Which features of Source 1A could limit its usefulness to a historian studying the origins of the Cold War?",
    "metadata": [
      "It is a persuasive speech by a Western politician, delivered to an American audience",
      "It presents only Churchill's own view of Soviet intentions, not a Soviet account",
      "Churchill was a former Prime Minister and no longer spoke for the British government",
      "It was written decades later by a historian looking back on the period",
      "It was delivered in Moscow to a Soviet audience"
    ],
    "answer": [
      "It is a persuasive speech by a Western politician, delivered to an American audience",
      "It presents only Churchill's own view of Soviet intentions, not a Soviet account",
      "Churchill was a former Prime Minister and no longer spoke for the British government",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "cold_war",
    "topic": "containment_policy_1947",
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
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Ask who is speaking, to whom, and for what purpose.\n- Ask whose side of the story is missing from the extract."
  },
  {
    "name": "Question 4",
    "question": "In Source 1B, the fence posts marked GREECE and TURKEY are being hammered into the ground. What does the cartoonist suggest US aid was doing for these countries?",
    "metadata": [
      "Punishing them for having communist governments",
      "Strengthening their defences against communist infiltration",
      "Paying for American military bases on their land",
      "Drawing them into the Soviet sphere of influence",
      ""
    ],
    "answer": [
      "Strengthening their defences against communist infiltration",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "interpretation",
    "unit": "cold_war",
    "topic": "containment_policy_1947",
    "subtopic": "evidence_extraction",
    "skills": [
      "interpret_political_cartoon_symbolism"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Look at what is on the far side of the fence from the dark shape.\n- A fence marks a boundary that something is not meant to cross."
  },
  {
    "name": "Question 5",
    "question": "Match each detail in Source 1C to the detail in another source that mirrors it.",
    "metadata": [
      "A - Source 1C: the Marshall Plan aimed to rebuild Europe's broken economies",
      "B - Source 1C: the USA pressed Marshall Plan countries towards European integration",
      "C - Source 1C: the Soviet Union was seen as expansionist and hostile",
      "D - Source 1C: Turkey and Greece were to guard the eastern Mediterranean",
      "1 - Source 1D: the Molotov Plan aimed to rebuild Eastern European economies tied to the USSR",
      "2 - Source 1D: the USSR created COMECON, an economic alliance of socialist countries",
      "3 - Source 1D: the USSR saw the Marshall Plan as an attempt to weaken its hold on its satellite states",
      "4 - Source 1B: US aid is shown as fence posts strengthening Greece and Turkey"
    ],
    "answer": [
      "A-1",
      "B-2",
      "C-3",
      "D-4"
    ],
    "presentation": "match",
    "type": "application",
    "unit": "cold_war",
    "topic": "containment_policy_1947",
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
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Each Source 1C detail has a counterpart in another source that tells the same story from the other side or from a different angle.\n- Pair by topic first (economies, alliances, fear, geography)."
  },
  {
    "name": "Question 6",
    "question": "Arrange these events in the order in which they happened.",
    "metadata": [
      "The Soviet Union rejects the Marshall Plan and proposes the Molotov Plan",
      "Churchill delivers his 'Iron Curtain' speech in Fulton, Missouri",
      "COMECON is formed as a Soviet-led economic organisation",
      "The USA proposes the Marshall Plan to rebuild Europe's economies",
      "The USA offers financial aid to Greece and Turkey to resist communism"
    ],
    "answer": [
      "Churchill delivers his 'Iron Curtain' speech in Fulton, Missouri",
      "The USA offers financial aid to Greece and Turkey to resist communism",
      "The USA proposes the Marshall Plan to rebuild Europe's economies",
      "The Soviet Union rejects the Marshall Plan and proposes the Molotov Plan",
      "COMECON is formed as a Soviet-led economic organisation"
    ],
    "presentation": "ordering",
    "type": "interpretation",
    "unit": "cold_war",
    "topic": "containment_policy_1947",
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
    "clues": "- The dates printed in the source introductions (1946, 1947) and the COMECON footnote anchor most of the sequence.\n- The Soviet plan was a response to the American one, not the other way round."
  },
  {
    "name": "Question 7",
    "question": "According to Source 1C, [] countries are named as included in the Marshall Plan because of where they lay on a map.",
    "metadata": [
      "Countries named: ",
      "[ ]"
    ],
    "answer": [
      "6",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "interpretation",
    "unit": "cold_war",
    "topic": "containment_policy_1947",
    "subtopic": "evidence_extraction",
    "skills": [
      "extract_numeric_evidence_from_source"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "xp": 10,
    "order": 7,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2025,
    "paper": "nov_p1",
    "keyboard_type": "standard_math",
    "clues": "- Find the sentence about 'a swift glance at a map'.\n- Count the countries in the list that follows; write the number only."
  },
  {
    "name": "Question 8",
    "question": "Historians say US containment policy was influenced by the Domino Theory. What did this theory claim?",
    "metadata": [
      "If one country fell to communism, its neighbours would be likely to follow",
      "If the Soviet Union collapsed, all other communist states would also collapse",
      "If one member of an alliance was attacked, all members would respond",
      "If Europe's economies were rebuilt, communism would disappear everywhere",
      ""
    ],
    "answer": [
      "If one country fell to communism, its neighbours would be likely to follow",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "cold_war",
    "topic": "containment_policy_1947",
    "subtopic": "historical_terminology",
    "skills": [
      "define_historical_term"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 8,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Picture a row of dominoes standing close together.\n- The idea concerns what happens to the countries next door."
  },
  {
    "name": "Question 9",
    "question": "Which claims about how containment raised Cold War tensions in 1947 are supported by the sources?",
    "metadata": [
      "The USA offered economic aid to states it feared would turn communist (Source 1B)",
      "The USA wanted an integrated Western Europe to act as a barrier to Soviet expansion (Source 1C)",
      "The Soviet Union answered the Marshall Plan by organising its own aid system for its allies (Source 1D)",
      "The Soviet Union accepted Marshall Plan aid but demanded changes to its conditions (Source 1D)",
      "The USA used its army to occupy Greece and Turkey (Source 1B)"
    ],
    "answer": [
      "The USA offered economic aid to states it feared would turn communist (Source 1B)",
      "The USA wanted an integrated Western Europe to act as a barrier to Soviet expansion (Source 1C)",
      "The Soviet Union answered the Marshall Plan by organising its own aid system for its allies (Source 1D)",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "cold_war",
    "topic": "containment_policy_1947",
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
    "clues": "- A claim is only supported if the named source actually says or shows it.\n- Watch for options that reverse what a source says."
  }
];

// ─── AI explanation (AMPM-CONTENT-AI-EXP) — one entry per REAL exam sub-question, against the memo ───

const aiExplanation = {
  sub_questions: [
  {
    "number": "1.1.1",
    "marks": 2,
    "clues": "- - Churchill names the parties he sees behind the 'shadow' in the opening lines.\n- - Answers are short quoted phrases.",
    "approach": "- - Re-read the first sentence and the one after it.\n- - Pick two separate parties named as responsible.\n- - Copy each phrase exactly.",
    "solution": "1. Source 1A names '… Soviet Russia …' as the first party.\n2. It also names '… its communist international organisation …' as the second party.\n3. Each quoted phrase earns 1 mark."
  },
  {
    "number": "1.1.2",
    "marks": 2,
    "clues": "- - Look at what Churchill says about the Russian people and Stalin before he criticises.\n- - Think about who had just fought on the same side in the Second World War.",
    "approach": "- - Identify the praise and understanding Churchill offers the Soviet Union.\n- - Link it to the wartime alliance and Soviet security fears.\n- - Give one developed reason.",
    "solution": "1. Churchill recognised that the Soviet Union wanted secure western borders, free from any future German threat.\n2. Stalin and the USSR had been wartime allies, and Churchill still valued their role in keeping the peace.\n3. He supported closer contact between the Soviet and British peoples, hoping to avoid another world conflict.\n4. Any one of these, explained, earns the 2 marks."
  },
  {
    "number": "1.1.3",
    "marks": 2,
    "clues": "- - Think of a boundary that cannot be seen on a map but divides two worlds.\n- - Say what it separated, in your own words.",
    "approach": "- - Explain 'Iron Curtain' as a symbolic rather than physical barrier.\n- - State which two groups of countries it divided.",
    "solution": "1. It was a symbolic barrier that divided Europe after the Second World War.\n2. It was an imaginary line of political and ideological separation between the communist Eastern bloc and the capitalist Western democracies."
  },
  {
    "number": "1.1.4",
    "marks": 2,
    "clues": "- - Read the list of cities and what Churchill says about who influences them.\n- - 'Sphere' means an area of control or influence.",
    "approach": "- - Identify the cities named and the power Churchill says they are subject to.\n- - State what this implies about the countries' freedom.",
    "solution": "1. Some European countries had been taken over by communism.\n2. Eastern European countries were cut off from the West and increasingly controlled by the Soviet Union.\n3. The communist sphere of influence had spread over Eastern Europe."
  },
  {
    "number": "1.1.5",
    "marks": 4,
    "clues": "- - Check who delivered the speech, when and where it was given, and how it was published.\n- - You need two developed reasons, each worth 2 marks.",
    "approach": "- - Use the introduction above the source for provenance.\n- - Link each reason to why a historian could trust the evidence.\n- - Make two separate points.",
    "solution": "1. It is first-hand evidence: a speech by Britain's former Prime Minister, Winston Churchill.\n2. Churchill spoke as a respected world leader, so his words carried weight.\n3. The date, 5 March 1946, is just after the Second World War, when Soviet influence was spreading.\n4. It is an iconic speech, published worldwide and included in Chambers Book of Great Speeches.\n5. Any two of these, explained, earn the 4 marks."
  },
  {
    "number": "1.2.1(a)",
    "marks": 2,
    "clues": "- - The dark shape is labelled with the threat it stands for.\n- - Think about what spreading communism meant to the cartoonist.",
    "approach": "- - Read the label on the shape.\n- - Say what the shape represents in 1947 Europe.",
    "solution": "1. It represents the threat posed by the Soviet Union's spread of communism.\n2. It can also stand for Stalin's creation of a sphere of influence in Eastern Europe, and the spread of authoritarian, dictatorial government."
  },
  {
    "number": "1.2.1(b)",
    "marks": 2,
    "clues": "- - The hammer is marked 'U.S. AID'. What is it being used to do to the fence?\n- - Think of what the USA was offering Greece and Turkey.",
    "approach": "- - Identify what the hammer is striking.\n- - Link the aid to the purpose of the fence.",
    "solution": "1. It symbolises financial assistance to Greece to prevent a communist takeover.\n2. It also stands for strengthening borders to stop communist infiltration, and for the Marshall Plan preventing communism spreading to Western Europe.\n3. Truman's request for aid granted by the US Congress is a further acceptable point."
  },
  {
    "number": "1.2.2",
    "marks": 2,
    "clues": "- - Think about both meanings of 'driving' here: hammering a post and driving towards a goal.\n- - Relate the caption to what the picture shows the USA doing.",
    "approach": "- - Explain what the USA was 'driving at', i.e. aiming for.\n- - Tie it to the aid being hammered in.",
    "solution": "1. It captures the USA's intention of curbing communist infiltration into Western Europe.\n2. It captures the USA's financial aid to Western European countries to contain the spread of communism."
  },
  {
    "number": "1.3",
    "marks": 4,
    "clues": "- - Pair a specific statement in Source 1A with a specific visual detail in Source 1B, rather than comparing in general terms.\n- - Two pairs, each explained.",
    "approach": "- - Take a claim from Source 1A about Soviet expansion or control.\n- - Find the detail in Source 1B that shows the same threat.\n- - Explain how they support each other; repeat for a second pair.",
    "solution": "1. Source 1A speaks of unknown, expansive Soviet intentions, and Source 1B shows communist threats heading towards small non-communist nations.\n2. Source 1A says Eastern European cities are under growing Soviet control, and Source 1B shows the growing communist threat to Greece and Turkey.\n3. Both sources are against the threat of communist infiltration.\n4. Any two of these pairings, explained, earn the 4 marks."
  },
  {
    "number": "1.4.1",
    "marks": 2,
    "clues": "- - The first concern is introduced by the words 'First of all'.\n- - Quote, rather than paraphrase.",
    "approach": "- - Find the opening sentence of Source 1C.\n- - Copy the phrase that explains the first concern.",
    "solution": "1. '… broken economies might foster the growth of communism much like mulch (compost) fosters mushrooms …'"
  },
  {
    "number": "1.4.2",
    "marks": 2,
    "clues": "- - Look for two descriptions of how the Soviet Union was perceived.\n- - Each is a short quoted phrase.",
    "approach": "- - Locate the sentence beginning 'A second major goal'.\n- - Select two phrases about expansion and hostility.",
    "solution": "1. '… perceived (seen) as having embarked on active expansion …'\n2. '… being irremediably (severely) hostile to the United States'"
  },
  {
    "number": "1.4.3",
    "marks": 2,
    "clues": "- - The third goal is introduced in the second paragraph, where two aims 'came together'.\n- - Two short quotations.",
    "approach": "- - Read the first sentence of the second paragraph.\n- - Pick the two aims that combined into the third goal.",
    "solution": "1. 'The need to contain the Soviet Union …'\n2. '… the desire to rebuild the European economy …'"
  },
  {
    "number": "1.4.4",
    "marks": 4,
    "clues": "- - Think about what European countries would do together, and what that would achieve against the Soviet Union.\n- - Two developed implications.",
    "approach": "- - Unpack 'integration' as working together politically and economically.\n- - Link it to containment: a united Europe resists Soviet expansion.\n- - Explain two separate implications.",
    "solution": "1. European countries would work together politically and economically under capitalism.\n2. This would stop the Soviet Union from infiltrating Europe.\n3. It would strengthen Europe financially and so halt the spread of communism.\n4. It would support long-term European unity against the threat of communism.\n5. Any two of these, explained, earn the 4 marks."
  },
  {
    "number": "1.5.1",
    "marks": 2,
    "clues": "- - The opening sentence describes the Molotov Plan's purpose.\n- - Think of it as the Soviet counterpart to an American plan.",
    "approach": "- - Read the first sentence of Source 1D.\n- - Quote or paraphrase the purpose.",
    "solution": "1. It was created to provide aid to rebuild countries in Eastern Europe that were politically and economically aligned with the Soviet Union.\n2. It can be seen as the USSR's version of the Marshall Plan."
  },
  {
    "number": "1.5.2",
    "marks": 2,
    "clues": "- - The Soviet reasons are about what the Marshall Plan might do to the satellite states.\n- - Two short quotations.",
    "approach": "- - Find the sentence that gives the Soviet belief about the Plan.\n- - Select two reasons from it.",
    "solution": "1. '… belief that the Plan was an attempt to weaken Soviet interest in their satellite states …'\n2. '… making beneficiary (receiving) countries economically dependent on the United States'"
  },
  {
    "number": "1.5.3",
    "marks": 2,
    "clues": "- - The footnote and context in Source 1D hint at which countries these were.\n- - Explain in your own words.",
    "approach": "- - Identify which countries were meant.\n- - Say what controlled them.",
    "solution": "1. Eastern European countries that were controlled by the Soviet Union and influenced by communism during the Cold War."
  },
  {
    "number": "1.5.4",
    "marks": 4,
    "clues": "- - Use the source and your own knowledge: what did COMECON give its members instead of Marshall aid?\n- - Two developed points.",
    "approach": "- - Link COMECON to the Molotov Plan's aim.\n- - Consider economic benefits and security for its members.\n- - Explain two distinct offerings.",
    "solution": "1. Financial support, so that members would not join the Marshall Plan.\n2. Integration between satellite states and the USSR: an economic alliance and trading among communist states to rebuild their economies.\n3. Security against capitalist or economic domination.\n4. Any two of these, explained, earn the 4 marks."
  },
  {
    "number": "1.6",
    "marks": 8,
    "clues": "- - Use at least one point from each source plus own knowledge, for example the Domino Theory.\n- - Write a short, organised paragraph, not a list.",
    "approach": "- - Open with Churchill's warning about Soviet expansion (Source 1A).\n- - Move to US containment through aid and the Marshall Plan (Sources 1B and 1C).\n- - Close with the Soviet response, the Molotov Plan and COMECON (Source 1D), and how it raised tension.",
    "solution": "1. Churchill's Fulton speech in 1946 warned of Soviet expansion and an Iron Curtain dividing Europe (Source 1A).\n2. The USA feared that communism would spread, including through the Domino Theory (own knowledge), and adopted containment (Source 1B).\n3. It gave financial aid to Greece and Turkey (Source 1B) and used the Marshall Plan to rebuild Western Europe (Source 1C).\n4. The USA pressed for European integration as a barrier to Soviet expansion (Source 1C).\n5. The USSR responded with the Molotov Plan in 1947 and COMECON to aid Eastern Europe (Source 1D).\n6. This rivalry between two aid systems intensified Cold War tensions between the USA and the USSR (own knowledge).\n7. Marks are awarded holistically on a three-level rubric (0–2, 3–5, 6–8)."
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
