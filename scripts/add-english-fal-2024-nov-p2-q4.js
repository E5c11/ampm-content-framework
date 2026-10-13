#!/usr/bin/env node
/**
 * DBE English FAL P2 — November 2024 — Strange Case of Dr Jekyll and Mr Hyde — Extract D ('Dr Lanyon's Narrative'). 2.2.1–2.2.8, 17 marks.
 * Practice questions are fresh (DESIGN-UNI-01) and follow the shared rules: context_text null for literature (SETWORK-LES-05),
 * fresh targets, conventions-based for writing (LANG-WR-03); aiExplanation is one entry per REAL printed sub-question with its
 * real marks, derived from the memo in own words (AIEXP-08). Every fitb declares keyboard_type 'text' (LANG-KB-01).
 * Text key: strange_case_of_dr_jekyll_and_mr_hyde.
 *
 * BASIS per practice question — BK book knowledge (verify against the text), P printed in the paper/poem, M memo,
 * PT vocabulary/title, C CAPS, P1 language-paper skill:
 *   Q1: BK: the potion transforms Jekyll into Hyde (2024 memo 2.2.5).
 *   Q2: BK: Dr Lanyon dies after witnessing the transformation (2025 Q1 practice and chapter title).
 *   Q3: P/BK: 'Dr Lanyon's Narrative' is printed in the paper; Jekyll's Full Statement is the final chapter.
 *   Q4: P/BK: order follows the letter and Lanyon's narrative.
 *   Q5: P: the extract says 'I made sure my colleague was insane'.
 *
 *   node tools/validate-questions.js --script scripts/add-english-fal-2024-nov-p2-q4.js --curriculum temp/curriculum-vocab-english-fal.json
 *   node scripts/add-english-fal-2024-nov-p2-q4.js --dry-run
 *   node scripts/add-english-fal-2024-nov-p2-q4.js
 */

'use strict';

const { getPool, closePool } = require('../tools/lib/postgres');
const { upsertRow } = require('../tools/lib/upsert');
const { buildContentRows, referenceIdsUsed } = require('../tools/lib/content-rows');

const DRY_RUN = process.argv.includes('--dry-run');
const ENV = process.argv.includes('--env')
  ? process.argv[process.argv.indexOf('--env') + 1]
  : 'dev';

// ─── Lesson document ─────────────────────────────────────────────────────────

const video = {
  "name": "Question 2.2: Strange Case of Dr Jekyll and Mr Hyde",
  "syllabus": "dbe",
  "subject": "english_fal",
  "year": 2024,
  "paper": "nov_p2",
  "order": 4,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "literary_essay",
    "thematic_analysis",
    "irony"
  ],
  "text_key": "strange_case_of_dr_jekyll_and_mr_hyde",
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p2/q4/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p2/q4/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p2/q4/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p2/q4/memo_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p2/q4/memo_3.png"
  ],
  "exam_question_marks": 17,
  "supplementary_materials": [
    {
      "type": "annexure",
      "label": "Extract D",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/english_fal/2024/nov_p2/q4/annexure_extract_d_1.png"
      ]
    }
  ]
};

// ─── Practice questions ──────────────────────────────────────────────────────

