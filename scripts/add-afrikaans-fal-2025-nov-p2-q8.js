#!/usr/bin/env node
/**
 * DBE Afrikaans FAL P2 — November 2025 — Vraag 4.11–4.20: Lien se Lankstaanskoene — Teks H
 * Practice questions are fresh (DESIGN-UNI-01), written in Afrikaans, same theme/skill as the exam item (LANG-EX-01/02).
 * aiExplanation is one entry per REAL printed sub-question with its real marks, derived from the memo in own words (AIEXP-08).
 * Every fitb declares keyboard_type 'text' (LANG-KB-01). Typed answers avoid á í ó ú à â (not on the keyboard); required
 * diacritics (ê ë é è ô ö û ü î ï ä) are fine and significant (LANG-KB-02).
 *
 * BASIS per practice question — P printed in the extract/poem tab, M printed in the memo, X taken from the other half of the same exam question (fresh angle), L language-paper skill, C CAPS:
 *   Q1: P: Teks H l.10
 *   Q2: P: Teks H l.5-6
 *   Q3: P: Teks H l.1-16
 *   Q4: P: Teks H l.7-9
 *   Q5: P: Teks H
 *
 *   node tools/validate-questions.js --script scripts/add-afrikaans-fal-2025-nov-p2-q8.js --curriculum temp/curriculum-vocab-afrikaans-fal.json
 *   node scripts/add-afrikaans-fal-2025-nov-p2-q8.js --dry-run
 *   node scripts/add-afrikaans-fal-2025-nov-p2-q8.js
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
  "name": "Vraag 4: Lien se Lankstaanskoene (4.11–4.20)",
  "syllabus": "dbe",
  "subject": "afrikaans_fal",
  "year": 2025,
  "paper": "nov_p2",
  "order": 8,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "character_analysis",
    "contextual_questions",
    "literary_analysis"
  ],
  "text_key": "lien_se_lankstaanskoene",
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q8/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q8/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q8/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q8/memo_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q8/memo_3.png"
  ],
  "exam_question_marks": 17,
  "supplementary_materials": [
    {
      "type": "annexure",
      "label": "Teks H",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q8/annexure_teks_h_1.png"
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
    "text_key": "lien_se_lankstaanskoene",
    "order": 1,
    "context_text": null,
    "question": "Watter stylfiguur kom voor in: \"asof sy pas van Mars geland het\"?",
    "metadata": [
      "klanknabootsing",
      "personifikasie",
      "ironie",
      "vergelyking",
      ""
    ],
    "answer": [
      "vergelyking",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "roman",
    "topic": "toon_en_stylmiddele",
    "subtopic": "identifiseer_stylfiguur",
    "skills": [
      "afrikaans_fal_identifiseer_stylfiguur"
    ],
    "difficulty": 2,
    "exam_weight": 3,
    "clues": "- Let op die woord \"asof\".\n- Twee dinge word met mekaar vergelyk."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Vraag 2",
    "text_key": "lien_se_lankstaanskoene",
    "order": 2,
    "context_text": null,
    "question": "Wat beteken: \"Dié man het nie tyd vir warra-warra nie\"?",
    "metadata": [
      "Hy het baie tyd en wil graag lank en gemaklik met haar gesels.",
      "Hy wil graag 'n lang storie oor haar vakansie en familie hoor.",
      "Hy wil nie sinlose praatjies hoor nie en wil kortliks weet wat sy wil hê.",
      "Hy is baie jammer vir haar en wil haar dadelik met geld help.",
      ""
    ],
    "answer": [
      "Hy wil nie sinlose praatjies hoor nie en wil kortliks weet wat sy wil hê.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "roman",
    "topic": "toon_en_stylmiddele",
    "subtopic": "betekenis_van_'n_aanhaling",
    "skills": [
      "afrikaans_fal_verklaar_betekenis_in_konteks"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Dink aan hoe die man op sy horlosie kyk.\n- Lien besef sy moet gou praat."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Vraag 3",
    "text_key": "lien_se_lankstaanskoene",
    "order": 3,
    "context_text": null,
    "question": "Rangskik die gebeure in die volgorde waarin dit in die uittreksel voorkom.",
    "metadata": [
      "Lien sê hulle gaan vir hom 'n fluitjie koop.",
      "Lien sê Tibbey wil weer daar kom bly en werk.",
      "Die man sê dis nie die Welsyn dié nie.",
      "Lien sê Tibbey se bene is af.",
      ""
    ],
    "answer": [
      "Lien sê Tibbey wil weer daar kom bly en werk.",
      "Lien sê Tibbey se bene is af.",
      "Lien sê hulle gaan vir hom 'n fluitjie koop.",
      "Die man sê dis nie die Welsyn dié nie.",
      ""
    ],
    "presentation": "ordering",
    "type": "application",
    "unit": "roman",
    "topic": "intrige_en_gebeure",
    "subtopic": "volgorde_in_die_uittreksel",
    "skills": [
      "afrikaans_fal_rangskik_gebeure"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Volg die gesprek reël vir reël.\n- Die man se laaste sin kom heel aan die einde."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Vraag 4",
    "text_key": "lien_se_lankstaanskoene",
    "order": 4,
    "context_text": null,
    "question": "Watter stelling oor die uittreksel is ONWAAR?",
    "metadata": [
      "Tibbey sal die karre naweke oppas.",
      "Tibbey sal in die week op dieselfde plek werk.",
      "Tibbey het net 'n dak oor sy kop nodig.",
      "Hulle gaan vir Tibbey 'n fluitjie koop.",
      ""
    ],
    "answer": [
      "Tibbey sal in die week op dieselfde plek werk.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "roman",
    "topic": "intrige_en_gebeure",
    "subtopic": "onwaar_stelling",
    "skills": [
      "afrikaans_fal_onderskei_waar_van_onwaar"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Wat sê Lien oor waar Tibbey in die week werk?\n- Toets elke stelling teen die uittreksel."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Vraag 5",
    "text_key": "lien_se_lankstaanskoene",
    "order": 5,
    "context_text": null,
    "question": "Kies TWEE temas wat in die uittreksel na vore kom.",
    "metadata": [
      "Vriendskap en omgee vir iemand in nood",
      "Die voordele van duur motors",
      "Om vir ander op te staan",
      "Hoe om 'n toneelstuk te skryf",
      ""
    ],
    "answer": [
      "Vriendskap en omgee vir iemand in nood",
      "Om vir ander op te staan",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "roman",
    "topic": "tema_en_boodskap",
    "subtopic": "temas_in_die_uittreksel",
    "skills": [
      "afrikaans_fal_identifiseer_temas"
    ],
    "difficulty": 2,
    "exam_weight": 3,
    "clues": "- Waarom gaan Lien met die man praat?\n- Twee opsies pas by die uittreksel."
  }
];

// ─── AI explanation — one entry per REAL printed sub-question, real marks (AIEXP-08) ───

const aiExplanation = {
  "sub_questions": [
    {
      "number": "4.11",
      "marks": 4,
      "clues": "- Dink aan die volgorde van die gebeure in die roman.",
      "approach": "- Rangskik die vier gebeure",
      "solution": "1. Lien het die jong dominee vir die eerste keer ontmoet.\n2. Lien het haar verjaardag saam met vriende geniet.\n3. Sproet het Lien na sy woonstel geneem.\n4. Dirkie het gebel om uit te vind in watter hospitaal Tibbey was."
    },
    {
      "number": "4.12.1",
      "marks": 1,
      "clues": "- Vir wie praat Lien?",
      "approach": "- Soek na wie \"hy\" verwys",
      "solution": "1. Na Tibbey."
    },
    {
      "number": "4.12.2",
      "marks": 1,
      "clues": "- Wat het met Tibbey gebeur?",
      "approach": "- Verduidelik die aanhaling",
      "solution": "1. Tibbey het sy bene verloor na 'n ongeluk en kan nie meer loop nie."
    },
    {
      "number": "4.13",
      "marks": 1,
      "clues": "- Let op hoe die man oor die rystoel praat.",
      "approach": "- Toets elke opsie",
      "solution": "1. C (sarkasties)."
    },
    {
      "number": "4.14",
      "marks": 1,
      "clues": "- Wie het Lien met die karretjie gehelp?",
      "approach": "- Gee 'n feit wat die stelling weerlê",
      "solution": "1. Hein het Lien gehelp om die karretjie te bou."
    },
    {
      "number": "4.15.1",
      "marks": 1,
      "clues": "- Hoe voel Meneer Van Biljon?",
      "approach": "- Kies die opsie tussen hakies",
      "solution": "1. weet nie wat die regte ding is om te doen nie."
    },
    {
      "number": "4.15.2",
      "marks": 1,
      "clues": "- Wat bekommer hom?",
      "approach": "- Motiveer jou antwoord",
      "solution": "1. Hy voel jammer vir Tibbey, maar is bang Tibbey kan nie die werk doen nie."
    },
    {
      "number": "4.16.1",
      "marks": 1,
      "clues": "- Wat probeer Lien doen?",
      "approach": "- Kies die opsie tussen hakies",
      "solution": "1. oorreed om Tibbey se situasie en goeie kwaliteite te verstaan."
    },
    {
      "number": "4.16.2",
      "marks": 1,
      "clues": "- Hoe goed ken Lien vir Tibbey?",
      "approach": "- Gee een rede",
      "solution": "1. Lien ken Tibbey en weet hy sal die beste van die kans maak."
    },
    {
      "number": "4.17",
      "marks": 1,
      "clues": "- Wat het die samewerking vir Lien en Hein se verhouding beteken?",
      "approach": "- Soek die direkte gevolg",
      "solution": "1. Daar was 'n meer vaste verhouding en hulle het goeie vriende geword."
    },
    {
      "number": "4.18",
      "marks": 1,
      "clues": "- Wat het Roos met Johnny se hoek gedoen?",
      "approach": "- Gee een rede",
      "solution": "1. Tibbey sou nie gou weer terugkom nie en Roos was bevooroordeel omdat Johnny drink."
    },
    {
      "number": "4.19",
      "marks": 2,
      "clues": "- Dink aan wat Tibbey se vriende vir hom gedoen het.",
      "approach": "- Soek twee positiewe gevolge",
      "solution": "1. Danksy die karretjie kon hy weer sy werk doen.\n2. Sy vriende se ondersteuning het gekeer dat hy in depressie verval."
    },
    {
      "number": "4.20",
      "marks": 1,
      "clues": "- Waarop fokus Lien aan die einde?",
      "approach": "- Verduidelik hoekom die tema pas",
      "solution": "1. Lien besluit om haar passie te volg en haar ma en pa te vergewe."
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
