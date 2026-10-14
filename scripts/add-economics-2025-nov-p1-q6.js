#!/usr/bin/env node
/**
 * DBE Economics P1 — November 2025 — Question 6 (order 6)
 * Section C essay (Economic pursuits): South African regional development initiatives (SDIs, IDZs, SEZs, corridors) and
 * government incentives for industrial development. DESIGN-ECON-06: no free text; content items follow the memo's headings,
 * strategy items follow the printed rubric. The memo's model prose is paraphrased, never quoted.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-economics-2025-nov-p1-q6.js --curriculum temp/curriculum-vocab-economics.json
 *   node scripts/add-economics-2025-nov-p1-q6.js --dry-run
 *   node scripts/add-economics-2025-nov-p1-q6.js
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
  "name": "Question 6",
  "syllabus": "dbe",
  "subject": "economics",
  "year": 2025,
  "paper": "nov_p1",
  "order": 6,
  "content_tier": "free",
  "has_video": false,
  "xp": 40,
  "tags": [
    "regional_development",
    "industrial_incentives",
    "special_economic_zones",
    "essay_structure"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q6/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q6/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q6/memo_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/economics/2025/nov_p1/q6/memo_3.png"
  ],
  "exam_question_marks": 40,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Match each regional development initiative to the description that fits it.",
    "metadata": [
      "A - Spatial Development Initiative (SDI)",
      "B - Industrial Development Zone (IDZ)",
      "C - Special Economic Zone (SEZ)",
      "D - Development corridor",
      "1 - Links economic hubs and promotes development in areas with high poverty and unemployment",
      "2 - A purpose-built, enclosed industrial estate linked to an international port",
      "3 - A demarcated area with identified activities and tax relief, serving domestic and export markets",
      "4 - A strip of land with infrastructure that gives businesses access between areas"
    ],
    "answer": [
      "A-1",
      "B-2",
      "C-3",
      "D-4"
    ],
    "presentation": "match",
    "type": "definition",
    "unit": "growth_and_development",
    "topic": "regional_development",
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
    "clues": "- Two of these initiatives are zones, and the key difference is the link to a port.\n- The corridor is defined by the passage it provides."
  },
  {
    "name": "Question 2",
    "question": "Which regional development initiative allows businesses to import production-related raw materials duty-free and is linked to an international air or sea port?",
    "metadata": [
      "Spatial Development Initiative",
      "Industrial Development Zone",
      "Special Economic Zone",
      "Development corridor",
      ""
    ],
    "answer": [
      "Industrial Development Zone",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "growth_and_development",
    "topic": "regional_development",
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
    "clues": "- One of the zone types is not necessarily linked to a port, so it does not fit."
  },
  {
    "name": "Question 3",
    "question": "Which statement describes how Spatial Development Initiatives typically use public-private partnerships?",
    "metadata": [
      "Government builds the factories and private firms build the roads",
      "Private firms provide all infrastructure and government provides labour",
      "Private firms provide capital for factories and labour, while government provides infrastructure such as roads and water supply",
      "Foreign governments fund both factories and roads",
      ""
    ],
    "answer": [
      "Private firms provide capital for factories and labour, while government provides infrastructure such as roads and water supply",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "growth_and_development",
    "topic": "regional_development",
    "subtopic": "econ_cause_and_effect",
    "skills": [
      "explain_economic_impact"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Think about which partner can supply public infrastructure and which supplies business capital."
  },
  {
    "name": "Question 4",
    "question": "Select ALL the benefits that businesses located in an Industrial Development Zone (IDZ) enjoy.",
    "metadata": [
      "Duty-free importation of production-related inputs",
      "Dedicated customs services that speed up inspection and clearing",
      "World-class infrastructure and a zero rate of VAT on supplies from South African sources",
      "Exemption from all labour laws",
      "Guaranteed sales to government"
    ],
    "answer": [
      "Duty-free importation of production-related inputs",
      "Dedicated customs services that speed up inspection and clearing",
      "World-class infrastructure and a zero rate of VAT on supplies from South African sources",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "growth_and_development",
    "topic": "regional_development",
    "subtopic": "econ_policy_evaluation",
    "skills": [
      "evaluate_economic_policy"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- The benefits help export-driven producers cut costs and move goods quickly.\n- Two options are unrealistic exemptions or guarantees."
  },
  {
    "name": "Question 5",
    "question": "Which of the following is an example of a development corridor in South Africa?",
    "metadata": [
      "The Coega zone",
      "The Saldanha Bay zone",
      "The East London zone",
      "The Maputo development corridor",
      ""
    ],
    "answer": [
      "The Maputo development corridor",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "growth_and_development",
    "topic": "regional_development",
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
    "clues": "- Three options are named zones linked to ports, not corridors."
  },
  {
    "name": "Question 6",
    "question": "Select ALL the incentives government can use to promote industrial development.",
    "metadata": [
      "Tax holidays or reduced corporate taxes",
      "Subsidies on capital investment",
      "Cash grants or low-interest loans for expansion and new technology",
      "Higher corporate taxes for new industries",
      "Cutting infrastructure spending for industrial parks"
    ],
    "answer": [
      "Tax holidays or reduced corporate taxes",
      "Subsidies on capital investment",
      "Cash grants or low-interest loans for expansion and new technology",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "growth_and_development",
    "topic": "industrial_incentives",
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
    "clues": "- An incentive lowers the cost or raises the reward of investing in an industry.\n- Two options would make investing more costly."
  },
  {
    "name": "Question 7",
    "question": "How can simplifying business registration help industrial development?",
    "metadata": [
      "It raises the cost of starting a business",
      "It removes bureaucratic hurdles so industries can start and grow more efficiently",
      "It reduces the number of firms in each industry",
      "It makes licences harder to obtain",
      ""
    ],
    "answer": [
      "It removes bureaucratic hurdles so industries can start and grow more efficiently",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "growth_and_development",
    "topic": "industrial_incentives",
    "subtopic": "econ_cause_and_effect",
    "skills": [
      "explain_economic_impact"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 7,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Think about the time and cost a new firm spends before it can operate."
  },
  {
    "name": "Question 8",
    "question": "Which of the following is an export incentive?",
    "metadata": [
      "A tariff on imported inputs",
      "A ban on foreign competitors",
      "Information on export markets and concessions on transport charges",
      "A higher VAT rate on locally sold goods",
      ""
    ],
    "answer": [
      "Information on export markets and concessions on transport charges",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "growth_and_development",
    "topic": "industrial_incentives",
    "subtopic": "econ_classification",
    "skills": [
      "classify_economic_concept"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 8,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- An export incentive helps local firms sell abroad."
  },
  {
    "name": "Question 9",
    "question": "Which opening sentence would earn the introduction mark for an essay on regional development?",
    "metadata": [
      "Discuss in detail South African initiatives in regional development",
      "I will discuss SDIs, IDZs, SEZs and corridors in my essay",
      "South Africa is a beautiful country with many regions",
      "Regional development is the use of policies to improve the economic livelihood of less developed areas of a country",
      ""
    ],
    "answer": [
      "Regional development is the use of policies to improve the economic livelihood of less developed areas of a country",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "growth_and_development",
    "topic": "regional_development",
    "subtopic": "econ_essay_structure",
    "skills": [
      "structure_economics_essay"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 9,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- A good introduction defines the main concept of the topic.\n- It should not repeat the question or announce what comes next."
  },
  {
    "name": "Question 10",
    "question": "Arrange the parts of this essay in the order in which they should be written.",
    "metadata": [
      "Conclusion with a judgement and a recommendation",
      "Main part: SDIs, IDZs, SEZs and corridors, each under its own heading",
      "Introduction that defines regional development",
      "Additional part: how incentives promote industrial development"
    ],
    "answer": [
      "Introduction that defines regional development",
      "Main part: SDIs, IDZs, SEZs and corridors, each under its own heading",
      "Additional part: how incentives promote industrial development",
      "Conclusion with a judgement and a recommendation"
    ],
    "presentation": "ordering",
    "type": "ordering",
    "unit": "growth_and_development",
    "topic": "regional_development",
    "subtopic": "econ_essay_structure",
    "skills": [
      "structure_economics_essay"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 10,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Follow the printed rubric: introduction, body (main part then additional part), conclusion."
  },
  {
    "name": "Question 11",
    "question": "A candidate lists five SDIs by name and says nothing else about them. At most how many marks can the examples of SDIs earn?",
    "metadata": [
      "0",
      "1",
      "5",
      "8",
      ""
    ],
    "answer": [
      "1",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "growth_and_development",
    "topic": "regional_development",
    "subtopic": "econ_essay_structure",
    "skills": [
      "structure_economics_essay"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 11,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Examples are only worth marks when linked to explained facts, and the memo caps them tightly."
  },
  {
    "name": "Question 12",
    "question": "Which approach best answers the 10-mark question \"How can the government use incentives to promote industrial development?\"",
    "metadata": [
      "List the names of incentives without explanation",
      "Describe only one incentive in great detail",
      "Repeat the regional development initiatives from the main part",
      "Give several developed measures, each explaining how it encourages industry",
      ""
    ],
    "answer": [
      "Give several developed measures, each explaining how it encourages industry",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "growth_and_development",
    "topic": "industrial_incentives",
    "subtopic": "econ_essay_structure",
    "skills": [
      "structure_economics_essay"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 12,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- A \"how can\" question asks you to show the link between the measure and the outcome.\n- Mere listing earns very few marks."
  },
  {
    "name": "Question 13",
    "question": "Which conclusion is higher-order?",
    "metadata": [
      "In conclusion, I discussed SDIs, IDZs, SEZs and corridors",
      "Regional zones can ease unemployment where it is highest, yet their success depends on skills and infrastructure, so incentives should be linked to training",
      "Regional development is a very interesting topic",
      "That is all I know about the topic",
      ""
    ],
    "answer": [
      "Regional zones can ease unemployment where it is highest, yet their success depends on skills and infrastructure, so incentives should be linked to training",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "growth_and_development",
    "topic": "regional_development",
    "subtopic": "econ_essay_structure",
    "skills": [
      "structure_economics_essay"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 13,
    "syllabus": "dbe",
    "subject": "economics",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- A higher-order conclusion adds a judgement or recommendation.\n- A bare recap of what was already said does not."
  }
];

// ─── AI explanation — 1:1 with the REAL exam's numbered sub-questions (AIEXP-08) ─

const aiExplanation = {
  "sub_questions": [
    {
      "number": "6",
      "marks": 40,
      "clues": "- Plan the essay in the paper’s own structure: introduction, main part, additional part, conclusion.\n- Headings and examples earn at most 8 of the 26 main-part marks, and examples of SDIs and IDZs earn at most 1 mark each.",
      "approach": "- Define regional development in the introduction without repeating the question.\n- Give each initiative its own heading with developed points.\n- Answer the 10-mark \"how\" question with explained incentives, not a list.\n- Finish with a higher-order conclusion.",
      "solution": "1. Introduction (max 2): regional development is policy aimed at improving less developed areas.\n2. Spatial Development Initiatives: link economic hubs, target areas with high poverty and unemployment, attract private and foreign investment with incentives, use public-private partnerships, and are led by the DTIC and the Department of Transport.\n3. Industrial Development Zones: purpose-built estates linked to ports, duty-free imported inputs, dedicated customs, VAT and tax relief, world-class infrastructure, export-driven and job-creating.\n4. Special Economic Zones: demarcated areas with tax relief and support, serving domestic and export markets and not necessarily linked to a port; existing IDZs may graduate to SEZs.\n5. Corridors: land passages with infrastructure that favour mining, manufacturing and transport, such as the Maputo development corridor (main part max 26).\n6. Additional part (max 10): incentives such as lower corporate taxes and tax holidays, capital subsidies, grants and low-interest loans, infrastructure investment, simpler registration, export incentives, duty-free inputs, skills funding and small business support.\n7. Conclusion (max 2): regional development tackles long-term unemployment and poverty, although skills shortages and high costs remain constraints."
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
