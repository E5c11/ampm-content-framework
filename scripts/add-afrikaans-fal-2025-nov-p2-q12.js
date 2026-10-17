#!/usr/bin/env node
/**
 * DBE Afrikaans FAL P2 — November 2025 — Vraag 6.10–6.20: Paljas — Teks L
 * Practice questions are fresh (DESIGN-UNI-01), written in Afrikaans, same theme/skill as the exam item (LANG-EX-01/02).
 * aiExplanation is one entry per REAL printed sub-question with its real marks, derived from the memo in own words (AIEXP-08).
 * Every fitb declares keyboard_type 'text' (LANG-KB-01). Typed answers avoid á í ó ú à â (not on the keyboard); required
 * diacritics (ê ë é è ô ö û ü î ï ä) are fine and significant (LANG-KB-02).
 *
 * BASIS per practice question — P printed in the extract/poem tab, M printed in the memo, X taken from the other half of the same exam question (fresh angle), L language-paper skill, C CAPS:
 *   Q1: P: Teks L l.13-15
 *   Q2: P: Teks L l.2
 *   Q3: P: Teks L
 *   Q4: P: Teks L
 *   Q5: P: Teks L
 *
 *   node tools/validate-questions.js --script scripts/add-afrikaans-fal-2025-nov-p2-q12.js --curriculum temp/curriculum-vocab-afrikaans-fal.json
 *   node scripts/add-afrikaans-fal-2025-nov-p2-q12.js --dry-run
 *   node scripts/add-afrikaans-fal-2025-nov-p2-q12.js
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
  "name": "Vraag 6: Paljas (6.10–6.20)",
  "syllabus": "dbe",
  "subject": "afrikaans_fal",
  "year": 2025,
  "paper": "nov_p2",
  "order": 12,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "dramatic_techniques",
    "character_analysis",
    "contextual_questions"
  ],
  "text_key": "paljas",
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q12/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q12/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q12/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q12/memo_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q12/memo_3.png"
  ],
  "exam_question_marks": 17,
  "supplementary_materials": [
    {
      "type": "annexure",
      "label": "Teks L",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q12/annexure_teks_l_1.png"
      ]
    }
  ]
};

// ─── Practice questions ──────────────────────────────────────────────────────

const questions = [
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Vraag 1",
    "text_key": "paljas",
    "order": 1,
    "context_text": null,
    "question": "Watter stylfiguur kom voor in Emma se woorde: \"Ek moet my loop mooimaak? Om te wat?\"?",
    "metadata": [
      "vergelyking",
      "retoriese vraag",
      "personifikasie",
      "hiperbool",
      ""
    ],
    "answer": [
      "retoriese vraag",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "drama",
    "topic": "toon_en_stylmiddele",
    "subtopic": "identifiseer_stylfiguur",
    "skills": [
      "afrikaans_fal_identifiseer_stylfiguur"
    ],
    "difficulty": 2,
    "exam_weight": 3,
    "clues": "- Emma verwag nie werklik 'n antwoord nie.\n- Sy gebruik 'n vraag om haar woede te wys."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Vraag 2",
    "text_key": "paljas",
    "order": 2,
    "context_text": null,
    "question": "Wat beteken: \"Dis duidelik almal is nog stom van skok\"?",
    "metadata": [
      "Almal is so moeg dat hulle wil gaan slaap.",
      "Almal is so bly dat hulle nie kan ophou lag nie.",
      "Almal is so geskok dat niemand kan praat nie.",
      "Almal is so kwaad dat hulle begin baklei.",
      ""
    ],
    "answer": [
      "Almal is so geskok dat niemand kan praat nie.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "drama",
    "topic": "toon_en_stylmiddele",
    "subtopic": "betekenis_van_'n_aanhaling",
    "skills": [
      "afrikaans_fal_verklaar_betekenis_in_konteks"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Wat doen jy as jy so geskok is dat jy niks kan sê nie?\n- Dink aan wat net by die Volstruisdans gebeur het."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Vraag 3",
    "text_key": "paljas",
    "order": 3,
    "context_text": null,
    "question": "Rangskik die gebeure in die volgorde waarin dit in die uittreksel voorkom.",
    "metadata": [
      "Emma vra hoekom hulle op die stasietjie bly.",
      "Katrien sê sy gaan slaap.",
      "Emma word ontsteld oor die opdrag om haar mooi te maak.",
      "Hendrik sê Nollie moet 'n plaat opsit.",
      ""
    ],
    "answer": [
      "Katrien sê sy gaan slaap.",
      "Hendrik sê Nollie moet 'n plaat opsit.",
      "Emma word ontsteld oor die opdrag om haar mooi te maak.",
      "Emma vra hoekom hulle op die stasietjie bly.",
      ""
    ],
    "presentation": "ordering",
    "type": "application",
    "unit": "drama",
    "topic": "intrige_en_gebeure",
    "subtopic": "volgorde_in_die_uittreksel",
    "skills": [
      "afrikaans_fal_rangskik_gebeure"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Volg die gesprek reël vir reël.\n- Emma se vraag oor die stasietjie kom aan die einde."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Vraag 4",
    "text_key": "paljas",
    "order": 4,
    "context_text": null,
    "question": "Watter stelling oor die uittreksel is ONWAAR?",
    "metadata": [
      "Katrien het gesê sy gaan slaap.",
      "Katrien het gesê sy wil die aand saam dans.",
      "Hendrik het gesê Nollie moet 'n plaat opsit.",
      "Emma het gevra waarom hulle op die stasietjie bly.",
      ""
    ],
    "answer": [
      "Katrien het gesê sy wil die aand saam dans.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "drama",
    "topic": "intrige_en_gebeure",
    "subtopic": "onwaar_stelling",
    "skills": [
      "afrikaans_fal_onderskei_waar_van_onwaar"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Wat wil Katrien aan die begin van die uittreksel doen?\n- Toets elke stelling teen die uittreksel."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Vraag 5",
    "text_key": "paljas",
    "order": 5,
    "context_text": null,
    "question": "Kies TWEE temas wat in die uittreksel na vore kom.",
    "metadata": [
      "Gesinskonflik en kommunikasie",
      "Sportprestasies by die skool en die dorp se klub",
      "Vooroordeel van die dorpsmense",
      "Hoe om 'n boerdery te bestuur en diere te versorg",
      ""
    ],
    "answer": [
      "Gesinskonflik en kommunikasie",
      "Vooroordeel van die dorpsmense",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "drama",
    "topic": "tema_en_boodskap",
    "subtopic": "temas_in_die_uittreksel",
    "skills": [
      "afrikaans_fal_identifiseer_temas"
    ],
    "difficulty": 2,
    "exam_weight": 3,
    "clues": "- Waaroor baklei Emma en Hendrik, en hoe word die gesin behandel?\n- Twee opsies pas by die uittreksel."
  }
];

// ─── AI explanation — one entry per REAL printed sub-question, real marks (AIEXP-08) ───

const aiExplanation = {
  "sub_questions": [
    {
      "number": "6.10",
      "marks": 4,
      "clues": "- Dink aan die volgorde van die gebeure in die drama.",
      "approach": "- Rangskik die vier gebeure",
      "solution": "1. Emma het Willem op die stoep gekry waar hy gelê en slaap het.\n2. Willem het die nar vermaak en probeer om hom te laat lag.\n3. Emma het gesê die gesin moet praat oor dinge wat belangrik is.\n4. Die dorpsmense het vir die McDonalds om verskoning gaan vra."
    },
    {
      "number": "6.11.1",
      "marks": 1,
      "clues": "- Hoe voel Katrien?",
      "approach": "- Kies die opsie tussen hakies",
      "solution": "1. sy het nie geweet wat hulle nog moes doen om aanvaar te word nie."
    },
    {
      "number": "6.11.2",
      "marks": 1,
      "clues": "- Wat doen Katrien?",
      "approach": "- Motiveer jou antwoord op 6.11.1",
      "solution": "1. Katrien wou nie verder aan die aand deelneem nie en het haar onttrek."
    },
    {
      "number": "6.12",
      "marks": 1,
      "clues": "- Wat sê Hendrik oor Emma se gedrag?",
      "approach": "- Toets elke opsie",
      "solution": "1. C (van die probleem weghardloop)."
    },
    {
      "number": "6.13",
      "marks": 1,
      "clues": "- Wat doen Hendrik as pa?",
      "approach": "- Gee een rede",
      "solution": "1. Hendrik is die pa wat vir sy gesin moes opstaan en wou dinge beter maak."
    },
    {
      "number": "6.14.1",
      "marks": 1,
      "clues": "- Hoe behandel die dorpsmense die McDonalds?",
      "approach": "- Kies die opsie tussen hakies",
      "solution": "1. bevooroordeeld is teenoor mense wat anders as hulle is."
    },
    {
      "number": "6.14.2",
      "marks": 1,
      "clues": "- Wat het die dorpsmense gedink?",
      "approach": "- Gee een rede",
      "solution": "1. Die dorpsmense het gedink die McDonalds was besig met duiwelsgoed en het die stories geglo."
    },
    {
      "number": "6.15",
      "marks": 1,
      "clues": "- Wie was eerste om verskoning te vra?",
      "approach": "- Gee 'n feit wat die stelling weerlê",
      "solution": "1. Sakkie du Toit; Jan Mol het nooit om verskoning gevra nie."
    },
    {
      "number": "6.16",
      "marks": 1,
      "clues": "- Wat het by die Volstruisdans met Nollie en Emma gebeur?",
      "approach": "- Soek die direkte gevolg",
      "solution": "1. Emma het Nollie toegelaat om by haar te sit en aan haar te vat."
    },
    {
      "number": "6.17",
      "marks": 1,
      "clues": "- Let op hoe Emma praat.",
      "approach": "- Soek een aanduiding van Emma se woede",
      "solution": "1. Emma stel retoriese vrae en herhaal dinge wat Hendrik sê."
    },
    {
      "number": "6.18",
      "marks": 1,
      "clues": "- Wat gebeur nadat Emma praat?",
      "approach": "- Gee 'n rede waarom jy goed voel",
      "solution": "1. Die gesin het met mekaar begin praat en na mekaar geluister."
    },
    {
      "number": "6.19",
      "marks": 2,
      "clues": "- Wat het Willem by Manuel geleer?",
      "approach": "- Soek twee positiewe gevolge",
      "solution": "1. Willem kon sy toertjies vir die partytjiegangers wys.\n2. Hy kon sy gesin vermaak of weer begin praat."
    },
    {
      "number": "6.20",
      "marks": 1,
      "clues": "- Wat gebeur aan die einde met Hendrik en Katrien?",
      "approach": "- Verduidelik hoekom die tema pas",
      "solution": "1. Hendrik en Katrien het saam gedans en gelag; Willem het hulle liefde gesien."
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
