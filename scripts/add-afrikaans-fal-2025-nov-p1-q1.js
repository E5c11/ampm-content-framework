#!/usr/bin/env node
/**
 * DBE Afrikaans FAL P1 — November 2025 — Vraag 1 (1.1–1.16): Leesbegrip — Teks A artikel
 * Practice questions are fresh (DESIGN-UNI-01), written in Afrikaans, same theme/skill as the exam item (LANG-EX-01/02).
 * aiExplanation is one entry per REAL printed sub-question with its real marks, derived from the memo in own words (AIEXP-08).
 * Every fitb declares keyboard_type 'text' (LANG-KB-01). Typed answers avoid á í ó ú à â (not on the keyboard); required
 * diacritics (ê ë é è ô ö û ü î ï ä) are fine and significant (LANG-KB-02).
 *
 * BASIS per practice question — P printed in the extract/poem tab, M printed in the memo, X taken from the other half of the same exam question (fresh angle), L language-paper skill, C CAPS:
 *   Q1: P1: letterlike begrip (mirror 1.1)
 *   Q2: P1: idioom (mirror 1.3)
 *   Q3: P1: figuurlike taal (mirror 1.4)
 *   Q4: P1: matching KOLOM A/B (mirror 1.10)
 *   Q5: P1: motivering (mirror 1.7/1.14/1.15)
 *
 *   node tools/validate-questions.js --script scripts/add-afrikaans-fal-2025-nov-p1-q1.js --curriculum temp/curriculum-vocab-afrikaans-fal.json
 *   node scripts/add-afrikaans-fal-2025-nov-p1-q1.js --dry-run
 *   node scripts/add-afrikaans-fal-2025-nov-p1-q1.js
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
  "name": "Vraag 1: Leesbegrip (Teks A)",
  "syllabus": "dbe",
  "subject": "afrikaans_fal",
  "year": 2025,
  "paper": "nov_p1",
  "order": 1,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "comprehension",
    "figurative_language",
    "inferential_reading"
  ],
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p1/q1/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p1/q1/question_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p1/q1/question_3.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p1/q1/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p1/q1/memo_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p1/q1/memo_3.png"
  ],
  "exam_question_marks": 24,
  "supplementary_materials": [
    {
      "type": "annexure",
      "label": "Teks A",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p1/q1/annexure_teks_a_1.png",
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p1/q1/annexure_teks_a_2.png"
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
    "paper": "nov_p1",
    "name": "Vraag 1",
    "order": 1,
    "context_text": "Thando is 'n sestienjarige leerder van Paarl. Sy bak koekies en wys dit aan duisende volgelinge op TikTok. Haar kanaalnaam is Koekie-Thando.",
    "question": "VOLTOOI die sin met EEN woord uit die uittreksel. Koekie-Thando is Thando se ... op TikTok.",
    "metadata": [
      "Woord:",
      "[ ]"
    ],
    "answer": [
      "kanaalnaam",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "definition",
    "unit": "leesbegrip",
    "topic": "letterlike_begrip",
    "subtopic": "voltooi_sin_uit_teks",
    "skills": [
      "afrikaans_fal_voltooi_sin_met_woord_uit_teks"
    ],
    "difficulty": 1,
    "exam_weight": 3,
    "clues": "- Soek die woord wat sê hoe haar bladsy op TikTok genoem word.\n- Skryf net EEN woord.",
    "keyboard_type": "text"
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p1",
    "name": "Vraag 2",
    "order": 2,
    "context_text": "Die leerders het 'n liefdadigheidsfees op die been gebring om geld vir die dierehawe in te samel.",
    "question": "Wat beteken \"op die been gebring\" in hierdie sin?",
    "metadata": [
      "met baie moeite vervoer",
      "skielik beëindig",
      "gereël en laat plaasvind",
      "deur 'n ander groep oorgeneem",
      ""
    ],
    "answer": [
      "gereël en laat plaasvind",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "leesbegrip",
    "topic": "woordeskat_in_konteks",
    "subtopic": "idioom_in_konteks",
    "skills": [
      "afrikaans_fal_verklaar_idioom_in_konteks"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Dink aan wat leerders moet doen voordat 'n fees kan begin.\n- Toets elke opsie in die sin."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p1",
    "name": "Vraag 3",
    "order": 3,
    "context_text": "Die aantal volgelinge op Thando se kanaal het die afgelope maand soos 'n vuurpyl gegroei.",
    "question": "Wat beteken hierdie vergelyking?",
    "metadata": [
      "Die kanaal het vir die kykers gevaarlik geword.",
      "Die aantal volgelinge het baie vinnig gegroei.",
      "Al die volgelinge het skielik van die kanaal verdwyn.",
      "Thando se kanaal gaan nou net oor vuurpyle en ruimtevaart.",
      ""
    ],
    "answer": [
      "Die aantal volgelinge het baie vinnig gegroei.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "leesbegrip",
    "topic": "figuurlike_taal",
    "subtopic": "vergelyking",
    "skills": [
      "afrikaans_fal_verklaar_vergelyking"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Dink aan hoe 'n vuurpyl beweeg.\n- Dit is figuurlike taal: die woorde beteken nie letterlik wat hulle sê nie."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p1",
    "name": "Vraag 4",
    "order": 4,
    "context_text": null,
    "question": "Pas elke projek by sy doel.",
    "metadata": [
      "A - Die dierehawe",
      "B - Die leesklub",
      "C - Die saailingprojek",
      "1 - help kinders om beter te leer lees",
      "2 - plant bome in die dorp",
      "3 - versorg honde en katte sonder 'n huis"
    ],
    "answer": [
      "A-3",
      "B-1",
      "C-2",
      "",
      ""
    ],
    "presentation": "match",
    "type": "application",
    "unit": "leesbegrip",
    "topic": "letterlike_begrip",
    "subtopic": "pas_inligting_by_omskrywing",
    "skills": [
      "afrikaans_fal_pas_plek_by_omskrywing"
    ],
    "difficulty": 1,
    "exam_weight": 3,
    "clues": "- Dink aan wat die naam van elke projek vir jou sê.\n- Begin met die een wat jy die mees seker is van."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p1",
    "name": "Vraag 5",
    "order": 5,
    "context_text": "Thando koop met haar inkomste van TikTok kos vir die skool se naskoolprogram, al het niemand haar daarvoor gevra nie.",
    "question": "Waarom kan 'n mens sê Thando is 'n goeie voorbeeld vir ander?",
    "metadata": [
      "Sy het baie geld en is daarom by almal baie gewild.",
      "Sy plaas gereeld nuwe video's vir haar volgelinge.",
      "Sy kan goed bak en verkoop haar koekies aan almal.",
      "Sy help ander met haar sukses, al vra niemand haar nie.",
      ""
    ],
    "answer": [
      "Sy help ander met haar sukses, al vra niemand haar nie.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "leesbegrip",
    "topic": "afleidende_begrip",
    "subtopic": "motiveer_afleiding",
    "skills": [
      "afrikaans_fal_motiveer_afleiding"
    ],
    "difficulty": 3,
    "exam_weight": 2,
    "clues": "- Soek die antwoord wat sê wat sy met haar sukses doen.\n- 'n Goeie motivering gee 'n rede, nie net 'n feit nie."
  }
];

// ─── AI explanation — one entry per REAL printed sub-question, real marks (AIEXP-08) ───

const aiExplanation = {
  "sub_questions": [
    {
      "number": "1.1",
      "marks": 3,
      "clues": "- Lees paragraaf 2 weer en soek die getalle en die naam.\n- Skryf EEN of TWEE woorde per blanko.",
      "approach": "- Soek elke blanko se antwoord in paragraaf 2\n- Skryf net die woorde wat in die teks staan",
      "solution": "1.1.1: 27 (sewe-en-twintig).\n1.1.2: aanlyn naam (of net naam).\n1.1.3: meer."
    },
    {
      "number": "1.2",
      "marks": 1,
      "clues": "- Kyk na die opskrif: watter woord wys op 'n leier of 'n koning?\n- Lees reël 6 tot 10.",
      "approach": "- Soek die woord in reël 6 tot 10\n- Haal EEN woord aan",
      "solution": "1. \"nommer-een-inhoudskepper\" wys dat hy bo almal staan."
    },
    {
      "number": "1.3",
      "marks": 1,
      "clues": "- Lees die sin en die woorde rondom \"op eie stoom\".",
      "approach": "- Toets elke opsie in die sin\n- Kies die een wat by die konteks pas",
      "solution": "1. D is korrek: Jimmy het nie op ander staatgemaak om sukses te behaal nie.\n2. A, B en C sê iets wat nie in die teks staan nie."
    },
    {
      "number": "1.4",
      "marks": 1,
      "clues": "- \"Kwaai\" beteken hier nie boos nie.",
      "approach": "- Lees die sin in sy konteks\n- Kies die opsie wat by die figuurlike betekenis pas",
      "solution": "1. Dit is nie maklik om sukses te behaal nie."
    },
    {
      "number": "1.5",
      "marks": 1,
      "clues": "- Lees paragraaf 4.",
      "approach": "- Soek die naam van die skool",
      "solution": "1. Greenville Christian Academy."
    },
    {
      "number": "1.6",
      "marks": 1,
      "clues": "- Lees paragraaf 4 weer: hoe oud was hy toe hy begin het?",
      "approach": "- Soek die ouderdom in paragraaf 4",
      "solution": "1. Dertien (13) jaar oud."
    },
    {
      "number": "1.7",
      "marks": 1,
      "clues": "- Soek wat Jimmy wil hê mense moet doen as hulle sy video's kyk (paragraaf 5).",
      "approach": "- Vind die stelling in paragraaf 5\n- Gee EEN rede in jou eie woorde",
      "solution": "1. Hy wil hê mense moet wonder en vrae vra.\n2. Of: hulle moet iets voel, van sy video's hou of sy kanaal volg (enige een)."
    },
    {
      "number": "1.8",
      "marks": 1,
      "clues": "- Lees die eerste sin van paragraaf 6.",
      "approach": "- Soek die wilde video in paragraaf 6",
      "solution": "1. Die video waar hy homself lewend laat begrawe het."
    },
    {
      "number": "1.9",
      "marks": 2,
      "clues": "- Lees paragraaf 6 en soek twee punte van kritiek.",
      "approach": "- Soek die twee kritiekpunte\n- Skryf hulle in jou eie woorde neer",
      "solution": "1. Mense is ongelukkig oor die onsensitiewe taal wat hy soms gebruik.\n2. Die plekke waar sy video's gemaak word, is nie altyd veilig nie."
    },
    {
      "number": "1.10",
      "marks": 5,
      "clues": "- Lees paragraaf 7 tot 10 en soek elke plek.\n- Pas die plek by die korrekte omskrywing.",
      "approach": "- Vind elke plek in die teks\n- Kies die omskrywing wat by die projek in die plek pas",
      "solution": "1.10.1 Die see: D (veg teen besoedeling).\n1.10.2 Jamaika: E (blyplek vir mense wat swaarkry).\n1.10.3 Dorpie in Zambië: F (hoef nie meer kerse te gebruik nie).\n1.10.4 Khayelitsha: C (veilige plek vir kinders sonder ouers).\n1.10.5 Oor die hele wêreld: B (herstel skade aan die plantegroei)."
    },
    {
      "number": "1.11",
      "marks": 1,
      "clues": "- Lees paragraaf 10: aan wie of wat is hy in Suid-Afrika verbind?",
      "approach": "- Soek die verbinding\n- Skryf dit in 'n verduidelikende volsin",
      "solution": "1. Sy verloofde is Suid-Afrikaans, hy het 'n liefdadigheidsprojek hier, of hy help 'n kinderhuis in Khayelitsha (enige een, in 'n volsin)."
    },
    {
      "number": "1.12",
      "marks": 1,
      "clues": "- Soek die jaartal van sy besoek in paragraaf 10.",
      "approach": "- Soek die jaartal",
      "solution": "1. In 2022."
    },
    {
      "number": "1.13",
      "marks": 1,
      "clues": "- Lees paragraaf 11.",
      "approach": "- Soek wat hy nog wil doen",
      "solution": "1. Hy hoop om wêreldvrede te bring, 'n einde te maak aan hongersnood of nog nuwe dinge te leer (enige een)."
    },
    {
      "number": "1.14",
      "marks": 1,
      "clues": "- Wat doen 'n \"good guy\" in vergelyking met mense wat lelik is?",
      "approach": "- Dink aan hoe Jimmy anders is as ander\n- Gee EEN rede uit die teks",
      "solution": "1. Hy is nie lelik met ander op sosiale media nie.\n2. Of: hy help mense, diere en die natuur met sy eie geld."
    },
    {
      "number": "1.15",
      "marks": 2,
      "clues": "- Kyk na paragraaf 5 en 10: wat doen hulle, en hoe voel hulle oor leer?",
      "approach": "- Gee een rede oor hulle werk\n- Gee een rede oor leer",
      "solution": "1. Werk: albei is bekende internetpersoonlikhede wat inhoud maak.\n2. Leer: albei hou daarvan om te leer of nuwe dinge te ken."
    },
    {
      "number": "1.16",
      "marks": 1,
      "clues": "- Kyk na die foto en dink aan wat dit wys van sy bekendheid.",
      "approach": "- Beskryf wat die foto wys\n- Verbind dit met paragraaf 2",
      "solution": "1. Die foto wys hoe baie volgelinge of views hy het, of wie hy is."
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
