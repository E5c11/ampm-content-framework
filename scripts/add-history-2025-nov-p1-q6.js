#!/usr/bin/env node
/**
 * DBE History P1 — November 2025 — Question 6 (order 6)
 * Civil society protests 1950s-1970s: the Black Power Movement in the 1960s USA (essay).
 * Essay question: DESIGN-HIST-02 (no free-text input; content-knowledge items plus essay-strategy items).
 * Q4/Q5/Q6 share one exam page (question_image_urls points at q4/question_1.png).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 * Typed blanks: numeric only, keyboard_type 'standard_math' on every fitb (KEYBOARD-04, DESIGN-HIST-03).
 *   node tools/validate-questions.js --script scripts/add-history-2025-nov-p1-q6.js --curriculum temp/curriculum-vocab-history.json
 *   node scripts/add-history-2025-nov-p1-q6.js --dry-run
 *   node scripts/add-history-2025-nov-p1-q6.js
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
  "year": 2025,
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
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2025/nov_p1/q4/question_1.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2025/nov_p1/q6/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2025/nov_p1/q6/memo_2.png"
  ],
  "exam_question_marks": 50,
  "supplementary_materials": []
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Which leader argued that African Americans should defend themselves against white violence, including by armed self-defence?",
    "metadata": [
      "Martin Luther King Jr",
      "Rosa Parks",
      "Malcolm X",
      "Thurgood Marshall",
      ""
    ],
    "answer": [
      "Malcolm X",
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
    "exam_weight": 3,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- He promoted black nationalism and self-respect.\n- He was not a leader of the non-violent campaign."
  },
  {
    "name": "Question 2",
    "question": "The Black Panther Party for Self-Defence was formed in the year [].",
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
    "difficulty": 1,
    "exam_weight": 3,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2025,
    "paper": "nov_p1",
    "keyboard_type": "standard_math",
    "clues": "- It was formed in the mid-1960s, during the riots in northern cities.\n- Write four digits only."
  },
  {
    "name": "Question 3",
    "question": "Why did many young African Americans turn to Black Power in the mid-1960s?",
    "metadata": [
      "The Civil Rights Act had been repealed",
      "They were impatient with the slow pace of change and faced ongoing police brutality and poverty in the ghettos",
      "Martin Luther King Jr had joined the Black Panther Party",
      "Segregation had ended completely, leaving nothing to protest",
      ""
    ],
    "answer": [
      "They were impatient with the slow pace of change and faced ongoing police brutality and poverty in the ghettos",
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
    "exam_weight": 3,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- The Civil Rights Movement had won some changes, but not an end to daily discrimination.\n- Think of the northern ghettos and the police."
  },
  {
    "name": "Question 4",
    "question": "Which activities are associated with the Black Panther Party?",
    "metadata": [
      "Patrolling streets to monitor police behaviour",
      "Running feeding schemes for children in black communities",
      "Running literacy projects and demanding black history in black schools",
      "Organising the Montgomery bus boycott",
      "Leading the March on Washington"
    ],
    "answer": [
      "Patrolling streets to monitor police behaviour",
      "Running feeding schemes for children in black communities",
      "Running literacy projects and demanding black history in black schools",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "interpretation",
    "unit": "civil_society_protests_1950s_70s",
    "topic": "black_power_movement",
    "subtopic": "key_figures_and_events",
    "skills": [
      "identify_historical_event_or_term"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Two options belong to the non-violent Civil Rights Movement of the 1950s and 1960s.\n- The Party's programmes combined self-defence with community support."
  },
  {
    "name": "Question 5",
    "question": "Match each person or group to what they are known for.",
    "metadata": [
      "A - Malcolm X",
      "B - Stokely Carmichael",
      "C - Huey Newton and Bobby Seale",
      "D - Martin Luther King Jr",
      "1 - Promoting black nationalism and armed self-defence",
      "2 - Arguing that non-violence had failed in the face of continuing violence, and promoting Black Power",
      "3 - Founding the Black Panther Party for Self-Defence",
      "4 - Leading the non-violent campaign that Black Power activists criticised as too slow"
    ],
    "answer": [
      "A-1",
      "B-2",
      "C-3",
      "D-4"
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
    "exam_weight": 3,
    "xp": 10,
    "order": 5,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Two of these are named as the founders of one organisation.\n- One of these leaders is mainly associated with the approach the others rejected."
  },
  {
    "name": "Question 6",
    "question": "Which of the following are examples of the Black Power Movement succeeding in challenging discrimination, to a great extent?",
    "metadata": [
      "Promoting Black Pride, including African dress and the Afro hairstyle",
      "Black Panther feeding schemes, childcare and literacy projects in black communities",
      "Riots between 1965 and 1969 that led President Johnson to appoint a commission and begin reform programmes",
      "The repeal of all segregation laws through Black Power legislation",
      "The unanimous support of every African American organisation"
    ],
    "answer": [
      "Promoting Black Pride, including African dress and the Afro hairstyle",
      "Black Panther feeding schemes, childcare and literacy projects in black communities",
      "Riots between 1965 and 1969 that led President Johnson to appoint a commission and begin reform programmes",
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
    "difficulty": 4,
    "exam_weight": 3,
    "xp": 10,
    "order": 6,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- Two options claim far more than the movement achieved.\n- Look for achievements that can be tied to evidence."
  },
  {
    "name": "Question 7",
    "question": "Essay prompt: 'To what extent was the Black Power Movement successful in organising African Americans to challenge racial discrimination?' Which introduction best answers it?",
    "metadata": [
      "Black Power is a movement. It started in the 1960s.",
      "Black Power was good",
      "Yes, it was successful",
      "To a great extent: Black Power built pride, self-reliance and community programmes and drew attention to police brutality, although it won fewer legal changes than the Civil Rights Movement",
      ""
    ],
    "answer": [
      "To a great extent: Black Power built pride, self-reliance and community programmes and drew attention to police brutality, although it won fewer legal changes than the Civil Rights Movement",
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
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- 'To what extent' asks you to judge how far, not just whether.\n- A strong introduction gives a judgement, reasons and a limit."
  },
  {
    "name": "Question 8",
    "question": "Arrange these sentences into a well-structured paragraph (Point, Evidence, Explanation, Link).",
    "metadata": [
      "This supports the view that Black Power succeeded to a great extent in organising African Americans.",
      "The Black Panther Party challenged discrimination through community self-help as well as self-defence.",
      "These programmes met needs that the state had ignored and gave residents a sense of pride and control over their own communities.",
      "Its members patrolled streets to monitor the police and ran feeding schemes, childcare and literacy projects."
    ],
    "answer": [
      "The Black Panther Party challenged discrimination through community self-help as well as self-defence.",
      "Its members patrolled streets to monitor the police and ran feeding schemes, childcare and literacy projects.",
      "These programmes met needs that the state had ignored and gave residents a sense of pride and control over their own communities.",
      "This supports the view that Black Power succeeded to a great extent in organising African Americans."
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
    "exam_weight": 3,
    "xp": 10,
    "order": 8,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2025,
    "paper": "nov_p1",
    "clues": "- The first sentence states the claim the paragraph will defend.\n- The final sentence connects the paragraph back to the question."
  }
];

// ─── AI explanation (AMPM-CONTENT-AI-EXP) — one entry per REAL exam sub-question, against the memo ───

const aiExplanation = {
  sub_questions: [
  {
    "number": "6",
    "marks": 50,
    "clues": "- - Take a stance on whether the movement succeeded to a greater or lesser extent, and keep to it.\n- - Cover reasons for the movement, its leaders and organisations, and its gains.",
    "approach": "- - State your judgement and reasons in the introduction.\n- - Use paragraphs on emergence, leaders, the Black Panther Party and wider impact.\n- - Support each claim with evidence and tie it back to 'extent'.\n- - Conclude with your final judgement.",
    "solution": "1. Introduction: take a stance on whether the movement was successful to a greater or lesser extent in organising African Americans to challenge discrimination and segregation in the 1960s.\n2. Reasons for emergence: Jim Crow laws left African Americans economically and politically crippled; lack of pride; ghettos, slums and poor housing; impatience with the slow pace of change; the influence of the Civil Rights Movement; police brutality leading to the notion of self-defence.\n3. Black Power philosophy: freedom from white authority, Black Pride, self-respect and self-discipline.\n4. Malcolm X promoted armed self-defence and black nationalism, arguing bloodshed could be necessary for revolution, and urged African Americans to stand up by whatever means necessary (challenged discrimination to a great extent).\n5. Stokely Carmichael argued non-violence had failed because violence against African Americans continued, and promoted assertiveness, self-reliance and Black Pride, including the Afro hairstyle and African clothing.\n6. The Black Panther Party for Self-Defence was formed in 1966 by Huey Newton and Bobby Seale; members patrolled streets to monitor police activity and defend against police brutality.\n7. The Party's Ten Point Plan covered social, political and economic goals; its feeding schemes, childcare and literacy projects served black communities and it demanded that black history be taught in black schools.\n8. Other activists, such as Angela Davis, also played a role.\n9. Riots between 1965 and 1969 drew attention to discrimination in the northern states; President Johnson appointed a commission of enquiry and began reform programmes to reduce poverty and discrimination.\n10. African Americans became proud of their African heritage, as shown by Afro hairstyles.\n11. Conclusion: weigh the movement's gains against its limits and tie the evidence back to 'to what extent'. Marks are awarded holistically on a seven-level matrix (content and presentation)."
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
