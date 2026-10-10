#!/usr/bin/env node
/**
 * DBE History P1 — November 2024 — Question 5 (order 5)
 * Independent Africa, case study the Congo: were Mobutu's policies anti-colonial in nature? (essay).
 * Essay question: DESIGN-HIST-02 (no free-text input; content-knowledge items plus essay-strategy items).
 * Q4/Q5/Q6 share one exam page (question_image_urls points at q4/question_1.png).
 * Memo caution applied: the memo says Mobutu stayed 'president for life' until his death in 2007; he was overthrown
 * in May 1997 and died that September, so the explanation says 1997.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 * Typed blanks: numeric only, keyboard_type 'standard_math' on every fitb (KEYBOARD-04, DESIGN-HIST-03).
 *   node tools/validate-questions.js --script scripts/add-history-2024-nov-p1-q5.js --curriculum temp/curriculum-vocab-history-2024.json
 *   node scripts/add-history-2024-nov-p1-q5.js --dry-run
 *   node scripts/add-history-2024-nov-p1-q5.js
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
  "paper": "nov_p1",
  "order": 5,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "mobutu_sese_seko",
    "zaireanisation",
    "authenticite",
    "anti_colonialism",
    "essay_writing_skills"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2024/nov_p1/q4/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2024/nov_p1/q5/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2024/nov_p1/q5/memo_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2024/nov_p1/q5/memo_3.png"
  ],
  "exam_question_marks": 50,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "What was Mobutu's policy of Zaireanisation, introduced in 1973?",
    "metadata": [
      "Inviting foreign owners back to run the businesses they had lost",
      "Banning all political parties except his own, the MPR",
      "Replacing European names of people and places with African ones",
      "Transferring foreign-owned businesses to Zairian nationals",
      ""
    ],
    "answer": [
      "Transferring foreign-owned businesses to Zairian nationals",
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
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- The policy was about who owned the economy.\n- One option describes the policy that later reversed it."
  },
  {
    "name": "Question 2",
    "question": "Match each of Mobutu's policies to what it involved.",
    "metadata": [
      "A - Authenticité",
      "B - The abacost",
      "C - Retrocession",
      "D - Nationalisation of the copper mines",
      "1 - A jacket that replaced the Western suit and tie",
      "2 - The state taking control of Union Minière's mining operations",
      "3 - Promoting African names and culture over European ones",
      "4 - Handing businesses back to foreign owners from 1976"
    ],
    "answer": [
      "A-3",
      "B-1",
      "C-4",
      "D-2"
    ],
    "presentation": "match",
    "type": "interpretation",
    "unit": "independent_africa",
    "topic": "mobutu_congo_policies",
    "subtopic": "key_figures_and_events",
    "skills": [
      "identify_historical_event_or_term"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Two policies are cultural and two are economic.\n- 'Abacost' comes from the French for 'down with the suit'."
  },
  {
    "name": "Question 3",
    "question": "Which of these could you use as evidence that Mobutu's policies were anti-colonial?",
    "metadata": [
      "Renaming the country Zaire and Léopoldville Kinshasa",
      "Banning Western suits in favour of the abacost",
      "Nationalising the copper industry once owned by Belgian firms",
      "Keeping French as the language of instruction in schools",
      "Inviting foreign owners to return through retrocession"
    ],
    "answer": [
      "Renaming the country Zaire and Léopoldville Kinshasa",
      "Banning Western suits in favour of the abacost",
      "Nationalising the copper industry once owned by Belgian firms",
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
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Anti-colonial policies reject the influence of the former colonial power.\n- Two options continued or restored colonial-era patterns."
  },
  {
    "name": "Question 4",
    "question": "Which of these could support DISAGREEING that Mobutu's policies were anti-colonial?",
    "metadata": [
      "French remained the language of schooling, which favoured a small urban elite",
      "The economy stayed dependent on copper exports and on foreign loans and aid",
      "He ruled without elections or representation, much like Belgian paternalism",
      "He promoted African music, dance and hairstyles as part of Authenticité",
      "He replaced Christian first names with African names for all citizens"
    ],
    "answer": [
      "French remained the language of schooling, which favoured a small urban elite",
      "The economy stayed dependent on copper exports and on foreign loans and aid",
      "He ruled without elections or representation, much like Belgian paternalism",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "independent_africa",
    "topic": "mobutu_congo_policies",
    "subtopic": "essay_argumentation",
    "skills": [
      "evaluate_a_counter_argument"
    ],
    "difficulty": 4,
    "exam_weight": 3,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Look for policies that kept patterns from the Belgian Congo.\n- Cultural pride policies support agreeing, not disagreeing."
  },
  {
    "name": "Question 5",
    "question": "Mobutu seized power from President Kasavubu in a coup in November [].",
    "metadata": [
      "Year: ",
      "[ ]"
    ],
    "answer": [
      "1965",
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
    "difficulty": 2,
    "exam_weight": 1,
    "xp": 10,
    "order": 5,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2024,
    "paper": "nov_p1",
    "keyboard_type": "standard_math",
    "clues": "- The coup ended the political crisis that followed independence, while Kasavubu was still President.\n- Write the four digits only."
  },
  {
    "name": "Question 6",
    "question": "Arrange these events in the order in which they happened.",
    "metadata": [
      "The Congo is renamed Zaire",
      "Retrocession hands businesses back to foreign owners",
      "The Congo becomes independent from Belgium",
      "Zaireanisation transfers foreign businesses to Zairians",
      "Mobutu seizes power in a coup"
    ],
    "answer": [
      "The Congo becomes independent from Belgium",
      "Mobutu seizes power in a coup",
      "The Congo is renamed Zaire",
      "Zaireanisation transfers foreign businesses to Zairians",
      "Retrocession hands businesses back to foreign owners"
    ],
    "presentation": "ordering",
    "type": "interpretation",
    "unit": "independent_africa",
    "topic": "mobutu_congo_policies",
    "subtopic": "historical_chronology",
    "skills": [
      "sequence_historical_events"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 6,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Independence came in 1960 and the renaming in 1971.\n- Retrocession was a response to a policy that had failed."
  },
  {
    "name": "Question 7",
    "question": "Essay prompt: 'Mobutu's political, economic, social and cultural policies were anti-colonial in nature. Do you agree?' Which introduction takes the clearest line of argument?",
    "metadata": [
      "Mobutu was born in 1930, served in the colonial Force Publique and later became one of the longest-ruling leaders in all of Africa.",
      "I largely agree: Authenticité, Zaireanisation and nationalisation rejected Belgian control, though his one-party rule echoed colonial methods.",
      "There are many different opinions about Mobutu's policies, and each side has some good points, so it is very hard to agree or disagree with them.",
      "Patrice Lumumba was the first Prime Minister of the Congo, and his murder in 1961 shocked the many people who supported him.",
      ""
    ],
    "answer": [
      "I largely agree: Authenticité, Zaireanisation and nationalisation rejected Belgian control, though his one-party rule echoed colonial methods.",
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
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- 'Do you agree?' needs a clear yes or no, which may be qualified.\n- A strong introduction names the policies you will use as evidence."
  },
  {
    "name": "Question 8",
    "question": "Arrange these sentences into a well-structured paragraph (Point, Evidence, Explanation, Link).",
    "metadata": [
      "Under Authenticité the country became Zaire, citizens took African names and the abacost replaced the Western suit.",
      "This supports the view that his cultural policies broke with the colonial past.",
      "Mobutu's cultural policies were clearly anti-colonial.",
      "By rejecting European names and dress, he tried to restore African pride after decades of Belgian rule."
    ],
    "answer": [
      "Mobutu's cultural policies were clearly anti-colonial.",
      "Under Authenticité the country became Zaire, citizens took African names and the abacost replaced the Western suit.",
      "By rejecting European names and dress, he tried to restore African pride after decades of Belgian rule.",
      "This supports the view that his cultural policies broke with the colonial past."
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
    "year": 2024,
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
    "clues": "- Decide whether you agree, then defend that line throughout.\n- Cover all four policy areas in the prompt: political, economic, social and cultural.",
    "approach": "- State your stance and preview the policy areas.\n- Write one paragraph per area, showing whether each policy was anti-colonial.\n- Acknowledge counter-evidence and explain why your stance still holds.\n- Conclude by tying the evidence back to your stance.",
    "solution": "1. Introduction: state whether you agree that Mobutu's policies were anti-colonial, and preview the evidence.\n2. Background: Belgian paternalism gave the Congolese no role in government; at independence (30 June 1960) the Congo had very few graduates and was politically divided.\n3. Political: Mobutu seized power in 1965, ended the Katanga rebellion, made the MPR the only party (1967) and built a personality cult; strong central rule replaced Belgian control, but it was authoritarian and backed by the USA as an anti-communist ally.\n4. Economic: he nationalised the copper mines and, through Zaireanisation (1973), transferred foreign businesses to Zairians; mismanagement, nepotism and kleptocracy followed, forcing retrocession and leaving Zaire dependent on foreign aid.\n5. Social and cultural: Authenticité renamed the country Zaire and its cities, replaced Christian names, banned Western suits for the abacost and promoted African music, dance and hairstyles.\n6. Continuities: French remained the language of instruction, education favoured an urban elite, and school funding later collapsed.\n7. Conclusion: tie the evidence back to your stance. Mobutu ruled until he was overthrown in 1997. Marks are awarded holistically on a seven-level matrix (content and presentation)."
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
