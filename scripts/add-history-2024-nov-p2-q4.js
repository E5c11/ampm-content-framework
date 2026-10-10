#!/usr/bin/env node
/**
 * DBE History P2 — November 2024 — Question 4 (order 4)
 * Civil Resistance, 1970s to 1980s (essay): to what extent did Steve Biko and Black Consciousness inspire black self-empowerment in the 1960s and 1970s?
 * Essay question: DESIGN-HIST-02 (content-knowledge + essay-strategy items; no free-text essay).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 * Typed blanks: numeric only, keyboard_type 'standard_math' on every fitb (KEYBOARD-04, DESIGN-HIST-03).
 *   node tools/validate-questions.js --script scripts/add-history-2024-nov-p2-q4.js --curriculum temp/curriculum-vocab-history-p2-2024.json
 *   node scripts/add-history-2024-nov-p2-q4.js --dry-run
 *   node scripts/add-history-2024-nov-p2-q4.js
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
  "paper": "nov_p2",
  "order": 4,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "steve_biko",
    "black_consciousness_movement",
    "black_community_programmes",
    "soweto_uprising"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2024/nov_p2/q4/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2024/nov_p2/q4/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2024/nov_p2/q4/memo_2.png"
  ],
  "exam_question_marks": 50,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "After Steve Biko was banned and confined to King William's Town in 1973, where did he direct much of his work?",
    "metadata": [
      "Training Umkhonto we Sizwe units in camps across the border in Lesotho",
      "Black Community Programmes such as the Zanempilo community health clinic",
      "Representing black students at meetings of the white-led NUSAS",
      "Leading the 1976 student marches in Soweto in person",
      ""
    ],
    "answer": [
      "Black Community Programmes such as the Zanempilo community health clinic",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "interpretation",
    "unit": "civil_resistance_1970s_80s",
    "topic": "black_consciousness_movement",
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
    "clues": "- A banning order stopped Biko from travelling and from political meetings.\n- Black Consciousness stressed self-reliance in black communities."
  },
  {
    "name": "Question 2",
    "question": "Match each Black Consciousness organisation or project to its description.",
    "metadata": [
      "A - Black People's Convention (BPC)",
      "B - South African Students Movement (SASM)",
      "C - Black Allied Workers Union (BAWU)",
      "D - Zanempilo",
      "1 - Trade union aligned to Black Consciousness",
      "2 - Political body formed in 1972 uniting students, churches and communities",
      "3 - Community health clinic run without white assistance",
      "4 - Movement that spread Black Consciousness among school pupils"
    ],
    "answer": [
      "A-2",
      "B-4",
      "C-1",
      "D-3"
    ],
    "presentation": "match",
    "type": "interpretation",
    "unit": "civil_resistance_1970s_80s",
    "topic": "black_consciousness_movement",
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
    "paper": "nov_p2",
    "clues": "- Look for a clue in each name: students, workers, people.\n- One is a project, not an organisation."
  },
  {
    "name": "Question 3",
    "question": "SASO and the BPC organised the pro-FRELIMO (\"Viva FRELIMO\") rallies in the year [].",
    "metadata": [
      "Year: ",
      "[ ]"
    ],
    "answer": [
      "1974",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "interpretation",
    "unit": "civil_resistance_1970s_80s",
    "topic": "black_consciousness_movement",
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
    "clues": "- The rallies celebrated FRELIMO coming to power in Mozambique after Portugal's coup.\n- Write four digits."
  },
  {
    "name": "Question 4",
    "question": "Which of these actions show Black Consciousness promoting black self-reliance?",
    "metadata": [
      "Setting up health clinics and trust funds run by black communities",
      "Relying on white liberals to lead the struggle against apartheid",
      "Black students leaving NUSAS to form their own organisation",
      "Joining homeland governments to win reforms from the state",
      "Using sympathetic newspapers to spread pride and self-belief"
    ],
    "answer": [
      "Setting up health clinics and trust funds run by black communities",
      "Black students leaving NUSAS to form their own organisation",
      "Using sympathetic newspapers to spread pride and self-belief",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "civil_resistance_1970s_80s",
    "topic": "black_consciousness_movement",
    "subtopic": "historical_causation",
    "skills": [
      "explain_historical_causation"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Self-reliance means black people acting for themselves, without white leadership.\n- Biko rejected working through apartheid structures."
  },
  {
    "name": "Question 5",
    "question": "Arrange these events in the order they happened.",
    "metadata": [
      "Students in Soweto march against Afrikaans as a medium of instruction",
      "The government bans Black Consciousness organisations",
      "Black workers launch mass strikes in Durban",
      "Steve Biko dies in police detention",
      "SASO and the BPC hold the Viva FRELIMO rallies"
    ],
    "answer": [
      "Black workers launch mass strikes in Durban",
      "SASO and the BPC hold the Viva FRELIMO rallies",
      "Students in Soweto march against Afrikaans as a medium of instruction",
      "Steve Biko dies in police detention",
      "The government bans Black Consciousness organisations"
    ],
    "presentation": "ordering",
    "type": "interpretation",
    "unit": "civil_resistance_1970s_80s",
    "topic": "black_consciousness_movement",
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
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- The strikes came the year Biko was banned.\n- The bannings followed Biko's death a month later."
  },
  {
    "name": "Question 6",
    "question": "Essay prompt: \"Explain to what extent Steve Biko and Black Consciousness inspired black people to empower themselves.\" Which introduction takes the clearest stance?",
    "metadata": [
      "Some people say Black Consciousness inspired black people and others say it did not, so both views have value",
      "Steve Biko was born in 1946, studied medicine at the University of Natal and helped to found SASO with other students in 1968",
      "To a great extent: Black Consciousness restored pride and inspired SASO, the BPC, self-help projects and 1976",
      "Apartheid was a cruel system and black people suffered greatly under it during the 1960s and 1970s",
      ""
    ],
    "answer": [
      "To a great extent: Black Consciousness restored pride and inspired SASO, the BPC, self-help projects and 1976",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "civil_resistance_1970s_80s",
    "topic": "black_consciousness_movement",
    "subtopic": "essay_argumentation",
    "skills": [
      "identify_a_strong_thesis_statement"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 6,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- A \"to what extent\" question needs a stated extent.\n- A strong introduction also previews the evidence."
  },
  {
    "name": "Question 7",
    "question": "Which point would best qualify (limit) the claim that Black Consciousness alone inspired resistance in the 1970s?",
    "metadata": [
      "SASO was formed in 1968 after black students broke away from NUSAS",
      "Biko's death in detention in 1977 made him a symbol of resistance",
      "Black Consciousness encouraged pride and self-belief among the youth",
      "The 1973 strikes also had economic causes, such as low wages and inflation",
      ""
    ],
    "answer": [
      "The 1973 strikes also had economic causes, such as low wages and inflation",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "civil_resistance_1970s_80s",
    "topic": "black_consciousness_movement",
    "subtopic": "essay_argumentation",
    "skills": [
      "evaluate_a_counter_argument"
    ],
    "difficulty": 4,
    "exam_weight": 3,
    "xp": 10,
    "order": 7,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- A qualifying point shows another cause was also at work.\n- Three options support the claim rather than limit it."
  },
  {
    "name": "Question 8",
    "question": "Arrange these sentences into one well-structured paragraph (Point, Evidence, Explanation, Link).",
    "metadata": [
      "These projects showed that black people could build and run their own institutions.",
      "Black Consciousness empowered black communities to meet their own needs without white help.",
      "This shows that Black Consciousness inspired practical self-empowerment, not just ideas.",
      "After his banning, Biko helped run Black Community Programmes such as the Zanempilo clinic."
    ],
    "answer": [
      "Black Consciousness empowered black communities to meet their own needs without white help.",
      "After his banning, Biko helped run Black Community Programmes such as the Zanempilo clinic.",
      "These projects showed that black people could build and run their own institutions.",
      "This shows that Black Consciousness inspired practical self-empowerment, not just ideas."
    ],
    "presentation": "ordering",
    "type": "application",
    "unit": "civil_resistance_1970s_80s",
    "topic": "black_consciousness_movement",
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
    "clues": "- Open with the main claim and close by linking back to the question.\n- The example comes before the explanation of why it matters."
  }
];

// ─── AI explanation (AMPM-CONTENT-AI-EXP) — one entry per REAL exam sub-question, against the memo ───

const aiExplanation = {
  sub_questions: [
  {
    "number": "4",
    "marks": 50,
    "clues": "- Take a stance on the extent of Biko's and Black Consciousness's influence in your introduction.\n- Organise evidence by theme: philosophy, organisations, students, community programmes, workers, media.",
    "approach": "- State your line of argument and preview the themes you will use.\n- Write one paragraph per theme (Point, Evidence, Explanation, Link).\n- Use evidence across the 1960s and 1970s.\n- Conclude by tying the evidence back to your stance.",
    "solution": "1. Introduction: state to what extent Biko and Black Consciousness inspired black South Africans to empower themselves, and preview your evidence.\n2. Background: the banning of the ANC and PAC and the imprisonment of their leaders left a political vacuum in the 1960s.\n3. Philosophy: Black Consciousness instilled pride, self-belief and identity, and rejected inferiority, self-pity and white domination (for example, skin-lightening products).\n4. Organisations: black students broke from NUSAS to form SASO (1968); the BPC (1972) united students, churches, communities and unions; SASM spread the ideas in schools; BAWU and the Black Parents' Association were aligned; SASO and the BPC held the Viva FRELIMO rallies (1974); arrests of leaders heightened activism.\n5. Soweto uprising: Afrikaans was imposed as a medium of instruction; SASO and SASM influenced the SSRC; on 16 June 1976 students marched; police killed Hector Pieterson among others; many students went into exile.\n6. Community programmes: after Biko's banishment to King William's Town, Black Community Programmes (Zanempilo clinic, Ginsberg Educational Trust, Zimele Trust Fund) promoted self-reliance.\n7. Workers: Black Consciousness inspired BAWU and the 1973 Durban strikes.\n8. Media: sympathetic publications such as The World spread Black Consciousness ideas.\n9. Conclusion: tie the evidence back to your stance. Marks are awarded holistically on a seven-level matrix (content and presentation), out of 50."
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
