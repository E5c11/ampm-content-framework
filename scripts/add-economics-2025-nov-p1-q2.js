#!/usr/bin/env node
/**
 * DBE Economics P1 — November 2025 — Question 2 (order 2)
 * Macroeconomics: leading indicators and free riders, the financial account of the balance of payments (with a reserve-assets
 * calculation), the Phillips curve, macroeconomic objectives and rand appreciation. DESIGN-ECON-02 (choice items against the memo's
 * point lists), DESIGN-ECON-04 (fresh numbers; the calculation is a steps item and its sign-reading is a separate self-contained
 * item), DESIGN-ECON-05 (fresh illustrative Phillips curve, labelled illustrative; never the paper's own figure).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2025-nov-p1-q2.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2025-nov-p1-q2.js --dry-run
 *   node scripts/add-economics-2025-nov-p1-q2.js
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
  "subject": "economics",
  "year": 2025,
  "paper": "nov_p1",
  "order": 2,
  "content_tier": "free",
  "has_video": false,
  "xp": 40,
  "tags": [
    "balance_of_payments",
    "phillips_curve",
    "leading_indicators",
    "macroeconomic_objectives",
    "exchange_rates"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q2/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q2/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q2/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q2/memo_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q2/memo_3.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q2/memo_4.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q2/memo_5.png"
  ],
  "exam_question_marks": 40,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Select ALL the leading indicators of the business cycle.",
    "metadata": [
      "Number of building plans approved",
      "Business Confidence Index",
      "New companies registered",
      "Consumer price index (CPI)",
      "Unemployment rate"
    ],
    "answer": [
      "Number of building plans approved",
      "Business Confidence Index",
      "New companies registered",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "definition",
    "unit": "business_cycles",
    "topic": "cycle_indicators",
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
    "clues": "- A leading indicator changes before the economy as a whole turns.\n- Ask which items reflect plans and expectations rather than results already visible in the economy."
  },
  {
    "name": "Question 2",
    "question": "A government agency builds a bridge that anyone can cross without paying. Which measure would best exclude free riders from using it?",
    "metadata": [
      "Lower the taxes paid by local firms",
      "Charge a toll at the bridge entrance",
      "Build a second identical bridge next to it",
      "Allow private firms to advertise on the bridge",
      ""
    ],
    "answer": [
      "Charge a toll at the bridge entrance",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "public_sector",
    "topic": "public_goods_and_free_riders",
    "subtopic": "econ_cause_and_effect",
    "skills": [
      "explain_economic_impact"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- A free rider uses something without contributing to its cost.\n- Look for a measure that makes access depend on payment."
  },
  {
    "name": "Question 3",
    "question": "A South African pension fund buys a small share in a Brazilian company without gaining any control over it. Which item of the financial account of the balance of payments records this?",
    "metadata": [
      "Net direct investment",
      "Net financial derivatives",
      "Reserve assets",
      "Net portfolio investment",
      ""
    ],
    "answer": [
      "Net portfolio investment",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "foreign_exchange_and_bop",
    "topic": "balance_of_payments",
    "subtopic": "econ_classification",
    "skills": [
      "classify_economic_concept"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- The fund only buys shares and has no say in how the company is run.\n- Investments that give a controlling interest are recorded under a different item."
  },
  {
    "name": "Question 4",
    "question": "Which of the following transactions would be recorded in the capital transfer account of the balance of payments?",
    "metadata": [
      "A South African firm exports wine to Europe",
      "A foreign investor buys shares on the JSE",
      "A foreign government cancels part of South Africa’s debt to it",
      "South Africa pays interest on a foreign loan",
      ""
    ],
    "answer": [
      "A foreign government cancels part of South Africa’s debt to it",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "foreign_exchange_and_bop",
    "topic": "balance_of_payments",
    "subtopic": "econ_classification",
    "skills": [
      "classify_economic_concept"
    ],
    "difficulty": 4,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Capital transfers are one-off changes in ownership of assets or debt with nothing received in return.\n- Exports and interest payments belong to the current account, and share purchases to the financial account."
  },
  {
    "name": "Question 5",
    "question": "Why does the balance of payments contain an item for unrecorded transactions?",
    "metadata": [
      "To record illegal trade only",
      "To absorb errors and omissions in the timing, coverage and valuation of the other items",
      "To store transactions planned for next year",
      "To measure the size of the government’s budget deficit",
      ""
    ],
    "answer": [
      "To absorb errors and omissions in the timing, coverage and valuation of the other items",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "foreign_exchange_and_bop",
    "topic": "balance_of_payments",
    "subtopic": "econ_cause_and_effect",
    "skills": [
      "explain_economic_impact"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 5,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Data for a large number of transactions are collected from different sources at different times.\n- The item makes the whole account balance despite imperfect data."
  },
  {
    "name": "Question 6",
    "question": "Use the figures from an illustrative financial account (R millions) to find the reserve assets item A. Net direct investment 32 500; net portfolio investment -11 200; net financial derivatives 2 100; net other investment 9 800; reserve assets A; balance on the financial account 28 400. Complete the working:",
    "metadata": [
      "Balance excluding reserve assets = 32 500 - 11 200 + 2 100 + 9 800",
      "= 33 200",
      "A = 28 400 - 33 200, so A (in R millions):",
      "[ ]"
    ],
    "answer": [
      "-4800"
    ],
    "presentation": "steps",
    "keyboard_type": "scientific_math",
    "type": "calc",
    "unit": "foreign_exchange_and_bop",
    "topic": "balance_of_payments",
    "subtopic": "econ_calculation",
    "skills": [
      "apply_economic_formula"
    ],
    "difficulty": 4,
    "exam_weight": 2,
    "xp": 10,
    "order": 6,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- The balance on the financial account is the sum of all its items, including reserve assets.\n- Subtract the total of the other items from the balance to isolate the reserve assets."
  },
  {
    "name": "Question 7",
    "question": "In a balance of payments table, reserve assets are shown as -R2 100 million. An increase in reserve assets is indicated by a negative sign and a decrease by a positive sign. What happened to the reserve assets?",
    "metadata": [
      "They increased by R2 100 million",
      "They decreased by R2 100 million",
      "They were unchanged, because the sign only shows a loss on the account",
      "They increased by R4 200 million",
      ""
    ],
    "answer": [
      "They increased by R2 100 million",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "interpretation",
    "unit": "foreign_exchange_and_bop",
    "topic": "balance_of_payments",
    "subtopic": "econ_data_interpretation",
    "skills": [
      "interpret_economic_data"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 7,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Apply the sign convention given in the question, not the everyday meaning of a negative number."
  },
  {
    "name": "Question 8",
    "question": "Study the Phillips curve. What is the inflation rate when the unemployment rate is 8%?",
    "metadata": [
      "2%",
      "5%",
      "8%",
      "9%",
      ""
    ],
    "answer": [
      "5%",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "interpretation",
    "unit": "business_cycles",
    "topic": "phillips_curve",
    "subtopic": "econ_data_interpretation",
    "skills": [
      "interpret_economic_data"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 8,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Find 8% on the horizontal axis, go up to the curve, then across to the vertical axis.",
    "supplementary_material": {
      "type": "graph",
      "label": "Graph",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/economics/2025/nov_p1/q2/graph_1.png"
      ]
    }
  },
  {
    "name": "Question 9",
    "question": "Study the Phillips curve. At point V, inflation is zero and unemployment is 16%. What is this level of unemployment called?",
    "metadata": [
      "Cyclical unemployment",
      "Frictional unemployment",
      "The natural rate of unemployment",
      "The full-employment level",
      ""
    ],
    "answer": [
      "The natural rate of unemployment",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "business_cycles",
    "topic": "phillips_curve",
    "subtopic": "econ_term_definition",
    "skills": [
      "define_economic_term"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 9,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- It is the unemployment rate that remains when there is no pressure on prices to rise or fall.\n- Cyclical and frictional unemployment are causes of unemployment, not a point on this curve.",
    "supplementary_material": {
      "type": "graph",
      "label": "Graph",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/economics/2025/nov_p1/q2/graph_1.png"
      ]
    }
  },
  {
    "name": "Question 10",
    "question": "Study the Phillips curve. Policy-makers want to move the economy from point T to point S. What happens?",
    "metadata": [
      "Unemployment rises and inflation falls",
      "Unemployment and inflation both rise",
      "Unemployment and inflation both fall",
      "Unemployment falls and inflation rises",
      ""
    ],
    "answer": [
      "Unemployment falls and inflation rises",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "interpretation",
    "unit": "business_cycles",
    "topic": "phillips_curve",
    "subtopic": "econ_cause_and_effect",
    "skills": [
      "explain_economic_impact"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 10,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Compare the coordinates of T and S on both axes.\n- The curve slopes downward, so the two variables move in opposite directions.",
    "supplementary_material": {
      "type": "graph",
      "label": "Graph",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/question_supplementary/economics/2025/nov_p1/q2/graph_1.png"
      ]
    }
  },
  {
    "name": "Question 11",
    "question": "Which statement best describes the new economic paradigm in relation to business cycles?",
    "metadata": [
      "Business cycles are left entirely to market forces and never need smoothing",
      "Demand-side and supply-side policies are combined to smooth the cycle and allow growth without inflation",
      "Only monetary policy is used to prevent every recession",
      "Cycles are caused only by shocks from outside the economy",
      ""
    ],
    "answer": [
      "Demand-side and supply-side policies are combined to smooth the cycle and allow growth without inflation",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "business_cycles",
    "topic": "business_cycle_policy",
    "subtopic": "econ_term_definition",
    "skills": [
      "define_economic_term"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 11,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- The word \"paradigm\" refers to the way policy-makers think about the problem.\n- The approach uses more than one kind of policy at once."
  },
  {
    "name": "Question 12",
    "question": "Select ALL the measures government can use to improve the efficiency of markets.",
    "metadata": [
      "Remove unnecessary regulations that make markets inflexible",
      "Encourage competition by welcoming new firms and foreign investment",
      "Level the playing field so that no business is unfairly disadvantaged",
      "Give one firm exclusive rights to dominate a market",
      "Fix minimum prices on all goods"
    ],
    "answer": [
      "Remove unnecessary regulations that make markets inflexible",
      "Encourage competition by welcoming new firms and foreign investment",
      "Level the playing field so that no business is unfairly disadvantaged",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "public_sector",
    "topic": "market_efficiency_measures",
    "subtopic": "econ_policy_evaluation",
    "skills": [
      "evaluate_economic_policy"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 12,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Efficient markets need flexibility and rivalry between firms.\n- Two of the options reduce competition or distort prices."
  },
  {
    "name": "Question 13",
    "question": "Arrange these measures to promote full employment from the one with the quickest effect to the one that takes longest.",
    "metadata": [
      "Support for knowledge-intensive sectors and better education and training",
      "Direct employment schemes and youth employment subsidies",
      "Support for labour-intensive activities such as agriculture, and investment incentives for manufacturing"
    ],
    "answer": [
      "Direct employment schemes and youth employment subsidies",
      "Support for labour-intensive activities such as agriculture, and investment incentives for manufacturing",
      "Support for knowledge-intensive sectors and better education and training"
    ],
    "presentation": "ordering",
    "type": "application",
    "unit": "public_sector",
    "topic": "macroeconomic_objectives",
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
    "clues": "- Think about how long each measure takes to create or prepare people for jobs.\n- Changing the skills of the future labour force takes the longest."
  },
  {
    "name": "Question 14",
    "question": "A country’s Gini coefficient is 0,62. What does this value suggest about economic equity?",
    "metadata": [
      "Income is fairly equally distributed",
      "Income is very unequally distributed",
      "Everyone earns the same income",
      "The country has no poverty",
      ""
    ],
    "answer": [
      "Income is very unequally distributed",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "interpretation",
    "unit": "economic_and_social_indicators",
    "topic": "income_inequality_measures",
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
    "clues": "- The coefficient lies between 0 and 1; the higher the value, the further income is from an equal split.\n- A value below 0,5 is regarded as relatively equal."
  },
  {
    "name": "Question 15",
    "question": "Select ALL the likely effects of a stronger (appreciating) rand on the South African economy.",
    "metadata": [
      "Imported inputs such as crude oil become cheaper",
      "South African exports become more expensive for foreign buyers",
      "Fewer foreign tourists visit because their currency buys less rand",
      "The price of imported goods rises",
      "South African goods become cheaper abroad"
    ],
    "answer": [
      "Imported inputs such as crude oil become cheaper",
      "South African exports become more expensive for foreign buyers",
      "Fewer foreign tourists visit because their currency buys less rand",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "foreign_exchange_and_bop",
    "topic": "currency_exchange_rates",
    "subtopic": "econ_cause_and_effect",
    "skills": [
      "explain_economic_impact"
    ],
    "difficulty": 4,
    "exam_weight": 2,
    "xp": 10,
    "order": 15,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- A stronger rand buys more foreign currency but costs foreign buyers more.\n- Two options describe the opposite effect, which belongs to a weaker rand."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "2.1.1",
      "marks": 2,
      "clues": "- Leading indicators signal a turn in the cycle before it happens.",
      "approach": "- List indicators that reflect plans, orders and confidence.\n- Name any two.",
      "solution": "1. Examples that qualify include the number of building plans approved, job advertising space, number of vehicles sold, new companies registered and the Business Confidence Index.\n2. Any two correct examples score the two marks."
    },
    {
      "number": "2.1.2",
      "marks": 2,
      "clues": "- Think of ways to make access depend on paying.",
      "approach": "- Recall how government funds collective goods.\n- Explain one way that stops non-payers from consuming.",
      "solution": "1. Government can charge user fees or levies for facilities such as stadiums and national roads.\n2. It can also fund public goods through taxes, which forces everyone to contribute."
    },
    {
      "number": "2.2.1",
      "marks": 1,
      "clues": "- Shares are a form of investment that does not give control of the company.",
      "approach": "- Scan the table for the item that covers share purchases.\n- Write the item name.",
      "solution": "1. The purchase of shares is recorded under net portfolio investment."
    },
    {
      "number": "2.2.2",
      "marks": 1,
      "clues": "- It is one of the sub-accounts inside the capital and financial parts of the balance of payments.",
      "approach": "- Recall the sub-accounts.\n- Match debt forgiveness to the sub-account for one-off transfers.",
      "solution": "1. Debt forgiveness is recorded in the capital transfer account."
    },
    {
      "number": "2.2.3",
      "marks": 2,
      "clues": "- The investor takes a significant stake or control.",
      "approach": "- Define direct investment briefly.\n- Mention the share or control involved.",
      "solution": "1. Direct investment is investment in real estate or fixed property, or in a business, where the investor obtains a meaningful share (10% or more) or control.\n2. It includes transactions in foreign businesses and fixed property."
    },
    {
      "number": "2.2.4",
      "marks": 2,
      "clues": "- Think about why published statistics rarely add up perfectly.",
      "approach": "- Recall what the item corrects for.\n- State its purpose in one sentence.",
      "solution": "1. The unrecorded transactions item caters for errors and omissions in the timing, coverage and valuation of the other items."
    },
    {
      "number": "2.2.5",
      "marks": 4,
      "clues": "- The balance on the financial account is the total of all its items, including reserve assets.\n- The table also gives the balance excluding reserve assets.",
      "approach": "- Subtract the balance excluding reserve assets from the balance on the financial account.\n- Use the sign convention printed under the table to decide whether reserve assets rose or fell.\n- Show each line of working, since the working carries most of the marks.",
      "solution": "1. Balance on the financial account is 62 869 and the balance excluding reserve assets is 63 066.\n2. Reserve assets = 62 869 - 63 066 = -197 (alternatively 62 869 - 13 481 - 4 311 + 23 348 - 68 622 = -197).\n3. A negative sign means an increase in reserve assets, so reserve assets increased."
    },
    {
      "number": "2.3.1",
      "marks": 1,
      "clues": "- Read upward from 10% on the horizontal axis to the curve.",
      "approach": "- Find 10% unemployment.\n- Read the matching inflation level across to the vertical axis.",
      "solution": "1. At 10% unemployment the curve is at point C, which corresponds to 6% inflation."
    },
    {
      "number": "2.3.2",
      "marks": 1,
      "clues": "- Find where the curve meets the horizontal axis.",
      "approach": "- Note that zero inflation is where the curve crosses the axis.\n- Name the unemployment concept at that point.",
      "solution": "1. The unemployment level where inflation is zero is the natural rate of unemployment."
    },
    {
      "number": "2.3.3",
      "marks": 2,
      "clues": "- The concept is about how policy-makers try to flatten the ups and downs of the cycle.",
      "approach": "- Recall the CAPS content on the cycle.\n- Describe the idea in a sentence.",
      "solution": "1. The new economic paradigm is the smoothing of business cycles (achieving price stability) by using demand-side and supply-side policies.\n2. It holds that growth can be promoted without provoking inflation."
    },
    {
      "number": "2.3.4",
      "marks": 2,
      "clues": "- Look at the direction the curve slopes.",
      "approach": "- State how unemployment moves when inflation rises.\n- Use the word that describes opposite movements.",
      "solution": "1. The graph shows an inverse (trade-off) relationship: when unemployment is higher, inflation is lower, and the reverse."
    },
    {
      "number": "2.3.5",
      "marks": 4,
      "clues": "- Think about removing obstacles and encouraging rivalry between firms.",
      "approach": "- Give two distinct measures.\n- Develop each into a full sentence, since the question is worth 2 x 2.",
      "solution": "1. Deregulation: government removes laws and regulations that limit market flexibility.\n2. Competition: government encourages new businesses and foreign direct investment, and removes power imbalances.\n3. Levelling the playing field: all market participants get equal opportunities, so no firm is unfairly disadvantaged.\n4. Any two of these, each explained, earn the 4 marks."
    },
    {
      "number": "2.4",
      "marks": 8,
      "clues": "- Treat the two objectives separately and give two developed points for each.\n- Avoid simply listing facts, since a mere list is capped.",
      "approach": "- Define each objective in a line.\n- Add developed points: short, medium and long-term actions for employment, and income redistribution tools for equity.\n- Use the Gini coefficient as evidence for equity.",
      "solution": "1. Full employment: everyone who wants a job can find one; government aims for decent and sustainable jobs, and employment is measured as a percentage of the economically active population.\n2. Short term: direct employment schemes and subsidies; medium term: support for labour-intensive activities and incentives to industries employing many people; long term: knowledge-intensive sectors and better education.\n3. Economic equity: resources are fairly distributed; a Gini coefficient below 0,5 is more equal, while South Africa is above 0,6.\n4. The progressive tax system, free basic education and health care, social grants and subsidies redistribute income.\n5. A maximum of 4 marks may be awarded for mere listing."
    },
    {
      "number": "2.5",
      "marks": 8,
      "clues": "- A stronger rand has both positive and negative effects, so give both sides.\n- Each point needs to be developed beyond a bare statement.",
      "approach": "- List positives: cheaper imports and lower inflation, more investment, lower import payments.\n- List negatives: costlier exports, weaker export earnings and jobs, fewer tourists, a wider deficit.\n- Develop four points with a consequence each.",
      "solution": "1. Positive: imported inputs such as crude oil and vehicle parts become cheaper, curbing cost-push inflation and lowering production costs.\n2. Positive: foreign investors may be attracted by higher returns, and import payments fall.\n3. Negative: exports such as base metals become relatively expensive and demand falls, hurting local firms and employment.\n4. Negative: inbound tourism falls and the balance of payments deficit may widen.\n5. Mere listing earns at most 2 marks."
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
