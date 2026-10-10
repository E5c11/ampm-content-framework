#!/usr/bin/env node
/**
 * DBE History P1 — November 2023 — Question 3 (order 3)
 * Civil society protests: the challenges faced by the Freedom Riders in the USA in the 1960s (Sources 3A-3D).
 * Source-based question: DESIGN-HIST-01 (same real sources, fresh interpretive-angle practice questions);
 * DESIGN-HIST-02 (the 8-mark paragraph is taught via objective synthesis and paragraph-ordering items).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 * Typed blanks: numeric only, keyboard_type 'standard_math' on every fitb (KEYBOARD-04, DESIGN-HIST-03).
 *   node tools/validate-questions.js --script scripts/add-history-2023-nov-p1-q3.js --curriculum temp/curriculum-vocab-history-2023.json
 *   node scripts/add-history-2023-nov-p1-q3.js --dry-run
 *   node scripts/add-history-2023-nov-p1-q3.js
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
  "name": "Question 3",
  "syllabus": "dbe",
  "subject": "history",
  "year": 2023,
  "paper": "nov_p1",
  "order": 3,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "freedom_rides",
    "civil_rights_movement",
    "segregation",
    "source_reliability"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2023/nov_p1/q3/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2023/nov_p1/q3/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2023/nov_p1/q3/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2023/nov_p1/q3/memo_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2023/nov_p1/q3/memo_3.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2023/nov_p1/q3/memo_4.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2023/nov_p1/q3/memo_5.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2023/nov_p1/q3/memo_6.png"
  ],
  "exam_question_marks": 50,
  "supplementary_materials": [
    {
      "type": "source",
      "label": "Source 3A",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2023/nov_p1/q3/annexure_3A.png"
      ]
    },
    {
      "type": "source",
      "label": "Source 3B",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2023/nov_p1/q3/annexure_3B.png"
      ]
    },
    {
      "type": "source",
      "label": "Source 3C",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2023/nov_p1/q3/annexure_3C.png"
      ]
    },
    {
      "type": "source",
      "label": "Source 3D",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2023/nov_p1/q3/annexure_3D.png"
      ]
    }
  ]
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "In Source 3C, Zwerg says the group decided to send twelve people and that he was one of 18 volunteers. How many of the volunteers were not sent?",
    "metadata": [
      "Volunteers not sent: ",
      "[ ]"
    ],
    "answer": [
      "6",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "application",
    "unit": "civil_society_protests_1950s_70s",
    "topic": "freedom_rides_1961",
    "subtopic": "evidence_extraction",
    "skills": [
      "calculate_from_source_data"
    ],
    "difficulty": 2,
    "exam_weight": 1,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2023,
    "paper": "nov_p1",
    "keyboard_type": "standard_math",
    "clues": "- Find both numbers in the second paragraph of Zwerg's first answer.\n- Subtract the number sent from the number who volunteered."
  },
  {
    "name": "Question 2",
    "question": "According to Source 3C, how did the Nashville students' plan differ from CORE's?",
    "metadata": [
      "CORE travelled only in daylight, but the Nashville students rode through the night",
      "CORE used only black riders, but the Nashville group sent only white students",
      "CORE chartered its buses, but the Nashville students simply bought tickets and boarded",
      "CORE travelled to New Orleans by train, but the Nashville students went by Greyhound bus",
      ""
    ],
    "answer": [
      "CORE chartered its buses, but the Nashville students simply bought tickets and boarded",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "interpretation",
    "unit": "civil_society_protests_1950s_70s",
    "topic": "freedom_rides_1961",
    "subtopic": "evidence_extraction",
    "skills": [
      "identify_evidence_from_a_source"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2023,
    "paper": "nov_p1",
    "clues": "- Look for the words 'Our plan was different from CORE's'.\n- The source explains the word 'chartered' in brackets."
  },
  {
    "name": "Question 3",
    "question": "Source 3A refers to the 'jails of the Jim Crow South'. What does 'Jim Crow' refer to?",
    "metadata": [
      "The federal laws that protected the right of all races to travel together on buses",
      "The laws and customs in the Southern states that enforced racial segregation",
      "The Northern cities to which many African Americans moved to escape the South",
      "The nickname given to the buses that carried the Freedom Riders through the South",
      ""
    ],
    "answer": [
      "The laws and customs in the Southern states that enforced racial segregation",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "civil_society_protests_1950s_70s",
    "topic": "freedom_rides_1961",
    "subtopic": "historical_terminology",
    "skills": [
      "define_historical_term"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2023,
    "paper": "nov_p1",
    "clues": "- Source 3A contrasts federal law with 'local law and custom' in the Deep South.\n- Think about what those local laws demanded."
  },
  {
    "name": "Question 4",
    "question": "Which features make Source 3D useful to a historian studying the treatment of the Freedom Riders?",
    "metadata": [
      "It contains the first-hand account of H Thomas, a Freedom Rider who was on the bus",
      "It is a hospital record listing the treatment that each injured rider received",
      "It quotes Governor Patterson's own public statements about integration",
      "It was written by Governor Patterson himself to explain why he acted as he did",
      "It comes from a published book by H Raines that collected memories of the movement"
    ],
    "answer": [
      "It contains the first-hand account of H Thomas, a Freedom Rider who was on the bus",
      "It quotes Governor Patterson's own public statements about integration",
      "It comes from a published book by H Raines that collected memories of the movement",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "civil_society_protests_1950s_70s",
    "topic": "freedom_rides_1961",
    "subtopic": "source_evaluation",
    "skills": [
      "evaluate_source_reliability"
    ],
    "difficulty": 4,
    "exam_weight": 3,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2023,
    "paper": "nov_p1",
    "clues": "- Read the introduction above Source 3D: who was interviewed, and by whom?\n- Look for whose words are quoted in the last paragraph."
  },
  {
    "name": "Question 5",
    "question": "Source 3B comes from the New York Amsterdam News of 20 May 1961. Which best describes its point of view?",
    "metadata": [
      "It blames the Freedom Riders for provoking the violence against them in Alabama",
      "It sympathises with the Freedom Riders and condemns the attack on their bus",
      "It reports the burning of the bus neutrally, without taking either side",
      "It supports the Governor of Alabama's refusal to protect the Freedom Riders",
      ""
    ],
    "answer": [
      "It sympathises with the Freedom Riders and condemns the attack on their bus",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "interpretation",
    "unit": "civil_society_protests_1950s_70s",
    "topic": "freedom_rides_1961",
    "subtopic": "source_evaluation",
    "skills": [
      "interpret_photograph_evidence"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 5,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2023,
    "paper": "nov_p1",
    "clues": "- Look at the words the newspaper chose for its headline and caption.\n- Would a neutral report use an exclamation mark?"
  },
  {
    "name": "Question 6",
    "question": "Match each challenge faced by the Freedom Riders to the evidence for it.",
    "metadata": [
      "A - Arrest by the police",
      "B - Refusal of medical care",
      "C - Violence from white mobs",
      "D - Being spied on",
      "1 - Source 3C: 'There was an awareness that our phones were being tapped'",
      "2 - Source 3D: 'The people at the hospital would not do anything for us'",
      "3 - Source 3B: a photograph of the Freedom Riders' bus in flames",
      "4 - Source 3C: 'We were both placed under arrest, taken off the bus'"
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
    "topic": "freedom_rides_1961",
    "subtopic": "evidence_extraction",
    "skills": [
      "corroborate_evidence_across_sources"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 6,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2023,
    "paper": "nov_p1",
    "clues": "- Read each piece of evidence and ask which challenge it shows.\n- Two pieces of evidence come from the same source."
  },
  {
    "name": "Question 7",
    "question": "Source 3A says the Freedom Riders 'knew that they might be injured or even killed'. Which detail in Source 3D shows that this fear was justified?",
    "metadata": [
      "The hospital staff treated the injured riders at once and then sent them home",
      "The bus exploded, and many riders were cut by flying glass or overcome by smoke",
      "Governor Patterson ordered the state police to escort the buses through Alabama",
      "The Reverend Shuttlesworth's caravan was attacked on its way to the hospital",
      ""
    ],
    "answer": [
      "The bus exploded, and many riders were cut by flying glass or overcome by smoke",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "civil_society_protests_1950s_70s",
    "topic": "freedom_rides_1961",
    "subtopic": "source_evaluation",
    "skills": [
      "corroborate_evidence_across_sources"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 7,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2023,
    "paper": "nov_p1",
    "clues": "- Read the first paragraph of Source 3D.\n- Rule out options that Source 3D does not say, or that it contradicts."
  },
  {
    "name": "Question 8",
    "question": "Arrange these sentences into a well-structured paragraph on the challenges the Freedom Riders faced.",
    "metadata": [
      "These challenges show how fiercely the Southern states resisted desegregation in 1961.",
      "Governor Patterson even said that 'rioters' would not receive police protection (Source 3D).",
      "The Freedom Riders faced violence, arrest and hostility from the authorities in the Deep South.",
      "In Alabama their bus was set on fire, and the injured riders were refused treatment at the hospital (Sources 3B and 3D).",
      "They knew federal law protected their right to travel together, but local laws in the South demanded segregation (Source 3A)."
    ],
    "answer": [
      "The Freedom Riders faced violence, arrest and hostility from the authorities in the Deep South.",
      "They knew federal law protected their right to travel together, but local laws in the South demanded segregation (Source 3A).",
      "In Alabama their bus was set on fire, and the injured riders were refused treatment at the hospital (Sources 3B and 3D).",
      "Governor Patterson even said that 'rioters' would not receive police protection (Source 3D).",
      "These challenges show how fiercely the Southern states resisted desegregation in 1961."
    ],
    "presentation": "ordering",
    "type": "application",
    "unit": "civil_society_protests_1950s_70s",
    "topic": "freedom_rides_1961",
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
    "year": 2023,
    "paper": "nov_p1",
    "clues": "- A paragraph opens with its main point and ends by linking back to the question.\n- Set out the background before the events in Alabama."
  },
  {
    "name": "Question 9",
    "question": "Which claims about the challenges faced by the Freedom Riders are supported by the sources?",
    "metadata": [
      "They risked injury or death for travelling together in the Deep South (Source 3A)",
      "Their phones were tapped, and some were arrested and taken off the bus (Source 3C)",
      "President Kennedy sent federal troops to protect every bus from the start (Source 3A)",
      "The injured riders were told to leave the hospital as a crowd gathered outside (Source 3D)",
      "Most of the riders gave up after the first attack and returned home (Source 3A)"
    ],
    "answer": [
      "They risked injury or death for travelling together in the Deep South (Source 3A)",
      "Their phones were tapped, and some were arrested and taken off the bus (Source 3C)",
      "The injured riders were told to leave the hospital as a crowd gathered outside (Source 3D)",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "civil_society_protests_1950s_70s",
    "topic": "freedom_rides_1961",
    "subtopic": "historical_causation",
    "skills": [
      "corroborate_evidence_across_sources"
    ],
    "difficulty": 4,
    "exam_weight": 3,
    "xp": 10,
    "order": 9,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2023,
    "paper": "nov_p1",
    "clues": "- A claim is supported only if the named source actually says it.\n- Check what Source 3A says about how many riders kept coming."
  }
];

// ─── AI explanation (AMPM-CONTENT-AI-EXP) — one entry per REAL exam sub-question, against the memo ───

const aiExplanation = {
  sub_questions: [
  {
    "number": "3.1.1",
    "marks": 2,
    "clues": "- Read the first paragraph of Source 3A.\n- Quote how they set out to change things.",
    "approach": "- Copy the sentence describing how they travelled.",
    "solution": "1. 'They did so by simply boarding a bus, not as Blacks or Whites restricted by an outmoded system of racial discrimination, but as free and full citizens of a democratic nation'"
  },
  {
    "number": "3.1.2",
    "marks": 2,
    "clues": "- A constitution sets out a country's basic laws.\n- Use your own words.",
    "approach": "- Write one clear definition.",
    "solution": "1. A legal document setting out the basic laws of a country or organisation.\n2. Or: a framework of fundamental principles that guide how a country is governed."
  },
  {
    "number": "3.1.3",
    "marks": 2,
    "clues": "- They knew the danger and went anyway.\n- What does that say about them?",
    "approach": "- Explain one meaning of the statement.",
    "solution": "1. The Freedom Riders were determined to continue protesting despite violent attacks by racists and the state.\n2. Or: they knew the authorities in the South might side with the racists."
  },
  {
    "number": "3.1.4",
    "marks": 4,
    "clues": "- The Freedom Rides drew the world's attention.\n- What pressure did that put on Kennedy?",
    "approach": "- Give two reasons, using the source and own knowledge.",
    "solution": "1. The publicity gave the Freedom Rides national and international attention.\n2. He had to uphold the Constitution and could not defend state segregation laws.\n3. He wanted to stop the violence and protect the image of US democracy.\n4. Any two, explained, earn the 4 marks."
  },
  {
    "number": "3.2.1",
    "marks": 2,
    "clues": "- Look at the photograph and the date.\n- Why would this be front-page news?",
    "approach": "- Give one developed reason.",
    "solution": "1. To expose the violent racist attack on the Freedom Riders in Alabama in May 1961.\n2. Or: to win sympathy for the Freedom Riders and the civil rights cause."
  },
  {
    "number": "3.2.2",
    "marks": 4,
    "clues": "- 'Inhuman' means lacking pity or kindness.\n- Who is the word aimed at?",
    "approach": "- Give two explanations of the headline.",
    "solution": "1. The white segregationists who attacked the riders were inhumane, as the riders were defenceless.\n2. The attackers acted in a violent and heartless way.\n3. Both points, explained, earn the 4 marks."
  },
  {
    "number": "3.2.3",
    "marks": 2,
    "clues": "- The flames are literal and symbolic.\n- What fuelled the attack?",
    "approach": "- Explain one meaning of the caption.",
    "solution": "1. The burning bus reflects the white mob's hatred of racial integration.\n2. Or: the mob could not hide its hatred for the Freedom Riders."
  },
  {
    "number": "3.3.1",
    "marks": 1,
    "clues": "- Read Zwerg's first answer.\n- One quote is enough.",
    "approach": "- Find what pushed his group to act.",
    "solution": "1. '… we got word of the burning of the bus in Aniston …'\n2. Or: '… if we let those perpetrators of violence believe that people would stop if they were violent enough …'"
  },
  {
    "number": "3.3.2",
    "marks": 2,
    "clues": "- Read the end of Zwerg's second answer.\n- Two options, one mark each.",
    "approach": "- Copy two things activists agreed to do if jailed.",
    "solution": "1. '… you go on a hunger strike …'\n2. 'You don't cop (opt for) a plea'\n3. '… you don't pay the bail and jump'\n4. 'You stay'\n5. Any two earn 1 mark each."
  },
  {
    "number": "3.3.3",
    "marks": 4,
    "clues": "- Use the introduction above Source 3C.\n- Who is speaking, and was he there?",
    "approach": "- Give two reasons the source is reliable.",
    "solution": "1. It comes from a documentary by Stanley Nelson, based on interviews.\n2. Jim Zwerg was an eyewitness who took part in the Freedom Rides in May 1961.\n3. He was one of 18 volunteers and was arrested on the journey.\n4. Any two, explained, earn the 4 marks."
  },
  {
    "number": "3.4.1",
    "marks": 3,
    "clues": "- Read the first paragraph of Source 3D.\n- Three reasons, one mark each.",
    "approach": "- Copy three injuries or effects of the explosion.",
    "solution": "1. '… people were cut by flying glass'\n2. '… for smoke inhalation'\n3. '… half dazed (confused), as a result of the smoke'\n4. '… dry heaves'\n5. Any three earn 1 mark each."
  },
  {
    "number": "3.4.2",
    "marks": 4,
    "clues": "- Patterson calls peaceful protesters 'rioters'.\n- What is he signalling to the police and the mobs?",
    "approach": "- Give two implications.",
    "solution": "1. The governor did not support the Freedom Riders because he opposed integration.\n2. The state would not assign police to protect them from racist attackers.\n3. He wanted to discourage the riders from continuing.\n4. Any two, explained, earn the 4 marks."
  },
  {
    "number": "3.4.3",
    "marks": 2,
    "clues": "- Read the second paragraph of Source 3D.\n- Two quotes, one mark each.",
    "approach": "- Copy what the hospital did, or refused to do.",
    "solution": "1. 'The people at the hospital would not do anything for us'\n2. '… the hospital told us to leave'"
  },
  {
    "number": "3.4.4",
    "marks": 2,
    "clues": "- Segregation means separating people by race.\n- Link it to Alabama.",
    "approach": "- Explain the term in context.",
    "solution": "1. A supporter of racial segregation in every area of African Americans' lives in Alabama."
  },
  {
    "number": "3.4.5",
    "marks": 2,
    "clues": "- Read the last paragraph of Source 3D.\n- Two quotes, one mark each.",
    "approach": "- Copy two pieces of evidence about Patterson.",
    "solution": "1. '… solicited (asked) Ku Klux Klan support in his election campaign'\n2. '… integration would come to Alabama only 'over my dead body''\n3. '… use every power at my command to prevent any mixing of white and Negro races in the classrooms …'\n4. 'I cannot guarantee protection for this bunch of rabble-rousers'\n5. Any two earn 1 mark each."
  },
  {
    "number": "3.5",
    "marks": 4,
    "clues": "- Source 3C describes arrests and the Anniston burning.\n- Source 3D describes the explosion and no protection.",
    "approach": "- Give two points where Source 3D supports Source 3C.",
    "solution": "1. Source 3C mentions the burning of a bus, and Source 3D describes riders injured when their bus exploded.\n2. Source 3C says riders were arrested by police, and Source 3D says they were refused police protection.\n3. Both show the riders were determined to continue despite violence.\n4. Any two, explained, earn the 4 marks."
  },
  {
    "number": "3.6",
    "marks": 8,
    "clues": "- Use evidence from each source, plus own knowledge.\n- Write an organised paragraph, not a list.",
    "approach": "- Open with why the Freedom Rides took place (own knowledge, Source 3A).\n- Describe violence and arrests (Sources 3B, 3C).\n- Add the hospital and the governor (Source 3D).\n- Close with a linking sentence.",
    "solution": "1. Own knowledge: the Freedom Rides tested Supreme Court rulings against segregation on interstate buses and terminals.\n2. The Southern states refused to accept desegregation, and riders knew they might be injured or killed (Source 3A).\n3. A bus was set on fire by a white mob in Alabama (Source 3B).\n4. Riders were arrested, and their phones were tapped (Source 3C).\n5. Injured riders were refused treatment and told to leave the hospital as a crowd gathered (Source 3D).\n6. Governor Patterson, who had sought Ku Klux Klan support, refused them police protection (Source 3D).\n7. Own knowledge: images of the violence spread across the world and built support for civil rights.\n8. Marks are awarded holistically on a three-level rubric (0–2, 3–5, 6–8)."
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
