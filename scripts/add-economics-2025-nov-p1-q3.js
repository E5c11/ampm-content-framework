#!/usr/bin/env node
/**
 * DBE Economics P1 — November 2025 — Question 3 (order 3)
 * Economic pursuits: international organisations and export promotion, social indicators read from a bar graph, trade
 * agreements, liberalisation and dumping, BBBEE/NSDS, and economic indicators of performance. DESIGN-ECON-02 (choice items
 * against the memo's point lists); DESIGN-ECON-05 (fresh illustrative bar graph, never the paper's own); DESIGN-ECON-04
 * (fresh numbers for the two numeric blanks).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2025-nov-p1-q3.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2025-nov-p1-q3.js --dry-run
 *   node scripts/add-economics-2025-nov-p1-q3.js
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
  "subject": "economics",
  "year": 2025,
  "paper": "nov_p1",
  "order": 3,
  "content_tier": "free",
  "has_video": false,
  "xp": 40,
  "tags": [
    "international_organisations",
    "trade_policy",
    "social_indicators",
    "redress_policies",
    "economic_indicators"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q3/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q3/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q3/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q3/memo_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q3/memo_3.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q3/memo_4.png"
  ],
  "exam_question_marks": 40,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Select ALL the international organisations that expect their member countries to standardise their economic and social indicators.",
    "metadata": [
      "International Monetary Fund (IMF)",
      "World Bank",
      "United Nations (UN)",
      "South African Revenue Service (SARS)",
      "Johannesburg Securities Exchange (JSE)"
    ],
    "answer": [
      "International Monetary Fund (IMF)",
      "World Bank",
      "United Nations (UN)",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "definition",
    "unit": "economic_and_social_indicators",
    "topic": "international_comparisons",
    "subtopic": "econ_classification",
    "skills": [
      "classify_economic_concept"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Standard indicators let international bodies compare many countries on the same basis.\n- Two options are national institutions, not international organisations."
  },
  {
    "name": "Question 2",
    "question": "Which of the following is a way of promoting exports?",
    "metadata": [
      "Placing a high tariff on imported steel",
      "Setting a quota on imported cars",
      "Giving exporters subsidies and other incentives",
      "Banning the import of foreign clothing",
      ""
    ],
    "answer": [
      "Giving exporters subsidies and other incentives",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "protection_and_free_trade",
    "topic": "export_promotion",
    "subtopic": "econ_classification",
    "skills": [
      "classify_economic_concept"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Export promotion encourages local firms to sell abroad.\n- Three options restrict imports instead, which is a different strategy."
  },
  {
    "name": "Question 3",
    "question": "Study the bar graph. To which service do households in Province X have the least access?",
    "metadata": [
      "Electricity",
      "Refuse removal",
      "Piped water",
      "Internet at home",
      ""
    ],
    "answer": [
      "Internet at home",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "interpretation",
    "unit": "economic_and_social_indicators",
    "topic": "social_indicators",
    "subtopic": "econ_data_interpretation",
    "skills": [
      "interpret_economic_data"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Compare the heights of all the bars, not only the first few.",
    "supplementary_material": {
      "type": "graph",
      "label": "Graph",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/economics/2025/nov_p1/q3/graph_1.png"
      ]
    }
  },
  {
    "name": "Question 4",
    "question": "Study the bar graph. By how many percentage points is household access to electricity higher than access to refuse removal? []",
    "metadata": [
      "Difference (percentage points): ",
      "[ ]"
    ],
    "answer": [
      "38.7",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "type": "calc",
    "unit": "economic_and_social_indicators",
    "topic": "social_indicators",
    "subtopic": "econ_calculation",
    "skills": [
      "apply_economic_formula"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Read the two values from the labels on top of the bars.\n- Subtract the smaller percentage from the larger one.",
    "supplementary_material": {
      "type": "graph",
      "label": "Graph",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/economics/2025/nov_p1/q3/graph_1.png"
      ]
    }
  },
  {
    "name": "Question 5",
    "question": "Over ten years, thousands of families leave rural villages to look for work in the cities. Which social indicator describes this movement?",
    "metadata": [
      "Life expectancy",
      "Urbanisation",
      "Literacy rate",
      "Fertility rate",
      ""
    ],
    "answer": [
      "Urbanisation",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "economic_and_social_indicators",
    "topic": "social_indicators",
    "subtopic": "econ_term_definition",
    "skills": [
      "define_economic_term"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 5,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- The indicator is about where people live, not how long or how well.\n- Focus on the direction of the move."
  },
  {
    "name": "Question 6",
    "question": "Select ALL the possible effects of a rapidly growing working-age population on a country’s labour force.",
    "metadata": [
      "More people are available to work",
      "A bigger supply of labour can push wages down",
      "Unemployment may rise if too few jobs are created",
      "The labour force automatically shrinks",
      "The variety of skills in the labour market disappears"
    ],
    "answer": [
      "More people are available to work",
      "A bigger supply of labour can push wages down",
      "Unemployment may rise if too few jobs are created",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "economic_and_social_indicators",
    "topic": "population_and_labour_force",
    "subtopic": "econ_cause_and_effect",
    "skills": [
      "explain_economic_impact"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 6,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Think about both the supply of workers and the demand for them.\n- Two options contradict the idea of a growing population."
  },
  {
    "name": "Question 7",
    "question": "Select ALL the ways in which access to clean water can improve a country’s economic performance.",
    "metadata": [
      "Fewer water-borne illnesses keep workers healthy and productive",
      "Learners attend school more regularly, which builds a better-educated workforce",
      "Reliable water supply makes a country more attractive to investors",
      "Workers need more sick days",
      "Businesses face higher production costs"
    ],
    "answer": [
      "Fewer water-borne illnesses keep workers healthy and productive",
      "Learners attend school more regularly, which builds a better-educated workforce",
      "Reliable water supply makes a country more attractive to investors",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "economic_and_social_indicators",
    "topic": "social_indicators",
    "subtopic": "econ_cause_and_effect",
    "skills": [
      "explain_economic_impact"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 7,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Link water to health, education and the business environment.\n- Two options describe problems that clean water would reduce, not cause."
  },
  {
    "name": "Question 8",
    "question": "Which benefit does the African Growth and Opportunity Act (AGOA) give South African producers?",
    "metadata": [
      "Protection from all United States imports",
      "Free access to every African market",
      "Lower VAT on exports to the European Union",
      "Duty-free access for eligible exports to the United States market",
      ""
    ],
    "answer": [
      "Duty-free access for eligible exports to the United States market",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "protection_and_free_trade",
    "topic": "trade_agreements",
    "subtopic": "econ_term_definition",
    "skills": [
      "define_economic_term"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 8,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Think about which country offers the preference and what kind of cost it removes."
  },
  {
    "name": "Question 9",
    "question": "Which international organisation exists mainly to facilitate free trade by administering trade agreements and settling disputes between members?",
    "metadata": [
      "International Monetary Fund",
      "World Bank",
      "World Trade Organisation",
      "United Nations",
      ""
    ],
    "answer": [
      "World Trade Organisation",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "protection_and_free_trade",
    "topic": "trade_agreements",
    "subtopic": "econ_term_definition",
    "skills": [
      "define_economic_term"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 9,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- The organisation’s main purpose is trade rules, not lending or development finance."
  },
  {
    "name": "Question 10",
    "question": "A government removes tariffs and quotas on imported fabric so that cloth can flow freely across its borders. What is this policy called?",
    "metadata": [
      "Protectionism",
      "Trade liberalisation",
      "Import substitution",
      "Dumping",
      ""
    ],
    "answer": [
      "Trade liberalisation",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "protection_and_free_trade",
    "topic": "free_trade_arguments",
    "subtopic": "econ_term_definition",
    "skills": [
      "define_economic_term"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 10,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- The measures described reduce barriers rather than raising them."
  },
  {
    "name": "Question 11",
    "question": "Select ALL the ways in which dumping can harm producers in an importing country.",
    "metadata": [
      "They face unfair competition from very low-priced foreign goods",
      "They may be forced to shut down because demand for their goods collapses",
      "They may have to cut prices, which squeezes profit margins",
      "They can charge higher prices than before",
      "Demand for their goods rises sharply"
    ],
    "answer": [
      "They face unfair competition from very low-priced foreign goods",
      "They may be forced to shut down because demand for their goods collapses",
      "They may have to cut prices, which squeezes profit margins",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "protection_and_free_trade",
    "topic": "tariffs_and_trade_barriers",
    "subtopic": "econ_cause_and_effect",
    "skills": [
      "explain_economic_impact"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 11,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Dumping means exporting goods at very low prices.\n- Local producers cannot easily compete with those prices."
  },
  {
    "name": "Question 12",
    "question": "Match each South African initiative to its main purpose.",
    "metadata": [
      "A - Broad-Based Black Economic Empowerment (B-BBEE)",
      "B - National Skills Development Strategy (NSDS)",
      "C - Sector Education and Training Authorities (SETAs)",
      "1 - Promote inclusive participation in the economy to redress historical inequalities",
      "2 - Improve the skills of the labour force to reduce unemployment and promote equity",
      "3 - Help to facilitate skills training in particular economic sectors"
    ],
    "answer": [
      "A-1",
      "B-2",
      "C-3"
    ],
    "presentation": "match",
    "type": "definition",
    "unit": "growth_and_development",
    "topic": "redress_and_skills_policies",
    "subtopic": "econ_classification",
    "skills": [
      "classify_economic_concept"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 12,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- One initiative is about ownership and participation, and two are about training.\n- Of the two skills items, one is a national strategy and the other is a type of body."
  },
  {
    "name": "Question 13",
    "question": "Select ALL the ways in which B-BBEE promotes growth and development.",
    "metadata": [
      "Preferential procurement",
      "Enterprise development",
      "Skills development",
      "Export subsidies for all firms",
      "Fixed minimum prices"
    ],
    "answer": [
      "Preferential procurement",
      "Enterprise development",
      "Skills development",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "definition",
    "unit": "growth_and_development",
    "topic": "redress_and_skills_policies",
    "subtopic": "econ_policy_evaluation",
    "skills": [
      "evaluate_economic_policy"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 13,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- B-BBEE focuses on how businesses buy, develop and train.\n- Two options are general trade or pricing tools unrelated to empowerment."
  },
  {
    "name": "Question 14",
    "question": "Select ALL the changes in economic indicators that would show an improvement in the performance of an economy.",
    "metadata": [
      "A fall in the consumer price index (CPI) inflation rate",
      "An improvement in the terms of trade",
      "A rise in labour productivity",
      "A rise in the unemployment rate",
      "A widening current account deficit"
    ],
    "answer": [
      "A fall in the consumer price index (CPI) inflation rate",
      "An improvement in the terms of trade",
      "A rise in labour productivity",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "economic_and_social_indicators",
    "topic": "economic_performance_indicators",
    "subtopic": "econ_data_interpretation",
    "skills": [
      "interpret_economic_data"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 14,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- An improvement means lower living costs, better trade earnings or more output per worker.\n- Two options describe a worsening position."
  },
  {
    "name": "Question 15",
    "question": "A factory produced goods worth R2 400 000 using 120 workers. Calculate labour productivity as output per worker (in rand): []",
    "metadata": [
      "Output per worker (R): ",
      "[ ]"
    ],
    "answer": [
      "20000",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "type": "calc",
    "unit": "economic_and_social_indicators",
    "topic": "economic_performance_indicators",
    "subtopic": "econ_calculation",
    "skills": [
      "apply_economic_formula"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 15,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Productivity compares output with the quantity of labour used.\n- Divide total output by the number of workers."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "3.1.1",
      "marks": 2,
      "clues": "- Think of global bodies that collect comparable statistics from member countries.",
      "approach": "- Recall international organisations linked to the economy and development.\n- Name any two.",
      "solution": "1. Examples include the International Monetary Fund (IMF), the World Bank and the United Nations (UN).\n2. Any two correct organisations earn the two marks."
    },
    {
      "number": "3.1.2",
      "marks": 2,
      "clues": "- Consider what government does to help firms sell abroad, and what that does to national output.",
      "approach": "- Link support for exporters to production for foreign markets.\n- Finish with the effect on GDP and growth.",
      "solution": "1. Export subsidies and incentives encourage the production of goods and services for export.\n2. This increases gross domestic product and stimulates economic growth."
    },
    {
      "number": "3.2.1",
      "marks": 1,
      "clues": "- Compare the heights of all four bars.",
      "approach": "- Find the lowest bar in the graph.\n- Name the service on its label.",
      "solution": "1. The shortest bar, at 60%, is refuse removal, so households have the least access to it."
    },
    {
      "number": "3.2.2",
      "marks": 1,
      "clues": "- The movement is from the countryside to cities and towns.",
      "approach": "- Recall the social indicators in the curriculum.\n- Choose the one about rural-to-urban movement.",
      "solution": "1. The social indicator relating to migration from rural to urban areas is urbanisation."
    },
    {
      "number": "3.2.3",
      "marks": 2,
      "clues": "- It covers the safe handling of human waste and the cleanliness that follows.",
      "approach": "- Define sanitation in a sentence.\n- Mention facilities and services, and the health purpose.",
      "solution": "1. Sanitation is the provision of facilities and services such as toilets, garbage disposal and sewerage systems.\n2. Its purpose is the safe disposal of human waste, hygiene and a clean environment that protects people’s health."
    },
    {
      "number": "3.2.4",
      "marks": 2,
      "clues": "- Think about both the supply of workers and whether jobs exist for them.",
      "approach": "- Say how the labour force changes.\n- Add one consequence for wages or unemployment.",
      "solution": "1. An increase in population raises the number of people available to work, which enlarges the labour force.\n2. A larger supply of labour may lower wages, bring more skills and experience, and may increase unemployment if jobs are too few."
    },
    {
      "number": "3.2.5",
      "marks": 4,
      "clues": "- Link water to health, education and investment, then develop two points.",
      "approach": "- Choose two distinct benefits.\n- Explain each through to its economic effect (2 x 2).",
      "solution": "1. Clean water prevents disease, so workers stay healthy, sick days fall and productivity rises.\n2. Access to clean water supports regular school attendance, which builds a better-educated workforce with higher earning potential.\n3. Reliable water may also attract tourists and investors, increasing economic activity."
    },
    {
      "number": "3.3.1",
      "marks": 1,
      "clues": "- The protocol is named in the extract itself.",
      "approach": "- Scan the extract for the protocol about regional development.\n- Write its name.",
      "solution": "1. The protocol aimed at reconstructing and developing Southern Africa’s social and economic framework is the Southern African Development Community (SADC)."
    },
    {
      "number": "3.3.2",
      "marks": 1,
      "clues": "- The body administers world trade rules.",
      "approach": "- Recall the organisation for free trade.\n- Name it in full.",
      "solution": "1. The international organisation that facilitates free trade is the World Trade Organisation (WTO)."
    },
    {
      "number": "3.3.3",
      "marks": 2,
      "clues": "- The term describes what happens to barriers to trade.",
      "approach": "- Define the term in one or two sentences.\n- Mention the barriers removed.",
      "solution": "1. Trade liberalisation is the removal of government intervention in trade flows on both imports and exports.\n2. It removes restrictions such as tariffs and quotas to allow goods and services to flow freely between countries."
    },
    {
      "number": "3.3.4",
      "marks": 2,
      "clues": "- Think about what AGOA does for exporters selling to the United States.",
      "approach": "- State one benefit clearly.\n- Add its effect on producers or jobs.",
      "solution": "1. Local producers enjoy duty-free access to the US market, which makes their exports more competitive.\n2. AGOA also promotes industrial growth and diversification, and more exports may create jobs."
    },
    {
      "number": "3.3.5",
      "marks": 4,
      "clues": "- Think about how very cheap foreign goods affect local sellers.",
      "approach": "- Choose two effects.\n- Explain each with its consequence (2 x 2).",
      "solution": "1. Local producers face unfair competition because foreign enterprises sell at very low prices.\n2. Demand for local goods falls, and producers may be forced to close down.\n3. Producers may have to match the lower prices, which reduces their profit margins."
    },
    {
      "number": "3.4",
      "marks": 8,
      "clues": "- Give two developed points on each policy.\n- A bare list of facts is capped at 4 marks.",
      "approach": "- Describe the aim of B-BBEE and how it works.\n- Describe the aim of the NSDS and how it works.\n- Develop each point with a reason or an effect.",
      "solution": "1. B-BBEE promotes inclusive participation of black South Africans in the economy to address historical inequalities and gives a legal basis for transformation.\n2. Its objectives include redress and affirmative action, using preferential procurement, enterprise development, skills development and ownership and management promotion.\n3. The NSDS aims to improve the skills of the labour force to meet economic needs, reduce unemployment and promote equity.\n4. It identifies skills in high demand, works through partnerships with institutions, employers and SETAs, and targets historically disadvantaged groups."
    },
    {
      "number": "3.5",
      "marks": 8,
      "clues": "- Give four developed points, each linking an indicator to better economic performance.\n- Avoid simply naming indicators, since mere listing is capped at 2 marks.",
      "approach": "- Choose indicators: prices, trade, employment, productivity, interest rates, exchange rates, money supply.\n- For each, say which direction of change is an improvement and why.",
      "solution": "1. A fall in the CPI means a lower cost of living, which supports demand; a fall in the PPI lowers production costs.\n2. Improved terms of trade means more export income to pay for imports and may reflect a current account surplus.\n3. A higher employment rate and higher labour productivity raise spending, tax revenue, efficiency and GDP.\n4. Lower interest rates stimulate spending and investment; a weaker exchange rate makes exports cheaper while a stronger one lowers import costs and inflation.\n5. An increase in the money supply expands credit and short-term spending."
    }
  ],
  "model": "claude-sonnet-5-5",
  "generated_at": Date.now(),
  "version": 2,
  "reviewed": false,
  "input_tokens": 0,
  "output_tokens": 0,
  "avg_rating": null,
  "rating_count": null
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

  // Exam gate (VER-02/VER-04/VER-09): derive the exam minimum from the rows now in the database and write it. Dev only; no-op at the floor.
  if (!DRY_RUN && ENV === 'dev') {
    const { applyExamGates } = require('../tools/lib/exam-gate');
    await applyExamGates(pool, { env: ENV, apply: true, filter: { subject: video.subject, syllabus: video.syllabus, year: String(video.year) } });
  } else if (DRY_RUN) {
    console.log('   (dry-run: the exam gate is derived and written after a real upload — node tools/apply-exam-gate.js shows it)');
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
