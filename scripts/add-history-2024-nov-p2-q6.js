#!/usr/bin/env node
/**
 * DBE History P2 — November 2024 — Question 6 (order 6)
 * End of the Cold War (essay): did Gorbachev's reforms lead to the downfall of the Soviet Union and the end of the Cold War?
 * Essay question: DESIGN-HIST-02. Shares the Section B exam page uploaded under q4.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 * Typed blanks: numeric only, keyboard_type 'standard_math' on every fitb (KEYBOARD-04, DESIGN-HIST-03).
 *   node tools/validate-questions.js --script scripts/add-history-2024-nov-p2-q6.js --curriculum temp/curriculum-vocab-history-p2-2024.json
 *   node scripts/add-history-2024-nov-p2-q6.js --dry-run
 *   node scripts/add-history-2024-nov-p2-q6.js
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
  "subject": "history",
  "year": 2024,
  "paper": "nov_p2",
  "order": 6,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "glasnost_perestroika",
    "mikhail_gorbachev",
    "soviet_union_collapse",
    "berlin_wall"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2024/nov_p2/q4/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2024/nov_p2/q6/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2024/nov_p2/q6/memo_2.png"
  ],
  "exam_question_marks": 50,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Which factors had weakened the Soviet economy before Gorbachev's reforms began?",
    "metadata": [
      "Heavy spending on the arms and space race with the USA",
      "Marshall Plan loans that the USSR could not repay",
      "The costly war in Afghanistan from 1979",
      "Outdated industry and technology with low productivity",
      "Western sanctions imposed in response to Glasnost"
    ],
    "answer": [
      "Heavy spending on the arms and space race with the USA",
      "The costly war in Afghanistan from 1979",
      "Outdated industry and technology with low productivity",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "end_of_cold_war_new_world_order",
    "topic": "glasnost_perestroika_soviet_collapse",
    "subtopic": "historical_causation",
    "skills": [
      "explain_historical_causation"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- The question asks about the years before 1985.\n- The USSR rejected Marshall Plan aid in 1947."
  },
  {
    "name": "Question 2",
    "question": "At home, Gorbachev faced two kinds of critics. Who were the \"liberal\" critics?",
    "metadata": [
      "Communist hardliners who wanted to reverse the reforms",
      "Army generals who wanted to resume the war in Afghanistan",
      "Reformers who said his changes were moving too slowly",
      "Western leaders who opposed Soviet arms reductions",
      ""
    ],
    "answer": [
      "Reformers who said his changes were moving too slowly",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "interpretation",
    "unit": "end_of_cold_war_new_world_order",
    "topic": "glasnost_perestroika_soviet_collapse",
    "subtopic": "key_figures_and_events",
    "skills": [
      "identify_historical_event_or_term"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- The two groups attacked him from opposite directions.\n- \"Liberal\" critics wanted more change, not less."
  },
  {
    "name": "Question 3",
    "question": "The USSR was formally dissolved on 25 December [].",
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
    "unit": "end_of_cold_war_new_world_order",
    "topic": "glasnost_perestroika_soviet_collapse",
    "subtopic": "key_figures_and_events",
    "skills": [
      "identify_historical_event_or_term"
    ],
    "difficulty": 1,
    "exam_weight": 1,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2024,
    "paper": "nov_p2",
    "keyboard_type": "standard_math",
    "clues": "- It happened two years after the fall of the Berlin Wall.\n- Write four digits."
  },
  {
    "name": "Question 4",
    "question": "When the Soviet Union broke up, it split into [] independent republics.",
    "metadata": [
      "Republics: ",
      "[ ]"
    ],
    "answer": [
      "15",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "interpretation",
    "unit": "end_of_cold_war_new_world_order",
    "topic": "glasnost_perestroika_soviet_collapse",
    "subtopic": "key_figures_and_events",
    "skills": [
      "identify_historical_event_or_term"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2024,
    "paper": "nov_p2",
    "keyboard_type": "standard_math",
    "clues": "- Count Russia and Ukraine among them.\n- Write the number only."
  },
  {
    "name": "Question 5",
    "question": "Match each person, group or plan to its role in the Soviet collapse.",
    "metadata": [
      "A - Boris Yeltsin",
      "B - Commonwealth of Independent States",
      "C - Communist hardliners",
      "D - Federation of States",
      "1 - Opponents of reform who tried to remove Gorbachev",
      "2 - Gorbachev's failed plan to hold the republics together",
      "3 - Loose association formed by former Soviet republics",
      "4 - Gorbachev's rival who led Russia away from the union"
    ],
    "answer": [
      "A-4",
      "B-3",
      "C-1",
      "D-2"
    ],
    "presentation": "match",
    "type": "interpretation",
    "unit": "end_of_cold_war_new_world_order",
    "topic": "glasnost_perestroika_soviet_collapse",
    "subtopic": "key_figures_and_events",
    "skills": [
      "identify_historical_event_or_term"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 5,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- One item is what replaced the USSR; another is Gorbachev's attempt to save it.\n- One is a single person."
  },
  {
    "name": "Question 6",
    "question": "Which is the strongest counter-argument to the claim that Gorbachev's reforms caused the Soviet collapse?",
    "metadata": [
      "Glasnost allowed open criticism of the Communist Party and of Gorbachev",
      "The economy was failing before 1985; reforms only exposed the weakness",
      "Perestroika allowed small-scale private ownership of businesses",
      "Gorbachev became leader of the Communist Party in 1985, aged 54",
      ""
    ],
    "answer": [
      "The economy was failing before 1985; reforms only exposed the weakness",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "end_of_cold_war_new_world_order",
    "topic": "glasnost_perestroika_soviet_collapse",
    "subtopic": "essay_argumentation",
    "skills": [
      "evaluate_a_counter_argument"
    ],
    "difficulty": 4,
    "exam_weight": 3,
    "xp": 10,
    "order": 6,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- A counter-argument points to a different or deeper cause.\n- Two options describe the reforms themselves; one is a plain fact."
  },
  {
    "name": "Question 7",
    "question": "Arrange these steps into a logical explanation of how the reforms led to the end of the Cold War.",
    "metadata": [
      "Republics, including Russia, declare independence",
      "The Cold War ends, leaving the USA as the only superpower",
      "Glasnost allows open criticism of the government",
      "The USSR is dissolved and the Communist Party disbanded",
      "Old nationalisms revive in the Soviet republics"
    ],
    "answer": [
      "Glasnost allows open criticism of the government",
      "Old nationalisms revive in the Soviet republics",
      "Republics, including Russia, declare independence",
      "The USSR is dissolved and the Communist Party disbanded",
      "The Cold War ends, leaving the USA as the only superpower"
    ],
    "presentation": "ordering",
    "type": "application",
    "unit": "end_of_cold_war_new_world_order",
    "topic": "glasnost_perestroika_soviet_collapse",
    "subtopic": "historical_causation",
    "skills": [
      "explain_historical_causation"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 7,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Begin with the reform and end with the global result.\n- Independence declarations came before the formal dissolution."
  },
  {
    "name": "Question 8",
    "question": "Why did Perestroika fail to revive the Soviet economy?",
    "metadata": [
      "It handed every factory to Western companies, so profits left the country",
      "It weakened central planning without a working market, causing shortages",
      "It was cancelled by the Communist Party before it took effect in 1985",
      "It caused rapid growth that the Soviet military could not control",
      ""
    ],
    "answer": [
      "It weakened central planning without a working market, causing shortages",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "end_of_cold_war_new_world_order",
    "topic": "glasnost_perestroika_soviet_collapse",
    "subtopic": "historical_causation",
    "skills": [
      "explain_historical_causation"
    ],
    "difficulty": 4,
    "exam_weight": 3,
    "xp": 10,
    "order": 8,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Perestroika was a partial reform of a planned economy.\n- Think about what happens when the old system stops working before a new one is ready."
  }
];

// ─── AI explanation (AMPM-CONTENT-AI-EXP) — one entry per REAL exam sub-question, against the memo ───

const aiExplanation = {
  sub_questions: [
  {
    "number": "6",
    "marks": 50,
    "clues": "- \"Critically discuss\" means weigh the statement: say how far you accept it, and why.\n- Plan evidence on the background, both reforms, opposition at home, nationalism and the final collapse.",
    "approach": "- State your critical stance and preview your evidence.\n- Explain the background weaknesses, then Perestroika and Glasnost and their effects.\n- Show how opposition and nationalism led to the break-up.\n- Conclude by tying the evidence back to your stance.",
    "solution": "1. Introduction: take a critical stance on whether Gorbachev's reforms of the mid-1980s led to the disintegration of the Soviet Union and the end of the Cold War in 1991.\n2. Background: the arms and space race with the USA and the war in Afghanistan weakened the Soviet economy.\n3. Gorbachev became General Secretary of the CPSU in 1985, aged 54, and aimed to revive the economy through better industrial output, technology and markets.\n4. Perestroika (economic restructuring, 1985) allowed small-scale private ownership and reduced state control of production.\n5. Glasnost (openness) allowed criticism of the government, of Perestroika and of Gorbachev himself.\n6. Hardliners opposed the reforms, while liberals said they were too slow; Gorbachev lost support at home and the unity of the USSR was at risk.\n7. The fall of the Berlin Wall (1989) signalled the collapse of communism in Eastern Europe.\n8. Old nationalisms revived among the 15 republics; Gorbachev's proposed Federation of States failed; in 1990 republics including Yeltsin's Russia declared independence.\n9. On 25 December 1991 the USSR was dissolved and the Communist Party disbanded; the republics formed the Commonwealth of Independent States.\n10. The break-up symbolised the end of the Cold War, with the USA the only superpower.\n11. Conclusion: tie the evidence back to your stance. Marks are awarded holistically on a seven-level matrix (content and presentation), out of 50."
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
