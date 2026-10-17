#!/usr/bin/env node
/**
 * DBE Afrikaans FAL P2 — November 2025 — Vraag 2.10–2.20: Die Ongelooflike Avonture van Hanna Hoekom — Teks D
 * Practice questions are fresh (DESIGN-UNI-01), written in Afrikaans, same theme/skill as the exam item (LANG-EX-01/02).
 * aiExplanation is one entry per REAL printed sub-question with its real marks, derived from the memo in own words (AIEXP-08).
 * Every fitb declares keyboard_type 'text' (LANG-KB-01). Typed answers avoid á í ó ú à â (not on the keyboard); required
 * diacritics (ê ë é è ô ö û ü î ï ä) are fine and significant (LANG-KB-02).
 *
 * BASIS per practice question — P printed in the extract/poem tab, M printed in the memo, X taken from the other half of the same exam question (fresh angle), L language-paper skill, C CAPS:
 *   Q1: P: Teks D l.14-16
 *   Q2: P: Teks D l.7-8
 *   Q3: P: Teks D l.3-17
 *   Q4: P: Teks D l.10-17
 *   Q5: P: Teks D
 *
 *   node tools/validate-questions.js --script scripts/add-afrikaans-fal-2025-nov-p2-q4.js --curriculum temp/curriculum-vocab-afrikaans-fal.json
 *   node scripts/add-afrikaans-fal-2025-nov-p2-q4.js --dry-run
 *   node scripts/add-afrikaans-fal-2025-nov-p2-q4.js
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
  "name": "Vraag 2: Hanna Hoekom (2.10–2.20)",
  "syllabus": "dbe",
  "subject": "afrikaans_fal",
  "year": 2025,
  "paper": "nov_p2",
  "order": 4,
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
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q4/question_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q4/question_2.png"
  ],
  "memo_image_urls": [
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q4/memo_1.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q4/memo_2.png",
    "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q4/memo_3.png"
  ],
  "exam_question_marks": 17,
  "supplementary_materials": [
    {
      "type": "annexure",
      "label": "Teks D",
      "image_urls": [
        "https://media-dev.askmoreprepmore.app/exam_papers/dbe/afrikaans_fal/2025/nov_p2/q4/annexure_teks_d_1.png"
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
    "question": "Watter stylfiguur kom voor in: \"Iets wat my binnegoed laat saamtrek in 'n knoop\"?",
    "metadata": [
      "klanknabootsing",
      "metafoor",
      "personifikasie",
      "ironie",
      ""
    ],
    "answer": [
      "metafoor",
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
    "difficulty": 3,
    "exam_weight": 3,
    "clues": "- Hanna se gevoel word as 'n ding beskryf.\n- Daar is nie 'n woord soos \"soos\" of \"nes\" nie."
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
    "question": "Wat beteken: \"asof sy nou eers besef dat ek ook in die kamer is\"?",
    "metadata": [
      "Hanna se ma het nie gesien dat Hanna in die kamer was nie.",
      "Hanna het die kamer verlaat sonder dat haar ma dit gemerk het.",
      "Hanna se ma het vir 'n oomblik vergeet dat Hanna in die kamer is.",
      "Hanna se ma was kwaad omdat Hanna teen die muur gestaan het.",
      ""
    ],
    "answer": [
      "Hanna se ma het vir 'n oomblik vergeet dat Hanna in die kamer is.",
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
    "clues": "- Hanna staan steeds verstar teen die muur.\n- Wie het eers net op die baba gefokus?"
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
    "question": "Rangskik die gebeure in die volgorde waarin dit in die uittreksel voorkom.",
    "metadata": [
      "Mana sê die baba moet 'n naam met water in kry.",
      "Mana vra wat Hanna van haar sussie sê.",
      "Mana bedank Margot.",
      "Hanna fluister dat sy nie wil hê haar sussie moet seerkry nie.",
      ""
    ],
    "answer": [
      "Mana bedank Margot.",
      "Mana vra wat Hanna van haar sussie sê.",
      "Hanna fluister dat sy nie wil hê haar sussie moet seerkry nie.",
      "Mana sê die baba moet 'n naam met water in kry.",
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
    "clues": "- Volg die gesprek reël vir reël.\n- Die naam word die volgende oggend bespreek."
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
    "question": "Watter stelling oor die uittreksel is ONWAAR?",
    "metadata": [
      "Mana het Margot bedank vir haar hulp.",
      "Hanna het Margot gehelp om die naelstring te sny.",
      "Hanna het gefluister dat sy nie wil hê haar sussie moet seerkry nie.",
      "Mana wou die baba 'n naam gee wat met water te doen het.",
      ""
    ],
    "answer": [
      "Hanna het Margot gehelp om die naelstring te sny.",
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
    "clues": "- Wat doen Hanna toe Margot die groot skêr optel?\n- Toets elke stelling teen die uittreksel."
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
    "question": "Kies TWEE temas wat in die uittreksel na vore kom.",
    "metadata": [
      "Die waarde van gesinsondersteuning in 'n krisis",
      "Hoe gevaarlik berge vir toeriste en ander besoekers is",
      "Hoe 'n nuwe baba mense nader aan mekaar bring",
      "Die voordele van duur motors vir mense wat gaan reis",
      ""
    ],
    "answer": [
      "Die waarde van gesinsondersteuning in 'n krisis",
      "Hoe 'n nuwe baba mense nader aan mekaar bring",
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
    "clues": "- Kyk na hoe almal na die baba se geboorte reageer.\n- Twee opsies pas by die uittreksel."
  }
];

// ─── AI explanation — one entry per REAL printed sub-question, real marks (AIEXP-08) ───

const aiExplanation = {
  "sub_questions": [
    {
      "number": "2.10",
      "marks": 4,
      "clues": "- Dink aan die volgorde waarin die gebeure op die berg plaasvind.",
      "approach": "- Rangskik die vier gebeure",
      "solution": "1. Hanna het na Pampoen en Patat gaan soek.\n2. Sharon se pa het haar met 'n nuwe 4x4 kom aflaai.\n3. Tibo en Amos het Hanna se gedig gelees.\n4. Margot het Hanna mooigemaak vir haar verjaarsdag."
    },
    {
      "number": "2.11.1",
      "marks": 1,
      "clues": "- Let op die woord \"soos\".",
      "approach": "- Kies die stylfiguur",
      "solution": "1. 'n vergelyking."
    },
    {
      "number": "2.11.2",
      "marks": 1,
      "clues": "- Hoe voel almal oor die baba se geboorte?",
      "approach": "- Verduidelik die vergelyking",
      "solution": "1. Hulle was baie bly en opgewonde dat alles goed afgeloop het; dit was vir hulle 'n oorwinning."
    },
    {
      "number": "2.12.1",
      "marks": 1,
      "clues": "- Waarna verwys \"die ding\"?",
      "approach": "- Soek wat Margot deurgepraat het",
      "solution": "1. Die baba se geboorte (die geboorteproses)."
    },
    {
      "number": "2.12.2",
      "marks": 1,
      "clues": "- Wat het Margot vir Mana gedoen?",
      "approach": "- Gee een rede wat geloofwaardig is",
      "solution": "1. Margot het Mana bygestaan tydens die geboorte terwyl die ander bang was."
    },
    {
      "number": "2.13",
      "marks": 1,
      "clues": "- Dink aan die baba se naam en waarom dit gekies is.",
      "approach": "- Soek die naam of rede",
      "solution": "1. Mana het die baba Ditjie genoem; hulle wou 'n naam met water in hê."
    },
    {
      "number": "2.14",
      "marks": 1,
      "clues": "- Hoe voel Hanna oor haar sussie?",
      "approach": "- Kies die opsie wat by die uittreksel pas",
      "solution": "1. C (sy het dadelik lief geraak vir haar sussie)."
    },
    {
      "number": "2.15",
      "marks": 1,
      "clues": "- Wat doen Hanna toe sy haar sussie sien?",
      "approach": "- Verduidelik hoe die skrywer jou opgewonde laat voel",
      "solution": "1. Hanna kon nie ophou kyk nie en wou nie hê haar sussie moet ooit seerkry nie."
    },
    {
      "number": "2.16",
      "marks": 1,
      "clues": "- Hoe voel die gesin om Mana se bed?",
      "approach": "- Gee 'n rede waarom jy goed voel",
      "solution": "1. Die familie is saam en almal ondersteun mekaar; 'n nuwe lewe bring hoop."
    },
    {
      "number": "2.17",
      "marks": 1,
      "clues": "- Dink aan 'n krisis in jou eie lewe.",
      "approach": "- Verduidelik waarom jy kan identifiseer",
      "solution": "1. Almal het soms hulp nodig en 'n krisis bring mense nader aan mekaar."
    },
    {
      "number": "2.18",
      "marks": 1,
      "clues": "- Wat gebeur tussen Gavin en Hanna na die geboorte?",
      "approach": "- Soek die direkte gevolg",
      "solution": "1. Hulle kon gesels oor haar geboorte en Hanna het gehoor Gavin wou haar Fabienne noem."
    },
    {
      "number": "2.19",
      "marks": 2,
      "clues": "- Dink aan wat Margot op die berg gedoen en geleer het.",
      "approach": "- Soek twee positiewe gevolge",
      "solution": "1. Margot kon by haar seuns wees en haar verhouding met Yann verbeter.\n2. Sy kon bewys dat sy van hulp kan wees of betyds in Johannesburg wees vir haar rol."
    },
    {
      "number": "2.20",
      "marks": 1,
      "clues": "- Wat besluit Hanna aan die einde van die roman?",
      "approach": "- Verduidelik hoekom die tema pas",
      "solution": "1. Hanna het besef sy het Fabienne nie nodig nie en besluit om haar boek oor haar werklike lewe te skryf."
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
