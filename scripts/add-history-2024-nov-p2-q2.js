#!/usr/bin/env node
/**
 * DBE History P2 — November 2024 — Question 2 (order 2)
 * Coming of Democracy / Coming to Terms with the Past: did the TRC bring closure to Sizwe Kondile's family? (Sources 2A-2D).
 * Source-based question: DESIGN-HIST-01 (same real sources, fresh angles); DESIGN-HIST-02 (2.6 taught via an objective synthesis item).
 *
 * Pipeline Phase 4 (AMPM-CONTENT-PIPELINE). Paper-only upload — no video.
 * Typed blanks: numeric only, keyboard_type 'standard_math' on every fitb (KEYBOARD-04, DESIGN-HIST-03).
 *   node tools/validate-questions.js --script scripts/add-history-2024-nov-p2-q2.js --curriculum temp/curriculum-vocab-history-p2-2024.json
 *   node scripts/add-history-2024-nov-p2-q2.js --dry-run
 *   node scripts/add-history-2024-nov-p2-q2.js
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
  "name": "Question 2",
  "syllabus": "dbe",
  "subject": "history",
  "year": 2024,
  "paper": "nov_p2",
  "order": 2,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "truth_and_reconciliation_commission",
    "amnesty",
    "spiritual_repatriation",
    "human_rights_violations",
    "source_reliability"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2024/nov_p2/q2/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2024/nov_p2/q2/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2024/nov_p2/q2/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2024/nov_p2/q2/memo_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2024/nov_p2/q2/memo_3.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2024/nov_p2/q2/memo_4.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2024/nov_p2/q2/memo_5.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2024/nov_p2/q2/memo_6.png"
  ],
  "exam_question_marks": 50,
  "supplementary_materials": [
    {
      "type": "source",
      "label": "Source 2A",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2024/nov_p2/q2/annexure_2A.png"
      ]
    },
    {
      "type": "source",
      "label": "Source 2B",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2024/nov_p2/q2/annexure_2B.png"
      ]
    },
    {
      "type": "source",
      "label": "Source 2C",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2024/nov_p2/q2/annexure_2C.png"
      ]
    },
    {
      "type": "source",
      "label": "Source 2D",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/history/2024/nov_p2/q2/annexure_2D.png"
      ]
    }
  ]
};

// ─── Phase 3 — practice questions ────────────────────────────────────────────

const questions = [
  {
    "name": "Question 1",
    "question": "Using Sources 2A and 2D, calculate how many years passed between Sizwe Kondile's disappearance in 1981 and his symbolic burial at Freedom Park in 2016.",
    "metadata": [
      "Years: ",
      "[ ]"
    ],
    "answer": [
      "35",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "application",
    "unit": "coming_of_democracy",
    "topic": "trc_kondile_closure",
    "subtopic": "evidence_extraction",
    "skills": [
      "calculate_change_from_data"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 1,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2024,
    "paper": "nov_p2",
    "keyboard_type": "standard_math",
    "clues": "- Source 2A gives the year he disappeared; Source 2D gives the date of the burial.\n- Subtract the earlier year from the later one."
  },
  {
    "name": "Question 2",
    "question": "According to Source 2A, Sizwe Kondile was a founder member of which organisation?",
    "metadata": [
      "The Congress of South African Students (COSAS)",
      "The Port Elizabeth Black Civic Organisation (PEBCO)",
      "The South African Students' Organisation (SASO)",
      "The United Democratic Front (UDF)",
      ""
    ],
    "answer": [
      "The Congress of South African Students (COSAS)",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "interpretation",
    "unit": "coming_of_democracy",
    "topic": "trc_kondile_closure",
    "subtopic": "evidence_extraction",
    "skills": [
      "identify_evidence_from_a_source"
    ],
    "difficulty": 1,
    "exam_weight": 1,
    "xp": 10,
    "order": 2,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Look at the first sentence of Source 2A.\n- One of the other organisations is also named in the source, but in connection with someone else."
  },
  {
    "name": "Question 3",
    "question": "According to Source 2B, what reason did the three officers give for killing Kondile?",
    "metadata": [
      "He had suffered brain damage during interrogation and so could not safely be released",
      "He tried to escape from custody while he was being moved from Port Elizabeth to Komatipoort",
      "After agreeing to become an informer, he named a police agent, so they stopped trusting him",
      "He refused to give the police the names of the other members of his ANC cell",
      ""
    ],
    "answer": [
      "After agreeing to become an informer, he named a police agent, so they stopped trusting him",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "interpretation",
    "unit": "coming_of_democracy",
    "topic": "trc_kondile_closure",
    "subtopic": "evidence_extraction",
    "skills": [
      "identify_evidence_from_a_source"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 3,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Read the first paragraph of Source 2B carefully.\n- One option is a reason the officers denied, not the one they gave."
  },
  {
    "name": "Question 4",
    "question": "According to Sources 2C and 2D, which of these people took part in the 2016 ceremonies for Sizwe Kondile?",
    "metadata": [
      "Bantu Kondile, Sizwe's son",
      "Dirk Coetzee",
      "Vusi Pikoli",
      "Michael Masutha, Minister of Justice",
      "Colonel Gerrit Erasmus"
    ],
    "answer": [
      "Bantu Kondile, Sizwe's son",
      "Vusi Pikoli",
      "Michael Masutha, Minister of Justice",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "interpretation",
    "unit": "coming_of_democracy",
    "topic": "trc_kondile_closure",
    "subtopic": "evidence_extraction",
    "skills": [
      "identify_evidence_from_a_source"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 4,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Use the caption of Source 2C and the second paragraph of Source 2D.\n- Two names come from Source 2B and belong to the amnesty hearings, not the ceremonies."
  },
  {
    "name": "Question 5",
    "question": "Source 2D is a news report of a minister's speech at the symbolic burial. Which is a limitation of this source for a historian studying whether the family found closure?",
    "metadata": [
      "It was written in 1981, before anyone knew what had happened to Kondile",
      "It reports a government minister at a commemoration, so it may overstate the closure",
      "It is a private letter from Charity Kondile that was never published",
      "It is a police statement written to protect the officers who killed Kondile",
      ""
    ],
    "answer": [
      "It reports a government minister at a commemoration, so it may overstate the closure",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "coming_of_democracy",
    "topic": "trc_kondile_closure",
    "subtopic": "source_evaluation",
    "skills": [
      "evaluate_source_reliability"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "xp": 10,
    "order": 5,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Read the introduction above Source 2D: who is speaking, and at what kind of event.\n- Ask whose voice is missing from the article."
  },
  {
    "name": "Question 6",
    "question": "Match each person to their role in the Kondile story.",
    "metadata": [
      "A - Dirk Coetzee",
      "B - Imram Moosa",
      "C - Chris Hani",
      "D - Vusi Pikoli",
      "1 - Kondile's friend and cell member who spoke for the family",
      "2 - ANC leader whose car Kondile borrowed the day he disappeared",
      "3 - Security policeman who asked Mrs Kondile for forgiveness",
      "4 - Mrs Kondile's lawyer at the amnesty hearing"
    ],
    "answer": [
      "A-3",
      "B-4",
      "C-2",
      "D-1"
    ],
    "presentation": "match",
    "type": "interpretation",
    "unit": "coming_of_democracy",
    "topic": "trc_kondile_closure",
    "subtopic": "key_figures_and_events",
    "skills": [
      "identify_historical_event_or_term"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 6,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Each person appears in a different part of Sources 2A to 2D.\n- Ask which side of the amnesty hearing each person was on."
  },
  {
    "name": "Question 7",
    "question": "Arrange these events from Sources 2A to 2D in the order they happened.",
    "metadata": [
      "Police officers admit to Kondile's murder before the TRC",
      "Kondile's spirit is symbolically buried at Freedom Park",
      "Kondile and five others form an underground ANC cell",
      "The family performs a spiritual repatriation at Komatipoort",
      "Kondile and three cell members leave for Maseru, Lesotho"
    ],
    "answer": [
      "Kondile and five others form an underground ANC cell",
      "Kondile and three cell members leave for Maseru, Lesotho",
      "Police officers admit to Kondile's murder before the TRC",
      "The family performs a spiritual repatriation at Komatipoort",
      "Kondile's spirit is symbolically buried at Freedom Park"
    ],
    "presentation": "ordering",
    "type": "interpretation",
    "unit": "coming_of_democracy",
    "topic": "trc_kondile_closure",
    "subtopic": "historical_chronology",
    "skills": [
      "sequence_historical_events"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "xp": 10,
    "order": 7,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Source 2A gives the 1980 dates; the TRC worked in the late 1990s.\n- Source 2D says the Komatipoort ceremony was on the day before the Freedom Park burial."
  },
  {
    "name": "Question 8",
    "question": "In Sources 2C and 2D, what does a \"spiritual repatriation\" mean?",
    "metadata": [
      "Bringing an exile's body home from another country so that it can receive a state funeral",
      "A court order returning a victim's property to the family after a trial",
      "A TRC decision to grant amnesty after a perpetrator makes a full confession",
      "A ceremony that symbolically returns a person's spirit home when there is no body",
      ""
    ],
    "answer": [
      "A ceremony that symbolically returns a person's spirit home when there is no body",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "definition",
    "unit": "coming_of_democracy",
    "topic": "trc_kondile_closure",
    "subtopic": "historical_terminology",
    "skills": [
      "define_historical_term"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "xp": 10,
    "order": 8,
    "syllabus": "dbe",
    "subject": "history",
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Repatriation means returning someone home.\n- Source 2D explains why there could not be a real burial."
  },
  {
    "name": "Question 9",
    "question": "Which pieces of evidence suggest that the TRC process did NOT bring full closure to the Kondile family?",
    "metadata": [
      "Mrs Kondile said she could not forgive Coetzee (Source 2B)",
      "The officers admitted the murder at the amnesty hearing (Source 2B)",
      "Her lawyer said Coetzee should stand trial instead of seeking amnesty (Source 2B)",
      "Masutha said the ceremony gave the families closure (Source 2D)",
      "There were no remains, so only a symbolic burial was possible (Source 2D)"
    ],
    "answer": [
      "Mrs Kondile said she could not forgive Coetzee (Source 2B)",
      "Her lawyer said Coetzee should stand trial instead of seeking amnesty (Source 2B)",
      "There were no remains, so only a symbolic burial was possible (Source 2D)",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "coming_of_democracy",
    "topic": "trc_kondile_closure",
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
    "year": 2024,
    "paper": "nov_p2",
    "clues": "- Sort each piece of evidence: does it support closure, or show it was missing?\n- Two options are evidence for the other side of the argument."
  }
];

// ─── AI explanation (AMPM-CONTENT-AI-EXP) — one entry per REAL exam sub-question, against the memo ───

const aiExplanation = {
  sub_questions: [
  {
    "number": "2.1.1",
    "marks": 2,
    "clues": "- The date is in the first paragraph of Source 2A.",
    "approach": "- Find the sentence about the underground ANC cell.\n- Copy the time it gives.",
    "solution": "1. '… about July 1980'"
  },
  {
    "number": "2.1.2",
    "marks": 3,
    "clues": "- The cell members who left are named in brackets in the second paragraph.",
    "approach": "- Read the sentence about leaving in September 1980.\n- Name the three people listed with Kondile.",
    "solution": "1. '… Mr Vusumzi Pikoli …'\n2. '… Mr Thozi Majola …'\n3. '… Mr Phaki Ximiya'"
  },
  {
    "number": "2.1.3",
    "marks": 2,
    "clues": "- They were told to build the underground movement in the Eastern Cape.\n- Think about what the ANC in exile needed inside the country.",
    "approach": "- Link the training in Lesotho to work inside South Africa.\n- Explain the purpose of the missions.",
    "solution": "1. To carry out the ANC's mandate from exile and its underground activities in the Eastern Cape.\n2. To destabilise the apartheid government and strengthen internal resistance.\n3. Any one point earns 2 marks."
  },
  {
    "number": "2.1.4",
    "marks": 2,
    "clues": "- Think about loyalty and betrayal.\n- Use your own words.",
    "approach": "- Define the term in a full sentence.",
    "solution": "1. Someone who betrays an organisation or principle and joins the enemy or opposition."
  },
  {
    "number": "2.2.1",
    "marks": 3,
    "clues": "- The officers are named in the first sentence of Source 2B.",
    "approach": "- Read the opening sentence.\n- List the three officers.",
    "solution": "1. '… Van Rensburg …'\n2. '… Du Plessis …'\n3. '… Colonel Gerrit Erasmus'"
  },
  {
    "number": "2.2.2",
    "marks": 2,
    "clues": "- Testimony is evidence given by a witness.\n- Apply it to people applying for amnesty.",
    "approach": "- Define testimony.\n- Link it to the TRC's amnesty process.",
    "solution": "1. Spoken or written evidence given by perpetrators who applied for amnesty from the TRC."
  },
  {
    "number": "2.2.3",
    "marks": 2,
    "clues": "- Amnesty meant avoiding prosecution.\n- Ask what applying for amnesty suggests about Coetzee's motives.",
    "approach": "- Explain what the lawyer implied.\n- Link it to Coetzee's request for forgiveness.",
    "solution": "1. Coetzee was only interested in amnesty to avoid a jail sentence.\n2. He did not want to take responsibility for his atrocities, and cared little for the victims' families.\n3. Any one point earns 2 marks."
  },
  {
    "number": "2.2.4",
    "marks": 2,
    "clues": "- Read Mrs Kondile's own words at the end of Source 2B.\n- Think about what she still did not have.",
    "approach": "- Use her statement and your own knowledge of amnesty.\n- Give one developed reason.",
    "solution": "1. She believed Coetzee had not made full disclosure, and was not truly remorseful.\n2. She felt he did not deserve amnesty and wanted retributive justice.\n3. She still did not know fully what had happened to her son, so she had no closure.\n4. Any one point earns 2 marks."
  },
  {
    "number": "2.3.1",
    "marks": 2,
    "clues": "- Ask what the photograph records and where it was taken.",
    "approach": "- Explain what the moment meant to the family.",
    "solution": "1. It captured the moment the family held a symbolic memorial for Sizwe near where his remains were disposed of.\n2. It shows the family coming to terms with his death and finding closure, and reminds them of the spiritual repatriation.\n3. Any one point earns 2 marks."
  },
  {
    "number": "2.3.2",
    "marks": 4,
    "clues": "- Source 2A tells you about Pikoli's link to Kondile.\n- The caption says Pikoli spoke on behalf of the family.",
    "approach": "- Explain Pikoli's personal link to Kondile.\n- Explain his role at the ceremony.\n- Give two points.",
    "solution": "1. He was Kondile's friend, comrade and fellow cell member, and left with him for Maseru in 1980.\n2. He wrote a book about Sizwe Kondile's life.\n3. He came to support the family, to find closure himself, and to act as their spokesperson.\n4. Any two points earn 4 marks."
  },
  {
    "number": "2.3.3",
    "marks": 2,
    "clues": "- Take a stance: yes or no.\n- Think about what a symbolic burial can and cannot replace.",
    "approach": "- State your view.\n- Support it with one developed reason.",
    "solution": "Yes:\n1. The repatriation allowed family and friends to bury his spiritual remains, heal and find peace.\nNo:\n2. There were no remains to bury; the ceremony was only symbolic, came decades later and may have opened old wounds.\n3. Any one reason for a clear stance earns 2 marks."
  },
  {
    "number": "2.4.1",
    "marks": 4,
    "clues": "- The ways he died are listed in the first line of Source 2D.\n- Quote four.",
    "approach": "- Read the opening sentence of the article.\n- List four separate words.",
    "solution": "1. '… poisoned …'\n2. '… tortured …'\n3. '… shot …'\n4. '… burnt …'\n5. '… bombed …' is also accepted.\n6. Any four earn 4 marks."
  },
  {
    "number": "2.4.2",
    "marks": 2,
    "clues": "- Masutha says there should have been real burials.\n- Think about why a family needs a burial.",
    "approach": "- Explain what the ceremony gave the family.",
    "solution": "1. To reassure the family that Sizwe's remains were symbolically brought home for closure, healing and a decent burial.\n2. To acknowledge the role he played as a political activist.\n3. Any one point earns 2 marks."
  },
  {
    "number": "2.4.3",
    "marks": 2,
    "clues": "- Masutha speaks to people across political, religious and racial divides.\n- Think about what the nation should learn from the past.",
    "approach": "- Explain what \"reflection\" means for South Africa here.",
    "solution": "1. To evaluate whether past atrocities had been revealed and dealt with, and whether the TRC's mandate was achieved.\n2. To reflect whether justice had been done, and that such human rights violations must not be repeated.\n3. To honour those who made sacrifices like Kondile.\n4. Any one point earns 2 marks."
  },
  {
    "number": "2.4.4",
    "marks": 4,
    "clues": "- Look at the source's origin: publisher, speaker, place and date.",
    "approach": "- Use the provenance to judge reliability.\n- Check whether other sources corroborate it.\n- Give two reasons.",
    "solution": "1. It comes from a reputable media source, Independent Online (IOL).\n2. It quotes first-hand from the speech of Michael Masutha, Minister of Justice and Correctional Services.\n3. The speech was given at Freedom Park on the day of the symbolic burial, 1 July 2016.\n4. Kondile's death is corroborated by Source 2B.\n5. Any two reasons earn 4 marks."
  },
  {
    "number": "2.5",
    "marks": 4,
    "clues": "- The question asks how the sources DIFFER.\n- Compare the family's feelings in each source.",
    "approach": "- Take a point from Source 2B.\n- Contrast it with Source 2D.\n- Repeat for a second difference.",
    "solution": "1. In Source 2B the family refuses Coetzee's request for forgiveness, while in Source 2D they attend a spiritual repatriation and burial in the hope of healing.\n2. Source 2B leaves the family without closure, while Source 2D offers closure through rituals.\n3. In Source 2B Mrs Kondile rejects the forgiveness of Mandela and Tutu, while in Source 2D the family accepts the minister's support.\n4. In Source 2B Sizwe was \"buried by barbarians\", while in Source 2D his loved ones performed the burial.\n5. Any two differences earn 4 marks."
  },
  {
    "number": "2.6",
    "marks": 8,
    "clues": "- Decide your stance first: did the TRC bring closure?\n- Collect evidence from each source, for and against.",
    "approach": "- Open with a clear stance.\n- Use evidence from the sources, naming each.\n- Add own knowledge, e.g. that there were no remains to bury.\n- End with a concluding sentence.",
    "solution": "Yes:\n1. Perpetrators applied for amnesty, and three SAP officers revealed they killed Kondile (Source 2B).\n2. The TRC revealed new information that led to the spiritual repatriation and symbolic burial (own knowledge, Sources 2C and 2D).\nNo:\n3. Kondile was abducted and murdered, and police lies branded him a traitor (Source 2A).\n4. Mrs Kondile rejected amnesty and forgiveness; her lawyer said Coetzee should stand trial (Source 2B).\n5. There were no remains, so the burial was only symbolic and came decades later (Sources 2C and 2D, own knowledge).\n6. The paragraph is marked on a 3-level rubric: 0–2, 3–5 or 6–8 marks."
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
