#!/usr/bin/env node
/**
 * DBE History P1 — November 2023 — Question 5 (order 5)
 * Independent Africa, the Congo: 'Mobutu's political, economic and cultural policies positively transformed the Congo in the 1960s' — do you agree?
 * Essay question: DESIGN-HIST-02 (no free-text essay; content-knowledge and essay-strategy items).
 * Q4/Q5/Q6 share one exam page (question_image_urls points at q4/question_1.png).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 * Typed blanks: numeric only, keyboard_type 'standard_math' on every fitb (KEYBOARD-04, DESIGN-HIST-03).
 *   node tools/validate-questions.js --script scripts/add-history-2023-nov-p1-q5.js --curriculum temp/curriculum-vocab-history-2023.json
 *   node scripts/add-history-2023-nov-p1-q5.js --dry-run
 *   node scripts/add-history-2023-nov-p1-q5.js
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
  "year": 2023,
  "paper": "nov_p1",
  "order": 5,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "mobutu_sese_seko",
    "zaireanisation",
    "congo_independence",
    "essay_writing_skills"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2023/nov_p1/q4/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2023/nov_p1/q5/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2023/nov_p1/q5/memo_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2023/nov_p1/q5/memo_3.png"
  ],
  "exam_question_marks": 50,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "What was the MPR (Popular Movement of the Revolution)?",
    "metadata": [
      "The rebel movement that led Katanga's attempt to break away from the Congo",
      "Lumumba's nationalist party, which won the most seats in the 1960 elections",
      "The ruling party Mobutu founded, which later became the only legal party",
      "The Belgian colonial council that governed the Congo until independence in 1960",
      ""
    ],
    "answer": [
      "The ruling party Mobutu founded, which later became the only legal party",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "independent_africa",
    "topic": "mobutu_congo_policies",
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
    "year": 2023,
    "paper": "nov_p1",
    "clues": "- Mobutu used it to turn the Congo into a one-party state.\n- Lumumba's party was the MNC."
  },
  {
    "name": "Question 2",
    "question": "Mobutu founded the Popular Movement of the Revolution (MPR) in the year [].",
    "metadata": [
      "Year: ",
      "[ ]"
    ],
    "answer": [
      "1967",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "definition",
    "unit": "independent_africa",
    "topic": "mobutu_congo_policies",
    "subtopic": "key_figures_and_events",
    "skills": [
      "identify_historical_event_or_term"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2023,
    "paper": "nov_p1",
    "keyboard_type": "standard_math",
    "clues": "- It was two years after Mobutu seized power in November 1965.\n- Write the year as four digits."
  },
  {
    "name": "Question 3",
    "question": "Which of these could you use as evidence to AGREE that Mobutu's policies transformed the Congo positively?",
    "metadata": [
      "He ended the rebellions and secessions of the early 1960s and brought a measure of stability",
      "Zaireanisation handed foreign-owned businesses to his unskilled allies and relatives",
      "He nationalised the Katanga copper industry so that its profits stayed in the Congo",
      "Opposition parties were banned and critics of the government were silenced",
      "He replaced competing regional and ethnic parties with one central government"
    ],
    "answer": [
      "He ended the rebellions and secessions of the early 1960s and brought a measure of stability",
      "He nationalised the Katanga copper industry so that its profits stayed in the Congo",
      "He replaced competing regional and ethnic parties with one central government",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "independent_africa",
    "topic": "mobutu_congo_policies",
    "subtopic": "essay_argumentation",
    "skills": [
      "classify_policy_outcomes"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2023,
    "paper": "nov_p1",
    "clues": "- Sort the options into successes and failures first.\n- Two options are evidence for disagreeing."
  },
  {
    "name": "Question 4",
    "question": "Why did the United States support Mobutu's government?",
    "metadata": [
      "He promised to hold free multi-party elections in the Congo every five years",
      "He was seen as a reliable anti-communist ally in Central Africa during the Cold War",
      "He agreed to hand the Congo's copper mines over to American mining companies for free",
      "He had been elected President of the Congo by a large majority in 1960",
      ""
    ],
    "answer": [
      "He was seen as a reliable anti-communist ally in Central Africa during the Cold War",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "interpretation",
    "unit": "independent_africa",
    "topic": "mobutu_congo_policies",
    "subtopic": "historical_causation",
    "skills": [
      "explain_historical_causation"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2023,
    "paper": "nov_p1",
    "clues": "- Think about the Cold War rivalry in Africa in the 1960s.\n- Mobutu was never elected in 1960: Kasavubu was president then."
  },
  {
    "name": "Question 5",
    "question": "Match each term to its meaning in the history of the Congo.",
    "metadata": [
      "A - Kleptocracy",
      "B - Retrocession",
      "C - Paternalism",
      "D - Personality cult",
      "1 - Handing nationalised businesses back to their former foreign owners",
      "2 - Rule by officials who use their power to steal the country's wealth",
      "3 - Building up public worship of the leader through propaganda and ritual",
      "4 - Belgian rule that treated the Congolese as children with no part in government"
    ],
    "answer": [
      "A-2",
      "B-1",
      "C-4",
      "D-3"
    ],
    "presentation": "match",
    "type": "definition",
    "unit": "independent_africa",
    "topic": "mobutu_congo_policies",
    "subtopic": "historical_terminology",
    "skills": [
      "define_historical_term"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 5,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2023,
    "paper": "nov_p1",
    "clues": "- 'Klepto-' comes from the Greek word for 'thief'.\n- Retrocession reversed an earlier economic policy."
  },
  {
    "name": "Question 6",
    "question": "The statement refers to Mobutu's policies in 'the 1960s'. How should this shape your essay?",
    "metadata": [
      "You should write only about the policies of Belgian colonial rule in the years before 1960",
      "You need not take a stance, because the statement covers such a short period",
      "You should write about Patrice Lumumba's government in 1960 instead of Mobutu's rule",
      "Focus on Mobutu's rule from 1965, and use later policies only to show where they led",
      ""
    ],
    "answer": [
      "Focus on Mobutu's rule from 1965, and use later policies only to show where they led",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "independent_africa",
    "topic": "mobutu_congo_policies",
    "subtopic": "essay_argumentation",
    "skills": [
      "evaluate_historical_extent"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 6,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2023,
    "paper": "nov_p1",
    "clues": "- Mobutu took power in 1965; Zaireanisation came in 1973.\n- An essay must answer the question as set, including its dates."
  },
  {
    "name": "Question 7",
    "question": "Essay prompt: 'Mobutu Sese Seko's political, economic and cultural policies positively transformed the post-independent Congo in the 1960s. Do you agree?' Which introduction best answers it?",
    "metadata": [
      "Mobutu Sese Seko ruled the Congo from 1965 to 1997. He introduced many political, economic and cultural policies, which this essay will now describe in turn.",
      "Patrice Lumumba was the first Prime Minister of the Congo, and his murder in 1961 was one of the most important events in the history of independent Africa.",
      "Some people think Mobutu helped the Congo and others think he harmed it, so both views have some truth and it is not possible to decide between them.",
      "I disagree: Mobutu brought stability after 1965, but one-party rule, corruption and economic mismanagement meant his policies did not transform the Congo.",
      ""
    ],
    "answer": [
      "I disagree: Mobutu brought stability after 1965, but one-party rule, corruption and economic mismanagement meant his policies did not transform the Congo.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "independent_africa",
    "topic": "mobutu_congo_policies",
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
    "year": 2023,
    "paper": "nov_p1",
    "clues": "- 'Do you agree?' needs a clear yes or no, with a preview of your evidence.\n- An introduction that only describes, hedges or drifts off the topic earns little."
  },
  {
    "name": "Question 8",
    "question": "Arrange these sentences into a well-structured paragraph (Point, Evidence, Explanation, Link).",
    "metadata": [
      "This ended the violent party conflicts of the early 1960s, but it left the Congolese with no say in how they were ruled.",
      "Mobutu's political policies brought stability at the cost of democracy.",
      "His political policies therefore did not transform the Congo positively, which supports disagreeing with the statement.",
      "After seizing power in 1965, he banned opposition and made the MPR the only legal party."
    ],
    "answer": [
      "Mobutu's political policies brought stability at the cost of democracy.",
      "After seizing power in 1965, he banned opposition and made the MPR the only legal party.",
      "This ended the violent party conflicts of the early 1960s, but it left the Congolese with no say in how they were ruled.",
      "His political policies therefore did not transform the Congo positively, which supports disagreeing with the statement."
    ],
    "presentation": "ordering",
    "type": "application",
    "unit": "independent_africa",
    "topic": "mobutu_congo_policies",
    "subtopic": "essay_argumentation",
    "skills": [
      "sequence_a_paragraph_structure"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 8,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2023,
    "paper": "nov_p1",
    "clues": "- A paragraph opens with its point and closes by linking back to the line of argument.\n- Evidence comes before the sentence that explains what it shows."
  }
];

// ─── AI explanation (AMPM-CONTENT-AI-EXP) — one entry per REAL exam sub-question, against the memo ───

const aiExplanation = {
  sub_questions: [
  {
    "number": "5",
    "marks": 50,
    "clues": "- 'Do you agree?' needs a clear stance: agree or disagree that the policies transformed the Congo positively.\n- Organise the evidence under political, economic and cultural policies.",
    "approach": "- State whether you agree or disagree, and preview how you will support it.\n- Write paragraphs on political, economic and cultural policies (Point, Evidence, Explanation, Link).\n- Acknowledge evidence on the other side, then show why your stance still holds.\n- Conclude by tying the evidence back to your stance.",
    "solution": "1. Introduction: agree or disagree that Mobutu's political, economic and cultural policies positively transformed the post-independent Congo, and preview the evidence.\n2. Background: Belgian paternalism left few Congolese with experience of government; many regional and ethnic parties formed before independence on 30 June 1960.\n3. Political instability after independence: Kasavubu and Lumumba clashed, and Tshombe led Katanga's secession.\n4. Political policies: Mobutu seized power in November 1965 and brought stability through authoritarian rule.\n5. He made the MPR (founded 1967) the only legal party, suppressed opposition, and built a personality cult (Mobutuism).\n6. He centralised power, controlled appointments and revenue, and allowed nepotism and kleptocracy; the USA backed him as an anti-communist ally.\n7. Economic policies: he nationalised the copper industry and used its profits to fund industrial plans.\n8. Zaireanisation (1973) gave foreign-owned businesses to his allies and family, causing corruption and mismanagement; retrocession later tried to bring foreign owners back.\n9. The economy declined: infrastructure decayed, inflation rose, and the country depended on foreign aid and loans.\n10. Cultural policies: Authenticité promoted African names, music, art, hairstyles and dress (the abacost replaced Western suits) to build national unity.\n11. Education expanded after independence, but French remained the medium of instruction, an urban elite benefited most, and teachers and health workers often went unpaid.\n12. Conclusion: tie the evidence back to your stance. Marks are awarded holistically on a seven-level matrix (content and presentation)."
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
