#!/usr/bin/env node
/**
 * DBE History P2 — November 2023 — Question 2 (order 2)
 * The Coming of Democracy: how the TRC exposed leaders of the apartheid government for gross human rights violations, 1960-1994 (Sources 2A-2D).
 * Source-based question: DESIGN-HIST-01 (same real sources, fresh angles); DESIGN-HIST-02 (2.6 taught via an objective synthesis item).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 * Typed blanks: numeric only, keyboard_type 'standard_math' on every fitb (KEYBOARD-04, DESIGN-HIST-03).
 *   node tools/validate-questions.js --script scripts/add-history-2023-nov-p2-q2.js --curriculum temp/curriculum-vocab-history-p2-2023.json
 *   node scripts/add-history-2023-nov-p2-q2.js --dry-run
 *   node scripts/add-history-2023-nov-p2-q2.js
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
  "year": 2023,
  "paper": "nov_p2",
  "order": 2,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "truth_and_reconciliation_commission",
    "amnesty",
    "third_force",
    "human_rights_violations",
    "source_reliability"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2023/nov_p2/q2/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2023/nov_p2/q2/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2023/nov_p2/q2/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2023/nov_p2/q2/memo_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2023/nov_p2/q2/memo_3.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2023/nov_p2/q2/memo_4.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2023/nov_p2/q2/memo_5.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2023/nov_p2/q2/memo_6.png"
  ],
  "exam_question_marks": 50,
  "supplementary_materials": [
    {
      "type": "source",
      "label": "Source 2A",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2023/nov_p2/q2/annexure_2A.png"
      ]
    },
    {
      "type": "source",
      "label": "Source 2B",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2023/nov_p2/q2/annexure_2B.png"
      ]
    },
    {
      "type": "source",
      "label": "Source 2C",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2023/nov_p2/q2/annexure_2C.png"
      ]
    },
    {
      "type": "source",
      "label": "Source 2D",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2023/nov_p2/q2/annexure_2D.png"
      ]
    }
  ]
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "According to Source 2D, FW de Klerk approved an indemnity (protection) list of [] police officers just before the April 1994 election.",
    "metadata": [
      "Officers: ",
      "[ ]"
    ],
    "answer": [
      "3500",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "interpretation",
    "unit": "coming_of_democracy",
    "topic": "trc_exposing_apartheid_leaders",
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
    "clues": "- Look in the second paragraph of Source 2D.\n- Type the digits only, with no space."
  },
  {
    "name": "Question 2",
    "question": "According to Source 2D, Van der Merwe admitted that De Klerk had been briefed on all secret projects during the last [] years of his government.",
    "metadata": [
      "Years: ",
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
    "unit": "coming_of_democracy",
    "topic": "trc_exposing_apartheid_leaders",
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
    "clues": "- Find the sentence where Van der Merwe \"turned on his former masters\".\n- The number is written as a word; type it as a digit."
  },
  {
    "name": "Question 3",
    "question": "Match each part of the cartoon in Source 2C to what it represents.",
    "metadata": [
      "A - The fish hanging from the 'Amnesty Process' crane",
      "B - The small fish piled in the TRC wheelbarrow",
      "C - The large creatures swimming free under the pier",
      "D - The robed figure on the pier who speaks of 'the ones that got away'",
      "1 - Senior leaders who stayed out of the amnesty process",
      "2 - Archbishop Tutu, who chaired the TRC",
      "3 - The one cabinet minister who applied for amnesty",
      "4 - Lower-ranking operatives who applied for amnesty"
    ],
    "answer": [
      "A-3",
      "B-4",
      "C-1",
      "D-2"
    ],
    "presentation": "match",
    "type": "interpretation",
    "unit": "coming_of_democracy",
    "topic": "trc_exposing_apartheid_leaders",
    "subtopic": "source_evaluation",
    "skills": [
      "interpret_political_cartoon_symbolism"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2023,
    "paper": "nov_p2",
    "clues": "- The labels beside the cartoon name the five politicians.\n- Think of \"small fish\" and \"big fish\" as people of low and high rank."
  },
  {
    "name": "Question 4",
    "question": "In Source 2C, PW Botha is drawn as a crocodile. Why was this a fitting choice?",
    "metadata": [
      "Botha was nicknamed 'the Great Crocodile' and refused to appear before the TRC",
      "Botha was the only cabinet minister who applied for amnesty and told the full truth",
      "Botha chaired the Amnesty Committee and decided which applicants were pardoned",
      "Botha was the Minister of Police when Khotso House was bombed in Johannesburg",
      ""
    ],
    "answer": [
      "Botha was nicknamed 'the Great Crocodile' and refused to appear before the TRC",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "interpretation",
    "unit": "coming_of_democracy",
    "topic": "trc_exposing_apartheid_leaders",
    "subtopic": "source_evaluation",
    "skills": [
      "interpret_political_cartoon_symbolism"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2023,
    "paper": "nov_p2",
    "clues": "- Botha had a well-known nickname in Afrikaans: \"Die Groot Krokodil\".\n- He is swimming free, not caught by the amnesty process."
  },
  {
    "name": "Question 5",
    "question": "Source 2A is from a biography of FW de Klerk, yet it doubts that he was unaware of the atrocities. Why does this make the passage more convincing?",
    "metadata": [
      "Biographies are official government records, so the facts in them cannot be wrong",
      "A writer expected to favour De Klerk still doubts him, so the criticism is hard to dismiss",
      "The author sat on the TRC as a commissioner and heard all of the evidence against De Klerk in person",
      "It was written before the TRC began, so the author could not be affected by hindsight",
      ""
    ],
    "answer": [
      "A writer expected to favour De Klerk still doubts him, so the criticism is hard to dismiss",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "coming_of_democracy",
    "topic": "trc_exposing_apartheid_leaders",
    "subtopic": "source_evaluation",
    "skills": [
      "compare_source_authorship_perspective"
    ],
    "difficulty": 4,
    "exam_weight": 3,
    "xp": 10,
    "order": 5,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2023,
    "paper": "nov_p2",
    "clues": "- Ask whose life the book is about, and what you would expect such a book to say.\n- Read the last sentence of Source 2A again."
  },
  {
    "name": "Question 6",
    "question": "According to Source 2B, which of these did the TRC find about FW de Klerk?",
    "metadata": [
      "He made little obvious attempt to curb third force activities",
      "He personally ordered the killing of political opponents in the 1970s",
      "He ignored pleas from General Steyn for a thorough investigation",
      "He refused to dismantle Botha's national security management system",
      "He kept Van der Merwe in his post despite knowing about Khotso House"
    ],
    "answer": [
      "He made little obvious attempt to curb third force activities",
      "He ignored pleas from General Steyn for a thorough investigation",
      "He kept Van der Merwe in his post despite knowing about Khotso House",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "interpretation",
    "unit": "coming_of_democracy",
    "topic": "trc_exposing_apartheid_leaders",
    "subtopic": "evidence_extraction",
    "skills": [
      "identify_evidence_from_a_source"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 6,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2023,
    "paper": "nov_p2",
    "clues": "- The findings about De Klerk start at \"The 'realm of criminal misconduct' extended\".\n- One option is about Botha's government, and one reverses what the TRC acknowledged."
  },
  {
    "name": "Question 7",
    "question": "How does Source 2D support the TRC's finding in Source 2B that De Klerk knew about illegal security force activity?",
    "metadata": [
      "Tony Leon said the police commissioner had acted completely on his own, without orders",
      "Erasmus said De Klerk refused to put his own name on the indemnity list of the police",
      "Van der Merwe himself later admitted that De Klerk had been briefed on all secret projects",
      "Van der Merwe formally asked the TRC to prosecute De Klerk for ordering the bombing of Khotso House",
      ""
    ],
    "answer": [
      "Van der Merwe himself later admitted that De Klerk had been briefed on all secret projects",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "coming_of_democracy",
    "topic": "trc_exposing_apartheid_leaders",
    "subtopic": "source_evaluation",
    "skills": [
      "corroborate_evidence_across_sources"
    ],
    "difficulty": 4,
    "exam_weight": 3,
    "xp": 10,
    "order": 7,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2023,
    "paper": "nov_p2",
    "clues": "- Find the same person in both sources: Van der Merwe.\n- What did he later say about De Klerk in Source 2D?"
  },
  {
    "name": "Question 8",
    "question": "Arrange these events from Sources 2A to 2D in the order they happened.",
    "metadata": [
      "The Promotion of National Unity and Reconciliation Act is passed",
      "Zapiro publishes the cartoon about the amnesty process",
      "Botha's government enters the 'realm of criminal misconduct'",
      "De Klerk approves an indemnity list for 3 500 police officers",
      "Khotso House, the headquarters of the SACC, is bombed"
    ],
    "answer": [
      "Botha's government enters the 'realm of criminal misconduct'",
      "Khotso House, the headquarters of the SACC, is bombed",
      "De Klerk approves an indemnity list for 3 500 police officers",
      "The Promotion of National Unity and Reconciliation Act is passed",
      "Zapiro publishes the cartoon about the amnesty process"
    ],
    "presentation": "ordering",
    "type": "interpretation",
    "unit": "coming_of_democracy",
    "topic": "trc_exposing_apartheid_leaders",
    "subtopic": "historical_chronology",
    "skills": [
      "sequence_historical_events"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 8,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2023,
    "paper": "nov_p2",
    "clues": "- Source 2B dates the 'realm of criminal misconduct' to the late 1970s; Khotso House was bombed in 1988.\n- Source 2D dates the indemnity list; Sources 2A and 2C give 1995 and 1998."
  },
  {
    "name": "Question 9",
    "question": "Which of these claims about how the TRC exposed apartheid leaders are supported by the sources?",
    "metadata": [
      "The TRC found that Botha's government had adopted a policy of killing its opponents (Source 2B)",
      "The National Party wanted every perpetrator to be prosecuted in the courts (Source 2A)",
      "Only one senior minister, Adriaan Vlok, went through the amnesty process (Source 2C)",
      "De Klerk refused to place his own name on the police indemnity list (Source 2D)",
      "Foot soldiers felt abandoned by leaders who met to prepare for the TRC together (Source 2D)"
    ],
    "answer": [
      "The TRC found that Botha's government had adopted a policy of killing its opponents (Source 2B)",
      "Only one senior minister, Adriaan Vlok, went through the amnesty process (Source 2C)",
      "Foot soldiers felt abandoned by leaders who met to prepare for the TRC together (Source 2D)",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "coming_of_democracy",
    "topic": "trc_exposing_apartheid_leaders",
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
    "number": "2.1.1",
    "marks": 2,
    "clues": "- The answer is in the first sentence of Source 2A.",
    "approach": "- Quote the reason given for the National Party's support.",
    "solution": "1. '… in order to avoid responsibility'"
  },
  {
    "number": "2.1.2",
    "marks": 2,
    "clues": "- Amnesty is linked to prosecution in the source.\n- Use your own words.",
    "approach": "- Say what is granted, to whom, and on what condition.",
    "solution": "1. Exempting someone who committed a politically motivated crime from prosecution.\n2. An official pardon for a perpetrator who fully discloses past political crimes is also accepted."
  },
  {
    "number": "2.1.3",
    "marks": 2,
    "clues": "- Most victims of apartheid crimes were black South Africans.\n- Disclosure is not the same as an explanation.",
    "approach": "- Explain what victims and families needed from the perpetrators.",
    "solution": "1. Most injustices were against black people, who wanted explanations to find closure.\n2. Amnesty let those who tortured and killed activists go free; the high command was not held accountable.\n3. Families did not always get the whole truth and wanted to hear from the perpetrators themselves.\n4. Any one reason earns 2 marks."
  },
  {
    "number": "2.1.4",
    "marks": 4,
    "clues": "- Omar speaks of coming to terms with the past and of reconciliation.\n- Think about what the TRC had to do to achieve both.",
    "approach": "- Explain two implications of Omar's words for the TRC's work.",
    "solution": "1. The TRC had to reveal the truth about past atrocities to build reconciliation.\n2. It should give victims and perpetrators a platform to tell their stories, so those affected could find closure.\n3. All South Africans should face the past to achieve healing.\n4. Any two points earn 4 marks."
  },
  {
    "number": "2.1.5(a)",
    "marks": 1,
    "clues": "- Find what De Klerk \"is known to have favoured\".",
    "approach": "- Quote De Klerk's view.",
    "solution": "1. '… favoured a general amnesty for perpetrators of politically inspired violence'\n2. His view that a process was required to come to terms with the past 'without recriminations' is also accepted."
  },
  {
    "number": "2.1.5(b)",
    "marks": 1,
    "clues": "- The ANC's view is in the sentence straight after De Klerk's.",
    "approach": "- Quote the ANC's position.",
    "solution": "1. 'A general amnesty went very much against ANC thinking'"
  },
  {
    "number": "2.2.1",
    "marks": 3,
    "clues": "- The evidence follows the phrase 'realm of criminal misconduct'.\n- You need three separate pieces.",
    "approach": "- Quote three actions of Botha's government.",
    "solution": "1. '… Botha's government had adopted a policy of killing its opponents'\n2. 'torture', 'abduction', 'arson', 'sabotage'\n3. '… used terminology like eliminate, take out and wipe out …'\n4. Any three earn 3 marks."
  },
  {
    "number": "2.2.2",
    "marks": 2,
    "clues": "- Source 2B explains the term in the dashes after it.\n- Link it to how the government dealt with the ANC.",
    "approach": "- Define the third force in your own words.",
    "solution": "1. A secret network of state-sponsored security force members, right-wing groups and opponents of the ANC used to block or derail an ANC takeover."
  },
  {
    "number": "2.2.3",
    "marks": 4,
    "clues": "- Think about whose interests the third force served.\n- De Klerk led a divided party.",
    "approach": "- Give two possible motives for his inaction.",
    "solution": "1. De Klerk wanted to hide how the National Party supported violence.\n2. He was unwilling to investigate because the third force was weakening the ANC and supported the NP.\n3. He did not want to risk further division within his party.\n4. Any two points earn 4 marks."
  },
  {
    "number": "2.2.4",
    "marks": 1,
    "clues": "- Look at the last paragraph of Source 2B.",
    "approach": "- Name the person.",
    "solution": "1. The Commissioner of Police, Van der Merwe."
  },
  {
    "number": "2.3.1",
    "marks": 2,
    "clues": "- Look at who has been caught on the Amnesty Process crane.\n- Compare him with the small fish in the wheelbarrow.",
    "approach": "- Explain why catching this fish was significant.",
    "solution": "1. Adriaan Vlok, a former Minister of Police, was the only member of the apartheid cabinet to apply for amnesty and be held accountable.\n2. Any one valid explanation earns 2 marks."
  },
  {
    "number": "2.3.2",
    "marks": 4,
    "clues": "- Look at the large creatures still swimming free.\n- \"The ones that got away\" are the ones not caught.",
    "approach": "- Explain two implications for the TRC process.",
    "solution": "1. Many other NP leaders evaded the amnesty process.\n2. They got away because they would not cooperate, and Tutu had no power to force them to appear.\n3. Leaders guilty of political crimes were not brought to book.\n4. Any two points earn 4 marks."
  },
  {
    "number": "2.4.1",
    "marks": 2,
    "clues": "- Leon is quoted in the first paragraph of Source 2D.",
    "approach": "- Quote his view of how the NP treated its foot soldiers.",
    "solution": "1. '… turning its back on the foot soldiers …'"
  },
  {
    "number": "2.4.2",
    "marks": 2,
    "clues": "- Find what De Klerk, ex-ministers and generals were doing before the TRC.",
    "approach": "- Quote the reason for Erasmus's anger.",
    "solution": "1. '… had already met on three occasions …'\n2. '… were planning the fourth meeting to prepare themselves for … the coming onslaught of the TRC …'\n3. '… each individual goes before the commission and tells their story alone' is also accepted.\n4. Any one earns 2 marks."
  },
  {
    "number": "2.4.3",
    "marks": 2,
    "clues": "- The foot soldiers carried out orders, then had to face the TRC.\n- Who protected the leaders?",
    "approach": "- Explain why they felt betrayed.",
    "solution": "1. They had to appear before the TRC on their own, excluded from the leaders' meetings.\n2. The government that employed them to commit crimes misled them and did not protect them.\n3. Any one point earns 2 marks."
  },
  {
    "number": "2.4.4",
    "marks": 4,
    "clues": "- Look at the author: who was Erasmus, and what did he see?\n- Can other sources confirm what he says?",
    "approach": "- Give two reasons based on provenance and corroboration.",
    "solution": "1. Erasmus served in the Security Branch and was an eyewitness with inside information.\n2. It comes from his own confessions.\n3. It shows how foot soldiers felt about being left alone by the NP leadership.\n4. It can be corroborated by Sources 2B and 2C.\n5. Any two reasons earn 4 marks."
  },
  {
    "number": "2.5",
    "marks": 4,
    "clues": "- Both sources show leaders avoiding the TRC.\n- Pair a cartoon detail with a detail in the text.",
    "approach": "- Take a detail from Source 2C and the matching evidence in Source 2D.\n- Repeat for a second pair.",
    "solution": "1. In Source 2C Tutu refers to leaders who got away; in Source 2D leaders met to plan their response to the TRC.\n2. Source 2C shows small fish caught by the amnesty process; Source 2D says the NP turned its back on its foot soldiers.\n3. Both show that NP leaders evaded the TRC process.\n4. Any two comparisons earn 4 marks."
  },
  {
    "number": "2.6",
    "marks": 8,
    "clues": "- Plan: what did the TRC reveal, and about whom?\n- Use every source and add your own knowledge.",
    "approach": "- Open with a clear statement answering the question.\n- Use evidence from each source, naming it.\n- Add own knowledge, e.g. public hearings.\n- End with a concluding sentence.",
    "solution": "1. The 1995 Act set up the TRC to uncover the truth about human rights violations (Source 2A).\n2. The TRC gave victims and perpetrators a platform to tell their stories (own knowledge).\n3. It found that Botha's government adopted a policy of killing opponents and used torture, abduction, arson and sabotage (Source 2B).\n4. It held De Klerk accountable for failing to curb the third force, and Van der Merwe for Khotso House (Source 2B).\n5. Vlok was the only big fish caught by the amnesty process (Source 2C).\n6. Foot soldiers applied for amnesty and felt betrayed by leaders who refused to appear (Source 2D).\n7. The paragraph is marked on a 3-level rubric: 0–2, 3–5 or 6–8 marks."
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
