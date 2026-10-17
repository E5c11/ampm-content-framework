#!/usr/bin/env node
/**
 * DBE Afrikaans FAL P2 — November 2025 — Vraag 8.2.6–8.2.10: Opdrag — Teks P
 * Practice questions are fresh (DESIGN-UNI-01), written in Afrikaans, same theme/skill as the exam item (LANG-EX-01/02).
 * aiExplanation is one entry per REAL printed sub-question with its real marks, derived from the memo in own words (AIEXP-08).
 * Every fitb declares keyboard_type 'text' (LANG-KB-01). Typed answers avoid á í ó ú à â (not on the keyboard); required
 * diacritics (ê ë é è ô ö û ü î ï ä) are fine and significant (LANG-KB-02).
 *
 * BASIS per practice question — P printed in the extract/poem tab, M printed in the memo, X taken from the other half of the same exam question (fresh angle), L language-paper skill, C CAPS:
 *   Q1: P: Teks P l.7-8
 *   Q2: P: Teks P l.7-10
 *   Q3: L: identify (mirror 8.2.10)
 *   Q4: P: Teks P
 *   Q5: P: Teks P + memo 8.2.9
 *
 *   node tools/validate-questions.js --script scripts/add-afrikaans-fal-2025-nov-p2-q18.js --curriculum temp/curriculum-vocab-afrikaans-fal.json
 *   node scripts/add-afrikaans-fal-2025-nov-p2-q18.js --dry-run
 *   node scripts/add-afrikaans-fal-2025-nov-p2-q18.js
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
  "name": "Vraag 8.2: Opdrag (8.2.6–8.2.10)",
  "syllabus": "dbe",
  "subject": "afrikaans_fal",
  "year": 2025,
  "paper": "nov_p2",
  "order": 18,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "narrative_structure",
    "character_analysis",
    "theme_identification"
  ],
  "text_key": "opdrag",
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q18/question_v2_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q18/question_v2_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q18/memo_v2_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q18/memo_v2_2.png"
  ],
  "exam_question_marks": 7,
  "supplementary_materials": [
    {
      "type": "annexure",
      "label": "Teks P",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q18/annexure_teks_p_v2_1.png"
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
    "text_key": "opdrag",
    "order": 1,
    "context_text": null,
    "question": "Watter stylfiguur kom voor in: \"Wat maak ek met hierdie verskriklike lief wees vir jou as ek my nie kan commit nie?\"?",
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
    "unit": "kortverhale",
    "topic": "toon_en_stylmiddele",
    "subtopic": "identifiseer_stylfiguur",
    "skills": [
      "afrikaans_fal_identifiseer_stylfiguur"
    ],
    "difficulty": 2,
    "exam_weight": 3,
    "clues": "- Sarah verwag nie werklik 'n antwoord van Gerrie nie.\n- Dit is 'n vraag wat 'n punt maak."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Vraag 2",
    "text_key": "opdrag",
    "order": 2,
    "context_text": null,
    "question": "Kies TWEE gevoelens wat Sarah in haar brief uitspreek.",
    "metadata": [
      "Liefde vir Gerrie",
      "Haat teenoor haar ouma",
      "Vrees dat hulle paadjies uit mekaar sal gaan",
      "Blydskap oor die boekverslag",
      ""
    ],
    "answer": [
      "Liefde vir Gerrie",
      "Vrees dat hulle paadjies uit mekaar sal gaan",
      "",
      "",
      ""
    ],
    "presentation": "multi_select",
    "type": "application",
    "unit": "kortverhale",
    "topic": "karakter_en_verhoudings",
    "subtopic": "gevoelens_van_karakter",
    "skills": [
      "afrikaans_fal_identifiseer_eienskappe"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Waaroor skryf Sarah in haar brief aan Gerrie?\n- Twee gevoelens pas by die brief."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Vraag 3",
    "text_key": "opdrag",
    "order": 3,
    "context_text": null,
    "question": "Waarom kan baie tieners met Sarah se onsekerheid identifiseer?",
    "metadata": [
      "Tieners voel nooit onseker oor verhoudings nie.",
      "Almal weet presies hoe om 'n verhouding te hanteer.",
      "Baie tieners voel onseker oor verhoudings en keuses.",
      "Onsekerheid beteken dat 'n verhouding noodwendig verby is.",
      ""
    ],
    "answer": [
      "Baie tieners voel onseker oor verhoudings en keuses.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "kortverhale",
    "topic": "karakter_en_verhoudings",
    "subtopic": "identifiseer_met_karakter",
    "skills": [
      "afrikaans_fal_identifiseer_met_karakter"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Dink aan 'n keer toe jy onseker was oor 'n belangrike besluit.\n- Gee 'n rede."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Vraag 4",
    "text_key": "opdrag",
    "order": 4,
    "context_text": null,
    "question": "Pas elke persoon by wat in die uittreksel van hom of haar gesê word.",
    "metadata": [
      "A - Gerrie",
      "B - Ouma",
      "C - Sarah se ma",
      "1 - was sestien toe sy getroud is",
      "2 - vertel dat Oupa Ouma se eerste kêrel was",
      "3 - is die persoon aan wie Sarah skryf"
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
    "unit": "kortverhale",
    "topic": "karakter_en_verhoudings",
    "subtopic": "wie_doen_wat",
    "skills": [
      "afrikaans_fal_pas_gebeure_by_persone"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Dink aan wie die brief ontvang en wie van Oupa vertel het.\n- Begin met die een wat jy die mees seker is van."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Vraag 5",
    "text_key": "opdrag",
    "order": 5,
    "context_text": null,
    "question": "Watter lewensles kan Sarah uit haar opdrag leer?",
    "metadata": [
      "Jy kan aan jou gevoelens toegee sonder om te dink.",
      "Verantwoordelike keuses begin by nadink oor die gevolge.",
      "Daar is net een manier om 'n verhouding te hanteer.",
      "Jy moet altyd doen wat ander van jou verwag.",
      ""
    ],
    "answer": [
      "Verantwoordelike keuses begin by nadink oor die gevolge.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "kortverhale",
    "topic": "tema_en_boodskap",
    "subtopic": "lewensles",
    "skills": [
      "afrikaans_fal_identifiseer_temas"
    ],
    "difficulty": 2,
    "exam_weight": 3,
    "clues": "- Sarah dink noukeurig oor haar besluit.\n- Watter les geld vir enige keuse wat 'n verhouding kan raak?"
  }
];

// ─── AI explanation — one entry per REAL printed sub-question, real marks (AIEXP-08) ───

const aiExplanation = {
  "sub_questions": [
    {
      "number": "8.2.6(a)",
      "marks": 1,
      "clues": "- Let op die woord \"soos\".",
      "approach": "- Kies tussen metafoor en vergelyking",
      "solution": "1. vergelyking."
    },
    {
      "number": "8.2.6(b)",
      "marks": 1,
      "clues": "- Wat beteken die vetgedrukte woorde letterlik en figuurlik?",
      "approach": "- Verduidelik albei betekenisse",
      "solution": "1. Letterlik: haar aanbeveling is kort, duidelik en saaklik.\n2. Figuurlik: Sarah besluit om nie as tiener seksueel aktief te wees nie."
    },
    {
      "number": "8.2.7",
      "marks": 1,
      "clues": "- Wat was die direkte gevolg van die opdrag?",
      "approach": "- Soek een gevolg",
      "solution": "1. Dit het Sarah onder druk geplaas om haar huiswerk te voltooi en sy het haar besluit geneem."
    },
    {
      "number": "8.2.8",
      "marks": 1,
      "clues": "- Wat wys die gesprek oor tieners?",
      "approach": "- Verduidelik hoekom jy goed voel",
      "solution": "1. Dit wys tieners het emosionele begrip en 'n sin vir verantwoordelikheid."
    },
    {
      "number": "8.2.9",
      "marks": 2,
      "clues": "- Wat het Sarah uit die boek geleer?",
      "approach": "- Soek twee positiewe gevolge",
      "solution": "1. Sarah het haarself beter leer ken.\n2. Sy het geleer om haar emosies te beheer en besef sy is verantwoordelik vir haar eie keuses."
    },
    {
      "number": "8.2.10",
      "marks": 1,
      "clues": "- Met wie kon Sarah praat?",
      "approach": "- Verduidelik hoekom jy jammer voel",
      "solution": "1. Dit was 'n taboe-onderwerp en sy moes haar antwoorde uit 'n boek kry omdat sy niemand gehad het om mee te praat nie."
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
