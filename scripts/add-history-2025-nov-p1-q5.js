#!/usr/bin/env node
/**
 * DBE History P1 — November 2025 — Question 5 (order 5)
 * Independent Africa, case study the Congo: Mobutu Sese Seko's policies after independence (essay).
 * Essay question: DESIGN-HIST-02 (no free-text input; content-knowledge items plus essay-strategy items).
 * Q4/Q5/Q6 share one exam page (question_image_urls points at q4/question_1.png).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 * Typed blanks: numeric only, keyboard_type 'standard_math' on every fitb (KEYBOARD-04, DESIGN-HIST-03).
 *   node tools/validate-questions.js --script scripts/add-history-2025-nov-p1-q5.js --curriculum temp/curriculum-vocab-history.json
 *   node scripts/add-history-2025-nov-p1-q5.js --dry-run
 *   node scripts/add-history-2025-nov-p1-q5.js
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
  "year": 2025,
  "paper": "nov_p1",
  "order": 5,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "congo_independence",
    "mobutu_sese_seko",
    "zaireanisation",
    "authenticite",
    "essay_writing_skills"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2025/nov_p1/q4/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2025/nov_p1/q5/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2025/nov_p1/q5/memo_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2025/nov_p1/q5/memo_3.png"
  ],
  "exam_question_marks": 50,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Who became the Congo's first Prime Minister at independence in 1960?",
    "metadata": [
      "Joseph Kasavubu",
      "Patrice Lumumba",
      "Moise Tshombe",
      "Mobutu Sese Seko",
      ""
    ],
    "answer": [
      "Patrice Lumumba",
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
    "difficulty": 1,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- He led the party that won the most seats in the 1960 elections.\n- The President at the time was someone else, who preferred a federal state."
  },
  {
    "name": "Question 2",
    "question": "What was the aim of Mobutu's policy of Authenticité?",
    "metadata": [
      "To hand the copper mines back to Belgian companies",
      "To introduce multiparty elections",
      "To make French the only language of government",
      "To remove colonial influence by promoting African names, dress and culture",
      ""
    ],
    "answer": [
      "To remove colonial influence by promoting African names, dress and culture",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "independent_africa",
    "topic": "mobutu_congo_policies",
    "subtopic": "historical_terminology",
    "skills": [
      "define_historical_term"
    ],
    "difficulty": 2,
    "exam_weight": 3,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- The word is related to 'authentic'.\n- Think of the renaming of the country and its cities."
  },
  {
    "name": "Question 3",
    "question": "Match each Congolese economic or social measure to its description.",
    "metadata": [
      "A - Zaireanisation",
      "B - Retrocession",
      "C - Nationalisation of the copper industry",
      "D - Abacos",
      "1 - Transfer of foreign-owned businesses to Zairian nationals, often unskilled political allies",
      "2 - Partial return of businesses to former foreign owners to try to restore the economy",
      "3 - State takeover of the mining industry, with profits used to fund industrialisation",
      "4 - A ban on Western-style suits, replaced by a national style of dress"
    ],
    "answer": [
      "A-1",
      "B-2",
      "C-3",
      "D-4"
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
    "exam_weight": 3,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- One of these was a reversal of another.\n- One concerns clothing rather than the economy."
  },
  {
    "name": "Question 4",
    "question": "Mobutu renamed the Congo 'Zaire' in the year [].",
    "metadata": [
      "Year: ",
      "[ ]"
    ],
    "answer": [
      "1971",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "interpretation",
    "unit": "independent_africa",
    "topic": "mobutu_congo_policies",
    "subtopic": "key_figures_and_events",
    "skills": [
      "identify_historical_event_or_term"
    ],
    "difficulty": 1,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2025,
    "paper": "nov_p1",
    "keyboard_type": "standard_math",
    "clues": "- The change was part of the same cultural policy that renamed Leopoldville.\n- Write four digits only."
  },
  {
    "name": "Question 5",
    "question": "Which of the following are generally regarded as failures of Mobutu's rule?",
    "metadata": [
      "Zaireanisation led to mismanagement, nepotism and kleptocracy",
      "The economy collapsed under high inflation and dependence on foreign aid",
      "A one-party state under the MPR with a personality cult around Mobutu",
      "Africanisation of names and dress",
      "Encouragement of African music and dance"
    ],
    "answer": [
      "Zaireanisation led to mismanagement, nepotism and kleptocracy",
      "The economy collapsed under high inflation and dependence on foreign aid",
      "A one-party state under the MPR with a personality cult around Mobutu",
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
    "order": 5,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Cultural measures are usually counted as successes in this debate.\n- Look for options about corruption, collapse and concentration of power."
  },
  {
    "name": "Question 6",
    "question": "Why was the Congo poorly prepared for self-government in 1960?",
    "metadata": [
      "Belgium had trained a large Congolese civil service before independence",
      "The Congo had a long tradition of multiparty democracy",
      "Belgian paternalism left the Congolese with very little experience of administration or representation",
      "The United Nations had governed the Congo for decades",
      ""
    ],
    "answer": [
      "Belgian paternalism left the Congolese with very little experience of administration or representation",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "independent_africa",
    "topic": "mobutu_congo_policies",
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
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Think about who made decisions in the colony before independence.\n- Belgium withdrew quickly after the 1959 riots."
  },
  {
    "name": "Question 7",
    "question": "Essay prompt: 'Mobutu's policies were a dismal failure. Critically discuss.' Which introduction best answers it?",
    "metadata": [
      "Mobutu was a dictator and everything he did was bad",
      "Mobutu's policies brought some gains, such as higher school enrolment and a cultural revival, but corruption and authoritarian rule caused far greater failures",
      "I will now tell the story of the Congo from 1960",
      "Mobutu's policies were a complete success in every area",
      ""
    ],
    "answer": [
      "Mobutu's policies brought some gains, such as higher school enrolment and a cultural revival, but corruption and authoritarian rule caused far greater failures",
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
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- 'Critically discuss' asks you to weigh both sides before judging.\n- A strong introduction names both successes and failures and says which weighs more."
  },
  {
    "name": "Question 8",
    "question": "Arrange these sentences into a well-structured paragraph (Point, Evidence, Explanation, Link).",
    "metadata": [
      "Zaireanisation replaced skilled foreign managers with unskilled political allies, while inflation rose and the country depended on foreign aid.",
      "This supports the view that his economic policies failed, although copper nationalisation brought some short-term success.",
      "Mobutu's economic policies failed to build a lasting economy.",
      "Because posts went to loyalists rather than skilled managers, businesses were mismanaged and officials abused their positions for gain."
    ],
    "answer": [
      "Mobutu's economic policies failed to build a lasting economy.",
      "Zaireanisation replaced skilled foreign managers with unskilled political allies, while inflation rose and the country depended on foreign aid.",
      "Because posts went to loyalists rather than skilled managers, businesses were mismanaged and officials abused their positions for gain.",
      "This supports the view that his economic policies failed, although copper nationalisation brought some short-term success."
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
    "exam_weight": 3,
    "xp": 10,
    "order": 8,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- The opening sentence makes the claim the rest of the paragraph supports.\n- The last sentence connects back to the statement in the prompt."
  }
];

// ─── AI explanation (AMPM-CONTENT-AI-EXP) — one entry per REAL exam sub-question, against the memo ───

const aiExplanation = {
  sub_questions: [
  {
    "number": "5",
    "marks": 50,
    "clues": "- - Take a critical stance: weigh successes against failures rather than describing only one side.\n- - Organise by political, economic, social and cultural policies.",
    "approach": "- - Introduce a balanced line of argument on whether Mobutu's policies were a dismal failure.\n- - Write a paragraph for each policy area with evidence and a judgement.\n- - Show how Belgian colonial legacy shaped the starting point.\n- - Conclude with a final judgement.",
    "solution": "1. Introduction: take a critical stance, that Mobutu's policies after independence had some successes as well as some failures, and preview the evidence.\n2. Political: Belgian paternalism left the Congo without administrative experience; around 120 parties contested the 1960 elections and none won a majority (Lumumba's MNC won the most seats); Kasavubu (federal state) and Lumumba (centralised state) clashed; Tshombe pursued Katanga's secession; Mobutu seized power in 1965 and brought stability through authoritarianism, ended the Katanga rebellion in 1967 and introduced a new constitution.\n3. One-party state under the MPR: Mobutu built a personality cult (Mobutuism) and ruled as a military dictator (failure); he created a strong centralised government controlling appointments, promotions and revenue.\n4. Zaireanisation replaced skilled foreigners with unskilled locals, leading to mismanagement, nepotism and kleptocracy (failure).\n5. Economic: Belgium left a single-product capitalist economy owned by foreigners; Mobutu nationalised the copper industry and financed a ten-year industrialisation plan (some success) but gave companies to allies and family (nepotism).\n6. Poor infrastructure, kleptocracy, high inflation and dependence on foreign aid such as from the World Bank (failures); retrocession tried to bring back foreign owners but few returned (limited success).\n7. Social: the colonial education system left the Congo with 14 university graduates among 14 million people; primary enrolment rose from 1,6 million in 1960 to 4,6 million in 1974 (success) but declined when state funding was withdrawn and teachers went unpaid (failure); French and Western-style education favoured an urban elite.\n8. Dress: Western suits were outlawed and replaced by the abacos (a social-status success); Mobutu ruled as a traditional chief and used this to strengthen authoritarian rule.\n9. Cultural: Authenticité (also Africanisation) replaced Christian names with African names, renamed the Congo Zaire (1971) and cities Kinshasa, Lubumbashi and Kisangani, and encouraged African music, art, dance and hairstyles (successes).\n10. Conclusion: weigh the successes against the failures and tie the evidence back to your stance. Marks are awarded holistically on a seven-level matrix (content and presentation)."
  }
],
  model: 'claude-sonnet-5-5',
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
