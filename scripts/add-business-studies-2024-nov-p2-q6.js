#!/usr/bin/env node
/**
 * DBE Business Studies P2 — November 2024 — Question 6 (order 6)
 * Business Roles (Social responsibility and CSR/CSI) — essay question, Section C.
 * DESIGN-BUS-03: no free-text essay input exists in the app — practice questions teach the essay content
 * (purpose of CSI, impact of CSR on communities, social responsibility and the triple bottom line, dealing with
 * unemployment) plus the essay-strategy skill objectively, grounded in the real memo's LASO rubric.
 * Never a free-text/model-essay item; never verbatim memo prose.
 * The question paper prints Q5 and Q6 on one page (p. 9): Q6 reuses Q5's question image, same convention as 2025.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 *   node tools/validate-questions.js --script scripts/add-business-studies-2024-nov-p2-q6.js --curriculum temp/curriculum-vocab-business-studies-p2-2024.json
 *   node scripts/add-business-studies-2024-nov-p2-q6.js --dry-run
 *   node scripts/add-business-studies-2024-nov-p2-q6.js
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
  "subject": "business_studies",
  "year": 2024,
  "paper": "nov_p2",
  "order": 6,
  "content_tier": "free",
  "has_video": false,
  "xp": 40,
  "tags": [
    "corporate_social_responsibility",
    "socio_economic_issues",
    "essay_writing_skills"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2024/nov_p2/q5/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2024/nov_p2/q6/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2024/nov_p2/q6/memo_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2024/nov_p2/q6/memo_3.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/business_studies/2024/nov_p2/q6/memo_4.png"
  ],
  "exam_question_marks": 40,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Which THREE of the following describe the purpose of corporate social investment (CSI)?",
    "metadata": [
      "To contribute to the sustainable development of communities",
      "To increase the dividends paid to shareholders this year",
      "To show the business's attitude towards its community",
      "To replace the taxes the business would otherwise pay",
      "To support socio-economic upliftment in South Africa"
    ],
    "answer": [
      "To contribute to the sustainable development of communities",
      "To show the business's attitude towards its community",
      "To support socio-economic upliftment in South Africa",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "definition",
    "unit": "corporate_social_responsibility_and_human_rights",
    "topic": "csr_and_csi",
    "subtopic": "classification_and_criteria",
    "skills": [
      "explain_corporate_social_responsibility"
    ],
    "difficulty": 2,
    "exam_weight": 3,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- CSI is a long-term investment in the community, not in the owners.\n- It does not replace the business's legal duty to pay tax."
  },
  {
    "name": "Question 2",
    "question": "What is the main difference between corporate social responsibility (CSR) and corporate social investment (CSI)?",
    "metadata": [
      "CSR applies only to the government; CSI applies only to private businesses",
      "CSR is the overall duty to act responsibly; CSI is spending on specific projects",
      "CSR is a once-off donation; CSI is a legal fine paid for harming the community",
      "CSR deals only with employees; CSI deals only with the natural environment",
      ""
    ],
    "answer": [
      "CSR is the overall duty to act responsibly; CSI is spending on specific projects",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "corporate_social_responsibility_and_human_rights",
    "topic": "csr_and_csi",
    "subtopic": "term_definition_recall",
    "skills": [
      "explain_corporate_social_responsibility"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- One is the business's general approach; the other is how it puts money and time into projects.\n- Both apply to employees, communities and the environment."
  },
  {
    "name": "Question 3",
    "question": "Which THREE of the following are POSITIVE impacts of CSR on communities?",
    "metadata": [
      "Bursaries improve the skills of community members",
      "Communities may become dependent on CSR programmes",
      "Investment in clinics improves the community's health",
      "Benefits may not reach the people they were meant for",
      "Training increases community members' chances of employment"
    ],
    "answer": [
      "Bursaries improve the skills of community members",
      "Investment in clinics improves the community's health",
      "Training increases community members' chances of employment",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "corporate_social_responsibility_and_human_rights",
    "topic": "csr_and_csi",
    "subtopic": "classification_and_criteria",
    "skills": [
      "explain_corporate_social_responsibility"
    ],
    "difficulty": 2,
    "exam_weight": 3,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- A positive impact leaves the community better off.\n- Two options describe ways CSR can go wrong."
  },
  {
    "name": "Question 4",
    "question": "Which TWO of the following are NEGATIVE impacts of CSR on communities?",
    "metadata": [
      "Better school facilities are built in poor areas",
      "Communities may not afford to maintain buildings once funding ends",
      "Socio-economic issues such as poverty receive attention",
      "Sharing scarce resources among a few people may cause discrimination",
      "Development programmes improve entrepreneurial skills"
    ],
    "answer": [
      "Communities may not afford to maintain buildings once funding ends",
      "Sharing scarce resources among a few people may cause discrimination",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "corporate_social_responsibility_and_human_rights",
    "topic": "csr_and_csi",
    "subtopic": "classification_and_criteria",
    "skills": [
      "explain_corporate_social_responsibility"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- A negative impact is a problem that CSR creates or leaves behind.\n- Think about what happens when the money stops, and who is left out."
  },
  {
    "name": "Question 5",
    "question": "Match each element of the triple bottom line in Column A to the socially responsible action in Column B.",
    "metadata": [
      "A - Profit",
      "B - People",
      "C - Planet",
      "1 - Avoid making profit at the expense of the community",
      "2 - Invest in projects that uplift employees and communities",
      "3 - Use eco-friendly production methods and recycle waste"
    ],
    "answer": [
      "A-1",
      "B-2",
      "C-3"
    ],
    "presentation": "match",
    "type": "definition",
    "unit": "corporate_social_responsibility_and_human_rights",
    "topic": "csr_and_csi",
    "subtopic": "term_definition_recall",
    "skills": [
      "explain_corporate_social_responsibility"
    ],
    "difficulty": 2,
    "exam_weight": 3,
    "xp": 10,
    "order": 5,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Profit is the economic element, people the social element, planet the environmental element.\n- Each element names who or what must not be harmed."
  },
  {
    "name": "Question 6",
    "question": "Greenleaf Packaging switches to recycled cardboard and solar power, even though this costs more. Which element of the triple bottom line does this mainly address?",
    "metadata": [
      "Profit",
      "People",
      "All three equally",
      "Planet",
      ""
    ],
    "answer": [
      "Planet",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "corporate_social_responsibility_and_human_rights",
    "topic": "csr_and_csi",
    "subtopic": "scenario_application",
    "skills": [
      "explain_corporate_social_responsibility"
    ],
    "difficulty": 1,
    "exam_weight": 2,
    "xp": 10,
    "order": 6,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Recycling and solar power reduce harm to nature.\n- The extra cost shows the choice is not about profit."
  },
  {
    "name": "Question 7",
    "question": "Which THREE of the following are ways in which businesses can deal with unemployment as a socio-economic issue?",
    "metadata": [
      "Offer learnerships that develop skills",
      "Replace workers with machines to cut costs",
      "Support small businesses so that they can employ more people",
      "Hire staff only from outside the local community",
      "Run entrepreneurship programmes that promote self-employment"
    ],
    "answer": [
      "Offer learnerships that develop skills",
      "Support small businesses so that they can employ more people",
      "Run entrepreneurship programmes that promote self-employment",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "corporate_social_responsibility_and_human_rights",
    "topic": "socio_economic_issues",
    "subtopic": "classification_and_criteria",
    "skills": [
      "explain_corporate_social_responsibility"
    ],
    "difficulty": 2,
    "exam_weight": 3,
    "xp": 10,
    "order": 7,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Look for actions that create jobs or build skills in the community.\n- Two options would make unemployment worse."
  },
  {
    "name": "Question 8",
    "question": "An essay question asks you to outline the purpose of CSI, discuss the impact of CSR on communities, explain the relationship between social responsibility and the triple bottom line, and suggest ways to deal with unemployment. Arrange the paragraphs of your essay in the correct order.",
    "metadata": [
      "Relationship between social responsibility and the triple bottom line",
      "Conclusion",
      "Purpose of CSI",
      "Ways to deal with unemployment",
      "Introduction",
      "Impact of CSR on communities"
    ],
    "answer": [
      "Introduction",
      "Purpose of CSI",
      "Impact of CSR on communities",
      "Relationship between social responsibility and the triple bottom line",
      "Ways to deal with unemployment",
      "Conclusion"
    ],
    "presentation": "ordering",
    "type": "application",
    "unit": "corporate_social_responsibility_and_human_rights",
    "topic": "csr_and_csi",
    "subtopic": "essay_structure_and_argumentation",
    "skills": [
      "sequence_essay_structure"
    ],
    "difficulty": 1,
    "exam_weight": 2,
    "xp": 10,
    "order": 8,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Follow the order of the aspects in the essay question.\n- The essay opens with an introduction and closes with a conclusion."
  },
  {
    "name": "Question 9",
    "question": "Which TWO features does an essay introduction need in order to earn its marks?",
    "metadata": [
      "It repeats a textbook definition word for word",
      "It is headed with the word INTRODUCTION",
      "It covers every fact the body will explain later",
      "It refers to at least two aspects in the candidate's own words",
      "It discusses only one of the aspects in full detail"
    ],
    "answer": [
      "It is headed with the word INTRODUCTION",
      "It refers to at least two aspects in the candidate's own words",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "corporate_social_responsibility_and_human_rights",
    "topic": "csr_and_csi",
    "subtopic": "essay_structure_and_argumentation",
    "skills": [
      "evaluate_essay_layout_compliance"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 9,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- The introduction earns 2 marks, one for each aspect it refers to.\n- Facts repeated from the introduction later in the essay earn no extra marks."
  },
  {
    "name": "Question 10",
    "question": "A candidate answers all four aspects of the essay, but fills one of them with facts that are not relevant to the question. What is the maximum mark the candidate can earn for Synthesis?",
    "metadata": [
      "0 marks",
      "2 marks",
      "8 marks",
      "1 mark",
      ""
    ],
    "answer": [
      "1 mark",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "corporate_social_responsibility_and_human_rights",
    "topic": "csr_and_csi",
    "subtopic": "essay_structure_and_argumentation",
    "skills": [
      "evaluate_essay_layout_compliance"
    ],
    "difficulty": 4,
    "exam_weight": 2,
    "xp": 10,
    "order": 10,
    "syllabus": "dbe",
    "subject": "business_studies",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Synthesis is worth 2 marks and checks that facts are relevant.\n- Full marks need every answered aspect to contain only relevant facts."
  }
];

// ─── AI explanation ───────────────────────────────────────────────────────────

const aiExplanation = {
  "sub_questions": [
    {
      "number": "6",
      "marks": 40,
      "clues": "- Cover all four aspects: the purpose of CSI, the impact of CSR on communities, social responsibility and the triple bottom line, and ways to deal with unemployment.\n- Facts are capped at 32 marks; the other 8 come from Layout, Analysis, Synthesis and Originality (2 each).",
      "approach": "- Write the heading INTRODUCTION and refer to at least two of the aspects in your own words (2 marks).\n- Give each aspect its own heading, in the order the question lists them. Mark guide: purpose of CSI 8, impact of CSR 16, triple bottom line 12, unemployment 10.\n- For impact, discuss positives and/or negatives; for the triple bottom line, link social responsibility to profit, people and planet (element 2 + explanation 2 each).\n- Use at least one real example no older than two years in two of the aspects for Originality.\n- Write the heading CONCLUSION and add one new, relevant point (2 marks).",
      "solution": "1. Introduction: CSI commits money and time to projects that improve lives; CSR's benefits must reach the right people; the triple bottom line measures social and environmental impact as well as profit; businesses must help address unemployment.\n2. Purpose of CSI: sustainable development of communities, a positive role in development, showing the business's attitude to its community, long-term investment, and socio-economic upliftment in South Africa.\n3. Impact of CSR: positives such as bursaries, better schools, clinics and training; negatives such as dependency, unsustained infrastructure, unequal distribution and higher prices to recover costs.\n4. Triple bottom line: profit (do not profit at the community's expense), people (invest in projects that uplift employees and communities), planet (do not harm the environment; recycle and use eco-friendly methods).\n5. Unemployment: learnerships, bursaries, job creation, entrepreneurship programmes and support for small businesses.\n6. Conclusion: a new point, for example that a business which balances all three elements stays sustainable in the long run."
    }
  ],
  "model": "claude-opus-5-5",
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
    console.error(
      '\n   curriculum_nodes / skills → node tools/create-curriculum-node.js | create-skill.js' +
      '\n   tags → node tools/create-tag.js',
    );
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

  // Exam gate (VER-02/VER-04, tools/apply-exam-gate.js): derive the exam's minimum app version from the rows now in the
  // database and write it to exam_versions, bumping updated_at on the exam's rows. Dev only; a no-op when the derived
  // minimum is the floor (VER-07); idempotent. The gate is per EXAM, so it also gates the sibling papers.
  if (!DRY_RUN && ENV === 'dev') {
    const { applyExamGates } = require('../tools/lib/exam-gate');
    await applyExamGates(pool, { env: ENV, apply: true, filter: { subject: video.subject, syllabus: video.syllabus, year: String(video.year) } });
  } else if (DRY_RUN) {
    console.log('   (dry-run: the exam gate is derived and written after a real upload — node tools/apply-exam-gate.js shows it)');
  }
}

// Only run when invoked directly — so validate-questions.js (and anything else) can load
// this file for its data blocks without opening a DB connection or writing anything.
if (require.main === module) {
  upload()
    .catch((err) => {
      console.error('\n❌ Upload failed:', err.message);
      process.exitCode = 1;
    })
    .finally(closePool);
}
