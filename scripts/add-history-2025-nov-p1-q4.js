#!/usr/bin/env node
/**
 * DBE History P1 — November 2025 — Question 4 (order 4)
 * The extension of the Cold War, case study Vietnam: Viet Cong tactics and strategies, 1962-1975 (essay).
 * Essay question: DESIGN-HIST-02 (no free-text input; content-knowledge items plus essay-strategy items).
 * Q4/Q5/Q6 share one exam page (question_image_urls points at q4/question_1.png).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 * Typed blanks: numeric only, keyboard_type 'standard_math' on every fitb (KEYBOARD-04, DESIGN-HIST-03).
 *   node tools/validate-questions.js --script scripts/add-history-2025-nov-p1-q4.js --curriculum temp/curriculum-vocab-history.json
 *   node scripts/add-history-2025-nov-p1-q4.js --dry-run
 *   node scripts/add-history-2025-nov-p1-q4.js
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
  "name": "Question 4",
  "syllabus": "dbe",
  "subject": "history",
  "year": 2025,
  "paper": "nov_p1",
  "order": 4,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "vietnam_war",
    "guerrilla_warfare",
    "viet_cong",
    "domino_theory",
    "essay_writing_skills"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2025/nov_p1/q4/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2025/nov_p1/q4/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2025/nov_p1/q4/memo_2.png"
  ],
  "exam_question_marks": 50,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Why did the US 'safe village' (hamlet) policy fail in South Vietnam?",
    "metadata": [
      "The Viet Cong were foreign soldiers who were easy to identify",
      "North Vietnam's air force bombed every hamlet",
      "The US Congress cancelled the policy before it began",
      "Villagers and the Viet Cong could not be separated, because the Viet Cong lived among the villagers",
      ""
    ],
    "answer": [
      "Villagers and the Viet Cong could not be separated, because the Viet Cong lived among the villagers",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "cold_war",
    "topic": "vietnam_war_viet_cong",
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
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- The policy aimed to cut the rebels off from the people.\n- Think about what 'peasants by day' implies for that aim."
  },
  {
    "name": "Question 2",
    "question": "Which of the following were methods used by the US forces in Vietnam?",
    "metadata": [
      "Operation Rolling Thunder: sustained bombing of North Vietnam",
      "Operation Ranch Hand: spraying defoliants such as Agent Orange",
      "Search and destroy operations against villages thought to shelter the Viet Cong",
      "The Ho Chi Minh Trail: a supply route to the south",
      "Networks of underground tunnels used for hiding and movement"
    ],
    "answer": [
      "Operation Rolling Thunder: sustained bombing of North Vietnam",
      "Operation Ranch Hand: spraying defoliants such as Agent Orange",
      "Search and destroy operations against villages thought to shelter the Viet Cong",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "interpretation",
    "unit": "cold_war",
    "topic": "vietnam_war_viet_cong",
    "subtopic": "key_figures_and_events",
    "skills": [
      "identify_historical_event_or_term"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Two options describe what the Viet Cong and North Vietnam did, not the US.\n- Ask who built or used each one."
  },
  {
    "name": "Question 3",
    "question": "Operation Rolling Thunder, the sustained US bombing campaign against North Vietnam, began in March [].",
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
    "unit": "cold_war",
    "topic": "vietnam_war_viet_cong",
    "subtopic": "key_figures_and_events",
    "skills": [
      "identify_historical_event_or_term"
    ],
    "difficulty": 1,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2025,
    "paper": "nov_p1",
    "keyboard_type": "standard_math",
    "clues": "- Johnson introduced it the same month as the first US combat troops arrived.\n- Write four digits only."
  },
  {
    "name": "Question 4",
    "question": "The Tet Offensive of 1968 is seen as a turning point, even though the Viet Cong suffered heavy losses. Why?",
    "metadata": [
      "It captured Saigon and ended the war",
      "It made the Soviet Union send combat troops to Vietnam",
      "It shocked US public opinion, which had been told the war was nearly won",
      "It proved the Domino Theory was wrong",
      ""
    ],
    "answer": [
      "It shocked US public opinion, which had been told the war was nearly won",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "cold_war",
    "topic": "vietnam_war_viet_cong",
    "subtopic": "historical_causation",
    "skills": [
      "explain_historical_causation"
    ],
    "difficulty": 4,
    "exam_weight": 3,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- A battle can be lost militarily and still change how people feel about a war.\n- Think about what the American public had been told before January 1968."
  },
  {
    "name": "Question 5",
    "question": "Arrange these events of the Vietnam War in the order in which they happened.",
    "metadata": [
      "The Paris Peace Accords are signed",
      "The US Congress passes the Gulf of Tonkin Resolution",
      "North Vietnamese forces take control of Saigon",
      "The Viet Cong and North Vietnam launch the Tet Offensive",
      "The first US marines and ground troops arrive in South Vietnam"
    ],
    "answer": [
      "The US Congress passes the Gulf of Tonkin Resolution",
      "The first US marines and ground troops arrive in South Vietnam",
      "The Viet Cong and North Vietnam launch the Tet Offensive",
      "The Paris Peace Accords are signed",
      "North Vietnamese forces take control of Saigon"
    ],
    "presentation": "ordering",
    "type": "interpretation",
    "unit": "cold_war",
    "topic": "vietnam_war_viet_cong",
    "subtopic": "historical_chronology",
    "skills": [
      "sequence_historical_events"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 5,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- The resolution gave the US president the power to escalate the war.\n- The agreement to end US involvement came before the final fall of Saigon."
  },
  {
    "name": "Question 6",
    "question": "Match each strategy or route in the Vietnam War to its purpose.",
    "metadata": [
      "A - Operation Ranch Hand",
      "B - The safe village (hamlet) strategy",
      "C - Vietnamisation",
      "D - The Ho Chi Minh Trail",
      "1 - To destroy forest cover and food crops that sheltered and fed the Viet Cong",
      "2 - To separate villagers from the Viet Cong",
      "3 - To hand the fighting to South Vietnamese forces while US troops withdrew",
      "4 - To carry supplies and fighters from North Vietnam to the Viet Cong in the south"
    ],
    "answer": [
      "A-1",
      "B-2",
      "C-3",
      "D-4"
    ],
    "presentation": "match",
    "type": "interpretation",
    "unit": "cold_war",
    "topic": "vietnam_war_viet_cong",
    "subtopic": "key_figures_and_events",
    "skills": [
      "identify_historical_event_or_term"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 6,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Two of these were US policies aimed at the Viet Cong, one was a US withdrawal policy, and one was a Communist supply route.\n- Match by what each was meant to achieve."
  },
  {
    "name": "Question 7",
    "question": "Essay prompt: 'The Viet Cong's military tactics proved successful in defeating the strong army of the USA. Do you agree?' Which introduction takes the clearest line of argument?",
    "metadata": [
      "I agree: guerrilla tactics, peasant support and adaptation to chemical warfare wore down the US army and led to its withdrawal in 1973",
      "The Vietnam War was fought between North and South Vietnam over many years and had many causes",
      "There are many different views about the Vietnam War, and historians may never agree",
      "The Viet Cong used tunnels and booby traps. The US used bombs and chemicals.",
      ""
    ],
    "answer": [
      "I agree: guerrilla tactics, peasant support and adaptation to chemical warfare wore down the US army and led to its withdrawal in 1973",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "cold_war",
    "topic": "vietnam_war_viet_cong",
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
    "clues": "- The prompt asks 'Do you agree?', so the introduction must say whether you do.\n- A strong introduction also previews the evidence it will use."
  },
  {
    "name": "Question 8",
    "question": "Arrange these sentences into a well-structured paragraph (Point, Evidence, Explanation, Link).",
    "metadata": [
      "Because the Viet Cong could not be separated from the villagers, US raids harmed civilians and increased support for the Viet Cong.",
      "This supports the view that their tactics were successful in wearing down US will to fight.",
      "The Viet Cong's guerrilla tactics reduced the advantage of the US army's firepower.",
      "They used tunnels, booby traps and hit-and-run attacks, and lived among villagers by day."
    ],
    "answer": [
      "The Viet Cong's guerrilla tactics reduced the advantage of the US army's firepower.",
      "They used tunnels, booby traps and hit-and-run attacks, and lived among villagers by day.",
      "Because the Viet Cong could not be separated from the villagers, US raids harmed civilians and increased support for the Viet Cong.",
      "This supports the view that their tactics were successful in wearing down US will to fight."
    ],
    "presentation": "ordering",
    "type": "application",
    "unit": "cold_war",
    "topic": "vietnam_war_viet_cong",
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
    "clues": "- A paragraph opens with its main claim and closes by tying back to the question.\n- Evidence comes before the explanation of why it matters."
  }
];

// ─── AI explanation (AMPM-CONTENT-AI-EXP) — one entry per REAL exam sub-question, against the memo ───

const aiExplanation = {
  sub_questions: [
  {
    "number": "4",
    "marks": 50,
    "clues": "- - Take a clear stance (agree or disagree) in your introduction.\n- - Organise evidence in themes: guerrilla tactics, US responses, turning points, withdrawal.",
    "approach": "- - State your line of argument and preview the themes you will use.\n- - Write one paragraph per theme (Point, Evidence, Explanation, Link).\n- - Use evidence across 1962–1975, not one moment.\n- - Conclude by tying the evidence back to your stance.",
    "solution": "1. Introduction: take a line of argument on whether Viet Cong tactics and strategies defeated the strong US army between 1962 and 1975, and preview the evidence.\n2. Background: the US intervened because of the Domino Theory; Vietnam was divided between a communist North and capitalist South; the Vietminh supported the Viet Cong along the Ho Chi Minh Trail; the US first sent weapons and advisers.\n3. The Viet Cong operated inside villages; the US safe village (hamlet) policy tried to separate villagers from them but failed because they were peasants by day and guerrillas by night.\n4. Guerrilla warfare: booby traps, hit-and-run attacks, sabotage and narrow underground tunnels; this won peasant support and frustrated a conventional army.\n5. Escalation: the Gulf of Tonkin incident and Resolution (1964) led to 3 500 marines landing on 8 March 1965; many US soldiers were young and inexperienced.\n6. Operation Ranch Hand (from 1962): Agent Orange destroyed forest cover and Agent Blue destroyed crops, but the Viet Cong adapted with better-hidden tunnels, moved into untouched jungle and stored rice underground; the chemicals also increased local sympathy for the Viet Cong. Napalm made the US unpopular worldwide.\n7. Operation Rolling Thunder (March 1965) used massive bombing to shorten the war, but guerrilla tactics made it ineffective and frustrated the US conventional army.\n8. The Tet Offensive (January 1968) surprised the US with attacks on cities across South Vietnam; although the Viet Cong suffered heavy losses, it was a psychological and political success.\n9. Search and destroy operations and atrocities such as My Lai (March 1968) turned US and world opinion against the war and increased support for the Viet Cong.\n10. Support from the Soviet Union and China, and a united, experienced Vietnamese population, strengthened the Vietminh and Viet Cong.\n11. Vietnamisation: Nixon's strategic withdrawal showed the US could not stop Vietnam becoming communist; US troops left by 1973 (Paris Peace Accords, 27 January 1973) and North Vietnam took Saigon in 1975, uniting Vietnam under communist control.\n12. Conclusion: tie the evidence back to your stance. Marks are awarded holistically on a seven-level matrix (content and presentation)."
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
