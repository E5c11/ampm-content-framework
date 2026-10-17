#!/usr/bin/env node
/**
 * DBE Afrikaans FAL P2 — November 2025 — Vraag 2.1–2.9: Die Ongelooflike Avonture van Hanna Hoekom — Teks C
 * Practice questions are fresh (DESIGN-UNI-01), written in Afrikaans, same theme/skill as the exam item (LANG-EX-01/02).
 * aiExplanation is one entry per REAL printed sub-question with its real marks, derived from the memo in own words (AIEXP-08).
 * Every fitb declares keyboard_type 'text' (LANG-KB-01). Typed answers avoid á í ó ú à â (not on the keyboard); required
 * diacritics (ê ë é è ô ö û ü î ï ä) are fine and significant (LANG-KB-02).
 *
 * BASIS per practice question — P printed in the extract/poem tab, M printed in the memo, X taken from the other half of the same exam question (fresh angle), L language-paper skill, C CAPS:
 *   Q1: X: Q2.13 (other half), fresh angle
 *   Q2: P: Teks C l.13-14
 *   Q3: P: Teks C l.16-17
 *   Q4: X: Q2.2/2.7/2.12 facts
 *   Q5: L: identify (mirror 2.2.2)
 *
 *   node tools/validate-questions.js --script scripts/add-afrikaans-fal-2025-nov-p2-q3.js --curriculum temp/curriculum-vocab-afrikaans-fal.json
 *   node scripts/add-afrikaans-fal-2025-nov-p2-q3.js --dry-run
 *   node scripts/add-afrikaans-fal-2025-nov-p2-q3.js
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
  "name": "Vraag 2: Hanna Hoekom (2.1–2.9)",
  "syllabus": "dbe",
  "subject": "afrikaans_fal",
  "year": 2025,
  "paper": "nov_p2",
  "order": 3,
  "content_tier": "free",
  "has_video": false,
  "xp": 50,
  "tags": [
    "character_analysis",
    "contextual_questions",
    "literary_analysis"
  ],
  "text_key": "die_ongelooflike_avonture_van_hanna_hoekom",
  "question_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q3/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q3/question_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q3/question_3.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q3/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q3/memo_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q3/memo_3.png"
  ],
  "exam_question_marks": 18,
  "supplementary_materials": [
    {
      "type": "annexure",
      "label": "Teks C",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q3/annexure_teks_c_1.png"
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
    "text_key": "die_ongelooflike_avonture_van_hanna_hoekom",
    "order": 1,
    "context_text": null,
    "question": "Watter naam het Mana vir die nuwe baba gegee? Skryf net die naam.",
    "metadata": [
      "Naam:",
      "[ ]"
    ],
    "answer": [
      "Ditjie",
      "",
      "",
      "",
      ""
    ],
    "presentation": "fitb",
    "type": "definition",
    "unit": "roman",
    "topic": "intrige_en_gebeure",
    "subtopic": "feit_uit_die_roman",
    "skills": [
      "afrikaans_fal_voltooi_feit_uit_teks"
    ],
    "difficulty": 2,
    "exam_weight": 3,
    "clues": "- Die naam het iets met water te doen gehad.\n- Skryf een woord.",
    "keyboard_type": "text"
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Vraag 2",
    "text_key": "die_ongelooflike_avonture_van_hanna_hoekom",
    "order": 2,
    "context_text": null,
    "question": "Watter woord beskryf Sharon se toon in: \"Wel, ek sal haar nou nie as 'n deftige dame beskryf nie\"?",
    "metadata": [
      "vermaaklik",
      "kwaad",
      "hartseer",
      "bang",
      ""
    ],
    "answer": [
      "vermaaklik",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "roman",
    "topic": "toon_en_stylmiddele",
    "subtopic": "toon_van_'n_aanhaling",
    "skills": [
      "afrikaans_fal_bepaal_toon"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Let op wat die uittreksel sê Sharon met haar kop doen terwyl sy dit sê.\n- Sy probeer nie lag nie."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Vraag 3",
    "text_key": "die_ongelooflike_avonture_van_hanna_hoekom",
    "order": 3,
    "context_text": null,
    "question": "Waarom ervaar Hanna innerlike konflik as sy dink: \"As Sharon my moes oordeel aan hoe ek lyk ... sou ons seker nooit maats geword het nie\"?",
    "metadata": [
      "Sy wil graag soos Margot lyk en probeer dit voor Sharon verberg.",
      "Sy wil Sharon se vriendskap beëindig omdat Sharon haar reghelp.",
      "Sy kritiseer Margot se voorkoms, maar besef sy word self ook so beoordeel.",
      "Sy besef Margot is glad nie die persoon waarvan sy gehoor het nie.",
      ""
    ],
    "answer": [
      "Sy kritiseer Margot se voorkoms, maar besef sy word self ook so beoordeel.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "roman",
    "topic": "karakter_en_verhoudings",
    "subtopic": "innerlike_konflik",
    "skills": [
      "afrikaans_fal_verklaar_innerlike_konflik"
    ],
    "difficulty": 3,
    "exam_weight": 3,
    "clues": "- Hanna oordeel Margot oor haar voorkoms.\n- Wat besef sy oor haarself?"
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Vraag 4",
    "text_key": "die_ongelooflike_avonture_van_hanna_hoekom",
    "order": 4,
    "context_text": null,
    "question": "Pas elke persoon by haar rol in die roman.",
    "metadata": [
      "A - Mana",
      "B - Margot",
      "C - Sharon",
      "1 - staan Mana by tydens die geboorte",
      "2 - is Hanna se ware vriendin",
      "3 - gee geboorte aan Hanna se sussie"
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
    "unit": "roman",
    "topic": "karakter_en_verhoudings",
    "subtopic": "wie_doen_wat",
    "skills": [
      "afrikaans_fal_pas_gebeure_by_persone"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Dink aan wie op die berg die baba gebore laat word het en wie gehelp het.\n- Begin met die een wat jy die seker is van."
  },
  {
    "xp": 10,
    "syllabus": "dbe",
    "subject": "afrikaans_fal",
    "year": 2025,
    "paper": "nov_p2",
    "name": "Vraag 5",
    "text_key": "die_ongelooflike_avonture_van_hanna_hoekom",
    "order": 5,
    "context_text": null,
    "question": "Hanna is negatief teenoor Margot voordat sy haar ontmoet het. Watter stelling motiveer die beste waarom baie mense hiermee kan identifiseer?",
    "metadata": [
      "Jy leer iemand beter ken deur net na haar kleredrag te kyk.",
      "Mense verander nooit hulle mening oor ander nie.",
      "Dit is altyd beter om niks oor ander te dink nie.",
      "Mense vorm soms 'n mening oor iemand voordat hulle haar werklik ken.",
      ""
    ],
    "answer": [
      "Mense vorm soms 'n mening oor iemand voordat hulle haar werklik ken.",
      "",
      "",
      "",
      ""
    ],
    "presentation": "multiple_choice",
    "type": "application",
    "unit": "roman",
    "topic": "karakter_en_verhoudings",
    "subtopic": "identifiseer_met_karakter",
    "skills": [
      "afrikaans_fal_identifiseer_met_karakter"
    ],
    "difficulty": 2,
    "exam_weight": 2,
    "clues": "- Dink aan 'n keer toe jy iemand beoordeel het voordat jy haar geken het.\n- Gee 'n rede, nie net 'n gevoel nie."
  }
];

// ─── AI explanation — one entry per REAL printed sub-question, real marks (AIEXP-08) ───

const aiExplanation = {
  "sub_questions": [
    {
      "number": "2.1",
      "marks": 4,
      "clues": "- Lees die paragraaf en dink aan Hanna se lewe.\n- Elke blanko vra een woord uit die roman.",
      "approach": "- Soek elke gebeurtenis in die roman\n- Skryf net die woord",
      "solution": "2.1.1: hoekom (hoetom).\n2.1.2: Tibo.\n2.1.3: ingewikkelde (komplekse, aangelapte).\n2.1.4: Bitterberg."
    },
    {
      "number": "2.2.1",
      "marks": 1,
      "clues": "- Wat het Hanna van Margot gehoor?",
      "approach": "- Kies die opsie tussen hakies wat by die uittreksel pas",
      "solution": "1. was bevooroordeeld omdat sy dinge van Margot gehoor het."
    },
    {
      "number": "2.2.2",
      "marks": 1,
      "clues": "- Het Hanna Margot reeds ontmoet?",
      "approach": "- Gee een rede binne die konteks van die roman",
      "solution": "1. Hanna het by Beyers gehoor Margot is gemaksugtig en het haar kinders agtergelaat, nog voordat sy haar ontmoet het."
    },
    {
      "number": "2.3",
      "marks": 1,
      "clues": "- Hoe het Hanna gevoel toe Sharon so laat kom?",
      "approach": "- Soek een rede",
      "solution": "1. Hanna was jaloers op Sharon en Margot se kuier en het gevoel Sharon moes saam met haar kamer toe gegaan het."
    },
    {
      "number": "2.4",
      "marks": 1,
      "clues": "- Dink aan die reën en die pad na die berg.",
      "approach": "- Soek wat Amos bekommer het",
      "solution": "1. Hy was bekommerd dat Margot nie in die reën sou uitkom nie of sou verdwaal."
    },
    {
      "number": "2.5.1",
      "marks": 1,
      "clues": "- Waarom kritiseer Hanna haar ma?",
      "approach": "- Kies die opsie tussen hakies",
      "solution": "1. is vreemd en dink anders oor dinge."
    },
    {
      "number": "2.5.2",
      "marks": 1,
      "clues": "- Gee 'n voorbeeld van hoe Hanna se ma anders is.",
      "approach": "- Motiveer jou antwoord op 2.5.1",
      "solution": "1. Haar ma het met verfkwaste in haar hare rondgeloop en was 'n eksentrieke kunstenaar."
    },
    {
      "number": "2.6",
      "marks": 1,
      "clues": "- Let op die woorde \"goedkoop\" en \"vals\".",
      "approach": "- Toets elke opsie",
      "solution": "1. C (negatief)."
    },
    {
      "number": "2.7",
      "marks": 2,
      "clues": "- Dink aan wat Hanna op die berg oor haar gesin geleer het.",
      "approach": "- Soek twee positiewe voorbeelde",
      "solution": "1. Hanna kon Yann beter verstaan of die baba se geboorte saam met die gesin beleef.\n2. Sy het Gavin leer ken en waardeer of haar verjaarsdag saam met die gesin geniet."
    },
    {
      "number": "2.8",
      "marks": 1,
      "clues": "- Wat het Sharon vir Hanna gewys?",
      "approach": "- Gee een rede",
      "solution": "1. Dat daar twee kante aan 'n saak is en dat Hanna nie so maklik moet oordeel nie."
    },
    {
      "number": "2.9",
      "marks": 4,
      "clues": "- Pas elke gebeurtenis by die gevolg.",
      "approach": "- Dink aan wat Gavin op die berg gedoen het",
      "solution": "2.9.1: B (Gavin het klere aangetrek wat hom soos 'n bosbouer laat lyk).\n2.9.2: C (Gavin het 'n diskodans op die tafel gedoen).\n2.9.3: A (Gavin het almal laat lag en van die reën laat vergeet).\n2.9.4: E (Gavin het geleer dat mense se behoeftes verskil)."
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
