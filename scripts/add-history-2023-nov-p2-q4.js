#!/usr/bin/env node
/**
 * DBE History P2 — November 2023 — Question 4 (order 4)
 * Civil Resistance (essay): did the Black Consciousness Movement believe black people should liberate themselves psychologically and be self-reliant in the 1970s?
 * Essay question: DESIGN-HIST-02.
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 * Typed blanks: numeric only, keyboard_type 'standard_math' on every fitb (KEYBOARD-04, DESIGN-HIST-03).
 *   node tools/validate-questions.js --script scripts/add-history-2023-nov-p2-q4.js --curriculum temp/curriculum-vocab-history-p2-2023.json
 *   node scripts/add-history-2023-nov-p2-q4.js --dry-run
 *   node scripts/add-history-2023-nov-p2-q4.js
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
  "paper": "nov_p2",
  "order": 4,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "black_consciousness_movement",
    "steve_biko",
    "black_community_programmes",
    "soweto_uprising"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2023/nov_p2/q4/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2023/nov_p2/q4/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2023/nov_p2/q4/memo_2.png"
  ],
  "exam_question_marks": 50
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "What did Black Consciousness mean by \"psychological liberation\"?",
    "metadata": [
      "Training activists to withstand torture and interrogation in detention",
      "Ending apartheid laws through quiet talks with the government",
      "Freeing black people from the sense of inferiority apartheid instilled",
      "Asking white liberals to lead the campaign to change public opinion",
      ""
    ],
    "answer": [
      "Freeing black people from the sense of inferiority apartheid instilled",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "civil_resistance_1970s_80s",
    "topic": "black_consciousness_movement",
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
    "year": 2023,
    "paper": "nov_p2",
    "clues": "- \"Psychological\" refers to the mind.\n- Biko said the oppressor's strongest weapon was the mind of the oppressed."
  },
  {
    "name": "Question 2",
    "question": "Whom did Black Consciousness include in the term \"black\"?",
    "metadata": [
      "Only Africans who had been forced to live in the homelands",
      "Only the members of SASO and the Black People's Convention",
      "Anyone who opposed apartheid, including white liberals",
      "African, Coloured and Indian people oppressed by apartheid",
      ""
    ],
    "answer": [
      "African, Coloured and Indian people oppressed by apartheid",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "civil_resistance_1970s_80s",
    "topic": "black_consciousness_movement",
    "subtopic": "historical_terminology",
    "skills": [
      "define_historical_term"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2023,
    "paper": "nov_p2",
    "clues": "- BC defined \"black\" by shared oppression, not by one racial group.\n- It deliberately excluded white liberals from leadership."
  },
  {
    "name": "Question 3",
    "question": "Match each Black Consciousness slogan, idea or name to its meaning.",
    "metadata": [
      "A - \"Black man, you are on your own\"",
      "B - Black Theology",
      "C - \"Frank Talk\"",
      "D - \"Black is beautiful\"",
      "1 - Reading Christianity through the experience of oppressed black people",
      "2 - Slogan rejecting white standards of worth and promoting black pride",
      "3 - Slogan saying black people must free themselves without white help",
      "4 - Pen name Biko used for his \"I Write What I Like\" columns"
    ],
    "answer": [
      "A-3",
      "B-1",
      "C-4",
      "D-2"
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
    "order": 3,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2023,
    "paper": "nov_p2",
    "clues": "- One is a pen name used in the SASO newsletter.\n- One links BC to the churches."
  },
  {
    "name": "Question 4",
    "question": "Steve Biko was elected the first president of SASO in [].",
    "metadata": [
      "Year: ",
      "[ ]"
    ],
    "answer": [
      "1969",
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
    "exam_weight": 1,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2023,
    "paper": "nov_p2",
    "keyboard_type": "standard_math",
    "clues": "- SASO broke away from NUSAS in 1968.\n- Its first conference, which elected Biko, was held the following year."
  },
  {
    "name": "Question 5",
    "question": "Which of these show Black Consciousness ideas spreading beyond the universities?",
    "metadata": [
      "SASM spread BC ideas among secondary school pupils",
      "NUSAS opened branches in township high schools",
      "Student teachers trained in SASO brought BC ideas into classrooms",
      "The Black Allied Workers Union organised workers along BC lines",
      "Bantu Education added Biko's writings to the school syllabus"
    ],
    "answer": [
      "SASM spread BC ideas among secondary school pupils",
      "Student teachers trained in SASO brought BC ideas into classrooms",
      "The Black Allied Workers Union organised workers along BC lines",
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
    "exam_weight": 2,
    "xp": 10,
    "order": 5,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2023,
    "paper": "nov_p2",
    "clues": "- Think about schools and workplaces.\n- The government banned BC writings; it did not teach them."
  },
  {
    "name": "Question 6",
    "question": "Essay prompt: \"BC believed black people should liberate themselves psychologically and be self-reliant. Do you agree?\" Which introduction is strongest?",
    "metadata": [
      "Steve Biko was born in 1946 in King William's Town and later studied medicine at Natal",
      "Some say BC was about the mind and others say it was about action, and both have a point",
      "Apartheid was a harsh system that hurt black people in many different ways in the 1970s",
      "I agree: BC rejected inferiority and built black-run projects to resist apartheid alone",
      ""
    ],
    "answer": [
      "I agree: BC rejected inferiority and built black-run projects to resist apartheid alone",
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
    "exam_weight": 2,
    "xp": 10,
    "order": 6,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2023,
    "paper": "nov_p2",
    "clues": "- A \"do you agree\" question needs a clear yes or no.\n- A strong introduction also previews the evidence."
  },
  {
    "name": "Question 7",
    "question": "Which point could a candidate use to qualify (limit) the claim that BC ideas alone sparked the 1976 Soweto uprising?",
    "metadata": [
      "SASM had spread BC ideas among school pupils in Soweto from 1972",
      "The Afrikaans Medium Decree gave pupils a direct, practical grievance",
      "Biko's writings encouraged pride and self-belief among young people",
      "SASO-trained student teachers had taught BC ideas in township classrooms",
      ""
    ],
    "answer": [
      "The Afrikaans Medium Decree gave pupils a direct, practical grievance",
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
    "year": 2023,
    "paper": "nov_p2",
    "clues": "- A qualifying point shows another cause was also at work.\n- Three options support the claim rather than limit it."
  },
  {
    "name": "Question 8",
    "question": "Arrange these sentences into one well-structured paragraph (Point, Evidence, Explanation, Link).",
    "metadata": [
      "By rejecting feelings of inferiority, black people gained the confidence to lead their own struggle.",
      "Black Consciousness taught that black people first had to free their own minds.",
      "This supports the view that BC saw psychological liberation as the basis of self-reliance.",
      "Biko argued that the most potent weapon of the oppressor was the mind of the oppressed."
    ],
    "answer": [
      "Black Consciousness taught that black people first had to free their own minds.",
      "Biko argued that the most potent weapon of the oppressor was the mind of the oppressed.",
      "By rejecting feelings of inferiority, black people gained the confidence to lead their own struggle.",
      "This supports the view that BC saw psychological liberation as the basis of self-reliance."
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
    "exam_weight": 2,
    "xp": 10,
    "order": 8,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2023,
    "paper": "nov_p2",
    "clues": "- Open with the main claim and close by linking back to the question.\n- The quotation is the evidence; the explanation says why it matters."
  }
];

// ─── AI explanation (AMPM-CONTENT-AI-EXP) — one guidance entry for the essay (no numbered sub-parts), against the memo ───

const aiExplanation = {
  sub_questions: [
  {
    "number": "4",
    "marks": 50,
    "clues": "- Decide whether you agree, and say so in the introduction.\n- Plan evidence for both psychological liberation and practical self-reliance.",
    "approach": "- State your stance and preview the evidence.\n- Cover the political vacuum, the ideas of BC, the organisations, the community programmes and the influence on students and workers.\n- Use PEEL paragraphs.\n- Conclude by tying the evidence back to your stance.",
    "solution": "1. Introduction: agree or disagree that BC believed black people should liberate themselves psychologically and be self-reliant, and outline your evidence.\n2. Background: a political vacuum followed the banning of the ANC and PAC and the imprisonment of their leaders in the 1960s.\n3. BC instilled pride and self-belief and rejected inferiority, self-pity and domination by outsiders.\n4. Black students broke from NUSAS to form SASO (1968), led by Biko; SASM (1972) carried BC into schools; the BPC (1972) drew in churches, communities and unions.\n5. SASO and the BPC held the Viva FRELIMO rallies (1974); arrests of BC leaders heightened activism.\n6. After Biko's banning to King William's Town, Black Community Programmes (Zanempilo clinic, Ginsberg Educational Trust, Zimele Trust Fund) showed self-reliance without white help.\n7. BC influenced the students of 1976: Afrikaans as a medium of instruction was rejected, SASM and SASO shaped the SSRC, and the protests of 16 June 1976 were met with police violence; many went into exile.\n8. BC influenced workers (BAWU, the 1973 Durban strikes) and sympathetic media such as The World.\n9. Conclusion: tie the evidence back to your stance. Marks are awarded holistically on a seven-level matrix (content and presentation), out of 50."
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
