#!/usr/bin/env node
/**
 * DBE History P1 — November 2024 — Question 6 (order 6)
 * Civil society protests, the Black Power Movement: was its approach militant? (critically discuss) (essay).
 * Essay question: DESIGN-HIST-02 (no free-text input; content-knowledge items plus essay-strategy items).
 * Q4/Q5/Q6 share one exam page (question_image_urls points at q4/question_1.png).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 * Typed blanks: numeric only, keyboard_type 'standard_math' on every fitb (KEYBOARD-04, DESIGN-HIST-03).
 *   node tools/validate-questions.js --script scripts/add-history-2024-nov-p1-q6.js --curriculum temp/curriculum-vocab-history-2024.json
 *   node scripts/add-history-2024-nov-p1-q6.js --dry-run
 *   node scripts/add-history-2024-nov-p1-q6.js
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
  "paper": "nov_p1",
  "order": 6,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "black_power",
    "black_panther_party",
    "malcolm_x",
    "stokely_carmichael",
    "essay_writing_skills"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2024/nov_p1/q4/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2024/nov_p1/q6/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2024/nov_p1/q6/memo_2.png"
  ],
  "exam_question_marks": 50,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Who founded the Black Panther Party for Self-Defense in Oakland, California?",
    "metadata": [
      "Malcolm X and Elijah Muhammad",
      "Stokely Carmichael and Martin Luther King Jr",
      "John Lewis and Bayard Rustin",
      "Huey Newton and Bobby Seale",
      ""
    ],
    "answer": [
      "Huey Newton and Bobby Seale",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "interpretation",
    "unit": "civil_society_protests_1950s_70s",
    "topic": "black_power_movement",
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
    "clues": "- The party was founded by two students at a college in Oakland.\n- The other pairs belong to the Nation of Islam or to the non-violent movement."
  },
  {
    "name": "Question 2",
    "question": "Which Black Panther Party activities were about self-empowerment rather than militancy?",
    "metadata": [
      "Free breakfast programmes for children in poor neighbourhoods",
      "Community health clinics that offered free medical care",
      "Literacy classes and demands for Black history in schools",
      "Armed patrols that followed and monitored the police",
      "Carrying loaded weapons openly at the California state capitol"
    ],
    "answer": [
      "Free breakfast programmes for children in poor neighbourhoods",
      "Community health clinics that offered free medical care",
      "Literacy classes and demands for Black history in schools",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "civil_society_protests_1950s_70s",
    "topic": "black_power_movement",
    "subtopic": "essay_argumentation",
    "skills": [
      "classify_policy_outcomes"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Self-empowerment means communities helping themselves.\n- Militant activities involve weapons or confrontation."
  },
  {
    "name": "Question 3",
    "question": "Match each figure to their part in the Black Power Movement.",
    "metadata": [
      "A - Malcolm X",
      "B - Stokely Carmichael",
      "C - Huey Newton",
      "D - Tommie Smith and John Carlos",
      "1 - Raised gloved fists at the 1968 Olympic Games",
      "2 - Popularised the slogan 'Black Power' in 1966",
      "3 - Co-founded the Black Panther Party",
      "4 - Called for armed self-defence 'by any means necessary'"
    ],
    "answer": [
      "A-4",
      "B-2",
      "C-3",
      "D-1"
    ],
    "presentation": "match",
    "type": "interpretation",
    "unit": "civil_society_protests_1950s_70s",
    "topic": "black_power_movement",
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
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- One pair were athletes, not activists.\n- Carmichael led SNCC when he made the slogan famous."
  },
  {
    "name": "Question 4",
    "question": "Why did many young African Americans turn from non-violence to Black Power by the mid-1960s?",
    "metadata": [
      "The Civil Rights Act of 1964 had already ended racial discrimination in every state",
      "Martin Luther King Jr had called on his followers to take up arms against the police",
      "They were frustrated by slow change and ongoing violence against protesters",
      "The federal government had banned all non-violent protest marches",
      ""
    ],
    "answer": [
      "They were frustrated by slow change and ongoing violence against protesters",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "civil_society_protests_1950s_70s",
    "topic": "black_power_movement",
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
    "clues": "- Think about conditions in the urban ghettos and the South after 1964.\n- What had peaceful protesters faced at Selma and elsewhere?"
  },
  {
    "name": "Question 5",
    "question": "The Black Panther Party for Self-Defense was founded in October [].",
    "metadata": [
      "Year: ",
      "[ ]"
    ],
    "answer": [
      "1966",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "interpretation",
    "unit": "civil_society_protests_1950s_70s",
    "topic": "black_power_movement",
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
    "clues": "- It was the same year Carmichael made 'Black Power' a national slogan.\n- Write the four digits only."
  },
  {
    "name": "Question 6",
    "question": "Arrange these events in the order in which they happened.",
    "metadata": [
      "Stokely Carmichael popularises the slogan 'Black Power'",
      "Malcolm X is assassinated in New York",
      "Smith and Carlos give the Black Power salute at the Olympics",
      "Riots break out in the Watts district of Los Angeles",
      "The Black Panther Party is founded in Oakland"
    ],
    "answer": [
      "Malcolm X is assassinated in New York",
      "Riots break out in the Watts district of Los Angeles",
      "Stokely Carmichael popularises the slogan 'Black Power'",
      "The Black Panther Party is founded in Oakland",
      "Smith and Carlos give the Black Power salute at the Olympics"
    ],
    "presentation": "ordering",
    "type": "interpretation",
    "unit": "civil_society_protests_1950s_70s",
    "topic": "black_power_movement",
    "subtopic": "historical_chronology",
    "skills": [
      "sequence_historical_events"
    ],
    "difficulty": 4,
    "exam_weight": 2,
    "xp": 10,
    "order": 6,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2024,
    "paper": "nov_p1",
    "clues": "- Two events happened in 1965, two in 1966 and one in 1968.\n- The slogan came a few months before the party was founded."
  },
  {
    "name": "Question 7",
    "question": "Essay prompt: 'The Black Power Movement adopted a militant approach to challenge discrimination. Critically discuss.' Which introduction takes the clearest line of argument?",
    "metadata": [
      "The Black Power Movement began in the 1960s. Malcolm X, Stokely Carmichael and the Black Panthers were some of its best-known leaders.",
      "Black Power was partly militant, through armed self-defence, but its philosophy equally stressed black pride and community self-help.",
      "The Black Power Movement was violent and achieved nothing, because all of its leaders only wanted to fight white Americans in the street.",
      "Some people say Black Power was militant and some people say it was not, and both groups of historians have made some good points.",
      ""
    ],
    "answer": [
      "Black Power was partly militant, through armed self-defence, but its philosophy equally stressed black pride and community self-help.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "civil_society_protests_1950s_70s",
    "topic": "black_power_movement",
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
    "clues": "- 'Critically discuss' asks you to test the statement, not simply accept it.\n- A strong introduction takes a position and previews both sides of the evidence."
  },
  {
    "name": "Question 8",
    "question": "Arrange these sentences into a well-structured paragraph (Point, Evidence, Explanation, Link).",
    "metadata": [
      "Alongside its armed patrols, the party ran free breakfasts for children, health clinics and literacy classes.",
      "This shows the statement is only partly true: militancy was one part of a wider philosophy.",
      "The Black Panther Party was not only militant but also built self-reliance in black communities.",
      "These programmes met needs that government had ignored, putting the Black Power idea of self-help into practice."
    ],
    "answer": [
      "The Black Panther Party was not only militant but also built self-reliance in black communities.",
      "Alongside its armed patrols, the party ran free breakfasts for children, health clinics and literacy classes.",
      "These programmes met needs that government had ignored, putting the Black Power idea of self-help into practice.",
      "This shows the statement is only partly true: militancy was one part of a wider philosophy."
    ],
    "presentation": "ordering",
    "type": "application",
    "unit": "civil_society_protests_1950s_70s",
    "topic": "black_power_movement",
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
    "number": "6",
    "marks": 50,
    "clues": "- Test the statement against the Black Power philosophy, not just its methods.\n- Weigh militant evidence against self-empowerment evidence.",
    "approach": "- State your stance on how far the approach was militant and preview the evidence.\n- Give background on why Black Power emerged.\n- Write paragraphs on militant methods and on self-empowerment programmes.\n- Conclude by tying the evidence back to your stance.",
    "solution": "1. Introduction: take a critical stance on whether Black Power's approach was militant, based on its philosophy, and preview the evidence.\n2. Background: Jim Crow laws, ghetto poverty, police brutality and impatience with the slow pace of the Civil Rights Movement.\n3. The philosophy: black pride ('Black is beautiful'), self-reliance, community control of politics and freedom from white authority.\n4. Malcolm X promoted armed self-defence and black nationalism (militant) alongside self-respect and self-discipline.\n5. Stokely Carmichael popularised 'Black Power' in 1966, argued non-violence had failed, excluded white liberals and opposed the Vietnam War.\n6. In 1966 Huey Newton and Bobby Seale founded the Black Panther Party for Self-Defense; armed patrols monitored the police (militant).\n7. The Panthers' Ten-Point Programme, free breakfasts, health clinics, literacy classes and demand for Black history in schools (self-empowerment).\n8. Conclusion: tie the evidence back to your stance. Marks are awarded holistically on a seven-level matrix (content and presentation)."
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
