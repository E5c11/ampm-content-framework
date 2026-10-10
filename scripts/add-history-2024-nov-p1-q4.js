#!/usr/bin/env node
/**
 * DBE History P1 — November 2024 — Question 4 (order 4)
 * The extension of the Cold War, case study Vietnam: why US technological superiority could not defeat the Viet Cong, 1962-1973 (essay).
 * Essay question: DESIGN-HIST-02 (no free-text input; content-knowledge items plus essay-strategy items).
 * Q4/Q5/Q6 share one exam page (question_image_urls points at q4/question_1.png).
 * Memo cautions applied: napalm is an incendiary (not a gas); Vietnamisation is Nixon's withdrawal policy, kept
 * distinct from WHAM; Tet is framed as a political turning point, not a territorial victory.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 * Typed blanks: numeric only, keyboard_type 'standard_math' on every fitb (KEYBOARD-04, DESIGN-HIST-03).
 *   node tools/validate-questions.js --script scripts/add-history-2024-nov-p1-q4.js --curriculum temp/curriculum-vocab-history-2024.json
 *   node scripts/add-history-2024-nov-p1-q4.js --dry-run
 *   node scripts/add-history-2024-nov-p1-q4.js
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
  "year": 2024,
  "paper": "nov_p1",
  "order": 4,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "vietnam_war",
    "viet_cong",
    "guerrilla_warfare",
    "us_technological_warfare",
    "essay_writing_skills"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2024/nov_p1/q4/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2024/nov_p1/q4/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2024/nov_p1/q4/memo_2.png"
  ],
  "exam_question_marks": 50,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "What was the purpose of Operation Ranch Hand (1962–1971)?",
    "metadata": [
      "To bomb roads, bridges and factories in North Vietnam from the air",
      "To move South Vietnamese villagers into fortified, guarded hamlets",
      "To spray chemical defoliants that stripped away jungle cover and crops",
      "To hand the fighting over to the South Vietnamese army as US troops left",
      ""
    ],
    "answer": [
      "To spray chemical defoliants that stripped away jungle cover and crops",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "interpretation",
    "unit": "cold_war",
    "topic": "vietnam_war_viet_cong",
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
    "paper": "nov_p1",
    "clues": "- Agent Orange and Agent Blue were used in this operation.\n- Think about what the Viet Cong used the jungle for."
  },
  {
    "name": "Question 2",
    "question": "Which of these were examples of the US army's technological superiority in Vietnam?",
    "metadata": [
      "B-52 bombers used in the Rolling Thunder bombing campaign",
      "Napalm, an incendiary weapon dropped from aircraft",
      "Helicopters that carried troops quickly into battle zones",
      "The Cu Chi network of narrow underground tunnels",
      "Booby traps made from sharpened bamboo stakes"
    ],
    "answer": [
      "B-52 bombers used in the Rolling Thunder bombing campaign",
      "Napalm, an incendiary weapon dropped from aircraft",
      "Helicopters that carried troops quickly into battle zones",
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
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Ask which side used each weapon or method.\n- Technology here means expensive, industrial weapons and machines."
  },
  {
    "name": "Question 3",
    "question": "On 8 March 1965, [] US marines landed at Da Nang, the first American ground combat troops in Vietnam.",
    "metadata": [
      "Marines: ",
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
    "unit": "cold_war",
    "topic": "vietnam_war_viet_cong",
    "subtopic": "key_figures_and_events",
    "skills": [
      "identify_historical_event_or_term"
    ],
    "difficulty": 3,
    "exam_weight": 1,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2024,
    "paper": "nov_p1",
    "keyboard_type": "standard_math",
    "clues": "- This landing followed the Gulf of Tonkin Resolution of 1964.\n- Write the number without spaces."
  },
  {
    "name": "Question 4",
    "question": "How did the Viet Cong's tunnel networks weaken the advantage of US technology?",
    "metadata": [
      "They let the Viet Cong move heavy tanks and artillery across South Vietnam unseen",
      "They sheltered fighters from bombing and were too narrow for most US soldiers",
      "They carried fuel for the Viet Cong's own fleet of jet fighter aircraft",
      "They gave US commanders an easy way to find, surround and trap whole Viet Cong units",
      ""
    ],
    "answer": [
      "They sheltered fighters from bombing and were too narrow for most US soldiers",
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
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Think about what US aircraft could and could not reach.\n- Think about the size of the tunnels compared with the soldiers sent into them."
  },
  {
    "name": "Question 5",
    "question": "Match each Viet Cong method to how it cancelled out US technological superiority.",
    "metadata": [
      "A - Hit-and-run ambushes",
      "B - Booby traps on jungle paths",
      "C - The Ho Chi Minh Trail",
      "D - Living among the villagers",
      "1 - Supplies kept reaching the South despite constant US bombing",
      "2 - Fighters struck and vanished before US air support could arrive",
      "3 - US troops could not tell guerrillas apart from civilians",
      "4 - US patrols suffered casualties without any battle being fought"
    ],
    "answer": [
      "A-2",
      "B-4",
      "C-1",
      "D-3"
    ],
    "presentation": "match",
    "type": "application",
    "unit": "cold_war",
    "topic": "vietnam_war_viet_cong",
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
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- For each method, ask which US advantage it made useless.\n- One method is a supply route, not a way of fighting."
  },
  {
    "name": "Question 6",
    "question": "Arrange these events of the Vietnam War in the order in which they happened.",
    "metadata": [
      "The Tet Offensive surprises US forces across South Vietnam",
      "The Paris Peace Accords end US involvement in the war",
      "The Strategic Hamlet programme begins in South Vietnam",
      "Operation Rolling Thunder begins",
      "The Gulf of Tonkin Resolution is passed by Congress"
    ],
    "answer": [
      "The Strategic Hamlet programme begins in South Vietnam",
      "The Gulf of Tonkin Resolution is passed by Congress",
      "Operation Rolling Thunder begins",
      "The Tet Offensive surprises US forces across South Vietnam",
      "The Paris Peace Accords end US involvement in the war"
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
    "order": 6,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- The essay covers 1962 to 1973: one event is at each end.\n- Escalation came before the turning point of 1968."
  },
  {
    "name": "Question 7",
    "question": "Essay prompt: 'To what extent could the technological superiority of the US army not help to defeat the Viet Cong?' Which introduction takes the clearest line of argument?",
    "metadata": [
      "The Vietnam War lasted from the 1950s until 1975. The USA sent many thousands of soldiers, and the Viet Cong used guerrilla tactics in the jungle.",
      "Some historians think US technology failed in Vietnam and others think it worked well, so it is very hard to decide either way.",
      "To a large extent, US technology could not defeat the Viet Cong, because guerrilla tactics, peasant support and anti-war pressure outweighed it.",
      "The USA was a superpower with the most modern army in the world, so it should easily have won any war it fought against a small guerrilla army.",
      ""
    ],
    "answer": [
      "To a large extent, US technology could not defeat the Viet Cong, because guerrilla tactics, peasant support and anti-war pressure outweighed it.",
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
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- 'To what extent' needs a stance that measures how far you agree.\n- A strong introduction also previews the evidence you will use."
  },
  {
    "name": "Question 8",
    "question": "Arrange these sentences into a well-structured paragraph (Point, Evidence, Explanation, Link).",
    "metadata": [
      "Operation Rolling Thunder dropped huge tonnages of bombs from 1965, yet the Ho Chi Minh Trail kept operating.",
      "This shows that superior air power could not defeat an enemy that adapted to it.",
      "US bombing could not stop the flow of men and supplies from North Vietnam.",
      "Because the Trail ran under thick jungle and was quickly repaired, bombing slowed supplies but never stopped them."
    ],
    "answer": [
      "US bombing could not stop the flow of men and supplies from North Vietnam.",
      "Operation Rolling Thunder dropped huge tonnages of bombs from 1965, yet the Ho Chi Minh Trail kept operating.",
      "Because the Trail ran under thick jungle and was quickly repaired, bombing slowed supplies but never stopped them.",
      "This shows that superior air power could not defeat an enemy that adapted to it."
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
    "number": "4",
    "marks": 50,
    "clues": "- Take a stance on how far US technology failed, not just whether it did.\n- Organise evidence by theme: US methods, Viet Cong responses, turning points, withdrawal.",
    "approach": "- State your line of argument and preview your themes.\n- Write one paragraph per theme (Point, Evidence, Explanation, Link).\n- Use evidence from 1962 to 1973, not one moment.\n- Conclude by tying the evidence back to your stance.",
    "solution": "1. Introduction: state to what extent US technological superiority could not defeat the Viet Cong between 1962 and 1973, and preview the evidence.\n2. Background: Vietnam was divided; the US first sent weapons and advisers; the Ho Chi Minh Trail supplied the Viet Cong from the North.\n3. The Strategic Hamlet policy (1962) tried to separate villagers from guerrillas but failed because the Viet Cong lived among the villagers.\n4. Escalation: the Gulf of Tonkin Resolution (1964) led to 3 500 marines landing on 8 March 1965; many US soldiers were young and inexperienced.\n5. Operation Ranch Hand (1962–1971) sprayed Agent Orange and Agent Blue to destroy forest cover and crops; napalm, an incendiary, made the US unpopular worldwide.\n6. Operation Rolling Thunder (from March 1965) bombed the North heavily but could not stop supplies or break the guerrillas.\n7. Viet Cong guerrilla tactics (booby traps, hit-and-run, sabotage, narrow tunnels) cancelled out US firepower and won peasant support.\n8. Search and destroy operations and atrocities such as My Lai (March 1968) increased support for the Viet Cong and turned opinion against the US.\n9. The Tet Offensive (January 1968) was a military setback for the Viet Cong but a political and psychological turning point that fuelled US anti-war protest.\n10. The Soviet Union and China supplied North Vietnam, and the Vietnamese were united in defending their country.\n11. Vietnamisation: Nixon withdrew US troops and handed the fighting to the South Vietnamese army; the Paris Peace Accords (27 January 1973) ended US involvement, and Saigon fell in 1975.\n12. Conclusion: tie the evidence back to your stance. Marks are awarded holistically on a seven-level matrix (content and presentation)."
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
