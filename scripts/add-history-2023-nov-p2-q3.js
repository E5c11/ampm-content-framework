#!/usr/bin/env node
/**
 * DBE History P2 — November 2023 — Question 3 (order 3)
 * The End of the Cold War and a New World Order: how the IMF and the World Bank shaped globalised economies since the 1980s (Sources 3A-3D).
 * Source-based question: DESIGN-HIST-01 (same real sources, fresh angles); DESIGN-HIST-02 (3.6 taught via an objective synthesis item).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 * Typed blanks: numeric only, keyboard_type 'standard_math' on every fitb (KEYBOARD-04, DESIGN-HIST-03).
 *   node tools/validate-questions.js --script scripts/add-history-2023-nov-p2-q3.js --curriculum temp/curriculum-vocab-history-p2-2023.json
 *   node scripts/add-history-2023-nov-p2-q3.js --dry-run
 *   node scripts/add-history-2023-nov-p2-q3.js
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
  "year": 2023,
  "paper": "nov_p2",
  "order": 3,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "imf_world_bank",
    "globalisation",
    "structural_adjustment",
    "dependency_theory",
    "global_north_south_relations"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2023/nov_p2/q3/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2023/nov_p2/q3/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2023/nov_p2/q3/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2023/nov_p2/q3/memo_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2023/nov_p2/q3/memo_3.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2023/nov_p2/q3/memo_4.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2023/nov_p2/q3/memo_5.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2023/nov_p2/q3/memo_6.png"
  ],
  "exam_question_marks": 50,
  "supplementary_materials": [
    {
      "type": "source",
      "label": "Source 3A",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2023/nov_p2/q3/annexure_3A.png"
      ]
    },
    {
      "type": "source",
      "label": "Source 3B",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2023/nov_p2/q3/annexure_3B.png"
      ]
    },
    {
      "type": "source",
      "label": "Source 3C",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2023/nov_p2/q3/annexure_3C.png"
      ]
    },
    {
      "type": "source",
      "label": "Source 3D",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2023/nov_p2/q3/annexure_3D.png"
      ]
    }
  ]
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Source 3D: Stiglitz joined the Council of Economic Advisers in 1993 and left the World Bank in January 2000, so he spent about [] years in policy making.",
    "metadata": [
      "Years: ",
      "[ ]"
    ],
    "answer": [
      "7",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "application",
    "unit": "end_of_cold_war_new_world_order",
    "topic": "imf_world_bank_globalisation",
    "subtopic": "evidence_extraction",
    "skills": [
      "calculate_from_source_data"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2023,
    "paper": "nov_p2",
    "keyboard_type": "standard_math",
    "clues": "- Subtract the year he started from the year he left.\n- Type the number only."
  },
  {
    "name": "Question 2",
    "question": "Source 3A mentions the United Nations Security Council. What point does it use this example to make?",
    "metadata": [
      "African countries hold a veto in the Security Council that lets them block IMF loans",
      "The Security Council sets the interest rates that the World Bank charges on its loans",
      "Powerful countries demand democracy from Africa but keep an undemocratic veto for themselves",
      "African countries refuse to practise democracy until the Security Council has been fully reformed",
      ""
    ],
    "answer": [
      "Powerful countries demand democracy from Africa but keep an undemocratic veto for themselves",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "interpretation",
    "unit": "end_of_cold_war_new_world_order",
    "topic": "imf_world_bank_globalisation",
    "subtopic": "historical_causation",
    "skills": [
      "explain_historical_causation"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2023,
    "paper": "nov_p2",
    "clues": "- Read the last sentence of Source 3A.\n- Who has the veto, and who is asked to practise democracy?"
  },
  {
    "name": "Question 3",
    "question": "Match each term linked to Sources 3B and 3D to its meaning.",
    "metadata": [
      "A - Balance of payments crisis",
      "B - Bilateral donor",
      "C - Neo-colonialism",
      "D - Proponents",
      "1 - Control of former colonies through economic pressure rather than direct rule",
      "2 - People who support and argue for something",
      "3 - A country cannot earn enough abroad to pay for its imports and debts",
      "4 - One country that gives aid directly to another country"
    ],
    "answer": [
      "A-3",
      "B-4",
      "C-1",
      "D-2"
    ],
    "presentation": "match",
    "type": "definition",
    "unit": "end_of_cold_war_new_world_order",
    "topic": "imf_world_bank_globalisation",
    "subtopic": "historical_terminology",
    "skills": [
      "define_historical_term"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2023,
    "paper": "nov_p2",
    "clues": "- \"Bi-\" means two: two countries dealing directly.\n- Source 3D gives a meaning for \"proponents\" in brackets."
  },
  {
    "name": "Question 4",
    "question": "In Source 3C, the poor nation feeds the rich nation from its own bowl. What does this suggest?",
    "metadata": [
      "Rich nations send food aid to poor nations whenever a drought or famine breaks out",
      "Poor nations are paid fair prices for the food and goods they export",
      "Rich and poor nations share the world's resources in equal measure",
      "Wealth and resources flow from poor countries to rich ones, not the reverse",
      ""
    ],
    "answer": [
      "Wealth and resources flow from poor countries to rich ones, not the reverse",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "interpretation",
    "unit": "end_of_cold_war_new_world_order",
    "topic": "imf_world_bank_globalisation",
    "subtopic": "source_evaluation",
    "skills": [
      "interpret_political_cartoon_symbolism"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2023,
    "paper": "nov_p2",
    "clues": "- Look at who holds the bowl and who is being fed.\n- Compare the bodies of the two figures."
  },
  {
    "name": "Question 5",
    "question": "Which is a limitation of Source 3D for a historian studying how the IMF and World Bank affected Africa?",
    "metadata": [
      "It was written by an outsider with no experience of working inside the World Bank or the IMF",
      "It is an anonymous pamphlet, so the author and the date cannot be checked",
      "It is one former insider's personal view, and its examples are mostly not from Africa",
      "It was written before the debt crisis of the 1980s had even begun in Africa",
      ""
    ],
    "answer": [
      "It is one former insider's personal view, and its examples are mostly not from Africa",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "end_of_cold_war_new_world_order",
    "topic": "imf_world_bank_globalisation",
    "subtopic": "source_evaluation",
    "skills": [
      "evaluate_source_reliability"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 5,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2023,
    "paper": "nov_p2",
    "clues": "- Read the introduction: who wrote it, and from what position?\n- Which countries and regions does Stiglitz actually mention?"
  },
  {
    "name": "Question 6",
    "question": "Which statements correctly compare Sources 3A and 3D?",
    "metadata": [
      "Both accept that globalisation brings some benefits as well as problems",
      "Both claim that globalisation has brought Africa nothing but benefits",
      "Source 3A stresses what Africa has lost, while 3D stresses the gains of foreign aid",
      "Source 3D argues that the critics of globalisation are always right",
      "Both suggest that powerful actors decide the terms on which poorer countries join"
    ],
    "answer": [
      "Both accept that globalisation brings some benefits as well as problems",
      "Source 3A stresses what Africa has lost, while 3D stresses the gains of foreign aid",
      "Both suggest that powerful actors decide the terms on which poorer countries join",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "end_of_cold_war_new_world_order",
    "topic": "imf_world_bank_globalisation",
    "subtopic": "source_evaluation",
    "skills": [
      "corroborate_evidence_across_sources"
    ],
    "difficulty": 4,
    "exam_weight": 3,
    "xp": 10,
    "order": 6,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2023,
    "paper": "nov_p2",
    "clues": "- Source 3A speaks of globalisation \"from above\"; Source 3D says developing countries \"must accept it\".\n- Stiglitz says critics \"too often overlook the benefits\"."
  },
  {
    "name": "Question 7",
    "question": "Using Source 3B, arrange these steps into the chain that led to IMF and World Bank influence over Africa.",
    "metadata": [
      "African states turn to the IMF and World Bank for balance of payments loans",
      "A global economic crisis hits Africa in the early 1980s",
      "The lenders attach structural adjustment conditions to their loans",
      "Countries can no longer service the foreign debts they took on earlier",
      "Balance of payments crises disrupt local production"
    ],
    "answer": [
      "A global economic crisis hits Africa in the early 1980s",
      "Balance of payments crises disrupt local production",
      "Countries can no longer service the foreign debts they took on earlier",
      "African states turn to the IMF and World Bank for balance of payments loans",
      "The lenders attach structural adjustment conditions to their loans"
    ],
    "presentation": "ordering",
    "type": "application",
    "unit": "end_of_cold_war_new_world_order",
    "topic": "imf_world_bank_globalisation",
    "subtopic": "historical_causation",
    "skills": [
      "explain_historical_causation"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 7,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2023,
    "paper": "nov_p2",
    "clues": "- Start with the crisis named in the first sentence of Source 3B.\n- Structural adjustment is described in the last paragraph."
  },
  {
    "name": "Question 8",
    "question": "Which of these claims about how the IMF and World Bank shaped globalised economies are supported by the sources?",
    "metadata": [
      "African countries were locked into new dependent relationships with Western lenders (Source 3B)",
      "The IMF and World Bank gave African countries a veto over their own loan conditions (Source 3A)",
      "Structural adjustment aimed to change prices, spending and state intervention (Source 3B)",
      "Africa has received more from the outside world than it has given in return (Source 3A)",
      "Foreign aid projects brought benefits such as literacy and higher farm incomes (Source 3D)"
    ],
    "answer": [
      "African countries were locked into new dependent relationships with Western lenders (Source 3B)",
      "Structural adjustment aimed to change prices, spending and state intervention (Source 3B)",
      "Foreign aid projects brought benefits such as literacy and higher farm incomes (Source 3D)",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "end_of_cold_war_new_world_order",
    "topic": "imf_world_bank_globalisation",
    "subtopic": "historical_causation",
    "skills": [
      "corroborate_evidence_across_sources"
    ],
    "difficulty": 4,
    "exam_weight": 3,
    "xp": 10,
    "order": 8,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2023,
    "paper": "nov_p2",
    "clues": "- Check each claim against the source named in brackets.\n- Two claims reverse what their source actually says."
  }
];

// ─── AI explanation (AMPM-CONTENT-AI-EXP) — one entry per REAL exam sub-question, against the memo ───

const aiExplanation = {
  sub_questions: [
  {
    "number": "3.1.1",
    "marks": 2,
    "clues": "- Source 3A says globalising economies \"seek resources from every corner of the world\".\n- Use your own words.",
    "approach": "- Define the term in one clear sentence.",
    "solution": "1. Economies that have access to, and benefit from, resources from countries across the world.\n2. Increasing interdependence through cross-border trade, or economies in which developing countries' resources are exploited, is also accepted."
  },
  {
    "number": "3.1.2",
    "marks": 4,
    "clues": "- The criticisms follow \"Globalisation's critics point to\".\n- You need four separate points.",
    "approach": "- Quote four criticisms from the source.",
    "solution": "1. 'presents Africa and black people as marginal'\n2. 'the devastation of the environment'\n3. 'climate change'\n4. 'depletion of natural and mineral resources'\n5. 'labour exploitation'\n6. Any four earn 4 marks."
  },
  {
    "number": "3.1.3",
    "marks": 2,
    "clues": "- \"From above\" means powerful nations and companies control the rules.\n- Think about who designs the loan policies.",
    "approach": "- Explain one way the powerful benefited.",
    "solution": "1. They designed structural adjustment programmes and policies that favoured themselves and kept poorer nations dependent.\n2. They kept the gap between rich and poor, lent at high interest, and exploited natural resources and cheap labour.\n3. Any one point earns 2 marks."
  },
  {
    "number": "3.1.4",
    "marks": 2,
    "clues": "- \"From below\" means globalisation shaped by Africans themselves.\n- Think about Africa's resources.",
    "approach": "- Explain one advantage for Africa.",
    "solution": "1. Globalisation would be applied from an African perspective to benefit Africa.\n2. Africa could use demand for its resources to influence international institutions, attract investment, create jobs and trade its goods.\n3. Any one point earns 2 marks."
  },
  {
    "number": "3.2.1",
    "marks": 4,
    "clues": "- Look for the causes of the dependency in the first two paragraphs.\n- You need four separate quotations.",
    "approach": "- Quote four pieces of evidence.",
    "solution": "1. '… acute balance of payments crises …'\n2. '… disruption of local production have undermined the continent's ability to service foreign debt …'\n3. '… many countries have been forced to go into debt …'\n4. '… they have turned to the IMF and the World Bank for balance of payments loans'"
  },
  {
    "number": "3.2.2",
    "marks": 2,
    "clues": "- Loans from these institutions came with conditions.\n- Think about who set the terms.",
    "approach": "- Explain one reason for the reluctance.",
    "solution": "1. Countries had to accept economic policies set by the lenders as conditions.\n2. They had no say in the terms of structural adjustment and would stay bound until the debt was paid.\n3. It would make them dependent on foreign help (neo-colonialism).\n4. Any one point earns 2 marks."
  },
  {
    "number": "3.2.3",
    "marks": 2,
    "clues": "- The statement compares the lenders with colonial powers.",
    "approach": "- Explain what the comparison implies.",
    "solution": "1. The IMF and World Bank acted like colonial powers, exploiting Africa through economic policies.\n2. They used structural adjustment policies to benefit from African economies.\n3. Any one point earns 2 marks."
  },
  {
    "number": "3.2.4",
    "marks": 2,
    "clues": "- Read the last paragraph of Source 3B.\n- Structural adjustment loans came with conditions.",
    "approach": "- Define the term in the context of IMF and World Bank policy.",
    "solution": "1. A policy through which the IMF and World Bank gave conditional loans to countries in economic crisis.\n2. A policy that reduced the government's role in the economy and promoted a market economy is also accepted."
  },
  {
    "number": "3.3.1",
    "marks": 4,
    "clues": "- You may argue either way.\n- Look at who depends on whom in the cartoon.",
    "approach": "- State whether the caption is appropriate.\n- Give two reasons from the cartoon.",
    "solution": "1. Appropriate: rich nations depend on resources from poor nations, and poor nations are exploited.\n2. Not appropriate: rich nations should help poor nations, and poor nations are known for depending on loans from rich nations.\n3. Any two reasons earn 4 marks."
  },
  {
    "number": "3.3.2",
    "marks": 2,
    "clues": "- Exaggeration in a cartoon makes a point.\n- Compare the two figures' size.",
    "approach": "- Explain the message of the oversized rich nation.",
    "solution": "1. To suggest they are greedy and monopolise and enrich themselves with the resources of poor countries.\n2. Any one point earns 2 marks."
  },
  {
    "number": "3.4.1",
    "marks": 2,
    "clues": "- Look at the first sentence of Source 3D.",
    "approach": "- Name two positions he held before policy making.",
    "solution": "1. 'Academia'\n2. 'research'\n3. 'teaching'\n4. Any two earn 2 marks."
  },
  {
    "number": "3.4.2",
    "marks": 2,
    "clues": "- Think about what supporters say globalisation brings.",
    "approach": "- Explain one link between globalisation and development.",
    "solution": "1. It leads to a global economy in which countries share resources, reduce poverty and create jobs.\n2. It creates a global village in which countries gain from links in technology, culture and transport.\n3. Any one point earns 2 marks."
  },
  {
    "number": "3.4.3",
    "marks": 2,
    "clues": "- The projects follow \"often in ways that have almost gone unnoticed\".",
    "approach": "- Name two projects.",
    "solution": "1. 'guerrillas in the Philippines were provided jobs by a World Bank-financed project'\n2. 'irrigation projects', 'education projects' or 'Aids projects'\n3. Any two earn 2 marks."
  },
  {
    "number": "3.4.4",
    "marks": 2,
    "clues": "- The statement is about who did not benefit.",
    "approach": "- Explain one implication.",
    "solution": "1. Many people still experience inequality, poverty and debt; the gap between rich and poor is growing.\n2. Wealth is still unequally distributed; mismanagement of funds led to corruption.\n3. Any one point earns 2 marks."
  },
  {
    "number": "3.4.5",
    "marks": 4,
    "clues": "- Look at the author's experience.\n- Does the source show both sides?",
    "approach": "- Give two reasons based on provenance and content.",
    "solution": "1. Stiglitz worked inside international financial institutions.\n2. It is first-hand testimony of his experiences.\n3. It gives a balanced assessment of the benefits and problems of globalisation.\n4. Any two reasons earn 4 marks."
  },
  {
    "number": "3.5",
    "marks": 4,
    "clues": "- Source 3C shows exploitation; Source 3D shows benefits.\n- Pair contrasting details.",
    "approach": "- Take a detail from Source 3C and a contrasting one from Source 3D.\n- Repeat for a second pair.",
    "solution": "1. Source 3C shows rich nations depending on poor nations, but Source 3D refers to economic development as a benefit of globalisation.\n2. Source 3C shows poor nations serving rich nations, whereas Source 3D says foreign aid benefited millions.\n3. Source 3C shows the poor as weak and malnourished, while Source 3D refers to projects that helped contain disease.\n4. Any two comparisons earn 4 marks."
  },
  {
    "number": "3.6",
    "marks": 8,
    "clues": "- Plan: what did the IMF and World Bank do to globalised economies?\n- Use every source and add your own knowledge.",
    "approach": "- Open with a clear statement answering the question.\n- Use evidence from each source, naming it.\n- Add own knowledge, e.g. foreign loans and debt.\n- End with a concluding sentence.",
    "solution": "1. The globalised economy depends on resources from all over the world; Africa lost more than it received (Source 3A).\n2. Institutions created globalisation 'from above' with policies that did not always benefit Africa (Source 3A).\n3. African countries were locked into dependent relationships and forced into debt (Source 3B).\n4. Structural adjustment programmes reshaped African economies and were compared to colonialism (Source 3B).\n5. Dependency and exploitation characterised the globalised economy (Source 3C).\n6. Foreign aid projects brought benefits; critics linked globalisation to triumphant capitalism (Source 3D).\n7. Foreign loans held back development (own knowledge).\n8. The paragraph is marked on a 3-level rubric: 0–2, 3–5 or 6–8 marks."
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
