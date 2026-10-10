#!/usr/bin/env node
/**
 * DBE History P1 — November 2024 — Question 2 (order 2)
 * Independent Africa, case study Angola: how the SADF's defeat at Cuito Cuanavale led to negotiations (Sources 2A-2D).
 * Source-based question: DESIGN-HIST-01 (same real sources, fresh interpretive-angle practice questions);
 * DESIGN-HIST-02 (the 8-mark paragraph is taught via an objective synthesis item).
 * Memo caution: the memo's 2.4 calls 'Dos Santos' in Source 2C the MPLA leader; 2C names General Antonio dos
 * Santos Franca, not President dos Santos, so neither the practice items nor the explanation repeat it.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 * Typed blanks: numeric only, keyboard_type 'standard_math' on every fitb (KEYBOARD-04, DESIGN-HIST-03).
 *   node tools/validate-questions.js --script scripts/add-history-2024-nov-p1-q2.js --curriculum temp/curriculum-vocab-history-2024.json
 *   node scripts/add-history-2024-nov-p1-q2.js --dry-run
 *   node scripts/add-history-2024-nov-p1-q2.js
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
  "year": 2024,
  "paper": "nov_p1",
  "order": 2,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "cuito_cuanavale",
    "tripartite_accord",
    "cuban_internationalism",
    "angola_civil_war",
    "source_reliability"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2024/nov_p1/q2/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2024/nov_p1/q2/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2024/nov_p1/q2/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2024/nov_p1/q2/memo_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2024/nov_p1/q2/memo_3.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2024/nov_p1/q2/memo_4.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2024/nov_p1/q2/memo_5.png"
  ],
  "exam_question_marks": 50,
  "supplementary_materials": [
    {
      "type": "source",
      "label": "Source 2A",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2024/nov_p1/q2/annexure_2A.png"
      ]
    },
    {
      "type": "source",
      "label": "Source 2B",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2024/nov_p1/q2/annexure_2B.png"
      ]
    },
    {
      "type": "source",
      "label": "Source 2C",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2024/nov_p1/q2/annexure_2C.png"
      ]
    },
    {
      "type": "source",
      "label": "Source 2D",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2024/nov_p1/q2/annexure_2D.png"
      ]
    }
  ]
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "According to Source 2A, the Tripartite Accord gave Cuba [] months to withdraw all its military personnel.",
    "metadata": [
      "Months: ",
      "[ ]"
    ],
    "answer": [
      "30",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "interpretation",
    "unit": "independent_africa",
    "topic": "cuito_cuanavale_1988",
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
    "clues": "- Read the last paragraph of Source 2A.\n- Write the number only."
  },
  {
    "name": "Question 2",
    "question": "How does Goldberg, in Source 2A, describe the scale of the fighting at Cuito Cuanavale?",
    "metadata": [
      "As the first battle that the South African army had ever lost in Africa",
      "As a short border clash that was quickly ended by the United Nations",
      "As the greatest battle on the African continent since World War Two",
      "As the longest battle of the Angolan Civil War since independence in 1975",
      ""
    ],
    "answer": [
      "As the greatest battle on the African continent since World War Two",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "interpretation",
    "unit": "independent_africa",
    "topic": "cuito_cuanavale_1988",
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
    "clues": "- Look at the first paragraph of Source 2A.\n- Goldberg compares the battle with a world war."
  },
  {
    "name": "Question 3",
    "question": "Why should a historian treat Source 2B with caution when researching the Battle of Cuito Cuanavale?",
    "metadata": [
      "It is Fidel Castro's own account, and his Cuban troops fought in the battle",
      "It uses emotive language such as 'fascism', 'puppet government' and 'arrogant bullying'",
      "Its claim about US atomic bombs is not confirmed by any other source in this set",
      "It was written by a South African general who wanted to excuse the SADF's defeat",
      "It is a neutral United Nations report written by observers at the battle"
    ],
    "answer": [
      "It is Fidel Castro's own account, and his Cuban troops fought in the battle",
      "It uses emotive language such as 'fascism', 'puppet government' and 'arrogant bullying'",
      "Its claim about US atomic bombs is not confirmed by any other source in this set",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "independent_africa",
    "topic": "cuito_cuanavale_1988",
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
    "clues": "- Check the introduction: whose biography is this, and what was his role?\n- Look at the tone of the words used to describe the enemy."
  },
  {
    "name": "Question 4",
    "question": "Which statement in Source 2D supports Castro's claim in Source 2B that the enemy had to 'sit down around the negotiating table'?",
    "metadata": [
      "'… crucial in bringing Pretoria to realise that it would have to talk'",
      "'… we were never able to see any but the most junior ministers'",
      "'… the state's response … was … to charge our leadership with treason'",
      "'… the Cuban forces were willing to withdraw shortly after repelling …'",
      ""
    ],
    "answer": [
      "'… crucial in bringing Pretoria to realise that it would have to talk'",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "independent_africa",
    "topic": "cuito_cuanavale_1988",
    "subtopic": "source_evaluation",
    "skills": [
      "corroborate_evidence_across_sources"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Negotiating means talking rather than fighting.\n- Look at the last paragraph of Source 2D."
  },
  {
    "name": "Question 5",
    "question": "The caption of Source 2C names [] people seated at the signing of the Tripartite Accord.",
    "metadata": [
      "People named: ",
      "[ ]"
    ],
    "answer": [
      "8",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "interpretation",
    "unit": "independent_africa",
    "topic": "cuito_cuanavale_1988",
    "subtopic": "evidence_extraction",
    "skills": [
      "extract_numeric_evidence_from_source"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "xp": 10,
    "order": 5,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2024,
    "paper": "nov_p1",
    "keyboard_type": "standard_math",
    "clues": "- Count each name in the 'Seated from left to right' list.\n- Include the UN Secretary General."
  },
  {
    "name": "Question 6",
    "question": "Match each person in Source 2C to the country or organisation they represented.",
    "metadata": [
      "A - General Magnus Malan",
      "B - Javier Perez De Cuellar",
      "C - George Shultz",
      "D - Isidoro Malmierca Peoli",
      "1 - The United Nations",
      "2 - Cuba",
      "3 - The United States",
      "4 - South Africa"
    ],
    "answer": [
      "A-4",
      "B-1",
      "C-3",
      "D-2"
    ],
    "presentation": "match",
    "type": "interpretation",
    "unit": "independent_africa",
    "topic": "cuito_cuanavale_1988",
    "subtopic": "key_figures_and_events",
    "skills": [
      "identify_historical_event_or_term"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 6,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- The caption gives each person's title and country in brackets.\n- One person represents an organisation, not a country."
  },
  {
    "name": "Question 7",
    "question": "Arrange these events in the order in which they happened.",
    "metadata": [
      "The Tripartite Accord is signed in New York",
      "Mandela speaks at a rally in Matanzas, Cuba",
      "South Africa, the FNLA, UNITA and Zairian troops attack the MPLA",
      "Namibia becomes independent",
      "Cuban and Angolan forces confront the SADF and UNITA at Cuito Cuanavale"
    ],
    "answer": [
      "South Africa, the FNLA, UNITA and Zairian troops attack the MPLA",
      "Cuban and Angolan forces confront the SADF and UNITA at Cuito Cuanavale",
      "The Tripartite Accord is signed in New York",
      "Namibia becomes independent",
      "Mandela speaks at a rally in Matanzas, Cuba"
    ],
    "presentation": "ordering",
    "type": "interpretation",
    "unit": "independent_africa",
    "topic": "cuito_cuanavale_1988",
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
    "clues": "- Sources 2A, 2C and 2D give the years 1975, 1987, 1988 and 1991.\n- Namibia's independence (own knowledge) followed the Accord that ensured it."
  },
  {
    "name": "Question 8",
    "question": "Source 2D lists 'the mercenaries' among the forces that attacked the MPLA. What is a mercenary?",
    "metadata": [
      "A soldier sent by the United Nations to keep the peace between armies",
      "A volunteer who fights only to defend the people of his own country",
      "A soldier hired to fight for payment, not for his own country's cause",
      "A secret agent who gathers information for a foreign government",
      ""
    ],
    "answer": [
      "A soldier hired to fight for payment, not for his own country's cause",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "independent_africa",
    "topic": "cuito_cuanavale_1988",
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
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Think about why a mercenary fights.\n- The word comes from the Latin for 'wages'."
  },
  {
    "name": "Question 9",
    "question": "Which claims about how the defeat at Cuito Cuanavale led to negotiations are supported by the sources?",
    "metadata": [
      "The South African army had to withdraw from Cuito Cuanavale (Source 2A)",
      "After the victory, the enemy had to sit down at the negotiating table (Source 2B)",
      "The UN Secretary General was present when the Accord was signed (Source 2C)",
      "The Soviet Union signed the Tripartite Accord alongside Cuba (Source 2C)",
      "The Accord required South Africa to release Mandela at once (Source 2A)"
    ],
    "answer": [
      "The South African army had to withdraw from Cuito Cuanavale (Source 2A)",
      "After the victory, the enemy had to sit down at the negotiating table (Source 2B)",
      "The UN Secretary General was present when the Accord was signed (Source 2C)",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "independent_africa",
    "topic": "cuito_cuanavale_1988",
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
    "clues": "- Check each claim against the source named in brackets.\n- Look at who actually signed the Accord, and what it provided for."
  }
];

// ─── AI explanation (AMPM-CONTENT-AI-EXP) — one entry per REAL exam sub-question, against the memo ───

const aiExplanation = {
  sub_questions: [
  {
    "number": "2.1.1",
    "marks": 4,
    "clues": "- Read the first paragraph of Source 2A.\n- Four forces, from both sides of the battle.",
    "approach": "- List the forces on the Cuban/Angolan side.\n- List the forces on the South African side.",
    "solution": "1. 'Cuban'\n2. 'Angolan military forces'\n3. 'South African forces'\n4. 'National Union for the Total Independence of Angola' (UNITA)\n5. Each force earns 1 mark."
  },
  {
    "number": "2.1.2",
    "marks": 2,
    "clues": "- The source links sovereignty to Angola's independence.\n- Think about control by outsiders.",
    "approach": "- Define sovereignty in your own words.\n- Mention freedom from outside control.",
    "solution": "1. A state of having total control over oneself, an organisation or a country.\n2. Or: being free from control by another person, organisation, government or foreign power."
  },
  {
    "number": "2.1.3",
    "marks": 2,
    "clues": "- Air superiority means control of the skies.\n- What did that mean for the SADF on the ground?",
    "approach": "- Link Soviet radar and fighter aircraft to the outcome.\n- Give one developed point.",
    "solution": "1. It led to the defeat of the SADF.\n2. It assured victory for the MPLA.\n3. It helped defend Angola's socialist government against a capitalist takeover through SA, the USA and UNITA."
  },
  {
    "number": "2.1.4",
    "marks": 2,
    "clues": "- Think about apartheid's idea of white superiority.\n- What did the battle prove about it?",
    "approach": "- Explain the psychological effect.\n- Link it to southern Africa.",
    "solution": "1. The notion of white superiority was destroyed.\n2. It was a psychological boost for liberation movements and for Africans.\n3. It opened the way for countries such as Namibia to gain independence from South Africa."
  },
  {
    "number": "2.1.5",
    "marks": 4,
    "clues": "- Who is Goldberg, and which side was he on?\n- Look at whose role the source emphasises.",
    "approach": "- Give two limitations linked to authorship or one-sidedness.\n- Explain each.",
    "solution": "1. It was written by D Goldberg, an anti-apartheid activist, so it may be biased and one-sided.\n2. It highlights only the MPLA's and its allies' victory.\n3. Its language is biased against South Africa and the USA, and stresses the Cuban and Soviet contribution.\n4. Any two, explained, earn the 4 marks."
  },
  {
    "number": "2.2.1",
    "marks": 2,
    "clues": "- Read the first sentence of Source 2B.\n- Two short quoted reasons.",
    "approach": "- Find what the covert plan was meant to do.\n- Copy two separate aims.",
    "solution": "1. '… to crush the legitimate interests of the Angolan people …'\n2. '… [to] impose a puppet government …'"
  },
  {
    "number": "2.2.2",
    "marks": 2,
    "clues": "- Think about where South Africa and Zaire lay in relation to Angola.\n- Why would the USA avoid fighting itself?",
    "approach": "- Explain the USA's use of allies to fight for it.\n- Give one developed reason.",
    "solution": "1. To use them as proxies so that the USA was not directly involved.\n2. South Africa and the Congo (Zaire) were close to Angola.\n3. Both supported capitalism and opposed communism."
  },
  {
    "number": "2.2.3",
    "marks": 2,
    "clues": "- What could a superpower give that Cuba could not?\n- Think about arms and supplies.",
    "approach": "- Explain the value of Soviet support.\n- Give one developed reason.",
    "solution": "1. The Soviet Union offered technical and military support and strategy.\n2. It gave strong backing because it was one of the superpowers."
  },
  {
    "number": "2.2.4",
    "marks": 2,
    "clues": "- Read the last paragraph of Source 2B.\n- Two short quotes about the military situation.",
    "approach": "- Find what forced the enemy to negotiate.\n- Copy two pieces of evidence.",
    "solution": "1. 'The overwhelming victory at Cuito Cuanavale …'\n2. '… the withering (humiliating) advance by the powerful front of Cuban troops in south-western Angola'"
  },
  {
    "number": "2.3.1",
    "marks": 2,
    "clues": "- Who took the photograph, and at what event?\n- Think about recording a historic moment.",
    "approach": "- Explain the photograph's purpose.\n- Give one developed reason.",
    "solution": "1. To show the UN's role in mediating peace in Angola after Cuito Cuanavale.\n2. To record the countries and representatives present at the signing of the Tripartite Accord."
  },
  {
    "number": "2.3.2",
    "marks": 4,
    "clues": "- Think about what the UN's presence added to the agreement.\n- Two developed points.",
    "approach": "- Explain the UN's role as mediator.\n- Explain what its presence meant for international recognition.",
    "solution": "1. To facilitate and mediate the smooth signing of the Accord.\n2. To show that the Accord would be internationally recognised and valid.\n3. To uphold the UN's mandate to preserve world peace.\n4. Any two, explained, earn the 4 marks."
  },
  {
    "number": "2.4",
    "marks": 4,
    "clues": "- Find what Source 2A says about the Accord, then look at Source 2C.\n- Two pairs, each explained.",
    "approach": "- Match the countries named in Source 2A to the people in Source 2C.\n- Match the date and place of signing.",
    "solution": "1. Source 2A names Angola, Cuba and South Africa as the signatories, and Source 2C shows their representatives signing.\n2. Both sources refer to the signing of the Tripartite Accord in 1988.\n3. Source 2A says the Angolan government remained in office, and Source 2C shows Angola's representatives at the signing.\n4. Any two, explained, earn the 4 marks."
  },
  {
    "number": "2.5.1",
    "marks": 2,
    "clues": "- Read the first paragraph of Source 2D.\n- Two forces in the combined attack.",
    "approach": "- Find the list of attackers in 1975.\n- Copy any two.",
    "solution": "1. '… South Africa …'\n2. '… Central Intelligence Agency (CIA) …'\n3. '… National Liberation Front of Angola (FNLA) …'\n4. '… the mercenaries …'\n5. '… UNITA …'\n6. '… Zairian troops …'\n7. Any two earn 1 mark each."
  },
  {
    "number": "2.5.2",
    "marks": 4,
    "clues": "- Why would Mandela call the battle 'historic'?\n- Think about its effects in the region.",
    "approach": "- Explain two consequences of the SADF's defeat.\n- Use the source and your own knowledge.",
    "solution": "1. It made it possible for Angola to secure its independence.\n2. The defeat of the SADF was a major victory for Cuba and Angola.\n3. It ended SADF disruption in Angola.\n4. It led to negotiations that paved the way for political stability in southern Africa.\n5. Any two, explained, earn the 4 marks."
  },
  {
    "number": "2.5.3(a)",
    "marks": 1,
    "clues": "- Read the last paragraph of Source 2D.\n- Who would the Western governments let Mandela meet?",
    "approach": "- Find the Western response.\n- Quote it.",
    "solution": "1. '… we were never able to see any but the most junior ministers …'"
  },
  {
    "number": "2.5.3(b)",
    "marks": 1,
    "clues": "- Contrast Cuba's response with the West's.\n- Quote it.",
    "approach": "- Find the Cuban response.\n- Quote it.",
    "solution": "1. '… we were received by the highest officials …' or '… immediately offered whatever we wanted and needed …'"
  },
  {
    "number": "2.5.4",
    "marks": 2,
    "clues": "- Cuba sent troops and aid far beyond its own borders.\n- Think about solidarity.",
    "approach": "- Explain internationalism in Cuba's foreign policy.\n- Give one developed explanation.",
    "solution": "1. A Cuban foreign policy of supporting other socialist and liberation movements abroad.\n2. Or: the belief that solidarity among communists should be defended worldwide."
  },
  {
    "number": "2.6",
    "marks": 8,
    "clues": "- Use evidence from each source, plus own knowledge.\n- Build a causal chain from defeat to negotiation.",
    "approach": "- Start with the defeat of the SADF (Source 2A).\n- Explain how it forced talks (Sources 2B, 2D).\n- Describe the Accord and the UN's role (Sources 2A, 2C).\n- Close with the wider effects in southern Africa.",
    "solution": "1. The defeat of the SADF at Cuito Cuanavale was a turning point that started negotiations (Source 2A).\n2. Cuba's victory, with Soviet support, forced South Africa to the negotiating table (Source 2B).\n3. The UN facilitated the signing of the Tripartite Accord in December 1988 (Source 2C).\n4. The Accord ensured Namibia's independence and the withdrawal of Cuban troops (Source 2A).\n5. The defeat reduced Pretoria's capacity to destabilise its neighbours and helped bring it to talk (Source 2D).\n6. Own knowledge: it raised Cuba's status in southern Africa and was a setback for the capitalist bloc.\n7. Marks are awarded holistically on a three-level rubric (0–2, 3–5, 6–8)."
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
