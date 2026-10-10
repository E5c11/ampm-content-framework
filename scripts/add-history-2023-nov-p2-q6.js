#!/usr/bin/env node
/**
 * DBE History P2 — November 2023 — Question 6 (order 6)
 * End of the Cold War (essay): to what extent did Gorbachev's reforms influence FW de Klerk to introduce the reforms that opened negotiations?
 * Essay question: DESIGN-HIST-02. Shares the Section B exam page uploaded under q4.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 * Typed blanks: numeric only, keyboard_type 'standard_math' on every fitb (KEYBOARD-04, DESIGN-HIST-03).
 *   node tools/validate-questions.js --script scripts/add-history-2023-nov-p2-q6.js --curriculum temp/curriculum-vocab-history-p2-2023.json
 *   node scripts/add-history-2023-nov-p2-q6.js --dry-run
 *   node scripts/add-history-2023-nov-p2-q6.js
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
  "year": 2023,
  "paper": "nov_p2",
  "order": 6,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "glasnost_perestroika",
    "mikhail_gorbachev",
    "fw_de_klerk",
    "negotiated_settlement"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2023/nov_p2/q4/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2023/nov_p2/q6/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2023/nov_p2/q6/memo_2.png"
  ],
  "exam_question_marks": 50
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "How did the collapse of Soviet communism weaken the National Party's \"total onslaught\" argument?",
    "metadata": [
      "The Soviet Union began to fund the National Party's own election campaigns",
      "The ANC announced it had cut all ties with communist parties in 1985",
      "Without a Soviet threat, the NP could no longer cast the ANC as a communist danger",
      "The USA lifted all its sanctions because South Africa had helped to defeat world communism",
      ""
    ],
    "answer": [
      "Without a Soviet threat, the NP could no longer cast the ANC as a communist danger",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "interpretation",
    "unit": "end_of_cold_war_new_world_order",
    "topic": "glasnost_perestroika_soviet_collapse",
    "subtopic": "historical_causation",
    "skills": [
      "explain_historical_causation"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2023,
    "paper": "nov_p2",
    "clues": "- \"Total onslaught\" claimed South Africa faced a Soviet-backed attack.\n- Ask what happens to that claim once Soviet communism is gone."
  },
  {
    "name": "Question 2",
    "question": "The Berlin Wall fell in November [], three months before De Klerk's speech of 2 February 1990.",
    "metadata": [
      "Year: ",
      "[ ]"
    ],
    "answer": [
      "1989",
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
    "order": 2,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2023,
    "paper": "nov_p2",
    "keyboard_type": "standard_math",
    "clues": "- Count back three months from February 1990.\n- Write four digits."
  },
  {
    "name": "Question 3",
    "question": "Match each event in southern Africa to how it helped prepare the way for negotiations.",
    "metadata": [
      "A - Battle of Cuito Cuanavale (1987-1988)",
      "B - Tripartite Accord (December 1988)",
      "C - Namibian independence (March 1990)",
      "D - De Klerk's speech (2 February 1990)",
      "1 - Showed that a peaceful handover to majority rule could happen on SA's border",
      "2 - Unbanned the ANC, PAC and SACP and opened the way to talks",
      "3 - A costly stalemate that pushed SA to negotiate over Angola and Namibia",
      "4 - Linked Cuban withdrawal from Angola to independence for Namibia"
    ],
    "answer": [
      "A-3",
      "B-4",
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
    "order": 3,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2023,
    "paper": "nov_p2",
    "clues": "- Put the four in time order first.\n- Namibia had been ruled by South Africa."
  },
  {
    "name": "Question 4",
    "question": "How did the end of Soviet support affect the ANC?",
    "metadata": [
      "Soviet money and weapons for the armed struggle dried up",
      "The ANC moved its headquarters from Lusaka to Moscow",
      "Moscow urged a negotiated settlement in South Africa",
      "The Soviet Union recognised the homelands as independent",
      "The ANC became more willing to negotiate with the NP"
    ],
    "answer": [
      "Soviet money and weapons for the armed struggle dried up",
      "Moscow urged a negotiated settlement in South Africa",
      "The ANC became more willing to negotiate with the NP",
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
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2023,
    "paper": "nov_p2",
    "clues": "- The bankrupt USSR could no longer afford foreign commitments.\n- No country except South Africa recognised the homelands."
  },
  {
    "name": "Question 5",
    "question": "Which point best supports the view that Gorbachev's reforms influenced De Klerk only to a LESSER extent?",
    "metadata": [
      "The fall of communism ended the NP's claim to be protecting SA from Moscow",
      "Sanctions, internal resistance and a weak economy were already forcing reform",
      "The West no longer needed SA as an anti-communist ally after 1989",
      "The USSR stopped supplying the ANC with the weapons and money it needed for its armed struggle",
      ""
    ],
    "answer": [
      "Sanctions, internal resistance and a weak economy were already forcing reform",
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
    "order": 5,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2023,
    "paper": "nov_p2",
    "clues": "- A \"lesser extent\" point shows other causes were at work.\n- Three options show the Soviet collapse mattering a great deal."
  },
  {
    "name": "Question 6",
    "question": "Why did the end of the Cold War change Western attitudes to the apartheid government?",
    "metadata": [
      "Western governments now wanted to buy South African weapons for the new wars in Eastern Europe",
      "The UN expelled the USA for its support of the apartheid government in 1989",
      "SA was no longer needed as an anti-communist ally, so the West pressed for reform",
      "Britain and the USA had cut all trade with South Africa in the early 1970s",
      ""
    ],
    "answer": [
      "SA was no longer needed as an anti-communist ally, so the West pressed for reform",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "interpretation",
    "unit": "end_of_cold_war_new_world_order",
    "topic": "glasnost_perestroika_soviet_collapse",
    "subtopic": "historical_causation",
    "skills": [
      "explain_historical_causation"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 6,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2023,
    "paper": "nov_p2",
    "clues": "- During the Cold War the West tolerated SA as a barrier against communism.\n- Ask what that barrier was worth once the threat had gone."
  },
  {
    "name": "Question 7",
    "question": "Essay prompt: \"To what extent did Gorbachev's reforms influence De Klerk to introduce political reforms?\" Which introduction is strongest?",
    "metadata": [
      "Gorbachev became Soviet leader in 1985 and introduced Glasnost and Perestroika",
      "De Klerk was a careful politician who was born in Johannesburg in 1936",
      "Some historians think Gorbachev mattered and others think he did not, so it is very hard to say which side is right",
      "To a large extent: the Soviet collapse removed the \"red threat\", though pressure at home also mattered",
      ""
    ],
    "answer": [
      "To a large extent: the Soviet collapse removed the \"red threat\", though pressure at home also mattered",
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
      "identify_a_strong_thesis_statement"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 7,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2023,
    "paper": "nov_p2",
    "clues": "- A \"to what extent\" question needs a stated extent.\n- A strong introduction also previews the evidence."
  },
  {
    "name": "Question 8",
    "question": "Arrange these steps into a logical explanation of how Gorbachev's reforms helped open negotiations in South Africa.",
    "metadata": [
      "Communist governments in Eastern Europe collapse and the Berlin Wall falls",
      "De Klerk unbans the ANC, PAC and SACP",
      "Gorbachev introduces Glasnost and Perestroika",
      "Multi-party negotiations begin at CODESA",
      "The NP can no longer present the ANC as a Soviet-backed threat"
    ],
    "answer": [
      "Gorbachev introduces Glasnost and Perestroika",
      "Communist governments in Eastern Europe collapse and the Berlin Wall falls",
      "The NP can no longer present the ANC as a Soviet-backed threat",
      "De Klerk unbans the ANC, PAC and SACP",
      "Multi-party negotiations begin at CODESA"
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
    "exam_weight": 2,
    "xp": 10,
    "order": 8,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2023,
    "paper": "nov_p2",
    "clues": "- Start in the Soviet Union in the mid-1980s.\n- End with the talks that began in December 1991."
  }
];

// ─── AI explanation (AMPM-CONTENT-AI-EXP) — one guidance entry for the essay (no numbered sub-parts), against the memo ───

const aiExplanation = {
  sub_questions: [
  {
    "number": "6",
    "marks": 50,
    "clues": "- Decide the extent: greater or lesser, and say so in the introduction.\n- Plan the Soviet factors and the South African factors separately.",
    "approach": "- State your extent and preview the evidence.\n- Explain Gorbachev's reforms and the end of communism, then trace their effect on the NP, the West and the ANC.\n- Weigh other factors (Cuito Cuanavale, Namibia, the economy, internal resistance).\n- Use PEEL paragraphs and conclude by tying back to your extent.",
    "solution": "1. Introduction: state to what extent Gorbachev's reforms influenced De Klerk to introduce the reforms that opened negotiations, and outline your evidence.\n2. Background: the Soviet economy was in crisis; Gorbachev took power in 1985 and introduced Perestroika (limited private enterprise) and Glasnost (openness).\n3. The reforms led to demands for democracy, the end of communism in Eastern Europe and the end of the Cold War; communism was no longer a global threat.\n4. The West no longer needed SA as an anti-communist ally and pressed the NP to negotiate or face continued sanctions; the NP could no longer justify apartheid as a defence against a communist onslaught.\n5. The USSR could no longer fund or arm the ANC and favoured negotiation, so the ANC also became willing to talk.\n6. Contributing factors: the costly stalemate at Cuito Cuanavale (1988), the agreements on Namibia and its peaceful independence (1990) as a blueprint; NP members saw that apartheid harmed white economic interests and could not last.\n7. De Klerk accepted that the black struggle was not directed from Moscow and, on 2 February 1990, unbanned all anti-apartheid organisations, opening the way to multi-party talks and the 1994 election.\n8. Conclusion: tie the evidence back to your extent. Marks are awarded holistically on a seven-level matrix (content and presentation), out of 50.\n9. Note: the marking guideline links \"constructive engagement\" to De Klerk and Reagan. It was the Reagan administration's policy towards PW Botha's government (1981–1989); Reagan had left office before De Klerk became president in 1989. It also says SWAPO won elections in 1990: Namibia voted in November 1989 and became independent in March 1990."
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
