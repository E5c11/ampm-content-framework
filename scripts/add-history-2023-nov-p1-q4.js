#!/usr/bin/env node
/**
 * DBE History P1 — November 2023 — Question 4 (order 4)
 * Extension of the Cold War, Vietnam: 'Vietcong tactics made USA strategies ineffective, 1963-1975' — critically discuss.
 * Essay question: DESIGN-HIST-02 (no free-text essay; content-knowledge and essay-strategy items).
 * Q4/Q5/Q6 share one exam page (question_image_urls points at q4/question_1.png).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 * Typed blanks: numeric only, keyboard_type 'standard_math' on every fitb (KEYBOARD-04, DESIGN-HIST-03).
 *   node tools/validate-questions.js --script scripts/add-history-2023-nov-p1-q4.js --curriculum temp/curriculum-vocab-history-2023.json
 *   node scripts/add-history-2023-nov-p1-q4.js --dry-run
 *   node scripts/add-history-2023-nov-p1-q4.js
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
  "year": 2023,
  "paper": "nov_p1",
  "order": 4,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "vietnam_war",
    "viet_cong",
    "guerrilla_warfare",
    "essay_writing_skills"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2023/nov_p1/q4/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2023/nov_p1/q4/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2023/nov_p1/q4/memo_2.png"
  ],
  "exam_question_marks": 50,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "What did the Gulf of Tonkin Resolution, passed by the US Congress in August 1964, allow President Johnson to do?",
    "metadata": [
      "Withdraw all US troops and hand the fighting over to the South Vietnamese army",
      "Divide Vietnam into North and South along the 17th parallel until elections were held",
      "Ban the use of chemical weapons such as Agent Orange on Vietnamese farmland",
      "Use military force in Vietnam without first asking Congress to declare war",
      ""
    ],
    "answer": [
      "Use military force in Vietnam without first asking Congress to declare war",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
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
    "year": 2023,
    "paper": "nov_p1",
    "clues": "- The resolution followed a reported clash between US and North Vietnamese ships.\n- Johnson used it as the legal basis for escalating the war."
  },
  {
    "name": "Question 2",
    "question": "What was the US 'Search and Destroy' strategy in Vietnam?",
    "metadata": [
      "Heavy bombing of factories, roads and cities in North Vietnam from the air",
      "Moving South Vietnamese villagers into fortified hamlets guarded by soldiers",
      "Ground patrols that hunted the Viet Cong and burned villages suspected of helping them",
      "Spraying chemical defoliants from aircraft to strip away the jungle cover and destroy crops",
      ""
    ],
    "answer": [
      "Ground patrols that hunted the Viet Cong and burned villages suspected of helping them",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
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
    "year": 2023,
    "paper": "nov_p1",
    "clues": "- The name describes what troops on the ground were sent to do.\n- The other options describe Rolling Thunder, Strategic Hamlets and Ranch Hand."
  },
  {
    "name": "Question 3",
    "question": "Why did the My Lai massacre of March 1968 damage the US war effort?",
    "metadata": [
      "It destroyed the main Viet Cong supply route and forced North Vietnam to sue for peace",
      "News of US soldiers killing unarmed villagers turned public opinion against the war",
      "It led the Soviet Union and China to stop sending weapons and supplies to North Vietnam",
      "It caused the South Vietnamese government to ask the USA to send more combat troops",
      ""
    ],
    "answer": [
      "News of US soldiers killing unarmed villagers turned public opinion against the war",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "interpretation",
    "unit": "cold_war",
    "topic": "vietnam_war_viet_cong",
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
    "paper": "nov_p1",
    "clues": "- My Lai was a village; the victims were civilians.\n- Think about the effect when the story reached the American public in 1969."
  },
  {
    "name": "Question 4",
    "question": "The Paris Peace Accords, which ended direct US involvement in the Vietnam War, were signed in January [].",
    "metadata": [
      "Year: ",
      "[ ]"
    ],
    "answer": [
      "1973",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "definition",
    "unit": "cold_war",
    "topic": "vietnam_war_viet_cong",
    "subtopic": "key_figures_and_events",
    "skills": [
      "identify_historical_event_or_term"
    ],
    "difficulty": 1,
    "exam_weight": 1,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2023,
    "paper": "nov_p1",
    "keyboard_type": "standard_math",
    "clues": "- US combat troops left Vietnam soon after the accords were signed.\n- Saigon fell two years later, in 1975."
  },
  {
    "name": "Question 5",
    "question": "Match each US president to his role in the Vietnam War.",
    "metadata": [
      "A - Dwight Eisenhower",
      "B - John F Kennedy",
      "C - Lyndon B Johnson",
      "D - Richard Nixon",
      "1 - Introduced Vietnamisation and withdrew US troops",
      "2 - Sent large numbers of military advisers to South Vietnam",
      "3 - Backed South Vietnam's new government after the 1954 division",
      "4 - Escalated the war after the Gulf of Tonkin incident"
    ],
    "answer": [
      "A-3",
      "B-2",
      "C-4",
      "D-1"
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
    "exam_weight": 2,
    "xp": 10,
    "order": 5,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2023,
    "paper": "nov_p1",
    "clues": "- Put the four presidents in order first: their roles follow the stages of the war.\n- Escalation came before withdrawal."
  },
  {
    "name": "Question 6",
    "question": "The essay asks you to critically discuss whether Viet Cong tactics made US strategies ineffective. Which points could you use to show the other side of the argument?",
    "metadata": [
      "The Viet Cong suffered very heavy military losses in the Tet Offensive of 1968",
      "Booby traps and tunnels let small Viet Cong units avoid US firepower",
      "North Vietnam depended on weapons and supplies from the Soviet Union and China",
      "The Strategic Hamlet policy failed because the Viet Cong lived among the villagers",
      "Opposition to the war at home in the USA pushed American leaders towards withdrawal"
    ],
    "answer": [
      "The Viet Cong suffered very heavy military losses in the Tet Offensive of 1968",
      "North Vietnam depended on weapons and supplies from the Soviet Union and China",
      "Opposition to the war at home in the USA pushed American leaders towards withdrawal",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "cold_war",
    "topic": "vietnam_war_viet_cong",
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
    "year": 2023,
    "paper": "nov_p1",
    "clues": "- A counter-argument limits the claim that Viet Cong tactics alone made US strategies fail.\n- Two of the options support the statement rather than qualify it."
  },
  {
    "name": "Question 7",
    "question": "Essay prompt: 'The tactics used by the Vietcong were successful in making USA strategies ineffective between 1963 and 1975. Critically discuss.' Which introduction best answers it?",
    "metadata": [
      "The Vietnam War was fought between 1963 and 1975. The USA used many strategies and the Vietcong used many tactics, and this essay will describe each of them.",
      "The USA was the strongest military power in the world, so its strategies were bound to defeat a small guerrilla army like the Vietcong in the end.",
      "Vietcong guerrilla tactics largely made US strategies ineffective, although US firepower inflicted heavy losses and pressure at home also forced withdrawal.",
      "It is impossible to say whether the Vietcong or the USA was more successful in the Vietnam War, because historians have argued about it for a very long time.",
      ""
    ],
    "answer": [
      "Vietcong guerrilla tactics largely made US strategies ineffective, although US firepower inflicted heavy losses and pressure at home also forced withdrawal.",
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
    "year": 2023,
    "paper": "nov_p1",
    "clues": "- 'Critically discuss' needs a clear stance that also weighs the evidence against it.\n- A description of the war, or a refusal to decide, is not a line of argument."
  },
  {
    "name": "Question 8",
    "question": "Arrange these sentences into a well-structured paragraph (Point, Evidence, Explanation, Link).",
    "metadata": [
      "Because the Viet Cong lived among the peasants, every village destroyed turned more people against the USA.",
      "This shows how guerrilla tactics turned a US strategy into a source of support for the enemy.",
      "Search and Destroy missions often strengthened the Viet Cong instead of weakening it.",
      "US patrols burned villages they suspected of hiding guerrillas, killing many civilians."
    ],
    "answer": [
      "Search and Destroy missions often strengthened the Viet Cong instead of weakening it.",
      "US patrols burned villages they suspected of hiding guerrillas, killing many civilians.",
      "Because the Viet Cong lived among the peasants, every village destroyed turned more people against the USA.",
      "This shows how guerrilla tactics turned a US strategy into a source of support for the enemy."
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
    "year": 2023,
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
    "clues": "- 'Critically discuss' asks you to take a stance and weigh evidence for and against it.\n- Cover 1963 to 1975: US strategies, Viet Cong responses, turning points and withdrawal.",
    "approach": "- State your line of argument and preview your themes.\n- Write one paragraph per US strategy, showing how Viet Cong tactics answered it (Point, Evidence, Explanation, Link).\n- Include evidence that qualifies the statement, then show why your stance still holds.\n- Conclude by tying the evidence back to your stance.",
    "solution": "1. Introduction: take a stance on whether Viet Cong tactics made US strategies ineffective between 1963 and 1975, and preview the evidence.\n2. Background: Vietnam was divided; the USA sent weapons and advisers; the Ho Chi Minh Trail supplied the Viet Cong from the North.\n3. The Strategic Hamlet (safe village) policy failed because the Viet Cong operated inside the villages.\n4. Escalation: the Gulf of Tonkin Resolution (1964) led to 3 500 marines landing on 8 March 1965; many US soldiers were young and inexperienced.\n5. Operation Rolling Thunder (from March 1965) relied on conventional bombing, which could not defeat guerrilla warfare or cut the Trail.\n6. Operation Ranch Hand sprayed Agent Orange and Agent Blue; napalm, an incendiary, made the USA unpopular around the world.\n7. Viet Cong tactics (booby traps, hit-and-run, sabotage, narrow tunnels) made it hard to separate guerrillas from peasants.\n8. Search and Destroy and atrocities such as My Lai (March 1968) increased support for the Viet Cong and turned opinion against the war.\n9. The Tet Offensive (1968) was a military setback for the Viet Cong but a political turning point that fuelled US anti-war protest.\n10. The Soviet Union and China supplied North Vietnam, and the Vietnamese were united in defending their country.\n11. Vietnamisation: Nixon withdrew US troops and handed the war to the South Vietnamese army; the Paris Peace Accords (27 January 1973) ended US involvement, and Saigon fell in 1975.\n12. Conclusion: tie the evidence back to your stance. Marks are awarded holistically on a seven-level matrix (content and presentation)."
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
