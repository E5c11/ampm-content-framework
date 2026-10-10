#!/usr/bin/env node
/**
 * DBE History P1 — November 2023 — Question 6 (order 6)
 * Civil society protests, Black Power: 'to what extent did the movement depend on violent, radical and militant strategies?'
 * Essay question: DESIGN-HIST-02 (no free-text essay; content-knowledge and essay-strategy items).
 * Q4/Q5/Q6 share one exam page (question_image_urls points at q4/question_1.png).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 * Typed blanks: numeric only, keyboard_type 'standard_math' on every fitb (KEYBOARD-04, DESIGN-HIST-03).
 *   node tools/validate-questions.js --script scripts/add-history-2023-nov-p1-q6.js --curriculum temp/curriculum-vocab-history-2023.json
 *   node scripts/add-history-2023-nov-p1-q6.js --dry-run
 *   node scripts/add-history-2023-nov-p1-q6.js
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
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2023/nov_p1/q4/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2023/nov_p1/q6/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2023/nov_p1/q6/memo_2.png"
  ],
  "exam_question_marks": 50,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "What did Stokely Carmichael mean by 'Black Power' when he popularised the slogan in 1966?",
    "metadata": [
      "African Americans should leave the USA and settle in newly independent African states",
      "African Americans should rely on the federal courts and on white liberal allies to win their civil rights",
      "African Americans should build their own political and economic power and take pride in being black",
      "African Americans should form an army to overthrow the government of the United States",
      ""
    ],
    "answer": [
      "African Americans should build their own political and economic power and take pride in being black",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "civil_society_protests_1950s_70s",
    "topic": "black_power_movement",
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
    "paper": "nov_p1",
    "clues": "- Carmichael used the slogan during a march in Mississippi in June 1966.\n- Think about control of their own communities, and self-respect."
  },
  {
    "name": "Question 2",
    "question": "Malcolm X, who argued for armed self-defence against white violence, was assassinated in New York in February [].",
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
    "type": "definition",
    "unit": "civil_society_protests_1950s_70s",
    "topic": "black_power_movement",
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
    "paper": "nov_p1",
    "keyboard_type": "standard_math",
    "clues": "- He was killed the year before the Black Panther Party was founded.\n- Write the year as four digits."
  },
  {
    "name": "Question 3",
    "question": "Which of these support the view that the Black Power Movement depended on militant strategies to a GREAT extent?",
    "metadata": [
      "Malcolm X called on African Americans to win freedom 'by any means necessary'",
      "The Black Panthers ran free breakfast programmes for children in poor neighbourhoods",
      "Black Panther members carried guns openly on patrols to watch the police",
      "The 'Black is beautiful' campaign encouraged pride in African hairstyles and dress",
      "Carmichael argued that non-violence had failed in the face of continuing attacks"
    ],
    "answer": [
      "Malcolm X called on African Americans to win freedom 'by any means necessary'",
      "Black Panther members carried guns openly on patrols to watch the police",
      "Carmichael argued that non-violence had failed in the face of continuing attacks",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "civil_society_protests_1950s_70s",
    "topic": "black_power_movement",
    "subtopic": "essay_argumentation",
    "skills": [
      "evaluate_historical_extent"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2023,
    "paper": "nov_p1",
    "clues": "- Decide whether each option is about force and confrontation or about pride and self-help.\n- Two options are evidence for a LESSER extent."
  },
  {
    "name": "Question 4",
    "question": "In December 1966, SNCC under Stokely Carmichael asked its white members to leave. Why?",
    "metadata": [
      "White members had refused to take part in the Freedom Rides and the sit-ins",
      "The federal government had banned organisations with both black and white members",
      "Carmichael believed African Americans had to lead and control their own struggle",
      "Martin Luther King Jr had asked SNCC to hand its white members over to his organisation",
      ""
    ],
    "answer": [
      "Carmichael believed African Americans had to lead and control their own struggle",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "interpretation",
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
    "year": 2023,
    "paper": "nov_p1",
    "clues": "- Black Power stressed self-reliance and control of the movement by African Americans.\n- The decision was about who should lead, not about any law."
  },
  {
    "name": "Question 5",
    "question": "What was the Black Panther Party's Ten-Point Program of 1966?",
    "metadata": [
      "A set of rules for non-violent sit-ins drawn up with Martin Luther King Jr",
      "A plan to divide the USA into two separate countries, one for black people and one for white",
      "A federal law of 1968 that banned racial discrimination in the sale and the rental of housing",
      "A list of demands including decent housing, jobs, education and an end to police brutality",
      ""
    ],
    "answer": [
      "A list of demands including decent housing, jobs, education and an end to police brutality",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "civil_society_protests_1950s_70s",
    "topic": "black_power_movement",
    "subtopic": "key_figures_and_events",
    "skills": [
      "identify_historical_event_or_term"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 5,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2023,
    "paper": "nov_p1",
    "clues": "- The Panthers set out what their communities needed, point by point.\n- It was a party programme, not a law."
  },
  {
    "name": "Question 6",
    "question": "Match each Black Power idea to its meaning.",
    "metadata": [
      "A - Black nationalism",
      "B - Black Pride",
      "C - Armed self-defence",
      "D - Policing the police",
      "1 - Patrols that followed police officers to deter brutality in black neighbourhoods",
      "2 - Building separate, black-run institutions, businesses and communities",
      "3 - The right to use weapons to protect oneself when attacked",
      "4 - Self-respect and pride in African heritage, history and appearance"
    ],
    "answer": [
      "A-2",
      "B-4",
      "C-3",
      "D-1"
    ],
    "presentation": "match",
    "type": "definition",
    "unit": "civil_society_protests_1950s_70s",
    "topic": "black_power_movement",
    "subtopic": "historical_terminology",
    "skills": [
      "define_historical_term"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 6,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2023,
    "paper": "nov_p1",
    "clues": "- Nationalism is about building a separate community; pride is about self-respect.\n- One idea describes something the Black Panthers did on the streets."
  },
  {
    "name": "Question 7",
    "question": "Essay prompt: 'Explain to what extent the Black Power Movement depended on the use of violent, radical and militant strategies to end discrimination in the USA.' Which introduction best answers it?",
    "metadata": [
      "The Black Power Movement began in the 1960s. Its leaders included Malcolm X, Stokely Carmichael, Huey Newton and Bobby Seale, and this essay will discuss each of them in turn.",
      "To a lesser extent: Black Power leaders defended armed self-defence, but the movement relied mainly on pride, self-help and community programmes to end discrimination.",
      "The Black Power Movement was violent and radical, unlike Martin Luther King Jr, who believed in non-violence and is remembered as a great American hero today.",
      "Some historians say the Black Power Movement was violent and others say it was peaceful, so the extent to which it depended on violence can never be known for sure.",
      ""
    ],
    "answer": [
      "To a lesser extent: Black Power leaders defended armed self-defence, but the movement relied mainly on pride, self-help and community programmes to end discrimination.",
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
    "year": 2023,
    "paper": "nov_p1",
    "clues": "- 'To what extent' needs a stance that measures how far, not just yes or no.\n- A strong introduction also previews the evidence you will use."
  },
  {
    "name": "Question 8",
    "question": "Arrange these sentences into a well-structured paragraph (Point, Evidence, Explanation, Link).",
    "metadata": [
      "These programmes met needs the government ignored and won the party wide support in black communities.",
      "The Black Panthers did not depend on guns alone to fight discrimination.",
      "This suggests that militancy was only one part of Black Power's strategy, so it depended on violence to a lesser extent.",
      "Alongside their armed patrols, they ran free breakfasts, health clinics and literacy classes."
    ],
    "answer": [
      "The Black Panthers did not depend on guns alone to fight discrimination.",
      "Alongside their armed patrols, they ran free breakfasts, health clinics and literacy classes.",
      "These programmes met needs the government ignored and won the party wide support in black communities.",
      "This suggests that militancy was only one part of Black Power's strategy, so it depended on violence to a lesser extent."
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
    "year": 2023,
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
    "clues": "- 'To what extent' needs a stance: did Black Power depend on violent, radical and militant strategies to a greater or lesser extent?\n- Weigh the militant strategies against the movement's pride, self-help and community work.",
    "approach": "- State your stance and preview your evidence.\n- Write paragraphs on the background, the leaders' ideas, the Black Panthers and the impact (Point, Evidence, Explanation, Link).\n- Acknowledge evidence that points the other way, then show why your stance still holds.\n- Conclude by tying the evidence back to your stance.",
    "solution": "1. Introduction: take a stance on the extent to which Black Power depended on violent, radical and militant strategies, and outline how you will support it.\n2. Background: Jim Crow laws, ghettos, poor housing and police brutality left African Americans impatient with the slow pace of change.\n3. Black Power philosophy: assertiveness, self-reliance, black pride and community control, popularised by Stokely Carmichael from 1966 ('Black is beautiful').\n4. Malcolm X promoted armed self-defence against white violence and black nationalism, and encouraged self-respect and self-discipline.\n5. Carmichael argued non-violence had failed in the face of continuing violence, and urged that African Americans lead their own organisations.\n6. In 1966 Huey Newton and Bobby Seale founded the Black Panther Party for Self-Defense, which patrolled the streets to monitor the police.\n7. The Panthers' Ten-Point Program set out social, political and economic goals for African American communities.\n8. Community programmes: free breakfasts, health clinics, childcare and literacy projects, and demands that black history be taught.\n9. Women played leading roles, for example Angela Davis.\n10. Impact: the most obvious discrimination ended, African Americans were elected to public office, and affirmative action was introduced in federal employment.\n11. Conclusion: tie the evidence back to your stance. Marks are awarded holistically on a seven-level matrix (content and presentation)."
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
