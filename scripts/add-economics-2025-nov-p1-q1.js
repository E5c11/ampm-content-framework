#!/usr/bin/env node
/**
 * DBE Economics P1 — November 2025 — Question 1 (order 1)
 * Section A (compulsory): business cycle explanations, the multiplier relationship, public sector failure, comparative
 * advantage, tariffs, tax systems, industrial policy, labour-force arithmetic, exchange-rate systems, monetary policy, and four
 * single-term recall items (the real Q1.3 shape: one canonical term, no acronyms). DESIGN-ECON-02: choice items against the
 * concept; DESIGN-ECON-04: fresh numbers; Q1.3-style terms are typed on the text keyboard (DESIGN-ECON-01).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2025-nov-p1-q1.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2025-nov-p1-q1.js --dry-run
 *   node scripts/add-economics-2025-nov-p1-q1.js
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
  "subject": "economics",
  "year": 2025,
  "paper": "nov_p1",
  "order": 1,
  "content_tier": "free",
  "has_video": false,
  "xp": 30,
  "tags": [
    "business_cycles",
    "multiplier",
    "tariffs",
    "taxation_systems",
    "exchange_rates"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q1/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q1/question_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q1/question_3.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q1/memo_1.png"
  ],
  "exam_question_marks": 30,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Economist Ayanda argues that a recent downturn began because banks lent too freely and households became over-indebted, so the slump grew out of the economy's own financial behaviour. Which kind of business cycle explanation is she giving?",
    "metadata": [
      "An exogenous explanation",
      "A new economic paradigm explanation",
      "An endogenous explanation",
      "A balance of payments explanation",
      ""
    ],
    "answer": [
      "An endogenous explanation",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "business_cycles",
    "topic": "business_cycle_explanations",
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
    "clues": "- Ask whether the cause lies within the economic system or arrives from outside it.\n- Lending and borrowing are decisions made by participants in the economy itself."
  },
  {
    "name": "Question 2",
    "question": "In a two-sector economy the marginal propensity to save (mps) is 0.25. Work out the marginal propensity to consume (mpc): []",
    "metadata": [
      "mpc = ",
      "[ ]"
    ],
    "answer": [
      "0.75",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "type": "calc",
    "unit": "circular_flow",
    "topic": "multiplier",
    "subtopic": "econ_calculation",
    "skills": [
      "apply_economic_formula"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Every extra rand of income is either spent or saved.\n- Take the saved share away from the whole."
  },
  {
    "name": "Question 3",
    "question": "To collect a disability grant, an applicant at a regional office must get six stamped forms from three different counters, and every stamp needs a supervisor’s signature. Service is slow even though the staff are willing and well trained. Which cause of public sector failure does this best illustrate?",
    "metadata": [
      "Rent seeking",
      "Bureaucracy",
      "Apathy among officials",
      "Inadequate funding",
      ""
    ],
    "answer": [
      "Bureaucracy",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "public_sector",
    "topic": "public_sector_failure",
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
    "clues": "- The staff are described as willing, so look at the system they work within, not their attitude.\n- Think about what happens when procedure matters more than the service delivered."
  },
  {
    "name": "Question 4",
    "question": "In one day, Country P can produce either 10 chairs or 20 tables, and Country Q can produce either 8 chairs or 10 tables, using the same inputs. Which statement is correct?",
    "metadata": [
      "P has an absolute advantage in both goods, and a comparative advantage in chairs",
      "Q has an absolute advantage in chairs, and a comparative advantage in tables",
      "Neither country can gain from trade, because P is better at making both goods",
      "P has an absolute advantage in both goods, and Q has a comparative advantage in chairs",
      ""
    ],
    "answer": [
      "P has an absolute advantage in both goods, and Q has a comparative advantage in chairs",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "protection_and_free_trade",
    "topic": "comparative_advantage",
    "subtopic": "econ_calculation",
    "skills": [
      "apply_economic_formula"
    ],
    "difficulty": 4,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Compare total output first for absolute advantage, then work out what each country gives up per chair.\n- The country that gives up fewer tables per chair has the comparative advantage in chairs."
  },
  {
    "name": "Question 5",
    "question": "An importer brings in machinery invoiced at R80 000. The government charges an ad valorem tariff of 12%. How much duty must the importer pay?",
    "metadata": [
      "R960",
      "R9 600",
      "R12 000",
      "R89 600",
      ""
    ],
    "answer": [
      "R9 600",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "calc",
    "unit": "protection_and_free_trade",
    "topic": "tariffs_and_trade_barriers",
    "subtopic": "econ_calculation",
    "skills": [
      "apply_economic_formula"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 5,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- An ad valorem tariff is a percentage of the value of the goods.\n- The question asks for the duty only, not the new total cost."
  },
  {
    "name": "Question 6",
    "question": "Thabo earns R12 000 a month and pays R1 200 in income tax. Lerato earns R36 000 a month and pays R7 200. Which tax system does this pattern show?",
    "metadata": [
      "Proportional",
      "Regressive",
      "Progressive",
      "Indirect",
      ""
    ],
    "answer": [
      "Progressive",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "public_sector",
    "topic": "taxation_systems",
    "subtopic": "econ_classification",
    "skills": [
      "classify_economic_concept"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 6,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Work out each person’s tax as a percentage of their income.\n- Compare how that percentage changes as income rises."
  },
  {
    "name": "Question 7",
    "question": "Which document is South Africa’s rolling three-year plan that turns the National Industrial Policy Framework into concrete actions?",
    "metadata": [
      "Industrial Policy Action Plan",
      "National Research and Development Strategy",
      "Integrated Manufacturing Strategy",
      "Reconstruction and Development Programme",
      ""
    ],
    "answer": [
      "Industrial Policy Action Plan",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "growth_and_development",
    "topic": "industrial_policy",
    "subtopic": "econ_term_definition",
    "skills": [
      "define_economic_term"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 7,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Look for the plan that is renewed regularly and is about action, not about a framework.\n- One option is a research strategy and another is a 1990s social programme, so neither is the industrial plan."
  },
  {
    "name": "Question 8",
    "question": "A region has 4 000 000 economically active people, of whom 3 200 000 are employed. All the others are actively looking for work. Calculate the unemployment rate as a percentage: []",
    "metadata": [
      "Unemployment rate (%): ",
      "[ ]"
    ],
    "answer": [
      "20",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "type": "calc",
    "unit": "economic_and_social_indicators",
    "topic": "labour_force_and_unemployment",
    "subtopic": "econ_calculation",
    "skills": [
      "apply_economic_formula"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 8,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Find the number of unemployed people first.\n- Express that number as a percentage of the economically active population."
  },
  {
    "name": "Question 9",
    "question": "Match each exchange-rate system to the description that fits it.",
    "metadata": [
      "A - Free-floating",
      "B - Pegged (fixed)",
      "C - Managed float",
      "1 - Supply and demand set the value, and the central bank stays out of the market",
      "2 - The government sets the value against a reference currency",
      "3 - Market forces set the value, but the central bank steps in to smooth large swings"
    ],
    "answer": [
      "A-1",
      "B-2",
      "C-3"
    ],
    "presentation": "match",
    "type": "definition",
    "unit": "foreign_exchange_and_bop",
    "topic": "currency_exchange_rates",
    "subtopic": "econ_classification",
    "skills": [
      "classify_economic_concept"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 9,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Decide for each system who sets the price of the currency.\n- One system sits between full market determination and full government control."
  },
  {
    "name": "Question 10",
    "question": "Which of the following is a monetary policy action?",
    "metadata": [
      "Treasury raises the VAT rate",
      "Government cuts its spending on road projects",
      "Government increases social grants",
      "The Reserve Bank raises the repo rate to slow credit growth",
      ""
    ],
    "answer": [
      "The Reserve Bank raises the repo rate to slow credit growth",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "public_sector",
    "topic": "fiscal_and_monetary_policy",
    "subtopic": "econ_classification",
    "skills": [
      "classify_economic_concept"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 10,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Monetary policy works through interest rates and the money supply.\n- Three options are decisions about taxes or government budgets."
  },
  {
    "name": "Question 11",
    "question": "Give the term for a limit that a government places on the quantity of a particular good that may be imported in a year: []",
    "metadata": [
      "Term: ",
      "[ ]"
    ],
    "answer": [
      "quota|import quota",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "text",
    "type": "definition",
    "unit": "protection_and_free_trade",
    "topic": "tariffs_and_trade_barriers",
    "subtopic": "econ_term_definition",
    "skills": [
      "define_economic_term"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 11,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- This is a non-tariff trade barrier that restricts quantity rather than adding a tax."
  },
  {
    "name": "Question 12",
    "question": "Give the term for the record of all economic transactions between a country’s residents and the rest of the world over a period: []",
    "metadata": [
      "Term: ",
      "[ ]"
    ],
    "answer": [
      "balance of payments|balance of payment",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "text",
    "type": "definition",
    "unit": "foreign_exchange_and_bop",
    "topic": "balance_of_payments",
    "subtopic": "econ_term_definition",
    "skills": [
      "define_economic_term"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 12,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- It is a statement covering the current, capital and financial accounts. Write the full term, not an abbreviation."
  },
  {
    "name": "Question 13",
    "question": "Give the term for the measure, between 0 and 1, of how unequally income is distributed in a country: []",
    "metadata": [
      "Term: ",
      "[ ]"
    ],
    "answer": [
      "gini coefficient|gini-coefficient|gini index",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "text",
    "type": "definition",
    "unit": "economic_and_social_indicators",
    "topic": "income_inequality_measures",
    "subtopic": "econ_term_definition",
    "skills": [
      "define_economic_term"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 13,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- A value close to 0 means income is spread almost equally; close to 1 means it is concentrated in few hands."
  },
  {
    "name": "Question 14",
    "question": "Give the term for the ratio of the index of export prices to the index of import prices: []",
    "metadata": [
      "Term: ",
      "[ ]"
    ],
    "answer": [
      "terms of trade",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "text",
    "type": "definition",
    "unit": "foreign_exchange_and_bop",
    "topic": "terms_of_trade",
    "subtopic": "econ_term_definition",
    "skills": [
      "define_economic_term"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 14,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- It compares what a country earns per unit exported with what it pays per unit imported."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "1.1.1",
      "marks": 2,
      "clues": "- Decide whether the cause of the fluctuation sits inside the market system or outside it.",
      "approach": "- Read the words \"forces inside the market system\".\n- Match the origin of the cycle to the explanation that blames internal forces.",
      "solution": "1. The question describes fluctuations caused by forces inside the market system.\n2. Explanations that blame internal forces are called endogenous, so option A is correct.\n3. Exogenous explanations blame outside shocks, so B is wrong; the other two options name approaches rather than a place of origin."
    },
    {
      "number": "1.1.2",
      "marks": 2,
      "clues": "- Think about what a household can do with an extra rand of income.",
      "approach": "- Recall that the propensities describe the shares of extra income spent and saved.\n- Add the two shares together.",
      "solution": "1. In a two-sector model, additional income is either consumed or saved.\n2. So mpc + mps accounts for the whole additional rand and equals 1.\n3. The answer is B."
    },
    {
      "number": "1.1.3",
      "marks": 2,
      "clues": "- Look for the cause that describes rules coming before service.",
      "approach": "- Pick out the key phrase: too many rules and procedures at the cost of service.\n- Match it to the public sector failure cause with that meaning.",
      "solution": "1. Excessive rules and procedures that slow service delivery are known as bureaucracy.\n2. The answer is D; apathy is a lack of concern, rent seeking is using power to gain for oneself, and efficiency is the opposite of the problem described."
    },
    {
      "number": "1.1.4",
      "marks": 2,
      "clues": "- Compare output from the same inputs, not the cost of giving up something else.",
      "approach": "- Notice the phrase \"more output with the same input\".\n- Choose the advantage that is based on absolute productivity.",
      "solution": "1. Producing more output than other countries from the same inputs is an absolute advantage.\n2. Comparative advantage is about lower opportunity cost, so D is wrong; the answer is C."
    },
    {
      "number": "1.1.5",
      "marks": 2,
      "clues": "- Is the duty a percentage of value or a fixed amount per item?",
      "approach": "- Recall the two main types of import duty.\n- Match a fixed amount per unit, weight or size to the correct type.",
      "solution": "1. A tariff levied as a fixed amount per unit, weight or size is a specific tariff.\n2. Ad valorem tariffs are a percentage of value, so A is wrong; the answer is D."
    },
    {
      "number": "1.1.6",
      "marks": 2,
      "clues": "- Think about which tax system takes a larger share from higher earners.",
      "approach": "- Recall how each tax system changes the rate as income rises.\n- Choose the one that redistributes income towards the poor.",
      "solution": "1. A progressive tax system charges higher income earners a higher rate, which redistributes income.\n2. The answer is B."
    },
    {
      "number": "1.1.7",
      "marks": 2,
      "clues": "- The strategy is about making production more competitive.",
      "approach": "- List the industrial strategies named in the options.\n- Match the one whose focus is competitiveness in production.",
      "solution": "1. The Integrated Manufacturing Strategy focuses on improving the competitiveness of production.\n2. The answer is A."
    },
    {
      "number": "1.1.8",
      "marks": 2,
      "clues": "- Recall the working-age band used for the labour force.",
      "approach": "- Remember the lower and upper age limits that define the economically active population.\n- Choose the matching pair.",
      "solution": "1. The economically active population consists of people between 15 and 64.\n2. The answer is C."
    },
    {
      "number": "1.2.1",
      "marks": 1,
      "clues": "- Think about spending by all sectors inside the country’s borders.",
      "approach": "- Read the term as a spending measure.\n- Look for the description about money spent on final goods and services.",
      "solution": "1. Gross domestic expenditure is the amount of money spent on final goods and services within a country.\n2. The answer is G."
    },
    {
      "number": "1.2.2",
      "marks": 1,
      "clues": "- A trend line smooths out short-term movements.",
      "approach": "- Think about what a line drawn through a business-cycle graph shows.\n- Pick the description about direction.",
      "solution": "1. A trend line shows the general direction in which the economy is moving.\n2. The answer is I."
    },
    {
      "number": "1.2.3",
      "marks": 1,
      "clues": "- This is a budget document with a time horizon of several years.",
      "approach": "- Expand the abbreviation in your head.\n- Look for the description that mentions projections of spending and revenue.",
      "solution": "1. The Medium-term Budget Policy Statement gives a three-year rolling expenditure and revenue projection of government.\n2. The answer is E."
    },
    {
      "number": "1.2.4",
      "marks": 1,
      "clues": "- Who sets the price of the currency in this system?",
      "approach": "- Separate \"free-floating\" from \"pegged\".\n- Match it to the description that leaves the price to the market.",
      "solution": "1. In a free-floating system the value of the currency is determined by supply and demand only.\n2. The answer is A; H describes a pegged rate."
    },
    {
      "number": "1.2.5",
      "marks": 1,
      "clues": "- Think about fast-growing economies that are still industrialising.",
      "approach": "- Recall what \"emerging\" implies.\n- Choose the description about rapid growth and industrialisation.",
      "solution": "1. Emerging markets are developing countries undergoing rapid economic growth and industrialisation.\n2. The answer is B."
    },
    {
      "number": "1.2.6",
      "marks": 1,
      "clues": "- The tools involved are interest rates and the quantity of money.",
      "approach": "- Recall which policy uses those tools.\n- Match it to the description that mentions them.",
      "solution": "1. Monetary policy changes interest rates and the money supply to influence the economy.\n2. The answer is F."
    },
    {
      "number": "1.2.7",
      "marks": 1,
      "clues": "- The word \"hub\" suggests a concentration of activity in one place.",
      "approach": "- Think of a place where firms in one sector cluster.\n- Choose the geographic description.",
      "solution": "1. An industrial hub is a geographical area with a cluster of businesses in a specific sector.\n2. The answer is D."
    },
    {
      "number": "1.2.8",
      "marks": 1,
      "clues": "- Productivity compares what is produced with what is put in.",
      "approach": "- Recall the definition of productivity.\n- Pick the description linking output and inputs.",
      "solution": "1. Productivity is the relationship between real output and factor input.\n2. The answer is C."
    },
    {
      "number": "1.3.1",
      "marks": 1,
      "clues": "- Count how many quarters of falling real GDP the description requires.",
      "approach": "- Identify the business-cycle phase described.\n- Write the full term only.",
      "solution": "1. Two or more consecutive quarters of falling real GDP is a recession."
    },
    {
      "number": "1.3.2",
      "marks": 1,
      "clues": "- It shows what happens to revenue as the tax rate increases.",
      "approach": "- Recall the curve linking tax rates and tax revenue.\n- Give its full name.",
      "solution": "1. The curve relating tax rates to tax revenue is the Laffer curve."
    },
    {
      "number": "1.3.3",
      "marks": 1,
      "clues": "- Goods and services cross national borders.",
      "approach": "- Think of the most general term for trade between countries.\n- Either accepted wording scores.",
      "solution": "1. The exchange of goods and services between countries is international trade (foreign trade is also accepted)."
    },
    {
      "number": "1.3.4",
      "marks": 1,
      "clues": "- The aim is to shield local producers.",
      "approach": "- Recall the trade policy opposed to free trade.\n- Give the term, not an example such as a tariff.",
      "solution": "1. A trade policy that safeguards local industries against unfair foreign competition is protectionism."
    },
    {
      "number": "1.3.5",
      "marks": 1,
      "clues": "- This is the part of land reform that pays back people who lost land because of past laws.",
      "approach": "- Separate the three land reform programmes.\n- Pick the compensating one.",
      "solution": "1. Land restitution compensates people who lost their land through discriminatory laws of the past."
    },
    {
      "number": "1.3.6",
      "marks": 1,
      "clues": "- These indicators describe the size and structure of a population.",
      "approach": "- Recall the kinds of social indicator.\n- Pick the one about population size and structure.",
      "solution": "1. Social indicators that describe the size and structure of a population are demographic indicators."
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
