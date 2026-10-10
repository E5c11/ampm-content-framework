#!/usr/bin/env node
/**
 * DBE History P2 — November 2023 — Question 5 (order 5)
 * Coming of Democracy (essay): critically discuss whether continuous violence and conflict on the road to democracy failed to stop the 1994 election.
 * Essay question: DESIGN-HIST-02. Shares the Section B exam page uploaded under q4.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 * Typed blanks: numeric only, keyboard_type 'standard_math' on every fitb (KEYBOARD-04, DESIGN-HIST-03).
 *   node tools/validate-questions.js --script scripts/add-history-2023-nov-p2-q5.js --curriculum temp/curriculum-vocab-history-p2-2023.json
 *   node scripts/add-history-2023-nov-p2-q5.js --dry-run
 *   node scripts/add-history-2023-nov-p2-q5.js
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
  "paper": "nov_p2",
  "order": 5,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "negotiated_settlement",
    "political_violence",
    "first_democratic_election_1994",
    "codesa"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2023/nov_p2/q4/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2023/nov_p2/q5/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2023/nov_p2/q5/memo_2.png"
  ],
  "exam_question_marks": 50
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Match each violent event of 1993-1994 to what happened.",
    "metadata": [
      "A - St James Church massacre (July 1993)",
      "B - Storming of the World Trade Centre (June 1993)",
      "C - Bophuthatswana crisis (March 1994)",
      "D - Shell House massacre (March 1994)",
      "1 - ANC guards opened fire on IFP marchers in central Johannesburg",
      "2 - APLA gunmen attacked a congregation during a Cape Town church service",
      "3 - Right-wing militias failed to prop up a homeland government, which collapsed",
      "4 - AWB members drove an armoured vehicle into the venue of the negotiations"
    ],
    "answer": [
      "A-2",
      "B-4",
      "C-3",
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
    "order": 1,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2023,
    "paper": "nov_p2",
    "clues": "- Two events involved right-wing groups.\n- Shell House was the ANC's headquarters."
  },
  {
    "name": "Question 2",
    "question": "The National Peace Accord, meant to curb political violence, was signed in September [].",
    "metadata": [
      "Year: ",
      "[ ]"
    ],
    "answer": [
      "1991",
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
    "exam_weight": 1,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2023,
    "paper": "nov_p2",
    "keyboard_type": "standard_math",
    "clues": "- It was signed a few months before CODESA 1 met in December.\n- Write four digits."
  },
  {
    "name": "Question 3",
    "question": "Why did the IFP's decision of April 1994 matter for the election?",
    "metadata": [
      "The IFP called a boycott that kept millions of voters away from the polls",
      "The IFP won the national vote and formed the first democratic government",
      "The IFP signed the Record of Understanding with the National Party during that same week",
      "Buthelezi joined the election a week before polling, easing the threat of disruption",
      ""
    ],
    "answer": [
      "Buthelezi joined the election a week before polling, easing the threat of disruption",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "interpretation",
    "unit": "coming_of_democracy",
    "topic": "negotiated_settlement_1990_1994",
    "subtopic": "historical_causation",
    "skills": [
      "explain_historical_causation"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2023,
    "paper": "nov_p2",
    "clues": "- The IFP had threatened to boycott the election.\n- Stickers had to be added to the printed ballot papers."
  },
  {
    "name": "Question 4",
    "question": "Which of these show the negotiations surviving violence on the way to the 1994 election?",
    "metadata": [
      "After Boipatong the ANC left the talks, but the Record of Understanding restored them that September",
      "The election was postponed to 1995 because of the Shell House massacre",
      "After Chris Hani's assassination the negotiators went on to fix the election date",
      "CODESA 1 collapsed when the AWB stormed the World Trade Centre in 1991",
      "Bomb blasts in Johannesburg in the week of the vote did not stop the election"
    ],
    "answer": [
      "After Boipatong the ANC left the talks, but the Record of Understanding restored them that September",
      "After Chris Hani's assassination the negotiators went on to fix the election date",
      "Bomb blasts in Johannesburg in the week of the vote did not stop the election",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "coming_of_democracy",
    "topic": "negotiated_settlement_1990_1994",
    "subtopic": "essay_argumentation",
    "skills": [
      "evaluate_historical_extent"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2023,
    "paper": "nov_p2",
    "clues": "- Check the dates: the AWB attack was in 1993, at the multi-party talks.\n- The election was held on schedule in April 1994."
  },
  {
    "name": "Question 5",
    "question": "Why was the National Peace Accord significant for the road to democracy?",
    "metadata": [
      "It set up structures to monitor and reduce violence, though the violence went on",
      "It ended all political violence in South Africa before CODESA 1 could begin",
      "It was signed only by the ANC and the National Party, leaving out every other group",
      "It replaced the negotiations with an international peacekeeping force for the country",
      ""
    ],
    "answer": [
      "It set up structures to monitor and reduce violence, though the violence went on",
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
    "exam_weight": 2,
    "xp": 10,
    "order": 5,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2023,
    "paper": "nov_p2",
    "clues": "- The accord was signed by 27 organisations.\n- Massacres such as Boipatong happened after it was signed."
  },
  {
    "name": "Question 6",
    "question": "Essay prompt: \"Critically discuss: continuous violence failed to stop the first democratic elections in 1994.\" Which introduction is strongest?",
    "metadata": [
      "The negotiations from 1990 to 1994 were completely peaceful and free of conflict",
      "Mandela was released in 1990 and became president after an election in 1994",
      "Violence kept disrupting the talks, but each crisis pushed leaders back to compromise",
      "Violence completely destroyed the talks, so South Africa never reached a democratic election",
      ""
    ],
    "answer": [
      "Violence kept disrupting the talks, but each crisis pushed leaders back to compromise",
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
    "exam_weight": 2,
    "xp": 10,
    "order": 6,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2023,
    "paper": "nov_p2",
    "clues": "- \"Critically discuss\" needs a balanced, evaluative stance.\n- Two options contradict the historical record."
  },
  {
    "name": "Question 7",
    "question": "Arrange these violent events in the order they happened.",
    "metadata": [
      "Chris Hani is assassinated",
      "The Bisho massacre",
      "The Shell House massacre",
      "The Boipatong massacre",
      "The AWB storms the World Trade Centre"
    ],
    "answer": [
      "The Boipatong massacre",
      "The Bisho massacre",
      "Chris Hani is assassinated",
      "The AWB storms the World Trade Centre",
      "The Shell House massacre"
    ],
    "presentation": "ordering",
    "type": "interpretation",
    "unit": "coming_of_democracy",
    "topic": "negotiated_settlement_1990_1994",
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
    "clues": "- Two events happened in 1992 and two in 1993.\n- One happened a month before the election."
  },
  {
    "name": "Question 8",
    "question": "Arrange these sentences into one well-structured paragraph (Point, Evidence, Explanation, Link).",
    "metadata": [
      "Both sides saw that a long deadlock would only bring more bloodshed.",
      "This shows that violence delayed, but did not derail, the road to the 1994 election.",
      "Violence threatened the negotiations but did not stop them.",
      "After the Boipatong massacre in June 1992 the ANC suspended talks, yet the Record of Understanding restored them in September."
    ],
    "answer": [
      "Violence threatened the negotiations but did not stop them.",
      "After the Boipatong massacre in June 1992 the ANC suspended talks, yet the Record of Understanding restored them in September.",
      "Both sides saw that a long deadlock would only bring more bloodshed.",
      "This shows that violence delayed, but did not derail, the road to the 1994 election."
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
    "exam_weight": 2,
    "xp": 10,
    "order": 8,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2023,
    "paper": "nov_p2",
    "clues": "- Open with the main claim and close by linking back to the question.\n- The dated example is the evidence."
  }
];

// ─── AI explanation (AMPM-CONTENT-AI-EXP) — one guidance entry for the essay (no numbered sub-parts), against the memo ───

const aiExplanation = {
  sub_questions: [
  {
    "number": "5",
    "marks": 50,
    "clues": "- \"Critically discuss\" needs a balanced line of argument.\n- Plan the violence and the progress side by side, in time order.",
    "approach": "- State your line of argument and preview the evidence.\n- Move chronologically from 1990 to 1994, pairing each outbreak of violence with what happened to the talks.\n- Use PEEL paragraphs.\n- Conclude by tying the evidence back to your argument.",
    "solution": "1. Introduction: critically discuss whether continuous violence and conflict failed to stop the 1994 election, and outline your evidence.\n2. De Klerk (1989) unbanned the ANC, PAC and SACP and released Mandela on 11 February 1990; attacks on train commuters and third force rumours destabilised the talks.\n3. Talks were postponed after the Sebokeng killings (March 1990); the Groote Schuur Minute (May 1990) and Pretoria Minute (August 1990) committed the parties to end violence and suspended the armed struggle; violence continued in the Vaal and Thokoza.\n4. The National Peace Accord (September 1991) was signed by 27 organisations; CODESA 1 (December 1991) produced the Declaration of Intent but no deal on power-sharing.\n5. The whites-only referendum (March 1992) gave De Klerk a mandate; CODESA 2 (May 1992) deadlocked; the ANC called rolling mass action; Boipatong (June 1992) and Bisho (September 1992) followed; COSAG resisted.\n6. The Record of Understanding (26 September 1992) restarted talks; Slovo's sunset clause (proposed in 1992) led to a Government of National Unity.\n7. Multi-party talks resumed in April 1993; Chris Hani's assassination (10 April 1993) was calmed by Mandela's address; the AWB stormed the World Trade Centre (June 1993); the St James, Heidelberg Tavern and Shell House massacres followed.\n8. The election was set for 27–29 April 1994 and held despite bombs in Johannesburg and at Jan Smuts airport; Mandela became president with Mbeki and De Klerk as deputies.\n9. Conclusion: tie the evidence back to your argument. Marks are awarded holistically on a seven-level matrix (content and presentation), out of 50."
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
