#!/usr/bin/env node
/**
 * DBE History P2 — November 2024 — Question 5 (order 5)
 * Coming of Democracy (essay): despite violence, were parties willing to compromise to lay a foundation for democracy in 1994?
 * Essay question: DESIGN-HIST-02. Shares the Section B exam page uploaded under q4.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 * Typed blanks: numeric only, keyboard_type 'standard_math' on every fitb (KEYBOARD-04, DESIGN-HIST-03).
 *   node tools/validate-questions.js --script scripts/add-history-2024-nov-p2-q5.js --curriculum temp/curriculum-vocab-history-p2-2024.json
 *   node scripts/add-history-2024-nov-p2-q5.js --dry-run
 *   node scripts/add-history-2024-nov-p2-q5.js
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
  "name": "Question 5",
  "syllabus": "dbe",
  "subject": "history",
  "year": 2024,
  "paper": "nov_p2",
  "order": 5,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "negotiated_settlement",
    "codesa",
    "political_violence",
    "sunset_clause"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2024/nov_p2/q4/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2024/nov_p2/q5/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2024/nov_p2/q5/memo_2.png"
  ],
  "exam_question_marks": 50,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "What compromise did the ANC make in the Pretoria Minute of August 1990?",
    "metadata": [
      "It agreed to share power with the National Party for ten years",
      "It suspended the armed struggle",
      "It agreed to a whites-only referendum on the constitution",
      "It accepted the homelands as independent states",
      ""
    ],
    "answer": [
      "It suspended the armed struggle",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "interpretation",
    "unit": "coming_of_democracy",
    "topic": "negotiated_settlement_1990_1994",
    "subtopic": "key_figures_and_events",
    "skills": [
      "identify_historical_event_or_term"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- In return, the government agreed to lift the State of Emergency.\n- Think about what the government most wanted the ANC to give up."
  },
  {
    "name": "Question 2",
    "question": "What did Joe Slovo's \"sunset clause\" propose?",
    "metadata": [
      "That apartheid laws would be phased out gradually, one by one, over a period of twenty years",
      "That all white civil servants would be replaced before the 1994 election",
      "A five-year government of national unity, with job security for white civil servants",
      "That elections would be postponed until all political violence had ended",
      ""
    ],
    "answer": [
      "A five-year government of national unity, with job security for white civil servants",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "interpretation",
    "unit": "coming_of_democracy",
    "topic": "negotiated_settlement_1990_1994",
    "subtopic": "historical_terminology",
    "skills": [
      "define_historical_term"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- The clause was meant to reassure the National Party and white South Africans.\n- A \"sunset\" is a gradual ending of shared arrangements."
  },
  {
    "name": "Question 3",
    "question": "De Klerk held a whites-only referendum on continuing negotiations in the year [].",
    "metadata": [
      "Year: ",
      "[ ]"
    ],
    "answer": [
      "1992",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "interpretation",
    "unit": "coming_of_democracy",
    "topic": "negotiated_settlement_1990_1994",
    "subtopic": "key_figures_and_events",
    "skills": [
      "identify_historical_event_or_term"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2024,
    "paper": "nov_p2",
    "keyboard_type": "standard_math",
    "clues": "- It followed the National Party's by-election losses to the Conservative Party, after CODESA 1.\n- Write four digits."
  },
  {
    "name": "Question 4",
    "question": "Match each event of the negotiation years to what happened.",
    "metadata": [
      "A - National Peace Accord",
      "B - Declaration of Intent",
      "C - Record of Understanding",
      "D - Storming of the World Trade Centre",
      "1 - The AWB drove an armoured vehicle into the talks venue",
      "2 - Parties at CODESA 1 agreed to draw up a new constitution",
      "3 - Political organisations committed to ending violence",
      "4 - Mandela and De Klerk agreed to resume talks after a deadlock"
    ],
    "answer": [
      "A-3",
      "B-2",
      "C-4",
      "D-1"
    ],
    "presentation": "match",
    "type": "interpretation",
    "unit": "coming_of_democracy",
    "topic": "negotiated_settlement_1990_1994",
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
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Three are agreements and one was an act of violence.\n- Think about which agreement came after CODESA 2 broke down."
  },
  {
    "name": "Question 5",
    "question": "Which of these were compromises that helped lay a foundation for democracy?",
    "metadata": [
      "A Government of National Unity for parties winning more than 5% of the vote",
      "The St James Church massacre in Cape Town",
      "Fixing the election date of 27 April 1994 despite continued violence",
      "The Shell House shooting in Johannesburg",
      "Mandela governing with Thabo Mbeki and FW de Klerk as deputies"
    ],
    "answer": [
      "A Government of National Unity for parties winning more than 5% of the vote",
      "Fixing the election date of 27 April 1994 despite continued violence",
      "Mandela governing with Thabo Mbeki and FW de Klerk as deputies",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "coming_of_democracy",
    "topic": "negotiated_settlement_1990_1994",
    "subtopic": "historical_causation",
    "skills": [
      "classify_policy_outcomes"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 5,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- A compromise is an agreement where each side gives something up.\n- Two options are acts of violence, not agreements."
  },
  {
    "name": "Question 6",
    "question": "Why was Mandela's televised address after Chris Hani's assassination in April 1993 significant?",
    "metadata": [
      "It announced that the ANC was withdrawing from negotiations for good",
      "It called for the immediate arrest of every member of the AWB",
      "It calmed the country and added pressure to set an election date",
      "It announced that Mandela had been sworn in as State President",
      ""
    ],
    "answer": [
      "It calmed the country and added pressure to set an election date",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "coming_of_democracy",
    "topic": "negotiated_settlement_1990_1994",
    "subtopic": "historical_causation",
    "skills": [
      "explain_historical_causation"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 6,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Mandela was not yet president, but the nation looked to him to respond.\n- Think about the risk of the violence spreading."
  },
  {
    "name": "Question 7",
    "question": "Essay prompt: \"Although the negotiations were plagued with violence, parties were willing to compromise. Do you agree?\" Which introduction takes a clear stance?",
    "metadata": [
      "There were many massacres between 1990 and 1994, including St James, Heidelberg Tavern and Shell House",
      "Some historians say the parties compromised and others say they did not, so it is hard to decide",
      "De Klerk replaced PW Botha in 1989, unbanned the ANC and freed Nelson Mandela in February 1990",
      "I agree: despite massacres and the AWB's attack, deals like the Record of Understanding secured 1994",
      ""
    ],
    "answer": [
      "I agree: despite massacres and the AWB's attack, deals like the Record of Understanding secured 1994",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "coming_of_democracy",
    "topic": "negotiated_settlement_1990_1994",
    "subtopic": "essay_argumentation",
    "skills": [
      "identify_a_strong_thesis_statement"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 7,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- The prompt asks \"Do you agree?\", so the introduction must say whether you do.\n- It should name both the violence and the compromises."
  },
  {
    "name": "Question 8",
    "question": "Arrange these sentences into one well-structured paragraph (Point, Evidence, Explanation, Link).",
    "metadata": [
      "Joe Slovo proposed a five-year Government of National Unity and job security for white civil servants.",
      "This shows that compromise, not violence, decided the path to the 1994 election.",
      "The sunset clause was a compromise that rescued the negotiations.",
      "This reassured the National Party that it would not lose everything at once, so talks could resume."
    ],
    "answer": [
      "The sunset clause was a compromise that rescued the negotiations.",
      "Joe Slovo proposed a five-year Government of National Unity and job security for white civil servants.",
      "This reassured the National Party that it would not lose everything at once, so talks could resume.",
      "This shows that compromise, not violence, decided the path to the 1994 election."
    ],
    "presentation": "ordering",
    "type": "application",
    "unit": "coming_of_democracy",
    "topic": "negotiated_settlement_1990_1994",
    "subtopic": "essay_argumentation",
    "skills": [
      "sequence_a_paragraph_structure"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 8,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Open with the main claim and close by linking back to the question.\n- The evidence names who proposed what."
  }
];

// ─── AI explanation (AMPM-CONTENT-AI-EXP) — one entry per REAL exam sub-question, against the memo ───

const aiExplanation = {
  sub_questions: [
  {
    "number": "5",
    "marks": 50,
    "clues": "- Decide whether you agree, and say so in the introduction.\n- Plan evidence for both the violence and the compromises, in time order.",
    "approach": "- State your stance and preview the evidence.\n- Move chronologically from 1990 to 1994, pairing each crisis with the compromise that followed.\n- Use PEEL paragraphs.\n- Conclude by tying the evidence back to your stance.",
    "solution": "1. Introduction: agree or disagree that, despite violence, compromises laid a firm foundation for democracy in 1994, and outline your evidence.\n2. De Klerk replaced PW Botha (1989), unbanned the ANC, PAC and SACP and released Mandela on 11 February 1990.\n3. Talks were postponed after the Sebokeng killings; the Groote Schuur Minute (May 1990) committed both sides to end violence; the Pretoria Minute (August 1990) suspended the armed struggle and lifted the State of Emergency.\n4. Violence continued (Melrose House grenade attack, Thokoza night attack); the National Peace Accord (September 1991) was signed by 27 organisations.\n5. CODESA 1 (December 1991) produced the Declaration of Intent but no deal on power-sharing; the whites-only referendum (1992) gave De Klerk a mandate to continue.\n6. CODESA 2 (May 1992) deadlocked; the ANC called rolling mass action; Boipatong (June 1992) and Bisho (September 1992) massacres; COSAG resisted.\n7. The Record of Understanding (26 September 1992) restarted talks; Slovo's sunset clause led to a Government of National Unity for parties with more than 5% of the vote.\n8. Multi-party talks resumed in April 1993; Chris Hani's assassination (10 April 1993) was calmed by Mandela's televised address; the AWB stormed the World Trade Centre (June 1993); St James, Heidelberg Tavern and Shell House massacres followed.\n9. The election date (27–29 April 1994) was set and held despite bombings; Mandela became president with Mbeki and De Klerk as deputies.\n10. Conclusion: tie the evidence back to your stance. Marks are awarded holistically on a seven-level matrix (content and presentation), out of 50."
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
