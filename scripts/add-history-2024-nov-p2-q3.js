#!/usr/bin/env node
/**
 * DBE History P2 — November 2024 — Question 3 (order 3)
 * End of the Cold War and a New World Order: why was there resistance to Walmart's expansion into South Africa in 2011? (Sources 3A-3D).
 * Source-based question: DESIGN-HIST-01 (same real sources, fresh angles); DESIGN-HIST-02 (3.6 taught via an objective ordering item).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 * Typed blanks: numeric only, keyboard_type 'standard_math' on every fitb (KEYBOARD-04, DESIGN-HIST-03).
 *   node tools/validate-questions.js --script scripts/add-history-2024-nov-p2-q3.js --curriculum temp/curriculum-vocab-history-p2-2024.json
 *   node scripts/add-history-2024-nov-p2-q3.js --dry-run
 *   node scripts/add-history-2024-nov-p2-q3.js
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
  "paper": "nov_p2",
  "order": 3,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "globalisation",
    "multinational_corporations",
    "trade_union_mobilisation",
    "protectionism",
    "source_reliability"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2024/nov_p2/q3/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2024/nov_p2/q3/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2024/nov_p2/q3/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2024/nov_p2/q3/memo_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2024/nov_p2/q3/memo_3.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2024/nov_p2/q3/memo_4.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2024/nov_p2/q3/memo_5.png"
  ],
  "exam_question_marks": 50,
  "supplementary_materials": [
    {
      "type": "source",
      "label": "Source 3A",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2024/nov_p2/q3/annexure_3A.png"
      ]
    },
    {
      "type": "source",
      "label": "Source 3B",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2024/nov_p2/q3/annexure_3B.png"
      ]
    },
    {
      "type": "source",
      "label": "Source 3C",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2024/nov_p2/q3/annexure_3C.png"
      ]
    },
    {
      "type": "source",
      "label": "Source 3D",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2024/nov_p2/q3/annexure_3D.png"
      ]
    }
  ]
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "According to Source 3A, the USA accounts for only [] per cent of the world's population.",
    "metadata": [
      "Per cent: ",
      "[ ]"
    ],
    "answer": [
      "4",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "interpretation",
    "unit": "end_of_cold_war_new_world_order",
    "topic": "globalisation_walmart_resistance",
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
    "clues": "- Look at the third paragraph of Source 3A.\n- Write the number only."
  },
  {
    "name": "Question 2",
    "question": "According to Source 3A, Walmart began globalising in the year [].",
    "metadata": [
      "Year: ",
      "[ ]"
    ],
    "answer": [
      "1991",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "interpretation",
    "unit": "end_of_cold_war_new_world_order",
    "topic": "globalisation_walmart_resistance",
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
    "clues": "- The year is in the same paragraph as the USA's share of the world population.\n- Write four digits."
  },
  {
    "name": "Question 3",
    "question": "Which union's members are shown protesting outside the Department of Trade and Industry in Source 3B?",
    "metadata": [
      "The Southern African Clothing and Textile Workers' Union (SACTWU)",
      "The Congress of South African Trade Unions (COSATU)",
      "The South African Commercial and Catering Workers' Union (SACCAWU)",
      "The National Union of Metalworkers of South Africa (NUMSA)",
      ""
    ],
    "answer": [
      "The South African Commercial and Catering Workers' Union (SACCAWU)",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "interpretation",
    "unit": "end_of_cold_war_new_world_order",
    "topic": "globalisation_walmart_resistance",
    "subtopic": "evidence_extraction",
    "skills": [
      "interpret_photograph_evidence"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Read the introduction above the photograph.\n- Another union in this question made a submission to Parliament rather than protesting."
  },
  {
    "name": "Question 4",
    "question": "How does Source 3D relate to SACTWU's concern in Source 3C?",
    "metadata": [
      "Source 3D says Walmart was kept out of the country, so it contradicts Source 3C",
      "Both fear that Walmart's buying network could shut local producers out of the market",
      "Both welcome Walmart because its lower prices would mainly benefit ordinary local consumers",
      "Source 3D says only perishable food would be imported, so it contradicts Source 3C",
      ""
    ],
    "answer": [
      "Both fear that Walmart's buying network could shut local producers out of the market",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "end_of_cold_war_new_world_order",
    "topic": "globalisation_walmart_resistance",
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
    "paper": "nov_p2",
    "clues": "- Compare what each source says would happen to local suppliers and manufacturers.\n- Check which option Source 3D actually followed: keep Walmart out, or let it in?"
  },
  {
    "name": "Question 5",
    "question": "According to Source 3C, which effects did SACTWU expect Walmart's presence to have?",
    "metadata": [
      "Domestic manufacturers supplying the retail sector would be shut out",
      "Retail workers would earn higher wages because of greater competition",
      "Job losses, particularly amongst black workers",
      "Greater demand for locally-produced products in the retail sector",
      "Small and historically disadvantaged businesses becoming less competitive"
    ],
    "answer": [
      "Domestic manufacturers supplying the retail sector would be shut out",
      "Job losses, particularly amongst black workers",
      "Small and historically disadvantaged businesses becoming less competitive",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "interpretation",
    "unit": "end_of_cold_war_new_world_order",
    "topic": "globalisation_walmart_resistance",
    "subtopic": "evidence_extraction",
    "skills": [
      "identify_evidence_from_a_source"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 5,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Read the list after \"This shall have the effect of causing\".\n- Two options say the opposite of what SACTWU feared."
  },
  {
    "name": "Question 6",
    "question": "Source 3A gives \"economies of scale\" as a reason companies expand across borders. What does the term mean?",
    "metadata": [
      "Government subsidies paid to firms that export more goods than they import each year",
      "Trade agreements that remove taxes on goods moving between countries",
      "Cheaper labour gained by moving factories to countries with lower wages",
      "A lower cost per item that comes from producing or buying in very large amounts",
      ""
    ],
    "answer": [
      "A lower cost per item that comes from producing or buying in very large amounts",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "end_of_cold_war_new_world_order",
    "topic": "globalisation_walmart_resistance",
    "subtopic": "historical_terminology",
    "skills": [
      "define_historical_term"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 6,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- \"Scale\" refers to size.\n- Think about why a very large retailer can sell more cheaply than a small one."
  },
  {
    "name": "Question 7",
    "question": "Match each organisation to its role in the Walmart debate.",
    "metadata": [
      "A - Walmart",
      "B - Massmart",
      "C - SACTWU",
      "D - Competition Commission",
      "1 - South African retail group that Walmart merged with",
      "2 - Regulator that briefed Parliament on conditions for suppliers",
      "3 - US multinational retailer seeking to enter South Africa",
      "4 - Textile workers' union that made a submission to Parliament"
    ],
    "answer": [
      "A-3",
      "B-1",
      "C-4",
      "D-2"
    ],
    "presentation": "match",
    "type": "interpretation",
    "unit": "end_of_cold_war_new_world_order",
    "topic": "globalisation_walmart_resistance",
    "subtopic": "key_figures_and_events",
    "skills": [
      "identify_historical_event_or_term"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 7,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Two are companies and two are not.\n- Use the introductions above Sources 3B, 3C and 3D."
  },
  {
    "name": "Question 8",
    "question": "Source 3D comes from the Competition Commission. Why is it a useful balance to Sources 3B and 3C?",
    "metadata": [
      "It gives the view of an official regulator rather than a trade union",
      "It was written by Walmart's head office to advertise the merger",
      "It is a photograph, so it shows the events exactly as they happened",
      "It was written before the merger was proposed, so it avoids the debate",
      ""
    ],
    "answer": [
      "It gives the view of an official regulator rather than a trade union",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "end_of_cold_war_new_world_order",
    "topic": "globalisation_walmart_resistance",
    "subtopic": "source_evaluation",
    "skills": [
      "compare_source_authorship_perspective"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 8,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Ask who produced Sources 3B and 3C, and who produced Source 3D.\n- Check the dates and the type of each source in its introduction."
  },
  {
    "name": "Question 9",
    "question": "Arrange these steps into a logical explanation of why there was resistance to Walmart's expansion.",
    "metadata": [
      "Unions fear imports will replace local products and cost jobs",
      "Globalisation pushes multinationals such as Walmart to seek markets abroad",
      "Workers protest and unions oppose the merger in public hearings",
      "Walmart moves to merge with the South African retailer Massmart",
      "South Africa's openness to trade makes it an attractive first host country in Africa"
    ],
    "answer": [
      "Globalisation pushes multinationals such as Walmart to seek markets abroad",
      "South Africa's openness to trade makes it an attractive first host country in Africa",
      "Walmart moves to merge with the South African retailer Massmart",
      "Unions fear imports will replace local products and cost jobs",
      "Workers protest and unions oppose the merger in public hearings"
    ],
    "presentation": "ordering",
    "type": "application",
    "unit": "end_of_cold_war_new_world_order",
    "topic": "globalisation_walmart_resistance",
    "subtopic": "historical_causation",
    "skills": [
      "explain_historical_causation"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 9,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Start with the global cause in Source 3A and end with the reaction in Source 3B.\n- The fear has to come before the protest it caused."
  }
];

// ─── AI explanation (AMPM-CONTENT-AI-EXP) — one entry per REAL exam sub-question, against the memo ───

const aiExplanation = {
  sub_questions: [
  {
    "number": "3.1.1",
    "marks": 2,
    "clues": "- Think of the world becoming more connected.\n- Mention what moves across borders and why.",
    "approach": "- Define the term in your own words.",
    "solution": "1. The process by which the world becomes more integrated and connected across borders through technology, transport and communication.\n2. People, goods, money and ideas move around the world faster and more cheaply than before."
  },
  {
    "number": "3.1.2",
    "marks": 3,
    "clues": "- The reasons are in the second paragraph of Source 3A.",
    "approach": "- Find the sentence listing \"the most popular reasons for expansion\".\n- Write the three reasons.",
    "solution": "1. '… access to larger markets …'\n2. '… economies of scale …'\n3. '… cheaper resources …'"
  },
  {
    "number": "3.1.3",
    "marks": 2,
    "clues": "- The source links Walmart's survival to its growth.\n- Consider the size of the US market.",
    "approach": "- Explain why the US market was not enough.\n- Link this to expansion abroad.",
    "solution": "1. Walmart's growth in the USA was limited, so it had to expand globally, including into South Africa.\n2. It entered foreign markets to compete and grow internationally, taking over local businesses as subsidiaries.\n3. Any one point earns 2 marks."
  },
  {
    "number": "3.1.4",
    "marks": 2,
    "clues": "- The factors are in the fourth paragraph of Source 3A.",
    "approach": "- Find the sentence beginning \"Although\".\n- Quote two factors.",
    "solution": "1. '… free trade agreements …'\n2. '… advances in technology …'\n3. '… transportation …' is also accepted.\n4. Any two earn 2 marks."
  },
  {
    "number": "3.1.5",
    "marks": 2,
    "clues": "- The source mentions South Africa's membership of two groups.\n- Think about what \"open to trade\" means for foreign firms.",
    "approach": "- Explain what openness to trade means.\n- Link it to SADC and BRICS membership.",
    "solution": "1. South Africa's membership of SADC and BRICS makes trade with it easier.\n2. It is open to foreign investment by multinationals, with fewer trade restrictions.\n3. Any one point earns 2 marks."
  },
  {
    "number": "3.2.1",
    "marks": 2,
    "clues": "- Look at what the protesters are doing and where.\n- Think about why a newspaper would publish it.",
    "approach": "- State the purpose of the photograph.",
    "solution": "1. To make people aware of SACCAWU's protest against the Walmart–Massmart merger.\n2. To build support and solidarity for SACCAWU's opposition, and expose the negative impact of globalisation.\n3. Any one point earns 2 marks."
  },
  {
    "number": "3.2.2",
    "marks": 4,
    "clues": "- A coloniser takes control of another country for its own benefit.\n- Apply that idea to a foreign company.",
    "approach": "- Explain the term \"economic coloniser\".\n- Link it to fears about Walmart.\n- Give two points.",
    "solution": "1. The merger was seen as neo-colonialism by a US company.\n2. Walmart was seen as an outsider entering South Africa to exploit workers.\n3. Its expansion would cause de-industrialisation and job losses, and harm local retail and manufacturing.\n4. Any two points earn 4 marks."
  },
  {
    "number": "3.2.3",
    "marks": 4,
    "clues": "- Ask whose view the photograph shows.\n- Look at the language on the placards.",
    "approach": "- Identify what the source leaves out.\n- Comment on the language used.\n- Give two limitations.",
    "solution": "1. It shows only SACCAWU's view against Walmart's takeover of Massmart.\n2. It gives a one-sided view of the merger's impact on workers.\n3. It uses emotive language (\"ECONOMIC COLONISER\") to paint Walmart as an aggressor.\n4. Any two points earn 4 marks."
  },
  {
    "number": "3.3.1",
    "marks": 2,
    "clues": "- The reasons follow the words \"due to\" in the first paragraph of Source 3C.",
    "approach": "- Find the end of the first sentence.\n- Quote the two reasons.",
    "solution": "1. '… due to the decreased demand within the retail sector for locally-produced products …'\n2. '… and increased demand for imported products …'"
  },
  {
    "number": "3.3.2",
    "marks": 4,
    "clues": "- De-industrialisation means a decline in manufacturing.\n- Ask what happens to local factories if shops buy imports.",
    "approach": "- Explain the link between imports and local factories.\n- Give two consequences.",
    "solution": "1. It would force factories to restructure and lead to job losses.\n2. Cheaper goods would be sourced abroad, and local producers would struggle to match low prices.\n3. Local industries would eventually close.\n4. Any two points earn 4 marks."
  },
  {
    "number": "3.3.3",
    "marks": 2,
    "clues": "- Look at the last paragraph of Source 3C.\n- Quote the evidence about employees.",
    "approach": "- Find the sentence about prices and employees.\n- Copy it.",
    "solution": "1. '… its lowering of prices comes at a significant cost to employees who are compelled to accept lower wages and working conditions'"
  },
  {
    "number": "3.4",
    "marks": 4,
    "clues": "- Both sources come from trade unions.\n- Pair a detail in the photograph with a concern in the submission.",
    "approach": "- Take a point from Source 3B.\n- Find matching evidence in Source 3C.\n- Repeat for a second pair.",
    "solution": "1. Source 3B shows SACCAWU members protesting against the merger, and Source 3C is SACTWU's submission to Parliament against it.\n2. Source 3B calls Walmart an economic coloniser that harms local industry, and Source 3C warns of de-industrialisation.\n3. Both show that unions feared job losses.\n4. Any two comparisons earn 4 marks."
  },
  {
    "number": "3.5.1",
    "marks": 1,
    "clues": "- The fear is stated in the second sentence of Source 3D.",
    "approach": "- Find the sentence about the \"sophisticated network to procure\".\n- Quote the fear.",
    "solution": "1. '… local suppliers would not have a chance to sell their products'"
  },
  {
    "number": "3.5.2",
    "marks": 2,
    "clues": "- The source gives a first option and a second option.",
    "approach": "- Find the sentences beginning \"One option\" and \"The second\".\n- Quote each option.",
    "solution": "1. '… to keep Walmart out of the country'\n2. '… to allow Walmart to enter …'"
  },
  {
    "number": "3.5.3",
    "marks": 4,
    "clues": "- Perishables are foods that lose their freshness quickly.\n- Think about distance, safety and cost.",
    "approach": "- Explain why fresh food is best sourced locally.\n- Give two reasons.",
    "solution": "1. To keep food fresh and safe to eat.\n2. To maximise profit and cut unnecessary costs.\n3. To stock more locally produced food and avoid importing perishables.\n4. Any two points earn 4 marks."
  },
  {
    "number": "3.5.4",
    "marks": 2,
    "clues": "- To protect means to shield from something.\n- Think about what a government protects its industries from.",
    "approach": "- Define the concept.\n- Apply it to international trade.",
    "solution": "1. Government policies that restrict international trade, for example with tariffs, to protect domestic industries and promote local production."
  },
  {
    "number": "3.6",
    "marks": 8,
    "clues": "- Ask who resisted Walmart, and why.\n- Use every source and add your own knowledge.",
    "approach": "- Open with a clear statement answering the question.\n- Use evidence from each source, naming it.\n- Add own knowledge, e.g. local retailers' unease.\n- End with a concluding sentence.",
    "solution": "1. Globalisation drove Walmart to expand abroad for larger markets and cheaper resources, and South Africa's open trade made it the first host in Africa (Source 3A).\n2. South African companies were uneasy about Walmart's arrival (own knowledge).\n3. SACCAWU challenged the merger and called Walmart an economic coloniser (Source 3B).\n4. SACTWU warned of foreclosure of local manufacturers, job losses amongst black workers, de-industrialisation and weaker small businesses (Source 3C).\n5. Lower prices would come at the cost of lower wages and worse working conditions, with no real consumer benefit (Source 3C).\n6. The Competition Commission feared local suppliers could not compete with Walmart's network (Source 3D).\n7. The paragraph is marked on a 3-level rubric: 0–2, 3–5 or 6–8 marks."
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