const questions = [
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2024,
    "paper": "nov_p2",
    "name": "Question 1",
    "text_key": "strange_case_of_dr_jekyll_and_mr_hyde",
    "order": 1,
    "context_text": null,
    "question": "What does Dr Jekyll's mixture do to him?",
    "metadata": [
      "It changes him into Mr Hyde.",
      "It makes him invisible.",
      "It makes him forget his work.",
      "It cures his friends' illnesses.",
      ""
    ],
    "answer": [
      "It changes him into Mr Hyde.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "novel",
    "topic": "plot_structure",
    "subtopic": "how_the_truth_is_revealed",
    "skills": [
      "english_fal_recall_key_events"
    ],
    "difficulty": 1,
    "exam_weight": 1,
    "clues": "- Think about the experiment at the heart of the novel.\n- Hyde appears when Jekyll drinks it."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2024,
    "paper": "nov_p2",
    "name": "Question 2",
    "text_key": "strange_case_of_dr_jekyll_and_mr_hyde",
    "order": 2,
    "context_text": null,
    "question": "Which doctor dies after seeing Hyde's transformation? Write the surname.",
    "metadata": [
      "Name:",
      "[ ]"
    ],
    "answer": [
      "Lanyon",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "definition",
    "unit": "novel",
    "topic": "plot_structure",
    "subtopic": "key_events",
    "skills": [
      "english_fal_recall_key_events"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- He is one of Jekyll's oldest friends.\n- Write one name.",
    "keyboard_type": "text"
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2024,
    "paper": "nov_p2",
    "name": "Question 3",
    "text_key": "strange_case_of_dr_jekyll_and_mr_hyde",
    "order": 3,
    "context_text": null,
    "question": "Select the TWO documents that reveal the truth about Jekyll and Hyde.",
    "metadata": [
      "Dr Lanyon's Narrative",
      "Mr Utterson's will",
      "Henry Jekyll's Full Statement of the Case",
      "Poole's diary",
      "Mr Enfield's letter"
    ],
    "answer": [
      "Dr Lanyon's Narrative",
      "Henry Jekyll's Full Statement of the Case",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "novel",
    "topic": "plot_structure",
    "subtopic": "how_the_truth_is_revealed",
    "skills": [
      "english_fal_identify_stated_reasons"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "clues": "- Both are written by the men who know the secret.\n- Reject documents that do not exist in the novel."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2024,
    "paper": "nov_p2",
    "name": "Question 4",
    "text_key": "strange_case_of_dr_jekyll_and_mr_hyde",
    "order": 4,
    "context_text": null,
    "question": "Arrange these events from Lanyon's narrative in the order in which they happen.",
    "metadata": [
      "A messenger arrives at midnight",
      "The messenger drinks the mixture",
      "Jekyll sends a desperate letter to Lanyon",
      "Lanyon collects the drawer from the laboratory",
      ""
    ],
    "answer": [
      "Jekyll sends a desperate letter to Lanyon",
      "Lanyon collects the drawer from the laboratory",
      "A messenger arrives at midnight",
      "The messenger drinks the mixture",
      ""
    ],
    "presentation": "ordering",
    "type": "application",
    "unit": "novel",
    "topic": "plot_structure",
    "subtopic": "sequence_of_events",
    "skills": [
      "english_fal_order_events"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "clues": "- Lanyon cannot collect the drawer before he is asked.\n- The transformation happens last."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "english_fal",
    "year": 2024,
    "paper": "nov_p2",
    "name": "Question 5",
    "text_key": "strange_case_of_dr_jekyll_and_mr_hyde",
    "order": 5,
    "context_text": null,
    "question": "Whose point of view tells the events in 'Dr Lanyon's Narrative'?",
    "metadata": [
      "Mr Utterson, in the third person",
      "Mr Enfield, in the first person",
      "Dr Lanyon, in the first person",
      "Poole, in the third person",
      ""
    ],
    "answer": [
      "Dr Lanyon, in the first person",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "novel",
    "topic": "figurative_language",
    "subtopic": "point_of_view",
    "skills": [
      "english_fal_identify_narrative_voice"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Look at the pronoun in 'I made sure my colleague was insane'.\n- The writer is part of the story."
  }
];

// ─── AI explanation — one entry per REAL printed sub-question, real marks (AIEXP-08) ───

const aiExplanation = {
  "sub_questions": [
    {
      "number": "2.2.1",
      "marks": 2,
      "clues": "- Think about what Utterson is reading and where.",
      "approach": "- Say what is happening\n- Give the place",
      "solution": "1. It takes place when Utterson reads Lanyon's letter.\n2. He is at home or in his office."
    },
    {
      "number": "2.2.2",
      "marks": 1,
      "clues": "- Look at where Jekyll says he is hiding.",
      "approach": "- Name the place",
      "solution": "1. It is the hotel or inn in Portland Street where Jekyll hides."
    },
    {
      "number": "2.2.3",
      "marks": 2,
      "clues": "- Think about how someone writes when they need rescue.",
      "approach": "- Name the tone\n- Say why",
      "solution": "1. The tone is pleading or desperate.\n2. Jekyll urgently needs Lanyon to rescue him."
    },
    {
      "number": "2.2.4",
      "marks": 2,
      "clues": "- Think about their friendship and Lanyon's profession.",
      "approach": "- Give two reasons",
      "solution": "1. Lanyon is one of Jekyll's oldest friends.\n2. Jekyll trusts him with his life; as a scientist he will recognise the drawer's contents (any two)."
    },
    {
      "number": "2.2.5",
      "marks": 2,
      "clues": "- Irony is a gap between what is said and the truth.",
      "approach": "- State what Jekyll says\n- State the truth",
      "solution": "1. Jekyll says a messenger will come.\n2. In fact Jekyll, in Hyde's body, will collect the drawer himself."
    },
    {
      "number": "2.2.6",
      "marks": 2,
      "clues": "- Look at how Lanyon decides to help.",
      "approach": "- Name a trait\n- Support it",
      "solution": "1. Lanyon is dutiful, helping despite the strange request.\n2. Or he is rational and cautious: he does not dismiss it as insane but investigates."
    },
    {
      "number": "2.2.7",
      "marks": 3,
      "clues": "- Think about who is in conflict in the novel.",
      "approach": "- Define conflict\n- Give examples",
      "solution": "1. Lanyon and Jekyll clash over science.\n2. Jekyll is in conflict with Hyde when he cannot control him.\n3. Utterson and Hyde clash when Utterson confronts him."
    },
    {
      "number": "2.2.8",
      "marks": 3,
      "clues": "- Decide whether Jekyll enjoys being Hyde, then use events.",
      "approach": "- State your view\n- Give evidence",
      "solution": "1. Yes: as Hyde he indulges in immoral acts, keeps up his experiments and ignores the wish to stop.\n2. No: he shows remorse after the Carew murder, tries to stop drinking the potion and admits Hyde is monstrous."
    }
  ],
  "model": "claude-sonnet-5-5",
  "generated_at": Date.now(),
  "version": 2,
  "reviewed": false,
  "input_tokens": 0,
  "output_tokens": 0,
  "avg_rating": null,
  "rating_count": null
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
    console.error(
      '\n   curriculum_nodes / skills → node tools/create-curriculum-node.js | create-skill.js' +
      '\n   tags → node tools/create-tag.js',
    );
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
}

// Only run when invoked directly — so validate-questions.js (and anything else) can load
// this file for its data blocks without opening a DB connection or writing anything.
if (require.main === module) {
  upload()
    .catch((err) => {
      console.error('\n❌ Upload failed:', err.message);
      process.exitCode = 1;
    })
    .finally(closePool);
}
