#!/usr/bin/env node
/**
 * DBE History P2 — November 2023 — Question 1 (order 1)
 * Civil Resistance, 1970s to 1980s: how COSATU responded to the apartheid government's labour reforms in the 1980s (Sources 1A-1D).
 * Source-based question: DESIGN-HIST-01 (same real sources, fresh angles); DESIGN-HIST-02 (1.6 taught via an objective synthesis item).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 * Typed blanks: numeric only, keyboard_type 'standard_math' on every fitb (KEYBOARD-04, DESIGN-HIST-03).
 *   node tools/validate-questions.js --script scripts/add-history-2023-nov-p2-q1.js --curriculum temp/curriculum-vocab-history-p2-2023.json
 *   node scripts/add-history-2023-nov-p2-q1.js --dry-run
 *   node scripts/add-history-2023-nov-p2-q1.js
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
  "year": 2023,
  "paper": "nov_p2",
  "order": 1,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "cosatu",
    "labour_relations_amendment_act",
    "trade_union_mobilisation",
    "sanctions_disinvestment",
    "civil_resistance"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2023/nov_p2/q1/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2023/nov_p2/q1/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2023/nov_p2/q1/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2023/nov_p2/q1/memo_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2023/nov_p2/q1/memo_3.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2023/nov_p2/q1/memo_4.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2023/nov_p2/q1/memo_5.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2023/nov_p2/q1/memo_6.png"
  ],
  "exam_question_marks": 50,
  "supplementary_materials": [
    {
      "type": "source",
      "label": "Source 1A",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2023/nov_p2/q1/annexure_1A.png"
      ]
    },
    {
      "type": "source",
      "label": "Source 1B",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2023/nov_p2/q1/annexure_1B.png"
      ]
    },
    {
      "type": "source",
      "label": "Source 1C",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2023/nov_p2/q1/annexure_1C.png"
      ]
    },
    {
      "type": "source",
      "label": "Source 1D",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2023/nov_p2/q1/annexure_1D.png"
      ]
    }
  ]
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "According to Source 1A, the rally that launched COSATU in Durban was attended by more than [] workers.",
    "metadata": [
      "Workers: ",
      "[ ]"
    ],
    "answer": [
      "10000",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "interpretation",
    "unit": "civil_resistance_1970s_80s",
    "topic": "cosatu_worker_mobilisation",
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
    "year": 2023,
    "paper": "nov_p2",
    "keyboard_type": "standard_math",
    "clues": "- The number is in the first sentence of Source 1A.\n- Type the digits only, with no space."
  },
  {
    "name": "Question 2",
    "question": "According to Source 1D, the government's February 24 restrictions effectively banned [] other organisations besides limiting COSATU.",
    "metadata": [
      "Organisations: ",
      "[ ]"
    ],
    "answer": [
      "17",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "interpretation",
    "unit": "civil_resistance_1970s_80s",
    "topic": "cosatu_worker_mobilisation",
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
    "year": 2023,
    "paper": "nov_p2",
    "keyboard_type": "standard_math",
    "clues": "- Read the description of the first of the two challenges in Source 1D.\n- The UDF is named as one of them."
  },
  {
    "name": "Question 3",
    "question": "According to Source 1A, which of these did COSATU call for at its launch?",
    "metadata": [
      "A national minimum wage for workers",
      "An end to the pass laws for all workers",
      "A 40-hour working week at full pay",
      "Six months of paid maternity leave",
      "A national union for unemployed workers"
    ],
    "answer": [
      "A national minimum wage for workers",
      "A 40-hour working week at full pay",
      "A national union for unemployed workers",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "interpretation",
    "unit": "civil_resistance_1970s_80s",
    "topic": "cosatu_worker_mobilisation",
    "subtopic": "evidence_extraction",
    "skills": [
      "identify_evidence_from_a_source"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2023,
    "paper": "nov_p2",
    "clues": "- The demands are listed in the second paragraph, after \"The Congress also called for\".\n- Only choose demands the source actually names."
  },
  {
    "name": "Question 4",
    "question": "Match each person named in Sources 1A, 1C and 1D to what the source says about them.",
    "metadata": [
      "A - Elijah Barayi",
      "B - Adriaan Vlok",
      "C - Pietie du Plessis",
      "D - Jay Naidoo",
      "1 - Said the bill would restore the balance in favour of the employer",
      "2 - Said the bill and the restrictions together effectively banned COSATU",
      "3 - Said COSATU hoped to fill the vacuum left by the banning of the ANC",
      "4 - Announced the decree that restricted COSATU and the UDF"
    ],
    "answer": [
      "A-3",
      "B-4",
      "C-1",
      "D-2"
    ],
    "presentation": "match",
    "type": "interpretation",
    "unit": "civil_resistance_1970s_80s",
    "topic": "cosatu_worker_mobilisation",
    "subtopic": "key_figures_and_events",
    "skills": [
      "identify_historical_event_or_term"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2023,
    "paper": "nov_p2",
    "clues": "- Two of these people were government ministers; two were COSATU leaders.\n- Check each source for the person's title."
  },
  {
    "name": "Question 5",
    "question": "Why is Source 1C useful to a historian studying how the government cracked down on COSATU in 1988?",
    "metadata": [
      "It was written by a COSATU media worker, so it shows how the federation saw the crackdown",
      "It is the full legal text of the decree, so it gives the exact wording the government used",
      "It is a foreign newspaper report from the day after the restrictions, quoting the officials",
      "It was written many years later, so the author could already see how the crackdown helped end apartheid",
      ""
    ],
    "answer": [
      "It is a foreign newspaper report from the day after the restrictions, quoting the officials",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "civil_resistance_1970s_80s",
    "topic": "cosatu_worker_mobilisation",
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
    "clues": "- Read the introduction above Source 1C: who published it, and when?\n- Source 1D tells you the date of the restrictions."
  },
  {
    "name": "Question 6",
    "question": "Source 1A (1985) and Source 1C (1988) both use the word \"vacuum\". What does comparing them show about COSATU?",
    "metadata": [
      "COSATU replaced the ANC as the government's official partner in national labour talks",
      "COSATU stayed out of politics until the detained UDF leaders had been released again",
      "COSATU was banned soon after its launch in 1985 and was allowed to operate again only once the UDF was restricted",
      "COSATU stepped into political roles left empty when other anti-apartheid bodies were repressed",
      ""
    ],
    "answer": [
      "COSATU stepped into political roles left empty when other anti-apartheid bodies were repressed",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "civil_resistance_1970s_80s",
    "topic": "cosatu_worker_mobilisation",
    "subtopic": "historical_causation",
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
    "clues": "- In Source 1A the vacuum was left by the banning of one organisation; in Source 1C by the detention of another's leaders.\n- Ask what COSATU did in both cases."
  },
  {
    "name": "Question 7",
    "question": "Using the dates in Sources 1A to 1D, arrange these events in the order they happened.",
    "metadata": [
      "COSATU holds a special congress in Johannesburg",
      "COSATU is launched at a rally in Durban",
      "The government announces restrictions on COSATU and the UDF",
      "The final draft of the Labour Relations Amendment Bill goes to Parliament",
      "The Security Police chief says legal radical groups worry the police more than the ANC"
    ],
    "answer": [
      "COSATU is launched at a rally in Durban",
      "The Security Police chief says legal radical groups worry the police more than the ANC",
      "The government announces restrictions on COSATU and the UDF",
      "COSATU holds a special congress in Johannesburg",
      "The final draft of the Labour Relations Amendment Bill goes to Parliament"
    ],
    "presentation": "ordering",
    "type": "interpretation",
    "unit": "civil_resistance_1970s_80s",
    "topic": "cosatu_worker_mobilisation",
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
    "year": 2023,
    "paper": "nov_p2",
    "clues": "- Source 1C says the police chief spoke \"in November\", before the February decree.\n- Source 1D says the final draft went to Parliament 24 hours after the special congress."
  },
  {
    "name": "Question 8",
    "question": "Source 1D says the Labour Relations Amendment Act would \"outlaw solidarity action in industrial disputes\". What is solidarity action?",
    "metadata": [
      "Employers agreeing with each other to lock out workers who go on strike",
      "Two trade unions joining together to form one larger national federation",
      "Workers taking action in support of other workers in a dispute that is not their own",
      "Workers taking their own employer to court to claim the wages and overtime pay that are owed to them",
      ""
    ],
    "answer": [
      "Workers taking action in support of other workers in a dispute that is not their own",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "civil_resistance_1970s_80s",
    "topic": "cosatu_worker_mobilisation",
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
    "year": 2023,
    "paper": "nov_p2",
    "clues": "- Solidarity means standing together with others.\n- Think of COSATU's slogan on the poster in Source 1B."
  },
  {
    "name": "Question 9",
    "question": "Which of these claims about how COSATU responded to the labour reforms are supported by the sources?",
    "metadata": [
      "At its launch COSATU committed itself to political goals such as one-person one-vote (Source 1A)",
      "The poster called on workers to organise and resist the Labour Bill and the restrictions (Source 1B)",
      "COSATU accepted the restrictions in return for permission to keep its financial records (Source 1C)",
      "COSATU called a special congress to plan its response to the restrictions and the bill (Source 1D)",
      "COSATU welcomed the bill because it strengthened workers' right to strike (Source 1D)"
    ],
    "answer": [
      "At its launch COSATU committed itself to political goals such as one-person one-vote (Source 1A)",
      "The poster called on workers to organise and resist the Labour Bill and the restrictions (Source 1B)",
      "COSATU called a special congress to plan its response to the restrictions and the bill (Source 1D)",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "civil_resistance_1970s_80s",
    "topic": "cosatu_worker_mobilisation",
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
    "year": 2023,
    "paper": "nov_p2",
    "clues": "- Check each claim against the source named in brackets.\n- Two claims reverse what their source actually says."
  }
];

// ─── AI explanation (AMPM-CONTENT-AI-EXP) — one entry per REAL exam sub-question, against the memo ───

const aiExplanation = {
  sub_questions: [
  {
    "number": "1.1.1",
    "marks": 1,
    "clues": "- The threat is in the third sentence of Source 1A.\n- Look for what the government was threatening to do.",
    "approach": "- Find the sentence that mentions a national strike.\n- Copy the reason that follows \"if\".",
    "solution": "1. '… if the government carries out its threat to repatriate (send back) migrant workers'\n2. '… and have pledged to organise workers in the homelands in defiance of any restrictions on unions in these regions' is also accepted.\n3. Any one earns 1 mark."
  },
  {
    "number": "1.1.2",
    "marks": 2,
    "clues": "- Disinvestment means withdrawing investment from a country.\n- Ask what COSATU hoped that pressure would achieve.",
    "approach": "- Explain what disinvestment does to the economy.\n- Link it to ending apartheid.",
    "solution": "1. To put pressure on the government to change or dismantle apartheid.\n2. To isolate South Africa and cut it off from foreign economic support, forcing it to give in.\n3. COSATU was aligned to the ANC, which used disinvestment to intensify the struggle.\n4. Ending apartheid would lead to better working conditions for workers.\n5. Any one reason earns 2 marks."
  },
  {
    "number": "1.1.3",
    "marks": 2,
    "clues": "- Nationalisation is an economic policy.\n- Think about who owns the mines and industries afterwards.",
    "approach": "- Say what is taken over and by whom.\n- Use your own words.",
    "solution": "1. An economic policy that places the means of production, such as mines and major industries, under state control.\n2. Limiting private ownership and promoting state ownership of the means of production is also accepted."
  },
  {
    "number": "1.1.4",
    "marks": 4,
    "clues": "- One-person one-vote is a political demand, not a labour demand.\n- A unitary South Africa means one country, without homelands.",
    "approach": "- Explain why a trade union federation took a political stand.\n- Make two separate points.",
    "solution": "1. COSATU was involved not only in labour issues but also in political matters.\n2. COSATU supported the aims of the liberation struggle: the right to vote and democratic rights for all South Africans.\n3. All South Africans should vote within one united South Africa.\n4. Any two points earn 4 marks."
  },
  {
    "number": "1.2.1",
    "marks": 4,
    "clues": "- Look at the slogans and the event the poster advertises.\n- Think about who the poster was aimed at.",
    "approach": "- Give the poster's purpose in relation to the Labour Bill.\n- Give a second purpose linked to the special congress.",
    "solution": "1. To mobilise workers against the Labour Relations Amendment Bill/Act.\n2. To show support and solidarity from broader society against the bill.\n3. To highlight the restrictions the bill would impose on workers and unions.\n4. To notify members of the special congress in Johannesburg on 14–15 May 1988.\n5. Any two reasons earn 4 marks."
  },
  {
    "number": "1.2.2",
    "marks": 2,
    "clues": "- Look for words and images on the poster itself.\n- One piece of evidence is enough.",
    "approach": "- Quote or describe one feature that identifies COSATU.",
    "solution": "1. The COSATU logo and name appear on the poster.\n2. 'FORWARD WITH COSATU', 'AN INJURY TO ONE IS AN INJURY TO ALL' or 'Special Congress JOHANNESBURG MAY 14–15 1988' are also accepted.\n3. Any one earns 2 marks."
  },
  {
    "number": "1.2.3",
    "marks": 4,
    "clues": "- Read the introduction: who designed the poster?\n- A poster is made to persuade, not to inform neutrally.",
    "approach": "- Use the provenance to show bias.\n- Use the content (language, one side only) for a second point.",
    "solution": "1. It was designed by a COSATU media worker, Patrick Cockayne, who opposed the government and its laws.\n2. It gives only COSATU's perspective; it is one-sided.\n3. It uses emotive language ('NO! NO!') to mobilise people against the act.\n4. Any two limitations earn 4 marks."
  },
  {
    "number": "1.3.1",
    "marks": 2,
    "clues": "- Find what the restricted groups now needed before they could act.",
    "approach": "- Quote the phrase about permission.",
    "solution": "1. '… they will have to obtain the Law and Order Minister's permission to conduct any other activities'"
  },
  {
    "number": "1.3.2",
    "marks": 2,
    "clues": "- Van der Merwe is quoted in the second paragraph of Source 1C.\n- He contrasts legal groups with an illegal one.",
    "approach": "- Name the two legal organisations.",
    "solution": "1. 'UDF'\n2. 'COSATU'"
  },
  {
    "number": "1.3.3",
    "marks": 2,
    "clues": "- The ANC was banned and its leaders were in prison.\n- Think about what the government feared from a united opposition.",
    "approach": "- Explain the government's motive in one clear point.",
    "solution": "1. The government feared ANC and COSATU leaders would mobilise people into a strong opposition.\n2. It saw the ANC and COSATU as puppets of the Soviet Union.\n3. The ANC and political prisoners were seen as a threat; unbanning would speed up liberation.\n4. Any one reason earns 2 marks."
  },
  {
    "number": "1.3.4",
    "marks": 2,
    "clues": "- Sanctions are penalties imposed by other countries.\n- Link them to COSATU's anti-apartheid stand.",
    "approach": "- Define sanctions.\n- Say why COSATU wanted them.",
    "solution": "1. Campaigns by COSATU and its allies for economic penalties, such as trade boycotts, to isolate South Africa and force it to end apartheid.\n2. The official blocking of economic, cultural and political relations with the apartheid government is also accepted."
  },
  {
    "number": "1.4.1",
    "marks": 2,
    "clues": "- The source names \"two specific challenges\".\n- One is a set of restrictions, the other a law.",
    "approach": "- Identify each challenge in the opening paragraph.",
    "solution": "1. 'The government's February 24 restrictions …'\n2. 'the Labour Relations Amendment Act'\n3. Each earns 1 mark."
  },
  {
    "number": "1.4.2",
    "marks": 3,
    "clues": "- Look at the paragraph beginning \"The bill will substantially limit\".\n- You need three separate effects.",
    "approach": "- Quote three things the bill would do to workers and unions.",
    "solution": "1. '… limit workers' right to strike …'\n2. '… open trade unions to civil action for losses incurred by their members' actions …'\n3. '… outlaw solidarity action in industrial disputes'\n4. Each earns 1 mark.\n5. Note: the marking guideline prints '(any 1 x 3)' here; the question paper's (1 x 3) is the allocation, three quotations at 1 mark each."
  },
  {
    "number": "1.4.3",
    "marks": 2,
    "clues": "- The \"national political terrain\" is politics at country-wide level.\n- The restrictions kept COSATU to the factory floor.",
    "approach": "- Explain what COSATU could no longer do.",
    "solution": "1. COSATU was curbed from challenging the state politically at national level.\n2. It could not mobilise workers nationally and was confined to factory-floor issues.\n3. The rights of employers were protected.\n4. Any one point earns 2 marks."
  },
  {
    "number": "1.4.4",
    "marks": 4,
    "clues": "- \"Knuckle under\" means give in.\n- Think about what COSATU was preparing to do.",
    "approach": "- Explain COSATU's refusal to accept the restrictions.\n- Add a second point on how it would resist.",
    "solution": "1. COSATU would not accept the government's restrictions and the act.\n2. It was prepared to suffer and fight for workers' rights.\n3. It would mobilise workers for mass demonstrations against employers and the government.\n4. Any two points earn 4 marks."
  },
  {
    "number": "1.5",
    "marks": 4,
    "clues": "- Find something the poster shows that Source 1D also describes.\n- Pair specific details.",
    "approach": "- Take a detail from Source 1B and the matching evidence in Source 1D.\n- Explain the link; repeat for a second pair.",
    "solution": "1. Source 1B calls on workers to reject the Labour Bill and restrictions; Source 1D shows COSATU's formal reaction against them.\n2. Source 1B announces the special congress of 14–15 May 1988; Source 1D describes the decisions taken there.\n3. Both show that workers should resist, and both show COSATU's commitment to resist the act.\n4. Any two comparisons earn 4 marks."
  },
  {
    "number": "1.6",
    "marks": 8,
    "clues": "- Plan: how did COSATU respond to the labour reforms?\n- Use every source and add your own knowledge.",
    "approach": "- Open with a clear statement answering the question.\n- Use evidence from each source, naming it.\n- Add own knowledge, e.g. strikes and stayaways.\n- End with a concluding sentence.",
    "solution": "1. COSATU was launched at the start of December 1985 to challenge apartheid labour policies and committed itself to one-person one-vote (Source 1A).\n2. It used its large membership, including NUM, to build a strong force and called for a minimum wage (Source 1A).\n3. It used posters to mobilise workers to organise and resist the bill and restrictions (Source 1B).\n4. It filled the vacuum left by detained UDF leaders and called for sanctions and disinvestment (Source 1C).\n5. It held a special congress and refused to give in to the restrictions (Source 1D).\n6. It organised campaigns and strikes to pressure the government (own knowledge).\n7. The paragraph is marked on a 3-level rubric: 0–2, 3–5 or 6–8 marks.\n8. Note: the marking guideline dates COSATU's launch to 5 December 1985. Source 1A, published on 6 December, says the launch rally was \"last weekend\", so the launch was at the start of December (the weekend of 30 November–1 December)."
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
