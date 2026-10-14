#!/usr/bin/env node
/**
 * DBE Economics P1 — November 2025 — Question 4 (order 4)
 * Macroeconomics and economic pursuits: demand reasons for trade, public sector failure (a cartoon-style scenario), VAT and
 * privatisation, the EPWP and the NDP, free-trade arguments and restrictive fiscal policy. DESIGN-ECON-02 (choice items against
 * the memo's point lists), DESIGN-ECON-05 (the cartoon and extract stimuli are re-described in fresh scenarios inside the question
 * text; no copy of the paper's cartoon), DESIGN-ECON-04 (fresh VAT arithmetic).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2025-nov-p1-q4.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2025-nov-p1-q4.js --dry-run
 *   node scripts/add-economics-2025-nov-p1-q4.js
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
  "name": "Question 4",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2025,
  "paper": "nov_p1",
  "order": 4,
  "content_tier": "free",
  "has_video": false,
  "xp": 40,
  "tags": [
    "international_trade",
    "public_sector_failure",
    "vat",
    "public_works",
    "fiscal_policy"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q4/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q4/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q4/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q4/memo_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q4/memo_3.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q4/memo_4.png"
  ],
  "exam_question_marks": 40,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Select ALL the demand-side reasons why countries trade with each other.",
    "metadata": [
      "Differences in the preferences and tastes of consumers",
      "Differences in income levels between countries",
      "Differences in the size of populations",
      "A country has a surplus of a natural resource",
      "Production costs are lower in another country"
    ],
    "answer": [
      "Differences in the preferences and tastes of consumers",
      "Differences in income levels between countries",
      "Differences in the size of populations",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "definition",
    "unit": "foreign_exchange_and_bop",
    "topic": "reasons_for_international_trade",
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
    "clues": "- Demand reasons come from buyers: what they want, how much they earn and how many there are.\n- Two options describe the supply side, such as resources and costs."
  },
  {
    "name": "Question 2",
    "question": "Which measure is most likely to raise literacy levels in a developing country?",
    "metadata": [
      "Reducing the funding available to poor communities",
      "Making school attendance voluntary for all children",
      "Closing rural schools to save money",
      "Building more schools and widening access to education",
      ""
    ],
    "answer": [
      "Building more schools and widening access to education",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "economic_and_social_indicators",
    "topic": "social_indicators",
    "subtopic": "econ_policy_evaluation",
    "skills": [
      "evaluate_economic_policy"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Literacy depends on how many children can reach good teaching.\n- Three options would make access worse."
  },
  {
    "name": "Question 3",
    "question": "A cartoon shows officials ignoring a leaking water pipe while a sign on the wall reads \"Not my department\". Which factor that contributes to poor public sector provisioning does this illustrate?",
    "metadata": [
      "Excess competition between service providers",
      "Lack of accountability",
      "An oversupply of public goods",
      "Too many private suppliers",
      ""
    ],
    "answer": [
      "Lack of accountability",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "interpretation",
    "unit": "public_sector",
    "topic": "public_sector_failure",
    "subtopic": "econ_data_interpretation",
    "skills": [
      "interpret_economic_data"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Ask who is taking responsibility for the problem in the picture.\n- Three options describe a surplus of providers, which is the opposite of what the sign shows."
  },
  {
    "name": "Question 4",
    "question": "A municipal park is open to everyone free of charge and is paid for through taxes and rates. Which type of public good is it?",
    "metadata": [
      "Quasi-public good",
      "Private good",
      "Community (collective) good",
      "Demerit good",
      ""
    ],
    "answer": [
      "Community (collective) good",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "public_sector",
    "topic": "public_goods_and_free_riders",
    "subtopic": "econ_classification",
    "skills": [
      "classify_economic_concept"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Focus on the fact that no one is charged to use it.\n- Goods for which users pay a fee fall in a different category."
  },
  {
    "name": "Question 5",
    "question": "Which of the following is a likely effect on businesses when the government increases value-added tax (VAT)?",
    "metadata": [
      "Demand for goods may fall, reducing sales revenue",
      "Sales revenue rises automatically because prices rise",
      "Businesses pay less tax in total",
      "Businesses no longer need to adjust their prices",
      ""
    ],
    "answer": [
      "Demand for goods may fall, reducing sales revenue",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "public_sector",
    "topic": "taxation_systems",
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
    "clues": "- VAT is built into the prices consumers pay.\n- Think about how buyers respond when prices rise."
  },
  {
    "name": "Question 6",
    "question": "Select ALL the ways in which privatising a state-owned enterprise can benefit the government.",
    "metadata": [
      "The sale of public assets raises revenue",
      "It reduces the fiscal burden and state borrowing",
      "It can help to achieve empowerment goals through wider ownership of businesses",
      "The government keeps all future profits of the enterprise",
      "The government must increase its subsidies to the enterprise"
    ],
    "answer": [
      "The sale of public assets raises revenue",
      "It reduces the fiscal burden and state borrowing",
      "It can help to achieve empowerment goals through wider ownership of businesses",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "public_sector",
    "topic": "privatisation",
    "subtopic": "econ_policy_evaluation",
    "skills": [
      "evaluate_economic_policy"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 6,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Privatisation moves ownership from the state to private owners.\n- Two options describe what the government keeps or pays, which privatisation removes."
  },
  {
    "name": "Question 7",
    "question": "An extract explains that a municipal programme will pay unemployed rural women to maintain school buildings and clear alien plants from rivers. Which socio-economic problem is the programme mainly addressing?",
    "metadata": [
      "Inflation",
      "A balance of payments deficit",
      "Market concentration",
      "Unemployment",
      ""
    ],
    "answer": [
      "Unemployment",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "interpretation",
    "unit": "growth_and_development",
    "topic": "public_works_and_development_policy",
    "subtopic": "econ_data_interpretation",
    "skills": [
      "interpret_economic_data"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 7,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Look at who is being paid and why they were not earning before."
  },
  {
    "name": "Question 8",
    "question": "Which of the following is a goal of the National Development Plan (NDP)?",
    "metadata": [
      "Replacing the rand with a regional currency",
      "Eliminating poverty and reducing inequality by 2030",
      "Nationalising all private firms",
      "Abolishing income tax",
      ""
    ],
    "answer": [
      "Eliminating poverty and reducing inequality by 2030",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "growth_and_development",
    "topic": "public_works_and_development_policy",
    "subtopic": "econ_term_definition",
    "skills": [
      "define_economic_term"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 8,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- The plan’s goals deal with living standards over a long period.\n- Three options are extreme measures that do not appear in the plan."
  },
  {
    "name": "Question 9",
    "question": "Which of the following production methods is labour-intensive?",
    "metadata": [
      "A fully automated bottling plant with a handful of technicians",
      "A robotic car assembly line",
      "A road crew using spades and wheelbarrows and employing many workers",
      "A data centre run by a small team",
      ""
    ],
    "answer": [
      "A road crew using spades and wheelbarrows and employing many workers",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "growth_and_development",
    "topic": "public_works_and_development_policy",
    "subtopic": "econ_classification",
    "skills": [
      "classify_economic_concept"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 9,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Compare how much human effort is used with how much machinery is used."
  },
  {
    "name": "Question 10",
    "question": "Select ALL the ways in which poor infrastructure can slow down economic growth.",
    "metadata": [
      "Ageing roads disrupt the distribution of inputs and final goods",
      "High operating costs discourage domestic and foreign investment",
      "Unreliable energy supply forces businesses to produce less",
      "It lowers the cost of doing business",
      "It attracts more investors to the area"
    ],
    "answer": [
      "Ageing roads disrupt the distribution of inputs and final goods",
      "High operating costs discourage domestic and foreign investment",
      "Unreliable energy supply forces businesses to produce less",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "growth_and_development",
    "topic": "infrastructure_and_growth",
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
    "clues": "- Infrastructure carries goods, power and communication for businesses.\n- Two options describe the effect of good infrastructure."
  },
  {
    "name": "Question 11",
    "question": "Match each feature of a public works programme to the way it helps raise living standards.",
    "metadata": [
      "A - Temporary jobs",
      "B - Training for participants",
      "C - Income plus new skills",
      "1 - Gives poor households a source of income",
      "2 - Builds skills that can lead to permanent jobs",
      "3 - Lets households start small businesses and so reduces poverty"
    ],
    "answer": [
      "A-1",
      "B-2",
      "C-3"
    ],
    "presentation": "match",
    "type": "application",
    "unit": "growth_and_development",
    "topic": "public_works_and_development_policy",
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
    "clues": "- Each feature has a direct, distinct benefit for a household.\n- The third pair combines the first two to reach a longer-term outcome."
  },
  {
    "name": "Question 12",
    "question": "Select ALL the arguments that support free trade.",
    "metadata": [
      "Countries specialise in goods with a lower opportunity cost, which raises world output",
      "Competition pushes firms to adopt new technology and cut costs",
      "Resources are not wasted on goods that other countries produce more efficiently",
      "It protects young industries from foreign competition",
      "It reduces imports in order to save local jobs"
    ],
    "answer": [
      "Countries specialise in goods with a lower opportunity cost, which raises world output",
      "Competition pushes firms to adopt new technology and cut costs",
      "Resources are not wasted on goods that other countries produce more efficiently",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "protection_and_free_trade",
    "topic": "free_trade_arguments",
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
    "clues": "- Free trade arguments are about efficiency and competition.\n- Two options are arguments for protectionism."
  },
  {
    "name": "Question 13",
    "question": "Select ALL the fiscal policy measures that would help to dampen an overheating economy.",
    "metadata": [
      "Cutting government spending on infrastructure projects",
      "Raising personal income tax",
      "Raising indirect taxes such as VAT and excise duties",
      "Cutting company tax",
      "Raising subsidies to businesses"
    ],
    "answer": [
      "Cutting government spending on infrastructure projects",
      "Raising personal income tax",
      "Raising indirect taxes such as VAT and excise duties",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "public_sector",
    "topic": "fiscal_and_monetary_policy",
    "subtopic": "econ_policy_evaluation",
    "skills": [
      "evaluate_economic_policy"
    ],
    "difficulty": 4,
    "exam_weight": 2,
    "xp": 10,
    "order": 13,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Dampening means lowering total spending in the economy.\n- Two options would put more money in the hands of firms."
  },
  {
    "name": "Question 14",
    "question": "In which phase of the business cycle would government normally use restrictive fiscal policy?",
    "metadata": [
      "Depression",
      "Prosperity (the peak of the upswing)",
      "Recovery",
      "Recession",
      ""
    ],
    "answer": [
      "Prosperity (the peak of the upswing)",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "business_cycles",
    "topic": "business_cycle_policy",
    "subtopic": "econ_classification",
    "skills": [
      "classify_economic_concept"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 14,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Restrictive policy cools spending, so the economy must be running hot."
  },
  {
    "name": "Question 15",
    "question": "A product costs R400 before VAT. Calculate the price the consumer pays when VAT is charged at 15% (in rand): []",
    "metadata": [
      "Price including VAT (R): ",
      "[ ]"
    ],
    "answer": [
      "460",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "keyboard_type": "standard_math",
    "type": "calc",
    "unit": "public_sector",
    "topic": "taxation_systems",
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
    "clues": "- Find 15% of the price before VAT first.\n- Add that tax to the original price."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "4.1.1",
      "marks": 2,
      "clues": "- Demand reasons come from consumers in the importing country.",
      "approach": "- Recall the demand-side reasons.\n- Name any two.",
      "solution": "1. Examples include the size of the population, income levels, change in wealth, preferences and tastes, and differences in consumption patterns.\n2. Any two correct reasons earn the two marks."
    },
    {
      "number": "4.1.2",
      "marks": 2,
      "clues": "- Consider government action on schools and funding.",
      "approach": "- Give one clear measure.\n- State how it would raise literacy.",
      "solution": "1. Government can build more schools and increase access to education.\n2. It can also fund marginalised communities, run reading programmes for the early grades or make schooling compulsory."
    },
    {
      "number": "4.2.1",
      "marks": 1,
      "clues": "- The factor appears as a label on the cartoon.",
      "approach": "- Read the labels on the picture.\n- Choose one that explains poor provisioning.",
      "solution": "1. The cartoon labels accountability as a factor contributing to poor public sector provisioning."
    },
    {
      "number": "4.2.2",
      "marks": 1,
      "clues": "- These goods are paid for through taxes and not charged to users.",
      "approach": "- Recall the type of public goods provided free.\n- Name them.",
      "solution": "1. Public goods supplied free of charge are community goods."
    },
    {
      "number": "4.2.3",
      "marks": 2,
      "clues": "- The government fails in managing its own resources and duties.",
      "approach": "- Define public sector failure.\n- Mention quantity or quality of provision.",
      "solution": "1. Public sector failure occurs when government fails to manage the economy and the resources under its control optimally.\n2. It also occurs when government fails to supply public goods in the desired quantity and quality."
    },
    {
      "number": "4.2.4",
      "marks": 2,
      "clues": "- Think about prices and demand after a VAT increase.",
      "approach": "- State one effect on costs or sales.\n- Add its consequence.",
      "solution": "1. Businesses may incur extra costs adjusting the prices of VAT-linked goods and services.\n2. Higher prices may lower demand, which leads to a decline in sales revenue."
    },
    {
      "number": "4.2.5",
      "marks": 4,
      "clues": "- Think about what the government receives and saves when it sells assets.",
      "approach": "- Choose two benefits.\n- Develop each into a full sentence (2 x 2).",
      "solution": "1. Privatisation reduces the fiscal burden and state borrowing because selling public assets raises revenue.\n2. It may widen the tax base and increase tax revenue.\n3. It helps achieve developmental goals such as black economic empowerment through wider ownership.\n4. The immediate income can be used to reduce state debt."
    },
    {
      "number": "4.3.1",
      "marks": 1,
      "clues": "- The extract mentions the people the programme is meant to help and the burden they carry.",
      "approach": "- Read the second paragraph.\n- Pick the socio-economic problem named.",
      "solution": "1. The extract says the programme will create job opportunities for communities burdened by low growth and unemployment, so the problem is unemployment."
    },
    {
      "number": "4.3.2",
      "marks": 1,
      "clues": "- It is a long-term national plan with a target year of 2030.",
      "approach": "- Recall the policy with the 2030 target.\n- Give its name.",
      "solution": "1. The growth and development policy aiming to eliminate poverty and reduce inequality by 2030 is the National Development Plan (NDP)."
    },
    {
      "number": "4.3.3",
      "marks": 2,
      "clues": "- Compare the use of labour with the use of capital.",
      "approach": "- Define the term.\n- Contrast human effort with machinery.",
      "solution": "1. Labour-intensive describes processes or tasks that need more human effort than capital to produce goods and services."
    },
    {
      "number": "4.3.4",
      "marks": 2,
      "clues": "- Think about transport, energy and the cost of operating a business.",
      "approach": "- Choose one effect of poor infrastructure.\n- Link it to growth.",
      "solution": "1. Poor infrastructure such as ageing roads disrupts the distribution of inputs and goods, lowering production and growth.\n2. It also discourages investment because operating costs are higher, and poor energy supply forces businesses to produce less."
    },
    {
      "number": "4.3.5",
      "marks": 4,
      "clues": "- Consider income, skills and small businesses.",
      "approach": "- Give two distinct ways.\n- Explain each (2 x 2).",
      "solution": "1. The EPWP provides temporary employment, which creates income for disadvantaged households.\n2. It offers skills development so participants can be absorbed into the labour market.\n3. It contributes to poverty alleviation by helping households to start small businesses with the skills acquired."
    },
    {
      "number": "4.4",
      "marks": 8,
      "clues": "- Give two developed points on each argument.\n- A bare list of facts is capped at 4 marks.",
      "approach": "- Explain specialisation through comparative advantage and opportunity cost.\n- Explain innovation through competition and technology.\n- Develop each with an effect on output, costs or living standards.",
      "solution": "1. Specialisation: countries that specialise in goods with a comparative advantage raise world output and consumption.\n2. It lowers opportunity cost, raises efficiency and prevents wasted resources.\n3. Innovation: free trade increases competition, which gives firms an incentive to innovate and introduce new products for export.\n4. Competition on international markets forces businesses to adopt the latest technology and improve quality and reliability."
    },
    {
      "number": "4.5",
      "marks": 8,
      "clues": "- Restrictive fiscal policy is used in the prosperity phase.\n- Give four developed measures, each with its effect on spending.",
      "approach": "- Name the type of policy and when it is used.\n- List measures on government spending, taxes, grants and subsidies.\n- Explain how each lowers aggregate demand.",
      "solution": "1. Restrictive (contractionary) fiscal policy is used during the prosperity phase to dampen the economy.\n2. Cutting government spending on infrastructure, or public sector wages, lowers demand for goods and services.\n3. Raising business tax, personal income tax and indirect taxes such as VAT and excise duties reduces profit prospects, disposable income and spending.\n4. Cutting social grants and subsidies lowers household income and raises production costs; incentives for saving encourage people to spend less.\n5. Mere listing earns at most 2 marks."
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
