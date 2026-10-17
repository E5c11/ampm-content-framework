#!/usr/bin/env node
/**
 * DBE Afrikaans FAL P2 — November 2025 — Vraag 6.1–6.9: Paljas — Teks K
 * Practice questions are fresh (DESIGN-UNI-01), written in Afrikaans, same theme/skill as the exam item (LANG-EX-01/02).
 * aiExplanation is one entry per REAL printed sub-question with its real marks, derived from the memo in own words (AIEXP-08).
 * Every fitb declares keyboard_type 'text' (LANG-KB-01). Typed answers avoid á í ó ú à â (not on the keyboard); required
 * diacritics (ê ë é è ô ö û ü î ï ä) are fine and significant (LANG-KB-02).
 *
 * BASIS per practice question — P printed in the extract/poem tab, M printed in the memo, X taken from the other half of the same exam question (fresh angle), L language-paper skill, C CAPS:
 *   Q1: X: Teks L l.21-22 (other half)
 *   Q2: P: Teks K l.1-5
 *   Q3: P: Teks K l.11-14
 *   Q4: P: Teks K
 *   Q5: L: identify (mirror 6.9)
 *
 *   node tools/validate-questions.js --script scripts/add-afrikaans-fal-2025-nov-p2-q11.js --curriculum temp/curriculum-vocab-afrikaans-fal.json
 *   node scripts/add-afrikaans-fal-2025-nov-p2-q11.js --dry-run
 *   node scripts/add-afrikaans-fal-2025-nov-p2-q11.js
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
  "name": "Vraag 6: Paljas (6.1–6.9)",
  "syllabus": "dbe",
  "subject": "afrikaans_fal",
  "year": 2025,
  "paper": "nov_p2",
  "order": 11,
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
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q11/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q11/question_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q11/question_3.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q11/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q11/memo_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q11/memo_3.png"
  ],
  "exam_question_marks": 18,
  "supplementary_materials": [
    {
      "type": "annexure",
      "label": "Teks K",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q11/annexure_teks_k_1.png"
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
    "question": "Op watter dans het die dorpsmense die McDonalds weggejaag? Skryf een woord.",
    "metadata": [
      "Dans:",
      "[ ]"
    ],
    "answer": [
      "Volstruisdans",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "definition",
    "unit": "drama",
    "topic": "intrige_en_gebeure",
    "subtopic": "feit_uit_die_drama",
    "skills": [
      "afrikaans_fal_voltooi_feit_uit_teks"
    ],
    "difficulty": 2,
    "exam_weight": 3,
    "clues": "- Die naam van die dans kom in Emma se woorde voor.\n- Skryf een woord.",
    "keyboard_type": "text"
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
    "question": "Watter woord beskryf Hendrik se toon in: \"Hoe gaan sy getroud kom as sy so hol vir al wat 'n broek is!\"?",
    "metadata": [
      "skertsend",
      "hartseer",
      "bang",
      "moedeloos",
      ""
    ],
    "answer": [
      "skertsend",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "drama",
    "topic": "toon_en_stylmiddele",
    "subtopic": "toon_van_'n_aanhaling",
    "skills": [
      "afrikaans_fal_bepaal_toon"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Let op die toneelaanwysing voor sy woorde (met 'n laggie).\n- Hy meen dit nie ernstig nie."
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
    "question": "Waarom kan 'n mens sê Hendrik ervaar innerlike konflik as hy na die musiek luister (reël 11 tot 14)?",
    "metadata": [
      "Die musiek maak hom kwaad omdat Katrien dit nooit speel nie.",
      "Die musiek herinner hom dat hy 'n nuwe liedjie moet leer.",
      "Die musiek maak hom bly oor herinneringe, maar ook hartseer.",
      "Die musiek maak hom bang vir al die dorpsmense in die omgewing.",
      ""
    ],
    "answer": [
      "Die musiek maak hom bly oor herinneringe, maar ook hartseer.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "drama",
    "topic": "karakter_en_verhoudings",
    "subtopic": "innerlike_konflik",
    "skills": [
      "afrikaans_fal_verklaar_innerlike_konflik"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "clues": "- Die musiek is \"melancholies\" en hy is \"half aangedaan\".\n- Watter twee gevoelens is saam in hom?"
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
    "question": "Pas elke persoon by wat hy of sy in die uittreksel doen.",
    "metadata": [
      "A - Willem",
      "B - Katrien",
      "C - Hendrik",
      "1 - staan in die kombuis en stryk",
      "2 - luister op die stoep na grammofoonmusiek",
      "3 - gebruik handgebare omdat hy nie praat nie"
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
    "unit": "drama",
    "topic": "karakter_en_verhoudings",
    "subtopic": "wie_doen_wat",
    "skills": [
      "afrikaans_fal_pas_gebeure_by_persone"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Dink aan wie wys eerder as praat en wie by die stoof staan.\n- Begin met die een wat jy die mees seker is van."
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
    "question": "Hendrik luister na musiek as hy eensaam voel. Watter stelling motiveer die beste waarom baie mense hiermee kan identifiseer?",
    "metadata": [
      "Musiek maak mense altyd kwaad.",
      "Eensame mense hou nie van musiek nie.",
      "Jy hoef nie na musiek te luister as jy hartseer is nie.",
      "Mense luister soms na musiek om hulle eensame gevoelens te versag.",
      ""
    ],
    "answer": [
      "Mense luister soms na musiek om hulle eensame gevoelens te versag.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "drama",
    "topic": "karakter_en_verhoudings",
    "subtopic": "identifiseer_met_karakter",
    "skills": [
      "afrikaans_fal_identifiseer_met_karakter"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Dink aan 'n liedjie wat jou al beter laat voel het.\n- Gee 'n rede."
  }
];

// ─── AI explanation — one entry per REAL printed sub-question, real marks (AIEXP-08) ───

const aiExplanation = {
  "sub_questions": [
    {
      "number": "6.1",
      "marks": 4,
      "clues": "- Lees die paragraaf en dink aan die nar se aankoms.",
      "approach": "- Soek elke woord in die drama",
      "solution": "6.1.1: Manuel.\n6.1.2: skuur.\n6.1.3: brood.\n6.1.4: fiets."
    },
    {
      "number": "6.2",
      "marks": 1,
      "clues": "- Wat het tussen Nollie en Emma gebeur?",
      "approach": "- Soek een gebeurtenis",
      "solution": "1. Nollie en Emma was saam in die veld en daar was 'n ongelukkie; Emma het geval en seergekry."
    },
    {
      "number": "6.3",
      "marks": 1,
      "clues": "- Hoe klink Nollie as hy praat?",
      "approach": "- Toets elke opsie by Nollie se woorde",
      "solution": "1. A (moedeloos)."
    },
    {
      "number": "6.4",
      "marks": 1,
      "clues": "- Hoekom praat Willem nie?",
      "approach": "- Gee een rede",
      "solution": "1. Willem het 'n spraakprobleem gehad en het voor niemand gepraat nie."
    },
    {
      "number": "6.5.1",
      "marks": 1,
      "clues": "- Is musiek werklik salf?",
      "approach": "- Kies die stylfiguur",
      "solution": "1. metafoor."
    },
    {
      "number": "6.5.2",
      "marks": 1,
      "clues": "- Wat doen die musiek vir Hendrik?",
      "approach": "- Verduidelik die vetgedrukte woorde",
      "solution": "1. Hendrik het na musiek geluister as hy eensaam gevoel het; dit het hom beter laat voel."
    },
    {
      "number": "6.6.1",
      "marks": 1,
      "clues": "- Waarna verwys \"die ou dingetjie\"?",
      "approach": "- Soek wat Hendrik wou hê gespeel moes word",
      "solution": "1. Die romantiese liedjie of plaat waarna hy geluister het."
    },
    {
      "number": "6.6.2",
      "marks": 1,
      "clues": "- Wat het Hendrik vir Katrien aangevra?",
      "approach": "- Verduidelik die aanhaling",
      "solution": "1. Hendrik het die liedjie vroeër vir Katrien oor die radio aangevra; hulle verhouding was toe beter."
    },
    {
      "number": "6.7",
      "marks": 4,
      "clues": "- Pas elke gebeurtenis by die gevolg.",
      "approach": "- Dink aan wat uit elke gebeurtenis gevolg het",
      "solution": "6.7.1: E.\n6.7.2: A.\n6.7.3: D.\n6.7.4: C."
    },
    {
      "number": "6.8",
      "marks": 2,
      "clues": "- Wat het die stoep vir Nollie beteken?",
      "approach": "- Soek twee positiewe voorbeelde",
      "solution": "1. Nollie en Hendrik kon 'n goeie verhouding bou.\n2. Nollie het deel van die gesin geword of hulle liefde vir musiek gedeel."
    },
    {
      "number": "6.9",
      "marks": 1,
      "clues": "- Dink aan Emma se keuses oor trou.",
      "approach": "- Verduidelik waarom jy kan identifiseer",
      "solution": "1. Emma moes haar eie keuses kon maak en wou nie hê ouers moet vir haar besluit nie."
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
